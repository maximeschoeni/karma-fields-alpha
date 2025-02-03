
KarmaFieldsAlpha.Editor.Bracket = class {

	constructor(node, opening) {

		this.node = node;
		this.opening = opening;

  }

	getTag() {

		return KarmaFieldsAlpha.Editor.getTag(this.node);

	}

	static getBracketAtStart(range) {

		const node = range.startContainer;

		if (node.nodeType === 1) {

			if (range.startOffset < node.childNodes.length) {

				return new this(node.childNodes[range.startOffset], true);

			} else {

				return new this(node, false);

			}

		} else {

			return new this(node, range.startOffset < node.length);

		}

	}

	static getBracketAtEnd(range) {

		const node = range.endContainer;

		if (node.nodeType === 1) {

			if (range.endOffset < node.childNodes.length) {

				return new this(node.childNodes[range.endOffset], true);

			} else {

				return new this(node, false);

			}

		} else {

			return new this(node, range.endOffset < node.length);

		}

	}


	// use bracket
	static *listTags(range) {

		let bracket = this.getBracketAtStart(range);

    if (range.collapsed) {

			let parent = bracket.getTag();

			while (parent && !parent.isRoot()) {

				yield parent;

				parent = bracket.getParent();

			}

		} else {

			bracket = startBracket.getNextOpening();

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

	getNextOpening() {

		if (this.opening) {

			return this;

		}

		let bracket = this.getNext();

		if (bracket) {

			return bracket.getNextOpening();
			
		}



	}

	// getNext() {
	//
	// 	if (this.opening && !this.brick.single) {
	//
	// 		if (this.brick.node.firstChild) {
	//
	// 			return new this.constructor(this.brick.node.firstChild, true);
	//
  //     } else {
	//
	// 			return new this.constructor(this.brick.node, false); // -> should not be empty!!
	//
  //     }
	//
  //   } else {
	//
	// 		if (this.brick.node.nextSibling) {
	//
	// 			return new this.constructor(this.brick.node.nextSibling, true);
	//
	// 		} else if (this.node.parentNode && this.brick.node.parentNode !== this.element) {
	//
	// 			return new this.constructor(this.brick.node.parentNode, true);
	//
  //     }
	//
  //   }
	//
  // }

	getNext() {

		if (this.opening) {

			if (this.node.nodeType === 1 && this.node.firstChild) {

				return new this.constructor(this.node.firstChild, true);

      } else {

				return new this.constructor(this.node, false); // -> single or empty node

      }

		// } else if (this.node !== KarmaFieldsAlpha.Editor.element) {
		} else if (!this.getTag().isRoot()) {

			if (this.node.nextSibling) {

				return new this.constructor(this.node.nextSibling, true);

			} else if (this.node.parentNode) {

				return new this.constructor(this.node.parentNode, true);

      }

    }

  }

	getPrevious() {

		if (!this.opening) {

			if (this.node.nodeType === 1 && this.node.lastChild) {

				// return this.getMark(this.node.lastChild, false);
				return new this.constructor(this.node.lastChild, false);

      } else {

				// console.warn("node is empty!", node);

				// return this.getMark(this.node, true);
				return new this.constructor(this.node, true);

      }

    } else {

			if (this.node.previousSibling) {

				// return this.getMark(this.node.previousSibling, false);
				return new this.constructor(this.node.previousSibling, false);

			// } else if (this.node.parentNode && !this.getMark(this.node.parentNode, false).root) {
			} else if (this.node.parentNode && !this.getTag().isRoot()) {

				// return this.getBracket(this.node.parentNode, true);
				return new this.constructor(this.node.parentNode, true);

      }

    }

  }

	getBracket(node, opening) {

		return new this.constructor(node, opening);

	}

	static *listInlineRanges(range) {

		let subrange;
		let bracket = this.getBracketAtStart(range);
		bracket = this.getNextOpening(range);

		while (bracket && range.comparePoint(bracket.node, 0) < 1) {

			const tag = bracket.getTag();

			if (subrange) {

				if (!bracket.opening && (tag.type === "inline" || tag.type === "text")) {

					subrange.setEndAfter(bracket.node);

				} else if (!bracket.opening) {

					yield subrange;

					subrange = null;

				}

			} else {

				if (bracket.opening && (tag.type === "inline" || tag === "text")) {

					subrange = new Range();

					subrange.setStart(bracket.node, 0);

				}

			}

			bracket = bracket.getNext();

		}

		if (subrange) {

			subrange.setEnd(range.endContainer, range.endOffset);

			if (!subrange.collapsed) {

				yield subrange;

			}

		}

	}

}
