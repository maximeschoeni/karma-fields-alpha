

KarmaFieldsAlpha.field.grid = class extends KarmaFieldsAlpha.field {

  getLength() {

    return this.parent.getLength();

  }

  // getIndex() {
  //
  //   return new KarmaFieldsAlpha.Content(this.resource.index || 0);
  //
  // }

  *genChildren() {

    for (let i = 0; i < this.getLength().toNumber(); i++) {

      yield this.createChild({
        type: "row",
        children: this.resource.children,
        index: (this.resource.index || 0) + i
      }, i);

    }

  }

  newChild(id) {

    if (id === "modal" || id === "*") {

      return new KarmaFieldsAlpha.field.grid.modal(this.resource.modal, "modal", this);

      // return this.createChild({
      //   ...this.resource.modal,
      //   type: "modal",
      // }, "modal");

    } else {

      return new KarmaFieldsAlpha.field.grid.row({
        children: this.resource.children,
        index: (this.resource.index || 0) + id
      }, id, this);

    }

  }

  getChild(index, ...path) {

    let child = this.newChild(index);

    if (child && path.length) {

      return child.getChild(...path);

    }

    return child;

  }

  // getChild(index) {
  //
  //   if (index === "modal" || index === "*") {
  //
  //     return this.createChild({
  //       ...this.resource.modal,
  //       type: "modal",
  //     }, "modal");
  //
  //   } else {
  //
  //     return this.createChild({
  //       type: "row",
  //       children: this.resource.children,
  //       index: (this.resource.index || 0) + index
  //     }, index);
  //
  //   }
  //
  // }

  getContentAt(index, key) {

    if (index === "modal" || index === "*") {

      const selection = {index: 0, length: 0, ...this.querySelection()};

      if (selection.length > 1) {

        return this.parent.getContentRange(selection.index, selection.length, key);

      } else if (selection.length === 1) {

        return this.parent.getContentAt(selection.index, key);

      } else {

        return new KarmaFieldsAlpha.Content();

      }

    } else {

      return this.parent.getContentAt(index, key);

    }

  }

  setContentAt(value, index, key) {

    if (index === "modal" || index === "*") {

      const selection = {index: 0, length: 0, ...this.querySelection()};

      for (let i = 0; i < selection.length; i++) {

        this.parent.setContentAt(value, selection.index + i, key);

      }

    } else {

      this.parent.setContentAt(value, index, key);

    }

  }

  setValueAt(value, index, key) {

    if (index === "modal" || index === "*") {

      const selection = {index: 0, length: 0, ...this.querySelection()};

      for (let i = 0; i < selection.length; i++) {

        this.parent.setValueAt(value, selection.index + i, key);

      }

    } else {

      this.parent.setValueAt(value, index, key);

    }

  }

  hasSelection() {

    return this.getSelection("length") > 0;

  }

  select(index = 0, length = 0) { // to be overrided (ie. Medias grid)

    this.setSelection({index, length});

  }

  unselect() { // to be overrided (ie. Medias grid)

    this.removeSelection();

  }

  querySelection() { // to be overrided (ie. Medias grid)

    return this.getSelection();

  }

  *selectAll() {

    const length = this.getLength();

    this.setSelection({
      index: 0,
      length: length.toNumber()
    });

    // this.request("render");

  }

  copy() {

    const index = this.getSelection("index") || 0;
    const length = this.getSelection("length") || 0;

    const grid = this.export(index, length);

    if (grid.loading) {

      return "[loading]";

    } else {

      return grid.toString();

    }

  }

  async *paste(value) {

    const grid = new KarmaFieldsAlpha.Content.Grid(value);

    this.save("paste", "Paste");

    const index = this.getSelection("index") || 0;
    const length = this.getSelection("length") || 0;

    // this.import(grid, index, length);

    yield* this.import(grid, index, length);

    const body = this.getChild("body");

    this.setSelection({index, length: grid.toArray().length});

    // const work = this.parent.import(grid, index, length);
    //
    // KarmaFieldsAlpha.Jobs.add(work);
    //
    // this.request("render");

  }

  // *delete() {
  //
  //   yield* this.parent.delete();
  //
  // }

  getDefaultIndex() {

    const selection = this.getSelection();

    if (selection && selection.length) {

      return selection.index + selection.length;

    } else if (this.resource.defaultIndex !== undefined) {

      return this.resource.defaultIndex;

    } else {

      return this.getLength().toNumber();

    }

  }

  getNewItemIndex() {

    const selection = this.querySelection();

    if (selection && selection.length) {

      return selection.index + selection.length;

    } else if (this.resource.defaultIndex !== undefined) {

      return this.resource.defaultIndex;

    } else {

      return this.getLength().toNumber();

    }

  }

  // *add(num = 1, index = undefined) {
  //
  //   yield* this.parent.add(num, index);
  //
  // }

  *create(index, length = 1) {

    for (let i = 0; i < length; i++) {

      const field = this.createChild({
        type: "row",
        children: this.resource.children,
      }, index + i);

      yield* field.create();

      if (this.resource.modal) {

        const field = this.createChild({
          type: "row",
          children: this.resource.modal.children,
        }, index + i);

        yield* field.create();

      }

    }

  }

  *duplicate() {

    yield* this.parent.duplicate(num);

  }



  getExportableColumns() {

    if (this.resource.export || this.resource.import) {

      return this.resource.export || this.resource.import;

    } else if (this.resource.modal) {

      return [...this.resource.children, ...this.resource.modal.children];

    } else {

      return this.resource.children;

    }

  }

  export(index, length, columns = this.getExportableColumns()) {

    if (index === undefined || length === undefined) {

      const selection = this.getSelection();

      index = selection && selection.index || 0;
      length = selection && selection.length || 0;

    }

    const gridContent = new KarmaFieldsAlpha.Content.Grid();

    for (let i = 0; i < length; i++) {

      const rowField = this.createChild({
        type: "row",
        children: columns
      }, index + i);

      const collection = rowField.export();

      if (collection.loading) {

        gridContent.loading = true;

      } else {

        gridContent.value.push(collection.toArray());

      }

    }

    return gridContent;

  }

  async *import(grid, index, length, columns = this.getExportableColumns()) {

    if (index === undefined || length === undefined) {

      const selection = this.getSelection();

      index = selection && selection.index || 0;
      length = selection && selection.length || 0;

    }

    const array = grid.toArray();

    if (array.length < length) {

      yield* this.parent.delete(index + array.length, length - array.length);

    } else if (array.length > length) {

      yield* this.parent.add(array.length - length, index + length);

    }

    for (let i = 0; i < array.length; i++) {

      const child = this.createChild({
        children: columns,
        type: "row",
      }, index + i);

      const content = new KarmaFieldsAlpha.Content(array[i]);

      yield* child.import(content);

    }

  }

  // swap(index, length, target) {
  //
  //   this.parent.swap(index, length, target)
  //
  // }

  getColumns() {

    return this.resource.children || [];

  }

  hasHeader() {

    return this.getColumns().some(column => column.label);

  }

  // *buildHeader() {
  //
  //   const columns = this.getColumns();
  //
  //   if (this.hasHeader()) {
  //
  //     for (let i = 0; i < columns.length; i++) {
  //
  //       const resource = columns[i];
  //
  //       yield {
  //         class: "th table-header-cell",
  //         init: th => {
  //           if (resource.style) {
  //             th.element.style = resource.style;
  //           }
  //           th.element.tabIndex = -1;
  //         },
  //         update: th => {
  //           th.element.classList.toggle("first-cell", i === 0);
  //           th.element.classList.toggle("last-cell", i === columns.length - 1);
  //           th.children = [
  //             {
  //               class: "header-cell-content title",
  //               init: a => {
  //                 a.element.textContent = resource.label;
  //               }
  //             },
  //             {
  //               class: "header-cell-content order",
  //               // child: {
  //               //   tag: "span",
  //               //   class: "dashicons",
  //               //   update: span => {
  //               //     // const order = this.getOrder() || "asc";
  //               //     const order = this.getContent("order").toString() || "asc";
  //               //     // const orderby = this.getOrderby();
  //               //     const orderby = this.getContent("orderby").toString();
  //               //     const isAsc = orderby === (resource.orderby || resource.key) && order === "asc";
  //               //     const isDesc = orderby === (resource.orderby || resource.key) && order === "desc";
  //               //     span.element.classList.toggle("dashicons-arrow-up", isAsc);
  //               //     span.element.classList.toggle("dashicons-arrow-down", isDesc);
  //               //     span.element.classList.toggle("dashicons-leftright", !isAsc && !isDesc);
  //               //   }
  //               // },
  //               children: [
  //                 {
  //                   tag: "span",
  //                   class: "dashicons dashicons-arrow-up",
  //
  //                   update: span => {
  //                     // const order = this.getContent("order").toString() || "asc";
  //                     // const orderby = this.getContent("orderby").toString();
  //                     //
  //                     // if (orderby.toString() === (resource.orderby || resource.key)) {
  //                     //   if (!order.toString() || order.toString() === "asc") {
  //                     //     span.element.classList.toggle("active", isAsc);
  //                     //   }
  //                     //
  //                     //
  //                     // }
  //
  //                     span.element.classList.toggle("active-order", (this.getContent("order").toString() || "asc") === "asc");
  //                     span.element.classList.toggle("active-orderby", this.getContent("orderby").toString() === (resource.orderby || resource.key));
  //
  //
  //                     // const isAsc = orderby === (resource.orderby || resource.key) && order === "asc";
  //                     // const isDesc = orderby === (resource.orderby || resource.key) && order === "desc";
  //                     // span.element.classList.toggle("dashicons-arrow-up", isAsc);
  //                     // span.element.classList.toggle("dashicons-arrow-down", isDesc);
  //                     // span.element.classList.toggle("dashicons-leftright", !isAsc && !isDesc);
  //                   }
  //                 },
  //                 {
  //                   tag: "span",
  //                   class: "dashicons",
  //                   update: span => {
  //                     // // const order = this.getOrder() || "asc";
  //                     // const order = this.getContent("order").toString() || "asc";
  //                     // // const orderby = this.getOrderby();
  //                     // const orderby = this.getContent("orderby").toString();
  //                     // const isAsc = orderby === (resource.orderby || resource.key) && order === "asc";
  //                     // const isDesc = orderby === (resource.orderby || resource.key) && order === "desc";
  //                     // span.element.classList.toggle("dashicons-arrow-up", isAsc);
  //                     // span.element.classList.toggle("dashicons-arrow-down", isDesc);
  //                     // span.element.classList.toggle("dashicons-leftright", !isAsc && !isDesc);
  //
  //                     span.element.classList.toggle("active-order", (this.getContent("order").toString() || "asc") === "asc");
  //                     span.element.classList.toggle("active-orderby", this.getContent("orderby").toString() === (resource.orderby || resource.key));
  //                   }
  //                 }
  //               ],
  //               update: a => {
  //                 a.element.classList.toggle("hidden", !resource.sortable);
  //                 if (resource.sortable) {
  //                   a.element.onmousedown = event => {
  //                     event.stopPropagation(); // -> prevent header selection
  //                   }
  //                   a.element.onclick = event => {
  //                     event.preventDefault();
  //
  //                     const order = this.getContent("order");
  //                     const orderby = this.getContent("orderby");
  //                     if (orderby.toString() === (resource.orderby || resource.key)) {
  //                       this.setValue((order.toString() || resource.order || "asc") === "asc" ? "desc" : "asc", "order");
  //                       this.render();
  //                     } else {
  //                       this.setValue(resource.order || "asc", "order");
  //                       this.setValue(resource.orderby || resource.key, "orderby");
  //                       this.render();
  //                     }
  //                   };
  //                 }
  //               }
  //             }
  //           ];
  //         }
  //       };
  //     }
  //
  //   }
  //
  // }



  *buildHeader() {

    const columns = this.getColumns();

    if (this.hasHeader() && this.getLength().toNumber()) {

      for (let i = 0; i < columns.length; i++) {

        const classes = [];

        if (i === 0) {
          classes.push("first-cell");
        }
        if (i === columns.length - 1) {
          classes.push("last-cell");
        }

        // yield this.createChild({
        //   ...columns[i],
        //   classes,
        //   type: "headerCell"
        // }, `header-cell-${i}`).build();
        const headerCell = new KarmaFieldsAlpha.field.grid.headerCell({
          ...columns[i],
          classes,
        }, `header-cell-${i}`, this);

        yield headerCell.build();

      }

    }

  }



  *buildRows() {

    yield* this.buildHeader();

    const length = this.getLength().toNumber();

    // const pageQuery = this.request("getPage");
    // const pppQuery = this.request("getPpp");
    //
    // // const page = this.parent.getContent("page").toNumber() || 1;
    // // const ppp = this.parent.getContent("ppp").toNumber() || 100;
    //
    // const offset = (pageQuery.toNumber() - 1)*pppQuery.toNumber();

    const offset = this.request("getIndexOffset") || 0;

    const selection = this.getSelection();

    for (let i = 0; i < length; i++) {

      const row = this.createChild({
        type: "row",
        children: this.resource.children,
        index: (this.resource.index || 0) + i,
        rowIndex: (this.resource.index || 0) + i // compat
      }, i);

      const isRowSelected = selection && KarmaFieldsAlpha.Segment.contain(selection, i);

      for (let j = 0; j < row.resource.children.length; j++) {

        const field = row.createChild(row.resource.children[j], j);

        yield {
          class: "td table-cell",
          init: td => {
            if (field.resource.style) {
              td.element.style = field.resource.style;
            }
            if (field.resource.classes) {
              td.element.classList.add(...field.resource.classes);
            }
          },
          update: td => {
            td.element.classList.toggle("selected", Boolean(isRowSelected));
            td.element.classList.toggle("odd", i%2 === 0);
            td.element.classList.toggle("last-row", i === length-1);
            td.element.classList.toggle("first-cell", j === 0);
            td.element.classList.toggle("last-cell", j === row.resource.children.length - 1);

          },
          child: field.build()
        };

      }

    }

  }

  buildModal() {

    return {
      class: "grid-modal table-body-column karma-modal scroll-container table-body-side-column",
      // child: this.createChild({
      //   ...this.resource.modal,
      //   type: "row"
      // }, "*").build(),
      children: [...this.createChild({
        ...this.resource.modal,
        type: "modal"
      }, "*").build()],
      // children: [this.createChild({
      //   ...this.resource.modal,
      //   type: "modal"
      // }, "*").build()],
      update: div => {
        div.element.classList.toggle("hidden", !this.resource.modal);
        if (this.resource.modal) {
          div.element.style.width = this.resource.modal.width || "30em";
          div.element.onmousedown = event => {
            event.stopPropagation(); // -> prevent unselecting

            this.setFocus(true);
            this.request("render");
          };
          div.element.classList.toggle("active", Boolean(this.hasSelection()));
        }
      }
    };

  }

  buildBody() {

    return {
      class: "karma-field-table-grid-container karma-field-frame karma-field-group final scroll-container table-body-column table-body-main-column",
      child: {
        class: "table grid grid-field-body",
        init: grid => {
          if (this.resource.style) {
            grid.element.style = this.resource.style;
          }
          if (this.resource.width) {
            grid.element.style.width = this.resource.width;
          }
          if (this.resource.align) {
            grid.element.classList.add(`align-${this.resource.align}`);
          }
        },
        children: [...this.buildRows()],
        update: grid => {

          const length = this.getLength();
          // const query = this.queryItems();
          // const columns = this.getColumns();

          grid.element.classList.toggle("loading", Boolean(length.loading));
          grid.element.classList.toggle("active", Boolean(this.hasFocus()));
          grid.element.classList.toggle("even", length.toNumber()%2 === 0);
          grid.element.classList.toggle("filled", length.toNumber() > 0); // -> draw table borders

          // const columns = this.getColumns();
          const row = this.getChild(0);
          // grid.element.style.gridTemplateColumns = row.resource.children.map(resource => row.createChild(resource).resource.width || "auto").join(" ");
          grid.element.style.gridTemplateColumns = row.resource.children.map((resource, index) => row.getChild(index).resource.width || "auto").join(" ");
          // grid.element.style.gridTemplateColumns = columns.map(resource => resource.width || "auto").join(" ");

          let selection = this.getSelection();



          if (this.resource.sortable) {

            const sorter = new KarmaFieldsAlpha.ListSortGrid(grid.element, selection, this.resource.children.length, this.hasHeader() ? 1 : 0);

            sorter.onSelect = elements => {
              elements.map(element => element.classList.add("selected"));
              this.setSelection(sorter.state.selection);
            }

            sorter.onUnselect = elements => {
              elements.map(element => element.classList.remove("selected"));
            }

            sorter.onSelectionComplete = () => {
              this.setFocus(1);
              this.request("render");
            }

            sorter.onSwap = (newState, lastState) => {
              this.save("sort", "Sort");
              this.request("swap", lastState.selection.index, newState.selection.index, newState.selection.length);
              this.setSelection(newState.selection);
            };

            sorter.onSort = (index, target, length) => {
              this.setFocus(1);
              this.request("render");
            }

          } else {

            const selector = new KarmaFieldsAlpha.RowPicker(grid.element, selection);
            // const hasHeader = columns.some(column => column.label);
            selector.header = this.hasHeader() ? 1 : 0;
            selector.width = this.resource.children.length;

            selector.onSelect = elements => {
              elements.map(element => element.classList.add("selected"));
              this.setSelection(selector.state.selection);
            }

            selector.onUnselect = elements => {
              elements.map(element => element.classList.remove("selected"));
            }

            selector.onSelectionComplete = () => {
              this.setFocus(true);
              this.request("render");
            }

          }
        }
      }
    };

  }

  build() {

    // return {
    //   class: "table-body",
    //   children: [
    //     {
    //       class: "table-body-columns",
    //       update: div => {
    //         // -> unselect
    //         // div.element.onmousedown = event => {
    //         //   event.stopPropagation();
    //         //   event.preventDefault();
    //         //
    //         //   this.setFocus(true);
    //         //   this.request("render");
    //         // };
    //       },
    //       children: [
    //         this.buildBody(),
    //         this.buildModal()
    //       ]
    //     }
    //   ]
    // };

    return {
      class: "table-body-columns",
      update: div => {
        // -> unselect
        // div.element.onmousedown = event => {
        //   event.stopPropagation();
        //   event.preventDefault();
        //
        //   this.setFocus(true);
        //   this.request("render");
        // };
      },
      children: [
        this.buildBody(),
        this.buildModal()
      ]
    };

  }


}



