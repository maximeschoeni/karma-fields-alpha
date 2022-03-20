// https://github.com/tinymce/tinymce-dist/blob/master/tinymce.js

// /Applications/MAMP/htdocs/wordpress/wp-includes/js/tinymce/plugins/link/plugin.min.js


KarmaFieldsAlpha.fields.tinymce = class extends KarmaFieldsAlpha.fields.input {

	constructor(...args) {
		super(...args);

		// this.popover = "link";

		// this.heading = this.createChild({
		// 	type: "form",
		// 	key: "heading",
		// 	children: [
		// 		{
		// 			type: "group",
		// 			display: "flex",
		// 			children: [
		// 				{
		// 					type: "button",
		// 					title: "h1",
		// 					value: "h1",
		// 					active: "h1"
		// 				},
		// 				{
		// 					type: "button",
		// 					title: "h2",
		// 					value: "h2",
		// 					active: "h2"
		// 				},
		// 				{
		// 					type: "button",
		// 					title: "h3",
		// 					value: "h3",
		// 					active: "h3"
		// 				},
		// 				{
		// 					type: "button",
		// 					title: "h4",
		// 					value: "h4",
		// 					active: "h4"
		// 				},
		// 				{
		// 					type: "button",
		// 					title: "h5",
		// 					value: "h5",
		// 					active: "h5"
		// 				},
		// 				{
		// 					type: "button",
		// 					title: "h6",
		// 					value: "h6",
		// 					active: "h6"
		// 				},
		// 				{
		// 					type: "button",
		// 					dashicon: "no-alt",
		// 					value: "p"
		// 				}
		//
		// 			]
		// 		}
		// 	]
		// });

		this.link = this.createChild({
			type: "form",
			states: {
				href: "href",
			},
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
											enabled: "href"
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
				// paste_auto_cleanup_on_paste : true,
				// paste_remove_spans: true,
				// paste_remove_styles: true,
				// paste_remove_styles_if_webkit: true,
				// paste_strip_class_attributes: true,


				paste_postprocess: (pl, o) => {
					// function unwrap(node) {
					// 	let nodes = [];
					// 	for (let child of node.childNodes) {
					// 		if (child.nodeType === Node.ELEMENT_NODE && child.matches("div,span")) {
					// 			nodes = [...nodes, ...unwrap(child)];
					// 		} else {
					// 			nodes = [...nodes, child];
					// 		}
					// 	}
					// 	return nodes;
					// }
					// const container = document.createElement("div");
					// container.append(...unwrap(o.node));
					// o.node = container;



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


				// quickbars_insert_toolbar: false,
				// table_grid: false,
				// table_tab_navigation: false,
				// table_default_attributes: {},
				// table_default_styles: {},
				// table_sizing_mode: "relative",
				// table_resize_bars: false
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

			this.editor.on("SelectionChange", event => {

				// const node = this.editor.selection.getNode();
				// const eFocus = this.editor.hasFocus();
				// const pFocus = this.hasPopoverFocus || false;
				//
				// if (this.lastNode !== node || this.lastEditorHasFocus !== eFocus || this.lastPopoverHasFocus !== pFocus) {
				// 	this.lastNode = node;
				// 	this.lastEditorHasFocus = eFocus;
				// 	this.lastPopoverHasFocus = pFocus;
				//
				// 	if (this.activePopover) {
				// 		if (this.activePopover.node && node !== this.activePopover.node) {
				// 			this.activePopover = null;
				// 		}
				// 	}
				//
				// 	if (!this.activePopover) {
				// 		if (node.matches("a")) {
				// 			this.activePopover = {
				// 				node: node,
				// 				type: "link"
				// 			};
				// 		}
				// 	}
				//
				// 	this.renderPopover();
				// 	this.renderToolbar();
				// }





				this.renderToolbar();


				// console.log("SelectionChange", node.matches("a"), this.editor.hasFocus(), this.hasPopoverFocus);
			});

			// this.editor.on("Change", event => {
			//
			// 	console.log("change");
			// });

			this.editor.on("NodeChange", event => {
				// console.log("NodeChange", event.selectionChange);

				if (event.selectionChange && this.activePopover) {
					if (event.element !== this.activePopover.node) {
						console.log("NodeChange");

						this.activePopover = null;
						this.renderPopover();
					}
				}


			});

			this.editor.on("focusout", event => {
				// console.log("editor focusout", event.relatedTarget, this.popoverContainer);

				if (this.activePopover && (!event.relatedTarget || !this.popoverContainer.contains(event.relatedTarget))) {

					console.log("focusout");
					this.activePopover = null;
					this.renderPopover();
				}
			});



			this.editor.on("focusin", event => {
				// console.log("editor focusin");

				// const node = this.editor.selection.getNode();
				//
				// if (node.matches("a")) {
				// 	this.editor.selection.select();
				// 	this.node = node;
				// 	this.edit("link");
				// }
				//
				// setTimeout(() => {
				// 	// this.renderPopover();
				//
				//
				//
				// }, 0);

			});

			this.editor.on("click", event => {

				const node = this.editor.selection.getNode();

				if (node.matches("a")) {
					this.edit("link");
					// this.activePopover = {
					// 	box: node.getBoundingClientRect(),
					// 	node: node,
					// 	type: "link"
					// };
					// this.renderPopover();
				}

				// if (node.matches("a")) {
				// 	this.editor.selection.select();
				// 	this.node = node;
				// 	this.edit("link");
				// }

				// if (node.matches("h1,h2,h3,h4,h5,h6")) {
				// 	this.editor.selection.select();
				// 	this.node = node;
				// 	this.edit("heading");
				// }
			});


		}


		return this.editor;
	}

	async edit(value, ...path) {
	// console.log(value);
		// const node = this.editor.selection.getNode();
		// console.log(node);

		switch (value) {

			case "link":

				// console.log(this.editor.selection.getNode());

				// if (node && node.href) {

				// this.editor.execCommand("mceInsertLink", false, {
				// 	"href": "xxx",
				// 	"html": "zzz"
				// });

				// let link = this.editor.selection.getNode();
				//
				// if (link) {
				// 	// if (!link.matches("a")) {
				// 	// 	this.editor.execCommand('HiliteColor', false, '#ffcccc');
				// 	// 	link = this.editor.selection.getNode();
				// 	// }
				//
				// 	this.activePopover = {
				// 		node: link,
				// 		type: "link",
				// 		pseudo: true
				// 	};
				//
				// 	await this.renderPopover();
				// }


				// try {
				// 	this.editor.execCommand("mceInsertLink", false, {
				// 		"href": "#"
				// 	});
				// } catch(error) {}

				const node = this.editor.selection.getNode();
				// const range = this.editor.selection.getRng();
				const sel = this.editor.selection.getSel();

				// console.log();
				// const content = this.editor.selection.getContent();

				// if (!content.length) {
				//
				// 	// anchorNode
				//
				// 	console.log(sel.anchorNode);
				// }
				//
				// if (node.matches("a")) {
				//
				// }

				// console.log(node.attributes);
				//
				// const box = (node.matches("a") && node || sel).getBoundingClientRect()
				//
				//
				//
				// this.activePopover = {
				// 	box: box,
				// 	node: node,
				// 	type: "link"
				// };

				if (node.matches("a")) {

					this.activePopover = {
						box: node.getBoundingClientRect(),
						node: node,
						type: "link"
					};

				} else if (this.editor.selection.getContent().length) {

					this.activePopover = {
						box: this.editor.selection.getRng().getBoundingClientRect(),
						node: node,
						type: "link"
					};

				}


				// this.editor.selection.select();

				await this.renderPopover();



				// this.hiliteNode = this.editor.selection.getNode();
				// this.editor.selection.select(this.hiliteNode);

				// this.popover = "link";
				// await this.renderPopover();
				// }
				// this.editor.execCommand("mceLink", true);
				// console.log(this.editor.selection.getRng().getBoundingClientRect());

				break;



			// case "insertlink":
			//
			// 	// this.editor.execCommand("mceInsertContent", false, {
			// 	// 	tagName: "div",
			// 	// 	classes: "hhhhh",
			// 	// 	title: "jhkku"
			// 	// });
			// 	// this.editor.execCommand("mceInsertContent", false, 'My new content');
			// 	this.editor.execCommand('HiliteColor', false, '#FF0000');
			// 	// await this.renderPopover();
			//
			//
			// 	break;

			case "unlink":
			case "bold":
			case "italic":
			case "strikethrough":
			case "superscript":
			case "subscript":
				this.editor.execCommand(value);
				await this.setValue(null, [this.editor.getContent()]);
				break;

			case "heading":
				this.popover = "heading";
				await this.renderPopover();
				// this.editor.execCommand("FormatBlock", false, "h3");
				// await this.setValue(null, [this.editor.getContent()]);
				break;

			case "h1":
			case "h2":
			case "h3":
			case "h4":
			case "h5":
			case "h6":
			case "p":
				this.editor.execCommand("FormatBlock", false, value);
				await this.setValue(null, [this.editor.getContent()]);
				break;

			case "ul":
				this.editor.execCommand('InsertUnorderedList', false, {
				  'list-style-type': 'disc'
				});
				break;

			case "ol":
				this.editor.execCommand('InsertOrderedList', false, {
				  'list-style-type': 'decimal'
				});
				break;

			case "table":
				this.editor.execCommand('mceInsertTable', false, { rows: 2, columns: 2 });

				// this.editor.execCommand('mceTableInsertColAfter', false);

				break;

			case "close":

				console.log("close");
				this.activePopover = null;
				await this.renderPopover();
				break;


		}




	}

	async setValue(deprec, value, key) {

		switch (key) {

			case "format":
				this.setFormat(value.toString());
				await super.setValue(null, [this.editor.getContent()]);
				break;


			default:
				await super.setValue(null, value);
				break;

		}


		// if (key) {
		//
		//
		//
		// } else {
		//
		// 	await super.setValue(null, value);
		//
		// }

	}



	async fetchValue(deprec, key, ...path) {


		if (key) {

			switch (key) {

				case "link":

					return [this.getLink()];
					// return KarmaFieldsAlpha.DeepObject.get({
					// 	href: [this.editor.selection.getNode().href || ""],
					// 	target: [],
					// 	attachment_id: []
					// }, ...path);

				case "format":
					return [this.getFormat()];


				default:
					return [];


			}

		}

		return super.fetchValue();
	}

	async fetchState(state, ...path) {

		switch (state) {

			case "bold":
			case "italic":
			case "strikethrough":
			case "superscript":
			case "subscript":
				return Boolean(this.editor) && this.editor.queryCommandState(state);

			case "h1":
			case "h2":
			case "h3":
			case "h4":
			case "h5":
			case "h6":
				return Boolean(this.editor) && this.editor.queryCommandValue("FormatBlock") === state;

			case "heading":
				return Boolean(this.editor && this.editor.queryCommandValue("FormatBlock").match(/h[1-6]/));

			case "link":
				return Boolean(this.editor && this.editor.selection.getNode().matches("a") || this.activePopover && this.activePopover.type === "link");

			// case "unlinkable":
			// 	return !this.editor || !(this.editor.selection.getNode().matches("a") || this.editor.selection.getContent().length > 0 || this.activePopover && this.activePopover.type === "link");

			case "unlink":
				return Boolean(this.getLink().href);

			default:
				// console.log(this.editor && this.editor.selection.getNode());
				return super.fetchState(state, ...path);


		}
	}

	getLink() {
		const node = this.editor.selection.getNode();

		if (node.matches("a")) {
			// const href = node.href || "";
			let href = node.getAttribute("href") || "";
			let target = node.target === "_blank" ? "1" : "";
			let attachment_id = node.getAttribute("data-attachment-id");

			if (href === "#") {
				href = '';
			}
			// console.log(href);

			return {
				href: [href],
				target: [target],
				attachment_id: attachment_id ? [attachment_id] : []
			};
		}

		return {};
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

	async send(value, key, ...path) {

		if (key) {

			switch (key) {

				case "link":
					// const node = this.editor.selection.getNode();
					// return [{
					// 	href: [node.href || ""],
					// 	target: [node.target === "_blank" ? "1" : ""],
					// 	attachment_id: node.hasAttribute("data-attachment-id") ? [node.getAttribute("data-attachment-id")] : []
					// }];

					// debugger;

					this.setLink(value);
					// this.popover = null;

					var value = this.editor.getContent();
					await this.setValue(null, [value]);

					console.log("send form");
					this.activePopover = null;
					await this.renderPopover();




			}

		}
	}

	// async isModified(key, ...path) {
	//
	//
	// 	// if (key) {
	// 	//
	// 	// 	switch (key) {
	// 	// 		case "link":
	// 	//
	// 	//
	// 	// 			return this.link.buffer.equal(this.fetchValue(null, key));
	// 	//
	// 	// 		default:
	// 	// 			return false;
	// 	// 	}
	// 	//
	// 	// }
	// 	//
	// 	// return super.isModified();
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
								children: [
									{
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
										],
										// value: "heading",
										// active: "heading"
									},
									// {
									// 	type: "button",
									// 	dashicon: "heading",
									// 	value: "heading",
									// 	active: "heading"
									// },
									{
										type: "button",
										dashicon: "editor-italic",
										title: "italic",
										value: "italic",
										active: "italic"
									},
									{
										type: "button",
										dashicon: "editor-bold",
										title: "bold",
										value: "bold",
										active: "bold"
									},
									{
										type: "button",
										dashicon: "admin-links",
										title: "link",
										value: "link",
										active: "link"
										// disabled: "unlinkable"
									},
									{
										type: "button",
										dashicon: "editor-ul",
										title: "Unordered list",
										value: "ul"
									},
									{
										type: "button",
										dashicon: "editor-ol",
										title: "Ordered list",
										value: "ol"
									},
									{
										type: "button",
										dashicon: "editor-table",
										title: "Table",
										value: "table"
									},
									{
										type: "button",
										title: "insertlink",
										value: "insertlink"
									}

								]
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


						// container.element.onfocusin = event => {
						// 	// this.hasPopoverFocus = true;
						//
						// 	// console.log("popover focusin", this.editor.selection.getNode());
						//
						// }

						container.element.onfocusout = event => {
							if (this.activePopover && (!event.relatedTarget || !container.element.contains(event.relatedTarget) && !this.editor.getBody().contains(event.relatedTarget))) {

								// console.log("popover onfocusout", this.editor.getBody());

								// this.hasPopoverFocus = false;

								// const node = this.editor.selection.getNode();
								//
								// console.log(this.activePopover.node);
								//
								// setTimeout(() => {
								//
								// 	const node = this.editor.selection.getNode();
								//
								//
								// 	if (this.activePopover.node && node !== this.activePopover.node) {
								//
								// 		if (this.activePopover.node.getAttribute("href") === "#") {
								//
								// 			this.activePopover.node.parentNode.replaceChild(this.activePopover.node.innerHTML, this.activePopover.node);
								//
								// 		}
								//
								//
								//
								// 	}
								//
								//
								//
								// }, 10);

								this.activePopover = null;



								container.render();



								// if (this.activePopover.node.getAttribute("href") === "#") {
								//
								// 	this.editor.execCommand("mceInsertLink", false, {
								// 		"href": ""
								// 	});
								//
								// }
								//
								// this.activePopover = null;
								// container.render();


								// console.log("popup focusout", node,);


								// setTimeout(() => {
								//
								// 	// const node = this.editor.selection.getNode();
								// 	//
								// 	// console.log("popup focusout", node, this.editor.hasFocus());
								// 	//
								// 	// if (!node || !node.matches("a")) {
								// 	// 	this.popover = null;
								// 	// 	container.render();
								// 	// }
								//
								//
								//
								// 	if (!this.editor.hasFocus()) { // -> click outside
								// 		this.popover = null;
								// 		container.render();
								// 	}
								//
								// }, 10);




								// this.editor.selection.select(this.hiliteNode);
								// this.editor.execCommand("RemoveFormat");



								// console.log(this.editor.selection.getNode());
								// this.editor.execCommand('HiliteColor', false);

							}
						}


						container.children = [
							{
								class: "link-popover karma-tinymce-popover",
								init: popover => {
									popover.element.tabIndex = -1;
								},
								update: popover => {

									popover.element.classList.toggle("active", this.activePopover && this.activePopover.type === "link" || false);

									// popover.element.style.transform = "scale(0, 0)";

									// console.log(this.editor && this.editor.selection.getNode());


									// if (this.popover === "link") {



									if (this.editor && this.activePopover && this.activePopover.type === "link") {

										// const node = this.editor.selection.getNode();

										// let nodeBox;
										//
										// if (node === this.activePopover.node) {
										//
										// 	nodeBox = node.getBoundingClientRect();
										//
										// } else {
										//
										// 	nodeBox = this.editor.selection.getRng().getBoundingClientRect();
										//
										// }




										// const nodeBox = this.activePopover.node.getBoundingClientRect();

										// const nodeBox = node.matches("a") && node.getBoundingClientRect() || this.editor.selection.getRng().getBoundingClientRect();
										// const nodeBox = node.getBoundingClientRect();
										const containerBox = container.element.parentNode.getBoundingClientRect();


										popover.element.style.left = (this.activePopover.box.left - containerBox.x).toFixed()+"px";
										popover.element.style.top = (this.activePopover.box.bottom - containerBox.y + 5).toFixed()+"px";
										// popover.element.style.transform = "scale(1, 1)";


										// popover.element.style.top = "200px";

										// this.editor.selection.select();
										this.link.buffer.empty();
										this.link.buffer.setObject(this.getLink());
										popover.children = [this.link.build()];
										// popover.element.focus();
									}

								}
							}
							// {
							// 	class: "heading-popover karma-tinymce-popover",
							// 	init: popover => {
							// 		popover.element.tabIndex = -1;
							// 	},
							// 	update: popover => {
							// 		popover.element.style.transform = "scale(0, 0)";
							// 		if (this.popover === "heading") {
							//
							// 			const node = this.editor.selection.getNode();
							// 			const nodeBox = node.getBoundingClientRect();
							// 			// const nodeBox = this.editor.selection.getRng().getBoundingClientRect();
							// 			const containerBox = container.element.parentNode.getBoundingClientRect();
							//
							// 			popover.element.style.left = (nodeBox.x - containerBox.x).toFixed()+"px";
							// 			popover.element.style.top = (nodeBox.bottom - containerBox.y).toFixed()+"px";
							// 			popover.element.style.transform = "scale(1, 1)";
							//
							// 			popover.children = [this.heading.build()];
							// 			popover.element.focus();
							// 		}
							// 	}
							// }
						];
					}
				}
			]
		}
	}
}
