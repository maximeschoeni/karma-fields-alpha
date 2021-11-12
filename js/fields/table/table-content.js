
KarmaFieldsAlpha.fields.table.tableContent = class extends KarmaFieldsAlpha.fields.form {

  async edit() {
    await this.table.renderFooter();
  };

  // async fetchValue(expectedType, ...path) {
  //   let value;
  //
  //   if (expectedType === "array") {
  //     value = await KarmaFieldsAlpha.Gateway.getArrayValue(this.table.queriedIds, this.resource.driver, ...path);
  //
  //     if (value) {
  //       return value;
  //     }
  //   }
  //
  //   return super.fetchValue(expectedType, ...path);
  // };

}
