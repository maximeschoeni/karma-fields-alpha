
KarmaFieldsAlpha.Jobs = class {

  static get() {

    return KarmaFieldsAlpha.Store.get("jobs");

  }

  static set(tasks) {

    KarmaFieldsAlpha.Store.set(tasks, "jobs");

  }

  static add(task) {

    const tasks = this.get() || [];

    this.set([...tasks, task]);

  }

  static has() {

    const jobs = this.get();

    return jobs && jobs.length > 0 || false;

  }

}



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

  static create(...params) {

    const task = new this(...params);

    KarmaFieldsAlpha.Store.Tasks.add(task);

    return task;

  }

  constructor(driver, context, priority) {

    this.name = "Loading Data";
    this.type = "query";
    this.driver = driver;
    this.context = context;
    this.priority = priority;

  }

}

KarmaFieldsAlpha.Task.QueryItems = class extends KarmaFieldsAlpha.Task.Query {

  static find(driver, paramstring) {

    return KarmaFieldsAlpha.Task.find(task => task.constructor === this && task.driver === driver && task.paramstring === paramstring);

  }

  constructor(driver, paramstring, context = "remote", priority = 0) {

    super(driver, context, priority);

    // this.type = "query";
    this.paramstring = paramstring;

  }

  createQuery(results) {

    const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "id");
    const nameAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "name");

    const items = [];

    if (results) {

      // for (let item of results) {
      for (let i = 0; i < results.length; i++) {

        const item = results[i];

        items.push({
          id: item[idAlias],
          name: item[nameAlias]
        });

        // KarmaFieldsAlpha.Store.Delta.set(i, "vars", "remote", this.driver, item[idAlias], "order");

      }

    }

    // return results.map(item => ({id: item[idAlias], name: item[nameAlias]}));

    return items;

  }

  writeData(dataset) {

    for (let id in dataset) {

      for (let key in dataset[id]) {

        KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", this.context, this.driver, id, key);

      }

    }

  }

  createQueryDataset(results) {

    const data = {};

    const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "id");

    if (results) {

      for (let item of results) {

        const id = item[idAlias];

        data[id] = {};

        for (let key in item) {

          data[id][key] = [item[key]];

        }

      }

    }

    return data;
  }

  async fetch() {

    const results = await KarmaFieldsAlpha.HTTP.get(`query/${this.driver}?${this.paramstring}`);

    await KarmaFieldsAlpha.Database.Queries.set(results || [], "query", this.driver, this.paramstring);

    return results;

  }


  async resolve() {

    const results = await this.fetch(this.paramstring);

    if (results) {

      const dataset = this.createQueryDataset(results);

      this.writeData(dataset);

      // KarmaFieldsAlpha.Store.set(items, "items", this.context, this.driver, this.paramstring);
      // KarmaFieldsAlpha.Store.State.set(items, "items", this.driver, this.paramstring);

    // } else {

      // KarmaFieldsAlpha.Store.set([], "items", this.context, this.driver, this.paramstring);
      // KarmaFieldsAlpha.Store.State.set([], "items", this.driver, this.paramstring);

    }

    if (this.context === "cache") {

      const items = this.createQuery(results) || [];

      KarmaFieldsAlpha.Store.set(items, "items", this.driver, this.paramstring);

    } else {

      const items = this.createQuery(results) || [];

      KarmaFieldsAlpha.Store.State.set(items, "items", this.driver, this.paramstring);

    }

    KarmaFieldsAlpha.Store.set(true, "relations", this.context, this.driver, this.paramstring, "query");

  }

}

KarmaFieldsAlpha.Task.QueryItemsCache = class extends KarmaFieldsAlpha.Task.QueryItems {

  constructor(driver, paramstring, context = "cache", priority = 1) {

    super(driver, paramstring, context, priority);

  }

  async fetch() {

    return KarmaFieldsAlpha.Database.Queries.get("query", this.driver, this.paramstring);

  }

}





