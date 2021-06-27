
KarmaFieldsAlpha.Domain = class {

	constructor() {
		this.index = 0;
		this.max = 0;
		this.data = {};
	}

	update(id, state) {
		if (id !== this.id || state !== this.state) {
			while (this.max > this.index) {
				if (this.onDelete) {
					this.onDelete(this.max);
				}
				this.max--;
			}
			this.index++;
			this.max++;
			this.id = id;
			this.state = state;
		}
	}
	undo() {
		this.index = Math.max(this.index-1, 0);
		this.id = undefined;
		this.state = undefined;
		if (this.onChange) {
			this.onChange(this.index);
		}
	}

	redo(field) {
		this.index = Math.min(this.index+1, this.max);
		this.id = undefined;
		this.state = undefined;
		if (this.onChange) {
			this.onChange(this.index);
		}
	}

	// read(field) {
  //   field.historyMin = Math.min(field.historyMax, this.index);
	// 	let path = field.getPath().join("/");
	// 	if (this.data[path]) {
	// 		while (this.data[path][field.historyMin] === undefined && field.historyMin > 0) {
	//       field.historyMin--;
	//     }
	//     return this.data[path][field.historyMin];
	// 	}
  // }
	//
	// write(field, rawValue) {
  //   field.historyMin++;
	// 	let path = field.getPath().join("/");
	//
	// 	if (!this.data[path]) {
	// 		this.data[path] = {};
	// 	}
	//
  //   while (field.historyMin < this.index) {
  //     this.data[path][field.historyMin] = undefined;
  //     field.historyMin++;
  //   }
	//
  //   field.historyMax = this.index;
  //   this.data[path][this.index] = rawValue;
  // }

	read(field) {
		let path = field.getPath().join("/");
		let index = this.index;

		if (path && this.data[path]) {
			while (this.data[path][index] === undefined && index > 0) {
	      index--;
	    }
	    return this.data[path][index];
		}
  }

	readPath(path) {
		let index = this.index;

		if (path && this.data[path]) {
			while (this.data[path][index] === undefined && index > 0) {
	      index--;
	    }
	    return this.data[path][index];
		}
  }

	write(field, rawValue) {
		let path = field.getPath().join("/");

		if (!this.data[path]) {
			this.data[path] = {};
		}

		// -> missing: erase upwards changes
    // while (field.historyMin < this.index) {
    //   this.data[path][field.historyMin] = undefined;
    //   field.historyMin++;
    // }

    this.data[path][this.index] = rawValue;
  }

	writePath(path, rawValue) {
		if (!this.data[path]) {
			this.data[path] = {};
		}

		// -> missing: erase upwards changes
    // while (field.historyMin < this.index) {
    //   this.data[path][field.historyMin] = undefined;
    //   field.historyMin++;
    // }

    this.data[path][this.index] = rawValue;
  }



};
