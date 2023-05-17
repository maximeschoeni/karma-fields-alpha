
KarmaFieldsAlpha.Query = class {

  static getAttempt(driver, id) {

    if (KarmaFieldsAlpha.drivers[driver]) {

      if (!KarmaFieldsAlpha.DeepObject.get(this.attempts, driver, id, "query")) {

        return "query";

      }

      if (KarmaFieldsAlpha.drivers[driver].relations) {

        for (let relation of KarmaFieldsAlpha.drivers[driver].relations) {

          if (!KarmaFieldsAlpha.DeepObject.get(this.attempts, driver, id, relation)) {

            return relation;

          }

        }

      }

    } else {

      console.error("driver does not exist", driver);

    }

  }

  static getValue(driver, id, key) {

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

        KarmaFieldsAlpha.DeepObject.assign(this.vars, value, driver, id, key);

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

          await this.query(task.driver, `ids=${[...task.ids].join(",")}`);

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

    }

  }

  static async query(driver, paramstring = "") {

    if (!KarmaFieldsAlpha.drivers[driver]) {

      console.error("Driver not found", driver);

    }

    const results = await KarmaFieldsAlpha.Gateway.get(`query/${driver}${paramstring?"?":""}${paramstring}`);

    const alias = KarmaFieldsAlpha.drivers[driver].alias || {};
    const idAlias = alias.id || "id";

    for (let item of results) {

      const id = item[idAlias].toString();

      for (let key in item) {

        const value = KarmaFieldsAlpha.Type.toArray(item[key]);

        KarmaFieldsAlpha.DeepObject.assign(this.vars, value, driver, id, key);

      }

      KarmaFieldsAlpha.DeepObject.assign(this.attempts, true, driver, id, "query");

    }

    KarmaFieldsAlpha.DeepObject.assign(this.queries, results, driver, paramstring);

    return results;
  }

  static async queryRelations(driver, relation, ids) {

    if (!KarmaFieldsAlpha.drivers[driver]) {

      console.error("Driver not found", driver);

    }

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

        KarmaFieldsAlpha.DeepObject.assign(this.vars, value, driver, id, key);

      }

      value.push(relation.value);

    }

    for (let id of ids) {

      KarmaFieldsAlpha.DeepObject.assign(this.attempts, true, driver, id, relation);

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

    let query = KarmaFieldsAlpha.DeepObject.get(this.counts, driver, paramstring);

    if (!query) {

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

  }


  static async queryCount(driver, paramstring) {

    const count = await KarmaFieldsAlpha.Gateway.get(`count/${driver}${paramstring?"?":""}${paramstring}`);

    KarmaFieldsAlpha.DeepObject.assign(this.counts, count, driver, paramstring);

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

    KarmaFieldsAlpha.DeepObject.mergeTo(KarmaFieldsAlpha.Query.vars, data, driver, id);

    KarmaFieldsAlpha.Store.remove("delta", driver, id);

  }


  static empty() {
    this.vars = {};
    this.queries = {};
    this.counts = {};
    this.attempts = {};
  }

}

KarmaFieldsAlpha.Query.tasks = [];
KarmaFieldsAlpha.Query.vars = {};
KarmaFieldsAlpha.Query.queries = {};
KarmaFieldsAlpha.Query.counts = {};
KarmaFieldsAlpha.Query.attempts = {};
