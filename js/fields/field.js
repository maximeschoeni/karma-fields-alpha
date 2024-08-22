
// KarmaFieldsAlpha.loading = Symbol("loading");
// KarmaFieldsAlpha.mixed = Symbol("mixed");

KarmaFieldsAlpha.field = class {

  static fieldId = 0;
  static uniqueId = 1;

  constructor(resource, id, parent) {

    if (resource.field && KarmaFieldsAlpha.tables[resource.field]) {

      this.resource = {...KarmaFieldsAlpha.tables[resource.field], ...resource};

    } else {

      this.resource = resource || {};

    }

		this.fieldId = KarmaFieldsAlpha.field.fieldId++;



    this.id = id || 0;

    if (parent) {

      this.parent = parent;
      this.uid = `${parent.uid}-${this.id}`;
      this.path = [...parent.path, this.id];
      // this.states = parent.states && parent.states[this.id];
      // this.data = parent.data && parent.data[this.id];

    } else {

      this.uid = this.id;
      this.path = [this.id];

      // console.warn("ORPHAN CHILD!", this)

    }

  }

  getKey() {

    return this.resource.key;

  }

  getLabel() {

    if (Array.isArray(this.resource.label)) {

      return this.parse(this.resource.label);

    }

    return new KarmaFieldsAlpha.Content(this.resource.label);

  }

  queryLabel() {

    if (this.resource.label || this.resource.title) { // compat

      return this.parse(this.resource.label || this.resource.title);

    } else if (this.parent) {

      return this.parent.queryLabel();

    } else {

      return new KarmaFieldsAlpha.Content("");

    }

  }

  getUid() {
    return this.uid;
  }

  getConstructor(type) {

    if (type.type) {

      type = type.type;

    }

    if (this.constructor[type] && typeof this.constructor[type] === "function") {

      return this.constructor[type];

    }

    if (this.parent) {

      return this.parent.getConstructor(type);

    }

    // console.log(type, this.constructor, Object.keys(this.constructor));
    // console.error("Field type does not exist", type);

  }

  // createChildField(type = "group", resource = {}) {
  //
  //   const child = new constructor[type](resource);
  //
  //   this.registerChild(child);
  //
  //   return child;
  // }

  registerChild(field, id) {

    console.error("Deprecated");

    field.parent = this;
    field.id = id;
    field.init();

  }


  createChild(resource, id) {

    if (typeof resource === "string") {

      if (KarmaFieldsAlpha.tables[resource]) {

        resource = KarmaFieldsAlpha.tables[resource];

      } else {

        resource = {
          type: resource
        };

      }

    }

    if (resource.field && KarmaFieldsAlpha.tables[resource.field]) {

      resource = {...KarmaFieldsAlpha.tables[resource.field], ...resource};

    }

    // compat
    if (id === undefined) {

      id = resource.index || resource.type || "no-index";

    }

    const constructor = this.getConstructor(resource.type || "group");

    if (!constructor) {

      console.error("constructor does not exist", constructor, resource, this);

    }

    const child = new constructor(resource, id, this);

    return child;
  }

  // init() {
  //
  //   this.uid = `${this.parent.uid}-${this.id}`;
  //   this.path = [...this.parent.path, this.id];
  //   // this.options = this.parent.options && this.parent.options[this.id];
  //   this.states = this.parent.states && this.parent.states[this.id];
  //   this.data = this.parent.data && this.parent.data[this.id];
  //
  // }


  useClipboard() {

    return KarmaFieldsAlpha.server.queryState("fields", "", "clipboard") || false;

  }

  getFocus() {

    return KarmaFieldsAlpha.server.queryState("fields", "", "focus") || "";

  }

  getFocusPath() {

    return KarmaFieldsAlpha.server.queryState("fields", "", "focusPath") || [];

  }

  async setFocus(useClipboard, fieldId, path) {

    await KarmaFieldsAlpha.server.setState(useClipboard || false, "fields", "", "clipboard");
    await KarmaFieldsAlpha.server.setState(fieldId || this.uid, "fields", "", "focus");
    await KarmaFieldsAlpha.server.setState(path || this.path, "fields", "", "focusPath");

    if (useClipboard) {
      document.getElementById("karma-fields-alpha-clipboard").focus({preventScroll: true});
    }

  }

  async removeFocus() {

    // return this.setFocus(true, "");

    await KarmaFieldsAlpha.server.setState(true, "fields", "", "clipboard"); // remove any element focus
    await KarmaFieldsAlpha.server.setState("", "fields", "", "focus");
    await KarmaFieldsAlpha.server.setState("", "fields", "", "focusPath");

    document.getElementById("karma-fields-alpha-clipboard").focus({preventScroll: true});

  }

  hasFocus() {

    return this.getFocus() === this.uid;

  }

  hasFocusInside(...path) {

    let focus = this.getFocus();

    if (path.length) {

      focus = [focus, ...path].join("-");

    }

    return focus.startsWith(this.uid);

  }

  getState(key, fieldId) {

    return KarmaFieldsAlpha.server.queryState("fields", fieldId || this.uid, key);

  }

  setState(value, key, fieldId) {

    return KarmaFieldsAlpha.server.setState(value, "fields", fieldId || this.uid, key);

  }

  removeState(key, fieldId) {

    // not used

    return KarmaFieldsAlpha.server.removeState("fields", fieldId || this.uid, key);

  }

  getData(key, fieldId) { // created for tinymce popup linkforms

    return KarmaFieldsAlpha.server.getData(fieldId || this.uid, key);

  }

  setData(value, key, fieldId) {

    KarmaFieldsAlpha.server.setData(value, fieldId || this.uid, key);

  }


  getSelection(fieldId) {

    return KarmaFieldsAlpha.server.queryState("fields", fieldId || this.uid, "selection") || {};

  }

  setSelection(selection, fieldId) {

    return KarmaFieldsAlpha.server.setState(selection, "fields", fieldId || this.uid, "selection");

  }

  removeSelection(fieldId) {

    return this.setSelection({}, fieldId);

  }



  // useClipboard() {
  //
  //   return this.parent.useClipboard();
  //
  // }
  //
  //
  // getFocus() {
  //
  //   return this.parent.getFocus();
  //
  // }
  //
  // setFocus(useClipboard, fieldId) {
  //
  //   return this.parent.setFocus(useClipboard, fieldId || this.uid);
  //
  // }
  //
  // removeFocus() {
  //
  //   return this.parent.removeFocus();
  //
  // }



  // async getRelativeFocus() {
  //
  //   const focus = await this.getFocus();
  //
  //   if (this.path.every((id, index) => id === focus[index])) {
  //
  //     return focus.slice(this.path.length);
  //
  //   }
  //
  // }

  getFocusField() {

    if (this.parent) {

      return this.parent.getFocusField();

    }

  }

  // async submit() {
  //
  //   await KarmaFieldsAlpha.server.submit();
  //
  // }

  submit() {

    if (this.parent) {

      return this.parent.submit();

    } else {

      return KarmaFieldsAlpha.server.submit();

    }

  }

  hasDelta() {

    return KarmaFieldsAlpha.server.hasDelta();

  }

  getDelta() {

    return KarmaFieldsAlpha.server.getDelta();

  }

  // getSelection(fieldId) {
  //
  //   return this.parent.getSelection(fieldId || this.uid);
  //
  // }
  //
  // setSelection(selection, fieldId) {
  //
  //   return this.parent.setSelection(selection, fieldId || this.uid);
  //
  // }
  //
  // removeSelection(fieldId) {
  //
  //   return this.parent.removeSelection(fieldId || this.uid);
  //
  // }

  save(id, name) {

    return KarmaFieldsAlpha.History.save(id, name);

  }


  getChildren() {

		return this.resource.children || [];

	}


  newChild(index) {

    const children = this.getChildren();

		if (children) {

			let resource = children[index];

			if (resource) {

				if (typeof resource === "string") {

					resource = {type: resource};

				}

				return this.createChild(resource, index);

			}

		}

  }


  getChild(index, ...path) {

    let child = this.newChild(index);

    if (child && path.length) {

      return child.getChild(...path);

    }

    return child;

  }

  request(functionName, ...args) {

    if (this[functionName]) {

      return this[functionName](...args);

    } else if (this.parent) {

      return this.parent.request(functionName, ...args);

    }

  }

  // getState(key, fieldId) {
  //
  //   return this.parent.getState(key, fieldId || this.uid);
  //
  // }
  //
  // setState(value, key, ...path) {
  //
  //   return this.parent.setState(value, key, fieldId || this.uid);
  //
  // }
  //
  // removeState(key) {
  //
  //   return this.parent.removeState(key, fieldId || this.uid);
  //
  // }

  getRoot() {

    if (this.parent) {

      return this.parent.getRoot();

    }

    return this;
  }


  render() {

    return this.parent.render();

  }

  getResource(key) {

    if (this.resource[key] !== undefined) {

      return this.resource[key];

    } else if (this.parent) {

      return this.parent.getResource(key);
    }

  }

  getResources() {

    return this.resource;

  }

  getContent(...path) {

    return this.parent.getContent(...path);

  }

  setValue(value, ...path) {

    return this.parent.setValue(value, ...path);

  }

  getDriver() {

		return this.resource.driver || this.parent.getDriver();

	}

  // used by array
  getKeys() {

    const key = this.getKey();
    let keys = [];

    if (key) {

      keys.push(key);

    } else if (this.resource.children) {

      // for (let resource of this.resource.children) {
      //
      //   const child = this.createChild(resource);
      //
      //   keys.push(...child.getKeys());
      //
  		// }

      for (let i = 0; i < this.resource.children.length; i++) {

        const child = this.getChild(i);

        keys.push(...child.getKeys());

  		}

    }

    return keys;

  }


  export() { // -> return collection (array of strings)

    let collection = new KarmaFieldsAlpha.Content();

    if (this.resource.children && this.resource.export !== false) {

      for (let i = 0; i < this.resource.children.length; i++) {

				const child = this.getChild(i);

        if (child) {

          const content = child.export();

          if (content.loading) {

            collection.loading = true;

          } else {

            collection.value = [...collection.toArray(), ...content.toArray()];

          }

        }

			}

		}

		return collection;
  }

  async import(collection) {

    if (this.resource.children) {

      for (let i = 0; i < this.resource.children.length; i++) {

				const child = this.getChild(i);

        await child.import(collection);

			}

		}

  }




  getWild(driver, id, key) {

    return this.parent.getWild(driver, id, key);

  }

  queryCount(driver, paramstring) {

    // return this.parent.getCount(driver, paramstring);

    return KarmaFieldsAlpha.server.queryCount(driver, paramstring);

  }

  getIds(driver, paramstring) {

    return this.parent.getIds(driver, paramstring);

  }

  getOptionsList(driver, paramstring, keys) {

    // return this.parent.getOptionsList(driver, paramstring, keys);
    return KarmaFieldsAlpha.server.queryOptionsList(driver, paramstring, keys);

  }

  getGrid(driver, paramstring, keys) {

    return this.parent.getGrid(driver, paramstring, keys);

  }



  parse(expression) {

    // compat
    if (expression && typeof expression === "object" && !Array.isArray(expression)) {

      // console.warn("Please use parseObject function!");

      return this.parseObject(expression);

    }


    let response = new KarmaFieldsAlpha.Content();

    if (expression && Array.isArray(expression)) {

      switch (expression[0]) {

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
        case "+":
        case "-":
        case "*":
        case "/":
        case "%": {
          const v1 = this.parse(expression[1]);
          const v2 = this.parse(expression[2]);
          // response = KarmaFieldsAlpha.Expression.compare(expression[0], v1, v2);
          if (v1.loading || v2.loading) {
            response.loading = true;
          } else {
            switch (expression[0]) {
              case "=":
              case "==":
                response.value = v1.toSingle() == v2.toSingle();
                break;
              case "===":
                response.value = v1.toSingle() === v2.toSingle();
                break;
              case "!=":
                response.value = v1.toSingle() != v2.toSingle();
                break;
              case "!==":
                response.value = v1.toSingle() !== v2.toSingle();
                break;
              case ">":
                response.value = v1.toSingle() > v2.toSingle();
                break;
              case "<":
                response.value = v1.toSingle() < v2.toSingle();
                break;
              case ">=":
                response.value = v1.toSingle() >= v2.toSingle();
                break;
              case "<=":
                response.value = v1.toSingle() <= v2.toSingle();
                break;
              case "like":
                response.value = v1.toString().match(new RegExp(v2.toString()));
                break;
              case "+":
                response.value = v1.toNumber() + v2.toNumber();
                break;
              case "-":
                response.value = v1.toNumber() - v2.toNumber();
                break;
              case "*":
                response.value = v1.toNumber() * v2.toNumber();
                break;
              case "/":
                response.value = v1.toNumber() / v2.toNumber();
                break;
              case "%":
                response.value = v1.toNumber() % v2.toNumber();
                break;
            }
          }
          break;
        }
        case "&&": {
          const values = expression.slice(1);
          response = this.parse(values.shift());
          if (!response.loading && values.length && response.toBoolean()) {
            response = this.parse(["&&", ...values]);
          }
          break;
        }
        case "||": {
          const values = expression.slice(1);
          response = this.parse(values.shift());

          if (!response.loading && values.length && !response.toBoolean()) {
            response = this.parse(["||", ...values]);
          }
          break;
        }
        case "!": {
          const value = this.parse(expression[1]);
          if (value.loading) {
            response.loading = true;
          } else {
            response.value = !value.toBoolean();
          }
          break;
        }
        case "?": {
          const condition = this.parse(expression[1]);
          if (condition.loading) {
            response.loading = true;
          } else {
            response = condition.toBoolean() ? this.parse(expression[2]) : this.parse(expression[3]);
          }
          break;
        }
        case "...":
        case "concat": {
          const items = expression.slice(1).map(item => this.parse(item));
          if (items.some(item => item.loading)) {
            response.loading = true;
          } else {
            response.value = items.reduce((array, item) => [...array, ...item.toArray()], []);
          }
          break;
        }
        case "math": {
          const method = expression[1];
          const values = expression.slice(2).map(value => this.parse(value));
          if (values.some(value => value.loading)) {
            response.loading = true;
          } else if (Math[expression[1]]) {
            response.value = Math[expression[1]](...values.map(value => value.toNumber()));
          }
          break;
        }
        case "include": {
          const array = this.parse(expression[1]);
          const value = this.parse(expression[2]);
          if (array.loading || value.loading) {
            response.loading = true;
          } else {
            response.value = array.toArray().include(value.toSingle());
          }
          break;
        }
        case "replace": {
          const string = this.parse(expression[1]);
          const wildcard = expression[2];
          const replacements = expression.slice(3).map(replacement => this.parse(replacement));
          if (string.loading || replacements.some(value => value.loading)) {
            response.loading = true;
          } else if (replacements.length) {
            const grid = replacements.map(replacement => replacement.toArray());
            response.value = grid[0].map((item, i) => grid.reduce((string, replacements) => string.replace(wildcard, replacements[i]), string.toString()));
          }
          break;
        }
        case "date": {
          const date = this.parse(expression[1]);
          const option = expression[2] || {}; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
          const locale = expression[3] || KarmaFieldsAlpha.locale || "en";
          if (date.loading) {
            response.loading = true;
          } else {
            const string = date.toString();
            if (!string || string === "now") {
              response.value = (new Date()).toLocaleDateString(locale, option);
            } else {
              const dateObj = new Date(string);
              if (isNaN(dateObj)) {
                response.value = "";
              } else {
                response.value = dateObj.toLocaleDateString(locale, option);
              }
            }
          }
          break;
        }
        case "daterange": {
          let date1 = this.parse(expression[1]);
          let date2 = this.parse(expression[2]);
          const separator = expression[3] || ' - ';
          const locale = expression[4] || KarmaFieldsAlpha.locale || "en";
          const options = expression[5] || {year: "numeric", month: "2-digit", day: "2-digit"};
          if (date1.loading || date2.loading) {
            response.loading = true;
          } else {
            date1 = new Date(date1.toString());
            date2 = new Date(date2.toString());
            if (isNaN(date2)) {
              if (isNaN(date1)) {
                response.value = "";
              } else {
                response.value = date1.toLocaleDateString(locale, options);
              }
            } else {
              if (date1.getFullYear() === date2.getFullYear()) {
                if (date1.getMonth() === date2.getMonth()) {
                  response.value = `${date1.toLocaleDateString(locale, {day: options.day})}${separator}${date2.toLocaleDateString(locale, options)}`;
                } else {
                  response.value = `${date1.toLocaleDateString(locale, {day: options.day, month: options.month})}${separator}${date2.toLocaleDateString(locale, options)}`;
                }
              } else {
                response.value = `${date1.toLocaleDateString(locale, options)}${separator}${date2.toLocaleDateString(locale, options)}`;
              }
            }
          }
          break;
        }
        case "year":
          // response = this.parse(["date", expression[1] || "", {year: expression[2] || "numeric"}]);
          // break;
        case "month":
        case "day":
          console.error("DEPRECATED (use date)");
          break;
        case "request": {
          var params = expression.slice(1).map(param => this.parse(param));
          if (params.some(param => param.loading)) {
            response.loading = true;
          } else {
            const result = this.request(...params.map(param => param.value));
            if (result instanceof KarmaFieldsAlpha.Content) { // compat
              response = result;
            } else {
              response.value = result;
            }
          }
          break;
        }
        case "getItem": // compat
        case "getValue": // which one ?
        case "getContent": {
          if (expression[1]) {
            const key = this.parse(expression[1]);
            response = this.parent.getContent(key.toString());
          } else {
            response = this.getContent();
          }
          break;
        }
        case "queryValue": {
          const driver = this.parse(expression[1]);
          const id = this.parse(expression[2]);
          const key = this.parse(expression[3]);
          if (driver.loading || id.loading || key.loading) {
            response.loading = true;
          } else if (driver.toString() && id.toString() && key.toString()) {
            // const form = new KarmaFieldsAlpha.field.form({
            //   driver: driver.toString()
            // });
            // response = form.getValueById(id.toString(), key.toString());
            // const server = new KarmaFieldsAlpha.Server(driver.toString());
            // response = server.getValue(id.toString(), key.toString());
            response = this.getWild(driver.toString(), id.toString(), key.toString());
          }
          break;
        }
        case "query": {
          const driver = this.parse(expression[1]);
          const params = this.parseObject(expression[2]);
          const output = expression[3] || "ids";
          if (driver.loading || params.loading) {
            response.loading = true;
          } else {
            // const table = new KarmaFieldsAlpha.field.table({
            //   driver: driver.toString(),
            //   params: params.toObject()
            // });
            // await table.load();
            // const server = new KarmaFieldsAlpha.Server(driver.toString());
            // await server.query(params.toObject());
            // if (server.loading) {
            //   response.loading = true;
            // } else if (output === "count") {
            //   response = table.getCount();
            // } else if (output === "options") {
            //   response = server.getOptionsList();
            // } else {
            //   response.value = server.ids;
            // }

            const paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());

            if (output === "count") {
              response = this.getCount(driver.toString(), paramstring);
            } else if (output === "options") {
              response = this.getOptionsList(driver.toString(), paramstring);
            } else {
              response = this.getIds(driver.toString(), paramstring);
            }
          }
          break;
        }
        case "queryCount": {
          const driver = this.parse(expression[1]);
          const params = this.parseObject(expression[2]);
          if (driver.loading || params.loading) {
            response.loading = true;
          } else {
            const paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());
            response = this.getCount(driver.toString(), paramstring);
          }
          break;
        }
        case "parseParams":
          console.error("DEPRECATED");
          break;
        case "getGrid":
        case "getOptions": {
          const driver = this.parse(expression[1]);
          const params = this.parseObject(expression[2]);
          const keys = expression[3];
          if (driver.loading || params.loading) {
            response.loading = true;
          } else {
            const paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());
            response = this.getOptionsList(driver.toString(), paramstring);
          }
          break;
        }
        case "map": {
          const array = this.parse(expression[1]);
          if (array.loading) {
            response.loading = true;
          } else {
            response.value = array.toArray().map(value => {
              const mapItem = new KarmaFieldsAlpha.Expression(value, this);
              return mapItem.parse(expression[2]);
            });
            response.loading = response.value.some(value => value.loading);
          }
          break;
        }
        case "join": {
          const array = this.parse(expression[1]);
          const glue = expression[2] || ", ";
          if (array.loading) {
            response.loading = true;
          } else {
            response.value = array.toArray().join(glue);
          }
          break;
        }
        case "indexOf":
          console.error("deprecated");
          break;
        case "sum": {
          const array = this.parse(expression[1]);
          if (array.loading) {
            response.loading = true;
          } else {
            response.value = array.toArray().reduce((accumulator, item)=> accumulator + Number(item), 0);
          }
          break;
        }
        case "getLength":
        case "count": {
          const array = this.parse(expression[1]);
          if (array.loading) {
            response.loading = true;
          } else {
            response.value = array.toArray().length;
          }
          break;
        }
        case "getParam": {
          var key = this.parse(expression[1]);
          if (key.loading) {
            response.loading = true;
          } else {
            response.value = this.getParam(key.toString());
          }
          break;
        }
        case "isLoading": {
          const content = this.parse(expression[1]);
          response.value = content.loading;
          break;
        }
        case "isMixed": {
          const content = this.parse(expression[1]);
          response.value = content.mixed;
          break;
        }
        case "getKey":
        case "getIndex":// deprec
        case "getIds":
        case "get":
        case "getAt":
        case "array":
          console.error("deprecated", expression);
          break;

        case "debug":
        case "dump":
        case "log":
          debugger;
          response = this.parse(expression[1]);
          console.log(response);
          break;
        case "max": {
          const array = this.parse(expression[1]);
          if (array.loading) {
            response.loading = true;
          } else {
            response.value = array.toArray().reduce((accumulator, item) => Math.max(accumulator, Number(item)), 0);
          }
          break;
        }
        case "min": {
          const array = this.parse(expression[1]);
          if (array.loading) {
            response.loading = true;
          } else {
            response.value = array.toArray().reduce((accumulator, item) => Math.min(accumulator, Number(item)), Infinity);
          }
          break;
        }
        case "resource": {
          var key = this.parse(expression[1]);
          response.value = this.resource[key.toString()];
          break;
        }
        case "parent":
          response = this.parent.parse(expression);
          break;

        default:
          response.value = expression;
          break;

      }

    } else {

      response.value = expression;

    }

    return response;


  }

  // parseObject(object) {
  //
  //   const response = new KarmaFieldsAlpha.Content();
  //
  //   let entries = Object.entries(object).map(([key, value]) => [key, this.parse(value)]);
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

  parseObject(object) {

    const response = new KarmaFieldsAlpha.Content({});

    for (let key in object) {

      const value = this.parse(object[key]);

      if (response.loading || value.loading) {

        response.loading = true;

      } else {

        response.value[key] = value.toString();

      }

    }

    return response;

  }



  getOptions() {

    console.error("deprecated");

		let options = [];

		if (this.resource.options) {

			options = this.parse(this.resource.options);

      if (!options || options === KarmaFieldsAlpha.loading) {

        return;

      }

		}

    let moreOptions;

		if (this.resource.driver) {

      moreOptions = KarmaFieldsAlpha.Query.getOptions(this.resource.driver, this.resource.params || {});

		} else if (this.resource.table) {

      const grid = this.request("getGrid", this.resource.table);

      if (grid && grid.resource.driver) {

        moreOptions =  KarmaFieldsAlpha.Query.getOptions(grid.resource.driver, grid.resource.params || {});

      }

		}

    if (moreOptions) {

      options = [...options, ...moreOptions];

    }

		return options;

	}

  async *create() {

    console.error("deprecated");

    if (this.resource.children) {

      for (let i = 0; i < this.resource.children.length; i++) {

        const resource = this.resource.children[i];
        const child = this.createChild(resource, i);

        yield* child.create();

      }

    }

  }

  // createToken() {
  //
  //   // -> shouldnt be in table field ???
  //
  //   let token = KarmaFieldsAlpha.Store.State.get("token") || 0;
  //
  //   token++;
  //
  //   KarmaFieldsAlpha.Store.State.set(token, "token");
  //
  //   return token;
  // }

  // getParams() { // overrided by table field
  //
  //   return this.parent.getParams(); // return Content
  //
  // }


  getParam(key) { // overrided by form

    if (this.parent) {

      return this.parent.getParam(key);

    }


  }

  setParam(value, key) { // overrided by form

    if (this.parent) {

      return this.parent.setParam(value, key);

    }

  }

  queryParams() {

    if (this.parent) {

      return this.parent.queryParams();

    }



  }


  add(...args) {

    if (this.parent) {

      return this.parent.add(...args);

    }

  }

  delete(...args) { // needed eg. when deleting tag by delete key

    if (this.parent) {

      return this.parent.delete(...args);

    }

  }

  paste(...args) {

    if (this.parent) {

      return this.parent.paste(...args);

    }

  }

  getChildByPath(childId, ...path) {

    console.error("deprecated");

    const child = this.getChild(childId);

    if (child) {

      if (path.length) {

        return child.getChildByPath(...path);

      } else {

        return child;

      }

    }

  }

  getField(...path) {

    console.error("deprecated");

    return this.parent.getField(...path);

  }

  closest(callback) {

    if (callback(this, this.resource)) {

      return this;

    } else if (this.parent) {

      return this.parent.closest(callback);

    }

  }

  hasTask() {

    return false;

  }


  exportDefaults() {

    let defaults = new KarmaFieldsAlpha.Content({})

		const children = this.getChildren();

    for (let i = 0; i < children.length; i++) {

      const child = this.getChild(i);

      const response = child.exportDefaults();

      if (response.loading) {

        defaults.loading = true;

      } else {

        defaults.value = {...defaults.toObject(), ...response.toObject()};

      }

		}

    return defaults;

	}

  getIndex() { // for table rows numbering

    return this.parent.getIndex();

  }


  undo() {

    KarmaFieldsAlpha.history.undo();

  }

  redo() {

    KarmaFieldsAlpha.history.redo();

  }


};
