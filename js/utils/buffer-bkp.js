
KarmaFieldsAlpha.Buffer = class {

  getObject() {
    return this.object || {};
  }

  setObject(object) {
    this.object = object;
  }

  empty() {
    this.remove();
  }

  get(...path) {
    if (path.length) {
      return KarmaFieldsAlpha.DeepObject.get(this.getObject(), ...path);
    } else {
      return [this.getObject()];
    }
  }

  set(value, ...path) {
    let object = this.getObject();
    if (path.length) {
      KarmaFieldsAlpha.DeepObject.assign(object, value, ...path);
    } else {
      object = value[0];
    }
    this.setObject(object);
  }

  remove(...path) {
    let object = this.getObject();
    if (path.length) {
      KarmaFieldsAlpha.DeepObject.remove(object, ...path);
    } else {
      object = {};
    }
    this.setObject(object);
  }

  merge(value) {
    const object = this.getObject();
    KarmaFieldsAlpha.DeepObject.merge(object, value);
    this.setObject(object);
  }

}
