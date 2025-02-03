
KarmaFieldsAlpha.Editor.Tag.inline = class extends KarmaFieldsAlpha.Editor.Tag.element {

	// constructor(node) {
	//
	// 	super(node);
	//
	// 	this.type = "inline";
	//
	// }

	getType() {

		return "inline";

	}

	is(name) {

		return name === "inline" || super.is(name);

	}

	breakLine(shift, beam) {

		const parent = this.getParent();

		parent.breakLine(shift, beam);

	}

	isValid() {

		return this.node.hasChildNodes();

	}

	isValidIn(container) {

		const type = container.getType();

		return type === "block" || type === "inline";

	}

	// backwardDelete(range) {
	//
	// 	if (range.startOffset > 0) {
	//
	// 		KarmaFieldsAlpha.Editor.Range.growUpStartRange(range);
	// 		range.collapse(true);
	//
	// 		return false;
	//
	// 	} else {
	//
	// 		range.setStartBefore(this.node);
	// 		range.collapse(true);
	//
	// 		return this.getParent().backwardDelete(range);
	//
	// 	}
	//
	// }

	// beam
	backwardDelete(beam) {

		if (beam.startOffset > 0) {

			KarmaFieldsAlpha.Editor.Beam.growUp(beam);
			beam.collapse(false);

		} else {

			beam.setStartBefore(beam.startContainer);
			beam.collapse(true);

		}

		const tag = this.getTag(beam.startContainer);

		return tag.backwardDelete(beam);

	}

	insert(tag, range) {

		if (tag.getType() === "inline" || tag.getType() === "text") {

			range.insertNode(tag.node);

			this.sanitize();

		} else {

			const parent = this.getParent();

			if (parent) {

				parent.insert(tag);

			}

		}

	}



	wrap(tagName, params, range) {

		const subranges = [...this.listInlineRanges(range)];

		for (let subrange of subranges) {

			range.setStart(subrange.startContainer, subrange.startOffset);
			range.setEnd(subrange.endContainer, subrange.endOffset);

			super.wrap(tagName, params, range);

		}

	}

	*listInlineRanges(beam) {

		const tags = KarmaFieldsAlpha.Editor.query("block");

		for (let tag of tags) {

			const blockRange = new Range();

			blockRange.selectNodeContents(tag.node);

			if (!beam.isPointInRange(tag.node, 0)) {

				blockRange.setStart(beam.startContainer, beam.startOffset);

			}

			if (!beam.isPointInRange(tag.node, tag.getLength())) {

				blockRange.setEnd(beam.endContainer, beam.endOffset);

			}

			yield blockRange;

		}

	}

	splitRange() {

		return  [...this.listInlineRanges(this.editor.beam)];

	}

	wrapMe_deprec() {

		const ranges = this.splitRange("inline");

		for (let range of ranges) {

			this.editor.beam.setStart(subrange.startContainer, subrange.startOffset);
			this.editor.beam.setEnd(subrange.endContainer, subrange.endOffset);

			super.wrapMe();

		}

	}

	wrapMe() {

		const blocks = this.editor.query("block");

		if (blocks.length > 1) { // -> handle wrapping over multiple blocks

			const fullRange = this.editor.beam.cloneRange();

			for (let block of blocks) {

				const range = new Range();

				range.selectNodeContents(block.node);

				if (!fullRange.isPointInRange(block.node, 0)) {

					range.setStart(fullRange.startContainer, fullRange.startOffset);

				}

				if (!beam.isPointInRange(block.node, block.getLength())) {

					range.setEnd(fullRange.endContainer, fullRange.endOffset);

				}

				this.editor.beam.setStart(range.startContainer, range.startOffset);
				this.editor.beam.setEnd(range.endContainer, range.endOffset);

				const tag = this.clone();

				tag.wrapMe();

			}

		} else {

			super.wrapMe();

		}

	}




	// toggle() {
	//
	// 	const tags = this.editor.query(this.node.tagName);
	//
	// 	if (tags.length) {
	//
	// 		for (let tag of tags) {
	//
	// 			tag.unwrap();
	//
	// 		}
	//
	// 	} else {
	//
	// 		this.wrapMe();
	//
	// 	}
	//
	// }
	//
	// transform(tagName, attributes) {
	//
	// 	const tags = this.editor.query(this.node.tagName);
	//
	// 	if (tags.length) {
	//
	// 		for (let tag of tags) {
	//
	// 			if (tagName && tag.getName() !== tagName) {
	//
	// 				tag.retag(tagName);
	//
	// 			}
	//
	// 	    if (attributes) {
	//
	// 				this.updateAttributes(attributes);
	//
	// 	    }
	//
	// 		}
	//
	// 	} else {
	//
	// 		this.wrapMe();
	//
	// 	}
	//
	// }

	// static has(tag) {
	//
	// 	return this.bricks.some(tag => tag.name === tag);
	//
	// }

	// static *listRanges(range) {
	//
	// 	if (!range) {
	//
	// 		range = this.range;
	//
	// 	}
	//
	// 	let subrange;
	// 	let brick = this.getOpening(range);
	//
	// 	while (brick && range.comparePoint(brick.node, 0) < 1) {
	//
	// 		if (subrange) {
	//
	// 			if (!brick.opening && (brick.type === "inline" || brick.type === "text")) {
	//
	// 				subrange.setEndAfter(brick.node);
	//
	// 			} else if (!brick.opening) {
	//
	// 				yield subrange;
	//
	// 				subrange = null;
	//
	// 			}
	//
	// 		} else {
	//
	// 			if (brick.opening && (brick.type === "inline" || brick === "text")) {
	//
	// 				subrange = new Range();
	//
	// 				subrange.setStart(brick.node, 0);
	//
	// 			}
	//
	// 		}
	//
	// 		brick = brick.getNextMark();
	//
	// 	}
	//
	// 	if (subrange) {
	//
	// 		subrange.setEnd(range.endContainer, range.endOffset);
	//
	// 		if (!subrange.collapsed) {
	//
	// 			yield subrange;
	//
	// 		}
	//
	// 	}
	//
	// }

}

