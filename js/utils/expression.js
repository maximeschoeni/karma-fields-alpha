
// KarmaFieldsAlpha.Expression = class {

  // static compare(operator, v1, v2) {
  //
  //   const response = new KarmaFieldsAlpha.Content();
  //
  //   if (v1.loading || v2.loading) {
  //
  //     response.loading = true;
  //
  //   } else {
  //
  //     switch (operator) {
  //
  //       case "=":
  //       case "==":
  //         response.value = v1.toSingle() == v2.toSingle();
  //         break;
  //
  //       case "===":
  //         response.value = v1.toSingle() === v2.toSingle();
  //         break;
  //
  //       case "!=":
  //         response.value = v1.toSingle() != v2.toSingle();
  //         break;
  //
  //       case "!==":
  //         response.value = v1.toSingle() !== v2.toSingle();
  //         break;
  //
  //       case ">":
  //         response.value = v1.toSingle() > v2.toSingle();
  //         break;
  //
  //       case "<":
  //         response.value = v1.toSingle() < v2.toSingle();
  //         break;
  //
  //       case ">=":
  //         response.value = v1.toSingle() >= v2.toSingle();
  //         break;
  //
  //       case "<=":
  //         response.value = v1.toSingle() <= v2.toSingle();
  //         break;
  //
  //       case "like":
  //         response.value = v1.toString().match(new RegExp(v2.toString()));
  //         break;
  //
  //       case "+":
  //         response.value = v1.toNumber() + v2.toNumber();
  //         break;
  //
  //       case "-":
  //         response.value = v1.toNumber() - v2.toNumber();
  //         break;
  //       case "*":
  //         response.value = v1.toNumber() * v2.toNumber();
  //         break;
  //
  //       case "/":
  //         response.value = v1.toNumber() / v2.toNumber();
  //         break;
  //
  //       case "%":
  //         response.value = v1.toNumber() % v2.toNumber();
  //         break;
  //
  //     }
  //
  //   }
  //
  //   return response;
  // }

  // static logic(operator, ...values) {
  //
  //   const response = new KarmaFieldsAlpha.Content();
  //
  //   if (values.some(value => value.loading)) {
  //
  //     response.loading = true;
  //
  //   } else {
  //
  //     response.value = values.shift().toSingle();
  //
  //     while (values.length) {
  //
  //       const value = values.shift();
  //
  //       switch (operator) {
  //
  //         case "&&":
  //           response.value = response.toSingle() && value.toSingle();
  //           break;
  //
  //         case "||":
  //           response.value = response.toSingle() || value.toSingle();
  //           break;
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //
  //   return response;
  // }
  //
  // static not(operator, value) {
  //
  //   const response = new KarmaFieldsAlpha.Content();
  //
  //   if (value.loading) {
  //
  //     response.loading = true;
  //
  //   } else {
  //
  //     response.value = !value.toBoolean();
  //
  //   }
  //
  //   return response;
  // }
  //
  // static condition(operator, v1, v2, v3) {
  //
  //   const response = new KarmaFieldsAlpha.Content();
  //
  //   if (v1.loading || v2.loading || v2.loading) {
  //
  //     response.loading = true;
  //
  //   } else {
  //
  //   }
  //
  // }

  // async parse(expression) {
  //
  //   let response = new KarmaFieldsAlpha.Content();
  //   //
  //   // const params = await Promise.all(expression.slice(1).map(param => this.parse(param)));
  //   //
  //   // if (params.some(param => param.loading)) {
  //   //
  //   //   response.loading = true;
  //   //
  //   // } else {
  //
  //   if (expression) {
  //
  //     switch (expression[0]) {
  //
  //       case "=":
  //       case "==":
  //       case "===":
  //       case "!=":
  //       case "!==":
  //       case ">":
  //       case "<":
  //       case ">=":
  //       case "<=":
  //       case "like":
  //       case "+":
  //       case "-":
  //       case "*":
  //       case "/":
  //       case "%":
  //         const v1 = await this.parse(expression[1]);
  //         const v2 = await this.parse(expression[2]);
  //         // response = KarmaFieldsAlpha.Expression.compare(expression[0], v1, v2);
  //         if (v1.loading || v2.loading) {
  //           response.loading = true;
  //         } else {
  //           switch (operator) {
  //             case "=":
  //             case "==":
  //               response.value = v1.toSingle() == v2.toSingle();
  //               break;
  //             case "===":
  //               response.value = v1.toSingle() === v2.toSingle();
  //               break;
  //             case "!=":
  //               response.value = v1.toSingle() != v2.toSingle();
  //               break;
  //             case "!==":
  //               response.value = v1.toSingle() !== v2.toSingle();
  //               break;
  //             case ">":
  //               response.value = v1.toSingle() > v2.toSingle();
  //               break;
  //             case "<":
  //               response.value = v1.toSingle() < v2.toSingle();
  //               break;
  //             case ">=":
  //               response.value = v1.toSingle() >= v2.toSingle();
  //               break;
  //             case "<=":
  //               response.value = v1.toSingle() <= v2.toSingle();
  //               break;
  //             case "like":
  //               response.value = v1.toString().match(new RegExp(v2.toString()));
  //               break;
  //             case "+":
  //               response.value = v1.toNumber() + v2.toNumber();
  //               break;
  //             case "-":
  //               response.value = v1.toNumber() - v2.toNumber();
  //               break;
  //             case "*":
  //               response.value = v1.toNumber() * v2.toNumber();
  //               break;
  //             case "/":
  //               response.value = v1.toNumber() / v2.toNumber();
  //               break;
  //             case "%":
  //               response.value = v1.toNumber() % v2.toNumber();
  //               break;
  //           }
  //         }
  //         break;
  //       case "&&":
  //         const values = expression.slice(1);
  //         response = await this.parse(values.shift());
  //         if (!response.loading && values.length && response.toBoolean()) {
  //           response = this.parse(["&&", ...values]);
  //         }
  //         break;
  //       case "||":
  //         const values = expression.slice(1);
  //         response = await this.parse(values.shift());
  //         if (!response.loading && values.length && !response.toBoolean()) {
  //           response = this.parse(["||", ...values]);
  //         }
  //         break;
  //       case "!":
  //         const value = await this.parse(expression[1]);
  //         if (value.loading) {
  //           response.loading = true;
  //         } else {
  //           response.value = !value.toBoolean();
  //         }
  //         break;
  //
  //       case "?":
  //         const condition = await this.parse(expression[1]);
  //         if (condition.loading) {
  //           response.loading = true;
  //         } else {
  //           response = condition.toBoolean() ? this.parse(expression[2]) : this.parse(expression[3]);
  //         }
  //         break;
  //       case "...":
  //       case "concat":
  //         const items = await Promise.all(expression.slice(1).map(item => this.parse(item)));
  //         if (items.some(item => item.loading)) {
  //           response.loading = true;
  //         } else {
  //           response.value = items.reduce((array, item) => [...array, ...item.toArray()], []);
  //         }
  //         break;
  //       case "math":
  //         const method = expression[1];
  //         const values = await Promise.all(expression.slice(2).map(value => this.parse(value)));
  //         if (values.some(value => value.loading)) {
  //           response.loading = true;
  //         } else if (Math[expression[1]]) {
  //           response.value = Math[expression[1]](...values.map(value => value.toNumber()));
  //         }
  //         break;
  //       case "include":
  //         const array = await this.parse(expression[1]);
  //         const value = await this.parse(expression[2]);
  //         if (array.loading || value.loading) {
  //           response.loading = true;
  //         } else {
  //           response.value = array.toArray().include(value.toSingle());
  //         }
  //         break;
  //       case "replace":
  //         const string = await this.parse(expression[1]);
  //         const wildcard = expression[2];
  //         const replacements = await Promise.all(expression.slice(3).map(replacement => this.parse(replacement)));
  //         if (string.loading || replacements.some(value => value.loading)) {
  //           response.loading = true;
  //         } else if (replacements.length) {
  //           const grid = replacements.map(replacement => replacement.toArray());
  //           response.value = grid[0].map((item, i) => grid.reduce((string, replacements) => string.replace(wildcard, replacements[i]), string.toString()));
  //         }
  //         break;
  //       case "date":
  //         const date = await this.parse(expression[1]);
  //         const option = expression[2] || {}; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
  //         const locale = expression[3] || KarmaFieldsAlpha.locale || "en";
  //         if (date.loading) {
  //           response.loading = true;
  //         } else {
  //           const string = date.toString();
  //           if (!string || string === "now") {
  //             response.value = (new Date()).toLocaleDateString(locale, option);
  //           } else {
  //             const dateObj = new Date(string);
  //             if (isNaN(dateObj)) {
  //               response.value = "";
  //             } else {
  //               response.value = dateObj.toLocaleDateString(locale, option);
  //             }
  //           }
  //         }
  //         break;
  //       case "year":
  //         // response = this.parse(["date", expression[1] || "", {year: expression[2] || "numeric"}]);
  //         // break;
  //       case "month":
  //       case "day":
  //         console.error("DEPRECATED (use date)");
  //         break;
  //       case "request":
  //         var params = await Promise.all(expression.slice(1).map(param => this.parse(param)));
  //         if (params.some(param => param.loading)) {
  //           response.loading = true;
  //         } else {
  //           response = this.request(...params.map(param => param.value));
  //         }
  //         break;
  //       case "getValue": // compat
  //       case "getContent":
  //         // var params = await Promise.all(expression.slice(1).map(param => this.parse(param)));
  //         // if (params.some(param => param.loading)) {
  //         //   response.loading = true;
  //         // } else {
  //         //   response = this.getContent(...params.map(param => param.toString()));
  //         // }
  //         if (expression[1]) {
  //           const key = await this.parse(expression[1]);
  //           response = this.getContent(key.toString());
  //         } else {
  //           response = this.getContent();
  //         }
  //         break;
  //       case "queryValue":
  //         const driver = await this.parse(expression[1]);
  //         const id = await this.parse(expression[2]);
  //         const key = await this.parse(expression[3]);
  //         if (driver.loading || id.loading || key.loading) {
  //           response.loading = true;
  //         } else if (driver.toString() && id.toString() && key.toString()) {
  //           const form = new KarmaFieldsAlpha.field.form({
  //             driver: driver.toString()
  //           });
  //           response = form.getValueById(id.toString(), key.toString());
  //         }
  //         break;
  //       case "query":
  //         const driver = await this.parse(expression[1]);
  //         const params = await this.parseObject(expression[2]);
  //         const output = expression[3] || "ids";
  //         if (driver.loading || params.loading) {
  //           response.loading = true;
  //         } else {
  //           const table = new KarmaFieldsAlpha.field.table({
  //             driver: driver.toString(),
  //             params: params.toObject()
  //           });
  //           if (output === "count") {
  //             response = table.getCount();
  //           } else if (output === "options") {
  //             response = table.getOptionsList();
  //           } else {
  //             response = table.getIds();
  //           }
  //         }
  //         break;
  //       case "queryCount":
  //         response = this.parse(["query", expression[1], expression[2], "count"]);
  //         // console.warn("Deprecated. Use query");
  //         // const driver = await this.parse(expression[1]);
  //         // const params = await this.parseObject(expression[2]);
  //         // if (driver.loading || params.loading) {
  //         //   response.loading = true;
  //         // } else {
  //         //   const table = new KarmaFieldsAlpha.field.table({
  //         //     driver: driver.toString(),
  //         //     params: params.toObject()
  //         //   });
  //         //   response = table.getCount();
  //         // }
  //         break;
  //       case "parseParams":
  //         console.error("DEPRECATED");
  //         break;
  //       case "getOptions":
  //         response = this.parse(["query", expression[1], expression[2], "options"]);
  //         // console.warn("Deprecated. Use query");
  //         // const driver = await this.parse(expression[1]);
  //         // const params = await this.parseObject(expression[2]);
  //         // if (driver.loading || params.loading) {
  //         //   response.loading = true;
  //         // } else {
  //         //   const table = new KarmaFieldsAlpha.field.table({
  //         //     driver: driver.toString(),
  //         //     params: params.toObject()
  //         //   });
  //         //   response = table.getOptionsList();
  //         // }
  //         break;
  //       case "map":
  //         const array = await this.parse(expression[1]);
  //         if (array.loading) {
  //           response.loading = true;
  //         } else {
  //           response.value = await Promise.all(array.toArray().map(value => {
  //             const mapItem = new KarmaFieldsAlpha.Expression.MapItem(value, this);
  //             const result = KarmaFieldsAlpha.Expression.prototype.parse.call(mapItem, expression[2]);
  //           }));
  //           response.loading = response.value.some(value => value.loading);
  //         }
  //         break;
  //       case "getItem":
  //         console.error("deprecated");
  //         break;
  //       case "join":
  //         const array = await this.parse(expression[1]);
  //         const glue = expression[2] || ", ";
  //         if (array.loading) {
  //           response.loading = true;
  //         } else {
  //           response.value = array.toArray().join(glue);
  //         }
  //         break;
  //       case "indexOf":
  //         console.error("deprecated");
  //         break;
  //       case "sum":
  //         const array = await this.parse(expression[1]);
  //         if (array.loading) {
  //           response.loading = true;
  //         } else {
  //           response.value = array.toArray().reduce((accumulator, item)=> accumulator + Number(item), 0);
  //         }
  //         break;
  //       case "getLength":
  //       case "count":
  //         const array = await this.parse(expression[1]);
  //         if (array.loading) {
  //           response.loading = true;
  //         } else {
  //           response.value = array.toArray().length;
  //         }
  //         break;
  //       case "getParam":
  //         var key = await this.parse(expression[1]);
  //         if (key.loading) {
  //           response.loading = true;
  //         } else {
  //           response = this.getParam(key.toString());
  //         }
  //         break;
  //       case "isLoading":
  //         const content = await this.parse(expression[1]);
  //         response.value = content.loading;
  //         break;
  //       case "isMixed":
  //         const content = await this.parse(expression[1]);
  //         response.value = content.mixed;
  //         break;
  //       case "getKey":
  //       case "getIndex":// deprec
  //       case "getIds":
  //       case "get":
  //       case "getAt":
  //       case "array":
  //         console.error("deprecated");
  //         break;
  //
  //       case "debug":
  //       case "dump":
  //       case "log":
  //         debugger;
  //         response = await this.parse(expression[1]);
  //         break;
  //       case "max":
  //         const array = await this.parse(expression[1]);
  //         if (array.loading) {
  //           response.loading = true;
  //         } else {
  //           response.value = array.toArray().reduce((accumulator, item) => Math.max(accumulator, Number(item)), 0);
  //         }
  //         break;
  //       case "min":
  //         const array = await this.parse(expression[1]);
  //         if (array.loading) {
  //           response.loading = true;
  //         } else {
  //           response.value = array.toArray().reduce((accumulator, item) => Math.min(accumulator, Number(item)), Infinity);
  //         }
  //         break;
  //       case "resource":
  //         console.error("deprecated. Use request");
  //         break;
  //       case "parent":
  //         response = this.parent.parse(expression);
  //         break;
  //
  //       default:
  //         response.value = expression;
  //         break;
  //
  //     }
  //
  //   } else {
  //
  //     response.value = expression;
  //
  //   }
  //
  //   return response;
  //
  //
  // }
  //
  // async parseObject(object) {
  //
  //   const response = new KarmaFieldsAlpha.Content();
  //
  //   let entries = Object.entries(object);
  //
  //   entries = await Promise.all(entries.map(([key, value]) => [key, this.parse(value)]));
  //
  //   if (entries.some(([key, value]) => value.loading)) {
  //
  //     response.loading = true;
  //
  //   } else {
  //
  //     entries = entries.map(([key, value]) => [key, value.toString()]);
  //
  //     response.value = Object.fromEntries(entries);
  //
  //   }
  //
  //   return response;
  // }


