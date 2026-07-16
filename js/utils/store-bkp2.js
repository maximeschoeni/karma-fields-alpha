

KarmaFieldsAlpha.server = KarmaFieldsAlpha.Store = class {

	static data = new KarmaFieldsAlpha.Collection("data");

	static tasks = new KarmaFieldsAlpha.Collection("tasks", ["type"]);
	// static orders = {};
	// static requests = {};
	static tempo = new KarmaFieldsAlpha.Collection("tempo");

	// static vars = new KarmaFieldsAlpha.Database("vars", ["driver", "id", "key"]);
	// static fields = new KarmaFieldsAlpha.Database("fields", ["fieldId", "key"]);

	// static edits = new KarmaFieldsAlpha.Collection("edits", ["driver", "id", "key"]); // deprecated
	// static adds = new KarmaFieldsAlpha.Collection("adds", ["driver", "paramstring"]); // deprecated

	static vars = new KarmaFieldsAlpha.Collection("vars", ["driver", "id", "key"]);
	static tempVars = new KarmaFieldsAlpha.Collection("tempVars", ["driver", "id", "key"]);
	static uploads = new KarmaFieldsAlpha.Collection("uploads", ["driver", "id"]);

	static queries = new KarmaFieldsAlpha.Collection("queries", ["driver", "paramstring"]);
	static ids = new KarmaFieldsAlpha.Collection("ids", ["driver", "paramstring"]);
	static counts = new KarmaFieldsAlpha.Collection("counts", ["driver", "paramstring"]);

	static states = new KarmaFieldsAlpha.Collection("states", ["type"]);
	static history = new KarmaFieldsAlpha.Database("history", ["session", "index"]);
	static models = new KarmaFieldsAlpha.Collection("models");

	static promises = {};

	static needRender = true;

	static getModel(...path) {

		let model = this.models.get(...path);

		if (!model) {

			this.tasks.set(true, "get", "model", ...path);

		}

	}

	static async initModel() {

		const task = this.tasks.get("get", "model");

		if (task) {

			for (let name in task) {

				await this.fetchModel(name);

			}

			this.needRender = true;

			this.tasks.remove("get", "model");

		}

	}

	static getAlias(driver, key) {

		return KarmaFieldsAlpha.Collection.get(KarmaFieldsAlpha.drivers, driver, "alias", key) || key;

	}

	static getRelations(driver) {

		return KarmaFieldsAlpha.Collection.get(KarmaFieldsAlpha.drivers, driver, "relations");

	}


	static getData(...path) {

		return this.data.get(...path);

	}

	static setData(value, ...path) {

		this.data.set(value, ...path);

	}

	static removeData(...path) {

		this.data.remove(...path);

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


	static getIds(driver, paramstring) {

		// const tempIds = this.temp.get("queries", driver, paramstring);

		// if (tempIds) {

		// 	return tempIds;

		// }

		const taskedIds = this.tasks.get("post", "ids", driver, paramstring);

		if (taskedIds) {

			return taskedIds;

		}

		// const modifiedIds = this.states.get("ids", driver, paramstring);

		const modifiedIds = this.getState("ids", driver, paramstring);

		if (modifiedIds) {

			return modifiedIds;

		}

		const queriedIds = this.ids.get(driver, paramstring);

		if (queriedIds) {

			return queriedIds;

		}

		this.tasks.set(true, "get", "ids", driver, paramstring);

	}

	static async initIds() {

		const task = this.tasks.get("get", "ids");

		if (task) {

			for (let driver in task) {

				for (let paramstring in task[driver]) {

					await this.fetchQuery(driver, paramstring, true);

				}

			}

			this.needRender = true;

			this.tasks.remove("get", "ids");

		}

	}

	static setIds(ids, driver, paramstring) {

		this.tasks.set(ids, "post", "ids", driver, paramstring);

	}

	static async create(symbol, driver, paramstring) {

		const file = this.uploads.get(driver, symbol);
		const data = this.tempVars.get(driver, symbol);
		let id;

		if (file) {

			id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params need to be saved later

			await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, { [id.toString()]: data });

			this.uploads.remove(driver, symbol);

		} else {

			id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`);

			for (let key in data) {

				await this.transform(data[key], null, "vars", driver, id.toString(), key);

			}

		}

		await this.transform([], ["1"], "vars", driver, id.toString(), "trash");

		this.tempVars.remove(driver, symbol);

		return id;

	}

	static async updateIds() {

		const tasks = this.tasks.get("post", "ids");

		if (tasks) {

			for (let driver in tasks) {

				for (let paramstring in tasks[driver]) {

					const newIds = [];

					for (let id of tasks[driver][paramstring]) {

						if (typeof id === "symbol") {

							id = await this.create(id, driver, paramstring);

						}

						newIds.push(id);

					}

					// const currentIds = this.states.get("ids", driver, paramstring) || this.ids.get(driver, paramstring);

					// await this.transform(newIds, currentIds, "ids", driver, paramstring);

					this.setState(newIds, "ids", driver, paramstring);

					this.clearCount(driver, paramstring);

				}

			}

			this.needRender = true;
			this.tasks.remove("post", "ids");

		}

	}





	// static getQuery(driver, paramstring) {

	// 	let query = this.states.get("queries", driver, paramstring);

	// 	if (!query) {

	// 		query = this.queries.get(driver, paramstring);

	// 		if (!query) {

	// 			this.tasks.set(true, "get", "query", driver, paramstring);

	// 		} else {

	// 			// query = { ids: query.ids, count: query.count };
	// 			query = { ids: query.ids };

	// 		}

	// 	}

	// 	return query;
	// }

	// static async initQuery() {

	// 	const task = this.tasks.get("get", "query");

	// 	if (task) {

	// 		for (let driver in task) {

	// 			for (let paramstring in task[driver]) {

	// 				await this.fetchQuery(driver, paramstring, true);
	// 				// await this.fetchCount(driver, paramstring, true);

	// 			}

	// 		}

	// 		this.needRender = true;

	// 		this.tasks.remove("get", "query");

	// 	}

	// }







	// static setQuery(query, driver, paramstring) {

	// 	const task = this.tasks.get("post", "adds", driver, paramstring);

	// 	if (task) {


	// 		task.delta += query.ids.length - task.query.ids.length;
	// 		task.query = query;

	// 	} else {

	// 		// const current = this.adds.get(driver, paramstring) || this.queries.get(driver, paramstring);
	// 		// const current = this.states.get("queries", driver, paramstring) || this.queries.get(driver, paramstring);

	// 		const current = this.getQuery(driver, paramstring);

	// 		if (!current) {

	// 			console.error("setting query but query is not loaded");

	// 		}

	// 		const count = this.states.get("count", driver, paramstring) ?? this.counts.get(driver, paramstring);
	// 		const delta = query.ids.length - current.ids.length;

	// 		this.tasks.set({ query, current, count, delta }, "post", "adds", driver, paramstring);

	// 	}

	// 	this.states.set(query, "queries", driver, paramstring);
	// 	// this.states.set(count, "count", driver, paramstring);

	// }

	// static async updateQuery() {

	// 	const tasks = this.tasks.get("post", "adds");

	// 	if (tasks) {

	// 		for (let driver in tasks) {

	// 			for (let paramstring in tasks[driver]) {

	// 				const { query, current, count, delta } = tasks[driver][paramstring];

	// 				// await this.transformQuery(query, current, driver, paramstring);

	// 				await this.transform(query, current, "queries", driver, paramstring);

	// 				if (count !== undefined && delta) {

	// 					await this.transform(count, count + delta, "count", driver, paramstring);

	// 				}

	// 			}

	// 		}

	// 		this.needRender = true;
	// 		this.tasks.remove("post", "adds");

	// 	}

	// }

	// static removeQuery(driver, paramstring) {

	// 	this.setQuery(null, driver, paramstring);

	// }


	static getCount(driver, paramstring) {

		let count = this.states.get("count", driver, paramstring) ?? this.counts.get(driver, paramstring);

		if (count === undefined) {

			this.tasks.set(true, "get", "count", driver, paramstring);

		}

		return count;
	}

	static async initCount() {

		const task = this.tasks.get("get", "count");

		if (task) {

			for (let driver in task) {

				for (let paramstring in task[driver]) {

					const count = await KarmaFieldsAlpha.HTTP.get(`count/${driver}`, paramstring) || 0;

					this.counts.set(count, driver, paramstring);

				}

			}

			this.needRender = true;

			this.tasks.remove("get", "count");

		}

	}

	// static setCount(count, driver, paramstring) {

	// 	this.tasks.set(ids, "post", "count", driver, paramstring);

	// }

	// static async updateCount() {

	// 	const tasks = this.tasks.get("post", "count");

	// 	if (tasks) {

	// 		for (let driver in tasks) {

	// 			for (let paramstring in tasks[driver]) {

	// 				const newCount = this.states.get("count", driver, paramstring) ?? this.counts.get(driver, paramstring);

	// 				if (tasks[driver] !== newCount) {

	// 					await this.transform(newCount, tasks[driver], "count", driver, paramstring);

	// 				}

	// 			}

	// 		}

	// 		this.needRender = true;
	// 		this.tasks.remove("post", "ids");

	// 	}

	// }

	static clearCount(driver, paramstring) {

		this.counts.remove(driver, paramstring);

	}

	// static setCount(count, driver, paramstring) {

	// 	const task = this.tasks.get("post", "adds", driver, paramstring);

	// 	if (task) {

	// 		task.query = query;

	// 	} else {

	// 		// const current = this.adds.get(driver, paramstring) || this.queries.get(driver, paramstring);
	// 		// const current = this.states.get("queries", driver, paramstring) || this.queries.get(driver, paramstring);

	// 		const current = this.getQuery(driver, paramstring);
	// 		const currentCount = this.getCount(driver, paramstring);

	// 		if (!current) {

	// 			console.error("setting query but query is not loaded");

	// 		}

	// 		this.tasks.set({ query, current, count, currentCount }, "post", "adds", driver, paramstring);

	// 	}

	// 	this.states.set(query, "queries", driver, paramstring);
	// 	this.states.set(count, "count", driver, paramstring);

	// }

	// static async updateQuery() {

	// 	const tasks = this.tasks.get("post", "adds");

	// 	if (tasks) {

	// 		for (let driver in tasks) {

	// 			for (let paramstring in tasks[driver]) {

	// 				const { query, current } = tasks[driver][paramstring];

	// 				// await this.transformQuery(query, current, driver, paramstring);

	// 				await this.transform(query, current, "queries", driver, paramstring);

	// 			}

	// 		}

	// 		this.needRender = true;
	// 		this.tasks.remove("post", "adds");

	// 	}

	// }

	// static removeQuery(driver, paramstring) {

	// 	this.setQuery(null, driver, paramstring);

	// }

	static upload(file, driver , id) {

		this.uploads.set(file, driver, id);

	}

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



	static getValue(driver, id, key, paramstring) {

		if (!id) {

			console.warn("setting value but id is empty");
			return [];

		}

		if (!key) {

			console.warn("setting value but key is empty");
			return [];

		}

		if (key === "id") {

			if (typeof id !== "symbol") {

				return [id];

			}

		} else if (typeof id === "symbol") { // -> object to be added

			return this.tempVars.get(driver, id, key);

		} else if (typeof id === "object") { // -> object to be added ... DEPRECATED

			return id[key] || [];

		} else {

			key = this.getAlias(driver, key);

			let value = this.tasks.get("post", "value", driver, id, key) || this.states.get("vars", driver, id, key) || this.vars.get(driver, id, key);

			if (!value) {

				const task = this.tasks.get("get", "value", driver, id, key);

				if (!task) {

					this.tasks.set({ paramstring }, "get", "value", driver, id, key);

				}

			}

			return value;

		}

	}

	static async requestValue(driver, id, key, paramstring) {

		let value = this.states.get("vars", driver, id, key);

		if (!value) {

			value = this.vars.get(driver, id, key);

			while (!value) {

				const query = await this.fetchMore(driver, paramstring);

				value = this.vars.get(driver, id, key);

				if (!value && query && query.complete) {

					value = [];

					this.vars.set(value, driver, id, key);

				}

			}

		}

		// this.needRender = true;

		return value;

	}


	static async initValue() {

		const task = this.tasks.get("get", "value");

		if (task) {

			for (let driver in task) {

				for (let id in task[driver]) {

					for (let key in task[driver][id]) {

						let paramstring = task[driver][id][key].paramstring;

						if (paramstring === undefined) { // -> paramstring may be empty

							paramstring = `ids=${Object.keys(task[driver]).join(",")}`;

						}

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

		if (typeof id === "object") { // deprec

			console.error("deprecated!");

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
			// const count = query.count || 0;

			// this.setQuery({ count, ids }, driver, paramstring);
			this.setQuery({ ids }, driver, paramstring);

		} else if (typeof id === "symbol") {

			this.tempVars.set(value, driver, id, key);

		} else {

			this.tasks.set(value, "post", "value", driver, id, key);

			// const task = this.tasks.get("post", "value", driver, id, key);

			// if (task) {

			// 	task.value = value;

			// } else {

			// 	// const current = this.edits.get(driver, id, key);
			// 	const current = this.states.get("vars", driver, id, key) || this.vars.get(driver, id, key) || [];
			// 	this.tasks.set({ value, current }, "post", "value", driver, id, key);

			// }

			// this.states.set(value, "vars", driver, id, key);

		}

	}

	static async updateValue() {

		const task = this.tasks.get("post", "value");

		if (task) {

			for (let driver in task) {

				for (let id in task[driver]) {

					for (let key in task[driver][id]) {

						// let { value, current } = task[driver][id][key];

						const value = task[driver][id][key];
						const current = this.states.get("vars", driver, id, key) || this.vars.get(driver, id, key);

						if (!KarmaFieldsAlpha.Collection.equal(value, current)) {

							await this.transform(value, current, "vars", driver, id, key);

							this.states.set(value, "vars", driver, id, key);

						}

					}

				}

			}

			this.needRender = true; // -> just to update submit button + update post form

			this.tasks.remove("post", "value");

		}

	}

	static getOptionsList(driver, paramstring, keys = ["name"]) {

		const ids = this.getIds(driver, paramstring);

		if (ids) {

			const options = [];

			for (let i = 0; i < ids.length; i++) {

				for (let key of keys) {

					const value = this.getValue(driver, ids[i], key, paramstring);

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
		await this.doHistory();
		await this.doSubmit();

		// await this.updateState();
		// await this.updateQuery();
		await this.updateIds();
		await this.updateValue();


		await this.doUploadUrls();




		await this.initIds();
		await this.initValue();

		await this.doPromises();

		this.hasModifiedQueries = this.checkQueries();
		this.hasMofifiedVars = this.checkVars();

		this.tempo.clear();

	}

	static hasDownload() {

		const object = this.tasks.get("get");

		return object && Object.keys(object).length > 0 || false;

	}

	static hasUpload() {

		const object = this.tasks.get("post");

		return object && Object.keys(object).length > 0 || false;

	}

	static isLoading() {

		return this.tasks.has("get") && this.needRender;

	}



	static checkQueries() {

		const queries = this.states.get("ids");

		if (queries) {

			for (let driver in queries) {

				for (let paramstring in queries[driver]) {

					const ids = this.ids.get(driver, paramstring);

					if (ids === undefined || !KarmaFieldsAlpha.Collection.equal(ids, queries[driver][paramstring])) {

						return true;

					}

				}

			}

		}

		return false;

	}

	static checkVars() {

		const vars = this.states.get("vars");

		if (vars) {

			for (let driver in vars) {

				for (let id in vars[driver]) {

					for (let key in vars[driver][id]) {

						const value = this.vars.get(driver, id, key) || [];
						const stateValue = vars[driver][id][key];

						if (!KarmaFieldsAlpha.Collection.equal(value, stateValue)) {

							return true;

						}

					}

				}

			}

		}

		return false;

	}

	static hasEdits() {

		return this.hasMofifiedVars|| this.hasModifiedQueries;

	}

	// static hasPromise() {

	// 	return Object.keys(this.promises).length > 0;

	// }

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

	static addPromise(promise, key = "") {

		if (!key) {

			key = promise.toString();

		}

		this.tasks.set(promise, "promises", key);

	}

	// static async doPromise() {

	// 	if (this.hasPromise()) {

	// 		for (let key in this.promises) {

	// 			const callback = this.promises[key];

	// 			await callback(() => void delete this.promises[key]);

	// 		}

	// 		this.needRender = true;

	// 	}

	// }

	static async doPromises() {

		const promises = this.tasks.get("promises");

		if (promises) {

			for (let key in promises) {

				const promise = promises[key];

				await promise(() => void this.tasks.remove("promises", key));

				this.needRender = true;

			}

		}

	}


	static async fetchQuery(driver, paramstring, forceReload) {

		let query = this.queries.get(driver, paramstring) || {};

		if (!query.complete && !query.queried || forceReload) {

			const relations = this.getRelations(driver) || [];
			const idAlias = this.getAlias(driver, "id");

			const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}`, paramstring);

			const ids = [];

			if (results) {

				for (let result of results) {

					const id = result[idAlias];

					ids.push(id);

					for (let key in result) {

						this.vars.set([result[key]], driver, id, key);

					}

				}

				query.queried = true;
				query.complete = (relations.length === 0);

			} else { // -> http request failed, will retry next time

				query.fail = true;

			}

			this.queries.set(query, driver, paramstring);
			this.ids.set(ids, driver, paramstring);

		}

		return query;

	}

	// static async fetchCount(driver, paramstring, forceReload) {

	// 	// let query = this.queries.get(driver, paramstring) || {};

	// 	// if (query.count === undefined || forceReload) {

	// 	// 	query.count = await KarmaFieldsAlpha.HTTP.get(`count/${driver}`, paramstring) || 0;

	// 	// 	this.queries.set(query, driver, paramstring);

	// 	// }

	// 	const count = await KarmaFieldsAlpha.HTTP.get(`count/${driver}`, paramstring) || 0;

	// 	this.counts.set(count, driver, paramstring);


	// }

	static async fetchMore(driver, paramstring) {

		let query = this.queries.get(driver, paramstring);

		if (!query) {

			query = await this.fetchQuery(driver, paramstring);

			if (!query) {

				return;

			}

		}

		const ids = this.ids.get(driver, paramstring);

		if (!ids) {

			console.error("Fetching relations but ids is not set");

			return;

		}

		if (!query.relationIndex) {

			query.relationIndex = 0;

		}

		const relations = this.getRelations(driver) || [];

		if (query.relationIndex < relations.length) {

			const relation = relations[query.relationIndex];
			const max = 100;

			for (let j = 0; j < ids.length; j += max) {

				const paramstring = `ids=${ids.slice(j, j + max).join(",")}`;

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

							this.vars.set(dataset[id][key], driver, id, key);

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

	static async fetchModel(name) {

		const results = await KarmaFieldsAlpha.HTTP.get(`get/model/${name}`);

		if (results) {

			this.models.set(results, name);

		}

	}

	static async transform(value, current, ...path) {

		if (!KarmaFieldsAlpha.DeepObject.equal(value, current)) {

			const index = KarmaFieldsAlpha.History.getIndex();
			const session = KarmaFieldsAlpha.Session.getId();

			if (index > 0) {

				const lastState = await this.history.get(session, index - 1) || { session, index: index - 1, step: "start" };
				// const lastState = await this.history.get(session, index - 1) || {};

				const lastValue = KarmaFieldsAlpha.Collection.get(lastState, ...path);

				if (lastValue === undefined) { // -> lastValue may be null

					KarmaFieldsAlpha.Collection.set(lastState, current, ...path);

					// await this.history.set(lastState, session, index - 1);
					await this.history.put(lastState);

				}

				// const currentState = await this.history.get(session, index) || {};
				const currentState = await this.history.get(session, index) || { session, index };

				KarmaFieldsAlpha.Collection.set(currentState, value, ...path);

				// await this.history.set(currentState, session, index);
				await this.history.put({...currentState, step: KarmaFieldsAlpha.History.lastStep });

			}

		}

	}

	// need update!
	static uploadUrl(url, driver) {

		const token = this.createToken();

		this.tasks.set(url, "post", "url", driver, token);
		this.queries.remove(driver); // -> clean all driver queries

		this.setValue(["0"], driver, token, "trash");

		return token;

	}

	// need update!
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



	static getEdits() { // used by post

		return this.states.get("vars");

	}

	static getAdds() { // used by post

		return this.states.get("ids");

	}

	static submit() {

		this.tasks.set(true, "post", "submit");

	}

	static async doSubmit() {

		const submitTask = this.tasks.get("post", "submit");

		if (submitTask) {

			// const adds = this.states.get("queries");

			// if (adds) {

			// 	for (let driver in adds) {

			// 		for (let paramstring in adds[driver]) {

			// 			const query = adds[driver][paramstring];
			// 			const items = query.ids.filter(id => typeof id === "object");

			// 			if (items.length) {

			// 				await this.add(items, driver);

			// 			}

			// 		}

			// 		this.tasks.set(true, "reload", driver);

			// 	}

			// }



			const edits = this.states.get("vars");

			if (edits) {

				for (let driver in edits) {

					await this.send(driver, edits[driver]);

					// this.tasks.set(true, "reload", driver);
					await this.reloadQueries(driver);

				}

			}

			this.needRender = true;

			this.tasks.remove("post", "submit");

		}


		// const reloadTasks = this.tasks.get("reload");

		// if (reloadTasks) {

		// 	for (let driver in reloadTasks) {

		// 		await this.reloadQueries(driver);

		// 	}

		// 	this.needRender = true;

		// 	this.tasks.remove("reload");

		// }

	}

	// static async add(items, driver) {

	// 	for (let item of items) {

	// 		let id;

	// 		if (item.file) {

	// 			id = await KarmaFieldsAlpha.HTTP.upload(item.file); // -> parent and params need to be saved later

	// 			delete item.file;
	// 			delete item.filetype;
	// 			delete item.filename;

	// 		} else {

	// 			id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`);

	// 		}

	// 		id = id.toString();


	// 		// this.states.set([], "vars", driver, id, "trash");
	// 		// await this.transform([], ["1"], "vars", driver, id, "trash");
	// 		this.vars.set(["1"], driver, id, "trash");
	// 		this.setValue([], driver, id, "trash");

	// 		for (let key in item) {

	// 			// await this.vars.set([], driver, id, key);
	// 			// await this.write(item[key], driver, id, key);

	// 			// this.states.set(item[key], "vars", driver, id, key);

	// 			// await this.transform(item[key], [], "vars", driver, id, key);

	// 			this.setValue(item[key], driver, id, key);

	// 		}

	// 	}

	// }

	static async send(driver, data) {

		await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, data);

		for (let id in data) {

			for (let key in data[id]) {

				const value = data[id][key];

				// await this.vars.set(value, driver, id, key);
				this.vars.set(value, driver, id, key);

			}

		}

	}

	static async reloadQueries(driver) {

		const queries = this.queries.get(driver);

		if (queries) {

			for (let paramstring in queries) {

				const query = queries[paramstring];

				this.queries.remove(driver, paramstring);  // -> force reload do not reload relationships
				this.counts.remove(driver, paramstring);

				await this.fetchQuery(driver, paramstring, true);

				// if (freshQuery && !KarmaFieldsAlpha.Collection.equal(freshQuery.ids, query.ids)) {

				// 	this.setQuery({ ids: freshQuery.ids }, driver, paramstring);

				// }

			}

		}

	}


	static changeHistory() {

		// const index = this.getIndex();
		// const current = KarmaFieldsAlpha.History.current;

		// this.tasks.set({ index, current }, "get", "history");

	}

	static getState(...path) {

		const state = history.state || {};

		if (path.length) {

			return KarmaFieldsAlpha.Collection.get(state, ...path);

		}

		return state;

	}

	static setState(value, ...path) {

		const state = this.getState();

		KarmaFieldsAlpha.Collection.set(state, value, ...path);

		history.replaceState(state, "");

	}

	static removeState(...path) {

		const state = this.getState();

		KarmaFieldsAlpha.Collection.remove(state, ...path);

		history.replaceState(state, "");

	}

	static saveHistory(id, name) {

		const index = this.getState("index") || 0;

		if (!id || this.lastId !== id) {

			this.lastId = id;
			// this.lastStep = name || id || "n/a";

			// this.setIndex(index + 1);

			this.setState(name || id || "", "historyName");

			const state = this.getState();

			KarmaFieldsAlpha.Collection.set(state, index + 1, "index");
			KarmaFieldsAlpha.Collection.set(state, index + 1, "historyName");

			history.pushState(state, "");

			KarmaFieldsAlpha.Session.setValue(index + 1, "history-max");

			this.tasks.set(true, "history", "save");

		}

	}

	static async doHistory() {

		const index = this.getState("index") || 0;

		if (typeof index === "string") {
			console.error("index must be integer");
		}

		const session = KarmaFieldsAlpha.Session.getId();
		let current = KarmaFieldsAlpha.Session.getValue("history-index");
		current = parseInt(current || 0);

		// on save -> erase existing next steps in history
		const saveTask = this.tasks.get("history", "save");

		if (saveTask) {

			await this.history.delete(state => state.session !== session || state.index >= index);

			KarmaFieldsAlpha.Session.setValue(index, "history-max");

			this.tasks.remove("history", "save");

		}

		if (current !== index) {

			while (current !== index) {

				if (current > index) {

					current--;

				} else {

					current++;

				}

				const states = await this.history.get(session, current);

				this.states.assign(states);

			}

			KarmaFieldsAlpha.Session.setValue(current, "history-index");

			delete this.lastId;

			this.needRender = true;



		}

		// const step = this.tasks.get("history", "step");

		// if (step) {

		// 	const session = KarmaFieldsAlpha.Session.getId();
		// 	const index = KarmaFieldsAlpha.History.current

		// 	const value = await this.history.get(session, index);

		// 	await this.history.put({ session, index, value, step });

		// 	this.tasks.remove("history", "step");
		// }

	}

}
