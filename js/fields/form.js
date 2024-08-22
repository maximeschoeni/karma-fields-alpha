
KarmaFieldsAlpha.field.form = class extends KarmaFieldsAlpha.field.container {


  // render() {
  //
  //
  //   return super.render();
  // }

  getWild(driver, id, key) {

    return KarmaFieldsAlpha.server.queryValue(driver || this.getDriver(), id, key);

  }


  getBody() {

    // return new KarmaFieldsAlpha.field.form.single({
    //   children: [this.resource.body]
    // }, "body", this);



    // return new KarmaFieldsAlpha.field.form.single({
    //   children: this.resource.children,
    //   ...this.resource.body
    // }, "body", this);

    return this.createChild(this.resource.body, "body");

	}

  // *buildBody() {
  //
	// 	const body = this.getBody();
  //
  //   yield {
  //     class: "table-body",
  //     child: {
  //       class: "form-single",
  //       child: body.build()
  //     }
  //   };
  //
	// }


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

    let params = this.params;

    if (!params) {

      params = new KarmaFieldsAlpha.Content();

      const defaults = this.exportDefaults();

      if (defaults.loading) {

        params.loading = true;

      } else {

        params.value = {...defaults.toObject(), ...this.getState("params")};
        params.string = KarmaFieldsAlpha.Params.stringify(params.value);

        this.params = params;

      }

    }

    return params;

  }


  getParams() {

    return this.queryParams().toObject();

  }

  async setParams(params) {

    delete this.params;

    await this.setState(params, "params");

  }

  getParam(key) {

    // return this.getParams()[key];

    let value = this.getParams()[key];

    if (value === undefined) {

      return this.parent.getContent(key).value;

    } else {

      return value;

    }

  }

  async setParam(value, key) {

    await this.setParams({...this.getParams(), [key]: value});

  }


  getContent(key) {

    let value = this.getParam(key);

    return new KarmaFieldsAlpha.Content(value);

    // if (value === undefined) {
    //
    //   return this.parent.getContent(key);
    //
    // } else {
    //
    //   return new KarmaFieldsAlpha.Content(value);
    //
    // }

  }

  async setValue(value, key) {

    await this.setParam(value, key);

  }



  // getValueById(id, key) {
  //
  //   if (key === "id") {
  //
  //     return new KarmaFieldsAlpha.Content(id);
  //
  //   } else {
  //
  //     const driver = this.getDriver();
  //
  //     return KarmaFieldsAlpha.server.queryValue(driver, id, key);
  //
  //   }
  //
  // }
  //
  // setValueById(value, id, key) {
  //
  //   const driver = this.getDriver();
  //
  //   return KarmaFieldsAlpha.server.setValue(value, driver, id, key);
  //
  // }
  //
  //
  // getId() {
  //
  //   let stateId = this.getState("id");
  //
  //   if (stateId) {
  //
  //     return new KarmaFieldsAlpha.Content(stateId);
  //
  //   } else if (this.resource.id) {
  //
  //     return this.parse(this.resource.id);
  //
  //   } else if (this.resource.params && this.resource.params.id) { // deprecated
  //
  //     return new KarmaFieldsAlpha.Content(this.resource.params.id);
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
  //   } else {
  //
  //     return this.getValueById(id.toString(), key);
  //
  //   }
  //
  //
  //
  // }
  //
  // async setValue(value, key) {
  //
  //   const id = this.getId();
  //
  //   if (!id.loading) {
  //
  //     await this.setValueById(value, id.toString(), key);
  //
  //   }
  //
  // }

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

  getId() {

    if (this.resource.id) {

      return this.parse(this.resource.id);

    } else {

      return this.parent.getContent("id");

    }

  }

  getContent(key) {

    const id = this.getId();

    if (id.loading) {

      return new KarmaFieldsAlpha.Loading();

    } else if (key === "id") {

      return id;

    } else {

      const driver = this.getDriver();

      return KarmaFieldsAlpha.server.queryValue(driver, id.toString(), key);

    }

  }

  async setValue(value, key) {

    const id = this.getId();

    if (!id.loading) {

      const driver = this.getDriver();

      await KarmaFieldsAlpha.server.setValue(value, driver, id.toString(), key);

    }

  }

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