// }
//
//
// // KarmaFieldsAlpha.Expression.MapItem = class extends KarmaFieldsAlpha.Expression {
//
KarmaFieldsAlpha.Expression = class extends KarmaFieldsAlpha.field {

  constructor(value, parent) {

    super(value, "", parent);

    // this.value = value;
    // this.parent = parent;

  }

  getContent(key) {

    const response = new KarmaFieldsAlpha.Content();

    if (key) {

      response.value = this.resource[key];

    } else {

      response.value = this.resource;

    }

    return response;

  }

}

//
// KarmaFieldsAlpha.Expression = class extends KarmaFieldsAlpha.Content {
//
//   // static parse(expression, field) {
//   //
//   //   return new KarmaFieldsAlpha.Expression(expression, field);
//   //
//   // }
//   //
//   // static parseObject(object, field) {
//   //
//   //   let entries = Object.entries(object);
//   //
//   //   entries = entries.map(([key, value]) => [key, new KarmaFieldsAlpha.Expression(value, this.field)]);
//   //
//   //   if (entries.some(([value, value]) => value.loading)) {
//   //
//   //     return new KarmaFieldsAlpha.LoadingContent();
//   //
//   //   }
//   //
//   //   entries = entries.map(([key, value]) => [key, value.toString()]);
//   //
//   //   const result = Object.fromEntries(entries);
//   //
//   //   return new KarmaFieldsAlpha.Content(result);
//   //
//   // }
//
//   constructor(expression, field) {
//
//     super(expression);
//
//     this.field = field;
//
//     if (expression && typeof expression === "object") {
//
//       if (Array.isArray(expression)) {
//
//         this.parse(expression);
//
//       } else {
//
//         this.parseObject(expression);
//
//       }
//
//     }
//
//     if (this.value instanceof KarmaFieldsAlpha.Content) {
//
//       Object.assign(this, this.value);
//
//     }
//
//   }
//
//   parseObject(object) {
//
//     let entries = Object.entries(object);
//
//     entries = entries.map(([key, value]) => [key, new KarmaFieldsAlpha.Expression(value, this.field)]);
//
//     if (entries.some(([key, value]) => value.loading)) {
//
//       this.loading = true;
//
//     } else {
//
//       entries = entries.map(([key, value]) => [key, value.toString()]);
//
//       this.value = Object.fromEntries(entries);
//
//     }
//
//   }
//
//   parse(args) {
//
//     switch (args[0]) {
//       case "=":
//       case "==":
//       case "===":
//       case "!=":
//       case "!==":
//       case ">":
//       case "<":
//       case ">=":
//       case "<=":
//       case "like":
//         this.compare(...args);
//         break;
//
//       case "+":
//       case "-":
//       case "*":
//       case "/":
//       case "%":
//         this.compute(...args);
//         break;
//
//       case "&&":
//       case "||":
//         this.logic(...args);
//         break;
//
//       case "!":
//         this.not(...args);
//         break;
//
//       case "?":
//         this.condition(...args);
//         break;
//
//       case "...":
//         this.concat(...args);
//         break;
//
//       case "concat":
//       case "math":
//       case "include":
//       case "replace":
//       case "date":
//       case "year":
//       case "month":
//       case "day":
//       case "request":
//       case "getValue": // compat
//       case "getContent":
//       // case "hasValue":
//       case "queryValue":
//       case "query":
//       case "queryCount":
//       case "parseParams":
//       case "getOptions":
//       case "map":
//       case "getItem":
//       case "join":
//       case "indexOf":
//       case "sum":
//       case "getLength":
//       case "count":
//       case "getParam":
//       case "isLoading":
//       case "isMixed":
//       case "getKey":
//       case "getIndex":// deprec
//       case "getIds":
//       case "get":
//       case "getAt":
//       case "array":
//       case "debug":
//       case "dump":
//       case "log":
//       case "max":
//       case "min":
//       case "resource":
//       case "parent":
//         this[args[0]](...args);
//         break;
//
//       // case "set":
//       case "submit":
//       // case "add":
//       // case "delete":
//         // this.doTask(...args);
//         this.task = true;
//         this.value = this[args[0]](...args);
//
//         break;
//
//     }
//
//   }
//
//   parent(...args) {
//
//     this.field = this.field.parent;
//
//     this.parse(args[1]);
//
//   }
//
//   debug(...args) {
//
//     debugger;
//
//     const expr = new KarmaFieldsAlpha.Expression(args[1], this.field);
//
//     this.value = expr.value;
//     this.loading = expr.loading;
//
//   }
//
//   log(...args) {
//
//     const expr = new KarmaFieldsAlpha.Expression(args[1], this.field);
//     console.log(expr);
//     // console.trace();
//
//     this.value = expr.value;
//     this.loading = expr.loading;
//
//     // console.log(args.slice(1).forEach(expr => new KarmaFieldsAlpha.Expression(expr, this.field).toObject()));
//
//   }
//
//   dump(...args) {
//
//     const expr = new KarmaFieldsAlpha.Expression(args[1], this.field);
//
//     this.value = JSON.stringify(expr.value);
//
//   }
//
//   compute(...args) {
//
//     const v1 = new KarmaFieldsAlpha.Expression(args[1], this.field);
//     const v2 = new KarmaFieldsAlpha.Expression(args[2], this.field);
//
//     if (v1.loading || v2.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       switch (args[0]) {
//
//         case "+":
//           this.value = await v1.toNumber() + await v2.toNumber();
//           break;
//
//         case "-":
//           this.value = await v1.toNumber() - await v2.toNumber();
//           break;
//         case "*":
//           this.value = await v1.toNumber() * await v2.toNumber();
//           break;
//
//         case "/":
//           this.value = await v1.toNumber() / await v2.toNumber();
//           break;
//
//       }
//
//     }
//
//   }
//
//   compare(...args) {
//
//     const v1 = new KarmaFieldsAlpha.Expression(args[1], this.field);
//     const v2 = new KarmaFieldsAlpha.Expression(args[2], this.field);
//
//     if (v1.loading || v2.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = Promise.all([v1.toSingle(), v2.toSingle()]).then(([v1, v2]) => {
//
//         switch (args[0]) {
//
//           case "=":
//           case "==":
//             return v1 == v2;
//             break;
//
//           case "===":
//             return v1 === v2;
//             break;
//
//           case "!=":
//             return v1 != v2;
//             break;
//
//           case "!==":
//             return v1 !== v2;
//             break;
//
//           case ">":
//             return v1 > v2;
//             break;
//
//           case "<":
//             return v1 < v2;
//             break;
//
//           case ">=":
//             return v1 >= v2;
//             break;
//
//           case "<=":
//             return v1 <= v2;
//             break;
//
//           case "like":
//             return v1.toString().match(new RegExp(v2));
//             break;
//
//         }
//
//       });
//
//     }
//
//   }
//
//   logic(...args) {
//
//     const values = args.slice(1).map(value => new KarmaFieldsAlpha.Expression(value, this.field));
//
//     if (values.some(value => value.loading)) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = values.shift().toSingle();
//
//       while (values.length) {
//
//         const value = values.shift();
//
//         switch (args[0]) {
//
//           case "&&":
//             this.value = this.toSingle() && value.toSingle();
//             break;
//
//           case "||":
//             this.value = this.toSingle() || value.toSingle();
//             break;
//
//         }
//
//       }
//
//     }
//
//   }
//
//   math(...args) {
//
//     const values = args.slice(2).map(value => new KarmaFieldsAlpha.Expression(value, this.field));
//
//     if (values.some(value => value.loading)) {
//
//       this.loading = true;
//
//     } else if (Math[args[1]]) {
//
//       this.value = Math[args[1]](...values.map(value => value.toNumber()));
//
//     }
//
//   }
//
//   not(...args) {
//
//     const value = new KarmaFieldsAlpha.Expression(args[1], this.field);
//
//     if (value.loading) {
//
//       this.loading = true;
//
//     }
//
//     this.value = !value.toBoolean();
//
//   }
//
//   condition(...args) {
//
//     const v1 = new KarmaFieldsAlpha.Expression(args[1], this.field);
//
//     if (v1.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = v1.toBoolean() ? new KarmaFieldsAlpha.Expression(args[2], this.field) : new KarmaFieldsAlpha.Expression(args[3], this.field);
//
//     }
//
//   }
//
//   concat(...args) {
//
//     const array = args.slice(1).map(value => new KarmaFieldsAlpha.Expression(value, this.field));
//
//     if (array.some(array => array.loading)) {
//
//       this.loading = true;
//
//     } else {
//
//       // this.value = [].concat(...arrays.toArray());
//       this.value = array.reduce((array, content) => [...array, ...content.toArray()], []);
//
//     }
//
//   }
//
//   join(...args) {
//
//     const array = new KarmaFieldsAlpha.Expression(args[1], this.field);
//     const glue = args[2] || ", ";
//
//     if (array.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = array.toArray().join(glue);
//
//     }
//
//   }
//
//   indexOf(...args) {
//
//     const array = new KarmaFieldsAlpha.Expression(args[1], this.field);
//     const value = new KarmaFieldsAlpha.Expression(args[2], this.field);
//
//     if (array.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = array.toArray().indexOf(value.toSingle());
//
//     }
//
//   }
//
//   sum(...args) {
//
//     const array = new KarmaFieldsAlpha.Expression(args[1], this.field);
//
//     if (array.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = array.toArray().reduce((accumulator, item)=> accumulator + Number(item), 0);
//
//     }
//
//   }
//
//
//   min(...args) {
//
//     const array = new KarmaFieldsAlpha.Expression(args[1], this.field);
//
//     if (array.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = array.toArray().reduce((accumulator, item) => Math.min(accumulator, Number(item)), Infinity);
//
//     }
//
//   }
//
//   max(...args) {
//
//     const array = new KarmaFieldsAlpha.Expression(args[1], this.field);
//
//     if (array.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = array.toArray().reduce((accumulator, item) => Math.max(accumulator, Number(item)), 0);
//
//     }
//
//   }
//
//   include(...args) {
//
//     const array = new KarmaFieldsAlpha.Expression(args[1], this.field);
//     const value = new KarmaFieldsAlpha.Expression(args[2], this.field);
//
//     if (array.loading || value.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = array.toArray().include(value.toSingle());
//
//     }
//
//   }
//
//   count(...args) {
//
//     this.getLength(...args);
//
//   }
//
//   getLength(...args) {
//
//     const array = new KarmaFieldsAlpha.Expression(args[1], this.field);
//
//     if (array.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = array.toArray().length;
//
//     }
//
//   }
//
//   map(...args) {
//
//     const array = new KarmaFieldsAlpha.Expression(args[1], this.field);
//
//     if (array.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = array.toArray().map(value => {
//
//         if (args[2]) {
//
//           this.field.expressionCurrentItem = value;
//
//           return new KarmaFieldsAlpha.Expression(args[2], this.field);
//
//         }
//
//         return new KarmaFieldsAlpha.Content(value);
//
//       });
//
//       this.loading = this.value.some(value => value.loading);
//
//       if (!this.loading) {
//
//         // this.value = this.value.map(value => value.toString());
//         this.value = this.value.map(value => value.toSingle());
//
//       }
//
//     }
//
//   }
//
//   getItem(...args) {
//
//     this.value = KarmaFieldsAlpha.DeepObject.get(this.field.expressionCurrentItem, ...args.slice(1));
//
//   }
//
//   getItemAt(...args) {
//
//     const array = new KarmaFieldsAlpha.Expression(args[1], this.field);
//     const index = new KarmaFieldsAlpha.Expression(args[2], this.field);
//
//     if (array.loading || index.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = array[index];
//
//     }
//
//   }
//
//   get(...args) {
//
//     const object = new KarmaFieldsAlpha.Expression(args[1], this.field);
//
//     if (object.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = KarmaFieldsAlpha.DeepObject.get(object.toObject(), ...args.slice(2));
//
//     }
//
//   }
//
//   getAt(...args) {
//
//     const array = new KarmaFieldsAlpha.Expression(args[1], this.field);
//     const index = new KarmaFieldsAlpha.Expression(args[2], this.field);
//
//     if (array.loading || index.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = array.toArray()[index.toNumber()];
//
//     }
//
//   }
//
//   year(...args) {
//
//     if (args[1]) {
//
//       this.date(...args, {year: 'numeric'}, args[2]);
//
//     } else {
//
//       this.value = new Date().getFullYear();
//
//     }
//
//   }
//
//   month(...args) {
//
//     if (args[1]) {
//
//       this.date(...args, {month: '2-digit'}, args[2])
//
//     } else {
//
//       // this.value = new Date().getMonth() + 1;
//       this.value = new Date().toLocaleDateString(KarmaFieldsAlpha.locale, {month: "2-digit"});
//
//     }
//
//   }
//
//   day(...args) {
//
//     if (args[1]) {
//
//       this.date(...args, {day: '2-digit'}, args[2])
//
//     } else {
//
//       // this.value = new Date().getDate();
//       this.value = new Date().toLocaleDateString(KarmaFieldsAlpha.locale, {day: "2-digit"});
//
//     }
//
//   }
//
//   // now(...args) {
//   //
//   //   const date = new Date();
//   //
//   //   switch (args[1]) {
//   //
//   //     case "year":
//   //       this.value = date.getFullYear();
//   //       break;
//   //
//   //     case "month":
//   //       this.value = date.getMonth() + 1;
//   //       break;
//   //
//   //     case "day":
//   //       this.value = date.getDate();
//   //       break;
//   //
//   //     case "hour":
//   //       this.value = date.getHours();
//   //       break;
//   //
//   //     case "minute":
//   //       this.value = date.getMinutes();
//   //       break;
//   //
//   //     case "second":
//   //       this.value = date.getSeconds();
//   //       break;
//   //
//   //     default:
//   //       this.value = date;
//   //       break;
//   //
//   //   }
//   //
//   // }
//
//   date(...args) {
//
//     const dateString = new KarmaFieldsAlpha.Expression(args[1], this.field);
//     const option = args[2] || {}; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
//     const locale = args[3] || KarmaFieldsAlpha.locale || "en";
//
//     if (dateString.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       const dateObj = new Date(dateString.toObject());
//
//       if (isNaN(dateObj)) {
//
//         this.value = "";
//
//       } else {
//
//         this.value = dateObj.toLocaleDateString(locale, option);
//         // this.value = dateObj.toLocaleString(locale, option);
//
//       }
//
//     }
//
//   }
//
//   getValue(...args) {
//
//     return this.getContent(...args);
//   }
//
//
//   async getContent(...args) {
//
//     const path = args.map(arg => new KarmaFieldsAlpha.Expression(arg, this.field));
//
//     // if (args[1]) {
//     //
//     //   key = new KarmaFieldsAlpha.Expression(args[1], this.field);
//     //
//     // } else {
//     //
//     //   key = this.field.getKey();
//     //
//     // }
//
//     if (key.loading)) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = key.toString().then(key => this.field.parent.getContent(key));
//
//     }
//
//
//
//
//
//     let key = args[1];
//
//     if (key && Array.isArray(key)) {
//
//       key = new KarmaFieldsAlpha.Expression(args[1], this.field);
//
//       if (key.loading) {
//
//         this.loading = true;
//
//         return;
//
//       }
//
//       key = key.toString();
//
//     } else if (!key) {
//
//       key = this.field.getKey();
//
//     }
//
//     const content = this.field.parent.getContent(key);
//
//     if (content.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = content.value;
//
//     }
//
//   }
//
//   queryValue(...args) {
//
//     const driver = new KarmaFieldsAlpha.Expression(args[1], this.field);
//     const id = new KarmaFieldsAlpha.Expression(args[2], this.field);
//     const key = new KarmaFieldsAlpha.Expression(args[3], this.field);
//
//     if (driver.loading || id.loading || key.loading) {
//
//       this.loading = true;
//       this.value = "";
//
//     } else if (driver.toString() && id.toString() && key.toString()) {
//
//       // const content = new KarmaFieldsAlpha.Content.Value(driver.toString(), id.toString(), key.toString());
//
//       // const model = new KarmaFieldsAlpha.Model(driver.toString());
//       //
//       //
//       // // console.log("queryValue", id.toString(), key.toString());
//       //
//       // const content = model.queryValue(id.toString(), key.toString());
//       //
//       // this.value = content.value;
//       // this.loading = content.loading;
//       // this.notFound = content.notFound;
//
//       // const shuttle = KarmaFieldsAlpha.Shuttle.get(driver.toString());
//       // const value = shuttle.getValue(id, key);
//       //
//       // if (value.loading) {
//       //
//       //   this.loading = true;
//       //
//       // } else {
//       //
//       //   this.value = value.value;
//       //
//       // }
//
//
//       const form = new KarmaFieldsAlpha.field.form({
//         driver: driver.toString()
//       });
//
//       const content = form.getValueById(id.toString(), key.toString());
//
//       if (content.loading) {
//
//         this.loading = true;
//
//       } else {
//
//         this.value = content.value;
//
//       }
//
//     } else {
//
//       this.value = undefined;
//
//     }
//
//   }
//
//   queryValues(...params) {
//
//     // const driver = new KarmaFieldsAlpha.Expression(params[1], this.field);
//     // const ids = new KarmaFieldsAlpha.Expression(params[2], this.field);
//     // const key = new KarmaFieldsAlpha.Expression(params[3], this.field);
//     //
//     // if (driver.loading || ids.loading || key.loading) {
//     //
//     //   return new KarmaFieldsAlpha.LoadingContent();
//     //
//     // }
//     //
//     // const values = ids.map(id => KarmaFieldsAlpha.Query.getValue(driver.toString(), id.toString(), key.toString()));
//     //
//     // if (values.some(value => value.loading)) {
//     //
//     //   return new KarmaFieldsAlpha.LoadingContent();
//     //
//     // }
//     //
//     // new KarmaFieldsAlpha.Content(values.reduce((accumulator, items) => [...accumulator, ...items], []));
//
//   }
//
//   query(...args) {
//
//     const driver = new KarmaFieldsAlpha.Expression(args[1], this.field);
//     const params = new KarmaFieldsAlpha.Expression(args[2] || {}, this.field);
//
//     if (driver.loading || params.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       // const paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());
//       // // const query = KarmaFieldsAlpha.Driver.getQuery(driver.toString(), paramstring);
//       //
//       //
//       // const collection = new KarmaFieldsAlpha.Model.Collection(driver.toString(), paramstring);
//       // const query = collection.queryItems();
//       //
//       //
//       // if (query.loading) {
//       //
//       //   this.loading = true;
//       //
//       // } else {
//       //
//       //   this.value = query.value;
//       //
//       // }
//
//
//       // const paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());
//       // const shuttle = KarmaFieldsAlpha.Shuttle.get(driver.toString(), paramstring);
//       // const ids = shuttle.getIds();
//       //
//
//
//       const table = new KarmaFieldsAlpha.field.table({
//         driver: driver.toString(),
//         params: params.toObject()
//       });
//
//       const ids = table.getIds();
//
//       if (ids.loading) {
//
//         this.loading = true;
//
//       } else {
//
//         this.value = ids.toArray();
//
//       }
//
//
//     }
//
//   }
//
//   queryCount(...args) {
//
//     const driver = new KarmaFieldsAlpha.Expression(args[1], this.field);
//     const params = new KarmaFieldsAlpha.Expression(args[2] || {}, this.field);
//
//     if (params.loading || driver.loading) {
//
//       this.loading;
//
//     } else {
//
//       // const collection = new KarmaFieldsAlpha.Model.Collection(driver.toString());
//       //
//       // collection.paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());
//       //
//       // const count = collection.count();
//       //
//       // this.loading = count.loading;
//       // this.value = count.value;
//
//       // const paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());
//       // const shuttle = KarmaFieldsAlpha.Shuttle.get(driver.toString(), paramstring);
//       // const count = shuttle.getCount();
//
//       const table = new KarmaFieldsAlpha.field.table({
//         driver: driver.toString(),
//         params: params.toObject()
//       });
//
//       const count = table.getCount();
//
//       if (count.loading) {
//
//         this.loading = true;
//
//       } else {
//
//         this.value = count.toNumber();
//
//       }
//
//     }
//
//   }
//
//   resource(...args) {
//
//     const key = new KarmaFieldsAlpha.Expression(args[1], this.field);
//
//     if (key.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = this.field.getResource(key.toString());
//
//     }
//
//   }
//
//
//   // deprecated
//   parseParams(...args) {
//
//     let params = args[1];
//
//     this.parseObject(args[1]); // !!!!
//
//   }
//
//   getOptions(...args) {
//
//     console.error("deprecated");
//
//     // const driver = new KarmaFieldsAlpha.Expression(args[1], this.field);
//     // const params = KarmaFieldsAlpha.parseObject(args[2] || {}, this.field);
//     //
//     // if (driver.loading || params.loading) {
//     //
//     //   return new KarmaFieldsAlpha.LoadingContent();
//     //
//     // }
//     //
//     // return KarmaFieldsAlpha.Query.getOptions(driver, params);
//   }
//
//   getParam(...args) {
//
//     // const key = args[1];
//
//     const key = new KarmaFieldsAlpha.Expression(args[1], this.field);
//
//     if (key.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       const param = this.field.parent.getParam(key.toString()); // --> using parent to prevent infinite loop when calling from a table
//
//       if (param.loading) {
//
//         this.loading = true;
//
//       } else {
//
//         this.value = param.value;
//
//       }
//
//     }
//
//     // this.value = KarmaFieldsAlpha.Store.Layer.getParam(key);
//
//
//   }
//
//   getKey() {
//
//     this.value = this.field.getKey();
//
//   }
//
//   getIndex() {
//
//     this.value = this.field.request("getIndex");
//
//   }
//
//   getIds() {
//
//     // deprecated ?
//
//     this.value = this.field.parent.getContent("id");
//
//   }
//
//   request(...args) {
//
//     this.value = this.field.request(...args.slice(1));
//
//     // if (value instanceof KarmaFieldsAlpha.Content) {
//     //
//     //   Object.assign(this, value);
//     //
//     // } else {
//     //
//     //   this.value = value;
//     //
//     // }
//
//   }
//
//   // replace(...args) {
//   //
//   //   const string = new KarmaFieldsAlpha.Expression(args[1], this.field);
//   //   const wildcard = args[2];
//   //
//   //   const replacements = args.slice(3).map(replacement => new KarmaFieldsAlpha.Expression(replacement, this.field));
//   //
//   //   if (string.loading || replacements.some(value => value.loading)) {
//   //
//   //     this.loading = true;
//   //
//   //   } else {
//   //
//   //     this.value = replacements.reduce((string, replacement) => string.replace(wildcard, replacement.toString()), string.toString());
//   //
//   //   }
//   //
//   // }
//
//   replace(...args) {
//
//     const string = new KarmaFieldsAlpha.Expression(args[1], this.field);
//     const wildcard = args[2];
//
//     const replacements = args.slice(3).map(replacement => new KarmaFieldsAlpha.Expression(replacement, this.field));
//
//     if (string.loading || replacements.some(value => value.loading)) {
//
//       this.loading = true;
//
//     } else if (replacements.length) {
//
//       const grid = replacements.map(replacement => replacement.toArray());
//
//       this.value = grid[0].map((item, i) => grid.reduce((string, replacements) => string.replace(wildcard, replacements[i]), string.toString()));
//
//       // this.value = replacements.reduce((string, replacement) => string.replace(wildcard, replacement.toString()), string.toString());
//
//     }
//
//   }
//
//   array(...args) {
//
//     const items = args.slice(1).map(arg => new KarmaFieldsAlpha.Expression(arg, this.field));
//
//     if (items.loading) {
//
//       this.loading;
//
//     } else {
//
//       this.value = items.map(item => item.toSingle());
//     }
//
//   }
//
//   isLoading(...args) {
//
//     this.value = new KarmaFieldsAlpha.Expression(args[1], this.field).loading;
//
//     // return new KarmaFieldsAlpha.Content(content.loading);
//
//   }
//
//   isMixed(...args) {
//
//     if (Array.isArray(args[1])) {
//
//       this.value = new KarmaFieldsAlpha.Expression(args[1], this.field).mixed;
//
//     } else {
//
//       const content = this.field.getContent(...args.slice(1));
//
//       this.value = content.mixed;
//
//     }
//
//
//
//     // const content = new KarmaFieldsAlpha.Expression(args[1], this.field);
//     //
//     // return new KarmaFieldsAlpha.Content(content.mixed);
//
//   }
//
//
//
//
//   async *submit(...args) {
//
//     yield* this.field.request("submit");
//
//   }
//
//   // *add(...args) {
//   //
//   //   const num = new KarmaFieldsAlpha.Expression(args[1] || 1, this.field);
//   //   const index = new KarmaFieldsAlpha.Expression(args[2], this.field);
//   //   const params = new KarmaFieldsAlpha.Expression(args[3] || {}, this.field);
//   //
//   //   while (num.loading || index.loading || params.loading) {
//   //
//   //     // yield;
//   //
//   //   }
//   //
//   //   yield* this.field.request("add", num.toNumber(), index.value, params.toObject());
//   //
//   // }
//   //
//   // *delete(...args) {
//   //
//   //   const index = new KarmaFieldsAlpha.Expression(args[1], this.field);
//   //   const num = new KarmaFieldsAlpha.Expression(args[2], this.field);
//   //
//   //   while (num.loading || index.loading) {
//   //
//   //     // yield;
//   //
//   //   }
//   //
//   //   yield* this.field.request("delete", index.value, num.value);
//   //
//   // }
//   //
//   // *set(...args) {
//   //
//   //   const value = new KarmaFieldsAlpha.Expression(args[1], this.field);
//   //   const key = new KarmaFieldsAlpha.Expression(args[2], this.field);
//   //
//   //   while (value.loading || key.loading) {
//   //
//   //     // yield;
//   //
//   //   }
//   //
//   //   this.field.setContent(value, key.toString());
//   //
//   // }
//
// }
//
//

