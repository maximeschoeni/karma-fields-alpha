
KarmaFieldsAlpha.Driver = class {

  static getAlias(driver, key) {

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "alias", key) || key;

  }


  static getRelations(driver) {

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "relations");

  }

}



KarmaFieldsAlpha.Shuttle = class {

  constructor(context, driver, paramstring) {

    this.context = context;
    this.driver = driver;
    this.paramstring = paramstring;

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

      this.init();

    }

    this.ids.add(id);
    this.keys.add(key);

  }

  // async *work() {
  //
  //   const result = await this.road.next();
  //
  //   if (result.done) {
  //
  //     this.complete = true;
  //
  //   }
  //
  //   this.standBy = true;
  //
  // }

  continue() {

    if (!this.standBy) {

      this.standBy = false;

      // KarmaFieldsAlpha.Works.add(this.work());

      KarmaFieldsAlpha.Jobs.add(async () => {

        const result = await this.road.next();

        if (result.done) {

          this.complete = true;

        }

        this.standBy = true;

      });

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

          }

        }

      }

    }

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

          }

        }

      }

    }


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

  async create(params) {

    let id = await KarmaFieldsAlpha.HTTP.post(`add/${this.driver}`, params);

    id = id.toString();

    const items = KarmaFieldsAlpha.Store.State.get("items", this.driver, this.paramstring);

    const item = this.toArray().find(item => item[state]);

    if (item) {

      delete item[state];

      for (let key in item) {

        KarmaFieldsAlpha.Store.Delta.set(item[key], "vars", "remote", this.driver, id, key);

        delete item[key];

      }

      item.id = id;

    }

    KarmaFieldsAlpha.Store.State.set(items, "items", this.driver, this.paramstring);

    KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, id, "trash");
    KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, id, "trash");

    // not necessarily needed
    // this.init(); // init shuttle -> force reload query

  }

  async upload(file, params) {

    let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params are not going anywhere!

    id = id.toString();

    if (params) {

      await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}`, {[id]: params});

    }

    const items = KarmaFieldsAlpha.Store.State.get("items", this.driver, this.paramstring);

    const item = this.toArray().find(item => item.uploading);

    if (item) {

      delete item[state];

      for (let key in item) {

        KarmaFieldsAlpha.Store.Delta.set(item[key], "vars", "remote", this.driver, id, key);

        delete item[key];

      }

      item.id = id;

    }

    KarmaFieldsAlpha.Store.State.set(items, "items", this.driver, this.paramstring);

    KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, id, "trash");
    KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, id, "trash");

    this.init(); // init shuttle -> force reload query

  }

}


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

  getAt(index, key) {

    if (this.loading) {

      content.loading = true;

    } else {

      const items = itemsQuery.toArray();

      if (!items[index]) {

        content.notFound = true; // setting loading true cause infinite loops!

      } else if (items[index].id) { // -> fetch value

        content = this.queryValue(items[index].id, key);

      } else { // -> fetch into temp to see if there's any value yet

        key = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);

        content.value = items[index][key];

      }

    }

    return content;
  }


  add(params, index, num = 1) {

    if (this.loading) {

      return false;

    }

    // -> reformat params
    params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));

    this.value = [...this.toArray()];

    const items = [];

    for (let i = 0; i < num; i++) {

      items.push({...params, adding: true});

      KarmaFieldsAlpha.Jobs.add(() => shuttle.create(params));

    }

    this.value.splice(index, 0, ...items);

    // KarmaFieldsAlpha.Works.add(this.create(params, "adding", num));

    KarmaFieldsAlpha.Store.State.set(this.value, "items", this.driver, this.paramstring);

    let count = KarmaFieldsAlpha.Store.State.get("count", this.driver, this.paramstring) || 0;

    count += num;

    KarmaFieldsAlpha.Store.State.set(count, "count", this.driver, this.paramstring);

  }

  remove(index, length) {

    if (!this.loading) {

      this.value = [...this.toArray()];

      const removedItems = this.value.splice(index, length);

      for (let item of removedItems) {

        if (item.id) {

          KarmaFieldsAlpha.Store.set(["0"], "vars", "remote", this.driver, item.id, "trash");
          KarmaFieldsAlpha.Store.Delta.set(["1"], "vars", "remote", this.driver, item.id, "trash");

        }

      }

      KarmaFieldsAlpha.Store.State.set(this.value, "items", this.driver, this.paramstring);


      let count = KarmaFieldsAlpha.Store.State.get("count", this.driver, this.paramstring) || 0;

      count -= length;

      KarmaFieldsAlpha.Store.State.set(count, "count", this.driver, this.paramstring);

    }

  }

  // async *create(params, state, num) {
  //
  //   for (let i = 0; i < num; i++) {
  //
  //     let id = await KarmaFieldsAlpha.HTTP.post(`add/${this.driver}`, params);
  //
  //     id = id.toString();
  //
  //     const items = KarmaFieldsAlpha.Store.State.get("items", this.driver, this.paramstring);
  //
  //     const item = this.toArray().find(item => item[state]);
  //
  //     if (item) {
  //
  //       delete item[state];
  //
  //       for (let key in item) {
  //
  //         KarmaFieldsAlpha.Store.Delta.set(item[key], "vars", "remote", this.driver, id, key);
  //
  //         delete item[key];
  //
  //       }
  //
  //       item.id = id;
  //
  //     }
  //
  //     KarmaFieldsAlpha.Store.State.set(items, "items", this.driver, this.paramstring);
  //
  //     KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, id, "trash");
  //     KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, id, "trash");
  //
  //   }
  //
  // }

  upload(files, params, index) {

    if (!this.loading) {

      // // -> reformat params
      // params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));
      //
      // for (let i = 0; i < files.length; i++) {
      //
      //   this.splice(index, 0, {...params, uploading: true, filetype: "file"});
      //
      //   // const task = new KarmaFieldsAlpha.Task.Upload(this.driver, this.paramstring, files[i], params); // params are not going to be sent along to upload request !
      //   //
      //   // KarmaFieldsAlpha.Task.add(task);
      //
      // }

      const shuttle = KarmaFieldsAlpha.Store.get("shuttles", "remote", driver, paramstring);

      // -> reformat params
      params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));

      this.value = [...this.toArray()];

      const items = [];

      for (let file of files) {

        items.push({...params, uploading: true, filetype: "file"});

        KarmaFieldsAlpha.Jobs.add(() => shuttle.upload(file, params));

      }

      this.value.splice(index, 0, ...items);

      // KarmaFieldsAlpha.Works.add(this.create(params, "adding", num));


      KarmaFieldsAlpha.Store.State.set(this.value, "items", this.driver, this.paramstring);

      let count = KarmaFieldsAlpha.Store.State.get("count", this.driver, this.paramstring) || 0;

      count += num;

      KarmaFieldsAlpha.Store.State.set(count, "count", this.driver, this.paramstring);

    }




  }

  // async *uploadWork(files, params) {
  //
  //   const shuttle = KarmaFieldsAlpha.Store.get("shuttles", context, driver, paramstring);
  //
  //   // const ids = [];
  //
  //   for (let file of files) {
  //
  //     let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params are not going anywhere!
  //
  //     id = id.toString();
  //
  //     // ids.push(id);
  //
  //     if (params) {
  //
  //       await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}`, {[id]: this.params});
  //
  //     }
  //
  //     const items = KarmaFieldsAlpha.Store.State.get("items", this.driver, this.paramstring);
  //
  //     const item = this.toArray().find(item => item.uploading);
  //
  //     if (item) {
  //
  //       delete item[state];
  //
  //       for (let key in item) {
  //
  //         KarmaFieldsAlpha.Store.Delta.set(item[key], "vars", "remote", this.driver, id, key);
  //
  //         delete item[key];
  //
  //       }
  //
  //       item.id = id;
  //
  //     }
  //
  //     KarmaFieldsAlpha.Store.State.set(items, "items", this.driver, this.paramstring);
  //
  //     KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, id, "trash");
  //     KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, id, "trash");
  //
  //
  //     // new KarmaFieldsAlpha.Set(this.driver, `ids=${ids.join(",")}`);
  //
  //     shuttle.init();
  //
  //   }





    // let shuttle = new KarmaFieldsAlpha.Shuttle("remote", this.driver, `ids=${ids.join(",")}`);



  // }

  //
  //
  // upload(file, params) {
  //
  // //   super(driver, paramstring, params);
  // //
  // //   this.type = "upload";
  // //   this.file = file;
  // //
  // // }
  // //
  // //
  // //
  // // async resolve() {
  //
  //   let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params are not going anywhere!
  //
  //   id = id.toString();
  //
  //   if (this.params) {
  //
  //     await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}`, {[id]: this.params});
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.remove("relations", "remote", this.driver, this.paramstring);
  //
  //
  //
  //   if (this.paramstring === undefined) {
  //
  //     this.paramstring = `ids=${id}`;
  //
  //   }
  //
  //   this.create(id, "uploading");
  //
  // }
  //

  // isModified(value, id, key) {
  //
  //   let current = KarmaFieldsAlpha.Store.get("vars", "remote", this.driver, id, key);
  //
  //   return !KarmaFieldsAlpha.DeepObject.equal(value, current);
  //
  // }
  //
  // getDelta() {
  //
  //   const output = {};
  //   const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver);
  //
  //   if (delta) {
  //
  //     for (let id in delta) {
  //
  //       for (let key in delta[id]) {
  //
  //         if (this.isModified(delta[id][key], id, key)) {
  //
  //           KarmaFieldsAlpha.DeepObject.set(output, delta[id][key], this.driver, id, key);
  //
  //         }
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   return output;
  //
  // }
  //
  // async update() {
  //
  //   const delta = this.getDelta();
  //
  //   await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, delta);
  //
  //   // await this.cleanDriver(driver, delta[driver]);
  //
  //   for (let id in delta) {
  //
  //     for (let key in delta[id]) {
  //
  //       KarmaFieldsAlpha.Store.set(delta[id][key], "vars", "remote", this.driver, id, key);
  //
  //     }
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.Buffer.remove("state", "delta", "vars", "remote", this.driver); // do not update history !
  //
  //   const items = KarmaFieldsAlpha.Store.State.get("items", this.driver)
  //
  //   KarmaFieldsAlpha.Store.set(items, "items", driver);
  //
  //   KarmaFieldsAlpha.Store.State.remove("items", driver);
  //
  //   KarmaFieldsAlpha.Store.remove("relations", "remote", driver);
  //
  //   // KarmaFieldsAlpha.Store.Delta.remove("items", "remote", driver); // update history ?
  //
  //   await KarmaFieldsAlpha.Database.Queries.removeDriver(driver);
  //
  //
  // }

}

