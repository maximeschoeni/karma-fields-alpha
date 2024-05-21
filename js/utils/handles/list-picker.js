

KarmaFieldsAlpha.ListPicker = class extends KarmaFieldsAlpha.ListHandler {

  constructor(container, selection) {

    super(container);

    this.state = {};
    this.state.selection = selection;


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

    if (this.state.selection) {

      if (this.event.shiftKey) {

        this.tie = {index: this.state.selection.index, length: this.state.selection.length};

      } else {



        if (this.onUnselect) {

          const elements = this.slice(this.state.selection.index, this.state.selection.length);

          this.onUnselect(elements);

        }

        // this.state.selection = {index: 0, length: 0};

        // this.state = {
        //   ...this.state,
        //   selection: {index: 0, length: 0}
        // };

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

    // if (!this.state.length || !KarmaFieldsAlpha.Segment.compare(union, this.state)) {
    if (!this.state.selection || !KarmaFieldsAlpha.Segment.compare(union, this.state.selection)) {

      if (this.state.selection) {

        if (this.onUnselect) {

          const elements = this.slice(this.state.selection.index, this.state.selection.length);

          this.onUnselect(elements);

        }

      }

      this.state.selection = union;
      // this.state = {
      //   ...state,
      //   selection: union
      // };

      if (this.onSelect) {

        const elements = this.slice(this.state.selection.index, this.state.selection.length);

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

  getIndex() {

    return this.state.selection && this.state.selection.index || 0;

  }

  getLength() {

    return this.state.selection && this.state.selection.length || 0;

  }

  // createState(selection) {
  //
  //   return {selection: selection};
  //
  // }

  // getSelectedElements(elements = this.getChildren()) {
  //
  //   if (this.state.segment) {
  //
  //     const index = this.state.segment.index || 0;
  //     const length = this.state.segment.length || 0;
  //
  //     return elements.slice(index, index + length);
  //
  //   }
  //
  //   return [];
  //
  // }


}
