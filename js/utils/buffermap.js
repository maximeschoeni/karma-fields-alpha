
// KarmaFieldsAlpha.buffermap = new Map();

KarmaFieldsAlpha.BufferMap = class {

  constructor(...path) {
    this.path = path;
  }

  getObject() {
    return KarmaFieldsAlpha.buffermap || new Map();
  }

  setObject(object) {
    KarmaFieldsAlpha.buffermap = object;
  }

  get(...path) {
    let object = this.getObject();
    if (this.path.length || path.length) {
      return KarmaFieldsAlpha.DeepMap.get(object, ...this.path, ...path);
    } else {
      return object;
    }
  }

  set(value, ...path) {
    let object = this.getObject();
    if (this.path.length || path.length) {
      KarmaFieldsAlpha.DeepMap.assign(object, value, ...this.path, ...path);
    } else {
      object = value;
    }
    this.setObject(object);
  }

  remove(...path) {
    let object;
    if (this.path.length || path.length) {
      object = this.getObject();
      KarmaFieldsAlpha.DeepMap.remove(object, ...this.path, ...path);
    } else {
      object = new Map();
    }
    this.setObject(object);
  }

  has(...path) {
    let object = this.getObject();
    if (this.path.length || path.length) {
      return KarmaFieldsAlpha.DeepMap.has(object, ...this.path, ...path);
    } else {
      return true;
    }
  }

}
