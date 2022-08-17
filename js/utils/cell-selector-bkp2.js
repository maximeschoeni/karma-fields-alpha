

KarmaFieldsAlpha.CellSelector = class extends KarmaFieldsAlpha.IdSelector {

  constructor() {

    super();

    this.headers = [];
    this.width = 0;
    this.height = 0;

  }

  // async setData(data) {
  //   if (this.selection) {
  //     for (let j = 0; j < Math.max(this.selection.height, data.length); j++) {
  //       for (let i = 0; i < Math.max(this.selection.width, data[j%data.length].length); i++) {
  //
  //         const index = (this.selection.y + j)*this.width + this.selection.x + i;
  //         const item = this.items[index];
  //
  //         if (item) {
  //           const value = data[j%data.length][i%data[j%data.length].length];
  //
  //           // await item.field.dispatch({
  //   				// 	action: "set",
  //   				// 	backup: true,
  //   				// 	data: [value]
  //   				// });
  //
  //           item.field.importValue(value);
  //
  //         }
  //       }
  //     }
  //   }
  // }

  countCellSelection() {
    return this.cellSelection.width*this.cellSelection.height;
  }

  // getItem(x, y) {
  //   const index = y*this.width + x;
  //   return this.items[index];
  //
  // }
  // getElement(x, y) {
  //   const item = this.getItem(x, y);
  //   if (item) {
  //     return item.element;
  //   }
  // }
  //
  // getSelectedElements() {
  //   const elements = [];
  //   if (this.selection) {
  //     for (let j = 0; j < this.selection.height; j++) {
  //       for (let i = 0; i < this.selection.width; i++) {
  //         const index = (this.selection.y + j)*this.width + this.selection.x + i;
  //         const item = this.items[index];
  //         elements.push(item.element);
  //       }
  //     }
  //   }
  //   return elements;
  // }
  //
  // getSelectedItems() {
  //   const items = [];
  //   if (this.selection) {
  //     for (let j = 0; j < this.selection.height; j++) {
  //       for (let i = 0; i < this.selection.width; i++) {
  //         const index = (this.selection.y + j)*this.width + this.selection.x + i;
  //         const item = this.items[index];
  //         items.push(item);
  //       }
  //     }
  //   }
  //   return items;
  // }
  //
  // async getSelectedData() {
  //   const data = [];
  //   if (this.selection) {
  //     for (let j = 0; j < this.selection.height; j++) {
  //       const row = [];
  //       for (let i = 0; i < this.selection.width; i++) {
  //         const index = (this.selection.y + j)*this.width + this.selection.x + i;
  //         const item = this.items[index];
  //         const value = await item.field.exportValue();
  //         row.push(value);
  //       }
  //       data.push(row);
  //     }
  //   }
  //   return data;
  // }

  paintCells() {
    if (this.cellSelection) {
      for (let j = 0; j < this.cellSelection.height; j++) {
        for (let i = 0; i < this.cellSelection.width; i++) {
          this.items[this.cellSelection.y + j].cells[this.cellSelection.x + i].element.classList.add("selecting-cell");
        }
      }
    }
  }

  unpaintCells() {
    if (this.cellSelection) {
      for (let j = 0; j < this.cellSelection.height; j++) {
        for (let i = 0; i < this.cellSelection.width; i++) {
          this.items[this.cellSelection.y + j].cells[this.cellSelection.x + i].element.classList.remove("selecting-cell");
        }
      }
    }
  }

  growCellSelection(rectangle) {

    if (!this.startRectangle) {

      this.startRectangle = rectangle;

    }

    let selection = KarmaFieldsAlpha.Rect.union(this.startRectangle, rectangle);

    if (!this.cellSelection || !KarmaFieldsAlpha.Rect.equals(selection, this.cellSelection)) {

      this.unpaintCells();

      this.cellSelection = selection;

      this.paintCells();

    }

  }

  // completeCellSelection() {
  //   if (this.onCellSelectionComplete) {
  //     this.onCellSelectionComplete(this);
  //   }
  // }

  // startSelection(rect) {
  //   if (this.onSelectionStart) {
  //     this.onSelectionStart(this);
  //   }
  //   if (!this.startRect || !event.shiftKey) {
  //     this.startRect = rect;
  //   }
  // }


  updateCellSelection(rectangle) {

    this.unpaintCells(this.cellSelection);

    this.cellSelection = rectangle;

    this.paintCells(this.cellSelection);

  }

  reset() {

    this.updateCellSelection();

    super.reset(); // this.items = [];

    this.headers = [];
    this.width = 0;
    this.height = 0;

  }

  registerHeader(col, element) {

    this.headers[col] = element;

    this.width = Math.max(col+1, this.width);

    element.onmousedown = event => {

      if (event.buttons === 1) {

        event.preventDefault(); // -> prevent focus lose...

        const onMouseMove = event => {

          const col = this.headers.findIndex(element => KarmaFieldsAlpha.Rect.contains(element.getBoundingClientRect(), event.clientX, event.clientY));

          if (col > -1) {
            this.updateCellSelection({
              x: col,
              y: 0,
              width: 1,
              height: this.height});
          }
        }

        const onMouseUp = event =>  {
          document.removeEventListener("mouseup", onMouseUp);
          document.removeEventListener("mousemove", onMouseMove);

          onMouseMove(event);

          if (this.onCellSelectionComplete) {
            this.onCellSelectionComplete(this.cellSelection);
          }

        }

        this.startRectangle = null;

        onMouseMove(event);

        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);

      }

    }


  }

  registerCell(element, col, row, active, param = {}) {

    const item = this.items[row] || this.registerItem(row);

    const cell = {
      element: element,
      param: param, // -> deprec
      box: {},
      row: row, // -> deprec
      col: col, // -> deprec
      ...param
    }

    this.items[row].cells[col] = cell;

    this.width = Math.max(col+1, this.width);
    this.height = Math.max(row+1, this.height);



    if (active) {

      element.onmousedown = event => {

        if (event.buttons === 1) {

          event.preventDefault(); // -> prevent focus lose...

          const onMouseMove = event => {

            const rectangle = this.findCellRectangle(event.clientX, event.clientY);

            if (rectangle) {
              this.growCellSelection(rectangle);
            }

          }

          const onMouseUp = event =>  {
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("mousemove", onMouseMove);

            onMouseMove(event);

            if (this.onCellSelectionComplete) {
              this.onCellSelectionComplete(this.cellSelection);
            }

          }

          this.startRectangle = null;

          onMouseMove(event);

          document.addEventListener("mouseup", onMouseUp);
          document.addEventListener("mousemove", onMouseMove);

        }

      }

    }

  }

  findCellRectangle(mouseX, mouseY) {

    for (let j = 0; j < this.items.length; j++) {

      for (let i = 0; i < this.items[j].cells.length; i++) {

        if (KarmaFieldsAlpha.Rect.contains(this.items[j].cells[i].element.getBoundingClientRect(), mouseX, mouseY)) {

          return {x: i, y: j, width: 1, height: 1};

        }

      }

    }

  }

}
