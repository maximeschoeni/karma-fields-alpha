
KarmaFieldsAlpha.field.form = class extends KarmaFieldsAlpha.field.container {


  // render() {
  //
  //
  //   return super.render();
  // }

  // getForm() {
  //
  //   return this;
  //
  // }

  getWild(driver, id, key) {

    return KarmaFieldsAlpha.server.queryValue(driver || this.getDriver(), id, key);

  }

  setWild(value, driver, id, key) {

    return KarmaFieldsAlpha.server.setValue(value, driver || this.getDriver(), id, key);

  }

  async submit() {

    await KarmaFieldsAlpha.server.submit();

    await this.render();

  }



  // getBody() {
  //
  //   // return new KarmaFieldsAlpha.field.form.single({
  //   //   children: [this.resource.body]
  //   // }, "body", this);
  //
  //
  //
  //   // return new KarmaFieldsAlpha.field.form.single({
  //   //   children: this.resource.children,
  //   //   ...this.resource.body
  //   // }, "body", this);
  //
  //   return this.createChild(this.resource.body, "body");
  //
	// }

  getBody() {

    return new KarmaFieldsAlpha.field.form.single(this.resource.body || {children: this.resource.children}, "body", this);

	}

  exportDefaults() {

    const response = new KarmaFieldsAlpha.Content();

    const defaultsParams = this.parseObject(this.resource.params || this.resource.body && this.resource.body.params || {}); // compat
    const defaultsFieldsParams = super.exportDefaults();

    if (defaultsParams.loading || defaultsFieldsParams.loading) {

      response.loading = true;

    } else {

      response.value = {...defaultsParams.toObject(), ...defaultsFieldsParams.toObject()};
    }

    return response;
  }

  queryParams() {

    console.error("deprecated");

    let params = this.params;

    if (!params) {

      params = new KarmaFieldsAlpha.Content();

      const defaults = this.exportDefaults();

      if (defaults.loading) {

        params.loading = true;

      } else {

        // KarmaFieldsAlpha.DeepObject.set(this.store, params.toObject(), "state", "fields", this.uid, "params");
        // KarmaFieldsAlpha.DeepObject.set(this.store, KarmaFieldsAlpha.Params.stringify(params.value), "state", "fields", this.uid, "paramstring");


        params.value = {...defaults.toObject(), ...this.getState("params")};
        params.string = KarmaFieldsAlpha.Params.stringify(params.value);

        this.params = params;

      }

    }

    return params;

  }


  queryDefaultParams() {

    const defaults = this.exportDefaults();

    if (!defaults.loading) {

      KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, defaults.toObject(), "state", "fields", this.uid, "defaultParams");
      // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, KarmaFieldsAlpha.Params.stringify(defaults.toObject()), "state", "fields", this.uid, "paramstring");

      this.updateParamstring();

    }

    return defaults;
  }


  getParams() {

    const defaultParams = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.server.store, "state", "fields", this.uid, "defaultParams");
    const params = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.server.store, "state", "fields", this.uid, "params");


    // return this.queryParams().toObject();

    // return this.params || {};

    return {...defaultParams, ...params};


  }

  getParamstring() {

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.server.store, "state", "fields", this.uid, "paramstring") || "";


    // const params = this.getParams();
    //
    // return KarmaFieldsAlpha.Params.stringify(params);

  }

  updateParamstring() {

    const params = this.getParams();
    const paramstring = KarmaFieldsAlpha.Params.stringify(params);

    KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, paramstring, "state", "fields", this.uid, "paramstring");

  }

  async setParams(params) {

    // delete this.params;

    await this.setState(params, "params");

    this.updateParamstring();

    await this.unselect();

  }

  getParam(key) {

    let value = this.getParams()[key];

    if (value === undefined) {

      return this.parent.getContent(key).value;

    } else {

      return value;

    }

  }

  async setParam(value, key) {

    const params = this.getParams() || {};

    if (params[key] !== value) {

      await this.setParams({...params, [key]: value});

    }

  }

  getContent(key) {

    let value = this.getParam(key);

    return new KarmaFieldsAlpha.Content(value);

  }

  async setValue(value, key) {

    await this.setParam(value, key);

  }


  getId() {

    if (this.resource.id) {

      return this.parse(this.resource.id);

    } else {

      return this.getContent("id");

    }

  }

  getContentAt(index, key) {

    const id = this.getId();

    if (id.loading) {

      return new KarmaFieldsAlpha.Loading();

    } else if (key === "id") {

      return id;

    } else {

      return this.getWild(this.getDriver(), id.toString(), key);

    }

  }

  async setValueAt(value, index, key) {

    const id = this.getId();

    if (!id.loading) {

      return this.setWild(value, this.getDriver(), id.toString(), key);

    }

  }

  *buildContent() {

    const params = this.queryDefaultParams();

    if (!params.loading) {

      yield* super.buildContent();

    }



		// yield* this.buildHeader();
		// yield* this.buildBody();
		// yield* this.buildFooter();

	}


  getDriver() {

    if (this.resource.driver) {

      return this.resource.driver;

    } else if (this.resource.body && this.resource.body.driver) { // compat

      return this.resource.body.driver;

    } else {

      return this.parent.getDriver();

    }

  }

}

