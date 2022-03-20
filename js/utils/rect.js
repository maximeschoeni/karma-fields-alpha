KarmaFieldsAlpha.Rect = class {

	constructor(x, y, width, height) {
		this.x = x || 0;
		this.y = y || 0;
		this.width = width || 1;
		this.height = height || 1;
	}

	static union(r1, r2) {
		let left = Math.min(r1.x, r2.x);
		let top = Math.min(r1.y, r2.y);
		let right = Math.max(r1.x + r1.width, r2.x + r2.width);
		let bottom = Math.max(r1.y + r1.height, r2.y + r2.height);
    return new this(left, top, right - left, bottom - top);
	}

	static equals(r1, r2) {
		return r1.x === r2.x && r1.y === r2.y && r1.width === r2.width && r1.height === r2.height;
	}

	static includes(r1, r2) {
		return r1.x >= r2.x && r1.y >= r2.y && r1.x+r1.width <= r2.x+r2.width && r1.y+r1.height <= r2.y+r2.height;
	}

	// equals(r) {
	// 	return this.constructor.equals(r, this);
	// }
	//
  // getArea() {
  //   return this.width*this.height;
  // }
	//
	// includes(r) {
	// 	return this.constructor.includes(r, this);
	// }

}
