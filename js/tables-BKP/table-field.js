

KarmaFieldsAlpha.field.table = class extends KarmaFieldsAlpha.field.form {

  constructor(resource, id, parent) {

    if (resource.table) {

      resource = {...KarmaFieldsAlpha.tables[resource.table], ...resource};

    }

    super(resource, id, parent);

    // this.loading = true;

  }

  queryParams() {

    console.error("deprecated");

    let params = super.queryParams();

    if (!params.loading && !params.string) {

      params.string = KarmaFieldsAlpha.Params.stringify(params.value);

    }

    return params;

  }

  getIds(driver, paramstring) {

    if (!driver) {

      driver = this.getDriver();

    }

    if (paramstring === undefined) {

      // const params = this.queryParams();
      //
      // if (params.loading) {
      //
      //   return new KarmaFieldsAlpha.Loading();
      //
      // } else {
      //
      //   paramstring = params.string;
      //
      // }

      paramstring = this.getParamstring() || "";

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

  // getParams() {
  //
  //   return this.queryParams().toObject();
  //
  // }
  //
  // async setParams(params) {
  //
  //   delete this.params;
  //
  //   // return KarmaFieldsAlpha.server.setState(params, "fields", this.uid, "params");
  //
  //   await this.setState(params, "params");
  //
  // }
  //
  // getParam(key) {
  //
  //   return this.getParams()[key];
  //
  // }
  //
  // async setParam(value, key) {
  //
  //   await this.setParams({...this.getParams(), [key]: value});
  //
  // }
  //
  // getContent(key) {
  //
  //   const params = this.queryParams();
  //
  //   const response = new KarmaFieldsAlpha.Content();
  //
  //   if (params.loading) {
  //
  //     response.loading = true;
  //
  //   } else {
  //
  //     response.value = params.toObject()[key];
  //   }
  //
  //   return response;
  //
  // }
  //
  // setValue(value, key) {
  //
  //   return this.setParam(value, key);
  //
  // }


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

      // const params = this.queryParams();
      //
      // if (params.loading) {
      //
      //   return new KarmaFieldsAlpha.Loading();
      //
      // } else {
      //
      //   paramstring = params.string;
      //
      // }

      paramstring = this.getParamstring() || "";

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

      // const params = this.queryParams();
      //
      // if (params.loading) {
      //
      //   return new KarmaFieldsAlpha.Loading();
      //
      // } else {
      //
      //   paramstring = params.string;
      //
      // }

      paramstring = this.getParamstring() || "";

    }

    if (!driver) {

      driver = this.getDriver();

    }

    return KarmaFieldsAlpha.server.queryValueAt(driver, paramstring, index, key);

  }

  setValueAt(value, index, key, driver, paramstring) {

    if (paramstring === undefined) {

      // const params = this.queryParams();
      //
      // if (params.loading) {
      //
      //   return;
      //
      // } else {
      //
      //   paramstring = params.string;
      //
      // }

      paramstring = this.getParamstring() || "";

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



  queryCount(driver, paramstring) {


    if (paramstring === undefined) {

      // const params = this.queryParams();
      //
      // if (params.loading) {
      //
      //   return new KarmaFieldsAlpha.Loading();
      //
      // } else {
      //
      //   paramstring = params.string;
      //
      // }

      paramstring = this.getParamstring() || "";

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

    const params = this.getParams() || {};

    content.value = params.page || 1;

    return content;

  }

  getPpp() {

    return this.getParam("ppp") || 100;

  }

  queryPpp() {

    const response = new KarmaFieldsAlpha.Content();

    response.value = this.getPpp();

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

    const page = this.getPage();

    response.value = page === 1;

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
      await this.render();

    }

  }

  async prevPage() {

    const page = this.queryPage();

    if (!page.loading && page.toNumber() > 1) {

      await this.save("changePage", "Change Page");
      await this.setPage(page.toNumber() - 1);
      await this.render();

    }

  }

  async nextPage() {

    let page = this.queryPage();
    let numPage = this.queryNumPage();

    if (!page.loading && !numPage.loading && page.toNumber() < numPage.toNumber()) {

      await this.save("changePage", "Change Page");
      await this.setPage(page.toNumber() + 1);
      await this.render();

    }

  }

  async lastPage() {

    let page = this.queryPage();
    let numPage = this.queryNumPage();

    if (!page.loading && !numPage.loading && page.toNumber() < numPage.toNumber()) {

      await this.save("changePage", "Change Page");
      await this.setPage(numPage.toNumber());
      await this.render();

    }

  }

  async paste(value) {

    const body = this.getBody();

    if (body) {

      await body.paste(value);

    }

  }




  async add(length = 1, index = undefined, itemParams = {}, data = undefined) {

    const driver = this.getDriver();
    // let params = this.queryParams();
    //
    // while (params.loading) {
    //
    //   await this.render();
    //   params = this.queryParams();
    //
    // }

    const params = this.getParams() || {};

    // const paramstring = params.string;
    const paramstring = this.getParamstring() || "";

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

    const {page, ppp, order, orderby, ...filters} = params;

    const gen = KarmaFieldsAlpha.server.add(driver, paramstring, index, length, {...filters, ...defaults.toObject(), ...itemParams}, data);

    for await (let result of gen) {

      await this.render();

    }

    await this.render();
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
    // let params = this.queryParams();
    //
    // while (params.loading) {
    //
    //   await this.render();
    //   params = this.queryParams();
    //
    // }
    //
    // const paramstring = params.string;

    const params = this.getParams() || {};
    const paramstring = this.getParamstring() || "";

    const body = this.getChild("body");

    if (index === undefined || length === undefined) {

      const selection = body.querySelection();

      index = selection && selection.index || 0;
      length = selection && selection.length || 0;

    }

    await this.save("delete", "Delete");

    await body.select(0, 0);

    // await KarmaFieldsAlpha.server.delete(driver, paramstring, index, length);

    for await (let result of KarmaFieldsAlpha.server.delete(driver, paramstring, index, length)) {

      await this.render(); // actually never trigger

    }

    await this.render();
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

  getAdjacentId(id, direction = 1) {

    const ids = this.getIds().toArray();

    const index = ids.indexOf(id);

    if (index > -1 && index + direction >= 0 && index + direction < ids.length) {

      return ids[index + direction];

    }

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

  getSortableKey() {

    return body.getSortableKey();

  }


  async swap(index, target, length) {

    const body = this.getChild("body");

    const sortableKey = body.resource.sortable === true && "position" || body.resource.sortable;

    if (!sortableKey) {

      console.error("not sortable!", this);

    }

    const driver = this.getDriver();
    // let params = this.queryParams();
    //
    // if (params.loading) {
    //
    //   console.error("params not loaded!");
    //
    // }
    //
    // const paramstring = params.string;

    const params = this.getParams() || {};
    const paramstring = this.getParamstring() || "";

    const queryIds = this.getIds();

    if (queryIds.loading) {

      console.error("ids are not loaded");

    }

    // to be moved in Server()
    let previousIds = queryIds.toArray();

    await this.save("sort", "Sort");

    // const ids = [...previousIds.toArray()];
    const ids = [...previousIds];

    ids.splice(target, 0, ...ids.splice(index, length));

    KarmaFieldsAlpha.DeepObject.set(KarmaFieldsAlpha.server.store, ids, "ids", driver, paramstring);

    await KarmaFieldsAlpha.Database.States.set(ids, "queries", driver, paramstring, "ids");
    await KarmaFieldsAlpha.History.write(ids, previousIds, "queries", driver, paramstring, "ids"); // update history

    let positionQueries = ids.map((id, i) => this.getContentAt(i, sortableKey));

    while (positionQueries.some(query => query.loading)) {

      await this.render();

      positionQueries = ids.map((id, i) => this.getContentAt(i, sortableKey));

    }

    for (let i = 0; i < ids.length; i++) {

      // const position = this.getContentAt(i, sortableKey);

      // console.log(i, position, sortableKey);

      const currentIndex = positionQueries[i].toNumber();

      if (currentIndex !== i) {

        await this.setValueAt(i, i, sortableKey);

      }



    }



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

// KarmaFieldsAlpha.field.table.save = class extends KarmaFieldsAlpha.field.button {
//
//   constructor(resource, id, parent) {
//     super({
//       // task: ["submit"],
//       action: "submit",
//       title: "Save",
//       text: "Save",
//       enabled: ["request", "hasDelta"],
//       primary: true,
//       ...resource
//     }, id, parent);
//   }
//
// }

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
// KarmaFieldsAlpha.field.table.close = class extends KarmaFieldsAlpha.field.button {
//   constructor(resource, id, parent) {
//     super({
//       dashicon: "no",
//       title: "Close",
//       action: "close",
//       ...resource
//     }, id, parent);
//   }
// }


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
