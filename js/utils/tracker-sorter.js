
KarmaFieldsAlpha.Sorter = class extends KarmaFieldsAlpha.Selector {

  start(row) {

    // let index;
    // let row;
    //
    // if (this.selection) {
    //
    //   index = this.findIndex(this.tracker.x, this.tracker.y);
    //   row = this.getRow(index);
    //
    // }
    //
    // // if (row >= 0 && KarmaFieldsAlpha.Segment.contain(this.selection, row)) {
    // // if (row >= 0 && this.selection.contains(row)) {
    // if (row >= 0 && KarmaFieldsAlpha.Selection.containRow(this.selection, row)) {

    if (this.selection && KarmaFieldsAlpha.Selection.containRow(this.selection, row)) {

      this.originX = this.tracker.x;
      this.originY = this.tracker.y;

      this.currentRect = this.getBox(row);
      this.offsetX = this.tracker.x - this.currentRect.x;
      this.offsetY = this.tracker.y - this.currentRect.y;

      this.originAbsPos = this.getAbsolutePosition();

      this.index = this.selection.index;
      this.length = this.selection.length;
      this.originIndex = this.index;
      this.originPath = this.path;
      this.indexOffset = row - this.index;
      this.dragging = true;

      this.sliceSegment(this.selection).forEach(element => element.classList.add("drag"));

      this.container.classList.add("dragging");
      this.container.style.height = `${this.container.clientHeight}px`;

      this.tracker.event.stopPropagation(); // -> WHY ??

    } else {

      super.start(row); // -> proceed selection

    }


    // this.tracker.event.stopPropagation(); // prevent selection of container underneath

  }

  // update() {

  //   if (this.dragging) {

  //     // let currentBox = this.getBox(this.selection.index + this.indexOffset);

  //     let travelX = this.tracker.x - this.originX;
  //     let travelY = this.tracker.y - this.originY;

  //     const firstBox = this.getBox(this.selection.index);
  //     const lastBox = this.getBox(this.selection.index + this.selection.length - 1);

  //     if (this.tracker.deltaY < 0) {

  //       if (this.selection.index > 0) {

  //         const elements = this.sliceElements(this.selection.index - 1, 1);
  //         const box = this.getElementsBox(...elements);

  //         if (firstBox.y + travelY < box.y + box.height/2) {

  //           this.swapToSame(-1);

  //         }

  //       }

  //     }

  //     if (this.tracker.deltaY > 0) {

  //       const last = this.getHeight();

  //       if (this.selection.index + this.selection.length < last) {

  //         const elements = this.sliceElements(this.selection.index + this.selection.length, 1);
  //         const box = this.getElementsBox(...elements);

  //         if (lastBox.y + lastBox.height + travelY > box.y + box.height/2) {

  //           this.swapToSame(1);

  //         }


  //       }

  //     }

  //     travelX = this.tracker.x - this.originX;
  //     travelY = this.tracker.y - this.originY;

  //     this.sliceSegment(this.selection).forEach(element => element.style.transform = `translate(${travelX}px, ${travelY}px)`);

  //   } else {

  //     super.update();

  //   }

  // }

  update() {

    if (this.dragging) {

      let travelX = this.tracker.x - this.originX;
      let travelY = this.tracker.y - this.originY;

      // const containerRectangle = this.getElementsRectangle(this.container);
      const containerRectangle = new KarmaFieldsAlpha.Rect(0, 0, this.container.clientWidth, this.container.clientHeight);

      const selectedRectangle = this.getRectangle(this.selection.index, this.selection.length);

      if (selectedRectangle) {

        const draggingRectangle = selectedRectangle.offset(travelX, travelY).constrain(containerRectangle);

        // console.log(containerRectangle, selectedRectangle, draggingRectangle);

        if ((this.tracker.deltaX < 0 || this.tracker.deltaY < 0) && this.selection.index > 0) {

          const beforeRectangle = this.getRectangle(this.selection.index - 1, 1);

          if (draggingRectangle.isBefore(beforeRectangle)) {

            this.swapToSame(-1);

          }

        } else if ((this.tracker.deltaX > 0 || this.tracker.deltaY > 0) && this.selection.index + this.selection.length < this.getNumRow()) {

          const afterRectangle = this.getRectangle(this.selection.index + this.selection.length, 1);

          if (draggingRectangle.isAfter(afterRectangle)) {

            this.swapToSame(1);

          }

        }

        travelX = this.tracker.x - this.originX;
        travelY = this.tracker.y - this.originY;

        this.sliceSegment(this.selection).forEach(element => element.style.transform = `translate(${travelX}px, ${travelY}px)`);

      }

    } else {

      super.update();

    }

  }

  swapToSame(offset) {

    const elements = this.sliceSegment(this.selection);

    let newIndex;

    if (offset > 0) {

      const lastRectangle = this.getRectangle(this.selection.index + this.selection.length - 1);
      const afterRectangle = this.getRectangle(this.selection.index + this.selection.length);

      this.originX += (afterRectangle.x + afterRectangle.width) - (lastRectangle.x + lastRectangle.width);
      this.originY += (afterRectangle.y + afterRectangle.height) - (lastRectangle.y + lastRectangle.height);

      this.insertElementsAt(this.container, elements, this.selection.index + this.selection.length + 1);

      // this.selection = new KarmaFieldsAlpha.Selection(this.selection.index + 1, this.selection.length);

      newIndex = this.selection.index + 1;

      this.selection = {...this.selection, index: newIndex}

      if (this.onSwap) {

        this.onSwap(this.index, newIndex, this.selection.length, this.path, this.path);


      }

    } else {

      const firstRectangle = this.getRectangle(this.selection.index);
      const beforeRectangle = this.getRectangle(this.selection.index - 1);

      this.originX += beforeRectangle.x - firstRectangle.x;
      this.originY += beforeRectangle.y - firstRectangle.y;

      this.insertElementsAt(this.container, elements, this.selection.index - 1);

      // this.selection = new KarmaFieldsAlpha.Selection(this.selection.index - 1, this.selection.length);

      newIndex = this.selection.index - 1;

      this.selection = {...this.selection, index: newIndex}

      if (this.onSwap) {

        // this.onSwap(this.index, this.selection.index, this.selection.length);
        this.onSwap(this.index, newIndex, this.selection.length, this.path, this.path);


      }

    }

    this.index = newIndex;

    // this.index = this.selection.index;

    // this.selection = {index: this.selection.index + offset, length: this.selection.length};


  }


  complete() {

    if (this.dragging) {

      this.sliceSegment(this.selection).forEach(element => {
        element.classList.remove("drag");
        element.style.transform = "none";
      });

      this.container.classList.remove("dragging");
      this.container.style.height = "auto";

      if (this.onsort) {

        this.onsort(this.originIndex, this.index, this.selection.length, this.originPath, this.path);

      }

      this.dragging = false;

    } else {

      super.complete();

    }

  }

  insertElementsAt(container, elements, row) {

    const index = this.getIndex(0, row);

    const target = container.children[index];

    if (target) {

      for (let element of elements) {

        container.insertBefore(element, target);

      }

    } else {

      for (let element of elements) {

        container.appendChild(element);

      }

    }

  }


  getAbsolutePosition() {

    const position = {x: 0, y: 0};

    let container = this.container;

    while (container && !container.classList.contains("block-root")) {

      position.x += container.offsetLeft;
      position.y += container.offsetTop;

      container = container.offsetParent;

    }

    return position;
  }



}
