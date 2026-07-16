

KarmaFieldsAlpha.field.value = class extends KarmaFieldsAlpha.field {

	getValue(key) {

		if (key === undefined) {

			key = this.resource.key;

			if (this.resource.driver && this.resource.id) {

				return this.parseArray(this.resource.id)?.map(id => KarmaFieldsAlpha.Store.getValue(this.resource.driver, id, key));

			}

		}

		return this.parent.getValue(key);

	}

	toArray() {

		let value = this.getValue();

		if (value === undefined) {

			return;

		}

		if (!Array.isArray(value)) {

			value = [value];

		}

		return value;

	}

	toString() {

		let value = this.getValue();

		if (value === undefined) {

			return;

		}

		if (Array.isArray(value)) {

			value = value[0] || "";

		}

		return value.toString();
	}

	// toNumber() {

	// 	let value = this.getValue();

	// 	if (value === undefined) {

	// 		return;

	// 	}

	// 	if (Array.isArray(value)) {

	// 		value = value[0] || 0;

	// 	}

	// 	return Number(value);
	// }

	// toBoolean() {

	// 	let value = this.getValue();

	// 	if (value === undefined) {

	// 		return;

	// 	}

	// 	if (Array.isArray(value)) {

	// 		value = value[0] || false;

	// 	}

	// 	if (typeof value !== "boolean") {

	// 		value = Boolean(value);

	// 	}

	// 	return value;
	// }

}

KarmaFieldsAlpha.field.var = class extends KarmaFieldsAlpha.field {

	getVar() {

		if (this.resource.key) {

			if (this.resource.driver && this.resource.id) {

				// const field = this.parseField(this.resource.id);

				// if (!field) return;

				// const array = field.toArray();

				// if (array === undefined) return;

				// return array.map(id => KarmaFieldsAlpha.Store.getValue(this.resource.driver, id, key));

				return this.parseField(this.resource.id)?.toArray()?.map(id => KarmaFieldsAlpha.Store.getValue(this.resource.driver, id, key));

			}

			return this.parent.getValue(this.resource.key);

		}

		if (this.resource.value) {

			if (!Array.isArray(this.resource.value)) {

				return [this.resource.value];

			}

			return this.resource.value;

		}

		return [];
	}

	toArray() {

		return this.getVar();

	}

}

KarmaFieldsAlpha.field.request = class extends KarmaFieldsAlpha.field {

	toArray() {

		let value = this.doAction(this.resource.request);

		if (value === undefined) {

			return;

		} else if (!value) {

			value = [];

		} else if (!Array.isArray(value)) {

			value = [value];

		}

		return value

	}

	toString() {

		let value = this.doAction(this.resource.request);

		if (value === undefined) {

			return;

		} else if (!value) {

			value = "";

		} else if (Array.isArray(value)) {

			value = value[0] || "";

		}

		return value.toString();

	}

}

KarmaFieldsAlpha.field.CSV = class extends KarmaFieldsAlpha.field {

	toString() {

		if (this.resource.array) {

			return Papa.unparse(this.resource.array, {
				delimiter: "\t",
				newline: "\n"
			});

		}

		return this.resource.string || "";
	}

	toArray() {

		if (this.resource.string) {

			return Papa.parse(this.resource.string, {
				delimiter: '\t'
			}).data;

		}

		return this.resource.array || [];

	}

}

