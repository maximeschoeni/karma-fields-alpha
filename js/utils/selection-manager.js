

KarmaFieldsAlpha.SelectionManager = class {

  constructor() {

    this.items = [];
    this.headerItems = [];
    this.width = 0;
    this.height = 0;

  }

  countSelection() {
    return this.selection.width*this.selection.height;
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

  getSelectedIds() {
    const ids = [];
    if (this.selection) {
      for (let j = 0; j < this.selection.height; j++) {
        const index = (this.selection.y + j)*this.width;
        ids.push(this.items[index].id);
      }
    }
    return ids;
  }

  // pickItems(rect) {
  //
  //   const items = [];
  //
  //   for (let j = rect.y; j < rect.y + rect.height; j++) {
  //     for (let i = rect.x; i < rect.x + rect.width; i++) {
  //       let index = j*this.width + i;
  //       if (this.items[index]) {
  //         items.push(this.items[index]);
  //       }
  //     }
  //   }
  //
  //   return items;
  // }

  // pickIds(rect) {
  //
  //   const ids = [];
  //
  //   for (let j = rect.y; j < rect.y + rect.height; j++) {
  //     rows.push(this.items[j].id);
  //   }
  //
  //   return rows;
  // }


  updateSelection(rect, selectMode) {

    let selection = KarmaFieldsAlpha.Rect.union(this.startRect, rect);

    if (!this.selection || !KarmaFieldsAlpha.Rect.equals(selection, this.selection)) {

      if (this.selection && this.onUnselect) {
        this.onUnselect(selectMode);
      }

      this.selection = selection;

      if (this.onSelect) {
        this.onSelect(selectMode);
      }

    }

  }

  completeSelection(selectMode) {
    if (this.onSelectionComplete) {
      this.onSelectionComplete(selectMode);
    }
  }

  startSelection(rect, selectMode) {
    if (this.onSelectionStart) {
      this.onSelectionStart(selectMode);
    }
    if (!this.startRect || !event.shiftKey) {
      this.startRect = rect;
    }
  }


  clearSelection() {

    if (this.selection && this.onUnselect) {
      this.onUnselect(this.selectMode);
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

  }

  registerCell(element, col, row, id, field, selectMode, isSelected) {

    this.items.push({
      element: element,
      x: col,
      y: row,
      id: id,
      field: field
    });

    this.width = Math.max(col+1, this.width);
    this.height = Math.max(row+1, this.height);

    element.onmousedown = event => {

      if (event.buttons === 1) {

        // event.preventDefault(); // -> prevent focus lose on TA

        const onMouseMove = event => {

          const item = this.items.find(item => KarmaFieldsAlpha.Rect.contains(item.element.getBoundingClientRect(), event.clientX, event.clientY));

          if (item) {

            if (selectMode === "cell") {

              this.updateSelection({x: item.x, y: item.y, width: 1, height: 1}, selectMode);

            } else if (selectMode === "row") {

              this.updateSelection({x: 0, y: item.y, width: this.width, height: 1}, selectMode);

            }

          }

        }

        const onMouseUp = event =>  {
          document.removeEventListener("mouseup", onMouseUp);
          document.removeEventListener("mousemove", onMouseMove);

          onMouseMove(event);

          this.completeSelection(selectMode);

        }

        this.startSelection({x: col, y: row, width: 1, height: 1}, selectMode);

        onMouseMove(event);

        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);

      }

    }

  }


  registerHeader(element, col) {

    this.headerItems.push({
      element: element,
      x: col
    });

    this.width = Math.max(col+1, this.width);

    const selectMode = "cell";

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
              height: this.height}, selectMode);
          }
        }

        const onMouseUp = event =>  {
          document.removeEventListener("mouseup", onMouseUp);
          document.removeEventListener("mousemove", onMouseMove);

          onMouseMove(event);

          this.completeSelection(selectMode);

        }

        this.startSelection({x: col, y:0, width: 1, height: this.height}, selectMode);

        onMouseMove(event);

        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);

      }

    }




  }



}
