
KarmaFieldsAlpha.ListSorter = class extends KarmaFieldsAlpha.ListPicker {

  constructor(container, selection) {

    super(container, selection);

    this.swapers = [
      this.swapAbove,
      this.swapBelow
    ];

  }

  start(index) {

    // if (index > -1 && this.selection && KarmaFieldsAlpha.Segment.contain(this.selection, index)) {
    if (index > -1 && this.state.selection && KarmaFieldsAlpha.Segment.contain(this.state.selection, index)) {

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

    if (this.onDragBegin) {

      this.onDragBegin(index); // -> for block library

    }

    const elements = this.slice(this.state.selection.index, this.state.selection.length);

    this.originPosition = this.getPosition(elements);
    this.lastPosition = this.originPosition;

    this.originState = this.state;
    this.lastState = this.state;

    // this.originIndex = this.selection.index;
    // this.lastIndex = this.selection.index;
    // // this.originPath = this.path;
    // this.lastPath = this.path;

    // this.indexOffset = index - this.selection.index;

    elements.forEach(element => element.classList.add("drag"));

    if (this.onStartDrag) {

      this.onStartDrag(elements);

    }

    this.container.classList.add("dragging");

  }

  drag() {


    let children = this.getChildren();
    // let elements = children.slice(this.state.selection.index, this.state.selection.index + this.state.selection.length);
    let elements = this.slice(this.state.selection.index, this.state.selection.length, children);

    if (!elements.length) {

      return;

    }

    let translate = this.getTranslate(elements);

    if (this.swapers.some(swaper => swaper.call(this, children, translate.x, translate.y))) {

      if (this.onUnselect) {

        this.onUnselect(elements);

      }

      if (this.onSwap) {

        // this.onSwap(this.lastIndex, this.selection.index, this.selection.length, this.lastPath, this.path);

        this.onSwap(this.state, this.lastState);

      }

      // debugger;

      // this.lastIndex = this.selection.index;
      // this.lastPath = this.path;

      this.lastState = this.state;

      children = this.getChildren();
      // elements = children.slice(this.state.selection.index, this.state.selection.index + this.state.selection.length);
      elements = this.slice(this.state.selection.index, this.state.selection.length, children);

      translate = this.getTranslate(elements);

      if (this.onSelect) {

        this.onSelect(elements);

      }

    }

    elements.forEach(element => element.style.transform = `translate(${translate.x}px, ${translate.y}px)`);

  }

  swapAbove (children, translateX, translateY) {

    const pivot = children[this.state.selection.index - 1];

    if (pivot) {

      const elements = this.slice(this.state.selection.index, this.state.selection.length);

      if (this.clientDiffY < 0 && elements[0].offsetTop + translateY < pivot.offsetTop + pivot.clientHeight/2) {

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

  swapBelow (children, translateX, translateY) {


    const pivot = children[this.state.selection.index + this.state.selection.length];

    if (pivot) {

      const elements = children.slice(this.state.selection.index, this.state.selection.index + this.state.selection.length);

      if (this.clientDiffY > 0 && elements[elements.length-1].offsetTop + elements[elements.length-1].clientHeight + translateY > pivot.offsetTop + pivot.clientHeight/2) {

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

  endDrag() {

    const elements = this.slice(this.state.selection.index, this.state.selection.length);

    elements.forEach(element => {
      element.classList.remove("drag");
      element.style.transform = "none";
    });

    this.container.classList.remove("dragging");

    if (this.onSort) {

      // this.onSort(this.originIndex, this.state.index, this.selection.length);
      this.onSort(this.state, this.originState);

    }

  }

  getTranslate(elements) {

    const position = this.getPosition(elements);

    return {
      x: this.x - this.originX + this.originPosition.x - position.x,
      y: this.y - this.originY + this.originPosition.y - position.y
    };

  }


  getPosition(elements) {

    const position = {
      x: elements[0].offsetLeft,
      y: elements[0].offsetTop
    };

    // let container = this.container;
    //
    // while (container && this.root && container !== this.root) {
    //
    //   position.x += container.offsetLeft;
    //   position.y += container.offsetTop;
    //
    //   container = container.offsetParent;
    //
    // }

    return position;

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

    this.children = null;

  }


}
