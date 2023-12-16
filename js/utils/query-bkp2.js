
KarmaFieldsAlpha.Query = class { // class Driver ?

  static getAlias(driver, key) {
console.error("deprecated");
    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "alias", key) || key;

  }

  static getRelations(driver) {
console.error("deprecated");
    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "relations");

  }

  static getAttempt(driver, id) {
console.error("deprecated");
    if (!KarmaFieldsAlpha.Store.get("attempts", driver, id, "query")) {

      return "query";

    }

    const relations = this.getRelations(driver);

    if (relations) {

      for (let relation of relations) {

        if (!KarmaFieldsAlpha.Store.get("attempts", driver, id, relation)) {

          return relation;

        }

      }

    }

  }


  static getValue(driver, id, key) {
console.error("deprecated");
    key = this.getAlias(driver, key);

    // let value = KarmaFieldsAlpha.Store.State.get("delta", driver, id, key);
    //
    // if (!value) {
    //
    //   value = KarmaFieldsAlpha.Store.get("vars", driver, id, key);
    //
    // }

    let delta = KarmaFieldsAlpha.Store.State.get("delta", driver, id, key);
    let value = KarmaFieldsAlpha.Store.get("vars", driver, id, key);

    const content = new KarmaFieldsAlpha.Content.Request(delta || value);

    content.modified = delta && KarmaFieldsAlpha.DeepObject.differ(delta, value);

    if (content.loading) { // -> create a task to fetch it

      const attempt = this.getAttempt(driver, id);

      if (attempt) {

        const tasks = KarmaFieldsAlpha.Store.get("tasks") || [];

        let task = tasks.find(task => task.type === "vars" && task.driver === driver && task.attempt === attempt);

        if (!task) {

          task = {
            name: `Loading Content...`,
            type: "vars",
            driver: driver,
            ids: new Set(),
            attempt: attempt,
            resolve: task => {

              if (attempt === "query") {

                 return KarmaFieldsAlpha.Remote.queryIds(task.driver, [...task.ids]);

              } else {

    						return KarmaFieldsAlpha.Remote.queryRelations(task.driver, [...task.ids], task.attempt);

              }
            }
          };

          // tasks.push(task); // -> tasks is mutable BUT wont work if empty

          KarmaFieldsAlpha.Store.set([...tasks, task], "tasks");

        }

        task.ids.add(id);

      } else { // -> no value found

        // value = [];
        content.loading = false;
        content.notFound = true;

        KarmaFieldsAlpha.Store.set("vars", [], driver, id, key);

      }

    }

    // return value; // return array | undefined (not ready)
    return content;

  }

  // static parseResults(results, driver) {
  //
  //   const idAlias = KarmaFieldsAlpha.Query.getAlias(driver, "id");
  //
  //   for (let item of results) {
  //
  //     const id = item[idAlias].toString();
  //
  //     for (let key in item) {
  //
  //       const value = KarmaFieldsAlpha.Type.toArray(item[key]);
  //
  //       KarmaFieldsAlpha.Store.set(value, "vars", driver, id, key);
  //
  //     }
  //
  //     KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, "query");
  //
  //     KarmaFieldsAlpha.Store.set([], "vars", driver, id, "trash");
  //
  //   }
  //
  // }
  //
  // static parseResultsDiff(results, driver) {
  //
  //   const idAlias = KarmaFieldsAlpha.Query.getAlias(driver, "id");
  //
  //   for (let item of results) {
  //
  //     const id = item[idAlias].toString();
  //
  //     for (let key in item) {
  //
  //       const localValue = KarmaFieldsAlpha.Store.get("vars", driver, id, key);
  //
  //       const remoteValue = KarmaFieldsAlpha.Type.toArray(item[key]);
  //
  //       if (!KarmaFieldsAlpha.DeepObject.compare(remoteValue, localValue)) {
  //
  //         KarmaFieldsAlpha.Store.set(remoteValue, "varsDiff", driver, id, key);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }
  //
  //
  // static getResultsBETA(driver, params) {
  //
  //   const paramstring = KarmaFieldsAlpha.Params.stringify({
  //     page: 1,
  //     ppp: 100,
  //     ...params
  //   });
  //
  //   let query = KarmaFieldsAlpha.Store.get("queries", driver, paramstring);
  //
  //   // const tasks = KarmaFieldsAlpha.Store.get("tasks") || [];
  //
  //   let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.type === "query" && task.driver === driver && task.paramstring === paramstring);
  //
  //
  //   if (!task) {
  //
  //     if (query) {
  //
  //       KarmaFieldsAlpha.Store.Tasks.add({
  //         name: `Loading Data`,
  //         priority: -1,
  //         type: "query",
  //         driver: driver,
  //         paramstring: paramstring,
  //         resolve: async task => {
  //           const remoteResults = await KarmaFieldsAlpha.HTTP.get(`query/${driver}${paramstring ? `?${paramstring}` : ""}`);
  //           this.parseResultsDiff(remoteResults, driver);
  //         }
  //       });
  //
  //     } else if (!query) {
  //
  //       KarmaFieldsAlpha.Store.Tasks.add({
  //         name: `Loading Data`,
  //         type: "query",
  //         driver: driver,
  //         paramstring: paramstring,
  //         resolve: async task => {
  //           const results = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);
  //
  //           if (results) {
  //
  //             KarmaFieldsAlpha.Store.set(results, "queries", driver, paramstring);
  //
  //             this.parseResults(results, driver);
  //
  //             KarmaFieldsAlpha.Store.Tasks.add({
  //               name: `Loading Data`,
  //               type: "query",
  //               priority: -1,
  //               driver: driver,
  //               paramstring: paramstring,
  //               resolve: async task => {
  //                 const remoteResults = await KarmaFieldsAlpha.HTTP.get(`query/${driver}${paramstring ? `?${paramstring}` : ""}`);
  //                 this.parseResultsDiff(remoteResults, driver);
  //               }
  //             });
  //
  //           } else {
  //
  //             KarmaFieldsAlpha.Store.Tasks.add({
  //               name: `Loading Data`,
  //               type: "query",
  //               driver: driver,
  //               paramstring: paramstring,
  //               resolve: async task => {
  //                 const remoteResults = await KarmaFieldsAlpha.HTTP.get(`query/${driver}${paramstring ? `?${paramstring}` : ""}`);
  //                 KarmaFieldsAlpha.Store.set(remoteResults, "queries", driver, paramstring);
  //                 this.parseResults(remoteResults, driver);
  //               }
  //             });
  //
  //           }
  //
  //         }
  //       });
  //
  //     }
  //
  //   }
  //
  //
  //
  //
  //   return new KarmaFieldsAlpha.Content.Request(query);
  // }





  static getResults(driver, params) {
console.error("deprecated");
    const paramstring = KarmaFieldsAlpha.Params.stringify({
      page: 1,
      ppp: 100,
      ...params
    });

    let query = KarmaFieldsAlpha.Store.get("queries", driver, paramstring);

    if (!query) {

      const tasks = KarmaFieldsAlpha.Store.get("tasks") || [];

      let task = tasks.find(task => task.type === "query" && task.driver === driver && task.paramstring === paramstring);

      if (!task) {

        task = {
          name: `Loading Data`,
          type: "query",
          driver: driver,
          paramstring: paramstring,
          resolve: task => KarmaFieldsAlpha.Remote.query(task.driver, task.paramstring)
        };

        KarmaFieldsAlpha.Store.set([...tasks, task], "tasks");

      }

    }

    // return query;

    return new KarmaFieldsAlpha.Content.Request(query);
  }

  static getIds(driver, params) {
console.error("deprecated");
    let results = this.getResults(driver, params);

    if (!results.loading) {

      const idAlias = this.getAlias(driver, "id");

      results.value = results.value.map(item => item[idAlias]);

    }

    return results;
  }

  static getCount(driver, params) {
console.error("deprecated");
    const paramstring = KarmaFieldsAlpha.Params.stringify(params);

    let count = KarmaFieldsAlpha.Store.get("counts", driver, paramstring);

    if (count === undefined) {

      const tasks = KarmaFieldsAlpha.Store.get("tasks") || [];

      let task = tasks.find(task => task.type === "count" && task.driver === driver && task.paramstring === paramstring);

      if (!task) {

        task = {
          name: `Counting`,
          type: "count",
          driver: driver,
          paramstring: paramstring,
          resolve: task => KarmaFieldsAlpha.Remote.count(task.driver, task.paramstring)
        };

        KarmaFieldsAlpha.Store.set([...tasks, task], "tasks");

      }

    }

    // return count;
    return new KarmaFieldsAlpha.Content.Request(count);
  }

  static update(data, driver, id) {

    const tasks = KarmaFieldsAlpha.Store.get("tasks") || [];

    let task = tasks.find(task => task.type === "update" && task.driver === driver && task.id === id);

    if (!task) {

      tasks.push({
        name: "Saving...",
        type: "update",
        driver: driver,
        id: id,
        resolve: task => KarmaFieldsAlpha.Remote.update(data, task.driver, task.id)
      });

      KarmaFieldsAlpha.Store.set([...tasks, task], "tasks");

    }

  }

  static sync() {

    const tasks = KarmaFieldsAlpha.Store.get("tasks") || [];

    let task = tasks.find(task => task.type === "sync");

    if (!task) {

      task = {
        name: "Saving...",
        type: "sync",
        resolve: task => KarmaFieldsAlpha.Remote.sync()
      };

      KarmaFieldsAlpha.Store.set([...tasks, task], "tasks");

    }

  }

  static add(driver, params = null, index = 0, length = 1, ...path) {

    const tasks = KarmaFieldsAlpha.Store.get("tasks") || [];

    let task = tasks.find(task => task.type === "add" && task.driver === driver);

    if (task) {

      task.length += length;

    } else {

      task = {
        name: `Inserting...`,
        type: "add",
        driver: driver,
        params: params,
        index: index,
        // layer: layer,
        path: path,
        length: length,
        resolve: task => KarmaFieldsAlpha.Remote.add(task.driver, task.params, task.index, task.length, ...task.path)
      };

      KarmaFieldsAlpha.Store.set([...tasks, task], "tasks");

    }

    const items = KarmaFieldsAlpha.Store.Layer.getItems() || [];
    const newItems = [...items];

    for (let i = 0; i < length; i++) {

      KarmaFieldsAlpha.DeepArray.splice(newItems, 0, [{loading: true}], index, ...path);

    }

    KarmaFieldsAlpha.Store.Layer.setItems(newItems);

    KarmaFieldsAlpha.Store.remove("queries", driver);
    KarmaFieldsAlpha.Store.remove("counts", driver);

  }

  static upload(driver, files, params, index = 0) {

    const tasks = KarmaFieldsAlpha.Store.get("tasks") || [];

		const layer = KarmaFieldsAlpha.Store.State.get("layerIndex");

    const currentItems = KarmaFieldsAlpha.Store.Layer.get("items");
    const newItems = [...currentItems];

    const loadingItems = [...files].map(file => ({loading: true}));

    newItems.splice(index, 0,loadingItems);

    for (let i = 0; i < files.length; i++) {

      const task = {
        name: `Uploading File...`,
        type: "upload",
        driver: driver,
        file: files[i],
        layer: layer,
        params: {...params},
        index: index + i,
        resolve: task => KarmaFieldsAlpha.remote.upload(task.file, task.index, task.params, task.layer)
      }

      tasks.push(task);

    }

    KarmaFieldsAlpha.Store.set(tasks, "tasks");

    KarmaFieldsAlpha.Store.Layer.set(newItems, "items");

    KarmaFieldsAlpha.Store.remove("queries", driver);
    KarmaFieldsAlpha.Store.remove("counts", driver);

  }


  static init() {

    // const tasks = KarmaFieldsAlpha.Store.get("tasks") || [];
    //
    // let task = tasks.find(task => task.type === "init");
    //
    // if (!task) {
    //
    //   task = {
    //     type: "init",
    //     resolve: () => {}
    //   };
    //
    //   tasks.push(task);
    //
    //   KarmaFieldsAlpha.Store.set(tasks, "tasks");
    //
    // }


    KarmaFieldsAlpha.Store.Tasks.find(task => true) || KarmaFieldsAlpha.Store.Tasks.add({
      resolve: () => {}
    });


  }



}