//
// KarmaFieldsAlpha.Content = class {
//
//   constructor(value, params) {
//
//     if (value instanceof KarmaFieldsAlpha.Content) {
//
//       this.value = value.value;
//
//     } else {
//
//       this.value = value;
//
//     }
//
//   }
//
//   from(content) {
//
//     this.value = content.value;
//
//   }
//
//   equals(content) {
//
//     return KarmaFieldsAlpha.DeepObject.equal(content.toArray(), this.toArray());
//
//   }
//
//   toSingle() {
//
//     if (Array.isArray(this.value)) {
//
//       return this.value[0];
//
//     }
//
//     return this.value;
//   }
//
//   toObject() {
//
//     return this.toSingle();
//   }
//
//   toString() {
//
//     if (this.loading || this.mixed) {
//
//       return "";
//
//     }
//
//     if (this.mixed) {
//
//       return "[mixed]";
//
//     }
//
//     let value = this.toSingle();
//
//     if (typeof value === "string") {
//
//       return value;
//
//     } else if (value) {
//
//       return JSON.stringify(value);
//
//     } else {
//
//       return "";
//
//     }
//
//     // return value.toString();
//
//   }
//
//   toNumber() {
//
//     if (this.loading || this.mixed || this.value === undefined) {
//
//       return 0;
//
//     }
//
//     let value = this.toSingle();
//
//     return Number(value);
//
//   }
//
//   toBoolean() {
//
//     let value = this.toSingle();
//
//     return Boolean(value);
//
//   }
//
//   toArray() {
//
//     if (this.value === undefined) {
//
//       return [];
//
//     } else if (!Array.toArray()) {
//
//       return [this.value];
//
//     }
//
//     return this.value;
//
//   }
//
//
//
// }

