KarmaFieldsAlpha.HTTP = class {

	static get(queryString, params = "") {

		if (typeof params !== "string") {
			params = KarmaFieldsAlpha.Nav.toString(params);
		}

		if (params) {
			params = "?"+params;
		}

		return fetch(KarmaFieldsAlpha.restURL+"karma-fields-alpha/v1/"+queryString+params, {
			cache: "no-store", // force-cache
			headers: {
				"Content-Type": "application/json",
				"X-WP-Nonce": KarmaFieldsAlpha.nonce //wpApiSettings.nonce
			},
		}).then(response => {
			return response.json();
		}).catch(error => {
			// console.log(queryString);
			console.warn(error, KarmaFieldsAlpha.restURL+"karma-fields-alpha/v1/"+queryString+params);
		});
	}

	static post(queryString, data, params) {
		return fetch(KarmaFieldsAlpha.restURL+"karma-fields-alpha/v1/"+queryString, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
				"X-WP-Nonce": KarmaFieldsAlpha.nonce //wpApiSettings.nonce
			},
			body: JSON.stringify({
				data: data || {},
				...params
			}),
			mode: "same-origin"
		}).then(function(response) {
			return response.json();
		});
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


	static upload(file, params) {
	  let fileName = file.name.normalize();

		const formData = new FormData();
		formData.append("file", file);
		formData.append("name", fileName);
		if (params) {
			for (let key in params) {
				formData.append(key, params[key]);
			}
		}
		return fetch(KarmaFieldsAlpha.restMediaURL, {
			headers: {
				// "Content-Type": "application/json",
				"X-WP-Nonce": KarmaFieldsAlpha.nonce //wpApiSettings.nonce
			},
			method: "post",
			body: formData,
			mode: "same-origin"
		}).then(response => response.json()).then(result => result.id);

	}





	// async query(driver, paramstring) {
	//
  //   const results = await KarmaFieldsAlpha.Gateway.get(`query/${driver}${paramstring ? `?${paramstring}` : ""}`);
	//
  //   const idAlias = KarmaFieldsAlpha.Store.getAlias(driver, "id");
	//
  //   for (let item of results) {
	//
  //     const id = item[idAlias].toString();
	//
  //     if (idAlias !== "id") {
	//
  //       item.id = id;
	//
  //     }
	//
  //     for (let key in item) {
	//
  //       const value = KarmaFieldsAlpha.Type.toArray(item[key]);
	//
  //       KarmaFieldsAlpha.Store.set(value, "vars", driver, id, key);
	//
  //     }
	//
  //     KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, "query");
	//
  //     KarmaFieldsAlpha.Store.set(["0"], "vars", driver, id, "trash");
	//
  //   }
	//
  //   KarmaFieldsAlpha.Store.setStore(results, "queries", driver, paramstring);
	//
  //   return results;
  // }
	//
	// static async queryIds(driver, ids) {
	//
  //   if (ids.length) {
	//
  //     for (let id of ids) {
	//
  //       KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, "query");
  //       KarmaFieldsAlpha.Store.set(["1"], "vars", driver, id, "trash");
	//
  //     }
	//
  //     const paramstring = `ids=${ids.join(",")}`;
	//
  //     const results = await KarmaFieldsAlpha.Gateway.get(`query/${driver}?${paramstring}`);
	//
  //     const idAlias = KarmaFieldsAlpha.Store.getAlias(driver, "id") || "id";
	//
  //     for (let item of results) {
	//
  //       const id = item[idAlias].toString();
	//
  //       for (let key in item) {
	//
  //         const value = new KarmaFieldsAlpha.Content(item[key]).toArray();
	//
  //         KarmaFieldsAlpha.Store.set(value, "vars", driver, id, key);
	//
  //       }
	//
  //       KarmaFieldsAlpha.Store.set(["0"], "vars", driver, id, "trash");
	//
  //     }
	//
  //     KarmaFieldsAlpha.Store.set(results, "queries", driver, paramstring);
	//
  //   }
	//
	// 	return results;
  // }
	//
	// static async queryRelations(driver, ids, name) {
	//
  //   if (ids.length) {
	//
  //     const relations = await KarmaFieldsAlpha.Gateway.get(`relations/${driver}/${name}?ids=${ids.join(",")}`);
	//
  //     for (let relation of relations) {
	//
  //       const id = relation.id.toString();
  //       const key = relation.key.toString();
	//
  //       let value = KarmaFieldsAlpha.Store.get("vars", driver, id, key);
	//
  //       if (!value) {
	//
  //         value = [];
	//
  //         KarmaFieldsAlpha.Store.set(value, "vars", driver, id, key);
  //       }
	//
  //       value.push(relation.value);
	//
  //     }
	//
  //     for (let id of ids) {
	//
  //       KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, name);
	//
  //     }
	//
  //   }
	//
  // }
	//
	// static async count(driver, paramstring) {
	//
  //   let count = await KarmaFieldsAlpha.Gateway.get(`count/${driver}${paramstring ? `?${paramstring}` : ""}`);
	//
  //   count = parseInt(count);
	//
  //   KarmaFieldsAlpha.Store.set(count, "vars", driver, paramstring);
	//
  // }
	//
	// static async sync() {
	//
  //   const delta = KarmaFieldsAlpha.Store.get("state", "delta");
	//
  //   if (delta) {
	//
  //     for (let driver in delta) {
	//
  //       for (let id in delta[driver]) {
	//
  //         const data = Object.fromEntries(Object.entries(delta[driver][id]).map(([key, value]) => [KarmaFieldsAlpha.Store.getAlias(driver, key), value]));
	//
  //         KarmaFieldsAlpha.Store.remove("vars", driver, id);
	//
  //         await KarmaFieldsAlpha.Gateway.post(`update/${driver}/${id}`, data);
	//
  //         for (let key in data) {
	//
  //           KarmaFieldsAlpha.Store.set(data[key], "vars", driver, id, key);
	//
  //         }
	//
  //       }
	//
  //       KarmaFieldsAlpha.Store.remove("queries", driver);
  //       KarmaFieldsAlpha.Store.remove("counts", driver);
	//
  //     }
	//
  //   }
	//
  // }
	//
	// static async insert(driver, params, index, ...path) {
	//
  //   let id = await KarmaFieldsAlpha.Gateway.post(`add/${driver}`, params).then(id => id.toString());
	//
  //   // -> save must happen before new (loading) items are first set
	//
  //   const items = KarmaFieldsAlpha.Store.getCurrentLayer("items") || [];
	//
  //   const newItems = KarmaFieldsAlpha.DeepArray.clone(currentItems);
  //   KarmaFieldsAlpha.DeepArray.set(newItems, {id: id}, index, ...path);
	//
  //   KarmaFieldsAlpha.Store.setCurrentLayer(newItems, "items");
	//
  //   for (let key in params) {
	//
  //     const value = KarmaFieldsAlpha.Type.toArray(params[key]);
  //     KarmaFieldsAlpha.Store.updateState(value, "delta", driver, id, key);
	//
  //   }
	//
  //   KarmaFieldsAlpha.Store.set(["1"], "vars", driver, id, "trash");
  //   KarmaFieldsAlpha.Store.updateState([], "delta", driver, id, "trash");
	//
  // }
	//
	// static async upload(file, index) {
	//
  //   let id;
	//
  //   if (KarmaFieldsAlpha.useWPMediaUploader) {
	//
  //     id = await KarmaFieldsAlpha.Gateway.upload(file, params); // -> parent is not going to be saved!
	//
  //   } else {
	//
  //     id = await KarmaFieldsAlpha.Gateway.stream(file, params);
	//
  //   }
	//
  //   const currentItems = KarmaFieldsAlpha.Store.getCurrentLayer("items") || [];
	//
  //   id = id.toString();
  //   const newItems = [...currentItems];
	//
  //   newItems[task.index] = {id: id, type: "file"};
	//
  //   KarmaFieldsAlpha.Store.setCurrentLayer(newItems);
	//
  //   for (let key in task.params) {
	//
  //     const value = KarmaFieldsAlpha.Type.toArray(task.params[key]);
	//
  //     KarmaFieldsAlpha.Store.setValue(value, task.driver, id, key);
	//
  //   }
	//
  //   // if (!task.params.id) {
	//
  //     KarmaFieldsAlpha.Store.set(["1"], "delta", task.driver, id, "trash");
  //     KarmaFieldsAlpha.Store.setValue(["0"], task.driver, id, "trash");
	//
  //   // }
	//
  // }











}

// KarmaFieldsAlpha.Gateway.optionPromises = {};
