

KarmaFieldsAlpha.field.table = class extends KarmaFieldsAlpha.field.container {

  constructor(resource, id, parent) {

    if (resource.table) {

      resource = {...KarmaFieldsAlpha.tables[resource.table], ...resource};

    }

    super(resource, id, parent);

    // this.loading = true;

  }

  // queryParams() {

  //   console.error("deprecated");

  //   let params = super.queryParams();

  //   if (!params.loading && !params.string) {

  //     params.string = KarmaFieldsAlpha.Params.stringify(params.value);

  //   }

  //   return params;

  // }

	// getIds(driver, paramstring) {

	// 	if (!driver) {

	// 		driver = this.getDriver();

	// 	}

	// 	if (paramstring === undefined) {

	// 		paramstring = this.getParamstring() || "";

	// 	}

	// 	return KarmaFieldsAlpha.server.queryIds(driver, paramstring);




	// }

	// getQueryNEW() {

	// 	const response = new KarmaFieldsAlpha.Content();

	// 	let query = KarmaFieldsAlpha.server.getState(this.uid, "query");

	// 	if (query) {

	// 		response.value = query;

	// 	} else {

	// 		let request = KarmaFieldsAlpha.server.getTempo("state", this.uid, "request");

	// 		if (!request) {

	// 			let params = KarmaFieldsAlpha.server.getState(this.uid, "params");

	// 			if (!params) {

	// 				const parsing  = this.parse(this.resource.params);

	// 				if (!parsing.loading) {

	// 					params = parsing.toObject();

	// 				}

	// 			}

	// 			if (params) {

	// 				const driver = this.getDriver();
	// 				const paramstring = KarmaFieldsAlpha.Params.stringify(params);

	// 				request = { driver, params, paramstring };

	// 				KarmaFieldsAlpha.server.setTempo(request, "state", this.uid, "request");

	// 			}

	// 		}

	// 		if (!request) {

	// 			response.loading = true;

	// 		} else {

	// 			const query = KarmaFieldsAlpha.server.getQuery(request.driver, request.paramstring);

	// 			if (query) {

	// 				response.value = query;

	// 			} else {

	// 				response.loading = true;

	// 			}

	// 		}

	// 	}

	// 	return response;

	// }

	// getQueryNEW() {

	// 	const response = new KarmaFieldsAlpha.Content();

	// 	let query = KarmaFieldsAlpha.server.getState(this.uid, "query");

	// 	if (query) {

	// 		response.value = query;

	// 	} else {

	// 		let driver = KarmaFieldsAlpha.server.getTempo("state", this.uid, "driver");
	// 		let paramstring = KarmaFieldsAlpha.server.getTempo("state", this.uid, "paramstring");

	// 		if (!driver || !paramstring) {

	// 			let params = KarmaFieldsAlpha.server.getState(this.uid, "params");

	// 			if (!params) {

	// 				const parsing  = this.parse(this.resource.params);

	// 				if (!parsing.loading) {

	// 					params = parsing.toObject();

	// 				}

	// 			}

	// 			if (params) {

	// 				driver = this.getDriver();
	// 				paramstring = KarmaFieldsAlpha.Params.stringify(params);

	// 				KarmaFieldsAlpha.server.setTempo(driver, "state", this.uid, "driver");
	// 				KarmaFieldsAlpha.server.setTempo(paramstring, "state", this.uid, "paramstring");

	// 			}

	// 		}

	// 		if (driver && paramstring) {

	// 			const query = KarmaFieldsAlpha.server.getQuery(driver, paramstring);

	// 			if (query) {

	// 				response.value = query;

	// 			} else {

	// 				response.loading = true;

	// 			}

	// 		} else {

	// 			response.loading = true;

	// 		}

	// 	}

	// 	return response;

	// }

	// getQueryNEW() {

	// 	let query = KarmaFieldsAlpha.server.getState(this.uid, "query"); // -> for added/deleted items

	// 	if (!query) {

	// 		let driver = this.getDriver();
	// 		let paramstring = this.getParamstring();

	// 		if (driver && paramstring) {

	// 			query = KarmaFieldsAlpha.server.getQuery(driver, paramstring);

	// 		}

	// 	}

	// 	return query;

	// 	// const response = new KarmaFieldsAlpha.Content();

	// 	// if (query) {

	// 	// 	response.value = query;

	// 	// } else {

	// 	// 	response.loading = true;

	// 	// }

	// 	// return response;

	// }

	// getQuery() {

	// 	let query = KarmaFieldsAlpha.server.getState(this.uid, "query"); // -> for added/deleted items

	// 	if (!query) {

	// 		query = super.getQuery();

	// 	}

	// 	return query;

	// }

	close() {

		delete this.element;

		super.close();

	}

	// getDefaults() {

	// 	let defaults = super.getDefaults();

	// 	const header = this.getHeader();

	// 	if (header) {

	// 		const params = header.getDefaults();

	// 		if (params === undefined) {

	// 			return undefined;

	// 		}

	// 		Object.assign(defaults, params);

	// 	}

	// 	const footer = this.getFooter();

	// 	if (footer) {

	// 		const params = footer.getDefaults();

	// 		if (params === undefined) {

	// 			return undefined;

	// 		}

	// 		Object.assign(defaults, params);

	// 	}

	// 	return defaults;

	// }

	getDefaults() {

		if (this.resource.defaults) {

			return this.parseObject(this.resource.defaults);

		}

		return {};

	}

	getFilters() {

		const { page, ppp, order, orderby, ...filters } = this.getParams() || {};

		return filters;

	}

	getParam(key) {

		const params = this.getParams();

		if (params !== undefined) {

			return params[key] || "";

		}

	}

	getParams() {

		const defaults = this.parseObject(this.resource.params || {});

		if (defaults === undefined) {

			return;

		}

		const params = KarmaFieldsAlpha.server.getState(this.uid, "params");

		return { ...defaults, ...params };

	}

	getParamstring() {



		let paramstring = KarmaFieldsAlpha.server.getTempo("state", this.uid, "paramstring");

		if (paramstring === undefined) {

			// let defaults = this.getDefaults();

			// if (defaults === undefined) {

			// 	return;

			// }

			let params = this.getParams();

			if (params === undefined) {

				return;

			}

			// paramstring = KarmaFieldsAlpha.Params.stringify({ ...defaults, ...params });
			paramstring = KarmaFieldsAlpha.Params.stringify(params);

			KarmaFieldsAlpha.server.setTempo(paramstring, "state", this.uid, "paramstring");

		}

		return paramstring;

	}


	setParam(value, key) {

		let params = this.getParams();

		if (!params) {

			console.error("setting params but params is not loaded");

			return;

		}

		params = { ...params, [key]: value };

		// KarmaFieldsAlpha.server.setState(params, this.uid, "params");

		this.setState(params, "params");


		const body = this.getChild("body");

		body.removeState("ids");

		// KarmaFieldsAlpha.server.removeState(this.uid, "query"); // -> added/removed ids data

	}

	getQuery() {

		// if (!this.resource.driver) {

		// 	console.error("Getting query by driver is not set", this);

		// }

		let driver = this.getDriver();
		let paramstring = this.getParamstring();

		if (driver && paramstring !== undefined) {

			return KarmaFieldsAlpha.server.getQuery(driver, paramstring);

		}

		// } else if (this.parent) {

		// 	return this.parent.getQuery();

		// }

	}

	setQuery(query) {

		let driver = this.getDriver();
		let paramstring = this.getParamstring();

		if (paramstring === undefined) {

			console.error("setting query but paramstring is undefined");

		}

		KarmaFieldsAlpha.server.setQuery(query, driver, paramstring);

		// if (this.resource.driver) {

		// 	let driver = this.getDriver();
		// 	let paramstring = this.getParamstring();

		// 	if (paramstring === undefined) {

		// 		console.error("setting query but paramstring is undefined");

		// 	}

		// 	KarmaFieldsAlpha.server.setQuery(query, driver, paramstring);

		// } else if (this.parent) {

		// 	this.parent.setQuery(query);

		// }

	}

	removeQuery() {

		if (this.resource.driver) {

			let driver = this.getDriver();
			let paramstring = this.getParamstring();

			if (paramstring === undefined) {

				console.error("removing query but paramstring is undefined");

			}

			KarmaFieldsAlpha.server.removeQuery(driver, paramstring);

		} else if (this.parent) {

			this.parent.removeQuery();

		}

	}

	getIds() {

		const query = this.getQuery();

		if (query) {

			return query.ids;

		}

		// if (!response.loading) {

		// 	const content = new KarmaFieldsAlpha.Content();

		// 	content.value = response.toObject().ids;

		// 	return content;
		// }

		// return response;

	}

	setIds(ids) {

		const query = this.getQuery();

		if (query === undefined) {

			console.error("setting ids but query is undefined");

		}

		const count = query.count || 0;

		this.setQuery({ ids, count });

	}

	submit() {

		KarmaFieldsAlpha.server.submit();

	}


	getBody() {

		return this.createChild({
			type: "grid",
			children: this.resource.children, // compat
			...this.resource.body
		}, "body");

	}

	// getPopup() {

	// 	if (this.resource.popup) {

	// 		const popup = this.createChild({
	// 			type: "popup",
	// 			content: this.resource.popup
	// 		}, "popup");

	// 		if (popup.hasFocusInside()) {

	// 			return popup;

	// 		}

	// 	}

	// }

	// getLength() {

	// 	const query = this.getQuery();

	// 	if (query) {

	// 		return query.ids.length;

	// 	}

	// }

  // queryLength() {

  //   const response = new KarmaFieldsAlpha.Content();

  //   const ids = this.getIds();

  //   if (ids.loading) {

  //     response.loading = true;

  //   } else {

  //     response.value = ids.toArray().length;

  //   }

  //   return response;
  // }

	// getContentRange(index, length, key, paramstring, driver) {

	//   if (paramstring === undefined) {

	//     paramstring = this.getParamstring() || "";

	//   }

	//   if (!driver) {

	//     driver = this.getDriver();

	//   }

	//   const response = new KarmaFieldsAlpha.Content();


	//   const values = [];

	//   for (let i = 0; i < length; i++) {

	//     const value = KarmaFieldsAlpha.server.queryValueAt(driver, paramstring, index + i, key);

	//     values.push(value);

	//   }

	//   if (values.some(value => value.loading)) {

	//     response.loading = true;

	//   } else if (values.slice(1).some(value => !value.equals(values[0]))) {

	//     response.mixed = true;
	//     response.value = values.map(value => value.toArray());

	//   } else if (values.length > 0) {

	//     response.value = values[0].value;

	//   }

	//   return response;

	// }

	// getValueRange(index, length, key) {

	// 	const paramstring = this.getParamstring();
	// 	const driver = this.getDriver();

	// 	let values;

	// 	if (paramstring && driver) {

	// 		values = [];

	// 		for (let i = 0; i < length; i++) {

	// 			const value = KarmaFieldsAlpha.server.getValueAt(driver, paramstring, index + i, key);

	// 			values.push(value);

	// 		}

	// 		if (values.some(value => value === undefined)) {

	// 			values = undefined;

	// 		} else {

	// 			if (values.slice(1).some(value => !KarmaFieldsAlpha.DeepObject.equal(value, values[0]))) {

	// 				values.mixed = true; // adding a custom param to array

	// 			} else if (values.length > 0) { // -> all fields have same value

	// 				values = values[0];

	// 			}

	// 		}

	// 	}

	// 	// compat
	// 	const response = new KarmaFieldsAlpha.Content();

	// 	if (values === undefined) {

	// 		response.loading = true;

	// 	} else {

	// 		response.value = values;
	// 		response.mixed = values.mixed;

	// 	}

	// 	return response;
	// }



	getValues(key, ...ids) {

		const values = [];

		for (let id of ids) {

			const value = this.getValue(key, id, driver);

			values.push(value);

		}

		if (!values.some(value => value === undefined)) {

			if (values.slice(1).some(value => !KarmaFieldsAlpha.DeepObject.equal(value, values[0]))) {

				values.mixed = true; // adding a custom param to buildin array!

				return values;

			} else if (values.length > 0) { // -> all fields have same value

				return values[0];

			}

		}

	}

	// getContentAt(index, key, paramstring, driver) {

	//   if (paramstring === undefined) {

	//     paramstring = this.getParamstring() || "";

	//   }

	//   if (!driver) {

	//     driver = this.getDriver();

	//   }

	//   return KarmaFieldsAlpha.server.queryValueAt(driver, paramstring, index, key);

	// }

 //  // -> to replace getContentAt
	// getValueAtNEW(index, key) {

	// 	const queryResponse = this.getQueryNEW();

	// 	if (queryResponse.loading) {

	// 		return queryResponse;

	// 	}

	// 	const query = queryResponse.toObject();

	// 	const response = KarmaFieldsAlpha.server.getValueAt(query, index, key);

	// 	if (response.loading && !response.requested) {

	// 		KarmaFieldsAlpha.server.requestValueAt(query, index, key);

	// 	}

	// 	return response;
	// }

	// getRequest() {

	// 	// let request = KarmaFieldsAlpha.server.get("state", this.uid, "request");

	// 	let request = KarmaFieldsAlpha.server.getState(this.uid, "request");

	// 	if (request === undefined) {

	// 		const response = this.parse(this.resource.params);

	// 		if (!response.loading) {

	// 			const params = response.toObject();
	// 			const driver = this.getDriver();
	// 			const paramstring = KarmaFieldsAlpha.Params.stringify(params);

	// 			request = { driver, params, paramstring };

	// 			KarmaFieldsAlpha.server.createState(request, this.uid, "request");

	// 		}

	// 	}

	// 	return request;

	// }

	// getParam(key) {

	// 	const request = this.getParams();

	// 	return request && request.params[key] || "";

	// }

	// getParams() {

	// 	let params = KarmaFieldsAlpha.server.getState(this.uid, "params");

	// 	if (!params) {

	// 		params = KarmaFieldsAlpha.server.getTempo("state", this.uid, "params");

	// 		const parsing  = this.parse(this.resource.params);

	// 		if (!parsing.loading) {

	// 			params = parsing.toObject();

	// 			KarmaFieldsAlpha.server.setTempo(params, "state", this.uid, "params");

	// 		}

	// 	}

	// 	return params;
	// }

	// getParamstring() {

	// 	let paramstring = KarmaFieldsAlpha.server.getTempo("state", this.uid, "paramstring");

	// 	if (!paramstring) {

	// 		let params = this.getParams();

	// 		if (params) {

	// 			paramstring = KarmaFieldsAlpha.Params.stringify(params);

	// 			KarmaFieldsAlpha.server.setTempo(paramstring, "state", this.uid, "paramstring");

	// 		}

	// 	}

	// 	return paramstring;

	// }

	// // setParam(value, key) {

	// // 	const request = this.getRequest();

	// // 	if (!request) {

	// // 		console.error("setting params but request is not set");

	// // 	}

	// // 	const params = { ...request.params, [key]: value };

	// // 	const newRequest = this.createRequest(params);

	// // 	KarmaFieldsAlpha.server.setState(newRequest, this.uid, "request");

	// // }

	// setParam(value, key) {

	// 	let params = KarmaFieldsAlpha.server.getState(this.uid, "params");

	// 	if (!params) {

	// 		console.error("setting params but params is not set"); // or is it ok?

	// 		params = {};

	// 	}

	// 	params = { ...params, [key]: value };

	// 	KarmaFieldsAlpha.server.setState(params, this.uid, "params");

	// 	KarmaFieldsAlpha.server.removeState(this.uid, "query"); // -> added/removed ids data

	// }

	// getValueAt(index, key) {

	// 	const paramstring = this.getParamstring();
	// 	const driver = this.getDriver();

	// 	if (paramstring && driver) {

	// 		return KarmaFieldsAlpha.server.getValueAt(driver, paramstring, index, key);

	// 	}

	// 	// // compat
	// 	// const response = new KarmaFieldsAlpha.Content();

	// 	// if (!value) {

	// 	// 	response.value = value;

	// 	// } else {

	// 	// 	response.loading = true;

	// 	// }

	// 	// return response;
	// }

	getValue(key, id, driver) {

		if (key === undefined) { // -> get ids

			const query = this.getQuery();

			if (query) {

				return query.ids || [];

			}

		} else if (id === undefined) {

			if (key === "numpage") {

				const value = this.getNumPage();

				if (value === undefined) {

					return;

				}

				return [value || 1];

			} else if (key === "page") {

				const value = this.getPage();

				if (value === undefined) {

					return;

				}

				return [value || 1];

			} else if (key === "count") {

				const value = this.getCount();

				if (value === undefined) {

					return;

				}

				return [value || 0];

			} else {

				const value = this.getParam(key);

				if (value === undefined) {

					return;

				}

				return [value];

			}

		} else {

			const paramstring = this.getParamstring();

			if (paramstring === undefined) {

				return;

			}

			if (!driver) {

				driver = this.getDriver();

			}

			return KarmaFieldsAlpha.server.getValue(driver, id, key, paramstring);

		}

	}

	setValue(value, key, id, driver) {

		if (!Array.isArray(value)) {

			console.error("setting value but value is not an array");

		}

		if (id === undefined) {

			this.setParam(value[0], key);

		} else {

			const paramstring = this.getParamstring();

			if (paramstring === undefined) {

				console.error("setting value at but paramstring/driver not set");

			}

			if (!driver) {

				driver = this.getDriver();

			}

			KarmaFieldsAlpha.server.setValue(value, driver, id, key, paramstring);

			// const query = this.getQuery();

			// if (query) {

			// 	const ids = query.ids || [];
			// 	const id = ids[index];

			// 	if (!id) {

			// 		console.error("index is out of bounds");

			// 	}

			// 	KarmaFieldsAlpha.server.setValue(value, driver, id, key);

			// } else {

			// 	console.error("setting value at but query is not ready");

			// }

		}

	}

	reorder(newIds) {

		const sortableKey = this.resource.sortable;

		// compat
		if (this.resource.sortable === true) {

			sortableKey = "position";

		}

		if (!sortableKey) {

			console.error("not sortable!");
			return;

		}

		const query = this.getQuery();

		if (query === undefined) {

			console.error("reordering items but query is undefined");

		}

		for (let i = 0; i < newIds.length; i++) {

			if (newIds[i] !== query.ids[i]) {

				this.setValue(i, sortableKey, newIds[i]);

			}

		}

	}


	// setValueAt(value, index, key) {

	// 	// compat
	// 	if (value instanceof KarmaFieldsAlpha.Content) {

	// 		value = value.toArray();

	// 	}

	// 	if (!Array.isArray(value)) {

	// 		console.error("setting value at but value is not an array");

	// 	}

	// 	const paramstring = this.getParamstring();
	// 	const driver = this.getDriver();

	// 	if (!paramstring || !driver) {

	// 		console.error("setting value at but paramstring/driver not set");

	// 	}

	// 	const query = this.getQuery();

	// 	if (query) {

	// 		const ids = query.ids || [];
	// 		const id = ids[index];

	// 		if (!id) {

	// 			console.error("index is out of bounds");

	// 		}

	// 		KarmaFieldsAlpha.server.setValue(value, id, key);

	// 	} else {

	// 		console.error("setting value at but query is not ready");

	// 	}

	// }

  // setValueAt(value, index, key, driver, paramstring) {

  //   if (paramstring === undefined) {

  //     paramstring = this.getParamstring() || "";

  //   }

  //   if (!driver) {

  //     driver = this.getDriver();

  //   }

  //   return KarmaFieldsAlpha.server.setValueAt(value, driver, paramstring, index, key);

  // }


  // getOptionsList(driver, paramstring, keys = ["name"]) {

  //   const response = new KarmaFieldsAlpha.Content();

  //   // const ids = KarmaFieldsAlpha.server.queryIds(driver || this.driver, paramstring ?? this.paramstring);

  //   const query = this.getIds(driver, paramstring);

  //   if (query.loading) {

  //     response.loading = true;

  //   } else {

  //     response.value = [];

  //     const ids = query.toArray();

  //     for (let i = 0; i < ids.length; i++) {

  //       const id = ids[i];
  //       const item = {id};

  //       for (let key of keys) {

  //         // const content = this.server.getValueAt(driver || this.driver, paramstring ?? this.paramstring, i, key);
  //         const content = this.getContentAt(i, key, paramstring, driver);

  //         if (content.loading) {

  //           response.loading = true;
  //           break;

  //         } else {

  //           item[key] = content.toString();

  //         }

  //       }

  //       response.value.push(item);

  //     }

  //   }

  //   return response;

  // }



  // queryCount(driver, paramstring) {


  //   if (paramstring === undefined) {

  //     paramstring = this.getParamstring() || "";

  //   }

  //   if (!driver) {

  //     driver = this.getDriver();

  //   }

  //   return KarmaFieldsAlpha.server.queryCount(driver, paramstring);

  // }

  // getCount(driver, paramstring) {

  //   return this.queryCount().toNumber();

  // }
//

	getCount() {

		const query = this.getQuery();

		if (query) {

			return query.count;

		}

	}

	getPage() {

		return this.getParam("page");

	}

  // queryPage() {

  //   const content = new KarmaFieldsAlpha.Content();

  //   const params = this.getParams() || {};

  //   content.value = params.page || 1;

  //   return content;

  // }

	getPpp() {

		let ppp = this.getTempo("ppp");

		if (ppp === undefined) {

			ppp = this.getParam("ppp");

			if (!ppp) {

				const defaults = this.getDefaults();

				if (defaults === undefined) {

					return;

				} else {

					ppp = defaults.ppp || 100;

				}

			}

			ppp = Number(ppp);

			this.setTempo(ppp, "ppp");

		}

		return ppp;

	}

  // queryPpp() {

  //   const response = new KarmaFieldsAlpha.Content();

  //   response.value = this.getPpp();

  //   return response;
  // }

	getIndex() {

		const page = this.getPage();
		const ppp = this.getPpp();

		if (page !== undefined && ppp !== undefined) {

			return (page - 1) * ppp;

		}

	}

	getNumPage() {

		const count = this.getCount();
		const ppp = this.getPpp();

		if (count !== undefined && ppp !== undefined) {

			return Math.max(1, Math.ceil(count / ppp));

		}

	}

	// getNumPage() {

	// 	const count = this.getCount();
	// 	const ppp = this.getPpp();

	// 	return Math.max(1, Math.ceil(count / ppp));
	// }

	isFirstPage() {

		return this.getPage() === 1;

	}

	isLastPage() {

		return this.getPage() === this.getNumPage();

	}

	setPage(page) {

		return this.setParam(page, "page");

	}

	firstPage() {

		const page = this.getPage();

		if (page === undefined) {

			console.error("requesting first page but page is not set");
			return;

		}

		this.save("changePage", "Change Page");

		this.setParam(1, "page");

	}

	prevPage() {

		const page = this.getPage();

		if (page === undefined) {

			console.error("requesting previous page but page is not set");
			return;

		}

		if (page > 1) {

			this.save("changePage", "Change Page");
			this.setParam(page - 1, "page");

		}

	}

	nextPage() {

		let page = this.getPage();
		let numPage = this.getNumPage();

		if (page === undefined) {

			console.error("requesting next page but page is not set");
			return;

		}

		if (numPage === undefined) {

			console.error("requesting next page but numPage is not set");
			return;

		}

		if (page < numPage) {

			this.save("changePage", "Change Page");
			this.setParam(page + 1, "page");

		}

	}

	lastPage() {

		let page = this.getPage();
		let numPage = this.getNumPage();

		if (page === undefined) {

			console.error("requesting next page but page is not set");
			return;

		}

		if (numPage === undefined) {

			console.error("requesting next page but numPage is not set");
			return;

		}

		if (page < numPage) {

			this.save("changePage", "Change Page");
			this.setParam(numPage, "page");

		}

	}

	paste(value) {

		const body = this.getBody();

		if (body) {

			body.paste(value);

		}

	}



	// addTokens(tokens, params = {}, ids) {

	// 	const driver = this.getDriver();
	// 	const paramstring = this.getParamstring();

	// 	if (paramstring === undefined) {

	// 		console.error("adding item but paramstring is not set");

	// 	}

	// 	const defaults = this.getDefaults();
	// 	const filters = this.getFilters();

	// 	params = { ...defaults, ...filters, ...params };

	// 	for (let token of tokens) {

	// 		for (let key in params) {

	// 			this.setValue([params[key]], key, token);

	// 		}

	// 		this.setValue(["0"], "trash", token);

	// 	}

	// 	KarmaFieldsAlpha.server.queries.set(true, driver, paramstring, "stalled");
	// 	KarmaFieldsAlpha.server.queries.set(ids, driver, paramstring, "ids");


	// 	// KarmaFieldsAlpha.server.add(this.uid, driver, paramstring, index, length, {...params, ...itemParams}, data);

	// }

	// setIds(ids) {

	// 	const driver = this.getDriver();
	// 	const paramstring = this.getParamstring();

	// 	if (paramstring === undefined) {

	// 		console.error("setting ids but paramstring is not set");

	// 	}


	// 	KarmaFieldsAlpha.server.queries.set(true, driver, paramstring, "stalled");
	// 	KarmaFieldsAlpha.server.queries.set(ids, driver, paramstring, "ids");

	// }

	// setQuery(newQuery) {

	// 	const driver = this.getDriver();
	// 	const paramstring = this.getParamstring();

	// 	if (paramstring === undefined) {

	// 		console.error("setting ids but paramstring is not set");

	// 	}

	// 	const currentQuery = KarmaFieldsAlpha.server.queries.get(driver, paramstring);

	// 	KarmaFieldsAlpha.server.queries.set({ ...currentQuery, ...newQuery }, driver, paramstring);


	// 	// KarmaFieldsAlpha.server.queries.set(true, driver, paramstring, "stalled");
	// 	// KarmaFieldsAlpha.server.queries.set(ids, driver, paramstring, "ids");

	// }

	// createTokens(length, params) {

	// 	const tokens = KarmaFieldsAlpha.server.createTokens(length);

	// 	if (tokens.length) {

	// 		const defaults = this.getDefaults();
	// 		const filters = this.getFilters();

	// 		params = { ...defaults, ...filters, ...params };

	// 		for (let token of tokens) {

	// 			for (let key in params) {

	// 				this.setValue([params[key]], key, token);

	// 			}

	// 			this.setValue(["0"], "trash", token);

	// 		}

	// 	}

	// 	return tokens;
	// }

	createTokens(length, params) {

		const tokens = [];
		const driver = this.getDriver();
		const defaults = this.getDefaults();
		const filters = this.getFilters();

		params = { ...defaults, ...filters, ...params };

		for (let i = 0; i < length; i++) {

			const token = KarmaFieldsAlpha.server.add(params, driver);

			// for (let key in params) {

			// 	this.setValue([params[key]], key, token);

			// }

			// this.setValue(["0"], "trash", token);

			tokens.push(token);

		}


		return tokens;
	}

	add(length = 1, params = {}, index = undefined) {

		const driver = this.getDriver();
		const filters = this.getFilters();
		const defaults = this.getDefaults();

		const values = {};

		params = { ...filters, ...defaults, ...params };

		for (let key in params) {

			const value = params[key] || "";

			values[key] = value.split(",");

		}

		const body = this.getChild("body");

		if (body && index === undefined) {

			index = body.getDefaultIndex() || 0;

		}

		const paramstring = this.getParamstring();


		const query = KarmaFieldsAlpha.server.getQuery(driver, paramstring);

		if (query === undefined) {

			console.error("adding item but query is undefined");

		}

		const ids = [...query.ids];

		for (let i = 0; i < length; i++) {

			ids.splice(index, 0, values);

		}

		const count = query.count + length;

		KarmaFieldsAlpha.Store.setQuery({ ...query, ids, count }, driver, paramstring);

		if (body) {

			body.selectAt(index, length);

		}



		// for (let i = 0; i < length; i++) {

		// 	const token = KarmaFieldsAlpha.server.add(values, driver);

		// 	tokens.push(token);

		// }



		// if (body) {

		// 	body.addIds(...tokens);

		// }

	}

	// async add(length = 1, index = undefined, itemParams = {}, data = undefined) {

	//   const driver = this.getDriver();
	//   // let params = this.queryParams();
	//   //
	//   // while (params.loading) {
	//   //
	//   //   await this.render();
	//   //   params = this.queryParams();
	//   //
	//   // }

	//   const params = this.getParams() || {};

	//   // const paramstring = params.string;
	//   const paramstring = this.getParamstring() || "";

	//   const body = this.getChild("body");

	//   if (index === undefined) {

	//     index = body.getNewItemIndex();

	//   }

	//   let defaults = body.exportDefaults();

	//   while (defaults.loading) {

	//     await this.render();
	//     defaults = body.exportDefaults();

	//   }


	//   //  if (defaults.loading) {
	// 		// defaults = await KarmaFieldsAlpha.server.load(() => body.exportDefaults());

	// 		// KarmaFieldsAlpha.Queue.add(async () => {
	// 		// 	while (KarmaFieldsAlpha.server.hasOrder()) {
	// 		// 		await KarmaFieldsAlpha.server.process();
	// 		// 		defaults = body.exportDefaults();
	// 		// 	}
	// 		// });
	//   //  }

	// //   KarmaFieldsAlpha.Queue.add(async () => {
	//  //  //   let defaults = body.exportDefaults();

	//  //  //   while (KarmaFieldsAlpha.server.hasOrder()) {

	// 	// 	// 	await KarmaFieldsAlpha.server.process();

	// 	// 	// 	defaults = body.exportDefaults();

	// 	// 	// }
	// 	// 	let defaults = await KarmaFieldsAlpha.server.load(() => body.exportDefaults());

	// 	// 	await this.save("insert", "Insert");

	//  //    await body.select(index, length);

	//  //    const {page, ppp, order, orderby, ...filters} = params;

	//  //    const gen = KarmaFieldsAlpha.server.add(driver, paramstring, index, length, {...filters, ...defaults.toObject(), ...itemParams}, data);

	//  //    for await (let result of gen) {

	//  //      await this.render();

	//  //    }

	//  //    await this.render();

	// 	// });



	//   await this.save("insert", "Insert");

	//   await body.select(index, length);

	//   const {page, ppp, order, orderby, ...filters} = params;

	//   const gen = KarmaFieldsAlpha.server.add(driver, paramstring, index, length, {...filters, ...defaults.toObject(), ...itemParams}, data);

	//   for await (let result of gen) {

	//     await this.render();

	//   }

	//   await this.render();
	// }

	canDelete() {

		return this.hasSelection();

	}





	// async delete(index, length) {

	//   const driver = this.getDriver();

	//   const params = this.getParams() || {};
	//   const paramstring = this.getParamstring() || "";

	//   const body = this.getChild("body");

	//   if (index === undefined || length === undefined) {

	//     const selection = body.querySelection();

	//     index = selection && selection.index || 0;
	//     length = selection && selection.length || 0;

	//   }

	//   await this.save("delete", "Delete");

	//   await body.select(0, 0);

	//   // await KarmaFieldsAlpha.server.delete(driver, paramstring, index, length);

	//   for await (let result of KarmaFieldsAlpha.server.delete(driver, paramstring, index, length)) {

	//     await this.render(); // actually never trigger

	//   }

	//   await this.render();
	// }

	delete(...ids) {

		const body = this.getChild("body");

		if (ids.length === 0) {

			ids = body.getSelectedIds();

		}

		const driver = this.getDriver();
		const paramstring = this.getParamstring();

		const query = KarmaFieldsAlpha.Store.getQuery(driver, paramstring);

		if (query === undefined) {

			console.error("deleting ids but query is undefined");

		}

		for (let id of ids) {

			KarmaFieldsAlpha.Store.setValue(["1"], driver, id, "trash", paramstring);

		}

		KarmaFieldsAlpha.Store.setQuery({
			...query,
			count: query.count - ids.length,
			ids: query.ids.filter(id => !ids.includes(id))
		}, driver, paramstring);



		// this.deleteIds(ids);

		// for (let id of ids) {

		// 	this.setValue(["1"], "trash", id);

		// }

		// body.deleteIds(ids);


		// -> should remove query on save or

		// this.removeQuery();

	}

	deleteAt(index, length) {

		const body = this.getChild("body");

		const ids = body.getIdsAt(index, length);

		this.deleteIds(...ids);

	}

	// deleteIds(ids) {

	// 	for (let id of ids) {

	// 		this.setValue(["1"], "trash", id);

	// 	}

	// 	const query = this.getQuery();

	// 	if (!query) {

	// 		console.error("adding items but query is undefined");

	// 	}

	// 	const remainingIds = query.ids.filter(id => !ids.include(id));

	// 	this.setQuery({ ...query, ids: remainingIds, stalled: true });

	// }

	// deleteId(id) {

	// 	this.deleteIds([id]);

	// }


  // async duplicate() {

  //   const body = this.getChild("body");
  //   const selection = body.querySelection();

  //   index = selection && selection.index || 0;
  //   length = selection && selection.length || 0;

  //   if (length) {

  //     await this.save("duplicate", "Duplicate");

  //     let grid = body.export(index, length);

  //     while (grid.loading) {

  //       await this.render();
  //       grid = body.export(index, length);

  //     }

  //     await body.import(grid, index + length, length);

  //     await this.select(index + length, length);

  //   }

  // }

	duplicate() {

		const body = this.getChild("body");

		body.duplicate();

		// if (index === undefined || length === undefined) {

		// 	const selection = body.getSelection();

		// 	if (!selection) {

		// 		console.error("duplicating but nothing is selected!");
		// 		return;

		// 	}

		// 	index = selection.index;
		// 	length = selection.length;

		// }

		// this.save("duplicate", "Duplicate");

		// let grid = body.export(index, length);

		// if (grid.loading) {

		// 	console.error("duplicating but values are not loaded");
		// 	return;

		// }

		// body.import(grid, index + length, length);

		// body.select(index + length, length);


	}



  isRowSelected() { // compat ??

    return this.hasSelection();

  }

	// querySelectedIds() {

	//   const response = new KarmaFieldsAlpha.Content();

	//   const ids = this.getIds();

	//   if (ids.loading) {

	//     response.loading = true;

	//   } else {

	//     const body = this.getChild("body");
	//     const selection = body.querySelection();

	//     const index = selection.index || 0;
	//     const length = selection.length || 0;

	//     response.value = ids.toArray().slice(index, index + length);

	//   }

	//   return response;
	// }

	getSelectedIds() {

		const body = this.getChild("body");

		return body.getSelectedIds();

		// const query = this.getQuery();

		// if (query) {

		// 	const body = this.getChild("body");
		// 	const selection = body.querySelection();

		// 	if (selection) {

		// 		const index = selection.index || 0;
		// 		const length = selection.length || 0;

		// 		return query.ids.slice(index, index + length);

		// 	}

		// }

	}

  // getAdjacentId(id, direction = 1) {

  //   const ids = this.getIds().toArray();

  //   const index = ids.indexOf(id);

  //   if (index > -1 && index + direction >= 0 && index + direction < ids.length) {

  //     return ids[index + direction];

  //   }

  // }

	selectByIds(ids) {

		// let query = this.getQuery();

		// if (!query) {

		// 	console.error("selecting by ids but query is not set");
		// 	return;

		// }

		const body = this.getChild("body");

		body.selectByIds(ids);

		// const index = query.ids.indexOf(ids[0]);

		// if (index > -1 && body) {

		// 	body.select(index, ids.length);
		// 	body.setFocus(true);

		// } else {

		// 	body.unselect();

		// }

	}

  // getSortableKey() {

  //   return body.getSortableKey();

  // }


  // async swap(index, target, length) {

  //   const body = this.getChild("body");

  //   const sortableKey = body.resource.sortable === true && "position" || body.resource.sortable;

  //   if (!sortableKey) {

  //     console.error("not sortable!", this);

  //   }

  //   const driver = this.getDriver();

  //   const params = this.getParams() || {};
  //   const paramstring = this.getParamstring() || "";

  //   const queryIds = this.getIds();

  //   if (queryIds.loading) {

  //     console.error("ids are not loaded");

  //   }

  //   // to be moved in Server()
  //   let previousIds = queryIds.toArray();

  //   await this.save("sort", "Sort");

  //   // const ids = [...previousIds.toArray()];
  //   const ids = [...previousIds];

  //   ids.splice(target, 0, ...ids.splice(index, length));

  //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, ids, "ids", driver, paramstring);

  //   await KarmaFieldsAlpha.Database.States.set(ids, "queries", driver, paramstring, "ids");
  //   await KarmaFieldsAlpha.History.write(ids, previousIds, "queries", driver, paramstring, "ids"); // update history

  //   let positionQueries = ids.map((id, i) => this.getContentAt(i, sortableKey));

  //   while (positionQueries.some(query => query.loading)) {

  //     await this.render();

  //     positionQueries = ids.map((id, i) => this.getContentAt(i, sortableKey));

  //   }

  //   for (let i = 0; i < ids.length; i++) {

  //     // const position = this.getContentAt(i, sortableKey);

  //     // console.log(i, position, sortableKey);

  //     const currentIndex = positionQueries[i].toNumber();

  //     if (currentIndex !== i) {

  //       await this.setValueAt(i, i, sortableKey);

  //     }



  //   }



  //   if (body) {

  //     await body.setFocus(true);
  //     await body.select(target, length);

  //   }

  // }

	// swap(index, target, length) {

	// 	const body = this.getChild("body");

	// 	const sortableKey = body.resource.sortable;

	// 	// compat
	// 	if (body.resource.sortable === true) {

	// 		sortableKey = "position";

	// 	}

	// 	if (!sortableKey) {

	// 		console.error("not sortable!", this);
	// 		return;

	// 	}

	// 	const driver = this.getDriver();
	// 	const params = this.getParams();
	// 	const paramstring = this.getParamstring() || "";

	// 	this.save("sort", "Sort");

	// 	KarmaFieldsAlpha.server.swap(this.uid, driver, paramstring, index, length, target, sortableKey);

	// 	if (body) {

	// 		body.setFocus(true);
	// 		body.select(target, length);

	// 	}

	// }

	// swapAt(index, length, target, sortableKey) {

	// 	const driver = this.getDriver();
	// 	const paramstring = this.getParamstring() || "";

	// 	KarmaFieldsAlpha.server.swap(this.uid, driver, paramstring, index, length, target, sortableKey);

	// }

	drop() {

		const body = this.getChild("body");

		let ids = body.getSelectedIds();

		if (!ids) {

			console.error("dropping id but selected ids is not set");

		}

		if (ids.length && this.parent.insert) {

			this.parent.insert(ids);

		}

		this.parent.close();

	}

	canDrop() {

		return Boolean(this.parent.insert);

	}

	// exportTable(keys, ppp = 100) {

	// 	const params = this.getParams();
	// 	const driver = this.getDriver();

	// 	if (params === undefined) {

	// 		console.error("exporting table but params is not set");

	// 	}

	// 	KarmaFieldsAlpha.server.export(driver, params, keys, ppp);

	// }
	exportTable() {

		this.exportPROMISE();

		// KarmaFieldsAlpha.server.tasks.set({ page: 1, originalPage: this.getPage(), data: [] }, "get", "export", this.uid);

	}

	// *buildExport() {

	// 	const task = KarmaFieldsAlpha.server.tasks.get("get", "export", this.uid);

	// 	if (task) {


	// 		const params = this.getParams();

	// 		if (!params) {

	// 			return;

	// 		}

	// 		const numPage = this.getNumPage();

	// 		if (numPage === undefined) {

	// 			return;

	// 		}

	// 		// change page without updating history
	// 		KarmaFieldsAlpha.server.setState({ ...params, page: task.page }, this.uid, "params");
	// 		KarmaFieldsAlpha.server.tempo.clear();

	// 		const body = this.getChild("body");

	// 		let grid = body.export();

	// 		// compat
	// 		if (grid instanceof KarmaFieldsAlpha.Content) {

	// 			if (grid.loading) {

	// 				grid = undefined;

	// 			} else {

	// 				grid = grid.toArray();

	// 			}

	// 		}

	// 		if (grid !== undefined) {

	// 			task.data.push(...grid);

	// 		} else if (page === numPage) {

	// 			const csv = Papa.unparse(grid);
	// 			const filename = this.parse(this.resource.filename || "export.csv").toString();

	// 			// -> download grid
	// 			yield {
	// 				tag: "a",
	// 				update: element => {
	// 					element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
	// 					element.setAttribute("download", filename);
	// 					element.style.display = "none";
	// 					element.click();
	// 				}
	// 			};

	// 			KarmaFieldsAlpha.server.tasks.remove("get", "export", this.uid);

	// 			KarmaFieldsAlpha.server.store.set({ ...params, page: task.originalPage }, "fields", this.uid, "params");

	// 		} else {

	// 			task.page++;

	// 		}

	// 	}

	// 	// set params back without updating history
	// 	KarmaFieldsAlpha.server.set(params, "fields", this.uid, "params");
	// 	KarmaFieldsAlpha.server.tempo.clear(); // -> release parastring cache

	// }

	exportPROMISE() {

		const data = [];
		const params = this.getParams();

		if (params === undefined) {

			console.error("exporting table but params are not loaded!");

			return;

		}

		let page = params.page || 1;

		KarmaFieldsAlpha.server.promise(done => {

			const numPage = this.getNumPage();

			if (numPage === undefined) {

				return;

			}



			// change page without updating history
			// KarmaFieldsAlpha.server.setState({ ...params, page }, this.uid, "params");
			// KarmaFieldsAlpha.server.tempo.clear();

			const body = this.getChild("body");

			let grid = body.export();

			if (grid !== undefined) {

				data.push(...grid);

				if (page === numPage) {

					this.setData(data, "export");

					KarmaFieldsAlpha.server.setState(params, this.uid, "params"); // -> set to original

					done();

				} else {

					page++;
					KarmaFieldsAlpha.server.setState({ ...params, page }, this.uid, "params");

				}

			}

		});

	}

	*buildExport() {

		const data = this.getData("export");

		if (data) {

			const csv = Papa.unparse(data);
			const filename = this.parseString(this.resource.filename || "export.csv");

			// -> download grid
			yield {
				tag: "a",
				update: element => {
					element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
					element.setAttribute("download", filename);
					element.style.display = "none";
					element.click();
				}
			};

			this.setData(null, "export");

		}

	}

	// *buildContent() {

	// 	yield* super.buildContent();
	// 	yield* this.buildExport();

	// }

	*buildBody() {

		const body = this.getBody();

		if (body) {

			yield* body.build(); // -> don't wrap with body-content in tables

			yield* this.buildExport();

			// yield {
			// 	class: "body-content",
			// 	children: body.build()
			// };

		}

	}

}




