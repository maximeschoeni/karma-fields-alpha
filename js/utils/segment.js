KarmaFieldsAlpha.Segment = class {

	// constructor(x, y, width, height) {
	// 	this.x = x || 0;
	// 	this.y = y || 0;
	// 	this.width = width || 1;
	// 	this.height = height || 1;
	// }

	// static create(indexes) {
	// 	let index = Math.min(...indexes);
	// 	let length = Math.max(...indexes) - index;
  //   return {
	// 		index: index,
	// 		length: length
	// 	};
	// }

	static union(s1, s2) {
		let index = Math.min(s1.index, s2.index);
		let length = Math.max(s1.index + s1.length, s2.index + s2.length) - index;
    return {
			index: index,
			length: length
		};
	}

	static equals(s1, s2) {
		return s1 && s2 && s1.index === s2.index && s1.length === s2.length;
	}

	static contains(segment, index) {
		return index >= segment.index && index < segment.index + segment.length;
	}

	static toArray(segment) {
		const array = [];
		for (let i = segment.index; i < segment.index + segment.length; i++) {
			array.push(i);
		}
		return array;
	}

	// static insert(array, segment, ...items) {
	// 	array.splice(segment.index, segment.length, ...items);
	// }



	//
	// static includes(r1, r2) {
	// 	return r1.x >= r2.x && r1.y >= r2.y && r1.x+r1.width <= r2.x+r2.width && r1.y+r1.height <= r2.y+r2.height;
	// }
	//
	// static intersects(r1, r2) {
	// 	return r1.x < r2.x + r2.width && r1.x + r1.width > r2.x && r1.y < r2.y + r2.height && r1.y + r1.height > r2.y;
	// }
	//
	// static isBefore(r1, r2) {
	// 	return r1.x < r2.x + r2.width/2 && r1.y < r2.y + r2.height/2 || r1.y + r1.height < r2.y + r2.height/2;
	// }
	//
	// static isAfter(r1, r2) {
	// 	return r1.x + r1.width > r2.x + r2.width/2 && r1.y + r1.height > r2.y + r2.height/2 || r1.y > r2.y + r2.height/2;
	// }
	//
	// static fromElement(element) {
	// 	return new this(element.offsetLeft, element.offsetTop, element.clientWidth, element.clientHeight);
	// }
	//
	// static offset(r, x, y) {
	// 	return new this(r.x + x, r.y + y, r.width, r.height);
	// }
	//
	// offset(x, y) {
	// 	return this.constructor.offset(this, x, y);
	// }
	//
	// isBefore(r) {
	// 	return this.constructor.isBefore(this, r);
	// }
	//
	// isAfter(r) {
	// 	return this.constructor.isAfter(this, r);
	// }
	//
	// contains(r) {
	// 	return this.constructor.includes(r, this);
	// }
	//
	// union(r) {
	// 	return this.constructor.union(this, r);
	// }
	//
	// intersects(r) {
	// 	return this.constructor.intersects(this, r);
	// }
	//



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
