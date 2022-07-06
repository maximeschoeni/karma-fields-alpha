
KarmaFieldsAlpha.DeepMap = class {

  static get(object, key, ...path) {
    if (key !== undefined) {
  		if (object && object.constructor === Map) {
  			return object && this.get(object.get(key), ...path);
  		}
  	} else {
  		return object;
  	}
  };

  static assign(object, value, key, ...path) {
    if (key !== undefined) {
      if (path.length > 0) {
        if (!object.has(key)) {
          object.set(key, new Map());
        }
        this.assign(object.get(key), value, ...path);
      } else {
        object.set(key, value);
      }
    }
  }

  static remove(object, key, ...path) {
    if (key !== undefined && object) {
      if (path.length > 0) {
        this.remove(object.get(key), ...path);
      } else {
        object.delete(key);
      }
    }
  }

  static has(object, key, ...path) {
    if (key !== undefined && object.has(key)) {
      if (path.length > 0) {
        return this.has(object.get(key), ...path);
      } else {
        return object.has(key);
      }
    }
    return false;
  };

}
