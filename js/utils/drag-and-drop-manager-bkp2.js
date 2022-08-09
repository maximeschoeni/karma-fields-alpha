

KarmaFieldsAlpha.DragAndDropManager = class extends KarmaFieldsAlpha.IdSelector {

  constructor() {

    super();

    // this.items = [];

    this.onSelectElement = element => {
      element.classList.add("selected");
    }
    this.onUnselectElement = element => {
      element.classList.remove("selected");
      element.classList.remove("active");
    }

  }

  // getItems(segment) {
  //   const items = [];
  //   for (let i = segment.index; i < segment.index + segment.length; i++) {
  //     items.push(this.items[i]);
  //   }
  //   return items;
  // }
  //
  // getSelectedItems() {
  //   if (this.selection) {
  //     return this.getItems(this.selection);
  //   }
  //   return [];
  // }

  // reset() {
  //
  //   this.items = [];
  //
  // }
  //
  // isSelected(id) {
  //   return this.getSelectedItems().some(item => item.id === id);
  // }

  // growSelection(segment) {
  //   if (this.selection) {
  //     this.selection = KarmaFieldsAlpha.Segment.union(this.selection, segment);
  //   } else {
  //     this.selection = segment;
  //   }
  // }

  registerContainer(element) {

    this.element = element;


    // this.idSelector.onSelectionComplete = async manager => {
    //   this.selectedIds = manager.getSelectedItems().map(item => item.id);
    //
    //   this.clipboard.setData(this.selectedIds.map(id => [id]));
    //
    //   // container.element.classList.toggle("focus", this.selectedIds.length === 0);
    //
    //   await this.render();
    // }


  }

  render() {

    const gap = 1;

    let y = gap;
    let x = gap;

    let nextY = gap;

    for (let item of this.items) {

      const clientWidth = this.element.clientWidth - gap*(item.cells.length-1);

      item.box = {};
      item.box.x = x;
      item.box.y = y;
      item.box.width = 0;
      item.box.height = 0;

      for (let i = 0; i < item.cells.length; i++) {

        item.cells[i].box = {};
        item.cells[i].box.width = item.cells[i].param.minWidth || 0;
        item.cells[i].box.height = item.cells[i].param.minHeight || 0;
        item.box.width += item.cells[i].box.width;
        if (i < item.cells.length - 1) {
          item.box.width += gap;
        }
        item.box.height = Math.max(item.box.height, item.cells[i].param.minHeight || 0);
      }

      let diff = (this.element.clientWidth - item.box.width - gap*2)/item.cells.length;
      let noMax = 0;
      item.box.width = 0;

      for (let i = 0; i < item.cells.length; i++) {

        item.cells[i].box.width = item.cells[i].box.width + diff;

        if (item.cells[i].param.maxWidth) {
          item.cells[i].box.width = Math.min(item.cells[i].param.maxWidth, item.cells[i].box.width);
        } else {
          noMax++;
        }

        item.box.width += item.cells[i].box.width;
        if (i < item.cells.length - 1) {
          item.box.width += gap;
        }
        item.box.height = Math.min(item.box.height, item.cells[i].param.maxHeight || 0);

      }

      if (noMax) {

        diff = (this.element.clientWidth - item.box.width - gap*2)/noMax;
        item.box.width = 0;

        for (let i = 0; i < item.cells.length; i++) {

          if (!item.cells[i].param.maxWidth) {
            item.cells[i].box.width += diff;
          }

          item.box.width += item.cells[i].box.width;

          if (i < item.cells.length - 1) {
            item.box.width += gap;
          }

        }

      }



      if (x + item.box.width + gap > this.element.clientWidth) {
        x = gap;
        y = nextY;
        item.box.x = x;
        item.box.y = y;
        // y += item.box.height + gap;
      }

      nextY = y + item.box.height + gap;

      for (let i = 0; i < item.cells.length; i++) {

        item.cells[i].box.x = x;
        item.cells[i].box.y = item.box.y;
        x += item.cells[0].box.width + gap;

        item.cells[i].element.style.width = `${item.cells[i].box.width.toFixed(4)}px`;
        item.cells[i].element.style.height = `${item.cells[i].box.height.toFixed(4)}px`;
        item.cells[i].element.style.transform = `translate(${item.cells[i].box.x}px, ${item.cells[i].box.y}px)`;

      }


    }

    this.element.style.height = `${nextY.toFixed(4)}px`;

  }


  registerItem(id, index) {

    const item = super.registerItem(id, index);

    item.order = index;
    item.parent = 0;
    item.cells = [];

    // this.items[index] = {
    //   id: id,
    //   order: index,
    //   parent: 0,
    //   elements: []
    // };

    // if (selected) {
    //   this.growSelection({index: index, length: 1});
    //
    // }


    return item;

  }

  // registerCell(index, element, param = {}) {
  //
  //   const isSelected = Boolean(this.selection && KarmaFieldsAlpha.Segment.contains(this.selection, index));
  //
  //   element.classList.toggle("active", isSelected);
  //
  //   super.registerCell(index, element, param, !isSelected);
  //
  //   if (isSelected) {
  //
  //     element.onmousedown = event => {
  //
  //       if (event.buttons === 1) {
  //
  //         event.preventDefault(); // -> prevent TA focusout
  //
  //         this.startDrag(index, event.clientX, event.clientY);
  //
  //         const mousemove = event => {
  //           this.drag(event.clientX, event.clientY);
  //         }
  //
  //         const scroll = event => {
  //           this.scrollDiffY = this.scrollContainer.scrollTop - this.scrollTop;
  //           this.drag();
  //         }
  //
  //         const mouseup = event => {
  //           window.removeEventListener("mousemove", mousemove);
  //           window.removeEventListener("mouseup", mouseup);
  //           window.removeEventListener("scroll", scroll);
  //           this.drop();
  //         }
  //
  //         this.drag(event.clientX, event.clientY);
  //
  //         window.addEventListener("mousemove", mousemove);
  //         window.addEventListener("mouseup", mouseup);
  //         window.addEventListener("scroll", scroll);
  //
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

  onMouseDown(index, event) {

    if (this.selection && KarmaFieldsAlpha.Segment.contains(this.selection, index)) {

      this.startDrag(index, event.clientX, event.clientY);

      const mousemove = event => {
        this.drag(event.clientX, event.clientY);
      }

      const scroll = event => {
        this.scrollDiffY = this.scrollContainer.scrollTop - this.scrollTop;
        this.drag();
      }

      const mouseup = event => {
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
        window.removeEventListener("scroll", scroll);
        this.drop();
      }

      this.drag(event.clientX, event.clientY);

      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
      window.addEventListener("scroll", scroll);

    } else {

      super.onMouseDown(index, event);

    }

  }

  splice(index, length, target) {

    const items = this.items.splice(index, length);
    this.items.splice(target - length + 1, 0, ...items);

    // const min = Math.min(index, target);
    // const max = Math.min(index, target);
    //
    // for (let i = min; i < max; i++) {
    //   this.items[i].elements.forEach(element => {
    //     element.style.order = i;
    //   });
    //   this.items[i]
    // }

    this.render();
  }

  swap(index, length, target) {

    const items = this.items.splice(index, length);
    this.items.splice(target, 0, ...items);

    // const min = Math.min(index, target);
    // const max = Math.min(index, target);
    //
    // for (let i = min; i < max; i++) {
    //   this.items[i].elements.forEach(element => {
    //     element.style.order = i;
    //   });
    //   this.items[i]
    // }

    this.render();
  }

  // getDiffX() {
  //   return this.mouseX - this.pointerX - (this.offsetLeft - this.originOffsetLeft);
  // }
  //
  // getDiffY() {
  //   return this.mouseY - (this.pointerY) + this.scrollDiffY - (this.offsetTop - this.originOffsetTop);
  // }

  // getRect(index) {
  //   const item = this.items[index];
  //   const firstElement = item.elements[0];
  //   const lastElement = item.elements[item.elements.length-1];
  //   return {
  //     x: firstElement.offsetLeft,
  //     y: lastElement.offsetTop,
  //     width: lastElement.x + lastElement.width - firstElement.x,
  //     height: lastElement.y + lastElement.height - firstElement.y
  //   }
  // }

  getRect(segment) {

    const item = this.items[segment.index];
    const lastItem = this.items[segment.index + segment.length - 1];
    const firstBox = item.cells[0].box;
    const lastBox = lastItem.cells[lastItem.cells.length-1].box;
    return {
      x: firstBox.x,
      y: firstBox.y,
      width: lastBox.x + lastBox.width - firstBox.left,
      height: lastBox.y + lastBox.height - firstBox.top
    }

  }

  findIndex(mouseX, mouseY) {
    const box = this.element.getBoundingClientRect();

    const x = mouseX - box.left;
    const y = mouseY - box.top;

    return this.items.findIndex(item => KarmaFieldsAlpha.Rect.contains(item.box, x, y));
  }

  completeSelection() {
    super.completeSelection();

    this.getSelectedItems().forEach(item => {
      item.cells.forEach(cell => {
        cell.element.classList.add("active");
      });
    });
  }


  startDrag(index, pointerX, pointerY) {

    console.log(this.items);

    // const index = this.getIndex(item.x, item.y);

    this.currentRect = this.getRect({index: index, length:1});

    const box = this.element.getBoundingClientRect();

    this.mouseX = pointerX - box.left;
    this.mouseY = pointerY - box.top;

    this.offsetX = this.mouseX - this.currentRect.x;
    this.offsetY = this.mouseY - this.currentRect.y;

    this.originX = this.mouseX;
    this.originY = this.mouseY;


    // this.pointerX = pointerX;
    // this.pointerY = pointerY;
    // this.mouseX = this.pointerX;
    // this.mouseY = this.pointerY;
    // this.scrollTop = this.scrollContainer.scrollTop;
    // this.scrollDiffY = 0;
    this.index = this.selection.index;

    this.indexOffset = index - this.index;


    // this.offsetLeft = this.element.offsetLeft;
    // this.originOffsetLeft = this.offsetLeft;
    //
    // this.offsetTop = this.element.offsetTop;
    // this.originOffsetTop = this.offsetTop;

    // this.item.element.classList.add("grabbing");

    // item.elements.forEach(element => {
    //   element.classList.add("grabbing");
    // });

    // this.container.classList.add("dragging");

    if (this.onStartDrag) {
      this.onStartDrag();
    }

    this.getSelectedItems().forEach(item => {
      item.cells.forEach(cell => {
        cell.element.classList.add("drag");
      });
    });
  }

  // isBefore() {
  //   const first = this.selection.index;
  //
  //   if (first > 0) {
  //
  //     const before = first - 1;
  //     const current = first + this.indexOffset;
  //     const prev = current - 1;
  //
  //     const currentRect = this.getRect({index: current, length: 1});
  //     const prevRect = this.getRect({index: prev, length: 1});
  //     const beforeRect = this.getRect({index: before, length: 1});
  //
  //     const currentRectOffset = Rect.offset(currentRect, this.mouseX - currentRect.x, this.mouseY - currentRect.y);
  //     const beforeRectOffset = Rect.offset(beforeRect, prevRect.x - beforeRect.x + prevRect.width - beforeRect.width, prevRect.y - beforeRect.y + prevRect.height - beforeRect.height);
  //
  //     return Rect.isBefore(currentRectOffset, beforeRectOffset);
  //   }
  //
  //   return false;
  // }

  // getBeforeRect() {
  //   const first = this.selection.index;
  //   const before = first - 1;
  //   const current = first + this.indexOffset;
  //   const prev = current - 1;
  //
  //   const prevRect = this.getRect({index: prev, length: 1});
  //   const beforeRect = this.getRect({index: before, length: 1});
  //
  //   return KarmaFieldsAlpha.Rect.offset(beforeRect, prevRect.x - beforeRect.x + prevRect.width - beforeRect.width, prevRect.y - beforeRect.y + prevRect.height - beforeRect.height);
  // }
  //
  // isAfter() {
  //   const last = this.selection.index + this.selection.length - 1;
  //
  //   if (last < this.items.length - 1) {
  //
  //     const after = last + 1;
  //     const current = first + this.indexOffset;
  //     const next = current + 1;
  //
  //     const currentRect = this.getRect({index: current, length: 1});
  //     const nextRect = this.getRect({index: next, length: 1});
  //     const afterRect = this.getRect({index: after, length: 1});
  //
  //     const currentRectOffset = Rect.offset(currentRect, this.mouseX - currentRect.x, this.mouseY - currentRect.y);
  //     const afterRectOffset = Rect.offset(afterRect, nextRect.x - afterRect.x, nextRect.y - afterRect.y);
  //
  //     return Rect.isAfter(currentRectOffset, afterRectOffset);
  //   }
  //
  //   return false;
  // }
  //
  // getAfterRect() {
  //   const after = this.selection.index + this.selection.length;
  //   const next = this.selection.index + this.indexOffset + 1;
  //
  //   const nextRect = this.getRect({index: next, length: 1});
  //   const afterRect = this.getRect({index: after, length: 1});
  //
  //   return KarmaFieldsAlpha.Rect.offset(afterRect, nextRect.x - afterRect.x, nextRect.y - afterRect.y);
  // }




  drag(pointerX = -1, pointerY = -1) {

    const Rect = KarmaFieldsAlpha.Rect;

    if (pointerX > -1 && pointerY > -1) {
      // this.mouseX = pointerX;
      // this.mouseY = pointerY;

      const box = this.element.getBoundingClientRect();

      this.mouseX = pointerX - box.left;
      this.mouseY = pointerY - box.top;

    }

    // let diffX = this.getDiffX();
    // let diffY = this.getDiffY();


    const first = this.selection.index;
    const last = first + this.selection.length - 1;
    const before = first - 1;
    const after = last + 1;
    const current = first + this.indexOffset;
    const prev = current - 1;
    const next = current + 1;

    // const currentRect = this.items[current].box;




    // const offsetX = this.mouseX - this.originX + this.currentRect.x - this.items[current].box.x;






    // const currentRect = this.getRect({index: current, length: 1});
    // const prevRect = this.getRect({index: prev, length: 1});
    // const nextRect = this.getRect({index: next, length: 1});
    // const beforeRect = this.getRect({index: before, length: 1});
    // const afterRect = this.getRect({index: after, length: 1});

    // const currentRectOffset = Rect.offset(currentRect, diffX, diffY);


    // const currentRectOffset = Rect.offset(currentRect, this.mouseX - this.offsetX, this.mouseY - this.offsetY);

    const currentRectOffset = {
      x: this.mouseX - this.offsetX,
      y: this.mouseY - this.offsetY,
      width: this.items[current].box.width,
      height: this.items[current].box.height
    };


    // let offset = 0;
    //
    //
    //
    // if (first > 1) {
    //   // const prevRect = this.getRect({index: prev, length: 1});
    //   // const beforeRect = this.getRect({index: before, length: 1});
    //   // const beforeRectOffset = Rect.offset(beforeRect, prevRect.x - beforeRect.x + prevRect.width - beforeRect.width, prevRect.y - beforeRect.y + prevRect.height - beforeRect.height);
    //
    //   // const prevRect = this.items[prev].box;
    //   // const beforeRect = this.items[before].box;
    //   // const beforeRectOffset = {
    //   //   x: prevRect.x + prevRect.width - beforeRect.width,
    //   //   y: prevRect.y + prevRect.height - beforeRect.height,
    //   //   width: beforeRect.width,
    //   //   height: beforeRect.height
    //   // };
    //
    //   // const beforeRectOffset = {
    //   //   x: this.items[prev].box.x + this.items[prev].box.width - this.items[before].box.width,
    //   //   y: this.items[prev].box.y + this.items[prev].box.height - this.items[before].box.height,
    //   //   width: this.items[before].box.width,
    //   //   height: this.items[before].box.height
    //   // };
    //
    //   if (KarmaFieldsAlpha.Rect.isBefore(currentRectOffset, {
    //     x: this.items[prev].box.x + this.items[prev].box.width - this.items[before].box.width,
    //     y: this.items[prev].box.y + this.items[prev].box.height - this.items[before].box.height,
    //     width: this.items[before].box.width,
    //     height: this.items[before].box.height
    //   })) {
    //     offset = -1;
    //   }
    // }
    //
    // if (!offset && last < this.items.length - 1) {
    //   // const nextRect = this.getRect({index: next, length: 1});
    //   // const afterRect = this.getRect({index: after, length: 1});
    //   // const afterRectOffset = KarmaFieldsAlpha.Rect.offset(afterRect, nextRect.x - afterRect.x, nextRect.y - afterRect.y);
    //
    //
    //
    //
    //   if (KarmaFieldsAlpha.Rect.isAfter(currentRectOffset, {
    //     x: this.items[next].box.x,
    //     y: this.items[next].box.y,
    //     width: this.items[after].box.width,
    //     height: this.items[after].box.height
    //   })) {
    //     offset = 1;
    //   }
    // }
    //
    // if (offset) {
    //   this.splice(first, this.selection.length, first + offset);
    //   this.selection.index += offset;
    //
    //   // this.render();
    // }




    if (first > 1 && KarmaFieldsAlpha.Rect.isBefore(currentRectOffset, {
      x: this.items[prev].box.x + this.items[prev].box.width - this.items[before].box.width,
      y: this.items[prev].box.y + this.items[prev].box.height - this.items[before].box.height,
      width: this.items[before].box.width,
      height: this.items[before].box.height
    })) {

      this.swap(first, this.selection.length, first - 1);
      this.selection.index--;

    } else if (last < this.items.length - 1 && KarmaFieldsAlpha.Rect.isAfter(currentRectOffset, {
      x: this.items[next].box.x,
      y: this.items[next].box.y,
      width: this.items[after].box.width,
      height: this.items[after].box.height
    })) {

      this.swap(first, this.selection.length, first + 1);
      this.selection.index++;

    }

    let deltaX = this.mouseX - this.offsetX - this.items[this.selection.index + this.indexOffset].box.x;
    let deltaY = this.mouseY - this.offsetY - this.items[this.selection.index + this.indexOffset].box.y;


    this.getSelectedItems().forEach(item => {
      item.cells.forEach(cell => {
        // cell.element.style.transform = "translate("+currentRectOffset.x+"px, "+currentRectOffset.y+"px)";
        cell.element.style.transform = `translate(${cell.box.x + deltaX}px, ${cell.box.y + deltaY}px)`;
        // element.style.transform = "translate("+(this.mouseX - this.mouseOffsetX)+"px, "+(this.mouseY - this.mouseOffsetY)+"px)";
      });
    });



  }

  async drop() {
    if (this.selection) {
      this.getSelectedItems().forEach(item => {
        item.cells.forEach(cell => {
          cell.element.classList.remove("drag");
          cell.element.style.transform = "none";
          // element.classList.remove("grabbing");
        });
      });

      this.items[this.index + this.indexOffset].cells.forEach(cell => {
        cell.element.classList.remove("grabbing");
      });


      // this.container.classList.remove("dragging");
      if (this.onEndDrag) {
        this.onEndDrag();
      }

      if (this.index !== this.selection.index && this.onSwap) {

        const min = Math.min(this.index, this.selection.index);
        const max = Math.max(this.index + this.selection.length, this.selection.index + this.selection.length);

        const items = this.getItems({
          index: min,
          length: max
        });

        this.onSwap(items);

      }



    }
  }



}