
KarmaFieldsAlpha.Editor.Tag = class {

	constructor(node) {

		this.node = node;
		this.editor = KarmaFieldsAlpha.Editor;

		// if (node && node.tagName) {
		//
		// 	this.name = node.tagName.toLowerCase();
		// 	this.tagName = node.tagName;
		//
		// }

  }

	getName() {

		return "";

	}

	getType() {

		return "";

	}

	is(name) {

		return false;

	}

	isRoot() {

		// return this.root || this.base; // which one ??

		return false;

	}


	getLength() {

		return this.node.childNodes.length;

	}

	getParent() {

		if (!this.isRoot() && this.node.parentNode) {

			return this.getTag(this.node.parentNode);

		}

	}

	getFirstChild() {

		if (this.node.firstChild) {

			return this.getTag(this.node.firstChild);

		}

	}

	getLastChild() {

		if (this.node.lastChild) {

			return this.getTag(this.node.lastChild);

		}

	}

	getChild(index) {

		if (!this.single && !this.type === "text") {

			return this.getTag(this.node.childNodes[index]);

		}

	}

	getTag(node) {

		return KarmaFieldsAlpha.Editor.getTag(node);

	}

	createTag(tagName, attributes, content) {

		return KarmaFieldsAlpha.Editor.createTag(tagName, attributes, content);

	}

	isEmpty() {

		return !this.node.textContent.trim();

	}

	clone(deep) {

		const clone = this.node.cloneNode(deep);
		const tag = this.getTag(clone);

		return tag;

	}

	getContainer() {

		let container = this.getParent();

		if (!container || container.isRoot()) {

			return this;

		} else {

			return container.getContainer();

		}

	}

	getInnerContainer() {

		const parent = this.getParent();

		if (!parent || this.isRoot()) {

			return this;

		} else {

			return parent;

		}

	}

	*listTags(range) {

		for (let child of this.node.childNodes) {

			if (range.intersectsNode(child)) {

				const tag = this.getTag(child);

				yield* tag.listTags(range);

				yield tag;

			}

		}

	}

	getTagBefore() {

		if (this.node.previousSibling) {

			return this.getTag(this.node.previousSibling);

		}

		const parent = this.getParent();

		if (parent && !parent.isRoot()) {

			return parent.getTagBefore();

		}

	}

	getPreviousTag() {

		if (this.node.lastChild) {

			return this.getTag(this.node.lastChild);

    }

		return this.getTagBefore();

  }

	getTagAfter() {

		if (this.node.nextSibling) {

			return this.getTag(this.node.nextSibling);

		}

		const parent = this.getParent();

		if (parent && !parent.isRoot()) {

			return parent.getTagAfter();

		}

	}

	getNextTag() {

		if (this.node.firstChild) {

			return this.getTag(this.node.firstChild);

    }

		return this.getTagAfter();

  }


	normalize() {

		const nodes = [...this.node.childNodes];

    for (let node of nodes) {

			const child = this.getTag(node);

			child.normalize();

			if (child.isValid()) { // => is valid

				child.sanitizeAttributes();

			} else {

				child.node.parentNode.removeChild(child.node);

			}

    }

	}


	// sanitize() {
	//
	// 	let child = this.getTag(this.node.firstChild);
	//
	// 	while (child) {
	//
	// 		child = child.sanitize();
	//
	// 		if (!child.isValid()) {
	//
	// 			const next = this.getTag(child.node.nextSibling);
	//
	// 			this.node.removeChild(child.node);
	//
	// 			child = next;
	//
	// 		} else if (!child.isValidIn(this)) {
	//
	// 			if (this.node.parentNode) {
	//
	// 				this.node.parentNode.insertBefore(child.node, this.node);
	//
	// 			} else {
	//
	// 				child.valid = false;
	//
	// 			}
	//
	// 			return child;
	//
	// 		} else {
	//
	// 			child = this.getTag(child.node.nextSibling);
	//
	// 		}
	//
	// 	}
	//
	// 	const attributes = [...this.node.attributes];
	//
	// 	for (let attribute of attributes) {
	//
	// 		if (!this.isValidAttribute(attribute.name)) {
	//
	// 			this.node.removeAttribute(attribute.name);
	//
	// 		}
	//
	// 	}
	//
	// 	return this;
	//
  // }

	// sanitize() {
	//
	// 	let bracket = new KarmaFieldsAlpha.Editor.Bracket(this.node, true);
	// 	let endBracket = new KarmaFieldsAlpha.Editor.Bracket(this.node, false);
	// 	let nextBracket = endBracket.getNextOpening();
	//
	// 	while (bracket && bracket !== nextBracket) {
	//
	// 		if (bracket.opening) {
	//
	// 			const tag = bracket.getTag();
	// 			const parent = tag.getParent();
	//
	// 			if (parent && (!parent.isValid() || !tag.isValidIn(parent))) {
	//
	// 				if (parent.node.parentNode && !parent.isRoot()) {
	//
	// 					parent.node.parentNode.insertBefore(tag.node, parent.node);
	//
	// 				} else {
	//
	// 					bracket.opening = false;
	//
	// 					bracket = bracket.getNext();
	//
	// 					parent.node.removeChild(tag.node);
	//
	// 				}
	//
	// 			} else {
	//
	// 				bracket = bracket.getNext();
	//
	// 			}
	//
	// 		} else {
	//
	// 			const tag = bracket.getTag();
	//
	// 			bracket = bracket.getNext();
	//
	// 			if (!tag.isValid()) {
	//
	// 				tag.node.parentNode.removeChild(tag.node);
	//
	// 			} else {
	//
	// 				tag.sanitizeAttributes();
	//
	// 				// const attributes = [...tag.node.attributes];
	// 				//
	// 				// for (let attribute of attributes) {
	// 				//
	// 				// 	if (!tag.isValidAttribute(attribute.name)) {
	// 				//
	// 				// 		tag.node.removeAttribute(attribute.name);
	// 				//
	// 				// 	}
	// 				//
	// 				// }
	//
	// 			}
	//
	// 		}
	//
	// 	}
	//
  // }

	// canFixChild() {
	//
	// 	return false;
	//
	// }

	sanitizeChild(child) {

		const parent = this.getParent();

		if (parent && !child.isValidIn(this)) {

			parent.node.insertBefore(child.node, this.node);

			parent.sanitizeChild(this);

		}

	}

	sanitizeChildren() {

		const children = [...this.node.childNodes];

		for (let child of children) {

			const tag = this.getTag(child);

			tag.sanitize();

		}

	}




	sanitize() {

		const parent = this.getParent();

		if (parent) {

			if (!this.isValid()) {

				parent.node.removeChild(this.node);

			} else {

				parent.sanitizeChild(this);

			}

		}

  }

	// sanitizeChild(tag) {
	//
	// 	if (!this.isValid() || !tag.isValidIn(this)) {
	//
	// 		if (!this.isRoot()) {
	//
	// 			this.node.parentNode.insertBefore(tag.node, this.node);
	//
	// 			tag.sanitize();
	//
	// 		} else {
	//
	// 			this.node.removeChild(tag.node);
	//
	// 		}
	//
	// 	} else {
	//
	// 		if (!tag.isValid()) {
	//
	// 			this.node.removeChild(tag.node);
	//
	// 		}
	//
	// 	}
	//
	// }


	// sanitizeChild(tag) {
	//
	// 	if (!this.isValid() || !tag.isValidIn(this)) {
	//
	// 		this.node.parentNode.insertBefore(tag.node, this.node);
	//
	// 		tag.sanitize();
	//
	// 	} else if (!tag.isValid()) {
	//
	// 		this.node.removeChild(tag.node);
	//
	// 	}
	//
	// }





	// sanitize2() {
	//
	// 	// let bracket = new KarmaFieldsAlpha.Editor.Bracket(this.node, true);
	// 	// let endBracket = new KarmaFieldsAlpha.Editor.Bracket(this.node, false);
	// 	// let nextBracket = endBracket.getNextOpening();
	// 	//
	// 	// while (bracket && bracket !== nextBracket) {
	// 	//
	// 	// 	if (bracket.opening) {
	// 	//
	// 	// 		const tag = bracket.getTag();
	// 			const parent = this.getParent();
	//
	// 			if (parent && (!parent.isValid() || !this.isValidIn(parent))) {
	//
	// 				if (parent.node.parentNode && !parent.isRoot()) {
	//
	// 					parent.node.parentNode.insertBefore(this.node, parent.node);
	//
	// 				} else {
	//
	// 					parent.node.removeChild(this.node);
	//
	// 				}
	//
	// 			} else {
	//
	// 				for (let child)
	//
	// 			}
	//
	// 		} else {
	//
	// 			const tag = bracket.getTag();
	//
	// 			bracket = bracket.getNext();
	//
	// 			if (!tag.isValid()) {
	//
	// 				tag.node.parentNode.removeChild(tag.node);
	//
	// 			} else {
	//
	// 				const attributes = [...tag.node.attributes];
	//
	// 				for (let attribute of attributes) {
	//
	// 					if (!tag.isValidAttribute(attribute.name)) {
	//
	// 						tag.node.removeAttribute(attribute.name);
	//
	// 					}
	//
	// 				}
	//
	// 			}
	//
	// 		}
	//
	// 	}
	//
	// }

	isValid() {

		return false;

	}

	isValidIn(container) {

		return false;

  }

	isValidAttribute(key) {

		return false;

	}


	// deprec
	update(tagName, params) {

		return this.transform(tagName, params);

	}


	edit(tagName, attributes) {

		const tags = this.editor.query(tagName, attributes);

		if (tags.length) {

			for (let tag of tags) {

				tag.transform(tagName, attributes);

			}

		} else {

			this.wrapMe();

		}

	}

	toggle(tagName, attributes) {

		const tags = this.editor.query(tagName, attributes);

		if (tags.length) {

			for (let tag of tags) {

				tag.unwrap();

			}

		} else {

			this.wrapMe();

		}

	}

	transform(tagName, params, range) {

		// if (range) console.error("Deprecated range");

		this.editor.transformNode(this.node, tagName, params);


		// if (this.editor.beam.startContainer === this.node) {
		//
		// 	this.editor.beam.setStart(newNode, this.editor.beam.startOffset);
		//
		// }
		//
		// if (this.editor.beam.endContainer === this.node) {
		//
		// 	this.editor.beam.setEnd(newNode, this.editor.beam.endOffset);
		//
		// }

	}




	// transform_BKP(tagName, params, range) {
	//
	// 	if (tagName && this.getName() !== tagName) {
	//
  //     const newNode = document.createElement(tagName);
	//
	// 		while (this.node.firstChild) {
	//
	// 			newNode.appendChild(this.node.firstChild);
	//
  //     }
	//
	// 		if (this.node.parentNode) {
	//
	// 			this.node.replaceWith(newNode);
	//
	// 		}
	//
	// 		if (this.editor.beam.startContainer === this.node) {
	//
	// 			this.editor.beam.setStart(newNode, this.editor.beam.startOffset);
	//
	// 		}
	//
	// 		if (this.editor.beam.endContainer === this.node) {
	//
	// 			this.editor.beam.setEnd(newNode, this.editor.beam.endOffset);
	//
	// 		}
	//
	// 		this.node = newNode;
	//
  //   }
	//
  //   if (params) {
	//
	// 		this.updateAttributes(params);
	//
  //   }
	//
  // }
	//
	// updateAttributes(params) {
	//
	// 	this.removeAttributes();
	//
  //   for (let key in params) {
	//
  //     if (params[key]) {
	//
	// 			this.node.setAttribute(key, params[key]);
	//
  //     }
	//
  //   }
	//
  // }
	//
	// removeAttributes() {
	//
	// 	while (this.node.attributes.length) {
	//
	// 		this.node.removeAttributeNode(this.node.attributes[0]);
	//
  //   }
	//
  // }

	cut() {

		if (this.node === this.editor.beam.commonAncestorContainer) {

			// const outerContainer = this.getContainer();
			// const innerContainer = this.getInnerContainer().clone();
			// const content = this.editor.beam.extractContents();
			//
			// outerContainer.sanitize();
			//
			// this.editor.Beam.growUpStart(this.editor.beam);
			// this.editor.Beam.shrinkUpStart(this.editor.beam);
			//
			// this.editor.beam.collapse(true);
			//
			// innerContainer.node.appendChild(content);
			//
			// innerContainer.sanitize();
			//
			// return innerContainer.node.innerHTML;

			const outerContainer = this.getContainer();
			const innerContainer = this.editor.createTag("div");
			const content = this.editor.beam.extractContents();

			outerContainer.sanitize();

			this.editor.Beam.growUpStart(this.editor.beam);
			this.editor.Beam.shrinkUpStart(this.editor.beam);

			this.editor.beam.collapse(true);

			innerContainer.node.appendChild(content);

			innerContainer.sanitize();

			return innerContainer.node.innerHTML;

		} else {

			const parent = this.getParent();

			return parent.cut();

		}

	}

	remove() {

		if (this.node.parentNode) {

			this.node.parentNode.removeChild(this.node);

		}

	}

	insertInto(range) {

		let container = this.getTag(this.editor.beam.startContainer);

		container.insert(this, this.editor.beam);

	}

	// insert(tag, range = this.constructor.range) {
	//
	// 	range.insertNode(tag.node);
	//
	// 	// this.spoil();
	//
	// }

	insertInline(...tags) {

		for (let tag of tags) {

			this.editor.beam.insertNode(tag.node);
			this.editor.beam.collapse(false);

		}

		const parent = this.getParent();

		if (parent) {

			this.sanitize();

		}

	}

	insertBlock(...tags) {

		const parent = this.getParent();

		if (parent) {

			parent.insertBlock(...tags);

		}

	}

	insert(tag, beam) {

		console.error("deprecated");

		if (tag.getType() === "inline" || tag.getType() === "text") {

			this.editor.beam.insertNode(tag.node);

			this.sanitize();

		// } else if (false && tag.getType() === "block") {
		//
		// 	const range = new Range();
		// 	range.selectNodeContents(tag.node);
		// 	const content = range.extractContents();
		//
		// 	this.editor.beam.insertNode(content);
		//
		// 	this.sanitize();

		} else {

			const parent = this.getParent();

			if (parent) {

				parent.insert(tag);

			}

		}

	}

	wrap(tagName, attributes, range) {

		if (!range.collapsed) {

			const node = KarmaFieldsAlpha.Editor.createNode(tagName, attributes);

			range.surroundContents(node);

			node.normalize();

			// const content = range.extractContent();
			//
			// const node = KarmaFieldsAlpha.Editor.createNode(tag, attributes, content);
			//
			// const tag = this.getTag(node);
			//
			// tag.insertInto();


		}

  }

	wrapMe() {

		if (!this.editor.beam.collapsed) {

			this.editor.Beam.shrinkDown(this.editor.beam);
			this.editor.Beam.shrinkUp(this.editor.beam);

			this.editor.beam.surroundContents(this.node);

			const parent = this.getParent();

			if (parent) {

				parent.sanitize();

			}

		}

	}

	// unwrap() {
	//
	// 	if (!this.node || !this.node.parentNode) {
	//
  //     console.error("A valid node with a parent is required.");
  //     return;
	//
  //   }
	//
	// 	while (this.node.firstChild) {
	//
	// 		this.node.parentNode.insertBefore(this.node.firstChild, this.node);
	//
  //   }
	//
	// 	const parent = this.getParent();
	//
	// 	this.node.remove();
	//
	// 	parent.sanitize();
	//
	// 	// this.spoil();
	//
  // }

	extractContent() {

		const range = new Range();

		range.selectNodeContents(this.node);

		return range.extractContents();

	}

	unwrap() {

		const content = this.extractContent();

		this.editor.beam.setStartAfter(this.node);
		this.editor.beam.collapse(true);
		this.editor.beam.insertNode(content);

		const parent = this.getParent();

		parent.sanitize();
		// parent.normalize();

  }

	static createNode(tag, attributes, content) {

		const node = document.createElement(tag.toLowerCase());

		if (content) {

			// node.appendChild(content);

			while (content.firstChild) {

				node.appendChild(content.firstChild);

			}

		}

		if (attributes) {

			for (let key in attributes) {

	      if (attributes[key]) {

					node.setAttribute(key, attributes[key]);

	      }

	    }

		}

		return node;

	}

	// has(tag) {
	//
	// 	return this.name === tag;
	//
	// }

	breakLine(range) {

		let contentBefore = this.extractBefore();
		let contentAfter = this.extractAfter();


		if (!contentBefore.isEmpty()) {

			this.editor.beam.insertNode(contentBefore.node);
			this.editor.beam.collapse(false);

		}

		this.editor.beam.insertNode(document.createElement("br"));
		this.editor.beam.collapse(false);

		if (!contentAfter.isEmpty()) {

			this.editor.beam.insertNode(contentAfter.node);
			this.editor.beam.collapse(true);

		} else {

			this.editor.beam.insertNode(document.createElement("br"));
			this.editor.beam.collapse(true);

		}

	}


	backwardDelete() {

	}

	extractBefore(range) {

		this.editor.beam.setStart(this.node, 0);

		const content = this.editor.beam.extractContents();
		const tag = this.getTag(content);
		tag.sanitize();

		return tag;

	}

	extractAfter(range) {

		this.editor.beam.setEnd(this.node, this.getLength());

		const content = this.editor.beam.extractContents();
		const tag = this.getTag(content);
		tag.sanitize();

		return tag;

	}
	//
	// trim() {
	//
	// 	let tag = this.getTag(this.node.lastChild);
	//
	// 	while (tag && (tag.name === "BR" || tag.isEmpty())) {
	//
	// 		this.node.removeChild(tag.node);
	//
	// 		tag = this.getTag(this.node.lastChild);
	//
	// 	}
	//
	// }

	trim() {

		while (this.node.lastChild && this.getTag(this.node.lastChild).isEmpty()) {

			this.node.removeChild(this.node.lastChild);

		}

	}

}

