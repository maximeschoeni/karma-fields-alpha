
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

      // const index = this.findIndex(this.tracker.x, this.tracker.y);
      const index = this.findIndex(x, y);

      if (index !== this.overIndex) {

        if (this.overIndex > -1) {

          if (this.onDragOut) {

            this.sliceElements(this.overIndex, 1).forEach(element => void this.onDragOut(element));

          }

          this.overIndex = -1;

        }



        if (index > -1 && index !== this.index && this.dropZones.indexOf(index) > -1) {

          if (this.onDragOver) {

            this.sliceElements(index, 1).forEach(element => void this.onDragOver(element));

          }

          this.overIndex = index;
        }

      }


      let travelX = this.tracker.x - this.originX;
      let travelY = this.tracker.y - this.originY;

      this.sliceSegment(this.selection).forEach(element => element.style.transform = `translate(${travelX}px, ${travelY}px)`);

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

      if (this.overIndex > -1) {

        // this.sliceSegment(this.selection).forEach(element => void element.classList.add("hidden"));

        if (this.onDragOut) {

          this.sliceElements(this.overIndex, 1).forEach(element => void this.onDragOut(element));

        }

        if (this.ondrop) {

          this.ondrop(this.overIndex, this.selection);

        }

      } else {

        this.container.classList.remove("dragging");

      }

      this.dragging = false;

    } else {

      super.complete();

    }

  }


}
