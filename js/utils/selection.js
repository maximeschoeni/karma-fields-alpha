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




  static create(index, length, colIndex = 0, colLength = 999999, final = true) {
    return {index: index, length: length, colIndex: colIndex, colLength: colLength, final: final};
  }

  static union(selection1, selection2) {
		const index = Math.min(selection1.index, selection2.index);
		const length = Math.max(selection1.index + selection1.length, selection2.index + selection2.length) - index;

    const colIndex = Math.min(selection1.colIndex, selection2.colIndex);
		const colLength = Math.max(selection1.colIndex + selection1.colLength, selection2.colIndex + selection2.colLength) - colIndex;
		// return new selection1.constructor(index, length, colIndex, colLength);
    return {index: index, length: length, colIndex: colIndex, colLength: colLength};
	}

  static differ(selection1, selection2) {
		return !selection1.compare(selection2);
	}

	static equal(selection1, selection2) {
		return selection1.compare(selection2);
	}

  static compare(selection1, selection2) {
		return selection1 && selection2 && selection1.index === selection2.index && selection1.length === selection2.length && selection1.colIndex === selection2.colIndex && selection1.colLength === selection2.colLength;
	}

	static contain(selection1, index) {
		return index >= selection1.index && index < selection1.index + selection1.length;
	}

  static containRow(selection1, index) {
		return index >= selection1.index && index < selection1.index + selection1.length;
	}

  static containCell(selection1, index, col) {
		return index >= selection1.index && index < selection1.index + selection1.length && col >= selection1.colIndex && col < selection1.colIndex + selection1.colLength;
	}





  static get(index) {
    console.error("deprecated");
    // return this.object;

    if (this.object) {

      return this.object[index];

    }

  }

  static set(value, index) {
console.error("deprecated");
    const currentSelection = this.get(index);
    const newSelection = {[index]: value};

    KarmaFieldsAlpha.History.backup(newSelection, currentSelection || null, "selection");

    this.object = newSelection;

    // this.object = {[index]: value};

  }

  static clear() {
console.error("deprecated");
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
