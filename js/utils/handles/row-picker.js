KarmaFieldsAlpha.RowPicker = class extends KarmaFieldsAlpha.ListPicker {

  constructor(container, selection, width, header, footer) {

    super(container, selection);

    this.header = header || 0;
    this.footer = footer || 0;
    this.width = width || 0;

  }

  slice(index, length, children = this.getChildren()) {

    const itemIndex = (index+this.header)*this.width;
    const itemLength = length*this.width;

    return children.slice(itemIndex, itemIndex + itemLength);

  }

  findIndex(x, y) { // find body index from mouse x/y

    const children = this.getChildren();

    const rowCount = Math.floor(children.length/this.width) - this.footer;

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

// KarmaFieldsAlpha.RowPicker = class extends KarmaFieldsAlpha.GridController {
//
//   startSelection(row) {
//
//     this.tie = {index: row, length: 1};
//
//     if (this.selection) { // this.selection should be frozen
//
//       if (this.event.shiftKey) {
//
//         this.tie = this.selection;
//
//       } else {
//
//         this.selection = null;
//
//       }
//
//     }
//
//     this.grow(row);
//
//   }
//
//   growSelection(row) {
//
//     if (!this.tie) {
//
//       return;
//
//     }
//
//     const union = KarmaFieldsAlpha.Segment.union({index: row, length: 1}, this.tie);
//
//     if (!this.selection || !KarmaFieldsAlpha.Segment.compare(union, this.selection)) {
//
//       if (this.selection) {
//
//         if (this.onUnselect) {
//
//           const elements = this.sliceRows(this.selection.index, this.selection.length);
//
//           this.onUnselect(this.selection, elements);
//
//         }
//
//       }
//
//       this.selection = union;
//
//       if (this.onSelect) {
//
//         const elements = this.sliceRows(this.selection.index, this.selection.length);
//
//         this.onSelect(this.selection, elements);
//
//       }
//
//     }
//
//   }
//
//   completeSelection() {
//
//     this.tie = null;
//     this.selecting = false;
//
//   }
//
// }
