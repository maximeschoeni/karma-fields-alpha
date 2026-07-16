
KarmaFieldsAlpha.field.tags = class extends KarmaFieldsAlpha.field.container {

	getDriver() {

		return this.resource.driver;

	}

	getBody() {

		const driver = this.getDriver();

		const resource = {
			model: "tagsList",
			dialog: {
				title: driver,
				body: {
					model: "table",
					width: "medium",
					driver: driver,
					params: this.resource.params,
					preselection: { model: "var", key: "id", },
					body: {
						model: "grid",
						children: [
							{
								model: "simpleText",
								key: "name"
							},
							{
								model: "insert"
							}
						],
						...this.resource.dialogGrid
					},
					footer: {
						children: [
							{ model: "insert" }
						]
					},
					...this.resource.dialogTable
				}
			},
			...this.resource.body
		};

		return new KarmaFieldsAlpha.field.tags.tagsList(resource, "body", this);

		// return this.createChild(resource, "body");
	}

	getFooter() {

		return new KarmaFieldsAlpha.field.tags.footer(this.resource.footer, "footer", this);

	}

	getLength() {

		let values = this.parent.getValue(this.resource.key);

		if (values === undefined) {

			return;

		}

		return values.length;

	}


	add(index, length) { // called when pasting items. Needed when importing!

		let values = this.parent.getValue(this.resource.key);

		if (values === undefined) {

			console.error("adding item but value is not loaded");

		}

		const newValues = [];

		for (let i = 0; i < length; i++) {

			newValues.push("");

		}

		values = [...values];
		values.splice(index, 0, ...newValues);

		this.parent.setValue(values, this.resource.key);

	}

	open() {

		this.edit();

	}

	// edit() {

	// 	KarmaFieldsAlpha.Store.addPromise(done => {

	// 		const editIds = this.parent.getValue(this.resource.key);
	// 		const query = this.getDescendant("body", "dialog", "body", "query");

	// 		if (editIds !== undefined && query !== undefined) {

	// 			const ids = query.getIds();
	// 			const body = query.getBody();

	// 			if (ids !== undefined && body !== undefined) {

	// 				const selection = body.getSelection();

	// 				if (selection) {

	// 					const index = ids.slice(selection.index, selection.length).indexOf(editIds[0]);

	// 					if (index > -1) {

	// 						body.setSelection({ index, length: 1 }); // -> just select the first
	// 						body.setFocus(true);

	// 					} else {

	// 						body.removeSelection();

	// 					}

	// 				}

	// 				done();

	// 			}

	// 		}

	// 	}, "editIds");

	// }

	// edit(ids) { // -> ids used in files attacher in tinymce

	// 	const body = this.getBody();

	// 	if (body && body.edit) {

	// 		body.edit(ids);

	// 	}

	// }

	// editSelection() {

	// 	const selection = this.getSelection();

	// 	if (selection) {

	// 		this.edit(selection.index, selection.length);

	// 	}

	// }

	// edit(index, length) {

	// 	if (index === undefined) {

	// 		this.editSelection();

	// 	} else {

	// 		KarmaFieldsAlpha.Store.addPromise(done => {

	// 			const editIds = this.getAllValues("id", index, length);
	// 			const query = this.getDescendant("dialog", "body", "query");

	// 			if (editIds !== undefined && query !== undefined) {

	// 				const ids = query.getIds();
	// 				const body = query.getBody();

	// 				if (ids !== undefined || body !== undefined) {

	// 					const index = ids.indexOf(editIds[0]);

	// 					if (index > -1) {

	// 						body.setQueriedSelection({ index, length: ids.length }); // -> lets hope values are consecutives...
	// 						// this.setSelection({ index, length: ids.length });
	// 						body.setFocus(true);

	// 					} else {

	// 						body.removeSelection();

	// 					}

	// 					done();

	// 				}

	// 			}

	// 		}, "editIds");

	// 	}

	// }

	// getDriver() {

	// 	const driver = this.resource.driver;

	// 	if (!driver) {

	// 		console.error("No driver defined");

	// 	}

	// 	return driver;

	// }

	// getIds() {

	// 	return this.parent.getValue(this.resource.key);

	// }

	doAction(action, ...args) {

		switch (action) {

			// case "getDriver":
			// 	return this.resource.driver;

			// case "getParams":
			// 	return this.resource.params;
			case "getMax":
				return this.getMax();

			case "getLength":
				return this.getValue();

			case "export":
				this.export();
				break;

			case "reorder":
				this.setOrder(...args);
				break;

			case "add":
				break;

			case "deleteIds":
			case "delete":
			case "remove":
				this.removeIds(...args);
				break;

			case "drop":
				this.drop();
				break;

			default:
				super.doAction(action, ...args);
				break;
		}

	}

	setOrder(newIndexes) { // -> new indexes

		const values = this.parent.getValue(this.resource.key);

		if (values === undefined) {

			console.error("Setting order but values are not loaded");

		}

		if (newIndexes.length !== values.length) {

			console.error("Setting order but newIndexes length does not match current values");

		}

		const newValues = [];

		for (let i = 0; i < values.length; i++) {

			const newIndex = newIndexes[i];

			newValues[i] = values[newIndex];

		}

		this.parent.setValue(newValues, this.resource.key);

	}


	// query(params) {

	// 	switch (params.action) {

	// 		case "hasSelection":
	// 			return this.getBody()?.hasSelection();

	// 		default:
	// 			return super.query(params);

	// 	}

	// }

	getValue(key, index) {

		let values = this.parent.getValue(this.resource.key);

		if (values === undefined) {

			return;

		}

		const id = values[index];

		if (id === undefined) {

			console.log("Getting value at but index is aout of bounds");

		}

		const driver = this.getDriver();

		return KarmaFieldsAlpha.Store.getValue(driver, id, key);

	}

	setValue(value, key, index) {

		if (!Array.isArray(value)) {

			console.log("Setting value at but value is not an array");

		}

		let values = this.parent.getValue(this.resource.key);

		if (values === undefined) {

			console.log("Setting value at but values are not loaded");

		}

		const id = values[index];

		if (id === undefined) {

			console.log("Setting value at but index is out of bounds");

		}

		const driver = this.getDriver();

		if (key === "id") {

			let ids = [...values];
			ids[index] = value[0];

			this.parent.setValue(ids, this.resource.key);

		} else {

			KarmaFieldsAlpha.Store.setValue(value, driver, id, key);

		}

	}

	drop(ids) {

		this.insert(ids);

	}

	// insert(ids, index, length = 0) {

	// 	let values = this.parent.getValue(this.resource.key);

	// 	if (values === undefined) {

	// 		console.error("inserting ids but values are undefined");

	// 	}

	// 	const newValues = [...values];
	// 	newValues.splice(index || values.length, length, ...ids)

	// 	this.parent.setValue(newValues, this.resource.key); // -> always insert at the end?

	// }

	slice(index, length) {

		if (index === undefined) { // -> export selected

			return this.getBody()?.slice();

		}

		let values = this.parent.getValue(this.resource.key);

		return values.slice(index, index + length);

	}

	insert(newValues, index, length) {

		if (index === undefined) { // -> import selected

			this.getBody()?.insert(values);

		} else {

			let values = this.parent.getValue(this.resource.key);

			if (values === undefined) {

				console.error("Inserting new values but values are not loaded");

			}

			values = [...values];
			values.splice(index, length, ...newValues);

			this.parent.setValue(values, this.resource.key);

		}

	}


	// deleteAt(index, length = 1) {

	// 	const values = this.getValue();

	// 	if (values) {

	// 		const ids = [...values];

	// 		ids.splice(index, length);

	// 		this.setValue(ids);

	// 	}

	// }

	delete(index, length) {

		if (index === undefined) { // -> delete selected

			this.getBody()?.delete();

		} else {

			let values = this.parent.getValue(this.resource.key);

			if (values === undefined) {

				console.error("Deleting but values are not loaded");

			}

			values = [...values];
			values.splice(index, length || 0);

			this.parent.setValue(values, this.resource.key);

		}

	}


	getMax() {

		return this.resource.max || this.resource.single && 1 || 999999;

	}

	isSingle() {

		return this.getMax() === 1;

	}

	export(index, length) {

		// if (index === undefined) { // -> export selected

		// 	return this.getBody()?.export();

		// }

		// let values = this.parent.getValue(this.resource.key);

		// return [values.join(",")];

		const values = this.slice(index, length);

		if (values === undefined) { // -> export selected

			return;

		}

		return [values.join(",")];

	}

	import(collection, index, length) {

		const string = collection.shift();

		if (string) {

			const newValues = string.split(",");

			this.insert(newValues, index, length);

		}

	}

	// newChild(index) {

	// 	if (index === "container") {

	// 		return new KarmaFieldsAlpha.field.button({
	// 			title: "Add",
	// 			text: "Add",
	// 			action: "open",
	// 			// hidden: [">=", ["getLength", ["getValue"]], ["request", "getMax"]],
	// 		}, "add", this);

	// 	} else {

	// 		super.newChild(index);

	// 	}

	// getContainer() {



	// }



	// getDialog() {

	// 	return new KarmaFieldsAlpha.field.dialog.dialogBox({
	// 		body: {
	// 			model: "table",
	// 			driver: this.resource.driver,
	// 			params: this.rseource.params,
	// 			body: {
	// 				model: "grid",
	// 				selectable: true,
	// 				children: [
	// 					{
	// 						model: "simpleText",
	// 						key: "name"
	// 					},
	// 					{
	// 						model: "button",
	// 						action: "insert"
	// 					}
	// 				],
	// 				...this.resource.dialogGrid
	// 			}
	// 		},
	// 		...this.resource.dialog
	// 	}, "dialog", this);

	// }


	// *build() {



	// 	// if (!this.resource.offsetContainer) {

	// 	// 	yield {
	// 	// 		class: "container-field",
	// 	// 		children: super.build(),
	// 	// 		init: element => {
	// 	// 			if (this.resource.width) {
	// 	// 				element.style.width = this.resource.width;
	// 	// 			} else {
	// 	// 				element.style.width = this.isSingle() ? "min-content" : "1fr";
	// 	// 			}
	// 	// 		},
	// 	// 		update: element => {
	// 	// 			const body = this.getBody();
	// 	// 			const hasFocus = body && this.hasFocusInside();
	// 	// 			element.classList.toggle("has-selection", Boolean(hasFocus));
	// 	// 		}
	// 	// 	};

	// 	// } else {

	// 	// 	yield {
	// 	// 		class: "content-frame",
	// 	// 		children: super.build(),
	// 	// 	};

	// 	// }



	// }

}

