
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

    return new KarmaFieldsAlpha.field.form.single(this.resource.body, "body", this);

	}

  getValueById(id, key) {

    if (key === "id") {

      return new KarmaFieldsAlpha.Content(id);

    } else {

      const driver = this.getDriver();

      return KarmaFieldsAlpha.server.queryValue(driver, id, key);

    }

  }

  setValueById(value, id, key) {

    const driver = this.getDriver();

    return KarmaFieldsAlpha.server.setValue(value, driver, id, key);

  }


  getId() {

    let stateId = this.getState("id");

    if (stateId) {

      return new KarmaFieldsAlpha.Content(stateId);

    } else if (this.resource.id) {

      return this.parse(this.resource.id);

    } else if (this.resource.params.id) {

      return new KarmaFieldsAlpha.Content(this.resource.params.id);

    }

  }

  getContent(key) {

    const id = this.getId();

    if (id.loading) {

      return new KarmaFieldsAlpha.Loading();

    } else {

      return this.getValueById(id.toString(), key);

    }



  }

  async setValue(value, key) {

    const id = this.getId();

    if (!id.loading) {

      await this.setValueById(value, id.toString(), key);

    }

  }

  getDriver() {

    return this.resource.driver || this.resource.body && this.resource.body.driver; // compat

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
