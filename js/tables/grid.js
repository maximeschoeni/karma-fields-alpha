

KarmaFieldsAlpha.field.grid = class extends KarmaFieldsAlpha.field {

	getLength() {

		const ids = this.getIds();

		if (ids !== undefined) {

			return ids.length;

		}

	}

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

	newChild(id) {

		if (id === "modal" || id === "*") {

			if (this.resource.modal) {

				return new KarmaFieldsAlpha.field.grid.modal(this.resource.modal, "modal", this);

			}

		} else {

			return new KarmaFieldsAlpha.field.grid.row({
				children: this.resource.children || this.resource.columns,
				index: id
			}, id, this);

		}

	}

	getRow(index, id) {

		if (id === undefined) {

			const ids = this.getIds();

			if (index >= ids.length) {

				console.error("getting row but index is out of bounds");

			}

			id = ids[index];

		}

		return new KarmaFieldsAlpha.field.grid.row({
			children: this.resource.children || this.resource.columns,
			index,
			id
		}, index, this);

	}

  // getChild(index, ...path) {

  //   let child = this.newChild(index);

  //   if (child && path.length) {

  //     return child.getChild(...path);

  //   }

  //   return child;

  // }


  // compat
	// getContentAt(index, key) {
	// 	const content = new KarmaFieldsAlpha.Content();
	// 	content.value = this.getValueAt(index, key);
	// 	return content;
	// }

	// *getSelectedIndexes() {

	// 	const selection = this.getSelection();
	// 	const indexes = [...this.getIndexes()];

	// 	for (let i = 0; i < selection.length; i++) {

	// 		yield indexes[selection.index + i];

	// 	}

	// }

	// getSelectedValue(key) {

	// 	let selection = this.getSelection();

	// 	if (selection.length > 1) {

	// 		return this.getValueRange(selection.index, selection.length, key);

	// 	} else if (selection.length === 1) {

	// 		return this.getValueAt(selection.index, key);

	// 	} else {

	// 		return [];

	// 	}

	// }

	// getValueRange(index, length, key) {

	// 	id = this.getIds()[index];

	// 	return this.parent.getValueRange(index, length, key);

	// }

	// isMixed(key, ids) {

	// 	if (!ids) {

	// 		ids = this.getSelectedIds();

	// 	}

	// 	if (ids.length > 1) {

	// 		return this.parent.isMixed(key, ids);

	// 	}

	// 	return false;

	// }

	isMixed(key, ids) {

		if (!ids) {

			ids = this.getSelectedIds();

		}

		if (ids.length > 1) {

			// if (!driver) {

			// 	driver = this.getDriver();

			// }

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

	getValue(key, id) {

		if (id === undefined) {

			const ids = this.getSelectedIds();

			if (ids === undefined) {

				return;

			}

			if (ids.length) {

				return super.getValue(key, ids[0]);

			} else {

				console.warn("getting value but nothing is selected");

			}

		}

		// const driver = this.getDriver();

		return super.getValue(key, id);

	}

	setValue(value, key, id) {

		if (id === undefined) {

			const ids = this.getSelectedIds();

			if (!ids || !ids.length) {

				console.error("setting value but nothing is selected");

			}

			for (let id of ids) {

				super.setValue(value, key, id);

			}

		} else {

			super.setValue(value, key, id);

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

		if (selection) {

			return selection.length > 0;

		}

		return false;

	}

	hasSelectionInside() {

		const selection = this.getSelection();

		if (selection) {

			return this.hasFocus() && selection.length > 0;

		}

		return false;

	}

	isSelected(id) {

		const selection = this.getSelection();

		if (selection) {

			return selection.includes(id);

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

		let ids = this.getIdsAt(index, length);
		this.parent.delete(...ids);

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

		this.parent.setOrder(newIds);

		// for (let i = 0; i < ids.length; i++) {

		// 	if (newIds[i] !== ids[i]) {

		// 		this.setValue(i, sortableKey, newIds[i]);

		// 	}

		// }

		this.setIds(newIds);

	}

  getExportableColumns() {

    if (this.resource.export || this.resource.import) {

      return this.resource.export || this.resource.import;

    } else if (this.resource.modal) {

      const modalContent = this.getChild("*", "body");

      // return [...this.resource.children, ...this.resource.modal.children];
      return [...this.resource.children, ...modalContent.resource.children];

    } else {

      return this.resource.children;

    }

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

				const child = this.getChild(ids[index + i]);

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
						},
						update: element => {
							element.classList.toggle("selected", this.isSelected(ids[i]));
							element.classList.toggle("odd", i % 2 === 0);
							element.classList.toggle("last-row", i === ids.length - 1);
							element.classList.toggle("first-cell", j === 0);
							element.classList.toggle("last-cell", j === row.resource.children.length - 1);

						},
						children: field.build()
					};

				}

			}

		}

	}

  // *buildModalContent() {
  //
  //   const modal = this.getChild("*");
  //
  //
  //   if (modal) {
  //
  //     yield* modal.build();
  //
  //   }
  //
  // }

  // buildModal() {
  //
  //
  //
  //   return {
  //     class: "grid-modal table-body-column karma-modal scroll-container table-body-side-column",
  //     // child: this.createChild({
  //     //   ...this.resource.modal,
  //     //   type: "row"
  //     // }, "*").build(),
  //     children: [...this.buildModalContent()],
  //     // children: [this.createChild({
  //     //   ...this.resource.modal,
  //     //   type: "modal"
  //     // }, "*").build()],
  //     init: div => {
  //       // KarmaFieldsAlpha.registerStickyModal({
  //       //   modal: div.element,
  //       //   tableBody: div.element.parentNode.parentNode,
  //       //   table: div.element.parentNode.parentNode.parentNode
  //       // });
  //     },
  //     update: div => {
  //
  //       // if (this.resource.display === "fixed") {
  //       //   div.element.classList.add("fixed-modal");
  //       //
  //       // } else {
  //       //
  //       //   div.element.classList.remove("sticky-modal");
  //       //   if (this.parent.id !== "popup") {
  //       //     const focus = this.getFocus();
  //       //     if (focus && !focus.includes("popup")) { // -> opening popup in sticky container seems to be bugged
  //       //       div.element.style.height = `${this.request("getModalHeight", div.element)}px`;
  //       //       div.element.style.top = `${this.request("getModalTop", div.element)}px`;
  //       //       div.element.classList.add("sticky-modal");
  //       //     }
  //       //   }
  //       // }
  //
  //
  //
  //
  //       div.element.classList.toggle("hidden", !this.resource.modal);
  //       if (this.resource.modal) {
  //         div.element.style.width = this.resource.modal.width || "30em";
  //         div.element.onmousedown = async event => {
  //           event.stopPropagation(); // -> prevent unselecting
  //
  //           await this.setFocus(true);
  //           await this.request("render");
  //         };
  //         const hasSelection = this.hasSelection();
  //         div.element.classList.toggle("active", Boolean(hasSelection));
  //       }
  //
  //
  //
  //     }
  //   };
  //
  // }


	*buildBody() { // overrided by gallery

		yield {
			class: "karma-field-table-grid-container karma-field-frame karma-field-group final table-body-column table-body-main-column",
			init: element => {
				if (this.resource.height) {
					element.style.minHeight = this.resource.height;
				}
				if (this.resource.style) {
					element.style = this.resource.style;
				}
				if (this.resource.width) {
					element.style.width = this.resource.width;
				}
				if (this.resource.class) {
					element.classList.add(this.resource.class);
				}
				if (this.parent.id === "popup") {
					element.classList.add("scroll-container");
				}
			},
			child: {
				class: "table grid grid-field-body",
				children: this.buildRows(),
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


							// sorter.onSort = async (newState, lastState) => {
							//   await this.save("sort", "Sort");
							//   await this.setSelection(newState.selection);
							//   await this.setFocus(1);
							//   // -> !!!! swap may need multiple renderings (need to fetch position from indexedDB) !!!!
							//   await this.request("swap", lastState.selection.index, newState.selection.index, newState.selection.length);
							//
							//   // await this.request("render");
							// }

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
			}
		};

	}

  getModal() {

    if (this.resource.modal) {

      return this.getChild("*");

    }

  }

	*buildModalContent() {

		const modal = this.getModal();

		if (modal && this.hasSelection() && this.hasFocusInside()) {

			yield* modal.build();

		}

	}

  *buildModal() {

    const modal = this.getModal();

    if (modal) {

      // const selection = this.getSelection();
      //
      //
      // if (modal && selection && selection.length) {

        // const modal = this.getChild("*");



        yield {
          class: "grid-modal table-body-column karma-modal scroll-container table-body-side-column",
          update: element => {
            element.classList.toggle("display-fixed", modal.resource.display === "fixed");
            element.style.width = modal.resource.width || "30em";

            // redondant with container catcher
            // div.element.onmousedown = async event => {
            //   event.stopPropagation(); // -> prevent unselecting
            //
            //   if (!this.hasFocus()) {
            //     await this.setFocus(true);
            //     await this.request("render");
            //   }
            // };

            // element.classList.toggle("active", this.hasSelection() && this.hasFocusInside());



            // children = [...modal.build()];
          },
          children: this.buildModalContent()
        };

      // }

    }

  }

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

  *buildColumns() {

    yield* this.buildBody();

    yield* this.buildModal();

  }

  *build() {

    yield {
      class: "table-body-columns",
      update: element => {

        element.classList.toggle("stretch-columns", this.parent.id === "popup");


      },
      children: this.buildColumns()
      // children: [
      //   this.buildBody(),
      //   this.buildModal()
      // ]
    };

  }


}



