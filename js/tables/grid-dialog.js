

KarmaFieldsAlpha.field.dialog = class extends KarmaFieldsAlpha.field {

	// getDialogResource() {

	// 	return {
	// 		type: "container",
	// 		header: {
	// 			type: "group",
	// 			children: [
	// 				{ type: "title" },
	// 				{ type: "close" }
	// 			]
	// 		},
	// 		scrollContainer: true, // compat - deprecated
	// 		offsetContainer: true, // compat - deprecated
	// 		scroll: true,
	// 		pad: true,
	// 		border: false,
	// 		...this.resource.dialog
	// 	};

	// }

	getDialog() {

		const dialog = new KarmaFieldsAlpha.field.dialog.dialogBox({
			header: {
				type: "group",
				children: [
					{ type: "title" },
					{ type: "close" }
				]
			},
			scrollContainer: true, // compat - deprecated
			offsetContainer: true, // compat - deprecated
			scroll: true,
			pad: true,
			border: false,
			...this.resource.dialog
		}, "dialog");

		return dialog;

		// const resource = this.getDialogResource();

		// return this.createChild(resource, "dialog");

	}

	// getMain() {

	// 	return this.createChild(this.resource, "main");

	// }

	newChild(index) {

		if (index === "dialog") {

			return this.getDialog();

		}

		return super.newChild();

	}

	doAction(action, ...args) {

		switch (action) {

			case "open":
			case "edit":
				this.open(...args);
				break;

			case "close":
				this.close();
				break;

			default:
				super.doAction(action, ...args);

		}

	}

	open() {

		const dialog = this.getChild("dialog");

		if (dialog) {

			dialog.setFocus();

		}

	}

	close() {

		this.setFocus();

	}

	// editSelection() {

	// 	const selection = this.getSelection();

	// 	if (selection) {

	// 		this.edit(selection.index, selection.length);

	// 	}

	// }



	*listKeys() {

		if (this.resource.dialog) {

			const dialog = this.getChild("dialog");

			yield* child.listKeys();

		}

	}

	// getExportableColumns() {

	// 	if (this.resource.dialog && this.resource.dialog.export) {

	// 	 return [this.resource.dialog];

	// 	}

	// 	return [];

	// }

	// *buildTarget() { }

	// *buildDialog() {

	// 	if (this.resource.dialog) {

	// 		const dialog = new KarmaFieldsAlpha.field.dialog.dialogBox(this.resource.dialog, "dialog", this);

	// 		yield {
	// 			class: "dialog-container",
	// 			children: dialog.build()
	// 		};

	// 	}

	// }
	// *buildDialog() {

	// 	const dialog = this.getChild("dialog");

	// 	if (dialog && dialog.hasFocusInside()) {

	// 		yield {
	// 			class: "dialog",
	// 			// child: {
	// 			// 	class: "dialog-content",
	// 			// 	children: content.build(),
	// 			// 	init: element => {
	// 			// 		if (dialog.resource.width) {
	// 			// 			element.style.width = dialog.resource.width;
	// 			// 		}
	// 			// 	}
	// 			// },
	// 			children: content.build(),
	// 			init: element => {
	// 				element.style.width = dialog.getWidth();
	// 				element.style.height = dialog.resource.height || "auto";
	// 				element.classList.toggle("toolbox", content.resource.mode === "toolbox" || false);
	// 				element.classList.toggle("popup", content.resource.mode === "popup" || false);

	// 				element.classList.toggle("align-top", this.resource.align === "align-top");
	// 				element.classList.toggle("align-bottom", this.resource.align === "align-bottom");
	// 				element.classList.toggle("align-left", this.resource.align === "align-left");
	// 				element.classList.toggle("align-right", this.resource.align === "align-right");
	// 				element.classList.toggle("align-center", !this.resource.align || this.resource.align === "align-center");

	// 			},
	// 			update: element => {

	// 				if (dialog.resource.mode === "toolbox") {

	// 					// this.positionToolbox(element);

	// 					element.classList.toggle("top", this.resource.position === "top");
	// 					element.classList.toggle("bottom", this.resource.position === "bottom" || !this.resource.position);
	// 					element.classList.toggle("left", this.resource.position === "left");
	// 					element.classList.toggle("right", this.resource.position === "right");

	// 					const dialogBox = element.getBoundingClientRect();
	// 					const rectangle = this.target;
	// 					const offset = 10;
	// 					let x, y;

	// 					if (this.resource.position === "bottom" || this.resource.position === "top") {

	// 						if (this.resource.position === "top") {

	// 							y = rectangle.y - dialogBox.height - offset;

	// 						} else {

	// 							y = rectangle.y + rectangle.height + offset;

	// 						}

	// 						if (this.resource.align === "right") {

	// 							x = rectangle.x + rectangle.width - dialogBox.width;

	// 						} else {

	// 							x = rectangle.x;

	// 						}

	// 					} else {

	// 						if (this.resource.position === "left") {

	// 							x = rectangle.x - dialogBox.width - offset;

	// 						} else {

	// 							x = rectangle.x + rectangle.width + offset;

	// 						}

	// 						if (this.resource.align === "bottom") {

	// 							y = rectangle.y + rectangle.height - dialogBox.height;

	// 						} else {

	// 							y = rectangle.y;

	// 						}

	// 					}

	// 					element.style.left = `${x}px`;
	// 					element.style.top = `${y}px`;

	// 				}

	// 				element.onmousedown = event => {
	// 					event.stopPropagation();
	// 					this.setFocus(true);
	// 					this.render();
	// 				}
	// 				this.element = element;
	// 			}
	// 		};

	// 	}

	// }

	// positionToolbox(element) {

	// 	const dialogBox = element.getBoundingClientRect();
	// 	const rectangle = this.target;
	// 	const offset = 10;
	// 	let x, y;

	// 	element.classList.remove("top", "bottom", "left", "right", "align-top", "align-bottom", "align-left", "align-right");

	// 	if (this.resource.position === "bottom" || this.resource.position === "top") {

	// 		if (this.resource.position === "top") {

	// 			y = rectangle.y - dialogBox.height - offset;
	// 			element.classList.add("top");

	// 		} else {

	// 			y = rectangle.y + rectangle.height + offset;
	// 			element.classList.add("bottom");

	// 		}

	// 		if (this.resource.align === "right") {

	// 			x = rectangle.x + rectangle.width - dialogBox.width;
	// 			element.classList.add("align-right");

	// 		} else {

	// 			x = rectangle.x;
	// 			element.classList.add("align-left");

	// 		}

	// 	} else {

	// 		if (this.resource.position === "left") {

	// 			x = rectangle.x - dialogBox.width - offset;
	// 			element.classList.add("left");

	// 		} else {

	// 			x = rectangle.x + rectangle.width + offset;
	// 			element.classList.add("right");

	// 		}

	// 		if (this.resource.align === "bottom") {

	// 			y = rectangle.y + rectangle.height - dialogBox.height;
	// 			element.classList.add("align-bottom");

	// 		} else {

	// 			y = rectangle.y;
	// 			element.classList.add("align-top");

	// 		}

	// 	}

	// 	element.style.left = `${x}px`;
	// 	element.style.top = `${y}px`;

	// }



	// *build(context) {

	// 	// const dialog = this.getChild("dialog");



	// 	yield {
	// 		class: "dialog-fork",
	// 		update: element => {
	// 			element.classList.toggle("mode-aside", this.resource.mode === "aside" || false);
	// 		},
	// 		children: [
	// 			{
	// 				class: "main-branch",
	// 				children: this.getChild("main")?.build(),
	// 				update: element => {
	// 					this.target = element;
	// 				}
	// 			},
	// 			{
	// 				class: "dialog-branch", // compat dialog-container
	// 				children: this.getChild("dialog")?.build()
	// 			}
	// 		]
	// 	};

	// }

	*buildContent() {

	}

	*buildDialog() {

		const dialog = this.getDialog(this.resource.dialog);

		yield {
			class: "dialog-wrapper",
			children: [
				{
					class: "main-container",
					children: this.buildContent()
				},
				{
					class: "dialog-container",
					children: dialog.build()
				}
			],
			init: element => {
				element.classList.toggle("mode-aside", this.resource.dialog.mode === "aside" || false);
			}
		};

	}

	*build() {

		if (this.resource.dialog) {

			yield* this.buildDialog();

		} else {

			yield* this.buildContent();

		}

	}



}

