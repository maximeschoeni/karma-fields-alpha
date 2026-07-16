
KarmaFieldsAlpha.Driver = class {

  static getAlias(driver, key) {

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "alias", key) || key;

  }


  static getRelations(driver) {

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "relations");

  }

}



KarmaFieldsAlpha.Shuttle = class {

  // static getAlias(driver, key) {
  //
  //   return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "alias", key) || key;
  //
  // }
  //
  //
  // static getRelations(driver) {
  //
  //   return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "relations");
  //
  // }

  // static update() {
  //
  //   const shuttles = KarmaFieldsAlpha.Store.get("shuttles");
  //
  //   if (shuttles) {
  //
  //     for (let context in shuttles) {
  //
  //       for (let driver in shuttles[context]) {
  //
  //         for (let paramstring in shuttles[context][driver]) {
  //
  //           const shuttle = shuttles[context][driver][paramstring];
  //
  //
  //
  //         }
  //
  //       }
  //
  //     }
  //
  //
  //   }
  //
  // }

  // static find(context, driver, paramstring, id, key) {
  //
  //   let queries = KarmaFieldsAlpha.Store.get("shuttles", context, driver, paramstring);
  //
  //   if (!queries) {
  //
  //     queries = [];
  //
  //     KarmaFieldsAlpha.Store.set(queries, "shuttles", context, driver, paramstring);
  //
  //   }
  //
  //   let query = queries.find(query => !query.closed || query.queriedIds.has(id));
  //
  //   if (!query) {
  //
  //     query = new KarmaFieldsAlpha.Query(context, driver, paramstring);
  //
  //     queries.push(query);
  //
  //   }
  //
  //   query.ids.set(id);
  //   query.keys.set(key);
  //
  //   return query;
  //
  // }

  // static find(context, driver, paramstring, id, key) {
  //
  //   // let shuttle = KarmaFieldsAlpha.Store.get("shuttles", context, driver, paramstring);
  //   //
  //   // if (shuttle && (!shuttle.closed || shuttle.queriedIds.includes(id))) {
  //   //
  //   //   return shuttle;
  //   //
  //   // }
  //
  //   let shuttle = this.get(context, driver, paramstring);
  //
  //   if (!shuttle || (shuttle.closed && !shuttle.queriedIds.includes(id))) {
  //
  //     shuttle = this.create(context, driver, paramstring);
  //
  //   }
  //
  //
  // }
  //
  // static get(context, driver, paramstring) {
  //
  //   return KarmaFieldsAlpha.Store.get("shuttles", context, driver, paramstring);
  //
  // }
  //
  //
  // static create(context, driver, paramstring) {
  //
  //   const shuttle = new this(context, driver, paramstring);
  //
  //   KarmaFieldsAlpha.Store.set(shuttle, "shuttles", context, driver, paramstring);
  //
  //   return shuttle;
  //
  // }

  constructor(context, driver, paramstring) {

    this.context = context;
    this.driver = driver;
    this.paramstring = paramstring;

    // this.ids = ids;
    // this.keys = keys;

    this.standBy = true;

    this.queried = false;
    this.complete = false;

    this.ids = new Set();
    this.keys = new Set();

    this.init();

    // this.road = this[context]();

    this.continue();

  }

  init() {

    if (this.context === "cache") {

      this.road = this.cache();

    } else {

      this.road = this.remote();

    }

    this.queried = false;
    this.complete = false;

  }

  add(id, key) {

    if (!this.ids.has(id) && this.queried && !this.queriedIds.includes(id)) {

      // this.road = this[context]();
      //
      // this.queried = false;
      // this.complete = false;

      this.init();

    }

    this.ids.add(id);
    this.keys.add(key);

  }

  // async load() {
  //
  //   this.away = true;
  //
  //   this.closed = true;
  //
  //   const result = await this.gen.next();
  //
  //   this.done = result.done;
  //
  //   this.away = false;
  //
  // }
  //
  // async proceed() {
  //
  //   if (!this.paused) {
  //
  //     this.closed = true;
  //
  //     KarmaFieldsAlpha.Tasks.add({
  //       resolve: () => this.load()
  //     });
  //
  //     const result = await this.gen.next();
  //
  //     this.done = result.done;
  //
  //     this.paused = true;
  //
  //   }
  //
  // }

  async *work() {

    const result = await this.road.next();

    if (result.done) {

      this.complete = true;

    }

    this.standBy = true;

  }

  continue() {

    if (!this.standBy) {

      this.standBy = false;

      // const work = async function* () {
      //
      //   const result = await this.gen.next();
      //
      //   if (result.done) {
      //
      //     this.complete = true;
      //
      //   } else {
      //
      //     this.queried = true;
      //
      //   }
      //
      //   this.standBy = true;
      //
      // }

      KarmaFieldsAlpha.Works.add(this.work());

    }

  }

  // static getValue(driver, paramstring, id, key) {
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //
  //   key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
  //
  //   content.value = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", driver, id, key);
  //
  //   if (content.value) {
  //
  //     content.modified = true;
  //
  //   } else {
  //
  //     content.value = KarmaFieldsAlpha.Store.get("vars", "remote", driver, id, key);
  //
  //     if (!content.value) { // -> create a task to fetch it
  //
  //       const query = KarmaFieldsAlpha.Query.find(driver, paramstring, id, key);
  //
  //       if (query.done) {
  //
  //         content.value = [];
  //         content.notFound = true;
  //
  //       } else if (query.away) {
  //
  //         content.loading = true;
  //
  //       } else {
  //
  //         KarmaFieldsAlpha.Tasks.add({
  //           resolve: () => query.load()
  //         });
  //
  //         content.value = KarmaFieldsAlpha.Store.get("vars", "cache", driver, id, key);
  //
  //         if (content.value) {
  //
  //           content.cache = true;
  //
  //         } else {
  //
  //           content.loading = true;
  //
  //         }
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   return content;
  //
  // }

  // static getItems(driver, paramstring) {
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //
  //   content.value = KarmaFieldsAlpha.Store.State.get("items", driver, paramstring);
  //
  //   if (!content.value) {
  //
  //     const shuttle = this.get("remote", driver, paramstring) || this.create("remote", driver, paramstring);
  //
  //     if (shuttle.queriedItems) {
  //
  //       content.value = shuttle.queriedItems;
  //
  //     } else {
  //
  //       shuttle.next();
  //
  //       // if (!shuttle.away) {
  //       //
  //       //   KarmaFieldsAlpha.Tasks.add({
  //       //     resolve: () => query.load()
  //       //   });
  //       //
  //       // }
  //
  //       const shuttle = this.get("cache", driver, paramstring) || this.create("cache", driver, paramstring);
  //
  //       if (shuttle.queriedItems) {
  //
  //         content.cache = true;
  //         content.value = shuttle.queriedItems;
  //
  //       } else {
  //
  //         shuttle.next();
  //
  //         // if (!shuttle.away) {
  //         //
  //         //   KarmaFieldsAlpha.Tasks.add({
  //         //     resolve: () => query.load()
  //         //   });
  //         //
  //         // }
  //
  //         content.loading = true;
  //       }
  //
  //     }
  //
  //   }
  //
  //   return content;
  //
  // }
  //
  //
  // static getValue(driver, paramstring, id, key) {
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //
  //   key = this.getAlias(driver, key);
  //
  //   content.value = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", driver, id, key);
  //
  //   if (content.value) {
  //
  //     content.modified = true;
  //
  //   } else {
  //
  //     content.value = KarmaFieldsAlpha.Store.get("vars", "remote", driver, id, key);
  //
  //     if (!content.value) {
  //
  //       // let shuttle = this.get("remote", driver, paramstring);
  //       //
  //       // if (!shuttle || (shuttle.closed && !shuttle.queriedIds.includes(id))) {
  //       //
  //       //   shuttle = this.create("remote", driver, paramstring);
  //       //
  //       // }
  //
  //       let shuttle = this.find("remote", driver, paramstring, id);
  //
  //       shuttle.ids.add(id);
  //       shuttle.ids.add(key);
  //
  //       if (shuttle.done) {
  //
  //         content.value = [];
  //         content.notFound = true;
  //
  //       } else {
  //
  //         shuttle.next();
  //
  //         // if (!query.away) {
  //         //
  //         //   KarmaFieldsAlpha.Tasks.add({
  //         //     resolve: () => query.load()
  //         //   });
  //         //
  //         // }
  //
  //         content.value = KarmaFieldsAlpha.Store.get("vars", "cache", driver, id, key);
  //
  //         if (content.value) {
  //
  //           content.cache = true;
  //
  //         } else {
  //
  //           // const query = this.find("cache", driver, paramstring, id, key);
  //           //
  //           // if (!query.done && !query.away) {
  //           //
  //           //   KarmaFieldsAlpha.Tasks.add({
  //           //     resolve: () => query.load()
  //           //   });
  //           //
  //           // }
  //
  //           // let shuttle = this.get("cache", driver, paramstring);
  //           //
  //           // if (!shuttle || (shuttle.closed && !query.queriedIds.includes(id))) {
  //           //
  //           //   shuttle = this.create("cache", driver, paramstring);
  //           //
  //           // }
  //
  //           let shuttle = this.find("cache", driver, paramstring, id);
  //
  //           shuttle.next();
  //
  //           shuttle.ids.add(id);
  //           shuttle.ids.add(key);
  //
  //           content.loading = true;
  //         }
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   return content;
  //
  // }

  // getValue(id, key) {
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //
  //   key = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);
  //
  //   content.value = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver, id, key);
  //
  //   if (content.value) {
  //
  //     content.modified = true;
  //
  //   } else {
  //
  //     content.value = KarmaFieldsAlpha.Store.get("vars", "remote", this.driver, id, key);
  //
  //     if (!content.value) { // -> create a task to fetch it
  //
  //       this.ids.add(id);
  //       this.keys.add(key);
  //
  //       KarmaFieldsAlpha.Tasks.add({
  //         resolve: () => this.gen.next()
  //       });
  //
  //       content.value = KarmaFieldsAlpha.Store.get("vars", "cache", this.driver, id, key);
  //
  //       if (content.value) {
  //
  //         content.cache = true;
  //
  //       } else {
  //
  //         content.loading = true;
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   return content;
  //
  // }

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


  store(dataset) {

    for (let id in dataset) {

      for (let key in dataset[id]) {

        KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", this.context, this.driver, id, key);

      }

    }

  }


  parseResults(results) {

    const dataset = {};

    const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "id");

    for (let item of results) {

      const id = item[idAlias];

      dataset[id] = {};

      for (let key in item) {

        dataset[id][key] = [item[key]];

      }

    }

    this.store(dataset);

  }

  parseRelations(relations) {

    const dataset = {};

    if (relations) {

      for (let relation of relations) {

        const id = relation.id.toString();
        const key = relation.key.toString();

        if (!dataset[id]) {

          dataset[id] = {};

        }

        if (!dataset[id][key]) {

          dataset[id][key] = [];

        }

        dataset[id][key].push(relation.value);

      }

    }

    this.store(dataset);

  }



  async *cache() {

    if (!this.paramstring === undefined) {

      this.paramstring = `ids=${[...this.ids].join(",")}`;

    }

    yield;

    let results = await KarmaFieldsAlpha.Database.Queries.get("query", this.driver, this.paramstring);

    this.queried = true;

    if (results) {

      const idAlias = this.constructor.getAlias(this.driver, "id");
      const nameAlias = this.constructor.getAlias(this.driver, "name");

      this.queriedIds = results.map(result => result[idAlias]);
      this.queriedItems = results.map(result => ({id: result[idAlias], name: result[nameAlias]}));

      // const dataset = {};
      //
      // for (let dataset of results) {
      //
      //   const id = item[idAlias];
      //
      //   dataset[id] = {};
      //
      //   for (let key in item) {
      //
      //     dataset[id][key] = [item[key]];
      //
      //   }
      //
      // }
      //
      // for (let id in dataset) {
      //
      //   for (let key in dataset[id]) {
      //
      //     KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", this.context, this.driver, id, key);
      //
      //   }
      //
      // }

      this.parseResults(results);

      KarmaFieldsAlpha.Store.set(this.queriedItems, "items", "cache", this.driver, this.paramstring);

      const relations = KarmaFieldsAlpha.Driver.getRelations(this.driver);

      if (relations) {

        paramstring = `ids=${this.queriedIds.join(",")}`;

        for (let relation of relations) {

          yield;

          const results = KarmaFieldsAlpha.Database.Queries.get(relation, driver, paramstring);

          if (results) {

            this.parseRelations(results);

            // const dataset = this.createRelationDataset(results);

            // const dataset = {};
            //
            // if (relations) {
            //
            //   for (let relation of relations) {
            //
            //     const id = relation.id.toString();
            //     const key = relation.key.toString();
            //
            //     if (!dataset[id]) {
            //
            //       dataset[id] = {};
            //
            //     }
            //
            //     if (!dataset[id][key]) {
            //
            //       dataset[id][key] = [];
            //
            //     }
            //
            //     dataset[id][key].push(relation.value);
            //
            //   }
            //
            // }
            //
            // for (let id in dataset) {
            //
            //   for (let key in dataset[id]) {
            //
            //     KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", this.context, this.driver, id, key);
            //
            //   }
            //
            // }

          }

        }

      }

    }




    // const items = this.createQuery(results);
    //
    // this.queriedItems = items;
    // this.queriedIds = items.map(item => item.id);

    // const dataset = this.createQueryDataset(results);
    //
    // this.writeData(dataset);

    // KarmaFieldsAlpha.Store.set(items, "items", this.driver, this.paramstring);

    // yield;
    //
    // const relations = KarmaFieldsAlpha.Driver.getRelations(this.driver);
    //
    // if (relations) {
    //
    //   const ids = items.map(item => item.id);
    //
    //   paramstring = `ids=${ids.join(",")}`;
    //
    //   for (let relation of relations) {
    //
    //     const results = KarmaFieldsAlpha.Database.Queries.get(relation, driver, `ids=${ids.join(",")}`);
    //
    //     if (results) {
    //
    //       const dataset = this.createRelationDataset(results);
    //
    //       this.writeData(dataset);
    //
    //       yield;
    //
    //     }
    //
    //   }
    //
    // }

  }

  async *remote() {

    if (!this.paramstring === undefined) {

      this.paramstring = `ids=${[...this.ids].join(",")}`;

    }

    yield;

    let results = await KarmaFieldsAlpha.HTTP.get(`query/${this.driver}?${this.paramstring}`);

    this.queried = true;

    if (results) {

      await KarmaFieldsAlpha.Database.Queries.set(results, "query", this.driver, this.paramstring);

      this.parseResults(results);

      const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "id");
      const nameAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "name");

      this.queriedIds = results.map(result => result[idAlias]);
      this.queriedItems = results.map(result => ({id: result[idAlias], name: result[nameAlias]}));

      // const dataset = {};
      //
      // for (let dataset of results) {
      //
      //   const id = item[idAlias];
      //
      //   dataset[id] = {};
      //
      //   for (let key in item) {
      //
      //     dataset[id][key] = [item[key]];
      //
      //   }
      //
      // }
      //
      // for (let id in dataset) {
      //
      //   for (let key in dataset[id]) {
      //
      //     KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", this.context, this.driver, id, key);
      //
      //   }
      //
      // }

      KarmaFieldsAlpha.Store.set(this.queriedItems, "items", "cache", this.driver, this.paramstring);



      const relations = KarmaFieldsAlpha.Driver.getRelations(this.driver);

      if (relations && this.queriedIds.length > 0) {

        paramstring = `ids=${this.queriedIds.join(",")}`;

        for (let relation of relations) {

          yield;

          const results = await KarmaFieldsAlpha.HTTP.get(`relations/${this.driver}/${relation}?${paramstring}`);

          if (results) {

            await KarmaFieldsAlpha.Database.Queries.set(results, relation, this.driver, paramstring);

            this.parseRelations(results);

            // const dataset = this.createRelationDataset(results);
            //
            // this.writeData(dataset);

            // const dataset = {};
            //
            // if (relations) {
            //
            //   for (let relation of relations) {
            //
            //     const id = relation.id.toString();
            //     const key = relation.key.toString();
            //
            //     if (!dataset[id]) {
            //
            //       dataset[id] = {};
            //
            //     }
            //
            //     if (!dataset[id][key]) {
            //
            //       dataset[id][key] = [];
            //
            //     }
            //
            //     dataset[id][key].push(relation.value);
            //
            //   }
            //
            // }
            //
            // for (let id in dataset) {
            //
            //   for (let key in dataset[id]) {
            //
            //     KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", "remote", this.driver, id, key);
            //
            //   }
            //
            // }

          }

        }

      }

    }



    // const items = this.createQuery(results);
    //
    // this.queriedIds = new Set(items.map(item => item.id));
    //
    // const dataset = this.createQueryDataset(results);
    //
    // this.writeData(dataset);

    // KarmaFieldsAlpha.Store.State.set(items, "items", this.driver, this.paramstring);
    //
    // yield;

    // const relations = KarmaFieldsAlpha.Driver.getRelations(this.driver);
    //
    // if (relations) {
    //
    //   paramstring = `ids=${[...this.ids].join(",")}`;
    //
    //   for (let relation of relations) {
    //
    //     const results = await KarmaFieldsAlpha.HTTP.get(`relations/${this.driver}/${relation}?${paramstring}`);
    //
    //     await KarmaFieldsAlpha.Database.Queries.set(results || [], relation, this.driver, paramstring);
    //
    //     if (results) {
    //
    //       const dataset = this.createRelationDataset(results);
    //
    //       this.writeData(dataset);
    //
    //       yield;
    //
    //     }
    //
    //   }
    //
    // }


    // write null values

    for (let id of this.ids) {

      for (let key of this.keys) {

        const value = KarmaFieldsAlpha.Store.get("vars", "remote", this.driver, id, key);

        if (!value) {

          KarmaFieldsAlpha.Store.set([], "vars", "remote", this.driver, id, key);

        }

      }

    }



  }
}




