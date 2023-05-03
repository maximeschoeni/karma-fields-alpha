// https://github.com/tinymce/tinymce-dist/blob/master/tinymce.js

// /Applications/MAMP/htdocs/wordpress/wp-includes/js/tinymce/plugins/link/plugin.min.js

KarmaFieldsAlpha.field.tinymce = class extends KarmaFieldsAlpha.field.input {

	constructor(resource) {
		super(resource);

		// this.image = this.createChild({
		// 	id: "image",
		// 	key: "image",
		// 	type: "file",
		// 	mimetypes: ["image"]
		// });
		//
		// this.file = this.createChild({
		// 	id: "file",
		// 	key: "file",
		// 	type: "file",
		// 	mimetypes: [],
		// 	multiple: false
		// });


		// this.buffer = new KarmaFieldsAlpha.Buffer("tinymce");

	}

  getEditor() {

    // const key = this.getKey();

    // return this.parent.request("get-option", {}, key, "editor");

    const data = this.getData();

    return data.editor;
  }

  setEditor(editor) {

    // const key = this.getKey();

    // this.parent.request("set-option", editor, key, "editor");

    const data = this.getData();

    data.editor = editor;

    // this.setData(data);
  }

	async createEditor(element) {
		// if (this.editor) {
		// 	this.editor.destroy();
		// 	this.editor = null;
		// }

		// -> check if editor.element match

		// let editor = this.buffer.get(...path);
    let editor = this.getEditor();



		if (editor && editor.bodyElement !== element) {
			editor.destroy();
			editor = null;
		}

		if (!editor) {
			const editors = await tinyMCE.init({
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
				plugins: "link lists paste",
				convert_urls: false,
        entity_encoding : "raw", // -> don't encode diacritics
        // placeholder: "hjhlo",
				// entity_encoding: "named",
				// image_caption: true,
				// paste_preprocess: (plugin, args) => {
			  //   console.log(args.content);
			  // }
        ...this.resource.mceinit
			});

			if (!editors.length) {
				console.warn("editor not created", editors, editor, element);
			}

			editor = editors.pop();

			if (!editor) {
				editor = tinymce.get(element.id);
				console.log("!!", editor);
			}

			// unactivate history
			editor.on("BeforeAddUndo", event => {
				event.preventDefault();
			});

			editor.on("input", event => {
				this.saveContent();
			});
			editor.on("paste", event => {
				this.saveContent();
			});
			editor.on("cut", event => {
				this.saveContent();
			});

			// -> input event does not seem to capture line break (single or double) or delete line break !
			editor.on("keyup", event => {
				if (event.key === "Backspace" || event.key === "Enter" || event.key === "Meta") {
          const [current] = this.getValue() || [];
          if (current !== editor.getContent()) {
            this.saveContent();
          }
				}
			});

			editor.on("NodeChange", event => {
				if (event.selectionChange) {
          const data = this.getData();
					if (data.activeModal && event.element !== data.activeNode) {
            data.activeNode = null;
            data.activeModal = null;
            // this.setData(data);
						this.renderPopover();
					}
				}
				if (this.renderToolbar) {
          this.renderToolbar();
        }
			});

			editor.on("focusout", event => {
        const data = this.getData();
				if (data.activeModal && (!event.relatedTarget || !this.popoverContainer.contains(event.relatedTarget))) {
					data.activeNode = null;
					data.activeModal = null;
          // this.setData(data);
					this.renderPopover();
				}
        if (this.renderToolbar) {
          this.renderToolbar();
        }
			});

			editor.on("click", event => {

				const node = editor.selection.getNode();
        const data = this.getData();

				if (node.matches("a")) {
					data.activeNode = node;
					data.activeModal = "linkForm";
          // this.setData(data);
					this.renderPopover();
				}

				if (node.matches("img")) {
					data.activeNode = node;
          // this.setData(data);
					this.request("editmedia");
				}

			});

			editor.on("dblclick", event => {
				const node = editor.selection.getNode();
				if (node.matches("img")) {
					this.request("addmedia");
				}
			});

			editor.on("ObjectResized", async event => {
				this.request("resizemedia");
				this.renderPopover();
			});

      this.setEditor(editor);

		}

		return editor;
	}

  queryCommand(key) {

    const editor = this.getEditor();

    if (editor) {

      return editor.queryCommandState(key);

    }

  }

  execCommand(key) {

    const editor = this.getEditor();

    if (editor) {

      editor.execCommand(key);
      this.saveContent();

    }

  }

  queryUL() {

    const editor = this.getEditor();

    if (editor) {

      return editor.queryCommandValue("InsertUnorderedList") === "true";

    }

    return false;
  }

  queryOL() {

    const editor = this.getEditor();

    if (editor) {

      return editor.queryCommandValue("InsertOrderedList") === "true";

    }

    return false;
  }


  execUL() {

    const editor = this.getEditor();

    if (editor) {

      if (editor.queryCommandValue("InsertUnorderedList") !== "true") {

        editor.execCommand('InsertUnorderedList', false, {
          'list-style-type': 'disc'
        });

      } else {

        editor.execCommand("RemoveList");

      }

      this.saveContent();

    }

  }

  execOL() {

    const editor = this.getEditor();

    if (editor) {

      if (editor.queryCommandValue("InsertOrderedList") !== "true") {

        editor.execCommand('InsertOrderedList', false, {
          'list-style-type': 'decimal'
        });

      } else {

        editor.execCommand("RemoveList");

      }

      this.saveContent();

    }

  }

  getFormat() {
    const editor = this.getEditor();

    if (editor) {

      const matches = editor.queryCommandValue("FormatBlock").match(/h[1-6]/);

      if (matches && matches[0]) {

        return [matches[0]];

      }

    }

    return [""];
  }

  setFormat(value) {

    const editor = this.getEditor();

    if (editor) {

      editor.execCommand("FormatBlock", false, value);

      this.saveContent();

    }

  }

  queryLink() {

    const data = this.getData();

    if (data.activeNode) {

      return data.activeNode.matches("a");

    }

    return false;
  }

	unlink() {

		const editor = this.getEditor();

    if (editor) {

      editor.execCommand("Unlink");

    }

    this.saveContent();
	}

  // queryLinkHref() {

  //   if (editor) {

  //     const node = editor.selection.getNode();

  //     if (node) {

  //       return [node.getAttribute("href") || ""];

  //     }

  //   }

  //   return [""];
  // }

  // queryLinkTarget() {

  //   if (editor) {

  //     const node = editor.selection.getNode();

  //     if (node) {

  //       return [node.getAttribute("target") || ""];

  //     }

  //   }

  //   return [""];
  // }

  // execLinkHref() {

  //   const editor = this.getEditor();

  //   if (editor) {

  //     editor.execCommand("mceInsertLink", false, {
	// 			"href": link.href[0],
	// 			"target": link.target[0] ? "_blank" : null,
	// 			"data-attachment-id": link.attachment_id && link.attachment_id[0] || null
	// 		});

  //   }

  // }


  getLinkForm() {

    const editor = this.getEditor();

    if (editor) {

      const node = editor.selection.getNode();

      if (node) {

        return [
          {
            href: node.getAttribute("href") || "",
            target: node.getAttribute("target") || ""
          }
        ];

      }

    }

    return [];

  }

  setLinkForm(value) {

    const editor = this.getEditor();

    if (editor) {

      if (value.href) {

        editor.execCommand("mceInsertLink", false, {
          "href": value.href,
          "target": value.target ? "_blank" : null
        });

      } else {

        editor.execCommand("Unlink");

      }

    }

    this.saveContent();

  }

  openLink() {
    const data = this.getData();
    data.activeModal = "linkForm";
    // this.setData(data);
    this.renderPopover();
  }


  closelink() {

    const data = this.getData() || {};

    data.activeNode = null;
    data.activeModal = null;

    // this.setData(data);

    this.renderPopover();

  }


  queryMode() {

    const data = this.getData();

    // if (data && data.mode) {
		//
    //   return data.mode;
		//
    // }

    return data.mode || "edit";
  }

  execMode(value) {

    const data = this.getData();

    // if (!data) {
		//
    //   data = {};
		//
    // }

    data.mode = value;

    // this.setData(data);
  }




  getValue(key) {

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
        return this.queryCommand(key);

      // case "linkhref":
      //   return this.queryLinkHref();


      // case "linktarget":
      //   return this.queryLinkTarget();

      case "ul":
        return this.queryUL();

      case "ol":
        return this.queryOL();

      case "linkform":
        return this.getLinkForm();

      default:
        return super.getValue();

    }

  }

  setValue(value, key) {

    switch (key) {

      case "format":
        this.setFormat(value);
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
        this.execCommand(key);
        break;

      case "linkform": {
        this.setLinkForm(value);
        break;
      }

      case "ul":
        // if (this.editor.queryCommandValue("InsertUnorderedList") !== "true") {
        // 	this.editor.execCommand('InsertUnorderedList', false, {
        // 	  'list-style-type': 'disc'
        // 	});
        // } else {
        // 	this.editor.execCommand("RemoveList");
        // }
        // this.saveContent();
        this.execUL();
        break;

      case "ol":
        // if (this.editor.queryCommandValue("InsertOrderedList") !== "true") {
        // 	this.editor.execCommand('InsertOrderedList', false, {
        // 		'list-style-type': 'decimal'
        // 	});
        // } else {
        // 	this.editor.execCommand("RemoveList");
        // }
        // this.saveContent();
        this.execOL();
        break;

      case "mode": {
        this.parent.request("set-option", content.data, "mode");
        if (this.render) {
          this.render();
        }
        break;
      }

      default:
        super.setValue(value);
        break;




    }
  }

  hasSelection() {

    const editor = this.getEditor();

    if (editor) {

      return editor.selection.getContent().length > 0;

    }

    return false;
  }


	// request(subject, content, ...path) {


	// 	switch (subject) {

	// 		case "state": {
	// 			const [key] = path;

	// 			switch (key) {

	// 				case "format": {
	// 					const matches = this.editor && this.editor.queryCommandValue("FormatBlock").match(/h[1-6]/);
	// 					return {value: matches && matches[0] || ""};
	// 				}

	// 				case "bold":
	// 				case "italic":
	// 				case "strikethrough":
	// 				case "superscript":
	// 				case "subscript":
	// 				case "JustifyLeft":
	// 				case "JustifyCenter":
	// 				case "JustifyRight":
	// 				case "JustifyFull":
	// 				case "JustifyNone":
	// 					return {value: this.editor && this.editor.queryCommandState(key)};

	// 				case "link":
	// 					return {value: this.activeNode && this.activeNode.matches("a")};

	// 				case "ul":
	// 					return {value: this.editor && this.editor.queryCommandValue("InsertUnorderedList") === "true"};

	// 				case "ol":
	// 					return {value: this.editor && this.editor.queryCommandValue("InsertOrderedList") === "true"};

	// 			}

	// 			break;
	// 		}

	// 		case "get": {
	// 			const [key, ...subpath] = path;

	// 			switch (key) {

	// 				case "format": {
	// 					const matches = this.editor && this.editor.queryCommandValue("FormatBlock").match(/h[1-6]/);
	// 					return matches && matches[0] || "";
	// 				}

	// 				case "bold":
	// 				case "italic":
	// 				case "strikethrough":
	// 				case "superscript":
	// 				case "subscript":
	// 				case "JustifyLeft":
	// 				case "JustifyCenter":
	// 				case "JustifyRight":
	// 				case "JustifyFull":
	// 				case "JustifyNone":
	// 					return this.editor && this.editor.queryCommandState(key);

	// 				case "link-form": {
	// 					const linkObject = this.getLink() || {};
	// 					return KarmaFieldsAlpha.DeepObject.get(linkObject, ...subpath);
	// 				}

	// 				case "link":
	// 					return this.activeNode && this.activeNode.matches("a");

	// 				case "ul":
	// 					return this.editor && this.editor.queryCommandValue("InsertUnorderedList") === "true";

	// 				case "ol":
	// 					return this.editor && this.editor.queryCommandValue("InsertOrderedList") === "true";

	// 			}

	// 			break;
	// 		}

	// 		case "set": {

	// 			const [key] = path;

	// 			switch (key) {

	// 				case "format":
	// 					this.editor && this.editor.execCommand("FormatBlock", false, content.data);
  //           this.saveContent();
	// 					break;

	// 				case "unlink":
	// 				case "bold":
	// 				case "italic":
	// 				case "strikethrough":
	// 				case "superscript":
	// 				case "subscript":
	// 				case "JustifyLeft":
	// 				case "JustifyCenter":
	// 				case "JustifyRight":
	// 				case "JustifyFull":
	// 				case "JustifyNone":
	// 					this.editor && this.editor.execCommand(key);
  //           this.saveContent();
	// 					break;

	// 				case "link-form": {
	// 					this.setLink(content);
	// 					this.saveContent();
	// 					this.activeNode = null;
	// 					this.activeModal = null;
	// 					this.renderPopover();
  //           break;
	// 				}

	// 				case "ul":
	// 					if (this.editor.queryCommandValue("InsertUnorderedList") !== "true") {
	// 						this.editor.execCommand('InsertUnorderedList', false, {
	// 						  'list-style-type': 'disc'
	// 						});
	// 					} else {
	// 						this.editor.execCommand("RemoveList");
	// 					}
	// 					this.saveContent();
	// 					break;

	// 				case "ol":
	// 					if (this.editor.queryCommandValue("InsertOrderedList") !== "true") {
	// 						this.editor.execCommand('InsertOrderedList', false, {
	// 							'list-style-type': 'decimal'
	// 						});
	// 					} else {
	// 						this.editor.execCommand("RemoveList");
	// 					}
	// 					this.saveContent();
	// 					break;

  //         case "mode": {
  //           this.parent.request("set-option", content.data, "mode");
  //           if (this.render) {
  //             this.render();
  //           }
  //           break;
  //         }


	// 			}
	// 			break;
	// 		}



	// 		case "edit": {
	// 			this.saveContent();
	// 			break;
	// 		}


	// 		// case "command": {



	// 		// 	switch (content.command) {

	// 		// 		// case "unlink":
	// 		// 		// case "bold":
	// 		// 		// case "italic":
	// 		// 		// case "strikethrough":
	// 		// 		// case "superscript":
	// 		// 		// case "subscript":
	// 		// 		// case "JustifyLeft":
	// 		// 		// case "JustifyCenter":
	// 		// 		// case "JustifyRight":
	// 		// 		// case "JustifyFull":
	// 		// 		// case "JustifyNone":
	// 		// 		// 	this.editor.execCommand(content.command);
	// 		// 		// 	await this.saveContent();
	// 		// 		// 	break;

	// 		// 		// case "ul":
	// 		// 		// 	if (this.editor.queryCommandValue("InsertUnorderedList") !== "true") {
	// 		// 		// 		this.editor.execCommand('InsertUnorderedList', false, {
	// 		// 		// 		  'list-style-type': 'disc'
	// 		// 		// 		});
	// 		// 		// 	} else {
	// 		// 		// 		this.editor.execCommand("RemoveList");
	// 		// 		// 	}
	// 		// 		// 	await this.saveContent();
	// 		// 		// 	break;
	// 		// 		//
	// 		// 		// case "ol":
	// 		// 		// 	if (this.editor.queryCommandValue("InsertOrderedList") !== "true") {
	// 		// 		// 		this.editor.execCommand('InsertOrderedList', false, {
	// 		// 		// 			'list-style-type': 'decimal'
	// 		// 		// 		});
	// 		// 		// 	} else {
	// 		// 		// 		this.editor.execCommand("RemoveList");
	// 		// 		// 	}
	// 		// 		// 	await this.saveContent();
	// 		// 		// 	break;

	// 		// 		case "table":
	// 		// 			this.editor.execCommand('mceInsertTable', false, { rows: 2, columns: 2 });
	// 		// 			// this.editor.execCommand('mceTableInsertColAfter', false);
	// 		// 			await this.saveContent();
	// 		// 			break;



	// 		// 		case "attachfile":
	// 		// 			// -> open media
	// 		// 			// this.file.uploader.open(this.activeNode && this.activeNode.getAttribute("data-attachment-id"));
	// 		// 			break;

	// 		// 		case "addmedia":
	// 		// 			// -> open media
	// 		// 			// this.image.uploader.open(this.activeNode && this.activeNode.getAttribute("data-id"));
	// 		// 			break;

	// 		// 		case "editmedia":
	// 		// 			// this.activeModal = this.createChild(this.parseResource("media")).getModal();
	// 		// 			this.activeModal = "media";
	// 		// 			await this.renderPopover();
	// 		// 			break;

	// 		// 		case "resizemedia": {
	// 		// 			var node = this.editor.selection.getNode();
	// 		// 			var width = this.editor.selection.getNode().getAttribute("width");
	// 		// 			node.sizes = `(min-width: ${width}px) ${width}px, 100vw`;
	// 		// 			await this.saveContent();
	// 		// 			break;
	// 		// 		}

	// 		// 		case "alignnone":
	// 		// 		case "alignleft":
	// 		// 		case "alignright":
	// 		// 		case "aligncenter": {
	// 		// 			if (this.activeNode && this.editor) {
	// 		// 				this.activeNode.classList.remove("alignright");
	// 		// 				this.activeNode.classList.remove("alignleft");
	// 		// 				this.activeNode.classList.remove("aligncenter");
	// 		// 				if (content.command !== "alignnone") {
	// 		// 					this.activeNode.classList.add(content.command);
	// 		// 				}
	// 		// 				this.editor.nodeChanged();
	// 		// 				await this.renderPopover();
	// 		// 				await this.saveContent();
	// 		// 			}

	// 		// 			break;
	// 		// 		}


	// 		// 	}

	// 		// }

	// 		case "link":
	// 			// -> open popup
	// 			// this.activeModal = this.createChild(this.parseResource("link")).getModal();
	// 			this.activeModal = "linkForm";
	// 			this.renderPopover();
	// 			break;




	// 		// case "format":
	// 		// 	return this.getFormat();

	// 		// case "link":
	// 		// 	return KarmaFieldsAlpha.DeepObject.get(this.getLink(), ...path);

	// 		case "align": {
	// 			if (this.activeNode) {
	// 				if (this.activeNode.classList.contains("alignleft")) {
	// 					return "left";
	// 				} else if (this.activeNode.classList.contains("aligncenter")) {
	// 					return "center";
	// 				} else if (this.activeNode.classList.contains("alignright")) {
	// 					return "right";
	// 				}
	// 			}
	// 			return "none";
	// 		}

	// 		case "alignleft":
	// 		case "aligncenter":
	// 		case "alignright":
	// 			return this.activeNode && this.activeNode.classList.contains(subject);

	// 		case "alignnone":
	// 			return this.activeNode
	// 				&& !this.activeNode.classList.contains("alignleft")
	// 				&& !this.activeNode.classList.contains("aligncenter")
	// 				&& !this.activeNode.classList.contains("alignright");



	// 		// case "ul":
	// 		// 	return this.editor && this.editor.queryCommandValue("InsertUnorderedList") === "true";
	// 		//
	// 		// case "ol":
	// 		// 	return this.editor && this.editor.queryCommandValue("InsertOrderedList") === "true";

	// 		// case "bold":
	// 		// case "italic":
	// 		// case "strikethrough":
	// 		// case "superscript":
	// 		// case "subscript":
	// 		// case "JustifyLeft":
	// 		// case "JustifyCenter":
	// 		// case "JustifyRight":
	// 		// case "JustifyFull":
	// 		// case "JustifyNone":
	// 		// 	return this.editor && this.editor.queryCommandState(subject);

	// 		case "selected":
	// 			return this.editor && this.editor.selection.getContent().length > 0;

	// 		case "close":
	// 			this.activeNode = null;
	// 			this.activeModal = null;
	// 			this.renderPopover();
	// 			break;


	// 		// set

	// 		case "setFormat": {
	// 			this.setFormat(content);
	// 			this.saveContent();
	// 			break;
	// 		}

	// 		case "setImage": {
	// 			// const images = await this.image.fetchIds(value, {sources: 1});
	// 			// this.setImages(images);
	// 			this.saveContent();
	// 			// this.activeModal = this.createChild(this.parseResource("media")).getModal();
	// 			this.activeModal = "media";
	// 			this.renderPopover();
	// 			break;
	// 		}

	// 		case "setFile": {
	// 			// this.activeModal = this.createChild(this.parseResource("link")).getModal();
	// 			this.activeModal = "link";
	// 			this.renderPopover();
	// 			// const files = await this.file.fetchIds(value);
	// 			// for (let file of files) {
	// 			// 	await this.activeModal.buffer.set([file.original_src], "href");
	// 			// 	await this.activeModal.buffer.set(value, "attachment_id");
	// 			// 	break;
	// 			// }
	// 			this.activeModal.render();
	// 			break;
	// 		}

	// 		case "setLink": {
	// 			this.setLink(content);
	// 			this.saveContent();
	// 			this.activeNode = null;
	// 			this.activeModal = null;
	// 			this.renderPopover();
	// 			break;
	// 		}

	// 		default:
	// 			return this.parent.request(subject, content, ...path);

	// 	}

	// }

  setImage() {
    // this.saveContent();
    // // this.activeModal = this.createChild(this.parseResource("media")).getModal();
    // this.activeModal = "media";
    // this.renderPopover();

    const data = this.getData() || {};
    data.activeModal = "media";
    this.setData(data);
    this.render();

  }



	// async trigger(action) {
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
	// 			await this.saveContent();
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
	// 			await this.saveContent();
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
	// 			await this.saveContent();
	// 			break;
	//
	// 		case "table":
	// 			this.editor.execCommand('mceInsertTable', false, { rows: 2, columns: 2 });
	// 			// this.editor.execCommand('mceTableInsertColAfter', false);
	// 			await this.saveContent();
	// 			break;
	//
	// 		case "close":
	// 			this.activeNode = null;
	// 			this.activeModal = null;
	// 			await this.renderPopover();
	// 			break;
	//
	// 		case "addmedia":
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
	// 			await this.saveContent();
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
	// 			await this.saveContent();
	// 			break;
	//
	// 	}
	//
	// }


	// setImages(images) {



	// 	for (let image of images) {

	// 		const node = this.editor.selection.getNode();

	// 		let width = image.sources[0].width;
	// 		let height = image.sources[0].height;

	// 		if (node && node.matches("img")) {
	// 			width = node.getAttribute("width") || width;
	// 			height = node.getAttribute("height") || height;
	// 		}

	// 		this.editor.execCommand(
	// 			'mceInsertContent',
	// 			false,
	// 			`<img
	// 				src="${image.sources[0].src}"
	// 				width="${width}"
	// 				height="${height}"
	// 				data-id="${image.id}"
	// 				srcset="${image.sources.map(source => source.src+" "+source.width+"w").join(", ")}"
	// 				sizes="(min-width: ${width}px) ${width}px, 100vw"
	// 			>`
	// 		);

	// 	}
	// }

  setImages(images) {

    const editor = this.getEditor();

		for (let image of images) {

			const node = editor.selection.getNode();

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
	}

	// getLink() {
	// 	const node = this.editor && this.editor.selection.getNode();
	// 	const value = {};

	// 	if (node) {
	// 		value.href = node.getAttribute("href") || "";
	// 		value.target = node.target === "_blank" ? "1" : "";
	// 		if (node.hasAttribute("data-attachment-id")) {
	// 			value.attachment_id = [node.getAttribute("data-attachment-id")];
	// 		}
	// 	}

	// 	return value;
	// }

	// setLink(value) {
	// 	let link = this.getLink();
	// 	KarmaFieldsAlpha.DeepObject.merge(link, value);
	// 	if (link.href) {
	// 		this.editor.execCommand("mceInsertLink", false, {
	// 			"href": link.href[0],
	// 			"target": link.target[0] ? "_blank" : null,
	// 			"data-attachment-id": link.attachment_id && link.attachment_id[0] || null
	// 		});
	// 	} else {
	// 		this.editor.execCommand("Unlink");
	// 	}
	// }


	saveContent() {

		// const key = this.getKey();
		// const value = this.editor.getContent();
		// const current = await this.parent.request("get", {}, key);
		//
		// if (value !== KarmaFieldsAlpha.Type.toString(current)) {
		//
		// 	KarmaFieldsAlpha.History.save();
		// 	await this.parent.request("set", {data: value}, key);
		// 	await this.parent.request("edit");
		//
		// }


		// this.throttle(async () => {

		// 	const key = this.getKey();
		// 	let value = this.editor.getContent();

		// 	value = value.replace("&amp;nbsp;", "&nbsp;"); // -> tinymce convert &nbsp; into &amp;nbsp;

		// 	const current = this.parent.request("get", {}, key);

    //   if (current && value !== KarmaFieldsAlpha.Type.toString(current)) {

    //     KarmaFieldsAlpha.History.save();
    //     this.parent.request("set", value, key);
    //     this.parent.request("edit");

    //   }



		// }, 500);




    // this.debounce("typing", async () => {

      // const editor = this.getEditor();
			//
      // if (editor) {
			//
      //   let value = editor.getContent().normalize();
			//
      //   value = value.replace("&amp;nbsp;", "&nbsp;"); // -> tinymce convert &nbsp; into &amp;nbsp;
			//
      //   const [currentValue] = this.getValue() || [];
			//
      //   if (value !== currentValue) {
			//
      //     this.setValue(value);
			//
      //     this.parent.request("save");
      //     this.parent.request("render");
			//
      //   }
			//
      // }

      // this.unlock();

    // }, 1000);

    // this.lock();

	}

	// async getValue() {
	//
	// 	const key = this.getKey();
	// 	const response = await this.parent.request("get", {}, key);
	//
	// 	return KarmaFieldsAlpha.Type.toString(response);
	//
	// }
	//
	//
	// async setValue(value) {
	//
	// 	await this.parent.request("set", {data: value}, key);
	// 	await this.parent.request("edit");
	//
	// }

	// -> like input
	// getDefault() {
	// 	const defaults = {};

	// 	const key = this.getKey();

	// 	if (key && this.resource.default !== null) {

	// 		defaults[key] = this.parse(this.resource.default || "");

	// 	}

	// 	return defaults;
	// }

	// -> like input
	// throttle(callback, interval = 500, delay = 3000) {
	// 	// if (!this.throttleDelayTimer) {
	// 		if (this.throttleTimer) {
	// 			clearTimeout(this.throttleTimer);
	// 		}
	// 		this.throttleTimer = setTimeout(callback, interval);
	// 		// this.throttleDelayTimer = setTimeout(() => {
	// 		// 	clearTimeout(this.throttleDelayTimer);
	// 		// }, delay);
	// 	// }

	// }

	build() {
		return {
			class: "editor karma-tinymce",
			// init: editor => {
			// 	if (this.resource.theme) {
			// 		editor.element.classList.add("theme-"+this.resource.theme);
			// 	}
			// },
      update: async container => {
        // this.render = container.render;
        // const mode = this.parent.request("get-option", {}, "mode") || this.resource.mode || "edit";
        let action = this.getData() || {};
        const mode = action.mode || this.resource.mode || "edit";

        container.children = [
          {
            class: "mode mode-code",
            update: node => {
              node.element.classList.toggle("hidden", mode !== "code");
              if (mode === "code") {
                node.children = [
                  {
                    class: "editor-header",
                    children: [
                      {
                        class: "toolbar",
                        child: this.createChild({
                          type: "buttons",
                          children: ["separator", "edit"],
                          ...this.resource.textarea_buttons
                        }).build()
                      }
                    ]
                  },
                  {
                    class: "textarea editor-body",
                    update: node => {
                      node.element.classList.toggle("hidden", mode !== "code");
                      if (mode === "code") {
                        node.child = {
                          tag: "textarea",
                          update: async textarea => {
                            const values = this.getValue();

                            if (values) {
                              if (!this.isLocked()) {
                                textarea.element.value = values[0] || "";
                                textarea.element.style.height = 0;
                                textarea.element.style.height = textarea.element.scrollHeight + 3 + "px";
                              }
                              textarea.element.oninput = () => {
                                textarea.element.style.height = 0;
                                textarea.element.style.height = textarea.element.scrollHeight + 3 + "px";
                                // this.throttle(() => this.set(textarea.element.value.normalize()));
                                this.debounce("typing", async () => {
                                  const value = input.element.value.normalize();
                                  const [currentValue] = this.getValue() || [];

                                  if (value !== currentValue) {
                                    this.setValue(value);
                                    // this.parent.request("save");
                                    // await this.parent.render();
                                  }
                                  // this.unlock();
                                }, this.resource.debounce || 1000);
                                // this.lock();

                              }
                            }
                          }
                        }
                      }
                    }
                  }
                ];
              }
            }
          },
          {
            class: "mode mode-edit",
            update: node => {
              node.element.classList.toggle("hidden", mode !== "edit");
              if (mode === "edit") {
                node.children = [
                  {
                    class: "editor-header",
                    children: [
                      {
                        class: "toolbar",
                        update: toolbar => {
                          this.renderToolbar = toolbar.render;
                        },
                        child: this.createChild({
                          type: "buttons",
                          ...this.resource.buttons
                        }).build()
                      }
                    ]
                  },
                  {
                    class: "tinymce editor-body",
                    update: async node => {
                      node.element.classList.toggle("hidden", mode === "code");
                      if (mode !== "code") {
                        node.element.editable = true;
                        const editor = await this.createEditor(node.element);

                        // if (!this.isLocked()) {

                          const values = this.getValue();
                          if (values) {
                            const value = KarmaFieldsAlpha.Type.toString(values);

                            if (value !== editor.getContent()) {
                              editor.setContent(value);
                            }
                          }
                        // }


												this.saveContent = () => {

													this.debounce("typing", () => {

														let value = editor.getContent().normalize();

										        // value = value.replace("&amp;nbsp;", "&nbsp;"); // -> tinymce convert &nbsp; into &amp;nbsp;

										        const [currentValue] = this.getValue() || [];

										        if (value !== currentValue) {

										          this.setValue(value);

										        }

													}, 750);



												}




                      }
                    }
                  },
                  {
                    class: "karma-popover-container",
                    update: container => {
                      this.renderPopover = container.render;
                      this.popoverContainer = container.element;
                    // },
                    // update: container => {
                      container.element.onfocusout = event => {
                        const editor = this.getEditor();
                        const data = this.getData();
                        if (data.activeModal && (!event.relatedTarget || !container.element.contains(event.relatedTarget) && !editor.getBody().contains(event.relatedTarget))) {
                          // this.activeNode = null;
                          // this.activeModal = null;

                          data.activeNode = null;
                          data.activeModal = null;
                          // this.setData(data);

                          container.render();
                        }
                      };

                      container.children = ["linkForm"].map((child, index) => {
                        return {
                          class: "karma-tinymce-popover",
                          init: popover => {
                            popover.element.tabIndex = -1;
                          },
                          update: async popover => {
                            const data = this.getData() || {};
                            popover.element.classList.toggle("hidden", data.activeModal !== child);
                            popover.element.classList.toggle("active", data.activeModal === child);
                            if (data.activeModal === child) {
                              popover.children = [this.createChild({
                                type: child,
                                ...this.resource.linkForm,
                                index: index
                              }).build()];
                              const editor = this.getEditor();
                              if (editor) {
                                const containerBox = container.element.parentNode.getBoundingClientRect();
                                const nodeBox = data.activeNode ? data.activeNode.getBoundingClientRect() : editor.selection.getRng().getBoundingClientRect();
                                popover.element.style.left = (nodeBox.left - containerBox.x).toFixed()+"px";
                                popover.element.style.top = (nodeBox.bottom - containerBox.y + 5).toFixed()+"px";
                              }
                            }
                          }
                        };
                      });
                    }
                  }
                ];
              }
            }
          }
        ]
      }
		}
	}

	// parseResource(resource) {
	// 	if (typeof resource === "string") {
	// 		resource = KarmaFieldsAlpha.field.tinymce.defaults[resource];
	// 	}
	// 	return resource;
	// }

	static buttons = class extends KarmaFieldsAlpha.field.container {

		constructor(resource) {

			super({
				display: "flex",
				// children: ["format", "bold", "italic", "link", "ul", "ol"],
				children: ["format", "bold", "italic", "link", "ul", "ol"],
				...resource
			});

		}

		static format = class extends KarmaFieldsAlpha.field.dropdown {
			constructor(resource) {
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
				});
			}
		}

		static bold = class extends KarmaFieldsAlpha.field.button {
			constructor(resource) {
				super({
					dashicon: "editor-bold",
					title: "Bold",
					action: "execCommand",
          value: "bold",
					active: ["request", "queryCommand", "bold"],
					...resource
				});
			}
		}

		static italic = class extends KarmaFieldsAlpha.field.button {
			constructor(resource) {
				super({
					dashicon: "editor-italic",
					title: "Italic",
					action: "execCommand",
					value: "italic",
					active: ["request", "queryCommand", "italic"],
					...resource
				});
			}
		}

		static link = class extends KarmaFieldsAlpha.field.button {
			constructor(resource) {
				super({
					dashicon: "admin-links",
					title: "Link",
					action: "openLink",
					active: ["request", "queryLink"],
					disabled: ["!", ["request", "hasSelection"]],
					...resource
				});
			}
		}

		static ul = class extends KarmaFieldsAlpha.field.button {
			constructor(resource) {
				super({
					dashicon: "editor-ul",
					title: "Unordered list",
					action: "execUL",
					active: ["request", "queryUL"],
					...resource
				});
			}
		}

		static ol = class extends KarmaFieldsAlpha.field.button {
			constructor(resource) {
				super({
					dashicon: "editor-ol",
					title: "Ordered list",
					action: "execOL",
					active: ["request", "queryOL"],
					...resource
				});
			}
		}

    static code = class extends KarmaFieldsAlpha.field.button {
			constructor(resource) {
				super({
					dashicon: "html",
					title: "Code",
					action: "execMode",
          value: "code",
					...resource
				});
			}
		}

    static edit = class extends KarmaFieldsAlpha.field.button {
			constructor(resource) {
				super({
					dashicon: "edit",
					title: "Code",
					action: "execMode",
          value: "edit",
					...resource
				});
			}
		}


    static strikethrough = class extends KarmaFieldsAlpha.field.button {
			constructor(resource) {
				super({
					dashicon: "editor-strikethrough",
					title: "Strikethrough",
					action: "execCommand",
					value: "strikethrough",
					active: ["request", "queryCommand", "strikethrough"],
					...resource
				});
			}
		}

    static superscript = class extends KarmaFieldsAlpha.field.button {
			constructor(resource) {
				super({
					// dashicon: "editor-strikethrough",
					title: "Superscript",
					action: "execCommand",
					value: "superscript",
					active: ["request", "queryCommand", "superscript"],
					...resource
				});
			}
		}

    static superscript = class extends KarmaFieldsAlpha.field.button {
			constructor(resource) {
				super({
					// dashicon: "editor-strikethrough",
					title: "Subscript",
					action: "execCommand",
					value: "subscript",
					active: ["request", "queryCommand", "subscript"],
					...resource
				});
			}
		}

    static justifyLeft = class extends KarmaFieldsAlpha.field.button {
			constructor(resource) {
				super({
					dashicon: "editor-alignleft",
					title: "JustifyLeft",
					action: "execCommand",
					value: "JustifyLeft",
					active: ["request", "queryCommand", "JustifyLeft"],
					...resource
				});
			}
		}

    static justifyCenter = class extends KarmaFieldsAlpha.field.button {
			constructor(resource) {
				super({
					dashicon: "editor-aligncenter",
					title: "JustifyCenter",
					action: "execCommand",
					value: "JustifyCenter",
					active: ["request", "queryCommand", "JustifyCenter"],
					...resource
				});
			}
		}

    static justifyRight = class extends KarmaFieldsAlpha.field.button {
			constructor(resource) {
				super({
					dashicon: "editor-alignright",
					title: "JustifyRight",
					action: "execCommand",
					value: "JustifyRight",
					active: ["request", "queryCommand", "JustifyRight"],
					...resource
				});
			}
		}

    static justifyFull = class extends KarmaFieldsAlpha.field.button {
			constructor(resource) {
				super({
					dashicon: "editor-justify",
					title: "JustifyFull",
					action: "execCommand",
					value: "JustifyFull",
					active: ["request", "queryCommand", "JustifyFull"],
					...resource
				});
			}
		}

    static justifyNone = class extends KarmaFieldsAlpha.field.button {
			constructor(resource) {
				super({
					dashicon: "editor-alignleft",
					title: "JustifyNone",
					action: "execCommand",
					value: "JustifyNone",
					active: ["request", "queryCommand", "JustifyNone"],
					...resource
				});
			}
		}

	}

	static form = class extends KarmaFieldsAlpha.field.group {

    getValue(key) {

      const data = this.getData();

      if (data && data.buffer && data.buffer[key] !== undefined) {

        return KarmaFieldsAlpha.Type.toString(data.buffer[key]);

      } else {

        return super.getValue(key);

      }

    }

    setValue(value, subkey) {


      // const currentValues = this.getValue(subkey);

      // value = KarmaFieldsAlpha.Type.toArray(value);

      // if (KarmaFieldsAlpha.DeepObject.differ(value, currentValues)) {

      // debugger;

        const data = this.getData() || {};

        if (!data.buffer) {

          const [buffer] = this.parent.getValue(this.getKey()) || [];
          // const [value] = super.getValue() || [];

          data.buffer = buffer || {};

        }

        data.buffer[subkey] = value;

        // this.setData(data);

      // }

    }

    modified(key) {

      const data = this.getData();

      if (!data || !data.buffer || data.buffer[key] === super.getValue(key)) {

        return false;

      }

      return true;

    }

    submit() {

      const data = this.getData();

      let key = this.getKey();

      if (data && data.buffer) {

        if (key) {

          // super.setValue(data.buffer, key);

          this.parent.setValue(data.buffer, key);

        } else {

          for (key in data.buffer) {

            this.parent.setValue(data.buffer[key], key);

          }

        }

        // for (let key in data.buffer) {

        //   super.setValue(data.buffer[key], key);

        // }

      }

      // this.request("closelink");

      this.close();

    }

    close() {

      const data = this.getData();

      if (data.buffer) {

        delete data.buffer;

        // this.setData(data);

      }

      this.parent.request("closelink");

    }

    save() {
      // noop
    }

    render() {
      // noop
    }



		// request(subject, content, ...path) {

		// 	switch (subject) {

		// 		// case "state": {
		// 		// 	const value = KarmaFieldsAlpha.DeepObject.get(this.buffer || {}, ...path) || await this.parent.request("get", {}, this.resource.key, ...path);
		// 		// 	return {
		// 		// 		value: value
		// 		// 	};
		// 		// }

		// 		case "get": {

    //     }
		// 			return KarmaFieldsAlpha.DeepObject.get(this.buffer || {}, ...path) || this.parent.request("get", {}, this.resource.key, ...path);

		// 		case "set":
		// 			this.buffer ||= {};
		// 			KarmaFieldsAlpha.DeepObject.assign(this.buffer, content, ...path);
		// 			break;

		// 		case "modified":
		// 			return Boolean(this.buffer);

		// 		case "submit":
		// 			this.parent.request("set", this.buffer, this.resource.key);
		// 			this.buffer = null;
		// 			break;

		// 		case "edit":
		// 			this.render();
		// 			break;

		// 		case "unlink":
		// 			this.parent.request("set", {}, "unlink");
		// 			this.parent.request("edit");
		// 			break;

		// 	}

		// }

	}

	static linkForm = class extends this.form {
		constructor(resource) {
			super({
				key: "linkform",
				children: [
					{
						type: "group",
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
								children: [
									{
										type: "button",
										title: "Cancel",
										action: "close"
									},
									{
										type: "button",
										title: "Unlink",
										action: "unlink",
										disabled: ["!", ["getValue", "href"]]
									},
									{
										type: "separator"
									},
									{
										type: "button",
										title: "Apply",
                    action: "submit"
									}
								]
							}
						]
					}
				],
				...resource
			});
		}

    attachfile() {

      // ...

    }
	}

}

