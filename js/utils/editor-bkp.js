
KarmaFieldsAlpha.Editor = class {

  constructor(element) {

    this.element = element;

  }

  // split(element, offset) {
  //
  //   const node = range.startContainer;
  //
  //   if (node.nodeType === 3) {
  //
  //     const parent = node.parentNode;
  //
  //     const nodeAfter = node.splitText(range.startOffset);
  //
  //     range.setStartAfter(node);
  //
  //     return [node, nodeAfter];
  //
  //   } else if (node.nodeType === 1) {
  //
  //     const nodeBefore = node.cloneNode();
  //
  //     const children = [...node.childNodes];
  //     const childrenBefore = children.split(0, range.startOffset);
  //     // const childrenAfter = children.split(range.startOffset);
  //
  //
  //     // childrenBefore.forEach(child => nodeBefore.appendChild(child));
  //     for (let child of childrenBefore) {
  //
  //       nodeBefore.appendChild(child);
  //
  //     }
  //
  //     if (nodeBefore.tagName === "P" && !nodeBefore.hasChildNodes()) {
  //
  //       nodeBefore.appendChild(document.createElement("br"));
  //
  //     }
  //
  //     if (node.tagName === "P" && !node.hasChildNodes()) {
  //
  //       node.appendChild(document.createElement("br"));
  //
  //     }
  //
  //     range.setStartAfter(nodeBefore);
  //
  //     if (!nodeBefore.hasChildNodes()) {
  //
  //       nodeBefore.remove();
  //
  //       return [null, node];
  //
  //     }
  //
  //     if (!node.hasChildNodes()) {
  //
  //       node.remove();
  //
  //       return [nodeBefore, null];
  //
  //     }
  //
  //     return [nodeBefore, node];
  //
  //   }
  //
  //   return [null, null];
  //
  // }

  getNode(range, ...tags) {

    if (!range) {

      console.error("A valid range is required.");
      return;

    }


    let node = range.commonAncestorContainer;

    if (node && this.element.contains(node)) {

      if (node.nodeType !== 1) {

        node = node.parentNode;

      }

      while (node !== this.element) {

        if (!tags.length || node.matches(tags.join(","))) {

          return node;

        }

        node = node.parentNode;

      }

    }

	}

  wrap(range, tagName, className) {

    if (!range || !tagName) {

      console.error("A valid range and tagName are required.");
      return;

    }

    // Create the wrapping element with the specified tag and class
    const wrapper = document.createElement(tagName);

    if (className) {

      wrapper.className = className; // Apply class if provided

    }

    let content = range.extractContents();

    if (content.childNodes.length === 0) {

      wrapper.innerHTML = "&nbsp;";

      // const placeholder = document.createElement("br");
      //
      // wrapper.appendChild(placeholder);

      // range.setStart(wrapper, 1);
      // range.setEnd(wrapper, 1);


      // document.execCommand("bold")

      // range.insertNode(wrapper);
      //
      // range.setStart(wrapper, 1);
      // range.setEnd(wrapper, 1);

    } else {

      wrapper.appendChild(content);




    }

    range.insertNode(wrapper);

    range.selectNodeContents(wrapper);



    // range.deleteContents();






  }

  unwrap(node) {

    if (!node || !node.parentNode) {

      console.error("A valid node with a parent is required.");
      return;

    }

    while (node.firstChild) {

      node.parentNode.insertBefore(node.firstChild, node);

    }

    node.parentNode.removeChild(node);

  }


  unwrap(node) {

    if (!node || !node.parentNode) {

      console.error("A valid node with a parent is required.");
      return;

    }

    while (node.firstChild) {

      node.parentNode.insertBefore(node.firstChild, node);

    }

    node.parentNode.removeChild(node);

  }

  // breakLineAtRange_______(range) {
  //
  //   if (!range) {
  //
  //     console.error("A valid range is required.");
  //     return;
  //
  //   }
  //
  //   // let container = range.commonAncestorContainer;
  //   //
  //   // if (!container || !this.element.contains(container)) {
  //   //
  //   //   console.error("breaking line outside container");
  //   //   return;
  //   //
  //   // }
  //
  //   // // If the container is a text node, get its parent
  //   // if (container.nodeType === Node.TEXT_NODE) {
  //   //
  //   //     container = container.parentNode;
  //   //
  //   // }
  //
  //   let blockNode = range.commonAncestorContainer;
  //
  //   if (!blockNode || !this.element.contains(blockNode)) {
  //
  //     console.error("breaking line outside container");
  //     return;
  //
  //   }
  //
  //   while (blockNode.nodeType !== 1 || getComputedStyle(blockNode).display === 'inline') {
  //
  //     blockNode = blockNode.parentNode;
  //
  //   }
  //
  //   if (!blockNode || !this.element.contains(blockNode)) {
  //
  //     console.error("No block-level node found.");
  //     return;
  //
  //   }
  //
  //
  //   if (!range.collapsed) {
  //
  //     range.deleteContents();
  //
  //   }
  //
  //   const startRange = new Range();
  //   startRange.setStart(blockNode, 0);
  //   startRange.setEnd(range.startContainer, range.startOffset);
  //
  //   // const endRange = new Range();
  //   // endRange.setStart(range.startContainer, range.startOffset);
  //   // endRange.setEndAfter(blockNode);
  //
  //   // const nodeAfter = blockNode.cloneNode();
  //   // const contentAfter = endRange.extractContents();
  //   // nodeAfter.appendChild(endRange.extractContents());
  //
  //   const nodeBefore = blockNode.cloneNode();
  //   let contentBefore = startRange.extractContents();
  //
  //   if (!contentBefore.textContent) { // -> break line before bode
  //
  //     nodeBefore.appendChild(document.createElement("br"));
  //
  //   }
  //
  //   nodeBefore.appendChild(contentBefore);
  //
  //   blockNode.parentNode.insertBefore(nodeBefore, blockNode);
  //   // blockNode.parentNode.insertBefore(nodeAfter, blockNode);
  //   // blockNode.remove();
  //
  //   if (!blockNode.textContent) { // -> break line after node
  //
  //     blockNode.appendChild(document.createElement("br"));
  //
  //   }
  //
  //
  //   // range.setStart(blockNode, 0);
  //   // range.setEnd(blockNode, 0);
  //
  //
  //
  //
  //
  //
  // }

  getBlockNode(node) {

    if (!node) {

      console.error("A valid node is required.");
      return;

    }

    while (node.nodeType !== 1 || getComputedStyle(node).display === 'inline') {

      node = node.parentNode;

    }

    return node;

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

  getRoot() {

    return this.element;

  }

  isRoot(node) {

    return node === this.element;

  }

  getBase(range) {

    return this.findNode(range, node => this.isBase(node));

  }

  isBase(node) {

    return this.parentNode === this.element;

  }

  isBlock(node) {

    return node && node.nodeType === 1 && getComputedStyle(node).display === 'block';

  }

  isInline(node) {

    // const display = getComputedStyle(node).display;
    //
    // return node && node.nodeType === 1 && getComputedStyle(node).display === "inline";

    const inlineTags = ["SPAN", "IMG", "B", "STRONG", "EM", "I", "A", "SUB", "SUP"];

    return inlineTags.includes(node.tagName);

  }

  isBreakable(node) {

    return node.tagName === "P" || node.tagName === "LI" || node.tagName === "BLOCKQUOTE";

  }

  isValid(node) {

    const tags = ["H1", "H2", "H3", "H4", "H5", "H6", "P", "BLOCKQUOTE", "BR", "DIV", "SPAN", "UL", "OL", "LI", "FIGURE", "FIGCAPTION", "IMG", "B", "STRONG", "EM", "I", "A", "SUB", "SUP", "TABLE", "TBODY", "THEAD", "TFOOTER", "TR", "TH", "TD"];

    return tags.includes(node.tagName);

  }

  isText(node) {

    return node.nodeType === 3;

  }

  isElement(node) {

    return node.nodeType === 1;

  }

  isBreakNode(node, defaultTag = "P") {

    // return this.isEmpty(node) && !node.nextSibling && node.tagName !== defaultTag.toUpperCase();

    return this.isEmpty(node) && node.tagName !== defaultTag.toUpperCase();

  }

  isValidIn(node, container) {

    if (this.isText(node) || this.isInline(node) || this.isRoot(container)) {

      return true;

    }

    switch (node.tagName) {

      case "A":
      case "SPAN":
      case "B":
      case "STRONG":
      case "EM":
      case "I":
      case "SUB":
      case "SUP":
        return true;

      case "IMG":
        return container.tagName === "P" || container.tagName === "FIGURE";

      case "FIGCAPTION":
        return container.tagName === "FIGURE";

      case "LI":
        return container.tagName === "UL" || container.tagName === "OL";

      default:
        return false;

    }

  }

  clone(node) {

    if (this.isBreakable(node)) {

      return node.cloneNode();

    } else {

      return document.createElement("p");

    }

  }


  // breakLineAtRange(range) {
  //
  //   if (!range) {
  //
  //     console.error("A valid range is required.");
  //     return;
  //
  //   }
  //
  //   // let blockNode = range.commonAncestorContainer;
  //   //
  //   // if (!blockNode || !this.element.contains(blockNode)) {
  //   //
  //   //   console.error("breaking line outside container");
  //   //   return;
  //   //
  //   // }
  //   //
  //   // while (blockNode.nodeType !== 1 || getComputedStyle(blockNode).display === 'inline') {
  //   //
  //   //   blockNode = blockNode.parentNode;
  //   //
  //   // }
  //
  //   // let blockNode = this.getBlockNode(range.commonAncestorContainer);
  //   let blockNode = this.findNode(range, node => this.isBlock(node));
  //
  //   if (!blockNode || !this.element.contains(blockNode)) {
  //
  //     console.error("No block-level node found.");
  //     return;
  //
  //   }
  //
  //
  //   if (!range.collapsed) {
  //
  //     range.deleteContents();
  //
  //   }
  //
  //   const endRange = new Range();
  //   // endRange.selectNodeContents(blockNode);
  //   endRange.setStart(range.startContainer, range.startOffset);
  //   endRange.setEnd(blockNode, blockNode.childNodes.length);
  //   let content = endRange.extractContents();
  //
  //   let newNode = this.clone(blockNode);
  //
  //   // if (this.isBreakable(blockNode)) {
  //   //
  //   //   newNode = blockNode.cloneNode();
  //   //
  //   // } else {
  //   //
  //   //   newNode = document.createElement("p");
  //   //
  //   // }
  //
  //   if (!content.textContent) { // -> break line before bode
  //
  //     content.appendChild(document.createElement("br"));
  //
  //   }
  //
  //   newNode.appendChild(content);
  //
  //   if (!blockNode.textContent) { // -> break line after node
  //
  //     blockNode.appendChild(document.createElement("br"));
  //
  //   }
  //
  //   while (!this.isBreakable(blockNode) && blockNode.parentNode !== this.element) {
  //
  //     blockNode = blockNode.parentNode;
  //
  //   }
  //
  //
  //   blockNode.parentNode.insertBefore(newNode, blockNode.nextSibling);
  //
  //
  //
  //   range.setStart(newNode, 0);
  //   range.setEnd(newNode, 0);
  //
  //
  //
  //
  //
  //
  // }

  breakLine(range, defaultTag = "P") {

    if (!range || !range.startContainer || !this.element.contains(range.startContainer)) {

      console.error("A valid range is required.");
      return;

    }

    // let blockNode = this.findNode(range, node => this.isBlock(node));


    if (!range.collapsed) {

      this.delete(range);

    }


    let node = range.startContainer;

    // let objectRange = range.cloneRange();

    if (this.isRoot(node)) {

      const newNode = document.createElement(defaultTag);

      newNode.appendChild(document.createElement("br"));

      range.insertNode(newNode);
      range.setStartAfter(newNode);
      range.collapse(true);

    } else {

      while (!this.isRoot(node.parentNode) && !this.isBreakable(node)) {

        node = node.parentNode;

      }



      // const endRange = new Range();
      // // endRange.selectNodeContents(blockNode);
      // endRange.setStart(range.startContainer, range.startOffset);
      // // endRange.setEnd(node, node.childNodes.length);
      // endRange.setEndAfter(node);


      range.setEnd(node, node.childNodes.length);

      let content = range.extractContents();

      if (this.isEmpty(node)) {

        // content.appendChild(document.createElement("br"));

        node.appendChild(document.createElement("br"));
        node.normalize();

      }

      range.setStartAfter(node);
      range.collapse(false);


      // if (this.isBreakNode(node, defaultTag)) {
      //
      //   range.selectNode(node);
      //   range.deleteContents();
      //
      //   if (!this.isEmpty(content)) {
      //
      //     this.insert(range, content);
      //
      //   }
      //
      //
      //
      //
      // } else


      // if (this.isBreakable(node) && !(this.isEmpty(node) && !node.nextSibling)) {
      if (this.isBreakable(node) && !this.isBreakNode(node, defaultTag)) {

        const newNode = node.cloneNode();

        if (this.isEmpty(content)) {

          newNode.appendChild(document.createElement("br"));

        } else {

          newNode.appendChild(content);

        }



        // node.parentNode.insertBefore(newNode, node.nextSibling);
        //
        // range.setStart(newNode, 0);
        // range.setEnd(newNode, 0);

        // range.setStartAfter(node);
        // range.collapse(true);
        range.insertNode(newNode);
        range.selectNodeContents(newNode);
        range.collapse(true);

      } else { // node is not breakable -> insert content at root as a paragraph

        // if (this.isEmpty(node) && node.tagName !== "P") {
        if (this.isBreakNode(node, defaultTag)) {

          range.selectNode(node);
          range.deleteContents();

        }

        while (range.startContainer !== this.element) {

          range.setStartAfter(range.startContainer);
          range.collapse(true);

        }

        const newNode = document.createElement(defaultTag);

        if (content.textContent) {

          newNode.appendChild(content);

        } else {

          newNode.appendChild(document.createElement("br"));

        }

        range.insertNode(newNode);
        range.selectNodeContents(newNode);
        range.collapse(true);

      }


    }

  }



  breakLine_2(range, defaultTag = "P") {

    if (!range || !range.startContainer || !this.element.contains(range.startContainer)) {

      console.error("A valid range is required.");
      return;

    }

    // let blockNode = this.findNode(range, node => this.isBlock(node));


    if (!range.collapsed) {

      this.delete(range);

    }


    let node = range.startContainer;

    // let objectRange = range.cloneRange();

    if (this.isRoot(node)) {

      const newNode = document.createElement(defaultTag);

      newNode.appendChild(document.createElement("br"));

      range.insertNode(newNode);
      range.setStartAfter(newNode);
      range.collapse(true);

    } else {

      while (!this.isRoot(node.parentNode) && !this.isBreakable(node)) {

        node = node.parentNode;

      }



      // const endRange = new Range();
      // // endRange.selectNodeContents(blockNode);
      // endRange.setStart(range.startContainer, range.startOffset);
      // // endRange.setEnd(node, node.childNodes.length);
      // endRange.setEndAfter(node);

      while (!this.isRoot(range.endContainer)) {

        range.setEndAfter(range.endContainer);

      }


      // range.setEnd(node, node.childNodes.length);

      let content = range.extractContents();

      if (this.isEmpty(node)) {

        // content.appendChild(document.createElement("br"));

        node.appendChild(document.createElement("br"));
        node.normalize();

      }

      range.setStartAfter(node);
      range.collapse(false);


      // if (this.isBreakNode(node, defaultTag)) {
      //
      //   range.selectNode(node);
      //   range.deleteContents();
      //
      //   if (!this.isEmpty(content)) {
      //
      //     this.insert(range, content);
      //
      //   }
      //
      //
      //
      //
      // } else


      // if (this.isBreakable(node) && !(this.isEmpty(node) && !node.nextSibling)) {
      if (this.isBreakable(node) && !this.isBreakNode(node, defaultTag)) {

        const newNode = node.cloneNode();

        if (this.isEmpty(content)) {

          newNode.appendChild(document.createElement("br"));

        } else {

          newNode.appendChild(content);

        }


        range.insertNode(newNode);
        range.selectNodeContents(newNode);
        range.collapse(true);

      } else { // node is not breakable -> insert content at root as a paragraph

        // if (this.isEmpty(node) && node.tagName !== "P") {
        if (this.isBreakNode(node, defaultTag)) {

          range.selectNode(node);
          range.deleteContents();

        }

        while (range.startContainer !== this.element) {

          range.setStartAfter(range.startContainer);
          range.collapse(true);

        }

        const newNode = document.createElement(defaultTag);

        if (content.textContent) {

          newNode.appendChild(content);

        } else {

          newNode.appendChild(document.createElement("br"));

        }

        range.insertNode(newNode);
        range.selectNodeContents(newNode);
        range.collapse(true);

      }


    }

  }

  // isJoinable(node1, node2) {
  //
  //   return node1 && node2 && node1.nodeType === node2.nodeType && node1.tagName === node2.tagName;
  //
  // }

  // isJoinable(range) {
  //
  //   if (range.startContainer.nodeType === 1 && range.startOffset > 0) {
  //
  //     const node = range.startContainer.childNodes[range.startOffset];
  //
  //     if (node && node.previousSibling && node.previousSibling.nodeType === node.nodeType && node.previousSibling.tagName === node.tagName && this.isBreakable(node.previousSibling)) {
  //
  //       return true;
  //
  //     }
  //
  //   }
  //
  //   return false;
  //
  // }

  areJoinable(nodeBefore, nodeAfter) {

    if (nodeBefore && nodeAfter && nodeBefore.nodeType === nodeAfter.nodeType && nodeBefore.tagName === nodeAfter.tagName) {

      return true;

    }

    return false;

  }

  isEmpty(node) {

    return !node.textContent.trim();

  }

  createEmptyParagraph() {

    const p = document.createElement("p");
    const br = document.createElement("br");

    p.appendChild(br);

    return p;

  }



  // isLineBreak(range) {
  //
  //   // const node = range.startContainer.childNodes[range.startOffset];
  //
  //   const node = this.getNodeBeforeStart(range);
  //
  //   if (node) {
  //
  //     return this.isBreakable(node);
  //
  //   }
  //
  //   return false;
  //
  // }

  // join(node1, node2) {
  //
  //   const length = node1.childNodes.length;
  //
  //   while (node2.firstChild) {
  //
  //     node1.appendChild(node2.firstChild)
  //
  //   }
  //
  //   node2.remove();
  //
  //   return node1.childNodes[length];
  //
  // }

  // join(range) {
  //
  //   const node = range.startContainer.childNodes[range.startOffset];
  //
  //   range.setStart(node.previousSibling, node.previousSibling.childNodes.length);
  //
  //   if (!this.isEmpty(node)) {
  //
  //     while (node.firstChild) {
  //
  //       node.previousSibling.appendChild(node.firstChild)
  //
  //     }
  //
  //   }
  //
  //   node.previousSibling.normalize();
  //
  //   node.remove();
  //
  //   range.collapse(true);
  //
  // }


  getNodeAfterStart(range) {

    return range.startContainer && range.startContainer.nodeType === 1 && range.startContainer.childNodes[range.startOffset];

  }

  getNodeBeforeStart(range) {

    return range.startContainer && range.startContainer.nodeType === 1 && range.startContainer.childNodes[range.startOffset - 1];

  }

  getNodeAfterEnd(range) {

    return range.endContainer && range.endContainer.nodeType === 1 && range.endContainer.childNodes[range.endOffset];

  }

  getNodeBeforeEnd(range) {

    return range.endContainer && range.endContainer.nodeType === 1 && range.endContainer.childNodes[range.endOffset - 1];

  }


  // bridge(range) {
  //
  //   while (this.isJoinable(range)) {
  //
  //     this.join(range);
  //
  //   }
  //
  // }

  getNodeLength(node) {

    if (node.nodeType === 3) {

      return node.textContent.trimEnd().length;

    } else {

      return node.childNodes.length;
    }

  }



  // joinAt(range) {
  //
  //   const node = range.startContainer;
  //
  //   if (node.nodeType === 1) {
  //
  //     range.setStart(node.previousSibling, node.previousSibling.childNodes.length);
  //
  //     while (node.firstChild) {
  //
  //       node.previousSibling.appendChild(node.firstChild)
  //
  //     }
  //
  //     node.remove();
  //
  //   } else if (node.nodeType === 3) {
  //
  //     range.setStart(node.previousSibling, node.previousSibling.length);
  //
  //     node.previousSibling.innerText = node.previousSibling.wholeText;
  //
  //     node.remove();
  //
  //   }
  //
  //   range.setEnd(range.startContainer, range.startOffset);
  //
  //
  //
  //   // return node1.childNodes[length];
  //   //
  //   //
  //   // range.setStart(node, 0);
  //   // range.setEnd(node, 0);
  //
  // }

  // delete_V1(range) {
  //
  //   if (range.startOffset === 0) {
  //
  //     // const deleteRange = new Range();
  //
  //     let node = range.startContainer
  //
  //     // while (node.nodeType === 1 && node.firstChild) {
  //     //
  //     //   node = node.firstChild;
  //     //
  //     // }
  //     //
  //     // deleteRange.setEnd(node, 0);
  //
  //     while (!node.previousSibling && node.parentNode !== this.element) {
  //
  //       node = node.parentNode;
  //
  //       range.setStart(node.parentNode, 0);
  //
  //     }
  //
  //
  //
  //     if (node) {
  //
  //       if (this.isBlock(node)) {
  //
  //         let previousNode = node.previousSibling;
  //
  //         if (previousNode && this.isJoinable(previousNode, node)) {
  //
  //           let length = previousNode.childNodes.length;
  //
  //           this.join(previousNode, node);
  //
  //
  //         }
  //
  //         // while (node.nodeType === 1 && node.lastChild) {
  //         //
  //         //   node = node.lastChild;
  //         //
  //         // }
  //
  //         // const length = node.nodeType === 3 ? node.length : node.childNodes.length;
  //         //
  //         // deleteRange.setStart(node, length);
  //         //
  //         // deleteRange.deleteContents();
  //
  //       }
  //
  //
  //     } // else -> start of content
  //
  //
  //
  //     return true;
  //
  //   } else {
  //
  //
  //     return false;
  //
  //   }
  //
  // }

  // canDelete(range) {
  //
  //   if (range.collapsed && range.startOffset === 0) {
  //
  //     let node = range.startContainer;
  //
  //     while (!node.previousSibling && node.parentNode !== this.element) {
  //
  //       node = node.parentNode;
  //
  //     }
  //
  //     if (!node.previousSibling) {
  //
  //       return false;
  //
  //     }
  //
  //   }
  //
  //   return true;
  //
  // }

  // delete(range) {
  //
  //   if (!range.collapsed) {
  //
  //     range.deleteContents();
  //
  //   } else if (range.startOffset === 0) {
  //
  //     while (!range.startContainer.previousSibling && range.startContainer.parentNode !== this.element) {
  //
  //       range.setStart(range.startContainer.parentNode, 0);
  //
  //     }
  //
  //     if (range.startContainer.previousSibling) {
  //
  //       if (this.isJoinable(range.startContainer.previousSibling, range.startContainer)) {
  //
  //         while (this.isJoinable(range.startContainer.previousSibling, range.startContainer)) {
  //
  //           this.joinAt(range);
  //
  //         }
  //
  //       } else {
  //
  //         let node = range.startContainer.previousSibling;
  //
  //         while (node.lastChild) {
  //
  //           node = node.lastChild;
  //
  //         }
  //
  //         if (node.nodeType === 3) {
  //
  //           range.setStart(node, node.length - 1);
  //           range.setEnd(node, node.length);
  //           range.deleteContents();
  //
  //         } else {
  //
  //           range.selectNode(node);
  //           // range.setStartBefore(node);
  //           range.deleteContents();
  //
  //         }
  //
  //       }
  //
  //
  //     } // else  -> start of content
  //
  //   } else {
  //
  //
  //
  //     if (range.startContainer.nodeType === 3) {
  //
  //       range.setStart(range.startContainer, range.startOffset - 1);
  //       range.deleteContents();
  //
  //     } else if (range.startContainer.nodeType === 1) {
  //
  //       let node = range.startContainer.childNodes[range.startOffset];
  //
  //       range.setStart(node, 0);
  //       range.setEnd(node, 0);
  //
  //
  //
  //     }
  //
  //
  //
  //
  //
  //     if (range.startContainer.previousSibling) {
  //
  //       if (this.isJoinable(range.startContainer.previousSibling, range.startContainer)) {
  //
  //         while (this.isJoinable(range.startContainer.previousSibling, range.startContainer)) {
  //
  //           this.joinAt(range);
  //
  //         }
  //
  //       } else {
  //
  //         let node = range.startContainer.previousSibling;
  //
  //         while (node.lastChild) {
  //
  //           node = node.lastChild;
  //
  //         }
  //
  //         if (node.nodeType === 3) {
  //
  //           range.setStart(node, node.length - 1);
  //           range.setEnd(node, node.length);
  //           range.deleteContents();
  //
  //         } else {
  //
  //           range.selectNode(node);
  //           // range.setStartBefore(node);
  //           range.deleteContents();
  //
  //         }
  //
  //       }
  //
  //
  //     } // else  -> start of content
  //
  //
  //   }
  //
  //   return true;
  //
  // }

  // delete(range) {
  //
  //   if (!range.collapsed) {
  //
  //     debugger;
  //
  //     while (range.startContainer !== range.commonAncestorContainer && range.startOffset === 0) {
  //
  //       range.setStartBefore(range.startContainer);
  //
  //     }
  //
  //     while (range.endContainer !== range.commonAncestorContainer && range.endOffset === this.getNodeLength(range.endContainer)) {
  //
  //       range.setEndAfter(range.endContainer);
  //
  //     }
  //
  //     range.deleteContents();
  //
  //     while (range.commonAncestorContainer !== this.element && this.isEmpty(range.commonAncestorContainer)) {
  //
  //       range.selectNode(range.commonAncestorContainer);
  //       range.deleteContents();
  //
  //     }
  //
  //     // this.bridge(range);
  //
  //     // while (this.isEmpty(range.startContainer)) {
  //     //
  //     //   range.selectNode(range.startContainer);
  //     //   range.deleteContents();
  //     //
  //     // }
  //
  //   } else if (range.startContainer.nodeType === 3) {
  //
  //     if (range.startOffset > 0) {
  //
  //       range.setStart(range.startContainer, range.startOffset - 1);
  //       range.deleteContents();
  //
  //     } else {
  //
  //       range.setStartBefore(range.startContainer);
  //       range.collapse(true);
  //
  //       this.delete(range);
  //
  //     }
  //
  //   } else {
  //
  //     while (range.startOffset === 0 && range.startContainer !== this.element) {
  //
  //       range.setStartBefore(range.startContainer);
  //       range.collapse(true);
  //
  //     }
  //
  //     if (this.isJoinable(range)) {
  //
  //       while (this.isJoinable(range)) {
  //
  //         this.join(range);
  //
  //       }
  //
  //     } else if (range.startOffset > 0) {
  //
  //       let node = range.startContainer.childNodes[range.startOffset - 1];
  //
  //       while (node.lastChild) {
  //
  //         node = node.lastChild;
  //
  //       }
  //
  //       if (node.nodeType === 3) {
  //
  //         range.setStart(node, node.length - 1);
  //         range.setEnd(node, node.length);
  //         range.deleteContents();
  //
  //       } else {
  //
  //         range.selectNode(node);
  //         // range.setStartBefore(node);
  //         range.deleteContents();
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }


  delete(range) {

    let done = false;

    if (!range.collapsed) {

      while (range.startContainer !== range.commonAncestorContainer && range.startOffset === 0) {

        range.setStartBefore(range.startContainer);

      }

      while (range.endContainer !== range.commonAncestorContainer && range.endOffset >= this.getNodeLength(range.endContainer)) {

        range.setEndAfter(range.endContainer);

      }

      let nodeRemoved = range.commonAncestorContainer;

      range.deleteContents();

      while (range.commonAncestorContainer !== this.element && this.isEmpty(range.commonAncestorContainer)) {

        range.selectNode(range.commonAncestorContainer);
        range.deleteContents();

      }

      if (nodeRemoved && nodeRemoved.tagName === "P") {

        range.insertNode(this.createEmptyParagraph());
        range.collapse(true);

      }

      done = true;

    } else if (range.startContainer.nodeType === 3 && range.startOffset > 0) {


      return false; // -> use default

      // range.setStart(range.startContainer, range.startOffset - 1);
      // range.deleteContents();

      // console.log(range.startContainer[range.startOffset - 1]);
      // if (range.startContainer[range.startOffset - 1] === " ") {
      //   console.log("x");
      // }

    } else {

      // while (range.startContainer !== this.element && this.isEmpty(range.startContainer)) {
      //
      //   range.selectNode(range.startContainer);
      //   range.deleteContents();
      //
      //   complete = true;
      //
      // }

      let emptyNode;

      while (range.startOffset === 0 && range.startContainer !== this.element) {

        if (this.isEmpty(range.startContainer)) { // e.g: when deleting first item of ul

          // range.selectNode(range.startContainer);
          // range.deleteContents();

          emptyNode = range.startContainer
          // done = true;

        }

        range.setStartBefore(range.startContainer);
        range.collapse(true);

      }

      let nodeBefore = this.getNodeBeforeStart(range);
      let nodeAfter = this.getNodeAfterStart(range);



      if (emptyNode) {

        range.selectNode(emptyNode);
        range.deleteContents();

        done = true;

        nodeAfter = undefined;


      } else if (nodeAfter && this.isEmpty(nodeAfter)) {

        range.selectNode(nodeAfter);
        range.deleteContents();

        done = true;

        nodeAfter = undefined;

      } else if (nodeBefore && this.isEmpty(nodeBefore)) {

        range.selectNode(nodeBefore);
        range.deleteContents();

        done = true;

        nodeBefore = undefined;

        // while (nodeBefore.lastChild) {
        //
        //   nodeBefore = nodeBefore.lastChild;
        //
        // }
        //
        // range.selectNodeContents(nodeBefore);
        // range.collapse(false);


      } else if (nodeBefore && nodeAfter && this.areJoinable(nodeBefore, nodeAfter)) {

        // range.selectNodeContents(nodeBefore);
        // range.collapse(false);

        while (this.areJoinable(nodeBefore, nodeAfter)) {

          // range.selectNodeContents(nodeAfter);
          // const contents = range.extractContents();
          // range.selectNodeContents(nodeBefore);
          // range.collapse(false);
          // nodeBefore = nodeBefore.lastChild;
          // range.insertContents(contents);
          // range.collapse(true);
          // nodeAfter = nodeBefore.nextChild;

          const newNodeBefore = nodeBefore.lastChild;
          const newNodeAfter = nodeAfter.firstChild;

          // range.setStartAfter(nodeBefore);
          // range.collapse(true);

          range.selectNodeContents(newNodeBefore);
          range.collapse(false);

          while (nodeAfter.firstChild) {

            nodeBefore.appendChild(nodeAfter.firstChild)

          }

          nodeAfter.remove();

          if (newNodeBefore.nodeType !== 1 || newNodeAfter.nodeType !== 1) {

            nodeBefore.normalize();
            nodeBefore = undefined;
            nodeAfter = undefined;
            break;

          }

          nodeBefore = newNodeBefore;
          nodeAfter = newNodeAfter;

        }

        done = true;

      }

      if (nodeBefore) {

        while (nodeBefore.lastChild) {

          nodeBefore = nodeBefore.lastChild;

        }

        range.selectNodeContents(nodeBefore);
        range.collapse(false);

      }


      // const isLineBreak = this.isLineBreak(range);

      // while (this.isJoinable(range)) {
      //
      //   this.join(range);
      //
      // }


      // if (range.startOffset > 0 && range.startContainer.nodeType === 1) {
      //
      //   let node = range.startContainer.childNodes[range.startOffset - 1];
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
      //   if (!isLineBreak) {
      //
      //     if (node.nodeType === 3) { // style need to delete one
      //
      //       range.setStart(node, node.length - 1);
      //
      //     } else {
      //
      //       range.setStart(node, node.childNodes.length - 1);
      //
      //     }
      //
      //     range.deleteContents();
      //
      //     while (range.startContainer !== this.element && this.isEmpty(range.startContainer)) {
      //
      //       range.selectNode(range.commonAncestorContainer);
      //       range.deleteContents();
      //
      //     }
      //
      //   }
      //
      // }

    }

    return done;

  }

  insert(range, ...nodes) {

    if (!range.collapsed) {

      this.delete(range);

    }

    for (let node of nodes) {

      // if (node.tagName === "LI") {
      //
      //   if (range.startContainer.tagName === "LI" && this.isEmpty(range.startContainer)) {
      //
      //     range.selectNode(range.startContainer);
      //     range.deleteContents();
      //
      //   }
      //
      //
      //
      // }

      // if (this.isEmpty(node)) {
      //
      //   continue;
      //
      // }

      // if (!this.isText(node) && !this.isInline(node) && !this.isRoot(range.startContainer)) {
      //
      //   // this.breakLine(range);
      //
      //   // while (!this.isBreakable(range.startContainer) && !this.isRoot(range.startContainer)) {
      //
      //
      //
      //   // if (this.isEmpty(range.startContainer)) {
      //   //
      //   //   range.selectNode(range.startContainer);
      //   //   range.deleteContents();
      //   //
      //   // }
      //
      // }

      while (!this.isValidIn(node, range.startContainer)) {

        if (this.isEmpty(range.startContainer)) {

          range.selectNode(range.startContainer);
          range.deleteContents();

        } else {

          range.setStartAfter(range.startContainer);
          range.collapse(true);

        }

      }

      range.insertNode(node);
      range.setStartAfter(node);
      range.collapse(true);

    }

  }

  copy(range) {

    // while (range.startContainer !== range.commonAncestorContainer && range.startOffset === 0) {
    //
    //   range.setStartBefore(range.startContainer);
    //
    // }
    //
    // while (range.endContainer !== range.commonAncestorContainer && range.endOffset >= this.getNodeLength(range.endContainer)) {
    //
    //   range.setEndAfter(range.endContainer);
    //
    // }

    const content = range.cloneContents();

    const container = document.createElement("div");
    container.appendChild(content);

    return container.innerHTML;

  }

  paste(range, html) {

    const container = document.createElement("div");
    container.innerHTML = html;

    this.clean(container);

    this.insert(range, ...container.childNodes);

    // if (!range.collapsed) {
    //
    //   this.delete(range);
    //
    // }
    //
    //
    //
    // let child = container.firstChild;
    //
    // while (child) {
    //
    //   const next = child.nextSibling;
    //
    //   if (!this.isText(child) && !this.isInline(child) && !this.isRoot(range.startContainer)) {
    //
    //     this.breakLine(range);
    //
    //     if (this.isEmpty(range.startContainer)) {
    //
    //       range.selectNode(range.startContainer);
    //       range.deleteContents();
    //
    //     }
    //
    //   }
    //
    //   range.insertNode(child);
    //   range.setStartAfter(child);
    //   range.collapse(true);
    //
    //   child = next;
    // }

  }


  clean(node) {

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

        if (child.nodeType === 1) {

          this.clean(child);

        }

        child = next;

      }

      if (node.parentNode && (node.tagName === "SPAN" || node.tagName === "DIV")) {

        this.unwrap(node);

      }

      node.normalize();

    } else {

      node.remove();

    }

  }



}
