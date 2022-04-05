KarmaFieldsAlpha.Grid = class {

	constructor() {
		this.table = {};
		this.width = 0;
		this.height = 0;
	}

	set(item, x, y) {
		if (!this.table[x]) {
			this.table[x] = {};
		}
		this.table[x][y] = item;
		this.width = Math.max(x+1, this.width);
		this.height = Math.max(y+1, this.height);
	}

	get(x, y) {
		if (this.table[x]) {
			return this.table[x][y];
		}
	}

  find(item) {
    for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {
				if (this.table[i][j] === item) {
					return {x: i, y: j};
				}
			}
		}
  }

}