KarmaFieldsAlpha.Editor.Tag.content = class extends KarmaFieldsAlpha.Editor.Tag {

	// constructor(node) {
	//
	// 	super(node);
	//
	// 	this.name = "content";
	//
	// }

	getName() {

		return "content";

	}

	getType() {

		return "content";

	}

	getParent() {

	}

	sanitizeChild() {

		// -> do nothing!

	}

	sanitize() {

		this.sanitizeChildren()

		// const children = [...this.node.childNodes];
		//
		// for (let child of children) {
		//
		// 	const tag = this.getTag(child);
		//
		// 	tag.sanitize();
		//
		// }

	}

}

KarmaFieldsAlpha.Editor.Tag.text = class extends KarmaFieldsAlpha.Editor.Tag {

	// constructor(node) {
	//
	// 	super(node);
	//
	// 	this.name = "text";
	//
	// }

	getName() {

		return "text";

	}

	getType() {

		return "text";

	}

	is(name) {

		return name === "text" || name === "inline";

	}

	isValid() {

		return this.node.length > 0;

	}

	isValidIn(container) {

		const type = container.getType();

		return type === "block" || type === "inline";

	}

	*listTags(range) {

	}

	sanitize() {
		//
		// this.node.textContent = this.node.textContent.trim();
		//
		// if (this.node.textContent[this.node.textContent.length - 1] === "")

		super.sanitize();
	}

	// sanitize() {
	//
	// 	const parent = this.getParent();
	//
	// 	if (parent) {
	//
	// 		if (!parent.isValid() || !this.isValidIn(parent)) {
	//
	// 			if (parent.node.parentNode && !parent.isRoot()) {
	//
	// 				parent.node.parentNode.insertBefore(this.node, parent.node);
	//
	// 				this.sanitize();
	//
	// 			} else {
	//
	// 				parent.node.removeChild(this.node);
	//
	// 			}
	//
	// 		} else {
	//
	// 			if (!this.isValid()) {
	//
	// 				parent.node.removeChild(this.node);
	//
	// 			}
	//
	// 		}
	//
	// 	}
	//
  // }

	breakLine(shift, beam) {

		const parent = this.getParent();

		parent.breakLine(shift, beam);

	}



	// => text
	backwardDelete(beam) {

		if (this.editor.beam.startOffset > 0) {

			return false

		} else {

			this.editor.beam.setStartBefore(this.node);
			// KarmaFieldsAlpha.Editor.Beam.growDown(beam);
			this.editor.beam.collapse(true);

			const tag = this.getTag(this.editor.beam.startContainer);

			return tag.backwardDelete(this.editor.beam);

		}

	}

}

