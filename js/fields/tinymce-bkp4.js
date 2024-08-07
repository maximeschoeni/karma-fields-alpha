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

	async abduct() {

		if (this.container) {

			// await abduct(this.element, this.buildEditor());

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

    while (KarmaFieldsAlpha.task) {

      await KarmaFieldsAlpha.task;

      KarmaFieldsAlpha.task = null;

      await this.abduct();

    }

  }

	render() {

		this.renderPromise = this.loop();

    return this.renderPromise;

	}


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

			if (this.body) {

				this.editorManager.register(this.body);

			}

		}

		return this.editorManager;

  }

	async updateContent(noRendering) {

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
					console.log("text modified !!!!");
					await this.setValue(textModified);
				}

				await this.parent.render();
				// this.render();
			}, 400);



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
			// await this.parent.render();

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
			// await this.parent.render();

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
			// await this.parent.render();

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
			// await this.parent.render();

    }

	}

	async insertLink() {

    let manager = this.getEditor();

		if (!manager.loading) {

			manager.editor.execCommand("mceInsertLink", false, {
				"href": "nolink"
			});

			manager.editor.selection.collapse(true);

			const node = manager.editor.selection.getNode();

			manager.editor.selection.select(node);

			const text = manager.editor.getContent();

			await this.setValue(text);

		}

  }





  queryMode() {

	  return this.getState("mode") || "edit";

  }

  execMode(value) {

    return this.setState(value, "mode");

  }

	async getContent(key) {

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

			// deprec
      case "linkform":
        // return this.getLinkForm();
				const linkForm = this.getLinkForm();
				return new KarmaFieldsAlpha.Content(linkForm);

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


	async attachMedias(ids) {

		const filesField = new KarmaFieldsAlpha.field.files({
			uploader: "wp",
			key: "file",
			mimetype: ["image"]
		}, "attachFile", this);

		await filesField.edit();

	}

	newChild(type) {

		if (type === "linkForm") {

			return new KarmaFieldsAlpha.field.tinymce.linkForm(this.resource.linkForm, "linkForm", this);

		} else if (type === "imageForm") {

			return new KarmaFieldsAlpha.field.tinymce.imageForm(this.resource.imageForm, "imageForm", this);

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

		}

	}


	*buildMixed() {

		if (this.content && this.content.mixed) {

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
						class: "toolbar simple-buttons",
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
					init: node => {
						node.element.editable = true;
					}
				};

			} else {

				yield {
					class: "tinymce editor-body",
					init: node => {
						node.element.editable = true;
					},
					update: async node => {
						const manager = this.getEditor();
						await manager.register(node.element, this.uid, this.resource.params);
						const diff = manager.editor.getContent() !== this.content.toString();
						if (diff) {
							console.log("setContent", this.content.toString());
							manager.editor.setContent(this.content.toString());
						}
					}
				};

			}

			// yield {
			// 	class: "karma-popover-container imageform-container",
			// 	children: [...this.getChild("imageForm").build()]
			// };

			yield {
				class: "karma-popover-container linkform-container",
				children: [...this.getChild("linkForm").build()]
			};

		}

	}

	build() {
		return {
			class: "editor karma-tinymce",
      update: async container => {

				this.container = container.element;

				this.selection = await this.getSelection() || {};
				this.content = await this.getContent();
				this.mode = await this.getState("mode") || "edit";
				this.focusInside = await this.hasFocusInside();

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
						node.element.classList.toggle("hidden", this.mode !== "mixed");
						node.children = [...this.buildMixed()];
					}
					// children: [...this.buildMixed()]
				},
				{
					class: "mode mode-code",
					// children: [...this.buildCode()],
					update: node => {
						node.element.classList.toggle("hidden", this.mode !== "code");
						node.children = [...this.buildCode()];
					}
				},
				{
					class: "mode-edit-container",
					update: node => {
						this.editorcontainer = node.element;
					},
					child: {
						class: "mode mode-edit",
						// children: [...this.buildEditor()],
						update: node => {
							this.element = node.element;
							node.element.classList.toggle("active", Boolean(this.focusInside));
							node.element.classList.toggle("hidden", this.mode !== "edit");
							node.children = [...this.buildEditor()];
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
			// action: "openLink",
			request: ["insertLink"],
			active: ["request", "queryLink"],
			enabled: ["||", ["request", "hasContentSelected"], ["request", "queryLink"]],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.tinymce.buttons.image = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "format-image",
			title: "Image",
			request: ["attachMedias"],
			// active: ["request", "queryImage"],
			// disabled: ["!", ["request", "hasContentSelected"]],
			...resource
		}, id, parent);
	}
}

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

	isActive() {

		const manager = this.parent.getEditor();

		if (!manager.loading) {

			let node = manager.editor.selection.getNode();

			if (node && manager.editor.getBody().contains(node)) { // target node may be outside editor !!

				return node.matches(this.resource.selector);

			}

		}

		return false;

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
				update: async popover => {

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

	async getContent(subkey) {

		const response = new KarmaFieldsAlpha.Content();

		const value = await this.getState(subkey);

		if (value === undefined) {

			const request = this.parent.getEditor();

	    if (request.loading) {

				response.loading = true;

			} else {

	      const node = request.editor.selection.getNode();
				const a = node && node.closest("a");

	      if (a) {

					if (subkey === "href") {

						let href = node.getAttribute("href");

						if (href === "nolink") {

							response.value = "";

						} else {

							response.value = href || "";

						}

					} else if (subkey === "target") {

						response.value = node.getAttribute("target") === "_blank" ? "1" : "";

					}

	      }

	    }

		} else {

			response.value = value;
			response.modified = true;

		}

		return response;
	}

	async setValue(value, subkey) {

		return this.setState(value, subkey);

	}

	async submit() {

		let href = await this.getContent("href");
		let targetBlank = await this.getContent("target");
		let request = this.parent.getEditor();

		if (!href.loading && !targetBlank.loading && !request.loading) {

			if (href.toString() === "") {

				request.editor.execCommand("Unlink");

			} else {

				request.editor.execCommand("mceInsertLink", false, {
					"href": href.toString(),
					"target": targetBlank.toBoolean() ? "_blank" : null
				});

			}

			const text = request.editor.getContent();

			await this.save("link", "link");
			await this.parent.setValue(text);

		}

		await this.close();

	}

	async close() {

		await this.removeState();

		const request = this.parent.getEditor();

		// const noLinks = request.editor.getBody().querySelectorAll("a[href='nolink']");
		//
		// if (noLinks) {
		//
		//
		// }

		const node = request.editor.selection.getNode();
		const a = node && node.closest("a");

		if (a) {

			if (a.getAttribute("href") === "nolink") {

				request.editor.execCommand("Unlink");

				const text = request.editor.getContent();

				await this.parent.setValue(text);

				request.editor.selection.collapse();

			} else {

				// -> set caret after node (https://stackoverflow.com/a/9829634/2086505)
				const range = request.editor.selection.getRng();
				range.setStartAfter(a);
				range.setEndAfter(a);

				request.editor.selection.setRng(range);

			}

		}

		await this.parent.setFocus();

  }

	async hasChange() {

		const response = new KarmaFieldsAlpha.Content();

		const data = await this.getState();

		response.value = Boolean(data && Object.values(data).length);

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
			request: ["unlink"],
			// disabled: ["!", ["getValue", "href"]],
			...resource
		}, id, parent);

	}

}
KarmaFieldsAlpha.field.tinymce.linkForm.applyButton = class extends KarmaFieldsAlpha.field.button {

	constructor(resource, id, parent) {

		super({
				text: "Apply",
				request: ["submit"],
				primary: true,
			...resource
		}, id, parent);

	}

}




