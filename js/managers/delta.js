
KarmaFieldsAlpha.Delta = class {

	// static update() {
	// 	if (history.state) {
	// 		for (let path in history.state) {
	// 			this.prototype.setValue(history.state[path], path);
	// 		}
	// 	}
	// }

	writeHistory(path, value) {
		if (value === undefined) {
			value = null;
		}
		KarmaFieldsAlpha.History.writeHistory(this.suffix+path, value);
	}


	constructor(prefix) {
		this.suffix = prefix || "karma/";

	}

	getValue(path) {
		return localStorage.getItem(this.suffix+path);
	}

	setValue(value, path) { // overrided with async by arrays
		// if (KarmaFieldsAlpha.Gateway.original[path] !== value && value !== undefined && value !== null) {
		// 	localStorage.setItem(this.suffix+path, value);
		// } else {
		// 	localStorage.removeItem(this.suffix+path);
		// }
		localStorage.setItem(this.suffix+path, value);
	}

	removeValue(path) {
		localStorage.removeItem(this.suffix+path);
	}

	getObject() {
		const flatObject = {};
		for (let i = 0; i < localStorage.length; i++) {
			let path = localStorage.key(i);
			if (path.startsWith(this.suffix)) {
				flatObject[path.slice(this.suffix.length)] = localStorage.getItem(path);
			}
		}
		return flatObject;
	}

	has() {
		for (let i = 0; i < localStorage.length; i++) {
			let path = localStorage.key(i);
			if (path.startsWith(this.suffix)) {
				return true;
			}
		}
		return false;
	}

	collect(prefix, suffix) {
		const pathes = [];
		for (let i = 0; i < localStorage.length; i++) {
			const path = localStorage.key(i);
			if ((!prefix || path.startsWith(prefix)) && (!suffix || path.endsWith(suffix))) {
				pathes.push(path);
			}
		}
		return pathes;
	}

	find(regex) {
		const values = [];
		for (let i = 0; i < localStorage.length; i++) {
			const path = localStorage.key(i);

			console.log(path, path.slice(this.suffix.length), regex, path.slice(this.suffix.length).match(regex), localStorage.getItem(path));

			if (path.slice(this.suffix.length).match(regex)) {
				values.push(localStorage.getItem(path));
			}
		}
		return values;
	}

	empty(suffix = "") {
		// console.log("empty", localStorage.length);

		// const pathes = [];
		// for (let i = 0; i < localStorage.length; i++) {
		// 	const path = localStorage.key(i);
		// 	if (path.startsWith(this.suffix)) {
		// 		pathes.push(path);
		// 	}
		// }

		this.collect(this.suffix+suffix).forEach(path => {
			localStorage.removeItem(path);
		});
		//
		// for (let i = localStorage.length - 1; i >= 0; i--) {
		// 	let path = localStorage.key(i);
		// 	console.log("removeItem", path, i, path.startsWith(this.suffix));
		// 	if (path.startsWith(this.suffix)) {
		// 		localStorage.removeItem(path);
		// 	}
		// }

	}


	// getValue(path) {
	// 	return this.getObject()[path];
	// }
	//
	// setValue(value, path) {
	// 	const delta = this.getObject();
	// 	if (KarmaFieldsAlpha.Gateway.original[path] !== value && value !== undefined && value !== null) {
	// 		delta[path] = value;
	// 	} else {
	// 		delete delta[path];
	// 	}
	// 	this.setObject(delta);
	// }
	//
	// removeValue(path) {
	// 	this.setDelta(undefined, path);
	// }
	//
	// getObject() {
	// 	if (!this.cache) {
	// 		const deepObject = localStorage.getItem(this.suffix);
	// 		const flatObject = KarmaFieldsAlpha.FlatObject.fromDeep(deepObject);
	// 		this.cache = KarmaFieldsAlpha.Gateway.sanitizeObject(flatObject);
	// 	}
	// 	return this.cache;
	// }
	//
	// setObject(flatObject) {
	// 	flatObject = KarmaFieldsAlpha.Gateway.parseObject(flatObject);
	// 	const deepObject = KarmaFieldsAlpha.FlatObject.toDeep(flatObject);
	// 	let value = JSON.stringify(deepObject);
	// 	localStorage.setItem(this.suffix, value);
	// 	this.cache = null;
	// }
	//
	// empty() {
	// 	localStorage.delete(this.suffix);
	// }
	//
	// has() {
	// 	return Object.values(this.getObject()).length > 0;
	// }

}