KarmaFieldsAlpha.field.grid.headerCell = class extends KarmaFieldsAlpha.field {

  init() {

    super.init();

    this.order = this.getContent("order").toString() || this.resource.order || "asc";
    this.activeColumn = this.getContent("orderby").toString() === (this.resource.orderby || this.resource.key);

  }

  build() {

    return {
      class: "th table-header-cell",
      init: a => {
        if (this.resource.classes) {
          a.element.classList.add(...this.resource.classes);
        }
      },
      update: a => {
        a.element.classList.toggle("sortable", Boolean(this.resource.sortable))
        if (this.resource.sortable) {
          a.element.onmousedown = event => {
            event.stopPropagation(); // -> prevent header selection
          }
          a.element.onclick = event => {
            event.preventDefault();
            if (this.activeColumn) {
              this.setValue(this.order === "asc" ? "desc" : "asc", "order");
              this.render();
            } else {
              this.setValue(this.resource.order || "asc", "order");
              this.setValue(this.resource.orderby || this.resource.key, "orderby");
              this.render();
            }
          };
        }
      },
      children: [
        {
          class: "header-cell-content title",
          init: a => {
            a.element.textContent = this.resource.label;
          }
        },
        {
          class: "header-cell-content order",
          update: a => {
            a.element.classList.toggle("hidden", !this.resource.sortable);
          },
          children: [
            {
              tag: "span",
              class: "dashicons dashicons-arrow-up",
              update: span => {
                span.element.classList.toggle("active", this.order === "asc" && this.activeColumn);
                span.element.classList.toggle("passive", this.activeColumn && this.order !== "asc" || !this.activeColumn && (this.resource.order || "asc") === "asc");
              }
            },
            {
              tag: "span",
              class: "dashicons dashicons-arrow-down",
              update: span => {
                span.element.classList.toggle("active", this.order === "desc" && this.activeColumn);
                span.element.classList.toggle("passive", this.activeColumn && this.order !== "desc" || !this.activeColumn && (this.resource.order || "asc") === "desc");
              }
            }
          ]
        }
      ]
    };

  }

}


