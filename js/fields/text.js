KarmaFieldsAlpha.fields.text = class extends KarmaFieldsAlpha.fields.field {

	static valueReg = /\{\{(?:value::)?(.*?)(?:::(.*))?\}\}/;
	static dateReg = /\{\{date::(.*?)::(.*)\}\}/;

	static loopReg = /\{\{for::(.*?)\}\}(.*?)\{\{end\}\}/;

	static ifReg = /\{\{if::(.+?)\}\}(.*?)\{\{end\}\}/;
	static elseifReg = /(.*?)\{\{elseif::(.+?)\}\}/;
	static elseReg = /(.*?)\{\{else\}\}/;

	static allSingleReg = /\{\{(.*?)\}\}/g;

	static paramReg = /\{\{param::(.*?)(?:::(.*?))?\}\}/;


	initField() {



		// -> compat
		if (!this.resource.value && this.resource.key && this.resource.driver) {
			// console.warn("DEPRECATED");
			this.resource.value = "%"+this.resource.key+":"+this.resource.driver+"%";
		} else if (!this.resource.value && this.resource.key) {
			// console.warn("DEPRECATED");
			this.resource.value = "%"+this.resource.key+"%";
		}

		if (!this.resource.value) {
			console.error("Resource missing value attribute");
		}

		// if (this.resource.value) {
		// 	if (this.resource.value.includes("*")) {
		// 		this.resource.value = this.resource.value.replace(/^(.*)\*([^%]+)\*(.*)$/, "{{#$2}}$1{{$2}}$3{{/$2}}");
		// 	}
		// 	if (this.resource.value.includes("%")) {
		// 		this.resource.value = this.resource.value.replace(/%([^%]+)%/g, "{{$1}}");
		// 	}
		// }


		// compat

	}

	exportValue() {
		return this.parse(this.resource.value);
	}

	importValue(value) {
	}

	async getString(key) {

		const event = this.createEvent({
			action: "get",
			type: "string",
			path: [key]
		});

		await this.dispatch(event);

		return event.getValue();
	}

	async getArray(key) {

		const event = this.createEvent({
			action: "get",
			type: "array",
			path: [key]
		});

		await this.dispatch(event);

		return event.getValue();
	}

	async parseValue(text, key, value) {

		let match = text.match(this.constructor.valueReg);

		while (match) {

			let matchValue = value;

			if (match[1] !== key) {

				// matchValue = await this.get(match, 0);
				matchValue = await this.getString(match[1]);

			}

			if (match[2]) {

				const options = await this.fetchOptions(match[2]);
				const option = options.find(option => option.key === matchValue);
				matchValue = option && option.name || "";

			}

			text = text.replace(match[0], matchValue);

			match = text.match(this.constructor.valueReg);

		}

		return text;
	}

	async parseDate(text, key, value) {



		let match = text.match(this.constructor.dateReg);

		while (match) {

			let date = value;

			if (match[1] !== key) {
				// date = await this.get(match[1], 0);
				date = await this.getString(match[1]);

			}

			date = moment(date).format(match[2] || "DD/MM/YYYY");

			// let array = await this.parent.fetchValue(null, match[1]);
			// let value = moment(array.toString()).format(match[2] || "DD/MM/YYYY");

			text = text.replace(match[0], date);

			match = text.match(this.constructor.dateReg);

		}

		return text;
	}

	async parseParam(text) {

		let match = text.match(this.constructor.paramReg);

		while (match) {

			let matchValue = this.getParam(match[1]);

			if (match[2]) {
				const options = await this.fetchOptions(match[2]);
				const option = options.find(option => option.key === matchValue);
				matchValue = option && option.name || "";
			}

			text = text.replace(match[0], matchValue);

			match = text.match(this.constructor.paramReg);

		}

		return text;
	}

	async parseLoop(text) {


		const match = text.match(this.constructor.loopReg);

		if (match) {

			// let array = await this.parent.get(match[1]);
			let array = await this.getArray(match[1]);

			let content = "";

			for (var i in array) {

				let item = match[2];

				// item = await this.parseConditional(item);
				item = await this.parseDate(item, match[1], array[i]);
				item = await this.parseValue(item, match[1], array[i]);

				content += item;

				// content += await this.parseValue(match[2], match[1], array[i]);

			}

			text = text.replace(match[0], content);

		}

		return text;
	}

	async parseConditional(text) {

		let matchIf = text.match(this.constructor.ifReg);

		while (matchIf) {

			let ifText = matchIf[2];

			let [key,context] = matchIf[1].split("::").reverse();
			let ok;
			if (context === "param") {
				ok = this.getParam(key);
			} else {
				ok = await this.getString(key);
			}
			let okText = "";

			let matchElseif = ifText.match(this.constructor.elseifReg);

			while (matchElseif) {

				if (!ok) {

					[key,context] = matchElseif[2].split("::").reverse();
					if (context === "param") {
						ok = this.getParam(key);
					} else {
						ok = await this.getString(key);
					}

					// ok = await this.getString(matchElseif[2]);
				} else if (!okText) {
					okText = matchElseif[1];
				}

				ifText = ifText.slice(matchElseif[0].length);
				matchElseif = ifText.match(this.constructor.elseifReg);

			}

			let matchElse = ifText.match(this.constructor.elseReg);

			if (matchElse) {

				if (!ok) {
					ok = true;
				} else if (!okText) {
					okText = matchElse[1];
				}

				ifText = ifText.slice(matchElse[0].length);

			}

			if (ok && !okText) {
				okText = ifText;
			}

			text = text.replace(matchIf[0], okText);

			matchIf = text.match(this.constructor.ifReg);
		}

		return text;
	}


	async parse(text) {

		text = await this.parseConditional(text);
		text = await this.parseLoop(text);
		text = await this.parseDate(text);
		text = await this.parseParam(text);
		text = await this.parseValue(text);

		return text;
	}

	preParse(text) {

		text = text.replace(this.constructor.loopReg, "...");
		text = text.replace(this.constructor.ifReg, "...");
		text = text.replace(this.constructor.allSingleReg, "...");

		return text;
	}

	build() {
		return {
			tag: this.resource.tag,
			class: "text karma-field",
			init: node => {
				// if (this.resource.dynamic) {
				// 	this.splash = request =>
				// 	this.setEventListener(async () => {
				// 		node.element.innerHTML = await this.parse(this.resource.value);
				// 	});
				// }
				// if (this.resource.disabled) {
				// 	this.setEventListener(async () => {
				// 		node.element.classList.toggle("disabled", await this.check(this.resource.disabled));
				// 	});
				// }
				// if (this.resource.hidden) {
				// 	this.setEventListener(async () => {
				// 		node.element.parentNode.classList.toggle("hidden", await this.check(this.resource.hidden));
				// 	});
				// }
				if (this.resource.dynamic || this.resource.hidden || this.resource.disabled) {
					this.splash = request => this.render();
				}
			},
			update: async node => {
				this.render = node.render;

				// node.element.innerHTML = this.preParse(this.resource.value);


				await this.parse(this.resource.value).then(value => {
					node.element.innerHTML = value;
				});

				if (this.resource.disabled) {
					node.element.classList.add("disabled");
					this.check(this.resource.disabled).then(disabled => {
						node.element.classList.toggle("disabled", disabled);
					});
				}

				if (this.resource.hidden) {
					node.element.parentNode.classList.add("hidden");
					this.check(this.resource.hidden).then(hidden => node.element.parentNode.classList.toggle("hidden", hidden));
				}


			}
		};
	}


}


// KarmaFieldsAlpha.fields.text.valueReg = /\{\{(?:value::)?(.*?)(?:::(.*))?\}\}/;
// KarmaFieldsAlpha.fields.text.dateReg = /\{\{date::(.*?)::(.*)\}\}/;
//
// KarmaFieldsAlpha.fields.text.loopReg = /\{\{for::(.*?)\}\}(.*)\{\{end\}\}/;
//
// KarmaFieldsAlpha.fields.text.ifReg = /\{\{if::(.+?)\}\}(.*)\{\{end\}\}/;
// KarmaFieldsAlpha.fields.text.elseifReg = /(.*?)\{\{elseif::(.+?)\}\}/;
// KarmaFieldsAlpha.fields.text.elseReg = /(.*?)\{\{else\}\}/;
//
// KarmaFieldsAlpha.fields.text.allSingleReg = /\{\{(.*?)\}\}/g;
