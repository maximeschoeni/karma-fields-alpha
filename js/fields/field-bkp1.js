
KarmaFieldsAlpha.fields.field = class Field {

  constructor(resource, domain, parent) {
    this.domain = domain || new KarmaFieldsAlpha.Domain();
    this.parent = parent;
		this.children = [];
		this.resource = resource || {};
		this.data = {};
		this.events = {};
    this.loading = 0;
    this.history = {};
    // this.historyIndex = 0;
    this.datatype = "string"; // should be defined statically?
		this.fieldId = Field.fieldId++;

    // this.setValue(resource.value || resource.default);

    // used by domain
    // this.events.path = function() {
    //   let keys = this.triggerUp("path") || [];
    //   if (this.resource.key) {
    //     keys.push(this.resource.key);
    //   }
    //   return keys;
    // };
    this.events.get = function(keys, origin) {
      if (this.resource.key) {
        keys.unshift(this.resource.key);
      }
      return this.triggerUp("get", keys, origin);
    };

    // this.events.read = function(keys) {
    //   if (!keys) {
    //     keys = [];
    //   }
    //   if (this.resource.key) {
    //     keys.unshift(this.resource.key);
    //   }
    //   return this.triggerUp("read", keys);
    // };
    // this.events.write = function(value, keys) {
    //   if (!keys) {
    //     keys = [];
    //   }
    //   if (this.resource.key) {
    //     keys.unshift(this.resource.key);
    //   }
    //   this.triggerUp("write", value, keys);
    // };


    if (this.resource.children) {
  		for (let i = 0; i < this.resource.children.length; i++) {
  			this.createChild(this.resource.children[i], this.domain);
  		}
  	}

    if (this.resource.value !== undefined) {
      this.setValue(this.resource.value, "noop");
    }
    // if (this.resource.originalValue !== undefined) {
    //   this.originalValue = this.sanitize(this.resource.originalValue);
    // }



    // let field = this;
    // this.history = {
    //   undos: {},
    //   save: function() {
    //     let index = KarmaFieldsAlpha.History.getIndex(field);
    //     this.undos[index] = field.value;
    //   },
    //   go: function(index) {
    //     if (this.undos[index]) {
    //       field.setValue(this.undos[index], "undo");
    //     }
    //     field.children.forEach(function(child) {
    //       child.history.go(index);
    //     });
    //   },
    //   delete: function(index) {
    //     this.undos[index] = undefined;
    //     field.children.forEach(function(child) {
    //       child.history.delete(index);
    //     });
    //   }
    // }




  }

  static getFieldClass(resource) {
    return new KarmaFieldsAlpha.fields[resource && resource.type || defaultType || "group"];
  }

  static create(resource, domain, defaultType, parent) {
    return new KarmaFieldsAlpha.fields[resource && resource.type || defaultType || "group"](resource, domain, parent);
    // const fieldClass = getFieldClass(resource);
    // return new fieldClass(domain, defaultType);
  }

  getId() {
    return "karma-fields-"+this.fieldId;
  }

  addChild(child) {
    this.children.push(child);
    child.parent = this;
  }

  addChildren(children) {
    this.children = children;
    for (let i = 0; i < children.length; i++) {
      children[i].parent = this;
    }
  }

  createField(resource) {
    return Field.create(resource, this.domain, this.defaultChildType, this);
  }

  createChild(resource) {
    let child = this.createField(resource);
    this.addChild(child);
    return child;
  }

  getDescendant(key) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].resource.key === key) {
        return this.children[i];
      } else if (!this.children[i].resource.key) {
        const child = this.children[i].getDescendant(key);
        if (child) {
          return child;
        }
      }
    }
  }

  //deprecated: use getChild
  getDirectChild(key) {
    return this.getChild(key);
  }

  getChild(key) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].resource.key === key) {
        return this.children[i];
      }
    }
  }

  // getPath(keys) {
  //   if (!keys) {
  //     keys = [];
  //   }
  //   if (this.resource.key) {
  //     keys.unshift(this.resource.key);
  //   }
  //   if (keys.length < 2 && this.parent) {
  //     keys = this.parent.getPath(keys);
  //   }
  //   return keys;
  // }

  // getPath(keys) {
  //   if (!keys) {
  //     keys = [];
  //   }
  //   if (this.resource.key) {
  //     keys.unshift(this.resource.key);
  //   }
  //   if (keys.length < 2 && this.parent) {
  //     keys = this.parent.getPath(keys);
  //   }
  //   return keys;
  // }

  // getPath(keys) {
  //   return this.bubble("path");
  // }

  getPath() {
    let keys = this.parent && this.parent.getPath() || [];
    if (this.resource.key) {
      keys.push(this.resource.key);
    }
    return keys;
  }

  // triggerEvent(eventName, bubbleUp, target, ...params) {
  //   if (this.events[eventName] && typeof this.events[eventName] === "function") {
  //     return this.events[eventName](target || this, ...params);
  //   } else if (bubbleUp && this.parent) {
  //     return this.parent.triggerEvent(eventName, true, target || this, ...params);
  //   }
  // }



  triggerEvent(eventName, bubbleUp, target, ...params) {
    if (this.events[eventName] && typeof this.events[eventName] === "function") {
      return this.events[eventName].call(this, target || this, ...params);
    } else if (bubbleUp && this.parent) {
      return this.parent.triggerEvent(eventName, true, target || this, ...params);
    }
  }

  // bubbleUp(eventName, target, ...params) {
  //   if (this.parent) {
  //     if (this.parent.events[eventName] && typeof this.parent.events[eventName] === "function") {
  //       return this.parent.events[eventName].call(this, target || this, ...params);
  //     } else {
  //       return this.parent.bubbleUp(eventName, target || this, ...params);
  //     }
  //   }
  // }


  triggerUp(eventName, ...params) {
    if (this.parent) {
      return this.parent.bubble(eventName, ...params);
    }
  }

  bubble(eventName, ...params) {
    if (this.events[eventName] && typeof this.events[eventName] === "function") {
      return this.events[eventName].call(this, ...params);
    }
    return this.triggerUp(eventName, ...params);
    // else if (this.parent) {
    //   return this.parent.bubble(eventName, ...params);
    // }
  }

  triggerDown(eventName, ...params) {
    this.children.forEach(function(child) {
      if (child.events[eventName] && typeof child.events[eventName] === "function") {
        child.events[eventName].call(child, ...params);
      } else {
        child.triggerDown(eventName, ...params);
      }
    });
  }

  try(eventName, ...params) {
    if (this[eventName] && typeof this[eventName] === "function") {
      return this[eventName](...params);
    }
  }


  // not used
  updateDependency() {
    if (this.resource.dependencies) {
      this.triggerEvent("set");
    }
  }

  getModifiedValue() {
    if (this.isModified()) {
      let value = this.getValue();
      // value = this.convert(value, this.datatype, this.resource.datatype);
      if (this.resource.output_datatype) {
        value = this.convert(value, this.resource.datatype || this.datatype, this.resource.output_datatype);
      }
      if (value !== null) {
        return value;
      }
    }
  }

  // maybe deprecated -> use setValue
  updateOriginal() {
    this.originalValue = this.read();
  }



  isModified() {
    return this.read() !== this.originalValue;
  }

  // getDefaultRawValue() {
  //
  //   return this.resource.value && this.sanitize(this.resource.value);
  // }

  getValue() {
    let value = this.read();
    if (value === undefined) {
      value = this.getDefault();
    } else {
      value = this.parse(value);
    }
    return value;
  }

  get(keys) {
    if (!keys) {
      keys = [];
    }
    if (this.resource.key) {
      keys.unshift(this.resource.key);
    }
    if (this.parent) {
      return this.parent.get(keys);
    }
  }

  change(value) {
    const field = this;
    this.setValue(value);
    const promise = this.bubble("change", this);
    if (promise) {
      field.startLoad();
      return promise.then(function() {
        field.endLoad();
      });
    }
  }

  getAsyncValue() {
    const field = this;
    let promise = this.get(); //bubble("get", [], this);
    if (promise) {
      // field.startLoad();
      return promise.then(function(value) {
        // field.endLoad();
        value = field.prepare(value); //
        value = field.sanitize(value, "input");
        return field.validate(value).then(function() {
          if (value === null && !field.resource.null) {
            return field.fetchDefault().then(function(value) {
              // if (value !== undefined) {
              //   field.change(value);
              //   field.try("onSet", value);
              //   field.triggerEvent("set"); // compat
              // }
              return value;
            });
          } else {
            // field.setValue(value, "set");
            return value;
          }
        });
      });
    } else {
      return field.fetchDefault().then(function(value) {
        // field.try("onSet", value);
        // field.triggerEvent("set"); // compat
        // field.change(value);
        return value;
      });
    }
  }

  fetchValue() {
    const field = this;
    if (!this.promiseValue) {
      let promise = this.get(); //bubble("get", [], this);
      if (promise) {
        field.startLoad();
        this.promiseValue = promise.then(function(value) {
          field.endLoad();
          value = field.prepare(value); //
          // value = field.convert(value, field.resource.output_datatype || typeof value, field.resource.datatype || field.datatype);
          value = field.sanitize(value, "input");

          return field.validate(value).then(function() {
            if (value === null && !field.resource.null) {
              // value = field.getDefault();
              return field.fetchDefault().then(function(value) {
                if (value !== undefined) {
                  field.change(value);
                  field.try("onSet", value);
                  field.triggerEvent("set"); // compat
                }
                // field.setValue(value);
                // field.triggerEvent("change", true);
                // field.triggerEvent("set");

                // field.triggerEvent("modify");
                return value;
              });
            } else {
              field.setValue(value, "set");
              // field.try("onSet", value);
              // field.triggerEvent("set"); // compat
              // field.setValue(value, "set");
              // field.triggerEvent("set", value);
              // field.triggerEvent("modify");
              return value;
            }
          });
        });
      } else {
        this.promiseValue = field.fetchDefault().then(function(value) {
          // field.setValue(value);
          // field.triggerEvent("change", true);

          // console.log(value);

          field.try("onSet", value);
          field.triggerEvent("set"); // compat
          field.change(value);
        });
      }


      // let value = field.read();
      // if (value === undefined) {
      //
      //
      //
      // } else {
      //   value = field.parse(value);
      //
      //   field.try("onSet", value);
      //   this.triggerEvent("set"); // compat
      //   this.promiseValue = Promise.resolve(value);
      // }
    }

    return this.promiseValue;


    // return this.getDefault();

    //
    //
    //
    // if (!this.promiseValue) {
    //
    //   let promise = this.bubble("get", [], this);
    //
    //   this.promiseValue = promise.then(function(value) {
    //     field.endLoad();
    //     value = field.prepare(value); //
    //     value = field.convert(value, field.resource.output_datatype || typeof value, field.resource.datatype || field.datatype);
    //     value = field.sanitize(value);
    //     if (value === null && !field.resource.null) {
    //       value = field.getDefault();
    //       field.setValue(value);
    //       field.triggerEvent("change", true);
    //     } else {
    //       field.setValue(value, "set");
    //       // field.originalValue = field.getRawValue();
    //     }
    //     field.triggerEvent("set");
    //     field.triggerEvent("modify");
    //
    //     return field.getValue();
    //   });
    // }
    //
    // if (this.promiseValue) {
    //   field.startLoad();
    //   return this.promiseValue
    // } else {
    //
    //   return Promise.resolve(this.getDefault());
    // }
  }

  clearValue() {
    this.promiseValue = undefined;
  }

  hasValue() {
    // return this.value !== undefined;
    return this.read() !== undefined;
  }

  getDefault() {
    return this.resource.default || this.resource.value || this.getEmpty();
  }

  fetchDefault() {
    return this.validate(this.getDefault());
  }

  validate(value) {
    return Promise.resolve(value);
  }



  // read(path) {
  //   if (this.parent) {
  //     return this.parent.read(path);
  //   }
  // };
  //
  // write(path, value) {
  //   if (this.parent) {
  //     return this.parent.write(path, value);
  //   }
  // };
  //
  // get(path) {
  //   if (this.parent) {
  //     return this.parent.get(path);
  //   }
  // };
  //
  // save(value) {
  //   if (this.parent) {
  //     const container = this.parent.save(value);
  //   }
  //   if (this.resource.key) {
  //     container[this.resource.key] = value;
  //   }
  //   return container;
  // };
  //
  // change(value) {
  //   const field = this;
  //   const path = this.getPath();
  //   field.startLoad();
  //   return this.validate(value).then(function(value) {
  //     const rawValue = field.parse(value);
  //     field.write(path, rawValue);
  //     if (rawValue === this.originalValue) {
  //       field.save();
  //       field.try("onModified", false);
  //     } else {
  //       field.save(value);
  //       field.try("onModified", true);
  //     }
  //     return field.bubble("change", field, value);
  //   }).then(function() {
  //     field.endLoad();
  //   });
  // }
  //
  // initValue(value) {
  //   const field = this;
  //   const path = this.getPath();
  //   field.startLoad();
  //   return this.validate(value).then(function(value) {
  //     const rawvalue = field.parse(value);
  //     field.write(path, rawvalue);
  //     this.originalValue = rawvalue;
  //     field.try("onModified", false);
  //     field.endLoad();
  //   });
  // }
  //
  // updateValue(value) {
  //   const field = this;
  //   const path = this.getPath();
  //   field.startLoad();
  //   return this.validate(value).then(function(value) {
  //     const rawvalue = field.parse(value);
  //     field.write(path, rawvalue);
  //     field.save(value);
  //     field.try("onModified", rawvalue === this.originalValue);
  //     field.endLoad();
  //   });
  // }
  //
  // update() {
  //   const field = this;
  //   const path = this.getPath();
  //   let rawValue = this.read(path);
  //   if (rawValue === undefined) {
  //     // value is unset
  //     field.startLoad();
  //     return this.get(path).then(function(value) {
  //       if (value === undefined) {
  //         // value is not found
  //         value = this.getDefault();
  //         // const validation = field.validate(value);
  //
  //         return field.validate(value).then(function(value) {
  //           field.endLoad();
  //           if (value === undefined) {
  //             console.error("validated value should not be undefined");
  //           }
  //           rawValue = field.parse(value);
  //           field.save();
  //           field.write(path, rawValue);
  //           field.try("onSet", value);
  //           field.try("onModified", rawValue === field.originalValue);
  //           return value;
  //         });
  //       } else {
  //         value = field.sanitize(value);
  //         rawValue = field.parse(value);
  //         field.endLoad();
  //         field.originalValue = rawValue;
  //         field.write(path, rawValue);
  //         field.try("onSet", value);
  //         field.try("onModified", rawValue === field.originalValue);
  //         return value;
  //       }
  //     });
  //   } else {
  //     let value = field.sanitize(rawValue);
  //     field.try("onSet", value);
  //     field.try("onModified", rawValue === field.originalValue);
  //     return value;
  //   }
  // }


  write(rawValue, keys) {
    if (!keys) {
      keys = [];
    }
    if (this.resource.key) {
      keys.unshift(this.resource.key);
    }
    if (this.parent) {
      this.parent.write(rawValue, keys);
    }
  };




  setValue(value, context) { // context = {'change' | 'set' | 'undo'}

    let response;

    if (value === undefined) {
      return;
    }

    // value = this.convert(value, typeof value, this.resource.datatype || this.datatype);
    value = this.sanitize(value, "import");
    value = this.stringify(value);


    // if (!context) {
    //   context = "change";
    // }

    if (context === "change") {
      this.triggerEvent("history", true);
    }

    this.write(value);

    // this.isDifferent = this.history[this.domain.index] !== value;

    if (context === "set") {
      this.originalValue = value;
      this.try("onSet", value);
      this.triggerEvent("set"); // compat

      // this.triggerEvent("set");
      // this.saveHistory();
      // this.triggerEvent("set", true); // -> will save history

    }

    if (context === "undo") {
      this.triggerEvent("set");
      // this.triggerEvent("undo");
    }

    if (context === "change" || context === "default") {
      response = this.triggerEvent("change", true);
    }




    // this.isModified = value !== this.originalValue;
    // this.lastValue = value;

    // this.triggerEvent("set"); // -> reload node

    return response;
  }

  getClosest(type) {
    if (this.resource.type === type) {
      return this;
    } else {
      return this.parent.getClosest(type);
    }
  }

  findAncestor(callback) {
    if (callback(this)) {
      return this;
    } else if (this.parent) {
      return this.parent.findAncestor(callback);
    }
  }

  getRoot() {
    if (this.parent) {
      return this.parent.getRoot();
    } else {
      return this;
    }
  }

  // sanitize(value) {
  //
  //   let datatype = this.datatype || this.resource.datatype;
  //
  //   switch (datatype) {
  //     case "object":
  //       if (Array.isArray(value)) {
  //         value = value.shift();
  //       }
  //       if (!value || typeof value !== "object") {
  //         value = {};
  //       }
  //       break;
  //
  //     case "array":
  //       if (!value) {
  //         value = [];
  //       } else if (!Array.isArray(value)) {
  //         value = [value];
  //       }
  //       break;
  //
  //     case "number":
  //       if (Array.isArray(value)) {
  //         value = value.shift();
  //       }
  //       if (!value || isNaN(value)) {
  //         value = 0;
  //       }
  //       break;
  //
  //     case "boolean":
  //       if (Array.isArray(value)) {
  //         value = value.shift();
  //       }
  //       value = !!value;
  //       break;
  //   }
  //
  //   if (typeof value !== "string") {
  //     value = JSON.stringify(value);
  //   }
  //
  //   return value;
  // }

  stringify(value) {

    let datatype = this.resource.datatype || this.datatype;

    switch (datatype) {
      case "object":
        return JSON.stringify(value || {});
      case "array":
        return JSON.stringify(value || []);
      case "number":
        return value || 0;
      case "boolean":
        return value || false;
      default:
        return value || "";
    }

  }

  parse(value) {
    switch (this.resource.datatype || this.datatype) { // || this.resource.datatype) {
      case "object":
        return value && JSON.parse(value) || {};
      case "array":
        return value && JSON.parse(value) || [];
      case "number":
        // return value && JSON.parse(value) || 0;
        return value || 0;
      case "boolean":
        // return value && JSON.parse(value) || false;
        return value || false;
      default:
        return value || "";
    }
  }

  getEmpty(datatype) {
    switch (datatype || this.resource.datatype || this.datatype) {
      case "object":
        return {};
      case "array":
        return [];
      case "number":
        return 0;
      case "boolean":
        return false;
      default:
        return "";
    }
  }

  convertTo(value, type) {
    return this.convert(value, this.resource.datatype || this.datatype, type);
  }

  convert(value, type1, type2) {

    if (type2 && type1 !== type2) {

      switch (type1) {
        case "object":
        case "array":
          if (type2 === "string") {
            return JSON.stringify(value);
          } else if (type2 === "array" || type2 === "object") {
            return value;
          }
          break;

        case "string":
          if (type2 === "object") {
            return JSON.parse(value || "{}");
          } else if (type2 === "array") {
            return JSON.parse(value || "[]");
          } else if (type2 === "number") {
            return parseFloat(value || 0);
          } else if (type2 === "boolean") {
            return Boolean(value);
          }
          break;

        case "number":
          if (type2 === "string") {
            return value.toString();
          } else if (type2 === "boolean") {
            return Boolean(value);
          }
          break;

        case "boolean":
          if (type2 === "string") {
            return value ? "1" : "";
          } else if (type2 === "number") {
            return value ? 1 : 0;
          }
          break;

      }

      return null;

    }

    return value;

  }

  prepare(value) {

    let datatype = this.resource.datatype || this.datatype;

    if (Array.isArray(value)) {
      if (datatype !== "array") {
        return value.shift();
      }
    } else {
      if (datatype === "array") {
        return [value];
      }
    }
    return value;

  }

  sanitize(value, context) {
    if (context === "input") {
      return this.convert(value, this.resource.output_datatype || typeof value, this.resource.datatype || this.datatype);
    } else { // "import"
      return this.convert(value, typeof value, this.resource.datatype || this.datatype);
    }
  }

  build() {

    let field = this;
    if (this.render) {
      return {
        render: function() {
          field.render(this.element, field);
        }
      }
    } else {

      console.log(this);
    }
    // if (KarmaFieldsAlpha.renderers[this.resource.type || "group"]) {
    //   return {
    //     render: KarmaFieldsAlpha.renderers[this.resource.type || "group"]
    //   }
    // }
    // return KarmaFieldsAlpha.templates[this.resource.type || "group"](this);
  }

  // history API
  saveHistory() {
    this.triggerEvent("history", true);
  }



  // getHistoryIndex() {
  //   let driver = this.getRoot().resource.driver;
  //   return KarmaFieldsAlpha.History.getDriverIndex(driver);
  // }
  // historySave() {
  //   let index = KarmaFieldsAlpha.History.getIndex(field);
  //   this.history[index] = this.getValue();
  // }
  //
  // historyGo(index) {
  //   if (this.history[index]) {
  //     this.setValue(this.history[index], "undo");
  //   }
  //   this.children.forEach(function(child) {
  //     child.historyGo(index);
  //   });
  // }
  //
  // historyDelete(index) {
  //   this.history[index] = undefined;
  //   this.children.forEach(function(child) {
  //     child.historyDelete(index);
  //   });
  // }

  // query API
  queryOptions(driver, params) {
    return KarmaFieldsAlpha.Form.fetch(driver, "querykey", params);
  }

  queryKey(driver, path) {
    return KarmaFieldsAlpha.Form.get(driver, path);
  }


  init(element) {
    this.triggerEvent("init", 1, this, element);
  }


  // option API
  hasOptions() {
    return this.data.options !== undefined;
  }
  getOptions() {
    return this.data.options || [];
  }
  setOptions(options) {

    this.data.options = options;
    this.triggerEvent("options");
  }
  // fetchOptions() {
  //   const field = this;
  //   if (this.resource.options) {
  //     this.setOptions(this.resource.options);
  //     return Promise.resolve(this.resource.options);
  //   }
  //   // if (this.resource.params) {
  //   //   Object.assign(params, this.resource.params);
  //   // }
  //   // if (this.resource.args) {
  //   //   Object.assign(params, this.resource.args);
  //   // }
  //   // Object.assign(params, this.triggerUp("optionparams"));
  //
  //   const params = this.getOptionsParams();
  //   this.startLoad();
  //   return this.triggerEvent("fetch", true, this, params).then(function(results) {
  //     field.setOptions(results.items || results || []);
  //     field.endLoad();
  //     return field.getOptions();
  //   });
  // }

  // hasFreshOptions(queryString) {
  //
  //   return queryString && (this.resource.options || queryString === this.getOptionsParamString());
  //   //
  //   // if (queryString) {
  //   //   if (this.resource.options) {
  //   //     return true;
  //   //   } else {
  //   //     return queryString !== this.getOptionsParamString();
  //   //   }
  //   // }
  //   // return false;
  // }

  getDriver() {
    return this.parent && this.parent.getDriver();
  }

  fetchOptions(params) {
    const field = this;

    if (!this.promiseOptions) {
      if (this.resource.options) {
        this.setOptions(this.resource.options);
        this.promiseOptions = Promise.resolve(this.getOptions()).then(function(options) {
          field.try("onOptions", options, "resource");
        });
      } else {
        const queryString = this.getOptionsParamString(params);
        const driver = this.getDriver();
        if (driver && queryString) {
          this.startLoad();
          this.promiseOptions = KarmaFieldsAlpha.Form.fetch2(driver, queryString).then(function(results) {
            field.setOptions(results.items || results || []);
            field.endLoad();
            field.try("onOptions", field.getOptions(), queryString);
            return field.getOptions();
          });
        } else {
          this.promiseOptions = Promise.resolve([]);
        }
      }
    }
    return this.promiseOptions;









    // if (!this.optionPromise) {
    //   if (this.resource.options) {
    //     this.setOptions(this.resource.options);
    //     this.optionPromise = Promise.resolve(this.resource.options);
    //   } else {
    //
    //     const params = this.getOptionsParams();
    //     this.startLoad();
    //     this.optionPromise = this.triggerEvent("fetch", true, this, params).then(function(results) {
    //       field.setOptions(results.items || results || []);
    //       field.endLoad();
    //       field.optionPromise = null;
    //       return field.getOptions();
    //     });
    //   }
    // }
    // return this.optionPromise;
  }

  // maybeFetchOptions(params) {
  //   if (this.hasOptions()) {
  //     return Promise.resolve(this.data.options);
  //   } else {
  //     return this.fetchOptions(params);
  //   }
  // }

  getOptionsParams(params) {
    if (!params) {
      params = {key: this.resource.key};
    }
    if (this.resource.params) {
      Object.assign(params, this.resource.params);
    }
    if (this.resource.args) {
      Object.assign(params, this.resource.args);
    }

    Object.assign(params, this.triggerUp("optionparams", this));
    // return KarmaFieldsAlpha.form.encodeParams(params);
    return params;
  }

  getOptionsParamString(params) {
    params = this.getOptionsParams(params);
    // let queryString = KarmaFieldsAlpha.Form.encodeParams(params);
    // const driver = this.getDriver();
    // if (driver && queryString) {
    //   return driver+"/deprecated"+queryString;
    // }
    return KarmaFieldsAlpha.Form.encodeParams(params);
  }

  clearOptions() {
    this.promiseOptions = undefined;
    // if (this.hasOptions()) {
    //   this.data.options = undefined;
    // } else if (this.children && this.children.length) {
    //   this.children.forEach(function(child) {
    //     child.clearOptions();
    //   });
    // }
  }


  // loading API
  startLoad() {
		this.loading++;
		this.triggerEvent("load", true, this, this.loading > 0);
	}

	endLoad() {
		this.loading--;
		this.triggerEvent("load", true, this, this.loading > 0);
	}

  // import/export API
  exportValue() {
    return this.getValue();
  }
  importValue(value, context) {
    this.setValue(value, context);
  }


};

KarmaFieldsAlpha.fields.field.fieldId = 1;
