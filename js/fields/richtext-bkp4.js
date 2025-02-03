
KarmaFieldsAlpha.ranges = {};
KarmaFieldsAlpha.editors = {};

document.addEventListener("selectionchange", event => {

	const selection = document.getSelection();

	for (let uid in KarmaFieldsAlpha.editors) {

		const editor = KarmaFieldsAlpha.editors[uid];

		if (editor.element === document.activeElement) {

			if (selection.rangeCount > 0) {

				const range = selection.getRangeAt(0);
				const pathes = editor.getPathesAt(range);

				KarmaFieldsAlpha.server.setState(pathes, "fields", uid, "rangePath");

				editor.update(range);

				if (editor.onSelectionChange) {

					editor.onSelectionChange();

				}

			}

		}

	}
});

KarmaFieldsAlpha.field.richtext = class extends KarmaFieldsAlpha.field.input {


	// constructor(resource, id, parent) {
	//
  //   super(resource, id, parent);
	//
  //   console.log("richtext", id, parent);
	//
  // }

	// compareRange(range1, range2) {
	//
	// 	return range1.startContainer === range2.startContainer && range1.startOffset === range2.startOffset && range1.endContainer !== range2.endContainer && range1.endOffset !== range2.endOffset;
	//
	// }

	// getRange() {
	//
	// 	return KarmaFieldsAlpha.ranges[this.uid];
	// }

	captureRange() {

		// CSS.highlights.clear();
		//
		// const selection = document.getSelection();
		//
		// const editorContainer = this.getEditorContainer();
		//
		// if (editorContainer && editorContainer.contains(selection.focusNode)) {
		//
		// 	// this.range = selection.getRangeAt(0);
		//
		// 	KarmaFieldsAlpha.ranges[this.uid] = selection.getRangeAt(0);
		//
		// }

	}

	getCurrentRange() {

		const selection = document.getSelection();

		if (selection.rangeCount > 0) {

			return selection.getRangeAt(0);

		} else {

			const range = new Range();
			selection.addRange(range);

			return range;

		}

	}

	getRange() {

		const editor = this.getEditor();
		const rangePath = this.getState("rangePath");

		if (editor && rangePath) {

			return editor.getRangeFromPathes(rangePath);

		}

	}

	setRange(range) {

		const selection = document.getSelection();

		selection.removeAllRanges();

		selection.addRange(range);

	}

	async setSelectionState(range) {

		CSS.highlights.clear();

		// const selection = document.getSelection();
		// let range = selection.rangeCount > 0 && selection.getRangeAt(0);
		// if (!range) {
		//
		// 	range = new
		//
		// }
		// let range = this.getCurrentRange();


		const editor = this.getEditor();

		if (editor && range && editor.contains(range)) {

			const rangePath = editor.getPathesAt(range);

			await this.setState(rangePath, "rangePath");

		} else {

			await this.setState([], "rangePath");

		}

	}

	isRangeCollapsed() {

		// const range = this.getRange();

		const rangePath = this.getState("rangePath");

		if (rangePath) {

			return rangePath.length === 1;

		}

		return false;

		// console.log(rangePath);
		//
		// if (range) {
		//
		//
		//
		// 	return range.collapsed;
		//
		// }
		//
		// return false;

	}

	async abduct() {

		if (this.container) {

			this.content = this.getContent();

			if (this.content.mixed) {

				this.mode = "mixed";

			} else {

				this.mode = this.getState("mode") || "edit";

			}

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

		// this.editor = null;

		return this.loop();

	}

	// getEditorContainer() {
	//
	// 	return KarmaFieldsAlpha.editors[this.uid];
	//
	// }

	setEditor(editor) {

		KarmaFieldsAlpha.editors[this.uid] = editor;
	}

  getEditor() {

		return KarmaFieldsAlpha.editors[this.uid];


		// return this.editor;
		//
		//
		//
		// const container = this.getEditorContainer();
		//
		// if (container) {
		//
		// 	return new KarmaFieldsAlpha.Editor(container);
		//
		// }

  }

	async saveEditorContent(tag, editor = this.getEditor(), range = null) {

		await this.save(tag, tag);

		// if (range) {
		//
		// 	this.setRange(range);
		// 	await this.setSelectionState(range);
		//
		// }

		const text = editor.getContent();
		await this.setValue(text);
		// await this.setFocus();

	}

	// getEditorContent() {
	//
	// 	const editor = this.getEditor();
	//
	// 	if (editor) {
	//
	// 		return editor.getContent();
	//
	// 	}
	//
	// 	return "";
	//
	// 	// const container = this.getEditorContainer();
	// 	//
	// 	// if (container) {
	// 	//
	// 	// 	let value = container.innerHTML.normalize();
	// 	//
	// 	// 	return value;
	// 	//
	// 	// }
	//
	// }

	async toggleBold() {

		// const range = this.getRange();
		// const editor = this.getEditor();
		//
		// if (range && editor && editor.contains(range)) {
		//
		// 	editor.toggleBoldAt(range);
		//
		// 	await this.saveEditorContent("bold", editor, range);
		//
		// 	await this.parent.render();
		//
		// }


		const editor = this.getEditor();

		if (editor) {

			// editor.toggleBoldAt(range);

			const nodes = editor.nodes.filter(node => node.tagName === "B" || node.tagName === "STRONG");

			if (nodes.length) {

				for (let node of nodes) {

					editor.unwrapNode(node);

					// const range =
					//
					// this.setRange(range);

				}

			} else {

				editor.wrapInlineAt(editor.range, "b");

			}

			await this.saveEditorContent("bold", editor, editor.range);

			await this.parent.render();

		}

  }

  isBold() {

		// const range = this.getRange();
		// const editor = this.getEditor();
		//
		// if (range && editor && editor.contains(range)) {
		//
		// 	return editor.isBoldAt(range);
		//
		// }
		//
    // return false;

		const editor = this.getEditor();

		if (editor) {

			return editor.nodes.some(node => node.tagName === "B" || node.tagName === "STRONG");

		}

    return false;

  }

	async toggleItalic() {

		// const range = this.getRange();
		// const editor = this.getEditor();
		//
		// if (range && editor && editor.contains(range)) {
		//
		// 	editor.toggleItalicAt(range);
		//
		// 	// const nodes = [...editor.getNodesAt(range, node => node.tagName === "I" || node.tagName === "EM")];
		// 	//
		// 	// if (nodes.length) {
		// 	//
		// 	// 	for (let node of nodes) {
		// 	//
		// 	// 		editor.unwrapNode(node);
		// 	//
		// 	// 	}
		// 	//
		// 	// } else {
		// 	//
		// 	// 	editor.wrapAt(range, "i");
		// 	//
		// 	// }
		//
		// 	await this.saveEditorContent("italic", editor, range);
		//
		// 	// await this.save("italic", "italic");
		// 	// await this.setSelectionState(range);
		// 	// const text = editor.getContent();
		// 	// await this.setValue(text);
		// 	await this.parent.render();
		//
		// }

		const editor = this.getEditor();

		if (editor) {

			// editor.toggleItalicAt(range);

			const nodes = editor.nodes.filter(node => node.tagName === "I" || node.tagName === "EM");

			if (nodes.length) {

				for (let node of nodes) {

					editor.unwrapNode(node);

					// const range =
					//
					// this.setRange(range);

				}

			} else {

				editor.wrapAt(range, "i");

			}

			await this.saveEditorContent("italic", editor); //, editor.range);

			await this.parent.render();

		}


  }

  isItalic() {

		// const range = this.getRange();
		// const editor = this.getEditor();
		//
		// if (range && editor && editor.contains(range)) {
		//
		// 	return editor.isItalicAt(range);
		//
		// 	// const result = editor.getNodesAt(range, node => node.tagName === "I" || node.tagName === "EM").next();
		// 	//
		// 	// return !result.done;
		//
		// }
		//
    // return false;

		const editor = this.getEditor();

		if (editor) {

			return editor.nodes.some(node => node.tagName === "I" || node.tagName === "EM");

		}

    return false;

  }

  queryCommand(key) {

		console.error("deprecated");

		const response = new KarmaFieldsAlpha.Content();

		response.value = document.queryCommandState(key); // || this.hasParentTag(element, 'B') || this.hasParentTag(element, 'STRONG');

		return response;
  }


	getEditorNode(...tags) {

		console.error("deprecated");

		const editor = this.getEditor();
		const range = this.getRange();


		if (editor && range && editor.contains(range)) {

			return editor.getNodeByTags(range, ...tags);

		}

  }

  async execCommand(key) {

		console.error("deprecated");

		document.execCommand(key);

  }

	getTag(...tags) {

		console.error("deprecated");

		return this.getEditorNode(...tags);

	}

	getNodes(...tags) {

		console.error("deprecated");

		return this.getEditorNode(...tags);

	}

	queryNode(...tags) {

		console.error("deprecated");

		const response = new KarmaFieldsAlpha.Content();

		const editor = this.getEditor();
		const range = this.getRange();

		if (editor && range && editor.contains(range)) {

			response.value = editor.getNodeByTags(range, ...tags);

		}

		return response;
	}

	async execNode(...tags) {

		console.error("deprecated");

		const editor = this.getEditor();
		const range = this.getRange();

		if (editor && range && editor.contains(range)) {

			// editor.toggleNodeByTag(range, ...tags);


			let node = editor.getNodeByTags(range, ...tags);

			if (node) {

				editor.unwrapNode(node);

			} else {

				editor.wrapAt(range, tags[0]);

			}

			await this.save("heading", "heading");
			const text = editor.getContent();
			await this.setValue(text);
			await this.parent.render();

		}

  }


	hasHeading() {

		// const range = this.getRange();
		// const editor = this.getEditor();
		//
		// if (range && editor && editor.contains(range)) {
		//
		// 	return editor.isHeadingAt(range);
		//
		// }
		//
    // return false;

		const editor = this.getEditor();

		if (editor) {

			return editor.nodes.some(node => editor.isHeading(node));

		}

    return false;

	}

	async execHeading() {

		// const editor = this.getEditor();
		// const range = this.getRange();
		//
		// if (editor && range) {
		//
		// 	editor.toggleHeading(range, this.resource.defaultHeading || "h1");
		//
		// 	await this.saveEditorContent("heading", editor, range);
		// 	await this.parent.render();
		//
		// }

		const editor = this.getEditor();

		if (editor) {

			let nodes = editor.nodes.filter(node => editor.isHeading(node));

			if (nodes.length) {

	      for (let node of nodes) {

	        const range = editor.updateNode(node, "p");

					this.setRange(range);

	      }

	      // range.setStartBefore(nodes[0]);
	      // range.setEndAfter(nodes[nodes.length-1]);

	    } else if (!editor.range.collapsed) {

	      editor.wrapBlockAt(editor.range, this.resource.defaultHeading || "h1");

	    }

			// editor.toggleHeading(range, this.resource.defaultHeading || "h1");

			await this.saveEditorContent("heading", editor); //, editor.range);
			await this.parent.render();

		}


	}

	isList(listTag = "ul") {

		// const range = this.getRange();
		// const editor = this.getEditor();
		//
		// if (range && editor && editor.contains(range)) {
		//
		// 	return editor.isListAt(range, listTag);
		//
		// }
		//
    // return false;

		const editor = this.getEditor();

		if (editor) {

			return editor.nodes.some(node => node.tagName === listTag.toUpperCase());

		}

    return false;

  }

  // queryUL() {
	//
	// 	const response = new KarmaFieldsAlpha.Content();
	//
	// 	response.value = document.queryCommandValue("InsertUnorderedList") === "true";
	//
	// 	return response;
  // }
	//
  // queryOL() {
	//
	// 	const response = new KarmaFieldsAlpha.Content();
	//
	// 	response.value = document.queryCommandValue("InsertOrderedList") === "true";
	//
	// 	return response;
  // }


  async execList(tagName) {

		// const editor = this.getEditor();
		// const range = this.getRange();
		//
		// if (editor && range) {
		//
		// 	editor.toggleList(range, tagName);
		//
		// 	// await this.save(tagName, tagName);
		// 	// await this.setSelectionState(range);
		// 	// const text = editor.getContent();
		// 	// await this.setValue(text);
		//
		// 	await this.saveEditorContent(tagName, editor, range);
		// 	await this.parent.render();
		//
		// }

		const editor = this.getEditor();

		if (editor) {

			// editor.toggleList(range, tagName);

			let listNodes = editor.nodes.filter(node => node.tagName === "UL" || node.tagName === "OL");

	    if (listNodes.length) {

	      if (listNodes[0].tagName === tagName.toUpperCase()) {

	        for (let node of listNodes) {

						editor.unwrapList(node);

	          // const paragraphs =
						//
	          // if (paragraphs.length) {
						//
	          //   range.setStartBefore(paragraphs[0]);
	          //   range.setEndAfter(paragraphs[paragraphs.length - 1]);
						//
	          // }

	        }

	      } else {

	        for (let node of listNodes) {

	          editor.updateNode(node, tagName);

	        }

	      }

	    } else {

	      editor.wrapListAt(editor.range, tagName);

	    }

			await this.saveEditorContent(tagName, editor); //, range);
			await this.parent.render();

		}

  }


  // getFormat() {
	//
	// 	const response = new KarmaFieldsAlpha.Content();
	//
	// 	response.value = document.queryCommandValue("FormatBlock");
	//
	// 	return response;
  // }
	//
  // async setFormat(value) {
	//
	// 	const editor = this.getEditor();
	//
	// 	if (editor) {
	//
	// 		document.execCommand("FormatBlock", false, value);
	//
	// 		const selection = document.getSelection();
	// 		this.range = selection.getRangeAt(0);
	//
	//
	// 		await this.save("format", "format");
	// 		// await this.setValue(text);
	// 		// await this.updateContent();
	// 		const text = this.getEditorContent();
	// 		await this.setValue(text);
	// 		await this.parent.render();
	//
	// 	}
	//
  // }



	async addImage() {

		const field = this.getChild("filesAttacher");

		if (field) {

			await field.edit();
			await this.render();

		}

	}

	async removeImage() {

		// const editor = this.getEditor();
		// const range = this.getRange();
		//
		// if (editor && range && editor.contains(range)) {
		//
		// 	const nodes = editor.getNodesAt(range).filter(node => node.tagName === "FIGURE");
		//
		// 	for (let node of nodes) {
		//
		// 		range.selectNode(node);
		// 		range.deleteContents();
		//
		// 	}
		//
		// 	// await this.save("remove-image", "remove-image");
		// 	// const text = editor.getContent();
		// 	// await this.setValue(text);
		//
		// 	await this.saveEditorContent("remove-image", editor, range);
		// 	await this.parent.render();
		//
		// }

		const editor = this.getEditor();

		if (editor) {

			const figures = editor.nodes.filter(node => node.tagName === "FIGURE");

			for (let figure of figures) {

				editor.removeNode(figure);

			}

			await this.saveEditorContent("remove-image", editor);
			await this.parent.render();

		}

	}



	getImages() {

		// const editor = this.getEditor();
		// const range = this.getRange();
		//
		// if (editor && range && editor.contains(range)) {
		//
		// 	return editor.getNodesAt(range).filter(node => node.tagName === "FIGURE");
		//
		// }
		//
		// return [];

		const editor = this.getEditor();

		if (editor) {

			return editor.nodes.filter(node => node.tagName === "FIGURE");

		}

		return [];

	}

	hasImage() {

		const editor = this.getEditor();

		if (editor) {

			return editor.nodes.some(node => node.tagName === "FIGURE");

		}

		return false;

	}

	async insertImage2(...imgs) {

		const editor = this.getEditor();

		if (editor) {

			const nodes = editor.nodes.filter(node => node.tagName === "FIGURE");

			if (nodes.length) {

				editor.selectNode(...nodes);

			}

			editor.insertContainerAt(editor.range, ...imgs);

			await this.saveEditorContent("insert-image", editor);
			await this.parent.render();

		}

	}

	// async click() { // = single click
	//
	// 	const range = this.getRange();
	// 	const editor = this.getEditor();
	//
	// 	if (range && editor) {
	//
	// 		const a = editor.getNodeByTags(range, "a");
	//
	// 		if (a) {
	//
	// 			const field = this.getChild("linkForm");
	//
	// 			field.setData({}, "data");
	//
	// 			await field.setFocus();
	//
	// 		}
	//
	// 		// const figure = editor.getNodeByTags(range, "figure");
	// 		//
	// 		// if (figure) {
	// 		//
	// 		// 	range.selectNode(figure);
	// 		//
	// 		// }
	//
	// 	}
	//
	// }

	// async dblclick() { // = double click
	//
	// 	const range = this.getRange();
	// 	const editor = this.getEditor();
	//
	// 	if (range && editor) {
	//
	// 		const figure = editor.getNodeByTags(range, "figure");
	//
	// 		if (figure) {
	//
	// 			range.selectNode(figure);
	//
	// 			const field = this.getChild("filesAttacher");
	//
	// 			await field.edit();
	// 			await this.render();
	//
	// 		}
	//
	// 	}
	//
	// }

	// async insertParagraph() {
	//
	// 	const editor = this.getEditorContainer();
	//
	// 	if (editor) {
	//
	// 		const selection = document.getSelection();
	//
	// 		this.range = selection.getRangeAt(0);
	//
	// 		while (this.range.startContainer !== editor) {
	//
	// 			this.range.setStartAfter(this.range.startContainer);
	//
	// 		}
	//
	// 		const paragraph = document.createElement("p");
	// 		paragraph.appendChild(document.createElement("br"));
	//
	// 		this.range.insertNode(paragraph);
	// 		this.range.setStart(paragraph, 0);
	// 		this.range.setEnd(paragraph, 0);
	//
	// 		//
	// 		// await this.setValue(text);
	// 		// await this.updateContent();
	// 		const text = this.getEditorContent();
	// 		await this.setValue(text);
	// 		await this.render();
	//
	// 	}
	//
	// }

	async insertMore() {

		// const editor = this.getEditorContainer();
		//
		// if (editor) {
		//
		//
		// 	document.execCommand("insertParagraph");
		// 	document.execCommand("insertHTML", false, "---");
		// 	document.execCommand("insertParagraph");
		//
		// 	const selection = document.getSelection();
		// 	this.range = selection.getRangeAt(0);
		//
		// }

		const editor = this.getEditor();
		// const range = this.getRange();

		if (editor) {

			const p = document.createElement("p");
			p.innerHTML = "---";
			editor.insertContainerAt(editor.range, p);

			// await this.save("more", "more");
			// // const text = this.getEditorContent();
			// const text = editor.getContent();
			// await this.setValue(text);

			await this.saveEditorContent("insert-more", editor);
			await this.parent.render();

		}

	}

	// async deleteNode(node) {
	//
	// 	const editor = this.getEditorContainer();
	//
	// 	if (editor) {
	//
	// 		if (!this.range) {
	//
	// 			const selection = document.getSelection();
	// 			this.range = selection.getRangeAt(0);
	//
	//
	// 		}
	//
	// 		this.range.selectNode(node);
	// 		this.range.deleteContents();
	//
	//
	// 		await this.save("delete");
	// 		// await this.setValue(text);
	// 		// await this.updateContent();
	// 		const text = this.getEditorContent();
	// 		await this.setValue(text);
	// 		await this.parent.render();
	//
	// 	}
	//
	// }

	getLinksUnder() {

		const editor = this.getEditor();

		if (editor && range && editor.contains(range)) {

			return editor.nodes.filter(node => node.tagName === "A");

		}

		return [];

	}

	isLink() {

		// const editor = this.getEditor();
		// const range = this.getRange();
		//
		// if (editor && range && editor.contains(range)) {
		//
		// 	// return editor.hasNodeAt(range, node => node.tagName === "A");
		//
		// 	return editor.isLinkAt(range);
		//
		// }
		//
		// return false;

		const editor = this.getEditor();

		if (editor) {

			return editor.nodes.some(node => node.tagName === "A");

		}

		return false;

  }

	async createLink() {

		const editor = this.getEditor();
		const range = this.getRange();

		// if (editor && range && editor.contains(range) && !range.collapsed) {
		if (editor && !editor.range.collapsed) {

			// Create a custom highlight for these ranges.
			const highlight = new Highlight(editor.range);

			// Register the ranges in the HighlightRegistry.
			CSS.highlights.set("richtext-highlight", highlight);

			const linkField = this.getChild("linkForm", 0, 0);

			await linkField.setFocus();

		}

		await this.render();

  }

	// async updateLink(href, target) {
	//
	// 	const editor = this.getEditor();
	// 	const range = this.getRange();
	//
	// 	if (editor && range && editor.contains(range)) {
	//
	// 		let node = editor.getNodeByTags(range, "a");
	//
	// 		if (node) {
	//
	// 			if (href) {
	//
	// 				editor.updateNodeParams(node, {href, target});
	//
	// 			} else {
	//
	// 				editor.unwrapNode(node);
	//
	// 			}
	//
	// 		} else if (!range.collapsed && href) {
	//
	// 			editor.wrapAt(range, "a", {href, target});
	//
	// 		}
	//
	// 	}
	//
	// }


	// async updateLink(params) {
	//
	// 	const editor = this.getEditor();
	// 	const range = this.getRange();
	//
	// 	if (editor && range && editor.contains(range)) {
	//
	// 		let node = editor.getLinkAt(range);
	//
	// 		if (node) {
	//
	// 			const href = node.getAttribute("href");
	// 			const target = node.getAttribute("target");
	//
	// 			editor.updateNode(node, null, {href, target, ...params});
	//
	// 			await this.saveEditorContent("link", editor); // not range!
	//
	// 		} else if (!range.collapsed && params.href) {
	//
	// 			editor.wrapInlineAt(range, "a", params);
	//
	// 			await this.saveEditorContent("link", editor); // not range!
	//
	// 			await this.setSelectionState(range); // do not cast setRange!
	//
	// 		}
	//
	// 		this.debounce(() => {
	// 			this.render();
	// 		}, 400);
	//
	// 	}
	//
	// }

	async updateLink(params) {

		const editor = this.getEditor();

		if (editor) {

			const links = editor.nodes.filter(node => node.tagName === "A");

			if (links.length) {

				for (let link of links) {

					const href = link.getAttribute("href");
					const target = link.getAttribute("target");

					editor.updateNode(link, null, {href, target, ...params});

				}

				await this.saveEditorContent("link", editor); // not range!

			} else if (editor.range && !editor.range.collapsed && params.href) {

				editor.wrapInlineAt(editor.range, "a", params);

				await this.saveEditorContent("link", editor); // not range!

				await this.setSelectionState(editor.range); // do not cast setRange!

			}

			this.debounce(() => {
				this.render();
			}, 400);

		}

	}

	// async insertLink(href, target) {
	//
	// 	const editor = this.getEditor();
	// 	const range = this.getRange();
	//
	// 	if (editor && range) {
	//
	// 		if (href) {
	//
	// 			editor.updateNodeByTag(range, "a", {href, target});
	//
	// 		} else {
	//
	// 			editor.unwrap(range, "a");
	//
	// 		}
	//
	// 		await this.save("link", "link");
	// 		// await this.setValue(text);
	// 		// await this.updateContent();
	// 		const text = editor.getContent();
	// 		await this.setValue(text);
	// 		await this.setFocus();
	// 		await this.parent.render();
	//
	// 	}
	//
	// }

	async unlink() {

		// const editor = this.getEditor();
		// const range = this.getRange();
		//
		// if (editor && range) {
		//
		// 	editor.unlinkAt(range);
		//
		// 	await this.saveEditorContent("unlink", editor, range);
		// 	await this.parent.render();
		//
		// }

		const editor = this.getEditor();

		if (editor) {

			// editor.unlinkAt(range);

			const links = editor.nodes.filter(node => node.tagName === "A");

	    for (let link of links) {

	      editor.unwrapNode(link);

	    }

			await this.saveEditorContent("unlink", editor, editor.range);
			await this.parent.render();

		}




	}


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

			case "id":
				return this.parent.getContent("id");

      case "format":
        return this.getFormat();

			case "formatHeading":
				const tag = this.getTag("h1", "h2", "h3", "h4", "h5", "h6");
				const content = new KarmaFieldsAlpha.Content();
				content.value = tag && tag.tagName.toLowerCase();
				return content;

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

			case "filename": {
				const content = new KarmaFieldsAlpha.Content();
				const range = this.getRange();
				const editor = this.getEditor();
				if (range && editor && editor.contains(range)) {
					const figure = editor.findNodeAt(range, node => node.tagName === "FIGURE");
					// const figure = figures.next().value;
					if (figure) {
						const img = figure.querySelector("img");
						if (img) {
							content.value = img.src;
						}
					}
				}
				return content;
			}
			case "heading": {
				const content = new KarmaFieldsAlpha.Content();
				const range = this.getRange();
				const editor = this.getEditor();
				if (range && editor && editor.contains(range)) {
					const heading = editor.getHeadingAt(range);
					// const headings = [...editor.getNodesAt(range, node => ["H1", "H2", "H3", "H4", "H5", "H6"].includes(node.tagName))];
					if (heading) {
						content.value = heading.tagName.toLowerCase();
					}
				}
				return content;
			}

			case "href":
			case "target": {
				const content = new KarmaFieldsAlpha.Content();
				// const range = this.getRange();
				// const editor = this.getEditor();
				// if (editor && range) {
				// 	const link = editor.getLinkAt(range);
				// 	if (link) {
				// 		content.value = link.getAttribute(key);
				// 	}
				// }
				const editor = this.getEditor();
				if (editor) {
					content.value = editor.nodes.filter(link => link.tagName === "A").map(link => link.getAttribute(key));
					if (content.value.slice(1).some(value => value !== content.value[0])) {
						content.mixed = true;
					}
				}
				return content;
			}


			case "raw":
				return this.parent.getContent(this.getKey());


      default:
        return super.getContent();

    }

  }

	async setValue(value, key) {

    switch (key) {

			case "heading": {
				const range = this.getRange();
				const editor = this.getEditor();
				if (range && editor && editor.contains(range)) {
					// let nodes = editor.getNodesAt(range, node => editor.isHeading(node));
					// for (let node of nodes) {
					// 	editor.updateNode(node, value);
					// }
					let heading = editor.getHeadingAt(range);
					if (heading) {
						editor.updateNode(heading, value);
					}
					// editor.insertHeading(range, value);

					await this.saveEditorContent("heading", editor); // not range!
					await this.setFocus();

					// await this.setSelectionState(range); // do not cast setRange!
					await this.render();

				}
				break;
			}
			case "href":
			case "target": {
				await this.updateLink({[key]: value});
				break;
			}

      case "format":
        await this.setFormat(value);
				break;

			case "formatHeading":
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


  // hasContentSelected() {
	//
	// 	const response = new KarmaFieldsAlpha.Content();
  //   const manager = this.getEditor();
	//
  //   if (manager.loading) {
	//
  //     response.loading = true;
	//
  //   } else {
	//
	// 		response.value = manager.editor.selection.getContent().length > 0;
	//
	// 	}
	//
	// 	return response;
  // }



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

	// async attachMedias() {
	//
	// 	// const field = this.getChild("imageForm");
	// 	const field = this.getChild("filesAttacher");
	//
	//
	// 	await field.edit();
	//
	// 	await field.setFocus();
	//
	// }


	newChild(type) {

		if (type === "linkForm") {

			return new KarmaFieldsAlpha.field.richtext.linkForm(this.resource.linkForm, "linkForm", this);

		} else if (type === "imageForm") {

			return new KarmaFieldsAlpha.field.richtext.imageForm({
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

			// this.createChild({
			// 	type: "filesAttacher"
			// }, "filesAttacher")

		} else if (type === "headingForm") {

			return new KarmaFieldsAlpha.field.richtext.headingForm({
				...this.resource.headingForm
			}, "headingForm", this);

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
					},
					...[...this.getFooterChildren()].map(child => child.build())
				]

			};

			// yield {
			// 	tag: "style",
			// 	update: node => {
			// 		while (node.element.sheet.rules.length > 0) {
			// 			node.element.sheet.deleteRule(0);
			// 		}
			// 		if (this.hasFocusInside()) {
			// 			if (this.elementUnder && this.elementUnder.matches("img")) {
			// 				const elementIndex = 0;
			// 				const images = node.element.nextElementSibling.querySelectorAll("img");
			// 				for (elementIndex; elementIndex < images.length; elementIndex++) {
			// 					if (images[elementIndex] === this.elementUnder) {
			// 						break;
			// 					}
			// 				}
			// 				node.element.sheet.insertRule(`.tinymce img:nth-of-type(${elementIndex+1}) {outline: 2px solid var(--theme-color);}`, node.element.sheet.rules.length);
			// 			}
			// 		}
			// 	}
			// };

			// yield {
			// 	class: "placeholder tinymce editor-body",
			// 	update: node => {
			// 		let content = this.getContent().toString();
			// 		const emptyContent = content === "" || content === "<p><br></p>";
			// 		let placeholder = this.getPlaceholder();
			//
			// 		node.element.classList.toggle("hidden", Boolean(!emptyContent || !placeholder));
			// 		node.element.innerHTML = placeholder.toString();
			// 	}
			// };

			yield {
				class: "tinymce editor-body",
				init: node => {
					// node.element.editable = true;
					node.element.setAttribute("contenteditable", true);
				},
				update: async node => {

					// this.<();

					// this.updateSelection(node.element);

					// const selection = document.getSelection();
					// this.range = selection && selection.rangeCount > 0 && selection.getRangeAt(0);

					let editor = this.getEditor();

					if (!editor) {

						editor = new KarmaFieldsAlpha.Editor(node.element);

						this.setEditor(editor);

					}

					editor.element = node.element;

					// KarmaFieldsAlpha.editors[this.uid] = node.element;



					// const editor = new KarmaFieldsAlpha.Editor(node.element);

					editor.onSelectionChange = () => {
						this.debounce(() => {
							this.render();
						}, 200);
					};



					let content = this.getContent();

					if (content.toString()) {

						node.element.classList.remove("placeholder");

					} else {

						content = this.getPlaceholder();

						if (content.toString()) {

							node.element.classList.add("placeholder");

						}

					}

					const hasFocus = this.hasFocus();

	        node.element.classList.toggle("loading", Boolean(content.loading));

	        if (!content.loading) {

						// this.editor = editor;

						// this.setEditor(editor);

						// input.element.placeholder = this.getPlaceholder().toString();
						node.element.classList.toggle("mixed", Boolean(content.mixed));

						node.element.classList.toggle("selected", Boolean(content.mixed && hasFocus));

	          if (content.mixed) {

	            node.element.value = "[mixed values]";
	            node.element.readOnly = true;

	          } else {

							if (this.resource.readonly) {

								node.element.readOnly = this.parse(this.resource.readonly).toBoolean();

							} else {

								node.element.readOnly = false;

							}

	            node.element.parentNode.classList.toggle("modified", Boolean(content.modified));

							if (hasFocus && document.activeElement !== node.element) {

								node.element.focus();

							}

							// const currentValue = editor.getContent();
							//
							// if (value !== currentValue) {
							//
							// 	let value = content.toString();
							//
							// 	editor.setContent(value);
							//
							// }

							// debugger;

							let newContent = content.toString();


							if (newContent) {

								let currentContent = editor.getContent();



								if (newContent !== currentContent) {

									const rangePath = this.getState("rangePath");

									editor.setContent(newContent, rangePath);

									newContent = editor.getContent();

									this.setValue(newContent);

								}

							} else {

								editor.reset();

							}








							// let value = content.toString();
							//
							// if (!value) {
							//
							// 	value = "<p><br></p>";
							//
							// }
							//
							// const currentValue = node.element.innerHTML;
							//
							// if (value !== currentValue) { // -> replacing same value still reset caret position
							//
							// 	node.element.innerHTML = value || "";
							//
							//
							//
							//
							//
							// 	const newValue = node.element.innerHTML;
							//
							// 	if (newValue !== value) {
							//
							// 		await this.setValue(newValue);
							//
							// 	}
							//
	            // }

	          }

					}

					node.element.oninput = async event => {

						// console.log("oninput");
						//
						// event.preventDefault();
						// event.stopPropagation();

						// this.captureRange();

						// const selection = document.getSelection();
						// this.range = selection.getRangeAt(0);
						//
						// if (this.range.startContainer) {
						//
						// 	let node = this.range.startContainer
						//
						// 	if (node.nodeType !== 1) {
						//
						// 		node = node.parentNode;
						//
						// 	}
						//
						// 	if (node.tagName === "DIV") {
						//
						// 		const p = document.createElement("p");
						//
						// 		while (node.hasChildNodes()) {
						//
						// 			p.appendChild(node.firstChild);
						//
						// 		}
						//
						// 		node.replaceWith(p);
						//
						// 		this.range.setStart(p, this.range.startIndex);
						// 		this.range.setEnd(p, this.range.startIndex);
						//
						// 	}
						//
						// }





						// const normalizedValue = node.element.innerHTML.normalize();
						// const normalizedValue = editor.getContent();

						// if (normalizedValue.length < content.toString().length) {
						//
						// 	await this.save(`${this.uid}-delete`, "Delete");
						//
						// 	console.log("save Delete");
						//
						// } else {
						//
						// 	await this.save(`${this.uid}-insert`, "Insert");
						//
						// 	console.log("save Insert");
						//
						// }

						// console.log("write", event);

						await this.saveEditorContent(event.inputType, editor);

						// await this.save("write", "Write");
						//
						// await this.setSelectionState();
						//
						// await this.setValue(normalizedValue);

						// this.debounce(() => {
						// 	this.request("render");
						// }, 40000000);


	        }



					node.element.onfocus = async event => {



						this.captureRange();

						await this.setFocus(content.mixed);

						await this.parent.render(); // update clipboard textarea, unselect other stuffs



						// document.onselectionchange = event => {
						//
						//
						//
						// 	// this.captureRange();
						//
						//
						// 	const selection = document.getSelection();
						//
						// 	if (node.element.contains(selection.anchorNode)) {
						//
						// 		const range = selection.getRangeAt(0);
						//
						// 		if (!KarmaFieldsAlpha.ranges[this.uid] || !this.compareRange(KarmaFieldsAlpha.ranges[this.uid], range)) {
						//
						// 			// this.range = range;
						// 			// this.rangeX = range;
						//
						// 			KarmaFieldsAlpha.ranges[this.uid] = range;
						//
						// 			console.log(range);
						//
						//
						// 			// console.log(range, event);
						//
						// 			// this.debounce(() => {
						// 			// 	this.request("render");
						// 			// }, 400);
						//
						// 		}
						//
						// 	}
						//
						//
						// }

					}

					node.element.oncut = async event => {

						event.preventDefault();

						const range = this.getCurrentRange();

						if (range && !range.collapsed) {

							// const editor = new KarmaFieldsAlpha.Editor(node.element);

							const html = editor.cut(range);

							event.clipboardData.setData("text/plain", html);
							event.clipboardData.setData("text/html", html);

							// const text = editor.getContent();
							//
							// await this.save("cut", "cut");
							// await this.setValue(text);

							await this.saveEditorContent("cut", editor, range);
							await this.parent.render();

						}

					}

					node.element.oncopy = async event => {

						event.preventDefault();

						// const selection = document.getSelection();
						// const range = selection.getRangeAt(0);

						const range = this.getCurrentRange();

						if (range && !range.collapsed) {

							// const editor = new KarmaFieldsAlpha.Editor(node.element);

							let html = editor.copy(range);


							// html = `<meta charset='utf-8'>${html}`;

							event.clipboardData.setData("text/plain", html);
							event.clipboardData.setData("text/html", html);


						}

					}


					node.element.onpaste = async event => {

						event.preventDefault();

						const range = this.getCurrentRange();

						if (range) {

							// const editor = new KarmaFieldsAlpha.Editor(node.element);

							// const html = event.clipboardData.getData("text/plain");
							const html = event.clipboardData.getData("text/html");
							const text = event.clipboardData.getData("text/plain");

							// console.log(text);


							editor.paste(range, html);

							// await this.save("paste", "paste");
							// const text = editor.getContent();
							// await this.setValue(text);
							// await this.parent.render();

							await this.saveEditorContent("paste", editor, range);
							await this.parent.render();

						}
						// const fragment = document.createDocumentFragment();
						// const container = document.createElement("div");
						// container.innerHTML = event.clipboardData.getData("text/html");
						//
						// const editor = new KarmaFieldsAlpha.Editor(node.element);
						//
						// editor.clean(container);

						// event.clipboardData.setData("text/html", container.innerHTML);




						// range.insertNode(container);

					}




					node.element.onkeyup =  async event => {

						return;

						// this.debounce(() => {
						// 	this.render();
						// }, 400);

						const range = this.getCurrentRange();

						await this.setSelectionState(range);

						console.log("keyup");

						await this.render();

					}


					node.element.onkeydown = async event => {

						if (event.key === "z" && event.metaKey) {

							event.preventDefault();
							if (event.shiftKey) {
							  KarmaFieldsAlpha.History.redo();
							} else {
							  KarmaFieldsAlpha.History.undo();
							}
							return;
						}

						if (event.key === "Backspace") {

							const range = this.getCurrentRange();

							if (editor.delete(range)) {

								event.preventDefault();

								await this.saveEditorContent("backspace", editor, range);

								this.debounce(() => {
									this.parent.render();
								}, 400);

							}

						}

						if (event.key === "Enter") {

							event.preventDefault();

							const range = this.getCurrentRange();

							editor.breakLine(range, event.shiftKey || event.altKey || event.ctrlKey || event.metaKey);

							await this.saveEditorContent("enter", editor, range);
							await this.parent.render();

	          }

					}



// 					node.element.onmousedown = event => {
//
// 						this.elementUnder = document.elementFromPoint(event.clientX, event.clientY);
//
//
// 						// const imgs = this.elementUnder.querySelectorAll("img");
// 						//
// 						// if (imgs) {
// 						// 	for (let img of imgs) {
// 						// 		const box = img.getBoundingClientRect();
// 						// 		const isInside = event.clientX > box.left && event.clientX <= box.left + box.width && event.clientY > box.top && event.clientY <= box.top + box.height;
// 						// 		if (isInside) {
// 						// 			const selection = window.getSelection();
// 						// 			selection.removeAllRanges();
// 						// 			this.range = document.createRange();
// 						// 			this.range.selectNode(this.elementUnder);
// 						// 			selection.addRange(this.range); // Restore th
// 						// 		}
// 						// 	}
// 						// }
// 						// console.log(imgs);
//
//
//
//
// return;
//
// 						if (this.elementUnder && this.elementUnder.matches("img")) {
//
// 							this.elementUnder.ondragstart = event => {
// 								event.preventDefault();
// 							}
//
// 							// this.elementUnder = this.elementUnder.closest(".tinymce figure") || this.elementUnder;
//
//
//
// 							const selection = window.getSelection();
// 							selection.removeAllRanges();
// 							this.range = document.createRange();
// 							this.range.selectNode(this.elementUnder);
// 							selection.addRange(this.range); // Restore the saved selection
// 							// selection.collapseToStart();
//
// 							// node.element.dispatchEvent(new Event("selectstart"));
//
//
//
// 						}
//
//
// 					}

					node.element.onmousedown = event => {

						return;

						const onmouseup =  event => {

							// console.log("mouseup");





							// setTimeout(() => {
								const range = this.getCurrentRange();

								this.setSelectionState(range);
								this.render();

							// }, 0);

							document.removeEventListener("mouseup", onmouseup);
						}

						document.addEventListener("mouseup", onmouseup);

					}

					// node.element.onmouseup = event => {
					//
					// 	// this.captureRange();
					//
					// 	// this.captureRange();
					// 	//
					// 	// console.log("captureRange");
					//
					// 	// const selection = document.getSelection();
					// 	//
					// 	// const range = selection.getRangeAt(0);
					// 	//
					// 	//
					// 	//
					// 	// if (range.startContainer && node.element.contains(range.startContainer)) {
					// 	//
					// 	// 	this.range = range;
					// 	//
					// 	// }
					//
					// }

					node.element.onclick = async event => {

						// const selection = document.getSelection();
						//
						// this.range = selection.getRangeAt(0);

						// console.log("onclick", this.range);

						// console.log(this.range.startContainer.tagName);
						//
						// this.elementUnder = document.elementFromPoint(event.clientX, event.clientY);
						//
						// if (this.elementUnder && this.elementUnder.matches("figure")) {
						//
						// 	const selection = window.getSelection();
						// 	selection.removeAllRanges();
						// 	this.range = document.createRange();
						// 	this.range.selectNodeContents(this.elementUnder);
						// 	selection.addRange(this.range); // Restore the saved selection
						//
						// 	// console.log("click", this.range);
						//
						// }



						// if (this.range.startContainer && this.range.startContainer.nodeType === 1 && this.range.startContainer.closest("a")) {
						// if (this.getLinkUnder()) {
						// // 	this.range.selectNodeContents(this.range.startContainer);
						// //
						// // }
						// //
						// // if (this.elementUnder && this.elementUnder.closest(".tinymce a")) {
						//
						// 	const field = this.getChild("linkForm");
						//
						// 	field.setData({}, "data");
						//
						// 	await field.setFocus();
						//
						// } else {
						//
						//
						// 	// let container = this.range.startContainer;
						// 	//
						// 	// if (container) {
						// 	//
						// 	// 	if (container.nodeType !== 1) {
						// 	//
						// 	// 		container = container.parentNode;
						// 	//
						// 	// 	}
						// 	//
						// 	// 	if (container.tagName === "FIGURE" || container.className === "more") {
						// 	//
						// 	// 		// this.range.selectNodeContents(this.range.startContainer);
						// 	// 		this.range.selectNodeContents(container);
						// 	//
						// 	// 	}
						// 	//
						// 	// }
						// 	//
						// 	// await this.setFocus();
						//
						// }

						// this.click();

						// this.captureRange();
						// const range = this.getRange();
						//
						// if (range) {
						//
						// 	const a = editor.getNodeByTags(range, "a");
						//
						// 	if (a) {
						//
						// 		event.preventDefault();
						//
						// 		const field = this.getChild("linkForm");
						//
						// 		field.setData({}, "data");
						//
						// 		await field.setFocus();
						//
						// 	}
						//
							// await this.render();
						//
						// }




					}

					node.element.ondblclick = async event => {

						// console.log(event);

						if (event.target.tagName === "IMG") {

							const field = this.getChild("filesAttacher");

							await field.edit();
							await this.render();

						}


						// const range = this.getCurrentRange();
						// // const editor = this.getEditor();
						//
						// if (range) {
						//
						// 	// const figure = editor.getNodeByTags(range, "figure");
						// 	const figures = this.getImages(range);
						//
						// 	if (figures.length) {
						//
						// 		range.selectNode(figures[0]);
						//
						// 		const field = this.getChild("filesAttacher");
						//
						// 		await field.edit();
						// 		await this.render();
						//
						// 	}
						//
						// }





					}

				}
			};

			if (false) {

				yield {
					class: "tinymce editor-footer",
					update: node => {
						const children = [...this.getFooterChildren()];
						node.children = children.map(child => child.build());
						// node.element.style.gridTemplateRows = children.map(inspector => inspector.isActive() ? "1fr" : 0).join(" ");
					}
				};

			}



			yield {
				children: [
					this.getChild("filesAttacher").build()
				]
			};

		}

	}

	*getFooterChildren() {

		const linkForm = this.getChild("linkForm");

		yield linkForm;

		yield this.getChild("imageForm");

		yield this.getChild("headingForm");

	}

	// *buildFooter() {
	//
	// 	const linkForm = this.getChild("linkForm");
	//
	// 	yield {
	// 		class: "inspector linkform-container",
	// 		children: [...linkForm.build()]
	// 	};
	//
	// }

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
				{id: "h1", name: "H1"},
				{id: "h2", name: "H2"},
				{id: "h3", name: "H3"},
				{id: "h4", name: "H4"},
				{id: "h5", name: "H5"},
				{id: "h6", name: "H6"}
				// {id: "p", name: "P"}
			],
			visible: ["request", "queryHeading"],
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
			// value: "bold",
			active: ["request", "hasHeading"],
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
			params: ["ul"],
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
			params: ["ol"],
			// active: ["request", "queryOL"],
			active: ["request", "isList", "OL"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.richtext.buttons.code = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.richtext.buttons.edit = class extends KarmaFieldsAlpha.field.button {
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

	build() {

		return {
			class: "inspector linkform-container",
			// children: [...this.getChild("linkForm").build()],
			update: node => {
				const isActive = this.isActive();
				node.element.classList.toggle("hidden", !isActive);
				if (isActive) {
					node.children = [super.build()]
				}
			}
			// children: [super.build()]
		};

	}

	isActive() {

		return this.hasFocusInside() || this.request("isLink") && this.parent.hasFocus();

	}

	async close() {

		// getLinksUnder
		const editor = this.parent.getEditor();

		const links = editor.nodes.filter(node => node.tagName === "A");

		if (links.length) {

			editor.range.setStartAfter(links[links.length-1]);
			editor.range.collapse(true);

		}

		await this.parent.setFocus();

		await this.render();

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
						{id: "h1", name: "H1"},
						{id: "h2", name: "H2"},
						{id: "h3", name: "H3"},
						{id: "h4", name: "H4"},
						{id: "h5", name: "H5"},
						{id: "h6", name: "H6"}
					]
				}
			],
			...resource
		}, id, parent);
	}

	build() {

		return {
			class: "inspector headingForm-container",
			update: node => {
				const isActive = this.isActive();
				node.element.classList.toggle("hidden", !isActive);
				if (isActive) {
					node.children = [super.build()]
				}
			}
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

	async insert(ids) {

		const filesAttacher = new KarmaFieldsAlpha.field.richtext.filesAttacher({}, "fileattacher", this);

		let request = filesAttacher.queryImage(ids[0]);

		while (request.loading) {

			await this.render();

			request = filesAttacher.queryImage(ids[0]);

		}

		const src = request.toObject().src || "";

		await this.parent.setValue(src, "href");
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

	// async insert(ids) {
	//
	// 	const imageForm = this.parent.getChild("imageForm");
	//
	// 	let request = imageForm.queryImage(ids[0]);
	//
	// 	while (request.loading) {
	//
	// 		await this.render();
	//
	// 		request = imageForm.queryImage(ids[0]);
	//
	// 	}
	//
	// 	// const html = imageForm.formatImage(request.toObject());
	// 	const img = imageForm.createImage({
	// 		id: ids[0],
	// 		styleWidth: "1024px",
	// 		styleHeight: "",
	// 		...request.toObject()
	// 	});
	//
	// 	this.parent.insertImage(img);
	//
	//
	// }

	getSelectedIds() { // extends Tags

		const selectedIds = [];

		// const figure = this.parent.getElementUnder();
		// const figure = this.parent.getEditorNode("figure");

		const figures = this.parent.getImages();

		for (let figure of figures) {

			const img = figure.querySelector("img");

			if (img) {

				const id = img.getAttribute("data-id");

				if (id) {

					selectedIds.push(id);

				}

			}

		}



		// if (figure && figure.nodeType === 1) {
		//
		// 	const img = figure.querySelector("img");
		//
		// 	if (img) {
		//
		// 		const id = img.getAttribute("data-id");
		//
		// 		if (id) {
		//
		// 			selectedIds.push(id);
		//
		// 		}
		//
		// 	}
		//
		// }

		return selectedIds;

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

	queryImage(id) {

		const response = new KarmaFieldsAlpha.Content({});

		let filename = this.getWild("medias", id, "filename");
		let dir = this.getWild("medias", id, "dir");
		let mimetype = this.getWild("medias", id, "mimetype");
		let width = this.getWild("medias", id, "width");
		let height = this.getWild("medias", id, "height");
		let caption = this.getWild("medias", id, "caption");
		let alt = this.getWild("medias", id, "alt");

		if (filename.loading || dir.loading || mimetype.loading || width.loading || height.loading || caption.loading || alt.loading) {

			response.loading = true;

		} else {

			response.value.id = id;
			response.value.width = width.toString();
			response.value.height = height.toString();
			response.value.caption = caption.toString();
			response.value.alt = alt.toString();

			response.value.src = `${KarmaFieldsAlpha.uploadURL}${dir.toString()}/${filename.toString()}`;

			if (mimetype.toString() === "image/jpeg" || mimetype.toString() === "image/jpg" || mimetype.toString() === "image/png" || mimetype.toString() === "image/webp") {

				let sizes = this.getWild("medias", id, "sizes");

				if (sizes.loading) {

					response.loading = true;

				} else {

					if (sizes.toArray().length) {

						response.value.srcset = sizes.toArray().map(size => `${KarmaFieldsAlpha.uploadURL}${dir.toString()}/${size.filename} ${size.width}w`).join(",");
						response.value.sizes = this.resource.sizes || "(min-width: 1024px) 1024px, 100vw";

					}

				}

			}

		}

		return response;

	}

	async insert(ids) {

		// this.parent.insertImageIds(ids);
		//
		// return;


		let requests = ids.map(id => this.queryImage(id));

		while (requests.some(request => request.loading)) {

			await this.render();
			requests = ids.map(id => this.queryImage(id));

		}

		const figures = this.parent.getImages();

		for (let i = 0; i < ids.length; i++) {

			const id = ids[i];

			let params = this.queryImage(id).toObject();

			// const figure = this.parent.getEditorNode("figure");

			if (figures[i]) {

				params.classes = figures[i].className;

			}

			const newImg = this.createImage(params);

			await this.parent.insertImage2(newImg);

		}




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
					width: "1fr"
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

	build() {

		return {
			class: "inspector imageform-container",
			// children: [...this.getChild("linkForm").build()],
			update: node => {
				const isActive = this.isActive();
				node.element.classList.toggle("hidden", !isActive);
				if (isActive) {
					node.children = [super.build()]
				}
			}
			// children: [super.build()]
		};

	}

	isActive() {

		return this.hasFocusInside() || this.request("getImages").length > 0 && this.parent.hasFocus();

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

	build() {

		return {
			children: [
				this.createChild({
					type: "button",
					action: "open",
					text: "Replace",
					// dashicon: "paperclip"
				}).build(),
				...this.buildPopup()
			]
		}

	}

	async open() {

		const id = this.parent.getContent("id");

		this.edit(id.toArray());

	}

	async insert(ids) {

		// this.parent.request("insert", ids);

		await this.parent.setValue(ids[0], "id");

		await this.render();

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
