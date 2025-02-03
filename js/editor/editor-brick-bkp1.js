

KarmaFieldsAlpha.Editor.Brick = class {

	constructor(node, range) {

		this.node = node;
		this.range = range;

  }

	getParent() {

		return this.constructor.get(this.node.parentNode, this.range);

	}

	getLength() {

		return this.node.childNodes.length;

	}

	getBrick(node) {

		return this.constructor.get(node, this.range);

	}

	isEmpty() {

		return !this.node.textContent.trim();

	}

	forwardRange() {

		if (this.node.firstChild) {

			this.getBrick(this.node.firstChild).forwardRange();

		} else if (this.node.nextChild) {

			this.getBrick(this.node.nextChild).forwardRange();

		} else {

			this.getParent().forwardRange();

		}

		// while (range.startContainer.firstChild && (this.isText(range.startContainer.firstChild) || this.isInline(range.startContainer.firstChild))) {
		//
		// 	range.setStart(range.startContainer.firstChild, 0);
		// 	range.collapse(true);
		//
		// }

	}

	backwardRange() {

		if (this.range.startOffset > 0) {

			const node = this.range.startContainer.childNodes[this.range.startOffset - 1];
			const brick = this.getBrick(node);
			this.range.setStart(brick.node, brick.getLength());
			this.range.collapse(true);
			brick.backwardRange();

		} else {

			this.range.setStartBefore(this.node);
			this.range.collapse(true);
			const brick = this.getBrick(this.node);
			brick.backwardRange();

		}

	}

	static get(node, range) {

		let node = range.startContainer;

		if (node.nodeType === 1 && this[node.tagName]) {

			return new this[node.tagName](node, range);

		} else if (node.nodeType === 3) {

			return new this.text(node, range);

		} else {

			return new this(node, range);

		}

	}

	break(shift) {



	}

}

KarmaFieldsAlpha.Editor.Brick.DIV = class extends KarmaFieldsAlpha.Editor.Brick {

	constructor(node, range) {

		super(node, range);

  }

}

KarmaFieldsAlpha.Editor.Brick.root = class extends KarmaFieldsAlpha.Editor.Brick {

	forwardRange() {

		console.warn("range at end!");

	}

	backwardRange() {

		if (this.range.startOffset > 0) {

			super.backwardRange();

		} else {

			console.warn("range at start");

		}

	}

	break(shift) {

		while (range.startContainer !== this.node) {

			range.setStartAfter(range.startContainer);
			range.colllapse(true);

		}

		const block = document.createElement("p");
		block.appendChild(document.createElement("br"));

		this.range.insertNode(block);
		this.range.setStart(block, 0);
		this.range.collapse(true);

	}

}

KarmaFieldsAlpha.Editor.Brick.container = class extends KarmaFieldsAlpha.Editor.Brick {

	break(shift) {

		const parent = this.getParent();

		if (parent.node.tagName !== "DIV") {

			parent.break(shift);

		} else {

			this.range.setStart(this.node, 0);
			const contentBefore = this.range.cloneContents();
			contentBefore.normalize();

			const block = document.createElement("p");
			block.appendChild(document.createElement("br"));

			if (!contentBefore.hasChildNodes()) {

				this.range.setStartBefore(this.node);
				this.range.collapse(true);
				this.range.insertNode(block);
				this.range.setStart(this.node, 0);
				this.range.collapse(true);

			} else {

				this.range.setStartAfter(this.node);
				this.range.collapse(true);
				this.range.insertNode(block);
				this.range.setStart(block, 0);
				this.range.collapse(true);

			}

		}

	}

}

