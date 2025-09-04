
KarmaFieldsAlpha.field.blocks = class extends KarmaFieldsAlpha.field.container {




	// getValue() {

	// 	return this.parent.getValue();

	// }


	// setValueAt(value, index) {

	// 	// let values = this.parent.getValue();

	// 	// values = [...values];

	// 	// values[index] = value;

	// 	this.parent.setValue(values);

	// }



	getItems() {

		const values = this.getValue();

		if (values !== undefined) {

			const items = this.createItems(values);

			return items;

		}

	}


	createItems(values) {

		const items = [];

		for (let i = 0; i < values.length; i++) {

			const value = values[i];

			// const block = this.resource.footer.find(block => block.id === value.type);

			const block = this.resource.blocks && this.resource.blocks[value.type];

			if (block) {

				// const { media, fields, name } = block;
				const children = value.children && this.createItems(value.children) || [];
				const resource = { ...block, value, children, index: i };

				items.push(resource);

			}

		}

		return items;
	}

	*listSelectedBlocks(items = this.getItems()) {

		if (items) {

			const selection = this.getSelection();

			if (selection) {

				const { index = 0, length = 0 } = selection;

				for (let item of items) {

					if (item.index >= index && item.index < index + length) {

						yield item;

					}

					if (selection[item.index] && item.children) {

						yield* this.listSelectedBlocks(item.children);

					}

				}

			}

		}

	}

	add(blockId) {

		let values = this.getValue();

		if (values === undefined) {

			console.error("value");

		}

		this.setValue([...values, { type: blockId }])

	}

	// *buildBlockBody(block) {

	// 	// for (let child of block.children) {
	// 	for (let i = 0; i < this.resource.children.length; i++) {

	// 		const child = block.children[i];
	// 		const field = this.createChild(child, i);

	// 		yield* field.build();

	// 	}

	// }

	getFocusPathInside() {

		let path = this.getFocusPath();

		if (path.length > this.path.length && this.path.every((id, index) => id === path[index])) {

			return path.slice(this.path.length);

		}

	}


	newChild(id) {

		if (id === "modal") {

			if (this.resource.modal) {

				return new KarmaFieldsAlpha.field.grid.modal(this.resource.modal, "modal", this);

			}

		} else if (id === "popup") {

			// const selectedBlocks = this.listSelectedBlocks().toArray();
			const pathInside = this.getFocusPathInside();

			if (pathInside) {
				debugger;
				const block = this.getChild(...pathInside);
				console.log(block);
			}


			return new KarmaFieldsAlpha.field.container({
				type: "container",
				body: {
					type: "group",
					children: [
						{
							type: "input",
							key: "test",
							label: "test"
						}
					]
				}
			}, "popup", this);

		} else if (id === "root") {

			const items = this.getItems();

			if (items !== undefined) {

				return new KarmaFieldsAlpha.field.block({ children: items }, "groupBlock", this);

			}

		}

	}

	open() {

		const popup = this.getChild("popup");

		popup.setFocus(true);

	}

	*buildPopup() {

		// const focus = this.hasFocus();
		// const selection = this.getSelection();

		const popup = this.getChild("popup");
		const hasPopup = popup.hasFocusInside();

		if (hasPopup) {



			yield {
				class: "popup",
				update: element => {
					element.onmousedown = event => {
						event.stopPropagation();

						popup.setFocus(true);
						popup.render();
					}
				},
				child: {
					class: "popup-content",
					children: popup.build()
				}
			};

		}

	}

	*buildRoot() {

		const block = this.getChild("root");

		if (block) {

			yield {
				// tag: "ul",
				class: "karma-field-table-grid-container karma-field-frame karma-field-group final table-body-column table-body-main-column",
				children: block.build()
			};

			yield* this.buildPopup();

		}

	}


	*buildBody() {

		yield {
			class: "table-body",
			children: this.buildRoot()
		};

		// // const root = this.getRoot();
		// const block = this.getChild("root");

		// // for (let item of items) { // -> should contain only 1 item

		// 	// const block = new KarmaFieldsAlpha.field.block(item, i, this);


		// if (block) {

		// 	yield {
		// 		tag: "ul",
		// 		class: "karma-field-table-grid-container karma-field-frame karma-field-group final table-body-column table-body-main-column",

		// 		init: element => {
		// 			// if (this.resource.height) {
		// 			// 	element.style.minHeight = this.resource.height;
		// 			// }
		// 			// if (this.resource.style) {
		// 			// 	element.style = this.resource.style;
		// 			// }
		// 			// if (this.resource.width) {
		// 			// 	element.style.width = this.resource.width;
		// 			// }
		// 			// if (this.resource.class) {
		// 			// 	element.classList.add(this.resource.class);
		// 			// }
		// 			// if (this.parent.id === "popup") {
		// 			// 	element.classList.add("scroll-container");
		// 			// }
		// 		},
		// 		children: block.build()
		// 	};

		// }



	}

	// getModal() {

	// 	return this.getChild("modal");

	// }

	// *buildModalContent() {

	// 	const modal = this.getModal();

	// 	if (modal && this.hasSelection() && this.hasFocusInside()) {

	// 		yield* modal.build();

	// 	}

	// }

	// *buildModal() {

	// 	const modal = this.getModal();

	// 	if (modal) {

	// 		yield {
	// 			class: "grid-modal table-body-column karma-modal scroll-container table-body-side-column",
	// 			update: element => {
	// 				element.classList.toggle("display-fixed", modal.resource.display === "fixed");
	// 				element.style.width = modal.resource.width || "30em";
	// 			},
	// 			children: this.buildModalContent()
	// 		};

	// 	}

	// }

	// *buildColumns() {

	// 	yield* this.buildBody();
	// 	yield* this.buildModal();

	// }

	// *build() {

	// 	yield {
	// 		class: "table-body-columns",
	// 		children: this.buildColumns()
	// 	};

	// }


	// *buildBlockFields(item) {

	// 	for (let child of item.children) {

	// 		const type = child.type;
	// 		const block = this.resource.blocks[type];

	// 		yield {
	// 			tag: "li",
	// 			children: [
	// 				{
	// 					type: "media",
	// 					...block.media
	// 				}
	// 			]
	// 		};

	// 	}

	// }

	// *buildBlock() {

	// 	yield {
	// 		tag: "ul",
	// 		class: "block",
	// 		children: this.buildBlockFields(),
	// 		update: element => {

	// 			const selection = this.getSelection();

	// 			const sorter = new KarmaFieldsAlpha.ListSorterInline(element, selection);

	// 			sorter.onSelect = elements => {
	// 				elements.map(element => element.classList.add("selected"));
	// 				this.setSocketSelection(sorter.state.selection);
	// 			}

	// 			sorter.onUnselect = elements => {
	// 				elements.map(element => element.classList.remove("selected"));
	// 			}

	// 			sorter.onSelectionComplete = () => {
	// 				this.setFocus(true);
	// 				 this.render();
	// 			}

	// 			sorter.onSwap = (newState, lastState) => {
	// 				this.save("reorder");
	// 				this.swapAt(lastState.selection.index, newState.selection.index, newState.selection.length);
	// 				this.setSocketSelection(newState.selection);
	// 			};

	// 			sorter.onSort = (newSelection, lastSelection) => {
	// 				if (!KarmaFieldsAlpha.Collection.equal(newSelection, lastSelection)) {
	// 					this.setFocus(true);
	// 					this.render();
	// 				}
	// 			}

	// 		}
	// 	}

	// }


	// *build(item = this.getRoot()) {

	// 	if (item === undefined) {

	// 		return;

	// 	}

	// 	const groupField = this.createChild({
	// 		type: "group",
	// 		children: item.children
	// 	}, 0);

	// 	return {
	// 		class: "block-editor",
	// 		children: groupField.build(),
	// 		// update: node => {

	// 		// 	let values = this.getValue();

	// 		// 	if (values && values !== KarmaFieldsAlpha.loading) {

	// 		// 		node.children = [
	// 		// 			{
	// 		// 				tag: "ul",
	// 		// 				class: "block-columns block-root",
	// 		// 				child: this.createChild({
	// 		// 					type: "column",
	// 		// 					// value: values[0],
	// 		// 					...values[0],
	// 		// 					depth: 0,
	// 		// 					index: 0,
	// 		// 					path: []
	// 		// 				}).build(),

	// 		// 				update: node => {

	// 		// 					node.childrenXXXXX = [

	// 		// 					];
	// 		// 				}
	// 		// 			},


	// 		// 			{
	// 		// 				class: "editor-footer",
	// 		// 				update: node => {

	// 		// 					const sorter = new KarmaFieldsAlpha.ListSortBlockLibrary(node.element);

	// 		// 					sorter.onDragBegin = index => {

	// 		// 						this.addBlock(this.resource.library[index]);

	// 		// 						const values = this.getValue();

	// 		// 						if (typeof values !== "symbol" && values[0] && values[0].children) {

	// 		// 							const selection = { index: values[0].children.length - 1, length: 1 };

	// 		// 							this.setSelection({ child: selection, childId: 0 });

	// 		// 							sorter.state = {
	// 		// 								selection: selection,
	// 		// 								path: [0]
	// 		// 							};

	// 		// 							sorter.container = node.element.previousElementSibling.querySelector(".block-column");

	// 		// 							const placeholder = document.createElement("div");
	// 		// 							placeholder.className = "block";

	// 		// 							sorter.container.appendChild(placeholder);

	// 		// 							sorter.children = null;

	// 		// 							sorter.originY = sorter.container.clientHeight - node.element.offsetTop + 35;

	// 		// 							sorter.originPosition = sorter.getPosition([placeholder]);
	// 		// 							sorter.lastPosition = sorter.originPosition;

	// 		// 						}




	// 		// 					};

	// 		// 					sorter.onSelect = elements => {

	// 		// 						elements.map(element => element.classList.add("selected"));

	// 		// 						this.setAbsoluteSelection(sorter.state.selection, ...sorter.state.path);

	// 		// 					}

	// 		// 					sorter.onUnselect = elements => {

	// 		// 						elements.map(element => element.classList.remove("selected"));

	// 		// 					}

	// 		// 					sorter.onSwap = (newState, lastState) => {

	// 		// 						this.swap(lastState.selection.index, newState.selection.index, newState.selection.length, lastState.path, newState.path);

	// 		// 					};

	// 		// 					sorter.onSort = (newState, lastState) => {

	// 		// 						this.deferFocus();
	// 		// 						this.save("order");
	// 		// 						this.render();

	// 		// 					}


	// 		// 					node.children = this.resource.library.map(resource => {
	// 		// 						return {
	// 		// 							class: "library-tile",
	// 		// 							children: [
	// 		// 								{
	// 		// 									class: "block-icon dashicons dashicons-block-default"
	// 		// 								},
	// 		// 								{
	// 		// 									class: "title",
	// 		// 									update: tile => {
	// 		// 										tile.element.innerHTML = resource.label;
	// 		// 									}
	// 		// 								}
	// 		// 							]
	// 		// 						};
	// 		// 					});


	// 		// 				}
	// 		// 			}
	// 		// 		];

	// 		// 	}


	// 		// }
	// 	};
	// }

}