KarmaFieldsAlpha.field.expression = class extends KarmaFieldsAlpha.field {

	process() {

		let operand;
		let pointer = 0;
		const children = this.resource.children || [];

		if (!children.length) {

			return "";

		}

		while (pointer < children.length) {

			if (children[pointer].model === "operator") {

				const operator = children[pointer].operator;

				switch (operator) {

					case "!": {
						if (pointer + 1 >= children.length) {
							console.error("Missing operand for operation: ", operator);
						}
						if (children[pointer + 1].model === "operator") {
							console.error("Consecutive operators: ", operator, children[pointer + 1].operator);
						}
						operand = this.createChild(children[pointer + 1]);
						const value = operand.toBoolean();
						if (value === undefined) {
							return;
						}
						operand = new KarmaFieldsAlpha.field.var({ value });
						pointer += 2;
					};
					case "+":
					case "-":
					case "*":
					case "/": {
						if (!operand) {
							console.error("Missing first operand for operation", operator);
						}
						if (pointer + 1 >= children.length) {
							console.error("Missing second operand for operation: ", operator);
						}
						if (children[pointer + 1].model === "operator") {
							console.error("Consecutive operators: ", operator, children[pointer + 1].operator);
						}
						const v1 = operand.toNumber();
						if (v1 === undefined) {
							return;
						}
						const v2 = this.createChild(children[pointer + 1])?.toNumber();
						if (v2 === undefined) {
							return;
						}
						let value;
						switch (operator) {
							case "+":
								value = v1 + v2;
								break;
							case "-":
								value = v1 - v2;
								break;
							case "*":
								value = v1 * v2;
								break;
							case "/":
								value = v1 / v2;
								break;
						}
						operand = new KarmaFieldsAlpha.field.var({ value });
						pointer += 2;
						break;
					}
					case "&&":
					case "||": {
						if (!operand) {
							console.error("Missing first operand for operation", operator);
						}
						if (pointer + 1 >= children.length) {
							console.error("Missing second operand for operation: ", operator);
						}
						if (children[pointer + 1].model === "operator") {
							console.error("Consecutive operators: ", operator, children[pointer + 1].operator);
						}
						const v1 = operand.toBoolean();
						if (v1 === undefined) {
							return;
						}
						if (v1 && operator === "&&" || !v1 && operator === "||") {
							operand = new KarmaFieldsAlpha.field.var(children[pointer + 1]);
						}
						pointer += 2;
					};
					case "=":
					case "!=":
					case ">":
					case "<":
					case ">=":
					case "<=": {
						if (!operand) {
							console.error("Missing first operand for operation", operator);
						}
						if (pointer + 1 >= children.length) {
							console.error("Missing second operand for operation: ", operator);
						}
						if (children[pointer + 1].model === "operator") {
							console.error("Consecutive operators: ", operator, children[pointer + 1].operator);
						}

						let v1, v2;

						if (children[pointer].numeric) {
							v1 = operand.toNumber();
							v2 = this.createChild(children[pointer + 1])?.toNumber();
						} else {
							v1 = operand.toString();
							v2 = this.createChild(children[pointer + 1])?.toString();
						}

						if (v1 === undefined || v2 === undefined) {
							return;
						}

						let value;
						switch (operator) {
							case "=":
								value = v1 === v2;
								break;
							case "!=":
								value = v1 !== v2;
								break;
							case ">":
								value = v1 > v2;
								break;
							case "<":
								value = v1 < v2;
								break;
							case ">=":
								value = v1 >= v2;
								break;
							case "<=":
								value = v1 <= v2;
								break;
						}
						operand = new KarmaFieldsAlpha.field.var({ value });
						pointer += 2;
						break;
					}

				}

			} else {

				const field = this.createChild(children[pointer]);

				if (field === undefined) {

					return;

				}

				if (operand) {

					const string1 = operand.toString();
					const string2 = field.toString();

					if (string1 === undefined || string2 === undefined) {

						operand = new KarmaFieldsAlpha.field.var({ value: string1+string2 });

					}

				} else {

					operand = field;

				}

			}

		}

		return operand;

	}

	toArray() {

		return this.process()?.toArray();

	}

	toString() {

		return this.process()?.toString();

	}

	toNumber() {

		return this.process()?.toNumber();

	}

	toBoolean() {

		return this.process()?.toBoolean();

	}

}

KarmaFieldsAlpha.field.operator = class extends KarmaFieldsAlpha.field {}



