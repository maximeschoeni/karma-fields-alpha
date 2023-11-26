
KarmaFieldsAlpha.field.saucer = class extends KarmaFieldsAlpha.field {

  constructor(resource) {

    super(resource);

  }

  getGrid(tableId) { // needed for: export button

    if (!tableId) {

      tableId = this.getTable();

    }

    if (tableId) {

      const board = this.createChild({
        type: "board",
        tables: this.resource.tables,
        index: "board"
      }, "board");

      return board.getGrid(tableId);

    }

  }

  getTableResource(tableId) {

    if (!tableId) {

      tableId = KarmaFieldsAlpha.Store.Layer.getTable();

    }

    return this.resource.tables && this.resource.tables[tableId];

  }

  getDriver(table) {

    const resource = this.getTableResource(table);

    if (resource) {

      return resource.driver;
    }

  }


  getContent(key) {

    const value = KarmaFieldsAlpha.Store.Layer.getParam(key);

    const array = value && value.split(",") || [];

    return new KarmaFieldsAlpha.Content(value);
  }

  async setContent(content, key) {

    const value = content.toArray().join(",")

    await KarmaFieldsAlpha.Store.Layer.setParam(value, key);

    if (key !== "page") {

      const page = KarmaFieldsAlpha.Store.Layer.getParam("page");

      if (page !== 1) {

        await KarmaFieldsAlpha.Store.Layer.setParam(1, "page");

      }

    }

    await KarmaFieldsAlpha.Store.Layer.removeItems();

  }

  async removeContent(key) {

    await KarmaFieldsAlpha.Store.Layer.removeParam(key);

    const page = KarmaFieldsAlpha.Store.Layer.getParam("page");

    if (page !== 1) {

      await KarmaFieldsAlpha.Store.Layer.setParam(1, "page");

    }

    await KarmaFieldsAlpha.Store.Layer.removeItems();

  }

  dispatch(functionName, ...args) {

    const focus = KarmaFieldsAlpha.Store.Layer.get("focus");

    if (focus) {

      return this.lift(focus, functionName, ...args);

    }

  }

  dispatchGrid(functionName, ...args) {

    const table = KarmaFieldsAlpha.Store.Layer.getTable();

    return this.lift(["board", table, "body"], functionName, ...args);

  }

  async undo() {

    KarmaFieldsAlpha.tasks.push({
      name: "Undo...",
      type: "history",
      resolve: () => KarmaFieldsAlpha.History.undo()
    });

    this.render();

  }

  async redo() {

    KarmaFieldsAlpha.tasks.push({
      name: "Redo...",
      type: "history",
      resolve: () => KarmaFieldsAlpha.History.redo()
    });

    this.render();

  }

  hasUndo() {

    return KarmaFieldsAlpha.History.hasUndo();

  }

  hasRedo() {

    return KarmaFieldsAlpha.History.hasRedo();

  }


  getChild(index) {

    if (index === "board") {

      return this.createChild({
        type: "board",
        tables: this.resource.tables,
        index: "board"
      }, "board");

    } else {

      for (const resource of KarmaFieldsAlpha.embeds) {

        if (resource.index === index) {

          return this.createChild(resource, index);

        }

      }

    }

  }



  async add() {

    await this.dispatch("add");

  }

  canDelete() {

    return this.dispatch("canDelete");

  }

  send() {

    KarmaFieldsAlpha.Query.sync();

    this.render();
  }

  submit() {

    this.send();

  }

  hasChange() {

    return KarmaFieldsAlpha.Store.Delta.hasChange();

  }

  hasTask() {

    const tasks = KarmaFieldsAlpha.Store.get("tasks");

    return tasks && tasks.length > 0 || false;

  }


  async open(table, params, replace = false, selectedIds = []) {

    const resource = this.getTableResource(table);

    let index = KarmaFieldsAlpha.Store.Layer.getIndex();

    this.save(`open-${table}`, `Open ${table}`);

    if (!replace) {

      index++;

      await KarmaFieldsAlpha.Store.Layer.setIndex(index);

    }

    const newLayer = {
      table: table,
      params: {
        ...resource.body.params,
        ...params
      },
      highlightIds: selectedIds
    };

    await KarmaFieldsAlpha.Store.Layer.set(newLayer, index);

    await this.render();

  }

  async close() {

    let index = KarmaFieldsAlpha.Store.Layer.getIndex();

    if (index) {

      this.save(`close`, `Close`);

      await KarmaFieldsAlpha.Store.State.remove("layers", index);

      index--;

      await KarmaFieldsAlpha.Store.Layer.setIndex(index);

      this.render();

    }

  }



  // count() {
  //
  //   const table = KarmaFieldsAlpha.Store.Layer.getTable();
  //   const params =  KarmaFieldsAlpha.Store.Layer.getParams();
  //
  //   const resource = this.getTableResource(table);
  //   const grid = resource.body;
  //
  //   return KarmaFieldsAlpha.Query.getCount(grid.driver, params);
  //
  // }

  // ppp() {
  //
  //   return KarmaFieldsAlpha.Store.Layer.getParam("ppp") || 100;
  //
  // }

  // getNumPage() {
  //
  //   const count = this.count();
  //
  //   if (count !== undefined) {
  //
  //     const ppp = this.ppp();
  //
  //     return Math.max(1, Math.ceil(Number(count)/Number(ppp)));
  //
  //   }
  //
  // }
  //
  // isFirstPage() {
  //
  //   const page = this.getPage();
  //
  //   return page == 1;
  //
  // }
  //
  // isLastPage() {
  //
  //   const page = this.getPage();
  //   const numPage = this.getNumPage();
  //
  //   if (numPage !== undefined) {
  //
  //     return page == umPage;
  //
  //   }
  //
  // }
  //
  // async firstPage() {
  //
  //   const page = this.getPage();
  //
  //   if (page > 1) {
  //
  //     await KarmaFieldsAlpha.Store.Layer.setParam(1, "page");
  //     await this.render();
  //
  //   }
  //
  // }
  //
  // async prevPage() {
  //
  //   const page = this.getPage();
  //
  //   if (page > 1) {
  //
  //     await KarmaFieldsAlpha.Store.Layer.setParam(page-1, "page");
  //     await this.render();
  //
  //   }
  //
  // }
  //
  // async nextPage() {
  //
  //   const page = this.getPage();
  //   const numPage = this.getNumPage();
  //
  //   if (page < numPage) {
  //
  //     await KarmaFieldsAlpha.Store.Layer.setParam(page+1, "page");
  //     await this.render();
  //
  //   }
  //
  // }
  //
  // async lastPage() {
  //
  //   const page = this.getPage();
  //   const numPage = this.getNumPage();
  //
  //   if (page < numPage) {
  //
  //     await KarmaFieldsAlpha.Store.Layer.setParam(numPage, "page");
  //     await this.render();
  //
  //   }
  //
  // }


  // async render() {
  //
  //   if (this.rendering) {
  //
  //     return this.renderPromise;
  //
  //   } else if (this.onRender) {
  //
  //     // console.log("sauce render");
  //
  //     this.renderPromise = this.onRender().then(() => this.rendering = false);
  //
  //     this.rendering = true;
  //
  //     return this.renderPromise;
  //
  //   }
  //
  // }


  async loop() {


    const embeds = KarmaFieldsAlpha.embeds;

    let task;

    do {

      if (embeds) {

        for (let resource of embeds) {

          const element = document.getElementById(resource.index);

          const child = this.createChild(resource, resource.index);

          await KarmaFieldsAlpha.build(child.build(), element, element.firstElementChild);

        }

      }

      // debugger;

      const tasks = KarmaFieldsAlpha.Store.get("tasks");

      if (tasks) {

        task = tasks.shift();

        if (task) {

          await task.resolve(task);

          // this.addNotice(task.name || "?");

          KarmaFieldsAlpha.Store.set(tasks, "tasks");

        }

      }

    } while (task);

  }

  render() {

    if (!this.rendering) {

      this.rendering = this.loop().then(() => this.rendering = null);

    }

    return this.rendering;

  }


  // async render() {
  //
  //   if (!this.rendering) {
  //
  //     this.rendering = true;
  //
  //     let task;
  //
  //     do {
  //
  //       if (KarmaFieldsAlpha.embeds) {
  //
  //         for (let resource of KarmaFieldsAlpha.embeds) {
  //
  //           const element = document.getElementById(resource.index);
  //
  //           const child = this.createChild(resource);
  //
  //           await KarmaFieldsAlpha.build(child.build(), element, element.firstElementChild);
  //
  //         }
  //
  //       }
  //
  //       task = KarmaFieldsAlpha.tasks.shift();
  //
  //
  //       if (task) {
  //
  //         await task.resolve(task);
  //
  //         this.addNotice(task.name || "?");
  //
  //       }
  //
  //     } while (task);
  //
  //
  //     this.rendering = false;
  //
  //   }
  //
  // }



  fetch(tableId, params, id) {

    this.open(tableId, params, [id]);

    // if (this.resource.tables && this.resource.tables[tableId] && this.resource.tables[tableId].body) {
    //
    //   this.addTransfer({
    //     // selection: this.getSelection(),
    //     selection: KarmaFieldsAlpha.Store.getSelection(),
    //     table: KarmaFieldsAlpha.Store.getTable(),
    //     params: KarmaFieldsAlpha.Store.getParams(),
    //     ids: KarmaFieldsAlpha.Store.getIds(),
    //     context: "fetch"
    //   });
    //
    //   const grid = this.getGrid(tableId);
    //
    //   if (grid) {
    //
    //     // const values = this.getSelectedValue();
    //     //
    //     // grid.setSelection({values: values});
    //
    //     KarmaFieldsAlpha.Store.setTable(tableId);
    //
    //     KarmaFieldsAlpha.Store.setParams(params || {});
    //     KarmaFieldsAlpha.Store.removeIds();
    //
    //
    //
    //     grid.save("open");
    //
    //     this.render();
    //
    //   }
    //
    // }

  }

  // addTransfer(transfer) {
  //
  //   const transfers = KarmaFieldsAlpha.Store.getTransfers();
  //
  //   KarmaFieldsAlpha.Store.setTransfers([transfer, ...transfers]);
  //
  // }
  //
  //
  // shiftTransfer() {
  //
  //   const transfers = KarmaFieldsAlpha.Store.getTransfers();
  //
  //   if (transfers.length) {
  //
  //     KarmaFieldsAlpha.Store.setTransfers(transfers.slice(1));
  //
  //     return transfers[0];
  //
  //   }
  //
  // }
  //
  // hasTransfer() {
  //
  //   const transferts = KarmaFieldsAlpha.Store.getTransfers();
  //
  //   return transferts[0] && transferts[0].context === "fetch";
  //
  // }



  async insert() {

    // const table = this.getCurrentLayer("table") || "";

    // const ids = this.follow({name: "getSelectedIds"});

    // const ids = this.dispatch({callback: field => field.request({name: "getSelectedIds"})});

    const items = this.dispatch("request", "getSelectedItems");

    if (items.loading) {

      KarmaFieldsAlpha.Store.Task.add({
        resolve: () => this.insert()
      });

      this.render();

      return;

    }

    const ids = items.toArray().map();

    await this.save("insert", "Insert");

    await this.close();



    // this.dispatch({name: "insert", args: [ids]});

    await this.dispatch("insert", ids);

    await this.render();


    // const transfer = this.shiftTransfer();
    //
    // if (transfer) {
    //
    //   const grid = this.getGrid();
    //
    //   const ids = grid && grid.getSelectedIds();
    //
    //   if (ids && ids.length) {
    //
    //     KarmaFieldsAlpha.Store.setTable(transfer.table);
    //     KarmaFieldsAlpha.Store.setParams(transfer.params);
    //     KarmaFieldsAlpha.Store.setSelection(transfer.selection);
    //     KarmaFieldsAlpha.Store.setIds(transfer.ids);
    //
    //     this.follow(transfer.selection, (field, selection) => {
    //       field.insert && field.insert(ids, selection.index, selection.length)
    //       field.save("insert");
    //     });
    //
    //     await this.render();
    //
    //   }
    //
    // }

  }

  // multiple() {
  //
  //   return false;
  //
  // }


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

    const ids = this.dispatch("request", "getSelectedIds");

    return ids && ids.length > 0 || false;

    // const grid = this.getGrid();
    //
    //
    //
    // return grid.isRowSelected();

    // const selection = grid.getSelection() || {};
    //
    // if (selection && selection.length) {
    //
    //   return true;
    //
    // }
    //
    // return false;
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





  // buildBKP() {
  //   return {
  //     class: "saucer",
  //     init: container => {
  //       document.addEventListener("keydown", event => {
  //         if (event.key === "s" && event.metaKey) {
  //           event.preventDefault();
  //           this.send();
  //         } else if (event.key === "z" && event.metaKey) {
  //           event.preventDefault();
  //           if (event.shiftKey) {
  //             // console.log("redo");
  //             this.redo();
  //           } else {
  //             // console.log("undo");
  //             // debugger;
  //             this.undo();
  //           }
  //         }
  //       });
  //       window.addEventListener("popstate", async event => {
  //         // console.log("popstate", location.hash);
  //         KarmaFieldsAlpha.History.update();
  //         this.render();
  //       });
  //       container.element.addEventListener("mousedown", event => {
  //         if (this.hasSelection()) {
  //           this.setSelection();
  //           this.render();
  //         }
  //       });
  //       window.addEventListener("mousedown", event => {
  //         if (this.hasSelection()) {
  //           this.setSelection();
  //           this.render();
  //         }
  //       });
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
  //       KarmaFieldsAlpha.History.update();
  //     },
  //     update: saucer => {
  //
  //       // this.onRender = saucer.render;
  //
  //
  //
  //       saucer.children = [
  //         {
  //           class: "clipboard",
  //           tag: "textarea",
  //           init: clipboard => {
  //             clipboard.element.id = "karma-fields-alpha-clipboard";
  //             clipboard.readOnly = true;
  //             this.focus = () => {
  //               clipboard.element.focus({preventScroll: true});
  //               clipboard.element.select();
  //               clipboard.element.setSelectionRange(0, 999999);
  //             }
  //
  //             KarmaFieldsAlpha.Clipboard.focus = this.focus; // -> compat
  //
  //
  //             clipboard.element.addEventListener("keyup", event => {
  //               if (event.key === "a" && event.metaKey) {
  //                 event.preventDefault();
  //                 this.selectAll();
  //               }
  //             });
  //
  //             clipboard.element.addEventListener("keyup", event => {
  //               if (event.key === "Delete" || event.key === "Backspace") {
  //                 event.preventDefault();
  //                 this.delete();
  //               } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
  //                 event.preventDefault();
  //                 this.follow(undefined, (field, selection) => {
  //                   if (event.key === "ArrowUp" && field.sortUp && typeof field.sortUp === "function" && selection.length > 0) {
  //                     field.sortUp(selection.index || 0, selection.length);
  //                   } if (event.key === "ArrowDown" && field.sortDown && typeof field.sortDown === "function" && selection.length > 0) {
  //                     field.sortDown(selection.index || 0, selection.length);
  //                   }
  //                 });
  //               }
  //             });
  //
  //             clipboard.element.addEventListener("paste", event => {
  //               event.preventDefault();
  //               const string = event.clipboardData.getData("text/plain").normalize();
  //               console.log("PASTE", string);
  //               // clipboard.value = string;
  //               this.paste(string);
  //             });
  //
  //             clipboard.element.addEventListener("cut", event => {
  //               event.preventDefault();
  //               const value = this.copy();
  //               console.log("CUT", value);
  //               event.clipboardData.setData("text/plain", value || "");
  //               // clipboard.value = "";
  //               this.paste("");
  //             });
  //
  //             clipboard.element.addEventListener("copy", event => {
  //               event.preventDefault();
  //
  //               const value = this.copy();
  //               console.log("COPY", value);
  //               event.clipboardData.setData("text/plain", value || "");
  //             });
  //
  //             // clipboard.element.onfocus = event => {
  //             //
  //             // }
  //
  //             clipboard.onblur = event => {
  //               console.log("clipboard blur");
  //             }
  //
  //           }
  //         },
  //         {
  //           class: "popup",
  //           update: popup => {
  //             const currentTableId = this.getTable();
  //             document.body.classList.toggle("karma-table-open", Boolean(currentTableId));
  //             popup.element.classList.toggle("hidden", !currentTableId && !this.resource.navigation);
  //             if (currentTableId || this.resource.navigation) {
  //               popup.children = [
  //                 {
  //                   class: "popup-content",
  //                   children: [
  //                     {
  //                       class: "navigation karma-field-frame",
  //                       update: navigation => {
  //                         navigation.element.classList.toggle("hidden", !this.resource.navigation);
  //                         if (this.resource.navigation) {
  //                           navigation.child = this.createChild({
  //                             ...this.resource.navigation,
  //                             type: "menu",
  //                             index: "menu"
  //                           }).build();
  //                         }
  //                       }
  //                     },
  //                     this.createChild({
  //                       index: "board",
  //                       type: "board",
  //                       tables: this.resource.tables
  //                     }).build()
  //                   ]
  //                 }
  //               ]
  //             }
  //           }
  //         }
  //       ];
  //     },
  //     complete: async saucer => {
  //       // if (KarmaFieldsAlpha.embeds) {
  //       //   for (let resource of KarmaFieldsAlpha.embeds) {
  //       //     const element = document.getElementById(resource.index);
  //       //     const child = this.createChild(resource);
  //       //     await KarmaFieldsAlpha.build(child.build(), element, element.firstElementChild);
  //       //   }
  //       // }
  //       // const task = KarmaFieldsAlpha.tasks.shift();
  //       //
  //       // if (task) {
  //       //   await task.resolve(task);
  //       //   await saucer.render();
  //       // } else {
  //       //   this.onRender = saucer.render;
  //       // }
  //     }
  //   };
  // }

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


  // follow(selection, callback) {
  //
  //   if (!selection) {
  //
  //     selection = this.getSelection();
  //
  //   }
  //
  //   if (selection) {
  //
  //     if (selection.final) {
  //
  //       return callback(this, selection);
  //
  //     } else if (this.resource.tables) {
  //
  //       for (let i in this.resource.tables) {
  //
  //         if (selection[i]) {
  //
  //           const child = this.createChild({type: "table", ...this.resource.tables[i], index: i});
  //
  //           return child.follow(selection[i], callback);
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

  // descend(selection, action) {
  //
  //   if (this.resource.tables) {
  //
  //     for (let i in this.resource.tables) {
  //
  //       if (selection[i]) {
  //
  //         const child = this.createChild({type: "table", ...this.resource.tables[i], index: i});
  //
  //         return child.descend(selection[i], action);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

  // getSelectionChild(selection) {
  //
  //   if (selection && this.resource.tables) {
  //
  //     for (let i in this.resource.tables) {
  //
  //       if (selection[i]) {
  //
  //         return this.createChild({type: "table", ...this.resource.tables[i], index: i});
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

  getChild(index) {

    if (index === "menu") {

      return this.createChild({
        ...this.resource.navigation,
        type: "menu",
        index: "menu"
      }, "menu");

    } else if (this.resource.tables[index]) {

      return this.createChild({
        type: "table",
        ...this.resource.tables[index],
        index: index
      }, index);

    }

  }

  // delete(selection = this.getSelection()) { // same as field.delete!
  //
  //   const child = this.getSelectionChild(selection);
  //
  //   if (child) {
  //
  //     child.delete(selection[child.resource.index]);
  //
  //   }
  //
  // }

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


  // buildBKP() {
  //
  //   return {
  //     class: "tables",
  //     update: container => {
  //
  //       // const currentTableId = this.request("getTable");
  //       const currentTableId = KarmaFieldsAlpha.Store.getTable();
  //
  //
  //       // document.body.classList.toggle("karma-table-open", Boolean(currentTableId));
  //
  //       container.children = Object.keys(this.resource.tables).map((tableId, index) => {
  //         return {
  //           class: "table-container",
  //           update: async container => {
  //
  //             container.element.classList.toggle("hidden", tableId !== currentTableId);
  //
  //             if (tableId === currentTableId) {
  //
  //               container.children = [this.createChild({
  //                 type: "table",
  //                 ...this.resource.tables[tableId],
  //                 // index: index
  //                 index: tableId
  //                 // uid: `${this.resource.uid}-${tableId}`
  //               }).build()];
  //
  //             } else {
  //
  //               container.children = [];
  //
  //             }
  //           }
  //         };
  //       });
  //     }
  //   };
  //
  //
  // }





  build() {
    return {
      class: "saucer",
      init: async container => {
        document.addEventListener("keydown", event => {
          if (event.key === "s" && event.metaKey) {
            event.preventDefault();
            this.parent.send();
          } else if (event.key === "z" && event.metaKey) {
            event.preventDefault();
            if (event.shiftKey) {
              // console.log("redo");
              this.parent.redo();
            } else {
              // console.log("undo");
              // debugger;
              this.parent.undo();
            }
          }
        });
        window.addEventListener("popstate", async event => {
          // console.log("popstate", location.hash);
          KarmaFieldsAlpha.History.update();
          this.parent.render();
        });
        // container.element.addEventListener("mousedown", event => {
        //   if (this.parent.hasSelection()) {
        //     this.parent.setSelection();
        //     this.parent.render();
        //   }
        // });
        window.addEventListener("mousedown", event => {
          if (KarmaFieldsAlpha.Store.Layer.getSelection()) {
            KarmaFieldsAlpha.Store.Layer.removeSelection();
            this.request("render");
          }
        });
        // container.element.ondrop = event => {
        //   event.preventDefault();
        //   const files = event.dataTransfer.files;
        //   if (event.dataTransfer.files.length) {
        //     this.parent.upload(event.dataTransfer.files);
        //   }
        // }
        container.element.ondragover = event => {
          event.preventDefault();
        }
        // KarmaFieldsAlpha.History.update();

        await KarmaFieldsAlpha.Store.Buffer.load();
        await KarmaFieldsAlpha.Store.Layer.removeItems();
        await KarmaFieldsAlpha.History.init();

      },
      update: saucer => {

        saucer.children = [
          {
            class: "clipboard",
            tag: "textarea",
            update: clipboard => {
              clipboard.element.id = "karma-fields-alpha-clipboard";
              clipboard.readOnly = true;

              // if (KarmaFieldsAlpha.Store.getFocus()) {
              //
              //   clipboard.element.focus({preventScroll: true});
              //
              // }

              // const focus = this.request("getState", "focus");
              // const focus = KarmaFieldsAlpha.Store.State.get("focus");
              const useClipboard = KarmaFieldsAlpha.Store.State.get("clipboard");

              // console.log("clipboard", useClipboard);

              if (useClipboard) {

                clipboard.element.focus({preventScroll: true});

              }

              // this.parent.focus = () => { // !!!!
              //   console.error("deprecated. Use deferFocus() instead")
              //   clipboard.element.focus({preventScroll: true});
              //   clipboard.element.select();
              //   clipboard.element.setSelectionRange(0, 999999);
              // }

              // KarmaFieldsAlpha.Clipboard.focus = this.parent.focus; // -> compat


              clipboard.element.onkeydown = event => {

                if (event.key === "a" && event.metaKey) {
                  event.preventDefault();
                  // this.parent.selectAll();
                  this.request("dispatch", "selectAll");
                }
              // });
              //
              // clipboard.element.addEventListener("keyup", event => {
                if (event.key === "Delete" || event.key === "Backspace") {
                  event.preventDefault();
                  // this.parent.delete();
                  this.request("dispatch", "delete");
                } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                  event.preventDefault();

                  this.request(event.key);



                  // this.parent.follow(undefined, (field, selection) => {
                  //   if (event.key === "ArrowUp" && field.sortUp && typeof field.sortUp === "function" && selection.length > 0) {
                  //     field.sortUp(selection.index || 0, selection.length);
                  //   } if (event.key === "ArrowDown" && field.sortDown && typeof field.sortDown === "function" && selection.length > 0) {
                  //     field.sortDown(selection.index || 0, selection.length);
                  //   }
                  // });
                }
              }

              clipboard.element.onpaste = event => {
                event.preventDefault();
                const string = event.clipboardData.getData("text/plain").normalize();
                debugger;
                console.log("PASTE", string);
                // clipboard.value = string;
                // this.parent.paste(string);
                this.request("dispatch", "paste", string);
              }

              clipboard.element.oncut = event => {
                event.preventDefault();
                // const value = this.parent.copy();
                const value = this.request("copy");
                console.log("CUT", value);
                event.clipboardData.setData("text/plain", value || "");
                // clipboard.value = "";
                // this.parent.paste("");
                this.request("paste", "");
              }

              clipboard.element.oncopy = event => {
                event.preventDefault();
                // const value = this.parent.copy();
                const value = this.request("dispatch", "copy");
                console.log("COPY", value);
                event.clipboardData.setData("text/plain", value || "");
              }

              clipboard.element.onblur = event => {
                KarmaFieldsAlpha.Store.State.set(false, "focus");
              }

            }
          },
          {
            class: "popup",
            update: popup => {
              // const currentTableId = this.parent.getTable();
              let currentTableId = KarmaFieldsAlpha.Store.Layer.getTable();

              // const layer = this.request("getCurrentLayer");
              // let currentTableId = this.request("getCurrentLayer", "table");


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
                            navigation.child = this.getChild("menu").build();

                            // navigation.child = this.createChild({
                            //   ...this.resource.navigation,
                            //   type: "menu",
                            //   index: "menu"
                            // }, "menu").build();
                          }
                        }
                      },
                      // this.createChild({
                      //   index: "board",
                      //   type: "board",
                      //   tables: this.resource.tables
                      // }).build()
                      {
                        class: "tables",
                        update: container => {

                          // const currentTableId = this.request("getTable");
                          // const currentTableId = KarmaFieldsAlpha.Store.getTable();
                          // currentTableId = this.request("getCurrentLayer", "table");
                          currentTableId = KarmaFieldsAlpha.Store.Layer.getTable();


                          // document.body.classList.toggle("karma-table-open", Boolean(currentTableId));

                          container.children = Object.keys(this.resource.tables).map((tableId, index) => {
                            return {
                              class: "table-container",
                              update: async container => {

                                container.element.classList.toggle("hidden", tableId !== currentTableId);

                                if (tableId === currentTableId) {

                                  // container.children = [this.createChild({
                                  //   type: "table",
                                  //   ...this.resource.tables[tableId],
                                  //   // index: index
                                  //   index: tableId
                                  //   // uid: `${this.resource.uid}-${tableId}`
                                  // }).build()];

                                  container.children = [this.getChild(tableId).build()];

                                } else {

                                  container.children = [];

                                }
                              }
                            };
                          });
                        }
                      }
                    ]
                  }
                ]
              }
            }
          }
        ];
      }
    };

  }


}