KarmaFieldsAlpha.Task.QueryValue = class extends KarmaFieldsAlpha.Task.QueryItems {

  // static find(driver) {
  //
  //   return KarmaFieldsAlpha.Task.find(task => task.constructor === this && task.driver === driver);
  //
  // }

  // static find(driver, paramstring) {
  //
  //   return KarmaFieldsAlpha.Task.find(task => task.constructor === this && task.driver === driver && task.paramstring === paramstring);
  //
  // }

  static find(driver, paramstring, id) {

    return KarmaFieldsAlpha.Task.find(task => task.constructor === this && task.driver === driver && (task.paramstring === paramstring || !task.paramstring && !paramstring || !paramstring && task.ids.has(id)));

  }

  constructor(driver, paramstring, context = "remote", priority = 0) {

    super(driver, paramstring, context, priority);

    // this.paramstring = paramstring;

    this.ids = new Set();
    this.keys = new Set();

  }

  createRelationDataset(relations) {

    const data = {};

    if (relations) {

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

    }

    return data;
  }


  getRelation() {

    const relations = KarmaFieldsAlpha.Driver.getRelations(this.driver);

    for (let relation of relations) {

      if (!KarmaFieldsAlpha.Store.get("relations", this.context, this.driver, this.paramstring, relation)) {

        return relation;

      }

    }

  }

  // async *generator(driver, paramstring) {
  //
  //   let results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}?${paramstring}`);
  //
  //   await KarmaFieldsAlpha.Database.Queries.set(results || [], "query", driver, paramstring);
  //
  //   const items = this.createQuery(results);
  //
  //   const dataset = this.createQueryDataset(results);
  //
  //   this.writeData(dataset);
  //
  //   KarmaFieldsAlpha.Store.State.set(items, "items", driver, paramstring);
  //
  //   yield;
  //
  //   const relations = KarmaFieldsAlpha.Driver.getRelations(driver);
  //
  //   if (relations) {
  //
  //     const ids = items.map(item => item.id);
  //
  //     paramstring = `ids=${ids.join(",")}`;
  //
  //     for (let relation of relations) {
  //
  //       const results = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${relation}?${paramstring}`);
  //
  //       await KarmaFieldsAlpha.Database.Queries.set(results || [], relation, this.driver, paramstring);
  //
  //       if (results) {
  //
  //         const dataset = this.createRelationDataset(results);
  //
  //         this.writeData(dataset);
  //
  //         yield;
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //
  // }
  //
  //
  // async *cache(driver, paramstring) {
  //
  //   let results = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);
  //
  //   const items = this.createQuery(results);
  //
  //   const dataset = this.createQueryDataset(results);
  //
  //   this.writeData(dataset);
  //
  //   KarmaFieldsAlpha.Store.set(items, "items", driver, paramstring);
  //
  //   yield;
  //
  //   const relations = KarmaFieldsAlpha.Driver.getRelations(driver);
  //
  //   if (relations) {
  //
  //     const ids = items.map(item => item.id);
  //
  //     paramstring = `ids=${ids.join(",")}`;
  //
  //     for (let relation of relations) {
  //
  //       const results = KarmaFieldsAlpha.Database.Queries.get(relation, driver, `ids=${ids.join(",")}`);
  //
  //       if (results) {
  //
  //         const dataset = this.createRelationDataset(results);
  //
  //         this.writeData(dataset);
  //
  //         yield;
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //
  // }
  //
  //
  //
  //
  // async *cache(driver, paramstring) {
  //
  //   let results = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring) || [];
  //
  //   const idAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "id");
  //   const nameAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "name");
  //
  //   const items = results.map(item => ({
  //     id: item[idAlias],
  //     name: item[nameAlias]
  //   }));
  //
  //   // const data = results.reduce((accumulator, item) => ({...accumulator, [item[idAlias]]: Object.fromEntries(Object.entries(item).map(([key, value]) => [key, [value]]))}), {});
  //
  //   const data = results.reduce((data, item) => {
  //
  //     const id = item[idAlias];
  //
  //     data[id] = {};
  //
  //     for (let key in item) {
  //
  //       data[id][key] = [item[key]];
  //
  //     }
  //
  //     return data;
  //
  //   }, {});
  //
  //
  //   for (let id in data) {
  //
  //     for (let key in dataset[id]) {
  //
  //       KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", "cache", driver, id, key);
  //
  //     }
  //
  //   }
  //
  //
  //   KarmaFieldsAlpha.Store.set(items, "items", driver, paramstring);
  //
  //   yield;
  //
  //   const relations = KarmaFieldsAlpha.Driver.getRelations(driver);
  //
  //   if (relations) {
  //
  //     const ids = items.map(item => item.id);
  //
  //     paramstring = `ids=${ids.join(",")}`;
  //
  //     for (let relation of relations) {
  //
  //       const results = KarmaFieldsAlpha.Database.Queries.get(relation, driver, `ids=${ids.join(",")}`) || [];
  //
  //       const data = results.reduce((data, item) => {
  //
  //         const id = item.id.toString();
  //         const key = item.key.toString();
  //
  //         if (!data[id]) {
  //
  //           data[id] = {};
  //
  //         }
  //
  //         if (!data[id][key]) {
  //
  //           data[id][key] = [];
  //
  //         }
  //
  //         data[id][key].push(item.value);
  //
  //         return data;
  //       }, {});
  //
  //       for (let id in data) {
  //
  //         for (let key in dataset[id]) {
  //
  //           KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", "cache", driver, id, key);
  //
  //         }
  //
  //       }
  //
  //       yield;
  //
  //     }
  //
  //   }
  //
  //
  // }




  async fetchRelation(relation, ids) {

    const paramstring = `ids=${ids.join(",")}`;

    const results = await KarmaFieldsAlpha.HTTP.get(`relations/${this.driver}/${relation}?${paramstring}`);

    await KarmaFieldsAlpha.Database.Queries.set(results || [], relation, this.driver, paramstring);

    return results;

  }

  async resolve() {

    if (this.paramstring === undefined) {

      this.genericQuery = true;

      this.paramstring = `ids=${[...this.ids].join(",")}`;

    }

    // const items = KarmaFieldsAlpha.Store.get("items", this.context, this.driver, this.paramstring);
    // const items = KarmaFieldsAlpha.Store.State.get("items", this.driver, this.paramstring);

    let items;

    if (this.context === "cache") {

      items = KarmaFieldsAlpha.Store.get("items", this.driver, this.paramstring);

    } else {

      items = KarmaFieldsAlpha.Store.State.get("items", this.driver, this.paramstring);

    }

    if (!items) {

      const results = await this.fetch();

      const dataset = this.createQueryDataset(results);

      this.writeData(dataset);

      let items = this.createQuery(results);

      // KarmaFieldsAlpha.Store.set(items, "items", this.context, this.driver, this.paramstring);
      // KarmaFieldsAlpha.Store.State.set(items, "items", this.driver, this.paramstring);

      if (this.context === "cache") {

        KarmaFieldsAlpha.Store.set(items, "items", this.driver, this.paramstring);

      } else {

        KarmaFieldsAlpha.Store.State.set(items, "items", this.driver, this.paramstring);

      }


      KarmaFieldsAlpha.Store.set(true, "relations", this.context, this.driver, this.paramstring, "query");

    } else if (!KarmaFieldsAlpha.Store.get("relations", this.context, this.driver, this.paramstring, "query")) {

      const results = await this.fetch();

      const dataset = this.createQueryDataset(results);

      this.writeData(dataset);

      // do not update items order!

      KarmaFieldsAlpha.Store.set(true, "relations", this.context, this.driver, this.paramstring, "query");

    } else {

      const relation = this.getRelation(this.paramstring);

      const ids = items.map(item => item.id);

      if (relation && ids.length) {

        const results = await this.fetchRelation(relation, ids);

        if (results) {

          const dataset = this.createRelationDataset(results);

          this.writeData(dataset);

        }

        KarmaFieldsAlpha.Store.set(true, "relations", this.context, this.driver, this.paramstring, relation);

      } else {

        for (let id of this.ids) {

          for (let key of this.keys) {

            if (!KarmaFieldsAlpha.Store.get("vars", this.context, this.driver, id, key)) {

              KarmaFieldsAlpha.Store.set([], "vars", this.context, this.driver, id, key);

            }

          }

        }

      }

    }

  }

}


