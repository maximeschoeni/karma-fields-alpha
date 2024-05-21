KarmaFieldsAlpha.Model = class {

  constructor(driver) {

    this.driver = driver;

  }

  queryValue(id, key) {

    const content = new KarmaFieldsAlpha.Content();

    key = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);

    content.value = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver, id, key);

    if (content.value) {

      content.modified = true;

    } else {

      content.value = KarmaFieldsAlpha.Store.get("vars", "remote", this.driver, id, key);

      if (!content.value) { // -> create a task to fetch it

        let task = KarmaFieldsAlpha.Task.QueryValue.find(this.driver, this.paramstring, id);

        if (!task) {

          // console.log(this.driver, this.paramstring, id, key);

          task = KarmaFieldsAlpha.Task.QueryValue.create(this.driver, this.paramstring);

        }

        task.ids.add(id);
        task.keys.add(key);

        content.value = KarmaFieldsAlpha.Store.get("vars", "cache", this.driver, id, key);

        if (content.value) {

          content.cache = true;

        } else {

          let task = KarmaFieldsAlpha.Task.QueryValueCache.find(this.driver, this.paramstring, id);

          if (!task) {

            task = KarmaFieldsAlpha.Task.QueryValueCache.create(this.driver, this.paramstring);

          }

          task.ids.add(id);
          task.keys.add(key);

          content.loading = true;

        }

      }

    }

    return content;

  }

  setValue(content, id, key) {

    const current = this.queryValue(id, key);

    if (!KarmaFieldsAlpha.DeepObject.equal(current.toArray(), content.toArray())) {

      key = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);

      KarmaFieldsAlpha.Store.Delta.set(content.toArray(), "vars", "remote", this.driver, id, key);

    }

  }

}


