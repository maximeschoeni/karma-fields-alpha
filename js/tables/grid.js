
KarmaFieldsAlpha.field.grid = class extends KarmaFieldsAlpha.field {


  constructor(resource) {

    super(resource);

    // this.query = this.queryItems();


  }


  getDriver() {

    if (!this.resource.driver) {

      console.error("Driver not set");

    }

    return this.resource.driver;

  }

  getQuery() {

    // return this.query;

    return this.queryItems();

  }

  queryItems() {

    const params = this.getParams();
    const driver = this.getDriver();

    // console.log(driver, params);

    const query = new KarmaFieldsAlpha.Content();

    // query.driver = driver;

    if (params.loading) {

      query.loading = true;

    } else {

      const paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());

      return KarmaFieldsAlpha.Driver.getQuery(driver, paramstring);

      // query.paramstring = paramstring;
      //
      // query.value = KarmaFieldsAlpha.Store.Delta.get("items", driver, paramstring);
      //
      // if (query.value) {
      //
      //   query.modified = true;
      //
      // } else {
      //
      //   query.value = KarmaFieldsAlpha.Store.get("items", driver, paramstring);
      //
      //   if (!query.value) {
      //
      //     query.loading = true;
      //
      //
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
      //           const items = await KarmaFieldsAlpha.Driver.getItems(driver, paramstring);
      //           KarmaFieldsAlpha.Store.set(items, "items", driver, paramstring);
      //         }
      //       });
      //
      //     }
      //
      //   }
      //
      // }

    }

    return query;

  }

  getContent(index, key) {

    // const driver = this.getDriver();
    // const query = this.getItems();
    // const items = query.toArray();

    const content = new KarmaFieldsAlpha.Content();

    debugger;
    const query = this.getQuery();

    if (query.loading) {

      // return  new KarmaFieldsAlpha.Content.Request();

      content.loading = true;

    } else if (index === "modal" || index === "*") {



      const selection = this.getSelection();
      const index = selection.index || 0;
      const length = selection.length || 0;

      if (length > 1) {

        const slice = query.toArray().slice(index, index + length);
        const contents = slice.map((item, i) => this.getContent(index + i, key));
        // const content = new KarmaFieldsAlpha.Content();

        if (contents.some(content => content.loading)) {

          content.loading = true;

        } else if (contents.some((content, index, array) => index > 0 && !content.equals(array[0]))) {

          content.mixed = true;

          // content.value = contents.map(content => content.value);

        } else {

          content.value = contents[0].toArray();

        }

        // return content;

      } else if (length === 1) {

        return this.getContent(index, key);

      }

    } else {

      key = KarmaFieldsAlpha.Driver.getAlias(query.driver, key);

      const items = query.toArray();

      if (!items[index]) {

        content.outOfBounds = true;

      } else if (key === "id" && items[index].id) { // id or name

        content.value = items[index].id;

      } else if (items[index].delta && items[index].delta[key]) { // id or name

        content.value = items[index].delta[key];

        content.modified = true;

      } else if (items[index].id) {

        // const value = new KarmaFieldsAlpha.Content.Value(query.driver, items[index].id, key);
        //
        // return value;

        return KarmaFieldsAlpha.Driver.getValue(query.driver, items[index].id, key);

      } else {

        content.loading = true;

        console.warn("getting value from item without index", index, key);

      }

    }

    return content;

  }

  setContent(content, index, key) {

    // const driver = this.getDriver(key);
    const query = this.getQuery();
    // const items = query.toArray();

    if (query.loading) {

      console.error("setting content while query not loaded!");

    } else {

      if (index === "modal" || index === "*") {

        const selection = this.getSelection();
        const index = selection.index || 0;
        const length = selection.length || 0;

        for (let i = 0; i < length; i++) {

          this.setContent(content, index + i, key);

        }

      } else {

        key = KarmaFieldsAlpha.Driver.getAlias(query.driver, key);

        const items = query.toArray();

        if (items[index]) {

          const newItems = [...items];

          newItems[index] = {...items[index], [key]: content.toArray()};

          newItems[index].delta = {...items[index].delta, [key]: content.toArray()};

          KarmaFieldsAlpha.Store.Delta.set(newItems, "items", query.driver, query.paramstring);

        } else {

          console.error("index out of bounds", index, key);

        }

      }

    }

  }

  // removeContent(id, key) {
  //
  //   const driver = this.getDriver();
  //
  //   key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
  //
  //   KarmaFieldsAlpha.Store.Delta.remove("vars", driver, id, key);
  //
  // }

  getParams() {

    const params = KarmaFieldsAlpha.Store.Layer.getCurrent("params");

    return new KarmaFieldsAlpha.Content(params);

  }

  getParam(key) {

    return KarmaFieldsAlpha.Store.Layer.getParam(key);

  }

  setParam(value, key) {

    KarmaFieldsAlpha.Store.Layer.setParam(value, key);

    this.request("render");

  }

  getFilters() {

    let params = this.getParams();

    if (!params.loading) {

      const {page, ppp, order, orderby, ...filters} = params.value || {};

      params.value = filters;

    }

    return params;
  }

  getCount() {

    const driver = this.getDriver();

    const params = this.getFilters();

    if (!params.loading) {

      return new KarmaFieldsAlpha.Content.Count(driver, params.toObject());

    } else {

      return new KarmaFieldsAlpha.Content.Request();

    }

  }

  getPage() {

    const page = this.getParam("page");

    return Number(page || 1);

  }

  getPpp() {

    const ppp = this.getParam("ppp");

    return Number(ppp || 100);
  }

  getOrder() {

    return this.getParam("order");

  }

  getOrderby() {

    return this.getParam("orderby");

  }

  toggleOrder(key, order) {

    let orderby = this.getOrderby();

    if (orderby === key) {

      order = (this.getOrder() || order || "asc") === "asc" ? "desc" : "asc";
      this.setParam(order, "order");
      this.render();

    } else {

      this.setParam(order || "asc", "order");
      this.setParam(key, "orderby");
      this.render();

    }

  }

  getNumPage() {

    const countQuery = this.getCount();
    const content = new KarmaFieldsAlpha.Content();

    if (countQuery.loading) {

      this.loading = true;

    } else {

      const count = countQuery.toNumber();
      const ppp = this.getPpp();
      content.value = Math.max(1, Math.ceil(count/ppp));

    }

    return content;
  }

  isFirstPage() {

    return new KarmaFieldsAlpha.Content(this.getPage() === 1);

  }

  isLastPage() {

    const numPage = this.getNumPage();
    const content = new KarmaFieldsAlpha.Content();

    if (numPage.loading) {

      content.loading = true;

    } else {

      content.value = this.getPage() === numPage.toNumber()

    }

    return content;

  }

  setPage(page) {

    KarmaFieldsAlpha.History.save("changePage", "Change Page");
    KarmaFieldsAlpha.Store.Layer.setParam(page, "page");

    // KarmaFieldsAlpha.Store.remove("vars");
    // KarmaFieldsAlpha.Store.remove("items");
    // KarmaFieldsAlpha.Store.remove("counts");

    KarmaFieldsAlpha.Store.clear();

    // KarmaFieldsAlpha.Store.Layer.removeItems();

  }

  firstPage() {

    const page = this.getPage();

    if (page > 1) {

      this.setPage(1);

    }

  }

  prevPage() {

    const page = this.getPage();

    if (page > 1) {

      this.setPage(page - 1);

    }

  }

  nextPage() {

    const page = this.getPage();
    const numPage = this.getNumPage().toNumber();

    if (page < numPage) {

      this.setPage(page + 1);

    }

  }

  lastPage() {

    const page = this.getPage();
    const numPage = this.getNumPage().toNumber();

    if (page < numPage) {

      this.setPage(numPage);

    }

  }


  // getIds() {
  //
  //   // const params = this.getParams();
  //   // const driver = this.getDriver();
  //   //
  //   // // return KarmaFieldsAlpha.Query.getIds(driver, params);
  //   //
  //   // return new KarmaFieldsAlpha.Content.Query(driver, params);
  //
  //   // return this.getQuery();
  //
  //
  //   // const items = this.request("getSelectedItems");
  //   // const content = new KarmaFieldsAlpha.Content();
  //   //
  //   // if (items.loading) {
  //   //
  //   //   content.loading = true;
  //   //
  //   // } else {
  //   //
  //   //   content.value = items.toArray().map(item => item.id);
  //   //
  //   // }
  //
  // }

  isCurrentLayer() {

    const currentLayer = KarmaFieldsAlpha.Store.Layer.getCurrent();

    return currentLayer && currentLayer.table === this.parent.id;

  }



  async setQuery(items) {
console.error("deprecated");
    const driver = this.getDriver();
    const params = this.getParams();

    if (!params.loading) {

      const paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());

      KarmaFieldsAlpha.Store.Delta.set(items.toArray(), "items", driver, paramstring);


      await KarmaFieldsAlpha.Database.Queries.remove(driver); // -> actually just need to remove count...

      await KarmaFieldsAlpha.Database.Queries.set(items.toArray(), "query", driver, paramstring);


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

  }


  setItems(items) {

    console.error("deprecated");
    return this.setQuery(items);

  }



  getItems() {

    console.error("deprecated");

    const items = new KarmaFieldsAlpha.Content();
    const query = this.getQuery();

    if (query.loading) {

      items.loading;

    } else {

      items.value = query.toArray().filter(item => !(new KarmaFieldsAlpha.Content(item.trash).toBoolean()));

    }

    return items;
  }


  exportIds(ids) { // used for export button
console.error("deprecated");
    const gridContent = new KarmaFieldsAlpha.Content.Grid();

    const columns = this.getExportableColumns();

    for (let i = 0; i < ids.length; i++) {

      const id = ids[i];

      const rowField = this.createChild({
        type: "row",
        index: i,
        id: id,
        children: columns
      }, i);

      const collection = rowField.export();

      gridContent.add(collection);

    }

    return gridContent;

  }

  getExportableColumns() {

    const mode = this.resource.import || this.resource.export || this.resource.modal && "modal";

    let columns;

    if (mode === "modal") {

      return this.resource.modal.children;

    } else if (mode && Array.isArray(mode)) {

      return mode;

    } else {

      return this.resource.children;

    }

  }

  // export(index = 0, length = 999999) {
  //
  //   const request = this.getSelectedItems();
  //
  //   if (!request.loading) {
  //
  //     const ids = request.toArray().map(item => item.id);
  //
  //     return this.exportIds(ids);
  //
  //   }
  //
  // }

  slice(index = 0, length = 999999) {

    // const request = this.getSelectedItems();
    //
    // if (!request.loading) {
    //
    //   const ids = request.toArray().map(item => item.id);
    //
    //   return this.exportIds(ids);
    //
    // }

    const gridContent = new KarmaFieldsAlpha.Content.Grid();

    // const query = this.getQuery();
    const query = this.getQuery();

    if (query.loading) {

      gridContent.loading = true;

    } else {

      const columns = this.getExportableColumns();

      length = Math.min(length, query.toArray().length);

      for (let i = 0; i < length; i++) {

        const rowField = this.createChild({
          type: "row",
          index: i + index,
          children: columns
        }, i + index);

        const collection = rowField.export();

        if (collection.loading) {

          gridContent.loading = true;

        } else {

          gridContent.value.push(collection.toArray());

        }

      }

    }

    return gridContent;

  }



  importIds(grid, ids) { // deprecated

    console.error("deprecated");
    if (grid.value.length === ids.length) {

      const columns = this.getExportableColumns();

      for (let i = 0; i < grid.value.length; i++) {

        const child = this.createChild({
          children: columns,
          type: "row",
          index: i,
          id: ids[i]
        }, i);

        const content = new KarmaFieldsAlpha.Content.Collection(grid.value[i]);

        child.import(content);

      }

    }

  }

  insert(grid, index, length) {

    const array = grid.toArray();

    if (array.length < length) {

      this.remove(index + array.length, length - array.length);

    } else if (array.length > length) {

      this.addAt(index + length, array.length - length);

    }

    const columns = this.getExportableColumns();


    for (let i = 0; i < array.length; i++) {

      const child = this.createChild({
        children: columns,
        type: "row",
      }, i + index);

      const content = new KarmaFieldsAlpha.Content.Collection(array[i]);

      child.import(content);

    }

  }



  getModal() {

    if (this.getSelection("length") && this.resource.modal) {

      return this.getChild("modal");

    }

  }

  getChild(index) {

    if (index === "modal") {

      return this.createChild({
        ...this.resource.modal,
        type: "modal",
        index: "modal",
      }, "modal");

    } else {

      const query = this.getQuery();
      // const item = !items.loading && items.toArray()[index];

      if (!query.loading && index < query.toArray().length) {

        return this.createChild({
          // id: item.id,
          type: "row",
          children: this.resource.children,
          // loading: item.loading,
          // index: index
        }, index);

      }

    }

  }

  selectAll() {

    const query = this.getQuery();

    if (!query.loading) {

      this.setSelection({
        index: 0,
        length: query.toArray().length
      });

      this.request("render");
    }

  }

  copy() {

    const selection = this.getSelection();
    const index = selection.index || 0;
    const length = selection.length || 0;

    const grid = this.slice(index, length);

    if (grid.loading) {

      return "loading";

    } else {

      return grid.toString();

    }

    // const items = this.getSelectedItems();
    //
    // if (!items.loading) {
    //
    //   const ids = items.toArray().filter(item => item.id && !item.loading).map(item => item.id);
    //
    //   const content = this.exportIds(ids);
    //
    //   if (!content.loading) {
    //
    //     return content.toString();
    //
    //   }
    //
    // }
    //
    // return "loading...";
  }

  paste(value) {

    const grid = new KarmaFieldsAlpha.Content.Grid(value);

    // const items = this.getItems();
    //
    // if (!items.loading) {

      this.save("paste", "Paste");

      const index = this.getSelection("index") || 0;
      const length = this.getSelection("length") || 0;

      this.insert(grid, index, length);

      // const array = grid.toArray();
      //
      // if (array.length < length) {
      //
      //   this.remove(index + array.length, length - array.length);
      //
      // } else if (array.length > length) {
      //
      //   for (let i = 0; i < array.length - length; i++) {
      //
      //     this.add();
      //
      //   }
      //   // KarmaFieldsAlpha.Query.add(this.resource.driver, params, index + length, array.length - length, ...path);
      //
      // }
      //
      // KarmaFieldsAlpha.Store.Tasks.add({
      //   type: "import",
      //   resolve: () => {
      //     const items = this.getItems();
      //     this.setSelection({index: index, length: array.length});
      //     const slice = items.toArray().slice(index, index + array.length);
      //     const ids = slice.filter(item => !item.loading && item.id).map(item => item.id);
      //     this.importIds(grid, ids);
      //   }
      // });

      this.request("render");

    // }


  }

  // add(...path) {
  //
  //   const index = this.selection && this.selection.index || 0;
  //   const length = this.selection && this.selection.length || 0;
  //
  //   // const params = this.parse(this.resource.defaults).toObject();
  //
  //   const {page, ppp, order, orderby, ...params} = KarmaFieldsAlpha.Store.Layer.getParams() || {};
  //
  //   KarmaFieldsAlpha.History.save("insert", "Insert");
  //
  //   KarmaFieldsAlpha.Query.add(this.resource.driver, params, index, 1, ...path);
  //
  //   this.setSelection({index: index + length, length: 1});
  //
  //   this.request("render");
  //
  // }

  // insertItem(newItem, index, ...path) {
  //
  //   const query = this.getQuery();
  //   const newQuery = new KarmaFieldsAlpha.Content();
  //
  //   newQuery.value = [...query.toArray()];
  //
  //   KarmaFieldsAlpha.DeepArray.splice(newQuery.value, 0, [newItem], index, ...path);
  //
  //   this.setQuery(newQuery);
  //
  // }
  //
  // replaceItem(newItem, callback) {
  //
  //   const query = this.getQuery();
  //   const newQuery = new KarmaFieldsAlpha.Content();
  //
  //   newQuery.value = [...query.toArray()];
  //
  //   const index = newQuery.value.findIndex(callback);
  //
  //   if (index > -1) {
  //
  //     KarmaFieldsAlpha.DeepArray.splice(newQuery.value, 0, [newItem], index, ...path);
  //
  //   }
  //
  //
  //
  //   this.setQuery(newQuery);
  //
  // }

  getPosition() {

    if (this.resource.position !== undefined) {

      return this.parse(this.resource.position);

    } else {

      const index = this.getSelection("index") || 0;
      const length = this.getSelection("length") || 0;

      return new KarmaFieldsAlpha.Content(index + length);

    }

  }

  // add(...path) {
  //
  //   const query = this.getItems();
  //
  //   const defaults = this.parse(this.resource.defaults || {});
  //
  //   const filters = this.getFilters();
  //
  //   // const position = this.getPosition();
  //
  //   if (query.loading || defaults.loading || filters.loading) {
  //
  //     this.addTask(async () => this.add(...path), "adding");
  //     return;
  //
  //   }
  //
  //   this.save("insert", "Insert");
  //
  //   let index = this.resource.insertAt;
  //
  //   if (index === undefined) {
  //
  //     index = query.toArray().length;
  //
  //   }
  //
  //   const params = {...filters.toObject(), ...defaults.toObject()};
  //
  //   const token = this.createToken();
  //
  //   const items = [...query.toArray()];
  //
  //   items.splice(index, 0, {token});
  //
  //   KarmaFieldsAlpha.Store.Delta.set(items, "items", this.driver, this.paramstring);
  //
  //
  //
  //   query.add(index, params, token);
  //
  //   const row = this.createChild({
  //     loading: true,
  //     token: token,
  //     type: "row",
  //     children: this.resource.children
  //   }, );
  //
  //   row.create();
  //
  //   this.setSelection({index: index, length: 1});
  //
  //   this.request("render");
  // }

  getDefaultIndex() {

    let index = this.resource.insertAt || this.resource.insertPosition;

    if (index === undefined) {

      const items = this.getQuery();

      index = items.toArray().length;

    }

    return index;
  }

  add(...path) {

    this.save("insert", "Insert");

    let index = this.getDefaultIndex();

    this.addAt(index, 1);

    this.setSelection({index, length: 1});

    this.request("render");
  }


  addAt(index, length = 1) {

    const query = this.getQuery();
    const defaults = this.parse(this.resource.defaults || {});
    const filters = this.getFilters();

    if (query.loading || defaults.loading || filters.loading) {

      // KarmaFieldsAlpha.Store.Tasks.add({
      //   type: "addAt",
      //   resolve: async task => this.addAt(length, position)
      // });

      this.createTask("addAt", length, position);

    } else {

      let items = [...query.toArray()];
      const params = {...filters.toObject(), ...defaults.toObject()};
      const newItems = [];

      for (let i = 0; i < length; i++) {

        newItems.push(params);

      }

      items.splice(index, 0, ...newItems);

      // if (this.resource.insertPosition === "end") {
      //
      //   items = [...query.toArray(), ...newItems];
      //
      //   items.sort((a, b) => new KarmaFieldsAlpha.Content(a.trash).toNumber() - new KarmaFieldsAlpha.Content(b.trash).toNumber());
      //
      // } else {
      //
      //   items = [...newItems, ...query.toArray()];
      //
      // }

      KarmaFieldsAlpha.Store.Delta.set(items, "items", query.driver, query.paramstring);

      for (let i = 0; i < length; i++) {

        const field = this.createChild({
          type: "row",
          children: this.resource.children,
        }, index + i);

        field.create();

        if (this.resource.modal) {

          const field = this.createChild({
            type: "row",
            children: this.resource.modal.children,
          }, index + i);

          field.create();

        }

      }

      // -> save

      // const deltaItems = KarmaFieldsAlpha.Store.Delta.get("items", driver, paramstring);
      //
      // const data = deltaItems.slice(index, index + length);
      //
      // // await KarmaFieldsAlpha.HTTP.post(`sync/${driver}`, data);
      //
      // for (let row of data) {
      //
      //   for (let key in row) {
      //
      //     KarmaFieldsAlpha.Store.set(row[key], "vars", driver, row.id, key);
      //
      //   }
      //
      // }
      //
      // await KarmaFieldsAlpha.Database.Queries.remove("query", driver, paramstring);
      // await KarmaFieldsAlpha.Database.Queries.remove("count", driver, paramstring);
      //
      //
      // KarmaFieldsAlpha.Driver.save(query.driver, query.paramstring, index, length);

      // const deltaItems = KarmaFieldsAlpha.Store.Delta.get("items", query.driver, query.paramstring);
      //
      // const data = deltaItems.slice(index, length);
      //
      // KarmaFieldsAlpha.HTTP.post(`sync/${query.driver}`, data);
      //
      // for (let index in data) {
      //
      //   for (let key in data[index]) {
      //
      //     KarmaFieldsAlpha.Store.set(data[index][key], "vars", query.driver, data[index].id, key);
      //
      //   }
      //
      // }
      //
      // KarmaFieldsAlpha.Database.Queries.remove("query", query.driver, query.paramstring);
      // KarmaFieldsAlpha.Database.Queries.remove("count", query.driver, query.paramstring);


      // query.change(items);

    }
    //
    // const tokens = [];
    //
    // for (let i = 0; i < length; i++) {
    //
    //   const token = this.createToken();
    //
    //   tokens.push(token);
    //
    // }



    // items.splice(index, 0, ...tokens.map(token => ({token})));
    //
    // // KarmaFieldsAlpha.Store.Delta.set(items, "items", query.driver, query.paramstring);
    //
    // this.setItems(new KarmaFieldsAlpha.Content(items));
    //
    // // const params = {...filters.toObject(), ...defaults.toObject()};
    //
    // for (let i = 0; i < length; i++) {
    //
    //   // this.add(tokens[i], params);
    //
    //   KarmaFieldsAlpha.Store.Tasks.add({
    //     resolve: async task => {
    //
    //       const defaults = this.parse(this.resource.defaults || {});
    //       const filters = this.getFilters();
    //
    //       if (defaults.loading || filters.loading || query.loading) {
    //
    //         KarmaFieldsAlpha.Store.Tasks.add(task);
    //
    //       } else {
    //
    //         const params = {...filters.toObject(), ...defaults.toObject()};
    //
    //         if (!task.id) {
    //
    //           task.id = await this.createItem(params);
    //
    //         }
    //
    //         const query = this.getItems();
    //
    //         if (query.loading) {
    //
    //           KarmaFieldsAlpha.Store.Tasks.add(task);
    //
    //         } else {
    //
    //           let index = query.toArray().findIndex(item => item.token === task.token);
    //
    //           // const newQuery = new KarmaFieldsAlpha.Content(query.toArray().map(item => {
    //           //
    //           //   if (item.token === task.token) {
    //           //
    //           //     return {id: task.id, name: "[new Item]"};
    //           //
    //           //   }
    //           //
    //           //   return item;
    //           // }));
    //
    //           if (index > -1) {
    //
    //             const newQuery = new KarmaFieldsAlpha.Content(query.toArray().slice());
    //
    //             newQuery.value[index] = {id: task.id, name: "[new Item]"};
    //
    //             await this.setItems(newQuery);
    //
    //             const driver = this.getDriver();
    //             //
    //             const delta = KarmaFieldsAlpha.Store.get("tokens", driver, task.token);
    //
    //
    //
    //
    //             // KarmaFieldsAlpha.Store.remove("items", query.driver);
    //             // KarmaFieldsAlpha.Store.remove("counts", query.driver);
    //             //
    //             // await KarmaFieldsAlpha.Database.Queries.remove(query.driver);
    //             //
    //
    //             if (delta) {
    //
    //               for (let key in delta) {
    //
    //                 KarmaFieldsAlpha.Store.Delta.set(delta[key], "vars", driver, task.id, key);
    //
    //               }
    //
    //               KarmaFieldsAlpha.Store.remove("tokens", driver, task.token);
    //
    //             }
    //
    //           }
    //
    //
    //
    //         }
    //
    //       }
    //
    //     },
    //     token: tokens[i],
    //     type: "addItem"
    //   });
    //
    //   const row = this.createChild({
    //     type: "row",
    //     children: this.resource.children
    //   }, index);
    //
    //   row.create();
    //
    // }

    // this.setSelection({index, length});

    // this.request("render");
  }

  // createItem(token, driver, params) {
  //
  //   KarmaFieldsAlpha.Store.Tasks.add({
  //     resolve: async task => {
  //
  //       const query = this.getItems();
  //
  //       const data = {};
  //
  //       for (let key in params) {
  //
  //         const keyAlias = KarmaFieldsAlpha.Driver.getAlias(driver, key);
  //         const value = params[key].split(",");
  //
  //         data[keyAlias] = value;
  //
  //       }
  //
  //       let id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`, data);
  //       id = id.toString();
  //
  //       const name = "[new Item]";
  //
  //       // const deltaItems = KarmaFieldsAlpha.Store.Delta.get("items", query.driver, query.paramstring);
  //
  //       const items = query.toArray();
  //
  //       const index = items.findIndex(item => item.token === task.token);
  //
  //       if (index > -1) {
  //
  //         const newItems = [...deltaItems];
  //         newItems[index] = {id, name};
  //
  //         // KarmaFieldsAlpha.Store.Delta.set(newDeltaItems, "items", this.driver, this.paramstring);
  //
  //         this.setItems(newItems);
  //
  //       }
  //
  //       for (let key in params) {
  //
  //         const value = params[key].split(",");
  //
  //         KarmaFieldsAlpha.Store.set(value, "vars", query.driver, id, key);
  //         // KarmaFieldsAlpha.Store.set(true, "verifiedVars", this.driver, id, key);
  //         KarmaFieldsAlpha.Store.remove("diff", "vars", query.driver, id, key);
  //         KarmaFieldsAlpha.Store.Delta.set(value, "vars", query.driver, id, key);
  //
  //       }
  //
  //
  //       if (Object.values(data).length) {
  //
  //         // const data = {};
  //
  //         await KarmaFieldsAlpha.HTTP.post(`update/${query.driver}/${id}`, data);
  //
  //       }
  //
  //       KarmaFieldsAlpha.Store.set(["1"], "vars", query.driver, id, "trash");
  //       KarmaFieldsAlpha.Store.Delta.set([], "vars", query.driver, id, "trash");
  //
  //       KarmaFieldsAlpha.Store.remove("items", query.driver);
  //       KarmaFieldsAlpha.Store.remove("counts", query.driver);
  //
  //       await KarmaFieldsAlpha.Database.Queries.remove(query.driver);
  //
  //       if (task.data) {
  //
  //         for (let key in task.data) {
  //
  //           KarmaFieldsAlpha.Store.Delta.set(task.data[key], "vars", query.driver, id, key);
  //
  //         }
  //
  //       }
  //
  //     },
  //     type: "add",
  //     token: token
  //   });
  //
  //
  // }



  // async createItem(params) {
  //
  //   const driver = this.getDriver();
  //   const data = {};
  //
  //   for (let key in params) {
  //
  //     const keyAlias = KarmaFieldsAlpha.Driver.getAlias(driver, key);
  //     const value = params[key].split(",");
  //
  //     data[keyAlias] = value;
  //
  //   }
  //
  //   let id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`, data);
  //   id = id.toString();
  //
  //   for (let key in params) {
  //
  //     const value = params[key].split(",");
  //
  //     KarmaFieldsAlpha.Store.set(value, "vars", driver, id, key);
  //     // KarmaFieldsAlpha.Store.set(true, "verifiedVars", this.driver, id, key);
  //     KarmaFieldsAlpha.Store.remove("diff", "vars", driver, id, key);
  //     KarmaFieldsAlpha.Store.Delta.set(value, "vars", driver, id, key);
  //
  //   }
  //
  //   if (Object.values(data).length) {
  //
  //     await KarmaFieldsAlpha.HTTP.post(`update/${driver}/${id}`, data);
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.set(["1"], "vars", driver, id, "trash");
  //   KarmaFieldsAlpha.Store.Delta.set([], "vars", driver, id, "trash");
  //
  //   // KarmaFieldsAlpha.Store.remove("items", driver);
  //   // KarmaFieldsAlpha.Store.remove("counts", driver);
  //   //
  //   // await KarmaFieldsAlpha.Database.Queries.remove(driver);
  //
  //   return id;
  //
  // }








  // addNEW() {
  //
  //   const query = this.getItems();
  //   const defaults = this.parse(this.resource.defaults || {});
  //   const filters = this.getFilters();
  //   const position = this.getPosition();
  //
  //   if (query.loading || defaults.loading || position.loading || filters.loading) {
  //
  //     this.addTask(async () => this.add(...path), "adding");
  //
  //   } else {
  //
  //     KarmaFieldsAlpha.History.save("insert", "Insert");
  //
  //     const index = position.toNumber();
  //     const params = {...filters.toObject(), ...defaults.toObject()};
  //     const items = [...query.toArray()];
  //
  //     items.splice(index, 0, {loading: true});
  //
  //     KarmaFieldsAlpha.Store.Delta.set(items, "items", this.driver, this.paramstring);
  //
  //     KarmaFieldsAlpha.Store.Tasks.add({
  //       resolve: async () => {
  //
  //         const data = {};
  //
  //         for (let key in params) {
  //
  //           const keyAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);
  //           const value = params[key].split(",");
  //
  //           data[keyAlias] = value;
  //
  //         }
  //
  //         let id = await KarmaFieldsAlpha.HTTP.post(`add/${this.driver}`, data);
  //         id = id.toString();
  //
  //         const name = "[new Item]";
  //
  //         const deltaItems = KarmaFieldsAlpha.Store.Delta.get("items", this.driver, this.paramstring);
  //
  //         const index = deltaItems.findIndex(item => item.loading);
  //
  //         if (index > -1) {
  //
  //           const newDeltaItems = [...deltaItems];
  //           newDeltaItems[index] = {id, name};
  //
  //           KarmaFieldsAlpha.Store.Delta.set(newDeltaItems, "items", this.driver, this.paramstring);
  //
  //         }
  //
  //         for (let key in params) {
  //
  //           // const keyAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);
  //           // const value = params[key].split(",");
  //           //
  //           // data[keyAlias] = value;
  //
  //           const value = params[key].split(",");
  //
  //           KarmaFieldsAlpha.Store.set(value, "vars", this.driver, id, key);
  //           KarmaFieldsAlpha.Store.set(true, "verifiedVars", this.driver, id, key);
  //           KarmaFieldsAlpha.Store.remove("diff", "vars", this.driver, id, key);
  //           KarmaFieldsAlpha.Store.Delta.set(value, "vars", this.driver, id, key);
  //
  //         }
  //
  //
  //         if (Object.values(data).length) {
  //
  //           // const data = {};
  //
  //           await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}/${id}`, data);
  //
  //         }
  //
  //         KarmaFieldsAlpha.Store.set(["1"], "vars", this.driver, id, "trash");
  //         KarmaFieldsAlpha.Store.Delta.set([], "vars", this.driver, id, "trash");
  //
  //         KarmaFieldsAlpha.Store.remove("items", this.driver);
  //         KarmaFieldsAlpha.Store.remove("counts", this.driver);
  //
  //         await KarmaFieldsAlpha.Database.Queries.remove(this.driver);
  //
  //         console.log("done");
  //
  //       },
  //       type: "add"
  //     });
  //
  //
  //
  //
  //
  //
  //   }
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // }





  canDelete() {

    return this.selection && this.selection.length > 0 || false;

  }

  deleteSelection() {

    this.delete();

  }

  delete() {

    const selection = this.getSelection();

    if (selection && selection.length) {

      KarmaFieldsAlpha.History.save("delete", "Delete");

      const index = selection.index || 0;
      const length = selection.length || 0;

      this.remove(index, length);

      this.removeSelection();

      this.request("render");

    }

  }

  // // no more used
  // removeIds(ids) {
  //
  //   const driver = this.getDriver();
  //   const currentItems = this.getItems();
  //   const filteredItems = new KarmaFieldsAlpha.Content(currentItems.toArray().filter(item => !ids.includes(item.id)));
  //
  //
  //   for (let id of ids) {
  //
  //     KarmaFieldsAlpha.Store.Delta.set(["1"], driver, id, "trash");
  //
  //   }
  //
  //   this.setItems(filteredItems);
  //
  // }

  // removeRange(index, length) {
  //
  //   this.remove(index, length);
  // }

  // remove(index, length) {
  //
  //   const driver = this.getDriver();
  //   const query = this.getQuery();
  //
  //   if (!query.loading) {
  //
  //     const items = [...query.toArray()];
  //     const itemsToDelete = items.splice(index, length);
  //
  //     this.setItems(new KarmaFieldsAlpha.Content(items));
  //
  //     for (let item of itemsToDelete) {
  //
  //       if (item.id) {
  //
  //         KarmaFieldsAlpha.Store.set([], "vars", driver, item.id, "trash");
  //         // KarmaFieldsAlpha.Store.set(true, "verifiedVars", this.driver, item.id, "trash");
  //         KarmaFieldsAlpha.Store.remove("diff", "vars", driver, item.id, "trash");
  //         KarmaFieldsAlpha.Store.Delta.set(["1"], "vars", driver, item.id, "trash");
  //
  //         KarmaFieldsAlpha.HTTP.post(`update/${driver}/${item.id}`, {trash: ["1"]});
  //
  //       }
  //
  //     }
  //
  //     KarmaFieldsAlpha.Store.remove("items", driver);
  //     KarmaFieldsAlpha.Store.remove("counts", driver);
  //
  //     KarmaFieldsAlpha.Database.Queries.remove(driver);
  //
  //   }
  //
  // }

  async remove(index, length) {

    const query = this.getQuery();

    if (query.loading) {

      // KarmaFieldsAlpha.Store.Tasks.add({
      //   type: "remove",
      //   resolve: async task => this.remove(index, length)
      // });

      this.createTask("remove", index, length);

    } else {

      // KarmaFieldsAlpha.Driver.remove(query.driver, query.paramstring, index, length);

      // const items = KarmaFieldsAlpha.Store.Delta.get("items", query.driver, query.paramstring) || [];
      const clones = [...query.toArray()];

      const data = clones.splice(index, length); //.map(row => ({id: row.id, trash: ["1"]}));

      KarmaFieldsAlpha.Store.Delta.set(clones, "items", query.driver, query.paramstring);

      const deletedIds = KarmaFieldsAlpha.Store.Delta.get("trash", query.driver) || [];

      deletedIds = [...deletedIds, data.filter(item => item.id).map(item => item.id)];

      KarmaFieldsAlpha.Store.Delta.set(deletedIds, "trash", query.driver);



      // await KarmaFieldsAlpha.HTTP.post(`sync/${query.driver}`, data);
      //
      // await KarmaFieldsAlpha.Database.Queries.remove("query", query.driver, query.paramstring);
      // await KarmaFieldsAlpha.Database.Queries.remove("count", query.driver, query.paramstring);
      //
      //
      //
      // const task = new KarmaFieldsAlpha.Task.Remove(query.driver, query.paramstring, data);
      //
      // KarmaFieldsAlpha.Store.Tasks.add(task);



      // const items = [...query.toArray()];
      //
      // for (let i = 0; i < length; i++) {
      //
      //   items[index + i] = {...items[index + i], trash: "1"};
      //
      // }
      //
      // // items.sort((a, b) => new KarmaFieldsAlpha.Content(a.trash).toNumber() - new KarmaFieldsAlpha.Content(b.trash).toNumber());
      //
      // KarmaFieldsAlpha.Store.Delta.set(items, "items", query.driver, query.paramstring);
      //
      // KarmaFieldsAlpha.Driver.save(query.driver, query.paramstring, index, length);

    }

  }


  duplicate(index, length = 1) {

    const items = this.slice(index, length);

    this.insert(items, index + length, 0);

  }


  hasModalOpen() {

    return this.getSelection("length") > 0;

  }

  hasSelection() {

    return this.getSelection("length") > 0;

  }

  isRowSelected() {

    return this.getSelection("length") > 0;
  }

  getSelectedIds() {

    return this.getSelectedItems().map(item => item.id); // -> compat

  }

  getSelectedItems() {

    // const query = this.getItems();
    const query = this.getQuery();

    const response = new KarmaFieldsAlpha.Content();

    if (query.loading) {

      response.loading = true;

    } else {

      const selection = this.getSelection();

      if (selection) {

        const index = selection.index || 0;
        const length = selection.length || 0;

        response.value = query.toArray().slice(index, index + length);

      } else {

        response.value = [];

      }

    }

    return response;

  }

  withdraw() {

    const content = this.getSelectedItems();

    if (!content.loading) {

      const items = content.toArray();
      const ids = items.filter(item => item.id && !item.loading).map(item => item.id);

      this.save("withdraw", "Insert");

      // KarmaFieldsAlpha.Store.Layer.close();
      this.request("close");

      if (ids.length) {

        this.request("dispatch", "insert", ids);

      }

      this.request("render");

    }

  }

  selectByIds(ids) {

    const content = this.getItems();

    if (content.loading) {

      KarmaFieldsAlpha.Store.Tasks.add({
        type: "selectByIds",
        resolve: () => this.selectByIds(ids)
      });

    } else {

      const array = content.toArray();
      let i = 0;
      let index = array.findIndex(item => item.id === ids[i]);
      const selection = {length: 0};

      while (index > -1 && i < ids.length) {

        selection.index = index;
        selection.length++;

        i++;
        index = array.findIndex(item => item.id === ids[i]);

      }

      if (selection.length === ids.length) { // -> non consecutive ids... dunno how to handle yet :(

        this.setSelection(selection);

      }

    }

  }





  build() {

    return {
      class: "table grid",
      init: grid => {
        if (this.resource.style) {
          grid.element.style = this.resource.style;
        }
        if (this.resource.width) {
          grid.element.style.width = this.resource.width;
        }
        if (this.resource.align) {
          grid.element.classList.add(`align-${this.resource.align}`);
        }
      },
      update: grid => {

        const query = this.getQuery();

        grid.element.classList.toggle("loading", Boolean(query.loading));
        grid.element.classList.toggle("active", Boolean(this.hasFocus()));

        // const itemsUnder = this.request("tunnel", -1, "getSelectedItems");

        if (!query.loading) {

          const items = query.toArray();

          const page = this.request("getPage");
          const ppp = this.getPpp();
          const offset = (page - 1)*ppp;
          const columns = this.resource.children || [];

          let selection = this.getSelection();

          grid.element.classList.toggle("even", items.length%2 === 0);
          // grid.element.classList.toggle("odd", items.length%2 === 1);

          const selector = new KarmaFieldsAlpha.RowPicker(grid.element, selection);

          const hasHeader = columns.some(column => column.label);
          selector.header = hasHeader ? 1 : 0;
          selector.width = this.resource.children.length;

          selector.onSelect = elements => {

            elements.map(element => element.classList.add("selected"));
            this.setSelection(selector.state.selection);

          }

          selector.onUnselect = elements => {

            elements.map(element => element.classList.remove("selected"));

          }

          selector.onSelectionComplete = () => {

            // this.useClipboard();

            this.setFocus(true);
            // this.request("deferFocus");
            this.request("render");

          }

          if (items.length) {
            grid.element.classList.add("filled"); // -> draw table borders



            grid.children = [];

            if (hasHeader) {

              for (let i = 0; i < columns.length; i++) {

                const resource = columns[i];

                grid.children.push({
                  class: "th table-header-cell",
                  init: th => {
                    if (resource.style) {
                      th.element.style = resource.style;
                    }
                    th.element.tabIndex = -1;
                  },
                  update: th => {
                    th.element.classList.toggle("first-cell", i === 0);
                    th.element.classList.toggle("last-cell", i === columns.length - 1);
                    th.children = [
                      {
                        class: "header-cell-content title",
                        init: a => {
                          a.element.textContent = resource.label;
                        }
                      },
                      {
                        class: "header-cell-content order",
                        child: {
                          tag: "span",
                          class: "dashicons",
                          update: span => {
                            const order = this.getOrder() || "asc";
                            const orderby = this.getOrderby();
                            const isAsc = orderby === (resource.orderby || resource.key) && order === "asc";
                            const isDesc = orderby === (resource.orderby || resource.key) && order === "desc";
                            span.element.classList.toggle("dashicons-arrow-up", isAsc);
                            span.element.classList.toggle("dashicons-arrow-down", isDesc);
                            span.element.classList.toggle("dashicons-leftright", !isAsc && !isDesc);
                          }
                        },
                        update: a => {
                          a.element.classList.toggle("hidden", !resource.sortable);
                          if (resource.sortable) {
                            a.element.onmousedown = event => {
                              event.stopPropagation(); // -> prevent header selection
                            }
                            a.element.onclick = event => {
                              // debugger;
                              event.preventDefault();
                              this.toggleOrder(resource.orderby || resource.key, resource.order);
                              // this.select();
                            };
                          }
                        }
                      }
                    ];
                  }
                });
              }

            }



            for (let i = 0; i < items.length; i++) {

              const row = this.createChild({
                // id: items[i].id,
                // loading: items[i].loading,
                type: "row",
                children: columns,
                index: offset + i,
                rowIndex: offset + i
              }, i);

              const isRowSelected = selection && KarmaFieldsAlpha.Segment.contain(selection, i);

              for (let j = 0; j < columns.length; j++) {

                const field = row.createChild({
                  ...columns[j],
                  index: j
                }, j);

                grid.children.push({
                  class: "td table-cell",
                  init: td => {
                    if (columns[j].style) {
                      td.element.style = columns[j].style;
                    }
                    // td.element.tabIndex = -1;
                  },
                  update: td => {
                    td.element.classList.toggle("selected", Boolean(isRowSelected));
                    td.element.classList.toggle("odd", i%2 === 0);
                    td.element.classList.toggle("last-row", i === items.length-1);
                    td.element.classList.toggle("first-cell", j === 0);
                    td.element.classList.toggle("last-cell", j === columns.length - 1);
                    // if (selection && selection.reveal && rowIndex === selection.index) {
                    //   const container = this.getScrollContainer();
                    //   if (container) {
                    //     container.scrollTop = td.element.offsetTop - 0;
                    //     selection.reveal = false;
                    //   }
                    // }
                  },
                  child: field.build()
                });


              }

            }

            grid.element.style.gridTemplateColumns = columns.map(resource => resource.width || "auto").join(" ");

          } else {
            grid.children = [];
            grid.element.classList.remove("filled");
          }

        }

      }

    };

  }

}



