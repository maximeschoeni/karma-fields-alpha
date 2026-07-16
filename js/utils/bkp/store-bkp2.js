

KarmaFieldsAlpha.server = KarmaFieldsAlpha.Store = class {

	static token = -1;
	static buffer = new KarmaFieldsAlpha.Collection("store", ["section"]);
	static buffer2 = new KarmaFieldsAlpha.Collection("store2", ["section"]);

	static tasks = new KarmaFieldsAlpha.Collection("tasks", ["type"]);
	static orders = {};
	static requests = {};
	static tempo = new KarmaFieldsAlpha.Collection("tempo");

	static vars = new KarmaFieldsAlpha.Database("vars", ["driver", "id", "key"]);
	static fields = new KarmaFieldsAlpha.Database("fields", ["fieldId", "key"]);
	// static edits = new KarmaFieldsAlpha.Database("edits", ["driver", "id", "key"]);
	static edits = new KarmaFieldsAlpha.Collection("edits", ["driver", "id", "key"]);
	static adds = new KarmaFieldsAlpha.Collection("adds", ["driver", "paramstring"]);

	static queries = new KarmaFieldsAlpha.Collection("queries", ["driver", "paramstring"]);


	static states = new KarmaFieldsAlpha.Collection("states", ["type"]);

	static history = new KarmaFieldsAlpha.Database("historyNEW", ["key"]);

	static promises = {};

	static needRender = true;

	static getAlias(driver, key) {

		return KarmaFieldsAlpha.Collection.get(KarmaFieldsAlpha.drivers, driver, "alias", key) || key;

	}

	static getRelations(driver) {

		return KarmaFieldsAlpha.Collection.get(KarmaFieldsAlpha.drivers, driver, "relations");

	}


	static getData(...path) {

		return this.buffer.get("data", ...path);

	}

	static setData(value, ...path) {

		this.buffer.set(value, "data", ...path);

	}

	static getTempo(...path) {

		return this.tempo.get(...path);

	}

	static setTempo(value, ...path) {

		this.tempo.set(value, ...path);

	}

	static removeTempo(...path) {

		this.tempo.remove(...path);

	}


	static getQuery(driver, paramstring) {

		let query = this.adds.get(driver, paramstring);

		if (!query) {

			query = this.queries.get(driver, paramstring);

			if (query === undefined || query.stalled) {

				this.tasks.set(true, "get", "query", driver, paramstring);

			}

		}

		return query;
	}

	static async initQuery() {

		const task = this.tasks.get("get", "query");

		if (task) {

			for (let driver in task) {

				for (let paramstring in task[driver]) {

					await this.fetchQuery(driver, paramstring, true);
					await this.fetchCount(driver, paramstring, true);

				}

			}

			this.needRender = true;

			this.tasks.remove("get", "query");

		}

	}

	static setQuery(query, driver, paramstring) {

		const task = this.tasks.get("post", "adds", driver, paramstring);

		if (task) {

			task.query = query;

		} else {

			const current = this.adds.get(driver, paramstring) || this.queries.get(driver, paramstring);

			if (!current) {

				console.error("setting query but query is not loaded");

			}

			this.tasks.set({ query, current }, "post", "adds", driver, paramstring);

		}

		this.adds.set(query, driver, paramstring);

		// // -> files
		// if (query.ids.some(id => id instanceof File)) {

		// 	for (let i = 0; i < query.ids.length; i++) {

		// 		if (query.ids[i] instanceof File) {

		// 			const file = query.ids[i];
		// 			const object = query.ids[i] = {};

		// 			this.tasks.set({ file, object }, "upload", driver, paramstring);

		// 		}

		// 	}

		// }





		// this.queries.set(query, driver, paramstring);

	}

	static async updateQuery() {

		const tasks = this.tasks.get("post", "adds");

		if (tasks) {

			for (let driver in tasks) {

				for (let paramstring in tasks[driver]) {

					const { query, current } = tasks[driver][paramstring];

					// await this.transformQuery(query, current, driver, paramstring);

					await this.transform(query, current, "queries", driver, paramstring);

				}

			}

			this.needRender = true;
			this.tasks.remove("post", "adds");

		}

	}

	// static uploadFile(file, driver, paramstring , id) {

	// 	this.tasks.set(file, "post", "upload", driver, paramstring, id);

	// }

	// static async doUploadFile() {

	// 	const task = this.tasks.get("post", "upload");

	// 	if (task) {

	// 		for (let driver in task) {

	// 			for (let paramstring in task[driver]) {

	// 				const query = this.getQuery(driver, paramstring);
	// 				// const newQuery = { ...query };

	// 				for (let edits in task[driver][paramstring]) {

	// 					const file = task[driver][paramstring][edits];

	// 					let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params need to be saved later

	// 					id = id.toString();

	// 					// const index = newQuery.ids.indexOf(edits);


	// 					await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, { [id]: edits });

	// 						// // do we need this?
	// 						// for (let key in edits) {
	// 						// 	await this.vars.set(edits[key], driver, id, key);
	// 						// }

	// 						// this.buffer.set(edits, "vars", driver, id);
	// 						// this.buffer.remove("vars", driver, token);


	// 				}

	// 			}

	// 			this.tasks.set(true, "reload", driver);

	// 		}

	// 		this.needRender = true;

	// 		this.tasks.remove("post", "upload");

	// 	}

	// }

	static removeQuery(driver, paramstring) {

		this.setQuery(null, driver, paramstring);

	}

	static getValue(driver, id, key, paramstring = "") {

		if (key === "id") {

			return [id];

		} else if (typeof id === "object") { // -> object to be added

			return id[key] || [];

		} else {

			key = this.getAlias(driver, key);

			const value = this.buffer.get("vars", driver, id, key);

			if (!value) {

				this.tasks.set(paramstring, "get", "value", driver, id, key);

			}

			return value;

		}

	}

	// static promiseValue(driver, id, key) {

	// 	let task = this.tasks.get("get", "valuePromise", driver, id, key);

	// 	if (!task) {

	// 		task = [];

	// 	}

	// 	const promise = new Promise(resolve => void task.push(resolve));

	// 	this.tasks.set(task, "get", "valuePromise", driver, id, key);

	// 	return promise;

	// }

	// static doPromiseValue() {

	// 	const tasks = this.tasks.query({ method: "post", name: "valuePromise" }, ["method", "name", "driver", "id", "key"]);

	// 	for (let task of [...tasks]) {

	// 		const value = this.getValue(task.driver, task.id, task.key);

	// 		if (value !== undefined) {

	// 			for (let resolve of task.value) {

	// 				resolve(value);

	// 			}

	// 			this.tasks.remove("post", "valuePromise", task.driver, task.id, task.key);

	// 		}

	// 	}

	// }

	// getValueAt(driver, paramstring, index, key) {

	// 	// let query = this.buffer.get("query", driver, paramstring);
	// 	let query = this.queries.get(driver, paramstring);

	// 	if (query) {

	// 		const id = query.ids[index];

	// 		if (!id) {

	// 			console.error("index out of bounds");

	// 		}

	// 		if (key === "id") {

	// 			return [id];

	// 		} else {

	// 			key = KarmaFieldsAlpha.Driver.getAlias(driver, key);

	// 			const value = this.buffer.get("vars", driver, id, key);

	// 			if (!value && typeof id !== "symbol") {

	// 				this.tasks.set(paramstring, "get", "value", driver, id, key);

	// 			}

	// 		}

	// 	} else {

	// 		this.tasks.set(true, "get", "query", driver, paramstring);

	// 	}

	// }

	static async requestValue(driver, id, key, paramstring) {

		let value = this.edits.get(driver, id, key);

		if (!value) {

			// value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);
			value = await this.vars.get(driver, id, key);

			while (!value) {

				const query = await this.fetchMore(driver, paramstring);

				// value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);
				value = await this.vars.get(driver, id, key);

				if (!value && query.complete) {

					value = [];

				}

			}

		}


		this.needRender = true;

		this.buffer.set(value, "vars", driver, id, key);

		return value;

	}


	static async initValue() {

		const task = this.tasks.get("get", "value");

		if (task) {

			for (let driver in task) {

				for (let id in task[driver]) {

					for (let key in task[driver][id]) {

						const paramstring = task[driver][id][key] || `ids=${Object.keys(task[driver]).join(",")}`;

						await this.requestValue(driver, id, key, paramstring);

					}

				}

			}

			this.needRender = true;

			this.tasks.remove("get", "value");

		}

	}

	static setValue(value, driver, id, key, paramstring) {

		if (!Array.isArray(value)) {

			console.error("value must be an array!");

		}

		key = this.getAlias(driver, key);

		if (typeof id === "object") {

			if (paramstring === undefined) {

				console.error("setting value to object in creation, but paramstring is undefined");

			}

			let query = this.getQuery(driver, paramstring);

			if (query === undefined) {

				console.error("setting value to object in creation, but query is not loaded");

			}

			let ids = [...query.ids];
			const index = ids.indexOf(id);

			if (index < 0) {

				console.error("setting value to object in creation, but object is not found");

			}

			ids[index] = { ...id, [key]: value };

			this.setQuery({ ...query, ids }, driver, paramstring);

		} else {

			this.buffer.set(value, "vars", driver, id, key);

			const task = this.tasks.get("post", "value", driver, id, key);

			if (task) {

				task.value = value;

			} else {

				const current = this.edits.get(driver, id, key);
				this.tasks.set({ value, current }, "post", "value", driver, id, key);

				this.edits.set(value, driver, id, key);

			}

		}

		// if (!this.isToken(id)) {

		// 	this.tasks.set(value, "post", "value", driver, id, key);

		// }

	}

	static async updateValue() {

		const task = this.tasks.get("post", "value");

		if (task) {

			for (let driver in task) {

				for (let id in task[driver]) {

					for (let key in task[driver][id]) {

						let { value, current } = task[driver][id][key];

						if (!current) {

							current = await this.vars.get(driver, id, key) || [];

						}


						// const original = await this.vars.get(driver, id, key);
						// const current = this.edits.get(driver, id, key) || await this.vars.get(driver, id, key) || [];

						await this.transform(value, current, "vars", driver, id, key);

						// await this.write(value, driver, id, key);

					}

				}

			}

			this.needRender = true; // -> just to update submit button + update post form

			this.tasks.remove("post", "value");

		}

	}


	static getState(fieldId, key) {

		return this.buffer.get("fields", fieldId, key);

	}

	static createState(value, fieldId, key) {

		this.buffer.set(value, "fields", fieldId, key);

	}

	// actually useless!
	static async initState() {

		const task = this.tasks.get("get", "state");

		if (task) {

			for (let fieldId in task) {

				for (let key in task[fieldId]) {

					state = this.requests.state[fieldId][key];

					this.buffer.set(state, "fields", fieldId, key);

				}

			}

			this.needRender = true;
			this.tasks.remove("get", "state");

		}

	}

	 // value is an Object
	static setState(value, fieldId, key) {

		const task = this.tasks.get("post", "state", fieldId, key);

		if (task) {

			task.value = value;

		} else {

			const current = this.buffer.get("fields", fieldId, key) || null;

			this.buffer.set(value, "fields", fieldId, key);

			this.tasks.set({ value, current }, "post", "state", fieldId, key);

		}

	}

	static removeState(fieldId, key) {

		this.setState(null, fieldId, key);

		// const current = this.buffer.get("fields", fieldId, key);

		// if (current) {

		// 	// -> maybe should not remove state now?(we may need to keep ids until next process)
		// 	// will cause a blank screen
		// 	this.buffer.set(value, "fields", fieldId, key);

		// 	this.tasks.set({ value: null, current }, "post", "state", fieldId, key);

		// }

	}

	static async updateState() {

		const task = this.tasks.get("post", "state");

		if (task) {

			for (let fieldId in task) {

				for (let key in task[fieldId]) {

					const {value, current} = task[fieldId][key];

					// await this.transformField(value, current, fieldId, key);
					await this.transform(value, current, "fields", fieldId, key);

				}

			}

			this.needRender = true;

			this.tasks.remove("post", "state");

		}

	}

	static getOptionsList(driver, paramstring, keys = ["name"]) {

		// const query = this.buffer.get("query", driver, paramstring);
		const query = this.getQuery(driver, paramstring);

		if (query) {

			const options = [];

			for (let i = 0; i < query.ids.length; i++) {

				for (let key of keys) {

					const value = this.getValue(driver, query.ids[i], key, paramstring);

					if (!value) {

						return;

					}

					options.push({ id: ids[i], [key]: value[0] });

				}

			}

			return options;

		}

	}


	static async process() {

		this.needRender = false;

		// await this.initState();


		await this.updateState();
		await this.updateQuery();
		await this.updateValue();

		// await this.doAdd(); // -> or just do it when submit?
		// await this.doDelete();
		await this.doUploadUrls();
		// await this.doUpload();

		await this.doSubmit();
		await this.doHistory();

		await this.initQuery();
		await this.initValue();

		await this.doPromise();

		// this.needRender ||= this.hasEdits();

		this.tempo.clear();

	}

	static hasDownload() {

		const object = this.tasks.get("get");

		return object && Object.keys(object).length > 0 || false;

		// return this.tasks.has("get");

	}

	static hasUpload() {

		const object = this.tasks.get("post");

		return object && Object.keys(object).length > 0 || false;

		// return this.tasks.has("post");

	}

	static isLoading() {

		return this.tasks.has("get") && this.needRender;

	}

	static hasAdds() {

		const adds = this.adds.get();

		for (let driver in adds) {

			for (let paramstring in adds[driver]) {

				const query = this.queries.get(driver, paramstring);

				if (query === undefined) {

					console.error("query should not be undefined!");

				}

				if (!KarmaFieldsAlpha.DeepObject.equal(query.ids, adds[driver][paramstring].ids)) {

					return true;

				}

			}

		}

		return false;

	}

	static hasEdits() {

		// return this.buffer.hasEdits;

		// return this.buffer.has("edits");

		// return this.edits.count() > 0;
		//
		const edits = this.edits.get();
		// const adds = this.adds.get();

		return Object.keys(edits).length > 0 || this.hasAdds();  //Object.keys(adds).length > 0;

	}

	static hasPromise() {

		return Object.keys(this.promises).length > 0;

	}

	// static promise(callback) {

	// 	if (!this.tasks.has("get", "promise")) {

	// 		this.tasks.set(callback, "get", "promise");

	// 		this.doPromise();

	// 	}

	// }

	static promise(callback, key = "") {

		if (!this.promises[key]) {

			this.promises[key] = callback;

			callback(() => void delete this.promises[key]);

			// this.tasks.set(callback, "get", "promise", key);

			// this.doPromise();

		}

	}

	// static promise(callback, key = "") {

	// 	let promises = this.tasks.has("get", "promises");

	// 	if (!promises) {

	// 		promises = [];

	// 		this.tasks.set(promises, "get", "promise");

	// 	}

	// 	promises.push(callback);

	// 	// this.doPromise();

	// }

	// static async doPromise() {

	// 	let task = this.tasks.get("get", "promise");

	// 	if (task) {

	// 		await task(() => void this.tasks.remove("get", "promise"));

	// 		this.needRender = true;

	// 	}

	// }

	static async doPromise() {

		if (this.hasPromise()) {

			for (let key in this.promises) {

				const callback = this.promises[key];

				await callback(() => void delete this.promises[key]);

			}

			this.needRender = true;

		}

	}

	// static async doPromise() {

	// 	let task = this.tasks.get("get", "promises");

	// 	if (task) {

	// 		for (let callback of task) {

	// 			await callback(() => void this.tasks.remove("get", "promise"));

	// 		}



	// 		this.needRender = true;

	// 	}

	// }




  // async fetchQuery(query) {



  //   const relations = KarmaFieldsAlpha.Driver.getRelations(query.driver) || [];
  //   const idAlias = KarmaFieldsAlpha.Driver.getAlias(query.driver, "id");

  //   let paramstring = query.paramstring;

  //   // if (!paramstring) {
  //   if (query.type === "wild") {

  //     if (!query.requestedIds || !query.requestedIds.size) {

  //       console.error("wild query holds no ids!");

  //     }

  //     paramstring = `ids=${[...query.requestedIds].join(",")}`;

  //   }

  //   const results = await KarmaFieldsAlpha.HTTP.get(`query/${query.driver}`, paramstring);

  //   if (results) {

  //     query.queriedIds = results.map(result => result[idAlias]);

  //     const items = [];

  //     for (let result of results) {

  //       const id = result[idAlias];

  //       for (let key in result) {

  //         // items.push({id, key, data: [result[key]]});
  //         items.push({id, key, data: result[key]});

  //       }

  //     }

  //     await KarmaFieldsAlpha.Database.Vars.insert(items, query.driver);

  //   } else {

  //     query.queriedIds = [];

  //   }

  //   query.queried = true;
  //   query.complete = relations.length === 0 || query.queriedIds.length === 0;

  //   await KarmaFieldsAlpha.Database.Queries.set(query);

  //   return query;

  // }

  // async fetchQuery(driver, paramstring) {
  //
  //   const relations = KarmaFieldsAlpha.Driver.getRelations(driver) || [];
  //   const idAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "id");
  //
  //   let query = await KarmaFieldsAlpha.Database.Queries.get(driver, paramstring, "query") || {};
  //
  //   if (!paramstring) {
  //
  //     if (!query.requestedIds || !query.requestedIds.size) {
  //
  //       console.error("wild query hold no ids!");
  //
  //     }
  //
  //     paramstring = `ids=${[...query.requestedIds].join(",")}`;
  //
  //   }
  //
  //   const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}`, paramstring);
  //
  //   if (results) {
  //
  //     query.queriedIds = results.map(result => result[idAlias]);
  //
  //     const items = [];
  //
  //     for (let result of results) {
  //
  //       const id = result[idAlias];
  //
  //       for (let key in result) {
  //
  //         items.push({id, key, data: [result[key]]});
  //
  //       }
  //
  //     }
  //
  //     await KarmaFieldsAlpha.Database.Vars.insert(items, driver);
  //
  //   } else {
  //
  //     query.queriedIds = [];
  //
  //   }
  //
  //   query.queried = true;
  //
  //   // query.complete = Boolean(query.queried && (!query.queriedIds || !query.queriedIds.length || (query.relationIndex || 0) >= relations.length));
  // query.complete = Boolean(query.queried && (!query.queriedIds || !query.queriedIds.length || (query.relationIndex || 0) >= relations.length));
  //
  // await KarmaFieldsAlpha.Database.Queries.set(query, driver, paramstring, "query");
  //
  // return query;
  //
  // }


  // async fetchRelation(driver, paramstring) {
  //
  //   const relations = KarmaFieldsAlpha.Driver.getRelations(driver) || [];
  //   const idAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "id");
  //
  //   let query = await KarmaFieldsAlpha.Database.Queries.get(driver, paramstring, "query");
  //   let queriedIds = query.queriedIds || [];
  //   let index = query.relationIndex || 0;
  //
  //   if (index < relations.length && queriedIds.length) {
  //
  //     const relation = relations[index];
  //     const max = 100;
  //
  //     for (let i = 0; i < queriedIds.length; i += max) {
  //
  //       const paramstring = `ids=${queriedIds.slice(i, i + max).join(",")}`;
  //
  //       const results = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${relation}`, paramstring);
  //
  //       if (results && results.length) {
  //
  //         // await this.bufferRelations(results);
  //
  //         const dataset = {};
  //
  //         for (let result of results) {
  //
  //           const id = result.id.toString();
  //           const key = result.key.toString();
  //
  //           if (!dataset[id]) {
  //
  //             dataset[id] = {};
  //
  //           }
  //
  //           if (!dataset[id][key]) {
  //
  //             dataset[id][key] = [];
  //
  //           }
  //
  //           dataset[id][key].push(result.value);
  //
  //         }
  //
  //         const items = [];
  //
  //         for (let id in dataset) {
  //
  //           for (let key in dataset[id]) {
  //
  //             items.push({id, key, data: dataset[id][key]});
  //
  //           }
  //
  //         }
  //
  //         await KarmaFieldsAlpha.Database.Vars.insert(items, driver);
  //
  //       }
  //
  //     }
  //
  //     index++;
  //
  //   }
  //
  //   query.complete = Boolean(query.queried && (queriedIds.length === 0 || index >= relations.length));
  //   query.queriedIds = queriedIds;
  //   query.relationIndex = index;
  //
  //   await KarmaFieldsAlpha.Database.Queries.set(query, driver, paramstring, "query");
  //
  //   return query;
  //
  // }


  // async *fetchRelations(driver, paramstring, index = 0, length = Infinity) {
  //
  //   const relations = KarmaFieldsAlpha.Driver.getRelations(driver) || [];
  //   const idAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "id");
  //
  //   let query = await KarmaFieldsAlpha.Database.Queries.get(driver, paramstring, "query");
  //
  //   if (!query) {
  //
  //     console.error("Fetching relations but query doesnt exist");
  //
  //   }
  //
  //   if (!query.queriedIds) {
  //
  //     console.error("queriedIds not found in query");
  //
  //   }
  //
  //   // let queriedIds = query.queriedIds || [];
  //
  //   // if (index < Math.min(relations.length, length) && queriedIds.length) {
  //
  //   if (query && query.queriedIds && query.queriedIds.length) {
  //
  //     for (let i = 0; i < Math.min(relations.length, length); i++) {
  //
  //       const relation = relations[index + i];
  //       const max = 100;
  //
  //       for (let j = 0; j < query.queriedIds.length; j += max) {
  //
  //         const paramstring = `ids=${query.queriedIds.slice(j, j + max).join(",")}`;
  //
  //         const results = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${relation}`, paramstring);
  //
  //         if (results && results.length) {
  //
  //           // await this.bufferRelations(results);
  //
  //           const dataset = {};
  //
  //           for (let result of results) {
  //
  //             const id = result.id.toString();
  //             const key = result.key.toString();
  //
  //             if (!dataset[id]) {
  //
  //               dataset[id] = {};
  //
  //             }
  //
  //             if (!dataset[id][key]) {
  //
  //               dataset[id][key] = [];
  //
  //             }
  //
  //             dataset[id][key].push(result.value);
  //
  //           }
  //
  //           const items = [];
  //
  //           for (let id in dataset) {
  //
  //             for (let key in dataset[id]) {
  //
  //               items.push({id, key, data: dataset[id][key]});
  //
  //             }
  //
  //           }
  //
  //           await KarmaFieldsAlpha.Database.Vars.insert(items, driver);
  //
  //         }
  //
  //       }
  //
  //       query.relationIndex = index + i + 1;
  //       query.complete = query.relationIndex >= relations.length;
  //
  //       await KarmaFieldsAlpha.Database.Queries.set(query, driver, paramstring, "query");
  //
  //       yield query;
  //
  //     }
  //
  //   } else {
  //
  //     query.complete = true;
  //
  //     await KarmaFieldsAlpha.Database.Queries.set(query, driver, paramstring, "query");
  //
  //   }
  //
  // }

  // async *fetchRelations(query) {

  //   const relations = KarmaFieldsAlpha.Driver.getRelations(query.driver) || [];
  //   const idAlias = KarmaFieldsAlpha.Driver.getAlias(query.driver, "id");

  //   // const offset = query.relationIndex || 0;

  //   if (query.queriedIds && query.queriedIds.length) {

  //     // for (let i = 0; i < relations.length; i++) {
  //     for (let index = query.relationIndex || 0; index < relations.length; index++) {

  //       const relation = relations[index];
  //       const max = 100;

  //       for (let j = 0; j < query.queriedIds.length; j += max) {

  //         const paramstring = `ids=${query.queriedIds.slice(j, j + max).join(",")}`;

  //         const results = await KarmaFieldsAlpha.HTTP.get(`relations/${query.driver}/${relation}`, paramstring);

  //         if (results && results.length) {

  //           const dataset = {};

  //           for (let result of results) {

  //             const id = result.id.toString();
  //             const key = result.key.toString();

  //             if (!dataset[id]) {

  //               dataset[id] = {};

  //             }

  //             if (!dataset[id][key]) {

  //               dataset[id][key] = [];

  //             }

  //             dataset[id][key].push(result.value);

  //           }

  //           const items = [];

  //           for (let id in dataset) {

  //             for (let key in dataset[id]) {

  //               items.push({id, key, data: dataset[id][key]});

  //             }

  //           }

  //           await KarmaFieldsAlpha.Database.Vars.insert(items, query.driver);

  //         }

  //       }

  //       query.relationIndex = index + 1;
  //       query.complete = query.relationIndex >= relations.length;

  //       await KarmaFieldsAlpha.Database.Queries.set(query);

  //       yield query;

  //     }

  //   } else {

  //     query.complete = true;

  //     await KarmaFieldsAlpha.Database.Queries.set(query);

  //   }

  // }

  // async *fetch(query) {

  //   // const query = await KarmaFieldsAlpha.Database.Queries.get(driver, paramstring, "count");

  //   if (!query.queried) {

  //     yield this.fetchQuery(query);

  //   }

  //   yield* this.fetchRelations(query);

  // }

	// async fetchQuery(driver, paramstring, forceReload) {

	// 	// let query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);
	// 	let query = this.get("store", "query", driver, paramstring);

	// 	if (!query || forceReload) {

	// 		query = {};

	// 		this.set(query, "store", "query", driver, paramstring);

	// 	}

	// 	if (!query.complete && !query.queried) {

	// 		const relations = KarmaFieldsAlpha.Driver.getRelations(driver) || [];
	// 		const idAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "id");

	// 		const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}`, paramstring);

	// 		if (results) {

	// 			query.ids = results.map(result => result[idAlias]);

	// 			const items = [];

	// 			for (let result of results) {

	// 				const id = result[idAlias];

	// 				for (let key in result) {

	// 					items.push({ id, key, data: result[key] });

	// 				}

	// 			}

	// 			await KarmaFieldsAlpha.Database.Vars.insert(items, driver);

	// 		} else {

	// 			query.ids = [];

	// 		}

	// 		query.queried = true;
	// 		query.complete = relations.length === 0 || query.ids.length === 0;

	// 		// await KarmaFieldsAlpha.Database.Queries.set(query, "query", driver, paramstring);

	// 	}

	// 	return query;

	// }

	static async fetchQuery(driver, paramstring, forceReload) {

		let query = this.queries.get(driver, paramstring) || {};

		if (!query.complete && !query.queried || forceReload) {

			const relations = this.getRelations(driver) || [];
			const idAlias = this.getAlias(driver, "id");

			const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}`, paramstring);

			query.ids = [];

			if (results) {

				for (let result of results) {

					const id = result[idAlias];

					query.ids.push(id);

					for (let key in result) {

						// this.buffer.set([result[key]], "vars", driver, id, key);
						// this.buffer2.set([result[key]], "vars", driver, id, key);

						await this.vars.set([result[key]], driver, id, key);

					}

				}

				query.complete = relations.length === 0;

			} else {

				query.complete = true;

			}

			query.queried = true;

		}

		this.queries.set(query, driver, paramstring);

		return query;

	}

	static async fetchCount(driver, paramstring, forceReload) {

		let query = this.queries.get(driver, paramstring) || {};

		if (query.count === undefined || forceReload) {

			query.count = await KarmaFieldsAlpha.HTTP.get(`count/${driver}`, paramstring) || 0;

			this.queries.set(query, driver, paramstring);

		}

	}

	static async fetchMore(driver, paramstring) {

		let query = this.queries.get(driver, paramstring);

		if (!query) {

			query = await this.fetchQuery(driver, paramstring);

		}

		if (!query.ids) {

			console.error("Fetching relations but ids is not set");
			query.ids = [];

		}

		query.relationIndex ||= 0;

		const relations = this.getRelations(driver) || [];

		if (query.ids.length && query.relationIndex < relations.length) {

			const relation = relations[query.relationIndex];
			const max = 100;

			for (let j = 0; j < query.ids.length; j += max) {

				const paramstring = `ids=${query.ids.slice(j, j + max).join(",")}`;

				const results = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${relation}`, paramstring);

				if (results && results.length) {

					const dataset = {};

					for (let result of results) {

						const id = result.id.toString();
						const key = result.key.toString();

						if (!dataset[id]) {

							dataset[id] = {};

						}

						if (!dataset[id][key]) {

							dataset[id][key] = [];

						}

						dataset[id][key].push(result.value);

					}

					for (let id in dataset) {

						for (let key in dataset[id]) {

							// this.buffer.set(dataset[id][key], "vars", driver, id, key);
							// this.buffer2.set(dataset[id][key], "vars", driver, id, key);

							await this.vars.set(dataset[id][key], driver, id, key);

						}

					}

				}

			}

			query.relationIndex++;
			query.complete = query.relationIndex >= relations.length;

		} else {

			query.complete = true;

		}

		this.queries.set(query, driver, paramstring);

		return query;

	}


	// not used!
	static async fetchValues(driver, ids, keys) {

		const paramstring = `ids=${ids.join(",")}`;

		for (let id of ids) {

			for (let key of keys) {

				let value = await this.vars.get(driver, id, key);

				if (!value) {

					await this.fetchQuery(driver, paramstring);

					value = await this.vars.get(driver, id, key);

				}

				while (!value) {

					const query = await this.fetchMore(driver, paramstring);

					if (query.complete) {

						value = [];

					} else {

						value = await this.vars.get(driver, id, key);

					}

				}

			}

		}

	}

	static async write(value, driver, id, key) {

		const original = await this.vars.get(driver, id, key);
		const current = this.edits.get(driver, id, key);


		if (!original || !KarmaFieldsAlpha.DeepObject.equal(value, original)) {

			this.edits.set(value, driver, id, key);

		} else if (current) {

			this.edits.remove(driver, id, key);

		}

		const index = KarmaFieldsAlpha.History.getIndex();

		if (index > 0) {

			const previous = await KarmaFieldsAlpha.Database.History.get(index - 1, "external", driver, id, key);

			if (!previous) {

				await KarmaFieldsAlpha.Database.History.set(current || original || [], index - 1, "external", driver, id, key);

			}

		}

		await KarmaFieldsAlpha.Database.History.set(value, index, "external", driver, id, key);

	}

	static async transformValue(value, current, driver, id, key) {

		const original = await this.vars.get(driver, id, key);

		if (!original || !KarmaFieldsAlpha.DeepObject.equal(value, original)) {

			this.edits.set(value, driver, id, key);

		} else if (current) {

			this.edits.remove(driver, id, key);

		}

		const index = KarmaFieldsAlpha.History.getIndex();

		if (index > 0) {

			const previous = await KarmaFieldsAlpha.Database.History.get(index - 1, "external", driver, id, key);

			if (!previous) {

				await KarmaFieldsAlpha.Database.History.set(current || original || [], index - 1, "external", driver, id, key);

			}

		}

		await KarmaFieldsAlpha.Database.History.set(value, index, "external", driver, id, key);

	}

	static async transformField(value, current, fieldId, key) {

		if (!KarmaFieldsAlpha.DeepObject.equal(value, current)) {

			// await KarmaFieldsAlpha.Database.fields.set(value, fieldId, key);

			const index = KarmaFieldsAlpha.History.getIndex();

			if (index > 0) {

				const previous = await KarmaFieldsAlpha.Database.History.get(index - 1, "internal", "fields", fieldId, key);

				if (!previous) {

					await KarmaFieldsAlpha.Database.History.set(current || null, index - 1, "internal", "fields", fieldId, key);

				}

				await KarmaFieldsAlpha.Database.History.set(value, index, "internal", "fields", fieldId, key);

			}


		}

	}


	static async transform(value, current, ...path) {

		if (!KarmaFieldsAlpha.DeepObject.equal(value, current)) {

			const index = KarmaFieldsAlpha.History.getIndex();

			if (index > 0) {

				const lastState = await this.history.get(index - 1) || {};

				const lastValue = KarmaFieldsAlpha.Collection.get(lastState, ...path);

				if (!lastValue) {

					KarmaFieldsAlpha.Collection.set(current, lastState, ...path);

					await this.history.set(lastState, index - 1);

				}

				const currentState = await this.history.get(index);

				KarmaFieldsAlpha.Collection.set(value, currentState, ...path);

				await this.history.set(currentState, index);

			}

		}

	}

	static async transformQuery(query, current, driver, paramstring) {

		const index = KarmaFieldsAlpha.History.getIndex();

		if (index > 0) {

			const previous = await KarmaFieldsAlpha.Database.History.get(index - 1, "queries", driver, paramstring, "query");

			if (!previous) {

				await KarmaFieldsAlpha.Database.History.set(current, index - 1, "queries", driver, paramstring, "query");

			}

			await KarmaFieldsAlpha.Database.History.set(query, index, "queries", driver, paramstring, "query");

		}

	}

	// static add(values, driver) { // -> values is an object of arrays

	// 	const token = this.createToken();

	// 	this.tasks.set(values, "post", "add", driver, token);

	// 	this.buffer.set(values, "vars", driver, token);

	// 	return token;

	// }

	// static addItems(num, values, driver, paramstring, gridId, index) { // -> values is an object of arrays

	// 	const tokens = [];

	// 	for (let i = 0; i < num; i++) {

	// 		const token = this.createToken();
	// 		tokens.push(token);

	// 	}




	// 	this.tasks.set(values, "post", "add", driver, token);

	// 	this.buffer.set(values, "vars", driver, token);

	// 	return token;

	// }

	// static async doAdd() {

	// 	const task = this.tasks.get("post", "add");

	// 	if (task) {

	// 		for (let driver in task) {

	// 			const updates = {};

	// 			for (let token in task[driver]) {

	// 				let id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`);

	// 				id = id.toString();

	// 				const edits = task[driver][token];

	// 				if (edits) {

	// 					updates[id] = edits;

	// 					this.edits.remove(driver, token);

	// 					for (let key in edits) {

	// 						await this.vars.set(edits[key], driver, id, key);

	// 						// await this.write(edits[key], driver, id, key);

	// 					}

	// 					await this.write(["0"], driver, id, "trash");

	// 					this.buffer.set(edits, "vars", driver, id);
	// 					this.buffer.remove("vars", driver, token);

	// 				}

	// 			}

	// 			await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, updates);

	// 		}

	// 		this.needRender = true;

	// 		this.tasks.remove("post", "add");

	// 	}

	// }




	// static async upload(item) {

	// 	let id = await KarmaFieldsAlpha.HTTP.upload(item.file); // -> parent and params need to be saved later

	// 	id = id.toString();

	// 	delete item.file;
	// 	delete item.filetype;
	// 	delete item.filename;

	// 	data[id] = item;

	// 	await this.vars.get(["1"], driver, id, "trash");
	// 	await this.write(["0"], driver, id, "trash");

	// }


	// static upload(file, driver) {

	// 	const token = this.createToken();

	// 	this.tasks.set(file, "post", "upload", driver, token);
	// 	this.queries.remove(driver); // -> clean all driver queries

	// 	this.setValue(["0"], driver, token, "trash");

	// 	return token;

	// }

	// static async doUpload() {

	// 	const task = this.tasks.get("post", "upload");

	// 	if (task) {

	// 		for (let driver in task) {

	// 			for (let token in task[driver]) {

	// 				const file = task[driver][token];

	// 				let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params need to be saved later

	// 				id = id.toString();

	// 				const edits = this.edits.get(driver, token);

	// 				if (edits) {

	// 					this.edits.remove(driver, token);

	// 					await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, { [id]: edits });

	// 					// do we need this?
	// 					for (let key in edits) {
	// 						await this.vars.set(edits[key], driver, id, key);
	// 					}

	// 					this.buffer.set(edits, "vars", driver, id);
	// 					this.buffer.remove("vars", driver, token);

	// 				}

	// 			}

	// 		}

	// 		this.needRender = true;

	// 		this.tasks.remove("post", "upload");

	// 	}

	// }

	static uploadUrl(url, driver) {

		const token = this.createToken();

		this.tasks.set(url, "post", "url", driver, token);
		this.queries.remove(driver); // -> clean all driver queries

		this.setValue(["0"], driver, token, "trash");

		return token;

	}

	static async doUploadUrls() {

		const task = this.tasks.get("post", "url");

		if (task) {

			for (let driver in task) {

				for (let token in task[driver]) {

					const url = task[driver][token];

					const response = await fetch(url);
					const blob = await response.blob();
					const filename = url.split('/').pop();
					const file = new File([blob], filename);

					this.tasks.set(file, "post", "upload", driver, token);

				}

			}

			this.needRender = true;

			this.tasks.remove("post", "url");

		}

	}


	// static isToken(id) {

	// 	return parseInt(id) < 0;

	// }

	// static createToken() {

	// 	return this.token--;

	// }

	// static createTokens(length) {

	// 	return this.generateTokens(length).toArray();

	// }

	// static *generateTokens(length) {

	// 	for (let i = 0; i < length; i++) {

	// 		yield this.createToken();

	// 	}

	// }

	static getEdits() {

		return this.edits.get();

	}

	// static submit() {

	// 	const edits = this.edits.get();

	// 	for (let driver in edits) {

	// 		for (let id in edits[driver]) {

	// 			if (this.isToken(id)) {

	// 				const [trash] = this.buffer.get("vars", driver, id, "trash") || [];

	// 				if (trash !== "1") {

	// 					this.tasks.set(edits[driver][id], "post", "add", driver, id);

	// 				}

	// 			} else {

	// 				this.tasks.set(edits[driver][id], "post", "update", driver, id);

	// 			}

	// 		}

	// 		this.tasks.set(true, "clear", "queries", driver);

	// 	}

	// 	this.edits.clear();

	// 	// // clear all add/delete data in fields + spot things to add
	// 	const states = this.buffer.get("fields");

	// 	if (states) {

	// 		for (let fieldId in states) {

	// 			for (let key in states[fieldId]) {

	// 				if (key === "ids") {

	// 					this.tasks.set(states[fieldId][key], "clear", "state", "ids", fieldId);

	// 				}

	// 			}

	// 		}

	// 	}

	// 	// get all queries to reload


	// 	this.tasks.set(edits, "post", "update");

	// }

	static submit() {

		this.tasks.set(true, "post", "submit");



		// const edits = this.edits.get();

		// for (let driver in edits) {

		// 	for (let id in edits[driver]) {

		// 		this.tasks.set(edits[driver][id], "post", "update", driver, id);

		// 	}

		// 	// this.tasks.set(true, "clear", "queries", driver);

		// }

		// // this.edits.clear();


		// const adds = this.adds.get();

		// for (let driver in adds) {

		// 	for (let paramstring in adds[driver]) {

		// 		const query = adds[driver][paramstring];

		// 		const items = query.ids.filter(item => typeof item === "object");

		// 		this.tasks.set(items, "post", "add", driver, paramstring);

		// 	}

		// 	// this.tasks.set(true, "clear", "queries", driver);

		// }

		// this.adds.clear();



		// this.tasks.set(edits, "post", "update");

	}

	static async doSubmit() {

		const submitTask = this.tasks.get("post", "submit");

		if (submitTask) {

			const adds = this.adds.get();

			if (adds) {

				for (let driver in adds) {

					for (let paramstring in adds[driver]) {

						const query = adds[driver][paramstring];
						const items = query.ids.filter(id => typeof id === "object");

						if (items.length) {

							await this.add(items, driver);

						}

					}

					this.tasks.set(true, "reload", driver);

				}

				this.removeQuery(driver, paramstring);

				// this.adds.clear();

				// this.needRender = true;

				// this.tasks.remove("post", "add");

			}

			// const updateTasks = this.tasks.get("post", "update");
			const edits = this.edits.get();

			if (edits) {

				for (let driver in edits) {

					await this.send(driver, edits[driver]);

					this.tasks.set(true, "reload", driver);

				}

				this.edits.clear();

				this.needRender = true;



			}

			this.needRender = true;
			this.tasks.remove("post", "submit");

		}




		const reloadTasks = this.tasks.get("reload");

		if (reloadTasks) {

			for (let driver in reloadTasks) {

				await this.reloadQueries(driver);

			}

			this.needRender = true;

			this.tasks.remove("reload");

		}

		// const clearQueryTasks = this.tasks.get("clear", "queries");

		// if (clearQueryTasks) {

		// 	for (let driver in clearQueryTasks) {

		// 		this.queries.remove(driver);

		// 	}

		// 	this.needRender = true;

		// 	this.tasks.remove("clear", "queries");

		// }

		// const clearIdsTasks = this.tasks.get("clear", "state", "ids");

		// if (clearIdsTasks) {

		// 	for (let fieldId in clearIdsTasks) {

		// 		await this.transformField(null, clearIdsTasks[fieldId], fieldId, "ids");

		// 	}

		// 	this.needRender = true;

		// 	this.tasks.remove("clear", "state", "ids");

		// }

	}

	static async add(items, driver) {

		// const data = {};

		for (let item of items) {

			let id;

			if (item.file) {

				id = await KarmaFieldsAlpha.HTTP.upload(item.file); // -> parent and params need to be saved later

				delete item.file;
				delete item.filetype;
				delete item.filename;

			} else {

				id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`);

			}

			id = id.toString();

			// await this.vars.set(["1"], driver, id, "trash");
			// await this.write(["0"], driver, id, "trash");
			await this.transform([], ["1"], "vars", driver, id, "trash");

			for (let key of item) {

				// await this.vars.set([], driver, id, key);
				// await this.write(item[key], driver, id, key);

				await this.transform(item[key], [], "vars", driver, id, key);

			}

		}

	}

	static async send(driver, data) {

		await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, data);

		for (let id in data) {

			for (let key in data[id]) {

				const value = data[id][key];

				await this.vars.set(value, driver, id, key);

			}

		}

	}

	static async reloadQueries(driver) {

		const queries = this.queries.get(driver);

		if (queries) {

			for (let paramstring in queries) {

				await this.fetchQuery(driver, paramstring, true);

			}

		}

	}


	static changeHistory() {

		// const index = this.getIndex();
		// const current = KarmaFieldsAlpha.History.current;

		// this.tasks.set({ index, current }, "get", "history");

	}

	// static async doHistory() { // called on popstate

	// 	const index = KarmaFieldsAlpha.History.getIndex();

	// 	if (KarmaFieldsAlpha.History.current !== index) {

	// 		while (KarmaFieldsAlpha.History.current !== index) {

	// 			if (KarmaFieldsAlpha.History.current > index) {

	// 				KarmaFieldsAlpha.History.current--;

	// 			} else {

	// 				KarmaFieldsAlpha.History.current++;

	// 			}

	// 			const edits = await KarmaFieldsAlpha.Database.History.select(KarmaFieldsAlpha.History.current);

	// 			if (edits) {

	// 				for (let edit of edits) {

	// 					// await KarmaFieldsAlpha.Database.States.set(edit.data, edit.context, edit.driver, edit.id, edit.key);

	// 					if (edit.context === "external") {

	// 						this.edits.set(edit.data, edit.driver, edit.id, edit.key);

	// 						this.buffer.set(edit.data, "vars", edit.driver, edit.id, edit.key);

	// 					} else if (edit.context === "internal" && edit.driver === "fields") {

	// 						this.buffer.set(edit.data, "fields", edit.id, edit.key);

	// 					} else if (edit.context === "queries") {

	// 						this.adds.set(edit.data, edit.driver, edit.id);

	// 					}


	// 				}

	// 			}


	// 			// await KarmaFieldsAlpha.Database.States.insert(states, current);

	// 		}

	// 		// KarmaFieldsAlpha.Session.setValue(current, "karmaHistoryIndex");

	// 		// KarmaFieldsAlpha.History.current = current;

	// 		// while (current < index) {

	// 		// 	current++;

	// 		// 	const states = await KarmaFieldsAlpha.Database.History.select(current);

	// 		// 	await KarmaFieldsAlpha.Database.States.insert(states, current);

	// 		// 	// await KarmaFieldsAlpha.Database.History.revert(current);

	// 		// }

	// 		this.needRender = true;

	// 		// this.tasks.remove("get", "history");
	// 	}



	// 	// KarmaFieldsAlpha.Session.setValue(current, "karmaHistoryIndex");

	// }

	static async doHistory() { // called on popstate

		const index = KarmaFieldsAlpha.History.getIndex();

		if (KarmaFieldsAlpha.History.current !== index) {

			while (KarmaFieldsAlpha.History.current !== index) {

				if (KarmaFieldsAlpha.History.current > index) {

					KarmaFieldsAlpha.History.current--;

				} else {

					KarmaFieldsAlpha.History.current++;

				}

				const states = await this.history.get(KarmaFieldsAlpha.History.current);

				this.states.set(states);

				this.buffer3.assign(states);

				// const edits = await KarmaFieldsAlpha.Database.History.select(KarmaFieldsAlpha.History.current);

				// if (edits) {

				// 	for (let edit of edits) {

				// 		if (edit.context === "external") {

				// 			this.edits.set(edit.data, edit.driver, edit.id, edit.key);

				// 			this.buffer.set(edit.data, "vars", edit.driver, edit.id, edit.key);

				// 		} else if (edit.context === "internal" && edit.driver === "fields") {

				// 			this.buffer.set(edit.data, "fields", edit.id, edit.key);

				// 		} else if (edit.context === "queries") {

				// 			this.adds.set(edit.data, edit.driver, edit.id);

				// 		}

				// 	}

				// }

			}

			this.needRender = true;

		}

	}

}