// KarmaFieldsAlpha.Content.Loading = class extends KarmaFieldsAlpha.Content {
//
//   constructor(value) {
//
//     super(value);
//
//     this.loading = true;
//   }
//
// }

//
//
// KarmaFieldsAlpha.Content.Request = class extends KarmaFieldsAlpha.Content {
//
//   constructor(value) {
//
//     super(value);
//
//     this.loading = value === undefined;
//
//   }
//
// }
//
// KarmaFieldsAlpha.Content.Collection = class extends KarmaFieldsAlpha.Content {
//
//   constructor(value) {
//
//     super(value || []);
//
//   }
//
//   add(content) {
//
//     if (content.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value.push(content.toString());
//
//     }
//
//   }
//
//   concat(content) {
//
//     if (content.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value.push(...content.toArray());
//
//     }
//
//   }
//
//   pick() {
//
//     const string = this.value.shift();
//
//     return new KarmaFieldsAlpha.Content(string);
//
//   }
//
// }
//
// KarmaFieldsAlpha.Content.Grid = class extends KarmaFieldsAlpha.Content.Collection {
//
//   constructor(value) {
//
//     if (typeof value === "string") {
//
//       const grid = new KarmaFieldsAlpha.Grid(value);
//
//       super(grid.value);
//
//     } else {
//
//       super(value || []);
//
//     }
//
//
//
//   }
//
//   add(collection) {
//
//     if (collection.loading) {
//
//       this.loading = true;
//
//     } else if (collection instanceof KarmaFieldsAlpha.Content.Collection) {
//
//       this.value.push(collection.value);
//
//     }
//
//   }
//
//   toString() {
//
//     const grid = new KarmaFieldsAlpha.Grid();
//
//     grid.addRow(...this.value);
//
//     return grid.toString();
//
//   }
//
// }
//
//
//
//