KarmaFieldsAlpha.field.replace = class extends KarmaFieldsAlpha.field.value {

	replace(text) {

		const wildcard = this.resource.wildcard || "%";
		const replacers = this.resource.replacers || [];

		for (let replacer of replacers) {

			replacer = this.parseString(replacer);

			if (replacer === undefined) {

				return;

			}

			text = text.replace(wildcard, replacer);

		}

		return text;

	}

	toString() {

		if (this.resource.text) {

			let text = this.parseString(this.resource.text);

			if (text === undefined) {

				return;

			}

			return this.replace(text);

		}

		return super.toString();

	}

	toArray() {

		if (this.resource.text) {

			let texts = this.parseArray(this.resource.text);

			if (texts === undefined) {

				return;

			}

			texts = texts.map(text => this.replace(text));

			if (texts.some(text => text === undefined)) {

				return;

			}

			return texts;

		}

		return super.toArray();

	}

}

// KarmaFieldsAlpha.field.map = class extends KarmaFieldsAlpha.field.value {

// 	toArray() {

// 		if (this.resource.value) {

// 			let values = this.parseArray(this.resource.values);

// 			if (values === undefined) {

// 				return;

// 			}

// 			values = values.map(text => this.parseString(text));

// 			if (values.some(text => text === undefined)) {

// 				return;

// 			}

// 			return values;

// 		}

// 		return super.toArray();

// 	}

// }

KarmaFieldsAlpha.field.params = class extends KarmaFieldsAlpha.field {

	parseParams() {

		if (this.resource.params) {

			const entries = Object.entries(this.resource.params).map(([key, value]) => [key, this.parseField(value)?.toString()]);

			if (entries.some(([key, value]) => value === undefined)) {

				return;

			}

			return entries.map(([key, value]) => `${key}=${value}`).join("&");

		}

		return "";

	}

	getParamstring() {

		let value = KarmaFieldsAlpha.Store.getTempo(this.uid, "paramstring");

		if (value === undefined) {

			value = this.parseParams();

			KarmaFieldsAlpha.Store.setTempo(value ?? null, this.uid, "paramstring");

		}

		if (value === null) {

			return;

		}

		return value;

	}

	toArray() {

		const paramstring = this.getParamstring();

		if (paramstring === undefined) return;

		return [paramstring];

	}

	toString() {

		return this.getParamstring();

	}

}

KarmaFieldsAlpha.field.query = class extends KarmaFieldsAlpha.field.params {

	getValueAt(key, index) {

		const driver = this.resource.driver;

		if (!driver) {

			console.error("Driver not found!");

		}

		const ids = this.getIds();

		if (ids === undefined) {

			return;

		}

		const id = ids[index];

		if (id === undefined) {

			console.error("Getting value at index but index is out of bound");

		}

		return KarmaFieldsAlpha.Store.getValue(driver, id, key);
	}

	getIds() {

		const driver = this.resource.driver;

		if (!driver) {

			console.error("Driver not found!");

		}

		const paramstring = this.getParamstring();

		if (paramstring === undefined) {

			return;

		}

		return KarmaFieldsAlpha.Store.getIds(driver, paramstring);

	}

	toArray() {

		return this.getIds();

	}

	createRowAt(index) {

		const resource = this.resource.row || {
			children: this.resource.children || [],
			values: this.resource.values
		}; // compat

		const row = new KarmaFieldsAlpha.field.query.row(resource, index, this);

		this.addField(row, index);

		return row;

		// row.uid =
		// row.index = index;
		// row.parent = this;

		// return row;

	}

}



KarmaFieldsAlpha.field.query.row = class extends KarmaFieldsAlpha.field {

	getValue(key) {

		if (this.resource.values && this.resource.values[key]) {

			return this.parseArray(this.resource.values[key]);

		}

		return this.parent.getValueAt(key, this.index);

	}

	// toString() {

	// 	if (this.resource.value) {

	// 		return this.parseString(this.resource.value);

	// 	}

	// 	return super.toString();

	// }

	// toNumber() {

	// 	if (this.resource.value) {

	// 		return this.parseNumber(this.resource.value);

	// 	}

	// 	return super.toNumber();

	// }

}


