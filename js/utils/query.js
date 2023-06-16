
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

    KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, ...path);

  }

  static getAttempt(driver, id) {

    // if (KarmaFieldsAlpha.drivers[driver]) {

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

    // } else {
    //
    //   console.error("driver does not exist", driver);
    //
    // }

  }

  static getValue(driver, id, key) {

    if (id === KarmaFieldsAlpha.exit) debugger;

    let value = KarmaFieldsAlpha.Store.get("delta", driver, id, key);

    if (!value) {

      value = KarmaFieldsAlpha.DeepObject.get(this.vars, driver, id, key);

    }

    if (value === undefined) { // -> create a task to fetch it

      const attempt = this.getAttempt(driver, id);

      if (attempt) {

        let task = this.tasks.find(task => task.type === "vars" && task.driver === driver && task.attempt === attempt);

        if (!task) {

          task = {
            type: "vars",
            driver: driver,
            ids: new Set(),
            attempt: attempt
          };

          this.tasks.push(task);

        }

        task.ids.add(id);

      } else { // -> no value found

        value = [];

        console.log("no value found", driver, id, key);

        KarmaFieldsAlpha.DeepObject.set(this.vars, value, driver, id, key);

      }

    }

    return value; // return array | undefined (not ready)
  }

  // static async queryVars(driver, attempt, ids) {
  //
  //   if (attempt === "query") {
  //
  //     await this.query(driver, `ids=${ids.join(",")}`);
  //
  //   } else {
  //
  //     await this.queryRelations(driver, attempt, ids);
  //
  //   }
  //
  // }

  static async run(task) {

    switch(task.type) {

      case "vars":

        if (task.attempt === "query") {

          // await this.query(task.driver, `ids=${[...task.ids].join(",")}`);
          await this.queryIds(task.driver, [...task.ids])

        } else {

          await this.queryRelations(task.driver, task.attempt, [...task.ids]);

        }
        break;

      case "query":
        await this.query(task.driver, task.paramstring);
        break;

      case "count":
        await this.queryCount(task.driver, task.paramstring);
        break;

      case "update":
        await this.update(task.driver, task.id, task.data);
        break;

      case "add":
        await this.insert(task.driver, task.params, task.index);
        break;

      case "upload":
        await this.uploadFile(task.driver, task.file, task.params, task.index);
        break;

      case "regen":
        await this.regenFile(task.driver, task.id);
        break;

    }

  }

  static async query(driver, paramstring = "") {

    // if (!KarmaFieldsAlpha.drivers[driver]) {
    //
    //   console.error("Driver not found", driver);
    //
    // }

    const results = await KarmaFieldsAlpha.Gateway.get(`query/${driver}${paramstring?"?":""}${paramstring}`);

    // const alias = this.getAlias() || {};
    // const idAlias = alias.id || "id";

    const idAlias = this.get(driver, "alias", "id") || "id";

    for (let item of results) {

      const id = item[idAlias].toString();

      for (let key in item) {

        const value = KarmaFieldsAlpha.Type.toArray(item[key]);

        KarmaFieldsAlpha.DeepObject.set(this.vars, value, driver, id, key);

      }

      KarmaFieldsAlpha.DeepObject.set(this.attempts, true, driver, id, "query");

      KarmaFieldsAlpha.DeepObject.set(this.vars, ["0"], driver, id, "trash");

    }

    KarmaFieldsAlpha.DeepObject.set(this.queries, results, driver, paramstring);

    return results;
  }

  static async queryIds(driver, ids) {

    // if (!KarmaFieldsAlpha.drivers[driver]) {
    //
    //   console.error("Driver not found", driver);
    //
    // }

    if (ids.length) {

      for (let id of ids) {

        KarmaFieldsAlpha.DeepObject.set(this.attempts, true, driver, id, "query");

        KarmaFieldsAlpha.DeepObject.set(this.vars, ["1"], driver, id, "trash");

      }

      const paramstring = `ids=${ids.join(",")}`;

      const results = await KarmaFieldsAlpha.Gateway.get(`query/${driver}?${paramstring}`);

      // const alias = KarmaFieldsAlpha.drivers[driver].alias || {};
      // const alias = this.getAlias() || {};
      // const idAlias = alias.id || "id";

      const idAlias = this.get(driver, "alias", "id") || "id";

      for (let item of results) {

        const id = item[idAlias].toString();

        for (let key in item) {

          const value = KarmaFieldsAlpha.Type.toArray(item[key]);

          KarmaFieldsAlpha.DeepObject.set(this.vars, value, driver, id, key);

        }

        KarmaFieldsAlpha.DeepObject.set(this.vars, ["0"], driver, id, "trash");

      }



      KarmaFieldsAlpha.DeepObject.set(this.queries, results, driver, paramstring);

    }

  }

  static async queryRelations(driver, relation, ids) {

    // if (!KarmaFieldsAlpha.drivers[driver]) {
    //
    //   console.error("Driver not found", driver);
    //
    // }

    const relations = await KarmaFieldsAlpha.Gateway.get(`relations/${driver}/${relation}?ids=${ids.join(",")}`);

    // const alias = KarmaFieldsAlpha.drivers[driver].alias || {};
    // const idAlias = alias.id || "id";

    for (let relation of relations) {

      const id = relation.id.toString();
      const key = relation.key.toString();

      let value = KarmaFieldsAlpha.DeepObject.get(this.vars, driver, id, key);

      // if (!Array.isArray(value)) {
      //
      //   value = KarmaFieldsAlpha.Type.toArray(value);
      //
      // }

      if (!value) {

        value = [];

        KarmaFieldsAlpha.DeepObject.set(this.vars, value, driver, id, key);

      }

      value.push(relation.value);

    }

    for (let id of ids) {

      KarmaFieldsAlpha.DeepObject.set(this.attempts, true, driver, id, relation);

    }

    return relations;
  }



  static getResults(driver, params) {

    const paramstring = KarmaFieldsAlpha.Params.stringify(params);

    let query = KarmaFieldsAlpha.DeepObject.get(this.queries, driver, paramstring);

    if (!query) {

      let task = this.tasks.find(task => task.type === "query" && task.driver === driver && task.paramstring === paramstring);

      if (!task) {

        task = {
          type: "query",
          driver: driver,
          paramstring: paramstring
        };

        this.tasks.push(task);

      }

    }

    return query;
  }



  static getCount(driver, params) {

    const paramstring = KarmaFieldsAlpha.Params.stringify(params);

    let count = KarmaFieldsAlpha.DeepObject.get(this.counts, driver, paramstring);

    if (count === undefined) {

      let task = this.tasks.find(task => task.type === "count" && task.driver === driver && task.paramstring === paramstring);

      if (!task) {

        task = {
          type: "count",
          driver: driver,
          paramstring: paramstring
        };

        this.tasks.push(task);

      }

    }

    return count;
  }


  static async queryCount(driver, paramstring) {

    const count = await KarmaFieldsAlpha.Gateway.get(`count/${driver}${paramstring?"?":""}${paramstring}`);

    KarmaFieldsAlpha.DeepObject.set(this.counts, count, driver, paramstring);

  }

  static saveValue(value, driver, id, ...path) {

    const data = {};

    KarmaFieldsAlpha.DeepObject.set(data, value, driver, id, ...path);

    KarmaFieldsAlpha.DeepObject.merge(this.vars, data);

    this.tasks.push({
      type: "update",
      driver: driver,
      id: id,
      data: data[driver][id]
    });

  }

  static send() {

    const data = KarmaFieldsAlpha.Store.get("delta");

    for (let driver in data) {

      for (let id in data[driver]) {

        this.tasks.push({
          type: "update",
          driver: driver,
          id: id,
          data: data[driver][id]
        });

      }

    }

  }

  static async update(driver, id, data) {

    await KarmaFieldsAlpha.Gateway.post(`update/${driver}/${id}`, data);

    KarmaFieldsAlpha.DeepObject.assign(this.vars, data, driver, id);

    KarmaFieldsAlpha.Store.remove("delta", driver, id);

  }

  static add(driver, index = 0, params = {}) {

    this.tasks.push({
      type: "add",
      driver: driver,
      params: params,
      index: index,
      method: this.insert
    });

    const ids = KarmaFieldsAlpha.Store.get("ids") || [];
    const newIds = [...ids];

    newIds.splice(index, 0, null); // -> null means item is being added. Cannot use symbols in json

    KarmaFieldsAlpha.Store.setIds(newIds);


    KarmaFieldsAlpha.DeepObject.remove(this.queries, driver);
    KarmaFieldsAlpha.DeepObject.remove(this.counts, driver);

  }

  static async insert(driver, params = {}, index = 0) {

    const currentIds = KarmaFieldsAlpha.Store.get("ids") || [];

    let id = await KarmaFieldsAlpha.Gateway.post(`add/${driver}`).then(id => id.toString());
    const newIds = [...currentIds];

    newIds[index] = id;

    KarmaFieldsAlpha.Store.setIds(newIds);

    for (let key in params) {

      const value = KarmaFieldsAlpha.Type.toArray(params[key]);
      KarmaFieldsAlpha.Store.setValue(value, driver, id, key);

    }

    KarmaFieldsAlpha.Query.saveValue(params, driver, id);


    KarmaFieldsAlpha.Store.set(["1"], "delta", driver, id, "trash");
    KarmaFieldsAlpha.Store.setValue([], driver, id, "trash");

    KarmaFieldsAlpha.DeepObject.set(this.vars, [], driver, id, "trash");



  }

  // static upload(file, params, index = 0, length = 0) {
  //
  //
  //
  //   const ids = [...KarmaFieldsAlpha.Store.get("ids")];
  //   const id = ids[index];
  //   ids[index] = null;
  //
  //   this.tasks.push({
  //     type: "upload",
  //     driver: "medias",
  //     file: file,
  //     params: params || {},
  //     index: index,
  //     id: id,
  //     method: this.uploadFile
  //   });
  //
  //   // ids.splice(index, length, null); // -> null means item is being added.
  //
  //   KarmaFieldsAlpha.Store.set(ids, "ids");
  //
  // }

  static upload(driver, files, params, index = 0, length = 0) {

    length = Math.min(length, files.length); // -> will not delete files

    const currentIds = KarmaFieldsAlpha.Store.get("ids");
    const newIds = [...currentIds];
    const ids = newIds.splice(index, length);
    newIds.splice(index, length, ...[...files].map(file => null));

    // for (let id of idsToAdd) {
    for (let i = 0; i < files.length; i++) {

      const task = {
        type: "upload",
        driver: driver,
        file: files[i],
        params: {...params},
        index: index + i,
        method: this.uploadFile
      }

      if (ids[i]) { // -> only replacements

        task.params.id = ids[i];
        this.empty(driver, ids[i]);

      }

      this.tasks.push(task);

    }


    // ids.splice(index, length, null); // -> null means item is being added.

    // KarmaFieldsAlpha.History.backup(newIds, currentIds, "ids");

    // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "ids")) {
    //
    //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, currentIds, "last", "ids");
    //
    // }
    //
    // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, currentIds, "next", "ids");
    //
    // KarmaFieldsAlpha.Store.set(newIds, "ids");

    KarmaFieldsAlpha.Store.setIds(newIds);


    KarmaFieldsAlpha.DeepObject.remove(this.queries, driver);
    KarmaFieldsAlpha.DeepObject.remove(this.counts, driver);

  }

  static async uploadFile(driver, file, params = {}, index) {

    const currentIds = KarmaFieldsAlpha.Store.get("ids") || [];
    // const index = currentIds.findIndex(id => id === null);


    let id = await KarmaFieldsAlpha.Gateway.upload(file, params);
    id = id.toString();
    const newIds = [...currentIds];

    // currentIds.splice(index, 1);
    newIds[index] = id;

    // KarmaFieldsAlpha.History.backup(newIds, currentIds, "ids");
    // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "ids")) {
    //
    //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, currentIds, "last", "ids");
    //
    // }
    //
    // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, newIds, "next", "ids");
    //
    // KarmaFieldsAlpha.Store.set(newIds, "ids");
    KarmaFieldsAlpha.Store.setIds(newIds);

    for (let key in params) {

      const value = KarmaFieldsAlpha.Type.toArray(params[key]);

      // KarmaFieldsAlpha.History.backup(value, [], "delta", driver, id, key);
      // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "delta", driver, id, key)) {
      //
      //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, [], "last", "delta", driver, id, key);
      //
      // }
      //
      // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, value, "next", "delta", driver, id, key);
      //
      // KarmaFieldsAlpha.Store.set(value, "delta", driver, id, key);

      KarmaFieldsAlpha.Store.setValue(value, driver, id, key);

    }

    if (!params.id) {

      // KarmaFieldsAlpha.History.backup(["0"], ["1"], "delta", driver, id, "trash");
      // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, ["1"], "last", "delta", driver, id, "trash");
      // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, ["0"], "next", "delta", driver, id, "trash");
      //
      // KarmaFieldsAlpha.Store.set(["0"], "delta", driver, id, "trash");

      KarmaFieldsAlpha.Store.set(["1"], "delta", driver, id, "trash");
      KarmaFieldsAlpha.Store.setValue(["0"], driver, id, "trash");

    }

  }

  static regen(driver, ids) {

    for (let id of ids) {

      this.tasks.push({
        type: "regen",
        driver: driver,
        id: id
      });

    }

  }

  static async regenFile(driver, id) {

    await KarmaFieldsAlpha.Gateway.post("regen/"+id);

  }


  static removeIds(driver, ids) {

    const currentIds = KarmaFieldsAlpha.Store.getIds();
    const newIds = currentIds.filter(id => !ids.includes(id));

    for (let id of ids) {

      KarmaFieldsAlpha.Store.setValue(["1"], driver, id, "trash");

      this.saveValue(["1"], driver, id, "trash");

    }

    KarmaFieldsAlpha.Store.setIds(newIds);

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


}

KarmaFieldsAlpha.Query.tasks = [];
KarmaFieldsAlpha.Query.vars = {};
KarmaFieldsAlpha.Query.queries = {};
KarmaFieldsAlpha.Query.counts = {};
KarmaFieldsAlpha.Query.attempts = {};

KarmaFieldsAlpha.token = Symbol("token");
KarmaFieldsAlpha.loading = Symbol("loading");
