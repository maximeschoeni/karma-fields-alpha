
KarmaFieldsAlpha.Gateway = class {

	static get(queryString) {
		// if (!this.cache[queryString]) {
		// 	let file = KarmaFieldsAlpha.restURL+"/"+queryString;
		//
		// 	// try {
		// 	//
		// 	// 	this.cache[queryString] = await fetch(file, {
		// 	// 		cache: "default", // force-cache
		// 	// 		headers: {
		// 	// 			'Content-Type': 'application/json',
		// 	// 			'X-WP-Nonce': KarmaFieldsAlpha.nonce //wpApiSettings.nonce
		// 	// 		},
		// 	// 	}).then(response => response.json());
		// 	//
		// 	// } catch (error) {
		// 	//
		// 	// 	console.log(queryString);
		// 	// 	console.error(error);
		// 	//
		// 	// }
		//
		// 	this.cache[queryString] = fetch(file, {
		// 		cache: "default", // force-cache
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 			"X-WP-Nonce": KarmaFieldsAlpha.nonce //wpApiSettings.nonce
		// 		},
		// 	}).then(response => {
		// 		return response.json();
		// 	}).catch(error => {
		// 		console.log(queryString);
		// 		console.error(error);
		// 	});
		// }
		// return this.cache[queryString];

		return fetch(KarmaFieldsAlpha.restURL+"/"+queryString, {
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

		if (!this.cache[queryString]) {
			this.cache[queryString] = this.get("fetch/"+queryString);
		}

		return this.cache[queryString];
	}

	// static async getTable(driver, queryString) {
	//
	// 	const results = await this.get("query/"+driver+"?"+queryString);
	//
	// 	const ids = (results.items || results || []).map((row, index) => {
	// 		const id = row.id.toString();
	//
	// 		this.setOriginal(row, driver, id);
	// 		this.setOriginal("0", driver, id, "trash");
	//
	// 		return id;
	// 	});
	//
	// 	KarmaFieldsAlpha.Gateway.queries[driver] = {
	// 		ids: ids,
	// 		count: Number(results.count) || 0
	// 	};
	//
	//
	// 	return {
	// 		ids: ids,
	// 		count: Number(results.count) || 0,
	// 		rowName: "id"
	// 	};
	//
	// }


	// static async getTable2(driver, queryString) {
	//
	// 	const key = "query/"+driver+"?"+queryString;
	//
	// 	if (!this.cache2[key]) {
	// 		this.cache2[key] = this.get("query/"+driver+"?"+queryString).then(results => {
	// 			// const ids = (results.items || results || []).map(row => {
	// 			// 	const id = row.id.toString();
	// 			// 	this.setOriginal(row, driver, id);
	// 			// 	return id;
	// 			// });
	// 			(results.items || results || []).forEach(row => {
	// 				this.setOriginal(row, driver, row.id.toString());
	// 			});
	// 			return results;
	// 		});
	// 	}
	//
	// 	return this.cache2[key];
	// }
	//
	// static async getTable3(driver, queryString) {
	//
	// 	const results = await this.get("query/"+driver+"?"+queryString);
	//
	// 	(results.items || results || []).forEach(row => {
	// 		this.setOriginal(row, driver, row.id.toString());
	// 	});
	//
	// 	return results;
	//
	// }

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

	// static async addRelations(driver, relations) {
	//
	// 	// var relations = [
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
	// 	const groups = relations.reduce((group, item) => {
	// 		if (!item.id) {
	// 			console.error("Gateway::addRelations, item does not have id");
	// 		}
	// 		if (!group[item.id]) {
	// 			group[item.id] = {};
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
	// 			// this.setOriginal(JSON.stringify(groups[id][key]), driver, id, key);
	// 			// KarmaFieldsAlpha.Type.register("json", driver, id, key);
	// 			this.setOriginal(groups[id][key], driver, id.toString(), key);
	// 		}
	// 	}
	//
	//
	//
	// }
	//
	// static async getArrayValue(driver, ...path) {
	//
	// 	if (KarmaFieldsAlpha.Gateway.queries[driver] && !KarmaFieldsAlpha.Gateway.queries[driver].relationsOk) {
	//
	// 		KarmaFieldsAlpha.Gateway.queries[driver].relationsOk = true;
	//
	// 		const ids = KarmaFieldsAlpha.Gateway.queries[driver].ids || [];
	//
	// 		if (ids.length) {
	//
	// 			const results = await this.get("relations/"+driver+"?ids="+ids.join(",")) || [];
	//
	// 			this.addRelations(driver, results);
	//
	// 			let value = this.getOriginal(driver, ...path);
	//
	// 			// if (value === undefined) {
	// 			//
	// 			// 	this.setOriginal("[]", driver, id, key);
	// 			// 	value = [];
	// 			//
	// 			// } else {
	// 			//
	// 			// 	value = JSON.parse(value);
	// 			//
	// 			// }
	//
	// 			return value;
	// 		}
	//
	// 	}
	//
	// }

	// // no care expectedType
	// static async getRelations(driver, ids) {
	//
	//
	//
	// 	const key = "relations/"+driver+"?ids="+ids.join(",");
	//
	// 	if (!this.cache2[key]) {
	//
	// 		this.cache2[key] = this.get(key).then(relations => {
	// 			this.addRelations(driver, relations)
	// 		});
	//
	// 	}
	//
	// 	return this.cache2[key];
	// }

	// no care expectedType
	// static async getRelations(driver, ids) {
	//
	// 	const key = "relations/"+driver+"?ids="+ids.join(",");
	//
	// 	const relation = await this.get(key);
	//
	// 	this.addRelations(driver, relations);
	// }

	// static async updateRelations(driver, ...path) {
	//
	// 	if (KarmaFieldsAlpha.Gateway.queries[driver] && !KarmaFieldsAlpha.Gateway.queries[driver].relationsOk) {
	//
	// 		KarmaFieldsAlpha.Gateway.queries[driver].relationsOk = true;
	//
	// 		const ids = KarmaFieldsAlpha.Gateway.queries[driver].ids || [];
	//
	// 		if (ids.length) {
	//
	// 			const results = await this.get("relations/"+driver+"?ids="+ids.join(",")) || [];
	//
	// 			this.addRelations(driver, results);
	//
	// 		}
	//
	// 	}
	//
	// }

	// static async fetch(driver, ...path) {
	// 	let value = this.getOriginal(driver, ...path);
	//
	// 	if (value === undefined) {
	//
	//
	// 	}
	//
	// 	if (this.queries[driver] && !this.queries[driver].relationsOk) {
	// 		this.updateRelations(driver, ...path);
	// 	}
	//
	// 	value = this.getOriginal(driver, ...path);
	//
	// 	if (value === undefined) {
	// 		value = await this.getValue2(driver, ...path);
	// 	}
	//
	// 	return this.getOriginal(driver, ...path)
	// }

	static async getTable(driver, paramString) {
    const key = "query/"+driver+"?"+paramString;
    return this.get(key);
  }

	static async getRelations(driver, ids, ...keys) {
		const key = "relations/"+driver+"?ids="+ids.join(",")+"&keys="+keys.join(",");
		return this.get(key);
	}

	static async getValue(...path) {
		const key = "get/"+path.join("/");
		//
		//
		// console.log(path);
		// console.trace();
		return this.get(key);
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

	// static async getValue(expectedType, ...path) {
	//
	// 	let value = await this.get("get/"+path.join("/"));
	//
	// 	// if (expectedType !== "array" && Array.isArray(value)) {
	// 	// 	value = value[0];
	// 	// }
	//
	// 	if (value === undefined) {
	// 		value = null;
	// 	}
	//
	// 	// value = KarmaFieldsAlpha.Type.sanitize(value, ...path);
	//
	// 	this.setOriginal(value, ...path);
	//
	// 	return value;
	// }


	// // no care expectedType
	// static async getValue2(...path) {
	//
	// 	const key = "get/"+path.join("/");
	//
	// 	if (!this.cache2[key]) {
	//
	// 		this.cache2[key] = this.get(key).then(value => {
	// 			this.setOriginal(value, ...path);
	// 			return value;
	// 		});
	//
	// 	}
	//
	// 	return this.cache2[key];
	// }

	// no care expectedType
	// static async getValue3(...path) {
	//
	// 	const value = await this.get("get/"+path.join("/"));
	//
	// 	this.setOriginal(value, ...path);
	//
	// 	return value;
	//
	// }


	async getRemoteArray(...path) {
		console.error("deprecated");
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
		// return KarmaFieldsAlpha.DeepObject.get(this.original, ...path);
		let value = KarmaFieldsAlpha.DeepObject.get(this.original, ...path);
		if (Array.isArray(value)) {
			value = KarmaFieldsAlpha.DeepObject.cloneArray(value);
		}
		return value;
	}

	static removeOriginal(...path) {
		KarmaFieldsAlpha.DeepObject.remove(this.original, ...path);
		// delete this.original[path];
	}

	static setOriginal(value, ...path) {
		KarmaFieldsAlpha.DeepObject.assign(this.original, value, ...path);
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
			if (!startPath || typeof startPath === "string" && key.startsWith(startPath) || typeof startPath === "object" && key.match(startPath)) {
				delete this.cache[key];
			}
		}
	}




}

KarmaFieldsAlpha.Gateway.original = {};
// KarmaFieldsAlpha.Gateway.types = {};
KarmaFieldsAlpha.Gateway.cache = {};
KarmaFieldsAlpha.Gateway.queries = {};