KarmaFieldsAlpha.field.protoGrid = class extends KarmaFieldsAlpha.field.query {

	toArray() {

		return this.getGrid();

	}

	getGrid() {

		const driver = this.resource.driver;

		if (!driver) {

			console.error("Driver not found!");

		}

		const paramstring = this.getParamstring();

		if (paramstring === undefined) {

			return;

		}

		const ids = KarmaFieldsAlpha.Store.getIds(driver, paramstring);

		if (ids === undefined) {

			return;

		}

		const keys = this.resource.keys || ['name'];

		const grid = [];

		for (let i = 0; i < ids.length; i++) {

			const object = {};
			object.id = ids[i];

			for (let key of keys) {

				object[key] = KarmaFieldsAlpha.Store.getValue(driver, ids[i], key, paramstring)?.shift();

			}

			grid.push(object);

		}

		// -> check if everything is loaded
		if (grid.some(object => Object.values(object).some(value => value === undefined))) {

			return;

		}

		return grid;

	}

}

KarmaFieldsAlpha.field.column = class extends KarmaFieldsAlpha.field.query {

	toArray() {

		return this.getColumn();

	}

	getColumn() {

		const driver = this.resource.driver;

		if (!driver) {

			console.error("Driver not found!");

		}

		const paramstring = super.toString();

		if (paramstring === undefined) {

			return;

		}

		const ids = KarmaFieldsAlpha.Store.getIds(driver, paramstring);

		if (ids === undefined) {

			return;

		}

		const key = this.resource.key || "name";

		const column = [];

		for (let i = 0; i < ids.length; i++) {

			const value = KarmaFieldsAlpha.Store.getValue(driver, ids[i], key, paramstring)?.shift();

			column.push(value);

		}

		// -> check if everything is loaded
		if (column.some(value => value === undefined)) {

			return;

		}

		return col;

	}

}

KarmaFieldsAlpha.field.sum = class extends KarmaFieldsAlpha.field.query {

	sum() {

		const ids = this.getIds();

		if (ids === undefined) {

			return;

		}

		const key = this.resource.key || "";

		const col = ids.map((id, index) => this.createRowAt(index).getSingleValue(key));

		if (col.some(value => value === undefined)) {

			return;

		}

		return col.reduce((acc, item) => acc + Number(item), 0);

	}

	toNumber() {

		return this.sum();

	}

	toString() {

		return this.sum()?.toString();

	}

	toArray() {

		// return KarmaFieldsAlpha.field.prototype.toArray.call(this);

		const value = this.sum();

		if (value === undefined) return;

		return [value || 0];

	}

}





// KarmaFieldsAlpha.field.sum = class extends KarmaFieldsAlpha.field.query {

// 	toNumber() {

// 		const key = this.resource.key || "";
// 		const grid = this.toArray();
// 		let sum = 0;

// 		for (let row of grid) {

// 			sum += Number(row[key]);

// 		}

// 		return sum;

// 	}

// 	toString() {

// 		return this.toNumber().toString();

// 	}

// }

KarmaFieldsAlpha.field.calc = class extends KarmaFieldsAlpha.field {

	calc() {

		let value = this.resource.value || "";

		value = value.replace(/{(.*?)}/g, (match, match1) => this.getSingleValue(match1));

		if (value.match("undefined")) {

			return;

		}

		// abs|acos|acosh|asin|asinh|atan|atan2|atanh|cbrt|ceil|clz32|cos|cosh|exp|expm1|f16round|floor|fround|hypot|imul|log|log1p|log2|log10|max|min|pow|random|round|sign|sin|sinh|sqrt|sumPrecise|tan|tanh|trunc

		value = value.replace(/(abs|ceil|cos|exp|floor|log|max|min|pow|random|round|sin|sqrt|tan)\((.*?)\)/g, (match, m1, m2) => {
			const args = m2 && m2.split(",").map(arg => Number(arg)) || [];
			return Math[m1](...args);
		});

		// E|LN2|LN10|LOG2E|LOG10E|PI|SQRT1_2|SQRT2

		value = value.replace(/(E|LN2|LN10|PI|SQRT2)/g, (match, m1) => Math[m1]);

		if (!/^[0-9+\-*/().\s]+$/.test(value)) {

			return `Parsing error: ${value}`;

		}

		return Function(`"use strict"; return (${value})`)();
	}

	toArray() {

		const value = this.calc();

		if (value === undefined) return;

		return [value.toFixed(this.resource.digits || 2)];

	}

	toNumber() {

		return this.calc();

	}

	toString() {

		const value = this.calc();

		if (value === undefined) return;

		return value.toFixed(this.resource.digits || 2);

	}


}

