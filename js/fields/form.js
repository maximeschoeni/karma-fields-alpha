
KarmaFieldsAlpha.field.form = class extends KarmaFieldsAlpha.field.group {

  // getId() {
  //
  //   if (this.resource.id) {
  //
  //     return this.parse(this.resource.id);
  //
  //   } else {
  //
  //     return this.parent.getContent('id');
  //
  //   }
  //
  // }
  //
  // getIndex() {
  //
  //   return this.resource.index;
  //
  // }
  //
  // getContent(key) {
  //   // const driver = this.getDriver();
  //   //
  //   // return KarmaFieldsAlpha.Query.getValue(driver, ...path);
  //
  //   const driver = this.getDriver();
  //   const id = this.getId();
  //
  //   if (id.loading) {
  //
  //     return new KarmaFieldsAlpha.Content.Request();
  //
  //   }
  //
  //   return new KarmaFieldsAlpha.Content.Value(driver, id.toString(), key);
  //
  // }
  // //
  // // setContent(content, ...path) {
  // //
  // //   const driver = this.getDriver();
  // //
  // //   KarmaFieldsAlpha.Store.State.set(content.toArray(), driver, ...path);
  // //
  // // }
  // //
  // // removeContent(content, ...path) {
  // //
  // //   const driver = this.getDriver();
  // //
  // //   KarmaFieldsAlpha.Store.State.remove(driver, ...path);
  // //
  // // }
  //
  // setContent(content, key) {
  //
  //   const driver = this.getDriver();
  //   const id = this.getId();
  //
  //   if (!id.loading) {
  //
  //     key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
  //     KarmaFieldsAlpha.Store.Delta.set(content.toArray(), "vars", driver, id.toString(), key);
  //
  //   }
  //
  // }
  //
  // removeContent(key) {
  //
  //   const driver = this.getDriver();
  //   const id = this.getId();
  //
  //   if (!id.loading) {
  //
  //     key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
  //     KarmaFieldsAlpha.Store.Delta.set([], "vars", driver, id.toString(), key);
  //
  //   }
  //
  // }
  //
  // getDriver() {
  //
  //   return this.resource.driver;
  //
  // }
  //
  // submit() {
  //
  //   KarmaFieldsAlpha.Query.sync();
  //
  //   this.request("render");
  //
  // }


}