KarmaFieldsAlpha.field.block = class extends KarmaFieldsAlpha.field {

  // import(items) {

  //   const string = items.shift();

  //   const grid = new KarmaFieldsAlpha.Grid(string);
  //   const values = grid.getColumn(0);

  //   // const ids = [...KarmaFieldsAlpha.Type.toArray(this.getValue())];
  //   //
  //   // ids.splice(index, length, ...newIds);
  //   //
  //   // this.setValue(ids);


  //   this.setBlockValue(clone);

  // }



	getValue(key) {

		const values = this.parent.getValue();

		if (values === undefined) {

			return;

		}

		const object = values[this.resource.index] || {};

		return object[key] || [];

	}

	setValue(value, key) {

		const values = this.parent.getValue();

		if (values === undefined) {

			console.error("setting value but value is not loaded");

		}

		values = [...values];
		values[this.resource.index] = { ...values[this.resource.index], [key]: value }

		this.setValue(values);

	}

	// getSelection

	isSelected(index) {

		const selection = this.parent.isSelectedAt(this.index);

		if (selection && !selection.child) {

			return KarmaFieldsAlpha.Segment.contain(selection, index);

		}

		return false;

	}

	newChild(index) {

		if (index === "media") {


			if (this.resource.media) {

				return new KarmaFieldsAlpha.field.media({
					display: "thumb",
					caption: this.resource.name,
					...this.resource.media
				}, "media", this);

			}

		} else {

			const child = this.resource.children[index];

			if (child) {

				return new KarmaFieldsAlpha.field.block(child, index, this);

			}

		}

	}

	*buildChildren() {

		if (this.resource.children) {

			for (let i = 0; i < this.resource.children.length; i++) {

				const block = this.getChild(i);

				if (block) {

					yield {
						tag: "li",
						class: "frame",
						children: block.build(),
						update: element => {
							element.classList.toggle("selected", this.isSelectedAt(i) && this.hasFocus());
							element.ondblclick = event => {
								this.save("open");
								this.open();
								this.render();
							}
						}
					};

				}

			}

		}



		// const item = this.getValue();

		// for (let i = 0; i < item.children.length; i++) {

		// 	const child = item.children[i];

		// 	const resource = this.resource.footer.find(block => block.id === child.type);

		// 	const block = new KarmaFieldsAlpha.field.block({
		// 		children: child.children,
		// 		...resource
		// 	}, i, this);

		// 	yield {
		// 		tag: "li",
		// 		children: block.build()
		// 	};

		// }

	}

	*buildMedia() {

		const mediaField = this.getChild("media");

		if (mediaField) {

			yield* mediaField.build();

		}

	}

	*build() {

		yield {
			class: "media",
			children: this.buildMedia(),
			// update: element => {
			// 	element.classList.toggle("hidden", !this.resource.media);
			// }
		};

		yield {
			tag: "ul",
			class: "children",
			children: this.buildChildren(),
			update: element => {

				// element.classList.toggle("hidden", !this.resource.children);


				if (this.resource.children && this.resource.children.length) {

					const selection = this.hasFocus() && this.getSelection();
					const sorter = new KarmaFieldsAlpha.ListSorterInline(element, selection);

					sorter.onSelect = elements => {
						elements.map(element => element.classList.add("selected"));
						this.setSelection(sorter.state.selection);
					}

					sorter.onUnselect = elements => {
						elements.map(element => element.classList.remove("selected"));
					}

					sorter.onSelectionComplete = () => {
						this.setFocus(true);
						this.render();
					}

					sorter.onSwap = (newState, lastState) => {
						this.save("reorder");
						this.swapAt(lastState.selection.index, newState.selection.index, newState.selection.length);
						this.setSelection(newState.selection);
					};

					sorter.onSort = (newSelection, lastSelection) => {
						if (!KarmaFieldsAlpha.Collection.equal(newSelection, lastSelection)) {
							this.setFocus(true);
							this.render();
						}
					}

				}


			}
		};


		// yield {
		// 	tag: "li",
		// 	update: element => {
		// 		element.classList.toggle("selected", this.isSelected());
		// 	},
		// 	children: [
		// 		{
		// 			class: "media",
		// 			children: this.buildMedia(),
		// 			update: element => {
		// 				element.classList.toggle("hidden", !this.resource.media);
		// 			}
		// 		},
		// 		{
		// 			tag: "ul",
		// 			class: "children",
		// 			children: this.buildChildren(),
		// 			update: element => {
		// 				element.classList.toggle("hidden", !this.resource.children);
		// 			}
		// 		}
		// 	]
		// };

		// const item = this.getValue();

		// if (item) {

		// 	const block = this.resource.footer.find(block => block.id === item.type);

		// 	if (block) {

		// 		if (item.type === "group") {

		// 			yield {
		// 				tag: "li",
		// 				children: [
		// 					{
		// 						tag: "ul",
		// 						children: this.buildChildren(item.children)
		// 					}
		// 				]
		// 			};

		// 		}

		// 		if (this.resource.media) {

		// 		// for (let i = 0; i < this.resource.fields.length; i++) {

		// 		// 	const resource = this.resource.fields[i];

		// 			const mediaField = this.createChild({
		// 				type: "media",
		// 				...this.resource.media
		// 			}, i);

		// 			// yield {
		// 			// 	tag: "li",
		// 			// 	children: mediaField.build(),
		// 			// 	update: element => {
		// 			// 		element.classList.toggle("selected", this.isSelected());
		// 			// 	}
		// 			// };

		// 			yield {
		// 				tag: "li",
		// 				update: element => {
		// 					element.classList.toggle("selected", this.isSelected());
		// 				},
		// 				children: [
		// 					{
		// 						class: "media",
		// 						children: this.buildMedia(),
		// 						update: element => {
		// 							element.classList.toggle("hidden", !this.resource.media);
		// 						}
		// 					},
		// 					{
		// 						tag: "ul",
		// 						class: "children",
		// 						children: this.buildChildren(),
		// 						update: element => {
		// 							element.classList.toggle("hidden", !this.resource.children);
		// 						}
		// 					}
		// 				]
		// 			};

		// 		}

		// 	}

		// }



	}

	// *build() {

	// 	yield {
	// 		tag: "ul",
	// 		class: "block",
	// 		children: this.buildFields()
	// 	};

	// }

	// *buildBlock() {

	// 	yield {
	// 		tag: "ul",
	// 		class: "block",
	// 		children: this.buildBlockFields(),
	// 		update: element => {

	// 			const selection = this.getSelection();

	// 			const sorter = new KarmaFieldsAlpha.ListSorterInline(element, selection);

	// 			sorter.onSelect = elements => {
	// 				elements.map(element => element.classList.add("selected"));
	// 				this.setSocketSelection(sorter.state.selection);
	// 			}

	// 			sorter.onUnselect = elements => {
	// 				elements.map(element => element.classList.remove("selected"));
	// 			}

	// 			sorter.onSelectionComplete = () => {
	// 				this.setFocus(true);
	// 				 this.render();
	// 			}

	// 			sorter.onSwap = (newState, lastState) => {
	// 				this.save("reorder");
	// 				this.swapAt(lastState.selection.index, newState.selection.index, newState.selection.length);
	// 				this.setSocketSelection(newState.selection);
	// 			};

	// 			sorter.onSort = (newSelection, lastSelection) => {
	// 				if (!KarmaFieldsAlpha.Collection.equal(newSelection, lastSelection)) {
	// 					this.setFocus(true);
	// 					this.render();
	// 				}
	// 			}

	// 		}
	// 	}

	// }



  // setSelection(selection) {
  //
  //   // this.parent.setSelection(selection && {
  //   //   [this.resource.index]: selection,
  //   //   index: this.resource.index,
  //   //   length: 0
  //   // });
  //
  //
  //
  // }

//   getSelectionChild(selection = this.getSelection()) {
// console.error("deprecated");
//     if (selection) {




//       // for (let i = 0; i < children.length; i++) {
//       //
//       //   if (selection[i]) {
//       //
//       //     return this.createChild({
//       //       value: children[i],
//       //       index: i,
//       //       type: children[i].type
//       //     });
//       //
//       //   }
//       //
//       // }

//       const index = selection.index || 0;

//       if (!selection.length && selection[index] && this.resource.children[index]) {

//         const resource = this.resource.children[index];

//         return this.createChild({
//           ...resource,
//           index: index
//         });

//       }

//     }

//   }

//   getChild(index) {

//     if (this.resource.children && this.resource.children[index]) {

//       return this.createChild({
//         ...this.resource.children[index],
//         index: index
//       });

//     }

//     // const child = this.resource.children && this.resource.children[index];
//     //
//     // if (child) {
//     //
//     //   // const resource = value.children && value.children[index];
//     //   //
//     //   // if (resource) {
//     //
//     //     return this.createChild({
//     //       // ...resource,
//     //       // value: value.children[index],
//     //       ...child,
//     //       index: index,
//     //       path: [...this.resource.path, index],
//     //       selection: this.resource.selection && this.resource.selection[index]
//     //     });
//     //
//     //   // }
//     //
//     // }


//   }

  // paste(string, selection = this.getSelection()) { // -> same as base method

  //   if (selection) {

  //     if (!selection.child) {

  //       this.import([string]);

  //     } else {

  //       super.paste(string, selection);

  //     }

  //   }

  // }

  // setAbsoluteSelection(selection, ...path) {

  //   this.parent.setAbsoluteSelection(selection, ...path);

  // }



  // buildContent() {

  //   return this.resource.children.map((resource, index) => {
  //     return this.createChild({
  //       ...resource,
  //       index: index
  //     }).build()
  //   });

  // }


  // build() {

  //   return {
  //     class: "block",
  //     init: node => {
  //       if (this.resource.class) {
  //         node.element.classList.add(this.resource.class);
  //       }
  //     },
  //     update: node => {
  //       const isSelected = this.isSelected(this.resource.index);
  //       node.element.classList.toggle("selected", Boolean(isSelected));
  //     },
  //     children: [
  //       {
  //         class: "block-header",
  //         children: [
  //           {
  //             class: "block-title",
  //             update: node => {
  //               node.element.innerHTML = this.resource.title || "Block";
  //             }
  //           },
  //           {
  //             class: "block-icon dashicons dashicons-block-default"
  //           }
  //         ]
  //       },
  //       {
  //         class: "block-body",
  //         children: this.buildContent()
  //       }
  //     ]
  //   };

  // }

}


