

KarmaFieldsAlpha.ListPicker = class extends KarmaFieldsAlpha.ListHandler {

  constructor(container, selection) {

    super(container);

    this.selection = {...selection};

    // this.selection = {index: index, length: length};

  }

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

    // if (index > -1) {

    this.selecting = true;

    this.startSelection(index);

    // } else {
    //
    //   this.selecting = true;
    //   this.startSelection(index);
    //
    // }

    this.event.stopPropagation();
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


  startSelection(index) {

    if (index > -1) {

      this.tie = {index: index, length: 1};

    }

    if (this.selection.length) {

      if (this.event.shiftKey) {

        this.tie = {index: this.selection.index, length: this.selection.length};

      } else {

        if (this.onUnselect) {

          const elements = this.slice(this.selection.index, this.selection.length);

          this.onUnselect(elements);

        }

        this.selection = {...this.selection, length: 0}; // -> we need to keep selection other properties (like path)

      }

    }

    this.growSelection(index);

  }

  growSelection(index) {

    // if (!this.tie) {
    //
    //   return;
    //
    // }

    let union;

    if (index > -1 && this.tie) {

      union = KarmaFieldsAlpha.Segment.union({index: index, length: 1}, this.tie);

    } else {

      union = {index: 0, length: 0};

    }

    // const union = KarmaFieldsAlpha.Segment.union({index: index, length: 1}, this.tie);

    // if (!this.selection.length || !KarmaFieldsAlpha.Segment.compare(union, this.selection)) {
    if (!KarmaFieldsAlpha.Segment.compare(union, this.selection)) {

      if (this.selection.length) {

        if (this.onUnselect) {

          const elements = this.slice(this.selection.index, this.selection.length);

          this.onUnselect(elements);

        }

      }

      this.selection = {...this.selection, ...union}; // -> we need to keep selection other properties (like path)

      if (this.onSelect) {

        const elements = this.slice(this.selection.index, this.selection.length);

        this.onSelect(elements);

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

  getSelection() {

    return this.selection;

  }

  setSelection(selection) {

    this.selection = {...selection};

  }


}
