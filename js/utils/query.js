
KarmaFieldsAlpha.Query = class { // class Driver ?

//   static getAlias(driver, key) {
// console.error("deprecated");
//     return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "alias", key) || key;
//
//   }
//
//   static getRelations(driver) {
// console.error("deprecated");
//     return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "relations");
//
//   }
//
//   static getAttempt(driver, id) {
// console.error("deprecated");
//     if (!KarmaFieldsAlpha.Store.get("attempts", driver, id, "query")) {
//
//       return "query";
//
//     }
//
//     const relations = this.getRelations(driver);
//
//     if (relations) {
//
//       for (let relation of relations) {
//
//         if (!KarmaFieldsAlpha.Store.get("attempts", driver, id, relation)) {
//
//           return relation;
//
//         }
//
//       }
//
//     }
//
//   }
//
//
//   static getValue(driver, id, key) {
// console.error("deprecated");
//     key = this.getAlias(driver, key);
//
//     // let value = KarmaFieldsAlpha.Store.State.get("delta", driver, id, key);
//     //
//     // if (!value) {
//     //
//     //   value = KarmaFieldsAlpha.Store.get("vars", driver, id, key);
//     //
//     // }
//
//     let delta = KarmaFieldsAlpha.Store.State.get("delta", driver, id, key);
//     let value = KarmaFieldsAlpha.Store.get("vars", driver, id, key);
//
//     const content = new KarmaFieldsAlpha.Content.Request(delta || value);
//
//     content.modified = delta && KarmaFieldsAlpha.DeepObject.differ(delta, value);
//
//     if (content.loading) { // -> create a task to fetch it
//
//       const attempt = this.getAttempt(driver, id);
//
//       if (attempt) {
//
//         const tasks = KarmaFieldsAlpha.Store.get("tasks") || [];
//
//         let task = tasks.find(task => task.type === "vars" && task.driver === driver && task.attempt === attempt);
//
//         if (!task) {
//
//           task = {
//             name: `Loading Content...`,
//             type: "vars",
//             driver: driver,
//             ids: new Set(),
//             attempt: attempt,
//             resolve: task => {
//
//               if (attempt === "query") {
//
//                  return KarmaFieldsAlpha.Remote.queryIds(task.driver, [...task.ids]);
//
//               } else {
//
//     						return KarmaFieldsAlpha.Remote.queryRelations(task.driver, [...task.ids], task.attempt);
//
//               }
//             }
//           };
//
//           // tasks.push(task); // -> tasks is mutable BUT wont work if empty
//
//           KarmaFieldsAlpha.Store.set([...tasks, task], "tasks");
//
//         }
//
//         task.ids.add(id);
//
//       } else { // -> no value found
//
//         // value = [];
//         content.loading = false;
//         content.notFound = true;
//
//         KarmaFieldsAlpha.Store.set("vars", [], driver, id, key);
//
//       }
//
//     }
//
//     // return value; // return array | undefined (not ready)
//     return content;
//
//   }

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





//   static getResults(driver, params) {
// console.error("deprecated");
//     const paramstring = KarmaFieldsAlpha.Params.stringify({
//       page: 1,
//       ppp: 100,
//       ...params
//     });
//
//     let query = KarmaFieldsAlpha.Store.get("queries", driver, paramstring);
//
//     if (!query) {
//
//       const tasks = KarmaFieldsAlpha.Store.get("tasks") || [];
//
//       let task = tasks.find(task => task.type === "query" && task.driver === driver && task.paramstring === paramstring);
//
//       if (!task) {
//
//         task = {
//           name: `Loading Data`,
//           type: "query",
//           driver: driver,
//           paramstring: paramstring,
//           resolve: task => KarmaFieldsAlpha.Remote.query(task.driver, task.paramstring)
//         };
//
//         KarmaFieldsAlpha.Store.set([...tasks, task], "tasks");
//
//       }
//
//     }
//
//     // return query;
//
//     return new KarmaFieldsAlpha.Content.Request(query);
//   }
//
//   static getIds(driver, params) {
// console.error("deprecated");
//     let results = this.getResults(driver, params);
//
//     if (!results.loading) {
//
//       const idAlias = this.getAlias(driver, "id");
//
//       results.value = results.value.map(item => item[idAlias]);
//
//     }
//
//     return results;
//   }
//
//   static getCount(driver, params) {
// console.error("deprecated");
//     const paramstring = KarmaFieldsAlpha.Params.stringify(params);
//
//     let count = KarmaFieldsAlpha.Store.get("counts", driver, paramstring);
//
//     if (count === undefined) {
//
//       const tasks = KarmaFieldsAlpha.Store.get("tasks") || [];
//
//       let task = tasks.find(task => task.type === "count" && task.driver === driver && task.paramstring === paramstring);
//
//       if (!task) {
//
//         task = {
//           name: `Counting`,
//           type: "count",
//           driver: driver,
//           paramstring: paramstring,
//           resolve: task => KarmaFieldsAlpha.Remote.count(task.driver, task.paramstring)
//         };
//
//         KarmaFieldsAlpha.Store.set([...tasks, task], "tasks");
//
//       }
//
//     }
//
//     // return count;
//     return new KarmaFieldsAlpha.Content.Request(count);
//   }

  // static update(data, driver, id) {
  //
  //   const tasks = KarmaFieldsAlpha.Store.get("tasks") || [];
  //
  //   let task = tasks.find(task => task.type === "update" && task.driver === driver && task.id === id);
  //
  //   if (!task) {
  //
  //     tasks.push({
  //       name: "Saving...",
  //       type: "update",
  //       driver: driver,
  //       id: id,
  //       resolve: task => KarmaFieldsAlpha.Remote.update(data, task.driver, task.id)
  //     });
  //
  //     KarmaFieldsAlpha.Store.set([...tasks, task], "tasks");
  //
  //   }
  //
  // }

  static sync() {

    console.error("deprecated");

    const tasks = KarmaFieldsAlpha.Store.get("tasks") || [];

    let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.type === "sync");

    if (!task) {

      KarmaFieldsAlpha.Store.Tasks.add({
        name: "Saving...",
        type: "sync",
        resolve: async task => {

          const delta = KarmaFieldsAlpha.Store.State.get("delta", "vars");

          if (delta) {

      			KarmaFieldsAlpha.Store.Buffer.remove("state", "delta"); // don't update history!

            for (let driver in delta) {

              // KarmaFieldsAlpha.Store.Buffer.remove("state", "items", driver);
              KarmaFieldsAlpha.Store.remove("diff", driver);

              await KarmaFieldsAlpha.Database.Queries.remove(driver);

              for (let id in delta[driver]) {

      					// const data = Object.fromEntries(Object.entries(delta[driver][id]).map(([key, value]) => [KarmaFieldsAlpha.Query.getAlias(driver, key), value]));

      					// await this.update(delta[driver][id], driver, id);

                const data = delta[driver][id];

                KarmaFieldsAlpha.Store.assign(data, "vars", driver, id);

                await KarmaFieldsAlpha.Database.Vars.set(data, driver, id);

                // for (let key in data) {
                //
                //   KarmaFieldsAlpha.Store.set(true, "verifiedVars", driver, id, key);
                //
                // }

            		await KarmaFieldsAlpha.HTTP.post(`update/${driver}/${id}`, data);

              }

              KarmaFieldsAlpha.Store.remove("items", driver);
              KarmaFieldsAlpha.Store.remove("counts", driver);

            }

          }

        }
      });

    }

  }

  // static add(driver, params = null, index = 0, length = 1, ...path) {
  //
  //   const tasks = KarmaFieldsAlpha.Store.get("tasks") || [];
  //
  //   let task = tasks.find(task => task.type === "add" && task.driver === driver);
  //
  //   if (task) {
  //
  //     task.length += length;
  //
  //   } else {
  //
  //     task = {
  //       name: `Inserting...`,
  //       type: "add",
  //       driver: driver,
  //       params: params,
  //       index: index,
  //       // layer: layer,
  //       path: path,
  //       length: length,
  //       resolve: task => KarmaFieldsAlpha.Remote.add(task.driver, task.params, task.index, task.length, ...task.path)
  //     };
  //
  //     KarmaFieldsAlpha.Store.set([...tasks, task], "tasks");
  //
  //   }
  //
  //   const items = KarmaFieldsAlpha.Store.Layer.getItems() || [];
  //   const newItems = [...items];
  //
  //   for (let i = 0; i < length; i++) {
  //
  //     KarmaFieldsAlpha.DeepArray.splice(newItems, 0, [{loading: true}], index, ...path);
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.Layer.setItems(newItems);
  //
  //   KarmaFieldsAlpha.Store.remove("queries", driver);
  //   KarmaFieldsAlpha.Store.remove("counts", driver);
  //
  // }
  //
  // static upload(driver, files, params, index = 0) {
  //
  //   const tasks = KarmaFieldsAlpha.Store.get("tasks") || [];
  //
	// 	const layer = KarmaFieldsAlpha.Store.State.get("layerIndex");
  //
  //   const currentItems = KarmaFieldsAlpha.Store.Layer.get("items");
  //   const newItems = [...currentItems];
  //
  //   const loadingItems = [...files].map(file => ({loading: true}));
  //
  //   newItems.splice(index, 0,loadingItems);
  //
  //   for (let i = 0; i < files.length; i++) {
  //
  //     const task = {
  //       name: `Uploading File...`,
  //       type: "upload",
  //       driver: driver,
  //       file: files[i],
  //       layer: layer,
  //       params: {...params},
  //       index: index + i,
  //       resolve: task => KarmaFieldsAlpha.remote.upload(task.file, task.index, task.params, task.layer)
  //     }
  //
  //     tasks.push(task);
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.set(tasks, "tasks");
  //
  //   KarmaFieldsAlpha.Store.Layer.set(newItems, "items");
  //
  //   KarmaFieldsAlpha.Store.remove("queries", driver);
  //   KarmaFieldsAlpha.Store.remove("counts", driver);
  //
  // }


  static init() {
console.error("deprecated");
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

  // static createQueryDataset(results, driver) {
  //
  //   const data = {};
  //
  //   const idAlias = this.getAlias(driver, "id");
  //
  //   for (let item of results) {
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
  //   }
  //
  //   return data;
  // }



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
  //     // KarmaFieldsAlpha.Store.set([], "vars", driver, id, "trash");
  //
  //   }
  //
  // }

  // static createQuery(results, driver) {
  //
  //   const idAlias = this.getAlias(driver, "id");
  //   const nameAlias = this.getAlias(driver, "name");
  //
  //   return results.map(item => ({id: item[idAlias], name: item[nameAlias]}));
  //
  // }


  // static async getItems(driver, paramstring) {
  //
  //   let items = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);
  //
  //   if (items) {
  //
  //     this.verify(driver, paramstring);
  //
  //   } else {
  //
  //     const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}${paramstring ? `?${paramstring}` : ""}`);
  //
  //     items = this.createQuery(results, driver);
  //
  //     await KarmaFieldsAlpha.Database.Queries.set(items, "query", driver, paramstring);
  //
  //     const dataset = this.createQueryDataset(results, driver);
  //
  //     await KarmaFieldsAlpha.Database.Vars.set(dataset, driver);
  //
  //     for (let id in dataset) {
  //
  //       for (let key in dataset[id]) {
  //
  //         KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", driver, id, key);
  //
  //       }
  //
  //       KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, "query");
  //
  //     }
  //
  //   }
  //
  //   return items;
  // }

  // static async cacheQuery(results, driver, paramstring) {
  //
  //   const idAlias = this.getAlias(driver, "id");
  //   const nameAlias = this.getAlias(driver, "name");
  //
  //   const items = results.map(item => ({id: item[idAlias], name: item[nameAlias]}));
  //
  //   await KarmaFieldsAlpha.Database.Queries.set(items, "query", driver, paramstring);
  //
  //   const data = {};
  //
  //   for (let item of results) {
  //
  //     data[idAlias] = {};
  //
  //     for (let key in item) {
  //
  //       data[idAlias][key] = [item[key]];
  //
  //     }
  //
  //   }
  //
  //   await KarmaFieldsAlpha.Database.Vars.set(data, driver);
  //
  // }
  //
  // static parseResults(driver, results, paramstring) {
  //
  //   const idAlias = this.getAlias(driver, "id");
  //   const nameAlias = this.getAlias(driver, "name");
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
  //       // console.log("parseResults", value, "vars", driver, id, key);
  //
  //     }
  //
  //     // KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, "query");
  //
  //     KarmaFieldsAlpha.Store.set([], "vars", driver, id, "trash");
  //
  //   }
  //
  //
  //   const items = results.map(item => ({id: item[idAlias], name: item[nameAlias]}));
  //
  //   KarmaFieldsAlpha.Store.set(items, "items", driver, paramstring);
  //
  //   return items;
  //
  // }

  // static verifyResults(driver, paramstring) {
  //
  //   KarmaFieldsAlpha.Store.Verifications.add({
  //     name: `Verfifying Data`,
  //     type: "verify-query",
  //     priority: -1,
  //     resolve: async task => {
  //
  //       // const idAlias = this.getAlias(driver, "id");
  //       // const nameAlias = this.getAlias(driver, "name");
  //
  //       const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}${paramstring ? `?${paramstring}` : ""}`);
  //
  //       const items = this.createQuery(results, driver);
  //
  //       const query = KarmaFieldsAlpha.Store.get("items", driver, paramstring);
  //
  //       // const items = results.map(item => ({id: item[idAlias], name: item[nameAlias]}));
  //
  //       if (!query || query.length !== items.length || query.some((item, index) => item.id !== items[index].id)) {
  //
  //         KarmaFieldsAlpha.Store.set(items, "items", driver, paramstring);
  //         KarmaFieldsAlpha.Store.set(true, "diff", "items", driver, paramstring);
  //
  //         await KarmaFieldsAlpha.Database.Queries.set(items, "query", driver, paramstring);
  //
  //       } else {
  //
  //         // KarmaFieldsAlpha.Store.remove("diff", "items", driver, paramstring);
  //
  //       }
  //
  //       // const dataset = this.createQueryDataset(results, driver);
  //       //
  //       // for (let id in dataset) {
  //       //
  //       //   for (let key in dataset[id]) {
  //       //
  //       //     const localValue = KarmaFieldsAlpha.Store.get("var", driver, id, key);
  //       //     const remoteValue = dataset[id][key];
  //       //
  //       //     if (!KarmaFieldsAlpha.DeepObject.compare(remoteValue, localValue)) {
  //       //
  //       //       KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", driver, id, key);
  //       //       KarmaFieldsAlpha.Store.set(true, "diff", "vars", driver, id, key);
  //       //
  //       //       await KarmaFieldsAlpha.Database.Vars.set(dataset[id][key], driver, id, key);
  //       //
  //       //     }
  //       //
  //       //     KarmaFieldsAlpha.Store.set(true, "verifiedVars", driver, id, key);
  //       //
  //       //   }
  //       //
  //       // }
  //       //
  //       // for (let item of items) {
  //       //
  //       //   KarmaFieldsAlpha.Store.set(true, "attempts", driver, item.id, "query");
  //       //
  //       // }
  //
  //     }
  //   });
  //
  // }


  // static async testQueries(driver, paramstrings, ids) {
  //
  //   let fail = false;
  //
  //   for (let paramstring of paramstrings) {
  //
  //     const localQuery = KarmaFieldsAlpha.Store.get("items", driver, paramstring);
  //
  //     if (localQuery) {
  //
  //       const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}${paramstring ? `?${paramstring}` : ""}`);
  //
  //       const remoteQuery = this.createQuery(results, driver);
  //
  //       if (localQuery.length !== remoteQuery.length || localQuery.some((item, index) => item.id !== remoteQuery[index].id)) {
  //
  //         KarmaFieldsAlpha.Store.set(remoteQuery, "items", driver, paramstring);
  //         KarmaFieldsAlpha.Store.set(true, "diff", "items", driver, paramstring);
  //
  //         await KarmaFieldsAlpha.Database.Queries.set(remoteQuery, "query", driver, paramstring);
  //
  //         fail = true;
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   if (ids.length) {
  //
  //     const relations = this.getRelations(driver);
  //     const idsParamstring = `ids=${ids.join(",")}`;
  //
  //     const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}?${idsParamstring}`);
  //
  //     const dataset = KarmaFieldsAlpha.Driver.createQueryDataset(results, driver);
  //     const delta = {};
  //
  //     for (let id in dataset) {
  //
  //       for (let key in dataset[id]) {
  //
  //         const localValue = KarmaFieldsAlpha.Store.get("vars", driver, id, key);
  //         const remoteValue = dataset[id][key];
  //
  //         if (localValue && !KarmaFieldsAlpha.DeepObject.compare(remoteValue, localValue)) {
  //
  //           KarmaFieldsAlpha.Store.set(remoteValue, "vars", driver, id, key);
  //           KarmaFieldsAlpha.Store.set(true, "diff", "vars", driver, id, key);
  //
  //           // await KarmaFieldsAlpha.Database.Vars.set(dataset[id][key], driver, id, key);
  //           KarmaFieldsAlpha.DeepObject.set(delta, remoteValue, id, key);
  //
  //           fail = true;
  //
  //         }
  //
  //       }
  //
  //     }
  //
  //     if (Object.keys(delta).length) {
  //
  //       await KarmaFieldsAlpha.Database.Vars.set(delta, driver);
  //
  //     }
  //
  //     for (let attempt of relations) {
  //
  //       const relations = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${attempt}?${idsParamstring}`);
  //
  //       const dataset = KarmaFieldsAlpha.Driver.createRelationDataset(relations);
  //       const delta = {};
  //
  //       for (let id in dataset) {
  //
  //         for (let key in dataset[id]) {
  //
  //           const remoteValue = dataset[id][key];
  //           const localValue = KarmaFieldsAlpha.Store.get("vars", driver, id, key);
  //
  //           if (localValue && !KarmaFieldsAlpha.DeepObject.compare(remoteValue, localValue)) {
  //
  //             KarmaFieldsAlpha.Store.set(remoteValue, "vars", driver, id, key);
  //             KarmaFieldsAlpha.Store.set(true, "diff", "vars", driver, id, key);
  //
  //             KarmaFieldsAlpha.DeepObject.set(delta, remoteValue, id, key);
  //
  //             fail = true;
  //
  //           }
  //
  //           // if (localValue) {
  //           //
  //           //
  //           //
  //           // } else {
  //           //
  //           //   KarmaFieldsAlpha.DeepObject.set(delta, dataset[id][key], id, key);
  //           //
  //           // }
  //
  //
  //
  //         }
  //
  //       }
  //
  //       if (Object.keys(delta).length) {
  //
  //         await KarmaFieldsAlpha.Database.Vars.set(delta, driver);
  //
  //       }
  //
  //     }
  //
  //     if (fail) {
  //
  //       if (!KarmaFieldsAlpha.Store.Tasks.has()) {
  //
  //         KarmaFieldsAlpha.Store.Tasks.add({
  //           type: "rerender",
  //           resolve: () => {
  //           }
  //         });
  //
  //       }
  //
  //       KarmaFieldsAlpha.saucer.render();
  //
  //     }
  //
  //   }
  //
  // }
  //
  //
  // static verify(driver, paramstring, id) {
  //
  //   // const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}${paramstring ? `?${paramstring}` : ""}`);
  //
  //   let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.type === "verify" && task.driver === driver);
  //
  //   if (!task) {
  //
  //     task = {
  //       type: "verify",
  //       paramstrings: new Set(),
  //       ids: new Set(),
  //       keys: new Set(),
  //       driver: driver,
  //       priority: -1,
  //       resolve: task => {
  //         this.testQueries(driver, [...task.paramstrings], [...task.ids])
  //       }
  //     };
  //
  //     KarmaFieldsAlpha.Store.Tasks.add(task);
  //   }
  //
  //   if (paramstring) {
  //
  //     task.paramstrings.add(paramstring);
  //
  //   }
  //
  //   if (id) {
  //
  //     task.ids.add(id);
  //
  //   }
  //
  // }

  // static parseDiff(driver, results, paramstring) {
  //
  //   const idAlias = this.getAlias(driver, "id");
  //   const nameAlias = this.getAlias(driver, "name");
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
  //   const items = results.map(item => ({id: item[idAlias], name: item[nameAlias]}));
  //
  //   const localItems = KarmaFieldsAlpha.Store.get("items", driver, paramstring);
  //
  //   if (!localItems || localItems.length !== items.length || items.some((item, index) => item[idAlias] !== localItems[index][idAlias])) {
  //
  //     // const items = results.map(item => ({id: item.id}));
  //
  //     KarmaFieldsAlpha.Store.set(items, "diffItems", driver, paramstring);
  //
  //   } else {
  //
  //     KarmaFieldsAlpha.Store.remove("diffItems", driver, paramstring);
  //
  //   }
  //
  // }

  // static createRelationDataset(relations) {
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

  // static parseRelations(driver, relations, ids) {
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
  //   // for (let id of ids) {
  //   //
  //   //   KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, name);
  //   //
  //   // }
  //
  // }
  //
  // static verifyRelations(driver, ids, attempt) {
  //
  //   KarmaFieldsAlpha.Store.Tasks.add({
  //     name: `Loading Content...`,
  //     type: "verify-relations",
  //     priority: -1,
  //     resolve: async task => {
  //
  //       const paramstring = `ids=${ids.join(",")}`;
  //       const remoteResults = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${attempt}?${paramstring}`);
  //
  //       if (remoteResults) {
  //
  //         this.parseRelationsDiff(driver, remoteResults);
  //
  //       }
  //
  //     }
  //
  //   });
  //
  // }
  //
  // static parseRelationsDiff(driver, relations) {
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

  static getRelations(driver) {

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "relations");

  }

  // static getAttempt(driver, id) {
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

  static getAttempt(driver, id, ...path) {
console.error("deprecated");
    const relations = ["query", ...this.getRelations(driver)];

    for (let relation of relations) {

      if (!KarmaFieldsAlpha.Store.get("attempts", ...path, driver, id, relation)) {

        return relation;

      }

    }

  }



  // static async updateParams(params) {
  //
  //   console.error("deprecated");
  //
  //   const entries = Object.entries(params).filter(([key, value]) => value).map(([key, value]) => [this.getAlias(driver, key), params[key].split(",")]);
  //
  //   if (entries.length) {
  //
  //     const data = Object.fromEntries(entries);
  //
  //     // await KarmaFieldsAlpha.Remote.update(data, driver, id);
  //
  //     KarmaFieldsAlpha.Store.assign(data, "vars", driver, id);
  //
  // 		await KarmaFieldsAlpha.HTTP.post(`update/${driver}/${id}`, data);
  //
  //     KarmaFieldsAlpha.Store.Delta.set(data, driver, id);
  //
  //   }
  //
  // }

  // static async saveData(data, driver) {
  //
  //   await KarmaFieldsAlpha.HTTP.post(`sync/${driver}`, data);
  //
  //   for (let row of data) {
  //
  //     for (let key in row) {
  //
  //       KarmaFieldsAlpha.Store.set(row[key], "vars", driver, row.id, key);
  //
  //     }
  //
  //   }
  //
  // }

  // static async save(driver, paramstring, index = 0, length = 999999) {
  //
  //   const deltaItems = KarmaFieldsAlpha.Store.Delta.get("items", driver, paramstring);
  //
  //   const data = deltaItems.slice(index, index + length);
  //
  //   // await KarmaFieldsAlpha.HTTP.post(`sync/${driver}`, data);
  //
  //   for (let row of data) {
  //
  //     for (let key in row) {
  //
  //       KarmaFieldsAlpha.Store.set(row[key], "vars", driver, row.id, key);
  //
  //     }
  //
  //   }
  //
  //   await KarmaFieldsAlpha.Database.Queries.remove("query", driver, paramstring);
  //   await KarmaFieldsAlpha.Database.Queries.remove("count", driver, paramstring);
  //
  // }
  //
  // static async saveAll() {
  //
  //   // const delta = KarmaFieldsAlpha.Store.Delta.get("items");
  //   //
  //   // if (delta) {
  //   //
  //   //   for (let driver in delta) {
  //   //
  //   //     for (let paramstring in delta[driver]) {
  //   //
  //   //       await this.save(driver, paramstring);
  //   //
  //   //     }
  //   //
  //   //   }
  //   //
  //   //   KarmaFieldsAlpha.Store.Delta.remove("items");
  //   //
  //   // }
  //   //
  //   // KarmaFieldsAlpha.Store.remove("items");
  //
  // }

  // static remove(driver, paramstring, index = 0, length = 999999) {
  //
  //   // const items = KarmaFieldsAlpha.Store.Delta.get("items", driver, paramstring) || [];
  //   // const clones = [...items];
  //   //
  //   // const data = clones.splice(index, length).filter(row => row.id).map(row => ({...row, trash: ["1"]}));
  //   //
  //   // KarmaFieldsAlpha.Store.Delta.set(clones, "items", driver, paramstring);
  //   //
  //   // await KarmaFieldsAlpha.HTTP.post(`sync/${driver}`, data);
  //   //
  //   // await KarmaFieldsAlpha.Database.Queries.remove("query", driver, paramstring);
  //   // await KarmaFieldsAlpha.Database.Queries.remove("count", driver, paramstring);
  //
  //   const clones = [...query.toArray()];
  //
  //   const data = clones.splice(index, length); //.map(row => ({id: row.id, trash: ["1"]}));
  //
  //   KarmaFieldsAlpha.Store.Delta.set(clones, "items", query.driver, query.paramstring);
  //
  //   const deletedIds = KarmaFieldsAlpha.Store.Delta.get("trash", query.driver) || [];
  //
  //   deletedIds = [...deletedIds, data.filter(item => item.id).map(item => item.id)];
  //
  //   KarmaFieldsAlpha.Store.Delta.set(deletedIds, "trash", query.driver);
  //
  // }

  static delta() {

    const delta = KarmaFieldsAlpha.Store.Delta.get("items");

    if (delta) {

      for (let driver in delta) {

        for (let paramstring in delta[driver]) {

          for (let item of delta[driver][paramstring]) {

            if (item.id) {

              if (item.delta) {

                for (let key in item) {

                  const remote = KarmaFieldsAlpha.Store.get("vars", "remote", driver, item.id, key);

                  if (!KarmaFieldsAlpha.DeepObject.equal(item.delta[key], remote)) {

                    return true;

                  }

                }

              }

            } else {

              return true;

            }

          }

        }

      }

    }

    const trash = KarmaFieldsAlpha.Store.Delta.get("trash");

    if (trash) {

      for (let driver in trash) {

        if (trash[driver] && trash[driver].length) {

          return true;

        }

      }

    }

    return false;
  }

  // static async fetchQuery(driver, paramstring) {
  //
  //   const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}${paramstring ? `?${paramstring}` : ""}`);
  //
  //   const items = this.createQuery(results, driver);
  //
  //   await KarmaFieldsAlpha.Database.Queries.set(items, "query", driver, paramstring);
  //
  //   const dataset = this.createQueryDataset(results, driver);
  //
  //   await KarmaFieldsAlpha.Database.Vars.set(dataset, driver);
  //
  //   for (let id in dataset) {
  //
  //     for (let key in dataset[id]) {
  //
  //       KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", driver, id, key);
  //
  //     }
  //
  //     KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, "query");
  //
  //   }
  //
  //   return items;
  // }

  // static async writeData(driver, dataset, ...path) {
  //
  //   for (let id in dataset) {
  //
  //     for (let key in dataset[id]) {
  //
  //       KarmaFieldsAlpha.Store.set(dataset[id][key], ...path, "vars", driver, id, key);
  //
  //     }
  //
  //   }
  //
  // }


  static getQuery(driver, paramstring, keys = []) {

    const query = new KarmaFieldsAlpha.Content();

    query.driver = driver;
    query.paramstring = paramstring;

    query.value = KarmaFieldsAlpha.Store.get("items", "remote", driver, paramstring);

    if (!query.value) {

      let task = KarmaFieldsAlpha.Task.QueryItems.find(driver, paramstring);

      if (!task) {

        task = KarmaFieldsAlpha.Task.QueryItems.create(driver, paramstring);

      }

      if (KarmaFieldsAlpha.Store.get("items", "notFound", "cache", driver, paramstring)) {

        query.loading = true;

      } else {

        query.value = KarmaFieldsAlpha.Store.get("items", "cache", driver, paramstring);

        if (query.value) {

          query.cache = true;

        } else {

          let task = KarmaFieldsAlpha.Task.QueryItemsCache.find(driver, paramstring);

          if (!task) {

             task = KarmaFieldsAlpha.Task.QueryItemsCache.create(driver, paramstring);

          }

          query.loading = true;

        }

      }

    }

    return query;
  }

  // static getValue(driver, id, key) {
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //
  //   key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
  //
  //   content.value = KarmaFieldsAlpha.Store.get("vars", "remote", driver, id, key);
  //
  //   if (!content.value) { // -> create a task to fetch it
  //
  //     const attempt = KarmaFieldsAlpha.Driver.getAttempt(driver, id, "remote");
  //
  //     if (attempt) {
  //
  //       // let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.type === "vars" && task.driver === driver && task.attempt === attempt);
  //       let task = KarmaFieldsAlpha.Task.find(task => task.type === "remote-query" && task.driver === driver && task.attempt === attempt);
  //
  //       if (!task) {
  //
  //         task = new KarmaFieldsAlpha.Task.QueryRemoteValue(driver, attempt);
  //
  //         KarmaFieldsAlpha.Store.Tasks.add(task);
  //
  //       }
  //
  //       // if (attempt !== "query") {
  //
  //         task.ids.add(id);
  //
  //       // }
  //
  //     } else { // -> not found
  //
  //       query.notFound = true;
  //
  //       KarmaFieldsAlpha.Store.set([], "vars", "remote", driver, id, key);
  //
  //     }
  //
  //     content.value = KarmaFieldsAlpha.Store.get("vars", "cache", driver, id, key);
  //
  //     if (content.value) {
  //
  //       content.cache = true;
  //
  //     } else {
  //
  //       const attempt = KarmaFieldsAlpha.Driver.getAttempt(driver, id, "cache");
  //
  //       if (attempt) {
  //
  //         let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.type === "cache-query" && task.driver === driver && task.attempt === attempt);
  //
  //         if (!task) {
  //
  //           task = new KarmaFieldsAlpha.Task.QueryCacheValue(driver, attempt);
  //
  //           KarmaFieldsAlpha.Store.Tasks.add(task);
  //
  //         }
  //
  //         // if (attempt !== "query") {
  //
  //           task.ids.add(id);
  //
  //         // }
  //
  //       } else { // no more attempts -> not found
  //
  //         KarmaFieldsAlpha.Store.set([], "vars", "cache", driver, id, key);
  //
  //       }
  //
  //       content.loading = true;
  //
  //     }
  //
  //
  //   }
  //
  //   return content;
  //
  // }


  static getValue(driver, id, key) {

    const content = new KarmaFieldsAlpha.Content();

    key = KarmaFieldsAlpha.Driver.getAlias(driver, key);

    content.value = KarmaFieldsAlpha.Store.get("vars", "remote", driver, id, key);

    if (!content.value) { // -> create a task to fetch it

      if (KarmaFieldsAlpha.Store.get("vars", "notFound", "remote", driver, id, key)) {

        content.notFound = true;

      } else {

        let task = KarmaFieldsAlpha.Task.QueryValue.find(driver);

        if (!task) {

          task = KarmaFieldsAlpha.Task.QueryValue.create(driver);

        }

        task.ids.add(id);
        task.keys.add(key);

        content.value = KarmaFieldsAlpha.Store.get("vars", "cache", driver, id, key);

        if (content.value) {

          content.cache = true;

        } else {

          if (!KarmaFieldsAlpha.Store.get("vars", "notFound", "cache", driver, id, key)) {

            let task = KarmaFieldsAlpha.Task.QueryValueCache.find(driver);

            if (!task) {

              task = KarmaFieldsAlpha.Task.QueryValueCache.create(driver);

            }

            task.ids.add(id);
            task.keys.add(key);

          }

          content.loading = true;

        }

      }

    }

    return content;

  }


}




