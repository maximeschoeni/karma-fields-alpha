// https://github.com/tinymce/tinymce-dist/blob/master/tinymce.js

// /Applications/MAMP/htdocs/wordpress/wp-includes/js/tinymce/plugins/link/plugin.min.js


KarmaFieldsAlpha.fields.tinymce = class extends KarmaFieldsAlpha.fields.input {

	constructor(...args) {
		super(...args);

		this.image = this.createChild({
			id: "image",
			key: "image",
			type: "file",
			mimetypes: ["image"]
		});

		this.file = this.createChild({
			id: "file",
			key: "file",
			type: "file",
			mimetypes: [],
			multiple: false
		});

	}

	async createEditor(element) {
		if (this.editor) {
			this.editor.destroy();
			this.editor = null;
		}

		if (!this.editor) {
			const editors = await tinyMCE.init({
				target: element,
				hidden_input: false,
				inline: true,
				menubar: false,
				contextmenu: false,
				toolbar: false,
				skin: false,
				plugins: "link lists table paste",
				convert_urls: false,
				// image_caption: true,
				paste_postprocess: (pl, o) => {
					function unwrap(node) {
						let container = document.createElement("div");
						for (let child of node.childNodes) {
							if (child.nodeType === Node.ELEMENT_NODE && child.matches("div,span")) {
								container.append(...unwrap(child).childNodes);
							} else {
								container.append(child);
							}
						}
						return container;
					}
					o.node = unwrap(o.node);
					o.node.innerHTML = o.node.innerHTML.normalize();
			  }
			});
			this.editor = editors.pop();


			// unactivate history
			this.editor.on("BeforeAddUndo", event => {
				event.preventDefault();
				// this.backup();
				// this.nextup();
			});

			this.editor.on("input", event => {
				this.saveContent();
				// const value = this.editor.getContent();
				// this.setValue(null, [value]);
			});

			// this.editor.on("SelectionChange", event => {
			// 	this.renderToolbar();
			// });


			this.editor.on("NodeChange", event => {

				if (event.selectionChange) {
					if (this.activeModal && event.element !== this.activeNode) {

						// console.log("NodeChange");

						// this.activePopover = null;
						this.activeNode = null;
						this.activeModal = null;
						this.renderPopover();
					}


				}

				this.renderToolbar();
			});

			this.editor.on("focusout", event => {

				if (this.activeModal && (!event.relatedTarget || !this.popoverContainer.contains(event.relatedTarget))) {
					this.activeNode = null;
					this.activeModal = null;
					this.renderPopover();
				}

				this.renderToolbar();
			});

			this.editor.on("click", event => {

				const node = this.editor.selection.getNode();

				if (node.matches("a")) {
					this.activeNode = node;
					this.set([], "link");
				}

				if (node.matches("img")) {
					this.activeNode = node;
					this.set([], "editmedia");
				}

			});

			this.editor.on("dblclick", event => {
				const node = this.editor.selection.getNode();
				if (node.matches("img")) {
					this.set([], "addmedia");
				}
			});

			this.editor.on("ObjectResized", async event => {
				await this.set([], "resizemedia");
				await this.renderPopover();
			});

		}

		return this.editor;
	}

	// // compat
	// async edit(action, ...path) {
	//
	// 	switch (action) {
	//
	// 		case "link":
	// 			this.activeModal = this.createChild(this.parseResource("link")).getModal();
	// 			await this.renderPopover();
	// 			break;
	//
	// 		case "attachfile":
	// 			this.file.uploader.open(this.activeNode && this.activeNode.getAttribute("data-attachment-id"));
	// 			break;
	//
	// 		case "unlink":
	// 		case "bold":
	// 		case "italic":
	// 		case "strikethrough":
	// 		case "superscript":
	// 		case "subscript":
	// 		case "JustifyLeft":
	// 		case "JustifyCenter":
	// 		case "JustifyRight":
	// 		case "JustifyFull":
	// 		case "JustifyNone":
	// 			this.editor.execCommand(action);
	// 			await this.setValue(null, [this.editor.getContent()]);
	// 			break;
	//
	// 		case "ul":
	// 			if (this.editor.queryCommandValue("InsertUnorderedList") !== "true") {
	// 				this.editor.execCommand('InsertUnorderedList', false, {
	// 				  'list-style-type': 'disc'
	// 				});
	// 			} else {
	// 				this.editor.execCommand("RemoveList");
	// 			}
	// 			await super.setValue(null, [this.editor.getContent()]);
	// 			break;
	//
	// 		case "ol":
	// 			if (this.editor.queryCommandValue("InsertOrderedList") !== "true") {
	// 				this.editor.execCommand('InsertOrderedList', false, {
	// 					'list-style-type': 'decimal'
	// 				});
	// 			} else {
	// 				this.editor.execCommand("RemoveList");
	// 			}
	// 			await super.setValue(null, [this.editor.getContent()]);
	// 			break;
	//
	// 		case "table":
	// 			this.editor.execCommand('mceInsertTable', false, { rows: 2, columns: 2 });
	// 			// this.editor.execCommand('mceTableInsertColAfter', false);
	// 			await super.setValue(null, [this.editor.getContent()]);
	// 			break;
	//
	// 		case "close":
	// 			this.activeNode = null;
	// 			this.activeModal = null;
	// 			await this.renderPopover();
	// 			break;
	//
	// 		// case "image":
	// 		// 	const image = this.createChild({
	// 		// 		id: "image",
	// 		// 		key: "file",
	// 		// 		type: "file",
	// 		// 		mimetypes: ["image"]
	// 		// 	});
	// 		//
	// 		// 	image.uploader.open();
	// 		// 	break;
	//
	// 		case "addmedia":
	// 			// this.createChild(this.parseResource("image")).uploader.open(this.activeNode && this.activeNode.getAttribute("data-id"));
	// 			this.image.uploader.open(this.activeNode && this.activeNode.getAttribute("data-id"));
	// 			break;
	//
	// 		case "editmedia":
	// 			this.activeModal = this.createChild(this.parseResource("media")).getModal();
	// 			await this.renderPopover();
	// 			break;
	//
	// 		case "resizemedia":
	// 			var node = this.editor.selection.getNode();
	// 			var width = this.editor.selection.getNode().getAttribute("width");
	// 			node.sizes = `(min-width: ${width}px) ${width}px, 100vw`;
	// 			await super.setValue(null, [this.editor.getContent()]);
	// 			break;
	//
	// 		case "alignnone":
	// 		case "alignleft":
	// 		case "alignright":
	// 		case "aligncenter":
	// 			this.activeNode.classList.remove("alignright");
	// 			this.activeNode.classList.remove("alignleft");
	// 			this.activeNode.classList.remove("aligncenter");
	// 			if (action !== "alignnone") {
	// 				this.activeNode.classList.add(action);
	// 			}
	// 			this.editor.nodeChanged();
	// 			await this.renderPopover();
	// 			await super.setValue(null, [this.editor.getContent()]);
	// 			break;
	//
	// 		default:
	// 			await super.edit(action, ...path);
	// 			break;
	//
	// 	}
	//
	//
	// }

	// async setValue(deprec, value, ...path) {
	//
	// 	switch (path.join("/")) {
	//
	// 		case "format":
	// 			this.setFormat(value.toString());
	// 			await super.setValue(null, [this.editor.getContent()]);
	// 			break;
	//
	// 		case "image":
	// 			await this.setImage(value);
	// 			break;
	//
	// 		case "file":
	// 			// const files = await this.createChild(this.parseResource("file")).fetchIds(value);
	// 			const files = await this.file.fetchIds(value);
	// 			for (let file of files) {
	// 				console.log(file.original_src);
	// 				this.setLink({
	// 					"href": file.original_src,
	// 					"data-attachment-id": value.toString()
	// 				});
	//
	// 				await this.renderPopover();
	// 				await super.setValue(null, [this.editor.getContent()]);
	// 				break;
	// 			}
	//
	// 			break;
	//
	// 		default:
	// 			super.setValue(deprec, value, ...path);
	//
	//
	// 	}
	//
	// }
	//
	// async fetchValue(deprec, ...path) {
	//
	// 	switch (path.join("/")) {
	//
	// 		case "format":
	// 			return [this.getFormat()];
	//
	// 		case "link":
	// 			return [this.getLink()];
	//
	// 		// case "image":
	// 		// 	return [this.activeNode && this.activeNode.getAttribute("data-id") || ""];
	//
	// 		case "align":
	// 			return this.activeNode && this.activeNode.classList.contains("alignleft") && "left"
	// 				|| this.activeNode && this.activeNode.classList.contains("aligncenter") && "center"
	// 				|| this.activeNode && this.activeNode.classList.contains("alignright") && "right"
	// 				|| "none";
	//
	// 		default:
	// 			return super.fetchValue();
	//
	// 	}
	//
	// }

	// getState(...path) {
	//
	// 	const state = path.pop();
	//
	// 	// console.log(state, this.activeNode);
	//
	// 	switch (state) {
	//
	// 		case "link":
	// 			return this.activeNode && this.activeNode.matches("a");
	//
	// 			// return new KarmaFieldsAlpha.Value(this.activeNode && this.activeNode.matches("a"));
	//
	// 		case "ul":
	// 			return this.editor && this.editor.queryCommandValue("InsertUnorderedList");
	//
	// 		case "ol":
	// 			return this.editor && this.editor.queryCommandValue("InsertOrderedList");
	//
	// 		case "bold":
	// 		case "italic":
	// 		case "strikethrough":
	// 		case "superscript":
	// 		case "subscript":
	// 		case "JustifyLeft":
	// 		case "JustifyCenter":
	// 		case "JustifyRight":
	// 		case "JustifyFull":
	// 		case "JustifyNone":
	// 			return this.editor && this.editor.queryCommandState(state);
	//
	// 		case "selected":
	// 			return this.editor && this.editor.selection.getContent().length > 0;
	//
	// 		// case "media":
	// 		// 	var node = this.editor && this.editor.selection.getNode();
	// 		// 	var data = {};
	// 		// 	if (node.classList.contains("left")) {
	// 		// 		data.align = "left"
	// 		// 	} else if (node.classList.contains("right")) {
	// 		// 		data.align = "right"
	// 		// 	} else if (node.classList.contains("center")) {
	// 		// 		data.align = "center"
	// 		// 	}
	// 		// 	return [data];
	//
	//
	// 		// case "alignnone":
	// 		// 	return this.activeNode
	// 		// 		&& !this.activeNode.classList.contains("alignleft")
	// 		// 		&& !this.activeNode.classList.contains("aligncenter")
	// 		// 		&& !this.activeNode.classList.contains("alignright");
	// 		//
	// 		// case "alignleft":
	// 		// case "alignright":
	// 		// case "aligncenter":
	// 		//
	// 		// 	return this.activeNode && this.activeNode.classList.contains(state);
	// 		// 	break;
	//
	// 		default:
	// 			return super.fetchValue();
	//
	// 	}
	//
	// }


	async get(...path) {


		const state = path.pop();

		switch (state) {

			case "value":
				if (path.length) {
					return this.get(path.join("/"));
				} else {
					return super.get(this.resource.context || "value");
				}

			case "format":
				return [this.getFormat()];

			case "link/href": {
				const node = this.editor.selection.getNode();
				return [node.getAttribute("href") || ""];
			}

			case "link":
				return [this.getLink()];

			case "align":
				return [this.activeNode && this.activeNode.classList.contains("alignleft") && "left"
					|| this.activeNode && this.activeNode.classList.contains("aligncenter") && "center"
					|| this.activeNode && this.activeNode.classList.contains("alignright") && "right"
					|| "none"];

			case "islink":
				return [this.activeNode && this.activeNode.matches("a")];

			case "ul":
				return [this.editor && this.editor.queryCommandValue("InsertUnorderedList")];

			case "ol":
				return [this.editor && this.editor.queryCommandValue("InsertOrderedList")];

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
				return [this.editor && this.editor.queryCommandState(state)];

			case "selected":
				return [this.editor && this.editor.selection.getContent().length > 0];

		}

	}

	async set(value, ...path) {

		const action = path.pop();

		switch (action) {

			case "value":
				if (path.length) {
					await this.set(value, ...path);
				} else {
					await super.set(value, "value");
				}
				break;

			case "link":
				this.activeModal = this.createChild(this.parseResource("link")).getModal();
				await this.renderPopover();
				break;

			case "attachfile":
				// if (this.activeNode && this.activeNode.hasAttribute("data-attachment-id")) {
				// 	await this.file.setValue([this.activeNode.getAttribute("data-attachment-id")]);
				// }
				this.file.uploader.open(this.activeNode && this.activeNode.getAttribute("data-attachment-id"));
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
				this.editor.execCommand(action);
				await this.saveContent();
				break;

			case "ul":
				if (this.editor.queryCommandValue("InsertUnorderedList") !== "true") {
					this.editor.execCommand('InsertUnorderedList', false, {
					  'list-style-type': 'disc'
					});
				} else {
					this.editor.execCommand("RemoveList");
				}
				await this.saveContent();
				break;

			case "ol":
				if (this.editor.queryCommandValue("InsertOrderedList") !== "true") {
					this.editor.execCommand('InsertOrderedList', false, {
						'list-style-type': 'decimal'
					});
				} else {
					this.editor.execCommand("RemoveList");
				}
				await this.saveContent();
				break;

			case "table":
				this.editor.execCommand('mceInsertTable', false, { rows: 2, columns: 2 });
				// this.editor.execCommand('mceTableInsertColAfter', false);
				await this.saveContent();
				break;

			case "close":
				this.activeNode = null;
				this.activeModal = null;
				await this.renderPopover();
				break;

			case "addmedia":
				this.image.uploader.open(this.activeNode && this.activeNode.getAttribute("data-id"));
				break;

			case "editmedia":
				this.activeModal = this.createChild(this.parseResource("media")).getModal();
				await this.renderPopover();
				break;

			case "resizemedia":
				var node = this.editor.selection.getNode();
				var width = this.editor.selection.getNode().getAttribute("width");
				node.sizes = `(min-width: ${width}px) ${width}px, 100vw`;
				await this.saveContent();
				break;

			case "alignnone":
			case "alignleft":
			case "alignright":
			case "aligncenter":
				this.activeNode.classList.remove("alignright");
				this.activeNode.classList.remove("alignleft");
				this.activeNode.classList.remove("aligncenter");
				if (action !== "alignnone") {
					this.activeNode.classList.add(action);
				}
				this.editor.nodeChanged();
				await this.renderPopover();
				await this.saveContent();
				break;



			case "format":
				this.setFormat(value.toString());
				await this.saveContent();
				break;

			case "image":
				await this.setImage(value);
				break;

			case "file":
				// -> reopen popover and set data in buffer
				if (this.editor.selection.getNode().matches("a")) {

					this.activeModal = this.createChild(this.parseResource("link")).getModal();

					await this.renderPopover();

					const files = await this.file.fetchIds(value);
					for (let file of files) {
						this.activeModal.buffer.set([file.original_src], "href");
						this.activeModal.buffer.set(value, "attachment_id");
						break;
					}

					this.activeModal.render();

				}


				// const files = await this.file.fetchIds(value);
				// for (let file of files) {
				// 	this.setLink({
				// 		"href": file.original_src,
				// 		"data-attachment-id": value.toString()
				// 	});
				// 	await this.renderPopover();
				// 	// await super.setValue(null, [this.editor.getContent()]);
				// 	await this.saveContent();
				// 	break;
				// }

				break;

			case "submit": // -> link form submitted. value is an Array

				if (path[0] === "link") {

					this.setLink(value[0]);
				}


				// var value = this.editor.getContent();
				// await this.setValue(null, [value]);

				await this.saveContent();

				this.activeNode = null;
				this.activeModal = null;
				await this.renderPopover();

				break;


		}

	}

	async saveContent() {
		debugger;
		await super.set([this.editor.getContent()], this.resource.context || "value");
	}

	getLink() {

		if (this.editor) {
			const node = this.editor.selection.getNode();
			let href = node.getAttribute("href") || "";
			let target = node.target === "_blank" ? "1" : "";
			let attachment_id = node.getAttribute("data-attachment-id");

			return {
				href: [href],
				target: [target],
				attachment_id: attachment_id ? [attachment_id] : []
			};
		}

	}

	setLink(value) {

		value = KarmaFieldsAlpha.DeepObject.clone(this.getLink() || {}, value);

		if (value.href && value.href.length) {

			this.editor.execCommand("mceInsertLink", false, {
				"href": value.href.toString(),
				"target": value.target && value.target.toString() ? "_blank" : null,
				"data-attachment-id": value.attachment_id && value.attachment_id.toString() || null
			});

		} else {

			this.editor.execCommand("Unlink");

		}

	}

	getFormat() {
		const match = this.editor && this.editor.queryCommandValue("FormatBlock").match(/h[1-6]/);
		return match && match[0] || "";
	}

	setFormat(value) {
		if (this.editor) {
			this.editor.execCommand("FormatBlock", false, value);
		}
	}

	async setImage(ids) {

		const images = await this.image.fetchIds(ids, {sources: 1});
		for (let image of images) {

			const node = this.editor && this.editor.selection.getNode();

			let width = image.sources[0].width;
			let height = image.sources[0].height;

			if (node && node.matches("img")) {
				width = node.getAttribute("width") || width;
				height = node.getAttribute("height") || height;
			}

			this.editor.execCommand(
				'mceInsertContent',
				false,
				`<img
					src="${image.sources[0].src}"
					width="${width}"
					height="${height}"
					data-id="${image.id}"
					srcset="${image.sources.map(source => source.src+" "+source.width+"w").join(", ")}"
					sizes="(min-width: ${width}px) ${width}px, 100vw"
				>`
			);

		}
		// this.createPopover("media", "img");
		await this.saveContent();

		this.activeModal = this.createChild(this.parseResource("media")).getModal();
		await this.renderPopover();

	}

	// addModal(modal) {
	// 	if (!this.modals) {
	// 		this.modals = [];
	// 	}
	// 	this.modals.push(modal);
	// }
	//
	// getModals() {
	// 	return this.modals || [];
	// }

	// createPopover(type, selector) {
	// 	const node = this.editor.selection.getNode();
	// 	const sel = this.editor.selection.getSel();
	//
	// 	if (node.matches(selector)) {
	//
	// 		this.activePopover = {
	// 			box: node.getBoundingClientRect(),
	// 			node: node,
	// 			type: type
	// 		};
	//
	// 	} else if (this.editor.selection.getContent().length) {
	//
	// 		this.activePopover = {
	// 			box: this.editor.selection.getRng().getBoundingClientRect(),
	// 			node: node,
	// 			type: type
	// 		};
	//
	// 	}
	// }

	async send(value, key, ...path) {

		switch (key) {

			case "link":

				this.setLink(value);

				var value = this.editor.getContent();
				await this.setValue(null, [value]);

				// console.log("send form");
				// this.activePopover = null;
				this.activeNode = null;
				this.activeModal = null;
				await this.renderPopover();

		}

	}

	// build() {
	// 	return {
	// 		class: "editor karma-tinymce",
	// 		children: [
	// 			{
	// 				class: "editor-header",
	// 				children: [
	// 					{
	// 						class: "toolbar",
	// 						init: toolbar => {
	// 							this.renderToolbar = toolbar.render;
	// 						},
	// 						child: this.createChild({
	// 							type: "group",
	// 							id: "editor-buttons",
	// 							display: "flex",
	// 							children: (this.resource.buttons || ["format", "bold", "italic", "link", "ul", "ol"]).map(child => this.parseResource(child))
	// 						}).build()
	// 					}
	// 				]
	// 			},
	// 			{
	// 				class: "tinymce editor-body",
	// 				init: async node => {
	// 					node.element.id = this.getId();
	// 					node.element.editable = true;
	// 					await this.createEditor(node.element);
	// 				},
	// 				update: async node => {
	// 					const value = await this.fetchInput();
	// 					this.editor.setContent(value);
	// 				}
	// 			},
	// 			{
	// 				class: "karma-popover-container",
	// 				init: container => {
	// 					this.renderPopover = container.render;
	// 					this.popoverContainer = container.element;
	// 				},
	// 				update: container => {
	// 					container.element.onfocusout = event => {
	// 						if (this.activePopover && (!event.relatedTarget || !container.element.contains(event.relatedTarget) && !this.editor.getBody().contains(event.relatedTarget))) {
	// 							this.activePopover = null;
	// 							container.render();
	// 						}
	// 					};
	// 					container.children = [
	// 						{
	// 							class: "karma-tinymce-popover",
	// 							init: popover => {
	// 								popover.element.tabIndex = -1;
	// 							},
	// 							update: async popover => {
	// 								popover.element.classList.toggle("active", Boolean(this.activePopover));
	// 								if (this.editor && this.activePopover) {
	// 									const containerBox = container.element.parentNode.getBoundingClientRect();
	//
	// 									popover.element.style.left = (this.activePopover.box.left - containerBox.x).toFixed()+"px";
	// 									popover.element.style.top = (this.activePopover.box.bottom - containerBox.y + 5).toFixed()+"px";
	//
	// 									const buttonResource = this.parseResource(this.activePopover.type);
	// 									const button = this.createChild(buttonResource);
	// 									const modal = button.getModal();
	// 									const data = await this.fetchValue(null, this.activePopover.type);
	// 									modal.buffer.empty();
	// 									modal.buffer.setObject(data[0]);
	// 									popover.children = [modal.build()];
	// 								}
	//
	// 							}
	// 						}
	// 					];
	// 				}
	// 			}
	// 		]
	// 	}
	// }

	build() {
		console.log("build");
		return {
			class: "editor karma-tinymce",
			init: editor => {
				if (this.resource.theme) {
					editor.element.classList.add("theme-"+this.resource.theme);
				}
			},
			children: [
				{
					class: "editor-header",
					children: [
						{
							class: "toolbar",
							init: toolbar => {
								this.renderToolbar = toolbar.render;
							},
							child: this.createChild({
								type: "group",
								id: "editor-buttons",
								display: "flex",
								children: (this.resource.buttons || ["format", "bold", "italic", "link", "ul", "ol"]).map(child => this.parseResource(child))
							}).build()
						}
					]
				},
				{
					class: "tinymce editor-body",
					init: async node => {
						node.element.id = this.getId();
						node.element.editable = true;
						await this.createEditor(node.element);
					},
					update: async node => {
						const value = await this.fetchInput();

						this.editor.setContent(value);
					}
				},
				{
					class: "karma-popover-container",
					init: container => {
						this.renderPopover = container.render;
						this.popoverContainer = container.element;
					},
					update: container => {
						container.element.onfocusout = event => {
							if (this.activeModal && (!event.relatedTarget || !container.element.contains(event.relatedTarget) && !this.editor.getBody().contains(event.relatedTarget))) {
								// this.activePopover = null;
								this.activeNode = null;
								this.activeModal = null;
								container.render();
							}
						};
						container.children = this.children.filter(child => child.resource.modal).map(child => {
							return {
								class: "karma-tinymce-popover",
								init: popover => {
									popover.element.tabIndex = -1;
								},
								update: async popover => {
									const modal = child.getModal();
									popover.element.classList.toggle("active", this.activeModal === modal);
									if (this.editor && this.activeModal === modal) {

										const containerBox = container.element.parentNode.getBoundingClientRect();
										let nodeBox;

										if (this.activeNode) {
											nodeBox = this.activeNode.getBoundingClientRect();
										} else {
											nodeBox = this.editor.selection.getRng().getBoundingClientRect()
										}

										popover.element.style.left = (nodeBox.left - containerBox.x).toFixed()+"px";
										popover.element.style.top = (nodeBox.bottom - containerBox.y + 5).toFixed()+"px";

										if (modal.buffer) {
											modal.buffer.empty();
										}

										popover.children = [modal.build()];
									}

								}
							};
						});
					}
				}
			]
		}
	}

	parseResource(resource) {
		if (typeof resource === "string") {
			resource = KarmaFieldsAlpha.fields.tinymce.defaults[resource];
		}
		return resource;

	// 	if (typeof resource === "string") {
	//
	// 		switch (resource) {
	//
	// 			case "format":
	// 				resource = {
	// 					id: "format",
	// 					type: "dropdown",
	// 					key: "format",
	// 					options: [
	// 						{key: "", name: "Format"},
	// 						{key: "h1", name: "H1"},
	// 						{key: "h2", name: "H2"},
	// 						{key: "h3", name: "H3"},
	// 						{key: "h4", name: "H4"},
	// 						{key: "h5", name: "H5"},
	// 						{key: "h6", name: "H6"},
	// 						{key: "p", name: "P"}
	// 					]
	// 				};
	// 				break;
	//
	// 			case "italic":
	// 				resource = {
	// 					id: "italic",
	// 					type: "button",
	// 					dashicon: "editor-italic",
	// 					title: "italic",
	// 					value: "italic",
	// 					active: "italic"
	// 				};
	// 				break;
	//
	// 			case "bold":
	// 				resource = {
	// 					id: "bold",
	// 					type: "button",
	// 					dashicon: "editor-bold",
	// 					title: "bold",
	// 					value: "bold",
	// 					active: "bold"
	// 				};
	// 				break;
	//
	// 			case "link":
	// 				resource = {
	// 					id: "link",
	// 					type: "button",
	// 					dashicon: "admin-links",
	// 					title: "link",
	// 					value: "createlink",
	// 					active: "link",
	// 					disabled: "!selected",
	// 					modal: {
	// 						type: "form",
	// 						states: {
	// 							href: "href",
	// 						},
	// 						key: "link",
	// 						id: "link",
	// 						children: [
	// 							{
	// 								type: "group",
	// 								// id: "link-popover",
	// 								children: [
	// 									{
	// 										type: "group",
	// 										display: "flex",
	// 										children: [
	// 											{
	// 												type: "input",
	// 												key: "href",
	// 												focus: true,
	// 												style: "flex-grow:1"
	// 											},
	// 											{
	// 												type: "button",
	// 												dashicon: "paperclip",
	// 											}
	// 										]
	// 									},
	// 									{
	// 										type: "checkbox",
	// 										key: "target",
	// 										text: "Open in new tab"
	// 									},
	// 									{
	// 										type: "group",
	// 										display: "flex",
	// 										// container: {style: "justify-content: space-between"},
	// 										children: [
	// 											{
	// 												type: "group",
	// 												display: "flex",
	// 												children: [
	// 													{
	// 														type: "button",
	// 														title: "Cancel",
	// 														value: "close"
	// 													},
	// 													{
	// 														type: "button",
	// 														title: "Unlink",
	// 														// dashicon: "editor-unlink"
	// 														value: "unlink",
	// 														disabled: "!href"
	// 													}
	// 												]
	// 											},
	// 											{
	// 												type: "submit",
	// 												title: "Apply"
	// 											}
	// 										]
	// 									}
	// 								]
	// 							}
	// 						]
	// 					}
	// 				};
	// 				break;
	//
	// 			case "ul":
	// 				resource = {
	// 					id: "ul",
	// 					type: "button",
	// 					dashicon: "editor-ul",
	// 					title: "Unordered list",
	// 					value: "ul",
	// 					active: "ul"
	// 				};
	// 				break;
	//
	// 			case "ol":
	// 				resource = {
	// 					id: "ol",
	// 					type: "button",
	// 					dashicon: "editor-ol",
	// 					title: "Ordered list",
	// 					value: "ol",
	// 					active: "ol"
	// 				};
	// 				break;
	//
	// 			case "table":
	// 				resource = {
	// 					id: "table",
	// 					type: "button",
	// 					dashicon: "editor-table",
	// 					title: "Table",
	// 					value: "table"
	// 				};
	// 				break;
	//
	//
	// 			case "justifyleft":
	// 				resource = {
	// 					id: "justifyleft",
	// 					type: "button",
	// 					dashicon: "editor-alignleft",
	// 					title: "Justify Left",
	// 					value: "JustifyLeft",
	// 					active: "JustifyLeft"
	// 				};
	// 				break;
	//
	// 			case "justifycenter":
	// 				resource = {
	// 					id: "justifycenter",
	// 					type: "button",
	// 					dashicon: "editor-aligncenter",
	// 					title: "Justify Center",
	// 					value: "JustifyCenter",
	// 					active: "JustifyCenter"
	// 				};
	// 				break;
	//
	// 			case "justifyright":
	// 				resource = {
	// 					id: "justifyright",
	// 					type: "button",
	// 					dashicon: "editor-alignright",
	// 					title: "Justify Right",
	// 					value: "JustifyRight",
	// 					active: "JustifyRight"
	// 				};
	// 				break;
	//
	// 			case "justifyfull":
	// 				resource = {
	// 					id: "justifyfull",
	// 					type: "button",
	// 					dashicon: "editor-justify",
	// 					title: "Justify Full",
	// 					value: "JustifyFull",
	// 					active: "JustifyFull"
	// 				};
	// 				break;
	//
	//
	// 			case "image":
	// 				resource = {
	// 					id: "image",
	// 					type: "button",
	// 					dashicon: "format-image",
	// 					title: "Image",
	// 					value: "image"
	// 				};
	// 				break;
	//
	// 			case "file":
	// 				resource = {
	// 					id: "file",
	// 					key: "file",
	// 					type: "file",
	// 					mimetypes: ["image"]
	// 				};
	// 				break;
	//
	// 		}
	//
	// 	}
	//
	// 	return resource; //super.createChild(resource);
	}
}

