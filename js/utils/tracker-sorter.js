
KarmaFieldsAlpha.Sorter = class extends KarmaFieldsAlpha.Selector {




  init() {

    let index;
    let row;


    if (this.selection) {

      index = this.findIndex(this.tracker.x, this.tracker.y);
      row = this.getRow(index);

    }

    if (row && KarmaFieldsAlpha.Segment.contains(this.selection, row)) {

      this.currentRect = this.getBox(row);
      this.offsetX = this.tracker.x - this.currentRect.x;
      this.offsetY = this.tracker.y - this.currentRect.y;
      this.index = this.selection.index;
      this.indexOffset = row - this.index;
      this.dragging = true;

      this.sliceSegment(this.selection).forEach(element => element.classList.add("drag"));

      this.container.classList.add("dragging");
      this.container.style.height = `${this.container.clientHeight}px`;

    } else {

      super.init();

    }

  }

  update() {

    if (this.dragging) {

      let current = this.getBox(this.selection.index + this.indexOffset);

      const movingBox = {
        x: this.x - this.offsetX,
        y: this.y - this.offsetY,
        width: current.width,
        height: current.height
      };

      if (this.checkBefore(movingBox)) {

        this.swap(this.selection.index, this.selection.length, this.selection.index - 1);

        // this.segment.index--;
        this.selection = KarmaFieldsAlpha.Segment.offset(this.selection, -1); // this.selection is immutable

        current = this.getBox(this.selection.index + this.indexOffset);

      } else if (this.checkAfter(movingBox)) {

        this.swap(this.selection.index, this.selection.length, this.selection.index + 1);

        // this.segment.index++;
        this.selection = KarmaFieldsAlpha.Segment.offset(this.selection, 1); // this.selection is immutable

        current = this.getBox(this.selection.index + this.indexOffset);

      }

      let offsetX = this.x - this.offsetX - current.x;
      let offsetY = this.y - this.offsetY - current.y;

      this.sliceSegment(this.selection).forEach(element => element.style.transform = `translate(${offsetX}px, ${offsetY}px)`);

    } else {

      super.update();

    }

  }


  complete() {

    if (this.dragging) {

      this.sliceSegment(this.selection).forEach(element => {
        element.classList.remove("drag");
        element.style.transform = "none";
      });

      this.container.classList.remove("dragging");
      this.container.style.height = "auto";

      if (this.onSort && this.selection && this.selection.index !== this.index) {

        this.onSort(this.index, this.selection.length, this.selection.index);

      }

      this.dragging = false;

    } else {

      super.complete();

    }

  }

  //
  //
  // select(event, col, row) {
  //
  //   if (this.selection && KarmaFieldsAlpha.Segment.contains(this.selection, row)) {
  //
  //     event.preventDefault();
  //
  //     this.mouseX = event.clientX;
  //     this.mouseY = event.clientY;
  //
  //     this.currentRect = this.getBox(row);
  //     this.offsetX = this.mouseX - this.box.left - this.currentRect.x;
  //     this.offsetY = this.mouseY - this.box.top - this.currentRect.y;
  //     this.index = this.selection.index;
  //     this.indexOffset = row - this.index;
  //
  //     this.sliceSegment(this.selection).forEach(element => element.classList.add("drag"));
  //
  //     this.container.classList.add("dragging");
  //     this.container.style.height = `${this.container.clientHeight}px`;
  //
  //     const mousemove = event => {
  //       this.mouseX = event.clientX;
  //       this.mouseY = event.clientY;
  //       this.updateOrder();
  //     }
  //
  //     const scroll = event => {
  //       if (event.target.contains(this.container)) {
  //         this.box = this.container.getBoundingClientRect();
  //         this.updateOrder();
  //       }
  //     }
  //
  //     const mouseup = event => {
  //
  //       window.removeEventListener("mousemove", mousemove);
  //       window.removeEventListener("mouseup", mouseup);
  //       window.removeEventListener("scroll", scroll, true);
  //
  //       this.sliceSegment(this.selection).forEach(element => {
  //         element.classList.remove("drag");
  //         element.style.transform = "none";
  //       });
  //
  //       this.container.classList.remove("dragging");
  //       this.container.style.height = "auto";
  //
  //       if (this.onSort && this.selection && this.selection.index !== this.index) {
  //         this.onSort(this.index, this.selection.length, this.selection.index);
  //       }
  //
  //     }
  //
  //     window.addEventListener("mousemove", mousemove);
  //     window.addEventListener("mouseup", mouseup);
  //     window.addEventListener("scroll", scroll, true);
  //
  //   } else {
  //
  //     super.select(event, col, row);
  //
  //   }
  //
  // }

  swap(index, length, target) {

    const elements = this.children.splice((this.colHeader + index)*this.width, length*this.width);
    this.children.splice((this.colHeader + target)*this.width, 0, ...elements);

    this.container.replaceChildren(...this.children);

  }

  checkBefore(movingBox) {

    const beforeBox = this.getBox(this.selection.index - 1);

    if (beforeBox) {

      const prevBox = this.getBox(this.selection.index + this.indexOffset - 1);

      return KarmaFieldsAlpha.Rect.isBefore(movingBox, {
        x: prevBox.x + prevBox.width - beforeBox.width,
        y: prevBox.y + prevBox.height - beforeBox.height,
        width: beforeBox.width,
        height: beforeBox.height
      });

    }

    return false;

  }

  checkAfter(movingBox) {

    const afterBox = this.getBox(this.selection.index + this.selection.length);

    if (afterBox) {

      const nextBox = this.getBox(this.selection.index + this.indexOffset + 1);

      return KarmaFieldsAlpha.Rect.isAfter(movingBox, {
        x: nextBox.x,
        y: nextBox.y,
        width: afterBox.width,
        height: afterBox.height
      });

    }

    return false;

  }




}
