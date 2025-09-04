
// KarmaFieldsAlpha.field.richtext = class extends KarmaFieldsAlpha.field.textarea {}

KarmaFieldsAlpha.field.richtext = class extends KarmaFieldsAlpha.field.input {

	constructor(resource, id, parent) {

		super(resource, id, parent);

		// this.editor = new KarmaFieldsAlpha.Editor();

	}

	getRange() {

		const editor = this.getEditor();

		if (editor) {

			return editor.beam;

		}

	}

	isRangeCollapsed() {

		const rangePath = this.getState("rangePath");

		if (rangePath) {

			return rangePath.length === 1;

		}

		return false;

	}

	// abduct() {

	// 	if (this.container && this.editor) {

	// 		return abduct(this.container, this.buildContent());

	// 	} else {

	// 		return this.parent.abduct();

	// 	}

	// }

	// render(deep) {

	// 	if (deep) {

	// 		delete this.container;
	// 		delete this.editor;
	// 		delete this.editorRegistered;

	// 	}

	// 	super.render();

	// }

	// async abduct(local) {

	// 	if (local && this.headerContainer) {

	// 		await abduct(this.headerContainer, this.buildHeader());

	// 	} else {

	// 		await this.parent.abduct();

	// 	}

	// }

	async renderHeader() {

		if (this.headerContainer) {

			await abduct(this.headerContainer, this.buildHeader());

		}

	}

	// async loop() {

	// 	if (KarmaFieldsAlpha.server.loading) {

	// 		return new Promise(resolve => void setTimeout(resolve, 500));

	// 	}

	// 	KarmaFieldsAlpha.server.loading = true;

	// 	// await this.abduct();
	// 	await abduct(this.container, this.buildContent());

	// 	document.body.classList.add("karma-field-loading");

	// 	while (KarmaFieldsAlpha.server.hasOrder()) { // need loading when inserting file

	// 		await KarmaFieldsAlpha.server.process();

	// 		await abduct(this.container, this.buildContent());

	// 	}

	// 	KarmaFieldsAlpha.server.loading = false;

	// 	document.body.classList.remove("karma-field-loading");

	// }




	// async render() {

	// 	const focus = this.getFocus();

	// 	document.body.classList.toggle("karma-table-open", focus.includes("popup"));

	// 	return this.loop();

	// }

	getEditor() {

		return this.getData("editor");

		// return this.editor;

	}

	initEditor() {

		this.editor.init();

		this.editor.onSelectionChange = () => {
			CSS.highlights.clear();
			const pathes = this.editor.getPathes();
			this.setState(pathes, "rangePath");

			this.render();
		};

		this.editor.onInput = inputType => {
			const content = this.editor.content;
			this.save(inputType, inputType);
			this.setValue([content]);
			this.parent.render();
		}

		this.editor.onUndo = () => {
			KarmaFieldsAlpha.History.undo();
		}
		this.editor.onRedo = () => {
			KarmaFieldsAlpha.History.redo();
		}

	}

	createEditor(element) {

		const editor = new KarmaFieldsAlpha.Editor(element);

		this.setData(editor, "editor");

		return editor;

	}

	initFull(editor, element) {

		let values = this.getValue();
		const hasFocus = this.hasFocus();
		const mixed = this.isMixed();

		editor.element = element;

		element.ondblclick = event => {

			if (editor.has("IMG")) {

				const field = this.getChild("filesAttacher");
				if (field) {
					field.edit();
					this.render();
				}
			}
		}

		element.onfocus = event => {
			this.setFocus(mixed);
			this.render(true); // update clipboard textarea, unselect other stuffs
		}





		// element.classList.toggle("loading", Boolean(content.loading));

		if (values !== undefined) {



			element.classList.toggle("mixed", mixed);
			element.classList.toggle("selected", Boolean(mixed && hasFocus));
			// element.parentNode.classList.toggle("modified", Boolean(values.modified));

			if (mixed) {

				element.value = "[mixed values]";
				element.readOnly = true;

			} else {

				if (this.resource.readonly) {

					element.readOnly = this.parseBoolean(this.resource.readonly) || false;

				} else {

					element.readOnly = false;

				}

				if (values[0]) {

					element.classList.remove("placeholder");

				} else {

					values[0] = this.getPlaceholder();

					if (values && values[0]) {

						element.classList.add("placeholder");

					}

				}

				if (hasFocus && document.activeElement !== element) {

					element.focus({preventScroll: false});

				}

				let value = editor.sanitize(values[0] || "");

				editor.setContent(value);
				// this.editor.setContent(values[0]);

				const rangePath = this.getState("rangePath");

				if (rangePath) {

					editor.setPathes(rangePath); // -> trigger updateSelectedTags at ends

				}

				editor.onInput = (inputType, content) => {
					// const values = this.getValue();
					if (content !== value) {
						value = content;
						this.save(inputType, inputType);
						this.setValue([content]);
						const pathes = editor.getPathes();
						this.setState(pathes, "rangePath");

						this.render();
					}
				}

				editor.onUndo = () => {
					KarmaFieldsAlpha.History.undo();
				}
				editor.onRedo = () => {
					KarmaFieldsAlpha.History.redo();
				}

				if (hasFocus) {
					editor.init();
					const range = editor.createRange();
					if (range) { // -> range is undefined if selection is outside editor
						editor.beam = range;
						editor.updateSelectedTags();
						// CSS.highlights.clear();
						// const pathes = this.editor.getPathes();
						// this.setState(pathes, "rangePath");
						// this.debounce(() => {
						// this.render();
						// }
					}

					// this.editor.beam = this.editor.createRange();
					// this.editor.updateSelectedTags();

					KarmaFieldsAlpha.Editor.onSelectionChange = () => {
						const range = editor.createRange();
						if (range) { // -> range is undefined if selection is outside editor
							editor.beam = range;
							editor.updateSelectedTags();
							CSS.highlights.clear();
							const pathes = editor.getPathes();
							this.setState(pathes, "rangePath");
							this.renderHeader(); // -> header only rendering
						}


					};


				}

			}

		}

	}

	// initFull(element) {



	// 	this.editor.element = element;

	// 	let values = this.getValue();
	// 	const hasFocus = this.hasFocus();
	// 	const mixed = this.isMixed();

	// 	element.ondblclick = event => {

	// 		if (this.editor.has("IMG")) {

	// 			const field = this.getChild("filesAttacher");
	// 			if (field) {
	// 				field.edit();
	// 				this.render();
	// 			}
	// 		}
	// 	}

	// 	element.onfocus = event => {
	// 		// this.editor.updateSelectedTags();
	// 		this.setFocus(mixed);
	// 		this.render(true); // update clipboard textarea, unselect other stuffs
	// 	}





	// 	// element.classList.toggle("loading", Boolean(content.loading));

	// 	if (values !== undefined) {



	// 		element.classList.toggle("mixed", mixed);
	// 		element.classList.toggle("selected", Boolean(mixed && hasFocus));
	// 		// element.parentNode.classList.toggle("modified", Boolean(values.modified));

	// 		if (mixed) {

	// 			element.value = "[mixed values]";
	// 			element.readOnly = true;

	// 		} else {

	// 			if (this.resource.readonly) {

	// 				element.readOnly = this.parseBoolean(this.resource.readonly) || false;

	// 			} else {

	// 				element.readOnly = false;

	// 			}

	// 			if (values[0]) {

	// 				element.classList.remove("placeholder");

	// 			} else {

	// 				values[0] = this.getPlaceholder();

	// 				if (values && values[0]) {

	// 					element.classList.add("placeholder");

	// 				}

	// 			}

	// 			if (hasFocus && document.activeElement !== element) {

	// 				element.focus({preventScroll: false});

	// 			}

	// 			let value = this.editor.sanitize(values[0] || "");

	// 			this.editor.setContent(value);
	// 			// this.editor.setContent(values[0]);

	// 			const rangePath = this.getState("rangePath");

	// 			if (rangePath) {

	// 				this.editor.setPathes(rangePath); // -> trigger updateSelectedTags at ends

	// 			}

	// 			this.editor.onInput = (inputType, content) => {
	// 				// const values = this.getValue();
	// 				if (content !== value) {
	// 					value = content;
	// 					this.save(inputType, inputType);
	// 					this.setValue([content]);
	// 					const pathes = this.editor.getPathes();
	// 					this.setState(pathes, "rangePath");
	// 					this.render(true);
	// 				}
	// 			}

	// 			this.editor.onUndo = () => {
	// 				KarmaFieldsAlpha.History.undo();
	// 			}
	// 			this.editor.onRedo = () => {
	// 				KarmaFieldsAlpha.History.redo();
	// 			}

	// 			if (hasFocus) {
	// 				this.editor.init();
	// 				const range = this.editor.createRange();
	// 				if (range) { // -> range is undefined if selection is outside editor
	// 					this.editor.beam = range;
	// 					this.editor.updateSelectedTags();
	// 					// CSS.highlights.clear();
	// 					// const pathes = this.editor.getPathes();
	// 					// this.setState(pathes, "rangePath");
	// 					// this.debounce(() => {
	// 					// this.render();
	// 					// }
	// 				}

	// 				// this.editor.beam = this.editor.createRange();
	// 				// this.editor.updateSelectedTags();

	// 				KarmaFieldsAlpha.Editor.onSelectionChange = () => {
	// 					const range = this.editor && this.editor.createRange();
	// 					if (range) { // -> range is undefined if selection is outside editor
	// 						this.editor.beam = range;
	// 						this.editor.updateSelectedTags();
	// 						CSS.highlights.clear();
	// 						const pathes = this.editor.getPathes();
	// 						this.setState(pathes, "rangePath");
	// 						this.render();
	// 					}


	// 				};


	// 			}

	// 		}

	// 	}

	// }


	toggleBold() {

		// this.editor.toggle("B");

		// KarmaFieldsAlpha.Store.promise(done => {
		// 	const editor = this.getEditor();
		// 	if (editor) {
		// 		editor.toggle("B");
		// 		done();
		// 	}
		// }, "editor-bold");

		this.toggle("B");

	}

	has(key) {

		const editor = this.getEditor();

		if (editor) {
			return editor.has(key);
		}

	}

	isBold() {

		return this.has("bold");

		// return this.editor.has("bold");

	}

	toggleItalic() {

		// this.editor.toggle("I");

		// KarmaFieldsAlpha.Store.promise(done => {
		// 	const editor = this.getEditor();
		// 	if (editor) {
		// 		editor.toggle("I");
		// 		done();
		// 	}
		// }, "editor-italic");

		this.toggle("I");

	}

	isItalic() {

		return this.has("I");

		// return this.editor.has("I");

	}

	hasHeading() {

		return this.has("heading");

		// return this.editor.has("heading");

	}

	execHeading() {

		// this.editor.toggle(this.resource.defaultHeading || "H1");

		// KarmaFieldsAlpha.Store.promise(done => {
		// 	const editor = this.getEditor();
		// 	if (editor) {
		// 		editor.toggle(this.resource.defaultHeading || "H1");
		// 		done();
		// 	}
		// }, "editor-heading");

		this.toggle(this.resource.defaultHeading || "H1");

	}

	isList(tagName = "UL") {

		return this.has(tagName);

		// return this.editor.has(tagName);

	}

	toggle(tagName) {

		KarmaFieldsAlpha.Store.promise(done => {
			const editor = this.getEditor();
			if (editor) {
				editor.toggle(tagName);
				done();
			}
		}, `editor-${tagName}`);

	}

	execList(tagName) {

		// this.editor.toggle(tagName);

		this.toggle(tagName);

	}


	addImage() {

		const field = this.getChild("filesAttacher");

		if (field) {

			field.edit();
			this.render();

		}

	}

	removeImage() {

		KarmaFieldsAlpha.Store.promise(done => {
			const editor = this.getEditor();
			if (editor) {
				editor.remove("FIGURE");
				done();
			}
		}, "editor-remove-image");

		// this.editor.remove("FIGURE");

	}

	getImages() {

		// return this.editor.query("FIGURE");

		const editor = this.getEditor();
		if (editor) {
			return editor.query("FIGURE");
		}

	}

	hasImage() {

		// return this.editor.has("FIGURE");

		return this.has("FIGURE");

	}

	insertImage2(...imgs) {

		// this.editor.insert(...imgs);

		KarmaFieldsAlpha.Store.promise(done => {
			const editor = this.getEditor();
			if (editor) {
				editor.insert(...imgs);
				done();
			}
		}, "editor-insert-image");

	}

	insertMore() {

		// const p = document.createElement("p");
		// p.innerHTML = "---";

		// this.editor.insert(p);

		KarmaFieldsAlpha.Store.promise(done => {
			const editor = this.getEditor();
			if (editor) {
				const p = document.createElement("p");
				p.innerHTML = "---";

				editor.insert(p);
				done();
			}
		}, "editor-insert-more");

	}

	query(tag) {

		const editor = this.getEditor();

		if (editor) {

			return editor.query(tag);

		}

	}

	getLinksUnder() {

		// return this.editor.query("A");
		return this.query("A");

	}

	isLink() {

		// return this.editor.has("A");
		return this.has("A");

	}

	createLink() {

		// const range = this.editor.beam;

		// // if (editor && range && editor.contains(range) && !range.collapsed) {
		// if (range && !range.collapsed) {

		// 	// Create a custom highlight for these ranges.
		// 	const highlight = new Highlight(range);

		// 	// Register the ranges in the HighlightRegistry.
		// 	CSS.highlights.set("richtext-highlight", highlight);

		// 	const linkField = this.getChild("linkForm", 0, 0);

		// 	linkField.setFocus();

		// }
		//

		KarmaFieldsAlpha.Store.promise(done => {

			const editor = this.getEditor();

			if (editor) {

				const range = editor.beam;

				if (range && !range.collapsed) {

					// Create a custom highlight for these ranges.
					const highlight = new Highlight(range);

					// Register the ranges in the HighlightRegistry.
					CSS.highlights.set("richtext-highlight", highlight);

					const linkField = this.getChild("linkForm", 0, 0);

					linkField.setFocus();

				}

				done();
			}
		}, "editor-link");




	}

	edit(tag, params) {

		KarmaFieldsAlpha.Store.promise(done => {
			const editor = this.getEditor();
			if (editor) {
				editor.edit(tag, params);
				done();
			}
		}, "editor-edit");

	}

	unwrap(tag) {

		KarmaFieldsAlpha.Store.promise(done => {
			const editor = this.getEditor();
			if (editor) {
				editor.unwrap(tag);
				done();
			}
		}, "editor-unwrap");

	}

	updateLink(params) {

		// this.editor.edit("A", params);
		this.edit("A", params);

	}


	unlink() {

		// this.editor.unwrap("A");
		this.unwrap("A");

	}


	getMode() {

		// const mixed = this.isMixed();

		// if (mixed) {

		// 	return "mixed";

		// } else {

		// 	return this.getState("mode") || "edit";

		// }

		let mode = this.getState("mode");

		if (!mode) {

			mode = this.resource.defaultMode || "edit";

		}

		return mode;

	}

	execMode(value) {

		this.setState(value, "mode");

	}

	toggleMode() {

		const mode = this.getMode();

		this.setState(mode === "edit" ? "code" : "edit", "mode");

	}

	getValue(key) {

		switch (key) {

			case "id":
				return this.parent.getValue("id");

			case "format":
				console.error("deprecated");
				return this.getFormat();



			case "bold":
			case "italic":
			case "strikethrough":
			case "superscript":
			case "subscript":
			case "JustifyLeft":
			case "JustifyCenter":
			case "JustifyRight":
			case "JustifyFull":
			case "JustifyNone":
				console.error("deprecated");
				return this.queryCommand(key);

			case "ul":
				console.error("deprecated");
				return this.queryUL();

			case "ol":
				console.error("deprecated");
				return this.queryOL();

			case "filename": {
				// let values = this.editor.query("FIGURE").map(figure => figure.node.querySelector("img")).filter(img => img).map(img => img.src);
				// if (values.length > 1 && values.slice(1).some(url => url !== values[0])) {
				// 	values.mixed = true;
				// }
				// return values;

				const figures = this.query("FIGURE");
				if (figures) {
					return figures.map(figure => figure.node.querySelector("img")).filter(img => img).map(img => img.src);
				}
				return;
			}

			case "formatHeading":
			case "heading": {
				let values = this.query("heading");
				if (values) {
					return values.map(heading => heading.node.tagName);
				}
				return;
				// let values = this.editor.query("heading").map(heading => heading.node.tagName);
				// if (values.length > 1 && values.slice(1).some(item => item !== values[0])) {
				// 	values.mixed = true;
				// }
				// return values;
			}

			case "href":
			case "target": {
				let links = this.query("A");
				if (links) {
					return links.map(link => link.node.getAttribute(key));
				}
				return;

				// if (!this.editor.element || !this.editor.beam) {
				// 	return;
				// }
				// const links = this.editor.query("A");
				// let values = links.map(link => link.node.getAttribute(key));
				// if (values.length > 1 && values.slice(1).some(item => item !== values[0])) {
				// 	values.mixed = true;
				// }
				// return values;
			}


			case "raw":
				return this.parent.getValue(this.getKey());


			default:
				return super.getValue();

		}

	}

	setValue(value, key) {

		switch (key) {

			case "heading": {
				// this.editor.edit(value[0]);
				this.edit(value[0]);
				break;
			}
			case "href":
			case "target": {
				this.edit("A", { [key]: value[0] });
				break;
			}

			case "format":
			case "formatHeading":
				this.edit(value[0]);
				// console.error("deprecated");
				// await this.setFormat(value);
				break;

			case "file":
				console.error("deprecated ?");
				const id = value[0];
				this.insert(id);
				this.setFocus(true);
				// await this.request("render");
				break;

			case "unlink":
			case "bold":
			case "italic":
			case "strikethrough":
			case "superscript":
			case "subscript":
			case "JustifyLeft":
			case "JustifyCenter":
			case "JustifyRight":
			case "JustifyFull":
			case "JustifyNone":
				console.error("deprecated");
				// this.execCommand(key);
				break;

			case "raw":
				this.parent.setValue(value, this.getKey());
				break;

			default:
				super.setValue(value);
				break;

		}
	}


	getDriver() {

		return this.resource.driver || "medias";

	}


	newChild(type) {

		if (type === "linkForm") {

			return new KarmaFieldsAlpha.field.richtext.linkForm(this.resource.linkForm, "linkForm", this);

		} else if (type === "imageForm") {

			return new KarmaFieldsAlpha.field.richtext.imageForm({
				...this.resource.imageForm
			}, "imageForm", this);

		} else if (type === "textarea") { // mixed

			return new KarmaFieldsAlpha.field.textarea({
				// key: "raw"
			}, "textarea", this);

		} else if (type === "code") { // code

			return new KarmaFieldsAlpha.field.textarea({
				// key: "raw"
			}, "textarea", this);

		} else if (type === "codemodetoolbar") {

			return new KarmaFieldsAlpha.field.richtext.buttons({
				children: ["separator", "edit"],
				...this.resource.textarea_buttons
			}, "codemodetoolbar", this);

		} else if (type === "editortoolbar") {

			return new KarmaFieldsAlpha.field.richtext.buttons(this.resource.buttons || this.resource.header, "editortoolbar", this);

		} else if (type === "attachFile") {

			return new KarmaFieldsAlpha.field.files({
				uploader: "wp",
				key: "file",
				mimetype: ["image"],
				...this.resource.attachFile
			}, "attachFile", this);

		} else if (type === "filesAttacher") {

			return new KarmaFieldsAlpha.field.richtext.filesAttacher({
				...this.resource.filesAttacher
			}, "filesAttacher", this);

		} else if (type === "headingForm") {

			return new KarmaFieldsAlpha.field.richtext.headingForm({
				...this.resource.headingForm
			}, "headingForm", this);

		}

	}


	// *buildMixed() {

	// 	if (this.mode === "mixed") {

	// 		yield {
	// 			class: "textarea",
	// 			children: this.getChild("textarea").build()
	// 		}

	// 	}

	// }

	// *buildCode() {

	// 	if (this.mode === "code") {

	// 		yield {
	// 			class: "editor-header",
	// 			children: [
	// 				{
	// 					// class: "toolbar simple-buttons",
	// 					class: "toolbar",
	// 					children: this.getChild("codemodetoolbar").build()
	// 				}
	// 			]
	// 		};

	// 		yield {
	// 			class: "textarea editor-body",
	// 			children: this.getChild("code").build()
	// 		};

	// 	}

	// }

	// *buildEditor() {

	// 	if (this.mode === "edit") {

	// 		yield {
	// 			class: "tinymce editor-body",
	// 			init: element => {
	// 				element.setAttribute("contenteditable", true);
	// 			},
	// 			update: element => {
	// 				this.initFull(element);
	// 			}
	// 		};

	// 		yield {
	// 			class: "editor-header",
	// 			update: element => {
	// 				this.headerContainer = element;
	// 			},
	// 			child: this.buildEditorHeader()
	// 		};



	// 		if (false) {

	// 			// yield {
	// 			// 	class: "tinymce editor-footer",
	// 			// 	update: node => {
	// 			// 		const children = [...this.getFooterChildren()];
	// 			// 		node.children = children.map(child => child.build());
	// 			// 		// node.element.style.gridTemplateRows = children.map(inspector => inspector.isActive() ? "1fr" : 0).join(" ");
	// 			// 	}
	// 			// };

	// 			yield {
	// 				class: "tinymce editor-footer",
	// 				update: node => {
	// 					this.footerContainer = node.element;
	// 				},
	// 				child: this.buildEditorFooter()
	// 			};

	// 		}

	// 		yield {
	// 			class: "editor-file-attacher",
	// 			update: element => {
	// 				this.fileAttacherContainer = element;
	// 			},
	// 			child: this.getChild("filesAttacher").build()
	// 		};

	// 	}

	// }

	// *buildEditorHeader() {
	// 	yield {
	// 		class: "editor-header-wrapper",
	// 		children: [
	// 			{
	// 				class: "toolbar simple-buttons",
	// 				children: this.getChild("editortoolbar").build()
	// 			},
	// 			...this.buildFooter()
	// 		]
	// 	};
	// }

	// *buildEditorFooter() {
	// 	yield {
	// 		class: "editor-footer-wrapper",
	// 		children: this.buildFooter()
	// 	};
	// }

	// buildInspectors() {

	// }



	*getFooterChildren() {

		yield this.getChild("linkForm");

		yield this.getChild("imageForm");

		yield this.getChild("headingForm");

	}

	*buildFooter() {

		for (let child of this.getFooterChildren()) {

			yield* child.build();

		}

	}

	*buildHeader() {

		yield {
			class: "editor-header-wrapper",
			children: [
				{
					class: "toolbar simple-buttons",
					children: this.getChild("editortoolbar").build()
				},
				{
					children: this.buildFooter()
				}
			]
		};

	}

	*buildMixed() {

		const mixed = this.isMixed();

		if (mixed) {

			yield {
				class: "textarea",
				children: this.getChild("textarea").build()
			};

		}

	}

	*buildCode() {

		const mixed = this.isMixed();
		const mode = this.getMode();

		if (mode === "code" && !mixed) {

			yield {
				class: "code-editor-header",
				children: [
					{
						class: "toolbar",
						children: this.getChild("codemodetoolbar").build()
					}
				]
			};

			yield {
				class: "code-editor-body",
				children: this.getChild("code").build()
			};

		}

	}

	// *buildEditor() {

	// 	const mixed = this.isMixed();
	// 	const mode = this.getMode();

	// 	if (mode === "edit" && !mixed) {

	// 		yield {
	// 			class: "tinymce editor-body",
	// 			init: element => {
	// 				element.setAttribute("contenteditable", true);
	// 			},
	// 			update: element => {
	// 				// if (!this.editorRegistered) {
	// 				// 	// this.editor = new KarmaFieldsAlpha.Editor(element);

	// 				// }
	// 				const editor = this.getEditor() || this.createEditor(element);
	// 				this.initFull(editor, element);
	// 			}
	// 		};

	// 		yield {
	// 			class: "editor-header",
	// 			update: element => {
	// 				this.headerContainer = element;
	// 			},
	// 			children: this.buildHeader()
	// 		};

	// 		yield {
	// 			class: "editor-file-attacher",
	// 			update: element => {
	// 				this.fileAttacherContainer = element;
	// 			},
	// 			children: this.getChild("filesAttacher").build()
	// 		};

	// 	}

	// }

	*buildEditor() {

		const mixed = this.isMixed();
		const mode = this.getMode();

		if (mode === "edit" && !mixed) {

			yield {
				class: "richtext-editor",
				update: element => {
					const hasFocus = this.hasFocusInside();
					element.classList.toggle("active", Boolean(hasFocus));
				},
				children: [
					{
						class: "tinymce editor-body",
						init: element => {
							element.setAttribute("contenteditable", true);
						},
						update: element => {
							const editor = this.getEditor() || this.createEditor(element);
							this.initFull(editor, element);
						}
					},
					{
						class: "editor-header",
						update: element => {
							this.headerContainer = element;
						},
						children: this.buildHeader()
					},
					{
						class: "editor-file-attacher",
						update: element => {
							this.fileAttacherContainer = element;
						},
						children: this.getChild("filesAttacher").build()
					}
				]
			}

		}

	}

	*buildContent() {

		// const mixed = this.isMixed() || false;
		// const mode = this.getState("mode") || "edit";

		yield {
			class: "mode mode-mixed",
			// update: element => {
			// 	element.classList.toggle("hidden", mixed);
			// },
			children: this.buildMixed()
			// children: mixed && [
			// 	{
			// 		class: "textarea",
			// 		children: this.getChild("textarea").build()
			// 	}
			// ]
		}

		yield {
			class: "mode mode-code",
			children: this.buildCode(),
			// children: mode === "code" && !mixed && [
			// 	{
			// 		class: "editor-header",
			// 		children: [
			// 			{
			// 				class: "toolbar",
			// 				children: this.getChild("codemodetoolbar").build()
			// 			}
			// 		]
			// 	},
			// 	{
			// 		class: "textarea editor-body",
			// 		children: this.getChild("code").build()
			// 	}
			// ],
			// update: element => {
			// 	element.classList.toggle("hidden", mode !== "code" || mixed);
			// }
		};

		yield {
			class: "mode mode-edit",
			children: this.buildEditor()
			// update: element => {
			// 	const hasFocus = this.hasFocusInside();
			// 	element.classList.toggle("active", Boolean(hasFocus));
			// 	// element.classList.toggle("hidden", mode !== "edit" || mixed);
			// }
			// children: mode === "edit" && !mixed && [
			// 	{
			// 		class: "tinymce editor-body",
			// 		init: element => {
			// 			element.setAttribute("contenteditable", true);
			// 		},
			// 		update: element => {
			// 			// if (!this.editorRegistered) {
			// 			// 	// this.editor = new KarmaFieldsAlpha.Editor(element);

			// 			// }
			// 			const editor = this.getEditor() || this.createEditor(element);
			// 			this.initFull(editor, element);
			// 		}
			// 	},
			// 	{
			// 		class: "editor-header",
			// 		update: element => {
			// 			this.headerContainer = element;
			// 		},
			// 		children: this.buildHeader()
			// 		// child: {
			// 		// 	class: "editor-header-wrapper",
			// 		// 	children: [
			// 		// 		{
			// 		// 			class: "toolbar simple-buttons",
			// 		// 			children: this.getChild("editortoolbar").build()
			// 		// 		},
			// 		// 		{
			// 		// 			children: this.buildFooter()
			// 		// 		}
			// 		// 	]
			// 		// }
			// 	},
			// 	// {
			// 	// 	class: "tinymce editor-footer",
			// 	// 	update: node => {
			// 	// 		this.footerContainer = node.element;
			// 	// 	},
			// 	// 	child: this.buildEditorFooter()
			// 	// },
			// 	{
			// 		class: "editor-file-attacher",
			// 		update: element => {
			// 			this.fileAttacherContainer = element;
			// 		},
			// 		children: this.getChild("filesAttacher").build()
			// 	}
			// ]
		};

	}

	*build() {

		// this.content = this.getContent();

		// if (this.content.mixed) {

		// 	this.mode = "mixed";

		// } else {

		// 	this.mode = this.getState("mode") || "edit";

		// }



			yield {
				class: "editor karma-tinymce",
				update: element => {
					this.container = element;
					// element.classList.toggle("loading", Boolean(this.content.loading));
					element.onmousedown = event => {
						event.stopPropagation();
						const mixed = this.isMixed();
						this.setFocus(mixed);
					}

					// const hasFocus = this.hasFocusInside();
					// element.classList.toggle("active", Boolean(hasFocus));
				},
				children: this.buildContent()
			}

	}

}


