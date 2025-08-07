

KarmaFieldsAlpha.field.table = class extends KarmaFieldsAlpha.field.form {

  constructor(resource, id, parent) {



    if (resource.table) {

      resource = {...KarmaFieldsAlpha.tables[resource.table], ...resource};

    }

    super(resource, id, parent);

    this.server = this.createServer();

  }

  // async getParams() {
  //
  //   const response = new KarmaFieldsAlpha.Content({});
  //
  //   const defaultsParams = await this.parse(this.resource.params || this.resource.body && this.resource.body.params); // compat
  //   const defaultsFieldsParams = await this.exportDefaults();
  //   const stateParams = await this.getState("params");
  //
  //   if (defaultsParams.loading && defaultsFieldsParams.loading) {
  //
  //     response.loading = true;
  //
  //   } else {
  //
  //     response.value = {...defaultsParams.toObject(), ...defaultsFieldsParams.toObject(), ...stateParams};
  //
  //   }
  //   //
  //   //
  //   //
  //   // let params = super.getParams();
  //   //
  //   // if (!params.loading) {
  //   //
  //   //   const response = this.exportDefaults();
  //   //
  //   //   if (response.loading) {
  //   //
  //   //     params.loading = true;
  //   //
  //   //   } else {
  //   //
  //   //     params.value = {...params.toObject(), ...response.toObject()}
  //   //
  //   //   }
  //   //
  //   // }
  //
  //   return response;
  // }

  async exportDefaults() {

    const response = new KarmaFieldsAlpha.Content();

    const defaultsParams = await this.parseObject(this.resource.params || this.resource.body && this.resource.body.params || {}); // compat
    const defaultsFieldsParams = await super.exportDefaults();

    if (defaultsParams.loading || defaultsFieldsParams.loading) {

      response.loading = true;

    } else {

      response.value = {...defaultsParams.toObject(), ...defaultsFieldsParams.toObject()};
    }

    return response;
  }

  async getParams() {

    const params = await this.exportDefaults();

    if (!params.loading) {

      const results = await KarmaFieldsAlpha.Database.States.select("params", "", this.uid);

      for (let item of results) {

        params.value[item.key] = item.data;

      }

    }

    return params;

  }

  async setParams(value) {

    for (let key in value) {

      await this.setParam(value[key], key);

    }

  }

  async getParam(key) {

    // const response = new KarmaFieldsAlpha.Content();
    //
    // const params = await this.getParams();
    //
    // if (params.loading) {
    //
    //   response.loading = true;
    //
    // } else {
    //
    //   response.value = response.toObject()[key];
    //
    // }
    //
    // return response;

    const response = new KarmaFieldsAlpha.Content();

    const value = await KarmaFieldsAlpha.Database.States.get("params", "", this.uid, key);

    if (value || value === "") {

      response.value = value;

    } else {

      const defaults = await this.exportDefaults();

      if (defaults.loading) {

        response.loading = true;

      } else {

        response.value = defaults.toObject()[key];

      }

    }

    return response;
  }

  setParam(value, key) {

    return KarmaFieldsAlpha.Database.States.set(value, "params", "", this.uid, key);

  }

  getContent(key) {

    return this.getParam(key);

  }

  async setValue(value, key) {

    const current = await this.getParam(key);

    if (!current.loading) {

      const content = new KarmaFieldsAlpha.Content(value);

      await this.setParam(content.toString(), key);

      await KarmaFieldsAlpha.History.write(content.toString(), current.toString(), "params", "", this.uid, key);

    }

  }



  //
  //
  //
  //
  // async getShuttle() {
  //
  //   console.error("deprecated");
  //
  //   if (!this.shuttle) {
  //
  //     let params = await this.getParams();
  //
  //
  //     if (!params.loading) {
  //
  //       // params = {
  //       //   ...params.toObject(),
  //       //   ...this.getState("params")
  //       // };
  //
  //       const driver = this.getDriver();
  //
  //       if (!driver) {
  //
  //         console.error("Driver not set", this.resource);
  //
  //       }
  //
  //       const paramstring = await KarmaFieldsAlpha.Params.stringify(params.toObject());
  //
  //       let shuttle = await KarmaFieldsAlpha.Store.get("shuttles", driver, paramstring);
  //
  //       if (!shuttle) {
  //
  //         shuttle = new KarmaFieldsAlpha.Shuttle(driver, paramstring);
  //
  //         const {page, ppp, order, orderby, ...filters} = params.toObject();
  //         shuttle.page = page;
  //         shuttle.ppp = ppp;
  //         shuttle.order = order;
  //         shuttle.orderby = orderby;
  //         shuttle.filters = filters;
  //         shuttle.params = params.toObject();
  //
  //         shuttle.from = "table";
  //
  //         shuttle.useCache = this.resource.cache || false;
  //
  //         KarmaFieldsAlpha.Store.set(shuttle, "shuttles", driver, paramstring);
  //
  //       }
  //
  //       this.shuttle = shuttle;
  //
  //     }
  //
  //   }
  //
  //   return this.shuttle;
  // }
  //
  // async getFilters() {
  //
  //   console.error("deprecated");
  //
  //   const shuttle = await this.getShuttle();
  //   const filters = new KarmaFieldsAlpha.Content();
  //
  //   if (shuttle) {
  //
  //     filters.value = shuttle.filters;
  //
  //   } else {
  //
  //     filters.loading = true;
  //
  //   }
  //
  //   return filters;
  // }

  getBody() {

		const constructor = this.getConstructor(this.resource.body && this.resource.body.type || "grid");

		return new constructor(this.resource.body, "body", this);

	}

  // *buildBody() {
  //
	// 	const body = this.getBody();
  //
	// 	yield {
  //     class: "table-body",
  //     child: body.build()
  //   };
  //
	// }

  // newChild(id) {
  //
  //   if  (id === "header") {
  //
  //     if (this.resource.header && this.resource.header.type === "header") {
  //
  //       return new KarmaFieldsAlpha.field.table.header(this.resource.header, "header", this);
  //
  //     } else {
  //
  //       return new KarmaFieldsAlpha.field.group(this.resource.header, "header", this);
  //
  //     }
  //
  //   } else if (id === "footer") {
  //
  //     return new KarmaFieldsAlpha.field.table.footer(this.resource.footer, "footer", this);
  //
  //   } else if (id === "body" && this.resource.body) {
  //
  //     return new KarmaFieldsAlpha.field[this.resource.body.type]({
  //       sortable: this.resource.sortable,
  //       ...this.resource.body
  //     }, "body", this);
  //
  //   }
  //
  // }

  // getChild(index, ...path) {
  //
  //   let child = this.newChild(index);
  //
  //   if (child && path.length) {
  //
  //     return child.getChild(...path);
  //
  //   }
  //
  //   return child;
  //
  // }

  // *buildParts() {
  //
  //   if (this.resource.header) {
  //
  //     yield {
  //       class: "karma-header table-header table-main-header simple-buttons",
  //       child: this.getChild("header").build()
  //     };
  //
  //   }
  //
  //   yield {
  //     class: "table-body",
  //     child: this.getChild("body").build()
  //   };
  //
  //   if (this.resource.footer) {
  //
  //     yield {
  //       class: "table-footer table-control",
  //       child: this.getChild("footer").build(),
  //       update: footer => {
  //         const isLoading = this.request("hasTask");
  //         footer.element.classList.toggle("loading", Boolean(isLoading));
  //       }
  //     };
  //
  //   }
  //
  // }
  //
  //
  //
  // build() {
  //
  //   return {
  //     class: "table-field",
  //     children: [
  //       {
  //         class: "mixed-content",
  //         init: node => {
  //           node.element.innerHTML = "[mixed content]";
  //         },
  //         update: node => {
  //           node.element.classList.toggle("hidden", !this.getContent().mixed);
  //         }
  //       },
  //       {
  //         class: "karma-field-table",
  //         init: node => {
  //           node.element.style.width = this.resource.width || "100%";
  //         },
  //         update: node => {
  //           node.element.classList.toggle("hidden", Boolean(this.getLength().mixed));
  //           node.element.classList.toggle("has-selection", Boolean(this.hasFocusInside()));
  //
  //           node.element.onmousedown = event => {
  //             event.stopPropagation();
  //             const body = this.getChild("body");
  //             if (body) {
  //               body.setFocus(true);
  //               if (body.select) body.select(0, 0); // !!
  //               this.render();
  //             }
  //           }
  //         },
  //         children: [
  //           ...this.buildParts()
  //         ]
  //       }
  //     ]
  //   };
  //
  // }

  async createServer() {

    const driver = this.getDriver();
    const server = new KarmaFieldsAlpha.Server(driver);

    const params = await this.getParams();

    if (params.loading) {

      server.loading = true;

    } else {

      await server.query(params.toObject());

    }

    return server;
  }



  // async load() {
  //
  //   const model = new KarmaFieldsAlpha.Content();
  //   const driver = this.getDriver();
  //   const params = await this.getParams();
  //
  //   if (params.loading) {
  //
  //     model.loading = true;
  //
  //   } else {
  //
  //     const paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());
  //     const queriedIds = await KarmaFieldsAlpha.Database.Queries.get(driver, paramstring, "queriedIds");
  //
  //     if (!queriedIds) {
  //
  //       model.loading = true;
  //
  //       const running = await KarmaFieldsAlpha.Database.Queries.set(true, driver, paramstring, "lock");
  //
  //       if (!running) {
  //
  //         const work = this.fetch(driver, paramstring, true);
  //         KarmaFieldsAlpha.Jobs.add(work);
  //
  //         await KarmaFieldsAlpha.Database.Queries.set(true, driver, paramstring, "lock");
  //
  //       }
  //
  //     } else {
  //
  //       model.ids = await KarmaFieldsAlpha.Database.States.get("queries", driver, paramstring, "ids") || queriedIds;
  //       model.params = params.toObject();
  //       model.paramstring = paramstring;
  //       model.driver = driver;
  //
  //     }
  //
  //   }
  //
  //   return model;
  // }

  async getValueById(id, key) {

    if (key === "id") {

      return new KarmaFieldsAlpha.Content(id);

    } else {

      const server = await this.server;

      if (server.loading) {

        const value = new KarmaFieldsAlpha.Content();
        value.loading = true;
        return value;

      } else {

        return server.getValue(id, key);

      }

    }

  }

  async setValueById(value, id, key) {

    const server = await this.server;

    if (!server.loading) {

      await server.setValue(value, id, key);

    }

  }


  async getIds() {

    const response = new KarmaFieldsAlpha.Content();

    const server = await this.server;

    if (server.loading) {

      response.loading = true;

    } else {

      response.value = server.ids;

    }

    return response;

  }

  // getSet() {
  //
  //   // deprecated
  //
  //   return this.getIds();
  //
  // }






  async getLength() {

    const response = new KarmaFieldsAlpha.Content();

    const server = await this.server;

    if (server.loading) {

      response.loading = true;

    } else {

      response.value = server.ids.length;

    }

    return response;
  }

  async getContentRange(index, length, key) {

    const content = new KarmaFieldsAlpha.Content();

    const ids = await this.getIds();

    if (ids.loading) {

      content.loading = true;

    } else {

      const values = await Promise.all(ids.toArray().slice(index, index + length).map(id => this.getValueById(id, key)));

      if (values.some(value => value.loading)) {

        content.loading = true;

      } else if (values.slice(1).some(value => !value.equals(values[0]))) {

        content.mixed = true;
        content.value = values.map(value => value.toArray());

      } else if (values.length > 0) {

        content.value = values[0].value;

      }

    }

    return content;

  }

  async getContentAt(index, key) {

    let content = new KarmaFieldsAlpha.Content();

    const ids = await this.getIds();

    if (ids.loading) {

      content.loading = true;

    } else {

      const id = ids.toArray()[index];

      if (id) {

        content = this.getValueById(id, key);

      }

    }

    return content;

  }

  setContentAt(content, index, key) { // deprecated (use setValueAt)

    return this.setValueAt(content.value || content, index, key);

  }

  async setValueAt(value, index, key) {

    const ids = await this.getIds();

    if (!ids.loading) {

      const id = ids.toArray()[index];

      if (id) {

        return this.setValueById(value, id, key);

      } else {

        console.error("Cannot set value. Index out of bounds!", value, index, key);

      }

    }

  }

  // async getOptionsList() {
  //
  //
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //
  //   const ids = await this.getIds();
  //
  //   if (ids.loading) {
  //
  //     content.loading = true;
  //
  //   } else {
  //
  //     const names = await Promise.all(ids.toArray().map(id => this.getValueById(id, "name")));
  //
  //     if (names.some(name => name.loading)) {
  //
  //       content.loading = true;
  //
  //     } else {
  //
  //       content.value = ids.toArray().map((id, index) => ({id, name: names[index]})));
  //
  //     }
  //
  //   }
  //
  //   return content;
  //
  // }

  // async *count(driver, paramstring) {
  //
  //   yield;
  //
  //   const total = await KarmaFieldsAlpha.HTTP.get(`count/${driver}`, paramstring) || 0;
  //
  //   await KarmaFieldsAlpha.Database.Queries.set(total, driver, paramstring, "count");
  //   await KarmaFieldsAlpha.Database.Queries.set(true, driver, paramstring, "counted");
  //   await KarmaFieldsAlpha.Database.Queries.set(false, driver, paramstring, "counting");
  //
  // }
  //
  //
  async getCount() {

    const server = await this.server;

    if (server.loading) {

      const content = new KarmaFieldsAlpha.Content();
      content.loading = true;
      return content;

    } else {

      return server.getCount();

    }

  }
  //
  // async setCount(num) {
  //
  //   const model = await this.model;
  //
  //   if (!this.loading) {
  //
  //     await KarmaFieldsAlpha.Database.States.set(num, "queries", model.driver, model.paramstring, "count");
  //
  //   }
  //
  //
  //   //
  //   // const shuttle = await this.getShuttle();
  //   //
  //   // if (shuttle) {
  //   //
  //   //   KarmaFieldsAlpha.Store.State.set(num, "count", shuttle.driver, shuttle.paramstring);
  //   //
  //   // }
  //
  // }
  //
  // async *increaseCount(num) {
  //
  //   let count = await this.getCount();
  //
  //   while (count.loading) {
  //
  //     yield;
  //     count = await this.getCount();
  //
  //   }
  //
  //   await KarmaFieldsAlpha.Database.States.set(count.toNumber() + num, "queries", model.driver, model.paramstring, "count");
  //
  // }





  async getPage() {

    // const content = new KarmaFieldsAlpha.Content();
    //
    // content.value = this.getContent("page").toNumber() || 1;
    //
    // return content;


    // const page = await this.queryParam("page");
    //
    // page.value = page.toNumber() || 1;
    //
    // return page;

    const page = await this.getParam("page");

    const content = new KarmaFieldsAlpha.Content();

    if (page.loading) {

      content.loading = true;

    } else {

      content.value = page.toNumber() || 1;

    }

    return content;

  }

  async getPpp() {

    const response = new KarmaFieldsAlpha.Content();

    const ppp = await this.getParam("ppp");

    if (ppp.loading) {

      response.loading = true;

    } else {

      response.value = ppp.toNumber() || 100;

    }

    return response;
  }

  async getIndexOffset() {

    const page = await this.getPage();
    const ppp = await this.getPpp();

    const response = new KarmaFieldsAlpha.Content();

    if (ppp.loading || page.loading) {

      response.loading = true;

    } else {

      response.value = (page.toNumber() - 1)*ppp.toNumber();

    }

    return response;

  }

  async getNumPage() {

    const count = await this.getCount();
    const ppp = await this.getPpp();
    const response = new KarmaFieldsAlpha.Content();

    if (count.loading || ppp.loading) {

      response.loading = true;

    } else {

      response.value = Math.max(1, Math.ceil(count.toNumber()/ppp.toNumber()));

    }

    return response;
  }

  async isFirstPage() {

    const response = new KarmaFieldsAlpha.Content();

    const page = await this.getPage();

    response.value = page.toNumber() === 1;

    return response;

  }

  async isLastPage() {

    const numPage = await this.getNumPage();
    const page = await this.getPage();
    const response = new KarmaFieldsAlpha.Content();

    if (numPage.loading) {

      response.loading = true;

    } else {

      response.value = page.toNumber() === numPage.toNumber()

    }

    return response;

  }

  setPage(page) {

    return this.setValue(page, "page");

  }

  async firstPage() {

    const page = await this.getPage();

    if (page.toNumber() > 1) {

      await this.save("changePage", "Change Page");
      await this.setPage(1);

    }

  }

  async prevPage() {

    const page = await this.getPage();

    if (page.toNumber() > 1) {

      await this.save("changePage", "Change Page");
      await this.setPage(page - 1);

    }

  }

  async nextPage() {

    let page = await this.getPage();
    let numPage = await this.getNumPage();

    while (numPage.loading) {

      await this.render();
      numPage = await this.getNumPage();

    }

    if (page.toNumber() < numPage.toNumber()) {

      await this.save("changePage", "Change Page");
      await this.setPage(page.toNumber() + 1);

    }

  }

  async lastPage() {

    let page = await this.getPage();
    let numPage = await this.getNumPage();

    while (numPage.loading) {

      await this.render();
      numPage = await this.getNumPage();

    }

    if (page.toNumber() < numPage.toNumber()) {

      await this.save("changePage", "Change Page");
      await this.setPage(numPage.toNumber());

    }

  }


  // isCurrentLayer() {
  //
  //   const currentLayer = KarmaFieldsAlpha.Store.Layer.getCurrent();
  //
  //   return currentLayer && currentLayer.table === this.parent.id;
  //
  // }

  // async *add(length = 1, index = undefined, params = {}, data = undefined) {
  //
  //   let shuttle = await this.getShuttle();
  //
  //   while (!shuttle) {
  //
  //     yield;
  //     shuttle = await this.getShuttle();
  //
  //   }
  //
  //   let defaults = await this.getDefaultParams();
  //
  //   while (defaults.loading) {
  //
  //     yield;
  //     defaults = await this.getDefaultParams();
  //   }
  //
  //   params = {...shuttle.filters, ...defaults.toObject(), ...params};
  //
  //   const body = this.getChild("body");
  //
  //   if (index === undefined) {
  //
  //     index = body.getNewItemIndex();
  //
  //   }
  //
  //   await this.save("insert", "Insert");
  //
  //   const tokens = [];
  //
  //   for (let i = 0; i < length; i++) {
  //
  //     const token = await this.createToken();
  //     tokens.push(token);
  //
  //     for (let key in params) {
  //
  //       await this.setValueById(params[key], token, key);
  //
  //     }
  //
  //     if (data && data[i]) { // for when importing...
  //
  //       for (let key in data[i]) {
  //
  //         await this.setValueById(data[i][key], token, key);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   const idsContent = await this.getIds();
  //   const ids = [...idsContent.toArray()];
  //   ids.splice(index, 0, ...tokens);
  //
  //   await KarmaFieldsAlpha.Store.set(ids, "buffer", "state", "ids", shuttle.driver, shuttle.paramstring); // do not update history
  //
  //   yield* this.increaseCount(length);
  //
  //   yield* body.create(index, length);
  //
  //   await body.select(index, length);
  //
  //   const createdIds = [];
  //
  //   for (let token of tokens) {
  //
  //     yield;
  //
  //     let id = await KarmaFieldsAlpha.HTTP.post(`add/${shuttle.driver}`, params);
  //
  //     id = id.toString();
  //
  //     createdIds.push(id);
  //
  //     // replace already saved values
  //     const delta = await KarmaFieldsAlpha.Store.Delta.get("vars", "remote", shuttle.driver, token);
  //
  //     if (delta) {
  //
  //       for (let key in delta) {
  //
  //         await KarmaFieldsAlpha.Store.Delta.set(delta[key], "vars", "remote", shuttle.driver, id, key); // update history
  //
  //       }
  //
  //     }
  //
  //     await KarmaFieldsAlpha.Store.remove("buffer", "state", "delta", "vars", "remote", shuttle.driver, token); // do not update history
  //
  //     await KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", shuttle.driver, id, "trash");
  //     await KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", shuttle.driver, id, "trash");
  //
  //
  //     // replace token by id
  //     const idsContent = await this.getIds();
  //     const ids = idsContent.toArray().map(item => item === token ? id : item);
  //
  //     await KarmaFieldsAlpha.Store.State.set(ids, "ids", shuttle.driver, shuttle.paramstring); // update history
  //
  //   }
  //
  //
  //   // load newly created item
  //
  //   // const paramstring = `ids=${createdIds.join(",")}`;
  //   // const newShuttle = new KarmaFieldsAlpha.Shuttle(shuttle.driver, paramstring);
  //   //
  //   // KarmaFieldsAlpha.Store.set(newShuttle, "shuttles", shuttle.driver, paramstring);
  //   //
  //   // yield* newShuttle.mix(false, false); // no lazy, no cache
  //
  // }


  // async *add(length = 1, index = undefined, params = {}, data = undefined) {
  //
  //   let model = await this.model;
  //
  //   while (model.loading) {
  //
  //     yield;
  //     model = this.load();
  //
  //   }
  //
  //   // let defaults = await this.getDefaultParams();
  //   //
  //   // while (defaults.loading) {
  //   //
  //   //   yield;
  //   //   defaults = await this.getDefaultParams();
  //   // }
  //   //
  //   // // params = {...shuttle.filters, ...defaults.toObject(), ...params};
  //   //
  //
  //
  //   let tableDefaults = await body.getParams();
  //
  //   while (tableDefaults.loading) {
  //
  //     yield;
  //     tableDefaults = await body.getParams();
  //   }
  //
  //   const {page, ppp, order, orderby, ...filters} = tableDefaults.toObject();
  //
  //
  //   const body = this.getChild("body");
  //
  //   const gridDefaults = await body.exportDefaults();
  //
  //   while (gridDefaults.loading) {
  //
  //     yield;
  //     gridDefaults = await body.exportDefaults();
  //
  //   }
  //
  //   params = {...filters, ...gridDefaults.toObject(), ...params};
  //
  //   if (index === undefined) {
  //
  //     index = body.getNewItemIndex();
  //
  //   }
  //
  //   await this.save("insert", "Insert");
  //
  //   const tokens = [];
  //
  //   for (let i = 0; i < length; i++) {
  //
  //     const token = this.createToken();
  //     tokens.push(token);
  //
  //     const itemData = data && data[i];
  //     const itemParams = {...defaults, ...itemData};
  //
  //     for (let key in itemParams) {
  //
  //       await this.setValueById(itemParams[key], token, key);
  //
  //     }
  //
  //     // if (data && data[i]) { // for when importing...
  //     //
  //     //   for (let key in data[i]) {
  //     //
  //     //     await this.setValueById(data[i][key], token, key);
  //     //
  //     //   }
  //     //
  //     // }
  //
  //   }
  //
  //   const previousIds = await this.getIds();
  //   const ids = [...previousIds.toArray()];
  //   ids.splice(index, 0, ...tokens);
  //
  //   // await KarmaFieldsAlpha.Store.set(ids, "buffer", "state", "ids", shuttle.driver, shuttle.paramstring); // do not update history
  //
  //   await KarmaFieldsAlpha.Database.States.set(ids, "queries", model.driver, model.paramstring, "ids"); // do not update history
  //
  //   // yield* this.increaseCount(length);
  //
  //   // yield* body.create(index, length);
  //
  //   await body.select(index, length);
  //
  //   const createdIds = [];
  //
  //   for (let token of tokens) {
  //
  //     yield;
  //
  //     let id = await KarmaFieldsAlpha.HTTP.post(`add/${model.driver}`, params);
  //
  //     id = id.toString();
  //
  //     createdIds.push(id);
  //
  //     // replace already saved values
  //
  //     // const delta = await KarmaFieldsAlpha.Store.Delta.get("vars", "remote", shuttle.driver, token);
  //     const delta = await KarmaFieldsAlpha.Database.States.select("external", model.driver, token);
  //
  //     if (delta) {
  //
  //       // for (let key in delta) {
  //       //
  //       //   await KarmaFieldsAlpha.Store.Delta.set(delta[key], "vars", "remote", shuttle.driver, id, key); // update history
  //       //
  //       // }
  //
  //       KarmaFieldsAlpha.Database.States.insert(delta.map(item => {...item, id}));
  //
  //     }
  //
  //     // await KarmaFieldsAlpha.Store.remove("buffer", "state", "delta", "vars", "remote", shuttle.driver, token); // do not update history
  //     await KarmaFieldsAlpha.Database.States.remove("external", model.driver, token); // do not update history
  //
  //     // await KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", shuttle.driver, id, "trash");
  //     // await KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", shuttle.driver, id, "trash");
  //     // await KarmaFieldsAlpha.Database.States.set(["1"], "external", this.driver, id, "trash"); // needed??
  //     await KarmaFieldsAlpha.Database.States.set(["0"], "external", model.driver, id, "trash");
  //     await KarmaFieldsAlpha.History.write(["0"], ["1"], "external", model.driver, id, "trash");
  //
  //     // replace token by id
  //     ids = ids.map(item => item === token ? id : item);
  //
  //     // await KarmaFieldsAlpha.Store.State.set(ids, "ids", shuttle.driver, shuttle.paramstring); // update history
  //
  //     await KarmaFieldsAlpha.Database.States.set(ids, "queries", model.driver, model.paramstring, "ids");
  //     await KarmaFieldsAlpha.History.write(ids, previousIds.toArray(), "queries", model.driver, model.paramstring, "ids"); // update history
  //
  //
  //   }
  //
  //   let count = await this.getCount();
  //
  //   while (count.loading) {
  //
  //     count = await this.getCount();
  //
  //   }
  //
  //   await this.setCount(count.toNumber() + length);
  //
  // }


  // async *add(length = 1, index = undefined, params = {}, data = undefined) {
  //
  //   let server = await this.server;
  //
  //   while (server.loading) {
  //
  //     yield;
  //     server = await this.createServer();
  //
  //   }
  //
  //   const body = this.getChild("body");
  //
  //   if (index === undefined) {
  //
  //     index = await body.getNewItemIndex();
  //
  //   }
  //
  //   let defaults = await body.exportDefaults();
  //
  //   while (defaults.loading) {
  //
  //     yield;
  //     defaults = await body.exportDefaults();
  //   }
  //
  //   await this.save("insert", "Insert");
  //
  //   await body.select(index, length);
  //
  //   yield* server.add(length, index, {...defaults.toObject(), ...params}, data);
  //
  // }

  async add(length = 1, index = undefined, itemParams = {}, data = undefined) {

    let server = await this.server;

    while (server.loading) {

      await this.render();
      server = await this.createServer();

    }

    const body = this.getChild("body");

    if (index === undefined) {

      index = await body.getNewItemIndex();

    }

    let defaults = await body.exportDefaults();

    while (defaults.loading) {

      await this.render();
      defaults = await body.exportDefaults();
    }

    await this.save("insert", "Insert");

    await body.select(index, length);

    // yield* server.add(length, index, {...defaults.toObject(), ...params}, data);


    const {page, ppp, order, orderby, ...filters} = server.params;

    const tokens = [];

    for (let i = 0; i < length; i++) {

      const token = server.createToken();
      tokens.push(token);

      const itemData = data && data[i];
      const params = {...filters, ...defaults.toObject(), ...itemParams, ...itemData};

      for (let key in params) {

        await KarmaFieldsAlpha.Database.States.set([params[key]], "external", server.driver, token, key); // do not update history

      }

    }

    const previousIds = [...server.ids];
    let ids = [...previousIds];
    ids.splice(index, 0, ...tokens);

    await KarmaFieldsAlpha.Database.States.set(ids, "queries", server.driver, server.paramstring, "ids"); // do not update history

    for (let token of tokens) {

      await server.addItem(token);

      await this.render();

    }

    ids = await KarmaFieldsAlpha.Database.States.get("queries", server.driver, server.paramstring, "ids");

    await KarmaFieldsAlpha.History.write(ids, previousIds, "queries", server.driver, server.paramstring, "ids"); // update history

  }

  //
  //
  // createToken() {
  //
  //   let index = KarmaFieldsAlpha.field.table.tokenIndex || 0;
  //
  //   // await KarmaFieldsAlpha.Store.get("tokenIndex") || 0;
  //
  //   index++;
  //
  //   KarmaFieldsAlpha.field.table.tokenIndex = index;
  //
  //   // await KarmaFieldsAlpha.Store.set(index, "tokenIndex");
  //
  //   return `_${index}_`;
  //
  //   // return Symbol("adding");
  //
  // }
  //

  canDelete() {

    return this.hasSelection();

  }

  hasSelection() {

    if (this.resource.body) {

      const body = this.createChild(this.resource.body, "body");

      if (body && body.hasSelection) {

        return body.hasSelection();

      }

    }

    return false;

  }

  // async *delete(index, length) {
  //
  //   const body = this.getChild("body");
  //
  //   if (index === undefined || length === undefined) {
  //
  //     const selection = await body.querySelection();
  //
  //     index = selection && selection.index || 0;
  //     length = selection && selection.length || 0;
  //
  //   }
  //
  //   if (length) {
  //
  //     let shuttle = await this.getShuttle();
  //
  //     while (!shuttle) {
  //
  //       yield;
  //       shuttle = await this.getShuttle();
  //
  //     }
  //
  //     let ids = await this.getIds();
  //
  //     while (ids.loading || ids.toArray().some(id => typeof id === "symbol")) {
  //
  //       yield;
  //       ids = await this.getIds();
  //
  //     }
  //
  //     await this.save("delete", "Delete");
  //
  //     const newIds = [...ids.toArray()];
  //
  //     const removedIds = newIds.splice(index, length);
  //
  //     for (let id of removedIds) {
  //
  //       await KarmaFieldsAlpha.Store.set(["0"], "vars", "remote", shuttle.driver, id, "trash");
  //       await KarmaFieldsAlpha.Store.Delta.set(["1"], "vars", "remote", shuttle.driver, id, "trash");
  //
  //     }
  //
  //     await KarmaFieldsAlpha.Store.State.set(newIds, "ids", shuttle.driver, shuttle.paramstring);
  //
  //     await body.select(0, 0);
  //
  //     yield* this.increaseCount(-length);
  //
  //   }
  //
  // }

  // async *delete(index, length) {
  //
  //   const body = this.getChild("body");
  //
  //   if (index === undefined || length === undefined) {
  //
  //     const selection = await body.querySelection();
  //
  //     index = selection && selection.index || 0;
  //     length = selection && selection.length || 0;
  //
  //   }
  //
  //   if (length) {
  //
  //     let model = await this.model;
  //
  //     while (model.loading) {
  //
  //       yield;
  //       model = await this.load();
  //
  //     }
  //
  //     let previousIds = await model.getIds();
  //
  //     await this.save("delete", "Delete");
  //
  //     const newIds = [...previousIds.toArray()];
  //
  //     const removedIds = newIds.splice(index, length);
  //
  //     for (let id of removedIds) {
  //
  //       // await KarmaFieldsAlpha.Store.set(["0"], "vars", "remote", shuttle.driver, id, "trash");
  //       // await KarmaFieldsAlpha.Store.Delta.set(["1"], "vars", "remote", shuttle.driver, id, "trash");
  //
  //       await KarmaFieldsAlpha.Database.States.set(["1"], "external", model.driver, model.paramstring, "trash");
  //       await KarmaFieldsAlpha.History.write(["1"], ["0"], "external", model.driver, model.paramstring, "trash");
  //
  //     }
  //
  //     // await KarmaFieldsAlpha.Store.State.set(newIds, "ids", shuttle.driver, shuttle.paramstring);
  //
  //     await KarmaFieldsAlpha.Database.States.set(newIds, "queries", model.driver, model.paramstring, "ids");
  //     await KarmaFieldsAlpha.History.write(newIds, previousIds.toArray(), "queries", model.driver, model.paramstring, "ids");
  //
  //
  //
  //     await body.select(0, 0);
  //
  //     yield* this.increaseCount(-length);
  //
  //     let count = await this.getCount();
  //
  //     while (count.loading) {
  //
  //       count = await this.getCount();
  //
  //     }
  //
  //     await this.setCount(count.toNumber() - length);
  //
  //   }
  //
  // }

  async delete(index, length) {

    let server = await this.server;

    while (server.loading) {

      await this.render();
      server = await this.createServer();

    }

    const body = this.getChild("body");

    if (index === undefined || length === undefined) {

      const selection = await body.querySelection();

      index = selection && selection.index || 0;
      length = selection && selection.length || 0;

    }

    await this.save("delete", "Delete");

    await body.select(0, 0);

    // yield* server.delete(index, length);

    let previousIds = server.ids;

    // await this.save("delete", "Delete");

    const newIds = [...previousIds];

    const removedIds = newIds.splice(index, length);

    for (let id of removedIds) {

      await KarmaFieldsAlpha.Database.States.set(["1"], "external", server.driver, id, "trash");
      await KarmaFieldsAlpha.History.write(["1"], ["0"], "external", server.driver, id, "trash");

    }

    await KarmaFieldsAlpha.Database.States.set(newIds, "queries", server.driver, server.paramstring, "ids");
    await KarmaFieldsAlpha.History.write(newIds, previousIds, "queries", server.driver, server.paramstring, "ids");

  }


  async duplicate() {

    const body = this.getChild("body");
    const selection = await body.querySelection();

    index = selection && selection.index || 0;
    length = selection && selection.length || 0;

    if (length) {

      await this.save("duplicate", "Duplicate");

      let grid = await body.export(index, length);

      while(grid.loading) {

        await this.render();
        grid = await body.export(index, length);

      }

      await body.import(grid, index + length, length);

      await this.select(index + length, length);

    }

  }

  isRowSelected() { // compat

    return this.hasSelection();

  }

  async getSelectedIds() {

    const response = new KarmaFieldsAlpha.Content();

    const ids = await this.getIds();

    if (ids.loading) {

      response.loading = true;

    } else {

      const body = this.getChild("body");
      const selection = await body.querySelection();

      if (selection) {

        const index = selection.index || 0;
        const length = selection.length || 0;

        response.value = ids.toArray().slice(index, index + length);

      }

    }

    return response;
  }

  // withdraw() {
  //
  //   // const content = this.querySelectedItems();
  //
  //   // if (!content.loading) {
  //   //
  //   //   const items = content.toArray();
  //   //   const ids = items.filter(item => item.id && !item.loading).map(item => item.id);
  //
  //     const ids = this.getSelectedIds();
  //
  //     this.save("withdraw", "Insert");
  //
  //     // KarmaFieldsAlpha.Store.Layer.close();
  //     this.request("close");
  //
  //     if (ids.length) {
  //
  //       // this.request("dispatch", "insert", ids);
  //
  //       this.dispatch("insert", ids);
  //
  //     }
  //
  //     this.request("render");
  //
  //   // }
  //
  // }

  async selectByIds(selectIds) {

    let ids = await this.getIds();

    while (ids.loading) {

      await this.render();
      ids = await this.getIds();

    }

    const body = this.getChild("body");

    const index = ids.toArray().indexOf(selectIds[0]);

    if (index > -1 && body) {

      await body.select(index, selectIds.length);
      await body.setFocus(true);

    } else {

      await body.unselect();

    }


  }

  // *selectByIdsSync(selectIds) {
  //
  //   const body = this.getChild("body");
  //   // const selection = {index: 0, length: Infinity};
  //
  //   let ids = this.getIds();
  //
  //   while (ids.loading) {
  //
  //     yield;
  //     ids = this.getIds();
  //
  //   }
  //
  //   const index = ids.toArray().indexOf(selectIds[0]);
  //
  //   if (index > -1 && body) {
  //
  //     body.select(index, selectIds.length);
  //     body.setFocus(true);
  //
  //   } else {
  //
  //     body.unselect();
  //
  //   }
  //
  // }

  // async swap(index, target, length) {
  //
  //   const shuttle = await this.getShuttle();
  //   let set = await this.getIds();
  //
  //   // while (contents.some(content => content.loading)) {
  //   //
  //   //   yield;
  //   //   contents = keys.map(key => this.getContent(key));
  //   //
  //   // }
  //
  //   if (set.loading) {
  //
  //     console.log(ids);
  //     console.error("content is not loaded");
  //
  //   }
  //
  //
  //   await this.save("sort", "Sort");
  //
  //   // for (let j in contents) {
  //   //
  //   //   const content = contents[j];
  //   //   const key = keys[j];
  //   //
  //   //   const newContent = [...content.toArray()];
  //   //
  //   //   newContent.splice(target, 0, ...newContent.splice(index, length));
  //   //
  //   //   this.setValue(newContent, key);
  //   //
  //   // }
  //
  //
  //   const ids = [...set.toArray()];
  //
  //   ids.splice(target, 0, ...ids.splice(index, length));
  //
  //   await KarmaFieldsAlpha.Store.State.set(ids, "ids", shuttle.driver, shuttle.paramstring); // update history
  //
  //   for (let i = 0; i < ids.length; i++) {
  //
  //     await this.setValueAt(i, i, this.resource.sortable === true && "position" || this.resource.sortable);
  //
  //     // KarmaFieldsAlpha.Store.Delta.set([i], "vars", "remote", shuttle.driver, ids[i], this.resource.sortable || "position");
  //
  //   }
  //
  //
  //   const body = this.getChild("body");
  //
  //   if (body) {
  //
  //     await body.setFocus(true);
  //     await body.select(target, length);
  //
  //   }
  //
  // }

  async swap(index, target, length) {

    const sortableKey = this.resource.sortable === true && "position" || this.resource.sortable;

    if (!sortableKey) {

      console.error("not sortable!");

    }

    let server = await this.server;

    if (server.loading) {

      console.error("server is not loaded");

    }

    let previousIds = server.ids;

    await this.save("sort", "Sort");

    const ids = [...previousIds.toArray()];

    ids.splice(target, 0, ...ids.splice(index, length));

    // await KarmaFieldsAlpha.Store.State.set(ids, "ids", shuttle.driver, shuttle.paramstring); // update history

    await KarmaFieldsAlpha.Database.States.set(ids, "queries", server.driver, server.paramstring, "ids");
    await KarmaFieldsAlpha.History.write(ids, previousIds.toArray(), "queries", server.driver, server.paramstring, "ids"); // update history

    for (let i = 0; i < ids.length; i++) {

      await this.setValueAt(i, i, sortableKey);

      // KarmaFieldsAlpha.Store.Delta.set([i], "vars", "remote", shuttle.driver, ids[i], this.resource.sortable || "position");

    }


    const body = this.getChild("body");

    if (body) {

      await body.setFocus(true);
      await body.select(target, length);

    }

  }


  async drop() {

    const ids = await this.getSelectedIds();

    while (ids.loading) {

      await this.render();
      ids = await this.getSelectedIds();

    }

    if (ids.toArray().length && this.parent.insert) {

      await this.parent.insert(ids.toArray());

    }

    await this.parent.close();

  }

  canDrop() {

    return Boolean(this.parent.insert);

  }

}




