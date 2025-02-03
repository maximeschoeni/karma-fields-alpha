document.addEventListener("selectionchange", event => {

	KarmaFieldsAlpha.Editor.update();

});

KarmaFieldsAlpha.Editor = class {

	static tags = [];
	// static range = new Range();
	static map = new Map();
	static beam;

	static onInput() {}
	static onUndo() {}
	static onRedo() {}

	static dispatchInput(inputType) {

		const content = this.getContent();

		if (content !== this.content) {

			this.content = content;

			this.onInput(inputType, this);

		}

	}

	static init(element) {

		if (this.element === element) {

			return;

		}

		this.element = element;

		const tag = this.getTag(element);

    element.oninput = async event => {

			// this.spoil();

			this.dispatchInput(event.inputType);

			// console.time('doSomething')
			//
			// this.dispatchInput(event.inputType);
			//
			// console.timeEnd('doSomething')

    }

    element.oncut = event => {

      event.preventDefault();

			if (this.beam && !this.beam.collapsed) {

				// const range = this.beam.cloneRange();
				// this.Beam.shrinkDown(range);
				// this.Beam.shrinkUp(range);

				// this.selectDown(range);



				this.Beam.shrinkDown(this.beam);
				this.Beam.shrinkUp(this.beam);

				const tag = this.getTag(this.beam.endContainer);
				const html = tag.cut();


				// this.Beam.shrinkDown(this.beam);
				//
				// const commonAncestor = this.getTag(this.beam.commonAncestorContainer);
				//
		    // const content = this.beam.extractContents();
				//
				// commonAncestor.sanitize();
				//
		    // const container = document.createElement("div");
		    // container.appendChild(content);
				//
		    // const html = container.innerHTML;

        event.clipboardData.setData("text/plain", html);
        event.clipboardData.setData("text/html", html);

				this.dispatchInput("cut");

      }

    }

    element.oncopy = event => {

      event.preventDefault();

			if (this.beam && !this.beam.collapsed) {

				// this.beam.shrinkDown();
				const range = this.beam.cloneRange();
				this.Beam.shrinkDown(range);
				this.Beam.shrinkUp(range);

				const content = range.cloneContents();

		    const container = document.createElement("div");
		    container.appendChild(content);

		    let html = container.innerHTML;

        event.clipboardData.setData("text/plain", html);
        event.clipboardData.setData("text/html", html);

      }

    }

    element.onpaste = event => {

      event.preventDefault();

			if (this.beam) {

				let html = event.clipboardData.getData("text/html");

				if (!html) {

					let text = event.clipboardData.getData("text/plain");

					if (text) {

						html = text;

						// html = `<p>${text.trim()}</p>`;
						//
						// html = html.replace(/(?:\r\n|\r|\n)+/g, '</p><p>');

					}

        }

				if (html) {

					// if (!this.beam.collapsed) {
					//
					// 	// this.beam.deleteContents();
					// 	const tag = this.getTag(this.beam.endContainer);
					// 	tag.cut();
					//
					// }

					const node = document.createElement("div");
					node.innerHTML = html;

					const content = new this.Tag.content(node);
					content.sanitize();

					this.insertNode(...content.node.childNodes);

				}

				this.dispatchInput("paste", this);

      }

    }

    element.onkeydown = async event => {

      if (event.key === "z" && event.metaKey) {

				event.preventDefault();

				if (event.shiftKey) {

					this.onRedo();

				} else {

					this.onUndo();

				}

			} else {

				// if (!this.beam.collapsed && !event.altKey && !event.ctrlKey && !event.metaKey) {
				//
				// 	const tag = this.getTag(this.beam.endContainer);
				//
				// 	tag.cut();
				//
				// }

				if (event.key === "Backspace") {

					// const container = this.getTag(this.beam.startContainer);
					//
					// if (container.backwardDelete()) {
					// if (!this.beam.collapsed && !event.altKey && !event.ctrlKey && !event.metaKey) {
					//
					// 	const tag = this.getTag(this.beam.endContainer);
					//
					// 	tag.cut();
					//
					// }

					if (this.backwardDelete()) {

						event.preventDefault();

						this.dispatchInput("backspace");

	        }

				} else if (event.key === "Enter") {

					event.preventDefault();

					// const container = this.getTag(this.beam.startContainer);
					//
					// container.breakLine(this.beam, event.shiftKey || event.altKey || event.ctrlKey || event.metaKey);

					this.breakLine(event.shiftKey || event.altKey || event.ctrlKey || event.metaKey);

					this.dispatchInput("breakline");

				} else if (!this.beam.collapsed && !event.altKey && !event.ctrlKey && !event.metaKey) {

					// event.preventDefault();

				}

			}

    }

	}

	static update() {

		const selection = document.getSelection();

		if (this.element && this.element === document.activeElement && selection.rangeCount > 0) {

			const range = selection.getRangeAt(0);

			if (this.element.contains(range.commonAncestorContainer)) {

				this.beam = range;

				this.updateSelectedTags();

				// console.log("update", this.tags.map(tag => tag.tagName));

				this.onSelectionChange();

			}

		}

  }

	static updateSelectedTags() {

		const root = this.getTag(this.element);
		const beam = this.beam.cloneRange();

		if (!beam.collapsed) {

			this.Beam.shrinkDown(beam);

		}

		this.tags = [...root.listTags(beam)];

		// console.log(this.tags.map(tag => tag.getName()));

	}

	static getSelectedTags() {

		// return this.beam && this.beam.tags || [];
		return this.tags || [];
	}

	static query(tagName, ...params) {

		return this.getSelectedTags().filter(tag => tag.is(tagName, ...params));

	}

	static isSelected(tagName, ...params) {

		return this.getSelectedTags().some(tag => tag.is(tagName, ...params));

	}

	static has(tagName, ...params) {

		return this.getSelectedTags().some(tag => tag.is(tagName, ...params));

	}


	static getContent() {

		// if (this.content) {
		//
		// 	return this.content;
		//
		// }

		const root = this.getTag(this.element);


		// console.time('doSomething')
		//
		root.sanitize();
		//
		// console.timeEnd('doSomething')


		return root.getContent();

  }

	static setContent(content) {

		const root = this.getTag(this.element);

		root.setContent(content);

		this.content = content;

    // if (content) {
		//
		// 	const root = this.getTag(this.element);
		//
		// 	root.node.innerHTML = content;
		//
    //   root.sanitize();
		//
    // } else {
		//
		// 	root.reset();
		//
    // }

  }

	static getRange() {

		return this.beam;

	}

	static reset() {

	}

	static isRoot(node) {

		return node === this.element;

	}


	// static *listTags(range, element = this.element) {
	//
	// 	for (let child of element.childNodes) {
	//
	// 		if (range.intersectsNode(child)) {
	//
	// 			yield* this.listTags(range, child);
	//
	// 			yield child;
	//
	// 		}
	//
	// 	}
	//
	// }

	// static insertNode() {
	//
	// 	this.insertNode();
	//
	// 	const tags = [...content.node.children].map(node => this.getTag(node));
	//
	// 	const container = this.getTag(this.beam.startContainer);
	//
	// 	if (tags.every(tag => tag.is("inline") || tag.is("text"))) {
	//
	// 		container.insertInline(...tags);
	//
	// 	} else {
	//
	// 		container.insertBlock(...tags);
	//
	// 	}
	//
	// }



	static insertNode(...nodes) {

		if (!this.beam.collapsed) {

			this.Beam.shrinkDown(this.beam);
			this.Beam.shrinkUp(this.beam);
			// this.Beam.growDown(this.beam);
			this.beam.deleteContents();

    }

		const tags = nodes.map(node => this.getTag(node));
		const container = this.getTag(this.beam.startContainer);

		if (tags.every(tag => tag.is("inline") || tag.is("text"))) {

			container.insertInline(...tags);

		} else {

			container.insertBlock(...tags);

		}

	}

	static insert(...nodes) {

		// const range = this.beam.cloneRange();
		//
    // for (let node of nodes) {
		//
		// 	const tag = this.getTag(node);
		//
		// 	tag.insertInto(this.beam);
		//
		// 	this.beam.collapse(false);
		//
    // }
		//
		// this.beam.setStart(range.startContainer, range.startOffset);
		//
		// const container = this.getTag(this.beam.commonAncestorContainer);
		//
		// container.sanitize();

		this.insertNode(...nodes);

		this.dispatchInput("insert");

  }

	static wrap(tagName, attributes) {

		const node = this.createNode(tagName, attributes);

		const tag = this.getTag(node, true);

		// tag.wrap(tagName, attributes, this.beam);

		tag.wrapMe();

		this.dispatchInput("wrap");

	}

	static unwrap(tagName) {

		const tags = this.query(tagName);

		for (let tag of tags) {

			tag.unwrap(this.beam);

		}

		this.dispatchInput("unwrap");

	}



	// static transform(tagName, attributes) {
	//
	// 	const tags = this.query(tagName, attributes);
	//
	// 	if (tags.length) {
	//
	// 		for (let tag of tags) {
	//
	// 			tag.transform(null, attributes, this.beam);
	//
	// 		}
	//
	// 	} else {
	//
	// 		const tag = this.createTag(tagName, attributes);
	//
	// 		tag.wrap(tagName, attributes, this.beam);
	//
	// 		this.updateSelectedTags(); // -> when a link is created
	//
	// 	}
	//
	// 	this.dispatchInput("transform");
	//
	// }

	// static transform(tagName, attributes) {
	//
	// 	const tags = this.query(tagName, attributes);
	//
	// 	if (tags.length) {
	//
	// 		for (let tag of tags) {
	//
	// 			tag.transform(tagName, attributes, this.beam);
	//
	// 		}
	//
	// 	} else {
	//
	// 		const tag = this.createTag(tagName, attributes);
	//
	// 		tag.transform(tagName, attributes, this.beam);
	//
	// 		this.updateSelectedTags(); // -> when a link is created
	//
	// 	}
	//
	// 	this.dispatchInput("transform");
	//
	// }

	static edit(tagName, attributes) {

		const tag = this.createTag(tagName, attributes);

		tag.edit(tagName, attributes);

		this.updateSelectedTags();

		this.dispatchInput("edit");

	}

	// static toggle(tagName, attributes) {
	//
	// 	const tags = this.query(tagName, attributes);
	//
	// 	if (tags.length) {
	//
	// 		for (let tag of tags) {
	//
	// 			tag.unwrap(tagName, attributes, this.beam);
	//
	// 		}
	//
	// 	} else {
	//
	// 		const tag = this.createTag(tagName, attributes);
	//
	// 		tag.wrap(tagName, attributes, this.beam);
	//
	// 	}
	//
	// 	this.updateSelectedTags();
	//
	// 	this.dispatchInput("wrap");
	//
	// }


	static toggle(tagName, attributes) {

		// const tags = this.query(tagName, attributes);
		//
		// if (tags.length) {
		//
		// 	for (let tag of tags) {
		//
		// 		tag.toggle();
		//
		// 	}
		//
		// } else {
		//
		// 	const tag = this.createTag(tagName, attributes);
		//
		// 	tag.toggle();
		//
		// }

		const tag = this.createTag(tagName, attributes);

		tag.toggle(tagName, attributes);

		this.updateSelectedTags();

		this.dispatchInput("toggle");

	}



	static breakLine(shift) {

		if (!this.beam) {

			console.error("Range not set");

		}

		if (!this.beam.collapsed) {

			const tag = this.getTag(this.beam.endContainer);

			tag.cut();

		}

		const container = this.getTag(this.beam.startContainer);

		container.breakLine(shift, this.beam);


	}

	static backwardDelete() {

		if (!this.beam) {

			console.error("Range not set");

		}

		if (!this.beam.collapsed) {

			const tag = this.getTag(this.beam.endContainer);

			tag.cut();

			return true;

		}

		const container = this.getTag(this.beam.startContainer);

		return container.backwardDelete(this.beam);

	}

	static getConstructor(tagName) {

		return this.map.get(tagName) || KarmaFieldsAlpha.Editor.Tag;

	}

	static create(tagName, attributes) {

		const constructor = this.getConstructor(tagName);

		const node = this.createNode(tagName, attributes);

		const tag = new constructor(node);

		return tag;

	}

	static createNode(tag, attributes, content) {

		if (content) {

			console.error("DEPRECATED content");

		}

		return this.transformNode(null, tag, attributes);

		// const node = document.createElement(tag.toLowerCase());
		//
		// if (content) {
		//
		// 	// node.appendChild(content);
		//
		// 	while (content.firstChild) {
		//
		// 		node.appendChild(content.firstChild);
		//
		// 	}
		//
		// }
		//
		// if (attributes) {
		//
		// 	for (let key in attributes) {
		//
	  //     if (attributes[key]) {
		//
		// 			node.setAttribute(key, attributes[key]);
		//
	  //     }
		//
	  //   }
		//
		// }
		//
		// return node;

	}

	static transformNode(node, tagName, params) {

		if (!node) {

			node = document.createElement(tagName);

		} else if (tagName && node.tagName !== tagName.toUpperCase()) {

      const newNode = document.createElement(tagName);

			while (node.firstChild) {

				newNode.appendChild(node.firstChild);

      }

			if (node.parentNode) {

				node.replaceWith(newNode);

			}

			// if (this.beam.startContainer === node) {
			//
			// 	this.beam.setStart(newNode, this.beam.startOffset);
			//
			// }
			//
			// if (this.beam.endContainer === node) {
			//
			// 	this.beam.setEnd(newNode, this.beam.endOffset);
			//
			// }

			node = newNode;

		}

		if (params) {

			while (node.attributes.length) {

				node.removeAttributeNode(node.attributes[0]);

	    }

			for (let key in params) {

				if (params[key]) {

					node.setAttribute(key, params[key]);

	      }

			}

		}

		return  node;

	}

	static getTag(node) {

		const tagName = node.nodeType === 1 && node.tagName || node.nodeType === 3 && "text" || node.nodeType === 11 && "content";

		const constructor = this.getConstructor(tagName);

		const tag = new constructor(node);

		return tag;

	}

	static createTag(tagName, attributes, content) {

		const node = this.createNode(tagName, attributes, content);

		return this.getTag(node);

	}

	static createPrototype(tagName) {

		const constructor = this.getConstructor(tagName);

		return constructor.prototype;

	}

	static register(name, constructor) {

		if (!this.map) {

			this.map = new Map();

		}

		this.map.set(name, constructor);

	}

	// static shrinkUp() {
	//
	// 	this.shrinkUpStart();
	// 	this.shrinkUpEnd();
	//
	// }
	//
	// static shrinkDown() {
	//
	// 	this.shrinkDownStart();
	// 	this.shrinkDownEnd();
	//
	// }
	//
	// static growUp() {
	//
	// 	this.growUpStart();
	// 	this.growUpEnd();
	//
	// }
	//
	// static growDown() {
	//
	// 	this.growDownStart();
	// 	this.growDownEnd();
	//
	// }
	//
	// static shrinkUpStart() {
	//
	// 	if (this.range.startContainer.nodeType === 1) {
	//
	// 		let child = this.range.startContainer.childNodes[this.range.startOffset];
	//
	// 		if (child) {
	//
	// 			if (child.nodeType === 3) {
	//
	// 				this.range.setStart(child, 0);
	//
	// 			} else if (child.hasChildNodes()) {
	//
	// 				this.range.setStart(child, 0);
	//
	// 				this.shrinkUpStart();
	//
	// 			}
	//
	// 		}
	//
	// 	}
	//
	// }
	//
	// static shrinkDownStart() {
	//
	// 	let node = this.range.startContainer;
	// 	let offset = this.range.startOffset;
	//
	// 	if (node.nodeType === 3 && offset >= node.length || node.nodeType === 1 && offset >= node.childNodes.length) {
	//
	// 		this.range.setStartAfter(node);
	//
	// 		this.shrinkDownStart();
	//
	// 	}
	//
	// }
	//
	// static growUpStart() {
	//
	// 	if (this.range.startContainer.nodeType === 1 && this.range.startOffset > 0) {
	//
	// 		let child = this.range.startContainer.childNodes[this.range.startOffset - 1];
	//
	// 		if (child.nodeType === 3) {
	//
	// 			this.range.setStart(child, child.length);
	//
	// 		} else if (child.hasChildNodes()) {
	//
	// 			this.range.setStart(child, child.childNodes.length);
	//
	// 			this.growUpStart();
	//
	// 		}
	//
	// 	}
	//
	// }
	//
	// static growDownStart() {
	//
	// 	if (this.range.startContainer.nodeType === 1 && this.range.startOffset === 0 || this.range.startContainer.nodeType === 3 && this.range.startOffset === 0) {
	//
	// 		this.range.setStartBefore(this.range.startContainer);
	//
	// 		this.growDownStart();
	//
	// 	}
	//
	// }
	//
	// static growUpEnd() {
	//
	// 	if (this.range.endContainer.nodeType === 1) {
	//
	// 		let child = this.range.endContainer.childNodes[this.range.endOffset];
	//
	// 		if (child) {
	//
	// 			if (child.nodeType === 3) {
	//
	// 				this.range.setStart(child, 0);
	//
	// 			} else if (child.hasChildNodes()) {
	//
	// 				this.range.setStart(child, 0);
	//
	// 				this.growUpEnd();
	//
	// 			}
	//
	// 		}
	//
	// 	}
	//
	// }
	//
	// static growDownEnd() {
	//
	// 	if (this.range.endContainer.nodeType === 3 && this.range.endOffset >= this.range.endContainer.length || this.range.endContainer.nodeType === 1 && this.range.endOffset >= this.range.endContainer.childNodes.length) {
	//
	// 		this.range.setEndAfter(this.range.endContainer);
	//
	// 		this.growDownEnd();
	//
	// 	}
	//
	// }
	//
	// static shrinkUpEnd() {
	//
	// 	if (this.range.endContainer.nodeType === 1 && this.range.endOffset > 0) {
	//
	// 		let child = this.range.endContainer.childNodes[this.range.endOffset - 1];
	//
	// 		if (child.nodeType === 3) {
	//
	// 			this.range.setEnd(child, child.length);
	//
	// 		} else if (child.hasChildNodes()) {
	//
	// 			this.range.setEnd(child, child.childNodes.length);
	//
	// 			this.shrinkUpEnd();
	//
	// 		}
	//
	// 	}
	//
	// }
	//
	// static shrinkDownEnd() {
	//
	// 	if (this.range.endContainer.nodeType === 1 && this.range.endOffset === 0 || this.range.endContainer.nodeType === 3 && this.range.endOffset === 0) {
	//
	// 		this.range.setEndBefore(this.range.endContainer);
	//
	// 		this.shrinkDownEnd();
	//
	// 	}
	//
	// }


	static getPathes() {

		if (this.beam.collapsed) {

			return [this.getPathFromPoint(this.beam.startContainer, this.beam.startOffset)];

    } else {

      return [
        this.getPathFromPoint(this.beam.startContainer, this.beam.startOffset),
        this.getPathFromPoint(this.beam.endContainer, this.beam.endOffset)
      ];

    }

  }

	static getPathFromPoint(node, index) {

    const path = [index];

		while (node !== this.element) {

      index = 0;

      while (node.previousSibling) {

        index++;
        node = node.previousSibling

      }

      path.unshift(index);

      node = node.parentNode;

    }

    return path;
  }


	static getPointFromPath(path) {

    let nodePath = path.slice(0, -1);
		let node = this.element;
    let depth = 0;
    let offset = path[path.length - 1];

		while (node.nodeType === 1 && depth < nodePath.length && node.firstChild) {

      node = node.firstChild;

      for (let i = 0; i < nodePath[depth]; i++) {

        if (node.nextSibling) {

          node = node.nextSibling;

        }

      }

      depth++;

    }

    if (node.nodeType === 1) {

      offset = Math.min(node.childNodes.length, offset);

    } else {

      offset = Math.min(node.length, offset);

    }

    return [node, offset];

  }

	static setPathes(pathes) {

		if (!this.beam) {

			// const selection = document.getSelection();
			//
			// const range = selection.getRangeAt(0);
			//
			// if (this.element.contains(range.commonAncestorContainer)) {
			//
			// 	this.beam = new this.Beam(range);
			//
			// }

			// const range = new Range();
			// this.beam = new this.Beam(range);

			this.beam = new Range();

		}

		if (pathes[0]) {

			this.beam.setStart(...this.getPointFromPath(pathes[0]));

		}

		if (pathes[1]) {

			this.beam.setEnd(...this.getPointFromPath(pathes[1]));

    } else {

			this.beam.collapse(true);

		}

		this.updateSelectedTags();

  }


}

KarmaFieldsAlpha.Editor.Collection = class {

	constructor(tags, editor) {

		this.tags = tags;
		this.editor = editor || KarmaFieldsAlpha.Editor;

	}

	transform(tagName, attributes) {

		if (this.tags.length) {

			for (let tag of this.tags) {

				tag.transform(tagName, attributes, this.beam);

			}

		} else {

			const tag = this.editor.createTag(tagName, attributes);

			tag.transform(tagName, attributes, this.beam);

		}

		this.editor.updateSelectedTags(); // -> when a link is created

		this.editor.dispatchInput("transform");

	}

	toggle(tagName, attributes) {

		if (this.tags.length) {

			for (let tag of this.tags) {

				tag.toggle();

			}

		} else {

			const tag = this.editor.createTag(tagName, attributes);

			tag.toggle();

		}

		this.editor.updateSelectedTags();

		this.editor.dispatchInput("toggle");

	}

}
