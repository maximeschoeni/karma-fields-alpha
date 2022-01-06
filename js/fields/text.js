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


	// async parseSingle(text, params = {}) {
	// 	console.error("deprecated");
	// 	const mustaches = text.match(this.constructor.singleReg);
	//
	// 	if (mustaches && mustaches.length) {
	//
	// 		for (var i in mustaches) {
	//
	// 			let key, subkey, domain, value;
	//
	// 			// const match = mustaches[i].slice(2, -2);
	//
	// 			[,key, subkey, domain] = mustaches[i].match(this.constructor.splitReg);
	//
	// 			// [key, domain] = match.split(":");
	// 			// [key, subkey] = key.split(".");
	//
	// 			if (params && params[key] !== undefined) {
	//
	// 				value = params[key];
	//
	// 			} else {
	//
	// 				value = await this.parent.fetchValue(null, key);
	//
	// 				// compat
	// 				if (!Array.isArray(value)) {
	// 					value = [value];
	// 				}
	//
	// 				value = value[0] || "";
	//
	// 			}
	//
	// 			if (subkey && value[subkey] !== undefined) {
	//
	// 				value = value[subkey];
	//
	// 			}
	//
	//
	//
	// 			if (domain) {
	//
	// 				let functionMatch = domain.match(this.constructor.functionReg);
	//
	//
	// 				if (functionMatch && this[functionMatch[1]]) {
	//
	//
	//
	// 					value = this[functionMatch[1]](value, ...functionMatch[2].split(",").map(arg => arg.trim()));
	//
	// 				} else {
	//
	// 					const options = await this.fetchOptions(domain);
	// 					const option = options.find(option => option.key === value);
	// 					value = option && option.name || "";
	//
	// 				}
	//
	// 			}
	//
	// 			text = text.replace(mustaches[i], value);
	//
	// 		}
	//
	// 	}
	//
	// 	return text;
	// }

	async parseValue(text, key, value) {

		let match = text.match(this.constructor.valueReg);

		while (match) {

			let matchValue = value;

			if (match[1] !== key) {

				let array = await this.parent.fetchValue(null, match[1]);
				matchValue = array.toString();

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
				let array = await this.parent.fetchValue(null, match[1]);
				date = array.toString();
			}

			date = moment(date).format(match[2] || "DD/MM/YYYY");

			// let array = await this.parent.fetchValue(null, match[1]);
			// let value = moment(array.toString()).format(match[2] || "DD/MM/YYYY");

			text = text.replace(match[0], date);

			match = text.match(this.constructor.dateReg);

		}

		return text;
	}

	async parseLoop(text) {

		const match = text.match(this.constructor.loopReg);

		if (match) {

			let array = await this.parent.fetchValue(null, match[1]);
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

	// async parse(text) {
	//
	//
	// 	// compat
	// 	if (text.includes("*")) {
	// 		text = text.replace(/^(.*)\*([^%]+)\*(.*)$/, "{{#$2}}$1{{$2}}$3{{/$2}}");
	// 	}
	// 	if (text.includes("%")) {
	// 		text = text.replace(/%([^%]+)%/g, "{{$1}}");
	// 	}
	//
	// 	text = await this.parseConditional(text);
	//
	//
	// 	const iteration = text.match(this.constructor.multiReg);
	//
	// 	if (iteration && iteration[1] && iteration[1] === iteration[3]) {
	//
	// 		let content = "";
	// 		let array = await this.parent.fetchValue(null, iteration[1]);
	//
	// 		if (array && array.length) {
	//
	// 			for (var i in array) {
	//
	// 				content += await this.parseSingle(iteration[2], {[iteration[1]]: array[i]});
	//
	// 			}
	//
	// 		}
	//
	// 		return text.replace(iteration[0], content);
	//
	// 	} else {
	//
	// 		return this.parseSingle(text);
	//
	// 	}
	//
	// }



	// preParse_OLD(text) {
	//
	// 	const iteration = text.match(this.constructor.multiReg);
	//
	// 	if (iteration) {
	//
	// 		text = text.replace(iteration[0], "...");
	//
	// 	} else {
	//
	// 		const mustaches = text.match(this.constructor.singleReg);
	//
	// 		if (mustaches && mustaches.length) {
	//
	// 			for (var i in mustaches) {
	//
	// 				text = text.replace(mustaches[i], "...");
	//
	// 			}
	//
	// 		}
	//
	// 	}
	//
	// 	return text;
	// }



	async parseConditional(text) {

		const matchIf = text.match(this.constructor.ifReg);

		if (matchIf) {

			let ifText = matchIf[2];

			let value = await this.fetchValue(null, matchIf[1]);
			let ok = value.toString();
			let okText = "";

			let matchElseif = ifText.match(this.constructor.elseifReg);

			while (matchElseif) {

				if (!ok) {
					value = await this.fetchValue(null, matchElseif[2]);
					ok = value.toString();
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
		}

		return text;
	}


	async parse(text) {

		text = await this.parseConditional(text);
		text = await this.parseLoop(text);
		text = await this.parseDate(text);
		text = await this.parseValue(text);

		return text;
	}

	preParse(text) {

		text = text.replace(this.constructor.loopReg, "...");
		text = text.replace(this.constructor.ifReg, "...");
		text = text.replace(this.constructor.allSingleReg, "...");

		return text;
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
				// node.element.classList.add("loading");

				node.element.innerHTML = this.preParse(this.resource.value);

				node.element.innerHTML = await this.parse(this.resource.value);
				// node.element.classList.remove("loading");

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

	// date(value, format) {
	// 	return moment(value).format(format);
	// }

}

// KarmaFieldsAlpha.fields.text.singleReg = /\{\{[^}]+\}\}/g;
// KarmaFieldsAlpha.fields.text.multiReg = /\{\{#([^}]+)\}\}(.*)\{\{\/([^}]+)\}\}/;
// KarmaFieldsAlpha.fields.text.functionReg = /([^(]+)\(([^)]+)\)/;
// KarmaFieldsAlpha.fields.text.splitReg = /\{\{([^.:]+)(?:\.([^:]+))?(?:\:?(.+))?\}\}/;

KarmaFieldsAlpha.fields.text.valueReg = /\{\{(?:value::)?(.*?)(?:::(.*))?\}\}/;
KarmaFieldsAlpha.fields.text.dateReg = /\{\{date::(.*?)::(.*)\}\}/;

KarmaFieldsAlpha.fields.text.loopReg = /\{\{for::(.*?)\}\}(.*)\{\{end\}\}/;

KarmaFieldsAlpha.fields.text.ifReg = /\{\{if::(.+?)\}\}(.*)\{\{end\}\}/;
KarmaFieldsAlpha.fields.text.elseifReg = /(.*?)\{\{elseif::(.+?)\}\}/;
KarmaFieldsAlpha.fields.text.elseReg = /(.*?)\{\{else\}\}/;


// KarmaFieldsAlpha.fields.text.attachmentReg = /\{\{wpattachment::(.*?)(?:::(.*?))?(?:::(.*?))?\}\}/;

KarmaFieldsAlpha.fields.text.allSingleReg = /\{\{(.*?)\}\}/g;