// KarmaFieldsAlpha.field.blocks.inputBlock = class extends KarmaFieldsAlpha.field.blockEditor.block {

// 	constructor(resource, id, parent) {

// 		super({
// 			children: [
// 				{
// 					label: "Label",
// 					type: "input",
// 					key: "label"
// 				},
// 				{
// 					label: "Key",
// 					type: "input",
// 					key: "key"
// 				},
// 				{
// 					label: "Key",
// 					type: "input",
// 					key: "key"
// 				},
// 				{
// 					label: "Placeholder",
// 					type: "input",
// 					key: "placeholder"
// 				},
// 				{
// 					label: "Read Only",
// 					type: "checkbox",
// 					key: "readonly"
// 				},
// 				{
// 					label: "Disabled",
// 					type: "input",
// 					key: "disabled",
// 					expression: true
// 				},
// 				{
// 					label: "Enabled",
// 					type: "input",
// 					key: "enabled",
// 					expression: true
// 				}
// 			],
// 			...resource
// 		}, id, parent);
// 	}

// }



// KarmaFieldsAlpha.field.blockEditor.blockGallery = class extends KarmaFieldsAlpha.field.blockEditor.block {

//   constructor(resource) {

//     super({
//       ...resource,
//       title: "Gallery",
//       class: "files-block",
//       children: [
//         {
//           type: "files",
//           key: "files",
//           uploader: "wp",
//           controls: false
//         }
//       ]
//     });
//   }

