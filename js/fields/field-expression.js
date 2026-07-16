
// KarmaFieldsAlpha.loading = Symbol("loading");
// KarmaFieldsAlpha.mixed = Symbol("mixed");

KarmaFieldsAlpha.field.expression = class {


	static calc(sign, v1, v2) {

		switch (sign) {
			case "=":
			case "==":
				return v1 == v2;
			case "===":
				return v1 === v2;
			case "!=":
				return v1 != v2;
			case "!==":
				return v1 !== v2;
			case ">":
				return v1 > v2;
			case "<":
				return v1 < v2;
			case ">=":
				return v1 >= v2;
			case "<=":
				return v1 <= v2;
			case "like":
				return v1.match(new RegExp(v2));
			case "+":
				return v1 + v2;
			case "-":
				return v1 - v2;
			case "*":
				return v1 * v2;
			case "/":
				return v1 / v2;
			case "%":
				return v1 % v2;
			case "&&":
				return v1 && v2;
			case "||":
				return v1 || v2;
		}

	}

	parseOperator(sign, value1, value2) {

		switch (sign) {

			case "=":
			case "==":
			case "===":
			case "!=":
			case "!==":
			case ">":
			case "<":
			case ">=":
			case "<=":
			case "&&":
			case "||":
				value1 = this.parseSingle(value1);
				value2 = this.parseSingle(value2);
				break;

			case "+":
			case "-":
			case "*":
			case "/":
			case "%":
				value1 = this.parseNumber(value1);
				value2 = this.parseNumber(value2);
				break;

			case "like":
				value1 = this.parseString(value1);
				value2 = this.parseString(value2);


			// case "!":
			// case "?":

		}

		if (value1 !== undefined || value2 !== undefined) {

			return this.calc(sign, value1, value2);

		}



	}

	isOperator(sign) {

		switch (sign) {

			case "=":
			case "==":
			case "===":
			case "!=":
			case "!==":
			case ">":
			case "<":
			case ">=":
			case "<=":
			case "&&":
			case "||":
			case "+":
			case "-":
			case "*":
			case "/":
			case "%":
			case "like":
				return true;
		}

		return false;

	}


	parse(expression, context = this) {

		if (expression && Array.isArray(expression)) {

			// let fn;
			// [fn, ...expression] = expression;

			switch (expression[0]) {

				// case "=":
				// case "==":
				// case "===":
				// case "!=":
				// case "!==":
				// case ">":
				// case "<":
				// case ">=":
				// case "<=":
				// case "like":
				// case "+":
				// case "-":
				// case "*":
				// case "/":
				// case "%":
				// case "&&":
				// case "||": {
				// 	let param1, param2;

				// 	if (params.length === 1) {
				// 		param1 = params[0];
				// 		[param2, ...expression] = expression;
				// 	} else if (params.length === 0) { // -> compat
				// 		[param1, param2, ...expression] = expression;
				// 	}

				// 	if (params.length > 1 || param1 === undefined || param2 === undefined) {
				// 		console.error("Error parsing: arguments length missmatches", fn);
				// 	}

				// 	param1 = this.parseSingle(param1);
				// 	param2 = this.parseSingle(param2);

				// 	if (param1 === undefined || param2 === undefined) {
				// 		return;
				// 	}

				// 	const result = this.calc(fn, param1, param2);

				// 	return this.parse(expression, result);

				// }
				case "logic":
				case "calc": {

					let [fn, value1, sign, value2, ...expression] = expression;

					if (!this.isOperator(sign)) {
						console.error("Operator not supported", sign);
					}

					if (value1 === undefined || value2 === undefined) {
						console.error("Invalid operation", value1, sign, value2);
					}

					const result = this.parseOperator(sign, value1, value2);

					if (result === undefined) {
						return;
					}

					if (expression.length) {

						return this.parse(["calc", result, ...expression]);

					} else {

						return result;

					}

				}
				case "Field": {
					let [className, methodName, ...params] = expression;

					if (!this[methodName]) {

						console.error(`Parsing error: method ${methodName} does not exist on ${className}`);

					}

					return this[methodName](...params);

				}
				case "Number":
				case "String":
				case "Array":
				case "Date": {
					let [className, value1, methodName, ...params] = expression;

					if (className === "Number") {
						value1 = this.parseNumber(value1, className);
					} else if (className === "String") {
						value1 = this.parseString(value1, className);
					} else if (className === "Array") {
						value1 = this.parseArray(value1, className);
					}

					value1 = this.parse(value1, className);

					if (value1 === undefined) {
						return;
					}

					if (!window[domain] || !window[domain].prototype[methodName]) {

						console.error(`Parsing error: method ${methodName} does not exist on ${domain}`);

					}

					return window[domain].prototype[methodName].call(value1, ...params);

				}
				case "Math": {
					let [className, methodName, ...params] = expression;

					params = params.map(param => this.parse(param));

					if (params.some(param => param === undefined)) {
						return;
					}

					if (!window[domain] || !window[domain][methodName]) {

						console.error(`Parsing error: method ${methodName} does not exist on ${domain}`);

					}

					return window[domain][methodName](...params);

				}
				case "Store": {
					let [className, methodName, driver, params, map, aggregate] = expression;

					driver = this.parseString(driver);
					params = this.parseObject(params || {});

					if (driver === undefined || params === undefined) {
						return;
					}

					const paramstring = KarmaFieldsAlpha.Params.stringify(params);
					const query = KarmaFieldsAlpha.Store.getQuery(driver, paramstring);

					if (query === undefined) {
						return;
					}



					// let result = [];

					// if (key) {

					// // 	for (let i = 0; i < query.ids.length; i++) {

					// // 		const row =
					// // 		for (let key of keys) {

					// // 			const value = this.getValue(driver, query.ids[i], key, paramstring);

					// // 			if (!value) {

					// // 				return;

					// // 			}

					// // 			result.push({ id: query.ids[i], [key]: value[0] });

					// // 		}

					// // 	}

					// }


				 // else {
					// 	const paramstring = KarmaFieldsAlpha.Params.stringify(params);
					// 	const query = KarmaFieldsAlpha.server.getQuery(driver, paramstring);
					// 	if (query === undefined) {
					// 		return;
					// 	}
					// 	if (expression[3] === "count") {
					// 		return query.count || 0;
					// 	} else if (expression[3] === "options") {
					// 		return KarmaFieldsAlpha.server.getOptionsList(driver, paramstring);
					// 	} else {
					// 		return query.ids || [];
					// 	}
					// }
				}

				case "!": {
					const value = this.parseBoolean(expression[1]);
					if (value === undefined) {
						return;
					}
					return !value;
				}
				case "?": {
					const condition = this.parseBoolean(expression[1]);
					if (condition === undefined) {
						return;
					}
					return condition ? this.parse(expression[2]) : this.parse(expression[3]);
				}

				case "replace": {
					let string = this.parseString(expression[1]);
					const wildcard = expression[2];
					let replacements = expression.slice(3).map(replacement => this.parseString(replacement));
					if (string === undefined) {
						return;
					}
					for (let replacement of replacements) {
						string = string.replace(wildcard, replacement || "");
					}
					return string;
				}
				case "date": {
					let [fn, date, options, locale] = expression;
					this.parse("Date", date, "toLocalDateString", KarmaFieldsAlpha.locale || locale || "en", options);

					// const date = this.parseString(expression[1]);
					// const option = expression[2] || {}; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
					// const locale = expression[3] || KarmaFieldsAlpha.locale || "en";
					// if (date === undefined) {
					// 	return;
					// }
					// if (date === "now") {
					// 	return (new Date()).toLocaleString(locale, option);
					// } else if (!date) {
					// 	return "";
					// } else {
					// 	const dateObj = new Date(date);
					// 	if (isNaN(dateObj)) {
					// 		return "";
					// 	} else {
					// 		return dateObj.toLocaleString(locale, option);
					// 	}
					// }
				}

				case "queryValue": {
					return this.parse(["get", expression[3], expression[2], expression[1]]); // compat
					// const driver = this.parse(expression[1]);
					// const id = this.parse(expression[2]);
					// const key = this.parse(expression[3]);

					// if (driver.loading || id.loading || key.loading) {
					// 	response.loading = true;
					// } else if (driver.toString() && id.toString() && key.toString()) {
					// 	// const form = new KarmaFieldsAlpha.field.form({
					// 	//   driver: driver.toString()
					// 	// });
					// 	// response = form.getValueById(id.toString(), key.toString());
					// 	// const server = new KarmaFieldsAlpha.Server(driver.toString());
					// 	// response = server.getValue(id.toString(), key.toString());
					// 	response = this.getWild(driver.toString(), id.toString(), key.toString());
					// }
					// break;
				}
				case "sum": {
					const key = this.parseString(expression[1]);
					if (key === undefined) {
						return;
					}
					const driver = this.request("getDriver") || "";
					const paramstring = this.request("getParamstring") || "";
					let sum = 0;
					if (driver) {
						const query = KarmaFieldsAlpha.server.getQuery(driver, paramstring);
						if (query === undefined) {
							return;
						}
						for (let id of query.ids) {
							const values = KarmaFieldsAlpha.server.getValue(driver, id, key);
							if (values === undefined) {
								return;
							}
							sum += parseInt(values[0] || 0);
						}
					}
					return sum;
				}
				case "query": {
					const driver = this.parseString(expression[1]);
					const params = this.parseObject(expression[2] || {});
					if (driver === undefined || params === undefined) {
						return;
					} else {
						const paramstring = KarmaFieldsAlpha.Params.stringify(params);
						const query = KarmaFieldsAlpha.server.getQuery(driver, paramstring);
						if (query === undefined) {
							return;
						}
						if (expression[3] === "count") {
							return query.count || 0;
						} else if (expression[3] === "options") {
							return KarmaFieldsAlpha.server.getOptionsList(driver, paramstring);
						} else {
							return query.ids || [];
						}
					}
				}
				case "queryCount": {
					return this.parse(["query", expression[1], expression[2], "count"]);
				}
				case "parseParams":
					console.error("DEPRECATED");
					return;
				case "getGrid":
				case "getOptions": {
					return this.parse(["query", expression[1], expression[2], "options"]);
					// const driver = this.parse(expression[1]);
					// const params = this.parseObject(expression[2]);
					// const keys = expression[3];
					// if (driver.loading || params.loading) {
					// 	response.loading = true;
					// } else {
					// 	const paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());
					// 	response = this.getOptionsList(driver.toString(), paramstring);
					// }
					// break;
				}
				case "map": {
					const array = this.parseArray(expression[1]);
					if (array === undefined) {
						return;
					}
					const map = array.map(value => this.parse([expression[2] || "string", value]));
					if (map.some(item => item === undefined)) {
						return;
					}
					return map;
				}
				case "join": {
					const array = this.parseArray(expression[1]);
					const glue = expression[2] || ", ";
					if (array === undefined) {
						return;
					}
					return array.join(glue);
				}
				case "indexOf":
					console.error("deprecated");
					break;
				case "sum": { // -> doublon !!!!
					const array = this.parseArray(expression[1]);
					if (array === undefined) {
						return;
					}
					return array.reduce((accumulator, item) => accumulator + Number(item), 0);
				}
				case "getLength":
				case "count":
				case "length": {
					const array = this.parseArray(expression[1]);
					if (array === undefined) {
						return;
					}
					return array.length || 0;
				}
				case "substring": {
					const string = this.parseString(expression[1]);
					const offset = expression[2] && this.parseNumber(expression[2]) || 0;
					const length = expression[3] && this.parseNumber(expression[3]) || 9999999;
					if (array === undefined || offset === undefined || length === undefined) {
						return;
					}
					return string.slice(offset, offset + length);
				}
				case "getParam": {
					var key = this.parseString(expression[1]);
					if (key === undefined) {
						return;
					}
					return this.getParam(key);
				}
				case "hasSelection": {
					return this.hasSelection();
				}
				case "isLoading": {
					return this.parse(expression[1]) === undefined;
				}
				case "isMixed": {
					// return this.parse(expression[1]).mixed === true;
					return this.isMixed(expression[1]);
				}
				case "getKey":
				case "getIndex":// deprec
				case "getIds":
				case "getAt":
				case "array":
					console.error("deprecated", expression);
					return;

				case "debug":
				case "dump":
				case "log":
					debugger;
					return this.parse(expression[1]);
				case "max": {
					const array = this.parseArray(expression[1]);
					if (array === undefined) {
						return;
					}
					return array.reduce((accumulator, item) => Math.max(accumulator, Number(item)), 0);
				}
				case "min": {
					const array = this.parseArray(expression[1]);
					if (array === undefined) {
						return;
					}
					return array.reduce((accumulator, item) => Math.min(accumulator, Number(item)), Infinity);
				}
				case "resource": {
					var key = this.parseString(expression[1]);
					if (key === undefined) {
						return;
					}
					return this.resource[key];
				}
				case "parent":
					return this.parent.parse(expression[1]);
				case "upload-directory":
					return KarmaFieldsAlpha.uploadURL;
				case "admin-url":
					return KarmaFieldsAlpha.adminURL;
				case "rest-url":
					return KarmaFieldsAlpha.restURL;
				case "string":{
					// let value = this.parse(expression[1]);
					// if (value === undefined) {
					// 	return;
					// }
					// if (Array.isArray(value)) {
					// 	value = value[0];
					// }
					// return value.toString();
					return this.parseString(expression[1]);
				}
				case "number": {
					// let value = this.parse(expression[1]);
					// if (value === undefined) {
					// 	return;
					// }
					// if (Array.isArray(value)) {
					// 	value = value[0];
					// }
					// return Number(value);
					return this.parseNumber(expression[1]);
				}
				case "array": {
					// let value = this.parse(expression[1]);
					// if (value === undefined) {
					// 	return;
					// }
					// if (!Array.isArray(value)) {
					// 	value = [value];
					// }
					// return value;
					return this.parseArray(expression[1]);
				}
				case "object": {
					// const response = {};
					// for (let key in expression[1]) {
					// 	const value = this.parse(object[key]);
					// 	if (value === undefined) {
					// 		return;
					// 	} else if (Array.isArray(value)) {
					// 		value = value[0];
					// 	}
					// 	response[key] = value;
					// }
					// return response;
					return this.parseObject(expression[1]);
				}
				case "boolean": {
					// let value = this.parse(expression[1]);
					// if (value === undefined) {
					// 	return;
					// }
					// if (Array.isArray(value)) {
					// 	value = value[0];
					// }
					// return Boolean(value);
					return this.parseString(expression[1]);
				}
				case "escape":
					return expression[1];

				default: {

					let [value1, sign, value2] = expression;

					if (!this.isSign(sign) || value1 === undefined || value2 === undefined) {

						return expression; // -> this is an array but not an expression

					}

					return this.parse(["calc", ...expression]);

				}

			}

		} else if (expression && typeof expression === "object") { // compat

			return this.parseObject(expression);

		}

		return expression;

	}

	parseAs(expression, className) {

		return this[`parse${className}`](expression);

	}

	parseString(expression) {

		if (typeof expression !== "string") {

			if (Array.isArray(expression)) {

				expression = this.parse(expression);

			}

			if (expression === undefined) {

				return;

			}

			if (Array.isArray(expression)) {

				expression = expression[0] || "";

			}

			return expression.toString();

		}

		return expression;
	}

	parseNumber(expression) {

		if (typeof expression !== "number") {

			if (Array.isArray(expression)) {

				expression = this.parse(expression);

			}

			if (expression === undefined) {

				return;

			}

			if (Array.isArray(expression)) {

				expression = expression[0] || 0;

			}

			return Number(expression);

		}

		return expression;
	}

	parseBoolean(expression) {

		if (typeof expression !== "boolean") {

			if (Array.isArray(expression)) {

				expression = this.parse(expression);

			}

			if (expression === undefined) {

				return;

			}

			if (Array.isArray(expression)) {

				expression = expression[0] || false;

			}

			if (expression === "0") {
				return false;
			}

			return Boolean(expression);

		}

		return expression;
	}

	parseSingle(expression) {

		if (!Array.isArray(expression)) {
			return expression;
		}

		let value = this.parse(expression);

		if (value === undefined) {
			return;
		}

		if (Array.isArray(value)) {
			value = value[0];
		}

		return value;

	}

	parseArray(expression) {

		if (expression === undefined) {
			return;
		}

		if (!Array.isArray(expression)) {
			return [expression];
		}

		let value = this.parse(expression);

		if (value === undefined) {
			return;
		}

		if (!Array.isArray(value)) {
			value = [value];
		}

		return value;
	}

	parseObject(object) {

		if (typeof object !== "object") {

			console.error("parsing object but value is not an object");

		}

		const response = {};

		for (let key in object) {

			let value = this.parse(object[key]);

			if (value === undefined) {

				return;

			} else if (Array.isArray(value)) {

				value = value[0];

			}

			response[key] = value;

		}

		return response;

	}


};
