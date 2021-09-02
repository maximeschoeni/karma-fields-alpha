
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
					'Content-Type': 'application/json',
					'X-WP-Nonce': KarmaFieldsAlpha.nonce //wpApiSettings.nonce
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
				const path = driver+"/"+id+"/"+key;

				let value = row[key];

				if (typeof value !== "string" && value !== null) {
					value = value.toString();
				}


				// value = KarmaFieldsAlpha.Type.sanitize(value, path); // !! type is not necessarily defined yet !!

				// if (value !== null) {
				// 	// value = value.toString();
				// 	const type = typeof value;
				// 	if (type !== "string") {
				// 		this.types[path] = "json";
				// 		value = this.sanitizeValue(value, this.types[path]);
				// 	}
				// }


				this.setOriginal(value, path);

			}
			return id;
		});


		return {
			ids: ids,
			count: Number(results.count) || 0,
			rowName: "id"
		};

	}

	static async add(driver, params) {
		const results = await this.post("add/"+driver, params);
		let ids = [];
		if (Array.isArray(results)) {
			ids = results.map(item => {
				const id = (item.id || item).toString();
				this.setOriginal("1", driver+"/"+id+"/trash");
				return id;
			});
		} else if (results.id || results) {
			let id = results.id || results;
			this.setOriginal("1", driver+"/"+id+"/trash");
			ids = [id];
		}
		return ids;
	}

	static update(driver, params) {
		return this.post("update/"+driver, params);
	}

	static async getValue(path, expectedType) {

		let value = await this.get("get/"+path);

		if (expectedType !== "array" && Array.isArray(value)) {
			value = value[0];
		}

		// console.log(path, value);

		// if (value !== undefined && value !== null) {
		// 	const type = typeof value;
		// 	if (type !== "string") {
		// 		this.types[path] = "json";
		// 		value = this.sanitizeValue(value, this.types[path]);
		// 	}
		// }

		value = KarmaFieldsAlpha.Type.sanitize(value, path);

		// console.log(path, value);


		// value = this.sanitizeValue(value);

		this.setOriginal(value, path);

		return value;



		// let value = this.getOriginal(path);
		//
		// if (value === undefined) {
		//
		// 	value = await this.get("get/"+path) || [];
		//
		// 	if (expectedType !== "array" && Array.isArray(value)) {
		// 		value = value[0];
		// 	}
		//
		// 	value = this.sanitize(value, path);
		//
		// 	this.setOriginal(value || "", path);
		//
		// }
		//
		// return value;
	}


	// static sanitizeValue(value) {
	// 	if (typeof value !== "string") {
	// 		value = value && JSON.stringify(value);
	// 	}
	// 	return value;
	// }
	//
	// static parseValue(value) {
	// 	if (type === "json") {
	// 		return JSON.parse(value);
	// 	} else if (type === "number") {
	// 		return Number(value);
	// 	}
	// 	return value;
	// }
	//
	// static sanitize(value, path) {
	// 	// if (typeof value === "number") {
	// 	// 	value = value.toString();
	// 	// } else if (value && typeof value !== "string") {
	// 	// 	value = JSON.stringify(value);
	// 	// 	this.types[path] = "json";
	// 	// }
	// 	// return value;
	//
	//
	// 	if (value !== null && value !== undefined) {
	// 		// value = value.toString();
	// 		const type = typeof value;
	// 		if (type !== "string") {
	// 			this.types[path] = "json";
	// 			value = this.sanitizeValue(value, this.types[path]);
	// 		}
	// 	}
	// 	return value;
	// }
	//
	// static parse(value, path) {
	// 	// if (this.types[path] === "json") {
	// 	// 	value = value && JSON.parse(value) || null;
	// 	// }
	// 	if (value !== null && value !== undefined && this.types[path]) {
	// 		// value = value.toString();
	// 		value = this.parseValue(value, this.types[path]);
	// 	}
	// 	return value;
	// }
	//
	// static sanitizeObject(flatObject) {
	// 	const obj = {};
	// 	for (let path in flatObject) {
	// 		obj[path] = this.sanitize(flatObject[path], this.types[path]);
	// 		// obj[path] = flatObject[path];
	// 		// if (this.types[path] && obj[path] !== null && obj[path] !== undefined) {
	// 		// 	obj[path] = this.sanitizeValue(obj[path], this.types[path]);
	// 		// }
	// 	}
	// 	return obj;
	// }
	//
	// static parseObject(flatObject) {
	// 	const obj = {};
	// 	for (let path in flatObject) {
	// 		obj[path] = this.parse(flatObject[path], this.types[path]);
	// 		// obj[path] = flatObject[path];
	// 		// if (this.types[path] && obj[path] !== null && obj[path] !== undefined) {
	// 		// 	obj[path] = this.parseValue(obj[path], this.types[path]);
	// 		// }
	// 	}
	// 	return obj;
	// }

	async getRemoteArray(path) {
		return this.getRemoteValue(path, "array");
	}

	static getOriginal(path) {
		return this.original[path];
	}

	static removeOriginal(path) {
		delete this.original[path];
	}

	static setOriginal(value, path) {
		this.original[path] = value;
	}

	static hasValue(path) {
		return this.original[path] !== undefined;
	}


}

KarmaFieldsAlpha.Gateway.original = {};
// KarmaFieldsAlpha.Gateway.types = {};
KarmaFieldsAlpha.Gateway.cache = {};
