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

	static contains(r, x, y) {
		return x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height;
	}

	static intersects(r1, r2) {
		return r1.x < r2.x + r2.width && r1.x + r1.width > r2.x && r1.y < r2.y + r2.height && r1.y + r1.height > r2.y;
	}

	static isBefore(r1, r2) {
		return r1.x < r2.x + r2.width/2 && r1.y < r2.y + r2.height/2 || r1.y + r1.height < r2.y + r2.height/2;
	}

	static isAfter(r1, r2) {
		return r1.x + r1.width > r2.x + r2.width/2 && r1.y + r1.height > r2.y + r2.height/2 || r1.y > r2.y + r2.height/2;
	}

	static fromElement(element) {
		return new this(element.offsetLeft, element.offsetTop, element.clientWidth, element.clientHeight);
	}

	static offset(r, x, y) {
		return new this(r.x + x, r.y + y, r.width, r.height);
	}

	// static getIndexes(r) {
	// 	const indexes = [];
	// 	for (let i = 0; i < r.height; i++) {
	// 		for (let j = 0; j < r.width; j++) {
	// 			const index = (r.y+i)*r.width + r.x + j;
	// 			indexes.push(index);
	// 		}
	// 	}
	// 	return indexes;
	// }

	offset(x, y) {
		return this.constructor.offset(this, x, y);
	}

	isBefore(r) {
		return this.constructor.isBefore(this, r);
	}

	isAfter(r) {
		return this.constructor.isAfter(this, r);
	}

	contains(r) {
		return this.constructor.includes(r, this);
	}

	union(r) {
		return this.constructor.union(this, r);
	}

	intersects(r) {
		return this.constructor.intersects(this, r);
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
