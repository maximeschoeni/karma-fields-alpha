// https://github.com/tinymce/tinymce-dist/blob/master/tinymce.js

// /Applications/MAMP/htdocs/wordpress/wp-includes/js/tinymce/plugins/link/plugin.min.js



KarmaFieldsAlpha.field.squire = class extends KarmaFieldsAlpha.field.input {

	closestNode(element, callback) {

		if (element.nodeType !== 1) {

			element = element.parentNode;

		}

    while (element && this.richEditorContainer && this.richEditorContainer.contains(element)) {

			if (callback(element)) {

				return element;

			}

			element = element.parentElement;

    }

	}

	updateSelection(element) {

		const selection = window.getSelection();

		if (selection && element.contains(selection.anchorNode)) {

			this.selection = selection;

			if (this.selection.rangeCount) {

				this.range = this.selection.getRangeAt(0);

				console.log("updateSelection", this.range);

				this.node = this.selection.anchorNode;

				// console.log(this.range.text, this.selection.toString());

				if (this.node.nodeType !== 1) {

					this.node = this.node.parentNode;

				}


				// if (this.range.commonAncestorContainer.nodeType === 3) {
				//
				// 	this.node = this.range.commonAncestorContainer.parentNode;
				//
				// } else {
				//
				// 	this.node = this.range.commonAncestorContainer;
				//
				// }

			} else {

				this.range = null;
				this.node = null;

			}

		}



	}

	getElementUnder() {

		if (this.range) {

			return this.range.startContainer;

		}

	}

	// checkElementUnder(clientX, clientY) {
	//
	// 	const elementUnder = document.elementFromPoint(clientX, clientY);
	//
	// 	if (element.matches("img")) {
	//
	// 		this.elementUnder = elementUnder;
	//
	// 	} else {
	//
	// 		this.elementUnder = null;
	//
	// 	}
	//
	// }




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

		return this.loop();

	}

  getEditor() {

		// if (!this.editorManager) {
		//
		// 	this.editorManager = KarmaFieldsAlpha.field.tinymce.editors && KarmaFieldsAlpha.field.tinymce.editors[this.uid];
		//
		// 	if (!this.editorManager) {
		//
		// 		this.editorManager = new KarmaFieldsAlpha.tinymce();
		//
		// 		if (!KarmaFieldsAlpha.field.tinymce.editors) {
		//
		// 			KarmaFieldsAlpha.field.tinymce.editors = {};
		//
		// 		}
		//
		// 		KarmaFieldsAlpha.field.tinymce.editors[this.uid] = this.editorManager;
		//
		// 	}
		//
		// 	this.editorManager.onRender = () => this.render();
		// 	this.editorManager.onUpdate = () => this.updateContent();
		// 	this.editorManager.onFocus = () => this.setFocus(false);
		// 	this.editorManager.onClick = () => this.click();
		// 	this.editorManager.onDblClick = () => this.dblClick();
		//
		// 	// if (this.body) {
		// 	//
		// 	// 	this.editorManager.register(this.body);
		// 	//
		// 	// }
		//
		// }
		//
		// return this.editorManager;

  }

	// async updateContent() {
	//
	// 	const manager = this.getEditor();
	//
  //   if (!manager.loading) {
	//
	// 		const text = manager.editor.getContent();
	// 		await this.save("input");
	// 		await this.setValue(text);
	//
	// 		// if (!noRendering) {
	// 		//
	// 		// 	this.debounce(() => {
	// 		// 		this.parent.render();
	// 		// 	}, 400);
	// 		//
	// 		// }
	//
	// 		this.debounce(async () => {
	// 			const textModified = manager.editor.getContent();
	// 			if (textModified !== text) {
	// 				console.log("text modified !!!! why??");
	// 				await this.setValue(textModified);
	// 			}
	//
	// 			await this.parent.render();
	// 			// this.render();
	// 		}, 400);
	//
	//
	//
	// 	}
	//
	// }

	// async click() {
	//
	// 	const manager = this.getEditor();
	//
	// 	const hasFocus = this.hasFocusInside();
	//
	//
	// 	if (!manager.loading) {
	//
	// 		let node = manager.editor.selection.getNode();
	//
	// 		const link = node.closest(".tinymce a");
	// 		// const img = node.closest(".tinymce img");
	//
	// 		if (link) { // target node may be outside editor !!
	//
	// 			const field = this.getChild("linkForm");
	// 			await field.setFocus();
	//
	// 		}
	// 		// else if (img) {
	// 		//
	// 		// 	const field = this.getChild("filesAttacher");
	// 		// 	const id = img.getAttribute("data-id");
	// 		//
	// 		// 	await field.edit([id]);
	// 		//
	// 		// }
	// 		// else if (node && node.matches("figure,img") && manager.editor.getBody().contains(node)) { // target node may be outside editor !!
	// 		//
	// 		// 	// const field = this.getChild("imageForm");
	// 		// 	// await field.setFocus();
	// 		//
	// 		// }
	//
	// 	}
	//
	// }
	//
	// async dblClick() {
	//
	// 	const manager = this.getEditor();
	//
	// 	if (!manager.loading) {
	//
	// 		let node = manager.editor.selection.getNode();
	//
	// 		const img = node.closest(".tinymce img");
	//
	// 		if (img) {
	//
	// 			const field = this.getChild("filesAttacher");
	// 			const id = img.getAttribute("data-id");
	//
	// 			await field.edit([id]);
	//
	// 		}
	//
	// 	}
	//
	// }

	// async updateContent() {
	//
	// 	if (this.richEditorContainer) {
	//
	// 		let value = this.richEditorContainer.innerHTML.normalize();
	//
	// 		value.replace(/<p.*?><br.*?><\/p>$/, "");
	//
	// 		await this.setValue(value);
	//
	// 	}
	//
	// }

	getEditorContent() {

		if (this.richEditorContainer) {

			let value = this.richEditorContainer.innerHTML.normalize();

			// debugger;
			// const imageMatch = value.match(/\[\*(\d+?)\*\]/);
			//
			// if (imageMatch) {
			//
			// 	const id = imageMatch[1];
			// 	const field = this.getChild("filesAttacher");
			// 	const request = field.queryImage(id);
			//
			// 	if (!request.loading) {
			//
			// 		const newImg = field.createImage(request.toObject());
			// 		value = this.richEditorContainer.innerHTML.normalize();
			// 		const html = newImg.outerHTML;
			// 		value = value.replace(imageMatch[0], html);
			//
			// 	}
			//
			// }

			value.replace(/<p.*?><br.*?><\/p>$/, "");

			return value;

		}

	}


  queryCommand(key) {

		const response = new KarmaFieldsAlpha.Content();

		if (this.squire) {

			if (key === "bold") {

				response.value = this.squire.hasFormat("b");

			}

		}
		//
		//
		//
		// response.value = document.queryCommandState(key); // || this.hasParentTag(element, 'B') || this.hasParentTag(element, 'STRONG');

		return response;
  }

  async execCommand(key) {

		if (this.squire) {

			if (key === "bold") {

				if (this.squire.hasFormat("b")) {

					this.squire.removeBold()

				} else {

					this.squire.bold();

				}

			}

		}

		// if (this.richEditorContainer) {
		//
		// 	document.execCommand(key);
		//
		// 	// const value = this.richEditorContainer.innerHTML.normalize();
		//
		// 	await this.save(key, key);
		// 	// await this.updateContent();
		// 	const text = this.getEditorContent();
		// 	await this.setValue(text);
		// 	await this.parent.render();
		//
		// }

  }


	// getTag(...tags) {
	//
	// 	if (this.richEditorContainer) {
	//
	// 		if (!this.range) {
	//
	// 			const selection = document.getSelection();
	// 			this.range = selection && selection.getRangeAt(0);
	//
	// 		}
	//
	// 		if (this.range) {
	//
	// 			let node = this.range.startContainer;
	//
	// 			if (node && this.richEditorContainer.contains(node)) {
	//
	// 				if (node.nodeType === 1) {
	//
	// 					node = node.childNodes[this.range.startOffset];
	//
	// 				}
	//
	// 				if (node.nodeType !== 1) {
	//
	// 					node = node.parentNode;
	//
	// 				}
	//
	// 				while (node !== this.richEditorContainer) {
	//
	// 					if (node.matches(tags.join(","))) {
	//
	// 						return node;
	//
	// 					}
	//
	// 					node = node.parentNode;
	//
	// 				}
	//
	//
	// 				// const content = this.range.cloneContents();
	// 				//
	// 				// return content.querySelector(tags.join(","));
	//
	// 			}
	//
	//
	//
	//
	//
	// 		}
	//
	// 	}
	//
	// }

	getSelectedNode(...tags) {

		if (this.richEditorContainer) {

			if (!this.range) {

				const selection = document.getSelection();
				this.range = selection && selection.getRangeAt(0);

			}

			let node = this.range.commonAncestorContainer;

			if (node && this.richEditorContainer.contains(node)) {

				if (node.nodeType !== 1) {

					node = node.parentNode;

				}

				while (node !== this.richEditorContainer) {

					if (!tags.length || node.matches(tags.join(","))) {

						return node;

					}

					node = node.parentNode;

				}

			}

		}

	}

	getTag(...tags) {

		return this.getNodes(...tags)[0];

	}

	getNodes(...tags) {

		const selector = tags.join(",");

		const nodes = [];

		if (this.richEditorContainer) {

			if (!this.range) {

				const selection = document.getSelection();
				this.range = selection && selection.getRangeAt(0);

			}

			if (this.range) {

				let baseNode = this.range.commonAncestorContainer;
				let startNode = this.range.startContainer;
				let endNode = this.range.endContainer;

				if (baseNode && this.richEditorContainer.contains(baseNode)) {

					if (baseNode.nodeType === 1) {

						if (baseNode.matches(selector)) {

							nodes.push(baseNode);

						} else {

							if (startNode === baseNode) {

								startNode = baseNode.childNodes[this.range.startOffset];

							} else {

								while (startNode.parentNode !== baseNode) {

									startNode = startNode.parentNode;

								}

							}

							if (endNode === baseNode) {

								endNode = baseNode.childNodes[this.range.endOffset];

							} else {

								while (endNode && endNode.parentNode !== baseNode) {

									endNode = endNode.parentNode;

								}

							}

							if (!endNode) {

								endNode = startNode;

							}

							let child = baseNode.firstChild;

							while (child && child !== startNode) {

								child = child.nextSibling;

							}

							while (child && child !== endNode.nextSibling) {

								if (child.nodeType === 1 && child.matches(selector)) {

									nodes.push(child);

								}

								child = child.nextSibling;

							}

						}

					} else if (baseNode.parentNode.matches(selector)) {

						nodes.push(baseNode.parentNode);

					}

				}

			}

		}

		return nodes;
	}


	queryHeading() {

		const response = new KarmaFieldsAlpha.Content();

		const node = this.getTag("h1", "h2", "h3", "h4", "h5", "h6");

		// console.log(node);

		if (node) {

			response.value = node.tagName.toLowerCase();

		}



		// if (this.richEditorContainer && this.range) {
		//
		// 	let node = this.range.startContainer;
		//
		// 	if (node) {
		//
		// 		if (node.nodeType === 3) {
		//
		// 			node = node.parentNode;
		//
		// 		}
		//
		// 		while (node !== this.richEditorContainer) {
		//
		// 			if (node.tagName === "H1" || node.tagName === "H2" || node.tagName === "H3" || node.tagName === "H4" || node.tagName === "H5" || node.tagName === "H6") {
		//
		// 				response.value = node.parentNode;
		//
		// 			}
		//
		// 			node = node.parentNode;
		//
		// 		}
		//
		// 		if (response.value === undefined) {
		//
		// 			const content = this.range.cloneContents();
		//
		// 			node = content.querySelector("h1,h2,h3,h4,h5,h6");
		//
		// 			if (node) {
		//
		// 				response.value = node.tagName;
		//
		// 			}
		//
		// 		}
		//
		// 	}
		//
		// }

		return response;
	}

	async requestHeading() {

		// document.execCommand("FormatBlock", false, this.resource.defaultHeading || "h1");
		//
		// return;

		// if (this.richEditorContainer && this.range) {


			// const tag = this.getTag("h1", "h2", "h3", "h4", "h5", "h6");

			const node = this.getSelectedNode("h1", "h2", "h3", "h4", "h5", "h6");

			if (node) {

				// selection.removeAllRanges();
				// this.range.selectNode(node);
				// selection.addRange(this.range);

				document.execCommand("FormatBlock", false, "p");

			} else {

				document.execCommand("FormatBlock", false, this.resource.defaultHeading || "h1");

			}

			const selection = document.getSelection();
			this.range = selection.getRangeAt(0);

			// await this.save("heading", "heading");
			//
			// const text = this.getEditorContent();
			//
			// await this.setValue(text);
			// await this.parent.render();

		// }

	}

  queryUL() {

		const response = new KarmaFieldsAlpha.Content();

		response.value = document.queryCommandValue("InsertUnorderedList") === "true";

		return response;
  }

  queryOL() {

		const response = new KarmaFieldsAlpha.Content();

		response.value = document.queryCommandValue("InsertOrderedList") === "true";

		return response;
  }


  async execUL() {


		// const node = this.getSelectedNode();

		// if (this.richEditorContainer) {


		// document.execCommand("delete");

		// document.execCommand("insertParagraph");
		// document.execCommand("delete");

			document.execCommand('InsertUnorderedList');
			// document.execCommand("insertParagraph");
			// document.execCommand("removeFormat");



			// const value = this.richEditorContainer.innerHTML.normalize();

		// 	await this.save("ul", "ul");
		// 	// await this.updateContent();
		// 	// // await this.setValue(value);
		// 	const text = this.getEditorContent();
		// 	await this.setValue(text);
		// 	await this.parent.render();
		//
		// }

  }

  async execOL() {

		if (this.richEditorContainer) {

			document.execCommand('InsertOrderedList');
			document.execCommand("removeFormat");

			// const value = this.richEditorContainer.innerHTML.normalize();

			await this.save("ol", "ol");
			// await this.setValue(value);
			// await this.updateContent();
			const text = this.getEditorContent();
			await this.setValue(text);
			await this.parent.render();

		}

  }

  getFormat() {

		const response = new KarmaFieldsAlpha.Content();

		response.value = document.queryCommandValue("FormatBlock");

		// const closest = this.closestNode(this.node, element => element.matches("p,h1,h2,h3,h4,h5,h6"));
		//
		// response.value = closest && closest.tagName.toLowerCase() || "";

		return response;
  }

  async setFormat(value) {

		if (this.richEditorContainer) {

			document.execCommand("FormatBlock", false, value);

			const selection = document.getSelection();
			this.range = selection.getRangeAt(0);

			// const text = this.richEditorContainer.innerHTML.normalize();

			await this.save("format", "format");
			// await this.setValue(text);
			// await this.updateContent();
			const text = this.getEditorContent();
			await this.setValue(text);
			await this.parent.render();

		}

  }



	// async unlink() {
	//
	// 	if (this.richEditorContainer) {
	//
	// 		document.execCommand("unlink");
	//
	// 		const text = this.richEditorContainer.innerHTML.normalize();
	//
	// 		// or
	// 		// const text = document.activeElement.innerHTML.normalize();
	//
	//
	// 		await this.save("format", "format");
	// 		await this.setValue(text);
	// 		await this.setFocus();
	// 		await this.parent.render();
	//
	// 	}
	//
	// }

	// async insertImage(html) {
	//
	//   // let manager = this.getEditor();
	// 	//
	// 	// if (!manager.loading) {
	// 	//
	// 	// 	manager.editor.execCommand(
	// 	// 		'mceInsertContent',
	// 	// 		false,
	// 	// 		html
	// 	// 	);
	// 	//
	// 	// 	const text = manager.editor.getContent();
	// 	//
	// 	// 	await this.setValue(text);
	// 	//
	// 	// 	await this.setFocus();
	// 	//
	// 	// 	await this.render();
	// 	//
	// 	// }
	//
	// 	if (this.richEditorContainer) {
	//
	// 		document.execCommand("insertHTML", false, html);
	//
	// 		const text = this.richEditorContainer.innerHTML.normalize();
	//
	// 		// or
	// 		// const text = document.activeElement.innerHTML.normalize();
	//
	//
	// 		await this.save("format", "format");
	// 		await this.setValue(text);
	// 		await this.setFocus();
	// 		await this.parent.render();
	//
	// 	}
	//
	// }

	// async insertImage(img) {
	//
	// 	if (this.richEditorContainer) {
	//
	// 		if (this.range) {
	//
	// 			let node = this.range.startContainer;
	//
	// 			if (node.tagName === "FIGURE" || node.tagName === "P" && !node.textContent) {
	//
	// 				this.range.selectNode(this.range.startContainer);
	// 				this.range.deleteContents();
	//
	// 				node = this.range.startContainer;
	//
	// 			}
	//
	// 			if (node !== this.richEditorContainer) {
	// 			//
	// 			// 	this.range.insertNode(img);
	// 			//
	// 			// // } else if (node.tagName === "P" && !node.textContent) { // = empty paragraph
	// 			// //
	// 			// // 	// node.replaceWith(img);
	// 			// // 	this.range.selectNode(node);
	// 			// // 	this.range.deleteContents();
	// 			// // 	this.range.insertNode(img);
	// 			//
	// 			// } else {
	//
	// 				while (node.parentNode !== this.richEditorContainer) {
	//
	// 					node = node.parentNode;
	//
	// 				}
	//
	// 				this.range.setStartAfter(node);
	//
	//
	// 			}
	//
	// 			this.range.insertNode(img);
	//
	//
	//
	// 			// console.log(node.innerHTML, node.textContent);
	//
	//
	//
	// 			// console.log(this.range.commonAncestorContainer, this.range.startContainer, this.range.endContainer, this.range.startOffset, this.range.endOffset);
	//
	//
	// 			// this.range.surroundContents(img);
	//
	// 		}
	//
	// 		const text = this.richEditorContainer.innerHTML.normalize();
	//
	// 		// or
	// 		// const text = document.activeElement.innerHTML.normalize();
	//
	//
	// 		await this.save("format", "format");
	// 		await this.setValue(text);
	// 		await this.setFocus();
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

	getRange(container) {

		if (!this.range) {

			const selection = document.getSelection();

			if (selection.rangeCount > 0 && container.contains(selection.anchorNode)) {

				this.range = selection.getRangeAt(0);

				// console.log("getRange", this.range);

			} else {

				this.range.selectNodeContents(container);
				this.range.collapse(false);

			}

		}

		return this.range;
	}

	async insertImage(img) {

		if (this.richEditorContainer) {

			if (!this.range) {

				const selection = document.getSelection();

				this.range = selection.getRangeAt(0);

				// console.log("insertImage", this.range);

				if (!this.richEditorContainer.contains(this.range.startContainer)) {

					// this.range.setStart(this.richEditorContainer, 0);
					this.range.selectNodeContents(this.richEditorContainer);
					this.range.collapse(false);

				}

			}

			const figure = this.getTag("figure");
			const p = this.getTag("p");

			if (figure || p && !p.textContent.trim()) {

				this.range.selectNode(figure || p);
				this.range.deleteContents();



			}

			while (this.range.startContainer !== this.richEditorContainer) {

				this.range.setStartAfter(this.range.startContainer);

			}

			this.range.insertNode(img);

			// const text = this.richEditorContainer.innerHTML.normalize();

			await this.save("format", "format");
			// await this.setValue(text);
			// await this.updateContent();
			const text = this.getEditorContent();
			await this.setValue(text);
			await this.setFocus();
			await this.parent.render();

		}

	}

	async insertImage2(img) {

		if (this.squire) {

			this.squire.insertHTML(img.outerHTML);


		}

		// const selection = document.getSelection();
		//
		// if (this.range) {
		//
		// 	selection.removeAllRanges();
		// 	selection.addRange(this.range);
		//
		// } else {
		//
		// 	this.range = selection.getRangeAt(0);
		//
		// }
		//
		// // debugger;
		//
		//
		// //
		// // if (node.nodeType !== 1) {
		// //
		// // 	node = node.parentNode;
		// //
		// // }
		// //
		// // if (node.previousElementSibling && node.previousElementSibling.tagName === "P" && !node.previousElementSibling.textContent.trim()) {
		// //
		// // 	document.execCommand("delete");
		// //
		// // }
		//
		// if (this.range.startOffset === 0) {
		//
		// 	document.execCommand("delete");
		//
		// }
		//
		//
		//
		// // document.execCommand("insertParagraph");
		// document.execCommand("insertHTML", false, `${img.outerHTML}<p><br></p>`);
		// // document.execCommand("insertHTML", false, img.outerHTML);
		//
		// // document.execCommand("insertParagraph");
		//
		//
		// this.range = selection.getRangeAt(0);
		//
		// let node = this.range.commonAncestorContainer;
		//
		// if (node.nodeType !== 1) {
		//
		// 	node = node.parentNode;
		//
		// }
		//
		// if (node.nextElementSibling) {
		//
		// 	document.execCommand("delete");
		//
		// }

	}

	async insertParagraph() {

		if (this.richEditorContainer) {

			const selection = document.getSelection();

			this.range = selection.getRangeAt(0);

			while (this.range.startContainer !== this.richEditorContainer) {

				this.range.setStartAfter(this.range.startContainer);

			}

			const paragraph = document.createElement("p");
			paragraph.appendChild(document.createElement("br"));

			this.range.insertNode(paragraph);
			this.range.setStart(paragraph, 0);
			this.range.setEnd(paragraph, 0);

			// const text = this.richEditorContainer.innerHTML.normalize();
			//
			// await this.setValue(text);
			// await this.updateContent();
			const text = this.getEditorContent();
			await this.setValue(text);
			await this.render();

		}

	}

	async insertMore() {

		if (this.richEditorContainer) {

			// let node = this.range.startContainer;
			//
			// if (node.nodeType !== 1) {
			//
			// 	node = node.parentNode;
			//
			// }
			//
			// while (node !== this.richEditorContainer) {
			//
			// 	if (node.tagName === "P") {
			//
			// 		break;
			//
			// 	}
			//
			// 	node = node.parentNode;
			//
			// }
			//
			// let textContent = node.textContent;
			// textContent = textContent.trim();
			//
			// if (!textContent) {
			//
			// 	this.range.selectNode(node);
			// 	this.range.deleteContents();
			//
			// }


			document.execCommand("insertParagraph");
			document.execCommand("insertHTML", false, "---");
			document.execCommand("insertParagraph");

			const selection = document.getSelection();
			this.range = selection.getRangeAt(0);

			// this.range.setStartAfter(node);
			//
			// const hr = document.createElement("p");
			// // hr.className = "more";
			// // hr.innerHTML = "----- Read More -----";
			// hr.innerHTML = "---";
			//
			// this.range.insertNode(hr);
			//
			//
			//
			// const text = this.getEditorContent();
			// await this.setValue(text);

		}

	}

	async deleteNode(node) {

		if (this.richEditorContainer) {

			if (!this.range) {

				const selection = document.getSelection();
				this.range = selection.getRangeAt(0);

				console.log("deleteNode", this.range);

			}

			this.range.selectNode(node);
			this.range.deleteContents();

			// const text = this.richEditorContainer.innerHTML.normalize();

			await this.save("delete");
			// await this.setValue(text);
			// await this.updateContent();
			const text = this.getEditorContent();
			await this.setValue(text);
			await this.parent.render();

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

	// queryLink() {
	//
	// 	const response = new KarmaFieldsAlpha.Content();
	//
	// 	if (this.node && this.closestNode(this.node, element => element.matches("a"))) {
	//
	// 		response.value = true;
	//
	// 	}
	//
	// 	return response;
  // }

	getLinkUnder() {

		if (this.richEditorContainer && this.range) {

			// if (!this.range) {
			//
			// 	const selection = document.getSelection();
			// 	this.range = selection.getRangeAt(0);
			//
			// }

			let node = this.range.startContainer;

			if (node && this.richEditorContainer.contains(node)) {

				while (node !== this.richEditorContainer) {

					if (node.nodeType === 1 && node.tagName === "A") {

						return node;

					}

					node = node.parentNode;

				}

			}

		}

	}

	// isLinkUnder() {
	//
	// 	if (this.richEditorContainer) {
	//
	// 		if (!this.range) {
	//
	// 			const selection = document.getSelection();
	// 			this.range = selection.getRangeAt(0);
	//
	// 		}
	//
	// 		// if (!this.range.collapsed
	// 		// 	&& this.range.startContainer
	// 		// 	&& this.range.startContainer.childNodes
	// 		// 	&& this.range.startContainer.childNodes[this.range.startOffset]
	// 		// 	&& this.range.startContainer.childNodes[this.range.startOffset].tagName === "A") {
	// 		//
	// 		// 	return true;
	// 		//
	// 		// }
	//
	// 		let node = this.range.startContainer;
	//
	// 		while (node.tagName !== "A" && node !== this.richEditorContainer) {
	//
	// 			node = node.parentNode;
	//
	// 		}
	//
	// 		return node.tagName === "A";
	//
	// 	}
	//
  // }

	async createLink() {

		// if (this.selection) {

			const linkField = this.getChild("linkForm");

			await linkField.setFocus();

			await this.render();

		// }



  }

	async insertLink(href, target) {

		if (this.richEditorContainer && this.range) {

			const selection = document.getSelection();
			selection.removeAllRanges();
			selection.addRange(this.range); // Restore the saved selection

			let link = this.getLinkUnder();

			if (!link) {

				// document.execCommand("createLink", false, href);
				// this.range = selection.getRangeAt(0);
				// link = this.getLinkUnder();

				link = document.createElement("a");
				link.href = href;
				if (target) {
					link.target = "_blank";
				}
				this.range.surroundContents(link);

			} else if (link) {

				if (href) {

					link.href = href;

					if (target) {

						link.target = "_blank";

					} else if (link.hasAttribute("target")) {

						link.removeAttribute("target");

					}

				} else {

					// this.range.selectNodeContents(link);
					// this.range.deleteContents();
					// document.execCommand("unlink");

					// const text = new Text(link.innerHTML);
					// this.range.selectNodeContents(link);
					// this.range.selectNode(link);
					// const extractedNode = this.range.extractContents();
					// // this.range.deleteContents();
					// const textNodes = extractedNode.firstElementChild.childNodes;
					// for (let textNode of textNodes) {
					// 	this.range.insertNode(textNode);
					// }

					this.range.selectNodeContents(link);
					document.execCommand("unlink");


				}

			}

			// if (href.toString() === "") {
			//
			// 	// request.editor.execCommand("Unlink");
			// 	document.execCommand("unlink");
			//
			// } else {
			//
			// 	document.execCommand("createLink", false, href.toString());
			//
			// }

			// const text = this.richEditorContainer.innerHTML.normalize();

			await this.save("link", "link");
			// await this.setValue(text);
			// await this.updateContent();
			const text = this.getEditorContent();
			await this.setValue(text);
			await this.setFocus();
			await this.parent.render();

		}

	}

	async unlink() {

		if (this.richEditorContainer) {

			if (!this.range) {

				const selection = window.getSelection();

				this.range = selection.getRangeAt(0)

				// console.log("unlink", this.range);

			}

			while (this.range.startContainer.tagName !== "A" && this.richEditorContainer.contains(this.range.startContainer)) {

				this.range.selectNode(this.range.startContainer);

			}

			document.execCommand("unlink");

			// const text = this.richEditorContainer.innerHTML.normalize();

			await this.save("format", "format");
			// await this.setValue(text);
			// await this.updateContent();
			const text = this.getEditorContent();
			await this.setValue(text);
			await this.setFocus();
			await this.parent.render();

		}

		// if (this.range) {
		//
		// 	const selection = window.getSelection();
		// 	selection.removeAllRanges();
		// 	// const a = this.parent.closestNode(this.parent.range.startContainer, element => element.matches("a"));
		// 	// const range = document.createRange();
		//
		// 	const range = this.parent.range;
		//
		// 	const a = this.parent.closestNode(range.startContainer, element => element.matches("a"));
		//
		//
		// 	range.selectNode(a);
		// 	selection.addRange(range); // Restore the saved selection
		//
		// 	// document.execCommand("unlink");
		// 	//
		// 	// const text = this.parent.richEditorContainer.innerHTML.normalize();
		// 	//
		// 	// await this.save("format", "format");
		// 	// await this.setValue(text);
		// 	// await this.parent.setFocus();
		// 	// await this.parent.render();
		//
		// 	await this.parent.unlink();
		//
		// }

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

			return new KarmaFieldsAlpha.field.squire.linkForm(this.resource.linkForm, "linkForm", this);

		} else if (type === "imageForm") {

			return new KarmaFieldsAlpha.field.squire.imageForm({
				// uploader: "wp",
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

			return new KarmaFieldsAlpha.field.squire.buttons({
				children: ["separator", "edit"],
				...this.resource.textarea_buttons
			}, "codemodetoolbar", this);

		} else if (type === "editortoolbar") {

			return new KarmaFieldsAlpha.field.squire.buttons(this.resource.buttons || this.resource.header, "editortoolbar", this);

		} else if (type === "attachFile") {

			return new KarmaFieldsAlpha.field.files({
				uploader: "wp",
				key: "file",
				mimetype: ["image"],
				...this.resource.attachFile
			}, "attachFile", this);

		} else if (type === "filesAttacher") {

			return new KarmaFieldsAlpha.field.squire.filesAttacher({
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

			yield {
				class: "tinymce editor-body",
				init: node => {
					// node.element.editable = true;
					node.element.setAttribute("contenteditable", true);
				},
				update: async node => {

					// this.updateSelection(node.element);

					// const selection = document.getSelection();
					// this.range = selection && selection.rangeCount > 0 && selection.getRangeAt(0);

					this.richEditorContainer = node.element;




					const content = this.getContent();
					const hasFocus = this.hasFocus();

	        node.element.classList.toggle("loading", Boolean(content.loading));

	        if (!content.loading) {

						let squire = KarmaFieldsAlpha.editors && KarmaFieldsAlpha.editors[this.uid];

						if (!squire) {

							squire = new Squire(node.element, {
						    blockTag: 'P'
							});



							KarmaFieldsAlpha.editors = KarmaFieldsAlpha.editors || {};
							KarmaFieldsAlpha.editors[this.uid] = squire;

						}

						this.squire = squire;

						if (squire.getHTML() !== content.toString()) {

							squire.setHTML(content.toString());

						}





						squire.addEventListener("input", async event => {


							const string = squire.getHTML();

							await this.setValue(string);

							this.debounce(() => {
								this.request("render");
							}, 400);

						});



					}

					node.element.oninput = async event => {
						//
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
						//
						// // const normalizedValue = node.element.innerHTML.normalize();
						// const normalizedValue = this.getEditorContent();
						//
						// if (normalizedValue.length < content.toString().length) {
						//
						// 	await this.save(`${this.uid}-delete`, "Delete");
						//
						// } else {
						//
						// 	await this.save(`${this.uid}-insert`, "Insert");
						//
						// }
						//
						// await this.setValue(normalizedValue);
						//
						// this.debounce(() => {
						// 	this.request("render");
						// }, 400);


	        }

					node.element.onfocus = async event => {

						await this.setFocus(content.mixed);

						await this.render(); // update clipboard textarea, unselect other stuffs

					}



					// node.element.onkeydown = async event => {
					//
					// 	if (event.key === "Backspace") {
					//
					// 		const selection = document.getSelection();
					// 		this.range = selection.getRangeAt(0);
					//
					// 		let node = this.range.startContainer;
					//
					// 		if (node && (node.tagName === "FIGURE")) {
					//
					// 			this.deleteNode(this.range.startContainer);
					//
					// 			event.preventDefault();
					//
					// 		}
					//
					// 	}
					//
					// 	if (event.key === "Enter" && !event.shiftKey) {
					//
					// 		const selection = document.getSelection();
					// 		this.range = selection.getRangeAt(0);
					//
					// 		let node = this.range.startContainer;
					//
					// 		if (node.nodeType !== 1) {
					//
					// 			node = node.parentNode;
					//
					// 		}
					//
					// 		// if (node.tagName !== "LI" && node.tagName !== "P") {
					// 		if (node.tagName === "FIGCAPTION" || node.tagName === "FIGURE" ) {
					//
					// 			event.preventDefault();
					//
					// 			this.insertParagraph();
					//
					// 		}
					//
					// 		const ul = this.getSelectedNode("ul");
					// 		const li = this.getSelectedNode("li");
					//
					// 		if (li && !li.textContent.trim()) {
					//
					// 			event.preventDefault();
					//
					// 			li.remove();
					//
					// 			this.insertParagraph();
					//
					// 		}
					//
	        //   }
					//
					// }


					// node.element.onmouseup = event => {
					//
					// 	const selection = document.getSelection();
					//
					// 	const range = selection.getRangeAt(0);
					//
					// 	if (range.startContainer && node.element.contains(range.startContainer)) {
					//
					// 		this.range = range;
					//
					// 	}
					//
					// }
					//
					// node.element.onclick = async event => {
					//
					// 	const selection = document.getSelection();
					//
					// 	this.range = selection.getRangeAt(0);
					//
					//
					// 	// if (this.range.startContainer && this.range.startContainer.nodeType === 1 && this.range.startContainer.closest("a")) {
					// 	if (this.getLinkUnder()) {
					// 	// 	this.range.selectNodeContents(this.range.startContainer);
					// 	//
					// 	// }
					// 	//
					// 	// if (this.elementUnder && this.elementUnder.closest(".tinymce a")) {
					//
					// 		const field = this.getChild("linkForm");
					//
					// 		field.setData({}, "data");
					//
					// 		await field.setFocus();
					//
					// 	} else {
					//
					// 		let container = this.range.startContainer;
					//
					// 		if (container) {
					//
					// 			if (container.nodeType !== 1) {
					//
					// 				container = container.parentNode;
					//
					// 			}
					//
					// 			if (container.tagName === "FIGURE" || container.className === "more") {
					//
					// 				// this.range.selectNodeContents(this.range.startContainer);
					// 				this.range.selectNodeContents(container);
					//
					// 			}
					//
					// 		}
					//
					// 		await this.setFocus();
					//
					// 	}
					//
					// 	await this.render();
					// }
					//
					// node.element.ondblclick = async event => {
					//
					//
					// 	const selection = document.getSelection();
					//
					// 	this.range = selection.getRangeAt(0);
					//
					// 	const range = this.range;
					//
					//
					// 	const figure = this.getTag("figure");
					//
					//
					//
					//
					// 	if (figure) {
					//
					// 		// this.range.selectNodeContents(this.range.startContainer);
					// 		this.range.selectNodeContents(figure);
					//
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
			};

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

			// const imageForm = this.getChild("imageForm");
			//
			// yield {
			// 	class: "popup",
			// 	update: node => {
			// 		node.element.classList.toggle("hidden", !imageForm.hasFocusInside());
			// 	},
			// 	child: {
			// 		class: "popup-content",
			// 		children: [
			// 			imageForm.build()
			// 		]
			// 	}
			// };

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

KarmaFieldsAlpha.field.squire.buttons = class extends KarmaFieldsAlpha.field.group {

	constructor(resource, id, parent) {

		super({
			display: "flex",
			simplebuttons: true,
			// children: ["format", "bold", "italic", "link", "ul", "ol"],
			// children: ["format", "bold", "italic", "link", "ul", "ol", "image", "code"],
			// children: ["heading", "bold", "italic", "link", "ul", "ol", "image", "more", "format", "separator", "code"],
			children: ["bold", "image"],
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.squire.buttons.format = class extends KarmaFieldsAlpha.field.dropdown {
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

KarmaFieldsAlpha.field.squire.buttons.heading = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "heading",
			title: "Heading",
			action: "requestHeading",
			// value: "bold",
			active: ["request", "queryHeading"],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.squire.buttons.bold = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.squire.buttons.italic = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.squire.buttons.link = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "admin-links",
			title: "Link",
			action: "createLink",
			// request: ["insertLink"],
			active: ["request", "getLinkUnder"],
			// enabled: ["||", ["request", "hasContentSelected"], ["request", "queryLink"]],
			...resource
		}, id, parent);
	}
}

KarmaFieldsAlpha.field.squire.buttons.more = class extends KarmaFieldsAlpha.field.button {
	constructor(resource, id, parent) {
		super({
			dashicon: "editor-insertmore",
			title: "More",
			action: "insertMore",
			...resource
		}, id, parent);
	}
}


KarmaFieldsAlpha.field.squire.buttons.image = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.squire.buttons.ul = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.squire.buttons.ol = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.squire.buttons.code = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.squire.buttons.edit = class extends KarmaFieldsAlpha.field.button {
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


KarmaFieldsAlpha.field.squire.buttons.strikethrough = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.squire.buttons.superscript = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.squire.buttons.superscript = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.squire.buttons.justifyLeft = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.squire.buttons.justifyCenter = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.squire.buttons.justifyRight = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.squire.buttons.justifyFull = class extends KarmaFieldsAlpha.field.button {
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

KarmaFieldsAlpha.field.squire.buttons.justifyNone = class extends KarmaFieldsAlpha.field.button {
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




KarmaFieldsAlpha.field.squire.form = class extends KarmaFieldsAlpha.field.group {


	isActive() {

		return this.hasFocusInside();

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

					const editorBody = this.parent.richEditorContainer.parentNode;

					if (this.parent.range) {

						const containerBox = editorBody.getBoundingClientRect();

						let box;
						if (this.parent.range.collapsed) {
							let node = this.parent.range.startContainer;
							if (node.nodeType !== 1) {
								node = node.parentNode;
							}
							box = node.getBoundingClientRect();
						} else {
							box = this.parent.range.getBoundingClientRect();
						}

						const parentWidth = popover.element.parentNode.parentNode.clientWidth;
						const width = Math.min(360, containerBox.width);
						const left = Math.min(box.left - containerBox.left, parentWidth - width);
						let top = box.top - containerBox.top + box.height + 5;

						popover.element.style.left = `${left.toFixed()}px`;
						popover.element.style.top = `${top.toFixed()}px`;
						popover.element.style.width = `${width.toFixed()}px`;

					}




				}
			};

		}

	}

}


KarmaFieldsAlpha.field.squire.linkForm = class extends KarmaFieldsAlpha.field.squire.form {

	constructor(resource, id, parent) {
		super({
			key: "linkform",
			selector: "a",
			children: [
				"linkFormInput",
				"target"
				// "linkFormFooter"
			],
			...resource
		}, id, parent);
	}

	parseLink(node) {

		const object = {};

		object.href = node.getAttribute("href");
		object.target = node.getAttribute("target") === "_blank" ? "1" : "";

		return object;
	}

	getContent(subkey) {

		const response = new KarmaFieldsAlpha.Content();

		const state = this.getData("data") || {};

		if (state[subkey] === undefined) {

			// const node = this.parent.getElementUnder();
			const linkNode = this.parent.getLinkUnder();

			if (linkNode) {

				response.value = this.parseLink(linkNode)[subkey] || "";

			}

		} else {

			response.value = state[subkey];
			response.modified = true;

		}

		return response;
	}

	setValue(value, subkey) {

		const state = this.getData("data") || {};

		state[subkey] = value;

		return this.setData(state, "data");

	}

	async submit() {

		let href = this.getContent("href");
		let target = this.getContent("target");
		// let request = this.parent.getEditor();


		this.parent.insertLink(href.toString(), target.toString());

		this.setData({}, "data");

	}

	async close() {

		KarmaFieldsAlpha.server.setData({}, this.uid);

		this.setData({}, "data");

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




KarmaFieldsAlpha.field.squire.linkFormInput = class extends KarmaFieldsAlpha.field.group {
	constructor(resource, id, parent) {
		super({
			display: "flex",
			children: [
				"href",
				"attachFile",
				"applyButton"
			],
			...resource
		}, id, parent);
	}

}

KarmaFieldsAlpha.field.squire.linkFormFooter = class extends KarmaFieldsAlpha.field.group {
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




KarmaFieldsAlpha.field.squire.linkForm.href = class extends KarmaFieldsAlpha.field.input {

	constructor(resource, id, parent) {

		super({
			key: "href",
			style: "flex-grow:1",
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.squire.linkForm.target = class extends KarmaFieldsAlpha.field.checkbox {

	constructor(resource, id, parent) {

		super({
			key: "target",
			text: "Open in new tab",
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.squire.linkForm.cancel = class extends KarmaFieldsAlpha.field.button {

	constructor(resource, id, parent) {

		super({
			text: "Cancel",
			request: ["close"],
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.squire.linkForm.unlink = class extends KarmaFieldsAlpha.field.button {

	constructor(resource, id, parent) {

		super({
			text: "Unlink",
			action: "unlink",
			// disabled: ["!", ["getValue", "href"]],
			...resource
		}, id, parent);

	}

}
KarmaFieldsAlpha.field.squire.linkForm.applyButton = class extends KarmaFieldsAlpha.field.button {

	constructor(resource, id, parent) {

		super({
				text: "Apply",
				action: "submit",
				primary: true,
			...resource
		}, id, parent);

	}

}


KarmaFieldsAlpha.field.squire.linkForm.attachFile = class extends KarmaFieldsAlpha.field.files {

	constructor(resource, id, parent) {

		super({

			...resource
		}, id, parent);

	}

	getDriver() {

    return this.resource.driver || "medias";

  }


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

		const filesAttacher = new KarmaFieldsAlpha.field.squire.filesAttacher({}, "fileattacher", this);

		let request = filesAttacher.queryImage(ids[0]);

		while (request.loading) {

			await this.render();

			request = filesAttacher.queryImage(ids[0]);

		}

		const src = request.toObject().src || "";

		await this.parent.setValue(src, "href");
	}

}



KarmaFieldsAlpha.field.squire.filesAttacher = class extends KarmaFieldsAlpha.field.files {

	getBody() {}
	getFooter() {}

	getSelectedIds() { // extends Tags

		const selectedIds = [];

		const figure = this.parent.getElementUnder();

		if (figure && figure.nodeType === 1) {

			const img = figure.querySelector("img");

			if (img) {

				const id = img.getAttribute("data-id");

				if (id) {

					selectedIds.push(id);

				}

			}

		}

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

		figcaption.innerHTML = object.caption || "";

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

		const id = ids[0];

		let request = this.queryImage(id);

		while (request.loading) {

			await this.render();

			request = this.queryImage(id);

		}

		const figure = this.parent.getElementUnder();

		if (figure && figure.tagName === "FIGURE") {

			request.value.classes = figure.className;

		}

		const newImg = this.createImage(request.toObject());

		await this.parent.insertImage2(newImg);

	}

}

KarmaFieldsAlpha.field.squire.imageForm = class extends KarmaFieldsAlpha.field.form {

	constructor(resource, id, parent) {

		super({
			header: {
				children: [
					{
						type: "title",
						title: ["queryValue", "medias", ["getParam", "id"], "filename"]
					},
					"close"
				]
			},
			body: {
				type: "group",
				children: [
					{
						type: "group",
						display: "flex",
						children: [
							{
								type: "input",
								key: "src",
								label: "Src",
								readonly: true,
								width: "1fr"
								// placeholder: ["replace", "%%/%", "%", ["upload-directory"], ["queryValue", "medias", ["getParam", "id"], "dir"], ["queryValue", "medias", ["getParam", "id"], "filename"]]
							},
							{
								type: "input",
								key: "width",
								label: "Width",
								readonly: true,
								width: "4rem"
							},
							{
								type: "input",
								key: "height",
								label: "Height",
								readonly: true,
								width: "4rem"
							}
						]
					},

					{
						type: "textarea",
						key: "caption",
						label: "Caption"
					},

				]
			},
			footer: {
				children: [
					{
						type: "button",
						text: "Annuler",
						title: "Annuler",
						action: "close"
					},
					{
						type: "button",
						text: "Replace",
						title: "Replace",
						action: "openMedias"
					},
					{
						type: "attachFile",
						key: "id"
					},
					"separator",
					{
						type: "button",
						primary: true,
						text: "Save",
						title: "Save",
						action: "submit"
					}
				]
			},
			...resource
		}, id, parent);

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
			classes: container.className || "",
			styleWidth: element.style.width || "",
			styleHeight: element.style.height || ""

		};

	}


	createImage(object) {

		const img = new Image();

		if (object.id) {

			img.setAttribute("data-id", object.id);

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



		img.style.width = object.styleWidth || "";
		img.style.height = object.styleHeight || "";

		// debugger;
		//
		// const testNode = document.createElement("div");
		// testNode.appendChild(img)
		//
		// return testNode;

		// if (object.caption) {

			const figure = document.createElement("figure");

			figure.appendChild(img);

			if (object.classes) {

				figure.className = object.classes;

			}

			const figcaption = document.createElement("figcaption");

			figcaption.innerHTML = object.caption || "";

			figure.appendChild(figcaption);

			return figure;

	}

	getContentAt(index, key) {

		const response = new KarmaFieldsAlpha.Content();

		const state = this.getData(key);

		if (state === undefined) {

			const img = this.parent.elementUnder && this.parent.elementUnder.querySelector("img");

			const object = img && this.parseImage(img) || {};

			response.value = object[key] || "";

		} else {

			response.value = state;
			response.modified = true;

		}

		return response;
	}

	async setValueAt(value, index, key) {

			await this.setData(value, key);

	}

	queryImage(id) {

		const response = new KarmaFieldsAlpha.Content({});

		let filename = this.getWild("medias", id, "filename");
		let dir = this.getWild("medias", id, "dir");
		let mimetype = this.getWild("medias", id, "mimetype");
		let width = this.getWild("medias", id, "width");
		let height = this.getWild("medias", id, "height");

		if (filename.loading || dir.loading || mimetype.loading || width.loading || height.loading) {

			response.loading = true;

		} else {

			response.value.width = width.toString();
			response.value.height = height.toString();
			response.value.src = `${KarmaFieldsAlpha.uploadURL}${dir.toString()}/${filename.toString()}`;

			if (mimetype.toString() === "image/jpeg" || mimetype.toString() === "image/jpg" || mimetype.toString() === "image/png" || mimetype.toString() === "image/webp") {

				let sizes = this.getWild("medias", id, "sizes");

				if (sizes.loading) {

					response.loading = true;

				} else {

					if (sizes.toArray().length) {

						response.value.srcset = sizes.toArray().map(size => `${KarmaFieldsAlpha.uploadURL}${dir.toString()}/${size.filename} ${size.width}w`).join(",");
						response.value.sizes = "(min-width: 1024px) 1024px, 100vw";

					}

				}

			}

		}

		return response;

	}


	async submit() {

		const img = this.parent.elementUnder && this.parent.elementUnder.querySelector("img");

		if (img) {

			let object = img && this.parseImage(img) || {};

			object.styleWidth = this.getData("styleWidth") ?? object.styleWidth;
			object.styleHeight = this.getData("styleHeight") ?? object.styleHeight;
			object.caption = this.getData("caption") ?? object.caption;
			object.classes = this.getData("classes") ?? object.classes;
			object.alt = this.getData("alt") ?? object.alt;

			if (object.id) {

				let request = this.queryImage(object.id);

				while (request.loading) {

					await this.render();

					request = this.queryImage(object.id);

				}

				object = {...object, ...request.toObject()};

			}

			this.parent.range.deleteContents();

			const newImg = this.createImage(object);

			// this.parent.range.selectNode(this.parent.elementUnder);

			await this.parent.insertImage(newImg);

			await this.setData({});

		}

	}


	*buildContent() {

		if (this.hasFocusInside()) {

			yield* super.buildContent();

		}

	}

}

KarmaFieldsAlpha.field.squire.imageForm.attachFile = class extends KarmaFieldsAlpha.field.files {

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

	}

}
