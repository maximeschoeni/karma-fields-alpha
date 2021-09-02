
KarmaFieldsAlpha.Type = class {

	static register(type, path) {
		this.types[path] = type;
	}

	static sanitize(value, path) {
		if (value && this.types[path] === "json") {
			value = JSON.stringify(value);
		}
		if (typeof value === "number") {
			value = value.toString();
		}
		return value;
	}

	static parse(value, path) {
		if (value && this.types[path] === "json") {
			return JSON.parse(value);
		}
		return value;
	}

	static sanitizeObject(flatObject) {
		const obj = {};
		for (let path in flatObject) {
			obj[path] = this.sanitize(flatObject[path], path);
		}
		return obj;
	}

	static parseObject(flatObject) {
		const obj = {};
		for (let path in flatObject) {
			obj[path] = this.parse(flatObject[path], path);
		}
		return obj;
	}

}

KarmaFieldsAlpha.Type.types = {};