KarmaFieldsAlpha.field.table.footer = class extends KarmaFieldsAlpha.field.container.footer {

  constructor(resource, id, parent) {

    super({
      display: "flex",
      children: [
        "save",
        "add",
        "delete",
        "separator",
        "insert",
        "undo",
        "redo"
      ],
      ...resource
    }, id, parent);

  }

}

// KarmaFieldsAlpha.field.table.save = class extends KarmaFieldsAlpha.field.button {
//
//   constructor(resource, id, parent) {
//     super({
//       // task: ["submit"],
//       action: "submit",
//       title: "Save",
//       text: "Save",
//       enabled: ["request", "hasDelta"],
//       primary: true,
//       ...resource
//     }, id, parent);
//   }
//
// }

KarmaFieldsAlpha.field.table.add = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      // task: ["add"],
      action: "add",
      title: "Add",
      text: "Add",
      save: "add",
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.table.delete = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      action: "delete",
      title: "Delete",
      text: "Delete",
      enabled: ["request", "hasSelection"],
      save: "delete",
      ...resource
    }, id, parent);
  }

}

KarmaFieldsAlpha.field.table.insert = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      action: "drop",
      primary: true,
      text: "Insert",
      enabled: ["request", "hasSelection"],
      // visible: ["request", "tunnel", -1, "useSocket"],
      visible: ["request", "canDrop"],
      save: "drop",
      ...resource
    }, id, parent);
  }
}
KarmaFieldsAlpha.field.table.export = class extends KarmaFieldsAlpha.field.download {
  constructor(resource, id, parent) {
    super({
      text: "Export",
      ...resource
    }, id, parent);
  }
}



