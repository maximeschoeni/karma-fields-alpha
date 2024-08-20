
// KarmaFieldsAlpha.field.tags = class extends KarmaFieldsAlpha.field.form { // because need function getContentById

KarmaFieldsAlpha.field.tags = class extends KarmaFieldsAlpha.field.container {

  getBody() {

    return new KarmaFieldsAlpha.field.tagsList(this.resource, "body", this);

  }

  getPopup() {

    let resource;

    if (this.resource.table) {

      resource = KarmaFieldsAlpha.tables[this.resource.table];

    } else {

      resource = this.resource.popup;

    }

    if (resource) {

      // const tableResource = KarmaFieldsAlpha.tables[this.resource.table];
      const constructor = this.getConstructor(resource.type || "table"); // may be medias!

      return new constructor(resource, "popup", this);

    }

  }

  newChild(index) {

    // if (index === "body") {
    //
    //   return new KarmaFieldsAlpha.field.tagsList(this.resource, "body", this);
    //
    // } else

    if (index === "popup") {

      return this.getPopup();

    } else {

      return super.newChild(index);

    }

  }

  async add() { // called when pasting items


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

    return this.parse(this.resource.params).toObject();

  }

  queryParams() {

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

      const body = this.getChild("body");

      if (body && body.hasSelection) {

        return body.hasSelection();

      }

    }

    return false;

  }

  async open() {

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

    let ids = this.getIds();

    // while (ids.loading) {
    //
    //   await this.render();
    //   ids = this.getIds();
    //
    // }

    const length = ids.toArray().length;

    await this.setSelection({index: length, length: 0});

    await this.edit();

  }

  async edit() {

    // let table = this.getTable();
    //
    // while (table.loading) {
    //
    //   yield;
    //   table = this.getTable();
    //
    // }

    let params = this.queryParams();

    while (params.loading) {

      await this.render();
      params = this.getParams();

    }

    let ids = this.getSelectedIds();

    // while (ids.loading) {
    //
    //   await this.render();
    //   ids = this.getSelectedIds();
    //
    // }

    await this.save("edit-tag", "Edit Tag");

    // this.setFocus(true);

    // const popup = this.getField("board", table.toString());

    // const popup = this.getChild(this.resource.table);

    const popup = this.getChild("popup");

    await popup.setFocus(true);




    // const z = this.request("getZ") || 0;
    //
    // popup.setState(z + 1, "z");
    // popup.setState(true, "activeXXX");

    // popup.open();
    // const tableField = popup.getChild("table");
    // tableField.setState(params.toObject(), "params");
    await popup.setState(params.toObject(), "params");

    // this.setState(true, "popup");

    // yield* tableField.selectByIds(ids);
    await popup.selectByIds(ids);


    // KarmaFieldsAlpha.Store.State.set(this.path, "dropper", table.toString());
    // popup.setState(this.path, "master"); // -> should replace droppers;




  }

  async close() {

    // this.setState(false, "popup");

    await this.setFocus(true);

  }

  canDrop() {

    return true;

  }


  async insert(ids, index = undefined, length = undefined) {

    let content = this.getIds();

    while (content.loading) {

      await this.render();
      content = this.getIds();

    }

    if (index === undefined && length === undefined) {

      const selection = this.getSelection();

      // this would delete selected items and replace by new items:
      // index = selection.index || content.toArray().length;
      // length = selection.length || 0;

      // this insert new items before selected items:
      if (selection.length) {

        index = selection.index;
        length = 0;

      } else {

        index = content.toArray().length;
        length = 0;

      }

    }

    const newIds = [...content.toArray()];
    newIds.splice(index, length, ...ids);

    await this.setIds(newIds);
    await this.setFocus(true);

	}

  getDefault() {

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

        // const driver = this.getDriver();
        //
        // const form = new KarmaFieldsAlpha.field.form({driver});
        //
	      // output.value = form.getValueById(content.toString(), "name");



          output.value = content.toArray().slice(index, index + length).join(",");

        // }

      }

    }

    return output;

	}

  async import(collection, index = 0, length = Infinity) {

    const string = collection.value.shift();

    const addedIds = string && string.split(",") || [];

    let content = this.getIds();

    while (content.loading) {

      await this.render();
      content = this.getIds();

    }

    const newIds = [...content.toArray()];
    newIds.splice(index, length, ...addedIds);

    await this.setIds(newIds);

	}

  querySelectedIds() {

    const response = new KarmaFieldsAlpha.Content();

    const selection = this.getSelection();

    if (selection.loading) {

      response.loading = true;

    } else {

      const index = selection.toObject().index || 0;
      const length = selection.toObject().length || 0;

      if (length) {

        const ids = this.getIds();

        if (ids.loading) {

          response.loading = true;

        } else {

          response.value = ids.toArray().slice(index, index + length);

        }

      }

    }

    return response;
  }

  getSelectedIds() {

    const selection = this.getSelection();

    const index = selection.index || 0;
    const length = selection.length || 0;

    if (length) {

      return this.getIds().toArray().slice(index, index + length);

    }

    return [];
  }

  async swap(index, target, length) {

    if (target !== index) {

      const content = this.getIds();

      if (!content.loading) {

        const clones = [...content.toArray()];

        clones.splice(target, 0, ...clones.splice(index, length));

        await this.setIds(clones);

      }

    }

  }

  queryLength() {

    const response = new KarmaFieldsAlpha.Content();
    const content = this.getIds();

    if (content.loading) {

      response.loading = true;

    } else {

      response.value = content.toArray().length;

    }

    return response;
  }

  getLength() {

    return this.getIds().toArray().length;

  }

  getIds() {

    const key = this.getKey();

    const content = this.parent.getContent(key);

    content.value = content.toArray().filter(value => parseInt(value));

    return content;

  }

  async setIds(ids) {

    const key = this.getKey();

    await this.parent.setValue(ids, key);

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

      content.loading = true;

    } else {

      const id = ids.toArray()[index];

      if (id) {

        const driver = this.getDriver();

        return this.parent.getWild(driver, id, key)

        // return this.getContentById(id, key);

      } else {

        content.notFound = true;

      }

    }

    return content;

  }

  async setValueAt(value, index, key) {

    const ids = this.getIds();

    if (!ids.loading) {

      const newIds = [...ids.toArray()];

      newIds[index] = value;

      await this.setIds(newIds, key);

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

  async paste(value) {

    // const ids = value && value.split(",") || [];

    await this.save("paste", "Paste");

    // this.insert(ids);
    await this.import(value);

    await this.request("render");

  }

  copy() {

    const selection = this.getSelection();

    const index = selection.index || 0;
    const length = selection.length || 0;

    if (selection) {

      const content = this.export(index, length);

      return content.toString();

    }

  }

  async delete(index, length) {

    const body = this.getChild("body");

    if (index === undefined && length === undefined) {

      if (body) {

        const selection = body.getSelection();
        index = selection.index || 0;
        length = selection.length || 0;

      }

    }

    if (length) {

      let content = this.getIds();

      while (content.loading) {

        await this.render();
        content = this.getIds();

      }

      await this.save("delete", "Delete");

      const clones = [...content.toArray()];

      clones.splice(index, length);

      await this.setIds(clones);

      if (body) {

        await body.removeSelection();

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

  // buildPopup() {
  //
  //   return {
  //     class: "popup",
  //     child: {
  //       class: "popup-content",
  //       children: [
  //         {
  //           class: "navigation karma-field-frame",
  //           update: navigation => {
  //             navigation.element.classList.toggle("hidden", !this.resource.navigation);
  //           },
  //           children: [...this.buildNavigation()]
  //         },
  //         {
  //           class: "tables",
  //           children: [...this.buildPopups()]
  //         }
  //       ]
  //     }
  //   };
  //
  // }

  // *buildParts() {
  //
  //   yield* KarmaFieldsAlpha.field.table.prototype.buildParts.call(this);
  //
  //   // const hasPopup = this.getState("popup");
  //
  //   const hasPopup = this.hasFocusInside("popup");
  //
  //   // document.body.classList.toggle("karma-table-open", Boolean(hasPopup));
  //
  //   if (hasPopup) {
  //
  //     // const tableResource = KarmaFieldsAlpha.tables[this.resource.table];
  //     //
  //     // const popup = new KarmaFieldsAlpha.field.table(tableResource, this.resource.table, this);
  //
  //     const popup = this.getChild("popup");
  //
  //     yield {
  //       class: "popup",
  //       update: node => {
  //         // node.element.onmousedown = event => {
  //         //   event.stopPropagation();
  //         //   const body = popup.getChild("body");
  //         //   if (body) {
  //         //     body.setFocus(true);
  //         //     if (body.select) body.select(0, 0); // !!
  //         //     this.render();
  //         //   }
  //         // }
  //       },
  //       child: {
  //         class: "popup-content",
  //         children: [
  //           popup.build()
  //           // {
  //           //   class: "navigation karma-field-frame",
  //           //   update: navigation => {
  //           //     navigation.element.classList.toggle("hidden", !this.resource.navigation);
  //           //   },
  //           //   children: [...this.buildNavigation()]
  //           // },
  //           // {
  //           //   class: "tables",
  //           //   children: [
  //           //     {
  //           //       class: "table-container",
  //           //       children: [popup.build()]
  //           //     }
  //           //   ]
  //           // }
  //         ]
  //       }
  //     };
  //
  //
  //   }
  //
  // }

  *buildPopup() {

    const popup = this.getChild("popup");
    const hasPopup = popup && popup.hasFocusInside();

    if (hasPopup) {

      yield {
        class: "popup",
        update: node => {
          // node.element.onmousedown = event => {
          //   event.stopPropagation();
          //   const body = popup.getChild("body");
          //   if (body) {
          //     body.setFocus(true);
          //     if (body.select) body.select(0, 0); // !!
          //     this.render();
          //   }
          // }
        },
        child: {
          class: "popup-content",
          children: [
            popup.build()
          ]
        }
      };

    }



  }

  *buildFooter() {

    // yield* KarmaFieldsAlpha.field.table.prototype.buildParts.call(this);

    yield* super.buildFooter();



    yield {
      class: "popup-container",
      children: [...this.buildPopup()],
      update: node => {
        // const popup = this.getChild("popup");
        // const hasPopup = popup.hasFocusInside();
        node.element.classList.toggle("hidden", !node.children.length);

        // if (hasPopup) {
        //   node.children = [{
        //     class: "popup",
        //     update: node => {
        //       // node.element.onmousedown = event => {
        //       //   event.stopPropagation();
        //       //   const body = popup.getChild("body");
        //       //   if (body) {
        //       //     body.setFocus(true);
        //       //     if (body.select) body.select(0, 0); // !!
        //       //     this.render();
        //       //   }
        //       // }
        //     },
        //     child: {
        //       class: "popup-content",
        //       children: [
        //         popup.build()
        //       ]
        //     }
        //   }];
        // }
        // else {
        //   node.children = [];
        // }
      }
    };




    // const hasPopup = this.hasFocusInside("popup");
    //
    // if (hasPopup) {
    //
    //   const popup = this.getChild("popup");
    //
    //   yield {
    //     class: "popup",
    //     update: node => {
    //       // node.element.onmousedown = event => {
    //       //   event.stopPropagation();
    //       //   const body = popup.getChild("body");
    //       //   if (body) {
    //       //     body.setFocus(true);
    //       //     if (body.select) body.select(0, 0); // !!
    //       //     this.render();
    //       //   }
    //       // }
    //     },
    //     child: {
    //       class: "popup-content",
    //       children: [
    //         popup.build()
    //       ]
    //     }
    //   };
    //
    // }

  }

  // build() {
  //
  //   return KarmaFieldsAlpha.field.table.prototype.build.call(this);
  //
  // }

}

KarmaFieldsAlpha.field.tagsList = class extends KarmaFieldsAlpha.field {

  newChild(index) {

    if (index === "add") {

      return new KarmaFieldsAlpha.field.button({
        title: "Add",
        text: "Add",
        action: "open",
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

    return this.setSelection({index, length});

  }

  unselect() { // to be overrided (ie. Medias grid)

    return this.removeSelection();

  }

  querySelection() { // to be overrided (ie. Medias grid)

    return this.getSelection();

  }

  *buildChildren() {

    const selection = this.getSelection();
    const length = this.getLength();
    const hasFocus = this.hasFocus();

    // const selection = this.getSelection();
    // // const ids = this.getContent();
    // const length = this.parent.getLength();

    if (length.mixed) {

      yield {
        tag: "li",
        update: frame => {
          const isSelected = selection && KarmaFieldsAlpha.Segment.contain(selection, 0) && hasFocus;
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
              close.element.onclick = async event => {
                await this.request("delete");
                await this.render();
              }
            }
          }
        ]
      };

    } else {

      for (let i = 0; i < length; i++) {

        const isSelected = KarmaFieldsAlpha.Segment.contain(selection, i) && hasFocus;

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
                close.element.onclick = async event => {
                  await this.request("delete", i, 1);
                  await this.render();
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

        // let selection = this.getSelection();

        const selection = this.getSelection();
        const length = this.parent.getLength();

        const sorter = new KarmaFieldsAlpha.ListSorterInline(ul.element, selection);

        const hasFocus = this.hasFocus();

        sorter.onSelect = elements => {

          elements.map(element => element.classList.add("selected"));
          this.setSelection(sorter.state.selection);

        }

        sorter.onUnselect = elements => {

          elements.map(element => element.classList.remove("selected"));

        }

        sorter.onSelectionComplete = async () => {

          // this.request("deferFocus");
          await this.setFocus(true);
          await this.request("render");

        }

        sorter.onSwap = async (newState, lastState) => {

          await this.parent.swap(lastState.selection.index, newState.selection.index, newState.selection.length);
          await this.setSelection(newState.selection);

        };

        sorter.onSort = async (index, target, length) => {

          await KarmaFieldsAlpha.History.save("order", "Reorder");
          await this.setFocus(true);
          await this.request("render");

        }

        ul.element.ondblclick = async event => {

          await this.parent.edit();
          await this.render();

        }




        ul.children = [...this.buildChildren(selection, length, hasFocus)];

      },
      // children: [...this.buildChildren()]
    };

  }

  *buildControls() {

    if (this.resource.controls !== false && !this.getIds().mixed) {

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
