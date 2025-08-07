

KarmaFieldsAlpha.field.form = class extends KarmaFieldsAlpha.field {

  init() {

    super.init();

    this.driver = this.getDriver();
    this.params = this.getParams();
    this.paramstring = KarmaFieldsAlpha.Params.stringify(this.params.toObject());

  }


  getParams() {

    const params = this.parse(this.resource.params);

    if (!params.loading) {

      params.value = {
        ...params.value,
        ...this.getState()
      };

    }

    return params;

  }

  // getParam(key) {
  //
  //   return this.getParams().get(key);
  //
  // }
  //
  // setParam(value, key) {
  //
  //   this.setState(value, key);
  //
  // }




}

KarmaFieldsAlpha.field.table = class extends KarmaFieldsAlpha.field.form {

  getChild(index) {

    for (let child of this.genChildren()) {

      if (child.id === index) {

        return child;

      }

    }

  }

  isMixed() {

    const id = this.parent.getContent("id");

    return Boolean(id.mixed);

  }

  *genChildren() {

    const params = this.getParams();

    if (params.loading) {

      return [];

    }

    const paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());

    const isMixed = this.isMixed();

    if (isMixed) {

      return this.createChild({
        type: "mixed"
      }, "mixed");

    } else {

      if (this.resource.header) {

        yield this.createChild({
          type: "header",
          ...this.resource.header,
          driver: this.resource.driver,
          paramstring: paramstring
        }, "header");

      }

      if (this.resource.body) {

        yield this.createChild({
          type: "body",
          ...this.resource.body || this.resource, // compat
          driver: this.resource.driver,
          paramstring: paramstring
        }, "body");

      }

      if (this.resource.footer) {

        yield this.createChild({
          type: "footer",
          ...this.resource.footer,
          driver: this.resource.driver,
          paramstring: paramstring
        }, "footer");

      }


    }

  }


  build() {

    return {
      class: "grid-field",
      children: [
        {
          class: "mixed-content",
          init: node => {
            node.element.innerHTML = "[mixed content]";
          },
          update: node => {
            node.element.classList.toggle("hidden", !this.isMixed());
          }
        },
        {
          class: "single-content",
          update: node => {
            node.element.classList.toggle("hidden", this.isMixed());
          },
          children: [...this.genChildren()].map(child => child.build())
        }
      ]
    };

  }


  getSet() {

    const set = new KarmaFieldsAlpha.Set();

    set.query(this.resource.driver, this.resource.paramstring);

    return set;

  }

  getLength() {

    const content = new KarmaFieldsAlpha.Content();

    const set = this.getSet();

    if (set.loading) {

      content.loading = true;

    } else {

      content.value = set.toArray().length;

    }

    return content;
  }

  queryItems() {

    return this.getSet();

  }


  queryItem(index) { // compat

    return this.queryItemAt(index);

  }

  queryItemAt(index) {

    return this.queryItems().getAt(index);

  }

  queryIndexAt(index) {

    return queryItem(index).get("index");

  }

  getContentRange(index, length, key) {

    const set = this.getSet();

    const values = set.toIds().slice(index, index + length).map(id => new KarmaFieldsAlpha.Value(set.driver, set.paramstring, id, key));

    if (values.some(value => value.loading)) {

      const content = new KarmaFieldsAlpha.Content();

      content.loading = true;

      return content;

    } else if (values.slice(1).some(value => !value.equals(values[0]))) {

      const content = new KarmaFieldsAlpha.Content();

      content.mixed = true;

      return content;

    } else {

      return values[0];

    }

  }

  getContentAt(index, key) {

    const set = this.getSet();

    // const set = new KarmaFieldsAlpha.Set();
    //
    // set.query(this.resource.driver, this.resource.paramstring);
    //
    // // if (index === "footer" || index === "header") {
    // //
    // //   return this.getParams();
    // //
    // // } else
    //
    // if (index === "modal" || index === "*") {
    //
    //   const selection = this.getSelection();
    //   const selectionSet = set.slice(selection);
    //
    //   if (selectionSet.toArray().some((content, index, array) => index > 0 && !selectionSet.getValue(index, key).equals(selectionSet.getValue(0, key)))) {
    //
    //     return KarmaFieldsAlpha.Content.mixed();
    //
    //   } else {
    //
    //     return selectionSet.getValue(0, key);
    //
    //   }
    //
    // } else {

    return set.getValue(index, key);

    // }

  }

  setContentAt(content, index, key) {

    const set = this.getSet();

    set.setValue(content.value, index, key);

  }

  getContent(key) {

    return this.params.get(key);

  }

  setContent(value, key) {

    this.setState(value, key);

  }



  getParams() {

    return this.params;

  }

  getParam(key) {

    return this.params.get(key);

  }

  setParam(value, key) {

    this.setState(value, key);

    // this.request("render");

  }

  getFilters() {

    const params = this.getParams();
    const filterParams = new KarmaFieldsAlpha.Content();

    if (params.loading) {

      filterParams.loading = true;

    } else {

      const {page, ppp, order, orderby, ...filters} = params.value || {};

      filterParams.value = filters;

    }

    return filterParams;
  }

  getDefaults() {

    return this.parse(this.resource.defaults || {});

  }

  getCount() {

    const count = new KarmaFieldsAlpha.Count();

    count.query(this.resource.driver, this.resource.paramstring);

    return count;

  }

  getPage() {

    return this.getParam("page").toNumber() || 1;

  }

  getPpp() {

    return this.getParam("ppp").toNumber() || 100;
  }

  getOrder() {

    return this.getParam("order").toString();

  }

  getOrderby() {

    return this.getParam("orderby").toString();

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

    const count = this.getCount();
    const content = new KarmaFieldsAlpha.Content();

    if (count.loading) {

      this.loading = true;

    } else {

      content.value = Math.max(1, Math.ceil(count.toNumber()/this.getPpp()));

    }

    return content;
  }

  isFirstPage() {

    const content = new KarmaFieldsAlpha.Content();

    content.value = this.getPage() === 1;

    return content;

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

    // this.save("changePage", "Change Page");
    // KarmaFieldsAlpha.Store.Layer.setParam(page, "page");

    this.setContent(page, "page");


    // KarmaFieldsAlpha.Store.remove("vars");
    // KarmaFieldsAlpha.Store.remove("items");
    // KarmaFieldsAlpha.Store.remove("counts");

    // KarmaFieldsAlpha.Store.clear();

    // KarmaFieldsAlpha.Store.Layer.removeItems();

  }

  firstPage() {

    const page = this.getPage();

    if (page > 1) {

      this.save("changePage", "Change Page");
      this.setPage(1);

    }

  }

  prevPage() {

    const page = this.getPage();

    if (page > 1) {

      this.save("changePage", "Change Page");
      this.setPage(page - 1);

    }

  }

  nextPage() {

    const page = this.getPage();
    const numPage = this.getNumPage().toNumber();

    if (page < numPage) {

      this.save("changePage", "Change Page");
      this.setPage(page + 1);

    }

  }

  lastPage() {

    const page = this.getPage();
    const numPage = this.getNumPage().toNumber();

    if (page < numPage) {

      this.save("changePage", "Change Page");
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



  // getExportableColumns() {
  //
  //   const mode = this.resource.import || this.resource.export || this.resource.modal && "modal";
  //
  //   let columns;
  //
  //   if (mode === "modal") {
  //
  //     return this.resource.modal.children;
  //
  //   } else if (mode && Array.isArray(mode)) {
  //
  //     return mode;
  //
  //   } else {
  //
  //     return this.resource.children;
  //
  //   }
  //
  // }


  // slice(index = 0, length = 999999, columns = null) {
  //
  //   const gridContent = new KarmaFieldsAlpha.Content.Grid();
  //
  //   const set = this.getSet();
  //
  //   if (query.loading) {
  //
  //     gridContent.loading = true;
  //
  //   } else {
  //
  //     if (!columns) {
  //
  //       columns = this.getExportableColumns();
  //
  //     }
  //
  //     const subset = set.slice({index, length});
  //
  //     const body = this.createChild(this.resource.body, "body");
  //
  //     for (let i = 0; i < subset.toArray().length; i++) {
  //     // for (let item of subset.toArray()) {
  //
  //       const rowField = body.createChild({
  //         type: "row",
  //         children: columns
  //       }, index + i);
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

  // insert(grid, index = 0, length = 0, columns = null) {
  //
  //   const array = grid.toArray();
  //
  //   if (array.length < length) {
  //
  //     this.removeAt(index + array.length, length - array.length);
  //
  //   } else if (array.length > length) {
  //
  //     this.addAt(index + length, array.length - length);
  //
  //   }
  //
  //   const body = this.createChild(this.resource.body, "body");
  //
  //   body.import(grid, index, length, columns);
  //
  //   const set = this.getSet();
  //
  //   if (!query.loading) {
  //
  //     if (!columns) {
  //
  //       columns = this.getExportableColumns();
  //
  //     }
  //
  //     for (let i = 0; i < array.length; i++) {
  //
  //       const child = body.createChild({
  //         children: columns,
  //         type: "row",
  //       }, index + i);
  //
  //       const content = new KarmaFieldsAlpha.Content(array[i]);
  //
  //       child.import(content);
  //
  //     }
  //
  //   }
  //
  // }





  // getChild(index) {
  //
  //   if (index === "modal") {
  //
  //     return this.createChild({
  //       ...this.resource.modal,
  //       type: "modal",
  //       index: "modal",
  //     }, "modal");
  //
  //   } else {
  //
  //     const query = this.queryItems();
  //
  //     if (!query.loading) {
  //
  //       const items = query.toArray();
  //
  //       if (items[index]) {
  //
  //         return this.createChild({
  //           // id: item.id,
  //           type: "row",
  //           children: this.resource.children,
  //           // loading: item.loading,
  //           // index: index
  //         }, items[index].index);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

  // selectAll() {
  //
  //   const query = this.queryItems();
  //
  //   if (!query.loading) {
  //
  //     this.setSelection({
  //       index: 0,
  //       length: query.toArray().length
  //     });
  //
  //     this.request("render");
  //   }
  //
  // }

  // copy() {
  //
  //   const selection = this.getSelection();
  //   const index = selection.index || 0;
  //   const length = selection.length || 0;
  //
  //   const grid = this.slice(index, length);
  //
  //   if (grid.loading) {
  //
  //     return "loading";
  //
  //   } else {
  //
  //     return grid.toString();
  //
  //   }
  //
  // }
  //
  // paste(value) {
  //
  //   const grid = new KarmaFieldsAlpha.Content.Grid(value);
  //
  //   this.save("paste", "Paste");
  //
  //   const index = this.getSelection("index") || 0;
  //   const length = this.getSelection("length") || 0;
  //
  //   this.insert(grid, index, length);
  //
  //   this.request("render");
  //
  // }

  // getDefaultIndex() {
  //
  //   let index = this.resource.insertAt || this.resource.insertPosition || this.resource.position;
  //
  //   if (index === undefined) {
  //
  //     const items = this.queryItems();
  //
  //     index = items.toArray().length;
  //
  //   }
  //
  //   return index;
  // }
  //
  // add(...path) {
  //
  //   this.save("insert", "Insert");
  //
  //   let index = this.getDefaultIndex();
  //
  //   this.addAt(index, 1);
  //
  //   this.setSelection({index, length: 1});
  //
  //   this.request("render");
  // }


  // addAt(index, length = 1) {
  //
  //   const set = this.getSet();
  //   const defaults = this.parse(this.resource.defaults || {});
  //   const filters = this.getFilters();
  //
  //   if (set.loading || defaults.loading || filters.loading) {
  //
  //     console.warn("adding items while collection not loaded");
  //
  //   } else {
  //
  //     const params = {...filters.toObject(), ...defaults.toObject()};
  //
  //     // let items = query.toArray();
  //
  //     // let collectionIndex;
  //     //
  //     // if (items[index] && items[index].index !== undefined) {
  //     //
  //     //   collectionIndex = items[index].index;
  //     //
  //     // } else {
  //     //
  //     //   collectionIndex = items.length; // add at end
  //     //
  //     // }
  //
  //     set.add(params, index, length);
  //
  //     const body = this.createChild(this.resource.body, "body");
  //
  //     body.create(index, length);
  //
  //     body.setSelection({index, length});
  //
  //   }
  //
  // }



  // getDefaultIndex(...path) {
  //
  //   const selection = this.getSelection(...path);
  //
  //   if (selection && selection.length) {
  //
  //     return selection.index + selection.length;
  //
  //   } else if (this.resource.defaultIndex !== undefined) {
  //
  //     return this.resource.defaultIndex;
  //
  //   } else {
  //
  //     return this.getSet().toArray().length;
  //
  //   }
  //
  // }

  *addAt(index, length =  1, params = {}, ...path) { // path is ["body"] in simple grid

    let set = this.getSet();

    while (set.loading) {

      yield;
      set.query();
    }

    let defaults = this.getDefaultParams();

    while (defaults.loading) {

      yield;
      defaults = this.getDefaultParams();
    }

    const filters = this.getFilters(); // should actually not be a Load

    params = {...filters.toObject(), ...defaults.toObject(), ...params};

    // set.add(params, index, length);

    // const body = this.createChild(this.resource.body, "body");
    // const tokens = [];

    // let index;
    //
    // const selection = this.getSelection(...path);
    //
    // if (selection && selection.length) {
    //
    //   index = selection.index + selection.length;
    //
    // } else if (this.resource.defaultIndex !== undefined) {
    //
    //   index = this.resource.defaultIndex;
    //
    // } else {
    //
    //   index = set.toArray().length;
    //
    // }

    // const index = selection && selection.index + selection.length || this.resource.defaultIndex || set.toArray().length;

    // for (let i = 0; i < length; i++) {
    //
    //   const token = set.addToken(params, index);
    //
    //   tokens.push(token);
    //
    // }

    // const index = this.getDefaultIndex();

    set.add(params, index, length);

    // body.create(index, length);

    // this.lift(path, "create", index, length);
    //
    // this.setSelection({index, length}, ...path);

    // for (let token of tokens) {
    //
    //   yield;
    //
    //   await set.resolveToken(token);
    //
    // }

  }

  // getDefaultIndex() {
  //
  //   if (this.resource.defaultIndex !== undefined) {
  //
  //     return this.resource.defaultIndex;
  //
  //   }
  //
  //   return this.getLength().toNumber();
  // }

  getDefaultParams() {

    return this.parse(this.resource.defaults || {});

  }

  // add(num = 1, params = {}, ...path) {
  //
  //   this.save("insert", "Insert");
  //
  //   // let index = this.getSelection("index") || this.resource.defaultIndex || 0;
  //
  //   // this.parent.addAt(index, 1);
  //
  //   // this.setSelection({index, length: 1});
  //
  //   // const path = this.getRelativeFocus() || ["body"];
  //
  //   // const index = (this.resource.defaultIndex !== undefined) ? this.resource.defaultIndex : 0;
  //
  //   const work = this.addProcess(num, params, "body", ...path);
  //
  //   KarmaFieldsAlpha.works.add(work);
  //
  //   this.request("render");
  // }

  // addAt(index, length, params, ...path) {
  //
  //   const work = this.addProcess(index, num, params, ...path);
  //
  //   KarmaFieldsAlpha.works.add(work);
  //
  // }







  // querySelectedItems() { // compat
  //
  //   const selection = this.getSelection();
  //
  //   const array = [];
  //
  //   for (let i = 0; i < selection.length || 0; i++) {
  //
  //     array.push({index: (selection.index || 0) + i})
  //
  //   }
  //
  //   return new KarmaFieldsAlpha.Content(array);
  //
  // }

  canDelete() {

    // const selection = this.getSelection();
    //
    // return selection && selection.length > 0 || false;

    return this.hasSelection();

  }

  hasSelection() {

    if (this.resource.body) {

      const body = this.createChild(this.resource.body, "body");

      return body.hasSelection();

    }

    return false;

  }

  // deleteSelection() {
  //
  //   this.delete();
  //
  // }

  // delete() {
  //
  //   const selection = this.getSelection();
  //
  //   if (selection && selection.length) {
  //
  //     KarmaFieldsAlpha.History.save("delete", "Delete");
  //
  //     const index = selection.index || 0;
  //     const length = selection.length || 0;
  //
  //     this.removeAt(index, length);
  //
  //     this.removeSelection();
  //
  //     this.request("render");
  //
  //   }
  //
  // }


  *removeAt(index, length) {

    const set = this.getSet();

    while (set.loading) {

      yield;

      set.query();

    }

    set.remove(index, length);

  }


  // remove(collectionIndex, length = 1) { // -> to be renamed remove()
  //
  //   // const collection = this.getCollection();
  //   //
  //   // collection.remove(collectionIndex, length);
  //
  //   this.removeAt(collectionIndex, length);
  //
  // }


  delete() {

    const body = this.createChild(this.resource.body);

    body.delete();

  }

  // delete() {
  //
  //   const index = this.getSelection("index") || 0;
  //   const length = this.getSelection("length") || 0;
  //
  //   if (length) {
  //
  //     this.save("delete", "Delete");
  //
  //     this.parent.removeAt(index, length);
  //
  //     this.removeSelection();
  //
  //     this.request("render");
  //
  //   }
  //
  // }



  duplicate() {

    const body = this.createChild(this.resource.body, "body");

    body.duplicate();

  }




  isRowSelected() {

    return this.hasSelection();
  }

  // getSelectedIds() {
  //
  //   const body = this.getChild("body");
  //
  //   if (body) {
  //
  //     return body.export(undefined, undefined, [{type: "input", key: "id"}]);
  //
  //   }
  //
  //   // const selection = this.createChild(this.resource.body, "body").getSelection();
  //   // const index = selection.index || 0;
  //   // const length = selection.length || 0;
  //   //
  //   // return set.toIds().slice(index, index + length);
  //
  //   return [];
  //
  // }

  getSelectedIds() {

    const body = this.getChild("body");

    if (body) {

      const selection = body.querySelection();

      if (selection) {

        const index = selection.index || 0;
        const length = selection.index || 0;

        return this.getSet().toIds().slice(index, index + length);

      }

    }

    return [];

  }


  // compat
  // getSelectedSet() {
  //
  //   const set = this.getSet();
  //   const selection = this.getSelection();
  //
  //   return set.slice(selection);
  //
  // }

  withdraw() {

    // const content = this.querySelectedItems();

    // if (!content.loading) {
    //
    //   const items = content.toArray();
    //   const ids = items.filter(item => item.id && !item.loading).map(item => item.id);

      const ids = this.getSelectedIds();

      this.save("withdraw", "Insert");

      // KarmaFieldsAlpha.Store.Layer.close();
      this.request("close");

      if (ids.length) {

        // this.request("dispatch", "insert", ids);

        this.dispatch("insert", ids);

      }

      this.request("render");

    // }

  }

  // selectByIds(ids) {
  //
  //   const set = this.getSet();
  //
  //   // if (content.loading) {
  //   //
  //   //   KarmaFieldsAlpha.Store.Tasks.add({
  //   //     type: "selectByIds",
  //   //     resolve: () => this.selectByIds(ids)
  //   //   });
  //   //
  //   // } else {
  //
  //     const array = set.toArray();
  //     let i = 0;
  //     let index = array.findIndex(item => item.id === ids[i]);
  //     const selection = {length: 0};
  //
  //     while (index > -1 && i < ids.length) {
  //
  //       selection.index = index;
  //       selection.length++;
  //
  //       i++;
  //       index = array.findIndex(item => item.id === ids[i]);
  //
  //     }
  //
  //     if (selection.length === ids.length) {
  //
  //       this.setSelection(selection);
  //
  //     } else {
  //
  //        // -> non consecutive ids !
  //
  //     }
  //
  //   }
  //
  // }

  selectByIds(ids) {

    const body = this.getChild("body");
    const set = this.getSet();
    const selection = {index: 0, length: Infinity};

    for (let id of set.toIds()) {

      selection.index = Math.max(selection.index, i);
      selection.length = Math.min(selection.length, i - selection.index + 1);

    }

    if (body && selection.length < Infinity) {

      body.select(selection);

    }

  }


  // deferSelection() { // keep current selection after saving (and items possible reordering)
  //
  //   // const items = this.querySelectedItems();
  //
  //   const set = this.getSelectedSet();
  //
  //   // KarmaFieldsAlpha.Task.add({
  //   //   priority: -1,
  //   //   ids: items.toArray().map(item => item.id),
  //   //   resolve: task => {
  //   //     this.selectByIds(task.ids);
  //   //   }
  //   // });
  //
  //   const work = function*(grid, ids) {
  //
  //     grid.selectByIds(ids);
  //
  //   }
  //
  //   KarmaFieldsAlpha.Jobs.add(work(this, set.toIds()));
  //
  //   this.removeSelection();
  //
  // }

  async *submit() {

    // const updater = new KarmaFieldsAlpha.Updater();

    const ids = this.getSelectedIds();

    // yield* updater.update();

    const delta = this.getDelta();

    for (let driver in delta) {

      yield;

      await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, delta[driver]);

      for (let id in delta) {

        for (let key in delta[id]) {

          KarmaFieldsAlpha.Store.set(delta[id][key], "vars", "remote", driver, id, key);

        }

      }

      // remove from delta buffer without updating history
      KarmaFieldsAlpha.Store.Buffer.remove("state", "delta", "vars", "remote", driver);


      // reset shuttles
      const shuttles = KarmaFieldsAlpha.Store.get("shuttles", "remote", driver);

      for (let shuttle of shuttles) {

        shuttle.init();

      }

    }

    if (ids.length) {

      this.selectByIds(ids);

    }

  }

  isModified(value, driver, id, key) {

    let current = KarmaFieldsAlpha.Store.get("vars", "remote", driver, id, key);

    return !KarmaFieldsAlpha.DeepObject.equal(value, current);

  }

  getDelta() {

    const output = {};
    const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");

    if (delta) {

      for (let driver in delta) {

        for (let id in delta[driver]) {

          for (let key in delta[driver][id]) {

            if (this.isModified(delta[driver][id], driver, id, key)) {

              KarmaFieldsAlpha.DeepObject.set(output, value, driver, id, key);

            }

          }

        }

      }

    }

    return output;

  }

  hasDelta() {

    const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");

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

  submit() {

    const updater = new KarmaFieldsAlpha.Updater();

    updater.save();

    const work = submitProcess();

    KarmaFieldsAlpha.Jobs.add(work);

    // this.lift(["body"], "deferSelection");

    this.render();

  }



}





KarmaFieldsAlpha.field.gridField = class extends KarmaFieldsAlpha.field {

  getLength() {

    return this.parent.getLength();

  }

  getChild(index) {

    if (index === "modal") {

      return this.createChild({
        ...this.resource.modal,
        type: "modal",
      }, "modal");

    } else {

      return this.createChild({
        type: "row",
        children: this.resource.children
      }, index);

    }

  }

  getContent(index, key) {

    if (index === "modal" || index === "*") {

      const selection = {index: 0, length: 0, ...this.getSelection()};

      if (selection.length > 1) {

        return this.parent.getContentRange(selection.index, selection.length, key);

      } else if (length === 1) {

        return this.parent.getContentAt(selection.index, key);

      }

    } else {

      return this.parent.getContentAt(index, key);

    }

  }

  setContent(value, index, key) {

    if (index === "modal" || index === "*") {

      const selection = {index: 0, length: 0, ...this.getSelection()};

      for (let i = 0; i < selection.length; i++) {

        this.parent.setContentAt(value, index + i, key);

      }

    } else {

      this.parent.setContentAt(value, index, key);

    }

  }

  hasSelection() {

    return this.getSelection("length") > 0;

  }

  select(selection) { // to be overrided (ie. Medias grid)

    this.setSelection(selection);

  }

  unselect() { // to be overrided (ie. Medias grid)

    this.removeSelection();

  }

  querySelection() { // to be overrided (ie. Medias grid)

    return this.getSelection();

  }

  // getSelectedIds() {
  //
  //   const set = this.parent.getSet();
  //   const body = this.getChild("body");
  //
  //   if (body) {
  //
  //     return body.getSelectedIds();
  //
  //   }
  //
  //   return [];
  //
  // }

  selectAll() {

    const length = this.getLength();

    this.setSelection({
      index: 0,
      length: length.toNumber()
    });

    this.request("render");

  }

  copy() {

    const index = this.getSelection("index") || 0;
    const length = this.getSelection("length") || 0;

    const grid = this.export(index, length);

    if (grid.loading) {

      return "[loading]";

    } else {

      return grid.toString();

    }

  }

  paste(value) {

    const grid = new KarmaFieldsAlpha.Content.Grid(value);

    this.save("paste", "Paste");

    const index = this.getSelection("index") || 0;
    const length = this.getSelection("length") || 0;

    // this.import(grid, index, length);

    const work = importProcess(grid, index, length);

    KarmaFieldsAlpha.Jobs.add(work);

    this.request("render");

  }

  *removeAt(index, length) {

    yield* this.parent.removeAt();

  }

  delete() {

    const index = this.getSelection("index") || 0;
    const length = this.getSelection("length") || 0;

    if (length) {

      this.save("delete", "Delete");

      const work = this.removeAt(index, length);

      KarmaFieldsAlpha.Jobs.add(work);

      this.removeSelection();

      this.request("render");

    }

  }

  getDefaultIndex() {

    const selection = this.getSelection();

    if (selection && selection.length) {

      return selection.index + selection.length;

    } else if (this.resource.defaultIndex !== undefined) {

      return this.resource.defaultIndex;

    } else {

      return this.getLength().toNumber();

    }

  }

  *addAt(index, length = 1, params = {}) {

    yield* this.parent.addAt(index, length, params);

    this.create(index, length);

    this.setSelection({index, length});

  }

  add() {

    this.save("insert", "Insert");

    const index =  this.getDefaultIndex();


    // this.parent.addAt(index, 1, {}, this.id);
    //
    // this.create(index, 1);
    //
    // this.setSelection({index, length: 1});

    const work = this.addAt(index);

    KarmaFieldsAlpha.works.add(work);



    // let index = this.getSelection("index") || this.resource.defaultIndex || 0;

    // this.parent.addAt(index, 1);

    // this.setSelection({index, length: 1});

    // const path = this.getRelativeFocus() || ["body"];

    // const index = (this.resource.defaultIndex !== undefined) ? this.resource.defaultIndex : 0;

    // const work = this.addProcess(num, params, "body", ...path);
    //
    // KarmaFieldsAlpha.works.add(work);

    this.request("render");
  }

  // async *addProcess(index, length = 1) {
  //
  //   let set = this.parent.getSet();
  //   let defaults = this.parent.getDefaults();
  //   const filters = this.parent.getFilters();
  //
  //   while(set.loading) {
  //
  //     yield;
  //     set = this.parent.getSet();
  //
  //   }
  //
  //   while(defaults.loading) {
  //
  //     yield;
  //     defaults = this.parent.getDefaults();
  //
  //   }
  //
  //   // set.add({...filters.toObject(), ...defaults.toObject()}, index, length);
  //
  //   for (let i = 0; i < length; i++) {
  //
  //     const token = set.addToken(params, index);
  //
  //   // }
  //   //
  //   //
  //   // for (let i = 0; i < length; i++) {
  //
  //     const field = this.createChild({
  //       type: "row",
  //       children: this.resource.children,
  //     }, index + i);
  //
  //     field.create();
  //
  //     if (this.resource.modal) {
  //
  //       const field = this.createChild({
  //         type: "row",
  //         children: this.resource.modal.children,
  //       }, index + i);
  //
  //       field.create();
  //
  //     }
  //
  //     yield;
  //
  //     await set.resolveToken(token);
  //
  //   }
  //
  //   this.setSelection({index, length});
  //
  // }

  create(index, length = 1) {

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

  }

  // add() {
  //
  //   this.save("insert", "Insert");
  //
  //   let index = this.getSelection("index") || this.resource.defaultIndex || 0;
  //
  //   // this.parent.addAt(index, 1);
  //
  //   // this.setSelection({index, length: 1});
  //
  //   KarmaFieldsAlpha.works.add(this.addProcess(index, 1));
  //
  //   this.request("render");
  // }

  *duplicationProcess(index, length) {

    let grid = this.export(index, length);

    while(grid.loading) {

      yield;

      grid = this.export(index, length);

    }

    yield* importProcess(grid, index + length, length);

    this.setSelection({index: index + length, length});

  }

  duplicate() {

    const index = this.getSelection("index") || 0;
    const length = this.getSelection("length") || 0;

    if (length) {

      this.save("duplicate", "Duplicate");

      // const grid = this.export(index, length);
      //
      // this.import(grid, index + length, 0);
      //
      // this.setSelection({index: index + length, length});

      const work = this.duplicationProcess(index, length);

      KarmaFieldsAlpha.works.add(work);

      this.request("render");

    }

  }



  getExportableColumns() {

    if (this.resource.export || this.resource.import) {

      return this.resource.export || this.resource.import;

    } else if (this.resource.modal) {

      return [...this.resource.children, ...this.resource.modal.children];

    } else {

      return this.resource.children;

    }

  }

  // exportKeys(keys, index = this.getSelection("index"), length = this.getSelection("length")) {
  //
  //   const gridContent = new KarmaFieldsAlpha.Content.Grid();
  //
  //   for (let i = 0; i < length; i++) {
  //
  //     const row = [];
  //
  //     for (let key in keys) {
  //
  //       const value = this.getContent(i, key);
  //
  //       row.push(value.toString());
  //
  //     }
  //
  //     gridContent.value.push(row);
  //
  //   }
  //
  //   return gridContent;
  //
  // }

  export(index = this.getSelection("index"), length = this.getSelection("length"), columns = this.getExportableColumns()) {

    const gridContent = new KarmaFieldsAlpha.Content.Grid();

    for (let i = 0; i < length; i++) {

      const rowField = this.createChild({
        type: "row",
        children: columns
      }, index + i);

      const collection = rowField.export();

      if (collection.loading) {

        gridContent.loading = true;

      } else {

        gridContent.value.push(collection.toArray());

      }

    }

    return gridContent;

  }

  importProcess(grid, index, length, columns) {

    // while (grid.loading) {
    //
    //   yield;
    //
    // }

    const array = grid.toArray();

    if (array.length < length) {

      yield* this.removeAt(index + array.length, length - array.length);

    } else if (array.length > length) {

      yield* this.addAt(index + length, array.length - length);

    }

    for (let i = 0; i < array.length; i++) {

      const child = this.createChild({
        children: columns,
        type: "row",
      }, index + i);

      const content = new KarmaFieldsAlpha.Content(array[i]);

      child.import(content);

    }

  }

  import(grid, index = this.getSelection("index"), length = this.getSelection("length"), columns = this.getExportableColumns()) {

    const work = this.importProcess(grid, index , length, columns);

    KarmaFieldsAlpha.Jobs.add(work);

    // const array = grid.toArray();
    //
    // if (array.length < length) {
    //
    //   this.parent.removeAt(index + array.length, length - array.length);
    //
    // } else if (array.length > length) {
    //
    //   this.parent.addAt(index + length, array.length - length);
    //
    // }
    //
    // for (let i = 0; i < array.length; i++) {
    //
    //   const child = this.createChild({
    //     children: columns,
    //     type: "row",
    //   }, index + i);
    //
    //   const content = new KarmaFieldsAlpha.Content(array[i]);
    //
    //   child.import(content);
    //
    // }

  }


}









KarmaFieldsAlpha.field.tableField = class extends KarmaFieldsAlpha.field.table {

  getParams() {

    // return KarmaFieldsAlpha.Store.Layer.getCurrent("params");


    const params = this.parse(this.resource.params);

    // console.log(params);

    return params;

  }

  getParam(key) {

    const params = this.getParams();
    const content = new KarmaFieldsAlpha.Content();

    if (params.loading) {

      content.value = params.toObject()[key];

    } else {

      content.loading = true;

    }

    return content;

    // return this.getParams().get(key);

  }

  setParam(value, key) {

    // KarmaFieldsAlpha.Store.Layer.setParam(value, key);
    //
    // this.request("render");

  }

  export() {

    const output = new KarmaFieldsAlpha.Content();

    if (this.resource.export !== false) {

      const grid = this.slice();

      if (grid.loading) {

        output.loading = true;

      } else {

        output.value = grid.toString();

      }

    }


    return output;
  }

  import() {

  }

  // getFilters() {
  //
  //   // const {page, ppp, order, orderby, ...params} = KarmaFieldsAlpha.Store.Layer.getParams() || {};
  //
  //   return this.getParams();
  //
  // }



  build() {

    return {
      class: "grid-field",
      update: grid => {

        const id = this.parent.getContent("id");


        const isMixed = Boolean(id.mixed);

        grid.children = [
          {
            class: "mixed-content",
            update: node => {
              node.element.classList.toggle("hidden", !isMixed);
              if (isMixed) {

                node.element.innerHTML = "[mixed content]";
              }
            }
          },
          {
            class: "single-content",
            update: node => {
              node.element.classList.toggle("hidden", isMixed);
              if (!isMixed) {

                node.children = [
                  {
                    class: "table grid grid-field-body",
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

                      // const query = this.getQuery();
                      const query = this.queryItems();

                      // console.log(query);

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
                                            this.select();
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

                              const field = row.createChild(columns[j], j);


                              grid.children.push({
                                class: "td table-cell",
                                init: td => {
                                  if (columns[j].style) {
                                    td.element.style = columns[j].style;
                                  }
                                },
                                update: td => {
                                  td.element.classList.toggle("selected", Boolean(isRowSelected));
                                  td.element.classList.toggle("odd", i%2 === 0);
                                  td.element.classList.toggle("last-row", i === items.length-1);
                                  td.element.classList.toggle("first-cell", j === 0);
                                  td.element.classList.toggle("last-cell", j === columns.length - 1);

                                },
                                child: field.build()
                              });


                            }

                          }

                          // const footerCells = this.buildFooterCells(columns);



                          // if (this.resource.footer) {
                          //
                          //   grid.children.push({
                          //     class: "tf table-cell",
                          //     init: node => {
                          //       node.element.style.gridColumn = `span ${columns.length}`;
                          //     },
                          //     child: this.createChild(this.resource.footer, "footer").build()
                          //   });
                          //
                          // }

                          grid.element.style.gridTemplateColumns = columns.map(resource => resource.width || "auto").join(" ");

                        } else {
                          grid.children = [];
                          grid.element.classList.remove("filled");
                        }

                      }

                    }

                  },
                  {
                    class: "grid-field-footer simple-buttons",
                    update: node => {
                      if (this.resource.footer !== false) {
                        node.child = this.createChild({
                          type: "group",
                          display: "flex",
                          children: ["add", "delete"],
                          ...this.resource.footer
                        }, "footer").build();
                      }
                    }
                  }
                ];
              }
            }
          }
        ];
      }
    };

  }
  //
  // buildFooterCells(columns) {
  //
  //   if (this.resource.footer) {
  //
  //     return [{
  //       class: "tf table-cell",
  //       init: node => {
  //         node.element.style.gridColumn = `span ${columns.length}`;
  //       },
  //       child: this.createChild(this.resource.footer, "footer");
  //     }]
  //
  //   }
  //
  //
  // }

}


KarmaFieldsAlpha.field.gridField.add = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      request: ["add"],
      title: "Add",
      text: "Add",
      ...resource
    });
  }
}

KarmaFieldsAlpha.field.gridField.delete = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      request: ["delete"],
      title: "Delete",
      text: "Delete",
      enabled: ["request", "getSelectedItems"],
      ...resource
    });
  }

}
