
KarmaFieldsAlpha.Delta = class {

	static getObject(...path) {

		if (!this.deltaCache) {

			const delta = localStorage.getItem(this.prefix);

			this.deltaCache = delta && JSON.parse(delta) || {};
		}

		return this.deltaCache;

	}

	static get(...path) {

		// if (!this.deltaCache) {
		//
		// 	const delta = localStorage.getItem(this.prefix);
		//
		// 	this.deltaCache = delta && JSON.parse(delta) || {};
		// }
		//
		// // return this.deltaCache;
		//
		// return KarmaFieldsAlpha.DeepObject.get3(this.deltaCache, ...path);


		return KarmaFieldsAlpha.DeepObject.get3(this.getObject(), ...path);

	}

	static setObject(delta) {
		
		delta = KarmaFieldsAlpha.DeepObject.filter(delta, (value, ...path) => value !== null && value !== undefined && value !== KarmaFieldsAlpha.Gateway.getOriginal(...path));

		if (delta) {

			localStorage.setItem(this.prefix, JSON.stringify(delta));

		} else {

			localStorage.removeItem(this.prefix);

		}


		// localStorage.setItem(this.prefix, JSON.stringify(delta));

		this.deltaCache = delta;
	}

	static set(value, ...path) {

		const delta = this.getObject();

		KarmaFieldsAlpha.DeepObject.assign3(delta, value, ...path);

		this.setObject(delta);

	}

	// static set(value, ...path) {
	//
	// 	const delta = this.get();
	//
	// 	KarmaFieldsAlpha.DeepObject.assign3(delta, value, ...path);
	//
	// 	delta = KarmaFieldsAlpha.DeepObject.filter(delta, value => value !== null && value !== undefined);
	//
	// 	if (delta) {
	//
	// 		localStorage.setItem(this.prefix, JSON.stringify(delta));
	//
	// 	} else {
	//
	// 		localStorage.removeItem(this.prefix);
	//
	// 	}
	//
	// 	this.deltaCache = delta;
	// }

	static remove(...path) {

		const delta = this.getObject();

		if (delta) {

			KarmaFieldsAlpha.DeepObject.remove(delta, ...path);

			this.setObject(delta);

			// localStorage.setItem(this.prefix, JSON.stringify(delta));
			//
			// this.deltaCache = delta;

		}

	}

	static merge(data) {

		// KarmaFieldsAlpha.DeepObject.forEach(data, (value, ...path) => {
		// 	if (value === null || value === KarmaFieldsAlpha.Gateway.getOriginal(...path)) {
		// 		this.remove(...path);
		// 	} else if (value !== undefined) {
		// 		this.set(value, ...path);
		// 	}
		// });
		//
		// this.clean();

		const delta = this.getObject();

		KarmaFieldsAlpha.DeepObject.merge(delta, data);

		this.setObject(delta);

	}

	// static clean() {
	//
	// 	let delta = this.get();
	//
	// 	delta = KarmaFieldsAlpha.DeepObject.filter(delta, value => value !== null && value !== undefined);
	//
	// 	if (delta) {
	//
	// 		localStorage.setItem(this.prefix, JSON.stringify(delta));
	//
	// 	} else {
	//
	// 		localStorage.removeItem(this.prefix);
	//
	// 	}
	//
	// 	this.deltaCache = delta;
	//
	// }

}

KarmaFieldsAlpha.Delta.prefix = "karma";