// }

// KarmaFieldsAlpha.field.blockEditor.blockTinymce = class extends KarmaFieldsAlpha.field.blockEditor.block {

//   constructor(resource) {

//     super({
//       ...resource,
//       title: "Rich Text",
//       class: "tinymce-block",
//       children: [
//         {
//           type: "tinymce",
//           key: "content"
//         }
//       ]
//     });
//   }

// }


// KarmaFieldsAlpha.field.blockEditor.columns = class extends KarmaFieldsAlpha.field.blockEditor.block {

//   constructor(resource) {

//     super({
//       title: "Group",
//       class: "block-group",
//       ...resource
//     });

//   }

//   addValue(value) {

//     const children = this.getValue("children");

//     this.setValue([...children, value], "children");

//     this.render();

//   }




//   swap(index, newIndex, length, path, newPath) {

//     this.parent.swap(index, newIndex, length, path, newPath);

//   }

//   remove(index, length, ...path) {

//     this.parent.remove(index, length, this.resource.index, ...path);

//   }

//   delete(selection = this.getSelection()) {

//     // if (selection && !selection[selection.index]) {
//     //
//     //   this.remove(selection.index || 0, selection.length || 0);
//     //
//     // } else {
//     //
//     //   super.delete(selection);
//     //
//     // }

