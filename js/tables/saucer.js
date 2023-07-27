
KarmaFieldsAlpha.field.saucer = class extends KarmaFieldsAlpha.field {

  getGrid(tableId) {

    if (!tableId) {

      tableId = this.getTable();

    }

    if (tableId) {

      // return this.follow({[tableId]: {body: {final: true}}}, (field, selection) => field);

      const board = this.createChild({
        type: "board",
        tables: this.resource.tables,
        index: "board"
      });

      return board.getGrid(tableId);


      // const table = board.createChild({
      //   type: "table",
      //   ...this.resource.tables[tableId],
      //   index: tableId
      // });
      //
      // return table.createChild({
      //   ...table.resource.body,
      //   index: "body"
      // });

    }

  }

  getTableResource(tableId) {

    return this.resource.tables && this.resource.tables[tableId];

  }

  getData() {

    if (!KarmaFieldsAlpha.field.data) {

      KarmaFieldsAlpha.field.data = {};

    }

    // if (!KarmaFieldsAlpha.field.data[this.resource.index]) {
    //
    //   KarmaFieldsAlpha.field.data[this.resource.index] = {};
    //
    // }

    return KarmaFieldsAlpha.field.data;

  }

  getValue(key) {

    const param = KarmaFieldsAlpha.Store.getParam(key);

    return KarmaFieldsAlpha.Type.toArray(param);

  }

  setValue(value, key) {

    value = KarmaFieldsAlpha.Type.toString(value) || "";

    KarmaFieldsAlpha.Store.setParam(value, key);

    const page = KarmaFieldsAlpha.Store.getParam("page") || 1;

    if (key !== "page" && page !== 1) {

      KarmaFieldsAlpha.Store.setParam(1, "page");

    }

    KarmaFieldsAlpha.Store.removeIds();

    KarmaFieldsAlpha.Store.setSelection({});

    this.render();

  }

  getTable() {

    return KarmaFieldsAlpha.Store.getTable();

  }

  setTable(table) {

    KarmaFieldsAlpha.Store.setTable(table);

    KarmaFieldsAlpha.Store.removeParams();
    KarmaFieldsAlpha.Store.removeIds();
    KarmaFieldsAlpha.Store.setSelection({});

    // KarmaFieldsAlpha.Store.setSelection({
    //   board: {
    //     [table]: {
    //       body: {}
    //     }
    //   }
    // });
    //
    // KarmaFieldsAlpha.Store.setSelection({}, "board", table, "body");

    // const grid = this.getGrid(table);
    //
    // if (grid) {
    //
    //   grid.setSelection({});
    //
    // }

  }

  modified(...path) {

    return false;

  }

  save(name) {

    KarmaFieldsAlpha.Backup.save(name);

  }

  undo() {

    KarmaFieldsAlpha.History.undo();

    if (KarmaFieldsAlpha.History.useNative === false) {

      this.render();

    }

  }

  redo() {

    KarmaFieldsAlpha.History.redo();

    if (KarmaFieldsAlpha.History.useNative === false) {

      this.render();

    }

  }

  hasUndo() {
    return KarmaFieldsAlpha.History.hasUndo();
  }

  hasRedo() {
    return KarmaFieldsAlpha.History.hasRedo();
  }

  getSelection() {

    // const selection = KarmaFieldsAlpha.Store.getSelection();
    //
    // return selection[this.resource.index] || {};

    return KarmaFieldsAlpha.Store.getSelection();

  }

  setSelection(selection) {

    // selection = {[this.resource.index]: selection};

    Object.freeze(selection);

    KarmaFieldsAlpha.Backup.update(selection, "selection");
    KarmaFieldsAlpha.Store.set(selection, "selection");

  }

  hasSelection() { // = has grid selected

    // const selection = this.getSelection();
    // const table = this.getTable();
    //
    // return Boolean(table && selection && selection.board && selection.board[table] && selection.board[table].body);

    const selection = this.getSelection();

    return Boolean(selection);

  }

  follow(selection, callback) {

    if (!selection) {

      selection = this.getSelection();

    }

    if (selection) {

      if (selection.board) {

        const child = this.createChild({
          type: "board",
          tables: this.resource.tables,
          index: "board"
        });

        return child.follow(selection.board, callback);

      } else {

        // for (const resource of KarmaFieldsAlpha.Embed.map.values()) {
        for (const resource of KarmaFieldsAlpha.embeds) {

          if (selection[resource.index]) {

            const child = this.createChild(resource);

            return child.follow(selection[resource.index], callback);

          }

        }

      }

      // } else if (KarmaFieldsAlpha.embeds) {
      //
      //   for (let i = 0; i < KarmaFieldsAlpha.embeds.length; i++) {
      //
      //     if (selection[i]) {
      //
      //       return KarmaFieldsAlpha.embeds[i].follow(selection[i], callback);
      //
      //     }
      //
      //   }
      //
      // }

    }





    // if (!selection) {
    //
    //   selection = this.getSelection();
    //
    // }
    //
    // if (selection) {
    //
    //   if (selection.final) {
    //
    //     return callback(this, selection);
    //
    //   } else if (this.resource.tables) {
    //
    //     for (let i in this.resource.tables) {
    //
    //       if (selection[i]) {
    //
    //         const child = this.createChild({type: "table", ...this.resource.tables[i], index: i, uid: `${this.resource.uid}-${i}`});
    //
    //         return child.follow(selection[i], callback);
    //
    //       }
    //
    //     }
    //
    //   }
    //
    // }

  }

  getChild(index) {

    if (index === "board") {

      return this.createChild({
        type: "board",
        tables: this.resource.tables,
        index: "board"
      });

    } else {

      // for (const resource of KarmaFieldsAlpha.Embed.map.values()) {
      for (const resource of KarmaFieldsAlpha.embeds) {

        if (resource.index === index) {

          return this.createChild(resource);

        }

      }

    }

  }



  // getSelectedChildBETA(selection) {
  //
  //   if (!selection) {
  //
  //     selection = this.getSelection();
  //
  //   }
  //
  //   if (selection) {
  //
  //     if (selection.board) {
  //
  //       return this.createChild({
  //         type: "board",
  //         tables: this.resource.tables,
  //         index: "board"
  //       });
  //
  //     } else {
  //
  //       for (const resource of KarmaFieldsAlpha.Embed.map.values()) {
  //
  //         if (selection[resource.index]) {
  //
  //           return this.createChild(resource);
  //
  //         }
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

  selectAll() {

    this.follow(undefined, (field, selection) => {
      field.selectAll();
      this.render();
    });

  }



  paste(string) {

    const selection = this.getSelection();

    if (selection) {

      this.follow(selection, (field, selection) => {

        // field.import([string], selection.index, selection.length, selection.colIndex, selection.colLength);

        field.paste(string, selection);

        field.save("paste");

        this.render();

      });

    }

  }

  // pasteBETA(string, selection = this.getSelection()) {
  //
  //   if (selection) {
  //
  //     if (selection.board) {
  //
  //       const child = this.createChild({
  //         type: "board",
  //         tables: this.resource.tables,
  //         index: "board"
  //       });
  //
  //       child.paste(string, selection.board);
  //
  //     } else {
  //
  //       for (const resource of KarmaFieldsAlpha.Embed.map.values()) {
  //
  //         if (selection[resource.index]) {
  //
  //           const child = this.createChild(resource);
  //           child.paste(string, selection[resource.index]);
  //
  //         }
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

  copy() {

    const selection = this.getSelection() || {};

    return this.follow(selection, (field, selection) => {

      // return field.export([], selection.index, selection.length, selection.colIndex, selection.colLength);
      return field.copy(selection);

    });

  }

  add(params = {}) {

    const grid = this.getGrid();

    if (grid && grid.add) {

      grid.add(params);

      this.render();

    }

  }

  delete() {

    const selection = this.getSelection();

    if (selection) {

      this.follow(selection, (field, selection) => {

        // field.remove(selection.index, selection.length);

        field.delete(selection);

      });

    }

  }

  canDelete() {

    const grid = this.getGrid();

    return Boolean(grid && grid.hasSelection() && grid.remove);

  }


  send() {

    KarmaFieldsAlpha.Query.send();

    this.render();
  }

  submit() {

    this.send();
  }

  hasChange() {

    return !KarmaFieldsAlpha.DeepObject.include(KarmaFieldsAlpha.Query.vars, KarmaFieldsAlpha.Store.get("delta"));

  }

  hasTask() {

    return KarmaFieldsAlpha.tasks.length > 0;

  }

  open(table, params) {

    if (table) {

      const currentTable = KarmaFieldsAlpha.Store.getTable();

      if (currentTable) {

        this.addTransfer({
          selection: KarmaFieldsAlpha.Store.getSelection(),
          table: currentTable,
          params: KarmaFieldsAlpha.Store.getParams(),
          ids: KarmaFieldsAlpha.Store.getIds()
        });

      }

      KarmaFieldsAlpha.Store.setTable(table);

      const tableResource = this.getTableResource(table);

      if (tableResource && tableResource.body) {

        params = {...tableResource.body.params, ...params};

      }

    }

    if (params) {

      KarmaFieldsAlpha.Store.setParams(params);

    } else {

      KarmaFieldsAlpha.Store.removeParams();

    }

    KarmaFieldsAlpha.Store.removeIds();
    KarmaFieldsAlpha.Store.setSelection({});

    this.save("open");
    this.render();
  }

  close() {

    const transfer = this.shiftTransfer();

    if (transfer) {

      KarmaFieldsAlpha.Store.setTable(transfer.table);
      KarmaFieldsAlpha.Store.setParams(transfer.params);
      // this.setSelection(transfer.selection);
      KarmaFieldsAlpha.Store.setSelection(transfer.selection);


      KarmaFieldsAlpha.Store.setIds(transfer.ids);

    } else {

      this.setTable();

    }

    this.save("close");
    this.render();

  }

  getPage() {
    const page = KarmaFieldsAlpha.Store.getParam("page") || 1;

    return parseInt(page);
  }

  count() {

    const grid = this.getGrid();

    if (grid) {

      const driver = grid.resource.driver;
      const params = grid.getCountParams();

      if (params) {

        return KarmaFieldsAlpha.Query.getCount(driver, params);

      }

    }

  }

  ppp() {

    const grid = this.getGrid();

    if (grid) {

      const params = grid.getParams();

      return parseInt(params.ppp || 100);

    }

    return 1;
  }

  getNumPage() {

    const count = this.count();

    if (count !== undefined) {

      const ppp = this.ppp();

      return Math.max(1, Math.ceil(count/ppp));

    }

  }

  isFirstPage() {
    return this.getPage() === 1;
  }

  isLastPage() {
    return this.getPage() === this.getNumPage();
  }

  firstPage() {

    const page = this.getPage();

    if (page > 1) {

      this.setValue(1, "page");

    }

  }

  prevPage() {

    const page = this.getPage();

    if (page > 1) {

      this.setValue(page-1, "page");

    }

  }

  nextPage() {

    const page = this.getPage();
    const numPage = this.getNumPage();

    if (page < numPage) {

      this.setValue(page+1, "page");

    }

  }

  lastPage() {

    const page = this.getPage();
    const numPage = this.getNumPage();

    if (page < numPage) {

      this.setValue(numPage, "page");

    }

  }


  async render() {

    if (this.rendering) {

      return this.renderPromise;

    } else if (this.onRender) {

      // console.log("sauce render");

      this.renderPromise = this.onRender().then(() => this.rendering = false);

      this.rendering = true;

      return this.renderPromise;

    }

  }



  fetch(tableId, params, id) {

    if (this.resource.tables && this.resource.tables[tableId] && this.resource.tables[tableId].body) {

      this.addTransfer({
        // selection: this.getSelection(),
        selection: KarmaFieldsAlpha.Store.getSelection(),
        table: KarmaFieldsAlpha.Store.getTable(),
        params: KarmaFieldsAlpha.Store.getParams(),
        ids: KarmaFieldsAlpha.Store.getIds()
      });

      const grid = this.getGrid(tableId);

      if (grid) {

        grid.getData().id = id;

        KarmaFieldsAlpha.Store.setTable(tableId);

        KarmaFieldsAlpha.Store.setParams(params || {});
        KarmaFieldsAlpha.Store.removeIds();

        grid.setSelection({});

        grid.save("open");

        this.render();

      }

    }

  }

  addTransfer(transfer) {

    const transfers = KarmaFieldsAlpha.Store.getTransfers();

    KarmaFieldsAlpha.Store.setTransfers([transfer, ...transfers]);

  }


  shiftTransfer() {

    const transfers = KarmaFieldsAlpha.Store.getTransfers();

    if (transfers.length) {

      KarmaFieldsAlpha.Store.setTransfers(transfers.slice(1));

      return transfers[0];

    }

  }

  hasTransfer() {

    const transferts = KarmaFieldsAlpha.Store.getTransfers();

    return transferts.length > 0;

  }



  async insert() {

    const transfer = this.shiftTransfer();

    if (transfer) {

      // const currentSelection = this.getSelection();
      //
      // const ids = this.follow(currentSelection, field => field.getSelectedIds && field.getSelectedIds());

      const grid = this.getGrid();

      const ids = grid && grid.getSelectedIds();

      if (ids && ids.length) {

        KarmaFieldsAlpha.Store.setTable(transfer.table);
        KarmaFieldsAlpha.Store.setParams(transfer.params);
        // this.setSelection(transfer.selection);
        KarmaFieldsAlpha.Store.setSelection(transfer.selection);
        KarmaFieldsAlpha.Store.setIds(transfer.ids);



        this.follow(transfer.selection, (field, selection) => {
          field.insert && field.insert(ids, selection.index, selection.length)
          field.save("insert");
        });

        await this.render();

      }

    }

  }

  multiple() {

    return false;

  }


  isMediaTable(tableId) {

    return this.resource.tables[tableId] && this.resource.tables[tableId].body && this.resource.tables[tableId].body.type === "medias";
  }

  getMediaTable() {

    for (let tableId in this.resource.tables) {

      if (this.isMediaTable(tableId)) {

        return tableId;

      }

    }

  }

  async upload(files, index = 0, length = 0) {


    let tableId = this.getTable();

    if (!this.isMediaTable(tableId)) {

      tableId = this.getMediaTable();

      if (tableId) {

        this.setTable(tableId);

        await this.render();

      }


    }

    if (tableId) {

      let grid = this.getGrid(tableId);

      grid.upload(files);

    } else {

      console.warn("No medias table found to upload file");

    }


    //
    // if (tableId !== "files") {
    //
    //   this.setTable("files");
    //
    //   await this.render();
    //
    // }

    // const grid = this.getGrid("files");
    //
    // const selection = grid.getSelection() || {};
    //
    // grid.upload(files, selection.index || 0, length);

  }


  isTableRowSelected() {

    const grid = this.getGrid();

    const selection = grid.getSelection() || {};

    if (selection && selection.length) {

      return true;

    }

    return false;
  }


  // build() {
  //   return {
  //     class: "popup",
  //     init: container => {
  //
  //       document.addEventListener("keydown", event => {
  //         if (event.key === "s" && event.metaKey) {
  //
  //           event.preventDefault();
  //           this.send();
  //
  //         } else if (event.key === "z" && event.metaKey) {
  //
  //           event.preventDefault();
  //
  //           if (event.shiftKey) {
  //
  //             // KarmaFieldsAlpha.History.redo();
  //
  //             this.redo();
  //
  //           } else {
  //
  //             // KarmaFieldsAlpha.History.undo();
  //
  //             this.undo();
  //
  //           }
  //
  //           // window.dispatchEvent(new CustomEvent("karmaFieldsAlpha-render")); // -> fields embeded into classic pages
  //           // this.render();
  //
  //         }
  //         // else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
  //         //
  //         //   this.follow(undefined, (field, selection) => {
  //         //
  //         //     if (event.key === "ArrowUp" && field.sortUp && typeof field.sortUp === "function" && selection.length > 0) {
  //         //
  //         //       field.sortUp(selection.index || 0, selection.length);
  //         //
  //         //     } if (event.key === "ArrowDown" && field.sortDown && typeof field.sortDown === "function" && selection.length > 0) {
  //         //
  //         //       field.sortDown(selection.index || 0, selection.length);
  //         //
  //         //     }
  //         //
  //         //   });
  //         //
  //         // } else {
  //         //
  //         //
  //         //
  //         //   // console.log(event.key, document.activeElement);
  //         // }
  //       });
  //
  //
  //       window.addEventListener("popstate", async event => {
  //
  //         KarmaFieldsAlpha.History.update();
  //         // window.dispatchEvent(new CustomEvent("karmaFieldsAlpha-render"));
  //
  //         this.render();
  //
  //       });
  //
  //       container.element.addEventListener("mousedown", event => {
  //         if (this.hasSelection()) {
  //           this.setSelection();
  //           this.render();
  //         }
  //       });
  //
  //       container.element.ondrop = event => {
  //         event.preventDefault();
  //         const files = event.dataTransfer.files;
  //         if (event.dataTransfer.files.length) {
  //           this.upload(event.dataTransfer.files);
  //         }
  //       }
  //       container.element.ondragover = event => {
  //         event.preventDefault();
  //       }
  //
  //
  //       // const clipboard = KarmaFieldsAlpha.Clipboard.getElement();
  //       //
  //       // clipboard.addEventListener("keyup", event => {
  //       //   if (event.key === "Delete" || event.key === "Backspace") {
  //       //     // const selection = this.getSelection();
  //       //     // if (selection) {
  //       //     //   clipboard.value = "";
  //       //     //   this.paste("", selection);
  //       //     //   this.render();
  //       //     // }
  //       //     // debugger;
  //       //     this.delete();
  //       //   }
  //       // });
  //       //
  //       // clipboard.addEventListener("paste", event => {
  //       //   event.preventDefault();
  //       //   // const selection = this.getSelection();
  //       //   // if (selection) {
  //       //   //   const string = event.clipboardData.getData("text/plain").normalize();
  //       //   //   clipboard.value = string;
  //       //   //   this.paste(string, selection);
  //       //   //   this.render();
  //       //   // }
  //       //
  //       //   const string = event.clipboardData.getData("text/plain").normalize();
  //       //   clipboard.value = string;
  //       //
  //       //   // console.log("paste", string);
  //       //
  //       //   this.paste(string);
  //       // });
  //       //
  //       // clipboard.addEventListener("cut", event => {
  //       //   event.preventDefault();
  //       //   // const selection = this.getSelection();
  //       //   // if (selection) {
  //       //   //   event.clipboardData.setData("text/plain", clipboard.value);
  //       //   //   clipboard.value = "";
  //       //   //   this.paste(string, selection);
  //       //   //   this.render();
  //       //   // }
  //       //
  //       //   const [value] = this.copy();
  //       //   console.log("CUT", value);
  //       //   event.clipboardData.setData("text/plain", value || "");
  //       //   clipboard.value = "";
  //       //   this.paste("");
  //       // });
  //       //
  //       // clipboard.addEventListener("copy", event => {
  //       //   event.preventDefault();
  //       //   const [value] = this.copy();
  //       //   console.log("COPY", value);
  //       //   event.clipboardData.setData("text/plain", value || "");
  //       // });
  //       //
  //       // clipboard.onfocus = event => {
  //       //
  //       //   // console.log("clipboard focus");
  //       //
  //       // }
  //       //
  //       // clipboard.onblur = event => {
  //       //
  //       // }
  //
  //       KarmaFieldsAlpha.History.update();
  //
  //     },
  //     update: popup => {
  //
  //       const currentTableId = this.getTable();
  //
  //       popup.element.classList.toggle("hidden", !currentTableId && !this.resource.navigation);
  //
  //       if (currentTableId || this.resource.navigation) {
  //         popup.child = {
  //           class: "popup-content",
  //           children: [
  //             this.createChild({
  //               type: "clipboard"
  //             }).build(),
  //             {
  //               class: "navigation karma-field-frame",
  //               update: navigation => {
  //                 navigation.element.classList.toggle("hidden", !this.resource.navigation);
  //                 if (this.resource.navigation) {
  //                   navigation.child = this.createChild({
  //                     ...this.resource.navigation,
  //                     type: "menu",
  //                     index: "menu"
  //                   }).build();
  //                 }
  //               }
  //             },
  //             this.createChild({
  //               index: "board",
  //               type: "board",
  //               tables: this.resource.tables
  //             }).build()
  //             // {
  //             //   class: "tables",
  //             //   update: container => {
  //             //
  //             //     document.body.classList.toggle("karma-table-open", !currentTableId);
  //             //
  //             //     container.children = Object.keys(this.resource.tables).map((tableId, index) => {
  //             //       return {
  //             //         class: "table-container",
  //             //         update: async container => {
  //             //
  //             //           container.element.classList.toggle("hidden", tableId !== currentTableId);
  //             //
  //             //           if (tableId === currentTableId) {
  //             //
  //             //             container.children = [this.createChild({
  //             //               type: "table",
  //             //               ...this.resource.tables[tableId],
  //             //               // index: index
  //             //               index: tableId,
  //             //               uid: `${this.resource.uid}-${tableId}`
  //             //             }).build()];
  //             //
  //             //           } else {
  //             //
  //             //             container.children = [];
  //             //
  //             //           }
  //             //         }
  //             //       };
  //             //     });
  //             //   }
  //             // }
  //           ]
  //         };
  //       }
  //     },
  //     complete: async popup => {
  //
  //       // if (KarmaFieldsAlpha.embeds) {
  //       //
  //       //   for (let i = 0; i < KarmaFieldsAlpha.embeds.length; i++) {
  //       //
  //       //     const embed = KarmaFieldsAlpha.embeds[i];
  //       //
  //       //     await KarmaFieldsAlpha.build(embed.resource, embed.element);
  //       //
  //       //   }
  //       //
  //       // }
  //
  //       // await KarmaFieldsAlpha.Embed.build();
  //       // for (const [element, resource] of KarmaFieldsAlpha.Embed.map) {
  //
  //       if (KarmaFieldsAlpha.embeds) {
  //
  //         for (const [element, resource] of KarmaFieldsAlpha.embeds) {
  //
  //           const child = this.createChild(resource);
  //
  //           await KarmaFieldsAlpha.build(child.build(), element, element.firstElementChild);
  //
  //         }
  //
  //       }
  //
  //
  //
  //
  //       const task = KarmaFieldsAlpha.tasks.shift();
  //
  //
  //       if (task) {
  //
  //         // console.log("saucer complete. Running task", task);
  //
  //         await task.resolve(task);
  //
  //         await popup.render();
  //
  //       } else {
  //
  //         this.onRender = popup.render;
  //
  //       }
  //
  //     }
  //   };
  // }





  build() {
    return {
      class: "saucer",
      init: container => {
        document.addEventListener("keydown", event => {
          if (event.key === "s" && event.metaKey) {
            event.preventDefault();
            this.send();
          } else if (event.key === "z" && event.metaKey) {
            event.preventDefault();
            if (event.shiftKey) {
              // console.log("redo");
              this.redo();
            } else {
              // console.log("undo");
              // debugger;
              this.undo();
            }
          } else if (event.key === "a" && event.metaKey) {
            event.preventDefault();
            this.selectAll();
          }
        });
        window.addEventListener("popstate", async event => {
          // console.log("popstate", location.hash);
          KarmaFieldsAlpha.History.update();
          this.render();
        });
        container.element.addEventListener("mousedown", event => {
          if (this.hasSelection()) {
            this.setSelection();
            this.render();
          }
        });
        window.addEventListener("mousedown", event => {
          if (this.hasSelection()) {
            this.setSelection();
            this.render();
          }
        });
        container.element.ondrop = event => {
          event.preventDefault();
          const files = event.dataTransfer.files;
          if (event.dataTransfer.files.length) {
            this.upload(event.dataTransfer.files);
          }
        }
        container.element.ondragover = event => {
          event.preventDefault();
        }
        KarmaFieldsAlpha.History.update();
      },
      update: saucer => {





        saucer.children = [
          {
            class: "clipboard",
            tag: "textarea",
            init: clipboard => {
              clipboard.element.id = "karma-fields-alpha-clipboard";
              clipboard.readOnly = true;
              this.focus = () => {
                clipboard.element.focus({preventScroll: true});
                clipboard.element.select();
                clipboard.element.setSelectionRange(0, 999999);
              }

              KarmaFieldsAlpha.Clipboard.focus = this.focus; // -> compat



              clipboard.element.addEventListener("keyup", event => {
                if (event.key === "Delete" || event.key === "Backspace") {
                  event.preventDefault();
                  this.delete();
                } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                  event.preventDefault();
                  this.follow(undefined, (field, selection) => {
                    if (event.key === "ArrowUp" && field.sortUp && typeof field.sortUp === "function" && selection.length > 0) {
                      field.sortUp(selection.index || 0, selection.length);
                    } if (event.key === "ArrowDown" && field.sortDown && typeof field.sortDown === "function" && selection.length > 0) {
                      field.sortDown(selection.index || 0, selection.length);
                    }
                  });
                }
              });

              clipboard.element.addEventListener("paste", event => {
                event.preventDefault();
                const string = event.clipboardData.getData("text/plain").normalize();
                console.log("PASTE", string);
                // clipboard.value = string;
                this.paste(string);
              });

              clipboard.element.addEventListener("cut", event => {
                event.preventDefault();
                const value = this.copy();
                console.log("CUT", value);
                event.clipboardData.setData("text/plain", value || "");
                // clipboard.value = "";
                this.paste("");
              });

              clipboard.element.addEventListener("copy", event => {
                event.preventDefault();

                const value = this.copy();
                console.log("COPY", value);
                event.clipboardData.setData("text/plain", value || "");
              });

              // clipboard.element.onfocus = event => {
              //
              // }

              clipboard.onblur = event => {
                console.log("clipboard blur");
              }

            }
          },
          {
            class: "popup",
            update: popup => {
              const currentTableId = this.getTable();
              document.body.classList.toggle("karma-table-open", Boolean(currentTableId));
              popup.element.classList.toggle("hidden", !currentTableId && !this.resource.navigation);
              if (currentTableId || this.resource.navigation) {
                popup.children = [
                  {
                    class: "popup-content",
                    children: [
                      {
                        class: "navigation karma-field-frame",
                        update: navigation => {
                          navigation.element.classList.toggle("hidden", !this.resource.navigation);
                          if (this.resource.navigation) {
                            navigation.child = this.createChild({
                              ...this.resource.navigation,
                              type: "menu",
                              index: "menu"
                            }).build();
                          }
                        }
                      },
                      this.createChild({
                        index: "board",
                        type: "board",
                        tables: this.resource.tables
                      }).build()
                    ]
                  }
                ]
              }
            }
          }
        ];
      },
      complete: async saucer => {
        if (KarmaFieldsAlpha.embeds) {
          for (let resource of KarmaFieldsAlpha.embeds) {
            const element = document.getElementById(resource.index);
            const child = this.createChild(resource);
            await KarmaFieldsAlpha.build(child.build(), element, element.firstElementChild);
          }
        }
        const task = KarmaFieldsAlpha.tasks.shift();
        if (task) {
          await task.resolve(task);
          await saucer.render();
        } else {
          this.onRender = saucer.render;
        }
      }
    };
  }

}


