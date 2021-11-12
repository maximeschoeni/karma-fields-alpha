
KarmaFieldsAlpha.Gateway = class {

	static get(queryString) {
		if (!this.cache[queryString]) {
			let file = KarmaFieldsAlpha.restURL+"/"+queryString;

			// try {
			//
			// 	this.cache[queryString] = await fetch(file, {
			// 		cache: "default", // force-cache
			// 		headers: {
			// 			'Content-Type': 'application/json',
			// 			'X-WP-Nonce': KarmaFieldsAlpha.nonce //wpApiSettings.nonce
			// 		},
			// 	}).then(response => response.json());
			//
			// } catch (error) {
			//
			// 	console.log(queryString);
			// 	console.error(error);
			//
			// }

			this.cache[queryString] = fetch(file, {
				cache: "default", // force-cache
				headers: {
					"Content-Type": "application/json",
					"X-WP-Nonce": KarmaFieldsAlpha.nonce //wpApiSettings.nonce
				},
			}).then(response => {
				return response.json();
			}).catch(error => {
				console.log(queryString);
				console.error(error);
			});
		}
		return this.cache[queryString];
	}

	static post(queryString, params) {
		return fetch(KarmaFieldsAlpha.restURL+"/"+queryString, {
			method: "post",
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': KarmaFieldsAlpha.nonce //wpApiSettings.nonce
			},
			body: JSON.stringify({
				data: params || {},
			}),
			mode: "same-origin"
		}).then(function(response) {
			return response.json();
		});
	}

	static getOptions(queryString) { // queryString = driver+"?"+queryString
		// let promise = KarmaFieldsAlpha.Cache.get("options", queryString);
		//
		// if (!promise) {
		// 	promise = this.get("fetch/"+queryString);
		// 	KarmaFieldsAlpha.Cache.update("options", queryString, promise);
		// }
		//
		// return promise;

		return this.get("fetch/"+queryString);
	}

	static async getTable(driver, queryString) {

		// let promise = KarmaFieldsAlpha.Cache.get("tables", driver+"?"+queryString);
		//
		// if (!promise) {
		// 	promise = this.get("query/"+driver+"?"+queryString);
		// 	KarmaFieldsAlpha.Cache.update("tables", driver+"?"+queryString, promise);
		// }
		//
		// const results = await promise;

		const results = await this.get("query/"+driver+"?"+queryString);

		const ids = (results.items || results || []).map((row, index) => {
			const id = row.id.toString();
			for (let key in row) {
				// const path = driver+"/"+id+"/"+key;

				let value = row[key];

				if (typeof value === "number") {
					value = value.toString();
				} else if (value && typeof value === "object") {
					value = JSON.stringify(value);
				}

				// -> value MUST be a string!
				if (typeof value !== "string") {
					value = "";
				}

				// this.setOriginal(value, path);



				this.setOriginal(value, driver, id, key);

			}
			return id;
		});

		KarmaFieldsAlpha.Gateway.queries[driver] = {
			ids: ids,
			count: Number(results.count) || 0
		};


		return {
			ids: ids,
			count: Number(results.count) || 0,
			rowName: "id"
		};

	}

	// static async getRelations(driver, queryString) {
	//
	// 	// var results = [
	// 	// 	{
	// 	// 		id: 3, // typeface_id
	// 	// 		font_id: 4,
	// 	// 	},
	// 	// 	{
	// 	// 		id: 3, // typeface_id
	// 	// 		font_id: 5
	// 	// 	},
	// 	// 	{
	// 	// 		id: 4, // typeface_id
	// 	// 		font_id: 6
	// 	// 	}
	// 	// ];
	//
	// 	const results = await this.get("relations/"+driver+"?"+queryString);
	//
	// 	const groups = (results.items || results || []).reduce((group, item) => {
	// 		if (!group[item.id]) {
	// 			group[item.id] = [];
	// 		}
	// 		for (let key in item) {
	// 			if (key !== "id") {
	// 				if (!group[item.id][key]) {
	// 					group[item.id][key] = [];
	// 				}
	// 				group[item.id][key].push(item[key]);
	// 			}
	// 		}
	// 		return group;
	// 	}, {});
	//
	// 	// groups = {
	// 	// 	3: {
	// 	// 		font_id: [4,5]
	// 	// 	},
	// 	// 	4: {
	// 	// 		font_id: [6]
	// 	// 	}
	// 	// }
	//
	// 	for (let id in groups) {
	// 		for (let key in groups[id]) {
	// 			this.setOriginal(JSON.stringify(groups[id][key]), driver, id, key);
	// 		}
	// 	}
	//
	// }

	static async addRelations(driver, relations) {

		// var relations = [
		// 	{
		// 		id: 3, // typeface_id
		// 		font_id: 4,
		// 	},
		// 	{
		// 		id: 3, // typeface_id
		// 		font_id: 5
		// 	},
		// 	{
		// 		id: 4, // typeface_id
		// 		font_id: 6
		// 	}
		// ];

		const groups = relations.reduce((group, item) => {
			if (!item.id) {
				console.error("Gateway::addRelations, item does not have id");
			}
			if (!group[item.id]) {
				group[item.id] = [];
			}
			for (let key in item) {
				if (key !== "id") {
					if (!group[item.id][key]) {
						group[item.id][key] = [];
					}
					group[item.id][key].push(item[key]);
				}
			}
			return group;
		}, {});

		// groups = {
		// 	3: {
		// 		font_id: [4,5]
		// 	},
		// 	4: {
		// 		font_id: [6]
		// 	}
		// }

		for (let id in groups) {
			for (let key in groups[id]) {
				this.setOriginal(JSON.stringify(groups[id][key]), driver, id, key);
				KarmaFieldsAlpha.Type.register("json", driver, id, key);
			}
		}

	}

	static async getArrayValue(driver, id, key) {

		if (KarmaFieldsAlpha.Gateway.queries[driver] && !KarmaFieldsAlpha.Gateway.queries[driver].relationsOk) {

			const ids = KarmaFieldsAlpha.Gateway.queries[driver].ids || [];

			if (ids.length) {

				const results = await this.get("relations/"+driver+"?ids="+ids.join(",")) || [];

				this.addRelations(driver, results);

				KarmaFieldsAlpha.Gateway.queries[driver].relationsOk = true;

				let value = this.getOriginal(driver, id, key);

				if (value === undefined) {

					this.setOriginal("[]", driver, id, key);
					value = [];

				} else {

					value = JSON.parse(value);

				}

				return value;
			}

		}

	}


	static async add(driver, params) {
		const results = await this.post("add/"+driver, params);
		let ids = [];
		if (Array.isArray(results)) {
			ids = results.map(item => {
				const id = (item.id || item).toString();
				this.setOriginal("1", driver, id, "trash");
				return id;
			});
		} else if (results.id || results) {
			let id = results.id || results;
			this.setOriginal("1", driver, id, "trash");
			ids = [id];
		}
		return ids;
	}

	static update(driver, params) {
		return this.post("update/"+driver, params);
	}

	// static async getValue(path, expectedType) {
	//
	// 	let value = await this.get("get/"+path);
	//
	// 	if (expectedType !== "array" && Array.isArray(value)) {
	// 		value = value[0];
	// 	}
	//
	// 	// console.log(path, value);
	//
	// 	// if (value !== undefined && value !== null) {
	// 	// 	const type = typeof value;
	// 	// 	if (type !== "string") {
	// 	// 		this.types[path] = "json";
	// 	// 		value = this.sanitizeValue(value, this.types[path]);
	// 	// 	}
	// 	// }
	//
	// 	value = KarmaFieldsAlpha.Type.sanitize(value, path);
	//
	// 	// console.log(path, value);
	//
	//
	// 	// value = this.sanitizeValue(value);
	//
	// 	this.setOriginal(value, path);
	//
	// 	return value;
	//
	//
	//
	// 	// let value = this.getOriginal(path);
	// 	//
	// 	// if (value === undefined) {
	// 	//
	// 	// 	value = await this.get("get/"+path) || [];
	// 	//
	// 	// 	if (expectedType !== "array" && Array.isArray(value)) {
	// 	// 		value = value[0];
	// 	// 	}
	// 	//
	// 	// 	value = this.sanitize(value, path);
	// 	//
	// 	// 	this.setOriginal(value || "", path);
	// 	//
	// 	// }
	// 	//
	// 	// return value;
	// }

	static async getValue(expectedType, ...path) {

		let value = await this.get("get/"+path.join("/"));

		if (expectedType !== "array" && Array.isArray(value)) {
			value = value[0];
		}

		if (value === undefined) {
			value = null;
		}

		value = KarmaFieldsAlpha.Type.sanitize(value, ...path);

		this.setOriginal(value, ...path);

		return value;
	}


	async getRemoteArray(...path) {
		return this.getRemoteValue("array", ...path);
	}

	// static getOriginal(path) {
	// 	return this.original[path];
	// }
	//
	// static removeOriginal(path) {
	// 	delete this.original[path];
	// }
	//
	// static setOriginal(value, path) {
	// 	this.original[path] = value;
	// }
	//
	// static hasValue(path) {
	// 	return this.original[path] !== undefined;
	// }

	static getOriginal(...path) {
		return KarmaFieldsAlpha.DeepObject.get3(this.original, ...path);
		// return this.original[path];
	}

	static removeOriginal(...path) {
		KarmaFieldsAlpha.DeepObject.remove(this.original, ...path);
		// delete this.original[path];
	}

	static setOriginal(value, ...path) {
		KarmaFieldsAlpha.DeepObject.assign3(this.original, value, ...path);
		// this.original[path] = value;
	}

	static hasValue(...path) {
		return KarmaFieldsAlpha.DeepObject.has(this.original, ...path);
		// return this.original[path] !== undefined;

	}

	static mergeOriginal(data, ...path) {
		KarmaFieldsAlpha.DeepObject.merge(this.getOriginal(...path), data);
	}


	// static forget(driver) {
	// 	KarmaFieldsAlpha.DeepObject.remove(this.original, driver);
	// 	for (let key in this.cache) {
	// 		if (key.startsWith("fetch/"+driver) || key.startsWith("query/"+driver)) {
	// 			this.cache[key] = undefined;
	// 		}
	// 	}
	// }

	static clearCache(startPath) {
		for (let key in this.cache) {
			if (!startPath || key.startsWith(startPath)) {
				this.cache[key] = undefined;
			}
		}
	}



}

KarmaFieldsAlpha.Gateway.original = {};
// KarmaFieldsAlpha.Gateway.types = {};
KarmaFieldsAlpha.Gateway.cache = {};
KarmaFieldsAlpha.Gateway.queries = {};