KarmaFieldsAlpha.field.table.footer = class extends KarmaFieldsAlpha.field.form.footer {

  constructor(resource, id, parent) {

    super({
      display: "flex",
      children: [
        "save",
        "add",
        "delete",
        "separator",
        "insert",
        "undo",
        "redo"
      ],
      ...resource
    }, id, parent);

  }

}

KarmaFieldsAlpha.field.table.save = class extends KarmaFieldsAlpha.field.button {

  constructor(resource, id, parent) {
    super({
      // task: ["submit"],
      action: "submit",
      title: "Save",
      text: "Save",
      enabled: ["request", "hasDelta"],
      primary: true,
      ...resource
    }, id, parent);
  }

}

KarmaFieldsAlpha.field.table.add = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      // task: ["add"],
      action: "add",
      title: "Add",
      text: "Add",
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.table.delete = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      action: "delete",
      title: "Delete",
      text: "Delete",
      enabled: ["request", "hasSelection"],
      ...resource
    }, id, parent);
  }

}

KarmaFieldsAlpha.field.table.insert = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      action: "drop",
      primary: true,
      text: "Insert",
      enabled: ["request", "hasSelection"],
      // visible: ["request", "tunnel", -1, "useSocket"],
      visible: ["request", "canDrop"],
      ...resource
    }, id, parent);
  }
}
KarmaFieldsAlpha.field.table.export = class extends KarmaFieldsAlpha.field.download {
  constructor(resource, id, parent) {
    super({
      text: "Export",
      ...resource
    }, id, parent);
  }
}



