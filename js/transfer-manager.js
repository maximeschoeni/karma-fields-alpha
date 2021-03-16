KarmaFields.Transfer = {}
KarmaFields.Transfer.cache = {};
KarmaFields.Transfer.createQuery = function(path, params) {
	var file = path.join("/");
	return this.addQueryArgs(file, params);
}
KarmaFields.Transfer.addQueryArgs = function(file, params) {
	if (params) {
		var serial = this.serialize(params);
		if (serial) {
			file += "?"+serial;
		}
	}
	return file;
}
KarmaFields.Transfer.serialize = function(object) {
	var params = [];
	object = this.flaten(object);
	for (var key in object) {
		if (object[key]) {
			params.push(encodeURI(key) + "=" + encodeURIComponent(object[key]));
		}
	}
	return params.join("&");
}
KarmaFields.Transfer.flaten = function(object, parentKey, results) {
	results = results || {};
	for (var key in object) {
		if (object[key]) {
			var path = key;
			if (parentKey) {
				path = parentKey+"/"+key;
			}
			if (typeof object[key] === "object") {
				this.flaten(object[key], path, results);
			} else {
				results[path] = object[key];
			}
		}
	}
	return results;
}
// KarmaFields.Transfer.clean = function(object) {
// 	var params = {};
// 	for (var key in object) {
// 		if (object[key]) {
// 			params[key] = object[key];
// 		}
// 	}
// 	return params;
// }
// KarmaFields.Transfer.query = function(driver, params) {
// 	// var file = KarmaFields.restURL+"/query/"+driver;
// 	// var serial = this.serialize(params);
// 	// if (serial) {
// 	// 	file += "?"+serial;
// 	// }
//
// 	var file = this.createQuery([KarmaFields.restURL, "query", driver], params);
//
// 	// var file = KarmaFields.restURL+"/query/"+driver+"?p="+JSON.stringify(params);
// 	// console.log(file);
// 	return fetch(file, {
// 		cache: "default", // force-cache
// 		headers: {
//       'Content-Type': 'application/json',
//       'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
//     },
// 	}).then(function(response) {
// 		return response.json();
// 	});
// };
KarmaFields.Transfer.update = function(driver, params) {
	var file = KarmaFields.restURL+"/update/"+driver;

	// var params = this.clean(params);
	return fetch(file, {
		method: "post",
		headers: {
			'Content-Type': 'application/json',
			'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
		},
		body: JSON.stringify(params),
		mode: "same-origin"
	}).then(function(response) {
		return response.json();
	});
};
KarmaFields.Transfer.add = function(driver, params) {
	var file = KarmaFields.restURL+"/add/"+driver
	return fetch(file, {
		method: "post",
		headers: {
			'Content-Type': 'application/json',
			'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
		},
		body: JSON.stringify(params),
		mode: "same-origin"
	}).then(function(response) {
		return response.json();
	});
};
KarmaFields.Transfer.get = function(driver, path, cache) {
	var file;
	if (cache && KarmaFields.cacheURL) {
		file = [KarmaFields.cacheURL, driver, path, cache].join("/");
	} else {
		file = [KarmaFields.restURL, "get", driver, path].join("/");
	}
	return fetch(file, {
		cache: "reload",
		headers: {
			'Content-Type': 'application/json',
			'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
		},
	}).then(function(response) {
		if (!cache || cache.slice(-5) === ".json") {
			return response.json();
		} else {
			return response.text();
		}
	});

	// if (!this.cache[file]) {
	// 	this.cache[file] = fetch(file, {
	// 		cache: "reload"
	// 	}).then(function(response) {
	// 		if (!cache || cache.slice(-5) === ".json") {
	// 			return response.json();
	// 		} else {
	// 			return response.text();
	// 		}
	// 	});
	// 	return this.cache[file];
	// }
};
KarmaFields.Transfer.fetch = function(driver, request, params) {
	let file = this.addQueryArgs(KarmaFields.restURL+"/fetch/"+driver+"/"+request, params);

	// cache unactivated !!
	// this.cache[file] = null;

	if (!this.cache[file]) {
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
};

KarmaFields.Transfer.queryJson = function(url) {
	return KarmaFields.assets[url] = fetch(url, {
		cache: "no-store" // force-cache
	}).then(function(response) {
		return response.json();
	});
}
// KarmaFields.Transfer.autoSave = function(driver, params) {
// 	var file = KarmaFields.restURL+"/autosave/"+driver;
//
// 	// console.log(params.output);
// 	// var params = this.clean(params);
// 	return fetch(file, {
// 		method: "post",
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
// 		},
// 		body: JSON.stringify(params),
// 		mode: "same-origin"
// 	}).then(function(response) {
// 		return response.json();
// 	});
// };
//
// KarmaFields.Transfer.autoSave2 = function(driver, params) {
// 	var file = KarmaFields.restURL+"/autosave2/"+driver;
//
// 	// console.log(params.output);
// 	// var params = this.clean(params);
// 	return fetch(file, {
// 		method: "post",
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'X-WP-Nonce': KarmaFields.nonce //wpApiSettings.nonce
// 		},
// 		body: JSON.stringify(params),
// 		mode: "same-origin"
// 	}).then(function(response) {
// 		return response.json();
// 	});
// };
