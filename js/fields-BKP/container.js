KarmaFieldsAlpha.field.container = class extends KarmaFieldsAlpha.field {

	isPopup() {

		return this.id === "popup";

	}

	// close() {

	// 	this.save("close");
	// 	this.parent.setFocus();
	// 	this.parent.render();

	// }

	getResource(key) {

		return this.resource[key];

	}

	hasSelection() {

		const body = this.getBody();

		if (body) {

			return body.hasSelectionInside();

		}

		return false;

	}

	// used by array
	getKeys() {

		const body = this.getBody();

		if (body) {

			return body.getKeys();

		}

		return [];

	}

	*listKeys() {

		const body = this.getBody();

		if (body) {

			yield* body.listKeys();

		}

	}


	export() {

		const body = this.getChild("body");

		if (body) {

			return body.export();

		}

		return [];
	}

	import(collection) {

		const body = this.getChild("body");

		if (body) {

			return body.import(collection);

		}

	}


	getHeader() {

		if (this.resource.header) {

			return this.createChild({
				type: "header",
				...this.resource.header
			}, "header");

		}

	}

	getFooter() {

		if (this.resource.footer) {

			return this.createChild({
				type: "footer",
				...this.resource.footer
			}, "footer");

		}

	}

	getBody() {

		if (this.resource.body) {

			// const scrollContainer = this.resource.scrollContainer;

			// -> compat
			let resource = this.resource.body;

			if (typeof resource === "string") {
				resource = { type: resource };
			}


			return this.createChild({
				...resource,
				scrollContainer: this.resource.scrollContainer
			}, "body");

		} else if (this.resource.children) { // compat

			return this.createChild({
				children: this.resource.children,
				type: "group"
			}, "body");

		}

	}

	getDialog() {

		if (this.resource.dialog) {

			return new KarmaFieldsAlpha.field.dialog(this.resource.dialog, "dialog", this);

		}

	}

	blank() { // deprecated ??

		if (!this.hasFocus()) {


			this.setFocus(true);
			this.render();

		}

	}

	// unselect() {

	// 	const body = this.getBody();

	// 	if (body) {

	// 		body.unselect();

	// 	} else {

	// 		super.unselect();

	// 	}

	// }

	// hasFocus() {

	// 	const body = this.getBody();

	// 	if (body) {

	// 		return body.hasFocus();

	// 	}

	// 	return super.hasFocus();

	// }

	setFocus() {

		const body = this.getBody();

		if (body) {

			body.setFocus(true);
			body.unselect();

		} else {

			super.setFocus(true);

		}

	}

	newChild(id) {

		if (id === "header") {

			return this.getHeader();

		} else if (id === "footer") {

			return this.getFooter();

		} else if (id === "body") {

			return this.getBody();

		} else if (id === "dialog") {

			return this.getDialog();

		}

	}

	*buildHeader() {

		const header = this.getHeader();

		if (header) {

			yield {
				class: "header-content",
				children: header.build()
			};

		}

	}


	*buildFooter() {

		const footer = this.getFooter();

		if (footer) {

			yield {
				class: "footer-content",
				children: footer.build(),
				update: element => {
					const loading = KarmaFieldsAlpha.Store.hasDownload() || KarmaFieldsAlpha.Store.hasUpload();
					element.classList.toggle("loading", loading);
				}
			};

		}

	}

	*buildBody(context) {

		const body = this.getBody();

		if (body) {

			// yield* body.build(context || "frame");
			yield* body.buildFrame();

		}

	}

	*buildDialog() {

		const dialog = this.getDialog();

		if (dialog && dialog.hasFocusInside()) {

			// yield* dialog.build();
			yield {
				class: "dialog",
				children: dialog.build()
			};

		}

	}

	abduct() {

		if (this.resource.sandbox && this.element) {

			return abduct(this.element, this.buildContent());

		} else {

			return this.parent.abduct();

		}

	}

	// *buildContent(context) {

	// 	yield {
	// 		class: "container-header",
	// 		children: this.buildHeader()
	// 	};

	// 	yield {
	// 		class: "container-body",
	// 		children: this.buildBody(context)
	// 	};

	// 	yield {
	// 		class: "container-footer",
	// 		children: this.buildFooter(),
	// 		update: element => {
	// 			element.classList.toggle("sticky", this.resource.footer && this.resource.footer.sticky !== false);
	// 		}
	// 	};

	// 	yield {
	// 		class: "container-dialog",
	// 		children: this.buildBody(context)
	// 	};

	// }

	// *build(context) {

	// 	if (context === "frame" || context === "dialog") {

	// 		yield {
	// 			class: "container-field frame",
	// 			init: element => {
	// 				if (this.resource.width) {
	// 					element.style.maxWidth = this.resource.width;
	// 				}
	// 			},
	// 			update: element => {
	// 				element.onmousedown = event => {
	// 					event.stopPropagation();
	// 					// debugger;
	// 					// if (!this.hasFocus()) {
	// 					// 	this.setFocus(true);
	// 					// 	this.unselect();
	// 					// 	this.render();
	// 					// }
	// 					this.setFocus(true);
	// 					this.render();
	// 				}
	// 				this.element = element;
	// 			},
	// 			children: this.buildContent(context)
	// 		};

	// 	} else {

	// 		yield {
	// 			class: "container-field field",
	// 			update: element => {
	// 				const hasFocus = this.hasFocus();
	// 				element.classList.toggle("has-selection", Boolean(hasFocus));
	// 				this.element = element;
	// 			},
	// 			children: this.buildContent(context)
	// 		};

	// 	}



	// }

	*build(context) {

		// yield {
		// 	class: "container-field field",
		// 	update: element => {
		// 		const hasFocus = this.hasFocus();
		// 		element.classList.toggle("has-selection", Boolean(hasFocus));
		// 		this.element = element;
		// 	},
		// 	children: [
		// 		{
		// 			class: "container-header",
		// 			children: this.buildHeader()
		// 		},
		// 		{
		// 			class: "container-body",
		// 			children: this.buildBody()
		// 		},
		// 		{
		// 			class: "container-footer",
		// 			children: this.buildFooter(),
		// 			update: element => {
		// 				element.classList.toggle("sticky", this.resource.footer && this.resource.footer.sticky !== false);
		// 			}
		// 		},
		// 		{
		// 			class: "container-dialog",
		// 			children: this.buildDialog()
		// 		}
		// 	]
		// };

		yield {
			class: "container-header",
			children: this.buildHeader(),
			init: element => {
				if (!this.scrollContainer) {
					element.classList.add("sticky");
				}
			}
		};

		yield {
			class: "container-body",
			children: this.buildBody()
		};

		yield {
			class: "container-footer",
			children: this.buildFooter(),
			init: element => {
				if (!this.scrollContainer) {
					element.classList.add("sticky");
				}
			}
		};

		yield {
			class: "container-dialog",
			children: this.buildDialog()
		};

	}

	// *buildFrame() {

	// 	yield* this.build("frame");

	// }

	// *buildDialog() {

	// 	yield* this.build("dialog");

	// }

}



