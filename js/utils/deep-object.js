
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
          // console.log(typeof key, key, path);
          // object[key] = (typeof path[0] === "number" || path[0] === "0" || parseInt(path[0])) ? [] : {};
          object[key] = {}; // (typeof path[0] === "number") ? [] : {};
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

  // static merge(object1, object2) {
  // 	for (var i in object2) {
  // 		if (typeof object2[i] === "object" && !Array.isArray(object2[i])) {
  // 			if (object2[i]) {
  //
  //         if (!object1[i] || typeof object1[i] !== "object") {
  // 					object1[i] = {};
  // 				}
  // 				// if (!object1[i] || typeof object1[i] !== "object") {
  // 				// 	object1[i] = Array.isArray(object2[i]) ? [] : {};
  // 				// }
  // 				this.merge(object1[i], object2[i]);
  // 			} else if (object1[i] !== undefined) { // object2[i] -> null
  //         delete object1[i];
  //   		}
  //     } else {
  // 			object1[i] = object2[i];
  // 		}
  // 	}
  // }

  static merge(object1, object2) {
  	for (var i in object2) {
      if (object2[i] === null) {
        delete object1[i];
      } else if (object2[i].constructor === Object) {
        if (!object1[i] || object1[i].constructor !== Object) {
					object1[i] = {};
				}
				this.merge(object1[i], object2[i]);
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

  static cloneArray(...objects) {
    const result = [];
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
    if (object && typeof object === "object" && !Array.isArray(object)) {
      for (let i in object) {
        this.forEach(object[i], callback, ...path, i);
      }
    } else if (object !== undefined) {
      callback(object, ...path);
    }
  }

  static map(object, callback, ...path) {
    let result = {};
    if (object && typeof object === "object" && !Array.isArray(object)) {
      for (let i in object) {
        result[i] = this.map(object[i], callback, ...path, i);
      }
    } else if (object !== undefined) {
      result = callback(object, ...path);
    }
    return result;
  }

  static some(object, callback, ...path) {
    if (object && typeof object === "object" && !Array.isArray(object)) {
      for (let i in object) {
        if (this.some(object[i], callback, ...path, i)) {
          return true;
        }
      }
    } else if (object !== undefined && callback(object, ...path)) {
      return true;
    }
    return false;
  }

  // static async someAsync(object, callback, ...path) {
  //   if (object && typeof object === "object" && !Array.isArray(object)) {
  //     for (let i in object) {
  //       if (await this.someAsync(object[i], callback, ...path, i)) {
  //         return true;
  //       }
  //     }
  //   } else if (object !== undefined && await callback(object, ...path)) {
  //     return true;
  //   }
  //   return false;
  // }

  static every(object, callback, ...path) {
    if (object && typeof object === "object" && object.constructor !== Array) {
      for (let i in object) {
        if (!this.every(object[i], callback, ...path, i)) {
          return false;
        }
      }
    } else if (object === undefined || !callback(object, ...path)) {
      return false;
    }
    return true;
  }



  static filter(object, callback, ...path) {
    let output;
    if (object && typeof object === "object" && !Array.isArray(object)) {
      for (let i in object) {
        if (this.filter(object[i], callback, ...path, i) !== undefined) {
          if (!output) {
            // output = {};
            output = Array.isArray(object) ? [] : {};
          }
          output[i] = object[i];
        }
      }
    } else if (object !== undefined && callback(object, ...path)) {
      output = object;
    }
    return output;
  }

  static differ(object, original) {
		if (Array.isArray(object) && original) {
      return object.length !== original.length || object.some((item, index) => this.differ(item, original[index]));
		} else if (typeof object === "object" && original) {
      return this.some(object, (item, ...path) => this.differ(item, this.get(original, ...path)));
		} else {
			return object !== original;
		}
	}

  static equal(o1, o2) {
		if (Array.isArray(o1)) {
      return Array.isArray(o2) && o1.length === o2.length && o1.every((item, index) => this.equal(item, o2[index]));
		} else if (o1 && typeof o1 === "object") {
      return typeof o2 === "object" && this.every(o1, (item, ...path) => this.equal(item, this.get(o2, ...path)));
		} else {
			return o1 === o2;
		}
	}
  //
  // static differ(object, original) {
	// 	if (object.constructor === Array) {
  //     return !(object.length === 1 && object[0] === original || original.constructor === Array && object.length === original.length && !object.some((item, index) => this.differ(item, original[index])));
	// 	} else if (typeof object === "object" && original) {
  //     return this.some(object, (item, ...path) => this.differ(item, this.get(original, ...path)));
	// 	} else {
	// 		return !(object === original || original.constructor === Array && original.length === 1 && object === original[0]);
	// 	}
	// }

  // static equalX(o1, o2) {
	// 	if (o1.constructor === Array) {
  //     return o1.length === 1 && o1[0] === o2 || o2.constructor === Array && o1.length === o2.length && o1.every((item, index) => this.equal(item, o2[index]));
	// 	} else if (typeof o1 === "object" && o2) {
  //     return this.every(o1, (item, ...path) => this.equal(item, this.get(o2, ...path)));
	// 	} else {
	// 		return o1 === o2 || o2.constructor === Array && o2.length === 1 && o1 === o2[0];
	// 	}
	// }


  getObject() {
    return this.object || {};
  }

  setObject(object) {
    this.object = object;
  }

  empty() {
    this.object = {};
  }

  get(...path) {
    return this.constructor.get(this.getObject(), ...path);
  }

  set(value, ...path) {
    const object = this.getObject();
    this.constructor.assign(object, value, ...path);
    this.setObject(object);
  }

  remove(...path) {
    const object = this.getObject();
    this.constructor.remove(object, ...path);
    this.setObject(object);
  }

  has(...path) {
    return this.constructor.has(this.getObject(), ...path);
  }

  merge(value) {
    const object = this.getObject();
    this.constructor.merge(object, value);
    this.setObject(object);
  }

  some(callback, ...path) {
    return this.constructor.some(this.getObject(), callback, ...path);
  }

  // someAsync(callback, ...path) {
  //   return this.constructor.someAsync(this.getObject(), callback, ...path);
  // }

  forEach(callback, ...path) {
    this.constructor.forEach(this.getObject(), callback, ...path);
  }

  map(callback, ...path) {
    return this.constructor.map(this.getObject(), callback, ...path);
  }

  filter(callback, ...path) {
    return this.constructor.filter(this.getObject(), callback, ...path);
  }

}