KarmaFieldsAlpha.Content.Query = class extends KarmaFieldsAlpha.Content {

  // compat (still used e.g. by dropdown)
  constructor(driver, params) {

    super();

    this.driver = driver;
    this.params = params;

    const paramstring = KarmaFieldsAlpha.Params.stringify(params);
    const collection = new KarmaFieldsAlpha.Model.Collection(driver, paramstring);
    const query = collection.queryItems();

    this.value = query.value;
    this.loading = query.loading;

    // const items = KarmaFieldsAlpha.Store.Delta.get("items", driver, paramstring);
    //
    // if (items) {
    //
    //   this.value = items;
    //
    // } else {
    //
    //   const query = KarmaFieldsAlpha.Driver.getQuery(driver, paramstring);
    //
    //   if (query.loading) {
    //
    //     this.loading = true;
    //
    //   } else {
    //
    //     this.value = content.value;
    //
    //   }
    //
    // }

  }

  // constructor(driver, params) {
  //
  //   super();
  //
  //   this.driver = driver;
  //   this.params = params;
  //
  //   // const paramstring = KarmaFieldsAlpha.Params.stringify({
  //   //   page: 1,
  //   //   ppp: 100,
  //   //   ...params
  //   // });
  //
  //   const paramstring = KarmaFieldsAlpha.Params.stringify(params);
  //
  //   this.paramstring = paramstring;
  //
  //   let query = KarmaFieldsAlpha.Store.get("items", driver, paramstring);
  //   const delta = KarmaFieldsAlpha.Store.Delta.get("items", driver, paramstring);
  //   // const diff = KarmaFieldsAlpha.Store.get("diffItems", driver, paramstring);
  //
  //   this.value = delta || query;
  //   this.loading = !this.value;
  //   this.diff = KarmaFieldsAlpha.Store.get("diff", "items", driver, paramstring);
  //   this.warning = Boolean(delta && this.diff);
  //
  //   if (!this.value) {
  //
  //     let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.type === "query" && task.driver === driver && task.paramstring === paramstring);
  //
  //     if (!task) {
  //
  //       KarmaFieldsAlpha.Store.Tasks.add({
  //         name: `Loading Data`,
  //         type: "query",
  //         driver: driver,
  //         paramstring: paramstring,
  //         resolve: async task => {
  //
  //           query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);
  //
  //           if (query) {
  //
  //             // KarmaFieldsAlpha.Driver.verifyResults(driver, paramstring);
  //             KarmaFieldsAlpha.Driver.verify(driver, paramstring);
  //
  //             // KarmaFieldsAlpha.Store.set(query, "items", driver, paramstring);
  //
  //             // KarmaFieldsAlpha.Driver.parseQuery(query, driver, paramstring);
  //
  //           } else {
  //
  //             const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}${paramstring ? `?${paramstring}` : ""}`);
  //
  //             // await KarmaFieldsAlpha.Database.Queries.set(query, "query", driver, paramstring);
  //
  //             // const data = KarmaFieldsAlpha.Driver.createQueryDataset(query);
  //             //
  //             // await KarmaFieldsAlpha.Database.Vars.set(data, driver);
  //
  //             // KarmaFieldsAlpha.Driver.parseResults(driver, results);
  //
  //
  //             query = KarmaFieldsAlpha.Driver.createQuery(results, driver);
  //
  //             // KarmaFieldsAlpha.Store.set(query, "items", driver, paramstring);
  //
  //             // query = KarmaFieldsAlpha.Driver.parseResults(driver, results, paramstring);
  //
  //             await KarmaFieldsAlpha.Database.Queries.set(query, "query", driver, paramstring);
  //
  //             const dataset = KarmaFieldsAlpha.Driver.createQueryDataset(results, driver);
  //
  //             await KarmaFieldsAlpha.Database.Vars.set(dataset, driver);
  //
  //             for (let id in dataset) {
  //
  //               for (let key in dataset[id]) {
  //
  //                 KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", driver, id, key);
  //                 KarmaFieldsAlpha.Store.set(true, "verifiedVars", driver, id, key);
  //
  //               }
  //
  //               KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, "query");
  //
  //             }
  //
  //           }
  //
  //           KarmaFieldsAlpha.Store.set(query, "items", driver, paramstring);
  //
  //         }
  //
  //       });
  //
  //     }
  //
  //   }
  //
  // }

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


    return this.toArray().map(item => item.id);

  }

  toItems() {

    return this.toArray();

  }

  async change(items) {

    if (!this.loading) {

      let length = this.values.length;

      KarmaFieldsAlpha.Store.Delta.set(items, "items", this.driver, this.paramstring);

      // KarmaFieldsAlpha.Store.remove("counts", this.driver);

      // await KarmaFieldsAlpha.Database.Queries.remove(this.driver); // -> actually just need to remove count...
      //
      // await KarmaFieldsAlpha.Database.Queries.set(items, "query", this.driver, this.paramstring);

      // KarmaFieldsAlpha.Store.Delta.set(length, "count", this.driver, this.paramstring);

    }



    // KarmaFieldsAlpha.Store.remove("items", query.driver);
    // KarmaFieldsAlpha.Store.remove("counts", query.driver);
    //
    // await KarmaFieldsAlpha.Database.Queries.remove(query.driver);
    //
    // if (task.delta) {
    //
    //   for (let key in task.delta) {
    //
    //     KarmaFieldsAlpha.Store.Delta.set(task.delta[key], "vars", query.driver, task.id, key);
    //
    //   }
    //
    // }


  }


  // insertItem(newItem, index, ...path) {
  //
  //   const items = [...this.toArray()];
  //
  //   KarmaFieldsAlpha.DeepArray.splice(items, 0, [newItem], index, ...path);
  //
  //   KarmaFieldsAlpha.Store.State.set(items, "deltaItems", this.driver, this.paramstring);
  //
  // }

  insert(newItem, index) {

    const items = [...this.toArray()];

    items.splice(index, 0, newItem);

    KarmaFieldsAlpha.Store.Delta.set(items, "items", this.driver, this.paramstring);

  }

  replace(newItem, callback) {

    const index = this.toArray().findIndex(callback);

    if (index > -1) {

      this.insertItem(newItem, items)

    }

  }

  delete(index, length = 1) {

    const items = [...this.toArray()];

    const itemsToDelete = items.splice(index, length);

    KarmaFieldsAlpha.Store.Delta.set(items, "items", this.driver, this.paramstring);


    // for (let item of itemsToDelete) {
    //
    //   // KarmaFieldsAlpha.Store.Delta.set(["1"], driver, id, "trash");
    //
    //   const row = new KarmaFieldsAlpha.Content.Row({trash: "1"}, this.driver, item.id);
    //   row.update();
    //
    // }

    KarmaFieldsAlpha.Store.Tasks.add({
      resolve: async () => {

        for (let item of itemsToDelete) {

          if (item.id) {

            KarmaFieldsAlpha.Store.set([], "vars", this.driver, item.id, "trash");
            KarmaFieldsAlpha.Store.set(true, "verifiedVars", this.driver, item.id, "trash");
            KarmaFieldsAlpha.Store.remove("diff", "vars", this.driver, item.id, "trash");
            KarmaFieldsAlpha.Store.Delta.set(["1"], "vars", this.driver, item.id, "trash");

            await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}/${item.id}`, {trash: ["1"]});

          }

        }

        KarmaFieldsAlpha.Store.remove("items", this.driver);
        KarmaFieldsAlpha.Store.remove("counts", this.driver);

        await KarmaFieldsAlpha.Database.Queries.remove(this.driver);
      },
      type: "remove"
    });

  }

  add(index, params) {

    this.insert({loading: true}, index);

    KarmaFieldsAlpha.Store.Tasks.add({
      resolve: async () => {

        const data = {};

        for (let key in params) {

          const keyAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);
          const value = params[key].split(",");

          data[keyAlias] = value;

        }

        let id = await KarmaFieldsAlpha.HTTP.post(`add/${this.driver}`, data);
        id = id.toString();

        const name = "[new Item]";

        const deltaItems = KarmaFieldsAlpha.Store.Delta.get("items", this.driver, this.paramstring);

        const index = deltaItems.findIndex(item => item.loading);

        if (index > -1) {

          const newDeltaItems = [...deltaItems];
          newDeltaItems[index] = {id, name};

          KarmaFieldsAlpha.Store.Delta.set(newDeltaItems, "items", this.driver, this.paramstring);

        }

        for (let key in params) {

          // const keyAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);
          // const value = params[key].split(",");
          //
          // data[keyAlias] = value;

          const value = params[key].split(",");

          KarmaFieldsAlpha.Store.set(value, "vars", this.driver, id, key);
          KarmaFieldsAlpha.Store.set(true, "verifiedVars", this.driver, id, key);
          KarmaFieldsAlpha.Store.remove("diff", "vars", this.driver, id, key);
          KarmaFieldsAlpha.Store.Delta.set(value, "vars", this.driver, id, key);

        }


        if (Object.values(data).length) {

          // const data = {};

          await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}/${id}`, data);

        }

        KarmaFieldsAlpha.Store.set(["1"], "vars", this.driver, id, "trash");
        KarmaFieldsAlpha.Store.Delta.set([], "vars", this.driver, id, "trash");

        KarmaFieldsAlpha.Store.remove("items", this.driver);
        KarmaFieldsAlpha.Store.remove("counts", this.driver);

        await KarmaFieldsAlpha.Database.Queries.remove(this.driver);

        console.log("done");

      },
      type: "add"
    });

  }



  async createItem(params) {


    // const defaults = this.parse(this.resource.defaults || {});
    // const filters = this.getFilters();
    //
    // // const position = this.getPosition();
    //
    // if (this.loading || defaults.loading || filters.loading) {
    //
    //   return; // !!!
    //
    // }
    //
    // const params = {...filters.toObject(), ...defaults.toObject()};
    //
    // const data = {};

    for (let key in params) {

      const keyAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);
      const value = params[key].split(",");

      data[keyAlias] = value;

    }

    let id = await KarmaFieldsAlpha.HTTP.post(`add/${this.driver}`, data);
    id = id.toString();

    // const name = "[new Item]";
    // const items = query.toArray();
    // const index = items.findIndex(item => item.token === task.token);
    //
    // if (index > -1) {
    //
    //   const newItems = [...deltaItems];
    //   newItems[index] = {id, name};
    //
    //   this.setItems(newItems);
    //
    // }

    for (let key in params) {

      const value = params[key].split(",");

      KarmaFieldsAlpha.Store.set(value, "vars", this.driver, id, key);
      // KarmaFieldsAlpha.Store.set(true, "verifiedVars", this.this.driver, id, key);
      KarmaFieldsAlpha.Store.remove("diff", "vars", this.driver, id, key);
      KarmaFieldsAlpha.Store.Delta.set(value, "vars", this.driver, id, key);

    }


    if (Object.values(data).length) {

      await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}/${id}`, data);

    }

    KarmaFieldsAlpha.Store.set(["1"], "vars", this.driver, id, "trash");
    KarmaFieldsAlpha.Store.Delta.set([], "vars", this.driver, id, "trash");

    KarmaFieldsAlpha.Store.remove("items", this.driver);
    KarmaFieldsAlpha.Store.remove("counts", this.driver);

    await KarmaFieldsAlpha.Database.Queries.remove(this.driver);

    return id;

    // if (delta) {
    //
    //   for (let key in delta) {
    //
    //     KarmaFieldsAlpha.Store.Delta.set(delta[key], "vars", this.driver, id, key);
    //
    //   }
    //
    // }

  }







}




KarmaFieldsAlpha.Content.Value = class extends KarmaFieldsAlpha.Content {

  // compat
  constructor(driver, id, key) {

    super();
    
    this.driver = driver;
    this.id = id;
    this.key = key;

    const collection = new KarmaFieldsAlpha.Model(driver);
    const query = collection.queryValue(id, key);

    this.value = query.value;
    this.loading = query.loading;

  }


  //
  // constructor(driver, id, key) {
  //
  //   super();
  //
  //   this.driver = driver;
  //   this.id = id;
  //   this.key = key;
  //
  //   this.fetch();
  //
  // }
  //
  // fetch() {
  //
  //   let driver = this.driver;
  //   let id = this.id;
  //   let key = this.key;
  //
  //   key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
  //
  //   const delta = KarmaFieldsAlpha.Store.Delta.get("vars", driver, id, key);
  //   const value = KarmaFieldsAlpha.Store.get("vars", driver, id, key);
  //   // const diff = KarmaFieldsAlpha.Store.get("diffVars", driver, id, key);
  //
  //   this.value = delta || value;
  //   this.modified = delta && KarmaFieldsAlpha.DeepObject.differ(delta, value);
  //   this.diff = KarmaFieldsAlpha.Store.get("diff", "vars", driver, id, key);
  //   this.warning = Boolean(delta && this.diff);
  //   this.loading = !value;
  //
  //   if (!id) {
  //     console.log(driver, id, key);
  //     console.trace();
  //   }
  //
  //   if (!value) { // -> create a task to fetch it
  //
  //     const attempt = KarmaFieldsAlpha.Driver.getAttempt(driver, id);
  //
  //     if (attempt) {
  //
  //       let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.type === "vars" && task.driver === driver && task.attempt === attempt);
  //
  //       if (!task) {
  //
  //         task = {
  //           name: `Loading Content...`,
  //           type: "vars",
  //           driver: driver,
  //           ids: new Set(),
  //           attempt: attempt,
  //           resolve: async task => {
  //
  //             const data = await KarmaFieldsAlpha.Database.Vars.get(driver);
  //
  //             if (data && data[id] && data[id][key]) {
  //
  //               for (let id of task.ids) {
  //
  //                 KarmaFieldsAlpha.Store.assign(data[id], "vars", driver, id);
  //
  //                 KarmaFieldsAlpha.Driver.verify(driver, null, id);
  //
  //               }
  //
  //             } else if (attempt === "query") {
  //
  //               const paramstring = `ids=${[...task.ids].join(",")}`;
  //
  //               const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}?${paramstring}`);
  //
  //               const dataset = KarmaFieldsAlpha.Driver.createQueryDataset(results, driver);
  //
  //               await KarmaFieldsAlpha.Database.Vars.set(dataset, driver);
  //
  //               for (let id in dataset) {
  //
  //                 for (let key in dataset[id]) {
  //
  //                   KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", driver, id, key);
  //                   KarmaFieldsAlpha.Store.set(true, "verifiedVars", driver, id, key);
  //
  //                 }
  //
  //               }
  //
  //               for (let id of task.ids) {
  //
  //                 KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, "query");
  //
  //               }
  //
  //             } else {
  //
  //               const paramstring = `ids=${[...task.ids].join(",")}`;
  //
  //               const relations = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${attempt}?${paramstring}`);
  //
  //               const dataset = KarmaFieldsAlpha.Driver.createRelationDataset(relations);
  //
  //               await KarmaFieldsAlpha.Database.Vars.set(dataset, driver);
  //
  //               for (let id in dataset) {
  //
  //                 for (let key in dataset[id]) {
  //
  //                   KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", driver, id, key);
  //                   KarmaFieldsAlpha.Store.set(true, "verifiedVars", driver, id, key);
  //
  //                 }
  //
  //               }
  //
  //               for (let id of task.ids) {
  //
  //                 KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, attempt);
  //
  //               }
  //
  //             }
  //
  //           }
  //
  //         };
  //
  //         KarmaFieldsAlpha.Store.Tasks.add(task);
  //
  //       }
  //
  //       task.ids.add(id);
  //
  //     } else { // -> not found
  //
  //       // value = [];
  //       this.loading = false;
  //       this.notFound = true;
  //
  //       KarmaFieldsAlpha.Store.set([], "vars", driver, id, key);
  //
  //       let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.type === "varnotfound" && task.driver === driver);
  //
  //       if (!task) {
  //
  //         task = {
  //           type: "varnotfound",
  //           driver: driver,
  //           data: {},
  //           resolve: async task => {
  //             await KarmaFieldsAlpha.Database.Vars.set(task.data, task.driver);
  //           }
  //         };
  //
  //         KarmaFieldsAlpha.Store.Tasks.add(task);
  //
  //       }
  //
  //       KarmaFieldsAlpha.DeepObject.set(task.data, [], id, key);
  //
  //     }
  //
  //   } else {
  //
  //     // KarmaFieldsAlpha.Driver.verify(driver, null, id);
  //
  //   }
  //
  //
  //
  //   // } else if (!KarmaFieldsAlpha.Store.get("verifiedVars", driver, id, key)) {
  //   //
  //   //   const attempt = KarmaFieldsAlpha.Driver.getAttempt(driver, id);
  //   //
  //   //   if (attempt) {
  //   //
  //   //     let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.type === "verify-vars" && task.driver === driver && task.attempt === attempt);
  //   //
  //   //     if (!task) {
  //   //
  //   //       task = {
  //   //         name: `Loading Content...`,
  //   //         type: "verify-vars",
  //   //         driver: driver,
  //   //         ids: new Set(),
  //   //         priority: -1,
  //   //         attempt: attempt,
  //   //         resolve: async task => {
  //   //
  //   //           if (attempt === "query") {
  //   //
  //   //             const paramstring = `ids=${[...task.ids].join(",")}`;
  //   //
  //   //             const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}?${paramstring}`);
  //   //
  //   //             const dataset = KarmaFieldsAlpha.Driver.createQueryDataset(results, driver);
  //   //
  //   //             for (let id in dataset) {
  //   //
  //   //               for (let key in dataset[id]) {
  //   //
  //   //                 const localValue = KarmaFieldsAlpha.Store.get("var", driver, id, key);
  //   //                 const remoteValue = dataset[id][key];
  //   //
  //   //                 if (!KarmaFieldsAlpha.DeepObject.compare(remoteValue, localValue)) {
  //   //
  //   //                   KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", driver, id, key);
  //   //                   KarmaFieldsAlpha.Store.set(true, "diff", "vars", driver, id, key);
  //   //
  //   //                   await KarmaFieldsAlpha.Database.Vars.set(dataset[id][key], driver, id, key);
  //   //
  //   //                 }
  //   //
  //   //                 KarmaFieldsAlpha.Store.set(true, "verifiedVars", driver, id, key);
  //   //
  //   //               }
  //   //
  //   //             }
  //   //
  //   //             for (let id of task.ids) {
  //   //
  //   //               KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, attempt);
  //   //
  //   //             }
  //   //
  //   //           } else if (attempt) {
  //   //
  //   //             const paramstring = `ids=${[...task.ids].join(",")}`;
  //   //
  //   //             const relations = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${attempt}?${paramstring}`);
  //   //
  //   //             const dataset = KarmaFieldsAlpha.Driver.createRelationDataset(relations);
  //   //
  //   //             for (let id in dataset) {
  //   //
  //   //               for (let key in dataset[id]) {
  //   //
  //   //                 const localValue = KarmaFieldsAlpha.Store.get("var", driver, id, key);
  //   //                 const remoteValue = dataset[id][key];
  //   //
  //   //                 if (!KarmaFieldsAlpha.DeepObject.compare(remoteValue, localValue)) {
  //   //
  //   //                   KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", driver, id, key);
  //   //                   KarmaFieldsAlpha.Store.set(true, "diff", "vars", driver, id, key);
  //   //
  //   //                   await KarmaFieldsAlpha.Database.Vars.set(dataset[id][key], driver, id, key);
  //   //
  //   //                 }
  //   //
  //   //                 KarmaFieldsAlpha.Store.set(true, "verifiedVars", driver, id, key);
  //   //
  //   //               }
  //   //
  //   //             }
  //   //
  //   //             for (let id of task.ids) {
  //   //
  //   //               KarmaFieldsAlpha.Store.set(true, "attempts", driver, id, attempt);
  //   //
  //   //             }
  //   //
  //   //           }
  //   //
  //   //         }
  //   //       }
  //   //
  //   //       KarmaFieldsAlpha.Store.Tasks.add(task);
  //   //
  //   //     }
  //   //
  //   //     task.ids.add(id);
  //   //
  //   //   } else { // not found -> consider as empty
  //   //
  //   //     KarmaFieldsAlpha.Store.set(true, "verifiedVars", driver, id, key);
  //   //
  //   //     if (!KarmaFieldsAlpha.DeepObject.compare(value, [])) {
  //   //
  //   //       KarmaFieldsAlpha.Store.set([], "vars", driver, id, key);
  //   //       KarmaFieldsAlpha.Store.set(true, "diff", "vars", driver, id, key);
  //   //
  //   //     }
  //   //
  //   //   }
  //
  //
  // }

  update(value) {

    value = new KarmaFieldsAlpha.Content(value).toArray();

    KarmaFieldsAlpha.Store.Delta.set(value, "vars", this.driver, this.id, this.key);

  }

  insert(values, index, length = 0) {

    const newValues = [...this.toArray()];

    newValues.splice(index, length, ...values);

    this.update(newValues);

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
            } else {

              // verify count...
            }
            count = Number(count || 0);
            KarmaFieldsAlpha.Store.set(count, "counts", driver, paramstring);
          }
        });

        // KarmaFieldsAlpha.Store.set([...tasks, task], "tasks");

      }

    }

  }

}