KarmaFieldsAlpha.fields.tinymce.defaults = {
	format: {
		id: "format",
		type: "dropdown",
		key: "format",
		options: [
			{key: "", name: "Format"},
			{key: "h1", name: "H1"},
			{key: "h2", name: "H2"},
			{key: "h3", name: "H3"},
			{key: "h4", name: "H4"},
			{key: "h5", name: "H5"},
			{key: "h6", name: "H6"},
			{key: "p", name: "P"}
		]
	},
	italic: {
		id: "italic",
		type: "button",
		dashicon: "editor-italic",
		title: "italic",
		action: "italic",
		active: "italic"
	},
	bold: {
		id: "bold",
		type: "button",
		dashicon: "editor-bold",
		title: "bold",
		action: "bold",
		active: "bold"
	},
	link: {
		id: "link",
		type: "button",
		dashicon: "admin-links",
		title: "link",
		// key: "createlink",
		action: "link",
		active: "islink",
		disabled: "!selected",
		modal: {
			type: "form",
			key: "link",
			id: "link",
			children: [
				{
					type: "group",
					// id: "link-popover",
					children: [
						{
							type: "group",
							display: "flex",
							children: [
								{
									type: "input",
									key: "href",
									style: "flex-grow:1"
								},
								{
									type: "button",
									dashicon: "paperclip",
									action: "attachfile"
								}
							]
						},
						{
							type: "checkbox",
							key: "target",
							text: "Open in new tab"
						},
						{
							type: "group",
							display: "flex",
							// container: {style: "justify-content: space-between"},
							children: [
								{
									type: "group",
									display: "flex",
									children: [
										{
											type: "button",
											title: "Cancel",
											action: "close"
										},
										{
											type: "button",
											title: "Unlink",
											// dashicon: "editor-unlink"
											action: "unlink",
											disabled: "!href"
										}
									]
								},
								{
									type: "submit",
									title: "Apply"
								}
							]
						}
					]
				}
			]
		}
	},
	ul: {
		id: "ul",
		type: "button",
		dashicon: "editor-ul",
		title: "Unordered list",
		action: "ul",
		active: "ul"
	},
	ol: {
		id: "ol",
		type: "button",
		dashicon: "editor-ol",
		title: "Ordered list",
		action: "ol",
		active: "ol"
	},
	table: {
		id: "table",
		type: "button",
		dashicon: "editor-table",
		title: "Table",
		action: "table"
	},
	justifyleft: {
		id: "justifyleft",
		type: "button",
		dashicon: "editor-alignleft",
		title: "Justify Left",
		action: "JustifyLeft",
		active: "JustifyLeft"
	},
	justifycenter: {
		id: "justifycenter",
		type: "button",
		dashicon: "editor-aligncenter",
		title: "Justify Center",
		action: "JustifyCenter",
		active: "JustifyCenter"
	},
	justifyright: {
		id: "justifyright",
		type: "button",
		dashicon: "editor-alignright",
		title: "Justify Right",
		action: "JustifyRight",
		active: "JustifyRight"
	},
	justifyfull: {
		id: "justifyfull",
		type: "button",
		dashicon: "editor-justify",
		title: "Justify Full",
		action: "JustifyFull",
		active: "JustifyFull"
	},
	media: {
		id: "media",
		type: "button",
		dashicon: "format-image",
		title: "Media",
		action: "addmedia",
		modal: {
			type: "form",
			id: "media",
			display:"flex",
			children: [
				{
					type: "button",
					dashicon: "align-none",
					action: "alignnone",
					active: "align=none"
				},
				{
					type: "button",
					dashicon: "align-left",
					action: "alignleft",
					active: "align=left"
				},
				{
					type: "button",
					dashicon: "align-center",
					action: "aligncenter",
					active: "align=center"
				},
				{
					type: "button",
					dashicon: "align-right",
					action: "alignright",
					active: "align=right"
				},
				{
					type: "button",
					dashicon: "edit",
					title: "Replace Image",
					action: "addmedia"
				}
			]
		}
	}
}