KarmaFieldsAlpha.field.tinymce.linkForm.attachFile = class extends KarmaFieldsAlpha.field.button {

	constructor(resource, id, parent) {

		super({
			dashicon: "paperclip",
			request: ["attachfile"],
			...resource
		}, id, parent);

	}

	getDriver() {

    return this.resource.driver || "medias";

  }

	async insert(id) {

		const mediaField = new KarmaFieldsAlpha.field.media({
			id: id,
			driver: this.getDriver()
		}, "media", this);

		let media = await mediaField.getMedia();

		// while (item.loading) {
		while (media.icon === "loading") {

			await this.render();
			media = await mediaField.getMedia();

		}

		await this.parent.setValue(media.src, "href");

	}

	getContent(key) {

		if (key === "file") {

			return new KarmaFieldsAlpha.Content();

		}

		return super.getContent(key);
	}


	async setValue(value, key) {

		if (key === "file" && value && value[0]) {

			const id = value[0];
			await this.insert(id);
      await this.setFocus(true);
      await this.request("render");

		}

	}

	async attachfile() {

		const filesField = new KarmaFieldsAlpha.field.files({
			uploader: "wp",
			key: "file",
			mimetype: []
		}, "attachFile", this);

		await filesField.edit();

	}

}


KarmaFieldsAlpha.field.tinymce.imageForm = class extends KarmaFieldsAlpha.field.tinymce.form {
	constructor(resource) {
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
									active: "alignnone"
								},
								{
									type: "button",
									dashicon: "align-left",
									action: "alignleft",
									active: "alignleft"
								},
								{
									type: "button",
									dashicon: "align-center",
									action: "aligncenter",
									active: "aligncenter"
								},
								{
									type: "button",
									dashicon: "align-right",
									action: "alignright",
									active: "alignright"
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
		});
	}

	// getBuffer() {
	// 	return this.getData();
	// }

	attachfile() {

		const table = KarmaFieldsAlpha.mediasTable || "medias";

		// const selection = this.getSelection() || {};
		// selection.final = true;

		this.parent.request("fetch", table);

	}

	insert(ids) {
		console.error("deprecated"); // -> to be reworked

		if (ids.length) {

			this.getData().attachments = ids;

			// this.setValue(ids, "attachments");

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

	// attachImages(attachmentIds) {
	//
	// 	const editor = this.getEditor();
	//
	// 	if (!editor || editor === KarmaFieldsAlpha.loading) {
	//
	// 		return;
	//
	// 	}
	//
	// 	const driver = "files";
	//
	// 	const images = attachmentIds.map(id => {
	//
	// 		let [filename] = KarmaFieldsAlpha.Query.getValue(driver, id, "filename") || [KarmaFieldsAlpha.loading];
	// 		let [mimetype] = KarmaFieldsAlpha.Query.getValue(driver, id, "mimetype") || [KarmaFieldsAlpha.loading];
	// 		let [dir] = KarmaFieldsAlpha.Query.getValue(driver, id, "dir") || [KarmaFieldsAlpha.loading];
	// 		let [width] = KarmaFieldsAlpha.Query.getValue(driver, id, "width") || [KarmaFieldsAlpha.loading];
	// 		let [height] = KarmaFieldsAlpha.Query.getValue(driver, id, "height") || [KarmaFieldsAlpha.loading];
	// 		let [alt] = KarmaFieldsAlpha.Query.getValue(driver, id, "alt") || [KarmaFieldsAlpha.loading];
	// 		let [caption] = KarmaFieldsAlpha.Query.getValue(driver, id, "caption") || [KarmaFieldsAlpha.loading];
	//
	// 		if ([filename, mimetype, dir, width, height, alt, caption].every(value => value !== KarmaFieldsAlpha.loading)) {
	//
	// 			if (mimetype === "image/jpeg" || mimetype === "image/png") {
	//
	// 				let sizes = KarmaFieldsAlpha.Query.getValue(driver, id, "sizes") || KarmaFieldsAlpha.loading;
	//
	// 				if (sizes !== KarmaFieldsAlpha.loading) {
	//
	// 					return `<figure><img
	// 						src="${KarmaFieldsAlpha.uploadURL+dir+"/"+filename}"
	// 						width="${width}"
	// 						height="${height}"
	// 						data-id="${id}"
	// 						srcset="${sizes.map(source => `${KarmaFieldsAlpha.uploadURL}${dir}/${source.filename} ${source.width}w`).join(", ")}"
	// 						sizes="(min-width: ${width}px) ${width}px, 100vw"
	// 						alt="${alt}"
	// 					><figcaption>${caption}</figcaption></figure>`;
	//
	// 				}
	//
	// 			} else if (mimetype.startsWith("image")) {
	//
	// 				return `<figure><img
	// 					src="${KarmaFieldsAlpha.uploadURL+dir+"/"+filename}"
	// 					width="${width}"
	// 					height="${height}"
	// 					data-id="${id}"
	// 					alt="${alt}"
	// 				><figcaption>${caption}</figcaption></figure>`;
	//
	// 			} else if (mimetype.startsWith("video")) {
	//
	// 				return `<figure><video data-id="${id}" width="${width}" height="${height}" controls>
	// 					<source src="${KarmaFieldsAlpha.uploadURL+dir+"/"+filename}" type="${mimetype}"></source>
	// 				</video><figcaption>${caption}</figcaption></figure>`;
	//
	// 			}
	//
	// 		}
	//
	// 	});
	//
	// 	if (images.length === attachmentIds.length) {
	//
	// 		delete this.getData().attachments;
	//
	// 		this.request("insertContent", images.join(""));
	//
	// 	}
	//
	// }



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

	async register(element, id, params) {

		if (this.editor && this.editor.getElement() !== element) {

			this.editor.destroy();
			this.editor = null;
			this.loading = true;

		}

		if (!this.editor) {

			this.editor = await this.create(element, params);

			this.loading = false;

		}

	}

	async create(element, params = {}) {

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
			paste_word_valid_elements: 'b,strong,i,em,ul,ol',



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

			// this.setFocus(content.mixed);
			// this.onFocus();

			// this.render();
		});

		editor.on("click", event => {
			// this.render();
			this.onRender();
		});

		// editor.on("dblclick", event => {
		// 	const node = editor.selection.getNode();
		// 	if (node.matches("img") || node.matches("figure")) {
		// 		if (this.onFetchImage) {
		// 			this.onFetchImage()
		// 		}
		// 	}
		// });

		editor.on("ObjectResized", event => {
			// if (this.onUpdateContent) {
			// 	const content = editor.getContent();
			// 	this.onUpdateContent(content, "paste");
			// }
		});

		return editor;

	}



}
