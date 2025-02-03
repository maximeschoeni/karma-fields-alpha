KarmaFieldsAlpha.Editor.Tag.block = class extends KarmaFieldsAlpha.Editor.Tag.element {

	// constructor(node) {
	//
	// 	super(node);
	//
	// 	this.type = "block";
	//
  // }

	is(name) {

		return name === "block" || super.is(name);

	}

	getType() {

		return "block";

	}

	isValid() {

		return this.node.hasChildNodes();

	}

	empty() {

		while (this.node.firstChild) {

			this.node.removeChild(this.node.firstChild);

		}

	}

	sanitizeChildren() {

		super.sanitizeChildren();

		if (!this.node.hasChildNodes()) {

			this.node.appendChild(document.createElement("br"));

		}

	}

	// sanitize() {
	//
	// 	this.sanitizeChildren();
	//
	// 	this.sanitizeAttributes();
	//
	// 	this.node.normalize();
	//
	// 	if (!this.node.hasChildNodes()) {
	//
	// 		this.node.appendChild(document.createElement("br"));
	//
	// 	}
	//
	// 	super.sanitize();
	//
	// }


	breakLine(shift, beam) {

		if (shift) {

			super.breakLine(shift, beam);

		} else {

			const container = this.getContainer();

			let contentBefore = this.extractBefore(this.editor.beam);

			const block = this.createTag("P");

			if (contentBefore.isEmpty()) {

				block.node.appendChild(document.createElement("br"));

				this.editor.beam.setStartBefore(container.node);
				this.editor.beam.collapse(true);
				this.editor.beam.insertNode(block.node);
				this.editor.beam.collapse(false);

				if (this.isEmptyBlock()) {

					this.empty();

					if (this.allowEmpty) {

						this.node.appendChild(document.createElement("br"));

						this.editor.beam.setStart(this.node, 0);

					} else {

						this.editor.beam.selectNode(this.node);
						this.editor.beam.deleteContents();
						this.editor.beam.setStart(block.node, 0);
						this.editor.beam.collapse(true);

					}

				} else {

					this.editor.beam.setStart(this.node, 0);

				}

			} else {

				const contentAfter = this.extractAfter(this.editor.beam);

				this.node.appendChild(contentBefore.node);

				if (contentAfter.isEmpty()) {

					block.node.appendChild(document.createElement("br"));

				} else {

					block.node.appendChild(contentAfter.node);

				}

				this.editor.beam.setStartAfter(container.node);
				this.editor.beam.collapse(true);
				this.editor.beam.insertNode(block.node);
				this.editor.beam.setStart(block.node, 0);

			}

		}

		// beam.shrinkUp();
		// KarmaFieldsAlpha.Editor.Beam.shrinkUp(beam);
		this.editor.Beam.shrinkUpStart(this.editor.beam);

		this.editor.beam.collapse(true);

	}

	isEmptyBlock() {

		for (let child of this.node.childNodes) {

			if (child.tagName !== "BR") {

				return false;

			}

		}

		return true;

	}

	// merge(tag, beam) {
	//
	// 	if (this.isEmptyBlock()) {
	//
  //     this.empty();
	//
	// 		if (tag.isEmptyBlock()) {
	//
	// 			beam.setStart(this.node, 0);
	// 			beam.collapse(false);
	// 			beam.insertNode(document.createElement("br"));
	// 			beam.collapse(true);
	//
	// 		} else {
	//
	// 			beam.selectNodeContents(tag.node);
	// 			const content = range.extractContents();
	// 			content.normalize();
	//
	// 			beam.selectNodeContents(this.node);
	// 			beam.collapse(false);
	// 			beam.insertNode(content);
	// 			beam.collapse(true);
	//
	// 		}
	//
	// 	} else {
	//
	// 		if (!tag.isEmptyBlock()) {
	//
	// 			beam.selectNodeContents(tag.node);
	// 			const content = range.extractContents();
	// 			content.normalize();
	//
	// 			beam.selectNodeContents(this.node);
	// 			beam.collapse(false);
	// 			beam.insertNode(content);
	// 			beam.collapse(true);
	//
	// 		}
	//
	// 	}
	//
	// 	brick.node.remove();
	//
	// 	this.sanitize();
	//
  // }

	extract() {

		const range = new Range();

		range.selectNodeContents(this.node);

		const content = range.extractContents();

		// content.normalize();

		const tag = this.getTag(content);

		// tag.sanitize();

		return tag

	}

	merge(tag) {

		if (tag.isEmptyBlock()) {

			tag.remove();

			this.editor.beam.setStart(this.node, this.getLength());
			this.editor.Beam.growUpStart(this.editor.beam);
			this.editor.beam.collapse(true);

		} else {

			if (this.isEmptyBlock()) {

	      this.empty();

			}

			const range = new Range();
			range.selectNodeContents(tag.node);
			const content = range.extractContents();
			// content.normalize();

			// const content = this.extract();

			this.editor.beam.selectNodeContents(this.node);
			this.editor.beam.collapse(false);
			this.editor.beam.insertNode(content);
			this.editor.beam.collapse(true);

			if (this.isEmptyBlock()) {

				this.editor.beam.insertNode(document.createElement("br"));
				this.editor.beam.collapse(true);

			} else {

				this.editor.Beam.growUpEnd(this.editor.beam);
				this.editor.beam.collapse(true);

			}

			tag.remove();
			this.sanitize();

		}



  }

	getPreviousBlock() {

		let node = this.node;

		while (!node.previousSibling && node.parentNode && node.parentNode !== this.editor.element) {
		// while (!node.previousSibling && node.parentNode && !this.getTag(node.parentNode).isRoot()) {

			node = node.parentNode;

		}

		node = node.previousSibling;

		if (node) {

			let tag = this.getTag(node);

			while (tag.is("container") && tag.node.lastChild) {

				tag = this.getTag(tag.node.lastChild);

			}

			if (tag.is("block")) {

				return tag;

			}

		}

	}


	// beam
	backwardDelete(beam) {

		if (beam.startOffset > 0) {

			return super.backwardDelete(beam);

		} else {

			// while (beam.startOffset === 0 && !this.getTag(beam.startContainer).isRoot()) {
			//
			// 	// KarmaFieldsAlpha.Editor.Beam.growDown(beam);
			// 	beam.setStartBefore(beam.startContainer);
			//
			// }

			// KarmaFieldsAlpha.Editor.Beam.growDownStart(beam);
			//
			// beam.collapse(true);
			//
			// const container = beam.startContainer;
			//
			// let leftTag = this.getTag(beam.startContainer.childNodes[beam.startOffset - 1]);
			//
			// while (leftTag && !leftTag.is("block")) {
			//
			// 	leftTag = leftTag.getLastChild();
			//
			// }

			const leftTag = this.getPreviousBlock();

			if (leftTag) {

				if (leftTag.isEmptyBlock()) {

					leftTag.node.remove();
					beam.setStart(this.node, 0);

				} else {

					leftTag.merge(this, beam);

				}

			}

			this.editor.Beam.growUpStart(beam);
			beam.collapse(true);

			return true;

		}

	}

	cut() {

		if (this.node === this.editor.beam.commonAncestorContainer) {

			return super.cut();

		} else {

			const html = super.cut();

			const left = this.getPreviousBlock();

			if (left) {

				left.merge(this);

			}

			return html;

		}

	}

	// insert(tag, beam) {
	//
	// 	if (false && tag.getType() === "block") {
	//
	// 		if (this.isEmptyBlock()) {
	//
	// 			this.empty();
	//
	// 		}
	//
	// 		const content = tag.extract();
	//
	// 		this.editor.beam.insertNode(content.tag);
	//
	// 		tag.node.remove();
	//
	// 		this.sanitize();
	//
	// 	} else if (tag.getType() === "inline" || tag.getType() === "text") {
	//
	// 		if (this.isEmpty()) {
	//
	// 			this.empty();
	//
	// 		}
	//
	// 		super.insert(tag);
	//
	// 	} else if (!this.isRoot()) {
	//
	// 		this.getParent().insert(tag, this.editor.beam);
	//
	// 	}
	//
	// }

	insertInline(...tags) {

		if (this.isEmptyBlock()) {

			this.empty();

		}

		for (let tag of tags) {

			this.editor.beam.insertNode(tag.node);
			this.editor.beam.collapse(false);

		}

		this.sanitize();

	}

	insertBlock(...tags) {

		super.insertBlock(...tags);

		if (this.isEmptyBlock()) {

			this.node.remove();

		}

	}

	// static *listBlocks(range) {
	//
	// 	for (let brick of this.listBricksAt()) {
	//
	// 		if (brick.type === "block") {
	//
	// 			yield brick;
	//
	// 		}
	//
	// 	}
	//
	// }

	// wrap(tagName, attributes, beam) {
	//
	// 	const commonAncestor = this.getTag(beam.commonAncestorContainer);
	//
	// 	const blocks = this.editor.query("block");
	//
	// 	beam.deleteRange();
	//
	// 	for (let block of blocks) {
	//
	// 		const tag = this.createTag(tagName, attributes, block);
	//
	// 		tag.insertInto(beam);
	//
	// 		range.collapse(false);
	//
	// 	}
	//
	// 	commonAncestor.sanitize();
	//
	// }



	wrap(tagName, attributes, beam) {

		const blocks = this.editor.query("block");

		for (let block of blocks) {

			const content = block.extractContent();
			const tag = this.createTag(tagName, attributes);

			tag.node.appendChild(content);

			const container = block.getContainer();

			this.editor.beam.setStartAfter(container.node);
			this.editor.beam.collapse(true);
			this.editor.beam.insertNode(tag.node);

			container.sanitize();

		}

	}

	wrapMe() {

		const blocks = this.editor.query("block");

		if (blocks) {

			for (let block of blocks) {

				const content = block.extractContent();
				const tag = this.clone();

				tag.node.appendChild(content);

				const container = block.getContainer();

				this.editor.beam.setStartAfter(container.node);
				this.editor.beam.collapse(true);
				this.editor.beam.insertNode(tag.node);

				block.node.remove();

				container.sanitize();

			}

		} else { // -> create empty block

			this.node.appendChild(document.createElement("BR"));

			while (!this.editor.isRoot(this.editor.beam.startContainer)) {

				this.editor.beam.setStartAfter(this.editor.beam);
				this.editor.beam.collapse(true);

			}

			this.editor.beam.insertNode(this.node);
			this.editor.beam.setStart(this.node, 0);
			this.editor.beam.collapse(true);

		}

	}

	// transform(tagName, attributes) {
	//
	// 	if (this.node.isConnected) {
	//
	// 		super.transform(tagName, attributes);
	//
	// 	} else {
	//
	// 		this.wrapMe();
	//
	// 	}
	//
	// }

	unwrap() {

		// -> do nothing!

	}

	toggle() {

		// -> do nothing

		// if (this.node.isConnected) {
		//
		// 	this.transform("P");
		// 	this.editor.beam.selectNodeContents(this.node);
		//
		// } else {
		//
		// 	this.wrapMe();
		//
		// }

	}


	// transform(tagName, attributes) {
	//
	// 	if (this.node) {
	//
	// 		super.transform(tagName, attributes);
	//
	// 	} else {
	//
	// 		const blocks = this.editor.query("block");
	//
	// 		for (let block of blocks) {
	//
	// 			const content = block.extractContent();
	// 			const tag = this.createTag(tagName, attributes);
	//
	// 			tag.node.appendChild(content);
	//
	// 			const container = block.getContainer();
	//
	// 			this.editor.beam.setStartAfter(container.node);
	// 			this.editor.beam.collapse(true);
	// 			this.editor.beam.insertNode(tag.node);
	//
	// 			container.sanitize();
	//
	// 		}
	//
	// 	}
	//
	// }

}

