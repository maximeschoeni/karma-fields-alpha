KarmaFieldsAlpha.Editor.Brick.block = class extends KarmaFieldsAlpha.Editor.Brick {

	constructor(node) {

		super(node);

		this.type = "block";

  }

	isValid() {

		return this.node.hasChildNodes();

	}

	empty() {

		while (this.node.firstChild) {

			this.node.removeChild(this.node.firstChild);

		}

	}





	// extractContentBefore(range = this.constructor.range) {
	//
	// 	range.setStart(this.node, 0);
	//
	// 	let content = range.extractContents();
	//
	// 	content.normalize();
	//
	// 	// -> trim content before
	// 	while (content.lastChild && content.lastChild.tagName === "BR")) {
	//
	// 		content.removeChild(content.lastChild);
	//
	// 	}
	//
	// 	return content;
	// }
	//
	// extractContentAfter(range = this.constructor.range) {
	//
	// 	if (this.node.lastChild) {
	//
	// 		range.setEndAfter(this.node.lastChild);
	//
	// 	}
	//
	// 	let content = range.extractContents();
	//
	// 	content.normalize();
	//
	// 	return content;
	// }

	// breakLine(shift) {
	//
	// 	let range = this.ranage;
	//
	// 	let contentBefore = this.extractContentBefore(range);
	// 	let contentAfter = this.extractContentAfter(range);
	//
	// 	this.empty();
	//
	// 	if (shift) {
	//
	// 		if (contentBefore.hasChildNodes()) {
	//
	// 			range.insertNode(contentBefore);
	// 			range.collapse(false);
	//
	// 		}
	//
  //     range.insertNode(document.createElement("br"));
  //     range.collapse(false);
	//
	// 		if (contentAfter.hasChildNodes()) {
	//
  //       range.insertNode(contentAfter);
  //       range.collapse(true);
	//
	// 		} else {
	//
  //       range.insertNode(document.createElement("br"));
  //       range.collapse(true);
	//
	// 		}
	//
	// 	} else {
	//
	// 		const container = this.getContainer();
	//
	// 		const block = document.createElement("p");
	//
	// 		if (!contentBefore.hasChildNodes()) {
	//
	// 			block.appendChild(document.createElement("br"));
	//
	// 			range.setStartBefore(container.node);
	// 			range.collapse(true);
	// 			range.insertNode(block);
	// 			range.collapse(false);
	//
	// 			if (!contentAfter.hasChildNodes()) {
	//
	// 				if (this.allowEmptyParagraph) {
	//
	// 					this.node.appendChild(document.createElement("br"));
	//
	// 					range.setStart(this.node, 0);
	// 					range.collapse(true);
	//
	// 				} else {
	//
	// 					range.selectNode(this.node);
	// 					range.deleteContents();
	// 					range.setStart(block, 0);
	// 					range.collapse(true);
	//
	// 				}
	//
	// 			} else {
	//
	// 				this.node.appendChild(contentAfter);
	//
	// 				range.setStart(this.node, 0);
	// 				range.collapse(true);
	//
	// 			}
	//
	// 		} else {
	//
	// 			this.node.appendChild(contentBefore);
	//
	// 			if (contentAfter.hasChildNodes()) {
	//
	// 				block.appendChild(contentAfter);
	//
	// 			} else {
	//
	// 				block.appendChild(document.createElement("br"));
	//
	// 			}
	//
	// 			range.setStartAfter(container.node);
	// 			range.collapse(true);
	// 			range.insertNode(block);
	// 			range.setStart(block, 0);
	// 			range.collapse(true);
	//
	// 		}
	//
	// 	}
	//
	// 	this.growUpStartRange();
	//
	// }

	insertBefore(brick) {

		const range = this.constructor.getRange();

		range.setStartBefore(brick.node);
		range.collapse(true);
		range.insertNode(this.node);
		range.collapse(false);

	}

	insertAfter(brick) {

		const range = this.constructor.getRange();

		range.setStartAfter(brick.node);
		range.collapse(true);
		range.insertNode(this.node);
		range.collapse(false);

	}

	forward() {

		const child = this.getFirstChild();

		if (child && !child.single) {

			child.forward();

		} else {

			const range = this.constructor.getRange();

			range.setStart(this.node, 0);
			range.collapse(true);

		}

	}

	breakLine(shift) {

		const range = this.constructor.range;

		let contentBefore = this.extractBefore();
		let contentAfter = this.extractAfter();

		this.empty();

		if (shift) {

			super.breakLine();

		} else {

			const container = this.getContainer();

			const block = this.constructor.createBrick("P");

			if (contentBefore.isEmpty()) {

				block.node.appendChild(document.createElement("br"));

				range.setStartBefore(container.node);
				range.collapse(true);
				range.insertNode(block.node);
				range.collapse(false);

				if (contentAfter.isEmpty()) {

					if (this.allowEmpty) {

						this.node.appendChild(document.createElement("br"));

						// this.start();
						range.setStart(this.node, 0);

					} else {

						this.delete();

						// block.start();

						range.selectNode(this.node);
						range.deleteContents();
						range.setStart(block.node, 0);
						range.collapse(true);

					}

				} else {

					this.node.appendChild(contentAfter.node);

					// this.start();

					range.setStart(this.node, 0);
					// range.collapse(true);

				}

			} else {

				this.node.appendChild(contentBefore.node);

				if (contentAfter.isEmpty()) {

					block.node.appendChild(document.createElement("br"));

				} else {

					block.appendChild(contentAfter.node);

				}

				// block.insertAfter(container);
				// block.start();

				range.setStartAfter(container.node);
				range.collapse(true);
				range.insertNode(block.node);
				range.setStart(block, 0);
				// range.collapse(true);

			}

		}

		this.constructor.shrinkUpStartRange();
		range.collapse(true);

	}

	isEmptyBlock() {

		for (let child of this.node.childNodes) {

			if (child.tagName !== "BR") {

				return false;

			}

		}

		return true;

	}

	merge(brick) {

		range = this.constructor.range;

		if (this.isEmptyBlock()) {

      this.empty();

			if (brick.isEmptyBlock()) {

				range.setStart(this.node, 0);
				range.collapse(false);
				range.insertNode(document.createElement("br"));
				range.collapse(true);

			} else {

				range.selectNodeContents(brick.node);
				const content = range.extractContents();
				content.normalize();

				range.selectNodeContents(this.node);
				range.collapse(false);
				range.insertNode(content);
				range.collapse(true);

			}

		} else {

			if (!brick.isEmptyBlock()) {

				range.selectNodeContents(brick.node);
				const content = range.extractContents();
				content.normalize();

				range.selectNodeContents(this.node);
				range.collapse(false);
				range.insertNode(content);
				range.collapse(true);

			}



		}
		//
		// if (brick.isEmptyBlock()) {
		//
		// 	range.selectNodeContents(this.node);
		// 	range.collapse(false);
		// 	range.insertNode(document.createElement("br"));
		// 	range.collapse(true);
		//
		// } else {
		//
		// 	range.selectNodeContents(brick.node);
		// 	const content = range.extractContents();
		// 	content.normalize();
		//
		// 	range.selectNodeContents(this.node);
		// 	range.collapse(false);
		// 	range.insertNode(content);
		// 	range.collapse(true);
		//
		// }

		brick.node.remove();

		this.sanitize();

  }

	backwardDelete(range) {

		if (range.startOffset > 0) {

			// this.backwardRange(range);
			this.shrinkUpStartRange();
			this.range.collapse(true);

			return false;

		} else {

			let leftNode;
			let rightNode = this.node;
			let container = this.getContainer();

			let left = this.getPreviousBrick();

			while (left && left.type !== "block") {

				left = left.getPreviousBrick();

			}

			if (left) {

				if (left.isEmptyBlock()) {

					left.node.remove();

				} else {

					left.merge(this);

					if (container.node !== this.node && container.isEmpty()) {

						container.node.remove();

					}

				}

			}

			// this.forwardRange(range);
			this.growUpStartRange();
			this.range.collapse(true);

			return true;

		}



	}

	// insertInto(range) {
	//
	// 	const container = this.getBrick(range.startContainer);
	//
	// 	if (container.tag === "div") {
	//
	// 		range.insertNode(this.node);
	//
	// 	} else if (container.type === "block" || container.type === "inline" || container.type === "text") { // -> insert content
	//
	// 		// const cloneRange = range.cloneRange();
	// 		// cloneRange.selectNodeContents(this.node);
	// 		//
	// 		// const content = cloneRange.extractContents();
	// 		// content.normalize();
	// 		//
	// 		// range.insertNode(content);
	// 		// container.normalize();
	//
	// 		container.insertBlock(this, range);
	//
	// 		KarmaFieldsAlpha.editor.Brick.block.insert(this, range);
	//
	// 	} else { // another container (UL, TABLE) -> insert after
	//
	// 		range.setStartAfter(range.startContainer);
	// 		range.collapse(true);
	//
	// 		this.insertInto(range);
	//
	// 	}
	//
	// }

	insert(block) {

		let range = this.range;

		if (block.type === "block") {

			if (this.isEmpty()) {

				this.empty();

			}

			const cloneRange = range.cloneRange();
			cloneRange.selectNodeContents(block.node);

			const content = cloneRange.extractContents();
			range.insertNode(content);

			this.sanitize();

			this.constructor.dirty = true;

		} else if (block.type === "inline" || block.type === "text") {

			if (this.isEmpty()) {

				this.empty();

			}

			super.insert(block);

			// range.insertNode(block.node);
			//
			// this.sanitize();



		} else if (!this.root) {

			// range.setStartAfter(range.startContainer);
			// range.collpase(true);
			//
			// const container = this.get(range.startContainer);
			//
			// container.insert(block, range);

			this.getParent().insert(block);

		}

	}

	static *listBlocks(range) {

		for (let brick of this.listBricksAt()) {

			if (brick.type === "block") {

				yield brick;

			}

		}

	}

	// wrapInto(range) {
	//
	// 	const bricks = [];
	//
	// 	for (let subrange of KarmaFieldsAlpha.Editor.Brick.inline.listRanges(range)) {
	//
	// 		const clone = this.node.cloneNode();
	// 		const brick = this.getBrick(clone);
	// 		const content = subrange.extractContents();
	//
	// 		clone.appendChild(content);
	//
	// 		bricks.push(brick);
	//
	// 	}
	//
	// 	range.deleteContents();
	//
	// 	let container = this.getBrick(range.endContainer);
	//
	// 	while (!this.isValidIn(container) && !container.root) {
	//
	// 		range.setEndAfter(range.endContainer);
	//
	// 		container = this.getBrick(range.endContainer);
	//
	// 	}
	//
	// 	const content = range.extractContents();
	//
	// 	for (let brick of bricks) {
	//
	// 		container.insert(brick, range);
	//
	// 		range.collapse(false);
	//
	// 	}
	//
	// 	if (content.hasChildNodes()) {
	//
	// 		range.insertNode(content);
	// 		range.collapse(true);
	//
	// 	}
	//
	//
	//
	//
	//
	// }

	wrap(tag, attributes) {

		let range = this.range;

		const commonAncestor = this.getBrick(range.commonAncestorContainer);

		const blocks = [...this.constructor.listBlocks(range)];

		range.deleteContents();

		for (let block of blocks) {

			// const subrange = new Range();
			// range.selectNodeContents(block);
			// const content = range.extractContents();

			const clone = this.constructor.createBrick(tag, attributes, block);



			// const clone = this.clone();
			//
			//
			//
			//
			// while (block.firstChild) {
			//
			// 	clone.node.appendChild(block.firstChild);
			//
			// }

			this.range.selectNode(block.node);
			this.range.deleteContents();

			// block.node.remove();

			clone.insertInto(range);

			range.collapse(false);

		}

		commonAncestor.sanitize();

	}

	// wrap(tagName, params, range) {
	//
	// 	if (!range) {
	//
	// 		range = this.range;
	//
	// 	}
	//
	// 	let container = this.get(range.commonAncestorContainer);
	//
  //   if (range.collapsed) {
	//
  //     const block = document.createElement(tagName);
  //     block.appendChild(document.createElement("br"));
	//
	//
	//
	// 		this.insert(block);
	//
  //   } else {
	//
	// 		for (let subrange of this.listInlineRangesAt(range)) {
	//
	// 			this.wrap(tagName, params, subrange);
	//
	// 			range.collapse(false);
	//
  //     }
	//
	// 	}
	// 	//
	// 	//
  //   // if (blockNodes.length) {
	// 	//
  //   //   this.insertAt(range, ...blockNodes);
	// 	//
  //   //   // range.setStartBefore(blockNodes[0]);
  //   //   // range.setEndAfter(blockNodes[blockNodes.length-1]);
	// 	//
  //   //   this.update(range);
	// 	//
  //   // }
	//
  // }

}

