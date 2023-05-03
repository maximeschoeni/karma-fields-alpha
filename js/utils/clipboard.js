

KarmaFieldsAlpha.Clipboard = class {

  static getElement() {

    return document.getElementById("karma-fields-alpha-clipboard");

  }

  static clear() {

    const clipboard = this.getElement();

    clipboard.value = "";

  }

  static write(string) {

    const clipboard = this.getElement();

    if (clipboard) {

      clipboard.value = string;
      clipboard.focus({preventScroll: true});
      clipboard.select();
      clipboard.setSelectionRange(0, 999999);

    }

  }

  static read() {

    const clipboard = this.getElement();

    if (clipboard) {

      return clipboard.value;

    }

    return "";
  }

  static focus() {

    const clipboard = this.getElement();

    if (clipboard) {

      clipboard.focus({preventScroll: true});
      clipboard.select();
      clipboard.setSelectionRange(0, 999999);

    }

  }





  static parse(string) {
    return Papa.parse(string, {
      delimiter: '\t'
    }).data;
  }

  static unparse(data) {
    return Papa.unparse(data, {
      delimiter: "\t",
      newline: "\n"
    });
  }

  static toJson(dataArray) {
    if (dataArray && dataArray.length) {
      const header = dataArray.shift();
      return dataArray.map(row => Object.fromEntries(header.map((key, index) => [key, row[index]])));
    }
    return [];
  }

  static toDataArray(data, headers = true) {
    if (data && data.length) {
      const keys = Object.keys(data[0]);
      const array = data.map(row => keys.map(key => row[key]))
      if (headers) {
        return [keys, ...array];
      } else {
        return array;
      }

    }
    return [];
  }

  static decode(string) {

    const data = this.parse(string);

    return this.toJson(data);

  }

  static encode(json) {

    const data = this.toDataArray(json);

    return this.unparse(data);

  }

}

KarmaFieldsAlpha.Grid = class {

  constructor(string) {
    // this.cols = 0;
		// this.array = [];

    // this.parse(string);

    if (string) {

      if (typeof string !== "string") {

        console.error("A string is expected!", string);

      }

      this.array = Papa.parse(string, {
        delimiter: '\t'
      }).data;

      this.cols = this.array[0].length;

    } else {

      this.array = [];

      this.cols = 0;

    }

	}

  // addValue(value) {

  //   if (!this.array[0]) {

  //     this.array[0] = [];

  //   }

  //   this.array[0][this.cols] = value;

  //   this.cols++;
  // }

  shiftColumn() {

    const column = [];

    for (let i = 0; i < this.array.length; i++) {

      if (this.array[i]) {

        column[i] = this.array[i].shift();

      }

    }

    this.cols--;

    return column;
  }

  addColumn(...columns) {

    for (let column of columns) {

      for (let i = 0; i < column.length; i++) {

        if (!this.array[i]) {

          this.array[i] = [];

        }

        this.array[i][this.cols] = column[i];

      }

      this.cols++;

    }

  }

  getColumn(index = 0) {

    const column = [];

    for (let i = 0; i < this.array.length; i++) {

      column.push(this.array[i][index]);

    }

    return column;
  }

  addRow(...rows) {

    for (let row of rows) {

      this.cols = Math.min(this.cols, row.length);

      this.array.push(row);

    }

  }

  getRow(index = 0) {

    return this.array[index];

  }

  sliceRows(index, length = 1) {

    const grid = new this.constructor();

    grid.addRow(...this.array.slice(index, index + length));

    return grid;
  }

  toString() {

    return Papa.unparse(this.array, {
      delimiter: "\t",
      newline: "\n"
    });

  }

  // parse(string) {

  //   if (string) {

  //     this.array = Papa.parse(string, {
  //       delimiter: '\t'
  //     }).data;

  //     this.cols = this.array[0].length;

  //   } else {

  //     this.array = [];

  //     this.cols = 0;

  //   }

  // }




}
