
KarmaFieldsAlpha.Editor.Range = class {

	getPathesAt(range, container) {

    if (range.collapsed) {

      return [this.getPathFromPoint(range.startContainer, range.startOffset, container)];

    } else {

      return [
        this.getPathFromPoint(range.startContainer, range.startOffset, container),
        this.getPathFromPoint(range.endContainer, range.endOffset, container)
      ];

    }

  }

  getPathFromPoint(node, index, container) {

    const path = [index];

		while (node !== container) {

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


	getPointFromPath(path, container) {

    let nodePath = path.slice(0, -1);
    let node = container;
    let depth = 0;
    let offset = path[path.length - 1];

		while (node.nodeType === 1 && depth < nodePath.length && node.firstChild) {

      node = node.firstChild;

      for (let i = 0; i < nodePath[depth]; i++) {

        if (node.nextSibling) {

          node = node.nextSibling;

        }

      }

      depth++;

    }

    if (node.nodeType === 1) {

      offset = Math.min(node.childNodes.length, offset);

    } else {

      offset = Math.min(node.length, offset);

    }

    return [node, offset];

  }

	getRangeFromPathes(pathes, range, container) {

    if (!range) {

      range = new Range();

    }

    if (pathes[0]) {

      range.setStart(...this.getPointFromPath(pathes[0], container));

    }

    if (pathes[1]) {

      range.setEnd(...this.getPointFromPath(pathes[1], container));

    } else {

      range.collapse(true);

    }

    return range;

  }



}
