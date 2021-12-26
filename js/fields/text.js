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




	// async fetchText(key, driver, type) {
	// 	let value = await this.parent.fetchValue(type, key);
	//
	// 	if (driver) {
	//
	// 		const options = await this.fetchOptions(driver);
	//
	// 		if (type === "array") {
	//
	// 			value = value.length && options.filter(option => value.includes(option.key)).map(option => option.name) || [];
	//
	// 		} else {
	//
	// 			const option = options.find(option => option.key === value);
	// 			value = option && option.name || "";
	//
	// 		}
	//
	// 	}
	//
	// 	return value;
	// }


	// async parseSingle(value) {
	// 	const matches = value.match(/%([^%]+)%/g);
	//
	// 	if (matches) {
	//
	// 		for (const match of matches) {
	//
	// 			const text = await this.fetchText(...match.slice(1, -1).split(":"));
	//
	// 			value = value.replace(match, text || "");
	//
	// 		}
	//
	// 	}
	//
	// 	// value = value.replace(/%{2}/g, "%");
	//
	// 	return value;
	// }
	//
	// async * parseMulti(value) {
	// 	const match = value.match(/\*([^*:]+):?([^*]+)?\*/);
	//
	// 	value = value.replace(/%{2}/g, "%");
	//
	// 	if (match) {
	// 		const texts = await this.fetchText(match[1], match[2], "array");
	//
	// 		for (const text of texts) {
	//
	// 			yield value.replace(match[0], text);
	//
	// 		}
	//
	// 	} else {
	//
	// 		yield value;
	//
	// 	}
	// }


	async parseSingle(text, params = {}) {

		const mustaches = text.match(this.constructor.singleReg);

		if (mustaches && mustaches.length) {

			for (var i in mustaches) {

				let key, subkey, domain, value;

				// const match = mustaches[i].slice(2, -2);

				[,key, subkey, domain] = mustaches[i].match(this.constructor.splitReg);

				// [key, domain] = match.split(":");
				// [key, subkey] = key.split(".");

				if (params && params[key] !== undefined) {

					value = params[key];

				} else {

					value = await this.parent.fetchValue(null, key);

				}

				if (subkey && value[subkey] !== undefined) {

					value = value[subkey];

				}



				if (domain) {

					let functionMatch = domain.match(this.constructor.functionReg);


					if (functionMatch && this[functionMatch[1]]) {



						value = this[functionMatch[1]](value, ...functionMatch[2].split(",").map(arg => arg.trim()));

					} else {

						const options = await this.fetchOptions(domain);
						const option = options.find(option => option.key === value);
						value = option && option.name || "";

					}

				}

				text = text.replace(mustaches[i], value);

			}

		}

		return text;
	}

	async parse(text) {


		// compat
		if (text.includes("*")) {
			text = text.replace(/^(.*)\*([^%]+)\*(.*)$/, "{{#$2}}$1{{$2}}$3{{/$2}}");
		}
		if (text.includes("%")) {
			text = text.replace(/%([^%]+)%/g, "{{$1}}");
		}


		const iteration = text.match(this.constructor.multiReg);

		if (iteration && iteration[1] && iteration[1] === iteration[3]) {

			let content = "";
			let array = await this.parent.fetchValue("array", iteration[1]);

			if (array && array.length) {

				for (var i in array) {

					content += await this.parseSingle(iteration[2], {[iteration[1]]: array[i]});

				}

			}

			return text.replace(iteration[0], content);

		} else {

			return this.parseSingle(text);

		}

	}


	// async getTexts(text) {
	// 	const texts = [];
	//
	// 	if (this.resource.single !== false) {
	//
	// 		text = await this.parseSingle(text);
	//
	// 	}
	//
	// 	if (this.resource.multi !== false) {
	//
	// 		const generator = this.parseMulti(text);
	//
	// 		for await (const item of generator) {
	// 	    texts.push(item);
	// 	  }
	//
	// 	} else {
	//
	// 		return [text];
	//
	// 	}
	//
	// 	return texts;
	// }

	build() {
		return {
			tag: this.resource.tag,
			class: "text karma-field",
			update: async node => {
				this.render = node.render;
				node.element.classList.add("loading");

				node.element.innerHTML = await this.parse(this.resource.value);
				node.element.classList.remove("loading");

				// if (this.resource.iterator && this.resource.child) {
				// 	const array = await this.fetchValue("array", this.resource.iterator) || [];
				// 	node.children = array.map(value => this.resource.child);
				// }
			}
		};
	}

	// build() {
	// 	return {
	// 		tag: this.resource.tag,
	// 		class: "text karma-field",
	// 		// init: span => {
	// 		// 	span.element.setAttribute('tabindex', '-1');
	// 		// },
	// 		update: async node => {
	// 			this.render = node.render;
	// 			node.element.classList.add("loading");
	//
	// 			const texts = await this.getTexts(this.resource.value);
	// 			node.children = texts.map(text => {
	// 				return {
	// 					class: "text-item",
	// 					init: span => {
	// 						if (this.resource.element) {
	// 							Object.assign(span.element, this.resource.element);
	// 						}
	// 					},
	// 					update: async node => {
	// 						node.element.innerHTML = text;
	// 					}
	// 				};
	// 			});
	//
	//
	// 			node.element.classList.remove("loading");
	// 		}
	// 	};
	// }

	// buildSimple() {
	// 	return {
	// 		class: "text-item",
	// 		init: span => {
	// 			if (this.resource.element) {
	// 				Object.assign(span.element, this.resource.element);
	// 			}
	// 		},
	// 		update: async node => {
	// 			const texts = await this.getTexts(this.resource.value);
	// 			node.element.innerHTML = text;
	// 		}
	// 	}
	// }

	date(value, format) {
		return moment(value).format(format);
	}

}

KarmaFieldsAlpha.fields.text.singleReg = /\{\{[^}]+\}\}/g;
KarmaFieldsAlpha.fields.text.multiReg = /\{\{#([^}]+)\}\}(.*)\{\{\/([^}]+)\}\}/;
KarmaFieldsAlpha.fields.text.functionReg = /([^(]+)\(([^)]+)\)/;
KarmaFieldsAlpha.fields.text.splitReg = /\{\{([^.:]+)(?:\.([^:]+))?(?:\:?(.+))?\}\}/;
