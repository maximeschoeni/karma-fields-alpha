
KarmaFieldsAlpha.Editor = class {

  constructor(element) {

    this.element = element;

  }

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

    } else {

      wrapper.appendChild(content);

    }

    range.insertNode(wrapper);

    range.selectNodeContents(wrapper);

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


  renameNode(range, tagName, newTagName) {

    const node = this.getNode(range, tagName);

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

  getRoot() {

    return this.element;

  }

  isRoot(node) {

    return node === this.element;

  }

  // getBase(range) {
  //
  //   return this.findNode(range, node => this.isBase(node));
  //
  // }
  //
  // isBase(node) {
  //
  //   return this.parentNode === this.element;
  //
  // }





  getTagUsage(tagName) {

    switch (tagName) {
      case "UL":
      case "OL":
      case "DIV":
      case "FIGURE":
      case "TABLE":
      case "TBODY":
      case "THEAD":
      case "TFOOTER":
      case "TR":
        return "container";

      case "P":
      case "LI":
      case "BLOCKQUOTE":
        return "breakable";

      case "H1":
      case "H2":
      case "H3":
      case "H4":
      case "H5":
      case "H6":
      case "FIGCAPTION":
      case "TH":
      case "TD":
        return "unbreakable";

      case "SPAN":
      case "IMG":
      case "B":
      case "STRONG":
      case "EM":
      case "I":
      case "A":
      case "SUB":
      case "SUP":
        return "inline";

      case "BR":
      case "IMG":
      case "VIDEO":
        return "single";

      default:
        return "";

    }

  }

  getChildTag(tag) {

    switch (tag) {

      case "UL":
      case "OL":
        return "LI";

      case "TABLE":
        return "TR";

      case "TR":
        return "TD";

      case "DIV":
        return "P";

    }

  }

  isContainer(node) {

    return this.getTagUsage(node.tagName) === "container";

    // const tags = ["UL", "OL", "DIV", "FIGURE", "TABLE", "TBODY", "THEAD", "TFOOTER", "TR"];
    //
    // return this.isRoot(node) || tags.includes(node.tagName);

  }

  isBlock(node) {

    const usage = this.getTagUsage(node.tagName);

    return usage === "breakable" || usage === "unbreakable" || usage === "container";

    // const tags = ["H1", "H2", "H3", "H4", "H5", "H6", "P", "BR", "BLOCKQUOTE", "DIV", "UL", "OL", "LI", "FIGURE", "FIGCAPTION", "TABLE", "TBODY", "THEAD", "TFOOTER", "TR", "TH", "TD"];
    //
    // return tags.includes(node.tagName);

  }

  isInline(node) {

    const usage = this.getTagUsage(node.tagName);

    return usage === "inline" || usage === "single";


    // const display = getComputedStyle(node).display;
    //
    // return node && node.nodeType === 1 && getComputedStyle(node).display === "inline";

    // const inlineTags = ["SPAN", "IMG", "B", "STRONG", "EM", "I", "A", "SUB", "SUP"];
    //
    // return inlineTags.includes(node.tagName);

  }

  isBreakable(node) {

    return this.getTagUsage(node.tagName) === "breakable";

    // const tags = ["P", "LI", "BLOCKQUOTE"];
    //
    // return tags.includes(node.tagName);

    // return node.tagName === "P" || node.tagName === "LI" || node.tagName === "BLOCKQUOTE";

  }

  isSingleElement(node) {

    return this.getTagUsage(node.tagName) === "single";

    // const tags = ["IMG", "BR"];
    //
    // return tags.includes(node.tagName);

  }

  isValid(node) {

    // if (!this.isSingleElement(node) && !node.hasChildNodes()) {
    //
    //   return false;
    //
    // }
    //
    // const tags = ["H1", "H2", "H3", "H4", "H5", "H6", "P", "BLOCKQUOTE", "BR", "DIV", "SPAN", "UL", "OL", "LI", "FIGURE", "FIGCAPTION", "IMG", "B", "STRONG", "EM", "I", "A", "SUB", "SUP", "TABLE", "TBODY", "THEAD", "TFOOTER", "TR", "TH", "TD"];
    //
    // return tags.includes(node.tagName);

    const usage = this.getTagUsage(node.tagName);

    switch (usage) {

      case "container":
      case "breakable":
      case "unbreakable":
      case "inline":
        return node.hasChildNodes();

      case "single":
        return true;

      default:
        return false;



    }

  }

  isText(node) {

    return node.nodeType === 3;

  }

  isElement(node) {

    return node.nodeType === 1;

  }

  isBreakNode(node, range) {

    // return this.isEmpty(node) && !node.nextSibling && node.tagName !== defaultTag.toUpperCase();

    // return this.isEmpty(node) && node.tagName !== "P";

    if (range.startContainer === node && range.startOffset === 0) {

      return true;

    }

    return false;

  }

  isValidIn(node, container) {

    return this.isText(node) || this.isTagValidIn(node.tagName, container.tagName);

    // if (this.isText(node) || this.isInline(node) || this.isRoot(container)) {
    //
    //   return true;
    //
    // }
    //
    // switch (node.tagName) {
    //
    //   case "A":
    //   case "SPAN":
    //   case "B":
    //   case "STRONG":
    //   case "EM":
    //   case "I":
    //   case "SUB":
    //   case "SUP":
    //     return true;
    //
    //   case "IMG":
    //     return container.tagName === "P" || container.tagName === "FIGURE";
    //
    //   case "FIGCAPTION":
    //     return container.tagName === "FIGURE";
    //
    //   case "LI":
    //     return container.tagName === "UL" || container.tagName === "OL";
    //
    //   default:
    //     return false;
    //
    // }

  }

  isTagValidIn(tag, containerTag) {

    // if (this.isText(node) || this.isInline(node) || this.isRoot(container)) {
    //
    //   return true;
    //
    // }

    switch (tag) {

      case "A":
      case "SPAN":
      case "B":
      case "STRONG":
      case "EM":
      case "I":
      case "SUB":
      case "SUP":
      case "BR":
        return this.getTagUsage(containerTag) !== "container";

      case "P":
      case "FIGURE":
      case "UL":
      case "OL":
      case "TABLE":
        return containerTag === "DIV";

      case "IMG":
        return true; // compat

      case "FIGCAPTION":
        return containerTag === "FIGURE";

      case "TBODY":
      case "THEAD":
      case "TFOOT":
        return containerTag === "TABLE";

      case "LI":
        return containerTag === "UL" || containerTag === "OL";

      case "TR":
        return containerTag === "TABLE" || containerTag === "TBODY" || containerTag === "THEAD" || containerTag === "TFOOT";

      case "TD":
      case "TH":
        return containerTag === "TR";

      default:
        return false;

    }

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

  createEmpty(tagName) {

    const node = document.createElement(tagName);

    node.appendChild(document.createElement("br"));

    return node;

  }

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

  getNodeLength(node) {

    if (node.nodeType === 3) {

      return node.textContent.trimEnd().length;

    } else {

      return node.childNodes.length;
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

  // breakLine_BKP(range, defaultTag = "P") {
  //
  //   if (!range || !range.startContainer || !this.element.contains(range.startContainer)) {
  //
  //     console.error("A valid range is required.");
  //     return;
  //
  //   }
  //
  //   // let blockNode = this.findNode(range, node => this.isBlock(node));
  //
  //
  //   if (!range.collapsed) {
  //
  //     this.delete(range);
  //
  //   }
  //
  //
  //   let node = range.startContainer;
  //
  //   // let objectRange = range.cloneRange();
  //
  //   if (this.isRoot(node)) {
  //
  //     const newNode = document.createElement(defaultTag);
  //
  //     newNode.appendChild(document.createElement("br"));
  //
  //     range.insertNode(newNode);
  //     range.setStartAfter(newNode);
  //     range.collapse(true);
  //
  //   } else {
  //
  //     while (!this.isRoot(node.parentNode) && !this.isBreakable(node)) {
  //
  //       node = node.parentNode;
  //
  //     }
  //
  //
  //
  //     // const endRange = new Range();
  //     // // endRange.selectNodeContents(blockNode);
  //     // endRange.setStart(range.startContainer, range.startOffset);
  //     // // endRange.setEnd(node, node.childNodes.length);
  //     // endRange.setEndAfter(node);
  //
  //
  //     range.setEnd(node, node.childNodes.length);
  //
  //     let content = range.extractContents();
  //
  //     if (this.isEmpty(node)) {
  //
  //       // content.appendChild(document.createElement("br"));
  //
  //       node.appendChild(document.createElement("br"));
  //       node.normalize();
  //
  //     }
  //
  //     range.setStartAfter(node);
  //     range.collapse(false);
  //
  //
  //     // if (this.isBreakNode(node, defaultTag)) {
  //     //
  //     //   range.selectNode(node);
  //     //   range.deleteContents();
  //     //
  //     //   if (!this.isEmpty(content)) {
  //     //
  //     //     this.insert(range, content);
  //     //
  //     //   }
  //     //
  //     //
  //     //
  //     //
  //     // } else
  //
  //
  //     // if (this.isBreakable(node) && !(this.isEmpty(node) && !node.nextSibling)) {
  //     if (this.isBreakable(node) && !this.isBreakNode(node, defaultTag)) {
  //
  //       const newNode = node.cloneNode();
  //
  //       if (this.isEmpty(content)) {
  //
  //         newNode.appendChild(document.createElement("br"));
  //
  //       } else {
  //
  //         newNode.appendChild(content);
  //
  //       }
  //
  //
  //
  //       // node.parentNode.insertBefore(newNode, node.nextSibling);
  //       //
  //       // range.setStart(newNode, 0);
  //       // range.setEnd(newNode, 0);
  //
  //       // range.setStartAfter(node);
  //       // range.collapse(true);
  //       range.insertNode(newNode);
  //       range.selectNodeContents(newNode);
  //       range.collapse(true);
  //
  //     } else { // node is not breakable -> insert content at root as a paragraph
  //
  //       // if (this.isEmpty(node) && node.tagName !== "P") {
  //       if (this.isBreakNode(node, defaultTag)) {
  //
  //         range.selectNode(node);
  //         range.deleteContents();
  //
  //       }
  //
  //       while (range.startContainer !== this.element) {
  //
  //         range.setStartAfter(range.startContainer);
  //         range.collapse(true);
  //
  //       }
  //
  //       const newNode = document.createElement(defaultTag);
  //
  //       if (content.textContent) {
  //
  //         newNode.appendChild(content);
  //
  //       } else {
  //
  //         newNode.appendChild(document.createElement("br"));
  //
  //       }
  //
  //       range.insertNode(newNode);
  //       range.selectNodeContents(newNode);
  //       range.collapse(true);
  //
  //     }
  //
  //
  //   }
  //
  // }





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





  // bridge(range) {
  //
  //   while (this.isJoinable(range)) {
  //
  //     this.join(range);
  //
  //   }
  //
  // }





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

  breakLine(range) {

    if (!range || !range.startContainer || !this.element.contains(range.startContainer)) {

      console.error("A valid range is required.");
      return;

    }

    if (!range.collapsed) {

      this.delete(range);

    }

    let node = range.startContainer;

    while (!this.isRoot(node) && !this.isBlock(node)) {

      node = node.parentNode;

    }

    if (this.isContainer(node)) {

      const tag = this.getChildTag(node.tagName);

      const newNode = document.createElement(tag);

      newNode.appendChild(document.createElement("br"));

      this.insert(range, newNode);

    } else if (this.isBreakNode(node, range)) { // like empty li element

      range.selectNode(node);
      range.deleteContents();

      while (!this.isRoot(range.endContainer)) {

        range.setEndAfter(range.endContainer);

      }

      let content = range.extractContents();

      const p = document.createElement("p");
      p.appendChild(document.createElement("br"));

      range.insertNode(p);
      range.collapse(false);

      if (!this.isEmpty(content)) {

        this.insert(range, ...content.childNodes);

      }

      range.setStart(p, 0);
      range.collapse(true);

    } else if (this.isBreakable(node)) {

      range.setEndAfter(node);

      const content = range.extractContents();

      const next = content.firstChild;

      if (this.isEmpty(next)) {

        while (next.firstChild) {

          next.removeChild(next.firstChild);

        }

        next.appendChild(document.createElement("br"));

      }

      if (this.isEmpty(node)) {

        while (node.firstChild) {

          node.removeChild(node.firstChild);

        }

        node.appendChild(document.createElement("br"));

      }

      this.insert(range, next);

      range.setStart(next, 0);
      range.collapse(true);

    } else { // not breakable (like figcaption)

      range.setEnd(node, node.childNodes.length);

      let content = range.extractContents();

      let p = document.createElement("p");

      p.appendChild(content);

      if (this.isEmpty(p)) {

        while (p.firstChild) {

          p.removeChild(p.firstChild);

        }

        p.appendChild(document.createElement("br"));

      }

      this.insert(range, p);

      range.setStart(p, 0);
      range.collapse(true);

    }

  }


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

        range.insertNode(this.createEmpty("p"));
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

      // if (this.isEmpty(node)) {
      //
      //   while (node.firstChild) {
      //
      //     node.removeChild(node.firstChild);
      //
      //   }
      //
      //   node.appendChild(document.createElement("br"));
      //
      // }

      while (!this.isRoot(range.startContainer) && !this.isValidIn(node, range.startContainer)) {

        if (this.isEmpty(range.startContainer)) {

          range.selectNode(range.startContainer);
          range.deleteContents();

        } else {

          range.setStartAfter(range.startContainer);
          range.collapse(true);

        }

      }


      //
      // if (this.isRoot(range.startContainer) && !this.isValidIn(node, range.startContainer)) {
      //
      //   const p = document.createElement("p");
      //
      //   if (this.isValidIn(node, p)) {
      //
      //     p.appendChild(node);
      //
      //     node = p;
      //
      //   } else {
      //
      //     continue;
      //
      //   }
      //
      // }


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

        if (this.isElement(child)) {

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

  insertList(range, tagName) {

    debugger;

    const listNode = document.createElement(tagName);

    if (range.collapsed) {

      const li = this.createEmpty("li");

      // const li = document.createElement("li");
      // const br = document.createElement("br");
      //
      // li.appendChild(br);
      listNode.appendChild(li);

      this.insert(range, listNode);

      range.setStart(li, 0);
      range.collapse(true);

    } else {

      // convert paragraphs to list items:

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

      this.insert(range, listNode);

    }

  }



}
