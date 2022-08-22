

KarmaFieldsAlpha.IdSelector = class {

  static sliceElements(segment) {

    const elements = [];

    for (let j = 0; j < segment.length; j++) {

      for (let i = 0; i < this.width; i++) {

        const index = (segment.index + j)*this.width + i;
        elements.push(this.elements[index]);

      }

    }

    return elements;
  }

  static getBox(segment) {

    const selectedElements = this.sliceElements(segment);

    // if (selectedElements.length === 1) {
    //
    //   return selectedElements[0].getBoundingClientRect();
    //
    // } else {
    //
    //   const first = selectedElements[0].getBoundingClientRect();
    //   const last = selectedElements[selectedElements.length-1].getBoundingClientRect();
    //
    //   return {
    //     x: first.x,
    //     y: first.y,
    //     width: last.x + last.width - first.x,
    //     height: last.y + last.height - first.y
    //   };
    //
    // }

    const first = selectedElements[0];
    const last = selectedElements[selectedElements.length-1];

    return {
      x: first.offsetLeft,
      y: first.offsetTop,
      width: last.offsetLeft + last.clientWidth - first.offsetLeft,
      height: last.offsetTop + last.clientHeight - first.offsetTop
    };

  }

  static getIndexBox(index) {
    return this.getBox({index: index, length: 1});
  }

  static findIndex(x, y) {

    for (let j = 0; j < this.height; j++) {

      const box = this.getIndexBox(j);

      if (KarmaFieldsAlpha.Rect.contains(box, x, y)) {

        return j;

      }

    }

    return -1;
  }

  // static paint(segment, ...className) {
  //
  //   if (segment) {
  //
  //     for (let j = segment.index; j < segment.index + segment.length; j++) {
  //
  //       for (let i = 0; i < this.width; i++) {
  //
  //         const index = j*this.width + i;
  //         const element = this.elements[index];
  //
  //         element.classList.add(...className);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }
  //
  // static unpaint(segment, ...className) {
  //
  //   if (segment) {
  //
  //     for (let j = segment.index; j < segment.index + segment.length; j++) {
  //
  //       for (let i = 0; i < this.width; i++) {
  //
  //         const index = j*this.width + i;
  //         const element = this.elements[index];
  //         element.classList.remove(...className);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

  static growSelection(segment) {

    if (!this.ground) {

      this.ground = segment; // -> when registering selected item

    }

    let selection = KarmaFieldsAlpha.Segment.union(this.ground, segment);

    if (!this.selection || !KarmaFieldsAlpha.Segment.equals(selection, this.selection)) {

      if (this.selection) {

        // this.unpaint(this.selection, "selecting");
        this.sliceElements(this.selection).forEach(element => {
          element.classList.remove("selecting");
        });

      }

      this.selection = selection;



      if (this.selection) {

        // this.paint(this.selection, "selecting");
        this.sliceElements(this.selection).forEach(element => {
          element.classList.add("selecting");
        });

      }

    }

  }

  static updateSelection(elements, width, segment, currentSelection) {

    this.elements = elements;
    this.width = width;

    if (currentSelection && !KarmaFieldsAlpha.Segment.equals(segment, currentSelection)) {

      // this.unpaint(currentSelection, "selected");
      this.sliceElements(currentSelection).forEach(element => {
        element.classList.remove("selected");
      });
    }

    if (segment) {

      // this.paint(segment, "selected");
      this.sliceElements(segment).forEach(element => {
        element.classList.add("selected");
      });

    }

  }

  static start(event, container, elements, width, height, col, row, selection) {

    return new Promise((resolve, reject) => {

      this.selection = null;
      this.ground = null;
      this.width = width;
      this.height = height;
      this.elements = elements;
      this.container = container;
      this.box = container.getBoundingClientRect();

      if (selection) {

        // this.unpaint(selection, "selected");
        this.sliceElements(selection).forEach(element => {
          element.classList.remove("selected");
        });

      }

      const onMouseMove = event => {

        const x = event.clientX - this.box.x;
        const y = event.clientY - this.box.y;

        const index = this.findIndex(x, y);

        if (index > -1) {

          this.growSelection({index: index, length: 1});

        }

      }

      const onMouseUp = event =>  {
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("mousemove", onMouseMove);

        onMouseMove(event);

        // this.unpaint(this.selection, "selecting");
        // this.paint(this.selection, "selected");

        this.sliceElements(this.selection).forEach(element => {
          element.classList.replace("selecting", "selected");
        });

        resolve(this.selection);

      }

      // onMouseMove(event);

      this.growSelection({index: row, length: 1});

      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
    });

  }



}