// KarmaFieldsAlpha.Content.Query = class extends KarmaFieldsAlpha.Content {
//
//   constructor(driver, params) {
//
//     const paramstring = KarmaFieldsAlpha.Params.stringify({
//       page: 1,
//       ppp: 100,
//       ...params
//     });
//
//     this.value = KarmaFieldsAlpha.Store.get("queries", driver, paramstring);
//
//     this.loading = !this.value;
//
//     let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.type === "query" && task.driver === driver && task.paramstring === paramstring);
//
//     if (!task) {
//
//       if (query) {
//
//         KarmaFieldsAlpha.Store.Tasks.add({
//           name: `Loading Data`,
//           priority: -1,
//           type: "query",
//           driver: driver,
//           paramstring: paramstring,
//           resolve: async task => {
//             const remoteResults = await KarmaFieldsAlpha.HTTP.get(`query/${driver}${paramstring ? `?${paramstring}` : ""}`);
//             this.parseResultsDiff(remoteResults, driver);
//           }
//         });
//
//       } else if (!query) {
//
//         KarmaFieldsAlpha.Store.Tasks.add({
//           name: `Loading Data`,
//           type: "query",
//           driver: driver,
//           paramstring: paramstring,
//           resolve: async task => {
//             const results = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);
//
//             if (results) {
//
//               KarmaFieldsAlpha.Store.set(results, "queries", driver, paramstring);
//
//               this.parseResults(results, driver);
//
//               KarmaFieldsAlpha.Store.Tasks.add({
//                 name: `Loading Data`,
//                 type: "query",
//                 priority: -1,
//                 driver: driver,
//                 paramstring: paramstring,
//                 resolve: async task => {
//                   const remoteResults = await KarmaFieldsAlpha.HTTP.get(`query/${driver}${paramstring ? `?${paramstring}` : ""}`);
//                   this.parseResultsDiff(remoteResults, driver);
//                 }
//               });
//
//             } else {
//
//               KarmaFieldsAlpha.Store.Tasks.add({
//                 name: `Loading Data`,
//                 type: "query",
//                 driver: driver,
//                 paramstring: paramstring,
//                 resolve: async task => {
//                   const remoteResults = await KarmaFieldsAlpha.HTTP.get(`query/${driver}${paramstring ? `?${paramstring}` : ""}`);
//                   KarmaFieldsAlpha.Store.set(remoteResults, "queries", driver, paramstring);
//                   this.parseResults(remoteResults, driver);
//                   await KarmaFieldsAlpha.Database.Queries.set(remoteResults, "query", driver, paramstring);
//                 }
//               });
//
//             }
//
//           }
//         });
//
//       }
//
//     }
//
//     const diffQuery = KarmaFieldsAlpha.Store.get("diffQueries", driver, paramstring);
//
//     if (!this.loading && diffQuery) {
//
//       this.value = diffQuery;
//
//     }
//
//   }
//
//   parseResults(results, driver) {
//
//     const idAlias = KarmaFieldsAlpha.Query.getAlias(driver, "id");
//
//     for (let item of results) {
//
//       const id = item[idAlias].toString();
//
//       for (let key in item) {
//
//         const value = KarmaFieldsAlpha.Type.toArray(item[key]);
//
//         KarmaFieldsAlpha.Store.set(value, "vars", driver, id, key);
//
//       }
//
//       KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, "query");
//
//       KarmaFieldsAlpha.Store.set([], "vars", driver, id, "trash");
//
//     }
//
//   }
//
//   parseResultsDiff(results, driver) {
//
//     const idAlias = KarmaFieldsAlpha.Query.getAlias(driver, "id");
//
//     for (let item of results) {
//
//       const id = item[idAlias].toString();
//
//       for (let key in item) {
//
//         const localValue = KarmaFieldsAlpha.Store.get("vars", driver, id, key);
//
//         const remoteValue = KarmaFieldsAlpha.Type.toArray(item[key]);
//
//         if (!KarmaFieldsAlpha.DeepObject.compare(remoteValue, localValue)) {
//
//           KarmaFieldsAlpha.Store.set(remoteValue, "diffVars", driver, id, key);
//
//         }
//
//       }
//
//     }
//
//     const localQuery = KarmaFieldsAlpha.Store.get("queries", driver, paramstring);
//
//     if (!localQuery || localQuery.length !== results.length || results.some((item, index) => item[idAlias] !== localQuery[index][idAlias])) {
//
//       const items = results.map(item => ({id: item.id}));
//
//       KarmaFieldsAlpha.Store.set(items, "diffQueries", driver, paramstring);
//
//     } else {
//
//       KarmaFieldsAlpha.Store.remove("diffQueries", driver, paramstring);
//
//     }
//
//   }
//
//
//   toIds() {
//
//     return this.toArray().map(item => item.id);
//
//   }
//
// }