KarmaFieldsAlpha.field.saucer.table = class extends KarmaFieldsAlpha.field {

  constructor(resource) {

    // compat

    if (resource.filters) {

      resource.header = {
        type: "group",
        children: [
          {
            type: "header"
          },
          {
            type: "group",
            display: "flex",
            ...resource.filters
          }
        ]
      }

    }

    super(resource);

  }

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

  dispatchTable(functionName, ...args) {

    return this.lift(["body"], functionName, ...args);

  }

  // follow(selection, callback) {
  //
  //   if (selection.final) {
  //
  //     return callback(this, selection);
  //
  //   } else if (selection.body && this.resource.body) {
  //
  //     const child = this.createChild({type: "grid", ...this.resource.body, index: "body"});
  //
  //     return child.follow(selection.body, callback);
  //
  //   }
  //
  // }

  // descend(selection, action) {
  //
  //   selection.body && this.resource.body) {
  //
  //     const child = this.createChild({type: "grid", ...this.resource.body, index: "body"});
  //
  //     return child.descend(selection.body, action);
  //
  //   }
  //
  // }

  // getSelectionChild(selection) {
  //
  //   if (selection && selection.body && this.resource.body) {
  //
  //     return this.createChild({type: "grid", ...this.resource.body, index: "body"});
  //
  //   }
  //
  // }


  getChild(index) {

    return this.createChild({...this.resource[index], index: index}, index);

  }

  // getHeader() {
  //
  //   return this.createChild({
  //     type: "header",
  //     ...this.resource.header,
  //     index: "header"
  //   }, "header");
  //
  // }

  // delete(selection = this.getSelection()) {
  //
  //   const child = this.getSelectionChild(selection);
  //
  //   if (child) {
  //
  //     child.delete(selection[child.resource.index]);
  //
  //   }
  //
  // }



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
            class: "karma-header table-header table-main-header simple-buttons",
            // child: this.createChild({
            //   type: "header",
            //   ...this.resource.header,
            //   // filters: this.resource.filters, // compat
            //   index: "header"
            // }).build()
            child: this.getChild("header").build()
          },
          {
            class: "table-body",
            update: container => {
              // container.element.classList.toggle("single-open", Boolean(modalOpen));


            },
            children: [
              // {
              //   class: "karma-field-table-section table-section karma-field-frame final",
              //   update: filters => {
              //     filters.element.classList.toggle("hidden", !this.resource.filters);
              //
              //     if (this.resource.filters) {
              //       filters.child = this.createChild({
              //         type: "group",
              //         ...this.resource.filters,
              //         index: "filters"
              //       }).build();
              //     }
              //   }
              // },
              // ...(this.resource.subsections || []).map(subsection => {
              //   return {
              //     class: "karma-field-table-section table-section karma-field-frame final",
              //     init: section => {
              //       if (subsection.style) {
              //         section.element.style = subsection.style;
              //       }
              //     },
              //     child: this.createChild({...subsection, index: index++}).build()
              //   };
              // }),
              {
                class: "table-body-columns",
                update: div => {

                  // const grid = this.createChild({
                  //   type: "grid",
                  //   ...this.resource.body,
                  //   index: "body"
                  // });

                  const grid = this.getChild("body");

                  // const selection = grid.getSelection();

                  // -> unselect
                  div.element.onmousedown = async event => {
                    event.stopPropagation();
                    event.preventDefault();
                    // grid.setSelection({final: true, index: 0, length: 0});
                    // this.deferFocus();
                    // this.request("updateCurrentLayer", {index: 0, length: 0}, "selection");


                    // console.log("saucer table mousedown");

                    // KarmaFieldsAlpha.Store.Layer.setSelection({index: 0, length: 0}, "selection");
                    // KarmaFieldsAlpha.Store.State.set(true, "focus");

                    // this.request("updateState", true, "focus");



                    await this.setFocus(true);
                    await this.request("render");

                    // this.request("unselect");
                  };

                  div.children = [
                    {
                      class: "karma-field-table-grid-container karma-field-frame karma-field-group final scroll-container table-body-column table-body-main-column",
                      // update: scrollContainer => {
                      //   this.getScrollContainer = () => scrollContainer.element;
                      // },
                      child: grid.build()
                    },
                    {
                      class: "grid-modal table-body-column karma-modal scroll-container table-body-side-column",
                      update: div => {

                        div.element.classList.toggle("hidden", !grid.resource.modal);

                        if (grid.resource.modal) {

                          const modal = grid.getModal();

                          div.element.style.width = grid.resource.modal.width || "30em";
                          div.element.onmousedown = async event => {
                            event.stopPropagation(); // -> prevent unselecting

                            // grid.clearModalSelection();

                            await grid.setFocus();

                            await this.render();
                          };

                          if (modal) {
                            div.child = modal.build();
                          } else {
                            div.children = [];
                          }
                          div.element.classList.toggle("active", Boolean(modal));
                        }
                      }
                    }
                  ];

                  // div.children = [
                  //   {
                  //     class: "table-body-column table-content",
                  //     // child: grid.build()
                  //     child: {
                  //       class: "table-body-columns",
                  //       children: [
                  //         {
                  //           class: "karma-field-table-grid-container karma-field-frame karma-field-group final scroll-container table-body-column table-body-main-column",
                  //           update: scrollContainer => {
                  //             this.getScrollContainer = () => scrollContainer.element;
                  //           },
                  //           child: grid.build()
                  //         },
                  //         {
                  //           class: "grid-modal table-body-column karma-modal scroll-container table-body-side-column",
                  //           update: div => {
                  //
                  //             div.element.classList.toggle("hidden", !grid.resource.modal);
                  //
                  //             if (grid.resource.modal) {
                  //
                  //               const modal = grid.getModal();
                  //
                  //               div.element.style.width = grid.resource.modal.width || "30em";
                  //               div.element.onmousedown = event => {
                  //                 event.stopPropagation(); // -> prevent unselecting
                  //
                  //                 grid.clearModalSelection();
                  //
                  //                 this.render();
                  //               };
                  //
                  //               if (modal) {
                  //                 div.child = modal.build();
                  //               } else {
                  //                 div.children = [];
                  //               }
                  //               div.element.classList.toggle("active", Boolean(modal));
                  //             }
                  //           }
                  //         }
                  //       ]
                  //     }
                  //   },
                  //   {
                  //     class: "table-body-column table-modal karma-modal",
                  //     update: container => {
                  //
                  //       container.element.classList.toggle("hidden", !this.resource.modal);
                  //
                  //       if (this.resource.modal) {
                  //         container.element.style.width = this.resource.modal.width || "30em";
                  //         container.child = this.createChild({
                  //           type: "group",
                  //           ...this.resource.modal,
                  //           index: "modal"
                  //         }).build();
                  //       }
                  //     }
                  //   }
                  // ]
                }
              }
            ]
          },
          {
            class: "table-footer table-control",
            update: footer => {
              const isLoading = this.request("hasTask");
              const footerResource = this.resource.controls || this.resource.footer; // compat
              footer.element.classList.toggle("hidden", footerResource === false);
              footer.element.classList.toggle("loading", Boolean(isLoading));
              if (footerResource !== false) {
                footer.child = this.createChild({
                  type: "controls",
                  ...footerResource,
                  index: "controls"
                }, "footer").build();
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

  getChild() {

    const items = this.getItems();

    if (items[index]) {

      const item = items[index];

      return this.createChild({
        items: item.items || item.children || [],
        type: "menu"
      }, index);

    }

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
                    this.request("open", item.table, item.params || {}, true);
                  }
                  // const currentTable = this.request("getCurrentLayer", "table");
                  const currentTable = KarmaFieldsAlpha.Layer.getTable();
                  a.element.classList.toggle("active", currentTable === item.table);
                }
                if (item.action) {
                  a.element.onclick = event => {
                    event.preventDefault();
                    this.request(item.action, ...item.values);
                  }
                }
              }
            },
            this.createChild({
              items: item.items || item.children || [],
              type: "menu"
            }, index).build()
          ],
          update: li => {
            // const currentTable = this.request("getCurrentLayer", "table");
            const currentTable = KarmaFieldsAlpha.Layer.getTable();
            const active = this.resource.table && this.resource.table === currentTable;
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

// KarmaFieldsAlpha.field.saucer.save = {
//   type: "button",
//   action: "send",
//   title: "Save",
//   text: "Save",
//   enabled: ["request", "hasChange"],
//   primary: true
// }

KarmaFieldsAlpha.field.saucer.save = class extends KarmaFieldsAlpha.field.button {

  constructor(resource) {
    super({
      action: "send",
      title: "Save",
      text: "Save",
      enabled: ["request", "hasChange"],
      primary: true,
      ...resource
    });
  }

}

KarmaFieldsAlpha.field.saucer.add = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      action: "request",
      values: ["dispatchTable", "add"],
      title: "Add",
      text: "Add",
      ...resource
    });
  }
}

