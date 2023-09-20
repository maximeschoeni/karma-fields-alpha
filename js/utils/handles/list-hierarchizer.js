
KarmaFieldsAlpha.ListHierarchizer = class extends KarmaFieldsAlpha.ListSorter {


  startDrag(index) {

    super.startDrag(index)

    this.originAbsPos = this.getAbsolutePosition();

    this.originIndex = this.selection.index;
    this.originPath = this.path;

  }

  drag() {

    let travelX = this.x - this.originX;
    let travelY = this.y - this.originY;

    const firstBox = this.getBox(this.selection.index);
    const lastBox = this.getBox(this.selection.index + this.selection.length - 1);

    if (!firstBox || !lastBox) {

      console.error("wtf container is empty!", this.selection);

    }

    if (this.clientDiffY < 0) {

      if (this.selection.index > 0) {

        const elements = this.slice(this.selection.index - 1, 1);
        const box = this.getBox(this.selection.index - 1, 1);
        const child = (this.maxDepth === undefined || this.path.length < this.maxDepth) && this.findChild(elements);

        if (child) {

          if (firstBox.y + travelY < box.y + box.height - 10) {

            this.putInside(child, -1);

          }

        } else {

          if (firstBox.y + travelY < box.y + box.height/2) {

            this.swap(-1);

          }

        }

      } else {

        if (this.path.length > 0) {

          const closest = this.container.parentNode.closest(".dropzone");
          const containerBox = this.getContainerBox();

          if (firstBox.y + travelY < -10 && closest) {
            this.takeOut(closest, 0);
          }

        }

      }

    }

    if (this.clientDiffY > 0) {

      const last = this.getChildren().length - 1;

      if (this.selection.index + this.selection.length < last) {

        const elements = this.slice(this.selection.index + this.selection.length, 1);
        const box = this.getBox(this.selection.index + this.selection.length, 1);
        const child = (this.maxDepth === undefined || this.path.length < this.maxDepth) && this.findChild(elements);

        if (child) {

          if (lastBox.y + lastBox.height + travelY > box.y + 10) {

            this.putInside(child, 1);

          }

        } else {

          if (lastBox.y + lastBox.height + travelY > box.y + box.height/2) {

            this.swap(1);

          }

        }

      } else {


        const closest = this.container.parentNode.closest(".dropzone");
        const containerBox = this.getContainerBox();

        if (closest) {

          if (lastBox.y + lastBox.height + travelY > this.container.clientHeight + 10) {
            this.takeOut(closest, 1);

          }

        }

      }

    }


    travelX = this.x - this.originX;
    travelY = this.y - this.originY;

    this.slice(this.selection.index, this.selection.length).forEach(element => element.style.transform = `translate(${travelX}px, ${travelY}px)`);


  }


  // swap(offset) {
  //
  //   const elements = this.slice(this.selection.index, this.selection.length);
  //
  //   let newIndex;
  //
  //   if (offset > 0) {
  //
  //     const lastRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), this.getBox(this.selection.index + this.selection.length - 1));
  //     const afterRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), this.getBox(this.selection.index + this.selection.length));
  //
  //     this.originX += (afterRectangle.x + afterRectangle.width) - (lastRectangle.x + lastRectangle.width);
  //     this.originY += (afterRectangle.y + afterRectangle.height) - (lastRectangle.y + lastRectangle.height);
  //
  //     this.insertElementsAt(this.container, elements, this.selection.index + this.selection.length + 1);
  //
  //     // this.selection = new KarmaFieldsAlpha.Selection(this.selection.index + 1, this.selection.length);
  //
  //     newIndex = this.selection.index + 1;
  //
  //     this.selection = {index: newIndex, length: this.selection.length};
  //
  //     if (this.onSwap) {
  //
  //       this.onSwap(this.selection.index, newIndex, this.selection.length);
  //
  //     }
  //
  //   } else {
  //
  //     const firstRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), this.getBox(this.selection.index));
  //     const beforeRectangle = Object.assign(new KarmaFieldsAlpha.Rect(), this.getBox(this.selection.index - 1));
  //
  //     this.originX += beforeRectangle.x - firstRectangle.x;
  //     this.originY += beforeRectangle.y - firstRectangle.y;
  //
  //     this.insertElementsAt(this.container, elements, this.selection.index - 1);
  //
  //     newIndex = this.selection.index - 1;
  //
  //     this.selection = {...this.selection, index: newIndex}
  //
  //     if (this.onSwap) {
  //
  //       // this.onSwap(this.index, this.selection.index, this.selection.length);
  //       this.onSwap(this.selection.index, newIndex, this.selection.length, this.path, this.path);
  //
  //
  //     }
  //
  //   }
  //
  // }

  takeOut(closest, offset) {

    // this.container.style.height = "auto";

    const offsetLeft = this.container.offsetLeft;
    const offsetTop = this.container.offsetTop;

    const originBox = this.getBox(this.selection.index, 1);

    const children = this.getChildren();
    const elements = children.splice(this.selection.index, this.selection.length);

    // const index = this.path.pop();
    // const index = this.path.pop();

    let newIndex = this.path[this.path.length-1] + offset;
    let newPath = this.path.slice(0, -1);



    this.container = closest;

    this.insertElementsAt(this.container, elements, newIndex);

    this.selection = {...this.selection, index: newIndex};

    const destBox = this.getBox(this.selection.index);

    this.originX += destBox.x - offsetLeft - originBox.x;
    this.originY += destBox.y - offsetTop - originBox.y;

    if (this.onSwap) {

      // this.onSwap(this.selection, this.path, this.index, newPath, newIndex, this.selection.length);
      this.onSwap(this.index, newIndex, this.selection.length, this.path, newPath);

    }

    this.index = newIndex;
    this.path = newPath;

  }

  putInside(child, offset) {

    const box = this.getBox(this.selection.index, 1);

    // this.container.style.height = "auto";

    const children = this.getChildren();
    const elements = children.splice(this.selection.index, this.selection.length);

    this.container = child;

    let newIndex;
    let newPath;

    if (offset > 0) {

      newIndex = 0;
      newPath = [...this.path, this.index];

    } else {

      newPath = [...this.path, this.index -1]

      newIndex = this.getHeight();

      if (newIndex > 0) {

        this.originY += this.getBox(0, newIndex).height;

      }

    }

    this.selection = {...this.selection, index: newIndex};

    this.insertElementsAt(this.container, elements, newIndex);

    this.originX -= box.x - this.container.offsetLeft;
    this.originY -= box.y - this.container.offsetTop;

    if (this.onSwap) {

      this.onSwap(this.index, newIndex, this.selection.length, this.path, newPath);

    }

    this.index = newIndex;
    this.path = newPath;

  }


  getContainerBox() {

    if (this.path.length > 0) {

      const index = this.path[this.path.length - 1];
      const closest = this.container.parentNode.closest(".dropzone");

      if (closest) {

        const selector = new KarmaFieldsAlpha.Selector(closest);
        const box = selector.getBox(index);

        if (box) {

          return KarmaFieldsAlpha.Rect.offset(box, -this.container.offsetLeft, -this.container.offsetTop);

        }

      }

    }

  }

  findChild(elements) {

    for (let element of elements) {

      const child = element.querySelector(".dropzone");

      if (child) {

        return child;

      }

    }

  }


}
