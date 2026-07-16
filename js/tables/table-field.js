

KarmaFieldsAlpha.field.table = class extends KarmaFieldsAlpha.field.container {

	getHeader() {

		// if (this.resource.header) {

			return new KarmaFieldsAlpha.field.group({
				offsetContainer: true,
				display: "flex",
				children: [
					{type: "title"},
					{type: "tableCount"},
					{type: "tablePagination"},
					// {type: "close"}
				],
				...this.resource.header
			}, "header", this);

		// }



	}

	getQuery() {

		const params = this.getParams();

		if (params === undefined) {

			return;

		}

		const paramstring = this.getParamstring();

		if (paramstring === undefined) {

			return;

		}

		const driver = this.resource.driver || this.doAction("getDriver");

		return new KarmaFieldsAlpha.field.table.ids({
			driver,
			params,
			paramstring
		}, "ids", this);

	}

	getBody() {

		const query = this.getQuery();

		if (query === undefined) {

			return;

		}

		const length = query.getLength();

		if (length === undefined) {

			return;

		}




		// const index = this.getIndex();

		// if (index === undefined) {

		// 	return;

		// }

		return ids.createChild({
			type: "grid",
			length,
			preselection: this.getPreselection(),
			offsetContainer: false,
			scrollContainer: this.isScrollContainer(),
			pad: false,
			scroll: this.isScrollContainer(),
			border: false,
			...this.resource.body
		}, "body");

	}

	getPreselection() {

		if (this.resource.preselectedIds) {

			const preselectedIds = this.parseArray(this.resource.preselectedIds);

			if (preselectedIds === undefined) {

				return;

			}

			const query = this.getQuery();

			if (query === undefined) {

				return;

			}

			const ids = query.getIds();

			if (ids === undefined) {

				return;

			}

			const index = ids.indexOf(preselectedIds[0]);

			if (index > -1) {

				return { index, length: 1 };

			}

		}

	}


	getDefaults() {

		const header = this.getHeader();

		if (header === undefined) {

			return;

		}

		return header.getDefaults();

	}

	// getFilters() {

	// 	const params = this.getParams();

	// 	if (params === undefined) {

	// 		return;

	// 	}

	// 	const { page, ppp, order, orderby, ...filters } = params;

	// 	return filters;

	// }

	getParam(key) {

		const params = this.getParams();

		if (params !== undefined) {

			return params[key] || "";

		}

	}

	// getParams() {

	// 	let params = this.getTempo("params");

	// 	if (params === undefined) {

	// 		const resourceParams = this.parseObject(this.resource.params || {});

	// 		if (resourceParams === undefined) {

	// 			return;

	// 		}

	// 		const stateParams = this.getState("params") || {};

	// 		params = { ...resourceParams, ...stateParams };

	// 		this.setTempo(params, "params");

	// 	}

	// 	return params;

	// }

	getParams() {

		const defaultsParams = this.getDefaults();

		if (defaultsParams === undefined) {

			return;

		}

		const resourceParams = this.parseObject(this.resource.params || this.parent.doAction("getParams"));

		if (resourceParams === undefined) {

			return;

		}

		const stateParams = this.getState("params") || {};

		return { ...defaultsParams, ...resourceParams, ...stateParams };

	}

	// getParamstring() {

	// 	let paramstring = this.getTempo("paramstring");

	// 	if (paramstring === undefined) {

	// 		let params = this.getParams();

	// 		if (params === undefined) {

	// 			return;

	// 		}

	// 		// paramstring = KarmaFieldsAlpha.Params.stringify({ ...defaults, ...params });
	// 		paramstring = KarmaFieldsAlpha.Params.stringify(params);

	// 		this.setTempo(paramstring, "paramstring");

	// 	}

	// 	return paramstring;

	// }

	getParamstring() {

		let params = this.getParams();

		if (params === undefined) {

			return;

		}

		return KarmaFieldsAlpha.Params.stringify(params);

	}


	setParam(value, key) {

		let params = this.getParams();

		if (params === undefined) {

			console.error("setting params but params is not loaded");

			return;

		}

		this.setState({ ...params, page: 1, [key]: value }, "params");

	}

	// getIds() {

	// 	let driver = this.getDriver();
	// 	let paramstring = this.getParamstring();

	// 	if (driver && paramstring !== undefined) {

	// 		return KarmaFieldsAlpha.server.getIds(driver, paramstring);

	// 	}

	// }

	// setIds(ids) {

	// 	let driver = this.getDriver();
	// 	let paramstring = this.getParamstring();

	// 	if (driver && paramstring !== undefined) {

	// 		console.error("Setting ids but driver or paramstrin is undefined")

	// 	}

	// 	KarmaFieldsAlpha.server.setIds(ids, driver, paramstring);

	// }

	// getQuery() { // deprec

	// 	const ids = this.getIds();

	// 	if (ids) {

	// 		return { ids };

	// 	}

	// }

	// setQuery(query) {

	// 	this.setIds(query.ids);

	// }

	doAction(action, ...args) {

		switch (action) {

			case "submit":
				KarmaFieldsAlpha.Store.submit();
				break;

			case "getPage":
				return this.getPage();

			case "getNumpage":
				return this.getNumPage();


			case "getOffset":
				return this.getIndex();

			case "getPpp":
				return this.getPpp();

			case "getCount":
				return this.getQuery()?.getCount();

			case "getParam":
				return this.getParam(...args);

			case "setParam":
				this.setParam(...args);
				break;

			case "isFirstPage":
				return this.isFirstPage();

			case "isLastPage":
				return this.isLastPage();

			case "firstPage":
				this.firstPage();
				break;

			case "prevPage":
				this.prevPage();
				break;

			case "nextPage":
				this.nextPage();
				break;

			case "lastPage":
				this.lastPage();
				break;

			case "export":
				this.exportTable();
				break;

			// case "reorder":
			// 	this.reorder(...args);
			// 	break;

			case "add":
				this.getBody()?.add(...args);
				break;

			case "delete":
			case "remove":
				this.getBody()?.delete(...args);
				break;

			case "duplicate":
				this.getBody()?.duplicate(...args);
				break;

			case "drop":
				this.drop();
				break;

			default:
				super.doAction(action, ...args);
				break;

		}

	}

	submit() {

		KarmaFieldsAlpha.server.submit();

	}





	// getValues(key, ...ids) {

	// 	const values = [];

	// 	for (let id of ids) {

	// 		const value = this.getValue(key, id, driver);

	// 		values.push(value);

	// 	}

	// 	if (!values.some(value => value === undefined)) {

	// 		if (values.slice(1).some(value => !KarmaFieldsAlpha.DeepObject.equal(value, values[0]))) {

	// 			values.mixed = true; // adding a custom param to buildin array!

	// 			return values;

	// 		} else if (values.length > 0) { // -> all fields have same value

	// 			return values[0];

	// 		}

	// 	}

	// }

	// getValueAt(key, index) {

	// 	const ids = this.getIds();

	// 	if (ids === undefined) {

	// 		return;

	// 	}

	// 	const id = ids[index];

	// 	if (id === undefined) {

	// 		console.error("Getting value at but index is out of bounds");

	// 	}

	// 	return this.getValueById(key, id);

	// }

	// setValueAt(value, key, index) {

	// 	if (!Array.isArray(value)) {

	// 		console.error("setting value at but value is not an array");

	// 	}

	// 	const ids = this.getIds();

	// 	if (ids === undefined) {

	// 		return;

	// 	}

	// 	const id = ids[index];

	// 	if (id === undefined) {

	// 		console.error("Setting value at but index is out of bounds");

	// 	}

	// 	this.setValueById(value, key, id);

	// }

	// getValueById(key, id) {

	// 	if (id === undefined) {

	// 		console.error("Getting value by id but id is undefined");

	// 	}

	// 	const paramstring = this.getParamstring();

	// 	if (paramstring === undefined) {

	// 		return;

	// 	}

	// 	const driver = this.getDriver();

	// 	if (!driver) {

	// 		console.error("Getting value at but driver in undefined");

	// 	}

	// 	return KarmaFieldsAlpha.server.getValue(driver, id, key, paramstring);

	// }

	// setValueById(value, key, id) {

	// 	if (id === undefined) {

	// 		console.error("Setting value by id but id is undefined");

	// 	}

	// 	if (!Array.isArray(value)) {

	// 		console.error("Setting value by id but value is not an array");

	// 	}

	// 	const paramstring = this.getParamstring();

	// 	if (paramstring === undefined) {

	// 		return;

	// 	}

	// 	const driver = this.getDriver();

	// 	if (!driver) {

	// 		console.error("Getting value at but driver in undefined");

	// 	}

	// 	return KarmaFieldsAlpha.server.setValue(value, driver, id, key, paramstring);

	// }

	getValue(key, id, driver) {

		if (id) {

			console.error("deprecated param id");

		}

		if (driver) {

			console.error("deprecated param driver");

		}

		if (key === undefined) {

			console.error("Getting value but key is not set");

		}

		// let singleValue;

		// if (key === "tableIds") {

		// 	return this.getIds();

		// } else if (key === "tableDriver") {

		// 	singleValue = this.resource.driver;

		// } else if (key === "tableNumpage") {

		// 	singleValue = this.getNumPage();

		// } else if (key === "tablePage") {

		// 	singleValue = this.getPage();

		// } else if (key === "tableCount") {

		// 	singleValue = this.getCount();

		// } else if (key === "tablePpp") {

		// 	singleValue = this.getPpp();

		// } else if (key === "tableIndex") {

		// 	singleValue = this.getIndex();

		// } else {

		// 	singleValue = this.getParam(key);

		// }

		const param = this.getParam(key);

		if (param !== undefined) {

			return [param];

		}

		if (this.parent) {

			return this.parent.getValue(key);

		}

		return [];

	}

	setValue(value, key, id, driver) {

		if (id) {

			console.error("deprecated param id");

		}

		if (driver) {

			console.error("deprecated param driver");

		}

		if (key === undefined) {

			console.error("Setting value but key is not set");

		}

		if (!Array.isArray(value)) {

			console.error("setting value but value is not an array");

		}

		// if (key === "tableIds") {

		// 	this.setIds(value, key);

		// } else {

		// 	this.setParam(value[0], key);

		// }

		this.setParam(value[0], key);

	}

	// doAction(action, ...args) {

	// 	switch (action) {

	// 		case "export":
	// 			this.exportTable();
	// 			break;

	// 		case "reorder":
	// 			this.reorder(...args);
	// 			break;

	// 		case "add":
	// 			this.add(...args);
	// 			break;

	// 		case "deleteIds":
	// 		case "delete":
	// 		case "remove":
	// 			this.removeIds(...args);
	// 			break;

	// 		case "duplicate":
	// 			this.duplicate(...args);
	// 			break;

	// 		case "drop":
	// 			this.drop();
	// 			break;

	// 		default:
	// 			super.doAction(action, ...args);
	// 			break;
	// 	}

	// }



	// reorder(newIds) {



	// 	const sortableKey = this.resource.sortable;

	// 	// compat
	// 	if (this.resource.sortable === true) {

	// 		sortableKey = "position";

	// 	}

	// 	if (!sortableKey) {

	// 		console.error("not sortable!");
	// 		return;

	// 	}

	// 	const ids = this.getIds();

	// 	if (ids === undefined) {

	// 		console.error("reordering items but ids is undefined");

	// 	}

	// 	for (let i = 0; i < newIds.length; i++) {

	// 		if (newIds[i] !== ids[i]) {

	// 			this.setValueAt(i, sortableKey, i);

	// 		}

	// 	}

	// 	this.setIds(newIds);

	// }


	getCount() {

		const query = this.getQuery();

		return query?.getCount();

		// let driver = this.getDriver();
		// let paramstring = this.getParamstring();

		// if (driver && paramstring !== undefined) {

		// 	return KarmaFieldsAlpha.server.getCount(driver, paramstring);

		// }

	}

	getPage() {

		const page = this.getParam("page");

		if (page === undefined) {

			return;

		}

		return Number(page || 1);

	}

	getPpp() {

		let ppp = this.getParam("ppp");

		if (ppp === undefined) {

			return;

		}

		return Number(ppp || 100);

	}

	getPageOffset() {


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

		// const page = this.getPage();

		// if (page === undefined) {

		// 	console.error("requesting first page but page is not set");
		// 	return;

		// }

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

			this.setParam(page - 1, "page");
			this.save("changePage", "Change Page");

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




	// createTokens(length, params) {

	// 	const tokens = [];
	// 	const driver = this.getDriver();
	// 	const defaults = this.getDefaults();
	// 	const filters = this.getFilters();

	// 	params = { ...defaults, ...filters, ...params };

	// 	for (let i = 0; i < length; i++) {

	// 		const token = KarmaFieldsAlpha.server.add(params, driver);

	// 		// for (let key in params) {

	// 		// 	this.setValue([params[key]], key, token);

	// 		// }

	// 		// this.setValue(["0"], "trash", token);

	// 		tokens.push(token);

	// 	}


	// 	return tokens;
	// }

	// add(length = 1, index = undefined, customParams = {}) {

	// 	const ids = this.getIds();
	// 	const driver = this.getDriver();
	// 	const filterParams = this.getFilters();
	// 	const defaultParams = this.getDefaults();
	// 	const paramstring = this.getParamstring();


	// 	if (ids === undefined) {

	// 		console.error("adding item but ids is undefined");

	// 	}

	// 	if (!driver) {

	// 		console.error("Adding item but driver is not set");

	// 	}

	// 	if (filterParams === undefined) {

	// 		console.error("Adding item but filterParams is undefined");

	// 	}

	// 	if (defaultParams === undefined) {

	// 		console.error("Adding item but defaultParams is undefined");

	// 	}

	// 	if (paramstring === undefined) {

	// 		console.error("Adding item but paramstring is undefined");

	// 	}

	// 	// const values = {};

	// 	const params = { ...filterParams, ...defaultParams, ...customParams };

	// 	const body = this.getChild("body");

	// 	if (body && index === undefined) {

	// 		index = body.getDefaultIndex() || 0;

	// 	}

	// 	const clonedIds = [...ids];

	// 	for (let i = 0; i < length; i++) {

	// 		const symbol = Symbol();

	// 		clonedIds.splice(index + i, 0, symbol);

	// 		for (let key in params) {

	// 			const value = params[key];

	// 			if (value) {

	// 				const values = value.toString().split(",");

	// 				KarmaFieldsAlpha.server.setValue(values, driver, symbol, key, paramstring);

	// 			}

	// 		}

	// 	}

	// 	KarmaFieldsAlpha.Store.setIds(clonedIds, driver, paramstring);

	// 	if (body) {

	// 		body.selectAt(index, length);

	// 	}

	// }

	// canDelete() {

	// 	return this.hasSelection();

	// }


	// delete(...ids) {

	// 	console.error("deprecated: use removeIds");

	// 	if (ids.length) {

	// 		console.error("deprecated: use removeIds");

	// 	}

	// 	this.deleteSelected();

	// }

	// deleteSelected() {

	// 	console.error("deprecated: use removeIds");

	// 	const body = this.getChild("body");

	// 	if (body) {

	// 		body.delete();

	// 	}

	// }

	// delete(index, length) {

	// 	const driver = this.getDriver();
	// 	const paramstring = this.getParamstring();
	// 	const currentIds = KarmaFieldsAlpha.Store.getIds(driver, paramstring);

	// 	if (currentIds === undefined) {

	// 		console.error("removing item but ids is undefined");

	// 	}

	// 	if (!driver) {

	// 		console.error("Adding item but driver is not set");

	// 	}

	// 	if (paramstring === undefined) {

	// 		console.error("Adding item but paramstring is undefined");

	// 	}

	// 	for (let id of ids) {

	// 		KarmaFieldsAlpha.Store.setValue(["1"], driver, id, "trash", paramstring);

	// 	}

	// 	KarmaFieldsAlpha.Store.setIds(currentIds.filter(id => !ids.includes(id)), driver, paramstring);

	// }

	// deleteAt(index, length) {

	// 	const body = this.getChild("body");

	// 	const ids = body.getIdsAt(index, length);

	// 	this.delete(...ids);

	// }

	duplicate() {

		this.getChild("body")?.duplicate();

	}



  // isRowSelected() { // compat ??

  //   return this.hasSelection();

  // }

	// getSelectedIds() {

	// 	const body = this.getChild("body");

	// 	return body.getSelectedIds();

	// }

	// selectByIds(ids) {

	// 	const body = this.getChild("body");

	// 	body.selectBy(ids, "id");

	// }

	drop() {

		const body = this.getChild("body");

		if (body === undefined) {

			console.error("dropping id but body is not loaded");

		}

		let ids = body.getSelectedValues("id");

		if (!ids) {

			console.error("dropping id but selected ids is not set");

		}

		if (ids.length) {

			// this.request("insert", ids);

			this.doAction("insert", ids);

		}

		this.parent.close();

		// this.doAction("close");

	}

	// exportTable() {

	// 	this.setData([], "export", "data");
	// 	this.setData(1, "export", "params", "page");

	// 	KarmaFieldsAlpha.Store.addPromise(done => {

	// 		const numPage = this.getNumPage();
	// 		const body = this.getChild("body");

	// 		if (numPage === undefined) {

	// 			console.error("exporting table but numpage is undefined");

	// 		}

	// 		if (body === undefined) {

	// 			console.error("exporting table but body is undefined");

	// 		}

	// 		const grid = body.export();

	// 		if (grid !== undefined) {

	// 			const data = this.getData("export", "data");
	// 			const page = this.getData("export", "params", "page");

	// 			this.setData([...data, ...grid], "export", "data");

	// 			if (page >= numPage) {

	// 				this.removeData("export", "params");
	// 				this.setData(true, "export", "done");

	// 				done();

	// 			} else {

	// 				this.setData(page + 1, "export", "params", "page");

	// 			}

	// 		}

	// 	}, "export");

	// }

	// getExportStatus() {

	// 	// const numpage = this.getData("export", "numpage") || 0;
	// 	// const page = this.getData("export", "page") || 0;

	// 	return this.getData("export-status");

	// }

	exportTable() {

		if (this.getData("export-data")) {

			console.error("Exporting data but table is already exporting");
			return;

		}

		this.setData([], "export-data");
		this.setData(false, "export-done");

		// this.setData(1, "export", "page");

		const table = new KarmaFieldsAlpha.field.table(this.resource, "export-table", this);
		let page = 1;

		KarmaFieldsAlpha.Store.addPromise(done => {

			const params = this.getState("params");

			if (params === undefined) {

				return;

			}

			table.setState({ ...params, page }, "params");

			const numPage = table.getNumPage();

			if (numPage === undefined) {

				return;

			}

			const ppp = table.getPpp() || 0;
			const count = table.getCount() || 0;

			this.setData(`${(page-1)*ppp}/${count}`, "export-status");

			const body = table.getChild("body");

			if (body === undefined) {

				return;

			}

			const grid = body.export();

			if (grid !== undefined) {

				const data = this.getData("export-data") || [];

				this.setData([...data, ...grid], "export-data");

				if (page >= numPage) {

					this.setData(true, "export-done");
					this.setData("done", "export-status");

					done();

				} else {

					page++;

				}

			}

		}, "export");

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

	// exportPROMISE() {

	// 	const data = [];
	// 	const params = this.getParams();

	// 	if (params === undefined) {

	// 		console.error("exporting table but params are not loaded!");

	// 		return;

	// 	}

	// 	// let page = params.page || 1;
	// 	let page = 1;

	// 	KarmaFieldsAlpha.server.promise(done => {

	// 		const numPage = this.getNumPage();

	// 		if (numPage === undefined) {

	// 			return;

	// 		}



	// 		// change page without updating history
	// 		// KarmaFieldsAlpha.server.setState({ ...params, page }, this.uid, "params");
	// 		// KarmaFieldsAlpha.server.tempo.clear();

	// 		const body = this.getChild("body");

	// 		let grid = body.export();

	// 		if (grid !== undefined) {

	// 			data.push(...grid);

	// 			if (page >= numPage) {

	// 				this.setData(data, "export");

	// 				KarmaFieldsAlpha.server.setState(params, this.uid, "params"); // -> set to original

	// 				done();

	// 			} else {

	// 				page++;
	// 				KarmaFieldsAlpha.server.setState({ ...params, page }, this.uid, "params");

	// 			}

	// 		}

	// 	});

	// }

	// exportAll(done) {

	// 	const numPage = this.getNumPage();

	// 	if (numPage === undefined) {

	// 		console.error("exporting table but numpage is undefined");

	// 	}

	// 	const body = this.getChild("body");

	// 	const grid = body.export();

	// 	if (grid !== undefined) {

	// 		const data = this.getData("export", "data") || [];
	// 		const page = this.getData("export", "params", "page") || 1;

	// 		this.setData([...data, ...grid], "export", "data");

	// 		if (page >= numPage) {

	// 			this.removeData("export", "params");

	// 			done();

	// 		} else {

	// 			this.setData(page + 1, "export", "params", "page");

	// 		}

	// 	}

	// }

	// *buildExport() {

	// 	const data = this.getData("export", "data");

	// 	if (data) {

	// 		const csv = Papa.unparse(data);
	// 		const filename = this.parseString(this.resource.filename || "export.csv");

	// 		// -> download grid
	// 		yield {
	// 			tag: "a",
	// 			update: element => {
	// 				element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
	// 				element.setAttribute("download", filename);
	// 				element.style.display = "none";
	// 				element.click();
	// 			}
	// 		};

	// 		this.setData(null, "export");

	// 	}

	// }




	*build(context) {

		yield* super.build();

		const exportStatus = this.getData("export-status");

		// console.log(exportStatus);

		// if (exportStatus) {

		// 	// do not update table during loading
		// 	yield {
		// 		class: "container-field"
		// 	};

			// yield* this.buildExport();

			if (exportStatus === "done") {

				const exportData = this.getData("export-data");

				const csv = Papa.unparse(exportData);
				const filename = this.parseString(this.resource.filename || "export.csv");

				console.log(csv);

				// -> download grid
				yield {
					tag: "a",
					update: element => {
						console.log(csv);
						element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
						element.setAttribute("download", filename);
						element.style.display = "none";
						element.click();
					}
				};

				this.removeData("export-status");
				this.removeData("export-data");

			}

		// } else {

		// 	yield* super.build();

		// }

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

// KarmaFieldsAlpha.field.table.add = class extends KarmaFieldsAlpha.field.button {
//   constructor(resource, id, parent) {
//     super({
//       // task: ["add"],
//       action: "add",
//       title: "Add",
//       text: "Add",
//       save: "add",
//       ...resource
//     }, id, parent);
//   }
// }

// KarmaFieldsAlpha.field.table.delete = class extends KarmaFieldsAlpha.field.button {
//   constructor(resource, id, parent) {
//     super({
//       action: "delete",
//       title: "Delete",
//       text: "Delete",
//       enabled: ["request", "hasSelection"],
//       save: "delete",
//       ...resource
//     }, id, parent);
//   }

// }





KarmaFieldsAlpha.field.tableHeader = class extends KarmaFieldsAlpha.field.group {

  constructor(resource, id, parent) {

    super({
      display: "flex",
      children: [
        {type: "title"},
        {type: "tableCount"},
        {type: "tablePagination"},
        {type: "close"}
      ],
      ...resource
    }, id, parent);

  }

}

KarmaFieldsAlpha.field.count = KarmaFieldsAlpha.field.tableCount = class extends KarmaFieldsAlpha.field.simpletext {

	getText() {
		const count = this.request("getCount");
		if (count === undefined) {
			return;
		}
		const text = this.resource.text || "% found Items";
		return text.replace("%", count);
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


KarmaFieldsAlpha.field.pagination = KarmaFieldsAlpha.field.tablePagination = class extends KarmaFieldsAlpha.field.group {

  constructor(resource, id, parent) {

    super({
      type: "group",
      display: "flex",
      style: "flex: 0 1 auto;min-width:0",
      hidden: ["=", ["request", "getNumPage"], 1],
      children: [
        // "firstpage",
        {type: "tablePaginationPrev"},
        {type: "tablePaginationCurrent"},
        {type: "tablePaginationNext"},
        // "lastpage"
      ],
      ...resource
    }, id, parent);
  }

}

KarmaFieldsAlpha.field.tablePaginationFirst = class extends KarmaFieldsAlpha.field.button {

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
		const page = this.request("getPage");
		return page === undefined || page <= 1;
	}

}

KarmaFieldsAlpha.field.tablePaginationPrev = class extends KarmaFieldsAlpha.field.button {

	getTitle() {
		return "Previous Page";
	}

	getDashicon() {
		return "arrow-left-alt2";
	}

	click() {
		let page = this.request("getPage");
		if (page && page > 1) {
			const lastPage = page - 1;
			this.save("previous-page");
			this.setSingleValue(lastPage.toString(), "page");
			this.render();
		}

	}

	isDisabled() {
		const page = this.request("getPage");
		return !page  || page === 1;
	}
}


KarmaFieldsAlpha.field.tablePaginationCurrent = class extends KarmaFieldsAlpha.field {

	*build() {
		const numpage = this.request("getNumPage");
		const page = this.request("getPage");

		yield {
			class: "text",
			init: element => {
				element.style = "font-family:monospace;white-space:pre";
			},
			update: element => {
				if (numpage && page) {
					const length = numpage.toString().length;
					const currentPage = page.toString().padStart(length, " ");
					element.innerHTML = `${currentPage}/${numpage.toString()}`;
				}
			}
		};
	}
}

KarmaFieldsAlpha.field.tablePaginationNext = class extends KarmaFieldsAlpha.field.button {

	getTitle() {
		return "Next Page";
	}

	getDashicon() {
		return "arrow-right-alt2";
	}

	click() {
		const numpage = this.request("getNumPage");
		const page = this.request("getPage");

		if (page && numpage && page < numpage) {
			const nextPage = page + 1;
			this.save("next-page");
			this.setSingleValue(nextPage.toString(), "page");
			this.render();
		}

	}

	isDisabled() {
		const numpage = this.request("getNumPage");
		const page = this.request("getPage");
		return !page || !numpage || page >= numpage;
	}
}

KarmaFieldsAlpha.field.tablePaginationLast = class extends KarmaFieldsAlpha.field.button {

	getTitle() {
		return "Last Page";
	}

	getDashicon() {
		return "controls-skipforward";
	}

	click() {
		const numpage = this.request("getNumPage");
		const page = this.request("getPage");

		if (page && numpage && page < numpage) {
			this.save("next-page");
			this.setSingleValue(numpage.toString(), "page");
			this.render();
		}

	}

	isDisabled() {
		const numpage = this.request("getNumPage");
		const page = this.request("getPage");
		return !page || !numpage || page >= numpage;
	}
}





// compat

// KarmaFieldsAlpha.field.gridField = class extends KarmaFieldsAlpha.field.table {

//   constructor(resource, id, parent) {

//     if (!resource.body) {

//       resource.body = {
//         type: "grid",
//         children: resource.children
//       };

//     }

//     super(resource, id, parent);

//   }

// }


KarmaFieldsAlpha.field.table.ids = class extends KarmaFieldsAlpha.field {

	doAction(action, ...args) {

		switch (action) {

			case "getCount":
				return this.getCount();

			case "getLength":
				return this.getLength();

			case "getValueAt":
			case "getValue":
				return this.getValueAt(...args);

			case "setValueAt":
			case "setValue":
				this.setValueAt(...args);
				break;

			case "add":
				this.add(...args);
				break;

			case "delete":
				this.delete(...args);
				break;

			case "getIds": // -> specific to table: should not be used by grid
				return this.getIds();

			case "setIds": // -> specific to table: should not be used by grid
				this.setIds(...args);
				break;

			case "getIndexes": // -> useless
				return this.getIndexes();

			case "setIndexes":
			case "reorder":
				this.setIndexes(...args);
				break;

		}

	}

	getIds() {

		return KarmaFieldsAlpha.Store.getIds(this.resource.driver, this.resource.paramstring);

	}

	setIds(ids) {

		KarmaFieldsAlpha.Store.setIds(ids, this.resource.driver, this.resource.paramstring);

	}

	getIndexes() {

		const length = this.getLength();

		if (length === undefined) {

			return;

		}

		const indexes = [];

		for (let i = 0; i < length; i++) {

			indexes.push(i);

		}

		return indexes;

	}

	setIndexes(indexes) {

		const ids = KarmaFieldsAlpha.Store.getIds(this.resource.driver, this.resource.paramstring);

		if (ids === undefined) {

			console.error("Setting indexes but ids are not loaded");

		}

		const newIds = [];

		for (let i = 0; i < ids.length; i++) {

			const index = indexes[i];

			newIds[index] = ids[i];

			const orderKey = this.resource.orderKey || "menu_order";

			KarmaFieldsAlpha.Store.setValue([index], this.resource.driver, ids[i], orderKey, this.resource.paramstring);

		}

		KarmaFieldsAlpha.Store.setIds(newIds, this.resource.driver, this.resource.paramstring);

	}

	getLength() {

		const ids = KarmaFieldsAlpha.Store.getIds(this.resource.driver, this.resource.paramstring);

		if (ids === undefined) {

			return;

		}

		return ids.length;

	}

	// getValue(key, index) {

	// 	if (index === undefined) {

	// 		console.error("undefined index");

	// 	}

	// 	return this.getValueAt(key, index);
	// }

	// getValue(value, key, index) {

	// 	if (index === undefined) {

	// 		console.error("undefined index");

	// 	}

	// 	this.getValueAt(value, key, index);
	// }

	getValue(key, index) {

		if (index === undefined) {

			console.error("undefined index");

		}

		if (!this.resource.driver) {

			console.error("Driver not found!");

		}

		// if (!this.resource.ids) {

		// 	console.error("Ids not found!");

		// }

		if (!this.resource.paramstring) {

			console.error("Paramstring not found!");

		}

		const ids = KarmaFieldsAlpha.Store.getIds(this.resource.driver, this.resource.paramstring);

		if (ids === undefined) {

			return;

		}

		const id = ids[index];

		if (id === undefined) {

			console.error("Getting value at index but index is out of bound");

		}

		return KarmaFieldsAlpha.Store.getValue(this.resource.driver, id, key, this.resource.paramstring);
	}

	setValue(value, key, index) {

		if (!Array.isArray(value)) {

			console.error("Setting value at but value is not an array");

		}

		if (index === undefined) {

			console.error("undefined index");

		}

		if (!this.resource.driver) {

			console.error("Driver not found!");

		}

		if (!this.resource.paramstring) {

			console.error("Paramstring not found!");

		}

		const ids = KarmaFieldsAlpha.Store.getIds(this.resource.driver, this.resource.paramstring);

		if (ids === undefined) {

			console.error("Setting value at index but ids is not loaded");

		}

		const id = ids[index];

		if (id === undefined) {

			console.error("Setting value at index but index is out of bound");

		}

		return KarmaFieldsAlpha.Store.setValue(value, this.resource.driver, id, key);
	}

	add(index, length = 1, customParams = {}) {

		const currentIds = KarmaFieldsAlpha.Store.getIds(this.resource.driver, this.resource.paramstring);

		const { page, ppp, order, orderby, ...filterParams} = this.resource.params;

		const params = { ...filterParams, ...customParams };
		const newIds = [...currentIds];

		for (let i = 0; i < length; i++) {

			const symbol = Symbol();

			newIds.splice(index + i, 0, symbol);

			for (let key in params) {

				const value = params[key];

				if (value) {

					const values = value.toString().split(",");

					KarmaFieldsAlpha.server.setValue(values, this.resource.driver, symbol, key, this.resource.paramstring);

				}

			}

		}

		KarmaFieldsAlpha.Store.setIds(newIds, this.resource.driver, this.resource.paramstring);

	}

	delete(index, length = 1) {

		const currentIds = KarmaFieldsAlpha.Store.getIds(this.resource.driver, this.resource.paramstring);
		const remainingIds = [...currentIds];
		const removedIds = remainingIds.splice(index, length);

		for (let id of removedIds) {

			KarmaFieldsAlpha.Store.setValue(["1"], driver, id, "trash", this.resource.paramstring);

		}

		KarmaFieldsAlpha.Store.setIds(remainingIds, this.resource.driver, this.resource.paramstring);

	}

	getCount() {

		return KarmaFieldsAlpha.Store.getCount(this.resource.driver, this.resource.paramstring);

	}

}
