
KarmaFieldsAlpha.Editor.Beam = class extends Range {

	constructor(range) {

		super();

		this.setStart(range.startContainer, range.startOffset);
		this.setEnd(range.endContainer, range.endOffset);

		// this.tags = [...this.listTags()];

	}

	shrinkUp() {

		this.shrinkUpStart();
		this.shrinkUpEnd();

	}

	shrinkDown() {

		this.shrinkDownStart();
		this.shrinkDownEnd();

	}

	growUp() {

		this.growUpStart();
		this.growUpEnd();

	}

	growDown() {

		this.growDownStart();
		this.growDownEnd();

	}

	shrinkUpStart() {

		if (this.startContainer.nodeType === 1) {

			let child = this.startContainer.childNodes[this.startOffset];

			if (child) {

				if (child.nodeType === 3) {

					this.setStart(child, 0);

				} else if (child.hasChildNodes()) {

					this.setStart(child, 0);

					this.shrinkUpStart();

				}

			}

		}

	}

	shrinkDownStart() {

		let node = this.startContainer;
		let offset = this.startOffset;

		if (node.nodeType === 3 && offset >= node.length || node.nodeType === 1 && offset >= node.childNodes.length) {

			this.setStartAfter(node);

			this.shrinkDownStart();

		}

	}

	growUpStart() {

		if (this.startContainer.nodeType === 1 && this.startOffset > 0) {

			let child = this.startContainer.childNodes[this.startOffset - 1];

			if (child.nodeType === 3) {

				this.setStart(child, child.length);

			} else if (child.hasChildNodes()) {

				this.setStart(child, child.childNodes.length);

				this.growUpStart();

			}

		}

	}

	growDownStart() {

		if (this.startContainer.nodeType === 1 && this.startOffset === 0 || this.startContainer.nodeType === 3 && this.startOffset === 0) {

			this.setStartBefore(this.startContainer);

			this.growDownStart();

		}

	}

	growUpEnd() {

		if (this.endContainer.nodeType === 1) {

			let child = this.endContainer.childNodes[this.endOffset];

			if (child) {

				if (child.nodeType === 3) {

					this.setStart(child, 0);

				} else if (child.hasChildNodes()) {

					this.setStart(child, 0);

					this.growUpEnd();

				}

			}

		}

	}

	growDownEnd() {

		if (this.endContainer.nodeType === 3 && this.endOffset >= this.endContainer.length || this.endContainer.nodeType === 1 && this.endOffset >= this.endContainer.childNodes.length) {

			this.setEndAfter(this.endContainer);

			this.growDownEnd();

		}

	}

	shrinkUpEnd() {

		if (this.endContainer.nodeType === 1 && this.endOffset > 0) {

			let child = this.endContainer.childNodes[this.endOffset - 1];

			if (child.nodeType === 3) {

				this.setEnd(child, child.length);

			} else if (child.hasChildNodes()) {

				this.setEnd(child, child.childNodes.length);

				this.shrinkUpEnd();

			}

		}

	}

	shrinkDownEnd() {

		if (this.endContainer.nodeType === 1 && this.endOffset === 0 || this.endContainer.nodeType === 3 && this.endOffset === 0) {

			this.setEndBefore(this.endContainer);

			this.shrinkDownEnd();

		}

	}

	// not used!
	*listTags() {

		let bracket = KarmaFieldsAlpha.Editor.Bracket.getBracketAtStart(this);

		if (this.collapsed) {

			let parent = bracket.getTag();

			while (parent && !parent.isRoot()) {

				yield parent;

				parent = parent.getParent();

			}

		} else {

			bracket = bracket.getNextOpening();

			let parent = bracket.getTag().getParent();

			while (parent && !parent.isRoot()) {

				yield parent;

				parent = parent.getParent();

			}

			while (bracket && range.intersectsNode(bracket.node)) {

				yield bracket.getTag();

				bracket = bracket.getNextOpening();

			}

		}

	}

	// no use brackets
	*listTags() {

		// let bracket = KarmaFieldsAlpha.Editor.Bracket.getBracketAtStart(this);

		const beam = new this.constructor(this);

		if (this.collapsed) {

			let parent = bracket.getTag();

			while (parent && !parent.isRoot()) {

				yield parent;

				parent = parent.getParent();

			}

		} else {

			beam.shrinkDown();
			beam.growDown();

			let tag = beam.startContainer;

			if (tag.is("element") && beam.startOffset < tag.getLength()) {

				tag = tag.getTag(tag.childNodes[beam.startOffset]);

			}

			while (tag && beam.intersectsNode(tag.node)) {

				yield tag;

				tag = tag.getNextTag();

			}

			tag = this.getTag(beam.commonAncestorContainer)

			while (tag && !tag.isRoot()) {

				yield tag;

				tag = tag.getParent();

			}

		}

	}





	deleteRange() {

		if (!this.collapsed) {

			this.shrinkDown();
			this.growDown();

			const container = this.commonAncestorContainer;

			this.deleteContents();

			container.sanitize();

		}

	}

	breakLine(shift) {

		if (!this.collapsed) {

			this.deleteRange();

		}

		const tag = KarmaFieldsAlpha.Editor.getTag(this.startContainer);

		tag.breakLine(this, shift);

	}

	backwardDelete() {

		if (this.collapsed) {

			const tag = KarmaFieldsAlpha.Editor.getTag(this.startContainer);

			tag.backwardDelete(this);

		} else {

			this.deleteRange();

		}

	}



}
