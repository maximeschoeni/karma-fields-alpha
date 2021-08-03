
/*
Cache handling:


caches.open("x").then(cache => {
	cache.put("/aa/bb", new Response("asdfasdfasdf", {
		status: 200,
		headers: {
			"Content-Type": "application/json"
		}
	}));
});

caches.open("x").then(cache => {
	return cache.match("/aa/bb").then(r => r.text())
})


*/

KarmaFieldsAlpha.cache = {};
KarmaFieldsAlpha.forms = {};

KarmaFieldsAlpha.fields.form = class extends KarmaFieldsAlpha.fields.group {

	constructor(resource, parent, form) {
		super(resource, parent);

		this.useCache = resource.use_cache ?? true;
		this.useLocalStorage = resource.useLocalStorage ?? true;

		this.delta = {};
		this.original = {};
		this.types = {};


		this.historyIndex = 0;
		this.historyMax = 0;
		this.history = {};

		this.initHistory();

		// debug
		KarmaFieldsAlpha.forms[resource.driver] = this;

	}

	initField() {
		const field = this;
		this.events.change = function(currentField, value) {
			// return field.bubble("submit"); //
			field.submit();
		};

		this.events.submit = async function() {
			console.error("Deprecated event submit");
			// let values = await field.getModifiedValue();
			//
			// if (values) {
			// 	// KarmaFieldsAlpha.Form.cache = {};
			// 	return this.save(values);
			// 	// return KarmaFieldsAlpha.Form.update(resource.driver, values).then(function(results) {
			// 	// 	// field.updateOriginal();
			// 	// 	field.setValue(values, "set"); // -> unmodify fields
			// 	// 	// field.setValue(results, "set"); // -> update value (false or true -> no effect)
			// 	// 	// field.triggerEvent("modify");
			// 	// 	// field.triggerEvent("set");
			// 	// 	return results;
			// 	// });
			// }
			return this.save();
		};
	}

	edit() {
		return this.bubble("change");
	}

	async submit() {
		await this.save();
	}

	getCache(type, driver, key) {
		if (this.useCache && KarmaFieldsAlpha.cache[type] && KarmaFieldsAlpha.cache[type][driver]) {
			return KarmaFieldsAlpha.cache[type][driver][key];
		}
	}

	updateCache(type, driver, key, promise) {
		if (this.useCache && promise) {
			if (!KarmaFieldsAlpha.cache[type]) {
				KarmaFieldsAlpha.cache[type] = {};
			}
			if (!KarmaFieldsAlpha.cache[type][driver]) {
				KarmaFieldsAlpha.cache[type][driver] = {};
			}
			if (!KarmaFieldsAlpha.cache[type][driver][key]) {
				KarmaFieldsAlpha.cache[type][driver][key] = promise;
			}
		}
	}

	getRemoteOptions(queryString, driver) {
		driver = driver || this.resource.driver || "nodriver";
		const promise = this.getCache("options", driver, queryString) ?? KarmaFieldsAlpha.Form.fetch2(driver, queryString);

		this.updateCache("options", driver, queryString, promise);

		return promise;


		// if (!KarmaFieldsAlpha.cache.options) {
		// 	KarmaFieldsAlpha.cache.options = {};
		// }
		// if (!KarmaFieldsAlpha.cache.options[driver]) {
		// 	KarmaFieldsAlpha.cache.options[driver] = {};
		// }
		// if (!KarmaFieldsAlpha.cache.options[driver][queryString]) {
		// 	KarmaFieldsAlpha.cache.options[driver][queryString] = KarmaFieldsAlpha.Form.fetch2(driver, queryString);
		// }
		// return KarmaFieldsAlpha.cache.options[driver][queryString];

		// return KarmaFieldsAlpha.Form.fetch2(driver || this.resource.driver, queryString);
  }

	async getRemoteTable(queryString, driver, rowName) {
		if (!driver) {
			driver = this.resource.driver || "nodriver";
		}
		const promise = this.getCache("tables", driver, queryString) ?? KarmaFieldsAlpha.Form.query(driver, queryString);
		this.updateCache("tables", driver, queryString, promise);

		const results = await promise;

		const ids = (results.items || results || []).map((row, index) => {
			const id = row[rowName || "id"].toString();
			for (let key in row) {
				const path = id+"/"+key;
				let value = row[key];
				if (typeof value === "number") {
					value = value.toString();
				} else if (typeof value !== "string") {
					this.types[path] = "json";
					value = JSON.stringify(value);
				}
				this.original[path] = value;
			}
			return id;
		});

		// this.stringifyTable(results.items || results || []);
		//
		// KarmaFieldsAlpha.FlatObject.assign(this.original, results.items || results || []);

		// for (path in flatObj) {
		// 	// localStorage.setItem(path, flatObj[path]);
		// }


		return {
			ids: ids,
			count: Number(results.count) || 0,
			rowName: rowName || "id"
		};

	}

	// stringifyTable(table) {
	// 	table.forEach((row, index) => {
	// 		for (let key in row) {
	// 			if (typeof row[key] === "number") {
	// 				row[key] = row[key].toString();
	// 			} else if (typeof row[key] !== "string") {
	// 				this.types[index+"/"+key] = "json";
	// 				row[key] = JSON.stringify(row[key]);
	// 			}
	// 		}
	// 	});
	//
	// }

	getDriver() {
		console.warn("Deprecated function getDriver");
		return this;
	}

	getPath() {
		return [];
	}

	readPath(keys) {
		console.error("Deprecated function readPath");
		return this.domain.readPath(keys.join("/"));
	}

	writePath(keys, rawValue) {
		console.error("Deprecated function writePath");
		this.domain.writePath(keys.join("/"), rawValue);
	}

	getFromPath(keys) {
		console.error("Deprecated function getFromPath");
		return KarmaFieldsAlpha.Form.get(this.resource.driver, keys.join("/"));
	}

	async getRemoteValue(path, driver) {
		// const path = keys.join("/");
		if (!driver) {
			driver = this.resource.driver || "nodriver";
		}

		const promise = this.getCache("values", driver, path) ?? KarmaFieldsAlpha.Form.get(driver, path);
		this.updateCache("values", driver, path, promise);

		let value = await promise;


		if (Array.isArray(value)) {
			value = value[0];
		}
		if (value) {
			// if (typeof value === "number") {
			// 	value = value.toString();
			// } else if (typeof value !== "string") {
			// 	value = JSON.stringify(value);
			// 	this.types[path] = "json";
			// }

			value = this.sanitize(value, path);
			this.original[path] = value;
		}


		// Object.assign(this.original, KarmaFieldsAlpha.toFlatObject(results, path));
		// KarmaFieldsAlpha.FlatObject.assign(this.original, results, path);

		return value;
	}

	async getRemoteArray(path, driver) {
		// const path = keys.join("/");
		if (!driver) {
			driver = this.resource.driver || "nodriver";
		}

		const promise = this.getCache("values", driver, path) ?? KarmaFieldsAlpha.Form.get(driver, path);
		this.updateCache("values", driver, path, promise);

		let value = await promise;

		const string = JSON.stringify(value);

		this.original[path] = string;
		this.types[path] = "json";

		return string;
	}

	// getCache(keys) {
	// 	const path = keys.join("/");
	// 	return KarmaFieldsAlpha.cache[this.resource.driver] && KarmaFieldsAlpha.cache[this.resource.driver][path];
	// }

	setCache(value, keys, driver) {
		const path = keys.join("/");
		if (!driver) {
			driver = this.resource.driver || "nodriver";
		}
		if (!KarmaFieldsAlpha.cache.values) {
			KarmaFieldsAlpha.cache.values = {};
		}
		if (!KarmaFieldsAlpha.cache.values[driver]) {
			KarmaFieldsAlpha.cache.values[driver] = {};
		}
		if (!KarmaFieldsAlpha.cache.values[driver][path]) {
			KarmaFieldsAlpha.cache.values[driver][path] = Promise.resolve(value);
		}
  }

	// async setRemoteValue(rawValue, keys) {
  //   // let value = await this.get();
  //   // value = this.prepare(value);
  //   // this.initValue(value);
	//
	// 	const path = keys.join("/");
	//
	// 	if (!KarmaFieldsAlpha.cache[this.resource.driver]) {
	// 		KarmaFieldsAlpha.cache[this.resource.driver] = {};
	// 	}
	//
  //   KarmaFieldsAlpha.cache[this.resource.driver][path] = rawValue;
  // }

	sanitize(value, path) {
		if (typeof value === "number") {
			value = value.toString();
		} else if (value && typeof value !== "string") {
			value = JSON.stringify(value);
			this.types[path] = "json";
		}
		return value;
	}

	parse(value, path) {
		if (value && this.types[path] === "json") {
			value = JSON.parse(value);
		}
		return value;
	}

	getOriginalValue(path) {
		// const path = keys.join("/");
		return this.original[path];
  }

	removeOriginalValue(path) {
		// const path = keys.join("/");
    delete this.original[path];
  }

  setOriginalValue(value, path) {
		// const path = keys.join("/");
		this.original[path] = value;
  }

	getDeltaValue(path) {
		// const path = keys.join("/");
		let value = localStorage.getItem(this.resource.driver+"/"+path) ?? undefined;

		// if (this.types[path] === "json") {
		// 	value = JSON.parse(value);
		// }
		return value;
  }

	setDeltaValue(value, path) { // overrided with async by arrays
		// const path = keys.join("/");
		// value = value.toString();
		// value = this.sanitize(value);

		if (this.original[path] !== value && value !== undefined) {
			localStorage.setItem(this.resource.driver+"/"+path, value);
		} else {
			localStorage.removeItem(this.resource.driver+"/"+path);
		}

		// this.setLocalValue(path, value);

  }

	removeDeltaValue(path) {
		// const path = keys.join("/");
    // this.delta[path] = undefined;
		// this.useLocalStorage && localStorage.removeItem(this.resource.driver+"/"+path);

		localStorage.removeItem(this.resource.driver+"/"+path);
		// this.writeHistory(path, undefined);
  }

	async fetchValue(keys, driver) {
		const path = keys.join("/");
		const originalValue = this.getOriginalValue(path) ?? this.getRemoteValue(path, driver);
		let value = this.getDeltaValue(path) ?? originalValue;
		return this.parse(value, path);
  }

	// editValue(value, keys) {
	// 	const path = keys.join("/");
	//
	// 	value = this.sanitize(value, path);
	//
	// 	this.setDeltaValue(value, keys);
	//
	// 	return this.edit();
	// }

	getValue(keys, driver) {
		const path = keys.join("/");
		// const originalValue = this.getOriginalValue(path);
		let value = this.getDeltaValue(path); // ?? originalValue;
		return this.parse(value, path);

		// console.error("deprecated getValue");
		// return this.getDeltaValue(keys);
		// let value = this.getDeltaValue(keys);
		// const path = keys.join("/");
		//
		// if (this.types[path] === "json") {
		// 	value = JSON.parse(value);
		// }
		// return value;
	}

  setValue(value, keys) {
		// console.error("deprecated setValue");
		// this.setDeltaValue(value, keys)
		const path = keys.join("/");
		value = this.sanitize(value, path);
		this.setDeltaValue(value, path);
		this.writeHistory(path, value);
  }

	removeValue(keys) {
		const path = keys.join("/");
		this.removeDeltaValue(path);
		this.writeHistory(path, undefined);

		// const path = keys.join("/");
		//
		// localStorage.removeItem(this.resource.driver+"/"+path);
		//
		// this.writeHistory(path);
  }

	// setLocalValue(path, value) {
	// 	this.setDeltaValue(value, path);
	// }

	// getDeltaArray(keys) {
	// 	let value = this.getDeltaValue(keys);
	// 	return JSON.parse(value);
  // }
	//
	// setArrayValue(value, arrayKeys, keys) {
	// 	let array = this.getDeltaValue(arrayKeys);
	// 	array = JSON.parse(value);
	// 	KarmaFieldsAlpha.DeepObject.assign(array, keys, value);
	// 	this.setArray(array, arrayKeys);
  // }

	async fetchArray(keys, driver) {
		const path = keys.join("/");
		const originalValue = this.getOriginalValue(path) ?? await this.getRemoteArray(path, driver);
		const value = this.getDeltaValue(path) ?? originalValue;
		return value && JSON.parse(value) || [];
	}

	setArray(value, keys) {
		console.log("deprecated setArray");
		value = JSON.stringify(value);
		return this.setDeltaValue(value, keys);
  }

	getArray(keys) {
		console.log("deprecated getArray");
		// const originalValue = this.getOriginalValue(keys) ?? await this.getRemoteArray(keys);
		// const value = this.getDeltaValue(keys) ?? originalValue;
		// return value && JSON.parse(value) || [];
		let value = this.getDeltaValue(keys);
		return value && JSON.parse(value) || [];
	}

	removeArray(keys) {
		console.log("deprecated removeArray");
		return this.removeDeltaValue(keys);
  }

	isModified(value, keys) {
		let delta = value ?? this.getDeltaValue(keys);
		return delta && delta !== this.getOriginalValue(keys) || false;
	}




	getDeltaPathes() {
		return this.getDeltaSubpathes(this.resource.driver);
		// const pathes = [];
		// for (let i = 0; i < localStorage.length; i++) {
		// 	let path = localStorage.key(i);
		// 	if (path.startsWith(this.resource.driver+"/")) {
		// 		pathes.push(path);
		// 	}
  	// }
		// return pathes;
  }

	getDeltaSubpathes(dirPath) {
		const subpathes = [];
		for (let i = 0; i < localStorage.length; i++) {
			let path = localStorage.key(i);
			if (path.startsWith(dirPath+"/")) {
				subpathes.push(path);
			}
  	}
		return subpathes;
  }

	/**
	 * rootPath must have trailing slash
	 * return flatObject
	 */
	sliceDelta(dirPath) { // need trailing slash
		const flatObj = {};
		for (let i = 0; i < localStorage.length; i++) {
			let path = localStorage.key(i);
			if (path.startsWith(dirPath)) {
				const subpath = path.slice(dirPath.length);
				flatObj[subpath] = localStorage.getItem(path);
			}
  	}
		return flatObj;
  }

	/**
	 * merge flatObject to localStorage
	 */
	assignDelta(flatObject, dirPath) { // need trailing slash
		for (let path in flatObject) {
			// localStorage.setItem((dirPath && dirPath+path || path), flatObject[path]);
			// this.setLocalValue((dirPath && dirPath+path || path), flatObject[path]);
			this.setDeltaValue(flatObject[path], dirPath && dirPath+path || path);
			// this.writeHistory(path, flatObject[path]);
  	}
  }

	/**
	 * remove all delta whose path begins width dirPath
	 */
	removeDelta(dirPath) { // need trailing slash
		const flatObj = this.sliceDelta(dirPath);
		for (let subpath in flatObj) {
			localStorage.removeItem(dirPath+subpath, flatObject[subpath]);
		}
  }




	// getModifiedValue() {
	// 	return this.delta;
	// }

	async save() {
		const values = await this.getModifiedValue();

		this.getDeltaPathes().forEach(path => {
			localStorage.removeItem(path);
		});

		if (values) {
			const flatObj = KarmaFieldsAlpha.FlatObject.fromDeep(values);
			const results = await KarmaFieldsAlpha.Form.update(this.resource.driver, values);
			if (results) {
				KarmaFieldsAlpha.FlatObject.assign(flatObj, results);
			}
			for (let path in flatObj) {
				let value = flatObj[path];
				if (typeof value === "number") {
					value = value.toString();
				} else if (typeof value !== "string") {
					this.types[path] = "json";
					value = JSON.stringify(value);
				}
				this.original[path] = value;
			}




			//
			// if (results && typeof results === "object") {
			// 	for (let id in results) {
			// 		let row = results[id];
			// 		for (let key in row) {
			// 			const path = id+"/"+key;
			// 			let value = row[key];
			// 			if (typeof value === "number") {
			// 				value = value.toString();
			// 			} else if (typeof value !== "string") {
			// 				this.types[path] = "json";
			// 				value = JSON.stringify(value);
			// 			}
			// 			this.original[path] = value;
			// 		}
			// 	});
			// }

		}

		return values;
	}

	hasModifiedValue() {
		return this.getDeltaPathes().length > 0;
		// for (let path in this.delta) {
		// 	if (this.delta[path] !== undefined && this.delta[path] !== this.original[path]) {
		// 		return true;
		// 	}
		// }
		// return false;
	}

	getModifiedValue() {
		// return this.getDeltaPathes().reduce((object, path) => {
		// 	const value = localStorage.getItem(path);
		// 	KarmaFieldsAlpha.assignFromPath(object, path.split("/"), value)
		// 	// this.setObjectValue(path.split("/"), value, object);
		// 	return object;
		// }, {})[this.resource.driver];

		const flatObject = this.sliceDelta(this.resource.driver+"/");

		for (let path in flatObject) {
			if (this.types[path] === "json") {
				flatObject[path] = JSON.parse(flatObject[path]);
			}
		}
		return KarmaFieldsAlpha.FlatObject.toDeep(flatObject);

	}

	// setObjectValue(keys, value, object) {
	// 	let key = keys.shift();
	// 	if (!object[key] || !typeof object[key] === "object") {
	// 		object[key] = {};
	// 	}
	// 	if (keys.length > 0) {
	// 		this.setObjectValue(keys, value, object[key]);
	// 	} else {
	// 		object[key] = value;
	// 	}
	// }


	// clear() {
	// 	KarmaFieldsAlpha.cache = {};
	// 	this.original = {};
	// }


	getState() {
    return this.state || "";
  }






	initHistory() {
		const pathes = this.getDeltaPathes();
		if (pathes.length) {
			this.backup("init");
			pathes.forEach(path => {
				const relativePath = path.slice(this.resource.driver.length+1);
				const value = localStorage.getItem(path);
				this.writeHistory(relativePath, value);
			});
		}
	}

	backup(keys) {
		super.backup(keys);
		keys = this.getKeyPath(keys);
		const id = keys.join("/");

		if (id !== this.historyId) {
			this.historyIndex++;
			this.historyMax = this.historyIndex;
			this.history[this.historyIndex] = {};
			this.historyId = id;
		}
	}

	isHistoryIndexEmpty(index) {
		for (let path in this.history[index]) {
			if (this.getLastEntry(path) !== undefined) {
				return false;
			}
		}
		return true;
	}

	hasUndo() {
		return this.historyIndex > 0;
	}
	hasRedo() {
		return this.historyIndex < this.historyMax;
	}
	countUndo() {
		return this.historyIndex;
	}
	countRedo() {
		return this.historyMax - this.historyIndex;
	}

	setHistoryIndex(index) {
		while (this.historyIndex > index && this.hasUndo()) {
			this.undo();
		}
		while (this.historyIndex < index && this.hasRedo()) {
			this.redo();
		}
	}

	// async undo() {
	undo() {
		// let fields = [];
		// debugger;
		if (this.historyIndex > 0) {
			for (let path in this.history[this.historyIndex]) {
				// let index = this.historyIndex-1;
				// while (index > 0 && (!this.history[index] || this.history[index][path] === undefined)) {
				// 	index--;
				// }
				// this.delta[path] = this.history[index][path];

				// this.delta[path] = this.getLastEntry(path);
				const value = this.getLastEntry(path);
				// this.setLocalValue(path, value);
				this.setDeltaValue(value, path);

			}

			this.historyIndex--;
			this.historyId = undefined;

			// await Promise.all(fields.map(field => field.update()));
		}
	}

	getLastEntry(path) {
		let index = this.historyIndex-1;
		while (index > 0 && (!this.history[index] || this.history[index][path] === undefined)) {
			index--;
		}
		// if (this.history[index]) {
		// 	return this.history[index][path];
		// }
		return this.history[index] && this.history[index][path] || this.original[path];
	}

	redo(field) {
		if (this.historyIndex < this.historyMax) {
			this.historyIndex++;
			for (let path in this.history[this.historyIndex]) {
				if (this.history[this.historyIndex] && this.history[this.historyIndex][path] !== undefined) {
					// this.delta[path] = this.history[this.historyIndex][path];
					// localStorage.setItem(this.resource.driver+"/"+path, this.history[this.historyIndex][path]);
					// let value = this.history[this.historyIndex][path];
					// if (value === undefined) {
					// 	localStorage.removeItem(this.resource.driver+"/"+path);
					// } else {
					// 	localStorage.setItem(this.resource.driver+"/"+path, value);
					// }
					// this.setLocalValue(path, this.history[this.historyIndex][path]);
					this.setDeltaValue(this.history[this.historyIndex][path], path);
				}
			}
			this.historyId = undefined;
		}
	}

	writeHistory(path, rawValue) {
		if (!this.history[this.historyIndex]) {
			this.history[this.historyIndex] = {};
		}
		this.history[this.historyIndex][path] = rawValue;
	}



};

