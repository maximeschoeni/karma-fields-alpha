KarmaFieldsAlpha.field.container = class extends KarmaFieldsAlpha.field {

	// isPopup() {

	// 	return this.id === "popup";

	// }

	isScrollContainer() {

		return this.resource.scrollContainer || this.resource.scroll || false;

	}

	// close() {

	// 	this.save("close");
	// 	this.parent.setFocus();
	// 	this.parent.render();

	// }

	getResource(key) {

		return this.resource[key];

	}

	// hasSelection() {

	// 	const body = this.getBody();

	// 	if (body) {

	// 		return body.hasSelectionInside();

	// 	}

	// 	return false;

	// }

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


	getHeaderResource() {

		return this.resource.header;

	}

	getBodyResource() { // -> e.g. media table need to extends table resource without overriding getBody

		if (typeof this.resource.body === "string") { // -> compat

			return { type: this.resource.body };

		} else if (!this.resource.body && this.resource.children) { // -> compat

			return {
				type: "group",
				children: this.resource.children
			};

		}

		return this.resource.body;

	}

	getFooterResource() {

		return this.resource.footer;

	}

	hasHeader() {

		return this.resource.header;

	}

	getHeader() {

		// const resource = this.getHeaderResource();

		return new KarmaFieldsAlpha.field.group({
			...this.resource.header,
			offsetContainer: true
		}, "header", this);

	}

	hasFooter() {

		return this.resource.footer;

	}

	getFooter() {

		// return new KarmaFieldsAlpha.field.group({
		// 	display: "flex",
		// 	...this.resource.footer,
		// 	offsetContainer: true
		// }, "footer", this);

		return new KarmaFieldsAlpha.field.container.footer(this.resource.footer, "footer", this);

		// if (this.resource.footer) {

			// return this.createChild({
			// 	type: "footer",
			// 	...this.resource.footer,
			// 	offsetContainer: true
			// }, "footer");

		// }

	}

	getBody() {

		// const resource = this.getBodyResource();

		return this.createChild({
			...this.getBodyResource(),
			offsetContainer: true,
			scrollContainer: this.isScrollContainer(),
			pad: true,
			scroll: this.isScrollContainer(),
			border: false
		}, "body");

		// if (resource) {



		// } else if (this.resource.children) { // compat

		// 	return this.createChild({
		// 		children: this.resource.children,
		// 		type: "group",
		// 		// offsetContainer: true,
		// 		// scrollContainer: this.isScrollContainer(),
		// 		// pad: true,
		// 		// scroll: this.isScrollContainer(),
		// 		// border: false
		// 	}, "body");

		// }

	}

	// getDialog() {

	// 	if (this.resource.dialog) {

	// 		return new KarmaFieldsAlpha.field.dialog(this.resource.dialog, "dialog", this);

	// 	}

	// }

	// blank() { // deprecated ??

	// 	if (!this.hasFocus()) {


	// 		this.setFocus(true);
	// 		this.render();

	// 	}

	// }

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

			// super.setFocus(true);
			console.error("Setting focus but body is not ready");

		}

	}

	newChild(id) {

		if (id === "header") {

			return this.getHeader();

		} else if (id === "footer") {

			return this.getFooter();

		} else if (id === "body") {

			return this.getBody();

		// } else if (id === "dialog") {

		// 	return this.getDialog();

		}

		return super.newChild(id);

	}

	// *buildHeader() {

	// 	// const header = this.getHeader();

	// 	// if (this.resource.header !== false) {

	// 	const header = this.getChild("header");

	// 	if (header) {

	// 		yield* header.build();

	// 	}



	// 		// yield {
	// 		// 	class: "container-header",
	// 		// 	children: header.build(),
	// 		// 	init: element => {
	// 		// 		if (!this.isScrollContainer()) {
	// 		// 			element.classList.add("sticky");
	// 		// 		}
	// 		// 	}
	// 		// };

	// 		// yield {
	// 		// 	class: "header-content",
	// 		// 	children: header.build()
	// 		// };

	// 	// }

	// }


	// *buildFooter() {



	// 	// if (this.resource.footer !== false) {

	// 		// yield {
	// 		// 	class: "footer-content",
	// 		// 	children: footer.build(),
	// 		// 	update: element => {
	// 		// 		const loading = KarmaFieldsAlpha.Store.hasDownload() || KarmaFieldsAlpha.Store.hasUpload();
	// 		// 		element.classList.toggle("loading", loading);
	// 		// 	}
	// 		// };

	// 	const footer = this.getFooter();

	// 	if (footer) {

	// 		yield* footer.build();

	// 	}






	// 	// }

	// }

	// *buildBody(context) {

	// 	const body = this.getBody();

	// 	if (body) {

	// 		yield* body.build();

	// 	}

	// }

	async render(depth = "deep") {

		// KarmaFieldsAlpha.renderingDepth = depth;

		if (KarmaFieldsAlpha.rendering) {

			return;

		}

		KarmaFieldsAlpha.rendering = true;

		while (await KarmaFieldsAlpha.server.process() && this.element) {

			// await this.abduct();
			await abduct(this.element, this.buildSections());

		}

		KarmaFieldsAlpha.rendering = false;

	}

	// abduct() {

	// 	if (this.element) {

	// 		return abduct(this.element, this.buildContent());

	// 	}

	// }

	*buildSections() {

		if (this.hasHeader()) {

			const header = this.getHeader();

			yield {
				class: "container-header",
				// children: this.buildHeader(),
				children: header?.build(),
				init: element => {
					if (!this.resource.scrollContainer) {
						element.classList.add("sticky");
					}
				}
			};

		}

		const body = this.getBody();

		yield {
			class: "container-body",
			// children: this.buildBody()
			children: body?.build() // if body is undefined -> dont render instead of rendering empty content
		};

		if (this.hasFooter()) {

			const footer = this.getFooter();

			yield {
				class: "container-footer loading-zone",
				// children: this.buildFooter(),
				children: footer?.build(),
				init: element => {
					if (!this.resource.scrollContainer) {
						element.classList.add("sticky");
					}
				},
				update: element => {
					// const loading = KarmaFieldsAlpha.Store.hasDownload() || KarmaFieldsAlpha.Store.hasUpload();
					// element.classList.toggle("loading", loading);
				}
			};

		}

		if (this.resource.clipboard) {

			const clipboard = new KarmaFieldsAlpha.field.container.clipboard({}, "clipboard", this);

			yield* clipboard.build();

		}



	}

	*build() {

		// if (!this.resource.offsetContainer) {

			yield {
				class: "container-field",
				children: this.buildSections(),
				update: element => {
					this.element = element;
					// this.render = async () => {
					// 	while (await KarmaFieldsAlpha.server.process()) {
					// 		await abduct(element, this.buildSections());
					// 	}
					// }

					element.classList.toggle("border", this.resource.border !== false);
					// element.classList.toggle("active", this.resource.border !== false && this.hasFocusInside());
					element.onmousedown = event => {
						event.stopPropagation();
						this.setFocus(true);
						this.render();
					}
				}
			};

		// } else {

		// 	yield* this.buildSections();

		// }



	}

	// *buildFrame() {

	// 	yield* this.build("frame");

	// }

	// *buildDialog() {

	// 	yield* this.build("dialog");

	// }

}



