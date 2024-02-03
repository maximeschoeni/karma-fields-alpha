
KarmaFieldsAlpha.Task = class {

  static get() {

    return KarmaFieldsAlpha.Store.get("tasks");

  }

  static set(tasks) {

    KarmaFieldsAlpha.Store.set(tasks, "tasks");

  }

  static add(task) {

    const tasks = this.get() || [];

    this.set([...tasks, task]);

  }

  static find(callback) {

    const tasks = this.get();

    if (tasks) {

      return tasks.find(callback);

    }

  }

  static has() {

    const tasks = this.get();

    return tasks && tasks.length > 0 || false;

  }

};


KarmaFieldsAlpha.Task.Query = class {

  constructor(driver) {

    this.name = "Loading Data";
    this.type = "query";
    this.driver = driver;

  }

  createQuery(results) {

    const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "id");
    const nameAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "name");

    return results.map(item => ({id: item[idAlias], name: item[nameAlias]}));

  }

  writeData(dataset, ...path) {

    for (let id in dataset) {

      for (let key in dataset[id]) {

        KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", ...path, this.driver, id, key);

      }

    }

  }

  createQueryDataset(results) {

    const data = {};

    const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "id");

    for (let item of results) {

      const id = item[idAlias];

      data[id] = {};

      for (let key in item) {

        data[id][key] = [item[key]];

      }

    }

    return data;
  }

  createRelationDataset(relations) {

    const data = {};

    for (let relation of relations) {

      const id = relation.id.toString();
      const key = relation.key.toString();

      if (!data[id]) {

        data[id] = {};

      }

      if (!data[id][key]) {

        data[id][key] = [];

      }

      data[id][key].push(relation.value);

    }

    return data;
  }

}

KarmaFieldsAlpha.Task.QueryRemoteItems = class extends KarmaFieldsAlpha.Task.Query {

  constructor(driver, paramstring) {

    super(driver);

    this.type = "remote-query";
    this.paramstring = paramstring;

  }

  async resolve() {

    const results = await KarmaFieldsAlpha.HTTP.get(`query/${this.driver}${this.paramstring ? `?${this.paramstring}` : ""}`);

    await KarmaFieldsAlpha.Database.Queries.set(results, "query", this.driver, this.paramstring);

    const items = this.createQuery(results);
    const dataset = this.createQueryDataset(results);

    this.writeData(dataset, "remote");

    for (let item of items) {

      KarmaFieldsAlpha.Store.set(true, "attempts", "remote", this.driver, item.id, "query");

    }

    KarmaFieldsAlpha.Store.set(items, "items", "remote", this.driver, this.paramstring);

  }


}

KarmaFieldsAlpha.Task.QueryCacheItems = class extends KarmaFieldsAlpha.Task.QueryRemoteItems {

  constructor(driver, paramstring) {

    super(driver, paramstring);

    this.type = "cache-query";
    this.priority = 1;

  }

  async resolve() {

    const results = await KarmaFieldsAlpha.Database.Queries.get("query", this.driver, this.paramstring);

    if (results) {

      const items = this.createQuery(results);
      const dataset = this.createQueryDataset(results);

      this.writeData(dataset, "cache");

      for (let item of items) {

        KarmaFieldsAlpha.Store.set(true, "attempts", "cache", this.driver, item.id, "query");

      }

      KarmaFieldsAlpha.Store.set(items, "items", "cache", this.driver, this.paramstring);

    }

  }

}




