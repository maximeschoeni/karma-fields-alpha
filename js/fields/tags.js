KarmaFieldsAlpha.field.tags = class extends KarmaFieldsAlpha.field {

  fetch() {

    this.parent.request("fetch", this.resource.table);

  }


  open() {
    const ids = this.getValue() || [];
    this.setSelection({index: ids.length, length: 0, final: true});
    this.fetch();
  }

  getDefault(defaults = {}) {

		const key = this.getKey();

    if (key && this.resource.default) {

      defaults[key] = KarmaFieldsAlpha.Type.toArray(this.parse(this.resource.default));

    }

		return defaults;

	}

  export(items = [], index = 0, length = 999999) {

    const ids = this.getValue() || [];

    const grid = new KarmaFieldsAlpha.Grid();
    grid.addColumn(ids.slice(index, index + length));

    items.push(grid.toString());

    return items;

	}


  import(items, index = 0, length = 999999) {

    const string = items.shift();

    const grid = new KarmaFieldsAlpha.Grid(string);
    const newIds = grid.getColumn(0);

    const ids = [...KarmaFieldsAlpha.Type.toArray(this.getValue())];

    ids.splice(index, length, ...newIds);

    this.setValue(ids);

	}

  getSelectedIds() {

    const selection = this.getSelection();

    if (selection) {

  		const ids = this.getValue();

      if (ids) {

        return ids.slice(selection.index, selection.index + selection.length);

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


  paste(value, selection) {

    if (selection) {

      const ids = this.getIds();

      if (ids) {

        const [current] = this.export([], selection.index, selection.length);

        if (value !== current) {

          this.import([value], selection.index, selection.length);

        }

      }

    }

  }

  async swap(index, length, target) {

    if (target !== index) {

      const ids = this.getValue();

      if (ids) {

        const clone = [...ids];
        clone.splice(target, 0, ...clone.splice(index, length));

        this.setValue(clone);

      }

    }

  }

  // getValue() {
  //   const key = this.getKey();
  //   return this.parent.getValue(key);
  // }
  //
  // setValue(ids) {
  //   const key = this.getKey();
  //   this.parent.setValue(ids, key);
  // }

  getIds() {
    // deprecated
    return this.getValue();
  }

  setIds(ids) {
    // deprecated
    this.setValue(ids);
  }

  append(ids) {
    const values = this.getValue();

    ids = [...values, ...ids];
    this.setValue(ids);
  }

  insert(ids, index, length) {

    const values = this.getValue();

    if (values) {

      const clones = [...values];

      clones.splice(index, length || 0, ...ids);

      const slice = clones.slice(0, this.getMax());

      this.setValue(slice);

      KarmaFieldsAlpha.History.save("insert");

    }

  }

  delete() {

    const selection = this.getSelection();

    if (selection) {

      this.insert([], selection.index, selection.length);

    }

  }

  remove(index, length = 1) {

    this.insert([], index, length);

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

        // const key = this.getKey();
        const ids = this.getValue();

        container.element.classList.toggle("loading", !ids);

        if (ids) {

          container.children = [
            {
              tag: "ul",
              update: content => {

                content.element.classList.toggle("hidden", ids.length === 0);

                let selection = this.getSelection();

                const sorter = new KarmaFieldsAlpha.Sorter(content.element);
                sorter.colCount = 1;
                sorter.rowCount = ids.length;
                sorter.selection = selection;



                sorter.onselect = newSelection => {

                  // if (!newSelection.equals(selection)) {
                  if (!KarmaFieldsAlpha.Selection.compare(newSelection, selection)) {

                    const [string] = this.export([], newSelection.index, newSelection.length);

                    KarmaFieldsAlpha.Clipboard.write(string);

                    this.setSelection(newSelection);

                    this.render();

                  }

                }

                sorter.onSelectionChange = newSelection => {
                  this.setSelection(newSelection);
                }

                sorter.onPaintRow = elements => {
                  elements.forEach(element => element.classList.add("selected"))
                }

                sorter.onUnpaintRow = elements => {
                  elements.forEach(element => element.classList.remove("selected"))
                }

                sorter.onsort = () => {

                  // if (!sorter.selection.equals(selection)) {
                  if (!KarmaFieldsAlpha.Selection.compare(sorter.selection, selection)) {

                    this.swap(selection.index, selection.length, sorter.selection.index);

                    this.setSelection(sorter.selection);

                  }

                }

                content.element.ondblclick = event => {
                  this.fetch();
                }

                content.children = ids.map((id, rowIndex) => {
                  return {
                    tag: "li",
                    update: async frame => {
                      // frame.element.classList.toggle("selected", selection && selection.containsRow(rowIndex) || false);
                      frame.element.classList.toggle("selected", selection && KarmaFieldsAlpha.Selection.containRow(selection, rowIndex) || false);

                      const [name] = KarmaFieldsAlpha.Query.getValue(this.resource.driver, id, "name") || ["..."];

                      frame.children = [
                        {
                          tag: "span",
                          update: async span => {
                            span.element.innerHTML = name;
                          }
                        },
                        {
                          tag: "a",
                          class: "close",
                          init: close => {
                            close.element.textContent = "×";
                          },
                          update: close => {
                            close.element.onclick = async event => {
                              this.remove(rowIndex);
                              this.setSelection({index: rowIndex, length: 0, final: true});
                            }
                          }
                        }
                      ];
                    }
                  };
                });
              }
            },
            {
              class: "controls",
              update: controls => {
                controls.element.classList.toggle("hidden", this.resource.controls === false);
              },
              child: {
                class: "footer-content",
                // init: controls => {
                //   controls.element.onmousedown = event => {
                //     event.preventDefault(); // -> prevent losing focus on selected items
                //   }
                // },
                update: controls => {
                  if (this.resource.controls !== false) {
                    controls.child = this.createChild({
                      type: "controls",
                      ...this.resource.controls,
                      index: "controls"
                    }).build();
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

KarmaFieldsAlpha.field.tags.controls = class extends KarmaFieldsAlpha.field.container {

  constructor(resource) {

    super({
      display: "flex",
      children: [
        "add"
      ],
      ...resource
    });

  }

  static add = {
    type: "button",
    title: "Add",
    text: "+",
    action: "open",
    hidden: [">=", ["count", ["getValue"]], ["request", "getMax"]]
  }

  static remove = {
    type: "button",
    title: "Remove",
    text: "×",
    action: "delete",
    disabled: ["!", ["getSelection"]],
    hidden: ["=", ["count", ["getValue"]], 0]
  }

  static edit = {
    type: "button",
    title: "Edit",
    // dashicon: "update",
    action: "open",
    disabled: ["!", ["request", "getSelection"]],
    hidden: ["=", ["count", ["getValue"]], 0]
  }

}
