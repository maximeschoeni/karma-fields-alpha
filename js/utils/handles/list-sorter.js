
KarmaFieldsAlpha.ListSorter = class extends KarmaFieldsAlpha.ListPicker {

  constructor(container) {

    super(container);

    this.swapers = [
      this.swapUp,
      this.swapDown
    ];

  }

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

    // this.currentRect = this.getBox(this.selection.index, this.selection.length);



    const elements = this.slice(this.selection.index, this.selection.length);

    // this.offsetX = this.x - this.currentRect.x;
    // this.offsetY = this.y - this.currentRect.y;

    // this.originAbsPos = this.getAbsolutePosition();

    this.originPosition = this.getPosition(elements);

    this.originIndex = this.selection.index;
    this.lastIndex = this.selection.index;
    // this.originPath = this.path;

    // this.indexOffset = index - this.selection.index;



    elements.forEach(element => element.classList.add("drag"));

    if (this.onStartDrag) {

      this.onStartDrag(elements);

    }

    this.container.classList.add("dragging");
    // this.container.style.height = `${this.container.clientHeight}px`;

  }

  drag() {



    // const containerBox = {x: 0, y: 0, width: this.container.clientWidth, height: this.container.clientHeight};
    // const children = this.getChildren();

    // let elements = children.slice(this.selection.index, this.selection.index + this.selection.length);
    let children = this.getChildren();
    let elements = children.slice(this.selection.index, this.selection.index + this.selection.length);

    if (!elements.length) {

      return;

    }

    // let position = this.getPosition(elements);
    let translate = this.getTranslate(elements);

    // let travelX = this.x - this.offsetX - elements[0].offsetLeft - containerAbsPos.x + this.originAbsPos.x;
    // let travelX = pos.x - this.originPos.x;
    // let travelX = this.x + this.originPosition.x - position.x;
    // let travelX = this.x - this.originX + this.originPosition.x - position.x;


    // let travelY = this.y - this.offsetY - elements[0].offsetTop - containerAbsPos.y + this.originAbsPos.y;
    // let travelY = pos.y - this.originPos.y;
    // let travelY = this.y + this.originPosition.y - position.y;
    // let travelY = this.y - this.originY + this.originPosition.y - position.y;

    // const parent = this.container.parentElement;
    // const isRoot = parent.classList.contains("block-root");

    // const rightContainer = this.container.nextElementSibling;
    // const leftContainer = this.container.previousElementSibling;
    //
    // const topNeighbour = this.container.parentElement.previousElementSibling;
    // const bottomNeighbour = this.container.parentElement.nextElementSibling;

    // const elementBefore = children[this.selection.index - 1];
    // const elementAfter = children[this.selection.index + this.selection.length];

    // const padding = 10;

    // const deltaX = this.clientDiffX;
    // const deltaY = this.clientDiffY;

    if (this.swapers.some(swaper => swaper.call(this, children, translate.x, translate.y))) {

      // containerAbsPos = this.getAbsolutePosition();
      //
      // travelX = this.x - this.offsetX - elements[0].offsetLeft - containerAbsPos.x + this.originAbsPos.x;
      // travelY = this.y - this.offsetY - elements[0].offsetTop - containerAbsPos.y + this.originAbsPos.y;
      //
      // this.sliceSegment(this.selection).forEach(element => element.style.transform = `translate(${travelX}px, ${travelY}px)`);



      if (this.onUnselect) {

        this.onUnselect(this.selection, elements);

      }

      if (this.onSwap) {

        this.onSwap(this.lastIndex, this.selection.index, this.selection.length, this.lastPath, this.path);

      }

      this.lastIndex = this.selection.index;
      this.lastPath = this.path;

      children = this.getChildren();
      elements = children.slice(this.selection.index, this.selection.index + this.selection.length);

      // position = this.getPosition(elements);
      translate = this.getTranslate(elements);

      if (this.onSelect) {

        this.onSelect(this.selection, elements);

      }

    }

    elements.forEach(element => element.style.transform = `translate(${translate.x}px, ${translate.y}px)`);

  }

  // render(elements) {
  //
  //   const position = this.getPosition(elements);
  //
  //   elements.forEach(element => element.style.transform = `translate(${position.x - this.originPos.x}px, ${travelY}px)`);
  //
  // }


  swapUp (children, travelX, travelY) {

    const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);
    const first = children[this.selection.index];
    const elementBefore = children[this.selection.index - 1];


    if (elementBefore && (this.clientDiffY < 0 && first.offsetTop + travelY < elementBefore.offsetTop + elementBefore.clientHeight/2 ||
      this.clientDiffX < 0 && first.offsetLeft + travelX < elementBefore.offsetLeft + elementBefore.clientWidth/2)) {

debugger;
      this.insertElements(this.container, elements, elementBefore);

      // this.selection.index = this.selection.index - 1 -> never modify a selection

      this.selection = {
        index: this.selection.index - 1,
        length: this.selection.length
      };

      return true;

    }

  }

  swapDown (children, travelX, travelY) {

    const elements = children.slice(this.selection.index, this.selection.index + this.selection.length);
    const last = children[this.selection.index + this.selection.length - 1];
    const elementAfter = children[this.selection.index + this.selection.length];

    if (elementAfter && (this.clientDiffY > 0 && last.offsetTop + last.clientHeight + travelY > elementAfter.offsetTop + elementAfter.clientHeight/2 ||
      this.clientDiffX > 0 && last.offsetLeft + last.clientWidth + travelX < elementAfter.offsetLeft + elementAfter.clientWidth/2)) {
debugger;
      this.insertElements(this.container, elements, elementAfter.nextElementSibling);

      this.selection = {
        index: this.selection.index + 1,
        length: this.selection.length
      };

      return true;

    }

  }




  // dragXXX() {
  //
  //   let travelX = this.x - this.originX;
  //   let travelY = this.y - this.originY;
  //
  //   const containerRectangle = new KarmaFieldsAlpha.Rect(0, 0, this.container.clientWidth, this.container.clientHeight);
  //
  //   let selectedRectangle = this.getBox(this.selection.index, this.selection.length);
  //
  //   if (selectedRectangle) {
  //
  //     // selectedRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), selectedRectangle);
  //
  //     let draggingRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), selectedRectangle);
  //
  //     draggingRectangle.offset(travelX, travelY).constrain(containerRectangle);
  //
  //     console.log(this.clientDiffX < 0, this.clientDiffY < 0, this.selection.index > 0)
  //
  //     if ((this.clientDiffX < 0 || this.clientDiffY < 0) && this.selection.index > 0) {
  //
  //       const beforeRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), this.getBox(this.selection.index - 1, 1));
  //
  //       console.log(draggingRectangle, beforeRectangle);
  //
  //       if (draggingRectangle.isBefore(beforeRectangle)) {
  //
  //         this.swap(-1);
  //
  //       }
  //
  //     } else if ((this.clientDiffX > 0 || this.clientDiffY > 0) && this.selection.index + this.selection.length < this.getChildren().length) {
  //
  //       const afterRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), this.getBox(this.selection.index + this.selection.length, 1));
  //
  //       if (draggingRectangle.isAfter(afterRectangle)) {
  //
  //         this.swap(1);
  //
  //       }
  //
  //     }
  //
  //     travelX = this.x - this.originX;
  //     travelY = this.y - this.originY;
  //
  //     const elements = this.slice(this.selection.index, this.selection.length);
  //
  //     elements.forEach(element => element.style.transform = `translate(${travelX}px, ${travelY}px)`);
  //
  //   }
  //
  // }

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

  // swap(offset) {
  //
  //   const elements = this.slice(this.selection.index, this.selection.length);
  //
  //   let newIndex;
  //
  //   if (offset > 0) {
  //
  //     const lastRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), this.getBox(this.selection.index + this.selection.length - 1));
  //     const afterRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), this.getBox(this.selection.index + this.selection.length));
  //
  //     this.originX += (afterRectangle.x + afterRectangle.width) - (lastRectangle.x + lastRectangle.width);
  //     this.originY += (afterRectangle.y + afterRectangle.height) - (lastRectangle.y + lastRectangle.height);
  //
  //     this.insertElementsAt(this.container, elements, this.selection.index + this.selection.length + 1);
  //
  //     // this.selection = new KarmaFieldsAlpha.Selection(this.selection.index + 1, this.selection.length);
  //
  //     newIndex = this.selection.index + 1;
  //
  //     this.selection = {index: newIndex, length: this.selection.length};
  //
  //     if (this.onSwap) {
  //
  //       this.onSwap(this.selection.index, newIndex, this.selection.length);
  //
  //     }
  //
  //   } else {
  //
  //     const firstRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), this.getBox(this.selection.index));
  //     const beforeRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), this.getBox(this.selection.index - 1));
  //
  //     this.originX += beforeRectangle.x - firstRectangle.x;
  //     this.originY += beforeRectangle.y - firstRectangle.y;
  //
  //     this.insertElementsAt(this.container, elements, this.selection.index - 1);
  //
  //     newIndex = this.selection.index - 1;
  //
  //     this.selection = {...this.selection, index: newIndex}
  //
  //     if (this.onSwap) {
  //
  //       // this.onSwap(this.index, this.selection.index, this.selection.length);
  //       this.onSwap(this.selection.index, newIndex, this.selection.length, this.path, this.path);
  //
  //
  //     }
  //
  //   }
  //
  // }

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

  }



  // getAbsolutePosition() {
  //
  //   const position = {x: 0, y: 0};
  //
  //   let container = this.container;
  //
  //   while (container && this.root && container !== this.root) {
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


}