// KarmaFieldsAlpha.Set = class {
//
//   constructor(driver, paramstring) {
//
//     this.value = KarmaFieldsAlpha.Store.State.get("items", driver, paramstring);
//
//     if (!this.value) {
//
//       let remoteShuttle = KarmaFieldsAlpha.Store.get("shuttles", "remote", driver, paramstring);
//
//       if (!remoteShuttle) {
//
//         remoteShuttle = new KarmaFieldsAlpha.Shuttle("remote", driver, paramstring);
//
//         KarmaFieldsAlpha.Store.set(remoteShuttle, "shuttles", "remote", driver, paramstring);
//
//       }
//
//       if (remoteShuttle.queried) {
//
//         this.value = [];
//
//         KarmaFieldsAlpha.Store.State.set(this.value, "items", driver, paramstring);
//
//         this.notFound = true;
//
//       } else {
//
//         remoteShuttle.continue();
//
//         this.value = KarmaFieldsAlpha.Store.get("items", driver, paramstring);
//
//         if (this.value) {
//
//           this.cache = true;
//
//         } else {
//
//           let cacheShuttle = KarmaFieldsAlpha.Store.get("shuttles", "cache", driver, paramstring);
//
//           if (!cacheShuttle) {
//
//             cacheShuttle = new KarmaFieldsAlpha.Shuttle("cache", driver, paramstring);
//
//             KarmaFieldsAlpha.Store.set(cacheShuttle, "shuttles", "cache", driver, paramstring);
//
//           }
//
//           if (!cacheShuttle.queried) {
//
//             cacheShuttle.continue();
//
//           }
//
//           this.loading = true;
//
//         }
//
//       }
//
//     }
//
//   }
//
// }


