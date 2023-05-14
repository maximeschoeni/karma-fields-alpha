KarmaFieldsAlpha.Selection = class {

  constructor(index, length, colIndex = 0, colLength = 999999) {
		this.index = index || 0;
		this.length = length || 0;
    this.colIndex = colIndex;
    this.colLength = colLength;

    this.final = true;
	}

	union(selection) {
		const index = Math.min(this.index, selection.index);
		const length = Math.max(this.index + this.length, selection.index + selection.length) - index;

    const colIndex = Math.min(this.colIndex, selection.colIndex);
		const colLength = Math.max(this.colIndex + this.colLength, selection.colIndex + selection.colLength) - colIndex;
		return new this.constructor(index, length, colIndex, colLength);
	}

  differs(selection) {
		return !this.equals(selection);
	}

	equals(selection) {
		return selection && selection instanceof this.constructor && this.index === selection.index && this.length === selection.length && this.colIndex === selection.colIndex && this.colLength === selection.colLength;
	}

	contains(index) {
		return index >= this.index && index < this.index + this.length;
	}

  containsRow(index) {
		return index >= this.index && index < this.index + this.length;
	}

  containsCell(index, col) {
		return index >= this.index && index < this.index + this.length && col >= this.colIndex && col < this.colIndex + this.colLength;
	}

  assign(object) {
    Object.assign(this, object);
  }


  static get(index) {

    // return this.object;

    if (this.object) {

      return this.object[index];

    }

  }

  static set(value, index) {

    const currentSelection = this.get(index);
    const newSelection = {[index]: value};

    KarmaFieldsAlpha.History.backup(newSelection, currentSelection || null, "selection");

    this.object = newSelection;

    // this.object = {[index]: value};

  }

  static clear() {

    KarmaFieldsAlpha.History.backup(null, this.object, "selection");

    delete this.object;

  }

}




// KarmaFieldsAlpha.Selection = class extends KarmaFieldsAlpha.Segment {

//     static path = ["state", "selection"];
//     static buffer = new KarmaFieldsAlpha.Buffer(...this.path);

//     static get(...path) {

//         return this.buffer.get(...path);

//     }

//     static change(selection, ...path) {

//         const newSelection = KarmaFieldsAlpha.DeepObject.create(selection, ...path);
//         const currentSelection = this.buffer.get();

//         this.buffer.change(newSelection, currentSelection);
//     }

//     static compare(selection, ...path) {

//         const newSelection = KarmaFieldsAlpha.DeepObject.create(selection, ...path);
//         const currentSelection = this.buffer.get();

//         return KarmaFieldsAlpha.DeepObject.equal(newSelection, currentSelection);
//     }

//     static check(...path) {

//         const index = path.pop();
//         const selection = this.buffer.get(...path);

//         return this.contain(selection, index);
//     }

// }
