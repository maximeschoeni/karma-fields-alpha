
KarmaFieldsAlpha.ListSortBlock = class extends KarmaFieldsAlpha.ListSortHierarchy {

  constructor(container, selection, ...path) {

    super(container, selection, ...path);

    this.swapers = [
      this.swapLeft,
      this.swapRight,
      this.swapInAbove,
      this.swapInBelow,
      this.swapOutAbove,
      this.swapOutBelow,
      this.swapAbove,
      this.swapBelow
    ];

  }


  swapAbove (children, translateX, translateY) {

    const pivot = children[this.state.selection.index - 1];

    if (pivot && !pivot.classList.contains("block-group")) {

      const elements = this.slice(this.state.selection.index, this.state.selection.length);

      // if (this.clientDiffY < 0 && elements[0].offsetTop + translateY < pivot.offsetTop + pivot.clientHeight/2) {
      if (elements[0].offsetTop + translateY < pivot.offsetTop + pivot.clientHeight/2) {

        this.insertElements(this.container, elements, pivot);

        this.state = {
          ...this.state,
          selection: {
            index: this.state.selection.index - 1,
            length: this.state.selection.length
          }
        };

        return true;

      }

    }

  }

  swapBelow (children, translateX, translateY) {


    const pivot = children[this.state.selection.index + this.state.selection.length];

    if (pivot && !pivot.classList.contains("block-group")) {

      const elements = children.slice(this.state.selection.index, this.state.selection.index + this.state.selection.length);

      // if (this.clientDiffY > 0 && elements[elements.length-1].offsetTop + elements[elements.length-1].clientHeight + translateY > pivot.offsetTop + pivot.clientHeight/2) {
      if (elements[elements.length-1].offsetTop + elements[elements.length-1].clientHeight + translateY > pivot.offsetTop + pivot.clientHeight/2) {

        this.insertElements(this.container, elements, pivot.nextElementSibling);

        this.state = {
          ...this.state,
          selection: {
            index: this.state.selection.index + 1,
            length: this.state.selection.length
          }
        };

        return true;

      }

    }

  }



  swapInAbove(children, tx, ty) {

    const pivot = children[this.state.selection.index - 1];

    if (this.clientDiffY < 0 && pivot && pivot.classList.contains("block-group")) {

      const elements = children.slice(this.state.selection.index, this.state.selection.index + this.state.selection.length);
      const child = pivot.querySelector(".block-column");

      if (child && elements[0].offsetTop + ty < pivot.offsetTop + pivot.clientHeight - this.trespass) {

        this.container = child;

        const index = child.childElementCount;
        const path = [...this.state.path, this.state.selection.index -1, 0];

        this.state = {
          selection: {
            index: index,
            length: this.state.selection.length
          },
          path: path
        };

        this.insertElements(this.container, elements);

        return true;

      }

    }

  }

  swapInBelow(children, tx, ty) {

    const pivot = children[this.state.selection.index + 1];

    if (this.clientDiffY > 0 && pivot && pivot.classList.contains("block-group")) {

      const elements = children.slice(this.state.selection.index, this.state.selection.index + this.state.selection.length);
      const child = pivot.querySelector(".block-column");
      const last = elements[elements.length - 1];

      if (child && last.offsetTop + last.clientHeight + ty > pivot.offsetTop + this.trespass) {

        this.container = child;

        const index = 0;
        const path = [...this.state.path, this.state.selection.index, 0];

        this.state = {
          selection: {
            index: 0,
            length: this.state.selection.length
          },
          path: path
        };

        this.insertElements(child, elements, child.firstElementChild);

        return true;

      }

    }

  }

  swapOutAbove(children, tx, ty) {

    if (this.clientDiffY < 0 && this.state.selection.index === 0 && this.state.path.length > 1) {

      const elements = children.slice(this.state.selection.index, this.state.selection.index + this.state.selection.length);
      const parent = this.container.offsetParent.offsetParent;

      if (parent && elements[0].offsetTop + ty < -this.trespass) {

        const index = this.state.path[this.state.path.length-2];
        const path = this.state.path.slice(0, -2);

        this.container = parent;

        this.insertElements(this.container, elements, this.container.children[index]);

        this.state = {
          selection: {
            index: index,
            length: this.state.selection.length
          },
          path: path
        };

        return true;

      }

    }

  }


  swapOutBelow(children, tx, ty) {

    if (this.clientDiffY > 0 && this.state.selection.index + this.state.selection.length === children.length && this.state.path.length > 1) {

      const elements = children.slice(this.state.selection.index, this.state.selection.index + this.state.selection.length);
      const last = elements[elements.length - 1];
      const parent = this.container.offsetParent.offsetParent;

      if (parent && last.offsetTop + last.clientHeight + ty > this.container.clientHeight + this.trespass) {

        let index = this.state.path[this.state.path.length-2] + 1;
        let path = this.state.path.slice(0, -2);

        this.container = parent;

        this.insertElements(this.container, elements, this.container.children[index]);

        this.state = {
          selection: {
            index: index,
            length: this.state.selection.length
          },
          path: path
        }

        return true;

      }

    }

  }


  // swapLeft(children, tx, ty) {
  //
  //   const columnIndex = this.state.path[this.state.path.length - 1];
  //
  //   if (this.clientDiffX < 0 && this.state.path.length > 1 && columnIndex > 0) {
  //
  //     const elements = children.slice(this.state.selection.index, this.state.selection.index + this.state.selection.length);
  //     const leftContainer = this.container.previousElementSibling;
  //
  //     if (leftContainer && elements[0].offsetLeft + tx + elements[0].clientWidth/2 < 0) {
  //
  //       const index = leftContainer.childElementCount;
  //       const path = [...this.state.path.slice(0, -1), columnIndex - 1];
  //
  //       this.container = leftContainer;
  //
  //       this.insertElements(leftContainer, elements);
  //
  //       this.state = {
  //         path: path,
  //         selection: {
  //           index: index,
  //           length: this.state.selection.length
  //         }
  //       };
  //
  //       return true;
  //
  //     }
  //
  //   }
  //
  // }

  swapLeft(children, tx, ty) {

    if (this.clientDiffX < 0 && this.state.path.length > 1) {

      const elements = children.slice(this.state.selection.index, this.state.selection.index + this.state.selection.length);

      if (elements[0].offsetLeft + tx + elements[0].clientWidth/2 < 0) {

        let leftContainer = this.container.previousElementSibling;

        if (!leftContainer && this.state.selection.length < this.container.childElementCount) {

          leftContainer = this.container.cloneNode();

          this.insertElements(this.container.parentNode, [leftContainer], this.container);

        }

        if (leftContainer) {

          const columnIndex = this.state.path[this.state.path.length - 1];
          const columnPath = this.state.path.slice(0, -1);
          const index = leftContainer.childElementCount;
          const path = [...columnPath, columnIndex - 1];

          this.container = leftContainer;

          this.insertElements(leftContainer, elements);

          this.state = {
            path: path,
            selection: {
              index: index,
              length: this.state.selection.length
            }
          };

          return true;

        }

        // let leftContainer = this.container.previousElementSibling;
        //
        // if (leftContainer) {
        //
        //   this.container = leftContainer;
        //
        //   this.insertElements(leftContainer, elements);
        //
        //   this.state = {
        //     path: [...this.state.path.slice(0, -1), columnIndex - 1],
        //     selection: {
        //       index: leftContainer.childElementCount,
        //       length: this.state.selection.length
        //     }
        //   };
        //
        //   return true;
        //
        // } else if (this.state.selection.length < this.container.childElementCount) {
        //
        //   // -> create column to the left
        //
        //   leftContainer = this.container.clone();
        //
        //   this.insertElements(this.container.parentNode, leftContainer, this.container);
        //
        //   this.container = leftContainer;
        //
        //   this.insertElements(leftContainer, elements);
        //
        //   this.state = {
        //     path: [...this.state.path.slice(0, -1), -1],
        //     selection: {
        //       index: 0,
        //       length: this.state.selection.length
        //     }
        //   };
        //
        //   return true;
        //
        // }

      }

    }

  }

  // swapRight(children, tx, ty) {
  //
  //   const columnIndex = this.state.path[this.state.path.length - 1];
  //
  //   if (this.clientDiffX > 0 && this.state.path.length > 1) {
  //
  //     const elements = children.slice(this.state.selection.index, this.state.selection.index + this.state.selection.length);
  //     const rightContainer = this.container.nextElementSibling;
  //
  //     if (rightContainer && elements[0].offsetLeft + tx + elements[0].clientWidth/2 > rightContainer.offsetLeft) {
  //
  //       const index = rightContainer.childElementCount;
  //       const path = [...this.state.path.slice(0, -1), columnIndex + 1];
  //
  //       this.container = rightContainer;
  //
  //       this.insertElements(rightContainer, elements);
  //
  //       this.state = {
  //         path: path,
  //         selection: {
  //           index: index,
  //           length: this.state.selection.length
  //         }
  //       };
  //
  //       return true;
  //
  //     }
  //
  //   }
  //
  // }


  swapRight(children, tx, ty) {

    if (this.clientDiffX > 0 && this.state.path.length > 1) {

      const elements = children.slice(this.state.selection.index, this.state.selection.index + this.state.selection.length);

      // if (elements[0].offsetLeft + tx + elements[0].clientWidth/2 < 0) {
      if (tx > elements[0].clientWidth/2) {

        let rightContainer = this.container.nextElementSibling;

        if (!rightContainer && this.state.selection.length < this.container.childElementCount) {

          rightContainer = this.container.cloneNode();

          this.insertElements(this.container.parentNode, [rightContainer]);

        }

        if (rightContainer) {

          const columnIndex = this.state.path[this.state.path.length - 1];
          const columnPath = this.state.path.slice(0, -1);
          const index = rightContainer.childElementCount;
          const path = [...columnPath, columnIndex + 1];

          this.container = rightContainer;

          this.insertElements(rightContainer, elements);



          this.state = {
            path: path,
            selection: {
              index: index,
              length: this.state.selection.length
            }
          };

          return true;

        }

      }

    }

  }






}