KarmaFieldsAlpha.Editor.Tag.single = class extends KarmaFieldsAlpha.Editor.Tag.inline {

	constructor(node) {

		super(node);

		this.single = true;

	}

	idEmpty() {

		return false;

	}

	isSingle() {

		return true;

	}

}
// KarmaFieldsAlpha.Editor.register("BR", KarmaFieldsAlpha.Editor.Tag.single));


KarmaFieldsAlpha.Editor.Tag.bold = class extends KarmaFieldsAlpha.Editor.Tag.inline {

	is(name) {

		return name === "bold" || name === "B" || name === "STRONG" || super.is(name);

	}

	toggle() {

		const tags = this.editor.query("bold");

		if (tags.length) {

			for (let tag of tags) {

				tag.unwrap();

			}

		} else {

			this.wrapMe();

		}

	}

}

// KarmaFieldsAlpha.Editor.Brick.STRONG = class extends KarmaFieldsAlpha.Editor.Brick.inline {
//
// 	has(tag) {
//
// 		return tag === "B" || tag === "STRONG";
//
// 	}
//
// }

KarmaFieldsAlpha.Editor.register("B", KarmaFieldsAlpha.Editor.Tag.bold);
KarmaFieldsAlpha.Editor.register("STRONG", KarmaFieldsAlpha.Editor.Tag.bold);

KarmaFieldsAlpha.Editor.Tag.italic = class extends KarmaFieldsAlpha.Editor.Tag.inline {

	is(name) {

		return name === "italic" || name === "I" || name === "EM" || super.is(name);

	}

	toggle() {

		const tags = this.editor.query("italic");

		if (tags.length) {

			for (let tag of tags) {

				tag.unwrap();

			}

		} else {

			this.wrapMe();

		}

	}

}

KarmaFieldsAlpha.Editor.register("I", KarmaFieldsAlpha.Editor.Tag.italic);
KarmaFieldsAlpha.Editor.register("EM", KarmaFieldsAlpha.Editor.Tag.italic);


KarmaFieldsAlpha.Editor.Tag.A = class extends KarmaFieldsAlpha.Editor.Tag.inline {

	isValidAttribute(key) {

		return key === "href" || key === "target";

	}

	edit(tagName, params) {

		const href = this.node.getAttribute("href");
		const target = this.node.getAttribute("target");

		super.edit("A", {href, target, ...params});

	}

}

KarmaFieldsAlpha.Editor.register("A", KarmaFieldsAlpha.Editor.Tag.A);


KarmaFieldsAlpha.Editor.Tag.SPAN = class extends KarmaFieldsAlpha.Editor.Tag.inline {

	sanitizeChild(child) {

		const parent = this.getParent();

		if (parent) {

			parent.node.insertBefore(child.node, this.node);

		}

	}

}

KarmaFieldsAlpha.Editor.register("SPAN", KarmaFieldsAlpha.Editor.Tag.SPAN);


// KarmaFieldsAlpha.Editor.Tag.BR = class extends KarmaFieldsAlpha.Editor.Tag.inline {
//
// 	constructor(node) {
//
// 		super(node);
//
// 		this.single = true;
//
// 	}
//
// 	// static {
// 	//
// 	// 	KarmaFieldsAlpha.Editor.register("A", this));
// 	//
// 	// }
//
// }
//
// KarmaFieldsAlpha.Editor.register("BR", KarmaFieldsAlpha.Editor.Tag.BR);