KarmaFieldsAlpha.field.header = class extends KarmaFieldsAlpha.field.group {

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
			pad: true,
			offsetContainer: true,
			...resource
		}, id, parent);

	}

}

// KarmaFieldsAlpha.field.dialog = class extends KarmaFieldsAlpha.field.container {



// 	isScrollContainer() {
// 		return true;
// 	}

// 	getBody() {

// 		if (this.resource.body) {

// 			// -> compat
// 			let resource = this.resource.body;

// 			if (typeof resource === "string") {
// 				resource = { type: resource };
// 			}

// 			return this.createChild({
// 				...resource,
// 				scrollContainer: true,
// 				offsetContainer: true
// 			}, "body");

// 		}

// 	}

// 	*build() {

// 		yield {
// 			class: "dialog container-field-xx dialog-container-field",
// 			init: element => {
// 				if (this.resource.width) {
// 					element.style.maxWidth = this.resource.width;
// 				}
// 			},
// 			update: element => {
// 				element.onmousedown = event => {
// 					event.stopPropagation();
// 					this.setFocus(true);
// 					this.render();
// 				}
// 				this.element = element;
// 			},
// 			children: super.build()
// 			// children: [
// 			// 	{
// 			// 		class: "container-header",
// 			// 		children: this.buildHeader()
// 			// 	},
// 			// 	{
// 			// 		class: "container-body",
// 			// 		children: this.buildBody()
// 			// 	},
// 			// 	{
// 			// 		class: "container-footer",
// 			// 		children: this.buildFooter()
// 			// 	}
// 			// ]
// 		};

// 	}
// }


KarmaFieldsAlpha.field.tabs = class extends KarmaFieldsAlpha.field.container {

	newChild(index) {

		if (this.resource.children && this.resource.children[index]) {

			return this.createChild({
				...this.resource.children[index],
				scrollContainer: this.isScrollContainer(),
				offsetContainer: true
			}, index);

		} else {

			return super.newChild(index);

		}

	}

	// *build() {

	// 	// yield {
	// 	// 	class: "tab-container-field",
	// 	// 	update: element => {
	// 	// 		this.element = element;
	// 	// 	},
	// 	// 	children: [
	// 	// 		{
	// 	// 			class: "container-header tabs-header",
	// 	// 			children: this.buildHeader()
	// 	// 		},
	// 	// 		{
	// 	// 			class: "container-body",
	// 	// 			children: this.buildBody()
	// 	// 		},
	// 	// 		{
	// 	// 			class: "container-footer",
	// 	// 			children: this.buildFooter()
	// 	// 		}
	// 	// 	]
	// 	// };


	// 	// const header = this.getHeader();
	// 	// const body = this.getBody();
	// 	// const footer = this.getFooter();

	// 	// if (header) {

	// 	// 	yield {
	// 	// 		class: "container-header",
	// 	// 		children: header.build()
	// 	// 	};

	// 	// }

	// 	// if (body) {

	// 	// 	yield {
	// 	// 		class: "container-body",
	// 	// 		children: body.build()
	// 	// 	};

	// 	// }

	// 	// if (footer) {

	// 	// 	yield {
	// 	// 		class: "container-footer",
	// 	// 		children: footer.build()
	// 	// 	};

	// 	// }

	// }

	*build() {

		yield {
			class: "container-header tab-handlers-header",
			children: this.buildTabHandlers()
		};

		yield {
			class: "container-body",
			children: this.buildTabs(),
			init: element => {
				element.style.border = "none";
			}
		};

	}

	*buildTabHandlers() {

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

		yield {
			class: "tab-handler",
			update: element => {
				element.style.flexGrow = 1;
			}
		};

	}

	getCurrentTabIndex() {

		return this.getState("index") || 0;

	}

	*buildFrame() {

		yield* this.build(); // -> cancel frame

	}

	*buildTabs(context) {

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

				yield* child.build();

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


// -> to be moved in selectable ?
KarmaFieldsAlpha.field.container.clipboard = class extends KarmaFieldsAlpha.field {

	*build() {

		yield {
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
		};

	}

}
