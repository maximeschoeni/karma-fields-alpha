KarmaFieldsAlpha.field.container = class extends KarmaFieldsAlpha.field {

	// async abduct() {

	// 	await KarmaFieldsAlpha.build(this.build(), this.element.parentNode, this.element);

	// 	const focus = this.getFocus();

	// 	document.body.classList.toggle("karma-table-open", focus.includes("popup"));

	// }
	// queryParams() {

	// 	const params = this.parse(this.resource.params || {});

	// 	if (!params.loading) {

	// 		return KarmaFieldsAlpha.server.queryParams(fieldId, params.toObject());

	// 	}

	// 	return params;

	// }

	// queryParam(key) {

	// 	const response = this.queryParams();

	// 	if (!response.loading) {

	// 		response.value = response.toObject()[key] || "";

	// 	}

	// 	return response;
	// }

	// queryParamstring() {

	// 	const response = this.queryParams();

	// 	if (!response.loading) {

	// 		return KarmaFieldsAlpha.server.queryParamstring(response.toObject());

	// 	}

	// 	return response;
	// }

	// changeParam(value, key) {

	// 	// const response = this.queryParams();

	// 	// if (!response.loading) {



	// 	// }

	// 	KarmaFieldsAlpha.server.changeParam(value, this.uid, key);

	// }

	// getParams() {

	// 	const defaultParams = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.server.store, "state", "fields", this.uid, "defaultParams");
	// 	const params = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.server.store, "state", "fields", this.uid, "params");

	// 	return { ...defaultParams, ...params };

	// }

	// getParamstring() {

	// 	return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.server.store, "state", "fields", this.uid, "paramstring") || "";

	// }

	// updateParamstring() {

	// 	const params = this.getParams();
	// 	const paramstring = KarmaFieldsAlpha.Params.stringify(params);

	// 	KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, paramstring, "state", "fields", this.uid, "paramstring");

	// }

	// async setParams(params) {

	// 	await this.setState(params, "params");

	// 	this.updateParamstring();

	// 	await this.unselect();

	// }



	// getParam(key) {

	// 	let value = this.getParams()[key];

	// 	if (value === undefined) {

	// 		if (this.resource.params && this.resource.params[key] !== undefined) {

	// 			return this.parse(this.resource.params[key]).toString();

	// 		} else {

	// 			return this.parent.getContent(key).value;

	// 		}

	// 	} else {

	// 		return value;

	// 	}

	// }

	// async setParam(value, key) {

	// 	const params = this.getParams() || {};

	// 	if (params[key] !== value) {

	// 		await this.setParams({ ...params, [key]: value });

	// 	}

	// }

	// getContent(key) {

	// 	let value = this.getParam(key);

	// 	return new KarmaFieldsAlpha.Content(value);

	// }

	// async setValue(value, key) {

	// 	await this.setParam(value, key);

	// }


	// async render() {

	// 	return this.parent.render();


	// 	// local rendering dactivated !

	// 	if (this.element && this.element.parentNode.matches("dialog")) {

	// 		if (!this.rendering) {

	// 			this.rendering = true;

	// 			this.element.classList.add("container-loading");

	// 			await KarmaFieldsAlpha.server.init();

	// 			await abduct(this.element.parentNode, this.build());

	// 			while (KarmaFieldsAlpha.server.hasOrder()) {

	// 				await KarmaFieldsAlpha.server.process();

	// 				await abduct(this.element.parentNode, this.build());

	// 			}

	// 			this.element.classList.remove("container-loading");

	// 			this.rendering = false;

	// 		} else {

	// 			console.warn("Rendering under process!", this);

	// 		}

	// 	} else {

	// 		await this.parent.render();

	// 	}

	// }

	// abduct() {

	// 	if (this.element) {

	// 		return abduct(this.element, this.buildContent());

	// 	} else {

	// 		return this.parent.abduct();

	// 	}

	// }

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
	// getKeys() {

	// 	const key = this.getKey();
	// 	let keys = [];

	// 	if (key) {

	// 		keys.push(key);

	// 	} else {

	// 		const body = this.getBody();

	// 		if (body) {

	// 			keys.push(...body.getKeys());

	// 		}

	// 	}

	// 	return keys;

	// }

	// exportDefaults() {

	// 	let defaults = new KarmaFieldsAlpha.Content({});

	// 	const header = this.getHeader();
	// 	const footer = this.getFooter();

	// 	if (header) {

	// 		const response = header.exportDefaults();

	// 		if (response.loading) {

	// 			defaults.loading = true;

	// 		} else {

	// 			defaults.value = { ...defaults.toObject(), ...response.toObject() };

	// 		}

	// 	}

	// 	if (footer) {

	// 		const response = footer.exportDefaults(defaults);

	// 		if (response.loading) {

	// 			defaults.loading = true;

	// 		} else {

	// 			defaults.value = { ...defaults.toObject(), ...response.toObject() };

	// 		}

	// 	}

	// 	return defaults;

	// }

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

			return this.createChild(this.resource.body, "body");

		} else { // compat

			return this.createChild({
				children: this.resource.children || [],
				type: "group"
			}, "body");

		}

	}

	// getPopup() {

	// 	// default -> nothing

	// }

	blank() {

		if (!this.hasFocus()) {

			// this.setSelection({ index: 0, length: 0 });

			// const body = this.getBody();

			// if (body && body.unselect) {

			// 	await body.unselect();

			// }

			this.setFocus(true);
			this.render();

		}

	}

	// async unselect() {

	// 	const body = this.getChild("body");

	// 	if (body && body.unselect) {

	// 		await body.unselect();

	// 	}

	// }

	// getHeaderTop(element) {

	// 	let scrollContainer = element.closest(".scroll-container");
	// 	let popup = element.closest(".popup");
	// 	let top = 0;

	// 	if (!scrollContainer && !popup) {

	// 		const adminBar = document.getElementById("wpadminbar");

	// 		if (adminBar) {

	// 			top += adminBar.clientHeight;

	// 		}

	// 	}

	// 	return top;
	// }

	// getModalTop(element) {

	// 	let tableBody = element.closest(".table-body");
	// 	let tableHeader = tableBody.previousElementSibling;

	// 	let top = 0;

	// 	if (tableHeader) {

	// 		top += this.getHeaderTop(tableHeader);

	// 		top += tableHeader.clientHeight;

	// 	} else {

	// 		let scrollContainer = element.parentNode.closest(".scroll-container");

	// 		if (!scrollContainer) {

	// 			const adminBar = document.getElementById("wpadminbar");

	// 			if (adminBar) {

	// 				top += adminBar.clientHeight;

	// 			}

	// 		}

	// 	}

	// 	return top;
	// }

	// getModalHeight(element) {

	// 	let scrollContainer = element.parentNode.closest(".scroll-container");
	// 	let tableBody = element.closest(".table-body");
	// 	let tableHeader = tableBody.previousElementSibling;
	// 	let tableFooter = tableBody.nextElementSibling;
	// 	let height = 0;

	// 	if (scrollContainer) {

	// 		height = scrollContainer.clientHeight;

	// 	} else {

	// 		height = window.innerHeight;

	// 		const adminBar = document.getElementById("wpadminbar");

	// 		if (adminBar) {

	// 			height -= adminBar.clientHeight;

	// 		}

	// 	}

	// 	if (tableHeader) {

	// 		height -= tableHeader.clientHeight;

	// 	}

	// 	if (tableFooter) {

	// 		height -= tableFooter.clientHeight;

	// 	}

	// 	return height;
	// }

	newChild(id) {

		if (id === "header") {

			return this.getHeader();

		} else if (id === "footer") {

			return this.getFooter();

		} else if (id === "body") {

			return this.getBody();

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

	*buildBody() {

		const body = this.getBody();

		if (body) {

			yield {
				class: "body-content",
				children: body.build()
			};

		}

	}

	// *buildPopup() {

	// 	const popup = this.getPopup();

	// 	if (popup) {

	// 		yield {
	// 			tag: "dialog",
	// 			children: popup.build()
	// 		};

	// 	}

	// }

	abduct() {

		if (this.resource.sandbox && this.element) {

			return abduct(this.element, this.buildContent());

		} else {

			return this.parent.abduct();

		}

	}

	*buildContent() {

		// yield* this.buildHeader();
		// yield* this.buildBody();
		// yield* this.buildFooter();

		yield {
			class: "container-header",
			children: this.buildHeader()
		};

		yield {
			class: "container-body",
			children: this.buildBody()
		};

		yield {
			class: "container-footer",
			children: this.buildFooter(),
			update: element => {
				element.classList.toggle("sticky", this.resource.footer && this.resource.footer.sticky !== false);
			}
		};

	}

	*build() {
		yield {
			class: "container-field",
			update: element => {
				element.onmousedown = event => {
					event.stopPropagation();
					if (!this.hasFocus()) {
						this.setFocus(true);
						this.render();
					}
				}
				this.element = element;
			},
			children: this.buildContent()
		};

	}

}

KarmaFieldsAlpha.field.container.header = class extends KarmaFieldsAlpha.field.group {

  constructor(resource, id, parent) {

    super({
      display: "flex",
      children: [
        "title",
        "close"
      ],
      ...resource
    }, id, parent);

  }

}

KarmaFieldsAlpha.field.container.title = class extends KarmaFieldsAlpha.field.text {

  constructor(resource, id, parent) {

    super({
      tag: "h1",
      style: "flex-grow:1",
      class: "ellipsis",
      content: "Title",
      ...resource
    }, id, parent);

  }

  getContent() {

		return this.queryLabel();

  }

}

KarmaFieldsAlpha.field.container.close = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      dashicon: "no",
      title: "Close",
      action: "close",
			visible: ["request", "isPopup"],
      ...resource
    }, id, parent);
  }
}


KarmaFieldsAlpha.field.container.footer = class extends KarmaFieldsAlpha.field.group {

  constructor(resource, id, parent) {

    super({
      display: "flex",
      children: [],
      ...resource
    }, id, parent);

  }

}

// KarmaFieldsAlpha.field.container.single = class extends KarmaFieldsAlpha.field.group {

// 	*build() {

// 		yield {
// 			class: "form-single",
// 			children: super.build()
// 		};

// 	}

// }
