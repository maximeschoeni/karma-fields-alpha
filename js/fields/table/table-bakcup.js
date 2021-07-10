KarmaFieldsAlpha.fields.table = class extends KarmaFieldsAlpha.fields.form {

  constructor(resource, domain, parent) {
    super(resource, domain, parent);

    const field = this;

    window.karma_table = this; // -> debug
    this.domain.name = "Table"; // -> debug


    // compat!
    resource.columns = resource.columns.filter(function(column) {
      if (column.type === "index") {
        resource.index = column;
        return false;
      }
      return true;
    });

    // select
    this.select = new KarmaFieldsAlpha.SelectionManager();
    this.select.events.copy = function() {
      field.copy(this.selection);
			// if (navigator.clipboard && navigator.clipboard.writeText) {
			// 	var rows = [];
      //   const ids = field.ids.getValue();
			// 	for (var j = 0; j < this.selection.height; j++) {
			// 		var cols = [];
      //     const row = field.getDirectChild(ids[j+this.selection.y]);
      //     // console.log(row);
			// 		for (var i = 0; i < this.selection.width; i++) {
      //       const cell = row.children[i+1+this.selection.x];
      //       const value = cell.exportValue();
      //       cols.push(value);
			// 		}
			// 		rows.push(cols.join("\t"));
			// 	}
			// 	if (rows.length) {
			// 		var text = rows.join("\n");
			// 		navigator.clipboard.writeText(text);
			// 	}
			// }
    }
    this.select.events.paste = function() {
      field.paste(this.selection).then(function() {
        field.try("render");
      })


      // const x = this.selection.x;
      // const y = this.selection.y;
      // const ids = field.ids.getValue();
			// navigator.clipboard.readText().then(function(text) {
			// 	if (text) {
			// 		var rows = text.split(/[\r\n]+/).map(function(row) {
			// 			return row.split("\t");
			// 		});
      //     field.triggerEvent("history", true);
			// 		for (var j = 0; j < rows.length; j++) {
      //       const rowField = field.getDirectChild(ids[j+y]);
			// 			for (var i = 0; i < rows[j].length; i++) {
      //         const cellField = rowField.children[i+1+x];
      //         const value = rows[j][i];
      //         cellField.importValue(value);
      //         cellField.triggerEvent("modify");
      //         cellField.triggerEvent("set");
			// 			}
			// 		}
			// 		field.triggerEvent("change", true);
			// 	}
			// });
    }





    this.pagination = new KarmaFieldsAlpha.fields.tablePagination(resource, this.domain, this);
    this.pagination.events.change = function() {
      return field.query().then(function() {
        field.try("render");
      });
    }

    this.ordering = new KarmaFieldsAlpha.fields.tableOrdering(resource, this.domain, this);
    this.ordering.events.change = function() {
      return field.pagination.page.updateValue(1).then(function() {
        return field.query();
      }).then(function() {
        field.try("render");
      });
    }





    // filters

    this.filters = new KarmaFieldsAlpha.fields.group(resource.filters, this.domain, this);

    this.filters.events.change = function(target) {
      // field.pagination.page.setValue(1);
      // // this.clearOptions();
      // return field.query().then(function() {
      //   field.try("render");
      // });
      return field.pagination.page.updateValue(1).then(function() {
        return field.query();
      }).then(function() {
        field.try("render");
      });
    }

    this.filters.events.optionparams = function(origin) {
      let params = this.getValue();

      // don't send self value
      if (params[origin.resource.key]) {
        params[origin.resource.key] = undefined;
      }

      return params;

      // return this.getValueAsync().then(function(params) {
      //   // don't send self value
      //   if (params[origin.resource.key]) {
      //     params[origin.resource.key] = undefined;
      //   }
      //   return params;
      // });

    }

    // this.addChild(this.filters);

    // this.filters.events.fetch = function(currentField, params) {
    //
    //   // Object.assign(params, field.filters.getValue());
    //   //
    //   // // don't send value of target field
    //   // if (params[currentField.resource.key]) {
    //   //   params[currentField.resource.key] = undefined;
    //   // }
    //
    //   return field.queryOptions(field.resource.driver, params);
    //
		// };

    // this.filters.getDriver = function() {
    //   return field.resource.driver;
    // }


    // modal
    this.modal = new KarmaFieldsAlpha.fields.field({
      key: "modal"
    }, this.domain, this);

    this.modal.events.change = function() {
      field.try("render");
      return Promise.resolve();
    }




    // this.data.ids = new KarmaFieldsAlpha.fields.field({
    this.ids = new KarmaFieldsAlpha.fields.tableCol({
      key: "ids"
    }, this.domain, this);



    this.content = new KarmaFieldsAlpha.fields.form({
      driver: resource.driver
      // key: "content"
    }, this.domain, this);

    this.content.events.history = function(targetField, state) {
      // console.log("updatehistory", targetField);
      field.domain.update(targetField.getId(), state);
    };

    this.content.events.openmodal = function(modalField) {
      document.activeElement.blur();
      return field.modal.changeValue(modalField.parent.resource.key);

      // field.modal.setValue(modalField.parent.resource.key);
      //
      // field.triggerEvent("render");
    }

    this.content.events.closemodal = function(modalField) {
      // let rowId = field.modal.getValue();
      // field.selectRow(rowId);
      // field.modal.setValue("");
      // field.triggerEvent("render");

      return field.modal.getValueAsync().then(function(rowId) {
        field.selectRow(rowId);
        field.modal.changeValue("");
      });


    }

    this.content.events.optionparams = function(origin) {
      let params = field.filters.getValue();

      // don't send self value
      // if (params[origin.resource.key]) {
      //   params[origin.resource.key] = undefined;
      // }

      return params;

      // return field.filters.getValueAsync();
    }

    // -> for link fields
    this.content.events.nav = function(targetField) {
      // let value = {};
      // value[targetField.resource.key] = targetField.getValue();
      // field.setValue(value);
      // targetField.startLoad();
      // return field.query().then(function() {
      //   targetField.endLoad();
      //   field.triggerEvent("render");
      // });
      targetField.startLoad();
      return targetField.getValueAsync().then(function(value) {
        const wrap = {};
        wrap[targetField.resource.key] = value;
        return field.updateValue(wrap);
      }).then(function() {
        return field.query()
      }).then(function() {
        targetField.endLoad();
        field.try("render");
      });
    };
    // this.addChild(this.content);


    // this.controls = new KarmaFieldsAlpha.fields.tableControl(field);
  }

  readPath(keys) {
    return this.domain.readPath(keys.join("/"));
  }

  writePath(keys, rawValue) {
    this.domain.writePath(keys.join("/"), rawValue);
  }

  fetch(queryString) {
		return KarmaFieldsAlpha.Form.fetch2(this.resource.driver, queryString);
  }

  getFromPath() {
    return;
  }

  // setValue(value, context) {
  //   this.ordering.setValue(value, context);
  //   this.pagination.setValue(value, context);
  //   this.modal.setValue(value.id || "", context);
  //   this.filters.setValue(value, context);
  // }

  getValue() {
    return {
      // order: this.ordering.order.getValue(),
      // orderby: this.ordering.orderby.getValue(),
      // page: this.pagination.page.getValue(),
      // ppp: this.pagination.ppp.getValue(),
      ...this.ordering.getValue(),
      ...this.pagination.getValue(),
      ...this.filters.getValue()
    };
  }

  getValueAsync() {
		const field = this;
		return Promise.all([
      this.ordering.orderby,
      this.ordering.order,
      this.pagination.page,
      this.pagination.ppp,
      this.filters
    ].map(function(child) {
			return child.getValueAsync();
		})).then(function(values) {
			return values.reduce(function(acc, value, index) {
				const child = field.children[index];
				if (child.resource.key) {
					acc[child.resource.key] = value;
				} else {
					Object.assign(acc, value);
				}
        return acc;
			}, {});
		});
	}

  query() {
    const field = this;

    // let params = {
    //   orderby: this.ordering.orderby.getValue(),
    //   order: this.ordering.order.getValue(),
    //   page: this.pagination.page.getValue(),
    //   ppp: this.pagination.ppp.getValue(),
    //   ...this.filters.getValue()
    // };

    let params = this.getValue();



    // return this.getValueAsync().then(function(params) {
    //   return KarmaFieldsAlpha.Form.query(field.resource.driver, params);
    // }).then(function(results) {

    return KarmaFieldsAlpha.Form.query(field.resource.driver, params).then(function(results) {

      if (results.items.length && results.items.some(function(item) {
        return !item.id || typeof item.id !== "string";
      })) {
        console.log(results.items);
        console.error("Invalid item.id");
      }

      field.pagination.count.updateValue(results.count);

      const ids = results.items.map(function(item) {
        return item.id;
      });

      return field.ids.updateValue(ids).then(function() {

        results.items.forEach(function(item) {
          const row = field.content.getChild(item.id) || field.content.createChild({
            type: "tableRow",
            key: item.id
          });
          row.create(field.resource.columns || []);
          // row.setValue(item, "set");
          row.initValue(item);
        });
        return results;
      });
    });
  };

  sync() {
    const field = this;
    KarmaFieldsAlpha.Form.cache = {};
    return this.content.bubble("submit").then(function(results) {
      if (results === false) {
        return field.query();
      } else if (results && typeof results === "object") {

        // update all values from results
        // for (let key in results) {
        //   const item = results[key];
        //   if (item.id) {
        //     const row = field.content.getDirectChild(item.id) || field.content.createChild({
        //       type: "tableRow",
        //       key: item.id
        //     });
        //     row.create(field.resource.columns || []);
        //     row.setValue(item, "set");
        //     if (key !== item.id) {
        //       field.ids.replace(key, item.id, "set");
        //     }
        //
        //   }
        // }
        for (let key in results) {
          const item = results[key];
          if (item.id) {
            if (key !== item.id) {
              field.ids.replace(key, item.id);
            }
          }
        }


      }
      return results;
    });
    // const value = this.getModifiedValue();
    // const field = this;
    // return KarmaFieldsAlpha.Form.update(this.resource.driver, value).then(function(results) {
    //   // field.updateOriginal();
    //   field.setValue(value, "set");
    // });
  };

  // add(num) {
  //   const field = this;
  //   return KarmaFieldsAlpha.Form.add(this.resource.driver, {num: num || 1}).then(function(results) {
  //
  //     if (results.length) {
  //       const item = results.shift();
  //       let id = (item.id || item).toString();
  //
  //       let row = field.content.createChild({
  //         type: "tableRow",
  //         value: 1,
  //         key: id
  //       });
  //
  //
  //       row.create(field.resource.columns);
  //       row.fill(field.resource.columns);
  //       row.trash.initValue(1);
  //       row.trash.backup();
  //       return row.trash.saveValue(0, false, true).then(function() {
  //         return field.ids.add(id);
  //       }).then(function() {
  //         return id;
  //       });
  //     }
  //
  //   });
  // }

  async add(num, noBackup) {
    const field = this;
    const results = await KarmaFieldsAlpha.Form.add(this.resource.driver, {num: num || 1})

    const ids = results.map(function(item) {
      return (item.id || item).toString();
    });
    const rows = ids.map(function(id) {
      let row = field.content.createChild({
        type: "tableRow",
        value: 1,
        key: id
      });
      row.create(field.resource.columns);
      row.fill(field.resource.columns);
      row.trash.initValue(1);
      return row;
    });

    // if (rows.length) {
    //   rows[0].trash.backup();
    // }
    if (!noBackup) {
      this.content.backup("add");
    }


    await field.ids.add(ids);

    // for (let i = 0; i < rows.length; i++) {
    //   await rows[i].trash.saveValue(0, false, true);
    // }

    await Promise.all(rows.map(function(row) {
      return row.trash.saveValue(0, false, true);
    }));

  }

  // add(num) {
  //   const field = this;
  //   return KarmaFieldsAlpha.Form.add(this.resource.driver, {num: num || 1}).then(function(results) {
  //
  //     const ids = results.map(function(item) {
  //       let id = (item.id || item).toString();
  //
  //       let row = field.content.createChild({
  //         type: "tableRow",
  //         value: 1,
  //         key: id
  //       });
  //
  //       row.create(field.resource.columns);
  //       row.fill(field.resource.columns);
  //       row.trash.initValue(1);
  //
  //       return row.trash.saveValue(0, false, true)
  //
  //       return id;
  //     });
  //
  //     field.getChild(ids[0]).trash.backup();
  //
  //     // rows[0].trash.backup();
  //
  //     field.ids.add(ids).then(function() {
  //       Promise.all();
  //     });
  //
  //     return row.trash.saveValue(0, false, true).then(function() {
  //       return field.ids.add(id);
  //     }).then(function() {
  //       return id;
  //     });
  //
  //
  //   });
  // }

  // async remove() {
  //   const field = this;
  //
  //   if (field.select.selection && field.select.selection.width === field.select.grid.width) {
  //
  //     // let ids = field.ids.getValue().slice(field.select.selection.y, field.select.selection.y+field.select.selection.height);
  //     // if (ids.length) {
  //     //   field.content.getDirectChild(ids[0]).trash.triggerEvent("history", true);
  //     //   ids.forEach(function(id) {
  //     //     field.ids.remove(id, "noop");
  //     //     field.content.getDirectChild(id).trash.setValue(1, "noop");
  //     //   });
  //     //   this.triggerEvent("change", true);
  //     // }
  //     return field.ids.getValueAsync().then(function(ids) {
  //       ids = ids.slice(field.select.selection.y, field.select.selection.y+field.select.selection.height);
  //       if (ids.length) {
  //         field.content.getChild(ids[0]).trash.backup();
  //         return field.ids.remove(ids).then(function() {
  //           return Promise.all(ids.map(function(id) {
  //             return field.content.getChild(id).trash.saveValue(1, false, true);
  //           }));
  //         });
  //
  //         // return Promise.all(ids.map(function(id) {
  //         //   return field.ids.remove(id).then(function() {
  //         //     return field.content.getChild(id).trash.saveValue(1, false, true);
  //         //   });
  //         // })).then(function() {
  //         //   // return field.content.bubble("change");
  //         // });
  //       }
  //     });
  //   }
  // }

  async remove() {
    const field = this;

    if (this.select.selection && this.select.selection.width === this.select.grid.width) {
      let ids = await this.ids.getValueAsync();
      ids = ids.slice(this.select.selection.y, this.select.selection.y+this.select.selection.height);
      if (ids.length) {
        // field.content.getChild(ids[0]).trash.backup();
        this.content.bubble("history", this.content, "remove");
        await this.ids.remove(ids);
        await Promise.all(ids.map(function(id) {
          return this.content.getChild(id).trash.saveValue(1, false, true);
        }, this));
      }
    }
  }

  getModal(rowId) {
    let row = rowId && this.content.getChild(rowId);
    let modal = row && row.children.find(function(child) {
      return child instanceof KarmaFieldsAlpha.fields.modal;
    });
    if (modal) {
      return modal;
    }
  }

  getCurrentModal() {
    // let rowId = this.modal.getValue();
    // return rowId && this.getModal(rowId);
    const field = this;
    return this.modal.getValueAsync().then(function(rowId) {
      return rowId && field.getModal(rowId);
    });
  }

  selectRow(rowId) {
    // let ids = this.ids.getValue();
    // let index = ids.indexOf(rowId);
    // if (index > -1) {
    //   this.select.setFocus({x:0, y:index});
    // }
    const field = this;
    this.ids.getValueAsync().then(function(ids) {
      let index = ids.indexOf(rowId);
      if (index > -1) {
        field.select.setFocus({x:0, y:index});
      }
    });

  }

  copy(selection) {
    const field = this;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      return this.ids.getValueAsync().then(function(ids) {
        var rows = [];
        for (var j = 0; j < selection.height; j++) {
          var cols = [];
          const row = field.content.getChild(ids[j+selection.y]);
          for (var i = 0; i < selection.width; i++) {
            console.log(ids[j+selection.y], row,i+1+selection.x);
            const cell = row.children[i+1+selection.x];
            const valuePromise = cell.exportValue();
            cols.push(valuePromise);
          }
          rows.push(cols);
        }

        if (rows.length) {
          return Promise.all(rows.map(function(cols) {
            return Promise.all(cols).then(function(cols) {
              return cols.join("\t");
            });
          })).then(function(rows) {
            return rows.join("\n");
          }).then(function(text) {
            console.log(text);
            navigator.clipboard.writeText(text);
          });
        }
      });
    }
  }

  // paste(selection) {
  //
  //   const field = this;
  //   const x = selection.x;
  //   const y = selection.y;
  //   const ppp = this.page.ppp.getValue();
  //   const ids = this.ids.getValue();
  //   navigator.clipboard.readText().then(function(text) {
  //     if (text) {
  //       var rows = text.split(/[\r\n]+/).map(function(row) {
  //         return row.split("\t");
  //       });
  //       // -> should create rows if rows.length + y > ids.length
  //
  //       console.log(x, ppp);
  //
  //
  //       field.backup();
  //       const promises = [];
  //       for (var j = 0; j < rows.length; j++) {
  //         const rowField = field.content.getChild(ids[j+y]);
  //         for (var i = 0; i < rows[j].length; i++) {
  //           const cellField = rowField.children[i+1+x];
  //           const value = rows[j][i];
  //           const promise = cellField.importValue(value);
  //           promises.push(promise);
  //         }
  //       }
  //       return Promise.all(promises).then(function() {
  //         return field.content.bubble("change");
  //       });
  //     }
  //   });
  // }

  async paste(selection) {

    const field = this;
    const x = selection.x;
    const y = selection.y;
    const ppp = await this.pagination.ppp.getValueAsync();
    let ids = await this.ids.getValueAsync();
    const text = await navigator.clipboard.readText();

    if (text) {
      let rows = text.split(/[\r\n]+/).map(function(row) {
        return row.split("\t");
      });
      // rows = rows.slice(0, ppp-y);

      field.content.backup("paste");

      if (rows.length > ids.length-y) {
        await this.add(rows.length-(ids.length-y), false);
        ids = await this.ids.getValueAsync();
      }

      const promises = [];
      for (let j = 0; j < rows.length; j++) {
        const rowField = field.content.getChild(ids[j+y]);
        for (let i = 0; i < rows[j].length; i++) {
          console.log(rowField, i+1+x);
          const cellField = rowField.children[i+1+x];
          const value = rows[j][i];
          const promise = cellField.importValue(value);
          promises.push(promise);
        }
      }
      await Promise.all(promises);
      await field.content.bubble("change");
    }
  }

  editAll(conductor, value) {
    // console.log(conductor, value);
    if (conductor && this.select && this.select.selection && this.select.focusRect && this.select.selection.height > 1) {
      const selection = this.select.selection;
      const focusRect = this.select.focusRect;
      const field = this;
      const x = selection.x;
      const y = selection.y;
      return this.ids.getValueAsync().then(function(ids) {
        // return conductor.getValueAsync().then(function(value) {
          field.backup();
          const promises = [];
          for (var j = 0; j < selection.height; j++) {
            const rowField = field.content.getChild(ids[j+y]);
            const cellField = rowField.children[focusRect.x+1];
            if (cellField !== conductor) {
              const promise = cellField.importValue(value);
              promises.push(promise);
            }
          }
          return Promise.all(promises);
        // });
      });
    } else {
      return Promise.resolve();
    }
  }

  build() {
    const field = this;

    return {
      class: "karma-field-table",
      init: function(container) {


        field.onSet = function() {

          // console.log("render (onSet)");
          container.render();
        }

        // field.ordering.events.render = function() {
        //   container.render();
        // };
        // field.filters.events.render = function() {
        //   container.render();
        // };
        // field.pagination.events.render = function() {
        //   container.render();
        // };

        // for modals + filters + order + pagination
        field.render = function() {

          // console.log("render");
          container.render();
        };




        // -> first load table
        // container.element.classList.add("loading");
        field.query().then(function(results) {
          // container.element.classList.remove("loading");

          container.render();
        });
      },
      update: function(container) {





        this.children = [
          {
            class: "table-header",
            children: [
              {
                tag: "h1",
                init: function() {
                  this.element.textContent = field.resource.title || "";
                }
              },
              field.filters.build()
            ]
          },

          // modal
          {
            class: "modal-container",
            update: function(modalContainer) {
              // let modal = field.getCurrentModal();
              // if (modal) {
              //   this.children = [
              //     modal.buildModal()
              //   ];
              //   document.body.style.overflow = "hidden";
              // } else {
              //   this.children = [];
              //   document.body.style.overflow = "visible";
              // }
              field.getCurrentModal().then(function(modal) {
                if (modal) {
                  modalContainer.children = [
                    modal.buildModal()
                  ];
                  document.body.style.overflow = "hidden";
                } else {
                  modalContainer.children = [];
                  document.body.style.overflow = "visible";
                }
                modalContainer.render();
              });
            }
          },

          // table body
          {
            class: "table-body",
            child: {
              class: "table grid",
              // clear: true,
              init: function(table) {
                field.select.register(this.element);
                field.content.events.init = function(targetField, element) {
                  let indexCol = field.resource.index || field.resource.index === undefined ? 1 : 0;
                  let count = table.element.children.length;
                  let col = (count-1)%(field.resource.columns.length+indexCol) - indexCol;
                  let row = Math.floor((count-1)/(field.resource.columns.length+indexCol)) - 1;
                  field.select.registerCell(element, col, row);
                }
              },
              update: function(table) {
                this.children = [];
                let widths = [];

                // table header index cell
                if (field.resource.index || field.resource.index === undefined) {
                  this.children.push({
                    class: "th table-header-index karma-field",
                    init: function() {
                      this.element.textContent = field.resource.index && field.resource.index.title || "#";
                      field.select.registerHeaderIndex(this.element);
                    }
                  });
                  widths.push(field.resource.index && field.resource.index.width || "auto");
                }

                // table header cells
                field.resource.columns.forEach(function(column, colIndex) {
                  table.children.push({
                    class: "th karma-field",
                    init: function() {
                      field.select.registerHeader(this.element, colIndex);
                    },
                    update: function(th) {
                      this.children = [
                        {
                          tag: "a",
                          class: "header-cell-title",
                          init: function() {
                            this.element.textContent = column.title;
                          }
                        }
                      ];
                      if (column.sortable) {
                        this.children.push(field.ordering.build(column));
                      }
                    }
                  });
                  widths.push(column.width || "1fr");
                });

                // table body cells
                if (field.ids.getValue().length) {
                  field.ids.getValue().forEach(function(id, rowIndex) {

                    let rowField = field.content.getChild(id);

                    if (field.resource.index || field.resource.index === undefined) {
                      table.children.push({
                        class: "th table-row-index karma-field",
                        init: function() {
                          field.select.registerIndex(this.element, rowIndex);
                        },
                        update: function() {
                          let page = field.pagination.page.getValue();
                          let ppp = field.pagination.ppp.getValue();
                          this.element.textContent = (page - 1)*ppp + rowIndex + 1;
                        }
                      });
                    }

                    field.resource.columns.forEach(function(column, colIndex) {

                      let cellField = rowField.getChild(column.field.key) || rowField.createChild(column.field);
                      const args = cellField.build();
                      table.children.push(args);
                    });
                  });
                }

                this.element.style.gridTemplateColumns = widths.join(" ");
              }
            }
          },

          // table footer
          {
            class: "table-footer",
            init: function(footer) {

              // field.events.renderFooter = function() {
              //   footer.render();
              // }

              field.content.events.change = function(targetField, value) {

                return field.editAll(targetField, value).then(function() {
                  footer.render();
                });

              };


              field.events.change = function(targetField) {
                console.error("deprecated: use field.content.triggerEvent('change')");
                footer.render();
              };


              field.select.events.select = function() {
                footer.render();
              };

            },
            update: function(footer) {

              field.modal.getValueAsync().then(function(modal) {
                footer.element.classList.toggle("modal-open", modal || false);
              });

              this.children = [
                {
                  class: "footer-bar",
                  children: [
                    {
                      class: "footer-group table-info",
                      update: function() {
                        let buttons = field.resource.controls || [
                          {
                            type: "save",
                            name: "Save"
                          },
                          {
                            type: "undo",
                            name: "Undo"
                          },
                          {
                            type: "redo",
                            name: "Redo"
                          },
                          {
                            type: "add",
                            name: "Add"
                          },
                          {
                            type: "delete",
                            name: "Delete"
                          }
                        ];
                        this.children = buttons.map(function(resource) {
                          if (KarmaFieldsAlpha.fields.tableControls[resource.type]) {
                            const button = new KarmaFieldsAlpha.fields.tableControls[resource.type]();
                            return button.build(field, resource);
                          }
                        });
                      }
                    },
                    // {
                    //   class: "footer-group table-info",
                    //   children: [
                    //     // {
                    //     //   tag: "button",
                    //     //   class: "button footer-item",
                    //     //   init: function(item) {
                    //     //     this.element.title = "Reload";
                    //     //     this.element.textContent = "Reload";
                    //     //     this.element.addEventListener("click", function(event) {
                    //     //       item.element.classList.add("loading");
                    //     //
                    //     //       // empty cache
                    //     //       KarmaFieldsAlpha.Form.cache = {};
                    //     //
                    //     //       // -> still need to reboot fields options
                    //     //
                    //     //       field.query().then(function() {
                    //     //         item.element.classList.remove("loading");
                    //     //         container.render();
                    //     //       });
                    //     //     });
                    //     //   }
                    //     // },
                    //     {
                    //       tag: "button",
                    //       class: "karma-button footer-item primary",
                    //       init: function(button) {
                    //         this.element.title = "Save";
                    //         this.element.addEventListener("click", function(event) {
                    //           button.element.classList.add("loading");
                    //           field.sync().then(function() {
                    //             button.element.classList.remove("loading");
                    //             button.element.blur();
                    //             container.render();
                    //           });
                    //         });
                    //       },
                    //       children: [
                    //         {
                    //           tag: "span",
                    //           class: "button-content",
                    //           init: function() {
                    //             this.element.textContent = "Save";
                    //           }
                    //         },
                    //         {
            				// 					class: "karma-field-spinner"
            				// 				}
                    //       ],
                    //       update: function() {
                    //         const modifiedValues = field.content.getModifiedValue();
                    //         this.element.disabled = !modifiedValues;
                    //       }
                    //     },
                    //     {
                    //       tag: "button",
                    //       class: "karma-button footer-item",
                    //       children: [
                    //         // new KarmaFieldsAlpha.fields.icon({
                    //         //   type: "icon",
                    //         //   value: "undo.svg"
                    //         // }).build()
                    //         {
                    //           init: function() {
                    //             this.element.textContent = "Undo";
                    //           }
                    //         }
                    //       ],
                    //       init: function(item) {
                    //         this.element.title = "Undo";
                    //         this.element.addEventListener("click", function(event) {
                    //           field.domain.undo();
                    //           // field.clearValue();
                    //           // field.content.clearValue();
                    //
                    //           container.render();
                    //         });
                    //       },
                    //       update: function() {
                    //         this.element.disabled = field.domain.index === 0;
                    //       }
                    //     },
                    //     {
                    //       tag: "button",
                    //       class: "karma-button footer-item",
                    //       children: [
                    //         // child: new KarmaFieldsAlpha.fields.icon({
                    //         //   type: "icon",
                    //         //   value: "redo.svg"
                    //         // }).build(),
                    //         {
                    //           init: function() {
                    //             this.element.textContent = "Redo";
                    //           }
                    //         }
                    //       ],
                    //       init: function(button) {
                    //         this.element.title = "Redo";
                    //         this.element.addEventListener("click", function(event) {
                    //           field.domain.redo();
                    //
                    //           // field.clearValue();
                    //           // field.content.clearValue();
                    //
                    //           container.render();
                    //         });
                    //       },
                    //       update: function(button) {
                    //         this.element.disabled = field.domain.index >= field.domain.max;
                    //       }
                    //     },
                    //     {
                    //       tag: "button",
                    //       class: "karma-button footer-item",
                    //       children: [
                    //         // new KarmaFieldsAlpha.fields.icon({
                    //         //   type: "icon",
                    //         //   value: "plus-alt2.svg"
                    //         // }).build(),
                    //         {
                    //           init: function() {
                    //             this.element.textContent = "Add";
                    //           }
                    //         },
                    //         {
                    //           class: "karma-field-spinner"
                    //         }
                    //       ],
                    //       init: function(button) {
                    //         this.element.title = "Add";
                    //         this.element.addEventListener("click", function(event) {
                    //           button.element.classList.add("loading");
                    //           field.add().then(function() {
                    //             button.element.classList.remove("loading");
                    //             container.render(true);
                    //           });
                    //         });
                    //       },
                    //       update: function(element) {
                    //         this.element.disabled = field.resource.can_add === false || field.resource.can_add && !(new Function("element", "field", field.resource.can_add))(this.element, field);
                    //       }
                    //     },
                    //     {
                    //       tag: "button",
                    //       class: "karma-button footer-item",
                    //       children: [
                    //         // new KarmaFieldsAlpha.fields.icon({
                    //         //   type: "icon",
                    //         //   value: "trash.svg"
                    //         // }).build(),
                    //         {
                    //           init: function() {
                    //             this.element.textContent = "Delete";
                    //           }
                    //         }
                    //       ],
                    //
                    //       init: function(item) {
                    //         this.element.title = "Delete";
                    //         this.element.onmousedown = function(event) {
                    //           event.preventDefault(); // prevent current table cell losing focus
                    //           this.onmouseup = function(event) {
                    //             field.remove().then(function() {
                    //               field.select.removeFocus();
                    //               container.render();
                    //             });
                    //
                    //           };
                    //         };
                    //       },
                    //       update: function(element) {
                    //         this.element.disabled = !(field.select.selection && field.select.selection.width === field.select.grid.width);
                    //       }
                    //     }
                    //   ]
                    // },
                    field.pagination.build(),
                    {
                      class: "footer-group table-modal-nav",
                      clear: true,
                      update: function() {
                        this.children = [
                          {
                            tag: "button",
                            class: "karma-button footer-item",
                            init: function(button) {
                              this.element.innerText = "<";
                            },
                            update: function(button) {
                              this.element.onclick = function() {
                                // const rowId = field.modal.getValue();
                                // const next = field.ids.getPrev(rowId);
                                // if (next) {
                                //   field.modal.setValue(next);
                                //   field.triggerEvent("render");
                                // }
                                field.modal.getValueAsync().then(function(id) {
                                  return field.ids.getPrev(id);
                                }).then(function(id) {
                                  field.modal.write(id);
                                  field.triggerEvent("render");
                                });
                              };
                              // const currentRowId = field.modal.getValue();
                              // this.element.disabled = field.ids.getPrev(currentRowId) ? false : true;
                              field.modal.getValueAsync().then(function(currentRowId) {
                                return field.ids.getPrev(currentRowId);
                              }).then(function(id) {
                                button.element.disabled = id ? false : true;
                              });
                            }
                          },
                          {
                            tag: "button",
                            class: "karma-button footer-item",
                            init: function(button) {
                              this.element.innerText = ">";
                            },
                            update: function(button) {
                              this.element.onclick = function() {
                                // const rowId = field.modal.getValue();
                                // const next = field.ids.getNext(rowId);
                                //
                                // if (next) {
                                //   field.modal.setValue(next);
                                //   field.triggerEvent("render");
                                // }
                                field.modal.getValueAsync().then(function(id) {
                                  return field.ids.getNext(id);
                                }).then(function(id) {
                                  field.modal.write(id);
                                  field.triggerEvent("render");
                                });
                              };
                              // const currentRowId = field.modal.getValue();
                              // this.element.disabled = field.ids.getNext(currentRowId) ? false : true;

                              field.modal.getValueAsync().then(function(currentRowId) {
                                return field.ids.getNext(currentRowId);
                              }).then(function(id) {
                                button.element.disabled = id ? false : true;
                              });
                            }
                          }
                        ];
                      }
                    }
                  ]
                }
              ];
            }
          }
        ];
      }


    };
  }



}
