
KarmaFieldsAlpha.fields.field = class Field {

  constructor(resource, parent, form) {
    this.parent = parent;
		this.children = [];
		this.resource = resource || {};
		this.data = {}; // deprecated
    this.delta = {}; // deprecated (moved to Form)
    this.base = {}; // deprecated
		this.events = {};
    this.loading = 0; // deprecated
    this.history = {}; // deprecated
    // this.historyIndex = 0;
    this.datatype = "string";  // deprecated
		this.fieldId = Field.fieldId++;

    this.form = form || this;

    // this.path = this.getPath() || "";
    // this.driver = this.getDriver() || this;

    if (this.resource.value !== undefined) {
      // this.setValue(this.resource.value, "noop");
      this.initValue(this.resource.value);

      // this.setDeltaValue(this.resource.value);

      // this.setOriginal(this.resource.value);
    }

    this.initField();

    if (this.resource.children) {
  		for (let i = 0; i < this.resource.children.length; i++) {
  			this.createChild(this.resource.children[i]);
  		}
  	}

  }

  static getFieldClass(resource) {
    console.warn("Deprecated function getFieldClass. Use create");
    return new KarmaFieldsAlpha.fields[resource && resource.type || "group"];
  }

  static create(resource, parent, form) {
    return new KarmaFieldsAlpha.fields[resource && resource.type || "group"](resource, parent, form);
  }

  initField() {
	}

  getId() {
    return "karma-fields-"+this.fieldId;
  }

  addChild(child) {
    this.children.push(child);
    child.parent = this;
    // child.initField();  // -> ! rowField utilise initField pour ajouter un champs trash
  }

  addChildren(children) {
    children.forEach(child => {
      this.addChild(child);
    });
    // this.children = children;
    // for (let i = 0; i < children.length; i++) {
    //   children[i].parent = this;
    // }
  }

  createField(resource, parent) {
    console.warn("Deprecated function createField. Use createChild");
    return Field.create(resource, parent, this.form);
  }

  createChild(resource) {
    const child = Field.create(resource, this, this.form);
    this.addChild(child);
    return child;
  }

  // -> for dropdown in filters
  getRelatedValue(key) {
    let descendant = this.getDescendant(key);
    if (descendant) {
      return descendant.getValue();
    } else if (this.parent) {
      return this.parent.getRelatedValue(key);
    }
  }

  getDescendant(key) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].resource.key === key) {
        return this.children[i];
      } else if (!this.children[i].resource.key) {
        const descendant = this.children[i].getDescendant(key);
        if (descendant) {
          return descendant;
        }
      }
    }
  }

  getDescendants(key) {
    let descendants = [];
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].resource.key === key) {

        descendants.push(this.children[i]);
      } else if (!this.children[i].resource.key) {
        // const child = this.children[i].getDescendant(key);
        // if (child) {
        //   return child;
        // }
        descendants = descendants.concat(this.children[i].getDescendants(key));
      }
    }
    return descendants;
  }

  getSibling(key) {
    return this.parent && this.getChild(key);
  }

  getFieldsByPath(keys) {
		let key = keys.shift();
		let fields = this.getDescendants(key);
		if (keys.length > 0) {
			fields = fields.reduce((acc, field) => {
        acc = acc.concat(field.getFieldsByPath(keys));
        return acc;
      }, []);
		}
		return fields;
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

  getKeyPath(keys, useAlias) {
    if (!keys) {
      keys = [];
    } else if (!Array.isArray(keys)) {
      keys = [keys];
    }
    if (this.resource.key) {
      keys.unshift(useAlias && this.resource.alias || this.resource.key);
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

  contains(field) {
    return field && (field.parent === this || this.contains(field.parent));
  }

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

  }


  try(eventName, ...params) {
    if (this[eventName] && typeof this[eventName] === "function") {
      // console.error("Deprecated function try");
      return this[eventName](...params);
    }
  }

  bubbleUp(callback, ...params) {
    if (this[callback]) {
      return this[callback](...params);
    } else {
      return this.parent && this.parent.bubbleUp(callback, ...params);
    }
  }


  // not used
  updateDependency() {
    console.error("Deprecated function updateDependency");
  }

  // async getModifiedValue() {
  //   // const path = this.getPath();
  //   // const rawValue = this.read();
  //   // if (rawValue !== undefined && rawValue !== this.originalValue) {
  //   //   return this.parse(rawValue);
  //   // }
  //
  //   debugger;
  //
  //   const deltaValue = this.getDeltaValue();
  //   if (deltaValue !== undefined) {
  //     const baseValue = await this.getRawBaseValue();
  //     if (deltaValue !== baseValue) {
  //       return this.parse(deltaValue);
  //     }
  //   }
  // }

  getModifiedValue() {
    return this.parent && this.parent.getModifiedValue();
  }
  hasModifiedValue() {
    return this.parent && this.parent.hasModifiedValue();
  }

  // maybe deprecated -> use setValue
  updateOriginal() {
    console.error("Deprecated function updateOriginal");
  }



  isModified() {
    // console.warn("Deprecated function isModified");
    // return this.read(this.getPath()) !== this.originalValue;
    const value = this.getValue();
    return value !== undefined && value !== this.getOriginal();
  }

  // getValue() {
  //   // console.warn("Deprecated function getValue");
  //   let value;
  //   let rawValue = this.read();
  //   if (rawValue === undefined) {
  //     rawValue = this.originalValue;
  //   }
  //   if (rawValue === undefined) {
  //     value = this.getDefault();
  //   } else {
  //     value = this.parse(rawValue);
  //   }
  //
  //   return value;
  // }



  clearValue() {
    console.warn("Deprecated function clearValue");
  }

  // depreacated
  hasValue() {
    console.warn("Deprecated function hasValue");
    return this.read(this.getPath()) !== undefined;
  }

  readPath(path) {
    console.error("Deprecated function readPath");
    if (this.parent) {
      return this.parent.readPath(path);
    }
  };

  read() {
    console.error("Deprecated function read");
    const path = this.getPath();
    return this.readPath(path);
  };

  writePath(path, rawValue) {
    console.error("Deprecated function writePath");
    if (this.parent) {
      return this.parent.writePath(path, rawValue);
    }
  };

  write(rawValue) {
    console.error("Deprecated function write");
    const path = this.getPath();
    this.parent.writePath(path, rawValue);
  };

  async getFromPath(path) {
    console.error("Deprecated function getFromPath");

    const value = await KarmaFieldsAlpha.Form.get(this.resource.driver || "nodriver", path);


    if (this.parent) {
      return this.parent.getFromPath(path);
    }
  };

  get() {
    console.error("Deprecated function get");
    const path = this.getPath();
    return path.length && this.parent && this.parent.getFromPath(path) || Promise.resolve();
  };

  initValue(value, updateField) {
    if (value !== undefined) {
      value = this.convert(value);

      // this.setDeltaValue(value);
      this.setOriginal(value);

      this.modified = false;

      if (updateField) {
        this.try("onModified", false);
        this.try("onSet", value);
      }
    }
  }

  async getDefault() {
    if (this.resource.default !== undefined) {
      return this.resource.default;
    }
    return this.getEmpty();
  }

  async validate(value) {
    return value;
  }

  async load(promise) {
    this.try("onLoad", true);
    const result = await promise;
    this.try("onLoad", false);
    return result;
  }

  updateChangeValue(value) {
    console.error("Deprecated function updateChangeValue");
  }

  setValueAsync(value, updateSelf, noBubble) {
    console.warn("Deprecated function setValueAsync.");

    if (updateSelf) {
      this.updateValue(value);
    } else {
      this.changeValue(value, noBubble);
    }

  }

  saveValue(value, updateSelf, noBubble) {
    console.warn("Deprecated function saveValue.");

    if (updateSelf || noBubble) {
      console.error("Deprecated function saveValue.");
    }

    this.changeValue(value);

  }

  getValue() {
    return this.getDeltaValue() ?? this.getOriginal();
  }

  setValue(value) {
    this.setDeltaValue(value);
  }

  async changeValue(value) {
    // no validation
    this.setValue(value);
    const originalValue = this.getOriginal();

    this.modified = value !== originalValue;

    // this.try("onModified", value === originalValue);
    // await this.load(this.bubble("change", this, value));
    await this.bubble("change", this, value);
  }

  editValue(value) {
    // no validation
    this.setValue(value);
    const originalValue = this.getOriginal();
    this.modified = value !== originalValue;
    return this.edit();
  }

  async updateValue(value) {
    // value = await this.load(this.validate(value));
    value = await this.validate(value);

    this.setValue(value);
    const originalValue = this.getOriginal();

    this.modified = value === originalValue;

    // this.try("onSet", value);
    // this.try("onModified", value === originalValue);
  }

  edit() {
    return this.parent && this.parent.edit();
  }

  async getValueAsync() {
    return this.getDeltaValue() ?? this.getOriginal() ?? this.fetchValue() ?? this.getDefault();
  }

  getOriginal() {
    return this.getFormOriginal();
  }

  setOriginal(value) {
    this.setFormOriginal(value);
  }

  getFormOriginal(keys) {
    keys = this.getKeyPath(keys, true);
    return this.parent && this.parent.getFormOriginal(keys);
  }

  setFormOriginal(value, keys) {
    keys = this.getKeyPath(keys);
    this.parent && this.parent.setFormOriginal(value, keys);
  }

  async fetchValue() {
    let value = await this.getRemoteValue();
    value = this.prepare(value);
    if (value !== undefined) {
      value = this.convert(value);
      this.setOriginal(value);
    }
    return value;
  }

  // async getRawBaseValue() {
  //   let rawValue = this.getCache();
  //   if (rawValue === undefined) {
  //     let value = await this.getRemoteValue();
  //     value = this.prepare(value);
  //     if (value !== undefined) {
  //       value = this.convert(value);
  //       rawValue = this.stringify(value);
  //       this.setCache(rawValue);
  //     }
  //   }
  //   return rawValue;
  // }


  getRemoteValue(keys) {
    keys = this.getKeyPath(keys, true);
    return this.parent && this.parent.getRemoteValue(keys);
  }

  // setRemoteValue(rawValue, keys) {
  //   keys = this.getKeyPath(keys);
  //   this.parent && this.parent.setRemoteValue(rawValue, keys);
  //   // this.driver.base[this.path] = Promise.resolve(rawValue);
  // }

  getRawValue() {
    console.error("Deprecated function getRawValue");

    // let rawValue = this.read();
    // if (rawValue === undefined) {
    //   rawValue = this.originalValue;
    // }
    // return rawValue;
  }

  // async update() {
  //   let value;
  //   let rawValue = this.getRawValue();
  //
  //   if (rawValue === undefined) {
  //     value = await this.load(this.getRemoteValue());
  //
  //     if (value === undefined) {
  //       value = this.getDefault();
  //     }
  //   } else {
  //     value = this.parse(rawValue);
  //   }
  //
  //   value = await this.load(this.validate(value));
  //   const validRawValue = this.stringify(value);
  //
  //   // only save if value is different
  //   if (validRawValue !== rawValue) {
  //
  //     rawValue = validRawValue;
  //     this.write(rawValue);
  //     await this.load(Promise.resolve(this.bubble("change", this, value)));
  //   }
  //
  //   this.try("onModified", rawValue === this.originalValue);
  //   this.try("onSet", value);
  //
  //   return value;
  // }

  async update() {

    // let deltaValue = this.getDeltaValue();
    // let baseValue = await this.load(this.getRawBaseValue());
    // let value;
    //
    // if (deltaValue !== undefined) {
    //   value = this.parse(deltaValue);
    // } else if (baseValue !== undefined) {
    //   value = this.parse(baseValue);
    //   value = await this.load(this.validate(value));
    // } else {
    //   value = await this.getDefault();
    // }
    //
    // const validRawValue = this.stringify(value);
    //
    // // only save if deltaValue is undefined
    // if (deltaValue === undefined) {
    //   this.setDeltaValue(validRawValue);
    //   await this.load(Promise.resolve(this.bubble("change", this, value)));
    // }
    //
    // this.try("onModified", validRawValue === baseValue);
    // this.try("onSet", value);

    // debugger;

    let originalValue = this.getOriginal();
    let deltaValue = this.getValue();
    let value = deltaValue ?? originalValue;

      // console.log(this.getPath(), value);

    if (value === undefined) {
      // value = await this.load(this.fetchValue());


      value = await this.fetchValue();
    }
    if (value === undefined) {
      // value = await this.load(this.getDefault());
      value = await this.getDefault();
    } else {
      // value = await this.load(this.validate(value));
      value = await this.validate(value);
    }

    // only save if value is different
    if (value !== originalValue) {
      this.setValue(value);
      // await this.load(this.bubble("change", this, value));
    }

    this.modified = value !== originalValue;

    // this.try("onModified", value === originalValue);
    // this.try("onSet", value);

    return value;
  }

  getDeltaValue(keys) {
    keys = this.getKeyPath(keys, true);
    return this.parent && this.parent.getDeltaValue(keys);
  }

  setDeltaValue(rawValue, keys) {
    keys = this.getKeyPath(keys);
    this.parent && this.parent.setDeltaValue(rawValue, keys);
  }

  removeDeltaValue(keys) {
    keys = this.getKeyPath(keys);
    this.parent && this.parent.removeDeltaValue(keys);
  }


  // experimental
  getDeltaValue2() {
    const value = this.parent && this.parent.getDeltaValue2();
    if (value && this.resource.key) {
      return value[this.resource.key];
    }
    return value;
  }
  // experimental
  setDeltaValue2(value) {
    const wrap = this.parent && this.parent.getDeltaValue2();
    if (this.resource.key) {
      value = {[this.resource.key]: value};
    }
    if (wrap) {
      Object.assign(wrap, value);
    } else {
      this.parent.setDeltaValue2(value);
    }
  }




  getClosest(type) {
    console.error("Deprecated function getClosest");

  }

  findAncestor(callback) {
    console.error("Deprecated function findAncestor");

  }

  getRoot() {
    console.error("Deprecated function getRoot");

  }

  // not used !!
  fill() {
    console.error("Deprecated function fill");
    // this.initValue(this.getDefault());
  }

  convert(value) {
    return value;
  }

  stringify(value) {
    console.error("Deprecated function stringify");
    return value;
  }

  parse(value) {
    console.error("Deprecated function parse");
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

  render() {
    //
  }

  // history API
  saveHistory() {
    this.backup();
  }
  backup(keys) {
    keys = this.getKeyPath(keys);
    // if (!keys) {
    //   keys = [];
    // } else if (!Array.isArray(keys)) {
    //   keys = [keys];
    // }
    // if (this.resource.key) {
    //   keys.unshift(this.resource.key);
    // }
    // this.triggerEvent("history", true);
    // this.bubble("history", this, state);
    this.parent && this.parent.backup(keys);
  }



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

  async getRemoteOptions(queryString, driver) {
    return this.parent && this.parent.getRemoteOptions(queryString, driver);

    // this.promiseOptions = KarmaFieldsAlpha.Form.fetch2(driver, queryString).then(function(results) {
    //   field.setOptions(results.items || results || []);
    //   field.endLoad();
    //   field.try("onOptions", field.getOptions(), queryString);
    //   return field.getOptions();
    // });
  }


  getDriver() {
    console.error("Deprecated function getDriver.");
    // return this.parent && this.parent.getDriver();
  }


  // !! this method is specifique for dropdown
  async fetchOptions() {
    // const field = this;
    // const queryString = this.getOptionsParamString();
    // return this.fetch(queryString).then(function(options) {
    //   return options.items || options || [];
    //   //return field.prepareOptions(options.items || options || []);
    // });

    if (this.resource.options) {
      return this.resource.options;
    }

    const queryString = this.getOptionsParamString();
    const options = await this.getRemoteOptions(queryString);
    return options.items || options || [];
  }


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
      console.warn("deprecated args property");
      Object.assign(params, this.resource.args);
    }

    // Object.assign(params, this.triggerUp("optionparams", this, this.resource.optionparamlist));
    if (this.resource.optionparamlist) {
      this.resource.optionparamlist.reduce((acc, key) => {
        acc[key] = this.getRelatedValue(key);
        return acc;
      }, params);
    }


    return params;
  }

  getOptionsParamString(params) {

    if (this.resource.options) {
      return "resource";
    }
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
  async exportValue() {
    // const path = this.getPath();
    // let value = this.read(path);
    // value = this.parse(value || "");
    // return Promise.resolve(value);

    return this.getValueAsync();
  }

  importValue(value) {
    // this.setValue(value, context);
    // return this.saveValue(value, true, true);
    return this.updateValue(value);
  }



  // changeState(state) {
	// 	this.try("onState", state);
	// }

  // updateState(state) {
	// 	// this.try("onState", this.getState());
  //   this.try("onState", state);
	// }

  reset() {
    console.error("Deprecated function reset.");
		this.originalValue = undefined;
	}

  getState() {
    return this.parent && this.parent.getState() || this.state || "";
  }

  edit() {
    return this.parent && this.parent.edit();
  }
  submit() {
    return this.parent && this.parent.submit();
  }


};

KarmaFieldsAlpha.fields.field.fieldId = 1;
