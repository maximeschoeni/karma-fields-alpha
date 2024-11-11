KarmaFieldsAlpha.field.button = class extends KarmaFieldsAlpha.field {

	exportDefaults() {

		return new KarmaFieldsAlpha.Content({});

	}

	async doTask() {

		let params = [];

		if (this.resource.params) {

			for (let param of this.resource.params) {

				let result = this.parse(param);

				while (result.loading) {

					await this.render();
					result = this.parse(param);

				}

				params.push(result.value);

			}

		}

		if (this.resource.action || this.resource.task) {

			await this.request(this.resource.action || this.resource.task, ...params);

		}

		//
		// let task = this.parse(this.resource.task);
		//
		// while (task.loading) {
		//
		// 	yield;
		//
		// 	task = this.parse(this.resource.task);
		//
		// }
		//
		// // yield* this.request(task.toString());

	}

	async click() {

		if (this.resource.request) {

			// console.error("deprecated request", this);

			if (typeof this.resource.request === "string") {

				this.resource.request = [this.resource.request];

			}

			await this.request(...this.resource.request);

			// if (work) {
			//
			// 	KarmaFieldsAlpha.Jobs.add(work);
			//
			// }

			await this.render();

		} else if (this.resource.generate) {

				console.error("deprecated generate", this);

			const [value, key] = this.resource.set;

			this.parent.setValue(value, key);

		} else if (this.resource.task) {

			console.error("deprecated task", this);

			// if (typeof this.resource.task === "string") {
			//
			// 	this.doTask(this.resource.task);
			//
			// } else if (Array.isArray(this.resource.task)) {
			//
			// 	const [action, ...args] = this.resource.task;
			//
			// 	this.doTask(action, ...args);
			//
			// }

			// this.doTask(this.resource.task);

			console.error("deprecated");

			const work = this.parse(this.resource.task);

			// const task = this.doTask();

			if (work.task) {

				work.do();

			}

			this.render();

		} else if (this.resource.action) {

			// await this.rendering();

			await this.doTask();

			// KarmaFieldsAlpha.Jobs.add(work);
			//
			// await this.render(); // should be removed because sometime we need a global rendering (like close button)

		}

		// if (this.resource.command) {
		//
		// 	this.parent.request(this.resource.command, this.resource.value);
		//
		// // } else if (this.resource.download) {
		// //
		// // 	this.startDownload();
		//
		// } else if (this.resource.values) {
		//
		// 	this.parent.request(this.resource.action, ...this.resource.values);
		//
		// } else if (this.resource.value) {
		//
		// 	this.parent.request(this.resource.action, this.resource.value);
		//
		// } else {
		//
		// 	this.parent.request(this.resource.action);
		//
		// }

	}


	// startDownload() {
	//
	// 	// debugger;
	// 	const params = KarmaFieldsAlpha.Store.getParams();
	//
	// 	KarmaFieldsAlpha.currentExport = {
	// 		page: 1,
	// 		params: params,
	// 		string: "",
	// 		rows: [],
	// 		grid: new KarmaFieldsAlpha.Grid()
	// 	};
	//
	// 	this.render();
	//
	// }


	// processDownload() {
	//
	// 	const ppp = 1000;
	//
	// 	const object = KarmaFieldsAlpha.currentExport;
	//
	// 	if (object) {
	//
	// 		const saucer = this.getRoot();
	// 		const table = saucer.getGrid();
	//
	// 		const count = KarmaFieldsAlpha.Query.getCount(table.resource.driver, table.resource.params);
	//
	// 		if (count !== undefined && count !== KarmaFieldsAlpha.loading) {
	//
	// 			object.total = Math.ceil(count/ppp);
	//
	// 			// let rows;
	//
	// 			// while (object.page < count/ppp) {
	// 			while (object.rows.length < count) {
	//
	// 				const params = {...object.params, page: object.page, ppp: ppp};
	// 				const ids = KarmaFieldsAlpha.Query.getIds(table.resource.driver, params);
	//
	// 				if (!ids || ids === KarmaFieldsAlpha.loading) {
	//
	// 					break;
	//
	// 				}
	//
	// 				const rows = table.exportData(ids);
	//
	// 				if (!rows || rows === KarmaFieldsAlpha.loading) {
	//
	// 					break;
	//
	// 				}
	//
	// 				object.rows = [...object.rows, ...rows];
	// 				object.page++;
	//
	// 			}
	//
	// 			if (object.rows.length >= count) {
	//
	// 				const grid = new KarmaFieldsAlpha.Grid();
	//
	// 				grid.addRow(...object.rows);
	//
	// 				const csv = grid.toString();
	//
	// 				const element = document.createElement('a');
	// 				element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
	// 				element.setAttribute("download", "export.csv");
	// 				element.style.display = "none";
	// 				document.body.appendChild(element);
	//
	// 				element.click();
	//
	// 				document.body.removeChild(element);
	//
	// 				delete KarmaFieldsAlpha.currentExport;
	//
	// 			}
	//
	// 		}
	//
	// 	}
	//
	// }



	build() {
		return {
			tag: "button",
			class: "button karma-button karma-field",
			init: button => {
				button.element.tabIndex = -1;
				// console.log(this.resource.dashicon);
				// if (this.resource.dashicon === "editor-bold") debugger;
				button.element.classList.toggle("simple-buttons", this.getResource("simplebuttons") || false);
			},
			// child: {
			// 	tag: "span",
			// 	update: span => {
			// 		if (this.resource.dashicon) {
			// 			span.element.className = "dashicons dashicons-"+this.parse(this.resource.dashicon);
			// 			span.element.textContent = this.resource.text || "";
			// 		} else {
			// 			span.element.className = "text";
			// 			span.element.textContent = this.parse(this.resource.text || this.resource.title || "");
			// 		}
			//
			// 	}
			// },
			children: [
				{
					tag: "span",
					update: span => {
						span.element.classList.toggle("hidden", !this.resource.dashicon);
						if (this.resource.dashicon) {
							const dashicon = this.parse(this.resource.dashicon);
							span.element.classList.add("dashicons", `dashicons-${dashicon.toString()}`);
							// span.element.className = "dashicons dashicons-"+.toString();
						}
					}
				},
				{
					tag: "span",
					update: span => {
						span.element.classList.toggle("hidden", !this.resource.text);
						if (this.resource.text) {
							span.element.className = "text";
							const text = this.parse(this.resource.text);
							span.element.textContent = text.toString();
						}
					}
				},
			],
			update: button => {

				if (this.resource.primary) {

					const primary = this.parse(this.resource.primary);

					button.element.classList.toggle("button-primary", primary.toBoolean());

				}



				button.element.onmousedown = event => {
					event.preventDefault(); // -> keep focus to current active element
					event.stopPropagation(); // -> prevent selecting parent stuffs
				}

				button.element.onclick = event => {

					event.preventDefault(); // -> prevent submitting form in post-edit

					// if (this.resource.command) {
					// 	this.parent.execute(this.resource.command, this.resource.value);
					// } else if (this.resource.download) {
					// 	this.startDownload();
					// } else if (this.resource.values) {
          //   this.parent.request(this.resource.action, ...this.resource.values);
          // } else if (this.resource.value) {
          //   this.parent.request(this.resource.action, this.resource.value);
          // } else {
          //   this.parent.request(this.resource.action);
          // }

					this.click();

        }

				// if (this.resource.download) {
				// 	this.processDownload();
				// }

				// if (this.resource.disabled) {
				// 	button.element.disabled = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.disabled));
				// }
				//
        // if (this.resource.enabled) {
				//
				// 	const enabled = this.parse(this.resource.enabled);
				//
				// 									// console.log(this.resource, this.resource.enabled, enabled);
				//
				// 	button.element.disabled = !KarmaFieldsAlpha.Type.toBoolean(enabled);
				// }

				// const active = await this.isActive();
				// const busy = await this.isBusy();



				if (this.resource.disabled) {
					const disabled = this.parse(this.resource.disabled);
					button.element.disabled = disabled.toBoolean();
				} else if (this.resource.enabled) {
					const enabled = this.parse(this.resource.enabled);
					button.element.disabled = !enabled.toBoolean();
				}

				if (this.resource.active) {
					const active = this.parse(this.resource.active);
					button.element.classList.toggle("active", active.toBoolean());
				}

				if (this.resource.loading) {
					const loading = this.parse(this.resource.loading);
					button.element.classList.toggle("loading", loading.toBoolean());
				}

				//
				// if (this.resource.active) {
				// 	const active = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.active));
				// 	button.element.classList.toggle("active", active);
				// }



				// button.element.classList.toggle("active", active.toBoolean());
				// button.element.classList.toggle("loading", busy.toBoolean());

        // if (this.resource.loading) {
				// 	const loading = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.loading));
				// 	button.element.classList.toggle("editing", loading);
        //   button.element.classList.toggle("loading", loading);
				// }

				// if (this.resource.test) {
				// 	console.log(this.parse(this.resource.test));
				// }

			}
		};

	}

}

