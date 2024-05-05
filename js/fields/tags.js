
KarmaFieldsAlpha.field.tags = class extends KarmaFieldsAlpha.field.form {

  newChild(index) {

    if (index === "body") {

      return new KarmaFieldsAlpha.field.tagsList(this.resource, "body", this);

    }

  }


  // getChild(index) {
  //
  //   if (index === "body") {
  //
  //     return this.createChild({
  //       type: "tagsList",
  //       // key: this.resource.key,
  //       ...this.resource.body
  //     }, "body");
  //
  //   } else if (index === "controls") {
  //
  //     return this.createChild({
  //       type: "controls",
  //       ...this.resource.controls
  //     }, "controls");
  //
  //   }
  //
  // }

  getChild(index, ...path) {

    let child = this.newChild(index);

    if (child && path.length) {

      return child.getChild(...path);

    }

    return child;

  }


  getTable() {

    return this.parse(this.resource.table);

  }

  getParams() {

    return this.parse(this.resource.params);

  }

  getDriver() {

    if (this.resource.driver) {

      return this.resource.driver;

    } else {

      const table = this.resource.table;
      const resource = KarmaFieldsAlpha.saucer.resource.tables[table];

      if (resource) {

        return resource.driver;

      } else {

        console.error("Table resource not found:", table);

      }

    }

  }

  hasSelection() {

    if (this.resource.body) {

      const body = this.createChild(this.resource.body, "body");

      if (body && body.hasSelection) {

        return body.hasSelection();

      }

    }

    return false;

  }

  async *add() {

    // const content = this.getContent();
    //
    // if (content.loading) {
    //
    //   this.addTask(() => add(), "add");
    //
    //   this.request("render");
    //
    // } else {
    //
    //
    //
    // }

    const length = this.getIds().toArray().length;

    this.setSelection({index: length, length: 0});

    yield* this.edit();

  }

  async *edit() {

    let table = this.getTable();

    while (table.loading) {

      yield;
      table = this.getTable();

    }

    let params = this.getParams();

    while (params.loading) {

      yield;
      params = this.getParams();

    }

    const ids = this.getSelectedIds();

    this.save("edit-tag", "Edit Tag");

    this.setFocus(true);
    // const popup = this.request("popup", table.toString(), params.toObject());

    const popup = this.getField("board", table.toString());
    // const tableField = this.getField("board", table.toString(), "table");

    // return this.lift(["board", tableName], "open", params);

    popup.open();


    const tableField = popup.getChild("table");

    tableField.setState(params.toObject(), "params");

    // if (ids.length) {

      // yield;
      // this.request("dispatch", "selectByIds", ids);

      yield* tableField.selectByIds(ids);



    // } else {
    //
    //   popup.removeSelection();
    //
    // }


    // KarmaFieldsAlpha.Store.set((ids) => this.insert(ids), "events", "drop", table.toString());

    KarmaFieldsAlpha.Store.State.set(this.path, "dropper", table.toString());



    // const droppers = KarmaFieldsAlpha.Store.State.get("droppers") || [];
    //
    // droppers.push(this.path);
    //
    // KarmaFieldsAlpha.Store.State.set(droppers, "droppers");

    // const onDrop = this.insert(ids);


    // while (this.request("getActivePopup").isActive()) {
    //
    //   yield;
    //
    // }


    // this.addTask(() => this.request("dispatch", "selectByIds", ids), "pre-select");



    // if (table.loading || params.loading || ids.loading) {
    //
    //   // KarmaFieldsAlpha.Store.Tasks.add({
    //   //   type: "edit-tag",
    //   //   resolve: () => this.edit()
    //   // });
    //
    //   this.addTask(() => this.edit(), "edit-tag");
    //
    // } else {
    //
    //
    //
    // }
    //
    // this.request("render");

  }


  async *insert(ids, index = undefined, length = undefined) {

    const content = this.getIds();

    while (content.loading) {

      yield;
      content = this.getIds();

    }

    if (index === undefined && length === undefined) {

      const selection = this.getSelection() || {};

      index = selection.index || content.toArray().length;
      length = selection.length || 0;

    }

    const newIds = [...content.toArray()];
    newIds.splice(index, length, ...ids);

    this.setIds(newIds);

	}

  getDefault(defaults = {}) {

    return this.parse(this.resource.default);

	}

  export(index = 0, length = Infinity) {

    const output = new KarmaFieldsAlpha.Content();

    if (this.resource.export !== false) {

      const content = this.getIds();

      if (content.loading) {

        output.loading = true;

      } else {

        // const ids = content.toArray();

        // const collection = new KarmaFieldsAlpha.Content.Collection([ids.join(",")]);


        // if (this.resource.export === "name") {
        //
        //   const driver = this.getDriver();
        //   const names = content.toArray().map(id => new KarmaFieldsAlpha.Content.Value(driver, id, "name"));
        //
        //   if (names.some(name => name.loading)) {
        //
        //     output.loading = true;
        //
        //   } else {
        //
        //     output.value = names.map(name => name.toString()).join(", ");
        //
        //   }
        //
        // } else {

          output.value = content.toArray().slice(index, index + length).join(",");

        // }

      }

    }

    return output;

	}

  async *import(collection, index = 0, length = Infinity) {

    const string = collection.value.shift();

    const addedIds = string && string.split(",") || [];

    const content = this.getIds();

    while (content.loading) {

      yield;
      content = this.getIds();

    }

    const newIds = [...content.toArray()];
    newIds.splice(index, length, ...addedIds);

    this.setIds(newIds);

	}

  getSelectedIds() {

    const selection = this.getSelection();

    if (selection) {

      const index = selection.index || 0;
      const length = selection.length || 0;

      const content = this.getIds();

      return content.toArray().slice(index, index + length);

    }

    return [];
  }

  swap(index, target, length) {

    if (target !== index) {

      const content = this.getIds();

      if (!content.loading) {

        const clones = [...content.toArray()];

        clones.splice(target, 0, ...clones.splice(index, length));

        this.setIds(clones);

      }

    }

  }

  getLength() {

    const length = new KarmaFieldsAlpha.Content();
    const content = this.getIds();

    if (content.loading) {

      length.laoding = true;

    } else {

      length.value = content.toArray().length;

    }

    return length;
  }

  getIds() {

    const key = this.getKey();

    const content = this.parent.getContent(key);

    content.value = content.toArray().filter(value => parseInt(value));

    return content;

  }

  setIds(ids) {

    const key = this.getKey();

    this.parent.setValue(ids, key);

  }

  getContent(key) {

    return new KarmaFieldsAlpha.Content();

  }

  setValue(content, key) {

    // console.error("Value cannot be set!");

  }

  getContentAt(index, key) {

    const content = new KarmaFieldsAlpha.Content();
    const ids = this.getIds();

    if (ids.loading) {

      content.Loading = true;

    } else {

      const id = ids.toArray()[index];

      if (id) {

        return this.getContentById(id, key);

      } else {

        content.notFound = true;

      }

    }

    return content;

  }

  setValueAt(value, index, key) {

    const ids = this.getIds();

    if (!ids.loading) {

      const newIds = [...ids.toArray()];

      newIds[index] = value;

      this.setIds(newIds, key);

    }

  }


  // getIds(index, length) {
  //
  //   const content = this.getContent();
  //
  //   return content.toArray().slice(index, index + length);
  // }
  //
  // setIds(ids, index, length) {
  //
  //   const content = this.getContent();
  //
  //   if (content.loading) {
  //
  //     KarmaFieldsAlpha.Store.Tasks.add({
  //       type: "setIds",
  //       resolve: () => this.setIds(ids, index, length)
  //     });
  //
  //   } else {
  //
  //     const clone = new KarmaFieldsAlpha.Content();
  //
  //     clone.value = [...content.toArray()];
  //     clone.value.splice(index, length, ...ids);
  //
  //     clone.value = clone.value.slice(0, this.getMax());
  //
  //     this.setContent(clone);
  //
  //     // content.insert(ids, index, length);
  //
  //     this.setSelection({index, length: ids.length});
  //
  //   }
  //
  // }
  //
  // append(ids) {
  //
  //   const content = this.getContent();
  //
  //   if (!content.loading && ids.length > 0) {
  //
  //     KarmaFieldsAlpha.History.save("paste", "Paste");
  //
  //     const clones = [...content.toArray(), ...ids];
  //
  //     const slice = clones.slice(0, this.getMax());
  //
  //     const newContent = new KarmaFieldsAlpha.Content(slice);
  //
  //     this.setContent(newContent);
  //
  //     this.setSelection({index: content.toArray().length, length: ids.length});
  //
  //     this.request("render");
  //
  //   }
  //
  // }

  // insert(ids) { // used by paste, withdraw, openMediaLibrary
  //
  //   const selection = this.getSelection();
  //   const index = selection && selection.index || 0;
  //   const length = selection && selection.length || 0;
  //
  //   if (ids.length > 0 || length > 0) {
  //
  //     this.setIds(ids, index, length);
  //
  //   }
  //
  // }

  async *paste(value) {

    // const ids = value && value.split(",") || [];

    this.save("paste", "Paste");

    // this.insert(ids);
    yield* this.import(value);

    this.request("render");

  }

  copy() {

    const selection = this.getSelection();

    if (selection) {

      const index = selection.index || 0;
      const length = selection.length || 0;

      return this.export(index, length).toString();

      // return ids.join(",");

    }

  }

  async *delete(index, length) {

    const body = this.getChild("body");

    if (index === undefined && length === undefined) {

      if (body) {

        const selection = body.getSelection() || {};
        index = selection.index || 0;
        length = selection.length || 0;

      }

    }

    if (length) {

      let content = this.getIds();

      while (content.loading) {

        yield;
        content = this.getIds();

      }

      this.save("delete", "Delete");

      const clones = [...content.toArray()];

      clones.splice(index, length);

      this.setIds(clones);

      if (body) {

        body.removeSelection();

      }

    }

  }
  //
  // remove(index = 0, length = 1) {
  //
  //   const content = this.getContent();
  //
  //   if (!content.loading && length > 0) {
  //
  //     KarmaFieldsAlpha.History.save("delete", "Delete");
  //
  //     if (content.mixed) {
  //
  //       const newContent = new KarmaFieldsAlpha.Content([]);
  //
  //       this.setContent(newContent);
  //
  //     } else {
  //
  //       const clones = [...content.toArray()];
  //
  //       clones.splice(index, length);
  //
  //       const newContent = new KarmaFieldsAlpha.Content(clones);
  //
  //       this.setContent(newContent);
  //
  //     }
  //
  //     this.removeSelection();
  //
  //     this.request("render");
  //
  //   }
  //
  // }

  getMax() {

    return this.resource.max || this.resource.single && 1 || 999999;

  }

  isSingle() {

    return this.getMax() === 1;

  }

  useSocket() {

    return new KarmaFieldsAlpha.Content(true);

  }

  getSelection(...path) {

    const body = this.getChild("body");

    if (body) {

      return body.querySelection();

    }

  }

  setSelection(selection, ...path) {

    const body = this.getChild("body");

    if (body) {

      return body.select(selection.index || 0, selection.length || 0);

    }

  }

  // *buildControls() {
  //
  //   if (this.resource.controls !== false && !this.getIds().mixed) {
  //
  //     const controlsField = this.createChild({
  //       type: "controls",
  //       ...this.resource.controls
  //     }, "controls");
  //
  //     yield {
  //       class: "controls",
  //       update: controls => {
  //         controls.element.classList.toggle("hidden", this.resource.controls === false);
  //       },
  //       child: {
  //         class: "footer-content simple-buttons",
  //         update: controls => {
  //           if (this.resource.controls !== false && !this.getIds().mixed) {
  //             controls.child = controlsField.build();
  //           }
  //         }
  //       }
  //     };
  //
  //   }
  //
  // }

  // build() {
  //   return {
	// 		class: "karma-tags karma-field",
  //     update: container => {
  //       container.element.classList.toggle("single", this.isSingle());
  //     },
  //     children: [
  //       this.getChild("body").build(),
  //       ...this.buildControls(),
  //     ]
	// 	};
  //
  // }


  // *buildPart(part) {
  //
  //   if (part === "footer" && this.resource.footer) {
  //
  //     yield this.getChild("footer").build();
  //
  //   } else if (part === "body") {
  //
  //     yield this.getChild("body").build();
  //
  //   }
  //
  // }

  // *buildParts() {
  //
  //   if (this.resource.footer) {
  //
  //     yield this.getChild("footer").build();
  //
  //   }
  //
  //   yield this.getChild("body").build();
  //
  // }

  buildParts() {

    return KarmaFieldsAlpha.field.table.prototype.buildParts.call(this);

  }

  build() {

    return KarmaFieldsAlpha.field.table.prototype.build.call(this);

  }

}

