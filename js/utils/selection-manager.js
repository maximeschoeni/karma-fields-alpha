

KarmaFieldsAlpha.SelectionManager = class {

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

    this.selectMode = null;

  }

  isSelected(id) {
    return this.selectMode !== "cell" && this.getSelectedIds().includes(id);
  }

  registerCell(element, col, row, id, field, selectMode, isSelected) {

    const index = this.items.length;

    // element.style.order = index;

    const item = {
      element: element,
      x: col,
      y: row,
      id: id,
      field: field
      // index: index
    };

    this.items.push(item);

    this.width = Math.max(col+1, this.width);
    this.height = Math.max(row+1, this.height);

    element.onmousedown = event => {

      if (event.buttons === 1) {

        if (this.isSelected(id)) {

          event.preventDefault(); // -> prevent TA focusout

          this.startDrag(item, event.clientX, event.clientY);

          const mousemove = event => {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
            this.drag();
          }

          const scroll = event => {
            this.scrollDiffY = this.scrollContainer.scrollTop - this.scrollTop;
            this.drag();
          }

          const mouseup = event => {
            window.removeEventListener("mousemove", mousemove);
            window.removeEventListener("mouseup", mouseup);
            window.removeEventListener("scroll", scroll);
            // setTimeout(() => {
            //   document.body.classList.remove("karma-dragging");
            // }, 300);
            this.drop();
          }

          this.drag();

          window.addEventListener("mousemove", mousemove);
          window.addEventListener("mouseup", mouseup);
          window.addEventListener("scroll", scroll);

        }

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

        this.selectMode = selectMode;

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

        this.selectMode = selectMode;

        onMouseMove(event);

        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);

      }

    }




  }

  shift(element, offset) {
    const state = this.map.get(element);
    state.index += offset;
    element.style.order = state.index.toString();
  }

  // spliceItem(item, index) {
  //   if (index > item.index) {
  //
  //     for (let i = item.index + 1; i < index; i++) {
  //       let newIndex = this.items[i-1].index;
  //       this.items[i].index = newIndex;
  //       this.items[i].element.order = newIndex;
  //       this.items[i].row = newIndex;
  //     }
  //     this.items.splice(item.index, 1);
  //     this.items.splice(index, 0, item);
  //
  //   } else if (index > item.index) {
  //
  //     for (let i = index; i < item.index - 1) {
  //       let newIndex = this.items[i+1].index;
  //       this.items[i].index = newIndex;
  //       this.items[i].element.order = newIndex;
  //       this.items[i].row = newIndex;
  //     }
  //     this.items.splice(item.index, 1);
  //     this.items.splice(index, 0, item);
  //
  //   }
  // }
  //
  // spliceItem(item, index) {
  //
  //   this.items.splice(item.index, 1);
  //   this.items.splice(index, 0, item);
  //
  //   const first = Math.min(index, item.index);
  //   const last = Math.max(index, item.index);
  //   const x = index%this.width;
  //   const y = Math.floor(index/this.width);
  //
  //   for (let i = Math.min(index, item.index); i < Math.max(index, item.index); i++) {
  //     this.items[i].index = i;
  //     this.items[i].element.order = i;
  //     this.items[i].row = i;
  //   }
  //
  // }

  getItemIndex(item) {
    return item.y*this.width + item.x;
  }

  getIndex(x, y) {
    return y*this.width + x;
  }

  getX(index) {
    return index%this.width;
  }

  getY(index) {
    return Math.floor(index/this.width);
  }

  spliceItem(item, x, y) {

    if (x !== item.x) {

      const minX = Math.min(x, item.x);
      const maxX = Math.max(x, item.x);

      const itemIndex = item.y*this.width + item.x;
      const index = item.y*this.width + x;

      this.items.splice(itemIndex, 1);
      this.items.splice(index, 0, item);

      for (let i = minX; i < maxX; i++) {
        const index = item.y*this.width + i;
        const item = this.items[index];
        item.element.order = index;
        item.x = i;
      }

    }

    if (y !== item.y) {

      const minY = Math.min(y, item.y);
      const maxY = Math.max(y, item.y);

      const itemIndex = item.y*this.width + item.x;
      const index = y*this.width + item.x;

      this.items.splice(itemIndex, 1);
      this.items.splice(index, 0, item);

      for (let i = minY; i < maxY; i++) {
        const index = i*this.width + item.x;
        const item = this.items[index];
        item.element.order = index;
        item.y = i;
      }

    }

  }


  splice(index, x, y) {

    const itemX = this.getX(index);
    const itemY = this.getY(index);

    if (x !== itemX) {

      const target = this.getIndex(itemX, y);
      const [item] = this.items.splice(index, 1);
      this.items.splice(target, 0, item);
      index = target;

    }

    if (y !== itemY) {

      const target = this.getIndex(x, y);
      const [item] = this.items.splice(index, 1);
      this.items.splice(target, 0, item);

    }

    const target = this.getIndex(x, y);
    const min = Math.min(index, target);
    const max = Math.min(index, target);

    for (let i = min; i < max; i++) {
      this.items[i].element.order = i;
    }

  }


  startDrag(item, pointerX, pointerY) {

    const index = this.getIndex(item.x, item.y);

    this.pointerX = pointerX;
    this.pointerY = pointerY;
    this.mouseX = this.pointerX;
    this.mouseY = this.pointerY;
    this.scrollTop = this.scrollContainer.scrollTop;
    this.scrollDiffY = 0;
    this.index = this.getIndex(this.selection.x, this.selection.y);

    this.item = item;
    this.indexOffset = index - this.index;

    this.offsetLeft = this.element.offsetLeft;
    this.originOffsetLeft = this.offsetLeft;

    this.offsetTop = this.element.offsetTop;
    this.originOffsetTop = this.offsetTop;

    this.item.element.classList.add("grabbing");
    // this.container.classList.add("dragging");

    if (this.onStartDrag) {
      this.onStartDrag();
    }

    const elements = this.getSelectedElements();

    elements.forEach(element => {
      element.classList.add("drag");
    });
  }

  drag(pointerX, pointerY) {

    const Rect = KarmaFieldsAlpha.Rect;

    if (!this.selection) {
      return;
    }

    let diffX = this.getDiffX();
    let diffY = this.getDiffY();



    const firstItem = this.getItem(this.selection.x, this.selection.y);
    const lastItem = this.getItem(this.selection.x+this.selection.width-1, this.selection.y+this.selection.height-1);
    const prevItem = this.getItem(this.selection.x, this.selection.y-1);
    const nextItem = this.getItem(this.selection.x, this.selection.y+this.selection.height);

    const grabItem = this.getItem(this.selection.x, this.selection.y+this.rowOffset);
    const grabItemPrev = this.getItem(this.selection.x, this.selection.y+this.rowOffset-1);
    const grabItemNext = this.getItem(this.selection.x, this.selection.y+this.rowOffset+1);

    // if (prevElement && grabElementPrev && Rect.fromElement(grabElement).offset(diffX, diffY).isBefore(Rect.fromElement(grabElementPrev))) {
    if (prevItem && grabItemPrev && Rect.isBefore(Rect.offset(Rect.fromElement(grabItem.element), diffX, diffY), Rect.fromElement(grabItemPrev.element))) {


      // this.shift(prevItem, this.selection.length);
      //
      // this.selection.index--;
      // elements.forEach(element => {
      //   this.shift(element, -1);
      // });

      this.spliceItem(prevItem, lastItem.x, lastItem.y);

      this.selection.y--;

      this.offsetLeft = this.element.offsetLeft;
      this.offsetTop = this.element.offsetTop;

      diffX = this.getDiffX();
      diffY = this.getDiffY();

    // } else if (nextElement && !this.map.get(nextElement).plus && grabElementNext && KarmaFieldsAlpha.Rect.fromElement(grabElement).offset(diffX, diffY).isAfter(KarmaFieldsAlpha.Rect.fromElement(grabElementNext))) {
    } else if (nextItem && nextItem.draggable !== false && grabItemNext && Rect.isAfter(Rect.offset(Rect.fromElement(grabItem.element), diffX, diffY), Rect.fromElement(grabItemNext.element))) {

      // this.shift(nextElement, -this.selection.length);
      //
      // this.selection.index++;
      // elements.forEach(element => {
      //   this.shift(element, 1);
      // });


      this.spliceItem(nextItem, firstItem.x, firstItem.y);

      this.selection.y++;

      this.offsetLeft = this.element.offsetLeft;
      this.offsetTop = this.element.offsetTop;

      diffX = this.getDiffX();
      diffY = this.getDiffY();
    }

    // const outside = !KarmaFieldsAlpha.Rect.fromElement(this.container).intersects(KarmaFieldsAlpha.Rect.fromElement(firstElement).union(KarmaFieldsAlpha.Rect.fromElement(lastElement)).offset(diffX, diffY));
    //

    const elements = this.getSelectedElements();

    elements.forEach(element => {
      element.style.transform = "translate("+diffX+"px, "+diffY+"px)";
      // element.classList.toggle("outside", outside);
    });



  }

  async drop() {
    if (this.selection) {
      this.getElements(this.selection).forEach(element => {
        element.classList.remove("drag");
        element.style.transform = "none";
        element.classList.remove("outside");
      });

      this.item.element.classList.remove("grabbing");

      // this.container.classList.remove("dragging");
      if (this.onEndDrag) {
        this.onEndDrag();
      }

      // let diffX = this.getDiffX();
      // let diffY = this.getDiffY();
      //
      // const firstItem = this.getItem(this.selection.x, this.selection.y);
      // const lastItem = this.getElement(this.selection.x + this.selection.width-1, this.selection.y + this.selection.height-1);

      // const Rect = KarmaFieldsAlpha.Rect;

      // if (!Rect.intersects(Rect.fromElement(this.container), Rect.union(Rect.fromElement(firstItem.element), Rect.offset(Rect.fromElement(lastItem.element)), diffX, diffY))) {
      //   await this.insert([], this.selection.index, this.selection.length);
      //   this.ta.blur();
      //   await this.render();
      // } else if (this.index !== this.selection.index) {
      //   await this.swapRange(this.index, this.selection.index, this.selection.length);
      //   this.ta.blur();
      //
      // }

      const first = this.getIndex(this.selection.x, this.selection.y);
      const last = this.getIndex(this.selection.x + this.selection.width - 1, this.selection.y + this.selection.height - 1);

      if (this.index !== first) {
        // await this.swapRange(this.index, first, last - first);
        if (this.onSwap) {
          this.onSwap(this.index, first, last - first + 1);
        }
        // this.ta.blur();
      }
    }
  }



}
