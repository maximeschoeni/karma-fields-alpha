
KarmaFieldsAlpha.HSorter = class extends KarmaFieldsAlpha.Sorter {

  // constructor(container) {
  //
  //   super(container);
  //
  //   this.maxDepth = 0;
  //
  // }

  update() {

    if (this.dragging) {

      // let currentBox = this.getBox(this.selection.index + this.indexOffset);

      let travelX = this.tracker.x - this.originX;
      let travelY = this.tracker.y - this.originY;

      const firstBox = this.getBox(this.selection.index);
      const lastBox = this.getBox(this.selection.index + this.selection.length - 1);

      // console.log(lastBox, this.selection.index, this.selection.length, this.getChildren(), this.container);

      if (!firstBox || !lastBox) {

        console.error("wtf container is empty!");

      }

      // const movingBox = {
      //   x: currentBox.x + this.tracker.x - this.originX,
      //   y: currentBox.y + this.tracker.y - this.originY,
      //   width: currentBox.width,
      //   height: currentBox.height
      // };

      // const mFirstBox = {
      //   x: firstBox.x + travelX,
      //   y: firstBox.y + travelY,
      //   width: firstBox.width,
      //   height: firstBox.height
      // };

      // const mlastBox = {
      //   x: lastBox.x + travelX,
      //   y: lastBox.y + travelY,
      //   width: lastBox.width,
      //   height: lastBox.height
      // };




      // const center = {
      //   x: movingBox.x + movingBox.width/2,
      //   y: movingBox.y + movingBox.height/2
      // };

      if (this.tracker.deltaY < 0) {

        if (this.selection.index > 0) {

          const elements = this.sliceElements(this.selection.index - 1, 1);
          const box = this.getElementsBox(...elements);
          const child = (this.maxDepth === undefined || this.path.length < this.maxDepth) && this.findChild(elements);


          if (child) {

            // if (center.y < box.y + box.height + movingBox.height) {
            // if (movingBox.y + mFirstBox.height < box.y + box.height + movingBox.height) {
            // if (firstBox.y + firstBox.height/2 + travelY < box.y + box.height) {
            if (firstBox.y + travelY < box.y + box.height - 10) {

              this.swapToChild(child, -1);

            }

          } else {

            // if (center.y < box.y + box.height) {
            //   console.log("swapToSame");
            //   this.swapToSame(-1);

            // }

            if (firstBox.y + travelY < box.y + box.height/2) {

              this.swapToSame(-1);

            }

          }

        } else {

          if (this.path.length > 0) {

            const closest = this.container.parentNode.closest(".dropzone");
            const containerBox = this.getContainerBox();

            // console.log(firstBox.y, travelY, containerBox.y);

            // if (mFirstBox.y + mFirstBox.height/2 < movingBox.height - 47) {
            // if (firstBox.y + travelY < containerBox.y) {
            // if (firstBox.y + firstBox.height/2 + travelY < 0) {
            // if (firstBox.y + firstBox.height*0.25 + travelY < 0) {
            if (firstBox.y + travelY < -10) {
              this.swapToParent(closest, 0);
            }


          }

        }

      }

      if (this.tracker.deltaY > 0) {

        const last = this.getHeight();

        if (this.selection.index + this.selection.length < last) {

          const elements = this.sliceElements(this.selection.index + this.selection.length, 1);
          const box = this.getElementsBox(...elements);
          const child = (this.maxDepth === undefined || this.path.length < this.maxDepth) && this.findChild(elements);


          if (child) {

            // if (mlastBox.y > box.y - movingBox.height) {
            // if (lastBox.y + lastBox.height/2 + travelY > box.y) {
            if (lastBox.y + lastBox.height + travelY > box.y + 10) {

              this.swapToChild(child, 1);

            }

          } else {

            // if (center.y > box.y) {

            //   this.swapToSame(1);

            // }

            if (lastBox.y + lastBox.height + travelY > box.y + box.height/2) {

              this.swapToSame(1);

            }

          }

        } else {


          const closest = this.container.parentNode.closest(".dropzone");
          // const parentIndex = this.path[this.path.length - 1];
          const containerBox = this.getContainerBox();

          if (closest) {

            // if (center.y > this.container.clientHeight - movingBox.height) {
            // if (mlastBox.y + mlastBox.height/2 > this.container.clientHeight - movingBox.height + 10) {
            // if (lastBox.y + lastBox.height + travelY < containerBox.y + containerBox.height) {
            // if (lastBox.y + lastBox.height/2 + travelY > this.container.clientHeight) {
            // if (lastBox.y + lastBox.height*0.75 + travelY > this.container.clientHeight) {
            if (lastBox.y + lastBox.height + travelY > this.container.clientHeight + 10) {
              this.swapToParent(closest, 1);

            }

          }

        }

      }


      travelX = this.tracker.x - this.originX;
      travelY = this.tracker.y - this.originY;

      this.sliceSegment(this.selection).forEach(element => element.style.transform = `translate(${travelX}px, ${travelY}px)`);

    } else {

      super.update();

    }

  }

  // swapToSame(offset) {

  //   console.log("swapToSame");
  //   return;

  //   this.swap(this.selection.index, this.selection.length, this.selection.index + offset);
  //   this.selection = KarmaFieldsAlpha.Segment.offset(this.selection, offset); // this.selection is immutable

  // }

  swapToParent(closest, offset) {


    this.container.style.height = "auto";

    const offsetLeft = this.container.offsetLeft;
    const offsetTop = this.container.offsetTop;

    const originBox = this.getBox(this.selection.index);

    const children = this.getChildren();
    const width = this.getWidth();
    const elements = children.splice((this.colHeader + this.selection.index)*width, this.selection.length*width);

    const index = this.path.pop();

    this.container = closest;

    this.insertElementsAt(this.container, elements, index + offset);

    this.selection = {...this.selection, index: index + offset};

    const destBox = this.getBox(this.selection.index);

    this.originX += destBox.x - offsetLeft - originBox.x;
    this.originY += destBox.y - offsetTop - originBox.y;

  }

  swapToChild(child, offset) {

    const box = this.getBox(this.selection.index);

    this.container.style.height = "auto";

    const children = this.getChildren();
    const width = this.getWidth();
    const elements = children.splice((this.colHeader + this.selection.index)*width, this.selection.length*width);

    this.container = child;

    let index;

    if (offset > 0) {


      this.path.push(this.selection.index);

      index = 0;

    } else {

      this.path.push(this.selection.index -1);

      index = this.getHeight();

      if (index > 0) {

        this.originY += this.getBox(0, index).height;

      }

    }

    this.selection = {...this.selection, index: index};


    this.insertElementsAt(this.container, elements, index);

    this.originX -= box.x - this.container.offsetLeft;
    this.originY -= box.y - this.container.offsetTop;



    // this.selection = {...this.selection, index: index};




  }


  // complete() {

  //   if (this.dragging) {

  //     this.sliceSegment(this.selection).forEach(element => {
  //       element.classList.remove("drag");
  //       element.style.transform = "none";
  //     });

  //     this.container.classList.remove("dragging");
  //     this.container.style.height = "auto";

  //     // this.root.container.style.height = "auto";
  //     // this.root.container.style.overflow = "hidden";


  //     // if (this.onsort && this.selection && this.selection.index !== this.index) {

  //     //   this.onsort(this.index, this.selection.length, this.selection.index);

  //     // }

  //     if (this.onsort) {

  //       this.onsort();

  //     }

  //     this.dragging = false;

  //   } else {

  //     super.complete();

  //   }

  // }

  // swap(index, length, target) {

  //   const children = this.getChildren(); // [...this.container.children];
  //   const width = this.getWidth();

  //   const elements = children.splice((this.colHeader + index)*width, length*width);
  //   children.splice((this.colHeader + target)*width, 0, ...elements);

  //   this.container.replaceChildren(...children);

  // }



  findChild(elements) {

    for (let element of elements) {

      const child = element.querySelector(".dropzone");

      if (child) {

        return child;

      }

    }

  }

  // insertElementsAt(container, elements, index) {

  //   // this.tracker.scrollLock = true;


  //   const target = container.children[index];

  //   if (target) {

  //     for (let element of elements) {

  //       container.insertBefore(element, target);

  //     }

  //   } else {

  //     for (let element of elements) {

  //       container.appendChild(element);

  //     }

  //   }


  //   // setTimeout(() => {
  //   //   this.tracker.scrollLock = false;
  //   // }, 200);

  // }

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


  // getParent() {

  //   const closest = this.container.parentNode.closest(".dropzone");

  //   if (closest) {

  //     return new KarmaFieldsAlpha.Sorter(closest);

  //   }

  // }


  // getRoot() {

  //   const parent = this.getParent();

  //   if (parent) {

  //     return parent.getRoot();
  //   }

  //   return this;
  // }


}