KarmaFieldsAlpha.field.tagsList = class extends KarmaFieldsAlpha.field {

  newChild(index) {

    if (index === "add") {

      return new KarmaFieldsAlpha.field.button({
        title: "Add",
        text: "Add",
        request: ["add"],
        hidden: [">=", ["getLength", ["getContent"]], ["request", "getMax"]],
      }, "add", this);

    }

  }

  getChild(index, ...path) {

    let child = this.newChild(index);

    if (child && path.length) {

      return child.getChild(...path);

    }

    return child;

  }

  getContentAt(index, key) {

    return this.parent.getContentAt(index, key);

  }

  
  getLength() {

    return this.parent.getLength();
  }

  select(index = 0, length = 0) {

    this.setSelection({index, length});

  }

  unselect() { // to be overrided (ie. Medias grid)

    this.removeSelection();

  }

  querySelection() { // to be overrided (ie. Medias grid)

    return this.getSelection();

  }

  *buildChildren() {

    const selection = this.getSelection();
    // const ids = this.getContent();
    const length = this.parent.getLength();

    if (length.mixed) {

      yield {
        tag: "li",
        update: frame => {
          const isSelected = selection && KarmaFieldsAlpha.Segment.contain(selection, 0) && this.hasFocus();
          frame.element.classList.toggle("selected", Boolean(isSelected));
        },
        children: [
          {
            tag: "span",
            update: span => {
              span.element.innerHTML = "[mixed]";
            }
          },
          {
            class: "close",
            init: close => {
              close.element.textContent = "×";
            },
            update: close => {
              close.element.onclick = event => {
                const work = this.request("delete");
                KarmaFieldsAlpha.Jobs.add(work);
                this.render();
              }
            }
          }
        ]
      };

    } else {

      for (let i = 0; i < length.toNumber(); i++) {

        const isSelected = selection && KarmaFieldsAlpha.Segment.contain(selection, i) && this.hasFocus();

        yield {
          tag: "li",
          update: frame => {
            frame.element.classList.toggle("selected", Boolean(isSelected));
          },
          children: [
            {
              tag: "span",
              update: span => {

                const name = this.getContentAt(i, "name");
                if (name.notFound) {
                  span.element.innerHTML = "[not Found]";
                } else {
                  span.element.innerHTML = name.toString();
                }
              }
            },
            {
              class: "close",
              init: close => {
                close.element.textContent = "×";
              },
              update: close => {
                close.element.onclick = event => {
                  const work = this.request("delete", i, 1);
                  KarmaFieldsAlpha.Jobs.add(work);
                  this.render();
                }
              }
            }
          ]
        };

      }

    }

  }

  buildUl() {

    return {
      tag: "ul",
      complete: ul => {
        ul.element.classList.toggle("hidden", !ul.element.hasChildNodes());
      },
      update: ul => {

        // const ids = this.getContent().toArray();

        let selection = this.getSelection();

        const sorter = new KarmaFieldsAlpha.ListSorterInline(ul.element, selection);

        sorter.onSelect = elements => {

          elements.map(element => element.classList.add("selected"));
          this.setSelection(sorter.state.selection);

        }

        sorter.onUnselect = elements => {

          elements.map(element => element.classList.remove("selected"));

        }

        sorter.onSelectionComplete = () => {

          // this.request("deferFocus");
          this.setFocus(true);
          this.request("render");

        }

        sorter.onSwap = (newState, lastState) => {

          this.parent.swap(lastState.selection.index, newState.selection.index, newState.selection.length);
          this.setSelection(newState.selection);

        };

        sorter.onSort = (index, target, length) => {

          KarmaFieldsAlpha.History.save("order", "Reorder");
          this.setFocus(true);
          this.request("render");

        }

        ul.element.ondblclick = event => {

          const work = this.parent.edit();
          KarmaFieldsAlpha.Jobs.add(work);
          this.render();

        }

      },
      children: [...this.buildChildren()]
    };

  }

  *buildControls() {

    if (this.resource.controls !== false && !this.getLength().mixed) {

      // const controlsField = this.createChild({
      //   type: "controls",
      //   ...this.resource.controls
      // }, "controls");


      yield {
        class: "controls",
        // update: controls => {
        //   controls.element.classList.toggle("hidden", this.resource.controls === false);
        // },
        child: {
          class: "footer-content simple-buttons",
          child: this.getChild("add").build()
          // update: controls => {
          //   if (this.resource.controls !== false && !this.getIds().mixed) {
          //     controls.child = controlsField.build();
          //   }
          // }
        }
      };

    }

  }

  build() {
    return {
  		class: "karma-tags karma-field",
      update: container => {
        // container.element.classList.toggle("single", this.isSingle());
      },
      children: [
        this.buildUl(),
        // this.getChild("body").build(),
        ...this.buildControls(),
      ]
  	};

  }


}


