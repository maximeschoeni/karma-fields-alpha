
// KarmaFieldsAlpha.loading = Symbol("loading");
// KarmaFieldsAlpha.mixed = Symbol("mixed");

KarmaFieldsAlpha.field = class {

  static fieldId = 0;
  static uniqueId = 1;

  constructor(resource, id, parent) {

    if (typeof resource === "string") {

      this.resource = KarmaFieldsAlpha.tables[resource];

    } else if (resource.model && KarmaFieldsAlpha.tables[resource.model]) {

      this.resource = {...KarmaFieldsAlpha.tables[resource.model], ...resource};

    } else if (resource.field && KarmaFieldsAlpha.tables[resource.field]) { // compat

      this.resource = {...KarmaFieldsAlpha.tables[resource.field], ...resource};

    } else {

      this.resource = resource || {};

    }

		this.fieldId = KarmaFieldsAlpha.field.fieldId++;

		this.length = 0; // children count to generate children index;

    this.id = id || 0;

    if (parent) {

      this.parent = parent;
      this.uid = `${parent.uid}-${this.id}`;
      this.path = [...parent.path, this.id];
      // this.states = parent.states && parent.states[this.id];
      // this.data = parent.data && parent.data[this.id];

    } else {

      this.uid = this.id;
      this.path = [this.id];

      // console.warn("ORPHAN CHILD!", this)

    }

  }

  getKey() {

    return this.resource.key;

  }

	addChild(field, id) {

		const index = this.length++;

		field.id = id;
		field.index = index;
		field.parent = this;
		field.uid = `${this.uid}-${id}`;
		field.path = [...this.path, id];
		field.uindex = `${this.uindex.toString(36)}${index.toString(36)}`;
		field.indexPath = [...this.indexPath, index];

		if (this.resource[id]) {

			KarmaFieldsAlpha.Collection.assign(field.resource, this.resource[id]);

		}

	}



	// getResource(...path) {

	// 	let value = KarmaFieldsAlpha.Collection.get(this.resource, ...path);

	// 	if (value === undefined) {

	// 		return this.parent.getResource(this.id, ...path);

	// 	}

	// 	return value;

	// }

	getResource(key) {

		if (this.resource[key] !== undefined) {

			return this.resource[key];

		} else if (this.parent) {

			return this.parent.getResource(key);

		}

	}

  getResources() {

    return this.resource;

  }

	// createChildField(model, resource, id) {

	// 	let field;

	// 	if (this.constructor[model]) {

	// 		field = new this.constructor[model]();

	// 	} else if ()

	// }

	getLabel() {

		// if (Array.isArray(this.resource.label)) {

		// 	return this.parse(this.resource.label);

		// }

		// return new KarmaFieldsAlpha.Content(this.resource.label);

		return this.parseString(this.resource.label);
	}

  queryLabel() {

    if (this.resource.label || this.resource.title) { // compat

      return this.parse(this.resource.label || this.resource.title);

    } else if (this.parent) {

      return this.parent.queryLabel();

    } else {

      return new KarmaFieldsAlpha.Content("");

    }

  }

	getUid() {

		return this.uid;

	}

	getConstructor(prototype) {

		if (typeof prototype !== "string") {

			console.error("prototype must be a string", prototype);

		}

		if (this.constructor[prototype] && typeof this.constructor[prototype] === "function") {

			return this.constructor[prototype];

		}

		if (this.parent) {

			return this.parent.getConstructor(prototype);

		}

	}

  // createChildField(type = "group", resource = {}) {
  //
  //   const child = new constructor[type](resource);
  //
  //   this.registerChild(child);
  //
  //   return child;
  // }

  // registerChild(field, id) {

  //   console.error("Deprecated");

  //   field.parent = this;
  //   field.id = id;
  //   field.init();

  // }


	// createChild(resource, id) {

	// 	if (id === undefined) {

	// 		console.error("creating child without an id");

	// 	}

	// 	if (typeof resource === "string") {

	// 		if (KarmaFieldsAlpha.tables[resource]) {

	// 			resource = KarmaFieldsAlpha.tables[resource];

	// 		} else {

	// 			resource = {
	// 				model: resource
	// 			};

	// 		}

	// 	}

	// 	if (resource.model && KarmaFieldsAlpha.tables[resource.model]) {

	// 		resource = { ...KarmaFieldsAlpha.tables[resource.model], ...resource };

	// 	}

	// 	const constructor = this.getConstructor(resource.type || resource.model || "group");

	// 	if (!constructor) {

	// 		console.error("constructor does not exist", constructor, resource, this);

	// 	}

	// 	const child = new constructor(resource, id, this);

	// 	return child;
	// }


	createChild(resource, id) {

		if (!resource) {

			console.error("creating child without resource");

		}

		if (id === undefined) {

			console.error("creating child without an id");

		}

		let prototype;

		if (typeof resource === "string") {

			prototype = resource;
			resource = {
				model: prototype
			};

		} else {

			prototype = resource.model || resource.type || "group"; // compat

		}

		while (KarmaFieldsAlpha.tables[prototype]) {

			const inheritedResource = KarmaFieldsAlpha.tables[prototype];

			prototype = inheritedResource.model || inheritedResource.type || prototype; // compat
			resource = { ...inheritedResource, ...resource };

		}

		if (!prototype) {

			console.error("prototype in not defined", prototype, resource, id);

		}

		const constructor = this.getConstructor(prototype);

		if (!constructor) {

			console.log(this);

			console.error("constructor does not exist", prototype);

		}

		const child = new constructor(resource, id, this);

		return child;
	}

	createField(type, resource, id) { // -> simpler method for creating child field

		if (!type) {

			console.error("creating field without type");

		}

		if (!resource) {

			console.error("creating field without resource");

		}

		if (id === undefined) {

			console.error("creating field without an id");

		}

		if (!KarmaFieldsAlpha.field[type]) {

			console.error("Creating field but type does not exist");

		}

		return new KarmaFieldsAlpha.field[type](resource, id, this);

	}

	createField2(resource, id) { // -> simpler method for creating child field

		if (typeof resource === "string") {

			resource = { model: resource };

		}

		if (resource.model) {

			console.error("Creating field but there are no model in resource");

		}

		if (KarmaFieldsAlpha.tables[resource.model]) {

			return this.createField2({
				...KarmaFieldsAlpha.tables[resource.model],
				...resource,
				model: KarmaFieldsAlpha.tables[resource.model].model
			}, id);

		} else if (this.constructor[resource.model]) {

			return new this.constructor[resource.model](resource, id, this);

		} else if (KarmaFieldsAlpha.field[resource.model]) {

			return new KarmaFieldsAlpha.field[resource.model](resource, id, this);

		} else {

			console.error("Creating field but model is not defined");

		}

	}

  // init() {
  //
  //   this.uid = `${this.parent.uid}-${this.id}`;
  //   this.path = [...this.parent.path, this.id];
  //   // this.options = this.parent.options && this.parent.options[this.id];
  //   this.states = this.parent.states && this.parent.states[this.id];
  //   this.data = this.parent.data && this.parent.data[this.id];
  //
  // }


	getFocusObject() { // -> to be renamed getFocus()

		return KarmaFieldsAlpha.server.getState("", "focus") || {};

	}

	useClipboard() {

		// return KarmaFieldsAlpha.server.getState("", "clipboard") || false;
		const focus = this.getFocusObject();

		return focus.clipboard || false;

	}

	getFocus() { // -> compat

		const focus = this.getFocusObject();

		return focus.id || "";

	}

	getFocusId() {

		const focus = this.getFocusObject();

		return focus.id || "";

	}

	getFocusPath() {

		const focus = this.getFocusObject();

		return focus.path || [];

	}

	setFocus(useClipboard, fieldId, path) {

		// KarmaFieldsAlpha.server.setState(useClipboard || false, "", "clipboard");
		// KarmaFieldsAlpha.server.setState(fieldId || this.uid, "", "focus");
		// KarmaFieldsAlpha.server.setState(path || this.path, "", "focusPath");

		KarmaFieldsAlpha.server.setState({
			clipboard: useClipboard || false,
			id: fieldId || this.uid,
			path: path || this.path
		}, "", "focus");

		if (useClipboard) {
			document.getElementById("karma-fields-alpha-clipboard").focus({ preventScroll: true });
		}

	}

	removeFocus() {

		// KarmaFieldsAlpha.server.setState(true, "", "clipboard"); // remove any element focus
		// KarmaFieldsAlpha.server.setState("", "", "focus");
		// KarmaFieldsAlpha.server.setState([], "", "focusPath");

		KarmaFieldsAlpha.server.setState({
			clipboard: true,
			id: "",
			path: []
		}, "", "focus");

		document.getElementById("karma-fields-alpha-clipboard").focus({ preventScroll: true });

	}

	hasFocus() {

		return this.getFocusId() === this.uid;

	}

	// hasFocusInside(...path) {

	// 	let focus = this.getFocus();

	// 	if (path.length) {

	// 		focus = [focus, ...path].join("-");

	// 	}

	// 	return focus.startsWith(this.uid);

	// }

	hasFocusInside(...compatPath) {

		if (compatPath.length > 0) {

			console.error("path should be passed as argument");

		}

		let path = this.getFocusPath();

		if (path.length < this.path.length) {

			return false;

		}

		for (let i = 0; i < this.path.length; i++) {

			if (this.path[i] !== path[i]) {

				return false;

			}

		}

		return true;

	}

	getState(key, fieldId) {

		return KarmaFieldsAlpha.server.getState(fieldId || this.uid, key);

	}

	setState(value, key, fieldId) {

		KarmaFieldsAlpha.server.setState(value, fieldId || this.uid, key);

	}

	removeState(key, fieldId) {

		// not used

		KarmaFieldsAlpha.server.removeState(fieldId || this.uid, key);

	}

	getData(key, fieldId) { // created for tinymce popup linkforms

		return KarmaFieldsAlpha.server.getData(fieldId || this.uid, key);

	}

	setData(value, key, fieldId) {

		KarmaFieldsAlpha.server.setData(value, fieldId || this.uid, key);

	}

	getTempo(key, fieldId) {

		return KarmaFieldsAlpha.server.getTempo(fieldId || this.uid, key);

	}

	setTempo(value, key, fieldId) {

		KarmaFieldsAlpha.server.setTempo(value, fieldId || this.uid, key);

	}




	getSelection(fieldId) {

		return KarmaFieldsAlpha.server.getState(fieldId || this.uid, "selection") || {};

	}

	setSelection(selection, fieldId) {

		KarmaFieldsAlpha.server.setState(selection, fieldId || this.uid, "selection");

	}

	removeSelection(fieldId) {

		this.setSelection({}, fieldId || this.uid);

	}

	unselect(fieldId) {

		this.setSelection({}, fieldId || this.uid);

	}

	isSelectedAt(index) {

		const selection = this.getSelection();

		if (selection) {

			return index >= selection.index && index < selection.index + selection.length;

		}

		return false;
	}

	hasSelection() {

		if (this.parent) {

			return this.parent.hasSelection();

		}

		return false;

	}

	hasSelectionInside() {

		return false;

	}




  // useClipboard() {
  //
  //   return this.parent.useClipboard();
  //
  // }
  //
  //
  // getFocus() {
  //
  //   return this.parent.getFocus();
  //
  // }
  //
  // setFocus(useClipboard, fieldId) {
  //
  //   return this.parent.setFocus(useClipboard, fieldId || this.uid);
  //
  // }
  //
  // removeFocus() {
  //
  //   return this.parent.removeFocus();
  //
  // }



  // async getRelativeFocus() {
  //
  //   const focus = await this.getFocus();
  //
  //   if (this.path.every((id, index) => id === focus[index])) {
  //
  //     return focus.slice(this.path.length);
  //
  //   }
  //
  // }


	getFocusField() {

		if (this.parent) {

			return this.parent.getFocusField();

		}

	}

  // async submit() {
  //
  //   await KarmaFieldsAlpha.server.submit();
  //
  // }

	submit() {

		if (this.parent) {

			return this.parent.submit();

		} else {

			return KarmaFieldsAlpha.server.submit();

		}

	}

	hasEdits() {

		return KarmaFieldsAlpha.server.hasEdits();

	}
  // hasDelta() {

  //   return KarmaFieldsAlpha.server.hasDelta();

  // }

  // getDelta() {

  //   return KarmaFieldsAlpha.server.getDelta();

  // }

  // getSelection(fieldId) {
  //
  //   return this.parent.getSelection(fieldId || this.uid);
  //
  // }
  //
  // setSelection(selection, fieldId) {
  //
  //   return this.parent.setSelection(selection, fieldId || this.uid);
  //
  // }
  //
  // removeSelection(fieldId) {
  //
  //   return this.parent.removeSelection(fieldId || this.uid);
  //
  // }

	save(id, name) {

		return KarmaFieldsAlpha.History.save(id, name);

	}


  getChildren() {

		return this.resource.children || [];

	}


	newChild(index) {

		const children = this.getChildren();

		if (children) {

			let resource = children[index];

			if (resource) {

				if (typeof resource === "string") {

					resource = { type: resource };

				}

				return this.createChild(resource, index);

			}

		}

	}


  getChild(index, ...path) {

    let child = this.newChild(index);

    if (child && path.length) {

      return child.getChild(...path);

    }

    return child;

  }

  request(functionName, ...args) {

    if (this[functionName]) {

      return this[functionName](...args);

    } else if (this.parent) {

      return this.parent.request(functionName, ...args);

    }

  }

  // getState(key, fieldId) {
  //
  //   return this.parent.getState(key, fieldId || this.uid);
  //
  // }
  //
  // setState(value, key, ...path) {
  //
  //   return this.parent.setState(value, key, fieldId || this.uid);
  //
  // }
  //
  // removeState(key) {
  //
  //   return this.parent.removeState(key, fieldId || this.uid);
  //
  // }

  getRoot() {

    if (this.parent) {

      return this.parent.getRoot();

    }

    return this;
  }






	getIds() {

		if (this.parent) {

			return this.parent.getIds();

		}

		return [];
	}

	setIds(ids) {

		if (this.parent) {

			this.parent.setIds(ids);

		}

	}

	getValue(key, id, driver) {

		if (driver) {

			return KarmaFieldsAlpha.server.getValue(driver, id, key);

		} else if (this.parent) {

			if (!key) {

				key = this.getKey();

			}

			return this.parent.getValue(key, id);

		}

		console.error("getting value but field has no parent");

	}

	setValue(value, key, id, driver) {

		if (driver) {

			KarmaFieldsAlpha.server.setValue(value, key, id, driver);

		} else if (this.parent) {

			if (!key) {

				key = this.getKey();

			}

			this.parent.setValue(value, key, id, driver);

		} else {

			console.error("setting value but field has no parent", this);

		}



	}

	getSelectedValues(key) {

		if (this.parent) {

			this.parent.getSelectedValues(key);

		}

		return [];

	}

  // getValueAt(id, key) {

  //   return this.parent.getContentAt(id, key);

  // }

  // setValueAt(value, id, key) {

  //   this.parent.setValueAt(value, id, key);

  // }

	getDriver() {

		return this.resource.driver || this.parent.getDriver();

	}

  // used by array
  getKeys() {

    const key = this.getKey();
    let keys = [];

    if (key) {

      keys.push(key);

    } else if (this.resource.children) {

      // for (let resource of this.resource.children) {
      //
      //   const child = this.createChild(resource);
      //
      //   keys.push(...child.getKeys());
      //
  		// }

      for (let i = 0; i < this.resource.children.length; i++) {

        const child = this.getChild(i);

        keys.push(...child.getKeys());

  		}

    }

    return keys;

  }


	export() { // -> return collection (array of strings)

		// let collection = new KarmaFieldsAlpha.Content();
		let collection = [];

		if (this.resource.children && this.resource.export !== false) {

			for (let i = 0; i < this.resource.children.length; i++) {

				const child = this.getChild(i);

				if (child) {

					const values = child.export();

					if (values === undefined) {

						return;

					} else {

						// collection.value = [...collection.toArray(), ...content.toArray()];
						// -> empty strings are being skiped!

						collection.push(...values);
					}

				}

			}

		}

		return collection;
	}

	import(collection) {

		if (this.resource.children) {

			for (let i = 0; i < this.resource.children.length; i++) {

				const child = this.getChild(i);

				child.import(collection);

			}

		}

	}




	// getWild(driver, id, key) {

	// 	return KarmaFieldsAlpha.server.getValue(driver, id, key);

	// }

	// setWild(value, driver, id, key) {

	// 	return KarmaFieldsAlpha.server.setValue(value, driver, id, key);

	// }

	// getCount() {

	// 	// return this.parent.getCount(driver, paramstring);

	// 	// return KarmaFieldsAlpha.server.queryCount(driver, paramstring);

	// 	const query = this.getQuery();

	// 	if (query) {

	// 		return query.count;

	// 	}

	// }

	// getIds() {

	// 	const query = this.getQuery();

	// 	if (query) {

	// 		return query.ids;

	// 	}

	// }

	getQueriedOptions(keys = ["name"]) {

		let paramstring = KarmaFieldsAlpha.server.getTempo("state", this.uid, "paramstring");

		if (paramstring === undefined) {

			const params  = this.parse(this.resource.params);

			if (params !== undefined) {

				paramstring = KarmaFieldsAlpha.Params.stringify(params);

				KarmaFieldsAlpha.server.setTempo(paramstring, "state", this.uid, "paramstring");

			}

		}

		if (paramstring !== undefined) {

			let driver = this.getDriver();

			return KarmaFieldsAlpha.server.getOptionsList(driver, paramstring, keys);

		}

	}

	getOptions() {

		let options = [];

		if (this.resource.options) {

			options = this.parseArray(this.resource.options);

			if (options === undefined) {

				return;

			}

		}

		if (this.resource.driver) {

			const queriedOptions = this.getQueriedOptions();

			if (queriedOptions === undefined) {

				return;

			}

			options = [...options, ...queriedOptions];

		}

		return options;

	}

  // getGrid(driver, paramstring, keys) {

  //   return this.parent.getGrid(driver, paramstring, keys);

  // }


	// getQuery() {

	// 	let query = KarmaFieldsAlpha.server.getState(this.uid, "query"); // -> for added/deleted items

	// 	if (!query) {

	// 		let driver = this.getDriver();
	// 		let paramstring = this.getParamstring();

	// 		if (driver && paramstring) {

	// 			query = KarmaFieldsAlpha.server.getQuery(driver, paramstring);

	// 		}

	// 	}

	// 	return query;

	// }



  // parse(expression) {

  //   // compat
  //   if (expression && typeof expression === "object" && !Array.isArray(expression)) {

  //     // console.warn("Please use parseObject function!");

  //     return this.parseObject(expression);

  //   }


  //   let response = new KarmaFieldsAlpha.Content();

  //   if (expression && Array.isArray(expression)) {

  //     switch (expression[0]) {

  //       case "=":
  //       case "==":
  //       case "===":
  //       case "!=":
  //       case "!==":
  //       case ">":
  //       case "<":
  //       case ">=":
  //       case "<=":
  //       case "like":
  //       case "+":
  //       case "-":
  //       case "*":
  //       case "/":
  //       case "%": {
  //         const v1 = this.parse(expression[1]);
  //         const v2 = this.parse(expression[2]);
  //         // response = KarmaFieldsAlpha.Expression.compare(expression[0], v1, v2);
  //         if (v1.loading || v2.loading) {
  //           response.loading = true;
  //         } else {
  //           switch (expression[0]) {
  //             case "=":
  //             case "==":
  //               response.value = v1.toSingle() == v2.toSingle();
  //               break;
  //             case "===":
  //               response.value = v1.toSingle() === v2.toSingle();
  //               break;
  //             case "!=":
  //               response.value = v1.toSingle() != v2.toSingle();
  //               break;
  //             case "!==":
  //               response.value = v1.toSingle() !== v2.toSingle();
  //               break;
  //             case ">":
  //               response.value = v1.toSingle() > v2.toSingle();
  //               break;
  //             case "<":
  //               response.value = v1.toSingle() < v2.toSingle();
  //               break;
  //             case ">=":
  //               response.value = v1.toSingle() >= v2.toSingle();
  //               break;
  //             case "<=":
  //               response.value = v1.toSingle() <= v2.toSingle();
  //               break;
  //             case "like":
  //               response.value = v1.toString().match(new RegExp(v2.toString()));
  //               break;
  //             case "+":
  //               response.value = v1.toNumber() + v2.toNumber();
  //               break;
  //             case "-":
  //               response.value = v1.toNumber() - v2.toNumber();
  //               break;
  //             case "*":
  //               response.value = v1.toNumber() * v2.toNumber();
  //               break;
  //             case "/":
  //               response.value = v1.toNumber() / v2.toNumber();
  //               break;
  //             case "%":
  //               response.value = v1.toNumber() % v2.toNumber();
  //               break;
  //           }
  //         }
  //         break;
  //       }
  //       case "&&": {
  //         const values = expression.slice(1);
  //         response = this.parse(values.shift());
  //         if (!response.loading && values.length && response.toBoolean()) {
  //           response = this.parse(["&&", ...values]);
  //         }
  //         break;
  //       }
  //       case "||": {
  //         const values = expression.slice(1);
  //         response = this.parse(values.shift());

  //         if (!response.loading && values.length && !response.toBoolean()) {
  //           response = this.parse(["||", ...values]);
  //         }
  //         break;
  //       }
  //       case "!": {
  //         const value = this.parse(expression[1]);
  //         if (value.loading) {
  //           response.loading = true;
  //         } else {
  //           response.value = !value.toBoolean();
  //         }
  //         break;
  //       }
  //       case "?": {
  //         const condition = this.parse(expression[1]);
  //         if (condition.loading) {
  //           response.loading = true;
  //         } else {
  //           response = condition.toBoolean() ? this.parse(expression[2]) : this.parse(expression[3]);
  //         }
  //         break;
  //       }
  //       case "...":
  //       case "concat": {
  //         const items = expression.slice(1).map(item => this.parse(item));
  //         if (items.some(item => item.loading)) {
  //           response.loading = true;
  //         } else {
  //           response.value = items.reduce((array, item) => [...array, ...item.toArray()], []);
  //         }
  //         break;
  //       }
  //       case "math": {
  //         const method = expression[1];
  //         const values = expression.slice(2).map(value => this.parse(value));
  //         if (values.some(value => value.loading)) {
  //           response.loading = true;
  //         } else if (Math[expression[1]]) {
  //           response.value = Math[expression[1]](...values.map(value => value.toNumber()));
  //         }
  //         break;
  //       }
  //       case "include": {
  //         const array = this.parse(expression[1]);
  //         const value = this.parse(expression[2]);
  //         if (array.loading || value.loading) {
  //           response.loading = true;
  //         } else {
  //           response.value = array.toArray().include(value.toSingle());
  //         }
  //         break;
  //       }
  //       case "replace": {
  //         const string = this.parse(expression[1]);
  //         const wildcard = expression[2];
  //         const replacements = expression.slice(3).map(replacement => this.parse(replacement));
  //         if (string.loading || replacements.some(value => value.loading)) {
  //           response.loading = true;
  //         } else if (replacements.length) {
  //           const grid = replacements.map(replacement => replacement.toArray());
  //           response.value = grid[0].map((item, i) => grid.reduce((string, replacements) => string.replace(wildcard, replacements[i]), string.toString()));
  //         }
  //         break;
  //       }
  //       case "date": {
  //         const date = this.parse(expression[1]);
  //         const option = expression[2] || {}; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
  //         const locale = expression[3] || KarmaFieldsAlpha.locale || "en";
  //         if (date.loading) {
  //           response.loading = true;
  //         } else {
  //           const string = date.toString();
  //           if (!string || string === "now") {
  //             response.value = (new Date()).toLocaleDateString(locale, option);
  //           } else {
  //             const dateObj = new Date(string);
  //             if (isNaN(dateObj)) {
  //               response.value = "";
  //             } else {
  //               response.value = dateObj.toLocaleDateString(locale, option);
  //             }
  //           }
  //         }
  //         break;
  //       }
  //       case "time": {
  //         const date = this.parse(expression[1]);
  //         const option = expression[2] || {}; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
  //         const locale = expression[3] || KarmaFieldsAlpha.locale || "en";
  //         if (date.loading) {
  //           response.loading = true;
  //         } else {
  //           const string = date.toString();
  //           const dateObj = new Date(string);
  //           if (isNaN(dateObj)) {
  //             response.value = "";
  //           } else {
  //             response.value = dateObj.toLocaleTimeString(locale, option);
  //           }
  //         }
  //         break;
  //       }
  //       case "daterange": {
  //         let date1 = this.parse(expression[1]);
  //         let date2 = this.parse(expression[2]);
  //         const separator = expression[3] || ' - ';
  //         const locale = expression[4] || KarmaFieldsAlpha.locale || "en";
  //         const options = expression[5] || {year: "numeric", month: "2-digit", day: "2-digit"};
  //         if (date1.loading || date2.loading) {
  //           response.loading = true;
  //         } else {
  //           date1 = new Date(date1.toString());
  //           date2 = new Date(date2.toString());
  //           if (isNaN(date2)) {
  //             if (isNaN(date1)) {
  //               response.value = "";
  //             } else {
  //               response.value = date1.toLocaleDateString(locale, options);
  //             }
  //           } else {
  //             if (date1.getFullYear() === date2.getFullYear()) {
  //               if (date1.getMonth() === date2.getMonth()) {
  //                 response.value = `${date1.toLocaleDateString(locale, {day: options.day})}${separator}${date2.toLocaleDateString(locale, options)}`;
  //               } else {
  //                 response.value = `${date1.toLocaleDateString(locale, {day: options.day, month: options.month})}${separator}${date2.toLocaleDateString(locale, options)}`;
  //               }
  //             } else {
  //               response.value = `${date1.toLocaleDateString(locale, options)}${separator}${date2.toLocaleDateString(locale, options)}`;
  //             }
  //           }
  //         }
  //         break;
  //       }
  //       case "year":
  //         // response = this.parse(["date", expression[1] || "", {year: expression[2] || "numeric"}]);
  //         // break;
  //       case "month":
  //       case "day":
  //         console.error("DEPRECATED (use date)");
  //         break;
  //       case "request": {
  //         var params = expression.slice(1).map(param => this.parse(param));
  //         if (params.some(param => param.loading)) {
  //           response.loading = true;
  //         } else {
  //           const result = this.request(...params.map(param => param.value));
  //           if (result instanceof KarmaFieldsAlpha.Content) { // compat
  //             response = result;
  //           } else {
  //             response.value = result;
  //           }
  //         }
  //         break;
  //       }
  //       case "getItem": // compat
  //       case "getValue": // which one ?
  //       case "getContent": {
  //         if (expression[1]) {
  //           const key = this.parse(expression[1]);
  //           response = this.parent.getContent(key.toString());
  //         } else {
  //           response = this.getContent();
  //         }
  //         break;
  //       }
  //       case "queryValue": {
  //         const driver = this.parse(expression[1]);
  //         const id = this.parse(expression[2]);
  //         const key = this.parse(expression[3]);
  //         if (driver.loading || id.loading || key.loading) {
  //           response.loading = true;
  //         } else if (driver.toString() && id.toString() && key.toString()) {
  //           // const form = new KarmaFieldsAlpha.field.form({
  //           //   driver: driver.toString()
  //           // });
  //           // response = form.getValueById(id.toString(), key.toString());
  //           // const server = new KarmaFieldsAlpha.Server(driver.toString());
  //           // response = server.getValue(id.toString(), key.toString());
  //           response = this.getWild(driver.toString(), id.toString(), key.toString());
  //         }
  //         break;
  //       }
  //       case "query": {
  //         const driver = this.parse(expression[1]);
  //         const params = this.parseObject(expression[2]);
  //         const output = expression[3] || "ids";
  //         if (driver.loading || params.loading) {
  //           response.loading = true;
  //         } else {
  //           // const table = new KarmaFieldsAlpha.field.table({
  //           //   driver: driver.toString(),
  //           //   params: params.toObject()
  //           // });
  //           // await table.load();
  //           // const server = new KarmaFieldsAlpha.Server(driver.toString());
  //           // await server.query(params.toObject());
  //           // if (server.loading) {
  //           //   response.loading = true;
  //           // } else if (output === "count") {
  //           //   response = table.getCount();
  //           // } else if (output === "options") {
  //           //   response = server.getOptionsList();
  //           // } else {
  //           //   response.value = server.ids;
  //           // }

  //           const paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());

  //           if (output === "count") {
  //             response = this.getCount(driver.toString(), paramstring);
  //           } else if (output === "options") {
  //             response = this.getOptionsList(driver.toString(), paramstring);
  //           } else {
  //             response = this.getIds(driver.toString(), paramstring);
  //           }
  //         }
  //         break;
  //       }
  //       case "queryCount": {
  //         const driver = this.parse(expression[1]);
  //         const params = this.parseObject(expression[2]);
  //         if (driver.loading || params.loading) {
  //           response.loading = true;
  //         } else {
  //           const paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());
  //           response = this.getCount(driver.toString(), paramstring);
  //         }
  //         break;
  //       }
  //       case "parseParams":
  //         console.error("DEPRECATED");
  //         break;
  //       case "getGrid":
  //       case "getOptions": {
  //         const driver = this.parse(expression[1]);
  //         const params = this.parseObject(expression[2]);
  //         const keys = expression[3];
  //         if (driver.loading || params.loading) {
  //           response.loading = true;
  //         } else {
  //           const paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());
  //           response = this.getOptionsList(driver.toString(), paramstring);
  //         }
  //         break;
  //       }
  //       case "map": {
  //         const array = this.parse(expression[1]);
  //         if (array.loading) {
  //           response.loading = true;
  //         } else {
  //           response.value = array.toArray().map(value => {
  //             const mapItem = new KarmaFieldsAlpha.Expression(value, this);
  //             return mapItem.parse(expression[2]);
  //           });
  //           response.loading = response.value.some(value => value.loading);
  //         }
  //         break;
  //       }
  //       case "join": {
  //         const array = this.parse(expression[1]);
  //         const glue = expression[2] || ", ";
  //         if (array.loading) {
  //           response.loading = true;
  //         } else {
  //           response.value = array.toArray().join(glue);
  //         }
  //         break;
  //       }
  //       case "indexOf":
  //         console.error("deprecated");
  //         break;
  //       case "sum": {
  //         const array = this.parse(expression[1]);
  //         if (array.loading) {
  //           response.loading = true;
  //         } else {
  //           response.value = array.toArray().reduce((accumulator, item)=> accumulator + Number(item), 0);
  //         }
  //         break;
  //       }
  //       case "getLength":
  //       case "count": {
  //         const array = this.parse(expression[1]);
  //         if (array.loading) {
  //           response.loading = true;
  //         } else {
  //           response.value = array.toArray().length;
  //         }
  //         break;
  //       }
  //       case "getParam": {
  //         var key = this.parse(expression[1]);
  //         if (key.loading) {
  //           response.loading = true;
  //         } else {
  //           response.value = this.getParam(key.toString());
  //         }
  //         break;
  //       }
  //       case "isLoading": {
  //         const content = this.parse(expression[1]);
  //         response.value = content.loading;
  //         break;
  //       }
  //       case "isMixed": {
  //         const content = this.parse(expression[1]);
  //         response.value = content.mixed;
  //         break;
  //       }
  //       case "getKey":
  //       case "getIndex":// deprec
  //       case "getIds":
  //       case "get":
  //       case "getAt":
  //       case "array":
  //         console.error("deprecated", expression);
  //         break;

  //       case "debug":
  //       case "dump":
  //       case "log":
  //         debugger;
  //         response = this.parse(expression[1]);
  //         console.log(response);
  //         break;
  //       case "max": {
  //         const array = this.parse(expression[1]);
  //         if (array.loading) {
  //           response.loading = true;
  //         } else {
  //           response.value = array.toArray().reduce((accumulator, item) => Math.max(accumulator, Number(item)), 0);
  //         }
  //         break;
  //       }
  //       case "min": {
  //         const array = this.parse(expression[1]);
  //         if (array.loading) {
  //           response.loading = true;
  //         } else {
  //           response.value = array.toArray().reduce((accumulator, item) => Math.min(accumulator, Number(item)), Infinity);
  //         }
  //         break;
  //       }
  //       case "resource": {
  //         var key = this.parse(expression[1]);
  //         response.value = this.resource[key.toString()];
  //         break;
  //       }
  //       case "parent":
  //         response = this.parent.parse(expression);
  //         break;
  //       case "upload-directory":
  //         response.value = KarmaFieldsAlpha.uploadURL;
  //         break;
  //       case "admin-url":
  //         response.value = KarmaFieldsAlpha.adminURL;
  //         break;
  //       case "rest-url":
  //         response.value = KarmaFieldsAlpha.restURL;
  //         break;

  //       default:
  //         response.value = expression;
  //         break;

  //     }

  //   } else {

  //     response.value = expression;

  //   }

  //   return response;


  // }

  // parseObject(object) {
  //
  //   const response = new KarmaFieldsAlpha.Content();
  //
  //   let entries = Object.entries(object).map(([key, value]) => [key, this.parse(value)]);
  //
  //   if (entries.some(([key, value]) => value.loading)) {
  //
  //     response.loading = true;
  //
  //   } else {
  //
  //     entries = entries.map(([key, value]) => [key, value.toString()]);
  //
  //     response.value = Object.fromEntries(entries);
  //
  //   }
  //
  //   return response;
  // }

  // parseObject(object) {

  //   const response = new KarmaFieldsAlpha.Content({});

  //   for (let key in object) {

  //     const value = this.parse(object[key]);

  //     if (response.loading || value.loading) {

  //       response.loading = true;

  //     } else {

  //       response.value[key] = value.toString();

  //     }

  //   }

  //   return response;

  // }



 //  getOptions() {

 //    console.error("deprecated");

	// 	let options = [];

	// 	if (this.resource.options) {

	// 		options = this.parse(this.resource.options);

 //      if (!options || options === KarmaFieldsAlpha.loading) {

 //        return;

 //      }

	// 	}

 //    let moreOptions;

	// 	if (this.resource.driver) {

 //      moreOptions = KarmaFieldsAlpha.Query.getOptions(this.resource.driver, this.resource.params || {});

	// 	} else if (this.resource.table) {

 //      const grid = this.request("getGrid", this.resource.table);

 //      if (grid && grid.resource.driver) {

 //        moreOptions =  KarmaFieldsAlpha.Query.getOptions(grid.resource.driver, grid.resource.params || {});

 //      }

	// 	}

 //    if (moreOptions) {

 //      options = [...options, ...moreOptions];

 //    }

	// 	return options;

	// }

  // async *create() {

  //   console.error("deprecated");

  //   if (this.resource.children) {

  //     for (let i = 0; i < this.resource.children.length; i++) {

  //       const resource = this.resource.children[i];
  //       const child = this.createChild(resource, i);

  //       yield* child.create();

  //     }

  //   }

  // }

  // createToken() {
  //
  //   // -> shouldnt be in table field ???
  //
  //   let token = KarmaFieldsAlpha.Store.State.get("token") || 0;
  //
  //   token++;
  //
  //   KarmaFieldsAlpha.Store.State.set(token, "token");
  //
  //   return token;
  // }

  // getParams() { // overrided by table field
  //
  //   return this.parent.getParams(); // return Content
  //
  // }


  // getParam(key) { // overrided by form

  //   if (this.parent) {

  //     return this.parent.getParam(key);

  //   }


  // }

  // setParam(value, key) { // overrided by form

  //   if (this.parent) {

  //     return this.parent.setParam(value, key);

  //   }

  // }

  // queryParams() {

  //   if (this.parent) {

  //     return this.parent.queryParams();

  //   }



  // }

	// getParam(key) {

	// 	const params = this.getParams();

	// 	return params && params[key] || "";

	// }

	// getParams() {

	// 	let params = KarmaFieldsAlpha.server.getState(this.uid, "params");

	// 	if (!params) {

	// 		params = KarmaFieldsAlpha.server.getTempo("state", this.uid, "params");

	// 		if (!params) {

	// 			const parsing  = this.parse(this.resource.params);

	// 			if (!parsing.loading) {

	// 				params = parsing.toObject();

	// 				KarmaFieldsAlpha.server.setTempo(params, "state", this.uid, "params");

	// 			}

	// 		}

	// 	}

	// 	return params;
	// }

	// getParamstring() {

	// 	let paramstring = KarmaFieldsAlpha.server.getTempo("state", this.uid, "paramstring");

	// 	if (!paramstring) {

	// 		let params = this.getParams();

	// 		if (params) {

	// 			paramstring = KarmaFieldsAlpha.Params.stringify(params);

	// 			KarmaFieldsAlpha.server.setTempo(paramstring, "state", this.uid, "paramstring");

	// 		}

	// 	}

	// 	return paramstring;

	// }

	// // setParam(value, key) {

	// // 	const request = this.getRequest();

	// // 	if (!request) {

	// // 		console.error("setting params but request is not set");

	// // 	}

	// // 	const params = { ...request.params, [key]: value };

	// // 	const newRequest = this.createRequest(params);

	// // 	KarmaFieldsAlpha.server.setState(newRequest, this.uid, "request");

	// // }

	// // getParam(key) {

	// // 	const params = getParams();

	// // 	if (params) {

	// // 		return params[key] || "";

	// // 	}

	// // }

	// setParam(value, key) {

	// 	// let params = KarmaFieldsAlpha.server.getState(this.uid, "params");
	// 	let params = this.getParams();

	// 	if (!params) {

	// 		console.error("setting params but params is not set"); // or is it ok?

	// 		params = {};

	// 	}

	// 	params = { ...params, [key]: value };

	// 	KarmaFieldsAlpha.server.setState(params, this.uid, "params");

	// 	// KarmaFieldsAlpha.server.removeState(this.uid, "query"); // -> added/removed ids data

	// }

	getParam(key) {

		if (this.parent) {

			return this.parent.getParam(key);

		}

	}

	setParam(value, key) {

		if (this.parent) {

			this.parent.setParam(value, key);

		}

	}

  add(...args) {

    if (this.parent) {

      return this.parent.add(...args);

    }

  }

  delete(...args) { // needed eg. when deleting tag by delete key

    if (this.parent) {

      return this.parent.delete(...args);

    }

  }

  paste(...args) {

    if (this.parent) {

      return this.parent.paste(...args);

    }

  }

  // getChildByPath(childId, ...path) {

  //   console.error("deprecated");

  //   const child = this.getChild(childId);

  //   if (child) {

  //     if (path.length) {

  //       return child.getChildByPath(...path);

  //     } else {

  //       return child;

  //     }

  //   }

  // }

  // getField(...path) {

  //   console.error("deprecated");

  //   return this.parent.getField(...path);

  // }

  closest(callback) {

    if (callback(this, this.resource)) {

      return this;

    } else if (this.parent) {

      return this.parent.closest(callback);

    }

  }

  // hasTask() {

  //   return false;

  // }


	getDefaults() {

		let defaults = {};

		if (this.resource.defaults) {

			const params = this.parseObject(this.resource.defaults);

			if (params === undefined) {

				return;

			}

			Object.assign(defaults, params);

		}

		// if (this.resource.params) {

		// 	const params = this.parseObject(this.resource.params);

		// 	if (params === undefined) {

		// 		return;

		// 	}

		// 	Object.assign(defaults, params);

		// }

		if (this.resource.default && this.resource.key) {

			const key = this.getKey();
			const value = this.parse(this.resource.default);

			if (value === undefined) {

				return;

			}

			defaults[key] = value;

		}

		if (this.resource.children) {

			for (let i = 0; i < this.resource.children.length; i++) {

				const child = this.getChild(i);
				const params = child.getDefaults();

				if (params === undefined) {

					return;

				}

				Object.assign(defaults, params);

			}

		}

		return defaults;
	}

  getIndex() { // for table rows numbering

    return this.parent.getIndex();

  }


  undo() {

    KarmaFieldsAlpha.history.undo();

  }

  redo() {

    KarmaFieldsAlpha.history.redo();

  }


	isDisabled() {

		if (this.resource.disabled) {

			return this.parent.parseBoolean(this.resource.disabled || false);

		} else if (this.resource.enabled) {

			return !this.parent.parseBoolean(this.resource.enabled);

		}

		return false;
	}

	isMixed(key, ids = undefined) {

		if (!key) {

			key = this.getKey();

		}

		if (this.parent) {

			return this.parent.isMixed(key, ids);

		}

		return false;

	}

	isUploading() { // deprecated

		if (this.parent) {

			return this.parent.isUploading();

		}

		return false;

	}


  isPopup() {

    if (this.parent) {

      return this.parent.isPopup();

    }

    return false;

  }

  *build() {

  }

	edit(ids) {

		this.parent.edit(ids);

	}

	open() {

		this.parent.open();

	}

	close() {

		this.parent.close();

	}

	abduct() {

		return this.parent.abduct();

	}

	render(...args) {

		const delay = 100;

	// 	return this.parent.render();

	// }

	// renderElement(items, delay = 100) {

		if (!KarmaFieldsAlpha.rendering) {

			if (KarmaFieldsAlpha.renderTimer) {

				clearTimeout(KarmaFieldsAlpha.renderTimer);

			}

			KarmaFieldsAlpha.renderTimer = setTimeout(async () => {

				KarmaFieldsAlpha.rendering = true;

				// let index = 0;

				do {

					await this.abduct(...args);

					// console.log("rendering", index++);

					// // for (let item of items) {
					// for (let i = 0; i < items.length; i++) {

					// 	const item = items[i];
					// 	// const field = this.createChild(item.resource, i);

					// 	// await abduct(item.element, field.build());

					// 	// const field = this.createChild(item.resource, i);

					// 	await abduct(item.element, item.implants);

					// }

					if (KarmaFieldsAlpha.server.hasDownload()) {

						document.body.classList.add("karma-field-loading");

					}

					if (KarmaFieldsAlpha.server.hasUpload()) {

						document.body.classList.add("karma-field-uploading");

					}

					await KarmaFieldsAlpha.server.process();

				} while (KarmaFieldsAlpha.server.needRender);

				document.body.classList.remove("karma-field-loading");
				document.body.classList.remove("karma-field-uploading");

				KarmaFieldsAlpha.rendering = false;

			}, delay);

		}

	}

	parse(expression) {



		if (expression && Array.isArray(expression)) {

			switch (expression[0]) {

				case "=":
				case "==":
				case "===":
				case "!=":
				case "!==":
				case ">":
				case "<":
				case ">=":
				case "<=":
				case "like":
				case "+":
				case "-":
				case "*":
				case "/":
				case "%":
				case "&&":
				case "||": {
					const v1 = this.parseSingle(expression[1]);
					const v2 = this.parseSingle(expression[2]);
					// response = KarmaFieldsAlpha.Expression.compare(expression[0], v1, v2);
					if (v1 === undefined || v2 === undefined) {
						return;
					}
					switch (expression[0]) {
						case "=":
						case "==":
							return v1 == v2;
						case "===":
							return v1 === v2;
						case "!=":
							return v1 != v2;
						case "!==":
							return v1 !== v2;
						case ">":
							return v1 > v2;
						case "<":
							return v1 < v2;
						case ">=":
							return v1 >= v2;
						case "<=":
							return v1 <= v2;
						case "like":
							return v1.match(new RegExp(v2));
						case "+":
							return v1 + v2;
						case "-":
							return v1 - v2;
						case "*":
							return v1 * v2;
						case "/":
							return v1 / v2;
						case "%":
							return v1 % v2;
						case "&&":
							return v1 && v2;
						case "||":
							return v1 || v2;
					}
				}
				case "!": {
					const value = this.parseBoolean(expression[1]);
					if (value === undefined) {
						return;
					}
					return !value;
				}
				case "?": {
					const condition = this.parseBoolean(expression[1]);
					if (condition === undefined) {
						return;
					}
					return condition ? this.parse(expression[2]) : this.parse(expression[3]);
				}
				case "...":
				case "concat": {
					let items = expression.slice(1).map(item => this.parseArray(item));
					if (items.some(item => item === undefined)) {
						return
					}
					return items.reduce((array, item) => [...array, ...item], []);
				}
				case "math": {
					const method = expression[1];
					let values = expression.slice(2).map(value => this.parseNumber(value));
					if (values.some(value => value === undefined)) {
						return;
					}
					return Math[method](...values);
				}
				case "include": {
					let array = this.parseArray(expression[1]);
					let value = this.parseSingle(expression[2]);
					if (array === undefined || value === undefined) {
						return;
					}
					return array.include(value);
				}
				case "replace": {
					let string = this.parseString(expression[1]);
					const wildcard = expression[2];
					let replacements = expression.slice(3).map(replacement => this.parseString(replacement));
					if (string === undefined || replacements.some(value => value === undefined)) {
						return;
					}
					for (let replacement of replacements) {
						string = string.replace(wildcard, replacement)
					}
					return string;
				}
				case "date": {
					const date = this.parseString(expression[1]);
					const option = expression[2] || {}; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
					const locale = expression[3] || KarmaFieldsAlpha.locale || "en";
					if (date === undefined) {
						return;
					}
					if (date === "now") {
						return (new Date()).toLocaleDateString(locale, option);
					} else if (!date) {
						return "";
					} else {
						const dateObj = new Date(date);
						if (isNaN(dateObj)) {
							return "";
						} else {
							return dateObj.toLocaleDateString(locale, option);
						}
					}
				}
				// case "time": {
				// 	const date = this.parse(expression[1]);
				// 	const option = expression[2] || {}; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
				// 	const locale = expression[3] || KarmaFieldsAlpha.locale || "en";
				// 	if (date.loading) {
				// 		response.loading = true;
				// 	} else {
				// 		const string = date.toString();
				// 		const dateObj = new Date(string);
				// 		if (isNaN(dateObj)) {
				// 			response.value = "";
				// 		} else {
				// 			response.value = dateObj.toLocaleTimeString(locale, option);
				// 		}
				// 	}
				// 	break;
				// }
				// case "daterange": {
				// 	let date1 = this.parse(expression[1]);
				// 	let date2 = this.parse(expression[2]);
				// 	const separator = expression[3] || ' - ';
				// 	const locale = expression[4] || KarmaFieldsAlpha.locale || "en";
				// 	const options = expression[5] || { year: "numeric", month: "2-digit", day: "2-digit" };
				// 	if (date1.loading || date2.loading) {
				// 		response.loading = true;
				// 	} else {
				// 		date1 = new Date(date1.toString());
				// 		date2 = new Date(date2.toString());
				// 		if (isNaN(date2)) {
				// 			if (isNaN(date1)) {
				// 				response.value = "";
				// 			} else {
				// 				response.value = date1.toLocaleDateString(locale, options);
				// 			}
				// 		} else {
				// 			if (date1.getFullYear() === date2.getFullYear()) {
				// 				if (date1.getMonth() === date2.getMonth()) {
				// 					response.value = `${date1.toLocaleDateString(locale, { day: options.day })}${separator}${date2.toLocaleDateString(locale, options)}`;
				// 				} else {
				// 					response.value = `${date1.toLocaleDateString(locale, { day: options.day, month: options.month })}${separator}${date2.toLocaleDateString(locale, options)}`;
				// 				}
				// 			} else {
				// 				response.value = `${date1.toLocaleDateString(locale, options)}${separator}${date2.toLocaleDateString(locale, options)}`;
				// 			}
				// 		}
				// 	}
				// 	break;
				// }
				case "year":
				case "month":
				case "day":
					console.error("DEPRECATED (use date)");
					return "";
				case "request": {
					var params = expression.slice(1).map(param => this.parse(param));
					if (params.some(param => param === undefined)) {
						return;
					} else {
						return this.request(...params);
					}
				}
				case "getItem": // compat
				case "getValue": // compat
				case "getContent":// which one ?
				case "get": {
					let key = expression[1];
					let id = expression[2];
					let driver = expression[3];
					if (id) {
						id = this.parseString(id);
						if (id === undefined) {
							return;
						}
					}
					if (key) {
						key = this.parseString(key);
						if (key === undefined) {
							return;
						}
					}
					if (driver) {
						driver = this.parseString(driver);
						if (driver === undefined) {
							return;
						}
					}
					if (key && id && driver) {
						return this.getValue(key, id, driver);
					}
					return this.parent.getValue(key, id, driver); // prevent infinit loops
				}
				case "queryValue": {
					return this.parse(["get", expression[3], expression[2], expression[1]]); // compat
					// const driver = this.parse(expression[1]);
					// const id = this.parse(expression[2]);
					// const key = this.parse(expression[3]);

					// if (driver.loading || id.loading || key.loading) {
					// 	response.loading = true;
					// } else if (driver.toString() && id.toString() && key.toString()) {
					// 	// const form = new KarmaFieldsAlpha.field.form({
					// 	//   driver: driver.toString()
					// 	// });
					// 	// response = form.getValueById(id.toString(), key.toString());
					// 	// const server = new KarmaFieldsAlpha.Server(driver.toString());
					// 	// response = server.getValue(id.toString(), key.toString());
					// 	response = this.getWild(driver.toString(), id.toString(), key.toString());
					// }
					// break;
				}
				case "query": {
					const driver = this.parseString(expression[1]);
					const params = this.parseObject(expression[2]);
					if (driver === undefined || params === undefined) {
						return;
					} else {
						const paramstring = KarmaFieldsAlpha.Params.stringify(params);
						const query = KarmaFieldsAlpha.server.getQuery(driver, paramstring);
						if (query === undefined) {
							return;
						}
						if (expression[3] === "count") {
							return query.count || 0;
						} else if (expression[3] === "options") {
							return KarmaFieldsAlpha.server.getOptionsList(driver, paramstring);
						} else {
							return query.ids || [];
						}
					}
				}
				case "queryCount": {
					return this.parse(["query", expression[1], expression[2], "count"]);
				}
				case "parseParams":
					console.error("DEPRECATED");
					return;
				case "getGrid":
				case "getOptions": {
					return this.parse(["query", expression[1], expression[2], "options"]);
					// const driver = this.parse(expression[1]);
					// const params = this.parseObject(expression[2]);
					// const keys = expression[3];
					// if (driver.loading || params.loading) {
					// 	response.loading = true;
					// } else {
					// 	const paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());
					// 	response = this.getOptionsList(driver.toString(), paramstring);
					// }
					// break;
				}
				case "map": {
					const array = this.parseArray(expression[1]);
					if (array === undefined) {
						return;
					}
					const map = array.map(value => this.parse([expression[2] || "string", value]));
					if (map.some(item => item === undefined)) {
						return;
					}
					return map;
				}
				case "join": {
					const array = this.parseArray(expression[1]);
					const glue = expression[2] || ", ";
					if (array === undefined) {
						return;
					}
					return array.toArray().join(glue);
				}
				case "indexOf":
					console.error("deprecated");
					break;
				case "sum": {
					const array = this.parseArray(expression[1]);
					if (array === undefined) {
						return;
					}
					return array.reduce((accumulator, item) => accumulator + Number(item), 0);
				}
				case "getLength":
				case "count":
				case "length": {
					const array = this.parseArray(expression[1]);
					if (array === undefined) {
						return;
					}
					return array.length || 0;
				}
				case "getParam": {
					var key = this.parseString(expression[1]);
					if (key === undefined) {
						return;
					}
					return this.getParam(key);
				}
				case "hasSelection": {
					return this.hasSelection();
				}
				case "isLoading": {
					return this.parse(expression[1]) === undefined;
				}
				case "isMixed": {
					// return this.parse(expression[1]).mixed === true;
					return this.isMixed(expression[1]);
				}
				case "getKey":
				case "getIndex":// deprec
				case "getIds":
				case "getAt":
				case "array":
					console.error("deprecated", expression);
					return;

				case "debug":
				case "dump":
				case "log":
					debugger;
					return this.parse(expression[1]);
				case "max": {
					const array = this.parseArray(expression[1]);
					if (array === undefined) {
						return;
					}
					return array.reduce((accumulator, item) => Math.max(accumulator, Number(item)), 0);
				}
				case "min": {
					const array = this.parseArray(expression[1]);
					if (array === undefined) {
						return;
					}
					return array.reduce((accumulator, item) => Math.min(accumulator, Number(item)), Infinity);
				}
				case "resource": {
					var key = this.parseString(expression[1]);
					if (key === undefined) {
						return;
					}
					return this.resource[key];
				}
				case "parent":
					return this.parent.parse(expression[1]);
				case "upload-directory":
					return KarmaFieldsAlpha.uploadURL;
				case "admin-url":
					return KarmaFieldsAlpha.adminURL;
				case "rest-url":
					return KarmaFieldsAlpha.restURL;
				case "string":{
					// let value = this.parse(expression[1]);
					// if (value === undefined) {
					// 	return;
					// }
					// if (Array.isArray(value)) {
					// 	value = value[0];
					// }
					// return value.toString();
					return this.parseString(expression[1]);
				}
				case "number": {
					// let value = this.parse(expression[1]);
					// if (value === undefined) {
					// 	return;
					// }
					// if (Array.isArray(value)) {
					// 	value = value[0];
					// }
					// return Number(value);
					return this.parseNumber(expression[1]);
				}
				case "array": {
					// let value = this.parse(expression[1]);
					// if (value === undefined) {
					// 	return;
					// }
					// if (!Array.isArray(value)) {
					// 	value = [value];
					// }
					// return value;
					return this.parseArray(expression[1]);
				}
				case "object": {
					// const response = {};
					// for (let key in expression[1]) {
					// 	const value = this.parse(object[key]);
					// 	if (value === undefined) {
					// 		return;
					// 	} else if (Array.isArray(value)) {
					// 		value = value[0];
					// 	}
					// 	response[key] = value;
					// }
					// return response;
					return this.parseObject(expression[1]);
				}
				case "boolean": {
					// let value = this.parse(expression[1]);
					// if (value === undefined) {
					// 	return;
					// }
					// if (Array.isArray(value)) {
					// 	value = value[0];
					// }
					// return Boolean(value);
					return this.parseString(expression[1]);
				}
				case "escape":
					return expression[1];

				default:
					return expression;

			}

		} else if (expression && typeof expression === "object") { // compat

			return this.parseObject(expression);

		}

		return expression;

	}

	parseString(expression) {

		if (typeof expression !== "string") {

			let value = this.parseSingle(expression);

			if (value === undefined) {
				return;
			}

			return value.toString();

		}

		return expression;
	}

	parseNumber(expression) {

		if (typeof expression !== "number") {

			let value = this.parseSingle(expression);

			if (value === undefined) {
				return;
			}

			return Number(value);

		}

		return expression;
	}

	parseBoolean(expression) {

		if (typeof expression !== "boolean") {

			let value = this.parseSingle(expression);

			if (value === undefined) {
				return;
			}

			return Boolean(value);

		}

		return expression;
	}

	parseSingle(expression) {

		if (!Array.isArray(expression)) {
			return expression;
		}

		let value = this.parse(expression);

		if (value === undefined) {
			return;
		}

		if (Array.isArray(value)) {
			value = value[0];
		}

		return value;

	}

	parseArray(expression) {

		if (!Array.isArray(expression)) {
			return [expression];
		}

		let value = this.parse(expression);

		if (value === undefined) {
			return;
		}

		if (!Array.isArray(value)) {
			value = [value];
		}

		return value;
	}

	parseObject(object) {

		if (typeof object !== "object") {

			console.error("parsing object but value is no object");

		}

		// return this.parse("object", object);

		const response = {};

		for (let key in object) {

			let value = this.parse(object[key]);

			if (value === undefined) {

				return;

			} else if (Array.isArray(value)) {

				value = value[0];

			}

			response[key] = value;

		}

		return response;

	}

};
