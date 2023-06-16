
KarmaFieldsAlpha.buffer = {};

KarmaFieldsAlpha.Buffer = class {

  static getObject() {
    return KarmaFieldsAlpha.buffer || {};
  }

  static setObject(object) {
    KarmaFieldsAlpha.buffer = object;
  }

  static get(...path) {
    let object = this.getObject();
    return KarmaFieldsAlpha.DeepObject.get(object, ...this.path, ...path);
  }

  static set(value, ...path) {
    let object = this.getObject();
    KarmaFieldsAlpha.DeepObject.set(object, value, ...this.path, ...path);
    this.setObject(object);
  }

  static remove(...path) {
    let object = this.getObject();
    KarmaFieldsAlpha.DeepObject.remove(object, ...this.path, ...path);
    this.setObject(object);
  }

  static merge(value, ...path) {
    const object = this.get(...path) || {};
    KarmaFieldsAlpha.DeepObject.merge(object, value);
    this.set(object, ...path);
  }

  static equal(value, ...path) {
    const object = this.get(...path) || {};
    return KarmaFieldsAlpha.DeepObject.equal(object, value);
  }




  // constructor(...path) {
  //   this.path = path;
  // }
  //
  // getObject() {
  //   return KarmaFieldsAlpha.buffer || {};
  // }
  //
  // setObject(object) {
  //   KarmaFieldsAlpha.buffer = object;
  // }
  //
  // empty() {
  //   this.remove();
  // }
  //
  // get(...path) {
  //   let object = this.getObject();
  //   return KarmaFieldsAlpha.DeepObject.get(object, ...this.path, ...path);
  // }
  //
  // set(value, ...path) {
  //   let object = this.getObject();
  //   KarmaFieldsAlpha.DeepObject.set(object, value, ...this.path, ...path);
  //   this.setObject(object);
  // }
  //
  // remove(...path) {
  //   let object = this.getObject();
  //   KarmaFieldsAlpha.DeepObject.remove(object, ...this.path, ...path);
  //   this.setObject(object);
  // }
  //
  // merge(value, ...path) {
  //   const object = this.get(...path) || {};
  //   KarmaFieldsAlpha.DeepObject.merge(object, value);
  //   this.set(object, ...path);
  // }
  //
  // clean(...path) {
  //   let object = this.get(...path) || {};
  //   object = KarmaFieldsAlpha.DeepObject.filter(object, item => item !== undefined && item !== null, ...path);
  //   this.set(object, ...path);
  // }

}