KarmaFieldsAlpha.field.logic = class extends KarmaFieldsAlpha.field {

	// process() {

	// 	let value;

	// 	if (this.resource.value) {

	// 		value = this.parseField(this.resource.value);

	// 	}

	// 	if (this.resource.key) {

	// 		value = this.getSingleValue(this.resource.key);

	// 	}

	// 	if (this.resource.or) {

	// 		return value?.toSingle() || this.parseField(this.resource.or)?.toSingle();

	// 	}

	// 	if (this.resource.and) {

	// 		return value?.toSingle() && this.parseField(this.resource.and)?.toSingle();

	// 	}

	// 	if (this.resource.if) {

	// 		const condition = this.parseField(this.resource.if)?.toBoolean();

	// 		if (condition === undefined) return;

	// 		if (condition && this.resource.then) {

	// 			return this.parseField(this.resource.then)?.toArray();

	// 		}

	// 		if (this.resource.else) {

	// 			return this.parseField(this.resource.else)?.toArray();

	// 		}

	// 		return value;

	// 	}

	// }

	// process() {

	// 	const value = this.resource.value || "";

	// 	let matches = value.match(/(!)?\s*{(.+?)}\s*(&&|\|\|)?\s*(?:{(.+?)})?/);

	// 	if (matches[1] === "!" && matches[2]) {

	// 		const value = this.createChild(matches[2])?.toBoolean();

	// 		if (value === undefined) return;

	// 		return !value;

	// 	}

	// 	if (matches[3] === "||" && matches[2] && matches[4]) {

	// 		const value1 = this.createChild(matches[2])?.toSingle();
	// 		const value2 = this.createChild(matches[4])?.toSingle();

	// 		if (value1 === undefined || value2 === undefined) return;

	// 		return value1 || value2;

	// 	}

	// 	if (matches[3] === "&&" && matches[2] && matches[4]) {

	// 		const value1 = this.createChild(matches[2])?.toSingle();
	// 		const value2 = this.createChild(matches[4])?.toSingle();

	// 		if (value1 === undefined || value2 === undefined) return;

	// 		return value1 && value2;

	// 	}

	// 	return value;

	// }

	process() {

		const value = this.resource.value || "";

		const not = value.match(/^!\s*({(.+?)}|.+?)\s*$/);

		if (not) {

			if (not[1] === "true") {

				return false;

			} else if (not[1] === "false") {

				return true;

			} else if (not[3]) {

				return this.createChild({
					type: "var",
					key: matches[3]
				})?.toSingle();

			} else {

				return false;

			}

		}

		// const andor = value.match(/^\s*({(.+?)}|.+?)\s*(&&|\|\|)\s*({(.+?)}|.+?)\s*$/);
		const andor = value.match(/^\s*({([^\s]+)}|[^\s]+)\s*(&&|\|\|)\s*({([^\s]+)}|[^\s]+)\s*$/);

		if (andor) {

			let value1;
			let value2;

			if (andor[1] === "true") {

				value1 = true;

			} else if (andor[1] === "false") {

				value1 = false;

			} else if (andor[2]) {

				value1 = this.createChild({
					model: "var",
					key: andor[2]
				}).toSingle();

				if (value1 === undefined) return;

			} else {

				value1 = andor[1];

			}

			if (andor[4] === "true") {

				value2 = true;

			} else if (andor[4] === "false") {

				value2 = false;

			} else if (andor[5]) {

				value2 = this.createChild({
					model: "var",
					key: andor[5]
				}).toSingle();

				if (value2 === undefined) return;

			} else {

				value2 = andor[4];

			}

			if (andor[3] === "||") {

				return value1 || value2;

			} else if (andor[3] === "&&") {

				return value1 && value2;

			}

		}

		return value;
	}

	toArray() {

		const value = this.process();

		if (value === undefined) return;

		return [value];

	}

	toString() {

		const value = this.process();

		if (value === undefined) return;

		return value.toString();

	}

	toBoolean() {

		const value = this.process();

		if (value === undefined) return;

		return Boolean(value);

	}


}

