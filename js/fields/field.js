
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

    // compat
    if (id === undefined) {

      id = resource.index || resource.type || "no-index";

    }
// if (resource.type === "apply") debugger;
    const constructor = this.getConstructor(resource.type || "group");

    if (!constructor) {

      debugger;
      this.getConstructor(resource.type || "group");

    }

    const child = new constructor(resource, id, this);

    // child.parent = this;
    // child.id = id;
    // child.uid = `${this.uid}-${id}`;
    // child.path = [...this.path, id];
    // child.options = this.options && this.options[id];

    // child.init();

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

    // return KarmaFieldsAlpha.Store.State.set(true, "clipboard");
    return KarmaFieldsAlpha.Database.States.get("focus", "", "", "clipboard");

  }


  getFocus() {

    // return KarmaFieldsAlpha.Store.State.get("focus");
    return KarmaFieldsAlpha.Database.States.get("focus", "", "", "path");

  }

  async setFocus(useClipboard = false) {

    // await KarmaFieldsAlpha.Store.State.set(useClipboard, "clipboard");
    // await KarmaFieldsAlpha.Store.State.set(this.path, "focus");


    await KarmaFieldsAlpha.Database.States.set(this.uid, "focus", "", "", "uid");
    await KarmaFieldsAlpha.Database.States.set(this.path, "focus", "", "", "path");
    await KarmaFieldsAlpha.Database.States.set(useClipboard, "focus", "", "", "clipboard");

    // await KarmaFieldsAlpha.Database.States.insert(useClipboard, "focus", "", "", [
    //   {
    //     key: "uid",
    //     value: this.uid
    //   },
    //   {
    //     key: "path",
    //     value: this.path
    //   },
    //   {
    //     key: "clipboard",
    //     value: useClipboard
    //   }
    // ]);

  }

  async removeFocus() {

    // await KarmaFieldsAlpha.Database.States.remove("focus", "", "", "uid");
    // await KarmaFieldsAlpha.Database.States.remove("focus", "", "", "path");
    // await KarmaFieldsAlpha.Database.States.remove("focus", "", "", "clipboard");

    await KarmaFieldsAlpha.Database.States.remove("focus");

  }

  async hasFocus() {

    // const focus = await this.getFocus();
    //
    // return focus && focus.length === this.path.length && this.path.every((id, index) => id === focus[index]) || false;

    const focusId = await KarmaFieldsAlpha.Database.States.get("focus", "", "", "uid");



    return this.uid === focusId;

  }

  async hasFocusInside(...path) {

    const focus = await this.getFocus();

    return Boolean(focus && [...this.path, ...path].every((id, index) => id === focus[index]));

    // const focusId = await KarmaFieldsAlpha.Database.States.get("focus", "", "", "uid");
    //
    // return Boolean(focusId && focusId.startsWith(this.uid));



  }

  async getRelativeFocus() {

    const focus = await this.getFocus();

    if (this.path.every((id, index) => id === focus[index])) {

      return focus.slice(this.path.length);

    }

  }

  getFocusField() {

    if (this.parent) {

      return this.parent.getFocusField();

    }

  }

  getSelection(...path) {

    if (path.length) console.error("getSelection no longer accept multiple parameters");

    // return KarmaFieldsAlpha.Store.State.get("fields", ...this.path, "selection", ...path);

    // return KarmaFieldsAlpha.Database.States.get("internal", "fields", this.uid, "selection");

    return KarmaFieldsAlpha.Database.States.get("selection", "", "", this.uid);

    // return {
    //   index: await KarmaFieldsAlpha.Database.States.get("selection", "", this.uid, "index") || 0,
    //   length: await KarmaFieldsAlpha.Database.States.get("selection", "", this.uid, "length") || 0
    // };

  }

  setSelection(value, ...path) {

    if (path.length) console.error("setSelection no longer accept multiple parameters");

    // return KarmaFieldsAlpha.Store.State.set(value, "fields", ...this.path, "selection", ...path);

    return KarmaFieldsAlpha.Database.States.set(value, "selection", "", "", this.uid);

  }

  removeSelection() {

    // return KarmaFieldsAlpha.Store.State.remove("fields", ...this.path, "selection");

    return KarmaFieldsAlpha.Database.States.remove("selection", "", "", this.uid);

  }

  save(id, name) {

    return KarmaFieldsAlpha.History.save(id, name);

  }

  lift(tail, action, ...args) {

    console.error("deprecated");

    // to be replace by getChild...

    if (tail.length) {

      const [id, ...subtail] = tail;
      const child = this.getChild(id);

      if (child) {

        return child.lift(subtail, action, ...args);

      }

    } else if (this[action]) {

      return this[action](...args);

    }

  }

  addTask(resolve, type) {

    console.error("Deprecated");

    KarmaFieldsAlpha.Store.Tasks.add({
      type: type,
      resolve: resolve
    });

  }

  findTask(callback) {

    console.error("Deprecated");

    const tasks = KarmaFieldsAlpha.Store.Tasks.get();

    if (tasks) {

      return tasks.find(callback);

    }

  }

  getTask() {

    console.error("Deprecated");

    return this.getOption("tasks");

  }

  setTask(task) {

    console.error("Deprecated");

    this.setOption(task, "tasks");

  }

  createTask(...args) {

    console.error("Deprecated");

    // this.setOption(args, "tasks");

    KarmaFieldsAlpha.taskflag = true;

    // const tasks = this.getOption("tasks") || [];
    //
    // tasks.push(args);

    this.setOption(args, "tasks");

  }

  // doTask() {
  //
  //   const task = this.getOption("tasks");
  //
  //   if (task) {
  //
  //     const [methodName, ...args] = task;
  //
  //     this.removeOption("tasks");
  //
  //     this[methodName](...args);
  //
  //   }
  //
  // }

  procrastinate(functionName, ...args) {

    console.error("Deprecated");

    KarmaFieldsAlpha.Task.add({
      type: "grind",
      resolve: () => this[functionName](...args)
    });

  }

  hasTask() {

    console.log(KarmaFieldsAlpha.task);

    return Boolean(KarmaFieldsAlpha.task);

  }


  // doTask(generator, ...args) {
  //
  //   if (this[generator]) {
  //
  //     const work = this[generator](...args);
  //
  //     KarmaFieldsAlpha.Jobs.add(work);
  //
  //   } else if (this.parent) {
  //
  //     return this.parent.do(jobName, ...args);
  //
  //   }
  //
  // }

  getChildren() {

		return this.resource.children || [];

	}

	// getChild(index) {
  //
	// 	const children = this.getChildren();
  //
	// 	if (children) {
  //
	// 		let resource = children[index];
  //
	// 		if (resource) {
  //
	// 			if (typeof resource === "string") {
  //
	// 				resource = {type: resource};
  //
	// 			}
  //
	// 			return this.createChild({
	// 				id: index,
	// 				...resource,
	// 				index: index
	// 			}, index);
  //
	// 		}
  //
	// 	}
  //
	// }

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

  getOption(...path) {

    console.error("Deprecated");

    return KarmaFieldsAlpha.Store.State.get("fields", ...this.path, ...path);

  }

  setOption(data, ...path) {

    console.error("Deprecated");

    KarmaFieldsAlpha.Store.State.set(data, "fields", ...this.path, ...path);

  }

  removeOption(...path) {

    console.error("Deprecated");

    KarmaFieldsAlpha.Store.State.remove("fields", ...this.path, ...path);

  }

  getState(key, ...path) {

    if (path.length) console.error("getState no longer accept multiple parameters");

    // return KarmaFieldsAlpha.Store.State.get("fields", ...this.path, "states", ...path);

    return KarmaFieldsAlpha.Database.States.get("fieldstate", "", this.uid, key);

  }

  setState(data, key, ...path) {

    if (path.length) console.error("setState no longer accept multiple parameters");

    return KarmaFieldsAlpha.Database.States.set(data, "fieldstate", "", this.uid, key);

  }

  removeState(key) {

    return KarmaFieldsAlpha.Database.States.remove("fieldstate", "", this.uid, key);

  }

  getData(...path) {

    console.warn("Still Needed?");

    return KarmaFieldsAlpha.Store.get("fields", ...this.path, "data", ...path);

  }

  setData(data, ...path) {

    console.warn("Still Needed?");

    return KarmaFieldsAlpha.Store.set(data, "fields", ...this.path, "data", ...path);

  }

  removeData(...path) {

    console.warn("Still Needed?");

    return KarmaFieldsAlpha.Store.remove("fields", ...this.path, "data", ...path);

  }

  getRoot() {

    if (this.parent) {

      return this.parent.getRoot();

    }

    return this;
  }


  render() {

    return this.parent.render();

  }

  rendering() {

    return KarmaFieldsAlpha.rendering;

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

  removeContent(content, ...path) {

    return this.parent.removeContent(content, ...path);

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

      for (let resource of this.resource.children) {

        const child = this.createChild(resource);

        keys.push(...child.getKeys());

  		}

    }

    return keys;

  }


  async export() { // -> return collection (array of strings)

    let collection = new KarmaFieldsAlpha.Content.Collection();

    if (this.resource.children && this.resource.export !== false) {

      for (let i = 0; i < this.resource.children.length; i++) {

        const resource = this.resource.children[i];
				const child = await this.createChild(resource, i);

        const content = await child.export();

        if (content.loading) {

          collection.loading = true;

        } else {

          collection.value = [...collection.toArray(), ...content.toArray()];

        }

			}

		}

		return collection;
  }

  async import(collection) {

    if (this.resource.children) {

      for (let i = 0; i < this.resource.children.length; i++) {

        const resource = this.resource.children[i];
				const child = this.createChild(resource, i);

        await child.import(collection);

			}

		}

  }

  destroy() {
    console.error("deprecated");

    const key = this.getKey();

    if (key) {

      this.removeContent(key);

    } else if (this.resource.children) {

      for (let i = 0; i < this.resource.children.length; i++) {

        const resource = this.resource.children[i];
				const child = this.createChild(resource, i);

        child.destroy();

			}

    }

  }

  // async *submit() {
  //
  //   yield* this.parent.submit();
  //
  // }

  // parse(expression) {
  //
  //   // compat
  //   if (expression && typeof expression === "object" && !Array.isArray(expression)) {
  //
  //     console.warn("Please use parseObject function!");
  //
  //     return this.parseObject(expression);
  //
  //   }
  //
  //   // return new KarmaFieldsAlpha.Expression(expression, this);
  //
  //   // return KarmaFieldsAlpha.Expression.prototype.parse.call(this, expression);
  //
  //   return super.parse(expression);
  //
  // }

  async parse(expression) {

    // compat
    if (expression && typeof expression === "object" && !Array.isArray(expression)) {

      // console.warn("Please use parseObject function!");

      return this.parseObject(expression);

    }


    let response = new KarmaFieldsAlpha.Content();
    //
    // const params = await Promise.all(expression.slice(1).map(param => this.parse(param)));
    //
    // if (params.some(param => param.loading)) {
    //
    //   response.loading = true;
    //
    // } else {

    if (expression) {

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
          const v1 = await this.parse(expression[1]);
          const v2 = await this.parse(expression[2]);
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
          response = await this.parse(values.shift());
          if (!response.loading && values.length && response.toBoolean()) {
            response = this.parse(["&&", ...values]);
          }
          break;
        }
        case "||": {
          const values = expression.slice(1);
          response = await this.parse(values.shift());

          if (!response.loading && values.length && !response.toBoolean()) {
            response = this.parse(["||", ...values]);
          }
          break;
        }
        case "!": {
          const value = await this.parse(expression[1]);
          if (value.loading) {
            response.loading = true;
          } else {
            response.value = !value.toBoolean();
          }
          break;
        }
        case "?": {
          const condition = await this.parse(expression[1]);
          if (condition.loading) {
            response.loading = true;
          } else {
            response = condition.toBoolean() ? this.parse(expression[2]) : this.parse(expression[3]);
          }
          break;
        }
        case "...":
        case "concat": {
          const items = await Promise.all(expression.slice(1).map(item => this.parse(item)));
          if (items.some(item => item.loading)) {
            response.loading = true;
          } else {
            response.value = items.reduce((array, item) => [...array, ...item.toArray()], []);
          }
          break;
        }
        case "math": {
          const method = expression[1];
          const values = await Promise.all(expression.slice(2).map(value => this.parse(value)));
          if (values.some(value => value.loading)) {
            response.loading = true;
          } else if (Math[expression[1]]) {
            response.value = Math[expression[1]](...values.map(value => value.toNumber()));
          }
          break;
        }
        case "include": {
          const array = await this.parse(expression[1]);
          const value = await this.parse(expression[2]);
          if (array.loading || value.loading) {
            response.loading = true;
          } else {
            response.value = array.toArray().include(value.toSingle());
          }
          break;
        }
        case "replace": {
          const string = await this.parse(expression[1]);
          const wildcard = expression[2];
          const replacements = await Promise.all(expression.slice(3).map(replacement => this.parse(replacement)));
          if (string.loading || replacements.some(value => value.loading)) {
            response.loading = true;
          } else if (replacements.length) {
            const grid = replacements.map(replacement => replacement.toArray());
            response.value = grid[0].map((item, i) => grid.reduce((string, replacements) => string.replace(wildcard, replacements[i]), string.toString()));
          }
          break;
        }
        case "date": {
          const date = await this.parse(expression[1]);
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
        case "year":
          // response = this.parse(["date", expression[1] || "", {year: expression[2] || "numeric"}]);
          // break;
        case "month":
        case "day":
          console.error("DEPRECATED (use date)");
          break;
        case "request": {
          var params = await Promise.all(expression.slice(1).map(param => this.parse(param)));
          if (params.some(param => param.loading)) {
            response.loading = true;
          } else {
            const result = await this.request(...params.map(param => param.value));
            if (result instanceof KarmaFieldsAlpha.Content) { // compat
              response.value = result.value;
            } else {
              response.value = result;
            }

            // response = this.request(...params.map(param => param.value));
          }
          break;
        }
        case "getItem": // compat
        case "getValue": // which one ?
        case "getContent": {
          // var params = await Promise.all(expression.slice(1).map(param => this.parse(param)));
          // if (params.some(param => param.loading)) {
          //   response.loading = true;
          // } else {
          //   response = this.getContent(...params.map(param => param.toString()));
          // }
          if (expression[1]) {
            const key = await this.parse(expression[1]);
            response = this.parent.getContent(key.toString());
          } else {
            response = this.getContent();
          }
          break;
        }
        case "queryValue": {
          const driver = await this.parse(expression[1]);
          const id = await this.parse(expression[2]);
          const key = await this.parse(expression[3]);
          if (driver.loading || id.loading || key.loading) {
            response.loading = true;
          } else if (driver.toString() && id.toString() && key.toString()) {
            // const form = new KarmaFieldsAlpha.field.form({
            //   driver: driver.toString()
            // });
            // response = form.getValueById(id.toString(), key.toString());
            const server = new KarmaFieldsAlpha.Server(driver.toString());
            response = server.getValue(id.toString(), key.toString());
          }
          break;
        }
        case "query": {
          const driver = await this.parse(expression[1]);
          const params = await this.parseObject(expression[2]);
          const output = expression[3] || "ids";
          if (driver.loading || params.loading) {
            response.loading = true;
          } else {
            // const table = new KarmaFieldsAlpha.field.table({
            //   driver: driver.toString(),
            //   params: params.toObject()
            // });
            // await table.load();
            const server = new KarmaFieldsAlpha.Server(driver.toString());
            await server.query(params.toObject());
            if (server.loading) {
              response.loading = true;
            } else if (output === "count") {
              response = table.getCount();
            } else if (output === "options") {
              response = server.getOptionsList();
            } else {
              response.value = server.ids;
            }
          }
          break;
        }
        case "queryCount": {
          const driver = await this.parse(expression[1]);
          const params = await this.parseObject(expression[2]);
          if (driver.loading || params.loading) {
            response.loading = true;
          } else {
            const server = new KarmaFieldsAlpha.Server(driver);
            server.setParams(params.toObject());
            response = table.getCount();
          }
          break;
        }
        case "parseParams":
          console.error("DEPRECATED");
          break;
        case "getOptions":
          response = this.parse(["query", expression[1], expression[2], "options"]);
          // console.warn("Deprecated. Use query");
          // const driver = await this.parse(expression[1]);
          // const params = await this.parseObject(expression[2]);
          // if (driver.loading || params.loading) {
          //   response.loading = true;
          // } else {
          //   const table = new KarmaFieldsAlpha.field.table({
          //     driver: driver.toString(),
          //     params: params.toObject()
          //   });
          //   response = table.getOptionsList();
          // }
          break;
        case "map": {
          const array = await this.parse(expression[1]);
          if (array.loading) {
            response.loading = true;
          } else {
            response.value = await Promise.all(array.toArray().map(value => {
              const mapItem = new KarmaFieldsAlpha.Expression(value, this);
              return mapItem.parse(expression[2]);
            }));
            response.loading = response.value.some(value => value.loading);
          }
          break;
        }
        case "join": {
          const array = await this.parse(expression[1]);
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
          const array = await this.parse(expression[1]);
          if (array.loading) {
            response.loading = true;
          } else {
            response.value = array.toArray().reduce((accumulator, item)=> accumulator + Number(item), 0);
          }
          break;
        }
        case "getLength":
        case "count": {
          const array = await this.parse(expression[1]);
          if (array.loading) {
            response.loading = true;
          } else {
            response.value = array.toArray().length;
          }
          break;
        }
        case "getParam": {
          var key = await this.parse(expression[1]);
          if (key.loading) {
            response.loading = true;
          } else {
            response = this.getParam(key.toString());
          }
          break;
        }
        case "isLoading": {
          const content = await this.parse(expression[1]);
          response.value = content.loading;
          break;
        }
        case "isMixed": {
          const content = await this.parse(expression[1]);
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
          response = await this.parse(expression[1]);
          break;
        case "max": {
          const array = await this.parse(expression[1]);
          if (array.loading) {
            response.loading = true;
          } else {
            response.value = array.toArray().reduce((accumulator, item) => Math.max(accumulator, Number(item)), 0);
          }
          break;
        }
        case "min": {
          const array = await this.parse(expression[1]);
          if (array.loading) {
            response.loading = true;
          } else {
            response.value = array.toArray().reduce((accumulator, item) => Math.min(accumulator, Number(item)), Infinity);
          }
          break;
        }
        case "resource": {
          var key = await this.parse(expression[1]);
          response.value = this.resource[key];
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

  async parseObject(object) {

    const response = new KarmaFieldsAlpha.Content();

    let entries = Object.entries(object);

    entries = await Promise.all(entries.map(([key, value]) => [key, this.parse(value)]));

    if (entries.some(([key, value]) => value.loading)) {

      response.loading = true;

    } else {

      entries = entries.map(([key, value]) => [key, value.toString()]);

      response.value = Object.fromEntries(entries);

    }

    return response;
  }

  async parseObject(object) {

    const response = new KarmaFieldsAlpha.Content({});

    for (let key in object) {

      const value = await this.parse(object[key]);

      response.value[key] = value.toString();

    }

    return response;


    // let entries = Object.entries(object);
    //
    // entries = await Promise.all(entries.map(([key, value]) => [key, this.parse(value)]));
    //
    // if (entries.some(([key, value]) => value.loading)) {
    //
    //   response.loading = true;
    //
    // } else {
    //
    //   entries = entries.map(([key, value]) => [key, value.toString()]);
    //
    //   response.value = Object.fromEntries(entries);
    //
    // }
    //
    // return response;
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

  getParams() { // overrided by table field

    return this.parent.getParams(); // return Content

  }


  getParam(key) { // overrided by form

    return this.parent.getParam(key);

  }

  setParam(value, key) { // overrided by form

    this.parent.setParam(value, key);

  }


  add(...args) {

    return this.parent.add(...args);

  }

  delete(...args) { // needed eg. when deleting tag by delete key

    return this.parent.delete(...args);

  }

  paste(...args) {

    return this.parent.paste(...args);

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

    return Boolean(KarmaFieldsAlpha.task);

    // return this.parent.hasTask();
  }

  // findDescendant(callback, ...path) {
  //
  //   if (path.length) {
  //
  //     const id = path.shift();
  //     const child = this.getChild(id);
  //
  //     if (child) {
  //
  //       if (callback(child)) {
  //
  //         return child;
  //
  //       } else {
  //
  //         return child.findDescendant(callback, ...path);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

  async exportDefaults() {

    let defaults = new KarmaFieldsAlpha.Content({})

		const children = this.getChildren();

    for (let i = 0; i < children.length; i++) {

      const child = this.getChild(i);



      const response = await child.exportDefaults();

      if (response.loading) {

        defaults.loading = true;

      } else {

        defaults.value = {...defaults.toObject(), ...response.toObject()};

      }

		}

    return defaults;

	}

  async undo() {

    KarmaFieldsAlpha.history.undo();

  }

  async redo() {

    KarmaFieldsAlpha.history.redo();

  }


};
