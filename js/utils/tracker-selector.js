

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

      this.tracker.event.preventDefault();
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

    this.tie = {
      index: this.getRow(index),
      length: 1
    };

    


    Object.freeze(this.tie);

    if (this.selection) { // this.selection should be frozen
      if (this.tracker.event.shiftKey) {
        this.tie = this.selection;
      } else {
        this.sliceSegment(this.selection).forEach(element => element.classList.remove("selected"));
        this.selection = null;
      }
    }

    this.update();

  }

  update() {

    const index = this.findIndex(this.tracker.x, this.tracker.y);

    if (index > -1) {

      this.growSelection({
        index: this.getRow(index),
        length: 1
      });

    }

  }

  complete() {


    if (this.selection) {

      this.sliceSegment(this.selection).forEach(element => element.classList.replace("selecting", "selected"));

      if (this.onselect) {

        this.onselect(this.selection, true); // compat

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

  growSelection(segment) {

    const union = KarmaFieldsAlpha.Segment.union(this.tie, segment);

    if (!this.selection || !KarmaFieldsAlpha.Segment.compare(union, this.selection)) {

      if (this.selection) {

        this.sliceSegment(this.selection).forEach(element => element.classList.remove("selecting"));

      }

      this.selection = union;

      Object.freeze(this.selection);

      this.sliceSegment(this.selection).forEach(element => element.classList.add("selecting"));

    }

  }

  clear(segment = this.selection) {

    if (segment) {

      this.sliceSegment(segment).forEach(element => element.classList.remove("selected"));

    }

  }


}
