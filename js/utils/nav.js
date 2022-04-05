

KarmaFieldsAlpha.Nav = class {

	static backup() {
		history.pushState({}, null, location.hash);

		// clear history id
		KarmaFieldsAlpha.History.id = null;
	}

	static init() {
		this.params = new URLSearchParams(location.hash.slice(1));
	}

	static update() {
		history.replaceState(history.state, null, "#"+this.params.toString());
	}

	static empty() {
		this.params = new URLSearchParams();
		this.update();
	}

	static getParam(key) {
		return this.params.get(key);
	}

	static hasParam(key) {
		return this.params.has(key);
	}

	static setParam(key, value) {
		this.params.set(key, value);
		this.update();
	}

	static removeParam(key) {
		this.params.delete(key);
		this.update();
	}

	static setParams(params) {
		for (let key in params) {
			this.params.set(key, params[key]);
		}
		this.update();
	}

	static setHash(hash) {
		if (hash[0] === "#") {
			hash = hash.slice(1);
		}
		this.params = new URLSearchParams(hash);
		this.update();
	}

	static mergeParamString(paramString) {
		(new URLSearchParams(paramString)).entries().forEach(pair => this.params.set(...pair));

		this.update();
	}

}

window.addEventListener("popstate", event => {
	KarmaFieldsAlpha.Nav.init();
	KarmaFieldsAlpha.Nav.onpopstate && KarmaFieldsAlpha.Nav.onpopstate();
});

KarmaFieldsAlpha.Nav.init();



// KarmaFieldsAlpha.Nav = class {
//
// 	static backup() {
// 		const paramString = location.hash.slice(1);
//
// 		history.pushState({
// 			//karmaIndex: this.index
// 		}, null, "#"+paramString);
//
// 		// clear history id
// 		KarmaFieldsAlpha.History.id = null;
// 	}
//
// 	static getParam(key) {
// 		return this.getParamsObject().get(key);
// 	}
//
// 	static hasParam(key) {
// 		return this.getParamsObject().has(key);
// 	}
//
// 	static setParam(key, value) {
// 		const params = this.getParamsObject();
//
// 		if (value && params.get(key) !== value || !value && params.has(key)) {
//
// 			if (value) {
// 				params.set(key, value);
// 			} else {
// 				params.delete(key);
// 			}
//
// 			params.sort();
//
// 			this.setParamsObject(params);
// 		}
//
// 	}
//
// 	static removeParam(key) {
// 		const params = this.getParamsObject();
//
// 		if (params.has(key)) {
// 			params.delete(key);
// 			this.setParamsObject(params);
// 		}
// 	}
//
// 	static setParams(params) {
// 		const paramsObject = this.getParamsObject();
//
// 		let paramString = paramsObject.toString();
//
// 		for (let key in params) {
//
// 			const value = params[key];
//
// 			if (value) {
// 				paramsObject.set(key, value);
// 			} else {
// 				paramsObject.delete(key);
// 			}
//
// 		}
//
// 		paramsObject.sort();
//
// 		if (paramsObject.toString() !== paramString) {
// 			this.setParamsObject(paramsObject);
// 		}
// 	}
//
// 	static mergeParamString(paramString) {
// 		(new URLSearchParams(paramString)).entries().forEach(pair => {
// 			this.setParam(pair[0], pair[1]);
// 		});
// 	}
//
// 	static getParamsObject() {
// 		return new URLSearchParams(this.getParamString());
// 	}
//
// 	static setParamsObject(params) {
// 		return this.setParamString(params.toString());
// 	}
//
// 	static getParamString() {
// 		return location.hash.slice(1);
// 	}
//
// 	static setParamString(paramString) {
// 		const state = history.state || {};
//
//
// 		history.replaceState(state, null, "#"+paramString);
// 	}
//
//
//
//
// }