// KarmaFieldsAlpha.field.tinymce.defaults = {
// 	format: {
// 		id: "format",
// 		type: "dropdown",
// 		key: "format",
// 		options: [
// 			{key: "", name: "Format"},
// 			{key: "h1", name: "H1"},
// 			{key: "h2", name: "H2"},
// 			{key: "h3", name: "H3"},
// 			{key: "h4", name: "H4"},
// 			{key: "h5", name: "H5"},
// 			{key: "h6", name: "H6"},
// 			{key: "p", name: "P"}
// 		]
// 	},
// 	italic: {
// 		id: "italic",
// 		type: "button",
// 		dashicon: "editor-italic",
// 		title: "italic",
// 		action: "italic",
// 		active: "italic"
// 	},
// 	bold: {
// 		id: "bold",
// 		type: "button",
// 		dashicon: "editor-bold",
// 		title: "bold",
// 		action: "bold",
// 		active: "bold"
// 	},
// 	link: {
// 		id: "link",
// 		type: "button",
// 		dashicon: "admin-links",
// 		title: "link",
// 		// key: "createlink",
// 		action: "link",
// 		active: "islink",
// 		disabled: "!selected",
// 		modal: {
// 			type: "form",
// 			key: "link",
// 			id: "popover",
// 			children: [
// 				{
// 					type: "group",
// 					// id: "link-popover",
// 					children: [
// 						{
// 							type: "group",
// 							display: "flex",
// 							children: [
// 								{
// 									type: "input",
// 									key: "href",
// 									style: "flex-grow:1"
// 								},
// 								{
// 									type: "button",
// 									dashicon: "paperclip",
// 									action: "attachfile"
// 								}
// 							]
// 						},
// 						{
// 							type: "checkbox",
// 							key: "target",
// 							text: "Open in new tab"
// 						},
// 						{
// 							type: "group",
// 							display: "flex",
// 							// container: {style: "justify-content: space-between"},
// 							children: [
// 								{
// 									type: "group",
// 									display: "flex",
// 									children: [
// 										{
// 											type: "button",
// 											title: "Cancel",
// 											action: "close"
// 										},
// 										{
// 											type: "button",
// 											title: "Unlink",
// 											// dashicon: "editor-unlink"
// 											action: "unlink",
// 											disabled: "!href"
// 										}
// 									]
// 								},
// 								{
// 									type: "submit",
// 									title: "Apply"
// 								}
// 							]
// 						}
// 					]
// 				}
// 			]
// 		}
// 	},
// 	ul: {
// 		id: "ul",
// 		type: "button",
// 		dashicon: "editor-ul",
// 		title: "Unordered list",
// 		action: "ul",
// 		active: "ul"
// 	},
// 	ol: {
// 		id: "ol",
// 		type: "button",
// 		dashicon: "editor-ol",
// 		title: "Ordered list",
// 		action: "ol",
// 		active: "ol"
// 	},
// 	table: {
// 		id: "table",
// 		type: "button",
// 		dashicon: "editor-table",
// 		title: "Table",
// 		action: "table"
// 	},
// 	justifyleft: {
// 		id: "justifyleft",
// 		type: "button",
// 		dashicon: "editor-alignleft",
// 		title: "Justify Left",
// 		action: "JustifyLeft",
// 		active: "JustifyLeft"
// 	},
// 	justifycenter: {
// 		id: "justifycenter",
// 		type: "button",
// 		dashicon: "editor-aligncenter",
// 		title: "Justify Center",
// 		action: "JustifyCenter",
// 		active: "JustifyCenter"
// 	},
// 	justifyright: {
// 		id: "justifyright",
// 		type: "button",
// 		dashicon: "editor-alignright",
// 		title: "Justify Right",
// 		action: "JustifyRight",
// 		active: "JustifyRight"
// 	},
// 	justifyfull: {
// 		id: "justifyfull",
// 		type: "button",
// 		dashicon: "editor-justify",
// 		title: "Justify Full",
// 		action: "JustifyFull",
// 		active: "JustifyFull"
// 	},
// 	media: {
// 		id: "media",
// 		type: "button",
// 		dashicon: "format-image",
// 		title: "Media",
// 		action: "addmedia",
// 		modal: {
// 			type: "form",
// 			id: "media",
// 			display:"flex",
// 			children: [
// 				{
// 					type: "button",
// 					dashicon: "align-none",
// 					action: "alignnone",
// 					active: "alignnone"
// 				},
// 				{
// 					type: "button",
// 					dashicon: "align-left",
// 					action: "alignleft",
// 					active: "alignleft"
// 				},
// 				{
// 					type: "button",
// 					dashicon: "align-center",
// 					action: "aligncenter",
// 					active: "aligncenter"
// 				},
// 				{
// 					type: "button",
// 					dashicon: "align-right",
// 					action: "alignright",
// 					active: "alignright"
// 				},
// 				{
// 					type: "button",
// 					dashicon: "edit",
// 					title: "Replace Image",
// 					action: "addmedia"
// 				}
// 			]
// 			// children: [
// 			// 	{
// 			// 		type: "group",
// 			// 		display:"flex",
// 			// 		children: [
// 			// 			{
// 			// 				type: "button",
// 			// 				dashicon: "align-none",
// 			// 				state: "alignnone",
// 			// 				active: "alignnone"
// 			// 			},
// 			// 			{
// 			// 				type: "button",
// 			// 				dashicon: "align-left",
// 			// 				state: "alignleft",
// 			// 				active: "alignleft"
// 			// 			},
// 			// 			{
// 			// 				type: "button",
// 			// 				dashicon: "align-center",
// 			// 				state: "aligncenter",
// 			// 				active: "aligncenter"
// 			// 			},
// 			// 			{
// 			// 				type: "button",
// 			// 				dashicon: "align-right",
// 			// 				state: "alignright",
// 			// 				active: "alignright"
// 			// 			},
// 			// 			{
// 			// 				type: "button",
// 			// 				dashicon: "edit",
// 			// 				title: "Replace Image",
// 			// 				state: "addmedia"
// 			// 			}
// 			// 		]
// 			// 	}
// 			// ]
// 		}
// 	}
// }
