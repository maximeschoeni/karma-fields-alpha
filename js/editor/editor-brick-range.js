
KarmaFieldsAlpha.Editor.Range = class {

	static baseRange(range) {

		while (range.startOffset >= this.get(range.startContainer).getLength() && !this.get(range.startContainer).base) {

      range.setStartAfter(range.startContainer);

    }

		while (range.startOffset === 0 && !this.get(range.startContainer).base) {

      range.setStartBefore(range.startContainer);

    }

		while (range.endOffset === 0 && !this.get(range.endContainer).base) {

      range.setEndBefore(range.endContainer);

    }

		while (range.endOffset >= this.get(range.endContainer).getLength() && !this.get(range.endContainer).base) {

      range.setEndAfter(range.endContainer);

    }

  }


	static shrinkUpStartRange(range) {

		let node = range.startContainer;

		if (node.nodeType === 1) {

			let child = node.childNodes[range.startOffset];

			if (child.nodeType === 3) {

				range.setStart(child, 0);

			} else if (child.hasChildNodes()) {

				range.setStart(child, 0);

				this.shrinkUpStartRange(range);

			}

		}

	}

	static shrinkDownStartRange(range) {

		let node = range.startContainer;
		let offset = range.startOffset;

		if (node.nodeType === 1 && offset >= node.length || node.nodeType === 3 && offset >= node.childNodes.length) {

			range.setStartAfter(node);

			this.shrinkDownStartRange(range);

		}

	}

	static growUpStartRange(range) {

		const node = range.startContainer;
		const offset = range.startOffset;

		if (node.nodeType === 1 && offset > 0) {

			let child = node.childNodes[offset - 1];

			if (child.nodeType === 3) {

				range.setStart(child, child.length);

			} else if (child.hasChildNodes()) {

				range.setStart(child, child.childNodes.length);

				this.growUpStartRange(range);

			}

		}

	}

	static growDownStartRange(range) {

		let node = range.startContainer;
		let offset = range.startOffset;

		if (node.nodeType === 1 && offset === 0 || node.nodeType === 3 && offset === 0) {

			range.setStartBefore(node);

			this.growDownStartRange(range);

		}

	}

	static growUpEndRange(range) {

		const node = range.endContainer;
		const offset = range.endOffset;

		if (node.nodeType === 1) {

			let child = node.childNodes[offset];

			if (child.nodeType === 3) {

				range.setStart(child, 0);

			} else if (child.hasChildNodes()) {

				range.setStart(child, 0);

				this.growUpEndRange(range);

			}

		}

	}

	static growDownEndRange(range) {

		let node = range.endContainer;
		let offset = range.endOffset;

		if (node.nodeType === 1 && offset >= node.length || node.nodeType === 3 && offset >= node.childNodes.length) {

			range.setEndAfter(node);

			this.growDownEndRange(range);

		}

	}

	static shrinkUpEndRange(range) {

		const node = range.endContainer;
		const offset = range.endOffset;

		if (node.nodeType === 1 && offset > 0) {

			let child = node.childNodes[offset - 1];

			if (child.nodeType === 3) {

				range.setEnd(child, child.length);

			} else if (child.hasChildNodes()) {

				range.setEnd(child, child.childNodes.length);

				this.shrinkUpEndRange(range);

			}

		}

	}

	static shrinkDownEndRange(range) {

		let node = range.endContainer;
		let offset = range.endOffset;

		if (node.nodeType === 1 && offset === 0 || node.nodeType === 3 && offset === 0) {

			range.setEndBefore(node);

			this.shrinkDownEndRange(range);

		}

	}



	static *listInlineRanges(range) {

		let subrange;
		let bracket = KarmaFieldsAlpha.Editor.Bracket.getBracketAtStart(range);
		bracket = bracket.getNextOpening(range);

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