//     if (selection) {

//       if (!selection.child) {

//         this.remove(selection.index || 0, selection.length || 0);

//       } else {

//         super.delete(selection);

//       }

//     }

//   }

//   getChild(index) {

//     const resource = this.resource.value && this.resource.value.children && this.resource.value.children[index];

//     if (resource) {

//       return this.createChild({
//         ...resource, // type + children
//         type: "column",
//         depth: (this.resource.depth || 0) + 1,
//         index: index,
//         path: [...this.resource.path, this.resource.index],
//         value: resource.value,

//         selection: this.resource.selection && this.resource.child

//       });

//     }



//   }

//   getSelectionChild(selection = this.getSelection()) {
//     console.error("deprecated");
//     if (selection) {

//       const index = selection.index || 0;

//       if (!selection.length && selection[index]) {

//         const value = this.getBlockValue() || {};
//         const children = value.children || [];

//         return this.createChild({
//           value: children[index],
//           index: selection.index,
//           type: children[index].type
//         });

//       }

//     }

//   }



//   buildContent() {

//     return [{
//       tag: "ul",
//       class: "block-columns",

//       update: ul => {


//         // if (this.resource.children) {
//         if (this.resource.value && this.resource.value.children) {

//           ul.children = this.resource.value.children.map((child, index) => {

