
KarmaFieldsAlpha.field.grid = class extends KarmaFieldsAlpha.field {

  getDriver() {

    if (!this.resource.driver) {

      console.error("Driver not set");

    }

    return this.resource.driver;

  }

  getContent(...path) {

    const driver = this.getDriver();

    return KarmaFieldsAlpha.Query.getValue(driver, ...path);

  }

  setContent(content, id, key) {

    const driver = this.getDriver(key);

    key = KarmaFieldsAlpha.Query.getAlias(driver, key);

    KarmaFieldsAlpha.Store.Delta.set(content.toArray(), driver, id, key);

  }

  removeContent(id, key) {

    const driver = this.getDriver();

    key = KarmaFieldsAlpha.Query.getAlias(driver, key);

    KarmaFieldsAlpha.Store.Delta.remove(driver, id, key);

  }

  getParams() {

    return KarmaFieldsAlpha.Store.Layer.getCurrent("params");

  }

  getParam(key) {

    return KarmaFieldsAlpha.Store.Layer.getParam(key);

  }

  setParam(value, key) {

    KarmaFieldsAlpha.Store.Layer.setParam(value, key);

    this.request("render");

  }

  getFilters() {

    const {page, ppp, order, orderby, ...params} = KarmaFieldsAlpha.Store.Layer.getParams() || {};

    return params;

  }

  getCount() {

    const driver = this.getDriver();

    const params = this.getFilters();

    if (params) {

      return KarmaFieldsAlpha.Query.getCount(driver, params);

    }

  }

  getPage() {

    const page = this.getParam("page");

    return Number(page || 1);

  }

  getPpp() {

    const ppp = this.getParam("ppp");

    return Number(ppp || 100);
  }

  getOrder() {

    return this.getParam("order");

  }

  getOrderby() {

    return this.getParam("orderby");

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

    let request = this.getCount();

    if (!request.loading) {

      const count = request.toNumber();
      const ppp = this.getPpp();
      const numPage = Math.max(1, Math.ceil(count/ppp));

      return new KarmaFieldsAlpha.Content(numPage);

    }

    return new KarmaFieldsAlpha.Content.Request();
  }

  isFirstPage() {

    return new KarmaFieldsAlpha.Content(this.getPage() === 1);

  }

  isLastPage() {

    const numPage = this.getNumPage();

    return new KarmaFieldsAlpha.Content(this.getPage() === numPage.toNumber(), numPage.loading);

  }

  setPage(page) {

    KarmaFieldsAlpha.History.save("changePage", "Change Page");
    KarmaFieldsAlpha.Store.Layer.setParam(page, "page");
    KarmaFieldsAlpha.Store.Layer.removeItems();
    // this.render();

  }

  firstPage() {

    const page = this.getPage();

    if (page > 1) {

      this.setPage(page);

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


  getIds() {

    const params = this.getParams();
    const driver = this.getDriver();

    return KarmaFieldsAlpha.Query.getIds(driver, params);

  }

  isCurrentLayer() {

    const currentLayer = KarmaFieldsAlpha.Store.Layer.getCurrent();

    return currentLayer && currentLayer.table === this.parent.id;

  }


  getItems() {

    let items = KarmaFieldsAlpha.Store.Layer.getItems();

    if (!items) {

      const ids = this.getIds();

      if (ids.loading) {

        return new KarmaFieldsAlpha.Content.Request();

      } else {

        items = ids.toArray().map(id => ({id}));

        KarmaFieldsAlpha.Store.Layer.setItems(items);

      }

    }

    return new KarmaFieldsAlpha.Content(items);
  }


  exportIds(ids) { // used for export button

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

  export(index = 0, length = 999999) {

    const request = this.getSelectedItems();

    if (!request.loading) {

      const ids = request.toArray().map(item => item.id);

      return this.exportIds(ids);

    }

  }

  importIds(grid, ids) {

    if (grid.value.length === ids.length) {

      const columns = this.getExportableColumns();

      for (let i = 0; i < grid.value.length; i++) {

        const child = this.createChild({
          children: columns,
          type: "row",
          index: i,
          id: ids[i]
        }, i);

        const content = new KarmaFieldsAlpha.Content.Collection(grid.value[i]);

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

      const items = this.getItems();
      const item = !items.loading && items.toArray()[index];

      if (item) {

        return this.createChild({
          id: item.id,
          type: "row",
          children: this.resource.children,
          loading: item.loading,
          index: index
        });

      }

    }

  }

  selectAll() {

    const items = this.getItems();

    if (!items.loading) {

      this.setSelection({
        index: 0,
        length: items.length
      });

      this.request("render");
    }

  }

  copy() {

    const items = this.getSelectedItems();

    if (!items.loading) {

      const ids = items.toArray().filter(item => item.id && !item.loading).map(item => item.id);

      const content = this.exportIds(ids);

      if (!content.loading) {

        return content.toString();

      }

    }

    return "loading...";
  }

  paste(value) {

    const grid = new KarmaFieldsAlpha.Content.Grid(value);

    // const items = this.getItems();
    //
    // if (!items.loading) {

      // this.save("paste", "Paste");

      const index = this.getSelection("index") || 0;
      const length = this.getSelection("length") || 0;

      const array = grid.toArray();

      if (array.length < length) {

        this.remove(index + array.length, length - array.length);

      } else if (array.length > length) {

        for (let i = 0; i < array.length - length; i++) {

          this.add();

        }
        // KarmaFieldsAlpha.Query.add(this.resource.driver, params, index + length, array.length - length, ...path);

      }

      KarmaFieldsAlpha.Store.Tasks.add({
        type: "import",
        resolve: () => {
          // const items = this.getItems();
          const items = KarmaFieldsAlpha.Store.Layer.getItems();
          this.setSelection({index: index, length: array.length});
          const slice = items.slice(index, index + array.length);
          const ids = slice.filter(item => !item.loading && item.id).map(item => item.id);
          this.importIds(grid, ids);
        }
      });

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


  add(...path) {

    const index = this.getSelection("index") || 0;
    const length = this.getSelection("length") || 0;

    KarmaFieldsAlpha.History.save("insert", "Insert");

    const newItem = {loading: true};
    const items = [...KarmaFieldsAlpha.Store.Layer.getItems()];

    KarmaFieldsAlpha.DeepArray.splice(items, 0, [newItem], index, ...path);

    KarmaFieldsAlpha.Store.Layer.setItems(items);

    this.addTask(async () => {

      const driver = this.getDriver();
      const params = this.getFilters();

      const id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`, {}).then(id => id.toString());

      const items = [...KarmaFieldsAlpha.Store.Layer.getItems()];

      const newItem = items.find(item => item.loading);

      delete newItem.loading;
      newItem.id = id;

      KarmaFieldsAlpha.Store.Layer.setItems(items);

      // KarmaFieldsAlpha.Store.Layer.removeItems();

      if (params) {

        const entries = Object.entries(params).filter(([key, value]) => value).map(([key, value]) => [KarmaFieldsAlpha.Query.getAlias(driver, key), params[key].split(",")]);

        if (entries.length) {

          const data = Object.fromEntries(entries);

          await KarmaFieldsAlpha.Remote.update(data, driver, id);

          KarmaFieldsAlpha.Store.Delta.set(data, driver, id);

        }

      }

      KarmaFieldsAlpha.Store.set(["1"], "vars", driver, id, "trash");
      KarmaFieldsAlpha.Store.Delta.set([], driver, id, "trash");

      KarmaFieldsAlpha.Store.remove("queries", driver);
      KarmaFieldsAlpha.Store.remove("counts", driver);

    }, "add");

    this.setSelection({index: index + length, length: 1});

    this.request("render");
  }





  canDelete() {

    return this.selection && this.selection.length > 0 || false;

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

      this.remove(index, length);

      this.removeSelection();

      this.request("render");

    }

  }

  removeIds(ids) {

    const driver = this.getDriver();
    const currentItems = KarmaFieldsAlpha.Store.Layer.getItems() || [];
    const filteredItems = currentItems.filter(item => !ids.includes(item.id));

    for (let id of ids) {

      KarmaFieldsAlpha.Store.Delta.set(["1"], driver, id, "trash");

    }

    KarmaFieldsAlpha.Store.Layer.setItems(filteredItems);

  }

  removeRange(index, length) {

    this.remove(index, length);
  }

  remove(index, length) {

    const request = this.getItems();

    if (!request.loading) {

      const items = request.toArray().slice(index, index + length);
      const ids = items.map(item => item.id).filter(id => id);

      if (ids.length) {

        this.removeIds(ids);

      }

    }

  }


  duplicate(index, length = 1) {

    const items = this.export(index, length);

    this.import(items, index + length, 0);

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

  getSelectedItems() {

    const items = this.getItems();

    const response = new KarmaFieldsAlpha.Content();

    if (items.loading) {

      response.loading = true;

    } else {

      const selection = this.getSelection();

      if (selection) {

        const index = selection.index || 0;
        const length = selection.length || 0;

        response.value = items.toArray().slice(index, index + length);

      } else {

        response.value = [];

      }

    }

    return response;

  }

  withdraw() {

    const content = this.getSelectedItems();

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

    const content = this.getItems();

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

      if (selection.length === ids.length) { // -> non consecutive ids... dunno how to handle yet :(

        this.setSelection(selection);

      }

    }

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
      },
      update: grid => {

        const content = this.getItems();

        grid.element.classList.toggle("loading", Boolean(content.loading));
        grid.element.classList.toggle("active", Boolean(this.hasFocus()));

        // const itemsUnder = this.request("tunnel", -1, "getSelectedItems");

        if (!content.loading) {

          const items = content.toArray();

          const page = this.request("getPage");
          const ppp = this.getPpp();
          const offset = (page - 1)*ppp;

          let selection = this.getSelection();

          grid.element.classList.toggle("even", items.length%2 === 0);
          // grid.element.classList.toggle("odd", items.length%2 === 1);

          const selector = new KarmaFieldsAlpha.RowPicker(grid.element, selection);

          selector.header = 1;
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

            const columns = this.resource.children || [];

            grid.children = [];

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

            for (let i = 0; i < items.length; i++) {

              const row = this.createChild({
                id: items[i].id,
                loading: items[i].loading,
                type: "row",
                children: columns,
                index: offset + i,
                rowIndex: offset + i
              }, i);

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

    const request = this.request("getSelectedItems");

    if (!request.loading && !request.toArray().some(item => item.loading)) {

      const items = request.toArray();

      if (items.length > 1) {

        const contents = items.map(item => this.parent.getContent(item.id, key));

        const content = new KarmaFieldsAlpha.Content();

        if (contents.some(content => content.loading)) {

          content.loading = true;

        } else if (contents.some((content, index, array) => index > 0 && !content.equals(array[0]))) {

          content.mixed = true;

          content.value = contents.map(content => content.value);

        } else {

          content.value = contents[0].toArray();

        }

        return content;

      } else if (items.length === 1) {

        return this.parent.getContent(items[0].id, key);

      }

    }

    return new KarmaFieldsAlpha.Content.Request();

  }

  setContent(value, key) {

    const items = this.request("getSelectedItems");

    if (!items.loading) {

      for (let item of items.toArray()) {

        if (item.id) {

          this.parent.setContent(value, item.id, key);

        }

      }

    }

  }

  getIds() {

    const items = this.request("getSelectedItems");

    if (items && !items.some(item => item.loading)) {

      return items.map(item => item.id).filter(id => id);

    }

  }

  getId() {

    const ids = this.getIds();

    if (ids) {

      return ids[0];

    }

  }

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

    const id = this.getId();

    if (this.resource.loading || !id) {

      return new KarmaFieldsAlpha.Content.Request();

    }

    if (key === "id") {

      return new KarmaFieldsAlpha.Content(id);

    }

    return this.parent.getContent(id, key);

  }

  setContent(value, key) {

    const id = this.getId();

    this.parent.setContent(value, id, key);

  }

  getIndex() {

    return this.resource.index || 0;

  }

  getId() {

    return this.resource.id;

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
