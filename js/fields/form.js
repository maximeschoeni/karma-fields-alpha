
KarmaFieldsAlpha.field.form = class extends KarmaFieldsAlpha.field.container {

  getId() {

    return this.resource.id;

  }

  getIndex() {

    return this.resource.index;

  }

  getContent(...path) {

    const driver = this.getDriver();

    return KarmaFieldsAlpha.Query.getValue(driver, ...path);

  }

  setContent(content, ...path) {

    const driver = this.getDriver();

    KarmaFieldsAlpha.Store.State.set(content.toArray(), driver, ...path);

  }

  removeContent(content, ...path) {

    const driver = this.getDriver();

    KarmaFieldsAlpha.Store.State.remove(driver, ...path);

  }

  getDriver() {

    return this.resource.driver;

  }

  submit() {

    KarmaFieldsAlpha.Query.sync();

    this.request("render");

  }


}
