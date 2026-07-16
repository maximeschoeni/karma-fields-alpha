KarmaFieldsAlpha.HTTP = class {

	static async get(queryString, params = "") {

		if (this.onDownload) {

			this.onDownload(true);

		}

		if (typeof params !== "string") {
			params = KarmaFieldsAlpha.Nav.toString(params);
		}

		if (params) {
			params = "?"+params;
		}

		const response = await fetch(KarmaFieldsAlpha.restURL + "karma-fields-alpha/v1/" + queryString + params, {
			cache: "no-store", // force-cache
			headers: {
				"Content-Type": "application/json",
				"X-WP-Nonce": KarmaFieldsAlpha.nonce //wpApiSettings.nonce
			},
		});

		let results;

		if (response.ok) {

			results = await response.json();

		}

		if (this.onDownload) {

			this.onDownload(false);

		}

		return results;

		// return fetch(KarmaFieldsAlpha.restURL+"karma-fields-alpha/v1/"+queryString+params, {
		// 	cache: "no-store", // force-cache
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		"X-WP-Nonce": KarmaFieldsAlpha.nonce //wpApiSettings.nonce
		// 	},
		// }).then(response => {
		// 	if (response.status < 400) {
		// 		return response.json();
		// 	}
		// }).catch(error => {
		// 	console.warn(error, KarmaFieldsAlpha.restURL+"karma-fields-alpha/v1/"+queryString+params);
		// });
	}

	static async post(queryString, payload) {

		if (this.onUpload) {

			this.onUpload(true);

		}

		const response = await fetch(KarmaFieldsAlpha.restURL + "karma-fields-alpha/v1/" + queryString, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				"X-WP-Nonce": KarmaFieldsAlpha.nonce //wpApiSettings.nonce
			},
			body: JSON.stringify(payload),
			mode: "same-origin"
		});

		let results;

		if (response.ok) {

			results = await response.json();

		}

		if (this.onUpload) {

			this.onUpload(false);

		}

		return results;


		// return fetch(KarmaFieldsAlpha.restURL+"karma-fields-alpha/v1/"+queryString, {
		// 	method: "post",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		"X-WP-Nonce": KarmaFieldsAlpha.nonce //wpApiSettings.nonce
		// 	},
		// 	body: JSON.stringify(payload),
		// 	// body: JSON.stringify({
		// 	// 	data: data || {},
		// 	// 	...params
		// 	// }),
		// 	mode: "same-origin"
		// }).then(function(response) {
		// 	return response.json();
		// });
	}

	// static getOptions(queryString) { // queryString = driver+"?"+queryString
	//
	// 	if (!this.optionPromises[queryString]) {
	// 		this.optionPromises[queryString] = this.get("fetch/"+queryString);
	// 	}
	//
	// 	return this.optionPromises[queryString];
	// }
	//
	// static clearOptions() {
	// 	this.optionPromises = {};
	// }

	static stream(file, params) {
	  let fileName = file.name.normalize();
	  const chunkSize = 1048576; // 1MB
		// const chunkSize = 65536; // 64KB
	  let chunkIndex = 0;
	  let chunkTotal = Math.ceil(file.size/chunkSize);
	  const fileReader = new FileReader();

	  return new Promise((resolve, reject) => {
	    const uploadNextPart = () => {
	      const start = chunkIndex*chunkSize;
	      const end = Math.min(start+chunkSize, file.size);
	      const filePart = file.slice(start, end);
	      fileReader.onload = function() {
	        const formData = new FormData();
	        formData.append("file", filePart);
	        formData.append("name", fileName);
	        formData.append("chunk", chunkIndex);
	        formData.append("chunks", chunkTotal);
					formData.append("chunkSize", chunkSize);
					if (params) {
						for (let key in params) {
							formData.append(key, params[key]);
						}
					}
	        return fetch(KarmaFieldsAlpha.restURL+"karma-fields-alpha/v1/upload", {
						headers: {
							// "Content-Type": "application/json",
							"X-WP-Nonce": KarmaFieldsAlpha.nonce //wpApiSettings.nonce
						},
	          method: "post",
	          body: formData,
	          mode: "same-origin"
	        }).then(response => response.json()).then(function(result) {
	          chunkIndex++;
	          if (chunkIndex < chunkTotal) {
	            uploadNextPart();
	          } else {
	            resolve(result);
	          }
	        });
	      }
	      fileReader.readAsBinaryString(filePart);
	    }
	    uploadNextPart();
	  });
	}

	static async upload(file, params) {

		if (this.onUpload) {

			this.onUpload(true);

		}

	  let fileName = file.name.normalize();

		const formData = new FormData();
		formData.append("file", file);
		formData.append("name", fileName);

		if (params) {
			for (let key in params) {
				formData.append(key, params[key]);
			}
		}

		const response = await fetch(KarmaFieldsAlpha.restMediaURL, {
			headers: {
				// "Content-Type": "application/json",
				"X-WP-Nonce": KarmaFieldsAlpha.nonce //wpApiSettings.nonce
			},
			method: "post",
			body: formData,
			mode: "same-origin"
		});

		let results;

		if (response.ok) {

			results = response.json();

		}

		if (this.onUpload) {

			this.onUpload(false);

		}

		return results;

	}

	// static upload(file, params) {


	//   let fileName = file.name.normalize();

	// 	const formData = new FormData();
	// 	formData.append("file", file);
	// 	formData.append("name", fileName);
	// 	if (params) {
	// 		for (let key in params) {
	// 			formData.append(key, params[key]);
	// 		}
	// 	}
	// 	return fetch(KarmaFieldsAlpha.restMediaURL, {
	// 		headers: {
	// 			// "Content-Type": "application/json",
	// 			"X-WP-Nonce": KarmaFieldsAlpha.nonce //wpApiSettings.nonce
	// 		},
	// 		method: "post",
	// 		body: formData,
	// 		mode: "same-origin"
	// 	}).then(response => response.json()).then(result => result.id);

	// }


}

KarmaFieldsAlpha.HTTP.onDownload = toggle => {
	document.body.classList.toggle("karma-field-loading", toggle);
}

KarmaFieldsAlpha.HTTP.onUpload = toggle => {
	document.body.classList.toggle("karma-field-loading", toggle);
}
