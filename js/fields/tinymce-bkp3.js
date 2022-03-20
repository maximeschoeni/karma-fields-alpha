// https://github.com/tinymce/tinymce-dist/blob/master/tinymce.js

// /Applications/MAMP/htdocs/wordpress/wp-includes/js/tinymce/plugins/link/plugin.min.js


KarmaFieldsAlpha.fields.tinymce = class extends KarmaFieldsAlpha.fields.input {

	constructor(...args) {
		super(...args);

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
				const value = this.editor.getContent();
				this.setValue(null, [value]);
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

					// console.log("focusout");
					// this.activePopover = null;
					this.activeNode = null;
					this.activeModal = null;
					this.renderPopover();
				}

				this.renderToolbar();
			});

			// this.editor.on("focusin", event => {
			//
			// });

			this.editor.on("click", event => {

				const node = this.editor.selection.getNode();

				if (node.matches("a")) {
					this.activeNode = node;
					this.edit(true, "createlink");
				}

				if (node.matches("img")) {
					this.activeNode = node;
					this.edit(true, "editmedia");
				}

			});

		}

		return this.editor;
	}

	// compat
	async edit(value, ...path) {

		console.log(value, path);

		this.set("edit", value, ...path);

	}

	async set(context, value, key, ...path) {

		console.log(context, value, key, path);

		switch (key) {

			case "format":
				this.setFormat(value.toString());
				await super.setValue(null, [this.editor.getContent()]);
				break;

			case "createlink":
				var button = this.createChild(this.parseResource("link"));
				var modal = button.getModal();
				this.activeModal = modal;

				// this.createPopover("link", "a");
				await this.renderPopover();
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
				this.editor.execCommand(key);
				await this.setValue(null, [this.editor.getContent()]);
				break;

			case "ul":
				if (this.editor.queryCommandValue("InsertUnorderedList") !== "true") {
					this.editor.execCommand('InsertUnorderedList', false, {
					  'list-style-type': 'disc'
					});
				} else {
					this.editor.execCommand("RemoveList");
				}
				break;

			case "ol":
				if (this.editor.queryCommandValue("InsertOrderedList") !== "true") {
					this.editor.execCommand('InsertOrderedList', false, {
						'list-style-type': 'decimal'
					});
				} else {
					this.editor.execCommand("RemoveList");
				}
				break;

			case "table":
				this.editor.execCommand('mceInsertTable', false, { rows: 2, columns: 2 });
				// this.editor.execCommand('mceTableInsertColAfter', false);
				break;

			case "close":
				this.activeNode = null;
				this.activeModal = null;
				await this.renderPopover();
				break;

			// case "image":
			// 	const image = this.createChild({
			// 		id: "image",
			// 		key: "file",
			// 		type: "file",
			// 		mimetypes: ["image"]
			// 	});
			//
			// 	image.uploader.open();
			// 	break;

			case "addmedia":
				this.createChild(this.parseResource("image")).uploader.open();
				break;

			case "image":

				const images = await this.createChild(this.parseResource("image")).fetchIds(value);
				for (let image of images) {


					// tinymce.activeEditor.execCommand('mceInsertContent', false, '<img src="'+image.src+'" width="'+image.width+'" height="'+image.height+'">');

					tinymce.activeEditor.execCommand(
						'mceInsertContent',
						false,
						// `<figure><img src="${image.src}" width="${image.width}" height="${image.height}" data-id="${image.id}"><figcaption></figcaption></figure>`
						`<img src="${image.src}" width="${image.width}" height="${image.height}" data-id="${image.id}">`
					);




				}
				this.createPopover("media", "img");
				await this.renderPopover();

				break;

			case "editmedia":
				// var mediaField = await this.createChild(this.parseResource("image"));

				// this.editor.execCommand('mceImage');

				// var node = this.editor.selection.getNode();
				// this.activePopover = {
				// 	box: node.getBoundingClientRect(),
				// 	node: node,
				// 	type: "media"
				// };
				this.activeModal = this.createChild(this.parseResource("media")).getModal();
				await this.renderPopover();
				break;

			case "media":
				console.log(value, key, ...path);

			default:
				if (context === "value") {
					await super.setValue(context, value);
				}
				break;

		}


	}

	// compat
	async setValue(deprec, value, key) {

		this.set("value", value, key);

	}

	async fetchValue(deprec, key, ...path) {

		console.log(key, path);

		if (key) {

			switch (key) {

				case "link":
					return [this.getLink()];

				case "format":
					return [this.getFormat()];

				case "ul":
					return [this.editor && this.editor.queryCommandValue("InsertUnorderedList") === "true" ? "1" : ""];

				case "ol":
					return [this.editor && this.editor.queryCommandValue("InsertOrderedList") === "true" ? "1" : ""];

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
					return [this.editor && this.editor.queryCommandState(key) ? "1" : ""];

				case "selected":
					return [this.editor && this.editor.selection.getContent().length ? "1" : ""];

				case "media":
					var node = this.editor && this.editor.selection.getNode();
					var data = {};
					if (node.classList.contains("left")) {
						data.align = "left"
					} else if (node.classList.contains("right")) {
						data.align = "right"
					} else if (node.classList.contains("center")) {
						data.align = "center"
					}
					return [data];

				default:
					return [];

			}

		}

		return super.fetchValue();
	}

	getLink() {
		// const node = this.editor && this.editor.selection.getNode();
		//
		// if (node && node.matches("a")) {
		// 	// const href = node.href || "";
		// 	let href = node.getAttribute("href") || "";
		// 	let target = node.target === "_blank" ? "1" : "";
		// 	let attachment_id = node.getAttribute("data-attachment-id");
		//
		// 	if (href === "#") {
		// 		href = '';
		// 	}
		// 	// console.log(href);
		//
		// 	return {
		// 		href: [href],
		// 		target: [target],
		// 		attachment_id: attachment_id ? [attachment_id] : []
		// 	};
		//
		// } else if (this.activePopover && this.activePopover.type === "link") {
		//
		// 	return {};
		//
		// }


		if (this.activeNode) {
			let href = this.activeNode.getAttribute("href") || "";
			let target = this.activeNode.target === "_blank" ? "1" : "";
			let attachment_id = this.activeNode.getAttribute("data-attachment-id");

			return {
				href: [href],
				target: [target],
				attachment_id: attachment_id ? [attachment_id] : []
			};
		} else if (this.activeModal) {
			return {}
		}

	}

	setLink(value) {

		const href = value.href && value.href.toString();
		const target = value.target && value.target.toString() ? "_blank" : null;
		const attachment_id = value.attachment_id && value.attachment_id.toString() || null;

		if (href) {
			this.editor.execCommand("mceInsertLink", false, {
				"href": href,
				"target": target,
				"data-attachment-id": attachment_id
			});
		} else {
			this.editor.execCommand("Unlink");
		}

	}

	getFormat() {
		if (this.editor) {
			const format = this.editor.queryCommandValue("FormatBlock");
			if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(format)) {
				return format;
			}
		}
		return "";
	}

	setFormat(value) {
		if (this.editor) {
			this.editor.execCommand("FormatBlock", false, value);
		}
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

		if (key) {

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
		return {
			class: "editor karma-tinymce",
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

										if (modal instanceof KarmaFieldsAlpha.fields.form) {
											const data = await this.fetchValue(null, child.resource.key || link.resource.key);
											child.buffer.empty();
											child.buffer.setObject(data[0]);
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
		key: "italic",
		active: "italic"
	},
	bold: {
		id: "bold",
		type: "button",
		dashicon: "editor-bold",
		title: "bold",
		key: "bold",
		active: "bold"
	},
	link: {
		id: "link",
		type: "button",
		dashicon: "admin-links",
		title: "link",
		// key: "createlink",
		key: "link",
		active: "link",
		disabled: "!selected",
		modal: {
			type: "form",
			// key: "link",
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
									focus: true,
									style: "flex-grow:1"
								},
								{
									type: "button",
									dashicon: "paperclip",
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
											value: "close"
										},
										{
											type: "button",
											title: "Unlink",
											// dashicon: "editor-unlink"
											value: "unlink",
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
		key: "ul",
		active: "ul"
	},
	ol: {
		id: "ol",
		type: "button",
		dashicon: "editor-ol",
		title: "Ordered list",
		key: "ol",
		active: "ol"
	},
	table: {
		id: "table",
		type: "button",
		dashicon: "editor-table",
		key: "Table",
		value: "table"
	},
	justifyleft: {
		id: "justifyleft",
		type: "button",
		dashicon: "editor-alignleft",
		title: "Justify Left",
		key: "JustifyLeft",
		active: "JustifyLeft"
	},
	justifycenter: {
		id: "justifycenter",
		type: "button",
		dashicon: "editor-aligncenter",
		title: "Justify Center",
		key: "JustifyCenter",
		active: "JustifyCenter"
	},
	justifyright: {
		id: "justifyright",
		type: "button",
		dashicon: "editor-alignright",
		title: "Justify Right",
		key: "JustifyRight",
		active: "JustifyRight"
	},
	justifyfull: {
		id: "justifyfull",
		type: "button",
		dashicon: "editor-justify",
		title: "Justify Full",
		key: "JustifyFull",
		active: "JustifyFull"
	},
	media: {
		id: "media",
		type: "button",
		dashicon: "format-image",
		title: "Media",
		key: "addmedia",
		modal: {
			type: "form",
			id: "media",
			key: "media",
			display:"flex",
			children: [
				{
					type: "button",
					dashicon: "align-none",
				},
				{
					type: "button",
					dashicon: "align-left",
				},
				{
					type: "button",
					dashicon: "align-right",
					value: "mediaalignright"
				},
				{
					type: "button",
					dashicon: "align-center",
				},
				{
					type: "button",
					dashicon: "edit",
					title: "Replace Image"
				}
			]
		}
	},
	image: {
		id: "image",
		key: "image",
		type: "file",
		mimetypes: ["image"]
	}
}