KarmaFieldsAlpha.Driver = class {


  static getAlias(driver, key) {

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "alias", key) || key;

  }

  static parseResults(driver, results) {

    const idAlias = this.getAlias(driver, "id");

    for (let item of results) {

      const id = item[idAlias].toString();

      for (let key in item) {

        const value = KarmaFieldsAlpha.Type.toArray(item[key]);

        KarmaFieldsAlpha.Store.set(value, "vars", driver, id, key);

      }

      KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, "query");

      KarmaFieldsAlpha.Store.set([], "vars", driver, id, "trash");

    }

  }

  static verifyResults(driver, paramstring) {

    KarmaFieldsAlpha.Store.Tasks.add({
      name: `Verfifying Data`,
      type: "verify-query",
      priority: -1,
      resolve: async task => {
        const query = await KarmaFieldsAlpha.HTTP.get(`query/${driver}${paramstring ? `?${paramstring}` : ""}`);
        this.parseDiff(driver, query, paramstring);
      }
    });

  }

  static parseDiff(driver, results, paramstring) {

    const idAlias = this.getAlias(driver, "id");

    for (let item of results) {

      const id = item[idAlias].toString();

      for (let key in item) {

        const localValue = KarmaFieldsAlpha.Store.get("vars", driver, id, key);

        const remoteValue = KarmaFieldsAlpha.Type.toArray(item[key]);

        if (!KarmaFieldsAlpha.DeepObject.compare(remoteValue, localValue)) {

          KarmaFieldsAlpha.Store.set(remoteValue, "diffVars", driver, id, key);

        } else {

          KarmaFieldsAlpha.Store.remove("diffVars", driver, id, key);

        }

      }

    }

    const localQuery = KarmaFieldsAlpha.Store.get("queries", driver, paramstring);

    if (!localQuery || localQuery.length !== results.length || results.some((item, index) => item[idAlias] !== localQuery[index][idAlias])) {

      const items = results.map(item => ({id: item.id}));

      KarmaFieldsAlpha.Store.set(items, "diffQueries", driver, paramstring);

    } else {

      KarmaFieldsAlpha.Store.remove("diffQueries", driver, paramstring);

    }

  }

  static createDataset(relations) {

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

  static parseRelations(driver, relations, ids) {

    const data = this.createDataset(relations); // first create a dataset to avoid same values being inserted multiple times

    for (let id in data) {

      for (let key in data[id]) {

        KarmaFieldsAlpha.Store.set(data[id][key], "vars", driver, id, key);

      }

    }

    for (let id of ids) {

      KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, name);

    }

  }

  static verifyRelations(driver, ids, attempt) {

    KarmaFieldsAlpha.Store.Tasks.add({
      name: `Loading Content...`,
      type: "verify-relations",
      priority: -1,
      resolve: async task => {

        const paramstring = `ids=${ids.join(",")}`;
        const remoteResults = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${attempt}?${paramstring}`);

        if (remoteResults) {

          this.parseRelationsDiff(driver, remoteResults);

        }

      }

    });

  }

  static parseRelationsDiff(driver, relations) {

    const data = this.createDataset(relations);

    for (let id in data) {

      for (let key in data[id]) {

        const localValue = KarmaFieldsAlpha.Store.get("vars", driver, id, key);
        const remoteValue = data[id][key];

        if (!KarmaFieldsAlpha.DeepObject.compare(remoteValue, localValue)) {

          KarmaFieldsAlpha.Store.set(remoteValue, "diffVars", driver, id, key);

        }

      }

    }

  }

  static getRelations(driver) {

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "relations");

  }

  static getAttempt(driver, id) {

    if (!KarmaFieldsAlpha.Store.get("attempts", driver, id, "query")) {

      return "query";

    }

    const relations = this.getRelations(driver);

    if (relations) {

      for (let relation of relations) {

        if (!KarmaFieldsAlpha.Store.get("attempts", driver, id, relation)) {

          return relation;

        }

      }

    }

  }

}




KarmaFieldsAlpha.Content.Query = class extends KarmaFieldsAlpha.Content {

  constructor(driver, params) {

    super();

    this.driver = driver;

    const paramstring = KarmaFieldsAlpha.Params.stringify({
      page: 1,
      ppp: 100,
      ...params
    });

    let query = KarmaFieldsAlpha.Store.get("queries", driver, paramstring);
    const delta = KarmaFieldsAlpha.Store.State.get("deltaQueries", driver, paramstring);
    const diff = KarmaFieldsAlpha.Store.get("diffQueries", driver, paramstring);

    this.value = delta || diff || query;
    this.loading = !query;
    this.diff = Boolean(diff);
    this.warning = Boolean(delta && diff);

    if (!query) {

      let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.type === "query" && task.driver === driver && task.paramstring === paramstring);

      if (!task) {

        KarmaFieldsAlpha.Store.Tasks.add({
          name: `Loading Data`,
          type: "query",
          driver: driver,
          paramstring: paramstring,
          resolve: async task => {

            query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);

            if (query) {

              KarmaFieldsAlpha.Store.set(query, "queries", driver, paramstring);

              KarmaFieldsAlpha.Driver.verifyResults(driver, paramstring);

            } else {

              query = await KarmaFieldsAlpha.HTTP.get(`query/${driver}${paramstring ? `?${paramstring}` : ""}`);

              await KarmaFieldsAlpha.Database.Queries.set(query, "query", driver, paramstring);

            }

            if (query) {

              KarmaFieldsAlpha.Driver.parseResults(driver, query);

              KarmaFieldsAlpha.Store.set(query, "queries", driver, paramstring);

            }

          }

        });

      }

    }

  }

  // static getAlias(driver, key) {
  //
  //   return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "alias", key) || key;
  //
  // }
  //
  // static parseResults(results, driver) {
  //
  //   const idAlias = this.getAlias(driver, "id");
  //
  //   for (let item of results) {
  //
  //     const id = item[idAlias].toString();
  //
  //     for (let key in item) {
  //
  //       const value = KarmaFieldsAlpha.Type.toArray(item[key]);
  //
  //       KarmaFieldsAlpha.Store.set(value, "vars", driver, id, key);
  //
  //     }
  //
  //     KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, "query");
  //
  //     KarmaFieldsAlpha.Store.set([], "vars", driver, id, "trash");
  //
  //   }
  //
  // }
  //
  // static verifyResults(driver, paramstring) {
  //
  //   KarmaFieldsAlpha.Store.Tasks.add({
  //     name: `Verfifying Data`,
  //     type: "verify-query",
  //     priority: -1,
  //     resolve: async task => {
  //       const query = await KarmaFieldsAlpha.HTTP.get(`query/${driver}${paramstring ? `?${paramstring}` : ""}`);
  //       this.parseDiff(query, driver);
  //     }
  //   });
  //
  // }
  //
  // static parseDiff(results, driver) {
  //
  //   const idAlias = this.getAlias(driver, "id");
  //
  //   for (let item of results) {
  //
  //     const id = item[idAlias].toString();
  //
  //     for (let key in item) {
  //
  //       const localValue = KarmaFieldsAlpha.Store.get("vars", driver, id, key);
  //
  //       const remoteValue = KarmaFieldsAlpha.Type.toArray(item[key]);
  //
  //       if (!KarmaFieldsAlpha.DeepObject.compare(remoteValue, localValue)) {
  //
  //         KarmaFieldsAlpha.Store.set(remoteValue, "diffVars", driver, id, key);
  //
  //       } else {
  //
  //         KarmaFieldsAlpha.Store.remove("diffVars", driver, id, key);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   const localQuery = KarmaFieldsAlpha.Store.get("queries", driver, paramstring);
  //
  //   if (!localQuery || localQuery.length !== results.length || results.some((item, index) => item[idAlias] !== localQuery[index][idAlias])) {
  //
  //     const items = results.map(item => ({id: item.id}));
  //
  //     KarmaFieldsAlpha.Store.set(items, "diffQueries", driver, paramstring);
  //
  //   } else {
  //
  //     KarmaFieldsAlpha.Store.remove("diffQueries", driver, paramstring);
  //
  //   }
  //
  // }


  toIds() {

    const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "id");

    return this.toArray().map(item => item[idAlias]);

  }

  toItems() {

    const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "id");

    return this.toArray().map(item => ({id: item[idAlias]}));

  }



}




KarmaFieldsAlpha.Content.Value = class extends KarmaFieldsAlpha.Content {

  constructor(driver, id, key) {

    super();

    key = KarmaFieldsAlpha.Driver.getAlias(driver, key);

    const delta = KarmaFieldsAlpha.Store.State.get("delta", driver, id, key);
    const value = KarmaFieldsAlpha.Store.get("vars", driver, id, key);
    const diff = KarmaFieldsAlpha.Store.get("diffVars", driver, id, key);

    this.value = delta || diff || value;
    this.modified = delta && KarmaFieldsAlpha.DeepObject.differ(delta, value);
    this.diff = Boolean(diff);
    this.warning = Boolean(delta && diff);
    this.loading = !value;

    if (!value) { // -> create a task to fetch it

      const attempt = KarmaFieldsAlpha.Driver.getAttempt(driver, id);

      if (attempt) {

        let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.type === "vars" && task.driver === driver && task.attempt === attempt);

        if (!task) {

          if (attempt === "query") {

            task = {
              name: `Loading Content...`,
              type: "vars",
              driver: driver,
              ids: new Set(),
              attempt: attempt,
              resolve: async task => {

                const paramstring = `ids=${[...task.ids].join(",")}`;
                let query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);

                if (query) {

                  KarmaFieldsAlpha.Driver.verifyResults(driver, query);

                } else {

                  query = await KarmaFieldsAlpha.HTTP.get(`query/${driver}?${paramstring}`);

                  await KarmaFieldsAlpha.Database.Queries.set(query, "query", driver, paramstring);

                }

                if (query) {

                  KarmaFieldsAlpha.Driver.parseResults(driver, query);

                }

                for (let id of task.ids) {

                  KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, "query");
                  KarmaFieldsAlpha.Store.set([], "vars", driver, id, "trash");

                }

              }

            };

          } else {

            task = {
              name: `Loading Content...`,
              type: "vars",
              driver: driver,
              ids: new Set(),
              attempt: attempt,
              resolve: async task => {

                const ids = [...task.ids];
                const paramstring = `ids=${ids.join(",")}`;

                let relations = await KarmaFieldsAlpha.Database.Queries.get(attempt, driver, paramstring);

                if (relations) {

                  KarmaFieldsAlpha.Driver.verifyRelations(driver, ids, attempt);

                } else {

                  relations = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${attempt}?${paramstring}`);

                  await KarmaFieldsAlpha.Database.Queries.set(relations, attempt, driver, paramstring);

                }

                if (relations) {

                  KarmaFieldsAlpha.Driver.parseRelations(driver, relations, ids);

                }

                for (let id of task.ids) {

                  KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, attempt);

                }

              }

            }

          }

          KarmaFieldsAlpha.Store.Tasks.add(task);

        }

        task.ids.add(id);

      } else { // -> no value found

        // value = [];
        this.loading = false;
        this.notFound = true;

        KarmaFieldsAlpha.Store.set([], "vars", driver, id, key);

      }

    }

  }

  // createDataset(relations) {
  //
  //   const data = {};
  //
  //   for (let relation of relations) {
  //
  //     const id = relation.id.toString();
  //     const key = relation.key.toString();
  //
  //     if (!data[id]) {
  //
  //       data[id] = {};
  //
  //     }
  //
  //     if (!data[id][key]) {
  //
  //       data[id][key] = [];
  //
  //     }
  //
  //     data[id][key].push(relation.value);
  //
  //   }
  //
  //   return data;
  // }
  //
  // parseRelations(relations, driver, ids) {
  //
  //   const data = this.createDataset(relations); // first create a dataset to avoid same values being inserted multiple times
  //
  //   for (let id in data) {
  //
  //     for (let key in data[id]) {
  //
  //       KarmaFieldsAlpha.Store.set(data[id][key], "vars", driver, id, key);
  //
  //     }
  //
  //   }
  //
  //   for (let id of ids) {
  //
  //     KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, name);
  //
  //   }
  //
  // }
  //
  // verifyRelations(driver, ids, attempt) {
  //
  //   KarmaFieldsAlpha.Store.Tasks.add({
  //     name: `Loading Content...`,
  //     type: "verify-relations",
  //     priority: -1,
  //     resolve: task => {
  //
  //       const paramstring = `ids=${ids.join(",")}`;
  //       const remoteResults = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${attempt}?${paramstring}`);
  //
  //       if (remoteResults) {
  //
  //         this.parseRelationsDiff(remoteResults, driver);
  //
  //       }
  //
  //     }
  //
  //   });
  //
  // }
  //
  // parseRelationsDiff(relations, driver) {
  //
  //   const data = this.createDataset(relations);
  //
  //   for (let id in data) {
  //
  //     for (let key in data[id]) {
  //
  //       const localValue = KarmaFieldsAlpha.Store.get("vars", driver, id, key);
  //       const remoteValue = data[id][key];
  //
  //       if (!KarmaFieldsAlpha.DeepObject.compare(remoteValue, localValue)) {
  //
  //         KarmaFieldsAlpha.Store.set(remoteValue, "diffVars", driver, id, key);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }
  //
  // getRelations(driver) {
  //
  //   return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "relations");
  //
  // }
  //
  // getAttempt(driver, id) {
  //
  //   if (!KarmaFieldsAlpha.Store.get("attempts", driver, id, "query")) {
  //
  //     return "query";
  //
  //   }
  //
  //   const relations = this.getRelations(driver);
  //
  //   if (relations) {
  //
  //     for (let relation of relations) {
  //
  //       if (!KarmaFieldsAlpha.Store.get("attempts", driver, id, relation)) {
  //
  //         return relation;
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

}


