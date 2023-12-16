
KarmaFieldsAlpha.field.form = class extends KarmaFieldsAlpha.field.container {

  getId() {

    return this.resource.id;

  }

  getIndex() {

    return this.resource.index;

  }

  getContent(key) {

    // const driver = this.getDriver();
    //
    // return KarmaFieldsAlpha.Query.getValue(driver, ...path);

    const driver = this.getDriver();
    const id = this.getId();

    return new KarmaFieldsAlpha.Content.Value(driver, id, key);

  }
  //
  // setContent(content, ...path) {
  //
  //   const driver = this.getDriver();
  //
  //   KarmaFieldsAlpha.Store.State.set(content.toArray(), driver, ...path);
  //
  // }
  //
  // removeContent(content, ...path) {
  //
  //   const driver = this.getDriver();
  //
  //   KarmaFieldsAlpha.Store.State.remove(driver, ...path);
  //
  // }

  setContent(content, key) {

    const driver = this.getDriver();
    const id = this.getId();

    // KarmaFieldsAlpha.Store.Delta.set(content.toArray(), driver, id, key);

    key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
    KarmaFieldsAlpha.Store.Delta.set(content.toArray(), driver, id, key);

  }

  removeContent(key) {

    const driver = this.getDriver();
    const id = this.getId();

    key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
    KarmaFieldsAlpha.Store.Delta.set([], driver, id, key);

  }

  getDriver() {

    return this.resource.driver;

  }

  submit() {

    KarmaFieldsAlpha.Query.sync();

    this.request("render");

  }


}
