KarmaFieldsAlpha.Grid = class {

  constructor() {
    this.cols = 0;
		this.array = [];
	}

  addColumn(column) {

    for (let i = 0; i < column.length; i++) {

      if (!this.array[i]) {

        this.array[i] = [];

      }

      this.array[i][this.cols] = column[i];

    }


  }

	
}

