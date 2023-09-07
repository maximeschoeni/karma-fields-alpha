
KarmaFieldsAlpha.DragAndDrop = class extends KarmaFieldsAlpha.Sorter {

  update() {

    if (this.dragging) {

      // let current = this.getBox(this.selection.index + this.indexOffset);
      //
      // const movingBox = {
      //   x: x - this.offsetX,
      //   y: y - this.offsetY,
      //   width: current.width,
      //   height: current.height
      // };
      //
      // const cX = movingBox.x + movingBox.width/2;
      // const cY = movingBox.y + movingBox.height/2;


      const x = this.tracker.x - this.offsetX + this.currentRect.width/2;
      const y = this.tracker.y - this.offsetY + this.currentRect.height/2;


      // if (this.tracker.diffX < 0) {
      //
      //
      //
      // }
      //
      //
      // console.log(this.tracker.diffX, this.index, this.indexOffset);

      // const index = this.findIndex(this.tracker.x, this.tracker.y);
      const index = this.findIndex(x, y);

      if (index !== this.overIndex) {

        if (this.overIndex > -1) {

          if (this.onDragOut) { // the dropzone under then dragged item

            this.sliceElements(this.overIndex, 1).forEach(element => void this.onDragOut(element));

          }

          if (this.onDraggedOut) { // -> the dragged item over a dropzone

            this.sliceSegment(this.selection).forEach(element => void this.onDraggedOut(element));

          }

          this.overIndex = -1;

        }



        if (index > -1 && index !== this.index && this.dropZones.indexOf(index) > -1) {

          if (this.onDragOver) { // the dropzone under then dragged item

            this.sliceElements(index, 1).forEach(element => void this.onDragOver(element));

          }

          if (this.onDraggedOver) { // -> the dragged item over a dropzone

            this.sliceSegment(this.selection).forEach(element => void this.onDraggedOver(element));

          }

          this.overIndex = index;
        }

      }


      let travelX = this.tracker.x - this.originX;
      let travelY = this.tracker.y - this.originY;

      this.sliceSegment(this.selection).forEach(element => element.style.transform = `translate(${travelX}px, ${travelY}px)`);

      // if (this.onDrag) { // -> the dragged item over a dropzone
      //
      //   this.sliceSegment(this.selection).forEach(element => void this.onDrag(element, travelX, travelY, this.overIndex));
      //
      // }

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

      //
      this.container.style.height = "auto";

      console.log(this.overIndex);

      if (this.overIndex > -1) {

        // this.sliceSegment(this.selection).forEach(element => void element.classList.add("hidden"));

        if (this.onDragOut) {

          this.sliceElements(this.overIndex, 1).forEach(element => void this.onDragOut(element));

        }

        if (this.ondrop) {

          this.ondrop(this.overIndex, this.selection);

        }

      } else {

        if (this.onCancelDrag) {

          this.onCancelDrag();

        }

        this.container.classList.remove("dragging");

      }

      this.dragging = false;

    } else {

      super.complete();

    }

  }


}