KarmaFieldsAlpha.Editor.Tag.element = class extends KarmaFieldsAlpha.Editor.Tag {

	// constructor(node) {
	//
	// 	super(node);
	//
	// 	this.name = node.tagName;
	//
	// }

	getName() {

		return this.node.tagName;

	}

	is(name) {

		return name === "element" || name === this.node.tagName;

	}

	isValid() {

		return this.node.hasChildNodes();

	}

	sanitizeAttributes() {

		if (this.node && this.node.attributes) {

			const attributes = [...this.node.attributes];

			for (let attribute of attributes) {

				if (!this.isValidAttribute(attribute.name)) {

					this.node.removeAttribute(attribute.name);

				}

			}

		}


	}

	sanitize() {

		this.sanitizeChildren();

		this.sanitizeAttributes();

		this.node.normalize();

		super.sanitize();

	}

}

KarmaFieldsAlpha.Editor.register("text", KarmaFieldsAlpha.Editor.Tag.text);
KarmaFieldsAlpha.Editor.register("content", KarmaFieldsAlpha.Editor.Tag.content);



KarmaFieldsAlpha.Editor.Tag.BR = class extends KarmaFieldsAlpha.Editor.Tag.element {

	constructor(node) {

		super(node);

		this.type = "text";
		this.single = true;

	}

	getType() {

		return "text";

	}

	isEmpty() {

		return true;

	}

	isSingle() {

		return true;

	}

	isValid() {

		return true;

	}

	isValidIn(container) {

		return container.getType() === "block";

	}

}

KarmaFieldsAlpha.Editor.register("BR", KarmaFieldsAlpha.Editor.Tag.BR);
