
KarmaFieldsAlpha.fields.field = class Field {

  static fieldId = 0;

  constructor(resource = {}, parent = null, deprecated = null) {
    this.parent = parent;
		this.children = [];
    this.childMap = {};
		this.resource = resource || {};

    // this.resource = {
    //   ...this.constructor.resource,
    //   ...resource
    // };

    this.listeners = [];

		this.fieldId = KarmaFieldsAlpha.fields.field.fieldId++;

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
    this.childMap[child.resource.id || child.resource.type] = child;

    child.parent = this;
  }

  // parseResource(resource) {
  //   if (typeof resource === "string") {
  //     resource = this.constructor[resource] || KarmaFieldsAlpha.fields.presets[resource];
  //   }
  //   return resource;
  // }

  getOrCreateChild(idOrResource) {
    return this.createChild(idOrResource);
  }

  createField(resource = {}) {





    // if (typeof resource === "string" && this.constructor[resource]) {
    //   return new this.constructor[resource]({
    //     id: resource
    //   });
    // }

    if (typeof resource === "string") {
      if (typeof this.constructor[resource] === "function" ) {
        return new this.constructor[resource]({
          id: resource
        });
      } else if (typeof this.constructor[resource] === "object") {
        return this.createField(this.constructor[resource]);
      }
    }



    const type = resource.type || "group";

    if (KarmaFieldsAlpha.fields[type]) {
      return new KarmaFieldsAlpha.fields[type](resource);
    }

    if (this.constructor[type] && typeof this.constructor[type] === "function") {
      return new this.constructor[type](resource);
    }

    if (this.constructor[type] && typeof this.constructor[type] === "object" && this.constructor[type].type !== type) {
      return this.createField({...this.constructor[type], ...resource, type: this.constructor[type].type});
    }

    if (this.parent) {
      return this.parent.createField(resource);
    }



    console.error("Field type does not exist", resource);

    // if (!KarmaFieldsAlpha.fields[type]) {
    //   console.error("Field type does not exist", resource.type);
    // }
    //
    // return new KarmaFieldsAlpha.fields[type](resource);
  }

  createChild(resource) {

    // if (typeof resource === "string" && KarmaFieldsAlpha.fields.presets[resource]) {
    //   resource = KarmaFieldsAlpha.fields.presets[resource];
    // }

    // if (typeof resource === "string") {
    //   resource = {
    //     id: resource,
    //     type: resource
    //   };
    // }

    // const id = typeof resource === "string" ? resource : resource.id;

    // let child = this.childMap[resource.id || resource.type+"-"+resource.key];
    let child = this.childMap[resource.id || resource];

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
    return KarmaFieldsAlpha.Resource.getSubResources(resource);
    // if (resource.children) {
    //   return resource.children.reduce((array, item) => {
    //     if (item.key !== undefined) {
    //       return [...array, item];
    //     } else {
    //       return [
    //         ...array,
    //         ...this.getSubResources(item)
    //       ];
    //     }
    //   }, []);
    // }
    // return [];
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
        if (KarmaFieldsAlpha.Nav.has(filter)) {
          params.set(filter, KarmaFieldsAlpha.Nav.get(filter));
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
    return KarmaFieldsAlpha.Nav.get(key);
  }

  setParam(value, key) {
    if (value) {
      KarmaFieldsAlpha.Nav.set(value, key);
    } else {
      KarmaFieldsAlpha.Nav.remove(key);
    }
  }

  hasParam(key) {
    return KarmaFieldsAlpha.Nav.has(key);
  }

  removeParam(key) {
    KarmaFieldsAlpha.Nav.remove(key);
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
      action: "backup",
      data: undefined
    });

    await this.dispatch(event);
  }

  async stage() {
    const event = this.createEvent({
      action: "stage",
      id: id
    });

    await this.dispatch(event);
  }

  // async save(id) {
  //   const event = this.createEvent({
  //     action: "save",
  //     id: id
  //   });
  //
  //   await this.dispatch(event);
  // }

  async isModified() {
    // const event = this.createEvent({
    //   action: "modified",
    //   type: "boolean"
    // });
    //
    // await this.dispatch(event);
    //
    // return event.getBoolean();

    // const event = {
    //   action: "modified",
    //   type: "boolean"
    // };

    const event = await this.dispatch({
      action: "modified",
      type: "boolean"
    });

    return KarmaFieldsAlpha.Type.toBoolean(event.data);
  }

  async check(condition) {
    console.error("deprecated check(). Use parse()")
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

  async dispatch(event, parent, origin) {
    if (!event.path) {
      event.path = [];
    }
    if (this.resource.key !== undefined) {

      if (event.path[0] === "..") {
        event.path.shift();
      } else {


        // event.relativeIndex.set(this, event.index--);
        // event.relativePath.set(this, [...event.path]);

        if (this.resource.useExpression) {

          const key = await this.parse(this.resource.key);
          event.path.unshift(key);

        } else {

          event.path.unshift(this.resource.key);

        }




      }
    }
    if (!event.field) {
      event.field = this;
    }
    if (this.parent) {

      // event.dispatcher = this;
      // event.relativeDispatcher.set(this.parent, this);


      event = await this.parent.dispatch(event, this, origin || this);



    }

    return event;
  }


  // async splash(request) {
  //   // noop
  // }

  async splash(fromField, request) {
		for (let child of this.children) {
      if (child !== fromField) {
        await child.update(request);
      }
		}
	}

  async update(request) {
    // noop
  }


  // async parseOperator(params) {
  //
  //   if (!Array.isArray(params)) {
  //     params = [params];
  //   }
  //
  //   const array = await this.parseArray(params[0]);
  //
  //   switch (params[1]) {
  //     case "replace":
  //
  //     case "!":
  //       return !array[0] ? "1" : "";
  //     case "=":
  //       return array[0] === await this.parse(params[2]) ? "1" : "";
  //     case "<":
  //       return array[0] < await this.parse(params[2]) ? "1" : "";
  //     case ">":
  //       return array[0] > await this.parse(params[2]) ? "1" : "";
  //     case "in": {
  //       const values = await this.parseArray(params[2]);
  //       return values.includes(array[0]) ? "1" : "";
  //     }
  //     case "&&":
  //       return array[0] && await this.parse(params[2]);
  //     case "||":
  //       return array[0] || await this.parse(params[2]);
  //     case "?": {
  //       if (array[0]) {
  //         return this.parse(params[2]);
  //       } else {
  //         return this.parse(params[3]);
  //       }
  //     }
  //     case "loop": {
  //       const output = [];
  //       for (this.currentItem of array) {
  //         const item = await this.parse(params[2] || this.currentItem);
  //         output.push(item);
  //       }
  //       return output.join(params[3] || "");
  //     }
  //     case "array":
  //     case "join": {
  //       return array.join(params[2] || ",");
  //     }
  //     case "date":
  //       return moment(array[0]).format(params[2] || "DD/MM/YYYY");
  //
  //
  //     case "+": {
  //       const value1 = array[0] || 0;
  //       const value2 = await this.parse(params[2]) || 0;
  //       return (Number(value1)+Number(value2)).toString();
  //     }
  //     case "-": {
  //       const value1 = array[0] || 0;
  //       const value2 = await this.parse(params[2]) || 0;
  //       return (Number(value1)-Number(value2)).toString();
  //     }
  //     case "*": {
  //       const value1 = array[0] || 0;
  //       const value2 = await this.parse(params[2]) || 0;
  //       return (Number(value1)*Number(value2)).toString();
  //     }
  //     case "/": {
  //       const value1 = array[0] || 0;
  //       const value2 = await this.parse(params[2]) || 0;
  //
  //       return (Number(value1)/Number(value2)).toString();
  //     }
  //     case "toFixed": {
  //       const value1 = array[0] || 0;
  //       const value2 = await this.parse(params[2]) || 0;
  //
  //       return (Number(value1)/Number(value2)).toString();
  //     }
  //     case "geocoding": {
  //       const url = "https://www.mapquestapi.com/geocoding/v1/address?key=G3kgQdWrvD383JfqnxG6OXn90YPI3Hep&location="+array[0]+",CH";
  //       const response = await fetch(url).then(response => response.json());
  //
  //       if (response.results && response.results[0] && response.results[0].locations && response.results[0].locations.length) {
  //         const locations = response.results[0].locations;
  //         const location = locations.find(location => array[0].includes(location.adminArea5)) || locations[0];
  //         const latLng = location.latLng;
  //         return latLng.lat+", "+latLng.lng; // + " ("+response.results.length+"/"+response.results[0].locations.length+")";
  //       }
  //       return "?";
  //     }
  //     default:
  //       return array[0];
  //   }
  // }
  //
  // async parseArray(expression) {
  //   expression = await this.parse(expression);
  //
  //   if (expression.startsWith("/")) { // -> absolute path
  //     const [request, ...joins] = expression.split("+");
  //     const [, driver, ...path] = request.split("/");
  //     let query = KarmaFieldsAlpha.Query.create(driver, joins);
  //
  //     return await query.get(...path);
  //
  //   } else { // -> relative path
  //     const path = expression.split("/");
  //
  //     const request = await this.dispatch({
  //       action: "get",
  //       path: path
  //     });
  //
  //     return request.data;
  //   }
  //
  // }
  //
  // async parse(expression = "") {
  //
  //   if (Array.isArray(expression)) {
  //
  //     const card = this.resource.card || "<>";
  //     let string = expression[0];
  //
  //     for (let i = 1; i < expression.length; i++) {
  //
  //       const matches = string.match(card);
  //
  //       if (matches) {
  //
  //         const replacement = await this.parseOperator(expression[i]);
  //
  //         string = string.replace(card, replacement);
  //
  //       }
  //
  //     }
  //
  //     expression = string;
  //   }
  //
  //   expression = expression.replace(this.resource.token || "><", this.currentItem || "");
  //
  //   return expression;
  // }


  async parse(expression) {
    return KarmaFieldsAlpha.Expression.resolve(this, expression);
  }




};
