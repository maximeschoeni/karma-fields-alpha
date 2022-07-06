KarmaFieldsAlpha.fields.text = class extends KarmaFieldsAlpha.fields.field {

	// async parseOperator(params) {
	//
	// 	if (!Array.isArray(params)) {
	// 		params = [params];
	// 	}
	//
	// 	const array = await this.parseArray(params);
	//
	// 	switch (params[1]) {
	// 		case "!":
	// 			return !array[0] ? "1" : "";
	// 		case "=":
	// 			return array[0] === await this.parse(params[2]) ? "1" : "";
	// 		case "<":
	// 			return array[0] < await this.parse(params[2]) ? "1" : "";
	// 		case ">":
	// 			return array[0] > await this.parse(params[2]) ? "1" : "";
	// 		case "in": {
	// 			const values = await this.parseArray(params[2]);
	// 			return values.includes(array[0]) ? "1" : "";
	// 		}
	// 		case "&&":
	// 			return array[0] && await this.parse(params[2]);
	// 		case "||":
	// 			return array[0] || await this.parse(params[2]);
	// 		case "?": {
	// 			if (array[0]) {
	// 				return this.parse(params[2]);
	// 			} else {
	// 				return this.parse(params[3]);
	// 			}
	// 		}
	// 		case "loop": {
	// 			const output = [];
	// 			for (this.currentItem of array) {
	// 				const item = await this.parse(params[2] || this.currentItem);
	// 				output.push(item);
	// 			}
	// 			return output.join(params[3] || "");
	// 		}
	// 		case "array":
	// 		case "join": {
	// 			return array.join(params[2] || ",");
	// 		}
	// 		case "date":
	// 			return moment(array[0]).format(params[2] || "DD/MM/YYYY");
	//
	//
	// 		case "+": {
	// 			const value1 = array[0] || 0;
	// 			const value2 = await this.parse(array[2]) || 0;
	// 			return (Number(value1)+Number(value2)).toString();
	// 		}
	// 		case "-": {
	// 			const value1 = array[0] || 0;
	// 			const value2 = await this.parse(array[2]) || 0;
	// 			return (Number(value1)-Number(value2)).toString();
	// 		}
	// 		case "*": {
	// 			const value1 = array[0] || 0;
	// 			const value2 = await this.parse(array[2]) || 0;
	// 			return (Number(value1)*Number(value2)).toString();
	// 		}
	// 		case "/": {
	// 			const value1 = array[0] || 0;
	// 			const value2 = await this.parse(array[2]) || 0;
	// 			return (Number(value1)/Number(value2)).toString();
	// 		}
	// 		case "geocoding": {
	// 			const url = "https://www.mapquestapi.com/geocoding/v1/address?key=G3kgQdWrvD383JfqnxG6OXn90YPI3Hep&location="+array[0]+",CH";
	// 			const response = await fetch(url).then(response => response.json());
	//
	// 			if (response.results && response.results[0] && response.results[0].locations && response.results[0].locations.length) {
	// 				const locations = response.results[0].locations;
	// 				const location = locations.find(location => array[0].includes(location.adminArea5)) || locations[0];
	// 				const latLng = location.latLng;
	// 				return latLng.lat+", "+latLng.lng + " ("+response.results.length+"/"+response.results[0].locations.length+")";
	// 			}
	// 			return "?";
	// 		}
	// 		default:
	// 			return array[0];
	// 	}
	// }
	//
	// async parseArray(expression) {
	// 	expression = await this.parse(expression);
	//
	// 	if (expression.startsWith("/")) { // -> absolute path
	// 		const [request, ...joins] = expression.split("+");
	// 		const [, driver, ...path] = request.split("/");
	// 		let query = KarmaFieldsAlpha.Query.create(driver, joins);
	//
	// 		// if (driver) {
	// 		// 	[driver, ...joins] = driver.split("+");
	// 		// 	query = KarmaFieldsAlpha.Query.create(driver, joins);
	// 		// } else {
	// 		// 	const request = await this.dispatch({
	// 		// 		action: "getDriver"
	// 		// 	});
	// 		// 	driver = request.data;
	// 		// }
	//
	// 		return await query.get(...path);
	//
	// 		// if (id === "*") {
	// 		// 	const results = await query.getResults();
	// 		// 	return results.map(item => KarmaFieldsAlpha.DeepObject.get(item, ...path));
	// 		// } else {
	// 		// 	return await query.get(id, ...path);
	// 		// }
	//
	// 	} else { // -> relative path
	// 		const path = expression.split("/");
	//
	// 		const request = await this.dispatch({
	// 			action: "get",
	// 			path: path
	// 		});
	//
	// 		return request.data;
	// 	}
	//
	// }
	//
	//
	//
	// async parse(expression = "") {
	//
	// 	if (Array.isArray(expression)) {
	//
	// 		const card = this.resource.card || "<>";
	// 		let string = expression[0];
	//
	// 		for (let i = 1; i < expression.length; i++) {
	//
	// 			const matches = string.match(card);
	//
	// 			if (matches) {
	//
	// 				const replacement = await this.parseOperator(expression[i]);
	//
	// 	      string = string.replace(card, replacement);
	//
	// 			}
	//
	//     }
	//
	// 		expression = string;
	// 	}
	//
	// 	expression = expression.replace(this.resource.token || "><", this.currentItem || "");
	//
	// 	return expression;
	// }

	// async getArray(...expressionPath) {
	//
  //   const path = await this.resolveAll(expressionPath);
	//
  //   const request = await this.dispatch({
  //     action: "get",
  //     path: path
  //   });
	//
  //   return request.data;
  // }
	//
	// async queryArray(driver, ...expressionPath) {
	//
  //   const [request, ...joins] = driver.split("+");
	//
  //   const query = KarmaFieldsAlpha.Query.create(driver, joins);
	//
  //   const path = await this.resolveAll(expressionPath);
	//
  //   return query.get(...path);
	//
  // }
	//
	// async operate(operation, expression1, expression2) {
  //   const value1 = await this.resolve(expression1);
  //   const value2 = await this.resolve(expression2);
	//
  //   switch (operation) {
  //     case "+": return (Number(value1)+Number(value2)).toString();
  //     case "-": return (Number(value1)-Number(value2)).toString();
  //     case "*": return (Number(value1)*Number(value2)).toString();
  //     case "/": return (Number(value1)/Number(value2)).toString();
  //     case "&&": return value1 && value2;
  //     case "||": return value1 || value2;
  //   }
  // }
	//
	// async compare(comparison, expression1, expression2) {
  //   const value1 = await this.resolve(expression1);
  //   const value2 = await this.resolve(expression2);
	//
  //   switch (comparison) {
  //     case "=": return value1 === value2 ? "1" : "";
  //     case "!=": return value1 !== value2 ? "1" : "";
  //     case ">": return value1 > value2 ? "1" : "";
  //     case "<": return value1 < value2 ? "1" : "";
  //     case ">=": return value1 >= value2 ? "1" : "";
  //     case "<=": return value1 <= value2 ? "1" : "";
  //   }
  // }
	//
	// async replace(string, wildcard, ...replacements) {
  //   for (let i = 0; i < replacements.length; i++) {
  //     const matches = string.match(wildcard);
  //     if (matches) {
  //       const replacement = await this.resolve(replacements[i]);
  //       string = string.replace(wildcard, replacement);
  //     }
  //   }
  //   return string;
  // }
	//
  // async formatDate(expression, format = "DD/MM/YYYY") {
  //   const value = await this.resolve(expression);
  //   return moment(value).format(format);
  // }
	//
	// async loop(array, wilcard, replacement, glue = "") {
  //   const array = await this.resolve(array);
  //   const output = [];
	// 	const replaceDeep = (expression, wildcard, replacement) => {
	//     if (Array.isArray(expression)) {
	//       return expression.map(item => this.replaceDeep(item, wildcard, replacement));
	//     } else {
	//       return expression.replace(wildcard, replacement);
	//     }
	//   }
  //   for (let value of array) {
  //     output.push(await this.resolve(this.replaceDeep(replacement, wilcard, value)));
  //   }
  //   return output.join(glue);
  // }
	//
	// async resolveAll(expressions) {
  //   const values = [];
  //   for (let item of expressions) {
  //     const value = await this.resolve(item);
  //     values.push(value);
  //   }
  //   return values;
  // }
	//
	// async resolve(expression) {
	//
  //   if (Array.isArray(expression)) {
	//
	// 		const [key, ...params] = expression;
	//
	// 		switch (key) {
	//
	// 			case "get":
	// 				return (await this.getArray(expression[1]))[0];
	//
	// 			case "query":
	// 				return (await this.queryArray(expression[1]))[0];
	//
	// 			case "+":
	// 			case "-":
	// 			case "*":
	// 			case "/":
	// 			case "&&":
	// 			case "||":
	// 				return this.operate(...expression);
	//
	// 			case "=":
	// 			case "!=":
	// 			case "<":
	// 			case ">":
	// 			case "<=":
	// 			case ">=":
	// 				return this.compare(...expression);
	//
	// 			case "?":
	// 				return (await this.resolve(expression[1])) ? (await this.resolve(expression[2])) : (await this.resolve(expression[3] || ""));
	//
	// 			case "replace":
	// 			case "getArray":
	// 			case "loop":
	// 				return this[key](...params);
	//
	// 			case "date":
	// 				return this.formatDate(...params);
	//
	// 			case "join":
	// 				return (await this.getArray(params.shift()))[key](...params);
	//
	// 			case "toFixed":
	// 				return Number(await this.getArray(params.shift()))[key](...params);
	//
	// 			default:
	// 				return key;
	//
	//
	// 		}
	//
  //   }
	//
  //   return expression;
	//
  // }



	// initField() {
	//
	// 	const value = [
	// 		"replace",
	// 		"value: #",
	// 		"#",
	// 		["get", "key"]
	// 	];
	//
	// 	const categories2 = [
	// 		"<ul>##</ul>",
	// 		"replace",
	// 		"##",
	// 		[
	// 			["getArray", "category"],
	// 			"loop",
	// 			"%%",
	// 			[
	// 				"<li><a hash=\"driver=taxonomy&taxonomy=category\">##</a></li>",
	// 				"replace",
	// 				"##",
	// 				["get", "/taxonomy?taxonomy=category/%%/name"]
	// 			]
	// 		]
	// 	];
	//
	// 	const categories2 = [
	// 		"<ul>##</ul>",
	// 		"replace",
	// 		"##",
	// 		[
	// 			"join",
	// 			[
	// 				"map",
	// 				["getArray", "category"],
	// 				"%%",
	// 				[
	// 					"replace",
	// 					"<li><a hash=\"driver=taxonomy&taxonomy=category\">##</a></li>",
	// 					"##",
	// 					["get", "/taxonomy?taxonomy=category", "%%", "name"]
	// 				]
	// 			],
	// 			""
	// 		]
	// 	];
	//
	// 	// const date = [
	// 	// 	"date: %d",
	// 	// 	["dateKey", "d m Y"]
	// 	//
	// 	// ];
	//
	// 	const date = [
	// 		"date",
	// 		["get", "dateKey"],
	// 		"d m Y"
	// 	];
	//
	//
	//
	// 	// const image = [
	// 	// 	"<img src=\"%v\">",
	// 	// 	[
	// 	// 		"/posts?post_type=attachment&ids=%a+files/%v/thumb_src",
	// 	// 		"/*/thumb_id",
	// 	// 		"thumb_id"
	// 	// 	]
	// 	//
	// 	// ];
	//
	// 	const image = [
	// 		"replace",
	// 		"<img src=\"##\">",
	// 		"##",
	// 		[
	// 			"get",
	// 			[
	// 				"replace",
	// 				"/posts?post_type=attachment&ids=##+files/##/thumb_src",
	// 				"##",
	// 				[
	// 					"join",
	// 					["queryArray", "/*/thumb_id"],
	// 					","
	// 				],
	// 				["get", "thumb_id"]
	// 			]
	// 		]
	// 	];
	//
	//
	//
	// 	// const condition1 = [
	// 	// 	"%i",
	// 	// 	[
	// 	// 		[
	// 	// 			"%b",
	// 	// 			[
	// 	// 				"key",
	// 	// 				">",
	// 	// 				"2000"
	// 	// 			]
	// 	// 		],
	// 	// 		"result1",
	// 	// 		[
	// 	// 			"%i",
	// 	// 			[
	// 	// 				"key2",
	// 	// 				"result2",
	// 	// 				[
	// 	// 					"%i",
	// 	// 					[
	// 	// 						"key3",
	// 	// 						"result3",
	// 	// 						"result4"
	// 	// 					]
	// 	// 				]
	// 	// 			]
	// 	// 		]
	// 	// 	]
	// 	// ];
	//
	// 	const condition1 = [
	// 		"?",
	// 		["get", "key"],
	// 		"result1",
	// 		[
	// 			"?",
	// 			["get", "key2"],
	// 			"result2",
	// 			[
	// 				"?",
	// 				["get", "key3"],
	// 				"result3",
	// 				"result4"
	// 			]
	// 		]
	// 	];
	//
	//
	//
	// 	// -> compat
	// 	if (!this.resource.value && this.resource.key && this.resource.driver) {
	// 		// console.warn("DEPRECATED");
	// 		this.resource.value = "%"+this.resource.key+":"+this.resource.driver+"%";
	// 	} else if (!this.resource.value && this.resource.key) {
	// 		// console.warn("DEPRECATED");
	// 		this.resource.value = "%"+this.resource.key+"%";
	// 	}
	//
	// 	if (!this.resource.value) {
	// 		console.error("Resource missing value attribute");
	// 	}
	//
	// 	// if (this.resource.value) {
	// 	// 	if (this.resource.value.includes("*")) {
	// 	// 		this.resource.value = this.resource.value.replace(/^(.*)\*([^%]+)\*(.*)$/, "{{#$2}}$1{{$2}}$3{{/$2}}");
	// 	// 	}
	// 	// 	if (this.resource.value.includes("%")) {
	// 	// 		this.resource.value = this.resource.value.replace(/%([^%]+)%/g, "{{$1}}");
	// 	// 	}
	// 	// }
	//
	//
	// 	// compat
	//
	// }

	async importValue() {

	}

	async exportValue() {
		return this.parse(this.resource.value || "");
	}


	build() {
		return {
			tag: this.resource.tag,
			class: "text karma-field",
			init: node => {
				if (this.resource.dynamic || this.resource.disabled) {
					this.update = request => node.render();
				}
				if (this.resource.classes) {
					node.element.classList.add(...this.resource.classes);
				}
			},
			update: async node => {
				this.render = node.render;



				// node.element.innerHTML = this.preParse(this.resource.value);

// console.log(this.resource.id, this.resource.value);
// if (this.resource.id == "xx") debugger;



				await this.parse(this.resource.value || "").then(value => {
					node.element.innerHTML = value;
				});

				if (this.resource.disabled) {
					node.element.classList.add("disabled");
					this.parse(this.resource.disabled).then(disabled => {
						node.element.classList.toggle("disabled", disabled);
					});
				}

				// if (this.resource.hidden) {
				// 	node.element.parentNode.classList.add("hidden");
				// 	this.parse(this.resource.hidden).then(hidden => node.element.parentNode.classList.toggle("hidden", hidden));
				// }


			}
		};
	}


}