//
// KarmaFieldsAlpha.Content.Row = class extends KarmaFieldsAlpha.Content {
//
//   constructor(value, driver, id) {
//
//     this.value = value;
//     this.driver = driver;
//     this.id = id;
//
//   }
//
//   async update() {
//
//     const data = {};
//
//     for (let key in this.value) {
//
//       const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);
//       const value = this.value[key].split(",")
//
//       data[idAlias] = value;
//
//       KarmaFieldsAlpha.Store.set(value, "vars", driver, id, key);
//       KarmaFieldsAlpha.Store.remove(value, "diff", "vars", driver, id, key);
//       KarmaFieldsAlpha.Store.Delta.set(value, driver, id, key);
//
//     }
//
//     if (Object.values(data).length) {
//
//       await KarmaFieldsAlpha.HTTP.post(`update/${driver}/${id}`, data);
//
//     }
//
//   }
//
// }


KarmaFieldsAlpha.Content.Medias = class extends KarmaFieldsAlpha.Content.Query {

  constructor(driver, params) {

    super(driver, params);

    const parent = params.parent || "0";

    if (parent !== "0" && !this.loading) {

      this.value = [
        {
          // id: exit.toString() || "0",
          id: "0",
          parent: parent,
          exit: true,
          name: ".."
        },
        ...this.value
      ];

    }

  }

  add(index, params) {

    const items = this.toArray();

    if (items[0] && items[0].exit) {

      this.value = items.slice(1);
    }

    super.add(index, params);
  }

  delete(index, length) {

    const items = this.toArray();

    if (items[0] && items[0].exit) {

      this.value = items.slice(1);
    }

    super.delete(index, length);
  }

  move(index, length, target) {

    let items = [...this.toArray()];
    const itemsToMove = items.splice(index, length).filter(item => !item.exit);

    items = items.filter(item => !item.exit);

    KarmaFieldsAlpha.Store.Delta.set(items, "items", this.driver, this.paramstring);

    KarmaFieldsAlpha.Store.Tasks.add({
      type: "move",
      resolve: async () => {

        const parentAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "parent");

        for (let item of itemsToMove) {

          KarmaFieldsAlpha.Store.set([target], "vars", this.driver, item.id, "parent");
          KarmaFieldsAlpha.Store.set(true, "verifiedVars", this.driver, item.id, "parent");
          KarmaFieldsAlpha.Store.remove("diff", "vars", this.driver, item.id, "parent");
          KarmaFieldsAlpha.Store.Delta.set([target], "vars", this.driver, item.id, "parent");



          await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}/${item.id}`, {[parentAlias]: [target]});

          KarmaFieldsAlpha.Store.remove("buffer", "state", "delta", "items", this.driver);

        }

        KarmaFieldsAlpha.Store.remove("items", this.driver);
        KarmaFieldsAlpha.Store.remove("counts", this.driver);

        await KarmaFieldsAlpha.Database.Queries.remove(this.driver);

      }
    });

  }


  upload(files, index, params) {

    const items = [...this.toArray()];

    for (let file of files) {

      items.splice(index, 0, {uploading: true});

      KarmaFieldsAlpha.Store.Tasks.add({
        type: "move",
        resolve: async () => {

          let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent is not going to be saved!

          // if (KarmaFieldsAlpha.useWPMediaUploader) {
          //
          //   id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent is not going to be saved!
          //
          // } else {
          //
          //   id = await KarmaFieldsAlpha.HTTP.stream(file, params);
          //
          // }

          id = id.toString();

          const deltaItems = KarmaFieldsAlpha.Store.Delta.get("items", this.driver, this.paramstring);

          const index = deltaItems.findIndex(item => item.uploading);

          if (index > -1) {

            const newDeltaItems = [...deltaItems];
            newDeltaItems[index] = {id, name: file.name};

            KarmaFieldsAlpha.Store.Delta.set(newDeltaItems, "items", this.driver, this.paramstring);

          }

          if (params && Object.values(params).length) {

            const data = {};

            for (let key in params) {

              const keyAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);

              const value = params[key].split(",");

              data[keyAlias] = value;

              KarmaFieldsAlpha.Store.set(value, "vars", this.driver, id, key);
              KarmaFieldsAlpha.Store.set(true, "verifiedVars", this.driver, id, key);
              KarmaFieldsAlpha.Store.remove("diff", "vars", this.driver, id, key);
              KarmaFieldsAlpha.Store.Delta.set(value, "vars", this.driver, id, key);

            }

            await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}/${id}`, data);

          }

          KarmaFieldsAlpha.Store.set(["1"], "vars", this.driver, id, "trash");
          KarmaFieldsAlpha.Store.set(true, "verifiedVars", this.driver, id, "trash");
          KarmaFieldsAlpha.Store.remove("diff", "vars", this.driver, id, "trash");
          KarmaFieldsAlpha.Store.Delta.set([], "vars", this.driver, id, "trash");

          // KarmaFieldsAlpha.Store.remove("items", this.driver);
          // KarmaFieldsAlpha.Store.remove("counts", this.driver);

          await KarmaFieldsAlpha.Database.Queries.remove(this.driver);

        }
      });

    }

    const newItems = items.filter(item => !item.exit);

    KarmaFieldsAlpha.Store.Delta.set(newItems, "items", this.driver, this.paramstring);

    return index;
  }

}


KarmaFieldsAlpha.Content.Node = class extends KarmaFieldsAlpha.Content.Value {

  constructor(content, subkey) {

    super();

    this.content = content;
    this.key = subkey;
    this.loading = content.loading;

    if (!content.loading) {

      const node = content.toObject();
      this.value = node[subkey];

    }

  }

  fetch() {

    this.content.fetch();

  }

  update(value) {

    this.fetch();

    if (!this.content.loading) {

      const node = this.content.toObject();

      this.content = {...node, [this.key]: value};

      this.content.update();

    }

  }

}



KarmaFieldsAlpha.Content.KeyedArrayCell = class extends KarmaFieldsAlpha.Content {

  constructor(content, index, key, subkey) {

    super();

    this.content = content;
    this.index = index;
    this.key = key;
    this.subkey = subkey;
    this.loading = content.loading;

    if (!this.content.loading) {

      const array = content.toArray();

      this.value = array[index][subkey];

    }

  }

  fetch() {

    this.content.fetch();

  }

  set(value) {

    this.content.fetch();

    if (!this.content.loading) {

      const array = this.content.toArray();

      array[this.content.index][this.content.subkey] = value;

      this.content.set(array);

    }

  }

}
