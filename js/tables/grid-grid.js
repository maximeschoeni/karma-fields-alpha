

KarmaFieldsAlpha.field.grid = class extends KarmaFieldsAlpha.field.sortable {

	getRow(index) {

		return new KarmaFieldsAlpha.field.grid.row({
			children: this.resource.children,
			export: this.getExportableColumns(),
			index,
			globalIndex: index + (this.resource.globalIndex || 0),
			align: this.resource.align,
			...this.resource.row
		}, index, this);

	}

	newChild(index) {

		if (index < this.resource.length) {

			return this.getRow(index);

		}

		return super.newChild(index); // -> dialog

	}

	// sliceSelection() {

	// 	const selection = this.getSelection();

	// 	if (selection) {

	// 		return this.slice(selection.index, selection.length);

	// 	} else {

	// 		return [];

	// 	}

	// }

	// slice(index, length = this.resource.length) {

	// 	if (index === undefined) {

	// 		return this.sliceSelection();

	// 		// const selection = this.getSelection();

	// 		// if (selection) {

	// 		// 	index = selection.index;
	// 		// 	length = selection.length;

	// 		// } else {

	// 		// 	return [];

	// 		// }

	// 	}

	// 	const array = [];

	// 	for (let i = 0; i < length; i++) {

	// 		const rowField = this.getRow(index + i);

	// 		rowField.import(array[i]);

	// 		const collection = rowField.export();

	// 		array.push(collection);

	// 	}

	// 	if (array.some(collection => collection === undefined)) {

	// 		return;

	// 	}

	// 	return array;

	// }

	// insert(array, index, length = this.resource.length) {

	// 	if (index === undefined) {

	// 		const selection = this.getSelection();

	// 		if (selection) {

	// 			index = selection.index;
	// 			length = selection.length;

	// 		} else {

	// 			index = 0;

	// 		}

	// 	}

	// 	if (array.length < length) {

	// 		this.deleteAt(index + array.length, length - array.length);

	// 	} else if (array.length > length) {

	// 		this.parent.add(index, array.length - length);

	// 	}

	// 	for (let i = 0; i < array.length; i++) {

	// 		const rowField = this.getRow(index + i);

	// 		rowField.import(array[i]);

	// 	}

	// }

	// slice(index, length) {

	// 	if (index === undefined) {

	// 		const selection = this.getSelection();

	// 		if (selection) {

	// 			return super.slice(selection.index || 0, selection.length || 0);

	// 		}

	// 	} else {

	// 		return super.slice(index, length);

	// 	}

	// }

	// insert(array, index, length) {

	// 	if (index === undefined) {

	// 		const selection = this.getSelection();

	// 		if (selection) {

	// 			super.insert(array, selection.index || 0, selection.length || 0);

	// 		}

	// 	} else {

	// 		super.insert(array, index, length);

	// 	}

	// }

	doAction(action, ...args) {

		switch (action) {

			default:
				super.doAction(action, ...args)

		}

	}



	// getParam(key) {

	// 	return this.query({ action: "getParam", key });

	// }

	// setParam(value, key) {

	// 	return this.doAction({ action: "setParam", key, value });

	// }

	getExportableColumns() {

		// let exportFields = super.getExportableColumns();
		let exportFields = this.resource.columns || this.resource.children || [];

		if (this.resource.exportFields) {

			exportFields = [...exportFields, ...this.resource.exportFields];

		}

		if (this.resource.dialog && this.resource.dialog.export) {

			exportFields = [...exportFields, ...this.resource.dialog];

		}


		return exportFields;

		// const exportFields = this.resource.exportFields || [];

		// return [...exportFields, super.getExportableColumns()];

	}



	// export() {

	// 	const array = this.slice();

	// 	if (array === undefined) {

	// 		return;

	// 	}

	// 	const csv = new KarmaFieldsAlpha.field.CSV({ array });

	// 	return [csv.toString()];

	// }

	// import(collection) {

	// 	const string = collection.shift();

	// 	if (string) {

	// 		const csv = new KarmaFieldsAlpha.field.CSV({ string });

	// 		const array = csv.toArray(); // -> array of arrays

	// 		this.insert(array);

	// 	}

	// }

	// getSortableKey() {

	// 	return this.resource.sortable === true && "position" || this.resource.sortable;

	// }

	getColumns() {

		return this.resource.columns || this.resource.children || [];

	}

	hasHeader() {

		return this.getColumns().some(column => column.label);

	}

	// getHeader() {

	// 	return new KarmaFieldsAlpha.field.grid.headerCell({
	// 		...this.resource.header
	// 	}, "header", this);

	// }

	// *buildHeader(columns) {

	// 	yield {
	// 		tag: "tr",
	// 		class: "grid-row grid-row-header",
	// 		children: this.buildHeaderCells()
	// 		// children: this.getHeader()?.build() //this.buildHeaderCells()
	// 	};

	// }

	*buildHeaderCells() {

		const columns = this.getColumns();

		for (let i = 0; i < columns.length; i++) {

			const cellResource = columns[i] || {};
			const order = this.doAction("getParam", "order") || "asc";
			const orderby = this.doAction("getParam", "orderby");
			const activeColumn = orderby === (cellResource.orderby || cellResource.key);

			yield {
				tag: "th",
				class: "th table-header-cell",
				// init: element => {
				// 	if (cellResource.classes) {
				// 		element.classList.add(...cellResource.classes);
				// 	}
				// },
				update: element => {
					element.classList.toggle("sortable", Boolean(cellResource.sortable))
					if (cellResource.sortable) {
						element.onmousedown = event => {
							event.stopPropagation(); // -> prevent header selection
						}
						element.onclick = event => {
							event.preventDefault();
							// const order = this.getParam("order");
							// const orderby = this.getParam("orderby");
							// const activeColumn = orderby === (cellResource.orderby || cellResource.key);

							this.save("sort");
							if (activeColumn) {
								this.doAction("setParam", order === "asc" ? "desc" : "asc", "order");
							} else {
								this.doAction("setParam", cellResource.order || "asc", "order");
								this.doAction("setParam", cellResource.orderby || cellResource.key, "orderby");
							}
							this.render();
						};
					}
				},
				children: [
					{
						class: "header-cell-content title",
						init: element => {
							element.textContent = cellResource.label || "";
						}
					},
					{
						class: "header-cell-content order",
						update: element => {
							element.classList.toggle("hidden", !cellResource.sortable);
						},
						children: [
							{
								tag: "span",
								class: "dashicons dashicons-arrow-up",
								update: element => {
									element.classList.toggle("active", order === "asc" && activeColumn);
									element.classList.toggle("passive", activeColumn && order !== "asc" || !activeColumn && (this.resource.order || "asc") === "asc");
								}
							},
							{
								tag: "span",
								class: "dashicons dashicons-arrow-down",
								update: element => {
									element.classList.toggle("active", order === "desc" && activeColumn);
									element.classList.toggle("passive", activeColumn && order !== "desc" || !activeColumn && (this.resource.order || "asc") === "desc");
								}
							}
						]
					}
				]
			};

		}

	}


	*buildBodyRows() {

		const length = this.getLength();

		if (length !== undefined) {

			for (let i = 0; i < length; i++) {

				const row = this.getRow(i);

				yield {
					tag: "tr",
					class: "grid-row grid-body-row",
					update: element => {
						element.classList.toggle("selected", this.isSelected(i));
					},
					children: row.build()
				};

			}

		}


	}

	*buildGridSections() {

		if (this.hasHeader()) {

			yield {
				tag: "thead",
				class: "grid-section grid-header",
				// children: this.buildHeader()
				children: [
					{
						tag: "tr",
						class: "grid-row grid-row-header",
						children: this.buildHeaderCells()
					}
				]
			};

		}

		yield {
			tag: "tbody",
			class: "grid-section grid-body",
			children: this.buildBodyRows(),
			update: element => {
				this.registerTracker(element, "column");

				// const tracker = new KarmaFieldsAlpha.field.sortable.MouseTracker(element);

				// tracker.onInit = () => {
				// 	this.mouseDown(tracker);
				// }

				// tracker.onUpdate = () => {
				// 	this.mouseMove(tracker);
				// }

				// tracker.onComplete = () => {
				// 	this.mouseUp(tracker);
				// }

			}
		};

	}


	// *buildTarget() {

	// 	const columns = this.resource.columns || this.resource.children || [];

	// 	yield {
	// 		class: "table grid-main",
	// 		children: this.buildGridSections(),
	// 		init: element => {
	// 			if (this.resource.scroll || this.resource.scrollContainer) {
	// 				element.classList.add("scroll-container");
	// 			}
	// 		},
	// 		update: element => {
	// 			element.style.gridTemplateColumns = columns.map(resource => resource.width || "auto").join(" ");
	// 		}
	// 	};

	// }

	parseWidth(width) { // -> used by dialog

		if (width === "full" || width === "1fr") {

			return "1fr";

		}

		return super.parseWidth(width);

	}

	*buildContent() {

		const columns = this.resource.columns || this.resource.children || [];
		const children = columns.map((resource, index) => this.createChild(resource, index));

		yield {
			tag: "table", // -> inherit wordpress table styles
			class: "table grid-main wp-list-table widefat fixed striped table-view-list", // -> inherit wordpress table classes
			children: this.buildGridSections(),
			init: element => {
				if (this.resource.scroll || this.resource.scrollContainer) {
					element.classList.add("scroll-container");
				}
			},
			update: element => {
				// element.style.gridTemplateColumns = columns.map(resource => this.parseWidth(resource.width || "auto")).join(" ");
				if (children.every(child => child !== undefined)) {
					element.style.gridTemplateColumns = children.map(child => child.getWidth()).join(" ");
				}
			}
		};


	}

	// *build() {

	// 	if (this.resource.dialog) {

	// 		// const dialog = this.getDialog(this.resource.dialog);

	// 		yield* this.buildDialog();

	// 		// yield {
	// 		// 	class: "dialog-wrapper",
	// 		// 	children: [
	// 		// 		{
	// 		// 			class: "main-container",
	// 		// 			children: this.buildContent()
	// 		// 		},
	// 		// 		{
	// 		// 			class: "dialog-container",
	// 		// 			children: dialog.build()
	// 		// 		}
	// 		// 	],
	// 		// 	init: element => {
	// 		// 		element.classList.toggle("mode-aside", this.resource.dialog.mode === "aside" || false);
	// 		// 	}
	// 		// };

	// 	} else {

	// 		yield* this.buildContent();

	// 	}

	// }

	// *build() {

	// 	if (this.resource.dialog) {

	// 		yield {
	// 			class: "dialog-wrapper",
	// 			children: super.build(),
	// 			init: element => {
	// 				if (this.resource.dialog) {
	// 					element.classList.toggle("mode-aside", this.resource.dialog.mode === "aside" || false);
	// 				}
	// 			}
	// 		};

	// 	} else {

	// 		yield* this.buildContent();

	// 	}

		// yield {
		// 	class: "grid-wrapper",
		// 	children: this.buildContent(),
		// 	init: element => {
		// 		if (this.resource.dialog) {
		// 			element.classList.toggle("mode-aside", this.resource.dialog.mode === "aside" || false);
		// 		}
		// 	}
		// };

	// }

}



