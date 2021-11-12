//
// KarmaFieldsAlpha.Type = class {
//
// 	static register(type, path) {
// 		this.types[path] = type;
// 	}
//
// 	static sanitize(value, path) {
// 		if (value && this.types[path] === "json") {
// 			value = JSON.stringify(value);
// 		}
// 		if (typeof value === "number") {
// 			value = value.toString();
// 		}
// 		return value;
// 	}
//
// 	static parse(value, path) {
// 		if (value && this.types[path] === "json") {
// 			return JSON.parse(value);
// 		}
// 		return value;
// 	}
//
// 	static sanitizeObject(flatObject) {
// 		const obj = {};
// 		for (let path in flatObject) {
// 			obj[path] = this.sanitize(flatObject[path], path);
// 		}
// 		return obj;
// 	}
//
// 	static parseObject(flatObject) {
// 		const obj = {};
// 		for (let path in flatObject) {
// 			obj[path] = this.parse(flatObject[path], path);
// 		}
// 		return obj;
// 	}
//
// }
//
// KarmaFieldsAlpha.Type.types = {};



KarmaFieldsAlpha.Type = class {

	static register(type, ...path) {
		// this.types[path] = type;
		KarmaFieldsAlpha.DeepObject.assign3(this.types, type, ...path);
	}

	static get(...path) {
		return KarmaFieldsAlpha.DeepObject.get3(this.types, ...path);
	}

	static sanitize(value, ...path) {
		const type = KarmaFieldsAlpha.DeepObject.get3(this.types, ...path);

		if (value && type === "json") {
			value = JSON.stringify(value);
		}
		if (typeof value === "number") {
			value = value.toString();
		}
		return value;
	}

	static parse(value, ...path) {
		const type = KarmaFieldsAlpha.DeepObject.get3(this.types, ...path);

		if (type === "json" && typeof value === "string") {
			try {
				return JSON.parse(value);
			} catch (error) {
				console.log(value, "/", type, "/", path);
				console.error(error);
			}

		}
		return value;
	}

	// static sanitizeObject(flatObject) {
	// 	console.warn("deprecated sanitizeObject");
	// 	const obj = {};
	// 	for (let path in flatObject) {
	// 		obj[path] = this.sanitize(flatObject[path], ...path.split("/"));
	// 	}
	// 	return obj;
	// }
	//
	// static parseObject(flatObject) {
	// 	console.warn("deprecated parseObject");
	// 	const obj = {};
	// 	for (let path in flatObject) {
	// 		obj[path] = this.parse(flatObject[path], ...path.split("/"));
	// 	}
	// 	return obj;
	// }

	static sanitizeObject(object, ...path) {
	  const result = {};
		for (let i in object) {
			const type = KarmaFieldsAlpha.DeepObject.get3(this.types, ...path, i);
			const valueType = typeof object[i];

			if (type === "json" && valueType === "object") {
				result[i] = JSON.stringify(object[i]);
			} else if (object[i] && valueType === "object") {
	      result[i] = this.sanitizeObject(object[i], ...path, i);
	    } else if (valueType === "string") {
	      result[i] = object[i];
	    }
	  }
	  return result;
	}


	static parseObject(object, ...path) {
	  const result = {};
		for (let i in object) {
			const type = KarmaFieldsAlpha.DeepObject.get3(this.types, ...path, i);
			const valueType = typeof object[i];

			if (type === "json" && valueType === "string") {
				result[i] = JSON.parse(object[i]);
			} else if (object[i] && valueType === "object") {
	      result[i] = this.parseObject(object[i], ...path, i);
	    } else if (valueType === "string") {
	      result[i] = object[i];
	    }
	  }
	  return result;
	}


}

KarmaFieldsAlpha.Type.types = {};
