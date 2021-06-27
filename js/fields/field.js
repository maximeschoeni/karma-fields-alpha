
KarmaFieldsAlpha.fields.field = class Field {

  constructor(resource, domain, parent) {
    this.domain = domain || new KarmaFieldsAlpha.Domain(); // deprecated
    this.parent = parent;
		this.children = [];
		this.resource = resource || {};
		this.data = {}; // deprecated
		this.events = {};
    this.loading = 0; // deprecated
    this.history = {}; // deprecated
    // this.historyIndex = 0;
    this.datatype = "string";  // deprecated
		this.fieldId = Field.fieldId++;


    this.events.get = function(keys, origin) {
      console.error("Deprecated event get. Use function get");

      // if (this.resource.key) {
      //   keys.unshift(this.resource.key);
      // }
      // return this.triggerUp("get", keys, origin);
    };

    if (this.resource.value !== undefined) {
      // this.setValue(this.resource.value, "noop");
      this.initValue(this.resource.value);
    }

    this.path = this.getPath();

    this.initField();

    if (this.resource.children) {
  		for (let i = 0; i < this.resource.children.length; i++) {
  			this.createChild(this.resource.children[i]);
  		}
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
    console.warn("Deprecated function getFieldClass. Use create");
    return new KarmaFieldsAlpha.fields[resource && resource.type || "group"];
  }

  static create(resource, domain, parent) {
    return new KarmaFieldsAlpha.fields[resource && resource.type || "group"](resource, domain, parent);
  }

  initField() {
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

  createField(resource, parent) {
    console.warn("Deprecated function createField. Use createChild");
    return Field.create(resource, this.domain, parent);
  }

  createChild(resource) {
    const child = Field.create(resource, this.domain, this);
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
    console.warn("Deprecated function getDirectChild. Use getChild");
    return this.getChild(key);
  }

  getChild(key) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].resource.key === key) {
        return this.children[i];
      }
    }
  }

  getPath() {
    let keys = this.parent && this.parent.getPath() || [];
    if (this.resource.key) {
      keys.push(this.resource.key);
    }
    return keys;
  }


  triggerEvent(eventName, bubbleUp, target, ...params) {
    console.warn("Deprecated function triggerEvent");

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
    console.error("Deprecated function triggerDown");
    // this.children.forEach(function(child) {
    //   if (child.events[eventName] && typeof child.events[eventName] === "function") {
    //     child.events[eventName].call(child, ...params);
    //   } else {
    //     child.triggerDown(eventName, ...params);
    //   }
    // });
  }

  // dispatch(eventName, ...params) {
  //   const event = new KarmaFieldAlpha.Event(eventName, ...params);
  //   if (this.hooks[eventName]) {
  //     event.call()
  //   }
  //
  // }



  try(eventName, ...params) {
    if (this[eventName] && typeof this[eventName] === "function") {
      return this[eventName](...params);
    }
  }


  // not used
  updateDependency() {
    console.error("Deprecated function updateDependency");
  }

  getModifiedValue() {
    const path = this.getPath();
    const rawValue = this.read();
    if (rawValue !== undefined && rawValue !== this.originalValue) {
      return this.parse(rawValue);
    }

    // if (this.isModified()) {
    //   let value = this.getValue();
    //   // value = this.convert(value, this.datatype, this.resource.datatype);
    //   if (this.resource.output_datatype) {
    //     value = this.convert(value, this.resource.datatype || this.datatype, this.resource.output_datatype);
    //   }
    //   if (value !== null) {
    //     return value;
    //   }
    // }
  }

  // maybe deprecated -> use setValue
  updateOriginal() {
    console.error("Deprecated function updateOriginal");
  }



  isModified() {
    console.warn("Deprecated function isModified");
    return this.read(this.getPath()) !== this.originalValue;
  }

  // getDefaultRawValue() {
  //
  //   return this.resource.value && this.sanitize(this.resource.value);
  // }

  getValue() {
    // console.warn("Deprecated function getValue");
    let value = this.read();
    if (value === undefined) {
      value = this.getDefault();
    } else {
      value = this.parse(value);
    }
    return value;
  }

  // get(keys) {
  //   if (!keys) {
  //     keys = [];
  //   }
  //   if (this.resource.key) {
  //     keys.unshift(this.resource.key);
  //   }
  //   if (this.parent) {
  //     return this.parent.get(keys);
  //   }
  // }
  //
  // change(value) {
  //   const field = this;
  //   this.setValue(value);
  //   const promise = this.bubble("change", this);
  //   if (promise) {
  //     field.startLoad();
  //     return promise.then(function() {
  //       field.endLoad();
  //     });
  //   }
  // }



  fetchValue() {
    console.warn("Deprecated function fetchValue. Use update()");
    this.update();

    // const field = this;
    // if (!this.promiseValue) {
    //   let promise = this.get(); //bubble("get", [], this);
    //   if (promise) {
    //     field.startLoad();
    //     this.promiseValue = promise.then(function(value) {
    //       field.endLoad();
    //       value = field.prepare(value); //
    //       // value = field.convert(value, field.resource.output_datatype || typeof value, field.resource.datatype || field.datatype);
    //       value = field.sanitize(value, "input");
    //
    //       return field.validate(value).then(function() {
    //         if (value === null && !field.resource.null) {
    //           // value = field.getDefault();
    //           return field.fetchDefault().then(function(value) {
    //             if (value !== undefined) {
    //               field.change(value);
    //               field.try("onSet", value);
    //               field.triggerEvent("set"); // compat
    //             }
    //             // field.setValue(value);
    //             // field.triggerEvent("change", true);
    //             // field.triggerEvent("set");
    //
    //             // field.triggerEvent("modify");
    //             return value;
    //           });
    //         } else {
    //           field.setValue(value, "set");
    //           // field.try("onSet", value);
    //           // field.triggerEvent("set"); // compat
    //           // field.setValue(value, "set");
    //           // field.triggerEvent("set", value);
    //           // field.triggerEvent("modify");
    //           return value;
    //         }
    //       });
    //     });
    //   } else {
    //     this.promiseValue = field.fetchDefault().then(function(value) {
    //       // field.setValue(value);
    //       // field.triggerEvent("change", true);
    //
    //       // console.log(value);
    //
    //       field.try("onSet", value);
    //       field.triggerEvent("set"); // compat
    //       field.change(value);
    //     });
    //   }
    //
    //
    //   // let value = field.read();
    //   // if (value === undefined) {
    //   //
    //   //
    //   //
    //   // } else {
    //   //   value = field.parse(value);
    //   //
    //   //   field.try("onSet", value);
    //   //   this.triggerEvent("set"); // compat
    //   //   this.promiseValue = Promise.resolve(value);
    //   // }
    // }
    //
    // return this.promiseValue;
    //
    //
    // // return this.getDefault();
    //
    // //
    // //
    // //
    // // if (!this.promiseValue) {
    // //
    // //   let promise = this.bubble("get", [], this);
    // //
    // //   this.promiseValue = promise.then(function(value) {
    // //     field.endLoad();
    // //     value = field.prepare(value); //
    // //     value = field.convert(value, field.resource.output_datatype || typeof value, field.resource.datatype || field.datatype);
    // //     value = field.sanitize(value);
    // //     if (value === null && !field.resource.null) {
    // //       value = field.getDefault();
    // //       field.setValue(value);
    // //       field.triggerEvent("change", true);
    // //     } else {
    // //       field.setValue(value, "set");
    // //       // field.originalValue = field.getRawValue();
    // //     }
    // //     field.triggerEvent("set");
    // //     field.triggerEvent("modify");
    // //
    // //     return field.getValue();
    // //   });
    // // }
    // //
    // // if (this.promiseValue) {
    // //   field.startLoad();
    // //   return this.promiseValue
    // // } else {
    // //
    // //   return Promise.resolve(this.getDefault());
    // // }
  }

  clearValue() {
    console.warn("Deprecated function clearValue");
  }

  // depreacated
  hasValue() {
    console.warn("Deprecated function hasValue");
    return this.read(this.getPath()) !== undefined;
  }

  getDefault() {
    return this.resource.default || this.resource.value || this.getEmpty();
  }

  // fetchDefault() {
  //   return this.validate(this.getDefault());
  // }

  validate(value) {
    return Promise.resolve(value);
  }


  // read() {
  //   // const path = this.bubble("path");
  //   // return this.domain.readPath(path);
  //
  //   // return this.bubble("read", this.getPath());
  //
  //   // this.historyMin = Math.min(this.historyMax, this.domain.index);
  //   // while (this.history[this.historyMin] === undefined && this.historyMin > 0) {
  //   //   this.historyMin--;
  //   // }
  //   // return this.history[this.historyMin];
  // }

  // read(keys) {
  //   if (!keys) {
  //     keys = [];
  //   }
  //   if (this.resource.key) {
  //     keys.unshift(this.resource.key);
  //   }
  //   if (this.parent) {
  //     return this.parent.read(keys);
  //   }
  // };

  readPath(path) {
    if (this.parent) {
      return this.parent.readPath(path);
    }
  };

  read() {
    const path = this.getPath();
    return this.readPath(path);
  };

  writePath(path, rawValue) {
    if (this.parent) {
      return this.parent.writePath(path, rawValue);
    }
  };

  write(rawValue) {
    const path = this.getPath();
    this.parent.writePath(path, rawValue);
  };

  getFromPath(path) {
    if (this.parent) {
      return this.parent.getFromPath(path);
    }
  };


  get() {
    const path = this.getPath();
    return this.parent && this.parent.getFromPath(path) || Promise.resolve();
  };

  // save(value) {
  //   return this.bubble("save", this);
  //   // !
  //
  //   // return this.parent && this.parent.save(value);
  //   // if (this.parent) {
  //   //   const container = this.parent.save(value);
  //   // }
  //   // if (this.resource.key) {
  //   //   container[this.resource.key] = value;
  //   // }
  //   // return container;
  // };


  initValue(value, updateField) {
    if (value !== undefined) {
      value = this.convert(value);
      const rawvalue = this.stringify(value);
      this.write(rawvalue);
      this.originalValue = rawvalue;

      if (updateField) {
        this.try("onModified", true);
        this.try("onSet", value);
        // this.try("onState", this.getState());
      }
    }
  }


  changeValue(value) {
    return this.saveValue(value);
    // const field = this;
    // const path = this.getPath();
    // field.startLoad();
    //
    // return Promise.resolve(value).then(function(value) {
    //   return field.validate(value);
    // }).then(function(value) {
    //   if (value !== undefined) {
    //     const rawValue = field.stringify(value);
    //     field.write(path, rawValue);
    //     field.try("onModified", rawValue === field.originalValue);
    //     return field.bubble("change", field, value);
    //   }
    // }).then(function() {
    //   field.endLoad();
    // });
  }

  load(promise) {
    const field = this;
    this.loadingPromise = Promise.resolve(this.loadingPromise).then(function() {
      field.try("onLoad", true);
      return promise.then(function(result) {
        field.try("onLoad", false);
        return result;
      });
    });
    return this.loadingPromise;
  }

  updateChangeValue(value) {
    return this.saveValue(value, true);
    // const field = this;
    //
    // // field.startLoad();
    // //
    // // return Promise.resolve(value).then(function(value) {
    // //   return field.validate(value);
    // // }).then(function(value) {
    // //   if (value !== undefined) {
    // //     const rawValue = field.stringify(value);
    // //     field.write(path, rawValue);
    // //     field.try("onSet", value);
    // //     field.try("onModified", rawValue === field.originalValue);
    // //     return field.bubble("change", field, value);
    // //   }
    // // }).then(function() {
    // //   field.endLoad();
    // // });
    //
    // return this.load(field.validate(value).then(function(value) {
    //   if (value !== undefined) {
    //     const rawValue = field.stringify(value);
    //     const path = field.getPath();
    //     field.write(path, rawValue);
    //     field.try("onSet", value);
    //     field.try("onModified", rawValue === field.originalValue);
    //     return field.bubble("change", field, value);
    //   }
    // }));

  }

  updateValue(value) {
    return this.saveValue(value, true, true);

    // const field = this;
    // const path = this.getPath();
    // field.startLoad();
    // return Promise.resolve(value).then(function(value) {
    //   return field.validate(value);
    // }).then(function(value) {
    //   if (value !== undefined) {
    //     const rawValue = field.stringify(value);
    //     field.write(path, rawValue);
    //     field.try("onSet", value);
    //     field.try("onModified", rawValue === field.originalValue);
    //     field.endLoad();
    //     return value;
    //   }
    // });
  }

  saveValue(value, updateSelf, noBubble) {
    const field = this;
    return this.load(field.validate(value).then(function(value) {
      if (value !== undefined) {
        const rawValue = field.stringify(value);
        field.write(rawValue);
        if (updateSelf) {
          field.try("onSet", value);
        }
        field.try("onModified", rawValue === field.originalValue);
        // field.try("onState", field.getState());
        if (!noBubble) {
          return Promise.resolve(field.bubble("change", field, value)).then(function() {
            return value;
          });
        }
      }
      return value;
    }));
  }

  getValueAsync() {
    const field = this;
    let rawValue = field.read();
    if (rawValue === undefined) {
      return this.get().then(function(value) {
        value = field.prepare(value);
        if (value === undefined) {
          value = field.getDefault();
        }
        return value;
      });
    } else {
      return Promise.resolve(field.parse(rawValue));
    }
  }

  // updateTEST() {
  //   const field = this;
  //   let rawValue = field.read();
  //
  //   // console.log(rawValue, this.resource.key, this);
  // }

  update() {
    const field = this;
    const path = this.getPath();
    // console.log("update", path);
    // field.try("onState", field.getState());
    if (!path.length) {
      return Promise.resolve();
    }
    let rawValue = field.read();
    if (rawValue === undefined) {
      return this.load(this.get().then(function(value) {
        value = field.prepare(value);
        value = field.convert(value);
        return value;
      })).then(function(value) {
        if (value === undefined) {
          return field.saveValue(field.getDefault(), true, false);
        } else {
          return field.saveValue(value, true, true);
        }
      });
    } else {
      const value = field.parse(rawValue);
      field.try("onSet", value);
      field.try("onModified", rawValue === field.originalValue);
      return Promise.resolve(value);
    }
  }



  // update() {
  //   const field = this;
  //   const path = this.getPath();
  //   let rawValue = this.read(path);
  //   if (rawValue === undefined) {
  //     // value is unset
  //     field.startLoad();
  //     return this.get(path).then(function(value) {
  //       value = field.prepare(value);
  //
  //       if (value === undefined) {
  //         // value is not found
  //         value = field.getDefault();
  //       } else {
  //         rawValue = field.stringify(value);
  //         field.originalValue = rawValue;
  //       }
  //
  //       return Promise.resolve(value).then(function(value) {
  //
  //         return field.validate(value);
  //       }).then(function(value) {
  //         field.endLoad();
  //         if (value !== undefined) {
  //
  //           rawValue = field.stringify(value);
  //           field.write(path, rawValue);
  //           field.try("onSet", value);
  //           field.try("onModified", rawValue === field.originalValue);
  //           if (rawValue !== field.originalValue) {
  //             return field.bubble("change", field, value);
  //           }
  //         }
  //       });
  //     });
  //   } else {
  //     let value = field.parse(rawValue);
  //     field.try("onSet", value);
  //     field.try("onModified", rawValue === field.originalValue);
  //     return Promise.resolve();
  //   }
  // }

  setValue(value, context) { // context = {'change' | 'set' | 'undo'}

    console.warn("Deprecated function setValue");

    if (context === "set") {
      this.updateValue(value, true, true);
    } else {
      this.updateValue(value);
    }

    // return;
    //
    // let response;
    //
    // if (value === undefined) {
    //   return;
    // }
    //
    // // value = this.convert(value, typeof value, this.resource.datatype || this.datatype);
    // value = this.sanitize(value, "import");
    // value = this.stringify(value);
    //
    //
    // // if (!context) {
    // //   context = "change";
    // // }
    //
    // if (context === "change") {
    //   this.triggerEvent("history", true);
    // }
    //
    // this.write(value);
    //
    // // this.isDifferent = this.history[this.domain.index] !== value;
    //
    // if (context === "set") {
    //   this.originalValue = value;
    //   this.try("onSet", value);
    //   this.triggerEvent("set"); // compat
    //
    //   // this.triggerEvent("set");
    //   // this.saveHistory();
    //   // this.triggerEvent("set", true); // -> will save history
    //
    // }
    //
    // if (context === "undo") {
    //   this.triggerEvent("set");
    //   // this.triggerEvent("undo");
    // }
    //
    // if (context === "change" || context === "default") {
    //   response = this.triggerEvent("change", true);
    // }
    //
    //
    //
    //
    // // this.isModified = value !== this.originalValue;
    // // this.lastValue = value;
    //
    // // this.triggerEvent("set"); // -> reload node
    //
    // return response;
  }

  getClosest(type) {
    console.error("Deprecated function getClosest");

    // if (this.resource.type === type) {
    //   return this;
    // } else {
    //   return this.parent.getClosest(type);
    // }
  }

  findAncestor(callback) {
    console.error("Deprecated function findAncestor");
    // if (callback(this)) {
    //   return this;
    // } else if (this.parent) {
    //   return this.parent.findAncestor(callback);
    // }
  }

  getRoot() {
    console.error("Deprecated function getRoot");
    // if (this.parent) {
    //   return this.parent.getRoot();
    // } else {
    //   return this;
    // }
  }

  fill() {
    this.initValue(this.getDefault());
  }

  convert(value) {
    return value;
  }

  stringify(value) {
    return value;
  }

  parse(value) {
    return value;
  }

  getEmpty() {
    return "";
  }

  convertTo(value, type) {
    console.error("Deprecated function findAncestor");

    // return this.convert(value, this.resource.datatype || this.datatype, type);
  }

  prepare(value) {
    if (Array.isArray(value)) {
      return value.shift();
    }
    return value;
  }

  sanitize(value, context) {
    console.error("Deprecated function sanitize. Use validate");

    // if (context === "input") {
    //   return this.convert(value, this.resource.output_datatype || typeof value, this.resource.datatype || this.datatype);
    // } else { // "import"
    //   return this.convert(value, typeof value, this.resource.datatype || this.datatype);
    // }
  }

  // ??
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
  }

  // history API
  saveHistory() {
    this.backup();
  }
  backup() {
    // this.triggerEvent("history", true);
    this.bubble("history", this);
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
    console.error("Deprecated function queryOptions. Use ??");
    return KarmaFieldsAlpha.Form.fetch(driver, "querykey", params);
  }

  queryKey(driver, path) {
    console.error("Deprecated function queryOptions. Use ??");
    return KarmaFieldsAlpha.Form.get(driver, path);
  }


  init(element) {
    // this.triggerEvent("init", 1, this, element);
    this.bubble("init", this, element);
  }


  // option API
  hasOptions() {
    console.warn("Deprecated function hasOptions.");
    return this.data.options !== undefined;
  }
  getOptions() {
    console.warn("Deprecated function getOptions.");
    return this.data.options || [];
  }
  setOptions(options) {
    console.warn("Deprecated function setOptions.");
    this.data.options = options;
    this.triggerEvent("options");
  }

  fetch(queryString) {
    return this.parent && this.parent.fetch(queryString) || Promise.resolve([]);

    // this.promiseOptions = KarmaFieldsAlpha.Form.fetch2(driver, queryString).then(function(results) {
    //   field.setOptions(results.items || results || []);
    //   field.endLoad();
    //   field.try("onOptions", field.getOptions(), queryString);
    //   return field.getOptions();
    // });
  }


  getDriver() {
    console.error("Deprecated function getDriver.");
    return this.parent && this.parent.getDriver();
  }

  fetchOptions() {
    const field = this;
    const queryString = this.getOptionsParamString();
    return this.fetch(queryString).then(function(options) {
      return field.prepareOptions(options.items || options || []);
    });


    // const field = this;
    //
    // if (!this.promiseOptions) {
    //   if (this.resource.options) {
    //     this.setOptions(this.resource.options);
    //     this.promiseOptions = Promise.resolve(this.getOptions()).then(function(options) {
    //       field.try("onOptions", options, "resource");
    //     });
    //   } else {
    //     const queryString = this.getOptionsParamString(params);
    //     const driver = this.getDriver();
    //     if (driver && queryString) {
    //       this.startLoad();
    //       this.promiseOptions = KarmaFieldsAlpha.Form.fetch2(driver, queryString).then(function(results) {
    //         field.setOptions(results.items || results || []);
    //         field.endLoad();
    //         field.try("onOptions", field.getOptions(), queryString);
    //         return field.getOptions();
    //       });
    //     } else {
    //       this.promiseOptions = Promise.resolve([]);
    //     }
    //   }
    // }
    // return this.promiseOptions;





  }

  // maybeFetchOptions(params) {
  //   if (this.hasOptions()) {
  //     return Promise.resolve(this.data.options);
  //   } else {
  //     return this.fetchOptions(params);
  //   }
  // }

  prepareOptions(options) {
    return options;
  }

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
    // console.warn("Deprecated function fetchOptions.");
    params = this.getOptionsParams(params);
    // let queryString = KarmaFieldsAlpha.Form.encodeParams(params);
    // const driver = this.getDriver();
    // if (driver && queryString) {
    //   return driver+"/deprecated"+queryString;
    // }
    return KarmaFieldsAlpha.Form.encodeParams(params);
  }

  clearOptions() {
    console.error("Deprecated function clearOptions.");
    // this.promiseOptions = undefined;

  }


  // loading API
  startLoad() {
    console.error("Deprecated function startLoad.");

		this.loading++;
		// this.triggerEvent("load", true, this, this.loading > 0);
    this.try("onLoad", this.loading > 0);
	}

	endLoad() {
    console.error("Deprecated function endLoad.");

		this.loading--;
		// this.triggerEvent("load", true, this, this.loading > 0);
    this.try("onLoad", this.loading > 0);
	}

  // import/export API
  exportValue() {
    // const path = this.getPath();
    // let value = this.read(path);
    // value = this.parse(value || "");
    // return Promise.resolve(value);

    return this.getValueAsync();
  }

  importValue(value) {
    // this.setValue(value, context);
    return this.saveValue(value, true, true);
  }



  // changeState(state) {
	// 	this.try("onState", state);
	// }

  updateState() {
		this.try("onState", this.getState());
	}

  getState() {
    return this.parent && this.parent.getState();
  }



};

KarmaFieldsAlpha.fields.field.fieldId = 1;
