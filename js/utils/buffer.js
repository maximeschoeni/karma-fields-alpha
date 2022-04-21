
KarmaFieldsAlpha.buffer = {};

KarmaFieldsAlpha.Buffer = class {

  constructor(root = "karma", ...path) {
    this.path = [root, ...path];
  }

  getObject() {
    // return KarmaFieldsAlpha.buffer;
    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.buffer, ...this.path) || {};
  }

  setObject(object) {
    // KarmaFieldsAlpha.buffer = object;
    // KarmaFieldsAlpha.buffer = object;
    return KarmaFieldsAlpha.DeepObject.assign(KarmaFieldsAlpha.buffer, object, ...this.path);
  }

  empty() {

    this.setObject({});
    // KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.buffer, ...this.path);
  }

  get(...path) {
    return KarmaFieldsAlpha.DeepObject.get(this.getObject(), ...path);
  }

  set(value, ...path) {
    let object = this.getObject();
    if (path.length) {
      KarmaFieldsAlpha.DeepObject.assign(object, value, ...path);
    } else {
      object = value;
    }
    this.setObject(object);
  }

  remove(...path) {
    let object = this.getObject();
    KarmaFieldsAlpha.DeepObject.remove(object, ...path);
    this.setObject(object);
  }

  has(...path) {
    return KarmaFieldsAlpha.DeepObject.has(this.getObject(), ...path);
  }

  merge(value, ...path) {
    const object = this.get(...path);
    KarmaFieldsAlpha.DeepObject.merge(object, value);
    this.set(object, ...path);
  }

}