// KarmaFieldsAlpha.Value = class {
//
//   constructor(driver, paramstring, id, key) {
//
//     key = this.getAlias(driver, key);
//
//     this.value = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", driver, id, key);
//
//     if (this.value) {
//
//       this.modified = true;
//
//     } else {
//
//       this.value = KarmaFieldsAlpha.Store.get("vars", "remote", driver, id, key);
//
//       if (!content.value) {
//
//         // let shuttle = this.get("remote", driver, paramstring);
//         //
//         // if (!shuttle || (shuttle.closed && !shuttle.queriedIds.includes(id))) {
//         //
//         //   shuttle = this.create("remote", driver, paramstring);
//         //
//         // }
//
//         let remoteShuttle = KarmaFieldsAlpha.Store.get("shuttles", "remote", driver, paramstring);
//
//         if (!remoteShuttle) {
//
//           remoteShuttle = new KarmaFieldsAlpha.Shuttle("remote", driver, paramstring);
//
//           KarmaFieldsAlpha.Store.set(remoteShuttle, "shuttles", "remote", driver, paramstring);
//
//         }
//
//         //
//         //
//         // let shuttle = this.find("remote", driver, paramstring, id);
//
//         if (!remoteShuttle.queried) {
//
//           remoteShuttle.ids.add(id);
//           remoteShuttle.keys.add(key);
//
//         }
//
//         if (remoteShuttle.complete) {
//
//           this.value = [];
//           this.notFound = true;
//
//         } else {
//
//           if (remoteShuttle.standBy) {
//
//             remoteShuttle.continue();
//
//           }
//
//           let cacheShuttle = KarmaFieldsAlpha.Store.get("shuttles", "cache", driver, paramstring);
//
//           if (!cacheShuttle) {
//
//             cacheShuttle = new KarmaFieldsAlpha.Shuttle("cache", driver, paramstring);
//
//             KarmaFieldsAlpha.Store.set(cacheShuttle, "shuttles", "cache", driver, paramstring);
//
//           }
//
//           if (!cacheShuttle.queried) {
//
//             cacheShuttle.ids.add(id);
//             cacheShuttle.keys.add(key);
//
//           }
//
//           if (cacheShuttle.standBy) {
//
//             cacheShuttle.continue();
//
//           }
//
//         }
//
//       }
//
//     }
//
//   }
//
// }

