
KarmaFieldsAlpha.LocalStorage = class extends KarmaFieldsAlpha.Buffer {

	// getObject() {
	// 	const delta = localStorage.getItem(this.constructor.prefix);
	// 	return delta && JSON.parse(delta) || {};
	// }
	//
	// setObject(delta) {
	//
	// 	localStorage.setItem(this.constructor.prefix, JSON.stringify(delta));
	//
	// }

	getObject() {

		const object = localStorage.getItem(this.constructor.prefix);
		return KarmaFieldsAlpha.DeepObject.get(object && JSON.parse(object) || {}, ...this.path) || {};
	}

	setObject(delta) {

		const json = localStorage.getItem(this.constructor.prefix);
		const object = json && JSON.parse(json) || {};
		KarmaFieldsAlpha.DeepObject.assign(object, delta, ...this.path);
		localStorage.setItem(this.constructor.prefix, JSON.stringify(object));

	}

}

KarmaFieldsAlpha.LocalStorage.prefix = "karma";