KarmaFieldsAlpha.Editor.Brick.P = class extends KarmaFieldsAlpha.Editor.Brick.block {

	constructor() {

		super();

		this.allowEmpty = true;

	}

}

KarmaFieldsAlpha.Editor.Brick.heading = class extends KarmaFieldsAlpha.Editor.Brick.block {

	constructor(node, opening) {

		super(node, opening);

		this.heading = true;

	}

	has(tag) {

		return tag === this.name || tag === "heading";

	}

	unwrap() {

		this.transform("p");

	}

	// toggle(tag) {
	//
	// 	const bricks = this.constructor.getSelectedBricks().filter(brick => brick.has(tag));
	//
	// 	if (bricks.length) {
	//
	// 		for (let brick of bricks) {
	//
	// 			brick.update("p");
	//
	// 		}
	//
	// 	} else {
	//
	// 		this.wrap();
	//
	// 	}
	//
	// }

}

KarmaFieldsAlpha.Editor.Brick.H1 = class extends KarmaFieldsAlpha.Editor.Brick.heading {}
KarmaFieldsAlpha.Editor.Brick.H2 = class extends KarmaFieldsAlpha.Editor.Brick.heading {}
KarmaFieldsAlpha.Editor.Brick.H3 = class extends KarmaFieldsAlpha.Editor.Brick.heading {}
KarmaFieldsAlpha.Editor.Brick.H4 = class extends KarmaFieldsAlpha.Editor.Brick.heading {}
KarmaFieldsAlpha.Editor.Brick.H5 = class extends KarmaFieldsAlpha.Editor.Brick.heading {}
KarmaFieldsAlpha.Editor.Brick.H6 = class extends KarmaFieldsAlpha.Editor.Brick.heading {}