// KarmaFieldsAlpha.field.saucer.clipboard = class {
//
//   build() {
//
//     return {
//       class: "clipboard",
//       tag: "textarea",
//       init: clipboard => {
//         clipboard.element.id = "karma-fields-alpha-clipboard";
//         clipboard.readOnly = true;
//         this.parent.focus = () => {
//           clipboard.element.focus({preventScroll: true});
//           clipboard.element.select();
//           clipboard.element.setSelectionRange(0, 999999);
//         }
//
//         KarmaFieldsAlpha.Clipboard.focus = this.parent.focus; // -> compat
//
//         clipboard.element.addEventListener("keyup", event => {
//           if (event.key === "Delete" || event.key === "Backspace") {
//             debugger;
//             this.parent.delete();
//           } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
//             this.parent.follow(undefined, (field, selection) => {
//               if (event.key === "ArrowUp" && field.sortUp && typeof field.sortUp === "function" && selection.length > 0) {
//                 field.sortUp(selection.index || 0, selection.length);
//               } if (event.key === "ArrowDown" && field.sortDown && typeof field.sortDown === "function" && selection.length > 0) {
//                 field.sortDown(selection.index || 0, selection.length);
//               }
//             });
//           }
//         });
//
//         clipboard.element.addEventListener("paste", event => {
//           event.preventDefault();
//           const string = event.clipboardData.getData("text/plain").normalize();
//           console.log("PASTE", string);
//           // clipboard.value = string;
//           debugger;
//           this.parent.paste(string);
//         });
//
//         clipboard.element.addEventListener("cut", event => {
//           event.preventDefault();
//           const value = this.parent.copy();
//           console.log("CUT", value);
//           event.clipboardData.setData("text/plain", value || "");
//           // clipboard.value = "";
//           this.parent.paste("");
//         });
//
//         clipboard.element.addEventListener("copy", event => {
//           event.preventDefault();
//           debugger;
//           const value = this.parent.copy();
//           console.log("COPY", value);
//           event.clipboardData.setData("text/plain", value || "");
//         });
//
//         // clipboard.element.onfocus = event => {
//         //
//         // }
//
//         clipboard.onblur = event => {
// console.log("clipboard blur");
//         }
//
//       }
//     };
//
//   }
//
// }
//

