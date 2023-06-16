
KarmaFieldsAlpha.field.saucer = class extends KarmaFieldsAlpha.field {

  // static pile = [];

  constructor(resources) {
    super(resources);

    // this.pile = [];

    // KarmaFieldsAlpha.tables = this; // -> debug
    //
    // this.buffer = new KarmaFieldsAlpha.Buffer();
    //
    // this.dataBuffer = new KarmaFieldsAlpha.Buffer("data");
    // this.initialBuffer = new KarmaFieldsAlpha.Buffer("gateway");
    // this.trashBuffer = new KarmaFieldsAlpha.Buffer("trash");

  }

  // getResource(tableId) {
  //
  //   if (!tableId) {
  //
  //     tableId = KarmaFieldsAlpha.Nav.get("table");
  //
  //   }
  //
  //   const resource = this.resource.tables.find(resource => resource.id === tableId);
  //
  //   if (resource) {
  //
  //     // compat
  //
  //     if (resource.columns) {
  //       resource.children = resource.columns.map(column => {
  //         return {
  //           ...column,
  //           ...column.field
  //         };
  //       });
  //     }
  //
  //     if (resource.children) {
  //
  //       resource.body = {
  //         type: "table",
  //         children: resource.children,
  //         id: resource.driver,
  //         params: resource.params,
  //         joins: resource.joins,
  //         ...resource.body
  //       }
  //
  //       if (typeof resource.driver === "string") {
  //
  //         const [request, ...joins] = resource.driver.split("+");
  //         const [driver, paramString] = request.split("?");
  //
  //         resource.body.driver = driver;
  //         resource.body.params = KarmaFieldsAlpha.Params.parse(paramString);
  //         resource.body.joins = joins
  //
  //       } else if (resource.driver && typeof resource.driver === "object") {
  //
  //         resource.body.driver = resource.driver.name;
  //         resource.body.params = resource.params || resource.driver.params;
  //         resource.body.joins = resource.joins || resource.driver.joins || [];
  //
  //       }
  //
  //       if (resource.style) {
  //         resource.body.style = resource.style;
  //       }
  //
  //     }
  //
  //   }
  //
  //   return resource;
  // }

  getGrid(tableId) {

    if (!tableId) {

      tableId = this.getTable();

    }

    if (tableId) {

      // return this.follow({[tableId]: {body: {final: true}}}, (field, selection) => field);

      const table = this.createChild({
        type: "table",
        ...this.resource.tables[tableId],
        index: tableId
      });

      return table.createChild({
        ...table.resource.body,
        index: "body"
      });

    }

  }


  // getGridBeta(tableId) {
  //
  //   if (this.resource.tables && this.resource.tables[tableId] && this.resource.tables[tableId].body) {
  //
  //     return this.getChild(
  //       {
  //         type: "table",
  //         ...this.resource.tables[tableId],
  //         index: tableId
  //         // uid: `${this.resource.uid}-${tableId}`
  //       },
  //       {
  //         ...this.resource.tables[tableId].body,
  //         index: "body"
  //         // uid: `${this.resource.uid}-${tableId}-body`
  //       }
  //     );
  //
  //   }
  //
  // }

  // async save() {
  //
  //   const data = this.dataBuffer.get();
  //   KarmaFieldsAlpha.saving = true;
  //
  //   this.initialBuffer.merge(data); // -> needed for autosave
  //
  //
  //
  //
  //
  //   for (let driver in data) {
  //
  //     for (let id in data[driver]) {
  //
  //       await this.render();
  //
  //       await KarmaFieldsAlpha.Gateway.post(`update/${driver}/${id}`, data[driver][id]);
  //
  //     }
  //
  //   }
  //
  //   KarmaFieldsAlpha.saving = false;
  //
  //   this.dataBuffer.remove();
  //
  //   await this.render();
  //
  // }


  getData() {

    if (!KarmaFieldsAlpha.field.data) {

      KarmaFieldsAlpha.field.data = {};

    }

    if (!KarmaFieldsAlpha.field.data[this.resource.index]) {

      KarmaFieldsAlpha.field.data[this.resource.index] = {};

    }

    return KarmaFieldsAlpha.field.data[this.resource.index];

    // return KarmaFieldsAlpha.field.getData();

  }

  getParam(key) {

    console.error("deprecated");

    // const state = KarmaFieldsAlpha.History.getState();
    //
    // if (state.nav && state.nav[key] !== undefined) {
    //
    //   return [state.nav[key]];
    //
    // }
    //
    // return [];

    // if (key === "table") {
    //
    //   // return KarmaFieldsAlpha.Query.table;
    //   return KarmaFieldsAlpha.Store.get("table");
    //
    // }

    // if (KarmaFieldsAlpha.Query.params) {
    //
    //   return KarmaFieldsAlpha.Query.params[key];
    //
    // }

    return KarmaFieldsAlpha.Store.getParam(key);

  }

  // setParam(value, key) {
  //
  //   const currentValue = this.getParam(key) || "";
  //
	// 	if (value !== currentValue) {
  //
  //     KarmaFieldsAlpha.History.backup(value || null, currentValue || null, "params", key);
  //     KarmaFieldsAlpha.Store.set(value, "params", key);
  //
  //     const page = KarmaFieldsAlpha.Store.get("params", "page") || 1;
  //
  //     if (key !== "page" && page !== 1) {
  //
  //       KarmaFieldsAlpha.History.backup(null, page, "params", "page");
  //       KarmaFieldsAlpha.Store.remove("params", "page");
  //
  //     }
  //
  //     const ids = KarmaFieldsAlpha.Store.get("ids");
  //
  //     if (ids) {
  //
  //       KarmaFieldsAlpha.History.backup(null, ids, "ids");
  //       KarmaFieldsAlpha.Store.remove("ids");
  //
  //     }
  //
  //     const selection = this.getSelection();
  //
  //     if (selection) {
  //
  //       this.setSelection();
  //
  //     }
  //
  //     // KarmaFieldsAlpha.History.setState(state);
  //
  //     // this.save();
  //     this.render();
  //
	// 	}
  //
  //
  //
  // }

  setParam(value, key) {

    console.error("deprecated");

    // const currentValue = this.getParam(key) || "";
    // value = value || "";
    //
		// if (value !== currentValue) {

      // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "params", key)) {
      //
      //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, this.getParam(key), "last", "params", key);
      //
      // }
      //
      // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, value || "", "next", "params", key);
      //
      // KarmaFieldsAlpha.Store.set(value || "", "params", key);

      KarmaFieldsAlpha.Store.setParam(value || "", key);

		// }



  }



  getValue(key) {

    const param = KarmaFieldsAlpha.Store.getParam(key);

    return KarmaFieldsAlpha.Type.toArray(param);

  }

  setValue(value, key) {

    value = KarmaFieldsAlpha.Type.toString(value) || "";

    KarmaFieldsAlpha.Store.setParam(value, key);

    const page = KarmaFieldsAlpha.Store.getParam("page") || 1;

    if (key !== "page" && page !== 1) {

      KarmaFieldsAlpha.Store.setParam(1, "page");

    }

    // const ids = this.getIds();
    //
    // if (ids) {
    //
    //   KarmaFieldsAlpha.History.backup(null, ids, "ids");
    //   KarmaFieldsAlpha.Store.remove("ids");
    //
    // }

    KarmaFieldsAlpha.Store.removeIds();

    // const selection = this.getSelection();
    //
    // if (selection) {
    //
    //   this.setSelection();
    //
    // }

    KarmaFieldsAlpha.Store.setSelection({});

    // KarmaFieldsAlpha.History.setState(state);

    // this.save("nav");
    this.render();


  }

  getTable() {

    return KarmaFieldsAlpha.Store.getTable();

  }

  setTable(table) {

    // const currentTable = this.getTable();
    //
    // if (table !== currentTable) {
    //
    //   if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "table")) {
    //
    //     KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, currentValue || "", "last", "table");
    //
    //   }
    //
    //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, table || "", "next", "table");
    //
    //   KarmaFieldsAlpha.Store.set(table, "table");
    //
    // }

    KarmaFieldsAlpha.Store.setTable(table);

    KarmaFieldsAlpha.Store.removeParams();
    KarmaFieldsAlpha.Store.removeIds();
    KarmaFieldsAlpha.Store.setSelection({});


  }

  getParams() {

    console.error("deprecated");

    // return KarmaFieldsAlpha.Store.get("params") || {};

    return KarmaFieldsAlpha.Store.getParams();

  }

  setParams(params = {}) {

    console.error("deprecated");

    // const currentParams = KarmaFieldsAlpha.Store.get("params") || {};
    //
    // for (let i in {...params, ...currentParams}) {
    //
    //   // KarmaFieldsAlpha.History.backup(params[i] || null, currentParams[i] || null, "nav", i);
    //   // KarmaFieldsAlpha.Store.set(params[i], "params", i);
    //
    //   KarmaFieldsAlpha.Store.setParam(params[i], i);
    //
    // }

    KarmaFieldsAlpha.Store.setParams(params);

  }

  getIds() {

    console.error("deprecated");

    return KarmaFieldsAlpha.Store.get("ids");

  }

  setIds(ids) {

    console.error("deprecated");

    // const currentIds =  KarmaFieldsAlpha.Store.get("ids");
    //
    // KarmaFieldsAlpha.History.backup(ids || null, currentIds, "ids");
    // KarmaFieldsAlpha.Store.set(ids, "ids");

    // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "ids")) {
    //
    //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, this.getIds() || [], "last", "ids");
    //
    // }
    //
    // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, ids, "next", "ids");
    // KarmaFieldsAlpha.Store.set(ids, "ids");

    KarmaFieldsAlpha.Store.setIds(ids);

  }

  removeIds(ids) {

    console.error("deprecated");

    // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "ids")) {
    //
    //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, this.getIds() || [], "last", "ids");
    //
    // }
    //
    // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, [], "next", "ids");
    // KarmaFieldsAlpha.Store.remove("ids");

    KarmaFieldsAlpha.Store.removeIds();


    // if (!KarmaFieldsAlpha.Buffer.has("history", "last", "ids")) {
    //
    //   KarmaFieldsAlpha.Buffer.set(this.getIds() || [], "history", "last", "ids");
    //
    // }
    //
    // KarmaFieldsAlpha.Buffer.set([], "history", "next", "ids");
    // KarmaFieldsAlpha.Store.remove("ids");

  }


  modified(...path) {

    // return KarmaFieldsAlpha.Terminal.modified(...path);

    return false;

  }

  addTask(callback) {

    const data = this.getData();

    if (!data.tasks) {

      data.tasks = [];

    }

    data.tasks.push(callback);

  }

  getTasks() {

    return this.getData().tasks || [];

  }

  doTasks() {

    const tasks = this.getData().tasks;

    let task = tasks && tasks.shift();

    while(task) {

      task();

      task = tasks.shift();

    }

  }


  save(name) {


    // this.addTask(() => KarmaFieldsAlpha.History.save(work));


    // KarmaFieldsAlpha.History.save(work);


    KarmaFieldsAlpha.Backup.save(`${this.resource.index}-${name}`);

  }

  undo() {

    KarmaFieldsAlpha.History.undo();

    if (KarmaFieldsAlpha.History.useNative === false) {

      this.render();

    }

  }

  redo() {

    KarmaFieldsAlpha.History.redo();

    if (KarmaFieldsAlpha.History.useNative === false) {

      this.render();

    }

  }

  hasUndo() {
    return KarmaFieldsAlpha.History.hasUndo();
  }

  hasRedo() {
    return KarmaFieldsAlpha.History.hasRedo();
  }

  getSelection() {

    // return KarmaFieldsAlpha.Selection.get(this.resource.index);


    // return KarmaFieldsAlpha.Store.get("selection", this.resource.index) || {};

    const selection = KarmaFieldsAlpha.Store.getSelection();

    return selection[this.resource.index] || {};



    // return {[this.resource.index]: selection};

  }

  setSelection(selection) {


    // KarmaFieldsAlpha.Store.setSelection(selection && {[this.resource.index]: selection});



    selection = {[this.resource.index]: selection};

    Object.freeze(selection);

    KarmaFieldsAlpha.Backup.update(selection, "selection");
    KarmaFieldsAlpha.Store.set(selection, "selection");


  }

  hasSelection() {

    // const selection = KarmaFieldsAlpha.Store.get("selection", this.resource.index);
    const selection = this.getSelection();

    const table = this.getTable();

    return Boolean(table && selection && selection[table]);

  }

  follow(selection, callback) {

    if (!selection) {

      selection = this.getSelection();

    }

    if (selection) {

      if (selection.final) {

        return callback(this, selection);

      } else if (this.resource.tables) {

        for (let i in this.resource.tables) {

          if (selection[i]) {

            const child = this.createChild({type: "table", ...this.resource.tables[i], index: i, uid: `${this.resource.uid}-${i}`});

            return child.follow(selection[i], callback);

          }

        }

      }

    }

  }

  paste(string) {

    const selection = this.getSelection();

    if (selection) {

      this.follow(selection, (field, selection) => {

        field.import([string], selection.index, selection.length, selection.colIndex, selection.colLength);

        // const [current] = field.export([], selection.index, selection.length);
        //
        // if (string !== current) {
        //
        //   field.import([string], selection.index, selection.length);
        //
        // }

        field.save("paste");

        this.render();

      });

    }

  }

  copy() {

    const selection = this.getSelection() || {};

    return this.follow(selection, (field, selection) => {

      return field.export([], selection.index, selection.length, selection.colIndex, selection.colLength);

    });

  }

  // cut() {
  //
  //   const selection = this.getSelection();
  //
  //   if (selection) {
  //
  //     this.follow(selection, (field, selection) => {
  //
  //       field.remove(selection.index, selection.length, selection.colIndex, selection.colLength);
  //
  //       this.save(`${field.resource.uid}-cut`);
  //
  //       this.render();
  //
  //     });
  //
  //   }
  //
  // }

  // delete() {
  //
  //   const selection = this.getSelection();
  //
  //   if (selection) {
  //
  //     this.follow(selection, (field, selection) => {
  //
  //       field.remove(selection.index, selection.length, selection.colIndex, selection.colLength);
  //
  //       this.save(`${field.resource.uid}-cut`);
  //
  //       this.render();
  //
  //     });
  //
  //   }
  //
  // }


  // paste(value, selection) {
  //
  //   if (selection && this.resource.tables) {
  //
  //     for (let i in this.resource.tables) {
  //
  //       if (selection[i]) {
  //
  //         const child = this.createChild({type: "table", ...this.resource.tables[i], index: i});
  //
  //         child.paste(value, selection[i]);
  //
  //         break;
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

  // clearSelection() {
  //
  //   const selection = this.getSelection();
  //
  //   if (selection) {
  //
  //     for (let tableId in this.resource.tables) {
  //
  //       if (selection[tableId]) {
  //
  //         const table = this.createChild({
  //           type: "table",
  //           ...this.resource.tables[tableId],
  //           index: tableId
  //         });
  //
  //         table.clearSelection(selection[tableId]);
  //
  //       }
  //
  //     }
  //
  //   } else {
  //
  //     this.setSelection();
  //
  //   }
  //
  // }

  send() {

    KarmaFieldsAlpha.Query.send();

    this.render();
  }

  hasChange() {
// debugger;
    return !KarmaFieldsAlpha.DeepObject.include(KarmaFieldsAlpha.Query.vars, KarmaFieldsAlpha.Store.get("delta"));

  }

  hasTask() {
// debugger;
    return KarmaFieldsAlpha.Query.tasks.length > 0;

  }

  open(table) {

    this.setTable(table);
    // this.setSelection();
    // this.setParams();
    // this.setIds();

    this.save("open");
    this.render();
  }

  close() {

    // const currentTable = KarmaFieldsAlpha.Store.get("table");
    // const ids = KarmaFieldsAlpha.Store.get("ids");
    // const selection = KarmaFieldsAlpha.Store.get("selection");
    //
    // KarmaFieldsAlpha.History.backup(null, currentTable, "table");
    // KarmaFieldsAlpha.History.backup(null, ids, "ids");
    // KarmaFieldsAlpha.History.backup(null, ids, "ids");
    //
    // KarmaFieldsAlpha.Store.remove("table");
    // KarmaFieldsAlpha.Store.remove("ids");

    const transfer = this.popTransfer();

    if (transfer) {

      KarmaFieldsAlpha.Store.setTable(transfer.table);
      KarmaFieldsAlpha.Store.setParams(transfer.params);
      KarmaFieldsAlpha.Store.setSelection(transfer.selection);
      KarmaFieldsAlpha.Store.setIds(transfer.ids);

    } else {

      this.setTable();
      // this.setSelection();
      // this.setParams();
      // this.setIds();

    }

    this.save("close");
    this.render();

  }

  getPage() {
    return KarmaFieldsAlpha.Store.getParam("page") || 1;
  }

  count() {

    const grid = this.getGrid();

    if (grid) {

      const driver = grid.resource.driver;
      const params = grid.getCountParams();

      return KarmaFieldsAlpha.Query.getCount(driver, params);

    }

    return 0;
  }

  ppp() {

    const grid = this.getGrid();

    if (grid) {

      const params = grid.getParams();

      return params.ppp || 100;

    }

    return 1;
  }

  getNumPage() {

    const count = this.count();

    if (count !== undefined) {

      const ppp = this.ppp();

      return Math.max(1, Math.ceil(count/ppp));

    }

  }

  isFirstPage() {
    return this.getPage() === 1;
  }

  isLastPage() {
    return this.getPage() === this.getNumPage();
  }

  firstPage() {

    const page = this.getPage();

    if (page > 1) {

      this.setParam(1, "page");

    }

  }

  prevPage() {

    const page = this.getPage();

    if (page > 1) {

      this.setParam(page-1, "page");

    }

  }

  nextPage() {

    const page = this.getPage();
    const numPage = this.getNumPage();

    if (page < numPage) {

      this.setParam(page+1, "page");

    }

  }

  lastPage() {

    const page = this.getPage();
    const numPage = this.getNumPage();

    if (page < numPage) {

      this.setParam(numPage, "page");

    }

  }



  add(params = {}) {

    const grid = this.getGrid();

    if (grid && grid.add) {

      const selection = grid.getSelection() || {};

      grid.add(selection.index || 0, params);

      this.render();

    }

  }

  delete() {

    const selection = this.getSelection();

    if (selection) {

      this.follow(selection, (grid, selection) => grid.remove(selection.index, selection.length));

    }

  }

  canDelete() {

    const selection = this.getSelection();

    if (selection) {

      return Boolean(this.follow(selection, (field, selection) => selection.length && field.remove));

    }

    return false;
  }



  // async render() {
  //
  //   // this.debounce("rendering", () => void popup.render(), 500);
  //
  //   if (!this.rendering && this.onRender) {
  //
  //     this.rendering = true;
  //
  //     this.renderPromise = this.onRender();
  //
  //   }
  //
  //   await this.renderPromise;
  // }

  // async render() {
  //
  //   await this.renderPromise;
  //
  //   if (this.onRender) {
  //
  //     this.renderPromise = this.onRender();
  //
  //   }
  //
  //   return this.renderPromise;
  // }

  async render() {

    if (this.rendering) {

      return this.renderPromise;

    } else if (this.onRender) {

      // console.log("sauce render");

      this.renderPromise = this.onRender().then(() => this.rendering = false);

      this.rendering = true;

      return this.renderPromise;

    }

    // await this.renderPromise;



    // return this.renderPromise;
  }




  // removeIds() {
  //
  //   this.setIds();
  //
  // }

  fetch(tableId, params) {

    if (this.resource.tables && this.resource.tables[tableId] && this.resource.tables[tableId].body) {

      // const selection = this.getSelection();

      this.addTransfer({
        selection: KarmaFieldsAlpha.Store.getSelection(),
        table: KarmaFieldsAlpha.Store.getTable(),
        params: KarmaFieldsAlpha.Store.getParams(),
        ids: KarmaFieldsAlpha.Store.getIds()
      });

      KarmaFieldsAlpha.Store.setTable(tableId);

      // const params = this.resource.tables[tableId].body.params || {};

      KarmaFieldsAlpha.Store.setParams(params);
      KarmaFieldsAlpha.Store.removeIds();
      KarmaFieldsAlpha.Store.setSelection({});

      this.save(`${tableId}-body-open`);
      // this.save("insert");

      this.render();

    }



  }


  getTransfers(transfers) {

    console.log("deprecated");

    return KarmaFieldsAlpha.Store.getTransfers() || [];

  }

  setTransfers(transfers) {

    console.log("deprecated");

    // const transfers = KarmaFieldsAlpha.Store.get("transfers") || [];
    //
    // const newTransfers = [transfer, ...transfers];
    //
    // KarmaFieldsAlpha.History.backup(newTransfers, transfers, "transfers");
    // KarmaFieldsAlpha.Store.set(newTransfers, "transfers");


    // if (!KarmaFieldsAlpha.DeepObject.has(KarmaFieldsAlpha.history, "last", "transfers")) {
    //
    //   KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, this.getTransfers(), "last", "transfers");
    //
    // }
    //
    // KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.history, transfers || [], "next", "transfers");
    //
    // KarmaFieldsAlpha.Store.set(transfers || [], "transfers");

     KarmaFieldsAlpha.Store.setTransfers(transfers);

  }



  setTransfer(transfer) {

    console.log("deprecated");

    // const transfers = KarmaFieldsAlpha.Store.get("transfers") || [];
    //
    // const newTransfers = [transfer, ...transfers];
    //
    // KarmaFieldsAlpha.History.backup(newTransfers, transfers, "transfers");
    // KarmaFieldsAlpha.Store.set(newTransfers, "transfers");

    this.addTransfer(transfer);

  }

  addTransfer(transfer) {

    const transfers = KarmaFieldsAlpha.Store.getTransfers();

    KarmaFieldsAlpha.Store.setTransfers([transfer, ...transfers]);

  }

  getTransfer() {

    // const transfers = KarmaFieldsAlpha.Store.get("transfers") || [];
    //
    // if (transfers.length) {
    //
    //   const [transfer, ...newTransfers] = transfers;
    //
    //   KarmaFieldsAlpha.History.backup(newTransfers, transfers, "transfers");
    //   KarmaFieldsAlpha.Store.set(newTransfers, "transfers");
    //
    //   return transfer;
    //
    // }

    return this.pickTransfer();
  }

  pickTransfer() {

    const transfers = KarmaFieldsAlpha.Store.getTransfers();

    if (transfers.length) {

      KarmaFieldsAlpha.Store.setTransfers(transfers.slice(1));

      return transfers[0];

    }

  }

  hasTransfer() {

    // const transfers = KarmaFieldsAlpha.Store.get("transfers") || [];

    return KarmaFieldsAlpha.Store.getTransfers().length > 0;

  }



  async insert() {

    const transfer = this.pickTransfer();

    if (transfer) {

      const currentSelection = this.getSelection();

      const ids = this.follow(currentSelection, field => field.getSelectedIds && field.getSelectedIds());

      if (ids && ids.length) {



        KarmaFieldsAlpha.Store.setTable(transfer.table);
        KarmaFieldsAlpha.Store.setParams(transfer.params);
        KarmaFieldsAlpha.Store.setSelection(transfer.selection);
        KarmaFieldsAlpha.Store.setIds(transfer.ids);

        // this.addTask(() => this.follow(transfer.selection, (field, selection) => field.insert && field.insert(ids, selection.index, selection.length)));

        // this.follow(transfer.selection, (field, selection) => field.insert && field.insert(ids, selection.index, selection.length));
        //
        // this.save("insert");

        // await this.render();

        this.follow(transfer.selection, (field, selection) => {
          field.insert && field.insert(ids, selection.index, selection.length)
          field.save("insert");
        });



        await this.render();

        // this.follow(transfer.selection, (field, selection) => field.insert && field.insert(ids, selection.index, selection.length));

        // this.save();

      }

    }

  }

  multiple() {

    return false;

  }

  async upload(files, index = 0, length = 0) {

    const tableId = this.getTable();

    if (tableId !== "files") {

      this.setTable("files");

      await this.render();

    }

    const grid = this.getGrid("files");

    const selection = grid.getSelection() || {};

    grid.upload(files, selection.index || 0, length);




    // const grid = this.getGrid();
    //
    // if (grid && grid.upload) {
    //
    //   const {index: index = 0} = grid.getSelection() || {};
    //
    //   grid.upload(files, index, length);
    //
    //   this.render();
    //
    // }


  }

  // async regen(ids) {
  //
  //   KarmaFieldsAlpha.Query.regen(ids);
  //
  // }







  // async request(subject, content = {}, ...path) {
  //
  //   switch (subject) {
  //
  //     // single
  //
  //     // case "state": {
  //     //   const [key] = path;
  //     //   return {value: KarmaFieldsAlpha.Nav.get(key) || ""};
  //     // }
  //
  //     case "get": {
  //       const [key] = path;
  //       return KarmaFieldsAlpha.Type.toArray(KarmaFieldsAlpha.Nav.get(key) || "");
  //     }
  //
  //     case "set": {
  //       const [key] = path;
  //
  //       const value = KarmaFieldsAlpha.Type.toString(content) || "";
  //       const current = KarmaFieldsAlpha.Nav.get(key) || "";
  //
  //       if (value !== current) {
  //
  //         KarmaFieldsAlpha.Nav.change(value, current, key);
  //
  //         const page = KarmaFieldsAlpha.Nav.get("page") || "1";
  //
  //         if (page !== "1") {
  //
  //           KarmaFieldsAlpha.Nav.change(1, page, "page");
  //
  //         }
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "modified": {
  //
  //       const delta = this.dataBuffer.get();
  //
  //   		if (delta) {
  //
  // 			  // return KarmaFieldsAlpha.DeepObject.differ(delta, {
  //         //   ...await this.trashBuffer.get(),
  //         //   ...await this.initialBuffer.get()
  //         // });
  //
  //         return KarmaFieldsAlpha.DeepObject.differ(delta, KarmaFieldsAlpha.Query.vars);
  //
  //
  //   		}
  //
  //   		return false;
  //
  //
  //       // const table = this.getTable();
  //       //
  //       // if (table && table.isModified) {
  //       //
  //       //   return table.isModified();
  //       //
  //       // }
  //       //
  //       // return false;
  //     }
  //
  //     case "query-ids": // -> compat
  //     case "load": {
  //       const table = this.getTable();
  //
  //       // if (table && table.load) {
  //
  //       //   await table.load();
  //
  //       // }
  //
  //       break;
  //     }
  //
  //     // -> like get_post()
  //     // -> for media breadcrumb (ancestors)
  //     // DEPRECATED
  //     case "queryid": {
  //
  //       const table = this.getTable();
  //
  //
  //       if (table && table.query) {
  //
  //         // const [result] = await table.query({
  //         //   ids: [content.id]
  //         // });
  //
  //         // return result;
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "edit": {
  //
  //       const table = this.getTable();
  //
  //       if (table) {
  //
  //         if (table.unselect) {
  //
  //           table.unselect(); // when filter change
  //
  //         }
  //
  //         // table.cache.empty(); // buffer need to stay for history
  //
  //         // await table.load();
  //
  //
  //         KarmaFieldsAlpha.Query.reset();
  //
  //         this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "has-undo": {
  //       return KarmaFieldsAlpha.History.hasUndo();
  //     }
  //
  //     case "has-redo": {
  //       return KarmaFieldsAlpha.History.hasRedo();
  //     }
  //
  //     case "reload": {
  //
  //       const table = this.getTable();
  //
  //       if (table) {
  //
  //         // table.initialBuffer.empty();
  //         // table.cache.empty();
  //
  //         // await table.load();
  //
  //         KarmaFieldsAlpha.Query.empty();
  //
  //         this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "export": {
  //
  //       const table = this.getTable();
  //
  //       if (table) {
  //
  //         return table.export(content.keys, content.index, content.length);
  //
  //       }
  //
  //       break;
  //
  //     }
  //
  //     case "import": {
  //
  //       const table = this.getTable();
  //
  //       if (table) {
  //
  //         const data = content.data || [];
  //         const index = content.index || 9999999;
  //         const length = content.length || 0;
  //
  //         if (data.length || content.length > 0) {
  //
  //           KarmaFieldsAlpha.History.save();
  //
  //           table.import(data, index, length);
  //
  //           this.render();
  //
  //         }
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "save": {
  //
  //       // const data = this.dataBuffer.get();
  //
  //   		// this.initialBuffer.merge(data); // -> needed for autosave
  //
  //       // for (let driver in data) {
  //
  //     	// 	for (let id in data[driver]) {
  //
  //     	// 		await KarmaFieldsAlpha.Gateway.post(`update/${driver}/${id}`, data[driver][id]);
  //
  //     	// 	}
  //
  //       // }
  //
  //   		// this.dataBuffer.remove();
  //
  //       this.save();
  //
  //       // this.render();
  //
  //
  //
  //       // const table = this.getTable();
  //       //
  //       // if (table && table.send) {
  //       //
  //       //   await table.send();
  //       //   await this.render();
  //       //
  //       // }
  //
  //       break;
  //     }
  //
  //     case "undo": {
  //       KarmaFieldsAlpha.History.undo();
  //       return this.render();
  //     }
  //
  //     case "redo": {
  //       KarmaFieldsAlpha.History.redo();
  //       return this.render();
  //     }
  //
  //     case "close": {
  //
  //       const table = this.getTable();
  //
  //       if (table) {
  //
  //         // if (table.cache) {
  //
  //         //   table.cache.empty(); // buffer need to stay for history
  //
  //         // }
  //
  //         KarmaFieldsAlpha.History.save();
  //
  //         if (table.unselect) {
  //
  //           table.unselect();
  //
  //         }
  //
  //         // await table.unload();
  //
  //         KarmaFieldsAlpha.Nav.remove();
  //         KarmaFieldsAlpha.History.buffer.remove("history"); // ?
  //
  //         KarmaFieldsAlpha.Query.empty();
  //
  //         this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "prev": {
  //       // let selection = this.interface.selectionBuffer.get();
  //       // if (selection && selection.index > 0) {
  //       //   KarmaFieldsAlpha.History.save();
  //       //   this.interface.select(selection.index - 1, 1);
  //       //   await this.render();
  //       // }
  //       break;
  //     }
  //
  //     case "next": {
  //       // let selection = this.interface.selectionBuffer.get();
  //       // const ids = this.interface.getIds();
  //       // if (selection && selection.index < ids.length - 1) {
  //       //   KarmaFieldsAlpha.History.save();
  //       //   this.interface.select(selection.index + 1, 1);
  //       //   await this.render();
  //       // }
  //       break;
  //     }
  //
  //
  //
  //
  //
  //     // collections
  //
  //     case "selection": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getSelection) {
  //
  //         return table.getSelection();
  //
  //       }
  //
  //       return;
  //     }
  //
  //     case "count": {
  //
  //       const table = this.getTable();
  //
  //       // if (table && table.getCount) {
  //
  //       //   return table.getCount();
  //
  //       // }
  //
  //       if (table && table.getCountParams) {
  //
  //         return KarmaFieldsAlpha.Query.getCount(table.resource.driver, table.getCountParams()) || 0;
  //
  //       }
  //
  //
  //       return 1;
  //     }
  //
  //     case "page": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getPage) {
  //
  //         return table.getPage();
  //
  //       }
  //
  //       return 1;
  //     }
  //
  //
  //
  //     case "ppp": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getPpp) {
  //
  //         return table.getPpp();
  //
  //       }
  //
  //       return 1;
  //     }
  //
  //     case "isLastpage": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getPage && table.getNumPage) {
  //
  //         return table.getPage() === table.getNumPage();
  //
  //       }
  //
  //       return true;
  //     }
  //
  //     case "numpage": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getNumPage) {
  //
  //         return table.getNumPage();
  //
  //       }
  //
  //       return 1;
  //     }
  //
  //     case "nextpage": {
  //
  //       const table = this.getTable();
  //
  //       // if (table && table.getPage && table.getNumPage) {
  //       if (table && table.getPage && table.changePage) {
  //
  //         const page = table.getPage();
  //
  //         table.changePage(page+1);
  //
  //         // const numpage = await table.getNumPage();
  //         //
  //         // if (page < numpage) {
  //         //
  //         //   KarmaFieldsAlpha.History.save();
  //         //   KarmaFieldsAlpha.Nav.change(page+1, page, "page");
  //         //
  //         //   table.unselect();
  //         //
  //         //   await table.loads();
  //         //   await this.render();
  //         //
  //         // }
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "prevpage": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getPage) {
  //
  //         const page = table.getPage();
  //
  //         if (page > 1) {
  //
  //           KarmaFieldsAlpha.History.save();
  //           KarmaFieldsAlpha.Nav.change(page-1, page, "page");
  //
  //           table.selectionBuffer.remove();
  //
  //           // await table.load();
  //           KarmaFieldsAlpha.Query.reset();
  //           this.render();
  //
  //         }
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "firstpage": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getPage) {
  //
  //         const page = table.getPage();
  //
  //         if (page > 1) {
  //
  //           KarmaFieldsAlpha.History.save();
  //           KarmaFieldsAlpha.Nav.change(1, page, "page");
  //
  //           table.selectionBuffer.remove();
  //
  //           // await table.load();
  //           KarmaFieldsAlpha.Query.reset();
  //           this.render();
  //
  //         }
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "lastpage": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getPage && table.getNumPage) {
  //
  //         const page = table.getPage();
  //         const numpage = table.getNumPage();
  //
  //         if (page > 1) {
  //
  //           KarmaFieldsAlpha.History.save();
  //           KarmaFieldsAlpha.Nav.change(numpage, page, "page");
  //
  //           table.selectionBuffer.remove();
  //
  //           // await table.load();
  //           KarmaFieldsAlpha.Query.reset();
  //           this.render();
  //
  //         }
  //
  //       }
  //
  //       break;
  //
  //     }
  //
  //     case "add": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.add) {
  //
  //         KarmaFieldsAlpha.History.save();
  //
  //         const index = content.index || table.resource.add_index || 0;
  //
  //         const id = await table.add(content.params, index);
  //
  //         table.selectionBuffer.change({index: index, length: 1});
  //
  //         await this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "delete": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.remove && table.selectionBuffer) {
  //
  //         const selection = table.selectionBuffer.get();
  //
  //         if (selection) {
  //
  //           KarmaFieldsAlpha.History.save();
  //
  //           table.selectionBuffer.remove();
  //
  //           await table.remove(selection.index, selection.length);
  //           await this.render();
  //
  //         }
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "duplicate": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.remove && table.selectionBuffer) {
  //
  //         const selection = table.selectionBuffer.get();
  //
  //         if (selection) {
  //
  //           KarmaFieldsAlpha.History.save();
  //
  //           table.selectionBuffer.remove();
  //
  //           await table.duplicate(selection.index, selection.length);
  //           await this.render();
  //
  //         }
  //
  //       }
  //
  //       break;
  //     }
  //
  //
  //     case "clear-selection":
  //     case "close-modal": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.selectionBuffer) {
  //
  //         KarmaFieldsAlpha.History.save();
  //
  //         table.selectionBuffer.remove();
  //
  //         await this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "order": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getOrder) {
  //
  //         return table.getOrder();
  //
  //       }
  //
  //       break;
  //     }
  //
  //
  //     case "orderby": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getOrderby) {
  //
  //         return table.getOrderby();
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "toggle-order": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.toggleOrder && table.selectionBuffer) {
  //
  //         KarmaFieldsAlpha.History.save();
  //
  //         table.toggleOrder(content.key, content.order);
  //         table.selectionBuffer.remove();
  //
  //         await table.load();
  //         await this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //
  //     case "fetch": {
  //       // -> table transfers
  //
  //       const tableId = KarmaFieldsAlpha.Nav.get("table");
  //
  //       const params = KarmaFieldsAlpha.Nav.get();
  //
  //       KarmaFieldsAlpha.History.save();
  //
  //       // for (let key in {...params, ...content.params}) {
  //       //   KarmaFieldsAlpha.Nav.change(content.params[key] || "", undefined, key);
  //       // }
  //
  //       KarmaFieldsAlpha.Nav.change(content.params);
  //
  //       const transfer = this.buffer.get("state", "transfer");
  //
  //       const newTransfer = {
  //         params: params,
  //         path: path,
  //         tableId: tableId,
  //         transfer: transfer,
  //         selection: this.buffer.get("state", "selection"),
  //         ids: this.buffer.get("state", "ids")
  //         // callback: content.callback,
  //         // selectedIds: content.ids,
  //         // fieldSelection: content.selection
  //       };
  //
  //       Object.freeze(newTransfer);
  //
  //       // this.buffer.change(null, undefined, "state", "ids");
  //
  //       this.buffer.change(newTransfer, transfer, "state", "transfer");
  //
  //       const table = this.getTable();
  //
  //       await table.load();
  //
  //       const selection = table.createSelection(content.ids);
  //
  //       table.selectionBuffer.change(selection);
  //
  //       // this.pile.push({
  //       //   params: params,
  //       //   callback: content.callback
  //       // });
  //
  //       this.buffer.set(content.callback, "transfer-callback", tableId);
  //
  //
  //       await this.render();
  //
  //       break;
  //     }
  //
  //
  //     case "insert": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.getIds && table.selectionBuffer) {
  //
  //         const selection = table.selectionBuffer.get();
  //         const transfer = this.buffer.get("state", "transfer");
  //
  //         if (selection && transfer) {
  //
  //           const ids = table.getIds();
  //           const inputIds = ids.slice(selection.index, selection.index + selection.length);
  //
  //           KarmaFieldsAlpha.Nav.change(transfer.params);
  //
  //           const originTable = this.getTable(transfer.params.table);
  //
  //           // await originTable.load();
  //
  //           this.buffer.change(transfer.ids, ids, "state", "ids");
  //
  //           this.buffer.change(transfer.selection, selection, "state", "selection");
  //
  //           //
  //           // await transfer.callback(inputIds);
  //
  //           const callback = this.buffer.get("transfer-callback", transfer.params.table);
  //
  //           if (callback) {
  //
  //             await callback.call(originTable, inputIds);
  //
  //             this.buffer.remove("transfer-callback", transfer.params.table);
  //
  //           }
  //
  //           this.buffer.change(transfer.transfer, transfer, "state", "transfer");
  //
  //           await this.render();
  //
  //         }
  //
  //       }
  //
  //       break;
  //
  //     }
  //
  //     case "pile": {
  //       return this.buffer.get("state", "transfer");
  //     }
  //
  //
  //     // medias
  //
  //     case "create-folder": {
  //       const table = this.getTable();
  //
  //       if (table && table.createFolder) {
  //
  //         KarmaFieldsAlpha.History.save();
  //
  //         const index = content.index || table.resource.add_index || 0;
  //
  //         const id = await table.createFolder(index);
  //
  //         table.selectionBuffer.change({index: index, length: 1});
  //
  //         await this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "change-file": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.changeFile && table.getSelectedIds) {
  //
  //         const selectedIds = table.getSelectedIds();
  //
  //         if (selectedIds.length === 1) {
  //
  //           await table.changeFile(content.files[0], selectedIds[0], content.params);
  //           await this.render();
  //
  //         }
  //
  //       }
  //
  //       break;
  //     }
  //
  //     case "upload": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.upload) {
  //
  //         KarmaFieldsAlpha.History.save();
  //
  //         // if (table.unselect) {
  //         //
  //         //   table.unselect();
  //         //
  //         // }
  //
  //         // await table.upload(content.files, content.params);
  //
  //         await table.upload(content.files, table.resource.add_index || 0);
  //
  //         // const index = content.index || table.resource.add_index || 0;
  //         //
  //         // table.selectionBuffer.change({index: index, length: 1});
  //
  //         await this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //     // uploading from gallery field: upload one to one
  //     // case "upload-file": {
  //     //
  //     //   const table = this.getTable();
  //     //
  //     //   const id = await table.uploadFile(content);
  //     //
  //     //   const ids = table.idsBuffer.get();
  //     //
  //     //   this.idsBuffer.change([id, ...ids], ids);
  //     //
  //     //   break;
  //     // }
  //
  //     case "regen": {
  //
  //       const table = this.getTable();
  //
  //       if (table && table.regen && table.getSelectedIds) {
  //
  //         const selectedIds = table.getSelectedIds();
  //
  //         for (let id of selectedIds) {
  //
  //           await table.regen(id);
  //
  //         }
  //
  //         await this.render();
  //
  //       }
  //
  //       break;
  //     }
  //
  //
  //
  //     // layout
  //
  //     // case "close":
  //     //   KarmaFieldsAlpha.Nav.remove();
  //     //   KarmaFieldsAlpha.History.buffer.remove("history"); // ?
  //     //   await this.render();
  //     //   break;
  //
  //
  //
  //     case "table": {
  //       // const resource = this.resource.tables.find(resource => resource.id === content.id);
  //       // if (resource) {
  //       //   return this.createChild(resource);
  //       // }
  //       // break;
  //       return this.getTable(content.id);
  //     }
  //
  //     case "render-controls":
  //       await this.controls.render();
  //       break;
  //
  //     // case "undo":
  //     // case "redo":
  //     case "render": {
  //       await this.render();
  //       break;
  //     }
  //
  //     default: {
  //       return this.parent && this.parent.request(subject, content, ...path);
  //     }
  //
  //   }
  //
  // }
  //
  // async queryTable() { // deprecated. use getCurrent
  //
  //   // -> not on undo/redo !
  //
  //   // const tableId = KarmaFieldsAlpha.Nav.get("table");
  //   // const resource = this.resource.tables.find(resource => resource.id === tableId);
  //   //
  //   // if (resource) {
  //   //   const table = this.createChild(resource);
  //   //   await table.interface.queryIds();
  //   // }
  //
  //   const table = this.getTable();
  //
  //   table.load();
  //
  //   // await this.render();
  // }

  build() {
    return {
      class: "popup",
      init: container => {

        document.addEventListener("keydown", event => {
          if (event.key === "s" && event.metaKey) {

            event.preventDefault();
            this.send();

          } else if (event.key === "z" && event.metaKey && !event.shiftKey) {

            event.preventDefault();
            KarmaFieldsAlpha.History.undo();
            window.dispatchEvent(new CustomEvent("karmaFieldsAlpha-render")); // -> fields embeded into classic pages
            this.render();

          } else if (event.key === "z" && event.metaKey && event.shiftKey) {

            event.preventDefault();
            KarmaFieldsAlpha.History.redo();
            window.dispatchEvent(new CustomEvent("karmaFieldsAlpha-render"));
            this.render();

          }
        });


        window.addEventListener("popstate", async event => {

          KarmaFieldsAlpha.History.update();
          window.dispatchEvent(new CustomEvent("karmaFieldsAlpha-render"));

          this.render();

        });

        // window.addEventListener("mousedown", event => {
        //   const selection = this.getSelection();
        //   if (selection && !event.target.closest(".media-modal")) { // -> prevent unselection on wp media modal clicks
        //     this.setSelection();
        //     this.render();
        //   }
        // });

        container.element.addEventListener("mousedown", event => {
          if (this.hasSelection()) {
            this.setSelection();
            this.render();
          }
        });

        container.element.ondrop = event => {
          event.preventDefault();
          const files = event.dataTransfer.files;
          if (event.dataTransfer.files.length) {
            this.upload(event.dataTransfer.files);
          }
        }
        container.element.ondragover = event => {
          event.preventDefault();
        }


        const clipboard = KarmaFieldsAlpha.Clipboard.getElement();

        clipboard.addEventListener("keyup", event => {
          if (event.key === "Delete" || event.key === "Backspace") {
            // const selection = this.getSelection();
            // if (selection) {
            //   clipboard.value = "";
            //   this.paste("", selection);
            //   this.render();
            // }
            this.delete();
          }
        });

        clipboard.addEventListener("paste", event => {
          event.preventDefault();
          // const selection = this.getSelection();
          // if (selection) {
          //   const string = event.clipboardData.getData("text/plain").normalize();
          //   clipboard.value = string;
          //   this.paste(string, selection);
          //   this.render();
          // }
          const string = event.clipboardData.getData("text/plain").normalize();
          clipboard.value = string;
          this.paste(string);
        });

        clipboard.addEventListener("cut", event => {
          event.preventDefault();
          // const selection = this.getSelection();
          // if (selection) {
          //   event.clipboardData.setData("text/plain", clipboard.value);
          //   clipboard.value = "";
          //   this.paste(string, selection);
          //   this.render();
          // }
debugger;
          event.clipboardData.setData("text/plain", clipboard.value);
          clipboard.value = "";
          this.paste("");
        });

        clipboard.addEventListener("copy", event => {
          event.preventDefault();
          const [value] = this.copy();
          event.clipboardData.setData("text/plain", value || "");
        });

        // input.element.oncopy = event => {
        // 	if (value === KarmaFieldsAlpha.field.input.multiple) {
        // 		event.preventDefault();
        // 		const values = super.getValue();
        // 		const grid = new KarmaFieldsAlpha.Grid();
        //     grid.addColumn(...values);
        //     event.clipboardData.setData("text/plain", grid.toString().normalize());
        // 	}
        // };



        KarmaFieldsAlpha.History.update();

        // const clipboard = KarmaFieldsAlpha.Clipboard.getElement();
        //

        clipboard.onblur = event => {
          // console.log("clipboard blur");
          //
          // // this.setSelection(null);
          //
          // this.clearSelection();

          // KarmaFieldsAlpha.History.save();

        }

      },
      update: popup => {
        // this.onRender = popup.render;

        const currentTableId = this.getTable();

        popup.element.classList.toggle("hidden", !currentTableId && !this.resource.navigation);

        // if (currentTableId) {
          popup.child = {
            class: "popup-content",
            children: [
              {
                class: "navigation karma-field-frame",
                update: navigation => {
                  navigation.element.classList.toggle("hidden", !this.resource.navigation);
                  if (this.resource.navigation) {
                    navigation.child = this.createChild({
                      ...this.resource.navigation,
                      type: "menu",
                      index: "menu",
                      uid: `${this.resource.uid}-menu`
                    }).build();
                  }
                }
              },
              {
                class: "tables",
                update: container => {
                  // const currentTableId = this.getParam("table");


                  // console.log("tables update", currentTableId);

                  document.body.classList.toggle("karma-table-open", !currentTableId);

                  // const tableId = KarmaFieldsAlpha.Nav.get("table");


                  container.children = Object.keys(this.resource.tables).map((tableId, index) => {
                    return {
                      class: "table-container",
                      update: async container => {




                        container.element.classList.toggle("hidden", tableId !== currentTableId);

                        // console.log("table-container update", tableId, currentTableId);

                        if (tableId === currentTableId) {

                          container.children = [this.createChild({
                            type: "table",
                            ...this.resource.tables[tableId],
                            // index: index
                            index: tableId,
                            uid: `${this.resource.uid}-${tableId}`
                          }).build()];

                        } else {

                          container.children = [];

                        }
                      }
                    };
                  });
                }
              }
            ]
          };
        // } else {
        //   // popup.children = [];
        // }
      },
      complete: async popup => {

        // const process = await KarmaFieldsAlpha.Terminal.process();
        //
        // if (process) {
        //
        //   await popup.render();
        //
        // } else {
        //
        //   if (KarmaFieldsAlpha.History.saveFlag) {
        //
        //     KarmaFieldsAlpha.History.saveFlag = false;
        //     KarmaFieldsAlpha.History.save();
        //
        //   }
        //
        //   this.rendering = false;
        //   this.onRender = popup.render;
        //
        // }




        const task = KarmaFieldsAlpha.Query.tasks.shift();



        if (task) {

          // console.log("saucer complete. Running task", task);


          await KarmaFieldsAlpha.Query.run(task);

          await popup.render();

        } else {

          // if (KarmaFieldsAlpha.History.saveFlag) {
          //
          //   KarmaFieldsAlpha.History.saveFlag = false;
          //   KarmaFieldsAlpha.History.save();
          //   // console.log("save");
          //
          // }

          // this.save();

          this.doTasks();

          // KarmaFieldsAlpha.History.save(this.work);

          // this.rendering = false;
          this.onRender = popup.render;

        }





      }
    };
  }

}


KarmaFieldsAlpha.field.saucer.table = class extends KarmaFieldsAlpha.field {

  // clearSelection(selection) {
  //
  //   if (selection && selection.body) {
  //
  //     const grid = this.createChild({
  //       type: "grid",
  //       ...this.resource.body,
  //       index: "body"
  //     });
  //
  //     grid.clearSelection(selection.body);
  //
  //   }
  //
  // }

  follow(selection, callback) {

    if (selection.final) {

      return callback(this, selection);

    } else if (selection.body && this.resource.body) {

      const child = this.createChild({type: "grid", ...this.resource.body, index: "body", uid: `${this.resource.uid}-body`});

      return child.follow(selection.body, callback);

    }

  }


  // paste(value, selection) {
  //
  //   if (selection && selection.body && this.resource.body) {
  //
  //     const child = this.createChild({...this.resource.body, index: "body", uid: `${this.resource.index}-body`});
  //
  //     child.paste(value, selection.body);
  //
  //   }
  //
  // }


  build() {

    return {
      class: "karma-field-table",
      update: async div => {

        let index = 0;

        // div.element.classList.add("table-loading");

        div.children = [
          {
            class: "karma-header table-main-header",
            child: this.createChild({
              type: "header",
              ...this.resource.header,
              index: "header",
              uid: `${this.resource.index}-header`
            }).build()
          },
          {
            class: "table-body",
            update: container => {
              // container.element.classList.toggle("single-open", Boolean(modalOpen));
            },
            children: [
              {
                class: "karma-field-table-section karma-field-frame final",
                update: filters => {
                  filters.element.classList.toggle("hidden", !this.resource.filters);

                  if (this.resource.filters) {
                    filters.child = this.createChild({
                      type: "group",
                      ...this.resource.filters,
                      index: "filter",
                      uid: `${this.resource.uid}-filter`
                    }).build();
                  }
                }
              },
              ...(this.resource.subsections || []).map(subsection => {
                return {
                  class: "karma-field-table-section karma-field-frame final",
                  init: section => {
                    if (subsection.style) {
                      section.element.style = subsection.style;
                    }
                  },
                  child: this.createChild({...subsection, index: index++, uid: `${this.resource.uid}-${index}`}).build()
                };
              }),
              {
                class: "table-body-columns",
                update: div => {
                  const grid = this.createChild({
                    type: "grid",
                    ...this.resource.body,
                    index: "body",
                    uid: `${this.resource.uid}-body`
                  });
                  div.children = [
                    {
                      class: "table-body-column table-content",
                      // child: grid.build()
                      child: {
                        class: "table-body-columns",
                        children: [
                          {
                            class: "karma-field-table-grid-container karma-field-frame karma-field-group final scroll-container table-body-column",
                            child: grid.build()
                          },
                          // grid.buildModal()
                          {
                            class: "grid-modal table-body-column karma-modal scroll-container",
                            update: div => {

                              // const selection = grid.getSelection();
                              div.element.classList.toggle("hidden", !grid.resource.modal);

                              // if (grid.resource.modal && selection) {
                              if (grid.resource.modal) {
                                const modal = grid.createChild({
                                  type: "modal",
                                  ...grid.resource.modal,
                                  index: "modal",
                                  uid: `${grid.resource.uid}-modal`
                                });
                                div.element.style.width = grid.resource.modal.width || "30em";
                                div.element.onmousedown = event => {
                                  event.stopPropagation(); // -> prevent unselecting
                                  modal.setSelection({final: true});
                                  this.render();
                                };
                                // if (grid.hasSelection()) {
                                if (grid.getSelection().modal) {
                                  div.child = modal.build();
                                } else {
                                  div.children = [];
                                }

                              }
                            }
                          }
                        ]
                      }
                    },
                    {
                      class: "table-body-column table-modal karma-modal",
                      update: container => {
                        // const selection = grid.getSelection();
                        //
                        // const hasSelection = Boolean(selection && selection instanceof KarmaFieldsAlpha.Selection);

                        // console.log("update table-body-column", container.element, selection, hasSelection);

                        // container.element.onmousedown = event => {
                        //   console.log("modal mousedown");
                        //   event.stopPropagation();
                        // }




                        // container.element.style.width = this.resource.modal && this.resource.modal.width || grid.resource.modal && grid.getSelection() && (grid.resource.modal.width || "30em") || "0";

                        container.element.classList.toggle("hidden", !this.resource.modal);

                        if (this.resource.modal) {
                          container.element.style.width = this.resource.modal.width || "30em";
                          // container.child = {
                            // class: "karma-modal", // -> handle overflow:auto
                            // children: [
                            //   {
                                // class: "table-modal-content",
                                // update: div => {
                                  // div.element.classList.toggle("hidden", !this.resource.modal);
                                  // if (this.resource.modal) {
                                    container.child = this.createChild({
                                      type: "group",
                                      ...this.resource.modal,
                                      index: "modal",
                                      uid: `${this.resource.uid}-modal`
                                    }).build();
                                //   }
                                // }
                              // }
                              // {
                              //   class: "grid-modal-content",
                              //   update: div => {
                              //     // const hasSelection = grid.hasSelection();
                              //     const selection = grid.getSelection();
                              //     div.element.classList.toggle("hidden", !selection);
                              //     if (selection) {
                              //       div.child = grid.createChild({
                              //         type: "modal",
                              //         ...grid.resource.modal,
                              //         selection: grid.getSelection(),
                              //         index: "modal",
                              //         uid: `${grid.resource.uid}-modal`
                              //       }).build()
                              //     }
                              //   }
                              // }
                            // ]
                          // };
                        }
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            class: "table-footer table-control",
            update: footer => {
              footer.element.classList.toggle("hidden", this.resource.controls === false);
              if (this.resource.controls !== false) {
                footer.child = this.createChild({
                  type: "controls",
                  ...this.resource.controls,
                  index: "controls",
                  uid: `${this.resource.uid}-controls`
                }).build();
              }
            }
          }
        ];
      }
    };

  }
}



KarmaFieldsAlpha.field.saucer.menu = class extends KarmaFieldsAlpha.field {

  getItems() {
    return this.resource.items || this.resource.children || [];
  }

  build() {
    return {
      tag: "ul",
      children: this.getItems().map(item => {
        return {
          tag: "li",
          children: [
            {
              tag: "a",
              init: li => {
                li.element.innerHTML = item.title;
                li.element.href = "#"+(item.hash || "");
                if (item.table) {
                  li.element.onclick = event => {
                    event.preventDefault();
                    this.parent.request("open", item.table);
                    // this.render();
                  }
                }
                if (item.action) {
                  li.element.onclick = event => {
                    event.preventDefault();
                    this.parent.request(item.action, ...item.values);
                  }
                }
              }
            },
            this.createChild({
              items: item.items || item.children || [],
              type: "menu"
            }).build()
          ],
          update: li => {
            const active = this.resource.table && this.resource.table === this.parent.request("getTable");
            li.element.classList.toggle("active", Boolean(active));
          }
        };
      })
    }
  }

}



KarmaFieldsAlpha.field.saucer.controls = class extends KarmaFieldsAlpha.field.container {

  constructor(resource) {

    super({
      display: "flex",
      children: [
        "reload",
        "save",
        "add",
        "delete",
        "separator",
        "insert",
        "undo",
        "redo"
      ],
      ...resource
    });

  }

}

KarmaFieldsAlpha.field.saucer.save = {
  type: "button",
  action: "send",
  title: "Save",
  enabled: ["request", "hasChange"],
  primary: true
}

KarmaFieldsAlpha.field.saucer.add = {
  type: "button",
  action: "add",
  title: "Add"
}

KarmaFieldsAlpha.field.saucer.delete = {
  type: "button",
  action: "delete",
  title: "Delete",
  // disabled: "!selection"
  enabled: ["request", "canDelete"]
}

KarmaFieldsAlpha.field.saucer.undo = {
  type: "button",
  action: "undo",
  dashicon: "undo",
  disabled: ["!", ["request", "hasUndo"]],
  loading: ["request", "hasTask"]
}

KarmaFieldsAlpha.field.saucer.redo = {
  type: "button",
  action: "redo",
  dashicon: "redo",
  disabled: ["!", ["request", "hasRedo"]]
  // loading: ["hasTask"]
}

KarmaFieldsAlpha.field.saucer.reload = {
  type: "button",
  action: "reload",
  title: "Reload"
}

KarmaFieldsAlpha.field.saucer.insert = {
  type: "button",
  action: "insert",
  primary: true,
  title: "Insert",
  enabled: ["request", "hasSelection"],
  visible: ["request", "hasTransfer"]
}


// KarmaFieldsAlpha.field.saucer.upload = {
//   type: "button",
//   action: "upload",
//   title: "Upload File"
// }


KarmaFieldsAlpha.field.saucer.header = class extends KarmaFieldsAlpha.field.container {

  constructor(resource) {

    super({
      display: "flex",
      children: [
        {
          type: "title",
          value: resource.title || "Table"
        },
        "count",
        "pagination",
        "close"
      ],
      ...resource
    });

  }

}

KarmaFieldsAlpha.field.saucer.header.title = class extends KarmaFieldsAlpha.field.text {

  constructor(resource) {

    super({
      tag: "h1",
      style: "flex-grow:1",
      class: "ellipsis",
      value: "Table",
      ...resource
    });

  }

}

KarmaFieldsAlpha.field.saucer.count = {
  type: "text",
  style: "justify-content:center;white-space: nowrap;",
  value: ["replace", "# elements", "#", ["request", "count"]]
}

KarmaFieldsAlpha.field.saucer.options = {
  type: "button",
  title: "Options",
  action: "toggleOptions"
}

KarmaFieldsAlpha.field.saucer.close = {
  type: "button",
  text: "×",
  title: "Close Table",
  action: "close"
}

KarmaFieldsAlpha.field.saucer.pagination = class extends KarmaFieldsAlpha.field.container {

  constructor(resource) {

    super({
      type: "group",
      display: "flex",
      style: "flex: 0 1 auto;min-width:0",
      visible: [">", ["request", "getNumPage"], 1],
      children: [
        "firstpage",
        "prevpage",
        "currentpage",
        "nextpage",
        "lastpage"
      ],
      ...resource
    });
  }

}

KarmaFieldsAlpha.field.saucer.pagination.firstpage = {
  type: "button",
  action: "firstPage",
  title: "First Page",
  text: "«",
  disabled: ["==", ["request", "getPage"], 1]
}

KarmaFieldsAlpha.field.saucer.pagination.prevpage = {
  type: "button",
  action: "prevPage",
  title: "Previous Page",
  text: "‹",
  disabled: ["==", ["request", "getPage"], 1]
}

KarmaFieldsAlpha.field.saucer.pagination.currentpage = {
  type: "text",
  style: "min-width: 4em;text-align: right;",
  value: ["replace", "# / #", "#", ["request", "getPage"], ["request", "getNumPage"]]
}

KarmaFieldsAlpha.field.saucer.pagination.nextpage = {
  type: "button",
  action: "nextPage",
  title: "Next Page",
  text: "›",
  disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]]
}

KarmaFieldsAlpha.field.saucer.pagination.lastpage = {
  type: "button",
  action: "lastPage",
  title: "Last Page",
  text: "»",
  // disabled: ["request", "lastpage", "boolean"]
  disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]]
}
