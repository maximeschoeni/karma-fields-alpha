
KarmaFieldsAlpha.BlockSorter = class extends KarmaFieldsAlpha.Sorter {

  // constructor(container) {
  //
  //   super(container);
  //
  //   this.maxDepth = 0;
  //
  // }

  update() {

    if (this.dragging) {

      // let travelX = this.tracker.x - this.originX;
      // let travelY = this.tracker.y - this.originY;

      // const firstBox = this.getBox(this.selection.index);
      // const lastBox = this.getBox(this.selection.index + this.selection.length - 1);
      //
      // if (!firstBox || !lastBox) {
      //
      //   console.error("wtf container is empty!", this.selection, this.index, this.length);
      //
      // }

      const containerBox = {x: 0, y: 0, width: this.container.clientWidth, height: this.container.clientHeight};
      const children = this.getChildren();
      const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);

      let containerAbsPos = this.getAbsolutePosition();

      let travelX = this.tracker.x - this.offsetX - elements[0].offsetLeft - containerAbsPos.x + this.originAbsPos.x;
      let travelY = this.tracker.y - this.offsetY - elements[0].offsetTop - containerAbsPos.y + this.originAbsPos.y;




      const parent = this.container.parentElement;
      const isRoot = parent.classList.contains("block-root");

      // const closestColumn = this.container.closest(".column");

      // const rightContainer = this.getRightContainer();
      // const leftContainer = this.getLeftContainer();
      const rightContainer = this.container.nextElementSibling;
      const leftContainer = this.container.previousElementSibling;

      // const topNeighbour = this.selection.index > 0 && children[this.selection.index - 1];
      // const bottomNeighbour = this.selection.index + this.selection.length < children.length && children[this.selection.index + this.selection.length];

      const topNeighbour = this.container.parentElement.previousElementSibling;
      const bottomNeighbour = this.container.parentElement.nextElementSibling;

      const elementBefore = children[this.selection.index - 1];
      const elementAfter = children[this.selection.index + this.selection.length];


      // const topNeighbourBox = this.selection.index > 0 && this.getBox(this.selection.index - 1);
      // const bottomNeighbourBox = this.selection.index > 0 && this.getBox(this.selection.index + this.selection.length);

      const padding = 10;

      const exitLeft = !isRoot && this.tracker.deltaX < 0
        // && (this.selection.length < this.container.childElementCount || leftContainer && leftContainer.childElementCount > 0)
        && leftContainer
        // && firstBox.x + travelX + firstBox.width/2 < containerBox.x;
        && elements[0].offsetLeft + travelX + elements[0].clientWidth/2 < 0;

      const exitRight = !isRoot && this.tracker.deltaX > 0
        // && (this.selection.length < this.container.childElementCount || rightContainer && rightContainer.childElementCount > 0)
        && rightContainer
        // && firstBox.x + travelX + firstBox.width/2 > containerBox.x + containerBox.width;
        && elements[0].offsetLeft + travelX + elements[0].clientWidth/2 > this.container.clientWidth;

      const exitTop = !isRoot && this.tracker.deltaY < 0
        && this.selection.index === 0
        // && firstBox.y + travelY + firstBox.height/2 < containerBox.y;
        && elements[0].offsetTop + travelY < -padding;

      const exitBottom = !isRoot && this.tracker.deltaY > 0
        && this.selection.index + this.selection.length === this.container.childElementCount
        // && lastBox.y + travelY + lastBox.height/2 > containerBox.y + containerBox.height;
        && elements[elements.length-1].offsetTop + travelY + elements[elements.length-1].clientHeight > this.container.clientHeight + padding;

      const enterTop = this.tracker.deltaY < 0
        && elementBefore && elementBefore.classList.contains("block-columns")
        // && topNeighbourBox && firstBox.y + travelY < topNeighbourBox.y + topNeighbourBox.height - padding;
        && elements[0].offsetTop + travelY < elementBefore.offsetTop + elementBefore.clientHeight - padding;

      const enterBottom = this.tracker.deltaY > 0
        && elementAfter && elementAfter.classList.contains("block-columns")
        // && bottomNeighbourBox && lastBox.y + travelY + lastBox.height > bottomNeighbourBox.y + padding;
        && elements[elements.length-1].offsetTop + travelY + elements[elements.length-1].clientHeight > elementAfter.offsetTop + padding;

      const swapTop = this.tracker.deltaY < 0
        && elementBefore && !elementBefore.classList.contains("block-columns")
        // && topNeighbourBox && firstBox.y + travelY < topNeighbourBox.y + topNeighbourBox.height/2;
        && elements[0].offsetTop + travelY < elementBefore.offsetTop + elementBefore.clientHeight/2;

      const swapBottom = this.tracker.deltaY > 0
        && elementAfter && !elementAfter.classList.contains("block-columns")
        // && bottomNeighbourBox && firstBox.y + travelY + firstBox.height < bottomNeighbourBox.y + bottomNeighbourBox.height/2;
        && elements[elements.length-1].offsetTop + travelY + elements[elements.length-1].clientHeight > elementAfter.offsetTop + elementAfter.clientHeight/2;


      // console.log({
      //   exitLeft: exitLeft,
      //   exitRight: exitRight,
      //   exitTop: exitTop,
      //   exitBottom: exitBottom,
      //   enterTop: enterTop,
      //   enterBottom: enterBottom,
      //   swapTop: swapTop,
      //   swapBottom: swapBottom
      // });


      if (exitLeft) {

        this.exitLeft();

      } else if (exitRight) {

        this.exitRight();

      } else if (exitTop) {

        this.exitTop();

      } else if (exitBottom) {

        this.exitBottom();

      } else if (enterTop) {

        this.enterTop();

      } else if (enterBottom) {

        this.enterBottom();

      } else if (swapTop) {

        this.swapTop();

      } else if (swapBottom) {

        this.swapBottom();

      }


      // travelX = this.tracker.x - this.originX;
      // travelY = this.tracker.y - this.originY;



      // const mouseAbsPos = this.getAbsolutePosition(this.tracker.x, this.tracker.y);
      // const containerAbsPos = this.getAbsolutePosition();


      // console.log(this.tracker.x, this.tracker.y, mouseAbsPos);


      // this.sliceSegment(this.selection).forEach(element => element.style.transform = `translate(${travelX}px, ${travelY}px)`);

      // const children2 = this.getChildren();
      // const elements2 = children2.slice(this.selection.index, this.selection.index + this.selection.length);
      // const tx = this.tracker.x - this.offsetX - elements2[0].offsetLeft - containerAbsPos.x;
      // const ty = this.tracker.y - this.offsetY - elements2[0].offsetTop - containerAbsPos.y;
      //
      // this.sliceSegment(this.selection).forEach(element => element.style.transform = `translate(${tx}px, ${ty}px)`);

      containerAbsPos = this.getAbsolutePosition();

      travelX = this.tracker.x - this.offsetX - elements[0].offsetLeft - containerAbsPos.x + this.originAbsPos.x;
      travelY = this.tracker.y - this.offsetY - elements[0].offsetTop - containerAbsPos.y + this.originAbsPos.y;


      // console.log(travelX, this.tracker.x, containerAbsPos.x);

      this.sliceSegment(this.selection).forEach(element => element.style.transform = `translate(${travelX}px, ${travelY}px)`);

    } else {

      super.update();

    }

  }

  exitLeft() {
    console.log("exitLeft");
    // debugger;

    const children = this.getChildren();

    const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);

    // const offsetLeft = this.container.offsetLeft + elements[0].offsetLeft;
    // const offsetTop = this.container.offsetTop + elements[0].offsetTop;

    // this.getLeftColumn();

    let newContainer = this.container.previousElementSibling;



    // let columnIndex = this.path[this.path.length-1];

    // if (!newContainer) {
    //
    //   newContainer = this.createLeftColumn();
    //   this.path[this.path.length-1]++;
    //
    //   if (this.onCreateColumn) {
    //
    //     this.onCreateColumn(0);
    //
    //   }
    //
    // }

    let newIndex;
    const newPath = [...this.path.slice(0, -1), this.path[this.path.length-1] - 1];


    if (this.tracker.deltaY < 0) {

      newIndex = newContainer.childElementCount;

      this.insertElements(newContainer, elements);

    } else {

      newIndex = 0;

      this.insertElements(newContainer, elements, newContainer.firstElementChild);

    }

    // this.originX += newContainer.offsetLeft + elements[0].offsetLeft - offsetLeft;
    // this.originY += newContainer.offsetTop + elements[0].offsetTop - offsetTop;
    // requestAnimationFrame(() => {
    //   this.originX += newContainer.offsetLeft + elements[0].offsetLeft - offsetLeft;
    //   this.originY += newContainer.offsetTop + elements[0].offsetTop - offsetTop;
    // });

    this.container = newContainer;

    if (this.onSwap) {

      this.onSwap(this.selection.index, newIndex, this.selection.length, this.path, newPath);

    }

    this.path = newPath;
    this.index = newIndex;

    this.selection = {index: newIndex, length: this.selection.length};

  }

  exitRight() {
    console.log("exitRight");

    // debugger;

    const children = this.getChildren();

    const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);

    // const offsetLeft = this.container.offsetLeft;
    // const offsetTop = elements[0].offsetTop;

    // const offsetLeft = this.container.offsetLeft + elements[0].offsetLeft;
    // const offsetTop = this.container.offsetTop + elements[0].offsetTop;

    // let rightColumn = this.getRightColumn();
    let newContainer = this.container.nextElementSibling;

    // if (!newContainer) {
    //
    //   newContainer = this.createRightColumn();
    //
    //   if (this.onCreateColumn) {
    //
    //     this.onCreateColumn(this.path[this.path.length-1] + 1);
    //
    //   }
    //
    // }

    // const newContainer = rightColumn;

    let newIndex = 0;
    const newPath = [...this.path.slice(0, -1), this.path[this.path.length-1] + 1];

    // this.originX += newContainer.offsetLeft - offsetLeft;
    // this.originY += 0 - offsetTop;



    // this.insertElements(newContainer, elements, newContainer.firstElementChild);

    if (this.tracker.deltaY < 0) {

      newIndex = newContainer.childElementCount;

      this.insertElements(newContainer, elements);

    } else {

      newIndex = 0;

      this.insertElements(newContainer, elements, newContainer.firstElementChild);

    }

    // requestAnimationFrame(() => {
    //   this.originX += newContainer.offsetLeft + elements[0].offsetLeft - offsetLeft;
    //   this.originY += newContainer.offsetTop + elements[0].offsetTop - offsetTop;
    // });

    this.container = newContainer;

    if (this.onSwap) {

      this.onSwap(this.selection.index, newIndex, this.selection.length, this.path, newPath);

    }

    this.path = newPath;
    this.index = newIndex;

    this.selection = {index: newIndex, length: this.selection.length};

  }

  exitTop() {

    console.log("exitTop");

    const parentColumns = this.container.parentNode;
    const newContainer = parentColumns.parentNode;
    const children = this.getChildren();
    const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);
    const newIndex = this.path[this.path.length-2];
    const newPath = this.path.slice(0, -2);

    // const offsetLeft = elements[0].offsetLeft + this.container.offsetLeft + parentColumns.offsetLeft;
    // const offsetTop = elements[0].offsetTop + this.container.offsetTop + parentColumns.offsetTop;

    this.insertElements(newContainer, elements, parentColumns);

    // requestAnimationFrame(() => {
    //   this.originX += elements[0].offsetLeft - offsetLeft;
    //   this.originY += elements[0].offsetTop - offsetTop;
    // });

    this.container = newContainer;

    if (this.onSwap) {

      this.onSwap(this.selection.index, newIndex, this.selection.length, this.path, newPath);

    }

    this.path = newPath;
    this.index = newIndex;

    this.selection = {index: newIndex, length: this.selection.length};

  }

  exitBottom() {

    console.log("exitBottom");

    const parentColumns = this.container.parentElement;
    const newContainer = parentColumns.parentElement;
    const children = this.getChildren();
    const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);
    const newIndex = this.path[this.path.length-2] + 1;
    const newPath = this.path.slice(0, -2);

    // const offsetLeft = elements[0].offsetLeft + this.container.offsetLeft + parentColumns.offsetLeft;
    // const offsetTop = elements[0].offsetTop + this.container.offsetTop + parentColumns.offsetTop;


    // this.removeElements(this.container, elements);

    this.insertElements(newContainer, elements, parentColumns.nextElementSibling);


    // this.originX += elements[0].offsetLeft - offsetLeft;
    // this.originY += elements[0].offsetTop - offsetTop;

    // -> why??
    // requestAnimationFrame(() => {
    //   this.originX += elements[0].offsetLeft - offsetLeft;
    //   this.originY += elements[0].offsetTop - offsetTop;
    // });


    this.container = newContainer;

    if (this.onSwap) {

      this.onSwap(this.selection.index, newIndex, this.selection.length, this.path, newPath);

    }

    this.path = newPath;
    this.index = newIndex;

    this.selection = {index: newIndex, length: this.selection.length};






  }

  enterTop() {

    console.log("enterTop");

    const children = this.getChildren();
    const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);

    const prevColumns = elements[0].previousElementSibling;
    const newContainer = prevColumns.firstElementChild; // this.findColumn(prevColumns)

    const newIndex = newContainer.childElementCount;
    const newPath = [...this.path, this.selection.index - 1, 0];

    // const offsetLeft = elements[0].offsetLeft;
    // const offsetTop = elements[0].offsetTop;

    this.insertElements(newContainer, elements);

    // requestAnimationFrame(() => {
    //   this.originX += elements[0].offsetLeft + newContainer.offsetLeft + prevColumns.offsetLeft - offsetLeft;
    //   this.originY += elements[0].offsetTop + newContainer.offsetTop + prevColumns.offsetTop - offsetTop;
    // });
    this.container = newContainer;

    if (this.onSwap) {

      this.onSwap(this.selection.index, newIndex, this.selection.length, this.path, newPath);

    }



    this.path = newPath;
    this.index = newIndex;

    this.selection = {index: newIndex, length: this.selection.length};

  }

  enterBottom() {

    console.log("enterBottom");

    const children = this.getChildren();
    const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);

    const nextColumns = elements[elements.length-1].nextElementSibling;
    const newContainer = nextColumns.firstElementChild; // this.findColumn(nextColumns)

    const newIndex = 0;
    const newPath = [...this.path, this.selection.index, 0];

    // const offsetLeft = elements[0].offsetLeft;
    // const offsetTop = elements[0].offsetTop;

    this.insertElements(newContainer, elements, newContainer.firstElementChild);

    // requestAnimationFrame(() => {
    //
    //   this.originX += elements[0].offsetLeft + newContainer.offsetLeft + nextColumns.offsetLeft - offsetLeft;
    //   this.originY += elements[0].offsetTop + newContainer.offsetTop + nextColumns.offsetTop - offsetTop;
    // });

    this.container = newContainer;

    if (this.onSwap) {

      this.onSwap(this.selection.index, newIndex, this.selection.length, this.path, newPath);

    }

    this.path = newPath;
    this.index = newIndex;

    this.selection = {index: newIndex, length: this.selection.length};

  }

  swapTop() {

    const children = this.getChildren();
    const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);

    const newIndex = this.selection.index - 1;

    // const offsetLeft = elements[0].offsetLeft;
    // const offsetTop = elements[0].offsetTop;

    // this.insertElementsAt(this.container, elements, newIndex);
    this.insertElements(this.container, elements, elements[0].previousElementSibling);

    if (this.onSwap) {

      this.onSwap(this.selection.index, newIndex, this.selection.length, this.path, this.path);

    }

    // this.originX += elements[0].offsetLeft - offsetLeft;
    // this.originY += elements[0].offsetTop - offsetTop;

    this.index = newIndex;

    this.selection = {index: newIndex, length: this.selection.length};

  }

  swapBottom() {

    const children = this.getChildren();
    const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);

    const newIndex = this.selection.index + 1;

    // const offsetLeft = elements[0].offsetLeft;
    // const offsetTop = elements[0].offsetTop;

    // this.insertElementsAt(this.container, elements, newIndex);
    this.insertElements(this.container, elements, elements[elements.length-1].nextElementSibling.nextElementSibling);

    if (this.onSwap) {

      this.onSwap(this.selection.index, newIndex, this.selection.length, this.path, this.path);

    }

    // this.originX += elements[0].offsetLeft - offsetLeft;
    // this.originY += elements[0].offsetTop - offsetTop;

    this.index = newIndex;

    this.selection = {index: newIndex, length: this.selection.length};

  }


  findColumnIndex(columns) {

    return 0;

  }


  getLeftColumn() {

    const closestColumn = this.container.closest(".block-column");

    if (closestColumn) {

      return closestColumn.previousElementSibling;

    }

  }

  getRightColumn() {

    const closestColumn = this.container.closest(".block-column");

    if (closestColumn) {

      return closestColumn.nextElementSibling;

    }

  }


  getLeftContainer() {

    const prevSibling = this.getLeftColumn();

    if (prevSibling) {

      return prevSibling.firstElementChild;

    }

  }

  getRightContainer() {

    const nextSibling = this.getRightColumn();

    if (nextSibling) {

      return nextSibling.firstElementChild;

    }

  }

  createLeftColumn() {

    // const columns = this.container.parentElement;

    const newColumn = document.createElement("li");
    // newColumn.innerHTML = '<ul class="block-branch dropzone"><li class="block-frame"></li></ul>';
    newColumn.classes = "block-column";

    this.container.parentElement.insertBefore(newColumn, this.container);

    return newColumn;
  }

  createRightColumn() {

    // const closestColumn = this.container.closest(".block-column");

    const newColumn = document.createElement("li");
    // newColumn.innerHTML = '<ul class="block-branch dropzone"><li class="block-frame"></li></ul>';
    newColumn.classes = "block-column";

    this.container.parentElement.parentNode.appendChild(newColumn);

    return newColumn;
  }

  insertElements(container, elements, targetElement) {

    if (targetElement) {

      for (let element of elements) {

        container.insertBefore(element, targetElement);

      }

    } else {

      for (let element of elements) {

        container.appendChild(element);

      }

    }

  }

  removeElements(container, elements) {

    for (let element of elements) {

      element.remove();

    }

  }



