KarmaFieldsAlpha.fields.text = class extends KarmaFieldsAlpha.fields.field {

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

		// if (this.resource.multiple) {
		// 	this.registerType("json");
		// }

		// if (this.resource.multiple) {
		// 	this.registerRelations();
		// }
		//
		// if (this.resource.multiple) {
		// 	KarmaFieldsAlpha.Relations.register();
		// }
	}

	// async fetchValue(expectedType, ...path) {
	// 	if (this.resource.key) {
	// 		const values = await super.fetchValue();
	//
	// 	}
	//
	// }

	async fetchText(key, driver, type) {
		let value = await this.parent.fetchValue(type, key);

		if (driver) {

			const options = await this.fetchOptions(driver);

			if (type === "array") {

				value = value.length && options.filter(option => value.includes(option.key)).map(option => option.name) || [];

			} else {

				const option = options.find(option => option.key === value);
				value = option && option.name || "";

			}

		}

		return value;
	}

	// async parseTemplate(value) {
	// 	const matches = value.match(/%([^%]+)%/g);
	// 	if (matches) {
	// 		const values = await Promise.all(matches.map(match => this.fetchText(...match.slice(1, -1).split(":"))));
	// 		matches.forEach((match, index) => {
	// 			value = value.replace(match, values[index] || "");
	// 		});
	// 	}
	// 	return value;
	// }

	async parseSingle(value) {
		const matches = value.match(/%([^%]+)%/g);

		if (matches) {

			for (const match of matches) {

				const text = await this.fetchText(...match.slice(1, -1).split(":"));

				value = value.replace(match, text || "");

			}

		}

		// value = value.replace(/%{2}/g, "%");

		return value;
	}

	async * parseMulti(value) {
		const match = value.match(/\*([^*:]+):?([^*]+)?\*/);

		value = value.replace(/%{2}/g, "%");

		if (match) {
			const texts = await this.fetchText(match[1], match[2], "array");

			for (const text of texts) {

				yield value.replace(match[0], text);

			}

		} else {

			yield value;

		}
	}


	// async parseText(text, key, value) {
	// 	console.log([text, key, value]);
	// 	if (key && value !== undefined) {
	// 		text = text.replace("%"+key+"%", value);
	// 	}
	// 	// if (key) {
	// 	// 	text = text.replace(/%value:([^%]+)%/, (match, driver) => "%"+key+":"+driver+"%");
	// 	// }
	//
	// 	if (key && value !== undefined) {
	// 		text = text.replace("%"+key+"%", value);
	// 	}
	//
	// 	console.log([text, key, value], await this.parseTemplate(text));
	// 	return this.parseTemplate(text);
	// }


	// getDrivers(text) {
	// 	const matches = value.match(/%[^%]+:[^%]+%/g);
	// 	if (matches) {
	// 		return matches.map(match => match.match(/:([^%]+)%/)[1]);
	// 	}
	// }

	// async parseMultipleTexts(text) {
	//
	// 	let values; // = await this.fetchValue(this.resource.multiple && "array" || undefined);
	//
	// 	// if (this.resource.key && this.resource.multiple) {
	// 	if (this.resource.multiple) {
	// 		// values = await this.fetchValue("array");
	// 		values = await this.fetchValue("relations", this.resource.multiple);
	// 	// } else if (this.resource.key) {
	// 	// 	const value = await this.fetchValue();
	// 	// 	values = [value];
	// 	} else {
	// 		values = [this.resource.value];
	// 	}
	//
	// 	// if (!Array.isArray(values)) {
	// 	// 	values = values && [values] || [];
	// 	// }
	//
	// 	// const key = this.resource.map || this.resource.key;
	//
	// 	// const code = "%"+key+"%";
	// 	// let driverCode;
	//
	// 	let options;
	// 	let driver;
	//
	// 	if (this.resource.multiple) {
	// 		const reg = new RegExp("%"+this.resource.multiple+":([^%]+)%");
	// 		const match = text.match(reg);
	// 		if (match) {
	// 			driver = match[1];
	// 			options = await this.fetchOptions(driver);
	// 			// driverCode = driver && "%"+key+":"+driver+"%";
	// 		}
	// 	}
	//
	// 	return Promise.all(values.map(value => {
	// 		let child = text;
	// 		if (this.resource.multiple) {
	// 			child = child.replace("%"+this.resource.multiple+"%", value.toString());
	// 		}
	// 		if (driver && options) {
	// 			child = child.replace("%"+this.resource.multiple+":"+driver+"%", () => {
	// 				const option = options.find(option => option.key === value.toString());
	// 				return option && option.name || "";
 	// 			});
	// 		}
	// 		return this.parseTemplate(child);
	// 	}));
	// }


	async getTexts(text) {
		const texts = [];

		if (this.resource.single !== false) {

			text = await this.parseSingle(text);

		}

		if (this.resource.multi !== false) {

			const generator = this.parseMulti(text);

			for await (const item of generator) {
		    texts.push(item);
		  }

		} else {

			return [text];

		}

		return texts;
	}

	// buildText(text) {
	// 	return {
	// 		class: "text-item",
	// 		init: span => {
	// 			if (this.resource.element) {
	// 				Object.assign(span.element, this.resource.element);
	// 			}
	// 		},
	// 		update: async node => {
	// 			node.element.innerHTML = text;
	// 		}
	// 	};
	// }

	build() {
		return {
			tag: this.resource.tag,
			class: "text karma-field",
			init: span => {
				span.element.setAttribute('tabindex', '-1');
			},
			update: async node => {
				this.render = node.render;
				node.element.classList.add("loading");

				const texts = await this.getTexts(this.resource.value);
				node.children = texts.map(text => {
					return {
						class: "text-item",
						init: span => {
							if (this.resource.element) {
								Object.assign(span.element, this.resource.element);
							}
						},
						update: async node => {
							node.element.innerHTML = text;
						}
					};
				});


				node.element.classList.remove("loading");
			}
		};
	}

	buildSimple() {
		return {
			class: "text-item",
			init: span => {
				if (this.resource.element) {
					Object.assign(span.element, this.resource.element);
				}
			},
			update: async node => {
				const texts = await this.getTexts(this.resource.value);
				node.element.innerHTML = text;
			}
		}
	}
}
