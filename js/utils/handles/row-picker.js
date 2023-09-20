

KarmaFieldsAlpha.RowPicker = class extends KarmaFieldsAlpha.GridController {

  startSelection(row) {

    this.tie = {index: row, length: 1};

    if (this.selection) { // this.selection should be frozen

      if (this.event.shiftKey) {

        this.tie = this.selection;

      } else {

        this.selection = null;

      }

    }

    this.grow(row);

  }

  growSelection(row) {

    if (!this.tie) {

      return;

    }

    const union = KarmaFieldsAlpha.Segment.union({index: row, length: 1}, this.tie);

    if (!this.selection || !KarmaFieldsAlpha.Segment.compare(union, this.selection)) {

      if (this.selection) {

        if (this.onUnselect) {

          const elements = this.sliceRows(this.selection.index, this.selection.length);

          this.onUnselect(this.selection, elements);

        }

      }

      this.selection = union;

      if (this.onSelect) {

        const elements = this.sliceRows(this.selection.index, this.selection.length);

        this.onSelect(this.selection, elements);

      }

    }

  }

  completeSelection() {

    this.tie = null;
    this.selecting = false;

  }

}