//
//
//
//
//   // swapToSame(offset) {
//
//   //   console.log("swapToSame");
//   //   return;
//
//   //   this.swap(this.selection.index, this.selection.length, this.selection.index + offset);
//   //   this.selection = KarmaFieldsAlpha.Segment.offset(this.selection, offset); // this.selection is immutable
//
//   // }
//
//   swapToParent(closest, offset) {
//
// // if (offset == 0) debugger;
//
// debugger;
//
//
//     this.container.style.height = "auto";
//
//     const offsetLeft = this.container.offsetLeft;
//     const offsetTop = this.container.offsetTop;
//
//     const originBox = this.getBox(this.selection.index);
//
//     const children = this.getChildren();
//     const width = this.getWidth();
//     const elements = children.splice((this.colHeader + this.selection.index)*width, this.selection.length*width);
//
//     // const index = this.path.pop();
//     // const index = this.path.pop();
//
//     let newIndex = this.path[this.path.length-1] + offset;
//     let newPath = this.path.slice(0, -1);
//
//
//
//     this.container = closest;
//
//     this.insertElementsAt(this.container, elements, newIndex);
//
//     this.selection = {...this.selection, index: newIndex};
//
//     const destBox = this.getBox(this.selection.index);
//
//     this.originX += destBox.x - offsetLeft - originBox.x;
//     this.originY += destBox.y - offsetTop - originBox.y;
//
//     if (this.onSwap) {
//
//       // this.onSwap(this.selection, this.path, this.index, newPath, newIndex, this.selection.length);
//       this.onSwap(this.index, newIndex, this.selection.length, this.path, newPath);
//
//     }
//
//
//     this.index = newIndex;
//     this.path = newPath;
//
//   }
//
//   swapToChild(offset) {
//
// // debugger;
//
//     const box = this.getBox(this.selection.index);
//
//     this.container.style.height = "auto";
//
//     const children = this.getChildren();
//     const width = this.getWidth();
//     const elements = children.splice((this.colHeader + this.selection.index)*width, this.selection.length*width);
//
//     this.container = child;
//
//     let newIndex;
//     let newPath;
//
//     if (offset > 0) { // -> enter from top
//
//       let columns = elements[0].querySelector(".columns,.dropzone");
//
//       if (columns) {
//
//
//
//       }
//
//
//
//       newIndex = 0;
//       newPath = [...this.path, this.index];
//
//     } else { // -> enter from bottom
//
//       // this.path.push(this.selection.index -1);
//
//       newPath = [...this.path, this.index -1]
//
//       newIndex = this.getHeight();
//
//       if (newIndex > 0) {
//
//         this.originY += this.getBox(0, newIndex).height;
//
//       }
//
//     }
//
//     this.selection = {...this.selection, index: newIndex};
//
//     this.insertElementsAt(this.container, elements, newIndex);
//
//     this.originX -= box.x - this.container.offsetLeft;
//     this.originY -= box.y - this.container.offsetTop;
//
//     if (this.onSwap) {
//
//       this.onSwap(this.index, newIndex, this.selection.length, this.path, newPath);
//
//     }
//
//     this.index = newIndex;
//     this.path = newPath;
//
//
//
//   }
//
//
//   // complete() {
//
//   //   if (this.dragging) {
//
//   //     this.sliceSegment(this.selection).forEach(element => {
//   //       element.classList.remove("drag");
//   //       element.style.transform = "none";
//   //     });
//
//   //     this.container.classList.remove("dragging");
//   //     this.container.style.height = "auto";
//
//   //     // this.root.container.style.height = "auto";
//   //     // this.root.container.style.overflow = "hidden";
//
//
//   //     // if (this.onsort && this.selection && this.selection.index !== this.index) {
//
//   //     //   this.onsort(this.index, this.selection.length, this.selection.index);
//
//   //     // }
//
//   //     if (this.onsort) {
//
//   //       this.onsort();
//
//   //     }
//
//   //     this.dragging = false;
//
//   //   } else {
//
//   //     super.complete();
//
//   //   }
//
//   // }
//
//   // swap(index, length, target) {
//
//   //   const children = this.getChildren(); // [...this.container.children];
//   //   const width = this.getWidth();
//
//   //   const elements = children.splice((this.colHeader + index)*width, length*width);
//   //   children.splice((this.colHeader + target)*width, 0, ...elements);
//
//   //   this.container.replaceChildren(...children);
//
//   // }
//
//
//
//   findChild(elements) {
//
//     for (let element of elements) {
//
//       const child = element.querySelector(".dropzone");
//
//       if (child) {
//
//         return child;
//
//       }
//
//     }
//
//   }

  // insertElementsAt(container, elements, index) {

  //   // this.tracker.scrollLock = true;


  //   const target = container.children[index];

  //   if (target) {

  //     for (let element of elements) {

  //       container.insertBefore(element, target);

  //     }

  //   } else {

  //     for (let element of elements) {

  //       container.appendChild(element);

  //     }

  //   }


  //   // setTimeout(() => {
  //   //   this.tracker.scrollLock = false;
  //   // }, 200);

  // }

  // getContainerBox() {
  //
  //   if (this.path.length > 0) {
  //
  //     const index = this.path[this.path.length - 1];
  //     const closest = this.container.parentNode.closest(".dropzone");
  //
  //     if (closest) {
  //
  //       const selector = new KarmaFieldsAlpha.Selector(closest);
  //       const box = selector.getBox(index);
  //
  //       if (box) {
  //
  //         return KarmaFieldsAlpha.Rect.offset(box, -this.container.offsetLeft, -this.container.offsetTop);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }


  // getParent() {

  //   const closest = this.container.parentNode.closest(".dropzone");

  //   if (closest) {

  //     return new KarmaFieldsAlpha.Sorter(closest);

  //   }

  // }


  // getRoot() {

  //   const parent = this.getParent();

  //   if (parent) {

  //     return parent.getRoot();
  //   }

  //   return this;
  // }


}