KarmaFieldsAlpha.field.table.header = class extends KarmaFieldsAlpha.field.form.header {

  constructor(resource, id, parent) {

    super({
      display: "flex",
      children: [
        "title",
        "count",
        "pagination",
        "close"
      ],
      ...resource
    }, id, parent);

  }


}

// KarmaFieldsAlpha.field.title = class extends KarmaFieldsAlpha.field.text {
//
//   constructor(resource, id, parent) {
//
//     super({
//       tag: "h1",
//       style: "flex-grow:1",
//       class: "ellipsis",
//       content: "Title",
//       ...resource
//     }, id, parent);
//
//   }
//
//   getContent() {
//
//     const content = this.getResource("title");
//
//     return this.parse(content || this.resource.content);
//
//   }
//
// }

KarmaFieldsAlpha.field.table.count = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      style: "justify-content:center;white-space: nowrap;",
      value: ["replace", "# elements", "#", ["request", "getCount"]],
      ...resource
    }, id, parent);
  }
}
KarmaFieldsAlpha.field.table.close = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      dashicon: "no",
      title: "Close",
      action: "close",
      ...resource
    }, id, parent);
  }
}


KarmaFieldsAlpha.field.table.pagination = class extends KarmaFieldsAlpha.field.group {

  constructor(resource, id, parent) {

    super({
      type: "group",
      display: "flex",
      style: "flex: 0 1 auto;min-width:0",
      hidden: ["=", ["request", "getNumPage"], 1],
      children: [
        "firstpage",
        "prevpage",
        "currentpage",
        "nextpage",
        "lastpage"
      ],
      ...resource
    }, id, parent);
  }

}