KarmaFieldsAlpha.Task.QueryValueCache = class extends KarmaFieldsAlpha.Task.QueryValue {

  constructor(driver, paramstring, context = "cache", priority = 1) {

    super(driver, paramstring, context, priority);

  }

  async fetch() {

    return KarmaFieldsAlpha.Database.Queries.get("query", this.driver, this.paramstring);

  }

  async fetchRelation(relation, ids) {

    return KarmaFieldsAlpha.Database.Queries.get(relation, this.driver, `ids=${ids.join(",")}`);

  }

}


KarmaFieldsAlpha.Task.Add = class {

  constructor(driver, paramstring, params) {

    this.type = "add";
    this.driver = driver;
    this.paramstring = paramstring;
    this.params = params;

  }

  create(id, state = "adding") {

    // const items = KarmaFieldsAlpha.Store.Delta.get("items", "remote", this.driver, this.paramstring) || [];
    const items = KarmaFieldsAlpha.Store.State.get("items", this.driver, this.paramstring) || [];


    const item = items.find(item => item[state]);

    if (item) {

      delete item[state];

      for (let key in item) {

        KarmaFieldsAlpha.Store.Delta.set(item[key], "vars", "remote", this.driver, id, key);

        delete item[key];

      }

      item.id = id;

    }

    // KarmaFieldsAlpha.Store.Delta.set(items, "items", "remote", this.driver, this.paramstring);
    KarmaFieldsAlpha.Store.State.set(items, "items", this.driver, this.paramstring);

    KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, id, "trash");
    KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, id, "trash");


    // clean items relations to force reload
    KarmaFieldsAlpha.Store.remove("relations", "remote", this.driver, this.paramstring);

  }

  async resolve() {

    let id = await KarmaFieldsAlpha.HTTP.post(`add/${this.driver}`, this.params);

    id = id.toString();

    if (this.paramstring === undefined) {

      this.paramstring = `ids=${id}`;

    }

    this.create(id, "adding");

    // KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, id, "trash");
    // KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, id, "trash");
    //
    //
    //
    // const items = KarmaFieldsAlpha.Store.get("items", "remote", this.driver, this.paramstring) || [];
    //
    // const index = items.findIndex(item => item.adding);
    //
    // if (index > -1) {
    //
    //   for (let key in items[index]) {
    //
    //     KarmaFieldsAlpha.Store.Delta.set(items[index][key], "vars", "remote", this.driver, id, key);
    //
    //   }
    //
    //   items[index] = {id};
    //
    // }


    // const items = KarmaFieldsAlpha.Store.Delta.get("items", "remote", this.driver, this.paramstring);
    //
    // const index = items.findIndex(item => item.adding);
    //
    // if (index > -1) {
    //
    //   const clones = [...items];
    //   clones[index] = {id};
    //
    //   KarmaFieldsAlpha.Store.Delta.set(clones, "items", "remote", this.driver, this.paramstring);
    //
    //   const temp = KarmaFieldsAlpha.Store.get("temp", this.driver, this.paramstring, index);
    //
    //   if (temp) {
    //
    //     for (let key in temp) {
    //
    //       KarmaFieldsAlpha.Store.Delta.set(temp[key], "vars", "remote", this.driver, id, key);
    //
    //     }
    //
    //     KarmaFieldsAlpha.Store.remove("temp", this.driver, this.paramstring, index);
    //
    //   }
    //
    // }

  }

}