KarmaFieldsAlpha.field.dialog.dialogBox = class extends KarmaFieldsAlpha.field.container {

	*build() {

		if (this.hasFocusInside()) {

			yield {
				// class: "dialog",
				// children: content.build(),
				class: "dialog container-field",
				children: this.buildSections(),
				init: element => {
					element.style.width = this.parseWidth(this.resource.width || "full");
					element.style.height = this.resource.height || "auto";
					element.classList.toggle("toolbox", this.resource.mode === "toolbox" || false);
					element.classList.toggle("popup", this.resource.mode === "popup" || false);

					element.classList.toggle("align-top", this.resource.align === "align-top");
					element.classList.toggle("align-bottom", this.resource.align === "align-bottom");
					element.classList.toggle("align-left", this.resource.align === "align-left");
					element.classList.toggle("align-right", this.resource.align === "align-right");
					element.classList.toggle("align-center", !this.resource.align || this.resource.align === "align-center");

				},
				update: element => {

					if (this.resource.mode === "toolbox") {

						element.classList.toggle("top", this.resource.position === "top");
						element.classList.toggle("bottom", this.resource.position === "bottom" || !this.resource.position);
						element.classList.toggle("left", this.resource.position === "left");
						element.classList.toggle("right", this.resource.position === "right");

						const dialogBox = element.getBoundingClientRect();
						const rectangle = this.target;
						const offset = 10;
						let x, y;

						if (this.resource.position === "bottom" || this.resource.position === "top") {

							if (this.resource.position === "top") {

								y = rectangle.y - dialogBox.height - offset;

							} else {

								y = rectangle.y + rectangle.height + offset;

							}

							if (this.resource.align === "right") {

								x = rectangle.x + rectangle.width - dialogBox.width;

							} else {

								x = rectangle.x;

							}

						} else {

							if (this.resource.position === "left") {

								x = rectangle.x - dialogBox.width - offset;

							} else {

								x = rectangle.x + rectangle.width + offset;

							}

							if (this.resource.align === "bottom") {

								y = rectangle.y + rectangle.height - dialogBox.height;

							} else {

								y = rectangle.y;

							}

						}

						element.style.left = `${x}px`;
						element.style.top = `${y}px`;

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


// KarmaFieldsAlpha.field.gridDialog = class extends KarmaFieldsAlpha.field {

// 	getValue(key) {

// 		return this.parent.getSelectedValue(key);

// 	}

// 	setValue(value, key) {

// 		this.parent.setSelectedValue(value, key);

// 	}

// 	abduct() {

// 		if (this.resource.sandbox && this.element) {

// 			return abduct(this.element, this.buildContent());

// 		} else {

// 			return this.parent.abduct();

// 		}

// 	}

// 	newChild(id) {

// 		// if (id === "content") {

// 		if (this.resource.content) {

// 				return this.createChild({
// 					model: "container",
// 					header: {
// 						type: "group",
// 						display: "flex",
// 						children: [
// 							{type: "title"},
// 							{type: "close"}
// 						]
// 					},
// 					scrollContainer: true, // compat - deprecated
// 					offsetContainer: true, // compat - deprecated
// 					scroll: true,
// 					pad: true,
// 					border: false,
// 					...this.resource.content,
// 					...this.resource.content.content // compat
// 				}, id);

// 			}



// 		// }

// 	}

// 	// *buildContent() {

// 	// 	const content = this.getChild("content");

// 	// 	yield* content.build();

// 	// }

// 	*build() {



// 		if (this.hasFocusInside()) {

// 			const content = this.getChild("content");


// 			if (content) {

// 				yield {
// 					class: "dialog",
// 					child: {
// 						class: "dialog-content",
// 						children: content.build(),
// 						init: element => {
// 							if (this.resource.width) {
// 								element.style.maxWidth = this.resource.width;
// 							}
// 							if (content.resource.width) {
// 								element.style.width = content.resource.width;
// 							}
// 						}
// 					},
// 					init: element => {
// 						// if (this.resource.width) {
// 						// 	element.style.maxWidth = this.resource.width;
// 						// }
// 						if (content.resource.mode === "toolbox") {
// 							element.classList.add("toolbox");
// 							element.classList.add("dark");
// 							// element.setAttribute("popover", true);
// 						}
// 					},
// 					update: element => {

// 						if (content.resource.mode === "toolbox") {

// 							const targetBox = this.request("getBox");

// 							if (targetBox) {

// 								// const parentBox = targetBox.parentNode.getBoundingClientRect();
// 								const box = element.getBoundingClientRect();
// 								const offset = 10;



// 								// -> to right
// 								const x = targetBox.x + targetBox.width + offset;
// 								const y = targetBox.y;
// 								// const y = Math.max(offset, targetBox.y + targetBox.height / 2 - box.height / 2);

// 								// const height = Math.min(window.innerH)

// 								// console.log(y, targetBox.y, targetBox.height / 2, box.height / 2, parentBox.y);

// 								// console.log(targetBox, x, y);

// 								element.style.left = `${x}px`;
// 								element.style.top = `${y}px`;

// 							}

// 						}

// 						element.onmousedown = event => {
// 							event.stopPropagation();
// 							this.setFocus(true);
// 							this.render();
// 						}
// 						this.element = element;
// 					}
// 				};

// 			}



// 		}

// 	}


// }

// KarmaFieldsAlpha.field.grid.modal = class extends KarmaFieldsAlpha.field.container {

// 	getValue(key) {

// 		return this.parent.getValue(key);

// 	}

// 	setValue(value, key) {

// 		return this.parent.setValue(value, key);

// 	}

// 	getBody() {

// 		return new KarmaFieldsAlpha.field.grid.modalContent(this.resource.body || { children: this.resource.children }, "body", this);

// 	}

// 	close() {

// 		this.parent.removeSelection();

// 		super.close();

// 	}

//   *build() {

//     const selection = this.parent.getSelection();

//     if (selection && selection.length) {

//       yield* super.build();

//     }

//   }

// }

// KarmaFieldsAlpha.field.grid.dialog = class extends KarmaFieldsAlpha.field.dialog {



// 	// getValue(key) {

// 	// 	return this.parent.getSelectedValue(key);

// 	// }

// 	// setValue(value, key) {

// 	// 	this.parent.setSelectedValue(value, key);

// 	// }

// 	// newChild(id) {

// 	// 	return this.createChild(this.resource, id);

// 	// 	// return new KarmaFieldsAlpha.field[this.resource.type](this.resource, id, this);

// 	// }

// 	// delete() {

// 	// 	const selection = this.parent.getSelection();

// 	// 	if (selection) {

// 	// 		const { index = 0, length = 0 } = selection;

// 	// 		return this.parent.deleteAt(index, length);

// 	// 	}

// 	// }

// 	// close() {

// 	// 	// this.parent.removeSelection();

// 	// 	super.close();

// 	// }

// 	// *build() {

// 	// 	const content = this.getChild("content");

// 	// 	yield* content.build("dialog");


// 	// }

// 	// *build() {

// 	// 	yield {
// 	// 		class: "container-field dialog-container-field",
// 	// 		init: element => {
// 	// 			if (this.resource.width) {
// 	// 				element.style.maxWidth = this.resource.width;
// 	// 			}
// 	// 		},
// 	// 		update: element => {
// 	// 			element.onmousedown = event => {
// 	// 				event.stopPropagation();
// 	// 				this.setFocus(true);
// 	// 				this.render();
// 	// 			}
// 	// 			this.element = element;
// 	// 		},
// 	// 		children: [
// 	// 			{
// 	// 				class: "container-header",
// 	// 				children: this.buildHeader()
// 	// 			},
// 	// 			{
// 	// 				class: "container-body scroll-container",
// 	// 				children: this.buildBody()
// 	// 			},
// 	// 			{
// 	// 				class: "container-footer",
// 	// 				children: this.buildFooter()
// 	// 			}
// 	// 		]
// 	// 	};

// 	// }

// }


// KarmaFieldsAlpha.field.grid.modalContent = class extends KarmaFieldsAlpha.field.group {

//   // getContent(key) {
//   //
//   //   return this.parent.getContentAt(this.id, key);
//   //
//   // }
//   //
//   // setValue(value, key) {
//   //
//   //   return this.parent.setValueAt(value, this.id, key);
//   //
//   // }



// 	*build() {

// 		yield {
// 			class: "form-single",
// 			children: super.build()
// 		};

// 	}


// }



// // KarmaFieldsAlpha.field.grid.row.rowIndex = class extends KarmaFieldsAlpha.field.text {
// //   constructor(resource, id, parent) {
// //   console.error("deprecated")
// //     super({
// //       value: ["+", ["resource", "index"], 1],
// //       width: "min-content",
// //       ...resource
// //     }, id, parent)
// //   }
// //   getContent() {
// //     const index = this.parent.getIndex();
// //     return new KarmaFieldsAlpha.Content(index + 1);
// //   }
// // };

// KarmaFieldsAlpha.field.index = KarmaFieldsAlpha.field.rowIndex = KarmaFieldsAlpha.field.grid.row.index = KarmaFieldsAlpha.field.grid.row.rowIndex = class extends KarmaFieldsAlpha.field {
// 	// constructor(resource, id, parent) {
// 	// 	super({
// 	// 		// value: ["+", ["resource", "index"], 1],
// 	// 		value: ["+", ["request", "getIndex"], 1],
// 	// 		width: "min-content",
// 	// 		...resource
// 	// 	}, id, parent)
// 	// }
// 	*build() {
// 		yield {
// 			tag: "div",
// 			class: "text karma-field grid-row-index",
// 			init: element => {
// 				if (this.resource.width) {
// 					element.style.width = this.resource.width || "min-content";
// 				}
// 			},
// 			update: element => {
// 				const index = this.getIndex();
// 				element.innerHTML = index + 1;
// 			}
// 		}
// 	}
// };

// // KarmaFieldsAlpha.field.grid.row.delete = class extends KarmaFieldsAlpha.field.button {
// //   constructor(resource, id, parent) {
// //     super({
// //       // request: ["delete", ["request", "getIndex"]],
// //       action: "delete",
// //       params: [["request", "getIndex"], 1],
// //       title: "Delete",
// //       dashicon: "remove",
// //       classes: ["array-delete", "simple-buttons"],
// //       width: "min-content",
// //       ...resource
// //     }, id, parent);
// //   }
// // };

KarmaFieldsAlpha.field.simpleButton = class extends KarmaFieldsAlpha.field {

	*buildContent() {

		if (this.resource.dashicon) {

			yield {
				tag: "span",
				update: element => {
					const dashicon = this.parseString(this.resource.dashicon);
					if (dashicon !== undefined) {
						element.className = `dashicons dashicons-${dashicon}`;
					}
				}
			};

		}

		if (this.resource.text) {

			yield {
				tag: "span",
				update: element => {
					const text = this.parseString(this.resource.text);
					if (text !== undefined) {
						element.innerHTML = text;
					}
				}
			};

		}

	}

	*build() {

		yield {
			tag: "button",
			class: "button karma-button karma-field",
			init: element => {
				element.tabIndex = -1;
			},
			children: this.builContent(),
			update: element => {
				if (this.resource.primary) {
					const primary = this.parseBoolean(this.resource.primary);
					element.classList.toggle("button-primary", primary || false);
				}
				if (this.resource.disabled) {
					const disabled = this.parseBoolean(this.resource.disabled);
					element.disabled = disabled || false;
				}
				if (this.resource.enabled) {
					const enabled = this.parseBoolean(this.resource.enabled);
					element.disabled = !enabled;
				}
				if (this.resource.active) {
					const active = this.parseBoolean(this.resource.active);
					element.classList.toggle("active", active || false);
				}

				element.onmousedown = event => {
					event.preventDefault(); // -> keep focus to current active element
					event.stopPropagation(); // -> prevent selecting parent stuffs
				}

				element.onclick = event => {
					event.preventDefault(); // -> prevent submitting form in post-edit
					this.doAction(this.resource.action);
				}

			}
		};

	}

}

KarmaFieldsAlpha.field.dialogButton = class extends KarmaFieldsAlpha.field.dialog {

	*buildContent() {

		const button = new KarmaFieldsAlpha.field.simpleButton({
			action: "open",
			...this.resource
		}, "button", this);

		yield* button.build();

	}

}
