KarmaFieldsAlpha.Gateway = class {

	static get(queryString, params = "") {

		if (typeof params !== "string") {
			params = KarmaFieldsAlpha.Nav.toString(params);
		}

		if (params) {
			params = "?"+params;
		}

		return fetch(KarmaFieldsAlpha.restURL+"/"+queryString+params, {
			cache: "default", // force-cache
			headers: {
				"Content-Type": "application/json",
				"X-WP-Nonce": KarmaFieldsAlpha.nonce //wpApiSettings.nonce
			},
		}).then(response => {
			return response.json();
		}).catch(error => {
			console.log(queryString);
			console.trace();
			console.error(error);

		});
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

		if (!this.optionPromises[queryString]) {
			this.optionPromises[queryString] = this.get("fetch/"+queryString);
		}

		return this.optionPromises[queryString];
	}

	static clearOptions() {
		this.optionPromises = {};
	}

}

KarmaFieldsAlpha.Gateway.optionPromises = {};
