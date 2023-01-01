

KarmaFieldsAlpha.Selector = class {

  constructor(container) {

    this.tracker = new KarmaFieldsAlpha.Tracker(container);

    this.container = container;
    this.children = [...container.children];
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

  init() {

    const index = this.findIndex(this.tracker.x, this.tracker.y);

    this.tie = {
      index: this.getRow(index),
      length: 1
    };

    Object.freeze(this.tie);

    if (this.selection) { // this.selection should be frozen
      if (event.shiftKey) {
        this.tie = this.selection;
      } else {
        this.sliceSegment(this.selection).forEach(element => element.classList.remove("selected"));
        this.selection = null;
      }
    }

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

      if (this.onSelect) {

        this.onSelect(this.selection, true); // compat

      }

    }

  }


  getWidth() {

    return this.rowHeader + this.colCount + this.rowFooter;

  }

  getHeight() {

    return this.colHeader + this.rowCount + this.colFooter;

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

    const elements = [];

    for (let j = 0; j < height; j++) {

      for (let i = 0; i < width; i++) {

        const index = this.getIndex(i + col, j + row);
        const element = this.children[index];

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

    return this.slice(0, segment.index, this.width, segment.length);

  }

  findIndex(x, y) {

    for (let j = 0; j < this.rowCount; j++) {

      for (let i = 0; i < this.colCount; i++) {

        const index = this.getIndex(i, j);

        const element = this.children[index];

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

    for (let j = 0; j < this.height; j++) {

      for (let i = 0; i < this.width; i++) {

        const index = j*this.width + i;
        const element = this.children[index];

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

    const first = this.children[elementIndex];
    const last = this.children[lastElementIndex];

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
