
KarmaFieldsAlpha.Editor = class {

  constructor(element) {

    if (!element) {

      console.error("Container not set");

    }

    this.element = element;

  }

  contains(range) {

    if (!range || !range.commonAncestorContainer) {

      console.error("Invalid range");

    }

    return this.element.contains(range.commonAncestorContainer);
  }

  getContent() {

    if (this.isEmpty(this.element)) {

      return "";

    } else {

      return this.element.innerHTML;

    }

  }

  setContent(content) {

    if (content) {

      this.element.innerHTML = content;

      this.sanitize();

      this.element.normalize();

    } else {

      this.reset();

    }

  }

  selectDown(range) {

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

  getDeepRange(range) {

    range = range.cloneRange();

    this.selectDown(range);

    return range;

  }

  getNodeByTags(range, ...tags) {

    return this.getNode(range, node => this.isElement(node) && node.matches(tags.join(",")));

  }

  getNode(range, fn) {

    if (range.collapsed) {

      let node = range.startContainer;

      while (!this.isRoot(node)) {

        if (fn(node)) {

          return node;

        }

        node = node.parentNode;

      }

    } else {

      const nodeAtStart = this.getNodeAtStart(range, fn);
      const nodeAtEnd = this.getNodeAtEnd(range, fn);

      // if (nodeAtStart === nodeAtEnd) {

        return nodeAtStart || nodeAtEnd;

      // }

    }

  }

  // getNodeAtStart(range, fn) {
  //
  //   if (!range) {
  //
  //     console.error("A valid range is required.");
  //     return;
  //
  //   }
  //
  //   // let nodeAfter = this.getNodeAfterStart(range);
  //
  //   let node = range.startContainer;
  //
  //   if (range.startOffset >= this.getNodeLength(node)) {
  //
  //     while (!this.isRoot(node) && node === node.parentNode.lastChild) {
  //
  //       node = node.parentNode;
  //
  //     }
  //
  //     node = node.nextSibling;
  //
  //     while (node && this.isElement(node)) {
  //
  //       if (fn(node)) {
  //
  //         return node;
  //
  //       }
  //
  //       node = node.firstChild;
  //
  //     }
  //
  //   } else if (range.startOffset === 0) {
  //
  //     while (!this.isRoot(node)) {
  //
  //       if (fn(node)) {
  //
  //         return node;
  //
  //       }
  //
  //       node = node.parentNode;
  //
  //     }
  //
  //   } else if (fn(node)) {
  //
  //     return node;
  //
  //   } else if (this.isElement(node)) {
  //
  //     node = node.childNodes[range.startOffset];
  //
  //     while (node) {
  //
  //       if (fn(node)) {
  //
  //         return node;
  //
  //       }
  //
  //       node = node.firstChild;
  //
  //     }
  //
  //   }
  //
	// }
  //
  // getNodeAtEnd(range, fn) {
  //
  //   if (!range) {
  //
  //     console.error("A valid range is required.");
  //     return;
  //
  //   }
  //
  //   let node = range.endContainer;
  //
  //   if (range.endOffset === 0) {
  //
  //     while (!this.isRoot(node) && node === node.parentNode.firstChild) {
  //
  //       node = node.parentNode;
  //
  //     }
  //
  //     node = node.previousSibling;
  //
  //     while (node && this.isElement(node)) {
  //
  //       if (fn(node)) {
  //
  //         return node;
  //
  //       }
  //
  //       node = node.lastChild;
  //
  //     }
  //
  //   } else if (range.endOffset >= this.getNodeLength(node)) {
  //
  //     while (!this.isRoot(node)) {
  //
  //       if (fn(node)) {
  //
  //         return node;
  //
  //       }
  //
  //       node = node.parentNode;
  //
  //     }
  //
  //   } else if (fn(node)) {
  //
  //     return node;
  //
  //   } else if (this.isElement(node)) {
  //
  //     node = node.childNodes[range.endOffset - 1];
  //
  //     while (node) {
  //
  //       if (fn(node)) {
  //
  //         return node;
  //
  //       }
  //
  //       node = node.lastChild;
  //
  //     }
  //
  //   }
  //
	// }

  // findNodeIn(node, fn) {
  //
  //   if (fn(node)) {
  //
  //     return node;
  //
  //   }
  //
  //   let child = node.firstChild;
  //
  //   while (child) {
  //
  //     const node = this.findNodeIn(child, fn);
  //
  //     if (node) {
  //
  //       return node;
  //
  //     }
  //
  //     child = child.nextSibling;
  //
  //   }
  //
  // }

  getNextNode(node) {

    if (node.firstChild) {

      return node.firstChild;

    }

    while (!node.nextSibling) {

      node = node.parentNode;

    }

    return node.nextSibling;

  }

  *getNodesAt(range, fn) {

    let node = range.startContainer;

    while (node && !this.isRoot(node)) {

      if (fn(node)) {

        yield node;

      }

      node = node.parentNode;
    }


    // if (range.collapsed || (this.isText(range.startContainer) && range.startContainer === range.endContainer)) {
    //
    //   let node = range.startContainer;
    //
    //   while (node && !this.isRoot(node)) {
    //
    //     if (fn(node)) {
    //
    //       yield node;
    //
    //     }
    //
    //     node = node.parentNode;
    //   }
    //
    // } else {

    if (!range.collapsed) {

      range = this.getDeepRange(range);

      let node, endNode;

      if (this.isText(range.startContainer)) {

        node = range.startContainer;

      } else {

        node = range.startContainer.childNodes[range.startOffset];

      }

      if (this.isText(range.endContainer)) {

        endNode = range.endContainer; //this.getNextNode(range.endContainer);

      } else {

        endNode = range.endContainer.childNodes[range.endOffset];

      }

      while (node && node !== endNode && !this.isRoot(node)) {

        if (fn(node)) {

          yield node;

        }

        node = this.getNextNode(node);

      }

    }

  }

  hasNodeAt(range, fn) {

    return !this.getNodesAt(range, fn).next().done;

  }

  getNodeAtStart(range, fn) {

    range = this.getDeepRange(range);

    let node = range.startContainer;

    while (!this.isRoot(node)) {

      if (fn(node)) {

        return node;

      }

      node = node.parentNode;

    }

    if (this.isElement(range.startContainer)) {

      node = range.startContainer.childNodes[range.startOffset];

      while (node) {

        if (fn(node)) {

          return node;

        }

        node = node.firstChild;

      }

    }

  }

  getNodeAtEnd(range, fn) {

    range = this.getDeepRange(range);

    let node = range.endContainer;

    while (!this.isRoot(node)) {

      if (fn(node)) {

        return node;

      }

      node = node.parentNode;

    }

    if (this.isElement(range.endContainer)) {

      node = range.endContainer.childNodes[range.endOffset - 1];

      while (node) {

        if (fn(node)) {

          return node;

        }

        node = node.lastChild;

      }

    }

  }

  wrap(range, tagName, params) {

    if (!range || !tagName) {

      console.error("A valid range and tagName are required.");
      return;

    }

    if (!range.collapsed) {

      if (this.isContainer(range.commonAncestorContainer)) {

        this.selectDown(range);

        const content = range.extractContents();

        // for (let node of content.childNodes) {
        while (content.firstChild) {

          const child = content.firstChild;
          range.insertNode(child);
          range.selectNodeContents(child);

          this.wrap(range, tagName, params);

          range.setStartAfter(child);
          range.collapse(true);

        }

      } else {

        const content = range.extractContents();

        let node = content.querySelector(tagName);

        while (node) {

          this.unwrapNode(node);

          node = content.querySelector(tagName);

        }

        node = document.createElement(tagName);

        if (params) {

          for (let key in params) {

            if (params[key]) {

              node.setAttribute(key, params[key]);

            }

          }

        }

        // for (let child of content.childNodes) {
        while (content.firstChild) {

          node.appendChild(content.firstChild);

        }

        range.insertNode(node);

        range.selectNodeContents(node);

      }

    }

  }

  wrapAt(range, tagName, params) {

    let wrapNode = document.createElement(tagName);

    if (params) {

      for (let key in params) {

        if (params[key]) {

          wrapNode.setAttribute(key, params[key]);

        }

      }

    }

    if (this.isContainer(wrapNode)) {

      if (this.isText(range.commonAncestorContainer) || this.isInline(range.commonAncestorContainer) || this.isBlock(range.commonAncestorContainer)) {

        let content = range.extractContents();

        const tag = this.getChildTag(wrapNode);
        const newBlock = document.createElement(tag || "p");

        newBlock.appendChild(content);

        while (!this.isRoot(range.endContainer) && !this.isValidIn(wrapNode, range.endContainer)) {

          range.setEndAfter(range.endContainer);

        }

        content = range.extractContents();

        range.insertNode(wrapNode);

        if (wrapNode.previousSibling && this.isEmpty(wrapNode.previousSibling)) {

          wrapNode.parentNode.removeChild(wrapNode.previousSibling);

        }

        range.setStartAfter(wrapNode);
        range.collapse(true);

        if (!this.isEmpty(content)) {

          range.insertNode(content);

        }

        range.setStartAfter(wrapNode);
        range.collapse(true);

      } else if (this.isContainer(range.commonAncestorContainer)) {

        this.selectDown(range);

        const blocks = this.getNodesAt(range, node => this.isBlock(node));

        range.deleteContents();

        for (block of blocks) {

          const tag = this.getChildTag(wrapNode);
          const newBlock = document.createElement(tag || "p");

          while (block.firstChild) {

            newBlock.appendChild(block.firstChild);

          }

          wrapNode.appendChild(newBlock);

        }

        range.insertNode(wrapNode);
        range.selectNodeContents(wrapNode);

      }

    } else if (this.isInline(wrapNode)) {

      if (this.isText(range.commonAncestorContainer) || this.isInline(range.commonAncestorContainer) || this.isBlock(range.commonAncestorContainer)) {

        const content = range.extractContents();

        wrapNode.appendChild(content);

        range.insertNode(wrapNode);

        range.selectNodeContents(wrapNode);

      } else if (this.isContainer(range.commonAncestorContainer)) {

        this.selectDown(range);

        const content = range.extractContents();

        for (let child of content.childNodes) {

          const newRange = new Range();

          newRange.selectNodeContents(child);

          this.wrapAt(newRange, tagName, params);

        }

        wrapNode.appendChild(content);

        range.insertNode(wrapNode);

        range.selectNodeContents(wrapNode);

      }

    } else if (this.isBlock(wrapNode)) {

      console.error("wraping block not implemented");

    }

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

    while (node.firstChild) {

      parent.insertBefore(node.firstChild, node);

    }

    parent.removeChild(node);
    parent.normalize();

  }


  renameNode(range, tagName, newTagName) {

    const node = this.getNodeByTags(range, tagName);

    if (node) {

      const newNode = document.createElement(tagName);

      while (node.firstChild) {

        newNode.appendChild(node.firstChild);

      }

      node.replaceWith(newNode);

    }

  }


  findNode(range, fn) {

    let node = range.commonAncestorContainer;

    if (!node) {

      console.error("A valid node is required.");
      return;

    }

    while (this.element.contains(node) && !fn(node)) {

      node = node.parentNode;

    }

    return node;

  }

  getChildTag(node) {

    const editNode = new KarmaFieldsAlpha.EditorNode(node);

    return editNode.childTag;

  }

  getRoot() {

    return this.element;

  }

  isRoot(node) {

    return node === this.element;

  }

  isContainer(node) {

    const editNode = new KarmaFieldsAlpha.EditorNode(node);

    return editNode.isContainer();

  }

  isBlock(node) {

    const editNode = new KarmaFieldsAlpha.EditorNode(node);

    return editNode.isBlock();

  }

  isInline(node) {

    const editNode = new KarmaFieldsAlpha.EditorNode(node);

    return editNode.isInline();

  }

  isBreakable(node) {

    const editNode = new KarmaFieldsAlpha.EditorNode(node);

    return editNode.isBreakable();
  }

  isSingle(node) {

    const editNode = new KarmaFieldsAlpha.EditorNode(node);

    return editNode.isSingle();

  }

  isValid(node) {

    const editNode = new KarmaFieldsAlpha.EditorNode(node);

    return editNode.isValid();

  }

  isText(node) {

    return node && node.nodeType === 3;

  }

  isElement(node) {

    return node && node.nodeType === 1;

  }

  isBreakNode(node, range) {

    if (range.startContainer === node && range.startOffset === 0) {

      return true;

    }

    return false;

  }

  isValid(node) {

    const editNode = new KarmaFieldsAlpha.EditorNode(node);

    return editNode.isValid();

  }

  isValidIn(node, container) {

    const editNode = new KarmaFieldsAlpha.EditorNode(node);

    return editNode.isValid() && editNode.isValidIn(container);

  }

  createEmptyParagraph() {

    return this.createEmpty("p");

  }

  clone(node) {

    if (this.isBreakable(node)) {

      return node.cloneNode();

    } else {

      return document.createElement("p");

    }

  }

  areJoinable(nodeBefore, nodeAfter) {

    if (nodeBefore && nodeAfter && nodeBefore.nodeType === nodeAfter.nodeType && nodeBefore.tagName === nodeAfter.tagName) {

      return true;

    }

    return false;

  }

  isEmpty(node) {

    return !node.textContent.trim();

  }

  reset() {

    if (this.element.childNodes.length !== 1 || this.element.firstChild.tagName !== "P" || this.element.firstChild.childNodes.length !== 1 || this.element.firstChild.firstChild.tagName !== "BR") {

      while (this.element.hasChildNodes()) {

        this.element.removeChild(this.element.firstChild);

      }

      const p = document.createElement("p");
      p.appendChild(document.createElement("br"));

      this.element.appendChild(p);

    }

  }

  createEmpty(tagName) {

    const node = document.createElement(tagName);

    node.appendChild(document.createElement("br"));

    return node;

  }

  getNodeAfterStart(range) {

    return range.startContainer.nodeType === 1 && range.startContainer.childNodes[range.startOffset];


    // if (!range || !range.startContainer) {
    //
    //   console.error("Invalid range");
    //
    // }
    //
    // let node = range.startContainer;
    //
    // if (range.startOffset >= this.getNodeLength(node)) {
    //
    //   while (!this.isRoot(node) && node === node.parentNode.lastChild) {
    //
    //     node = node.parentNode;
    //
    //   }
    //
    //   return node.nextSibling;
    //
    // } else if (range.startOffset === 0) {
    //
    //   while (!this.isRoot(node) && node === node.parentNode.firstChild) {
    //
    //     node = node.parentNode;
    //
    //   }
    //
    //   return node;
    //
    // } else if (this.isElement(node)) {
    //
    //   return node.parentNode.childNodes[range.startOffset + 1];
    //
    // } else {
    //
    //   return node;
    //
    // }

  }

  getNodeBeforeStart(range) {

    // return range.startContainer.parentNode.childNodes[range.startOffset - 1];

    // if (!range || !range.startContainer) {
    //
    //   console.error("Invalid range");
    //
    // }
    //
    // let node = range.startContainer;
    //
    // if (range.startOffset >= this.getNodeLength(node)) {
    //
    //   while (!this.isRoot(node) && node === node.parentNode.lastChild) {
    //
    //     node = node.parentNode;
    //
    //   }
    //
    //   return node;
    //
    // } else if (range.startOffset === 0) {
    //
    //   while (!this.isRoot(node) && node === node.parentNode.firstChild) {
    //
    //     node = node.parentNode;
    //
    //   }
    //
    //   return node.previousChild;
    //
    // } else if (this.isElement(node)) {
    //
    //   return node.parentNode.childNodes[range.startOffset - 1];
    //
    // } else {
    //
    //   return node;
    //
    // }

    return range.startContainer.nodeType === 1 && range.startContainer.childNodes[range.startOffset-1];

  }

  getNodeAfterEnd(range) {

    return range.endContainer.parentNode.childNodes[range.endOffset + 1];

    // if (!range || !range.endContainer) {
    //
    //   console.error("Invalid range");
    //
    // }
    //
    // let node = range.endContainer;
    //
    // if (range.endOffset >= this.getNodeLength(node)) {
    //
    //   while (!this.isRoot(node) && node === node.parentNode.lastChild) {
    //
    //     node = node.parentNode;
    //
    //   }
    //
    //   return node.nextSibling;
    //
    // } else if (range.endOffset === 0) {
    //
    //   while (!this.isRoot(node) && node === node.parentNode.firstChild) {
    //
    //     node = node.parentNode;
    //
    //   }
    //
    //   return node;
    //
    // } else if (this.isElement(node)) {
    //
    //   return node.parentNode.childNodes[range.endOffset + 1];
    //
    // } else {
    //
    //   return node;
    //
    // }

    return range.endContainer.nodeType === 1 && range.endContainer.childNodes[range.endOffset];

  }

  getNodeBeforeEnd(range) {

    if (!range || !range.endContainer) {

      console.error("Invalid range");

    }

    let node = range.endContainer;

    if (range.endOffset >= this.getNodeLength(node)) {

      while (!this.isRoot(node) && node === node.parentNode.lastChild) {

        node = node.parentNode;

      }

      return node;

    } else if (range.endOffset === 0) {

      while (!this.isRoot(node) && node === node.parentNode.firstChild) {

        node = node.parentNode;

      }

      return node.previousSibling;

    } else if (this.isElement(node)) {

      return node.parentNode.childNodes[range.endOffset - 1];

    } else {

      return node;

    }

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

  breakLine(range) {

    if (!range || !range.startContainer || !this.element.contains(range.startContainer)) {

      console.error("A valid range is required.");
      return;

    }

    if (!range.collapsed) {

      this.delete(range);

    }

    let node = range.startContainer;

    while (!this.isRoot(node) && !this.isBlock(node) && !this.isContainer(node)) {

      node = node.parentNode;

    }

    if (this.isContainer(node)) {

      let tag = this.getChildTag(node);

      while (!tag && !this.isRoot(node)) {

        range.setStartBefore(node);
        range.collapse(true);

        node = node.parentNode;
        tag = this.getChildTag(node);

      }

      const newNode = document.createElement(tag || "p");

      newNode.appendChild(document.createElement("br"));

      // this.insertAt(range, newNode);
      range.insertNode(newNode);
      range.setStart(newNode, 0);
      range.collapse(true);

    // } else if (false && this.isBreakNode(node, range)) { // like empty li element
    //
    //   range.selectNode(node);
    //   range.deleteContents();
    //
    //   while (!this.isRoot(range.endContainer)) {
    //
    //     range.setEndAfter(range.endContainer);
    //
    //   }
    //
    //   let content = range.extractContents();
    //
    //   const p = document.createElement("p");
    //   p.appendChild(document.createElement("br"));
    //
    //   range.insertNode(p);
    //   range.collapse(false);
    //
    //   if (!this.isEmpty(content)) {
    //
    //     this.insert(range, ...content.childNodes);
    //
    //   }
    //
    //   range.setStart(p, 0);
    //   range.collapse(true);

    } else if (this.isBreakable(node)) {

      range.setEndAfter(node);

      let nodeAfter = range.extractContents().firstChild;

      if (this.isEmpty(nodeAfter)) {

        this.resetBlock(nodeAfter);

        // while (nodeAfter.firstChild) {
        //
        //   nodeAfter.removeChild(nodeAfter.firstChild);
        //
        // }
        //
        // nodeAfter.appendChild(document.createElement("br"));

      }

      if (this.isEmpty(node) && node.tagName !== "P") { // -> break

        range.selectNode(node);
        range.deleteContents();

        while (!this.isRoot(range.endContainer)) {

          range.setEndAfter(range.endContainer);

        }

        const nodeNext = range.extractContents().firstChild;

        range.collapse(false);

        const p = document.createElement("p");

        while (nodeAfter.hasChildNodes()) {

          p.appendChild(nodeAfter.firstChild);

        }

        // this.insertAt(range, p);
        range.insertNode(p);
        range.setStartAfter(p);
        range.collapse(true);

        if (nodeNext && !this.isEmpty(nodeNext)) {

          // this.insertAt(range, nodeNext);
          range.insertNode(nodeNext);

        }

        range.setStart(p, 0);
        range.collapse(true);

      } else {

        if (this.isEmpty(node)) {

          this.resetBlock(node);

          // while (node.firstChild) {
          //
          //   node.removeChild(node.firstChild);
          //
          // }
          //
          // node.appendChild(document.createElement("br"));

        }

        // this.insertAt(range, nodeAfter);
        range.insertNode(nodeAfter);

        range.setStart(nodeAfter, 0);
        range.collapse(true);

      }



    } else { // not breakable (like figcaption)

      range.setEnd(node, node.childNodes.length);

      let content = range.extractContents();

      let p = document.createElement("p");

      p.appendChild(content);

      if (this.isEmpty(p)) {

        this.resetBlock(p);

        // while (p.firstChild) {
        //
        //   p.removeChild(p.firstChild);
        //
        // }
        //
        // p.appendChild(document.createElement("br"));

      }

      this.insert(range, p);

      range.setStart(p, 0);
      range.collapse(true);

    }

  }

  empty(node) {

    while (node.firstChild) {

      node.removeChild(node.firstChild);

    }

  }

  join(leftNode, rightNode) {

    let innerLeftNode = leftNode.lastChild;
    let innerRightNode = rightNode.firstChild;

    while (rightNode.firstChild) {

      leftNode.appendChild(rightNode.firstChild);

    }

    rightNode.remove();

    return [innerLeftNode, innerRightNode];

  }


  delete(range) {

    if (!range.collapsed) {

      this.selectDown(range);

      let nodeRemoved = range.commonAncestorContainer;

      const content = range.extractContents();

      while (range.commonAncestorContainer !== this.element && this.isEmpty(range.commonAncestorContainer)) {

        range.selectNode(range.commonAncestorContainer);
        range.deleteContents();

      }

      if (this.isBlock(content.firstChild)) {

        range.insertNode(this.createEmpty(content.firstChild.tagName));
        range.collapse(true);

      }

      if (!this.element.firstChild) {

        const p = this.createEmpty("p");
        range.insertNode(p);
        range.setStart(p, 0);
        range.collapse(true);

      }

      return true;

    } else if (this.isEmpty(this.element)) {

      return true; // -> prevent default BUT should not save!

    } else if (range.startOffset === 0) {

      const node = range.startContainer;

      if (this.isRoot(node)) {

        return false;

      }

      range.setStartBefore(node);
      range.collapse(true);

      // if (this.isBlock(node)) {
      //
      //   return this.delete(range, node);
      //
      // } else {

        return this.delete(range);

      // }

    } else if (this.isElement(range.startContainer)) {

      let nodeAfter = range.startContainer.childNodes[range.startOffset];
      let nodeBefore = range.startContainer.childNodes[range.startOffset - 1];

      if (nodeBefore && this.isEmpty(nodeBefore)) {

        // if (nodeBefore.previousSibling) {
        //
        //   let node = nodeBefore.previousSibling;
        //
        //   while (node.lastChild) {
        //
        //     node = node.lastChild;
        //
        //   }
        //
        //   range.selectNodeContents(node);
        //   range.collapse(false);
        //
        // }

        nodeBefore.remove();

        return true;

      }

      let backNode = nodeAfter;

      while (backNode && !this.isBlock(backNode)) {

        backNode = backNode.firstChild;

      }

      if (!backNode) {

        while (this.isElement(nodeBefore) && this.isElement(nodeAfter) && nodeBefore.tagName === nodeAfter.tagName) {

          [nodeBefore, nodeAfter] = this.join(nodeBefore, nodeAfter);

        }

        range.selectNodeContents(nodeBefore);
        range.collapse(false);

        nodeBefore.parentNode.normalize();

        return false;

      }

      while (nodeBefore && !this.isBlock(nodeBefore)) {

        nodeBefore = nodeBefore.lastChild;

      }

      if (nodeBefore) {

        if (this.isEmpty(backNode)) {

          backNode.remove();

          // if (this.isEmpty(nodeAfter)) {
          //
          //   nodeAfter.remove();
          //
          // }

          while (nodeBefore.lastChild) {

            nodeBefore = nodeBefore.lastChild;

          }

          range.selectNodeContents(nodeBefore);
          range.collapse(false);

          // return true;

        } else {

          let [leftNode, rightNode] = this.join(nodeBefore, backNode);

          while (this.isElement(leftNode) && this.isElement(rightNode) && leftNode.tagName === rightNode.tagName) {

            [leftNode, rightNode] = this.join(leftNode, rightNode);

          }

          range.selectNodeContents(leftNode);
          range.collapse(false);

          leftNode.parentNode.normalize();

        }

        if (nodeAfter && nodeAfter !== backNode && this.isEmpty(nodeAfter)) {

          nodeAfter.remove();

        }

        return true;

      }

    }

    return false;

  }

  insert(range, ...nodes) {

    if (!range.collapsed) {

      this.delete(range);

    }

    for (let node of nodes) {

      while (range.startOffset === 0 && !this.isRoot(range.startContainer) && !this.isValidIn(node, range.startContainer)) {

        range.setStartBefore(range.startContainer);
        // range.collapse(true);

      }

      while (!this.isRoot(range.endContainer) && !this.isValidIn(node, range.endContainer)) {

        range.setEndAfter(range.endContainer);

      }

      // const nodeAfter = this.getNodeAfterStart(range);
      //
      // if (nodeAfter && this.isEmpty(nodeAfter)) {
      //
      //   range.setStartAfter(nodeAfter);
      //   range.collapse(true);
      //   nodeAfter.remove();
      //
      // } else

      let extractedNode;

      if (!range.collapsed) {

        extractedNode = range.extractContents().firstChild;

      }

      if (this.isRoot(range.startContainer) && !this.isValidIn(node, range.endContainer)) {

        const p = document.createElement("p");
        p.appendChild(node);

        node = p;

      }

      range.insertNode(node);
      range.setStartAfter(node);
      range.collapse(true);

      if (extractedNode && !this.isEmpty(extractedNode)) {

        range.insertNode(extractedNode);
        range.setStartAfter(extractedNode);
        range.collapse(true);

      }

    }

  }

  insertAt(range, node) {

    if (!range.collapsed) {

      this.delete(range);

    }

    if (this.isInline(node) || this.isText(node) || this.isSingle(node)) {

      if (this.isText(range.startContainer) || this.isInline(range.startContainer) || this.isBlock(range.startContainer)) {

        if (this.isBlock(range.startContainer) && this.isEmpty(range.startContainer)) {

          range.selectNodeContents(range.startContainer);
          range.deleteContents();

        }

        range.insertNode(node);
        range.setStartAfter(node);
        range.collapse(true);

        range.startContainer.normalize();

      } else if (this.isContainer(range.startContainer)) { // -> create new block and insert into

        let tag = this.getChildTag(range.startContainer);

        while (!tag) { // e.g FIGURE

          range.setStartAfter(range.startContainer);
          range.collapse(true);

          tag = this.getChildTag(range.startContainer);

        }

        const block = document.createElement(tag);

        block.appendChild(node);

        range.insertNode(block);
        range.setStartAfter(node);
        range.collapse(true);

        block.normalize();

      }

    } else if (this.isBlock(node)) {

      if (this.isText(range.startContainer) || this.isInline(range.startContainer) || this.isBlock(range.startContainer)) {

        while (!this.isContainer(range.endContainer) && !this.isRoot(range.endContainer)) {

          range.setEndAfter(range.endContainer);

        }

        const contents = range.extractContents();

        range.insertNode(node);

        range.setStartAfter(node);
        range.collapse(true);

        if (!this.isEmpty(contents)) {

          range.insertNode(contents);

        }

        range.selectNodeContents(node);
        range.collapse(false);


        // if (this.isBlock(range.startContainer) && this.isEmpty(range.startContainer)) {
        //
        //   range.selectNodeContents(range.startContainer);
        //   range.deleteContents();
        //
        // }
        //
        // let child = node.firstChild;
        //
        // while (child) {
        //
        //   range.insertNode(child);
        //   range.setStartAfter(child);
        //   range.collapse(true);
        //
        //   child = node.firstChild;
        //
        // }
        //
        // range.startContainer.normalize();

      } else if (this.isContainer(range.startContainer)) {

        let tag = this.getChildTag(range.startContainer);

        while (!tag && !this.isRoot(range.startContainer)) { // -> e.g. container is FIGURE

          range.setStartAfter(range.startContainer);
          range.collapse(true);

          tag = this.getChildTag(range.startContainer);

        }

        const p = document.createElement(tag || "p");

        let child = node.firstChild;

        while (child) {

          p.appendChild(child);

          child = node.firstChild;

        }

        range.insertNode(p);
        range.setStartAfter(p);
        range.collapse(true);

        p.normalize();

      }

    } else if (this.isContainer(node)) {

      if (this.isText(range.startContainer) || this.isInline(range.startContainer) || this.isBlock(range.startContainer)) {

        // -> find next suitable container

        while (!this.isRoot(range.endContainer) && !this.isContainer(range.endContainer) && !this.isValidIn(node, range.endContainer)) {

          range.setEndAfter(range.endContainer);

        }

        // if (!this.isValidIn(node, range.endContainer)) {
        //
        //   // convert into p?
        //
        // }

        // cut the rest

        const content = range.extractContents();

        range.insertNode(node);
        range.setStartAfter(node);
        range.collapse(true);

        if (!this.isEmpty(content)) { // put the rest after if not empty

          range.insertNode(content);

        }

        if (node.previousSibling && this.isEmpty(node.previousSibling)) { // clear node before if empty

          node.previousSibling.remove();

        }

        range.setStartAfter(node);
        range.collapse(true);


      } else if (this.isContainer(range.startContainer)) {

        while (!this.isRoot(range.endContainer) && !this.isContainer(range.endContainer) && !this.isValidIn(node, range.endContainer)) {

          range.setStartAfter(range.endContainer);

        }

        // if (!this.isValidIn(node, range.endContainer)) {
        //
        //   // convert into p?
        //
        // }

        range.collapse(true);
        range.insertNode(node);

        if (node.previousSibling && this.isEmpty(node.previousSibling)) {

          node.previousSibling.remove();

        }

        range.setStartAfter(node);
        range.collapse(true);

      }


    }

    this.sanitize(node);

  }

  insertAfter(nodeBefore, ...nodes) {

    for (let node of nodes) {

      while (!this.isRoot(nodeBefore.parentNode) && !this.isValidIn(node, nodeBefore.parentNode)) {

        nodeBefore = nodeBefore.parentNode;

      }

      const container = nodeBefore.parentNode;

      // if (this.isRoot(nodeBefore.parentNode) && !this.isValidIn(node, nodeBefore.parentNode) && this.isTagValidIn(node.tagName, "P")) {
      if (this.isRoot(nodeBefore.parentNode) && !this.isValidIn(node, nodeBefore.parentNode)) {

        const p = document.createElement("p");

        if (this.isValidIn(node, p)) {

          p.appendChild(node);

          node = p;

        }

      }

      container.insertBefore(node, nodeBefore.nextSibling);


      nodeBefore = node;

    }

  }


  findInvalidNode(node) {

    // const editNode = new KarmaFieldsAlpha.EditorNode(node);

    // // if (!this.isRoot(node) && (!editNode.isValid() || editNode.isEmpty())) {
    // if (node !== container && !this.isValidIn(node, node.parentNode)) {
    //
    //   return node;
    //
    // }

    if (this.isElement(node)) {

      for (let child of node.childNodes) {

        if (!this.isValidIn(child, node)) {

          return child;

        }

        const invalidChild = this.findInvalidNode(child);

        if (invalidChild) {

          return invalidChild;

        }

      }

    }

  }

  fixNode(node, refNode) {

    let editNode = new KarmaFieldsAlpha.EditorNode(node);

    if (!editNode.isValid()) {

      node.parentNode.removeChild(node);

    } else if (!editNode.isValidIn(node.parentNode)) {

      // if (this.isRoot(node.parentNode)) {
      if (node.parentNode === refNode) {

        if (editNode.isContainer()) {

          this.unwrapNode(node);

        } else if (editNode.isInline() || editNode.isText()) {

          let previousNode = node.previousSibling;

          // while (previousNode && !(new KarmaFieldsAlpha.EditorNode(previousNode)).isBlock()) {
          while (previousNode && !this.isBlock(previousNode)) {

            previousNode = previousNode.lastChild;

          }

          if (!previousNode) {

            previousNode = document.createElement("p");
            node.parentNode.insertBefore(previousNode, node);

          }

          if (this.isValidIn(node, previousNode)) {

            previousNode.appendChild(node);

          }

        } else {

          node.parentNode.removeChild(node);

        }

      } else {

        node.parentNode.parentNode.insertBefore(node, node.parentNode.nextSibling); // = insert after parentNode

        // this.insertAfter(node, node);

      }

    }

  }

  sanitize(node) {

    let invalidNode = this.findInvalidNode(node || this.element);

    while (invalidNode) {

      this.fixNode(invalidNode, node || this.element);

      invalidNode = this.findInvalidNode(node || this.element);

    }


  }



  copy(range) {

    const content = range.cloneContents();

    const container = document.createElement("div");
    container.appendChild(content);

    return container.innerHTML;

  }

  cut(range) {

    this.selectDown(range);

    const content = range.extractContents();

    const container = document.createElement("div");
    container.appendChild(content);

    return container.innerHTML;

  }

  paste(range, html) {

    const container = document.createElement("div");
    container.innerHTML = html;

    container.normalize();

    // let invalidNode = this.findInvalidNode(container);
    //
    // while (invalidNode) {
    //
    //   this.fixNode(invalidNode);
    //
    //   invalidNode = this.findInvalidNode(container);
    //
    // }

    // this.clean(container);

    // if (this.isRoot(range.startContainer)) {
    //
    //   if (range.startContainer.childNodes[range.startOffset]) {
    //
    //     range.setStart(range.startContainer.childNodes[range.startOffset], 0);
    //
    //   } else {
    //
    //     const p = document.createElement("p");
    //     // p.appendChild(document.createElement("br"));
    //
    //     range.insertNode(p);
    //     range.setStart(p, 0);
    //     range.collapse(true);
    //
    //   }
    //
    // }

    // for (let child of [...container.childNodes]) {
    //
    //   this.insertAt(range, child);
    //
    //   // range.setStartAfter(node);
    //   // range.collapse(true);
    //
    // }

    let child = container.firstChild;

    while (child) {

      container.removeChild(child);

      this.insertAt(range, child);

      child = container.firstChild;

    }

    // this.insert(range, ...container.childNodes);
    //
    // this.sanitize(this.element);

  }


  clean(node) { // not used

    if (this.isValid(node)) {

      if (node.nodeType === 1 && node.hasAttributes()) {

        for (let attribute of node.attributes) {

          node.removeAttributeNode(attribute);

        }

      }

      // if (node.tagName === "SPAN" && node.childNodes.length === 1 && node.firstChild.nodeType === 3) {
      //
      //   node.replaceWith(node.firstChild);
      //
      // }


      let child = node.firstChild;

      while (child) {

        const next = child.nextSibling;

        if (this.isElement(child)) {

          this.clean(child);

        }

        child = next;

      }

      if (node.parentNode && (node.tagName === "SPAN" || node.tagName === "DIV")) {

        this.unwrapNode(node);

      }

      node.normalize();

    } else {

      node.remove();

    }

  }

  insertList(range, tagName) {

    let listNode = this.getNodeByTags(range, "ul", "ol");

    if (listNode) {

      range.selectNode(listNode);
      range.deleteContents();

      if (listNode.tagName === tagName.toUpperCase()) {

        for (let node of listNode.childNodes) {

          const p = document.createElement("p");

          while (node.firstChild) {

            p.appendChild(node.firstChild);

          }

          this.insertAt(range, p);

        }

      } else {

        const newListNode = document.createElement(tagName);

        while (listNode.firstChild) {

          newListNode.appendChild(listNode.firstChild);

        }

        this.insertAt(range, newListNode);

      }

    } else {

      listNode = document.createElement(tagName);

      if (range.collapsed) {

        const li = this.createEmpty("li");

        listNode.appendChild(li);

        this.insertAt(range, listNode);

        range.setStart(li, 0);
        range.collapse(true);

      } else {

        while (!this.isRoot(range.startContainer)) {

          range.setStartBefore(range.startContainer);

        }

        while (!this.isRoot(range.endContainer)) {

          range.setEndAfter(range.endContainer);

        }

        const content = range.extractContents();

        for (let node of content.childNodes) {

          if (node.hasChildNodes()) {

            const item = document.createElement("li");

            while (node.firstChild) {

              item.appendChild(node.firstChild);

            }

            listNode.appendChild(item);

          }

        }

        this.insertAt(range, listNode);
        range.selectNodeContents(listNode);

      }

    }

  }

  insertHeading(range, tagName) {

    let node = this.getNodeByTags(range, "h1", "h2", "h3", "h4", "h5", "h6");

    if (node) {

      if (node.tagName === tagName.toUpperCase()) {

        tagName = "p";

      }

      const newNode = document.createElement(tagName);

      range.selectNode(node);
      range.deleteContents();

      while (node.firstChild) {

        newNode.appendChild(node.firstChild);

      }

      this.insertAt(range, newNode);

    } else {

      if (!range.collapsed) {

        this.selectDown(range);

        const content = range.extractContents();

        for (let child of content.childNodes) {

          if (!this.isEmpty(child)) {

            const heading = document.createElement(tagName);

            while (child.firstChild) {

              heading.appendChild(child.firstChild);

            }

            this.insertAt(range, heading);

          }

        }

      }

    }

  }

  insertFigure(range, figure) {

    const node = this.getNodeByTags(range, "figure");

    if (node) {

      range.selectNode(node);

    }

    this.insertAt(range, figure);
    range.selectNode(figure);

  }

  updateNodeByTag(range, tagName, params = {}) {

    let node = this.getNodeByTags(range, tagName);

    if (node) {

      for (let attribute of node.attributes) {

        node.removeAttributeNode(attribute);

      }

      for (let key in params) {

        if (params[key]) {

          node.setAttribute(key, params[key]);

        }

      }

    } else {

      this.wrap(range, tagName, params);

    }

  }

  toggleNodeByTag(range, tagName) {

    let node = this.getNodeByTags(range, tagName);

    if (node) {

      this.unwrapNode(node);

    } else {

      this.wrap(range, tagName);

    }

  }

  updateNodeParams(node, params = {}) {

    for (let attribute of node.attributes) {

      node.removeAttributeNode(attribute);

    }

    for (let key in params) {

      if (params[key]) {

        node.setAttribute(key, params[key]);

      }

    }

  }





}



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
          this.validIn = ["DIV", "TD"];
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
      case "text": {
        const editNode = new KarmaFieldsAlpha.EditorNode(container);
        return editNode.isInline() || editNode.isBlock();
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
