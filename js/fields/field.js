
KarmaFieldsAlpha.loading = Symbol("loading");
KarmaFieldsAlpha.mixed = Symbol("mixed");

KarmaFieldsAlpha.field = class {

  static fieldId = 0;
  static uniqueId = 1;

  constructor(resource = {}, id, parent) {

    this.id = 0;
    this.uid = 0;
    this.path = [];
		this.resource = resource || {};




		this.fieldId = KarmaFieldsAlpha.field.fieldId++;



    this.id = id || 0;

    if (parent) {

      this.parent = parent;
      this.uid = `${parent.uid}-${this.id}`;
      this.path = [...parent.path, this.id];
      // this.states = parent.states && parent.states[this.id];
      // this.data = parent.data && parent.data[this.id];

    }

  }

  getKey() {

    return this.resource.key;

  }

  getLabel() {

    if (Array.isArray(this.resource.label)) {

      return this.parse(this.resource.label).toString();

    }

    return this.resource.label;

  }

  getUid() {
    return this.uid;
  }

  getConstructor(type) {

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

    field.parent = this;
    field.id = id;
    field.init();

  }


  createChild(resource, id) {

    if (typeof resource === "string") {

      resource = {
        type: resource
      };

    }

    // compat
    if (id === undefined) {

      id = resource.index;

    }

    const constructor = this.getConstructor(resource.type || "group");

    if (!constructor) {

      debugger;
      this.getConstructor(resource.type || "group");

    }

    const child = new constructor(resource);

    child.parent = this;
    child.id = id;
    // child.uid = `${this.uid}-${id}`;
    // child.path = [...this.path, id];
    // child.options = this.options && this.options[id];

    child.init();

    return child;
  }

  init() {

    this.uid = `${this.parent.uid}-${this.id}`;
    this.path = [...this.parent.path, this.id];
    // this.options = this.parent.options && this.parent.options[this.id];
    this.states = this.parent.states && this.parent.states[this.id];
    this.data = this.parent.data && this.parent.data[this.id];

  }

  useClipboard() {

    KarmaFieldsAlpha.Store.State.set(true, "clipboard");

  }

  getFocus() {

    // return KarmaFieldsAlpha.Store.Layer.getCurrent("focus");

    return KarmaFieldsAlpha.Store.State.get("focus");

  }

  setFocus(useClipboard = false) {

    KarmaFieldsAlpha.Store.State.set(useClipboard, "clipboard");
    // KarmaFieldsAlpha.Store.Layer.setCurrent(this.path, "focus");
    KarmaFieldsAlpha.Store.State.set(this.path, "focus");

  }

  removeFocus() {

    // KarmaFieldsAlpha.Store.Layer.removeCurrent("focus");
    KarmaFieldsAlpha.Store.State.remove("focus");

  }

  hasFocus() {

    // const focus = KarmaFieldsAlpha.Store.Layer.getCurrent("focus");
    const focus = this.getFocus();

    return focus && focus.length === this.path.length && this.path.every((id, index) => id === focus[index]);

  }

  hasFocusInside() {

    // const focus = KarmaFieldsAlpha.Store.Layer.getCurrent("focus");
    const focus = this.getFocus();

    return focus && this.path.every((id, index) => id === focus[index]);

  }

  getRelativeFocus() {

    const focus = this.getFocus();

    if (this.path.every((id, index) => id === focus[index])) {

      return focus.slice(this.path.length);

    }

  }

  getSelection(...path) {

    return KarmaFieldsAlpha.Store.State.get("fields", ...this.path, "selection", ...path);

  }

  setSelection(value, ...path) {

    KarmaFieldsAlpha.Store.State.set(value, "fields", ...this.path, "selection", ...path);

  }

  removeSelection() {

    KarmaFieldsAlpha.Store.State.remove("fields", ...this.path, "selection");

  }

  save(id, name) {

    KarmaFieldsAlpha.History.save(id, name);

  }

  lift(tail, action, ...args) {

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

    KarmaFieldsAlpha.Store.Tasks.add({
      type: type,
      resolve: resolve
    });

  }

  findTask(callback) {

    const tasks = KarmaFieldsAlpha.Store.Tasks.get();

    if (tasks) {

      return tasks.find(callback);

    }

  }

  getTask() {

    return this.getOption("tasks");

  }

  setTask(task) {

    this.setOption(task, "tasks");

  }

  createTask(...args) {

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

    KarmaFieldsAlpha.Task.add({
      type: "grind",
      resolve: () => this[functionName](...args)
    });

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

	getChild(index) {

		const children = this.getChildren();

		if (children) {

			let resource = children[index];

			if (resource) {

				if (typeof resource === "string") {

					resource = {type: resource};

				}

				return this.createChild({
					id: index,
					...resource,
					index: index
				}, index);

			}

		}

	}

  request(functionName, ...args) {

    if (this[functionName]) {

      return this[functionName](...args);

    } else if (this.parent) {

      return this.parent.request(functionName, ...args);

    }

  }

  getOption(...path) {

    return KarmaFieldsAlpha.Store.State.get("fields", ...this.path, ...path);

  }

  setOption(data, ...path) {

    KarmaFieldsAlpha.Store.State.set(data, "fields", ...this.path, ...path);

  }

  removeOption(...path) {

    KarmaFieldsAlpha.Store.State.remove("fields", ...this.path, ...path);

  }

  getState(...path) {

    return KarmaFieldsAlpha.Store.State.get("fields", ...this.path, ...path);

  }

  setState(data, ...path) {

    KarmaFieldsAlpha.Store.State.set(data, "fields", ...this.path, ...path);

  }

  removeState(...path) {

    KarmaFieldsAlpha.Store.State.remove("fields", ...this.path, ...path);

  }

  getData(...path) {

    return KarmaFieldsAlpha.Store.get("fields", ...this.path, ...path);

  }

  setData(data, ...path) {

    KarmaFieldsAlpha.Store.set(data, "fields", ...this.path, ...path);

  }

  removeData(...path) {

    KarmaFieldsAlpha.Store.remove("fields", ...this.path, ...path);

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

  // setContent(content, ...path) {
  //
  //   this.setValue(content.value || content, ...path);
  //
  // }

  setValue(value, ...path) {

    this.parent.setValue(value, ...path);

  }

  removeContent(content, ...path) {

    this.parent.removeContent(content, ...path);

  }

  getDriver() {

		return this.resource.driver || this.parent.getDriver();

	}

  // // used for array
  // getKeys(set = new Set()) {
  //
  //   console.log("deprecated");
  //
  //   if (this.resource.children) {
  //
  //     for (let resource of this.resource.children) {
  //
  //       const child = this.createChild(resource);
  //       const key = child.getKey();
  //
  //       if (key) {
  //
  //         set.add(key);
  //
  //       } else {
  //
  //         child.getKeys(set);
  //
  //       }
  //
  // 		}
  //
  //   }
  //
  //   return set;
  // }

  // // used by array
  // collectKeys() {
  //
  //   let keys = [];
  //
  //   if (this.resource.children) {
  //
  //     for (let resource of this.resource.children) {
  //
  //       const child = this.createChild(resource);
  //       const key = child.getKey();
  //
  //       if (key) {
  //
  //         keys.push(key);
  //
  //       } else {
  //
  //         keys.push(...child.collectKeys());
  //
  //       }
  //
  // 		}
  //
  //   }
  //
  //   return keys;
  // }

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


  export() { // -> return collection (array of strings)

    let collection = new KarmaFieldsAlpha.Content.Collection();

    if (this.resource.children && this.resource.export !== false) {

      for (let i = 0; i < this.resource.children.length; i++) {

        const resource = this.resource.children[i];
				const child = this.createChild(resource, i);

        const content = child.export();

        if (content.loading) {

          collection.loading = true;

        } else {

          collection.value = [...collection.toArray(), ...content.toArray()];

        }

			}

		}

		return collection;
  }

  async *import(collection) {

    if (this.resource.children) {

      for (let i = 0; i < this.resource.children.length; i++) {

        const resource = this.resource.children[i];
				const child = this.createChild(resource, i);

        yield* child.import(collection);

			}

		}

  }

  destroy() {

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

  parse(expression) {

    return new KarmaFieldsAlpha.Expression(expression, this);

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

  *create() {

    if (this.resource.children) {

      for (let i = 0; i < this.resource.children.length; i++) {

        const resource = this.resource.children[i];
        const child = this.createChild(resource, i);

        yield* child.create();

      }

    }

  }

  createToken() {

    let token = KarmaFieldsAlpha.Store.State.get("token") || 0;

    token++;

    KarmaFieldsAlpha.Store.State.set(token, "token");

    return token;
  }


  getParam(key) { // overrided by table field

    return this.parent.getParam(key);

  }

  setParam(value, key) { // overrided by table field

    this.parent.setParam(value, key);

  }


  // add(...args) {
  //
  //   return this.parent.add(...args);
  //
  // }
  //
  // delete(...args) {
  //
  //   return this.parent.delete(...args);
  //
  // }

  getChildByPath(childId, ...path) {

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

    return this.parent.getField(...path);

  }

};
