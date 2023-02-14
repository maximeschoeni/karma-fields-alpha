
KarmaFieldsAlpha.Sorter = class extends KarmaFieldsAlpha.Selector {


  static sorters = [];


  init() {

    let index;
    let row;

    if (this.selection) {

      index = this.findIndex(this.tracker.x, this.tracker.y);
      row = this.getRow(index);

    }

    if (row >= 0 && KarmaFieldsAlpha.Segment.contain(this.selection, row)) {

      // this.selectionBox = this.getBox(this.selection.index, this.selection.length);

      this.originX = this.tracker.x;
      this.originY = this.tracker.y;

      this.currentRect = this.getBox(row);
      this.offsetX = this.tracker.x - this.currentRect.x;
      this.offsetY = this.tracker.y - this.currentRect.y;
      this.index = this.selection.index;
      this.indexOffset = row - this.index;
      this.dragging = true;



      // this.originPath = this.path.slice();
      // this.destPath = this.path.slice();

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

      // console.log(current, this.selection.index, this.indexOffset);

      // const movingBox = {
      //   x: this.tracker.x - this.offsetX,
      //   y: this.tracker.y - this.offsetY,
      //   width: current.width,
      //   height: current.height
      // };

      const diffX = this.tracker.x - this.originX;
      const diffY = this.tracker.y - this.originY;

      const firstBox = this.getBox(this.selection.index);
      const lastBox = this.getBox(this.selection.index + this.selection.length - 1);

      const movingBox = {
        x: current.x + this.tracker.x - this.originX,
        y: current.y + this.tracker.y - this.originY,
        width: current.width,
        height: current.height
      };

      const mFirstBox = {
        x: firstBox.x + diffX,
        y: firstBox.y + diffY,
        width: firstBox.width,
        height: firstBox.height
      };

      const mlastBox = {
        x: lastBox.x + diffX,
        y: lastBox.y + diffY,
        width: lastBox.width,
        height: lastBox.height
      };

      


      const center = {
        x: movingBox.x + movingBox.width/2,
        y: movingBox.y + movingBox.height/2
      };

      if (this.tracker.deltaY < 0) {

        if (this.selection.index > 0) {

          const elements = this.sliceElements(this.selection.index - 1, 1);
          const box = this.getElementsBox(...elements);
          const child = this.findChild(elements);

          if (child) {
            
            // if (center.y < box.y + box.height + movingBox.height) {
            if (movingBox.y + mFirstBox.height < box.y + box.height + movingBox.height) {

              this.swapToChild(child, -1);

            }

          } else {

            if (center.y < box.y + box.height) {

              this.swapToSame(-1);

            }

          }

        } else {

          const closest = this.container.parentNode.closest(".dropzone");

          if (closest) {

            // if (mFirstBox.y < movingBox.height) {
            // if (mFirstBox.y + mFirstBox.height/2 < movingBox.height - this.container.offsetTop) {
            if (mFirstBox.y + mFirstBox.height/2 < movingBox.height - 47) {
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
          const child = this.findChild(elements);

 
          if (child) {

            if (mlastBox.y > box.y - movingBox.height) {

              this.swapToChild(child, 1);

            }

          } else {

            if (center.y > box.y) {

              this.swapToSame(1);

            }

          }

        } else {


          const closest = this.container.parentNode.closest(".dropzone");
          // const parentIndex = this.path[this.path.length - 1];

          if (closest) {

            // if (center.y > this.container.clientHeight - movingBox.height) {
            if (mlastBox.y + mlastBox.height/2 > this.container.clientHeight - movingBox.height + 10) {

              this.swapToParent(closest, 1);
  
            }

          }
           
        }

      }

      // const isBefore = this.checkBefore(movingBox);
      // const isAfter = this.checkAfter(movingBox);
      // const closest = this.checkParent(movingBox);

      // if (isBefore) {

      //   this.swap(this.selection.index, this.selection.length, this.selection.index - 1);

      //   // this.segment.index--;
      //   this.selection = KarmaFieldsAlpha.Segment.offset(this.selection, -1); // this.selection is immutable

      //   current = this.getBox(this.selection.index + this.indexOffset);

      // } else if (isAfter) {

      //   this.swap(this.selection.index, this.selection.length, this.selection.index + 1);

      //   // this.segment.index++;
      //   this.selection = KarmaFieldsAlpha.Segment.offset(this.selection, 1); // this.selection is immutable

      //   current = this.getBox(this.selection.index + this.indexOffset);

      // } else if (closest) {

      //   this.container.style.height = "auto";

      //   this.offsetX -= this.container.offsetLeft;
      //   this.offsetY -= this.container.offsetTop;

      //   const children = this.getChildren();
      //   const width = this.getWidth();
      //   const elements = children.splice((this.colHeader + this.selection.index)*width, this.selection.length*width);

      //   this.container = closest;
      //   this.container.prepend(...elements);

      //   this.path.pop();

      //   this.selection = {...this.selection, index: 0};

      //   current = this.getBox(this.selection.index + this.indexOffset);

      // }



      // console.log(this.tracker.y, this.offsetY, current.y);

      // let offsetX = this.tracker.x - this.offsetX - current.x;
      // let offsetY = this.tracker.y - this.offsetY - current.y;

      let offsetX = this.tracker.x - this.originX;
      let offsetY = this.tracker.y - this.originY;

      this.sliceSegment(this.selection).forEach(element => element.style.transform = `translate(${offsetX}px, ${offsetY}px)`);

      


    } else {

      super.update();

    }

  }

  swapToSame(offset) {

    console.log("swapToSame");
    return;

    this.swap(this.selection.index, this.selection.length, this.selection.index + offset);
    this.selection = KarmaFieldsAlpha.Segment.offset(this.selection, offset); // this.selection is immutable

  }

  swapToParent(closest, offset) {


    // this.container.style.height = "auto";

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
    
    // this.container.style.height = "auto";

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


  complete() {

    if (this.dragging) {

      this.sliceSegment(this.selection).forEach(element => {
        element.classList.remove("drag");
        element.style.transform = "none";
      });

      this.container.classList.remove("dragging");
      this.container.style.height = "auto";

      // if (this.onsort && this.selection && this.selection.index !== this.index) {

      //   this.onsort(this.index, this.selection.length, this.selection.index);

      // }

      if (this.onsort) {

        this.onsort();

      }

      this.dragging = false;

    } else {

      super.complete();

    }

  }

  swap(index, length, target) {

    const children = this.getChildren(); // [...this.container.children];
    const width = this.getWidth();

    const elements = children.splice((this.colHeader + index)*width, length*width);
    children.splice((this.colHeader + target)*width, 0, ...elements);

    this.container.replaceChildren(...children);

  }

  // checkBefore(movingBox) {

  //   const beforeBox = this.getBox(this.selection.index - 1);

  //   if (beforeBox) {

  //     const prevBox = this.getBox(this.selection.index + this.indexOffset - 1);

  //     return KarmaFieldsAlpha.Rect.isBefore(movingBox, {
  //       x: prevBox.x + prevBox.width - beforeBox.width,
  //       y: prevBox.y + prevBox.height - beforeBox.height,
  //       width: beforeBox.width,
  //       height: beforeBox.height
  //     });

  //   }

  //   return false;

  // }

  // checkAfter(movingBox) {

  //   const afterBox = this.getBox(this.selection.index + this.selection.length);

  //   if (afterBox) {

  //     const nextBox = this.getBox(this.selection.index + this.indexOffset + 1);

  //     return KarmaFieldsAlpha.Rect.isAfter(movingBox, {
  //       x: nextBox.x,
  //       y: nextBox.y,
  //       width: afterBox.width,
  //       height: afterBox.height
  //     });

  //   }

  //   return false;

  // }


  // checkParent(movingBox) {

  //   const offset = 5;
  //   const closest = this.container.parentNode.closest(".dropzone");

  //   // console.log(movingBox, this.container.offsetTop, this.container.clientHeight, closest.offsetTop, closest.clientHeight, this.tracker.deltaY);
    

  //   if (closest) {

  //     if (this.tracker.deltaY < 0) {

  //       if (movingBox.y + this.container.offsetTop - movingBox.height < -movingBox.height/2) {

  //         return closest;

  //       }

  //     } else if (this.tracker.deltaY > 0) {

  //       if (movingBox.y + this.container.offsetTop + movingBox.height > movingBox.height/2) {

  //         return closest;

  //       }

  //     }



  //   }

  //   return false;
    
  //   if (closest && (movingBox.y < -offset || movingBox.y + movingBox.height > offset)) {

  //     this.container.style.height = "auto";

  //     this.offsetX -= this.container.offsetLeft;
  //     this.offsetY -= this.container.offsetTop;

  //     const children = this.getChildren();
  //     const width = this.getWidth();
  //     const elements = children.splice((this.colHeader + this.selection.index)*width, this.selection.length*width);

  //     this.container = closest;
  //     this.container.prepend(...elements);

  //     this.path.pop();

  //     this.selection = {...this.selection, index: 0};

  //     return true;

  //   }

  // }

  // checkChildren(movingBox) {

  //   const offset = 5;
  //   const dropzones = this.container.querySelectorAll(".dropzone");




  //   for (let i = 0; i < dropzone.length; i++) {
  //     // for (let dropzone of children) {
  //     const dropzone = dropzones[i];
      
  //     const dropzoneBox = {
  //       x: dropzone.offsetLeft,
  //       y: dropzone.offsetTop,
  //       width: dropzone.clientWidth,
  //       height: dropzone.clientHeight
  //     };

  //     // if (this.tracker.deltaY < 0) {

  //     //   if (movingBox.y + this.container.offsetTop - movingBox.height < -movingBox.height/2) {

  //     //     return closest;

  //     //   }

  //     // } else if (this.tracker.deltaY > 0) {

  //     //   if (movingBox.y + this.container.offsetTop + movingBox.height > movingBox.height/2) {

  //     //     return closest;

  //     //   }

  //     // }









  //     if (KarmaFieldsAlpha.Rect.intersect(movingBox, dropzoneBox, 0, 0)) {

  //       const children = this.getChildren();
  //       const width = this.getWidth();
  //       const elements = children.splice((this.colHeader + this.selection.index)*width, this.selection.length*width);

  //       this.container = dropzone;
  //       this.container.append(...elements);

  //       this.path.push(i);

  //       this.selection = {...this.selection, index: 0};

  //       return true;

  //     }
  //   }

  // }


  // checkZones(movingBox) {

  //   // 1. check if box overflow

  //   const containerBox = {
  //     x: 0,
  //     y: 0,
  //     width: this.container.clientWidth,
  //     height: this.container.clientHeight
  //   };

  //   const offset = 10;

  //   // const isOutside = !this.horizontal && (movingBox.y < containerBox.y || movingBox.y + movingBox.height > containerBox.height) || this.horizontal && (movingBox.x < containerBox.x || movingBox.x + movingBox.width > containerBox.width);

  //   const isOutside = movingBox.y < containerBox.y || movingBox.y + movingBox.height > containerBox.height;

  //   if (isOutside) {

  //     // 2. check if box intersect another zone

  //     const globalBox = this.container.getBoundingClientRect();
  //     const globalMovingBox = {
  //       x: movingBox.x + globalBox.left,
  //       y: movingBox.y + globalBox.top,
  //       width: movingBox.width,
  //       height: movingBox.height,
  //     };

  //     const sorter = KarmaFieldsAlpha.Sorter.sorters.find(sorter => {

  //       const box = sorter.container.getBoundingClientRect();


  //     });



  //   }




  // }

  findChild(elements) {

    for (let element of elements) {

      const child = element.querySelector(".dropzone");

      if (child) {

        return child;

      }

    }

  }

  insertElementsAt(container, elements, index) {

    const target = container.children[index];

    if (target) {

      for (let element of elements) {

        container.insertBefore(element, target);

      }

    } else {

      for (let element of elements) {

        container.appendChild(element);

      }
      
    }

  }


}