KarmaFieldsAlpha.field.grid.modal = class extends KarmaFieldsAlpha.field.group {

  getContent(key) {

    return this.parent.getContent(this.id, key);

    // const request = this.request("getSelectedItems");
    //
    // if (!request.loading && !request.toArray().some(item => item.loading)) {
    //
    //   const items = request.toArray();
    //
    //   if (items.length > 1) {
    //
    //     const contents = items.map(item => this.parent.getContent(item.id, key));
    //
    //     const content = new KarmaFieldsAlpha.Content();
    //
    //     if (contents.some(content => content.loading)) {
    //
    //       content.loading = true;
    //
    //     } else if (contents.some((content, index, array) => index > 0 && !content.equals(array[0]))) {
    //
    //       content.mixed = true;
    //
    //       content.value = contents.map(content => content.value);
    //
    //     } else {
    //
    //       content.value = contents[0].toArray();
    //
    //     }
    //
    //     return content;
    //
    //   } else if (items.length === 1) {
    //
    //     return this.parent.getContent(items[0].id, key);
    //
    //   }
    //
    // }
    //
    // return new KarmaFieldsAlpha.Content.Request();

  }

  setContent(value, key) {

    this.parent.setContent(value, this.id, key);

    // const items = this.request("getSelectedItems");
    //
    // if (!items.loading) {
    //
    //   for (let item of items.toArray()) {
    //
    //     if (item.id) {
    //
    //       this.parent.setContent(value, item.id, key);
    //
    //     }
    //
    //   }
    //
    // }

  }

  // getIds() {
  //
  //   console.error("Deprecated");
  //
  //   const items = this.request("getSelectedItems");
  //   const content = new KarmaFieldsAlpha.Content();
  //
  //   if (items.loading) {
  //
  //     content.loading = true;
  //
  //   } else {
  //
  //     content.value = items.toArray().map(item => item.id);
  //
  //   }
  //
  //   return content;
  //
  // }

  // getId() {
  //
  //   console.error("Deprecated");
  //
  //   // const ids = this.getIds();
  //   //
  //   // if (ids) {
  //   //
  //   //   return ids[0];
  //   //
  //   // }
  //
  //   return this.getIds();
  //
  // }

  // setSelection(selection) {
  //
  //   if (selection) {
  //
  //     // selection = {
  //     //   ...this.parent.getSelection(),
  //     //   childId: this.resource.index,
  //     //   child: selection
  //     // };
  //
  //     selection.id = this.id;
  //
  //     selection = {
  //       ...this.parent.getSelection(),
  //       child: selection
  //     };
  //
  //   }
  //
  //   this.parent.setSelection(selection);
  //
  // }

}



