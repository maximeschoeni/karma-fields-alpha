

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

    console.warn("deprecated??")

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

      if (this.resource.modal) {

        return new KarmaFieldsAlpha.field.grid.modal(this.resource.modal, "modal", this);

      }

    } else {

      return new KarmaFieldsAlpha.field.grid.row({
        children: this.resource.children,
        index: id
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

  async getContentAt(index, key) {

    if (index === "modal" || index === "*") {

      let selection = await this.querySelection();

      selection = {index: 0, length: 0, ...selection};

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

  async setContentAt(value, index, key) {

    if (index === "modal" || index === "*") {

      let selection = await this.querySelection();

      selection = {index: 0, length: 0, ...selection};

      for (let i = 0; i < selection.length; i++) {

        await this.parent.setContentAt(value, selection.index + i, key);

      }

    } else {

      await this.parent.setContentAt(value, index, key);

    }

  }

  async setValueAt(value, index, key) {

    if (index === "modal" || index === "*") {

      let selection = await this.querySelection();

      selection = {index: 0, length: 0, ...selection};

      for (let i = 0; i < selection.length; i++) {

        await this.parent.setValueAt(value, selection.index + i, key);

      }

    } else {

      await this.parent.setValueAt(value, index, key);

    }

  }

  async hasSelection() {

    let selection = await this.getSelection();

    return new KarmaFieldsAlpha.Content(selection && selection.length > 0 || false);

  }

  select(index = 0, length = 0) { // to be overrided (ie. Medias grid)

    return this.setSelection({index, length});

  }

  unselect() { // to be overrided (ie. Medias grid)

    return this.removeSelection();

  }

  querySelection() { // to be overrided (ie. Medias grid)

    return this.getSelection();

  }

  async selectAll() {

    const length = await this.getLength();

    await this.setSelection({
      index: 0,
      length: length.toNumber()
    });

    // this.request("render");

  }

  async copy() {

    const selection = await this.getSelection();

    const index = selection.index || 0;
    const length = selection.length || 0;

    const grid = await this.export(index, length);

    if (grid.loading) {

      return "[loading]";

    } else {

      return grid.toString();

    }

  }

  async paste(value) {

    const grid = new KarmaFieldsAlpha.Content.Grid(value);

    await this.save("paste", "Paste");

    const selection = await this.getSelection();

    const index = selection.index || 0;
    const length = selection.length || 0;

    if (length === 0) {

      let lengthContent = await this.getLength();

      while (lengthContent.loading) {

        await this.render();
        lengthContent = await this.getLength();

      }

      index = lengthContent.value;

    }

    // this.import(grid, index, length);

    await this.import(grid, index, length);

    const body = this.getChild("body");

    await this.setSelection({index, length: grid.toArray().length});

    // const work = this.parent.import(grid, index, length);
    //
    // KarmaFieldsAlpha.Jobs.add(work);
    //
    // this.request("render");

  }

  async delete() {

    return this.parent.delete();

  }

  async getDefaultIndex() {

    const selection = await this.getSelection();

    if (selection && selection.length) {

      return selection.index + selection.length;

    } else if (this.resource.defaultIndex !== undefined) {

      return this.resource.defaultIndex;

    } else {

      const length = await this.getLength();

      return length.toNumber();

    }

  }

  async getNewItemIndex() {

    const selection = await this.querySelection();

    if (selection && selection.length) {

      return selection.index + selection.length;

    } else if (this.resource.defaultIndex !== undefined) {

      return this.resource.defaultIndex;

    } else {

      const length = await this.getLength();

      return length.toNumber();

    }

  }

  // *add(num = 1, index = undefined) {
  //
  //   yield* this.parent.add(num, index);
  //
  // }

  async *create(index, length = 1) {

    console.error("deprecated");

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

  async exportDefaults() {

    const response = new KarmaFieldsAlpha.Content();

    for (let index of [0, "*"]) {

      const child = this.getChild(index);

      if (child) {

        const defaults = await child.exportDefaults();

        if (defaults.loading) {

          response.loading = true;

        } else {

          response.value = {...response.toObject(), ...defaults.toObject()};

        }

      }
    }

    return response;

  }

  async duplicate(num) {

    return this.parent.duplicate(num);

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

  async export(index, length, columns = this.getExportableColumns()) {

    if (index === undefined || length === undefined) {

      const selection = await this.getSelection();

      index = selection && selection.index || 0;
      length = selection && selection.length || 0;

    }

    const gridContent = new KarmaFieldsAlpha.Content.Grid();

    for (let i = 0; i < length; i++) {

      const rowField = this.createChild({
        type: "row",
        children: columns
      }, index + i);

      const collection = await rowField.export();

      if (collection.loading) {

        gridContent.loading = true;

      } else {

        gridContent.value.push(collection.toArray());

      }

    }

    return gridContent;

  }

  async import(grid, index, length, columns) {

    if (!columns) {

      columns = this.getExportableColumns();

    }

    if (index === undefined || length === undefined) {

      const selection = await this.getSelection();

      index = selection && selection.index || 0;
      length = selection && selection.length || 0;

    }

    const array = grid.toArray();

    if (array.length < length) {

      await this.parent.delete(index + array.length, length - array.length);

    } else if (array.length > length) {

      await this.parent.add(array.length - length, index + length);

    }

    for (let i = 0; i < array.length; i++) {

      const child = this.createChild({
        children: columns,
        type: "row",
      }, index + i);

      const content = new KarmaFieldsAlpha.Content(array[i]);

      await child.import(content);

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



  // *buildHeader() {
  //
  //   const columns = this.getColumns();
  //
  //   if (this.hasHeader() && this.getLength().toNumber()) {
  //
  //     for (let i = 0; i < columns.length; i++) {
  //
  //       const classes = [];
  //
  //       if (i === 0) {
  //         classes.push("first-cell");
  //       }
  //       if (i === columns.length - 1) {
  //         classes.push("last-cell");
  //       }
  //
  //       // yield this.createChild({
  //       //   ...columns[i],
  //       //   classes,
  //       //   type: "headerCell"
  //       // }, `header-cell-${i}`).build();
  //       const headerCell = new KarmaFieldsAlpha.field.grid.headerCell({
  //         ...columns[i],
  //         classes,
  //       }, `header-cell-${i}`, this);
  //
  //       yield headerCell.build();
  //
  //     }
  //
  //   }
  //
  // }



  *buildRows(length, offset, selection) {

    // yield* this.buildHeader();

    const columns = this.getColumns();

    if (this.hasHeader() && length.toNumber()) {

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

    // const length = this.getLength().toNumber();

    // const pageQuery = this.request("getPage");
    // const pppQuery = this.request("getPpp");
    //
    // // const page = this.parent.getContent("page").toNumber() || 1;
    // // const ppp = this.parent.getContent("ppp").toNumber() || 100;
    //
    // const offset = (pageQuery.toNumber() - 1)*pppQuery.toNumber();

    // const offset = this.request("getIndexOffset") || 0;

    // const selection = this.getSelection();

    for (let i = 0; i < length.toNumber(); i++) {

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
            td.element.classList.toggle("last-row", i === length.toNumber()-1);
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
      init: div => {
        // KarmaFieldsAlpha.registerStickyModal({
        //   modal: div.element,
        //   tableBody: div.element.parentNode.parentNode,
        //   table: div.element.parentNode.parentNode.parentNode
        // });
      },
      update: async div => {

        // const sticky = this.parent.id !== "popup";
        // console.log(this.getFocus());

        const selection = await this.getSelection();

        div.children = [...this.createChild({
          ...this.resource.modal,
          type: "modal"
        }, "*").build(selection)];




        div.element.classList.remove("sticky-modal");
        if (this.parent.id !== "popup") {
          const focus = await this.getFocus();
          if (focus && !focus.includes("popup")) { // -> opening popup in sticky container seems to be bugged
            div.element.style.height = `${this.request("getModalHeight", div.element)}px`;
            div.element.style.top = `${this.request("getModalTop", div.element)}px`;
            div.element.classList.add("sticky-modal");
          }
        }

        div.element.classList.toggle("hidden", !this.resource.modal);
        if (this.resource.modal) {
          div.element.style.width = this.resource.modal.width || "30em";
          div.element.onmousedown = async event => {
            event.stopPropagation(); // -> prevent unselecting

            await this.setFocus(true);
            await this.request("render");
          };
          const hasSelection = await this.hasSelection();
          div.element.classList.toggle("active", Boolean(hasSelection));
        }
      }
    };

  }

  buildBody() {

    return {
      class: "karma-field-table-grid-container karma-field-frame karma-field-group final scroll-container table-body-column table-body-main-column",
      init: node => {
        if (this.resource.height) {
          node.element.style.minHeight = this.resource.height;
        }
        if (this.resource.style) {
          node.element.style = this.resource.style;
        }
        if (this.resource.width) {
          node.element.style.width = this.resource.width;
        }
        if (this.resource.class) {
          node.element.classList.add(this.resource.class);
        }
      },
      child: {
        class: "table grid grid-field-body",
        // children: [...this.buildRows()],
        update: async grid => {

          const length = await this.getLength();
          const offset = await this.request("getIndexOffset") || 0;
          const selection = await this.getSelection();

          if (!length.loading) {

            grid.children = [...this.buildRows(length, offset, selection)];

          }



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

          // let selection = this.getSelection();



          if (this.resource.sortable) {

            const sorter = new KarmaFieldsAlpha.ListSortGrid(grid.element, selection, this.resource.children.length, this.hasHeader() ? 1 : 0);

            sorter.onSelect = elements => {
              elements.map(element => element.classList.add("selected"));
              this.setSelection(sorter.state.selection);
            }

            sorter.onUnselect = elements => {
              elements.map(element => element.classList.remove("selected"));
            }

            sorter.onSelectionComplete = async () => {
              await this.setFocus(1);
              await this.request("render");
            }

            sorter.onSwap = async (newState, lastState) => {
              await this.save("sort", "Sort");
              await this.request("swap", lastState.selection.index, newState.selection.index, newState.selection.length);
              await this.setSelection(newState.selection);
            };

            sorter.onSort = async (index, target, length) => {
              await this.setFocus(1);
              await this.request("render");
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

            selector.onSelectionComplete = async () => {
              await this.setFocus(true);
              await this.request("render");
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

        this.indexOffset = this.parent.getIndexOffset && this.parent.getIndexOffset(); // promise !

        div.element.classList.toggle("stretch-columns", this.parent.id === "popup");
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
          a.element.onclick = async event => {
            event.preventDefault();
            if (this.activeColumn) {
              await this.setValue(this.order === "asc" ? "desc" : "asc", "order");
              await this.render();
            } else {
              await this.setValue(this.resource.order || "asc", "order");
              await this.setValue(this.resource.orderby || this.resource.key, "orderby");
              await this.render();
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

    return this.parent.setValueAt(value, this.id, key);

  }

  async getIndex() {

    const indexOffset = await this.parent.indexOffset || 0;

    return new KarmaFieldsAlpha.Content(indexOffset.toNumber() + (this.resource.index || 0));

  }

}

KarmaFieldsAlpha.field.grid.modal = class extends KarmaFieldsAlpha.field.grid.row {

  *build(selection) {

    // if (this.parent.hasSelection()) {
    if (selection && selection.length) {

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
  async getContent() {
    const index = await this.parent.getIndex();
    return new KarmaFieldsAlpha.Content(index.toNumber() + 1);
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
