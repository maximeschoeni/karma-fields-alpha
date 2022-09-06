KarmaFieldsAlpha.fields.input = class extends KarmaFieldsAlpha.fields.field {

	async getDefault() {

		const defaults = {};

		const key = this.getKey();

		if (key && this.resource.default !== null) {

			defaults[key] = await this.parse(this.resource.default || "");

		}

		return defaults;
	}

	async exportValue() {
		const key = this.getKey();
		return this.get("string");
	}

	async importValue(value) {
		const key = this.getKey();
		await this.parent.request("set", {data: value}, key);
	}

	async export(keys = []) {
		const key = this.getKey();
		const defaults = {};
		if (keys.length === 0 || keys.includes(key)) {
			defaults[key] = await this.get("string");
		}
		return defaults;
	}

	async import(object) {
		const key = this.getKey();
		if (object[key] !== undefined) {
			await this.parent.request("set", {data: object[key]}, key);
		}
	}

	async set(value) {

		if (!this.isBusy()) {
			KarmaFieldsAlpha.History.save();
		}

		const key = this.getKey();

		await this.parent.request("set", {
			autosave: this.resource.autosave,
			data: value
		}, key);

		await this.parent.request("edit");

	}

	isBusy(duration = 3000) {
		if (!this.busy) {
			setTimeout(() => {
				this.busy = false;
			}, duration);
			this.busy = true;
			return false;
		}
		return true;
	}

	async enqueue(callback) {
		this.queueNext = callback;
		if (this.queue) {
			await this.queue;
		}
		if (this.queueNext === callback) {
			this.queue = this.queueNext();
			await this.queue;
			return true;
		}
		return false;
	}

	throttle(callback, interval = 500) {
		if (this.throttleTimer) {
			clearTimeout(this.throttleTimer);
		}
		this.throttleTimer = setTimeout(callback, interval);
	}

	getPlaceholder() {
		return this.parse(this.resource.placeholder || "");
	}

	build() {
		return {
			tag: "input",
			class: "text-input karma-field",
			init: input => {
				input.element.type = "text";
				if (this.resource.label) {
					input.element.id = this.getId();
				}
				if (this.resource.input) {
					Object.assign(input.element, this.resource.input);
				}
				if (this.resource.readonly) {
					input.element.readOnly = true;
				}
			},
			update: async input => {

				input.element.classList.add("loading");

				const key = this.getKey();

				const response = await this.parent.request("get", {}, key);

				const array = KarmaFieldsAlpha.Type.toArray(response);

				if (array.multiValue) {

					input.element.placeholder = "— No Change —";
					input.element.value = "";

					input.element.oncopy = async event => {
						const jsonData = await this.parent.request("export", {keys: [key]});
						const dataArray = KarmaFieldsAlpha.Clipboard.toDataArray(jsonData, false);
						const string = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
						event.clipboardData.setData("text/plain", string);
					};

					input.element.onpaste = async event => {
						event.preventDefault();
						const string = event.clipboardData.getData("text").normalize()
						const dataArray = KarmaFieldsAlpha.Clipboard.parse(string);
						const jsonData = KarmaFieldsAlpha.Clipboard.toJson(dataArray, false);
						await this.parent.request("import", {data: dataArray});
					};

				} else {

					const value = KarmaFieldsAlpha.Type.toString(response);

					if (value !== input.element.value) {

						input.element.value = value;

					}

					input.element.parentNode.classList.toggle("modified", await this.isModified());

					input.element.placeholder = await this.getPlaceholder();

					input.element.oncopy = event => {};

				}

				input.element.classList.remove("loading");

				input.element.oninput = async event => {

					this.throttle(async () => {

						input.element.classList.add("editing");

						// await this.parent.request("set", {
						// 	data: input.element.value.normalize(),
						// 	autosave: this.resource.autosave
						// }, key);

						await this.set(input.element.value.normalize());

						const isModified = await this.isModified();

						input.element.parentNode.classList.toggle("modified", isModified);
						input.element.classList.remove("editing");
					});

				};

				if (this.resource.disabled) {
					const disabled = await this.parent.parse(this.resource.disabled);
					input.element.disabled = Boolean(disabled);
				}

				if (this.resource.active) {
					const active = await this.parent.parse(this.resource.active);
					input.element.classList.toggle("active", Boolean(active));
				}

			}
		};
	}





}