KarmaFieldsAlpha.field.grid.headerCell = class extends KarmaFieldsAlpha.field {

	*build() {

		this.order = this.getParam("order") || this.resource.order || "asc";
		this.activeColumn = this.getParam("orderby") === (this.resource.orderby || this.resource.key);

		yield {
			class: "th table-header-cell",
			init: element => {
				if (this.resource.classes) {
					element.classList.add(...this.resource.classes);
				}
			},
			update: element => {
				element.classList.toggle("sortable", Boolean(this.resource.sortable))
				if (this.resource.sortable) {
					element.onmousedown = event => {
						event.stopPropagation(); // -> prevent header selection
					}
					element.onclick = event => {
						event.preventDefault();
						this.save("sort");
						if (this.activeColumn) {
							this.setValue(this.order === "asc" ? "desc" : "asc", "order");
						} else {
							this.setValue(this.resource.order || "asc", "order");
							this.setValue(this.resource.orderby || this.resource.key, "orderby");
						}
						this.render();
					};
				}
			},
			children: [
				{
					class: "header-cell-content title",
					init: element => {
						element.textContent = this.resource.label;
					}
				},
				{
					class: "header-cell-content order",
					update: element => {
						element.classList.toggle("hidden", !this.resource.sortable);
					},
					children: [
						{
							tag: "span",
							class: "dashicons dashicons-arrow-up",
							update: element => {
								element.classList.toggle("active", this.order === "asc" && this.activeColumn);
								element.classList.toggle("passive", this.activeColumn && this.order !== "asc" || !this.activeColumn && (this.resource.order || "asc") === "asc");
							}
						},
						{
							tag: "span",
							class: "dashicons dashicons-arrow-down",
							update: element => {
								element.classList.toggle("active", this.order === "desc" && this.activeColumn);
								element.classList.toggle("passive", this.activeColumn && this.order !== "desc" || !this.activeColumn && (this.resource.order || "asc") === "desc");
							}
						}
					]
				}
			]
		};

	}

}


