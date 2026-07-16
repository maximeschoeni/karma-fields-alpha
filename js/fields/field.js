
// KarmaFieldsAlpha.loading = Symbol("loading");
// KarmaFieldsAlpha.mixed = Symbol("mixed");

KarmaFieldsAlpha.field = class {

  static fieldId = 0;
  static uniqueId = 1;

	constructor(resource, id, parent) {

    if (typeof resource === "string") { // deprecated

      this.resource = KarmaFieldsAlpha.tables[resource];

    } else if (resource.model && KarmaFieldsAlpha.tables[resource.model]) {

      this.resource = {...KarmaFieldsAlpha.tables[resource.model], ...resource};

    } else if (resource.field && KarmaFieldsAlpha.tables[resource.field]) { // deprecated

      this.resource = {...KarmaFieldsAlpha.tables[resource.field], ...resource};

    } else {

      this.resource = resource || {};

    }

		this.fieldId = KarmaFieldsAlpha.field.fieldId++;

		this.length = 0; // children count to generate children index;


		if (parent) {

			this.parent = parent;

			if (id) {

				this.id = id
				this.uid = `${parent.uid}-${id}`;
				this.path = [...parent.path, id];

			} else {

				this.uid = parent.uid;
				this.path = parent.path;

			}

		} else {

			this.path = [];
			this.uid = "saucer";
		}

  }

  getKey() {

    return this.resource.key;

  }

	addChild(field, id) {

		// const index = this.length++;

		field.id = id;
		// field.index = index;
		field.parent = this;
		field.uid = `${this.uid}-${id}`;
		field.path = [...this.path, id];
		// field.uindex = `${this.uindex.toString(36)}${index.toString(36)}`;
		// field.indexPath = [...this.indexPath, index];

		// if (this.resource[id]) {

		// 	KarmaFieldsAlpha.Collection.assign(field.resource, this.resource[id]);

		// }

	}



	// getResource(...path) {

	// 	let value = KarmaFieldsAlpha.Collection.get(this.resource, ...path);

	// 	if (value === undefined) {

	// 		return this.parent.getResource(this.id, ...path);

	// 	}

	// 	return value;

	// }

	assign(resource) {

		this.resource = KarmaFieldsAlpha.Collection.assign({}, this.resource, resource);

	}

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

		// 	return this.parseExpression(this.resource.label);

		// }

		// return new KarmaFieldsAlpha.Content(this.resource.label);

		return this.parseString(this.resource.label);
	}

	queryLabel() {

		if (this.resource.label || this.resource.title) { // compat

			return this.parseExpression(this.resource.label || this.resource.title);

		} else if (this.parent) {

			return this.parent.queryLabel();

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

	createChild(resource, id) {

		if (!resource) {

			console.error("creating child without resource");

		}

		// if (id === undefined) {

		// 	id = 0;

		// 	// console.error("creating child without an id");

		// }

		let prototype;

		if (typeof resource === "string") { // compat

			prototype = resource;
			resource = {
				model: prototype
			};

		} else {

			prototype = resource.model || resource.type || "group";

		}

		while (prototype && KarmaFieldsAlpha.tables[prototype]) {

			const inheritedResource = KarmaFieldsAlpha.tables[prototype];

			prototype = inheritedResource.model || inheritedResource.type;
			resource = { ...inheritedResource, ...resource };

		}

		if (!prototype) {

			console.error(`Model is not defined in ${resource.model||resource.type}`);

		}

		let constructor = this.getConstructor(prototype);

		if (!constructor) {

			console.warn("constructor does not exist", prototype, this);

			constructor = KarmaFieldsAlpha.field;

		}

		const child = new constructor(resource, id, this);

		return child;
	}

	// createField(type, resource, id) { // -> simpler method for creating child field

	// 	if (!type) {

	// 		console.error("creating field without type");

	// 	}

	// 	if (!resource) {

	// 		console.error("creating field without resource");

	// 	}

	// 	if (id === undefined) {

	// 		console.error("creating field without an id");

	// 	}

	// 	if (!KarmaFieldsAlpha.field[type]) {

	// 		console.error("Creating field but type does not exist");

	// 	}

	// 	return new KarmaFieldsAlpha.field[type](resource, id, this);

	// }

	// createField2(resource, id) { // -> simpler method for creating child field

	// 	if (typeof resource === "string") {

	// 		resource = { model: resource };

	// 	}

	// 	if (resource.model) {

	// 		console.error("Creating field but there are no model in resource");

	// 	}

	// 	if (KarmaFieldsAlpha.tables[resource.model]) {

	// 		return this.createField2({
	// 			...KarmaFieldsAlpha.tables[resource.model],
	// 			...resource,
	// 			model: KarmaFieldsAlpha.tables[resource.model].model
	// 		}, id);

	// 	} else if (this.constructor[resource.model]) {

	// 		return new this.constructor[resource.model](resource, id, this);

	// 	} else if (KarmaFieldsAlpha.field[resource.model]) {

	// 		return new KarmaFieldsAlpha.field[resource.model](resource, id, this);

	// 	} else {

	// 		console.error("Creating field but model is not defined");

	// 	}

	// }

	createField3(resource) { // -> may return undefined if model is not loaded

		const modelName = resource.model || resource.type || "group";

		if (KarmaFieldsAlpha.field[modelName]) {

			return new KarmaFieldsAlpha.field[modelName](resource);

		} else {

			const modelResource = KarmaFieldsAlpha.Store.getModel(modelName);

			if (modelResource) {

				return this.createField3({
					...modelResource,
					...resource,
					model: modelResource.model || modelResource.type
				});

			}

		}

	}

	createChild3(resource, id) {

		const field = this.createField3(resource);

		if (field) {

			return this.addField(field, id);

		}

	}


	addField(field, id) {

		field.parent = this;

		if (id) {

			field.id = id
			field.uid = `${this.uid}-${id}`;
			field.path = [...this.path, id];

		} else {

			field.uid = this.uid;
			field.path = this.path;

		}

	}

	getModel(name) {

		return KarmaFieldsAlpha.server.getModel(name);

		console.error("getting value but field has no parent");

	}

	getFocusObject() { // -> to be renamed getFocus()

		return KarmaFieldsAlpha.server.getAttribute("", "focus") || {};

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

	setFocus(useClipboard) {

		// KarmaFieldsAlpha.server.setState(useClipboard || false, "", "clipboard");
		// KarmaFieldsAlpha.server.setState(fieldId || this.uid, "", "focus");
		// KarmaFieldsAlpha.server.setState(path || this.path, "", "focusPath");

		KarmaFieldsAlpha.Store.setAttribute({
			clipboard: useClipboard || false,
			id: this.uid,
			path: this.path
		}, "", "focus");

		if (useClipboard) {
			document.getElementById("karma-fields-alpha-clipboard").focus({ preventScroll: true });
		}

	}

	removeFocus() {

		// KarmaFieldsAlpha.server.setState(true, "", "clipboard"); // remove any element focus
		// KarmaFieldsAlpha.server.setState("", "", "focus");
		// KarmaFieldsAlpha.server.setState([], "", "focusPath");

		KarmaFieldsAlpha.server.setAttribute({
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

			console.error("path should not be passed as argument");

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

	getRelativeFocusPath() {

		let path = this.getFocusPath();

		if (path.length < this.path.length) {

			return;

		}

		let index = 0;

		while (index < this.path.length) {

			if (this.path[index] !== path[index]) {

				return;

			}

			index++;

		}

		return path.slice(index);

	}

	getDescendantWithFocus() {

		const path = this.getRelativeFocusPath();

		if (path) {

			return this.getDescendant(...path);

		}

	}

	getState(key) {

		return KarmaFieldsAlpha.Store.getAttribute(this.uid, key);

	}

	setState(value, key) {

		KarmaFieldsAlpha.Store.setAttribute(value, this.uid, key);

	}

	removeState(key) {

		KarmaFieldsAlpha.Store.removeAttribute(this.uid, key);

	}

	getData(key) { // created for tinymce popup linkforms

		return KarmaFieldsAlpha.server.getData(this.uid, key);

	}

	setData(value, key) {

		KarmaFieldsAlpha.server.setData(value, this.uid, key);

	}

	removeData(key) {

		KarmaFieldsAlpha.server.removeData(this.uid, key);

	}

	getTempo(key) {

		return KarmaFieldsAlpha.server.getTempo(this.uid, key);

	}

	setTempo(value, key) {

		KarmaFieldsAlpha.server.setTempo(value, this.uid, key);

	}




	getSelection() {

		if (!this.hasFocus() && !this.hasFocusInside()) {

			return {};

		}

		return KarmaFieldsAlpha.Store.getAttribute(this.uid, "selection") || {};

	}

	setSelection(selection) {

		KarmaFieldsAlpha.Store.setAttribute(selection, this.uid, "selection");

	}

	removeSelection() {

		this.unselect();

	}

	cleanSelection() {

		console.error("Deprecated cleanSelection");

		const selection = this.getSelection();

		if (this.hasSelectionLength() && (!this.hasFocus() || !this.hasFocusInside())) {

			this.unselect();

		}

	}

	unselect() {

		const selection = this.getSelection();

		if (selection && selection.length) {

			this.setSelection({}, this.uid);

		}

	}

	isSelectedAt(index) {

		const selection = this.getSelection();

		if (selection) {

			return index >= selection.index && index < selection.index + selection.length;

		}

		return false;
	}

	hasSelection() { // ?? deprecated ??

		if (this.parent) {

			return this.parent.hasSelection();

		}

		return false;

	}

	hasSelectionInside() {

		return false;

	}

	hasSelectionLength() { // -> to be renamed hasSelection

		const selection = this.getSelection();

		return selection.length > 0;
	}



	getFocusField() {

		if (this.parent) {

			return this.parent.getFocusField();

		} else {

			const path = this.getFocusPath() || [];

			if (path.length) {

				return this.getChild(...path.slice(1));

			}

		}

	}

	submit() {

		if (this.parent) {

			return this.parent.submit();

		} else {

			return KarmaFieldsAlpha.Store.submit();

		}

	}

	hasEdits() {

		return KarmaFieldsAlpha.server.hasEdits();

	}

	save(id, name) {

		return KarmaFieldsAlpha.Store.saveHistory(`${this.uid}-${id}`, name);

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

			console.warn("should use getDescendant instead");

			return child.getChild(...path);

		}

		return child;

	}

	getDescendant(id, ...path) {

		let child = this.newChild(id);

		if (child && path.length) {

			return child.getDescendant(...path);

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

	doAction(action, ...args) {

		if (this.parent) {

			return this.parent.doAction(action, ...args);

		} else {

			console.error("Action was not catched: ", action, ...args);

		}

	}


  getRoot() {

    if (this.parent) {

      return this.parent.getRoot();

    }

    return this;
  }


	// getIds() {

	// 	if (this.parent) {

	// 		return this.parent.getIds();

	// 	}

	// 	return [];
	// }

	// setIds(ids) {

	// 	if (this.parent) {

	// 		this.parent.setIds(ids);

	// 	}

	// }

	// removeIds(ids) {

	// 	if (this.parent) {

	// 		this.parent.removeIds(ids);

	// 	}

	// }

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

	getValueAt(key, index) {

		if (this.parent) {

			return this.parent.getValueAt(key, index);

		}

		console.warn("getting value at but field has no parent");

		return [];

	}

	setValueAt(value, key, index) {

		if (this.parent) {

			this.parent.setValueAt(value, key, index);

		}

		console.warn("setting value at but field has no parent", this);

	}

	getSingleValue(key, id, driver) {

		const values = this.getValue(key, id, driver);

		if (values) {

			return values[0];

		}

	}

	setSingleValue(value, key, id, driver) {

		this.setValue([value], key, id, driver);

	}

	getSelectedValues(key) {

		if (this.parent) {

			this.parent.getSelectedValues(key);

		}

		return [];

	}

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

			for (let i = 0; i < this.resource.children.length; i++) {

				const child = this.getChild(i);

				if (child) {

					keys.push(...child.getKeys());

				} else {

					console.warn("No child at", i, this);

				}

			}

		}

		return keys;

	}

	// used by array
	*listKeys() {

		const key = this.getKey();

		if (key) {

			yield key;

		} else if (this.resource.children) {

			for (let i = 0; i < this.resource.children.length; i++) {

				const child = this.getChild(i);

				if (!child) {

					console.error("Getting child at index but there is not!");

				}

				yield* child.listKeys();

			}

		}

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



	getQueriedOptions(keys = ["name"]) {

		let paramstring = KarmaFieldsAlpha.server.getTempo("state", this.uid, "paramstring");

		if (paramstring === undefined) {

			if (this.resource.params) {

				const params  = this.parseExpression(this.resource.params);

				if (params !== undefined) {

					paramstring = KarmaFieldsAlpha.Params.stringify(params);

					KarmaFieldsAlpha.server.setTempo(paramstring, "state", this.uid, "paramstring");

				}

			} else {

				paramstring = "";

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

			const queriedOptions = this.getQueriedOptions([this.resource.nameField || "name"]);

			if (queriedOptions === undefined) {

				return;

			}

			options = [...options, ...queriedOptions];

		}

		return options;

	}

	// getWidth() { // -> used by dialog

	// 	switch (this.resource.width) {

	// 		case "small":
	// 			return "var(--small-width)";

	// 		case "medium":
	// 			return "var(--medium-width)";

	// 		case "large":
	// 			return "var(--large-width)";

	// 		case "full":
	// 		case "1fr":
	// 			return "100%";

	// 		default:
	// 			return this.resource.width || "auto";

	// 	}

	// }

	parseWidth(width) { // -> used by dialog

		switch (width) {

			case "small":
				return "var(--small-width)";

			case "medium":
				return "var(--medium-width)";

			case "large":
				return "var(--large-width)";

			case "full":
			case "1fr":
				return "var(--full-width)";
				// return "100%";

			default:
				return width || "auto";

		}

	}

	getWidth() {

		return this.parseWidth(this.resource.width);

	}


	getParam(key) {

		console.error("deprecated. Use doAction");

		if (this.parent) {

			return this.parent.getParam(key);

		}

	}

	setParam(value, key) {

		console.error("deprecated. Use doAction");

		if (this.parent) {

			this.parent.setParam(value, key);

		}

	}

	add(...args) {

		console.error("deprecated. Use doAction");

    if (this.parent) {

      return this.parent.add(...args);

    }

  }

  delete(...args) { // needed eg. when deleting tag by delete key

		console.error("deprecated. Use doAction");

    if (this.parent) {

      return this.parent.delete(...args);

    }

  }

	paste(...args) {

		console.error("deprecated. Use doAction");

    if (this.parent) {

      return this.parent.paste(...args);

    }

  }

	closest(callback) {

		console.error("deprecated. Use doAction");

    if (callback(this, this.resource)) {

      return this;

    } else if (this.parent) {

      return this.parent.closest(callback);

    }

  }

	getDefaults() {

		let defaults = {};

		if (this.resource.defaults) {

			const params = this.parseObject(this.resource.defaults);

			if (params === undefined) {

				return;

			}

			Object.assign(defaults, params);

		}

		if (this.resource.default && this.resource.key) {

			const key = this.getKey();
			const value = this.parseExpression(this.resource.default);

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

	getTitle() {

		if (this.resource.title) {

			return this.parseString(this.resource.title);

		} else if (this.parent) {

			this.parent.getTitle();

		} else {

			return "";

		}

	}


	undo() {

		history.back();

    // KarmaFieldsAlpha.history.undo();

  }

	redo() {

		history.forward();

    // KarmaFieldsAlpha.history.redo();

  }


	isDisabled() {

		console.error("deprecated. Use doAction");

		if (this.resource.disabled) {

			return this.parent.parseBoolean(this.resource.disabled || false);

		} else if (this.resource.enabled) {

			return !this.parent.parseBoolean(this.resource.enabled);

		}

		return false;
	}

	isMixed(key, ids = undefined) {

		// console.error("deprecated. Use doAction");

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

		console.error("deprecated. Use doAction");

    if (this.parent) {

      return this.parent.isPopup();

    }

    return false;

  }


	isHidden() {

		// console.error("deprecated. Use doAction");

		if (this.resource.hidden) {

			return this.parseBoolean(this.resource.hidden) || false;

		} else if (this.resource.visible !== undefined) {

			return !this.parseBoolean(this.resource.visible);

		}

		return false;
	}

	drop() {

		console.error("deprecated. Use doAction");

		this.parent.drop();

	}

	canDrop() {

		console.error("deprecated. Use doAction");

		if (this.parent) {

			return this.parent.canDrop();

		}

		return false;
	}



	*build(context) {


		if (context === "dialog") { // deprec

			yield {
				class: "scroll-container",
				children: this.build("frame")
			};

		} else if (context === "frame") { // deprec

			yield {
				class: "content-frame",
				children: this.build()
			};

		} else {

			yield {
				tag: "pre",
				update: element => {
					element.innerHTML = JSON.stringify(this.resource, null, " ");
				}
			};

		}



	}

	*buildLabel() {

		if (this.resource.label) {

			yield {
				class: "label",
				init: element => {
					element.innerHTML = this.getLabel() || "";
				}
			};

		}

	}

	*buildDescription() {

		if (this.resource.description) {

			yield {
				tag: "p",
				class: "description",
				update: element => {
					element.innerHTML = this.resource.description || "";
				}
			};

		}

	}


	// *buildBlockContent() {

	// 	yield* this.buildLabel();
	// 	yield* this.build();
	// 	yield* this.buildDescription();

	// }

	// *buildBlock() {

	// 	yield {
	// 		class: "field-block",
	// 		children: this.buildBlockContent(),
	// 		update: element => {
	// 			element.classList.toggle("hidden", this.isHidden());
	// 			if (this.resource.width) {
	// 				if (this.resource.width === "1fr") {
	// 					element.style.flexGrow = 1;
	// 				// } else if (this.resource.width === "auto") {
	// 				// 	element.style.display = "inline-block";
	// 				} else {
	// 					element.style.width = this.resource.width;
	// 				}
	// 			}
	// 		}
	// 	};

	// }

	// *buildTableCell() {

	// 	yield* this.build();
	// 	yield* this.buildDescription();

	// }

	// *buildTableCells() {

	// 	yield {
	// 		tag: "th",
	// 		children: this.buildLabel()
	// 	};

	// 	yield {
	// 		tag: "td",
	// 		children: this.buildTableCell()
	// 	}

	// }

	*buildFrame() {

		yield* this.build();

		// yield {
		// 	class: "content-frame",
		// 	children: this.build()
		// };

	}

	*buildDialog() { // deprec

		yield* this.build("dialog");

	}

	edit(ids) {

		console.error("deprecated. Use doAction");

		this.parent.edit(ids);

	}

	open() {

		console.error("deprecated. Use doAction");

		this.parent.open();

	}

	close() {

		console.error("deprecated. Use doAction");

		this.parent.close();

	}

	next() {

		console.error("deprecated. Use doAction");

		this.parent.next();

	}

	prev() {

		console.error("deprecated. Use doAction");

		this.parent.prev();

	}

	render() {

		if (this.parent) {

			return this.parent.render();

		}

	}

	// async render(depth = "deep") {

	// 	KarmaFieldsAlpha.renderingDepth = depth;

	// 	if (KarmaFieldsAlpha.rendering) {

	// 		return;

	// 	}

	// 	KarmaFieldsAlpha.rendering = true;

	// 	while (await KarmaFieldsAlpha.server.process()) {

	// 		await this.abduct();

	// 	}

	// 	KarmaFieldsAlpha.rendering = false;

	// }

	parseExpression(expression) {



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
					return condition ? this.parseExpression(expression[2]) : this.parseExpression(expression[3]);
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
				case "toFixed": {
					const value = this.parseNumber(expression[1]);
					if (value === undefined) {
						return;
					}
					return value.toFixed(expression[2] || 0);
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
					if (string === undefined) {
						return;
					}
					// // if (string === undefined || replacements.some(value => value === undefined)) {
					// 	return;
					// }
					for (let replacement of replacements) {
						string = string.replace(wildcard, replacement || "");
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
						return (new Date()).toLocaleString(locale, option);
					} else if (!date) {
						return "";
					} else {
						const dateObj = new Date(date);
						if (isNaN(dateObj)) {
							return "";
						} else {
							return dateObj.toLocaleString(locale, option);
						}
					}
				}
				// case "time": {
				// 	const date = this.parseExpression(expression[1]);
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
				// 	let date1 = this.parseExpression(expression[1]);
				// 	let date2 = this.parseExpression(expression[2]);
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
					var params = expression.slice(1).map(param => this.parseExpression(param));
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
					if (expression[3] !== undefined && expression[2] !== undefined && expression[1] !== undefined) {
						const key = this.parseString(expression[1]);
						const id = this.parseString(expression[2]);
						const driver = this.parseString(expression[3]);
						if (driver === undefined || id === undefined || key === undefined) {
							return;
						}
						if (!driver || !id || !key) {
							return [];
						}
						return KarmaFieldsAlpha.server.getValue(driver, id, key);
					} else if (expression[2] !== undefined && expression[1] !== undefined) {
						const key = this.parseString(expression[1]);
						const id = this.parseString(expression[2]);
						const driver = this.getDriver();
						if (id === undefined || key === undefined) {
							return;
						}
						if (!driver || !id || !key) {
							return [];
						}
						return KarmaFieldsAlpha.server.getValue(driver, id, key);
					} else if (expression[1] !== undefined) {
						const key = this.parseString(expression[1]);
						if (key !== undefined) {
							return this.parent.getValue(key);
						}
					} else {
						const key = this.getKey();
						return this.parent.getValue(key);
					}
					return;
					// let key = expression[1];
					// let id = expression[2];
					// let driver = expression[3];
					// if (id) {
					// 	id = this.parseString(id);
					// 	if (id === undefined) {
					// 		return;
					// 	}
					// }
					// if (key) {
					// 	key = this.parseString(key);
					// 	if (key === undefined) {
					// 		return;
					// 	}
					// }
					// if (driver) {
					// 	driver = this.parseString(driver);
					// 	if (driver === undefined) {
					// 		return;
					// 	}
					// }
					// if (key && id && driver) {
					// 	return this.getValue(key, id, driver);
					// }
					// return this.parent.getValue(key, id, driver); // prevent infinit loops
				}


				case "queryValue": {
					return this.parseExpression(["get", expression[3], expression[2], expression[1]]); // compat
					// const driver = this.parseExpression(expression[1]);
					// const id = this.parseExpression(expression[2]);
					// const key = this.parseExpression(expression[3]);

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
				case "sum": {
					const key = this.parseString(expression[1]);
					if (key === undefined) {
						return;
					}
					const driver = this.request("getDriver") || "";
					const paramstring = this.request("getParamstring") || "";
					let sum = 0;
					if (driver) {
						const query = KarmaFieldsAlpha.server.getQuery(driver, paramstring);
						if (query === undefined) {
							return;
						}
						for (let id of query.ids) {
							const values = KarmaFieldsAlpha.server.getValue(driver, id, key);
							if (values === undefined) {
								return;
							}
							sum += parseInt(values[0] || 0);
						}
					}
					return sum;
				}
				case "query": {
					const driver = this.parseString(expression[1]);
					const params = this.parseObject(expression[2] || {});
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
					return this.parseExpression(["query", expression[1], expression[2], "count"]);
				}
				case "parseParams":
					console.error("DEPRECATED");
					return;
				case "getGrid":
				case "getOptions": {
					return this.parseExpression(["query", expression[1], expression[2], "options"]);
					// const driver = this.parseExpression(expression[1]);
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
					const map = array.map(value => this.parseExpression([expression[2] || "string", value]));
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
					return array.join(glue);
				}
				case "indexOf":
					console.error("deprecated");
					break;
				case "sum": { // -> doublon !!!!
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
				case "substring": {
					const string = this.parseString(expression[1]);
					const offset = expression[2] && this.parseNumber(expression[2]) || 0;
					const length = expression[3] && this.parseNumber(expression[3]) || 9999999;
					if (array === undefined || offset === undefined || length === undefined) {
						return;
					}
					return string.slice(offset, offset + length);
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
					return this.parseExpression(expression[1]) === undefined;
				}
				case "isMixed": {
					// return this.parseExpression(expression[1]).mixed === true;
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
					return this.parseExpression(expression[1]);
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
					return this.parent.parseExpression(expression[1]);
				case "upload-directory":
					return KarmaFieldsAlpha.uploadURL;
				case "admin-url":
					return KarmaFieldsAlpha.adminURL;
				case "rest-url":
					return KarmaFieldsAlpha.restURL;
				case "string":{
					// let value = this.parseExpression(expression[1]);
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
					// let value = this.parseExpression(expression[1]);
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
					// let value = this.parseExpression(expression[1]);
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
					// 	const value = this.parseExpression(object[key]);
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
					// let value = this.parseExpression(expression[1]);
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

	isExpression(expression) {

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
				case "||":
				case "!":
				case "?":
				case "...":
				case "concat":
				case "math":
				case "toFixed":
				case "include":
				case "replace":
				case "date":
				case "request":
				case "getItem": // compat
				case "getValue": // compat
				case "getContent":// which one ?
				case "get":
				case "queryValue":
				case "sum":
				case "query":
				case "queryCount":
				case "getGrid":
				case "getOptions":
				case "map":
				case "join":
				case "getLength":
				case "count":
				case "length":
				case "substring":
				case "getParam":
				case "hasSelection":
				case "isLoading":
				case "isMixed":
				case "debug":
				case "dump":
				case "log":
				case "max":
				case "min":
				case "resource":
				case "parent":
				case "upload-directory":
				case "admin-url":
				case "rest-url":
				case "string":
				case "number":
				case "array":
				case "object":
				case "boolean":
				case "escape":
					return true;
			}

		}

		return false;

	}

	// parseString(expression) {

	// 	if (typeof expression !== "string") {

	// 		if (Array.isArray(expression)) {

	// 			expression = this.parseExpression(expression);

	// 		}

	// 		if (expression === undefined) {

	// 			return;

	// 		}

	// 		if (Array.isArray(expression)) {

	// 			expression = expression[0] || "";

	// 		}

	// 		return expression.toString();

	// 	}

	// 	return expression;
	// }

	// parseNumber(expression) {

	// 	if (typeof expression !== "number") {

	// 		if (Array.isArray(expression)) {

	// 			expression = this.parseExpression(expression);

	// 		}

	// 		if (expression === undefined) {

	// 			return;

	// 		}

	// 		if (Array.isArray(expression)) {

	// 			expression = expression[0] || 0;

	// 		}

	// 		return Number(expression);

	// 	}

	// 	return expression;
	// }

	// parseBoolean(expression) {

	// 	if (typeof expression !== "boolean") {

	// 		if (Array.isArray(expression)) {

	// 			expression = this.parseExpression(expression);

	// 		}

	// 		if (expression === undefined) {

	// 			return;

	// 		}

	// 		if (Array.isArray(expression)) {

	// 			expression = expression[0] || false;

	// 		}

	// 		if (expression === "0") {
	// 			return false;
	// 		}

	// 		return Boolean(expression);

	// 	}

	// 	return expression;
	// }



	parseSingle(expression) {

		if (!Array.isArray(expression)) {
			return expression;
		}

		let value = this.parseExpression(expression);

		if (value === undefined) {
			return;
		}

		if (Array.isArray(value)) {
			value = value[0];
		}

		return value;

	}

	// parseArray(expression) {

	// 	if (!Array.isArray(expression)) {
	// 		return [expression];
	// 	}

	// 	let value = this.parseExpression(expression);

	// 	if (value === undefined) {
	// 		return;
	// 	}

	// 	if (!Array.isArray(value)) {
	// 		value = [value];
	// 	}

	// 	return value;
	// }

	parseObject(object) {

		if (typeof object !== "object") {

			console.error("parsing object but value is no object");

		}

		const response = {};

		for (let key in object) {

			let value = this.parseExpression(object[key]);

			if (value === undefined) {

				return;

			} else if (Array.isArray(value)) {

				value = value[0];

			}

			response[key] = value;

		}

		return response;

	}

	parseField(resource) {

		if (resource) {

			if (typeof resource === "object") {

				if (Array.isArray(resource)) {

					if (this.isExpression(resource)) { // compat

						return this.createChild({
							model: "var",
							value: this.parseExpression(resource)
						});

					}

					return this.createChild({
						model: "var",
						value: resource
					});

				}

				return this.createChild(resource);

			} else if (typeof resource === "string") {

				const match = resource.match(/^{(.*?)}$/);

				if (match) {

					return this.createChild({
						model: "var",
						key: match[1]
					});

				}

				return this.createChild({
					model: "var",
					value: [resource]
				});

			}

		}

		return this.createChild({
			model: "var",
			value: []
		});



	}

	parse(value) {

		return this.parseField(value)?.toArray()[0];

	}

	parseArray(value) {

		const child = this.parseField(value);

		if (!child) return;

		return child.toArray();

		// if (value.model || value.type) {

		// 	const child = this.createChild(value, "string");

		// 	if (child === undefined) {

		// 		return;

		// 	}

		// 	return child.toArray();

		// } else if (this.isExpression(value)) { // -> compat

		// 	value = this.parseExpression(value);

		// 	if (value === undefined) {
		// 		return;
		// 	}

		// 	if (!Array.isArray(value)) {
		// 		value = [value];
		// 	}

		// 	return value;

		// } else if (!Array.isArray(value)) {

		// 	return [value];

		// }

		// return value;

	}

	parseString(value) {

		const child = this.parseField(value);

		if (!child) return;

		return child.toString();


		// if (value.model || value.type) {

		// 	const child = this.createChild(value, "string");

		// 	if (child === undefined) {

		// 		return;

		// 	}

		// 	return child.toString();

		// } else if (this.isExpression(value)) { // -> compat

		// 	value = this.parseExpression(value);

		// 	if (value === undefined) {

		// 		return;

		// 	}

		// 	if (Array.isArray(value)) {

		// 		value = value[0] || "";

		// 	}

		// 	return value.toString();

		// // } else if (typeof value === "object") {

		// // 	return this.createChild({ model: "value", ...value }, "text")?.toString();

		// }

		// return value.toString();

	}

	parseBoolean(value) {

		const child = this.parseField(value);

		if (!child) return;

		return child.toBoolean();

		// if (value.model || value.type) {

		// 	const child = this.createChild(value, "string");

		// 	if (child === undefined) {

		// 		return;

		// 	}

		// 	return child.toBoolean();

		// } else if (this.isExpression(value)) { // -> compat

		// 	value = this.parseExpression(value);

		// 	if (value === undefined) {

		// 		return;

		// 	}

		// 	if (Array.isArray(value)) {

		// 		value = value[0] || false;

		// 	}

		// 	return Boolean(value);

		// // } else if (typeof value === "object") {

		// // 	return this.createChild({ model: "value", ...value }, "text")?.toBoolean();

		// }

		// return Boolean(value);

	}

	parseNumber(value) {

		const child = this.parseField(value);

		if (!child) return;

		return child.toNumber();

		// if (value.model || value.type) {

		// 	const child = this.createChild(value, "string");

		// 	if (child === undefined) {

		// 		return;

		// 	}

		// 	return child.toNumber();

		// } else if (this.isExpression(value)) { // -> compat

		// 	value = this.parseString(value) || 0;

		// 	return Number(value);


		// // } else if (typeof value === "object") {

		// // 	return this.createChid({ model: "value", ...value }, "text")?.toNumber();

		// }

		// return Number(value);

	}

	toArray() {

		return [];

	}

	toString() {

		const values = this.toArray();

		if (!values) return;

		return values[0] || "";

	}

	toBoolean() {

		const values = this.toArray();

		if (!values) return;

		return Boolean(values[0]);

	}

	toNumber() {

		const values = this.toArray();

		if (!values) return;

		return Number(values[0] || 0);
	}

	toSingle() {

		const values = this.toArray();

		if (!values) return;

		if (!values.length) return null;

		return values[0];

	}

};
