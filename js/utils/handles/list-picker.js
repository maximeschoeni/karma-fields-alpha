

KarmaFieldsAlpha.ListPicker = class extends KarmaFieldsAlpha.ListHandler {

  // constructor(container) {
  //
  //   super(container);
  //
  //   this.selection = {};
  //
  // }

  init() {

    super.init();

    const index = this.findIndex(this.x, this.y);

    this.start(index);

  }

  update() {

    super.update();

    const index = this.findIndex(this.x, this.y);

    this.move(index);

  }

  complete() {

    super.complete();

    this.end();

  }

  start(index) {

    if (index > -1) {

      this.selecting = true;

      this.startSelection(index);

      this.event.stopPropagation();

    }

  }

  move(index) {

    if (index > -1 && this.selecting) {

      this.growSelection(index);

    }

  }

  end() {

    if (this.selecting) {

      this.completeSelection();

    }

  }


  startSelection(row) {

    this.tie = {index: row, length: 1};

    if (this.selection) { // this.selection should be frozen

      if (this.event.shiftKey) {

        this.tie = this.selection;

      } else {

        if (this.onUnselect) {

          const elements = this.slice(this.selection.index, this.selection.length);

          this.onUnselect(this.selection, elements);

        }

        this.selection = {};

      }

    }

    this.growSelection(row);

  }

  growSelection(row) {

    if (!this.tie) {

      return;

    }

    const union = KarmaFieldsAlpha.Segment.union({index: row, length: 1}, this.tie);

    if (!this.selection || !KarmaFieldsAlpha.Segment.compare(union, this.selection)) {

      if (this.selection) {

        if (this.onUnselect) {

          const elements = this.slice(this.selection.index, this.selection.length);

          this.onUnselect(this.selection, elements);

        }

      }

      this.selection = union;

      if (this.onSelect) {

        const elements = this.slice(this.selection.index, this.selection.length);

        this.onSelect(this.selection, elements);

      }

    }

  }

  completeSelection() {

    this.tie = null;
    this.selecting = false;

    if (this.onSelectionComplete) {

      this.onSelectionComplete();

    }

  }

  // setSelection(selection) {
  //
  //   this.selection = {...selection};
  //
  // }

}
