
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

  async setContent(content, ...path) {

    const driver = this.getDriver();

    await KarmaFieldsAlpha.Store.State.set(content.toArray(), driver, ...path);

  }

  // getValue(...path) {
  //
  //   // return KarmaFieldsAlpha.Store.get("delta", this.resource.driver, this.resource.id, ...path) || KarmaFieldsAlpha.Query.getValue(this.resource.driver, this.resource.id, ...path);
  //
  //   const id = this.getId();
  //
  //   return KarmaFieldsAlpha.Query.getValue(this.resource.driver, id, ...path);
  //
	// }



  // queryValue(...path) {
  //
  //   // return KarmaFieldsAlpha.Store.get("delta", this.resource.driver, this.resource.id, ...path) || KarmaFieldsAlpha.Query.getValue(this.resource.driver, this.resource.id, ...path);
  //
  //   const id = this.getId();
  //
  //   return KarmaFieldsAlpha.Query.getValue(this.resource.driver, id, ...path);
  //
	// }

  // // -> same as grid !
	// setValue(value, ...path) {
  //
  //   value = KarmaFieldsAlpha.Type.toArray(value);
  //
  //   const id = this.getId();
  //
  //   KarmaFieldsAlpha.Store.setValue(value, this.resource.driver, id, ...path)
  //
  //   this.render();
  //
	// }

  // // -> same as grid
  // modified(...path) {
  //
  //   // return !KarmaFieldsAlpha.DeepObject.include(KarmaFieldsAlpha.Query.vars, KarmaFieldsAlpha.Store.get("delta", this.resource.driver, this.resource.id, ...path), this.resource.driver, this.resource.id, ...path);
  //
  //   const id = this.getId();
  //
  //   return !KarmaFieldsAlpha.DeepObject.include(KarmaFieldsAlpha.Query.vars, KarmaFieldsAlpha.Store.get("delta", this.resource.driver, id, ...path), this.resource.driver, id, ...path);
  //
  // }

  getDriver() {

    return this.resource.driver;

  }

  submit() {

    KarmaFieldsAlpha.Query.sync();

    this.request("render");

  }


}
