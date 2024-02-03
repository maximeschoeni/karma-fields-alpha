
KarmaFieldsAlpha.field.saucer = class extends KarmaFieldsAlpha.field {

  constructor(resource) {

    super(resource);

  }

  getGrid(tableId) { // deprecated

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

  setContent(content, key) {

    const value = content.toArray().join(",")

    KarmaFieldsAlpha.Store.Layer.setParam(value, key);

    if (key !== "page") {

      const page = KarmaFieldsAlpha.Store.Layer.getParam("page");

      if (page !== 1) {

        KarmaFieldsAlpha.Store.Layer.setParam(1, "page");

      }

    }

    // KarmaFieldsAlpha.Store.Layer.removeItems();

    // KarmaFieldsAlpha.Store.remove("vars");
    // KarmaFieldsAlpha.Store.remove("items");
    // KarmaFieldsAlpha.Store.remove("counts");

    KarmaFieldsAlpha.Store.clear();

  }

  removeContent(key) {

    KarmaFieldsAlpha.Store.Layer.removeParam(key);

    const page = KarmaFieldsAlpha.Store.Layer.getParam("page");

    if (page !== 1) {

      KarmaFieldsAlpha.Store.Layer.setParam(1, "page");

    }

    KarmaFieldsAlpha.Store.Layer.removeItems();

  }

  dispatch(functionName, ...args) {

    const focus = this.getFocus();

    if (focus) {

      return this.lift(focus, functionName, ...args);

    }

  }

  root(...args) {

    return this.lift(...args);

  }

  tunnel(offset = 0, functionName, ...args) {

    const layerIndex = KarmaFieldsAlpha.Store.Layer.getIndex() || 0;

    const focus = KarmaFieldsAlpha.Store.Layer.get(layerIndex + offset, "focus");

    if (focus) {

      return this.lift(focus, functionName, ...args);

    }

  }

  insertable() {

    // const layerIndex = KarmaFieldsAlpha.Store.Layer.getIndex();
    // const focus = KarmaFieldsAlpha.Store.Layer.get(layerIndex-1, "focus");
    //
    // if (focus) {
    //
    //   return this.lift(focus, "isInsertable");
    //
    // }
    //
    // return false;

    return tunnel(-1, "useSocket");
  }

  getItemsUnder() {

    // const layerIndex = KarmaFieldsAlpha.Store.Layer.getIndex();
    // const focus = KarmaFieldsAlpha.Store.Layer.get(layerIndex-1, "focus");
    //
    // if (focus) {
    //
    //   return this.lift(focus, "getSelectedItems");
    //
    // }

    return this.tunnel(-1, "getSelectedItems");

  }



  // dispatchGrid(functionName, ...args) {
  //
  //   const table = KarmaFieldsAlpha.Store.Layer.getTable();
  //
  //   return this.lift(["board", table, "body"], functionName, ...args);
  //
  // }

  undo() {

    KarmaFieldsAlpha.Store.Tasks.add({
      name: "Undo...",
      type: "history",
      resolve: () => KarmaFieldsAlpha.History.undo()
    });

    this.render();

  }

  redo() {

    KarmaFieldsAlpha.Store.Tasks.add({
      name: "Redo...",
      type: "history",
      resolve: () => KarmaFieldsAlpha.History.redo()
    });

    this.render();

  }

  hasUndo() {

    return new KarmaFieldsAlpha.Content(KarmaFieldsAlpha.History.hasUndo());

  }

  hasRedo() {

    return new KarmaFieldsAlpha.Content(KarmaFieldsAlpha.History.hasRedo());

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

  canDelete() {

    return this.dispatch("canDelete");

  }

  submit() {

    KarmaFieldsAlpha.Driver.sync();

    let task = KarmaFieldsAlpha.Store.Tasks.find(task => task.type === "save");

    if (!task) {

      task = new KarmaFieldsAlpha.Task.Save();

      KarmaFieldsAlpha.Task.add(task);

      this.render();

    }



  }

  isSaving() {

    return Boolean(KarmaFieldsAlpha.Store.Tasks.find(task => task.type === "save"));

  }

  // submit() {
  //
  //   this.send();
  //
  // }

  delta() {

    return KarmaFieldsAlpha.Driver.delta();

    // const delta = KarmaFieldsAlpha.Store.Delta.get("vars");
    //
		// if (delta) {
    //
		// 	// const vars = KarmaFieldsAlpha.Store.get() || {};
    //   //
		// 	// return !KarmaFieldsAlpha.DeepObject.include(vars, delta);
    //
    //
    //   for (let driver in delta) {
    //
    //     for (let id in delta[driver]) {
    //
    //       for (let key in delta[driver][id]) {
    //
    //         const deltaValue = delta[driver][id][key];
    //         const refValue = KarmaFieldsAlpha.Store.get(driver, id, key);
    //
    //         if (!KarmaFieldsAlpha.DeepObject.equal(deltaValue, refValue)) {
    //
    //           return true;
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
    //
		// return false;

  }

  hasTask(priorityLevel) {

    const tasks = KarmaFieldsAlpha.Store.get("tasks");

    // if (priorityLevel !== undefined) {
    //
    //   return tasks && tasks.some(task => !task.priority || task.priority >)
    //
    // }
    //
    // return tasks && tasks.length > 0 || false;

    return tasks && tasks.some(task => !task.priority || task.priority >= 0);

  }


  open(table, params, replace = false, selectedIds = []) {

    const resource = this.getTableResource(table);

    let index = KarmaFieldsAlpha.Store.Layer.getIndex() || 0;

    // this.save(`open-${table}`, `Open ${table}`);

    if (!replace) {

      index++;

      KarmaFieldsAlpha.Store.Layer.setIndex(index);

    }

    // KarmaFieldsAlpha.Store.remove("vars");
    // KarmaFieldsAlpha.Store.remove("queries");
    // KarmaFieldsAlpha.Store.remove("counts");

    // const newLayer = {
    //   table: table,
    //   params: {
    //     ...resource.body.params,
    //     ...params
    //   },
    //   focus: ["board", table, "body"],
    // };
    //
    // KarmaFieldsAlpha.Store.Layer.set(newLayer, index);

    const bodyParams = this.parse(resource.body.params);

    if (bodyParams.loading) {

      KarmaFieldsAlpha.Store.Tasks.add({
        type: "open",
        resolve: () => {
          this.open(table, params, replace);
        }
      });

      return;

    }

    KarmaFieldsAlpha.Store.Layer.set(table, index, "table");
    KarmaFieldsAlpha.Store.Layer.set({...bodyParams.toObject(), ...params}, index, "params");
    KarmaFieldsAlpha.Store.Layer.set(["board", table, "body"], index, "focus");

    if (selectedIds.length) { // deprecated

      KarmaFieldsAlpha.Store.Tasks.add({
        type: "preselect",
        resolve: () => {
          this.dispatch("selectByIds", selectedIds);
        }
      });

    }

    // this.render();

  }

  removeLayer() {

    KarmaFieldsAlpha.Store.Layer.close();

  }

  close() {

    let index = KarmaFieldsAlpha.Store.Layer.getIndex();

    if (index) {

      // this.save(`close`, `Close`);

      KarmaFieldsAlpha.Store.State.remove("layers", index);
      KarmaFieldsAlpha.Store.Layer.setIndex(index-1);

      // this.render();

    }

  }


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

      let tasks = KarmaFieldsAlpha.Store.get("tasks");

      if (tasks) {

        // if (!tasks.length) {
        //
        //   tasks = [{
        //     type: "tick",
        //     resolve: async task => {
        //       await new Promise((resolve) => {
        //         setTimeout(resolve, 1000);
        //       });
        //     }
        //   }];
        //
        // }

        tasks.sort((a, b) => (b.priority || 0) - (a.priority || 0));

        task = tasks.shift();

        if (task) {

          KarmaFieldsAlpha.Store.set(tasks, "tasks");

          await task.resolve(task);

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

//   medias(...args) {
//
//     const mediaTableResource = this.resource.tables[KarmaFieldsAlpha.mediaTable];
// debugger;
//     if (mediaTableResource) {
//
//       const table = this.createChild({
//         ...mediaTableResource,
//         type: "table"
//       }, "medias");
//
//       table.body(...args);
//
//     }
//
//   }





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

  }

}


KarmaFieldsAlpha.field.saucer.board = class extends KarmaFieldsAlpha.field {

  getGrid(tableId) {

    const table = this.createChild({
      type: "table",
      ...this.resource.tables[tableId],
      index: tableId
    });

    return table.getGrid();

  }

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

  build() {
    return {
      class: "saucer",
      init: async container => {
        document.addEventListener("keydown", event => {
          if (event.key === "s" && event.metaKey) {
            event.preventDefault();
            // this.parent.send();
            this.request("send");
          } else if (event.key === "z" && event.metaKey) {
            event.preventDefault();
            if (event.shiftKey) {
              // console.log("redo");
              // this.parent.redo();
              this.request("redo");
            } else {
              // console.log("undo");
              // debugger;
              // this.parent.undo();
              this.request("undo");
            }
          }
        });
        window.addEventListener("popstate", event => {
          // console.log("popstate", location.hash);
          KarmaFieldsAlpha.History.update();
          this.parent.render();
        });

        window.addEventListener("mousedown", event => {

          // console.log("mousedown", KarmaFieldsAlpha.Store.Layer.getCurrent("focus"));



          if (KarmaFieldsAlpha.Store.Layer.getSelection() || KarmaFieldsAlpha.Store.Layer.getCurrent("focus")) {
            KarmaFieldsAlpha.Store.Layer.removeSelection();
            KarmaFieldsAlpha.Store.Layer.removeCurrent("focus");
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
        //
        // container.element.ondragover = event => {
        //   event.preventDefault();
        // }


        // Unofficial Graphical User Interface Table API

        // console.log(history.state);





        const buffer = history.state && history.state.karma && await KarmaFieldsAlpha.Database.Records.get(history.state.karma);

        if (buffer && false) {

          KarmaFieldsAlpha.Store.set(buffer, "buffer");

        } else {

          const recordId = Date.now();
          // const day = 1*24*60*60*1000;
          //
          // await KarmaFieldsAlpha.Database.Records.deleteBefore(recordId - day);
          // await KarmaFieldsAlpha.Database.History.deleteBefore(recordId - day);

          await KarmaFieldsAlpha.Database.Records.deleteBefore(recordId);
          await KarmaFieldsAlpha.Database.History.deleteBefore(recordId);

          history.replaceState({karma: recordId}, "");

          KarmaFieldsAlpha.Store.Buffer.add(recordId);


          // await KarmaFieldsAlpha.History.init(); // -> empty history

        }


      },
      update: saucer => {

        saucer.children = [
          {
            class: "clipboard",
            tag: "textarea",
            update: clipboard => {
              clipboard.element.id = "karma-fields-alpha-clipboard";
              clipboard.readOnly = true;

              const useClipboard = KarmaFieldsAlpha.Store.State.get("clipboard");

              if (useClipboard) {

                clipboard.element.focus({preventScroll: true});

              }

              clipboard.element.onkeydown = event => {

                if (event.key === "a" && event.metaKey) {
                  event.preventDefault();
                  // this.parent.selectAll();
                  this.request("dispatch", "selectAll");
                }

                if (event.key === "Delete" || event.key === "Backspace") {
                  event.preventDefault();
                  // this.parent.delete();
                  this.request("dispatch", "delete");
                } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                  event.preventDefault();

                  this.request(event.key);

                }
              }

              clipboard.element.onpaste = event => {
                event.preventDefault();
                const string = event.clipboardData.getData("text/plain").normalize();
                // debugger;
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
                // KarmaFieldsAlpha.Store.State.set(false, "focus");

                // this.removeFocus();
              }

            }
          },
          {
            class: "popup",
            update: popup => {

              let currentTableId = KarmaFieldsAlpha.Store.Layer.getTable();

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
                          }
                        }
                      },

                      {
                        class: "tables",
                        update: container => {

                          currentTableId = KarmaFieldsAlpha.Store.Layer.getTable();

                          container.children = Object.keys(this.resource.tables).map((tableId, index) => {
                            return {
                              class: "table-container",
                              update: container => {

                                container.element.classList.toggle("hidden", tableId !== currentTableId);

                                if (tableId === currentTableId) {

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


  // getGrid(tableId) {
  //
  //   return this.createChild({
  //     ...this.resource.body,
  //     index: "body"
  //   });
  //
  // }

  getBody() {

    return this.getChild("body");

  }

  body(functionName, ...args) {

    return this.lift(["body"], functionName, ...args);

  }

  getChild(index) {

    return this.createChild({
      ...this.resource[index],
      index: index
    }, index);

  }

  setContent(content, ...path) {

    super.setContent(content, ...path);

    this.body("removeSelection");

  }

  build() {

    return {
      class: "karma-field-table",
      update: div => {

        let index = 0;

        div.children = [
          {
            class: "karma-header table-header table-main-header simple-buttons",

            child: this.getChild("header").build()
          },
          {
            class: "table-body",
            update: container => {

              // container.element.ondrop = event => {
              //   event.preventDefault();
              //   debugger;
              //   // const files = event.dataTransfer.files;
              //   // if (event.dataTransfer.files.length) {
              //   //   this.parent.upload(event.dataTransfer.files);
              //   // }
              // }
              //
              // container.element.ondragover = event => {
              //   event.preventDefault();
              //   container.element.classList.add("drop-active");
              // }
              // container.element.ondragleave = event => {
              //   event.preventDefault();
              //   container.element.classList.remove("drop-active");
              // }




            },
            children: [

              {
                class: "table-body-columns",
                update: div => {

                  const body = this.getChild("body");



                  // -> unselect
                  div.element.onmousedown = event => {
                    event.stopPropagation();
                    event.preventDefault();

                    this.setFocus(true);
                    this.request("render");
                  };

                  div.children = [
                    {
                      class: "karma-field-table-grid-container karma-field-frame karma-field-group final scroll-container table-body-column table-body-main-column",
                      child: body.build()
                    },
                    {
                      class: "grid-modal table-body-column karma-modal scroll-container table-body-side-column",
                      update: div => {

                        div.element.classList.toggle("hidden", !body.resource.modal);

                        if (body.resource.modal) {

                          const modal = body.getModal();

                          div.element.style.width = body.resource.modal.width || "30em";
                          div.element.onmousedown = event => {
                            event.stopPropagation(); // -> prevent unselecting

                            this.setFocus(true);
                            this.request("render");
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
                  type: "footer",
                  ...footerResource,
                  index: "footer"
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



KarmaFieldsAlpha.field.saucer.footer = class extends KarmaFieldsAlpha.field.group {

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

KarmaFieldsAlpha.field.saucer.save = class extends KarmaFieldsAlpha.field.button {

  constructor(resource) {
    super({
      // action: "send",
      request: ["submit"],
      title: "Save",
      text: "Save",
      enabled: ["request", "delta"],
      primary: true,
      ...resource
    });
  }

}

KarmaFieldsAlpha.field.saucer.add = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      // action: "request",
      request: ["body", "add"],
      title: "Add",
      text: "Add",
      ...resource
    });
  }
}

KarmaFieldsAlpha.field.saucer.delete = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      request: ["body", "deleteSelection"],
      // action: "delete",
      title: "Delete",
      text: "Delete",
      // enabled: ["request", "canDelete"],
      enabled: ["request", "body", "getSelectedItems"],
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
      request: ["body", "withdraw"],
      primary: true,
      text: "Insert",
      // enabled: ["request", "isTableRowSelected"],
      // enabled: ["request", "dispatch", "getSelectedItems"],
      enabled: ["request", "body", "getSelectedItems"],
      // visible: ["request", "hasTransfer"],
      // visible: ["request", "insertable"],
      visible: ["request", "tunnel", -1, "useSocket"],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.saucer.export = class extends KarmaFieldsAlpha.field.download {
  constructor(resource) {
    super({
      text: "Export",
      ...resource
    });
  }
}



KarmaFieldsAlpha.field.saucer.header = class extends KarmaFieldsAlpha.field.group {

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
      value: ["replace", "# elements", "#", ["request", "body", "getCount"]],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.saucer.close = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      dashicon: "no",
      title: "Close",
      request: ["close"],
      ...resource
    });
  }
}


KarmaFieldsAlpha.field.saucer.pagination = class extends KarmaFieldsAlpha.field.group {

  constructor(resource) {

    super({
      type: "group",
      display: "flex",
      style: "flex: 0 1 auto;min-width:0",
      // visible: [">", ["request", "body", "getNumPage"], 1],
      hidden: ["=", ["request", "body", "getNumPage"], 1],
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
      request: ["body", "firstPage"],
      title: "First Page",
      text: "«",
      disabled: ["==", ["request", "body", "getPage"], 1],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.saucer.pagination.prevpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      request: ["body", "prevPage"],
      title: "Previous Page",
      text: "‹",
      disabled: ["==", ["request", "body", "getPage"], 1],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.saucer.pagination.currentpage = class extends KarmaFieldsAlpha.field.text {
  constructor(resource) {
    super({
      style: "font-family: monospace;", //"min-width: 4em;text-align: right;",
      value: ["replace", "#/#", "#", ["request", "body", "getPage"], ["request", "body", "getNumPage"]],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.saucer.pagination.nextpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      request: ["body", "nextPage"],
      title: "Next Page",
      text: "›",
      disabled: ["==", ["request", "body", "getPage"], ["request", "body", "getNumPage"]],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.saucer.pagination.lastpage = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      request: ["body", "lastPage"],
      title: "Last Page",
      text: "»",
      disabled: ["==", ["request", "body", "getPage"], ["request", "body", "getNumPage"]],
      ...resource
    });
  }
}
