KarmaFieldsAlpha.ListSorterInline = class extends KarmaFieldsAlpha.ListSorter {

  constructor(container, selection) {

    super(container, selection);

    this.swapers = [
      this.swapBefore,
      this.swapAfter
    ];

  }

  swapBefore (children, translateX, translateY) {

    const pivot = children[this.state.selection.index - 1];

    if (pivot) {

      const elements = children.slice(this.state.selection.index, this.state.selection.index + this.state.selection.length);
      const selectionBox = this.getElementBox(...elements);
      const pivotBox = pivot && this.getElementBox(pivot);
      const isAbove = selectionBox.y + selectionBox.height/2 + translateY < pivotBox.y && children.slice(0, this.state.selection.index).some(element => element.offsetTop < selectionBox.y);
      const isBefore = selectionBox.x + translateX < pivotBox.x + pivotBox.width/2 && selectionBox.y + selectionBox.height/2 + translateY < pivotBox.y + pivotBox.height;

      if (isBefore || isAbove) {

        this.insertElements(this.container, elements, pivot);

        this.state = {
          selection: {
            index: this.state.selection.index - 1,
            length: this.state.selection.length
          }
        };

        return true;

      }

    }

  }

  swapAfter (children, translateX, translateY) {

    const pivot = children[this.state.selection.index + this.state.selection.length];

    if (pivot) {

      const elements = children.slice(this.state.selection.index, this.state.selection.index + this.state.selection.length);
      const selectionBox = this.getElementBox(...elements);
      const pivotBox = pivot && this.getElementBox(pivot);
      const isBelow = selectionBox.y + selectionBox.height/2 + translateY > pivotBox.y + pivotBox.height && children.slice(this.state.selection.index + this.state.selection.length).some(element => element.offsetTop > selectionBox.y);
      const isAfter = selectionBox.x + selectionBox.width + translateX > pivotBox.x + pivotBox.width/2 && selectionBox.y + selectionBox.height/2 + translateY > pivotBox.y;

      if (isAfter || isBelow) {

        this.insertElements(this.container, elements, pivot.nextElementSibling);

        this.state = {
          selection: {
            index: this.state.selection.index + 1,
            length: this.state.selection.length
          }
        };

        return true;

      }

    }

  }


}