// KarmaFieldsAlpha.BlockSorter = class extends KarmaFieldsAlpha.ListHierarchizer {
//
//   constructor(container, root) {
//
//     super(container);
//
//     this.root = container.closest(".block-root");
//
//   }
//
//   startDrag(row) {
//
//     super.startDrag(row);
//
//     this.originIndex = this.selection.index;
//     this.originPath = this.path;
//
//     this.root.classList.add("dragging-happens");
//
//   }
//
//   drag() {
//
//     const containerBox = {x: 0, y: 0, width: this.container.clientWidth, height: this.container.clientHeight};
//     const children = this.getChildren();
//
//     const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);
//
//     let containerAbsPos = this.getAbsolutePosition();
//
//     let travelX = this.x - this.offsetX - elements[0].offsetLeft - containerAbsPos.x + this.originAbsPos.x;
//     let travelY = this.y - this.offsetY - elements[0].offsetTop - containerAbsPos.y + this.originAbsPos.y;
//
//     const parent = this.container.parentElement;
//     const isRoot = parent.classList.contains("block-root");
//
//     const rightContainer = this.container.nextElementSibling;
//     const leftContainer = this.container.previousElementSibling;
//
//     const topNeighbour = this.container.parentElement.previousElementSibling;
//     const bottomNeighbour = this.container.parentElement.nextElementSibling;
//
//     const elementBefore = children[this.selection.index - 1];
//     const elementAfter = children[this.selection.index + this.selection.length];
//
//     const padding = 10;
//
//     const deltaX = this.clientDiffX;
//     const deltaY = this.clientDiffY;
//
//     const exitLeft = !isRoot && deltaX < 0
//       // && (this.selection.length < this.container.childElementCount || leftContainer && leftContainer.childElementCount > 0)
//       && leftContainer
//       // && firstBox.x + travelX + firstBox.width/2 < containerBox.x;
//       && elements[0].offsetLeft + travelX + elements[0].clientWidth/2 < 0;
//
//     const exitRight = !isRoot && deltaX > 0
//       // && (this.selection.length < this.container.childElementCount || rightContainer && rightContainer.childElementCount > 0)
//       && rightContainer
//       // && firstBox.x + travelX + firstBox.width/2 > containerBox.x + containerBox.width;
//       && elements[0].offsetLeft + travelX + elements[0].clientWidth/2 > this.container.clientWidth;
//
//     const exitTop = !isRoot && deltaY < 0
//       && this.selection.index === 0
//       // && firstBox.y + travelY + firstBox.height/2 < containerBox.y;
//       && elements[0].offsetTop + travelY < -padding;
//
//     const exitBottom = !isRoot && deltaY > 0
//       && this.selection.index + this.selection.length === this.container.childElementCount
//       // && lastBox.y + travelY + lastBox.height/2 > containerBox.y + containerBox.height;
//       && elements[elements.length-1].offsetTop + travelY + elements[elements.length-1].clientHeight > this.container.clientHeight + padding;
//
//     const enterTop = deltaY < 0
//       && elementBefore && elementBefore.classList.contains("block-group")
//       // && topNeighbourBox && firstBox.y + travelY < topNeighbourBox.y + topNeighbourBox.height - padding;
//       && elements[0].offsetTop + travelY < elementBefore.offsetTop + elementBefore.clientHeight - padding;
//
//     const enterBottom = deltaY > 0
//       && elementAfter && elementAfter.classList.contains("block-group")
//       // && bottomNeighbourBox && lastBox.y + travelY + lastBox.height > bottomNeighbourBox.y + padding;
//       && elements[elements.length-1].offsetTop + travelY + elements[elements.length-1].clientHeight > elementAfter.offsetTop + padding;
//
//     const swapTop = deltaY < 0
//       && elementBefore && !elementBefore.classList.contains("block-group")
//       // && topNeighbourBox && firstBox.y + travelY < topNeighbourBox.y + topNeighbourBox.height/2;
//       && elements[0].offsetTop + travelY < elementBefore.offsetTop + elementBefore.clientHeight/2;
//
//     const swapBottom = deltaY > 0
//       && elementAfter && !elementAfter.classList.contains("block-group")
//       // && bottomNeighbourBox && firstBox.y + travelY + firstBox.height < bottomNeighbourBox.y + bottomNeighbourBox.height/2;
//       && elements[elements.length-1].offsetTop + travelY + elements[elements.length-1].clientHeight > elementAfter.offsetTop + elementAfter.clientHeight/2;
//
//
//     if (exitLeft) {
//
//       this.exitLeft();
//
//     } else if (exitRight) {
//
//       this.exitRight();
//
//     } else if (exitTop) {
//
//       this.takeOut(-1);
//
//     } else if (exitBottom) {
//
//       this.takeOut(1);
//
//     } else if (enterTop) {
//
//       this.putInside(-1);
//
//     } else if (enterBottom) {
//
//       this.putInside(1);
//
//     } else if (swapTop) {
//
//       this.swap(-1);
//
//     } else if (swapBottom) {
//
//       this.swap(1);
//
//     }
//
//
//     containerAbsPos = this.getAbsolutePosition();
//
//     travelX = this.x - this.offsetX - elements[0].offsetLeft - containerAbsPos.x + this.originAbsPos.x;
//     travelY = this.y - this.offsetY - elements[0].offsetTop - containerAbsPos.y + this.originAbsPos.y;
//
//     this.sliceSegment(this.selection).forEach(element => element.style.transform = `translate(${travelX}px, ${travelY}px)`);
//
//   }
//
//   endDrag() {
//
//     if (this.dragging) {
//
//       this.root.classList.remove("dragging-happens");
//
//     }
//
//     super.complete();
//   }
//
//   exitLeft() {
//     // console.log("exitLeft");
//     // debugger;
//
//     const children = this.getChildren();
//
//     const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);
//
//     // const offsetLeft = this.container.offsetLeft + elements[0].offsetLeft;
//     // const offsetTop = this.container.offsetTop + elements[0].offsetTop;
//
//     // this.getLeftColumn();
//
//     let newContainer = this.container.previousElementSibling;
//
//
//
//     // let columnIndex = this.path[this.path.length-1];
//
//     // if (!newContainer) {
//     //
//     //   newContainer = this.createLeftColumn();
//     //   this.path[this.path.length-1]++;
//     //
//     //   if (this.onCreateColumn) {
//     //
//     //     this.onCreateColumn(0);
//     //
//     //   }
//     //
//     // }
//
//     let newIndex;
//     const newPath = [...this.path.slice(0, -1), this.path[this.path.length-1] - 1];
//
//
//     if (this.clientDiffY < 0) {
//
//       newIndex = newContainer.childElementCount;
//
//       this.insertElements(newContainer, elements);
//
//     } else {
//
//       newIndex = 0;
//
//       this.insertElements(newContainer, elements, newContainer.firstElementChild);
//
//     }
//
//     // this.originX += newContainer.offsetLeft + elements[0].offsetLeft - offsetLeft;
//     // this.originY += newContainer.offsetTop + elements[0].offsetTop - offsetTop;
//     // requestAnimationFrame(() => {
//     //   this.originX += newContainer.offsetLeft + elements[0].offsetLeft - offsetLeft;
//     //   this.originY += newContainer.offsetTop + elements[0].offsetTop - offsetTop;
//     // });
//
//     this.container = newContainer;
//
//     if (this.onSwap) {
//
//       this.onSwap(this.selection.index, newIndex, this.selection.length, this.path, newPath);
//
//     }
//
//     this.path = newPath;
//     this.index = newIndex;
//
//     this.selection = {index: newIndex, length: this.selection.length};
//
//   }
//
//   exitRight() {
//     // console.log("exitRight");
//
//
//     // debugger;
//
//     const children = this.getChildren();
//
//     const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);
//
//     // const offsetLeft = this.container.offsetLeft;
//     // const offsetTop = elements[0].offsetTop;
//
//     // const offsetLeft = this.container.offsetLeft + elements[0].offsetLeft;
//     // const offsetTop = this.container.offsetTop + elements[0].offsetTop;
//
//     // let rightColumn = this.getRightColumn();
//     let newContainer = this.container.nextElementSibling;
//
//     // if (!newContainer) {
//     //
//     //   newContainer = this.createRightColumn();
//     //
//     //   if (this.onCreateColumn) {
//     //
//     //     this.onCreateColumn(this.path[this.path.length-1] + 1);
//     //
//     //   }
//     //
//     // }
//
//     // const newContainer = rightColumn;
//
//     let newIndex = 0;
//     const newPath = [...this.path.slice(0, -1), this.path[this.path.length-1] + 1];
//
//     // this.originX += newContainer.offsetLeft - offsetLeft;
//     // this.originY += 0 - offsetTop;
//
//
//
//     // this.insertElements(newContainer, elements, newContainer.firstElementChild);
//
//     if (this.clientDiffY < 0) {
//
//       newIndex = newContainer.childElementCount;
//
//       this.insertElements(newContainer, elements);
//
//     } else {
//
//       newIndex = 0;
//
//       this.insertElements(newContainer, elements, newContainer.firstElementChild);
//
//     }
//
//     // requestAnimationFrame(() => {
//     //   this.originX += newContainer.offsetLeft + elements[0].offsetLeft - offsetLeft;
//     //   this.originY += newContainer.offsetTop + elements[0].offsetTop - offsetTop;
//     // });
//
//     this.container = newContainer;
//
//     if (this.onSwap) {
//
//       this.onSwap(this.selection.index, newIndex, this.selection.length, this.path, newPath);
//
//     }
//
//     this.path = newPath;
//     this.index = newIndex;
//
//     this.selection = {index: newIndex, length: this.selection.length};
//
//   }
//
//   takeOut(direction) {
//
//     const parentColumns = this.container.closest(".block");
//     const newContainer = parentColumns.parentNode;
//     const children = this.getChildren();
//     const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);
//
//     let newIndex = this.path[this.path.length-2];
//     let newPath = this.path.slice(0, -2);
//
//     if (direction < 0) {
//
//       newIndex = this.path[this.path.length-2];
//       newPath = this.path.slice(0, -2);
//
//       this.insertElements(newContainer, elements, parentColumns);
//
//
//     } else {
//
//       newIndex = this.path[this.path.length-2] + 1;
//       newPath = this.path.slice(0, -2);
//
//       this.insertElements(newContainer, elements, parentColumns.nextElementSibling);
//
//     }
//
//     this.container = newContainer;
//
//     if (this.onSwap) {
//
//       this.onSwap(this.selection.index, newIndex, this.selection.length, this.path, newPath);
//
//     }
//
//     this.path = newPath;
//     this.index = newIndex;
//
//     this.selection = {index: newIndex, length: this.selection.length};
//
//
//
//   }
//
//   putInside(direction) {
//
//     const children = this.getChildren();
//     const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);
//
//     let newIndex;
//     let newPath;
//
//     if (direction < 0) {
//
//       const prevColumns = elements[0].previousElementSibling;
//       const newContainer = prevColumns.querySelector(".block-column");
//
//       this.insertElements(newContainer, elements);
//
//       newIndex = newContainer.childElementCount;
//       newPath = [...this.path, this.selection.index - 1, 0];
//
//     } else {
//
//       const nextColumns = elements[elements.length-1].nextElementSibling;
//       const newContainer = nextColumns.querySelector(".block-column");
//
//       newIndex = 0;
//       newPath = [...this.path, this.selection.index, 0];
//
//       this.insertElements(newContainer, elements, newContainer.firstElementChild);
//
//     }
//
//     this.container = newContainer;
//
//     if (this.onSwap) {
//
//       this.onSwap(this.selection.index, newIndex, this.selection.length, this.path, newPath);
//
//     }
//
//     this.path = newPath;
//     this.index = newIndex;
//
//     this.selection = {index: newIndex, length: this.selection.length};
//
//   }
//
//   swap(direction) {
//
//     const children = this.getChildren();
//     const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);
//
//     let newIndex;
//
//     if (direction < 0) {
//
//       newIndex = this.selection.index - 1;
//
//       this.insertElements(this.container, elements, elements[0].previousElementSibling);
//
//     } else {
//
//       newIndex = this.selection.index + 1;
//
//       this.insertElements(this.container, elements, elements[elements.length-1].nextElementSibling.nextElementSibling);
//
//     }
//
//     this.index = newIndex;
//
//     this.selection = {index: newIndex, length: this.selection.length};
//
//   }
//
//
//   findColumnIndex(columns) {
//
//     return 0;
//
//   }
//
//
//   getLeftColumn() {
//
//     const closestColumn = this.container.closest(".block-column");
//
//     if (closestColumn) {
//
//       return closestColumn.previousElementSibling;
//
//     }
//
//   }
//
//   getRightColumn() {
//
//     const closestColumn = this.container.closest(".block-column");
//
//     if (closestColumn) {
//
//       return closestColumn.nextElementSibling;
//
//     }
//
//   }
//
//
//   getLeftContainer() {
//
//     const prevSibling = this.getLeftColumn();
//
//     if (prevSibling) {
//
//       return prevSibling.firstElementChild;
//
//     }
//
//   }
//
//   getRightContainer() {
//
//     const nextSibling = this.getRightColumn();
//
//     if (nextSibling) {
//
//       return nextSibling.firstElementChild;
//
//     }
//
//   }
//
//   createLeftColumn() {
//
//     // const columns = this.container.parentElement;
//
//     const newColumn = document.createElement("li");
//     // newColumn.innerHTML = '<ul class="block-branch dropzone"><li class="block-frame"></li></ul>';
//     newColumn.classes = "block-column";
//
//     this.container.parentElement.insertBefore(newColumn, this.container);
//
//     return newColumn;
//   }
//
//   createRightColumn() {
//
//     // const closestColumn = this.container.closest(".block-column");
//
//     const newColumn = document.createElement("li");
//     // newColumn.innerHTML = '<ul class="block-branch dropzone"><li class="block-frame"></li></ul>';
//     newColumn.classes = "block-column";
//
//     this.container.parentElement.parentNode.appendChild(newColumn);
//
//     return newColumn;
//   }
//
//
//
//
//
//
// }
