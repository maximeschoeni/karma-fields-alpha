KarmaFieldsAlpha.field.dialog = class extends KarmaFieldsAlpha.field {

	// isScrollContainer() {
	// 	return true;
	// }

	// getValue(key) {

	// 	return this.parent.getSelectedValue(key);

	// }

	// setValue(value, key) {

	// 	this.parent.setSelectedValue(value, key);

	// }

	abduct() {

		if (this.resource.sandbox && this.element) {

			return abduct(this.element, this.buildContent());

		} else {

			return this.parent.abduct();

		}

	}

	newChild(id) {

		if (id === "content") {

			return this.createChild({
				type: "container",
				header: {
					type: "group",
					display: "flex",
					align: "flex-end",
					children: [
						{type: "title"},
						{type: "close"}
					]
				},
				scrollContainer: true,
				offsetContainer: true,
				border: false,
				...(this.resource.content || this.resource), // -> compat (should NOT be this.resource.content!)
			}, id);

		}

	}

	*buildContent() {

		const content = this.getChild("content");

		yield* content.build();

	}

	*build() {

		const content = this.getChild("content");

		if (content && this.hasFocusInside()) {



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

			// yield {
			// 	class: "dialog",
			// 	init: element => {
			// 		if (this.resource.width) {
			// 			element.style.maxWidth = this.resource.width;
			// 		}
			// 		if (content.resource.mode === "toolbox") {
			// 			element.classList.add("toolbox");
			// 			element.classList.add("dark");
			// 			// element.setAttribute("popover", true);
			// 		}
			// 	},
			// 	update: element => {

			// 		if (content.resource.mode === "toolbox") {

			// 			const targetBox = this.request("getBox");



			// 			if (targetBox) {

			// 				// const parentBox = targetBox.parentNode.getBoundingClientRect();
			// 				const box = element.getBoundingClientRect();
			// 				const offset = 10;



			// 				// -> to right
			// 				const x = targetBox.x + targetBox.width + offset;
			// 				const y = targetBox.y;
			// 				// const y = Math.max(offset, targetBox.y + targetBox.height / 2 - box.height / 2);

			// 				// const height = Math.min(window.innerH)

			// 				// console.log(y, targetBox.y, targetBox.height / 2, box.height / 2, parentBox.y);

			// 				// console.log(targetBox, x, y);

			// 				element.style.left = `${x}px`;
			// 				element.style.top = `${y}px`;



			// 			}

			// 		}





			// 		element.onmousedown = event => {
			// 			event.stopPropagation();
			// 			this.setFocus(true);
			// 			this.render();
			// 		}
			// 		this.element = element;
			// 	},
			// 	children: content.build()
			// };

		}

	}

	*build2() {

		const content = this.getChild("content");

		yield {
			class: "toolbox dark",
			init: element => {
				if (this.resource.width) {
					element.style.maxWidth = this.resource.width;
				}
			},
			update: element => {
				const dialogBox = element.getBoundingClientRect();
				const rectangle = this.resource.target;
				const offset = 10;
				let x, y;

				element.classList.remove("top", "bottom", "left", "right", "align-top", "align-bottom", "align-left", "align-right");

				if (this.resource.position === "bottom" || this.resource.position === "top") {

					if (this.resource.position === "top") {

						y = rectangle.y - dialogBox.height - offset;
						element.classList.add("top");

					} else {

						y = rectangle.y + rectangle.height + offset;
						element.classList.add("bottom");

					}

					if (this.resource.align === "right") {

						x = rectangle.x + rectangle.width - dialogBox.width;
						element.classList.add("align-right");

					} else {

						x = rectangle.x;
						element.classList.add("align-left");

					}

				} else {

					if (this.resource.position === "left") {

						x = rectangle.x - dialogBox.width - offset;
						element.classList.add("left");

					} else {

						x = rectangle.x + rectangle.width + offset;
						element.classList.add("right");

					}

					if (this.resource.align === "bottom") {

						y = rectangle.y + rectangle.height - dialogBox.height;
						element.classList.add("align-bottom");

					} else {

						y = rectangle.y;
						element.classList.add("align-top");

					}

				}

				element.style.left = `${x}px`;
				element.style.top = `${y}px`;

				element.onmousedown = event => {
					event.stopPropagation();
					this.setFocus(true);
					this.render();
				}
			},
			children: content.build()

		};

	}


}

