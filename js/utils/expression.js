KarmaFieldsAlpha.Expression = class {

  constructor(expression, field) {

    this.field = field;
    this.expression = expression;

    // if (Array.isArray(expression)) {
    //
    //   [this.operation, ...this.arguments] = expression;
    //
    //   // this.children = this.arguments.map(argument => new this.constructor(value, this.field, this.item));
    //
    // }

    // this.parent = this;
    //
    // this.item = item; // -> only for map!

  }

  getChild(index, item) {

    return new this.constructor(this.expression[index], this.field);

  }

  create(value) {

    return new this.constructor(value, this.field);

  }

  ready(...value) {

    return values.every(value !== undefined && value !== KarmaFieldsAlpha.loading);

  }

  toObject() {

    const value = this.parse();

    // if (value === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (typeof value === "symbol") {

      return value;

    }


    return KarmaFieldsAlpha.Type.toObject(value);

  }

  toSingle() {

    return this.toObject();

  }

  toString() {

    const value = this.parse();

    // if (value === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (typeof value === "symbol") {

      return value;

    }

    return KarmaFieldsAlpha.Type.toString(value);

  }

  toNumber() {

    const value = this.parse();

    // if (value === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (typeof value === "symbol") {

      return value;

    }

    return KarmaFieldsAlpha.Type.toNumber(value);

  }

  toArray() {

    const value = this.parse();

    // if (value === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (typeof value === "symbol") {

      return value;

    }

    return KarmaFieldsAlpha.Type.toArray(value);

  }

  toBoolean() {

    const value = this.parse();

    // if (value === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (typeof value === "symbol") {

      return value;

    }

    return KarmaFieldsAlpha.Type.toBoolean(value);

  }

  compute() {

    const v1 = this.create(this.expression[1]).toNumber();
    const v2 = this.create(this.expression[2]).toNumber();

    // if (v1 === KarmaFieldsAlpha.loading || v2 === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (typeof v1 === "symbol") {

      return v1;

    }

    if (typeof v2 === "symbol") {

      return v2;

    }

    switch (this.expression[0]) {

      case "+": return v1 + v2;
      case "-": return v1 - v2;
      case "*": return v1 * v2;
      case "/": return v1 / v2;
      case "max": return Math.max(v1, v2);
      case "min": return Math.max(v1, v2);

    }

  }

  compare() {

    const v1 = this.create(this.expression[1]).toObject();
    const v2 = this.create(this.expression[2]).toObject();

    // if (v1 === KarmaFieldsAlpha.loading || v2 === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (typeof v1 === "symbol") {

      return v1;

    }

    if (typeof v2 === "symbol") {

      return v2;

    }

    switch (this.expression[0]) {

      case "=":
      case "==": return v1 == v2;
      case "===": return v1 === v2;
      case "!=": return v1 != v2;
      case "!==": return v1 !== v2;
      case ">": return v1 > v2;
      case "<": return v1 < v2;
      case ">=": return v1 >= v2;
      case "<=": return v1 <= v2;
      case "like": return typeof v1 === "string" && typeof v2 === "string" && v1.match(new RegExp(v2));

    }

  }

  logic() {

    const values = this.expression.slice(1).map(value => this.create(value).toObject());

    // if (values.some(value => value === KarmaFieldsAlpha.loading)) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (values.some(value => typeof value === "symbol")) {

      return values.find(value => typeof value === "symbol");

    }

    let result = values.shift();

    while (values.length) {

      const value = values.shift();

      switch (this.expression[0]) {

        case "&&":
          result = result && value;
          break;

        case "||":
          result = result || value;
          break;

      }

    }

    return result;

  }

  math() {

    const values = this.expression.slice(2).map(value => this.create(value).toNumber());

    // if (values.some(value => value === KarmaFieldsAlpha.loading)) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (values.some(value => typeof value === "symbol")) {

      return values.find(value => typeof value === "symbol");

    }

    return Math[this.expression[1]](...values);

  }

  not() {

    const value = this.create(this.expression[1]).toBoolean();

    // if (value === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (typeof value === "symbol") {

      return value;

    }

    return !value;

  }

  condition() {

    const v1 = this.create(this.expression[1]).toBoolean();
    const v2 = this.create(this.expression[2]).parse();
    const v3 = this.create(this.expression[3]).parse();

    // if (v1 === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (typeof v1 === "symbol") {

      return v1;

    }

    return v1 ? v2 : v3;

  }

  concat() {

    const arrays = this.expression.slice(1).map(value => this.create(value).toArray());

    // if (arrays === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (typeof array === "symbol") {

      return array;

    }

    return [].concat(...arrays);

  }

  join() {

    const array = this.create(this.expression[1]).toArray();
    const glue = this.expression[2] || ", ";

    // if (array === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (typeof array === "symbol") {

      return array;

    }

    return array.join(glue);

  }

  include() {

    const array = this.create(this.expression[1]).toArray();
    const value = this.create(this.expression[2]).toObject();

    // if (array === KarmaFieldsAlpha.loading || value === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (typeof array === "symbol") {

      return array;

    }

    if (typeof value === "symbol") {

      return value;

    }

    return array.include(value);

  }

  getLength() {

    const array = this.create(this.expression[1]).toArray();

    // if (array === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (typeof array === "symbol") {

      return array;

    }

    return array.length;

  }

  map() {

    const array = this.create(this.expression[1]).toArray();

    // if (array === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (typeof array === "symbol") {

      return array;

    }

    const results = array.map(value => new this.constructor(this.expression[2], value).parse());

    if (results.some(result => result === KarmaFieldsAlpha.loading)) {

      return KarmaFieldsAlpha.loading;

    }

    return results;
  }

  getItem() {

    return KarmaFieldsAlpha.DeepObject.get(this.field, ...this.expression.slice(1));

    // const key = this.expression[1];
    //
    // return this.field[key];

  }

  date() {

    const dateString = this.create(this.expression[1]).toObject();
    const option = this.expression[2] || {};
    const locale = this.expression[3] || KarmaFieldsAlpha.locale;

    // if (date === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (typeof dateString === "symbol") {

      return dateString;

    }

    const dateObj = new Date(dateString);

    if (!isNaN(dateObj)) {

      return dateObj.toLocaleDateString(locale, option);

    }

    return "";

  }

  getValue() {

    const key = this.create(this.expression[1]).toString() || this.field.getKey();

    // if (key === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (typeof key === "symbol") {

      return key;

    }

    return this.field.parent.getValue(key) || KarmaFieldsAlpha.loading;

  }

  hasValue() {

    const key = this.create(this.expression[1]).toString() || this.field.getKey();

    if (typeof key === "symbol") {

      return key;

    }

    const values = this.field.parent.getValue(key);

    if (values === KarmaFieldsAlpha.loading) {

      return KarmaFieldsAlpha.loading;

    }

    return values.length > 0;

  }

  // getName() {
  //
  //   return this.field.parent.getName();
  //
  // }
  //
  // getUploadDate() {
  //
  //   return this.field.parent.getValue(KarmaFieldsAlpha.symbols.uploadDate) || KarmaFieldsAlpha.loading;
  //
  // }

  queryValue() {

    const driver = this.create(this.expression[1]).toString();
    const id = this.create(this.expression[2]).toString();
    const key = this.create(this.expression[3]).toString();

    if (typeof driver === "symbol") {

      return driver;

    }

    if (typeof id === "symbol") {

      return id;

    }

    if (typeof key === "symbol") {

      return key;

    }

    return KarmaFieldsAlpha.Query.getValue(driver, id, key) || KarmaFieldsAlpha.loading;

  }

  queryValues() {

    const driver = this.create(this.expression[1]).toString();
    const ids = this.create(this.expression[2]).toArray();
    const key = this.create(this.expression[3]).toString();

    if (typeof driver === "symbol") {

      return driver;

    }

    if (typeof ids === "symbol") {

      return ids;

    }

    if (typeof key === "symbol") {

      return key;

    }

    const values = ids.map(id => KarmaFieldsAlpha.Query.getValue(driver, id, key) || KarmaFieldsAlpha.loading);

    if (values.some(value => value === KarmaFieldsAlpha.loading)) {

      return KarmaFieldsAlpha.loading;

    }

    return values.reduce((accumulator, items) => [...accumulator, ...items], []);

  }

  query() {

    const driver = this.create(this.expression[1]).toString();
    // params = this.create(this.expression[2]).toObject();
    const params = this.create(["parseParams", this.expression[2]]).parse();

    // if (driver === KarmaFieldsAlpha.loading || params === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (typeof driver === "symbol") {

      return driver;

    }

    if (typeof params === "symbol") {

      return params;

    }

    return KarmaFieldsAlpha.Query.getResults(driver, params) || KarmaFieldsAlpha.loading;

  }

  parseParams() {

    const entries = Object.entries(this.expression[1]).map(([key, value]) => [key, this.create(value).toString()]);

    // if (entries.some(([key, value]) => value === KarmaFieldsAlpha.loading)) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    // if (entries.some(([key, value]) => typeof driver === "symbol")) {
    //
    //   return entries.find(([key, value]) => typeof driver === "symbol")[1];
    //
    // }

    return Object.fromEntries(entries);

  }

  getOptions() {

    const driver = this.create(this.expression[1]).toString();
    // params = this.create(this.expression[2]).toObject();
    const params = this.create(["parseParams", this.expression[2]]).parse();

    // if (driver === KarmaFieldsAlpha.loading || params === KarmaFieldsAlpha.loading) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    return KarmaFieldsAlpha.Query.getOptions(driver, params) || KarmaFieldsAlpha.loading;

  }

  getParam() {

    const key = this.expression[1];

    return KarmaFieldsAlpha.Store.getParam(key);

  }

  modified() {

    return this.field.modified();

  }


  getKey() {

    return this.field.getKey();

  }

  getIndex() {

    return this.field.parent.getIndex();

  }

  getIds() {

    return this.field.parent.getIds();

  }

  request() {

    return this.field.request(...this.expression.slice(1));

  }

  replace() {

    const string = this.expression[1];
    const wildcard = this.expression[2];

    const replacements = this.expression.slice(3).map(replacement => this.create(replacement).toString());

    // if (replacements.some(value => value === KarmaFieldsAlpha.loading)) {
    //
    //   return KarmaFieldsAlpha.loading;
    //
    // }

    if (replacements.some(value => typeof value === "symbol")) {

      return replacements.find(value => typeof value === "symbol");

    }

    return replacements.reduce((string, replacement) => string.replace(wildcard, replacement), string);

  }

  isLoading() {
    return this.create(this.expression[1]).toSingle() === KarmaFieldsAlpha.loading;
  }

  isMixed() {
    return this.create(this.expression[1]).toSingle() === KarmaFieldsAlpha.mixed;
  }


  // object() {
  //
  //   const object = {};
  //
  //   for (let i = 1; i < this.expression.length; i += 2) {
  //
  //     const key = this.create(this.expression[i]).toString();
  //     const value = this.create(this.expression[i+1]).toString();
  //
  //     object[key] = value;
  //
  //   }
  //
  //   if (Object.keys(object).some(key => key === KarmaFieldsAlpha.loading)) {
  //
  //     return KarmaFieldsAlpha.loading;
  //
  //   }
  //
  //   if (Object.values(object).some(key => key === KarmaFieldsAlpha.loading)) {
  //
  //     return KarmaFieldsAlpha.loading;
  //
  //   }
  //
  //   return object;
  //
  // }


  object() {

    const object = {};

    for (let key in this.expression[1]) {

      object[key] = this.create(this.expression[1][key]).toString();

    }

    if (Object.values(object).some(key => key === KarmaFieldsAlpha.loading)) {

      return KarmaFieldsAlpha.loading;

    }

    return object;

  }


  parse() {

    if (!Array.isArray(this.expression)) {

      return this.expression;

    }

    switch (this.expression[0]) {
      case "=":
      case "==":
      case "===":
      case "!=":
      case "!==":
      case ">":
      case "<":
      case ">=":
      case "<=":
      case "like":
        return this.compare();

      case "+":
      case "-":
      case "*":
      case "/":
      case "%":
      case "max":
      case "min":
        return this.compute();

      case "&&":
      case "||":
        return this.logic();

      case "math":
        return this.math();

      case "include":
        return this.include();

      case "!":
        return this.not();

      case "?":
        return this.condition();

      case "concat":
      case "...":
        return this.concat();

      case "replace":
        return this.replace();

      case "date":
        return this.date();

      case "request":
        return this.request();

      case "getValue":
        return this.getValue();

      case "hasValue":
        return this.hasValue();

      case "queryValue":
        return this.queryValue();

      case "query":
        return this.query();

      case "parseParams":
        return this.parseParams();

      case "getOptions":
        return this.getOptions();

      case "map":
        return this.map();

      case "getItem":
      case "item":
        return this.getItem();

      case "join":
        return this.join();

      case "getLength":
      case "length":
      case "count":
        return this.getLength();

      case "key":
        return this.field.getKey();

      case "index":
      case "getIndex":
        return this.field.parent.getIndex();

      case "id":
      case "getId":
      case "getIds":
        return this.field.getId();

      case "modified":
        return this.field.modified();

      case "getParam":
        return this.getParam();

      // case "toNumber":
      // case "toString":
      // case "toArray":
      // case "toObject":
      // case "toBoolean":
      //   return this.create(this.expression[1])[this.expression[0]]();

      case "isLoading":
        return this.isLoading();

      case "isMixed":
        return this.isMixed();

      case "object":
        return this.object();


      case "debugger":
        debugger;
        this.create(this.expression[1]).parse();
        return;

      default:
        return this.expression;

    }

  }


  static parseParams(params, context) {

    const object = {};

    for (let key in params) {

      // object[key] = this.create(params[key]).toString();
      object[key] = new this(params[key], context).toString();

    }

    return object;
  }


  // static async resolve(field, expression) {
  //
  //   if (Array.isArray(expression)) {
  //
  //     const [key, ...params] = expression;
  //
	// 		switch (key) {
  //
	// 			case "+":
	// 			case "-":
	// 			case "*":
	// 			case "/":
  //       case "%":
	// 			case "&&":
	// 			case "||":
  //       case "=":
	// 			case "==":
  //       case "===":
	// 			case "!=":
  //       case "!==":
	// 			case "<":
	// 			case ">":
	// 			case "<=":
	// 			case ">=":
  //       case "in":
  //       case "notin":
	// 				return this.operate(field, ...expression);
  //
  //       case "!":
  //         return !await this.resolve(field, params[0]);
  //
	// 			case "?":
	// 				return await this.resolve(field, params[0]) ? await this.resolve(field, params[1]) : await this.resolve(field, params[2] || "");
  //
  //       case "...":
	// 				return this.concat(field, ...params);
  //
  //       // -> compat
  //       case "param":
  //         return this.getParam(field, ...params);
  //
  //
  //       // case "boolean":
  //       //   return Boolean(await this.resolve(field, params[0]));
  //       //
  //       // case "number":
  //       //   return Number(await this.resolve(field, params[0]));
  //       //
  //       // case "string":
  //       //   return String(await this.resolve(field, params[0]));
  //
	// 			// case "join":
  //       //   return this.arrayFn(field, key, ...params);
  //       //
  //       // case "split":
  //       //   return this.arrayFn(field, key, ...params);
  //       //
	// 			// case "toFixed":
  //       //   return this.numberFn(field, key, ...params);
  //
	// 			default:
  //         if (this[key]) {
  //           return this[key](field, ...params);
  //         } else {
  //           return expression;
  //         }
  //
	// 		}
  //
  //   }
  //
  //   return expression;
  //
  // }
  //
  // static async resolveAll(field, expressions) {
  //
  //   const values = [];
  //
  //   for (let item of expressions) {
  //
  //     const value = await this.resolve(field, item);
  //
  //     values.push(value);
  //
  //   }
  //
  //   return values;
  // }
  //
  // static async resolveObject(field, object) {
  //
  //   const output = {};
  //
  //   for (let param in object) {
  //
  //     output[param] = await this.resolve(field, object[param]);
  //
  //   }
  //
  //   return output;
  // }
  //
  // static async resolveParams(field, params) {
  //
  //   if (typeof params === "object") {
  //
  //     return this.resolveObject(field, params);
  //
  //   } else {
  //
  //     return this.resolve(field, params);
  //
  //   }
  // }
  //
  // static async replace(field, string, wildcard, ...replacements) {
  //
  //   for (let i = 0; i < replacements.length; i++) {
  //
  //     const matches = string.match(wildcard);
  //
  //     if (matches) {
  //       const replacement = await this.resolve(field, replacements[i]);
  //       string = string.replace(wildcard, replacement);
  //     }
  //
  //   }
  //
  //   return string;
  //
  // }
  //
  //
  // // static async compare(field, comparison, expression1, expression2) {
  // //   const value1 = await this.resolve(field, expression1);
  // //   const value2 = await this.resolve(field, expression2);
  // //
  // //   switch (comparison) {
  // //
  // //   }
  // // }
  //
  // static async operate(field, operation, expression1, expression2) {
  //   const value1 = await this.resolve(field, expression1);
  //   const value2 = await this.resolve(field, expression2);
  //
  //   if (Array.isArray(value1)) {
  //
  //     if (Array.isArray(value2)) {
  //
  //       switch (operation) {
  //         case "==":
  //         case "===": return KarmaFieldsAlpha.DeepObject.equal(value1, value2);
  //         case "!=":
  //         case "!==": return KarmaFieldsAlpha.DeepObject.differ(value1, value2);
  //         case "+": return [...value1, ...value2];
  //         case "-": return value1.filter(item => !value2.includes(item));
  //       }
  //
  //     } else {
  //
  //       switch (operation) {
  //         case "==": return value1.every(item => item == value2);
  //         case "===": return value1.every(item => item === value2);
  //         case "!=": return value1.some(item => item != value2);
  //         case "!==": return value1.some(item => item !== value2);
  //         case "+": return [...value1, value2];
  //         case "-": return value1.filter(item => item !== value2);
  //         case "in": return value2.includes(value1);
  //         case "notin": return !value2.includes(value1);
  //       }
  //
  //     }
  //
  //   } else {
  //
  //     switch (operation) {
  //       case "=":
  //       case "==": return value1 == value2;
  //       case "===": return value1 === value2;
  //       case "!=": return value1 != value2;
  //       case "!==": return value1 !== value2;
  //       case ">": return value1 > value2;
  //       case "<": return value1 < value2;
  //       case ">=": return value1 >= value2;
  //       case "<=": return value1 <= value2;
  //       case "+": return Number(value1)+Number(value2);
  //       case "-": return Number(value1)-Number(value2);
  //       case "*": return Number(value1)*Number(value2);
  //       case "/": return Number(value1)/Number(value2);
  //       case "%": return Number(value1)%Number(value2);
  //       case "&&": return value1 && value2;
  //       case "||": return value1 || value2;
  //
  //       // case "in": return value2.includes(value1);
  //     }
  //
  //   }
  //
  //   console.error("illegal operation", operation, value1, value2);
  //
  // }
  //
  // static async max(value1, value2) {
  //   value1 = await this.resolve(value1);
  //   value2 = await this.resolve(value2);
  //   return Math.max(Number(value1), Number(value2));
  // }
  //
  // static async min(value1, value2) {
  //   value1 = await this.resolve(value1);
  //   value2 = await this.resolve(value2);
  //   return Math.min(Number(value1), Number(value2));
  // }
  //
  // // static async logic(field, operation, expression1, expression2) {
  // //   const value1 = await this.resolve(field, expression1);
  // //   const value2 = expression2 ? await this.resolve(field, expression2) : "";
  // //
  // //   switch (operation) {
  // //     case "&&": return value1 && value2;
  // //     case "||": return value1 || value2;
  // //   }
  // // }
  //
  // // static async arrayFn(field, fn, expression, ...params) {
  // //   const array = await this.resolve(field, expression);
  // //   return array[fn](...params);
  // // }
  // //
  // // static async stringFn(field, fn, expression, ...params) {
  // //   const string = await this.resolve(field, expression);
  // //   return string.toString()[fn](...params);
  // // }
  // //
  // // static async numberFn(field, fn, expression, ...params) {
  // //   const number = await this.resolve(field, expression);
  // //   return Number(number)[fn](...params);
  // // }
  //
  // static async js(field, value, fn, ...params) {
  //   value = await this.resolve(field, value);
  //   params = await this.resolveAll(field, params);
  //   return value[fn](...params);
  // }
  //
  // static async math(field, fn, ...params) {
  //   params = await this.resolveAll(field, params);
  //   return Math[fn](...params);
  // }
  //
  // static async date(field, expression, option = {}, locale = null, noDate = null) {
  //   const value = await this.resolve(field, expression);
  //   if (value) {
  //     const date = new Date(value);
  //     return new Intl.DateTimeFormat(locale || KarmaFieldsAlpha.locale, option).format(date);
  //   } else {
  //     return noDate;
  //   }
  // }
  //
  // static async moment(field, expression, formatExpression = "DD/MM/YYYY") {
  //   const value = await this.resolve(field, expression);
  //   const format = await this.resolve(field, formatExpression);
  //   return moment(value).format(format);
  // }
  //
  // static async condition(field, expression1, expression2, expression3 = "") {
  //   const value1 = await this.resolve(field, expression1);
  //   if (value1) {
  //     return await this.resolve(field, expression2);
  //   } else {
  //     return await this.resolve(field, expression3);
  //   }
  // }
  //
  //
  //
  //
  // static async getArray(field, ...expressionPath) {
  //
  //   // const path = await this.resolveAll(field, expressionPath);
  //   // const response = await field.parent.request("get", {}, ...path);
  //   // return KarmaFieldsAlpha.Type.toArray(response);
  //
  //   return this.get(field, "array", ...expressionPath);
  //
  // }
  //
  // static async get(field, type, ...path) {
  //
  //   // -> compat
  //   switch (type) {
  //     case "string":
  //     case "array":
  //     case "object":
  //     case "number":
  //     case "boolean":
  //       break;
  //     default:
  //       path = [type, ...path];
  //       type = "string";
  //       break;
  //   }
  //
  //   path = await this.resolveAll(field, path);
  //
  //   const response = await field.parent.request("get", {}, ...path);
  //
  //   return KarmaFieldsAlpha.Type.convert(response, type);
  //
  // }
  //
  // static async getIds(field) {
  //   return await field.parent.request("ids");
  // }
  //
  // static async getDriver(field) {
  //   console.error("deprecated");
  //   // const request = await field.dispatch({
  //   //   action: "driver"
  //   // });
  //   // return request.data;
  // }
  //
  // static async queryArray(field, expressionDriver, ...expressionPath) {
  //   console.error("Deprecated queryArray. Use query");
  //
  //
  //
  //   // let driver = await this.resolve(field, expressionDriver);
  //   // const path = await this.resolveAll(field, expressionPath);
  //   //
  //   //
  //   // if (typeof driver === "string") {
  //   //   driver = KarmaFieldsAlpha.Nav.parse(driver);
  //   // }
  //   //
  //   // const paramString = KarmaFieldsAlpha.Nav.toString(driver.params);
  //   // const store = new KarmaFieldsAlpha.Store(driver.name, driver.joins);
  //   // const results = await store.query(paramString);
  //   //
  //   // if (path.length) {
  //   //
  //   //   let value = await store.getValue(...path);
  //   //   return KarmaFieldsAlpha.Type.toArray(value);
  //   //
  //   // }
  //   //
  //   // return results;
  //
  //
  //   // field.queriedArrayRequest = request; // -> for dropdown...
  //
  //
  //
  // }
  //
  // static async query(field, driver, paramString = "", joins = [], type = "array", ...path) {
  //
  //   driver = await this.resolve(field, driver);
  //   paramString = await this.resolve(field, paramString);
  //   if (typeof paramString === "object") {
  //     KarmaFieldsAlpha.Params.stringify(paramString);
  //   }
  //   // const store = new KarmaFieldsAlpha.Store(driver, joins);
  //   // const results = await store.query(paramString);
  //   const form = new KarmaFieldsAlpha.field.form({
  //     driver: driver,
  //     joins: joins
  //   });
  //
  //   const results = await form.query(paramString);
  //
  //   if (path.length) {
  //     path = await this.resolveAll(field, path);
  //     const value = await form.getInitial(...path);
  //     return KarmaFieldsAlpha.Type.convert(value, type);
  //   }
  //
  //   return results;
  // }
  //
  // static async table(field, table, type = "array", ...path) {
  //
  //   table = await this.resolveObject(field, table);
  //
  //   const form = new KarmaFieldsAlpha.field.form(table);
  //   const params = await this.resolveParams(field, table.params);
  //   const results = await form.query(params);
  //
  //   if (path.length) {
  //
  //     path = await this.resolveAll(field, path);
  //     const value = await form.getInitial(...path);
  //     return KarmaFieldsAlpha.Type.convert(value, type);
  //
  //   } else {
  //
  //     const idAlias = form.getAlias("id");
  //     const nameAlias = form.getAlias("name");
  //
  //     return results.map(item => {
  //       return {
  //         id: item[idAlias],
  //         name: item[nameAlias]
  //       };
  //     });
  //
  //   }
  //
  //   return results;
  // }
  //
  // static async getOptions(field, driver, paramString = "", nameField = "name", joins = []) {
  //
  //   driver = await this.resolve(field, driver);
  //   paramString = await this.resolve(field, paramString);
  //
  //   if (typeof paramString === "object") {
  //     KarmaFieldsAlpha.Params.stringify(paramString);
  //   }
  //
  //   // const store = new KarmaFieldsAlpha.Store(driver);
  //   //
  //   // const ids = await store.queryIds(paramString);
  //
  //   const form = new KarmaFieldsAlpha.field.form({
  //     driver: driver,
  //     joins: joins
  //   });
  //
  //   const results = await form.query(paramString);
  //
  //   const options = [];
  //
  //   // for (let id of ids) {
  //   //   options.push({
  //   //     id: id,
  //   //     name: KarmaFieldsAlpha.Type.toString(await form.getInitial(id, nameField))
  //   //   });
  //   // }
  //
  //   for (let item of results) {
  //     options.push({
  //       id: item.id,
  //       name: KarmaFieldsAlpha.Type.toString(item[nameField] || await form.getInitial(item.id, nameField))
  //     });
  //   }
  //
  //   return options;
  // }
  //
  // // static async getGroupOptions(field, driver, paramString = "", nameField = "name", keyField = "id", groupNameField = "group_name", groupIdField = "group_id") {
  // //
  // //   driver = await this.resolve(field, driver);
  // //   paramString = await this.resolve(field, paramString);
  // //
  // //   const store = new KarmaFieldsAlpha.Store(driver);
  // //
  // //   const ids = await store.queryIds(paramString);
  // //   const groups = [];
  // //
  // //   for (let id of ids) {
  // //     const name = KarmaFieldsAlpha.Type.toString(await store.getValue(id, nameField));
  // //     const groupId = KarmaFieldsAlpha.Type.toString(await store.getValue(id, groupIdField));
  // //
  // //     let group = groups.find(group => group.id === groupId);
  // //
  // //     if (!group) {
  // //
  // //       group = {
  // //        id: groupId,
  // //        name: KarmaFieldsAlpha.Type.toString(await store.getValue(id, groupNameField)),
  // //        options: []
  // //      };
  // //
  // //      groups.push(group);
  // //
  // //     }
  // //
  // //     group.options.push({
  // //       id: id,
  // //       name: KarmaFieldsAlpha.Type.toString(await store.getValue(id, nameField))
  // //     });
  // //
  // //   }
  // //
  // //   return groups;
  // // }
  //
  //
  // // static async getOptions(field, driver, paramString = "", nameField = "name") {
  // //
  // //   // driver = await this.resolve(field, driver);
  // //
  // //   const expressionKey = JSON.stringify(["getOptions", driver, paramString, nameField]);
  // //
  // //   const cache = new KarmaFieldsAlpha.Buffer("cache");
  // //
  // //   let promise = cache.get(driver, "expressions", expressionKey);
  // //
  // //   if (!promise) {
  // //
  // //     promise = new Promise(async (resolve, reject) => {
  // //
  // //       paramString = await this.resolve(field, paramString);
  // //
  // //       const store = new KarmaFieldsAlpha.Store(driver);
  // //
  // //       const ids = await store.queryIds(paramString);
  // //       const options = [];
  // //
  // //       for (let id of ids) {
  // //
  // //         const array = await store.getValue(id, nameField);
  // //         const value = KarmaFieldsAlpha.Type.toString(array);
  // //
  // //         options.push({
  // //           id: id,
  // //           name: value
  // //         });
  // //
  // //       }
  // //
  // //       resolve(options);
  // //     });
  // //
  // //     cache.set(promise, driver, "expressions", expressionKey);
  // //
  // //   }
  // //
  // //   return promise;
  // // }
  //
  // static async getParam(field, expressionKey) {
  //   const key = await this.resolve(field, expressionKey);
  //   return KarmaFieldsAlpha.Nav.get(key);
  // }
  //
  // static async params(field, ...keys) {
  //   keys = await this.resolveAll(field, keys);
  //   const params = Object.fromEntries(keys.map(key => [key, KarmaFieldsAlpha.Nav.get(key)]).filter(entry => entry[1]));
  //   return Object.entries(params).map(entry => entry.join("=")).join("&");
  // }
  //
  // static async modified(field, ...expressionPath) {
  //   const path = await this.resolveAll(field, expressionPath);
  //   const response = await field.request("modified", {}, ...path);
  //   return KarmaFieldsAlpha.Type.toBoolean(response);
  // }
  //
  // // static async dispatch(field, action, type = "string", params = {}) {
  // //   action = await this.resolve(field, action);
  // //   params = await this.resolve(field, params);
  // //
  // //   const request = await field.dispatch({
  // //     action: action,
  // //     ...params
  // //   });
  // //
  // //   return KarmaFieldsAlpha.Type.convert(request.data, type);
  // // }
  //
  // static async request(field, action, type = "string", params = {}, ...path) {
  //   action = await this.resolve(field, action);
  //   params = await this.resolve(field, params);
  //   path = await this.resolveAll(field, path);
  //
  //   const response = await field.request(action, params, ...path);
  //
  //   return KarmaFieldsAlpha.Type.convert(response, type);
  // }
  //
  // static async set(field, value, ...path) {
  //   value = await this.resolve(field, value);
  //   path = await this.resolveAll(field, path);
  //
  //   await field.request("set", {data: value}, ...path);
  //
  //   // const array = KarmaFieldsAlpha.Type.toArray(value);
  //   //
  //   // const request = await field.request("get", {}, ...path);
  //   //
  //   // if (KarmaFieldsAlpha.DeepObject.differ(request.data, array)) {
  //   //
  //   //   await field.request("set", {
  //   //     data: array,
  //   //   }, ...path);
  //   //
  //   // }
  //   // await this.setArray(field, array, ...path);
  // }
  //
  // static async setParam(field, value, key) {
  //   key = await this.resolve(field, key);
  //   value = await this.resolve(field, value);
  //   // KarmaFieldsAlpha.Nav.set(value, key);
  //   KarmaFieldsAlpha.Nav.change(value, undefined, key);
  // }
  //
  //
  // // static array(field, array) {
  // //   return array;
  // // }
  //
  // // static async map(field, expressionArray, expression) {
  // //   const array = this.resolve(field, expressionArray);
  // //   const output = [];
  // //   for (let item of array) {
  // //     output.push(await this.resolve(field, expression));
  // //   }
  // //   return output;
  // //
  // //
  // //   Promise.all(array.map(item => this.resolve(field, [expressionitem])))
  // //
  // //
  // // }
  //
  // static async map(field, array, replacement) {
  //
  //   array = await this.resolve(field, array);
  //
  //   const output = [];
  //
  //   for (let value of array) {
  //
  //     field.loopItem = value;
  //
  //     const item = await this.object(field, replacement);
  //
  //     output.push(item);
  //
  //   }
  //
  //   return output;
  // }
  //
  //
  // // static async mapIds(field, array, driver, paramString, joins, relKey = 'name') {
  //
  // //   array = await this.resolve(field, array);
  //
  // //   // driver = await this.resolve(field, driver);
  // //   // paramString = await this.resolve(field, paramString);
  //
  // //   if (typeof paramString === "object") {
  // //     KarmaFieldsAlpha.Params.stringify(paramString);
  // //   }
  //
  // //   const form = new KarmaFieldsAlpha.field.form({
  // //     driver: driver,
  // //     joins: joins
  // //   });
  //
  // //   const output = [];
  //
  // //   for (let id of array) {
  //
  // //     output.push(await form.query(id, relKey));
  //
  // //   }
  //
  // //   return output;
  // // }
  //
  //
  //
  // // compat
  // static async loop(field, expression, wildcard, replacementExpression, glue = "") {
  //
  //   // const array = await this.resolve(field, expression);
  //   //
  //   // const output = [];
  //   //
  //   // const replaceDeep = (expression, wildcard, replacement) => {
  //   //   if (Array.isArray(expression)) {
  //   //     return expression.map(item => replaceDeep(item, wildcard, replacement));
  //   //   } else if (expression === wildcard) {
  //   //     return replacement;
  //   //   } else {
  //   //     return expression;
  //   //   }
  //   // }
  //   //
  //   // for (let value of array) {
  //   //
  //   //   const replacement = replaceDeep(replacementExpression, wilcard, value);
  //   //
  //   //   const item = await this.resolve(field, replacement);
  //   //
  //   //   output.push(item);
  //   //
  //   // }
  //   //
  //   // return output.join(glue);
  //
  //   const array = await this.map(field, expression, wildcard, replacementExpression);
  //   return array.join(glue);
  // }
  //
  // static async concat(field, ...values) {
  //   // return values.reduce((array, item) => {
  //   //   const value = await this.resolve(field, item);
  //   //   if (Array.isArray(value)) {
  //   //     array.push(...value);
  //   //   } else {
  //   //     array.push(value);
  //   //   }
  //   //   return array;
  //   // }, []);
  //
  //   values = await this.resolveAll(field, values);
  //
  //   return values.reduce((array, value) => {
  //     if (Array.isArray(value)) {
  //       array.push(...value);
  //     } else {
  //       array.push(value);
  //     }
  //     return array;
  //   }, []);
  //
  //   // return values.reduce((array, value) => Array.isArray(value) ? [...array, ...value] : [...array, value], []);
  //
  //   // return Promise.all(values.map(item => this.resolve(field, item))).reduce((array, value) => {
  //   //   if (Array.isArray(value)) {
  //   //     array.push(...value);
  //   //   } else {
  //   //     array.push(value);
  //   //   }
  //   //   return array;
  //   // }, []);
  // }
  //
  // static raw(field, ...value) {
  //   return value;
  // }
  //
  // static async object(field, value) {
  //   if (value && value.constructor === Object) {
  //     const object = {};
  //     for (let i in value) {
  //       object[i] = await this.resolve(field, value[i]);
  //     }
  //     return object;
  //   }
  //   return this.resolve(field, value);
  // }
  //
  // static async getChild(field, value, ...path) {
  //   value = await this.resolve(field, value);
  //   path = await this.resolveAll(field, path);
  //   return KarmaFieldsAlpha.DeepObject.get(value, ...path);
  // }
  //
  // static async item(field, ...path) {
  //   path = await this.resolveAll(field, path);
  //   return KarmaFieldsAlpha.DeepObject.get(field.loopItem, ...path);
  // }
  //
  // static async convert(field, value, type) {
  //   value = await this.resolve(field, value);
  //   return KarmaFieldsAlpha.Type.convert(value, type);
  // }
  //
  //
  //
  //
  //
  //
  //
  // static async count(field, array) {
  //   array = await this.resolve(field, array);
  //   return array.length;
  // }
  //
  // static async empty(field, array) {
  //   array = await this.resolve(field, array);
  //   return array.length === 0;
  // }
  //
  // static async actives(field) {
  //   return await field.request("actives");
  // }
  //
  // static async selection(field) {
  //   return await field.request("selection");
  // }
  //
  //
  //
  //
  // static async taxonomy(field, taxonomy) {
  //   // return this.resolve(field, [
	// 	// 	"<ul>##</ul>",
	// 	// 	"replace",
	// 	// 	"##",
	// 	// 	[
	// 	// 		"loop",
  //   //     ["getArray", taxonomy],
	// 	// 		"%%",
	// 	// 		[
	// 	// 			"<li><a hash=\"driver=taxonomy&taxonomy=##\">##</a></li>",
	// 	// 			"replace",
	// 	// 			"##",
  //   //       taxonomy
	// 	// 			["query", "taxonomy?taxonomy=category", "%%", "name"]
	// 	// 		]
	// 	// 	]
	// 	// ]);
  //
  //   return this.resolve(field, [
  //     "replace",
	// 		"<ul>#</ul>",
	// 		"#",
	// 		[
  //       "js",
	// 			"join",
  //       [
  //         "map",
  //         ["get", "array", taxonomy],
  //         [
  //           "replace",
  //           "<li><a hash=\"driver=taxonomy&taxonomy=#\">#</a></li>",
  //           "#",
  //           ["item"],
  //           [
  //             "query",
  //             "taxonomy",
  //             ["replace", "taxonomy=#", "#", taxonomy],
  //             [],
  //             "string",
  //             ["item"],
  //             "name"
  //           ]
  //         ]
  //       ],
  //       ""
	// 		]
	// 	]);
  // }
  //
  //
  // static async geocoding(field, value) {
  //   const url = "https://www.mapquestapi.com/geocoding/v1/address?key=KEY&location="+value+",CH";
  //   const response = await fetch(url).then(response => response.json());
  //
  //   if (response.results && response.results[0] && response.results[0].locations && response.results[0].locations.length) {
  //     const locations = response.results[0].locations;
  //     const location = locations.find(location => value.includes(location.adminArea5)) || locations[0];
  //     const latLng = location.latLng;
  //     return latLng.lat+", "+latLng.lng; // + " ("+response.results.length+"/"+response.results[0].locations.length+")";
  //   }
  //   return "?";
  // }


}