KarmaFieldsAlpha.Editor.Brick.block = class extends KarmaFieldsAlpha.Editor.Brick {

	getContainer() {

		let container = this;

		let parent = this.getParent();

		while (parent.node.tagName !== "DIV") {

			container = parent;

		}

		return container;
	}



	empty() {

		while (this.node.firstChild) {

			this.node.removeChild(this.node.firstChild);

		}

	}

	extractContentBefore() {

		this.range.setStart(this.node, 0);

		let content = this.range.extractContents();

		// -> clean content before
		while (content.lastChild && (this.getBrick(content.lastChild).isEmpty() || content.lastChild.tagName === "BR")) {

			content.removeChild(content.lastChild);

		}

		content.normalize();

		return content;
	}

	extractContentAfter() {

		if (this.node.lastChild) {

			this.range.setEndAfter(this.node.lastChild);

		}

		let content = this.range.extractContents();

		content.normalize();

		return content;
	}

	break(shift) {

		let contentBefore = this.extractContentBefore();
		let contentAfter = this.extractContentAfter();

		if (shift) {

			if (contentBefore.hasChildNodes()) {

				this.range.insertNode(contentBefore);
				this.range.collapse(false);

			}

      this.range.insertNode(document.createElement("br"));
      this.range.collapse(false);

      if (!this.isEmpty(contentAfter)) {

        this.range.insertNode(contentAfter);
        this.range.collapse(true);

			} else {

        this.range.insertNode(document.createElement("br"));
        this.range.collapse(true);

			}

		} else {

			const container = this.getContainer();

			const block = document.createElement("p");

			if (!contentBefore.hasChildNodes()) {

				block.appendChild(document.createElement("br"));

				this.range.setStartBefore(container.node);
				this.range.collapse(true);
				this.range.insertNode(block);
				this.range.collapse(false);

				if (!contentAfter.hasChildNodes()) {

					if (this.allowEmptyParagraph) {

						this.node.appendChild(document.createElement("br"));

						this.range.setStart(this.node, 0);
						this.range.collapse(true);

					} else {

						this.range.selectNode(this.node);
						this.range.deleteContents();
						this.range.setStart(block, 0);
						this.range.collapse(true);

					}

				} else {

					this.node.appendChild(contentAfter);

					this.range.setStart(this.node, 0);
					this.range.collapse(true);

				}

			} else {

				this.node.appendChild(contentBefore);

				if (contentAfter.hasChildNodes()) {

					block.appendChild(contentAfter);

				} else {

					block.appendChild(document.createElement("br"));

				}

				this.range.setStartAfter(container.node);
				this.range.collapse(true);
				this.range.insertNode(block);
				this.range.setStart(block, 0);
				this.range.collapse(true);

			}

		}

	}

	backwardDelete() {

		if (this.range.startOffset > 0) {

			return false;

		} else {

			this.range.setStartBefore(this.node);
			this.range.collapse(true);

			return this.getBrick(this.range.startContainer).backwardDelete();

		}

	}

}



KarmaFieldsAlpha.Editor.Brick.inline = class extends KarmaFieldsAlpha.Editor.Brick {

	break(shift) {

		const brick = this.getParent();

		brick.break(shift);

	}

	backwardDelete() {

		if (this.range.startOffset > 0) {

			return false;

		} else {

			this.range.setStartBefore(this.node);
			this.range.collapse(true);

			return this.getBrick(this.range.startContainer).backwardDelete();

		}

	}



}

KarmaFieldsAlpha.Editor.Brick.text = class extends KarmaFieldsAlpha.Editor.Brick.inline {

	getLength() {

		return this.node.length;

	}

	forwardRange() {

		this.range.setStart(this.node, 0);
		this.range.collapse(true);

	}

}

KarmaFieldsAlpha.Editor.Brick.single = class extends KarmaFieldsAlpha.Editor.Brick {

	forwardRange() {

		this.range.setStartBefore(this.node, 0);
		this.range.collapse(true);

	}

}


KarmaFieldsAlpha.Editor.Brick.P = class extends KarmaFieldsAlpha.Editor.Brick.block {

	constructor(node, range) {

		super(node, range);

		this.allowEmptyParagraph = true;

	}

}

KarmaFieldsAlpha.Editor.Brick.LI = class extends KarmaFieldsAlpha.Editor.Brick.block {

	break(shift) {

		if (shift) {

			super.break(shift);

		} else {

			const container = this.getContainer();

			let contentBefore = this.extractContentBefore();
			let contentAfter = this.extractContentAfter();

			this.empty();

			if (!contentBefore.hasChildNodes() && this.node === this.node.parentNode.lastChild) {

				const block = document.createElement("p");

				if (!contentAfter.hasChildNodes()) {

					block.appendChild(document.createElement("br"));

				} else {

					block.appendChild(contentAfter);

				}

				this.range.selectNode(this.node);
				this.range.deleteContents();

				this.range.setStartAfter(container.node);
				this.range.collapse(true);
				this.range.insertNode(block);
				this.range.setStart(block, 0);
				this.range.collapse(true);

				if (container.isEmpty()) {

					container.remove();

				}

			} else if (!contentBefore.hasChildNodes() && this.node === this.node.parentNode.firstChild) {

				const block = document.createElement("p");
				block.appendChild(document.createElement("br"));

				if (!contentAfter.hasChildNodes()) {

					this.node.appendChild(document.createElement("br"));

				} else {

					this.node.appendChild(contentAfter);

				}

				this.range.setStartBefore(container.node);
				this.range.collapse(true);
				this.range.insertNode(block);

				this.range.setStart(this.node, 0);
				this.range.collapse(true);

			} else {

				if (!contentBefore.hasChildNodes()) {

					this.node.appendChild(document.createElement("br"));

				} else {

					this.node.appendChild(contentBefore);

				}

				this.range.setStartAfter(this.node);
				this.range.collapse(true);

				const block = document.createElement(this.node.tagName.toLowerCase());

				if (!contentAfter.hasChildNodes()) {

					block.appendChild(document.createElement("br"));

				} else {

					block.appendChild(contentAfter);

				}

				range.insertNode(block);
				range.setStart(block, 0);

				range.collapse(true);

			}

		}


	}

}




