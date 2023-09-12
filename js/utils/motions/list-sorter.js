
KarmaFieldsAlpha.ListSorter = class extends KarmaFieldsAlpha.ListPicker {

  start(index) {

    if (index > -1 && this.selection && KarmaFieldsAlpha.Segment.contain(this.selection, index)) {

      this.dragging = true;

      this.startDrag(index);

      this.event.stopPropagation();

    } else { // -> selecting

      super.start(index);

    }

  }

  move(index) {

    if (this.dragging) {

      this.drag();

    } else {

      super.move(index); // -> grow selection

    }


  }

  end() {

    if (this.dragging) {

      this.dragging = false;

      this.endDrag();

    } else {

      super.end();

    }

  }



  startDrag(index) {

    this.originX = this.x;
    this.originY = this.y;

    this.currentRect = this.getBox(this.selection.index, this.selection.length);
    this.offsetX = this.x - this.currentRect.x;
    this.offsetY = this.y - this.currentRect.y;

    this.originAbsPos = this.getAbsolutePosition();

    // this.originIndex = this.selection.index;
    // this.originPath = this.path;

    this.indexOffset = index - this.selection.index;

    const elements = this.slice(this.selection.index, this.selection.length);

    elements.forEach(element => element.classList.add("drag"));

    if (this.onStartDrag) {

      this.onStartDrag(elements);

    }

    this.container.classList.add("dragging");
    // this.container.style.height = `${this.container.clientHeight}px`;

  }

  drag() {

    let travelX = this.x - this.originX;
    let travelY = this.y - this.originY;

    const containerRectangle = new KarmaFieldsAlpha.Rect(0, 0, this.container.clientWidth, this.container.clientHeight);

    let selectedRectangle = this.getBox(this.selection.index, this.selection.length);

    if (selectedRectangle) {

      // selectedRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), selectedRectangle);

      let draggingRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), selectedRectangle);

      draggingRectangle.offset(travelX, travelY).constrain(containerRectangle);

      if ((this.clientDiffX < 0 || this.clientDiffY < 0) && this.selection.index > 0) {

        const beforeRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), this.getBox(this.selection.index - 1, 1));

        if (draggingRectangle.isBefore(beforeRectangle)) {

          this.swap(-1);

        }

      } else if ((this.clientDiffX > 0 || this.clientDiffY > 0) && this.selection.index + this.selection.length < this.getChildren().length) {

        const afterRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), this.getBox(this.selection.index + this.selection.length, 1));

        if (draggingRectangle.isAfter(afterRectangle)) {

          this.swap(1);

        }

      }

      travelX = this.x - this.originX;
      travelY = this.y - this.originY;

      const elements = this.slice(this.selection.index, this.selection.length);

      elements.forEach(element => element.style.transform = `translate(${travelX}px, ${travelY}px)`);

    }

  }

  endDrag() {

    const elements = this.slice(this.selection.index, this.selection.length);

    elements.forEach(element => {
      element.classList.remove("drag");
      element.style.transform = "none";
    });

    this.container.classList.remove("dragging");
    // this.container.style.height = "auto";

    if (this.onsort) {

      this.onsort(this.originIndex, this.selection.index, this.selection.length);

    }

  }

  swap(offset) {

    const elements = this.slice(this.selection.index, this.selection.length);

    let newIndex;

    if (offset > 0) {

      const lastRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), this.getBox(this.selection.index + this.selection.length - 1));
      const afterRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), this.getBox(this.selection.index + this.selection.length));

      this.originX += (afterRectangle.x + afterRectangle.width) - (lastRectangle.x + lastRectangle.width);
      this.originY += (afterRectangle.y + afterRectangle.height) - (lastRectangle.y + lastRectangle.height);

      this.insertElementsAt(this.container, elements, this.selection.index + this.selection.length + 1);

      // this.selection = new KarmaFieldsAlpha.Selection(this.selection.index + 1, this.selection.length);

      newIndex = this.selection.index + 1;

      this.selection = {index: newIndex, length: this.selection.length};

      if (this.onSwap) {

        this.onSwap(this.selection.index, newIndex, this.selection.length);

      }

    } else {

      const firstRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), this.getBox(this.selection.index));
      const beforeRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), this.getBox(this.selection.index - 1));

      this.originX += beforeRectangle.x - firstRectangle.x;
      this.originY += beforeRectangle.y - firstRectangle.y;

      this.insertElementsAt(this.container, elements, this.selection.index - 1);

      newIndex = this.selection.index - 1;

      this.selection = {...this.selection, index: newIndex}

      if (this.onSwap) {

        // this.onSwap(this.index, this.selection.index, this.selection.length);
        this.onSwap(this.selection.index, newIndex, this.selection.length, this.path, this.path);


      }

    }

  }


}