KarmaFieldsAlpha.field.form.single = class extends KarmaFieldsAlpha.field.group {

  // async getId() {
  //
  //   let stateId = await this.getState("id");
  //
  //   if (stateId) {
  //
  //     return stateId;
  //
  //   } else {
  //
  //     let resourceId = await this.parse(this.resource.id);
  //
  //     if (resourceId.value) {
  //
  //       return resourceId;
  //
  //     } else {
  //
  //       let parentResourceId = await this.parse(this.parent.resource.id);
  //
  //       if (parentResourceId.value) {
  //
  //         return parentResourceId;
  //
  //       } else {
  //
  //         return this.parent.resource.params.id.toString();
  //
  //       }
  //     }
  //   }
  //
  // }
  //
  // async getContent(key) {
  //
  //   const id = await this.getId();
  //
  //   if (id.loading) {
  //
  //     const response = new KarmaFieldsAlpha.Content();
  //     response.loading = true;
  //     return response;
  //
  //   } else {
  //
  //     return this.parent.getContentById(id.toString(), key);
  //
  //   }
  //
  //
  //
  // }
  //
  // async setValue(value, key) {
  //
  //   const id = await this.getId();
  //
  //   if (!id.loading) {
  //
  //     await this.parent.setValueById(value, id.toString(), key);
  //
  //   }
  //
  // }

  // setContent(content, key) {
  //
  //   const value = content && content.value !== undefined ? content.value : content;
  //
  //   return this.setValue(content, key);
  //
  // }

  getContent(key) {

    return this.parent.getContentAt(this.id, key);

  }

  setValue(value, key) {

    return this.parent.setValueAt(value, this.id, key);

  }



  // getId() {
  //
  //   if (this.resource.id) {
  //
  //     return this.parse(this.resource.id);
  //
  //   } else {
  //
  //     return this.parent.getContent("id");
  //
  //   }
  //
  // }
  //
  // getContent(key) {
  //
  //   const id = this.getId();
  //
  //   if (id.loading) {
  //
  //     return new KarmaFieldsAlpha.Loading();
  //
  //   } else if (key === "id") {
  //
  //     return id;
  //
  //   } else {
  //
  //     return this.parent.getWild(undefined, id.toString(), key); // driver is optional
  //
  //   }
  //
  // }
  //
  // async setValue(value, key) {
  //
  //   const id = this.getId();
  //
  //   if (!id.loading) {
  //
  //     return this.parent.setWild(value, undefined, id.toString(), key); // driver is optional
  //
  //   }
  //
  // }

  build() {

    return {
      class: "form-single",
      child: super.build()
    };

  }


}



KarmaFieldsAlpha.field.form.header = class extends KarmaFieldsAlpha.field.container.header {

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

// KarmaFieldsAlpha.field.form.title = class extends KarmaFieldsAlpha.field.text {
//
//   constructor(resource, id, parent) {
//
//     super({
//       tag: "h1",
//       style: "flex-grow:1",
//       class: "ellipsis",
//       content: "Title",
//       ...resource
//     }, id, parent);
//
//   }
//
//   getContent() {
//
//     const content = this.getResource("title");
//
//     return this.parse(content || this.resource.content);
//
//   }
//
// }

// KarmaFieldsAlpha.field.form.close = class extends KarmaFieldsAlpha.field.button {
//   constructor(resource, id, parent) {
//     super({
//       dashicon: "no",
//       title: "Close",
//       request: ["close"],
//       ...resource
//     }, id, parent);
//   }
// }



KarmaFieldsAlpha.field.form.footer = class extends KarmaFieldsAlpha.field.container.footer {

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

// KarmaFieldsAlpha.field.form.save = class extends KarmaFieldsAlpha.field.button {
//
//   constructor(resource, id, parent) {
//     super({
//       task: ["submit"],
//       title: "Save",
//       text: "Save",
//       enabled: ["request", "hasDelta"],
//       primary: true,
//       ...resource
//     }, id, parent);
//   }
//
// }
