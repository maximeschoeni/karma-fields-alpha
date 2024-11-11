// https://github.com/tinymce/tinymce-dist/blob/master/tinymce.js

// /Applications/MAMP/htdocs/wordpress/wp-includes/js/tinymce/plugins/link/plugin.min.js





KarmaFieldsAlpha.field.tinymce = class extends KarmaFieldsAlpha.field.input {

	// static getPath(refNode, node) {
	//
	// 	const path = [];
	//
	// 	// node = node.parentNode;
	//
	// 	while (node !== refNode) {
	//
	// 		let index = 0;
	//
	// 		let prev = node.previousSibling;
	//
	// 		while(prev) {
	//
	// 			index++;
	//
	// 			prev = prev.previousSibling;
	//
	// 		}
	//
	// 		path.unshift(index);
	//
	// 		node = node.parentNode;
	//
	// 	}
	//
	// 	return path;
	//
	// }
	//
	// static getNode(node, path) {
	//
	// 	for (let index of path) {
	//
	// 		node = node.childNodes[index];
	//
	// 	}
	//
	// 	return node;
	//
	// }

	constructor(resource, id, parent) {

    super(resource, id, parent);

    this.server = new KarmaFieldsAlpha.Server();

  }

	async abduct() {

		if (this.container) {

			this.content = this.getContent();

			if (this.content.mixed) {

				this.mode = "mixed";

			} else {

				this.mode = this.getState("mode") || "edit";

			}


			// await abduct(this.element, this.buildEditor());

			// this.focusInside = await this.hasFocusInside();

			await KarmaFieldsAlpha.build({
				class: "mode mode-edit",
				update: node => {
					node.children = [...this.buildEditor(true)];
				}
			}, this.editorcontainer, this.editorcontainer.firstElementChild);


		}

	}

	async loop() {

    await this.abduct();

    while (KarmaFieldsAlpha.server.hasOrder()) { // need loading when inserting file

      await KarmaFieldsAlpha.server.process();

      await this.abduct();

    }




  }

	render() {

		const focus = this.getFocus();

		document.body.classList.toggle("karma-table-open", focus.includes("popup"));

		return this.loop();

	}

	// async setFocus() {
	//
	// 	const hasFocus = this.hasFocusInside();
	//
	// 	if (!hasFocus) {
	//
	// 		await this.parent.render();
	//
	// 	}
	//
	// 	// console.log(hasFocus, "setFocus");
	//
	// 	await  super.setFocus();
	//
	// }


  getEditor() {

		if (!this.editorManager) {

			this.editorManager = KarmaFieldsAlpha.field.tinymce.editors && KarmaFieldsAlpha.field.tinymce.editors[this.uid];

			if (!this.editorManager) {

				this.editorManager = new KarmaFieldsAlpha.tinymce();

				if (!KarmaFieldsAlpha.field.tinymce.editors) {

					KarmaFieldsAlpha.field.tinymce.editors = {};

				}

				KarmaFieldsAlpha.field.tinymce.editors[this.uid] = this.editorManager;

			}

			this.editorManager.onRender = () => this.render();
			this.editorManager.onUpdate = () => this.updateContent();
			this.editorManager.onFocus = () => this.setFocus(false);
			this.editorManager.onClick = () => this.click();
			this.editorManager.onDblClick = () => this.dblClick();

			// if (this.body) {
			//
			// 	this.editorManager.register(this.body);
			//
			// }

		}

		return this.editorManager;

  }

	async updateContent() {

		const manager = this.getEditor();

    if (!manager.loading) {

			const text = manager.editor.getContent();
			await this.save("input");
			await this.setValue(text);

			// if (!noRendering) {
			//
			// 	this.debounce(() => {
			// 		this.parent.render();
			// 	}, 400);
			//
			// }

			this.debounce(async () => {
				const textModified = manager.editor.getContent();
				if (textModified !== text) {
					console.log("text modified !!!! why??");
					await this.setValue(textModified);
				}

				await this.parent.render();
				// this.render();
			}, 400);



		}

	}

	async click() {

		const manager = this.getEditor();

		const hasFocus = this.hasFocusInside();


		if (!manager.loading) {

			let node = manager.editor.selection.getNode();

			const link = node.closest(".tinymce a");
			// const img = node.closest(".tinymce img");

			if (link) { // target node may be outside editor !!

				const field = this.getChild("linkForm");
				await field.setFocus();

			}
			// else if (img) {
			//
			// 	const field = this.getChild("filesAttacher");
			// 	const id = img.getAttribute("data-id");
			//
			// 	await field.edit([id]);
			//
			// }
			// else if (node && node.matches("figure,img") && manager.editor.getBody().contains(node)) { // target node may be outside editor !!
			//
			// 	// const field = this.getChild("imageForm");
			// 	// await field.setFocus();
			//
			// }

		}

	}

	async dblClick() {

		const manager = this.getEditor();

		if (!manager.loading) {

			let node = manager.editor.selection.getNode();

			const img = node.closest(".tinymce img");

			if (img) {

				const field = this.getChild("filesAttacher");
				const id = img.getAttribute("data-id");

				await field.edit([id]);

			}

		}

	}

  queryCommand(key) {

		const response = new KarmaFieldsAlpha.Content();
    const manager = this.getEditor();

    if (manager.loading) {

      response.loading = true;

    } else {

			response.value = manager.editor.queryCommandState(key);

		}

		return response;
  }

  async execCommand(key) {

    const manager = this.getEditor();

    if (!manager.loading) {

      manager.editor.execCommand(key);

			const text = manager.editor.getContent();

			await this.save(key, key);
			await this.setValue(text);
			await this.parent.render();

			// await this.updateContent();

    }

  }

  queryUL() {

		const response = new KarmaFieldsAlpha.Content();
    const manager = this.getEditor();

    if (manager.loading) {

      response.loading = true;

    } else {

			response.value = manager.editor.queryCommandValue("InsertUnorderedList") === "true";

		}

		return response;
  }

  queryOL() {

		const response = new KarmaFieldsAlpha.Content();
    const manager = this.getEditor();

    if (manager.loading) {

      response.loading = true;

    } else {

			response.value = manager.editor.queryCommandValue("InsertOrderedList") === "true";

		}

		return response;
  }


  async execUL() {

    const manager = this.getEditor();

    if (!manager.loading) {

      if (manager.editor.queryCommandValue("InsertUnorderedList") !== "true") {

        manager.editor.execCommand('InsertUnorderedList', false, {
          'list-style-type': 'disc'
        });

      } else {

        manager.editor.execCommand("RemoveList");

      }

			const text = manager.editor.getContent();
			await this.save("ul", "ul");
			await this.setValue(text);
			await this.parent.render();


    }

  }

  async execOL() {

    const manager = this.getEditor();

    if (!manager.loading) {

      if (manager.editor.queryCommandValue("InsertOrderedList") !== "true") {

        manager.editor.execCommand('InsertOrderedList', false, {
          'list-style-type': 'decimal'
        });

      } else {

        manager.editor.execCommand("RemoveList");

      }

			const text = manager.editor.getContent();
			await this.save("ol", "ol");
			await this.setValue(text);
			await this.parent.render();

    }

  }

  getFormat() {

		const response = new KarmaFieldsAlpha.Content();
    const manager = this.getEditor();

    if (manager.loading) {

      response.loading = true;

    } else {

			const matches = manager.editor.queryCommandValue("FormatBlock").match(/h[1-6]/);

			response.value = matches && matches[0] || "";

		}

		return response;
  }

  async setFormat(value) {

    const manager = this.getEditor();

    if (!manager.loading) {

      manager.editor.execCommand("FormatBlock", false, value);

			const text = manager.editor.getContent();
			await this.save("format", "format");
			await this.setValue(text);
			await this.parent.render();

    }

  }

  queryLink() {

		const response = new KarmaFieldsAlpha.Content();
		const manager = this.getEditor();

    if (manager.loading) {

			response.loading = true;

		} else {

      const node = manager.editor.selection.getNode();
			const a = node && node.closest("a");

      response.value = Boolean(a);

		}

		return response;
  }

	async unlink() {

		const manager = this.getEditor();

    if (!manager.loading) {

			const node = manager.editor.selection.getNode();
			const a = node && node.closest("a");

			if (a) {

				manager.editor.selection.select(a);

			}

      manager.editor.execCommand("Unlink");

			manager.editor.selection.collapse();

			const text = manager.editor.getContent();
			await this.save("unlink", "unlink");
			await this.setValue(text);
			await this.setFocus();
			await this.parent.render();

    }

	}

	async insertImage(html) {

	  let manager = this.getEditor();

		if (!manager.loading) {

			manager.editor.execCommand(
				'mceInsertContent',
				false,
				html
			);

			// const node = manager.editor.selection.getNode();

			// manager.editor.selection.setNode(node.parentNode.parentNode);

			// manager.editor.selection.collapse(true);
			//
			// const node = manager.editor.selection.getNode();
			//
			// manager.editor.selection.select(node);

			const text = manager.editor.getContent();

			await this.setValue(text);

			await this.setFocus();

			await this.render();

		}

	}

	async addImage() {

		const field = this.getChild("filesAttacher");

		if (field) {

			await field.open();
			await this.render();

		}

	}

	// async insertLink() {
	//
  //   let manager = this.getEditor();
	//
	// 	if (!manager.loading) {
	//
	// 		manager.editor.execCommand("mceInsertLink", false, {
	// 			"href": "nolink"
	// 		});
	//
	// 		manager.editor.selection.collapse(true);
	//
	// 		const node = manager.editor.selection.getNode();
	//
	// 		manager.editor.selection.select(node);
	//
	// 		const text = manager.editor.getContent();
	//
	// 		await this.setValue(text);
	//
	// 	}
	//
  // }


	async insertLink() {

    let manager = this.getEditor();

		if (!manager.loading) {

			// const node = manager.editor.selection.getNode();
			//
			// console.log(node);
			// manager.editor.selection.select(node);

			// const selection = manager.editor.selection.getSel();
			// selection.modify('move', 'foward', 'word');
			// selection.modify('extend', 'backward', 'word');

			const linkField = this.getChild("linkForm");
			await linkField.setFocus();
			await this.render();

		}

  }
	//
	// async attachMedias(ids) {
	//
	// 	const field = this.getChild("imageForm");
	//
	// 	await field.edit();
	//
	// 	await field.setFocus();
	//
	// }





  getMode() {

		if (this.content) {

			if (this.content.mixed) {

				return "mixed";

			} else if (!this.content.loading) {

				return this.getState("mode") || "edit";

			}

		}

	  return "";

  }

  async execMode(value) {

    await this.setState(value, "mode");
		await this.parent.render();

  }

	getContent(key) {

    switch (key) {

      case "format":
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

			// // deprec
      // case "linkform":
      //   // return this.getLinkForm();
			// 	const linkForm = this.getLinkForm();
			// 	return new KarmaFieldsAlpha.Content(linkForm);

			case "raw":
				return this.parent.getContent(this.getKey());


      default:
        return super.getContent();

    }

  }

	async setValue(value, key) {

    switch (key) {

      case "format":
        await this.setFormat(value);
				break;

			case "file":
				const id = value[0];
				await this.insert(id);
				await this.setFocus(true);
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
        this.execCommand(key);
        break;

			case "raw":
				await this.parent.setValue(value, this.getKey());
				break;

      default:
				await super.setValue(value);
        break;

    }
  }


  hasContentSelected() {

		const response = new KarmaFieldsAlpha.Content();
    const manager = this.getEditor();

    if (manager.loading) {

      response.loading = true;

    } else {

			response.value = manager.editor.selection.getContent().length > 0;

		}

		return response;
  }



	getDriver() {

    return this.resource.driver || "medias";

  }


	// async attachMedias(ids) {
	//
	// 	const filesField = new KarmaFieldsAlpha.field.files({
	// 		uploader: "wp",
	// 		key: "file",
	// 		mimetype: ["image"]
	// 	}, "attachFile", this);
	//
	// 	await filesField.edit();
	//
	// }

	async attachMedias() {

		const field = this.getChild("imageForm");

		await field.edit();

		await field.setFocus();

	}


	newChild(type) {

		if (type === "linkForm") {

			return new KarmaFieldsAlpha.field.tinymce.linkForm(this.resource.linkForm, "linkForm", this);

		} else if (type === "imageForm") {

			return new KarmaFieldsAlpha.field.tinymce.imageForm({
				uploader: "wp",
				...this.resource.imageForm
			}, "imageForm", this);

		} else if (type === "textarea") { // mixed

			return new KarmaFieldsAlpha.field.textarea({
				key: "raw"
			}, "textarea", this);

		} else if (type === "code") { // code

			return new KarmaFieldsAlpha.field.textarea({
				key: "raw"
			}, "textarea", this);

		} else if (type === "codemodetoolbar") {

			return new KarmaFieldsAlpha.field.tinymce.buttons({
				children: ["separator", "edit"],
				...this.resource.textarea_buttons
			}, "codemodetoolbar", this);

		} else if (type === "editortoolbar") {

			return new KarmaFieldsAlpha.field.tinymce.buttons(this.resource.buttons || this.resource.header, "editortoolbar", this);

		} else if (type === "attachFile") {

			return new KarmaFieldsAlpha.field.files({
				uploader: "wp",
				key: "file",
				mimetype: ["image"],
				...this.resource.attachFile
			}, "attachFile", this);

		} else if (type === "filesAttacher") {

			return new KarmaFieldsAlpha.field.tinymce.filesAttacher({
				...this.resource.fileAttacher
			}, "filesAttacher", this);

			// this.createChild({
			// 	type: "filesAttacher"
			// }, "filesAttacher")

		}

	}


	*buildMixed() {

		if (this.mode === "mixed") {

			yield {
				class: "textarea",
				update: node => {
					node.child = this.getChild("textarea").build()
				}
			}

		}

	}

	*buildCode() {

		if (this.mode === "code") {

			yield {
				class: "editor-header",
				children: [
					{
						// class: "toolbar simple-buttons",
						class: "toolbar",
						child: this.getChild("codemodetoolbar").build()
					}
				]
			};

			yield {
				class: "textarea editor-body",
				child: this.getChild("code").build()
			};

		}

	}

	*buildEditor(localEdit) {

		if (this.mode === "edit") {

			yield {
				class: "editor-header",
				children: [
					{
						class: "toolbar simple-buttons",
						child: this.getChild("editortoolbar").build()
					}
				]
			};

			if (localEdit) {

				yield {
					class: "tinymce editor-body",
				};

			} else {

				yield {
					class: "tinymce editor-body",
					init: node => {
						node.element.editable = true;
					},
					update: async node => {
						if (!this.content.loading) {
							const manager = this.getEditor();
							await manager.register(node.element, this.uid, this.resource.params);
							const diff = manager.editor.getContent() !== this.content.toString();
							if (diff) {
								manager.editor.setContent(this.content.toString());
							}
						}
					}
				};

			}

			// yield {
			// 	class: "karma-popover-container imageform-container",
			// 	children: [...this.getChild("imageForm").build()],
			// 	// update: node => {
			// 	// 	const field = this.getChild("imageForm");
			// 	// 	field.focusInside = field.hasFocusInside();
			// 	// 	node.children = [...field.build()];
			// 	// }
			// };

			yield {
				class: "karma-popover-container linkform-container",
				children: [...this.getChild("linkForm").build()]
				// update: node => {
				// 	const field = this.getChild("linkForm");
				// 	field.focusInside = field.hasFocusInside();
				// 	node.children = [...field.build()];
				// }
			};


			yield {
				children: [
					// ...this.createChild({
					// 	type: "filesAttacher"
					// }, "filesAttacher").build()
					this.getChild("filesAttacher").build()
				]
			};

		}

	}

	build() {

		this.content = this.getContent();

		if (this.content.mixed) {

			this.mode = "mixed";

		} else {

			this.mode = this.getState("mode") || "edit";

		}


		return {
			class: "editor karma-tinymce",
      update: container => {

				this.container = container.element;

				// this.selection = this.getSelection();

				// this.focusInside = this.hasFocusInside();

				container.element.classList.toggle("loading", Boolean(this.content.loading));

				container.element.onmousedown = event => {
					event.stopPropagation();
					this.setFocus(this.content.mixed);
				}
      },
			children: [
				{
					class: "mode mode-mixed",
					update: node => {
						// node.element.classList.toggle("hidden", !this.content.mixed);
						node.element.classList.toggle("hidden", this.mode !== "mixed");
						// node.children = [...this.buildMixed()];
					},
					children: [...this.buildMixed()]
				},
				{
					class: "mode mode-code",
					children: [...this.buildCode()],
					update: node => {
						node.element.classList.toggle("hidden", this.mode !== "code");
						// node.children = [...this.buildCode()];
					}
				},
				{
					class: "mode-edit-container",
					update: node => {
						this.editorcontainer = node.element;
					},
					child: {
						class: "mode mode-edit",
						children: [...this.buildEditor()],
						update: node => {
							this.element = node.element;
							const hasFocus = this.hasFocusInside();
							node.element.classList.toggle("active", Boolean(hasFocus));
							node.element.classList.toggle("hidden", this.mode !== "edit");
							// node.children = [...this.buildEditor()];
						}
					}
				}
			]
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

KarmaFieldsAlpha.field.tinymce.buttons = class extends KarmaFieldsAlpha.field.group {

	constructor(resource, id, parent) {

		super({
			display: "flex",
			simplebuttons: true,
			// children: ["format", "bold", "italic", "link", "ul", "ol"],
			children: ["format", "bold", "italic", "link", "ul", "ol", "image", "code"],
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.tinymce.buttons.format = class extends KarmaFieldsAlpha.field.dropdown {
	constructor(resource, id, parent) {
		super({
			type: "dropdown",
			key: "format",
			options: [
				{id: "", name: "Format"},
				{id: "h1", name: "H1"},
				{id: "h2", name: "H2"},
				{id: "h3", name: "H3"},
				{id: "h4", name: "H4"},
				{id: "h5", name: "H5"},
				{id: "h6", name: "H6"},
				{id: "p", name: "P"}
			],
			...resource
		}, id, parent);
	}
}


KarmaFieldsAlpha.field.tinymce.buttons.bold = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "editor-bold",
			title: "Bold",
			action: "execCommand",
			params: ["bold"],
			// value: "bold",
			active: ["request", "queryCommand", "bold"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.tinymce.buttons.italic = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "editor-italic",
			title: "Italic",
			action: "execCommand",
			// value: "italic",
			params: ["italic"],
			active: ["request", "queryCommand", "italic"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.tinymce.buttons.link = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "admin-links",
			title: "Link",
			action: "insertLink",
			// request: ["insertLink"],
			active: ["request", "queryLink"],
			// enabled: ["||", ["request", "hasContentSelected"], ["request", "queryLink"]],
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

KarmaFieldsAlpha.field.tinymce.buttons.image = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "format-image",
			title: "Image",
			action: "addImage",
			// active: ["request", "queryImage"],
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

KarmaFieldsAlpha.field.tinymce.buttons.ul = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "editor-ul",
			title: "Unordered list",
			action: "execUL",
			active: ["request", "queryUL"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.tinymce.buttons.ol = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "editor-ol",
			title: "Ordered list",
			action: "execOL",
			active: ["request", "queryOL"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.tinymce.buttons.code = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "editor-code",
			title: "Code",
			action: "execMode",
			// value: "code",
			params: ["code"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.tinymce.buttons.edit = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "edit",
			title: "Code",
			action: "execMode",
			// value: "edit",
			params: ["edit"],
			...resource
		}, id, parent);
	}
}


KarmaFieldsAlpha.field.tinymce.buttons.strikethrough = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.superscript = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.superscript = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.justifyLeft = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.justifyCenter = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.justifyRight = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.justifyFull = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.justifyNone = class extends KarmaFieldsAlpha.field.button {
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




KarmaFieldsAlpha.field.tinymce.form = class extends KarmaFieldsAlpha.field.group {

	// getContent(subkey) {
	//
	// 	const content = new KarmaFieldsAlpha.Content();
	//
	// 	content.value = this.getOption(subkey);
	//
	// 	if (content.value === undefined) {
	//
	// 		const key = this.getKey();
	//
	// 		const obj = this.parent.getContent(key);
	//
	// 		content.value = KarmaFieldsAlpha.DeepObject.get(obj.toObject(), subkey);
	//
	// 	} else {
	//
	// 		content.modified = true;
	//
	// 	}
	//
	// 	return content;
	//
	// }
	//
	// setValue(value, subkey) {
	//
	// 	this.setOption(value, subkey);
	//
	// }
	//
	// async submit() {
	//
	// 	const value = this.getOption();
	//
	// 	if (value) {
	//
	// 		const key = this.getKey();
	//
	// 		await this.parent.setValue(value, key);
	//
	// 	}
	//
	// 	await this.close();
	//
	// }
	//
	// close() {
	//
	// 	this.removeOption();
	//
	// 	this.parent.request("closelink");
	//
	// }
	//
	// hasChange() {
	// 	const content = new KarmaFieldsAlpha.Content();
	//
	// 	const data = this.getOption();
	//
	// 	content.value = Boolean(data && Object.values(data).length);
	//
	// 	return content;
	//
	// }

	// isActive() {
	//
	// 	const manager = this.parent.getEditor();
	//
	// 	if (!manager.loading) {
	//
	// 		let node = manager.editor.selection.getNode();
	//
	// 		if (node && manager.editor.getBody().contains(node)) { // target node may be outside editor !!
	//
	// 			return node.matches(this.resource.selector);
	//
	// 		}
	//
	// 	}
	//
	// 	return false;
	//
	// }

	isActive() {

		// const manager = this.parent.getEditor();
		//
		// if (!manager.loading) {
		//
		// 	let node = manager.editor.selection.getNode();
		//
		// 	if (node && manager.editor.getBody().contains(node)) { // target node may be outside editor !!
		//
		// 		return node.matches(this.resource.selector);
		//
		// 	}
		//
		// }
		//
		// return false;

		// return this.hasFocusInside();

		return this.hasFocusInside();

		// return this.focusInside;

	}

	*build() {

		if (this.isActive()) {

			yield {
				class: "karma-tinymce-popover active",
				child: super.build(),
				init: popover => {
					popover.element.onmousedown = event => {
						event.stopPropagation();
					}
				},
				update: popover => {

					const manager = this.parent.getEditor();
					const targetElement = manager.editor.selection.getNode();

					const editorBody = manager.editor.getElement();
					const containerBox = editorBody.parentNode.getBoundingClientRect();
					const box = targetElement.getBoundingClientRect();

					const parentWidth = popover.element.parentNode.parentNode.clientWidth;
					const width = Math.min(360, containerBox.width);
					const left = Math.min(box.left - containerBox.left, parentWidth - width);
					let top = box.top - containerBox.top + box.height + 5;

					popover.element.style.left = `${left.toFixed()}px`;
					popover.element.style.top = `${top.toFixed()}px`;
					popover.element.style.width = `${width.toFixed()}px`;



				}
			};

			// yield {
			// 	class: "test",
			// 	update: node => {
			// 		node.element.style.position = "absolute";
			//
			// 		node.element.style.backgroundColor = "red";
			// 		node.element.style.opacity = "0.1";
			//
			// 		const manager = this.parent.getEditor();
			// 		const targetElement = manager.editor.selection.getNode();
			// 		const rng = manager.editor.selection.getRng();
			//
			// 		const rngBox = rng.getBoundingClientRect();
			//
			// 		const editorBody = manager.editor.getElement();
			// 		const containerBox = editorBody.parentNode.getBoundingClientRect();
			// 		const box = targetElement.getBoundingClientRect();
			//
			// 		node.element.style.top = `${rngBox.top - containerBox.top}px`;
			// 		node.element.style.left = `${rngBox.left - containerBox.left}px`;
			// 		node.element.style.width = `${rngBox.width}px`;
			// 		node.element.style.height = `${rngBox.height}px`;
			//
			// 		console.log(box, containerBox);
			//
			//
			// 	}
			// }

		}

	}

}


KarmaFieldsAlpha.field.tinymce.linkForm = class extends KarmaFieldsAlpha.field.tinymce.form {

	constructor(resource, id, parent) {
		super({
			key: "linkform",
			selector: "a",
			children: [
				"linkFormInput",
				"target",
				"linkFormFooter"
			],
			...resource
		}, id, parent);
	}

	getContent(subkey) {

		const response = new KarmaFieldsAlpha.Content();

		const state = this.getData(subkey);

		if (state === undefined) {

			const request = this.parent.getEditor();

	    if (request.loading) {

				response.loading = true;

			} else {

	      const node = request.editor.selection.getNode();
				const a = node && node.closest(".tinymce a");

	      if (a) {

					if (subkey === "href") {

						let href = a.getAttribute("href");

						if (href === "nolink") {

							response.value = "";

						} else {

							response.value = href || "";

						}

					} else if (subkey === "target") {

						response.value = a.getAttribute("target") === "_blank" ? "1" : "";

					}

	      }

	    }

		} else {

			response.value = state;
			response.modified = true;

		}

		return response;
	}

	setValue(value, subkey) {

		return this.setData(value, subkey);

	}

	async submit() {

		let href = this.getContent("href");
		let targetBlank = this.getContent("target");
		let request = this.parent.getEditor();

		if (!href.loading && !targetBlank.loading && !request.loading) {

			if (href.toString() === "") {

				request.editor.execCommand("Unlink");

			} else {
// debugger;
				const node = request.editor.selection.getNode();

				// if (node.parentNode.tagName === "FIGURE") {
				//
				// 	const a = document.createElement("a");
				// 	a.href = "Uilgizlgzig";
				// 	a.innerHTML = node.parentNode.outerHTML;
				// 	// a.appendChild(node.parentNode);
				//
				// 	node.parentNode.replaceWith(a);
				//
				//
				// // if (node.parentNode.tagName === "FIGURE") {
				// //
				// // 	request.editor.selection.setNode(node.parentNode);
				// // 	//
				// // 	// const parentnode = request.editor.selection.getNode();
				// // 	//
				// // 	// console.log(parentnode.outerHTML);
				// //
				// // 	request.editor.insertContent(`<a href="KHGlzgu">hhhhh</a>`);
				// //
				// } else {

					request.editor.execCommand("mceInsertLink", false, {
						"href": href.toString(),
						"target": targetBlank.toBoolean() ? "_blank" : null
					});

				// }



			}

			const text = request.editor.getContent();

			await this.save("link", "link");
			await this.parent.setValue(text);
			// await this.parent.parent.render();

		}

		await this.close();

	}

	async close() {

		KarmaFieldsAlpha.server.setData({}, this.uid);

		this.parent.setFocus();

		const request = this.parent.getEditor();

		await this.parent.setFocus();

		await this.parent.parent.render();

  }

	async hasChange() {

		const response = new KarmaFieldsAlpha.Content();

		const data = this.getState();

		response.value = Boolean(data && Object.values(data.toObject()).length);

		return response;

	}

}




KarmaFieldsAlpha.field.tinymce.linkFormInput = class extends KarmaFieldsAlpha.field.group {
	constructor(resource, id, parent) {
		super({
			display: "flex",
			children: [
				"href",
				"attachFile"
			],
			...resource
		}, id, parent);
	}

}

KarmaFieldsAlpha.field.tinymce.linkFormFooter = class extends KarmaFieldsAlpha.field.group {
	constructor(resource, id, parent) {
		super({
			display: "flex",
			children: [
				"cancel",
				"unlink",
				"separator",
				"applyButton"
			],
			...resource
		}, id, parent);
	}

}




KarmaFieldsAlpha.field.tinymce.linkForm.href = class extends KarmaFieldsAlpha.field.input {

	constructor(resource, id, parent) {

		super({
			key: "href",
			style: "flex-grow:1",
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.tinymce.linkForm.target = class extends KarmaFieldsAlpha.field.checkbox {

	constructor(resource, id, parent) {

		super({
			key: "target",
			text: "Open in new tab",
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.tinymce.linkForm.cancel = class extends KarmaFieldsAlpha.field.button {

	constructor(resource, id, parent) {

		super({
			text: "Cancel",
			request: ["close"],
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.tinymce.linkForm.unlink = class extends KarmaFieldsAlpha.field.button {

	constructor(resource, id, parent) {

		super({
			text: "Unlink",
			action: "unlink",
			// disabled: ["!", ["getValue", "href"]],
			...resource
		}, id, parent);

	}

}
KarmaFieldsAlpha.field.tinymce.linkForm.applyButton = class extends KarmaFieldsAlpha.field.button {

	constructor(resource, id, parent) {

		super({
				text: "Apply",
				action: "submit",
				primary: true,
			...resource
		}, id, parent);

	}

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


KarmaFieldsAlpha.field.tinymce.linkForm.attachFile = class extends KarmaFieldsAlpha.field.files {

	constructor(resource, id, parent) {

		super({
			// uploader: "wp",

			// dashicon: "paperclip",
			// action: "attachfile",
			...resource
		}, id, parent);

	}

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

	build() {

		return {
			children: [
				this.createChild({
					type: "button",
					action: "open",
					dashicon: "paperclip"
				}).build(),
				...this.buildPopup()
			]
		}

	}

	async insert(ids) {

		const mediaField = new KarmaFieldsAlpha.field.media({

			id: ids[0],
			driver: this.getDriver(),
			display: "full"
		}, "media", this);

		let media = await mediaField.getMedia();

		while (media.icon === "loading") {

			await this.render();
			media = await mediaField.getMedia();

		}

		await this.parent.setValue(media.src, "href");

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



KarmaFieldsAlpha.field.tinymce.filesAttacher = class extends KarmaFieldsAlpha.field.files {

	getBody() {}
	getFooter() {}

	async insert(ids) {

		const mediaField = new KarmaFieldsAlpha.field.media({
			id: ids[0],
			driver: this.getDriver(),
			display: "full"
		}, "media", this);

		let media = await mediaField.getMedia();

// 		console.log(media);
// debugger;
		let postExcerpt = this.getWild("medias", ids[0], "post_excerpt");

		while (postExcerpt.loading) {

			await this.render();
			postExcerpt = this.getWild("medias", ids[0], "post_excerpt");

		}

		const element = document.createElement("div");

		await KarmaFieldsAlpha.build({
			tag: "img",
			init: node => {
				node.element.src = media.src;
				node.element.setAttribute("data-id", ids[0]);
			}
		}, element);

		this.parent.request("insertImage", element.innerHTML);

	}

}


KarmaFieldsAlpha.field.tinymce.imageForm = class extends KarmaFieldsAlpha.field.tinymce.form {
	constructor(resource, id, parent) {
		super({
			children: [
				{
					type: "group",
					children: [
						{
							type: "group",
							display: "flex",
							children: [
								{
									type: "button",
									dashicon: "edit",
									title: "Replace Image",
									action: "addmedia"
								},
								{
									type: "button",
									dashicon: "align-none",
									action: "alignnone",
									// active: "alignnone"
								},
								{
									type: "button",
									dashicon: "align-left",
									action: "alignleft",
									// active: "alignleft"
								},
								{
									type: "button",
									dashicon: "align-center",
									action: "aligncenter",
									// active: "aligncenter"
								},
								{
									type: "button",
									dashicon: "align-right",
									action: "alignright",
									// active: "alignright"
								}
							]
						},
						{
							type: "checkbox",
							key: "has-caption",
							text: "Caption"
						},
						{
							type: "checkbox",
							key: "has-link",
							text: "Link"
						}
					]
				}
			],
			...resource
		}, id, parent);
	}

	getMax() {

		return Infinity;

	}


	async edit() {

		if (this.resource.uploader === "wp" || this.resource.library === "wp") {

      await KarmaFieldsAlpha.field.files.prototype.openMediaLibrary.call(this);

    } else {

      await super.edit();

    }

	}

	// attachfile() {
	//
	// 	const table = KarmaFieldsAlpha.mediasTable || "medias";
	//
	// 	// const selection = this.getSelection() || {};
	// 	// selection.final = true;
	//
	// 	this.parent.request("fetch", table);
	//
	// }

	async getContent(key) {

		return this.getState(key);

	}

	async setValue(value, key) {

		return this.setState(value, key);

	}

	async getSelectedIds() {

		return new KarmaFieldsAlpha.Content();

	}

	async insert(ids) {

		if (ids.length) {

			// await this.setValue(ids);

			await this.attachImages(ids);

		}

	}

	// build() {
	// 	return {
	// 		...super.build(),
	// 		complete: node => {
	// 			const attachments = this.getData().attachments;
	//
	// 			if (attachments && attachments.length) {
	// 				this.attachImages(attachments);
	// 			}
	// 		}
	// 	};
	// }

	async attachImages(ids) {

		const manager = this.parent.getEditor();

		if (manager.loading) {

			return;

		}

		const driver = "medias";

		const server = new KarmaFieldsAlpha.Server("medias");

		let grid = [];

		for (let id of ids) {

			for (let key of ["filename", "mimetype", "dir", "width", "height", "sizes", "alt", "caption"]) {

				const value = await server.getValue(id, key);
				grid.push(value);

			}

		}

		while (grid.some(item => item.loading)) {

			await this.render();

			grid = [];

			for (let id of ids) {

				for (let key of ["filename", "mimetype", "dir", "width", "height", "sizes", "alt", "caption"]) {

					const value = await server.getValue(id, key);
					grid.push(value);

				}

			}

		}


		for (let id of ids) {

			let html = "";

			let filename = await server.getValue(id, "filename");
			let mimetype = await server.getValue(id, "mimetype");
			let dir = await server.getValue(id, "dir");
			let width = await server.getValue(id, "width");
			let height = await server.getValue(id, "height");
			let alt = await server.getValue(id, "alt");
			let caption = await server.getValue(id, "caption");
			let sizes = await server.getValue(id, "sizes");

			if (mimetype.toString() === "image/jpeg" || mimetype.toString() === "image/png") {

				html = `<figure><img
					src="${KarmaFieldsAlpha.uploadURL+dir.toString()+"/"+filename.toString()}"
					width="${width.toString()}"
					height="${height.toString()}"
					data-id="${id}"
					srcset="${sizes.toArray().map(source => `${KarmaFieldsAlpha.uploadURL}${dir}/${source.filename} ${source.width}w`).join(", ")}"
					sizes="(min-width: ${width.toString()}px) ${width.toString()}px, 100vw"
					alt="${alt.toString()}"
				><figcaption>${caption.toString()}</figcaption></figure>`;

			} else if (mimetype.toString().startsWith("image")) {

				html = `<figure><img
					src="${KarmaFieldsAlpha.uploadURL+dir.toString()+"/"+filename.toString()}"
					width="${width.toString()}"
					height="${height.toString()}"
					data-id="${id}"
					alt="${alt.toString()}"
				><figcaption>${caption.toString()}</figcaption></figure>`;

			} else if (mimetype.toString().startsWith("video")) {

				html = `<figure><video data-id="${id}" width="${width.toString()}" height="${height.toString()}" controls>
					<source src="${KarmaFieldsAlpha.uploadURL+dir.toString()+"/"+filename.toString()}" type="${mimetype.toString()}"></source>
				</video><figcaption>${caption.toString()}</figcaption></figure>`;

			}

			manager.editor.insertContent(html);

		}



	}



	// getFile(id) {
	//
	// 	if (id) {
	//
	// 		const driver = "files";
	// 		let [filename] = KarmaFieldsAlpha.Query.getValue(driver, id, "filename") || [];
	// 		let [dir] = KarmaFieldsAlpha.Query.getValue(driver, id, "dir") || [];
	//
	// 		if (filename !== undefined && dir !== undefined) {
	//
	// 			return KarmaFieldsAlpha.uploadURL+dir+"/"+filename;
	//
	// 		}
	//
	// 	}
	//
	// }



}


// KarmaFieldsAlpha.tinymce = class extends KarmaFieldsAlpha.Content {
KarmaFieldsAlpha.tinymce = class {

	constructor() {

		this.loading = true;

	}

	onUpdate() {}
	onFocus() {}
	onRender() {}
	onClick() {}
	onDblClick() {}

	async register(element, id, params) {

		if (element.id) {

			this.editor = tinyMCE.get(element.id);

		}

		// if (this.editor && this.editor.getElement() !== element) {
		//
		// 	this.editor.destroy();
		// 	this.editor = null;
		// 	this.loading = true;
		//
		// }

		if (!this.editor) {

			this.editor = await this.create(element, params);

			this.loading = false;

		}

	}

	async create(element, params = {}) {

		// if (element.id) {
		//
		// 	const editor = tinyMCE.get(element.id);
		//
		// 	if (editor) {
		//
		// 		editor.destroy();
		//
		// 		this.loading = true;
		//
		// 	}
		// }

		const [editor] = await tinyMCE.init({
			target: element,
			hidden_input: false,
			inline: true,
			menubar: false,
			contextmenu: false,
			toolbar: false,
			skin: false,
			// theme_url: "tinymce/themes/modern/theme.js",
	    // paste_as_text: true,
			paste_word_valid_elements: 'b,strong,i,em,ul,ol,li,a,img',

			// valid_elements : 'a[href|target=_blank],strong,em,p,br,img[src|sizes|width|height|srcset|alt|data-id],ul,ol,li,blockquote',

			// plugins: "link lists table paste",
			// image_caption: true,
			plugins: "link lists paste image",
			convert_urls: false,
      entity_encoding : "raw", // -> don't encode diacritics
      // placeholder: "hjhlo",
			// entity_encoding: "named",
			// image_caption: true,
			// paste_preprocess: (plugin, args) => {
		  //   console.log(args.content);
		  // }


			// external_plugins: {
		  //   "placeholder": KarmaFieldsAlpha.pluginURL+"/js/vendor/mce.placeholder.js"
		  // },

			// placeholder: "sdfasdf",


			// placeholder: "JKHglgh",

      ...params
		});

		if (!editor) {
			return;
		}

		// unactivate history
		editor.on("BeforeAddUndo", event => {
			event.preventDefault();
		});

		editor.on("input", event => {
			this.onUpdate();
		});
		editor.on("paste", event => {
			this.onUpdate();
		});
		editor.on("cut", event => {
			this.onUpdate();
		});

		// -> input event does not seem to capture line break (single or double) or delete line break !
		editor.on("keyup", event => {
			if (event.key === "Backspace" || event.key === "Enter" || event.key === "Meta") {
				this.onUpdate();
			} else if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowRight") { // event.key = " " do weird things
				this.onRender();
			}
		});

		editor.on("focus", event => {
			this.onFocus();

			// this.setFocus(content.mixed);
			// this.onFocus();

			// this.render();
		});

		editor.on("click", async event => {
			await this.onClick();
			await this.onRender();
		});

		editor.on("dblclick", async event => {
			await this.onDblClick();
			await this.onRender();
		});

		editor.on("ObjectResized", event => {
			// if (this.onUpdateContent) {
			// 	const content = editor.getContent();
			// 	this.onUpdateContent(content, "paste");
			// }
		});

		// editor.on("TypingUndo", event => {
		// 	console.log("TypingUndo");
		// });

		return editor;

	}



}