KarmaFieldsAlpha.field.dialogLink = class extends KarmaFieldsAlpha.field {

	// getSelectedValue(key) {

	// 	return this.getValue(key);

	// }

	// setSelectedValue(value, key) {

	// 	this.setValue(value, key);

	// }

	newChild(index) {

		return new KarmaFieldsAlpha.field.dialog(this.resource.dialog, "dialog", this);


		// return new KarmaFieldsAlpha.field.dialog({
		// 	content: {
		// 		header: {
		// 			children: [
		// 				{type: "title"},
		// 				{type: "close"}
		// 			]
		// 		},
		// 		...this.resource.dialog
		// 	},
		// }, index, this);

	}

	open() {

		const dialog = this.getChild("dialog");

		dialog.setFocus(true);

		if (this.resource.params) {

			KarmaFieldsAlpha.server.promise(done => {

				let params = this.parseObject(this.resource.params);

				if (params !== undefined) {

					const content = this.getChild("content");

					content.setState(params, "params");

					done();

				}

			});

		}

	}

	close() {

		this.setFocus();

	}

	getText() {

		return this.parseString(this.resource.text || this.resource.content);

	}

	// *buildDialog() {

	// 	const dialog = this.getDialog();

	// 	if (dialog && dialog.hasFocusInside()) {

	// 		console.log(dialog);

	// 		yield* dialog.build();
	// 		// yield {
	// 		// 	class: "dialog",
	// 		// 	children: dialog.build()
	// 		// };

	// 	}

	// }

	*build() {

		const dialog = this.getChild("dialog");

		yield {
			tag: "a",
			class: "dialog-link",
			update: element => {
				element.innerHTML = this.getText();
				element.onclick = event => {
					event.preventDefault();
					this.save("open");
					this.open();
					this.render();
				}
			}
		};

		if (dialog) {

			yield {
				class: "dialog-container",
				children: dialog.build()
			};

		}

	}

}


KarmaFieldsAlpha.field.dialogContainer = class extends KarmaFieldsAlpha.field {


}

