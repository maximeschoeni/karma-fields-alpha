KarmaFieldsAlpha.Editor.Tag.container = class extends KarmaFieldsAlpha.Editor.Tag.element {

	constructor(node) {

		super(node);

		this.type = "container";

  }

	getName() {

		return "container";

	}

	is(name) {

		return name === "container" || super.is(name);

	}

	getType() {

		return "container";

	}

	isValid() {

		return this.node.hasChildNodes();

	}

	breakLine(shift) {

		//?

	}

	insertBlock(...tags) {

		while (this.editor.beam.endContainer !== this.node) {

			this.editor.beam.setEndAfter(this.editor.beam.endContainer);

		}

		const contentAfter = this.editor.beam.extractContents();
		const tagAfter = this.getTag(contentAfter);
		tagAfter.sanitize();

		for (let tag of tags) {

			this.editor.beam.insertNode(tag.node);
			this.editor.beam.collapse(false);

			// this.sanitizeChild(tag);

		}

		tagAfter.trim();

		if (!tagAfter.isEmpty()) {

			this.editor.beam.insertNode(tagAfter.node);
			this.editor.beam.collapse(true);

		}

		this.sanitize();

		this.editor.Beam.growUpStart(this.editor.beam);
		this.editor.beam.collapse(true);

	}





}


KarmaFieldsAlpha.Editor.Tag.root = class extends KarmaFieldsAlpha.Editor.Tag.container {

	// constructor(node) {
	//
	// 	super(node);
	//
	// 	this.root = KarmaFieldsAlpha.Editor.element === node;
	//
  // }


	isRoot() {

		return this.editor.element === this.node;

	}

	isValid() {

		return this.isRoot();

	}

	isValidAttribute(key) {

		if (this.isRoot()) {

			return true;

		}

	}

	// sanitizeAttributes() {
	//
	// }

	// canFixChild(tag) {
	//
	// 	return this.isRoot() && tag.is("text");
	// }
	//
	// fixChild(tag) {
	//
	// 	if (this.isRoot() && tag.is("text")) {
	//
	// 		const p = this.createTag("p");
	// 		this.node.insertBefore(p.node, tag.node);
	// 		p.node.appendChild(tag.node);
	//
	// 	}
	//
	// }

	isEmpty() {

		return this.node.firstChild
			&& this.node.firstChild === this.node.lastChild
			&& this.node.firstChild.tagName === "P"
			&& !this.node.textContent
			&& this.getTag(this.node.firstChild).isEmptyBlock();

	}

	reset() {

		this.empty();

		const p = document.createElement("p");
		p.appendChild(document.createElement("br"));
		this.node.appendChild(p);

	}

	getContent() {

		if (this.isEmpty()) {

			return "";

		} else {

			return this.node.innerHTML;

		}

  }

	setContent(content) {

    if (content) {

			this.node.innerHTML = content;

			this.sanitize();

    } else {

			this.reset();

    }

  }


	breakLine(shift) {
		 // ?
	}

	sanitizeChild(tag) {

		if (this.isRoot()) {

			if (tag.getType() === "text" || tag.getType() === "inline") {

				const p = this.createTag("P");

				if (tag.node.parentNode) {

					tag.node.parentNode.insertBefore(p.node, tag.node);

				}

				p.node.appendChild(tag.node);

			} else if (tag.getType() === "block" && !tag.isValidIn(this)) {

				tag.transform("P", {});

			} else if (!tag.isValidIn(this)) {

				if (tag.node.parentNode) {

					tag.node.parentNode.removeChild(tag.node);

				}

			}

		} else {

			const parent = this.getParent();

			if (parent) { // -> div to discard

				parent.node.insertBefore(tag.node, this.node);

				parent.sanitizeChild(tag);

			} // else -> just a container we use to sanitize children inside

		}

	}

	// insertBlock(...tags) {
	//
	// 	while (this.editor.beam.endContainer !== this.node) {
	//
	// 		this.editor.beam.setEndAfter(this.editor.beam.endContainer);
	//
	// 	}
	//
	// 	const contentAfter = this.editor.beam.extractContents();
	// 	const tagAfter = this.getTag(contentAfter);
	// 	tagAfter.sanitize();
	//
	// 	for (let tag of tags) {
	//
	// 		this.editor.beam.insertNode(tag.node);
	// 		this.editor.beam.collapse(false);
	//
	// 		this.sanitizeChild(tag);
	//
	// 		// if (child) {
	// 		//
	// 		// 	this.editor.beam.insertNode(child.node);
	// 		// 	this.editor.beam.collapse(false);
	// 		//
	// 		// }
	//
	// 	}
	//
	// 	tagAfter.trim();
	//
	// 	if (!tagAfter.isEmpty()) {
	//
	// 		this.editor.beam.insertNode(tagAfter.node);
	// 		this.editor.beam.collapse(true);
	//
	// 	}
	//
	// 	this.sanitize();
	//
	// 	this.editor.Beam.growUpStart(this.editor.beam);
	// 	this.editor.beam.collapse(true);
	//
	// }

}

KarmaFieldsAlpha.Editor.register("DIV", KarmaFieldsAlpha.Editor.Tag.root);
