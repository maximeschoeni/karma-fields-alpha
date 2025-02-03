KarmaFieldsAlpha.editors = {};


document.addEventListener("selectionchange", event => {

	const selection = document.getSelection();

	for (let uid in KarmaFieldsAlpha.editors) {

		const editor = KarmaFieldsAlpha.editors[uid];

		if (editor.element === document.activeElement) {

			if (selection.rangeCount > 0 && editor.element.contains(selection.anchorNode) && editor.element.contains(selection.focusNode)) {

				const range = selection.getRangeAt(0);



				// const pathes = editor.getPathesAt(range);
        //
				// KarmaFieldsAlpha.server.setState(pathes, "fields", uid, "rangePath");

				// editor.update(range);
        //
				// if (editor.onSelectionChange) {
        //
				// 	editor.onSelectionChange();
        //
				// }

        editor.setRange(range);

        editor.onSelectionChange();

			}

		}

	}
});

KarmaFieldsAlpha.Editor = class {

  constructor(element) {

    this.nodes = [];
    this.range = new Range();

    this.onRedo = () => {};
    this.onUndo = () => {};
    this.onInput = () => {};
    this.onDblClick = () => {};
    this.onSelectionChange = () => {};

    if (element) {

      this.setElement(element);

    }

  }

  // onRedo() {};
  // onUndo() {};
  // onInput() {};
  // onFocus() {};
  // onDblClick() {};

  setElement(element) {

    if (element !== this.element) {

      this.element = element;

      element.oninput = async event => {

        this.onInput(event.inputType);

      }

      element.oncut = event => {

        event.preventDefault();

        if (this.range && !this.range.collapsed) {

          const html = this.cut(this.range);

          event.clipboardData.setData("text/plain", html);
          event.clipboardData.setData("text/html", html);

          this.onInput("cut");

        }

      }

      element.oncopy = event => {

        event.preventDefault();

        if (this.range && !this.range.collapsed) {

          let html = this.copy(this.range);

          event.clipboardData.setData("text/plain", html);
          event.clipboardData.setData("text/html", html);

        }

      }


      element.onpaste = event => {

        event.preventDefault();

        if (this.range) {

          let html = event.clipboardData.getData("text/html");
          let text = event.clipboardData.getData("text/plain");

          if (html) {

            this.paste(this.range, html);

          } else if (text) {

            html = `<p>${text.trim()}</p>`;

            html = html.replace(/(?:\r\n|\r|\n)+/g, '</p><p>');

            this.paste(this.range, html);

          }



          this.onInput("paste");

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

          if (this.delete(this.range)) {

            event.preventDefault();

            this.onInput("backspace");

          }

        }

        if (event.key === "Enter") {

          event.preventDefault();

          this.breakLine(this.range, event.shiftKey || event.altKey || event.ctrlKey || event.metaKey);

          this.onInput("enter");

        }

      }

      element.ondblclick = async event => {

        if (event.target.tagName === "IMG") {

          this.onDblClick();

        }

      }

    }

  }

  setRange(range) {

    this.range = range;
    this.nodes = [...this.listNodesAt(range)];

  }

  update(range) {

    this.range = range;
    this.nodes = [...this.listNodesAt(range)];

  }

  contains(range) {

    console.error("Deprecated");

    if (!range || !range.commonAncestorContainer) {

      console.error("Invalid range");

    }

    return this.element.contains(range.commonAncestorContainer);
  }

  getContent() {

    if (this.isEmpty(this.element) && (!this.element.firstChild || !this.isContainer(this.element.firstChild))) { // keep it if empty list!

      return "";

    } else {

      return this.element.innerHTML;

    }

  }

  setContent(content) {

    if (content) {

      this.element.innerHTML = content;

      this.sanitize();

      this.element.normalize(); // ?

      // if (pathes) {
      //
      //   const range = this.getRangeFromPathes(pathes);
      //   const selection = document.getSelection();
      //   selection.removeAllRanges();
      //   selection.addRange(range);
      //
      //   this.update(range);
      //
      // }

    } else {

      this.reset();

    }

  }



  getPathesAt(range) {

    // if (!this.contains(range)) {
    //
    //   return [];
    //
    // }

    if (range.collapsed) {

      return [this.getPathFromPoint(range.startContainer, range.startOffset)];

    } else {

      return [
        this.getPathFromPoint(range.startContainer, range.startOffset),
        this.getPathFromPoint(range.endContainer, range.endOffset)
      ];

    }

  }

  getPathFromPoint(node, index) {

    const path = [index];

    while (!this.isRoot(node)) {

      index = 0;

      while (node.previousSibling) {

        index++;
        node = node.previousSibling

      }

      path.unshift(index);

      node = node.parentNode;

    }

    return path;
  }


  getPointFromPath(path) {

    let nodePath = path.slice(0, -1);
    let node = this.element;
    let depth = 0;
    let offset = path[path.length - 1];

    while (this.isElement(node) && depth < nodePath.length && node.firstChild) {

      node = node.firstChild;

      for (let i = 0; i < nodePath[depth]; i++) {

        if (node.nextSibling) {

          node = node.nextSibling;

        }

      }

      depth++;



      // if (depth < path.length) {
      //
      //   offset = path[depth];
      //
      // } else {
      //
      //   break;
      //
      // }

    }

    if (this.isElement(node)) {

      offset = Math.min(node.childNodes.length, offset);

    } else {

      offset = Math.min(node.length, offset);

    }

    return [node, offset];

  }

  getRangeFromPathes(pathes, range) {

    if (!range) {


      range = new Range();

    }

    if (pathes[0]) {

      range.setStart(...this.getPointFromPath(pathes[0]));

    }

    if (pathes[1]) {

      range.setEnd(...this.getPointFromPath(pathes[1]));

    } else {

      range.collapse(true);

    }

    return range;

  }



  selectDown(range) {

    // console.warn("deprecated");

    while (range.startOffset >= this.getNodeLength(range.startContainer) && !this.isRoot(range.startContainer)) {

      range.setStartAfter(range.startContainer);

    }

    while (range.startOffset === 0 && !this.isRoot(range.startContainer)) {

      range.setStartBefore(range.startContainer);

    }

    while (range.endOffset === 0 && !this.isRoot(range.endContainer)) {

      range.setEndBefore(range.endContainer);

    }

    while (range.endOffset >= this.getNodeLength(range.endContainer) && !this.isRoot(range.endContainer)) {

      range.setEndAfter(range.endContainer);

    }

  }





  getNextNode(node) {

    if (node.firstChild) {

      return node.firstChild;

    }

    while (!node.nextSibling && node.parentNode) {

      node = node.parentNode;

    }

    return node.nextSibling;

  }

  getPreviousNode(node) {

    if (node.lastChild) {

      return node.lastChild;

    }

    while (!node.previousSibling && node.parentNode) {

      node = node.parentNode;

    }

    return node.previousSibling;

  }


  *listNodesIn(container) {

    let node = container.firstChild;

    while (node) {

      yield node;

      node = this.getNextNode(node);

    }

  }

  getNodeAfterPoint(node, offset) {

    if (this.isText(node)) {

      return node;

    } else {

      return node.childNodes[offset] || this.getNextNode(node);

    }

  }

  getNodeBeforePoint(node, offset) {

    if (this.isText(node)) {

      return node;

    } else {

      return node.childNodes[offset - 1];

    }

  }


  *listNodesAt(range) {

    if (!range.collapsed) {

      range = range.cloneRange();

      // while (range.startOffset === 0 && !this.isRoot(range.startContainer)) {
      //
      //   range.setStartBefore(range.startContainer);
      //
      // }

      while (range.startOffset >= this.getNodeLength(range.startContainer) && !this.isRoot(range.startContainer)) {

        range.setStartAfter(range.startContainer);

      }

      while (range.endOffset === 0 && !this.isRoot(range.endContainer)) {

        range.setEndBefore(range.endContainer);

      }

      // while (range.endOffset >= this.getNodeLength(range.endContainer) && !this.isRoot(range.endContainer)) {
      //
      //   range.setEndAfter(range.endContainer);
      //
      // }

      const leftNode = this.getNodeAfterPoint(range.startContainer, range.startOffset);
      // const rightNode = this.getNodeAfterPoint(range.endContainer, range.endOffset);

      if (!leftNode) {

        console.warn("selected node not found");

        return;

      }

      let node = leftNode.parentNode;

      while (node && !this.isRoot(node)) {

        yield node;

        node = node.parentNode;

      }

      // yield* this.listNodesBetween(leftNode, rightNode);

      node = leftNode;

      while (node && range.intersectsNode(node) && this.element.contains(node)) {

        yield node;

        node = this.getNextNode(node);

      }

    } else {

      yield* this.listNodesUnder(range.startContainer);

    }



  }


  *listNodesBetween(node, endNode) {

    while (node && node !== endNode && !this.isRoot(node)) {

      yield node;

      node = this.getNextNode(node);

    }

  }

  *listNodesUnder(node) {

    while (node && !this.isRoot(node)) {

      yield node;

      node = node.parentNode;

    }

  }

  getNodesAt(range) {

    const nodes = [...this.listNodesAt(range)];

    return nodes;

  }

  getNodesUnder(node) {

    return [...this.listNodesUnder(node)];

  }



  findNodeAt(range, fn) {

    for (let node of this.listNodesAt(range)) {

      if (fn(node)) {

        return node;

      }

    }

  }

	getNextCell(node, container) {

		let depth = 0;

		while (!node.nextSibling) {

			node = node.parentNode;

			if (node === container) {

				return;

			}

			depth++;

		}

		node = node.nextSibling;

		while (node && depth > 0) {

			node = node.firstChild;
			depth--;

		}

		return node;

	}

	getPreviousCell(node, container) {

		let depth = 0;

		while (!node.previousSibling) {

			node = node.parentNode;

			if (node === container) {

				return;

			}

			depth++;

		}

		node = node.previousSibling;

		while (node && depth > 0) {

			node = node.lastChild;
			depth--;

		}

		return node;

	}


  createNode(tagName, params) {

    let node = document.createElement(tagName);

    if (params) {

      for (let key in params) {

        if (params[key]) {

          node.setAttribute(key, params[key]);

        }

      }

    }

    return node;
  }

  unwrap(range, tagName) {

    const node = this.getNodeByTags(range, tagName);

    if (node) {

      this.unwrapNode(node);

    }

  }

  unwrapNode(node) {

    if (!node || !node.parentNode) {

      console.error("A valid node with a parent is required.");
      return;

    }

    const parent = node.parentNode;
    const firstNode = node.firstChild;
    const lastNode = node.lastChild;

    while (node.firstChild) {

      parent.insertBefore(node.firstChild, node);

    }

    // const range = this.range || new Range();
    this.range.setStartBefore(firstNode);
    this.range.setEndAfter(lastNode);

    parent.removeChild(node);
    parent.normalize();


    return this.range;
  }


  getNextPoint(node, before) {

    if (before) {

      if (node.firstChild) {

        return [node.firstChild, true];

      } else {

        return [node, false];

      }

    } else {

      if (node.nextSibling) {

        return [node.nextSibling, true];

      } else {

        return [node.parentNode, false];

      }

    }

  }

  getPointAfter(container, offset) {

    if (this.isText(container)) {

      return [container, offset === 0];

    } else {

      return [container.childNodes[offset], true];

    }

  }

  isPointAfter(node, before, range) {

    const offset = before ? 0 : this.getNodeLength(node);

    return range.comparePoint(node, offset) > 0;

  }

  *listInlineRangesAt(range) {

    let subrange;
    // let node = range.startContainer;
    let [node, before] = this.getPointAfter(range.startContainer, range.startOffset);
    // let [nodeAfter] = this.getPointAfter(range.endContainer, range.endOffset);

    if (!this.isContainer(range.startContainer)) {

      subrange = new Range();
      subrange.setStart(range.startContainer, range.startOffset);

    }

    // while (!this.isRoot(node) && (node !== nodeAfter || !before)) {
    while (!this.isRoot(node) && !this.isPointAfter(node, before, range)) {

      if (subrange) {

        if (this.isContainer(node) || this.isBlock(node)) {

          yield subrange;

          subrange = null;

        } else if (!before) {

          subrange.setEndAfter(node);

          // if (!range.isPointInRange(subrange.endContainer, subrange.endOffset)) {
          //
          //   subrange.setEnd(range.endContainer, range.endOffset);
          //
          //   yield subrange;
          //
          //   break;
          //
          // }

        }

      } else {

        if (before && (this.isText(node) || this.isInline(node))) {

          subrange = new Range();

          subrange.setStartBefore(node);

          // if (!range.isPointInRange(node, 0)) {
          //
          //   subrange.setStart(range.startContainer, range.startOffset);
          //
          // } else {
          //
          //   subrange.setStartBefore(node);
          //
          // }

        }

      }

      [node, before] = this.getNextPoint(node, before);

      // if (before) {
      //
      //   range.setStartBefore(node);
      //
      // } else {
      //
      //   range.setStartAfter(node);
      //
      // }



    }

    if (subrange) {

      // if (!range.isPointInRange(subrange.endContainer, subrange.endOffset)) {
      //
      //   subrange.setEnd(range.endContainer, range.endOffset);
      //
      // }
      if (this.isPointAfter(node, before, range)) {

        subrange.setEnd(range.endContainer, range.endOffset);

      }

      // if (node === nodeAfter) {
      //
      //   subrange.setEnd(range.endContainer, range.endOffset);
      //
      // }

      yield subrange;

    }

  }

  wrapInlineAt(range, tagName, params) {

    if (this.isText(range.commonAncestorContainer) || this.isInline(range.commonAncestorContainer) || this.isBlock(range.commonAncestorContainer)) {

      const content = range.extractContents();

      if (!this.isEmpty(content)) {

        const inlineNode = this.createNode(tagName, params);

        inlineNode.appendChild(content);

        range.insertNode(inlineNode);

        range.selectNodeContents(inlineNode);

        inlineNode.parentNode.normalize();

        this.update(range);

      }

    } else if (this.isContainer(range.commonAncestorContainer)) {

      for (let subrange of this.listInlineRangesAt(range)) {

        this.wrapInlineAt(subrange, tagName, params);

      }

    }

  }

  wrapBlockAt(range, tagName) {

    const blockNodes = [];

    if (range.collapsed) {

      const blockNode = document.createElement(tagName);
      const br = document.createElement("br");
      blockNode.appendChild(br);
      blockNodes.push(blockNode);

    } else {

      let content = range.extractContents();

      for (let node of this.listNodesIn(content)) {

        if (this.isBlock(node)) {

          const blockNode = document.createElement(tagName);

          while (node.firstChild) {

            blockNode.appendChild(node.firstChild);

          }

          if (!this.isEmpty(blockNode)) {

            blockNodes.push(blockNode);

          }

        }

      }

      if (!blockNodes.length && ![...this.listNodesIn(content)].some(node => this.isContainer(node))) {

        const blockNode = document.createElement(tagName);

        while (content.firstChild) {

          blockNode.appendChild(content.firstChild);

        }

        blockNodes.push(blockNode);

      }

    }

    if (blockNodes.length) {

      this.insertAt(range, ...blockNodes);

      // range.setStartBefore(blockNodes[0]);
      // range.setEndAfter(blockNodes[blockNodes.length-1]);

      this.update(range);

    }

  }


  wrapListAt(range, tagName) {

    let wrapNode = this.createNode(tagName);

    if (range.collapsed) {

      const li = document.createElement("li");
      const br = document.createElement("br");
      li.appendChild(br);
      wrapNode.appendChild(li);

      this.insertContainerAt(range, wrapNode);

      range.setStart(li, 0);
      range.collapse(true);

      // range.setStart(li, 0);
      // range.collapse(true)

    } else {

      this.selectDown(range); // -> not really needed!

      let content = range.extractContents();

      for (let node of this.listNodesIn(content)) {

        if (this.isBlock(node)) {

          const li = document.createElement("li");

          while (node.firstChild) {

            li.appendChild(node.firstChild);

          }

          wrapNode.appendChild(li);

        }

      }

      if (!wrapNode.hasChildNodes()) {

        const li = document.createElement("li");

        while (content.firstChild) {

          li.appendChild(content.firstChild);

        }

        wrapNode.appendChild(li);

      }

      this.insertContainerAt(range, wrapNode);

      // range.selectNodeContents(wrapNode);

    }

    this.update(range);

  }

  unwrapList(listNode) {

    const paragraphs = [];

    for (let li of listNode.childNodes) {

      let p = document.createElement("p");

      paragraphs.push(p);

      while (li.firstChild) {

        p.appendChild(li.firstChild);

      }

      listNode.parentNode.insertBefore(p, listNode);

    }

    listNode.remove();

    // return paragraphs;

    const range = this.range || new Range();

    if (paragraphs.length) {

      range.setStartBefore(paragraphs[0]);
      range.setEndAfter(paragraphs[paragraphs.length-1]);

      this.update(range);

    }

  }

	getNodeResource(node) {

		if (this.isElement(node)) {

			return this.constructor.tags.get(node.tagName) || {};

		} else if (this.isText(node)) {

			return {
				type: "text",
				validInTypes: ["inline", "block"]
			};

		}

	}


  getRoot() {

    return this.element;

  }

  isRoot(node) {

    return node === this.element;

  }

	isDiv(node) {

		return node.tagName === "DIV";

  }

	isColumn(node) {

		return this.isRoot(node) || this.isDiv(node) && node.classList.contains("wp-block-column");

	}

  isContainer(node) {

    // const editNode = new KarmaFieldsAlpha.EditorNode(node);
		//
    // return editNode.isContainer();

		return this.getNodeResource(node).type === "container";

  }

  isBlock(node) {

    // const editNode = new KarmaFieldsAlpha.EditorNode(node);
		//
    // return editNode.isBlock();

		return this.getNodeResource(node).type === "block";

  }

  isInline(node) {

    // const editNode = new KarmaFieldsAlpha.EditorNode(node);
		//
    // return editNode.isInline();

		return this.getType(node).type === "inline";

  }

	getBreakMode(node) {

		const nodeResource = this.getNodeResource(node);

		return nodeResource.breakMode;

	}

  isBreakable(node) {

		const nodeResource = this.getNodeResource(node);

		return nodeResource.breakMode === "list-item" || nodeResource.breakMode === "paragraph";

    // switch (node.tagName) {
		//
    //   case "P":
    //   case "LI":
    //   // case "H1":
    //   // case "H2":
    //   // case "H3":
    //   // case "H4":
    //   // case "H5":
    //   // case "H6":
    //     return true;
		//
    // }

    return false;

    // const editNode = new KarmaFieldsAlpha.EditorNode(node);
    //
    // return editNode.isBreakable();
  }

  isSingle(node) {

		return this.getNodeResource(node).type === "single";

  }

  isText(node) {

    return node && node.nodeType === 3;

  }

  isElement(node) {

    return node && node.nodeType === 1;

  }

  isHeading(node) {

    switch (node.tagName) {

      case "H1":
      case "H2":
      case "H3":
      case "H4":
      case "H5":
      case "H6":
        return true;

    }

    return false;

    // return node.tagName === "H1" || node.tagName === "H2" || node.tagName === "H3" || node.tagName === "H4" || node.tagName === "H5" || node.tagName === "H6";

  }

  isBreakNode(node, range) {

    console.log("deprecared");

    if (range.startContainer === node && range.startOffset === 0) {

      return true;

    }

    return false;

  }

  isValidAttribute(node, key, value) {

    // switch (node.tagName) {
		//
    //   case "A":
    //     return key === "target" || key === "href";
		//
    //   case "IMG":
    //     return true;
		//
    // }
		//
    // return false;

		const nodeResource = this.getNodeResource(node);

		if (nodeResource.validAttributes) {

			return nodeResource.validAttributes.includes(key);

		}

		return false;

  }



  isValid(node) {

		// if (this.isText(node)) {
		//
		// 	return node.length > 0;
		//
		// } else if (this.isElement(node)) {
		//
		//
		//
		// 	return Boolean(nodeResource);
		//
		// }

		const nodeResource = this.getNodeResource(node);

		return Boolean(nodeResource.type);

    // const editNode = new KarmaFieldsAlpha.EditorNode(node);
		//
    // return editNode.isValid();

  }

  isValidIn(node, container) {

		const nodeResource = this.getNodeResource(node);

		if (nodeResource.validInTypes) {

			const containerResource = this.getNodeResource(container);

			return nodeResource.validInTypes.includes(containerResource.type);

		} else if (nodeResource.validInTags) {

			return nodeResource.validInTags.includes(container.tagName);

		}

		return false;

  }


  isEmpty(node) {

    return !node.textContent.trim();

  }

	isNodeEmpty(node) {

		const nodeResource = this.getNodeResource(node);

		if (nodeResource.type === "inline" || nodeResource.type === "text") {

			return !node.textContent.trim();

		} else if (nodeResource.type === "block") {

			for (let child of node.childNodes) {

				const childResource = this.getNodeResource(child);

				if (childResource.type === "text" && child.textContent.trim() > 0 || childResource.type === "inline" && child.textContent.trim() > 0 || child.tagName !== "BR") {

					return false;

				}

			}

			return true;

		} else if (nodeResource.type === "container") {

			for (let child of node.childNodes) {

				if (this.isElement(child) || this.isText(child) && child.textContent.trim() > 0) {

					return false;

				}

			}

			return true;

		}

		return false;
  }

  // isEmptyBlock(node) {
  //
  //   return this.isBlock(node)
  //
  // }
  //
  // isEmptyText(node) {
  //
  //   return (this.isText(node) || this.isInline(node)) && !node.textContent.trim();
  //
  // }

  getType(node) {

		return this.getNodeResource(node).type || "";

  }

  reset() {

    if (this.element.childNodes.length !== 1 || this.element.firstChild.tagName !== "P" || this.element.firstChild.childNodes.length !== 1 || this.element.firstChild.firstChild.tagName !== "BR") {

      while (this.element.hasChildNodes()) {

        this.element.removeChild(this.element.firstChild);

      }

      const p = document.createElement("p");
      p.appendChild(document.createElement("br"));

      this.element.appendChild(p);

      if (this.range) {

        this.range.setStart(p, 0);
        this.range.collapse(true);

      }

    }

  }

  createEmpty(tagName) {

    const node = document.createElement(tagName);

    node.appendChild(document.createElement("br"));

    return node;

  }


  getNodeLength(node) {

    if (node.nodeType === 3) {

      return node.textContent.trimEnd().length;

    } else {

      return node.childNodes.length;
    }

  }

  resetBlock(node) {

    while (node.firstChild) {

      node.removeChild(node.firstChild);

    }

    node.appendChild(document.createElement("br"));

  }

  breakLine(range, shift) {

    if (!range || !range.startContainer || !this.element.contains(range.startContainer)) {

      console.error("A valid range is required.");
      return;

    }

    if (!range.collapsed) {

      this.delete(range);

    }


    if (shift) {

      // while (!this.isBlock(range.endContainer) && !this.isContainer(range.endContainer) && !this.isRoot()) {
			//
      //   range.setEndAfter(range.endContainer);
			//
      // }

			let node = range.startContainer;

			while (this.isText(node) || this.isInline(node)) {

				node = node.parentNode;

			}

			if (node.lastChild) {

				range.setEndAfter(node.lastChild);

			}

      const contentAfter = range.extractContents();
      // range.collapse(false);

      let br = document.createElement("br");
      range.insertNode(br);
      range.collapse(false);

      if (br.previousSibling && this.isEmpty(br.previousSibling) && br.previousSibling.tagName !== "BR") { // -> if linebreak is at begin of a paragraph

        br.parentNode.removeChild(br.previousSibling);

      }

      if (!this.isEmpty(contentAfter)) {

        range.insertNode(contentAfter);
        range.collapse(true);

			} else {

				let br2 = document.createElement("br");
        range.insertNode(br2);
        range.collapse(true);

			}

      // if (!br.nextSibling) {
			//
      //   // range.setStartAfter(br);
      //   // range.collapse(true);
			//
      //   let br2 = document.createElement("br");
      //   range.insertNode(br2);
      //   range.collapse(true);
			//
      // }

      return;

    }

    let node = range.startContainer;

    // while (!this.isRoot(node) && !this.isBlock(node) && !this.isContainer(node)) {
		//
    //   node = node.parentNode;
		//
    // }

		while (this.isText(node) || this.isInline(node)) {

      node = node.parentNode;

    }

    // if (this.isContainer(node)) {
		//
		// 	console.error("breaking line in container!");
		//
		// 	while (!this.isRoot(node)) {
		//
		// 		range.setStartAfter(node);
    //     range.collapse(true);
		//
    //     node = node.parentNode;
		//
    //   }
		//
		// 	const newNode = this.createEmpty("p");
		//
		// 	// document.createElement("p");
		// 	//
    //   // newNode.appendChild(document.createElement("br"));
		//
    //   // this.insertAt(range, newNode);
    //   range.insertNode(newNode);
    //   range.setStart(newNode, 0);
    //   range.collapse(true);
		//
		//
		// } else if (this.isBlock(node)) {

		let container = node;

		while (!this.isDiv(container.parentNode)) {

			container = container.parentNode;

		}

		const resource = this.getNodeResource(node);

		if (resource.breakMode === "paragraph-origin") {

			range.setEndAfter(node.lastChild);

			let contentAfter = range.extractContents();

			const block = document.createElement("p");

      if (this.isEmpty(contentAfter)) {

				block.appendChild(document.createElement("br"))

			} else {

				block.appendChild(contentAfter);

			}

			if (this.isEmpty(node)) {

				this.resetBlock(node);

			} else {

				while ((this.isText(node.lastChild) || this.isInline(node.lastChild)) && this.isEmpty(node.lastChild) || this.isSingle(node.lastChild) && node.lastChild.tagName === "BR") {

					node.lastChild.remove();

				}

      }

			range.setStartAfter(node);
			range.collapse(true);
			range.insertNode(block);
			range.setStart(block, 0);
			range.collapse(true);

		} else if (resource.breakMode === "list-item") {

			// const container = node.parentNode;

			range.setEndAfter(node.lastChild);

			let contentAfter = range.extractContents();

			if (this.isEmpty(node) && node === node.parentNode.lastChild) {

				const block = document.createElement("p");

				if (this.isEmpty(contentAfter)) {

					block.appendChild(document.createElement("br"));

				} else {

					block.appendChild(contentAfter);

				}

				range.selectNode(node);
				range.deleteContents();

				range.setStartAfter(container);
				range.collapse(true);
				range.insertNode(block);
				range.setStart(block, 0);
				range.collapse(true);

				if (!container.hasChildNodes()) {

					container.remove();

				}

			} else if (this.isEmpty(node) && node === node.parentNode.firstChild) {

				const block = document.createElement("p");
				block.appendChild(document.createElement("br"));

				this.empty(node);

				if (this.isEmpty(contentAfter)) {

					node.appendChild(document.createElement("br"));

				} else {

					node.appendChild(contentAfter);

				}

				range.setStartBefore(container);
				range.collapse(true);
				range.insertNode(block);

				range.setStart(node, 0);
				range.collapse(true);

			} else {

				if (this.isEmpty(node)) {

					this.resetBlock(node);

				}

				range.setStartAfter(node);
				range.collapse(true);

				const block = document.createElement(node.tagName.toLowerCase());

				if (this.isEmpty(contentAfter)) {

					block.appendChild(document.createElement("br"));

				} else {

					block.appendChild(contentAfter);

				}

				range.insertNode(block);
				range.setStart(block, 0);

				range.collapse(true);

			}

		} else if (resource.breakMode === "cell") {

			if (node.lastChild) {

				range.setEndAfter(node.lastChild);

			}

			let contentAfter = range.extractContents();

			// let container = node;
			//
			// while (!this.isDiv(container.parentNode)) {
			//
			// 	container = container.parentNode;
			//
			// }


			let cellBefore = this.getPreviousCell(node, container);
			let cellAfter = this.getNextCell(node, container);

			if (!cellBefore && this.isEmpty(node)) {

				const block = this.createEmpty("p");
				// const block = document.createElement("p");

				// container.parentNode.insertBefore(block);
				range.setStartBefore(container);
				range.collapse(true);
				range.insertNode(block);

				if (this.isEmpty(contentAfter)) {

					this.empty(node);

				} else {

					node.appendChild(contentAfter);

				}

				range.setStart(node, 0);

			} else if (cellAfter) {

				range.insertNode(contentAfter);
				range.setStart(cellAfter, 0);
				range.collapse(true);

				// if (!this.isEmpty(contentAfter)) {
				//
				//
				// 	range.collapse(true);
				//
				// }

			} else {

				if (!this.isEmpty(contentAfter)) {

					range.insertNode(contentAfter);

				}

				const block = document.createElement("p");
				block.appendChild(document.createElement("br"));

				// if (this.isEmpty(contentAfter)) {
				//
				// 	block.appendChild(document.createElement("br"));
				//
				// } else {
				//
				// 	block.appendChild(contentAfter);
				//
				// }

				range.setStartAfter(container);
				range.collapse(true);

				range.insertNode(block);
				range.collapse(true);

			}

		} else if (resource.breakMode === "paragraph-0") {

			if (node.lastChild) {

				range.setEndAfter(node.lastChild);

			}

			let contentAfter = range.extractContents();

			const block = document.createElement("p");

			if (this.isEmpty(node)) {

				block.appendChild(document.createElement("br"));

				range.setStartBefore(container);
				range.collapse(true);
				range.insertNode(block);
				range.collapse(false);

				if (this.isEmpty(contentAfter)) {

					if (node.tagName === "P") {

						this.empty(node);
						node.appendChild(document.createElement("br"));

						range.setStart(node, 0);
						range.collapse(true);

					} else {

						range.selectNode(node);
						range.deleteContents();
						range.setStart(block, 0);
						range.collapse(true);

					}

				} else {

					this.empty(node);
					node.appendChild(contentAfter);

					range.setStart(node, 0);
					range.collapse(true);

				}

			} else {

				while ((this.isText(node.lastChild) || this.isInline(node.lastChild)) && this.isEmpty(node.lastChild) || this.isSingle(node.lastChild) && node.lastChild.tagName === "BR") {

					node.lastChild.remove();

				}

				if (this.isEmpty(contentAfter)) {

					block.appendChild(document.createElement("br"));

				} else {

					block.appendChild(contentAfter);

				}

				range.setStartAfter(container);
				range.collapse(true);
				range.insertNode(block);
				range.setStart(block, 0);
				range.collapse(true);

			}

		} else if (resource.breakMode === "paragraph") {

			if (node.lastChild) {

				range.setEndAfter(node.lastChild);

			}

			let contentAfter = range.extractContents();
			contentAfter.normalize();

			const block = document.createElement("p");

			if (this.isEmpty(node)) {

				// -> leave column ?
				if ((node === node.parentNode.firstChild || node === node.parentNode.lastChild && this.isEmpty(contentAfter)) && !this.isRoot(container.parentNode)) {

					container = container.parentNode;

					while (!this.isColumn(container.parentNode)) {

						container = container.parentNode;

					}

					block.appendChild(document.createElement("br"));

					if (node === node.parentNode.firstChild) {

						if (!this.isEmpty(contentAfter)) {

							node.appendChild(contentAfter);

						} else {

							this.resetBlock(node);

						}

						range.setStartBefore(container);
						range.collapse(true);
						range.insertNode(block);
						range.setStart(node, 0);
						range.collapse(true);

					} else if (node === node.parentNode.lastChild) {

						const column = node.parentNode;

						range.selectNode(node);
						range.deleteContents();

						if (this.isEmpty(column)) {

							this.empty(column);

							const p = document.createElement("p");
							p.appendChild(document.createElement("br"));
							column.appendChild(p);
							
						}

						range.setStartAfter(container);
						range.collapse(true);
						range.insertNode(block);
						range.setStart(block, 0);
						range.collapse(true);

					}

				} else {

					block.appendChild(document.createElement("br"));

					range.setStartBefore(container);
					range.collapse(true);
					range.insertNode(block);
					range.collapse(false);

					if (this.isEmpty(contentAfter)) {

						if (node.tagName === "P") {

							this.empty(node);
							node.appendChild(document.createElement("br"));

							range.setStart(node, 0);
							range.collapse(true);

						} else {

							range.selectNode(node);
							range.deleteContents();
							range.setStart(block, 0);
							range.collapse(true);

						}

					} else {

						this.empty(node);
						node.appendChild(contentAfter);

						range.setStart(node, 0);
						range.collapse(true);

					}

				}

			} else {

				while ((this.isText(node.lastChild) || this.isInline(node.lastChild)) && this.isEmpty(node.lastChild) || this.isSingle(node.lastChild) && node.lastChild.tagName === "BR") {

					node.lastChild.remove();

				}

				if (this.isEmpty(contentAfter)) {

					block.appendChild(document.createElement("br"));

				} else {

					block.appendChild(contentAfter);

				}

				range.setStartAfter(container);
				range.collapse(true);
				range.insertNode(block);
				range.setStart(block, 0);
				range.collapse(true);

			}

		} else if (resource.breakMode === "container") {

			range.setStart(node, 0);
			const contentBefore = range.cloneContents();

			const block = document.createElement("p");
			block.appendChild(document.createElement("br"));

			// console.log(contentBefore.childNodes);

			contentBefore.normalize();

			if (!contentBefore.hasChildNodes()) {

				range.setStartBefore(container);
				range.collapse(true);
				range.insertNode(block);
				range.setStart(node, 0);
				range.collapse(true);

			} else {

				range.setStartAfter(container);
				range.collapse(true);
				range.insertNode(block);
				range.setStart(block, 0);
				range.collapse(true);

			}

		} else if (resource.breakMode === "div") {

			const block = document.createElement("p");
			block.appendChild(document.createElement("br"));

			range.insertNode(block);
			range.setStart(block, 0);
			range.collapse(true);

		}

		while (range.startContainer.firstChild && (this.isText(range.startContainer.firstChild) || this.isInline(range.startContainer.firstChild))) {

			range.setStart(range.startContainer.firstChild, 0);
			range.collapse(true);

		}

		// }

  }

  empty(node) {

    while (node.firstChild) {

      node.removeChild(node.firstChild);

    }

  }

  join(leftNode, rightNode) {

    if (this.isEmpty(leftNode) && this.isEmpty(rightNode)) {

      this.empty(leftNode);

      const br = document.createElement("br");

      leftNode.appendChild(br);

      rightNode.remove();

      return [null, br];

    }

    if (this.isEmpty(leftNode)) {

      leftNode.remove();

      return [null, rightNode.firstChild];

    }

    if (this.isEmpty(rightNode)) {

      // this.empty(rightNode);

      rightNode.remove();

      return [leftNode.lastChild, null];

    }

    let innerLeftNode = leftNode.lastChild;
    let innerRightNode = rightNode.firstChild;

    while (rightNode.firstChild) {

      leftNode.appendChild(rightNode.firstChild);

    }

    rightNode.remove();

    return [innerLeftNode, innerRightNode];

  }



  isJoinable(node1, node2) {

    return this.isBlock(node1) && this.isBlock(node2) || this.isInline(node1) && this.isInline(node2) && node1.tagName === node2.tagName;

  }

	isMergeable(node) {

		const nodeResource = this.getNodeResource(node);

		if (nodeResource.mergeableInTypes || nodeResource.mergeableInTags) {

			return true;

		}

		return false;

	}

	isMergeableWith(node, nodeToMerge) {

		const nodeResource = this.getNodeResource(node);

		if (nodeResource.mergeableInTypes) {

			const nodeToMergeResource = this.getNodeResource(nodeToMerge);

			return nodeResource.mergeableInTypes.includes(nodeToMergeResource.type);

		} else if (nodeResource.mergeableInTags) {

			return nodeResource.mergeableInTags.includes(nodeToMerge.tagName);

		} else {

			return false;
		}

	}

	areMergeable(leftNode, rightNode) {

		const rightNodeResource = this.getNodeResource(rightNode);

		if (rightNodeResource.mergeableInTypes) {

			const leftNodeResource = this.getNodeResource(leftNode);

			return rightNodeResource.mergeableInTypes.includes(leftNodeResource.type);

		} else if (rightNodeResource.mergeableInTags) {

			return rightNodeResource.mergeableInTags.includes(leftNode.tagName);

		} else {

			return false;
		}

	}


  // delete(range) {
	//
  //   if (!range.collapsed) {
	//
  //     while (range.startOffset >= this.getNodeLength(range.startContainer) && !this.isRoot(range.startContainer)) {
	//
  //       range.setStartAfter(range.startContainer);
	//
  //     }
	//
  //     while (range.startOffset === 0 && !this.isRoot(range.startContainer)) {
	//
  //       range.setStartBefore(range.startContainer);
	//
  //     }
	//
  //     while (range.endOffset === 0 && !this.isRoot(range.endContainer)) {
	//
  //       range.setEndBefore(range.endContainer);
	//
  //     }
	//
  //     while (range.endOffset >= this.getNodeLength(range.endContainer) && !this.isRoot(range.endContainer)) {
	//
  //       range.setEndAfter(range.endContainer);
	//
  //     }
	//
  //     range.deleteContents();
	//
  //     let node = range.startContainer
	//
  //     // while (!this.isRoot(node) && this.isEmpty(node)) {
  //     //
  //     //   const parent = node.parentNode;
  //     //
  //     //   parent.removeChild(node);
  //     //
  //     //   node = parent;
  //     //
  //     // }
	//
  //     node.parentNode.normalize();
	//
  //     range.collapse(true);
	//
  //     if (!this.element.hasChildNodes()) {
	//
  //       this.reset()
	//
  //     }
	//
  //     while (this.isElement(range.startContainer) && range.startOffset > 0) {
	//
  //       range.selectNodeContents(range.startContainer.childNodes[range.startOffset-1]);
  //       range.collapse(false);
	//
  //     }
	//
  //     return true;
	//
  //   }
	//
	//
  //   if (this.isEmpty(this.element)) {
	//
  //     return true; // -> prevent default BUT should not save!
	//
  //   } else if (this.isText(range.startContainer) && range.startOffset > 0) { // => inside text node
	//
  //     // range.setStart(range.startContainer, range.startOffset-1);
  //     // range.deleteContents();
	// 		//
  //     // return true;
	//
	//
  //     return false;
	//
  //   } else if (range.startOffset > 0) { // => between 2 nodes
	//
  //     // let nodeBefore = range.startContainer.childNodes[range.startOffset-1];
  //     //
  //     // while (nodeBefore) {
  //     //
  //     //   range.selectNodeContents(nodeBefore);
  //     //   range.collapse(false);
  //     //
  //     //   nodeBefore = nodeBefore.lastChild;
  //     //
  //     // }
  //     //
  //     // return this.delete();
  //     //
  //     // return false;
	//
	//
	//
  //     let nodeBefore = range.startContainer.childNodes[range.startOffset-1];
	//
  //     while (!this.isSingle(nodeBefore) && !this.isText(nodeBefore) && nodeBefore.lastChild) {
	//
  //       nodeBefore = nodeBefore.lastChild;
	//
  //     }
	//
  //     if (this.isText(nodeBefore) && nodeBefore.length > 0) {
	//
  //       range.selectNodeContents(nodeBefore);
  //       range.setStart(range.startContent, range.startOffset-1);
  //       range.deleteContents();
	//
  //     } else {
	//
  //       range.selectNode(nodeBefore);
  //       range.deleteContents();
	//
  //     }
	//
  //     return true;
	//
  //   } else { // => at start of node (text or element)
	//
  //     let node = range.startContainer;
	//
  //     while (node === node.parentNode.firstChild && !this.isRoot(node.parentNode) && !this.isBlock(node)) {
	//
  //       node = node.parentNode;
	//
  //     }
	//
  //     if (this.isText(node)) { // -> actually never happens
	//
  //       node.parentNode.normalize();
	//
  //       return false;
	//
  //     } else if (this.isInline(node)) { // -> actually never happens
	//
  //       // if (node.previousSibling && node.previousSibling.tagName === node.tagName) {
  //       //
  //       //   this.join(node.previousSibling, node);
  //       //
  //       //   node.parentNode.normalize();
  //       //
  //       // }
	//
  //       node.parentNode.normalize();
	//
  //       return false;
	//
  //     } else if (this.isBlock(node)) {
	//
  //       let rightNode = node;
	//
  //       while (!node.previousSibling && !this.isRoot(node)) {
	//
  //         node = node.parentNode;
	//
  //       }
	//
  //       let leftNode = node.previousSibling;
	//
  //       while (leftNode && !this.isBlock(leftNode)) {
	//
  //         leftNode = leftNode.lastChild;
	//
  //       }
	//
  //       if (leftNode) {
	//
  //         [leftNode, rightNode] = this.join(leftNode, rightNode);
	//
  //         while (leftNode && rightNode && this.isInline(leftNode) && this.isInline(rightNode) && leftNode.tagName === rightNode.tagName) {
	//
  //           [leftNode, rightNode] = this.join(leftNode, rightNode);
	//
  //         }
	//
  //         // if (leftNode) {
  //         //
  //         //   range.setStartAfter(leftNode);
  //         //   range.collapse(true);
  //         //
  //         //   leftNode.parentNode.normalize();
  //         //
  //         // } else if (rightNode) {
  //         //
  //         //   range.setStartBefore(rightNode);
  //         //   range.collapse(true);
  //         //
  //         //   rightNode.parentNode.normalize();
  //         //
  //         // }
	//
  //         if (rightNode) {
	//
  //           range.setStartBefore(rightNode);
  //           range.collapse(true);
	//
  //           let node = rightNode;
	//
  //           while (node && !this.isSingle(node)) {
	//
  //             range.setStart(node, 0);
  //             range.collapse(true);
	//
  //             node = node.firstChild;
	//
  //           }
	//
  //           rightNode.parentNode.normalize();
	//
  //         } else if (leftNode) {
	//
  //           range.setStartAfter(leftNode);
  //           range.collapse(true);
	//
  //           let node = leftNode;
	//
  //           while (node && !this.isSingle(node)) {
	//
  //             range.selectNodeContents(node);
  //             range.collapse(false);
	//
  //             node = node.lastChild;
	//
  //           }
	//
  //           leftNode.parentNode.normalize();
	//
  //         }
	//
	// 				return true;
	//
	// 			} else {
	//
	// 				return false;
	// 			}
	//
	//
	//
  //     } else if (this.isContainer(node)) {
	//
  //       let rightNode = node;
	//
  //       while (!node.previousSibling && !this.isRoot(node)) {
	//
  //         node = node.parentNode;
	//
  //       }
	//
  //       let leftNode = node.previousSibling;
	//
  //       if (this.isEmpty(rightNode)) {
	//
  //         rightNode.remove();
	//
  //       }
	//
  //       if (leftNode) {
	//
  //         while (leftNode.lastChild) {
	//
  //           leftNode = leftNode.lastChild;
	//
  //         }
	//
  //         range.selectNodeContents(leftNode);
  //         range.collapse(false);
	//
  //       }
	//
  //       return false;
	//
  //     }
	//
  //   }
	//
  //   return false;
	//
  // }

	delete(range) {

		if (!range.collapsed) {

			while (range.startOffset >= this.getNodeLength(range.startContainer) && !this.isRoot(range.startContainer)) {

				range.setStartAfter(range.startContainer);

			}

			while (range.startOffset === 0 && !this.isRoot(range.startContainer)) {

				range.setStartBefore(range.startContainer);

			}

			while (range.endOffset === 0 && !this.isRoot(range.endContainer)) {

				range.setEndBefore(range.endContainer);

			}

			while (range.endOffset >= this.getNodeLength(range.endContainer) && !this.isRoot(range.endContainer)) {

				range.setEndAfter(range.endContainer);

			}

			range.deleteContents();

			let node = range.startContainer;

			node.parentNode.normalize();

			range.collapse(true);

			if (!this.element.hasChildNodes()) {

				this.reset();

			}

			while (this.isElement(range.startContainer) && range.startOffset > 0) {

				range.selectNodeContents(range.startContainer.childNodes[range.startOffset-1]);
				range.collapse(false);

			}

			return true;

		}


		if (this.isEmpty(this.element)) {

			return true; // -> prevent default BUT should not save!

		} else if (this.isText(range.startContainer) && range.startOffset > 0) { // => inside text node

			// range.setStart(range.startContainer, range.startOffset-1);
			// range.deleteContents();
			//
			// if (range.startOffset > 1 && range.startContainer.data[range.startContainer.length - 2] === " ") {
			//
			// 	range.startContainer.data[range.startContainer.length - 2] = "&nbsp;";
			// }
			//
			// // console.log(range.startContainer, range.startContainer.length, range.startContainer.data[range.startContainer.length - 2]);
			//
			// return true;


			return false;

		} else if (range.startOffset > 0) { // => between 2 nodes

			let node = range.startContainer.childNodes[range.startOffset-1];

			if (this.isEmpty(node)) {

				range.selectNode(node);
				range.deleteContents();

				return true;

			} else {

				while (node.lastChild) {

					node = node.lastChild;

				}

				if (this.isText(node) && node.length > 0) {

					range.selectNodeContents(node);
					range.collapse(false);

					return false;

					// range.setStart(range.startContent, range.startOffset-1);
					// range.deleteContents();

				} else { // -> single or empty node

					range.selectNode(node);
					range.deleteContents();

					return true;

				}

			}

		} else { // => at start of node (text or element)

			let node = range.startContainer;

			while (node === node.parentNode.firstChild && !this.isRoot(node) && !this.isMergeable(node)) {

				node = node.parentNode;

			}

			if (this.isMergeable(node)) {

				let rightNode = node;
				let containerNode;

				while (!node.previousSibling && !this.isRoot(node.parentNode)) {

					node = node.parentNode;
					containerNode = node;

				}

				let leftNode = node.previousSibling;

				if (leftNode) {

					while (leftNode.lastChild && !this.isMergeableWith(rightNode, leftNode)) {

						leftNode = leftNode.lastChild;

					}

					while (leftNode && rightNode && this.isMergeableWith(rightNode, leftNode)) {

						[leftNode, rightNode] = this.join(leftNode, rightNode);

					}

					if (leftNode) {

						while (leftNode.lastChild) {

							leftNode = leftNode.lastChild

						}

						if (this.isSingle(leftNode)) {

							range.setStartAfter(leftNode);
							range.collapse(true);

						} else {

							range.selectNodeContents(leftNode);
							range.collapse(false);

						}

						leftNode.parentNode.normalize();

					} else if (rightNode) {

						while (rightNode.firstChild) {

							rightNode = rightNode.firstChild;

						}

						if (this.isSingle(rightNode)) {

							range.setStartBefore(rightNode);
							range.collapse(true);

						} else {

							range.setStart(rightNode, 0);
							range.collapse(true);

						}

						rightNode.parentNode.normalize();

					}

				}

				if (containerNode && !this.isRoot(containerNode)) {

					// while (!this.isRoot(containerNode.parentNode) && this.isEmpty(containerNode.parentNode)) {
					//
					// 	containerNode = containerNode.parentNode;
					//
					// }

					if (this.isEmpty(containerNode)) {

						containerNode.remove();

					}

				}

				return true;

			} else if (!this.isRoot(node) && node.previousSibling) { // not mergeable -> set range to last node

				node = node.previousSibling;

				while (node.lastChild) {

					node = node.lastChild;

				}

				if (this.isSingle(node)) {

					range.setStartAfter(node);
					range.collapse(true);

				} else {

					range.selectNodeContents(node);
					range.collapse(false);

				}

				return false;

			} else { // -> at start of root container

				return false;

			}

		}

		return false;

	}



  insertAt(range, ...nodes) {

    const clone = range.cloneRange();

    for (let node of nodes) {

      if (this.isInline(node) || this.isText(node) || this.isSingle(node)) {

        this.insertInlineAt(range, node);

      } else if (this.isBlock(node)) {

        // this.insertBlockAt(range, node);
        this.insertContainerAt(range, node); // -> multiple blocks must be inserted as containers

      } else {

        this.insertContainerAt(range, node);

      }

      range.collapse(false);

    }

    range.setStart(clone.startContainer, clone.startOffset);

  }


  insertBlockAt(range, block) {

    if (this.isContainer(range.startContainer)) {

      while (!this.isValidIn(block, range.startContainer) && !this.isRoot(range.startContainer)) {

        range.setStartAfter(range.startContainer);

      }

      if (!this.isValidIn(block, range.startContainer)) {

        const p = document.createElement("p");

        while (block.firstChild) {

          p.appendChild(block.firstChild);

        }

        block = p;

      }

      range.insertNode(block);
      range.selectNode(block);

    } else {

      if (this.isEmpty(range.startContainer)) {

        this.empty(range.startContainer);

      }

      const firstChild = block.firstChild;

      while (block.firstChild) {

        range.insertNode(block.firstChild);
        range.collapse(false);

      }

      range.setStartBefore(firstChild);

    }

  }



  // insertContainerAt(range, container) {
	//
  //   if (!range.collapsed) {
	//
  //     range.deleteContents();
	//
  //   }
	//
  //   while (!this.isValidIn(container, range.endContainer) && !this.isRoot(range.endContainer)) {
	//
  //     range.setEndAfter(range.endContainer);
	//
  //   }
	//
  //   const contentAfter = range.extractContents();
	//
  //   range.collapse(false);
	//
  //   range.insertNode(container);
	//
	//
	// 	// Why? Deleting empty paragraph before UL to be inserted looks wrong
	//
  //   // if (container.previousSibling && this.isEmpty(container.previousSibling)) {
	// 	//
  //   //   container.previousSibling.parentNode.removeChild(container.previousSibling);
	// 	//
  //   // }
	// 	//
  //   // if (container.nextSibling && this.isEmpty(container.nextSibling)) {
	// 	//
  //   //   container.nextSibling.parentNode.removeChild(container.nextSibling);
	// 	//
  //   // }
	//
  //   if (!this.isEmpty(contentAfter)) {
	//
  //     range.collapse(false);
  //     range.insertNode(contentAfter);
	//
  //   }
	//
	//
	//
  //   range.selectNode(container);
	//
  // }

	insertContainerAt(range, container) {

    if (!range.collapsed) {

      range.deleteContents();

    }

		let node = range.startContainer;

		while (!this.isValidIn(container, range.endContainer) && !this.isRoot(range.endContainer)) {

      range.setEndAfter(range.endContainer);

    }

    const contentAfter = range.extractContents();

    range.collapse(false);

    range.insertNode(container);



    if (!this.isEmpty(contentAfter)) {

      range.collapse(false);
      range.insertNode(contentAfter);

    }



		while (!this.isValidIn(container, node) && !this.isRoot(node.parentNode)) {

			node = node.parentNode;

		}

		if (this.isEmpty(node)) {

			node.remove();

		}



    range.selectNode(container);

  }

  insertInlineAt(range, node, ...nodes) {

    if (!range.collapsed) {

      range.deleteContents();

    }

    if (this.isText(range.startContainer) || this.isInline(range.startContainer) || this.isBlock(range.startContainer)) {

      // for (let node of nodes) {

        range.insertNode(node);
        range.collapse(false);

        node.parentNode.normalize();

      // }

    } else {

      if (range.startOffset > 0) { // -> insert into last node

        // let nodeBefore = this.getNodeBeforePoint(range.startContainer, range.startOffset);
        let nodeBefore = range.startContainer.childNodes[range.startOffset-1];

        while (nodeBefore && this.isContainer(nodeBefore)) {

          nodeBefore = nodeBefore.lastChild;

        }

        if (nodeBefore) {

          if (this.isEmpty(nodeBefore)) {

            this.empty(nodeBefore);

          }

          // for (let node of nodes) {

            nodeBefore.appendChild(node);

            range.selectNode(node);

          // }

          // range.collapse(false);

        }

      } else { // -> insert into next node

        let nodeAfter = range.startContainer.childNodes[range.startOffset];

        while (nodeAfter && this.isContainer(nodeAfter)) {

          nodeAfter = nodeAfter.firstChild;

        }

        if (nodeAfter && this.isBlock(nodeAfter)) {

          if (this.isEmpty(nodeAfter)) {

            this.empty(nodeAfter);

          }

          nodeAfter.insertBefore(node, nodeAfter.firstChild);

          range.selectNode(node);

        }

      }



    }

  }



  sanitizeNodeAttributes(node) {

    const attributes = [...node.attributes];

    for (let attribute of attributes) {

      if (!this.isValidAttribute(node, attribute.name, attribute.value)) {

        node.removeAttribute(attribute.name);

      }

    }

  }


  // findInvalidNode(node) {
	//
	//
	//
  //   if (!this.isValid(node)) {
	//
  //     return node;
	//
  //   }
	//
  //   if (this.isElement(node)) {
	//
  //     for (let child of node.childNodes) {
	//
  //       const invalidChild = this.findInvalidNode(child);
	//
  //       if (invalidChild) {
	//
  //         return invalidChild;
	//
  //       }
	//
  //     }
	//
  //   }
	//
  // }

  // fixNode(node, refNode) {
	//
  //   let editNode = new KarmaFieldsAlpha.EditorNode(node);
	//
  //   if (!editNode.isValid()) {
	//
  //     node.parentNode.removeChild(node);
	//
  //   } else if (!editNode.isValidIn(node.parentNode)) {
	//
  //     // if (this.isRoot(node.parentNode)) {
  //     if (node.parentNode === refNode) {
	//
  //       if (editNode.isContainer()) {
	//
  //         this.unwrapNode(node);
	//
  //       } else if (editNode.isInline() || editNode.isText()) {
	//
  //         let previousNode = node.previousSibling;
	//
  //         // while (previousNode && !(new KarmaFieldsAlpha.EditorNode(previousNode)).isBlock()) {
  //         while (previousNode && !this.isBlock(previousNode)) {
	//
  //           previousNode = previousNode.lastChild;
	//
  //         }
	//
  //         if (!previousNode) {
	//
  //           previousNode = document.createElement("p");
  //           node.parentNode.insertBefore(previousNode, node);
	//
  //         }
	//
  //         if (this.isValidIn(node, previousNode)) {
	//
  //           previousNode.appendChild(node);
	//
  //         }
	//
  //       } else {
	//
  //         node.parentNode.removeChild(node);
	//
  //       }
	//
  //     } else {
	//
  //       node.parentNode.parentNode.insertBefore(node, node.parentNode.nextSibling); // = insert after parentNode
	//
  //       // this.insertAfter(node, node);
	//
  //     }
	//
  //   }
	//
  // }

  sanitize(container) {


    const nodes = [...(container || this.element).childNodes];

    // const nodes = [...this.listNodesIn(container || this.element)];

    for (let node of nodes) {

      if (node.parentNode && !this.isValid(node)) {

        node.parentNode.removeChild(node);

      } else if (this.isElement(node)) {

        if (node.hasAttributes()) {

          this.sanitizeNodeAttributes(node);

        }

        this.sanitize(node);

        // if (!this.isValidIn(node, node.parentNode) || node.tagName === "DIV" || node.tagName === "SPAN") {
				if (!this.isValidIn(node, node.parentNode)) {

          while (node.firstChild) {

            node.parentNode.insertBefore(node.firstChild, node);

          }

          node.parentNode.removeChild(node);

        }

        if (!this.isSingle(node) && !node.hasChildNodes()) {

          node.remove();

        }

      }

    }

  }



  copy(range) {

    this.selectDown(range);

    // for (let node of this.listNodesAt(range)) {
    //
    // }

    const content = range.cloneContents();

    const container = document.createElement("div");
    container.appendChild(content);

    return container.innerHTML;

  }

  cut(range) {

    this.selectDown(range);

    const content = range.extractContents();

    this.delete(range);

    const container = document.createElement("div");
    container.appendChild(content);

    return container.innerHTML;

  }

  paste(range, html) {

    const container = document.createElement("div");
    container.innerHTML = html;

    this.sanitize(container);

    container.normalize();

    let child = container.firstChild;

    while (child) {

      container.removeChild(child);

      this.insertAt(range, child);

      range.collapse(false);

      child = container.firstChild;

    }

  }


  // clean(node) { // not used
	//
  //   if (this.isValid(node)) {
	//
  //     if (node.nodeType === 1 && node.hasAttributes()) {
	//
  //       for (let attribute of node.attributes) {
	//
  //         node.removeAttributeNode(attribute);
	//
  //       }
	//
  //     }
	//
  //     // if (node.tagName === "SPAN" && node.childNodes.length === 1 && node.firstChild.nodeType === 3) {
  //     //
  //     //   node.replaceWith(node.firstChild);
  //     //
  //     // }
	//
	//
  //     let child = node.firstChild;
	//
  //     while (child) {
	//
  //       const next = child.nextSibling;
	//
  //       if (this.isElement(child)) {
	//
  //         this.clean(child);
	//
  //       }
	//
  //       child = next;
	//
  //     }
	//
  //     if (node.parentNode && (node.tagName === "SPAN" || node.tagName === "DIV")) {
	//
  //       this.unwrapNode(node);
	//
  //     }
	//
  //     node.normalize();
	//
  //   } else {
	//
  //     node.remove();
	//
  //   }
	//
  // }


  updateNode(node, tagName, params) {

    if (tagName) {

      const newNode = document.createElement(tagName);

      while (node.firstChild) {

        newNode.appendChild(node.firstChild);

      }

      node.replaceWith(newNode);

      node = newNode;

    }

    while (node.attributes.length) {

      node.removeAttributeNode(node.attributes[0]);

    }

    if (params) {

      for (let key in params) {

        if (params[key]) {

          node.setAttribute(key, params[key]);

        }

      }

    }

    // const range = this.range || new Range();

    this.range.selectNode(node);

    this.update(this.range);

    return this.range;

  }

  removeNode(node) {

    this.range.setStartBefore(node);
    this.range.collapse(true);

    this.update(this.range);

    node.parentNode.removeChild(node);

  }

  selectNode(...nodes) {

    this.range.setStartBefore(nodes[0]);
    this.range.setEndAfter(nodes[nodes.length-1]);

  }



	static register(tags, args) {

		// const {tags, type, validIn, breakMode} = args;

		if (!this.tags) {

			this.tags = new Map();

		}

		for (let tag of tags) {

			this.tags.set(tag, args);

		}

	}

}


