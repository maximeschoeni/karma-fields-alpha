

KarmaFieldsAlpha.Server = class {

	constructor() {

		this.token = -1;
		this.store = new KarmaFieldsAlpha.Collection("store", ["section"]);
		this.tasks = new KarmaFieldsAlpha.Collection("tasks", ["type"]);
		this.orders = {};
		this.requests = {};
		// this.edits = {};
		this.tempo = new KarmaFieldsAlpha.Collection("tempo");

		this.vars = new KarmaFieldsAlpha.Database("vars", ["driver", "id", "key"]);
		this.fields = new KarmaFieldsAlpha.Database("fields", ["fieldId", "key"]);
		this.edits = new KarmaFieldsAlpha.Database("edits", ["driver", "id", "key"]);
		this.queries = new KarmaFieldsAlpha.Collection("queries", ["driver", "paramstring"]);

		this.needRender = true;

	}

	// get(...path) {

	// 	KarmaFieldsAlpha.DeepObject.get(this, ...path);

	// }

	// set(value, ...path) {

	// 	const current = this.get(...path);

	// 	if (!KarmaFieldsAlpha.DeepObject.equal(value, current)) {

	// 		KarmaFieldsAlpha.DeepObject.set(this, value, ...path);
	// 		this.needRender = true;

	// 	}

	// }

	// remove(...path) {

	// 	const current = this.get(...path);

	// 	if (current === undefined) {

	// 		KarmaFieldsAlpha.DeepObject.remove(value, ...path);
	// 		this.needRender = true;

	// 	}

	// }

	getData(...path) {

		return this.store.get("data", ...path);

	}

	setData(value, ...path) {

		this.store.set(value, "data", ...path);

	}

	getTempo(...path) {

		return this.tempo.get(...path);

	}

	setTempo(value, ...path) {

		this.tempo.set(value, ...path);

	}

	removeTempo(...path) {

		this.tempo.remove(...path);

	}







	// getQuery(fieldId) {

	// 	const response = new KarmaFieldsAlpha.Content();

	// 	const query = KarmaFieldsAlpha.DeepObject.get(this.store, "query", fieldId);

	// 	if (query) {

	// 		response.value = query;

	// 	} else {

	// 		response.loading = true;
	// 		response.requested = KarmaFieldsAlpha.DeepObject.has(this.requests, "query", fieldId);

	// 	}

	// 	return response;

	// }

	// requestQuery(fieldId, driver, params) {

	// 	KarmaFieldsAlpha.DeepObject.set(this.requests, {driver, params}, "query", fieldId);

	// }

	// async initQuery() {

	// 	if (this.requests.query) {

	// 		for (let fieldId in this.requests.query) {

	// 			let query = await KarmaFieldsAlpha.Database.States.get("internal", "fields", fieldId, "query");

	// 			if (!query) {

	// 				const {params, driver} = this.requests.query[fieldId];

	// 				const paramstring = KarmaFieldsAlpha.Params.stringify(params);

	// 				let ids = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);

	// 				if (!ids) {

	// 					ids = await this.fetchIds(driver, paramstring);

	// 					await KarmaFieldsAlpha.Database.Queries.set(ids, "query", driver, paramstring);

	// 				}

	// 				query = { ids, driver, params, paramstring };

	// 			}

	// 			KarmaFieldsAlpha.DeepObject.set(this.store, query, "query", fieldId);

	// 		}

	// 		this.requests.query = null;

	// 	}

	// }

	// setQuery(fieldId, driver, newParams) {

	// 	const currentQuery = KarmaFieldsAlpha.DeepObject.get(this.store, "query", fieldId);

	// 	if (!currentQuery) {

	// 		console.error("setting query before initialising!");

	// 	}

	// 	KarmaFieldsAlpha.DeepObject.set(this.orders, {driver, newParams, currentQuery}, "query", fieldId);

	// }

	// async updateQuery() {

	// 	if (this.orders.query) {

	// 		for (let fieldId in this.orders.query) {

	// 			const { driver, newParams, currentQuery } = this.orders.query[fieldId];

	// 			const paramstring = KarmaFieldsAlpha.Params.stringify(newParams);

	// 			let ids = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);

	// 			if (!ids) {

	// 				ids = await this.fetchIds(driver, paramstring);

	// 				await KarmaFieldsAlpha.Database.Queries.set(ids, "query", driver, paramstring);

	// 			}

	// 			const newQuery = { driver, paramstring, params: newParams, ids };

	// 			await this.transform(newQuery, fieldId, "query");


	// 			await KarmaFieldsAlpha.Database.States.set(newQuery, "internal", "fields", fieldId, "query");
	// 			await KarmaFieldsAlpha.History.write(newQuery, currentQuery, "internal", "fields", fieldId, "query");

	// 			KarmaFieldsAlpha.DeepObject.set(this.store, newQuery, "query", fieldId);

	// 			this.needRender = true;

	// 		}

	// 	}

	// }

	// getValue(driver, id, key) {

	// 	const response = new KarmaFieldsAlpha.Content();

	// 	if (key === "id") {

	// 		response.value = id;

	// 	} else {

	// 		key = KarmaFieldsAlpha.Driver.getAlias(driver, key);

	// 		response.value = KarmaFieldsAlpha.DeepObject.get(this.store, "vars", driver, id, key);

	// 		if (!response.value) {

	// 			response.loading = true;

	// 			response.requested = KarmaFieldsAlpha.DeepObject.has(this.requests, "vars", driver, id, key);

	// 		}

	// 	}

	// 	return response;
	// }

	// getQuery(fieldId, driver, paramstring) {

	// 	let query = this.getState(fieldId, "query") || this.store.get("query", driver, paramstring);

	// 	if (query === undefined) {

	// 		// KarmaFieldsAlpha.DeepObject.set(this.requests, true, "query", driver, paramstring);
	// 		this.tasks.set(true, "initQuery", driver, paramstring);

	// 	}

	// 	return query;

	// }


	getQuery(driver, paramstring) {

		// should be moved from buffer?
		// const query = this.store.get("query", driver, paramstring);
		const query = this.queries.get(driver, paramstring);

		if (query === undefined || query.stalled) {

			this.tasks.set(true, "get", "query", driver, paramstring);

		}

		return query;
	}

	// createQuery(value, driver, paramstring) {

	// 	this.tasks.set(true, "initQuery", driver, paramstring);

	// }

	async initQuery() {

		const task = this.tasks.get("get", "query");

		if (task) {

			for (let driver in task) {

				for (let paramstring in task[driver]) {

					await this.fetchQuery(driver, paramstring, true);
					await this.fetchCount(driver, paramstring, true);

				}

			}

			this.tasks.remove("get", "query");

		}

	}

	setQuery(query, driver, paramstring) {

		this.queries.set(query, driver, paramstring);

	}

	removeQuery(driver, paramstring) {

		this.queries.remove(driver, paramstring);

	}

	// async updateQuery() {

	// 	if (this.orders.reloadQuery) {

	// 		const queries = this.get("store", "query");

	// 		for (let driver in queries) {

	// 			for (let paramstring in queries[driver]) {

	// 				await this.fetchQuery(driver, paramstring);

	// 			}

	// 		}

	// 		this.requests.reloadQuery = null;

	// 	}

	// }


	getValue(driver, id, key, paramstring = "") {

		if (key === "id") {

			return [id];

		} else {

			key = KarmaFieldsAlpha.Driver.getAlias(driver, key);

			const value = this.store.get("vars", driver, id, key);

			if (!value) {

				this.tasks.set(paramstring, "get", "value", driver, id, key);

			}

			return value;

		}

	}

	promiseValue(driver, id, key) {

		let task = this.tasks.get("get", "valuePromise", driver, id, key);

		if (!task) {

			task = [];

		}

		const promise = new Promise(resolve => void task.push(resolve));

		this.tasks.set(task, "get", "valuePromise", driver, id, key);

		return promise;

	}

	doPromiseValue() {

		const tasks = this.tasks.query({ method: "post", name: "valuePromise" }, ["method", "name", "driver", "id", "key"]);

		for (let task of [...tasks]) {

			const value = this.getValue(task.driver, task.id, task.key);

			if (value !== undefined) {

				for (let resolve of task.value) {

					resolve(value);

				}

				this.tasks.remove("post", "valuePromise", task.driver, task.id, task.key);

			}

		}

	}

	// getValueAt(query, index, key) {

	// 	const response = new KarmaFieldsAlpha.Content();
	// 	const id = query.ids[index];

	// 	if (!id) {

	// 		console.error("index out of bounds");

	// 	}

	// 	if (key === "id") {

	// 		response.value = id;

	// 	} else {

	// 		key = KarmaFieldsAlpha.Driver.getAlias(driver, key);

	// 		response.value = KarmaFieldsAlpha.DeepObject.get(this.store, "vars", driver, id, key);

	// 		if (!response.value) {

	// 			response.loading = true;

	// 			// response.requested = KarmaFieldsAlpha.DeepObject.has(this.orders, "varsAt", query.driver, query.paramstring, index, key);
	// 			response.requested = KarmaFieldsAlpha.DeepObject.has(this.requests, "vars", query.driver, id, key);

	// 		}

	// 	}

	// 	return response;

	// }

	getValueAt(driver, paramstring, index, key) {

		// let query = this.store.get("query", driver, paramstring);
		let query = this.queries.get(driver, paramstring);

		if (query) {

			const id = query.ids[index];

			if (!id) {

				console.error("index out of bounds");

			}

			if (key === "id") {

				return [id];

			} else {

				key = KarmaFieldsAlpha.Driver.getAlias(driver, key);

				const value = this.store.get("vars", driver, id, key);

				if (!value && typeof id !== "symbol") {

					this.tasks.set(paramstring, "get", "value", driver, id, key);

				}

			}

		} else {

			this.tasks.set(true, "get", "query", driver, paramstring);

		}

	}

	// requestValueAt(query, index, key) {

	// 	const { driver, paramstring, ids } = query;

	// 	const id = ids[index];

	// 	if (!id) {

	// 		console.error("index out of bounds");

	// 	}

	// 	if (typeof id !== "symbol") {

	// 		KarmaFieldsAlpha.DeepObject.set(this.requests, {paramstring}, "vars", driver, id, key);

	// 	}

	// }

	async requestValue(driver, id, key, paramstring) {

		let value = await this.edits.get(driver, id, key);

		if (!value) {

			value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

			while (!value) {

				const query = await this.fetchMore(driver, paramstring);

				if (query.complete) {

					value = [];

				} else {

					value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

				}

			}

		}

		this.store.set(value, "vars", driver, id, key);

		return value;

	}

	// // not used
	// async initValueAt() {

	// 	if (this.requests.valueAt) {

	// 		for (let driver in this.requests.valueAt) {

	// 			for (let paramstring in this.requests.valueAt[driver]) {

	// 				let ids = await KarmaFieldsAlpha.Database.States.get("queries", driver, paramstring, "ids");

	// 				// -> should be:
	// 				// let ids = await KarmaFieldsAlpha.Database.States.get("internal", "fields", fieldId, "ids");

	// 				if (!ids) {

	// 					ids = await this.fetchIds(driver, paramstring);

	// 				}

	// 				for (let id of ids) {

	// 					for (let key in this.requests.valueAt[driver][paramstring]) {

	// 						let value = await KarmaFieldsAlpha.Database.States.get("external", driver, id, key);

	// 						if (!value) {

	// 							value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

	// 							while (!value) {

	// 								const query = await this.fetchMore(driver, paramstring);

	// 								if (query.complete) {

	// 									value = [];

	// 								} else {

	// 									value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

	// 								}

	// 							}

	// 						}

	// 						KarmaFieldsAlpha.DeepObject.set(this.store, value, "vars", driver, id, key);

	// 					}

	// 				}

	// 			}

	// 		}

	// 		this.requests.valueAt = null;

	// 	}

	// }



	async initValue() {

		const task = this.tasks.get("get", "value");

		if (task) {

			for (let driver in task) {

				for (let id in task[driver]) {

					for (let key in task[driver][id]) {

						const paramstring = task[driver][id][key] || `ids=${Object.keys(task[driver]).join(",")}`;

						await this.requestValue(driver, id, key, paramstring);

						// let value = await this.edits.get(driver, id, key);

						// if (!value) {

						// 	value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

						// 	while (!value) {

						// 		const paramstring = task[driver][id][key] || `ids=${Object.keys(task[driver]).join(",")}`;

						// 		const query = await this.fetchMore(driver, paramstring);

						// 		if (query.complete) {

						// 			value = [];

						// 		} else {

						// 			value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

						// 		}

						// 	}

						// }

						// this.store.set(value, "vars", driver, id, key);

					}

				}

			}

			this.tasks.remove("get", "value");

		}

	}

	setValue(value, driver, id, key) {

		if (!Array.isArray(value)) {

			console.error("value must be an array!");

		}

		key = KarmaFieldsAlpha.Driver.getAlias(driver, key);

		// const current = KarmaFieldsAlpha.DeepObject.get(this.store, "vars", query.driver, id, key);

		this.store.set(value, "vars", driver, id, key);

		if (typeof id !== "symbol") {

			this.tasks.set(value, "post", "value", driver, id, key);

		}

	}

	async updateValue() {

		const task = this.tasks.get("post", "value");

		if (task) {

			for (let driver in task) {

				for (let id in task[driver]) {

					for (let key in task[driver][id]) {

						// const current = orders[driver][id][key].current;
						const value = task[driver][id][key];

						// if (!current) { // -> in case the value was not loaded

						// 	// -> should fetch value
						// 	// await this.fetchValues(driver, Object.keys(orders[driver]), Object.keys(orders[driver][id]));

						// 	// -> but all values should be loaded yet!
						// 	current = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

						// 	// -> or just
						// 	// current = [];

						// 	// -> or
						// 	if (!current) {
						// 		console.error("value is edited but has not loaded yet!");
						// 	}

						// }

						// KarmaFieldsAlpha.DeepObject.set(this.orders, value, "delta", driver, id, key);

						await this.write(value, driver, id, key);
						// await KarmaFieldsAlpha.Database.States.set(value, "external", driver, id, key);
						// await KarmaFieldsAlpha.History.write(value, current, "external", driver, id, key); // update history


						// const currentEdit = KarmaFieldsAlpha.DeepObject.get(this.edits, driver, id, key);
						// const original = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

						// if (!KarmaFieldsAlpha.DeepObject.equal(value, original)) {

						// 	KarmaFieldsAlpha.DeepObject.set(this.edits, value, driver, id, key);

						// } else if (KarmaFieldsAlpha.DeepObject.has(this.edits, driver, id, key)) {

						// 	KarmaFieldsAlpha.DeepObject.remove(this.edits, driver, id, key);

						// }

						// await KarmaFieldsAlpha.History.write(value, currentEdit, "edits", driver, id, key); // update history




					}

				}

			}

			this.tasks.remove("post", "value");

		}

	}






	// getParams(fieldId) {

	// 	const response = new KarmaFieldsAlpha.Content();

	// 	const params = KarmaFieldsAlpha.DeepObject.get(this.store, "state", fieldId, "params");

	// 	if (params) {

	// 		response.params = params;

	// 	} else {

	// 		response.loading = true;
	// 		response.requested = KarmaFieldsAlpha.DeepObject.has(this.requests, "state", fieldId, "params");

	// 	}

	// 	return response;
	// }

	// requestParams(fieldId, params) {

	// 	KarmaFieldsAlpha.DeepObject.set(this.requests, params, "state", fieldId, "params");

	// }

	// getIds(fieldId) {

	// 	const response = new KarmaFieldsAlpha.Content();

	// 	const ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", fieldId);

	// 	if (ids) {

	// 		response.ids = ids;

	// 	} else {

	// 		const request = KarmaFieldsAlpha.DeepObject.get(this.requests, "ids", fieldId);

	// 		if (request) {

	// 			response.requested = true;

	// 		}

	// 		response.loading = true;

	// 	}

	// 	return response;
	// }

	// requestIds(fieldId, driver, params) {

	// 	KarmaFieldsAlpha.DeepObject.set(this.requests, {driver, params}, "ids", fieldId);

	// }

	// async initIds(request) {

	// 	for (let fieldId in request) {

	// 		const {params, driver} = request[fieldId];

	// 		const paramstring = KarmaFieldsAlpha.Params.stringify(params);

	// 		let ids = await KarmaFieldsAlpha.Database.States.get("queries", driver, paramstring, "ids");

	// 		if (!ids) {

	// 			let query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);

	// 			if (!query) {

	// 				query = { driver, paramstring, type: "query" }

	// 				const result = await this.fetch(query).next();

	// 				query = result.value;

	// 			}

	// 			ids = query.queriedIds || [];

	// 		}

	// 		KarmaFieldsAlpha.DeepObject.set(this.store, ids, "ids", fieldId);

	// 	}

	// }

	// setParams(value, fieldId) {

	// 	const current = KarmaFieldsAlpha.DeepObject.get(this.store, "fields", fieldId, "params");

	// 	KarmaFieldsAlpha.DeepObject.set(this.store, {...current, ...value}, "state", fieldId, key);

	// 	KarmaFieldsAlpha.DeepObject.set(this.orders, value, "editState", fieldId, key);



	// }

	// queryParamstring(fieldId, defaults = {}) {

	// 	const response = new KarmaFieldsAlpha.Content();

	// 	response.value = KarmaFieldsAlpha.DeepObject.get(this.store, "data", "fields", fieldId, "paramstring");

	// 	if (response.value === undefined) {

	// 		response.loading = true;

	// 		KarmaFieldsAlpha.DeepObject.set(this.orders, {driver, defaults}, "state", fieldId);

	// 	}

	// 	return response;

	// }

	getState(fieldId, key) {

		return this.store.get("fields", fieldId, key);

		// const response = new KarmaFieldsAlpha.Content();

		// response.value = KarmaFieldsAlpha.DeepObject.get(this.store, "state", fieldId, key);

		// if (response.value === undefined) {

		// 	response.loading = true;

		// 	// response.requested = KarmaFieldsAlpha.DeepObject.has(this.requests, "state", fieldId, key);

		// }

		// return response;
	}

	// deprec
	// requestState(fieldId, key, defaults = {}) {

	// 	KarmaFieldsAlpha.DeepObject.set(this.requests, defaults, "fields", fieldId, key);

	// }

	createState(value, fieldId, key) {

		// KarmaFieldsAlpha.DeepObject.set(this.requests, value, "state", fieldId, key);

		this.store.set(value, "fields", fieldId, key);
		// this.tasks.set(value, "initState", fieldId, key);

	}

	// actually useless!
	async initState() {

		const task = this.tasks.get("get", "state");

		if (task) {

			for (let fieldId in task) {

				for (let key in task[fieldId]) {

					// let state = await KarmaFieldsAlpha.Database.States.get("internal", "fields", fieldId, key);

					// let state = await this.fields.get(fieldId, key);

					// if (!state) {

					// 	state = this.requests.state[fieldId][key];

					// 	// await KarmaFieldsAlpha.Database.States.set(state, "internal", "fields", fieldId, key);

					// 	await this.fields.set(state, fieldId, key);

					// }

					state = this.requests.state[fieldId][key];

					// KarmaFieldsAlpha.DeepObject.set(this.store, state || this.requests.state[fieldId][key], "state", fieldId, key);
					this.store.set(state, "fields", fieldId, key);

				}

			}

			this.needRender = true;
			this.tasks.remove("initState");

		}

	}

	// async processState() {

	// 	const orders = KarmaFieldsAlpha.DeepObject.get(this.orders, "state");

	// 	if (orders) {

	// 		for (let fieldId in orders) {

	// 			for (let key in orders[fieldId]) {

	// 				const state = await KarmaFieldsAlpha.Database.States.get("internal", "fields", fieldId, key);

	// 				KarmaFieldsAlpha.DeepObject.set(this.store, state || orders[fieldId][key], "state", fieldId, key);

	// 			}

	// 		}

	// 		this.needRender = true;
	// 		KarmaFieldsAlpha.DeepObject.remove(this.orders, "state");

	// 	}

	// }
	 // value is an Object
	setState(value, fieldId, key) {

		if (value.constructor !== Object && value !== null) {

			console.error("state must be an object");

		}

		const current = this.store.get("fields", fieldId, key) || null;

		// if (!current) {

		// 	console.error("setting state but state is not defined");

		// 	current = {}; // -> maybe its ok

		// }

		// const current = KarmaFieldsAlpha.DeepObject.get(this.requests, "state", fieldId, key);

		this.store.set(value, "fields", fieldId, key);
		this.tasks.set({ value, current }, "post", "state", fieldId, key);

	}

	// -> used to remove "query" state which holds added/removed ids
	removeState(fieldId, key) {

		const current = this.store.get("fields", fieldId, key);

		if (current) {

			// -> maybe should not remove state now?(we may need to keep ids until next process)
			// will cause a blank screen
			this.store.set(value, "fields", fieldId, key);

			this.tasks.set({ value: null, current }, "post", "state", fieldId, key);

		}

	}

	async updateState() {

		const task = this.tasks.get("post", "state");

		if (task) {

			for (let fieldId in task) {

				for (let key in task[fieldId]) {

					const {value, current} = task[fieldId][key];

					await this.transformState(value, current, fieldId, key);

				}

			}

			// this.needRender = true;
			this.tasks.remove("post", "state");

		}

	}

	// async processEditState() {

	// 	const orders = KarmaFieldsAlpha.DeepObject.get(this.orders, "editState");

	// 	if (orders) {

	// 		for (let fieldId in orders) {

	// 			for (let key in orders[fieldId]) {

	// 				const currentState = await KarmaFieldsAlpha.Database.States.get("internal", "fields", fieldId, key);
	// 				const newState = { ...currentState, ...orders[fieldId][key] };

	// 				await KarmaFieldsAlpha.Database.States.set(newState, "internal", "fields", fieldId, key);
	// 				await KarmaFieldsAlpha.History.write(newState, currentState, "internal", "fields", fieldId, key); // update history

	// 				KarmaFieldsAlpha.DeepObject.set(this.store, newState, "state", fieldId, key);

	// 			}

	// 		}

	// 		this.needRender = true;
	// 		KarmaFieldsAlpha.DeepObject.remove(this.orders, "editState");

	// 	}

	// }

	// queryIds(fieldId, driver, defaults = {}) {

	// 	const response = new KarmaFieldsAlpha.Content();

	// 	response.value = KarmaFieldsAlpha.DeepObject.get(this.store, "state", fieldId, "ids");

	// 	if (response.value === undefined) {

	// 		KarmaFieldsAlpha.DeepObject.set(this.orders, defaults, "state", fieldId, "params");
	// 		KarmaFieldsAlpha.DeepObject.set(this.orders, driver, "ids", fieldId);

	// 	}

	// 	return response;

	// }

	// async processIds() {

	// }

	// async processParams() {

	// 	const orders = KarmaFieldsAlpha.DeepObject.get(this.orders, "state");

	// 	if (orders) {




	// 				for (let fieldId in orders) {

	// 					const currentParams = await KarmaFieldsAlpha.Database.States.get("internal", "fields", fieldId, "params");
	// 					const currentParamstring = await KarmaFieldsAlpha.Database.States.get("internal", "fields", fieldId, "paramstring");
	// 					const currentIds = await KarmaFieldsAlpha.Database.States.get("internal", "fields", fieldId, "ids");



	// 					const { driver, defaults, params, ids, paramstring } = orders[fieldId];

	// 					// const currentParams = KarmaFieldsAlpha.DeepObject.get(this.store, "state", fieldId, "params");
	// 					const params = {...defaults, ...currentParams, ...newParams};
	// 					const paramstring = KarmaFieldsAlpha.Params.stringify(params);

	// 					KarmaFieldsAlpha.DeepObject.set(this.store, paramstring, "state", fieldId, "paramstring");

	// 					let query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);

	// 					if (!query) {

	// 						query = { driver, paramstring, type: "query" };

	// 						const result = await this.fetch(query).next();

	// 						query = result.value;

	// 					}

	// 					// const delta = await KarmaFieldsAlpha.Database.States.get("queries", driver, paramstring, "ids");

	// 					// const ids = delta || query.queriedIds || [];

	// 					const ids = query.queriedIds || [];

	// 					KarmaFieldsAlpha.DeepObject.set(this.store, ids, "state", fieldId, "ids");

	// 					await KarmaFieldsAlpha.Database.States.set(params, "internal", "fields", fieldId, "params");
	// 					await KarmaFieldsAlpha.Database.States.set(paramstring, "internal", "fields", fieldId, "paramstring");
	// 					await KarmaFieldsAlpha.Database.States.set(ids, "internal", "fields", fieldId, "ids");

	// 					await KarmaFieldsAlpha.History.write(ids, current, "internal", "fields", fieldId, "ids"); // update history
	// 					await KarmaFieldsAlpha.History.write(ids, current, "internal", "fields", fieldId, "ids"); // update history
	// 					await KarmaFieldsAlpha.History.write(ids, current, "internal", "fields", fieldId, "ids"); // update history



	// 					// await KarmaFieldsAlpha.History.write(ids, current, "queries", driver, paramstring, "ids"); // update history



	// 				}

	// 			// }

	// 		// } else if (orders.change) {

	// 		// 	if (orders.change.fields) {

	// 		// 		for (let fieldId in orders.change.fields) {

	// 		// 			for (let key in orders.change.fields[fieldId].params) {
	// 		// 				const value = KarmaFieldsAlpha.DeepObject.get(this.orders, "state", "change", "fields", fieldId, "params", key);
	// 		// 				const current = KarmaFieldsAlpha.DeepObject.get(this.store, "state", "fields", fieldId, key);
	// 		// 				KarmaFieldsAlpha.DeepObject.set(this.store, value, "state", "fields", id, key);
	// 		// 				await KarmaFieldsAlpha.Database.States.set(value, "internal", "fields", id, key);
	// 		// 				await KarmaFieldsAlpha.History.write(value, current, "internal", "fields", id, key);

	// 		// 			}

	// 		// 		}

	// 		// 	}

	// 		// }

	// 	}

	// }

	// changeQuery(fieldId, driver, params) {

	// 	KarmaFieldsAlpha.DeepObject.set(this.orders, params, "editState", fieldId, "params");
	// 	KarmaFieldsAlpha.DeepObject.set(this.orders, driver, "changeIds", fieldId);

	// }

	// async processChangeQuery() {

	// 	const orders = KarmaFieldsAlpha.DeepObject.get(this.orders, "changeIds");

	// 	if (orders) {

	// 		for (let fieldId in orders) {

	// 			const params = KarmaFieldsAlpha.DeepObject.get(this.store, "state", fieldId, "params");

	// 			if (params) {

	// 				const driver = orders[fieldId];
	// 				const paramstring = KarmaFieldsAlpha.Params.stringify(params);

	// 				let query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);

	// 				if (!query) {

	// 					query = { driver, paramstring, type: "query" }

	// 					const result = await this.fetch(query).next();

	// 					query = result.value;

	// 				}

	// 				const currentIds = await KarmaFieldsAlpha.Database.States.get("internal", "fields", fieldId, "ids") || [];

	// 				await KarmaFieldsAlpha.Database.States.set(newState, "internal", "fields", fieldId, key);
	// 				await KarmaFieldsAlpha.History.write(newState, currentState, "internal", "fields", fieldId, key); // update history

	// 				KarmaFieldsAlpha.DeepObject.set(this.store, newState, "state", fieldId, key);


	// 			}


	// 		}

	// 		this.needRender = true;
	// 		KarmaFieldsAlpha.DeepObject.remove(this.orders, "editState");

	// 	}

	// }

 //  async setState(value, driver, id, key) {

 //    const current = KarmaFieldsAlpha.DeepObject.get(this.store, "state", driver, id, key);

 //    KarmaFieldsAlpha.DeepObject.set(this.store, value, "state", driver, id, key);

 //    await KarmaFieldsAlpha.Database.States.set(value, "internal", driver, id, key);
 //    await KarmaFieldsAlpha.History.write(value, current, "internal", driver, id, key); // update history

 //  }

 //  // async updateState(value, driver, id, key) {
 //  //
 //  //   KarmaFieldsAlpha.DeepObject.set(this.store, value, "state", driver, id, key);
 //  //
 //  // }

 //  async removeState(driver, id, key) {

 //    // not used

 //    if (key) {

 //      return this.setState(null, driver, id, key)

 //    } else if (id) {

 //      const states = KarmaFieldsAlpha.DeepObject.get(this.store, "state", driver, id);

 //      for (let key in states) {

 //        return this.removeState(driver, id, key);
 //      }

 //    } else if (driver) {

 //      const states = KarmaFieldsAlpha.DeepObject.get(this.store, "state", driver);

 //      for (let id in states) {

 //        return this.removeState(driver, id);
 //      }

 //    } else {

 //      const states = KarmaFieldsAlpha.DeepObject.get(this.store, "state");

 //      for (let driver in states) {

 //        return this.removeState(driver);
 //      }

 //    }

 //  }

 //  async initStates() {

 //    const states = await KarmaFieldsAlpha.Database.States.select("internal");

 //    for (let state of states) {

 //      KarmaFieldsAlpha.DeepObject.set(this.store, state.data, "state", state.driver, state.id, state.key);

 //    }

 //  }



  // queryValue(driver, id, key) {

  //   const response = new KarmaFieldsAlpha.Content();

  //   key = KarmaFieldsAlpha.Driver.getAlias(driver, key);

  //   response.value = KarmaFieldsAlpha.DeepObject.get(this.store, "vars", driver, id, key);

  //   if (!response.value) {

  //     response.loading = true;

  //     if (typeof id !== "symbol") {

  //       this.orders.filled = true;

  //       KarmaFieldsAlpha.DeepObject.set(this.orders, true, "wild", driver, id, key);

  //     }

  //   }

  //   return response;
  // }

  // queryValueAt(driver, paramstring, index, key) {

  //   const response = new KarmaFieldsAlpha.Content();

  //   const ids = this.queryIds(driver, paramstring);

  //   if (ids.loading) {

  //     response.loading = true;

  //     this.orders.filled = true;

  //     KarmaFieldsAlpha.DeepObject.set(this.orders, true, "ids", driver, paramstring);

  //   } else {

  //     const id = ids.toArray()[index];

  //     if (id) {

  //       if (key === "id") {

  //         response.value = id;

  //       } else {

  //         key = KarmaFieldsAlpha.Driver.getAlias(driver, key);

  //         response.value = KarmaFieldsAlpha.DeepObject.get(this.store, "vars", driver, id, key);

  //         if (!response.value) {

  //           response.loading = true;

  //           if (typeof id !== "symbol") {

  //             this.orders.filled = true;

  //             KarmaFieldsAlpha.DeepObject.set(this.orders, true, "vars", driver, paramstring, key);

  //           }

  //         }

  //       }

  //     } else {

  //       response.outOfBounds = true;

  //     }

  //   }

  //   return response;
  // }

  // queryIds(driver, paramstring) {

  //   const response = new KarmaFieldsAlpha.Content();

  //   response.value = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

  //   if (!response.value) {

  //     response.loading = true;

  //     this.orders.filled = true;

  //     KarmaFieldsAlpha.DeepObject.set(this.orders, true, "ids", driver, paramstring);

  //   }

  //   return response;

  // }

// getCount(driver, paramstring) {

// 		const value = KarmaFieldsAlpha.DeepObject.get(this.store, "count", driver, paramstring);

// 		if (value === undefined) {

// 			KarmaFieldsAlpha.DeepObject.set(this.orders, true, "count", driver, paramstring);

// 		}

// 		return value;

// 	}

  // queryOptionsList(driver, paramstring, keys = ["name"]) {

  //   const response = new KarmaFieldsAlpha.Content();

  //   const query = this.queryIds(driver, paramstring);

  //   if (query.loading) {

  //     response.loading = true;

  //   } else {

  //     response.value = [];

  //     const ids = query.toArray();

  //     for (let i = 0; i < ids.length; i++) {

  //       const id = ids[i];
  //       const item = {id};

  //       for (let key of keys) {

  //         const content = this.queryValueAt(driver, paramstring, i, key);

  //         if (content.loading) {

  //           response.loading = true;

  //         } else {

  //           item[key] = content.toString();

  //         }

  //       }

  //       response.value.push(item);

  //     }

  //   }

  //   return response;

  // }

	getOptionsList(driver, paramstring, keys = ["name"]) {

		// const query = this.store.get("query", driver, paramstring);
		const query = this.getQuery(driver, paramstring);

		if (query) {

			const options = [];

			for (let i = 0; i < query.ids.length; i++) {

				for (let key of keys) {

					const value = this.getValueAt(driver, paramstring, i, key);

					if (!value) {

						return;

					}

					options.push({ id: ids[i], [key]: value[0] });

				}

			}

			return options;

		}

	}

	// async processIds() {

	// 	const orders = KarmaFieldsAlpha.DeepObject.get(this.orders, "ids", fieldId);

	// 	if (orders) {

	// 		for (let fieldId in orders) {

	// 			const params = KarmaFieldsAlpha.DeepObject.get(this.store, "state", fieldId, "params");

	// 			if (params) {

	// 				const driver = orders[fieldId];
	// 				const paramstring = KarmaFieldsAlpha.Params.stringify(params);

	// 				let query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);

	// 				if (!query) {

	// 					query = { driver, paramstring, type: "query" }

	// 					const result = await this.fetch(query).next();

	// 					query = result.value;

	// 				}

	// 				// const delta = await KarmaFieldsAlpha.Database.States.get("queries", driver, paramstring, "ids");

	// 				// const ids = delta || query.queriedIds || [];

	// 				const ids = query.queriedIds || [];
	// 				KarmaFieldsAlpha.DeepObject.set(this.store, ids, "ids", driver, paramstring);

	// 			}

	// 		}

	// 	}

	// }

 //  async processVars() {

 //    const orders = KarmaFieldsAlpha.DeepObject.get(this.orders, "vars");

 //    if (orders) {

 //      for (let driver in orders) {

 //        for (let paramstring in orders[driver]) {

 //          let query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);

 //          if (!query) {

 //            query = {driver, paramstring, type: "query"};

 //            // query = await this.fetchQuery({driver, paramstring, type: "query"});

 //            // query = await this.fetchQuery(driver, paramstring);

 //            const result = await this.fetch(query).next();

 //            query = result.value;

 //          }

 //          // const ids = query.queriedIds || [];

 //          let ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring) || query.queriedIds || [];

 //          ids = ids.filter(id => typeof id !== "symbol");

 //          for (let id of ids) {

 //            for (let key in orders[driver][paramstring]) {

 //              let value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

 //              while (!value) {

 //                if (query.complete) {

 //                  value = [];

 //                } else {

 //                  const next = await this.fetch(query).next();

 //                  query = next.value;

 //                  // query = await this.fetchRelation(driver, paramstring);
 //                  // // query = await this.fetchRelations(driver, paramstring).next();
 //                  value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

 //                }

 //              }

 //              const delta = await KarmaFieldsAlpha.Database.States.get("external", driver, id, key);

 //              KarmaFieldsAlpha.DeepObject.set(this.store, delta || value, "vars", driver, id, key);

 //            }

 //          }

 //        }

 //      }

 //    }

 //  }

 //  // async processWilds() {
 //  //
 //  //   const orders = KarmaFieldsAlpha.DeepObject.get(this.orders, "wild");
 //  //
 //  //   if (orders) {
 //  //
 //  //     for (let driver in orders) {
 //  //
 //  //       let query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, "");
 //  //
 //  //       if (!query || !query.requestedIds) {
 //  //
 //  //         query = {driver, paramstring: "", type: "query", requestedIds: new Set()};
 //  //
 //  //       }
 //  //
 //  //       for (let id in orders[driver]) {
 //  //
 //  //         for (let key in orders[driver][id]) {
 //  //
 //  //           let value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);
 //  //
 //  //           while (!value) {
 //  //
 //  //             if (query.complete && query.requestedIds.has(id)) {
 //  //
 //  //               value = [];
 //  //
 //  //             } else {
 //  //
 //  //               if (!query.requestedIds.has(id)) {
 //  //
 //  //                 query.requestedIds.add(id);
 //  //                 query.complete = false;
 //  //                 query.queried = false;
 //  //                 query.relationIndex = 0;
 //  //
 //  //                 // await KarmaFieldsAlpha.Database.Queries.set(query, "query");
 //  //
 //  //               }
 //  //
 //  //               const result = await this.fetch(query).next();
 //  //
 //  //               query = result.value;
 //  //
 //  //               // if (query.queried) {
 //  //               //
 //  //               //   query = await this.fetchQuery(driver, "");
 //  //               //
 //  //               // } else {
 //  //               //
 //  //               //   query = await this.fetchRelations(driver, "");
 //  //               //
 //  //               // }
 //  //
 //  //               value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);
 //  //
 //  //             }
 //  //
 //  //           }
 //  //
 //  //           const delta = await KarmaFieldsAlpha.Database.States.get("external", driver, id, key);
 //  //
 //  //           KarmaFieldsAlpha.DeepObject.set(this.store, delta || value, "vars", driver, id, key);
 //  //
 //  //         }
 //  //
 //  //       }
 //  //
 //  //
 //  //     }
 //  //
 //  //   }
 //  //
 //  // }

 //  async processWilds() {

 //    const orders = KarmaFieldsAlpha.DeepObject.get(this.orders, "wild");

 //    if (orders) {

 //      for (let driver in orders) {

 //        let query = await KarmaFieldsAlpha.Database.Queries.get("wild", driver, "");

 //        const ids = Object.keys(orders[driver]);

 //        if (!query || !query.requestedIds) {

 //          query = {driver, paramstring: "", type: "wild", requestedIds: new Set(ids)};

 //        }

 //        for (let id in orders[driver]) {

 //          for (let key in orders[driver][id]) {

 //            let value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

 //            while (!value) {

 //              if (query.complete && query.requestedIds.has(id)) {

 //                value = [];

 //              } else {

 //                // if (!query.requestedIds.has(id)) {
 //                //
 //                //   query.requestedIds.add(id);
 //                //   query.complete = false;
 //                //   query.queried = false;
 //                //   query.relationIndex = 0;
 //                //
 //                // }

 //                if (ids.some(id => !query.requestedIds.has(id))) {

 //                  query.requestedIds = new Set(ids);
 //                  query.complete = false;
 //                  query.queried = false;
 //                  query.relationIndex = 0;

 //                }

 //                await this.fetch(query).next();

 //                value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

 //              }

 //            }

 //            const delta = await KarmaFieldsAlpha.Database.States.get("external", driver, id, key);

 //            KarmaFieldsAlpha.DeepObject.set(this.store, delta || value, "vars", driver, id, key);

 //          }

 //        }


 //      }

 //    }

 //  }


	// async initCounts() {

	// 	// const orders = KarmaFieldsAlpha.DeepObject.get(this.orders, "count");

	// 	if (this.orders.count) {

	// 		for (let driver in this.orders.count) {

	// 			for (let paramstring in this.orders.count[driver]) {

	// 				// let query = await KarmaFieldsAlpha.Database.Queries.get("count", driver, paramstring);
	// 				let count = await KarmaFieldsAlpha.Database.queries.get(driver, paramstring, "count");

	// 				if (count === undefined) {

	// 					query = { type: "count", driver, paramstring };

	// 					await this.count(query);

	// 				}

	// 				KarmaFieldsAlpha.DeepObject.set(this.store, query.count || 0, "count", driver, paramstring);

	// 			}

	// 		}

	// 	}

	// }

  // async init() {

  //   await this.initStates();
  //   await this.initDelta();

  // }

	async process() {

		this.needRender = false;

		// await this.initState();


		await this.updateState();
		await this.updateQuery();
		await this.updateValue();

		await this.doAdd(); // -> or just do it when submit?
		// await this.doDelete();
		await this.doUploadUrls();
		await this.doUpload();

		await this.doSubmit();
		await this.doHistory();

		await this.initQuery();
		await this.initValue();

		this.doPromise();


		const hasEdits = this.edits.count() > 0;

		this.needRender ||= hasEdits !== this.store.get("hasEdits");

		this.store.set(hasEdits, "hasEdits");

		this.tempo.clear();

	}

	hasDownload() {

		return this.tasks.has("get");

		// return this.orders.ids || this.orders.vars || this.orders.wild || this.orders.count ? true : false;

	}

	hasUpload() {

		return this.tasks.has("post");

		// return this.orders.add || this.orders.upload || this.orders.submit ? true : false;

	}

	isLoading() {

		return this.tasks.has("get") && this.needRender;

	}

	hasEdits() {

		// return this.store.hasEdits;

		return this.store.has("edits");

	}

	hasPromise() {

		return this.tasks.has("get", "promise");

	}

	promise(callback) {

		if (!this.tasks.has("get", "promise")) {

			this.tasks.set(callback, "get", "promise");

			this.doPromise();

		}

	}

	doPromise() {

		let task = this.tasks.get("get", "promise");

		if (task) {

			task(() => void this.tasks.remove("get", "promise"));

			this.needRender = true;

		}

	}





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
  //         // await this.storeRelations(results);
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
  //           // await this.storeRelations(results);
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

	async fetchQuery(driver, paramstring, forceReload) {

		let query = this.queries.get(driver, paramstring) || {};

		if (!query.complete && !query.queried || forceReload) {

			const relations = KarmaFieldsAlpha.Driver.getRelations(driver) || [];
			const idAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "id");

			const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}`, paramstring);

			query.ids = [];

			if (results) {

				// query.ids = results.map(result => result[idAlias]);

				// should be moved from buffer?
				// this.store.set(ids, "query", driver, paramstring, "ids");

				for (let result of results) {

					const id = result[idAlias];

					query.ids.push(id);

					for (let key in result) {

						await KarmaFieldsAlpha.Database.Vars.set([result[key]], driver, id, key);

					}

				}

				// await KarmaFieldsAlpha.Database.Vars.insert(items, driver);

				query.complete = relations.length === 0;

			} else {

				// this.store.set([], "query", driver, paramstring, "ids");
				query.complete = true;

			}

			query.queried = true;

		}

		this.queries.set(query, driver, paramstring);

		return query;

	}

	// async fetchCount(driver, paramstring) {

	// 	let query = this.get("store", "query", driver, paramstring);

	// 	if (!query) {

	// 		query = {};

	// 		this.set(query, "store", "query", driver, paramstring);

	// 	}

	// 	if (query.count === undefined) {

	// 		query.count = await KarmaFieldsAlpha.HTTP.get(`count/${driver}`, paramstring) || 0;

	// 	}

	// }

	async fetchCount(driver, paramstring, forceReload) {

		let query = this.queries.get(driver, paramstring) || {};

		if (query.count === undefined || forceReload) {

			query.count = await KarmaFieldsAlpha.HTTP.get(`count/${driver}`, paramstring) || 0;

			this.queries.set(query, driver, paramstring);

		}

	}

	// async fetchMore(driver, paramstring) {

	// 	// let query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);

	// 	let query = this.get("store", "query", driver, paramstring);

	// 	if (!query) {

	// 		query = await this.fetchQuery(driver, paramstring);

	// 	}

	// 	query.relationIndex ||= 0;
	// 	query.ids ||= [];

	// 	const relations = KarmaFieldsAlpha.Driver.getRelations(driver) || [];
	// 	const idAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "id");

	// 	if (query.ids.length && query.relationIndex < relations.length) {

	// 		const relation = relations[query.relationIndex];
	// 		const max = 100;

	// 		for (let j = 0; j < query.ids.length; j += max) {

	// 			const paramstring = `ids=${query.ids.slice(j, j + max).join(",")}`;

	// 			const results = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${relation}`, paramstring);

	// 			if (results && results.length) {

	// 				const dataset = {};

	// 				for (let result of results) {

	// 					const id = result.id.toString();
	// 					const key = result.key.toString();

	// 					if (!dataset[id]) {

	// 						dataset[id] = {};

	// 					}

	// 					if (!dataset[id][key]) {

	// 						dataset[id][key] = [];

	// 					}

	// 					dataset[id][key].push(result.value);

	// 				}

	// 				const items = [];

	// 				for (let id in dataset) {

	// 					for (let key in dataset[id]) {

	// 						items.push({ id, key, data: dataset[id][key] });

	// 					}

	// 				}

	// 				await KarmaFieldsAlpha.Database.Vars.insert(items, driver);

	// 			}

	// 		}

	// 		query.relationIndex++;
	// 		query.complete = query.relationIndex >= relations.length;

	// 	} else {

	// 		query.complete = true;

	// 	}

	// 	// await KarmaFieldsAlpha.Database.Queries.set(query, "query", driver, paramstring);

	// 	return query;

	// }

	async fetchMore(driver, paramstring) {

		let query = this.queries.get(driver, paramstring);

		if (!query) {

			query = await this.fetchQuery(driver, paramstring);

		}

		if (!query.ids) {

			console.error("Fetching relations but ids is not set");
			query.ids = [];

		}

		query.relationIndex ||= 0;

		// -> this is never modified! (should it be moved out of buffer?)
		// const ids = this.store.get("query", driver, paramstring, "ids") || [];

		const relations = KarmaFieldsAlpha.Driver.getRelations(driver) || [];
		// const idAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "id");

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

							await KarmaFieldsAlpha.Database.Vars.set(dataset[id][key], driver, id, key);

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

	// async fetchIds(driver, paramstring) {

	// 	let query = await this.fetchQuery(driver, paramstring);

	// 	return query.ids || [];

	// }

	// not used!
	async fetchValues(driver, ids, keys) {

		const paramstring = `ids=${ids.join(",")}`;

		for (let id of ids) {

			for (let key of keys) {

				let value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

				if (!value) {

					await this.fetchQuery(driver, paramstring);

					value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

				}

				while (!value) {

					const query = await this.fetchMore(driver, paramstring);

					if (query.complete) {

						value = [];

					} else {

						value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

					}

				}

			}

		}

	}

	// async fetchReset(driver, paramstring) {

	// 	await KarmaFieldsAlpha.Database.queries.remove(driver, paramstring);

	// }

	async write(value, driver, id, key) {

		const original = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);
		// const current = await KarmaFieldsAlpha.Database.States.get("external", driver, id, key);

		// const current = await KarmaFieldsAlpha.Database.edits.get(driver, id, key);
		const current = this.edits.get(driver, id, key);


		if (!original || !KarmaFieldsAlpha.DeepObject.equal(value, original)) {

			// await KarmaFieldsAlpha.Database.edits.set(value, driver, id, key);
			this.edits.set(value, driver, id, key);

		} else if (current) {

			// await KarmaFieldsAlpha.Database.edits.remove(driver, id, key);
			this.edits.remove(driver, id, key);

		}

		const index = KarmaFieldsAlpha.History.getIndex();

		if (index > 0) {

			const previous = await KarmaFieldsAlpha.Database.History.get(index - 1, "external", driver, id, key);

			if (!previous) {

				await KarmaFieldsAlpha.Database.History.set(current || [], index - 1, "external", driver, id, key);

			}

		}

		await KarmaFieldsAlpha.Database.History.set(value, index, "external", driver, id, key);

		// const states = await KarmaFieldsAlpha.Database.States.getAll("external");
		// const states = await KarmaFieldsAlpha.Database.States.select("external");

		// // for (let item of states) {

		// // 	KarmaFieldsAlpha.DeepObject.set(this.store, item.data, "edits", item.driver, item.id, item.key);

		// // }

		// this.store.hasEdits = states.length > 0;

	}

	async transformField(value, current, fieldId, key) {

		// const current = await KarmaFieldsAlpha.Database.States.get("internal", "fields", fieldId, key);
		// const current = await KarmaFieldsAlpha.Database.fields.get(fieldId, key);

		if (!KarmaFieldsAlpha.DeepObject.equal(value, current)) {

			// await KarmaFieldsAlpha.Database.States.set(value, "internal", "fields", fieldId, key);

			await KarmaFieldsAlpha.Database.fields.set(value, fieldId, key);

			const index = KarmaFieldsAlpha.History.getIndex();

			if (index > 0) {

				const previous = await KarmaFieldsAlpha.Database.History.get(index - 1, "internal", "fields", fieldId, key);

				if (!previous) {

					await KarmaFieldsAlpha.Database.History.set(current || {}, index - 1, "internal", "fields", fieldId, key);

				}

			}

			await KarmaFieldsAlpha.Database.History.set(value, index, "internal", "fields", fieldId, key);

		}

		// await KarmaFieldsAlpha.History.write(value, current, "internal", "fields", fieldId, key); // update history



	}

	// async transformQuery(query, current, driver, paramstring) {

	// 	// const current = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);

	// 	// if (!current) {

	// 	// 	console.error("transforming query but query is not set");

	// 	// }

	// 	if (!KarmaFieldsAlpha.DeepObject.equal(query, current)) {

	// 		// ids = [...query.ids]; // -> just in case data in indexedDB still mutates

	// 		// const query = { ...currentQuery, ids, transformed: true };

	// 		// await KarmaFieldsAlpha.Database.Queries.set(query, "query", driver, paramstring);

	// 		const index = KarmaFieldsAlpha.History.getIndex();

	// 		if (index > 0) {

	// 			const previous = await KarmaFieldsAlpha.Database.History.get(index - 1, "internal", driver, paramstring, "query");

	// 			if (!previous) {

	// 				await KarmaFieldsAlpha.Database.History.set(current, index - 1, "internal", driver, paramstring, "query");

	// 			}

	// 		}

	// 		await KarmaFieldsAlpha.Database.History.set(query, index, "internal", driver, paramstring, "query");

	// 	}

	// }



	// async count(driver, paramstring) {

	// 	// const query = await KarmaFieldsAlpha.Database.Queries.get("count", query.driver, query.paramstring);

	// 	const count = await KarmaFieldsAlpha.HTTP.get(`count/${driver}`, paramstring) || 0;

	// 	await KarmaFieldsAlpha.Database.queries.set(count, driver, paramstring, "count");

	// 	return count;

	// }





 //  async setIds(ids, driver, paramstring) {

 //    // const ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

 //    let current = await KarmaFieldsAlpha.Database.States.get("queries", driver, paramstring, "ids");

 //    if (!current) {

 //      const query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);

 //      current = query.queriedIds;

 //    }

 //    if (current) {


 //      KarmaFieldsAlpha.DeepObject.set(this.store, ids, "ids", driver, paramstring);

 //      await KarmaFieldsAlpha.Database.States.set(ids, "queries", driver, paramstring, "ids");
 //      await KarmaFieldsAlpha.History.write(ids, current, "queries", driver, paramstring, "ids"); // update history

 //    }

 //  }


	// edit(value, driver, id, key) {

	// 	if (!Array.isArray(value)) {

	// 		console.log("value must be an array!");

	// 	}


	// 	// let current = await KarmaFieldsAlpha.Database.States.get("external", driver, id, key);
	// 	//
	// 	// if (!current) {
	// 	//
	// 	//   current = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);
	// 	//
	// 	// }

	// 	key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
	// 	// value = new KarmaFieldsAlpha.Content(value).toArray();

	// 	if (typeof id !== "symbol") {

	// 		const current = KarmaFieldsAlpha.DeepObject.get(this.store, "vars", driver, id, key);

	// 		KarmaFieldsAlpha.DeepObject.set(this.orders, {current, value}, "edit", driver, id, key);

	// 	}


	// 	KarmaFieldsAlpha.DeepObject.set(this.store, value, "edit", driver, id, key);

	// }

	// async processEdit() {

	// 	const orders = KarmaFieldsAlpha.DeepObject.get(this.orders, "edit");

	// 	if (orders) {

	// 		for (let driver in orders) {

	// 			for (let id in orders[driver]) {

	// 				for (let key in orders[driver][id]) {

	// 					const current = orders[driver][id][key].current;
	// 					const value = orders[driver][id][key].value;

	// 					KarmaFieldsAlpha.DeepObject.set(this.orders, value, "delta", driver, id, key);

	// 					await KarmaFieldsAlpha.Database.States.set(value, "external", driver, id, key);
	// 					await KarmaFieldsAlpha.History.write(value, current, "external", driver, id, key); // update history

	// 				}

	// 			}

	// 		}

	// 		KarmaFieldsAlpha.DeepObject.remove(this.orders, "edit");

	// 	}

	// }

 //  async setValueOLD(value, driver, id, key) {


 //    // let current = await KarmaFieldsAlpha.Database.States.get("external", driver, id, key);
 //    //
 //    // if (!current) {
 //    //
 //    //   current = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);
 //    //
 //    // }

 //    const current = KarmaFieldsAlpha.DeepObject.get(this.store, "vars", driver, id, key);

 //    if (current) {

 //      key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
 //      value = new KarmaFieldsAlpha.Content(value).toArray();

 //      KarmaFieldsAlpha.DeepObject.set(this.store, value, "vars", driver, id, key);

 //      if (typeof id !== "symbol") {

 //        await KarmaFieldsAlpha.Database.States.set(value, "external", driver, id, key);
 //        await KarmaFieldsAlpha.History.write(value, current, "external", driver, id, key); // update history

 //      }



 //    }

 //  }

	// editAt(value, driver, paramstring, index, key) {

	// 	if (!Array.isArray(value)) {

	// 		console.error("value must be an array!");

	// 	}

	// 	const ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

	// 	if (!ids) {

	// 		console.error("ids not set");

	// 	}

	// 	const id = ids[index];

	// 	if (!id) {

	// 		console.error("index out of range");

	// 	}

	// 	key = KarmaFieldsAlpha.Driver.getAlias(driver, key);

	// 	const current = KarmaFieldsAlpha.DeepObject.get(this.store, "vars", driver, id, key);

	// 	KarmaFieldsAlpha.DeepObject.set(this.orders, {current, value}, "edit", driver, id, key);

	// 	KarmaFieldsAlpha.DeepObject.set(this.store, value, "vars", driver, id, key);

	// }

 //  async setValueAtOLD(value, driver, paramstring, index, key) {

 //    const ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

 //    if (ids) {

 //      const id = ids[index];

 //      if (id) {

 //        const current = KarmaFieldsAlpha.DeepObject.get(this.store, "vars", driver, id, key);

 //        if (current) {

 //          key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
 //          value = new KarmaFieldsAlpha.Content(value).toArray();

 //          KarmaFieldsAlpha.DeepObject.set(this.store, value, "vars", driver, id, key);

 //          if (typeof id !== "symbol") {

 //            await KarmaFieldsAlpha.Database.States.set(value, "external", driver, id, key);
 //            await KarmaFieldsAlpha.History.write(value, current, "external", driver, id, key); // update history

 //          }

 //        }

 //      } else {

 //        console.error("Trying to set value at index out of bounds");

 //      }

 //    }

 //  }




  // async addItem(token, driver, paramstring, params) {
  //
  //   console.error("deprecated");
  //
  //   let id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`, params);
  //
  //   id = id.toString();
  //
  //   // replace token by id in queries states
  //   const states = await KarmaFieldsAlpha.Database.States.select("external", driver, token);
  //
  //   if (states) {
  //
  //     KarmaFieldsAlpha.Database.States.insert(states.map(item => ({...item, id})));
  //
  //   }
  //
  //   await KarmaFieldsAlpha.Database.States.remove("external", driver, token);
  //
  //   await KarmaFieldsAlpha.Database.States.set(["0"], "external", driver, id, "trash");
  //   await KarmaFieldsAlpha.History.write(["0"], ["1"], "external", driver, id, "trash");
  //
  //   let ids = await KarmaFieldsAlpha.Database.States.get("queries", driver, paramstring, "ids");
  //
  //   ids = ids.map(item => item === token ? id : item);
  //
  //   await KarmaFieldsAlpha.Database.States.set(ids, "queries", driver, paramstring, "ids");
  //
  //   KarmaFieldsAlpha.DeepObject.set(this.store, ids, "ids", driver, paramstring);
  //
  //
  // }


  // createToken() {

  //   let index = KarmaFieldsAlpha.tokenIndex || 0;

  //   index++;

  //   KarmaFieldsAlpha.tokenIndex = index;

  //   return `_${index}`;

  // }

  // async *add(driver, paramstring, index, length, defaults, data) {
  //
  //   const tokens = [];
  //
  //   for (let i = 0; i < length; i++) {
  //
  //     const token = this.createToken();
  //     tokens.push(token);
  //
  //     const itemData = data && data[i];
  //     const params = {...defaults, ...itemData};
  //
  //     for (let key in params) {
  //
  //       await KarmaFieldsAlpha.Database.States.set([params[key]], "external", driver, token, key); // do not update history
  //
  //     }
  //
  //   }
  //
  //   let query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);
  //
  //   if (!query) {
  //
  //     query = {type: "query", driver, paramstring};
  //
  //     await this.fetch(query).next();
  //
  //   }
  //
  //   const delta = await KarmaFieldsAlpha.Database.States.get("queries", driver, paramstring, "ids");
  //
  //   const previousIds = delta || query.queriedIds || [];
  //   let ids = [...previousIds];
  //   ids.splice(index, 0, ...tokens);
  //
  //   await KarmaFieldsAlpha.Database.States.set(ids, "queries", driver, paramstring, "ids"); // do not update history
  //
  //   KarmaFieldsAlpha.DeepObject.set(this.store, ids, "ids", driver, paramstring);
  //
  //   for (let token of tokens) {
  //
  //     // await KarmaFieldsAlpha.server.addItem(token, driver, paramstring, params);
  //     //
  //     // await this.render();
  //
  //     yield true;
  //
  //     let id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`, defaults);
  //
  //     id = id.toString();
  //
  //     // replace token by id in queries states
  //     const states = await KarmaFieldsAlpha.Database.States.select("external", driver, token);
  //
  //     if (states) {
  //
  //       KarmaFieldsAlpha.Database.States.insert(states.map(item => ({...item, id})));
  //
  //     }
  //
  //     await KarmaFieldsAlpha.Database.States.remove("external", driver, token);
  //
  //     await KarmaFieldsAlpha.Database.States.set(["0"], "external", driver, id, "trash");
  //     await KarmaFieldsAlpha.History.write(["0"], ["1"], "external", driver, id, "trash");
  //
  //     ids = await KarmaFieldsAlpha.Database.States.get("queries", driver, paramstring, "ids"); // reload in case it changed inbetween
  //
  //     ids = ids.map(item => item === token ? id : item);
  //
  //     await KarmaFieldsAlpha.Database.States.set(ids, "queries", driver, paramstring, "ids");
  //
  //     KarmaFieldsAlpha.DeepObject.set(this.store, ids, "ids", driver, paramstring);
  //
  //     // KarmaFieldsAlpha.DeepObject.set(this.store, ids, "ids", driver, paramstring);
  //
  //   }
  //
  //   await KarmaFieldsAlpha.History.write(ids, previousIds, "queries", driver, paramstring, "ids"); // update history
  //
  // }

  // async load(callback) {
  // 	let result = callback();
  //  	while (this.hasOrder()) {
		// 	await this.process();
		// 	result = callback();
		// }
		// return result;
  // }

  // async *addOLD(driver, paramstring, index, length, defaults, data) {

  //   // -> alias keys
  //   defaults = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(driver, key), value]));

  //   const tokens = [];

  //   for (let i = 0; i < length; i++) {

  //     // const token = this.createToken();
  //     const token = Symbol("token");
  //     tokens.push(token);

  //     const itemData = data && data[i] && Object.fromEntries(Object.entries(data[i]).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(driver, key), value]));

  //     const params = {...defaults, ...itemData};

  //     for (let key in params) {

  //       KarmaFieldsAlpha.DeepObject.set(this.store, [params[key]], "vars", driver, token, key);

  //     }

  //   }

  //   let ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

  //   let previousIds = ids.filter(id => typeof id !== "symbol");

  //   ids.splice(index, 0, ...tokens);

  //   for (let token of tokens) {

  //     yield;

  //     let id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`, defaults);

  //     id = id.toString();

  //     ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

  //     const index = ids.indexOf(token);

  //     if (index > -1) {

  //       ids[index] = id;

  //     }

  //     const delta = KarmaFieldsAlpha.DeepObject.get(this.store, "vars", driver, token);

  //     if (delta) {

  //       KarmaFieldsAlpha.DeepObject.set(this.store, delta, "vars", driver, id);
  //       KarmaFieldsAlpha.DeepObject.remove(this.store, "vars", driver, token);

  //       for (let key in delta) {

  //         await KarmaFieldsAlpha.Database.States.set(delta[key], "external", driver, id, key);
  //         await KarmaFieldsAlpha.History.write(delta[key], [], "external", driver, id, key);

  //       }

  //     }

  //     await KarmaFieldsAlpha.Database.Vars.set(["0"], driver, id, "trash");
  //     await KarmaFieldsAlpha.Database.States.set(["0"], "external", driver, id, "trash");
  //     await KarmaFieldsAlpha.History.write(["0"], ["1"], "external", driver, id, "trash");

  //   }

  //   ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

  //   ids = ids.filter(id => typeof id !== "symbol"); // filter tokens

  //   await KarmaFieldsAlpha.Database.States.set(ids, "queries", driver, paramstring, "ids");
  //   await KarmaFieldsAlpha.History.write(ids, previousIds, "queries", driver, paramstring, "ids"); // update history

  // }



	// add(fieldId, driver, paramstring, index, length, defaults, data) {

	// 	let query = this.store.get("fields", fieldId, "query");

	// 	if (!query) {

	// 		query = this.queries.get(driver, paramstring);

	// 	}

	// 	if (!query) {

	// 		console.error("adding item but query is not set");

	// 	}

	// 	// unalias
	// 	defaults = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(query.driver, key), value]));

	// 	if (this.tasks.has("post", "add", driver, paramstring)) {

	// 		console.error("an order for adding items is still pending");

	// 	} else {

	// 		const tokens = [];

	// 		for (let i = 0; i < length; i++) {

	// 			const token = Symbol("token");

	// 			// unalias
	// 			const itemData = data && data[i] && Object.fromEntries(Object.entries(data[i]).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(query.driver, key), value]));

	// 			const params = { ...query.params, ...defaults, ...itemData };

	// 			for (let key in params) {

	// 				KarmaFieldsAlpha.DeepObject.set(this.store, [params[key]], "vars", driver, token, key);

	// 			}

	// 			tokens.push(token);

	// 		}

	// 		// const ids = this.get("store", "ids", driver, paramstring);

	// 		// const previousQuery = this.get("store", "query", driver, paramstring);

	// 		// if (previousQuery) {

	// 		// 	console.error("Adding items to undefined query");

	// 		// } else {

	// 			// const newQuery = {};
	// 			// newQuery.ids = [...previousQuery.ids];
	// 			// newQuery.ids.splice(index, 0, ...tokens);
	// 			// newQuery.count += tokens.length;

	// 		const { ids, count } = query;
	// 		const previousQuery = { ids, count };
	// 		const newQuery = { ids: [...ids], count };

	// 		// const newQuery = KarmaFieldsAlpha.DeepObject.clone(query);
	// 		newQuery.ids.splice(index, 0, ...tokens);
	// 		newQuery.count += tokens.length;

	// 			// this.set(newQuery, "store", "query", driver, paramstring);
	// 			// this.set(newQuery, "store", "fields", fieldId, "query");
	// 		this.store.set(newQuery, "fields", fieldId, "query");

	// 		this.tasks.set({ query: newQuery, previousQuery, tokens, fieldId }, "post", "add", driver, paramstring);

	// 		// }


	// 	}

	// }

	// add(tokens, driver) {

	// 	for (let i = 0; i < tokens; i++) {

	// 		const edits = this.edits.get(driver, tokens[i]);

	// 		this.tasks.set(edits, "post", "add", driver, tokens[i]);

	// 	}

	// }

	add(params, driver) {

		const token = this.createToken();

		this.tasks.set(params, "post", "add", driver, token);

		for (let key in params) {

			this.setValue([params[key]], driver, token, key);

		}

		this.setValue(["0"], driver, token, "trash");

	}

	// addNEW(driver, paramstring, sockets) {

	// 	let query = this.queries.get(driver, paramstring);

	// 	if (!query) {

	// 		console.error("adding item but query is not set");

	// 	}

	// 	// unalias
	// 	// defaults = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(query.driver, key), value]));

	// 	if (this.tasks.has("post", "add", driver, paramstring)) {

	// 		console.error("an order for adding items is still pending");

	// 	} else {

	// 		this.tasks.set(sockets, "post", "add", driver, paramstring);


	// 		// const tokens = [];

	// 		// for (let i = 0; i < length; i++) {

	// 		// 	const token = Symbol("token");

	// 		// 	// unalias
	// 		// 	const itemData = data && data[i] && Object.fromEntries(Object.entries(data[i]).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(query.driver, key), value]));

	// 		// 	const params = { ...query.params, ...defaults, ...itemData };

	// 		// 	for (let key in params) {

	// 		// 		KarmaFieldsAlpha.DeepObject.set(this.store, [params[key]], "vars", driver, token, key);

	// 		// 	}

	// 		// 	tokens.push(token);

	// 		// }


	// 		// const { ids, count } = query;
	// 		// const previousQuery = { ids, count };
	// 		// const newQuery = { ids: [...ids], count };

	// 		// newQuery.ids.splice(index, 0, ...tokens);
	// 		// newQuery.count += tokens.length;

	// 		// 	// this.set(newQuery, "store", "query", driver, paramstring);
	// 		// 	// this.set(newQuery, "store", "fields", fieldId, "query");
	// 		// this.store.set(newQuery, "fields", fieldId, "query");

	// 		// this.tasks.set({ query: newQuery, previousQuery, tokens, fieldId }, "post", "add", driver, paramstring);

	// 		// }


	// 	}

	// }

	async doAdd() {

		const task = this.tasks.get("post", "add");

		if (task) {

			for (let driver in task) {

				const updates = {};

				for (let token in task[driver]) {

					let id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`);

					id = id.toString();

					const edits = task[driver][token];

					if (edits) {

						updates[id] = edits;

						this.edits.remove(driver, token);

						// do we really need this?
						for (let key in edits) {
							await KarmaFieldsAlpha.Database.Vars.set(edits[key], driver, id, key);
						}

						this.store.set(edits, "vars", driver, id);
						this.store.remove("vars", driver, token);

					}

				}

				await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, updates);

			}

			this.needRender = true;

			this.tasks.remove("post", "add");

		}

		// const task = this.tasks.get("post", "add");

		// if (task) {

		// 	for (let driver in task) {

		// 		for (let paramstring in task[driver]) {

		// 			const { query, previousQuery, tokens, fieldId } = task[driver][paramstring];

		// 			for (let token of tokens) {

		// 				const index = query.ids.indexOf(token);

		// 				if (index === -1) {

		// 					console.error("token not found in ids!");

		// 					continue; // maybe it was already deleted

		// 				}

		// 				let id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`);

		// 				id = id.toString();

		// 				query.ids[index] = id; // -> update store by ref

		// 				const delta = this.store.get("vars", driver, token);

		// 				if (delta) {

		// 					this.store.set(delta, "vars", driver, id);
		// 					this.store.remove("vars", driver, token);

		// 					for (let key in delta) {

		// 						await this.write(delta[key], driver, id, key);

		// 					}

		// 				}

		// 				await this.write(["0"], driver, id, "trash");

		// 				// await KarmaFieldsAlpha.Database.Vars.set(["0"], driver, id, "trash");
		// 				// await KarmaFieldsAlpha.Database.States.set(["0"], "external", driver, id, "trash");
		// 				// await KarmaFieldsAlpha.History.write(["0"], ["1"], "external", driver, id, "trash");
		// 				// KarmaFieldsAlpha.DeepObject.set(this.edits, ["0"], driver, id, "trash");

		// 			}

		// 			if (query.ids.some(id => typeof id !== "symbol")) {

		// 				console.error("ids shouldn't contain token yet!");

		// 			}


		// 			await KarmaFieldsAlpha.Database.fields.set(previousQuery, fieldId, "query");
		// 			// await KarmaFieldsAlpha.Database.queries.remove(driver, paramstring);
		// 			// this.remove("store", "query", driver, paramstring);

		// 			// await this.fetchQuery(driver, paramstring, true);

		// 			await this.transformField(query, previousQuery, fieldId, "query");

		// 			// await this.transformQuery(query, previousQuery, driver, paramstring);



		// 			this.needRender = true;

		// 		}

		// 	}

		// 	this.tasks.remove("post", "add");

		// }

	}




  // async *delete(driver, paramstring, index, length) {

  //   // let ids = this.getIds();
  //   //
  //   // while (ids.loading) {
  //   //
  //   //   await this.render();
  //   //   ids = this.getIds();
  //   //
  //   // }

  //   let query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);

  //   if (!query) {

  //     query = {type: "query", driver, paramstring};

  //     await this.fetch(query).next();

  //   }

  //   const delta = await KarmaFieldsAlpha.Database.States.get("queries", driver, paramstring, "ids");

  //   const previousIds = delta || query.queriedIds || [];

  //   const newIds = [...previousIds];

  //   const removedIds = newIds.splice(index, length);

  //   for (let id of removedIds) {

  //     // await KarmaFieldsAlpha.Database.Vars.set(["1"], driver, id, "trash");
  //     await KarmaFieldsAlpha.Database.States.set(["1"], "external", driver, id, "trash");
  //     await KarmaFieldsAlpha.History.write(["1"], ["0"], "external", driver, id, "trash");

  //   }

  //   await KarmaFieldsAlpha.Database.States.set(newIds, "queries", driver, paramstring, "ids");
  //   await KarmaFieldsAlpha.History.write(newIds, previousIds, "queries", driver, paramstring, "ids");

  //   KarmaFieldsAlpha.DeepObject.set(this.store, newIds, "ids", driver, paramstring);

  //   // yield;
  //   // await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, Object.fromEntries(removedIds.map(id => [id, {trash: ["1"]}])));

  // }

	// delete(driver, paramstring, index, length) {

	// 	let ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

	// 	if (!ids) {

	// 		console.error("ids not set!");

	// 	}

	// 	if (index + length > ids.length) {

	// 		console.error("out of range");

	// 	}

	// 	let remainingIds = [...ids];
	// 	let deletedIds = remainingIds.splice(index, length);

	// 	KarmaFieldsAlpha.DeepObject.set(this.store, remainingIds, "ids", driver, paramstring);

	// 	KarmaFieldsAlpha.DeepObject.set(this.orders, {
	// 		ids,
	// 		deletedIds,
	// 		remainingIds
	// 	}, "delete", driver, paramstring);




	// 	// for (let i = 0; i < length; i++) {

	// 	// 	const id = ids[index + i];

	// 	// 	if (!id) {

	// 	// 		console.error("id not found");

	// 	// 	} else if (typeof id === "symbol") {

	// 	// 		console.error("deleted id should not be a symbol");

	// 	// 	}

	// 	// 	KarmaFieldsAlpha.DeepObject.set(this.orders, true, "delete", driver, paramstring, id);

	// 	// }

	// 	// KarmaFieldsAlpha.DeepObject.set(this.orders, {index, length}, "delete", driver, paramstring, id);

	// 	// KarmaFieldsAlpha.DeepObject.set(this.store, remainingIds, "ids", driver, paramstring);

	// }

	// delete(driver, paramstring, index, length) {

	// 	const ids = this.get("store", "ids", driver, paramstring);

	// 	// const remainingIds = [...ids];
	// 	const deletedIds = ids.splice(index, length); // -> update store by ref

	// 	KarmaFieldsAlpha.DeepObject.set(this.orders, { ids, deletedIds }, "delete", driver, paramstring);

	// }

	// delete(fieldId, driver, paramstring, index, length) {

	// 	let query = this.store.get("fields", fieldId, "query");

	// 	if (!query) {

	// 		query = this.queries.get(driver, paramstring);

	// 	}

	// 	if (!query) {

	// 		console.error("adding item but query is not set");

	// 		return;

	// 	}

	// 	const { ids, count } = query;
	// 	const previousQuery = { ids, count };
	// 	const newQuery = { ids: [...ids], count };



	// 	// const newQuery = KarmaFieldsAlpha.DeepObject.clone(query);
	// 	const deletedIds = newQuery.ids.splice(index, length);
	// 	newQuery.count -= tokens.length;

	// 	this.store.set(newQuery, "fields", fieldId, "query");

	// 	this.tasks.set({ query: newQuery, previousQuery, deletedIds, fieldId }, "post", "delete", driver, paramstring);

	// }

	// async doDelete() {

	// 	const task = this.tasks.get("post", "delete");

	// 	if (task) {

	// 		for (let driver in task) {

	// 			for (let paramstring in task[driver]) {

	// 				const { query, previousQuery, deletedIds, fieldId } = task[driver][paramstring];

	// 				for (let id of deletedIds) {

	// 					if (typeof id !== "symbol") {

	// 						await this.write(["1"], driver, id, "trash");

	// 					}

	// 				}

	// 				await KarmaFieldsAlpha.Database.fields.set(previousQuery, fieldId, "query");

	// 				await this.transformField(query, previousQuery, fieldId, "query");

	// 			}

	// 		}

	// 		this.tasks.remove("post", "delete");

	// 	}

	// }




  // async getOptionsList() {
  //
  //   console.error("deprecated");
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //
  //   content.value = [];
  //
  //   for (let id of this.ids) {
  //
  //     const name = await this.getValue(id, "name");
  //
  //     if (name.loading) {
  //
  //       content.loading = true;
  //
  //     }
  //
  //     content.value.push({
  //       id: id,
  //       name: name.toString()
  //     });
  //
  //   }
  //
  //   return content;
  //
  // }

  // createTokens(length) {
  //
  //   const tokens = [];
  //
  //   for (let i = 0; i < length; i++) {
  //
  //     tokens.push(Symbol("token"));
  //
  //   }
  //
  //   return tokens;
  //
  // }

  // async *upload(driver, paramstring, index, files, defaults) { // }, tokens) {

  //   // if (!tokens || tokens.length !== files.length) {
  //   //
  //   //   tokens = this.createTokens(files.length);
  //   //
  //   // }

  //   const tokens = [];

  //   // -> alias keys
  //   defaults = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(driver, key), value]));

  //   for (let i = 0; i < files.length; i++) {

  //     const token = Symbol("token");
  //     tokens.push(token);

  //     // const token = tokens[i];

  //     for (let key in defaults) {

  //       KarmaFieldsAlpha.DeepObject.set(this.store, [defaults[key]], "vars", driver, token, key);

  //     }

  //   }

  //   let ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

  //   let previousIds = ids.filter(id => typeof id !== "symbol");

  //   ids.splice(index, 0, ...tokens);

  //   const createdIds = [];

  //   for (let file of files) {

  //     const token = tokens.shift();

  //     yield token;



  //     // await server.upload(file, token, filters);

  //     let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params need to be saved later

  //     id = id.toString();

  //     createdIds.push(id);

  //     ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

  //     const index = ids.indexOf(token);

  //     if (index > -1) {

  //       ids[index] = id;

  //     }

  //     const delta = KarmaFieldsAlpha.DeepObject.get(this.store, "vars", driver, token);

  //     if (delta) {

  //       KarmaFieldsAlpha.DeepObject.set(this.store, delta, "vars", driver, id);
  //       KarmaFieldsAlpha.DeepObject.remove(this.store, "vars", driver, token);

  //       for (let key in delta) {

  //         await KarmaFieldsAlpha.Database.States.set(delta[key], "external", driver, id, key);
  //         await KarmaFieldsAlpha.History.write(delta[key], [], "external", driver, id, key);

  //       }

  //     }

  //     await KarmaFieldsAlpha.Database.Vars.set(["0"], driver, id, "trash");
  //     await KarmaFieldsAlpha.Database.States.set(["0"], "external", driver, id, "trash");
  //     await KarmaFieldsAlpha.History.write(["0"], ["1"], "external", driver, id, "trash");

  //     if (Object.values(defaults).length) {

  //       const payload = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, [value]]));

  //       await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, {[id]: payload});

  //     }

  //   }

  //   ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

  //   ids = ids.filter(id => typeof id !== "symbol"); // filter tokens

  //   await KarmaFieldsAlpha.Database.States.set(ids, "queries", driver, paramstring, "ids");
  //   await KarmaFieldsAlpha.History.write(ids, previousIds, "queries", driver, paramstring, "ids"); // update history


  //   const query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);
  //   query.complete = false;
  //   query.queried = 0;
  //   query.relationIndex = 0;

  //   await KarmaFieldsAlpha.Database.Queries.set(query);

  //   // yield;


  //   // const gen = this.fetch({type: "wild", driver, paramstring: "", requestedIds: new Set(createdIds)});
  //   //
  //   // for await (let query of gen) {
  //   //
  //   //   yield;
  //   //
  //   // }

  // }
//

	//

	// uploadFiles(files, tokens, driver) {

	// 	for (let i = 0; i < files; i++) {

	// 		this.tasks.set(files[i], "post", "upload", driver, tokens[i]);

	// 	}

	// }

	upload(file, driver) {

		const token = this.createToken();

		this.tasks.set(file, "post", "upload", driver, token);
		this.queries.remove(driver); // -> clean all driver queries

		this.setValue(["0"], driver, token, "trash");

		return token;

	}

	async doUpload() {

		const task = this.tasks.get("post", "upload");

		if (task) {

			for (let driver in task) {

				for (let token in task[driver]) {

					const file = task[driver][token];

					let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params need to be saved later

					id = id.toString();

					const edits = this.edits.get(driver, token);

					if (edits) {

						this.edits.remove(driver, token);

						await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, { [id]: edits });

						// do we need this?
						for (let key in edits) {
							await KarmaFieldsAlpha.Database.Vars.set(edits[key], driver, id, key);
						}

						this.store.set(edits, "vars", driver, id);
						this.store.remove("vars", driver, token);

					}

				}

			}

			this.needRender = true;

			this.tasks.remove("post", "upload");

		}

	}

	uploadUrl(url, driver) {

		const token = this.createToken();

		this.tasks.set(url, "post", "url", driver, token);
		this.queries.remove(driver); // -> clean all driver queries

		this.setValue(["0"], driver, token, "trash");

		return token;

	}

	async doUploadUrls() {

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

	// post custom things
	// post() {


	// }


	// upload(fieldId, driver, paramstring, index, files, defaults) {

	// 	let query = this.store.get("fields", fieldId, "query");

	// 	if (!query) {

	// 		query = this.store.get("query", driver, paramstring);

	// 	}

	// 	if (!query) {

	// 		console.error("adding item but query is not set");

	// 		return;

	// 	}

	// 	const task = this.tasks.get("post", "upload", driver, paramstring);

	// 	if (task) {

	// 		console.error("uploading files but there is still a pending upload task");

	// 	} else {

	// 		// const previousQuery = KarmaFieldsAlpha.DeepObject.get(this.store, "query", driver, paramstring);

	// 		// if (!previousQuery) {

	// 		// 	console.error("uploading files but query is not set!");

	// 		// }

	// 		const { ids, count } = query;
	// 		const previousQuery = { ids, count };
	// 		const newQuery = { ids: [...ids], count };

	// 		// const newQuery = KarmaFieldsAlpha.DeepObject.clone(query);

	// 		// unalias
	// 		defaults = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(driver, key), value]));

	// 		const uploads = [];

	// 		// for (let file of files) {
	// 		for (let i = 0; i < files.length; i++) {

	// 			let file = files[i];

	// 			const token = Symbol("token");

	// 			uploads.push({ token, file });

	// 			for (let key in defaults) {

	// 				this.store.set([defaults[key]], "vars", driver, token, key);

	// 			}

	// 			newQuery.ids.splice(index + i, 0, token);
	// 			newQuery.count++;

	// 		}

	// 		this.store.set(newQuery, "fields", fieldId, "query");

	// 		this.tasks.set({query: newQuery, previousQuery, uploads, defaults, fieldId}, "upload", driver, paramstring);

	// 	}

	// }

	// async doUpload() {

	// 	const task = this.tasks.get("post", "upload");

	// 	if (task) {

	// 		for (let driver in task) {

	// 			for (let paramstring in task[driver]) {

	// 				const { query, previousQuery, uploads, defaults } = task[driver][paramstring];

	// 				// for (let i = 0; i < files.length; i++) {
	// 				for (let upload of uploads) {

	// 					const index = query.ids.indexOf(upload.token);

	// 					if (index === -1) {

	// 						console.error("token not found in ids!");

	// 						continue; // maybe already deleted

	// 					}

	// 					let id = await KarmaFieldsAlpha.HTTP.upload(upload.file); // -> parent and params need to be saved later

	// 					id = id.toString();

	// 					query.ids[index] = id; // update store by reference

	// 					const delta = this.store.get("vars", driver, upload.token);

	// 					if (delta) {

	// 						this.store.set(delta, "vars", driver, id);
	// 						this.store.remove("vars", driver, upload.token);

	// 						for (let key in delta) {

	// 							await this.write(delta[key], driver, id, key)

	// 						}

	// 					}

	// 					await KarmaFieldsAlpha.Database.Vars.set(["1"], driver, id, "trash");
	// 					await this.write(["0"], driver, id, "trash")

	// 					// await KarmaFieldsAlpha.Database.Vars.set(["0"], driver, id, "trash");
	// 					// await KarmaFieldsAlpha.Database.States.set(["0"], "external", driver, id, "trash");
	// 					// await KarmaFieldsAlpha.History.write(["0"], ["1"], "external", driver, id, "trash");

	// 					if (Object.values(defaults).length) {

	// 						// encapsulate in array
	// 						const payload = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, [value]]));

	// 						await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, { [id]: payload });

	// 					}

	// 				}

	// 				if (query.ids.some(id => typeof id !== "symbol")) {

	// 					console.error("ids shouldn't contain token yet!");

	// 				}

	// 				// await this.transformQuery(query, previousQuery, driver, paramstring);


	// 				// await KarmaFieldsAlpha.Database.fields.set(previousQuery, fieldId, "query");

	// 				await this.transformField(query, previousQuery, fieldId, "query");


	// 				// await KarmaFieldsAlpha.Database.States.set(ids, "queries", driver, paramstring, "ids");
	// 				// await KarmaFieldsAlpha.History.write(ids, previousIds, "queries", driver, paramstring, "ids"); // update history

	// 				// -> force reloading files (because some data were not loaded)
	// 				// await KarmaFieldsAlpha.Database.Queries.remove("query", driver, paramstring);
	// 				// const query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);
	// 				// query.complete = false;
	// 				// query.queried = 0;
	// 				// query.relationIndex = 0;

	// 				// await KarmaFieldsAlpha.Database.Queries.set(query);

	// 				this.needRender = true;

	// 			}

	// 		}

	// 		this.tasks.remove("post", "upload");

	// 	}

	// }

	// async doExport() {

	// 	const task = this.tasks.get("get", "export");

	// 	if (task) {

	// 		for (let driver in task) {

	// 			const grid = [];

	// 			// const {paramstrings, keys} = task[driver];
	// 			const { numPage, params, keys, ppp } = task[driver];

	// 			// for (let paramstring of paramstrings) {
	// 			for (let page = 1; page <= numPage; page++) {

	// 				const paramstring = KarmaFieldsAlpha.Params.stringify({ ...params, page, ppp });

	// 				await this.fetchQuery(driver, paramstring);

	// 				const query = this.store.get("query", driver, paramstring);

	// 				for (let id of query.ids) {

	// 					const row = [];

	// 					for (let key of keys) {

	// 						const value = await this.requestValue(driver, id, key, paramstring);

	// 						row.push(value);

	// 					}

	// 					grid.push(row);

	// 				}

	// 			}

	// 			this.store.set(grid, "export", driver);

	// 		}

	// 		this.tasks.remove("get", "export");

	// 	}

	// }

	// export(driver, params, keys, ppp) {

	// 	this.tasks.set({ params, keys, ppp }, "get", "export", driver);

	// }

	// clearExport() {

	// 	this.store.remove("export");

	// }

	// async doExport() {

	// 	const task = this.tasks.get("get", "export");

	// 	if (task) {

	// 		for (let driver in task) {

	// 			const { params, keys, ppp } = task[driver];
	// 			const grid = [];
	// 			let page = 0;

	// 			do {

	// 				page++;

	// 				const paramstring = KarmaFieldsAlpha.Params.stringify({ ...params, page, ppp });

	// 				const query = await this.fetchQuery(driver, paramstring);

	// 				await this.fetchCount(driver, paramstring);

	// 				for (let id of query.ids) {

	// 					const row = [];

	// 					for (let key of keys) {

	// 						const value = await this.requestValue(driver, id, key, paramstring);

	// 						row.push(value);

	// 					}

	// 					grid.push(row);

	// 				}

	// 			} while (query.count > page*ppp);

	// 			this.store.set(grid, "export", driver);

	// 		}

	// 		this.tasks.remove("get", "export");

	// 	}

	// }

	// export(field, driver, params, keys, ppp) {

	// 	this.tasks.set({ field, params, keys, ppp }, "get", "export", driver);

	// }

	// clearExport() {

	// 	this.store.remove("export");

	// }

	// async doExport() {

	// 	const task = this.tasks.get("get", "export");

	// 	if (task) {

	// 		for (let driver in task) {

	// 			const { field, keys, ppp } = task[driver];
	// 			const params = field.getParams();

	// 			if (!params) {

	// 				console.error("Exporting table but params are not set");

	// 			}
	// 			const grid = [];
	// 			let page = 0;

	// 			do {

	// 				page++;

	// 				const paramstring = KarmaFieldsAlpha.Params.stringify({ ...params, page, ppp });

	// 				const query = await this.fetchQuery(driver, paramstring);

	// 				await this.fetchCount(driver, paramstring);

	// 				for (let id of query.ids) {

	// 					const row = [];

	// 					for (let key of keys) {

	// 						const value = await this.requestValue(driver, id, key, paramstring);

	// 						row.push(value);

	// 					}

	// 					grid.push(row);

	// 				}

	// 			} while (query.count > page*ppp);

	// 			this.store.set(grid, "export", driver);

	// 		}

	// 		this.tasks.remove("get", "export");

	// 	}

	// }

	// swap(fieldId, driver, paramstring, index, length, target, sortableKey) {

	// 	let query = this.store.get("fields", fieldId, "query");

	// 	if (!query) {

	// 		query = this.store.get("query", driver, paramstring);

	// 	}

	// 	if (!query) {

	// 		console.error("adding item but query is not set");

	// 	}

	// 	const { ids, count } = query;
	// 	const previousQuery = { ids, count };
	// 	const newQuery = { ids: [...ids], count };

	// 	newQuery.ids.splice(target, 0, ...newQuery.ids.splice(index, length));

	// 	this.store.set(newQuery, "fields", fieldId, "query");
	// 	this.tasks.set({ query: newQuery, previousQuery, fieldId, sortableKey }, "post", "swap", driver, paramstring);

	// }

	// async doSwap() {

	// 	const task = this.tasks.get("post", "swap");

	// 	if (task) {

	// 		for (let driver in task) {

	// 			for (let paramstring in task[driver]) {

	// 				const { query, previousQuery, fieldId, sortableKey } = task[driver][paramstring];

	// 				for (let i = 0; i < query.ids.length; i++) {

	// 					if (query.ids[i] !== previousQuery.ids[i]) {

	// 						await this.write([i], driver, query.ids[i], sortableKey);

	// 					}

	// 				}

	// 				await this.transformField(query, previousQuery, fieldId, "query");

	// 			}

	// 		}

	// 		this.tasks.remove("post", "swap");
	// 	}

	// }

	// move(fieldId, driver, paramstring, index, length, params, destParamstring) {

	// 	let query = this.store.get("fields", fieldId, "query");

	// 	if (!query) {

	// 		query = this.store.get("query", driver, paramstring);

	// 	}

	// 	if (!query) {

	// 		console.error("moving item but query is not set");

	// 	}

	// 	const { ids, count } = query;
	// 	const previousQuery = { ids, count };
	// 	const newQuery = { ids: [...ids], count };

	// 	const movedIds = newQuery.ids.splice(index, length);

	// 	const task = { query: newQuery, previousQuery, fieldId, movedIds, params };

	// 	// const destQuery = this.store.get("query", driver, destParamstring);




	// 	// if (destQuery) {

	// 	// 	const { destIds } = destQuery;
	// 	// 	task.previousDestQuery = { ids: destIds, count };
	// 	// 	task.newDestQuery = { ids: [...destIds], count };
	// 	// 	task.newDestQuery.splice(destIndex, 0, movedIds);

	// 	// }

	// 	this.store.set(newQuery, "fields", fieldId, "query");
	// 	this.tasks.set(task, "post", "move", driver, paramstring);

	// 	this.queries.remove(driver, destParamstring);

	// }



	// async doMove() {

	// 	const task = this.tasks.get("post", "move");

	// 	if (task) {

	// 		for (let driver in task) {

	// 			for (let paramstring in task[driver]) {

	// 				const { query, previousQuery, fieldId, params, movedIds } = task[driver][paramstring];

	// 				const edits = {};

	// 				for (let id of movedIds) {

	// 					for (let key in params) {

	// 						const value = [params[key]];

	// 						await this.write(value, driver, id, key);

	// 						this.edits.remove(driver, id, key);

	// 						edits[id][key] = value;

	// 					}

	// 				}

	// 				await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, edits);

	// 				await this.transformField(query, previousQuery, fieldId, "query");

	// 			}

	// 		}

	// 		this.tasks.remove("post", "move");
	// 	}



	// 		  // KarmaFieldsAlpha.DeepObject.remove(KarmaFieldsAlpha.server.store, "ids", driver);

	// 		  // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, newIds, "ids", driver, paramstring);


	// 		  // await this.render();

	// 		  // // clear cache
	// 		  // await KarmaFieldsAlpha.Database.Queries.remove(driver);
	// 		  // await KarmaFieldsAlpha.Database.States.remove("queries", driver);


	// 		  // await KarmaFieldsAlpha.Database.States.set(newIds, "queries", driver, paramstring, "ids");
	// 		  // await KarmaFieldsAlpha.History.write(newIds, originalIds, "queries", driver, paramstring, "ids");

	// 		  // const parentKey = KarmaFieldsAlpha.Driver.getAlias(driver, "parent");

	// 		  // // update vars

	// 		  // for (let id of movedIds) {

	// 		  //   // await this.setWild(destId, id, "parent"); // just for update history

	// 		  //   const originId = params.parent || "";

	// 		  //   await KarmaFieldsAlpha.Database.Vars.set([destId], driver, id, parentKey);
	// 		  //   await KarmaFieldsAlpha.Database.States.set([destId], "external", driver, id, parentKey);
	// 		  //   await KarmaFieldsAlpha.History.write([destId], [originId], "external", driver, id, parentKey);

	// 		  // }

	// 		  // // save changes



	// 		  // const obj = Object.fromEntries(movedIds.map(id => [id, {[parentKey]: [destId]}]));
	// 		  // await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, obj);


	// }


  // async *getImage(id, driver = "medias") {
  //
	// 	const object = {};
  //
	// 	let filename = this.queryValue(driver, id, "filename");
	// 	let dir = this.queryValue(driver, id, "dir");
	// 	let mimetype = this.queryValue(driver, id, "mimetype");
	// 	let imageWidth = this.queryValue(driver, id, "width");
	// 	let imageHeight = this.queryValue(driver, id, "height");
  //
	// 	while (filename.loading || dir.loading || mimetype.loading || imageWidth.loading || imageHeight.loading) {
  //
  //     yield;
  //
	// 		filename = this.queryValue(driver, id, "filename");
	// 		dir = this.queryValue(driver, id, "dir");
	// 		mimetype = this.queryValue(driver, id, "mimetype");
	// 		imageWidth = this.queryValue(driver, id, "width");
	// 		imageHeight = this.queryValue(driver, id, "height");
  //
	// 	}
  //
	// 	object.width = imageWidth.toString();
	// 	object.height = imageHeight.toString();
	// 	object.src = `${KarmaFieldsAlpha.uploadURL}${dir.toString()}/${filename.toString()}`;
  //
	// 	if (mimetype.toString() === "image/jpeg" || mimetype.toString() === "image/jpg" || mimetype.toString() === "image/png" || mimetype.toString() === "image/webp") {
  //
	// 		let sizes = this.getWild("medias", object.id, "sizes");
  //
	// 		while (sizes.loading) {
  //
  //       yield;
  //
	// 			sizes = this.queryValue(driver, object.id, "sizes");
  //
	// 		}
  //
	// 		if (sizes.toArray().length) {
  //
	// 			object.srcset = sizes.toArray().map(size => `${KarmaFieldsAlpha.uploadURL}${dir.toString()}/${size.filename} ${size.width}w`).join(",");
	// 			object.sizes = "(min-width: 1024px) 1024px, 100vw";
  //
	// 		}
  //
	// 	}
  //
  //
	// }
	//
	//


	isToken(id) {

		return parseInt(id) < 0;

	}

	createToken() {

		return this.token--;

	}

	createTokens(length) {

		return this.generateTokens(length).toArray();

	}

	*generateTokens(length) {

		for (let i = 0; i < length; i++) {

			yield this.createToken();

		}

	}

	getEdits() {

		return this.edits.get();

	}

	submit() {

		// const edits = this.edits.getAll();
		// this.edits.clear();

		const edits = this.edits.get();

		for (let driver in edits) {

			for (let id in edits[driver]) {

				if (this.isToken(id)) {

					const [trash] = this.store.get("vars", driver, id, "trash") || [];

					if (trash !== "1") {

						this.tasks.set(edits[driver][id], "post", "add", driver, id);

					}

				} else {

					this.tasks.set(edits[driver][id], "post", "update", driver, id);

				}

			}

			this.tasks.set(true, "clear", "queries", driver);

		}

		this.edits.clear();

		// // clear all add/delete data in fields + spot things to add
		const states = this.store.get("fields");

		if (states) {

			for (let fieldId in states) {

				for (let key in states[fieldId]) {

					if (key === "ids") {

						this.tasks.set(states[fieldId][key], "clear", "state", "ids", fieldId);

					}

				}

			}

		}

		// get all queries to reload


		this.tasks.set(edits, "post", "submit");

	}

	async doSubmit() {

		const addTasks = this.tasks.get("post", "add");

		if (addTasks) {

			for (let driver of addTasks) {

				for (let token of addTasks[driver]) {

					let id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`);
					id = id.toString();

					this.tasks.set(addTasks[driver][token], "post", "update", id);

				}

			}

			this.tasks.remove("post", "add");

		}

		const updateTasks = this.tasks.get("post", "update");

		if (updateTasks) {

			for (let driver in updateTasks) {

				await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, updateTasks[driver]);

			}

			this.tasks.remove("post", "update");

		}

		const clearQueryTasks = this.tasks.get("clear", "queries");

		if (clearQueryTasks) {

			for (let driver in clearQueryTasks) {

				this.queries.remove(driver);

			}

			this.tasks.remove("clear", "queries");

		}

		const clearIdsTasks = this.tasks.get("clear", "state", "ids");

		if (clearIdsTasks) {

			for (let fieldId in clearIdsTasks) {

				await this.transformState(null, clearIdsTasks[fieldId], fieldId, "ids");

			}

			this.tasks.remove("clear", "state", "ids");

		}





		// if (task) {



		// 	// const states = this.store.get("fields");

		// 	// if (states) {

		// 	// 	for (let fieldId in states) {

		// 	// 		if (states[fieldId].sockets) {

		// 	// 			const sockets = states[fieldId].sockets;

		// 	// 			this.store.remove("fields", fieldId, "sockets");

		// 	// 			for (let socket of sockets) {

		// 	// 				if (socket.new) {

		// 	// 					let id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`);

		// 	// 					id = id.toString();

		// 	// 					const driver = socket.driver;

		// 	// 					if (socket.data) {

		// 	// 						this.store.set(socket.data, "vars", driver, id);

		// 	// 						// await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, socket.data);

		// 	// 						for (let key in socket.data) {

		// 	// 							await this.write(socket.data[key], driver, id, key);

		// 	// 						}

		// 	// 					}

		// 	// 					await KarmaFieldsAlpha.Database.Vars.set(["1"], driver, id, "trash");
		// 	// 					await this.write(["0"], driver, id, "trash");

		// 	// 				}

		// 	// 			}



		// 	// 		}



		// 	// 	}

		// 	// }


		// 	// const states = await KarmaFieldsAlpha.Database.States.select("external");
		// 	// const edits = await KarmaFieldsAlpha.Database.edits.getAll();
		// 	// const edits = this.edits.getAll();
		// 	const data = {};

		// 	for (let edit of task.edits) {

		// 		KarmaFieldsAlpha.DeepObject.set(data, edit.value, edit.driver, edit.id, edit.key);

		// 		await KarmaFieldsAlpha.Database.Vars.set(edit.value, edit.driver, edit.id, edit.key);

		// 	}

		// 	for (let driver in data) {

		// 		await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, data[driver]);

		// 	}

		// 	this.edits.clear();

		// 	for (let query of queriesToReload) {

		// 		await this.fetchQuery(query.driver, query.paramstring, true);
		// 		await this.transformField(null, query, fieldId, key);

		// 	}


		// 	// const states = this.store.get("fields");

		// 	// if (states) {

		// 	// 	for (let fieldId in states) {

		// 	// 		for (let key in states[fieldId]) {

		// 	// 			if (states[fieldId][key] === "query") {

		// 	// 				const query = this.store.get("fields", fieldId, "query");

		// 	// 				if (query) {

		// 	// 					await this.fetchQuery(request.driver, request.paramstring, true);

		// 	// 					await this.transformField(null, query, fieldId, key);

		// 	// 				}

		// 	// 			}

		// 	// 		}

		// 	// 	}

		// 	// }

		// 	// OR

		// 	// for (let state of this.fields.query({key: "query"})) {

		// 	// 	const request = this.get("store", "fields", state.fieldId, "request");

		// 	// 	if (request) {

		// 	// 		await this.fetchQuery(request.driver, request.paramstring, true);

		// 	// 	}

		// 	// }



		// 	this.tasks.remove("post", "submit");

		// }

	}

	// async processSubmit() {

	// 	const edits = this.edits();
	// 	const delta = await this.groupData(edits);

	// 	for (let driver in delta) {

	// 		// yield;

	// 		await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, delta[driver]);

	// 		await KarmaFieldsAlpha.Database.States.remove("external", driver);
	// 		await KarmaFieldsAlpha.Database.Queries.remove({ driver });
	// 		await KarmaFieldsAlpha.Database.States.remove("queries", driver);

	// 		for (let id in delta[driver]) {

	// 			for (let key in delta[driver][id]) {

	// 				await KarmaFieldsAlpha.Database.Vars.set(delta[driver][id][key], driver, id, key);

	// 			}

	// 		}

	// 	}

	// 	this.needRender = true;

	// 	// for await (let edit of edits) {
	// 	//
	// 	//   await KarmaFieldsAlpha.Database.Vars.set(edit.data, edit.driver, edit.id, edit.key);
	// 	//
	// 	// }

	// }





 //  async submitOLD() {

 //    const edits = this.edits();
 //    const delta = await this.groupData(edits);

 //    for (let driver in delta) {

 //      // yield;

 //      await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, delta[driver]);

 //      await KarmaFieldsAlpha.Database.States.remove("external", driver);
 //      await KarmaFieldsAlpha.Database.Queries.remove({driver});
 //      await KarmaFieldsAlpha.Database.States.remove("queries", driver);

 //      for (let id in delta[driver]) {

 //        for (let key in delta[driver][id]) {

 //          await KarmaFieldsAlpha.Database.Vars.set(delta[driver][id][key], driver, id, key);

 //        }

 //      }

 //    }

 //    // for await (let edit of edits) {
 //    //
 //    //   await KarmaFieldsAlpha.Database.Vars.set(edit.data, edit.driver, edit.id, edit.key);
 //    //
 //    // }

 //  }

 //  async isValueModified(value, driver, id, key) {

 //    const current = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

 //    return !KarmaFieldsAlpha.DeepObject.equal(value, current);

 //  }

 //  async groupData(items) {

 //    const output = {};

 //    for await (let item of items) {

 //      if (!output[item.driver]) {

 //        output[item.driver] = {};

 //      }

 //      if (!output[item.driver][item.id]) {

 //        output[item.driver][item.id] = {};

 //      }

 //      output[item.driver][item.id][item.key] = item.data;

 //    }

 //    return output;

 //  }

 //  getDelta() { // compat. Used by postform!

 //    const edits = this.edits();

 //    return this.groupData(edits);

 //  }

 //  async *edits() {

 //    const edits = await KarmaFieldsAlpha.Database.States.select("external");

 //    for (let item of edits) {

 //      const isModified = await this.isValueModified(item.data, item.driver, item.id, item.key);

 //      if (isModified) {

 //        yield item;

 //      }

 //    }

 //  }

  // async initDelta() {

  //   const result = await this.edits().next();

  //   KarmaFieldsAlpha.DeepObject.set(this.store, !result.done, "delta");

  // }

  // hasDelta() {

  //   return KarmaFieldsAlpha.DeepObject.get(this.store, "delta") || false;

  // }

	changeHistory(index, current) {

		this.tasks.set({ index, current }, "get", "history");

	}

	async doHistory() { // called on popstate

		const task = this.tasks.get("get", "history");

		if (task) {

			const { current, index } = task;

			while (current !== index) {

				if (current > index) {

					current--;

				} else {

					current++;

				}

				const edits = await KarmaFieldsAlpha.Database.History.select(current);

				if (edits) {

					for (let edit of edits) {

						// await KarmaFieldsAlpha.Database.States.set(edit.data, edit.context, edit.driver, edit.id, edit.key);

						if (edit.context === "external") {

							await KarmaFieldsAlpha.Database.edits.set(edit.data, edit.driver, edit.id, edit.key);

							this.store.set(edit.data, "vars", edit.driver, edit.id, edit.key);

						} else if (edit.context === "internal" && edit.driver === "fields") {

							await KarmaFieldsAlpha.Database.fields.set(edit.data, edit.id, edit.key);

							this.store.set(edit.data, "fields", edit.id, edit.key);

						// } else if (edit.context === "internal" && edit.driver === "query") {

						// 	// await KarmaFieldsAlpha.Database.queries.set(edit.data, edit.driver, edit.id, edit.key);

						// 	this.set(edit.data, "store", "query", edit.id, edit.key);

						}


					}

				}


				// await KarmaFieldsAlpha.Database.States.insert(states, current);

			}

			// while (current < index) {

			// 	current++;

			// 	const states = await KarmaFieldsAlpha.Database.History.select(current);

			// 	await KarmaFieldsAlpha.Database.States.insert(states, current);

			// 	// await KarmaFieldsAlpha.Database.History.revert(current);

			// }

			this.tasks.remove("get", "history");
		}



		// KarmaFieldsAlpha.Session.setValue(current, "karmaHistoryIndex");

	}


}
