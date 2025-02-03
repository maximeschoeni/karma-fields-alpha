
KarmaFieldsAlpha.Editor.Brick.inline = class extends KarmaFieldsAlpha.Editor.Brick {

	constructor(node) {

		super(node);

		this.type = "inline";

	}

	breakLine(shift) {

		this.getParent().breakLine(shift);

	}

	isValid() {

		return this.node.hasChildNodes();

	}

	backwardDelete() {

		let range = this.range;

		if (range.startOffset > 0) {

			this.growUpStartRange();
			range.collapse(true);

			return false;

		} else {

			range.setStartBefore(this.node);
			range.collapse(true);

			return this.getParent().backwardDelete(range);

		}

	}

	insert(brick) {

		if (brick.type === "inline" || brick.type === "text") {

			this.range.insertNode(inline.node);

			this.sanitize();

		} else {

			super.insert(brick);

		}



	}

	wrap(tag, params) {

		const subranges = [...this.constructor.listRanges(this.range)];

		for (let subrange of subranges) {

			this.constructor.setRange(subrange);

			super.wrap(tag, params);

			// const content = subrange.extractContent();
			//
			// let container = this.getBrick(subrange.startContainer);
			//
			// const brick = this.constructor.createBrick(tag, attributes, content);
			//
			// container.insert(brick);
			//
			// this.constructor.spoil();
			//
			//
			//
			// const brick = this.getBrick(subrange.startContainer);
			//
			// brick.wrap(this, subrange);

		}

	}

	// static wrap(tagName, params, range) {
	//
	// 	if (!range) {
	//
	// 		range = this.range;
	//
	// 	}
	//
	// 	this.shrinkDownStartRange(range);
	// 	this.shrinkUpStartRange(range);
	// 	this.shrinkDownEndRange(range);
	// 	this.shrinkUpEndRange(range);
	//
	// 	let container = this.get(range.commonAncestorContainer);
	//
	// 	if (container.type === "text" || container.type === "inline" || container.type === "block") {
	//
  //     const content = range.extractContents();
	// 		this.trim(content);
	//
	// 		if (content.hasChildNodes()) {
	//
  //       // const inlineNode = this.createNode(tagName, params);
	// 			const node = document.createElement(tagName);
	//
	// 			const brick = this.get(node);
	//
	// 			if (params) {
	//
	// 				brick.updateAttributes(params);
	//
	// 			}
	//
  //       node.appendChild(content);
	//
	// 			range.insertNode(node);
	// 			range.selectNodeContents(node);
	//
	// 			container.sanitize();
	//
	// 			// return brick;
	//
  //       // this.update(range);
	//
  //     }
	//
	// 	} else if (container.type === "container") {
	//
  //     for (let subrange of this.listInlineRangesAt(range)) {
	//
	// 			this.wrap(tagName, params, subrange);
	//
  //     }
	//
  //   }
	//
  // }



	// static toggle(tag, params) {
	//
	// 	const bricks = this.bricks.filter(brick => brick.name === tag);
	//
	// 	if (bricks.length) {
	//
	// 		for (let brick of bricks) {
	//
	// 			brick.unwrap();
	//
	// 		}
	//
	// 	} else {
	//
	// 		this.wrap(tag);
	//
	// 	}
	//
	// 	if (this.onInput) {
	//
	// 		this.onInput(tag);
	//
	// 	}
	//
	// }

	static has(tag) {

		return this.bricks.some(brick => brick.name === tag);

	}

	static *listRanges(range) {

		if (!range) {

			range = this.range;

		}

		let subrange;
		let brick = this.getOpening(range);

		while (brick && range.comparePoint(brick.node, 0) < 1) {

			if (subrange) {

				if (!brick.opening && (brick.type === "inline" || brick.type === "text")) {

					subrange.setEndAfter(brick.node);

				} else if (!brick.opening) {

					yield subrange;

					subrange = null;

				}

			} else {

				if (brick.opening && (brick.type === "inline" || brick === "text")) {

					subrange = new Range();

					subrange.setStart(brick.node, 0);

				}

			}

			brick = brick.getNextMark();

		}

		if (subrange) {

			subrange.setEnd(range.endContainer, range.endOffset);

			if (!subrange.collapsed) {

				yield subrange;

			}

		}

	}

}

KarmaFieldsAlpha.Editor.Brick.B = class extends KarmaFieldsAlpha.Editor.Brick.inline {

	// static toggle() {
	//
	// 	super.toggle("b");
	//
	// }

	// sanitize() {
	//
	// 	this.update("strong");
	//
	// 	super.sanitize();
	//
	// }

	has(tag) {

		return tag === "B" || tag === "STRONG";

	}

}
KarmaFieldsAlpha.Editor.Brick.STRONG = class extends KarmaFieldsAlpha.Editor.Brick.inline {

	// static toggle() {
	//
	// 	super.toggle("strong");
	//
	// }

	has(tag) {

		return tag === "B" || tag === "STRONG";

	}

}


KarmaFieldsAlpha.Editor.Brick.A = class extends KarmaFieldsAlpha.Editor.Brick.inline {

	isValidAttribute(key) {

		return key === "href" || key === "target";

	}

	transform(tag, params) {

		const href = link.node.getAttribute("href");
		const target = link.node.getAttribute("target");

		super.transform(null, {href, target, ...params});

	}

}
