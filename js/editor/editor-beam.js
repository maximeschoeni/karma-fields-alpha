
KarmaFieldsAlpha.Editor.Beam = class {

	constructor(range) {

		this.range = range;

	}

	static shrinkUp(range) {

		this.shrinkUpStart(range);
		this.shrinkUpEnd(range);

	}

	static shrinkDown(range) {

		this.shrinkDownStart(range);
		this.shrinkDownEnd(range);

	}

	static growUp(range) {

		this.growUpStart(range);
		this.growUpEnd(range);

	}

	static growDown(range) {

		this.growDownStart(range);
		this.growDownEnd(range);

	}

	static shrinkUpStart(range) {

		if (range.startContainer.nodeType === 1) {

			let child = range.startContainer.childNodes[range.startOffset];

			if (child) {

				if (child.nodeType === 3) {

					range.setStart(child, 0);

				} else if (child.hasChildNodes()) {

					range.setStart(child, 0);

					this.shrinkUpStart(range);

				}

			}

		}

	}

	static shrinkDownStart(range) {

		let node = range.startContainer;
		let offset = range.startOffset;

		if (node.nodeType === 3 && offset >= node.length || node.nodeType === 1 && offset >= node.childNodes.length  && node !== KarmaFieldsAlpha.Editor.element) {

			range.setStartAfter(node);

			this.shrinkDownStart(range);

		}

	}

	static growUpStart(range) {

		if (range.startContainer.nodeType === 1 && range.startOffset > 0) {

			let child = range.startContainer.childNodes[range.startOffset - 1];

			if (child.nodeType === 3) {

				range.setStart(child, child.length);

			} else if (child.hasChildNodes()) {

				range.setStart(child, child.childNodes.length);

				this.growUpStart(range);

			}

		}

	}

	static growDownStart(range) {

		if (range.startContainer.nodeType === 1 && range.startOffset === 0 && range.startContainer !== KarmaFieldsAlpha.Editor.element || range.startContainer.nodeType === 3 && range.startOffset === 0) {

			range.setStartBefore(range.startContainer);

			this.growDownStart(range);

		}

	}

	static growUpEnd(range) {

		if (range.endContainer.nodeType === 1) {

			let child = range.endContainer.childNodes[range.endOffset];

			if (child) {

				if (child.nodeType === 3) {

					range.setStart(child, 0);

				} else if (child.hasChildNodes()) {

					range.setStart(child, 0);

					this.growUpEnd(range);

				}

			}

		}

	}

	static growDownEnd(range) {

		if (range.endContainer.nodeType === 3 && range.endOffset >= range.endContainer.length || range.endContainer.nodeType === 1 && range.endOffset >= range.endContainer.childNodes.length && range.endContainer !== KarmaFieldsAlpha.Editor.element) {

			range.setEndAfter(range.endContainer);

			this.growDownEnd(range);

		}

	}

	static shrinkUpEnd(range) {

		if (range.endContainer.nodeType === 1 && range.endOffset > 0) {

			let child = range.endContainer.childNodes[range.endOffset - 1];

			if (child.nodeType === 3) {

				range.setEnd(child, child.length);

			} else if (child.hasChildNodes()) {

				range.setEnd(child, child.childNodes.length);

				this.shrinkUpEnd(range);

			}

		}

	}

	static shrinkDownEnd(range) {

		if (range.endContainer.nodeType === 1 && range.endOffset === 0 && range.endContainer !== KarmaFieldsAlpha.Editor.element || range.endContainer.nodeType === 3 && range.endOffset === 0) {

			range.setEndBefore(range.endContainer);

			this.shrinkDownEnd(range);

		}

	}

	//
	// // not used!
	// *listTags() {
	//
	// 	let bracket = KarmaFieldsAlpha.Editor.Bracket.getBracketAtStart(this);
	//
	// 	if (this.collapsed) {
	//
	// 		let parent = bracket.getTag();
	//
	// 		while (parent && !parent.isRoot()) {
	//
	// 			yield parent;
	//
	// 			parent = parent.getParent();
	//
	// 		}
	//
	// 	} else {
	//
	// 		bracket = bracket.getNextOpening();
	//
	// 		let parent = bracket.getTag().getParent();
	//
	// 		while (parent && !parent.isRoot()) {
	//
	// 			yield parent;
	//
	// 			parent = parent.getParent();
	//
	// 		}
	//
	// 		while (bracket && range.intersectsNode(bracket.node)) {
	//
	// 			yield bracket.getTag();
	//
	// 			bracket = bracket.getNextOpening();
	//
	// 		}
	//
	// 	}
	//
	// }
	//
	// // // no use brackets
	// // *listTags() {
	// //
	// // 	// let bracket = KarmaFieldsAlpha.Editor.Bracket.getBracketAtStart(this);
	// //
	// // 	const beam = new this.constructor(this);
	// //
	// // 	if (this.collapsed) {
	// //
	// // 		let parent = bracket.getTag();
	// //
	// // 		while (parent && !parent.isRoot()) {
	// //
	// // 			yield parent;
	// //
	// // 			parent = parent.getParent();
	// //
	// // 		}
	// //
	// // 	} else {
	// //
	// // 		beam.shrinkDown();
	// // 		beam.growDown();
	// //
	// // 		let tag = beam.startContainer;
	// //
	// // 		if (tag.is("element") && beam.startOffset < tag.getLength()) {
	// //
	// // 			tag = tag.getTag(tag.childNodes[beam.startOffset]);
	// //
	// // 		}
	// //
	// // 		while (tag && beam.intersectsNode(tag.node)) {
	// //
	// // 			yield tag;
	// //
	// // 			tag = tag.getNextTag();
	// //
	// // 		}
	// //
	// // 		tag = this.getTag(beam.commonAncestorContainer)
	// //
	// // 		while (tag && !tag.isRoot()) {
	// //
	// // 			yield tag;
	// //
	// // 			tag = tag.getParent();
	// //
	// // 		}
	// //
	// // 	}
	// //
	// // }
	//
	//
	//
	//
	//

	static delete(range) {

		if (!range.collapsed) {

			this.shrinkDown(range);
			this.growDown(range);

			range.deleteContents();

		}

	}

	//
	// breakLine(shift) {
	//
	// 	if (!this.range.collapsed) {
	//
	// 		this.deleteRange();
	//
	// 	}
	//
	// 	const tag = KarmaFieldsAlpha.Editor.getTag(this.range.startContainer);
	//
	// 	tag.breakLine(this.range, shift);
	//
	// }
	//
	// backwardDelete() {
	//
	// 	if (this.range.collapsed) {
	//
	// 		const tag = KarmaFieldsAlpha.Editor.getTag(this.range.startContainer);
	//
	// 		tag.backwardDelete(this.range);
	//
	// 	} else {
	//
	// 		this.deleteRange();
	//
	// 	}
	//
	// }
	//


}
