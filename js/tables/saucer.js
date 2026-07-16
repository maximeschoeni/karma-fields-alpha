
KarmaFieldsAlpha.field.saucer = class extends KarmaFieldsAlpha.field {

	constructor(resource, id, parent) {


		super(resource, id, parent);

		// this.focusId = "";
		// this.clipboard = false;
		//
		// this.states = {};

		// KarmaFieldsAlpha.server = new KarmaFieldsAlpha.Server();

	}

  // useClipboard() {
  //
  //   return KarmaFieldsAlpha.server.queryState("fields", "", "clipboard") || false;
  //
  // }
  //
  // getFocus() {
  //
  //   return KarmaFieldsAlpha.server.queryState("fields", "", "focus") || "";
  //
  // }
  //
  // async setFocus(useClipboard, fieldId) {
  //
  //   await KarmaFieldsAlpha.server.setState(useClipboard, "fields", "", "clipboard");
  //   await KarmaFieldsAlpha.server.setState(fieldId, "fields", "", "focus");
  //
  //   // await KarmaFieldsAlpha.Database.States.set(fieldId, "internal", "fields", "", "focus");
  //   // await KarmaFieldsAlpha.Database.States.set(useClipboard, "internal", "fields", "", "clipboard");
  //   // await KarmaFieldsAlpha.History.write(fieldId, this.focusId, "internal", "fields", "", "focus"); // update history
  //   // await KarmaFieldsAlpha.History.write(useClipboard, this.clipboard, "internal", "fields", "", "focus"); // update history
  //   //
  //   // this.focusId = fieldId;
  //   // this.clipboard = useClipboard;
  //
  // }
  //
  // removeFocus() {
  //
  //   return this.setFocus(false, "");
  //
  // }
  //
  // // async initFocus() {
  // //
  // //   this.focusId = await KarmaFieldsAlpha.Database.States.get("internal", "fields", "", "focus");
  // //   this.clipboard = await KarmaFieldsAlpha.Database.States.get("internal", "fields", "", "clipboard");
  // //
  // // }
  //
  //
  // getState(key, fieldId) {
  //
  //   // return KarmaFieldsAlpha.DeepObject.get(this.states, fieldId, key);
  //   return KarmaFieldsAlpha.server.queryState("fields", fieldId, key);
  //
  // }
  //
  // setState(value, key, fieldId) {
  //
  //   // const current = KarmaFieldsAlpha.DeepObject.get(this.states, fieldId, key);
  //   //
  //   // await KarmaFieldsAlpha.Database.States.set(fieldId, "internal", "fields", fieldId, key);
  //   // await KarmaFieldsAlpha.History.write(useClipboard, current, "internal", "fields", fieldId, key); // update history
  //   //
  //   // KarmaFieldsAlpha.DeepObject.set(this.states, fieldId, key);
  //
  //   return KarmaFieldsAlpha.server.setState(value, "fields", fieldId, key);
  //
  // }

	doAction(action, ...args) {

		console.error("Action was not catched: ", action, ...args);

	}


	getValue(key) {

		const searchParams = new URLSearchParams(location.search);

		const value = searchParams.get(key) || "";

		return [value];

	}

	setValue(content, key) {

		// ?? what to do?

	}

	getFocusField() {

		const path = this.getFocusPath() || [];

		if (path.length) {

			return this.getChild(...path.slice(1));

		}

	}


  undo() {

    history.back();

  }

  redo() {

    history.forward();

  }

  hasUndo() {

    return KarmaFieldsAlpha.History.hasUndo();

  }

  hasRedo() {

    return KarmaFieldsAlpha.History.hasRedo();

  }

	newChild(index) {

		if (index === "board") {

			return this.createChild({
				type: "board"
				// tables: this.resource.tables // -> to be removed
			}, "board");

		} else {

			// if (KarmaFieldsAlpha.embeds[index]) {

			// 	return this.createChild(KarmaFieldsAlpha.embeds[index], index);

			// }

			if (KarmaFieldsAlpha.instances[index]) {

				const item = KarmaFieldsAlpha.instances[index];

				return this.createChild(item.resource, index);

			}

		}

	}


	// async abduct() {

	// 	const embeds = KarmaFieldsAlpha.embeds;

	// 	if (embeds) {

	// 		for (let index in embeds) {

	// 			const resource = embeds[index];

	// 			const element = document.getElementById(index);

	// 			const child = this.createChild(resource, index);

	// 			// await KarmaFieldsAlpha.build(child.build(), element, element.firstElementChild);
	// 			await abduct(element, child.build());
	// 		}

	// 		const focus = this.getFocus();

	// 		document.body.classList.toggle("karma-table-open", focus.includes("popup"));

	// 	}

	// }

	// async loop() {

	// 	if (KarmaFieldsAlpha.server.loading) {

	// 		return new Promise(resolve => void setTimeout(resolve, 500));

	// 	}

	// 	KarmaFieldsAlpha.server.loading = true;

	// 	// if (this.rendering) {

	// 	//   console.warn("Rendering under process!", this);

	// 	// }

	// 	// console.log("rendering");

	// 	// if (!this.rendering) {

	// 	// this.rendering = true;

	// 	// for (let index in KarmaFieldsAlpha.embeds) {
	// 	//   document.getElementById(index).classList.add("container-loading");
	// 	// }

	// 	document.body.classList.add("karma-field-loading");

	// 	await KarmaFieldsAlpha.server.init();

	// 	await this.abduct();

	// 	while (KarmaFieldsAlpha.server.hasOrder()) {

	// 		await KarmaFieldsAlpha.server.process();

	// 		await this.abduct();

	// 	}

	// 	// for (let index in KarmaFieldsAlpha.embeds) {
	// 	//   document.getElementById(index).classList.remove("container-loading");
	// 	// }

	// 	// this.rendering = false;

	// 	KarmaFieldsAlpha.server.loading = false;

	// 	document.body.classList.remove("karma-field-loading");

	// 	// } else {
	// 	//
	// 	//   console.warn("Rendering under process!", this);
	// 	//
	// 	// }

	// }



  // async *generator() {
  //
  //   let works = KarmaFieldsAlpha.Store.get("works");
  //
  //   for (work of works) {
  //
  //     yield* work;
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.remove("works");
  //
  // }

	// registerField(element, resource) {

	// 	const field = this.createChild(resource, this.fields.length);

	// 	this.fields.push({ element, field });

	// 	// await abduct(item.element, field.build());

	// }

	close() {

		this.parent.close();

	}

	async abduct() {

		for (let i = 0; i < KarmaFieldsAlpha.instances.length; i++) {

			const item = KarmaFieldsAlpha.instances[i];
			const field = this.createChild(item.resource, i);

			await abduct(item.element, field.build());

		}

	}

	// render() {

	// 	// const item = [];

	// 	// for (let i = 0; i < KarmaFieldsAlpha.instances.length; i++) {

	// 	// 	const field = this.createChild(KarmaFieldsAlpha.instances[i].resource, this.fields.length);

	// 	// 	item.push({ element: KarmaFieldsAlpha.instances[i].element, implants: field.build() });

	// 	// }

	// 	// return this.loop();
	// 	this.renderElement();

	// }



//   medias(...args) {
//
//     const mediaTableResource = this.resource.tables[KarmaFieldsAlpha.mediaTable];
// debugger;
//     if (mediaTableResource) {
//
//       const table = this.createChild({
//         ...mediaTableResource,
//         type: "table"
//       }, "medias");
//
//       table.body(...args);
//
//     }
//
//   }





  // isMediaTable(tableId) {
  //
  //   return this.resource.tables[tableId] && this.resource.tables[tableId].body && this.resource.tables[tableId].body.type === "medias";
  // }
  //
  // getMediaTable() {
  //
  //   for (let tableId in this.resource.tables) {
  //
  //     if (this.isMediaTable(tableId)) {
  //
  //       return tableId;
  //
  //     }
  //
  //   }
  //
  // }
  //
  // async upload(files, index = 0, length = 0) {
  //
  //
  //   let tableId = this.getTable();
  //
  //   if (!this.isMediaTable(tableId)) {
  //
  //     tableId = this.getMediaTable();
  //
  //     if (tableId) {
  //
  //       this.setTable(tableId);
  //
  //       await this.render();
  //
  //     }
  //
  //
  //   }
  //
  //   if (tableId) {
  //
  //     let grid = this.getGrid(tableId);
  //
  //     grid.upload(files);
  //
  //   } else {
  //
  //     console.warn("No medias table found to upload file");
  //
  //   }
  //
  // }



}


