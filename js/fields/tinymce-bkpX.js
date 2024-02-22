// https://github.com/tinymce/tinymce-dist/blob/master/tinymce.js

// /Applications/MAMP/htdocs/wordpress/wp-includes/js/tinymce/plugins/link/plugin.min.js





KarmaFieldsAlpha.field.tinymce = class extends KarmaFieldsAlpha.field.input {

	static getPath(refNode, node) {

		const path = [];

		// node = node.parentNode;

		while (node !== refNode) {

			let index = 0;

			let prev = node.previousSibling;

			while(prev) {

				index++;

				prev = prev.previousSibling;

			}

			path.unshift(index);

			node = node.parentNode;

		}

		return path;

	}

	static getNode(node, path) {

		for (let index of path) {

			node = node.childNodes[index];

		}

		return node;

	}



  getEditor() {

		if (!this.editor) {

			this.editor = new KarmaFieldsAlpha.tinymce();

			this.editor.onUpdateContent = (text, context) => {

				const content = new KarmaFieldsAlpha.Content(text);
				// this.setValue(content);
				this.save("input");
				this.setContent(content);
				this.request("render");

			}

			this.editor.onUpdateSelection = (selection) => {
				this.setSelection(selection);
				this.setFocus();
				this.request("render"); // -> shouldn't be local render ?
			}

			this.editor.onFetchImage = () => {
				this.fetchImage();
			}

			this.editor.onRender = () => {
				this.request("render"); // -> shouldn't be local render ?
			}

		}

		return this.editor;

  }



	// registerInstance(instance) {
	//
	// 	if (!instance.loading) {
	//
	// 		instance.onUpdateContent = (text, context) => {
	//
	// 			const content = new KarmaFieldsAlpha.Content(text);
	// 			// this.setValue(content);
	// 			this.save("input");
	// 			this.setContent(content);
	// 			this.request("render");
	//
	// 		}
	//
	// 		instance.onUpdateSelection = (selection) => {
	// 			this.setSelection(selection);
	// 			this.setFocus();
	// 			this.request("render"); // -> shouldn't be local render ?
	// 		}
	//
	// 		instance.onFetchImage = () => {
	// 			this.fetchImage();
	// 		}
	//
	// 		// this.editor = instance.editor || KarmaFieldsAlpha.loading;
	//
	// 		this.editor = instance;
	//
	// 	}
	//
	// }

	// static async createEditor(element, params = {}, instance) {
	//
	// 	const [editor] = await tinyMCE.init({
	// 		target: element,
	// 		hidden_input: false,
	// 		inline: true,
	// 		menubar: false,
	// 		contextmenu: false,
	// 		toolbar: false,
	// 		skin: false,
	// 		// theme_url: "tinymce/themes/modern/theme.js",
	//     // paste_as_text: true,
	// 		paste_word_valid_elements: 'b,strong,i,em,ul,ol',
	// 		// plugins: "link lists table paste",
	// 		// image_caption: true,
	// 		plugins: "link lists paste image",
	// 		convert_urls: false,
  //     entity_encoding : "raw", // -> don't encode diacritics
  //     // placeholder: "hjhlo",
	// 		// entity_encoding: "named",
	// 		// image_caption: true,
	// 		// paste_preprocess: (plugin, args) => {
	// 	  //   console.log(args.content);
	// 	  // }
  //     ...params
	// 	});
	//
	// 	this.instance = editor;
	//
	//
	// 	// unactivate history
	// 	editor.on("BeforeAddUndo", event => {
	// 		event.preventDefault();
	// 	});
	//
	// 	editor.on("input", event => {
	// 		if (this.onUpdateContent) {
	// 			const content = editor.getContent();
	// 			this.onUpdateContent(content, "input");
	// 		}
	// 	});
	// 	editor.on("paste", event => {
	// 		if (this.onUpdateContent) {
	// 			const content = editor.getContent();
	// 			this.onUpdateContent(content, "paste");
	// 		}
	// 	});
	// 	editor.on("cut", event => {
	// 		if (this.onUpdateContent) {
	// 			const content = editor.getContent();
	// 			this.onUpdateContent(content, "paste");
	// 		}
	// 	});
	//
	// 	// -> input event does not seem to capture line break (single or double) or delete line break !
	// 	editor.on("keyup", event => {
	// 		if ((event.key === "Backspace" || event.key === "Enter" || event.key === "Meta") && this.onUpdateContent) {
	// 			const content = editor.getContent();
	// 			this.onUpdateContent(content, "delete");
	// 		}
	// 	});
	//
	// 	editor.on("focus", event => {
	// 		if (this.onUpdateSelection) {
	// 			this.onUpdateSelection({final: true});
	// 		}
	// 	});
	//
	// 	editor.on("click", event => {
	//
	// 		const node = editor.selection.getNode();
	// 		const a = node.closest("a");
	//
	// 		if (a) {
	//
	// 			const range = new Range();
	// 			range.selectNode(a);
	//
	// 			if (this.onUpdateSelection) {
	//
	// 				this.onUpdateSelection({
	// 					linkForm: {final: true},
	// 					startPath: this.getPath(element, range.startContainer),
	// 					startOffset: range.startOffset,
	// 					endPath: this.getPath(element, range.endContainer),
	// 					endOffset: range.endOffset
	// 				});
	//
	// 			}
	//
	// 			editor.selection.setRng(range);
	//
	// 		} else if (node.matches("img")) {
	//
	//
	// 		} else {
	//
	// 			if (this.onUpdateSelection) {
	//
	// 				this.onUpdateSelection({final: true});
	//
	// 			}
	//
	// 		}
	//
	// 	});
	//
	// 	editor.on("dblclick", event => {
	// 		const node = editor.selection.getNode();
	// 		if (node.matches("img") || node.matches("figure")) {
	// 			if (this.onFetchImage) {
	// 				this.onFetchImage()
	// 			}
	// 		}
	// 	});
	//
	// 	editor.on("ObjectResized", event => {
	// 		if (this.onUpdateContent) {
	// 			const content = editor.getContent();
	// 			this.onUpdateContent(content, "paste");
	// 		}
	// 	});
	//
	//
	// 	this.getInstance(container).editor;
	//
	// 	// return editor;
	// }









	// DEPRECATED
	async createEditor(element, params, container) {

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
      ...params
		});

		// if (!editors.length) {
		// 	console.warn("editor not created", editors, editor, element);
		// }
		//
		// editor = editors.pop();

		// if (!editor) {
		// 	editor = tinymce.get(element.id);
		// 	console.log("!!", editor);
		// }

		// unactivate history
		editor.on("BeforeAddUndo", event => {
			event.preventDefault();

			// console.log("save", event);
			// this.save("input");
		});

		editor.on("input", event => {
			const content = editor.getContent();
			this.setValue(content);
			this.save("input");
		});
		editor.on("paste", event => {
			const content = editor.getContent();
			this.setValue(content);
			this.save("paste");
		});
		editor.on("cut", event => {
			const content = editor.getContent();
			this.setValue(content);
			this.save("cut");
		});

		// -> input event does not seem to capture line break (single or double) or delete line break !
		editor.on("keyup", event => {
			if (event.key === "Backspace" || event.key === "Enter" || event.key === "Meta") {
				const content = editor.getContent();
				if (content !== this.getSingleValue()) {
          this.setValue(content);
					this.save("delete");
        }
			}
		});

		// editor.on("NodeChange", event => {
		// 	if (event.selectionChange) {
    //     const data = this.getData();
		// 		// console.log("NodeChange", data.activeModal, event.element !== data.activeNode);
		//
		//
		// 		if (data.activeModal && event.element !== data.activeNode) {
    //       data.activeNode = null;
    //       data.activeModal = null;
		//
		//
		// 			this.renderPopover();
		// 		}
		// 	}
		// 	if (this.renderToolbar) {
    //     this.renderToolbar();
    //   }
		// });
		//
		// editor.on("focusout", event => {
    //   const data = this.getData();
		// 	if (data.activeModal && (!event.relatedTarget || !this.popoverContainer.contains(event.relatedTarget))) {
		// 		data.activeNode = null;
		// 		data.activeModal = null;
		// 		this.renderPopover();
		// 	}
    //   if (this.renderToolbar) {
    //     this.renderToolbar();
    //   }
		// });

		editor.on("focus", event => {

			this.setSelection({final: true});
			this.render();

		});

		editor.on("click", event => {

			const node = editor.selection.getNode();
      const data = this.getData();
			const selection = this.getSelection();
			const a = node.closest("a");

			// if (node.matches("a")) {
			if (a) {

				// data.activeNode = node;
				// data.activeModal = "linkForm";
				// const containerBox = element.parentNode.getBoundingClientRect();
				// const box = node.getBoundingClientRect();

				// const range = editor.selection.getRng();
				// const sel = editor.selection.getSel();

				const range = new Range();
				range.selectNode(a);
				// console.log(range);



				this.setSelection({
					linkForm: {final: true},

					// anchorPath: KarmaFieldsAlpha.field.tinymce.getPath(element, sel.anchorNode),
					// anchorOffset: sel.anchorOffset,
					// focusPath: KarmaFieldsAlpha.field.tinymce.getPath(element, sel.focusNode),
					// focusOffset: sel.focusOffset,


					startPath: KarmaFieldsAlpha.field.tinymce.getPath(element, range.startContainer),
					startOffset: range.startOffset,
					endPath: KarmaFieldsAlpha.field.tinymce.getPath(element, range.endContainer),
					endOffset: range.endOffset

				});

				editor.selection.setRng(range);


			} else if (node.matches("img")) {
				// data.activeNode = node;

				// this.setSelection({imgForm: {}});
				// this.request("editmedia");

				// const range = new Range();
				// range.selectNode(node);
				//
				// this.setSelection({
				// 	imageForm: {final: true},
				// 	startPath: KarmaFieldsAlpha.field.tinymce.getPath(element, range.startContainer),
				// 	startOffset: range.startOffset,
				// 	endPath: KarmaFieldsAlpha.field.tinymce.getPath(element, range.endContainer),
				// 	endOffset: range.endOffset
				//
				// });

			} else {

				this.setSelection({final: true});

			}

			this.render();

		});

		editor.on("dblclick", event => {
			const node = editor.selection.getNode();

			// console.log(node);
			if (node.matches("img") || node.matches("figure")) {
				this.fetchImage();
				// this.request("addmedia");
			}
		});

		editor.on("ObjectResized", event => {

			const content = editor.getContent();
			this.setValue(content);
			this.save("resize");
		});

		container.tinymce = editor;
	}


	// addTask(callback) {
	//
	// 	let tasks = KarmaFieldsAlpha.Store.get("fields", ...this.path) || [];
	//
	// 	tasks = [...tasks, callback];
	//
	// 	KarmaFieldsAlpha.Store.set(tasks, "fields", ...this.path);
	//
	// }
	//
	// pickTask(callback) {
	//
	// 	let tasks = KarmaFieldsAlpha.Store.get("fields", ...this.path) || [];
	//
	// 	tasks = [...tasks, callback];
	//
	// 	KarmaFieldsAlpha.Store.set(tasks, "fields", ...this.path);
	//
	// }



  queryCommand(key) {

    const request = this.getEditor();

    if (!request.loading) {

      return request.editor.queryCommandState(key);

    }

  }

  execCommand(key) {

    const request = this.getEditor();

    if (!request.loading) {

      request.editor.execCommand(key);

			const text = request.editor.getContent();
			const content = new KarmaFieldsAlpha.Content(text);

			this.save(key, key);
			this.setContent(content);
			this.request("render");

    }

  }

  queryUL() {

    const request = this.getEditor();

    if (!request.loading) {

      return request.editor.queryCommandValue("InsertUnorderedList") === "true";

    }

    return false;
  }

  queryOL() {

    const request = this.getEditor();

    if (!request.loading) {

      return request.editor.queryCommandValue("InsertOrderedList") === "true";

    }

    return false;
  }


  execUL() {

    const request = this.getEditor();

    if (!request.loading) {

      if (request.editor.queryCommandValue("InsertUnorderedList") !== "true") {

        request.editor.execCommand('InsertUnorderedList', false, {
          'list-style-type': 'disc'
        });

      } else {

        request.editor.execCommand("RemoveList");

      }

      // this.saveContent();
			const text = request.editor.getContent();
			const content = new KarmaFieldsAlpha.Content(text);
			this.save("ul", "ul");
			this.setContent(content);
			this.render();

    }

  }

  execOL() {

    const request = this.getEditor();

    if (!request.loading) {

      if (request.editor.queryCommandValue("InsertOrderedList") !== "true") {

        request.editor.execCommand('InsertOrderedList', false, {
          'list-style-type': 'decimal'
        });

      } else {

        request.editor.execCommand("RemoveList");

      }

      // this.saveContent();

			const text = request.editor.getContent();
			const content = new KarmaFieldsAlpha.Content(text);
			this.save("ol", "ol");
			this.setContent(content);
			this.render();

    }

  }

  getFormat() {

    const request = this.getEditor();

    if (!request.loading) {

      const matches = request.editor.queryCommandValue("FormatBlock").match(/h[1-6]/);

      if (matches && matches[0]) {

        return [matches[0]];

      }

    }

    return [""];
  }

  setFormat(value) {

    const request = this.getEditor();

    if (!request.loading) {

      request.editor.execCommand("FormatBlock", false, value);

      // this.saveContent();
			// const content = editor.getContent();
			// this.setValue(content);
			// this.render();
			// this.save("format");

			const text = request.editor.getContent();
			const content = new KarmaFieldsAlpha.Content(text);
			this.save("format", "format");
			this.setContent(content);
			this.render();

    }

  }

  queryLink() {

		const request = this.getEditor();

    if (!request.loading) {

      const node = request.editor.selection.getNode();
			const a = node && node.closest("a");

      return new KarmaFieldsAlpha.Content(Boolean(a));

		}

  }

	unlink() {

		const request = this.getEditor();

    if (!request.loading) {

			const node = request.editor.selection.getNode();
			const a = node && node.closest("a");

			if (a) {

				request.editor.selection.select(a);

			}



      request.editor.execCommand("Unlink");

			// this.saveContent();
			// const content = editor.getContent();
			// this.setValue(content);
			// this.setSelection({final: true});
			// this.render();
			// this.save("unlink");

			const text = request.editor.getContent();
			const content = new KarmaFieldsAlpha.Content(text);
			this.save("unlink", "unlink");
			this.setContent(content);
			this.render();

    }

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

    const request = this.getEditor();

    if (!request.loading) {

      const node = request.editor.selection.getNode();
			const a = node && node.closest("a");

      if (a) {

				let href = node.getAttribute("href");

				if (href === "nolink") {

					href = "";

				}

        return [
          {
            href: href || "",
            target: node.getAttribute("target") === "_blank" ? "1" : ""
          }
        ];

      }

    }

    return [];

  }

  setLinkForm(value) {

    const request = this.getEditor();

    if (!request.loading) {

			// const editorBody = request.editor.getElement();
			// const selection = this.getSelection();
			// const startNode = KarmaFieldsAlpha.field.tinymce.getNode(editorBody, selection.startPath);
			// const endNode = KarmaFieldsAlpha.field.tinymce.getNode(editorBody, selection.endPath);
			// const range = new Range();
			//
			// // if (startNode.nodeType === 3 && startNode.nodeValue && selection.startOffset <= startNode.nodeValue.length && endNode.nodeType === 3 && endNode.nodeValue && selection.endOffset <= endNode.nodeValue.length) {
			//
			// 	range.setStart(startNode, selection.startOffset);
			// 	range.setEnd(endNode, selection.endOffset);
			//
			// 	request.editor.selection.setRng(range);

	      if (value.href === "") {

					request.editor.execCommand("Unlink");

	      } else {

					let href = value.href;

					if (!href) {

						const node = request.editor.selection.getNode();
						const a = node && node.closest("a");

						if (a) {

							href = a.getAttribute("href") || "";

						}



					}

					request.editor.execCommand("mceInsertLink", false, {
	          "href": href,
	          "target": value.target ? "_blank" : null
	        });

	      // } else if (value.href) {
				//
				// 	request.editor.execCommand("mceInsertLink", false, {
				// 		"href": value.href,
	      //     "target": null
	      //   });

	      // } else if (value.target) {
				//
				// 	request.editor.execCommand("mceInsertLink", false, {
	      //     "target": "_blank"
	      //   });

	      }

				// this.saveContent();
				// const content = editor.getContent();
				// this.setValue(content);
				//
				// this.setSelection({final: true});
				// this.render();
				// this.save("link");

				const text = request.editor.getContent();
				const content = new KarmaFieldsAlpha.Content(text);
				this.save("link", "link");
				// this.removeSelection();
				this.setFocus();
				this.setContent(content);
				this.render();

			// }

    }

  }

  openLink() {

		const request = this.getEditor();

		if (!request.loading) {

			const element = request.editor.getElement();
			const range = request.editor.selection.getRng();

			this.setSelection({
				linkForm: true,
				startPath: KarmaFieldsAlpha.field.tinymce.getPath(element, range.startContainer),
				startOffset: range.startOffset,
				endPath: KarmaFieldsAlpha.field.tinymce.getPath(element, range.endContainer),
				endOffset: range.endOffset
			});

			this.render();

		}





  }


  closelink() {

		const request = this.getEditor();

    if (!request.loading) {

			const node = request.editor.selection.getNode();
			const a = node && node.closest("a");

			if (a) {

				if (a.getAttribute("href") === "nolink") {

					request.editor.execCommand("Unlink");

					const text = request.editor.getContent();
					const content = new KarmaFieldsAlpha.Content(text);
					this.save("link", "link");
					this.setContent(content);

				} else {

					// -> set caret after node (https://stackoverflow.com/a/9829634/2086505)
					const range = request.editor.selection.getRng();
					range.setStartAfter(a);
					range.setEndAfter(a);

					request.editor.selection.setRng(range);

				}

				this.setFocus();
				this.render();

			}

		}

  }


	insertLink() {

    const request = this.getEditor();

    if (!request.loading) {

			request.editor.execCommand("mceInsertLink", false, {
				"href": "nolink"
			});

			request.editor.selection.collapse(true);

			const node = request.editor.selection.getNode();

			request.editor.selection.select(node);

			const text = request.editor.getContent();
			const content = new KarmaFieldsAlpha.Content(text);
			this.save("link", "link");
			this.setFocus();
			this.setContent(content);
			this.render();

    }

  }





  queryMode() {

    const mode = this.getOption("mode");

    return data.mode || "edit";
  }

  execMode(value) {

    this.setOption(value, "mode");

		this.render();

  }




  // getValue(key) {
	//
  //   switch (key) {
	//
  //     case "format":
  //       return this.getFormat();
	//
  //     case "bold":
  //     case "italic":
  //     case "strikethrough":
  //     case "superscript":
  //     case "subscript":
  //     case "JustifyLeft":
  //     case "JustifyCenter":
  //     case "JustifyRight":
  //     case "JustifyFull":
  //     case "JustifyNone":
	// 			console.error("deprecated");
  //       return this.queryCommand(key);
	//
  //     case "ul":
	// 			console.error("deprecated");
  //       return this.queryUL();
	//
  //     case "ol":
	// 			console.error("deprecated");
  //       return this.queryOL();
	//
  //     case "linkform":
  //       return this.getLinkForm();
	//
	// 		case "raw":
	// 			return this.parent.getValue(this.getKey());
	//
  //     default:
  //       return super.getValue();
	//
  //   }
	//
  // }

	getContent(key) {

    switch (key) {

      case "format":
				const format = this.getFormat();
				return new KarmaFieldsAlpha.Content(format);
        // return this.getFormat();

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

      case "linkform":
        // return this.getLinkForm();
				const linkForm = this.getLinkForm();
				return new KarmaFieldsAlpha.Content(linkForm);

			case "raw":
				// return this.parent.getValue(this.getKey());
				return this.parent.getContent(this.getKey());


      default:
        return super.getContent();

    }

  }

  // setValue(value, key) {
	//
  //   switch (key) {
	//
  //     case "format":
  //       this.setFormat(value);
	// 			break;
	//
  //     case "unlink":
  //     case "bold":
  //     case "italic":
  //     case "strikethrough":
  //     case "superscript":
  //     case "subscript":
  //     case "JustifyLeft":
  //     case "JustifyCenter":
  //     case "JustifyRight":
  //     case "JustifyFull":
  //     case "JustifyNone":
	// 			console.error("deprecated");
  //       this.execCommand(key);
  //       break;
	//
  //     case "linkform": {
  //       this.setLinkForm(value);
  //       break;
  //     }
	//
  //     case "ul":
	// 			console.error("deprecated");
  //       // if (this.editor.queryCommandValue("InsertUnorderedList") !== "true") {
  //       // 	this.editor.execCommand('InsertUnorderedList', false, {
  //       // 	  'list-style-type': 'disc'
  //       // 	});
  //       // } else {
  //       // 	this.editor.execCommand("RemoveList");
  //       // }
  //       // this.saveContent();
  //       this.execUL();
  //       break;
	//
  //     case "ol":
	// 			console.error("deprecated");
  //       // if (this.editor.queryCommandValue("InsertOrderedList") !== "true") {
  //       // 	this.editor.execCommand('InsertOrderedList', false, {
  //       // 		'list-style-type': 'decimal'
  //       // 	});
  //       // } else {
  //       // 	this.editor.execCommand("RemoveList");
  //       // }
  //       // this.saveContent();
  //       this.execOL();
  //       break;
	//
  //     case "mode": {
	// 			console.error("deprecated");
  //       // this.parent.request("set-option", content.data, "mode");
  //       // if (this.render) {
  //       //   this.render();
  //       // }
	// 			this.execMode(value);
  //       break;
  //     }
	//
	// 		case "raw":
	// 			this.parent.setValue(value, this.getKey());
	//
  //     default:
  //       super.setValue(value);
  //       break;
	//
	//
	//
	//
  //   }
  // }

	setContent(content, key) {

    switch (key) {

      case "format":
				// const request = new KarmaFieldsAlpha.Content();
				// request.value = content.value;
        this.setFormat(content.value);
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

      case "linkform": {
        // this.setLinkForm(value);
				this.setLinkForm(content.value);
        break;
      }

      case "ul":
				console.error("deprecated");
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
				console.error("deprecated");
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
				console.error("deprecated");
        // this.parent.request("set-option", content.data, "mode");
        // if (this.render) {
        //   this.render();
        // }
				this.execMode(value);
        break;
      }

			case "raw":
				// this.parent.setValue(value, this.getKey());
				this.parent.setContent(content, this.getKey());
				break;

      default:
        // super.setValue(value);
				super.setContent(content);
        break;




    }
  }


  hasContentSelected() {

    const request = this.getEditor();

    if (!request.loading) {

			// console.log(request.editor.selection.getContent());

      return request.editor.selection.getContent().length > 0;

    }

    return false;
  }

	// setSelection(selection) {
	//
	// 	if (selection.linkForm || selection.imageForm) {
	//
	// 		selection = {
	// 			...this.getSelection(),
	// 			...selection,
	// 			final: false
	// 		};
	//
	// 	}
	//
	//
	//
	// 	super.setSelection(selection);
	//
	// }




	follow(selection, callback) {
console.error("deprecated");
    if (selection.final) {

      return callback(this, selection);

    } else {

			for (let type of ["linkForm", "imageForm"]) {

				if (selection[type]) {

					const modal = this.createChild({
						type: type,
						...this.resource[type],
						index: type,
						uid: `${this.resource.uid}-${type}`
		      });

		      return modal.follow(selection[type], callback);

				}

			}

		}

  }





	useSocket() {
		return new KarmaFieldsAlpha.Content(true);
	}

	getDriver() {

    return this.resource.driver || "medias";

  }

	getTable() {

    return this.parse(this.resource.table || "medias");

  }

  getParams() {

    return this.parse(this.resource.params);

  }

	attachMedias(ids) {

		const table = this.getTable();
    const params = this.getParams();

    if (table.loading || params.loading) {

      this.addTask(() => this.edit(), "attach-file");

    } else {

			this.save("attach-file", "Attach File");

			this.setFocus(false);
			this.request("open", table.toString(), params.toObject(), false);

			if (ids) {

				this.addTask(() => this.request("dispatch", "selectByIds", ids), "pre-select");

			}

    }

	}

	insert(ids) {

    const request = this.getEditor();

		if (!request.loading) {

			const attachments = this.getFiles(ids);

			if (request.loading || attachments.loading) {

				this.addTask(() => this.insert(ids), "insert-file");

			} else {

				const html = this.printAttachments(attachments.toArray());

				request.editor.insertContent(html);

				request.editor.selection.collapse(true);

				const node = request.editor.selection.getNode();

				request.editor.selection.select(node);

				const text = request.editor.getContent();
				const content = new KarmaFieldsAlpha.Content(text);
				this.save("insert-image", "Insert Image");
				this.setFocus();
				this.setContent(content);
				this.render();

	    }

		}

  }




	//
	// fetchImage() {
	//
	// 	const request = this.getEditor();
	//
	// 	if (!request.loading) {
	//
	// 		const table = KarmaFieldsAlpha.mediasTable || "medias";
	// 		const element = request.editor.getElement();
	// 		const range = request.editor.selection.getRng();
	// 		const node = request.editor.selection.getNode();
	// 		let id;
	//
	// 		this.setSelection({
	// 			imageForm: true,
	// 			startPath: KarmaFieldsAlpha.field.tinymce.getPath(element, range.startContainer),
	// 			startOffset: range.startOffset,
	// 			endPath: KarmaFieldsAlpha.field.tinymce.getPath(element, range.endContainer),
	// 			endOffset: range.endOffset
	// 		});
	//
	// 		if (node) {
	//
	// 			const img = node.matches("img") && node || node.querySelector("img");
	//
	// 			if (img && img.getAttribute("data-id")) {
	//
	// 				id = img.getAttribute("data-id");
	//
	// 			}
	//
	// 		}
	//
	// 		// this.parent.request("fetch", table, {}, id);
	//
	// 	}
	//
	// }

	// insert(ids) {
	// 	console.error("deprecated");
	// 	if (ids.length) {
	//
	// 		this.getData().attachments = ids;
	//
	// 	}
	//
	// }





  // insertContent(html) {
	//
	// 	const editor = this.getEditor();
	//
  //   if (editor) {
	//
	// 		const editorBody = editor.getElement();
	// 		const selection = this.getSelection();
	// 		const startNode = KarmaFieldsAlpha.field.tinymce.getNode(editorBody, selection.startPath);
	// 		const endNode = KarmaFieldsAlpha.field.tinymce.getNode(editorBody, selection.endPath);
	// 		const range = new Range();
	// 		range.setStart(startNode, selection.startOffset);
	// 		range.setEnd(endNode, selection.endOffset);
	//
	// 		editor.selection.setRng(range);
	//
	//
	// 		editor.execCommand(
	// 			'mceInsertContent',
	// 			false,
	// 			html
	// 		);
	//
	// 		// for (let image of images) {
	// 		//
	// 		// 	const node = editor.selection.getNode();
	// 		//
	// 		// 	let width = image.sources[0].width;
	// 		// 	let height = image.sources[0].height;
	// 		//
	// 		// 	if (node && node.matches("img")) {
	// 		// 		width = node.getAttribute("width") || width;
	// 		// 		height = node.getAttribute("height") || height;
	// 		// 	}
	// 		//
	// 		// 	this.editor.execCommand(
	// 		// 		'mceInsertContent',
	// 		// 		false,
	// 		// 		`<img
	// 		// 			src="${image.sources[0].src}"
	// 		// 			width="${width}"
	// 		// 			height="${height}"
	// 		// 			data-id="${image.id}"
	// 		// 			srcset="${image.sources.map(source => source.src+" "+source.width+"w").join(", ")}"
	// 		// 			sizes="(min-width: ${width}px) ${width}px, 100vw"
	// 		// 		>`
	// 		// 	);
	// 		//
	// 		// }
	//
	// 		// this.saveContent();
	// 		const content = editor.getContent();
	// 		this.setValue(content);
	//
	// 		// this.setSelection({final: true});
	//
	// 		this.save("insert");
	//
  //   }
	//
	// }

	getFile(id) {

		const driver = this.getDriver();
		const content = new KarmaFieldsAlpha.Content();

		const filename = new KarmaFieldsAlpha.Content.Value(driver, id, "filename");
		const mimetype = new KarmaFieldsAlpha.Content.Value(driver, id, "mimetype");
		const dir = new KarmaFieldsAlpha.Content.Value(driver, id, "dir");
		const width = new KarmaFieldsAlpha.Content.Value(driver, id, "width");
		const height = new KarmaFieldsAlpha.Content.Value(driver, id, "height");
		const alt = new KarmaFieldsAlpha.Content.Value(driver, id, "alt");
		const caption = new KarmaFieldsAlpha.Content.Value(driver, id, "caption");

		if (filename.loading || mimetype.loading || dir.loading || width.loading || height.loading || alt.loading || caption.loading) {

			content.loading = true;

		} else {

			content.value = {
				filename: filename.toString(),
				mimetype: mimetype.toString(),
				dir: dir.toString(),
				width: width.toString(),
				height: height.toString(),
				alt: alt.toString(),
				caption: caption.toString()
			};

			if (mimetype.toString() === "image/jpeg" || mimetype.toString() === "image/png") {

				const sizes = new KarmaFieldsAlpha.Content.Value(driver, id, "sizes");

				if (sizes.loading) {

					content.loading = true;

				} else {

					content.value.sizes = caption.toArray();

				}

			}

		}

		return content;
	}

	getFiles(ids) {

		// const attachments = id.map(id => this.getFile(id));
		//
		// if (attachments.every(attachment => attachment)) {
		//
		// 	return attachments;
		//
		// }

		const content = new KarmaFieldsAlpha.Content([]);

		for (let id of ids) {

			const file = this.getFile();

			if (file.loading) {

				content.loading = true;

			} else {

				content.value.push(file.toObject());

			}

		}

		return content;

	}

	printAttachment(attachment) {

		let content = "";

		if (attachment.mimetype === "image/jpeg" || attachment.mimetype === "image/png") {

			content = `<img
				src="${encodeURI(KarmaFieldsAlpha.uploadURL+(attachment.dir || "")+"/"+attachment.filename)}"
				width="${attachment.width||""}"
				height="${attachment.height||""}"
				data-id="${attachment.id||""}"
				srcset="${attachment.sizes.map(source => `${encodeURI(KarmaFieldsAlpha.uploadURL+attachment.dir+"/"+source.filename)} ${source.width}w`).join(", ")}"
				sizes="(min-width: ${attachment.width||""}px) ${attachment.width||""}px, 100vw"
				alt="${attachment.alt||""}"
				style="${attachment.style||""}"
			>`;


		} else if (mimetype.startsWith("image")) {

			content = `<img
				src="${KarmaFieldsAlpha.uploadURL+attachment.dir+"/"+attachment.filename}"
				width="${attachment.width||""}"
				height="${attachment.height||""}"
				data-id="${attachment.id||""}"
				alt="${attachment.alt||""}"
				style="${attachment.style||""}"
			>`;

		} else if (mimetype.startsWith("video")) {

			content = `<video data-id="${attachment.id||""}" width="${attachment.width||""}" height="${attachment.height||""}" controls>
				<source src="${KarmaFieldsAlpha.uploadURL+attachment.dir+"/"+attachment.filename}" type="${attachment.mimetype||""}"></source>
			</video>`;

		}

		return `<figure class="image" contenteditable="false">${content}<figcaption>${attachment.caption||""}</figcaption></figure>`;

	}

	printAttachments(attachments) {

		return attachments.map(attachment => this.printAttachment(attachment)).join();

	}


	// attachImages(attachmentIds) {
	//
	// 	const editor = this.getEditor();
	//
	// 	if (editor && editor !== KarmaFieldsAlpha.loading) {
	//
	// 		const attachments = this.getFiles(attachmentIds);
	//
	// 		if (attachments) {
	//
	// 			delete this.getData().attachments;
	//
	// 			const editorBody = editor.getElement();
	// 			const selection = this.getSelection();
	// 			const startNode = KarmaFieldsAlpha.field.tinymce.getNode(editorBody, selection.startPath);
	// 			const endNode = KarmaFieldsAlpha.field.tinymce.getNode(editorBody, selection.endPath);
	// 			const range = new Range();
	// 			range.setStart(startNode, selection.startOffset);
	// 			range.setEnd(endNode, selection.endOffset);
	//
	// 			editor.selection.setRng(range);
	//
	// 			if (attachments.length === 1) {
	//
	// 				const node = editor.selection.getNode();
	//
	// 				if (node) {
	//
	// 					const img = node.matches("img") && node || node.querySelector("img");
	//
	// 					if (img) {
	//
	// 						const style = img.getAttribute("style");
	//
	// 						if (style) {
	//
	// 							attachments[0].style = style;
	//
	// 						}
	//
	// 					}
	//
	// 					const figcaption = node.querySelector("figcaption");
	//
	// 					if (figcaption) {
	//
	// 						attachments[0].caption = figcaption.innerHTML;
	//
	// 					}
	//
	//
	// 				}
	//
	// 			}
	//
	//
	// 			// editor.execCommand(
	// 			// 	'mceInsertContent',
	// 			// 	false,
	// 			// 	images.join("")
	// 			// );
	//
	// 			const html = this.printAttachments(attachments);
	//
	// 			editor.insertContent(html);
	//
	// 			const content = editor.getContent();
	// 			this.setValue(content);
	// 			this.render();
	// 			this.save("insert");
	//
	// 		}
	//
	// 	}
	//
	// }

	getChild(type) {

		if (type === "linkForm") {

			return this.createChild({
				type: "linkForm",
				...this.resource.linkForm,
			}, "linkForm");

		}

	}


	// hasFocus() {
	//
	// 	const editor = this.getEditor();
	//
	// 	return Boolean(editor && editor !== KarmaFieldsAlpha.loading && editor.hasFocus());
	//
	// }

	build() {
		return {
			class: "editor karma-tinymce",
			init: container => {
				container.element.tinymce = KarmaFieldsAlpha.loading;
			},
      update: container => {

				// const instance = KarmaFieldsAlpha.tinymce.getInstance(container.element);
				//
				// this.registerInstance(instance);

				// const instance = this.getEditor();

				const request = this.getEditor();

				request.init(null, container.element); // -> preinit before header render


				const selection = this.getSelection() || {};

				let content = this.getContent();

				if (content.notFound) {

					const defaultContent = KarmaFieldsAlpha.field.input.prototype.getDefault.call(this);

					if (defaultContent.value !== null) {

						this.setContent(defaultContent);

						KarmaFieldsAlpha.Query.init(); // -> add empty task to force rerendering

					}

				}

				container.element.classList.toggle("loading", Boolean(content.loading));

        const mode = content.mixed && "code" || this.getOption("mode") || this.resource.mode || "edit";
        // const mode = value === KarmaFieldsAlpha.mixed && "code" || action.mode || this.resource.mode || "edit";

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
                        class: "toolbar simple-buttons",
                        child: this.createChild({
                          type: "buttons",
                          // children: ["separator", "edit"],
													children: ["separator", "edit"],
                          ...this.resource.textarea_buttons,
													index: "toolbar"
                        }).build()
                      }
                    ]
                  },
                  {
                    class: "textarea editor-body",
                    update: node => {
											const isCode = mode === "code";
                      node.element.classList.toggle("hidden", !isCode);
                      if (isCode) {
												node.child = this.createChild({
													type: "textarea",
													index: "textarea",
													key: "raw"
													// uid: `${this.resource.uid}-textarea` // -> how to connect with label ??
												}).build()
                        // node.child = {
                        //   tag: "textarea",
                        //   update: async textarea => {
                        //     let value = this.getValue();
												//
                        //     if (values) {
                        //       if (!this.isLocked()) {
                        //         textarea.element.value = values[0] || "";
                        //         textarea.element.style.height = 0;
                        //         textarea.element.style.height = textarea.element.scrollHeight + 3 + "px";
                        //       }
                        //       textarea.element.oninput = () => {
                        //         textarea.element.style.height = 0;
                        //         textarea.element.style.height = textarea.element.scrollHeight + 3 + "px";
                        //         // this.throttle(() => this.set(textarea.element.value.normalize()));
                        //         this.debounce("typing", async () => {
                        //           const value = input.element.value.normalize();
                        //           const [currentValue] = this.getValue() || [];
												//
                        //           if (value !== currentValue) {
                        //             this.setValue(value);
                        //             // this.parent.request("save");
                        //             // await this.parent.render();
                        //           }
                        //           // this.unlock();
                        //         }, this.resource.debounce || 1000);
                        //         // this.lock();
												//
                        //       }
                        //     }
                        //   }
                        // }
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
							node.element.classList.toggle("active", Boolean(this.hasFocus()));
              node.element.classList.toggle("hidden", mode !== "edit");
              if (mode === "edit") {
                node.children = [
                  {
                    class: "editor-header",
                    children: [
                      {
                        class: "toolbar simple-buttons",
                        update: toolbar => {
                          this.renderToolbar = toolbar.render;
													// toolbar.element.classList.toggle("dark", this.hasFocus());
                        },
                        child: this.createChild({
                          type: "buttons",
                          ...(this.resource.buttons || this.resource.header || this.resource.toolbar)
                        }).build()
                      }
                    ]
                  },
                  {
                    class: "tinymce editor-body",
										init: node => {
											node.element.editable = true;
											// node.element.id = this.resource.uid; // FAIL -> in block editor, resource.uid is not static
											// debugger;
											// const instance = this.getEditor();






											// KarmaFieldsAlpha.tasks.push({
											// 	type: "editor",
											// 	element: node.element,
											// 	resolve: async task => this.createEditor(node.element, this.resource.mceinit, container.element)
											// });

											node.element.onmousedown = event => {
											  event.stopPropagation(); // -> prevent re-rendering (moved to text field)
											}

										},
                    update: node => {

											const request = this.getEditor();

											request.init(node.element, container.element, this.resource.mceinit);

											if (request.loading) {

												return;

											}

											if (content.loading) {

												return;

											}

											let text = request.editor.getContent();

											if (text !== content.toString()) {

												request.editor.setContent(content.toString());

												text = request.editor.getContent();

												if (text !== content.value) { // -> check if editor has formated things!

													// this.save();
													const newContent = new KarmaFieldsAlpha.Content(text);
													// this.setValue(content);
													this.setContent(newContent);


												}

											}

                    }
                  },
                  {
                    class: "karma-popover-container",
                    update: container => {
                      // this.renderPopover = container.render;
                      // this.popoverContainer = container.element;
											//
                      // container.element.onfocusout = event => {
                      //   const editor = this.getEditor();
                      //   const data = this.getData();
                      //   if (data.activeModal && (!event.relatedTarget || !container.element.contains(event.relatedTarget) && !editor.getBody().contains(event.relatedTarget))) {
											//
                      //     data.activeNode = null;
                      //     data.activeModal = null;
											//
                      //     container.render();
                      //   }
                      // };


											const request = this.getEditor();

											if (!request.loading) {

	                      container.children = ["linkForm", "imageForm"].map((type, index) => {
	                        return {
	                          class: "karma-tinymce-popover",
	                          // init: popover => {
	                          //   popover.element.tabIndex = -1;
	                          // },
	                          update: popover => {

															popover.element.onmousedown = event => {
																event.stopPropagation();
															}


															const field = this.createChild({
																type: type,
																...this.resource[type]
															}, type);



																const node = request.editor.selection.getNode();






																const targetElement = node && node.closest(field.resource.selector);

																popover.element.classList.toggle("hidden", !targetElement);
																popover.element.classList.toggle("active", Boolean(targetElement));

																if (targetElement) {

																	popover.children = [field.build()];

																	// const range = getRng

																	const editorBody = request.editor.getElement();
																	const containerBox = editorBody.parentNode.getBoundingClientRect();
																	const box = targetElement.getBoundingClientRect();

																	const parentWidth = container.element.parentNode.clientWidth;
																	const width = Math.min(360, containerBox.width);
																	const left = Math.min(box.left - containerBox.left, parentWidth - width);
																	let top = box.top - containerBox.top + box.height + 5;

																	// if (type === "imageForm") {
																	// 	top = box.top - containerBox.top + 5;
																	// }

																	popover.element.style.left = `${left.toFixed()}px`;
																	popover.element.style.top = `${top.toFixed()}px`;
																	popover.element.style.width = `${width.toFixed()}px`;

																}

	                            // if (selection[type]) {


																// popover.children = [this.createChild({
	                              //   type: type,
	                              //   ...this.resource[type]
	                              //   // index: type,
																// 	// uid: `${this.resource.uid}-${type}`
	                              // }, type).build()];
																//
																//
																// // if (!request.loading) {
																//
																// 	const editorBody = request.editor.getElement();
																//
																// 	const range = new Range();
																// 	const startNode = KarmaFieldsAlpha.field.tinymce.getNode(editorBody, selection.startPath);
																// 	const endNode = KarmaFieldsAlpha.field.tinymce.getNode(editorBody, selection.endPath);
																//
																// 	// if (startNode.nodeType === 3 && startNode.nodeValue && selection.startOffset <= startNode.nodeValue.length && endNode.nodeType === 3 && endNode.nodeValue && selection.endOffset <= endNode.nodeValue.length) {
																//
																// 		range.setStart(startNode, selection.startOffset);
																// 		range.setEnd(endNode, selection.endOffset);
																//
																// 		const containerBox = editorBody.parentNode.getBoundingClientRect();
																// 		const box = range.getBoundingClientRect();
																//
																// 		const parentWidth = container.element.parentNode.clientWidth;
																// 		const width = Math.min(360, containerBox.width);
																// 		const left = Math.min(box.left - containerBox.left, parentWidth - width);
																// 		let top = box.top - containerBox.top + box.height + 5;
																//
																// 		if (type === "imageForm") {
																// 			top = box.top - containerBox.top + 5;
																// 		}
																//
																// 		popover.element.style.left = `${left.toFixed()}px`;
																// 		popover.element.style.top = `${top.toFixed()}px`;
																// 		popover.element.style.width = `${width.toFixed()}px`;
																//
																// 	// } else {
																// 	//
																// 	// 	console.error("out of bounds", selection.startOffset, startNode.nodeValue, selection.endOffset, endNode.nodeValue);
																// 	// }
																//
																//
																// // }

															// }
	                          }
	                        };
	                      });

											}

                    }
                  }
                ];
              }
            }
          }
        ]
      },
			complete: node => {
				// const attachments = this.getData().attachments;
				//
				// if (attachments && attachments.length) {
				// 	this.attachImages(attachments);
				// }
			}
		}
	}

	// parseResource(resource) {
	// 	if (typeof resource === "string") {
	// 		resource = KarmaFieldsAlpha.field.tinymce.defaults[resource];
	// 	}
	// 	return resource;
	// }







}

