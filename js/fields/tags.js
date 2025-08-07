
KarmaFieldsAlpha.field.tags = class extends KarmaFieldsAlpha.field.container {

  getBody() {

    return new KarmaFieldsAlpha.field.tagsList(this.resource, "body", this);

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

		} else {

			return super.newChild(index);

		}

	}

	add() { // called when pasting items


	}


  getTable() {

    return this.parse(this.resource.table);

  }

	// getParams() {

	// 	return this.parseObject(this.resource.params);

	// 	// return this.parse(this.resource.params).toObject();

	// }



  // queryParams() {

  //   return this.parse(this.resource.params);

  // }

	getDriver() {

		if (this.resource.driver) {

			return this.resource.driver;

		} else {

			const table = this.resource.table;
			const resource = KarmaFieldsAlpha.saucer.resource.tables[table];

			if (resource) {

				return resource.driver;

			} else {

				console.error("Table resource not found:", table);

			}

		}

	}

	// hasSelection() { // deprec

	// 	const body = this.getBody();

	// 	if (body && body.hasSelection) {

	// 		return body.hasSelection();

	// 	}

	// 	return false;

	// }

	// async open() {

	// 	// const content = this.getContent();
	// 	//
	// 	// if (content.loading) {
	// 	//
	// 	//   this.addTask(() => add(), "add");
	// 	//
	// 	//   this.request("render");
	// 	//
	// 	// } else {
	// 	//
	// 	//
	// 	//
	// 	// }

	// 	let ids = this.getIds();

	// 	// while (ids.loading) {
	// 	//
	// 	//   await this.render();
	// 	//   ids = this.getIds();
	// 	//
	// 	// }

	// 	const length = ids.toArray().length;

	// 	await this.setSelection({ index: length, length: 0 });

	// 	await this.edit();

	// }

	// query() {

	// 	const ids = this.getValue();

	// 	return { ids, count: ids.length };

	// }

	getValue(key, id) {

		if (key && id !== undefined) {

			const driver = this.getDriver();

			return super.getValue(key, id, driver);

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

	open() {

		this.edit([]);

	}

	edit(ids) { // -> ids used in files attacher in tinymce

		// this.save("edit", "Edit Tag"); // -> to be moved?

		const popup = this.getChild("popup");

		popup.setFocus(true);

		if (!ids) {

			ids = this.getSelectedIds();

		}

		if (ids.length) {

			popup.selectByIds(ids);

		}

	}

	close() {

		this.setFocus(true);

		// this.render(); // -> to be moved?

	}

	canDrop() {

		return true;

	}


 //  async insert(ids, index = undefined, length = undefined) {

 //    let content = this.getIds();

 //    while (content.loading) {

 //      await this.render();
 //      content = this.getIds();

 //    }

 //    if (index === undefined && length === undefined) {

 //      const selection = this.getSelection();

 //      // this would delete selected items and replace by new items:
 //      // index = selection.index || content.toArray().length;
 //      // length = selection.length || 0;

 //      // this insert new items before selected items:
 //      if (selection.length) {

 //        index = selection.index;
 //        length = 0;

 //      } else {

 //        index = content.toArray().length;
 //        length = 0;

 //      }

 //    }

 //    const newIds = [...content.toArray()];
 //    newIds.splice(index, length, ...ids);

 //    await this.setIds(newIds);
 //    await this.setFocus(true);

	// }

	// getValue(key) {

	// 	if (!key) {

	// 		key = this.getKey();

	// 	}

	// 	return this.parent.getValue(key);

	// }

	// setValue(value, key) {

	// 	if (!key) {

	// 		key = this.getKey();

	// 	}

	// 	this.parent.setValue(value, key);

	// }


	insert(ids, index = undefined, length = undefined) {

		let values = this.getValue();

		if (values === undefined) {

			console.error("inserting ids but values are undefined");

		}

		// if (index === undefined && length === undefined) {

		// 	const selection = this.getSelection();

		// 	if (selection.length) {

		// 		index = selection.index;
		// 		length = 0;

		// 	} else {

		// 		index = content.toArray().length;
		// 		length = 0;

		// 	}

		// }


		this.setValue([...values, ...ids]); // -> always insert at the end?
		this.setFocus(true);

	}

 //  getDefault() {

 //    return this.parse(this.resource.default);

	// }

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

  // querySelectedIds() {

  //   const response = new KarmaFieldsAlpha.Content();

  //   const selection = this.getSelection();

  //   if (selection.loading) {

  //     response.loading = true;

  //   } else {

  //     const index = selection.toObject().index || 0;
  //     const length = selection.toObject().length || 0;

  //     if (length) {

  //       const ids = this.getIds();

  //       if (ids.loading) {

  //         response.loading = true;

  //       } else {

  //         response.value = ids.toArray().slice(index, index + length);

  //       }

  //     }

  //   }

  //   return response;
  // }

  // getSelectedIds() {

  //   const selection = this.getSelection() || {};

  //   const index = selection.index || 0;
  //   const length = selection.length || 0;

  //   if (length) {

  //     return this.getIds().toArray().slice(index, index + length);

  //   }

  //   return [];
  // }

  // async swap(index, target, length) {

  //   if (target !== index) {

  //     const content = this.getIds();

  //     if (!content.loading) {

  //       const clones = [...content.toArray()];

  //       clones.splice(target, 0, ...clones.splice(index, length));

  //       await this.setIds(clones);

  //     }

  //   }

  // }

	setOrder(ids) {

		this.setValue(ids);

	}


  // queryLength() {

  //   const response = new KarmaFieldsAlpha.Content();
  //   const content = this.getIds();

  //   if (content.loading) {

  //     response.loading = true;

  //   } else {

  //     response.value = content.toArray().length;

  //   }

  //   return response;
  // }

  // getLength() {

  //   return this.getIds().toArray().length;

  // }

	// getIds() {

	// 	// const key = this.getKey();

	// 	// const content = this.parent.getContent(key);

	// 	// // content.value = content.toArray().filter(value => parseInt(value));

	// 	// return content;
	// 	//
	// 	return this.getValue();

	// }

	// setIds(ids) {

	// 	// const key = this.getKey();

	// 	// await this.parent.setValue(ids, key);

	// 	this.setValue(ids);

	// }

  // getContent(key) {

  //   return new KarmaFieldsAlpha.Content();

  // }

  // setValue(content, key) {

  //   // console.error("Value cannot be set!");

  // }

  // getContentAt(index, key) {

  //   const content = new KarmaFieldsAlpha.Content();
  //   const ids = this.getIds();

  //   if (ids.loading) {

  //     content.loading = true;

  //   } else {

  //     const id = ids.toArray()[index];

  //     if (id) {

  //       const driver = this.getDriver();

  //       return this.parent.getWild(driver, id, key)

  //       // return this.getContentById(id, key);

  //     } else {

  //       content.notFound = true;

  //     }

  //   }

  //   return content;

  // }

  // async setValueAt(value, index, key) {

  //   const ids = this.getIds();

  //   if (!ids.loading) {

  //     const newIds = [...ids.toArray()];

  //     newIds[index] = value;

  //     await this.setIds(newIds, key);

  //   }

  // }


	// paste(value) {

	// 	// const ids = value && value.split(",") || [];

	// 	// await this.save("paste", "Paste");

	// 	// this.insert(ids);
	// 	// const collection = new KarmaFieldsAlpha.Content([value]);
	// 	this.import(value);

	// 	// await this.request("render");

	// }

 //  copy() {

 //    const selection = this.getSelection();

 //    const index = selection.index || 0;
 //    const length = selection.length || 0;

 //    if (selection) {

 //      const content = this.export(index, length);

 //      return content.toString();

 //    }

 //  }

	addIds(...ids) { // -> to be called by parent

		this.insert(ids);

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

  //
  // remove(index = 0, length = 1) {
  //
  //   const content = this.getContent();
  //
  //   if (!content.loading && length > 0) {
  //
  //     KarmaFieldsAlpha.History.save("delete", "Delete");
  //
  //     if (content.mixed) {
  //
  //       const newContent = new KarmaFieldsAlpha.Content([]);
  //
  //       this.setContent(newContent);
  //
  //     } else {
  //
  //       const clones = [...content.toArray()];
  //
  //       clones.splice(index, length);
  //
  //       const newContent = new KarmaFieldsAlpha.Content(clones);
  //
  //       this.setContent(newContent);
  //
  //     }
  //
  //     this.removeSelection();
  //
  //     this.request("render");
  //
  //   }
  //
  // }

	getMax() {

		return this.resource.max || this.resource.single && 1 || 999999;

	}

	isSingle() {

		return this.getMax() === 1;

	}

  // getSelection(...path) {

  //   const body = this.getChild("body");

  //   if (body) {

  //     return body.querySelection();

  //   }

  // }

  // setSelection(selection, ...path) {

  //   const body = this.getChild("body");

  //   if (body) {

  //     return body.select(selection.index || 0, selection.length || 0);

  //   }

  // }

  // *buildControls() {
  //
  //   if (this.resource.controls !== false && !this.getIds().mixed) {
  //
  //     const controlsField = this.createChild({
  //       type: "controls",
  //       ...this.resource.controls
  //     }, "controls");
  //
  //     yield {
  //       class: "controls",
  //       update: controls => {
  //         controls.element.classList.toggle("hidden", this.resource.controls === false);
  //       },
  //       child: {
  //         class: "footer-content simple-buttons",
  //         update: controls => {
  //           if (this.resource.controls !== false && !this.getIds().mixed) {
  //             controls.child = controlsField.build();
  //           }
  //         }
  //       }
  //     };
  //
  //   }
  //
  // }

  // build() {
  //   return {
	// 		class: "karma-tags karma-field",
  //     update: container => {
  //       container.element.classList.toggle("single", this.isSingle());
  //     },
  //     children: [
  //       this.getChild("body").build(),
  //       ...this.buildControls(),
  //     ]
	// 	};
  //
  // }


  // *buildPart(part) {
  //
  //   if (part === "footer" && this.resource.footer) {
  //
  //     yield this.getChild("footer").build();
  //
  //   } else if (part === "body") {
  //
  //     yield this.getChild("body").build();
  //
  //   }
  //
  // }

  // *buildParts() {
  //
  //   if (this.resource.footer) {
  //
  //     yield this.getChild("footer").build();
  //
  //   }
  //
  //   yield this.getChild("body").build();
  //
  // }

  // buildPopup() {
  //
  //   return {
  //     class: "popup",
  //     child: {
  //       class: "popup-content",
  //       children: [
  //         {
  //           class: "navigation karma-field-frame",
  //           update: navigation => {
  //             navigation.element.classList.toggle("hidden", !this.resource.navigation);
  //           },
  //           children: [...this.buildNavigation()]
  //         },
  //         {
  //           class: "tables",
  //           children: [...this.buildPopups()]
  //         }
  //       ]
  //     }
  //   };
  //
  // }

  // *buildParts() {
  //
  //   yield* KarmaFieldsAlpha.field.table.prototype.buildParts.call(this);
  //
  //   // const hasPopup = this.getState("popup");
  //
  //   const hasPopup = this.hasFocusInside("popup");
  //
  //   // document.body.classList.toggle("karma-table-open", Boolean(hasPopup));
  //
  //   if (hasPopup) {
  //
  //     // const tableResource = KarmaFieldsAlpha.tables[this.resource.table];
  //     //
  //     // const popup = new KarmaFieldsAlpha.field.table(tableResource, this.resource.table, this);
  //
  //     const popup = this.getChild("popup");
  //
  //     yield {
  //       class: "popup",
  //       update: node => {
  //         // node.element.onmousedown = event => {
  //         //   event.stopPropagation();
  //         //   const body = popup.getChild("body");
  //         //   if (body) {
  //         //     body.setFocus(true);
  //         //     if (body.select) body.select(0, 0); // !!
  //         //     this.render();
  //         //   }
  //         // }
  //       },
  //       child: {
  //         class: "popup-content",
  //         children: [
  //           popup.build()
  //           // {
  //           //   class: "navigation karma-field-frame",
  //           //   update: navigation => {
  //           //     navigation.element.classList.toggle("hidden", !this.resource.navigation);
  //           //   },
  //           //   children: [...this.buildNavigation()]
  //           // },
  //           // {
  //           //   class: "tables",
  //           //   children: [
  //           //     {
  //           //       class: "table-container",
  //           //       children: [popup.build()]
  //           //     }
  //           //   ]
  //           // }
  //         ]
  //       }
  //     };
  //
  //
  //   }
  //
  // }


	// abduct() {

	// }

	*buildPopup() {

		const popup = this.getChild("popup");
		const hasPopup = popup && popup.hasFocusInside();

		if (hasPopup) {

			yield {
				class: "popup",
				child: {
					class: "popup-content",
					children: popup.build()
				}
			};

		}

	}

  *buildContent() {

		yield* super.buildContent();

    yield* this.buildPopup();

	}


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

		}

	}

	// getValue(key) {

	// 	return this.parent.getValue(key, this.resource.id);

	// }

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




  // getLength() {

  //   return this.parent.getLength();
  // }

  // select(index = 0, length = 0) {

  //   return this.setSelection({index, length});

  // }

  // unselect() { // to be overrided (ie. Medias grid)

  //   return this.removeSelection();

  // }

  // querySelection() { // to be overrided (ie. Medias grid)

  //   return this.getSelection();

  // }

	*buildChildren() {


		const mixed = this.isMixed();
		// const selection = this.getSelection();
		// const length = this.getLength();
		const hasFocus = this.hasFocus();

		// const selection = this.getSelection();
		// // const ids = this.getContent();
		// const length = this.parent.getLength();

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

			const ids = this.parent.getIds();

			if (ids !== undefined) {

				for (let i = 0; i < ids.length; i++) {

					yield {
						tag: "li",
						update: element => {
							element.classList.toggle("selected", this.isSelectedAt(i) && hasFocus);
							element.ondblclick = event => {
								this.save("edit", "Edit Tag");
								this.parent.edit([ids[i]]);
								this.render();
							}
						},
						children: [
							{
								tag: "span",
								update: element => {
									const driver = this.getDriver();
									const name = this.getValue("name", ids[i], driver);
									if (name) {
										element.innerHTML = name[0] || "";
									}
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
										this.request("delete", ids[i]);
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

	// *buildUl() {


	// 	// const length = this.parent.getLength();
	// 	// const hasFocus = this.hasFocus();

	// 	const ids = this.getIds();

	// 	if (ids && ids.length) {
	// 		yield {
	// 			tag: "ul",
	// 			// complete: element => {
	// 			//   element.classList.toggle("hidden", !element.hasChildNodes());
	// 			// },
	// 			update: element => {



	// 				// const ids = this.getContent().toArray();

	// 				// let selection = this.getSelection();

	// 				const selection = this.getSelection();

	// 				const sorter = new KarmaFieldsAlpha.ListSorterInline(element, selection);

	// 				sorter.onSelect = elements => {



	// 					elements.map(element => element.classList.add("selected"));
	// 					this.setSelection(sorter.state.selection);
	// 				}

	// 				sorter.onUnselect = elements => {
	// 					elements.map(element => element.classList.remove("selected"));
	// 				}

	// 				sorter.onSelectionComplete = () => {
	// 					// this.request("deferFocus");
	// 					if (!this.hasFocus()) {
	// 						this.setFocus(true);
	// 						this.render();
	// 					}
	// 				}

	// 				sorter.onSwap = (newState, lastState) => {

	// 					this.swapAt(lastState.selection.index, newState.selection.index, newState.selection.length);
	// 					this.setSelection(newState.selection);

	// 				};

	// 				// sorter.onSort = async (index, target, length) => {
	// 				//
	// 				//   await KarmaFieldsAlpha.History.save("order", "Reorder");
	// 				//   await this.setFocus(true);
	// 				//   await this.request("render");
	// 				//
	// 				// }

	// 				sorter.onSort = (newSelection, lastSelection) => {
	// 					if (KarmaFieldsAlpha.DeepObject.differ(newSelection, lastSelection)) {
	// 						this.save("reorder", "reorder tags");
	// 						this.setFocus(true);
	// 						this.render();
	// 					}
	// 				}






	// 				// ul.children = [...this.buildChildren(selection, length, hasFocus)];

	// 			},
	// 			children: this.buildChildren()
	// 		};
	// 	}


	// }

	// *buildControls() {

	// 	if (this.resource.controls !== false && !this.isMixed()) {

	// 		// const controlsField = this.createChild({
	// 		//   type: "controls",
	// 		//   ...this.resource.controls
	// 		// }, "controls");


	// 		yield {
	// 			class: "controls",
	// 			// update: controls => {
	// 			//   controls.element.classList.toggle("hidden", this.resource.controls === false);
	// 			// },
	// 			child: {
	// 				class: "footer-content simple-buttons",
	// 				children: this.getChild("add").build()
	// 				// update: controls => {
	// 				//   if (this.resource.controls !== false && !this.getIds().mixed) {
	// 				//     controls.child = controlsField.build();
	// 				//   }
	// 				// }
	// 			}
	// 		};

	// 	}

	// }

	*buildContent() {

		// yield* this.buildUl();




		yield {
			tag: "ul",
			// complete: element => {
			//   element.classList.toggle("hidden", !element.hasChildNodes());
			// },
			update: element => {

				const ids = this.getIds();

				element.classList.toggle("hidden", !ids || ids.length === 0);

				// const ids = this.getContent().toArray();

				// let selection = this.getSelection();

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

				// sorter.onSort = async (index, target, length) => {
				//
				//   await KarmaFieldsAlpha.History.save("order", "Reorder");
				//   await this.setFocus(true);
				//   await this.request("render");
				//
				// }

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




				// ul.children = [...this.buildChildren(selection, length, hasFocus)];

			},
			children: this.buildChildren()
		};

		if (this.resource.controls !== false && !this.isMixed()) {

			// const controlsField = this.createChild({
			//   type: "controls",
			//   ...this.resource.controls
			// }, "controls");


			const addButton = new KarmaFieldsAlpha.field.button({
				title: "Add",
				text: "Add",
				action: "open",
				save: "add-tag",
				hidden: [">=", ["getLength", ["getValue"]], ["request", "getMax"]]
			}, "add", this);


			yield {
				class: "controls",
				// update: controls => {
				//   controls.element.classList.toggle("hidden", this.resource.controls === false);
				// },
				child: {
					class: "footer-content simple-buttons",
					children: addButton.build()
					// update: controls => {
					//   if (this.resource.controls !== false && !this.getIds().mixed) {
					//     controls.child = controlsField.build();
					//   }
					// }
				}
			};

		}

	}

	*build() {
		yield {
			class: "karma-tags karma-field",
			children: this.buildContent()
			// : [
			// 	...this.buildUl(),
			// 	// this.getChild("body").build(),
			// 	...this.buildControls(),
			// ]
		};

	}


}