// KarmaFieldsAlpha.ListSorter = class extends KarmaFieldsAlpha.ListPicker {
//
//   constructor(container) {
//
//     super(container);
//
//     this.swapers = [
//       this.swapBefore,
//       this.swapAfter
//     ];
//
//   }
//
//   start(index) {
//
//     if (index > -1 && this.selection && KarmaFieldsAlpha.Segment.contain(this.selection, index)) {
//
//       this.dragging = true;
//
//       this.startDrag(index);
//
//       this.event.stopPropagation();
//
//     } else { // -> selecting
//
//       super.start(index);
//
//     }
//
//   }
//
//   move(index) {
//
//     if (this.dragging) {
//
//       this.drag();
//
//     } else {
//
//       super.move(index); // -> grow selection
//
//     }
//
//
//   }
//
//   end() {
//
//     if (this.dragging) {
//
//       this.dragging = false;
//
//       this.endDrag();
//
//     } else {
//
//       super.end();
//
//     }
//
//   }
//
//
//
//   startDrag(index) {
//
//     this.originX = this.x;
//     this.originY = this.y;
//
//     const elements = this.slice(this.selection.index, this.selection.length);
//
//     this.originPosition = this.getPosition(elements);
//
//     this.originIndex = this.selection.index;
//     this.lastIndex = this.selection.index;
//     // this.originPath = this.path;
//
//     // this.indexOffset = index - this.selection.index;
//
//     elements.forEach(element => element.classList.add("drag"));
//
//     if (this.onStartDrag) {
//
//       this.onStartDrag(elements);
//
//     }
//
//     this.container.classList.add("dragging");
//
//   }
//
//   drag() {
//
//
//     let children = this.getChildren();
//     let elements = children.slice(this.selection.index, this.selection.index + this.selection.length);
//
//     if (!elements.length) {
//
//       return;
//
//     }
//
//     let translate = this.getTranslate(elements);
//
//     if (this.swapers.some(swaper => swaper.call(this, children, translate.x, translate.y))) {
//
//       if (this.onUnselect) {
//
//         this.onUnselect(this.selection, elements);
//
//       }
//
//       if (this.onSwap) {
//
//         this.onSwap(this.lastIndex, this.selection.index, this.selection.length, this.lastPath, this.path);
//
//       }
//
//       this.lastIndex = this.selection.index;
//       this.lastPath = this.path;
//
//       children = this.getChildren();
//       elements = children.slice(this.selection.index, this.selection.index + this.selection.length);
//
//       translate = this.getTranslate(elements);
//
//       if (this.onSelect) {
//
//         this.onSelect(this.selection, elements);
//
//       }
//
//     }
//
//     elements.forEach(element => element.style.transform = `translate(${translate.x}px, ${translate.y}px)`);
//
//   }
//
//   swapBefore (children, translateX, translateY) {
//
//     const pivot = children[this.selection.index - 1];
//
//     if (pivot) {
//
//       const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);
//       const selectionBox = this.getElementBox(...elements);
//       const pivotBox = pivot && this.getElementBox(pivot);
//       const isAbove = selectionBox.y + selectionBox.height/2 + translateY < pivotBox.y && children.slice(0, this.selection.index).some(element => element.offsetTop < selectionBox.y);
//       const isBefore = selectionBox.x + translateX < pivotBox.x + pivotBox.width/2 && selectionBox.y + selectionBox.height/2 + translateY < pivotBox.y + pivotBox.height;
//
//       if (isBefore || isAbove) {
//
//         this.insertElements(this.container, elements, pivot);
//
//         this.selection = {
//           index: this.selection.index - 1,
//           length: this.selection.length
//         };
//
//         return true;
//
//       }
//
//     }
//
//   }
//
//   swapAfter (children, translateX, translateY) {
//
//
//     const pivot = children[this.selection.index + this.selection.length];
//
//     if (pivot) {
//
//       const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);
//       const selectionBox = this.getElementBox(...elements);
//       const pivotBox = pivot && this.getElementBox(pivot);
//       const isBelow = selectionBox.y + selectionBox.height/2 + translateY > pivotBox.y + pivotBox.height && children.slice(this.selection.index + this.selection.length).some(element => element.offsetTop > selectionBox.y);
//       const isAfter = selectionBox.x + selectionBox.width + translateX > pivotBox.x + pivotBox.width/2 && selectionBox.y + selectionBox.height/2 + translateY > pivotBox.y;
//
//       if (isAfter || isBelow) {
//
//         this.insertElements(this.container, elements, pivot.nextElementSibling);
//
//         this.selection = {
//           index: this.selection.index + 1,
//           length: this.selection.length
//         };
//
//         return true;
//
//       }
//
//     }
//
//   }
//
//   endDrag() {
//
//     const elements = this.slice(this.selection.index, this.selection.length);
//
//     elements.forEach(element => {
//       element.classList.remove("drag");
//       element.style.transform = "none";
//     });
//
//     this.container.classList.remove("dragging");
//
//     if (this.onsort) {
//
//       this.onsort(this.originIndex, this.selection.index, this.selection.length);
//
//     }
//
//   }
//
//   getTranslate(elements) {
//
//     const position = this.getPosition(elements);
//
//     return {
//       x: this.x - this.originX + this.originPosition.x - position.x,
//       y: this.y - this.originY + this.originPosition.y - position.y
//     };
//
//   }
//
//
//   getPosition(elements) {
//
//     const position = {
//       x: elements[0].offsetLeft,
//       y: elements[0].offsetTop
//     };
//
//     // let container = this.container;
//     //
//     // while (container && this.root && container !== this.root) {
//     //
//     //   position.x += container.offsetLeft;
//     //   position.y += container.offsetTop;
//     //
//     //   container = container.offsetParent;
//     //
//     // }
//
//     return position;
//
//   }
//
//
//   insertElements(container, elements, targetElement) {
//
//     if (targetElement) {
//
//       for (let element of elements) {
//
//         container.insertBefore(element, targetElement);
//
//       }
//
//     } else {
//
//       for (let element of elements) {
//
//         container.appendChild(element);
//
//       }
//
//     }
//
//   }
//
//
// }
