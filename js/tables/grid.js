
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

  async setContent(content, ...path) {

    const driver = this.getDriver();

    await KarmaFieldsAlpha.Store.State.set(content.toArray(), "delta", driver, ...path);

  }

  async removeContent(...path) {

    const driver = this.getDriver();

    await KarmaFieldsAlpha.Store.State.remove("delta", driver, ...path);

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

  getCount() {

    const driver = this.getDriver();

    const params = this.getParams();

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

  async setPage(page) {

    await KarmaFieldsAlpha.History.save("changePage", "Change Page");
    await KarmaFieldsAlpha.Store.Layer.setParam(1, "page");
    await this.render();

  }

  async firstPage() {

    const page = this.getPage();

    if (page > 1) {

      await this.setPage(page);

    }

  }

  async prevPage() {

    const page = this.getPage();

    if (page > 1) {

      await this.setPage(page - 1);

    }

  }

  async nextPage() {

    const page = this.getPage();
    const numPage = this.getNumPage().toNumber();

    if (page < numPage) {

      await this.setPage(page + 1);

    }

  }

  async lastPage() {

    const page = this.getPage();
    const numPage = this.getNumPage().toNumber();

    if (page < numPage) {

      await this.setPage(numPage);

    }

  }


  getIds() {

    const params = this.getParams();
    const driver = this.getDriver();

    return KarmaFieldsAlpha.Query.getIds(driver, params);

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

  async importIds(grid, ids) {

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

        await child.import(content);

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
      });

    } else {

      const items = this.getItems();

      if (items[index]) {

        return this.createChild({
          id: item[index].id,
          type: "row",
          children: this.resource.children,
          loading: item[index].loading,
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

  async paste(value) {

    const grid = new KarmaFieldsAlpha.Content.Grid(value);

    const items = this.getItems();

    if (!items.loading) {

      await this.save("paste", "Paste");

      const selection = this.getSelection();

      const length = selection && selection.length || 0;
      const index = selection && selection.index || 0;

      const array = grid.toArray();

      if (array.length < length) {

        this.remove(index + array.length, length - array.length);

      } else if (array.length > length) {

        KarmaFieldsAlpha.Query.add(this.resource.driver, params, index + length, array.length - length, ...path);

      }

      KarmaFieldsAlpha.Store.Tasks.add({
        type: "import",
        resolve: async () => {
          const items = this.getItems();
          const slice = items.toArray().slice(index, index + array.length);
          const ids = slice.filter(item => !item.loading && item.id).map(item => item.id);
          await this.importIds(grid, ids);
        }
      });

      this.setSelection({index: index, length: array.length});

      this.request("render");

    }


  }

  async add(...path) {

    const index = this.selection && this.selection.index || 0;
    const length = this.selection && this.selection.length || 0;

    const params = this.parse(this.resource.defaults).toObject();

    await KarmaFieldsAlpha.History.save("insert", "Insert");

    await KarmaFieldsAlpha.Query.add(this.resource.driver, params, index, 1, ...path);

    this.setSelection({index: index + length, length: 1});

    await this.request("render");

  }

  canDelete() {

    return this.selection && this.selection.length > 0 || false;

  }

  async deleteSelection() {

    await this.delete();

  }

  async delete() {

    const selection = this.getSelection();

    if (selection && selection.length) {

      KarmaFieldsAlpha.History.save("delete", "Delete");

      const index = selection.index || 0;
      const length = selection.length || 0;

      await this.remove(index, length);

      this.removeSelection();

      await this.request("render");

    }

  }

  async removeIds(ids) {

    const driver = this.getDriver();
    const currentItems = KarmaFieldsAlpha.Store.Layer.getItems() || [];
    const filteredItems = currentItems.filter(item => !ids.includes(item.id));

    for (let id of ids) {

      await KarmaFieldsAlpha.Store.State.set(["1"], "delta", driver, id, "trash");

    }

    await KarmaFieldsAlpha.Store.Layer.setItems(filteredItems);

  }

  async removeRange(index, length) {

    await this.remove(index, length);
  }

  async remove(index, length) {

    const request = this.getItems();

    if (!request.loading) {

      const items = request.toArray().slice(index, index + length);
      const ids = items.map(item => item.id).filter(id => id);

      if (ids.length) {

        await this.removeIds(ids);

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

  async withdraw() {

    const content = this.getSelectedItems();

    if (!content.loading) {

      const items = content.toArray();
      const ids = items.toArray().filter(item => item.id && !item.loading).map(item => item.id);

      await this.save("withdraw", "Insert");
      await this.request("close");

      if (ids.length) {

        await this.request("dispatch", "insert", ids);

      }

      await this.request("render");

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
      update: async grid => {

        const content = this.getItems();

        grid.element.classList.toggle("loading", Boolean(content.loading));
        grid.element.classList.toggle("active", Boolean(this.hasFocus()));

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

          selector.onSelectionComplete = async () => {

            // this.useClipboard();

            await this.setFocus(true);
            // this.request("deferFocus");
            await this.request("render");

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
                          a.element.onclick = async event => {
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



KarmaFieldsAlpha.field.grid.modal = class extends KarmaFieldsAlpha.field.container {

  getContent(key) {

    const request = this.request("getSelectedItems");

    if (!request.loading && !request.toArray().some(item => item.loading)) {

      const items = request.toArray();

      if (items.length > 1) {

        // const contents = items.map(item => this.getContent(item.id, key));
        // const content = new KarmaFieldsAlpha.Content(contents);
        // content.loading = contents.some(content => content.loading);
        // content.mixed = contents.some((content, index, array) => index > 0 && !content.equals(array[0]));


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

  async setContent(value, key) {

    const items = this.request("getSelectedItems");

    if (!items.loading) {

      for (let item of items.toArray()) {

        if (item.id) {

          await this.parent.setContent(value, item.id, key);

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

  async setContent(value, key) {

    const id = this.getId();

    await this.parent.setContent(value, id, key);

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