//             // const column = this.createChild({
//             //   type: "column",
//             //   value: child,
//             //   // ...child,
//             //   index: index,
//             //   path: [...this.resource.path, this.resource.index],
//             //   selection: this.resource.selection && this.resource.selection[index]
//             // });

//             const column = this.getChild(index);

//             return column.build();

//           });

//         }

//       }
//     }];
//   }

//   // build() {
//   //
//   //   return {
//   //     class: "block block-group",
//   //     children: [
//   //       {
//   //         class: "block-header",
//   //         children: [
//   //           {
//   //             class: "block-title",
//   //             update: node => {
//   //               node.element.innerHTML = "Group";
//   //             }
//   //           },
//   //           {
//   //             class: "block-icon dashicons dashicons-block-default"
//   //           }
//   //         ]
//   //       },
//   //       {
//   //         class: "block-body",
//   //         child: {
//   //           tag: "ul",
//   //           class: "block-columns fork",
//   //           init: ul => {
//   //             if (this.resource.classes) {
//   //               ul.element.classList.add(...this.resource.classes);
//   //             }
//   //           },
//   //           update: ul => {
//   //             ul.element.classList.toggle("selected", Boolean(this.resource.selected));
//   //
//   //             const value = this.getBlockValue() || {};
//   //             const children = value.children || [];
//   //
//   //             if (children && children !== KarmaFieldsAlpha.loading) {
//   //
//   //               ul.children = children.map((child, index) => {
//   //
//   //                 const column = this.createChild({
//   //                   type: "column",
//   //                   // children: child.children,
//   //                   value: child,
//   //                   index: index,
//   //                   path: [...this.resource.path, this.resource.index],
//   //                 });
//   //
//   //                 return column.build();
//   //
//   //               });
//   //
//   //             }
//   //
//   //           }
//   //         }
//   //       }
//   //     ]
//   //   };
//   //
//   // }

