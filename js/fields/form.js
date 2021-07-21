
KarmaFieldsAlpha.cache = {};
KarmaFieldsAlpha.forms = {};

KarmaFieldsAlpha.fields.form = class extends KarmaFieldsAlpha.fields.group {

	constructor(resource, parent, form) {
		super(resource, parent);

		this.useCache = resource.use_cache ?? true;
		this.useLocalStorage = resource.useLocalStorage ?? true;

		this.delta = {};
		this.original = {};


		this.historyIndex = 0;
		this.historyMax = 0;
		this.history = {};

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

	getRemoteTable(queryString, driver) {
		if (!driver) {
			driver = this.resource.driver || "nodriver";
		}
		const promise = this.getCache("tables", driver, queryString) ?? KarmaFieldsAlpha.Form.query(driver, queryString);
		this.updateCache("tables", driver, queryString, promise);
		return promise;

		// if (!KarmaFieldsAlpha.cache.tables) {
		// 	KarmaFieldsAlpha.cache.tables = {};
		// }
		// if (!KarmaFieldsAlpha.cache.tables[driver]) {
		// 	KarmaFieldsAlpha.cache.tables[driver] = {};
		// }
		// if (!KarmaFieldsAlpha.cache.tables[driver][queryString]) {
		// 	KarmaFieldsAlpha.cache.tables[driver][queryString] = KarmaFieldsAlpha.Form.query(driver, queryString);
		// }
		// return KarmaFieldsAlpha.cache.tables[driver][queryString];
	}

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

	getRemoteValue(keys, driver) {
		const path = keys.join("/");
		if (!driver) {
			driver = this.resource.driver || "nodriver";
		}

		const promise = this.getCache("values", driver, path) ?? KarmaFieldsAlpha.Form.get(driver, path);
		this.updateCache("values", driver, path, promise);
		return promise;

		// if (!KarmaFieldsAlpha.cache.values) {
		// 	KarmaFieldsAlpha.cache.values = {};
		// }
		// if (!KarmaFieldsAlpha.cache.values[driver]) {
		// 	KarmaFieldsAlpha.cache.values[driver] = {};
		// }
		// if (!KarmaFieldsAlpha.cache.values[driver][path]) {
		// 	KarmaFieldsAlpha.cache.values[driver][path] = KarmaFieldsAlpha.Form.get(driver, path);
		// }
		// return KarmaFieldsAlpha.cache.values[driver][path];
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

	getFormOriginal(keys) {
		const path = keys.join("/");
    return this.original[path];
  }

	removeFormOriginal(keys) {
		const path = keys.join("/");
    delete this.original[path];
  }

  setFormOriginal(value, keys) {
		const path = keys.join("/");
		this.original[path] = value;
  }

	getDeltaValue(keys) {
		const path = keys.join("/");
    // return this.delta[path] ?? localStorage.getItem(this.resource.driver+"/"+path);
		return localStorage.getItem(this.resource.driver+"/"+path) ?? undefined;
  }

	removeDeltaValue(keys) {
		const path = keys.join("/");
    // this.delta[path] = undefined;
		// this.useLocalStorage && localStorage.removeItem(this.resource.driver+"/"+path);
		localStorage.removeItem(this.resource.driver+"/"+path);
		this.writeHistory(path, undefined);
  }

  setDeltaValue(value, keys) {
		const path = keys.join("/");

		// if (this.original[path] !== value && value !== undefined) {
		// 	// this.delta[path] = value;
		// 	localStorage.setItem(this.resource.driver+"/"+path, value);
		// } else {
		// 	// this.delta[path] = undefined;
		// 	localStorage.removeItem(this.resource.driver+"/"+path);
		// }
		this.setLocalValue(path, value);

		// console.log(path, value, this.historyIndex);
		this.writeHistory(path, value);
  }

	setLocalValue(path, value) {
		if (this.original[path] !== value && value !== undefined) {
			localStorage.setItem(this.resource.driver+"/"+path, value);
		} else {
			localStorage.removeItem(this.resource.driver+"/"+path);
		}
	}


	getDeltaPathes() {
		const pathes = [];
		for (let i = 0; i < localStorage.length; i++) {
			let path = localStorage.key(i);
			if (path.startsWith(this.resource.driver+"/")) {
				pathes.push(path);
			}
  	}
		return pathes;
  }


	// getModifiedValue() {
	// 	return this.delta;
	// }

	async save() {
		const values = await this.getModifiedValue();

		// for (let path in this.delta) {
		// 	this.useLocalStorage && localStorage.removeItem(this.resource.driver+"/"+path);
		// }
		this.getDeltaPathes().forEach(path => {
			localStorage.removeItem(path);
		});

		// this.delta = {};

		if (values) {
			const results = await KarmaFieldsAlpha.Form.update(this.resource.driver, values);
			Object.assign(values, results);
			this.initValue(values, true);
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
		return this.getDeltaPathes().reduce((object, path) => {
			const value = localStorage.getItem(path);
			this.setObjectValue(path.split("/"), value, object);
			return object;
		}, {})[this.resource.driver];
		// const value = {};
		// for (let path in this.delta) {
		// 	if (this.delta[path] !== undefined && this.delta[path] !== this.original[path]) {
		// 		this.setObjectValue(path.split("/"), this.delta[path], value);
		// 	}
		// }
		// return value;
	}

	setObjectValue(keys, value, object) {
		let key = keys.shift();
		if (!object[key] || !typeof object[key] === "object") {
			object[key] = {};
		}
		if (keys.length > 0) {
			this.setObjectValue(keys, value, object[key]);
		} else {
			object[key] = value;
		}
	}


	// clear() {
	// 	KarmaFieldsAlpha.cache = {};
	// 	this.original = {};
	// }


	getState() {
    return this.state || "";
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
				this.setLocalValue(path, value);

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
					this.setLocalValue(path, this.history[this.historyIndex][path]);
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
