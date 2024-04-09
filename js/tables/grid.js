
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
console.error("deprecated");
    // return this.query;

    return this.queryItems();

  }

  getCollection() {

    const params = this.getParams();
    const driver = this.getDriver();

    const collection = new KarmaFieldsAlpha.Model.Collection(driver);

    if (params.loading) {

      collection.loading = true;

    } else {

      collection.paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());

    }

    return collection;
  }

  queryItems() {

    const collection = this.getCollection();
    const query = collection.queryItems();

    if (!query.loading) {

      query.value = query.toArray().map((item, index) => ({...item, index}));

    }

    return query;


    // const params = this.getParams();
    // const driver = this.getDriver();
    //
    // // console.log(driver, params);
    //
    // let content = new KarmaFieldsAlpha.Content();
    //
    // // query.driver = driver;
    //
    // if (params.loading) {
    //
    //   content.loading = true;
    //
    // } else {
    //
    //   const paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());
    //
    //   const collection = new KarmaFieldsAlpha.Collection(driver, paramstring);
    //
    //   content = collection.getItems();
    //
    //   // content.driver = driver;
    //   // content.paramstring = paramstring;
    //   //
    //   // const items = KarmaFieldsAlpha.Store.Delta.get("items", driver, paramstring);
    //   //
    //   // if (items) {
    //   //
    //   //   content.value = items;
    //   //
    //   // } else {
    //   //
    //   //   const query = KarmaFieldsAlpha.Driver.getQuery(driver, paramstring);
    //   //
    //   //   if (query.loading) {
    //   //
    //   //     content.loading = true;
    //   //
    //   //   } else {
    //   //     content.value = query.value;
    //   //
    //   //   }
    //   //
    //   // }
    //
    // }
    //
    // return content;

  }

  // summonItem(index) {
  //
  //   const imp = this.summonItems(index, 1);
  //
  //   if (!imp.loading) {
  //
  //     imp.loot = imp.dropObject();
  //
  //   }
  //
  //   return imp;
  // }

  queryItem(index) { // compat

    // const query = this.queryItems();
    //
    // if (!query.loading) {
    //
    //   query.value = query.toArray()[index];
    //
    // }

    return this.queryItemAt(index);
  }

  queryItemAt(index) {

    const query = this.queryItems();

    if (!query.loading) {

      query.value = query.toArray()[index];

    }

    return query;
  }

  queryIndexAt(index) {

    const query = this.queryItem(index);

    if (!query.loading) {

      query.value = query.toObject().index;

    }

    return query;
  }

  // getContent(index, key) {
  //
  //   const collection = this.getCollection();
  //
  //   // return collection.queryValueAt(index, key);
  //
  //   let content = new KarmaFieldsAlpha.Content();
  //
  //   if (index === "modal" || index === "*") {
  //
  //     const selection = this.getSelection();
  //     const index = selection.index || 0;
  //     const length = selection.length || 0;
  //
  //     if (length > 1) {
  //
  //       const query = collection.queryItems();
  //
  //       if (query.loading) {
  //
  //         content.loading = true;
  //
  //       } else {
  //
  //         const slice = query.toArray().slice(index, index + length);
  //         const contents = slice.map((item, i) => collection.queryValueAt(index + i, key));
  //
  //         if (contents.some(content => content.loading)) {
  //
  //           content.loading = true;
  //
  //         } else if (contents.some((content, index, array) => index > 0 && !content.equals(array[0]))) {
  //
  //           content.mixed = true;
  //
  //         } else {
  //
  //           content.value = contents[0].toArray();
  //
  //         }
  //
  //       }
  //
  //       // return content;
  //
  //     } else if (length === 1) {
  //
  //       content = collection.queryValueAt(index, key);
  //
  //     }
  //
  //   } else {
  //
  //     content = collection.queryValueAt(index, key);
  //
  //   }
  //
  //   return content;
  //
  // }

  getContent(index, key) {

    const collection = this.getCollection();

    let content = new KarmaFieldsAlpha.Content();

    if (index === "modal" || index === "*") {

      const query = this.querySelectedItems();

      if (query.loading) {

        content.loading = true;

      } else {

        const selectedItems = query.toArray();

        if (selectedItems.length > 1) {

          const contents = selectedItems.map((item, i) => this.getContent(item.index, key));

          if (contents.some(content => content.loading)) {

            content.loading = true;

          } else if (contents.some((content, index, array) => index > 0 && !content.equals(array[0]))) {

            content.mixed = true;

          } else {

            content.value = contents[0].toArray();

          }

        } else if (selectedItems.length === 1) {

          content = this.getContent(selectedItems[0].index, key);

        }

      }

    } else {

      content = collection.queryValueAt(index, key);

    }

    return content;

  }

  getContentAt(index, key) {

    let query = this.queryItems();

    if (!query.loading) {

      const item = query.toArray()[index];

      if (item) {

        query = this.getContent(item.index, key);

      } else {

        query = new KarmaFieldsAlpha.Content();
        query.outOfBounds = true;

      }

    }

    return query;

  }

  setContent(content, index, key) {

    const collection = this.getCollection();

    if (index === "modal" || index === "*") {

      const query = this.querySelectedItems();

      if (!query.loading) {

        for (let item of query.toArray()) {

          this.setContent(content, item.index, key);

        }

      }

      // const selection = this.getSelection();
      // const index = selection.index || 0;
      // const length = selection.length || 0;
      //
      // for (let i = 0; i < length; i++) {
      //
      //   collection.setValueAt(content, index + i, key);
      //
      // }

    } else {

      collection.setValueAt(content, index, key);

    }

  }

  setContentAt(content, index, key) {

    const query = this.queryItems();

    if (!query.loading) {

      const items = query.toArray();

      if (items[index]) {

        this.setContent(content, items[index].index, key);

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

    return this.parent.getParams();

    // const params = KarmaFieldsAlpha.Store.Layer.getCurrent("params");
    //
    // return new KarmaFieldsAlpha.Content(params);

  }

  getParam(key) {

    return this.parent.getParam(key);

    // return KarmaFieldsAlpha.Store.Layer.getParam(key);

  }

  setParam(value, key) {

    // KarmaFieldsAlpha.Store.Layer.setParam(value, key);

    this.parent.setParam(value, key);

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

    const collection = this.getCollection();

    return collection.count();

    // const driver = this.getDriver();
    //
    // const params = this.getFilters();
    //
    // if (!params.loading) {
    //
    //   return new KarmaFieldsAlpha.Content.Count(driver, params.toObject());
    //
    // } else {
    //
    //   return new KarmaFieldsAlpha.Content.Request();
    //
    // }

  }

  getPage() {

    const page = this.getParam("page");



    return Number(page.value || 1);

  }

  getPpp() {

    const ppp = this.getParam("ppp");

    return Number(ppp.value || 100);
  }

  getOrder() {

    const order = this.getParam("order");

    return order.value;

  }

  getOrderby() {

    return this.getParam("orderby").value;

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

    // KarmaFieldsAlpha.Store.clear();

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

  // slice(index = 0, length = 999999) {
  //
  //   const gridContent = new KarmaFieldsAlpha.Content.Grid();
  //
  //   // const query = this.getQuery();
  //   const query = this.getQuery();
  //
  //   if (query.loading) {
  //
  //     gridContent.loading = true;
  //
  //   } else {
  //
  //     const columns = this.getExportableColumns();
  //
  //     length = Math.min(length, query.toArray().length);
  //
  //     for (let i = 0; i < length; i++) {
  //
  //       const rowField = this.createChild({
  //         type: "row",
  //         index: i + index,
  //         children: columns
  //       }, i + index);
  //
  //       const collection = rowField.export();
  //
  //       if (collection.loading) {
  //
  //         gridContent.loading = true;
  //
  //       } else {
  //
  //         gridContent.value.push(collection.toArray());
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   return gridContent;
  //
  // }

  slice(index = 0, length = 999999, columns = null) {

    const gridContent = new KarmaFieldsAlpha.Content.Grid();

    const query = this.queryItems();

    if (query.loading) {

      gridContent.loading = true;

    } else {

      if (!columns) {

        columns = this.getExportableColumns();

      }

      const items = query.toArray().slice(index, index + length);

      // length = Math.min(length, query.toArray().length);

      // for (let i = 0; i < length; i++) {
      for (let item of items) {

        const rowField = this.createChild({
          type: "row",
          index: item.index,
          children: columns
        }, item.index);

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



  // importIds(grid, ids) { // deprecated
  //
  //   console.error("deprecated");
  //   if (grid.value.length === ids.length) {
  //
  //     const columns = this.getExportableColumns();
  //
  //     for (let i = 0; i < grid.value.length; i++) {
  //
  //       const child = this.createChild({
  //         children: columns,
  //         type: "row",
  //         index: i,
  //         id: ids[i]
  //       }, i);
  //
  //       const content = new KarmaFieldsAlpha.Content.Collection(grid.value[i]);
  //
  //       child.import(content);
  //
  //     }
  //
  //   }
  //
  // }

  // insert(grid, index, length) {
  //
  //   const array = grid.toArray();
  //
  //   if (array.length < length) {
  //
  //     this.remove(index + array.length, length - array.length);
  //
  //   } else if (array.length > length) {
  //
  //     this.addAt(index + length, array.length - length);
  //
  //   }
  //
  //   const columns = this.getExportableColumns();
  //
  //
  //   for (let i = 0; i < array.length; i++) {
  //
  //     const child = this.createChild({
  //       children: columns,
  //       type: "row",
  //     }, i + index);
  //
  //     const content = new KarmaFieldsAlpha.Content.Collection(array[i]);
  //
  //     child.import(content);
  //
  //   }
  //
  // }



  insert(grid, index = 0, length = 0, columns = null) {

    const array = grid.toArray();

    // length = this.queryItems().toArray().length - index;

    if (array.length < length) {

      this.removeAt(index + array.length, length - array.length);

    } else if (array.length > length) {

      this.addAt(index + length, array.length - length);

    }

    const query = this.queryItems();

    if (!query.loading) {

      if (!columns) {

        columns = this.getExportableColumns();

      }

      const items = query.toArray();

      for (let i = 0; i < array.length; i++) {

        const item = items[index + i];

        const child = this.createChild({
          children: columns,
          type: "row",
        }, item.index);

        const content = new KarmaFieldsAlpha.Content.Collection(array[i]);

        child.import(content);

      }

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

      const query = this.queryItems();

      if (!query.loading) {

        const items = query.toArray();

        if (items[index]) {

          return this.createChild({
            // id: item.id,
            type: "row",
            children: this.resource.children,
            // loading: item.loading,
            // index: index
          }, items[index].index);

        }

      }

    }

  }

  selectAll() {

    const query = this.queryItems();

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

  // getPosition() {
  //
  //   if (this.resource.position !== undefined) {
  //
  //     return this.parse(this.resource.position);
  //
  //   } else {
  //
  //     const index = this.getSelection("index") || 0;
  //     const length = this.getSelection("length") || 0;
  //
  //     return new KarmaFieldsAlpha.Content(index + length);
  //
  //   }
  //
  // }

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

    let index = this.resource.insertAt || this.resource.insertPosition || this.resource.position;

    if (index === undefined) {

      const items = this.queryItems();

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

  // // get index of collection from index of grid
  // queryCollectionIndex(index) {
  //
  //   const query = this.queryItems(index, 1);
  //
  // }


  addAt(index, length = 1) {

    const collection = this.getCollection();
    const defaults = this.parse(this.resource.defaults || {});
    const filters = this.getFilters();

    // const demon = this.summonItems(index, 1);
    let query = this.queryItems();

    if (query.loading || defaults.loading || filters.loading) {

      // KarmaFieldsAlpha.Store.Tasks.add({
      //   type: "addAt",
      //   resolve: async task => this.addAt(length, position)
      // });

      // this.createTask("addAt", length, position);

      console.warn("adding items while collection not loaded");

    } else {

      const params = {...filters.toObject(), ...defaults.toObject()};

      let items = query.toArray();

      // if (index !== undefined || index < 0 || index >= items.length) {
      //
      //   index = items.length
      //
      // } else {
      //
      //   index = items[index]
      //
      // }

      let collectionIndex;

      if (items[index] && items[index].index !== undefined) {

        collectionIndex = items[index].index;

      } else {

        collectionIndex = items.length; // add at end

      }

      collection.add(params, collectionIndex, length);

      query = this.queryItems();

      items = query.toArray().slice(index, index + length);

      for (let item of items) {

        const field = this.createChild({
          type: "row",
          children: this.resource.children,
        }, item.index);

        field.create();

        if (this.resource.modal) {

          const field = this.createChild({
            type: "row",
            children: this.resource.modal.children,
          }, item.index);

          field.create();

        }

      }

    }

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


  querySelectedItems() {

    const selection = this.getSelection();
    const index = selection && selection.index || 0;
    const length = selection && selection.length || 0;

    let query = this.queryItems();

    if (!query.loading) {

      query.value = query.toArray().slice(index, index + length);

    }

    return query;

    // if (!itemsQuery.loading) {
    //
    //   itemsQuery.value = itemsQuery.toArray().slice(index, index + length);
    //
    // }
    //
    // return itemsQuery;
  }

  // querySelectedIndex() {
  //
  //   const query = this.queryItems();
  //
  //   if (!query.loading) {
  //
  //     const selection = this.getSelection();
  //     const index = selection && selection.index || 0;
  //     const item = query.toArray()[index];
  //
  //     query.value = item && item.index || 0;
  //
  //   }
  //
  //   return query;
  //
  // }


  canDelete() {

    const selection = this.getSelection();

    return selection && selection.length > 0 || false;

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

      this.removeAt(index, length);

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

  removeAt(index, length = 1) {

    const query = this.queryItems();

    if (!query.loading) {

      const item = query.toArray()[index];

      if (item) {

        this.remove(item.index, length);

      }

      // const items = query.toArray().slice(index, index + length);
      //
      // for (let item of items) {
      //
      //   this.remove(item.index);
      //
      // }

    }

  }

  remove(collectionIndex, length = 1) { // -> to be renamed remove()

    const collection = this.getCollection();

    collection.remove(collectionIndex, length);

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

  // compat
  getSelectedItems() {

    return this.querySelectedItems().toArray();

// console.error("deprecated");
//     // const query = this.getItems();
//     const query = this.getQuery();
//
//     const response = new KarmaFieldsAlpha.Content();
//
//     if (query.loading) {
//
//       response.loading = true;
//
//     } else {
//
//       const selection = this.getSelection();
//
//       if (selection) {
//
//         const index = selection.index || 0;
//         const length = selection.length || 0;
//
//         response.value = query.toArray().slice(index, index + length);
//
//       } else {
//
//         response.value = [];
//
//       }
//
//     }
//
//     return response;

  }

  withdraw() {

    const content = this.querySelectedItems();

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

    const content = this.queryItems();

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

      if (selection.length === ids.length) {

        this.setSelection(selection);

      } else {

         // -> non consecutive ids !

      }

    }

  }


  deferSelection() {

    const items = this.querySelectedItems();

    if (!items.loading) {

      KarmaFieldsAlpha.Task.add({
        priority: -1,
        ids: items.toArray().map(item => item.id),
        resolve: task => {
          this.selectByIds(task.ids);
        }
      });

    }

    this.removeSelection();

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

        const query = this.queryItems();

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

                const field = new KarmaFieldsAlpha.field.text(resource);

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
                        update: a => {
                          a.element.textContent = resource.label;
                          // a.element.textContent = field.getLabel();
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
              }, items[i].index);

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


  getId() {

    return this.parent.getContent(this.id, "id");

  }

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