KarmaFieldsAlpha.field.tags.tagsList = class extends KarmaFieldsAlpha.field.sortable {

	// newChild(index) {

	// 	if (index === "add") {

	// 		return new KarmaFieldsAlpha.field.button({
	// 			title: "Add",
	// 			text: "Add",
	// 			action: "open",
	// 			hidden: {
	// 				model: "expression",
	// 				children: [
	// 					{ model: "request", request: "getLength" },
	// 					{ model: ">=" },
	// 					{ model: "request", request: "getMax" },
	// 				]
	// 			}
	// 			// hidden: [">=", ["getLength", ["getValue"]], ["request", "getMax"]],
	// 		}, "add", this);

	// 	} else {

	// 		super.newChild(index);

	// 	}

	// }


	// edit(ids) { // -> ids used in files attacher in tinymce

	// 	const dialog = this.getChild("dialog");

	// 	dialog.setFocus(true);

	// 	if (!ids) {

	// 		ids = this.getSelectedIds();

	// 	}

	// 	if (ids.length) {

	// 		dialog.selectByIds(ids);

	// 	}

	// }

	getTag(index) {

		const value = this.parent.getValue(this.resource.nameKey || "name", index);

		if (value !== undefined) {

			return names[0] || "";

		}

	}

	*buildChildren() {

		const mixed = this.parent.isMixed(this.parent.resource.key);
		const hasFocus = this.hasFocus();

		if (mixed) {

			yield {
				tag: "li",
				update: element => {
					element.classList.toggle("selected", this.isSelected(0));
				},
				children: [
					{
						tag: "span",
						update: element => {
							element.innerHTML = "[mixed]";
						}
					},
					{
						class: "close",
						init: element => {
							element.textContent = "×";
						},
						update: element => {
							element.onclick = event => {
								this.doAction("delete", 0);
								this.render();
							}
						}
					}
				]
			};

		} else {

			// const ids = this.parent.getValue();

			// if (ids !== undefined) {

			// 	const driver = this.getDriver();

			// for (let i = 0; i < ids.length; i++) {
				for (let i = 0; i < this.resource.length; i++) {

					// const names = this.getValue(this.nameKey || "name", ids[i], driver);

					// if (names) {

					// 	const name = names[0] || "";

					// 	if (name) {



					// 	}

					// }

					yield {
						tag: "li",
						update: element => {
							element.classList.toggle("selected", this.isSelected(i) && hasFocus);
							element.ondblclick = event => {
								this.save("edit", "Edit Tag");
								this.doAction("edit", i)
								this.render();
							}
						},
						children: [
							{
								tag: "span",
								update: element => {
									element.innerHTML = this.getTag(index) || "";
								}
							},
							{
								class: "close",
								init: element => {
									element.textContent = "×";
								},
								update: element => {
									element.onclick = event => {
										this.save("remove", "Remove tag");
										this.doAction("delete", i, 1);
										this.render();
									}
								}
							}
						]
					};

				}

			// }

		}

	}

	*buildContent() {

		yield {
			tag: "ul",
			update: element => {

				this.registerTracker(element);

				// const ids = this.getIds();

				// element.classList.toggle("hidden", !ids || ids.length === 0);

				// const selection = this.getSelection();

				// const sorter = new KarmaFieldsAlpha.ListSorterInline(element, selection);

				// sorter.onSelect = elements => {
				// 	elements.map(element => element.classList.add("selected"));
				// 	this.setSelection(sorter.state.selection);
				// }

				// sorter.onUnselect = elements => {
				// 	elements.map(element => element.classList.remove("selected"));
				// }

				// sorter.onSelectionComplete = () => {
				// 	// this.request("deferFocus");
				// 	if (!this.hasFocus()) {
				// 		this.setFocus(true);
				// 		this.render();
				// 	}
				// }

				// sorter.onSwap = (newState, lastState) => {

				// 	this.swapAt(lastState.selection.index, newState.selection.index, newState.selection.length);
				// 	this.setSelection(newState.selection);

				// };

				// sorter.onSort = (newSelection, lastSelection) => {
				// 	if (KarmaFieldsAlpha.DeepObject.differ(newSelection, lastSelection)) {
				// 		this.save("reorder", "reorder tags");
				// 		this.setFocus(true);
				// 		this.render();
				// 	}
				// }

				// element.ondblclick = event => {
				// 	this.save("edit", "Edit Tag");
				// 	this.parent.edit();
				// 	this.render();
				// }

				// element.onclick = event => {
				// 	if (!this.hasFocus()) {
				// 		this.setFocus(true);
				// 		this.render();
				// 	}
				// }
			},
			children: this.buildChildren()
		};

		const addButton = new KarmaFieldsAlpha.field.tags.footer.add({}, "footer", this);

		yield {
			class: "controls",
			children: addButton.build()
		};

	}

	// *buildControls() {




	// 	if (this.resource.controls !== false && !this.isMixed()) {

	// 		const addButton = new KarmaFieldsAlpha.field.button({
	// 			title: "Add",
	// 			text: "Add",
	// 			action: "open",
	// 			save: "add-tag",
	// 			hidden: [">=", ["getLength", ["get"]], ["request", "getMax"]]
	// 		}, "add", this);

	// 		yield* addButton.build();

	// 	}

	// }

	// *buildContent() {

	// 	yield {
	// 		class: "karma-tags karma-field",
	// 		children: this.buildContent()
	// 	};

	// }


}