KarmaFieldsAlpha.Model.Collection = class extends KarmaFieldsAlpha.Model {

  constructor(driver, paramstring) {

    super(driver);

    this.paramstring = paramstring;

  }

  setParams(params) {

    this.paramstring = KarmaFieldsAlpha.Params.stringify(params);

  }

  query(keys = []) {

    const content = this.queryItems()

    if (!content.loading) {

      for (let key of keys) {

        for (let item of content.value) {

          const value = this.queryValue(item.id, key);

          if (value.loading) {

            content.loading = true;

          } else {

            item[key] = value.value;

          }

        }

      }

    }

    return content;
  }

  // queryItems() {
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //
  //   if (this.loading) {
  //
  //     content.loading = true;
  //
  //   } else {
  //
  //     content.value = KarmaFieldsAlpha.Store.Delta.get("items", "remote", this.driver, this.paramstring);
  //
  //     if (!content.value) {
  //
  //       content.value = KarmaFieldsAlpha.Store.get("items", "remote", this.driver, this.paramstring);
  //
  //       if (!content.value) {
  //
  //         let task = KarmaFieldsAlpha.Task.QueryItems.find(this.driver, this.paramstring);
  //
  //         if (!task) {
  //
  //           task = KarmaFieldsAlpha.Task.QueryItems.create(this.driver, this.paramstring);
  //
  //         }
  //
  //         content.value = KarmaFieldsAlpha.Store.get("items", "cache", this.driver, this.paramstring);
  //
  //         if (content.value) {
  //
  //           content.cache = true;
  //
  //         } else {
  //
  //           let task = KarmaFieldsAlpha.Task.QueryItemsCache.find(this.driver, this.paramstring);
  //
  //           if (!task) {
  //
  //              task = KarmaFieldsAlpha.Task.QueryItemsCache.create(this.driver, this.paramstring);
  //
  //           }
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

  queryItems() {

    const content = new KarmaFieldsAlpha.Content();

    if (this.loading) {

      content.loading = true;

    } else {

      content.value = KarmaFieldsAlpha.Store.State.get("items", this.driver, this.paramstring);

      if (!content.value) {

        let task = KarmaFieldsAlpha.Task.QueryItems.find(this.driver, this.paramstring);

        if (!task) {

          task = KarmaFieldsAlpha.Task.QueryItems.create(this.driver, this.paramstring);

        }

        content.value = KarmaFieldsAlpha.Store.get("items", this.driver, this.paramstring);

        if (content.value) {

          content.cache = true;

        } else {

          let task = KarmaFieldsAlpha.Task.QueryItemsCache.find(this.driver, this.paramstring);

          if (!task) {

             task = KarmaFieldsAlpha.Task.QueryItemsCache.create(this.driver, this.paramstring);

          }

          content.loading = true;

        }

      }

    }

    return content;

  }

  // queryItems() {
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //
  //   if (this.loading) {
  //
  //     content.loading = true;
  //
  //   } else {
  //
  //     content.value = KarmaFieldsAlpha.Store.State.get("items", this.driver, this.paramstring);
  //
  //     if (!content.value) {
  //
  //       let remoteTask = KarmaFieldsAlpha.Task.QueryItems.find(this.driver, this.paramstring);
  //
  //       if (!remoteTask) {
  //
  //         remoteTask = KarmaFieldsAlpha.Task.QueryItems.create(this.driver, this.paramstring);
  //
  //       }
  //
  //       let cacheTask = KarmaFieldsAlpha.Task.QueryItemsCache.find(this.driver, this.paramstring);
  //
  //       if (!cacheTask) {
  //
  //          cacheTask = KarmaFieldsAlpha.Task.QueryItemsCache.create(this.driver, this.paramstring);
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

  queryValueAt(index, key) {

    let content = new KarmaFieldsAlpha.Content();

    const itemsQuery = this.queryItems();

    if (itemsQuery.loading) {

      content.loading = true;

    } else {

      const items = itemsQuery.toArray();

      if (!items[index]) {

        // content.outOfBounds = true;
        //
        // content.loading = itemsQuery.cache;

        // content.loading = true;

        content.notFound = true; // setting loading true cause infinite loops!

        // if (!itemsQuery.cache) {
        //
        //   console.warn("Out of bounds", this.driver, this.paramstring, index, key);
        //
        // }

      // } else if (key === "id") { // id
      //
      //   content.value = items[index].id;

      // } else if (items[index].delta && items[index].delta[key]) { // item was modified
      //
      //   content.value = items[index].delta[key];
      //   content.modified = true;

      } else if (items[index].id) { // -> fetch value

        content = this.queryValue(items[index].id, key);

        // Object.assign(this, valueQuery);

      } else { // -> fetch into temp to see if there's any value yet

        key = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);

        content.value = items[index][key];

        // content.value = KarmaFieldsAlpha.Store.get("lobby", this.driver, this.paramstring, index, key);

      }

    }

    return content;
  }

  setValueAt(content, index, key) {

    const query = this.queryItems();

    if (query.loading) {

      console.warn("setting content while query not loaded!", content, index, key);

    } else {



      // const current = this.queryValueAt(index, key);

      // if (!KarmaFieldsAlpha.DeepObject.equal(current.toArray(), content.toArray())) {

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

            // const lobby = KarmaFieldsAlpha.Store.get("lobby", this.driver, this.paramstring) || [];
            //
            // KarmaFieldsAlpha.DeepObject.set(lobby, content.toArray(), index, key);
            //
            // KarmaFieldsAlpha.Store.set(lobby, "lobby", this.driver, this.paramstring);

            // KarmaFieldsAlpha.Store.set(content.toArray(), "lobby", this.driver, this.paramstring, index, key);

          }

        } else {

          // let item = {[key]: content.toArray()};

          // items[index] = {[key]: content.toArray()};



          console.error("Index out of bound", index, key, content.value);

        }

      // }


      // const items = query.toArray();
      //
      // if (items[index]) {
      //
      //
      //
      //   if (!KarmaFieldsAlpha.DeepObject.equal(current.toArray(), content.toArray())) {
      //
      //     const newItems = [...items];
      //
      //     newItems[index].delta = {...items[index].delta, [key]: content.toArray()};
      //
      //     this.setItems(newItems)
      //
      //     KarmaFieldsAlpha.Store.Delta.set(newItems, "items", "remote", this.driver, this.paramstring);
      //
      //   }
      //
      // } else {
      //
      //   console.error("setValueAt: index out of bounds", content, index, key);
      //
      // }

    }

  }


  setItems(items) {

    // KarmaFieldsAlpha.Store.Delta.set(items, "items", "remote", this.driver, this.paramstring);
    KarmaFieldsAlpha.Store.State.set(items, "items", this.driver, this.paramstring);

  }

  setCount(count) {

    KarmaFieldsAlpha.Store.State.set(count, "count", this.driver, this.paramstring);

  }

  splice(index, length, ...items) {

    let splicedItems;

    const query = this.queryItems();

    if (!query.loading) {

      const newItems = [...query.toArray()];

      splicedItems = newItems.splice(index, length, ...items);

      this.setItems(newItems);

      let count = KarmaFieldsAlpha.Store.State.get("count", this.driver, this.paramstring) || 0;

      count += items.length - length;

      KarmaFieldsAlpha.Store.State.set(count, "count", this.driver, this.paramstring);

    } else {

      splicedItems = [];

    }

    return splicedItems;
  }

  add(params, index, num = 1) {

    // const query = this.queryItems();
    //
    // if (!query.loading) {

      // -> reformat params
      params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));

      // const items = query.toArray();

      for (let i = 0; i < num; i++) {

        this.splice(index, 0, {...params, adding: true});

        const task = new KarmaFieldsAlpha.Task.Add(this.driver, this.paramstring, params);

        KarmaFieldsAlpha.Task.add(task);

      }

      // this.setItems(items);




      // const newItems = [...query.toArray()];
      //
      // const temps = KarmaFieldsAlpha.Store.get("temp", this.driver, this.paramstring) || [];
      //
      // temps.length = newItems.length;
      //
      // for (let i = 0; i < num; i++) {
      //
      //   newItems.splice(index, 0, {adding: true});
      //
      //   temps.splice(index, 0, params);
      //
      //   const task = new KarmaFieldsAlpha.Task.Add(this.driver, this.paramstring, params);
      //
      //   KarmaFieldsAlpha.Task.add(task);
      //
      // }
      //
      // KarmaFieldsAlpha.Store.Delta.set(newItems, "items", "remote", this.driver, this.paramstring);
      //
      // KarmaFieldsAlpha.Store.set(temps, "temp", this.driver, this.paramstring);

    // }

  }

  remove(index, length) {

    const query = this.queryItems();

    if (!query.loading) {

      // const newItems = [...query.toArray()];
      //
      // for (let i = 0; i < length; i++) {
      //
      //   const item = newItems[index + i];
      //
      //   if (item && item.id) {
      //
      //     KarmaFieldsAlpha.Store.set(["0"], "vars", "remote", this.driver, item.id, "trash");
      //     KarmaFieldsAlpha.Store.Delta.set(["1"], "vars", "remote", this.driver, item.id, "trash");
      //
      //   }
      //
      // }

      const items = this.splice(index, length);

      for (let item of items) {

        if (item.id) {

          KarmaFieldsAlpha.Store.set(["0"], "vars", "remote", this.driver, item.id, "trash");
          KarmaFieldsAlpha.Store.Delta.set(["1"], "vars", "remote", this.driver, item.id, "trash");

        }

      }






      // const temps = KarmaFieldsAlpha.Store.get("temp", this.driver, this.paramstring) || [];
      //
      // temps.length = newItems.length;
      //
      // newItems.splice(index, length);
      //
      // KarmaFieldsAlpha.Store.Delta.set(newItems, "items", "remote", this.driver, this.paramstring);
      //
      // temps.splice(index, length);
      //
      // KarmaFieldsAlpha.Store.set(temps, "temp", this.driver, this.paramstring);

    }

  }



  // upload(files, params, index) {
  //
  //   // const delta = {};
  //   //
  //   // for (let key in item) {
  //   //
  //   //   delta[key] = new KarmaFieldsAlpha.Content(item[key]).toArray();
  //   //
  //   // }
  //
  //   // -> reformat params
  //   params = Object.fromEntries(Object.entries(params).map(([key, value]) => [key, new KarmaFieldsAlpha.Content(item[key]).toArray()]));
  //
  //   const query = this.queryItems();
  //
  //   if (!query.loading) {
  //
  //     const itemsBefore = [];
  //     const itemsAfter = [];
  //
  //     for (let i = 0; i < files.length; i++) {
  //
  //       itemsBefore.push({delta: {trash: ["1"]}});
  //       itemsAfter.push({uploading: true, delta: {trash: ["0"]}});
  //
  //       let task = new KarmaFieldsAlpha.Task.Upload(this.driver, this.paramstring, files[i], params);
  //
  //       KarmaFieldsAlpha.Task.add(task);
  //
  //     }
  //
  //     // let clones = [...query.toArray()];
  //     //
  //     // clones.splice(index, 0, ...itemsBefore);
  //
  //     const backupItems = KarmaFieldsAlpha.Array.concat(query.toArray(), index, ...itemsBefore);
  //     const deltaItems = KarmaFieldsAlpha.Array.concat(query.toArray(), index, ...itemsAfter);
  //
  //     KarmaFieldsAlpha.Store.Delta.backup(backupItems, "items", "remote", this.driver, this.paramstring); // set delta without saving history
  //
  //
  //
  //
  //     // clones = [...clones];
  //     //
  //     // clones.splice(index, itemsAfter.length, ...itemsAfter);
  //
  //     KarmaFieldsAlpha.Store.Delta.set(deltaItems, "items", "remote", this.driver, this.paramstring); // set delta without saving history
  //
  //   }
  //
  // }


  upload(files, params, index) {

    // const query = this.queryItems();
    //
    // if (!query.loading) {

      // -> reformat params
      params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));

      for (let i = 0; i < files.length; i++) {

        this.splice(index, 0, {...params, uploading: true, filetype: "file"});

        const task = new KarmaFieldsAlpha.Task.Upload(this.driver, this.paramstring, files[i], params); // params are not going to be sent along to upload request !

        KarmaFieldsAlpha.Task.add(task);

      }

      // const items = query.toArray();
      //
      // for (let i = 0; i < num; i++) {
      //
      //   if (pileUp) {
      //
      //     items.unshift({adding: true});
      //
      //   } else {
      //
      //     items.push({adding: true});
      //
      //   }
      //
      //   const task = new KarmaFieldsAlpha.Task.Add(this.driver, this.paramstring, params);
      //
      //   KarmaFieldsAlpha.Task.add(task);
      //
      // }
      //
      // this.setItems(items);

      // const newItems = [...query.toArray()];
      //
      // const temps = KarmaFieldsAlpha.Store.get("temp", this.driver, this.paramstring) || [];
      //
      // temps.length = newItems.length;
      //
      // for (let i = 0; i < files.length; i++) {
      //
      //   newItems.splice(index, 0, {uploading: true});
      //
      //   temps.splice(index, 0, params);
      //
      //   let task = new KarmaFieldsAlpha.Task.Upload(this.driver, this.paramstring, files[i], params);
      //
      //   KarmaFieldsAlpha.Task.add(task);
      //
      // }
      //
      // KarmaFieldsAlpha.Store.Delta.set(newItems, "items", "remote", this.driver, this.paramstring);
      //
      // KarmaFieldsAlpha.Store.set(temps, "temp", this.driver, this.paramstring);

    // }


  }

  count() {

    const content = new KarmaFieldsAlpha.Content();

    if (this.loading) {

      content.loading = true;

    } else {

      content.value = KarmaFieldsAlpha.Store.State.get("count", this.driver, this.paramstring);

      if (content.value === undefined) { // may be 0

        content.loading = true;

        let task = KarmaFieldsAlpha.Task.find(task => task.driver === this.driver && task.paramstring === this.paramstring);

        if (!task) {

          task = new KarmaFieldsAlpha.Task.Count(this.driver, this.paramstring);

          KarmaFieldsAlpha.Task.add(task);

        }

      }

    }

    return content;

  }

}