KarmaFieldsAlpha.field.saucer.clipboard = class extends KarmaFieldsAlpha.field {

	*build() {

		if (!document.getElementById("karmafieldsalpha-clipboard")) { // -> only once!

			yield {
				// class: "saucer",


				// init: element => {
				// 	element.id = "karmafieldsalpha-clipboard";
				// 	document.addEventListener("keydown", event => {
				// 		if (event.key === "s" && event.metaKey) {
				// 			event.preventDefault();
				// 			const field = this.getFocusField();
				// 			field.submit();
				// 			this.render();
				// 		} else if (event.key === "z" && event.metaKey) {
				// 			if (document.activeElement === document.body || document.activeElement === document.documentElement || document.activeElement.closest(".karma-fields")) {
				// 				event.preventDefault();
				// 				if (event.shiftKey) {
				// 					KarmaFieldsAlpha.History.redo();
				// 				} else {
				// 					KarmaFieldsAlpha.History.undo();
				// 				}
				// 			}
				// 		}
				// 	});
				// 	window.addEventListener("popstate", event => {
				// 		// KarmaFieldsAlpha.History.update();
				// 		this.render();
				// 	});

				// 	window.addEventListener("mousedown", event => {
				// 		const focus = this.getFocus();
				// 		if (focus) {
				// 			this.removeFocus();
				// 			this.render();
				// 		}
				// 	});
				// },
				// children: [
					// {
						class: "clipboard",
						tag: "textarea",
						init: element => {
							element.id = "karmafieldsalpha-clipboard";
							document.addEventListener("keydown", event => {
								if (event.key === "s" && event.metaKey) {
									event.preventDefault();
									const field = this.getFocusField();
									field.submit();
									this.render();
								} else if (event.key === "z" && event.metaKey) {
									if (document.activeElement === document.body || document.activeElement === document.documentElement || document.activeElement.closest(".karma-fields")) {
										event.preventDefault();
										if (event.shiftKey) {
											KarmaFieldsAlpha.History.redo();
										} else {
											KarmaFieldsAlpha.History.undo();
										}
									}
								}
							});
							window.addEventListener("popstate", event => {
								// KarmaFieldsAlpha.History.update();
								this.render();
							});

							window.addEventListener("mousedown", event => {
								const focus = this.getFocus();
								if (focus) {
									this.removeFocus();
									this.render();
								}
							});
						},
						update: element => {
							element.id = "karma-fields-alpha-clipboard";
							element.readOnly = true;
							const useClipboard = this.useClipboard();
							if (useClipboard) {
								element.focus({ preventScroll: true });
							}
							element.onkeydown = event => {
								if (event.key === "z" && event.metaKey) {
									event.preventDefault();
									if (event.shiftKey) {
										KarmaFieldsAlpha.History.redo();
									} else {
										KarmaFieldsAlpha.History.undo();
									}
								}
								if (event.key === "a" && event.metaKey) {
									event.preventDefault();
									const field = this.getFocusField();
									field.selectAll();
									this.render();
								}
								if (event.key === "Delete" || event.key === "Backspace") {
									event.preventDefault();
									const field = this.getFocusField();
									field.delete();
									this.render();
								} else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
									event.preventDefault();
								}

								if (event.key === " ") {

									const field = this.getFocusField();
									if (field) {
										field.open();
										this.render();
										event.preventDefault();
									}
								}
							}

							element.onpaste = event => {
								event.preventDefault();
								const string = event.clipboardData.getData("text/plain").normalize();
								console.log("PASTE", string);
								const field = this.getFocusField();
								field.paste(string);
								this.render();
							}

							element.oncut = event => {
								event.preventDefault();
								const field = this.getFocusField();
								const value = field.copy();
								console.log("CUT", value);
								event.clipboardData.setData("text/plain", value || "");
								field.paste("");
								this.render();
							}

							element.oncopy = event => {
								event.preventDefault();
								const field = this.getFocusField();
								const value = field.copy();
								console.log("COPY", value);
								event.clipboardData.setData("text/plain", value || "");
							}
						}
				// 	}
				// ]
			};

		}

	}

}