// KarmaFieldsAlpha.field.download = class extends KarmaFieldsAlpha.field.button {
//
// 	getFilename() {
//
// 		return this.parse(this.resource.filename || "export.csv").toString();
//
// 	}
//
//
//
// 	click() {
//
// 		const currentExport = KarmaFieldsAlpha.Store.get("currentExport");
//
// 		if (!currentExport) {
//
// 			const params = KarmaFieldsAlpha.Store.Layer.getParams();
//
// 			// KarmaFieldsAlpha.currentExport = {
// 			// 	page: 1,
// 			// 	params: params,
// 			// 	// string: "",
// 			// 	rows: [],
// 			// 	// grid: new KarmaFieldsAlpha.Grid()
// 			// };
//
// 			KarmaFieldsAlpha.Store.set({
// 				page: 1,
// 				params: params,
// 				rows: [],
// 				grid: new KarmaFieldsAlpha.GridContent()
// 			}, "currentExport");
//
// 			this.render();
//
// 		}
//
// 	}
//
// 	isBusy() {
//
// 		const ppp = this.resource.ppp || 1000;
//
// 		const object = KarmaFieldsAlpha.Store.get("currentExport");
//
// 		if (object) {
//
// 			// const saucer = this.getRoot();
// 			// const table = saucer.getGrid();
// 			// const count = table.getCount();
//
//
// 			const table = this.request("getGrid");
//
// 			// const driver = this.request("getDriver");
// 			const countContent = this.request("count");
//
// 			if (!countContent.loading) {
//
// 				const count = countContent.toNumber();
//
// 				object.total = Math.ceil(count/ppp);
//
// 				while (object.grid.value.length < count) {
//
// 					const params = {...object.params, page: object.page, ppp: ppp};
// 					const ids = KarmaFieldsAlpha.Query.getIds(table.resource.driver, params);
//
// 					if (!ids) {
//
// 						break;
//
// 					}
//
// 					// const rows = table.exportData(ids);
//
// 					const gridContent = new KarmaFieldsAlpha.Content.Grid();
//
// 					table.exportData(gridContent, ids);
//
// 					if (gridContent.loading) {
//
// 						break;
//
// 					}
//
// 					// object.rows = [...object.rows, ...gridContent.toArray()];
// 					object.grid.value = [...object.grid.value, ...gridContent.value];
// 					object.page++;
//
// 				}
//
// 				if (object.grid.value.length >= count) {
//
//
// 					// const grid = new KarmaFieldsAlpha.Grid();
// 					//
// 					// grid.addRow(...object.rows);
// 					//
// 					// const csv = grid.toString();
//
// 					const csv = object.grid.toString();
// 					const filename = this.getFilename();
//
// 					const element = document.createElement('a');
// 					element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
// 					element.setAttribute("download", filename);
// 					element.style.display = "none";
// 					document.body.appendChild(element);
//
// 					element.click();
//
// 					document.body.removeChild(element);
//
// 					// delete KarmaFieldsAlpha.currentExport;
//
// 					KarmaFieldsAlpha.Store.remove("currentExport");
//
// 					return false;
//
// 				}
//
// 			}
//
// 			// KarmaFieldsAlpha.Store.set(object, "currentExport");
//
// 			return true;
// 		}
//
// 		return false;
// 	}
//
// }