KarmaFieldsAlpha.field.grid.row = class extends KarmaFieldsAlpha.field.group {

  getContent(key) {

    return this.parent.getContentAt(this.id, key);

  }

  // setContent(value, key) {
  //
  //   this.setValue(value && value.value || value, this.id, key);
  //
  // }

  setValue(value, key) {

    this.parent.setValueAt(value, this.id, key);

  }

  getIndex() {

    return new KarmaFieldsAlpha.Content(this.resource.index || 0);

  }

}

KarmaFieldsAlpha.field.grid.modal = class extends KarmaFieldsAlpha.field.grid.row {

  *build() {

    if (this.parent.hasSelection()) {

      yield super.build();

    }

  }

}

KarmaFieldsAlpha.field.grid.row.rowIndex = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      value: ["+", ["resource", "index"], 1],
      width: "min-content",
      ...resource
    }, id, parent)
  }
};

KarmaFieldsAlpha.field.grid.row.index = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      // value: ["+", ["resource", "index"], 1],
      value: ["+", ["request", "getIndex"], 1],
      width: "min-content",
      ...resource
    }, id, parent)
  }
};

KarmaFieldsAlpha.field.grid.row.delete = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      // request: ["delete", ["request", "getIndex"]],
      action: "delete",
      params: [["request", "getIndex"], 1],
      title: "Delete",
      dashicon: "remove",
      classes: ["array-delete", "simple-buttons"],
      width: "min-content",
      ...resource
    }, id, parent);
  }
};
