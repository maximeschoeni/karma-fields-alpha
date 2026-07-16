
KarmaFieldsAlpha.field.tags = class extends KarmaFieldsAlpha.field.container {

	getBody() {

		return this.getChild("body");

	  // return new KarmaFieldsAlpha.field.tagsList({
	  // ...this.resource.body
	  // }, "body", this);

	}

	getPopup() {

		let resource;

		if (this.resource.table) {

			resource = KarmaFieldsAlpha.tables[this.resource.table];

		} else {

			resource = this.resource.popup;

		}

		if (resource) {

			// const tableResource = KarmaFieldsAlpha.tables[this.resource.table];
			const constructor = this.getConstructor(resource.type || "table"); // may be medias!

			return new constructor(resource, "popup", this);

		}

	}


	newChild(index) {

		if (index === "popup") {

			return this.getPopup();

		} else if (index === "body") {

			return this.createChild({
				type: "tagsList",
				dialog: this.resource.dialog || {
					type: "table",
					driver: this.resource.driver,
					params: this.resource.params,
					header: {
						children: [
							{
								type: "title",
								content: this.resource.driver
							},
							"count",
							"pagination",
							"close"
						]
					},
					body: {
						type: "grid",
						children: [
							{
								type: "text",
								content: ["get", "name"]
							}
						]
					},
					footer: {
						children: [
							"insert"
						]
					}
				},
				...this.resource.body
			}, "body");

		} else {

			return super.newChild(index);

		}

	}

	add() { // called when pasting items


	}

	open() {

		this.edit([]);

	}

	edit(ids) { // -> ids used in files attacher in tinymce

		const body = this.getBody();

		if (body && body.edit) {

			body.edit(ids);

		}

	}

	// ???
	getTable() {

		return this.parse(this.resource.table);

	}

	getDriver() {

		const driver = this.resource.driver;

		if (!driver) {

			console.error("No driver defined");

		}

		return driver;

	}

	// getDriver() {

	// 	if (this.resource.driver) {

	// 		return this.resource.driver;

	// 	} else {

	// 		const table = this.resource.table;
	// 		const resource = KarmaFieldsAlpha.saucer.resource.tables[table];

	// 		if (resource) {

	// 			return resource.driver;

	// 		} else {

	// 			console.error("Table resource not found:", table);

	// 		}

	// 	}

	// }


	getValue(key, id) {

		if (key) {

			if (id !== undefined) {

				const driver = this.getDriver();

				return super.getValue(key, id, driver);

			}

		}

		return super.getValue(key, id);

	}

	getIds() {

		return this.getValue();

	}

	getSelectedIds() {

		const body = this.getBody();

		if (body) {

			return body.getSelectedIds();

		}

		return [];

	}


	canDrop() {

		return true;

	}

	drop(ids) {

		this.insert(ids);

	}

	insert(ids, index = undefined, length = undefined) {

		let values = this.getValue();

		if (values === undefined) {

			console.error("inserting ids but values are undefined");

		}

		this.setValue([...values, ...ids]); // -> always insert at the end?
		this.setFocus(true);

	}


	export(index = 0, length = Infinity) {

		const output = [];

		if (this.resource.export !== false) {

			const ids = this.getValue();

			if (ids !== undefined) {

				return ids.slice(index, index + length).join(",");

			}

		}

		return output;

	}

	import(collection, index = 0, length = Infinity) {

		const string = collection.shift();

		const ids = string && string.split(",") || [];

		// let values = this.getValue();

		// const newIds = [...content.toArray()];
		// newIds.splice(index, length, ...addedIds);

		this.setValue(ids);

	}

	setOrder(ids) {

		this.setValue(ids);

	}

	addIds(...ids) { // -> to be called by parent

		this.insert(ids);

	}

	deleteAt(index, length = 1) {

		const values = this.getValue();

		if (values) {

			const ids = [...values];

			ids.splice(index, length);

			this.setValue(ids);

		}

	}

	delete(...ids) {

		let values = this.getValue();

		if (values === undefined) {

			console.error("deleting selection but values are undefined");

		}

		if (ids.length === 0) {

			const body = this.getChild("body");

			if (!body) {

				console.error("deleting selection but body is not set");

			}

			if (body) {

				ids = body.getSelectedIds();

			}

		}

		values = values.filter(id => !ids.includes(id));

		this.setValue(values);

	}


	getMax() {

		return this.resource.max || this.resource.single && 1 || 999999;

	}

	isSingle() {

		return this.getMax() === 1;

	}

	// *buildPopup() {

	// 	const popup = this.getChild("popup");
	// 	const hasPopup = popup && popup.hasFocusInside();

	// 	if (hasPopup) {

	// 		yield {
	// 			class: "popup",
	// 			child: {
	// 				class: "popup-content",
	// 				children: popup.build()
	// 			}
	// 		};

	// 	}

	// }

 //  *buildContent() {

	// 	yield* super.buildContent();

 //    yield* this.buildPopup();

	// }

	// *buildBody() {

	// 	const body = this.getBody();

	// 	if (body) {

	// 		yield* body.build(); // -> don't wrap with body-content in tables

	// 	}

	// }


}