KarmaFieldsAlpha.field.grid.row = class extends KarmaFieldsAlpha.field.group {

	// getValue(key) {

	// 	return this.parent.getValueAt(this.id, key);

	// }

	// setValue(value, key) {

	// 	this.parent.setValueAt(value, this.id, key);

	// }

	// getIndex() {

	// 	const indexOffset = this.parent.getIndex();

	// 	return indexOffset + (this.resource.index || 0);

	// }

	// delete() {

	// 	return this.parent.deleteAt(this.id, 1);

	// }

	isMixed(key) {

		return false;

	}

	isUploading() { // deprecated

		return typeof this.resource.id === "object";

	}

	getValue(key) {

		return this.parent.getValue(key, this.resource.id);

	}

	setValue(value, key) {

		this.parent.setValueAt(value, key, this.resource.index);

	}

	getIndex() {

		return this.parent.getIndex() + this.resource.index;

	}

	delete() {

		return this.parent.deleteAt(this.resource.index);

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

KarmaFieldsAlpha.field.grid.row.index = KarmaFieldsAlpha.field.grid.row.rowIndex = class extends KarmaFieldsAlpha.field {
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
			class: "text grid-row-index",
			init: element => {
				if (this.resource.width) {
					element.style.width = this.resource.width || "min-content";
				}
			},
			update: element => {
				element.innerHTML = this.getIndex() + 1;
			}
		}
	}
};

KarmaFieldsAlpha.field.grid.row.delete = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      // request: ["delete", ["request", "getIndex"]],
      action: "delete",
      params: [["request", "getIndex"], 1],
      title: "Delete",
      dashicon: "remove",
      classes: ["array-delete", "simple-buttons"],
      width: "min-content",
      ...resource
    }, id, parent);
  }
};
