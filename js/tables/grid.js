

KarmaFieldsAlpha.field.grid = class extends KarmaFieldsAlpha.field {

	getIds() {

		return this.parent.getValue("ids");

	}

	setIds(ids) {

		return this.parent.setValue(ids, "ids");

	}

	getLength() {

		const ids = this.getIds();

		if (ids !== undefined) {

			return ids.length;

		}

	}

	*listKeys() {

		if (this.resource.children) {

			for (let i = 0; i < this.resource.children.length; i++) {

				const resource = this.resource.children[i];
				const child = this.createChild(resource, i);

				yield* child.listKeys();

			}

		}

		if (this.resource.dialog) {

			const child = this.createChild(this.resource.dialog.content, 0);

			yield* child.listKeys();

		}

	}

	// getIds() {

	// 	return super.getValue();

	// }

  // getIndex() {
  //
  //   return new KarmaFieldsAlpha.Content(this.resource.index || 0);
  //
  // }

	// *genChildren() {

	// 	for (let i = 0; i < this.getLength().toNumber(); i++) {

	// 		yield this.createChild({
	// 			type: "row",
	// 			children: this.resource.children,
	// 			index: (this.resource.index || 0) + i
	// 		}, i);

	// 	}

	// }

	newChild(index) {

		if (index === "modal" || index === "*") {

			if (this.resource.modal) {

				if (typeof this.resource.modal === "string") { // compat

					this.resource.modal = { type: this.resource.modal };

				}

				const modal = this.createChild({
					type: "container",
					// header: {
					// 	type: "group",
					// 	children: [
					// 		{ type: "title" },
					// 		{ type: "close" }
					// 	]
					// },
					...this.resource.modal
				}, "modal");

				return modal;

				// return new KarmaFieldsAlpha.field.grid.modal(this.resource.modal, "modal", this);

			}

		} else if (index === "dialog") {

			if (this.resource.dialog && this.hasSelection()) {

				// -> compat
				if (typeof this.resource.dialog === "string") {
					this.resource.dialog = { type: this.resource.dialog };
				}

				// return new KarmaFieldsAlpha.field.grid.dialog({
				// 	content: {
				// 		header: {
				// 			children: [
				// 				{type: "title"},
				// 				{type: "close"}
				// 			]
				// 		},
				// 		...(this.resource.dialog.content || this.resource.dialog) // compat
				// 	}
				// }, "dialog", this);

				return new KarmaFieldsAlpha.field.dialog(this.resource.dialog, "dialog", this);

			}

		} else if (index === "gridDialog") {

			return new KarmaFieldsAlpha.field.gridDialog({
				content: this.resource.dialog
			}, "gridDialog", this);

		} else {

			const ids = this.getIds();

			if (index >= ids.length) {

				console.error("getting row but index is out of bounds");

			}

			const id = ids[index];

			const child = new KarmaFieldsAlpha.field.grid.row({
				children: this.resource.children || this.resource.columns,
				index,
				id,
				align: this.resource.align
			}, index, this);



			return child;

		}

	}

	getRow(index, id) {

		return this.getChild(index);

	}

	isMixed(key, ids) {

		if (!ids) {

			ids = this.getSelectedIds();

		}

		if (!ids) {

			return;

		}

		if (ids.length > 1) {

			let index = 0;
			const firstValue = this.parent.getValue(key, ids[index++]);

			if (firstValue === undefined) {

				return;

			}

			while (index < ids.length) {

				const value = this.parent.getValue(key, ids[index++]);

				if (value === undefined) {

					return;

				}

				if (!KarmaFieldsAlpha.DeepObject.equal(value, firstValue)) {

					return true;

				}

			}

		}

		return false;

	}

	getSelectedValues(key) {

		const ids = this.getSelectedIds();
		const values = [];

		if (ids) {

			for (let id of ids) {

				const value = this.getValue(key, id);

				if (value !== undefined) {

					values.push(value[0] || "");

				}

			}

		}

		return values;

	}

	doAction(action, ...args) {

		switch (action) {

			case "deleteAt":
			case "removeAt":
				this.deleteAt(...args);
				break;

			case "delete":
			case "deleteSelected":
			case "remove":
				this.deleteSelected();
				break;

			case "openAt":
				this.openAt(...args);
				break;

			case "open":
				this.openSelected();
				break;

			default:
				super.doAction(action, index, ...args)

		}

	}


	getValue(key, id) {

		if (id === undefined) {

			return this.getSelectedValue(key);

			// const ids = this.getSelectedIds();

			// if (ids === undefined) {

			// 	return;

			// }

			// if (ids.length) {

			// 	return super.getValue(key, ids[0]);

			// } else {

			// 	console.warn("getting value but nothing is selected");

			// }

		}

		// const driver = this.getDriver();

		return super.getValue(key, id);

	}

	setValue(value, key, id) {

		if (id === undefined) {

			this.setSelectedValue(value, key);

			// const ids = this.getSelectedIds();

			// if (!ids || !ids.length) {

			// 	console.error("setting value but nothing is selected");

			// }

			// for (let id of ids) {

			// 	super.setValue(value, key, id);

			// }

		} else {

			super.setValue(value, key, id);

		}

	}

	getValueAt(key, index) {

		const ids = this.getIds();

		if (ids === undefined) {

			return;

		}

		if (ids[index] === undefined) {

			console.error("Getting value at but index is out of bounds");

		}

		return this.parent.getValueById(key, ids[index]);

	}

	setValueAt(values, key, index) {

		const ids = this.getIds();

		if (ids === undefined) {

			return;

		}

		if (ids[index] === undefined) {

			console.error("Setting value at but index is out of bounds");

		}

		this.parent.setValueById(values, key, ids[index]);

	}

	// getValueAt(key, index) {

	// 	if (this.parent) {

	// 		return this.parent.getValueAt(key, index);

	// 	}

	// 	return [];



	// 	// const ids = this.getIds();

	// 	// if (ids) {

	// 	// 	const id = ids[index];

	// 	// 	if (id !== undefined) {

	// 	// 		return this.getValue(value, key, id);

	// 	// 	}

	// 	// }

	// }

	// setValueAt(value, key, index) {

	// 	if (this.parent) {

	// 		this.parent.setValueAt(value, key, index);

	// 	}


	// 	// const ids = this.getIds();

	// 	// if (ids) {

	// 	// 	const id = ids[index];

	// 	// 	if (id !== undefined) {

	// 	// 		this.setValue(value, key, id);

	// 	// 	}

	// 	// }



	// }

	getSelectedValue(key) {

		const ids = this.getSelectedIds();

		if (ids === undefined) {

			return;

		}

		if (ids.length) {

			const values = ids.map(id => this.parent.getValueById(key, id)); // -> need to fetch all values (set loading tasks)

			if (values.some(value => !value)) {

				return;

			}

			let index = 1;

			while (index < values.length) {

				if (!KarmaFieldsAlpha.DeepObject.equal(values[0], values[index])) {

					return [];

				}

				index++;
			}

			return values[0];

		} else {

			console.warn("getting value but nothing is selected");

		}

	}

	setSelectedValue(value, key) {

		const ids = this.getSelectedIds();

		if (!ids || !ids.length) {

			console.error("setting value but nothing is selected");

		}

		for (let id of ids) {

			this.parent.setValueById(value, key, id);

		}

	}



	// getValueAt(key, index) {

	// 	let id = this.getIds()[index];

	// 	return this.getValue(key, id);

	// }

	// setValueAt(value, key, index) {

	// 	let id = this.getIds()[index];

	// 	this.setValue(value, key, id);

	// }

	// getSelectedValue(key) {

	// 	let ids = this.getSelectedIds();

	// 	if (ids.length > 1) {

	// 		return this.getValues(key, ...ids);

	// 	} else if (ids.length === 1) {

	// 		return this.getValue(key, ids[0]);

	// 	} else {

	// 		return [];

	// 	}

	// }

	// setSelectedValue(value, key) {

	// 	let ids = this.getSelectedIds();

	// 	for (let i = 0; i < ids.length; i++) {

	// 		this.setValue(value, key, ids[i]);

	// 	}

	// }


	hasSelection() {

		const selection = this.getSelection();

		return selection && selection.length > 0 || false;

	}

	hasSelectionInside() {

		const selection = this.getSelection();

		if (selection) {

			return this.hasFocus() && selection.length > 0;

		}

		return false;

	}

	isSelected(id) {

		const ids = this.getSelectedIds();

		if (ids) {

			return ids.includes(id);

		}

		return false;

	}

	isSelectedAt(index) {

		const selection = this.getSelection();

		if (selection) {

			return index >= selection.index && index < selection.index + selection.length;

		}

		return false;

	}

	getSelectedIds() {

		const selection = this.getSelection();
		const ids = this.getIds();

		if (ids && selection ) {

			const { index = 0, length = 0 } = selection;

			return ids.slice(index, index + length);

		}







		// return this.getIdsAt(index, length);

	}

	// DEPRECATED
	selectAt(index, length = 1) { // -> used by gallery to set right selection in case of exit item

		this.setSelection({ index, length });
		this.setFocus(true);

	}

	selectByIds(ids) {

		KarmaFieldsAlpha.server.promise(done => {

			const currentIds = this.getIds();

			if (currentIds !== undefined) {

				const index = currentIds.indexOf(ids[0]);

				if (index > -1) {

					this.setSelection({ index, length: ids.length }); // -> lets hope ids are consecutives
					this.setFocus(true);

				} else {

					this.removeSelection();

				}

				done();
			}

		}, "selectByIds");

	}

	selectAll() {

		const length = this.getLength();

		if (length !== undefined) {

			this.setSelection({
				index: 0,
				length: length
			});

		}

	}

	// used by tracker (new tracker for blocks)
	unselectBlocks() {

		this.unselect();

	}

	getIdsAt(index, length = 1) {

		const ids = this.getIds();

		if (ids) {

			return ids.slice(index, index + length);

		}

	}

	// getIds() {

	// 	let ids = this.getState("ids");

	// 	if (!ids) {

	// 		ids = super.getIds();

	// 	}

	// 	return ids;
	// }

	// setIds(ids) {

	// 	this.setState(ids, "ids");

	// }



	// addIds(...tokens) { // -> to be called by parent

	// 	let ids = this.getIds();

	// 	const index = this.getDefaultIndex();

	// 	ids = [...ids];
	// 	ids.splice(index, 0, ...tokens);

	// 	this.setIds(ids);

	// }

	deleteAt(index, length = 1) { // -> called from children

		if (index === undefined) {

			console.error("Openning at index but index is not set");

		}

		let ids = this.getIdsAt(index, length);

		this.parent.doAction("deleteIds", ids);

		// this.removeIds(ids);

	}

	delete() { // -> delete from pressing delete key

		// const ids = this.getSelectedIds();

		// if (ids) {

		// 	this.removeIds(ids);

		// }

		this.deleteSelection();

	}

	deleteSelection() {

		const ids = this.getSelectedIds();

		if (ids) {

			// this.removeIds(ids);
			this.parent.doAction("removeIds", ids);

		}

	}

	// deleteIds(ids) { // -> to be called by parent


	// 	// -> just gallery
	// 	// ids = ids.filter(id => id !== this.constructor.exit);

	// 	let currentIds = this.getIds();
	// 	let remainingIds = currentIds.filter(id => !ids.include(id));

	// 	this.setIds(remainingIds);

	// }


	copy() {

		const grid = this.exportSelection();

		if (grid === undefined) {

			return "[loading]";

		} else {

			return KarmaFieldsAlpha.CSV.stringify(grid);

		}

	}

	// async paste(value) {

	//   const grid = new KarmaFieldsAlpha.Content.Grid(value);

	//   await this.save("paste", "Paste");

	//   const selection = this.getSelection();

	//   const index = selection.index || 0;
	//   const length = selection.length || 0;

	//   // if (length === 0) {
	//   //
	//   //   let lengthContent = await this.getLength();
	//   //
	//   //   while (lengthContent.loading) {
	//   //
	//   //     await this.render();
	//   //     lengthContent = await this.getLength();
	//   //
	//   //   }
	//   //
	//   //   index = lengthContent.value;
	//   //
	//   // }

	//   if (length === 0) {

	//     let length = this.getLength();

	//   }

	//   // this.import(grid, index, length);

	//   await this.import(grid, index, length);

	//   // const body = this.getChild("body");

	//   await this.setSelection({index, length: grid.toArray().length});

	// }

	paste(string) {

		const grid = KarmaFieldsAlpha.CSV.parse(string);

		this.import(grid);

	}

	// add(length = 1, itemParams = {}, data = undefined) {

	// 	const index = this.getNewItemIndex();

	// 	this.addAt(index || 0, length, itemParams, data);

	// }

	// addAt(index, length = 1, itemParams = {}, data = undefined) {

	// 	index = this.mapIndex(index);

	// 	this.parent.addAt(index || 0, length, itemParams, data);

	// }

	// delete() {

	// 	const selection = this.getSelection();

	// 	if (selection.length) {

	// 		this.parent.deleteAt(selection.index, selection.length);

	// 		this.setSelection({});

	// 	}

	// }

	// deleteAt(index, length) {

	// 	index = this.mapIndex(index);

	// 	this.parent.deleteAt(index, length);

	// }

	getDefaultIndex() {

		const selection = this.getSelection();

		if (!selection) {

			return 0;

		} else if (selection.length) {

			return selection.index + selection.length;

		} else if (this.resource.defaultIndex !== undefined) {

			return this.resource.defaultIndex;

		} else {

			return this.getLength();

		}

	}

	getNewItemIndex() {

		return this.getDefaultIndex();

		// const selection = this.getSelection();

		// if (selection.length) {

		// 	return selection.index + selection.length;

		// } else if (this.resource.defaultIndex !== undefined) {

		// 	return this.resource.defaultIndex;

		// } else {

		// 	return [...this.getIndex()].length;

		// }

	}

  // *add(num = 1, index = undefined) {
  //
  //   yield* this.parent.add(num, index);
  //
  // }

  // async *create(index, length = 1) {

  //   console.error("deprecated");

  //   for (let i = 0; i < length; i++) {

  //     const field = this.createChild({
  //       type: "row",
  //       children: this.resource.children,
  //     }, index + i);

  //     yield* field.create();

  //     if (this.resource.modal) {

  //       const field = this.createChild({
  //         type: "row",
  //         children: this.resource.modal.children,
  //       }, index + i);

  //       yield* field.create();

  //     }

  //   }

  // }

	exportDefaults() {

		let defaults = {};

		for (let index of [0, "*"]) {

			const child = this.getChild(index);

			if (child) {

				const childDefaults = child.exportDefaults();

				if (childDefaults === undefined) {

					return;

				}

				defaults = { ...defaults, ...childDefaults };

			}

		}

		return defaults;

	}

	duplicate() {

		const selection = this.getSelection();

		if (selection) {

			const { index = 0, length = 0 } = selection;

			return this.duplicateAt(index, length);

		}

	}

	duplicateAt(index, length) {

		// if (KarmaFieldsAlpha.server.hasPromise()) {

		// 	console.error("duplicating things but there is still a pending promise");
		// 	return;

		// }

		KarmaFieldsAlpha.Store.addPromise(done => {

			const grid = this.exportAt(index, length);

			if (grid !== undefined) {

				this.importAt(grid, index + length, length);

				this.setSelection({ index: index + length, length });

				done();

			}

		}, "duplicate");

	}

	// swap(index, target, length) {

	// 	const sortableKey = this.resource.sortable;

	// 	// compat
	// 	if (this.resource.sortable === true) {

	// 		sortableKey = "position";

	// 	}

	// 	if (!sortableKey) {

	// 		console.error("not sortable!");
	// 		return;

	// 	}

	// 	// const driver = this.getDriver();
	// 	// const params = this.getParams();
	// 	// const paramstring = this.getParamstring() || "";

	// 	// this.save("sort", "Sort");

	// 	// KarmaFieldsAlpha.server.swap(this.uid, driver, paramstring, index, length, target, sortableKey);

	// 	this.setFocus(true);
	// 	this.setSelection({index: target, length});

	// 	index = this.mapIndex(index);
	// 	target = this.mapIndex(target);

	// 	this.parent.swap(index, length, target, sortableKey);



	// }




	swapAt(index, target, length) {



		const ids = this.getIds();

		if (ids === undefined) {

			console.error("swaping items but ids is undefined");

		}

		const newIds = [...ids];

		newIds.splice(target, 0, ...newIds.splice(index, length));

		// this.parent.setOrder(newIds);

		// this.parent.doAction("setOrder", newIds);



		this.setIds(newIds);

	}

	getExportableColumns() {

		if (this.resource.export && Array.isArray(this.resource.export)) {

			return this.resource.export.map(resource => ({type: "text", ...resource, export: true}));

		}

		let fields = this.resource.children;



		// else if (this.resource.modal) {

		//   const modalContent = this.getChild("modal");

		//   // return [...this.resource.children, ...this.resource.modal.children];
		//   return [...this.resource.children, ...modalContent.resource.children];

		// } else

		if (this.resource.dialog) {

		  // const dialog = this.getChild("dialog");

		  // const dialogResource = this.resource.dialog.body && this.resource.dialog.body.children || [];

		  // return [...this.resource.children, ...this.resource.modal.children];
		  fields = [...fields, this.resource.dialog];

		}

		if (this.resource.exportFields) {

			fields = [this.resource.exportFields, ...fields];

		}

		return fields;

	}

	exportSelection(columns = this.getExportableColumns()) {

		const selection = this.getSelection();

		if (selection) {

			const index = selection.index || 0;
			const length = selection.length || 0;

			return this.exportAt(index, length, columns);

		}

	}

	export(columns = this.getExportableColumns()) {

		const length = this.getLength();

		if (length !== undefined) {

			return this.exportAt(0, length, columns);

		}

	}

	exportAt(index, length, columns = this.getExportableColumns()) {

		const grid = [];

		const ids = this.getIds();

		if (ids === undefined) {

			return;

		}

		for (let i = 0; i < length; i++) {

			const id = ids[index + i];



			const rowField = new KarmaFieldsAlpha.field.grid.row({
				children: columns,
				index: index + i,
				id
			}, index + i , this);
			// const rowField = this.getRow(index + i, id);

			const collection = rowField.export();

			grid.push(collection);

		}

		if (grid.some(collection => !collection)) {

			return;

		}

		return grid;

	}

	import(grid, columns) {

		const selection = this.getSelection();

		if (selection) {

			const { index = 0, length = 0 } = selection;

			this.importAt(grid, index, length, columns);

			this.setSelection({ index, length: grid.length });

		}



	}

	importAt(array, index, length, columns) {

		if (array.length < length) {

			this.deleteAt(index + array.length, length - array.length);

		} else if (array.length > length) {

			// this.addAt(array.length - length, index + length);
			this.parent.add(array.length - length);

		}

		const ids = this.getIds();

		if (ids) {

			for (let i = 0; i < array.length; i++) {

				// const child = this.getChild(ids[index + i]);
				const child = this.getChild(index + i);

				child.import(array[i]);

			}

		}

	}

	getSortableKey() {

		return this.resource.sortable === true && "position" || this.resource.sortable;

	}

	getColumns() {

		return this.resource.children || [];

	}

	hasHeader() {

		return this.getColumns().some(column => column.label);

	}

	getModal() {

		if (this.resource.modal) {

			return this.getChild("modal");

		}

	}

	getDialog() {

		return this.getChild("dialog");

	}

	open() {

		const dialog = this.getChild("gridDialog");

		if (dialog) {

			dialog.setFocus();

		}

	}

	openAt(index) {

		if (index === undefined) {

			console.error("Openning at index but index is not set");

		}

		this.setSelection({
			index,
			length: 1
		});

		this.open();

	}

	close() {

		this.setFocus();

	}

	hasPrev() {

		const selection = this.getSelection();

		return selection && selection.index > 0;

	}

	hasNext() {

		const selection = this.getSelection();
		const length = this.getLength() || 0;

		return selection && selection.index + 1 < length;

	}

	prev() {

		const selection = this.getSelection();

		if (selection) {

			if (selection.index > 0) {

				this.setSelection({ index: selection.index - 1, length: selection.length });

			}

		}

	}

	next() {

		const selection = this.getSelection();

		if (selection) {

			const length = this.getLength() || 0;

			if (selection.index + 1 < length) {

				this.setSelection({ index: selection.index + 1, length: selection.length });

			}

		}

	}

	*buildHeader(columns) {

		yield {
			class: "grid-row grid-row-header",
			children: this.buildHeaderCells()
		};

	}

	*buildHeaderCells() {

		const columns = this.getColumns();

		for (let i = 0; i < columns.length; i++) {

			// const headerCell = new KarmaFieldsAlpha.field.grid.headerCell(columns[i], `header-cell-${i}`, this);

			const cellResource = columns[i] || {};

			const order = this.getParam("order") || cellResource.order || "asc";
			const orderby = this.getParam("orderby");


			const activeColumn = orderby === (cellResource.orderby || cellResource.key);

			yield {
				class: "th table-header-cell",
				init: element => {
					if (cellResource.classes) {
						element.classList.add(...cellResource.classes);
					}
				},
				update: element => {
					element.classList.toggle("sortable", Boolean(cellResource.sortable))
					if (cellResource.sortable) {
						element.onmousedown = event => {
							event.stopPropagation(); // -> prevent header selection
						}
						element.onclick = event => {
							event.preventDefault();
							const order = this.getParam("order");
							const orderby = this.getParam("orderby");
							const activeColumn = orderby === (cellResource.orderby || cellResource.key);

							this.save("sort");
							if (activeColumn) {
								this.setParam(order === "asc" ? "desc" : "asc", "order");
							} else {
								this.setParam(cellResource.order || "asc", "order");
								this.setParam(cellResource.orderby || cellResource.key, "orderby");
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

	// *buildHeaderCell() {

	// 	const order = this.getParam("order") || this.resource.order || "asc";
	// 	const orderby = this.getParam("orderby");


	// 	const activeColumn = orderby === (this.resource.orderby || this.resource.key);

	// 	yield {
	// 		class: "th table-header-cell",
	// 		init: element => {
	// 			if (this.resource.classes) {
	// 				element.classList.add(...this.resource.classes);
	// 			}
	// 		},
	// 		update: element => {
	// 			element.classList.toggle("sortable", Boolean(this.resource.sortable))
	// 			if (this.resource.sortable) {
	// 				element.onmousedown = event => {
	// 					event.stopPropagation(); // -> prevent header selection
	// 				}
	// 				element.onclick = event => {
	// 					event.preventDefault();
	// 					const order = this.getParam("order");
	// 					const orderby = this.getParam("orderby");
	// 					const activeColumn = orderby === (this.resource.orderby || this.resource.key);

	// 					this.save("sort");
	// 					if (activeColumn) {
	// 						this.setParam(order === "asc" ? "desc" : "asc", "order");
	// 					} else {
	// 						this.setParam(this.resource.order || "asc", "order");
	// 						this.setParam(this.resource.orderby || this.resource.key, "orderby");
	// 					}
	// 					this.render();
	// 				};
	// 			}
	// 		},
	// 		children: [
	// 			{
	// 				class: "header-cell-content title",
	// 				init: element => {
	// 					element.textContent = this.resource.label;
	// 				}
	// 			},
	// 			{
	// 				class: "header-cell-content order",
	// 				update: element => {
	// 					element.classList.toggle("hidden", !this.resource.sortable);
	// 				},
	// 				children: [
	// 					{
	// 						tag: "span",
	// 						class: "dashicons dashicons-arrow-up",
	// 						update: element => {
	// 							// const order = this.getValue("order");
	// 							// const orderby = this.getValue("orderby");
	// 							// const activeColumn = orderby === (this.resource.orderby || this.resource.key);
	// 							element.classList.toggle("active", order === "asc" && activeColumn);
	// 							element.classList.toggle("passive", activeColumn && order !== "asc" || !activeColumn && (this.resource.order || "asc") === "asc");
	// 						}
	// 					},
	// 					{
	// 						tag: "span",
	// 						class: "dashicons dashicons-arrow-down",
	// 						update: element => {
	// 							// const order = this.getValue("order");
	// 							// const orderby = this.getValue("orderby");
	// 							// const activeColumn = orderby === (this.resource.orderby || this.resource.key);
	// 							element.classList.toggle("active", order === "desc" && activeColumn);
	// 							element.classList.toggle("passive", activeColumn && order !== "desc" || !activeColumn && (this.resource.order || "asc") === "desc");
	// 						}
	// 					}
	// 				]
	// 			}
	// 		]
	// 	};

	// }

	*buildBody() {

		const ids = this.getIds();

		if (ids) {

			for (let i = 0; i < ids.length; i++) {

				if (this.resource.sortable) {

					const sortableKey = this.getSortableKey();

					this.getValueAt(sortableKey, i); // -> preset positions

				}

				// const row = this.getChild(i);
				const row = this.getRow(i, ids[i]);

				yield {
					class: "grid-row grid-body-row",
					update: element => {
						element.classList.toggle("selected", this.isSelectedAt(i));
					},
					children: row?.build()
				};

			}

		}


	}

	// *buildRows() {

	// 	let ids = this.getIds();

	// 	if (ids !== undefined) {

	// 		const columns = this.getColumns();


	// 		if (this.hasHeader() && ids.length) {



	// 			// yield {
	// 			// 	class: "grid-row grid-row-header",
	// 			// 	children: this.buildHeaderCells(columns)
	// 			// };

	// 			yield {
	// 				class: "grid-section grid-header",
	// 				children: this.buildHeader(columns)
	// 			};

	// 			// for (let i = 0; i < columns.length; i++) {



	// 			// 	const classes = [];

	// 			// 	if (i === 0) {
	// 			// 		classes.push("first-cell");
	// 			// 	}
	// 			// 	if (i === columns.length - 1) {
	// 			// 		classes.push("last-cell");
	// 			// 	}

	// 			// 	const headerCell = new KarmaFieldsAlpha.field.grid.headerCell({
	// 			// 		...columns[i],
	// 			// 		classes,
	// 			// 	}, `header-cell-${i}`, this);

	// 			// 	yield* headerCell.build();

	// 			// }

	// 		}

	// 		// const columns = this.getColumns();

	// 		for (let i = 0; i < ids.length; i++) {

	// 			if (this.resource.sortable) {

	// 				const sortableKey = this.getSortableKey();

	// 				this.getValue(sortableKey, ids[i]); // -> preset positions

	// 			}

	// 			// const row = this.getChild(i);
	// 			const row = this.getRow(i, ids[i]);

	// 			yield {
	// 				class: "grid-row",
	// 				update: element => {
	// 					element.classList.toggle("selected", this.isSelectedAt(i));
	// 				},
	// 				children: row.build()
	// 			};

	// 		}

	// 	}

	// }

	*buildGridSections() {

		// let ids = this.getIds();

		// if (ids && ids.length) {

			if (this.hasHeader()) {

				yield {
					class: "grid-section grid-header",
					children: this.buildHeader()
				};

			}

			yield {
				class: "grid-section grid-body",
				children: this.buildBody(),
				update: element => {

					element.onmousedown = event => {
						KarmaFieldsAlpha.Tracker.trackMouse(element, event, this);
					}

					element.ontouchstart = event => {
						KarmaFieldsAlpha.Tracker.trackTouch(element, event);
					}

				}
			};

		// }

	}



	// *buildMain(context) { // overrided by gallery

	// 	if (context === "dialog") {

	// 		yield {
	// 			class: "scroll-container",
	// 			children: this.buildMain()
	// 		};

	// 	} else {

	// 		yield {
	// 			class: "table",
	// 				// children: this.buildRows(),
	// 				children: this.buildGridSections(),
	// 				init: element => {
	// 					if (this.resource.scrollContainer) {
	// 						element.classList.add("scroll-container");
	// 					}
	// 				},
	// 				update: element => {

	// 					this.element = element; // -> for local render

	// 					const columns = this.getColumns();
	// 					element.style.gridTemplateColumns = columns.map(resource => resource.width || "auto").join(" ");


	// 					// const row = this.getChild(0);
	// 					// element.style.gridTemplateColumns = row.resource.children.map((resource, index) => resource.width || "auto").join(" ");

	// 					// const ids = this.getIds();

	// 					// const selection = this.getSelection();

	// 					// if (ids !== undefined && selection !== undefined) {

	// 					// 	// element.classList.toggle("loading", false); // !!!!
	// 					// 	element.classList.toggle("active", Boolean(this.hasFocus()));
	// 					// 	element.classList.toggle("even", ids.length % 2 === 0);
	// 					// 	element.classList.toggle("filled", ids.length > 0); // -> draw table borders

	// 					// }

	// 				}

	// 		};

	// 	}


	// }

	// *buildModalContent() {

	// 	const modal = this.getModal();

	// 	if (modal && this.hasSelection() && this.hasFocusInside()) {

	// 		yield* modal.build();

	// 	}

	// }

	*buildModal() {

		const modal = this.getChild("modal");

		if (modal && this.hasSelection() && this.hasFocusInside()) {

			yield {
				class: "content-frame",
				init: element => {
					if (this.resource.scrollContainer) {
						element.classList.add("scroll-container");
					}
				},
				update: element => {
					element.classList.toggle("display-fixed", modal.resource.display === "fixed");
					element.style.width = modal.resource.width || "30em";
				},
				children: modal.build()
			};

		}

	}

	// *buildDialog() {

	// 	// const dialog = this.getChild("dialog");

	// 	// if (dialog) {

	// 	// 	yield* dialog.build();

	// 	// }

	// 	const dialog = this.getChild("gridDialog");

	// 	if (dialog) {

	// 		yield* dialog.build();

	// 	}


	// }



	// *buildDialog() {

	// 	const { length = 0 } = this.getSelection();

	// 	if (this.resource.dialog && length) {

	// 		const dialog = this.getChild("dialog");
	// 		// const hasFocus = dialog.hasFocusInside();
	// 		// const selection = this.getSelection() || {};

	// 		// if (hasFocus && selection.length) {

	// 			// yield {
	// 			// 	class: "dialog",
	// 			// 	update: (element, implants) => {
	// 			// 		element.onmousedown = event => {
	// 			// 			event.stopPropagation();
	// 			// 			dialog.setFocus(true);
	// 			// 			dialog.render();
	// 			// 		}
	// 			// 	},
	// 			// 	children: dialog.build("dialog")
	// 			// };

	// 			yield* dialog.build();

	// 		// }



	// 	}

	// }

  // *buildModalContent() {
  //
  //   const modal = this.getModal();
  //
  //   if (modal) {
  //
  //     const selection = this.getSelection();
  //
  //
  //     if (modal && selection && selection.length) {
  //
  //       // const modal = this.getChild("*");
  //
  //
  //
  //       yield {
  //         class: "grid-modal table-body-column karma-modal scroll-container table-body-side-column",
  //         update: div => {
  //           div.element.classList.toggle("display-fixed", modal.resource.display === "fixed");
  //           div.element.style.width = modal.resource.width || "30em";
  //
  //           // redondant with container catcher
  //           // div.element.onmousedown = async event => {
  //           //   event.stopPropagation(); // -> prevent unselecting
  //           //
  //           //   if (!this.hasFocus()) {
  //           //     await this.setFocus(true);
  //           //     await this.request("render");
  //           //   }
  //           // };
  //
  //           div.children = [...modal.build()];
  //         }
  //       };
  //
  //     }
  //
  //   // }
  //
  // }

	// *buildColumns(context) {

	// 	yield* this.buildMain(context);

	// 	if (this.resource.modal) {

	// 		yield* this.buildModal(context);

	// 	}

	// }

	// *buildContent() {

	// 	yield {
	// 		class: "table grid-main",
	// 		children: this.buildGridSections(),
	// 		init: element => {
	// 			if (this.resource.scrollContainer) {
	// 				element.classList.add("scroll-container");
	// 			}
	// 		},
	// 		update: element => {
	// 			const columns = this.getColumns();
	// 			element.style.gridTemplateColumns = columns.map(resource => resource.width || "auto").join(" ");

	// 			// const row = this.getChild(0);
	// 			// element.style.gridTemplateColumns = row.resource.children.map((resource, index) => resource.width || "auto").join(" ");
	// 		}
	// 	};

	// 	yield {
	// 		class: "grid-side",
	// 		update: element => {
	// 			element.classList.toggle("hidden", !this.resource.modal);
	// 			// element.classList.toggle("display-fixed", this.resource.resource.display === "fixed");
	// 			// element.style.width = modal.resource.width || "30em";
	// 		},
	// 		children: this.buildModal()
	// 	};

	// 	const dialog = this.getChild("gridDialog");

	// 	// const dialog = new KarmaFieldsAlpha.field.gridDialog({
	// 	// 	content: this.resource.dialog
	// 	// }, "dialog", this);

	// 	yield {
	// 		class: "dialog-container",
	// 		// children: this.buildDialog()
	// 		children: dialog.build()
	// 	};




	// }

	// *build(context) {

	// 	yield {
	// 		class: "grid-container",
	// 		children: this.buildContent(),
	// 		update: element => {
	// 			this.element = element.parentNode; // -> for local render
	// 		}
	// 	};

	// }

	*build(context) {

		const ids = this.getIds();

		if (ids === undefined) {

			yield {
				class: "grid-container",
			};

		} else if (ids.length === 0) {

			yield {
				class: "grid-container",
				children: []
			};

		} else {

			const dialog = this.getChild("gridDialog");
			const columns = this.getColumns();

			yield {
				class: "grid-container",
				update: element => {
					this.element = element.parentNode; // -> for local render
				},
				children: [
					{
						class: "table grid-main",
						children: this.buildGridSections(),
						init: element => {
							if (this.resource.scrollContainer) {
								element.classList.add("scroll-container");
							}
						},
						update: element => {
							element.style.gridTemplateColumns = columns.map(resource => resource.width || "auto").join(" ");
						}
					},
					{
						class: "grid-side",
						update: element => {
							element.classList.toggle("hidden", !this.resource.modal);
						},
						children: this.buildModal()
					},
					{
						class: "dialog-container",
						children: dialog?.build()
					}
				]
			};

		}

	}

	abduct(deep) {

		if (KarmaFieldsAlpha.renderingDepth === "local" && this.element) {

			return abduct(this.element, this.build());

		}

		return this.parent.abduct(deep);

	}




	*listSelectedChildren() {

		const selection = this.getSelection();

		if (selection) {

			for (let i = 0; i < selection.length; i++) {

				yield this.getChild(selection.index + i);

			}

		}

	}

	// findIndex(tracker) {

	// 	const columns = this.getColumns();
	// 	const offset = this.hasHeader() ? 1 : 0;
	// 	let index = -offset;
	// 	let child = tracker.element.firstElementChild;
	// 	let column = 0;

	// 	while (child) {

	// 		const box = child.getBoundingClientRect();

	// 		if (tracker.isInsideBox(box, tracker.x, tracker.y)) {
	// 			return index;
	// 		}

	// 		child = child.nextElementSibling;

	// 		column++;

	// 		if (column >= columns.length) {

	// 			column = 0;
	// 			index++;

	// 		}

	// 	}

	// 	return -1;

	// }

	// getBox() {

	// 	const selection = this.getSelection();

	// 	if (this.element && selection && selection.length) {

	// 		const children = [...this.element.children];
	// 		const columns = this.getColumns();
	// 		const offset = this.hasHeader() ? 1 : 0;
	// 		const parentBox = this.element.getBoundingClientRect();

	// 		const firstIndex = (selection.index + offset) * columns.length;
	// 		const lastIndex = (selection.index + children.length + offset) * columns.length - 1;
	// 		const first = children[firstIndex];
	// 		const last = children[lastIndex];
	// 		console.log(firstIndex, lastIndex, first, last);

	// 		if (first && last) {

	// 			const box = first.getBoundingClientRect();
	// 			const box2 = last.getBoundingClientRect();

	// 			return {
	// 				x: box.x - parentBox.x,
	// 				y: box.y - parentBox.y,
	// 				width: box2.x + box2.width - box.x,
	// 				height: box2.y + box2.height - box.y
	// 			};

	// 		}

	// 	}

	// }


}



// KarmaFieldsAlpha.field.grid.headerCell = class extends KarmaFieldsAlpha.field {

// 	*build() {

// 		const order = this.getParam("order") || this.resource.order || "asc";
// 		const orderby = this.getParam("orderby");


// 		const activeColumn = orderby === (this.resource.orderby || this.resource.key);

// 		yield {
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

	isMixed(key) {

		return false;

	}

	isUploading() { // deprecated

		return typeof this.resource.id === "object";

	}

	getValue(key) {

		return this.parent.getValueAt(key, this.resource.index);

	}

	setValue(value, key) {

		this.parent.setValueAt(value, key, this.resource.index);

	}

	getIndex() {

		return this.parent.getIndex() + this.resource.index;

	}

	doAction(action, ...args) {

		switch (action) {

			case "delete":
			case "remove":
				this.parent.doAction("deleteAt", this.index);
				break;

			case "open":
				this.parent.doAction("openAt", this.index);
				break;

			default:
				super.doAction(action, ...args)

		}

	}

	// delete() {

	// 	return this.parent.deleteAt(this.resource.index);

	// }

	// open() {

	// 	const selection = this.parent.getSelection();

	// 	if (!selection || !selection.length || this.resource.index < selection.index || this.resource.index >= selection.index + selection.length) {

	// 		this.parent.setSelection({
	// 			index: this.resource.index,
	// 			length: 1
	// 		});

	// 	}

	// 	this.parent.open();

	// }



	hasSelection() {

		return this.parent.isSelectedAt(this.resource.index);

	}

	*build() {

		for (let j = 0; j < this.resource.children.length; j++) {

			const field = this.createChild(this.resource.children[j], j);

			yield {
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
					// element.classList.toggle("selected", this.isSelectedAt(i));
					// element.classList.toggle("odd", i % 2 === 0);
					// element.classList.toggle("last-row", i === ids.length - 1);
					// element.classList.toggle("first-cell", j === 0);
					// element.classList.toggle("last-cell", j === row.resource.children.length - 1);

					element.ondblclick = event => {
						this.save("open");
						this.open();
						this.render();
					}
				},
				children: field.build()
			};

		}

	}

}


KarmaFieldsAlpha.field.gridDialog = class extends KarmaFieldsAlpha.field {

	getValue(key) {

		return this.parent.getSelectedValue(key);

	}

	setValue(value, key) {

		this.parent.setSelectedValue(value, key);

	}

	abduct() {

		if (this.resource.sandbox && this.element) {

			return abduct(this.element, this.buildContent());

		} else {

			return this.parent.abduct();

		}

	}

	newChild(id) {

		// if (id === "content") {

		if (this.resource.content) {

				return this.createChild({
					model: "container",
					header: {
						type: "group",
						display: "flex",
						children: [
							{type: "title"},
							{type: "close"}
						]
					},
					scrollContainer: true, // compat - deprecated
					offsetContainer: true, // compat - deprecated
					scroll: true,
					pad: true,
					border: false,
					...this.resource.content,
					...this.resource.content.content // compat
				}, id);

			}



		// }

	}

	// *buildContent() {

	// 	const content = this.getChild("content");

	// 	yield* content.build();

	// }

	*build() {



		if (this.hasFocusInside()) {

			const content = this.getChild("content");


			if (content) {

				yield {
					class: "dialog",
					child: {
						class: "dialog-content",
						children: content.build(),
						init: element => {
							if (this.resource.width) {
								element.style.maxWidth = this.resource.width;
							}
							if (content.resource.width) {
								element.style.width = content.resource.width;
							}
						}
					},
					init: element => {
						// if (this.resource.width) {
						// 	element.style.maxWidth = this.resource.width;
						// }
						if (content.resource.mode === "toolbox") {
							element.classList.add("toolbox");
							element.classList.add("dark");
							// element.setAttribute("popover", true);
						}
					},
					update: element => {

						if (content.resource.mode === "toolbox") {

							const targetBox = this.request("getBox");

							if (targetBox) {

								// const parentBox = targetBox.parentNode.getBoundingClientRect();
								const box = element.getBoundingClientRect();
								const offset = 10;



								// -> to right
								const x = targetBox.x + targetBox.width + offset;
								const y = targetBox.y;
								// const y = Math.max(offset, targetBox.y + targetBox.height / 2 - box.height / 2);

								// const height = Math.min(window.innerH)

								// console.log(y, targetBox.y, targetBox.height / 2, box.height / 2, parentBox.y);

								// console.log(targetBox, x, y);

								element.style.left = `${x}px`;
								element.style.top = `${y}px`;

							}

						}

						element.onmousedown = event => {
							event.stopPropagation();
							this.setFocus(true);
							this.render();
						}
						this.element = element;
					}
				};

			}



		}

	}


}

KarmaFieldsAlpha.field.grid.modal = class extends KarmaFieldsAlpha.field.container {

	getValue(key) {

		return this.parent.getValue(key);

	}

	setValue(value, key) {

		return this.parent.setValue(value, key);

	}

	getBody() {

		return new KarmaFieldsAlpha.field.grid.modalContent(this.resource.body || { children: this.resource.children }, "body", this);

	}

	close() {

		this.parent.removeSelection();

		super.close();

	}

  *build() {

    const selection = this.parent.getSelection();

    if (selection && selection.length) {

      yield* super.build();

    }

  }

}

KarmaFieldsAlpha.field.grid.dialog = class extends KarmaFieldsAlpha.field.dialog {



	// getValue(key) {

	// 	return this.parent.getSelectedValue(key);

	// }

	// setValue(value, key) {

	// 	this.parent.setSelectedValue(value, key);

	// }

	// newChild(id) {

	// 	return this.createChild(this.resource, id);

	// 	// return new KarmaFieldsAlpha.field[this.resource.type](this.resource, id, this);

	// }

	// delete() {

	// 	const selection = this.parent.getSelection();

	// 	if (selection) {

	// 		const { index = 0, length = 0 } = selection;

	// 		return this.parent.deleteAt(index, length);

	// 	}

	// }

	// close() {

	// 	// this.parent.removeSelection();

	// 	super.close();

	// }

	// *build() {

	// 	const content = this.getChild("content");

	// 	yield* content.build("dialog");


	// }

	// *build() {

	// 	yield {
	// 		class: "container-field dialog-container-field",
	// 		init: element => {
	// 			if (this.resource.width) {
	// 				element.style.maxWidth = this.resource.width;
	// 			}
	// 		},
	// 		update: element => {
	// 			element.onmousedown = event => {
	// 				event.stopPropagation();
	// 				this.setFocus(true);
	// 				this.render();
	// 			}
	// 			this.element = element;
	// 		},
	// 		children: [
	// 			{
	// 				class: "container-header",
	// 				children: this.buildHeader()
	// 			},
	// 			{
	// 				class: "container-body scroll-container",
	// 				children: this.buildBody()
	// 			},
	// 			{
	// 				class: "container-footer",
	// 				children: this.buildFooter()
	// 			}
	// 		]
	// 	};

	// }

}


KarmaFieldsAlpha.field.grid.modalContent = class extends KarmaFieldsAlpha.field.group {

  // getContent(key) {
  //
  //   return this.parent.getContentAt(this.id, key);
  //
  // }
  //
  // setValue(value, key) {
  //
  //   return this.parent.setValueAt(value, this.id, key);
  //
  // }



	*build() {

		yield {
			class: "form-single",
			children: super.build()
		};

	}


}



// KarmaFieldsAlpha.field.grid.row.rowIndex = class extends KarmaFieldsAlpha.field.text {
//   constructor(resource, id, parent) {
//   console.error("deprecated")
//     super({
//       value: ["+", ["resource", "index"], 1],
//       width: "min-content",
//       ...resource
//     }, id, parent)
//   }
//   getContent() {
//     const index = this.parent.getIndex();
//     return new KarmaFieldsAlpha.Content(index + 1);
//   }
// };

KarmaFieldsAlpha.field.index = KarmaFieldsAlpha.field.rowIndex = KarmaFieldsAlpha.field.grid.row.index = KarmaFieldsAlpha.field.grid.row.rowIndex = class extends KarmaFieldsAlpha.field {
	// constructor(resource, id, parent) {
	// 	super({
	// 		// value: ["+", ["resource", "index"], 1],
	// 		value: ["+", ["request", "getIndex"], 1],
	// 		width: "min-content",
	// 		...resource
	// 	}, id, parent)
	// }
	*build() {
		yield {
			tag: "div",
			class: "text karma-field grid-row-index",
			init: element => {
				if (this.resource.width) {
					element.style.width = this.resource.width || "min-content";
				}
			},
			update: element => {
				const index = this.getIndex();
				element.innerHTML = index + 1;
			}
		}
	}
};

// KarmaFieldsAlpha.field.grid.row.delete = class extends KarmaFieldsAlpha.field.button {
//   constructor(resource, id, parent) {
//     super({
//       // request: ["delete", ["request", "getIndex"]],
//       action: "delete",
//       params: [["request", "getIndex"], 1],
//       title: "Delete",
//       dashicon: "remove",
//       classes: ["array-delete", "simple-buttons"],
//       width: "min-content",
//       ...resource
//     }, id, parent);
//   }
// };
