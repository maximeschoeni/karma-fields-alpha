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

        let task = KarmaFieldsAlpha.Task.QueryValue.find(this.driver, this.paramstring);

        if (!task) {

          task = KarmaFieldsAlpha.Task.QueryValue.create(this.driver, this.paramstring);

        }

        task.ids.add(id);
        task.keys.add(key);

        content.value = KarmaFieldsAlpha.Store.get("vars", "cache", this.driver, id, key);

        if (content.value) {

          content.cache = true;

        } else {

          let task = KarmaFieldsAlpha.Task.QueryValueCache.find(this.driver, this.paramstring);

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

  queryItems() {

    const content = new KarmaFieldsAlpha.Content();

    if (this.loading) {

      content.loading = true;

    } else {

      // content.value = KarmaFieldsAlpha.Store.Delta.get("items", "remote", this.driver, this.paramstring);
      //
      // if (!content.value) {

        content.value = KarmaFieldsAlpha.Store.get("items", "remote", this.driver, this.paramstring);

        if (!content.value) {

          let task = KarmaFieldsAlpha.Task.QueryItems.find(this.driver, this.paramstring);

          if (!task) {

            task = KarmaFieldsAlpha.Task.QueryItems.create(this.driver, this.paramstring);

          }

          content.value = KarmaFieldsAlpha.Store.get("items", "cache", this.driver, this.paramstring);

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

      // }

    }

    return content;

  }

  queryValueAt(index, key) {

    let content = new KarmaFieldsAlpha.Content();

    const itemsQuery = this.queryItems();

    if (itemsQuery.loading) {

      content.loading = true;

    } else {

      const items = itemsQuery.toArray();

      if (!items[index]) {

        content.outOfBounds = true;

        content.loading = itemsQuery.cache;

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

        // content.value = KarmaFieldsAlpha.Store.get("temp", this.driver, this.paramstring, index, key);

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

        if (items[index] && items[index].id) {

          if (items[index].id) {

            this.setValue(content, items[index].id, key);

          } else {

            key = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);

            items[index][key] = content.toArray();

            // const temps = KarmaFieldsAlpha.Store.get("temp", this.driver, this.paramstring) || [];
            //
            // KarmaFieldsAlpha.DeepObject.set(temps, content.toArray(), index, key);
            //
            // // temps[index] = content.toArray();
            //
            // KarmaFieldsAlpha.Store.set(temps, "temp", this.driver, this.paramstring);

          }

        } else {

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

    KarmaFieldsAlpha.Store.set(items, "items", "remote", this.driver, this.paramstring);

  }

  insert(item, up = false) {

    const query = this.queryItems();

    if (!query.loading) {

      const items = query.toArray();

      if (up) {

        items.unshift(item);

      } else {

        items.push(item);

      }

      this.setItems(items);

    }

  }

  add(params = {}, num = 1, up = false) {

    // const query = this.queryItems();
    //
    // if (!query.loading) {

      // -> reformat params
      params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));

      // const items = query.toArray();

      for (let i = 0; i < num; i++) {

        this.insert({adding: true}, up);

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

      const newItems = [...query.toArray()];

      for (let i = 0; i < length; i++) {

        const item = newItems[index + i];

        if (item && item.id) {

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

    const query = this.queryItems();

    if (!query.loading) {

      // -> reformat params
      params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));

      const items = query.toArray();

      for (let i = 0; i < num; i++) {

        if (pileUp) {

          items.unshift({adding: true});

        } else {

          items.push({adding: true});

        }

        const task = new KarmaFieldsAlpha.Task.Add(this.driver, this.paramstring, params);

        KarmaFieldsAlpha.Task.add(task);

      }

      this.setItems(items);

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

    }


  }



}