KarmaFieldsAlpha.fields.form.getForm = function(driverName) {
	if (!KarmaFieldsAlpha.forms[driverName]) {
		KarmaFieldsAlpha.forms[driverName] = new KarmaFieldsAlpha.fields.form({
			driver: driverName
		});
	}
	return KarmaFieldsAlpha.forms[driverName];
}

//
//
// /**
//  * KarmaFieldsAlpha.assignFromPath({}, ["a", "b"], 3); // -> {"a":{"b":3}}
//  */
// KarmaFieldsAlpha.assignFromPath = function(object, pathKeys, value) {
//   let key = pathKeys.shift();
//   if (!object[key] || typeof object[key] !== "object") {
//     object[key] = {};
//   }
//   if (pathKeys.length > 0) {
//     this.assignFromPath(object[key], pathKeys, value);
//   } else {
//     object[key] = value;
//   }
// }
// /**
//  * KarmaFieldsAlpha.getFromPath({"a": {"b": 5}}, ["a", "b"]); // -> 5
//  */
// KarmaFieldsAlpha.getFromPath = function(object, pathKeys) {
// 	if (pathKeys.length) {
//     let key = pathKeys.shift();
// 		if (object && typeof object === "object") {
// 			return this.getFromPath(object[key], pathKeys);
// 		}
// 	} else {
// 		return object;
// 	}
// };
// /**
//  * KarmaFieldsAlpha.toPathArray({"a": {"b": 5, "c":6}}); // -> {"a/b": 5, "a/c": 6}
//  */
// KarmaFieldsAlpha.toFlatObject = function(deepObject, path) {
//   const flatObject = {};
//   if (deepObject && typeof deepObject === "object") {
//     for (let key in deepObject) {
//       Object.assign(flatObject, this.toFlatObject(deepObject[key], (path && path+"/" || "")+key));
//     }
//   } else {
//     flatObject[path] = deepObject;
//   }
//   return flatObject;
// }
// /**
//  * KarmaFieldsAlpha.toPathArray({"a/b": 5, "a/c": 6}); // -> {"a": {"b": 5, "c":6}}
//  */
// KarmaFieldsAlpha.toDeepObject = function(flatObject) {
// 	let deepObject;
// 	for (let path in flatObject) {
// 		if (!deepObject) {
// 			deepObject = {};
// 		}
// 		KarmaFieldsAlpha.assignFromPath(deepObject, path.split("/"), flatObject[path]);
// 	}
// 	return deepObject;
// }
//
// /**
//  * KarmaFieldsAlpha.sliceFlatObject({"a/b": 5, "a/c": 6, "d": 7}, "a/"); // -> {"b": 5, "c":6}
//  */
// KarmaFieldsAlpha.sliceFlatObject = function(flatObject, dirPath) {
// 	const subFlatObj = {};
// 	for (let path in flatObject) {
// 		if (path.startsWith(dirPath)) {
// 			const subpath = path.slice(dirPath.length);
// 			subFlatObj[subpath] = flatObject[path];
// 		}
// 	}
// 	return subFlatObj;
// }
//
// /**
//  * KarmaFieldsAlpha.countFlatObject({"a/b": 5, "a/c": 6, "d": 7}, "a/"); // -> 2
//  */
// KarmaFieldsAlpha.countFlatObject = function(flatObject, dirPath) {
// 	let num = 0;
// 	for (let path in flatObject) {
// 		if (path.startsWith(dirPath)) {
// 			num++;
// 		}
// 	}
// 	return num;
// }
//

