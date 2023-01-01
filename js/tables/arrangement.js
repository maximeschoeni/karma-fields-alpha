
KarmaFieldsAlpha.field.layout.arrangement = class extends KarmaFieldsAlpha.field.layout.collection {

  async swap(index, length, target) {

    const ids = this.getIds();
    const clones = [...ids];
    const slice = clones.splice(index, length);
    clones.splice(target, 0, ...slice);

    for (let i in clones) {
      await this.setValue(i, clones[i], this.resource.orderby || "menu_order");
    }

    this.idsBuffer.set(clones);

  }

  async createTree(ids) {

    const map = {};

    for (let id of ids) {

      const [parent] = await this.getValue(id, this.resource.alias && this.resource.alias.parent || "parent");

      map[id] = {
        children: [],
        parent: parent,
        id: id
      };

    }

    for (let id in map) {

      const item = map[id];
      const parent = item.parent || "0";

      if (!map[parent]) {

        map[parent] = {
          children: [],
          id: parent
        };

      }

      map[parent].children.push(item);

    }

    return map["0"];

  }

  buildNode(node, index, depth) {

    return {
      tag: "li",
      class: "arrangement-item",
      update: li => {
        li.element.classList.toggle("empty", node.children.length === 0);
      },
      children: [
        {
          tag: "ul",
          class: "arrangement-item-header",
          update: header => {
            const row = this.createChild({
              key: node.id,
              type: "row",
              children: this.resource.children || [],
              index: index,
              depth: depth
            });
            header.children = row.resource.children.map(child => {
              return {
                tag: "li",
                child: row.createChild(child).build()
              }
            });
          }
        },
        {
          tag: "ul",
          class: "arrangement-item-body",
          children: node.children.map((child, index) => {
            return this.buildNode(child, index, depth + 1);
          })
        }
      ]
    };

  }

  build() {

    return {
      class: "karma-field-table-grid-container karma-field-frame karma-field-group arrangement",
      init: body => {
        body.element.tabIndex = -1;
      },
      update: body => {
        this.clipboard = this.createChild("clipboard");
        body.element.onfocus = async event => {
          const selection = this.selectionBuffer.get();
          if (selection) {
            KarmaFieldsAlpha.History.save();
            this.selectionBuffer.change(null);
            await this.parent.request("render");
          }
          this.clipboard.output("");
          this.clipboard.focus();
        }
        body.children = [
          this.clipboard.build(),
          {
            tag: "ul",
            class: "table grid arrangement",
            init: async grid => {
              if (this.resource.style) {
                grid.element.style = this.resource.style;
              }
            },



            update: async grid => {

              const ids = this.getIds();
              // const page = this.getPage();
              // const ppp = this.getPpp();
              // const offset = (page - 1)*ppp;
              // const columns = this.getColumns();

              const tree = await this.createTree(ids);

              this.clipboard.onInput = async value => {
                const dataArray = KarmaFieldsAlpha.Clipboard.parse(value);
                const data = KarmaFieldsAlpha.Clipboard.toJson(dataArray);
                const selection = this.selectionBuffer.get() || {};

                if (selection.length || data.length) {
                  KarmaFieldsAlpha.History.save();
                  await this.import(data, selection.index, selection.length);
                  this.selectionBuffer.change(null);
                  await this.parent.request("render");
                }

              }

              const selection = this.selectionBuffer.get();

              // grid.element.colCount = 1;
              // grid.element.rowCount = ids.length;
              // grid.element.colHeader = 0;
              // grid.element.rowHeader = 0;


              this.selector = new KarmaFieldsAlpha.Selector(grid.element);
              this.selector.colCount = 1;
              this.selector.rowCount = tree.children.length;
              this.selector.colHeader = 0;
              this.selector.rowHeader = 0;



              grid.children = tree.children.map((child, index) => {
                return this.buildNode(child, index, 0);
              });


              // if (ids.length) {
              //   grid.element.classList.add("filled"); // -> draw table borders
              //   grid.children = ids.reduce((children, id, rowIndex) => {
              //
              //     const row = this.createChild({
              //       key: id,
              //       type: "row",
              //       children: this.resource.children || [],
              //       index: offset + rowIndex + 1
              //     });
              //
              //     const isSelected = selection && KarmaFieldsAlpha.Segment.contain(selection, rowIndex);
              //
              //     row.index = offset + rowIndex + 1;
              //     row.isSelected = isSelected;
              //     row.rowIndex = rowIndex;
              //
              //     return [
              //       ...children,
              //       ...columns.map((colId, colIndex) => {
              //         const child = this.resource.children[colId];
              //         const field = row.createChild(child);
              //         return {
              //           class: "td table-cell",
              //           init: td => {
              //             if (child.style) {
              //               td.element.style = child.style;
              //             }
              //             td.element.tabIndex = -1;
              //           },
              //           update: td => {
              //             td.element.classList.add("loading");
              //             td.element.classList.toggle("selected", Boolean(isSelected));
              //             td.element.rowIndex = rowIndex;
              //             td.element.colIndex = colIndex;
              //
              //             td.element.onmousedown = async event => {
              //
              //               if (event.buttons === 1) {
              //
              //                 const selectionManager = new KarmaFieldsAlpha.SortManager(grid.element);
              //
              //                 const currentSelection = selectionManager.selection = this.selectionBuffer.get();
              //
              //                 selectionManager.onSelect = async (selection) => {
              //
              //                   if (!KarmaFieldsAlpha.Segment.compare(currentSelection, selection)) {
              //                     KarmaFieldsAlpha.History.save();
              //                     this.selectionBuffer.change(selection, currentSelection);
              //                   }
              //
              //                   const jsonData = await this.export([], selection.index, selection.length);
              //                   const dataArray = KarmaFieldsAlpha.Clipboard.toDataArray(jsonData);
              //                   const value = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
              //                   this.clipboard.output(value);
              //                   this.clipboard.focus();
              //                   await this.parent.request("render");
              //
              //                 };
              //
              //                 selectionManager.onSort = async (index, length, target) => {
              //
              //                   KarmaFieldsAlpha.History.save();
              //
              //                   await this.swap(index, length, target);
              //                   this.selectionBuffer.change({index: target, length: length}, currentSelection);
              //
              //                   const jsonData = await this.export([], selection.index, selection.length);
              //                   const dataArray = KarmaFieldsAlpha.Clipboard.toDataArray(jsonData);
              //                   const value = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
              //
              //                   this.clipboard.output(value);
              //                   this.clipboard.focus();
              //
              //
              //                   await this.parent.request("render");
              //
              //                 };
              //
              //                 selectionManager.select(event, colIndex, rowIndex, field.resource.selectMode !== "row");
              //
              //               }
              //
              //             }
              //
              //           },
              //           complete: td => {
              //             td.element.classList.remove("loading");
              //           },
              //           child: field.build()
              //         };
              //       })
              //     ];
              //   }, []);
              //
              //   grid.element.style.gridTemplateColumns = columns.map(index => this.resource.children[index].width || "auto").join(" ");
              //
              // } else {
              //   grid.children = [];
              //   grid.element.classList.remove("filled");
              // }
            },
            complete: async grid => {
              if (document.activeElement === document.body) {
                // const jsonData = await this.parent.request("export");
                const jsonData = await this.exportSelection();
                const dataArray = KarmaFieldsAlpha.Clipboard.toDataArray(jsonData);
                const value = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
                this.clipboard.output(value);
                this.clipboard.focus();
              }
            }
          }
        ];
      }
    }

  }





  buildX() {

    return {
      class: "karma-field-table-grid-container karma-field-frame karma-field-group arrangement",
      init: body => {
        body.element.tabIndex = -1;
      },
      update: body => {
        this.clipboard = this.createChild("clipboard");
        this.clipboard.onInput = async value => {
          const dataArray = KarmaFieldsAlpha.Clipboard.parse(value);
          const data = KarmaFieldsAlpha.Clipboard.toJson(dataArray);
          const selection = this.selectionBuffer.get() || {};

          if (selection.length || data.length) {
            KarmaFieldsAlpha.History.save();
            await this.import(data, selection.index, selection.length);
            this.selectionBuffer.change(null);
            await this.parent.request("render");
          }

        }

        body.element.onfocus = async event => {
          const selection = this.selectionBuffer.get();
          if (selection) {
            KarmaFieldsAlpha.History.save();
            this.selectionBuffer.change(null);
            await this.parent.request("render");
          }
          this.clipboard.output("");
          this.clipboard.focus();
        }
        body.children = [
          this.clipboard.build(),
          {
            tag: "ul",
            class: "table grid arrangement",
            init: async grid => {
              if (this.resource.style) {
                grid.element.style = this.resource.style;
              }

            },



            update: async grid => {

              const ids = this.getIds();
              const page = this.getPage();
              const ppp = this.getPpp();
              const offset = (page - 1)*ppp;
              const columns = this.getColumns();

              const tree = await this.createTree(ids);



              const selection = this.selectionBuffer.get();

              // grid.element.colCount = 1;
              // grid.element.rowCount = ids.length;
              // grid.element.colHeader = 0;
              // grid.element.rowHeader = 0;

              grid.children = tree.children.map((child, index) => {
                return this.buildNode(child, index, 0);
              });

              const tracker = new KarmaFieldsAlpha.Sorter(grid.element);

              tracker.colCount = 1;
              tracker.rowCount = ids.length;
              tracker.colHeader = 0;
              tracker.rowHeader = 0;
              tracker.currentSelection = this.selectionBuffer.get();

              tracker.onselect = async newSelection => {

                if (!KarmaFieldsAlpha.Segment.compare(selection, newSelection)) {
                  KarmaFieldsAlpha.History.save();
                  this.selectionBuffer.change(newSelection, selection);
                }

                const jsonData = await this.export([], tracker.newSelection.index, tracker.newSelection.length);
                const dataArray = KarmaFieldsAlpha.Clipboard.toDataArray(jsonData);
                const value = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
                this.clipboard.output(value);
                // this.clipboard.setJson(jsonData);
                this.clipboard.focus();

                await this.parent.request("render");

              };

              tracker.onSort = async (index, length, target) => {
                KarmaFieldsAlpha.History.save();
                await this.swap(index, length, target);
                this.selectionBuffer.change({index: target, length: length}, selection);
                await this.parent.request("render");
              };

              // grid.element.onselectionstart = tracker => {
              //   tracker.colCount = 1;
              //   tracker.rowCount = ids.length;
              //   tracker.colHeader = 0;
              //   tracker.rowHeader = 0;
              //   tracker.currentSelection = this.selectionBuffer.get();
              // }
              //
              // grid.element.onselect = (tracker, selection) => {
              //
              //   if (!KarmaFieldsAlpha.Segment.compare(tracker.currentSelection, tracker.newSelection)) {
              //     KarmaFieldsAlpha.History.save();
              //     this.selectionBuffer.change(tracker.newSelection, tracker.currentSelection);
              //   }
              //
              //   const jsonData = await this.export([], tracker.newSelection.index, tracker.newSelection.length);
              //   const dataArray = KarmaFieldsAlpha.Clipboard.toDataArray(jsonData);
              //   const value = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
              //   this.clipboard.output(value);
              //   this.clipboard.focus();
              //   await this.parent.request("render");
              //
              // }
              //
              // grid.element.onSort = (tracker, index, length, target) => {
              //
              //   KarmaFieldsAlpha.History.save();
              //
              //   await this.swap(index, length, target);
              //
              //   // const selection = {index: target, length: length};
              //   this.selectionBuffer.change({index: target, length: length}, tracker.currentSelection);
              //
              //   // const jsonData = await this.export([], selection.index, selection.length);
              //   // const dataArray = KarmaFieldsAlpha.Clipboard.toDataArray(jsonData);
              //   // const value = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
              //
              //   // this.clipboard.output(value);
              //   // this.clipboard.focus();
              //
              //   await this.parent.request("render");
              // }


              if (ids.length) {
                grid.element.classList.add("filled"); // -> draw table borders
                grid.children = ids.reduce((children, id, rowIndex) => {

                  const row = this.createChild({
                    key: id,
                    type: "row",
                    children: this.resource.children || [],
                    index: offset + rowIndex + 1
                  });

                  const isSelected = selection && KarmaFieldsAlpha.Segment.contain(selection, rowIndex);

                  // row.index = offset + rowIndex + 1;
                  // row.isSelected = isSelected;
                  // row.rowIndex = rowIndex;

                  return [
                    ...children,
                    ...columns.map((colId, colIndex) => {
                      const child = this.resource.children[colId];
                      const field = row.createChild(child);
                      return {
                        class: "td table-cell",
                        init: td => {
                          if (child.style) {
                            td.element.style = child.style;
                          }
                          td.element.tabIndex = -1;
                        },
                        update: td => {
                          td.element.classList.add("loading");
                          td.element.classList.toggle("selected", Boolean(isSelected));
                        },
                        complete: td => {
                          td.element.classList.remove("loading");
                        },
                        child: field.build()
                      };
                    })
                  ];
                }, []);

                grid.element.style.gridTemplateColumns = columns.map(index => this.resource.children[index].width || "auto").join(" ");

              } else {
                grid.children = [];
                grid.element.classList.remove("filled");
              }
            },
            complete: async grid => {
              if (document.activeElement === document.body) {
                // const jsonData = await this.parent.request("export");
                const jsonData = await this.exportSelection();
                const dataArray = KarmaFieldsAlpha.Clipboard.toDataArray(jsonData);
                const value = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
                this.clipboard.output(value);
                this.clipboard.focus();
              }
            }
          }
        ];
      }
    }

  }


}