KarmaFieldsAlpha.Editor.Tag.P = class extends KarmaFieldsAlpha.Editor.Tag.block {

	constructor(node) {

		super(node);

		this.allowEmpty = true;

	}

	isValidIn(container) {

		return container.is("DIV");

	}

}

KarmaFieldsAlpha.Editor.register("P", KarmaFieldsAlpha.Editor.Tag.P);


KarmaFieldsAlpha.Editor.Tag.heading = class extends KarmaFieldsAlpha.Editor.Tag.block {

	constructor(node) {

		super(node);

		this.heading = true;

	}

	is(tag) {

		return tag === "heading" || super.is(tag);

	}



	isValidIn(container) {

		return container.is("DIV");

	}

	unwrap() {

		this.transform("P");
		this.editor.beam.selectNodeContents(this.node);

	}

	toggle() {

		const tags = this.editor.query("heading");

		if (tags.length) {

			for (let tag of tags) {

				tag.unwrap();

			}

		} else {

			this.wrapMe();

		}

	}


}

KarmaFieldsAlpha.Editor.register("H1", KarmaFieldsAlpha.Editor.Tag.heading);
KarmaFieldsAlpha.Editor.register("H2", KarmaFieldsAlpha.Editor.Tag.heading);
KarmaFieldsAlpha.Editor.register("H3", KarmaFieldsAlpha.Editor.Tag.heading);
KarmaFieldsAlpha.Editor.register("H4", KarmaFieldsAlpha.Editor.Tag.heading);
KarmaFieldsAlpha.Editor.register("H5", KarmaFieldsAlpha.Editor.Tag.heading);
KarmaFieldsAlpha.Editor.register("H6", KarmaFieldsAlpha.Editor.Tag.heading);
