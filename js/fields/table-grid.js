
KarmaFieldsAlpha.fields.tableGrid = class extends KarmaFieldsAlpha.fields.table {

  static interface = class extends KarmaFieldsAlpha.fields.table.interface {

    constructor(...args) {
      super(...args);

      // this.cellSelector = new KarmaFieldsAlpha.CellSelector();
      // this.idSelector = new KarmaFieldsAlpha.IdSelector();

      this.clipboard = new KarmaFieldsAlpha.Clipboard();
      this.cellClipboard = new KarmaFieldsAlpha.Clipboard();

      this.selectionBuffer = new KarmaFieldsAlpha.Buffer("state", this.resource.context, "selection");

    }

    // refocus() {
    //
    //   if (!this.parent.parent.resource.modal) { // => no modal -> click to background to unselect all
    //
    //     const ids = this.selectionBuffer.get() || [];
    //
    //     if (ids.length) {
    //       this.selectionBuffer.backup();
    //       this.selectionBuffer.remove();
    //
    //     }
    //
    //
    //   }
    //
    //   this.dispatch({action: "render"});
    //
    //
    // }


    // select(ids) {
    //
    //   const currentIds = this.selectionBuffer.get() || [];
    //
    //   if (KarmaFieldsAlpha.DeepObject.differ(ids, currentIds)) {
    //
    //     // KarmaFieldsAlpha.History.save();
    //
    //     this.selectionBuffer.backup(ids);
    //     this.selectionBuffer.set(ids);
    //
    //     this.idSelector.unselectIds(ids);
    //   }
    //
    // }
    //

    // -> rows
    // async exportData(segment) {
    //
    //   const data = [];
    //   const ids = await this.request("ids", "array");
    //   const columns = await this.request("columns", "array");
    //
    //   for (let j = 0; j < rectangle.height; j++) {
    //
    //     const id = ids[rectangle.y + j];
    //     const rowField = this.getChild(id); // !!! may colid with modal !!!
    //     const row = [];
    //
    //     for (let i = 0; i < rectangle.width; i++) {
    //
    //       const colId = columns[rectangle.x + i]; // (colId = index of the column in resource)
    //       const field = rowField.getChild(colId);
    //       const value = await field.exportValue();
    //
    //       row.push(value);
    //
    //     }
    //
    //     data.push(row);
    //
    //   }
    //
    //   return data;
    // }



    // -> cell selection
    async exportCellData(rectangle) {

      const data = [];
      const ids = await this.request("ids", "array");
      const columns = await this.request("columns", "array");

      for (let j = 0; j < rectangle.height; j++) {

        const id = ids[rectangle.y + j];
        const rowField = this.getChild(id); // !!! may colid with modal !!!
        const row = [];

        for (let i = 0; i < rectangle.width; i++) {

          const colId = columns[rectangle.x + i]; // (colId = index of the column in resource)
          const field = rowField.getChild(colId);
          const value = await field.exportValue();

          row.push(value);

        }

        data.push(row);

      }

      return data;
    }

    // -> cell selection
    async importCellData(data, rectangle) {

      // const ids = await this.request("ids", "array");
      // const columns = await this.request("columns", "array");
      //
      // for (let j = 0; j < Math.max(rectangle.height, data.length); j++) {
      //
      //   const id = ids[rectangle.y + j];
      //   const rowField = this.getChild(id); // !!! may colid with modal !!!
      //
      //   for (let i = 0; i < Math.max(rectangle.width, data[j%data.length].length); i++) {
      //
      //     const colId = columns[rectangle.x + i]; // (colId = index of the column in resource)
      //     const field = rowField.getChild(colId);
      //
      //     const value = data[j%data.length][i%data[j%data.length].length];
      //
      //     await field.importValue(value);
      //   }
      //
      // }

      const ids = await this.request("ids", "array");
      const columns = await this.request("columns", "array");

      for (let j = 0; j < rectangle.height; j++) {

        const id = ids[rectangle.y + j];
        const rowField = this.getChild(id); // !!! may colid with modal !!!
        const rowValue = data[j%data.length];

        for (let i = 0; i < rectangle.width; i++) {

          const colId = columns[rectangle.x + i]; // (colId = index of the column in resource)
          const field = rowField.getChild(colId);
          const value = rowValue && rowValue[i%rowValue.length] || null;

          await field.importValue(value);
        }

      }

    }


    async updateSelection(index, length) {

      const selection = this.selectionBuffer.get() || {};
      const segment = new KarmaFieldsAlpha.Segment(index, length);

      if (!segment.equals(selection.index, selection.length)) {

        KarmaFieldsAlpha.History.save();

        this.select(index, length);

        const request = await this.dispatch({
          action: "rows",
          index: index,
          length: length
        });

        this.clipboard.setData(request.data);

        // await this.dispatch({action: "edit-selection"});
        await this.dispatch({action: "render"});

      } else {

        this.clipboard.focus();

      }
    }



    build(ids, page, ppp) {

      const offset = (Number(page) - 1)* Number(ppp);

      return {
        class: "table grid",
        init: async grid => {

          if (this.resource.style) {
            grid.element.style = this.resource.style;
          }

          // this.cellSelector.onSelectionStart = () => {
          //   grid.element.classList.remove("select-mode-row");
          //   grid.element.classList.add("select-mode-cell");
          //   this.selectMode === "cell";
          // }
          // this.cellSelector.onSelect = manager => {
          //   manager.getSelectedItems().forEach(item => {
          //     item.element.classList.add("selected-cell");
          //   });
          // }
          // this.cellSelector.onUnselect = manager => {
          //   manager.getSelectedItems().forEach(item => {
          //     item.element.classList.remove("selected-cell");
          //   });
          // }
          // this.cellSelector.onCellSelectionComplete = async rectangle => {
          //   if (rectangle && rectangle.width*rectangle.height > 1) {
          //     const dataArray = await this.exportCellData(rectangle);
          //     this.cellClipboard.setData(dataArray); // + set focus
          //   }
          // }

          // this.idSelector.onSelectionStart = () => {
          //   grid.element.classList.add("select-mode-row");
          //   grid.element.classList.remove("select-mode-cell");
          //   this.selectMode === "id";
          // }
          // this.idSelector.onSelect = manager => {
          //   manager.getSelectedItems().forEach(item => {
          //     item.cells.forEach(cell => {
          //       cell.element.classList.add("selected-row");
          //     });
          //   });
          // }
          // this.idSelector.onUnselect = manager => {
          //   manager.getSelectedItems().forEach(item => {
          //     item.cells.forEach(cell => {
          //       cell.element.classList.remove("selected-row");
          //     });
          //   });
          // }
          // this.idSelector.onSelectionComplete = async selection => {
          //   // const ids = manager.getSelectedItems().map(item => item.id);
          //   // const selectedIds = this.selectionBuffer.get() || [];
          //   // if (KarmaFieldsAlpha.DeepObject.differ(ids, selectedIds)) {
          //   //   KarmaFieldsAlpha.History.save();
          //   //   this.selectionBuffer.backup(ids);
          //   //   this.selectionBuffer.set(ids);
          //   // }
          //
          //   const currentSelection = this.selectionBuffer.get() || [];
          //
          //   if (!KarmaFieldsAlpha.Segment.equals(currentSelection, selection)) {
          //     KarmaFieldsAlpha.History.save();
          //     this.selectionBuffer.backup(selection);
          //     this.selectionBuffer.set(selection);
          //
          //   }
          //
          //   const request = await this.dispatch({
          //     action: "rows",
          //     index: selection.index,
          //     length: selection.length
          //   });
          //
          //   this.clipboard.setData(request.data);
          //   this.idSelector.updateSelection(selection, currentSelection);
          //
          //
          //
          //   await this.dispatch({action: "edit-selection"});
          // }

        },
        update: async grid => {

          // this.idSelector.reset();
          // this.cellSelector.reset();

          // this.idSelector.width = columns.length;
          // this.idSelector.height = ids.length;

          const columns = await this.request("columns", "array");


          // KarmaFieldsAlpha.Clipboard.onInput = dataArray => {
          this.clipboard.onInput = dataArray => {
            const data = KarmaFieldsAlpha.Clipboard.toJson(dataArray);
            const selection = this.selectionBuffer.get();
            if (selection) {
              this.dispatch({
                action: "write",
                data: data,
                index: selection.index,
                length: selection.length
              });
            }
          }

          this.cellClipboard.onInput = async dataArray => {
            if (this.cellSelection) {
              // if (!dataArray.length) {
              //   dataArray = [[""]];
              // }

              KarmaFieldsAlpha.History.save();

              await this.importCellData(dataArray, this.cellSelection);
              await this.dispatch({
                action: "render"
              });
            }
          }

          // KarmaFieldsAlpha.Clipboard.ta.onfocus = event => {
          this.clipboard.ta.onfocus = event => {
            grid.element.classList.add("ta-focus");
          }
          // KarmaFieldsAlpha.Clipboard.ta.onblur = event => {
          this.clipboard.ta.onblur = event => {
            grid.element.classList.remove("ta-focus");
          }

          this.cellClipboard.ta.onblur = event => {

            // if (this.cellSelection) {
            //
            //   KarmaFieldsAlpha.CellSelector.updateSelection(grid.element, columns.length, ids.length, this.cellSelection);
            //
            // }

            if (this.cellSelection) {

              // KarmaFieldsAlpha.CellSelector.update(elements, columns.length, ids.length, this.cellSelection);

              this.cellSelection.kill();
              // this.cellSelection = null;

            }

          }

          const selection = this.selectionBuffer.get() || {};

          // this.idIndex = new Map(); // used for table indexes

          // const selectedIds = this.selectionBuffer.get() || [];

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
                    ];
                    if (child.sortable) {

                      th.children.push(this.createChild({
                        type: "sorter",
                        id: "sorter-"+(child.orderby || child.key),
                        key: child.orderby || child.key,
                        order: child.order
                      }).build());

                    }
                    // this.registerHeader(th.element, colIndex, "data");
                    // this.cellSelector.registerHeader(colIndex, th.element);

                    th.element.onmousedown = async event => {

                      this.cellSelection = new KarmaFieldsAlpha.CellSelection(event, grid.element, [...grid.element.children], columns.length, ids.length, colIndex, 0, this.cellSelection);

                      if (this.cellSelection.getArea() > 1) {

                        const dataArray = await this.exportCellData(this.cellSelection);
                        this.cellClipboard.setData(dataArray); // + set focus

                      }

                      // this.cellSelection = rectangle;


                      // KarmaFieldsAlpha.CellSelector.clear(grid.element);

                      // if (true /* field.selectMode !== "row" */) {
                      //
                      //   // const rectangle = await KarmaFieldsAlpha.CellSelector.selectHeaders(event, grid.element, [...grid.element.children], columns.length, ids.length, colIndex, rowIndex, this.cellSelection);
                      //   //
                      //   // if (rectangle && rectangle.width*rectangle.height > 1) {
                      //   //
                      //   //   const dataArray = await this.exportCellData(rectangle);
                      //   //   this.cellClipboard.setData(dataArray); // + set focus
                      //   //
                      //   // }
                      //   //
                      //   // this.cellSelection = rectangle;
                      //
                      // } else {
                      //
                      //   // select all rows ?
                      //
                      // }

                    }


                  }
                }
              }),
              ...ids.reduce((children, id, rowIndex) => {

                const row = this.createChild({
                  key: id,
                  type: "row",
                  children: this.resource.children || []
                }, id.toString());

                row.index = offset + rowIndex + 1;

                // this.idIndex.set(id, offset + rowIndex + 1); // -> used for index

                // this.idSelector.registerItem(id, rowIndex);
                // this.cellSelector.registerCell(rowIndex, rowIndex);


                const isSelected = KarmaFieldsAlpha.Segment.contains(selection, rowIndex);

                return [
                  ...children,
                  ...columns.map((colId, colIndex) => {
                    const child = this.resource.children[colId];
                    const field = row.createChild({
                      ...child,
                      index: colIndex
                    }, colId.toString());

                    return {
                      class: "td table-cell",
                      init: td => {
                        if (child.style) {
                          td.element.style = child.style;
                        }
                        td.element.tabIndex = -1;
                      },
                      update: td => {
                        // td.element.classList.remove("selected-cell");
                        // td.element.classList.remove("selected-row");
                        // if (td.element.classList.contains("selecting")) {
                        //   console.log("cell marked selecting");
                        // }

                        // this.cellSelector.registerCell(td.element, colIndex, rowIndex, field, field.selectMode !== "row");
                        // this.idSelector.registerCell(rowIndex, td.element);



                        // this.idSelector.registerCell(rowIndex, td.element);
                        // this.cellSelector.registerCell(td.element, colIndex, rowIndex, field.selectMode !== "row");

                        td.element.classList.toggle("selected", isSelected);

                        td.element.onmousedown = async event => {

                          const bodyElements = [...grid.element.children].slice(columns.length);

                          if (event.buttons === 1) {

                            if (field.selectMode !== "row") {

                              this.cellSelection = new KarmaFieldsAlpha.CellSelection(event, grid.element, bodyElements, columns.length, ids.length, colIndex, rowIndex, this.cellSelection);

                              await this.cellSelection.select();

                              if (this.cellSelection.getArea() > 1) {

                                const dataArray = await this.exportCellData(this.cellSelection);
                                this.cellClipboard.setData(dataArray); // + set focus

                              }

                            } else {

                              if (this.cellSelection) {

                                this.cellSelection.kill();

                              }

                              const currentSelection = this.selectionBuffer.get() || {};

                              const newSelection = new KarmaFieldsAlpha.Selection(event, grid.element, bodyElements, columns.length, ids.length, colIndex, rowIndex, currentSelection);

                              await newSelection.select();

                              await this.updateSelection(newSelection.index, newSelection.length);

                              // if (!KarmaFieldsAlpha.Segment.equals(selection, newSelection)) {
                              //
                              //   KarmaFieldsAlpha.History.save();
                              //
                              //   this.selectionBuffer.backup(newSelection.index, "index");
                              //   this.selectionBuffer.backup(newSelection.length, "length");
                              //   this.selectionBuffer.set(newSelection.index, "index");
                              //   this.selectionBuffer.set(newSelection.length, "length");
                              //
                              //   const request = await this.dispatch({
                              //     action: "rows",
                              //     index: newSelection.index,
                              //     length: newSelection.length
                              //   });
                              //
                              //   this.clipboard.setData(request.data);
                              //
                              //   await this.dispatch({action: "edit-selection"});
                              //
                              // } else {
                              //
                              //   this.clipboard.focus();
                              //
                              // }

                            }

                          }

                        }

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
          // const selectedIds = this.selectionBuffer.get() || [];
          // const selection = this.idsSelector.createSelection(ids, selectedIds);
          const selection = this.selectionBuffer.get();

          // this.idSelector.updateSelection(selection);

          if (selection) {

            const request = await this.dispatch({
              action: "rows",
              index: selection.index,
              length: selection.length
            });

            this.clipboard.setData(request.data);
          }
        }
      };
    }

    async dispatch(event, parent) {

      switch (event.action) {

        case "set": {

          if (event.field.resource.type === "input" && event.pasted) {

            const value = KarmaFieldsAlpha.Type.toString(event.data);
            const data = value.split(/[\r\n]/).map(row => row.split("\t"));

            // if (data.length > 1 || data[0].length > 1) {

              await super.dispatch({
                action: "importselection",
                data: data,
                field: event.field
              });

              break;

            // }

          }

          await super.dispatch(event);

          break;
        }

        // case "index": {
        //   const [id] = event.path;
        //
        //   event.data = this.idIndex.get(id);
        //   break;
        // }

        // case "rows": {
        //   // const ids = this.selectionBuffer.get() || [];
        //   // const rows = [];
        //   //
        //   // for (let id of ids) {
        //   //
        //   //   const item = await this.dispatch({
        //   //     action: "row",
        //   //     path: [id]
        //   //   }).then(request => request.data);
        //   //
        //   //   rows.push(item);
        //   // }
        //   //
        //   // event.data = rows;
        //
        //   await super.dispatch({
        //     ...event,
        //     selection: this.selectionBuffer.get()
        //   });
        //
        //   break;
        // }

        default:
          await super.dispatch(event);
          break;

      }

      return event;
    }

    static sorter = class extends KarmaFieldsAlpha.fields.field {

      build() {
        return {
          tag: "a",
          class: "header-cell-order",
          child: {
            tag: "span",
            class: "dashicons",
            update: span => {
              const order = KarmaFieldsAlpha.Nav.get("order");
              const orderby = KarmaFieldsAlpha.Nav.get("orderby");
              const isAsc = orderby === (this.resource.orderby || this.resource.key) && order === "asc";
              const isDesc = orderby === (this.resource.orderby || this.resource.key) && order === "desc";
              span.element.classList.toggle("dashicons-arrow-up", isAsc);
              span.element.classList.toggle("dashicons-arrow-down", isDesc);
              span.element.classList.toggle("dashicons-leftright", !isAsc && !isDesc);
            }
          },
          update: a => {
            a.element.onclick = async event => {
              event.preventDefault();
              a.element.parentNode.classList.add("loading");

              await this.dispatch({
                action: "order",
                data: this.resource.orderby || this.resource.key,
                order: this.resource.order // -> default order
                // orderby: this.resource.orderby || this.resource.key
              });

              a.element.parentNode.classList.remove("loading");
            };
          }
        }
      }
    }

    static row = class extends KarmaFieldsAlpha.fields.field {


      async dispatch(event) {

        switch (event.action) {

          // case "get":
          //   if (event.path && event.path[event.path.length-1] === "id") {
          //     if (event.join) {
          //       await super.dispatch({
          //         action: "join",
          //         data: event.join,
          //         path: [...event.path]
          //       });
          //     }
          //     event.data = [this.resource.key];
          //     break;
          //   }
          //
          //   await super.dispatch(event);
          //   break;

          default:
            await super.dispatch(event);
            break;

        }




        return event;
      }

      static modalHandle = class extends KarmaFieldsAlpha.fields.field {

        constructor(...args) {
          super(...args);

          this.selectMode = "row";
          this.openModal = true;
        }

        build() {
          return {
            tag: this.resource.tag,
            class: "text karma-field modal-btn",
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
            update: container => {
              container.element.textContent = this.parent.index || "?";

              // container.element.textContent = await this.dispatch({
              //   action: "index"
              // }).then(request => request.data);
            }
          };
        }

      }

    }


  }

}