KarmaFieldsAlpha.field.saucer.board = class extends KarmaFieldsAlpha.field {

  getGrid(tableId) {

    const table = this.createChild({
      type: "table",
      ...this.resource.tables[tableId],
      index: tableId
    });

    return table.getGrid();

  }


  follow(selection, callback) {

    if (!selection) {

      selection = this.getSelection();

    }

    if (selection) {

      if (selection.final) {

        return callback(this, selection);

      } else if (this.resource.tables) {

        for (let i in this.resource.tables) {

          if (selection[i]) {

            const child = this.createChild({type: "table", ...this.resource.tables[i], index: i});

            return child.follow(selection[i], callback);

          }

        }

      }

    }

  }

  // paste(string, selection) {
  //
  //   if (this.resource.tables) {
  //
  //     for (let i in this.resource.tables) {
  //
  //       if (selection[i]) {
  //
  //         const child = this.createChild({
  //           type: "table",
  //           ...this.resource.tables[i],
  //           index: i
  //         });
  //
  //         return child.paste(string, selection[i]);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }


  build() {

    return {
      class: "tables",
      update: container => {

        // const currentTableId = this.request("getTable");
        const currentTableId = KarmaFieldsAlpha.Store.getTable();


        // document.body.classList.toggle("karma-table-open", Boolean(currentTableId));

        container.children = Object.keys(this.resource.tables).map((tableId, index) => {
          return {
            class: "table-container",
            update: async container => {

              container.element.classList.toggle("hidden", tableId !== currentTableId);

              if (tableId === currentTableId) {

                container.children = [this.createChild({
                  type: "table",
                  ...this.resource.tables[tableId],
                  // index: index
                  index: tableId
                  // uid: `${this.resource.uid}-${tableId}`
                }).build()];

              } else {

                container.children = [];

              }
            }
          };
        });
      }
    };


  }
}