KarmaFieldsAlpha.Set = class {

  constructor(driver, paramstring) {

    this.value = KarmaFieldsAlpha.Store.State.get("items", driver, paramstring);

    if (!this.value) {

      this.query("remote", driver, paramstring);

      if (this.loading) {

        this.query("cache", driver, paramstring);

      } else if (this.notFound) {

        KarmaFieldsAlpha.Store.State.set(this.value, "items", driver, paramstring);

      }

    }

  }

  query(context, driver, paramstring) {

    this.value = KarmaFieldsAlpha.Store.get("vars", context, driver, id, key);

    if (!this.value) {

      let shuttle = KarmaFieldsAlpha.Store.get("shuttles", context, driver, paramstring);

      if (!shuttle) {

        shuttle = new KarmaFieldsAlpha.Shuttle(context, driver, paramstring);

        KarmaFieldsAlpha.Store.set(remoteShuttle, "shuttles", context, driver, paramstring);

      }

      if (shuttle.queried) {

        this.value = [];

        this.notFound = true;

      } else {

        shuttle.continue();

        this.loading = true;

      }

    }

  }

}

KarmaFieldsAlpha.Value = class {

  constructor(driver, paramstring, id, key) {

    key = this.getAlias(driver, key);

    this.value = KarmaFieldsAlpha.Store.Delta.get("vars", context, driver, id, key);

    if (this.value) {

      this.modified = true;

    } else {

      this.query("remote", driver, paramstring, id, key);

      if (this.loading) {

        this.query("cache", driver, paramstring, id, key);

      } else if (this.notFound) {

        KarmaFieldsAlpha.Store.Delta.set(this.value, "vars", context, driver, id, key);

      }

    }

  }

  query(context, driver, paramstring, id, key) {

    this.value = KarmaFieldsAlpha.Store.get("vars", context, driver, id, key);

    if (!content.value) {

      let shuttle = KarmaFieldsAlpha.Store.get("shuttles", context, driver, paramstring);

      if (!shuttle) {

        shuttle = new KarmaFieldsAlpha.Shuttle(context, driver, paramstring);

        KarmaFieldsAlpha.Store.set(shuttle, "shuttles", context, driver, paramstring);

      }

      shuttle.ids.add(id);
      shuttle.keys.add(key);

      if (shuttle.complete) {

        this.value = [];
        this.notFound = true;

      } else {

        if (shuttle.standBy) {

          shuttle.continue();

        }

        this.loading = true;

      }

    }

  }

}


