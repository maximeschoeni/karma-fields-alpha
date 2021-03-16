KarmaFields.Form = {
	cache: {},

	fetch: function(driver, handle, params) {
		let file = KarmaFields.restURL+"/fetch/"+driver+"/"+handle;
		if (params) {
			const listParams = [];
			for (var key in params) {
				if (params[key]) {
					listParams.push(encodeURI(key) + "=" + encodeURIComponent(params[key]));
				}
			}
			if (listParams.length) {
				file += "?"+listParams.join("&");
			}
		}
		if (this.cache[file] === undefined) {
			this.cache[file] = fetch(file, {
				cache: "default", // force-cache
				headers: {
		      'Content-Type': 'application/json',
		      'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
		    },
			}).then(function(response) {
				return response.json();
			});
		}
		return this.cache[file];
	},

	get: function(driver, path) {
		// let file;
		// if (cache && KarmaFields.cacheURL) {
		// 	file = KarmaFields.cacheURL+"/"+driver+"/"+path+"/"+cache;
		// } else {
		// 	file = KarmaFields.restURL+"/get/"+driver+"/"+path;
		// }
		let file = KarmaFields.restURL+"/get/"+driver+"/"+path;
		if (this.cache[file] === undefined) {
			this.cache[file] = fetch(file, {
				cache: "reload",
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
				},
			}).then(function(response) {
				return response.json();
				// if (!cache || cache.slice(-5) === ".json") {
				// 	return response.json();
				// } else {
				// 	return response.text();
				// }
			});
		}
		return this.cache[file];
	},

	update: function(driver, values) {
		return fetch(KarmaFields.restURL+"/update/"+driver, {
			method: "post",
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
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
		return fetch(KarmaFields.restURL+"/add/"+driver, {
			method: "post",
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
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


//
// KarmaFields.Form = function(resource, parent) {
// 	let form = KarmaFields.Field(resource, parent);
// 	form.cache = {};
//
// 	// form.update = function() {
// 	//
// 	// 	let value = this.getModifiedValue();
// 	// 	// return KarmaFields.Transfer.update(field.resource.driver || field.resource.key, {data: value}).then(function(results) {
// 	// 	// 	body.setValue(value, "set");
// 	// 	// 	// return field.events.queryTable();
// 	// 	// });
// 	//
// 	//
// 	// 	let file = KarmaFields.restURL+"/update/"+this.resource.key;
// 	//
// 	// 	// var params = this.clean(params);
// 	// 	return fetch(file, {
// 	// 		method: "post",
// 	// 		headers: {
// 	// 			'Content-Type': 'application/json',
// 	// 			'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
// 	// 		},
// 	// 		body: JSON.stringify({
// 	// 			data: value || {},
// 	// 		}),
// 	// 		mode: "same-origin"
// 	// 	}).then(function(response) {
// 	// 		return response.json();
// 	// 	}).then(function(results) {
// 	// 		form.setValue(value, "set");
// 	// 	});
// 	// };
// 	//
// 	// form.add = function(params) {
// 	//
// 	// 	// return KarmaFields.Transfer.add(form.resource.key, {
// 	// 	// 	data: params || {},
// 	// 	// }).then(function(value) {
// 	// 	// 	// field.data.createRow(value);
// 	// 	// 	// const ids = footer.get("ids");
// 	// 	// 	// ids.setValue([value.id].concat(ids.value.split(",")).join(","), "set");
// 	// 	// 	return value;
// 	// 	// });
// 	//
// 	// 	let file = KarmaFields.restURL+"/add/"+this.resource.key;
// 	//
// 	// 	return fetch(file, {
// 	// 		method: "post",
// 	// 		headers: {
// 	// 			'Content-Type': 'application/json',
// 	// 			'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
// 	// 		},
// 	// 		body: JSON.stringify({
// 	// 			data: params || {},
// 	// 		}),
// 	// 		mode: "same-origin"
// 	// 	}).then(function(response) {
// 	// 		return response.json();
// 	// 	});
// 	//
// 	//
// 	// };
// 	//
// 	//
// 	// form.get = function(field) {
// 	//
// 	// 	let path = field.getPath(this);
// 	// 	// currentField.data.loading = true;
// 	// 	// currentField.trigger("update");
// 	//
// 	// 	// return KarmaFields.Transfer.get(this.resource.key, path, this.resource.cache).then(function(value) {
// 	// 	// 	currentField.data.loading = false;
// 	// 	// 	currentField.setValue(value, "set");
// 	// 	// 	return value;
// 	// 	// });
// 	//
// 	//
// 	// 	let file;
// 	// 	if (cache && KarmaFields.cacheURL) {
// 	// 		file = KarmaFields.cacheURL+"/"+this.resource.key+"/"+path+"/"+cache;
// 	// 	} else {
// 	// 		file = KarmaFields.restURL+"/get/"+this.resource.key+"/"+path;
// 	// 	}
// 	//
// 	// 	return fetch(file, {
// 	// 		cache: "reload",
// 	// 		headers: {
// 	// 			'Content-Type': 'application/json',
// 	// 			'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
// 	// 		},
// 	// 	}).then(function(response) {
// 	// 		if (!cache || cache.slice(-5) === ".json") {
// 	// 			return response.json();
// 	// 		} else {
// 	// 			return response.text();
// 	// 		}
// 	// 	});
// 	//
// 	//
// 	// };
// 	//
// 	// // field.events.fetch = function(handle, params) {
// 	// // 	return KarmaFields.Transfer.fetch(field.resource.key || field.resource.driver, handle, {filters: header.get("filters").getValue(), ...params}).then(function(results) {
// 	// // 		return results;
// 	// // 	});
// 	// // };
// 	//
// 	// form.fetch = function(handle, params) {
// 	//
// 	//
// 	// 	// return KarmaFields.Transfer.fetch(field.resource.key || field.resource.driver, handle, {filters: header.get("filters").getValue(), ...params}).then(function(results) {
// 	// 	// 	return results;
// 	// 	// });
// 	// 	//
// 	// 	// let file = this.addQueryArgs(KarmaFields.restURL+"/fetch/"+driver+"/"+request, params);
// 	//
// 	// 	let file = KarmaFields.restURL+"/fetch/"+this.resource.key+"/"+handle;
// 	//
// 	// 	if (params) {
// 	// 		const listParams = [];
// 	// 		for (var key in object) {
// 	// 			listParams.push(encodeURI(key) + "=" + encodeURIComponent(object[key]));
// 	// 		}
// 	// 		if (listParams.length) {
// 	// 			file += "?"+listParams.join("&");
// 	// 		}
// 	// 	}
// 	//
// 	// 	if (!this.cache[file]) {
// 	// 		this.cache[file] = fetch(file, {
// 	// 			cache: "default", // force-cache
// 	// 			headers: {
// 	// 	      'Content-Type': 'application/json',
// 	// 	      'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
// 	// 	    },
// 	// 		}).then(function(response) {
// 	// 			return response.json();
// 	// 		});
// 	// 	}
// 	//
// 	// 	return this.cache[file];
// 	//
// 	//
// 	//
// 	//
// 	//
// 	// };
//
//
// 	form.events.fetch = function(handle, params) {
// 		let file = KarmaFields.restURL+"/fetch/"+this.resource.key+"/"+handle;
// 		if (params) {
// 			const listParams = [];
// 			for (var key in object) {
// 				listParams.push(encodeURI(key) + "=" + encodeURIComponent(object[key]));
// 			}
// 			if (listParams.length) {
// 				file += "?"+listParams.join("&");
// 			}
// 		}
// 		if (this.cache[file] !== undefined) {
// 			this.cache[file] = fetch(file, {
// 				cache: "default", // force-cache
// 				headers: {
// 		      'Content-Type': 'application/json',
// 		      'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
// 		    },
// 			}).then(function(response) {
// 				return response.json();
// 			});
// 		}
// 		return this.cache[file];
// 	}
//
// 	form.events.get = function(field) {
// 		let path = field.getPath(this);
// 		let file;
// 		if (cache && KarmaFields.cacheURL) {
// 			file = KarmaFields.cacheURL+"/"+this.resource.key+"/"+path+"/"+cache;
// 		} else {
// 			file = KarmaFields.restURL+"/get/"+this.resource.key+"/"+path;
// 		}
// 		if (this.cache[file] !== undefined) {
// 			this.cache[file] = fetch(file, {
// 				cache: "reload",
// 				headers: {
// 					'Content-Type': 'application/json',
// 					'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
// 				},
// 			}).then(function(response) {
// 				if (!cache || cache.slice(-5) === ".json") {
// 					return response.json();
// 				} else {
// 					return response.text();
// 				}
// 			});
// 		}
// 		return this.cache[file];
// 	}
//
// 	form.events.save = function() {
// 		return fetch(KarmaFields.restURL+"/update/"+this.resource.key, {
// 			method: "post",
// 			headers: {
// 				'Content-Type': 'application/json',
// 				'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
// 			},
// 			body: JSON.stringify({
// 				data: this.getModifiedValue() || {},
// 			}),
// 			mode: "same-origin"
// 		}).then(function(response) {
// 			return response.json();
// 		}).then(function(results) {
// 			form.setValue(value, "set");
// 		});
// 	}
//
// 	form.events.add = function(params) {
// 		return fetch(KarmaFields.restURL+"/add/"+this.resource.key, {
// 			method: "post",
// 			headers: {
// 				'Content-Type': 'application/json',
// 				'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
// 			},
// 			body: JSON.stringify({
// 				data: params || {},
// 			}),
// 			mode: "same-origin"
// 		}).then(function(response) {
// 			return response.json();
// 		});
// 	}
//
//
//
// 	return form;
// }
