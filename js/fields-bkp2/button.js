KarmaFieldsAlpha.field.button = class extends KarmaFieldsAlpha.field {

	// exportDefaults() {

	// 	return new KarmaFieldsAlpha.Content({});

	// }

	doTask() {

		if (this.resource.action || this.resource.task) {

			if (this.resource.save) {

				this.save(this.resource.save);

			}

			KarmaFieldsAlpha.server.promise(done => {

				let params = [];

				if (this.resource.params) {

					params = this.resource.params.map(param => this.parse(param));

					if (params.some(param => param === undefined)) {

						return;

					}

				}

				this.request(this.resource.action || this.resource.task, ...params);

				done();

			}, "button");

		}

	}

	click() {

		if (this.resource.request) {

			console.error("DEPrECATED button request parameter")

		} else if (this.resource.post) { // -> post custom things

			console.error("NOT IMPLEMENTED!");

		} else if (this.resource.task ||this.resource.action) {

			this.doTask();

		}

		this.render();

	}

	isDisabled() {

		if (this.resource.disabled) {

			return this.parseBoolean(this.resource.disabled) || false;

		} else if (this.resource.enabled) {

			return !this.parseBoolean(this.resource.enabled);

		}

	}

	isActive() {

		if (this.resource.active) {

			return this.parseBoolean(this.resource.active) || false;

		}

		return false;

	}

	getDashicon() {

		if (this.resource.dashicon) {

			return this.parseString(this.resource.dashicon);

		}

	}

	getText() {

		if (this.resource.text) {

			return this.parseString(this.resource.text) || "";

		}

		return "";
	}

	*build() {
		yield {
			tag: "button",
			class: "button karma-button karma-field",
			init: element => {
				element.tabIndex = -1;
				element.classList.toggle("simple-buttons", this.getResource("simplebuttons") || false);
			},
			children: [
				{
					tag: "span",
					update: element => {
						const dashicon = this.getDashicon();
						element.className = dashicon ? `dashicons dashicons-${dashicon}` : "hidden";

						// element.classList.toggle("hidden", !dashicon);
						// if (dashicon) {
						// 	element.classList.add("dashicons", `dashicons-${dashicon}`);
						// }
						// if (this.resource.dashicon) {
						// 	const dashicon = this.parseString(this.resource.dashicon);
						// 	if (dashicon) {
						// 		element.classList.add("dashicons", `dashicons-${dashicon}`);
						// 	}
						// }
					}
				},
				{
					tag: "span",
					update: element => {
						const text = this.getText();
						element.className = text ? "text" : "hidden";
						// element.classList.toggle("hidden", !text);
						// element.classList.toggle("text", Boolean(text));
						element.textContent = text || "";
					}
				},
			],
			update: element => {
				if (this.resource.primary) {
					const primary = this.parseBoolean(this.resource.primary) || false;
					element.classList.toggle("button-primary", primary);
				}
				element.onmousedown = event => {
					event.preventDefault(); // -> keep focus to current active element
					event.stopPropagation(); // -> prevent selecting parent stuffs
				}

				element.onclick = event => {
					event.preventDefault(); // -> prevent submitting form in post-edit
					this.click();
				}

				// if (this.resource.disabled) {
				// 	element.disabled = this.parseBoolean(this.resource.disabled) || false;
				// } else if (this.resource.enabled) {
				// 	element.disabled = !this.parseBoolean(this.resource.enabled);
				// }

				element.disabled = this.isDisabled();

				// if (this.resource.active) {
				// 	const active = this.parseBoolean(this.resource.active) || false;
				// 	element.classList.toggle("active", active);
				// }

				const active = this.isActive();
				element.classList.toggle("active", active);


				if (this.resource.loading) {
					const loading = this.parse(["loading", this.resource.loading]);
					element.classList.toggle("loading", loading);
				}

			}
		};

	}

}

// KarmaFieldsAlpha.field.download = class extends KarmaFieldsAlpha.field.button {

// 	constructor(resource, id, parent) {

// 		super({
// 			text: "Export",
// 			...resource
// 		}, id, parent);

// 	}

// 	download(grid) {

// 		// const csv = grid.toString(",");

// 		const csv = Papa.unparse(grid.value);
// 		const filename = this.parse(this.resource.filename || "export.csv").toString();

// 		const element = document.createElement("a");
// 		// element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
// 		element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));

// 		element.setAttribute("download", filename);
// 		element.style.display = "none";
// 		document.body.appendChild(element);

// 		element.click();

// 		document.body.removeChild(element);

// 	}


// 	async doTask() {

// 		const closestTable = this.closest(field => field.constructor === KarmaFieldsAlpha.field.table);

// 		const table = new KarmaFieldsAlpha.field.table(closestTable.resource, "clone", this);
// 		const params = closestTable.getParams();
// 		table.setState(params, "params");

// 		let count = table.queryCount();

// 		while (count.loading) {

// 			await this.render();
// 			count = table.queryCount();

// 		}

// 		const ppp = this.resource.ppp || 100;
// 		let page = 0;
// 		let tableData = new KarmaFieldsAlpha.Content.Grid();

// 		while (page*ppp < count.toNumber()) {

// 			await table.setPage(page+1);

// 			const length = Math.min(ppp, count.toNumber()-page*ppp);
// 			const grid = table.getChild("body");

// 			let gridData = grid.export(0, length);

// 			while (gridData.loading) {

// 				await this.render();
// 				gridData = grid.export(0, length);

// 			}

// 			tableData.value = [...tableData.toArray(), ...gridData.toArray()];

// 			page++;

// 		}

// 		if (this.resource.headers) {

// 			tableData.value = [this.resource.headers, ...tableData.value];

// 		}

// 		await this.download(tableData);

// 	}




// 	async click() {

// 		await this.doTask();

// 	}


// }


KarmaFieldsAlpha.field.download = class extends KarmaFieldsAlpha.field.button {

	constructor(resource, id, parent) {
		super({
			primary: true,
			text: "Export",
			action: "exportTable",
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.submit = class extends KarmaFieldsAlpha.field.button {

	constructor(resource, id, parent) {
		super({
			primary: true,
			text: "Submit",
			action: "submit",
			enabled: ["request", "hasEdits"],
			...resource
		}, id, parent);

	}

}

KarmaFieldsAlpha.field.open = class extends KarmaFieldsAlpha.field.button {

	constructor(resource, id, parent) {
		super({
			text: "Edit",
			action: "open",
			enabled: ["request", "isSelected"],
			...resource
		}, id, parent);

	}

}