// KarmaFieldsAlpha.Task.Upload = class {
//
//   constructor(driver, paramstring, file, params) {
//
//     this.type = "upload";
//     this.driver = driver;
//     this.paramstring = paramstring;
//     // this.index = index;
//     this.file = file;
//     this.params = params;
//
//   }
//
//   async resolve() {
//
//     let id = await KarmaFieldsAlpha.HTTP.upload(this.file); // -> parent is not going to be saved!
//
//     id = id.toString();
//
//     if (!this.paramstring) {
//
//       this.paramstring = `ids=${id}`;
//
//     }
//
//     const backupItems = await KarmaFieldsAlpha.History.getBackup("delta", "items", "remote", this.driver, this.paramstring) || []
//
//     const backupIndex = backupItems.findIndex(item => !item.id);
//
//     if (backupIndex > -1) {
//
//       backupItems[backupIndex].id = id;
//
//     }
//
//     await KarmaFieldsAlpha.History.backup(backupItems, "delta", "items", "remote", this.driver, this.paramstring);
//
//
//     const deltaItems = KarmaFieldsAlpha.Store.Delta.get("items", "remote", this.driver, this.paramstring);
//
//     const deltaIndex = deltaItems.findIndex(item => !item.id && item.uploading);
//
//     if (deltaIndex > -1) {
//
//       const newDeltaItems = [...deltaIndex];
//
//       newDeltaItems[deltaIndex] = {id, delta: this.params};
//
//       KarmaFieldsAlpha.Store.Delta.set(newDeltaItems, "items", "remote", this.driver, this.paramstring);
//
//     }
//
//   }
//
// }


