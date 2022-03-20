
KarmaFieldsAlpha.fields.gateway = class extends KarmaFieldsAlpha.fields.field {

	constructor(...args) {
		super(...args);


		for (let child of this.resource.children || []) {
			this.createChild(child);
		}

		// this.buffer = new KarmaFieldsAlpha.DeepObject();
		// this.backup = new KarmaFieldsAlpha.DeepObject();
		this.buffer = new KarmaFieldsAlpha.Buffer("gateway", this.resource.driver);

		this.valuePromises = {};
		this.optionPromises = {};

	}

	getGateway() {
		return this;
	}

	queryValue(...path) {
		if (!this.valuePromises) {
			this.valuePromises = {};
		}
		const key = path.join("/");

		if (!this.valuePromises[key]) {

			this.valuePromises[key] = KarmaFieldsAlpha.Gateway.get("get/"+this.resource.driver+"/"+key);

			// this.valuePromises[key] = KarmaFieldsAlpha.Gateway.getValue(this.resource.driver || this.resource.key, ...path);
		}

		return this.valuePromises[key];
	}


	async getRemoteValue(...path) {

		let value = this.buffer.get(...path);

		if (value === undefined) {

			let numPath = [];

			if (typeof path[path.length-1] === "number") {

				numPath = path.splice(-1, 1);

			}

			value = await this.queryValue(...path);

			// compat
			if (!Array.isArray(value)) {
				value = [value];
			}

			// debugger;

			this.buffer.set(value, ...path);

			value = KarmaFieldsAlpha.DeepObject.get(value, ...numPath);

			// this.backup.set(value, ...path);
		}



		return value;

		// let index;
		//
		// if (typeof path[path.length-1] === "number") {
		//
		// 	index = path.pop();
		//
		// }
		//
		// let value = this.buffer.get(...path);
		//
		// if (!value) {
		//
		// 	value = await this.queryValue(...path);
		//
		// 	// compat
		// 	if (!Array.isArray(value)) {
		// 		value = [value];
		// 	}
		//
		// 	this.buffer.set(value, ...path);
		//
		// 	// this.backup.set(value, ...path);
		// }
		//
		// if (index !== undefined) {
		//
		// 	return value[index];
		//
		// }
		//
		// return value;
	}

	// async fetchValue(expectedType, ...path) {
	// 	console.log("Deprecated");
	// 	return this.getRemoteValue(...path);
	//
  // }

	async get(...path) {

		if (path.length) {

			// const index = path.pop();
			//
			// if (typeof index === "number") {
			//
			// 	let value = await this.getRemoteValue(...path);
			//
			// 	return KarmaFieldsAlpha.DeepObject.get(value, ...path, index); // -> return value
			//
			// } else {
			//
			// 	let value = await this.getRemoteValue(...path, index);
			//
			// 	// return this.getRemoteValue(...path, index);
			//
			// 	return KarmaFieldsAlpha.DeepObject.get(value, ...path, index); // -> return array
			//
			// }



			return this.getRemoteValue(...path);

		} else {

			return this.buffer.get(); // -> return object

		}



		// switch (path.pop()) {
		//
		// 	case "value": {
		// 		const index = path.pop();
		// 		if (typeof index === "number") {
		// 			return this.getRemoteValue(...path)[index];
		// 		} else {
		// 			return this.getRemoteValue(...path, index);
		// 		}
		// 	}
		// 		// return this.getRemoteValue(...path);
		//
		// 	case "buffer":
		// 		return this.buffer.get(...path);
		//
		// }

  }

	async getState(...path) {

		// const action = path.pop();
		//
		// switch (action) {
		// 
		// 	case "buffer":
		// 		return this.buffer.get(...path);
		//
		// }
		//
		//

	}

	async set(value, ...path) {

		// console.error("gateway set", path, value);
		// return;

		// value = KarmaFieldsAlpha.DeepObject.create(value, ...path);


		this.buffer.merge(value, ...path);

		value = KarmaFieldsAlpha.DeepObject.create(value, ...path);


		// console.log("buffer set ", value[0], path, this.buffer.get());


		// const delta = KarmaFieldsAlpha.DeepObject.create(value, ...path);

		// await this.send(value);

		const driver = this.resource.driver || this.resource.key;

		if (!driver) {
			console.error("Resource driver not set");
		}

		// if (path.length) {
		// 	// value = KarmaFieldsAlpha.DeepObject.create({}, value, ...path);
		//
		// 	const delta = {};
		// 	KarmaFieldsAlpha.DeepObject.assign(delta, value, ...path);
		// 	value = delta;
		// }

		// await KarmaFieldsAlpha.Gateway.update(driver, delta);
		await KarmaFieldsAlpha.Gateway.post("update/"+driver, value);

  }


	// async setValue(deprec, value, ...path) {
	// 	console.log("Deprecated");
	// 	// const delta = new KarmaFieldsAlpha.DeepObject();
	// 	// delta.set(value, ...path);
	// 	//
	// 	// await this.save(delta.getObject());
	//
	//
	//
	//
	// 	await this.save(delta);
	//
	// }

	createValue(value, ...path) {
		console.log("Deprecated");
		this.buffer.set(value, ...path);

	}

	async save(delta) {
		console.log("Deprecated");
		const driver = this.resource.driver || this.resource.key;

		if (!driver) {
			console.error("Resource driver not set");
		}

		// await KarmaFieldsAlpha.Gateway.update(driver, delta);
		await KarmaFieldsAlpha.Gateway.post("update/"+driver, delta);



	}

	clear() {
		this.buffer.empty();
		this.valuePromises = {};
	}

	getValue(...path) {
		console.log("Deprecated");
		return this.buffer.get(...path);

	}

	// async send(value, ...path) {
	//
	// 	const driver = this.resource.driver || this.resource.key;
	//
	// 	if (!driver) {
	// 		console.error("Resource driver not set");
	// 	}
	//
	// 	if (path.length) {
	// 		// value = KarmaFieldsAlpha.DeepObject.create({}, value, ...path);
	//
	// 		const delta = {};
	// 		KarmaFieldsAlpha.DeepObject.assign(delta, value, ...path);
	// 		value = delta;
	// 	}
	//
	// 	// await KarmaFieldsAlpha.Gateway.update(driver, delta);
	// 	await KarmaFieldsAlpha.Gateway.post("update/"+driver, value);
	//
	// }




	// async saveField(...fields) {
	//
	// 	const driver = this.resource.driver || this.resource.key;
	//
	// 	if (!driver) {
	// 		console.error("Resource driver not set");
	// 	}
	//
	// 	let delta = {};
	//
	// 	for (let field of fields) {
	// 		const path = field.getPath();
	// 		// const value = await super.fetchValue(null, ...path);
	// 		const value = this.delta.get(...path);
	// 		KarmaFieldsAlpha.DeepObject.assign(delta, value, ...path);
	// 		// this.removeDeltaValue(...path);
	// 		this.delta.remove(...path);
	// 		this.buffer.set(value, ...path);
	// 	}
	//
	// 	if (KarmaFieldsAlpha.DeepObject.some(delta, () => true)) {
	//
	// 		await KarmaFieldsAlpha.Gateway.update(driver, delta);
	//
	// 	}
	//
	// }




	//
	// static get(queryString) {
	//
	// 	return fetch(KarmaFieldsAlpha.restURL+"/"+queryString, {
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
	//
	// static post(queryString, params) {
	// 	return fetch(KarmaFieldsAlpha.restURL+"/"+queryString, {
	// 		method: "post",
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			'X-WP-Nonce': KarmaFieldsAlpha.nonce //wpApiSettings.nonce
	// 		},
	// 		body: JSON.stringify({
	// 			data: params || {},
	// 		}),
	// 		mode: "same-origin"
	// 	}).then(function(response) {
	// 		return response.json();
	// 	});
	// }
	//
	// static getOptions(queryString) { // queryString = driver+"?"+queryString
	// 	if (!this.optionPromises[queryString]) {
	// 		this.optionPromises[queryString] = this.get("fetch/"+queryString);
	// 	}
	// 	return this.optionPromises[queryString];
	// }

	// static async getTable(driver, paramString) {
  //   const key = "query/"+driver+"?"+paramString;
  //   return this.get(key);
  // }

	// static async getCount(driver, paramString) {
  //   const key = "count/"+driver+"?"+paramString;
  //   return this.get(key);
  // }

	// static async getRelations(driver, ids) {
	// 	const key = "relations/"+driver+"?ids="+ids.join(",");
	// 	return this.get(key);
	// }

	// static async getValue(...path) {
	// 	const key = "get/"+path.join("/");
	// 	return this.get(key);
	// }


	// static async add(driver, params) {
	//
	// 	const results = await KarmaFieldsAlpha.Gateway.post("add/"+driver, params);
	//
	// 	let ids = [];
	//
	// 	if (Array.isArray(results)) {
	// 		ids = results.map(item => {
	// 			const id = (item.id || item).toString();
	// 			// this.setOriginal("1", driver, id, "trash");
	// 			return id;
	// 		});
	// 	} else if (results.id || results) {
	// 		let id = results.id || results;
	// 		// this.setOriginal("1", driver, id, "trash");
	// 		ids = [id];
	// 	}
	//
	// 	return ids;
	// }

	// static update(driver, params) {
	// 	return this.post("update/"+driver, params);
	// }



};