KarmaFieldsAlpha.field.saucer.delete = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      command: "delete",
      title: "Delete",
      text: "Delete",
      // enabled: ["request", "canDelete"],
      enabled: ["request", "dispatchTable", "getSelectedItems"],
      ...resource
    });
  }

}

KarmaFieldsAlpha.field.saucer.undo = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      action: "undo",
      dashicon: "undo",
      disabled: ["!", ["request", "hasUndo"]],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.saucer.redo = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      action: "redo",
      dashicon: "redo",
      disabled: ["!", ["request", "hasRedo"]],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.saucer.insert = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      action: "insert",
      primary: true,
      text: "Insert",
      // enabled: ["request", "isTableRowSelected"],
      enabled: ["request", "dispatch", "getSelectedItems"],
      // visible: ["request", "hasTransfer"],
      visible: ["request", "canInsert"],
      ...resource
    });
  }
}





// KarmaFieldsAlpha.field.saucer.upload = {
//   type: "button",
//   action: "upload",
//   title: "Upload File"
// }


KarmaFieldsAlpha.field.saucer.header = class extends KarmaFieldsAlpha.field.container {

  constructor(resource) {

    // if (resource.filters) {
    //
    //   // compat
    //
    //   super({
    //     type: "group",
    //     index: "header",
    //     children: [
    //       {
    //         display: "flex",
    //         children: [
    //           "title",
    //           "count",
    //           "pagination",
    //           "close"
    //         ]
    //         // ...resource,
    //         // filters: null // -> prevent infinite loop
    //       },
    //       {
    //         type: "group",
    //         ...resource.filters
    //       }
    //     ]
    //   });
    //
    // } else {

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

    // }



  }

}