KarmaFieldsAlpha.field.tagsList = class extends KarmaFieldsAlpha.field {

	newChild(index) {

		if (index === "add") {

			return new KarmaFieldsAlpha.field.button({
				title: "Add",
				text: "Add",
				action: "open",
				// hidden: [">=", ["getLength", ["getValue"]], ["request", "getMax"]],
			}, "add", this);

		} else if (index === "dialog") {

			if (this.resource.dialog) {

				return this.createChild(this.resource.dialog, "dialog");

			}

		}

	}

	// getValue(key) {

	// 	return this.parent.getValue(key, this.resource.id);

	// }


	getDialog() {

		return this.getChild("dialog");

	}

	open() {

		this.edit([]);

	}

	edit(ids) { // -> ids used in files attacher in tinymce

		const dialog = this.getChild("dialog");

		dialog.setFocus(true);

		if (!ids) {

			ids = this.getSelectedIds();

		}

		if (ids.length) {

			dialog.selectByIds(ids);

		}

	}

	close() {

		this.setFocus(true);

	}

	getIds() {

		return this.parent.getValue();

	}

	setIds(ids) {

		return this.parent.setValue(ids);

	}

	getSelectedIds() {

		const selection = this.getSelection();

		const ids = this.getIds() || [];

		return ids.slice(selection.index, selection.index + selection.length);

	}

	isSelected(id) {

		return this.getSelectedIds().includes(id);

	}

	swapAt(index, target, length) {

		const ids = this.getIds();
		const newIds = [...ids];

		newIds.splice(target, 0, ...newIds.splice(index, length));

		// if (!this.parent.parent)


		this.parent.setValue(newIds);

	}


	*buildChildren() {

		const mixed = this.isMixed();
		const hasFocus = this.hasFocus();

		if (mixed) {

			yield {
				tag: "li",
				update: element => {
					element.classList.toggle("selected", this.isSelectedAt(0));
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
								this.request("delete");
								this.render();
							}
						}
					}
				]
			};

		} else {

			const ids = this.parent.getValue();

			if (ids !== undefined) {

				const driver = this.getDriver();

				for (let i = 0; i < ids.length; i++) {

					const names = this.getValue("name", ids[i], driver);

					if (names) {

						const name = names[0] || "";

						if (name) {

							yield {
								tag: "li",
								update: element => {
									element.classList.toggle("selected", this.isSelectedAt(i) && hasFocus);
									element.ondblclick = event => {
										this.save("edit", "Edit Tag");
										this.request("edit", [ids[i]])
										this.render();
									}
								},
								children: [
									{
										tag: "span",
										update: element => {
											element.innerHTML = name;
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
												this.request("deleteAt", i, 1);
												this.render();
											}
										}
									}
								]
							};

						}

					}

				}

			}

		}

	}

	*buildContent() {

		yield {
			tag: "ul",
			update: element => {

				const ids = this.getIds();

				element.classList.toggle("hidden", !ids || ids.length === 0);

				const selection = this.getSelection();

				const sorter = new KarmaFieldsAlpha.ListSorterInline(element, selection);

				sorter.onSelect = elements => {
					elements.map(element => element.classList.add("selected"));
					this.setSelection(sorter.state.selection);
				}

				sorter.onUnselect = elements => {
					elements.map(element => element.classList.remove("selected"));
				}

				sorter.onSelectionComplete = () => {
					// this.request("deferFocus");
					if (!this.hasFocus()) {
						this.setFocus(true);
						this.render();
					}
				}

				sorter.onSwap = (newState, lastState) => {

					this.swapAt(lastState.selection.index, newState.selection.index, newState.selection.length);
					this.setSelection(newState.selection);

				};

				sorter.onSort = (newSelection, lastSelection) => {
					if (KarmaFieldsAlpha.DeepObject.differ(newSelection, lastSelection)) {
						this.save("reorder", "reorder tags");
						this.setFocus(true);
						this.render();
					}
				}

				element.ondblclick = event => {
					this.save("edit", "Edit Tag");
					this.parent.edit();
					this.render();
				}

				element.onclick = event => {
					if (!this.hasFocus()) {
						this.setFocus(true);
						this.render();
					}
				}
			},
			children: this.buildChildren()
		};

		yield {
			class: "controls",
			children: this.buildControls()
		};

		yield {
			class: "dialog-container",
			children: this.buildDialog()

		}

	}

	*buildDialog() {

		if (this.resource.dialog) {

			const dialog = this.getChild("dialog");
			const hasFocus = dialog.hasFocusInside();
			// const selection = this.getSelection() || {};

			if (hasFocus) {

				yield {
					class: "dialog",
					update: (element, implants) => {
						element.onmousedown = event => {
							event.stopPropagation();
							dialog.setFocus(true);
							dialog.render();
						}
					},
					children: dialog.build("dialog")
				};

			}

		}

	}

	*buildControls() {

		if (this.resource.controls !== false && !this.isMixed()) {

			const addButton = new KarmaFieldsAlpha.field.button({
				title: "Add",
				text: "Add",
				action: "open",
				save: "add-tag",
				hidden: [">=", ["getLength", ["get"]], ["request", "getMax"]]
			}, "add", this);

			yield* addButton.build();

		}

	}

	*build() {

		yield {
			class: "karma-tags karma-field",
			children: this.buildContent()
		};

	}


}
