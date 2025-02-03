
KarmaFieldsAlpha.ListSortGrid = class extends KarmaFieldsAlpha.ListSorter {

  constructor(container, selection, width, header) {

    super(container, selection);

    this.header = header || 0;
    this.width = width || 0;

  }

  swapAbove (children, translateX, translateY) {

    if (this.state.selection.index > 0) {

      const pivots = this.slice(this.state.selection.index - 1, 1);

      if (pivots.length) {

        const pivotBox = this.getElementBox(...pivots);
        const elements = this.slice(this.state.selection.index, this.state.selection.length, children);
        const selectionBox = this.getElementBox(...elements);

        if (this.clientDiffY < 0 && selectionBox.y + translateY < pivotBox.y + pivotBox.height/2) {

          this.insertElements(this.container, elements, pivots[0]);

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

  }

  swapBelow (children, translateX, translateY) {

    const pivots = this.slice(this.state.selection.index + this.state.selection.length, 1);

    if (pivots) {

      const pivotBox = this.getElementBox(...pivots);
      const elements = this.slice(this.state.selection.index, this.state.selection.length, children);
      const selectionBox = this.getElementBox(...elements);

      if (this.clientDiffY > 0 && selectionBox.y + selectionBox.height + translateY > pivotBox.y + pivotBox.height/2) {

        this.insertElements(this.container, elements, pivots[pivots.length-1].nextElementSibling);

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

  slice(index, length, children = this.getChildren()) {


    const itemIndex = (index+this.header)*this.width;
    const itemLength = length*this.width;

    return children.slice(itemIndex, itemIndex + itemLength);

  }

  // findIndex(x, y) {
  //
  //   const children = this.getChildren();
  //
  //   for (let i = 0; i < children.length; i++) {
  //
  //     const element = children[i];
  //
  //     if (x >= element.offsetLeft && x < element.offsetLeft + element.clientWidth && y >= element.offsetTop && y < element.offsetTop + element.clientHeight) {
  //
  //       return i;
  //
  //     }
  //
  //   }
  //
  //   return -1;
  // }

  findIndex(x, y) { // find body index from mouse x/y

    const children = this.getChildren();

    const rowCount = Math.floor(children.length/this.width);

    for (let j = this.header; j < rowCount; j++) {

      for (let i = 0; i < this.width; i++) {

        const element = children[j*this.width + i];

        if (y >= element.offsetTop && y < element.offsetTop + element.clientHeight) {

          if (x >= element.offsetLeft && x < element.offsetLeft + element.clientWidth) {

            return j - this.header;

          }

        } else {

          break;

        }

      }

    }

  }

}
