
KarmaFieldsAlpha.field.tableGrid = class extends KarmaFieldsAlpha.field.table {

  async request(subject, content, ...path) {

    switch (subject) {

      case "export-cells":
        return this.exportCells(content.rectangle);

      case "import-cells":
        await this.importCells(content.data, content.rectangle);
        break;

      default:
        return super.request(subject, content, ...path);

    }

  }

  isModalOpen() {
    return Boolean(this.resource.modal && (this.resource.modal.keepAlive || this.interface.selectionBuffer.get()));
  }

  async exportCells(rectangle) {

    const data = [];
    const colIndexes = this.getColumns();
    const ids = this.getIds();

    const selectedIds = ids.slice(rectangle.y, rectangle.y + rectangle.height);
    const selectedCols = colIndexes.slice(rectangle.x, rectangle.x + rectangle.width);

    for (let id of selectedIds) {

      const rowField = this.interface.createChild({
        ...this.resource.children,
        key: id,
        type: "row"
      }, id);

      const cols = [];

      for (let index of selectedCols) {

        const field = rowField.createChild(this.resource.children[index], index.toString());
        const value = await field.exportValue();
        cols.push(value || "");

      }

      data.push(cols);

    }

    return data;
  }

  // -> cell selection
  async importCells(data, rectangle) {

    const colIndexes = this.getColumns();
    const ids = this.getIds();

    const selectedIds = ids.slice(rectangle.y, rectangle.y + rectangle.height);
    const selectedCols = colIndexes.slice(rectangle.x, rectangle.x + rectangle.width);

    for (let j = 0; j < selectedIds.length; j++) {

      const id = selectedIds[j];
      const row = data[j%data.length];

      const rowField = this.interface.createChild({
        ...this.resource.children,
        key: id,
        type: "row"
      }, id);

      for (let i = 0; i < selectedCols.length; i++) {

        const index = selectedCols[i];
        const cell = row[i%row.length];

        const field = rowField.createChild(this.resource.children[index], index.toString());
        await field.importValue(cell);

      }

    }

  }

  // buildContent() {
  //
  //   return {
  //     class: "table grid",
  //     init: async grid => {
  //       if (this.resource.style) {
  //         grid.element.style = this.resource.style;
  //       }
  //     },
  //     update: async grid => {
  //
  //       let ids = this.getIds();
  //       const page = this.getPage();
  //       const ppp = this.getPpp();
  //       const offset = (page - 1)*ppp;
  //       const columns = this.getColumns();
  //
  //       this.clipboard.onInput = dataArray => {
  //         const data = KarmaFieldsAlpha.Clipboard.toJson(dataArray);
  //         this.parent.request("import", {data: data});
  //       }
  //
  //       this.cellClipboard.onInput = async dataArray => {
  //         if (this.cellSelection) {
  //           KarmaFieldsAlpha.History.save();
  //           await this.importCells(dataArray, this.cellSelection);
  //           await this.render();
  //         }
  //       }
  //
  //       this.clipboard.ta.onfocus = event => {
  //         grid.element.classList.add("ta-focus");
  //       }
  //
  //       this.clipboard.ta.onblur = event => {
  //         grid.element.classList.remove("ta-focus");
  //       }
  //
  //       this.cellClipboard.ta.onblur = event => {
  //         if (this.cellSelection) {
  //           const cellManager = new KarmaFieldsAlpha.CellManager(grid.element, columns.length, ids.length, 0, 1);
  //           cellManager.selection = this.cellSelection;
  //           cellManager.unselect();
  //         }
  //       }
  //
  //       const selection = this.selectionBuffer.get() || {};
  //
  //       if (ids.length) {
  //         grid.element.classList.add("filled"); // -> draw table borders
  //         grid.children = [
  //           ...columns.map((colId, colIndex) => {
  //             const child = this.resource.children[colId];
  //             return {
  //               class: "th table-header-cell",
  //               init: th => {
  //                 if (child.style) {
  //                   th.element.style = child.style;
  //                 }
  //                 th.element.tabIndex = -1;
  //               },
  //               update: th => {
  //                 th.children = [
  //                   {
  //                     tag: "a",
  //                     class: "header-cell-title",
  //                     init: a => {
  //                       a.element.textContent = child.label;
  //                     }
  //                   },
  //                   {
  //                     tag: "a",
  //                     class: "header-cell-order",
  //                     child: {
  //                       tag: "span",
  //                       class: "dashicons",
  //                       update: span => {
  //                         const order = KarmaFieldsAlpha.Nav.get("order") || this.params.order;
  //                         const orderby = KarmaFieldsAlpha.Nav.get("orderby") || this.params.orderby;
  //                         const isAsc = orderby === (child.orderby || child.key) && order === "asc";
  //                         const isDesc = orderby === (child.orderby || child.key) && order === "desc";
  //                         span.element.classList.toggle("dashicons-arrow-up", isAsc);
  //                         span.element.classList.toggle("dashicons-arrow-down", isDesc);
  //                         span.element.classList.toggle("dashicons-leftright", !isAsc && !isDesc);
  //                       }
  //                     },
  //                     update: a => {
  //                       a.element.classList.toggle("hidden", !child.sortable);
  //                       if (child.sortable) {
  //                         a.element.onclick = async event => {
  //                           event.preventDefault();
  //                           a.element.parentNode.classList.add("loading");
  //                           KarmaFieldsAlpha.History.save();
  //                           this.toggleOrder(this.resource.orderby || this.resource.key, this.resource.order);
  //                           this.interface.selectionBuffer.change(null);
  //                           await this.queryIds();
  //                           await this.render();
  //                           a.element.parentNode.classList.remove("loading");
  //                         };
  //                       }
  //                     }
  //                   }
  //                 ];
  //                 if (child.sortable) {
  //                   th.children.push(this.createChild({
  //                     type: "sorter",
  //                     id: "sorter-"+(child.orderby || child.key),
  //                     key: child.orderby || child.key,
  //                     order: child.order
  //                   }).build());
  //                 }
  //
  //                 th.element.onmousedown = async event => {
  //                   if (event.buttons === 1) {
  //                     const cellManager = new KarmaFieldsAlpha.CellManager(grid.element, columns.length, ids.length, 0, 1);
  //                     cellManager.selection = this.cellSelection;
  //                     cellManager.onSelect = async selection => {
  //                       this.cellSelection = selection;
  //                       const dataArray = await this.exportCells(selection);
  //                       this.cellClipboard.setData(dataArray);
  //                       this.cellClipboard.focus();
  //                     };
  //                     cellManager.selectHeaders(event, colIndex);
  //                   }
  //                 }
  //
  //               }
  //             };
  //           }),
  //           ...ids.reduce((children, id, rowIndex) => {
  //
  //             const row = this.createChild({
  //               key: id,
  //               type: "row",
  //               children: this.resource.children || []
  //             }, id.toString());
  //
  //             row.index = offset + rowIndex + 1;
  //             row.isSelected = KarmaFieldsAlpha.Segment.contain(selection, rowIndex);
  //             row.rowIndex = rowIndex;
  //
  //             const isSelected = KarmaFieldsAlpha.Segment.contain(selection, rowIndex);
  //
  //             return [
  //               ...children,
  //               ...columns.map((colId, colIndex) => {
  //                 const child = this.resource.children[colId];
  //                 const field = row.createChild(child, colId.toString());
  //
  //                 return {
  //                   class: "td table-cell",
  //                   init: td => {
  //                     if (child.style) {
  //                       td.element.style = child.style;
  //                     }
  //                     td.element.tabIndex = -1;
  //                   },
  //                   update: td => {
  //
  //                     td.element.classList.toggle("selected", isSelected);
  //
  //                     td.element.onmousedown = async event => {
  //
  //                       if (event.buttons === 1) {
  //
  //                         const cellManager = new KarmaFieldsAlpha.CellManager(td.element.parentNode, columns.length, ids.length, 0, 1);
  //                         const selectionManager = new KarmaFieldsAlpha.SelectionManager(td.element.parentNode, columns.length, ids.length, 0, 1);
  //
  //                         cellManager.selection = this.cellSelection;
  //                         selectionManager.selection = this.selectionBuffer.get();
  //
  //                         if (field.selectMode !== "row") {
  //
  //                           cellManager.onSelect = async selection => {
  //                             this.cellSelection = selection;
  //                             const dataArray = await this.exportCells(selection);
  //                             this.cellClipboard.setData(dataArray);
  //                             this.cellClipboard.focus();
  //                           };
  //
  //                           cellManager.selectCells(event, colIndex, rowIndex);
  //
  //                         } else {
  //
  //                           cellManager.clear();
  //
  //                           selectionManager.onSelect = async selection => {
  //                             KarmaFieldsAlpha.History.save();
  //                             this.selectionBuffer.change(selection);
  //                             const data = await this.export();
  //                             this.clipboard.setJson(data);
  //                             this.clipboard.focus();
  //                             await this.render();
  //                           };
  //
  //                           selectionManager.select(event, colIndex, rowIndex);
  //
  //                         }
  //
  //                       }
  //
  //                     }
  //
  //                   },
  //                   child: field.build()
  //                 };
  //               })
  //             ];
  //           }, [])
  //         ];
  //
  //         grid.element.style.gridTemplateColumns = columns.map(index => this.resource.children[index].width || "auto").join(" ");
  //
  //       } else {
  //         grid.children = [];
  //         grid.element.classList.remove("filled");
  //       }
  //     },
  //     complete: async grid => {
  //       if (document.activeElement === document.body && this.getSelection()) {
  //         const data = await this.parent.request("export");
  //         this.clipboard.setJson(data);
  //       }
  //     }
  //   };
  // }


  static interface = class extends KarmaFieldsAlpha.field.table.interface {

    constructor(...args) {
      super(...args);

      this.clipboard = new KarmaFieldsAlpha.Clipboard();
      this.cellClipboard = new KarmaFieldsAlpha.Clipboard();

      this.selectionBuffer = new KarmaFieldsAlpha.Buffer("state", this.resource.context, "selection");

    }

    async release() {
      const selection = this.selectionBuffer.get();

      if (selection) {
        KarmaFieldsAlpha.History.save();
        this.selectionBuffer.change(null);
        await this.parent.request("render");
      }
    }

    build() {

      return {
        class: "table grid",
        init: async grid => {
          if (this.resource.style) {
            grid.element.style = this.resource.style;
          }
        },
        update: async grid => {

          // let ids = this.getIds();
          // const page = this.getPage();
          // const ppp = this.getPpp();
          // const offset = (page - 1)*ppp;
          // const columns = this.getColumns();

          const ids = await this.parent.request("ids");
          const page = await this.parent.request("page");
          const ppp = await this.parent.request("ppp");
          const offset = (page - 1)*ppp;
          const columns = await this.parent.request("columns");

          this.clipboard.onInput = dataArray => {
            const data = KarmaFieldsAlpha.Clipboard.toJson(dataArray);
            this.parent.request("import", {data: data});
          }

          this.cellClipboard.onInput = async dataArray => {

            if (this.cellSelection) {
              KarmaFieldsAlpha.History.save();
              // await this.importCells(dataArray, this.cellSelection);
              await this.parent.request("import-cells", {data: dataArray, rectangle: this.cellSelection});
              await this.parent.request("render");
            }
          }

          this.clipboard.ta.onfocus = event => {
            grid.element.classList.add("ta-focus");
          }

          this.clipboard.ta.onblur = event => {
            grid.element.classList.remove("ta-focus");
          }

          this.cellClipboard.ta.onblur = event => {
            if (this.cellSelection) {
              const cellManager = new KarmaFieldsAlpha.CellManager(grid.element, columns.length, ids.length, 0, 1);
              cellManager.selection = this.cellSelection;
              cellManager.clear();
            }
          }

          const selection = this.selectionBuffer.get();

          if (ids.length) {
            grid.element.classList.add("filled"); // -> draw table borders
            grid.children = [
              ...columns.map((colId, colIndex) => {
                const child = this.resource.children[colId];
                return {
                  class: "th table-header-cell",
                  init: th => {
                    if (child.style) {
                      th.element.style = child.style;
                    }
                    th.element.tabIndex = -1;
                  },
                  update: th => {
                    th.children = [
                      {
                        tag: "a",
                        class: "header-cell-title",
                        init: a => {
                          a.element.textContent = child.label;
                        }
                      },
                      {
                        tag: "a",
                        class: "header-cell-order",
                        child: {
                          tag: "span",
                          class: "dashicons",
                          update: async span => {
                            const order = await this.parent.request("order");
                            const orderby = await this.parent.request("orderby");
                            const isAsc = orderby === (child.orderby || child.key) && order === "asc";
                            const isDesc = orderby === (child.orderby || child.key) && order === "desc";
                            span.element.classList.toggle("dashicons-arrow-up", isAsc);
                            span.element.classList.toggle("dashicons-arrow-down", isDesc);
                            span.element.classList.toggle("dashicons-leftright", !isAsc && !isDesc);
                          }
                        },
                        update: a => {
                          a.element.classList.toggle("hidden", !child.sortable);
                          if (child.sortable) {
                            a.element.onmousedown = event => {
                              event.stopPropagation(); // -> prevent header selection
                            }
                            a.element.onclick = async event => {
                              event.preventDefault();
                              a.element.parentNode.classList.add("loading");
                              // KarmaFieldsAlpha.History.save();

                              await this.parent.request("toggle-order", {key: child.orderby || child.key, order: child.order});
                              // this.toggleOrder(child.orderby || child.key, child.order);
                              // this.selectionBuffer.change(null);
                              // await this.queryIds();
                              // await this.parent.request("query-ids");
                              // await this.parent.request("render");
                              a.element.parentNode.classList.remove("loading");
                            };
                          }
                        }
                      }
                    ];

                    th.element.onmousedown = async event => {
                      if (event.buttons === 1) {
                        const cellManager = new KarmaFieldsAlpha.CellManager(grid.element, columns.length, ids.length, 0, 1);
                        cellManager.selection = this.cellSelection;
                        cellManager.onSelect = async selection => {
                          this.cellSelection = selection;
                          // const dataArray = await this.exportCells(selection);
                          const dataArray = await this.parent.request("export-cells", {rectangle: selection});
                          this.cellClipboard.setData(dataArray);
                          this.cellClipboard.focus();
                        };
                        cellManager.selectHeaders(event, colIndex);
                      }
                    }

                  }
                };
              }),
              ...ids.reduce((children, id, rowIndex) => {

                const row = this.createChild({
                  key: id,
                  type: "row",
                  children: this.resource.children || []
                }, id.toString());

                const isSelected = selection && KarmaFieldsAlpha.Segment.contain(selection, rowIndex);

                row.index = offset + rowIndex + 1;
                row.isSelected = isSelected;
                row.rowIndex = rowIndex;

                return [
                  ...children,
                  ...columns.map((colId, colIndex) => {
                    const child = this.resource.children[colId];
                    const field = row.createChild(child, colId.toString());

                    return {
                      class: "td table-cell",
                      init: td => {
                        if (child.style) {
                          td.element.style = child.style;
                        }
                        td.element.tabIndex = -1;
                      },
                      update: td => {

                        td.element.classList.add("loading");

                        td.element.classList.toggle("selected", Boolean(isSelected));

                        td.element.onmousedown = async event => {

                          if (event.buttons === 1) {

                            const cellManager = new KarmaFieldsAlpha.CellManager(grid.element, columns.length, ids.length, 0, 1);
                            const selectionManager = new KarmaFieldsAlpha.SelectionManager(grid.element, columns.length, ids.length, 0, 1);

                            cellManager.selection = this.cellSelection;
                            selectionManager.selection = this.selectionBuffer.get();

                            if (field.selectMode !== "row") {

                              cellManager.onSelect = async selection => {
                                this.cellSelection = selection;

                                // const dataArray = await this.exportCells(selection);
                                const dataArray = await this.parent.request("export-cells", {rectangle: selection});
                                this.cellClipboard.setData(dataArray);
                                this.cellClipboard.focus();
                              };

                              cellManager.selectCells(event, colIndex, rowIndex);

                            } else {

                              cellManager.clear();

                              selectionManager.onSelect = async (selection, hasChange) => {
                                if (hasChange) {
                                  KarmaFieldsAlpha.History.save();
                                  this.selectionBuffer.change(selection);
                                }

                                // const data = await this.export();
                                const data = await this.parent.request("export");
                                this.clipboard.setJson(data);
                                this.clipboard.focus();
                                await this.parent.request("render");
                              };

                              selectionManager.select(event, colIndex, rowIndex);

                            }

                          }

                        }

                      },
                      complete: td => {
                        td.element.classList.remove("loading");
                      },
                      child: field.build()
                    };
                  })
                ];
              }, [])
            ];

            grid.element.style.gridTemplateColumns = columns.map(index => this.resource.children[index].width || "auto").join(" ");

          } else {
            grid.children = [];
            grid.element.classList.remove("filled");
          }
        },
        complete: async grid => {
          if (document.activeElement === document.body && this.getSelection()) {
            const data = await this.parent.request("export");
            this.clipboard.setJson(data);
          }
        }
      };
    }



    static row = class extends KarmaFieldsAlpha.field.group {

      // async export(keys = [], indexes = []) { // indexes are a colIds
      //
      //   let row = {};
      //
      //   if (indexes.length) {
      //
      //     for (let index of indexes) {
      //
      //       const field = this.createChild(this.resource.children[index], index.toString());
      //       const values = await field.export();
      //       row = {...row, ...values};
      //
      //     }
      //
      //   } else {
      //
      //     for (let index in this.resource.children) {
      //
      //       const field = this.createChild(this.resource.children[index], index.toString());
      //       const values = await field.export(keys);
      //       row = {...row, ...values};
      //
      //     }
      //
      //   }
      //
      //   return row;
      //
      // }

      // async export(keys = []) { // indexes are a colIds
      //
      //   let row = {};
      //
      //   for (let index in this.resource.children) {
      //
      //     const field = this.createChild(this.resource.children[index], index.toString());
      //     const values = await field.export(keys);
      //     row = {...row, ...values};
      //
      //   }
      //
      //   return row;
      //
      // }
      //
      // async import(object) {
      //
      //   for (let index in this.resource.children) {
      //
      //     const field = this.createChild(this.resource.children[index], index.toString());
      //     await field.import(object);
      //
      //   }
      //
      // }

      // -> extends group instead.

      async request(subject, content, ...path) {

        switch (subject) {

          case "index":
            return this.index;

          default:
            return super.request(subject, content, ...path); // -> extends group
        }

      }

      static modalHandle = class extends KarmaFieldsAlpha.field {

        constructor(...args) {
          super(...args);

          this.selectMode = "row";
          this.openModal = true;
        }

        build() {
          return {
            tag: this.resource.tag,
            class: "text karma-field modal-btn",
            init: node => {
              // node.element.tabIndex = -1;
            },
            update: async node => {
              node.element.innerHTML = await this.parse(this.resource.value || "");
            }
          };
        }

      }

      static tableIndex = class extends this.modalHandle {

        constructor(resource) {
          super({
            width: "40px",
            ...resource
          });

          this.openModal = false;

        }

        build() {
          return {
            class: "karma-field text",
            update: async container => {
              container.element.textContent = await this.parent.request("index");
            }
          };
        }

      }


    }


  }

}