// }



// KarmaFieldsAlpha.field.blockEditor.column = class extends KarmaFieldsAlpha.field.blockEditor.columns {

//   // getLength() {
//   //
//   //   if (this.resource.value && this.resource.value.children) {
//   //
//   //     return this.resource.value.children.length;
//   //
//   //   }
//   //
//   //   return 0;
//   // }

//   // getLength() {
//   //
//   //   return this.parent.getLength(this.resource.index);
//   //
//   //   return this.getValue("children").length;
//   // }

//   // getValue(...path) {
//   //
//   //   return this.parent.getValue(this.resource.index, ...path);
//   // }



//   // setValue(value, index) {
//   //
//   //   const clone = KarmaFieldsAlpha.DeepArray.cloneObject(this.resource.value || {});
//   //
//   //   if (!clone.children) {
//   //
//   //     clone.children = [];
//   //
//   //   }
//   //
//   //   clone.children[index] = value;
//   //
//   //   this.parent.setValue(clone, this.resource.index);
//   //
//   // }

//   // setValue(value, ...path) {
//   //
//   //   this.parent.setValue(value, this.resource.index, ...path);
//   //
//   // }

//   getChild(index) {

//     const resource = this.resource.children && this.resource.children[index];

//     if (resource) {

//       return this.createChild({
//         // type: "block",
//         ...resource, // type + children
//         depth: (this.resource.depth || 0) + 1,
//         index: index,
//         path: [...this.resource.path, this.resource.index],
//         value: resource,



//         selection: this.resource.selection && this.resource.selection.child
//         // children: child.children,
//         // values: child.children,
//         // selected: this.isSelected(index, selection)
//       });

//     }

//   }

//   copy(selection = this.getSelection()) {

//     // if (selection && !selection[selection.index]) {
//     //
//     //   const [value] = this.export([], selection.index || 0, selection.length || 0);
//     //
//     //   return value;
//     //
//     // } else {
//     //
//     //   return super.copy(selection);
//     //
//     // }

//     if (selection && !selection.child) {

//       const [value] = this.export([], selection.index || 0, selection.length || 0);

//       return value;

//     } else {

//       return super.copy(selection);

//     }

//   }

//   paste(string, selection = this.getSelection()) { // -> same as base method

//     // if (selection && !selection[selection.index]) {
//     //
//     //   this.import([string], selection.index || 0, selection.length);
//     //
//     // } else {
//     //
//     //   return super.paste(string, selection);
//     //
//     // }



//     if (selection && !selection.child) {

//       this.import([string], selection.index || 0, selection.length);

//     } else {

//       return super.paste(string, selection);

//     }


//   }

//   export(items = [], index = 0, length = 999999) {

//     const value = this.getBlockValue() || {};
//     let values = value.children || [];

//     values = values.slice(index, index + length);
//     values = values.map(value => JSON.stringify(value));

//     const grid = new KarmaFieldsAlpha.Grid();
//     grid.addColumn(values);

//     items.push(grid.toString());

//     return items;

// 	}

//   import(items, index = 0, length = 999999) {

//     const string = items.shift();

//     const grid = new KarmaFieldsAlpha.Grid(string);
//     let values = grid.getColumn(0);

//     values = values.map(value => JSON.parse(value));

//     if (values.some(value => typeof value !== "object")) {

//       // -> ?

//     } else {

//       // const newValues = [...this.getValue()];

//       let value = this.getBlockValue() || {};

//       value = KarmaFieldsAlpha.DeepObject.clone(value);

//       value.chilren = (value.children || []).splice(index, length, ...values);

//       this.setBlockValue(value);