KarmaFieldsAlpha.field.grid.row = class extends KarmaFieldsAlpha.field {

  getContent(key) {

    // if (this.resource.token) {
    //
    //   let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.token === this.resource.token);
    //
    //   if (task) {
    //
    //     return KarmaFieldsAlpha.DeepObject.get(task, key, "data");
    //
    //   } else {
    //
    //     console.error("No task!!??");
    //
    //   }
    //
    // }
    //
    // const id = this.getId();
    //
    // if (this.resource.loading || !id) {
    //
    //   return new KarmaFieldsAlpha.Content.Request();
    //
    // }
    //
    // if (key === "id") {
    //
    //   return new KarmaFieldsAlpha.Content(id);
    //
    // }

    return this.parent.getContent(this.id, key);

  }

  setContent(value, key) {

    // if (this.resource.token) {
    //
    //   let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.token === this.resource.token);
    //
    //   if (task) {
    //
    //     KarmaFieldsAlpha.DeepObject.set(task, value, key, "data");
    //
    //   }
    //
    // } else {
    //
    //   const id = this.getId();
    //
    //   this.parent.setContent(value, id, key);
    //
    // }


    this.parent.setContent(value, this.id, key);

  }

  getIndex() {

    return this.resource.index || 0;

  }

  //
  // getId() {
  //
  //   return this.resource.id;
  //
  // }

}


