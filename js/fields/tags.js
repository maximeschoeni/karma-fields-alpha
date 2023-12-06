KarmaFieldsAlpha.field.tags = class extends KarmaFieldsAlpha.field {

  getTable() {

    return this.parse(this.resource.table);

  }

  getParams() {

    return this.parse(this.resource.params);

  }

  // fetch() {
  //
  //   const ids = this.getSelectedIds();
  //
  //   this.addTransition({
  //     params: this.getParams(),
  //     table: this.getTable(),
  //     replace: true,
  //     ids: ids
  //   });
  //
  // }

  add() {

    const content = this.getContent();

    if (content.loading) {

      this.addTask(() => add(), "add");

      this.request("render");

    } else {

      const length = content.toArray().length;

      this.setSelection({index: length, length: 0});

      this.edit();

    }



    // const key = this.getKey();
    //
    // const content = this.getContent(key);
    // const table = this.getTable();
    // const params = this.getParams();
    //
    // if (content.loading || table.loading || params.loading) {
    //
    //   KarmaFieldsAlpha.Store.Tasks.add({
    //     type: "add-tag",
    //     resolve: () => this.add()
    //   });
    //
    // } else {
    //
    //   this.setFocus(true);
    //   this.setSelection({index: content.toArray().length, length: 0});
    //
    //   this.request("open", table.toString(), params.toObject(), false);
    //
    // }

  }

  edit() {

    const ids = this.getSelectedIds();
    const table = this.getTable();
    const params = this.getParams();

    if (table.loading || params.loading || ids.loading) {

      // KarmaFieldsAlpha.Store.Tasks.add({
      //   type: "edit-tag",
      //   resolve: () => this.edit()
      // });

      this.addTask(() => this.edit(), "edit-tag");

    } else {

      this.save("edit-tag", "Edit Tag");

      this.setFocus(true);
      this.request("open", table.toString(), params.toObject(), false, ids.toArray());

      this.addTask(() => this.request("dispatch", "selectByIds", ids), "pre-select");

    }

    this.request("render");

  }

  // addTransition(transition) {
  //
  //   KarmaFieldsAlpha.Store.remove("transition");
  //   KarmaFieldsAlpha.Store.set(transition, "transition", ...this.path);
  //
  // }
  //
  // updateTransition() {
  //
  //   const transition = KarmaFieldsAlpha.Store.get("transition", ...this.path);
  //
  //   if (transition) {
  //
  //     const table = this.parse(transition.table);
  //     const params = this.parse(transition.params);
  //     const ids = this.parse(transition.ids);
  //     const replace = transition.replace; // boolean
  //
  //     if (!table.loading && !params.loading && !ids.loading) {
  //
  //       this.parent.request("open", table.toString(), params.toObject(), replace, ids.toArray());
  //       KarmaFieldsAlpha.Store.remove("transition");
  //
  //     }
  //
  //   }
  //
  // }


  getDriver() {

    return this.resource.driver;

  }


  // open() {
  //
  //   const selection = this.getSelection();
  //
  //
  //   if (!selection || !selection.length) {
  //
  //     const content = this.getContent();
  //
  //     if (!content.loading) {
  //
  //       this.setSelection({index: content.toArray().length, length: 0});
  //
  //     }
  //
  //   }
  //
  //   this.fetch();
  //
  // }

  getDefault(defaults = {}) {

    return this.parse(this.resource.default);

	}

  export() {

    const collection = new KarmaFieldsAlpha.Content.Collection();

    const content = this.getContent();

    if (!content.notFound) {

      const ids = content.toArray();

      // const collection = new KarmaFieldsAlpha.Content.Collection([ids.join(",")]);

      collection.value = [ids.join(",")];

      collection.loading = content.loading;

    }

    // const ids = content.toArray();
    //
    // const collection = new KarmaFieldsAlpha.Content.Collection([ids.join(",")]);
    //
    // collection.loading = content.loading;

    return collection;

	}

  import(collection) {

    const content = collection.pick();

    const string = content.toString();

    const ids = string && string.split(",") || [];

    const newContent = new KarmaFieldsAlpha.Content(ids);

    this.setContent(newContent);

	}

  getSelectedIds() {

    const selection = this.getSelection();

    if (selection) {

  		const content = this.getContent();

      if (!content.loading) {

        const index = selection.index || 0;
        const length = selection.length || 0;

        const ids = content.toArray().slice(index, index + length);

        return new KarmaFieldsAlpha.Content(ids);

      }

    }

    return new KarmaFieldsAlpha.Content([]);
  }

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

  }

  setContent(content) {

    const key = this.getKey();

    this.parent.setContent(content, key);

  }

  getIds(index, length) {

    const content = this.getContent();

    if (!content.loading) {

      return content.toArray().slice(index, index + length);

    }

    return [];
  }

  setIds(ids, index, length) {

    const content = this.getContent();

    if (content.loading) {

      KarmaFieldsAlpha.Store.Tasks.add({
        type: "setIds",
        resolve: () => this.setIds(ids, index, length)
      });

    } else {

      const clone = content.clone();

      clone.value.splice(index, length, ...ids);

      clone.value = clone.value.slice(0, this.getMax());

      this.setContent(clone);

      this.setSelection({index, length: ids.length});

    }

  }

  append(ids) {

    const content = this.getContent();

    if (!content.loading && ids.length > 0) {

      KarmaFieldsAlpha.History.save("paste", "Paste");

      const clones = [...content.toArray(), ...ids];

      const slice = clones.slice(0, this.getMax());

      const newContent = new KarmaFieldsAlpha.Content(slice);

      this.setContent(newContent);

      this.setSelection({index: content.toArray().length, length: ids.length});

      this.request("render");

    }

  }

  insert(ids) { // used by paste, withdraw, openMediaLibrary

    const selection = this.getSelection();
    const index = selection && selection.index || 0;
    const length = selection && selection.length || 0;

    if (ids.length > 0 || length > 0) {

      this.setIds(ids, index, length);

    }

  }

  paste(value) {

    const ids = value && value.split(",") || [];

    KarmaFieldsAlpha.History.save("paste", "Paste");

    this.insert(ids);

    this.request("render");

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

  delete() {

    const selection = this.getSelection();

    if (selection) {

      const index = selection.index || 0;
      const length = selection.length || 0;

      if (length) {

        this.remove(index, length);

      }

    }

  }

  remove(index = 0, length = 1) {

    const content = this.getContent();

    if (!content.loading && length > 0) {

      KarmaFieldsAlpha.History.save("delete", "Delete");

      if (content.mixed) {

        const newContent = new KarmaFieldsAlpha.Content([]);

        this.setContent(newContent);

      } else {

        const clones = [...content.toArray()];

        clones.splice(index, length);

        const newContent = new KarmaFieldsAlpha.Content(clones);

        this.setContent(newContent);

      }

      this.removeSelection();

      this.request("render");

    }

  }

  getMax() {

    return this.resource.max || this.resource.single && 1 || 999999;

  }

  isSingle() {

    return this.getMax() === 1;

  }

  useSocket() {

    return new KarmaFieldsAlpha.Content(true);

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

                sorter.onSelectionComplete = () => {

                  // this.request("deferFocus");
                  this.setFocus(true);
                  this.request("render");

                }

                sorter.onSwap = (newState, lastState) => {

                  this.swap(lastState.selection.index, newState.selection.index, newState.selection.length);
                  this.setSelection(newState.selection);

                };

                sorter.onSort = (index, target, length) => {

                  KarmaFieldsAlpha.History.save("order", "Reorder");
                  this.setFocus(true);
                  this.request("render");

                }

                ul.element.ondblclick = event => {

                  this.edit();

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
                              close.element.onclick = event => {
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
                            update: span => {
                              span.element.innerHTML = name.toString();
                            }
                          },
                          {
                            class: "close",
                            init: close => {
                              close.element.textContent = "×";
                            },
                            update: close => {
                              close.element.onclick = event => {
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
      request: ["add"],
      hidden: [">=", ["count", ["getContent"]], ["request", "getMax"]],
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
      hidden: ["=", ["count", ["getContent"]], 0],
      ...resource
    });
  }
}
KarmaFieldsAlpha.field.tags.controls.edit = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      title: "Edit",
      // dashicon: "update",
      request: ["edit"],
      disabled: ["!", ["request", "getSelection"]],
      hidden: ["=", ["count", ["getContent"]], 0],
      ...resource
    });
  }
}
