

KarmaFieldsAlpha.field.table = class extends KarmaFieldsAlpha.field.form {

  getParams() {

    return this.parse(this.resource.params || this.resource.body && this.resource.body.params); // compat

  }

  getShuttle() {

    if (!this.shuttle) {

      let params = this.getParams();


      if (!params.loading) {

        params = {
          ...params.toObject(),
          ...this.getState("params")
        };

        const driver = this.getDriver();

        if (!driver) {

          console.error("Driver not set", this.resource);

        }

        const paramstring = KarmaFieldsAlpha.Params.stringify(params);

        let shuttle = KarmaFieldsAlpha.Store.get("shuttles", driver, paramstring);

        if (!shuttle) {

          shuttle = new KarmaFieldsAlpha.Shuttle(driver, paramstring);

          const {page, ppp, order, orderby, ...filters} = params;
          shuttle.page = page;
          shuttle.ppp = ppp;
          shuttle.order = order;
          shuttle.orderby = orderby;
          shuttle.filters = filters;
          shuttle.params = params;

          shuttle.from = "table";

          shuttle.useCache = this.resource.cache || false;

          KarmaFieldsAlpha.Store.set(shuttle, "shuttles", driver, paramstring);

        }

        this.shuttle = shuttle;

      }

    }

    return this.shuttle;
  }

  getFilters() {

    const shuttle = this.getShuttle();
    const filters = new KarmaFieldsAlpha.Content();

    if (shuttle) {

      filters.value = shuttle.filters;

    } else {

      filters.loading = true;

    }

    return filters;
  }

  newChild(id) {

    if  (id === "header") {

      if (this.resource.header && this.resource.header.type === "header") {

        return new KarmaFieldsAlpha.field.table.header(this.resource.header, "header", this);

      } else {

        return new KarmaFieldsAlpha.field.group(this.resource.header, "header", this);

      }

    } else if (id === "footer") {

      return new KarmaFieldsAlpha.field.table.footer(this.resource.footer, "footer", this);

    } else if (id === "body" && this.resource.body) {

      return new KarmaFieldsAlpha.field[this.resource.body.type]({
        sortable: this.resource.sortable,
        ...this.resource.body
      }, "body", this);

    }

  }

  getChild(index, ...path) {

    // if (index === "body" && this.resource.body) {
    //
    //   return this.createChild({
    //     type: "grid", // by default
    //     index: (this.getPage().toNumber() - 1)*this.getPpp().toNumber(),
    //     ...this.resource.body
    //   }, "body");
    //
    // } else if (index === "header" && this.resource.header) {
    //
    //   return this.createChild({
    //     type: "header",
    //     ...this.resource.header
    //   }, "header");
    //
    // } else if (index === "footer" && this.resource.footer) {
    //
    //   return this.createChild({
    //     type: "footer",
    //     ...this.resource.footer
    //   }, "footer");
    //
    // }

    // const resource = this.resource[index];
    //
    // if  (resource) {
    //
    //   const child = new KarmaFieldsAlpha.field.table[resource.type](resource, index, this);
    //   // child.id = index;
    //   // child.parent = this;
    //
    //   if (path.length) {
    //
    //     return child.getChild(...path);
    //
    //   } else {
    //
    //     return child;
    //
    //   }
    //
    // }

    let child = this.newChild(index);

    // if  (index === "header") {
    //
    //   child = new KarmaFieldsAlpha.field.table.header(this.resource.header, "header", this);
    //
    // } else if (index === "footer") {
    //
    //   child = new KarmaFieldsAlpha.field.table.footer(this.resource.footer, "footer", this);
    //
    // } else if (index === "body" && this.resource.body) {
    //
    //   child = new KarmaFieldsAlpha.field[this.resource.body.type](this.resource.body, "body", this);
    //
    // }

    if (child && path.length) {

      return child.getChild(...path);

    }

    return child;

  }


  // isMixed() {
  //
  //   const id = this.getContent("id");
  //
  //   return Boolean(id.mixed);
  //
  // }

  // *buildHeader() {
  //
  //   if (this.resource.header) {
  //
  //     // yield this.createChild({
  //     //   type: "header",
  //     //   ...this.resource.header
  //     // }, "header").build();
  //
  //     yield this.getChild("header").build();
  //
  //   }
  //
  // }
  //
  // *buildFooter() {
  //
  //   if (this.resource.footer) {
  //
  //     // const footer = this.createChild({
  //     //   type: "footer",
  //     //   ...(this.resource.controls || this.resource.footer)
  //     // }, "footer");
  //     //
  //     // yield footer.build();
  //
  //     yield this.getChild("footer").build();
  //
  //   }
  //
  // }
  //
  // *buildBody() {
  //
  //   if (this.resource.body) {
  //
  //     yield this.getChild("body").build();
  //
  //   }
  //
  // }
  //
  // *buildPart(part) {
  //
  //   if (this.resource[part]) {
  //
  //     yield this.getChild(part).build();
  //
  //   }
  //
  // }

  *buildParts() {

    if (this.resource.header) {

      yield {
        class: "karma-header table-header table-main-header simple-buttons",
        child: this.getChild("header").build()
      };

    }

    yield {
      class: "table-body",
      child: this.getChild("body").build()
    };

    if (this.resource.footer) {

      yield {
        class: "table-footer table-control",
        child: this.getChild("footer").build(),
        update: footer => {
          const isLoading = this.request("hasTask");
          footer.element.classList.toggle("loading", Boolean(isLoading));
        }
      };

    }

  }



  build() {

    return {
      class: "table-field",
      // update: node => {
      //   node.element.onmousedown = event => {
      //     event.stopPropagation();
      //     const body = this.getChild("body");
      //     if (body) {
      //       body.setFocus(true);
      //       body.select(0, 0);
      //       this.render();
      //     }
      //   }
      // },

      children: [
        {
          class: "mixed-content",
          init: node => {
            node.element.innerHTML = "[mixed content]";
          },
          update: node => {
            node.element.classList.toggle("hidden", !this.getContent().mixed);
          }
        },
        {
          class: "karma-field-table",
          init: node => {
            node.element.style.width = this.resource.width || "100%";
          },
          update: node => {
            node.element.classList.toggle("hidden", Boolean(this.getLength().mixed));
            node.element.classList.toggle("has-selection", Boolean(this.hasFocusInside()));

            node.element.onmousedown = event => {
              event.stopPropagation();
              const body = this.getChild("body");
              if (body) {
                body.setFocus(true);
                if (body.select) body.select(0, 0); // !!
                this.render();
              }
            }
          },
          children: [
            ...this.buildParts()
            // {
            //   class: "karma-header table-header table-main-header simple-buttons",
            //   // child: this.createChild({
            //   //   type: "header",
            //   //   ...this.resource.header
            //   // }, "header").build(),
            //   children: [...this.buildPart("header")],
            //   update: header => {
            //     header.element.classList.toggle("hidden", !this.resource.header);
            //   }
            // },
            // // this.createChild({
            // //   ...this.resource.body
            // // }, "body").build(),
            // // this.getChild("body").build(),
            // {
            //   class: "table-body",
            //   children: [...this.buildPart("body")]
            // },
            // {
            //   class: "table-footer table-control",
            //   // child: this.createChild({
            //   //   type: "footer",
            //   //   ...(this.resource.controls || this.resource.footer)
            //   // }, "footer").build(),
            //   children: [...this.buildPart("footer")],
            //   update: footer => {
            //     const isLoading = this.request("hasTask");
            //     footer.element.classList.toggle("loading", Boolean(isLoading));
            //     footer.element.classList.toggle("hidden", !footer.element.hasChildNodes());
            //   }
            // }
          ]
        }
      ]
    };

  }


  getIds() {

    const set = new KarmaFieldsAlpha.Content();
    const shuttle = this.getShuttle();

    if (shuttle) {

      if (shuttle.queried) {

        const deltaIds = KarmaFieldsAlpha.Store.State.get("ids", shuttle.driver, shuttle.paramstring);

        set.value = deltaIds || shuttle.queriedIds || [];

      } else {

        if (shuttle.cached) {

          set.value = shuttle.cachedIds || [];

          set.cache = true;

        } else {

          set.loading = true;

        }

        if (shuttle.idle) {

          const work = shuttle.mix(true);
          KarmaFieldsAlpha.Jobs.add(work);

          shuttle.idle = false;

        }

      }

    } else {

      set.loading = true;

    }

    return set;
  }

  getSet() {

    return this.getIds();

  }

  getIndexOffset() {

    const page = this.getPage().toNumber();
    const ppp = this.getPpp().toNumber();

    return (page - 1)*ppp;

  }




  getLength() {

    const set = this.getSet();
    const content = new KarmaFieldsAlpha.Content();

    if (set.loading) {

      content.loading = true;

    } else {

      content.value = set.toArray().length;

    }

    return content;
  }

  getContentRange(index, length, key) {

    const content = new KarmaFieldsAlpha.Content();

    const ids = this.getSet();

    if (ids.loading) {

      content.loading = true;

    } else {

      const values = ids.toArray().slice(index, index + length).map(id => this.getValueById(id, key));

      if (values.some(value => value.loading)) {

        content.loading = true;

      } else if (values.slice(1).some(value => !value.equals(values[0]))) {

        content.mixed = true;

      } else if (values.length > 0) {

        content.value = values[0].value;

      }

    }

    return content;

  }

  getContentAt(index, key) {

    const ids = this.getIds();

    if (ids.loading) {

      return new KarmaFieldsAlpha.Content.Loading();

    } else {

      const id = ids.toArray()[index];

      if (id) {

        return this.getValueById(id, key);

      } else {

        return new KarmaFieldsAlpha.Content();

      }

    }

  }

  setContentAt(content, index, key) { // deprecated (use setValueAt)

    return this.setValueAt(content.value || content, index, key);
  }

  setValueAt(value, index, key) {

    const ids = this.getIds();
    const id = ids.toArray()[index];

    if (id) {

      return this.setValueById(value, id, key);

    } else {

      console.warn("Cannot set value. Index out of bounds!", value, index, key);

    }

  }

  getOptionsList() {

    const content = new KarmaFieldsAlpha.Content();
    const ids = this.getIds();

    if (ids.loading) {

      content.loading = true;

    } else {

      content.value = ids.toArray().map(id => ({id, name: this.getValueById(id, "name").toString()}));

    }

    return content;

  }

  getCount() {

    const content = new KarmaFieldsAlpha.Content();
    const shuttle = this.getShuttle();

    if (shuttle) {

      if (shuttle.counted) {

        const delta = KarmaFieldsAlpha.Store.State.get("count", this.driver, this.paramstring);

        content.value = delta !== undefined && delta || shuttle.total;

      } else {

        if (shuttle.countIdle) {

          const work = shuttle.count();

          KarmaFieldsAlpha.Jobs.add(work);

          shuttle.countIdle = false;

        }

        content.loading = true;

      }

    } else {

      content.loading = true;

    }

    return content;
  }

  setCount(num) {

    const shuttle = this.getShuttle();

    if (shuttle) {

      KarmaFieldsAlpha.Store.State.set(num, "count", shuttle.driver, shuttle.paramstring);

    }

  }

  *increaseCount(num) {

    // let count = this.getCount();
    //
    // while (count.loading) {
    //
    //   yield;
    //   count = this.getCount();
    //
    // }
    //
    // this.setCount(count.toNumber() + num);

    const shuttle = this.getShuttle();

    if (shuttle && shuttle.counted) {

      const total = KarmaFieldsAlpha.Store.State.get("count", shuttle.driver, shuttle.paramstring) || shuttle.total || 0;

      KarmaFieldsAlpha.Store.State.set(total + num, "count", shuttle.driver, shuttle.paramstring); // only bother if count was actually queried

    }

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

  async *add(length = 1, index = undefined, params = {}, data = undefined) {

    let shuttle = this.getShuttle();

    while (!shuttle) {

      yield;
      shuttle = this.getShuttle();

    }

    let defaults = this.getDefaultParams();

    while (defaults.loading) {

      yield;
      defaults = this.getDefaultParams();
    }

    params = {...shuttle.filters, ...defaults.toObject(), ...params};

    const body = this.getChild("body");

    if (index === undefined) {

      index = body.getNewItemIndex();

    }

    this.save("insert", "Insert");

    const tokens = [];

    for (let i = 0; i < length; i++) {

      const token = this.createToken();
      tokens.push(token);

      for (let key in params) {

        this.setValueById(params[key], token, key);

      }

      if (data && data[i]) { // for when importing...

        for (let key in data[i]) {

          this.setValueById(data[i][key], token, key);

        }

      }

    }

    const ids = [...this.getIds().toArray()];
    ids.splice(index, 0, ...tokens);

    KarmaFieldsAlpha.Store.set(ids, "buffer", "state", "ids", shuttle.driver, shuttle.paramstring); // do not update history

    yield* this.increaseCount(length);

    yield* body.create(index, length);

    body.select(index, length);

    const createdIds = [];

    for (let token of tokens) {

      yield;

      let id = await KarmaFieldsAlpha.HTTP.post(`add/${shuttle.driver}`, params);

      id = id.toString();

      createdIds.push(id);

      // replace already saved values
      const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", shuttle.driver, token);

      if (delta) {

        for (let key in delta) {

          KarmaFieldsAlpha.Store.Delta.set(delta[key], "vars", "remote", shuttle.driver, id, key); // update history

        }

      }

      KarmaFieldsAlpha.Store.remove("buffer", "state", "delta", "vars", "remote", shuttle.driver, token); // do not update history

      KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", shuttle.driver, id, "trash");
      KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", shuttle.driver, id, "trash");


      // replace token by id
      const ids = this.getIds().toArray().map(item => item === token ? id : item);

      KarmaFieldsAlpha.Store.State.set(ids, "ids", shuttle.driver, shuttle.paramstring); // update history

    }


    // load newly created item

    // const paramstring = `ids=${createdIds.join(",")}`;
    // const newShuttle = new KarmaFieldsAlpha.Shuttle(shuttle.driver, paramstring);
    //
    // KarmaFieldsAlpha.Store.set(newShuttle, "shuttles", shuttle.driver, paramstring);
    //
    // yield* newShuttle.mix(false, false); // no lazy, no cache

  }


  createToken() {

    let index = KarmaFieldsAlpha.Store.get("tokenIndex") || 0;

    index++;

    KarmaFieldsAlpha.Store.set(index, "tokenIndex");

    return `_${index}_`;

    // return Symbol("adding");

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

      let shuttle = this.getShuttle();

      while (!shuttle) {

        yield;
        shuttle = this.getShuttle();

      }

      let ids = this.getIds();

      while (ids.loading || ids.toArray().some(id => typeof id === "symbol")) {

        yield;
        ids = this.getIds();

      }

      this.save("delete", "Delete");

      const newIds = [...ids.toArray()];

      const removedIds = newIds.splice(index, length);

      for (let id of removedIds) {

        KarmaFieldsAlpha.Store.set(["0"], "vars", "remote", shuttle.driver, id, "trash");
        KarmaFieldsAlpha.Store.Delta.set(["1"], "vars", "remote", shuttle.driver, id, "trash");

      }

      KarmaFieldsAlpha.Store.State.set(newIds, "ids", shuttle.driver, shuttle.paramstring);

      body.select(0, 0);

      yield* this.increaseCount(-length);

    }

  }

  async *duplicate() {

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

    const ids = this.getSet().toArray();

    if (body) {

      const selection = body.querySelection();

      if (selection) {

        const index = selection.index || 0;
        const length = selection.length || 0;

        return ids.slice(index, index + length);

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

  async *selectByIds(selectIds) {

    const body = this.getChild("body");
    // const selection = {index: 0, length: Infinity};

    let ids = this.getIds();

    while (ids.loading) {

      yield;
      ids = this.getIds();

    }

    const index = ids.toArray().indexOf(selectIds[0]);

    if (index > -1 && body) {

      body.select(index, selectIds.length);
      body.setFocus(true);

    } else {

      body.unselect();

    }

    // for (let i = 0; i < this.getSet().toArray().length; i++) {
    //
    //   selection.index = Math.max(selection.index, i);
    //   selection.length = Math.min(selection.length, i - selection.index + 1);
    //
    // }

    // if (body && selection.length < Infinity) {
    //
    //   body.select(selection);
    //
    // }

  }

  swap(index, target, length) {

    const shuttle = this.getShuttle();
    let set = this.getIds();

    // while (contents.some(content => content.loading)) {
    //
    //   yield;
    //   contents = keys.map(key => this.getContent(key));
    //
    // }

    if (set.loading) {

      console.log(ids);
      console.error("content is not loaded");

    }


    this.save("sort", "Sort");

    // for (let j in contents) {
    //
    //   const content = contents[j];
    //   const key = keys[j];
    //
    //   const newContent = [...content.toArray()];
    //
    //   newContent.splice(target, 0, ...newContent.splice(index, length));
    //
    //   this.setValue(newContent, key);
    //
    // }


    const ids = [...set.toArray()];

    ids.splice(target, 0, ...ids.splice(index, length));

    KarmaFieldsAlpha.Store.State.set(ids, "ids", shuttle.driver, shuttle.paramstring); // update history

    for (let i = 0; i < ids.length; i++) {

      this.setValueAt(i, i, this.resource.sortable === true && "position" || this.resource.sortable);

      // KarmaFieldsAlpha.Store.Delta.set([i], "vars", "remote", shuttle.driver, ids[i], this.resource.sortable || "position");

    }


    const body = this.getChild("body");

    if (body) {

      body.setFocus(true);
      body.select(target, length);

    }

  }

}




KarmaFieldsAlpha.field.table.footer = class extends KarmaFieldsAlpha.field.group {

  constructor(resource, id, parent) {

    // console.log(id, parent);
    // if (parent === undefined) {
    //   console.trace();
    // }

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
      task: ["submit"],
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
      request: ["add"],
      title: "Add",
      text: "Add",
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.table.delete = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      task: ["delete"],
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
      request: ["drop"],
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



KarmaFieldsAlpha.field.table.header = class extends KarmaFieldsAlpha.field.group {

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

KarmaFieldsAlpha.field.title = class extends KarmaFieldsAlpha.field.text {

  constructor(resource, id, parent) {

    super({
      tag: "h1",
      style: "flex-grow:1",
      class: "ellipsis",
      content: "Title",
      ...resource
    }, id, parent);

  }

  getContent() {

    const content = this.getResource("title");

    return this.parse(content || this.resource.content);

  }

}

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
      request: ["close"],
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
      task: ["set", 1, "page"],
      request: ["firstPage"],
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
      task: ["set", ["-", ["request", "getPage"], 1], "page"],
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
      task: ["set", ["+", ["request", "getPage"], 1], "page"],
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
      request: ["body", "lastPage"],
      task: ["set", ["request", "getNumPage"], "page"],
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
