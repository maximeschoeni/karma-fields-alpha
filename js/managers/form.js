KarmaFieldsAlpha.Form = {
	cache: {},

	encodeParams: function(params, separator) {
		if (params) {
			const array = [];
			for (var key in params) {
				if (params[key]) {
					array.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
				}
			}
			if (array.length) {
				array.sort();
				return (separator ?? "?")+array.join("&");
			}
		}
		return "";
	},

	fetch: function(driver, handle, params) {
		// if (typeof handle === "string") {
		// 	console.error("DEPRECATED handle param, Form.fetch()");
		// }


		let file = KarmaFieldsAlpha.restURL+"/fetch/"+driver+"/"+handle+this.encodeParams(params);
		// if (params) {
		// 	const listParams = [];
		// 	for (var key in params) {
		// 		if (params[key]) {
		// 			listParams.push(encodeURI(key) + "=" + encodeURI(params[key]));
		// 		}
		// 	}
		// 	if (listParams.length) {
		// 		file += "?"+listParams.join("&");
		// 	}
		// }


		if (this.cache[file] === undefined) {
			this.cache[file] = fetch(file, {
				cache: "default", // force-cache
				headers: {
		      'Content-Type': 'application/json',
		      'X-WP-Nonce': KarmaFieldsAlpha.nonce //wpApiSettings.nonce
		    },
			}).then(function(response) {
				return response.json();
			});
		}
		return this.cache[file];
	},
	fetch2: function(driver, queryString) {
		// let file = KarmaFieldsAlpha.restURL+"/fetch/"+driver+queryString;
		//
		// if (this.cache[file] === undefined) {
		// 	this.cache[file] = fetch(file, {
		// 		cache: "default", // force-cache
		// 		headers: {
		//       'Content-Type': 'application/json',
		//       'X-WP-Nonce': KarmaFieldsAlpha.nonce //wpApiSettings.nonce
		//     },
		// 	}).then(function(response) {
		// 		return response.json();
		// 	});
		// }
		// return this.cache[file];

		let file = KarmaFieldsAlpha.restURL+"/fetch/"+driver+queryString;

		// if (this.cache[file] === undefined) {
			// this.cache[file] =
		return fetch(file, {
			cache: "default", // force-cache
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': KarmaFieldsAlpha.nonce //wpApiSettings.nonce
			},
		}).then(function(response) {
			return response.json();
		});
		// }
		// return this.cache[file];
	},

	query: function(driver, params) {
		if (typeof params !== "string") {
			params = this.encodeParams(params);
		}
		if (!params.startsWith("?")) {
			params = "?"+params;
		}
		let file = KarmaFieldsAlpha.restURL+"/query/"+driver+params;

		if (this.cache[file] === undefined) {
			this.cache[file] = fetch(file, {
				cache: "default", // force-cache
				headers: {
		      'Content-Type': 'application/json',
		      'X-WP-Nonce': KarmaFieldsAlpha.nonce //wpApiSettings.nonce
		    },
			}).then(function(response) {

				return response.json();
			});

			// const cache = caches.open(driver).then(cache => {
			// 	cache.add(file);
			// });


		}
		return this.cache[file];
	},

	get: function(...path) {

		let file = KarmaFieldsAlpha.restURL+"/get/"+path.join("/");
		return fetch(file, {
			cache: "reload",
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': KarmaFieldsAlpha.nonce //wpApiSettings.nonce
			},
		}).then(function(response) {
			return response.json();
		}).catch(function(error) {
			console.log(error);
		});
	},

	update: function(driver, values) {
		return fetch(KarmaFieldsAlpha.restURL+"/update/"+driver, {
			method: "post",
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': KarmaFieldsAlpha.nonce //wpApiSettings.nonce
			},
			body: JSON.stringify({
				data: values || {},
			}),
			mode: "same-origin"
		}).then(function(response) {
			return response.json();
		});
	},

	add: function(driver, params) {
		return fetch(KarmaFieldsAlpha.restURL+"/add/"+driver, {
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




};
