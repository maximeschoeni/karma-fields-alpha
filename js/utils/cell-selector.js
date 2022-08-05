

KarmaFieldsAlpha.CellSelector = class {

  constructor() {

    this.items = [];
    this.headerItems = [];
    this.width = 0;
    this.height = 0;

  }

  async setData(data) {
    if (this.selection) {
      for (let j = 0; j < Math.max(this.selection.height, data.length); j++) {
        for (let i = 0; i < Math.max(this.selection.width, data[j%data.length].length); i++) {

          const index = (this.selection.y + j)*this.width + this.selection.x + i;
          const item = this.items[index];

          if (item) {
            const value = data[j%data.length][i%data[j%data.length].length];

            // await item.field.dispatch({
    				// 	action: "set",
    				// 	backup: true,
    				// 	data: [value]
    				// });

            item.field.importValue(value);

          }
        }
      }
    }
  }

  countSelection() {
    return this.selection.width*this.selection.height;
  }

  getItem(x, y) {
    const index = y*this.width + x;
    return this.items[index];

  }
  getElement(x, y) {
    const item = this.getItem(x, y);
    if (item) {
      return item.element;
    }
  }

  getSelectedElements() {
    const elements = [];
    if (this.selection) {
      for (let j = 0; j < this.selection.height; j++) {
        for (let i = 0; i < this.selection.width; i++) {
          const index = (this.selection.y + j)*this.width + this.selection.x + i;
          const item = this.items[index];
          elements.push(item.element);
        }
      }
    }
    return elements;
  }

  getSelectedItems() {
    const items = [];
    if (this.selection) {
      for (let j = 0; j < this.selection.height; j++) {
        for (let i = 0; i < this.selection.width; i++) {
          const index = (this.selection.y + j)*this.width + this.selection.x + i;
          const item = this.items[index];
          items.push(item);
        }
      }
    }
    return items;
  }

  async getSelectedData() {
    const data = [];
    if (this.selection) {
      for (let j = 0; j < this.selection.height; j++) {
        const row = [];
        for (let i = 0; i < this.selection.width; i++) {
          const index = (this.selection.y + j)*this.width + this.selection.x + i;
          const item = this.items[index];
          const value = await item.field.exportValue();
          row.push(value);
        }
        data.push(row);
      }
    }
    return data;
  }

  updateSelection(rect) {

    let selection = KarmaFieldsAlpha.Rect.union(this.startRect, rect);

    if (!this.selection || !KarmaFieldsAlpha.Rect.equals(selection, this.selection)) {

      if (this.selection && this.onUnselect) {
        this.onUnselect(this);
      }

      this.selection = selection;

      if (this.onSelect) {
        this.onSelect(this);
      }

    }

  }

  completeSelection() {
    if (this.onSelectionComplete) {
      this.onSelectionComplete(this);
    }
  }

  startSelection(rect) {
    if (this.onSelectionStart) {
      this.onSelectionStart(this);
    }
    if (!this.startRect || !event.shiftKey) {
      this.startRect = rect;
    }
  }


  clearSelection() {

    if (this.selection && this.onUnselect) {
      this.onUnselect(this);
    }

    this.selection = null;
    this.startRect = null;

  }

  reset() {

    this.items = [];
    this.headerItems = [];
    this.width = 0;
    this.height = 0;

    this.selection = null;
    this.startRect = null;

    this.selectMode = null;

  }

  registerCell(element, col, row, field, active) {

    const index = this.items.length;

    // element.style.order = index;

    const item = {
      element: element,
      x: col,
      y: row,
      field: field
      // index: index
    };

    this.items.push(item);

    this.width = Math.max(col+1, this.width);
    this.height = Math.max(row+1, this.height);

    if (active) {

      element.onmousedown = event => {

        if (event.buttons === 1) {

          // event.preventDefault(); // -> prevent focus lose on TA

          const onMouseMove = event => {

            const item = this.items.find(item => KarmaFieldsAlpha.Rect.contains(item.element.getBoundingClientRect(), event.clientX, event.clientY));

            if (item) {
              this.updateSelection({x: item.x, y: item.y, width: 1, height: 1});
            }

          }

          const onMouseUp = event =>  {
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("mousemove", onMouseMove);

            onMouseMove(event);

            this.completeSelection();

          }

          this.startSelection({x: col, y: row, width: 1, height: 1});


          onMouseMove(event);

          document.addEventListener("mouseup", onMouseUp);
          document.addEventListener("mousemove", onMouseMove);

        }

      }

    }

  }


  registerHeader(element, col) {

    this.headerItems.push({
      element: element,
      x: col
    });

    this.width = Math.max(col+1, this.width);

    element.onmousedown = event => {

      if (event.buttons === 1) {

        // event.preventDefault(); // -> prevent focus lose...

        const onMouseMove = event => {
          const headerItem = this.headerItems.find(item => KarmaFieldsAlpha.Rect.contains(item.element.getBoundingClientRect(), event.clientX, event.clientY));
          if (headerItem) {
            this.updateSelection({
              x: headerItem.x,
              y: 0,
              width: 1,
              height: this.height});
          }
        }

        const onMouseUp = event =>  {
          document.removeEventListener("mouseup", onMouseUp);
          document.removeEventListener("mousemove", onMouseMove);

          onMouseMove(event);

          this.completeSelection();

        }

        this.startSelection({x: col, y:0, width: 1, height: this.height});

        onMouseMove(event);

        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);

      }

    }


  }


}