KarmaFieldsAlpha.field.table.header = class extends KarmaFieldsAlpha.field.container.header {

  constructor(resource, id, parent) {

    super({
      display: "flex",
      children: [
        "title",
        "count",
        "pagination",
        "close"
      ],
      ...resource
    }, id, parent);

  }


}

// KarmaFieldsAlpha.field.title = class extends KarmaFieldsAlpha.field.text {
//
//   constructor(resource, id, parent) {
//
//     super({
//       tag: "h1",
//       style: "flex-grow:1",
//       class: "ellipsis",
//       content: "Title",
//       ...resource
//     }, id, parent);
//
//   }
//
//   getContent() {
//
//     const content = this.getResource("title");
//
//     return this.parse(content || this.resource.content);
//
//   }
//
// }

KarmaFieldsAlpha.field.table.count = class extends KarmaFieldsAlpha.field.simpletext {
  // constructor(resource, id, parent) {
  //   super({
  //     style: "justify-content:center;white-space: nowrap;",
  //     value: ["replace", "# elements", "#", ["request", "getCount"]],
  //     ...resource
  //   }, id, parent);
  // }

	// *build() {

	// 	yield {
	// 		class: "text",
	// 		init: element => {
	// 			// element.style = "justify-content:center;white-space: nowrap;";
	// 		},
	// 		update: element => {
	// 			element.innerHTML = this.parseString(this.resource.value || this.resource.content) || "";
	// 		}
	// 	};
	// }
	getText() {
		const count = this.getValue("count");
		if (count === undefined) {
			return;
		}
		return (count[0] || 0).toString();
	}
}
// KarmaFieldsAlpha.field.table.close = class extends KarmaFieldsAlpha.field.button {
//   constructor(resource, id, parent) {
//     super({
//       dashicon: "no",
//       title: "Close",
//       action: "close",
//       ...resource
//     }, id, parent);
//   }
// }


