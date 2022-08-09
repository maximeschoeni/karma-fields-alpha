

KarmaFieldsAlpha.DragAndDropManager = class {

  constructor() {

    this.items = [];

  }

  getItems(segment) {
    const items = [];
    for (let i = segment.index; i < segment.index + segment.length; i++) {
      items.push(this.items[i]);
    }
    return items;
  }

  getSelectedItems() {
    if (this.selection) {
      return this.getItems(this.selection);
    }
    return [];
  }

  reset() {

    this.items = [];

  }

  isSelected(id) {
    return this.getSelectedItems().some(item => item.id === id);
  }

  growSelection(segment) {
    if (this.selection) {
      this.selection = KarmaFieldsAlpha.Segment.union(this.selection, segment);
    } else {
      this.selection = segment;
    }
  }

  registerItem(id, index, selected) {

    this.items[index] = {
      id: id,
      order: index,
      parent: 0,
      elements: []
    };

    if (selected) {
      this.growSelection({index: index, length: 1});

    }

    // this.items.push(item);
    //
    // return item;

  }

  registerCell(index, element, active) {

    const item = this.items[index];

    item.elements.push(element);

    console.log(this.items);

    if (active) {

      element.onmousedown = event => {

        if (event.buttons === 1) {

          event.preventDefault(); // -> prevent TA focusout

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


        }

      }

    }

  }

  splice(index, length, target) {

    const items = this.items.splice(index, length);
    this.items.splice(index - length + 1, 0, ...items);

    const min = Math.min(index, target);
    const max = Math.min(index, target);

    for (let i = min; i < max; i++) {
      this.items[i].elements.forEach(element => {
        element.style.order = i;
      });
      this.items[i]
    }

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
    const firstElementBox = item.elements[0].getBoundingClientRect();
    const lastElementBox = lastItem.elements[lastItem.elements.length-1].getBoundingClientRect();
    return {
      x: firstElementBox.left,
      y: firstElementBox.top,
      width: lastElementBox.right - firstElementBox.left,
      height: lastElementBox.bottom - firstElementBox.top,
    }
  }


  startDrag(index, pointerX, pointerY) {

    // const index = this.getIndex(item.x, item.y);

    this.currentRect = this.getRect({index: index, length:1})

    this.mouseX = pointerX;
    this.mouseY = pointerY;

    this.mouseOffsetX = pointerX - this.currentRect.x;
    this.mouseOffsetY = pointerY - this.currentRect.y;


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
      item.elements.forEach(element => {
        element.classList.add("drag");
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
      this.mouseX = pointerX;
      this.mouseY = pointerY;
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

    // const currentRect = this.getRect({index: current, length: 1});
    // const prevRect = this.getRect({index: prev, length: 1});
    // const nextRect = this.getRect({index: next, length: 1});
    // const beforeRect = this.getRect({index: before, length: 1});
    // const afterRect = this.getRect({index: after, length: 1});

    // const currentRectOffset = Rect.offset(currentRect, diffX, diffY);


    const currentRectOffset = Rect.offset(currentRect, this.mouseX - currentRect.x - this.mouseOffsetX, this.mouseY - currentRect.y - this.mouseOffsetY);

    let offset = 0;



    if (first > 1) {
      const prevRect = this.getRect({index: prev, length: 1});
      const beforeRect = this.getRect({index: before, length: 1});
      const beforeRectOffset = Rect.offset(beforeRect, prevRect.x - beforeRect.x + prevRect.width - beforeRect.width, prevRect.y - beforeRect.y + prevRect.height - beforeRect.height);
      if (KarmaFieldsAlpha.Rect.isBefore(currentRectOffset, beforeRectOffset)) {
        offset = -1;
      }
    }

    if (!offset && last < this.items.length - 1) {
      const nextRect = this.getRect({index: next, length: 1});
      const afterRect = this.getRect({index: after, length: 1});
      const afterRectOffset = KarmaFieldsAlpha.Rect.offset(afterRect, nextRect.x - afterRect.x, nextRect.y - afterRect.y);
      if (KarmaFieldsAlpha.Rect.isAfter(currentRectOffset, afterRectOffset)) {
        offset = 1;
      }
    }

    if (offset) {
      this.splice(first, this.selection.length, first + offset);
      this.selection.index += offset;
    }






    //
    // // if (prevElement && grabElementPrev && Rect.fromElement(grabElement).offset(diffX, diffY).isBefore(Rect.fromElement(grabElementPrev))) {
    // // if (first > 0 && Rect.isBefore(currentRectOffset, beforeRectOffset)) {
    // if (beforeRectOffset && Rect.isBefore(currentRectOffset, this.getBeforeRect())) {
    //
    //
    //   // this.shift(prevItem, this.selection.length);
    //   //
    //   // this.selection.index--;
    //   // elements.forEach(element => {
    //   //   this.shift(element, -1);
    //   // });
    //
    //   this.splice(first, last - first + 1, first - 1);
    //
    //   this.selection.index--;
    //
    //   // this.offsetLeft = this.element.offsetLeft;
    //   // this.offsetTop = this.element.offsetTop;
    //
    //   // diffX = this.getDiffX();
    //   // diffY = this.getDiffY();
    //
    // // } else if (nextElement && !this.map.get(nextElement).plus && grabElementNext && KarmaFieldsAlpha.Rect.fromElement(grabElement).offset(diffX, diffY).isAfter(KarmaFieldsAlpha.Rect.fromElement(grabElementNext))) {
    // // } else if (last < this.items.length - 1 && Rect.isAfter(currentRectOffset, afterRectOffset)) {
    // } else if (last < this.items.length - 1 && Rect.isAfter(currentRectOffset, this.getAfterRect())) {
    //
    //   // this.shift(nextElement, -this.selection.length);
    //   //
    //   // this.selection.index++;
    //   // elements.forEach(element => {
    //   //   this.shift(element, 1);
    //   // });
    //
    //
    //   this.splice(first, last - first + 1, first + 1);
    //
    //   this.selection.index++;
    //
    //   // this.offsetLeft = this.element.offsetLeft;
    //   // this.offsetTop = this.element.offsetTop;
    //
    //   // diffX = this.getDiffX();
    //   // diffY = this.getDiffY();
    // }

    // const outside = !KarmaFieldsAlpha.Rect.fromElement(this.container).intersects(KarmaFieldsAlpha.Rect.fromElement(firstElement).union(KarmaFieldsAlpha.Rect.fromElement(lastElement)).offset(diffX, diffY));
    //

    console.log(currentRect.x, currentRectOffset.x);

    this.getSelectedItems().forEach(item => {
      item.elements.forEach(element => {
        element.style.transform = "translate("+(currentRectOffset.x - currentRect.x)+"px, "+(currentRectOffset.y - currentRect.y)+"px)";
        // element.style.transform = "translate("+(this.mouseX - this.mouseOffsetX)+"px, "+(this.mouseY - this.mouseOffsetY)+"px)";
      });
    });



  }

  async drop() {
    if (this.selection) {
      this.getSelectedItems().forEach(item => {
        item.elements.forEach(element => {
          element.classList.remove("drag");
          element.style.transform = "none";
          // element.classList.remove("grabbing");
        });
      });

      this.items[this.index + this.indexOffset].elements.forEach(element => {
        element.classList.remove("grabbing");
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
