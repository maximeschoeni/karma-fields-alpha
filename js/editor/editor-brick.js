document.addEventListener("selectionchange", event => {

	const selection = document.getSelection();

	if (KarmaFieldsAlpha.Editor.Brick.element === document.activeElement && selection.rangeCount > 0) {

		const range = selection.getRangeAt(0);

		if (KarmaFieldsAlpha.Editor.Brick.element.contains(range.commonAncestorContainer)) {

			KarmaFieldsAlpha.Editor.Brick.update(range);

			KarmaFieldsAlpha.Editor.Brick.onSelectionChange();

		}

	}

});

KarmaFieldsAlpha.Editor.Brick = class {

	constructor(node) {

		this.node = node;

		this.name = node.tagName.toLowerCase();
		this.tagName = node.tagName;

  }

	static range = new Range();
	static map = new Map();

	static onInput() {}
	static onUndo() {}
	static onRedo() {}

	static spoil() {

		KarmaFieldsAlpha.Editor.Brick.dirty = false;

	}

	static dispatchInput() {

		// if (this.onInput) {

			const content = this.getContent();

			this.onInput(content, this);

		// }

	}

	static init(element) {

		if (this.element === element) {

			return;

		}

		this.element = element;

		const brick = this.get(element);

    element.oninput = async event => {

			this.spoil();

			this.dispatchInput(event.inputType);

    }

    element.oncut = event => {

      event.preventDefault();

      if (this.range && !this.range.collapsed) {

				// this.selectDown(range);

				this.shrinkDownStartRange(this.range);
				this.shrinkDownEndRange(this.range);

		    const content = range.extractContents();

		    this.delete(range);

		    const container = document.createElement("div");
		    container.appendChild(content);

		    const html = container.innerHTML;

				// const html = this.cut(this.range);

        event.clipboardData.setData("text/plain", html);
        event.clipboardData.setData("text/html", html);

				this.dispatchInput("cut");

				// element.dispatchEvent(new Event("input"));

      }

    }

    element.oncopy = event => {

      event.preventDefault();

			if (this.range && !this.range.collapsed && element.contains(this.range.commonAncestorContainer)) {

        // let html = this.copy(this.range);

				this.shrinkDownStartRange(this.range);
				this.shrinkDownEndRange(this.range);

		    const content = this.range.cloneContents();

		    const container = document.createElement("div");
		    container.appendChild(content);

		    let html = container.innerHTML;


        event.clipboardData.setData("text/plain", html);
        event.clipboardData.setData("text/html", html);

      }

    }


    element.onpaste = event => {

      event.preventDefault();

      if (this.range) {

        let html = event.clipboardData.getData("text/html");

				if (!html) {

					let text = event.clipboardData.getData("text/plain");

					html = `<p>${text.trim()}</p>`;

          html = html.replace(/(?:\r\n|\r|\n)+/g, '</p><p>');

        }

				if (html) {

					// const container = document.createElement("div");
					const container = this.createBrick("div");
					container.node.innerHTML = html;

					// container.sanitize();

					this.insert(range, ...container.childNodes);

				}

        // if (html) {
				//
        //   this.paste(this.range, html);
				//
        // } else if (text) {
				//
        //   html = `<p>${text.trim()}</p>`;
				//
        //   html = html.replace(/(?:\r\n|\r|\n)+/g, '</p><p>');
				//
        //   this.paste(this.range, html);
				//
        // }

				// element.dispatchEvent(new Event("input"));



				this.dispatchInput("paste", this);

      }

    }

    element.onkeydown = async event => {

      if (event.key === "z" && event.metaKey) {

        event.preventDefault();

        if (event.shiftKey) {

          this.onRedo();

        } else {

          this.onUndo();

        }

      } else if (event.key === "Backspace") {

				const container = this.get(this.range.startContainer);
				// const container = this.getClosing(this.range.endContainer);
				// container.shrink();
				// this.range.setEnd(container, container.getLength());

				if (container.backwardDelete()) {

          event.preventDefault();

					this.dispatchInput("backspace");

					// element.dispatchEvent(new Event("input"));

        }

      }

      if (event.key === "Enter") {

        event.preventDefault();

				const container = this.get(this.range.startContainer);

        container.breakLine(this.range, event.shiftKey || event.altKey || event.ctrlKey || event.metaKey);

        this.dispatchInput("enter");

				// element.dispatchEvent(new Event("input"));

      }

    }

    // element.ondblclick = async event => {
		//
    //   // if (event.target.tagName === "IMG") {
		// 	//
		// 	//
		// 	//
    //   // }
		//
		// 	const brick = this.get(event.target);
		//
		// 	this.onDblClick(brick);
		//
    // }

	}

	static update(range) {

		this.range = range || new Range();
		this.bricks = [...this.listBricksAt(this.range)];

  }

	static getSelectedBricks() {

		return this.bricks || [];

	}

	static query(tag, ...params) {

		return this.getSelectedBricks().filter(brick => brick.has(tag, ...params));

	}

	static isSelected(tag, ...params) {

		return this.getSelectedBricks().some(brick => brick.has(tag, ...params));

	}


	static getContent() {

		const root = this.get(this.element);

		if (root.isEmpty()) {

			return "";

		} else {

			return root.node.innerHTML;

		}

  }

	static setContent(content) {

    if (content) {

			const root = new this.root(this.element);

			root.node.innerHTML = content;

      root.sanitize();

    } else {

			root.reset();

    }

  }

	// static paste(range, html) {
	//
	// 	const container = document.createElement("div");
  //   container.innerHTML = html;
	//
	// 	this.get(container).sanitize();
	//
  //   // container.normalize();
	//
  //   // let child = container.firstChild;
	//
	// 	this.insertNode(range, ...container.childNodes);
	//
  //   // while (child) {
	// 	//
  //   //   container.removeChild(child);
	// 	//
	// 	// 	this.insertNode(range, child);
	// 	//
  //   //   range.collapse(false);
	// 	//
  //   //   child = container.firstChild;
	// 	//
  //   // }
	//
	// }

	static getRange() {

		return this.range || new Range();

	}

	static setRange(range) {

		this.range = range;

	}


	isRoot() {

		return this.root || this.base; // which one ??

	}


	getLength(node) {

		return this.node.childNodes.length;

	}

	getParent() {

		if (!this.isRoot()) {

			return this.getBrick(this.node.parentNode);

		}

	}

	getFirstChild() {

		if (this.node.firstChild) {

			return this.getBrick(this.node.firstChild);

		}

	}

	getLastChild() {

		if (this.node.lastChild) {

			return this.getBrick(this.node.lastChild);

		}

	}

	getChild(index) {

		if (!this.single && !this.type === "text") {

			return this.getBrick(this.node.childNodes[index]);

		}

	}

	getBrick(node) {

		return this.constructor.get(node);

	}

	isEmpty() {

		return !this.node.textContent.trim();

	}

	clone(deep) {

		const clone = this.node.cloneNode(deep);
		const brick = this.getBrick(clone);

		return brick;

	}

	static baseRange(range = this.range) {

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

	static getHighestBrickAtStart(range = this.getRange()) {

		let brick = this.get(range.startContainer);

		if (range.startOffset < brick.getLength()) {

			if (brick.type !== "text") {

				brick = range.startContainer.childNodes[range.startOffset];

			}

		} else {

			brick = brick.getBrickAfter();

		}

		while (brick.type !== "text" && !brick.single && brick.node.firstChild) {

			brick = this.createFromNode(brick.node.firstChild);

		}

		return brick;
	}

	static getBrickAtStart(range = this.range) {

		let brick = this.get(range.startContainer);

		if (range.startOffset < brick.getLength()) {

			if (brick.type !== "text") {

				brick = range.startContainer.childNodes[range.startOffset];

			}

		} else {

			brick = brick.getBrickAfter();

		}

		// while (brick.type !== "text" && !brick.single && brick.node.firstChild) {
		//
		// 	brick = this.createFromNode(brick.node.firstChild);
		//
		// }



		// while (brick.type !== "text" && !brick.single && brick.node.firstChild && range.startOffset < brick.node.childNodes.length) {
		//
		// 	brick = this.createFromNode(brick.node.firstChild);
		//
		// }

		return brick;
	}


	// static *listBricksAt(range) {
	//
  //   if (!range.collapsed) {
	//
  //     range = range.cloneRange();
	//
	// 		this.shrinkDownStartRange(range);
	// 		this.shrinkDownEndRange(range);
	//
	// 		let leftBrick = this.get(range.startContainer);
	// 		leftBrick = leftBrick.getChild(range.startOffset) || leftBrick;
	//
	// 		let brick = leftBrick.getParent();
	//
	// 		while (brick && !brick.base) {
	//
	// 			yield brick;
	//
	// 			brick = brick.getParent();
	//
  //     }
	//
  //     brick = leftBrick;
	//
	// 		while (brick && range.intersectsNode(brick.node)) {
	//
  //       yield brick;
	//
	// 			brick = brick.getNextBrick();
	//
  //     }
	//
  //   } else {
	//
  //     // yield* this.listNodesUnder(range.startContainer);
	//
	// 		let brick = this.get(range.startContainer);
	//
	// 		while (brick && !brick.base) {
	//
	//       yield brick;
	//
	// 			brick = brick.getParent();
	//
	//     }
	//
  //   }
	//
  // }

	static *listBricksAt(range) {

    if (!range.collapsed) {

      // range = range.cloneRange();
			//
			// this.shrinkDownStartRange(range);
			// this.shrinkDownEndRange(range);
			//
			// let leftBrick = this.get(range.startContainer);
			// leftBrick = leftBrick.getChild(range.startOffset) || leftBrick;

			let brick = this.getBrickAtStart(range);

			while (brick && range.intersectsNode(brick.node)) {

				yield brick;

				brick = brick.getNextBrick();

			}


			let brick = leftBrick.getParent();

			while (brick && !brick.base) {

				yield brick;

				brick = brick.getParent();

			}

			rick = leftBrick;



    } else {

      // yield* this.listNodesUnder(range.startContainer);

			let brick = this.get(range.startContainer);

			while (brick && !brick.base) {

	      yield brick;

				brick = brick.getParent();

	    }

    }

  }


	// use bracket
	static *listBricksAt(range = this.range) {

		let startBrick = this.getOpening(range);

		let brick = startBrick;

		while (brick && !brick.root) {

			yield brick;

			brick = brick.getParent();

		}

    if (!range.collapsed) {

			let endBrick = this.getClosing(range);

      brick = startBrick;

			while (brick && brick !== endBrick) {

				if (brick.opening) {

					yield brick;

				}

				brick = brick.getNextMark();

      }

    }

  }

	// static *listInlineRangesAt(range = this.range) {
	//
  //   let subrange;
	// 	let brick = this.getOpening(range);
	//
	// 	while (brick && range.comparePoint(brick.node, 0) < 1) {
	//
  //     if (subrange) {
	//
	// 			if (!brick.opening && (brick.type === "inline" || brick.type === "text")) {
	//
	// 				subrange.setEndAfter(brick.node);
	//
	// 			} else if (!brick.opening) {
	//
	// 				yield subrange;
	//
  //         subrange = null;
	//
  //       }
	//
  //     } else {
	//
	// 			if (brick.opening && (brick.type === "inline" || brick === "text")) {
	//
  //         subrange = new Range();
	//
	// 				subrange.setStart(brick.node, 0);
	//
  //       }
	//
  //     }
	//
	// 		brick = brick.getNextMark();
	//
  //   }
	//
  //   if (subrange) {
	//
  //     subrange.setEnd(range.endContainer, range.endOffset);
	//
	// 		if (!subrange.collapsed) {
	//
	// 			yield subrange;
	//
	// 		}
	//
  //   }
	//
  // }

	getContainer(node) {

		let container = this;

		while (!container.getParent().base) {

			container = container.getParent();

		}

		return container;
	}

	getBrickBefore() {

		if (this.node.previousSibling) {

			return this.getBrick(this.node.previousSibling);

		}

		const parent = this.getParent();

		if (parent && !parent.base) {

			return parent.getBrickBefore();

		}

	}

	getPreviousBrick() {

		if (this.node.lastChild) {

			return this.getBrick(this.node.lastChild);

    }

		return this.getBrickBefore();

  }

	getBrickAfter() {

		if (this.node.nextSibling) {

			return this.getBrick(this.node.nextSibling);

		}

		const parent = this.getParent();

		if (parent && !parent.base) {

			return parent.getBrickAfter();

		}

	}

	getNextBrick() {

		if (this.node.firstChild) {

			return this.getBrick(this.node.firstChild);

    }

		return this.getBrickAfter();

  }

	getNextMark() {

		if (this.opening && !this.single) {

			if (this.node.firstChild) {

				return this.getMark(this.node.firstChild, true);

      } else {

				return this.getMark(this.node, false); // -> should not be empty!!

      }

    } else {

			if (this.node.nextSibling) {

        return this.getMark(this.node.nextSibling, true);

			// } else if (this.node.parentNode && !this.getMark(this.node.parentNode, false).root) {
			} else if (this.node.parentNode && this.node.parentNode !== this.element) {

				return this.getMark(this.node.parentNode, true);

      }

    }

  }

	getPreviousMark() {

		if (!this.opening && !this.single) {

			if (this.node.lastChild) {

				return this.getMark(this.node.lastChild, false);

      } else {

				console.warn("node is empty!", node);

				return this.getMark(this.node, true);

      }

    } else {

			if (this.node.previousSibling) {

				return this.getMark(this.node.previousSibling, false);

			// } else if (this.node.parentNode && !this.getMark(this.node.parentNode, false).root) {
			} else if (this.node.parentNode && this.node.parentNode !== this.element) {

				return this.getMark(this.node.parentNode, true);

      }

    }

  }

	getMark(node, opening) {

		if (node.nodeType === 1) {

			if (this.constructor[node.tagName]) {

				return new this.constructor[node.tagName](node, opening);

			}

		} else if (node.nodeType === 3) {

			return new this.constructor.text(node, opening);

		}

	}

	static shrinkUpStartRange(range = this.range) {

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

	static shrinkDownStartRange(range = this.range) {

		let node = range.startContainer;
		let offset = range.startOffset;

		if (node.nodeType === 1 && offset >= node.length || node.nodeType === 3 && offset >= node.childNodes.length) {

			range.setStartAfter(node);

			this.shrinkDownStartRange(range);

		}

	}

	static growUpStartRange(range = this.range) {

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

	static growDownStartRange(range = this.range) {

		let node = range.startContainer;
		let offset = range.startOffset;

		if (node.nodeType === 1 && offset === 0 || node.nodeType === 3 && offset === 0) {

			range.setStartBefore(node);

			this.growDownStartRange(range);

		}

	}

	static growUpEndRange(range = this.range) {

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

	static growDownEndRange(range = this.range) {

		let node = range.endContainer;
		let offset = range.endOffset;

		if (node.nodeType === 1 && offset >= node.length || node.nodeType === 3 && offset >= node.childNodes.length) {

			range.setEndAfter(node);

			this.growDownEndRange(range);

		}

	}

	static shrinkUpEndRange(range = this.range) {

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

	static shrinkDownEndRange(range = this.range) {

		let node = range.endContainer;
		let offset = range.endOffset;

		if (node.nodeType === 1 && offset === 0 || node.nodeType === 3 && offset === 0) {

			range.setEndBefore(node);

			this.shrinkDownEndRange(range);

		}

	}


	normalize() {

		const nodes = [...this.node.childNodes];

    for (let node of nodes) {

			const child = this.getBrick(node);

			child.normalize();

			if (child.isValid()) { // => is valid

				child.sanitizeAttributes();

			} else {

				child.node.parentNode.removeChild(child.node);

			}

    }

	}


	sanitize() {

		let child = this.getBrick(this.node.firstChild);

		while (child) {

			child = child.sanitize();

			if (!child.isValid()) {

				const next = this.getBrick(child.node.nextSibling);

				this.node.removeChild(child.node);

				child = next;

			} else if (!child.isValidIn(this)) {

				if (this.node.parentNode) {

					this.node.parentNode.insertBefore(child.node, this.node);

				} else {

					child.valid = false;

				}

				return child;

			} else {

				child = this.getBrick(child.node.nextSibling);

			}

		}

		const attributes = [...this.node.attributes];

		for (let attribute of attributes) {

			if (!this.isValidAttribute(attribute.name)) {

				this.node.removeAttribute(attribute.name);

			}

		}

		return this;

  }

	isValid() {

		return false;

	}

	isValidIn(container) {

		return true;

		// return this.validInTypes.has(container.type) || this.validInTags.has(container.tag);

  }

	isValidAttribute(key) {

		return false;

	}


	// sanitizeAttributes() {
	//
	// 	const attributes = [...this.node.attributes];
	//
  //   for (let attribute of attributes) {
	//
  //     if (!this.validAttributes.has(attribute.name)) {
	//
	// 			this.node.removeAttribute(attribute.name);
	//
  //     }
	//
  //   }
	//
  // }

	update(tagName, params, range) {

		return this.transform(tagName, params);

	}


	transform(tagName, params) {

		if (tagName && this.node.nodeType === 1) {

      const newNode = document.createElement(tagName);

			while (this.node.firstChild) {

				newNode.appendChild(this.node.firstChild);

      }

			if (this.node.parentNode) {

				this.node.replaceWith(newNode);

			}

			if (this.range && this.range.startContainer === this.node) {

				this.range.setStart(newNode, this.range.startOffset);

			}

			if (this.range && this.range.endContainer === this.node) {

				this.range.setEnd(newNode, this.range.endOffset);

			}

			this.node = newNode;

    }

		this.removeAttributes();

    if (params) {

			this.updateAttributes(params);

    }

		this.spoil();

  }

	updateAttributes(params) {

    for (let key in params) {

      if (params[key]) {

				this.node.setAttribute(key, params[key]);

      }

    }

  }

	removeAttributes() {

		while (this.node.attributes.length) {

			this.node.removeAttributeNode(this.node.attributes[0]);

    }

  }

	static delete(range = this.range) {

		if (!range.collapsed) {

			this.shrinkDownStartRange(range);
			this.shrinkDownEndRange(range);

			let container = this.get(range.commonAncestorContainer);

      range.deleteContents();

			container.sanitize();

			this.spoil();

			this.dispatchInput("delete");

    }

	}

	// static insertNode(range, ...nodes) {
	//
	// 	this.delete(range);
	//
  //   const clone = range.cloneRange();
	//
  //   for (let node of nodes) {
	//
	// 		const container = this.get(range.startContainer);
	//
	// 		container.insert(node, range);
	//
	// 		// const child = this.get(node);
	// 		//
	// 		// child.insertInto(range);
	//
	// 		// KarmaFieldsAlpha.Editor.Brick[container.tag].insert(child, range);
	//
  //     range.collapse(false);
	//
  //   }
	//
  //   range.setStart(clone.startContainer, clone.startOffset);
	//
  // }

	static insert(...nodes) {

		let range = this.range;

		this.delete(range);

		if (!range.collapsed) {

			this.shrinkDownStartRange(range);
			this.shrinkDownEndRange(range);

			let container = this.get(range.commonAncestorContainer);

      range.deleteContents();

			container.sanitize();

    }

    const clone = range.cloneRange();

    for (let node of nodes) {

			const brick = this.get(node);

			brick.insertInto(range);

      range.collapse(false);

    }

    range.setStart(clone.startContainer, clone.startOffset);

		container = this.get(range.commonAncestorContainer);

		container.sanitize();

		this.dispatchInput("insert");

  }

	insertInto(range = this.constructor.range) {

		let container = this.getBrick(range.startContainer);

		container.insert(this, range);

	}

	insert(brick, range = this.constructor.range) {

		// range.setStartAfter(range.startContainer);
		// range.collpase(true);
		//
		// const container = this.get(range.startContainer);
		//
		// container.insert(block, range);

		range.insertNode(brick.node);

		// this.sanitize();

		this.spoil();

	}

	// insert(brick, range = this.constructor.range) {
	//
	// 	if (brick.isValidIn(this)) {
	//
	// 		// super.insert(brick);
	//
	// 		range.insertNode(brick.node);
	//
	// 		this.sanitize();
	//
	// 	} else {
	//
	// 		const container = this.getContainer();
	//
	// 		range.setEndAfter(container.node);
	// 		const content = range.extractContents(); // -> to verify: range must collapse to deeper container!
	//
	// 		container.insert(brick);
	//
	// 		if (contents.hasChildNodes()) {
	//
	// 			range.inserNode(content);
	//
	// 		}
	//
	// 		container.sanitize();
	//
	// 	}
	//
	// 	container.insert(block, range);
	//
	// }



	static wrap(tag, attributes) {

		const node = this.createNode(tag, attributes);

		const brick = this.get(node, true);

		brick.wrap();

		this.dispatchInput("wrap");

	}

	wrap(tag, attributes) {

		if (!this.range.collapsed) {

			const content = this.range.extractContent();

			// let container = this.getBrick(this.range.startContainer);

			const brick = this.constructor.createBrick(tag, attributes, content);

			brick.insertInto();

			this.constructor.spoil();

		}

  }

	static unwrap(tag) {

		const bricks = this.getSelectedBricks().filter(brick => brick.has(tag));

		for (let brick of bricks) {

			brick.unwrap();

		}

		this.dispatchInput("unwrap");

	}

	unwrap() {

		if (!this.node || !this.node.parentNode) {

      console.error("A valid node with a parent is required.");
      return;

    }

    // const parent = node.parentNode;
    // const firstNode = node.firstChild;
    // const lastNode = node.lastChild;

		// if (this.type === "inline") {

			while (this.node.firstChild) {

				this.node.parentNode.insertBefore(this.node.firstChild, this.node);

	    }

			this.node.remove();

			// this.constructor.dirty = true;

			this.spoil();

		// } else if (this.type === "block") {
		//
		//
		//
		// }





  }

	static createNode(tag, attributes, content) {

		const node = document.createElement(tag.toLowerCase());

		if (content) {

			// node.appendChild(content);

			while (content.firstChild) {

				node.appendChild(content.firstChild);

			}

		}

		if (attributes) {

			for (let key in attributes) {

	      if (attributes[key]) {

					node.setAttribute(key, attributes[key]);

	      }

	    }

		}

		return brick;

	}

	static getTag(node) {

		return this.get(node);
		
	}

	static createBrick(tag, attributes, content) {

		const node = this.createNode(tag, attributes, content);

		return this.get(node);

	}

	static transform(tag, attributes) {

		const bricks = this.query(tag, attributes);

		if (bricks.length) {

			for (let brick of bricks) {

				brick.transform(null, attributes);

			}

			this.dispatchInput("transform");

		} else {

			// this.wrap(tag, ...params);
			const brick = this.createBrick(tag, attributes);

			brick.wrap();

			this.dispatchInput("wrap");

		}



	}

	static toggle(tag, attributes) {

		const bricks = this.query(tag, attributes);

		if (bricks.length) {

			for (let brick of bricks) {

				brick.unwrap(tag, attributes);

			}

			this.dispatchInput("unwrap");

		} else if (!range.collapsed) {

			this.prototype.wrap(tag, attributes);

			this.dispatchInput("wrap");

		}

	}

	static has(tag, ...params) {

		return this.getSelectedBricks().some(brick => brick.has(tag, ...params));

	}

	has(tag) {

		return this.name === tag;

	}

	breakLine() {

		let range = this.getRange();

		let contentBefore = this.extractBefore(range);
		let contentAfter = this.extractAfter(range);

		if (!contentBefore.isEmtpy()) {

			range.insertNode(contentBefore.node);
			range.collapse(false);

		}

    range.insertNode(document.createElement("br"));
    range.collapse(false);

		if (!contentAfter.isEmpty()) {

			range.insertNode(contentAfter.node);
      range.collapse(true);

		} else {

      range.insertNode(document.createElement("br"));
      range.collapse(true);

		}

	}

	static getConstructor(tag) {

		return KarmaFieldsAlpha.Editor.Brick[tag] || KarmaFieldsAlpha.Editor.Brick[tag.toUpperCase()] || KarmaFieldsAlpha.Editor.Brick;

	}

	static create(tag) {

		const constructor = this.getConstructor(tag);

		const brick = new constructor();

		return brick;

	}

	static get(node) {

		// if (node && node.nodeType === 1 && this[node.tagName]) {
		//
		// 	return new this[node.tagName](node);
		//
		// } else if (node && node.nodeType === 3) {
		//
		// 	return new this.text(node);
		//
		// } else {
		//
		// 	return new this(node);
		//
		// }

		// return this.create(node.tagName, node);


		return this.createFromNode(node);

	}

	static createFromNode(node) {

		const name = node.nodeType === 1 && node.tagName || node.nodeType === 3 && "text";

		let brick = this.create(name);

		brick.node = node;

		return brick;

	}

	// static getAt(range) {
	//
	// 	let node = range.startContainer;
	//
	// 	if (node.nodeType === 1) {
	//
	// 		let child = node.childNodes[range.startOffset];
	//
	// 		if (child) {
	//
	// 			return this.get(child);
	//
	// 		}
	//
	// 	}
	//
	// 	return this.get(node);
	// }

	static getOpening(range) {

		let node = range.startContainer;
		let brick;

		if (node.nodeType === 1) {

			if (range.startOffset < node.childNodes.length) {

				node = node.childNodes[range.startOffset];

				if (node.nodeType === 1 && this[node.tagName]) {

					brick = new this[node.tagName](node, true);

				} else if (node.nodeType === 3) {

					brick = new this.text(node, true);

				}

			} else if (this[node.tagName]) {

				brick = new this[node.tagName](node, true);

			}

		} else if (node.nodeType === 3) {

			brick = new this.text(node, range.startOffset < node.length);

		}

		while (brick && !brick.opening) {

			brick = this.getNextMark();

		}

		return brick;

	}

	static getClosing(range) {

		let node = range.endContainer;
		let brick;

		if (node.nodeType === 1) {

			if (range.endOffset > 0) {

				node = node.childNodes[range.endOffset - 1];

				if (node.nodeType === 1 && this[node.tagName]) {

					brick = new this[node.tagName](node, false);

				} else if (node.nodeType === 3) {

					brick = new this.text(node, false);

				}

			} else if (this[node.tagName]) {

				brick = new this[node.tagName](node, false);

			}

		} else if (node.nodeType === 3) {

			brick = new this.text(node, range.endOffset === 0);

		}

		while (brick && brick.opening) {

			brick = this.getPreviousMark();

		}

		return brick;

	}

	extractBefore() {

		const range = this.getRange();
		const brick = new this.constructor.content();

		range.setStart(this.node, 0);

		brick.node = range.extractContents();

		return brick;

	}

	extractAfter() {

		const brick = new this.constructor.content();

		this.constructor.range.setEnd(this.node, this.getLength());

		brick.node = range.extractContents();

		return brick;

	}

	trim() {

		let brick = this.getBrick(this.node.lastChild);

		while (brick && (brick.name === "BR" || brick.isEmpty())) {

			this.node.removeChild(brick.node);

			brick = this.getBrick(this.node.lastChild);

		}

	}

	static register(name, constructor) {

		if (!this.map) {

			this.map = new Map();

		}

		this.map.set(name, constructor);

	}


}

KarmaFieldsAlpha.Editor.Brick.content = class extends KarmaFieldsAlpha.Editor.Brick {

	constructor() {

		super();

		this.name = "content";

	}

}

KarmaFieldsAlpha.Editor.Brick.text = class extends KarmaFieldsAlpha.Editor.Brick {

	constructor() {

		super();

		this.name = "text";

	}

}

KarmaFieldsAlpha.Editor.Brick.register("text", KarmaFieldsAlpha.Editor.Brick.text);


// KarmaFieldsAlpha.Editor.register([
// 	"DIV"
// ], {
// 	type: "container",
// 	validInTags: ["DIV"],
// 	validAttributes: ["class"],
// 	breakMode: "div"
// });
//
// KarmaFieldsAlpha.Editor.register([
// 	"FIGURE"
// ], {
// 	type: "container",
// 	validInTags: ["DIV"],
// 	validAttributes: ["id"],
// 	breakMode: "container"
// });
//
// KarmaFieldsAlpha.Editor.register([
// 	"UL",
// 	"OL"
// ], {
// 	type: "container",
// 	validInTags: ["DIV"],
// 	mergeableInTags: ["UL", "OL"],
// 	breakMode: "container"
// });
//
// KarmaFieldsAlpha.Editor.register([
// 	"TABLE"
// ], {
// 	type: "container",
// 	validInTags: ["DIV"],
// 	breakMode: "container"
// });
//
// KarmaFieldsAlpha.Editor.register([
// 	"TBODY",
// 	"THEAD",
// 	"TFOOTER"
// ], {
// 	type: "container",
// 	validInTags: ["TABLE"],
// 	breakMode: "container"
// });
//
// KarmaFieldsAlpha.Editor.register([
// 	"TR"
// ], {
// 	type: "container",
// 	validInTags: ["TABLE", "TBODY", "THEAD", "TFOOTER"],
// 	breakMode: "container"
// });
//
//
// // BLOCKS
//
// KarmaFieldsAlpha.Editor.register([
// 	"TH",
// 	"TD"
// ], {
// 	type: "block",
// 	validInTags: ["TR"],
// 	breakMode: "container"
// });
//
// KarmaFieldsAlpha.Editor.register([
// 	"FIGCAPTION"
// ], {
// 	type: "block",
// 	validInTags: ["FIGURE"],
// 	breakMode: "paragraph"
// });
//
// KarmaFieldsAlpha.Editor.register([
// 	"P"
// ], {
// 	type: "block",
// 	validInTags: ["DIV"],
// 	breakMode: "paragraph",
// 	mergeableInTypes: ["block"]
// });
//
// KarmaFieldsAlpha.Editor.register([
// 	"BLOCKQUOTE"
// ], {
// 	type: "block",
// 	validInTags: ["DIV"],
// 	breakMode: "paragraph",
// 	mergeableInTypes: ["block"]
// });
//
// KarmaFieldsAlpha.Editor.register([
// 	"LI"
// ], {
// 	type: "block",
// 	validInTags: ["UL", "OL"],
// 	breakMode: "list-item",
// 	mergeableInTypes: ["block"]
// });
//
// KarmaFieldsAlpha.Editor.register([
// 	"H1",
// 	"H2",
// 	"H3",
// 	"H4",
// 	"H5",
// 	"H6"
// ], {
// 	type: "block",
// 	validInTags: ["DIV"],
// 	breakMode: "paragraph",
// 	mergeableInTypes: ["block"]
// });
//
//
//
// // INLINE
//
// KarmaFieldsAlpha.Editor.register([
// 	"A"
// ], {
// 	type: "inline",
// 	validInTypes: ["block", "inline"],
// 	validAttributes: ["href", "target"]
// });
//
// KarmaFieldsAlpha.Editor.register([
// 	"SPAN"
// ], {
// 	type: "inline",
// 	validInTypes: ["block", "inline"],
// 	validAttributes: ["style"]
// });
//
// KarmaFieldsAlpha.Editor.register([
// 	"B",
// 	"STRONG",
// 	"EM",
// 	"I",
// 	"SUB",
// 	"SUP",
// 	"SMALL"
// ], {
// 	type: "inline",
// 	validInTypes: ["block", "inline"]
// });
//
//
//
// // SINGLES
//
// KarmaFieldsAlpha.Editor.register([
// 	"IMG"
// ], {
// 	type: "single",
// 	validInTags: ["P", "FIGURE"],
// 	validAttributes: ["src", "width", "height", "srcset", "sizes", "alt", "title", "data-id"]
// });
//
// KarmaFieldsAlpha.Editor.register([
// 	"VIDEO"
// ], {
// 	type: "single",
// 	validInTags: ["P", "FIGURE"],
// 	validAttributes: ["data-id", "src", "width", "height", "alt", "title", "autoplay", "loop", "controls"]
// });
//
// KarmaFieldsAlpha.Editor.register([
// 	"BR"
// ], {
// 	type: "single",
// 	validInTypes: ["block"]
// });
// KarmaFieldsAlpha.Editor.register([
// 	"HR"
// ], {
// 	type: "single",
// 	validInTypes: ["container"]
// });