KarmaFieldsAlpha.Editor.register([
	"DIV"
], {
	type: "container",
	validInTags: ["DIV"],
	validAttributes: ["class"],
	breakMode: "div"
});

KarmaFieldsAlpha.Editor.register([
	"FIGURE"
], {
	type: "container",
	validInTags: ["DIV"],
	validAttributes: ["id"],
	breakMode: "container"
});

KarmaFieldsAlpha.Editor.register([
	"UL",
	"OL"
], {
	type: "container",
	validInTags: ["DIV"],
	mergeableInTags: ["UL", "OL"],
	breakMode: "container"
});

KarmaFieldsAlpha.Editor.register([
	"TABLE"
], {
	type: "container",
	validInTags: ["DIV"],
	breakMode: "container"
});

KarmaFieldsAlpha.Editor.register([
	"TBODY",
	"THEAD",
	"TFOOTER"
], {
	type: "container",
	validInTags: ["TABLE"],
	breakMode: "container"
});

KarmaFieldsAlpha.Editor.register([
	"TR"
], {
	type: "container",
	validInTags: ["TABLE", "TBODY", "THEAD", "TFOOTER"],
	breakMode: "container"
});


// BLOCKS

KarmaFieldsAlpha.Editor.register([
	"TH",
	"TD"
], {
	type: "block",
	validInTags: ["TR"],
	breakMode: "container"
});

KarmaFieldsAlpha.Editor.register([
	"FIGCAPTION"
], {
	type: "block",
	validInTags: ["FIGURE"],
	breakMode: "paragraph"
});

KarmaFieldsAlpha.Editor.register([
	"P"
], {
	type: "block",
	validInTags: ["DIV"],
	breakMode: "paragraph",
	mergeableInTypes: ["block"]
});

KarmaFieldsAlpha.Editor.register([
	"BLOCKQUOTE"
], {
	type: "block",
	validInTags: ["DIV"],
	breakMode: "paragraph",
	mergeableInTypes: ["block"]
});

KarmaFieldsAlpha.Editor.register([
	"LI"
], {
	type: "block",
	validInTags: ["UL", "OL"],
	breakMode: "list-item",
	mergeableInTypes: ["block"]
});

KarmaFieldsAlpha.Editor.register([
	"H1",
	"H2",
	"H3",
	"H4",
	"H5",
	"H6"
], {
	type: "block",
	validInTags: ["DIV"],
	breakMode: "paragraph",
	mergeableInTypes: ["block"]
});



// INLINE

KarmaFieldsAlpha.Editor.register([
	"A"
], {
	type: "inline",
	validInTypes: ["block", "inline"],
	validAttributes: ["href", "target"]
});

KarmaFieldsAlpha.Editor.register([
	"SPAN"
], {
	type: "inline",
	validInTypes: ["block", "inline"],
	validAttributes: ["style"]
});

KarmaFieldsAlpha.Editor.register([
	"B",
	"STRONG",
	"EM",
	"I",
	"SUB",
	"SUP",
	"SMALL"
], {
	type: "inline",
	validInTypes: ["block", "inline"]
});



// SINGLES

KarmaFieldsAlpha.Editor.register([
	"IMG"
], {
	type: "single",
	validInTags: ["P", "FIGURE"],
	validAttributes: ["src", "width", "height", "srcset", "sizes", "alt", "title", "data-id"]
});

KarmaFieldsAlpha.Editor.register([
	"VIDEO"
], {
	type: "single",
	validInTags: ["P", "FIGURE"],
	validAttributes: ["data-id", "src", "width", "height", "alt", "title", "autoplay", "loop", "controls"]
});

KarmaFieldsAlpha.Editor.register([
	"BR"
], {
	type: "single",
	validInTypes: ["block"]
});
KarmaFieldsAlpha.Editor.register([
	"HR"
], {
	type: "single",
	validInTypes: ["container"]
});
