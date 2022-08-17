

KarmaFieldsAlpha.IdSelector = class {

  static findIndex(x, y) {

    for (let i = 0; i < this.width; i++) {

      for (let j = 0; j < this.height; j++) {

        const index = j*this.width + i;
        const element = this.elements[index];
        const box = element.getBoundingClientRect();

        if (KarmaFieldsAlpha.Rect.contains(box, x, y)) {

          return index;

        }

      }

    }

    return -1;
  }

  static paint(segment, ...className) {

    if (segment) {

      for (let j = segment.index; j < segment.index + segment.length; j++) {

        for (let i = 0; i < this.width; i++) {

          const index = j*this.width + i;
          const element = this.elements[index];
          element.classList.add(...className);

        }

      }

    }

  }

  static unpaint(segment, ...className) {

    if (segment) {

      for (let j = segment.index; j < segment.index + segment.length; j++) {

        for (let i = 0; i < this.width; i++) {

          const index = j*this.width + i;
          const element = this.elements[index];
          element.classList.remove(...className);

        }

      }

    }

  }

  static growSelection(segment) {

    if (!this.startSegment) {

      this.startSegment = segment; // -> when registering selected item

    }

    let selection = KarmaFieldsAlpha.Segment.union(this.startSegment, segment);

    if (!this.selection || !KarmaFieldsAlpha.Segment.equals(selection, this.selection)) {

      if (this.selection) {

        this.unpaint(this.selection, "selecting");

      }

      this.selection = selection;

      if (this.selection) {

        this.paint(this.selection, "selecting");

      }

    }

  }

  // not used
  static updateSelection(segment, currentSelection) {

    this.elements = [...container.children];

    if (currentSelection && !KarmaFieldsAlpha.Segment.equals(segment, currentSelection)) {

      this.unpaint(currentSelection, "selected");
    }

    if (segment) {

      this.paint(segment, "selected");

    }

  }

  static start(event, container, width, height, col, row, selection) {

    return new Promise((resolve, reject) => {

      this.selection = null;
      this.startSegment = null;
      this.width = width;
      this.height = height;
      this.elements = [...container.children];

      if (selection) {

        this.unpaint(selection, "selected");

      }

      const onMouseMove = event => {

        const index = this.findIndex(event.clientX, event.clientY);

        if (index > -1) {

          this.growSelection({index: index, length: 1});

        }

      }

      const onMouseUp = event =>  {
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("mousemove", onMouseMove);

        onMouseMove(event);

        this.unpaint(this.selection, "selecting");
        this.paint(this.selection, "selected");

        resolve(this.selection);

      }

      // onMouseMove(event);

      this.growSelection({index: colIndex, length: 1});

      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
    });

  }





}
