KarmaFieldsAlpha.field.tags = class extends KarmaFieldsAlpha.field {

  getTable() {

    return this.resource.table;

  }

  getParams() {

    return this.resource.params;

  }

  fetch() {

    const ids = this.getSelectedIds();

    this.addTransition({
      params: this.getParams(),
      table: this.getTable(),
      replace: true,
      ids: ids
    });

    // const selectedIds = this.getSelectedIds();
    //
    // this.parent.request("open", table || this.resource.table, params, selectedIds);
    //
    //
    // if (params.loading) {
    //
    //   const task = KarmaFieldsAlpha.Task.find(task => task.type === "open") || KarmaFieldsAlpha.Task.create({type: "open"});
    //
    //   task.resolve = () => {
    //     this.parent.request("open", table || this.resource.table, params, selectedIds);
    //   }
    //
    // }

  }

  addTransition(transition) {

    KarmaFieldsAlpha.Store.remove("transition");
    KarmaFieldsAlpha.Store.set(transition, "transition", ...this.path);

  }

  updateTransition() {

    const transition = KarmaFieldsAlpha.Store.get("transition", ...this.path);

    if (transition) {

      const table = this.parse(transition.table);
      const params = this.parse(transition.params);
      const ids = this.parse(transition.ids);
      const replace = transition.replace; // boolean

      if (!table.loading && !params.loading && !ids.loading) {

        this.parent.request("open", table.toString(), params.toObject(), replace, ids.toArray());
        KarmaFieldsAlpha.Store.remove("transition");

      }

    }

  }


  getDriver() {

    return this.resource.driver;

  }


  open() {

    const selection = this.getSelection();


    if (!selection || !selection.length) {

      const content = this.getContent();

      if (!content.loading) {

        this.setSelection({index: content.toArray().length, length: 0});

      }

    }

    this.fetch();

  }

  getDefault(defaults = {}) {

		// let value = this.resource.default;
    //
    // if (this.resource.default) {
    //
    //   value = KarmaFieldsAlpha.Type.toArray(this.parse(this.resource.default));
    //
    // }
    //
		// return value || [];

    return this.parse(this.resource.default);

	}


  // export(items = [], index = 0, length = 999999) {
  //
  //   const ids = this.getValue() || [];
  //
  //   const grid = new KarmaFieldsAlpha.Grid();
  //   grid.addColumn(ids.slice(index, index + length));
  //
  //   items.push(grid.toString());
  //
  //   return items;
  //
	// }

  export() {

    const content = this.getContent();

    const ids = content.toArray();

    const collection = new KarmaFieldsAlpha.Content.Collection([ids.join(",")]);

    collection.loading = content.loading;

    return collection;

    // const grid = new KarmaFieldsAlpha.Grid();
    // grid.addColumn(ids.slice(index, index + length));
    //
    // items.push(grid.toString());
    //
    // return items;

	}

  import(collection) {

    const content = collection.pick();

    const string = content.toString();

    const ids = string && string.split(",") || [];

    const newContent = new KarmaFieldsAlpha.Content(ids);

    this.setContent(newContent);

	}


  // import(items, index = 0, length = 999999) {
  //
  //   const string = items.shift();
  //
  //   const grid = new KarmaFieldsAlpha.Grid(string);
  //   const newIds = grid.getColumn(0);
  //
  //   const ids = [...KarmaFieldsAlpha.Type.toArray(this.getValue())];
  //
  //   ids.splice(index, length, ...newIds);
  //
  //   this.setValue(ids);
  //
	// }

  getSelectedIds() {

    // const selection = this.getSelection();
    //
    // if (selection) {
    //
  	// 	const ids = this.getValue();
    //
    //   if (ids) {
    //
    //     return ids.slice(selection.index, selection.index + selection.length);
    //
    //   }
    //
    // }


    const selection = this.getSelection();

    if (selection) {

  		const content = this.getContent();

      if (!content.loading) {

        const index = selection.index || 0;
        const length = selection.length || 0;

        return content.toArray().slice(index, index + length);

      }

    }

    return [];
  }



  // follow(selection, callback, set) {
  //
  //   callback(this, selection, set);
  //
  //   return set;
  // }


  // paste(value, selection) {
  //
  //   if (selection) {
  //
  //     const ids = this.getIds();
  //
  //     if (ids) {
  //
  //       const index = selection.index || 0;
  //       const length = selection.length || 0;
  //
  //       const [current] = this.export([], index, length);
  //
  //       if (value !== current) {
  //
  //         this.import([value], index, length);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

  // exportString() {
  //
  //   const content = this.getContent();
  //
  //   const ids = content.toArray();
  //
  //   return ids.join(",");
  //
  // }
  //
  // importString(string) {
  //
  //   const ids = string && string.split(",") || [];
  //
  //   const content = new KarmaFieldsAlpha.Content(ids);
  //
  //   this.setContent(content);
  //
  // }



  // getSelectedValue() {
  //
  //
  //   return this.getValue();
  //
  // }

  swap(index, target, length) {

    if (target !== index) {

      const content = this.getContent();

      if (!content.loading) {

        const clones = [...content.toArray()];

        clones.splice(target, 0, ...clones.splice(index, length));

        const newContent = new KarmaFieldsAlpha.Content(clones);

        this.setContent(newContent);

      }

    }

  }

  getContent() {

    const key = this.getKey();

    return this.parent.getContent(key);

    // const values = super.getValue();
    //
    // if (values) {
    //
    //   return values.filter(id => id && id !== "0");
    //
    // }

  }

  setContent(content) {

    const key = this.getKey();

    return this.parent.setContent(content, key);

    // const values = super.getValue();
    //
    // if (values) {
    //
    //   return values.filter(id => id && id !== "0");
    //
    // }

  }
  //
  // setValue(ids) {
  //   const key = this.getKey();
  //   this.parent.setValue(ids, key);
  // }

  getIds(index, length) {

    const content = this.getContent();

    if (!content.loading) {

      return content.toArray().slice(index, index + length);

    }

    return [];
  }

  async setIds(ids, index, length) {

    // const content = this.getContent();
    //
    // if (!content.loading) {
    //
    //   const clones = [...content.toArray()];
    //
    //   clones.splice(index, length, ...ids);
    //
    //   const slice = clones.slice(0, this.getMax());
    //
    //   const newContent = new KarmaFieldsAlpha.Content(slice);
    //
    //   await this.setContent(newContent);
    //
    // }

    const content = this.getContent();

    if (content.loading) {

      KarmaFieldsAlpha.Store.Tasks.add({
        type: "setIds",
        resolve: async () => this.setIds(ids, index, length)
      });

    } else {

      const clone = content.clone();

      clone.value.splice(index, length, ...ids);

      clone.value = clone.value.slice(0, this.getMax());

      await this.setContent(clone);

      this.setSelection({index, length: ids.length});

    }

  }

  async append(ids) {

    const content = this.getContent();

    if (!content.loading && ids.length > 0) {

      await KarmaFieldsAlpha.History.save("paste", "Paste");

      const clones = [...content.toArray(), ...ids];

      const slice = clones.slice(0, this.getMax());

      const newContent = new KarmaFieldsAlpha.Content(slice);

      await this.setContent(newContent);

      this.setSelection({index: content.toArray().length, length: ids.length});

      await this.request("render");

    }

  }

  // insert(ids, index, length) {
  //
  //   const values = this.getValue();
  //
  //   if (values) {
  //
  //     const clones = [...values];
  //
  //     clones.splice(index, length || 0, ...ids);
  //
  //     const slice = clones.slice(0, this.getMax());
  //
  //     this.setValue(slice);
  //
  //     // KarmaFieldsAlpha.History.save("insert");
  //
  //   }
  //
  // }

  async insert(ids) {

    const selection = this.getSelection();
    const index = selection && selection.index || 0;
    const length = selection && selection.length || 0;

    if (ids.length > 0 || length > 0) {

      await KarmaFieldsAlpha.History.save("paste", "Paste");

      await this.setIds(ids, index, length);

      await this.request("render");

    }

  }

  async paste(value) {

    const ids = value && value.split(",") || [];

    this.insert(ids);

  }

  copy() {

    const selection = this.getSelection();

    if (selection) {

      const index = selection.index || 0;
      const length = selection.length || 0;

      const ids = this.getIds(index, length);

      return ids.join(",");

    }

  }

  async delete() {

    const selection = this.getSelection();

    if (selection) {

      const index = selection.index || 0;
      const length = selection.length || 0;

      if (length) {

        await this.remove(index, length);

      }

      // await KarmaFieldsAlpha.History.save("delete", "Delete");
      //
      // await this.setIds([], index, length);
      //
      // this.setSelection({});
      //
      // await this.request("render");

    }

  }

  async remove(index = 0, length = 1) {

    const content = this.getContent();

    if (!content.loading && length > 0) {

      await KarmaFieldsAlpha.History.save("delete", "Delete");

      if (content.mixed) {

        const newContent = new KarmaFieldsAlpha.Content([]);

        await this.setContent(newContent);

      } else {

        const clones = [...content.toArray()];

        clones.splice(index, length);

        const newContent = new KarmaFieldsAlpha.Content(clones);

        await this.setContent(newContent);

      }

      this.removeSelection();

      await this.request("render");

    }

  }

  getMax() {

    return this.resource.max || this.resource.single && 1 || 999999;

  }

  isSingle() {

    return this.getMax() === 1;

  }

  build() {
    return {
			class: "karma-tags karma-field",
      update: container => {

        container.element.classList.toggle("single", this.isSingle());

        const content = this.getContent();

        container.element.classList.toggle("loading", Boolean(content.loading));

        if (!content.loading) {

          container.children = [
            {
              tag: "ul",
              update: ul => {

                const ids = content.toArray();

                ul.element.classList.toggle("hidden", ids.length === 0);

                let selection = this.getSelection();

                const sorter = new KarmaFieldsAlpha.ListSorterInline(ul.element, this.selection);

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

                sorter.onSwap = (newState, lastState) => {

                  this.swap(lastState.selection.index, newState.selection.index, newState.selection.length);
                  this.setSelection(newState.selection);

                };

                sorter.onSort = async (index, target, length) => {

                  await KarmaFieldsAlpha.History.save("order", "Reorder");
                  // this.request("deferFocus");
                  await this.setFocus(true);
                  await this.request("render");

                }

                ul.element.ondblclick = event => {

                  this.fetch();

                }

                if (content.mixed) {

                  ul.children = [
                    {
                      tag: "li",
                      update: frame => {

                        const isSelected = selection && KarmaFieldsAlpha.Segment.contain(selection, 0) && this.hasFocus();

                        frame.element.classList.toggle("selected", Boolean(isSelected));

                        frame.children = [
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
                                this.remove();
                              }
                            }
                          }
                        ];
                      }
                    }
                  ];

                } else {

                  ul.children = ids.map((id, rowIndex) => {
                    return {
                      tag: "li",
                      update: frame => {

                        const isSelected = selection && KarmaFieldsAlpha.Segment.contain(selection, rowIndex) && this.hasFocus();

                        frame.element.classList.toggle("selected", Boolean(isSelected));

                        const driver = this.getDriver();
                        const name = KarmaFieldsAlpha.Query.getValue(driver, id, "name");

                        frame.children = [
                          {
                            tag: "span",
                            update: async span => {
                              span.element.innerHTML = name.toString();
                            }
                          },
                          {
                            class: "close",
                            init: close => {
                              close.element.textContent = "×";
                            },
                            update: close => {
                              close.element.onclick = async event => {
                                this.remove(rowIndex, 1);
                              }
                            }
                          }
                        ];
                      }
                    };
                  });

                }


              }
            },
            {
              class: "controls",
              update: controls => {
                controls.element.classList.toggle("hidden", this.resource.controls === false);
              },
              child: {
                class: "footer-content simple-buttons",
                update: controls => {
                  if (this.resource.controls !== false && !content.mixed) {
                    controls.child = this.createChild({
                      type: "controls",
                      ...this.resource.controls,
                      index: "controls"
                    }, "controls").build();
                  }
                }
              }
            }
          ];
        }
      }
		};

  }

}

