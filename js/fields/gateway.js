
KarmaFieldsAlpha.fields.gateway = class extends KarmaFieldsAlpha.fields.field {

	constructor(...args) {
		super(...args);

		this.joins = [];

		for (let child of this.resource.children || []) {
			this.createChild(child);
		}

		// this.buffer = new KarmaFieldsAlpha.DeepObject();
		// this.backup = new KarmaFieldsAlpha.DeepObject();


		const [driverName] = this.resource.driver.split("?");

		this.buffer = new KarmaFieldsAlpha.Buffer("gateway", driverName);

		// this.valuePromises = {};
		// this.optionPromises = {};

	}

	getGateway() {
		return this;
	}

	// queryValue(...path) {
	// 	if (!this.valuePromises) {
	// 		this.valuePromises = {};
	// 	}
	// 	const key = path.join("/");
	//
	// 	if (!this.valuePromises[key]) {
	//
	// 		this.valuePromises[key] = KarmaFieldsAlpha.Gateway.get("get/"+this.resource.driver+"/"+key);
	//
	// 		// this.valuePromises[key] = KarmaFieldsAlpha.Gateway.getValue(this.resource.driver || this.resource.key, ...path);
	// 	}
	//
	// 	return this.valuePromises[key];
	// }


	// async getRemoteValue(...path) {
	//
	// 	let value = this.buffer.get(...path);
	//
	// 	if (value === undefined) {
	//
	// 		let numPath = [];
	//
	// 		if (typeof path[path.length-1] === "number") {
	//
	// 			numPath = path.splice(-1, 1);
	//
	// 		}
	//
	// 		value = await this.queryValue(...path);
	//
	// 		// compat
	// 		if (!Array.isArray(value)) {
	// 			value = [value];
	// 		}
	//
	// 		// debugger;
	//
	// 		this.buffer.set(value, ...path);
	//
	// 		value = KarmaFieldsAlpha.DeepObject.get(value, ...numPath);
	//
	// 		// this.backup.set(value, ...path);
	// 	}
	//
	//
	//
	// 	return value;
	//
	// }

	async getRemoteValue(allowSingle, ...path) {

		let value = this.buffer.get(...path);

		if (!value) {

			await this.join();

			value = this.buffer.get(...path);

		}

		if (allowSingle && !value) {

			value = await KarmaFieldsAlpha.Driver.get(this.resource.driver, ...path);

		}

		return value;
	}

	registerJoin(driver, promise) {

// console.trace();

		this.joins.push({
			promise: promise,
			driver: driver
		});

  }

	// registerJoin(drivers, ...path) {
	//
	// 	console.log(drivers);
	// 	console.trace();
	//
	// 	for (let driver of drivers) {
	// 		registerJoin(driver, this.getRemoteValue(...path))
	// 	}
	//
	//
	//
  // }

	// unregisterJoins(driver) {
	// 	this.joins = this.joins.filter(join => join.driver !== driver);
  // }
	//
	async resolveJoin(joins) {

		const drivers = joins.reduce((set, join) => new Set([...set, join.driver]), new Set());

		for (let driver of drivers) {



			const promises = joins.filter(join => join.driver === driver).map(join => join.promise);
			const arrays = await Promise.all(promises);
			const ids = arrays.reduce((set, ids) => new Set([...set, ...ids]), new Set());

			// await KarmaFieldsAlpha.Driver.join(this.resource.driver, driver, [...ids]);

			const [driverName, search] = driver.split("?");
			const params = new URLSearchParams(search);
			params.set("ids", Array.from(ids).join(","));
			// params.set("from", this.resource.driver);

			await KarmaFieldsAlpha.Driver.join(this.resource.driver, driverName+"?"+decodeURIComponent(params.toString()));



		}

	}

	async join() {

		// console.trace();

		if (this.joins.length) {

			this.joinPromise = this.resolveJoin(this.joins);
			this.joins = [];

		}

		await this.joinPromise;

		this.joinPromise = null;

		// console.log("join");
		//
		// this.joinPromise = Promise.resolve(this.joinPromise).then(() => {
		//
		// 	if (this.joins.length) {
		//
		// 		const promise = this.resolveJoin(this.joins);
		//
		// 		console.log("reset joins");
		// 		this.joins = [];
		// 		return promise;
		// 	}
		// }).then(() => {
		// 	console.log("reset promise");
		// 	// this.joinPromise = null;
		// });
		//
		// return this.joinPromise;

	}


	// async join(driver) {
	//
	// 	const joins = this.joins.filter(join => join.driver === driver);
	//
	// 	if (joins.length) {
	//
	// 		// -> unregister joins
	// 		this.joins = this.joins.filter(join => join.driver !== driver);
	//
	// 		if (!this.joinPromise) {
	//
	// 			// -> join.promise result in an array of ids + flatten array + unique values
	// 			const promises = joins.map(join => join.promise);
	// 			const arrays = await Promise.all(promises);
	// 			const ids = arrays.reduce((set, ids) => new Set([...set, ...ids]), new Set());
	//
	// 			if (ids.size) {
	//
	// 				this.joinPromise = KarmaFieldsAlpha.Driver.join(this.resource.driver, driver, [...ids]).then(() => {
	// 					this.joinPromise = null;
	// 				});
	//
	// 			}
	//
	//
	// 		}
	//
	// 	}
	//
	// 	await this.joinPromise;
	//
	// }

	// async performJoin() {
	//
	// 	const joins = Object.entries(this.joins);
	//
	// 	this.joins = {};
	//
	// 	while (joins.length) {
	// 		let [driver, promises] = joins.shift();
	// 		const arrays = await Promise.all(promises);
	// 		const ids = arrays.reduce((set, ids) => new Set([...set, ...ids]), new Set()); // -> flatten array + unique values
	// 		if (ids.size) {
	// 			KarmaFieldsAlpha.Driver.join(this.resource.driver, driver, Array.from(ids));
	// 		}
	// 	}
	//
  // }


	// async join() {
	//
	// 	const joins = Object.entries(this.joins);
	//
	// 	this.joins = {};
	//
	// 	while (joins.length) {
	// 		let [driver, promises] = joins.shift();
	// 		const arrays = await Promise.all(promises);
	// 		const ids = arrays.reduce((set, ids) => new Set([...set, ...ids]), new Set()); // -> flatten array + unique values
	// 		if (ids.size) {
	// 			const relations = await KarmaFieldsAlpha.Gateway.get("relations/"+driver+"?ids="+[...ids].join(","));
	//
	// 	    for (let relation of relations) {
	// 	      const id = relation.id.toString();
	// 	      if (id) {
	// 	        for (let key in relation) {
	// 	          if (key !== "id") {
	// 	            // KarmaFieldsAlpha.DeepObject.sanitize(relation[key]); // -> compat
	//
	// 	            let values = this.buffer.get(id, key) || [];
	// 	            this.buffer.set([...values, relation[key]], id, key);
	// 	          }
	// 	        }
	// 	      }
	// 	    }
	// 		}
	// 	}
	//
  // }

	// async getValue() {
	//
	//
	// }


	async dispatch(event) {

		switch (event.action) {

			case "ids": {
				const [id] = event.path;
				event.data = [id];
				break;
			}

			case "driver": {
				event.data = this.resource.driver;
				break;
			}

			case "join": { // deprecated
				const path = event.absolutePath || event.path;
				const idsPromise = this.getRemoteValue(false, ...path);
				event.data.forEach(driver => this.registerJoin(driver, idsPromise)); // -> event.data is an array of drivers

				// this.registerJoin(event.data, ...(event.absolutePath || event.path)); // -> event.data is an array of drivers
				break;
			}

			case "get": {
				// const path = event.absolutePath || event.path;
				// let promise = this.getRemoteValue(event.allowSingle !== false, ...path);
				//
				// if (event.join) {
				// 	event.join.forEach(driver => this.registerJoin(driver, promise)); // -> event.join is an array of drivers
				// }
				// event.data = await promise;
				//
				// const id = event.id || event.path[0];
				// const path = event.key || event.path

				// event.joins = [{driver: "driverName", on: "fieldName"}]

				const [id, ...path] = event.absolutePath || event.path;
				// const paramString = "id="+id;
				// event.driver = this.resource.driver;
				// event.data = await KarmaFieldsAlpha.Driver.get(this.resource.driver, paramString, this.resource.joins, id, ...path);

				const [driver, ...params] = this.resource.driver.split("?");
				const paramString = this.resource.driver+"?"+[...params, "id="+id].join("&");
				const query = KarmaFieldsAlpha.Query.create(paramString, this.resource.joins);
				event.driver = driver;
				event.data = await query.get(id, ...path);



				break;
			}

			case "set":
				await this.send(event.getArray(), ...event.path);
				break;

			case "send":
				await this.send(event.getValue(), ...event.path);
				break;



			case "query": {
				// if (event.absolutePathes) {
				// 	event.data = {};
				// 	for (let path of event.absolutePathes) {
				// 		const value = await this.getRemoteValue(event.allowSingle !== false, ...path);
				// 		KarmaFieldsAlpha.DeepObject.assign(event.data, value, ...path);
				// 	}
				// } else if (event.absolutePath) {
				// 	event.data = await this.getRemoteValue(event.allowSingle !== false, ...event.absolutePath);
				// }

				const [id, ...path] = event.absolutePath;
				const paramString = "id="+id;
				event.driver = this.resource.driver;
				event.data = await KarmaFieldsAlpha.Driver.get(this.resource.driver, paramString, event.joins, id, ...path);



				// if (event.keys) {
				// 	event.value = {};
				// 	for (let key of event.keys) {
				// 		event.value[key] = await this.getRemoteValue(...event.queryPath, key);
				// 	}
				//
				// 	// const values = await Promise.all(event.keys.map(key => {
				// 	// 	return this.getRemoteValue(...event.queryPath, key)
				// 	// }));
				// 	// event.value = values.reduce((object, item, index) => {
				// 	// 	return {...object, [event.keys[index]]: item};
				// 	// }, {});
				// 	// console.log(event.value);
				// } else {
				// 	const value = await this.getRemoteValue(...event.queryPath);
				// 	event.setValue(value);
				// }


				break;
			}

			case "getDriver":
        event.data = this.resource.driver;
        break;

			// case "join":
			// 	await KarmaFieldsAlpha.Relations.request(event.driver, ...event.path);
			// 	event.setValue();

			default:
				await super.dispatch(event);

		}

		return event;
	}


	// async getValue(...path) {
	//
	// 	if (path.length) {
	//
	// 		return this.getRemoteValue(...path);
	//
	// 	} else {
	//
	// 		return this.buffer.get(); // -> return object
	//
	// 	}
	//
  // }


	async send(value, ...path) {

		// this.buffer.merge(value, ...path); // ! -> May have type conflicts

		// KarmaFieldsAlpha.DeepObject.forEach(value, (item, ...subpath) => {
		//
		// 	console.log(item,...path, ...subpath);
		// 	this.buffer.remove(...path, ...subpath);
		// });

		if (path.length) {
			this.buffer.set(value, ...path);
		} else {
			this.buffer.merge(value, ...path);
		}



		// this.clear();

		value = KarmaFieldsAlpha.DeepObject.create(value, ...path);

		if (!this.resource.driver) {
			console.error("Resource driver not set");
		}

		const [driverName] = this.resource.driver.split("?");

		await KarmaFieldsAlpha.Gateway.post("update/"+driverName, value);

  }

	clear() {
		this.buffer.empty();
		this.valuePromises = {};
	}



};