// KarmaFieldsAlpha.field.condition = class extends KarmaFieldsAlpha.field {


// KarmaFieldsAlpha.field.text = class extends KarmaFieldsAlpha.field.value {

// 	export() {

// 		if (this.resource.export) {

// 			const text = this.toString();

// 			if (text === undefined) {

// 				return;

// 			} else {

// 				return [text];

// 			}

// 		}

// 		return [];

// 	}

// 	import(array) {

// 		if (this.resource.export) {

// 			array.shift();

// 		}

// 	}

// 	toString() {

// 		if (this.resource.text) {

// 			return this.parseString(this.resource.text);

// 		}

// 		return super.toString(); // -> use text key to determine value

// 	}

// 	toArray() {

// 		if (this.resource.text) {

// 			return this.parseArray(this.resource.text);

// 		}

// 		return super.toArray(); // -> use text key to determine values

// 	}

// 	*build() {

// 		yield {
// 			class: "text karma-field",
// 			init: element => {
// 				if (this.resource.classes) {
// 					element.classList.add(...this.resource.classes);
// 				}
// 				if (this.resource.width) {
// 					element.style.width = this.resource.width;
// 				}
// 			},
// 			update: element => {
// 				if (this.resource.disabled) {
// 					element.classList.toggle("disabled", this.parseBoolean(this.resource.disabled || false));
// 				}
// 				if (this.resource.enabled) {
// 					element.classList.toggle("disabled", !this.parseBoolean(this.resource.enabled || false));
// 				}
// 				element.innerHTML = this.toString();
// 			}
// 		};
// 	}

// }

// KarmaFieldsAlpha.field.list = class extends KarmaFieldsAlpha.field.text {

// 	toString() { // -> we need to export an array of one string with comma separated values

// 		const texts = this.toArray();

// 		if (texts !== undefined) {

// 			return texts.join(", ");

// 		}

// 	}

// 	*buildList(texts) {

// 		for (let text of texts) {

// 			yield {
// 				tag: "li",
// 				update: element => {
// 					element.innerHTML = text;
// 				}
// 			};

// 		}

// 	}

// 	*build() {

// 		const texts = this.toArray();

// 		yield {
// 			tag: "ul",
// 			class: "list karma-field",
// 			init: element => {
// 				if (this.resource.classes) {
// 					element.classList.add(...this.resource.classes);
// 				}
// 				if (this.resource.width) {
// 					element.style.width = this.resource.width;
// 				}
// 			},
// 			update: element => {
// 				if (this.resource.disabled) {
// 					element.classList.toggle("disabled", this.parseBoolean(this.resource.disabled));
// 				}
// 				if (this.resource.enabled) {
// 					element.classList.toggle("disabled", !this.parseBoolean(this.resource.enabled));
// 				}
// 			},
// 			children: texts && this.buildList(texts) // if texts are not ready -> do not erase current value
// 		};
// 	}

// }


// KarmaFieldsAlpha.field.date = class extends KarmaFieldsAlpha.field.text {

// 	parse(text) {

// 		const date = new Date(text);

// 		if (date > 0) {

