

KarmaFieldsAlpha.Selector = class {

  constructor(container) {

    this.tracker = new KarmaFieldsAlpha.Tracker(container);

    this.container = container;
    // this.children = [...container.children];
    // this.children = [];
    // this.box = this.container.getBoundingClientRect();

    this.colCount = 1;
    this.rowCount = 0;
    this.colHeader = 0;
    this.colFooter = 0;
    this.rowHeader = 0;
    this.rowFooter = 0;

    this.tracker.oninit = () => {

      this.init();

      // this.tracker.event.preventDefault();
      this.tracker.event.stopPropagation();

    }

    this.tracker.onupdate = () => {

      this.update();

    }

    this.tracker.oncomplete = () => {

      this.complete();

    }



  }

  add(element) {

    this.children.push(element);

  }

  getChildren() {

    // if (!this.children) {

    //   this.children = [...this.container.children];

    // }

    // return this.children;

    return [...this.container.children];
  }

  init() {

    const index = this.findIndex(this.tracker.x, this.tracker.y);

    this.firstIndex = index;

    // this.tie = {
    //   index: this.getRow(index),
    //   length: 1
    // };

    const row = this.getRow(index);
    const col = this.getCol(index);

    this.tie = new KarmaFieldsAlpha.Selection(row, 1, col, 1);




    Object.freeze(this.tie);

    if (this.selection) { // this.selection should be frozen

      if (!this.selection instanceof KarmaFieldsAlpha.Selection) {

        console.warning("this.selection is not instance of Selection!");

        this.selection = new KarmaFieldsAlpha.Selection(this.selection.index, this.selection.length);

      }

      if (this.tracker.event.shiftKey) {
        this.tie = this.selection;
      } else {
        this.sliceSegment(this.selection).forEach(element => element.classList.remove("selected"));
        this.sliceSelection(this.selection).forEach(element => element.classList.remove("selected-cell"));
        this.selection = null;
      }
    }

    this.update();

  }

  update() {

    const index = this.findIndex(this.tracker.x, this.tracker.y);


    if (this.tracker.firstTarget.tabIndex < 0 || index !== this.firstIndex) { // why??

    // if (true) {

      if (index > -1) {

        const row = this.getRow(index);
        const col = this.getCol(index);

        const selection = new KarmaFieldsAlpha.Selection(row, 1, col, 1);

        this.growSelection(selection);

      }

    }



  }

  complete() {

    const index = this.findIndex(this.tracker.x, this.tracker.y);

    if (this.selection) {

      // this.sliceSegment(this.selection).forEach(element => element.classList.replace("selecting", "selected"));
      // this.sliceSelection(this.selection).forEach(element => element.classList.replace("selecting-cell", "selected-cell"));

      if (this.onselect) {

        this.onselect(this.selection, true); // compat

      }

    // } else if (this.getElementsRectangle(this.container).contains(this.tracker.x, this.tracker.y)) {
    } else if (index === undefined && (new KarmaFieldsAlpha.Rect(0, 0, this.container.clientWidth, this.container.clientHeight)).contains(this.tracker.x, this.tracker.y)) {


      if (this.onbackground) {

        this.onbackground();

      }

    }

  }


  getWidth() {

    return this.rowHeader + this.colCount + this.rowFooter;

  }

  getHeight() {

    // return this.colHeader + this.rowCount + this.colFooter;

    return this.getChildren().length/this.getWidth();

  }

  getNumRow() {

    return this.getChildren().length/this.getWidth() - this.colHeader - this.colFooter;

  }


  getCol(index) {

    return (index%this.getWidth()) - this.rowHeader;

  }

  getRow(index) {

    return Math.floor(index/this.getWidth()) - this.colHeader;

  }

  getIndex(col, row) {

    return (row + this.colHeader)*this.getWidth() + col + this.rowHeader;

  }

  // use box not segment
  slice(col, row, width, height) {

    const children = this.getChildren();
    const elements = [];

    for (let j = 0; j < height; j++) {

      for (let i = 0; i < width; i++) {

        const index = this.getIndex(i + col, j + row);
        const element = children[index];

        if (element) {

          elements.push(element);

        }

      }

    }

    return elements;
  }

  sliceRect(box) {

    return this.slice(box.x, box.y, box.width, box.height);

  }

  sliceSelection(selection) {

    return this.slice(selection.colIndex, selection.index, selection.colLength, selection.length);

  }

  sliceSegment(segment) {

    return this.slice(0, segment.index, this.getWidth(), segment.length);

  }

  sliceElements(index, length) {

    return this.slice(0, index, this.getWidth(), length);

  }

  findIndex(x, y) {

    const children = this.getChildren();

    for (let j = 0; j < this.rowCount; j++) {

      for (let i = 0; i < this.colCount; i++) {

        const index = this.getIndex(i, j);

        const element = children[index];

        if (y >= element.offsetTop && y < element.offsetTop + element.clientHeight) {

          if (x >= element.offsetLeft && x < element.offsetLeft + element.clientWidth) {

            return index;

          }

        } else {

          break;

        }

      }

    }

    return -1;
  }

  findElementIndex(x, y) {

    const children = this.getChildren();
    const width = this.getWidth();

    for (let j = 0; j < this.getHeight(); j++) {

      for (let i = 0; i < width; i++) {

        const index = j*width + i;
        const element = children[index];

        if (y >= element.offsetTop && y < element.offsetTop + element.clientHeight) {

          if (x >= element.offsetLeft && x < element.offsetLeft + element.clientWidth) {

            return index;

          }

        } else {

          break;

        }

      }

    }

    return -1;
  }


  getBox(rowIndex, rowLength = 1) {

    const elementIndex = this.getIndex(0, rowIndex);
    const lastElementIndex = this.getIndex(0, rowIndex + rowLength) - 1;

    // const elements = this.getChildren().slice(elementIndex, lastElementIndex + 1);
    // return this.getElementsBox(...elements);

    const children = this.getChildren();

    const first = children[elementIndex];
    const last = children[lastElementIndex];

    // console.log(rowIndex, rowLength, elementIndex, lastElementIndex, first, last);

    if (first && last) {

      return {
        x: first.offsetLeft,
        y: first.offsetTop,
        width: last.offsetLeft + last.clientWidth - first.offsetLeft,
        height: last.offsetTop + last.clientHeight - first.offsetTop
      };

    }

  }

  getRectangle(rowIndex, rowLength = 1) {

    const elementIndex = this.getIndex(0, rowIndex);
    const lastElementIndex = this.getIndex(0, rowIndex + rowLength) - 1;

    const children = this.getChildren();

    const first = children[elementIndex];
    const last = children[lastElementIndex];

    // console.log(rowIndex, rowLength, elementIndex, lastElementIndex, first, last);

    if (first && last) {

      return new KarmaFieldsAlpha.Rect(
        first.offsetLeft,
        first.offsetTop,
        last.offsetLeft + last.clientWidth - first.offsetLeft,
        last.offsetTop + last.clientHeight - first.offsetTop
      );

    }

  }

  getElementsBox(...elements) {

    const first = elements[0];
    const last = elements[elements.length-1];

    if (first && last) {

      return {
        x: first.offsetLeft,
        y: first.offsetTop,
        width: last.offsetLeft + last.clientWidth - first.offsetLeft,
        height: last.offsetTop + last.clientHeight - first.offsetTop
      };

    }

  }

  getElementsRectangle(...elements) {

    const first = elements[0];
    const last = elements[elements.length-1];

    if (first && last) {

      return new KarmaFieldsAlpha.Rect(
        first.offsetLeft,
        first.offsetTop,
        last.offsetLeft + last.clientWidth - first.offsetLeft,
        last.offsetTop + last.clientHeight - first.offsetTop
      );

    }

  }

  growSelection(selection) {




    const union = selection.union(this.tie);


    if (!this.selection || !union.equals(this.selection)) {

      if (this.selection) {

        if (this.onUnpaintRow) {

          this.onUnpaintRow(this.sliceSegment(this.selection));

        }

        if (this.onUnpaintCell) {

          this.onUnpaintCell(this.sliceSelection(this.selection));

        }

        // this.sliceSegment(this.selection).forEach(element => element.classList.remove("selected"));
        // this.sliceSelection(this.selection).forEach(element => element.classList.remove("selected-cell"));

      }

      this.selection = union;

      Object.freeze(this.selection);

      // this.sliceSegment(this.selection).forEach(element => element.classList.add("selected"));
      // this.sliceSelection(this.selection).forEach(element => element.classList.add("selected-cell"));

      if (this.onPaintRow) {

        this.onPaintRow(this.sliceSegment(this.selection));

      }

      if (this.onPaintCell) {

        this.onPaintCell(this.sliceSelection(this.selection));

      }


      if (this.onSelectionChange) {

        this.onSelectionChange(this.selection);

      }

    }

  }

  clear(segment = this.selection) {

    if (segment) {

      this.sliceSegment(segment).forEach(element => element.classList.remove("selected"));
      this.sliceSelection(segment).forEach(element => element.classList.remove("selected-cell"));

    }

  }


}
