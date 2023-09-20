

KarmaFieldsAlpha.MotionPicker = class extends KarmaFieldsAlpha.MotionGrid {

  startSelection(row, col) {

    this.selecting = true;

    this.tie = {x: col, y: row, width: 1, height: 1};

    if (this.selection) { // this.selection should be frozen

      if (this.event.shiftKey) {

        this.tie = this.selection;

      } else {

        this.selection = null;

      }

    }

    this.grow(row, col);

  }

  growSelection(col, row) {

    if (!this.tie) {

      return;

    }

    const union = KarmaFieldsAlpha.Rect.union({x: col, y: row, width: 1, height: 1}, this.tie);

    if (!this.selection || !KarmaFieldsAlpha.Rect.compare(union, this.selection)) {

      if (this.selection) {

        if (this.onUnselect) {

          this.onUnselect(this.selection);

        }

      }

      this.selection = union;

      if (this.onSelect) {

        this.onSelect(this.selection);

      }

    }

  }

  completeSelection() {

    this.tie = null;
    this.selecting = false;

  }

}