KarmaFieldsAlpha.field.table.pagination.firstpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      // task: ["set", 1, "page"],
      // request: ["firstPage"],
      action: "firstPage",
      title: "First Page",
      text: "«",
      disabled: ["==", ["request", "getPage"], 1],
      ...resource
    }, id, parent);
  }
}
KarmaFieldsAlpha.field.table.pagination.prevpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      // request: ["body", "prevPage"],
      // task: ["set", ["-", ["request", "getPage"], 1], "page"],
      action: "prevPage",
      title: "Previous Page",
      text: "‹",
      disabled: ["==", ["request", "getPage"], 1],
      ...resource
    }, id, parent);
  }
}
KarmaFieldsAlpha.field.table.pagination.currentpage = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      style: "font-family: monospace;", //"min-width: 4em;text-align: right;",
      value: ["replace", "#/#", "#", ["request", "getPage"], ["request", "getNumPage"]],
      ...resource
    }, id, parent);
  }
}
KarmaFieldsAlpha.field.table.pagination.nextpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      // request: ["body", "nextPage"],
      // task: ["set", ["+", ["request", "getPage"], 1], "page"],
      action: "nextPage",
      title: "Next Page",
      text: "›",
      // disabled: ["==", ["request", "body", "getPage"], ["request", "body", "getNumPage"]],
      disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]],
      ...resource
    }, id, parent);
  }
}
KarmaFieldsAlpha.field.table.pagination.lastpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      // request: ["body", "lastPage"],
      // task: ["set", ["request", "getNumPage"], "page"],
      action: "lastPage",
      title: "Last Page",
      text: "»",
      disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]],
      ...resource
    }, id, parent);
  }
}





// compat

KarmaFieldsAlpha.field.gridField = class extends KarmaFieldsAlpha.field.table {

  constructor(resource, id, parent) {

    if (!resource.body) {

      resource.body = {
        type: "grid",
        children: resource.children
      };

    }

    super(resource, id, parent);

  }

}
