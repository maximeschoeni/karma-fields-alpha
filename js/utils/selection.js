KarmaFieldsAlpha.Selection = class {

  constructor(index, length) {
		this.index = index || 0;
		this.length = length || 0;
	}

	union(selection) {
		const index = Math.min(this.index, selection.index);
		const length = Math.max(this.index + this.length, selection.index + selection.length) - index;
		return new this.constructor(index, length);
	}

  differs(selection) {
		return !this.equals(selection);
	}

	equals(selection) {
		return selection && selection instanceof this.constructor && this.index === selection.index && this.length === selection.length;
	}

	contains(index) {
		return index >= this.index && index < this.index + this.length;
	}


  static get() {

    return this.object;

  }

  static set(value) {

    KarmaFieldsAlpha.History.backup(value, this.object, "selection");

    this.object = value;

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
