

KarmaFieldsAlpha.field.table = class extends KarmaFieldsAlpha.field.form {

  constructor(resource, id, parent) {

    if (resource.table) {

      resource = {...KarmaFieldsAlpha.tables[resource.table], ...resource};

    }

    super(resource, id, parent);

    // this.loading = true;

  }

  // async abduct() {
  //
  //   console.log(this.element.parentNode, this.element);
  //
  //   await KarmaFieldsAlpha.build(this.build(), this.element.parentNode, this.element);
  //
  // }
  //
  // async render() {
  //
  //
  //
  //   if (this.element) {
  //
  //     console.log("local render");
  //     console.log(this.element.parentNode, this.element);
  //
  //     await KarmaFieldsAlpha.server.init();
  //
  //     await this.abduct();
  //
  //     while (KarmaFieldsAlpha.server.hasOrder()) {
  //
  //       await KarmaFieldsAlpha.server.process();
  //
  //       await this.abduct();
  //
  //     }
  //
  //   } else {
  //
  //     await this.parent.render();
  //
  //   }
  //
  // }





  exportDefaults() {

    const response = new KarmaFieldsAlpha.Content();

    const defaultsParams = this.parseObject(this.resource.params || this.resource.body && this.resource.body.params || {}); // compat
    const defaultsFieldsParams = super.exportDefaults();

    if (defaultsParams.loading || defaultsFieldsParams.loading) {

      response.loading = true;

    } else {

      response.value = {...defaultsParams.toObject(), ...defaultsFieldsParams.toObject()};
    }

    return response;
  }

  // prepare() {
  //
  //   // const params = this.getParams();
  //   //
  //   // if (!params.loading) {
  //   //
  //   //   this.driver = this.getDriver();
  //   //   this.params = params.toObject();
  //   //   this.paramstring = KarmaFieldsAlpha.Params.stringify(params.toObject());
  //   //   this.loading = false;
  //   //
  //   // }
  //
  //   if (this.loading) {
  //
  //     const defaults = this.exportDefaults();
  //
  //     if (!defaults.loading) {
  //
  //       this.driver = this.getDriver();
  //       this.params = {...defaults.toObject(), ...this.getState("params")};
  //       this.paramstring = KarmaFieldsAlpha.Params.stringify(this.params);
  //       this.loading = false;
  //
  //     }
  //
  //   }
  //
  // }

  queryParams() {

    let params = this.params;

    if (!params) {

      params = new KarmaFieldsAlpha.Content();

      const defaults = this.exportDefaults();

      if (defaults.loading) {

        params.loading = true;

      } else {

        params.value = {...defaults.toObject(), ...this.getState("params")};
        params.string = KarmaFieldsAlpha.Params.stringify(params.value);

        this.params = params;

      }

    }

    return params;

  }

  // queryParamstring() {
  //
  //   const params = this.queryParams();
  //
  //   if (!this.paramstring) {
  //
  //     if (params.loading) {
  //
  //       return new KarmaFieldsAlpha.Loading();
  //
  //     } else {
  //
  //       this.paramstring = KarmaFieldsAlpha.Params.stringify(this.params);
  //
  //     }
  //
  //   }
  //
  //   return new KarmaFieldsAlpha.Content(this.paramstring);
  //
  // }

  getIds(driver, paramstring) {

    // if (!paramstring) {
    //
    //   this.prepare();
    //
    //   if (this.loading) {
    //
    //     return new KarmaFieldsAlpha.Loading();
    //
    //   } else {
    //
    //     paramstring = this.paramstring;
    //
    //   }
    //
    // }

    if (!driver) {

      driver = this.getDriver();

    }

    if (paramstring === undefined) {

      const params = this.queryParams();

      if (params.loading) {

        return new KarmaFieldsAlpha.Loading();

      } else {

        paramstring = params.string;

      }

    }

    return KarmaFieldsAlpha.server.queryIds(driver, paramstring);



    // if (this.loading) {
    //
    //   return new KarmaFieldsAlpha.Loading();
    //
    // } else {
    //
    //   return KarmaFieldsAlpha.server.queryIds(driver || this.driver, paramstring ?? this.paramstring);
    //
    // }

  }

  getParams() {

    return this.queryParams().toObject();

  }

  async setParams(params) {

    delete this.params;

    // return KarmaFieldsAlpha.server.setState(params, "fields", this.uid, "params");

    await this.setState(params, "params");

  }

  getParam(key) {

    return this.getParams()[key];

  }

  async setParam(value, key) {

    await this.setParams({...this.getParams(), [key]: value});

  }

  getContent(key) {

    // const response = new KarmaFieldsAlpha.Content();
    //
    // if (this.loading) {
    //
    //   response.loading = true;
    //
    // } else {
    //
    //   response.value = this.getParam(key);
    // }
    //
    // return response;

    const params = this.queryParams();

    const response = new KarmaFieldsAlpha.Content();

    if (params.loading) {

      response.loading = true;

    } else {

      response.value = params.toObject()[key];
    }

    return response;

  }

  setValue(value, key) {

    return this.setParam(value, key);

  }


  getBody() {

		// const constructor = this.getConstructor(this.resource.body && this.resource.body.type || "grid");
    // 
		// return new constructor(this.resource.body, "body", this);

    return this.createChild({
      type: "grid",
			children: this.resource.children, // compat
			...this.resource.body
		}, "body");

	}


  // getValueById(id, key) {
  //
  //   if (this.loading) {
  //
  //     return new KarmaFieldsAlpha.Loading();
  //
  //   } else if (key === "id") {
  //
  //     return new KarmaFieldsAlpha.Content(id);
  //
  //   } else {
  //
  //     return this.server.queryValue(this.driver, id, key);
  //
  //   }
  //
  // }
  //
  // async setValueById(value, id, key) {
  //
  //   if (!this.loading) {
  //
  //     this.server.setValue(this.driver, id, key)
  //
  //   }
  //
  // }

  getLength() {

    return this.getIds().toArray().length;

  }

  queryLength() {

    const response = new KarmaFieldsAlpha.Content();

    const ids = this.getIds();

    if (ids.loading) {

      response.loading = true;

    } else {

      response.value = ids.toArray().length;

    }

    return response;
  }

  getContentRange(index, length, key, paramstring, driver) {

    if (paramstring === undefined) {

      const params = this.queryParams();

      if (params.loading) {

        return new KarmaFieldsAlpha.Loading();

      } else {

        paramstring = params.string;

      }

    }

    if (!driver) {

      driver = this.getDriver();

    }

    const response = new KarmaFieldsAlpha.Content();


    const values = [];

    for (let i = 0; i < length; i++) {

      const value = KarmaFieldsAlpha.server.queryValueAt(driver, paramstring, index + i, key);

      values.push(value);

    }

    if (values.some(value => value.loading)) {

      response.loading = true;

    } else if (values.slice(1).some(value => !value.equals(values[0]))) {

      response.mixed = true;
      response.value = values.map(value => value.toArray());

    } else if (values.length > 0) {

      response.value = values[0].value;

    }

    return response;

  }

  getContentAt(index, key, paramstring, driver) {

    if (paramstring === undefined) {

      const params = this.queryParams();

      if (params.loading) {

        return new KarmaFieldsAlpha.Loading();

      } else {

        paramstring = params.string;

      }

    }

    if (!driver) {

      driver = this.getDriver();

    }

    return KarmaFieldsAlpha.server.queryValueAt(driver, paramstring, index, key);

  }

  setValueAt(value, index, key, driver, paramstring) {

    if (paramstring === undefined) {

      const params = this.queryParams();

      if (params.loading) {

        return;

      } else {

        paramstring = params.string;

      }

    }

    if (!driver) {

      driver = this.getDriver();

    }

    return KarmaFieldsAlpha.server.setValueAt(value, driver, paramstring, index, key);

  }


  getOptionsList(driver, paramstring, keys = ["name"]) {



    const response = new KarmaFieldsAlpha.Content();

    // const ids = KarmaFieldsAlpha.server.queryIds(driver || this.driver, paramstring ?? this.paramstring);

    const query = this.getIds(driver, paramstring);

    if (query.loading) {

      response.loading = true;

    } else {

      response.value = [];

      const ids = query.toArray();

      for (let i = 0; i < ids.length; i++) {

        const id = ids[i];
        const item = {id};

        for (let key of keys) {

          // const content = this.server.getValueAt(driver || this.driver, paramstring ?? this.paramstring, i, key);
          const content = this.getContentAt(i, key, paramstring, driver);

          if (content.loading) {

            response.loading = true;
            break;

          } else {

            item[key] = content.toString();

          }

        }

        response.value.push(item);

      }

    }

    return response;

  }

  // getOptionsList(driver, paramstring, keys = ["name"]) {
  //
  //   const options = [];
  //
  //   const ids = this.getIds(driver, paramstring);
  //
  //   for (let i = 0; i < ids.toArray().length; i++) {
  //
  //     const id = ids[i];
  //     const item = {id};
  //
  //     for (let key of keys) {
  //
  //       const content = this.server.getValueAt(driver || this.driver, paramstring ?? this.paramstring, i, key);
  //
  //       item[key] = content.toString();
  //
  //     }
  //
  //     options.push(item);
  //
  //   }
  //
  //   return options;
  //
  // }



  queryCount(driver, paramstring) {

    // this.prepare();
    //
    // if (this.loading) {
    //
    //   return new KarmaFieldsAlpha.Loading();
    //
    // } else {
    //
    //   return this.server.queryCount(driver || this.driver, paramstring ?? this.paramstring);
    //
    // }

    if (paramstring === undefined) {

      const params = this.queryParams();

      if (params.loading) {

        return new KarmaFieldsAlpha.Loading();

      } else {

        paramstring = params.string;

      }

    }

    if (!driver) {

      driver = this.getDriver();

    }

    return KarmaFieldsAlpha.server.queryCount(driver, paramstring);

  }

  getCount(driver, paramstring) {

    return this.queryCount().toNumber();

  }

  getPage() {

    // return this.getParam("page") || 1;
    return this.queryPage().toNumber();

  }

  queryPage() {

    // const content = new KarmaFieldsAlpha.Content();
    //
    // if (this.loading) {
    //
    //   content.loading = true;
    //
    // } else {
    //
    //   content.value = this.getPage();
    //
    // }
    //
    // return content;

    const content = new KarmaFieldsAlpha.Content();

    const params = this.queryParams();

    if (params.loading) {

      content.loading = true;

    } else {

      content.value = params.toObject().page || 1;

    }

    return content;

  }

  getPpp() {

    return this.getParam("ppp") || 100;

  }

  queryPpp() {

    const response = new KarmaFieldsAlpha.Content();

    if (ppp.loading) {

      response.loading = true;

    } else {

      response.value = this.getPpp();

    }

    return response;
  }

  getIndex() {

    const page = this.getPage();
    const ppp = this.getPpp();

    return (page - 1)*ppp;

  }

  queryNumPage() {

    const count = this.queryCount();

    const response = new KarmaFieldsAlpha.Content();

    if (count.loading) {

      response.loading = true;

    } else {

      const ppp = this.getPpp();

      response.value = Math.max(1, Math.ceil(count.toNumber()/ppp));

    }

    return response;
  }

  getNumPage() {

    const count = this.getCount();
    const ppp = this.getPpp();

    return Math.max(1, Math.ceil(count/ppp));
  }

  isFirstPage() {

    const response = new KarmaFieldsAlpha.Content();

    const page = this.queryPage();

    if (page.loading) {

      response.loading = true;

    } else {

      response.value = page.toNumber() === 1

    }

    return response;

  }

  isLastPage() {

    const numPage = this.queryNumPage();
    const page = this.queryPage();
    const response = new KarmaFieldsAlpha.Content();

    if (page.loading || numPage.loading) {

      response.loading = true;

    } else {

      response.value = page.toNumber() === numPage.toNumber();

    }

    return response;

  }

  setPage(page) {

    return this.setValue(page, "page");

  }

  async firstPage() {

    const page = this.queryPage();

    if (!page.loading && page.toNumber() !== 1) {

      await this.save("changePage", "Change Page");
      await this.setValue(1, "page");

    }

  }

  async prevPage() {

    const page = this.queryPage();

    if (!page.loading && page.toNumber() > 1) {

      await this.save("changePage", "Change Page");
      await this.setPage(page.toNumber() - 1);

    }

  }

  async nextPage() {

    let page = this.queryPage();
    let numPage = this.queryNumPage();

    if (!page.loading && !numPage.loading && page.toNumber() < numPage.toNumber()) {

      await this.save("changePage", "Change Page");
      await this.setPage(page.toNumber() + 1);

    }

  }

  async lastPage() {

    let page = this.queryPage();
    let numPage = this.queryNumPage();

    if (!page.loading && !numPage.loading && page.toNumber() < numPage.toNumber()) {

      await this.save("changePage", "Change Page");
      await this.setPage(numPage.toNumber());

    }

  }




  async add(length = 1, index = undefined, itemParams = {}, data = undefined) {

    const driver = this.getDriver();
    let params = this.queryParams();

    while (params.loading) {

      await this.render();
      params = this.queryParams();

    }

    const paramstring = params.string;

    const body = this.getChild("body");

    if (index === undefined) {

      index = body.getNewItemIndex();

    }

    let defaults = body.exportDefaults();

    while (defaults.loading) {

      await this.render();
      defaults = body.exportDefaults();

    }

    await this.save("insert", "Insert");

    await body.select(index, length);

    const {page, ppp, order, orderby, ...filters} = params.toObject();

    const gen = KarmaFieldsAlpha.server.add(driver, paramstring, index, length, {...filters, ...defaults.toObject(), ...itemParams}, data);

    for await (let result of gen) {

      await this.render();

    }

    // let result = await gen.next();
    //
    // while (!result.done) {
    //
    //   await this.render();
    //
    //   result = await gen.next();
    //
    // }

    // const tokens = [];
    //
    // for (let i = 0; i < length; i++) {
    //
    //   const token = this.createToken();
    //   tokens.push(token);
    //
    //   const itemData = data && data[i];
    //   const params = {...filters, ...defaults.toObject(), ...itemParams, ...itemData};
    //
    //   for (let key in params) {
    //
    //     await KarmaFieldsAlpha.Database.States.set([params[key]], "external", this.driver, token, key); // do not update history
    //
    //   }
    //
    // }
    //
    // const previousIds = this.getIds().toArray();
    // let ids = [...previousIds];
    // ids.splice(index, 0, ...tokens);
    //
    // await KarmaFieldsAlpha.Database.States.set(ids, "queries", this.driver, this.paramstring, "ids"); // do not update history
    //
    // for (let token of tokens) {
    //
    //   await KarmaFieldsAlpha.server.addItem(token, this.driver, this.paramstring, this.params);
    //
    //   await this.render();
    //
    // }
    //
    // ids = await KarmaFieldsAlpha.Database.States.get("queries", this.driver, this.paramstring, "ids");
    //
    // await KarmaFieldsAlpha.History.write(ids, previousIds, "queries", this.driver, this.paramstring, "ids"); // update history

  }

  canDelete() {

    return this.hasSelection();

  }

  hasSelection() {

    const body = this.getChild("body");

    if (body && body.hasSelection) {

      return body.hasSelection();

    }

    return false;

  }

  async delete(index, length) {

    // this.prepare();
    //
    // while (this.loading) {
    //
    //   await this.render();
    //   this.prepare();
    //
    // }

    const driver = this.getDriver();
    let params = this.queryParams();

    while (params.loading) {

      await this.render();
      params = this.queryParams();

    }

    const paramstring = params.string;

    const body = this.getChild("body");

    if (index === undefined || length === undefined) {

      const selection = body.querySelection();

      index = selection && selection.index || 0;
      length = selection && selection.length || 0;

    }

    await this.save("delete", "Delete");

    await body.select(0, 0);

    await KarmaFieldsAlpha.server.delete(driver, paramstring, index, length);

    // let ids = this.getIds();
    //
    // while (ids.loading) {
    //
    //   await this.render();
    //   ids = this.getIds();
    //
    // }
    //
    // let previousIds = ids.toArray();
    //
    // const newIds = [...previousIds];
    //
    // const removedIds = newIds.splice(index, length);
    //
    // for (let id of removedIds) {
    //
    //   await KarmaFieldsAlpha.Database.States.set(["1"], "external", this.driver, id, "trash");
    //   await KarmaFieldsAlpha.History.write(["1"], ["0"], "external", this.driver, id, "trash");
    //
    // }
    //
    // await KarmaFieldsAlpha.Database.States.set(newIds, "queries", this.driver, this.paramstring, "ids");
    // await KarmaFieldsAlpha.History.write(newIds, previousIds, "queries", this.driver, this.paramstring, "ids");
    //
    // KarmaFieldsAlpha.DeepObject.set(this.server.store, newIds, "ids", this.driver, this.paramstring);

  }


  async duplicate() {

    const body = this.getChild("body");
    const selection = body.querySelection();

    index = selection && selection.index || 0;
    length = selection && selection.length || 0;

    if (length) {

      await this.save("duplicate", "Duplicate");

      let grid = body.export(index, length);

      while (grid.loading) {

        await this.render();
        grid = body.export(index, length);

      }

      await body.import(grid, index + length, length);

      await this.select(index + length, length);

    }

  }

  isRowSelected() { // compat ??

    return this.hasSelection();

  }

  querySelectedIds() {

    const response = new KarmaFieldsAlpha.Content();

    const ids = this.getIds();

    if (ids.loading) {

      response.loading = true;

    } else {

      const body = this.getChild("body");
      const selection = body.querySelection();

      const index = selection.index || 0;
      const length = selection.length || 0;

      response.value = ids.toArray().slice(index, index + length);

    }

    return response;
  }

  getSelectedIds() {

    const ids = this.getIds();

    const body = this.getChild("body");
    const selection = body.querySelection();

    const index = selection.index || 0;
    const length = selection.length || 0;

    return ids.toArray().slice(index, index + length);

  }

  async selectByIds(selectIds) {

    let ids = this.getIds();

    while (ids.loading) {

      await this.render();
      ids = this.getIds();

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


  async swap(index, target, length) {

    const sortableKey = this.resource.sortable === true && "position" || this.resource.sortable;

    if (!sortableKey) {

      console.error("not sortable!");

    }

    const driver = this.getDriver();
    let params = this.queryParams();

    if (params.loading) {

      console.error("params not loaded!");

    }

    const paramstring = params.string;


    const queryIds = this.getIds();

    if (queryIds.loading) {

      console.error("ids are not loaded");

    }

    // to be moved in Server()

    let previousIds = queryIds.toArray();

    await this.save("sort", "Sort");

    const ids = [...previousIds.toArray()];

    ids.splice(target, 0, ...ids.splice(index, length));

    KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, ids, "ids", driver, paramstring);

    await KarmaFieldsAlpha.Database.States.set(ids, "queries", driver, paramstring, "ids");
    await KarmaFieldsAlpha.History.write(ids, previousIds.toArray(), "queries", driver, paramstring, "ids"); // update history

    for (let i = 0; i < ids.length; i++) {

      await this.setValueAt(i, i, sortableKey);

    }

    const body = this.getChild("body");

    if (body) {

      await body.setFocus(true);
      await body.select(target, length);

    }

  }


  async drop() {

    let ids = this.getSelectedIds();

    // while (ids.loading) {
    //
    //   await this.render();
    //   ids = await this.getSelectedIds();
    //
    // }

    if (ids.length && this.parent.insert) {

      await this.parent.insert(ids);

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