KarmaFieldsAlpha.Task.Upload = class extends KarmaFieldsAlpha.Task.Add {

  constructor(driver, paramstring, file, params) {

    super(driver, paramstring, params);

    this.type = "upload";
    this.file = file;

  }



  async resolve() {

    let id = await KarmaFieldsAlpha.HTTP.upload(this.file); // -> parent and params are not going anywhere!

    id = id.toString();

    if (this.params) {

      await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}`, {[id]: this.params});

    }

    // clean items result or file data will not load
    // KarmaFieldsAlpha.Store.remove("items", "remote", this.driver, this.paramstring);

    // clean items relations or file data will not load
    KarmaFieldsAlpha.Store.remove("relations", "remote", this.driver, this.paramstring);



    if (this.paramstring === undefined) {

      this.paramstring = `ids=${id}`;

    }

    this.create(id, "uploading");

    // KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, id, "trash");
    // KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, id, "trash");
    //
    //
    // const items = KarmaFieldsAlpha.Store.get("items", "remote", this.driver, this.paramstring) || [];
    //
    // const index = items.findIndex(item => item.adding);
    //
    // if (index > -1) {
    //
    //   for (let key in items[index]) {
    //
    //     KarmaFieldsAlpha.Store.Delta.set(items[index][key], "vars", "remote", this.driver, id, key);
    //
    //   }
    //
    //   items[index] = {id};
    //
    // }



    // const items = KarmaFieldsAlpha.Store.Delta.get("items", "remote", this.driver, this.paramstring);
    //
    // const index = items.findIndex(item => item.uploading);
    //
    // if (index > -1) {
    //
    //   const clones = [...items];
    //   clones[index] = {id};
    //
    //   KarmaFieldsAlpha.Store.Delta.set(clones, "items", "remote", this.driver, this.paramstring);
    //
    //   const temp = KarmaFieldsAlpha.Store.get("temp", this.driver, this.paramstring, index);
    //
    //   if (temp) {
    //
    //     for (let key in temp) {
    //
    //       KarmaFieldsAlpha.Store.Delta.set(temp[key], "vars", "remote", this.driver, id, key);
    //
    //     }
    //
    //     KarmaFieldsAlpha.Store.remove("temp", this.driver, this.paramstring, index);
    //
    //   }
    //
    // }






    // const backupItems = await KarmaFieldsAlpha.History.getBackup("delta", "items", "remote", this.driver, this.paramstring) || []
    //
    // const backupIndex = backupItems.findIndex(item => !item.id);
    //
    // if (backupIndex > -1) {
    //
    //   backupItems[backupIndex].id = id;
    //
    // }
    //
    // await KarmaFieldsAlpha.History.backup(backupItems, "delta", "items", "remote", this.driver, this.paramstring);
    //
    //
    // const deltaItems = KarmaFieldsAlpha.Store.Delta.get("items", "remote", this.driver, this.paramstring);
    //
    // const deltaIndex = deltaItems.findIndex(item => !item.id && item.uploading);
    //
    // if (deltaIndex > -1) {
    //
    //   const newDeltaItems = [...deltaIndex];
    //
    //   newDeltaItems[deltaIndex] = {id, delta: this.params};
    //
    //   KarmaFieldsAlpha.Store.Delta.set(newDeltaItems, "items", "remote", this.driver, this.paramstring);
    //
    // }

  }

}



// KarmaFieldsAlpha.Task.Save = class {
//
//   static create() {
//
//     if (KarmaFieldsAlpha.Task.find(task => task.constructor === this)) {
//
//       const task = new this();
//
//       KarmaFieldsAlpha.Task.add(task);
//
//     }
//
//   }
//
//   hasDelta() {
//
//     const delta = KarmaFieldsAlpha.Store.Delta.get("items", "remote");
//
//     if (delta) {
//
//       for (let driver in delta) {
//
//         for (let paramstring in delta[driver]) {
//
//           for (let item of delta[driver][paramstring]) {
//
//             if (item.id) {
//
//               if (item.delta) {
//
//                 for (let key in item) {
//
//                   const remote = KarmaFieldsAlpha.Store.get("vars", "remote", driver, item.id, key);
//
//                   if (!KarmaFieldsAlpha.DeepObject.equal(item.delta[key], remote)) {
//
//                     return true;
//
//                   }
//
//                 }
//
//               }
//
//             } else {
//
//               return true;
//
//             }
//
//           }
//
//         }
//
//       }
//
//     }
//
//     const trash = KarmaFieldsAlpha.Store.Delta.get("trash");
//
//     if (trash) {
//
//       for (let driver in trash) {
//
//         if (trash[driver] && trash[driver].length) {
//
//           return true;
//
//         }
//
//       }
//
//     }
//
//     return false;
//   }
//
//   getDelta() {
//
//     const deltaItems = KarmaFieldsAlpha.Store.Delta.get("items", "remote");
//     const delta = {};
//
//     if (deltaItems) {
//
//       for (let driver in deltaItems) {
//
//         const driverItems = [];
//
//         for (let paramstring in deltaItems[driver]) {
//
//           const data = deltaItems[driver][paramstring];
//
//           for (let row of data) {
//
//             if (!row.id || row.delta) {
//
//               const newItem = {};
//
//               for (let key in row.delta) {
//
//                 if (!row.id || !KarmaFieldsAlpha.DeepObject.equal(row.delta[key], KarmaFieldsAlpha.Store.get("vars", "remote", driver, row.id, key))) {
//
//                   newItem[key] = row.delta[key];
//
//                 }
//
//               }
//
//               if (Object.keys(newItem) || !row.id) {
//
//                 if (!delta[driver]) {
//
//                   delta[driver] = [];
//
//                 }
//
//                 delta[driver].push({
//                   id: row.id,
//                   delta: newItem
//                 });
//
//               }
//
//             }
//
//           }
//
//         }
//
//       }
//
//     }
//
//     const trash = KarmaFieldsAlpha.Store.Delta.get("trash");
//
//     if (trash) {
//
//       for (let driver in trash) {
//
//         const ids = trash[driver];
//
//         for (let id of ids) {
//
//           if (ids && ids.length) {
//
//             if (!delta[driver]) {
//
//               delta[driver] = [];
//
//             }
//
//             delta[driver].push({
//               id: id,
//               delta: {trash: ["1"]}
//             });
//
//           }
//
//         }
//
//       }
//
//     }
//
//     return delta;
//   }
//
//   async update() {
//
//     const deltaItems = KarmaFieldsAlpha.Store.Delta.get("items", "remote");
//
//     if (deltaItems) {
//
//       for (let driver in deltaItems) {
//
//         for (let paramstring in deltaItems[driver]) {
//
//           const data = deltaItems[driver][paramstring];
//           const items = data.map(item => ({id: item.id}));
//
//           KarmaFieldsAlpha.Store.set(items, "items", "cache", driver, paramstring);
//           KarmaFieldsAlpha.Store.remove("items", "remote", driver, paramstring);
//           KarmaFieldsAlpha.Store.remove("relations", "remote", driver, paramstring);
//
//           for (let row of data) {
//
//             if (row.delta) {
//
//               for (let key in row.delta) {
//
//                 KarmaFieldsAlpha.Store.set(row.delta[key], "vars", "cache", driver, row.id, key);
//                 KarmaFieldsAlpha.Store.remove("vars", "remote", driver, row.id, key);
//
//               }
//
//             }
//
//           }
//
//         }
//
//         await KarmaFieldsAlpha.Database.Queries.removeDriver(driver);
//
//       }
//
//     }
//
//   }
//
//   async resolve() {
//
//     const delta = this.getDelta();
//
//     await this.update();
//
//     for (let driver in delta) {
//
//       await KarmaFieldsAlpha.HTTP.post(`sync/${driver}`, delta[driver]);
//
//     }
//
//     KarmaFieldsAlpha.Store.Buffer.remove("state", "delta", "items", "remote"); // do not update history !
//     KarmaFieldsAlpha.Store.Buffer.remove("state", "delta", "trash"); // do not update history !
//
//   }
//
// }


KarmaFieldsAlpha.Task.Count = class {

  constructor(driver, paramstring, context = "cache") {

    this.type = "count";
    this.driver = driver;
    this.paramstring = paramstring;
    this.context = context;

  }

  async resolve() {

    let count;

    if (this.context === "cache") {

      count = await KarmaFieldsAlpha.Database.Queries.get("count", this.driver, this.paramstring);

      const task = new this.constructor(this.driver, this.paramstring, "remote");

      KarmaFieldsAlpha.Task.add(task);

    } else {

      count = await KarmaFieldsAlpha.HTTP.get(`count/${this.driver}${this.paramstring ? `?${this.paramstring}` : ""}`);

      await KarmaFieldsAlpha.Database.Queries.set(count, "count", this.driver, this.paramstring);

    }

    KarmaFieldsAlpha.Store.State.set(count, "count", this.driver, this.paramstring);

  }

}




KarmaFieldsAlpha.Task.Save = class {


  getDelta() {

    const output = {};
    const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");

    // return KarmaFieldsAlpha.DeepObject.filter(delta, (item, driver, id, key) => this.isModified(item, driver, id, key), 3);

    if (delta) {

      for (let driver in delta) {

        for (let id in delta[driver]) {

          for (let key in delta[driver][id]) {

            if (this.isModified(delta[driver][id][key], driver, id, key)) {

              KarmaFieldsAlpha.DeepObject.set(output, delta[driver][id][key], driver, id, key);

            }

          }

        }

      }

    }

    return output;

  }

  isModified(value, driver, id, key) {

    let current = KarmaFieldsAlpha.Store.get("vars", "remote", driver, id, key);

    return !KarmaFieldsAlpha.DeepObject.equal(value, current);

  }

  hasDelta() {

    const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");

    // return delta && KarmaFieldsAlpha.DeepObject.some(delta, (item, driver, id, key) => {
    //   return this.isModified(item, driver, id, key);
    // }, 3);

    if (delta) {

      for (let driver in delta) {

        for (let id in delta[driver]) {

          for (let key in delta[driver][id]) {

            if (this.isModified(delta[driver][id][key], driver, id, key)) {

              return true;

            }

          }

        }

      }

    }

    return false;

  }

  async resolve() {

    const delta = this.getDelta();

    for (let driver in delta) {

      await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, delta[driver]);

      await this.cleanDriver(driver, delta[driver]);

    }

  }

  // async cleanDriver(driver, delta) {
  //
  //   const vars = KarmaFieldsAlpha.Store.get("vars", "remote", driver);
  //
  //   KarmaFieldsAlpha.Store.set(vars, "vars", "cache", driver);
  //
  //   KarmaFieldsAlpha.Store.remove("vars", "remote", driver);
  //
  //
  //   for (let id in delta) {
  //
  //     for (let key in delta[id]) {
  //
  //       KarmaFieldsAlpha.Store.set(delta[id][key], "vars", "cache", driver, id, key);
  //
  //     }
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.Buffer.remove("state", "delta", "vars", "remote", driver); // do not update history !
  //
  //   const queries = KarmaFieldsAlpha.Store.Delta.get("items", "remote", driver);
  //
  //   for (let paramstring in queries) {
  //
  //     KarmaFieldsAlpha.Store.set(queries[paramstring], "items", "cache", driver, paramstring);
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.remove("items", "remote", driver);
  //   KarmaFieldsAlpha.Store.remove("relations", "remote", driver);
  //
  //   KarmaFieldsAlpha.Store.Delta.remove("items", "remote", driver); // update history ?
  //
  //   await KarmaFieldsAlpha.Database.Queries.removeDriver(driver);
  // }

  async cleanDriver(driver, delta) {

    // const vars = KarmaFieldsAlpha.Store.get("vars", "remote", driver);
    //
    // KarmaFieldsAlpha.Store.set(vars, "vars", "cache", driver);
    //
    // KarmaFieldsAlpha.Store.remove("vars", "remote", driver);


    for (let id in delta) {

      for (let key in delta[id]) {

        KarmaFieldsAlpha.Store.set(delta[id][key], "vars", "remote", driver, id, key);

      }

    }

    KarmaFieldsAlpha.Store.Buffer.remove("state", "delta", "vars", "remote", driver); // do not update history !

    // const queries = KarmaFieldsAlpha.Store.Delta.get("items", "remote", driver);
    //
    // for (let paramstring in queries) {
    //
    //   KarmaFieldsAlpha.Store.set(queries[paramstring], "items", "cache", driver, paramstring);
    //
    // }


    KarmaFieldsAlpha.Store.set(KarmaFieldsAlpha.Store.State.get("items", driver), "items", driver);

    KarmaFieldsAlpha.Store.State.remove("items", driver);

    KarmaFieldsAlpha.Store.remove("relations", "remote", driver);

    // KarmaFieldsAlpha.Store.Delta.remove("items", "remote", driver); // update history ?

    await KarmaFieldsAlpha.Database.Queries.removeDriver(driver);
  }

}


KarmaFieldsAlpha.Task.SaveData = class {

  constructor(driver, data) {

    this.driver = driver;
    // this.data = Object.fromEntries(Object.entries(data).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));
    this.data = {};

    for (let id in data) {

      for (let key in data[id]) {

        const value = new KarmaFieldsAlpha.Content(data[id][key]).toArray();

        KarmaFieldsAlpha.DeepObject.set(this.data, value, id, KarmaFieldsAlpha.Driver.getAlias(this.driver, key));

      }

    }


  }

  async resolve() {

    for (let id in this.data) {

      for (let key in this.data[id]) {

        KarmaFieldsAlpha.Store.set(KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver, id, key), "vars", "remote", this.driver, id, key);

        KarmaFieldsAlpha.Store.Delta.remove("vars", "remote", this.driver, id, key);

      }

    }

    await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}`, this.data);

    await KarmaFieldsAlpha.Database.Queries.removeDriver(this.driver);

    // KarmaFieldsAlpha.Store.set(KarmaFieldsAlpha.Store.get("items", "remote", this.driver), "items", "cache", this.driver);
    //
    // KarmaFieldsAlpha.Store.remove("items", "remote", this.driver);
    // KarmaFieldsAlpha.Store.remove("relations", "remote", this.driver);

  }

}