KarmaFieldsAlpha.Content.Count = class extends KarmaFieldsAlpha.Content {

  constructor(driver, params) {

    super();

    const paramstring = KarmaFieldsAlpha.Params.stringify(params);

    let count = KarmaFieldsAlpha.Store.get("counts", driver, paramstring);

    this.value = count;

    if (count === undefined) {

      this.loading = true;

      // const tasks = KarmaFieldsAlpha.Store.get("tasks") || [];

      let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.type === "count" && task.driver === driver && task.paramstring === paramstring);

      if (!task) {

        KarmaFieldsAlpha.Store.Tasks.add({
          name: `Counting`,
          type: "count",
          driver: driver,
          paramstring: paramstring,
          // resolve: task => KarmaFieldsAlpha.Remote.count(task.driver, task.paramstring)
          resolve: async task => {
            let count = await KarmaFieldsAlpha.Database.Queries.get("count", driver, paramstring);
            if (count === undefined) {
              count = await KarmaFieldsAlpha.HTTP.get(`count/${driver}${paramstring ? `?${paramstring}` : ""}`);
              await KarmaFieldsAlpha.Database.Queries.set(count, "count", driver, paramstring);
            }
            KarmaFieldsAlpha.Store.set(count || 0, "counts", driver, paramstring);
          }
        });

        // KarmaFieldsAlpha.Store.set([...tasks, task], "tasks");

      }

    }

  }

}