// KarmaFieldsAlpha.field.tags.dialogBox = class extends KarmaFieldsAlpha.field.dialog.dialogBox {

// 	constructor(resource, id, parent) {

// 		super({
// 			body: {
// 				model: "table",
// 				driver: parent.resource.driver,
// 				params: parent.resource.params,
// 				body: {
// 					model: "grid",
// 					selectable: true,
// 					children: [
// 						{
// 							model: "simpleText",
// 							key: "name"
// 						},
// 						{
// 							model: "button",
// 							action: "insert"
// 						}
// 					]
// 				}
// 			},
// 			...resource
// 		}, id, parent);

// 	}

// }

KarmaFieldsAlpha.field.tags.footer = class extends KarmaFieldsAlpha.field.container.footer {

	createChild(resource, id) {

		if (resource.model === "add") {

			return new KarmaFieldsAlpha.field.tags.add(resource, id, this);

		}

		return super.createChild(resource, id);

	}

	constructor(resource, id, parent) {

		super({
			children: [
				{
					model: "add"
				}
			],
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.tags.add = class extends KarmaFieldsAlpha.field.button {

	constructor(resource, id, parent) {
		super({
			title: "Add",
			text: "Add",
			action: "open",
			hidden: {
				model: "expression",
				children: [
					{ model: "request", request: "getLength" },
					{ model: ">=" },
					{ model: "request", request: "getMax" },
				]
			}
			// hidden: [">=", ["getLength", ["getValue"]], ["request", "getMax"]],
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.tags.delete = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			title: "Remove",
			text: "Remove",
			action: "delete",
			disabled: {
				model: "expression",
				children: [
					{ model: "request", request: "hasSelection" }
				]
			},
			hidden: {
				model: "expression",
				children: [
					{ model: "request", request: "getLength" },
					{ model: "=" },
					{ model: "value", value: 0 }
				]
			},


			// disabled: ["!", ["hasSelection"]],
			// // hidden: ["=", ["count", ["getValue"]], 0],
			// hidden: ["=", ["length", ["get"]], 0],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.tags.edit = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			text: "Change",
			action: "edit",
			disabled: {
				model: "expression",
				children: [
					{ model: "!"},
					{ model: "request", request: "hasSelection" }
				]
			},
			hidden: {
				model: "expression",
				children: [
					{ model: "request", request: "getLength" },
					{ model: "=" },
					{ model: "value", value: 0 }
				]
			},
			// disabled: ["!", ["hasSelection"]],

			// hidden: ["||", ["=", ["count", ["getValue"]], 0], ["isMixed"]],
			// hidden: ["||", ["=", ["request", "getLength"], 0], ["isMixed", ["getValue"]]],
			// hidden: ["||", ["=", ["length", ["get"]], 0], ["isMixed"]],
			...resource
		}, id, parent);
	}
}
