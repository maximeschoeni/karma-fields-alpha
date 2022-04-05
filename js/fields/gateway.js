
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

	async getRemoteValue(...path) {

		let value = this.buffer.get(...path);

		if (!value) {

			value = await this.queryValue(...path);

			if (!Array.isArray(value)) {
				value = [value];
			}

			this.buffer.set(value, ...path);

		}

		return value;
	}

	async dispatch(event) {

		switch (event.action) {

			case "get": {
				const value = await this.getRemoteValue(...event.path);
				event.setValue(value);
				break;
			}

			case "set":
				await this.send(event.getArray(), ...event.path);
				break;

			case "send":
				await this.send(event.getValue(), ...event.path);
				break;

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


		const driver = this.resource.driver || this.resource.key;

		if (!driver) {
			console.error("Resource driver not set");
		}

		await KarmaFieldsAlpha.Gateway.post("update/"+driver, value);

  }

	clear() {
		this.buffer.empty();
		this.valuePromises = {};
	}



};
