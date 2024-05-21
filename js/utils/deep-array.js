KarmaFieldsAlpha.Array = class {

  concat(array, index, ...items) {

    const clones = [...array];

    clones.splice(index, 0, ...items);

    return clones;

  }

}


KarmaFieldsAlpha.DeepArray = class {

  static getArray(array, index, ...path) {

    if (index === undefined) {

      return array;

  	} else if (array[index] && array[index].children) {

      return this.getArray(array[index].children, ...path);

  	}

  };

  static get(array, index, ...path) {

    if (path.length > 0) {

      if (array[index] && array[index].children) {

        return this.get(array[index].children, ...path);

      }

    } else if (index !== undefined) {

      return array[index];

    }

  };

  // static set(array, values, index, ...path) {
  //
  //   if (array && index !== undefined) {
  //
  //     if (!array[index]) {
  //
  //       array[index] = {};
  //
  //     }
  //
  //     if (path.length > 0) {
  //
  //       if (!array[index].children) {
  //
  //         array[index].children = [];
  //
  //       }
  //
  //       this.set(array[index].children, values, ...path);
  //
  //     } else {
  //
  //       array[index].children = values;
  //
  //     }
  //
  //   }
  //
  // }

  static set(array, value, index = 0, ...path) {

    if (path.length > 0) {

      if (!array[index]) {

        array[index] = {};

      }

      if (!array[index].children) {

        array[index].children = [];

      }

      this.set(array[index].children, value, ...path);

    } else {

      array[index] = value;

    }

  }

  static splice(array, num, values, index = 0, ...path) {

    if (path.length > 0) {

      if (!array[index]) {

        array[index] = {};

      }

      if (!array[index].children) {

        array[index].children = [];

      }

      return this.splice(array[index].children, num, values, ...path);

    } else {

      return array.splice(index, num, ...values);

    }

  }

  static spliceObject(object, num, values, index = 0, ...path) {

    if (path.length > 0) {

      if (!object.children) {

        object.children = [];

      }

      return this.spliceObject(object.children[index], num, values, ...path);

    } else if (object.children) {

      return object.children.splice(index, num, ...values);

    }

  }


  static cloneObject(object) {

    const clone = {};

    for (let key in object) {

      // if (Array.isArray(object[key])) {
      if (key === "children") {

        clone[key] = this.clone(object[key]);

      } else {

        clone[key] = object[key];

      }

    }

    return clone;
  }

  static clone(array) {

    const clone = [];

    for (let i = 0; i < array.length; i++) {

      // if (typeof array[i] === "object" && array[i]) {

        clone[i] = this.cloneObject(array[i]); // -> array must contains objects only

      // } else {
      //
      //   clone[i] = array[i];
      //
      // }

    }

    return clone;

  }

  static flatten(deepArray) {

    const flatArray = [];

    for (let i = 0; i < deepArray.length; i++) {

      if (deepArray[i].children) {

        flatArray = [...flatArray, ...this.flatten(deepArray[i].children)];

      } else {

        flatArray = [...flatArray, deepArray[i]];

      }

    }

    return flatArray;

  }

  static create(items, root = "0") {

    const map = {[root]: {id: root}};

    for (let item of items) {

      map[item.id] = item;

    }

    for (let item of items) {

      if (map[item.parent]) {

        if (!map[item.parent].children) {

          map[item.parent].children = [];

        }

        map[item.parent].children.push(item);

      }

    }

    return map[root];

  }


  static forEach(array, callback, parent) {

    for (let i = 0; i < array.length; i++) {

      if (array[i].children) {

        this.forEach(array[i].children, callback, array[i]);

      }

      callback(array[i], i, parent);

    }

  }

  static forEachObject(object, callback) {

    if (object.children) {

      for (let i = 0; i < object.children.length; i++) {

        callback(object.children[i], i, object);

        this.forEachObject(object.children[i], callback);



      }

    }

  }



}
