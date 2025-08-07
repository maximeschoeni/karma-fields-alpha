
// KarmaFieldsAlpha.field.form = class extends KarmaFieldsAlpha.field {

KarmaFieldsAlpha.field.table = class extends KarmaFieldsAlpha.field {

  init() {

    super.init();

    this.driver = this.getDriver();
    this.params = this.queryParams();
    this.paramstring = KarmaFieldsAlpha.Params.stringify(this.params.toObject());

  }

  getDriver() {

    return this.resource.driver || this.resource.body && this.resource.body.driver; // compat

  }


  queryParams() {

    const params = this.parse(this.resource.params || this.resource.body && this.resource.body.params); // compat

    const content = new KarmaFieldsAlpha.Content();

    if (params.loading) {

      content.loading = true;

    } else {

      content.value = {
        ...params.toObject(),
        ...this.getState("params")
      };

    }

    return content;

  }

  getFilters() {

    const filterParams = new KarmaFieldsAlpha.Content();

    if (this.params.loading) {

      filterParams.loading = true;

    } else {

      const {page, ppp, order, orderby, ...filters} = this.params.value || {};

      filterParams.value = filters;

    }

    return filterParams;
  }



//
// }
//
// KarmaFieldsAlpha.field.table = class extends KarmaFieldsAlpha.field.form {

  getChild(index) {

    if (index === "body" && this.resource.body) {

      return this.createChild({
        type: "body",
        ...this.resource.body
      }, "body");

    } else if (index === "header" && this.resource.header) {

      return this.createChild({
        type: "header",
        ...this.resource.header
      }, "header");

    } else if (index === "footer" && this.resource.footer) {

      return this.createChild({
        type: "footer",
        ...this.resource.footer
      }, "footer");

    }



  }

  isMixed() {

    const id = this.getContent("id");

    return Boolean(id.mixed);

  }

  *buildHeader() {

    if (this.resource.header) {

      yield this.createChild({
        type: "header",
        ...this.resource.header
      }, "header").build();

    }

  }

  *buildFooter() {

    if (this.resource.controls || this.resource.footer) {

      const footer = this.createChild({
        type: "footer",
        ...(this.resource.controls || this.resource.footer)
      }, "footer");

      yield footer.build();

    }

  }



  build() {

    return {
      class: "table-field",
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
          class: "karma-field-table",
          update: node => {
            node.element.classList.toggle("hidden", this.isMixed());
          },
          children: [
            {
              class: "karma-header table-header table-main-header simple-buttons",
              // child: this.createChild({
              //   type: "header",
              //   ...this.resource.header
              // }, "header").build(),
              children: [...this.buildHeader()], // compat
              update: header => {
                header.element.classList.toggle("hidden", !this.resource.header);
              }
            },
            this.createChild({
              ...this.resource.body
            }, "body").build(),
            {
              class: "table-footer table-control",
              // child: this.createChild({
              //   type: "footer",
              //   ...(this.resource.controls || this.resource.footer)
              // }, "footer").build(),
              children: [...this.buildFooter()], // compat
              update: footer => {
                const isLoading = this.request("hasTask");
                footer.element.classList.toggle("loading", Boolean(isLoading));
                footer.element.classList.toggle("hidden", (!this.resource.controls && !this.resource.footer));
              }
            }
          ]
        }
      ]
    };

  }


  getSet() {

    const set = new KarmaFieldsAlpha.Set(this.driver, this.paramstring);

    if (this.params.loading) {

      set.loading = true;

    } else {

      set.query();

    }

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

  getContentRange(index, length, key) {

    const set = this.getSet();

    // const values = set.toIds().slice(index, index + length).map(id => new KarmaFieldsAlpha.Value(set.driver, set.paramstring, id, key));
    const values = set.toIds().slice(index, index + length).map((id, index) => set.getValue(index, key));

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

    return set.getValue(index, key);

  }

  setContentAt(content, index, key) { // compat

    const set = this.getSet();

    const item = set.getValue(index, key);

    item.set(content.value);

  }

  getContent(key) {

    const content = new KarmaFieldsAlpha.Content();

    if (this.params.loading) {

      content.loading = true;

    } else {

      content.value = this.params.toObject()[key];

    }

    return content;

  }

  getValue(key) {

    return this.params.getChild(key);

  }

  setContent(value, key) {

    this.setState(value, key);

  }

  getParam(key) {

    return this.params.getChild(key);

  }

  setParam(value, key) {

    this.setState(value, key);

  }



  // getDefaults() {
  //
  //   return this.parse(this.resource.defaults || {});
  //
  // }

  getCount() {

    const set = this.getSet();

    return set.count();

  }

  getPage() {

    const content = new KarmaFieldsAlpha.Content();

    content.value = this.getParam("page").toNumber() || 1;

    return content;

  }

  getPpp() { // -> may cause problem if need loading !

    const content = new KarmaFieldsAlpha.Content();

    content.value = this.getParam("ppp").toNumber() || 100;

    return content;
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

    content.value = this.getPage().toNumber() === 1;

    return content;

  }

  isLastPage() {

    const numPage = this.getNumPage();
    const content = new KarmaFieldsAlpha.Content();

    if (numPage.loading) {

      content.loading = true;

    } else {

      content.value = this.getPage().toNumber() === numPage.toNumber()

    }

    return content;

  }

  setPage(page) {

    this.setContent(page, "page");

  }

  firstPage() {

    const page = this.getPage();

    if (page.toNumber() > 1) {

      this.save("changePage", "Change Page");
      this.setPage(1);

    }

  }

  prevPage() {

    const page = this.getPage();

    if (page.toNumber() > 1) {

      this.save("changePage", "Change Page");
      this.setPage(page - 1);

    }

  }

  nextPage() {

    const page = this.getPage();
    const numPage = this.getNumPage();

    if (page.toNumber() < numPage.toNumber()) {

      this.save("changePage", "Change Page");
      this.setPage(page.toNumber() + 1);

    }

  }

  lastPage() {

    const page = this.getPage();
    const numPage = this.getNumPage();

    if (page.toNumber() < numPage.toNumber()) {

      this.save("changePage", "Change Page");
      this.setPage(numPage.toNumber());

    }

  }

  isCurrentLayer() {

    const currentLayer = KarmaFieldsAlpha.Store.Layer.getCurrent();

    return currentLayer && currentLayer.table === this.parent.id;

  }

  *add(length = 1) {

    let set = this.getSet();

    while (set.loading) {

      yield;
      set = this.getSet();
    }

    let defaults = this.getDefaultParams();

    while (defaults.loading) {

      yield;
      defaults = this.getDefaultParams();
    }

    let filters = this.getFilters();

    while (filters.loading) { // should never happens since set is loaded !

      yield;
      filters = this.getFilters();
    }

    const params = {...filters.toObject(), ...defaults.toObject()};

    const body = this.getChild("body");
    const index = body.getNewItemIndex();

    this.save("insert", "Insert");

    set.add(params, index, length);

    yield* body.create(index, length);

    body.select(index, length);

  }








  getDefaultParams() {

    return this.parse(this.resource.defaults || this.resource.body && this.resource.body.defaults || {}); // compat

  }

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

  *delete(index, length) {

    const body = this.getChild("body");

    if (index === undefined || length === undefined) {

      const selection = body.querySelection();

      index = selection && selection.index || 0;
      length = selection && selection.length || 0;

    }

    if (length) {

      let set = this.getSet();

      while (set.loading) {

        yield;

        set = this.getSet();

      }

      this.save("delete", "Delete");

      set.remove(index, length);

      body.select(0, 0);

    }

  }

  *duplicate() {

    const body = this.getChild("body");
    const selection = body.querySelection();

    index = selection && selection.index || 0;
    length = selection && selection.length || 0;

    if (length) {

      this.save("duplicate", "Duplicate");

      let grid = body.export(index, length);

      while(grid.loading) {

        yield;

        grid = body.export(index, length);

      }

      yield* body.import(grid, index + length, length);

      this.select(index + length, length);

    }

  }

  isRowSelected() { // compat

    return this.hasSelection();

  }

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

  async *submit() {

    const ids = this.getSelectedIds();

    const delta = this.getDelta();

    for (let driver in delta) {

      yield;

      await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, delta[driver]);

      for (let id in delta[driver]) {

        for (let key in delta[driver][id]) {

          KarmaFieldsAlpha.Store.set(delta[driver][id][key], "vars", "remote", driver, id, key);

        }

      }

      // remove from delta buffer without updating history
      KarmaFieldsAlpha.Store.Buffer.remove("state", "delta", "vars", "remote", driver);


      // reset shuttles
      const shuttles = KarmaFieldsAlpha.Store.get("shuttles", driver);

      if (shuttles) {

        for (let paramstring in shuttles) {

          const shuttle = shuttles[paramstring];

          shuttle.init();

          shuttle.send();

        }

      }



      // await KarmaFieldsAlpha.Database.Queries.removeDriver(driver);

    }

    if (ids.length) {

      this.selectByIds(ids);

    }

  }

  isValueModified(value, driver, id, key) {

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

            if (this.isValueModified(delta[driver][id][key], driver, id, key)) {

              KarmaFieldsAlpha.DeepObject.set(output, delta[driver][id][key], driver, id, key);

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

            if (this.isValueModified(delta[driver][id][key], driver, id, key)) {

              return new KarmaFieldsAlpha.Content(true);

            }

          }

        }

      }

    }

    return new KarmaFieldsAlpha.Content(false);

  }

}