KarmaFieldsAlpha.field.grid.row.delete = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      action: "delete",
      value: ["index"],
      title: "Delete",
      dashicon: "no-alt",
      width: "auto",
      ...resource
    })
  }
};
KarmaFieldsAlpha.field.grid.row.sortArrows = class extends KarmaFieldsAlpha.field.group {
  constructor(resource) {
    super({
      visible: [">", ["length", ["getValue"]], "1"],
      children: [
        {
          action: "sortUp",
          value: ["index"],
          type: "button",
          title: "Move Up",
          disabled: ["<", ["length", ["getValue"]], 1],
          dashicon: "arrow-up-alt2",
          class: "array-sort-up",
          width: "auto"
        },
        {
          action: "sortDown",
          value: ["index"],
          type: "button",
          title: "Move Down",
          disabled: [">=", ["+", ["get", "number", "index"], 1], ["length", ["getValue"]]],
          dashicon: "arrow-down-alt2",
          class: "array-sort-up",
          width: "auto"
        }
      ],
      ...resource
    })
  }
};



// array(
//   'type' => 'text',
//   'content' => array('request', 'getNotice')
// ),


// KarmaFieldsAlpha.field.grid.row.index = {
//   type: "text",
//   value: ["+", ["getIndex"], 1],
//   style: "width: 6em"
// };

KarmaFieldsAlpha.field.grid.row.rowIndex = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      value: ["+", ["getIndex"], 1],
      width: "5em",
      ...resource
    })
  }
};

KarmaFieldsAlpha.field.grid.row.index = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      value: ["+", ["getIndex"], 1],
      width: "5em",
      ...resource
    })
  }
};
