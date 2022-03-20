
KarmaFieldsAlpha.fields.table = class extends KarmaFieldsAlpha.fields.gateway {

  constructor(...params) {
    super(...params);


    // compat

    if (this.columns) {
      this.children = this.column.map(column => {
        return {
          column,
          ...column.field
        };
      });
    }

    this.extraOrders = {};

    // this.options = this.createChild({
    //   type: "button",
    //   title: "Options",
    //   id: "options",
    //   action: "toggle-options",
    //   modal: {
    //     id: "form",
    //     key: "options",
    //     type: "form",
    //     children: [
    //       {
    //         type: "input",
    //         key: "ppp",
    //         label: "Items number",
    //         input: {type: "number", style: "max-width:5em;"}
    //       },
    //       {
    //         type: "checkboxes",
    //         key: "columns",
    //         label: "Display columns",
    //         options: this.resource.columns.map((column, index) => {
    //           return {
    //             key: index.toString(),
    //             name: column.title
    //           }
    //         })
    //       },
    //       {
    //         type: "group",
    //         display: "flex",
    //         children: [
    //           {
    //             type: "button",
    //             primary: true,
    //             style: "min-width:0",
    //             action: "edit-options",
    //             disabled: "!modified",
    //             title: "Save"
    //           },
    //           {
    //             type: "button",
    //             style: "min-width:0;",
    //             action: "close-options",
    //             title: "Close"
    //           }
    //         ]
    //       }
    //
    //     ]
    //   }
    // });

    this.optionBuffer = new KarmaFieldsAlpha.Buffer("options", this.resource.driver);

    this.grid = this.createChild({
      ...this.resource.grid,
      driver: this.resource.driver,
      columns: this.resource.columns,
      // orderby: this.resource.orderby,
      type: "tableGrid",
      id: "grid"
      // key: "content"
    });

    this.extraIdBuffer = new KarmaFieldsAlpha.Buffer("extraids", this.resource.driver);

  }



  // async getQueriedIds() {
  //   const results = await this.getRemoteTable();
  //   return results.map(row => row.id[0]);
  // }

  // async getParamString() {
  //
  //   const params = new URLSearchParams(KarmaFieldsAlpha.Nav.params);
  //
  //   if (!params.has("page")) {
  //     params.set("page", "1");
  //   }
  //
  //   if (!params.has("ppp")) {
  //     params.set("ppp", await this.get("ppp", 0));
  //   }
  //
  //   if (!params.has("orderby")) {
  //     // params.set("orderby", this.getOrderby());
  //     params.set("orderby", await this.get("orderby", 0));
  //   }
  //
  //   if (!params.has("order")) {
  //     // params.set("order", this.getOrder());
  //     params.set("order", await this.get("order", 0));
  //   }
  //
  //   params.sort();
  //
  //   return params.toString();
  // }


  async queryTable() {

    // const paramString = await this.getParamString();
    const paramString = await this.get("paramstring", 0);
    const driver = this.resource.driver;
    let results = await KarmaFieldsAlpha.Gateway.get("query/"+driver+"?"+paramString);

    results = results.items || results || []; // compat


    // for (let item of results.items || results || []) { // compat
    //
    //   const id = item.id.toString();
    //
    //   for (let key in item) {
    //
    //     const value = [item[key]];
    //
    //     this.buffer.set(value, id, key);
    //   }
    //
    //   this.buffer.set(["0"], item.id.toString(), "trash");
    // }

    // this.buffer.set(results);

    // [
    //   {
    //     id: "1"
    //     date: "2022-03-08",
    //     hour: "20:00"
    //   },
    //   {
    //     id: "2"
    //     date: "2022-03-07",
    //     hour: "20:00"
    //   },
    // ]
    //
    // ->
    //
    // {
    //   1: {
    //     date: ["2022-03-08"],
    //     hour: ["20:00"],
    //     trash: ["0"]
    //   },
    //   2: {
    //     date: ["2022-03-07"],
    //     hour: ["20:00"],
    //     trash: ["0"]
    //   }
    // }

    for (let i = 0; i < results.length; i++) {
      const id = results[i].id.toString();
      for (let key of results[i]) {
        this.buffer.set(results[i][key], id, key, 0);
      }
      this.buffer.set("0", id, "trash", 0);
    }



    return results;
  }

  async getRemoteTable() {
    if (!this.tablePromise) {
      this.tablePromise = this.queryTable();
    }
    return this.tablePromise;
  }




  async queryRelations() {

    const driver = this.resource.driver;
    // const ids = await this.getQueriedIds();
    const ids = await this.get("queriedids");
    const relations = await KarmaFieldsAlpha.Gateway.get("relations/"+driver+"?ids="+ids.join(","));

    // [
    //   {
    //     id: 1,
    //     cat_id: 34
    //   },
    //   {
    //     id: 2,
    //     cat_id: 34
    //   },
    //   {
    //     id: 2,
    //     cat_id: 35
    //   }
    // ]
    //
    // ->
    //
    // {
    //   1: {
    //     cat_id: [34],
    //     date: ["2022-03-08"],
    //     hour: ["20:00"],
    //     items: ["a", "b", "c"]
    //   },
    //   2: {
    //     cat_id: [34, 35],
    //     date: ["2022-03-07"],
    //     hour: ["20:00"],
    //     meta: [
    //       {
    //         x: [23],
    //         y: [12]
    //       }
    //     ]
    //   }
    // }
    //
    // ["1", "date", 0]
    // ["1", "items", 2]
    // ["2", "cat_id", 1]
    // ["2", "meta", 0, "x", 0]

    for (let i = 0; i < relations.length; i++) {
      const id = relations[i].id.toString();
      if (id) {
        for (let key of relations[i]) {
          if (key !== "id") {
            KarmaFieldsAlpha.DeepObject.sanitize(relations[i][key]); // -> compat

            let values = this.buffer.get(id, key) || [];

            // values.push(relations[i][key]);
            this.buffer.set(relations[i][key], id, key, values.length);

            // this.buffer.merge(relations[i][key], id.toString(), 0, key);
          }
        }
      }
    }

    // if (relations.length) {
    //   const groups = relations.reduce((group, item) => {
    //     if (!item.id) {
    //       console.error("item does not have an id");
    //     }
    //     if (!group[item.id]) {
    //       group[item.id] = {};
    //     }
    //     for (let key in item) {
    //       if (key !== "id") {
    //         if (!group[item.id][key]) {
    //           group[item.id][key] = [];
    //         }
    //         group[item.id][key].push(item[key]);
    //       }
    //     }
    //     return group;
    //   }, {});
    //
    //   for (let id of ids) {
    //     for (let key of keys) {
    //       this.buffer.set(groups[id] && groups[id][key] || [], id, key);
    //     }
    //   }
    // }

  }

  // async save(delta, key) {
  //
  //   if (key === "content") {
  //     super.save(delta);
  //   } else {
  //
  //   }
  // }


  async getRemoteRelations() {
    if (!this.relationPromise) {
      this.relationPromise = this.queryRelations();
    }
    return this.relationPromise;
  }

  // async getRemoteValue(id, key) {
  //   await this.getRemoteTable();
  //   await this.getRemoteRelations();
  //
  //   let value = this.buffer.get(id, key);
  //
  //   if (!value && key === "trash") {
  //     value = ["1"];
  //   }
  //
  //   return value || [];
  // }

  async getRemoteValue(...path) {
    await this.getRemoteTable();
    await this.getRemoteRelations();

    // let value = this.buffer.get(id, key);
    //
    // if (!value && key === "trash") {
    //   value = ["1"];
    // }

    return this.buffer.get(...path);
  }

  clearQuery() {
    this.tablePromise = null;
    this.relationPromise = null;
  }

  async getRemoteCount() {
    if (!this.countPromise) {
      // this.countPromise = this.getParamString().then(paramstring => {
      this.countPromise = this.get("paramstring", 0).then(paramstring => {
        return KarmaFieldsAlpha.Gateway.get("count/"+this.resource.driver+"?"+paramstring);
      });
    }
    return this.countPromise;
  }

  // async getCount() {
  //   const count = await this.getRemoteCount();
  //   return Number(count || 0);
  // }

  clearCount() {
    this.countPromise = null;
  }


  getDefaultOrderby() {
    if (!this.defaultOrderby) {
      this.defaultOrderby = this.resource.orderby;
      if (!this.defaultOrderby) {
        const column = this.resource.columns.find(column => (column.orderby || column.field && column.field.key));
        this.defaultOrderby = column && (column.orderby || column.field && column.field.key) || "default";
      }
    }
    return this.defaultOrderby;
  }

  getDefaultOrder() {
    if (!this.defaultOrder) {
      const column = this.resource.orderby && this.resource.columns.find(column => (column.orderby || column.field && column.field.key) === this.resource.orderby);
      this.defaultOrder = column && column.order || "asc";
    }
    return this.defaultOrder;
  }

  // getOrder() {
  //   return this.getParam("order") || this.getDefaultOrder();
  // }
  //
  // getOrderby() {
  //   return this.getParam("orderby") || this.getDefaultOrderby();
  // }




  async get(...path) {

    const key = path.shift();

    switch (key) {

      case "content":
        return super.get(...path);

      case "options":
        return KarmaFieldAlpha.DeepObject.get({
          ppp: [this.getParam("ppp") || this.resource.ppp || 10],
          columns: this.resource.columns.map((column, index) => index.toString()) || []
        }, ...path);

      case "ppp":
      case "columns": {
        return this.optionsBuffer.get(key, ...path) ?? this.get("options", key, ...path);
        // let value = this.optionsBuffer.get(key, ...path);
        // if (value === undefined) {
        //   value = this.get("options", key, ...path);
        // }
        // return value;
      }

        // return this.options.getModal().get(key, ...path);

      case "orderby": {
        const orderby = this.getParam("orderby") || this.getDefaultOrderby();
        return KarmaFieldAlpha.DeepObject.get([orderby], ...path);
      }
        // return KarmaFieldAlpha.DeepObject.get([this.getOrderby()], ...path);

      case "order": {
        const order = this.getParam("order") || this.getDefaultOrder();
        return KarmaFieldAlpha.DeepObject.get([order], ...path);
      }
        // return KarmaFieldAlpha.DeepObject.get([this.getOrder()], ...path);

      case "page": {
        const page = this.hasParam("page") && Number(this.getParam("page")) || 1;
        return KarmaFieldAlpha.DeepObject.get([page], ...path);
      }
        // return KarmaFieldAlpha.DeepObject.get([this.getPage()], ...path);

      case "count": {
        const count = await this.getRemoteCount();
        return KarmaFieldAlpha.DeepObject.get([Number(count || 0)], ...path);
      }

        // return KarmaFieldAlpha.DeepObject.get([await this.getCount()], ...path);

      case "numpage": {
        const count = await this.get("count", 0);
        const ppp = await this.get("ppp", 0);
        const numpage = Math.ceil(count/ppp);
        return KarmaFieldAlpha.DeepObject.get([numpage], ...path);
      }
        // return KarmaFieldAlpha.DeepObject.get([await this.getNumPage()], ...path);

      case "paramstring": {
        const params = new URLSearchParams(KarmaFieldsAlpha.Nav.params);

        if (!params.has("page")) {
          params.set("page", "1");
        }

        if (!params.has("ppp")) {
          params.set("ppp", await this.get("ppp", 0));
        }

        if (!params.has("orderby")) {
          // params.set("orderby", this.getOrderby());
          params.set("orderby", await this.get("orderby", 0));
        }

        if (!params.has("order")) {
          // params.set("order", this.getOrder());
          params.set("order", await this.get("order", 0));
        }

        params.sort();

        // return params.toString();
        KarmaFieldAlpha.DeepObject.get([params.toString()], ...path);
      }
        // return KarmaFieldAlpha.DeepObject.get([await this.getParamString()], ...path);

      case "queriedids": {
        const results = await this.getRemoteTable();
        const ids = results.map(row => row.id);
        return KarmaFieldAlpha.DeepObject.get(ids, ...path);
      }
        // return KarmaFieldAlpha.DeepObject.get(await this.getQueriedIds(), ...path);

      case "ids":
        return KarmaFieldAlpha.DeepObject.get(await this.getIds(), ...path);

      case "selectedids": {
        const grid = this.getGrid();
        if (this.hasParam("id")) {
          KarmaFieldAlpha.DeepObject.get([this.getParam("id")], ...path);
        } else if (grid.selection && grid.selection.width === grid.grid.width) {
          const ids = await this.getIds();
          const selectedIds = ids.slice(grid.selection.y, grid.selection.y + grid.selection.height);
          KarmaFieldAlpha.DeepObject.get(selectedIds, ...path);
        }
      }


      default: // -> filters
        return KarmaFieldAlpha.DeepObject.get([this.getParam(key)], ...path);

    }

  }

  async getState() {

    const state = path.pop();

    switch (state) {

      default:
        return this.get(...path, state);

    }

  }

  async set(value, ...path) {

    const key = path.shift();

    value = KarmaFieldsAlpha.DeepObject.create(value, ...path);

    switch (context) {

      case "content":
        await this.super.set(value);
        break;

      case "options":
        this.optionsBuffer.merge(value);
        this.clearCount();
        this.clearQuery();
        await this.render(1);
        break;

      case "page":
        this.setParam(value[0], "page");
        this.clearQuery();
        await this.render();
        break;

      // case "nextpage":
      //   this.setParam(Math.min(this.getPage()+1, await this.getNumPage()), "page");
      //   this.clearQuery();
      //   await this.render();
      //   break;
      //
      // case "prevpage":
      //   this.setParam(Math.max(this.getPage()-1, 0), "page");
      //   this.clearQuery();
      //   await this.render();
      //   break;
      //
      // case "firstpage":
      //   this.setParam(1, "page");
      //   this.clearQuery();
      //   await this.render();
      //   break;
      //
      // case "lastpage":
      //   this.setParam(await this.getNumPage(), "page");
      //   this.clearQuery();
      //   await this.render();
      //   break;
      //
      //
      // case "reload":
      //   this.clearQuery();
      //   this.clearCount();
      //   KarmaFieldsAlpha.Gateway.clearOptions();
      //   await this.render(1);
      //   break;
      //
      // case "edit-options":
      //   this.clearCount();
      //   this.clearQuery();
      //   await this.render(1);
      //   break;

      // case "toggle-options":
      //   this.options.open = !this.options.open;
      //   await this.render();
      //   break;
      //
      // case "close-options":
      //   this.options.open = false;
      //   await this.render();
      //   break;

      case "add":
        await this.add(value[0]);
        this.clearQuery();
        this.clearCount();
        await this.render(1);
        break;

      case "delete":
        await this.delete(value);
        this.clearQuery();
        this.clearCount();
        await this.render(1);
        break;

      // case "save":
      //   await this.grid.submit();
      //   this.clearQuery();
      //   this.clearCount();
      //   KarmaFieldsAlpha.Gateway.clearOptions();
      //   await this.render(1);
      //   break;
      //
      // case "undo":
      //   this.grid.undo();
      //   await this.render();
      //   break;
      //
      // case "redo":
      //   this.grid.redo();
      //   await this.render();
      //   break;

      // case "gridvalue": // edit field in grid
      //   await this.renderFooter();
      //   break;
      //
      // case "start-selection":
      // case "grow-selection":
      // case "end-selection":
      //   await this.renderFooter();
      //   await super.set(value, ...path, context);
      //   break;
      //
      // case "close":
      // case "nav":
      //   this.clearQuery();
      //   this.clearCount();
      //   KarmaFieldsAlpha.Gateway.clearOptions();
      //   // await super.edit(value);
      //   await super.set(value, ...path, context);
      //   break;

      // case "order":
      //   // this.clearQuery();
      //   this.tablePromise = null;
      //   await this.grid.render();
      //   break;
      //
      // case "value": // -> filters
      // case "pastedvalue": // -> filter search when pasted
      //   // const key = path.shift();
      //   // if (key === "grid") {
      //   //   await super.set(value, ...path, "value");
      //   // } else { // -> filters
      //   //   await this.setParam(value[0], key);
      //   // }
      //
      //   this.clearQuery();
      //   this.clearCount();
      //   this.setParam(value[0], path.join("/"));
      //   this.setParam(1, "page");
      //   await this.render();
      //   break;

      // case "submit":
      //   await super.set(value, ...path, "submit"); // -> to gateway
      //   break;
      //
      // // modal:
      // case "prev":
      //   await this.prev();
      //   await this.render();
      //   break;
      //
      // case "next":
      //   await this.next();
      //   await this.render();
      //   break;
      //
      // case "close-modal":
      //   this.removeParam("id");
      //   await this.render();
      //   break;


      default: // -> filters + order
        this.setParam(value[0], key);
        break;


    }

  }

  async setState(value, ...path) {

    const state = path.pop();

    switch (context) {

      case "nextpage": {
        const page = await this.get("page", 0);
        const numpage = await this.get("numpage", 0);
        this.setParam(Math.min(page+1, numpage), "page");
        this.clearQuery();
        await this.render();
        break;
      }

      case "prevpage": {
        const page = await this.get("page", 0);
        this.setParam(Math.max(page-1, 0), "page");
        this.clearQuery();
        await this.render();
        break;
      }

      case "firstpage": {
        this.setParam(1, "page");
        this.clearQuery();
        await this.render();
        break;
      }

      case "lastpage": {
        const numpage = await this.get("numpage", 0);
        this.setParam(numpage, "page");
        this.clearQuery();
        await this.render();
        break;
      }

      case "reload": {
        this.clearQuery();
        this.clearCount();
        KarmaFieldsAlpha.Gateway.clearOptions();
        await this.render(1);
        break;
      }

      case "toggle-options":
        this.options.open = !this.options.open;
        await this.render();
        break;

      case "close-options":
        this.options.open = false;
        await this.render();
        break;

      case "add":
        await this.add(1);
        this.clearQuery();
        this.clearCount();
        await this.render(1);
        break;

      case "delete": {
        const selectedIds = await this.get("selectedIds");
        await this.delete(selectedIds);
        this.clearQuery();
        this.clearCount();
        await this.render(1);
        break;
      }

      case "save":
        await this.getGrid().setState(null, "submit");
        this.clearQuery();
        this.clearCount();
        KarmaFieldsAlpha.Gateway.clearOptions();
        await this.render(1);
        break;

      case "undo":
        this.getGrid().undo();
        await this.render();
        break;

      case "redo":
        this.getGrid().redo();
        await this.render();
        break;

      case "edit": // edit field in grid
        await this.renderFooter();
        break;

      case "start-selection":
      case "grow-selection":
      case "end-selection":
        await this.renderFooter();
        break;

      case "close":
      case "nav":
        this.clearQuery();
        this.clearCount();
        KarmaFieldsAlpha.Gateway.clearOptions();
        await super.setState(null, ...path, state);
        break;

      case "order":
        this.tablePromise = null;
        await this.getGrid().render();
        break;

      // case "value": // -> filters
      // case "pastedvalue": // -> filter search when pasted
      //   // const key = path.shift();
      //   // if (key === "grid") {
      //   //   await super.set(value, ...path, "value");
      //   // } else { // -> filters
      //   //   await this.setParam(value[0], key);
      //   // }
      //
      //   this.clearQuery();
      //   this.clearCount();
      //   this.setParam(value[0], path.join("/"));
      //   this.setParam(1, "page");
      //   await this.render();
      //   break;

      // case "submit":
      //   await super.set(value, ...path, "submit"); // -> to gateway
      //   break;

      // modal:
      case "prev":
        await this.prev();
        await this.render();
        break;

      case "next":
        await this.next();
        await this.render();
        break;

      case "close-modal":
        this.removeParam("id");
        await this.render();
        break;


      // default:
      //   this.setParam(value[0], context);
      //   break;


    }

  }


  // async getNumPage() {
  //   const count = await this.getCount();
  //   // const ppp = this.getPpp();
  //   const ppp = await this.get("ppp");
  //   return Math.ceil(count/ppp);
  // }

  // getPage() {
  //   return this.hasParam("page") && Number(this.getParam("page")) || 1;
  // }

  // prev modal
  async prev() {
    let ids = this.getIds();
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
    let ids = this.getIds();
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




  build() {
    return {
      class: "karma-field-table",
      init: table => {
        this.render = table.render;
      },
      update: table => {
        table.element.classList.add("table-loading");
      },
      complete: table => {
        table.element.classList.remove("table-loading");
      },
      children: [
        {
          class: "table-view",
          children: [
            {
              class: "table-modal",
              init: single => {

              },
              update: single => {

                single.children = [];

                if (this.hasParam("id")) {

                  // let percentWidth = key && KarmaFieldsAlpha.Delta.get(content.resource.driver+"-options", "modalWidth") || 100;
                  let percentWidth = this.options.getParam("modalWidth") || "100";
                  single.element.style.flexBasis = percentWidth+"%";

                  const id = this.getParam("id");
                  // const rowField = this.grid.getRow(id);
                  const rowField = this.grid.createChild({
                    key: id,
                    columns: this.resource.columns || []
                  })
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

                                // child: this.getModalHeader().build();
                                // child: this.createChild(this.resource.modalheader || this.constructor.defaults.modalheader).build()
                                // child: this.createChild({
                                //   id: "modalheader",
                                //   type: "group",
                                //   children: [
                                //     {
                                //       type: "button",
                                //       value: "prev",
                                //       title: "Previous Item",
                                //       text: "‹"
                                //     },
                                //     {
                                //       type: "button",
                                //       value: "next",
                                //       title: "Next Item",
                                //       text: "›"
                                //     },
                                //     {
                                //       type: "button",
                                //       title: this.resource.close_modal_button || "Close Modal",
                                //       value: "closemodal"
                                //     }
                                //   ]
                                // }).build()
                                // children: [
                                //   this.getButton("prevModal").build(),
                                //   this.getButton("nextModal").build(),
                                //   this.getButton("closeModal").build()
                                // ]
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
                              this.options.setParam(percentWidth, "modalWidth");
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
            },
            {
              class: "table-main",
              children: [
                {
                  class: "table-header karma-field-frame",
                  update: header => {
                    header.child = this.createChild(this.resource.header || {
                      id: "header",
                      type: "group",
                      display: "flex",
                      container: {style: "flex-wrap:nowrap"},
                      children: [
                        // this.resource.header_title || {
                        //   type: "text",
                        //   tag: "h1",
                        //   style: "flex-grow:1",
                        //   class: "ellipsis",
                        //   value: this.resource.title || "Table"
                        // },
                        // this.resource.header_count || {
                        //   type: "text",
                        //   style: "justify-content:center",
                        //   value: "{{count}} elements"
                        // },
                        ...(this.resource.header_elements || ["title", "count"]).map(item => this.constructor.defaults[item]),
                        this.resource.pagination || {
                          type: "group",
                          display: "flex",
                          style: "flex: 0 0 auto; min-width:0",
                          children: (this.resource.header_pagination || [
                            "options",
                            "firstpage",
                            "prevpage",
                            "currentpage",
                            "nextpage",
                            "lastpage",
                            "close"
                          ]).map(item => this.constructor.defaults[item])

                          // [
                          //   this.resource.options_button || {
                          //     type: "button",
                          //     title: "Options",
                          //     value: "toggle-options"
                          //   },
                          //   this.resource.paginationfirstpage || {
                          //     type: "button",
                          //     value: "firstpage",
                          //     title: "First Page",
                          //     text: "«",
                          //     disabled: "isfirstpage",
                          //     hidden: "singlepage"
                          //   },
                          //   this.resource.prevpage || {
                          //     type: "button",
                          //     value: "prevpage",
                          //     title: "Previous Page",
                          //     text: "‹",
                          //     disabled: "isfirstpage",
                          //     hidden: "singlepage"
                          //   },
                          //   this.resource.currentpage || {
                          //     type: "text",
                          //     style: "justify-content:center",
                          //     value: "{{page}} / {{numpage}}",
                          //     hidden: "singlepage"
                          //   },
                          //   this.resource.nextpage || {
                          //     type: "button",
                          //     value: "nextpage",
                          //     title: "Next Page",
                          //     text: "›",
                          //     disabled: "islastpage",
                          //     hidden: "singlepage"
                          //   },
                          //   this.resource.lastpage || {
                          //     type: "button",
                          //     value: "lastpage",
                          //     title: "Last Page",
                          //     text: "»",
                          //     disabled: "islastpage",
                          //     hidden: "singlepage"
                          //   },
                          //   this.resource.closebutton || {
                          //     type: "button",
                          //     text: this.resource.close_button || "×",
                          //     title: this.resource.close_button || "Close Table",
                          //     value: "close"
                          //   }
                          // ]
                        }

                      ]
                    }).build();
                  }
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
                            this.renderBody = body.render;
                          },
                          child: this.grid.build()

                          // update: async body => {
                          //   const ids = await this.getIds();
                          //   const page = this.getPage();
                          //   const ppp = this.options.getParam("ppp");
                          //   const columns = this.options.getParam("columns");
                          //   body.child = this.grid.build(ids, page, ppp, columns);
                          //
                          //
                          // }

                        }
                      ]
                    },
                    {
                      class: "karma-field-table-column options-column karma-field-frame final",
                      update: column => {
                        column.element.classList.toggle("hidden", !this.options.open);
                        // column.children = [];
                        // if (currentTable.options.open) {
                        //   column.children = [currentTable.options.build()];
                        // }
                        column.children = this.options.open ? [this.options.build()] : [];
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          class: "table-control",
          init: footer => {
            this.renderFooter = footer.render;
          },
          update: footer => {
            footer.element.classList.toggle("hidden", this.resource.controls === false);
            //
            // // compat
            // if (currentTable.resource.controls && currentTable.resource.controls instanceof Array) {
            //   currentTable.resource.controls.left = currentTable.resource.controls;
            // }

            if (this.resource.controls !== false) {
              footer.child = this.createChild({
                id: "footer",
                type: "group",
                display: "flex",
                children: [
                  {
                    type: "group",
                    display: "flex",
                    style: "flex-grow:1",
                    children: (this.resource.footer_left_buttons || ["save", "add", "delete"]).map(button => {
                      return this.constructor.defaults[button];
                    })

                    // children: this.resource.footer_left_buttons || [
                    //   this.resource.save_button || {
                    //     type: "button",
                    //     value: "save",
                    //     title: "Save",
                    //     disabled: "!modified"
                    //   },
                    //   this.resource.add_button || {
                    //     type: "button",
                    //     value: "add",
                    //     title: "Add"
                    //   },
                    //   this.resource.delete_button || {
                    //     type: "button",
                    //     value: "delete",
                    //     title: "Delete",
                    //     disabled: "!selection"
                    //   }
                    // ]
                  },
                  {
                    type: "group",
                    display: "flex",
                    container: {style: "justify-content:flex-end"},
                    children: (this.resource.footer_right_buttons || ["undo", "redo"]).map(button => {
                      return this.constructor.defaults[button];
                    })

                    // children: this.resource.footer_right_buttons || [
                    //   this.resource.undo_button || {
                    //     type: "button",
                    //     value: "undo",
                    //     dashicon: "undo",
                    //     disabled: "!undo"
                    //   },
                    //   this.resource.redo_button || {
                    //     type: "button",
                    //     value: "redo",
                    //     dashicon: "redo",
                    //     disabled: "!redo"
                    //   }
                    // ]
                  }
                ]
              }).build();
            }
          }
        }
      ]
    };
  }

  //
  // getHeader() {
  //   return this.createChild(this.resource.header || this.constructor.defaults.header);
  // }
  //
  // getModalHeader() {
  //   return this.createChild(this.resource.modalheader || this.constructor.defaults.modalheader);
  // }
  //
  // getFooter() {
  //   return this.createChild(this.resource.footer || {
  //     id: "footer",
  //     type: "group",
  //     display: "flex",
  //     children: [
  //       {
  //         type: "group",
  //         display: "flex",
  //         style: "flex-grow:1",
  //         children: (this.resource.footer_left_buttons || [
  //           "save",
  //           "add",
  //           "delete"
  //         ]).map(resource => this.parseResource(resource))
  //       },
  //       {
  //         type: "group",
  //         display: "flex",
  //         container: {style: "justify-content:flex-end"},
  //         children: (this.resource.footer_right_buttons || [
  //           "undo",
  //           "redo"
  //         ]).map(resource => this.createChild(this.parseResource(resource)).build())
  //       }
  //     ]
  //   });
  // }
  //
  // getFooterLeft() {
  //
  // }


  async getIds() {
    // const queriedIds = await this.getQueriedIds();
    const queriedIds = await this.get("queriedids");

    const ids = queriedIds.filter(id => {
      const value = this.grid.form.buffer.get(id, "trash");
      return !value || value[0] !== "1";
    });

    Object.keys(this.grid.form.buffer.get() || {}).filter(id => {
      const value = this.grid.form.buffer.get(id, "trash");
      return value && value.toString() === "0" && !ids.includes(id);
    }).reverse().forEach(id => {
      ids.splice(this.getExtraOrder(id), 0, id);
    });

    return ids;
  }

  getExtraOrder(id) {
    return this.extraOrders && this.extraOrders[id] || 0;
  }

  setExtraOrder(id, order) {
    if (!this.extraOrders) {
      this.extraOrders = {};
    }
    this.extraOrders[id] = order;
  }

  // deprecated
  getRow(id) {

    // let row = this.getChild(id);
    //
    // if (!row) {
    //   row = new KarmaFieldsAlpha.fields.tableRow({
    //     key: id,
    //     columns: this.resource.columns
    //   });
    //   this.addChild(row);
    // }
    //
    // return row;

    return this.grid.createChild({
      key: id,
      columns: this.resource.columns || []
    });
  }

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

  // reorder(column) {
  //   const orderby = this.getParam("orderby") || this.getDefaultOrderby();
  //   const order = this.getParam("order") || this.getDefaultOrder();
  //   const key = column.orderby || column.field.key;
  //
  //   if (key) {
  //     if (orderby === key) {
  //       this.setParam(order === "asc" ? "desc" : "asc", "order");
  //     } else {
  //       this.setParam(column.order || "asc", "order");
  //       this.setParam(key, "orderby");
  //     }
  //     if (super.hasParam("page") && super.getParam("page") !== "1") {
  //       this.setParam(1, "page");
  //     }
  //   }
  //
  // }


  async add(num) {

    let ids = await KarmaFieldsAlpha.Gateway.post("add/"+this.resource.driver, params);

    // compat
    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    // compat
    ids = ids.map(id => id.id || id);

    ids = ids.map(id => id.toString());

    const grid = this.getGrid();

    // const keys = this.getResourceChildKeys(this.resource);

    for (let id in ids) {

      // for (let field of this.getRow(id).getDescendants()) {
      for (let column of this.resource.column) {

        // field.createValue([]);
        // this.buffer.set([], ...field.getPath());

        if (column.field.key) {
          grid.writeHistory(null, id, column.field.key);
        }


      }

      // this.buffer.set(["1"], id, "trash");
      // this.createValue(["1"], id, "trash");
      grid.writeHistory("1", id, "trash", 0);
    }

    this.nextup("add");

    for (let id of ids) {

      // await this.write(id);

      // for (let field of this.getRow(id).getDescendants()) {
      for (let column of this.resource.column) {

        // const value = await field.getDefault();
        // await field.setValue(null, value);
        if (column.field.key) {
          const default = column.field.default || KarmaFieldsAlpha.fields[column.field.type].default || "";
          await grid.set(default, id, column.field.key, 0);
        }

      }

      // await this.grid.setValue(null, ["0"], id, "trash");
      grid.set(default, id, column.field.key, 0);

    }

    const extraIds = this.extraIdBuffer.get();
    this.extraIdBuffer.set([id, ...extraIds]);

    return ids;
  }

  async remove() {
    // let ids = await this.getSelectedIds();
    let ids = await this.get("selectedids");
    const grid = this.getGrid();

    for (let id of ids) {

      grid.writeHistory("0", id, "trash", 0);

      // for (let field of this.getRow(id).getDescendants()) {
      for (let column of this.resource.column) {

        if (column.field.key) {
          // await field.write();
          await grid.setState(null, id, key, "write");
        }

      }

    }

    this.nextup("table-delete");

    for (let id of ids) {

      // await this.grid.setValue(null, ["1"], id, "trash");
      await grid.set("1", id, "trash", 0);

      // for (let field of this.getRow(id).getDescendants()) {
      //
      //   // this.writeHistory(null, ...field.getPath());
      //   await field.removeValue();
      //
      // }
      for (let column of this.resource.column) {

        if (column.field.key) {

          await grid.remove(id, key);

        }

      }

    }

    const extraIds = this.extraIdBuffer.get();
    this.extraIdBuffer.set(extraIds.filter(id => ids.indexOf(id) === -1));

  }

  async duplicate() {
    // let ids = await this.getSelectedIds();
    let ids = await this.get("selectedids");
    const grid = this.getGrid();

    if (ids.length) {
      const cloneIds = await this.add(ids.length);

      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let cloneId = cloneIds[i];

        // for (let field of this.getRow(id).getDescendants()) {
        //
        //   const value = await field.fetchValue();
        //   this.grid.setValue(null, value, cloneId, ...field.getPath().slice(1));
        //
        // }

        for (let column of this.resource.column) {

          if (column.field.key) {

            const value = await grid.get(id, column.field.key);
            await grid.set(value, id, column.field.key);

          }

        }

        // const contentIds = await this.get("ids");
        // let index = contentIds.indexOf(ids[ids.length-1]);
        //
        // this.setExtraOrder(cloneId, index+1);

        const extraIds = this.extraIdBuffer.get();
        this.extraIdBuffer.set([id, ...extraIds]);

      }

    }
  }


  // // override setValue
  // setValue(deprec, value, ...path) {
  //
  //   if (value.constructor === KarmaFieldsAlpha.PastedString && this.parent) {
  //
  //     const data = value[0].split(/[\r\n]/).map(row => row.split("\t"));
  //
  //     const field = this.grid.getChild(...path);
  //     // const point = KarmaFieldsAlpha.Selection.fields.find(field);
  //     const point = {
  //       x: this.grid.colMap(field),
  //       y: this.grid.rowMap(field),
  //     };
  //
  //     this.grid.importSelection(data, point);
  //
  //   } else {
  //
  //     super.setValue(null, value, ...path);
  //
  //   }
  //
  // }


  // async getSelectedIds() {
  //   if (this.hasParam("id")) {
  //     return [this.getParam("id")];
  //   } else if (this.grid.selection && this.grid.selection.width === this.grid.grid.width) {
  //     const ids = await this.getIds();
  //     return ids.slice(this.grid.selection.y, this.grid.selection.y + this.grid.selection.height);
  //   }
  //   return [];
  // }


  // async importSelection(data, selection) {
  //
  //
  //   const r = new KarmaFieldsAlpha.Rect();
  //
  //   const {x, y, width, height} = {...r, ...selection};
  //
  //   let ids = await this.getIds();
  //
  //   // for (let j = 0; j < Math.max(height, data.length); j++) {
  //   //   const rowField = this.getChild(ids[j+y]);
  //   //   if (rowField) {
  //   //     for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
  //   //       const cellField = rowField.children[i+x];
  //   //       if (cellField) {
  //   //         await cellField.write();
  //   //       }
  //   //     }
  //   //   }
  //   // }
  //   //
  //   // if (data.length > ids.length-y) {
  //   //   await this.add(data.length-(ids.length-y), false); // -> will backup
  //   //   ids = await this.getIds();
  //   // } else {
  //   //   KarmaFieldsAlpha.History.backup();
  //   //   KarmaFieldsAlpha.History.id = null;
  //   // }
  //
  //
  //
  //
  //   // if (KarmaFieldsAlpha.History.id !== selection) {
  //   //
  //   //   KarmaFieldsAlpha.History.id = selection;
  //
  //     for (let j = 0; j < Math.max(height, data.length); j++) {
  //       const rowField = this.grid.getChild(ids[j+y]);
  //       if (rowField) {
  //         for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
  //           const cellField = rowField.children[i+x];
  //           if (cellField) {
  //             await cellField.write();
  //           }
  //         }
  //       }
  //     }
  //
  //     this.nextup(selection);
  //
  //   //   KarmaFieldsAlpha.History.backup();
  //   //
  //   // }
  //
  //   for (let j = 0; j < Math.max(height, data.length); j++) {
  //     const rowField = this.grid.getChild(ids[j+y]);
  //     if (rowField) {
  //       for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
  //         const cellField = rowField.children[i+x];
  //         if (cellField) {
  //           const value = data[j%data.length][i%data[j%data.length].length];
  //
  //           // console.log(value, cellField.getPath(), i, x);
  //           await cellField.importValue(value);
  //           await cellField.render();
  //         }
  //       }
  //     }
  //
  //   }
  //
  // }

  getGrid() {
    return this.createChild({
      ...this.resource.grid,
      driver: this.resource.driver,
      columns: this.resource.columns,
      type: "tableGrid",
      id: "grid",
      key: "content"
    });
  }

  getOptions() {
    return this.createChild({
      type: "button",
      title: "Options",
      id: "options",
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
            options: this.resource.columns.map((column, index) => {
              return {
                key: index.toString(),
                name: column.title
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
                action: "edit-options",
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


}


KarmaFieldsAlpha.fields.table.defaults = {
  title: {
    type: "text",
    tag: "h1",
    style: "flex-grow:1",
    class: "ellipsis",
    value: "Table"
  },
  count: {
    type: "text",
    style: "justify-content:center",
    value: "{{count}} elements"
  },
  options: {
    type: "button",
    title: "Options",
    action: "toggle-options"
  },
  firstpage: {
    type: "button",
    action: "firstpage",
    title: "First Page",
    text: "«",
    disabled: "page=1",
    hidden: "numpage=1"
  },
  prevpage: {
    type: "button",
    action: "prevpage",
    title: "Previous Page",
    text: "‹",
    disabled: "page=1",
    hidden: "numpage=1"
  },
  currentpage: {
    type: "text",
    style: "justify-content:center",
    value: "{{page}} / {{numpage}}",
    hidden: "singlepage"
  },
  nextpage: {
    type: "button",
    action: "nextpage",
    title: "Next Page",
    text: "›",
    disabled: "lastpage",
    hidden: "numpage=1"
  },
  lastpage: {
    type: "button",
    action: "lastpage",
    title: "Last Page",
    text: "»",
    disabled: "lastpage",
    hidden: "numpage=1"
  },
  close: {
    type: "button",
    text: "×",
    title: "Close Table",
    action: "close"
  },
  prev: {
    type: "button",
    action: "prev",
    title: "Previous Item",
    text: "‹"
  },
  next: {
    type: "button",
    action: "next",
    title: "Next Item",
    text: "›"
  },
  closemodal: {
    type: "button",
    title: "Close Modal",
    action: "closemodal"
  },
  save: {
    type: "button",
    action: "save",
    title: "Save",
    disabled: "!modified"
  },
  add: {
    type: "button",
    action: "add",
    title: "Add"
  },
  delete: {
    type: "button",
    action: "delete",
    title: "Delete",
    disabled: "!selection"
  },
  undo: {
    type: "button",
    value: "undo",
    dashicon: "undo",
    disabled: "!undo"
  },
  redo: {
    type: "button",
    value: "redo",
    dashicon: "redo",
    disabled: "!redo"
  }
}