KarmaFieldsAlpha.field.download = class extends KarmaFieldsAlpha.field.button {

	constructor(resource, id, parent) {

		super({
			text: "Export",
			...resource
		}, id, parent);

	}

	async download(grid) {

		// const csv = grid.toString(",");

		const csv = Papa.unparse(grid.value);
		const filename = this.parse(this.resource.filename || "export.csv").toString();

		const element = document.createElement("a");
		// element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
		element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));

		element.setAttribute("download", filename);
		element.style.display = "none";
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);

	}

	// async doTask() {
	//
	// 	const table = this.closest(field => field.constructor === KarmaFieldsAlpha.field.table);
	//
	// 	let count = table.queryCount();
	//
	// 	while (count.loading) {
	//
	// 		await this.render();
	// 		count = table.queryCount();
	//
	// 	}
	//
	// 	const ppp = this.resource.ppp || 100;
	// 	let page = 0;
	// 	let tableData = new KarmaFieldsAlpha.Content.Grid();
	//
	// 	while (page*ppp < count.toNumber()) {
	//
	// 		await table.setPage(page+1);
	//
	// 		const length = Math.min(ppp, count.toNumber()-page*ppp);
	// 		const grid = table.getChild("body");
	//
	// 		let gridData = grid.export(0, length);
	//
	// 		while (gridData.loading) {
	//
	// 			await this.render();
	// 			gridData = grid.export(0, length);
	//
	// 		}
	//
	// 		tableData.value = [...tableData.toArray(), ...gridData.toArray()];
	//
	// 		page++;
	//
	// 	}
	//
	// 	await this.download(tableData);
	//
	// }

	async doTask() {

		const closestTable = this.closest(field => field.constructor === KarmaFieldsAlpha.field.table);

		const table = new KarmaFieldsAlpha.field.table(closestTable.resource, "clone", this);
		const params = closestTable.getParams();
		table.setState(params, "params");

		let count = table.queryCount();

		while (count.loading) {

			await this.render();
			count = table.queryCount();

		}

		const ppp = this.resource.ppp || 100;
		let page = 0;
		let tableData = new KarmaFieldsAlpha.Content.Grid();

		while (page*ppp < count.toNumber()) {

			await table.setPage(page+1);

			const length = Math.min(ppp, count.toNumber()-page*ppp);
			const grid = table.getChild("body");

			let gridData = grid.export(0, length);

			while (gridData.loading) {

				await this.render();
				gridData = grid.export(0, length);

			}

			tableData.value = [...tableData.toArray(), ...gridData.toArray()];

			page++;

		}

		if (this.resource.headers) {

			tableData.value = [this.resource.headers, ...tableData.value];

		}

		await this.download(tableData);

	}




	async click() {

		await this.doTask();

	}


}



