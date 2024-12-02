
KarmaFieldsAlpha.field.saucer = class extends KarmaFieldsAlpha.field {

  constructor(resource, id, parent) {

    super(resource, id, parent);

    // this.focusId = "";
    // this.clipboard = false;
    //
    // this.states = {};

    KarmaFieldsAlpha.server = new KarmaFieldsAlpha.Server();

  }

  // useClipboard() {
  //
  //   return KarmaFieldsAlpha.server.queryState("fields", "", "clipboard") || false;
  //
  // }
  //
  // getFocus() {
  //
  //   return KarmaFieldsAlpha.server.queryState("fields", "", "focus") || "";
  //
  // }
  //
  // async setFocus(useClipboard, fieldId) {
  //
  //   await KarmaFieldsAlpha.server.setState(useClipboard, "fields", "", "clipboard");
  //   await KarmaFieldsAlpha.server.setState(fieldId, "fields", "", "focus");
  //
  //   // await KarmaFieldsAlpha.Database.States.set(fieldId, "internal", "fields", "", "focus");
  //   // await KarmaFieldsAlpha.Database.States.set(useClipboard, "internal", "fields", "", "clipboard");
  //   // await KarmaFieldsAlpha.History.write(fieldId, this.focusId, "internal", "fields", "", "focus"); // update history
  //   // await KarmaFieldsAlpha.History.write(useClipboard, this.clipboard, "internal", "fields", "", "focus"); // update history
  //   //
  //   // this.focusId = fieldId;
  //   // this.clipboard = useClipboard;
  //
  // }
  //
  // removeFocus() {
  //
  //   return this.setFocus(false, "");
  //
  // }
  //
  // // async initFocus() {
  // //
  // //   this.focusId = await KarmaFieldsAlpha.Database.States.get("internal", "fields", "", "focus");
  // //   this.clipboard = await KarmaFieldsAlpha.Database.States.get("internal", "fields", "", "clipboard");
  // //
  // // }
  //
  //
  // getState(key, fieldId) {
  //
  //   // return KarmaFieldsAlpha.DeepObject.get(this.states, fieldId, key);
  //   return KarmaFieldsAlpha.server.queryState("fields", fieldId, key);
  //
  // }
  //
  // setState(value, key, fieldId) {
  //
  //   // const current = KarmaFieldsAlpha.DeepObject.get(this.states, fieldId, key);
  //   //
  //   // await KarmaFieldsAlpha.Database.States.set(fieldId, "internal", "fields", fieldId, key);
  //   // await KarmaFieldsAlpha.History.write(useClipboard, current, "internal", "fields", fieldId, key); // update history
  //   //
  //   // KarmaFieldsAlpha.DeepObject.set(this.states, fieldId, key);
  //
  //   return KarmaFieldsAlpha.server.setState(value, "fields", fieldId, key);
  //
  // }


  getContent(key) {

    const searchParams = new URLSearchParams(location.search);

    const value = searchParams.get(key) || undefined; // -> method get return null if empty

    return new KarmaFieldsAlpha.Content(value);

  }

  setContent(content, key) {

    // ?? what to do?

  }

  removeContent(key) {

  }

  getFocusField() {

    // const focus = this.getFocus();

    const path = this.getFocusPath() || [];

    if (path.length) {

      return this.getChild(...path.slice(1));

    }

  }


  undo() {

    history.back();

  }

  redo() {

    history.forward();

  }

  hasUndo() {

    return KarmaFieldsAlpha.History.hasUndo();

  }

  hasRedo() {

    return KarmaFieldsAlpha.History.hasRedo();

  }

  newChild(index) {

    if (index === "board") {

      return this.createChild({
        type: "board"
        // tables: this.resource.tables // -> to be removed
      }, "board");

    } else {

      if (KarmaFieldsAlpha.embeds[index]) {

        return this.createChild(KarmaFieldsAlpha.embeds[index], index);

      }

    }

  }


  async abduct() {

    const embeds = KarmaFieldsAlpha.embeds;

    if (embeds) {

      for (let index in embeds) {

        const resource = embeds[index];

        const element = document.getElementById(index);

        const child = this.createChild(resource, index);

        await KarmaFieldsAlpha.build(child.build(), element, element.firstElementChild);

      }

      const focus = this.getFocus();

      document.body.classList.toggle("karma-table-open", focus.includes("popup"));

    }

  }

  async loop() {

    // KarmaFieldsAlpha.server = new KarmaFieldsAlpha.Server();

    if (this.rendering) {

      console.warn("Rendering under process!", this);

    }

    // console.log("rendering");

    // if (!this.rendering) {

      this.rendering = true;

      for (let index in KarmaFieldsAlpha.embeds) {
        document.getElementById(index).classList.add("container-loading");
      }

      await KarmaFieldsAlpha.server.init();

      await this.abduct();

      while (KarmaFieldsAlpha.server.hasOrder()) {

        await KarmaFieldsAlpha.server.process();

        await this.abduct();

      }

      for (let index in KarmaFieldsAlpha.embeds) {
        document.getElementById(index).classList.remove("container-loading");
      }

      this.rendering = false;

    // } else {
    //
    //   console.warn("Rendering under process!", this);
    //
    // }

  }



  // async *generator() {
  //
  //   let works = KarmaFieldsAlpha.Store.get("works");
  //
  //   for (work of works) {
  //
  //     yield* work;
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.remove("works");
  //
  // }

  render() {

    // if (!this.rendering) {
    //
    //   this.rendering = this.loop().then(() => this.rendering = null);
    //
    // }
    //
    // return this.rendering;

    // KarmaFieldsAlpha.rendering = this.loop();
    //
    // return KarmaFieldsAlpha.rendering;

    return this.loop();

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





  // isMediaTable(tableId) {
  //
  //   return this.resource.tables[tableId] && this.resource.tables[tableId].body && this.resource.tables[tableId].body.type === "medias";
  // }
  //
  // getMediaTable() {
  //
  //   for (let tableId in this.resource.tables) {
  //
  //     if (this.isMediaTable(tableId)) {
  //
  //       return tableId;
  //
  //     }
  //
  //   }
  //
  // }
  //
  // async upload(files, index = 0, length = 0) {
  //
  //
  //   let tableId = this.getTable();
  //
  //   if (!this.isMediaTable(tableId)) {
  //
  //     tableId = this.getMediaTable();
  //
  //     if (tableId) {
  //
  //       this.setTable(tableId);
  //
  //       await this.render();
  //
  //     }
  //
  //
  //   }
  //
  //   if (tableId) {
  //
  //     let grid = this.getGrid(tableId);
  //
  //     grid.upload(files);
  //
  //   } else {
  //
  //     console.warn("No medias table found to upload file");
  //
  //   }
  //
  // }



}


KarmaFieldsAlpha.field.saucer.board = class extends KarmaFieldsAlpha.field {

  build() {
    return {
      class: "saucer",
      init: container => {

        document.addEventListener("keydown", async event => {
          if (event.key === "s" && event.metaKey) {
            event.preventDefault();
            const field = await this.getFocusField();
            await field.request("submit");
            await this.request("render");
          } else if (event.key === "z" && event.metaKey) {
            // event.preventDefault();
            // if (event.shiftKey) {
            //   KarmaFieldsAlpha.History.redo();
            // } else {
            //   KarmaFieldsAlpha.History.undo();
            // }
          }
        });
        window.addEventListener("popstate", async event => {
          KarmaFieldsAlpha.server = new KarmaFieldsAlpha.Server();
          
          await KarmaFieldsAlpha.History.update();
          await this.parent.render();
        });

        window.addEventListener("mousedown", async event => {

          const focus = this.getFocus();

          if (focus) {
            await this.removeFocus();
            await this.request("render");
          }
        });
      },
      update: saucer => {
        saucer.children = [
          {
            class: "clipboard",
            tag: "textarea",
            update: clipboard => {
              clipboard.element.id = "karma-fields-alpha-clipboard";
              clipboard.readOnly = true;
              const useClipboard = this.useClipboard();
              if (useClipboard) {
                clipboard.element.focus({preventScroll: true});
              }
              clipboard.element.onkeydown = async event => {
                if (event.key === "z" && event.metaKey) {
                  event.preventDefault();
                  if (event.shiftKey) {
                    KarmaFieldsAlpha.History.redo();
                  } else {
                    KarmaFieldsAlpha.History.undo();
                  }
                }
                if (event.key === "a" && event.metaKey) {
                  event.preventDefault();
                  const field = this.getFocusField();
                  await field.selectAll();
                  await this.render();
                }
                if (event.key === "Delete" || event.key === "Backspace") {
                  event.preventDefault();
                  const field = this.getFocusField();
                  await field.delete();
                  await this.render();

                } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                  event.preventDefault();
                  // this.request(event.key);
                }
              }

              clipboard.element.onpaste = async event => {
                event.preventDefault();
                const string = event.clipboardData.getData("text/plain").normalize();
                console.log("PASTE", string);
                const field = this.getFocusField();

                await field.paste(string);
                await this.request("render");
              }

              clipboard.element.oncut = async event => {
                event.preventDefault();
                const field = this.getFocusField();
                const value = field.copy();
                console.log("CUT", value);
                event.clipboardData.setData("text/plain", value || "");
                await field.paste("");
                await this.request("render");
              }

              clipboard.element.oncopy = async event => {
                event.preventDefault();
                const field = this.getFocusField();
                const value = field.copy();
                console.log("COPY", value);
                event.clipboardData.setData("text/plain", value || "");
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

KarmaFieldsAlpha.field.save = class extends KarmaFieldsAlpha.field.button {

  constructor(resource, id, parent) {
    super({
      action: "submit",
      title: "Save",
      text: "Save",
      enabled: ["request", "hasDelta"],
      primary: true,
      ...resource
    }, id, parent);
  }

}

KarmaFieldsAlpha.field.undo = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      // action: "undo",
      request: ["undo"],
      dashicon: "undo",
      disabled: ["!", ["request", "hasUndo"]],
      ...resource
    }, id, parent);
  }
}
KarmaFieldsAlpha.field.redo = class extends KarmaFieldsAlpha.field.button {
  constructor(resource, id, parent) {
    super({
      // action: "redo",
      request:[ "redo"],
      dashicon: "redo",
      disabled: ["!", ["request", "hasRedo"]],
      ...resource
    }, id, parent);
  }
}



// document.addEventListener("paste", event => {
//
//   debugger;
//
//   console.log(event);
//    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
//    console.log(items);
//
//
// });

// window.addEventListener("copy", event => {
//
//
//   event.clipboardData.setData("text/plain", "aaaa");
//   event.preventDefault();
//
// });