KarmaFieldsAlpha.field.table.footer = class extends KarmaFieldsAlpha.field.group {

  constructor(resource) {

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
    });

  }

}

KarmaFieldsAlpha.field.table.save = class extends KarmaFieldsAlpha.field.button {

  constructor(resource) {
    super({
      task: ["submit"],
      title: "Save",
      text: "Save",
      enabled: ["request", "hasDelta"],
      primary: true,
      ...resource
    });
  }

}

KarmaFieldsAlpha.field.table.add = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      task: ["add"],
      title: "Add",
      text: "Add",
      ...resource
    });
  }
}

KarmaFieldsAlpha.field.table.delete = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      task: ["delete"],
      title: "Delete",
      text: "Delete",
      enabled: ["request", "hasSelection"],
      ...resource
    });
  }

}

KarmaFieldsAlpha.field.table.insert = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      request: ["withdraw"],
      primary: true,
      text: "Insert",
      enabled: ["request", "hasSelection"],
      visible: ["request", "tunnel", -1, "useSocket"],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.table.export = class extends KarmaFieldsAlpha.field.download {
  constructor(resource) {
    super({
      text: "Export",
      ...resource
    });
  }
}



KarmaFieldsAlpha.field.table.header = class extends KarmaFieldsAlpha.field.group {

  constructor(resource) {

    super({
      display: "flex",
      children: [
        "title",
        "count",
        "pagination",
        "close"
      ],
      ...resource
    });

  }

}