KarmaFieldsAlpha.field.tinymce.buttons = class extends KarmaFieldsAlpha.field.container {

	constructor(resource) {

		super({
			display: "flex",
			// children: ["format", "bold", "italic", "link", "ul", "ol"],
			children: ["format", "bold", "italic", "link", "ul", "ol", "image", "code"],
			...resource
		});

	}

}

KarmaFieldsAlpha.field.tinymce.buttons.format = class extends KarmaFieldsAlpha.field.dropdown {
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


KarmaFieldsAlpha.field.tinymce.buttons.bold = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.italic = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.link = class extends KarmaFieldsAlpha.field.button {
	constructor(resource) {
		super({
			dashicon: "admin-links",
			title: "Link",
			// action: "openLink",
			request: ["insertLink"],
			active: ["request", "queryLink"],
			enabled: ["||", ["request", "hasContentSelected"], ["request", "queryLink"]],
			...resource
		});
	}
}

KarmaFieldsAlpha.field.tinymce.buttons.image = class extends KarmaFieldsAlpha.field.button {
	constructor(resource) {
		super({
			dashicon: "format-image",
			title: "Image",
			request: ["attachMedias"],
			// active: ["request", "queryImage"],
			// disabled: ["!", ["request", "hasContentSelected"]],
			...resource
		});
	}
}

KarmaFieldsAlpha.field.tinymce.buttons.ul = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.ol = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.code = class extends KarmaFieldsAlpha.field.button {
	constructor(resource) {
		super({
			dashicon: "editor-code",
			title: "Code",
			action: "execMode",
			value: "code",
			...resource
		});
	}
}

KarmaFieldsAlpha.field.tinymce.buttons.edit = class extends KarmaFieldsAlpha.field.button {
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


KarmaFieldsAlpha.field.tinymce.buttons.strikethrough = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.superscript = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.superscript = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.justifyLeft = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.justifyCenter = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.justifyRight = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.justifyFull = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.tinymce.buttons.justifyNone = class extends KarmaFieldsAlpha.field.button {
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




KarmaFieldsAlpha.field.tinymce.form = class extends KarmaFieldsAlpha.field.group {

	// getValue(key) {
	//
	// 	const data = this.getData();
	//
	// 	if (data && data.buffer && data.buffer[key] !== undefined) {
	//
	// 		return KarmaFieldsAlpha.Type.toString(data.buffer[key]);
	//
	// 	} else {
	//
	// 		return super.getValue(key);
	//
	// 	}
	//
	// }

	getContent(subkey) {

		const content = new KarmaFieldsAlpha.Content();

		content.value = this.getOption(subkey);

		if (content.value === undefined) {

			const key = this.getKey();

			const obj = this.parent.getContent(key);

			content.value = KarmaFieldsAlpha.DeepObject.get(obj.toObject(), subkey);

		} else {

			content.modified = true;

		}

		// if (data && data.buffer && data.buffer[key] !== undefined) {
		//
		// 	return KarmaFieldsAlpha.Type.toString(data.buffer[key]);
		//
		// } else {
		//
		// 	return super.getValue(key);
		//
		// }

		return content;

	}

	// setValue(value, subkey) {
	//
	//
	// 	// const currentValues = this.getValue(subkey);
	//
	// 	// value = KarmaFieldsAlpha.Type.toArray(value);
	//
	// 	// if (KarmaFieldsAlpha.DeepObject.differ(value, currentValues)) {
	//
	// 	// debugger;
	//
	// 		const data = this.getData() || {};
	//
	// 		if (!data.buffer) {
	//
	// 			const [buffer] = this.parent.getValue(this.getKey()) || [];
	// 			// const [value] = super.getValue() || [];
	//
	// 			data.buffer = buffer || {};
	//
	// 		}
	//
	// 		data.buffer[subkey] = value;
	//
	// 		// this.setData(data);
	//
	// 	// }
	//
	// }

	setContent(content, subkey) {


		this.setOption(content.value, subkey);

			// const data = this.getData() || {};
			//
			// if (!data.buffer) {
			//
			// 	const [buffer] = this.parent.getValue(this.getKey()) || [];
			// 	// const [value] = super.getValue() || [];
			//
			// 	data.buffer = buffer || {};
			//
			// }
			//
			// data.buffer[subkey] = value;

			// this.setData(data);

		// }

	}

	// modified(key) {
	//
	// 	const data = this.getData();
	//
	// 	if (!data || !data.buffer || data.buffer[key] === super.getValue(key)) {
	//
	// 		return false;
	//
	// 	}
	//
	// 	return true;
	//
	// }

	// submit() {
	//
	// 	const data = this.getData();
	//
	// 	let key = this.getKey();
	//
	// 	if (data && data.buffer) {
	//
	// 		if (key) {
	//
	// 			// super.setValue(data.buffer, key);
	//
	// 			this.parent.setValue(data.buffer, key);
	//
	// 		} else {
	//
	// 			for (key in data.buffer) {
	//
	// 				this.parent.setValue(data.buffer[key], key);
	//
	// 			}
	//
	// 		}
	//
	// 		this.render();
	//
	// 		// for (let key in data.buffer) {
	//
	// 		//   super.setValue(data.buffer[key], key);
	//
	// 		// }
	//
	// 	}
	//
	// 	// this.request("closelink");
	//
	// 	this.close();
	//
	// }

	submit() {

		const content = new KarmaFieldsAlpha.Content();

		content.value = this.getOption();



		if (content.value) {

			const key = this.getKey();

			this.parent.setContent(content, key);

			// this.render();

		}

		this.close();

	}

	close() {

		// const data = this.getData();
		//
		// if (data.buffer) {
		//
		// 	delete data.buffer;
		//
		// 	// this.setData(data);
		//
		// }

		this.removeOption();

		this.parent.request("closelink");

	}

	hasChange() {
		const content = new KarmaFieldsAlpha.Content();

		const data = this.getOption();

		content.value = Boolean(data && Object.values(data).length);

		return content;

	}

	// save() {
	//   // noop
	// }

	// render() {
	//   // noop
	// }

}

// KarmaFieldsAlpha.field.tinymce.linkForm = class extends KarmaFieldsAlpha.field.tinymce.form {
// 	constructor(resource) {
// 		super({
// 			key: "linkform",
// 			children: [
// 				{
// 					type: "group",
// 					children: [
// 						{
// 							type: "group",
// 							display: "flex",
// 							children: [
// 								// {
// 								// 	type: "input",
// 								// 	key: "href",
// 								// 	style: "flex-grow:1"
// 								// },
// 								"href",
// 								"attachFile"
// 								// {
// 								// 	type: "button",
// 								// 	dashicon: "paperclip",
// 								// 	request: ["attachfile"]
// 								// }
// 							]
// 						},
// 						// {
// 						// 	type: "checkbox",
// 						// 	key: "target",
// 						// 	text: "Open in new tab"
// 						// },
// 						"target",
// 						{
// 							type: "group",
// 							display: "flex",
// 							children: [
// 								"cancel",
// 								"unlink",
// 								// {
// 								// 	type: "button",
// 								// 	text: "Cancel",
// 								// 	action: "close"
// 								// },
// 								// {
// 								// 	type: "button",
// 								// 	text: "Unlink",
// 								// 	action: "unlink",
// 								// 	disabled: ["!", ["getValue", "href"]]
// 								// },
// 								// {
// 								// 	type: "separator"
// 								// },
// 								"separator",
// 								// {
// 								// 	type: "button",
// 								// 	text: "Apply",
// 								// 	action: "submit"
// 								// },
// 								"submit"
// 							]
// 						}
// 					]
// 				}
// 			],
// 			...resource
// 		});
// 	}
//
// 	// attachfile() {
// 	//
// 	// 	const table = KarmaFieldsAlpha.mediasTable || "medias";
// 	//
// 	// 	const selection = this.getSelection() || {};
// 	// 	selection.final = true;
// 	//
// 	// 	this.parent.request("fetch", table);
// 	//
// 	// }
//
// 	// useSocket() {
// 	// 	return new KarmaFieldsAlpha.Content(true);
// 	// }
// 	//
// 	// getDriver() {
// 	//
//   //   return this.resource.driver || "medias";
// 	//
//   // }
// 	//
// 	// getTable() {
// 	//
//   //   return this.parse(this.resource.table || "medias");
// 	//
//   // }
// 	//
//   // getParams() {
// 	//
//   //   return this.parse(this.resource.params);
// 	//
//   // }
// 	//
// 	// attachfile() {
// 	//
// 	// 	// const table = KarmaFieldsAlpha.mediasTable || "medias";
// 	// 	//
// 	// 	// const selection = this.getSelection() || {};
// 	// 	// selection.final = true;
// 	// 	//
// 	// 	// this.parent.request("fetch", table);
// 	//
// 	//
// 	//
// 	// 	const table = this.getTable();
//   //   const params = this.getParams();
// 	//
//   //   if (table.loading || params.loading) {
// 	//
//   //     this.addTask(() => this.edit(), "attach-file");
// 	//
//   //   } else {
// 	//
// 	// 		this.save("attach-file", "Attach File");
// 	//
// 	// 		this.setFocus(false);
// 	// 		this.request("open", table.toString(), params.toObject(), false);
// 	//
// 	// 		// this.addTask(() => this.request("dispatch", "selectByIds", ids), "pre-select");
// 	//
//   //   }
// 	//
// 	// }
// 	//
// 	// //
// 	// // insert(ids) {
// 	// //
// 	// // 	if (ids.length) {
// 	// //
// 	// // 		this.setValue(ids[0], "attachment");
// 	// //
// 	// // 	}
// 	// //
// 	// // }
// 	//
// 	// insert(ids) {
// 	//
// 	// 	if (ids.length) {
// 	//
// 	// 		const driver = this.getDriver();
// 	//
// 	// 		const filename = new KarmaFieldsAlpha.Content.Value(driver, ids[0], "filename");
// 	// 		const dir = new KarmaFieldsAlpha.Content.Value(driver, ids[0], "dir");
// 	//
// 	// 		if (filename.loading || dir.loading) {
// 	//
// 	// 			this.addTask(() => this.edit(), "insert-file");
// 	//
// 	// 		} else {
// 	//
// 	// 			const href = new KarmaFieldsAlpha.Content();
// 	//
// 	// 			href.value = KarmaFieldsAlpha.uploadURL+dir.toString()+"/"+filename.toString();
// 	//
// 	// 			this.setContent(href, "href");
// 	//
// 	// 		}
// 	//
// 	//
// 	//
// 	// 	}
// 	//
// 	// }
// 	//
// 	// getValue(key) {
// 	//
// 	// 	if (key === "href") {
// 	//
// 	// 		const attachmentId = KarmaFieldsAlpha.Type.toString(super.getValue("attachment"));
// 	//
// 	// 		if (attachmentId) {
// 	//
// 	// 			// const file = KarmaFieldsAlpha.field.files.prototype.getFile.call(this, attachmentId);
// 	// 			const file = this.getFile(attachmentId);
// 	//
// 	//
// 	//
// 	// 			if (file) {
// 	//
// 	// 				this.setValue(file, "href"); // ????
// 	//
// 	// 				return [file];
// 	//
// 	// 			}
// 	//
// 	// 		}
// 	//
// 	// 	}
// 	//
// 	// 	return super.getValue(key);
// 	// }
// 	//
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
//
//
// KarmaFieldsAlpha.field.tinymce.linkForm.href = class extends KarmaFieldsAlpha.field.input {
//
// 	constructor(resource) {
//
// 		super({
// 			key: "href",
// 			style: "flex-grow:1",
// 			...resource
// 		});
//
// 	}
//
// }
//
// KarmaFieldsAlpha.field.tinymce.linkForm.target = class extends KarmaFieldsAlpha.field.checkbox {
//
// 	constructor(resource) {
//
// 		super({
// 			key: "target",
// 			text: "Open in new tab",
// 			...resource
// 		});
//
// 	}
//
// }

KarmaFieldsAlpha.field.tinymce.linkForm = class extends KarmaFieldsAlpha.field.tinymce.form {
	constructor(resource) {
		super({
			key: "linkform",
			selector: "a",
			children: [
				"linkFormInput",
				"target",
				"linkFormFooter"
			],
			...resource
		});
	}

}

KarmaFieldsAlpha.field.tinymce.linkFormInput = class extends KarmaFieldsAlpha.field.group {
	constructor(resource) {
		super({
			display: "flex",
			children: [
				"href",
				"attachFile"
			],
			...resource
		});
	}

}

KarmaFieldsAlpha.field.tinymce.linkFormFooter = class extends KarmaFieldsAlpha.field.group {
	constructor(resource) {
		super({
			display: "flex",
			children: [
				"cancel",
				"unlink",
				"separator",
				"submit"
			],
			...resource
		});
	}

}




KarmaFieldsAlpha.field.tinymce.linkForm.href = class extends KarmaFieldsAlpha.field.input {

	constructor(resource) {

		super({
			key: "href",
			style: "flex-grow:1",
			...resource
		});

	}

}

KarmaFieldsAlpha.field.tinymce.linkForm.target = class extends KarmaFieldsAlpha.field.checkbox {

	constructor(resource) {

		super({
			key: "target",
			text: "Open in new tab",
			...resource
		});

	}

}

KarmaFieldsAlpha.field.tinymce.linkForm.cancel = class extends KarmaFieldsAlpha.field.button {

	constructor(resource) {

		super({
			text: "Cancel",
			request: ["close"],
			...resource
		});

	}

}

KarmaFieldsAlpha.field.tinymce.linkForm.unlink = class extends KarmaFieldsAlpha.field.button {

	constructor(resource) {

		super({
			text: "Unlink",
			request: ["unlink"],
			// disabled: ["!", ["getValue", "href"]],
			...resource
		});

	}

}
KarmaFieldsAlpha.field.tinymce.linkForm.submit = class extends KarmaFieldsAlpha.field.button {

	constructor(resource) {

		super({
				text: "Apply",
				request: ["submit"],
				primary: true,
			...resource
		});

	}

}




KarmaFieldsAlpha.field.tinymce.linkForm.attachFile = class extends KarmaFieldsAlpha.field.button {

	constructor(resource) {

		super({
			dashicon: "paperclip",
			request: ["attachfile"],
			...resource
		});

	}

	useSocket() {
		return new KarmaFieldsAlpha.Content(true);
	}

	getDriver() {

    return this.resource.driver || "medias";

  }

	getTable() {

    return this.parse(this.resource.table || "medias");

  }

  getParams() {

    return this.parse(this.resource.params);

  }

	attachfile() {

		const table = this.getTable();
    const params = this.getParams();

    if (table.loading || params.loading) {

      this.addTask(() => this.edit(), "attach-file");

    } else {

			this.save("attach-file", "Attach File");

			this.setFocus(false);
			this.request("open", table.toString(), params.toObject(), false);

			// this.addTask(() => this.request("dispatch", "selectByIds", ids), "pre-select");

    }

	}

	insert(ids) {

		if (ids.length) {

			const driver = this.getDriver();

			const filename = new KarmaFieldsAlpha.Content.Value(driver, ids[0], "filename");
			const dir = new KarmaFieldsAlpha.Content.Value(driver, ids[0], "dir");

			if (filename.loading || dir.loading) {

				this.addTask(() => this.edit(), "insert-file");

			} else {

				const href = new KarmaFieldsAlpha.Content();

				href.value = KarmaFieldsAlpha.uploadURL+dir.toString()+"/"+filename.toString();

				this.parent.setContent(href, "href");

			}

		}

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

	// static clearInstances() {
	//
	// 	if (this.map) {
	//
	// 		this.map.forEach(instance => void instance.destroy());
	//
	// 		this.map.clear();
	//
	// 	}
	//
	// }
	//
	// static getInstance(container) {
	//
	// 	if (!this.map) {
	//
	// 		this.map = new Map();
	//
	// 	}
	//
	// 	if (!this.map.has(container)) {
	//
	// 		this.map.set(container, new this());
	//
	// 	}
	//
	// 	return this.map.get(container);
	//
	// }

	static get(container) {

		if (this.map && this.map.has(container)) {

			return this.map.get(container);

		}

	}

	static set(editor, container) {

		if (!this.map) {

			this.map = new Map();

		}

		this.map.set(container, editor);

	}


	constructor() {

		// super();

		this.loading = true;

		// this.editor = KarmaFieldsAlpha.loading;

	}

	init(element, container, params = {}) {
		// console.log("init", element, this);

		this.editor = KarmaFieldsAlpha.tinymce.get(container);

		if (this.editor) {

			this.loading = false;

		} else {

			let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.container === container);

			if (task) {

				if (element) {

					task.element = element;

				}

			} else {

				KarmaFieldsAlpha.Store.Tasks.add({
					type: "editor",
					element: element,
					container: container,
					params: params,
					resolve: async task => {

						if (!task.element) {
							console.error("Element not set!");
						}

						const editor = await this.create(task.element, task.params);
						this.editor = editor;
						this.loading = false;
						KarmaFieldsAlpha.tinymce.set(this.editor, task.container);
					}
				});

			}

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
      ...params
		});

		const onEdit = () => {

			const node = editor.selection.getNode();
			const a = node.closest("a");

			if (a) {

				const range = new Range();
				range.selectNode(a);

				if (this.onUpdateSelection) {

					this.onUpdateSelection({
						linkForm: true,
						startPath: KarmaFieldsAlpha.field.tinymce.getPath(element, range.startContainer),
						startOffset: range.startOffset,
						endPath: KarmaFieldsAlpha.field.tinymce.getPath(element, range.endContainer),
						endOffset: range.endOffset
					});

				}

				// editor.selection.setRng(range); -> removed because it makes it impossible to edit link text

			} else if (node.matches("img")) {


			} else {

				if (this.onUpdateSelection) {

					this.onUpdateSelection({});

				}

			}

		}

		// unactivate history
		editor.on("BeforeAddUndo", event => {
			event.preventDefault();
		});

		editor.on("input", event => {
			if (this.onUpdateContent) {
				const content = editor.getContent();
				this.onUpdateContent(content, "input");
			}
		});
		editor.on("paste", event => {
			if (this.onUpdateContent) {
				const content = editor.getContent();
				this.onUpdateContent(content, "paste");
			}
		});
		editor.on("cut", event => {
			if (this.onUpdateContent) {
				const content = editor.getContent();
				this.onUpdateContent(content, "paste");
			}
		});

		// -> input event does not seem to capture line break (single or double) or delete line break !
		editor.on("keyup", event => {
			if ((event.key === "Backspace" || event.key === "Enter" || event.key === "Meta") && this.onUpdateContent) {
				const content = editor.getContent();
				this.onUpdateContent(content, "delete");

			}

			if ((event.key === "Enter" || event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowRight") && this.onRender) { // event.key = " " do weird things

				// onEdit();

				this.onRender();

			}

		});

		editor.on("focus", event => {
			if (this.onUpdateSelection) {
				this.onUpdateSelection({});
			}
		});

		editor.on("click", event => {

			if (this.onRender) {

				this.onRender();

			}


			// onEdit();

			// const node = editor.selection.getNode();
			// const a = node.closest("a");
			//
			// if (a) {
			//
			// 	const range = new Range();
			// 	range.selectNode(a);
			//
			// 	if (this.onUpdateSelection) {
			//
			// 		this.onUpdateSelection({
			// 			linkForm: true,
			// 			startPath: KarmaFieldsAlpha.field.tinymce.getPath(element, range.startContainer),
			// 			startOffset: range.startOffset,
			// 			endPath: KarmaFieldsAlpha.field.tinymce.getPath(element, range.endContainer),
			// 			endOffset: range.endOffset
			// 		});
			//
			// 	}
			//
			// 	// editor.selection.setRng(range); -> removed because it makes it impossible to edit link text
			//
			// } else if (node.matches("img")) {
			//
			//
			// } else {
			//
			// 	if (this.onUpdateSelection) {
			//
			// 		this.onUpdateSelection({final: true});
			//
			// 	}
			//
			// }

		});

		editor.on("dblclick", event => {
			const node = editor.selection.getNode();
			if (node.matches("img") || node.matches("figure")) {
				if (this.onFetchImage) {
					this.onFetchImage()
				}
			}
		});

		editor.on("ObjectResized", event => {
			if (this.onUpdateContent) {
				const content = editor.getContent();
				this.onUpdateContent(content, "paste");
			}
		});

		// this.editor = editor;
		//
		// // this.value = editor;
		//
		// this.loading = false;

		return editor;

	}

	destroy() {

		if (!this.loading) {

			this.editor.destroy();

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