// class KarmaFieldsAlpha.Object = {
//
// 	constructor() {
// 	}
//
// 	assignFromPath(pathKeys, value) {
// 	  let key = pathKeys.shift();
// 	  if (!this[key] || typeof this[key] !== "object") {
// 	    this[key] = {};
// 	  }
// 	  if (pathKeys.length > 0) {
// 			const child = new KarmaFieldsAlpha.Object(this[key]);
// 	    child.assignFromPath(pathKeys, value);
// 	  } else {
// 	    this[key] = value;
// 	  }
// 	}
//
// 	flatten(path) {
// 		const flatObject = {};
//
// 		for (let key in this) {
// 			const child = new KarmaFieldsAlpha.Object(this[key]);
// 			Object.assign(flatObject, child.flatten(path && path+"/"+key || key));
// 		}
//
//
// 	  if (this && typeof this === "object") {
//
// 	  } else {
// 	    flatObject[path] = this.item;
// 	  }
// 	  return flatObject;
// 	}
//
// 	toObject() {
// 		const deepObject = {};
// 		for (let path in this) {
// 			// KarmaFieldsAlpha.assignFromPath(deepObject, path.split("/"), flatObject[path]);
//
// 			const pathKeys = path.split("/");
// 			let key = pathKeys.shift();
//
// 			const flatObject = new KarmaFieldsAlpha.FlatObject();
// 			flatObject[pathKeys.join("/")];
//
// 			Object.assign(deepObject, flatObject.toObject());
//
//
//
//
//
// 		  if (!this.item[key] || typeof this.item[key] !== "object") {
// 		    this.item[key] = {};
// 		  }
// 		  if (keys.length > 0) {
// 				const child = new this.FlatObject(this.item[key])
// 		    child.assignFromPath(pathKeys, value);
// 		  } else {
// 		    this[key] = value;
// 		  }
//
// 		}
// 		return deepObject;
//
// 	}
//
// 	/**
// 	 * KarmaFieldsAlpha.toPathArray({"a/b": 5, "a/c": 6}); // -> {"a": {"b": 5, "c":6}}
// 	 */
// 	KarmaFieldsAlpha.toDeepObject = function(flatObject) {
// 		const deepObject = {};
// 		for (let path in flatObject) {
//
// 			KarmaFieldsAlpha.assignFromPath(deepObject, path.split("/"), flatObject[path]);
// 		}
// 		return deepObject;
// 	}
//
// 	// assignFromPath(pathKeys, value) {
// 	//   let key = pathKeys.shift();
// 	//   if (!this.item[key] || typeof this.item[key] !== "object") {
// 	//     this.item[key] = {};
// 	//   }
// 	//   if (keys.length > 0) {
// 	// 		const child = new this.FlatObject(this.item[key])
// 	//     child.assignFromPath(pathKeys, value);
// 	//   } else {
// 	//     this[key] = value;
// 	//   }
// 	// }
//
// }
//
// /**
//  * KarmaFieldsAlpha.getFromPath({"a": {"b": 5}}, ["a", "b"]); // -> 5
//  */
// KarmaFieldsAlpha.getFromPath = function(object, pathKeys) {
// 	if (pathKeys.length) {
//     let key = pathKeys.shift();
// 		if (object && typeof object === "object") {
// 			return this.getFromPath(object[key], pathKeys);
// 		}
// 	} else {
// 		return object;
// 	}
// };
