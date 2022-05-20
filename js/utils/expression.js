
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
					return this.operate(field, ...expression);

        case "!":
          return !await this.resolve(field, params[0]);

				case "?":
					return await this.resolve(field, params[0]) ? await this.resolve(field, params[1]) : await this.resolve(field, params[2] || "");

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

				case "toFixed":
          return this.numberFn(field, key, ...params);

				default:
          if (this[key]) {
            return this[key](field, ...params);
          } else {
            return key;
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

    // switch (operation) {
    //   case "=": return value1 === value2 ? "1" : "";
    //   case "!=": return value1 !== value2 ? "1" : "";
    //   case ">": return value1 > value2 ? "1" : "";
    //   case "<": return value1 < value2 ? "1" : "";
    //   case ">=": return value1 >= value2 ? "1" : "";
    //   case "<=": return value1 <= value2 ? "1" : "";
    //   case "+": return (Number(value1)+Number(value2)).toString();
    //   case "-": return (Number(value1)-Number(value2)).toString();
    //   case "*": return (Number(value1)*Number(value2)).toString();
    //   case "/": return (Number(value1)/Number(value2)).toString();
    //   case "%": return (Number(value1)%Number(value2)).toString();
    //   case "&&": return value1 && value2;
    //   case "||": return value1 || value2;
    // }

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
    }
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

  static async date(field, expression, formatExpression = "DD/MM/YYYY") {
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


  static async loop(field, expression, wilcard, replacementExpression, glue = "") {

    const array = await this.resolve(field, expression);

    const output = [];

    const replaceDeep = (expression, wildcard, replacement) => {
      if (Array.isArray(expression)) {
        return expression.map(item => replaceDeep(item, wildcard, replacement));
      } else if (expression === wildcard) {
        return replacement;
      } else {
        return expression;
      }
    }

    for (let value of array) {

      const replacement = replaceDeep(replacementExpression, wilcard, value);

      const item = await this.resolve(field, replacement);

      output.push(item);

    }

    return output.join(glue);
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

    return array[0];
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

  static async queryArray(field, driver, ...expressionPath) {

    const [request, ...joins] = driver.split("+");

    const query = KarmaFieldsAlpha.Query.create(driver, joins);

    const path = await this.resolveAll(field, expressionPath);

    const value = await query.get(...path);

    return KarmaFieldsAlpha.Type.toArray(value);

  }

  static async query(field, ...expressionPath) {
    const array = await this.queryArray(field, ...expressionPath);
    return array[0];
  }

  static async modified(field, ...expressionPath) {
    const path = await this.resolveAll(field, expressionPath);
    return field.isModified(...path);
  }




  static async thumbnail(field, key = "thumb_id") {
    // return this.resolve(field, [
		// 	"replace",
		// 	"<img src=\"##\">",
		// 	"##",
		// 	[
		// 		"query",
    //     [
    //       "replace",
    //       "posts?post_type=attachment&ids=##+files",
    //       "##",
    //       ["queryArray", ["getDriver"], "*", "thumb_id"]
    //     ],
    //     ["get", "thumb_id"],
    //     "thumb_src"
		// 	]
		// ]);

    const attachmentId = await this.resolve(field, ["get", key]);

    const driver = await this.resolve(field, [
      "replace",
      "posts?post_type=attachment&post_status=inherit&ids=##+files",
      "##",
      ["join", ["queryArray", ["getDriver"], "*", key], ","]
    ]);

    return this.resolve(field, [
			"replace",
			"<img src=\"##\" width=\"##\" height=\"##\">",
			"##",
			["query", driver, attachmentId, "thumb_src"],
      ["query", driver, attachmentId, "thumb_width"],
      ["query", driver, attachmentId, "thumb_height"]
		]);

  }

  static async taxonomy(field, taxonomy) {
    return this.resolve(field, [
			"<ul>##</ul>",
			"replace",
			"##",
			[
				"loop",
        ["getArray", taxonomy],
				"%%",
				[
					"<li><a hash=\"driver=taxonomy&taxonomy=##\">##</a></li>",
					"replace",
					"##",
          taxonomy
					["query", "taxonomy?taxonomy=category", "%%", "name"]
				]
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