KarmaFieldsAlpha.field.saucer.title = class extends KarmaFieldsAlpha.field.text {


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

KarmaFieldsAlpha.field.saucer.count = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      style: "justify-content:center;white-space: nowrap;",
      value: ["replace", "# elements", "#", ["request", "count"]],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.saucer.close = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      dashicon: "no",
      title: "Close",
      action: "close",
      ...resource
    });
  }
}


KarmaFieldsAlpha.field.saucer.pagination = class extends KarmaFieldsAlpha.field.container {

  constructor(resource) {

    super({
      type: "group",
      display: "flex",
      style: "flex: 0 1 auto;min-width:0",
      // visible: [">", ["request", "getNumPage"], 1],
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

KarmaFieldsAlpha.field.saucer.pagination.firstpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      action: "firstPage",
      title: "First Page",
      text: "«",
      disabled: ["==", ["request", "getPage"], 1],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.saucer.pagination.prevpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      action: "prevPage",
      title: "Previous Page",
      text: "‹",
      disabled: ["==", ["request", "getPage"], 1],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.saucer.pagination.currentpage = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      style: "min-width: 4em;text-align: right;",
      value: ["replace", "# / #", "#", ["request", "getPage"], ["request", "getNumPage"]],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.saucer.pagination.nextpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      action: "nextPage",
      title: "Next Page",
      text: "›",
      loading: ["request", "getNumPage"],
      disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.saucer.pagination.lastpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      action: "lastPage",
      title: "Last Page",
      text: "»",
      loading: ["request", "getNumPage"],
      disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]],
      ...resource
    });
  }
}