// KarmaFieldsAlpha.field.grid.headerCell = class extends KarmaFieldsAlpha.field {

// 	getParam(key) {

// 		// return this.query({ action: "getParam", key });

// 		return this.doAction("getParam", key);

// 	}

// 	setParam(value, key) {

// 		this.doAction("setParam", value, key);

// 	}

// 	*build() {

// 		const order = this.getParam("order") || this.resource.order || "asc";
// 		const orderby = this.getParam("orderby");
// 		const activeColumn = orderby === (this.resource.orderby || this.resource.key);

// 		yield {
// 			tag: "th",
// 			class: "th table-header-cell",
// 			init: element => {
// 				if (this.resource.classes) {
// 					element.classList.add(...this.resource.classes);
// 				}
// 			},
// 			update: element => {
// 				element.classList.toggle("sortable", Boolean(this.resource.sortable))
// 				if (this.resource.sortable) {
// 					element.onmousedown = event => {
// 						event.stopPropagation(); // -> prevent header selection
// 					}
// 					element.onclick = event => {
// 						event.preventDefault();
// 						const order = this.getParam("order");
// 						const orderby = this.getParam("orderby");
// 						const activeColumn = orderby === (this.resource.orderby || this.resource.key);

// 						this.save("sort");
// 						if (activeColumn) {
// 							this.setParam(order === "asc" ? "desc" : "asc", "order");
// 						} else {
// 							this.setParam(this.resource.order || "asc", "order");
// 							this.setParam(this.resource.orderby || this.resource.key, "orderby");
// 						}
// 						this.render();
// 					};
// 				}
// 			},
// 			children: [
// 				{
// 					class: "header-cell-content title",
// 					init: element => {
// 						element.textContent = this.resource.label;
// 					}
// 				},
// 				{
// 					class: "header-cell-content order",
// 					update: element => {
// 						element.classList.toggle("hidden", !this.resource.sortable);
// 					},
// 					children: [
// 						{
// 							tag: "span",
// 							class: "dashicons dashicons-arrow-up",
// 							update: element => {
// 								// const order = this.getValue("order");
// 								// const orderby = this.getValue("orderby");
// 								// const activeColumn = orderby === (this.resource.orderby || this.resource.key);
// 								element.classList.toggle("active", order === "asc" && activeColumn);
// 								element.classList.toggle("passive", activeColumn && order !== "asc" || !activeColumn && (this.resource.order || "asc") === "asc");
// 							}
// 						},
// 						{
// 							tag: "span",
// 							class: "dashicons dashicons-arrow-down",
// 							update: element => {
// 								// const order = this.getValue("order");
// 								// const orderby = this.getValue("orderby");
// 								// const activeColumn = orderby === (this.resource.orderby || this.resource.key);
// 								element.classList.toggle("active", order === "desc" && activeColumn);
// 								element.classList.toggle("passive", activeColumn && order !== "desc" || !activeColumn && (this.resource.order || "asc") === "desc");
// 							}
// 						}
// 					]
// 				}
// 			]
// 		};

