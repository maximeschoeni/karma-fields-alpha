
KarmaFieldsAlpha.field.form = class extends KarmaFieldsAlpha.field {

  getParams() {

    const params = this.parse(this.resource.params || this.resource.body && this.resource.body.params); // compat

    if (!params.loading) {

      params.value = {...params.toObject(), ...this.getState("params")};

    }

    return params;
  }

  queryParam(key) { // cannot name getParam for compat reason

    const params = this.getParams();

    const response = new KarmaFieldsAlpha.Content();

    if (params.loading) {

      response.loading = true;

    } else {

      response.value = params.toObject()[key];

    }

    return response;

  }

  newChild(id) {

    if  (id === "header") {

      if (this.resource.header && this.resource.header.type === "header") {

        return new KarmaFieldsAlpha.field.table.header(this.resource.header, "header", this);

      } else {

        return new KarmaFieldsAlpha.field.group(this.resource.header, "header", this);

      }

    } else if (id === "footer") {

      return new KarmaFieldsAlpha.field.table.footer(this.resource.footer, "footer", this);

    } else if (id === "body") {

      // return new KarmaFieldsAlpha.field[this.resource.body.type]({
      //   sortable: this.resource.sortable,
      //   ...this.resource.body
      // }, "body", this);

      return this.getBody();

    }

  }

  getBody(index) {

    return new KarmaFieldsAlpha.field.form.single({
      // id: this.resource.id,
      children: this.resource.children, // compat
      display: this.resource.display,
      ...this.resource.body
    }, "body", this);

  }

  getChild(index, ...path) {

    let child = this.newChild(index);

    if (child && path.length) {

      return child.getChild(...path);

    }

    return child;

  }

  *buildParts() {

    if (this.resource.header) {

      yield {
        class: "karma-header table-header table-main-header simple-buttons",
        child: this.getChild("header").build()
      };

    }

    yield {
      class: "table-body form-body",
      child: this.getChild("body").build()
    };

    if (this.resource.footer) {

      yield {
        class: "table-footer table-control",
        child: this.getChild("footer").build(),
        update: footer => {
          const isLoading = this.request("hasTask");
          footer.element.classList.toggle("loading", Boolean(isLoading));
        }
      };

    }

  }



  build() {

    return {
      class: "table-field",
      children: [
        {
          class: "mixed-content",
          init: node => {
            node.element.innerHTML = "[mixed content]";
          },
          update: node => {
            node.element.classList.add("hidden");
          }
        },
        {
          class: "karma-field-table",
          init: node => {
            node.element.style.width = this.resource.width || "100%";
          },
          update: node => {

          },
          children: [
            ...this.buildParts()
          ]
        }
      ]
    };

  }

  getDriver() {

    return this.resource.driver || this.resource.body && this.resource.body.driver; // compat

  }

  // build() {
  //
  //   return this.getChild("single").build();
  //
  // }


  // getChild(index) {
  //
  //   return this.createChild({
  //     type: "single",
  //     id: this.resource.id,
  //     children: this.resource.children,
  //     display: this.resource.display
  //   }, index);
  //
  // }

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

    // return this.getContentById(this.resource.id, key);

    // return this.getState(key);

    const content = new KarmaFieldsAlpha.Content();
    content.value = this.getState(key);

    return content;

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

  // setValue(value, key) { // deprecated. Use setValue.
  //
  //   // this.setValue(content.value || content, key);
  //
  //   this.setContentById(value, this.resource.id, key);
  //
  // }

  setValue(value, key) {

    this.setState(value, "params", key);

  }

  getParam(key) {

    // const content = new KarmaFieldsAlpha.Content();
    // content.value = this.getState(key);
    //
    // return content;


    return this.getState(key);

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

  getId() {



    // const id = this.resource.id || this.parent.getParam("id");
    //
    // console.log(id);
    //
    //
    // return this.parse(id);

    const id = this.parent.queryParam("id");



    return id;

  }

  getContent(key) {

    // if (this.resource.id) { // compat
    //
    //   return this.parent.getContentById(this.resource.id, key);
    //
    // }
    //
    // const param = this.parent.getParam("id");
    // const request = this.parse(param);
    // // const response = new KarmaFieldsAlpha.Content();
    //
    // if (request.loading) {
    //
    //   return request;
    //
    // } else {
    //
    //   return this.parent.getContentById(request.toString(), key);
    //
    // }


    // console.log(this.resource.id, key, this.parent.getContent("id"));

    const request = this.getId();

    if (request.loading) {

      return request;

    } else {

      return this.parent.getContentById(request.toString(), key);

    }

  }

  setValue(value, key) {

    const request = this.getId();

    if (!request.loading) {

      this.parent.setValueById(value, request.toString(), key);

    }

    // this.parent.setValueById(value, this.resource.id, key);

  }

  setContent(content, key) {

    const value = content && content.value !== undefined ? content.value : content;

    this.setValue(content, key);

  }


}



KarmaFieldsAlpha.field.form.header = class extends KarmaFieldsAlpha.field.group {

  constructor(resource, id, parent) {

    super({
      display: "flex",
      children: [
        "title",
        "close"
      ],
      ...resource
    }, id, parent);

  }


}

KarmaFieldsAlpha.field.form.title = class extends KarmaFieldsAlpha.field.text {

  constructor(resource, id, parent) {

    super({
      tag: "h1",
      style: "flex-grow:1",
      class: "ellipsis",
      content: "Title",
      ...resource
    }, id, parent);

  }

  getContent() {

    const content = this.getResource("title");

    return this.parse(content || this.resource.content);

  }

}

KarmaFieldsAlpha.field.form.close = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      dashicon: "no",
      title: "Close",
      request: ["close"],
      ...resource
    }, id, parent);
  }
}



KarmaFieldsAlpha.field.form.footer = class extends KarmaFieldsAlpha.field.group {

  constructor(resource, id, parent) {

    super({
      display: "flex",
      children: [
        "save"
      ],
      ...resource
    }, id, parent);

  }

}

KarmaFieldsAlpha.field.form.save = class extends KarmaFieldsAlpha.field.button {

  constructor(resource, id, parent) {
    super({
      task: ["submit"],
      title: "Save",
      text: "Save",
      enabled: ["request", "hasDelta"],
      primary: true,
      ...resource
    }, id, parent);
  }

}