KarmaFieldsAlpha.field.container.header = class extends KarmaFieldsAlpha.field.group {

	constructor(resource, id, parent) {

		super({
			display: "header",
			align: "center",
			...resource
		}, id, parent);

	}

}



// KarmaFieldsAlpha.field.container.close = class extends KarmaFieldsAlpha.field.button {
//   constructor(resource, id, parent) {
//     super({
//       dashicon: "no",
//       title: "Close",
//       action: "close",
// 			visible: ["request", "isPopup"],
//       ...resource
//     }, id, parent);
//   }
// }


KarmaFieldsAlpha.field.container.footer = class extends KarmaFieldsAlpha.field.group {

  constructor(resource, id, parent) {

    super({
      display: "flex",
      children: [],
      ...resource
    }, id, parent);

  }

}

KarmaFieldsAlpha.field.dialog = class extends KarmaFieldsAlpha.field.container {

	// constructor(resource, ...attr) {

	// 	super({
	// 		...resource,

	// 	});

	// }

	getBody() {

		if (this.resource.body) {

			// -> compat
			let resource = this.resource.body;

			if (typeof resource === "string") {
				resource = { type: resource };
			}

			return this.createChild({
				...resource,
				scrollContainer: true
			}, "body");

		}

	}

	*build() {

		yield {
			class: "container-field dialog-container-field",
			init: element => {
				if (this.resource.width) {
					element.style.maxWidth = this.resource.width;
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
			children: [
				{
					class: "container-header",
					children: this.buildHeader()
				},
				{
					class: "container-body",
					children: this.buildBody()
					// children: [
					// 	{
					// 		class: "scroll-container",
					// 		children: this.buildBody()
					// 	}
					// ]
				},
				{
					class: "container-footer",
					children: this.buildFooter()
				}
			]
		};

	}
}

KarmaFieldsAlpha.field.dialogLink = class extends KarmaFieldsAlpha.field.container {

	newChild(index) {

		if (index === "dialog" && this.resource.dialog) {

			return this.createChild({
				header: {
					children: ["title", "close"]
				},
				type: "dialog",
				...this.resource.dialog,
			}, "dialog");

			// return new KarmaFieldsAlpha.field.dialog({
			// 	header: {
			// 		children: ["title", "close"]
			// 	},
			// 	...this.resource.dialog
			// }, "dialog", this);

		}

	}

	open() {

		const dialog = this.getChild("dialog");

		dialog.setFocus(true);

		if (this.resource.params) {

			KarmaFieldsAlpha.server.promise(done => {

				let params = this.parseObject(this.resource.params);

				if (params !== undefined) {

					dialog.setState(params, "params");

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

	// 	const dialog = this.getChild("dialog");

	// 	if (dialog) {

	// 		const hasFocus = dialog.hasFocusInside();

	// 		if (hasFocus) {

	// 			yield {
	// 				class: "dialog",
	// 				update: element => {
	// 					element.onmousedown = event => {
	// 						event.stopPropagation();

	// 						dialog.setFocus(true);
	// 						dialog.render();
	// 					}
	// 				},
	// 				children: dialog.build("dialog")
	// 			};

	// 		}

	// 	}

	// }

	*build() {

		yield {
			class: "dialog-link",
			children: [
				{
					tag: "a",
					update: element => {
						element.innerHTML = this.getText();
						element.onclick = event => {
							event.preventDefault();
							this.save("open");
							this.open();
							this.render();
						}
					}
				},
				{
					class: "dialog-container",
					children: this.buildDialog()
				}
			]
		};

	}

}


KarmaFieldsAlpha.field.tabs = class extends KarmaFieldsAlpha.field.container {

	newChild(index) {

		if (this.resource.children && this.resource.children[index]) {

			return this.createChild({
				...this.resource.children[index],
				scrollContainer: this.resource.scrollContainer
			}, index);

		} else {

			return super.newChild(index);

		}

	}

	*build() {

		// yield {
		// 	class: "tab-container-field",
		// 	update: element => {
		// 		this.element = element;
		// 	},
		// 	children: [
		// 		{
		// 			class: "container-header tabs-header",
		// 			children: this.buildHeader()
		// 		},
		// 		{
		// 			class: "container-body",
		// 			children: this.buildBody()
		// 		},
		// 		{
		// 			class: "container-footer",
		// 			children: this.buildFooter()
		// 		}
		// 	]
		// };


		// const header = this.getHeader();
		// const body = this.getBody();
		// const footer = this.getFooter();

		// if (header) {

		// 	yield {
		// 		class: "container-header",
		// 		children: header.build()
		// 	};

		// }

		// if (body) {

		// 	yield {
		// 		class: "container-body",
		// 		children: body.build()
		// 	};

		// }

		// if (footer) {

		// 	yield {
		// 		class: "container-footer",
		// 		children: footer.build()
		// 	};

		// }

	}

	*buildHeader() {

		const children = this.getChildren();
		const currentIndex = this.getState("index") || 0;

		for (let i = 0; i < children.length; i++) {
			yield {
				tag: "a",
				class: "tab-handler",
				update: element => {
					element.innerHTML = children[i].label;
					element.classList.toggle("active", i === currentIndex);
					element.onclick = event => {
						this.save("change-tab");
						this.setState(i, "index");
						this.render();
					}
				}
			};
		}

	}

	getCurrentTabIndex() {

		return this.getState("index") || 0;

	}

	*buildFrame() {

		yield* this.build(); // -> cancel frame

	}

	*buildBody(context) {

		if (this.resource.children) {

			for (let i = 0; i < this.resource.children.length; i++) {

				yield {
					class: "tab",
					children: this.buildTab(i, context)
				};

			}

		}


	}

	*buildTab(index, context) {

		const currentIndex = this.getCurrentTabIndex();

		if (index === currentIndex) {

			const child = this.getChild(index);

			if (child) {

				yield* child.buildFrame();

			}

		}

	}

	// *buildFrame() {

	// 	yield* this.buildFrame();

	// }


}



// KarmaFieldsAlpha.field.tabsHeader = class extends KarmaFieldsAlpha.field {

// 	*buildTabHeaders() {

// 		const

// 		const children = this.getChildren();
// 		const currentIndex = this.request("getCurrentTabIndex");

// 		for (let i = 0; i < children.length; i++) {

// 			yield {
// 				tag: "a",
// 				class: "tab-handler",
// 				update: element => {
// 					element.innerHTML = children[i].label;
// 					element.classList.toggle("active", i === currentIndex);
// 					element.onclick = event => {
// 						this.save("change-tab");
// 						this.setState(i, "index");
// 						this.render();
// 					}
// 				}
// 			};
// 		}
// 	}