// 	}

// }

KarmaFieldsAlpha.field.grid.row = class extends KarmaFieldsAlpha.field.group {

	getValue(key) {

		return this.parent.getValue(key, this.resource.index);

	}

	setValue(value, key) {

		this.parent.setValue(value, key, this.resource.index);

	}

	getIndex() {

		return this.resource.index;

	}

	isMixed() {

		return false;

	}

	// getWidth() {

	// 	return this.parseWidth(this.resource.width || "1fr");

	// }

	// getGlobalIndex() {

	// 	return this.resource.globalIndex;

	// }

	doAction(action, ...args) {

		switch (action) {

			case "delete":
			case "remove":
				this.parent.doAction("delete", this.index, 1);
				break;

			case "open":
				this.parent.doAction("open", this.index, 1);
				break;

			case "moveUp":
				this.moveUp();
				break;

			case "moveDown":
				this.moveDown();
				break;

			case "hasSelection":
			case "isSelected":
				return this.isSelected();

			case "select":
				this.parent.doAction("select", this.resource.index, 1);
				break;

			default:
				return super.doAction(action, ...args)

		}

	}

	moveUp() {
		if (this.index > 0) {
			this.parent.swapAt(this.index, this.index - 1, 1);
		}
	}

	moveDown() {
		if (index + 1 < this.parent.resource.length) {
			this.parent.swapAt(this.index, this.index + 1, 1);
		}
	}


	isSelected() {

		return this.parent.isSelected(this.resource.index);

	}

	createChild(resource, index) {

		if (resource.model === "index" || resource.model === "rowIndex" || resource.type === "index" || resource.type === "rowIndex") {

			const tableOffset = this.doAction("getOffset") || 0;
			const value = tableOffset + this.resource.index + 1;

			return new KarmaFieldsAlpha.field.simpletext({
				value
			}, index, this);

			// return new KarmaFieldsAlpha.field.grid.row.index(resource, index, this);

		} else if (resource.model === "title" || resource.type === "title") {

			return new KarmaFieldsAlpha.field.grid.row.title({
				key: "name",
				children: [
					{ model: "link", action: "edit", text: "Edit" },
					{ model: "link", action: "delete", text: "Trash" },
					{ model: "link", action: "duplicate", text: "Duplicate" }
					// { model: "edit" },
					// { model: "delete" },
					// { model: "button", action: "duplicate", text: "Duplicate" }
				],
				...resource
			}, index, this);

		} else if (resource.model === "selectbox" || resource.type === "selectbox") {

			return new KarmaFieldsAlpha.field.grid.row.selectbox({
				...resource
			}, index, this);

		} else if (resource.model === "drag" || resource.type === "drag") {

			return new KarmaFieldsAlpha.field.grid.row.drag({
				...resource
			}, index, this);

		} else {

			return super.createChild(resource, index);

		}

	}

	export() { // -> return collection (array of strings)

		let collection = super.export();

		if (this.resource.export) {

			for (let i = 0; i < this.resource.export.length; i++) {

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

		super.import(collection);

		if (this.resource.export) {

			for (let i = 0; i < this.resource.export.length; i++) {

				const child = this.getChild(i);

				if (child) {

					child.import(collection);

				}

			}

		}

	}

	*build() {

		for (let j = 0; j < this.resource.children.length; j++) {

			const field = this.createChild(this.resource.children[j], j);

			yield {
				tag: "td",
				class: "td grid-cell table-cell",
				init: element => {
					if (field.resource.style) {
						element.style = field.resource.style;
					}
					if (field.resource.classes) {
						element.classList.add(...field.resource.classes);
					}
					if (field.resource.align) {
						element.style.alignItems = field.resource.align;
					}
				},
				update: element => {
					element.ondblclick = event => {
						this.save("open");
						this.doAction("open");
						this.render();
					}
				},
				children: field.build()
			};

		}

	}

}

KarmaFieldsAlpha.field.grid.row.title = class extends KarmaFieldsAlpha.field {

	getWidth() {

		return "1fr";

	}

	getSingleValue(key) {

		const value = this.parent.getValue(key);

		if (value !== undefined) {

			return value[0] || "";

		}

	}

	getTitle() {

		return this.resource.title || this.resource.value || this.getSingleValue(this.resource.key || "name") || "";

	}

	newChild(index) {

		const children = this.resource.children || [];

		if (!children[index]) {

			console.error("Index is out of bound");

		}

		return this.createChild(children[index], index);

	}

	*buildActions() {

		const children = this.resource.children || [];

		for (let i = 0; i < children.length; i++) {

			yield {
				tag: "span",
				children: this.getChild(i)?.build()
			};

		}

	}

	*build() {
		yield {
			children: [
				{
					tag: "strong", // -> wordpress legacy
					children: [
						{
							tag: "a",
							class: "row-title",
							update: element => {
								element.innerHTML = this.getTitle();
								element.onclick = event => {
									this.doAction("select");
									this.doAction("open");
									this.render();
								}
							}
						}
					]
				},
				{
					class: "row-actions",
					children: this.buildActions()
				}
			]
		}
	}
};

KarmaFieldsAlpha.field.grid.row.selectbox = class extends KarmaFieldsAlpha.field {

	isSelected() {

		return this.doAction("isSelected");

	}

	*build() {

		yield {
			tag: "input",
			class: "selectbox",
			init: element => {
				element.type = "checkbox";
				// element.style.pointerEvents = "none";
				// element.onmousedown = event => {
				// 	event.stopPropagation();
				// }
				// element.onmouseup = event => {
				// 	event.stopPropagation();
				// 	event.preventDefault();
				// }
				// element.onchange = event => {
				// 	event.preventDefault();
				// }
			},
			update: element => {
				element.checked = this.isSelected() || false;
			}
		}
	}

}

KarmaFieldsAlpha.field.grid.row.drag = class extends KarmaFieldsAlpha.field {

	isSelected() {

		return this.parent.doAction("isSelected");

	}

	select() {

		this.parent.doAction("select");

	}

	*build() {

		yield {
			tag: "span",
			class: "dashicons dashicons-move drag-btn",
			update: element => {
				element.onmousedown = event => {
					if (!this.isSelected()) {
						this.select();
						this.render();
					}
				}
				// element.className = "dashicons dashicons-move";
				// element.style.cursor = "grab";
			}
		};

	}

}
