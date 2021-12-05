
KarmaFieldsAlpha.SessionStorage = class extends KarmaFieldsAlpha.Delta {

	static getObject(...path) {
		const delta = sessionStorage.getItem(this.prefix);
		return delta && JSON.parse(delta) || {};
	}

	static setObject(delta) {
		if (delta) {
			sessionStorage.setItem(this.prefix, JSON.stringify(delta));
		} else {
			sessionStorage.removeItem(this.prefix);
		}
	}

}

KarmaFieldsAlpha.SessionStorage.prefix = "karma";
