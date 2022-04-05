
KarmaFieldsAlpha.fields.field = class Field {

  constructor(resource, parent, deprecated = null) {
    this.parent = parent;
		this.children = [];
    this.childMap = {};
		this.resource = resource || {};

    this.listeners = [];

		this.fieldId = this.constructor.fieldId++;

    // if (this.resource.children) {
  	// 	for (let i = 0; i < this.resource.children.length; i++) {
  	// 		this.createChild(this.resource.children[i]);
  	// 	}
  	// }

  }

  // static create(resource, parent) {
  //   return new KarmaFieldsAlpha.fields[resource && resource.type || "group"](resource, parent);
  // }

  getId() {
    return "karma-fields-"+this.fieldId;
  }

  addChild(child) {
    this.children.push(child);
    // if (child.resource.id || child.resource.key !== undefined) {
    //   this.childMap[child.resource.id || child.resource.type+"-"+child.resource.key] = child;
    // }
    if (child.resource.id) {
      this.childMap[child.resource.id] = child;
    }
    child.parent = this;
  }

  // parseResource(resource) {
  //   if (typeof resource === "string") {
  //     resource = this.constructor[resource] || KarmaFieldsAlpha.fields.presets[resource];
  //   }
  //   return resource;
  // }

  createField(resource) {



    const type = resource.type || "group";

    if (!KarmaFieldsAlpha.fields[type]) {
      console.error("Field type does not exist", resource.type);
    }

    return new KarmaFieldsAlpha.fields[type](resource);
  }

  createChild(resource) {

    // if (typeof resource === "string" && KarmaFieldsAlpha.fields.presets[resource]) {
    //   resource = KarmaFieldsAlpha.fields.presets[resource];
    // }

    // let child = this.childMap[resource.id || resource.type+"-"+resource.key];
    let child = this.childMap[resource.id];

    if (!child) {

      // const type = resource.type || "group";
      //
      // if (!KarmaFieldsAlpha.fields[type]) {
      //   console.error("Field type does not exist", resource.type);
      // }
      //
      // child = new KarmaFieldsAlpha.fields[type](resource, this);

      child = this.createField(resource);

      this.addChild(child);
    }

    return child;
  }

  updateChildren() {
    // noop
  }

  // getForm() {
  //   return this.parent && this.parent.getForm();
  // }
  //
  // getGateway() {
	// 	return this.parent && this.parent.getGateway();
	// }


  getDescendants() {
    const gen = function * (field) {
      for (let child of field.children) {
        if (child.resource.key !==  undefined) {
          yield child;
        } else {
          yield * gen(child);
        }
      }
    }
    return gen(this) || [];
  }

  getResourceKeys(resource) {
    if (resource.key !== undefined) {
      return [resource.key];
    } else if (resource.children) {
      return resource.children.reduce((array, item) => {
        return [
          ...array,
          ...this.getResourceKeys(item)
        ];
      }, []);
    }
    return [];
  }

  getSubResources(resource) {
    if (resource.children) {
      return resource.children.reduce((array, item) => {
        if (item.key !== undefined) {
          return [...array, item];
        } else {
          return [
            ...array,
            ...this.getSubResources(item)
          ];
        }
      }, []);
    }
    return [];
  }

  getChild(id, ...path) {
    let child = this.childMap[id];

    // if (path.length) {
    //   child = child || [...this.getDescendants()].find(child => child.resource.id === id);
    //   child = child && child.getChild(...path);
    // }

    return child;
  }

  getRelativeParent() {
    if (this.resource.key !==  undefined || !this.parent) {
			return this;
		} else {
			return this.parent.getRelativeParent();
		}
  }

  getPath() {
    let path = this.parent && this.parent.getPath() || [];
    if (this.resource.key !==  undefined) {
      path.push(this.resource.key);
    }
    return path;
  }

  getDefault() {
    return this.resource.default || "";
  }

  // write(...path) {
  //   // compat
  //   this.setState(null, ...path, "write");
  // }
  //
  // async save(value, ...path) {
  //   // compat
  //   this.setState(value, ...path, "save");
  // }
  //
  // async send(value, ...path) {
  //   // compat
  //   this.setState(value, ...path, "submit");
  // }
  //
  //
  // getEmpty() {
  //   return "";
  // }

  build() {
    if (this.resource.children) {
      return this.createChild(this.resource.children[0] || {type: "field"}).build();
    }
    return {};
  }

  render() {
    // noop
  }

  // backup(...path) {
  //   // keys = this.getKeyPath(keys);
  //   // if (this.resource.key) {
  //   //   path = [this.resource.key, ...path];
  //   // }
  //   // if (this.parent) {
  //   //   return this.parent.backup(...path);
  //   // }
  //   this.setState(null, ...path, "backup");
  // }


  // !! this method is specifique for dropdown
  async fetchOptions(driver) {

    if (this.resource.options) {
      return this.resource.options;
    }

    let queryString = await this.getOptionsParamString();

    const options = await KarmaFieldsAlpha.Gateway.getOptions(driver+"?"+queryString);

    return options.items || options || []; // compat
  }

  getDriver() {
    return this.resource.driver || this.parent && this.parent.getDriver();
  }

  async getOptionsParamString(args) {

    const params = new URLSearchParams({...args, ...this.resource.params});

    // // deprec
    // const dependencies = this.resource.optionparamlist || this.resource.dependencies;
    // if (dependencies) {
    //   dependencies.forEach(key => {
    //     const value = this.parent && this.parent.getValue(null, key);
    //     // const value = KarmaFieldsAlpha.History.getParam(key);
    //     if (value) {
    //       params.set(key, value);
    //     }
    //   });
    // }
    //
    // // deprec
    // if (this.resource.dependency) {
    //   const value = this.parent && await this.parent.fetchValue(null, this.resource.dependency);
    //   if (value) {
    //     params.set(this.resource.dependency, value);
    //   }
    // }

    if (this.resource.filters) {
      this.resource.filters.forEach(filter => {
        if (KarmaFieldsAlpha.Nav.hasParam(filter)) {
          params.set(filter, KarmaFieldsAlpha.Nav.getParam(filter));
        }
      });
    }

    return params.toString();

  }

  // // import/export API
  // async exportValue() {
  //   return this.get(0);
  // }
  //
  // async importValue(value) {
  //   await this.set(value, 0);
  // }



  // à supprimer
  // async edit(value, ...path) {
  //   if (this.resource.key) {
  //     path = [this.resource.key, ...path];
  //   }
  //   return this.parent && this.parent.edit(value, ...path);
  // }


  // async update() {
  //   for (let child of this.children) {
  //     await child.update();
  //   }
  //
  //   // console.log(this.resource);
  //
  //   await this.updateState();
  //
  // }

  // async updateState() {
  //
  //   if (this.resource.active && this.activate && this.parent) {
  //     this.activate(await this.parent.check(this.resource.active));
  //   }
  //
  //   if (this.resource.disabled && this.disable && this.parent) {
  //     this.disable(await this.parent.check(this.resource.disabled));
  //   }
  //
  //   if (this.resource.hidden && this.hide && this.parent) {
  //     this.hide(await this.parent.check(this.resource.hidden));
  //   }
  //
  // }

  // async setEventListener(listener) {
  //   const event = this.createEvent();
  //   event.action = "listen";
  //   event.callback = listener;
  //   await this.dispatch(event);
  // }
  //
  //
  // async triggerListeners() {
  //   for (let listener of this.listeners) {
  //     await listener();
  //   }
  // }



  // update() {
  //   for (let child of this.children) {
  //     child.update();
  //   }
  // }



  // nextup(value) {
  //   //compat
  //   this.setState(value, "nextup");
  // }

  // fetchState(value, ...path) {
  //   //compat
  //   return this.getState(...path, value);
  // }

  // getState(...path) {
  //   if (this.resource.key !== undefined) {
  //     path = [this.resource.key, ...path];
  //   }
  //   if (this.parent) {
  //     return this.parent.getState(...path);
  //   }
  // }
  //
  // async setState(value, ...path) {
  //   if (this.resource.key !== undefined) {
  //     path = [this.resource.key, ...path];
  //   }
  //   if (this.parent) {
  //     await this.parent.setState(value, ...path);
  //   }
  // }

  // getState(key) {
  //   if (this.parent) {
  //     return this.parent.getState(key);
  //   }
  // }
  //
  // async setState(value, key) {
  //   if (this.parent) {
  //     await this.parent.setState(value, key);
  //   }
  // }


  getParam(key) {
    return KarmaFieldsAlpha.Nav.getParam(key);
  }

  setParam(value, key) {
    if (value) {
      KarmaFieldsAlpha.Nav.setParam(key, value);
    } else {
      KarmaFieldsAlpha.Nav.removeParam(key);
    }

  }

  hasParam(key) {
    return KarmaFieldsAlpha.Nav.hasParam(key);
  }

  removeParam(key) {
    KarmaFieldsAlpha.Nav.removeParam(key);
  }

  // getValue(...path) {
  //   return this.get(...path, this.resource.context || "value");
  // }
  //
  // async setValue(value, ...path) {
  //   await this.set(value, ...path, this.resource.context || "value");
  // }

  // // async
  // getNEW(...path) {
  //   if (this.resource.key) {
  //     path = [this.resource.key, 0, ...path];
  //   }
  //   if (this.parent) {
  //     return this.parent.get(...path);
  //   }
  // }

  // async
  // get(...path) {
  //   if (this.resource.key !== undefined) {
  //     path = [this.resource.key, ...path];
  //   }
  //   // if (this.index !== undefined) {
  //   //   path = [this.index, ...path];
  //   // }
  //   if (this.parent) {
  //     return this.parent.get(...path);
  //   }
  // }


  // // async
  // setNEW(value, ...path) {
  //   if (this.resource.key) {
  //     path = [this.resource.key, ...path];
  //   }
  //   if (this.parent) {
  //     return this.parent.set(value, ...path);
  //   }
  // }

  // async
  // async set(value, ...path) {
  //   if (this.resource.key !== undefined) {
  //     path = [this.resource.key, ...path];
  //   }
  //   // if (this.index !== undefined) {
  //   //   path = [this.index, ...path];
  //   // }
  //   if (this.parent) {
  //     await this.parent.set(value, ...path);
  //   }
  // }

  // check(state) {
	// 	if (!this.states) {
	// 		this.states = {};
	// 	}
	// 	if (!this.states[state]) {
	// 		// const context = this.resource.context || "value";
	// 		// let matches = state.match(/^(.*?)(=|<|>|!=|<=|>=|!|\?|:in:|:notin:||::)(.*)$/);
  //     let matches = state.match(/^(.*?)(=|<|>|!=|<=|>=|!|\?)(.*)$/);
	//     if (matches) {
	//       switch (matches[2]) {
  //         case "=":
  //           this.states[state] = () => this.get(matches[1]).then(value => value[0] === matches[3]);
	//           break;
	//         case "<":
  //           this.states[state] = () => this.get(matches[1]).then(value => value[0] < matches[3]);
	//           break;
	//         case ">":
  //           this.states[state] = () => this.get(matches[1]).then(value => value[0] > matches[3]);
	//           break;
	//         case "!=":
  //           this.states[state] = () => this.get(matches[1]).then(value => value[0] !== matches[3]);
	//           break;
	//         case "<=":
  //           this.states[state] = () => this.get(matches[1]).then(value => value[0] <= matches[3]);
	//           break;
  //         case ">=":
  //           this.states[state] = () => this.get(matches[1]).then(value => value[0] >= matches[3]);
	//           break;
	//         case "!":
  //           this.states[state] = () => this.get(matches[3]).then(value => !value[0]);
	//           break;
	// 				case "?":
  //           this.states[state] = () => this.get(matches[3]).then(value => Boolean(value[0]));
	//           break;
	// 				// case ":in:":
  //         //   this.states[state] = () => this.get(matches[3]).then(value => value.includes(value[0]));
  //         //   break;
	// 				// case ":notin:":
  //         //   this.states[state] = () => this.get(matches[3]).then(value => !value.includes(value[0]));
	//         //   break;
  //         // case "::":
  //         //   this.states[state] = () => Promise.all(this.get(matches[1]), this.get(matches[3])).then(values => values[0][0] === values[1][0]);
	//         //   break;
	//       }
	//     } else {
  //       this.states[state] = () => this.get(state).then(value => Boolean(value[0]));
	// 		}
	// 	}
	// 	return this.states[state]();
  // }

  // check(state) {
	// 	if (!this.states) {
	// 		this.states = {};
	// 	}
	// 	if (!this.states[state]) {
  //     let matches = state.match(/^(.*?)(=|<|>|!=|<=|>=|!|\?|:|!:)(.*)$/);
	//     if (matches) {
	//       switch (matches[2]) {
  //         case "=":
  //           this.states[state] = () => this.get(matches[1], 0).then(value => value === matches[3]);
	//           break;
	//         case "<":
  //           this.states[state] = () => this.get(matches[1], 0).then(value => value < matches[3]);
	//           break;
	//         case ">":
  //           this.states[state] = () => this.get(matches[1], 0).then(value => value > matches[3]);
	//           break;
	//         case "!=":
  //           this.states[state] = () => this.get(matches[1], 0).then(value => value !== matches[3]);
	//           break;
	//         case "<=":
  //           this.states[state] = () => this.get(matches[1], 0).then(value => value <= matches[3]);
	//           break;
  //         case ">=":
  //           this.states[state] = () => this.get(matches[1], 0).then(value => value >= matches[3]);
	//           break;
	//         case "!":
  //           this.states[state] = () => this.get(matches[3], 0).then(value => !value);
	//           break;
	// 				case "?":
  //           this.states[state] = () => this.get(matches[3], 0).then(value => Boolean(value));
	//           break;
  //         case ":":
  //           this.states[state] = () => this.getState(matches[3]).then(value => Boolean(value));
	//           break;
  //         case "!:":
  //         console.log(matches);
  //           this.states[state] = () => this.getState(matches[3]).then(value => !value);
	//           break;
	// 				// case ":in:":
  //         //   this.states[state] = () => this.get(matches[3]).then(value => value.includes(value[0]));
  //         //   break;
	// 				// case ":notin:":
  //         //   this.states[state] = () => this.get(matches[3]).then(value => !value.includes(value[0]));
	//         //   break;
  //         // case "::":
  //         //   this.states[state] = () => Promise.all(this.get(matches[1]), this.get(matches[3])).then(values => values[0][0] === values[1][0]);
	//         //   break;
	//       }
	//     } else {
  //       this.states[state] = () => this.get(state, 0).then(value => Boolean(value));
	// 		}
	// 	}
	// 	return this.states[state]();
  // }

  async backup(...path) {
    const event = this.createEvent({
      action: "backup"
    });

    await this.dispatch(event);
  }

  async save(id) {
    const event = this.createEvent({
      action: "save",
      id: id
    });

    await this.dispatch(event);
  }

  async isModified() {
    const event = this.createEvent({
      action: "modified",
      type: "boolean"
    });

    await this.dispatch(event);

    return event.getBoolean();
  }

  async check(condition) {
    let not, key, compare, value, action, type, path;

    if (typeof condition === "string") {

      [,not, key, compare, value] = condition.match(/^(!?)(.*?)(=|!=|$)(.*?)$/);

      if (key === "modified") {

        action = key;
        type = "boolean";

      } else {

        path = [key];

      }

    } else {

      ({not, compare, value, action, type, path} = condition);

    }

    const event = this.createEvent({
      action: action || "get",
      type: type || "string",
      path: path || []
    });

    await this.dispatch(event);

    if (not) {
      return !event.getBoolean();
    } else if (compare === "=") {
      return event.getValue() === value;
    } else if (compare === "!=") {
      return event.getValue() !== value;
    } else if (compare === "<") {
      return event.getValue() < value;
    } else if (compare === ">") {
      return event.getValue() > value;
    } else if (compare === "<=") {
      return event.getValue() <= value;
    } else if (compare === ">=") {
      return event.getValue() >= value;
    } else if (compare === "in") {
      return event.getArray().indexOf(value) > -1;
    } else if (compare === "notin") {
      return event.getArray().indexOf(value) === -1;
    } else {
      return event.getBoolean();
    }

  }


  createEvent(args) {
    // return new KarmaFieldsAlpha.Event({
    //   default: this.getDefault(),
    //   autosave: this.resource.autosave,
    //   ...args
    // }, this);
    return new KarmaFieldsAlpha.Event(args, this);
  }

  // async dispatchEvent(args) {
  //   const event = this.createEvent(args);
  //   return this.dispatch(event);
  // }

  async dispatch(event, parent) {
    if (this.resource.key !== undefined) {
      if (event.path[0] === "..") {
        event.path.shift();
      } else {

        event.path.unshift(this.resource.key);
      }
      // event.path = [this.resource.key, ...event.path];
    }
    if (this.parent) {
      await this.parent.dispatch(event, this);

      // if (event.splash) {
      //   for (let child of this.parent.children) {
      //     if (child !== this) {
      //       await child.splash(event);
      //     }
      //   }
      // }

    }

    return event;
  }


  async splash(request) {
    // noop
  }



};

KarmaFieldsAlpha.fields.field.fieldId = 1;

// KarmaFieldsAlpha.Value = class {
//
//   constructor(value = []) {
//     if (!Array.isArray(value)) {
//       value = [value];
//     }
//     this.array = value;
//   }
//
//   getArray() {
//     return this.array;
//   }
//
//   getValue() {
//     return this.array[0];
//   }
//
//   equal(value) {
//     return this.array[0] === value;
//   }
//
//   toString() {
//     return this.array.toString();
//   }
//
//
// }

// KarmaFieldsAlpha.fields.field.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
