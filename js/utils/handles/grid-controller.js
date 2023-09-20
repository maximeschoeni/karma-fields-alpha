



KarmaFieldsAlpha.GridController = class extends KarmaFieldsAlpha.MotionTracker {

  constructor(container) {

    super(container);

    this.colCount = 1;
    this.rowCount = 0;
    this.colHeader = 0;
    this.rowHeader = 0;
    this.colFooter = 0;
    this.rowFooter = 0;

  }

  getChildren() {

    return [...this.container.children];

  }

  getWidth() {

    return this.rowHeader + this.colCount + this.rowFooter;

  }

  getHeight() {

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

  findPosition(x, y) { // find body index from mouse x/y

    const children = this.getChildren();

    for (let j = 0; j < this.rowCount; j++) {

      for (let i = 0; i < this.colCount; i++) {

        const index = this.getIndex(i, j);

        const element = children[index];

        if (y >= element.offsetTop && y < element.offsetTop + element.clientHeight) {

          if (x >= element.offsetLeft && x < element.offsetLeft + element.clientWidth) {

            return {col: i, row: j};

          }

        } else {

          break;

        }

      }

    }

  }


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

  sliceRows(rowIndex, length) {

    return this.slice(0, rowIndex, this.colCount, length);

  }

  getRowsBox(index, length = 1) {

    const firstIndex = this.getIndex(0, index);
    const lastIndex = this.getIndex(this.colCount - 1, index + length - 1);

    const children = this.getChildren();

    const first = children[firstIndex];
    const last = children[lastIndex];

    if (first && last) {

      return {
        x: first.offsetLeft,
        y: first.offsetTop,
        width: last.offsetLeft + last.clientWidth - first.offsetLeft,
        height: last.offsetTop + last.clientHeight - first.offsetTop
      };

    }

  }


}