KarmaFieldsAlpha.field.table.pagination = class extends KarmaFieldsAlpha.field.group {

  constructor(resource, id, parent) {

    super({
      type: "group",
      display: "flex",
      style: "flex: 0 1 auto;min-width:0",
      hidden: ["=", ["request", "getNumPage"], 1],
      children: [
        "firstpage",
        "prevpage",
        "currentpage",
        "nextpage",
        "lastpage"
      ],
      ...resource
    }, id, parent);
  }

}

KarmaFieldsAlpha.field.table.pagination.firstpage = class extends KarmaFieldsAlpha.field.button {
	// constructor(resource, id, parent) {
	// 	super({
	// 		// action: "firstPage",
	// 		title: "First Page",
	// 		text: "«",
	// 		// disabled: ["==", ["request", "getPage"], 1],
	// 		...resource
	// 	}, id, parent);
	// }

	getTitle() {
		return "First Page";
	}

	getDashicon() {
		return "controls-skipback";
	}

	click() {
		this.save("first-page");
		this.setValue(["1"], "page");
		this.render();
	}

	isDisabled() {
		const page = this.getValue("page");
		return !page || parseInt(page[0]) <= 1;
	}
}

KarmaFieldsAlpha.field.table.pagination.prevpage = class extends KarmaFieldsAlpha.field.button {
  // constructor(resource, id, parent) {
  //   super({
  //     // request: ["body", "prevPage"],
  //     // task: ["set", ["-", ["request", "getPage"], 1], "page"],
  //     action: "prevPage",
  //     title: "Previous Page",
  //     text: "‹",
  //     disabled: ["==", ["request", "getPage"], 1],
  //     ...resource
  //   }, id, parent);
  // }

	getTitle() {
		return "Previous Page";
	}

	getDashicon() {
		return "controls-back";
	}

	click() {
		let page = this.getValue("page");
		if (page && page[0] && parseInt(page[0]) > 1) {
			const lastPage = parseInt(page[0]) - 1;
			this.save("previous-page");
			this.setValue([lastPage.toString()], "page");
			this.render();
		}

	}

	isDisabled() {
		const page = this.getValue("page");
		return !page  || !page[0] || parseInt(page[0]) === 1;
	}
}
// KarmaFieldsAlpha.field.table.pagination.currentpage = class extends KarmaFieldsAlpha.field.text {
//   constructor(resource, id, parent) {
//     super({
//       style: "font-family: monospace;", //"min-width: 4em;text-align: right;",
//       value: ["replace", "#/#", "#", ["request", "getPage"], ["request", "getNumPage"]],
//       ...resource
//     }, id, parent);
//   }
// }

