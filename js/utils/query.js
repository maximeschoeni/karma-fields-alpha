
KarmaFieldsAlpha.tasks = [];

KarmaFieldsAlpha.Query = class {

  // static getRelations(driver) {
  //
  //   if (KarmaFieldsAlpha.drivers[driver]) {
  //
  //     return KarmaFieldsAlpha.drivers[driver].relations;
  //
  //   }
  //
  // }
  //
  // static getAlias(driver) {
  //
  //   if (KarmaFieldsAlpha.drivers[driver]) {
  //
  //     return KarmaFieldsAlpha.drivers[driver].alias;
  //
  //   }
  //
  // }

  static get(driver, ...path) {

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, ...path);

  }

  static hasDriver(driver) {

    return Boolean(KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver));

  }

  static getAlias(driver, key) {

    if (!KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver)) {

      console.error("Driver does not exist: ", driver);

    }

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "alias", key) || key;

  }

  static initValue(driver, value, id, key) {

    const current = KarmaFieldsAlpha.DeepObject.get(this.vars, driver, id, key);

    if (current === undefined) {

      value = KarmaFieldsAlpha.Type.toArray(value);

      KarmaFieldsAlpha.DeepObject.set(this.vars, value, driver, id, key);

    }

  }

  static getAttempt(driver, id) {

    if (!KarmaFieldsAlpha.DeepObject.get(this.attempts, driver, id, "query")) {

      return "query";

    }

    const relations = this.get(driver, "relations");

    if (relations) {

      for (let relation of relations) {

        if (!KarmaFieldsAlpha.DeepObject.get(this.attempts, driver, id, relation)) {

          return relation;

        }

      }

    }

  }

  static getValue(driver, id, key) {

    // if (id === KarmaFieldsAlpha.exit) debugger;




    if (!KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver)) {

      console.error("Driver does not exist: ", driver);

    }

    if (key === KarmaFieldsAlpha.symbols.uploadDate) {


      key = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "alias", "upload-date");

    }

    // if (key === "id" || key === "name" || key === "parent" || key === "position") {
    //
    //   const alias = KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "alias", key);
    //
    //   if (alias) {
    //
    //     key = alias;
    //
    //   }
    //
    // }



    let value = KarmaFieldsAlpha.Store.get("delta", driver, id, key);

    if (!value) {

      value = KarmaFieldsAlpha.DeepObject.get(this.vars, driver, id, key);

    }


    if (value === undefined) { // -> create a task to fetch it

      const attempt = this.getAttempt(driver, id);

      if (attempt) {

        let task = KarmaFieldsAlpha.tasks.find(task => task.type === "vars" && task.driver === driver && task.attempt === attempt);

        if (!task) {

          task = {
            type: "vars",
            driver: driver,
            ids: new Set(),
            attempt: attempt
            // resolve: task => this.resolveAttempt(task)
          };

          if (attempt === "query") {

            task.resolve = task => this.resolveIds(task);

          } else {

            task.resolve = task => this.resolveRelations(task);

          }

          KarmaFieldsAlpha.tasks.push(task);

        }

        task.ids.add(id);

      } else { // -> no value found

        value = [];

        // console.log("no value found", driver, id, key);

        KarmaFieldsAlpha.DeepObject.set(this.vars, value, driver, id, key);

      }

    }

    return value; // return array | undefined (not ready)
  }

  static async resolveQuery(task) {

    const results = await KarmaFieldsAlpha.Gateway.get(`query/${task.driver}${task.paramstring?"?":""}${task.paramstring}`);

    // const idAlias = this.get(task.driver, "alias", "id") || "id";
    const idAlias = this.getAlias(task.driver, "id");

    for (let item of results) {

      const id = item[idAlias].toString();

      if (idAlias !== "id") {

        item.id = id;

      }

      for (let key in item) {

        const value = KarmaFieldsAlpha.Type.toArray(item[key]);

        KarmaFieldsAlpha.DeepObject.set(this.vars, value, task.driver, id, key);

      }

      KarmaFieldsAlpha.DeepObject.set(this.attempts, true, task.driver, id, "query");

      KarmaFieldsAlpha.DeepObject.set(this.vars, ["0"], task.driver, id, "trash");

    }

    KarmaFieldsAlpha.DeepObject.set(this.queries, results, task.driver, task.paramstring);

    return results; // -> to do: should return an array of ids
  }

  static async resolveIds(task) {

    if (task.ids.size) {

      for (let id of task.ids) {

        KarmaFieldsAlpha.DeepObject.set(this.attempts, true, task.driver, id, "query");

        KarmaFieldsAlpha.DeepObject.set(this.vars, ["1"], task.driver, id, "trash");

      }

      const paramstring = `ids=${[...task.ids].join(",")}`;

      const results = await KarmaFieldsAlpha.Gateway.get(`query/${task.driver}?${paramstring}`);

      const idAlias = this.get(task.driver, "alias", "id") || "id";

      for (let item of results) {

        const id = item[idAlias].toString();

        for (let key in item) {

          const value = KarmaFieldsAlpha.Type.toArray(item[key]);

          KarmaFieldsAlpha.DeepObject.set(this.vars, value, task.driver, id, key);

        }

        KarmaFieldsAlpha.DeepObject.set(this.vars, ["0"], task.driver, id, "trash");

      }

      KarmaFieldsAlpha.DeepObject.set(this.queries, results, task.driver, paramstring);

    }

  }

  static async resolveRelations(task) {

    if (task.ids.size) {

      const relations = await KarmaFieldsAlpha.Gateway.get(`relations/${task.driver}/${task.attempt}?ids=${[...task.ids].join(",")}`);

      for (let relation of relations) {

        const id = relation.id.toString();
        const key = relation.key.toString();

        let value = KarmaFieldsAlpha.DeepObject.get(this.vars, task.driver, id, key);

        if (!value) {

          value = [];

          KarmaFieldsAlpha.DeepObject.set(this.vars, value, task.driver, id, key);

        }

        value.push(relation.value);

      }

      for (let id of task.ids) {

        KarmaFieldsAlpha.DeepObject.set(this.attempts, true, task.driver, id, task.attempt);

      }

      // return relations;

    }

  }



  static getResults(driver, params) {

    const paramstring = KarmaFieldsAlpha.Params.stringify(params);

    let query = KarmaFieldsAlpha.DeepObject.get(this.queries, driver, paramstring);

    if (!query) {

      let task = KarmaFieldsAlpha.tasks.find(task => task.type === "query" && task.driver === driver && task.paramstring === paramstring);

      if (!task) {

        task = {
          type: "query",
          driver: driver,
          paramstring: paramstring,
          resolve: task => this.resolveQuery(task)
        };

        KarmaFieldsAlpha.tasks.push(task);

      }

    }

    return query;
  }



  static getCount(driver, params) {

    const paramstring = KarmaFieldsAlpha.Params.stringify(params);

    let count = KarmaFieldsAlpha.DeepObject.get(this.counts, driver, paramstring);

    if (count === undefined) {

      let task = KarmaFieldsAlpha.tasks.find(task => task.type === "count" && task.driver === driver && task.paramstring === paramstring);

      if (!task) {

        task = {
          type: "count",
          driver: driver,
          paramstring: paramstring,
          resolve: task => this.resolveCount(task)
        };

        KarmaFieldsAlpha.tasks.push(task);

      }

    }

    return count;
  }


  static async resolveCount(task) {

    let count = await KarmaFieldsAlpha.Gateway.get(`count/${task.driver}${task.paramstring?"?":""}${task.paramstring}`);

    count = parseInt(count);

    KarmaFieldsAlpha.DeepObject.set(this.counts, count, task.driver, task.paramstring);

  }

  static saveValue(value, driver, id, ...path) {

    const data = {};

    KarmaFieldsAlpha.DeepObject.set(data, value, driver, id, ...path);

    KarmaFieldsAlpha.DeepObject.merge(this.vars, data);

    KarmaFieldsAlpha.tasks.push({
      type: "update",
      driver: driver,
      id: id,
      data: data[driver][id],
      resolve: task => this.resolveUpdate(task)
    });

  }

  static send() {

    const data = KarmaFieldsAlpha.Store.get("delta");

    for (let driver in data) {

      for (let id in data[driver]) {

        KarmaFieldsAlpha.tasks.push({
          type: "update",
          driver: driver,
          id: id,
          data: data[driver][id],
          resolve: task => this.resolveUpdate(task)
        });

      }

    }

    this.queries = {};
    this.counts = {};

  }

  static async resolveUpdate(task) {

    await KarmaFieldsAlpha.Gateway.post(`update/${task.driver}/${task.id}`, task.data);

    KarmaFieldsAlpha.DeepObject.assign(this.vars, task.data, task.driver, task.id);

    KarmaFieldsAlpha.Store.remove("delta", task.driver, task.id);

  }

  static add(driver, params = {}, index = 0, ...path) {

    KarmaFieldsAlpha.tasks.push({
      type: "add",
      driver: driver,
      params: params,
      index: index,
      path: path,
      // method: this.insert,
      resolve: task => this.resolveAdd(task)
    });

    const items = KarmaFieldsAlpha.Store.get("ids") || [];
    const newItems = KarmaFieldsAlpha.DeepArray.clone(items);
    KarmaFieldsAlpha.DeepArray.splice(newItems, 0, [{loading: true}], index, ...path);


    // const ids = KarmaFieldsAlpha.Store.get("ids") || [];
    // const newIds = [...ids];
    //
    // newIds.splice(index, 0, {
    //   loading: true
    // });

    KarmaFieldsAlpha.Store.setIds(newItems);


    // KarmaFieldsAlpha.DeepObject.remove(this.queries, driver);
    // KarmaFieldsAlpha.DeepObject.remove(this.counts, driver);

  }

  static async resolveAdd(task) {

    const currentItems = KarmaFieldsAlpha.Store.get("ids") || [];

    let id = await KarmaFieldsAlpha.Gateway.post(`add/${task.driver}`).then(id => id.toString());

    const newItems = KarmaFieldsAlpha.DeepArray.clone(currentItems);
    KarmaFieldsAlpha.DeepArray.set(newItems, {id: id}, task.index, ...task.path);

    // const newIds = [...currentIds];
    // newIds[task.index] = id;



    KarmaFieldsAlpha.Store.setIds(newItems);

    for (let key in task.params) {

      const value = KarmaFieldsAlpha.Type.toArray(task.params[key]);
      KarmaFieldsAlpha.Store.setValue(value, task.driver, id, key);

    }

    // KarmaFieldsAlpha.Query.saveValue(task.params, task.driver, id);


    KarmaFieldsAlpha.Store.set(["1"], "delta", task.driver, id, "trash");
    KarmaFieldsAlpha.Store.setValue([], task.driver, id, "trash");

    KarmaFieldsAlpha.DeepObject.set(this.vars, [], task.driver, id, "trash");

  }

  static upload(driver, files, params, index = 0) {

    // length = Math.min(length, files.length); // -> will not delete files

    const currentItems = KarmaFieldsAlpha.Store.get("ids");
    const newItems = [...currentItems];
    // const items = newItems.splice(index, length);
    newItems.splice(index, 0, ...[...files].map(file => ({loading: true})));

    for (let i = 0; i < files.length; i++) {

      const task = {
        type: "upload",
        driver: driver,
        file: files[i],
        params: {...params},
        index: index + i,
        // method: this.uploadFile
        resolve: task => this.resolveUpload(task)
      }

      // if (ids[i]) { // -> only replacements
      //
      //   task.params.id = ids[i];
      //   this.empty(driver, ids[i]);
      //
      // }

      KarmaFieldsAlpha.tasks.push(task);

    }

    KarmaFieldsAlpha.Store.setIds(newItems);


    KarmaFieldsAlpha.DeepObject.remove(this.queries, driver);
    KarmaFieldsAlpha.DeepObject.remove(this.counts, driver);

  }

  static async resolveUpload(task) {

    const currentItems = KarmaFieldsAlpha.Store.get("ids") || [];

    let id;

    if (KarmaFieldsAlpha.useWPMediaUploader) {

      id = await KarmaFieldsAlpha.Gateway.upload(task.file, task.params); // -> parent is not going to be saved!

    } else {

      id = await KarmaFieldsAlpha.Gateway.stream(task.file, task.params);

    }

    id = id.toString();
    const newItems = [...currentItems];

    newItems[task.index] = {id: id, type: "file"};

    KarmaFieldsAlpha.Store.setIds(newItems);

    for (let key in task.params) {

      const value = KarmaFieldsAlpha.Type.toArray(task.params[key]);

      KarmaFieldsAlpha.Store.setValue(value, task.driver, id, key);

    }

    // if (!task.params.id) {

      KarmaFieldsAlpha.Store.set(["1"], "delta", task.driver, id, "trash");
      KarmaFieldsAlpha.Store.setValue(["0"], task.driver, id, "trash");

    // }

  }

  static regen(driver, ids) {

    for (let id of ids) {

      KarmaFieldsAlpha.tasks.push({
        type: "regen",
        driver: driver,
        id: id,
        resolve: task => this.resolveRegen(task)
      });

    }

  }

  static async resolveRegen(task) {

    await KarmaFieldsAlpha.Gateway.post("regen/"+task.id);

  }


  // static removeIds(driver, ids) {
  //
  //   const currentIds = KarmaFieldsAlpha.Store.getIds();
  //   const newIds = currentIds.filter(id => !ids.includes(id));
  //
  //   for (let id of ids) {
  //
  //     KarmaFieldsAlpha.Store.setValue(["1"], driver, id, "trash");
  //
  //     // this.saveValue(["1"], driver, id, "trash");
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.setIds(newIds);
  //
  // }

  static removeIds(driver, ids) {

    const currentItems = KarmaFieldsAlpha.Store.getIds();
    const newItems = currentItems.filter(item => !ids.includes(item.id));

    for (let id of ids) {

      KarmaFieldsAlpha.Store.setValue(["1"], driver, id, "trash");

    }

    KarmaFieldsAlpha.Store.setIds(newItems);

  }


  static empty(driver, id) {

    if (driver) {

      if (id) {

        KarmaFieldsAlpha.DeepObject.remove(this.vars, driver, id);
        KarmaFieldsAlpha.DeepObject.remove(this.attempts, driver, id);

      } else {

        KarmaFieldsAlpha.DeepObject.remove(this.vars, driver);
        KarmaFieldsAlpha.DeepObject.remove(this.attempts, driver);
        KarmaFieldsAlpha.DeepObject.remove(this.queries, driver);
        KarmaFieldsAlpha.DeepObject.remove(this.counts, driver);

      }

    } else {

      this.vars = {};
      this.queries = {};
      this.counts = {};
      this.attempts = {};

    }

  }

  static emptyQueries(driver) {

    if (driver) {

      KarmaFieldsAlpha.DeepObject.remove(this.queries, driver);
      KarmaFieldsAlpha.DeepObject.remove(this.counts, driver);

    } else {

      this.queries = {};
      this.counts = {};

    }

  }



  static getOptions(driver, params) {

    const results = this.getResults(driver, params);

    if (results) {

      const options = [];
      const idAlias = this.get(driver, "alias", "id") || "id";
      const nameAlias = this.get(driver, "alias", "name") || "name";

      for (let item of results) {

        let name = item[nameAlias];

        if (name === undefined) {

          name = KarmaFieldsAlpha.Type.toString(this.getValue(driver, item[idAlias], nameAlias) || ["..."])

        }

        options.push({
          id: item[idAlias],
          name: name
        });

      }

      return options;

    }

    return KarmaFieldsAlpha.loading;

  }

  static getSingleValue(driver, id, key) {

    const values = this.getValue(driver, id, key);

    if (!values) {

      return KarmaFieldsAlpha.loading;

    }

    return values[0];

  }

  static getAliasedValue(driver, id, key) {

    const alias = this.getAlias(driver, key);

    return this.getValue(driver, id, alias);

  }

  static getSingleAliasedValue(driver, id, key) {

    const values = this.getAliasedValue(driver, id, key);

    if (!values) {

      return KarmaFieldsAlpha.loading;

    }

    return values[0];

  }


  static getName(driver, id) {

    return this.getSingleAliasedValue(driver, id, "name") || "";

  }

  static getParent(driver, id) {

    return this.getSingleAliasedValue(driver, id, "parent") || "0";

  }

  static getPosition(driver, id) {

    return this.parseInt(getSingleAliasedValue(driver, id, "position") || 0);

  }

  static getFileType(driver, id) {

    return this.getSingleAliasedValue(driver, id, "filetype") || "";

  }

  static getMimeType(driver, id) {

    return this.getSingleAliasedValue(driver, id, "mimetype") || "";

  }

  static getFilename(driver, id) {

    return this.getSingleAliasedValue(driver, id, "filename") || "";

  }

  static getDir(driver, id) {

    return this.getSingleAliasedValue(driver, id, "dir") || "";

  }

  static getSizes(driver, id) {

    return this.getAliasedValue(driver, id, "sizes") || KarmaFieldsAlpha.loading;

  }

}

KarmaFieldsAlpha.Query.vars = {};
KarmaFieldsAlpha.Query.queries = {};
KarmaFieldsAlpha.Query.counts = {};
KarmaFieldsAlpha.Query.attempts = {};

KarmaFieldsAlpha.token = Symbol("token");
KarmaFieldsAlpha.loading = Symbol("loading");

KarmaFieldsAlpha.symbols = {};
KarmaFieldsAlpha.symbols.name = Symbol("name");
KarmaFieldsAlpha.symbols.parent = Symbol("loading");
KarmaFieldsAlpha.symbols.position = Symbol("position");
KarmaFieldsAlpha.symbols.uploadDate = Symbol("upload-date");