// KarmaFieldsAlpha.Expression = class {
//
//   static parseObject(object, field) {
//
//     let entries = Object.entries(object);
//
//     entries = entries.map(([key, value]) => [key, new KarmaFieldsAlpha.Expression(value, this.field)]);
//
//     if (entries.some(([value, value]) => value.loading)) {
//
//       return new KarmaFieldsAlpha.LoadingContent();
//
//     }
//
//     entries = entries.map(([key, value]) => [key, value.toString()]);
//
//     const result = Object.fromEntries(entries);
//
//     return new KarmaFieldsAlpha.Content(result);
//
//   }
//
//   static parse(expression, field) {
//
//     this.field = field;
//
//     if (!Array.isArray(expression)) {
//
//       if (expression && typeof expression === "object") {
//
//         return KarmaFieldsAlpha.Expression.parseObject(expression, field);
//
//       }
//
//       return new KarmaFieldsAlpha.Content(this.expression);
//
//     }
//
//     switch (expression[0]) {
//       case "=":
//       case "==":
//       case "===":
//       case "!=":
//       case "!==":
//       case ">":
//       case "<":
//       case ">=":
//       case "<=":
//       case "like":
//         return this.compare(...expression);
//
//       case "+":
//       case "-":
//       case "*":
//       case "/":
//       case "%":
//       case "max":
//       case "min":
//         return this.compute(...expression);
//
//       case "&&":
//       case "||":
//         return this.logic(...expression);
//
//       case "!":
//         return this.not(...expression);
//
//       case "?":
//         return this.condition(...expression);
//
//       case "...":
//         return this.concat(...expression);
//
//       case "concat":
//       case "math":
//       case "include":
//       case "replace":
//       case "date":
//       case "request":
//       case "getValue":
//       // case "hasValue":
//       case "queryValue":
//       case "query":
//       case "parseParams":
//       case "getOptions":
//       case "map":
//       case "getItem":
//       case "join":
//       case "getLength":
//       case "getParam":
//       case "isLoading":
//       case "isMixed":
//       case "getKey":
//       case "getIndex":
//       case "getIds":
//         return this[action](...expression);
//
//
//
//       //
//       // case "modified":
//       //   return this.field.modified();
//       //
//       //
//       //   return this.getParam();
//       //
//       // // case "toNumber":
//       // // case "toString":
//       // // case "toArray":
//       // // case "toObject":
//       // // case "toBoolean":
//       // //   return this.create(this.expression[1])[this.expression[0]]();
//       //
//
//       //
//       // case "object":
//       //   return this.object();
//       //
//       //
//       // case "debugger":
//       //   debugger;
//       //   this.create(this.expression[1]).parse();
//       //   return;
//
//       default:
//         return new KarmaFieldsAlpha.Content(expression);
//
//     }
//
//
//
//
//   }
//
//   // getChild(index, item) {
//   //
//   //   return new this.constructor(this.expression[index], this.field);
//   //
//   // }
//   //
//   // create(value) {
//   //
//   //   return new this.constructor(value, this.field);
//   //
//   // }
//   //
//   // ready(...value) {
//   //
//   //   return values.every(value !== undefined && value !== KarmaFieldsAlpha.loading);
//   //
//   // }
//   //
//   // toObject() {
//   //
//   //   const value = this.parse();
//   //
//   //   // if (value === KarmaFieldsAlpha.loading) {
//   //   //
//   //   //   return KarmaFieldsAlpha.loading;
//   //   //
//   //   // }
//   //
//   //   if (typeof value === "symbol") {
//   //
//   //     return value;
//   //
//   //   }
//   //
//   //
//   //   return KarmaFieldsAlpha.Type.toObject(value);
//   //
//   // }
//   //
//   // toSingle() {
//   //
//   //   return this.toObject();
//   //
//   // }
//   //
//   // toString() {
//   //
//   //   const value = this.parse();
//   //
//   //   // if (value === KarmaFieldsAlpha.loading) {
//   //   //
//   //   //   return KarmaFieldsAlpha.loading;
//   //   //
//   //   // }
//   //
//   //   if (typeof value === "symbol") {
//   //
//   //     return value;
//   //
//   //   }
//   //
//   //   return KarmaFieldsAlpha.Type.toString(value);
//   //
//   // }
//   //
//   // toNumber() {
//   //
//   //   const value = this.parse();
//   //
//   //   // if (value === KarmaFieldsAlpha.loading) {
//   //   //
//   //   //   return KarmaFieldsAlpha.loading;
//   //   //
//   //   // }
//   //
//   //   if (typeof value === "symbol") {
//   //
//   //     return value;
//   //
//   //   }
//   //
//   //   return KarmaFieldsAlpha.Type.toNumber(value);
//   //
//   // }
//   //
//   // toArray() {
//   //
//   //   const value = this.parse();
//   //
//   //   // if (value === KarmaFieldsAlpha.loading) {
//   //   //
//   //   //   return KarmaFieldsAlpha.loading;
//   //   //
//   //   // }
//   //
//   //   if (typeof value === "symbol") {
//   //
//   //     return value;
//   //
//   //   }
//   //
//   //   return KarmaFieldsAlpha.Type.toArray(value);
//   //
//   // }
//   //
//   // toBoolean() {
//   //
//   //   const value = this.parse();
//   //
//   //   // if (value === KarmaFieldsAlpha.loading) {
//   //   //
//   //   //   return KarmaFieldsAlpha.loading;
//   //   //
//   //   // }
//   //
//   //   if (typeof value === "symbol") {
//   //
//   //     return value;
//   //
//   //   }
//   //
//   //   return KarmaFieldsAlpha.Type.toBoolean(value);
//   //
//   // }
//
//   compute(...params) {
//
//     const v1 = new KarmaFieldsAlpha.Expression(params[1], this.field).toNumber();
//     const v2 = new KarmaFieldsAlpha.Expression(params[2], this.field).toNumber();
//
//     // if (v1 === KarmaFieldsAlpha.loading || v2 === KarmaFieldsAlpha.loading) {
//     //
//     //   return KarmaFieldsAlpha.loading;
//     //
//     // }
//
//     if (v1.loading || v2.loading) {
//
//       return new KarmaFieldsAlpha.Content(0, {loading: true});
//
//     }
//
//     switch (params[0]) {
//
//       case "+": return new KarmaFieldsAlpha.Content(v1 + v2);
//       case "-": return new KarmaFieldsAlpha.Content(v1 - v2);
//       case "*": return new KarmaFieldsAlpha.Content(v1 * v2);
//       case "/": return new KarmaFieldsAlpha.Content(v1 / v2);
//       // case "max": return new Content(Math.max(v1, v2));
//       // case "min": return new Content(Math.max(v1, v2));
//
//     }
//
//   }
//
//   compare() {
//
//     const v1 = new KarmaFieldsAlpha.Expression(this.expression[1], this.field);
//     const v2 = new KarmaFieldsAlpha.Expression(this.expression[2], this.field).toSingle();
//
//     // if (v1 === KarmaFieldsAlpha.loading || v2 === KarmaFieldsAlpha.loading) {
//     //
//     //   return KarmaFieldsAlpha.loading;
//     //
//     // }
//
//     if (v1.loading || v2.loading) {
//
//       return new KarmaFieldsAlpha.Content(0, {loading: true});
//
//     }
//
//     switch (this.expression[0]) {
//
//       case "=":
//       case "==": return new KarmaFieldsAlpha.Content(v1.toSingle() == v2.toSingle());
//       case "===": return new KarmaFieldsAlpha.Content(v1.toSingle() === v2.toSingle());
//       case "!=": return new KarmaFieldsAlpha.Content(v1.toSingle() != v2.toSingle());
//       case "!==": return new KarmaFieldsAlpha.Content(v1.toSingle() !== v2.toSingle());
//       case ">": return new KarmaFieldsAlpha.Content(v1.toSingle() > v2.toSingle());
//       case "<": return new KarmaFieldsAlpha.Content(v1.toSingle() < v2.toSingle());
//       case ">=": return new KarmaFieldsAlpha.Content(v1.toSingle() >= v2.toSingle());
//       case "<=": return new KarmaFieldsAlpha.Content(v1.toSingle() <= v2.toSingle());
//       case "like": return new KarmaFieldsAlpha.Content(v1.toSingle().match(new RegExp(v2.toSingle())));
//
//     }
//
//   }
//
//   logic() {
//
//     const values = this.expression.slice(1).map(value => new KarmaFieldsAlpha.Expression(value, this.field));
//
//     values.some(value => value.loading) {
//
//       return new KarmaFieldsAlpha.Content(undefined, {loading: true});
//
//     }
//
//     let result = values.shift();
//
//     while (values.length) {
//
//       const value = values.shift().toSingle();
//
//       switch (this.expression[0]) {
//
//         case "&&":
//           result = result && value;
//           break;
//
//         case "||":
//           result = result || value;
//           break;
//
//       }
//
//     }
//
//     return result;
//
//   }
//
//   math(...args) {
//
//     const values = this.expression.slice(2).map(value => new KarmaFieldsAlpha.Expression(value, this.field));
//
//     values.some(value => value.loading) {
//
//       return new KarmaFieldsAlpha.LoadingContent();
//
//     }
//
//     const result = Math[args[1]](...values.map(value => value.toNumber()));
//
//     return new KarmaFieldsAlpha.Content(result);
//
//   }
//
//   not() {
//
//     const value = new KarmaFieldsAlpha.Expression(this.expression[1], this.field);
//
//     if (value.loading) {
//
//       return value;
//
//     }
//
//     return !value.toBoolean();
//
//   }
//
//   condition() {
//
//     const v1 = new KarmaFieldsAlpha.Expression(this.expression[1], this.field);
//
//     if (v1.loading) {
//
//       return v1;
//
//     }
//
//     return v1.toBoolean() ? new KarmaFieldsAlpha.Expression(this.expression[2], this.field) : new KarmaFieldsAlpha.Expression(this.expression[3], this.field);
//
//   }
//
//   concat() {
//
//     const arrays = this.expression.slice(1).map(value => new KarmaFieldsAlpha.Expression(value, this.field));
//
//     if (arrays.some(array => array.loading)) {
//
//       return new KarmaFieldsAlpha.LoadingContent();
//
//     }
//
//     return [].concat(...arrays.toArray());
//
//   }
//
//   join() {
//
//     const array = new KarmaFieldsAlpha.Expression(this.expression[1], this.field);
//     const glue = this.expression[2] || ", ";
//
//     if (array.loading) {
//
//       return array;
//
//     }
//
//     return array.toArray().join(glue);
//
//   }
//
//   include() {
//
//     const array = new KarmaFieldsAlpha.Expression(this.expression[1], this.field);
//     const value = new KarmaFieldsAlpha.Expression(this.expression[2], this.field);
//
//     if (array.loading || value.loading) {
//
//       return new KarmaFieldsAlpha.LoadingContent();
//
//     }
//
//     return array.toArray().include(value.toSingle());
//
//   }
//
//   getLength() {
//
//     const array = new KarmaFieldsAlpha.Expression(this.expression[1], this.field).toArray();
//
//     if (array.loading) {
//
//       return array;
//
//     }
//
//     return array.length;
//
//   }
//
//   map(...params) {
//
//     const array = new KarmaFieldsAlpha.Expression(params[1], this.field);
//
//     if (array.loading) {
//
//       return array;
//
//     }
//
//     const results = array.toArray().map(value => {
//
//       if (params[2]) {
//
//         return new KarmaFieldsAlpha.Expression(params[2], value);
//
//       }
//
//       return value;
//
//     });
//
//     if (results.some(result => result.loading)) {
//
//       return new KarmaFieldsAlpha.LoadingContent();
//
//     }
//
//     return results;
//   }
//
//   getItem() {
//
//     return KarmaFieldsAlpha.DeepObject.get(this.field, ...params.slice(1));
//
//   }
//
//   date() {
//
//     const dateString = new KarmaFieldsAlpha.Expression(params[1], this.field);
//     const option = params[2] || {};
//     const locale = params[3] || KarmaFieldsAlpha.locale;
//
//     if (dateString.loading) {
//
//       return dateString;
//
//     }
//
//     const dateObj = new Date(dateString.toObject());
//
//     if (!isNaN(dateObj)) {
//
//       return dateObj.toLocaleDateString(locale, option);
//
//     }
//
//     return "";
//
//   }
//
//   getValue(...params) {
//
//     let key = params[1];
//
//     if (key && Array.isArray(key)) {
//
//       key = new KarmaFieldsAlpha.Expression(params[1], this.field);
//
//       if (key.loading) {
//
//         return key;
//
//       }
//
//       key = key.toString();
//
//     } else if (!key) {
//
//       key = this.field.getKey();
//
//     }
//
//     return this.field.parent.requestValue(key);
//
//   }
//
//   // hasValue(...params) {
//   //
//   //   return this.getValue(...params);
//   //
//   // }
//
//   queryValue() {
//
//     const driver = new KarmaFieldsAlpha.Expression(params[1], this.field);
//     const id = new KarmaFieldsAlpha.Expression(params[2], this.field);
//     const key = new KarmaFieldsAlpha.Expression(params[3], this.field);
//
//     if (driver.loading || id.loading || key.loading) {
//
//       return new KarmaFieldsAlpha.LoadingContent();
//
//     }
//
//     return KarmaFieldsAlpha.Query.getValue(driver.toString(), id.toString(), key.toString());
//
//   }
//
//   queryValues(...params) {
//
//     const driver = new KarmaFieldsAlpha.Expression(params[1], this.field);
//     const ids = new KarmaFieldsAlpha.Expression(params[2], this.field);
//     const key = new KarmaFieldsAlpha.Expression(params[3], this.field);
//
//     if (driver.loading || ids.loading || key.loading) {
//
//       return new KarmaFieldsAlpha.LoadingContent();
//
//     }
//
//     const values = ids.map(id => KarmaFieldsAlpha.Query.getValue(driver.toString(), id.toString(), key.toString()));
//
//     if (values.some(value => value.loading)) {
//
//       return new KarmaFieldsAlpha.LoadingContent();
//
//     }
//
//     new KarmaFieldsAlpha.Content(values.reduce((accumulator, items) => [...accumulator, ...items], []));
//
//   }
//
//   query(...args) {
//
//     const driver = new KarmaFieldsAlpha.Expression(args[1], this.field);
//
//     let params;
//
//     if (Array.isArray(args[2])) { // -> expression
//
//       params = new KarmaFieldsAlpha.Expression(args[2], this.field);
//
//     } else if (args[2] && typeof args[2] === "object") { // -> just an object
//
//       params = KarmaFieldsAlpha.parseObject(args[2], this.field);
//
//     } else {
//
//       params = new KarmaFieldsAlpha.Content({});
//
//     }
//
//     if (driver.loading || params.loading) {
//
//       return new KarmaFieldsAlpha.LoadingContent();
//
//     }
//
//     return KarmaFieldsAlpha.Query.getResults(driver.toString(), params.toSingle());
//
//   }
//
//   parseParams(...args) {
//
//     let params = args[1];
//
//     return KarmaFieldsAlpha.Expression.parseObject(args[1], this.field);
//
//   }
//
//   getOptions(...args) {
//
//     const driver = new KarmaFieldsAlpha.Expression(args[1], this.field);
//     const params = KarmaFieldsAlpha.parseObject(args[2] || {}, this.field);
//
//     if (driver.loading || params.loading) {
//
//       return new KarmaFieldsAlpha.LoadingContent();
//
//     }
//
//     return KarmaFieldsAlpha.Query.getOptions(driver, params);
//   }
//
//   getParam(...args) {
//
//     const key = this.expression[1];
//
//     return new KarmaFieldsAlpha.Content(this.field.request("getParam", key));
//
//   }
//
//   // modified() {
//   //
//   //   return this.field.modified();
//   //
//   // }
//
//
//   getKey() {
//
//     return new KarmaFieldsAlpha.Content(this.field.getKey());
//
//   }
//
//   getIndex() {
//
//     return new KarmaFieldsAlpha.Content(this.field.request("getIndex"));
//
//   }
//
//   getIds() {
//
//     return new KarmaFieldsAlpha.Content(this.field.getIds("getIds"));
//
//   }
//
//   request(...args) {
//
//     return new KarmaFieldsAlpha.Content(this.field.request(...args.slice(1)));
//
//   }
//
//   replace(...args) {
//
//     const string = args[1];
//     const wildcard = args[2];
//
//     const replacements = args.slice(3).map(replacement => new KarmaFieldsAlpha.Expression(replacement, this.field));
//
//     if (replacements.some(value => value.loading)) {
//
//       return new KarmaFieldsAlpha.LoadingContent();
//
//     }
//
//     const result = replacements.reduce((string, replacement) => string.replace(wildcard, replacement), string);
//
//     return new KarmaFieldsAlpha.Content(result);
//
//   }
//
//   isLoading(...args) {
//
//     const content = new KarmaFieldsAlpha.Expression(args[1], this.field);
//
//     return new KarmaFieldsAlpha.Content(content.loading);
//
//   }
//
//   isMixed() {
//
//     const content = new KarmaFieldsAlpha.Expression(args[1], this.field);
//
//     return new KarmaFieldsAlpha.Content(content.mixed);
//
//   }
//
//   //
//   // // object() {
//   // //
//   // //   const object = {};
//   // //
//   // //   for (let i = 1; i < this.expression.length; i += 2) {
//   // //
//   // //     const key = this.create(this.expression[i]).toString();
//   // //     const value = this.create(this.expression[i+1]).toString();
//   // //
//   // //     object[key] = value;
//   // //
//   // //   }
//   // //
//   // //   if (Object.keys(object).some(key => key === KarmaFieldsAlpha.loading)) {
//   // //
//   // //     return KarmaFieldsAlpha.loading;
//   // //
//   // //   }
//   // //
//   // //   if (Object.values(object).some(key => key === KarmaFieldsAlpha.loading)) {
//   // //
//   // //     return KarmaFieldsAlpha.loading;
//   // //
//   // //   }
//   // //
//   // //   return object;
//   // //
//   // // }
//   //
//   //
//   // object() {
//   //
//   //   const object = {};
//   //
//   //   for (let key in this.expression[1]) {
//   //
//   //     object[key] = this.create(this.expression[1][key]).toString();
//   //
//   //   }
//   //
//   //   if (Object.values(object).some(key => key === KarmaFieldsAlpha.loading)) {
//   //
//   //     return KarmaFieldsAlpha.loading;
//   //
//   //   }
//   //
//   //   return object;
//   //
//   // }
//   //
//   //
//   // parse() {
//   //
//   //   if (!Array.isArray(this.expression)) {
//   //
//   //     return this.expression;
//   //
//   //   }
//   //
//   //   switch (this.expression[0]) {
//   //     case "=":
//   //     case "==":
//   //     case "===":
//   //     case "!=":
//   //     case "!==":
//   //     case ">":
//   //     case "<":
//   //     case ">=":
//   //     case "<=":
//   //     case "like":
//   //       return this.compare();
//   //
//   //     case "+":
//   //     case "-":
//   //     case "*":
//   //     case "/":
//   //     case "%":
//   //     case "max":
//   //     case "min":
//   //       return this.compute();
//   //
//   //     case "&&":
//   //     case "||":
//   //       return this.logic();
//   //
//   //     case "math":
//   //       return this.math();
//   //
//   //     case "include":
//   //       return this.include();
//   //
//   //     case "!":
//   //       return this.not();
//   //
//   //     case "?":
//   //       return this.condition();
//   //
//   //     case "concat":
//   //     case "...":
//   //       return this.concat();
//   //
//   //     case "replace":
//   //       return this.replace();
//   //
//   //     case "date":
//   //       return this.date();
//   //
//   //     case "request":
//   //       return this.request();
//   //
//   //     case "getValue":
//   //       return this.getValue();
//   //
//   //     case "hasValue":
//   //       return this.hasValue();
//   //
//   //     case "queryValue":
//   //       return this.queryValue();
//   //
//   //     case "query":
//   //       return this.query();
//   //
//   //     case "parseParams":
//   //       return this.parseParams();
//   //
//   //     case "getOptions":
//   //       return this.getOptions();
//   //
//   //     case "map":
//   //       return this.map();
//   //
//   //     case "getItem":
//   //     case "item":
//   //       return this.getItem();
//   //
//   //     case "join":
//   //       return this.join();
//   //
//   //     case "getLength":
//   //     case "length":
//   //     case "count":
//   //       return this.getLength();
//   //
//   //     case "key":
//   //       return this.field.getKey();
//   //
//   //     case "index":
//   //     case "getIndex":
//   //       return this.field.parent.getIndex();
//   //
//   //     case "id":
//   //     case "getId":
//   //     case "getIds":
//   //       return this.field.getId();
//   //
//   //     case "modified":
//   //       return this.field.modified();
//   //
//   //     case "getParam":
//   //       return this.getParam();
//   //
//   //     // case "toNumber":
//   //     // case "toString":
//   //     // case "toArray":
//   //     // case "toObject":
//   //     // case "toBoolean":
//   //     //   return this.create(this.expression[1])[this.expression[0]]();
//   //
//   //     case "isLoading":
//   //       return this.isLoading();
//   //
//   //     case "isMixed":
//   //       return this.isMixed();
//   //
//   //     case "object":
//   //       return this.object();
//   //
//   //
//   //     case "debugger":
//   //       debugger;
//   //       this.create(this.expression[1]).parse();
//   //       return;
//   //
//   //     default:
//   //       return this.expression;
//   //
//   //   }
//   //
//   // }
//   //
//   //
//   // static parseParams(params, context) {
//   //
//   //   const object = {};
//   //
//   //   for (let key in params) {
//   //
//   //     // object[key] = this.create(params[key]).toString();
//   //     object[key] = new this(params[key], context).toString();
//   //
//   //   }
//   //
//   //   return object;
//   // }
//
//
//   // static async resolve(field, expression) {
//   //
//   //   if (Array.isArray(expression)) {
//   //
//   //     const [key, ...params] = expression;
//   //
// 	// 		switch (key) {
//   //
// 	// 			case "+":
// 	// 			case "-":
// 	// 			case "*":
// 	// 			case "/":
//   //       case "%":
// 	// 			case "&&":
// 	// 			case "||":
//   //       case "=":
// 	// 			case "==":
//   //       case "===":
// 	// 			case "!=":
//   //       case "!==":
// 	// 			case "<":
// 	// 			case ">":
// 	// 			case "<=":
// 	// 			case ">=":
//   //       case "in":
//   //       case "notin":
// 	// 				return this.operate(field, ...expression);
//   //
//   //       case "!":
//   //         return !await this.resolve(field, params[0]);
//   //
// 	// 			case "?":
// 	// 				return await this.resolve(field, params[0]) ? await this.resolve(field, params[1]) : await this.resolve(field, params[2] || "");
//   //
//   //       case "...":
// 	// 				return this.concat(field, ...params);
//   //
//   //       // -> compat
//   //       case "param":
//   //         return this.getParam(field, ...params);
//   //
//   //
//   //       // case "boolean":
//   //       //   return Boolean(await this.resolve(field, params[0]));
//   //       //
//   //       // case "number":
//   //       //   return Number(await this.resolve(field, params[0]));
//   //       //
//   //       // case "string":
//   //       //   return String(await this.resolve(field, params[0]));
//   //
// 	// 			// case "join":
//   //       //   return this.arrayFn(field, key, ...params);
//   //       //
//   //       // case "split":
//   //       //   return this.arrayFn(field, key, ...params);
//   //       //
// 	// 			// case "toFixed":
//   //       //   return this.numberFn(field, key, ...params);
//   //
// 	// 			default:
//   //         if (this[key]) {
//   //           return this[key](field, ...params);
//   //         } else {
//   //           return expression;
//   //         }
//   //
// 	// 		}
//   //
//   //   }
//   //
//   //   return expression;
//   //
//   // }
//   //
//   // static async resolveAll(field, expressions) {
//   //
//   //   const values = [];
//   //
//   //   for (let item of expressions) {
//   //
//   //     const value = await this.resolve(field, item);
//   //
//   //     values.push(value);
//   //
//   //   }
//   //
//   //   return values;
//   // }
//   //
//   // static async resolveObject(field, object) {
//   //
//   //   const output = {};
//   //
//   //   for (let param in object) {
//   //
//   //     output[param] = await this.resolve(field, object[param]);
//   //
//   //   }
//   //
//   //   return output;
//   // }
//   //
//   // static async resolveParams(field, params) {
//   //
//   //   if (typeof params === "object") {
//   //
//   //     return this.resolveObject(field, params);
//   //
//   //   } else {
//   //
//   //     return this.resolve(field, params);
//   //
//   //   }
//   // }
//   //
//   // static async replace(field, string, wildcard, ...replacements) {
//   //
//   //   for (let i = 0; i < replacements.length; i++) {
//   //
//   //     const matches = string.match(wildcard);
//   //
//   //     if (matches) {
//   //       const replacement = await this.resolve(field, replacements[i]);
//   //       string = string.replace(wildcard, replacement);
//   //     }
//   //
//   //   }
//   //
//   //   return string;
//   //
//   // }
//   //
//   //
//   // // static async compare(field, comparison, expression1, expression2) {
//   // //   const value1 = await this.resolve(field, expression1);
//   // //   const value2 = await this.resolve(field, expression2);
//   // //
//   // //   switch (comparison) {
//   // //
//   // //   }
//   // // }
//   //
//   // static async operate(field, operation, expression1, expression2) {
//   //   const value1 = await this.resolve(field, expression1);
//   //   const value2 = await this.resolve(field, expression2);
//   //
//   //   if (Array.isArray(value1)) {
//   //
//   //     if (Array.isArray(value2)) {
//   //
//   //       switch (operation) {
//   //         case "==":
//   //         case "===": return KarmaFieldsAlpha.DeepObject.equal(value1, value2);
//   //         case "!=":
//   //         case "!==": return KarmaFieldsAlpha.DeepObject.differ(value1, value2);
//   //         case "+": return [...value1, ...value2];
//   //         case "-": return value1.filter(item => !value2.includes(item));
//   //       }
//   //
//   //     } else {
//   //
//   //       switch (operation) {
//   //         case "==": return value1.every(item => item == value2);
//   //         case "===": return value1.every(item => item === value2);
//   //         case "!=": return value1.some(item => item != value2);
//   //         case "!==": return value1.some(item => item !== value2);
//   //         case "+": return [...value1, value2];
//   //         case "-": return value1.filter(item => item !== value2);
//   //         case "in": return value2.includes(value1);
//   //         case "notin": return !value2.includes(value1);
//   //       }
//   //
//   //     }
//   //
//   //   } else {
//   //
//   //     switch (operation) {
//   //       case "=":
//   //       case "==": return value1 == value2;
//   //       case "===": return value1 === value2;
//   //       case "!=": return value1 != value2;
//   //       case "!==": return value1 !== value2;
//   //       case ">": return value1 > value2;
//   //       case "<": return value1 < value2;
//   //       case ">=": return value1 >= value2;
//   //       case "<=": return value1 <= value2;
//   //       case "+": return Number(value1)+Number(value2);
//   //       case "-": return Number(value1)-Number(value2);
//   //       case "*": return Number(value1)*Number(value2);
//   //       case "/": return Number(value1)/Number(value2);
//   //       case "%": return Number(value1)%Number(value2);
//   //       case "&&": return value1 && value2;
//   //       case "||": return value1 || value2;
//   //
//   //       // case "in": return value2.includes(value1);
//   //     }
//   //
//   //   }
//   //
//   //   console.error("illegal operation", operation, value1, value2);
//   //
//   // }
//   //
//   // static async max(value1, value2) {
//   //   value1 = await this.resolve(value1);
//   //   value2 = await this.resolve(value2);
//   //   return Math.max(Number(value1), Number(value2));
//   // }
//   //
//   // static async min(value1, value2) {
//   //   value1 = await this.resolve(value1);
//   //   value2 = await this.resolve(value2);
//   //   return Math.min(Number(value1), Number(value2));
//   // }
//   //
//   // // static async logic(field, operation, expression1, expression2) {
//   // //   const value1 = await this.resolve(field, expression1);
//   // //   const value2 = expression2 ? await this.resolve(field, expression2) : "";
//   // //
//   // //   switch (operation) {
//   // //     case "&&": return value1 && value2;
//   // //     case "||": return value1 || value2;
//   // //   }
//   // // }
//   //
//   // // static async arrayFn(field, fn, expression, ...params) {
//   // //   const array = await this.resolve(field, expression);
//   // //   return array[fn](...params);
//   // // }
//   // //
//   // // static async stringFn(field, fn, expression, ...params) {
//   // //   const string = await this.resolve(field, expression);
//   // //   return string.toString()[fn](...params);
//   // // }
//   // //
//   // // static async numberFn(field, fn, expression, ...params) {
//   // //   const number = await this.resolve(field, expression);
//   // //   return Number(number)[fn](...params);
//   // // }
//   //
//   // static async js(field, value, fn, ...params) {
//   //   value = await this.resolve(field, value);
//   //   params = await this.resolveAll(field, params);
//   //   return value[fn](...params);
//   // }
//   //
//   // static async math(field, fn, ...params) {
//   //   params = await this.resolveAll(field, params);
//   //   return Math[fn](...params);
//   // }
//   //
//   // static async date(field, expression, option = {}, locale = null, noDate = null) {
//   //   const value = await this.resolve(field, expression);
//   //   if (value) {
//   //     const date = new Date(value);
//   //     return new Intl.DateTimeFormat(locale || KarmaFieldsAlpha.locale, option).format(date);
//   //   } else {
//   //     return noDate;
//   //   }
//   // }
//   //
//   // static async moment(field, expression, formatExpression = "DD/MM/YYYY") {
//   //   const value = await this.resolve(field, expression);
//   //   const format = await this.resolve(field, formatExpression);
//   //   return moment(value).format(format);
//   // }
//   //
//   // static async condition(field, expression1, expression2, expression3 = "") {
//   //   const value1 = await this.resolve(field, expression1);
//   //   if (value1) {
//   //     return await this.resolve(field, expression2);
//   //   } else {
//   //     return await this.resolve(field, expression3);
//   //   }
//   // }
//   //
//   //
//   //
//   //
//   // static async getArray(field, ...expressionPath) {
//   //
//   //   // const path = await this.resolveAll(field, expressionPath);
//   //   // const response = await field.parent.request("get", {}, ...path);
//   //   // return KarmaFieldsAlpha.Type.toArray(response);
//   //
//   //   return this.get(field, "array", ...expressionPath);
//   //
//   // }
//   //
//   // static async get(field, type, ...path) {
//   //
//   //   // -> compat
//   //   switch (type) {
//   //     case "string":
//   //     case "array":
//   //     case "object":
//   //     case "number":
//   //     case "boolean":
//   //       break;
//   //     default:
//   //       path = [type, ...path];
//   //       type = "string";
//   //       break;
//   //   }
//   //
//   //   path = await this.resolveAll(field, path);
//   //
//   //   const response = await field.parent.request("get", {}, ...path);
//   //
//   //   return KarmaFieldsAlpha.Type.convert(response, type);
//   //
//   // }
//   //
//   // static async getIds(field) {
//   //   return await field.parent.request("ids");
//   // }
//   //
//   // static async getDriver(field) {
//   //   console.error("deprecated");
//   //   // const request = await field.dispatch({
//   //   //   action: "driver"
//   //   // });
//   //   // return request.data;
//   // }
//   //
//   // static async queryArray(field, expressionDriver, ...expressionPath) {
//   //   console.error("Deprecated queryArray. Use query");
//   //
//   //
//   //
//   //   // let driver = await this.resolve(field, expressionDriver);
//   //   // const path = await this.resolveAll(field, expressionPath);
//   //   //
//   //   //
//   //   // if (typeof driver === "string") {
//   //   //   driver = KarmaFieldsAlpha.Nav.parse(driver);
//   //   // }
//   //   //
//   //   // const paramString = KarmaFieldsAlpha.Nav.toString(driver.params);
//   //   // const store = new KarmaFieldsAlpha.Store(driver.name, driver.joins);
//   //   // const results = await store.query(paramString);
//   //   //
//   //   // if (path.length) {
//   //   //
//   //   //   let value = await store.getValue(...path);
//   //   //   return KarmaFieldsAlpha.Type.toArray(value);
//   //   //
//   //   // }
//   //   //
//   //   // return results;
//   //
//   //
//   //   // field.queriedArrayRequest = request; // -> for dropdown...
//   //
//   //
//   //
//   // }
//   //
//   // static async query(field, driver, paramString = "", joins = [], type = "array", ...path) {
//   //
//   //   driver = await this.resolve(field, driver);
//   //   paramString = await this.resolve(field, paramString);
//   //   if (typeof paramString === "object") {
//   //     KarmaFieldsAlpha.Params.stringify(paramString);
//   //   }
//   //   // const store = new KarmaFieldsAlpha.Store(driver, joins);
//   //   // const results = await store.query(paramString);
//   //   const form = new KarmaFieldsAlpha.field.form({
//   //     driver: driver,
//   //     joins: joins
//   //   });
//   //
//   //   const results = await form.query(paramString);
//   //
//   //   if (path.length) {
//   //     path = await this.resolveAll(field, path);
//   //     const value = await form.getInitial(...path);
//   //     return KarmaFieldsAlpha.Type.convert(value, type);
//   //   }
//   //
//   //   return results;
//   // }
//   //
//   // static async table(field, table, type = "array", ...path) {
//   //
//   //   table = await this.resolveObject(field, table);
//   //
//   //   const form = new KarmaFieldsAlpha.field.form(table);
//   //   const params = await this.resolveParams(field, table.params);
//   //   const results = await form.query(params);
//   //
//   //   if (path.length) {
//   //
//   //     path = await this.resolveAll(field, path);
//   //     const value = await form.getInitial(...path);
//   //     return KarmaFieldsAlpha.Type.convert(value, type);
//   //
//   //   } else {
//   //
//   //     const idAlias = form.getAlias("id");
//   //     const nameAlias = form.getAlias("name");
//   //
//   //     return results.map(item => {
//   //       return {
//   //         id: item[idAlias],
//   //         name: item[nameAlias]
//   //       };
//   //     });
//   //
//   //   }
//   //
//   //   return results;
//   // }
//   //
//   // static async getOptions(field, driver, paramString = "", nameField = "name", joins = []) {
//   //
//   //   driver = await this.resolve(field, driver);
//   //   paramString = await this.resolve(field, paramString);
//   //
//   //   if (typeof paramString === "object") {
//   //     KarmaFieldsAlpha.Params.stringify(paramString);
//   //   }
//   //
//   //   // const store = new KarmaFieldsAlpha.Store(driver);
//   //   //
//   //   // const ids = await store.queryIds(paramString);
//   //
//   //   const form = new KarmaFieldsAlpha.field.form({
//   //     driver: driver,
//   //     joins: joins
//   //   });
//   //
//   //   const results = await form.query(paramString);
//   //
//   //   const options = [];
//   //
//   //   // for (let id of ids) {
//   //   //   options.push({
//   //   //     id: id,
//   //   //     name: KarmaFieldsAlpha.Type.toString(await form.getInitial(id, nameField))
//   //   //   });
//   //   // }
//   //
//   //   for (let item of results) {
//   //     options.push({
//   //       id: item.id,
//   //       name: KarmaFieldsAlpha.Type.toString(item[nameField] || await form.getInitial(item.id, nameField))
//   //     });
//   //   }
//   //
//   //   return options;
//   // }
//   //
//   // // static async getGroupOptions(field, driver, paramString = "", nameField = "name", keyField = "id", groupNameField = "group_name", groupIdField = "group_id") {
//   // //
//   // //   driver = await this.resolve(field, driver);
//   // //   paramString = await this.resolve(field, paramString);
//   // //
//   // //   const store = new KarmaFieldsAlpha.Store(driver);
//   // //
//   // //   const ids = await store.queryIds(paramString);
//   // //   const groups = [];
//   // //
//   // //   for (let id of ids) {
//   // //     const name = KarmaFieldsAlpha.Type.toString(await store.getValue(id, nameField));
//   // //     const groupId = KarmaFieldsAlpha.Type.toString(await store.getValue(id, groupIdField));
//   // //
//   // //     let group = groups.find(group => group.id === groupId);
//   // //
//   // //     if (!group) {
//   // //
//   // //       group = {
//   // //        id: groupId,
//   // //        name: KarmaFieldsAlpha.Type.toString(await store.getValue(id, groupNameField)),
//   // //        options: []
//   // //      };
//   // //
//   // //      groups.push(group);
//   // //
//   // //     }
//   // //
//   // //     group.options.push({
//   // //       id: id,
//   // //       name: KarmaFieldsAlpha.Type.toString(await store.getValue(id, nameField))
//   // //     });
//   // //
//   // //   }
//   // //
//   // //   return groups;
//   // // }
//   //
//   //
//   // // static async getOptions(field, driver, paramString = "", nameField = "name") {
//   // //
//   // //   // driver = await this.resolve(field, driver);
//   // //
//   // //   const expressionKey = JSON.stringify(["getOptions", driver, paramString, nameField]);
//   // //
//   // //   const cache = new KarmaFieldsAlpha.Buffer("cache");
//   // //
//   // //   let promise = cache.get(driver, "expressions", expressionKey);
//   // //
//   // //   if (!promise) {
//   // //
//   // //     promise = new Promise(async (resolve, reject) => {
//   // //
//   // //       paramString = await this.resolve(field, paramString);
//   // //
//   // //       const store = new KarmaFieldsAlpha.Store(driver);
//   // //
//   // //       const ids = await store.queryIds(paramString);
//   // //       const options = [];
//   // //
//   // //       for (let id of ids) {
//   // //
//   // //         const array = await store.getValue(id, nameField);
//   // //         const value = KarmaFieldsAlpha.Type.toString(array);
//   // //
//   // //         options.push({
//   // //           id: id,
//   // //           name: value
//   // //         });
//   // //
//   // //       }
//   // //
//   // //       resolve(options);
//   // //     });
//   // //
//   // //     cache.set(promise, driver, "expressions", expressionKey);
//   // //
//   // //   }
//   // //
//   // //   return promise;
//   // // }
//   //
//   // static async getParam(field, expressionKey) {
//   //   const key = await this.resolve(field, expressionKey);
//   //   return KarmaFieldsAlpha.Nav.get(key);
//   // }
//   //
//   // static async params(field, ...keys) {
//   //   keys = await this.resolveAll(field, keys);
//   //   const params = Object.fromEntries(keys.map(key => [key, KarmaFieldsAlpha.Nav.get(key)]).filter(entry => entry[1]));
//   //   return Object.entries(params).map(entry => entry.join("=")).join("&");
//   // }
//   //
//   // static async modified(field, ...expressionPath) {
//   //   const path = await this.resolveAll(field, expressionPath);
//   //   const response = await field.request("modified", {}, ...path);
//   //   return KarmaFieldsAlpha.Type.toBoolean(response);
//   // }
//   //
//   // // static async dispatch(field, action, type = "string", params = {}) {
//   // //   action = await this.resolve(field, action);
//   // //   params = await this.resolve(field, params);
//   // //
//   // //   const request = await field.dispatch({
//   // //     action: action,
//   // //     ...params
//   // //   });
//   // //
//   // //   return KarmaFieldsAlpha.Type.convert(request.data, type);
//   // // }
//   //
//   // static async request(field, action, type = "string", params = {}, ...path) {
//   //   action = await this.resolve(field, action);
//   //   params = await this.resolve(field, params);
//   //   path = await this.resolveAll(field, path);
//   //
//   //   const response = await field.request(action, params, ...path);
//   //
//   //   return KarmaFieldsAlpha.Type.convert(response, type);
//   // }
//   //
//   // static async set(field, value, ...path) {
//   //   value = await this.resolve(field, value);
//   //   path = await this.resolveAll(field, path);
//   //
//   //   await field.request("set", {data: value}, ...path);
//   //
//   //   // const array = KarmaFieldsAlpha.Type.toArray(value);
//   //   //
//   //   // const request = await field.request("get", {}, ...path);
//   //   //
//   //   // if (KarmaFieldsAlpha.DeepObject.differ(request.data, array)) {
//   //   //
//   //   //   await field.request("set", {
//   //   //     data: array,
//   //   //   }, ...path);
//   //   //
//   //   // }
//   //   // await this.setArray(field, array, ...path);
//   // }
//   //
//   // static async setParam(field, value, key) {
//   //   key = await this.resolve(field, key);
//   //   value = await this.resolve(field, value);
//   //   // KarmaFieldsAlpha.Nav.set(value, key);
//   //   KarmaFieldsAlpha.Nav.change(value, undefined, key);
//   // }
//   //
//   //
//   // // static array(field, array) {
//   // //   return array;
//   // // }
//   //
//   // // static async map(field, expressionArray, expression) {
//   // //   const array = this.resolve(field, expressionArray);
//   // //   const output = [];
//   // //   for (let item of array) {
//   // //     output.push(await this.resolve(field, expression));
//   // //   }
//   // //   return output;
//   // //
//   // //
//   // //   Promise.all(array.map(item => this.resolve(field, [expressionitem])))
//   // //
//   // //
//   // // }
//   //
//   // static async map(field, array, replacement) {
//   //
//   //   array = await this.resolve(field, array);
//   //
//   //   const output = [];
//   //
//   //   for (let value of array) {
//   //
//   //     field.loopItem = value;
//   //
//   //     const item = await this.object(field, replacement);
//   //
//   //     output.push(item);
//   //
//   //   }
//   //
//   //   return output;
//   // }
//   //
//   //
//   // // static async mapIds(field, array, driver, paramString, joins, relKey = 'name') {
//   //
//   // //   array = await this.resolve(field, array);
//   //
//   // //   // driver = await this.resolve(field, driver);
//   // //   // paramString = await this.resolve(field, paramString);
//   //
//   // //   if (typeof paramString === "object") {
//   // //     KarmaFieldsAlpha.Params.stringify(paramString);
//   // //   }
//   //
//   // //   const form = new KarmaFieldsAlpha.field.form({
//   // //     driver: driver,
//   // //     joins: joins
//   // //   });
//   //
//   // //   const output = [];
//   //
//   // //   for (let id of array) {
//   //
//   // //     output.push(await form.query(id, relKey));
//   //
//   // //   }
//   //
//   // //   return output;
//   // // }
//   //
//   //
//   //
//   // // compat
//   // static async loop(field, expression, wildcard, replacementExpression, glue = "") {
//   //
//   //   // const array = await this.resolve(field, expression);
//   //   //
//   //   // const output = [];
//   //   //
//   //   // const replaceDeep = (expression, wildcard, replacement) => {
//   //   //   if (Array.isArray(expression)) {
//   //   //     return expression.map(item => replaceDeep(item, wildcard, replacement));
//   //   //   } else if (expression === wildcard) {
//   //   //     return replacement;
//   //   //   } else {
//   //   //     return expression;
//   //   //   }
//   //   // }
//   //   //
//   //   // for (let value of array) {
//   //   //
//   //   //   const replacement = replaceDeep(replacementExpression, wilcard, value);
//   //   //
//   //   //   const item = await this.resolve(field, replacement);
//   //   //
//   //   //   output.push(item);
//   //   //
//   //   // }
//   //   //
//   //   // return output.join(glue);
//   //
//   //   const array = await this.map(field, expression, wildcard, replacementExpression);
//   //   return array.join(glue);
//   // }
//   //
//   // static async concat(field, ...values) {
//   //   // return values.reduce((array, item) => {
//   //   //   const value = await this.resolve(field, item);
//   //   //   if (Array.isArray(value)) {
//   //   //     array.push(...value);
//   //   //   } else {
//   //   //     array.push(value);
//   //   //   }
//   //   //   return array;
//   //   // }, []);
//   //
//   //   values = await this.resolveAll(field, values);
//   //
//   //   return values.reduce((array, value) => {
//   //     if (Array.isArray(value)) {
//   //       array.push(...value);
//   //     } else {
//   //       array.push(value);
//   //     }
//   //     return array;
//   //   }, []);
//   //
//   //   // return values.reduce((array, value) => Array.isArray(value) ? [...array, ...value] : [...array, value], []);
//   //
//   //   // return Promise.all(values.map(item => this.resolve(field, item))).reduce((array, value) => {
//   //   //   if (Array.isArray(value)) {
//   //   //     array.push(...value);
//   //   //   } else {
//   //   //     array.push(value);
//   //   //   }
//   //   //   return array;
//   //   // }, []);
//   // }
//   //
//   // static raw(field, ...value) {
//   //   return value;
//   // }
//   //
//   // static async object(field, value) {
//   //   if (value && value.constructor === Object) {
//   //     const object = {};
//   //     for (let i in value) {
//   //       object[i] = await this.resolve(field, value[i]);
//   //     }
//   //     return object;
//   //   }
//   //   return this.resolve(field, value);
//   // }
//   //
//   // static async getChild(field, value, ...path) {
//   //   value = await this.resolve(field, value);
//   //   path = await this.resolveAll(field, path);
//   //   return KarmaFieldsAlpha.DeepObject.get(value, ...path);
//   // }
//   //
//   // static async item(field, ...path) {
//   //   path = await this.resolveAll(field, path);
//   //   return KarmaFieldsAlpha.DeepObject.get(field.loopItem, ...path);
//   // }
//   //
//   // static async convert(field, value, type) {
//   //   value = await this.resolve(field, value);
//   //   return KarmaFieldsAlpha.Type.convert(value, type);
//   // }
//   //
//   //
//   //
//   //
//   //
//   //
//   //
//   // static async count(field, array) {
//   //   array = await this.resolve(field, array);
//   //   return array.length;
//   // }
//   //
//   // static async empty(field, array) {
//   //   array = await this.resolve(field, array);
//   //   return array.length === 0;
//   // }
//   //
//   // static async actives(field) {
//   //   return await field.request("actives");
//   // }
//   //
//   // static async selection(field) {
//   //   return await field.request("selection");
//   // }
//   //
//   //
//   //
//   //
//   // static async taxonomy(field, taxonomy) {
//   //   // return this.resolve(field, [
// 	// 	// 	"<ul>##</ul>",
// 	// 	// 	"replace",
// 	// 	// 	"##",
// 	// 	// 	[
// 	// 	// 		"loop",
//   //   //     ["getArray", taxonomy],
// 	// 	// 		"%%",
// 	// 	// 		[
// 	// 	// 			"<li><a hash=\"driver=taxonomy&taxonomy=##\">##</a></li>",
// 	// 	// 			"replace",
// 	// 	// 			"##",
//   //   //       taxonomy
// 	// 	// 			["query", "taxonomy?taxonomy=category", "%%", "name"]
// 	// 	// 		]
// 	// 	// 	]
// 	// 	// ]);
//   //
//   //   return this.resolve(field, [
//   //     "replace",
// 	// 		"<ul>#</ul>",
// 	// 		"#",
// 	// 		[
//   //       "js",
// 	// 			"join",
//   //       [
//   //         "map",
//   //         ["get", "array", taxonomy],
//   //         [
//   //           "replace",
//   //           "<li><a hash=\"driver=taxonomy&taxonomy=#\">#</a></li>",
//   //           "#",
//   //           ["item"],
//   //           [
//   //             "query",
//   //             "taxonomy",
//   //             ["replace", "taxonomy=#", "#", taxonomy],
//   //             [],
//   //             "string",
//   //             ["item"],
//   //             "name"
//   //           ]
//   //         ]
//   //       ],
//   //       ""
// 	// 		]
// 	// 	]);
//   // }
//   //
//   //
//   // static async geocoding(field, value) {
//   //   const url = "https://www.mapquestapi.com/geocoding/v1/address?key=KEY&location="+value+",CH";
//   //   const response = await fetch(url).then(response => response.json());
//   //
//   //   if (response.results && response.results[0] && response.results[0].locations && response.results[0].locations.length) {
//   //     const locations = response.results[0].locations;
//   //     const location = locations.find(location => value.includes(location.adminArea5)) || locations[0];
//   //     const latLng = location.latLng;
//   //     return latLng.lat+", "+latLng.lng; // + " ("+response.results.length+"/"+response.results[0].locations.length+")";
//   //   }
//   //   return "?";
//   // }
//
//
// }