// KarmaFieldsAlpha.Editor.register(["UL", "OL"], {type: "container", validInTags: ["DIV", "TD"]});
// KarmaFieldsAlpha.Editor.register(["H1", "H2", "H3", "H4", "H5", "H6"], {type: "block", validInTags: ["DIV", "TD"]});
// KarmaFieldsAlpha.Editor.register(["SPAN","B","STRONG","EM","I","A","SUB","SUP","SMALL"], {type: "inline", validInTypes: ["block", "inline"]});

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



KarmaFieldsAlpha.EditorNode = class {

  constructor(node) {

    if (!node || !(node instanceof Node)) {

      console.error("Invalid node");

    }

    // if (!parentNode) {
    //
    //   parentNode = node.parentNode;
    //
    // }

    this.node = node;

    this.type = "";
    // this.valid = false;
    this.breakable = false;
    this.validIn = [];

    if (this.isText(node)) {

      // const container = new KarmaFieldsAlpha.EditorNode(parentNode);

      this.type = "text";
      // this.discard = !node.textContent;
      // this.valid = container.isInline() || container.isBlock();
      // this.isValidIn = container => {
      //   const editNode = new KarmaFieldsAlpha.EditorNode(container);
      //   return editNode.isInline() || editNode.isBlock()
      // }

    } else {

      switch (node.tagName) {
        case "UL":
        case "OL":
          this.type = "container";
          // this.discard = !node.hasChildNodes();
          // this.valid = parentNode.tagName === "DIV";
          // this.isValidIn = container => parentNode.tagName === "DIV";
          this.childTag = "LI";
          this.validIn = ["DIV", "TD"];
          break;

        case "DIV":
          this.type = "container";
          // this.valid = parentNode.tagName === "DIV" && node.classList.contains("wp-block-columns");
          // this.isValidIn = container => parentNode.tagName === "DIV";
          this.childTag = "P";
          this.validIn = [];
          break;

        case "FIGURE":
          this.type = "container";
          // this.discard = !node.hasChildNodes();
          // this.valid = parentNode.tagName === "DIV";
          this.validIn = ["DIV", "TD"];
          break;

        case "TABLE":
          this.type = "container";
          // this.discard = !node.hasChildNodes();
          // this.valid = parentNode.tagName === "DIV";
          this.childTag = "TR";
          this.validIn = ["DIV"];
          break;

        case "TBODY":
        case "THEAD":
        case "TFOOTER":
          this.type = "container";
          // this.valid = parentNode.tagName === "TABLE";
          this.childTag = "TR";
          this.validIn = ["TABLE"];
          break;

        case "TR":
          this.type = "container";
          // this.discard = !node.hasChildNodes();
          // this.valid = ["TABLE", "TBODY", "THEAD", "TFOOTER"].includes(parentNode.tagName);
          this.childTag = "TD";
          this.validIn = ["TABLE", "TBODY", "THEAD", "TFOOTER"];
          break;

        case "P":
        case "BLOCKQUOTE":
          this.type = "block";
          this.breakable = true;
          // this.discard = !node.hasChildNodes();
          // this.valid = parentNode.tagName === "DIV";
          this.validIn = ["DIV", "TD"];
          break;

        case "LI":
          this.type = "block";
          this.breakable = true;
          // this.discard =
          // this.valid = parentNode.tagName === "UL" || parentNode.tagName === "OL";
          this.validIn = ["UL", "OL"];
          break;

        case "H1":
        case "H2":
        case "H3":
        case "H4":
        case "H5":
        case "H6":
          this.type = "block";
          this.breakable = false;
          // this.discard = !node.hasChildNodes();
          // this.valid = parentNode.tagName === "DIV";
          this.validIn = ["DIV"];
          break;

        case "FIGCAPTION":
          this.type = "block";
          this.breakable = false;
          // this.valid = parentNode.tagName === "FIGURE";
          this.validIn = ["FIGURE"];
          // this.valid = node.parentNode.tagName === "FIGURE";
          // this.layIn = "FIGURE";
          break;

        case "TH":
        case "TD":
          this.type = "container";
          this.breakable = false;
          // this.valid = parentNode.tagName === "TR";
          this.validIn = ["TR"];
          // this.valid = node.parentNode.tagName === "TR";
          break;

        case "SPAN":
        case "B":
        case "STRONG":
        case "EM":
        case "I":
        case "A":
        case "SUB":
        case "SUP":
        case "SMALL": {
          // const container = new KarmaFieldsAlpha.EditorNode(parentNode);

          this.type = "inline";
          // this.discard = !node.hasChildNodes();
          // this.valid = container.isBlock() || container.isInline();
          break;
        }

        case "IMG":
        case "VIDEO":
          this.type = "single";
          // this.valid = parentNode.tagName === "FIGURE" || parentNode.tagName === "P";
          this.validIn = ["P", "FIGURE"];
          break;

        case "BR":
          this.type = "single";
          this.validIn = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "BLOCKQUOTE", "FIGCAPTION", "LI", "TD"];
          break;

        case "HR": {
          // const container = new KarmaFieldsAlpha.EditorNode(parentNode);
          this.type = "single";
          // this.valid = container.isBlock() || container.isInline();
          this.validIn = ["DIV"];
          break;
        }

        case "ADDRESS":
        case "ARTICLE":
        case "ASIDE":
        case "FOOTER":
        case "HEADER":
        case "HGROUP":
        case "MAIN":
        case "NAV":
        case "SECTION":
          this.type = "container";
          // this.valid = false;
          this.validIn = [];
          break;

        default:
          // this.valid = false;
          break;

      }

    }

  }

  isContainer() {

    return this.type === "container";

  }

  isBlock() {

    return this.type === "block";

  }

  isInline() {

    return this.type === "inline";

  }

  isBreakable() {

    return this.type === "block" && this.breakable;

  }

  isSingle() {

    return this.type === "single";

  }

  isValid() {

    switch (this.type) {

      case "text":
        return this.node.length > 0;

      case "single":
        return true;

      case "inline":
      case "block":
      case "container":
        return this.node.hasChildNodes();

      default:
        return false;

    }

  }

  isValidIn(container) {

    switch (this.type) {

      case "inline":
      case "text":
      case "single": {
        // const editNode = new KarmaFieldsAlpha.EditorNode(container);
        // return editNode.isInline() || editNode.isBlock();
        return true;
      }

      default:
        return this.validIn.includes(container.tagName);

    }

  }

  isText() {

    return this.node.nodeType === 3;

  }

  isElement() {

    return this.node.nodeType === 1;

  }

  isEmpty() {

    switch (this.type) {

      case "single":
        return false;

      case "text":
        return this.node.length === 0;

      default:
        return !this.node.hasChildNodes();

    }

    // return this.type !== "single" && !this.node.hasChildNodes();

  }

  getLength() {

    if (this.isText()) {

      return this.node.textContent.trimEnd().length;

    } else {

      return this.node.childNodes.length;
    }

  }

  empty() {

    while (this.node.firstChild) {

      this.node.removeChild(this.node.firstChild);

    }

  }

  wrap(tagName = "p") {

    const newNode = document.createElement(tagName);

    this.node.parentNode.insertBefore(newNode, this.node);

    newNode.appendChild(this.node);

  }

  unwrap() {

    if (this.node.parentNode) {

      while (this.node.firstChild) {

        this.node.parentNode.insertBefore(this.node.firstChild, this.node);

      }

      this.node.parentNode.removeChild(this.node);

    }

  }

}
