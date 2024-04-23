
KarmaFieldsAlpha.field.form = class extends KarmaFieldsAlpha.field {

  getDriver() {

    return this.resource.driver || this.resource.body && this.resource.body.driver; // compat

  }

  build() {

    return this.getChild("single").build();

  }


  getChild(index) {

    return this.createChild({
      type: "single",
      id: this.resource.id,
      children: this.resource.children
    }, index);

  }

  getShuttle() {

    if (!this.shuttle) {

      const driver = this.getDriver();

      let shuttle = KarmaFieldsAlpha.Store.get("shuttles", driver, undefined);

      if (!shuttle) {

        shuttle = new KarmaFieldsAlpha.Shuttle(driver);

        shuttle.from = "post";
        shuttle.useCache = this.resource.cache || false;

        KarmaFieldsAlpha.Store.set(shuttle, "shuttles", driver, undefined);

      }

      this.shuttle = shuttle;

    }

    return this.shuttle;
  }


  getContentById(id, key) {

    return this.getValueById(id, key);

  }

  getValueById(id, key) {

    const value = new KarmaFieldsAlpha.Content();

    if (key === "id") {

      value.value = id;
      return value;

    }

    let shuttle = this.getShuttle();

    if (shuttle) {

      key = shuttle.getAlias(key);

      const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", shuttle.driver, id, key);
      const current = KarmaFieldsAlpha.Store.get("vars", "remote", shuttle.driver, id, key);

      if (delta) {

        value.value = delta;
        value.modified = !current || !KarmaFieldsAlpha.DeepObject.equal(delta, current);

      } else if (current) {

        value.value = current;

      } else {

        if (shuttle.complete) {

          value.value = [];
          value.notFound = true;

        } else {

          if (shuttle.cached) {

            value.value = KarmaFieldsAlpha.Store.get("vars", "cache", shuttle.driver, id, key);
            value.cache = true;

          } else {

            value.loading = true;

          }

          // if (shuttle.paramstring === undefined && shuttle.started && !shuttle.requestedIds.has(id)) {
          //
          //   shuttle = new KarmaFieldsAlpha.Shuttle(shuttle.driver);
          //
          //   KarmaFieldsAlpha.Store.set(shuttle, "shuttles", shuttle.driver, undefined);
          //
          //   this.shuttle = shuttle;
          //
          // }

          if (shuttle.paramstring === undefined && shuttle.queries.has("query") && !shuttle.requestedIds.has(id)) {

            shuttle.reset();

          }

          shuttle.request(id, key);

          if (shuttle.idle) {

            const work = shuttle.mix(true);
            KarmaFieldsAlpha.Jobs.add(work);

            shuttle.idle = false;

          }

        }

      }

    } else {

      value.loading = true;
    }

    return value;

  }

  setValueById(value, id, key) {

    const shuttle = this.getShuttle();

    // todo: verify it is not adding item (because there will be token into it)

    // while (shuttle.isAdding) {
    //
    //   yield;
    //
    // }

    if (shuttle) {

      key = shuttle.getAlias(key);

      const current = KarmaFieldsAlpha.Store.get("vars", "remote", shuttle.driver, id, key);
      const delta = new KarmaFieldsAlpha.Content(value).toArray();



      if (typeof id === "symbol" || id[0] === "_") { // is token

        KarmaFieldsAlpha.Store.set(delta, "buffer", "state", "delta", "vars", "remote", shuttle.driver, id, key); // do not update history

      } else {

        KarmaFieldsAlpha.Store.Delta.set(delta, "vars", "remote", shuttle.driver, id, key); // -> update history

      }

    }

  }



  getContent(key) {

    return this.getContentById(this.resource.id, key);

    // const content = new KarmaFieldsAlpha.Content();
    // const shuttle = this.getShuttle();
    //
    // if (!shuttle) {
    //
    //   content.loading = true;
    //
    // } else {
    //
    //   content.value = shuttle.params[key];
    //
    // }
    //
    // return content;

  }

  setValue(value, key) { // deprecated. Use setValue.

    // this.setValue(content.value || content, key);

    this.setContentById(value, this.resource.id, key);

  }

  setValue(value, key) {

    this.setState(value, "params", key);

  }

  getParam(key) {

    return this.getContent(key);

  }

  setParam(value, key) {

    this.setValue(value, key);

  }



  isCurrentLayer() {

    const currentLayer = KarmaFieldsAlpha.Store.Layer.getCurrent();

    return currentLayer && currentLayer.table === this.parent.id;

  }


  async *submit() {

    // const ids = this.getSelectedIds();

    const body = this.getChild("body");

    if (body && body.removeSelection) {

      body.removeSelection();

    }

    const delta = this.getDelta();

    for (let driver in delta) {

      yield;

      await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, delta[driver]);

      for (let id in delta[driver]) {

        for (let key in delta[driver][id]) {

          KarmaFieldsAlpha.Store.set(delta[driver][id][key], "vars", "remote", driver, id, key);

        }

      }

      // remove from delta buffer without updating history
      KarmaFieldsAlpha.Store.Buffer.remove("state", "delta", "vars", "remote", driver);


      // reset shuttles
      const shuttles = KarmaFieldsAlpha.Store.get("shuttles", driver);

      if (shuttles) {

        for (let paramstring in shuttles) {

          const shuttle = shuttles[paramstring];

          yield* shuttle.mix();

          // shuttle.init();
          //
          // shuttle.send();

        }

      }



      await KarmaFieldsAlpha.Database.Queries.removeDriver(driver);

    }

    // if (ids.length) {
    //
    //   this.selectByIds(ids);
    //
    // }

  }

  isValueModified(value, driver, id, key) {

    let current = KarmaFieldsAlpha.Store.get("vars", "remote", driver, id, key);

    return !KarmaFieldsAlpha.DeepObject.equal(value, current);

  }

  getDelta() {

    const output = {};
    const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");

    if (delta) {

      for (let driver in delta) {

        for (let id in delta[driver]) {

          for (let key in delta[driver][id]) {

            if (this.isValueModified(delta[driver][id][key], driver, id, key)) {

              KarmaFieldsAlpha.DeepObject.set(output, delta[driver][id][key], driver, id, key);

            }

          }

        }

      }

    }

    return output;

  }

  hasDelta() {

    const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");

    if (delta) {

      for (let driver in delta) {

        for (let id in delta[driver]) {

          for (let key in delta[driver][id]) {

            if (this.isValueModified(delta[driver][id][key], driver, id, key)) {

              return new KarmaFieldsAlpha.Content(true);

            }

          }

        }

      }

    }

    return new KarmaFieldsAlpha.Content(false);

  }




}

KarmaFieldsAlpha.field.form.single = class extends KarmaFieldsAlpha.field.group {


  getContent(key) {

    return this.parent.getContentById(this.resource.id, key);

  }

  setValue(value, key) {

    this.parent.setValueById(value, this.resource.id, key);

  }

  setContent(value, key) {

    this.parent.setValueById(content && content.value || value, this.resource.id, key);

  }


}


//
//
//
// KarmaFieldsAlpha.field.form = class extends KarmaFieldsAlpha.field.grid {
//
//   // getParams() {
//   //
//   //   return new KarmaFieldsAlpha.Content({ids: this.resource.id});
//   //
//   // }
//
//   build() {
//     // return this.createChild({
//     //   type: "single",
//     //   children: this.resource.children
//     // }, 0).build();
//
//     return this.getChild(0).build();
//   }
//
//
//
// }
//
// KarmaFieldsAlpha.field.single = class extends KarmaFieldsAlpha.field.group {
//
//   getContent(key) {
//
//
//     return this.parent.getContent(this.id, key);
//
//   }
//
//   setContent(value, key) {
//
//     this.parent.setContent(value, this.id, key);
//
//   }
// }