KarmaFieldsAlpha.field.table.title = class extends KarmaFieldsAlpha.field.text {

  constructor(resource) {

    super({
      tag: "h1",
      style: "flex-grow:1",
      class: "ellipsis",
      content: "Title",
      ...resource
    });

  }

  getContent() {

    const content = this.getResource("title");

    return this.parse(content || this.resource.content);

  }

}

KarmaFieldsAlpha.field.table.count = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      style: "justify-content:center;white-space: nowrap;",
      value: ["replace", "# elements", "#", ["request", "getCount"]],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.table.close = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      dashicon: "no",
      title: "Close",
      request: ["close"],
      ...resource
    });
  }
}


KarmaFieldsAlpha.field.table.pagination = class extends KarmaFieldsAlpha.field.group {

  constructor(resource) {

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
    });
  }

}

KarmaFieldsAlpha.field.table.pagination.firstpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      task: ["set", 1, "page"],
      request: ["firstPage"],
      title: "First Page",
      text: "«",
      disabled: ["==", ["request", "getPage"], 1],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.table.pagination.prevpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      // request: ["body", "prevPage"],
      task: ["set", ["-", ["request", "getPage"], 1], "page"],
      title: "Previous Page",
      text: "‹",
      disabled: ["==", ["request", "getPage"], 1],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.table.pagination.currentpage = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      style: "font-family: monospace;", //"min-width: 4em;text-align: right;",
      value: ["replace", "#/#", "#", ["request", "getPage"], ["request", "getNumPage"]],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.table.pagination.nextpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      // request: ["body", "nextPage"],
      task: ["set", ["+", ["request", "getPage"], 1], "page"],
      title: "Next Page",
      text: "›",
      // disabled: ["==", ["request", "body", "getPage"], ["request", "body", "getNumPage"]],
      disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.table.pagination.lastpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      request: ["body", "lastPage"],
      task: ["set", ["request", "getNumPage"], "page"],
      title: "Last Page",
      text: "»",
      disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]],
      ...resource
    });
  }
}