KarmaFieldsAlpha.field.submit = class extends KarmaFieldsAlpha.field.button {

	constructor(resource, id, parent) {
		super({
			primary: true,
			text: "Submit",
			action: "submit",
			enabled: ["request", "hasDelta"],
			...resource
		}, id, parent);

	}

}

// KarmaFieldsAlpha.field.downloadButton = class extends KarmaFieldsAlpha.field.button {
//
// 	getHref() {
//
// 		let href;
// 		let params;
//
// 		if (this.resource.href) {
//
// 			href = this.resource.href;
//
// 		} else if (this.resource.rest) {
//
// 			href = KarmaFieldsAlpha.restURL+this.resource.rest;
//
// 		}
//
// 		if (this.resource.params) {
//
// 			params = this.parseParams(this.resource.params);
//
// 		} else {
//
// 			params = KarmaFieldsAlpha.Store.getParams();
//
// 		}
//
// 		const requestParams = [];
//
// 		for (let key in params) {
//
// 			if (key !== "page" && key !== "ppp") {
//
// 				requestParams.push(`${key}=${params[key]}`);
//
// 			}
//
// 		}
//
// 		if (requestParams.length) {
//
// 			href = `${href}?${requestParams.join("&")}`;
//
// 		}
//
// 		return href;
// 	}
//
//
//
// 	// loop() {
// 	//
// 	// 	const ppp = 100;
// 	//
// 	// 	const object = KarmaFieldsAlpha.Store.get("export");
// 	//
// 	// 	if (object) {
// 	//
// 	// 		const count = KarmaFieldsAlpha.Query.getCount(object.driver, object.params);
// 	//
// 	// 		if (count === undefined || count === KarmaFieldsAlpha.loading) {
// 	//
// 	// 			this.render();
// 	// 			return;
// 	//
// 	// 		}
// 	//
// 	// 		const total = Math.ceil(count/ppp);
// 	//
// 	// 		// if (object.page < total) {
// 	//
// 	// 			const params = {...object.params, page: object.page, ppp: ppp};
// 	// 			const ids = KarmaFieldsAlpha.Query.getIds(object.driver, params);
// 	//
// 	// 			if (!ids || ids === KarmaFieldsAlpha.loading) {
// 	//
// 	// 				this.render();
// 	// 				return;
// 	//
// 	// 			}
// 	//
// 	//
// 	// 			const grid = new KarmaFieldsAlpha.Grid();
// 	// 			const rows = this.exportData(ids);
// 	//
// 	// 			if (!rows || rows === KarmaFieldsAlpha.loading) {
// 	//
// 	// 				this.render();
// 	// 				return;
// 	//
// 	// 			}
// 	//
// 	// 			grid.addRow(...rows);
// 	//
// 	// 			object.csv += grid.toString();
// 	//
// 	// 			object.page++;
// 	//
// 	//
// 	//
// 	// 		if (object.page < total) {
// 	//
// 	// 			this.render();
// 	// 			return;
// 	//
// 	// 		}
// 	//
// 	// 		const element = document.createElement('a');
// 	// 		element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(object.csv));
// 	// 		element.setAttribute("download", "export.csv");
// 	// 		element.style.display = "none";
// 	// 		document.body.appendChild(element);
// 	//
// 	// 		element.click();
// 	//
// 	// 		document.body.removeChild(element);
// 	//
// 	// 		KarmaFieldsAlpha.Store.set(null, "export");
// 	//
// 	// 	}
// 	//
// 	// }
//
//
//
// 	build() {
// 		return {
// 			tag: "a",
// 			class: "button karma-button karma-field",
// 			init: button => {
// 				button.element.tabIndex = -1;
// 			},
// 			child: {
// 				tag: "span",
// 				update: span => {
// 					if (this.resource.dashicon) {
// 						span.element.className = "dashicons dashicons-"+this.parse(this.resource.dashicon);
// 						span.element.textContent = this.resource.text || "";
// 					} else {
// 						span.element.className = "text";
// 						span.element.textContent = this.parse(this.resource.text || this.resource.title || "");
// 					}
//
// 				}
// 			},
// 			update: button => {
//
// 				if (this.resource.primary) {
// 					button.element.classList.add("primary");
// 				}
//
// 				button.element.download = this.resource.filename || "export";
//
// 				button.element.href = this.getHref();
//
// 				if (this.resource.disabled) {
//
// 					button.element.disabled = KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.disabled));
//
// 				}
//
// 				if (this.resource.enabled) {
//
// 					const enabled = this.parse(this.resource.enabled);
//
// 					button.element.disabled = !KarmaFieldsAlpha.Type.toBoolean(enabled);
//
// 				}
//
// 				if (this.resource.test) {
//
// 					console.log(this.parse(this.resource.test));
//
// 				}
//
// 			}
// 		};
//
// 	}
//
// }