KarmaFieldsAlpha.field.saucer.table = class extends KarmaFieldsAlpha.field {

  // clearSelection(selection) {
  //
  //   if (selection && selection.body) {
  //
  //     const grid = this.createChild({
  //       type: "grid",
  //       ...this.resource.body,
  //       index: "body"
  //     });
  //
  //     grid.clearSelection(selection.body);
  //
  //   }
  //
  // }

  getGrid(tableId) {

    return this.createChild({
      ...this.resource.body,
      index: "body"
    });

  }

  follow(selection, callback) {

    if (selection.final) {

      return callback(this, selection);

    } else if (selection.body && this.resource.body) {

      const child = this.createChild({type: "grid", ...this.resource.body, index: "body"});

      return child.follow(selection.body, callback);

    }

  }

  // paste(string, selection) {
  //
  //   if (selection.body && this.resource.body) {
  //
  //     const child = this.createChild({
  //       type: "grid",
  //       ...this.resource.body,
  //       index: "body"
  //     });
  //
  //     child.paste(string, selection.body);
  //
  //   }
  //
  // }


  // paste(value, selection) {
  //
  //   if (selection && selection.body && this.resource.body) {
  //
  //     const child = this.createChild({...this.resource.body, index: "body", uid: `${this.resource.index}-body`});
  //
  //     child.paste(value, selection.body);
  //
  //   }
  //
  // }


  build() {

    return {
      class: "karma-field-table",
      update: async div => {

        let index = 0;

        // div.element.classList.add("table-loading");

        div.children = [
          {
            class: "karma-header table-header table-main-header",
            child: this.createChild({
              type: "header",
              ...this.resource.header,
              index: "header"
            }).build()
          },
          {
            class: "table-body",
            update: container => {
              // container.element.classList.toggle("single-open", Boolean(modalOpen));


            },
            children: [
              {
                class: "karma-field-table-section table-section karma-field-frame final",
                update: filters => {
                  filters.element.classList.toggle("hidden", !this.resource.filters);

                  if (this.resource.filters) {
                    filters.child = this.createChild({
                      type: "group",
                      ...this.resource.filters,
                      index: "filter"
                    }).build();
                  }
                }
              },
              ...(this.resource.subsections || []).map(subsection => {
                return {
                  class: "karma-field-table-section table-section karma-field-frame final",
                  init: section => {
                    if (subsection.style) {
                      section.element.style = subsection.style;
                    }
                  },
                  child: this.createChild({...subsection, index: index++}).build()
                };
              }),
              {
                class: "table-body-columns",
                update: div => {





                  const grid = this.createChild({
                    type: "grid",
                    ...this.resource.body,
                    index: "body"
                  });

                  const selection = grid.getSelection();



                  // -> set focus to clipboard
                  div.element.onmousedown = event => {
                    event.stopPropagation();
                    event.preventDefault();



                    grid.setSelection({final: true, index: 0, length: 0});

                    KarmaFieldsAlpha.Clipboard.focus();
                    this.render();

                    // console.log("body mousedown");

                    // if (this.hasSelection()) {
                    //   this.setSelection();
                    //   this.render();
                    // }
                  };


                  div.children = [
                    {
                      class: "table-body-column table-content",
                      // child: grid.build()
                      child: {
                        class: "table-body-columns",
                        children: [
                          {
                            class: "karma-field-table-grid-container karma-field-frame karma-field-group final scroll-container table-body-column table-body-main-column",
                            update: scrollContainer => {
                              this.getScrollContainer = () => scrollContainer.element;
                            },
                            child: grid.build()
                          },
                          // grid.buildModal()
                          {
                            class: "grid-modal table-body-column karma-modal scroll-container table-body-side-column",
                            update: div => {

                              // const selection = grid.getSelection();
                              div.element.classList.toggle("hidden", !grid.resource.modal);

                              // if (grid.resource.modal && selection) {
                              if (grid.resource.modal) {

                                const ids = grid.getSelectedIds();

                                const modal = grid.createChild({
                                  type: "modal",
                                  ...grid.resource.modal,
                                  index: "modal"
                                });
                                div.element.style.width = grid.resource.modal.width || "30em";
                                div.element.onmousedown = event => {
                                  event.stopPropagation(); // -> prevent unselecting
                                  modal.setSelection({final: true});
                                  this.render();
                                };
                                // if (grid.hasSelection()) {
                                // const selection = grid.getSelection();
                                if (ids && ids.length) {
                                  div.child = modal.build();
                                } else {
                                  div.children = [];
                                }
                                div.element.classList.toggle("active", Boolean(ids && ids.length));
                              }
                            }
                          }
                        ]
                      }
                    },
                    {
                      class: "table-body-column table-modal karma-modal",
                      update: container => {
                        // const selection = grid.getSelection();
                        //
                        // const hasSelection = Boolean(selection && selection instanceof KarmaFieldsAlpha.Selection);

                        // console.log("update table-body-column", container.element, selection, hasSelection);

                        // container.element.onmousedown = event => {
                        //   console.log("modal mousedown");
                        //   event.stopPropagation();
                        // }




                        // container.element.style.width = this.resource.modal && this.resource.modal.width || grid.resource.modal && grid.getSelection() && (grid.resource.modal.width || "30em") || "0";

                        container.element.classList.toggle("hidden", !this.resource.modal);

                        if (this.resource.modal) {
                          container.element.style.width = this.resource.modal.width || "30em";
                          // container.child = {
                            // class: "karma-modal", // -> handle overflow:auto
                            // children: [
                            //   {
                                // class: "table-modal-content",
                                // update: div => {
                                  // div.element.classList.toggle("hidden", !this.resource.modal);
                                  // if (this.resource.modal) {
                                    container.child = this.createChild({
                                      type: "group",
                                      ...this.resource.modal,
                                      index: "modal"
                                    }).build();
                                //   }
                                // }
                              // }
                              // {
                              //   class: "grid-modal-content",
                              //   update: div => {
                              //     // const hasSelection = grid.hasSelection();
                              //     const selection = grid.getSelection();
                              //     div.element.classList.toggle("hidden", !selection);
                              //     if (selection) {
                              //       div.child = grid.createChild({
                              //         type: "modal",
                              //         ...grid.resource.modal,
                              //         selection: grid.getSelection(),
                              //         index: "modal",
                              //         uid: `${grid.resource.uid}-modal`
                              //       }).build()
                              //     }
                              //   }
                              // }
                            // ]
                          // };
                        }
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            class: "table-footer table-control",
            update: footer => {
              footer.element.classList.toggle("hidden", this.resource.controls === false);
              if (this.resource.controls !== false) {
                footer.child = this.createChild({
                  type: "controls",
                  ...this.resource.controls,
                  index: "controls"
                }).build();
              }
            }
          }
        ];
      }
    };

  }
}



KarmaFieldsAlpha.field.saucer.menu = class extends KarmaFieldsAlpha.field {

  getItems() {
    return this.resource.items || this.resource.children || [];
  }

  build() {
    return {
      tag: "ul",
      children: this.getItems().map(item => {
        return {
          tag: "li",
          children: [
            {
              tag: "a",
              update: a => {
                a.element.innerHTML = item.title;
                a.element.href = "#"+(item.hash || "");
                if (item.table) {
                  a.element.onclick = event => {
                    event.preventDefault();
                    this.parent.request("open", item.table);
                    // this.render();
                  }
                  a.element.classList.toggle("active", KarmaFieldsAlpha.Store.getTable() === item.table);
                }
                if (item.action) {
                  a.element.onclick = event => {
                    event.preventDefault();
                    this.parent.request(item.action, ...item.values);
                  }
                }
              }
            },
            this.createChild({
              items: item.items || item.children || [],
              type: "menu"
            }).build()
          ],
          update: li => {
            const active = this.resource.table && this.resource.table === this.parent.request("getTable");
            li.element.classList.toggle("active", Boolean(active));
          }
        };
      })
    }
  }

}



KarmaFieldsAlpha.field.saucer.controls = class extends KarmaFieldsAlpha.field.container {

  constructor(resource) {

    super({
      display: "flex",
      children: [
        // "reload",
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

KarmaFieldsAlpha.field.saucer.save = {
  type: "button",
  action: "send",
  title: "Save",
  enabled: ["request", "hasChange"],
  primary: true
}

KarmaFieldsAlpha.field.saucer.add = {
  type: "button",
  action: "add",
  title: "Add"
}

KarmaFieldsAlpha.field.saucer.delete = {
  type: "button",
  action: "delete",
  title: "Delete",
  // disabled: "!selection"
  enabled: ["request", "canDelete"]
}

KarmaFieldsAlpha.field.saucer.undo = {
  type: "button",
  action: "undo",
  dashicon: "undo",
  disabled: ["!", ["request", "hasUndo"]],
  loading: ["request", "hasTask"]
}

KarmaFieldsAlpha.field.saucer.redo = {
  type: "button",
  action: "redo",
  dashicon: "redo",
  disabled: ["!", ["request", "hasRedo"]]
  // loading: ["hasTask"]
}

KarmaFieldsAlpha.field.saucer.reload = {
  type: "button",
  action: "reload",
  title: "Reload"
}

KarmaFieldsAlpha.field.saucer.insert = {
  type: "button",
  action: "insert",
  primary: true,
  title: "Insert",
  enabled: ["request", "isTableRowSelected"],
  visible: ["request", "hasTransfer"]
}


// KarmaFieldsAlpha.field.saucer.upload = {
//   type: "button",
//   action: "upload",
//   title: "Upload File"
// }


KarmaFieldsAlpha.field.saucer.header = class extends KarmaFieldsAlpha.field.container {

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

KarmaFieldsAlpha.field.saucer.header.title = class extends KarmaFieldsAlpha.field.text {

  constructor(resource) {

    super({
      tag: "h1",
      style: "flex-grow:1",
      class: "ellipsis",
      ...resource
    });

  }

  getContent() {

    const content = this.getResource("title");

    return this.parse(content || "Table");

  }

}

KarmaFieldsAlpha.field.saucer.count = {
  type: "text",
  style: "justify-content:center;white-space: nowrap;",
  value: ["replace", "# elements", "#", ["request", "count"]]
}

KarmaFieldsAlpha.field.saucer.options = {
  type: "button",
  title: "Options",
  action: "toggleOptions"
}

KarmaFieldsAlpha.field.saucer.close = {
  type: "button",
  text: "×",
  title: "Close Table",
  action: "close"
}

KarmaFieldsAlpha.field.saucer.pagination = class extends KarmaFieldsAlpha.field.container {

  constructor(resource) {

    super({
      type: "group",
      display: "flex",
      style: "flex: 0 1 auto;min-width:0",
      visible: [">", ["request", "getNumPage"], 1],
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

KarmaFieldsAlpha.field.saucer.pagination.firstpage = {
  type: "button",
  action: "firstPage",
  title: "First Page",
  text: "«",
  disabled: ["==", ["request", "getPage"], 1]
}

KarmaFieldsAlpha.field.saucer.pagination.prevpage = {
  type: "button",
  action: "prevPage",
  title: "Previous Page",
  text: "‹",
  disabled: ["==", ["request", "getPage"], 1]
}

KarmaFieldsAlpha.field.saucer.pagination.currentpage = {
  type: "text",
  style: "min-width: 4em;text-align: right;",
  value: ["replace", "# / #", "#", ["request", "getPage"], ["request", "getNumPage"]]
}

KarmaFieldsAlpha.field.saucer.pagination.nextpage = {
  type: "button",
  action: "nextPage",
  title: "Next Page",
  text: "›",
  disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]]
}

KarmaFieldsAlpha.field.saucer.pagination.lastpage = {
  type: "button",
  action: "lastPage",
  title: "Last Page",
  text: "»",
  // disabled: ["request", "lastpage", "boolean"]
  disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]]
}