KarmaFieldsAlpha.Task.QueryRemoteValue = class extends KarmaFieldsAlpha.Task.Query {

  constructor(driver, attempt) {

    super(driver);

    this.name = "Loading Content...";
    this.type = "remote-vars";
    this.ids = new Set();
    this.attempt = attempt;

  }

  async resolve() {

    const paramstring = `ids=${[...this.ids].join(",")}`;

    if (this.attempt === "query") {

      const results = await KarmaFieldsAlpha.HTTP.get(`query/${this.driver}?${paramstring}`);

      await KarmaFieldsAlpha.Database.Queries.set(results, "query", this.driver, paramstring);

      const dataset = this.createQueryDataset(results);

      this.writeData(dataset, "remote");

      for (let id of this.ids) {

        KarmaFieldsAlpha.Store.set(true, "attempts", "remote", this.driver, id, "query");

      }

    } else {

      const relations = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${attempt}?${paramstring}`);

      await KarmaFieldsAlpha.Database.Queries.set(results, this.attempt, this.driver, paramstring);

      const dataset = this.createRelationDataset(relations);

      this.writeData(dataset, "remote");

      for (let id of this.ids) {

        KarmaFieldsAlpha.Store.set(true, "attempts", "remote", this.driver, id, this.attempt);

      }

    }

  }

}

KarmaFieldsAlpha.Task.QueryCacheValue = class extends KarmaFieldsAlpha.Task.QueryRemoteValue {

  constructor(driver, attempt) {

    super(driver, attempt);

    this.type = "cache-vars";
    this.priority = 1;

  }

  async resolve() {

    const paramstring = `ids=${[...this.ids].join(",")}`;

    if (this.attempt === "query") {

      const results = await KarmaFieldsAlpha.Database.Queries.get(this.attempt, this.driver, paramstring);

      if (results) {

        const dataset = this.createQueryDataset(results);

        this.writeData(dataset, "cache");

        for (let id of this.ids) {

          KarmaFieldsAlpha.Store.set(true, "attempts", "cache", this.driver, id, "query");

        }

      }

    } else {

      // const relations = await KarmaFieldsAlpha.HTTP.get(`relations/${this.driver}/${this.attempt}?${paramstring}`);
      const results = await KarmaFieldsAlpha.Database.Queries.get(this.attempt, this.driver, paramstring);

      if (results) {

        const dataset = this.createRelationDataset(results);

        this.writeData(dataset, "cache");

        for (let id of this.ids) {

          KarmaFieldsAlpha.Store.set(true, "attempts", "cache", this.driver, id, this.attempt);

        }

      }

    }

  }

}


KarmaFieldsAlpha.Task.Save = class {

  getDelta() {

    const deltaItems = KarmaFieldsAlpha.Store.Delta.get("items");
    const delta = {};

    if (deltaItems) {

      for (let driver in deltaItems) {

        for (let data of deltaItems[driver]) {

          // const data = items[driver][paramstring];

          for (let row of data) {

            if (!row.id || row.delta) {

              if (!delta[driver]) {

                delta[driver] = [];

              }

              delta[driver].push(row);

            }

          }

        }

      }

    }

    const trash = KarmaFieldsAlpha.Store.Delta.get("trash");

    if (trash) {

      for (let driver in trash) {

        const ids = trash[driver];

        for (let id of ids) {

          if (ids && ids.length) {

            if (!delta[driver]) {

              delta[driver] = [];

            }

            delta[driver].push({
              id: id,
              delta: {trash: ["1"]}
            });

          }

        }

      }

    }

    return delta;
  }

  async update() {

    const deltaItems = KarmaFieldsAlpha.Store.Delta.get("items");

    if (deltaItems) {

      for (let driver in deltaItems) {

        for (let paramstring in deltaItems[driver]) {

          const data = deltaItems[driver][paramstring];
          const items = data.map(item => ({id: item.id}));

          KarmaFieldsAlpha.Store.set(items, "items", "cache", driver, paramstring);
          KarmaFieldsAlpha.Store.remove("items", "remote", driver, paramstring);

          for (let row of data) {

            if (row.delta) {

              for (let key in row.delta) {

                KarmaFieldsAlpha.Store.set(row.delta[key], "vars", "cache", driver, row.id, key);
                KarmaFieldsAlpha.Store.remove("vars", "remote", driver, row.id, key);

              }

            }

          }

          await KarmaFieldsAlpha.Database.Queries.remove("query", driver, paramstring);

        }

      }

    }

  }

  async resolve() {

    const delta = this.getDelta();

    await this.update();

    for (let driver in delta) {

      await KarmaFieldsAlpha.HTTP.post(`sync/${driver}`, delta[driver]);

    }

    KarmaFieldsAlpha.Store.Delta.remove("items");
    KarmaFieldsAlpha.Store.Delta.remove("trash");

  }

  // async resolveXX() {
  //
  //   const delta = KarmaFieldsAlpha.Store.Delta.get("items");
  //
  //   KarmaFieldsAlpha.Store.Delta.remove("items");
  //
  //   if (delta) {
  //
  //     for (let driver in delta) {
  //
  //       for (let paramstring in items[driver]) {
  //
  //         const data = items[driver][paramstring];
  //
  //         KarmaFieldsAlpha.Store.Delta.remove("items", driver, paramstring);
  //
  //         KarmaFieldsAlpha.Store.set(data.map(item => ({id: item.id})), "items", "cache", driver, paramstring);
  //         KarmaFieldsAlpha.Store.remove("items", "remote", driver, paramstring);
  //
  //         for (let row of data) {
  //
  //           if (row.delta) {
  //
  //             for (let key in row.delta) {
  //
  //               KarmaFieldsAlpha.Store.set(row.delta[key], "vars", "cache", driver, row.id, key);
  //               KarmaFieldsAlpha.Store.remove("vars", "remote", driver, row.id, key);
  //
  //             }
  //
  //           }
  //
  //         }
  //
  //         await KarmaFieldsAlpha.HTTP.post(`sync/${driver}`, data);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   const trash = KarmaFieldsAlpha.Store.Delta.get("trash");
  //
  //   if (trash) {
  //
  //     for (let driver in trash) {
  //
  //       const ids = trash[driver];
  //
  //       KarmaFieldsAlpha.Store.Delta.delete("trash", driver);
  //
  //       if (ids && ids.length) {
  //
  //         await KarmaFieldsAlpha.HTTP.post(`sync/${driver}`, ids.map(id => ({id: id, delta: {trash: ["1"]}})));
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

}
