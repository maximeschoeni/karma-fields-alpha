
KarmaFieldsAlpha.DeepObject = class {

  static get(object, key, ...path) {
    if (key !== undefined) {
  		if (object) {
  			return object && this.get(object[key], ...path);
  		}
  	} else {
  		return object;
  	}
  };

  static assign(object, value, key, ...path) {
    if (key !== undefined) {
      if (path.length > 0) {
        if (!object[key]) {
          object[key] = {};
        }
        this.assign(object[key], value, ...path);
      } else {
        object[key] = value;
      }
    }
  }

  static remove(object, key, ...path) {
    if (key !== undefined && object[key]) {
      if (path.length > 0) {
        this.remove(object[key], ...path);
      } else {
        object[key] = undefined;
      }
    }
  }

  static has(object, key, ...path) {
    if (key !== undefined && object[key]) {
      if (path.length > 0) {
        return this.has(object[key], ...path);
      } else {
        return object[key] !== undefined;
      }
    }
    return false;
  };

  static merge(object1, object2) {
  	for (var i in object2) {
  		if (typeof object2[i] === "object") {
  			if (object2[i]) {
  				if (!object1[i] || typeof object1[i] !== "object") {
  					object1[i] = {};
  				}
  				this.merge(object1[i], object2[i]);
  			} else if (object1[i] !== undefined) { // object2[i] -> null
          delete object1[i];
    		}
      } else {
  			object1[i] = object2[i];
  		}
  	}
  }


  static clone(...objects) {
    const result = {};
    objects.forEach(object => {
      this.merge(result, object);
    });
    return result;
  }

  // static isDifferent(object1, object2) {
  //   this.some(object1, (sub1, ...path) => {
  //     return (typeof object === "string") && object !== this.get(object2, ...path);
  //   });
  // }

  static forEach(object, callback, ...path) {
    if (object && typeof object === "object") {
      for (let i in object) {
        this.forEach(object[i], callback, ...path, i);
      }
    } else {
      callback(object, ...path);
    }
  }

  static map(object, callback, ...path) {
    let result = {};
    if (object && typeof object === "object") {
      for (let i in object) {
        result[i] = this.map(object[i], callback, ...path, i);
      }
    } else {
      result = callback(object, ...path);
    }
    return result;
  }

  static some(object, callback, ...path) {
    if (object && typeof object === "object") {
      for (let i in object) {
        if (this.some(object[i], callback, ...path, i)) {
          return true;
        }
      }
    } else if (callback(object, ...path)) {
      return true;
    }
    return false;
  }

  static filter(object, callback, ...path) {
    let output;
    if (object && typeof object === "object") {
      for (let i in object) {
        if (this.filter(object[i], callback, ...path, i) !== undefined) {
          if (!output) {
            output = {};
          }
          output[i] = object[i];
        }
      }
    } else if (callback(object, ...path)) {
      output = object;
    }
    return output;
  }

}
