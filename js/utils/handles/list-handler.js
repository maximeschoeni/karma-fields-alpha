

KarmaFieldsAlpha.ListHandler = class extends KarmaFieldsAlpha.MotionTracker {

  getChildren() {

    return [...this.container.children];

  }

  findIndex(x, y) {

    const children = this.getChildren();

    for (let i = 0; i < children.length; i++) {

      const element = children[i];

      if (x >= element.offsetLeft && x < element.offsetLeft + element.clientWidth && y >= element.offsetTop && y < element.offsetTop + element.clientHeight) {

        return i;

      }

    }

    return -1;
  }

  slice(index, length) {

    const children = this.getChildren();

    return children.slice(index, index + length);

  }

  getBox(index, length = 1) {

    const children = this.getChildren();

    const first = children[index];
    const last = children[index + length - 1];

    if (first && last) {

      return {
        x: first.offsetLeft,
        y: first.offsetTop,
        width: last.offsetLeft + last.clientWidth - first.offsetLeft,
        height: last.offsetTop + last.clientHeight - first.offsetTop
      };

    }

  }

  // getElementBox(...elements) {
  //
  //   const box = {
  //     x: Infinity,
  //     y: Infinity,
  //     width: 0,
  //     height: 0
  //   };
  //
  //   for (let element of elements) {
  //
  //     box.x = Math.min(box.x, element.offsetLeft);
  //     box.y = Math.min(box.y, element.offsetTop);
  //     box.width = Math.max(box.width, element.offsetLeft + element.clientWidth - box.x);
  //     box.height = Math.max(box.height, element.offsetTop + element.clientHeight);
  //
  //   }
  //
  //   return box;
  // }


  getElementBox(...elements) {

    let left = Infinity;
    let top = Infinity;
    let right = 0;
    let bottom = 0;

    for (let element of elements) {

      left = Math.min(left, element.offsetLeft);
      top = Math.min(top, element.offsetTop);
      right = Math.max(right, element.offsetLeft + element.clientWidth);
      bottom = Math.max(bottom, element.offsetTop + element.clientHeight);

    }

    return {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top
    };

  }




  // insertElementsAt(container, elements, index) {
  //
  //   const children = this.getChildren();
  //
  //   const target = children[index];
  //
  //   if (target) {
  //
  //     for (let element of elements) {
  //
  //       container.insertBefore(element, target);
  //
  //     }
  //
  //   } else {
  //
  //     for (let element of elements) {
  //
  //       container.appendChild(element);
  //
  //     }
  //
  //   }
  //
  // }

  // getAbsolutePosition() {
  //
  //   const position = {x: 0, y: 0};
  //
  //   let container = this.container;
  //
  //   while (container && !container.classList.contains("block-root")) {
  //
  //     position.x += container.offsetLeft;
  //     position.y += container.offsetTop;
  //
  //     container = container.offsetParent;
  //
  //   }
  //
  //   return position;
  // }

  // insertElements(container, elements, targetElement) {
  //
  //   if (targetElement) {
  //
  //     for (let element of elements) {
  //
  //       container.insertBefore(element, targetElement);
  //
  //     }
  //
  //   } else {
  //
  //     for (let element of elements) {
  //
  //       container.appendChild(element);
  //
  //     }
  //
  //   }
  //
  // }

  removeElements(container, elements) {

    for (let element of elements) {

      element.remove();

    }

  }



  //
  // swapTop() {
  //
  //   const children = this.getChildren();
  //   const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);
  //
  //   const newIndex = this.selection.index - 1;
  //
  //   this.insertElements(this.container, elements, elements[0].previousElementSibling);
  //
  //   if (this.onSwap) {
  //
  //     this.onSwap(this.selection.index, newIndex, this.selection.length, this.path, this.path);
  //
  //   }
  //
  //   this.index = newIndex;
  //
  //   this.selection = {index: newIndex, length: this.selection.length};
  //
  // }
  //
  // swap(direction) {
  //
  //   const children = this.getChildren();
  //   const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);
  //
  //   let newIndex;
  //
  //   if (direction > 0) {
  //
  //     newIndex = this.selection.index + 1;
  //
  //     this.insertElements(this.container, elements, elements[elements.length-1].nextElementSibling.nextElementSibling);
  //
  //   } else {
  //
  //     newIndex = this.selection.index - 1;
  //
  //     this.insertElements(this.container, elements, elements[0].previousElementSibling);
  //
  //   }
  //
  //
  //
  //   if (this.onSwap) {
  //
  //     this.onSwap(this.selection.index, newIndex, this.selection.length, this.path, this.path);
  //
  //   }
  //
  //   this.index = newIndex;
  //
  //   this.selection = {index: newIndex, length: this.selection.length};
  //
  // }


}