KarmaFieldsAlpha.field.table.pagination.currentpage = class extends KarmaFieldsAlpha.field {
	// constructor(resource, id, parent) {
	// 	super({
	// 		style: "font-family: monospace;", //"min-width: 4em;text-align: right;",
	// 		// value: ["replace", "#/#", "#", ["get", "page"], ["get", "numpage"]],
	// 		...resource
	// 	}, id, parent);
	// }
	// getText() {
	// 	const count = this.getValue("count");
	// 	if (count === undefined) {
	// 		return;
	// 	}
	// 	return (count[0] || 0).toString();
	// }

	*build() {
		const numpage = this.getValue("numpage");
		const page = this.getValue("page");

		yield {
			class: "text",
			init: element => {
				element.style = "font-family:monospace;white-space:pre";
			},
			update: element => {
				if (numpage && page) {
					const length = (numpage[0] || 1).toString().length;
					const currentPage = (page[0] || 1).toString().padStart(length, " ");
					const lastPage = (numpage[0] || 1).toString();
					element.innerHTML = `${currentPage}/${lastPage}`;
				}
			}
		};
	}
}

KarmaFieldsAlpha.field.table.pagination.nextpage = class extends KarmaFieldsAlpha.field.button {
  // constructor(resource, id, parent) {
  //   super({
  //     // request: ["body", "nextPage"],
  //     // task: ["set", ["+", ["request", "getPage"], 1], "page"],
  //     action: "nextPage",
  //     title: "Next Page",
  //     text: "›",
  //     // disabled: ["==", ["request", "body", "getPage"], ["request", "body", "getNumPage"]],
  //     disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]],
  //     ...resource
  //   }, id, parent);
  // }


	getTitle() {
		return "Next Page";
	}

	getDashicon() {
		return "controls-forward";
	}

	click() {
		let numpage = this.getValue("numpage");
		let page = this.getValue("page");

		if (page && numpage && parseInt(page[0]) < parseInt(numpage[0])) {
			const nextPage = parseInt(page[0]) + 1;
			this.save("next-page");
			this.setValue([nextPage.toString()], "page");
			this.render();
		}

	}

	isDisabled() {
		const page = this.getValue("page");
		let numpage = this.getValue("numpage");
		return !page || !numpage || parseInt(page[0]) >= parseInt(numpage[0]);
	}
}
KarmaFieldsAlpha.field.table.pagination.lastpage = class extends KarmaFieldsAlpha.field.button {
  // constructor(resource, id, parent) {
  //   super({
  //     // request: ["body", "lastPage"],
  //     // task: ["set", ["request", "getNumPage"], "page"],
  //     action: "lastPage",
  //     title: "Last Page",
  //     text: "»",
  //     disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]],
  //     ...resource
  //   }, id, parent);
  // }

	getTitle() {
		return "Last Page";
	}

	getDashicon() {
		return "controls-skipforward";
	}

	click() {
		let numpage = this.getValue("numpage");
		let page = this.getValue("page");

		if (page && numpage && parseInt(page[0]) < parseInt(numpage[0])) {
			this.save("next-page");
			this.setValue(numpage, "page");
			this.render();
		}

	}

	isDisabled() {
		const page = this.getValue("page");
		let numpage = this.getValue("numpage");
		return !page || !numpage || parseInt(page[0]) >= parseInt(numpage[0]);
	}
}





// compat

KarmaFieldsAlpha.field.gridField = class extends KarmaFieldsAlpha.field.table {

  constructor(resource, id, parent) {

    if (!resource.body) {

      resource.body = {
        type: "grid",
        children: resource.children
      };

    }

    super(resource, id, parent);

  }

}
