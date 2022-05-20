

KarmaFieldsAlpha.Nav = class {

	static getObject() {
		return new URLSearchParams(location.hash.slice(1))
	}

	static setObject(urlSearchParams, replace = false) {
		const hash = urlSearchParams.toString();

		if (replace) {
			history.replaceState({}, "", "#"+hash);
		} else {
			history.pushState({}, "", "#"+hash);
		}
	}

	static empty() {
		this.setObject(new URLSearchParams());
	}

	static get(key) {
		return this.getObject().get(key);
	}

	static has(key) {
		return this.getObject().has(key);
	}

	static set(value, key, replace = false) {
		const urlSearchParams = this.getObject();
		if (value) {
			urlSearchParams.set(key, value);
		} else {
			urlSearchParams.delete(key);
		}
		this.setObject(urlSearchParams, replace);
	}

	static remove(key, replace = false) {
		const urlSearchParams = this.getObject();
		urlSearchParams.delete(key);
		this.setObject(urlSearchParams, replace);
	}



	// used by undo/redo
	static merge(params, replace = false) {
		const urlSearchParams = this.getObject();
		for (let key in params) {
			if (params[key]) {
				urlSearchParams.set(key, params[key]);
			} else {
				urlSearchParams.delete(key);
			}
		}
		this.setObject(urlSearchParams, replace);
	}

}