KarmaFieldsAlpha.field.selectionContainer = class extends KarmaFieldsAlpha.field.dialogContainer {



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

	getValueAt(key, index) {

		const ids = this.getIds();

		if (ids) {

			const id = ids[index];

			if (id !== undefined) {

				return this.getValue(value, key, id);

			}

		}

	}

	setValueAt(value, key, index) {

		const ids = this.getIds();

		if (ids) {

			const id = ids[index];

			if (id !== undefined) {

				this.setValue(value, key, id);

			}

		}



	}

	getSelectedValue(key) {

		const ids = this.getSelectedIds();

		if (ids === undefined) {

			return;

		}

		if (ids.length) {

			const values = ids.map(id => this.parent.getValue(key, id)); // -> need to fetch all values (set loading tasks)

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

			super.setValue(value, key, id);

		}

	}


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

	getIdsAt(index, length = 1) {

		const ids = this.getIds();

		if (ids) {

			return ids.slice(index, index + length);

		}

	}

	deleteSelection() {

		const ids = this.getSelectedIds();

		if (ids) {

			this.removeIds(ids);

		}

	}

	deleteAt(index, length = 1) { // -> called from children

		let ids = this.getIdsAt(index, length);
		this.parent.delete(...ids);

	}

	delete() { // -> delete from pressing delete key

		// const selection = this.getSelection();

		// if (selection) {

		// 	const { index = 0, length = 0 } = selection;

		// 	this.deleteAt(index, length);

		// }

		const ids = this.getSelectedIds();

		this.parent.delete(...ids);

	}


	copy() {

		const grid = this.exportSelection();

		if (grid === undefined) {

			return "[loading]";

		} else {

			return KarmaFieldsAlpha.CSV.stringify(grid);

		}

	}

	paste(string) {

		const grid = KarmaFieldsAlpha.CSV.parse(string);

		this.import(grid);

	}

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

	}

	// still used?
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

		if (KarmaFieldsAlpha.server.hasPromise()) {

			console.error("duplicating things but there is still a pending promise");
			return;

		}

		KarmaFieldsAlpha.server.promise(done => {

			const grid = this.exportAt(index, length);

			if (grid !== undefined) {

				this.importAt(grid, index + length, length);

				this.setSelection({ index: index + length, length });

				done();

			}

		});

	}

	swapAt(index, target, length) {

		const ids = this.getIds();

		if (ids === undefined) {

			console.error("swaping items but ids is undefined");

		}

		const newIds = [...ids];

		newIds.splice(target, 0, ...newIds.splice(index, length));

		this.parent.setOrder(newIds);

		this.setIds(newIds);

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

			return this.getChild("*");

		}

	}

	getDialog() {

		if (this.resource.dialog) {

			return this.getChild("dialog");

		}

	}

	open() {

		if (this.resource.dialog) {

			const dialog = this.getChild("dialog");

			dialog.setFocus();

		}

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

	*buildRows() {

		let ids = this.getIds();

		if (ids !== undefined) {

			if (this.hasHeader() && ids.length) {

				const columns = this.getColumns();

				for (let i = 0; i < columns.length; i++) {

					const classes = [];

					if (i === 0) {
						classes.push("first-cell");
					}
					if (i === columns.length - 1) {
						classes.push("last-cell");
					}

					const headerCell = new KarmaFieldsAlpha.field.grid.headerCell({
						...columns[i],
						classes,
					}, `header-cell-${i}`, this);

					yield* headerCell.build();

				}

			}

			const columns = this.getColumns();

			for (let i = 0; i < ids.length; i++) {

				if (this.resource.sortable) {

					const sortableKey = this.getSortableKey();

					this.getValue(sortableKey, ids[i]); // -> preset positions

				}

				// const row = this.getChild(i);
				const row = this.getRow(i, ids[i]);


				// const isRowSelected = KarmaFieldsAlpha.Segment.contain(selection, i);

				for (let j = 0; j < row.resource.children.length; j++) {

					const field = row.createChild(row.resource.children[j], j);

					yield {
						class: "td table-cell",
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
							// element.classList.toggle("selected", this.isSelected(ids[i]));
							element.classList.toggle("selected", this.isSelectedAt(i));
							element.classList.toggle("odd", i % 2 === 0);
							element.classList.toggle("last-row", i === ids.length - 1);
							element.classList.toggle("first-cell", j === 0);
							element.classList.toggle("last-cell", j === row.resource.children.length - 1);

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

	}

	*buildMain(context) { // overrided by gallery

		if (context === "dialog") {

			yield {
				class: "scroll-container",
				children: this.buildMain()
			};

		} else {

			yield {
				class: "table",
				children: this.buildRows(),
				init: element => {
					if (this.resource.scrollContainer) {
						element.classList.add("scroll-container");
					}
				},
				update: element => {

					const ids = this.getIds();

					const selection = this.getSelection();

					if (ids !== undefined && selection !== undefined) {

						element.classList.toggle("loading", false); // !!!!
						element.classList.toggle("active", Boolean(this.hasFocus()));
						element.classList.toggle("even", ids.length % 2 === 0);
						element.classList.toggle("filled", ids.length > 0); // -> draw table borders

						// const columns = this.getColumns();
						const row = this.getChild(0);
						// grid.element.style.gridTemplateColumns = row.resource.children.map(resource => row.createChild(resource).resource.width || "auto").join(" ");
						element.style.gridTemplateColumns = row.resource.children.map((resource, index) => row.getChild(index).resource.width || "auto").join(" ");
						// grid.element.style.gridTemplateColumns = columns.map(resource => resource.width || "auto").join(" ");

						// let selection = this.getSelection();



						if (this.resource.sortable) {

							const sorter = new KarmaFieldsAlpha.ListSortGrid(element, selection, this.resource.children.length, this.hasHeader() ? 1 : 0);

							sorter.onSelect = elements => {
								elements.map(element => element.classList.add("selected"));
								this.setSelection(sorter.state.selection);
							}

							sorter.onUnselect = elements => {
								elements.map(element => element.classList.remove("selected"));
							}

							sorter.onSelectionComplete = () => {
								this.setFocus(1);
								this.render();
							}

							sorter.onSwap = (newState, lastState) => {
								this.save("reorder", "Reorder");
								this.swapAt(lastState.selection.index, newState.selection.length, newState.selection.index);
								// this.setSelection(newState.selection);
								// this.render();
							};

							sorter.onSort = (index, target, length) => {
								this.setFocus(1);
								this.render();
							}

						} else {

							const selector = new KarmaFieldsAlpha.RowPicker(element, selection);
							// const hasHeader = columns.some(column => column.label);
							selector.header = this.hasHeader() ? 1 : 0;
							selector.width = this.resource.children.length;

							selector.onSelect = elements => {
								elements.map(element => element.classList.add("selected"));
								this.setSelection(selector.state.selection);
							}

							selector.onUnselect = elements => {
								elements.map(element => element.classList.remove("selected"));
							}

							selector.onSelectionComplete = () => {
								this.setFocus(true);
								this.render();
							}

						}

					}

				}

			};

		}


	}

	*buildModalContent() {

		const modal = this.getModal();

		if (modal && this.hasSelection() && this.hasFocusInside()) {

			yield* modal.build();

		}

	}

	*buildSide() {

		const side = this.getSide();

		if (side) {

			yield {
				class: "side-panel",
				update: element => {
					element.classList.toggle("display-fixed", modal.resource.display === "fixed");
					element.style.width = modal.resource.width || "30em";
				},
				children: this.buildModalContent()
			};

		}

	}

	*build() {

		if (this.resource.panel) {

			yield {
				class: "panel-container",
				children: [
					{
						class: "main-panel",
						children: this.buildMain()
					},
					{
						class: "side-panel",
						children: this.buildSide()
					}
				]
			};

		} else {

			yield* this.buildMain();

		}

		if (this.resource.dialog) {

			yield* this.buildDialog();

		}

	}


	*buildDialog() {

		const dialog = this.getChild("dialog");

		if (dialog && dialog.hasFocusInside()) {

			yield {
				class: "dialog",
				init: element => {
					if (dialog.resource.width) {
						element.style.maxWidth = dialog.resource.width;
					}
					if (dialog.resource.dark) {
						element.classList.add("dark");
					}
				},
				update: element => {
					element.onmousedown = event => {
						event.stopPropagation();
						this.setFocus(true);
						this.render();
					}
					this.element = element;
				},
				children: dialog.build()
			};

		}

	}

	*buildSidePanel() {

		const side = this.getChild("side");

		if (side && side.hasFocusInside()) {

			yield {
				class: "side-panel-content",
				init: element => {
					if (side.resource.width) {
						element.style.width = side.resource.width;
					}
				},
				update: element => {
					element.onmousedown = event => {
						event.stopPropagation();
						this.setFocus(true);
						this.render();
					}
					this.element = element;
				},
				children: side.build()
			};

		}

	}

	getTargetRectangle() {

		return this.resource.target;

	}

	*buildToolbox() {

		const toolbox = this.getChild("toolbox");

		if (toolbox && toolbox.hasFocusInside()) {

			yield {
				class: "toolbox dark",
				init: element => {
					if (this.resource.width) {
						element.style.maxWidth = this.resource.width;
					}
				},
				update: element => {
					const dialogBox = element.getBoundingClientRect();
					const rectangle = this.getTargetRectangle();
					const offset = 10;
					let x, y;

					element.classList.remove("top", "bottom", "left", "right", "align-top", "align-bottom", "align-left", "align-right");

					if (this.resource.position === "bottom" || this.resource.position === "top") {

						if (this.resource.position === "top") {

							y = rectangle.y - dialogBox.height - offset;
							element.classList.add("top");

						} else {

							y = rectangle.y + rectangle.height + offset;
							element.classList.add("bottom");

						}

						if (this.resource.align === "right") {

							x = rectangle.x + rectangle.width - dialogBox.width;
							element.classList.add("align-right");

						} else {

							x = rectangle.x;
							element.classList.add("align-left");

						}

					} else {

						if (this.resource.position === "left") {

							x = rectangle.x - dialogBox.width - offset;
							element.classList.add("left");

						} else {

							x = rectangle.x + rectangle.width + offset;
							element.classList.add("right");

						}

						if (this.resource.align === "bottom") {

							y = rectangle.y + rectangle.height - dialogBox.height;
							element.classList.add("align-bottom");

						} else {

							y = rectangle.y;
							element.classList.add("align-top");

						}

					}

					element.style.left = `${x}px`;
					element.style.top = `${y}px`;

					element.onmousedown = event => {
						event.stopPropagation();
						this.setFocus(true);
						this.render();
					}
				},
				children: content.build()

			};

		}

	}

}
