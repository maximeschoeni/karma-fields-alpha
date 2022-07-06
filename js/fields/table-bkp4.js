
KarmaFieldsAlpha.fields.table = class extends KarmaFieldsAlpha.fields.gateway {

  constructor(...params) {
    super(...params);

    if (!this.resource.driver) {
      console.error("Driver not defined");
    }


    // compat

    if (this.resource.columns) {
      this.resource.children = this.resource.columns.map(column => {
        return {
          ...column,
          ...column.field
        };
      });
    }


    // -> compat
    if (typeof this.resource.driver === "string") {

      const [request, ...joins] = this.resource.driver.split("+");
      const [driver, paramString] = request.split("?");

      this.driver = driver;
      this.params = this.resource.params || KarmaFieldsAlpha.Nav.toObject(paramString);
      this.joins = this.resource.joins || joins || [];

      // console.log(this.driver, this.params, this.joins);

    } else {

      this.driver = this.resource.driver.name;
      this.params = this.resource.params || this.resource.driver.params;
      this.joins = this.resource.joins || this.resource.driver.joins || [];

    }



    // this.history = new KarmaFieldsAlpha.LocalStorage(this.resource.driver, "history");



    // [this.driver, this.params] = this.resource.driver.split("?");


    // this.history = new KarmaFieldsAlpha.Buffer(driverName, "history");
    this.history = new KarmaFieldsAlpha.Buffer("history");



    this.store = new KarmaFieldsAlpha.Store(this.driver, this.joins);




    this.extraOrders = {};

    this.optionsBuffer = new KarmaFieldsAlpha.Buffer("options", this.driver);
    this.extraIdBuffer = new KarmaFieldsAlpha.Buffer("extraids", this.driver);
    this.idsBuffer = new KarmaFieldsAlpha.Buffer("ids", this.driver);

    this.grid = this.createTablePart({
      // ...this.resource.grid,
      // driver: this.resource.driver,
      // columns: this.resource.columns,
      // orderby: this.resource.orderby,
      type: "grid",
      id: "grid", //"form-"+this.resource.driver, // -> form buffer + history buffer
      bufferPath: ["data", this.driver],
      driver: this.driver, // -> for history
      // historyBufferPath: [this.resource.driver, "history"],
      key: "content"
    });

    // this.content = this.grid.createChild({
    //   id: "content"
    //   // key: "content"
    // });

    this.interface = this.createTablePart({
      type: "interface",
      id: "interface"
    });



    this.controls = this.createTablePart({
      id: "controls",
      // key: "controls",
      type: "controls",
      ...this.resource.controls
    });

    this.header = this.createTablePart({
      id: "header",
      // key: "header",
      type: "header",
      ...this.resource.header
    });

    this.options = this.createChild({
      type: "button",
      title: "Options",
      id: "options-"+this.resource.driver,
      action: "toggle-options",
      modal: {
        id: "form",
        key: "options",
        type: "form",
        children: [
          {
            type: "input",
            key: "ppp",
            label: "Items number",
            input: {type: "number", style: "max-width:5em;"}
          },
          {
            type: "checkboxes",
            key: "columns",
            label: "Display columns",
            options: this.resource.children.map((child, index) => {
              return {
                key: index.toString(),
                name: child.label
              }
            })
          },
          {
            type: "group",
            display: "flex",
            children: [
              {
                type: "button",
                primary: true,
                style: "min-width:0",
                action: "submit",
                disabled: "!modified",
                title: "Save"
              },
              {
                type: "button",
                style: "min-width:0;",
                action: "close-options",
                title: "Close"
              }
            ]
          }

        ]
      }
    });

  }



  async getQueriedIds() {
    // const results = await this.getRemoteTable();
    // const results = await this.getQuery().get();

    const paramString = this.getParamString();

    const results = await this.store.query(paramString);

    return results.map(row => row.id);
  }

  getParamString() {

    // if (!this.hasParam("page")) {
    //   this.replaceParam("1", "page");
    // }
    //
    // if (!this.hasParam("ppp")) {
    //   this.replaceParam(this.getPpp(), "ppp");
    // }
    //
    // if (!this.hasParam("orderby")) {
    //   this.replaceParam(this.getOrderby(), "orderby");
    // }
    //
    // if (!this.hasParam("order")) {
    //   this.replaceParam(this.getOrder(), "order");
    // }
    //
    // return KarmaFieldsAlpha.Nav.getObject().toString();

    // const params = new URLSearchParams(location.hash.slice(1));
    //
    // if (!params.has("page")) {
    //   params.set("page", "1");
    // }
    //
    // if (!params.has("ppp")) {
    //   params.set("ppp", this.getPpp());
    // }
    //
    // if (!params.has("orderby")) {
    //   params.set("orderby", this.getOrderby());
    // }
    //
    // if (!params.has("order")) {
    //   params.set("order", this.getOrder());
    // }
    //
    // if (params.has("id")) {
    //   params.delete("id");
    // }
    //
    // if (params.has("karma")) {
    //   params.delete("karma");
    // }
    //
    // params.sort();
    //
    // return params.toString();

    // if (!this.paramString) {

      // const [driver, driverParams] = this.resource.driver.split("?");

      // const params = KarmaFieldsAlpha.ParamString.merge(this.params || "", location.hash.slice(1));

      const params = {
        // ...KarmaFieldsAlpha.Nav.toObject(this.params),
        ...this.params,
        ...KarmaFieldsAlpha.Nav.getObject()
      };

      if (params.page === undefined) {
        params.page = "1";
      }

      if (params.ppp === undefined) {
        params.ppp = this.getPpp();
      }

      if (params.orderby === undefined) {
        params.orderby = this.getOrderby();
      }

      if (params.order === undefined) {
        params.order = this.getOrder();
      }

      delete params.id;
      delete params.karma;

      return KarmaFieldsAlpha.Nav.toString(params);

    //   this.paramString = this.driver+"?"+KarmaFieldsAlpha.Nav.toString(params);
    //
    // }
    //
    // return this.paramString;
  }

  getCountParamString() {

    const params = {
      // ...KarmaFieldsAlpha.Nav.toObject(this.params),
      ...this.params,
      ...KarmaFieldsAlpha.Nav.getObject()
    };

    delete params.page;
    delete params.ppp;
    delete params.orderby;
    delete params.order;
    delete params.id;
    delete params.karma;

    return KarmaFieldsAlpha.Nav.toString(params);

  }


  // async queryTable() {
  //
  //   const paramString = this.getParamString();
  //   // const paramString = await this.get("paramstring", 0);
  //   const driver = this.resource.driver;
  //   const promise = KarmaFieldsAlpha.Gateway.get("query/"+driver+"?"+paramString);
  //
  //   for (let join of this.resource.join) {
  //     this.registerJoin(join.driver, promise.then(results => {
  //       results = results.items || results || []; // compat
  //       return results.map(row => row[join.on || join.id]);
  //     }));
  //   }
  //
  //   let results = await promise;
  //
  //   results = results.items || results || []; // compat
  //
  //
  //   for (let i = 0; i < results.length; i++) {
  //
  //     const id = results[i].id.toString();
  //
  //     for (let key in results[i]) {
  //       this.buffer.set(results[i][key], id, key, 0);
  //     }
  //
  //     this.buffer.set("0", id, "trash", 0);
  //   }
  //
  //
  //
  //
  //
  //
  //   return results;
  // }




  // getQuery() {
  //   // if (!this.query) {
  //   //   this.paramString = this.getParamString();
  //   //   this.query = KarmaFieldsAlpha.Query.create(this.paramString, this.resource.joins);
  //   // } else {
  //   //
  //   // }
  //   // return this.query;
  //
  //   const paramString = this.getParamString();
  //   return KarmaFieldsAlpha.Query.create(paramString, this.resource.joins);
  // }
  //
  // getRemoteTable() {
  //
  //   return this.getQuery().get();
  //
  //   // if (!this.tablePromise) {
  //   //
  //   //   const paramString = this.getParamString();
  //   //
  //   //   this.tablePromise = KarmaFieldsAlpha.Driver.select(this.resource.driver, paramString).then(results => {
  //   //     results.forEach(row => {
  //   //       this.buffer.set([row.id.toString()], row.id.toString(), "id");
  //   //       this.buffer.set(["0"], row.id.toString(), "trash");
  //   //     });
  //   //     return results;
  //   //   });
  //   //
  //   //   // this.tablePromise.then(results => results.forEach(row => this.buffer.set([row.id.toString()], row.id.toString(), "id")));
  //   //   // this.tablePromise.then(results => results.forEach(row => this.buffer.set(["0"], row.id.toString(), "trash")));
  //   //
  //   //   if (this.resource.join) {
  //   //     for (let join of this.resource.join) {
  //   //       this.registerJoin(join.driver, this.tablePromise.then(results => results.map(row => row[join.on || "id"])));
  //   //     }
  //   //   }
  //   //
  //   //
  //   //
  //   // }
  //   //
  //   // return this.tablePromise;
  // }

  // async joinRemoteTable(driver) {
  //
  //   const ids = this.getQueriedIds();
  //
  //   if (!this.tablePromise) {
  //     const paramString = this.getParamString();
  //     this.tablePromise = KarmaFieldsAlpha.driver.join(this.resource.driver, driver, ids);
  //   }
  //   return this.tablePromise;
  //
  //
  //
  // }




  // async queryRelations() {
  //
  //   const driver = this.resource.driver;
  //   const ids = await this.getQueriedIds();
  //   // const ids = await this.get("queriedids");
  //   const relations = await KarmaFieldsAlpha.Gateway.get("relations/"+driver+"?ids="+ids.join(","));
  //
  //   // [
  //   //   {
  //   //     id: 1,
  //   //     cat_id: 34
  //   //   },
  //   //   {
  //   //     id: 2,
  //   //     cat_id: 34
  //   //   },
  //   //   {
  //   //     id: 2,
  //   //     cat_id: 35
  //   //   }
  //   // ]
  //   //
  //   // ->
  //   //
  //   // {
  //   //   1: {
  //   //     cat_id: [34],
  //   //     date: ["2022-03-08"],
  //   //     hour: ["20:00"],
  //   //     items: ["a", "b", "c"]
  //   //   },
  //   //   2: {
  //   //     cat_id: [34, 35],
  //   //     date: ["2022-03-07"],
  //   //     hour: ["20:00"],
  //   //     meta: [
  //   //       {
  //   //         x: [23],
  //   //         y: [12]
  //   //       }
  //   //     ]
  //   //   }
  //   // }
  //   //
  //   // ["1", "date", 0]
  //   // ["1", "items", 2]
  //   // ["2", "cat_id", 1]
  //   // ["2", "meta", 0, "x", 0]
  //
  //   // for (let i = 0; i < relations.length; i++) {
  //   for (let relation of relations) {
  //     const id = relation.id.toString();
  //     if (id) {
  //       for (let key in relation) {
  //         if (key !== "id") {
  //           // KarmaFieldsAlpha.DeepObject.sanitize(relation[key]); // -> compat
  //
  //           let values = this.buffer.get(id, key) || [];
  //           this.buffer.set([...values, relation[key]], id, key);
  //         }
  //       }
  //     }
  //   }
  //
  // }



  // async getRemoteRelations() {
  //   // if (!KarmaFieldsAlpha.relationPromises) {
  //   //   KarmaFieldsAlpha.relationPromises = {};
  //   // }
  //   // if (!KarmaFieldsAlpha.relationPromises[this.resource.driver]) {
  //   //   KarmaFieldsAlpha.relationPromises[this.resource.driver] = this.queryRelations();
  //   // }
  //   // return KarmaFieldsAlpha.relationPromises[this.resource.driver];
  //
  //   if (!this.relationPromise) {
  //     this.relationPromise = this.queryRelations();
  //   }
  //   return this.relationPromise;
  // }

  // async getRemoteValue(...path) {
  //   await this.getRemoteTable();
  //   await this.getRemoteRelations();
  //
  //   // let value = this.buffer.get(id, key);
  //   //
  //   // if (!value && key === "trash") {
  //   //   value = ["1"];
  //   // }
  //
  //   return this.buffer.get(...path);
  // }


  // async getRemoteValue(allowSingle, ...path) {
  //
  //   let value = this.buffer.get(...path);
  //
  //   if (!value) {
  //     await this.getRemoteTable();
  //     value = this.buffer.get(...path);
  //   }
  //
  //   if (!value) {
  //     value = await super.getRemoteValue(allowSingle, ...path);
  //   }
  //
  //   return value;
  // }





  // deprecated;
  // clearQuery() {
  //
  //   // this.getQuery().clear();
  //   this.store.empty();
  //
  // }

  // async getRemoteCount() {
  //   if (!this.countPromise) {
  //
  //     // this.countPromise = KarmaFieldsAlpha.Gateway.get("count/"+this.resource.driver+"?"+this.getParamString());
  //     this.countPromise = KarmaFieldsAlpha.Gateway.get("count/"this.resource.driver+"?"+this.getParamString());
  //   }
  //   return this.countPromise;
  // }

  async getCount() {
    // const count = await this.getRemoteCount();

    // const paramString = this.getCountParamString();
    //
    // if (!this.countCache) {
    //   this.countCache = {};
    // }
    //
    // if (!this.countCache[paramString]) {
    //
    //   this.countCache[paramString] = KarmaFieldsAlpha.Gateway.get("count/"+paramString);
    //
    // }
    //
    // return Number(await this.countCache[paramString] || 0);

    const paramString = this.getCountParamString();
    const count = await this.store.count(paramString);

    return Number(count || 0);
  }

  // deprecated
  // clearCount() {
  //   // this.countCache = {};
  //   this.store.empty();
  // }

  // getDefaultOrderby() {
  //   if (!this.defaultOrderby) {
  //     this.defaultOrderby = this.resource.orderby;
  //     if (!this.defaultOrderby) {
  //       const column = this.resource.columns.find(column => (column.orderby || column.field && column.field.key));
  //       this.defaultOrderby = column && (column.orderby || column.field && column.field.key) || "default";
  //     }
  //   }
  //   return this.defaultOrderby;
  // }
  //
  // getDefaultOrder() {
  //   if (!this.defaultOrder) {
  //     const column = this.resource.orderby && this.resource.columns.find(column => (column.orderby || column.field && column.field.key) === this.resource.orderby);
  //     this.defaultOrder = column && column.order || "asc";
  //   }
  //   return this.defaultOrder;
  // }

  getDefaultOrderby() {
    // return this.resource.orderby || this.resource.children && this.resource.children.some(child => child.orderby || child.key) && this.resource.find.some(child => child.orderby || child.key).key || "default";
    if (!this.resource.orderby) {
      const child = this.resource.children.find(child => child.orderby || child.key);
      return child && (child.orderby || child.key) || "default";
    }
    return this.resource.orderby;
  }

  getDefaultOrder() {
    const orderby = this.getOrderby();
    const child = this.resource.children.find(child => child.key === orderby);
    return child && child.order || "asc";
  }

  getOrder() {
    return this.getParam("order") || this.getDefaultOrder();
  }

  getOrderby() {
    return this.getParam("orderby") || this.getDefaultOrderby();
  }

  // getOptions() {
  //   return {
  //     ppp: this.getParam("ppp") || this.resource.ppp || 10,
  //     columns: this.resource.columns.map((column, index) => index.toString()) || []
  //   };
  // }

  // getPpp() {
  //   return this.optionsBuffer.get("ppp") || this.getOptions().ppp;
  // }
  //
  // getColumns() {
  //   return this.optionsBuffer.get("columns") || this.getOptions()["columns"];
  // }

  getPpp() {
    // return this.getParam("ppp") || this.optionsBuffer.get("ppp", 0) || this.resource.ppp || 10;
    return this.getParam("ppp") || this.resource.ppp || 10;
  }

  getColumns() {
    return this.optionsBuffer.get("columns") || this.resource.children.map((column, index) => index.toString()) || [];
  }

  getParam(key) {
    return KarmaFieldsAlpha.Nav.get(key);
  }

  hasParam(key) {
    return KarmaFieldsAlpha.Nav.has(key);
  }

  setParam(value, key) {
    // const original = this.getParam(key);
    // if (original !== value) {
    //   KarmaFieldsAlpha.History.write(original, "nav", key);
    //   KarmaFieldsAlpha.Nav.set(value, key);
    // }

    KarmaFieldsAlpha.Nav.set(value, key);
  }

  // replaceParam(value, key) {
  //   console.error("Deprecated replaceParam");
  //   // KarmaFieldsAlpha.Nav.set(value, key, true);
  // }
  //
  // setParams(params) {
  //   console.error("Deprecated setParams");
  //   // for (let key in params) {
  //   //   const value = this.getParam(key);
  //   //   this.writeHistory(value, "nav", key);
  //   // }
  //   // this.stage();
  //   // KarmaFieldsAlpha.Nav.merge(params);
  // }
  //
  // removeParam(key) {
  //   console.error("Deprecated removeParam");
  //   // const value = this.getParam(key);
  //   // this.writeHistory(value, "nav", key);
  //   // this.stage();
  //   // KarmaFieldsAlpha.Nav.remove(key);
  // }

  editParams() {

  }

  backupParam(key) {
    KarmaFieldsAlpha.Nav.backup(key);

    // const value = this.getParam(key) || "";
    // KarmaFieldsAlpha.History.write(value, "nav", key);
    // this.writeHistory(value, "nav", key);
  }


  // clearParams() {
  //   const value = this.getParam(key);
  //   this.writeHistory(value, "nav", key);
  //   this.stage();
  //   KarmaFieldsAlpha.Nav.empty();
  // }

  async dispatch(event, parent, origin) {


    switch (event.action) {

      case "get": {
        // const value = await this.getValue(...event.path);
        // event.setValue(value);

        const key = event.path.shift();

        switch (key) {

          case "content":




            // const query = this.getQuery();
            //
            // const path = event.absolutePath || event.path;
            //
            // event.data = await query.get(...path);




            event.data = await this.store.getValue(...event.path);


            // console.log(event.data, event.path);

            break;


          case "options":

            switch (event.path.shift()) {
              case "ppp":
                event.data = [this.getPpp()];
                break;

              case "columns":
                event.data = this.getColumns();
                break;
            }

            break;

          case "selection":
            event.data = [this.interface.hasRowSelected()];
            break;

          case "undo":
            // event.data = [this.hasUndo()];
            event.data = [KarmaFieldsAlpha.History.hasUndo()];
            break;

          case "redo":
            // event.data = [this.hasRedo()];
            event.data = [KarmaFieldsAlpha.History.hasRedo()];
            break;

          case "count":
            event.data = [await this.getCount()];
            break;

          case "page":
            event.data = [this.getPage()];
            break;

          case "lastpage":
            event.data = [await this.getNumPage() === this.getPage()];
            break;

          case "numpage":
            event.data = [await this.getNumPage()];
            break;



          default: // -> filters
            event.data = [this.getParam(key)];

            break;

        }

        break;
      }

      case "set": {
        // await this.setValue(event.getArray(), ...event.path);

        const key = event.path.shift();

        switch (key) {

          case "content": // -> autosave
            await this.send(event.data, ...event.path); // -> data is an array
            break;

          default: { // -> filters
            // this.setParams({
            //   page: 1,
            //   [key]: event.data[0]
            // });

            const value = KarmaFieldsAlpha.Type.toString(event.data);
            const current = KarmaFieldsAlpha.Nav.get(key);

            if (KarmaFieldsAlpha.DeepObject.differ(value, current)) {

              KarmaFieldsAlpha.Nav.change(event.backup, value, current, key);
              KarmaFieldsAlpha.Nav.change("pack", 1, KarmaFieldsAlpha.Nav.get("page"), "page");

              this.idsBuffer.empty();

            }





            // const current = KarmaFieldsAlpha.Nav.get(key);
            //
            // if (value !== current) {
            //   KarmaFieldsAlpha.Nav.set(value, key);
            //   if (event.backup !== "none") {
            //     KarmaFieldsAlpha.Nav.backup(event.backup, value, key);
            //   }
            // }




            // const page = this.getParam("page");
            //
            // if (event.backup === "save") {
            //   if (key !== "page" && page !== "1") {
            //     // this.backupParam("page");
            //     KarmaFieldsAlpha.Nav.backup("page");
            //   }
            //   // this.backupParam(key);
            //   KarmaFieldsAlpha.Nav.backup(key);
            //   // this.stage();
            //   KarmaFieldsAlpha.Nav.save();
            //   KarmaFieldsAlpha.Nav.update();
            // }
            //
            // // this.setParam(value, key);
            // KarmaFieldsAlpha.Nav.set(value, key);
            // // this.backupParam(key);
            // KarmaFieldsAlpha.Nav.set(value, key);
            //
            // if (key !== "page" && page !== "1") {
            //   // this.setParam("1", "page");
            //   KarmaFieldsAlpha.Nav.set("1", "page");
            //
            //   // this.backupParam("page");
            //   KarmaFieldsAlpha.Nav.backup("page");
            // }

            // if (event.edit) {
            //   // this.clearCount();
            //   // this.clearQuery();
            //   await this.render();
            // }

            // this.clearCount();
            // this.clearQuery();
            // this.render();
            break;
          }

        }

        break;
      }

      case "send": {

        const key = event.path.shift();

        switch (key) {

          case "content": // -> save grid

            await this.send(event.data, ...(event.absolutePath || event.path)); // -> data is an object
            break;

          case "options": {
            this.options.open = false;
            const value = KarmaFieldsAlpha.Type.toObject(event.data);

            if (value.ppp) {

              // this.setParams({
              //   page: 1,
              //   [key]: value.ppp[0]
              // });
              // this.clearCount();
              // this.clearQuery();
              // this.render();

              // -> no history save
              if (KarmaFieldsAlpha.Nav.get("page") !== "1") {
                KarmaFieldsAlpha.Nav.set("1", "page");
              }
              KarmaFieldsAlpha.Nav.set(value, "ppp");

              // if (event.backup === "save") {
              //   this.backupParam("page");
              //   this.backupParam("ppp");
              //   this.stage();
              //   KarmaFieldsAlpha.Nav.update();
              // }
              //
              // this.setParam("1", "page");
              // this.setParam(value, "ppp");
              // this.backupParam("page");
              // this.backupParam(key);

              if (event.edit) {

                // this.clearCount();
                // this.clearQuery();
                this.render();
              }
            }
            if (value.columns) {
              this.options.buffer.set(event.data.columns, "columns");
              await this.render(true);
            }
            break;
          }

          default: // -> filters + order
            this.setParams(event.data);
            // this.clearCount();
            // this.clearQuery();
            this.render();
            break;

        }

        // await this.sendValue(event.getValue(), ...event.path);
        break;
      }

      case "column": {
        // event.data = this.getQuery().get();
        event.data = [];
        // const query = this.getQuery();
        // const ids = await this.getIds();
        // const [key] = event.path;
        //
        // for (let id of ids) {
        //   const value = await query.get(id, "presence");
        //   event.data.push(value);
        // }

        const paramString = this.getParamString();
        const results = await this.store.query(paramString);
        const ids = results.map(result => result.id);
        const key = event.path[0];

        for (let id of ids) {
          const value = await this.store.getValue(id, key);
          event.data.push(value);
        }

        break;
      }

      case "ids": {

        event.data = await this.getIds();
        break;
      }

      case "driver": {
        event.data = this.getParamString();
        break;

      }

      case "edit": {

        const key = event.path.shift();

        switch (key) {

          case "content":
            if (event.data === "clearcache") { // (NOT USED) -> when data change affect availibity of item in table (autosave)
              this.store.empty();
              const ids = this.idsBuffer.get("ids");
              KarmaFieldsAlpha.History.backup(ids, ids, false, "ids", this.driver, "ids");
              this.idsBuffer.empty();
              await this.render();
            } else {
              await this.splash(this.grid, event);
            }
            break;

          default: // filters
            await this.render();



        }
      }




        await this.controls.render();
        break;

      case "edit-grid": // deprecated: use "edit"

        // await this.grid.render();
        // console.log(event);
        // console.log(this.children);


        await this.controls.render();
        await this.interface.render();
        break;

      // case "listen":
      //   this.setListener(event.callback, ...event.path);
      //   // this.listeners.push(event.callback);
      //   break;

      case "modified": {
        // if (event.path.length) {
        //   // -> filters
        // } else {
        //   const modified = await this.grid.isModified();
        //   event.setValue(modified);
        // }
        // event.data = this.grid.buffer.has(...event.path);



        event.data = await this.grid.isModified();



        break;
      }

      case "importselection": { // -> an input field received a multiple row/column pasted data...
        // const point = this.interface.fieldsMap.find(event.field);

        await this.interface.importData(event.data, event.field);
        this.controls.render();
        break;
      }

      case "edit-selection":
        // console.log("edit-selection");
        // debugger;
        await this.controls.render();
        // this.updateGridClasses();
        break;

      case "nextpage": {
        const page = this.getPage();
        const numpage = await this.getNumPage();
        const nextpage = Math.min(page+1, numpage);

        // KarmaFieldsAlpha.Nav.change({
        //   page: nextpage
        // }, true);

        KarmaFieldsAlpha.Nav.change("tie", nextpage, page, "page");
        this.idsBuffer.remove();

        // this.backupParam("page");
        // this.stage();
        // this.setParam(nextpage, "page");
        // KarmaFieldsAlpha.Nav.update();
        // KarmaFieldsAlpha.History.write(nextpage, "nav", "page");
        // this.writeHistory(nextpage, "page");
        // this.clearQuery();
        await this.render();
        break;
      }

      case "prevpage": {
        const page = this.getPage();
        const prevpage = Math.max(page-1, 0);

        // KarmaFieldsAlpha.Nav.change({
        //   page: prevpage
        // }, true);

        KarmaFieldsAlpha.Nav.change("tie", prevpage, page, "page");
        this.idsBuffer.remove();

        // this.backupParam("page");
        // this.stage();
        // this.setParam(prevpage, "page");
        // KarmaFieldsAlpha.Nav.update();
        // this.writeHistory(prevpage, "page");
        // this.clearQuery();
        await this.render();
        break;
      }

      case "firstpage": {
        const page = this.getPage();
        if (page > 1) {

          // KarmaFieldsAlpha.Nav.change({
          //   page: "1"
          // }, true);

          KarmaFieldsAlpha.Nav.change("tie", "1", page, "page");
          this.idsBuffer.remove();

          // this.writeHistory(page, "page");
          // this.setParam(1, "page");
          // KarmaFieldsAlpha.Nav.update();
          // this.writeHistory(1, "page");
          // this.clearQuery();
          await this.render();
        }
        break;
      }

      case "lastpage": {
        const page = this.getPage();
        const numpage = await this.getNumPage();
        if (page < numpage) {
          // this.writeHistory(page, "page");
          // this.setParam(numpage, "page");
          // KarmaFieldsAlpha.Nav.update();
          // this.writeHistory(numpage, "page");

          // KarmaFieldsAlpha.Nav.change({
          //   page: numpage
          // }, true);

          KarmaFieldsAlpha.Nav.change("tie", numpage, page, "page");
          this.idsBuffer.remove();

          // this.clearQuery();
          await this.render();
        }
        break;
      }

      case "reload": {
        // this.clearQuery();
        this.store.empty();
        this.idsBuffer.remove();
        // this.clearCount();
        // KarmaFieldsAlpha.Gateway.clearOptions();
        await this.render();
        // await this.triggerListeners();
        break;
      }

      case "toggle-options":
        this.options.open = !this.options.open;
        this.options.render();
        // await this.render();
        // await this.triggerListeners();
        break;

      case "close-options":
        this.options.open = false;
        // await this.render();
        // await this.triggerListeners();
        this.options.render();
        break;

      case "add":
        await this.add(1);

        // await this.render(1);
        // await this.grid.triggerListeners();
        // await this.triggerListeners();

        // await this.grid.render();
        // await this.interface.render();
        await this.render();
        break;

      case "delete": {
        const selectedIds = await this.getSelectedIds();



        await this.remove(selectedIds);

        // await this.grid.render();
        // await this.interface.render();

        await this.render();
        break;
      }

      case "save":
        // await this.grid.submit();


        await this.send(this.grid.buffer.get()); // -> data is an object
        this.grid.buffer.remove();

        this.store.empty(); // -> value change affects queried items
        this.idsBuffer.empty(); // -> value change affects queried items



        // this.extraIdBuffer.empty();
        // this.clearQuery();
        // this.clearCount();
        // await this.grid.render();
        // await this.controls.render();
        // await this.interface.render();

        await this.render();
        break;

      case "undo": {
        // this.grid.undo();
        // let hash = this.grid.getHash();
        // if (hash && hash !== location.hash) {
        //   KarmaFieldsAlpha.Nav.setHash(hash);
        //   this.clearQuery();
        //   this.clearCount();
        //   await this.render();
        // } else {
        //   await this.grid.render();
        //   await this.controls.render();
        //   await this.interface.render();
        // }


        // this.undo();

        // console.log(KarmaFieldsAlpha.History.hasUndo("nav"));

        // if (KarmaFieldsAlpha.History.hasChange("nav")) {
        //   this.clearQuery();
        //   this.clearCount();
        // }

        // const undo = KarmaFieldsAlpha.History.undo();


        KarmaFieldsAlpha.History.undo();

        await super.dispatch(event);
        // await this.dispatch(this.createEvent({
        //   action: "update"
        // })); // -> update all tables
        break;
      }

      case "redo": {
        // let hash = this.grid.getHash();
        // if (hash !== location.hash) {
        //   this.grid.redo();
        //   KarmaFieldsAlpha.Nav.setHash(hash);
        //   this.clearQuery();
        //   this.clearCount();
        //   await this.render();
        // } else {
        //   this.grid.redo();
        //   await this.grid.render();
        //   await this.controls.render();
        //   await this.interface.render();
        // }

        // this.redo();

        // if (KarmaFieldsAlpha.History.hasChange("nav")) {
        //   this.clearQuery();
        //   this.clearCount();
        // }

        KarmaFieldsAlpha.History.redo();


        await super.dispatch(event);
        // await this.dispatch(this.createEvent({
        //   action: "update"
        // })); // -> update all tables
        break;
      }
      // case "edit": // edit field in grid
      //   await this.renderFooter();
      //   break;

      // case "start-selection":
      // case "grow-selection":
      // case "end-selection":
      //   await this.renderFooter();
      //   break;

      case "close":
      // case "nav":
        // this.clearQuery();
        // this.clearCount();
        this.buffer.empty();
        this.store.empty();


        await super.dispatch(event);
        // await super.setState(null, ...path, state);
        break;

      // case "order":
      //   this.tablePromise = null;
      //   await this.getGrid().render();
      //   break;

      // modal:
      case "prev":
        await this.prev();
        await this.render();
        // await this.triggerListeners();
        break;

      case "next":
        await this.next();
        await this.render();
        // await this.triggerListeners();
        break;

      case "close-modal":
        this.removeParam("id");
        await this.render();
        // await this.triggerListeners();
        break;

      // case "export":
      //   const selectedIds = await this.getSelectedIds();
      //   location = arsenic_admin.rest_url+"arsenic/v1/export-spectacle-data?ids="+selectedIds.join(",");
      //   break;



      case "backup": { // ?
        const path = event.absolutePath || event.path;
        const key = path.shift();
        // const driver = this.getQuery().driver;
        const driver = this.store.driver;

        switch (key) {
          case "content": {
            // const value = await this.getQuery().get(...path);
            // const request = await this.grid.dispatch({
            //   action: "get",
            //   path: path
            // });
            // const value = KarmaFieldsAlpha.Type.toArray(request.data);
            //
            // const [driver] = this.resource.driver.split("?");
            //
            // this.writeHistory(value, "table", driver, ...path);

            // KarmaFieldsAlpha.History.backup("data", driver, ...path);
            break;
          }
          default: { // -> filters
            // KarmaFieldsAlpha.Nav.backup(key);
            // const value = this.getParam(key) || "";
            // this.writeHistory(value, "nav", driver, ...path);
            break;
          }

        }

        // const value = await this.getQuery().get(...path);
        // const
        // this.writeHistory(value, "table", this.resource.driver, ...path); // -> "content", [id], [key]
        // if (event.save && (event.backup === "always" || event.backup === "once" && event.path.join("/") !== this.historyId)) {
        //   this.save(event.backup === "once" && event.path.join("/") || null);
        // }
        // if (event.save || event.stage) {
        //   this.stage();
        // }
				break;
      }

      // deprecated
      // case "save":
			case "stage":
				// this.stage();
        // KarmaFieldsAlpha.History.save();
				break;


      case "order": {
        // let order = KarmaFieldsAlpha.Nav.get("order");
        // let orderby = KarmaFieldsAlpha.Nav.get("orderby");
        // const key = event.path[0];
        // const params = {};
        //
        // if (orderby === key) {
        //
        //   params.order = order === "asc" ? "desc" : "asc";
        //
        // } else {
        //
        //   params.order = event.order || "asc";
        //   params.orderby = key;
        //
        // }
        //
        // KarmaFieldsAlpha.Nav.change(params, true);


        KarmaFieldsAlpha.History.save();

        let order = KarmaFieldsAlpha.Nav.get("order");
        let orderby = KarmaFieldsAlpha.Nav.get("orderby");
        const key = event.path[0];

        if (orderby === key) {

          KarmaFieldsAlpha.Nav.change("pack", order === "asc" ? "desc" : "asc", order, "order");

        } else {

          KarmaFieldsAlpha.Nav.change("pack", event.order || "asc", order, "order");
          KarmaFieldsAlpha.Nav.change("pack", key, orderby, "orderby");

        }



        // this.clearQuery();
        this.idsBuffer.empty();
        await this.render();
        break;
      }




      // -> to gateway
      default:
        event.path.shift();
        await super.dispatch(event);
        break;

			// case "backup&save":
			// 	await this.write(...event.path);
			// 	this.save();
			// 	break;

			// case "set": {
			// 	if (event.backup === "once") {
			// 		const id = event.path.join("/");
			// 		if (id !== this.historyId) {
			// 			await this.write(...event.path);
			// 			this.save(id);
			// 			// this.historyId = id;
			// 		}
			// 	} else if (event.backup === "always") {
			// 		await this.write(...event.path);
			// 		this.save();
			// 		// this.historyId = null;
			// 	}
			// 	const path = [...event.path]; // -> prevent append "content"
			// 	await super.dispatch(event);
      //
			// 	this.writeHistory(event.getArray(), "data", ...path);
			// 	break;
			// }


    }

    return event;
  }


  // async getValue(...path) {
  //
  //   const key = path.shift();
  //
  //   switch (key) {
  //
  //     case "content":
  //       return this.getRemoteValue(...path);
  //
  //     case "options":
  //       return this.getOptionsValue(...path);
  //
  //     // case "controls":
  //     //   return this.getControlsValue(...path);
  //     //
  //     // case "header":
  //     //   return this.getHeaderValue(...path);
  //
  //     case "selection":
  //       return this.interface.hasRowSelected();
  //       // return (await this.getSelectedIds()).length > 0;
  //
  //     case "undo":
  //       return this.hasUndo();
  //
  //     case "redo":
  //       return this.hasRedo();
  //
  //     case "count":
  //       return this.getCount();
  //
  //     case "page":
  //       return this.getPage();
  //
  //     case "lastpage":
  //       return await this.getNumPage() === this.getPage();
  //
  //     case "numpage":
  //       return this.getNumPage();
  //
  //
  //
  //
  //
  //
  //     default: // -> filters
  //       return this.getParam(key);
  //
  //   }
  //
  // }
  //
  // async setValue(value, ...path) { // value is an array
  //
  //   const key = path.shift();
  //
  //   switch (key) {
  //
  //     case "content": // -> autosave
  //       await this.send(value, ...path);
  //
  //       // await this.grid.render();
  //       // await this.interface.render();
  //       break;
  //
  //     // case "order":
  //     // case "orderby": {
  //     //   const order = this.getParam("order");
  //     //   const orderby = this.getParam("orderby");
  //     //   if (orderby === key) {
  //     //     this.setParams({
  //     //       page: 1,
  //     //       order: order === "asc" ? "desc" : "asc",
  //     //     });
  //     //   } else {
  //     //     const child = this.resource.children.find(resource => (resource.orderby || resource.key) === key);
  //     //     this.setParams({
  //     //       page: 1,
  //     //       order: child && child.order || "asc",
  //     //       orderby: key
  //     //     });
  //     //   }
  //     //   this.clearQuery();
  //     //   this.render();
  //     //   break;
  //     // }
  //     // case "hash": // -> from undo/redo
  //     //   this.clearQuery();
  //     //   this.clearCount();
  //     //   KarmaFieldsAlpha.Nav.setHash(value[0]);
  //     //   this.render();
  //     //   break;
  //
  //     default: { // -> filters
  //       // this.setParam(1, "page");
  //       // this.setParam(value[0], key);
  //       // KarmaFieldsAlpha.Nav.set(1, "page", true);
  //       // this.setParam(value[0], key);
  //
  //       // KarmaFieldsAlpha.Nav.set(value[0], key);
  //       this.setParams({
  //         page: 1,
  //         [key]: value[0]
  //       });
  //       this.clearCount();
  //       this.clearQuery();
  //       this.render();
  //       break;
  //     }
  //
  //   }
  //
  // }
  //
  // async sendValue(value, ...path) {
  //
  //   const key = path.shift();
  //
  //   switch (key) {
  //
  //     case "content": // -> save grid
  //       await this.send(value, ...path);
  //       break;
  //
  //     case "options":
  //       this.options.open = false;
  //       if (value.ppp) {
  //         KarmaFieldsAlpha.Nav.set(1, "page", true);
  //         this.setParam(value.ppp[0], "ppp");
  //         this.clearCount();
  //         this.clearQuery();
  //         this.render();
  //       }
  //       if (value.columns) {
  //         this.optionsBuffer.set(value.columns, "columns");
  //         await this.render(true);
  //       }
  //       break;
  //
  //     default: // -> filters + order
  //       console.log(value, path);
  //       break;
  //
  //   }
  //
  // }
  //
  // async getOptionsValue(key) {
  //
  //   switch (key) {
  //     case "ppp": return this.getPpp();
  //     case "columns": return this.getColumns();
  //   }
  //
  // }

  async getNumPage() {
    const count = await this.getCount();
    const ppp = this.getPpp();
    return Math.max(1, Math.ceil(count/ppp));
  }

  getPage() {
    if (KarmaFieldsAlpha.Nav.has("page")) {
      return Number(KarmaFieldsAlpha.Nav.get("page"));
    }
    return 1;
    // return this.hasParam("page") && Number(this.getParam("page")) || 1;
  }

  // prev modal
  async prev() {
    let ids = await this.getIds();
    let id = this.getParam("id");
    const page = await this.get("page", 0);
    const index = ids.indexOf(id);

    if (index === 0) {
      if (page > 1) {
        this.setParam(page - 1, "page");
        ids = await this.getIds();
        id = ids[ids.length - 1];
      } else {
        id = ids[0];
      }
    } else if (index > -1) {
      id = ids[index - 1];
    }
    this.setParam(id, "id");
  }

  async next() {
    let ids = await this.getIds();
    let id = this.getParam("id");
    const page = await this.get("page", 0);
    const numpage = await this.get("numpage");
    const index = ids.indexOf(id);

    if (index === ids.length-1) {
      if (page < numpage) {
        this.setParam(page + 1, "page");
        ids = await this.getIds();
        id = ids[0];
      } else {
        id = ids[ids.length - 1];
      }
    } else if (index > -1) {
      id = ids[index + 1];
    }
    this.setParam(id, "id");
  }

  // getDefaultPpp() {
  //   return this.resource.ppp || 10;
  // }
  //
  // getPpp() {
  //   // return Number(this.options.getParam("ppp") || this.getParam("ppp") || this.resource.ppp || 10);
  //   let value = this.options.getChild("form").buffer.get("ppp") || [];
  //   return value[0] || this.getDefaultPpp();
  // }


  // async write(...path) {
  //
	// 	const event = this.createEvent({
	// 		action: "get",
	// 		type: "array",
	// 		path: [...path]
	// 	});
  //
	// 	await super.dispatch(event);
  //
	// 	this.writeHistory(event.getArray(), "data", ...path);
	// }


  stage(id) {

    console.error("deprecated table.stage. Use KarmaFieldsAlpha.History.save");

		// -> increase index and max
		let index = this.history.get("index") || 0;
		index++;

		this.history.set(index, "index");
		this.history.set(index, "max");

		// erase history forward
		if (this.history.has(index)) {
			this.history.remove(index);
		}

		this.historyId = id;

	}

  writeHistory(value, currentValue, ...path) {

    // console.error("deprecated table.writeHistory. Use KarmaFieldsAlpha.History.write");

		// const index = this.history.get("index") || 0;
    //
    // // -> check if new value is different that current value ?
    // // if (KarmaFieldsAlpha.DeepObject.equal(value, this.history.get(index, ...path))) {
    // //   console.error("same value!", value, this.history.get(index, ...path));
    // // }
    //
		// this.history.set(value, index, ...path);

    // KarmaFieldsAlpha.History.write(value, "data", this.driver, ...path);

    // const currentValue = await this.getQuery().get(...path);

    // console.log(value, currentValue, path);

    // KarmaFieldsAlpha.History.pack(value, currentValue, "data", this.driver, ...path);

    KarmaFieldsAlpha.History.backup(value, currentValue, false, "data", this.driver, ...path);


	}

  undo() {

    console.error("deprecated table.undo. Use KarmaFieldsAlpha.History.undo");

		let index = this.history.get("index") || 0;

		if (index > 0) {

			// decrement index and save
			index--;
			this.history.set(index, "index");

			// rewind previous state
      const driver = this.getQuery().driver;
			const content = this.history.get(index, "data", driver) || {};
			this.grid.buffer.merge(content);

      const nav = this.history.get(index, "nav") || {};
			KarmaFieldsAlpha.Nav.merge(nav, true);


			// clear history id
			// this.historyId = undefined;

		}

	}

  hasUndo() {

    console.error("deprecated table.hasUndo. Use KarmaFieldsAlpha.History.hasUndo");

		const index = this.history.get("index") || 0;
		return index > 0;
	}

  redo() {

    console.error("deprecated table.redo. Use KarmaFieldsAlpha.History.redo");

		let index = this.history.get("index") || 0;
		let max = this.history.get("max") || 0;

		if (index < max) {

			// increment index and save
			index++;
			this.history.set(index, "index");

			// merge state in delta
			const content = this.history.get(index, "content") || {};
			this.grid.buffer.merge(content);

      const nav = this.history.get(index, "nav") || {};
			KarmaFieldsAlpha.Nav.merge(nav, true);

			// clear history id
			// this.historyId = undefined;


		}

	}

	hasRedo() {

    console.error("deprecated table.hasRedo. Use KarmaFieldsAlpha.History.hasRedo");

		const index = this.history.get("index") || 0;
		const max = this.history.get("max") || 0;
		return index < max;
	}





  // async splash(from, request) {
	// 	for (let child of this.children) {
  //     if (child !== from) {
  //       await child.update(from, request);
  //     }
	// 	}
	// }


  build() {
    return {
      class: "karma-field-table",
      init: table => {
        this.render = table.render;

        // this.clearQuery();
        // this.clearCount();
      },
      update: table => {

        table.element.classList.add("table-loading");
        const active = this.getParam("karma") === this.resource.id;
        table.element.style.display = active ? "flex" : "none";

        if (active) {
          table.children = [
            this.interface.build(),
            {
              class: "table-view",
              children: [
                this.buildModal(),
                {
                  class: "table-main",
                  children: [
                    {
                      class: "table-header karma-field-frame",
                      child: this.header.build()
                    },
                    {
                      class: "table-body karma-field-table-columns",
                      children: [
                        {
                          class: "karma-field-table-column grid-column",
                          children: [

                            {
                              class: "karma-field-table-section karma-field-frame final",
                              init: filters => {
                                filters.element.classList.toggle("hidden", !this.resource.filters);
                              },
                              // child: this.filters.build()
                              child: this.createChild({
                                type: "group",
                                ...this.resource.filters,
                                id: "filters",
                                value: "filters"
                              }).build()
                            },
                            // ...this.subsections.map(subsection => {
                            //   return {
                            //     class: "karma-field-table-section karma-field-frame final",
                            //     child: subsection.build()
                            //   };
                            // }),
                            ...(this.resource.subsections || []).map(resource => {
                              return {
                                class: "karma-field-table-section karma-field-frame final",
                                child: this.createChild(resource).build()
                              };
                            }),
                            // content.build()
                            {
                              class: "karma-field-table-grid-container karma-field-frame karma-field-group final",
                              init: body => {
                                // this.renderBody = body.render;

                                // this.listeners.push(body.render);
                              },
                              child: this.buildGrid()

                            }
                          ]
                        },
                        {
                          class: "karma-field-table-column options-column karma-field-frame final",
                          init: column => {
                            // this.listeners.push(column.render);
                            this.options.render = column.render;
                          },
                          update: column => {
                            column.element.classList.toggle("hidden", !this.options.open);
                            column.children = this.options.open ? [this.options.getModal().build()] : [];
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              class: "table-footer table-control",
              init: footer => {
                this.controls.render = footer.render;
              },
              update: footer => {
                footer.element.classList.toggle("hidden", this.resource.controls === false);
                if (this.resource.controls !== false) {
                  footer.child = this.controls.build();
                }
              }
            }
          ];
        } else {
          table.children = [];
        }
      },
      complete: table => {
        table.element.classList.remove("table-loading");
      }
      // children: [
      //   {
      //     class: "table-view",
      //     children: [
      //       // {
      //       //   class: "table-modal",
      //       //   init: single => {
      //       //
      //       //   },
      //       //   update: async single => {
      //       //
      //       //     single.children = [];
      //       //
      //       //     if (this.hasParam("id")) {
      //       //
      //       //       // let percentWidth = this.options.getParam("modalWidth") || "100";
      //       //
      //       //       // let percentWidth = this.getModalWidth && this.getModalWidth() || "100";
      //       //
      //       //       let percentWidth = this.options.buffer.get("modalWidth") || ["100"];
      //       //
      //       //       single.element.style.flexBasis = percentWidth[0]+"%";
      //       //
      //       //       const id = this.getParam("id");
      //       //       // const rowField = this.grid.getRow(id);
      //       //       // const rowField = this.grid.createChild({
      //       //       //   key: id,
      //       //       //   columns: this.resource.columns || []
      //       //       // });
      //       //       const row = this.grid.createChild({
      //       //         key: id,
      //       //         type: "field",
      //       //         columns: this.resource.columns || [],
      //       //         id: id
      //       //       });
      //       //
      //       //       const modalField = rowField && rowField.children.find(child => child.resource.type === "modal");
      //       //
      //       //       if (modalField) {
      //       //
      //       //         single.children = [
      //       //           {
      //       //             class: "karma-modal",
      //       //             children: [
      //       //               {
      //       //                 class: "karma-modal-header table-header",
      //       //                 children: [
      //       //                   modalField.build(),
      //       //                   {
      //       //                     class: "modal-navigation",
      //       //                     children: (this.resource.modal_header || [
      //       //                       "prev",
      //       //                       "next",
      //       //                       "closemodal"
      //       //                     ]).map(item => this.constructor.defaults[item])
      //       //
      //       //                   }
      //       //                 ]
      //       //               },
      //       //               {
      //       //                 class: "karma-modal-body karma-field-frame",
      //       //                 update: frame => {
      //       //                   frame.element.classList.toggle("final", modalField.resource.final || false);
      //       //                 },
      //       //                 child: modalField.content.build()
      //       //               }
      //       //             ]
      //       //           },
      //       //           {
      //       //             class: "modal-resize-handle",
      //       //             update: handle => {
      //       //               handle.element.onmousedown = event => {
      //       //                 const mouseMove = event => {
      //       //                   const modalBox = single.element.getBoundingClientRect();
      //       //                   const viewerBox = single.element.parentNode.getBoundingClientRect();
      //       //                   const ratioWidth = (event.clientX - viewerBox.left)/viewerBox.width;
      //       //                   percentWidth = Math.min(100, 100*ratioWidth);
      //       //                   single.element.style.flexBasis = percentWidth.toFixed(4)+"%";
      //       //                   // this.options.setParam(percentWidth, "modalWidth");
      //       //                   this.options.buffer.set([percentWidth], "modalWidth");
      //       //                 }
      //       //                 const mouseUp = event => {
      //       //                   window.removeEventListener("mousemove", mouseMove);
      //       //                   window.removeEventListener("mouseup", mouseUp);
      //       //                 }
      //       //                 window.addEventListener("mousemove", mouseMove);
      //       //                 window.addEventListener("mouseup", mouseUp);
      //       //               }
      //       //             }
      //       //           }
      //       //         ];
      //       //
      //       //       }
      //       //     }
      //       //   }
      //       // },
      //       this.buildModal(),
      //       {
      //         class: "table-main",
      //         children: [
      //           {
      //             class: "table-header karma-field-frame",
      //             child: this.createTablePart({
      //               id: "header",
      //               key: "header",
      //               type: "header",
      //               ...this.resource.header
      //             })
      //           //   update: header => {
      //           //
      //           //
      //           //     const headerField = new KarmaFieldsAlpha.fields.table.header({
      //           //       id: "header",
      //           //       key: "header",
      //           //       ...this.resource.header
      //           //     });
      //           //     this.addChild(headerField);
      //           //     header.child = headerField.build();
      //           //
      //           //   }
      //           },
      //           {
      //             class: "table-body karma-field-table-columns",
      //             children: [
      //               {
      //                 class: "karma-field-table-column grid-column",
      //                 children: [
      //
      //                   {
      //                     class: "karma-field-table-section karma-field-frame final",
      //                     init: filters => {
      //                       filters.element.classList.toggle("hidden", !this.resource.filters);
      //                     },
      //                     // child: this.filters.build()
      //                     child: this.createChild({
      //                       type: "group",
      //                       ...this.resource.filters,
      //                       id: "filters",
      //                       value: "filters"
      //                     }).build()
      //                   },
      //                   // ...this.subsections.map(subsection => {
      //                   //   return {
      //                   //     class: "karma-field-table-section karma-field-frame final",
      //                   //     child: subsection.build()
      //                   //   };
      //                   // }),
      //                   ...(this.resource.subsections || []).map(resource => {
      //                     return {
      //                       class: "karma-field-table-section karma-field-frame final",
      //                       child: this.createChild(resource).build()
      //                     };
      //                   }),
      //                   // content.build()
      //                   {
      //                     class: "karma-field-table-grid-container karma-field-frame karma-field-group final",
      //                     init: body => {
      //                       // this.renderBody = body.render;
      //
      //                       // this.listeners.push(body.render);
      //                     },
      //                     child: this.buildGrid()
      //                   }
      //                 ]
      //               },
      //               {
      //                 class: "karma-field-table-column options-column karma-field-frame final",
      //                 init: column => {
      //                   // this.listeners.push(column.render);
      //                   this.options.render = column.render;
      //                 },
      //                 update: column => {
      //                   column.element.classList.toggle("hidden", !this.options.open);
      //
      //
      //
      //                   // column.children = [];
      //                   // if (currentTable.options.open) {
      //                   //   column.children = [currentTable.options.build()];
      //                   // }
      //                   column.children = this.options.open ? [this.options.getModal().build()] : [];
      //                 }
      //               }
      //             ]
      //           }
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     class: "table-footer table-control",
      //     init: footer => {
      //       this.controls.render = footer.render;
      //     },
      //     update: footer => {
      //       footer.element.classList.toggle("hidden", this.resource.controls === false);
      //
      //       if (this.resource.controls !== false) {
      //         // const controlsField = new KarmaFieldsAlpha.fields.table.controls({
      //         //   id: "controls",
      //         //   key: "controls",
      //         //   ...this.resource.controls
      //         // });
      //         // this.addChild(controlsField);
      //         // footer.child = controlsField.build();
      //
      //         // footer.child = this.createTablePart({
      //         //   id: "controls",
      //         //   key: "controls",
      //         //   type: "controls",
      //         //   ...this.resource.controls
      //         // });
      //
      //         footer.child = this.controls.build();
      //
      //         // footer.child = this.createChild({
      //         //   id: "footer",
      //         //   key: "controls",
      //         //   type: "group",
      //         //   display: "flex",
      //         //   children: [
      //         //     {
      //         //       type: "group",
      //         //       display: "flex",
      //         //       style: "flex-grow:1",
      //         //       children: (this.resource.footer_left_buttons || ["save", "add", "delete"]).map(button => {
      //         //         return this.constructor.defaults[button];
      //         //       })
      //         //     },
      //         //     {
      //         //       type: "group",
      //         //       display: "flex",
      //         //       container: {style: "justify-content:flex-end"},
      //         //       children: (this.resource.footer_right_buttons || ["undo", "redo"]).map(button => {
      //         //         return this.constructor.defaults[button];
      //         //       })
      //         //     }
      //         //   ]
      //         // }).build();
      //       }
      //     }
      //   }
      // ]
    };
  }


  async getIds() {
    // const queriedIds = await this.getQueriedIds();
    //
    // const extraIds = this.extraIdBuffer.get("ids") || [];
    //
    // const ids = [...extraIds, ...queriedIds].filter(id => {
    //   const trash = this.grid.buffer.get(id, "trash") || this.buffer.get(id, "trash");
    //   return !trash || trash[0] !== "1";
    // });

    let ids = this.idsBuffer.get("ids");

    if (!ids) {

      ids = await this.getQueriedIds() || [];

      this.idsBuffer.set(ids, "ids");

      // KarmaFieldsAlpha.History.backup(ids, undefined, false, "ids", this.driver, "ids");

      KarmaFieldsAlpha.History.push(ids, "ids", this.driver, "ids");

    }

    return ids;
  }

  // getExtraOrder(id) {
  //   return this.extraOrders && this.extraOrders[id] || 0;
  // }
  //
  // setExtraOrder(id, order) {
  //   if (!this.extraOrders) {
  //     this.extraOrders = {};
  //   }
  //   this.extraOrders[id] = order;
  // }

  // // deprecated
  // getRow(id) {
  //
  //   // let row = this.getChild(id);
  //   //
  //   // if (!row) {
  //   //   row = new KarmaFieldsAlpha.fields.tableRow({
  //   //     key: id,
  //   //     columns: this.resource.columns
  //   //   });
  //   //   this.addChild(row);
  //   // }
  //   //
  //   // return row;
  //
  //   return this.grid.createChild({
  //     key: id,
  //     columns: this.resource.columns || []
  //   });
  // }


  async add(num) {

    let rows = await KarmaFieldsAlpha.Gateway.post("add/"+this.driver, {num: num});


    // compat
    if (!Array.isArray(rows)) {
      rows = [rows];
    }
    rows = rows.map(row => {
      if (typeof row !== "object") {
        return {id: row.toString()};
      }
      if (!row.trash) {
        row.trash = "1";
      }
      return row;
    });




    // const resources = this.getSubResources(this.resource);
    const resources = KarmaFieldsAlpha.Resource.getSubResources(this.resource);

    // for (let row of rows) {
    //
    //   for (let key in row) {
    //
    //     this.buffer.set([row[key]], row.id, key, 0);
    //
    //   }
    //
    //   for (let resource of resources) {
    //
    //     // this.writeHistory(null, "content", row.id, resource.key);
    //     // KarmaFieldsAlpha.History.write(null, this.driver, row.id, resource.key);
    //     this.writeHistory(null, row.id, resource.key); // or: this.backup(row.id, resource.key);
    //
    //
    //   }
    //
    //   // this.writeHistory(["1"], "content", row.id, "trash");
    //   // KarmaFieldsAlpha.History.write(["1"], this.driver, row.id, "trash");
    //   this.writeHistory(["1"], row.id, "trash");
    //
    // }



    // this.stage();
    KarmaFieldsAlpha.History.save();

    for (let row of rows) {

      // for (let key in row) {
      //
      //   const value = KarmaFieldsAlpha.Type.toArray(row[key]);
      //
      //   this.buffer.set(value, row.id, key);
      //   // this.grid.buffer.set(value, row.id, key);
      //   // this.writeHistory(value, null, row.id, key);
      //
      // }

      for (let resource of resources) {

        const field = this.createField(resource);

        let defaultValue = await field.getDefault();

        defaultValue = KarmaFieldsAlpha.Type.toArray(defaultValue);


        this.grid.buffer.set(defaultValue, row.id, resource.key);
        this.writeHistory(defaultValue, null, row.id, resource.key);

      }

      this.buffer.set(["1"], row.id, "trash"); // -> when add and delete a row without saving
      this.grid.buffer.set(["0"], row.id, "trash");
      this.writeHistory(["0"], ["1"], row.id, "trash");


      // const ids = this.idsBuffer.get("ids") || [];




    }

    const ids = await this.getIds();
    const newIds = [...rows.map(row => row.id), ...ids];

    this.idsBuffer.set(newIds, "ids");

    KarmaFieldsAlpha.History.backup(newIds, ids, false, "ids", this.driver, "ids");

    // const ids = rows.map(row => row.id);
    //
    // const extraIds = this.extraIdBuffer.get("ids") || [];
    // this.extraIdBuffer.set([...ids, ...extraIds], "ids");

    return rows.map(row => row.id);
  }

  async remove() {
    let ids = await this.getSelectedIds();

    const resources = KarmaFieldsAlpha.Resource.getSubResources(this.resource);

    // for (let id of ids) {
    //
    //   this.writeHistory(["0"], id, "trash");
    //   // this.backup(id, "trash");
    //
    //   for (let resource of resources) {
    //
    //     // await this.grid.write(id, resource.key);
    //     // const value = this.grid.buffer.get(id, resource.key) || await this.getValue("content", id, resource.key);
    //     //
    //     // this.writeHistory(value, id, resource.key);
    //
    //     this.backup(id, resource.key);
    //
    //   }
    //
    // }

    // this.stage();
    KarmaFieldsAlpha.History.save();

    for (let id of ids) {

      for (let resource of resources) {

        const currentValue = this.grid.buffer.get(id, resource.key) || await this.store.getValue(id, resource.key);

        this.grid.buffer.remove(id, resource.key);
        await this.writeHistory(null, currentValue, id, resource.key);

      }

      this.grid.buffer.set(["1"], id, "trash");
      this.writeHistory(["1"], ["0"], id, "trash");



    }

    const currentIds = await this.getIds();
    const newIds = currentIds.filter(id => !ids.includes(id));
    this.idsBuffer.set(newIds, "ids");
    KarmaFieldsAlpha.History.backup(newIds, currentIds, false, "ids", this.driver, "ids");

    // const extraIds = this.extraIdBuffer.get("ids") || [];
    // this.extraIdBuffer.set(extraIds.filter(id => ids.indexOf(id) === -1), "ids");

  }

  async duplicate() {
    let ids = await this.getSelectedIds();

    if (ids.length) {
      const cloneIds = await this.add(ids.length);

      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let cloneId = cloneIds[i];

        const resources = KarmaFieldsAlpha.Resource.getSubResources(this.resource);

        for (let resource of resources) {

          const value = this.grid.buffer.get(id, resource.key); // || await this.getValue("content", id, resource.key);

          if (value) {
            this.grid.buffer.set(value, cloneId, resource.key);
            this.writeHistory(value, null, cloneId, resource.key);
          }

        }

        // for (let column of this.resource.column) {
        //
        //   if (column.field.key) {
        //
        //     const value = await grid.getValue(id, column.field.key);
        //     grid.setValue(value, cloneId, column.field.key);
        //     grid.writeHistory(value, cloneId, column.field.key);
        //
        //   }
        //
        // }

        // const contentIds = await this.get("ids");
        // let index = contentIds.indexOf(ids[ids.length-1]);
        //
        // this.setExtraOrder(cloneId, index+1);

        // this.extraIdBuffer.set([id, ...this.extraIdBuffer.get()]);

      }

    }
  }


  async getSelectedIds() {
    if (this.hasParam("id")) {
      return [this.getParam("id")];
      // } else if (this.interface.selection && this.interface.selection.width === this.interface.elementsMap.width) {
      //   const ids = await this.getIds();
      //   return ids.slice(this.interface.selection.y, this.interface.selection.y + this.interface.selection.height);
    } else if (this.interface.hasRowSelected()) {
      const ids = await this.getIds();
      return ids.slice(this.interface.selection.y, this.interface.selection.y + this.interface.selection.height);
    }
    return [];
  }


  // updateGridClasses() {
  //   // noop
  // }

  buildGrid() {
    return {
      class: "table grid",
      init: async grid => {

        this.grid.render = grid.render;

        // this.updateGridClasses = () => {
        //   grid.element.classList.toggle("has-selections", this.interface.selection && this.interface.selection.width*this.interface.selection.height > 1 || false);
        //
        //   grid.element.classList.toggle("selecting", Boolean(this.interface.focusRect));
        // }

        if (this.resource.style) {
          grid.element.style = this.resource.style;
        } else if (this.resource.grid && this.resource.grid.style) {
          grid.element.style = this.resource.grid.style;
        }
      },
      update: async grid => {


        const ids = await this.getIds();
        const page = this.getPage();
        const ppp = this.getPpp();
        const columns = this.getColumns();
        const order = this.getOrder();
        const orderby = this.getOrderby();

        this.interface.registerTable(grid.element);

        if (ids.length) {
          grid.element.classList.add("filled"); // -> draw table borders
          grid.children = [
            {
              class: "th",
              child: {
                class: "table-index",
                init: node => {
                  node.element.textContent = "#";
                }
              },
              update: th => {
                this.interface.registerHeaderIndex(th.element);
              }
            },
            ...columns.map((colId, colIndex) => {
              const child = this.resource.children[colId];
              return {
                class: "th table-header-cell",
                init: th => {
                  if (child.style) {
                    th.element.style = child.style;
                  }
                },
                update: th => {
                  th.children = [
                    {
                      tag: "a",
                      class: "header-cell-title",
                      init: a => {
                        a.element.textContent = child.label;
                      }
                    },
                  ];
                  if (child.sortable) {

                    th.children.push(this.createTablePart({
                      type: "sorter",
                      id: "sorter-"+(child.orderby || child.key),
                      key: child.orderby || child.key,
                      order: child.order
                    }).build());


                    // th.children.push({
                    //   tag: "a",
                    //   class: "header-cell-order",
                    //   child: {
                    //     tag: "span",
                    //     class: "dashicons",
                    //     update: span => {
                    //       // const order = this.getParam("order");
                    //       // const orderby = this.getParam("orderby");
                    //       const isAsc = orderby.toString() === (column.orderby || column.field.key) && order.toString() === "asc";
                    //       const isDesc = orderby.toString() === (column.orderby || column.field.key) && order.toString() === "desc";
                    //       span.element.classList.toggle("dashicons-arrow-up", isAsc);
                    //       span.element.classList.toggle("dashicons-arrow-down", isDesc);
                    //       span.element.classList.toggle("dashicons-leftright", !isAsc && !isDesc);
                    //     }
                    //   },
                    //   update: a => {
                    //     a.element.onclick = async event => {
                    //       event.preventDefault();
                    //       a.element.parentNode.classList.add("loading");
                    //       // this.reorder(column);
                    //       const key = column.orderby || column.field.key;
                    //       if (key) {
                    //         if (orderby.toString() === key) {
                    //           this.setParam(order.toString() === "asc" ? "desc" : "asc", "order");
                    //         } else {
                    //           this.setParam(column.order || "asc", "order");
                    //           this.setParam(key, "orderby");
                    //         }
                    //         if (page !== 1) {
                    //           this.setParam(1, "page");
                    //         }
                    //       }
                    //       // await this.parent.edit("order");
                    //       this.tablePromise = null;
                    //       await this.grid.render();
                    //       a.element.parentNode.classList.remove("loading");
                    //     };
                    //   }
                    // });
                  }
                  this.interface.registerHeader(th.element, colIndex);
                }
              }
            }),
            ...ids.reduce((children, id, rowIndex) => {

              const row = this.grid.createChild({
                key: id,
                type: "row",
                children: this.resource.children || [],
                id: id
              });
              return [
                ...children,
                {
                  class: "th",
                  child: {
                    class: "table-index",
                    update: node => {
                      node.element.textContent = (Number(page) - 1)* Number(ppp) + rowIndex + 1;
                    }
                  },
                  update: th => {
                    this.interface.registerIndex(th.element, rowIndex);
                  }
                },
                ...columns.map((colId, colIndex) => {
                  const child = this.resource.children[colId];
                  const field = row.createChild({
                    ...child,
                    id: colId,
                    index: colIndex
                  });

                  return {
                    class: "td table-cell",
                    init: td => {
                      if (child.style) {
                        td.element.style = child.style;
                      }
                    },
                    update: td => {
                      this.interface.registerCell(td.element, colIndex, rowIndex, field);
                    },
                    // child: field.build()
                    children: [
                      field.build(),
                      // {
                      //   tag: "span",
                      //   class: "dashicons dashicons-cloud"
                      // }
                    ]
                  };
                })
              ];
            }, [])
          ];

          grid.element.style.gridTemplateColumns = [
            this.resource.index && this.resource.index.width || "50px",
            ...columns.map(index => this.resource.children[index].width || "auto")
          ].join(" ");

        } else {
          grid.children = [];
          grid.element.classList.remove("filled");
        }
      }
    };
  }

  buildModal() {
    return {
      class: "table-modal",
      init: single => {

      },
      update: async single => {

        single.children = [];

        if (this.hasParam("id")) {

          // let percentWidth = this.options.getParam("modalWidth") || "100";

          // let percentWidth = this.getModalWidth && this.getModalWidth() || "100";

          let percentWidth = this.options.buffer.get("modalWidth") || ["100"];

          single.element.style.flexBasis = percentWidth[0]+"%";

          const id = this.getParam("id");
          // const rowField = this.grid.getRow(id);
          // const rowField = this.grid.createChild({
          //   key: id,
          //   columns: this.resource.columns || []
          // });
          const row = this.grid.createChild({
            key: id,
            type: "field",
            columns: this.resource.children || [],
            id: id
          });

          const modalField = rowField && rowField.children.find(child => child.resource.type === "modal");

          if (modalField) {

            single.children = [
              {
                class: "karma-modal",
                children: [
                  {
                    class: "karma-modal-header table-header",
                    children: [
                      modalField.build(),
                      {
                        class: "modal-navigation",
                        children: (this.resource.modal_header || [
                          "prev",
                          "next",
                          "closemodal"
                        ]).map(item => this.constructor.defaults[item])

                      }
                    ]
                  },
                  {
                    class: "karma-modal-body karma-field-frame",
                    update: frame => {
                      frame.element.classList.toggle("final", modalField.resource.final || false);
                    },
                    child: modalField.content.build()
                  }
                ]
              },
              {
                class: "modal-resize-handle",
                update: handle => {
                  handle.element.onmousedown = event => {
                    const mouseMove = event => {
                      const modalBox = single.element.getBoundingClientRect();
                      const viewerBox = single.element.parentNode.getBoundingClientRect();
                      const ratioWidth = (event.clientX - viewerBox.left)/viewerBox.width;
                      percentWidth = Math.min(100, 100*ratioWidth);
                      single.element.style.flexBasis = percentWidth.toFixed(4)+"%";
                      // this.options.setParam(percentWidth, "modalWidth");
                      this.options.buffer.set([percentWidth], "modalWidth");
                    }
                    const mouseUp = event => {
                      window.removeEventListener("mousemove", mouseMove);
                      window.removeEventListener("mouseup", mouseUp);
                    }
                    window.addEventListener("mousemove", mouseMove);
                    window.addEventListener("mouseup", mouseUp);
                  }
                }
              }
            ];

          }
        }
      }
    };
  }

  // createChild(resource) {
  //   const type = resource.type || "group";
  //
  //   if (this.constructor[type]) {
  //     return new this.constructor[type](resource);
  //   }
  //
  //   return super.createChild(resource);
  // }

  createTablePart(resource) {

    return this.createChild(resource);

    // const field = new KarmaFieldsAlpha.fields.table[resource.type](resource);
    // this.addChild(field);
    // return field;
  }

}

KarmaFieldsAlpha.fields.table.controls = class extends KarmaFieldsAlpha.fields.field {

  constructor(...args) {
    super(...args);

    // if (!this.resource.children) {
    //   this.resource.children = (this.resource.buttons || [["save", "add", "delete"], ["undo", "redo"]]).map(buttons => {
    //     return {
    //       type: "group",
    //       display: "flex",
    //       style: "flex-grow:0",
    //       children: buttons.map(button => {
    //         return KarmaFieldsAlpha.fields.table.defaults[button];
    //       })
    //     }
    //   });
    // }
  }

  // build() {
  //   return {
  //     class: "table-control karma-field-container display-flex",
  //     children: this.resource.children.map(resource => {
  //       return this.createChild(resource).build();
  //     })
  //   }
  // }

  build() {
    return this.createChild({
      type: "group",
      display: "flex",
      children: this.resource.children || [
        "reload",
        "save",
        "add",
        "delete",
        "separator",
        "undo",
        "redo"
      ]
    }).build();
  }

}

KarmaFieldsAlpha.fields.table.header = class extends KarmaFieldsAlpha.fields.field {

  constructor(...args) {
    super(...args);

    // this.resource = {
    //   type: "group"
    //   ...this.resource
    // };
    //
    // if (!this.resource.children) {
    //   this.resource.children = (this.resource.items || [
    //     "title",
    //     "count",
    //     "options",
    //     "firstpage",
    //     "prevpage",
    //     "currentpage",
    //     "nextpage",
    //     "lastpage",
    //     "close"
    //   ]).map(item => {
    //     return KarmaFieldsAlpha.fields.table.defaults[item];
    //   });
    // }
  }

  build() {
    return this.createChild({
      type: "group",
      display: "flex",
      // container: {style: "flex-wrap:nowrap"},
      // children: this.resource.children || (this.resource.items || [
      //   "title",
      //   "count",
      //   "options",
      //   "firstpage",
      //   "prevpage",
      //   "currentpage",
      //   "nextpage",
      //   "lastpage",
      //   "close"
      // ]).map(item => {
      //   return KarmaFieldsAlpha.fields.table.defaults[item];
      // })
      children: this.resource.children || [
        "title",
        "count",
        "options",
        "pagination",
        // "firstpage",
        // "prevpage",
        // "currentpage",
        // "nextpage",
        // "lastpage",
        "close"
      ]
      // ...this.resource
    }).build();
    // return {
    //   class: "karma-field-container display-flex",
    //   children: this.resource.children.map(resource => {
    //     return this.createChild(resource).build();
    //   })
    // }
  }

}



KarmaFieldsAlpha.fields.table.interface = class extends KarmaFieldsAlpha.fields.field {

  constructor(...args) {
    super(...args);



    this.elementsMap = new KarmaFieldsAlpha.Grid();
    this.fieldsMap = new KarmaFieldsAlpha.Grid();
    this.indexMap = {};


    // document.body.appendChild(this.ta);

  }

  async importData(data, field) {

    const point = field && this.fieldsMap.find(field) || {};

    const {x, y, width, height} = {...new KarmaFieldsAlpha.Rect(), ...point, ...this.selection};



    // for (let j = 0; j < Math.max(height, data.length); j++) {
    //   for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
    //     const field = this.fieldsMap.get(x + i, y + j);
    //     if (field) {
    //       await field.backup();
    //     }
    //   }
    // }

    // this.parent.grid.save("import-data");
    KarmaFieldsAlpha.History.save();

    for (let j = 0; j < Math.max(height, data.length); j++) {
      for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {

        const field = this.fieldsMap.get(x + i, y + j);

        if (field) {
          const value = data[j%data.length][i%data[j%data.length].length];

          await field.dispatch({
  					action: "set",
  					type: "string",
  					backup: "pack",
  					// autosave: this.resource.autosave,
  					data: [value]
  				});



          // await field.render();
        }
      }
    }

    await this.dispatch({
      action: "edit"
    });

  }



  registerTable(element) {

    this.endSelection();

    this.elementsMap = new KarmaFieldsAlpha.Grid();
    this.fieldsMap = new KarmaFieldsAlpha.Grid();
    this.indexMap = {};

  }

  registerCell(element, col, row, field) {

    this.elementsMap.set(element, col, row);
    this.fieldsMap.set(field, col, row);

    const onMouseUp = event => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
      this.selecting = false;
      this.editSelection();
    }

    const onMouseMove = event => {
      const elementUnderPoint = document.elementFromPoint(event.clientX, event.clientY);
      const target = elementUnderPoint && elementUnderPoint.closest(".td");
      const point = target && this.elementsMap.find(target);
      if (point) {
        this.growSelection({...point, width: 1, height: 1});
      }
    }

    element.onmousedown = event => {
      this.selecting = true;
      if (event.shiftKey) {
        event.preventDefault(); // -> prevent focus lose on TA
        this.growSelection({x: col, y:row, width: 1, height: 1});
      } else {
        this.startSelection({x: col, y:row, width: 1, height: 1});
      }
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
    }

    // element.onfocusin = event => {
    //   this.focusTarget = event.target;
    // }


  }

  registerIndex(element, row) {

    this.indexMap[row] = element;

    const onMouseUp = event => {
      document.removeEventListener("mouseup", onMouseUp);
      this.selecting = false;
      this.editSelection();
    }

    element.onmousedown = event => {
      this.selecting = true;
      if (event.shiftKey) {
        event.preventDefault(); // -> prevent focus lose on TA
        this.growSelection({x: 0, y: row, width: this.elementsMap.width, height: 1});
      } else {
        this.startSelection({x: 0, y: row, width: this.elementsMap.width, height: 1});
      }
      document.addEventListener("mouseup", onMouseUp);
    }

    element.onmouseover = event => {
      if (this.selecting && event.buttons === 1) {
        this.growSelection({x: 0, y: row, width: this.elementsMap.width, height: 1});
      }
    }

  }

  registerHeader(element, col) {

    const onMouseUp = event => {
      document.removeEventListener("mouseup", onMouseUp);
      this.selecting = false;
      this.editSelection();
    }

    element.onmousedown = event => {
      this.selecting = true;
      if (event.shiftKey) {
        event.preventDefault(); // -> prevent focus lose on TA
        this.growSelection({x: col, y: 0, width: 1, height: this.elementsMap.height});
      } else {
        this.startSelection({x: col, y: 0, width: 1, height: this.elementsMap.height});
      }
      document.addEventListener("mouseup", onMouseUp);
    }

    element.onmouseover = event => {
      if (this.selecting && event.buttons === 1) {
        this.growSelection({x: col, y: 0, width: 1, height: this.elementsMap.height});
      }
    }

  }

  registerHeaderIndex(element) {

    const onMouseUp = event => {
      document.removeEventListener("mouseup", onMouseUp);
      this.selecting = false;
      this.editSelection();
    }

    element.onmousedown = event => {
      this.selecting = true;
      this.startSelection({x: 0, y: 0, width:this.elementsMap.width, height:this.elementsMap.height});
      document.addEventListener("mouseup", onMouseUp);
    }

    element.onmouseover = event => {
      if (this.selecting && event.buttons === 1) {
        this.growSelection({x: 0, y: 0, width:this.elementsMap.width, height:this.elementsMap.height});
      }
    }

    // element.onmousedown = event => {
    //   event.preventDefault();
    //   this.toggleSelection({x:0, y:0, width:this.elementsMap.width, height:this.elementsMap.height});
    // }
    //
    // element.onmousemove = event => {
    //   if (event.buttons === 1) {
    //     this.growSelection({x: 0, y :0, width: this.elementsMap.width, height: this.elementsMap.height});
    //   }
    // }
  }

  growSelection(r) {
    if (this.focusRect) {
      r = KarmaFieldsAlpha.Rect.union(this.focusRect, r);
    } else {
      this.focusRect = r;
    }

    // if (!this.selection) {
    //   this.selection = r;
    //   this.paint(this.selection);
    // } else if (!KarmaFieldsAlpha.Rect.equals(this.selection, r)) {
    //   this.unpaint(this.selection);
    //   this.selection = r;
    //   this.paint(this.selection);
    // }


    if (!this.selection || !KarmaFieldsAlpha.Rect.equals(this.selection, r)) {
      // if (this.selection) {
      //   this.unpaint(this.selection);
      // }
      // this.selection = r;
      // if (this.selection.width*this.selection.height > 1) {
      //   this.paint(this.selection);
      // }
      this.deltaSelection(r);
      this.hasSelection = true;
    }


  }

  deltaSelection(r) {
    if (this.selection) {
      this.unpaint(this.selection);
    }
    this.selection = r;
    if (this.selection.width*this.selection.height > 1) {
      this.paint(this.selection);
    }
  }

  startSelection(r) {
    this.focusRect = r;
    // if (this.selection) {
    //   this.unpaint(this.selection);
    // }
    // this.selection = r;
    // if (this.selection.width*this.selection.height > 1) {
    //   this.paint(this.selection);
    // }
    this.deltaSelection(r);
    this.hasSelection = true;
  }

  // toggleSelection(r) {
  //   if (this.selection && KarmaFieldsAlpha.Rect.equals(this.selection, r)) {
  //     this.endSelection();
  //   } else {
  //     this.startSelection(r);
  //   }
  // }

  endSelection() {
    if (this.selection) {
      this.unpaint(this.selection);
      this.selection = null;
      this.hasSelection = false;
    }
  }

  hasRowSelected() {
    return this.selection && this.selection.x === 0 && this.selection.width === this.elementsMap.width || false;
  }
  hasCellsSelected() {
    return this.selection && (this.selection.width*this.selection.height > 1) || false;
  }

  editSelection() {
    const request = this.createEvent({
      action: "edit-selection"
    });

    this.dispatch(request);
    this.render();
  }

  paint(rect) {
    // console.log("paint");
    // console.time("paint");
    for (let j = rect.y; j < rect.y + rect.height; j++) {
      if (rect.x === 0 && rect.width === this.elementsMap.width) {
        if (this.indexMap[j]) {
          this.indexMap[j].classList.add("selected");
        }
      }
      for (let i = rect.x; i < rect.x + rect.width; i++) {
        let element = this.elementsMap.get(i, j);
        if (element) {
          element.classList.add("selected");
        }
      }
    }
    // console.timeEnd("paint");
  }

  unpaint(rect) {
    // console.log("unpaint");
    // console.time("unpaint");
    for (let j = rect.y; j < rect.y + rect.height; j++) {
      if (rect.x === 0 && rect.width === this.elementsMap.width) {
        if (this.indexMap[j]) {
          this.indexMap[j].classList.remove("selected");
        }
      }
      for (let i = rect.x; i < rect.x + rect.width; i++) {
        let element = this.elementsMap.get(i, j);
        if (element) {
          element.classList.remove("selected");
        }
      }
    }
    // console.timeEnd("unpaint");
  }

  throttle(callback, delay = 200) {
		if (this.throttleTimer) {
			clearTimeout(this.throttleTimer);
		}
		this.throttleTimer = setTimeout(callback, delay);
	}

  async renderTA() {

    const ta = document.createElement("textarea");

    ta.onfocusout = event => {
      const selection = this.selection;
      this.endSelection();
      if (selection && (this.selecting || event.shiftKey)) {
        this.startSelection(selection);
      } else {
        this.editSelection();
      }
    }

    ta.oninput = async event => {

      let data = ta.element.value.split(/[\r\n]/).map(row => row.split("\t"));

      await this.importData(data);

      switch (event.inputType) {

        case "insertFromPaste":
        case "deleteByCut":
        case "deleteContentBackward":
        case "deleteContentForward":
        case "deleteContent":
          ta.element.blur();
          break;

      }

    }

    const data = [];

    if (this.hasCellsSelected()) {

      for (let j = 0; j < this.selection.height; j++) {

        const dataRow = [];

        for (let i = 0; i < this.selection.width; i++) {

          const field = this.fieldsMap.get(this.selection.x + i, this.selection.y + j);
          const value = await field.exportValue();

          dataRow.push(value);

        }

        data.push(dataRow);

      }

      ta.element.focus();
      ta.element.value = data.map(row => row.join("\t")).join("\n");
      ta.element.select();

    }

  }


  build() {
    return {
      tag: "textarea",
      class: "karma-grid-ta2",
      init: ta => {
        this.render = ta.render;

        ta.element.style = "left:-100%;position:absolute;";
        // ta.element.style = "max-height:40px";

        // this.render = clean => {
        //   console.log("render");
        //   ta.render(clean);
        // };

        ta.element.onfocusout = event => {
          const selection = this.selection;
          this.endSelection();
          if (selection && (this.selecting || event.shiftKey)) {
            this.startSelection(selection);
          } else {
            this.editSelection();
          }
        }

        ta.element.oninput = async event => {

          let data = ta.element.value.split(/[\r\n]/).map(row => row.split("\t"));

          await this.importData(data);

          switch (event.inputType) {

            case "insertFromPaste":
            case "deleteByCut":
            case "deleteContentBackward":
            case "deleteContentForward":
            case "deleteContent":
              ta.element.blur();
              break;

          }

        }
      },
      update: async ta => {

        ta.element.blur();


        const data = [];
        // if (this.hasSelection && this.selection && this.selection.width*this.selection.height > 1) {
        // if (this.selection) {

        if (this.hasCellsSelected()) {

          for (let j = 0; j < this.selection.height; j++) {

            const dataRow = [];

            for (let i = 0; i < this.selection.width; i++) {

              const field = this.fieldsMap.get(this.selection.x + i, this.selection.y + j);
              const value = await field.exportValue();

              dataRow.push(value);

            }

            data.push(dataRow);

          }


          ta.element.focus();
          ta.element.value = data.map(row => row.join("\t")).join("\n");
          ta.element.select();



          // this.throttle(() => {
          //   console.log("xx");
          //   ta.element.focus();
          //   ta.element.value = data.map(row => row.join("\t")).join("\n");
          //   ta.element.select();
          // }, 2000);

        // } else if (this.focusTarget) {
        //
        //   ta.element.value = "";
        //   this.focusTarget.focus();
        //   this.focusTarget = null;

        } else {

          // ta.element.value = "";
          // ta.element.blur();


        }
      }
    }
  }

}


KarmaFieldsAlpha.fields.table.grid = class extends KarmaFieldsAlpha.fields.form {

  async dispatch(event, parent) {

    switch (event.action) {

      case "set":




        if (event.field.resource.type === "input" && event.pasted) {


          const value = KarmaFieldsAlpha.Type.toString(event.data);
          const data = value.split(/[\r\n]/).map(row => row.split("\t"));




          // if (data.length > 1 || data[0].length > 1) {

            // await this.dispatch(this.createEvent({
            //   action: "importselection",
            //   data: data,
            //   field: event.target
            // }));
            await super.dispatch({
              action: "importselection",
              data: data,
              field: event.field
            });

            break;

          // }

        }



        await super.dispatch(event);


        // -> render controls + interface
        // await super.dispatch(this.createEvent({
        //   action: "edit-grid",
        //   request: event
        // }));

        break;

      default:
        await super.dispatch(event);
        break;

    }

    return event;
  }

}



KarmaFieldsAlpha.fields.table.sorter = class extends KarmaFieldsAlpha.fields.field {


  build() {
    return {
      tag: "a",
      class: "header-cell-order",
      child: {
        tag: "span",
        class: "dashicons",
        update: span => {
          const order = KarmaFieldsAlpha.Nav.get("order");
          const orderby = KarmaFieldsAlpha.Nav.get("orderby");
          const isAsc = orderby === this.resource.key && order === "asc";
          const isDesc = orderby === this.resource.key && order === "desc";
          span.element.classList.toggle("dashicons-arrow-up", isAsc);
          span.element.classList.toggle("dashicons-arrow-down", isDesc);
          span.element.classList.toggle("dashicons-leftright", !isAsc && !isDesc);
        }
      },
      update: a => {
        a.element.onclick = async event => {
          event.preventDefault();
          a.element.parentNode.classList.add("loading");

          await this.dispatch(this.createEvent({
            action: "order",
            order: this.resource.order,
            path: [this.resource.orderby || this.resource.key]
          }));

          //
          //   const order = KarmaFieldsAlpha.Nav.get("order");
          //   const orderby = KarmaFieldsAlpha.Nav.get("orderby");
          //
          //   if (orderby === this.resource.key) {
          //     this.setParam(order === "asc" ? "desc" : "asc", "order");
          //   } else {
          //     this.setParam(column.order || "asc", "order");
          //     this.setParam(key, "orderby");
          //   }
          //   if (page !== 1) {
          //     this.setParam(1, "page");
          //   }
          // // await this.parent.edit("order");
          // this.tablePromise = null;
          // await this.grid.render();
          a.element.parentNode.classList.remove("loading");
        };
      }
    }
  }
}


KarmaFieldsAlpha.fields.table.grid.row = class extends KarmaFieldsAlpha.fields.field {


  async dispatch(event) {

    switch (event.action) {

      // case "get":
      //   if (event.path && event.path[event.path.length-1] === "id") {
      //     if (event.join) {
      //       await super.dispatch({
      //         action: "join",
      //         data: event.join,
      //         path: [...event.path]
      //       });
      //     }
      //     event.data = [this.resource.key];
      //     break;
      //   }
      //
      //   await super.dispatch(event);
      //   break;

      default:
        await super.dispatch(event);
        break;

    }


    return event;
  }

}