// KarmaFieldsAlpha.field.tags.add = class extends KarmaFieldsAlpha.field.button {
//   constructor(resource, id, parent) {
//     super({
//       title: "Add",
//       text: "Add",
//       request: ["add"],
//       hidden: [">=", ["getLength", ["getContent"]], ["request", "getMax"]],
//       ...resource
//     }, id, parent);
//   }
// }
//
//
//
//
// KarmaFieldsAlpha.field.tags.controls = class extends KarmaFieldsAlpha.field.group {
//
//   constructor(resource, id, parent) {
//
//     super({
//       display: "flex",
//       children: [
//         "add"
//       ],
//       ...resource
//     }, id, parent);
//
//   }
//
// }
//
// KarmaFieldsAlpha.field.tags.controls.add = class extends KarmaFieldsAlpha.field.button {
//   constructor(resource, id, parent) {
//     super({
//       title: "Add",
//       text: "Add",
//       request: ["add"],
//       hidden: [">=", ["getLength", ["getContent"]], ["request", "getMax"]],
//       ...resource
//     }, id, parent);
//   }
// }
// KarmaFieldsAlpha.field.tags.controls.remove = class extends KarmaFieldsAlpha.field.button {
//   constructor(resource, id, parent) {
//     super({
//       title: "Remove",
//       text: "×",
//       action: "delete",
//       disabled: ["!", ["getSelection"]],
//       hidden: ["=", ["getLength", ["getContent"]], 0],
//       ...resource
//     }, id, parent);
//   }
// }
// KarmaFieldsAlpha.field.tags.controls.edit = class extends KarmaFieldsAlpha.field.button {
//   constructor(resource, id, parent) {
//     super({
//       title: "Edit",
//       // dashicon: "update",
//       request: ["edit"],
//       disabled: ["!", ["request", "getSelection"]],
//       hidden: ["=", ["getLength", ["getContent"]], 0],
//       ...resource
//     }, id, parent);
//   }
// }
