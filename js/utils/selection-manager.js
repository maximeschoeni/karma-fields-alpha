

KarmaFieldsAlpha.SelectionManager = class {

  constructor() {

    this.items = [];
    this.headerItems = [];
    this.width = 0;
    this.height = 0;

  }

  pickItems(rect) {

    const items = [];

    for (let j = rect.y; j < rect.y + rect.height; j++) {
      for (let i = rect.x; i < rect.x + rect.width; i++) {
        let index = j*this.width + i;
        if (this.items[index]) {
          items.push(this.items[index]);
        }
      }
    }

    return items;
  }

  pickIds(rect) {

    const ids = [];

    for (let j = rect.y; j < rect.y + rect.height; j++) {
      rows.push(this.items[j].id);
    }

    return rows;
  }


  updateSelection(rect) {

    let selection = KarmaFieldsAlpha.Rect.union(this.startRect, rect);

    if (!this.selection || !KarmaFieldsAlpha.Rect.equals(selection, this.selection)) {

      if (this.selection && this.onUnselect) {
        this.onUnselect(this.pickItems(this.selection), this.selectMode);
      }

      if (this.onSelect) {
        this.onSelect(this.pickItems(selection), this.selectMode);
      }

      this.selection = selection;

    }

  }

  completeSelection(selectMode) {
    // if (this.onSelectedIds) {
    //   this.onSelectedIds(this.pickIds(this.selection), selectMode);
    // }
    if (this.onSelectionComplete) {
      this.onSelectionComplete(this.pickCells(this.selection), this.pickIds(this.selection), selectMode);
    }
  }

  startSelection(selectMode) {
    if (this.onSelectionStart) {
      this.onSelectionStart(selectMode);
    }
    if (!this.startRect && !event.shiftKey) {
      this.startRect = {x: col, y:0, width: 1, height: this.height};
    }
  }


  registerCell(element, col, row, id, field, selectMode) {

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

        event.preventDefault(); // -> prevent focus lose on TA

        const onMouseMove = event => {

          const item = this.items.find(item => KarmaFieldsAlpha.Rect.contains(item.element.getBoundingClientRect(), event.clientX, event.clientY));

          if (item) {

            if (selectMode === "cell") {
              this.updateSelection({
                x: item.x,
                y: item.y,
                width: 1,
                height: 1});
            } else if (selectMode === "row") {
              this.updateSelection({
                x: 0,
                y: item.y,
                width: this.width,
                height: 1});
            }

          }

        }

        const onMouseUp = event =>  {
          document.removeEventListener("mouseup", onMouseUp);
          document.removeEventListener("mousemove", onMouseMove);

          onMouseMove(event);

          this.completeSelection(selectMode);

        }

        this.startSelection(selectMode);

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

    element.onmousedown = event => {

      if (event.buttons === 1) {

        event.preventDefault(); // -> prevent focus lose...

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

          this.completeSelection("col");

        }

        this.startSelection("col");

        onMouseMove(event);

        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);

      }

    }




  }



}