KarmaFieldsAlpha.field.tags.controls = class extends KarmaFieldsAlpha.field.group {

  constructor(resource) {

    super({
      display: "flex",
      children: [
        "add"
      ],
      ...resource
    });

  }

  // static add = {
  //   type: "button",
  //   title: "Add",
  //   text: "Add",
  //   action: "open",
  //   hidden: [">=", ["count", ["getValue"]], ["request", "getMax"]]
  // }

  // static remove = {
  //   type: "button",
  //   title: "Remove",
  //   text: "×",
  //   action: "delete",
  //   disabled: ["!", ["getSelection"]],
  //   hidden: ["=", ["count", ["getValue"]], 0]
  // }
  //
  // static edit = {
  //   type: "button",
  //   title: "Edit",
  //   // dashicon: "update",
  //   action: "open",
  //   disabled: ["!", ["request", "getSelection"]],
  //   hidden: ["=", ["count", ["getValue"]], 0]
  // }

}

KarmaFieldsAlpha.field.tags.controls.add = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      title: "Add",
      text: "Add",
      action: "open",
      hidden: [">=", ["count", ["getValue"]], ["request", "getMax"]],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.tags.controls.remove = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      title: "Remove",
      text: "×",
      action: "delete",
      disabled: ["!", ["getSelection"]],
      hidden: ["=", ["count", ["getValue"]], 0],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.tags.controls.edit = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      title: "Edit",
      // dashicon: "update",
      action: "open",
      disabled: ["!", ["request", "getSelection"]],
      hidden: ["=", ["count", ["getValue"]], 0],
      ...resource
    });
  }
}