//     }

// 	}



//   build() {

//     return {
//       tag: "li",
//       class: "block-branch dropzone block-column",
//       init: li => {
//         if (this.resource.classes) {
//           li.element.classList.add(...this.resource.classes);
//         }
//       },
//       update: li => {
//         // const value = this.resource.value || {};
//         // const children = value.children || [];


//         // const children = this.getValue();

//         // const value = this.getBlockValue() || {};
//         // const value = this.resource.value || {};
//         // const children = value.children || [];
//         //
//         //
//         // // console.log(children, value, this.resource.value);
//         //
//         // if (!children || children === KarmaFieldsAlpha.loading) {
//         //
//         //   return;
//         //
//         // }

//         li.element.style.height = "auto";
//         const path = this.resource.path || [];

//         let selection = this.getSelection();

//         // const sorter = new KarmaFieldsAlpha.BlockSorter(li.element);


//         // sorter.colCount = 1;
//         // sorter.rowCount = children.length;
//         // sorter.currentSelection = selection;
//         // sorter.selection = selection;
//         // sorter.path = [...path, this.resource.index];
//         // sorter.maxDepth = 10000;
//         //
//         // sorter.onselect = newSelection => {
//         //   this.setSelection(newSelection);
//         //   // KarmaFieldsAlpha.Clipboard.focus();
//         //   this.deferFocus();
//         //   this.save("nav");
//         //   this.render();
//         // }
//         //
//         // sorter.onsort = (index, newIndex, length, path, newPath) => {
//         //   this.parent.request("completeSwap");
//         //   // KarmaFieldsAlpha.Clipboard.focus();
//         //   this.deferFocus();
//         //   this.save("swap");
//         //   this.render();
//         // }
//         //
//         // sorter.onSwap = (index, newIndex, length, path, newPath) => {
//         //   this.swap(index, newIndex, length, path, newPath); // -> will render.
//         // }
//         //
//         // sorter.onSelectionChange = newSelection => {
//         //   this.setSelection(newSelection);
//         // }
//         //
//         // sorter.onPaintRow = elements => {
//         //   elements.forEach(element => element.classList.add("selected"))
//         // }
//         //
//         // sorter.onUnpaintRow = elements => {
//         //   elements.forEach(element => element.classList.remove("selected"))
//         // }


//         const sorter = new KarmaFieldsAlpha.ListSortBlock(li.element, selection, ...path, this.resource.index);

//         sorter.onSelect = elements => {

//           elements.map(element => element.classList.add("selected"));

//           this.setAbsoluteSelection(sorter.state.selection, ...sorter.state.path);

//         }

//         sorter.onUnselect = elements => {

//           elements.map(element => element.classList.remove("selected"));

//         }

//         sorter.onSelectionComplete = () => {

//           this.deferFocus();
//           this.render();

//         }

//         sorter.onSwap = (newState, lastState) => {

//           this.swap(lastState.selection.index, newState.selection.index, newState.selection.length, lastState.path, newState.path);

//         };

//         sorter.onSort = (newState, lastState) => {

//           this.deferFocus();
//           this.save("order");
//           this.render();

//         }



//         const children = this.resource.children || [];

//         li.children = children.map((child, index) => {
//           // const column = this.createChild({
//           //   type: child.type,
//           //   depth: (this.resource.depth || 0) + 1,
//           //   index: index,
//           //   path: [...this.resource.path, this.resource.index],
//           //   value: child,
//           //
//           //   // ...child, // -> type + children
//           //
//           //
//           //   selection: this.resource.selection && this.resource.selection[index]
//           // });

//           const column = this.getChild(index);

//           return column.build();

//           // return {
//           //   tag: "li",
//           //   class: "block-frame",
//           //   update: li => {
//           //
//           //     const isSelected = this.isSelected(selection, index);
//           //
//           //
//           //     li.element.classList.toggle("selected", Boolean(isSelected));
//           //   },
//           //   child: branch.build()
//           // };
//         });
//       }
//     };
//   }

// }

// KarmaFieldsAlpha.field.blockEditor.branch = class extends KarmaFieldsAlpha.field.blockEditor.column {}; // compat

// KarmaFieldsAlpha.field.blockEditor.test = class extends KarmaFieldsAlpha.field {

//   build() {
//     return {
//       class: "test-block block",
//       update: node => {
//         node.element.classList.toggle("selected", Boolean(this.resource.selected));

//         node.element.innerHTML = this.resource.value || "0";
//       }
//     };
//   }

// }