KarmaFieldsAlpha.field.saucer.menu = class extends KarmaFieldsAlpha.field {

  getItems() {
    return this.resource.items || this.resource.children || [];
  }

  getChild() {

    const items = this.getItems();

    if (items[index]) {

      const item = items[index];

      return this.createChild({
        items: item.items || item.children || [],
        type: "menu"
      }, index);

    }

  }

	*buildChildren() {

		for (let item of this.getItems()) {
			yield {
				tag: "li",
				children: [
					{
						tag: "a",
						update: element => {
							element.innerHTML = item.title;
							element.href = "#" + (item.hash || "");
							if (item.table) {
								element.onclick = event => {
									event.preventDefault();
									this.request("open", item.table, item.params || {}, true);
								}
								// const currentTable = this.request("getCurrentLayer", "table");
								const currentTable = KarmaFieldsAlpha.Layer.getTable();
								element.classList.toggle("active", currentTable === item.table);
							}
							if (item.action) {
								element.onclick = event => {
									event.preventDefault();
									this.request(item.action, ...item.values);
								}
							}
						}
					},
					...this.createChild({
						items: item.items || item.children || [],
						type: "menu"
					}, index).build()
				],
				update: element => {
					// const currentTable = this.request("getCurrentLayer", "table");
					const currentTable = KarmaFieldsAlpha.Layer.getTable();
					const active = this.resource.table && this.resource.table === currentTable;
					element.classList.toggle("active", Boolean(active));
				}
			};
		}
	}

	*build() {
		yield {
			tag: "ul",
			children: this.buildChildren()
		}
	}

}





// document.addEventListener("paste", event => {
//
//   debugger;
//
//   console.log(event);
//    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
//    console.log(items);
//
//
// });

// window.addEventListener("copy", event => {
//
//
//   event.clipboardData.setData("text/plain", "aaaa");
//   event.preventDefault();
//
// });
