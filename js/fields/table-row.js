KarmaFieldsAlpha.fields.tableRow = class extends KarmaFieldsAlpha.fields.field {

  constructor(...args) {
    super(...args);

  }


  async set(value, ...path) {

    await this.super.set(value, this.resource.index || 0, ...path);

  }

  // fetchValue(expectedType, key, ...path) {
  //
  //   if (key === "id" && !path.length) {
  //     return this.resource.key;
  //   }
  //
  //   return super.fetchValue(null, key, ...path);
  // }

  async get(...path) {

    return super.get(this.resource.index || 0, ...path);

  }

  // getChildByIndex(index) {
  //
  //   return this.children.find(child => child.resource.index === index);
  //
  // }

  // getValue(key, ...path) {
  //
  //   if (key === "id" && !path.length) {
  //     return this.resource.key;
  //   }
  //
  //   return super.getValue(key, ...path);
  // }


}
