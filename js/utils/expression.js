
KarmaFieldsAlpha.Expression = class {


  static async resolve(field, expression) {

    if (Array.isArray(expression)) {

      const [key, ...params] = expression;

			switch (key) {

				case "+":
				case "-":
				case "*":
				case "/":
        case "%":
				case "&&":
				case "||":
				case "==":
        case "===":
				case "!=":
        case "!==":
				case "<":
				case ">":
				case "<=":
				case ">=":
        case "in":
					return this.operate(field, ...expression);

        case "!":
          return !await this.resolve(field, params[0]);

				case "?":
					return await this.resolve(field, params[0]) ? await this.resolve(field, params[1]) : await this.resolve(field, params[2] || "");

        case "...":
					return this.concat(field, ...params);

        // -> compat
        case "param":
          return this.getParam(field, ...params);


        // case "boolean":
        //   return Boolean(await this.resolve(field, params[0]));
        //
        // case "number":
        //   return Number(await this.resolve(field, params[0]));
        //
        // case "string":
        //   return String(await this.resolve(field, params[0]));

				case "join":
          return this.arrayFn(field, key, ...params);

        case "split":
          return this.arrayFn(field, key, ...params);

				case "toFixed":
          return this.numberFn(field, key, ...params);

				default:
          if (this[key]) {
            return this[key](field, ...params);
          } else {
            return expression;
          }

			}

    }

    return expression;

  }

  static async resolveAll(field, expressions) {

    const values = [];

    for (let item of expressions) {

      const value = await this.resolve(field, item);

      values.push(value);

    }

    return values;
  }

  static async replace(field, string, wildcard, ...replacements) {

    for (let i = 0; i < replacements.length; i++) {

      const matches = string.match(wildcard);

      if (matches) {
        const replacement = await this.resolve(field, replacements[i]);
        string = string.replace(wildcard, replacement);
      }

    }

    return string;

  }


  // static async compare(field, comparison, expression1, expression2) {
  //   const value1 = await this.resolve(field, expression1);
  //   const value2 = await this.resolve(field, expression2);
  //
  //   switch (comparison) {
  //
  //   }
  // }

  static async operate(field, operation, expression1, expression2) {
    const value1 = await this.resolve(field, expression1);
    const value2 = await this.resolve(field, expression2);

    switch (operation) {
      case "==": return value1 == value2;
      case "===": return value1 === value2;
      case "!=": return value1 != value2;
      case "!==": return value1 !== value2;
      case ">": return value1 > value2;
      case "<": return value1 < value2;
      case ">=": return value1 >= value2;
      case "<=": return value1 <= value2;
      case "+": return Number(value1)+Number(value2);
      case "-": return Number(value1)-Number(value2);
      case "*": return Number(value1)*Number(value2);
      case "/": return Number(value1)/Number(value2);
      case "%": return Number(value1)%Number(value2);
      case "&&": return value1 && value2;
      case "||": return value1 || value2;
      case "in": return value2.includes(value1);
    }
  }

  static async max(value1, value2) {
    value1 = await this.resolve(value1);
    value2 = await this.resolve(value2);
    return Math.max(Number(value1), Number(value2));
  }

  static async min(value1, value2) {
    value1 = await this.resolve(value1);
    value2 = await this.resolve(value2);
    return Math.min(Number(value1), Number(value2));
  }

  // static async logic(field, operation, expression1, expression2) {
  //   const value1 = await this.resolve(field, expression1);
  //   const value2 = expression2 ? await this.resolve(field, expression2) : "";
  //
  //   switch (operation) {
  //     case "&&": return value1 && value2;
  //     case "||": return value1 || value2;
  //   }
  // }

  static async arrayFn(field, fn, expression, ...params) {
    const array = await this.resolve(field, expression);
    return array[fn](...params);
  }

  static async stringFn(field, fn, expression, ...params) {
    const string = await this.resolve(field, expression);
    return string.toString()[fn](...params);
  }

  static async numberFn(field, fn, expression, ...params) {
    const number = await this.resolve(field, expression);
    return Number(number)[fn](...params);
  }

  static async date(field, expression, option = {}, locale = null, noDate = null) {
    const value = await this.resolve(field, expression);
    if (value) {
      const date = new Date(value);
      return new Intl.DateTimeFormat(locale || KarmaFieldsAlpha.locale, option).format(date);
    } else {
      return noDate;
    }
  }

  static async moment(field, expression, formatExpression = "DD/MM/YYYY") {
    const value = await this.resolve(field, expression);
    const format = await this.resolve(field, formatExpression);
    return moment(value).format(format);
  }

  static async condition(field, expression1, expression2, expression3 = "") {
    const value1 = await this.resolve(field, expression1);
    if (value1) {
      return await this.resolve(field, expression2);
    } else {
      return await this.resolve(field, expression3);
    }
  }




  static async getArray(field, ...expressionPath) {

    const path = await this.resolveAll(field, expressionPath);

    const request = await field.dispatch({
      action: "get",
      type: "array",
      path: path
    });

    return KarmaFieldsAlpha.Type.toArray(request.data);

  }

  static async get(field, ...expressionPath) {
    const array = await this.getArray(field, ...expressionPath);
    return KarmaFieldsAlpha.Type.toString(array);
  }

  static async getIds(field) {
    const request = await field.dispatch({
      action: "ids"
    });
    return request.data;
  }

  static async getDriver(field) {
    const request = await field.dispatch({
      action: "driver"
    });
    return request.data;
  }

  static async queryArray(field, expressionDriver, ...expressionPath) {

    // const driver = await this.resolve(field, expressionDriver);
    //
    // const [request, ...joins] = driver.split("+");
    //
    // const query = KarmaFieldsAlpha.Query.create(request, joins);
    //
    // const path = await this.resolveAll(field, expressionPath);
    //
    // const value = await query.get(...path);
    //
    // field.queriedArrayRequest = request;
    //
    // return KarmaFieldsAlpha.Type.toArray(value);



    let driver = await this.resolve(field, expressionDriver);
    const path = await this.resolveAll(field, expressionPath);


    if (typeof driver === "string") {
      driver = KarmaFieldsAlpha.Nav.parse(driver);
    }

    const paramString = KarmaFieldsAlpha.Nav.toString(driver.params);
    const store = new KarmaFieldsAlpha.Store(driver.name, driver.joins);
    const results = await store.query(paramString);

    if (path.length) {

      let value = await store.getValue(...path);
      return KarmaFieldsAlpha.Type.toArray(value);

    }

    return results;


    // field.queriedArrayRequest = request; // -> for dropdown...



  }

  static async query(field, ...expressionPath) {
    const array = await this.queryArray(field, ...expressionPath);
    return array[0];
  }

  static async getOptions(field, driver, paramString, nameField = 'name') {

    driver = await this.resolve(field, driver);
    paramString = await this.resolve(field, paramString);

    const store = new KarmaFieldsAlpha.Store(driver);
    const ids = await store.query(paramString);
    const options = [];

    for (let id of ids) {
      options.push({
        id: id,
        name: await store.getValue(id, nameField)
      });
    }

    return options;
  }

  static async getParam(field, expressionKey) {
    const key = await this.resolve(field, expressionKey);
    let value = KarmaFieldsAlpha.Nav.get(key);
    // value = decodeURI(value);
    return value;
  }

  static async modified(field, ...expressionPath) {
    const path = await this.resolveAll(field, expressionPath);
    const request = await field.dispatch({
      action: "modified"
    });
    return KarmaFieldsAlpha.Type.toBoolean(request.data);
  }

  static async dispatch(field, action, params = {}, type = "string") {
    action = await this.resolve(field, action);
    params = await this.resolve(field, params);

    const request = await field.dispatch({
      action: action,
      ...params
    });

    return KarmaFieldsAlpha.Type.convert(request.data, type);
  }


  // static async setArray(field, array, ...path) {
  //
  //   path = await this.resolveAll(field, path);
  //
  //   const request = await field.dispatch({
  //     action: "set",
  //     type: "array",
  //     // backup: "push",
  //     data: array,
  //     path: path
  //   });
  //
  // }

  static async set(field, value, ...path) {
    value = await this.resolve(field, value);
    path = await this.resolveAll(field, path);

    const array = KarmaFieldsAlpha.Type.toArray(value);

    const request = await field.dispatch({
      action: "get",
      type: "array",
      path: [...path]
    });

    if (KarmaFieldsAlpha.DeepObject.differ(request.data, array)) {

      await field.dispatch({
        action: "set",
        type: "array",
        backup: "pack",
        data: array,
        path: [...path]
      });

    }
    // await this.setArray(field, array, ...path);
  }

  static async setParam(field, value, key) {
    key = await this.resolve(field, key);
    value = await this.resolve(field, value);
    KarmaFieldsAlpha.Nav.set(value, key);
  }


  // static array(field, array) {
  //   return array;
  // }

  // static async map(field, expressionArray, expression) {
  //   const array = this.resolve(field, expressionArray);
  //   const output = [];
  //   for (let item of array) {
  //     output.push(await this.resolve(field, expression));
  //   }
  //   return output;
  //
  //
  //   Promise.all(array.map(item => this.resolve(field, [expressionitem])))
  //
  //
  // }

  static async map(field, expression, token, replacementExpression) {

    const array = await this.resolve(field, expression);

    const output = [];

    // const replaceDeep = (expression, token, replacement) => {
    //   if (Array.isArray(expression)) {
    //     if (expression[0] === "item") {
    //       // expression.splice(1, 0, replacement);
    //       return ["getChild", replacement, ...expression.slice(1)];
    //     } else {
    //       return expression.map(item => replaceDeep(item, token, replacement));
    //     }
    //   } else if (expression === token) {
    //     return replacement;
    //   } else {
    //     return expression;
    //   }
    // }

    // const replaceDeep = (expression, token, replacement) => {
    //   if (Array.isArray(expression)) {
    //     return expression.map(item => replaceDeep(item, token, replacement));
    //   } else if (expression === token) {
    //     return replacement;
    //   } else {
    //     return expression;
    //   }
    // }

    for (let value of array) {

      // const replacement = replaceDeep(replacementExpression, token, value);
      //
      // const item = await this.resolve(field, replacement);


      field.loopItem = value;

      const item = await this.resolve(field, replacementExpression);

      output.push(item);

    }

    return output;
  }

  // compat
  static async loop(field, expression, wildcard, replacementExpression, glue = "") {

    // const array = await this.resolve(field, expression);
    //
    // const output = [];
    //
    // const replaceDeep = (expression, wildcard, replacement) => {
    //   if (Array.isArray(expression)) {
    //     return expression.map(item => replaceDeep(item, wildcard, replacement));
    //   } else if (expression === wildcard) {
    //     return replacement;
    //   } else {
    //     return expression;
    //   }
    // }
    //
    // for (let value of array) {
    //
    //   const replacement = replaceDeep(replacementExpression, wilcard, value);
    //
    //   const item = await this.resolve(field, replacement);
    //
    //   output.push(item);
    //
    // }
    //
    // return output.join(glue);

    const array = await this.map(field, expression, wildcard, replacementExpression);
    return array.join(glue);
  }

  static async concat(field, ...values) {
    // return values.reduce((array, item) => {
    //   const value = await this.resolve(field, item);
    //   if (Array.isArray(value)) {
    //     array.push(...value);
    //   } else {
    //     array.push(value);
    //   }
    //   return array;
    // }, []);

    values = await this.resolveAll(field, values);

    return values.reduce((array, value) => {
      if (Array.isArray(value)) {
        array.push(...value);
      } else {
        array.push(value);
      }
      return array;
    }, []);

    // return Promise.all(values.map(item => this.resolve(field, item))).reduce((array, value) => {
    //   if (Array.isArray(value)) {
    //     array.push(...value);
    //   } else {
    //     array.push(value);
    //   }
    //   return array;
    // }, []);
  }

  static raw(field, ...value) {
    return value;
  }

  static async object(field, value) {
    const object = {};
    for (let i in value) {
      object[i] = await this.resolve(field, value[i]);
    }
    return object;
  }

  static async getChild(field, expression, ...expressionPath) {
    const value = await this.resolve(field, expression);
    const path = await this.resolveAll(field, expressionPath);
    return KarmaFieldsAlpha.DeepObject.get(value, ...path);
  }

  static async item(field, ...path) {
    return this.getChild(field, field.loopItem, ...path);
  }







  static async count(field, array) {
    array = await this.resolve(field, array);
    return array.length;
  }

  static async actives(field) {
    const request = await field.dispatch({
      action: "actives"
    });
    return KarmaFieldsAlpha.Type.toArray(request.data);
  }

  // static async id(field) {
  //   const request = await field.dispatch({
  //     action: "get",
  //     path: ["id"]
  //   });
  //   return KarmaFieldsAlpha.Type.toArray(request.data);
  // }



  static async taxonomy(field, taxonomy) {
    // return this.resolve(field, [
		// 	"<ul>##</ul>",
		// 	"replace",
		// 	"##",
		// 	[
		// 		"loop",
    //     ["getArray", taxonomy],
		// 		"%%",
		// 		[
		// 			"<li><a hash=\"driver=taxonomy&taxonomy=##\">##</a></li>",
		// 			"replace",
		// 			"##",
    //       taxonomy
		// 			["query", "taxonomy?taxonomy=category", "%%", "name"]
		// 		]
		// 	]
		// ]);

    return this.resolve(field, [
      "replace",
			"<ul>#</ul>",
			"#",
			[
				"join",
        [
          "map",
          ["getArray", taxonomy],
          [
            "replace",
            "<li><a hash=\"driver=taxonomy&taxonomy=#\">#</a></li>",
            "#",
            taxonomy,
            [
              "query",
              ["replace", "taxonomy?taxonomy=#", "#", taxonomy],
              ["item"],
              "name"
            ]
          ]
        ],
        ""
			]
		]);
  }


  static async geocoding(field, value) {
    const url = "https://www.mapquestapi.com/geocoding/v1/address?key=G3kgQdWrvD383JfqnxG6OXn90YPI3Hep&location="+value+",CH";
    const response = await fetch(url).then(response => response.json());

    if (response.results && response.results[0] && response.results[0].locations && response.results[0].locations.length) {
      const locations = response.results[0].locations;
      const location = locations.find(location => value.includes(location.adminArea5)) || locations[0];
      const latLng = location.latLng;
      return latLng.lat+", "+latLng.lng; // + " ("+response.results.length+"/"+response.results[0].locations.length+")";
    }
    return "?";
  }


}
