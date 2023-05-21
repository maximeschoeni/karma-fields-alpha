
KarmaFieldsAlpha.loading = Symbol("loading");

KarmaFieldsAlpha.field = class {

  static fieldId = 0;
  static uniqueId = 1;

  static getData() {

    return this.data;

  }

  static setData(value) {

    this.data = value;

  }

  constructor(resource = {}) {
		// this.children = [];
    // this.childMap = {};
		this.resource = resource || {};

		this.fieldId = KarmaFieldsAlpha.field.fieldId++;

    // this.expressionCache = new KarmaFieldsAlpha.Buffer("expressions");

  }


  // static create(resource, parent) {
  //   return new KarmaFieldsAlpha.field[resource && resource.type || "group"](resource, parent);
  // }

  getKey() {
    return this.resource.key;
  }

  getLabel() {
    return this.resource.label;
  }

  getId() {
    // return "karma-fields-"+this.fieldId;
    return this.resource.uid;
  }

  getUniqueId() {
    return KarmaFieldsAlpha.field.uniqueId++;
  }

  // addChild(child, id) {
  //   this.children.push(child);

  //   this.childMap[id || child.resource.id || child.resource.type] = child;

  //   child.parent = this;
  // }

  createField(resource) {

    if (typeof resource === "string") {

      resource = {
        type: resource
      };

    }

    const constructor = this.constructor;

    const type = resource.type || "group";

    // if (KarmaFieldsAlpha.field[type]) {
    //   return new KarmaFieldsAlpha.field[type](resource);
    // }



    if (this.constructor[type] && typeof this.constructor[type] === "function") {
      return new this.constructor[type](resource);
    }

    if (this.constructor[type] && typeof this.constructor[type] === "object" && this.constructor[type].type !== type) {
      return this.createField({...this.constructor[type], ...resource, type: this.constructor[type].type});
    }

    if (this.parent) {
      return this.parent.createField(resource);
    }



    console.error("Field type does not exist", resource, this);

  }

  // createChild(resource, id) {
  //
  //   let child = this.childMap[id || resource.id || resource.type || resource];
  //
  //   if (!child) {
  //
  //     child = this.createField(resource);
  //
  //     this.children.push(child);
  //     this.childMap[id || resource.id || resource.type] = child;
  //     child.parent = this;
  //
  //
  //   }
  //
  //   return child;
  // }

  createChild(resource) {

    // let child = this.childMap[id || resource.id || resource.type || resource];
    //
    // if (!child) {


      const child = this.createField(resource);

      // this.children.push(child);
      // this.childMap[id || resource.id || resource.type] = child;
      child.parent = this;


    // }

    return child;
  }

  // getDescendants() {

  //   let descendants = [];

  //   if (this.resource.children) {

  //     for (let resource of this.resource.children) {

  //       const child = this.createChild(resource);

  //       descendants = [...descendants, child, ...child.getDescendants()];

  //     }

  //   }

  //   return descendants;
  // }

  //
  // getDescendants() {
  //   const gen = function * (field) {
  //     for (let child of field.children) {
  //       if (child.resource.key !==  undefined) {
  //         yield child;
  //       } else {
  //         yield * gen(child);
  //       }
  //     }
  //   }
  //   return gen(this) || [];
  // }
  //
  // getResourceKeys(resource) {
  //   if (resource.key !== undefined) {
  //     return [resource.key];
  //   } else if (resource.children) {
  //     return resource.children.reduce((array, item) => {
  //       return [
  //         ...array,
  //         ...this.getResourceKeys(item)
  //       ];
  //     }, []);
  //   }
  //   return [];
  // }
  //
  // getKeyedResources(resource) {
  //
  //   if (!resource) {
  //     resource = this.resource;
  //   }
  //
  //   if (resource.children) {
  //
  //     return resource.children.reduce((array, child) => {
  //
  //       if (child.key !== undefined) {
  //
  //         return [...array, child];
  //
  //       } else {
  //
  //         return [
  //           ...array,
  //           ...this.getKeyedResources(child)
  //         ];
  //
  //       }
  //
  //     }, []);
  //
  //   }
  //
  //   return [];
  //
  //   // return KarmaFieldsAlpha.Resource.getSubResources(resource);
  //
  // }

  // getChild(id, ...path) {
  //   let child = this.childMap[id];

  //   // if (path.length) {
  //   //   child = child || [...this.getDescendants()].find(child => child.resource.id === id);
  //   //   child = child && child.getChild(...path);
  //   // }

  //   return child;
  // }

  // getRelativeParent() {
  //   if (this.resource.key !==  undefined || !this.parent) {
	// 		return this;
	// 	} else {
	// 		return this.parent.getRelativeParent();
	// 	}
  // }
  //
  // getPath() {
  //   let path = this.parent && this.parent.getPath() || [];
  //   if (this.resource.key !==  undefined) {
  //     path.push(this.resource.key);
  //   }
  //   return path;
  // }


  getDefault(defaults = {}) {
console.error("deprecated");
    if (this.resource.children) {

      for (let resource of this.resource.children) {

        this.createChild(resource).getDefault(defaults);

      }

    }

		return defaults;
	}

  async render() {

    // if (this.onrender) {
    //
    //   await this.onrender();
    //
    // } else {
    //
    //   await this.parent.render();
    //
    // }

    await this.parent.render();

  }

  save() {

    this.parent.save();

  }


  // async isModified() {

  //   const key = this.getKey();
  //   return this.parent.request("modified", {}, key);

  // }


  // async dispatch2(request, ...path) {
  //
  //   if (this.parent) {
  //
  //     const key = this.getKey();
  //
  //     if (key !== undefined) {
  //
  //       return this.parent.dispatch(request, key, ...path);
  //
  //     }
  //
  //     return this.parent.dispatch(request, ...path);
  //
  //   }
  //
  // }
  //
  //
  // async dispatch(event, parent, origin) {
  //   if (!event.path) {
  //     event.path = [];
  //   }
  //   // if (!event.trace) {
  //   //   event.trace = [];
  //   // }
  //   // event.trace.push(this);
  //   const key = this.getKey();
  //
  //   if (key !== undefined) {
  //
  //     if (event.path[0] === "..") {
  //       event.path.shift();
  //     } else {
  //
  //
  //       event.path.unshift(key);
  //
  //     }
  //   }
  //   if (!event.field) {
  //     event.field = this;
  //   }
  //
  //   if (this.parent) {
  //
  //     // event.dispatcher = this;
  //     // event.relativeDispatcher.set(this.parent, this);
  //
  //
  //     event = await this.parent.dispatch(event, this, origin || this);
  //
  //
  //
  //   }
  //
  //   return event;
  // }

  // request(subject, content, ...path) {

  //   if (this.parent) {

  //     return this.parent.request(subject, content, ...path);

  //   }

  // }

  request(action, ...values) {

    if (this[action]) {

      return this[action](...values);

    } else if (this.parent) {

      return this.parent.request(action, ...values);

    }

  }

  // expect(action, object, ...path) {

  //   if (this.resource.children) {

  //     // if (!path.length || this.getKey() === path.shift()) {

  //       for (let resource of this.resource.children) {

  //         const child = this.createChild(resource);

  //         child.expect(action, object, ...path);

  //       }

  //     // }

  //   }

  // }





  // async parse(expression) {

  //   // const expressionKey = JSON.stringify(expression);
  //   //
  //   // let promise = this.cache.get(expressionKey);
  //   //
  //   // if (!promise) {
  //   //
  //   //   promise = KarmaFieldsAlpha.Expression.resolve(this, expression);
  //   //
  //   //   this.cache.set(promise, expressionKey);
  //   //
  //   // }
  //   //
  //   // return promise;

  //   return KarmaFieldsAlpha.Expression.resolve(this, expression);
  // }

  // async get(type, ...path) {
  //   const key = this.getKey();
  //   if (key) {
  //     path = [key, ...path];
  //   }
  //   const response = await this.request("get", {}, ...path);
  //   return KarmaFieldsAlpha.Type.convert(response, type);
  // }

  // async getString(...path) {
  //   return this.get("string", ...path);
  // }

  // async getNumber(...path) {
  //   return this.get("number", ...path);
  // }

  // async getArray(...path) {
  //   return this.get("array", ...path);
  // }

  // async getObject(...path) {
  //   return this.get("object", ...path);
  // }

  // used for export cells
  // async exportValue() {
  //   return "";
	// }
  //
  // // used for import cells
	// async importValue(value) {
  //   // noop
	// }

  // async export() {
  //   // noop
	// }

	// async import(object) {
  //   // noop
	// }


  getValue(...path) {

    const key = this.getKey();

    if (key) {

      return this.parent.getValue(key, ...path);

    }

    return this.parent.getValue(...path);

  }

  // getValue(...path) {
  //
  //   return this.parent.getValue(...path);
  //
  // }

  setValue(value, ...path) {

    // this.parent.setValue(value, ...path);

    const key = this.getKey();

    if (key) {

      this.parent.setValue(value, key, ...path);

    } else {

      this.parent.setValue(value, ...path);
      
    }



  }

  // getDelta() {

  //   return this.parent.getDelta();

  // }

  modified(...path) {

    const key = this.getKey();

    if (key) {

      return this.parent.modified(key, ...path);

    } else {

      return this.parent.modified(...path);

    }

  }


  // !
  getIdXXX() {
    return this.parent.getId();
  }

  getIndex() {
    return this.parent.getIndex();
  }

  // getKeys(set = new Set()) {

  //   const key = this.getKey();

  //   if (key) {

  //     set.add(key);

  //   } else if (this.resource.children) {

  //     for (let resource of this.resource.children) {

  // 			this.createChild(resource).getKeys(set);

  // 		}

  //   }

  //   return set;
  // }

  getKeys(set = new Set()) {

    if (this.resource.children) {

      for (let resource of this.resource.children) {

        const child = this.createChild(resource);
        const key = child.getKey();

        if (key) {

          set.add(key);

        } else {

          child.getKeys(set);

        }

  		}

    }

    return set;
  }

  follow(selection, callback) {

    if (selection.final) {

      return callback(this, selection);

    } else if (selection && this.resource.children) {

      for (let i = 0; i < this.resource.children.length; i++) {

        if (selection[i]) {

          const child = this.createChild({...this.resource.children[i], index: i, uid: `${this.resource.uid}-${i}`});

          return child.follow(selection[child.resource.index], callback);

        }

      }

    }

  }


  paste(value, selection) {
console.error("deprecated");
    if (selection && this.resource.children) {

      for (let i = 0; i < this.resource.children.length; i++) {

        if (selection[i]) {

          const child = this.createChild({...this.resource.children[i], index: i});

          child.paste(value, selection[child.resource.index]);

          break;

        }

      }

    }

  }


  // export(object = {}) {

	// 	if (this.resource.children) {

	// 		for (let resource of this.resource.children) {

	// 			this.createChild(resource).export(object);

	// 		}

	// 	}

	// 	return object;
	// }

  export(items = []) {

    if (this.resource.children) {

			for (let resource of this.resource.children) {

				const child = this.createChild(resource);

        child.export(items);

			}

		}

		return items;
  }

  import(items) {

    if (this.resource.children) {

			for (let resource of this.resource.children) {

				const child = this.createChild(resource);

        child.import(items);

			}

		}

  }

	// import(object) {

	// 	if (this.resource.children) {

	// 		for (let resource of this.resource.children) {

	// 			this.createChild(resource).import(object);

	// 		}

	// 	}

	// }



  // follow(resource, ...resPath) {
  //
	// 	return this.createChild(resource).follow(...resPath);
  //
	// }


  // getAlias(key) {
  //   return this.resource.alias && this.resource.alias[key] || key;
  // }





  getSelection() {

    const selection = this.parent.getSelection();

    if (selection) {

      return selection[this.resource.index];

    }

  }

  setSelection(selection) {

    this.parent.setSelection(selection && {[this.resource.index]: selection});

  }

  clearSelection(selection) {
console.error("deprecated");
    if (!selection || selection.final) {

      this.setSelection();

    } else if (this.resource.children) {

      for (let index in this.resource.children) {

        if (selection[index]) {

          const child = this.createChild({
            ...this.resource.children[index],
            index: index
          });

          child.clearSelection(selection[index]);

        }

      }

    }

  }






  getData() {

    const data = this.parent.getData();

    if (!data[this.resource.index]) {

      data[this.resource.index] = {};

    }

    return data[this.resource.index];

    // if (data) {
    //
    //   return data[this.resource.index];
    //
    // }

  }

  setData(value) {

    this.parent.setData({...this.parent.getData(), [this.resource.index]: value});

  }

  debounce(name, callback, interval = 500) {

    // const data = this.getData() || {};

    const data = this.getData();

    if (data[name]) {

      clearTimeout(data[name]);

    }

    data[name] = setTimeout(callback, interval);

    // this.setData(data);

  }




  parse(expression) {

    if (Array.isArray(expression)) {

      const [operation, ...expressions] = expression;

      if (operation === "esc") {

        return expressions[0];

      } else if (operation === "debugger") {

        debugger;

      }

      const values = expressions.map(expression => this.parse(expression));

      if (values.some(value => value === KarmaFieldsAlpha.loading)) {

        return KarmaFieldsAlpha.loading;

      }

      switch (operation) {
        case "=":
        case "==": return KarmaFieldsAlpha.Type.toObject(values[0]) == KarmaFieldsAlpha.Type.toObject(values[1]);
        case "===": return KarmaFieldsAlpha.Type.toObject(values[0]) === KarmaFieldsAlpha.Type.toObject(values[1]);
        case "!=": return KarmaFieldsAlpha.Type.toObject(values[0]) != KarmaFieldsAlpha.Type.toObject(values[1]);
        case "!==": return KarmaFieldsAlpha.Type.toObject(values[0]) !== KarmaFieldsAlpha.Type.toObject(values[1]);
        case ">": return KarmaFieldsAlpha.Type.toObject(values[0]) > KarmaFieldsAlpha.Type.toObject(values[1]);
        case "<": return KarmaFieldsAlpha.Type.toObject(values[0]) < KarmaFieldsAlpha.Type.toObject(values[1]);
        case ">=": return KarmaFieldsAlpha.Type.toObject(values[0]) >= KarmaFieldsAlpha.Type.toObject(values[1]);
        case "<=": return KarmaFieldsAlpha.Type.toObject(values[0]) <= KarmaFieldsAlpha.Type.toObject(values[1]);
        case "+": return KarmaFieldsAlpha.Type.toNumber(values[0]) + KarmaFieldsAlpha.Type.toNumber(values[1]);
        case "-": return KarmaFieldsAlpha.Type.toNumber(values[0]) - KarmaFieldsAlpha.Type.toNumber(values[1]);
        case "*": return KarmaFieldsAlpha.Type.toNumber(values[0]) * KarmaFieldsAlpha.Type.toNumber(values[1]);
        case "/": return KarmaFieldsAlpha.Type.toNumber(values[0]) / KarmaFieldsAlpha.Type.toNumber(values[1]);
        case "%": return KarmaFieldsAlpha.Type.toNumber(values[0]) % KarmaFieldsAlpha.Type.toNumber(values[1]);;
        case "&&": return KarmaFieldsAlpha.Type.toObject(values[0]) && KarmaFieldsAlpha.Type.toObject(values[1]);
        case "||": return KarmaFieldsAlpha.Type.toObject(values[0]) || KarmaFieldsAlpha.Type.toObject(values[1]);
        case "in": return KarmaFieldsAlpha.Type.toArray(values[1]).includes(KarmaFieldsAlpha.Type.toObject(values[0]));
        case "!": return !KarmaFieldsAlpha.Type.toBoolean(values[0]);
        case "?": return KarmaFieldsAlpha.Type.toBoolean(values[0]) ? values[1] : values[2];
        case "concat":
        case "...": return [].concat(...values.map(value => KarmaFieldsAlpha.Type.toArray(value)));
        case "max": return Math.max(...values.map(value => KarmaFieldsAlpha.Type.toNumber(value)));
        case "min": return Math.min(...values.map(value => KarmaFieldsAlpha.Type.toNumber(value)));
        case "replace": {
          const [string, wildcard, ...replacements] = values.map(value => KarmaFieldsAlpha.Type.toObject(value));
          return replacements.reduce((string, replacement) => string.replace(wildcard, replacement), KarmaFieldsAlpha.Type.toString(string));
        }
        case "date": {
          const [date, option, locale] = values.map(value => KarmaFieldsAlpha.Type.toObject(value));
          return new Intl.DateTimeFormat(locale || KarmaFieldsAlpha.locale, option).format(new Date(date));
        }
        case "request": {
          return this.parent.request(...values);
        }
        case "getValue": return this.parent.getValue(...values.map(value => KarmaFieldsAlpha.Type.toString(value))) || KarmaFieldsAlpha.loading;
        case "queryValue": return KarmaFieldsAlpha.Query.getValue(...values.map(value => KarmaFieldsAlpha.Type.toString(value))) || KarmaFieldsAlpha.loading;
        case "query": return KarmaFieldsAlpha.Query.getResults(...values.map(value => KarmaFieldsAlpha.Type.toObject(value))) || KarmaFieldsAlpha.loading;
        case "id": return this.parent.getId();
        case "modified": return this.modified(...values.map(value => KarmaFieldsAlpha.Type.toString(value)));
        case "map": {
          let [array, replacement] = values; // ! replacement is already parsed !
          replacement = expression[2];
          this.loopItem = null;
          return KarmaFieldsAlpha.Type.toArray(array).map(value => {
            this.loopItem = value;
            return this.parse(replacement);
          });
        }
        case "item": return KarmaFieldsAlpha.DeepObject.get(this.loopItem, ...values.map(value => KarmaFieldsAlpha.Type.toString(value)));
        case "join": return KarmaFieldsAlpha.Type.toArray(values[0]).join(KarmaFieldsAlpha.Type.toString(values[1]));

        case "length":
        case "count": return KarmaFieldsAlpha.Type.toArray(values[0]).length;
        // case "count": return KarmaFieldsAlpha.Query.getCount(...values.map(value => KarmaFieldsAlpha.Type.toObject(value))) || KarmaFieldsAlpha.loading;

        case "key": return this.getKey();
        case "index": return this.parent.getIndex();

        case "getParam": return KarmaFieldsAlpha.Type.toString(this.parent.request("getParam", ...values));

        case "debugger": return values[0];

        case "get": { // -> compat
          const [type, ...path] = values;
          let value = this.parent.getValue(...path.map(value => KarmaFieldsAlpha.Type.toString(value))) || KarmaFieldsAlpha.loading;
          if (value !== KarmaFieldsAlpha.loading) {
            value = KarmaFieldsAlpha.Type.convert(value, KarmaFieldsAlpha.Type.toString(type));
          }
          return value;
        }

      }

    }

    return expression;
  }


};
