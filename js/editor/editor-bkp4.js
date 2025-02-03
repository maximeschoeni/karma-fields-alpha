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

  // setPath(pathes) {
  //
  //   const range = this.getRangeFromPathes(pathes);
  //
  //     const selection = document.getSelection();
  //     selection.removeAllRanges();
  //     selection.addRange(range);
  //
  //   this.setRange(range);
  //
  // }



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

  // getPointFromPath(path) {
  //
  //   let node = this.element;
  //   let depth = 0;
  //   let offset = path[depth] || 0;
  //
  //   while (this.isElement(node) && node.firstChild) {
  //
  //
  //     node = node.firstChild;
  //
  //     for (let i = 0; i < offset; i++) {
  //
  //       if (node.nextSibling) {
  //
  //         node = node.nextSibling;
  //
  //       }
  //
  //     }
  //
  //     depth++;
  //
  //
  //
  //     if (depth < path.length) {
  //
  //       offset = path[depth];
  //
  //     } else {
  //
  //       break;
  //
  //     }
  //
  //   }
  //
  //   if (this.isElement(node)) {
  //
  //     offset = Math.min(node.childNodes.length, offset);
  //
  //   } else {
  //
  //     offset = Math.min(node.length, offset);
  //
  //   }
  //
  //   return [node, offset];
  //
  // }

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



  // extractAtPathes(startPath, endPath) {
  //
  //   let content;
  //
  //   let path = startPath.slice();
  //
  //   let [node, offset] = this.getPointFromPath(startPath);
  //   let [endNode, endOffset] = this.getPointFromPath(endPath);
  //
  //   while (node) {
  //
  //     if (node === endNode) {
  //
  //
  //
  //     }
  //
  //
  //
  //   }
  //
  //   if (this.isText(node)) {
  //
  //     this.splitTextNode(node, offset);
  //
  //
  //
  //
  //
  //   }
  //
  //   content =
  //
  //
  //
  //
  //
  //
  // }
  //
  // shortcutPath(path) {
  //
  //   while (path.length > 0 && path[path.length-1] === 0) {
  //
  //     path.pop();
  //
  //   }
  //
  // }
  //
  // cutPathTo(path, length) {
  //
  //   let [node, offset] = this.getPointFromPath(path);
  //
  //   if (this.isText(node)) {
  //
  //     let [leftNode, rightNode] = this.splitTextNode(node, offset);
  //
  //   } else {
  //
  //     const leftNode = node.cloneNode();
  //
  //     for (let i = 0; i < offset; i++) {
  //
  //       leftNode.appendChild(node.firstChild);
  //
  //     }
  //
  //   }
  //
  //
  // }



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

  // shrinkRange(range) {
  //
  //   if (range.startOffset >= this.getNodeLength(range.startContainer) && !this.isRoot(range.startContainer)) {
  //
  //     let node = range.startContainer;
  //
  //     while (!node.nextSibling && !this.isRoot(node)) {
  //
  //       node = node.parentNode;
  //
  //     }
  //
  //     if (node.nextSibling) {
  //
  //       node = node.nextSibling;
  //
  //     }
  //
  //     range.setStart(node, 0);
  //
  //   }
  //
  //   while (range.startOffset === 0 && range.startContainer.firstChild) {
  //
  //     range.setStart(range.startContainer.firstChild, 0);
  //
  //   }
  //
  //   let node = range.endContainer;
  //
  //   if (range.endOffset === 0) {
  //
  //     while (!node.previousSibling && !this.isRoot(node)) {
  //
  //       node = node.parentNode;
  //
  //     }
  //
  //     if (node.previousSibling) {
  //
  //       node = node.previousSibling;
  //
  //     }
  //
  //     range.setEnd(node, this.getNodeLength(node));
  //
  //   }
  //
  //   while (range.startOffset === 0 && range.startContainer.firstChild) {
  //
  //     range.setStart(range.startContainer.firstChild, 0);
  //
  //   }
  //
  //
  //
  //
  // }

  // isPointAtEnd(node, offset) {
  //
  //   if (this.isText(node)) {
  //
  //     console.log(node.textContent.trimEnd().length, node.length);
  //
  //     return offset <= node.textContent.trimEnd().length;
  //
  //   } else {
  //
  //
  //
  //   }
  //
  // }

  getDeepRange(range) {

    console.warn("deprecated");

    range = range.cloneRange();

    this.selectDown(range);

    return range;

  }

  getNodeByTags(range, ...tags) {

    console.error("deprecated");

    return this.getNode(range, node => this.isElement(node) && node.matches(tags.join(",")));

  }

  getNode(range, fn) {

    console.error("deprecated");

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

  // *getNodesAtBKP(range, fn) {
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
  //
  //   // if (range.collapsed || (this.isText(range.startContainer) && range.startContainer === range.endContainer)) {
  //   //
  //   //   let node = range.startContainer;
  //   //
  //   //   while (node && !this.isRoot(node)) {
  //   //
  //   //     if (fn(node)) {
  //   //
  //   //       yield node;
  //   //
  //   //     }
  //   //
  //   //     node = node.parentNode;
  //   //   }
  //   //
  //   // } else {
  //
  //   if (!range.collapsed) {
  //
  //     range = this.getDeepRange(range);
  //
  //     let node, endNode;
  //
  //     if (this.isText(range.startContainer)) {
  //
  //       node = range.startContainer;
  //
  //     } else {
  //
  //       node = range.startContainer.childNodes[range.startOffset];
  //
  //     }
  //
  //     if (this.isText(range.endContainer)) {
  //
  //       endNode = range.endContainer; //this.getNextNode(range.endContainer);
  //
  //     } else {
  //
  //       endNode = range.endContainer.childNodes[range.endOffset];
  //
  //     }
  //
  //     while (node && node !== endNode && !this.isRoot(node)) {
  //
  //       if (fn(node)) {
  //
  //         yield node;
  //
  //       }
  //
  //       node = this.getNextNode(node);
  //
  //     }
  //
  //   }
  //
  // }

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

  // *listNodesAtBETA(range) {
  //
  //   let node = range.startContainer;
  //
  //   while (!this.isRoot(node)) {
  //
  //     yield node;
  //
  //     node = node.parentNode;
  //
  //   }
  //
  //   if (!range.collapsed) {
  //
  //     node = range.endContainer;
  //
  //     while (node !== range.commonAncestorContainer) {
  //
  //       yield node;
  //
  //       node = node.parentNode;
  //
  //     }
  //
  //   }
  //
  // }

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

  // *getNodesAt(range, fn) {
  //
  //   range = range.cloneRange();
  //
  //   while ((range.startOffset === 0 || this.isText(range.startContainer)) && !this.isRoot(range.startContainer)) {
  //
  //     range.setStartBefore(range.startContainer);
  //
  //   }
  //
  //   while (range.endOffset === 0 && !this.isRoot(range.endContainer)) {
  //
  //     range.setEndBefore(range.endContainer);
  //
  //   }
  //
  //   let node = range.startContainer.childNodes[range.startOffset];
  //
  //   while (node && node !== range.commonAncestorContainer && !this.isRoot(node) && range.comparePoint(node, 0) < 1) {
  //
  //     if (fn(node)) {
  //
  //       yield node;
  //
  //     }
  //
  //     node = this.getNextNode(node);
  //
  //   }
  //
  //   node = range.commonAncestorContainer;
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
  //
  //   }
  //
  // }

  hasNodeAt(range, fn) {

    console.warn("deprecated");

    for (let node of this.listNodesAt(range)) {

      if (fn(node)) {

        return true;

      }

    }

    return false;

  }

  findNodeAt(range, fn) {

    for (let node of this.listNodesAt(range)) {

      if (fn(node)) {

        return node;

      }

    }

  }

  // getNodeAtStart(range, fn) {
  //
  //   range = this.getDeepRange(range);
  //
  //   let node = range.startContainer;
  //
  //   while (!this.isRoot(node)) {
  //
  //     if (fn(node)) {
  //
  //       return node;
  //
  //     }
  //
  //     node = node.parentNode;
  //
  //   }
  //
  //   if (this.isElement(range.startContainer)) {
  //
  //     node = range.startContainer.childNodes[range.startOffset];
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
  //   range = this.getDeepRange(range);
  //
  //   let node = range.endContainer;
  //
  //   while (!this.isRoot(node)) {
  //
  //     if (fn(node)) {
  //
  //       return node;
  //
  //     }
  //
  //     node = node.parentNode;
  //
  //   }
  //
  //   if (this.isElement(range.endContainer)) {
  //
  //     node = range.endContainer.childNodes[range.endOffset - 1];
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

  wrap(range, tagName, params) {

    console.error("deprecated");

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

  wrapAt(range, tagName, params) {

    console.warn("deprecated");

    // let wrapNode = document.createElement(tagName);
    //
    // if (params) {
    //
    //   for (let key in params) {
    //
    //     if (params[key]) {
    //
    //       wrapNode.setAttribute(key, params[key]);
    //
    //     }
    //
    //   }
    //
    // }

    let wrapNode = this.createNode(tagName, params);

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

      // if (blocks.length) {
      if (this.isContainer(range.commonAncestorContainer)) {

        const blocks = [...this.getNodesAt(range, node => this.isBlock(node))];

        for (let block of blocks) {

          // let newRange = new Range();
          // newRange.selectNodeContents(block);
          //
          // this.wrapAt(newRange, tagName, params);

          range.selectNodeContents(block);

          this.wrapAt(range, tagName, params);

        }

      } else {

        const content = range.extractContents();

        while (!this.isRoot(range.endContainer) && (!this.isContainer(range.endContainer) || !this.isValidIn(wrapNode, range.endContainer))) {

          range.setEndAfter(range.endContainer);

        }

        if (!this.isValidIn(wrapNode, range.endContainer)) {

          const p = document.createElement("p");

          while (wrapNode.firstChild) {

            p.appendChild(wrapNode.firstChild);

          }

          wrapNode = p;

        }

        const nextContent = range.extractContents();

        const prevNode = range.startContainer.childNodes[range.startOffset - 1];

        if (prevNode && this.isEmpty(prevNode)) {

          range.selectNode(prevNode);
          range.deleteContents();

        }

        while (content.firstChild) {

          wrapNode.appendChild(content.firstChild);

        }

        range.insertNode(wrapNode);
        range.collapse(false);

        if (!this.isEmpty(nextContent)) {

          range.insertNode(nextContent);

        }

        range.selectNodeContents(wrapNode);

      }

      // const content = range.extractContents();
      //
      // while (!this.isRoot(range.endContainer) && (!this.isContainer(range.endContainer) || !this.isValidIn(wrapNode, range.endContainer))) {
      //
      //   range.setEndAfter(range.endContainer);
      //
      // }
      //
      // if (!this.isValidIn(wrapNode, range.endContainer)) {
      //
      //   const p = document.createElement("p");
      //
      //   while (wrapNode.firstChild) {
      //
      //     p.appendChild(wrapNode.firstChild);
      //
      //   }
      //
      //   wrapNode = p;
      //
      // }
      //
      // const nextContent = range.extractContents();
      //
      // const prevNode = range.startContainer.childNodes[range.startOffset - 1];
      //
      // if (prevNode && this.isEmpty(prevNode)) {
      //
      //   range.selectNode(prevNode);
      //   range.deleteContents();
      //
      // }



      // const blocks = [];
      // let node = content.firstChild;
      //
      // while (node) {
      //
      //   if (this.isBlock(node)) {
      //
      //     blocks.push(node);
      //
      //   }
      //
      //   node = this.getNextNode(node);
      //
      // }
      //
      // if (blocks.length) {
      //
      //   for (let block of blocks) {
      //
      //     const wrapNodeClone = wrapNode.cloneNode();
      //
      //     while (block.firstChild) {
      //
      //       wrapNodeClone.appendChild(block.firstChild);
      //
      //     }
      //
      //     range.insertNode(wrapNodeClone);
      //     range.collapse(false);
      //
      //   }
      //
      // } else {
      //
      //   while (content.firstChild) {
      //
      //     wrapNode.appendChild(content.firstChild);
      //
      //   }
      //
      //   range.insertNode(wrap);
      //   range.collapse(false);
      //
      // }
      //
      // if (!this.isEmpty(nextContent)) {
      //
      //   range.insertNode(nextContent);
      //   range.setStartBefore(nextContent);
      //   range.collapse(true);
      //
      // }


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

  // getNextPoint(node, position = 0) {
  //
  //   if (position === 0) {
  //
  //     if (node.firstChild) {
  //
  //       return [node.firstChild, 0];
  //
  //     } else {
  //
  //       return [node, 1];
  //
  //     }
  //
  //   } else {
  //
  //     if (node.nextSibling) {
  //
  //       return [node.nextSibling, 0];
  //
  //     } else {
  //
  //       return [node.parentNode, 1];
  //
  //     }
  //
  //   }
  //
  // }
  //
  // *listInlineRangesAt(range) {
  //
  //   let subrange;
  //   let node = range.startContainer;
  //   let position = range.startOffset < this.getNodeLength(range.startContainer);
  //
  //   while (!range.collapsed) {
  //
  //     if (subrange) {
  //
  //       if (this.isContainer(node) || this.isBlock(node)) {
  //
  //         yield subrange;
  //
  //         subrange = null;
  //
  //       } else if (position === 1) {
  //
  //         subrange.setEndAfter(node);
  //
  //         if (!range.isPointInRange(subrange.endContainer, subrange.endOffset)) {
  //
  //           subrange.setEnd(range.endContainer, range.endOffset);
  //
  //           break;
  //
  //         }
  //
  //       }
  //
  //     } else {
  //
  //       if (position === 0 && (this.isText(node) || this.isInline(node))) {
  //
  //         subrange = new Range();
  //         range.setStart(range.startContainer, range.startOffset);
  //
  //       }
  //
  //     }
  //
  //     [node, position] = this.getNextPoint(node, position);
  //
  //     if (position === 1) {
  //
  //       range.setStartAfter(node);
  //
  //     } else {
  //
  //       range.setStartBefore(node);
  //
  //     }
  //
  //   }
  //
  // }

  // *listNodesAtTEST(range) {
  //
  //
  //
  // }

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


  renameNode(range, tagName, newTagName) {

    console.error("deprecated");

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

    console.error("deprecated");

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

    switch (node.tagName) {

      case "P":
      case "LI":
      // case "H1":
      // case "H2":
      // case "H3":
      // case "H4":
      // case "H5":
      // case "H6":
        return true;

    }

    return false;

    // const editNode = new KarmaFieldsAlpha.EditorNode(node);
    //
    // return editNode.isBreakable();
  }

  isSingle(node) {

    const editNode = new KarmaFieldsAlpha.EditorNode(node);

    return editNode.isSingle();

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

    switch (node.tagName) {

      case "A":
        return key === "target" || key === "href";

      case "IMG":
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

    return editNode.isValidIn(container);

  }

  createEmptyParagraph() {

    console.log("deprecated");

    return this.createEmpty("p");

  }

  clone(node) {

    console.log("deprecated");

    if (this.isBreakable(node)) {

      return node.cloneNode();

    } else {

      return document.createElement("p");

    }

  }

  areJoinable(nodeBefore, nodeAfter) {

    console.log("deprecated");

    if (nodeBefore && nodeAfter && nodeBefore.nodeType === nodeAfter.nodeType && nodeBefore.tagName === nodeAfter.tagName) {

      return true;

    }

    return false;

  }

  isEmpty(node) {

    // if (this.isText(node) || this.isInline(node)) {
    //
    //   return !node.textContent.trim();
    //
    // } else if (this.isSingle(node)) {
    //
    //   return false;
    //
    // } else if (this.isBlock(node)) {
    //
    //   while
    //
    // }

    // switch (this.getType(node)) {
    //
    //   case "text":
    //   case "inline":
    //     return !node.textContent.trim();
    //
    //   case "single":
    //     return false;
    //
    //   case "block":
    //     let child = node.firstChild;
    //     while (child) {
    //       if (!this.isEmpty(child) && child.tagName !== "BR") {
    //         return false;
    //       }
    //       child = child.nextSibling;
    //     }
    //     return true;
    //     // return !node.firstChild || node.firstChild.tagName === "BR";
    //
    //   case "container":
    //     return !node.firstChild;
    //
    // }
    //
    // return true;

    return !node.textContent.trim();

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

    return new KarmaFieldsAlpha.EditorNode(node).type;

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

  getNodeAfterStart(range) {

    console.log("deprecated");

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

    console.log("deprecated");

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

    console.log("deprecated");

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

    console.log("deprecated");


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

  breakLine(range, shift) {

    if (!range || !range.startContainer || !this.element.contains(range.startContainer)) {

      console.error("A valid range is required.");
      return;

    }

    if (!range.collapsed) {

      this.delete(range);

    }

    // if (shift) {
    //
    //   let br = document.createElement("br");
    //   range.insertNode(br);
    //
    //   // range.setStartAfter(br);
    //   // range.collapse(true);
    //   range.collapse(false);
    //
    //   br.parentNode.normalize();
    //
    //   if (this.isBlock(br.parentNode) && br.parentNode.lastChild === br) {
    //
    //     range.insertNode(document.createElement("br"));
    //     // range.setStartAfter(br);
    //     range.collapse(true);
    //
    //   } else if (br.nextSibling) {
    //
    //     let node = br.nextSibling;
    //
    //     while (node && !this.isSingle(node)) {
    //
    //       range.setStart(node, 0);
    //       range.collapse(true);
    //
    //       node = node.firstChild;
    //
    //     }
    //
    //   }
    //
    //   return;
    //
    // }

    if (shift) {

      while (!this.isBlock(range.endContainer) && !this.isContainer(range.endContainer) && !this.isRoot(!this.isBlock(range.endContainer))) {

        range.setEndAfter(range.endContainer);

      }

      const contentAfter = range.extractContents();
      range.collapse(false);

      let br = document.createElement("br");
      range.insertNode(br);
      range.collapse(false);

      if (br.previousSibling && this.isEmpty(br.previousSibling) && br.previousSibling.tagName !== "BR") { // -> if linebreak is at begin of a paragraph

        br.parentNode.removeChild(br.previousSibling);

      }

      if (!this.isEmpty(contentAfter)) {

        range.insertNode(contentAfter);
        range.collapse(true);

      }

      if (!br.nextSibling) {

        // range.setStartAfter(br);
        // range.collapse(true);

        let br2 = document.createElement("br");
        range.insertNode(br2);
        range.collapse(true);

      }

      // range.setStartAfter(br);
      // range.collapse(true);

      //
      // // range.setStartAfter(br);
      // // range.collapse(true);
      // range.collapse(false);
      //
      // br.parentNode.normalize();
      //
      // if (this.isBlock(br.parentNode) && br.parentNode.lastChild === br) {
      //
      //   range.insertNode(document.createElement("br"));
      //   // range.setStartAfter(br);
      //   range.collapse(true);
      //
      // } else if (br.nextSibling) {
      //
      //   let node = br.nextSibling;
      //
      //   while (node && !this.isSingle(node)) {
      //
      //     range.setStart(node, 0);
      //     range.collapse(true);
      //
      //     node = node.firstChild;
      //
      //   }
      //
      // }

      return;

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

        } else if (node.lastChild && node.lastChild.tagName === "BR") {

          node.lastChild.remove();

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


  // delete(range) {
  //
  //   if (!range.collapsed) {
  //
  //     this.selectDown(range);
  //
  //     let nodeRemoved = range.commonAncestorContainer;
  //
  //     const content = range.extractContents();
  //
  //     while (range.commonAncestorContainer !== this.element && this.isEmpty(range.commonAncestorContainer)) {
  //
  //       range.selectNode(range.commonAncestorContainer);
  //       range.deleteContents();
  //
  //     }
  //
  //     if (this.isBlock(content.firstChild)) {
  //
  //       range.insertNode(this.createEmpty(content.firstChild.tagName));
  //       range.collapse(true);
  //
  //     }
  //
  //     if (!this.element.firstChild) {
  //
  //       const p = this.createEmpty("p");
  //       range.insertNode(p);
  //       range.setStart(p, 0);
  //       range.collapse(true);
  //
  //     }
  //
  //     return true;
  //
  //   } else if (this.isEmpty(this.element)) {
  //
  //     return true; // -> prevent default BUT should not save!
  //
  //   } else if (range.startOffset === 0) {
  //
  //     const node = range.startContainer;
  //
  //     if (this.isRoot(node)) {
  //
  //       return false;
  //
  //     }
  //
  //     range.setStartBefore(node);
  //     range.collapse(true);
  //
  //     // if (this.isBlock(node)) {
  //     //
  //     //   return this.delete(range, node);
  //     //
  //     // } else {
  //
  //       return this.delete(range);
  //
  //     // }
  //
  //   } else if (this.isElement(range.startContainer)) {
  //
  //     let nodeAfter = range.startContainer.childNodes[range.startOffset];
  //     let nodeBefore = range.startContainer.childNodes[range.startOffset - 1];
  //
  //     if (nodeBefore.tagName === "BR" && nodeAfter.tagName === "BR") {
  //
  //       range.startContainer.removeChild(nodeBefore);
  //       range.startContainer.removeChild(nodeAfter);
  //
  //       return true;
  //
  //     }
  //
  //     if (nodeBefore && this.isEmpty(nodeBefore)) {
  //
  //       // if (nodeBefore.previousSibling) {
  //       //
  //       //   let node = nodeBefore.previousSibling;
  //       //
  //       //   while (node.lastChild) {
  //       //
  //       //     node = node.lastChild;
  //       //
  //       //   }
  //       //
  //       //   range.selectNodeContents(node);
  //       //   range.collapse(false);
  //       //
  //       // }
  //
  //       nodeBefore.remove();
  //
  //       return true;
  //
  //     }
  //
  //     let backNode = nodeAfter;
  //
  //     while (backNode && !this.isBlock(backNode)) {
  //
  //       backNode = backNode.firstChild;
  //
  //     }
  //
  //     if (!backNode) {
  //
  //       while (this.isElement(nodeBefore) && this.isElement(nodeAfter) && nodeBefore.tagName === nodeAfter.tagName) {
  //
  //         [nodeBefore, nodeAfter] = this.join(nodeBefore, nodeAfter);
  //
  //       }
  //
  //       range.selectNodeContents(nodeBefore);
  //       range.collapse(false);
  //
  //       nodeBefore.parentNode.normalize();
  //
  //       return false;
  //
  //     }
  //
  //     while (nodeBefore && !this.isBlock(nodeBefore)) {
  //
  //       nodeBefore = nodeBefore.lastChild;
  //
  //     }
  //
  //     if (nodeBefore) {
  //
  //       if (this.isEmpty(backNode)) {
  //
  //         backNode.remove();
  //
  //         // if (this.isEmpty(nodeAfter)) {
  //         //
  //         //   nodeAfter.remove();
  //         //
  //         // }
  //
  //         while (nodeBefore.lastChild) {
  //
  //           nodeBefore = nodeBefore.lastChild;
  //
  //         }
  //
  //         range.selectNodeContents(nodeBefore);
  //         range.collapse(false);
  //
  //         // return true;
  //
  //       } else {
  //
  //         let [leftNode, rightNode] = this.join(nodeBefore, backNode);
  //
  //         while (this.isElement(leftNode) && this.isElement(rightNode) && leftNode.tagName === rightNode.tagName) {
  //
  //           [leftNode, rightNode] = this.join(leftNode, rightNode);
  //
  //         }
  //
  //         range.selectNodeContents(leftNode);
  //         range.collapse(false);
  //
  //         leftNode.parentNode.normalize();
  //
  //       }
  //
  //       if (nodeAfter && nodeAfter !== backNode && this.isEmpty(nodeAfter)) {
  //
  //         nodeAfter.remove();
  //
  //       }
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

  isJoinable(node1, node2) {

    return this.isBlock(node1) && this.isBlock(node2) || this.isInline(node1) && this.isInline(node2) && node1.tagName === node2.tagName;

  }

  // delete(range) {
  //
  //   if (!range.collapsed) {
  //
  //
  //
  //
  //     // this.selectDown(range);
  //
  //     while (range.startOffset === 0 && range.startContainer !== range.commonAncestorContainer) {
  //
  //       range.setStartBefore(range.startContainer);
  //
  //     }
  //
  //     while (range.endOffset === 0 && range.endContainer !== range.commonAncestorContainer) {
  //
  //       range.setEndBefore(range.endContainer);
  //
  //     }
  //
  //     let nodeRemoved = range.commonAncestorContainer;
  //
  //     const content = range.deleteContents();
  //
  //     while (range.commonAncestorContainer !== this.element && this.isEmpty(range.commonAncestorContainer)) {
  //
  //       range.selectNode(range.commonAncestorContainer);
  //       range.deleteContents();
  //
  //     }
  //
  //
  //
  //     if (!this.isText(range.startContainer)) { // -> bridge
  //
  //       let nodeBefore = range.startContainer.childNodes[range.startOffset-1];
  //       let nodeAfter = range.startContainer.childNodes[range.startOffset];
  //
  //       while (nodeBefore && nodeAfter && this.isJoinable(nodeBefore, nodeAfter)) {
  //
  //         [nodeBefore, nodeAfter] = this.join(nodeBefore, nodeAfter);
  //
  //       }
  //
  //       if (nodeBefore) {
  //
  //         range.setStartAfter(nodeBefore);
  //
  //       } else if (nodeAfter) {
  //
  //         range.setStartBefore(nodeAfter);
  //
  //       }
  //
  //       range.collapse(true);
  //
  //       range.startContainer.normalize();
  //
  //     }
  //
  //
  //
  //
  //
  //     // if (this.isBlock(content.firstChild)) {
  //     //
  //     //   range.insertNode(this.createEmpty(content.firstChild.tagName));
  //     //   range.collapse(true);
  //     //
  //     // }
  //
  //     if (!this.element.firstChild) {
  //
  //       const p = this.createEmpty("p");
  //       range.insertNode(p);
  //       range.setStart(p, 0);
  //       range.collapse(true);
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
  //   } else if (range.startOffset === 0) {
  //
  //     const node = range.startContainer;
  //
  //     if (this.isRoot(node)) {
  //
  //       return false;
  //
  //     }
  //
  //     range.setStartBefore(node);
  //     range.collapse(true);
  //
  //     // if (this.isBlock(node)) {
  //     //
  //     //   return this.delete(range, node);
  //     //
  //     // } else {
  //
  //       return this.delete(range);
  //
  //     // }
  //
  //   } else if (this.isElement(range.startContainer)) {
  //
  //     let nodeAfter = range.startContainer.childNodes[range.startOffset];
  //     let nodeBefore = range.startContainer.childNodes[range.startOffset - 1];
  //
  //     if (nodeBefore.tagName === "BR" && nodeAfter.tagName === "BR") {
  //
  //       range.startContainer.removeChild(nodeBefore);
  //       range.startContainer.removeChild(nodeAfter);
  //
  //       return true;
  //
  //     }
  //
  //     if (nodeBefore && this.isEmpty(nodeBefore)) {
  //
  //       nodeBefore.remove();
  //
  //       return true;
  //
  //     }
  //
  //     let backNode = nodeAfter;
  //
  //     while (backNode && !this.isBlock(backNode)) {
  //
  //       backNode = backNode.firstChild;
  //
  //     }
  //
  //     if (!backNode) {
  //
  //       while (this.isElement(nodeBefore) && this.isElement(nodeAfter) && nodeBefore.tagName === nodeAfter.tagName) {
  //
  //         [nodeBefore, nodeAfter] = this.join(nodeBefore, nodeAfter);
  //
  //       }
  //
  //       range.selectNodeContents(nodeBefore);
  //       range.collapse(false);
  //
  //       nodeBefore.parentNode.normalize();
  //
  //       return false;
  //
  //     }
  //
  //     while (nodeBefore && !this.isBlock(nodeBefore)) {
  //
  //       nodeBefore = nodeBefore.lastChild;
  //
  //     }
  //
  //     if (nodeBefore) {
  //
  //       if (this.isEmpty(backNode)) {
  //
  //         backNode.remove();
  //
  //         // if (this.isEmpty(nodeAfter)) {
  //         //
  //         //   nodeAfter.remove();
  //         //
  //         // }
  //
  //         while (nodeBefore.lastChild) {
  //
  //           nodeBefore = nodeBefore.lastChild;
  //
  //         }
  //
  //         range.selectNodeContents(nodeBefore);
  //         range.collapse(false);
  //
  //         // return true;
  //
  //       } else {
  //
  //         let [leftNode, rightNode] = this.join(nodeBefore, backNode);
  //
  //         while (this.isElement(leftNode) && this.isElement(rightNode) && leftNode.tagName === rightNode.tagName) {
  //
  //           [leftNode, rightNode] = this.join(leftNode, rightNode);
  //
  //         }
  //
  //         range.selectNodeContents(leftNode);
  //         range.collapse(false);
  //
  //         leftNode.parentNode.normalize();
  //
  //       }
  //
  //       if (nodeAfter && nodeAfter !== backNode && this.isEmpty(nodeAfter)) {
  //
  //         nodeAfter.remove();
  //
  //       }
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

  // deleteBKP(range) {
  //
  //   if (!range.collapsed) {
  //
  //     while (range.startOffset === 0 && range.startContainer !== range.commonAncestorContainer) {
  //
  //       range.setStartBefore(range.startContainer);
  //
  //     }
  //
  //     while (range.endOffset === 0 && range.endContainer !== range.commonAncestorContainer) {
  //
  //       range.setEndBefore(range.endContainer);
  //
  //     }
  //
  //     let nodeRemoved = range.commonAncestorContainer;
  //
  //     const content = range.deleteContents();
  //
  //     if (range.commonAncestorContainer !== this.element && this.isEmpty(range.commonAncestorContainer)) {
  //
  //       range.selectNode(range.commonAncestorContainer);
  //       range.deleteContents();
  //
  //       return true;
  //
  //     }
  //
  //
  //
  //     if (!this.isText(range.startContainer)) { // -> bridge
  //
  //       let nodeBefore = range.startContainer.childNodes[range.startOffset-1];
  //       let nodeAfter = range.startContainer.childNodes[range.startOffset];
  //
  //       while (nodeBefore && this.isContainer(nodeBefore) && nodeBefore.lastChild) {
  //
  //         nodeBefore = nodeBefore.lastChild;
  //
  //       }
  //
  //       while (nodeBefore && nodeAfter && this.isJoinable(nodeBefore, nodeAfter)) {
  //
  //         [nodeBefore, nodeAfter] = this.join(nodeBefore, nodeAfter);
  //
  //       }
  //
  //       if (nodeBefore) {
  //
  //         range.setStartAfter(nodeBefore);
  //
  //       } else if (nodeAfter) {
  //
  //         range.setStartBefore(nodeAfter);
  //
  //       }
  //
  //       range.collapse(true);
  //
  //       range.startContainer.normalize();
  //
  //     }
  //
  //     if (!this.element.firstChild) {
  //
  //       const p = this.createEmpty("p");
  //       range.insertNode(p);
  //       range.setStart(p, 0);
  //       range.collapse(true);
  //
  //     }
  //
  //     return true;
  //
  //   }
  //
  //   if (this.isEmpty(this.element)) {
  //
  //     return true; // -> prevent default BUT should not save!
  //
  //   } else if (this.isText(range.startContainer) && range.startOffset > 0) {
  //
  //     return false;
  //
  //   } else {
  //
  //     while (range.startOffset === 0 && !this.isRoot(range.startContainer)) {
  //
  //       range.setStartBefore(range.startContainer);
  //
  //     }
  //
  //     let nodeAfter = range.startContainer.childNodes[range.startOffset];
  //     let nodeBefore = range.startContainer.childNodes[range.startOffset - 1];
  //
  //     while (this.isContainer(nodeBefore)) {
  //
  //       nodeBefore = nodeBefore.lastChild;
  //
  //     }
  //
  //     if (nodeBefore && nodeAfter && this.isJoinable(nodeBefore, nodeAfter)) {
  //
  //       while (nodeBefore && nodeAfter && this.isJoinable(nodeBefore, nodeAfter)) {
  //
  //         [nodeBefore, nodeAfter] = this.join(nodeBefore, nodeAfter);
  //
  //       }
  //
  //       if (nodeBefore) {
  //
  //         range.setStartAfter(nodeBefore);
  //
  //       } else if (nodeAfter) {
  //
  //         range.setStartBefore(nodeAfter);
  //
  //       }
  //
  //       range.collapse(true);
  //
  //       range.startContainer.normalize();
  //
  //       return true;
  //
  //     } else {
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

      let node = range.startContainer

      // while (!this.isRoot(node) && this.isEmpty(node)) {
      //
      //   const parent = node.parentNode;
      //
      //   parent.removeChild(node);
      //
      //   node = parent;
      //
      // }

      node.parentNode.normalize();

      range.collapse(true);

      if (!this.element.hasChildNodes()) {

        this.reset()

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
      // return true;


      return false;

    } else if (range.startOffset > 0) { // => between 2 nodes

      // let nodeBefore = range.startContainer.childNodes[range.startOffset-1];
      //
      // while (nodeBefore) {
      //
      //   range.selectNodeContents(nodeBefore);
      //   range.collapse(false);
      //
      //   nodeBefore = nodeBefore.lastChild;
      //
      // }
      //
      // return this.delete();
      //
      // return false;



      let nodeBefore = range.startContainer.childNodes[range.startOffset-1];

      while (!this.isSingle(nodeBefore) && !this.isText(nodeBefore) && nodeBefore.lastChild) {

        nodeBefore = nodeBefore.lastChild;

      }

      if (this.isText(nodeBefore) && nodeBefore.length > 0) {

        range.selectNodeContents(nodeBefore);
        range.setStart(range.startContent, range.startOffset-1);
        range.deleteContents();

      } else {

        range.selectNode(nodeBefore);
        range.deleteContents();

      }

      return true;

    } else { // => at start of node (text or element)

      let node = range.startContainer;

      while (node === node.parentNode.firstChild && !this.isRoot(node.parentNode) && !this.isBlock(node)) {

        node = node.parentNode;

      }

      if (this.isText(node)) { // -> actually never happens

        node.parentNode.normalize();

        return false;

      } else if (this.isInline(node)) { // -> actually never happens

        // if (node.previousSibling && node.previousSibling.tagName === node.tagName) {
        //
        //   this.join(node.previousSibling, node);
        //
        //   node.parentNode.normalize();
        //
        // }

        node.parentNode.normalize();

        return false;

      } else if (this.isBlock(node)) {

        let rightNode = node;

        while (!node.previousSibling && !this.isRoot(node)) {

          node = node.parentNode;

        }

        let leftNode = node.previousSibling;

        while (leftNode && !this.isBlock(leftNode)) {

          leftNode = leftNode.lastChild;

        }

        if (leftNode) {

          [leftNode, rightNode] = this.join(leftNode, rightNode);

          while (leftNode && rightNode && this.isInline(leftNode) && this.isInline(rightNode) && leftNode.tagName === rightNode.tagName) {

            [leftNode, rightNode] = this.join(leftNode, rightNode);

          }

          // if (leftNode) {
          //
          //   range.setStartAfter(leftNode);
          //   range.collapse(true);
          //
          //   leftNode.parentNode.normalize();
          //
          // } else if (rightNode) {
          //
          //   range.setStartBefore(rightNode);
          //   range.collapse(true);
          //
          //   rightNode.parentNode.normalize();
          //
          // }

          if (rightNode) {

            range.setStartBefore(rightNode);
            range.collapse(true);

            let node = rightNode;

            while (node && !this.isSingle(node)) {

              range.setStart(node, 0);
              range.collapse(true);

              node = node.firstChild;

            }

            rightNode.parentNode.normalize();

          } else if (leftNode) {

            range.setStartAfter(leftNode);
            range.collapse(true);

            let node = leftNode;

            while (node && !this.isSingle(node)) {

              range.selectNodeContents(node);
              range.collapse(false);

              node = node.lastChild;

            }

            leftNode.parentNode.normalize();

          }

					return true;

				} else {

					return false;
				}



      } else if (this.isContainer(node)) {

        let rightNode = node;

        while (!node.previousSibling && !this.isRoot(node)) {

          node = node.parentNode;

        }

        let leftNode = node.previousSibling;

        if (this.isEmpty(rightNode)) {

          rightNode.remove();

        }

        if (leftNode) {

          while (leftNode.lastChild) {

            leftNode = leftNode.lastChild;

          }

          range.selectNodeContents(leftNode);
          range.collapse(false);

        }

        return false;

      }

    }

    return false;

  }

  insert(range, ...nodes) {

    console.log("deprecated");

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

  // insertAtBKP(range, node) {
  //
  //   if (this.isInline(node) || this.isText(node) || this.isSingle(node)) {
  //
  //     this.insertInlineAt(range, node);
  //
  //   } else {
  //
  //     this.insertContainerAt(range, node);
  //
  //   }
  //
  // }

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


  // insertAt(range, node) {
  //
  //   if (!range.collapsed) {
  //
  //     this.delete(range);
  //
  //   }
  //
  //   if (this.isInline(node) || this.isText(node) || this.isSingle(node)) {
  //
  //     if (this.isText(range.startContainer) || this.isInline(range.startContainer) || this.isBlock(range.startContainer)) {
  //
  //       if (this.isBlock(range.startContainer) && this.isEmpty(range.startContainer)) {
  //
  //         range.selectNodeContents(range.startContainer);
  //         range.deleteContents();
  //
  //       }
  //
  //       range.insertNode(node);
  //       range.setStartAfter(node);
  //       range.collapse(true);
  //
  //       range.startContainer.normalize();
  //
  //     } else if (this.isContainer(range.startContainer)) { // -> create new block and insert into
  //
  //       let tag = this.getChildTag(range.startContainer);
  //
  //       while (!tag) { // e.g FIGURE
  //
  //         range.setStartAfter(range.startContainer);
  //         range.collapse(true);
  //
  //         tag = this.getChildTag(range.startContainer);
  //
  //       }
  //
  //       const block = document.createElement(tag);
  //
  //       block.appendChild(node);
  //
  //       range.insertNode(block);
  //       range.setStartAfter(node);
  //       range.collapse(true);
  //
  //       block.normalize();
  //
  //     }
  //
  //   } else if (this.isBlock(node)) {
  //
  //     if (this.isText(range.startContainer) || this.isInline(range.startContainer) || this.isBlock(range.startContainer)) {
  //
  //       while (!this.isContainer(range.endContainer) && !this.isRoot(range.endContainer)) {
  //
  //         range.setEndAfter(range.endContainer);
  //
  //       }
  //
  //       const contents = range.extractContents();
  //
  //       range.insertNode(node);
  //
  //       range.setStartAfter(node);
  //       range.collapse(true);
  //
  //       if (!this.isEmpty(contents)) {
  //
  //         range.insertNode(contents);
  //
  //       }
  //
  //       range.selectNodeContents(node);
  //       range.collapse(false);
  //
  //
  //       // if (this.isBlock(range.startContainer) && this.isEmpty(range.startContainer)) {
  //       //
  //       //   range.selectNodeContents(range.startContainer);
  //       //   range.deleteContents();
  //       //
  //       // }
  //       //
  //       // let child = node.firstChild;
  //       //
  //       // while (child) {
  //       //
  //       //   range.insertNode(child);
  //       //   range.setStartAfter(child);
  //       //   range.collapse(true);
  //       //
  //       //   child = node.firstChild;
  //       //
  //       // }
  //       //
  //       // range.startContainer.normalize();
  //
  //     } else if (this.isContainer(range.startContainer)) {
  //
  //       if (this.isValidIn(node, range.startContainer)) {
  //
  //         range.insertNode(node);
  //         range.collapse(false);
  //
  //       } else { // -> split container and insert below inbetween
  //
  //         while (!this.isValidIn(node, range.endContainer) && !this.isRoot(range.endContainer)) {
  //
  //           range.setEndAfter(range.endContainer);
  //
  //         }
  //
  //         let content = range.extractContents();
  //
  //         const nodeBefore = range.endContainer.childNodes[range.endOffset - 1];
  //
  //         if (nodeBefore && this.isEmpty(nodeBefore)) { // -> node before is left empty
  //
  //           range.selectNode(nodeBefore);
  //           range.deleteContents();
  //
  //         }
  //
  //         if (!this.isValidIn(node, range.startContainer)) { // -> this is root and node is not allowed!
  //
  //           const p = document.createElement("p");
  //
  //           while (node.firstChild) {
  //
  //             p.appendChild(node.firstChild);
  //
  //           }
  //
  //           node = p;
  //
  //         }
  //
  //         range.insertNode(node);
  //         range.collapse(false);
  //
  //         if (!this.isEmpty(content)) {
  //
  //           range.insertNode(content);
  //
  //         }
  //
  //         range.setStartAfter(node);
  //         range.collapse(true);
  //
  //       }
  //
  //       // let tag = this.getChildTag(range.startContainer);
  //       //
  //       // while (!tag && !this.isRoot(range.startContainer)) { // -> e.g. container is FIGURE
  //       //
  //       //   range.setStartAfter(range.startContainer);
  //       //   range.collapse(true);
  //       //
  //       //   tag = this.getChildTag(range.startContainer);
  //       //
  //       // }
  //       //
  //       // const p = document.createElement(tag || "p");
  //       //
  //       // let child = node.firstChild;
  //       //
  //       // while (child) {
  //       //
  //       //   p.appendChild(child);
  //       //
  //       //   child = node.firstChild;
  //       //
  //       // }
  //       //
  //       // range.insertNode(p);
  //       // range.setStartAfter(p);
  //       // range.collapse(true);
  //       //
  //       // p.normalize();
  //
  //     }
  //
  //   } else if (this.isContainer(node)) {
  //
  //     if (this.isText(range.startContainer) || this.isInline(range.startContainer) || this.isBlock(range.startContainer)) {
  //
  //       // -> find next suitable container
  //
  //       while (!this.isRoot(range.endContainer) && !this.isContainer(range.endContainer) && !this.isValidIn(node, range.endContainer)) {
  //
  //         range.setEndAfter(range.endContainer);
  //
  //       }
  //
  //       // if (!this.isValidIn(node, range.endContainer)) {
  //       //
  //       //   // convert into p?
  //       //
  //       // }
  //
  //       // cut the rest
  //
  //       const content = range.extractContents();
  //
  //       range.insertNode(node);
  //       range.setStartAfter(node);
  //       range.collapse(true);
  //
  //       if (!this.isEmpty(content)) { // put the rest after if not empty
  //
  //         range.insertNode(content);
  //
  //       }
  //
  //       if (node.previousSibling && this.isEmpty(node.previousSibling)) { // clear node before if empty
  //
  //         node.previousSibling.remove();
  //
  //       }
  //
  //       range.setStartAfter(node);
  //       range.collapse(true);
  //
  //
  //     } else if (this.isContainer(range.startContainer)) {
  //
  //       while (!this.isRoot(range.endContainer) && !this.isContainer(range.endContainer) && !this.isValidIn(node, range.endContainer)) {
  //
  //         range.setStartAfter(range.endContainer);
  //
  //       }
  //
  //       // if (!this.isValidIn(node, range.endContainer)) {
  //       //
  //       //   // convert into p?
  //       //
  //       // }
  //
  //       range.collapse(true);
  //       range.insertNode(node);
  //
  //       if (node.previousSibling && this.isEmpty(node.previousSibling)) {
  //
  //         node.previousSibling.remove();
  //
  //       }
  //
  //       range.setStartAfter(node);
  //       range.collapse(true);
  //
  //     }
  //
  //
  //   }
  //
  //   this.sanitize(node);
  //
  // }

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
  //   const rangeBefore = range.cloneRange();
  //
  //   while (!this.isValidIn(container, rangeBefore.startContainer) && !this.isRoot(rangeBefore.startContainer)) {
  //
  //     rangeBefore.setStartBefore(rangeBefore.startContainer);
  //
  //   }
  //
  //   const rangeAfter = range.cloneRange();
  //
  //   while (!this.isValidIn(container, rangeAfter.endContainer) && !this.isRoot(rangeAfter.endContainer)) {
  //
  //     rangeAfter.setEndAfter(rangeAfter.endContainer);
  //
  //   }
  //
  //   const contentBefore = rangeBefore.extractContents();
  //   const contentAfter = rangeAfter.extractContents();
  //
  //   range.setStart(rangeBefore.startContainer, rangeBefore.startOffset);
  //   range.setEnd(rangeAfter.endContainer, rangeAfter.endOffset);
  //
  //   range.deleteContents();
  //
  //
  //
  //   if (!this.isEmpty(contentBefore)) {
  //
  //     range.insertNode(contentBefore);
  //     range.collapse(false);
  //
  //   }
  //
  //   range.insertNode(container);
  //   range.collapse(false);
  //
  //   if (!this.isEmpty(contentAfter)) {
  //
  //     range.insertNode(contentAfter);
  //     range.collapse(true);
  //
  //   }
  //
  //   range.selectNode(container);
  //
  // }

  insertContainerAt(range, container) {

    if (!range.collapsed) {

      range.deleteContents();

    }

    while (!this.isValidIn(container, range.endContainer) && !this.isRoot(range.endContainer)) {

      range.setEndAfter(range.endContainer);

    }

    const contentAfter = range.extractContents();

    range.collapse(false);

    range.insertNode(container);

    if (container.previousSibling && this.isEmpty(container.previousSibling)) {

      container.previousSibling.parentNode.removeChild(container.previousSibling);

    }

    if (container.nextSibling && this.isEmpty(container.nextSibling)) {

      container.nextSibling.parentNode.removeChild(container.nextSibling);

    }

    if (!this.isEmpty(contentAfter)) {

      range.collapse(false);
      range.insertNode(contentAfter);

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


  insertAfter(nodeBefore, ...nodes) {

    console.log("deprecated");

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

  sanitizeNodeAttributes(node) {

    const attributes = [...node.attributes];

    for (let attribute of attributes) {

      if (!this.isValidAttribute(node, attribute.name, attribute.value)) {

        node.removeAttribute(attribute.name);

      }

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

    // if (this.isElement(node)) {
    //
    //   for (let child of node.childNodes) {
    //
    //     if (!this.isValidIn(child, node)) {
    //
    //       return child;
    //
    //     }
    //
    //     const invalidChild = this.findInvalidNode(child);
    //
    //     if (invalidChild) {
    //
    //       return invalidChild;
    //
    //     }
    //
    //   }
    //
    // }

    if (!this.isValid(node)) {

      return node;

    }

    if (this.isElement(node)) {

      for (let child of node.childNodes) {

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

  sanitize(container) {


    // let invalidNode = this.findInvalidNode(node || this.element);
    //
    // while (invalidNode) {
    //
    //   this.fixNode(invalidNode, node || this.element);
    //
    //   invalidNode = this.findInvalidNode(node || this.element);
    //
    // }

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

        if (!this.isValidIn(node, node.parentNode) || node.tagName === "DIV" || node.tagName === "SPAN") {

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

  // extractAt(range) {
  //
  //   const content = range.extractContents();
  //
  //   this.deleteAt(range);
  //
  //   if (this.isText(range.commonAncestorContainer) || this.isInline(range.commonAncestorContainer) || this.isBlock(range.commonAncestorContainer)) {
  //
  //
  //
  //     range.commonAncestorContainer.normalize();
  //
  //
  //
  //   }
  //
  // }



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

  toggleList(range, tagName) {

    let listNodes = this.getNodesAt(range).filter(node => node.tagName === "UL" || node.tagName === "OL");

    if (listNodes.length) {

      if (listNodes[0].tagName === tagName.toUpperCase()) {

        for (let node of listNodes) {

          const paragraphs = this.unwrapList(node);

          if (paragraphs.length) {

            range.setStartBefore(paragraphs[0]);
            range.setEndAfter(paragraphs[paragraphs.length - 1]);

          }

        }

      } else {

        for (let node of listNodes) {

          this.updateNode(node, tagName);

        }

      }

    } else {

      this.wrapListAt(range, tagName);

    }

  }

  isListAt(range, tagName = "UL") {

    for (let node of this.listNodesAt(range)) {

      if (node.tagName === tagName) {

        return true;

      }

    }

    return false;
  }

  insertList(range, tagName) {

    console.error("deprecated");

    // let listNode = this.getNodeByTags(range, "ul", "ol");
    // let listNodes = [...this.getNodesAt(range, node => node.tagName === "UL" || node.tagName === "OL")];

    if (this.hasNodeAt(range, node => node.tagName === "UL" || node.tagName === "OL")) {

      let listNodes = [...this.getNodesAt(range, node => node.tagName === "UL" || node.tagName === "OL")];

      for (let listNode of listNodes) {

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

          range.selectNodeContents(newListNode);

        }

      }

    } else {

      let listNode = document.createElement(tagName);

      if (range.collapsed) {

        const li = this.createEmpty("li");

        listNode.appendChild(li);

        this.insertAt(range, listNode);

        range.setStart(li, 0);
        range.collapse(true);

      } else {

        const content = range.extractContents();

        let node = content.firstChild;

        while (node) {

          if (this.isBlock(node)) {

            const item = document.createElement("li");

            while (node.firstChild) {

              item.appendChild(node.firstChild);

            }

            listNode.appendChild(item);

          }

          node = this.getNextNode(node);

        }

        this.insertAt(range, listNode);
        range.selectNodeContents(listNode);

      }

    }

  }

  toggleHeading(range, tagName) {

    let nodes = this.getNodesAt(range).filter(node => this.isHeading(node));

    if (nodes.length) {

      for (let node of nodes) {

        this.updateNode(node, "p");

      }

      range.setStartBefore(nodes[0]);
      range.setEndAfter(nodes[nodes.length-1]);

    } else if (!range.collapsed) {

      this.wrapBlockAt(range, tagName || "h1");

    }

  }

  isHeadingAt(range) {

    for (let node of this.listNodesAt(range)) {

      if (this.isHeading(node)) {

        return true;

      }

    }

    return false;
  }

  getHeadingAt(range) {

    for (let node of this.listNodesAt(range)) {

      if (this.isHeading(node)) {

        return node;

      }

    }

  }

  toggleBoldAt(range) {

		const nodes = this.getNodesAt(range).filter(node => node.tagName === "B" || node.tagName === "STRONG");

		if (nodes.length) {

			for (let node of nodes) {

				this.unwrapNode(node);

			}

		} else {

			this.wrapInlineAt(range, "b");

		}

  }

  isBoldAt(range) {

    for (let node of this.listNodesAt(range)) {

      if (node.tagName === "B" || node.tagName === "STRONG") {

        return true;

      }

    }

    return false;
  }

  toggleItalicAt(range) {

		const nodes = this.getNodesAt(range).filter(node => node.tagName === "I" || node.tagName === "EM");

		if (nodes.length) {

			for (let node of nodes) {

				this.unwrapNode(node);

			}

		} else {

			this.wrapInlineAt(range, "i");

		}

  }

  isItalicAt(range) {

    for (let node of this.listNodesAt(range)) {

      if (node.tagName === "I" || node.tagName === "EM") {

        return true;

      }

    }

    return false;
  }

  isLinkAt(range) {

    for (let node of this.listNodesAt(range)) {

      if (node.tagName === "A") {

        return true;

      }

    }

    return false;

  }

  getLinkAt(range) {

    for (let node of this.listNodesAt(range)) {

      if (node.tagName === "A") {

        return node;

      }

    }

  }

  unlinkAt(range) {

    const link = this.getLinkAt(range);

    if (link) {

      this.unwrapNode(link);

    }

  }


  insertHeading(range, tagName) {

    console.error("deprecated");

    let nodes = [...this.getNodesAt(range, node => ["H1", "H2", "H3", "H4", "H5", "H6"].includes(node.tagName))];

    if (nodes.length) {

      if (nodes[0].tagName === tagName.toUpperCase()) {

        tagName = "p";

      }

      for (let node of nodes) {

        const hNode = document.createElement(tagName);

        while (node.firstChild) {

          hNode.appendChild(node.firstChild);

        }

        node.replaceWith(hNode);

        range.selectNodeContents(hNode);

      }

    } else if (!range.collapsed) {

      // const content = range.extractContents();
      //
      // const contentRange = new Range();
      // contentRange.selectNodeContents(content);
      //
      // nodes = [...this.getNodesAt(contentRange, node => this.isBlock(node))];

      nodes = [...this.getNodesAt(range, node => this.isBlock(node))];

      for (let node of nodes) {

        range.selectNode(node);
        range.deleteContents();
        // range.collapse(false);

        const hNode = document.createElement(tagName);

        while (node.firstChild) {

          hNode.appendChild(node.firstChild);

        }

        this.insertAt(range, hNode);

        range.selectNodeContents(hNode);

      }

    }


    // let node = this.getNodeByTags(range, "h1", "h2", "h3", "h4", "h5", "h6");
    //
    // if (node) {
    //
    //   if (node.tagName === tagName.toUpperCase()) {
    //
    //     tagName = "p";
    //
    //   }
    //
    //   const newNode = document.createElement(tagName);
    //
    //   range.selectNode(node);
    //   range.deleteContents();
    //
    //   while (node.firstChild) {
    //
    //     newNode.appendChild(node.firstChild);
    //
    //   }
    //
    //   this.insertAt(range, newNode);
    //
    // } else {
    //
    //   if (!range.collapsed) {
    //
    //     this.selectDown(range);
    //
    //     const content = range.extractContents();
    //
    //     for (let child of content.childNodes) {
    //
    //       if (!this.isEmpty(child)) {
    //
    //         const heading = document.createElement(tagName);
    //
    //         while (child.firstChild) {
    //
    //           heading.appendChild(child.firstChild);
    //
    //         }
    //
    //         this.insertAt(range, heading);
    //
    //       }
    //
    //     }
    //
    //   }
    //
    // }

  }

  insertFigure(range, figure) {

    // const node = this.getNodeByTags(range, "figure");
    //
    // if (node) {
    //
    //   range.selectNode(node);
    //
    // }
    //
    // this.insertAt(range, figure);
    // range.selectNode(figure);

    this.insertContainerAt(range, figure);

  }

  updateNodeByTag(range, tagName, params = {}) {

    console.error("deprecated");

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

    console.error("deprecated");

    let node = this.getNodeByTags(range, tagName);

    if (node) {

      this.unwrapNode(node);

    } else {

      this.wrap(range, tagName);

    }

  }

  updateNodeParams(node, params = {}) {

    console.error("deprecated");

    for (let attribute of node.attributes) {

      node.removeAttributeNode(attribute);

    }

    for (let key in params) {

      if (params[key]) {

        node.setAttribute(key, params[key]);

      }

    }

  }

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

		const {tags, type, validIn, breakMode} = args;

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
	validInTags: ["DIV"]
});

KarmaFieldsAlpha.Editor.register([
	"FIGURE"
], {
	type: "container",
	validInTags: ["DIV"]
});

KarmaFieldsAlpha.Editor.register([
	"UL",
	"OL"
], {
	type: "container",
	validInTags: ["DIV"]
});

KarmaFieldsAlpha.Editor.register([
	"TABLE"
], {
	type: "container",
	validInTags: ["DIV"]
});

KarmaFieldsAlpha.Editor.register([
	"TBODY",
	"THEAD",
	"TFOOTER"
], {
	type: "container",
	validInTags: ["TABLE"]
});

KarmaFieldsAlpha.Editor.register([
	"TR"
], {
	type: "container",
	validInTags: ["TABLE", "TBODY", "THEAD", "TFOOTER"]
});


// BLOCKS

KarmaFieldsAlpha.Editor.register([
	"TH",
	"TD"
], {
	type: "container",
	validInTags: ["TR"],
	breakMode: "cell"
});

KarmaFieldsAlpha.Editor.register([
	"FIGCAPTION"
], {
	type: "inline",
	validInTags: ["FIGURE"],
	breakMode: "cell"
});

KarmaFieldsAlpha.Editor.register([
	"P"
], {
	type: "single",
	validInTags: ["DIV"],
	breakMode: "paragraph"
});

KarmaFieldsAlpha.Editor.register([
	"BLOCKQUOTE"
], {
	type: "single",
	validInTags: ["DIV"],
	breakMode: "list-item"
});

KarmaFieldsAlpha.Editor.register([
	"LI"
], {
	type: "single",
	validInTags: ["UL", "OL"],
	breakMode: "list-item"
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
	breakMode: "header"
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
	validAttribtues: ["src", "width", "height", "srcset", "sizes", "alt", "title"]
});

KarmaFieldsAlpha.Editor.register([
	"VIDEO"
], {
	type: "single",
	validInTags: ["P", "FIGURE"],
	validAttribtues: ["src", "width", "height", "alt", "title", "autoplay", "loop", "controls"]
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