// KarmaFieldsAlpha.RemoteValue = class {
//
//   getAlias(driver, key) {
//
//     return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "alias", key) || key;
//
//   }
//
//   constructor(context, driver, paramstring, id, key) {
//
//     key = this.getAlias(driver, key);
//
//     this.value = KarmaFieldsAlpha.Store.Delta.get("vars", context, driver, id, key);
//
//     if (this.value) {
//
//       this.modified = true;
//
//     } else {
//
//       this.value = KarmaFieldsAlpha.Store.get("vars", context, driver, id, key);
//
//       if (!content.value) {
//
//         let shuttle = KarmaFieldsAlpha.Store.get("shuttles", context, driver, paramstring);
//
//         if (!shuttle) {
//
//           shuttle = new KarmaFieldsAlpha.Shuttle(context, driver, paramstring);
//
//           KarmaFieldsAlpha.Store.set(shuttle, "shuttles", context, driver, paramstring);
//
//         }
//
//         if (!shuttle.queried) {
//
//           shuttle.ids.add(id);
//           shuttle.keys.add(key);
//
//         }
//
//         if (shuttle.complete) {
//
//           this.value = [];
//           this.notFound = true;
//
//         } else {
//
//           if (shuttle.standBy) {
//
//             shuttle.continue();
//
//           }
//
//         }
//
//       }
//
//     }
//
//   }
//
// }


KarmaFieldsAlpha.Addition = class {





}
