
KarmaFieldsAlpha.LocalStorage = class extends KarmaFieldsAlpha.Buffer {

	getObject() {
		const delta = localStorage.getItem(this.constructor.prefix);
		return delta && JSON.parse(delta) || {};
	}

	setObject(delta) {

		localStorage.setItem(this.constructor.prefix, JSON.stringify(delta));

	}

}

KarmaFieldsAlpha.LocalStorage.prefix = "karma";