// KarmaFieldsAlpha.field.tinymce.buttons = {
// 	type: "group",
// 	display: "flex",
// 	children: ["format", "bold", "italic", "link", "ul", "ol", "image", "code"],
// }

// KarmaFieldsAlpha.field.tinymce.register("buttons", {
// 	type: "group",
// 	display: "flex",
// 	children: ["format", "bold", "italic", "link", "ul", "ol", "image", "code"],
// });

KarmaFieldsAlpha.field.richtext.buttons = class extends KarmaFieldsAlpha.field.group {

	constructor(resource, id, parent) {

		super({
			display: "flex",
			simplebuttons: true,
			// children: ["format", "bold", "italic", "link", "ul", "ol"],
			// children: ["format", "bold", "italic", "link", "ul", "ol", "image", "code"],
			children: ["heading", "bold", "italic", "link", "ul", "ol", "image", "more", "format", "separator", "code"],
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.richtext.buttons.format = class extends KarmaFieldsAlpha.field.dropdown {
	constructor(resource, id, parent) {
		super({
			type: "dropdown",
			key: "formatHeading",
			options: [
				// {id: "", name: "Format"},
				{id: "H1", name: "H1"},
				{id: "H2", name: "H2"},
				{id: "H3", name: "H3"},
				{id: "H4", name: "H4"},
				{id: "H5", name: "H5"},
				{id: "H6", name: "H6"}
				// {id: "p", name: "P"}
			],
			visible: ["request", "hasHeading"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.richtext.buttons.heading = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "heading",
			title: "Heading",
			action: "execHeading",
			active: ["request", "hasHeading"],

			// key: "heading",
			// value: ["resource", "heading"]
			...resource
		}, id, parent);
	}
}
// KarmaFieldsAlpha.field.richtext.buttons.headingFormat = class extends KarmaFieldsAlpha.field.dropdown {
// 	constructor(resource, id, parent) {
// 		super({
// 			type: "dropdown",
// 			key: "headingFormat",
// 			options: [
// 				{id: "", name: "Format"},
// 				{id: "h1", name: "H1"},
// 				{id: "h2", name: "H2"},
// 				{id: "h3", name: "H3"},
// 				{id: "h4", name: "H4"},
// 				{id: "h5", name: "H5"},
// 				{id: "h6", name: "H6"},
// 				{id: "p", name: "P"}
// 			],
// 			...resource
// 		}, id, parent);
// 	}
// }

KarmaFieldsAlpha.field.richtext.buttons.bold = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "editor-bold",
			title: "Bold",

			// action: "execNode",
			// params: ["strong"],
			action: "toggleBold",

			// active: ["request", "queryNode", "strong", "b"],

			active: ["request", "isBold"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.richtext.buttons.italic = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "editor-italic",
			title: "Italic",
			// action: "execCommand",
			action: "toggleItalic",
			// value: "italic",
			// params: ["italic"],
			// active: ["request", "queryCommand", "italic"],
			active: ["request", "isItalic"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.richtext.buttons.link = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "admin-links",
			title: "Link",
			action: "createLink",
			// request: ["insertLink"],
			// active: ["request", "getLinkUnder"],
			// active: ["request", "queryNode", "a"],
			active: ["request", "isLink"],
			// enabled: ["||", ["request", "hasContentSelected"], ["request", "queryLink"]],
			// disabled: ["request", "isRangeCollapsed"],
			disabled: ["&&", ["request", "isRangeCollapsed"], ["!", ["request", "isLink"]]],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.richtext.buttons.more = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "editor-insertmore",
			title: "More",
			action: "insertMore",
			...resource
		}, id, parent);
	}
}


// KarmaFieldsAlpha.field.tinymce.buttons.image = class extends KarmaFieldsAlpha.field.files {
// 	constructor(resource, id, parent) {
// 		super({
// 			// dashicon: "format-image",
// 			// title: "Image",
// 			// action: "attachMedias",
// 			// active: ["request", "queryImage"],
// 			// disabled: ["!", ["request", "hasContentSelected"]],
// 			...resource
// 		}, id, parent);
// 	}
//
// 	build() {
//
// 		return {
// 			children: [
// 				this.createChild({
// 					type: "button",
// 					simplebuttons: true,
// 					action: "open",
// 					dashicon: "format-image"
// 				}).build(),
// 				...this.buildPopup()
// 			]
// 		}
//
// 	}
//
// 	async insert(ids) {
//
// 		const mediaField = new KarmaFieldsAlpha.field.media({
// 			id: ids[0],
// 			driver: this.getDriver(),
// 			display: "full"
// 		}, "media", this);
//
// 		let media = await mediaField.getMedia();
//
// // 		console.log(media);
// // debugger;
// 		let postExcerpt = this.getWild("medias", ids[0], "post_excerpt");
//
// 		while (postExcerpt.loading) {
//
// 			await this.render();
// 			postExcerpt = this.getWild("medias", ids[0], "post_excerpt");
//
// 		}
//
// 		const element = document.createElement("div");
//
// 		// await KarmaFieldsAlpha.build({
// 		// 	tag: "figure",
// 		// 	children: [
// 		// 		{
// 		// 			tag: "img",
// 		// 			init: node => {
// 		// 				node.element.src = media.src;
// 		// 			}
// 		// 		},
// 		// 		{
// 		// 			tag: "figcaption",
// 		// 			init: node => {
// 		// 				node.element.innerHTML = postExcerpt.toString();
// 		// 			}
// 		// 		}
// 		// 	]
// 		// }, element);
//
// 		await KarmaFieldsAlpha.build({
// 			tag: "img",
// 			init: node => {
// 				node.element.src = media.src;
// 				node.element.setAttribute("data-id", ids[0]);
// 			}
// 		}, element);
//
// 		this.parent.request("insertImage", element.innerHTML);
//
//
// 		// let manager = this.parent.getEditor();
// 		//
// 		// if (!manager.loading) {
// 		//
// 		// 	manager.editor.execCommand(
// 		// 		'mceInsertContent',
// 		// 		false,
// 		// 		html
// 		// 	);
// 		//
// 		// 	// const node = manager.editor.selection.getNode();
// 		//
// 		// 	// manager.editor.selection.setNode(node.parentNode.parentNode);
// 		//
// 		// 	// manager.editor.selection.collapse(true);
// 		// 	//
// 		// 	// const node = manager.editor.selection.getNode();
// 		// 	//
// 		// 	// manager.editor.selection.select(node);
// 		//
// 		// 	const text = manager.editor.getContent();
// 		//
// 		// 	await this.setValue(text);
// 		//
// 		// 	await this.setFocus();
// 		//
// 		// 	await this.render();
// 		//
// 		// }
//
// 	}
//
// }

KarmaFieldsAlpha.field.richtext.buttons.image = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "format-image",
			title: "Image",
			action: "addImage",
			active: ["request", "hasImage"],
			// disabled: ["!", ["request", "hasContentSelected"]],
			...resource
		}, id, parent);
	}
}