KarmaFieldsAlpha.Set.Item = class {

  constructor(set, index, key) {

    if (set.loading) {

      this.loading = true;

    } else {

      const items = set.toArray();

      if (items[index]) {

        key = KarmaFieldsAlpha.Driver.getAlias(set.driver, key);

        if (items[index][key] !== undefined) {

          this.modified = true;

          this.value = items[index][key];

        } else if (items[index].id) {

          const id = items[index].id;

          this.value = KarmaFieldsAlpha.Store.Delta.get("vars", set.driver, id, key);

          if (this.value) {

            let current = KarmaFieldsAlpha.Store.get("vars", "remote", set.driver, id, key);

            this.modified = !current || !KarmaFieldsAlpha.DeepObject.equal(this.value, current);

          } else {

            this.query("remote", set.driver, set.paramstring, id, key);

            if (this.loading) {

              this.query("cache", set.driver, set.paramstring, id, key);

            } else if (this.notFound) {

              KarmaFieldsAlpha.Store.Delta.set(this.value, "vars", "remote", set.driver, id, key);

            }

          }

        }

      } else {

        this.notFound = true; // setting loading true cause infinite loops!

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

      shuttle.add(id, key);

      // shuttle.ids.add(id);
      // shuttle.keys.add(key);

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

KarmaFieldsAlpha.Value = class {

  constructor(driver, paramstring, id, key) {

    key = KarmaFieldsAlpha.Driver.getAlias(driver, key);

    this.value = KarmaFieldsAlpha.Store.Delta.get("vars", driver, id, key);

    if (this.value) {

      let current = KarmaFieldsAlpha.Store.get("vars", context, driver, id, key);

      this.modified = !current || !KarmaFieldsAlpha.DeepObject.equal(this.value, current);

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

      shuttle.add(id, key);

      // shuttle.ids.add(id);
      // shuttle.keys.add(key);

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

  setValueAt(content, index, key) {

    const query = this.queryItems();

    if (query.loading) {

      console.warn("setting content while query not loaded!", content, index, key);

    } else {

        const items = query.toArray();

        if (!items[index]) {

          items[index] = {};

          this.setItems(items);

        }

        if (items[index]) {

          if (items[index].id) {

            this.setValue(content, items[index].id, key);

          } else {

            key = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);

            items[index][key] = content.toArray();

          }

        } else {

          console.error("Index out of bound", index, key, content.value);

        }

    }

  }

}

KarmaFieldsAlpha.Updater = class {

  // isModified(value, driver, id, key) {
  //
  //   let current = KarmaFieldsAlpha.Store.get("vars", "remote", driver, id, key);
  //
  //   return !KarmaFieldsAlpha.DeepObject.equal(value, current);
  //
  // }


  constructor() {


  }

  getDelta() {

    const output = {};
    const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");

    if (delta) {

      for (let driver in delta) {

        for (let id in delta[driver]) {

          for (let key in delta[driver][id]) {

            const value = new KarmaFieldsAlpha.Value(driver, id, key);

            if (value.modified) {

              KarmaFieldsAlpha.DeepObject.set(output, value, driver, id, key);

            }

          }

        }

      }

    }

    return output;

  }

  async update() {

    const delta = this.getDelta();

    await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, delta);

    // await this.cleanDriver(driver, delta[driver]);

    for (let id in delta) {

      for (let key in delta[id]) {

        KarmaFieldsAlpha.Store.set(delta[id][key], "vars", "remote", this.driver, id, key);

      }

    }

    KarmaFieldsAlpha.Store.Buffer.remove("state", "delta", "vars", "remote", this.driver); // do not update history !

    const items = KarmaFieldsAlpha.Store.State.get("items", this.driver)

    KarmaFieldsAlpha.Store.set(items, "items", driver);

    KarmaFieldsAlpha.Store.State.remove("items", driver);

    KarmaFieldsAlpha.Store.remove("relations", "remote", driver);

    // KarmaFieldsAlpha.Store.Delta.remove("items", "remote", driver); // update history ?

    await KarmaFieldsAlpha.Database.Queries.removeDriver(driver);


  }

}