// 			return date.toLocaleDateString(this.resource.locale || KarmaFieldsAlpha.locale, this.resource.options);

// 		}

// 		return "";

// 	}

// 	toString() {

// 		const text = super.toString();

// 		if (text !== undefined) {

// 			return this.parse(text);

// 		}

// 	}

// 	toArray() {

// 		const texts = super.toArray();

// 		if (texts !== undefined) {

// 			return texts.map(text => this.parse(text));

// 		}

// 	}

// }

// KarmaFieldsAlpha.field.link = class extends KarmaFieldsAlpha.field.text {

// 	*build() {

// 		yield {
// 			class: "link karma-field",
// 			init: element => {
// 				if (this.resource.classes) {
// 					element.classList.add(...this.resource.classes);
// 				}
// 				if (this.resource.width) {
// 					element.style.width = this.resource.width;
// 				}
// 			},
// 			update: element => {
// 				if (this.resource.disabled) {
// 					element.classList.toggle("disabled", this.parseBoolean(this.resource.disabled));
// 				}
// 				if (this.resource.enabled) {
// 					element.classList.toggle("disabled", !this.parseBoolean(this.resource.enabled));
// 				}
// 				element.innerHTML = this.toString() || "";
// 				if (this.resource.href) {
// 					element.href = this.parseString(this.resource.href) || "";
// 				}
// 				if (this.resource.value !== undefined && this.resource.key !== undefined) {
// 					const value = this.parseString(this.resource.value);
// 					element.onclick = event => {
// 						if (value !== undefined) {
// 							this.save();
// 							this.parent.setParam(value, this.resource.key);
// 							this.render();
// 						}
// 					}
// 				}
// 			}
// 		};
// 	}

// }

// KarmaFieldsAlpha.field.linkList = class extends KarmaFieldsAlpha.field.list {

// 	*buildList(texts) {

// 		let hrefs;
// 		let values;

// 		if (this.resource.href) {

// 			hrefs = this.parseArray(this.resource.href);

// 			if (hrefs === undefined) {

// 				return;

// 			}

// 		}

// 		if (this.resource.value) {

// 			values = this.parseArray(this.resource.value);

// 			if (values === undefined) {

// 				return;

// 			}

// 		}


// 		for (let text of texts) {

// 			yield {
// 				tag: "li",
// 				update: element => {
// 					element.innerHTML = text;

// 					const value = this.parseString(this.resource.value);
// 					element.onclick = event => {
// 						if (value !== undefined) {
// 							this.save();
// 							this.parent.setParam(value, this.resource.key);
// 							this.render();
// 						}
// 					}
// 				}
// 			};

// 		}

// 	}

// }

// KarmaFieldsAlpha.field.paramLink = class extends KarmaFieldsAlpha.field.text {

// 	*build() {

// 		yield {
// 			class: "link karma-field",
// 			init: element => {
// 				if (this.resource.classes) {
// 					element.classList.add(...this.resource.classes);
// 				}
// 				if (this.resource.width) {
// 					element.style.width = this.resource.width;
// 				}
// 			},
// 			update: element => {
// 				if (this.resource.disabled) {
// 					element.classList.toggle("disabled", this.parseBoolean(this.resource.disabled));
// 				}
// 				if (this.resource.enabled) {
// 					element.classList.toggle("disabled", !this.parseBoolean(this.resource.enabled));
// 				}
// 				element.innerHTML = this.toString() || "";

// 				element.onclick = event => {
// 					if (this.resource.value === undefined) {
// 						console.error("paramLink is clicked but resource.value is undefined");
// 					}
// 					if (this.resource.key === undefined) {
// 						console.error("paramLink is clicked but resource.key is undefined");
// 					}
// 					const value = this.parseString(this.resource.value);
// 					if (value !== undefined) {
// 						this.save();
// 						this.parent.setParam(value, this.resource.key);
// 						this.render();
// 					}
// 				}
// 			}
// 		};
// 	}

// }