// KarmaFieldsAlpha.field.tinymce.buttons.imageBKP = class extends KarmaFieldsAlpha.field.button {
// 	constructor(resource, id, parent) {
// 		super({
// 			dashicon: "format-image",
// 			title: "Image",
// 			action: "attachMedias",
// 			// active: ["request", "queryImage"],
// 			// disabled: ["!", ["request", "hasContentSelected"]],
// 			...resource
// 		}, id, parent);
// 	}
// }

KarmaFieldsAlpha.field.richtext.buttons.ul = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "editor-ul",
			title: "Unordered list",
			action: "execList",
			params: ["UL"],
			// active: ["request", "queryUL"],
			active: ["request", "isList", "UL"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.richtext.buttons.ol = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "editor-ol",
			title: "Ordered list",
			// action: "execOL",
			action: "execList",
			params: ["OL"],
			// active: ["request", "queryOL"],
			active: ["request", "isList", "OL"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.richtext.buttons.code = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "html",
			title: "Code",
			action: "toggleMode",
			// value: "code",
			// params: ["code"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.richtext.buttons.edit = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "html",
			title: "Code",
			action: "toggleMode",
			active: true,
			// value: "edit",
			// params: ["edit"],
			...resource
		}, id, parent);
	}
}


KarmaFieldsAlpha.field.richtext.buttons.strikethrough = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "editor-strikethrough",
			title: "Strikethrough",
			action: "execCommand",
			value: "strikethrough",
			active: ["request", "queryCommand", "strikethrough"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.richtext.buttons.superscript = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			// dashicon: "editor-strikethrough",
			title: "Superscript",
			action: "execCommand",
			value: "superscript",
			active: ["request", "queryCommand", "superscript"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.richtext.buttons.superscript = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			// dashicon: "editor-strikethrough",
			title: "Subscript",
			action: "execCommand",
			value: "subscript",
			active: ["request", "queryCommand", "subscript"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.richtext.buttons.justifyLeft = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "editor-alignleft",
			title: "JustifyLeft",
			action: "execCommand",
			value: "JustifyLeft",
			active: ["request", "queryCommand", "JustifyLeft"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.richtext.buttons.justifyCenter = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "editor-aligncenter",
			title: "JustifyCenter",
			action: "execCommand",
			value: "JustifyCenter",
			active: ["request", "queryCommand", "JustifyCenter"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.richtext.buttons.justifyRight = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "editor-alignright",
			title: "JustifyRight",
			action: "execCommand",
			value: "JustifyRight",
			active: ["request", "queryCommand", "JustifyRight"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.richtext.buttons.justifyFull = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "editor-justify",
			title: "JustifyFull",
			action: "execCommand",
			value: "JustifyFull",
			active: ["request", "queryCommand", "JustifyFull"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.richtext.buttons.justifyNone = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "editor-alignleft",
			title: "JustifyNone",
			action: "execCommand",
			value: "JustifyNone",
			active: ["request", "queryCommand", "JustifyNone"],
			...resource
		}, id, parent);
	}
}




// KarmaFieldsAlpha.field.richtext.form = class extends KarmaFieldsAlpha.field.group {
//
// 	isActive() {
//
// 		return this.hasFocusInside();
//
// 		// return this.hasFocusInside();
//
// 	}
//
// 	*build() {
//
//
// 		if (this.isActive()) {
//
// 			yield super.build();
//
// 			// yield {
// 			// 	class: "karma-tinymce-contextual-tools active",
// 			// 	child: super.build(),
// 			// 	init: node => {
// 			// 		node.element.onmousedown = event => {
// 			// 			event.stopPropagation();
// 			// 		}
// 			// 	}
// 			// }
//
// 			// yield {
// 			// 	class: "karma-tinymce-popover active",
// 			// 	child: super.build(),
// 			// 	init: popover => {
// 			// 		popover.element.onmousedown = event => {
// 			// 			event.stopPropagation();
// 			// 		}
// 			// 	},
// 			// 	update: popover => {
// 			//
// 			// 		const editorBody = this.parent.getEditorContainer().parentNode;
// 			//
// 			// 		const range = this.parent.getRange();
// 			//
// 			// 		if (range) {
// 			//
// 			// 			const containerBox = editorBody.getBoundingClientRect();
// 			//
// 			// 			let box;
// 			//
// 			// 			if (range.collapsed) {
// 			// 				let node = range.startContainer;
// 			// 				if (node.nodeType !== 1) {
// 			// 					node = node.parentNode;
// 			// 				}
// 			// 				box = node.getBoundingClientRect();
// 			// 			} else {
// 			// 				box = range.getBoundingClientRect();
// 			// 			}
// 			//
// 			// 			const parentWidth = popover.element.parentNode.parentNode.clientWidth;
// 			// 			const width = Math.min(360, containerBox.width);
// 			// 			const left = Math.min(box.left - containerBox.left, parentWidth - width);
// 			// 			let top = box.top - containerBox.top + box.height + 5;
// 			//
// 			// 			popover.element.style.left = `${left.toFixed()}px`;
// 			// 			popover.element.style.top = `${top.toFixed()}px`;
// 			// 			popover.element.style.width = `${width.toFixed()}px`;
// 			//
// 			// 		}
// 			//
// 			//
// 			//
// 			//
// 			// 	}
// 			// };
//
// 		}
//
// 	}
//
// }


KarmaFieldsAlpha.field.richtext.linkForm = class extends KarmaFieldsAlpha.field.group {

	constructor(resource, id, parent) {
		super({
			// key: "linkform",
			// selector: "a",
			// display: "flex",
			children: [
				// "linkFormInput",
				{
					type: "group",
					display: "flex",
					children: [
						{
							type: "input",
							key: "href",
							// label: "Link",
							width: "1fr"
						},
						{
							type: "checkbox",
							key: "target",
							text: "Open in new tab",
							true: "_blank",
							false: ""
						},
						{
							type: "attachFile",
							// label: "Media"
						},
						{
							type: "button",
							// label: "Unlink",
							dashicon: "editor-unlink",
							action: "unlink"
						},
						{
							type: "button",
							dashicon: "no-alt",
							action: "close"
						}
					]
				}


				// "attachFile",
				// "target"
				// "linkFormFooter"
			],
			...resource
		}, id, parent);
	}

	*build() {

		const isActive = this.isActive();

		yield {
			class: "inspector linkform-container",
			update: element => {
				element.classList.toggle("hidden", !isActive);
			},
			children: isActive && super.build()
		};

	}

	isActive() {

		return this.hasFocusInside() || this.request("isLink") && this.parent.hasFocus();

	}

	close() {

		// getLinksUnder
		// const editor = this.parent.getEditor();
		//
		// const links = editor.nodes.filter(node => node.tagName === "A");
		//
		// if (links.length) {
		//
		// 	editor.range.setStartAfter(links[links.length-1]);
		// 	editor.range.collapse(true);
		//
		// }

		// const editor = KarmaFieldsAlpha.Editor;
		const editor = this.parent.getEditor();

		if (editor) {

			const links = editor.query("A");

			if (links && links.length) {

				const range = editor.getRange();

				range.setStartAfter(links[links.length-1].node);
				range.collapse(true);

			}

			this.parent.setFocus();

		}

	}

	// parseLink(node) {
	//
	// 	const object = {};
	//
	// 	object.href = node.getAttribute("href");
	// 	object.target = node.getAttribute("target");
	//
	// 	return object;
	// }
	//
	// getContent(subkey) {
	//
	// 	const response = new KarmaFieldsAlpha.Content();
	//
	// 	const linkNode = this.request("getEditorNode", "a");
	//
	// 	if (linkNode) {
	//
	// 		response.value = this.parseLink(linkNode)[subkey] || "";
	//
	// 	}
	//
	// 	return response;
	// }
	//
	// setValue(value, subkey) {
	//
	//
	// 	return this.request("updateLink", {[subkey]: value});
	//
	// 	// let params = {[subkey]: value};
	// 	//
	// 	// const linkNode = this.request("getEditorNode", "a");
	// 	//
	// 	// if (linkNode) {
	// 	//
	// 	// 	params = {...this.parseLink(linkNode), ...params};
	// 	//
	// 	// }
	// 	//
	// 	// ;
	// 	//
	// 	// if (subkey === "href") {
	// 	//
	// 	//
	// 	//
	// 	// }
	//
	//
	//
	// 	// const state = this.getData("data") || {};
	// 	//
	// 	// state[subkey] = value;
	// 	//
	// 	// return this.setData(state, "data");
	//
	//
	//
	// }
	//
	// async submit() {
	//
	// 	let href = this.getContent("href");
	// 	let target = this.getContent("target");
	// 	// let request = this.parent.getEditor();
	//
	// 	this.parent.insertLink(href.toString(), target.toString() ? "_blank" : "");
	//
	// 	this.setData({}, "data");
	//
	//
	// }
	//
	// async close() {
	//
	// 	// KarmaFieldsAlpha.server.setData({}, this.uid);
	// 	//
	// 	// // this.parent.setFocus();
	// 	//
	// 	// // const request = this.parent.getEditor();
	// 	//
	// 	// this.setData({}, "data");
	//
	// 	await this.parent.setFocus();
	//
	// 	await this.render();
	//
  // }

	// async hasChange() {
	//
	// 	const response = new KarmaFieldsAlpha.Content();
	//
	// 	const data = this.getState();
	//
	// 	response.value = Boolean(data && Object.values(data.toObject()).length);
	//
	// 	return response;
	//
	// }

}




KarmaFieldsAlpha.field.richtext.linkFormInput = class extends KarmaFieldsAlpha.field.group {
	constructor(resource, id, parent) {
		super({
			display: "flex",
			children: [
				"href",
				"attachFile"
				// "applyButton"
			],
			...resource
		}, id, parent);
	}

}

KarmaFieldsAlpha.field.richtext.linkFormFooter = class extends KarmaFieldsAlpha.field.group {
	constructor(resource, id, parent) {
		super({
			display: "flex",
			children: [
				"cancel",
				"unlink"
				// "separator",
				// "applyButton"
			],
			...resource
		}, id, parent);
	}

}




KarmaFieldsAlpha.field.richtext.linkForm.href = class extends KarmaFieldsAlpha.field.input {

	constructor(resource, id, parent) {

		super({
			key: "href",
			style: "flex-grow:1",
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.richtext.linkForm.target = class extends KarmaFieldsAlpha.field.checkbox {

	constructor(resource, id, parent) {

		super({
			key: "target",
			text: "Open in new tab",
			true: "_blank",
			false: "",
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.richtext.linkForm.cancel = class extends KarmaFieldsAlpha.field.button {

	constructor(resource, id, parent) {

		super({
			text: "Cancel",
			request: ["close"],
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.richtext.linkForm.unlink = class extends KarmaFieldsAlpha.field.button {

	constructor(resource, id, parent) {

		super({
			text: "Unlink",
			action: "unlink",
			// disabled: ["!", ["getValue", "href"]],
			...resource
		}, id, parent);

	}

}
KarmaFieldsAlpha.field.richtext.linkForm.applyButton = class extends KarmaFieldsAlpha.field.button {

	constructor(resource, id, parent) {

		super({
				text: "Apply",
				action: "submit",
				primary: true,
			...resource
		}, id, parent);

	}

}



KarmaFieldsAlpha.field.richtext.headingForm = class extends KarmaFieldsAlpha.field.group {

	constructor(resource, id, parent) {
		super({
			display: "flex",
			children: [
				{
					type: "dropdown",
					key: "heading",
					options: [
						{id: "H1", name: "H1"},
						{id: "H2", name: "H2"},
						{id: "H3", name: "H3"},
						{id: "H4", name: "H4"},
						{id: "H5", name: "H5"},
						{id: "H6", name: "H6"},
						{id: "P", name: "P"}
					]
				}
			],
			...resource
		}, id, parent);
	}

	*build() {

		const isActive = this.isActive();

		yield {
			class: "inspector headingForm-container",
			update: element => {
				element.classList.toggle("hidden", !isActive);
			},
			children: isActive && super.build()
		};

	}

	isActive() {

		return this.hasFocusInside() || this.request("hasHeading") && this.parent.hasFocus();

	}

	// getContent(subkey) {
	//
	// 	const response = new KarmaFieldsAlpha.Content();
	//
	// 	const linkNode = this.request("getEditorNode", "a");
	//
	// 	if (linkNode) {
	//
	// 		response.value = this.parseLink(linkNode)[subkey] || "";
	//
	// 	}
	//
	// 	return response;
	// }
	//
	// setValue(value, subkey) {
	//
	//
	// 	return this.request("updateLink", {[subkey]: value});
	//
	//
	//
	// }

}

// KarmaFieldsAlpha.field.tinymce.linkForm.attachFile = class extends KarmaFieldsAlpha.field.button {
//
// 	constructor(resource, id, parent) {
//
// 		super({
// 			dashicon: "paperclip",
// 			action: "attachfile",
// 			...resource
// 		}, id, parent);
//
// 	}
//
// 	getDriver() {
//
//     return this.resource.driver || "medias";
//
//   }
//
// 	async insert(id) {
//
// 		const mediaField = new KarmaFieldsAlpha.field.media({
// 			id: id,
// 			driver: this.getDriver(),
// 			display: "full"
// 		}, "media", this);
//
// 		let media = await mediaField.getMedia();
//
// 		// while (item.loading) {
// 		while (media.icon === "loading") {
//
// 			await this.render();
// 			media = await mediaField.getMedia();
//
// 		}
//
// 		await this.parent.setValue(media.src, "href");
//
// 	}
//
// 	getContent(key) {
//
// 		if (key === "file") {
//
// 			return new KarmaFieldsAlpha.Content();
//
// 		}
//
// 		return super.getContent(key);
// 	}
//
//
// 	async setValue(value, key) {
//
// 		if (key === "file" && value && value[0]) {
//
// 			const id = value[0];
// 			await this.insert(id);
//       await this.setFocus(true);
//       await this.request("render");
//
// 		}
//
// 	}
//
// 	async attachfile() {
//
// 		const filesField = new KarmaFieldsAlpha.field.files({
// 			uploader: "wp",
// 			key: "file",
// 			mimetype: []
// 		}, "attachFile", this);
//
// 		await filesField.edit();
//
// 	}
//
//
//
// }


KarmaFieldsAlpha.field.richtext.linkForm.attachFile = class extends KarmaFieldsAlpha.field.files {

	// constructor(resource, id, parent) {

	// 	super({
	// 		// uploader: "wp",

	// 		// dashicon: "paperclip",
	// 		// action: "attachfile",
	// 		...resource
	// 	}, id, parent);

	// }

	getDriver() {

    return this.resource.driver || "medias";

  }

	// getFooter() {
	//
	// 	return this.createChild({
	// 		type: "button",
	// 		action: "open",
	// 		dashicon: "paperclip"
	// 	});
	//
	// }

	*build() {

		// yield {
		// 	children: [
		// 		this.createChild({
		// 			type: "button",
		// 			action: "open",
		// 			dashicon: "paperclip"
		// 		}).build(),
		// 		...this.buildPopup()
		// 	]
		// }

		yield* this.createChild({
			type: "button",
			action: "open",
			dashicon: "paperclip"
		}, "0").build();

		yield* this.buildPopup()

	}

	// async insert(ids) {
	//
	// 	const mediaField = new KarmaFieldsAlpha.field.media({
	// 		id: ids[0],
	// 		driver: this.getDriver(),
	// 		display: "full"
	// 	}, "media", this);
	//
	// 	let media = await mediaField.getMedia();
	//
	// 	while (media.icon === "loading") {
	//
	// 		await this.render();
	// 		media = await mediaField.getMedia();
	//
	// 	}
	//
	// 	await this.parent.setValue(media.src, "href");
	//
	// }

	insert(ids) {

		const filesAttacher = new KarmaFieldsAlpha.field.richtext.filesAttacher({}, "filesattacher", this);

		KarmaFieldsAlpha.server.promise(done => {
			const image = filesAttacher.queryImage(ids[0]);
			if (image !== undefined) {
				this.parent.setValue([image.src], "href");
				done();
			}
		});

	}

	// getContent(key) {
	//
	// 	if (key === "file") {
	//
	// 		return new KarmaFieldsAlpha.Content();
	//
	// 	}
	//
	// 	return super.getContent(key);
	// }
	//
	//
	// async setValue(value, key) {
	//
	// 	if (key === "file" && value && value[0]) {
	//
	// 		const id = value[0];
	// 		await this.insert(id);
  //     await this.setFocus(true);
  //     await this.request("render");
	//
	// 	}
	//
	// }
	//
	// async attachfile() {
	//
	// 	const filesField = new KarmaFieldsAlpha.field.files({
	// 		uploader: "wp",
	// 		key: "file",
	// 		mimetype: []
	// 	}, "attachFile", this);
	//
	// 	await filesField.edit();
	//
	// }



}



KarmaFieldsAlpha.field.richtext.filesAttacher = class extends KarmaFieldsAlpha.field.files {

	getBody() {}
	getFooter() {}

	getSelectedIds() { // extends Tags

		return this.listIds().toArray();

		// const selectedIds = [];

		// const figures = this.parent.getImages();

		// for (let figure of figures) {

		// 	const img = figure.node.querySelector("img");

		// 	if (img) {

		// 		const id = img.getAttribute("data-id");

		// 		if (id) {

		// 			selectedIds.push(id);

		// 		}

		// 	}

		// }

		// return selectedIds;

	}

	*listIds() {

		const figures = this.parent.getImages();

		for (let figure of figures) {

			const img = figure.node.querySelector("img");

			if (img) {

				const id = img.getAttribute("data-id");

				if (id) {

					yield id;

				}

			}

		}

	}

	getIds() {

		return [...this.listIds()];

	}

	getValue(key, id, driver) {

		if (key) {

			return super.getValue(key, id, driver);

		}

		return [...this.listIds()];

	}

	parseImage(element) {

		const container = element.parentNode;
		const figcaption = container && container.querySelector("figcaption");
		// const link = element.closest(".tinymce a");
		return {
			id: element.getAttribute("data-id"),
			src: element.src || "",
			srcset: element.srcset || "",
			sizes: element.sizes || "",
			width: element.width || "",
			height: element.height || "",
			alt: element.alt || "",
			caption: figcaption && figcaption.innerHTML || "",
			// link: link && link.href || "",
			// target: link && link.target || "",
			classes: container.className || ""
			// styleWidth: element.style.width || "",
			// styleHeight: element.style.height || ""
		};

	}

	createImage(object) {

		const img = new Image();

		if (object.id) {

			img.setAttribute("data-id", object.id || "");

		}

		if (object.src) {

			img.src = object.src;

		}

		if (object.width) {

			img.width = object.width;

		}

		if (object.height) {

			img.height = object.height;

		}

		if (object.srcset) {

			img.srcset = object.srcset;

		}

		if (object.sizes) {

			img.sizes = object.sizes;

		}

		if (object.alt) {

			img.alt = object.alt;

		}

		const figure = document.createElement("figure");

		if (object.id) {

			figure.id = `attachment-${object.id}`;

		}

		figure.appendChild(img);

		if (object.classes) {

			figure.className = object.classes;

		}

		const figcaption = document.createElement("figcaption");

		figcaption.innerHTML = object.caption || "<br>";

		figure.appendChild(figcaption);

		return figure;

	}

	getDriver() {

		return "medias";

	}

	queryImage(id) {

		// const response = new KarmaFieldsAlpha.Content({});

		const driver = this.getDriver();

		let filename = this.getValue("filename", id, driver);
		let dir = this.getValue("dir", id, driver);
		let mimetype = this.getValue("mimetype", id, driver);
		let width = this.getValue("width", id, driver);
		let height = this.getValue("height", id, driver);
		let caption = this.getValue("caption", id, driver);
		let alt = this.getValue("alt", id, driver);

		if (filename === undefined
			|| dir === undefined
			|| mimetype === undefined
			|| width === undefined
			|| height === undefined
			|| caption === undefined
			|| alt === undefined) {

			return;

		} else {

			const image = {
				id,
				width: width[0],
				height: height[0],
				caption: caption[0],
				alt: alt[0],
				src: `${KarmaFieldsAlpha.uploadURL}${dir[0]}/${filename[0]}`
			};

			if (mimetype[0] === "image/jpeg" || mimetype[0] === "image/jpg" || mimetype[0] === "image/png" || mimetype[0] === "image/webp") {

				let sizes = this.getValue("sizes", id, driver);

				if (sizes === undefined) {

					return;

				} else {

					if (sizes.length) {

						image.srcset = sizes.map(size => `${KarmaFieldsAlpha.uploadURL}${dir[0]}/${size.filename} ${size.width}w`).join(",");
						image.sizes = this.resource.sizes || "(min-width: 1024px) 1024px, 100vw";

					}

				}

			}

			return image;

		}



	}

	 insert(ids) {

		KarmaFieldsAlpha.server.promise(done => {
			const images = ids.map(id => this.queryImage(id));
			if (!images.some(image => image === undefined)) {
				this.parent.removeImage();
				for (let image of images) {
					const newImg = this.createImage(image);
					this.parent.insertImage2(newImg);
				}
				done();
			}
		}, "editor-query-image");

	}

}


// KarmaFieldsAlpha.field.richtext.imageForm = class extends KarmaFieldsAlpha.field.richtext.form {
// 	constructor(resource, id, parent) {
// 		super({
// 			children: [
// 				{
// 					type: "group",
// 					children: [
// 						{
// 							type: "group",
// 							display: "flex",
// 							children: [
// 								{
// 									type: "button",
// 									dashicon: "edit",
// 									title: "Replace Image",
// 									action: "addmedia"
// 								},
// 								{
// 									type: "button",
// 									dashicon: "align-none",
// 									action: "alignnone",
// 									// active: "alignnone"
// 								},
// 								{
// 									type: "button",
// 									dashicon: "align-left",
// 									action: "alignleft",
// 									// active: "alignleft"
// 								},
// 								{
// 									type: "button",
// 									dashicon: "align-center",
// 									action: "aligncenter",
// 									// active: "aligncenter"
// 								},
// 								{
// 									type: "button",
// 									dashicon: "align-right",
// 									action: "alignright",
// 									// active: "alignright"
// 								}
// 							]
// 						},
// 						{
// 							type: "checkbox",
// 							key: "has-caption",
// 							text: "Caption"
// 						},
// 						{
// 							type: "checkbox",
// 							key: "has-link",
// 							text: "Link"
// 						}
// 					]
// 				}
// 			],
// 			...resource
// 		}, id, parent);
// 	}
//
// 	getMax() {
//
// 		return Infinity;
//
// 	}
//
//
// 	async edit() {
//
// 		if (this.resource.uploader === "wp" || this.resource.library === "wp") {
//
//       await KarmaFieldsAlpha.field.files.prototype.openMediaLibrary.call(this);
//
//     } else {
//
//       await super.edit();
//
//     }
//
// 	}
//
// 	// attachfile() {
// 	//
// 	// 	const table = KarmaFieldsAlpha.mediasTable || "medias";
// 	//
// 	// 	// const selection = this.getSelection() || {};
// 	// 	// selection.final = true;
// 	//
// 	// 	this.parent.request("fetch", table);
// 	//
// 	// }
//
// 	async getContent(key) {
//
// 		return this.getState(key);
//
// 	}
//
// 	async setValue(value, key) {
//
// 		return this.setState(value, key);
//
// 	}
//
// 	async getSelectedIds() {
//
// 		return new KarmaFieldsAlpha.Content();
//
// 	}
//
// 	async insert(ids) {
//
// 		if (ids.length) {
//
// 			// await this.setValue(ids);
//
// 			await this.attachImages(ids);
//
// 		}
//
// 	}
//
// 	// build() {
// 	// 	return {
// 	// 		...super.build(),
// 	// 		complete: node => {
// 	// 			const attachments = this.getData().attachments;
// 	//
// 	// 			if (attachments && attachments.length) {
// 	// 				this.attachImages(attachments);
// 	// 			}
// 	// 		}
// 	// 	};
// 	// }
//
// 	async attachImages(ids) {
//
// 		const manager = this.parent.getEditor();
//
// 		if (manager.loading) {
//
// 			return;
//
// 		}
//
// 		const driver = "medias";
//
// 		const server = new KarmaFieldsAlpha.Server("medias");
//
// 		let grid = [];
//
// 		for (let id of ids) {
//
// 			for (let key of ["filename", "mimetype", "dir", "width", "height", "sizes", "alt", "caption"]) {
//
// 				const value = await server.getValue(id, key);
// 				grid.push(value);
//
// 			}
//
// 		}
//
// 		while (grid.some(item => item.loading)) {
//
// 			await this.render();
//
// 			grid = [];
//
// 			for (let id of ids) {
//
// 				for (let key of ["filename", "mimetype", "dir", "width", "height", "sizes", "alt", "caption"]) {
//
// 					const value = await server.getValue(id, key);
// 					grid.push(value);
//
// 				}
//
// 			}
//
// 		}
//
//
// 		for (let id of ids) {
//
// 			let html = "";
//
// 			let filename = await server.getValue(id, "filename");
// 			let mimetype = await server.getValue(id, "mimetype");
// 			let dir = await server.getValue(id, "dir");
// 			let width = await server.getValue(id, "width");
// 			let height = await server.getValue(id, "height");
// 			let alt = await server.getValue(id, "alt");
// 			let caption = await server.getValue(id, "caption");
// 			let sizes = await server.getValue(id, "sizes");
//
// 			if (mimetype.toString() === "image/jpeg" || mimetype.toString() === "image/png") {
//
// 				html = `<figure><img
// 					src="${KarmaFieldsAlpha.uploadURL+dir.toString()+"/"+filename.toString()}"
// 					width="${width.toString()}"
// 					height="${height.toString()}"
// 					data-id="${id}"
// 					srcset="${sizes.toArray().map(source => `${KarmaFieldsAlpha.uploadURL}${dir}/${source.filename} ${source.width}w`).join(", ")}"
// 					sizes="(min-width: ${width.toString()}px) ${width.toString()}px, 100vw"
// 					alt="${alt.toString()}"
// 				><figcaption>${caption.toString()}</figcaption></figure>`;
//
// 			} else if (mimetype.toString().startsWith("image")) {
//
// 				html = `<figure><img
// 					src="${KarmaFieldsAlpha.uploadURL+dir.toString()+"/"+filename.toString()}"
// 					width="${width.toString()}"
// 					height="${height.toString()}"
// 					data-id="${id}"
// 					alt="${alt.toString()}"
// 				><figcaption>${caption.toString()}</figcaption></figure>`;
//
// 			} else if (mimetype.toString().startsWith("video")) {
//
// 				html = `<figure><video data-id="${id}" width="${width.toString()}" height="${height.toString()}" controls>
// 					<source src="${KarmaFieldsAlpha.uploadURL+dir.toString()+"/"+filename.toString()}" type="${mimetype.toString()}"></source>
// 				</video><figcaption>${caption.toString()}</figcaption></figure>`;
//
// 			}
//
// 			manager.editor.insertContent(html);
//
// 		}
//
//
//
// 	}
//
//
//
// 	// getFile(id) {
// 	//
// 	// 	if (id) {
// 	//
// 	// 		const driver = "files";
// 	// 		let [filename] = KarmaFieldsAlpha.Query.getValue(driver, id, "filename") || [];
// 	// 		let [dir] = KarmaFieldsAlpha.Query.getValue(driver, id, "dir") || [];
// 	//
// 	// 		if (filename !== undefined && dir !== undefined) {
// 	//
// 	// 			return KarmaFieldsAlpha.uploadURL+dir+"/"+filename;
// 	//
// 	// 		}
// 	//
// 	// 	}
// 	//
// 	// }
//
//
//
// }


KarmaFieldsAlpha.field.richtext.imageForm = class extends KarmaFieldsAlpha.field.group {

	constructor(resource, id, parent) {
		super({
			selector: "figure",
			display: "flex",
			children: [
				{
					type: "text",
					content: ["getValue", "filename"],
					width: "1fr",
					style: "word-break: break-word;"
				},
				{
					type: "button",
					text: "Edit",
					title: "Edit",
					action: "addImage"
				},
				{
					type: "button",
					text: "Remove",
					title: "Remove",
					action: "removeImage"
				}
			],
			...resource
		}, id, parent);
	}

	*build() {

		const isActive = this.isActive();

		yield {
			class: "inspector imageform-container",
			update: element => {
				element.classList.toggle("hidden", !isActive);
			},
			children: isActive && super.build()
		};

	}

	isActive() {

		if (this.hasFocusInside()) {

			return true;

		}

		const images = this.request("getImages");

		if (images && images.length > 0 && this.parent.hasFocus()) {

			return true;

		}

		return false;

		// return this.hasFocusInside() || this.request("getImages").length > 0 && this.parent.hasFocus();

	}

}



// KarmaFieldsAlpha.field.richtext.imageForm = class extends KarmaFieldsAlpha.field.form {
//
// 	constructor(resource, id, parent) {
//
// 		super({
// 			header: {
// 				children: [
// 					{
// 						type: "title",
// 						title: ["queryValue", "medias", ["getParam", "id"], "filename"]
// 					},
// 					"close"
// 				]
// 			},
// 			body: {
// 				type: "group",
// 				children: [
// 					{
// 						type: "group",
// 						display: "flex",
// 						children: [
// 							{
// 								type: "input",
// 								key: "src",
// 								label: "Src",
// 								readonly: true,
// 								width: "1fr"
// 								// placeholder: ["replace", "%%/%", "%", ["upload-directory"], ["queryValue", "medias", ["getParam", "id"], "dir"], ["queryValue", "medias", ["getParam", "id"], "filename"]]
// 							},
// 							{
// 								type: "input",
// 								key: "width",
// 								label: "Width",
// 								readonly: true,
// 								width: "4rem"
// 							},
// 							{
// 								type: "input",
// 								key: "height",
// 								label: "Height",
// 								readonly: true,
// 								width: "4rem"
// 							}
// 						]
// 					},
//
// 					// {
// 					// 	type: "group",
// 					// 	display: "flex",
// 					// 	children: [
// 					// 		{
// 					// 			type: "dropdown",
// 					// 			label: "Size",
// 					// 			key: "size",
// 					// 			options: [
// 					// 				{id: "small", name: "Small"},
// 					// 				{id: "medium", name: "Medium"},
// 					// 				{id: "large", name: "Large"},
// 					// 				{id: "full", name: "Full"},
// 					// 				{id: "", name: "Custom"}
// 					// 			],
// 					// 			default: "large"
// 					// 		},
// 					// 		{
// 					// 			type: "input",
// 					// 			key: "styleWidth",
// 					// 			label: "Resize Width",
// 					// 			placeholder: "auto"
// 					// 		},
// 					// 		{
// 					// 			type: "input",
// 					// 			key: "styleHeight",
// 					// 			label: "Resize Height",
// 					// 			placeholder: "auto"
// 					// 		}
// 					// 	]
// 					// },
// 					{
// 						type: "textarea",
// 						key: "caption",
// 						label: "Caption"
// 					},
// 					// {
// 					// 	type: "group",
// 					// 	children: [
// 					// 		{
// 					// 			type: "input",
// 					// 			key: "link",
// 					// 			label: "Link"
// 					// 		},
// 					// 		{
// 					// 			type: "checkbox",
// 					// 			key: "target",
// 					// 			true: "_blank",
// 					// 			false: "",
// 					// 			text: "Open in new Window"
// 					// 		}
// 					// 	]
// 					// },
// 					// {
// 					// 	type: "input",
// 					// 	key: "alt",
// 					// 	label: "Alt"
// 					// }
// 					// {
// 					// 	type: "input",
// 					// 	key: "classes",
// 					// 	label: "Classes"
// 					// }
// 				]
// 			},
// 			footer: {
// 				children: [
// 					{
// 						type: "button",
// 						text: "Annuler",
// 						title: "Annuler",
// 						action: "close"
// 					},
// 					{
// 						type: "button",
// 						text: "Replace",
// 						title: "Replace",
// 						action: "openMedias"
// 					},
// 					{
// 						type: "attachFile",
// 						key: "id"
// 					},
// 					"separator",
// 					{
// 						type: "button",
// 						primary: true,
// 						text: "Save",
// 						title: "Save",
// 						action: "submit"
// 					}
// 				]
// 			},
// 			...resource
// 		}, id, parent);
//
// 	}
//
// 	// extract(img, key) {
// 	//
// 	// 	if (key === "id") {
// 	//
// 	// 		return img.getAttribute("data-id");
// 	//
// 	// 	} else if (key === "src") {
// 	//
// 	// 		return img.src || "";
// 	//
// 	// 	} else if (key === "srcset") {
// 	//
// 	// 		return img.srcset || "";
// 	//
// 	// 	} else if (key === "sizes") {
// 	//
// 	// 		return img.sizes || "";
// 	//
// 	// 	} else if (key === "imageWidth") {
// 	//
// 	// 		return img.style.width || "";
// 	//
// 	// 	} else if (key === "imageHeight") {
// 	//
// 	// 		return img.style.height || "";
// 	//
// 	// 	} else if (key === "width") {
// 	//
// 	// 		return img.style.width || "";
// 	//
// 	// 	} else if (key === "height") {
// 	//
// 	// 		return img.style.height || "";
// 	//
// 	// 	} else if (key === "caption") {
// 	//
// 	// 		const figcaption = img.parentNode.querySelector("figcaption");
// 	//
// 	// 		return figcaption && figcaption.innerHTML || "";
// 	//
// 	// 	} else if (key === "link") {
// 	//
// 	// 		const link = img.closest(".tinymce a");
// 	//
// 	// 		return link && link.href || "";
// 	//
// 	// 	} else if (key === "target") {
// 	//
// 	// 		const link = img.closest(".tinymce a");
// 	//
// 	// 		return link && link.target || "";
// 	//
// 	// 	} else if (key === "alt") {
// 	//
// 	// 		return img.alt || "";
// 	//
// 	// 	} else if (key === "classes") {
// 	//
// 	// 		const figure = img.closest(".tinymce figure") || img;
// 	//
// 	// 		return img.className;
// 	//
// 	// 	} else {
// 	//
// 	// 		return "";
// 	//
// 	// 	}
// 	//
// 	// }
//
// 	parseImage(element) {
//
// 		const container = element.parentNode;
// 		const figcaption = container && container.querySelector("figcaption");
// 		// const link = element.closest(".tinymce a");
//
// 		return {
// 			id: element.getAttribute("data-id"),
// 			src: element.src || "",
// 			srcset: element.srcset || "",
// 			sizes: element.sizes || "",
// 			width: element.width || "",
// 			height: element.height || "",
// 			alt: element.alt || "",
// 			caption: figcaption && figcaption.innerHTML || "",
// 			// link: link && link.href || "",
// 			// target: link && link.target || "",
// 			classes: container.className || "",
// 			styleWidth: element.style.width || "",
// 			styleHeight: element.style.height || ""
// 			// size: element.style.width === "300px" && !element.style.height && "small"
// 			// 	|| element.style.width === "768px" && !element.style.height && "medium"
// 			// 	|| element.style.width === "1024px" && !element.style.height && "large"
// 			// 	|| !element.style.width && !element.style.height && "full"
// 			// 	|| ""
// 		};
//
// 	}

	// formatImage(object) {
	//
	// 	let html = "<img";
	//
	// 	if (object.id) {
	//
	// 		html += ` data-id="${object.id}"`;
	//
	// 	}
	//
	// 	if (object.src) {
	//
	// 		html += ` src="${object.src}"`;
	//
	// 	}
	//
	// 	if (object.width) {
	//
	// 		html += ` width="${object.imageWidth}"`;
	//
	// 	}
	//
	// 	if (object.height) {
	//
	// 		html += ` height="${object.imageHeight}"`;
	//
	// 	}
	//
	// 	if (object.srcset) {
	//
	// 		html += ` srcset="${object.srcset}"`;
	//
	// 	}
	//
	// 	if (object.sizes) {
	//
	// 		html += ` sizes="${object.sizes}"`;
	//
	// 	}
	//
	// 	if (object.alt) {
	//
	// 		html += ` alt="${object.alt}"`;
	//
	// 	}
	//
	// 	// html += ` style="width:${object.width || "100%"};height:${object.height || "auto"}"`;
	//
	// 	html += "/>";
	//
	// 	if (object.caption || object.classes) {
	//
	// 		const classes = object.classes && ` class="${object.classes}"` || "";
	//
	// 		html = `<figure${classes}>${html}<figcaption>${object.caption || ""}</figcaption></figure>`;
	//
	// 	}
	//
	// 	// if (object.link) {
	// 	//
	// 	// 	html = `<a href="${object.link}" target="${object.target || ""}">${html}</a>`
	// 	//
	// 	// }
	//
	// 	return html;
	// }
//
// 	createImage(object) {
//
// 		const img = new Image();
//
// 		if (object.id) {
//
// 			img.setAttribute("data-id", object.id);
//
// 		}
//
// 		if (object.src) {
//
// 			img.src = object.src;
//
// 		}
//
// 		if (object.width) {
//
// 			img.width = object.width;
//
// 		}
//
// 		if (object.height) {
//
// 			img.height = object.height;
//
// 		}
//
// 		if (object.srcset) {
//
// 			img.srcset = object.srcset;
//
// 		}
//
// 		if (object.sizes) {
//
// 			img.sizes = object.sizes;
//
// 		}
//
// 		if (object.alt) {
//
// 			img.alt = object.alt;
//
// 		}
//
//
//
// 		img.style.width = object.styleWidth || "";
// 		img.style.height = object.styleHeight || "";
//
// 		// debugger;
// 		//
// 		// const testNode = document.createElement("div");
// 		// testNode.appendChild(img)
// 		//
// 		// return testNode;
//
// 		// if (object.caption) {
//
// 			const figure = document.createElement("figure");
//
// 			figure.appendChild(img);
//
// 			if (object.classes) {
//
// 				figure.className = object.classes;
//
// 			}
//
// 			const figcaption = document.createElement("figcaption");
//
// 			figcaption.innerHTML = object.caption || "";
//
// 			figure.appendChild(figcaption);
//
// 			return figure;
//
// 		// }
// 		//
// 		// return img;
//
// 		// // if (object.link) {
// 		// //
// 		// // 	html = `<a href="${object.link}" target="${object.target || ""}">${html}</a>`
// 		// //
// 		// // }
// 		//
// 		// return html;
// 	}
//
// 	getContentAt(index, key) {
//
// 		const response = new KarmaFieldsAlpha.Content();
//
// 		const state = this.getData(key);
//
// 		if (state === undefined) {
//
// 			const img = this.parent.elementUnder && this.parent.elementUnder.querySelector("img");
//
// 			const object = img && this.parseImage(img) || {};
//
// 			response.value = object[key] || "";
//
// 		} else {
//
// 			response.value = state;
// 			response.modified = true;
//
// 		}
//
// 		return response;
// 	}
//
// 	async setValueAt(value, index, key) {
//
// 		// if (key === "size" && value === "small") {
// 		//
// 		// 	await this.setData("300", "styleWidth");
// 		// 	await this.setData("", "styleHeight");
// 		//
// 		// } else if (key === "size" && value === "medium") {
// 		//
// 		// 	await this.setData("768", "styleWidth");
// 		// 	await this.setData("", "styleHeight");
// 		//
// 		// } else if (key === "size" && value === "large") {
// 		//
// 		// 	await this.setData("1024", "styleWidth");
// 		// 	await this.setData("", "styleHeight");
// 		//
// 		// } else if (key === "size" && value === "full") {
// 		//
// 		// 	await this.setData("", "styleWidth");
// 		// 	await this.setData("", "styleHeight");
// 		//
// 		// } else if (key === "size" && value === "custom") {
// 		//
// 		// 	// await this.setData("", "styleWidth");
// 		// 	// await this.setData("", "styleHeight");
// 		//
// 		// } else {
//
// 			await this.setData(value, key);
//
// 		// }
//
//
//
// 	}
//
// 	// async submit() {
// 	//
// 	// 	debugger;
// 	//
// 	// 	const img = this.parent.elementUnder;
// 	//
// 	//
// 	//
// 	// 	// let width = this.getContent("width").toString() || img && this.extract(img, "width") || "";
// 	// 	// let height = this.getContent("height").toString() || img && this.extract(img, "height") || "";
// 	// 	// let caption = this.getContent("caption").toString() || img && this.extract(img, "caption") || "";
// 	// 	// let link = this.getContent("link").toString() || img && this.extract(img, "link") || "";
// 	// 	// let target = this.getContent("target").toString() || img && this.extract(img, "target") || "";
// 	// 	// let alt = this.getContent("alt").toString() || img && this.extract(img, "alt") || "";
// 	// 	// let classes = this.getContent("classes").toString() || img && this.extract(img, "classes") || "";
// 	//
// 	// 	let width = this.getContent("width");
// 	// 	let height = this.getContent("height");
// 	// 	let caption = this.getContent("caption");
// 	// 	let link = this.getContent("link");
// 	// 	let target = this.getContent("target");
// 	// 	let alt = this.getContent("alt");
// 	// 	let classes = this.getContent("classes");
// 	//
// 	// 	let html = "<img";
// 	//
// 	// 	const id = img.getAttribute("data-id");
// 	//
// 	// 	if (id) {
// 	//
// 	// 		let filename = this.getWild("medias", id, "filename");
// 	// 		let dir = this.getWild("medias", id, "dir");
// 	// 		let mimetype = this.getWild("medias", id, "mimetype");
// 	// 		let imageWidth = this.getWild("medias", id, "width");
// 	// 		let imageHeight = this.getWild("medias", id, "height");
// 	//
// 	// 		while (filename.loading || dir.loading || mimetype.loading) {
// 	//
// 	// 			filename = this.getWild("medias", id, "filename");
// 	// 			dir = this.getWild("medias", id, "dir");
// 	// 			mimetype = this.getWild("medias", id, "mimetype");
// 	// 			imageWidth = this.getWild("medias", id, "width");
// 	// 			imageHeight = this.getWild("medias", id, "height");
// 	//
// 	// 			await this.render();
// 	//
// 	// 		}
// 	//
// 	// 		html += ` width="${imageWidth.toString()}" height="${imageHeight.toString()}" src="${KarmaFieldsAlpha.uploadURL}${dir.toString()}/${filename.toString()}`;
// 	//
// 	// 		if (mimetype.toString() === "jpeg" || mimetype.toString() === "jpg" || mimetype.toString() === "png" || mimetype.toString() === "webp") {
// 	//
// 	// 			let sizes = this.getWild("medias", id, "sizes");
// 	//
// 	// 			while (filename.loading || dir.loading || mimetype.loading) {
// 	//
// 	// 				sizes = this.getWild("medias", id, "sizes");
// 	// 				await this.render();
// 	//
// 	// 			}
// 	//
// 	// 			if (sizes.length) {
// 	//
// 	// 				html += ` srcset="${sizes.map(size => `${KarmaFieldsAlpha.uploadURL}${dir.toString()}/${size.src} ${size.width}w`).join(",")}" sizes="(min-width: 1024px) 1024px, 100vw"`;
// 	//
// 	// 			}
// 	//
// 	// 		}
// 	//
// 	// 	} else {
// 	//
// 	// 		let src = img && this.extract(img, "src") || "";
// 	// 		let srcset = img && this.extract(img, "srcset") || "";
// 	// 		let sizes = img && this.extract(img, "sizes") || "";
// 	// 		let imgWidth = img && this.extract(img, "imageWidth") || "";
// 	// 		let imgHeight = img && this.extract(img, "imageHeight") || "";
// 	//
// 	// 		html += ` src="${src}"`;
// 	//
// 	// 		if (imgWidth) {
// 	//
// 	// 			html += ` width="${imgWidth}"`;
// 	//
// 	// 		}
// 	//
// 	// 		if (imgHeight) {
// 	//
// 	// 			html += ` height="${imgHeight}"`;
// 	//
// 	// 		}
// 	//
// 	// 		if (srcset) {
// 	//
// 	// 			html += ` sizes="${srcset}"`;
// 	//
// 	// 		}
// 	//
// 	// 		if (sizes) {
// 	//
// 	// 			html += ` sizes="${sizes}"`;
// 	//
// 	// 		}
// 	//
// 	// 	}
// 	//
// 	// 	if (alt) {
// 	//
// 	// 		html += ` alt="${alt.toString()}"`;
// 	//
// 	// 	}
// 	//
// 	// 	html += ` style="width:${width.toString() || "100%"};height:${height.toString() || "auto"}"`;
// 	//
// 	// 	html += "/>";
// 	//
// 	// 	if (caption || classes) {
// 	//
// 	// 		html = `<figure class="${classes.toString()}">${html}<figcaption>${caption.toString()}</figcaption></figure>`;
// 	//
// 	//
// 	// 	}
// 	//
// 	// 	if (link) {
// 	//
// 	// 		html = `<a href="${link.toString()}" target="${target.toString()}">${html}</a>`
// 	//
// 	// 	}
// 	//
// 	// 	const container = img.closest(".tinymce figure") || img;
// 	//
// 	// 	const selection = window.getSelection();
// 	// 	selection.removeAllRanges();
// 	// 	const range = document.createRange();
// 	// 	range.selectNode(container);
// 	// 	selection.addRange(range); // Restore the saved selection
// 	//
// 	// 	await this.parent.insertImage(html);
// 	//
// 	// 	// await this.close();
// 	//
// 	// }
//
// 	queryImage(id) {
//
// 		const response = new KarmaFieldsAlpha.Content({});
//
// 		let filename = this.getWild("medias", id, "filename");
// 		let dir = this.getWild("medias", id, "dir");
// 		let mimetype = this.getWild("medias", id, "mimetype");
// 		let width = this.getWild("medias", id, "width");
// 		let height = this.getWild("medias", id, "height");
//
// 		if (filename.loading || dir.loading || mimetype.loading || width.loading || height.loading) {
//
// 			response.loading = true;
//
// 		} else {
//
// 			response.value.width = width.toString();
// 			response.value.height = height.toString();
// 			response.value.src = `${KarmaFieldsAlpha.uploadURL}${dir.toString()}/${filename.toString()}`;
//
// 			if (mimetype.toString() === "image/jpeg" || mimetype.toString() === "image/jpg" || mimetype.toString() === "image/png" || mimetype.toString() === "image/webp") {
//
// 				let sizes = this.getWild("medias", id, "sizes");
//
// 				if (sizes.loading) {
//
// 					response.loading = true;
//
// 				} else {
//
// 					if (sizes.toArray().length) {
//
// 						response.value.srcset = sizes.toArray().map(size => `${KarmaFieldsAlpha.uploadURL}${dir.toString()}/${size.filename} ${size.width}w`).join(",");
// 						response.value.sizes = "(min-width: 1024px) 1024px, 100vw";
//
// 					}
//
// 				}
//
// 			}
//
// 		}
//
// 		return response;
//
// 	}
//
//
// 	async submit() {
//
// 		const img = this.parent.elementUnder && this.parent.elementUnder.querySelector("img");
//
// 		if (img) {
//
//
//
// 			let object = img && this.parseImage(img) || {};
//
// 			// object.width = this.getContentAt(0, "width");
// 			// object.height = this.getContentAt(0, "height");
// 			// object.caption = this.getContentAt(0, "caption");
// 			// // object.width = this.getContent("link");
// 			// // object.width = this.getContent("target");
// 			// object.alt = this.getContentAt(0, "alt");
// 			// object.classes = this.getContentAt(0, "classes");
//
// 			object.styleWidth = this.getData("styleWidth") ?? object.styleWidth;
// 			object.styleHeight = this.getData("styleHeight") ?? object.styleHeight;
// 			object.caption = this.getData("caption") ?? object.caption;
// 			object.classes = this.getData("classes") ?? object.classes;
// 			object.alt = this.getData("alt") ?? object.alt;
//
// 			// const width = this.getData("width");
// 			// const height = this.getData("height");
// 			// const caption = this.getData("caption");
// 			// const alt = this.getData("alt");
// 			// const classes = this.getData("classes");
// 			//
// 			// if (width !== undefined) {
// 			//
// 			// 	object.width = width;
// 			//
// 			// }
// 			//
// 			// if (height !== undefined) {
// 			//
// 			// 	object.height = height;
// 			//
// 			// }
// 			//
// 			// if (caption !== undefined) {
// 			//
// 			// 	object.caption = caption;
// 			//
// 			// }
// 			//
// 			// if (alt !== undefined) {
// 			//
// 			// 	object.alt = alt;
// 			//
// 			// }
// 			//
// 			// if (classes !== undefined) {
// 			//
// 			// 	object.classes = classes;
// 			//
// 			// }
//
// 			if (object.id) {
//
// 				let request = this.queryImage(object.id);
//
// 				while (request.loading) {
//
// 					await this.render();
//
// 					request = this.queryImage(object.id);
//
// 				}
//
// 				// Object.assign(object, request.toObject());
//
// 				object = {...object, ...request.toObject()};
//
// 				// let filename = this.getWild("medias", object.id, "filename");
// 				// let dir = this.getWild("medias", object.id, "dir");
// 				// let mimetype = this.getWild("medias", object.id, "mimetype");
// 				// let imageWidth = this.getWild("medias", object.id, "width");
// 				// let imageHeight = this.getWild("medias", object.id, "height");
// 				//
// 				// while (filename.loading || dir.loading || mimetype.loading || imageWidth.loading || imageHeight.loading) {
// 				//
// 				// 	filename = this.getWild("medias", object.id, "filename");
// 				// 	dir = this.getWild("medias", object.id, "dir");
// 				// 	mimetype = this.getWild("medias", object.id, "mimetype");
// 				// 	imageWidth = this.getWild("medias", object.id, "width");
// 				// 	imageHeight = this.getWild("medias", object.id, "height");
// 				//
// 				// 	await this.render();
// 				//
// 				// }
// 				//
// 				// object.width = imageWidth.toString();
// 				// object.height = imageHeight.toString();
// 				// object.src = `${KarmaFieldsAlpha.uploadURL}${dir.toString()}/${filename.toString()}`;
// 				//
// 				// if (mimetype.toString() === "image/jpeg" || mimetype.toString() === "image/jpg" || mimetype.toString() === "image/png" || mimetype.toString() === "image/webp") {
// 				//
// 				// 	let sizes = this.getWild("medias", object.id, "sizes");
// 				//
// 				// 	while (sizes.loading) {
// 				//
// 				// 		sizes = this.getWild("medias", object.id, "sizes");
// 				// 		await this.render();
// 				//
// 				// 	}
// 				//
// 				// 	if (sizes.toArray().length) {
// 				//
// 				// 		object.srcset = sizes.toArray().map(size => `${KarmaFieldsAlpha.uploadURL}${dir.toString()}/${size.filename} ${size.width}w`).join(",");
// 				// 		object.sizes = "(min-width: 1024px) 1024px, 100vw";
// 				//
// 				// 	}
// 				//
// 				// }
//
// 			}
//
// 			this.parent.range.deleteContents();
//
// 			const newImg = this.createImage(object);
//
// 			// this.parent.range.selectNode(this.parent.elementUnder);
//
// 			await this.parent.insertImage(newImg);
//
// 			await this.setData({});
//
//
//
// 			// const html = this.formatImage(object);
// 			// const container = img.closest(".tinymce figure") || img;
// 			//
// 			// const selection = window.getSelection();
// 			// selection.removeAllRanges();
// 			// const range = document.createRange();
// 			// range.selectNode(container);
// 			// selection.addRange(range); // Restore the saved selection
// 			//
// 			// await this.parent.insertImage(html);
//
// 		}
//
// 	}
//
//
// 	*buildContent() {
//
// 		if (this.hasFocusInside()) {
//
// 			yield* super.buildContent();
//
// 		}
//
// 	}
//
// 	// build() {
// 	//
//   //   return {
//   //     class: "form-single",
//   //     child: super.build()
//   //   };
// 	//
//   // }
//
// 	// *build() {
// 	//
// 	// 	if (this.hasFocusInside()) {
// 	//
// 	// 		yield* this.buildContent();
// 	//
// 	// 	}
// 	//
// 	//
// 	// }
//
// }

KarmaFieldsAlpha.field.richtext.imageForm.attachFile = class extends KarmaFieldsAlpha.field.files {

	getDriver() {

		return this.resource.driver || "medias";

	}

	*build() {

		// return {
		// 	children: [
		// 		this.createChild({
		// 			type: "button",
		// 			action: "open",
		// 			text: "Replace",
		// 			// dashicon: "paperclip"
		// 		}).build(),
		// 		...this.buildPopup()
		// 	]
		// }
		yield* this.createChild({
			type: "button",
			action: "open",
			text: "Replace",
			// dashicon: "paperclip"
		}).build();

		yield* this.buildPopup();

	}

	open() {

		const id = this.parent.getValue("id");

		this.edit(id[0]);

	}

	insert(ids) {

		// this.parent.request("insert", ids);

		this.parent.setValue(ids[0], "id");

		this.render();

		// const imageForm = this.parent.getChild("imageForm");
		//
		// let request = this.parent.queryImage(ids[0]);
		//
		// while (request.loading) {
		//
		// 	await this.render();
		//
		// 	request = imageForm.queryImage(ids[0]);
		//
		// }
		//
		// const src = request.toObject().src || "";
		//
		// await this.parent.setValue(src, "href");
	}

}


// KarmaFieldsAlpha.tinymce = class extends KarmaFieldsAlpha.Content {
// KarmaFieldsAlpha.tinymce = class {
//
// 	constructor() {
//
// 		this.loading = true;
//
// 	}
//
// 	onUpdate() {}
// 	onFocus() {}
// 	onRender() {}
// 	onClick() {}
// 	onDblClick() {}
//
// 	async register(element, id, params) {
//
// 		if (element.id) {
//
// 			this.editor = tinyMCE.get(element.id);
//
// 		}
//
// 		// if (this.editor && this.editor.getElement() !== element) {
// 		//
// 		// 	this.editor.destroy();
// 		// 	this.editor = null;
// 		// 	this.loading = true;
// 		//
// 		// }
//
// 		if (!this.editor) {
//
// 			this.editor = await this.create(element, params);
//
// 			this.loading = false;
//
// 		}
//
// 	}
//
// 	async create(element, params = {}) {
//
// 		// if (element.id) {
// 		//
// 		// 	const editor = tinyMCE.get(element.id);
// 		//
// 		// 	if (editor) {
// 		//
// 		// 		editor.destroy();
// 		//
// 		// 		this.loading = true;
// 		//
// 		// 	}
// 		// }
//
// 		const [editor] = await tinyMCE.init({
// 			target: element,
// 			hidden_input: false,
// 			inline: true,
// 			menubar: false,
// 			contextmenu: false,
// 			toolbar: false,
// 			skin: false,
// 			// theme_url: "tinymce/themes/modern/theme.js",
// 	    // paste_as_text: true,
// 			paste_word_valid_elements: 'b,strong,i,em,ul,ol,li,a,img',
//
// 			// valid_elements : 'a[href|target=_blank],strong,em,p,br,img[src|sizes|width|height|srcset|alt|data-id],ul,ol,li,blockquote',
//
// 			// plugins: "link lists table paste",
// 			// image_caption: true,
// 			plugins: "link lists paste image",
// 			convert_urls: false,
//       entity_encoding : "raw", // -> don't encode diacritics
//       // placeholder: "hjhlo",
// 			// entity_encoding: "named",
// 			// image_caption: true,
// 			// paste_preprocess: (plugin, args) => {
// 		  //   console.log(args.content);
// 		  // }
//
//
// 			// external_plugins: {
// 		  //   "placeholder": KarmaFieldsAlpha.pluginURL+"/js/vendor/mce.placeholder.js"
// 		  // },
//
// 			// placeholder: "sdfasdf",
//
//
// 			// placeholder: "JKHglgh",
//
//       ...params
// 		});
//
// 		if (!editor) {
// 			return;
// 		}
//
// 		// unactivate history
// 		editor.on("BeforeAddUndo", event => {
// 			event.preventDefault();
// 		});
//
// 		editor.on("input", event => {
// 			this.onUpdate();
// 		});
// 		editor.on("paste", event => {
// 			this.onUpdate();
// 		});
// 		editor.on("cut", event => {
// 			this.onUpdate();
// 		});
//
// 		// -> input event does not seem to capture line break (single or double) or delete line break !
// 		editor.on("keyup", event => {
// 			if (event.key === "Backspace" || event.key === "Enter" || event.key === "Meta") {
// 				this.onUpdate();
// 			} else if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowRight") { // event.key = " " do weird things
// 				this.onRender();
// 			}
// 		});
//
// 		editor.on("focus", event => {
// 			this.onFocus();
//
// 			// this.setFocus(content.mixed);
// 			// this.onFocus();
//
// 			// this.render();
// 		});
//
// 		editor.on("click", async event => {
// 			await this.onClick();
// 			await this.onRender();
// 		});
//
// 		editor.on("dblclick", async event => {
// 			await this.onDblClick();
// 			await this.onRender();
// 		});
//
// 		editor.on("ObjectResized", event => {
// 			// if (this.onUpdateContent) {
// 			// 	const content = editor.getContent();
// 			// 	this.onUpdateContent(content, "paste");
// 			// }
// 		});
//
// 		// editor.on("TypingUndo", event => {
// 		// 	console.log("TypingUndo");
// 		// });
//
// 		return editor;
//
// 	}
//
//
//
// }
