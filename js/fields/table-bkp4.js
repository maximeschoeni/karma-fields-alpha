KarmaFieldsAlpha.fields.table = class extends KarmaFieldsAlpha.fields.form {

  constructor(resource, domain) {
    super(resource, domain);

    const field = this;

    window.karma_table = this;


    this.data.select = KarmaFieldsAlpha.selectors.grid();


    // this.resource = resource;

    this.data.filters = new KarmaFieldsAlpha.fields.group(resource.filters);

    // this.filters.events.change = function(currentField) {
    //   currentField.history.save();
    //   currentField.trigger("update");
    //
    //   return field.trigger("queryTable").then(function() {
    //     container.render(true);
    //   });
    // };

    // this.data.filters.parent = this;
    // this.data.filters.events.change = function() {};
    // this.data.filters.fetch = this.fetch.bind(this);
    //

    this.data.orderby = new KarmaFieldsAlpha.fields.field({
      key: "orderby",
      value: resource.orderby
    }, this.domain);
    this.data.order = new KarmaFieldsAlpha.fields.field({
      key: "order",
      value: this.getDefaultOrder() || "asc"
    }, this.domain);
    this.data.page = new KarmaFieldsAlpha.fields.field({
      key: "page",
      value: 1,
      datatype: "number"
    }, this.domain);
    this.data.ppp = new KarmaFieldsAlpha.fields.field({
      key: "ppp",
      value: resource.ppp || 50,
      datatype: "number"
    }, this.domain);
    this.data.count = new KarmaFieldsAlpha.fields.field({
      key: "count",
      datatype: "number"
    }, this.domain);


    // this.data.ids = new KarmaFieldsAlpha.fields.field({
    this.data.ids = new KarmaFieldsAlpha.fields.tableCol({
      key: "ids"
    }, this.domain);

    this.data.header = new KarmaFieldsAlpha.fields.field();
    this.data.header.addChildren([
      this.data.filters,
      this.data.orderby,
      this.data.order,
      this.data.page,
      this.data.ppp,
      this.data.count,
      this.data.ids
    ]);



    this.events.history = function(targetField) {
      field.domain.update(targetField.getId(), targetField.state);
    };



    // this.data.header = new KarmaFieldsAlpha.fields.container({
    //   children: [
    //     {
    //       key: "filters",
    //       type: "group",
    //       children: resource.filters
    //     },
    //     {
    //       key: "orderby",
    //       value: resource.orderby
    //     },
    //     {
    //       key: "order",
    //       value: this.getDefaultOrder() || "asc"
    //     },
    //     {
    //       key: "page",
    //       value: 1,
    //       datatype: "number"
    //     },
    //     {
    //       key: "ppp",
    //       value: resource.ppp || 50,
    //       datatype: "number"
    //     },
    //     {
    //       key: "count",
    //       datatype: "number"
    //     },
    //     {
    //       key: "ids",
    //       datatype: "array"
    //     }
    //   ]
    // });
    //
    // this.data.filters = this.data.header.getDescendant("filters");
    // this.data.orderby = this.data.header.getDescendant("orderby");
    // this.data.order = this.data.header.getDescendant("order");
    // this.data.page = this.data.header.getDescendant("page");
    // this.data.ppp = this.data.header.getDescendant("ppp");
    // this.data.count = this.data.header.getDescendant("count");
    // this.data.ids = this.data.header.getDescendant("ids");



    this.data.filters.events.fetch = function(currentField, params) {

      Object.assign(params, field.data.filters.getValue());

      // don't send value of target field
      if (params[currentField.resource.key]) {
        params[currentField.resource.key] = undefined;
      }

      return field.queryOptions(field.resource.driver, params);

		};

    // this.data.header.setKey = async function(key, value, context) {
    //   let child = this.getDescendant(key);
    //   let value = await child.getValue();
    //   child.setValue(value, context);
    // }
    // this.data.header.getValue = async function() {
    //   return {
    //     orderby: await this.getDescendant("orderby").getValue(),
    //
    //   }
    //
    //   return {
    //     orderby: this.parse(this.getDescendant("orderby").value)
    //   }
    //
    //
    //   {orderby} = await Promise.all(this.children.map(function(child) {
    //     return child.getValue;
    //   }));
    //   child.setValue(value, context);
    // }
    //


    //
    // this.data.header.datatype = "object";
    // this.data.header.setKey = async function(key, value, context) {
    //   let value = await this.getValue();
    //   value[key] = value;
    //   this.setValue(value, context);
    // }
    // this.data.header.setKey("orderby", resource.orderby);



    // this.data.header.events.set = function(field) {
    //   KarmaFieldsAlpha.History.save(field, resource.driver);
    // };


    // this.data.body = new Field();
    // this.data.body.events.change = this.change.bind(this);

    // this.events.change = function(field) {
    //   KarmaFieldsAlpha.History.update(field, resource.driver);
    //   // field.history.save();
    //   KarmaFieldsAlpha.History.save(field, resource.driver);
    //
    // };

  }

  query() {

    // let params = Object.assign({
    //   orderby: field.data.orderby.getValue(),
    //   order: field.data.order.getValue(),
    //   page: field.data.page.getValue(),
    //   ppp: field.data.ppp.getValue()
    // }, field.data.filters.getValue());

    const field = this;


    let params = {
      orderby: field.data.orderby.getValue(),
      order: field.data.order.getValue(),
      page: field.data.page.getValue(),
      ppp: field.data.ppp.getValue(),
      ...field.data.filters.getValue()
    };


    		console.log("querystart");
    		const t0 = performance.now();


    return KarmaFieldsAlpha.Form.fetch(field.resource.driver, "querytable", params).then(function(results) {


      const t1 = performance.now();
      console.log("queryend", t1-t0);

      field.data.count.setValue(results.count, "set");
      field.data.ids.setValue(results.items.map(function(item) {
        return item.id;
      }), "set");
      const t2 = performance.now();
      console.log("queryend2", t2-t1);

      results.items.forEach(function(item) {
        // field.createRow(item);
        const tx0 = performance.now();
        const row = field.getDescendant(item.id) || field.createChild({
          type: "tableRow",
          key: item.id
        });
        const tx1 = performance.now();
        row.setValue(item, "set");
        const tx2 = performance.now();
        console.log("tx", tx2-tx1, tx1-tx0);
      });
      const t3 = performance.now();
      console.log("queryend3", t3-t2);
      return results;
    });
  };

  sync() {
    const value = this.getModifiedValue();
    const field = this;
    return KarmaFieldsAlpha.Form.update(this.resource.driver, value).then(function(results) {
      // field.updateOriginal();
      field.setValue(value, "set");
    });
  };

  add() {
    const field = this;
    return KarmaFieldsAlpha.Form.add(this.resource.driver, this.data.filters.getValue()).then(function(results) {
      // const value = {};
      // value.id = id;
      // field.resource.columns.forEach(function(column) {
      //   if (column.field) {
      //     value[column.field.key] = column.field.default || column.field.value || ""; // if type was defined statically could use getFieldClass(column.field.type).getEmpty()
      //   }
      // });


      let row = field.createChild({
        type: "tableRow",
        key: results.id
      });

      row.fill();

      // field.resource.columns.forEach(function(column) {
      //   if (column.field && column.field.key) {
      //     let child = row.getDescendant(column.field.key) || row.createChild(column.field);
      //     if (value[column.field.key] !== undefined) {
      //       child.setValue(value[column.field.key], "set");
      //     } else {
      //       child.setValue(child.getDefault(), "set");
      //     }
      //   }
      // });
      let trash = row.getDescendant("trash");
      trash.setValue(1, "set");
      trash.setValue(0, "change");

      field.data.ids.add(results.id, "set");

      // field.triggerEvent("change");

      // field.createChild({
      //   type: "tableRow",
      //   columns: field.resource.columns
      // }).setValue(field.resource.columns.reduce(function(value, item) {
      //   if (item.field) {
      //     value[item.field.key] = item.field.default || item.field.value || "";
      //   }
      //   return value;
      // }, {
      //   id: id
      // }), "change");



      // field.createRow(value);
      // // field.data.ids.setValue([value.id].concat(ids.getValue()), "set");
      // let ids = field.data.ids.getValue();
      // ids.push(id);
      // field.data.ids.setValue(ids), "set");
      return results.id;
    });
  };

  remove() {
    const field = this;
    let rows = this.data.select && this.data.select.getSelectedRows().map(function(cell) {
      return cell.field.parent;
    });
    if (rows) {
      // this.data.ids.setValue(ids.getValue().filter(function(id) {
      //   return !rows.some(function(row) {
      //     row.resource.key == id;
      //   });
      // }), "set");
      // rows.forEach(function(row) {
      //   let trashField = row.getDescendant("trash") || row.createChild({
      //     key: "trash",
      //     datatype: "number"
      //   });
      //   trashField.setValue(1, "change");
      // });

      field.triggerEvent("history");

      rows.forEach(function(row) {
        // let trashField = row.getDescendant("trash") || row.createChild({
        //   key: "trash",
        //   datatype: "number"
        // });
        field.data.ids.remove(row.resource.key, "noop");
        row.getDescendant("trash").setValue(1, "noop");

      });

    }
  }

  // createRow(value) { // empty prevent loading independant values
  //   const field = this;
  //
  //   let row = this.getDescendant(value.id) || this.createChild({
  //     type: "container",
  //     key: value.id
  //   });
  //   let trashField = row.getDescendant("trash") || row.createChild({
  //     key: "trash",
  //     datatype: "number"
  //   });
  //   trashField.setValue(0, "change");
  //   // row.setValue(value, "change");
  //
  //   this.resource.columns.forEach(function(column) {
  //     if (column.field) {
  //       let cell = row.getDescendant(column.field.key) || row.createChild(column.field);
  //       if (value[column.field.key] !== undefined) {
  //         cell.setValue(value[column.field.key], "set");
  //       } else if (empty) {
  //         cell.setValue(column.field.default || column.field.value || cell.getDefault(), "set");
  //       }
  //     }
  //   });
  //
  //   return row;
  // };

  getDefaultOrder() {
    let defaultOrderby = this.resource.orderby;
    let column = defaultOrderby && this.resource.columns.find(function(column) {
      return column.field && column.field.key === defaultOrderby;
    });
    return column && column.field.key;
  }

  reorder(column) {
    if (this.data.orderby.getValue() === column.field.key) {
      this.data.order.setValue(this.data.order.getValue() === "asc" ? "desc" : "asc", "noop");
    } else {
      this.data.order.setValue(column.order || "asc", "noop");
      this.data.orderby.setValue(column.field.key, "noop");
    }
    this.data.page.setValue(1, "noop");
    return this.query();
  }

  // fetch(currentField) {
  //   let params = field.data.filters.getValue();
  //   params.key = currentField.resource.key;
  //
  //   // don't send self value
  //   if (params[currentField.resource.key]) {
  //     params[currentField.resource.key] = undefined;
  //   }
  //
  //   return this.fetch(field.resource.driver, "querykey", params).then(function(results) {
  //     return results;
  //   });
  // }




  build() {
    const field = this;

    return {
      class: "karma-field-table",
      init: function(container) {

        field.events.render = function(currentField) {

          // const t0 = performance.now();
          // container.triggerEvent("renderBody");
          // const t1 = performance.now();
          // console.log("renderBody", t1-t0);
          // container.triggerEvent("renderFooter");
          //
          // // container.render(true);
          // const t2 = performance.now();
          //
          // console.log("renderFooter", t2-t1);

        };

        // field.events.render2 = function(currentField) {
        //
        //   const t0 = performance.now();
        //   container.render();
        //   const t1 = performance.now();
        //
        //   console.log(t1-t0);
        //
        // };


        field.data.header.events.change = function(currentField) {

          // ! this should only update body and footer

          // const t0 = performance.now();
          // console.log("top");
          //
          // return field.query().then(function() {
          //   const t1 = performance.now();
          //   console.log(t1-t0);
          //   container.render(true);
          //   const t2 = performance.now();
          //   console.log(t2-t1);
          // });
          // console.log("top");
          // const t0 = performance.now();
          // container.render();
          // const t1 = performance.now();
          // console.log(t1-t0);

          const t0 = performance.now();
          container.render();
          const t1 = performance.now();
          console.log("render", t1-t0);

        };


        // -> first load table
        container.element.classList.add("loading");
        field.query().then(function(results) {
          container.element.classList.remove("loading");
          container.render();
        });
      },
      update: function(container) {
        this.children = [
          {
            class: "table-header",
            // init: function(header) {
            //
            // },
            // update: function() {
            //   this.child = field.data.filters.build();
            // }
            child: field.data.filters.build()
          },

          // table body
          {
            class: "table-body",
            // init: function(tableBody) {
            //   field.events.update = function() {
            //     tableBody.element.classList.toggle("loading", field.data.loading ? true : false);
            //   };
            //   field.events.render = function(clean) {
            //     tableBody.render(clean);
            //   }
            // },
            // update: function() {
            //   field.trigger("update");
            // },
            child: {
              class: "table grid",
              // clear: true,
              init: function(table) {

                field.events.renderBody = function() {
                  table.render();
                }

                // -> footer
                // field.data.select.onSelect = function() {
                //   // field.parent.directory.footer.trigger("update");
                // }
              },
              update: function(table) {

                // const t0 = performance.now();
                // console.log("gridstart");

                field.data.select.init();

                this.element.style.gridTemplateColumns = field.resource.columns.map(function(column, colIndex) {
                  return column.width || "1fr";
                }).join(" ");

                // table header cells
                this.children = field.resource.columns.map(function(column, colIndex) {
                  if (column.type === "index") {
                    return {
                      class: "th table-header-index",
                      init: function() {
                        this.element.textContent = column.title || "#";
                        this.element.addEventListener("mousedown", function(event) {
                          field.data.select.onIndexHeaderMouseDown();
                        });
                        this.element.addEventListener("mousemove", function(event) {
                          field.data.select.onIndexHeaderMouseMove();
                        });
                        this.element.addEventListener("mouseup", function(event) {
                          field.data.select.onIndexHeaderMouseUp();
                          event.stopPropagation();
                        });
                      }
                    }
                  } else {
                    return {
                      class: "th",
                      init: function() {
                        if (column.main) {
                          this.element.classList.add("main");
                        }
                        this.element.addEventListener("mousedown", function(event) {
                          field.data.select.onHeaderMouseDown(colIndex);
                        });
                        this.element.addEventListener("mousemove", function(event) {
                          field.data.select.onHeaderMouseMove(colIndex);
                        });
                        this.element.addEventListener("mouseup", function(event) {
                          field.data.select.onHeaderMouseUp(colIndex);
                          event.stopPropagation();
                        });
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
                          this.children.push({
                            tag: "a",
                            class: "header-cell-order",
                            child: {
            									class: "karma-field-spinner"
            								},
                            init: function(a) {
                              this.element.addEventListener("click", function() {
                                // console.log("clock");
                                // const t0 = performance.now();
                                // container.render(true);

                                a.element.classList.add("loading");
                                field.reorder(column).then(function() {
                                  a.element.classList.remove("loading");
                                  // field.trigger("render", true);
                                  // const t1 = performance.now();
                                  // console.log(t1-t0);
                                  field.data.header.triggerEvent("change");

                                });
                              });
                            },
                            update: function() {
                              const orderby = field.data.orderby.getValue();
                              const order = field.data.order.getValue();
                              this.element.classList.toggle("asc", orderby === column.field.key && order === "asc");
                              this.element.classList.toggle("desc", orderby === column.field.key && order === "desc");
                            }
                          });
                        }
                      }
                    };
                  }
                });



                if (field.data.ids.getValue().length) {
                  field.data.ids.getValue().forEach(function(id, rowIndex) {


                    // let rowField = field.get(id) || field.createChild({
                    //   key: id
                    // });
                    let rowField = field.getDescendant(id);
                    //  || field.createRow({
                    //   type: "container",
                    //   key: id
                    // });

                    field.resource.columns.forEach(function(column, colIndex) {
                      if (column.type === "index") {
                        table.children.push({
                          class: "th table-row-index",
                          init: function() {
                            this.element.addEventListener("mousedown", function(event) {
                              if (event.button === 0) {
                                field.data.select.onIndexCellMouseDown(rowIndex);
                              }
                            });
                            this.element.addEventListener("mousemove", function() {
                              field.data.select.onIndexCellMouseMove(rowIndex);
                            });
                            this.element.addEventListener("mouseup", function(event) {
                              field.data.select.onIndexCellMouseUp(rowIndex);
                              event.stopPropagation();
                            });
                          },
                          update: function() {
                            this.element.textContent = ((field.data.page.getValue()-1)*field.data.ppp.getValue())+rowIndex+1;
                          }
                        });
                      } else {

                        let cellField = rowField.getDescendant(column.field.key) || rowField.createChild(column.field);
                        table.children.push({
                          class: "td",
                          init: function(cell) {
                            this.element.addEventListener("mousedown", function(event) {
                              if (event.button === 0) {
                                field.data.select.onCellMouseDown(colIndex, rowIndex);
                              }
                            });
                            this.element.addEventListener("mousemove", function() {
                              field.data.select.onCellMouseMove(colIndex, rowIndex);
                            });
                            this.element.addEventListener("mouseup", function(event) {
                              field.data.select.onCellMouseUp(colIndex, rowIndex);
                              event.stopPropagation();
                            });
                            // if (column.style) {
                            //   this.element.style = column.style;
                            // }
                            // cellField.events.update = function() {
                            //   cell.element.classList.toggle("loading", cellField.data.loading ? true : false);
                            //   cell.element.classList.toggle("modified", cellField.value !== cellField.originalValue);
                            // };
                            // cellField.events.render = function() {
                            //   cell.render();
                            // };
                          },
                          update: function(cell) {
                            // cellField.trigger("update");

                            this.child = cellField.build();
                            field.data.select.addField(colIndex, rowIndex, this.element, cellField);
                          }
                        });
                      }
                    });
                  });
                }

                // const t1 = performance.now();
                // console.log("gridend", t1-t0);

              }
            }
          },

          // table footer
          {
            class: "table-footer",
            init: function(footer) {

              field.events.renderFooter = function() {
                footer.render();
              }

              field.events.change = function(targetField) {

                footer.render();

                // KarmaFieldsAlpha.History.update(targetField, field.resource.driver);
                // KarmaFieldsAlpha.History.save(targetField, field.resource.driver);

                // field.saveHistory(targetField, true)
              };
              field.data.select.onSelect = function() {
                footer.render();
              }

            },
            update: function(footer) {

              this.children = [
                {
                  class: "footer-bar",
                  children: [
                    {
                      class: "footer-group table-info",
                      children: [
                        {
                          tag: "button",
                          class: "button footer-item",
                          children: [
                            {
                              child: new KarmaFieldsAlpha.fields.icon({
                                type: "icon",
                                value: "update.svg"
                              }).build()
                            },
                            // {
                            //   class: "table-spinner button-content",
                            //   // child: KarmaFieldsAlpha.includes.icon({
                            //   //   file: KarmaFieldsAlpha.icons_url+"/update.svg"
                            //   // }),
                            //   render: null,
                            //   init: function() {
                            //     KarmaFieldsAlpha.createField({
                            //       type: "icon",
                            //       file: "update.svg"
                            //     }).data.load().then(function(result) {
                            //       button.innerHTML = result;
                            //     });
                            //   }
                            // },
                            {
                              class: "karma-field-spinner"
                            }
                          ],
                          init: function(item) {
                            this.element.title = "Reload";
                            this.element.addEventListener("click", function(event) {
                              item.element.classList.add("loading");

                              // empty cache
                              KarmaFieldsAlpha.Form.cache = {};

                              // -> still need to reboot fields options

                              field.query().then(function() {
                                item.element.classList.remove("loading");
                                container.render(true);
                              });
                            });
                            this.element.addEventListener("mouseup", function(event) {
                              event.stopPropagation();
                            });
                          }
                        },
                        {
                          tag: "button",
                          class: "button footer-item",
                          init: function(button) {
                            this.element.title = "Save";
                            this.element.addEventListener("click", function(event) {
                              button.element.classList.add("loading");

                              field.sync().then(function() {
                                button.element.classList.remove("loading");
                                button.element.blur();
                                footer.render();
                              });

                            });
                            this.element.addEventListener("mouseup", function(event) {
                              event.stopPropagation();
                            });
                          },
                          children: [
                            {
                              tag: "span",
                              class: "button-content",
                              init: function() {
                                this.element.textContent = "Save";
                              }
                            },
                            {
            									class: "karma-field-spinner"
            								}
                          ],
                          update: function() {
                            const modifiedValues = field.getModifiedValue();
                            this.element.disabled = !modifiedValues;
                          }
                        },
                        {
                          tag: "button",
                          class: "button footer-item",
                          child: new KarmaFieldsAlpha.fields.icon({
                            type: "icon",
                            value: "undo.svg"
                          }).build(),

                          // child: KarmaFieldsAlpha.includes.icon({
                          //   file: KarmaFieldsAlpha.icons_url+"/undo.svg"
                          // }),
                          init: function(item) {
                            this.element.title = "Undo";
                            this.element.addEventListener("click", function(event) {
                              field.domain.undo();
                              container.render();
                            });
                            this.element.addEventListener("mouseup", function(event) {
                              event.stopPropagation();
                            });
                          },
                          update: function() {
                            // this.element.disabled = KarmaFieldsAlpha.History.getIndex(field) === 0;
                            this.element.disabled = field.domain.index === 0;
                          }
                        },
                        {
                          tag: "button",
                          class: "button footer-item",
                          child: new KarmaFieldsAlpha.fields.icon({
                            type: "icon",
                            value: "redo.svg"
                          }).build(),

                          // child: KarmaFieldsAlpha.includes.icon({
                          //   file: KarmaFieldsAlpha.icons_url+"/redo.svg"
                          // }),
                          init: function(button) {
                            this.element.title = "Redo";
                            this.element.addEventListener("click", function(event) {
                              field.domain.redo();
                              container.render();
                            });
                            this.element.addEventListener("mouseup", function(event) {
                              event.stopPropagation();
                            });
                          },
                          update: function(button) {
                            this.element.disabled = field.domain.index >= field.domain.max;
                          }
                        },
                        {
                          tag: "button",
                          class: "button footer-item",
                          // child: KarmaFieldsAlpha.includes.icon({
                          //   file: KarmaFieldsAlpha.icons_url+"/plus-alt2.svg"
                          // }),
                          child: new KarmaFieldsAlpha.fields.icon({
                            type: "icon",
                            value: "plus-alt2.svg"
                          }).build(),
                          init: function(button) {
                            this.element.title = "Add";
                            this.element.addEventListener("click", function(event) {
                              button.element.classList.add("loading");
                              field.add().then(function() {
                                button.element.classList.remove("loading");
                                container.render(true);
                              });
                            });
                            this.element.addEventListener("mouseup", function(event) {
                              event.stopPropagation();
                            });
                          },
                          update: function(element) {
                            this.element.disabled = field.resource.can_add === false || field.resource.can_add && !(new Function("element", "field", field.resource.can_add))(this.element, field);
                          }
                        },
                        {
                          tag: "button",
                          class: "button footer-item",
                          // child: KarmaFieldsAlpha.includes.icon({
                          //   file: KarmaFieldsAlpha.icons_url+"/trash.svg"
                          // }),
                          child: new KarmaFieldsAlpha.fields.icon({
                            type: "icon",
                            value: "trash.svg"
                          }).build(),
                          init: function(item) {
                            this.element.title = "Delete";
                            this.element.addEventListener("click", function(event) {
                              field.remove();
                              container.render(true);
                            });
                            this.element.addEventListener("mouseup", function(event) {
                              event.stopPropagation();
                            });
                          },
                          update: function(element) {
                            this.element.disabled = field.resource.can_delete === false || field.data.select.getSelectedRows().length === 0;
                          }
                        }
                      ]
                    },
                    {
                      class: "footer-group table-pagination",
                      update: function() {
                        this.children = [
                          {
                            tag: "p",
                            class: "footer-item",
                            update: function() {
                              let num = field.data.count.getValue();
                              this.element.textContent = num ? num + " items" : "";
                            }
                          },
                          {
                            tag: "button",
                            class: "button footer-item",
                            init: function(button) {
                              this.element.innerText = "«";
                              this.element.addEventListener("click", function() {
                                const page = field.data.page.getValue();
                                if (page > 0) {
                                  field.data.page.setValue(1, "change");
                                  button.element.classList.add("loading");
                                }
                                // field.trigger("queryTable").then(function() {
                                //   button.element.classList.remove("loading");
                                //   field.trigger("render");
                                // });
                              });
                            },
                            update: function() {
                              const count = field.data.count.getValue();
                              const page = field.data.page.getValue();
                              const ppp = field.data.ppp.getValue();
                              this.element.style.display = count > ppp ? "block" : "none";
                              this.element.disabled = (page == 1);
                            }
                          },
                          {
                            tag: "button",
                            class: "button footer-item",
                            init: function(button) {
                              this.element.innerText = "‹";
                              this.element.addEventListener("click", function() {
                                const page = field.data.page.getValue();
                                if (page > 0) {
                                  field.data.page.setValue(page - 1, "change");
                                  button.element.classList.add("loading");
                                }

                                // field.trigger("queryTable").then(function() {
                                //   button.element.classList.remove("loading");
                                //   field.trigger("render");
                                // });
                              });
                            },
                            update: function() {
                              // let num = field.data.count.getValue();
                              // let page = field.parent.get("header").get("page").value;
                              // let ppp = field.parent.get("header").get("ppp").value;
                              // let count = field.data.header.getDescendant("count");
                              // let page = field.data.header.getDescendant("page");
                              // let ppp = field.data.header.getDescendant("ppp");

                              const count = field.data.count.getValue();
                              const page = field.data.page.getValue();
                              const ppp = field.data.ppp.getValue();

                              this.element.style.display = count > ppp ? "block" : "none";
                              this.element.disabled = (page === 1);
                            }
                          },
                          {
                            class: "current-page footer-item",
                            update: function() {
                              // let num = field.data.count.getValue();
                              // let page = field.parent.get("header").get("page").value;
                              // let ppp = field.parent.get("header").get("ppp").value;

                              const count = field.data.count.getValue();
                              const page = field.data.page.getValue();
                              const ppp = field.data.ppp.getValue();

                              this.element.style.display = count > ppp ? "block" : "none";
                              this.element.textContent = count && page+" / "+Math.ceil(count/ppp) || "";
                            }
                          },
                          {
                            tag: "button",
                            class: "button footer-item",
                            init: function(button) {
                              this.element.innerText = "›";
                              this.element.addEventListener("click", function() {
                                const count = field.data.count.getValue();
                                const page = field.data.page.getValue();
                                const ppp = field.data.ppp.getValue();
                                const numPage = Math.ceil(count/ppp);
                                if (page < numPage) {
                                  field.data.page.setValue(page+1, "change");
                                  button.element.classList.add("loading");
                                }
                                // button.element.classList.add("loading");
                                // field.trigger("queryTable").then(function() {
                                //   button.element.classList.remove("loading");
                                //   field.trigger("render");
                                // });
                              });
                            },
                            update: function() {
                              // let num = field.data.count.getValue();
                              // let page = field.parent.get("header").get("page").value;
                              // let ppp = field.parent.get("header").get("ppp").value;
                              const count = field.data.count.getValue();
                              const page = field.data.page.getValue();
                              const ppp = field.data.ppp.getValue();

                              this.element.style.display = count > ppp ? "block" : "none";
                              this.element.disabled = page >= Math.ceil(count/ppp);
                            }
                          },
                          {
                            tag: "button",
                            class: "button footer-item",
                            init: function(button) {
                              this.element.innerText = "»";
                              this.element.addEventListener("click", function() {
                                // let num = field.data.count.getValue();
                                // let page = field.parent.get("header").get("page");
                                // let ppp = field.parent.get("header").get("ppp").value;

                                const count = field.data.count.getValue();
                                const page = field.data.page.getValue();
                                const ppp = field.data.ppp.getValue();
                                const numPage = Math.ceil(count/ppp);

                                if (page < numPage) {
                                  field.data.page.setValue(numPage, "change");
                                  button.element.classList.add("loading");
                                }

                                // field.trigger("queryTable").then(function() {
                                //   button.element.classList.remove("loading");
                                //   field.trigger("render");
                                // });
                              });
                            },
                            update: function(button) {
                              // let num = field.data.count.getValue();
                              // let page = field.parent.get("header").get("page").value;
                              // let ppp = field.parent.get("header").get("ppp").value;

                              const count = field.data.count.getValue();
                              const page = field.data.page.getValue();
                              const ppp = field.data.ppp.getValue();

                              this.element.style.display = count > ppp ? "block" : "none";
                              this.element.disabled = page >= Math.ceil(count/ppp);

                              // Promise.all([
                              //   field.data.count.getValue(),
                              //   field.data.page.getValue(),
                              //   field.data.ppp.getValue()
                              // ]).then(function([count, page, ppp]) {
                              //   button.element.style.display = count > ppp ? "block" : "none";
                              //   button.element.disabled = page >= Math.ceil(count/ppp);
                              // });
                              //
                              // field.data.header.getValue().then(function(header) {
                              //   button.element.style.display = header.count > header.ppp ? "block" : "none";
                              //   button.element.disabled = header.page >= Math.ceil(header.count/header.ppp);
                              // });



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


KarmaFieldsAlpha.fields.tableRow = class extends KarmaFieldsAlpha.fields.container {

  constructor(resource, domain) {
    super(resource, domain);

    // if (this.parent.resource.column) {
    //   this.parent.resource.columns.forEach(function(column) {
    //     if (column.field) {
    //       row.createChild(column.field);
    //     }
    //   });
    // }

    const trash = this.createChild({
      key: "trash",
      type: "field",
      datatype: "number"
      // value: 0
    });



  }

  // getModifiedValue() {
  //
  //   let value = super.getModifiedValue();
  //   // console.log(value, this);
  //   return value;
  // }

  setValue(value, context) {
    const field = this;
    this.parent.resource.columns.forEach(function(column) {
      if (column.field && column.field.key) {
        // const tk0 = performance.now();
        let child = field.getDescendant(column.field.key) || field.createChild(column.field);
        child.setValue(value[column.field.key], context);
        // const tk1 = performance.now();
        // console.log(column.field.key, tk1-tk0);
      }
    });





  }

  fill() {
    const field = this;
    this.parent.resource.columns.forEach(function(column) {
      if (column.field && column.field.key) {
        let child = field.getDescendant(column.field.key) || field.createChild(column.field);
        child.setValue(child.getDefault(), "set");
      }
    });
  }

  // getColumn(key) {
  //   return this.parent.resource.columns.find(function(column) {
  //     return column.field && column.field.key === key;
  //   }) || {};
  // }

  // getDescendant(key) {
  //   return super.getDescendant(key) || this.createChild(this.parent.resource.columns.find(function(column) {
  //     return column.field.key === key;
  //   }).field);
  // }

}

KarmaFieldsAlpha.fields.tableCol = class TableCol extends KarmaFieldsAlpha.fields.field {

  constructor(resource, domain) {
    super(resource, domain);
    this.datatype = "array";
  }

  add(item, context) {
    let values = this.getValue();
    values.push(item);
    this.setValue(values, context);
  }

  remove(item, context) {
    let values = this.getValue();
    values = values.filter(function(value) {
      return item !== value;
    });
    this.setValue(values, context);
  }

}

KarmaFieldsAlpha.fields.tableCol.datatype = "array";



KarmaFieldsAlpha.fields.pagination = class TableCol extends KarmaFieldsAlpha.fields.container {

  constructor() {

    this.page = new KarmaFieldsAlpha.fields.field({
      key: "page",
      value: 1,
      datatype: "number"
    }, this.domain, this);

    this.ppp = new KarmaFieldsAlpha.fields.field({
      key: "ppp",
      value: resource.ppp || 50,
      datatype: "number"
    }, this.domain, this);

    this.count = new KarmaFieldsAlpha.fields.field({
      key: "count",
      datatype: "number"
    }, this.domain, this);

    this.addChildren(this.page, this.ppp, this.count);

  }

  build() {
    const field = this;

    return {
      class: "footer-group table-pagination",
      update: function() {
        this.children = [
          {
            tag: "p",
            class: "footer-item",
            update: function() {
              let num = field.count.getValue();
              this.element.textContent = num ? num + " items" : "";
            }
          },
          {
            tag: "button",
            class: "button footer-item",
            init: function(button) {
              this.element.innerText = "«";
              this.element.addEventListener("click", function() {
                const page = field.page.getValue();
                if (page > 0) {
                  field.page.setValue(1, "change");
                  button.element.classList.add("loading");
                }
              });
            },
            update: function() {
              const count = field.count.getValue();
              const page = field.page.getValue();
              const ppp = field.ppp.getValue();

              this.element.style.display = count > ppp ? "block" : "none";
              this.element.disabled = (page == 1);
            }
          },
          {
            tag: "button",
            class: "button footer-item",
            init: function(button) {
              this.element.innerText = "‹";
              this.element.addEventListener("click", function() {
                const page = field.page.getValue();
                if (page > 0) {
                  field.page.setValue(page - 1, "change");
                  button.element.classList.add("loading");
                }
              });
            },
            update: function() {
              const count = field.count.getValue();
              const page = field.page.getValue();
              const ppp = field.ppp.getValue();

              this.element.style.display = count > ppp ? "block" : "none";
              this.element.disabled = (page === 1);
            }
          },
          {
            class: "current-page footer-item",
            update: function() {
              const count = field.count.getValue();
              const page = field.page.getValue();
              const ppp = field.ppp.getValue();

              this.element.style.display = count > ppp ? "block" : "none";
              this.element.textContent = count && page+" / "+Math.ceil(count/ppp) || "";
            }
          },
          {
            tag: "button",
            class: "button footer-item",
            init: function(button) {
              this.element.innerText = "›";
              this.element.addEventListener("click", function() {
                const count = field.count.getValue();
                const page = field.page.getValue();
                const ppp = field.ppp.getValue();
                const numPage = Math.ceil(count/ppp);

                if (page < numPage) {
                  field.page.setValue(page+1, "change");
                  button.element.classList.add("loading");
                }
              });
            },
            update: function() {
              const count = field.count.getValue();
              const page = field.page.getValue();
              const ppp = field.ppp.getValue();
              const numPage = Math.ceil(count/ppp);

              this.element.style.display = count > ppp ? "block" : "none";
              this.element.disabled = page >= numPage;
            }
          },
          {
            tag: "button",
            class: "button footer-item",
            init: function(button) {
              this.element.innerText = "»";
              this.element.addEventListener("click", function() {
                const count = field.count.getValue();
                const page = field.page.getValue();
                const ppp = field.ppp.getValue();
                const numPage = Math.ceil(count/ppp);

                if (page < numPage) {
                  field.page.setValue(numPage, "change");
                  button.element.classList.add("loading");
                }
              });
            },
            update: function(button) {
              const count = field.count.getValue();
              const page = field.page.getValue();
              const ppp = field.ppp.getValue();
              const numPage = Math.ceil(count/ppp);

              this.element.style.display = count > ppp ? "block" : "none";
              this.element.disabled = page >= numPage;
            }
          }
        ];
      }
    };
  }
}


// KarmaFieldsAlpha.fields.table = array();
//
// KarmaFieldsAlpha.fields.table.create = function(resource) {
//   let field = KarmaFieldsAlpha.Field(resource);
//
//   field.data.filters = KarmaFieldsAlpha.Field(field.resource.filters);
//
//   field.data.filters.events.change = function(currentField) {
//     currentField.history.save();
//     currentField.trigger("update");
//
//     return field.trigger("queryTable").then(function() {
//       container.render(true);
//     });
//   },
//   field.data.filters.events.fetch = function(currentField) {
//     return field.trigger("fetch", currentField);
//   }
//
//
//
//
// }
//
//
// KarmaFieldsAlpha.fields.table.build = function(field) {
//
//   return {
//     class: "karma-field-table",
//     init: function(container) {
//
//
//
//
//       field.data.orderby = KarmaFieldsAlpha.Field({
//         key: "orderby",
//         type: "hidden",
//         value: field.resource.orderby
//       }, null, {
//         change: function(currentField) {
//           currentField.history.save();
//         }
//       });
//       field.data.order = KarmaFieldsAlpha.Field({
//         key: "order",
//         type: "hidden",
//         value: field.resource.columns.find(function(column) {
//           return !field.resource.orderby || column.field && column.field.key === field.resource.orderby;
//         }).order || "asc"
//       }, null, {
//         change: function(currentField) {
//           currentField.history.save();
//         }
//       });
//       field.data.page = KarmaFieldsAlpha.Field({
//         key: "page",
//         type: "hidden",
//         value: 1,
//         datatype: "number"
//       }, null, {
//         change: function(currentField) {
//           currentField.history.save();
//         }
//       });
//       field.data.ppp = KarmaFieldsAlpha.Field({
//         key: "ppp",
//         type: "hidden",
//         value: field.resource.ppp || 50,
//         datatype: "number"
//       });
//
//       field.data.count = KarmaFieldsAlpha.Field({
//         key: "count",
//         type: "hidden",
//         datatype: "number"
//       }, null, {
//         change: function(currentField) {
//           currentField.history.save();
//         }
//       });
//       field.data.ids = KarmaFieldsAlpha.Field({
//         key: "ids",
//         type: "hidden",
//         datatype: "array"
//       }, null, {
//         change: function(currentField) {
//           currentField.history.save();
//         }
//       });
//
//       field.events.render = function() {
//         container.render();
//       }
//
//       field.events.change = function(currentField) {
//         KarmaFieldsAlpha.History.update(currentField);
//         currentField.history.save();
//
//         field.trigger("renderFooter");
//       };
//
//       field.events.createRow = function(value) {
//         let row = field.getDescendant(value.id) || field.createChild({
//           key: value.id
//         });
//         let trashField = row.getDescendant("trash") || row.createChild({
//           key: "trash"
//         });
//         field.resource.columns.forEach(function(column) {
//           if (column.field) {
//             let cell = row.getDescendant(column.field.key) || row.createChild(column.field);
//             if (value[column.field.key] === undefined) {
//               child.data.loading = true;
//               child.trigger("update");
//               KarmaFieldsAlpha.Form.get(field.resource.driver, value.id+"/"+column.field.key).then(function(value) {
//                 child.data.loading = false;
//                 child.setValue(value, "set");
//               });
//
//             } else {
//               cell.setValue(value[column.field.key], "set");
//             }
//           }
//         });
//       };
//
//       field.events.queryTable = function() {
//
//         let params = Object.assign({
//           orderby: field.data.orderby.getValue(),
//           order: field.data.order.getValue(),
//           page: field.data.page.getValue(),
//           ppp: field.data.ppp.getValue()
//         }, field.data.filters.getValue());
//
//         return KarmaFieldsAlpha.Form.fetch(field.resource.driver, "querytable", params).then(function(results) {
//           field.data.count.setValue(results.count, "set");
//           field.data.ids.setValue(results.items.map(function(item) {
//             return item.id;
//           }), "set");
//           results.items.forEach(function(item) {
//             field.trigger("createRow", item);
//   				});
//           return results;
//         });
//       };
//
//       field.events.sync = function() {
//         let value = field.getModifiedValue();
//         return KarmaFieldsAlpha.Form.update(field.resource.driver, value).then(function(results) {
//           field.setValue(value, "set");
//           // return field.events.queryTable();
//         });
//       };
//
//       field.events.add = function() {
//         return KarmaFieldsAlpha.Form.add(field.resource.driver, field.data.filters.getValue()).then(function(value) {
//           field.trigger("createRow", value);
//           field.data.ids.setValue([value.id].concat(ids.getValue()), "change");
//           return value;
//         });
//       };
//
//       field.events.remove = function() {
//         let rows = field.data.select && field.data.select.getSelectedRows().map(function(cell) {
//           return cell.field;
//         });
//         if (rows) {
//           field.data.ids.setValue(ids.getValue().filter(function(id) {
//             return !rows.some(function(row) {
//               row.resource.key == id;
//             });
//           }), "change");
//           // field.trigger("render", true);
//         }
//       }
//
//       field.events.fetch = function(currentField) {
//
//         let params = field.data.filters.getValue();
//         params.key = currentField.resource.key;
//
//         // don't send self value
//         if (params[currentField.resource.key]) {
//           params[currentField.resource.key] = undefined;
//         }
//
//         return KarmaFieldsAlpha.Form.fetch(field.resource.driver, "querykey", params).then(function(results) {
//           return results;
//         });
//       };
//
//
//       field.events.reorder = function(column) {
//         if (field.data.orderby.getValue() === column.field.key) {
//           field.data.order.setValue(field.data.order.getValue() === "asc" ? "desc" : "asc", "change");
//         } else {
//           field.data.order.setValue(column.order || "asc", "change");
//           field.data.orderby.setValue(column.field.key, "change");
//         }
//         field.data.page.setValue(1, "change");
//         return field.trigger("queryTable");
//       }
//
//
//       if (!field.data.order.getValue() && field.data.orderby.getValue() === column.field.key) {
//         field.data.order.setValue(column.order || "asc", "set");
//       }
//
//
//
//       // let orderbyColumn = field.resource.orderby && field.resource.columns.find(function(column) {
//       //   return column.field && column.field.key === field.resource.orderby;
//       // }) || field.resource.columns.find(function(column) {
//       //   return column.field && column.field.key;
//       // });
//       // if (orderbyColumn) {
//       //   field.data.orderby.set(orderbyColumn.field.key, "set");
//       //   field.data.order.set(orderbyColumn.order || "asc", "set");
//       // }
//
//
//
//       field.data.loading = true;
//       field.trigger("update");
//       field.trigger("queryTable").then(function(results) {
//         field.data.loading = false;
//         container.render();
//       });
//
//     },
//     update: function(container) {
//
//       this.children = [
//
//
//         {
//           class: "table-header",
//           init: function(header) {
//             field.events.renderHeader = function(clean) {
//               header.render(clean);
//             }
//           },
//           update: function() {
//             this.child = field.resource.filters && KarmaFieldsAlpha.fields[field.resource.filters.type || "group"](field.data.filters);
//           }
//         },
//
//
//
//
//         // table body
//         {
//           class: "table-body",
//           init: function(tableBody) {
//             field.events.update = function() {
//               tableBody.element.classList.toggle("loading", field.data.loading ? true : false);
//             };
//             field.events.render = function(clean) {
//               tableBody.render(clean);
//             }
//           },
//           update: function() {
//             field.trigger("update");
//           },
//           child: {
//             class: "table grid",
//             clear: true,
//             init: function(table) {
//               field.data.select = KarmaFieldsAlpha.selectors.grid();
//               field.data.select.onSelect = function() {
//                 // field.parent.directory.footer.trigger("update");
//               }
//               field.events.render = function(clean) {
//                 table.render(clean);
//               }
//             },
//             update: function(table) {
//
//
//               // const header = field.parent.get("header");
//               // const order = header.get("order");
//               // const orderby = header.get("orderby");
//               // const page = header.get("page");
//               // const ppp = header.get("ppp");
//
//               field.data.select.init();
//
//               this.element.style.gridTemplateColumns = field.resource.columns.map(function(column, colIndex) {
//                 return column.width || "1fr";
//               }).join(" ");
//
//               // this.children = [];
//
//               this.children = field.resource.columns.map(function(column, colIndex) {
//                 if (column.type === "index") {
//                   return {
//                     class: "th table-header-index",
//                     init: function() {
//                       this.element.textContent = column.title || "#";
//                       this.element.addEventListener("mousedown", function(event) {
//                         field.data.select.onIndexHeaderMouseDown();
//                       });
//                       this.element.addEventListener("mousemove", function(event) {
//                         field.data.select.onIndexHeaderMouseMove();
//                       });
//                       this.element.addEventListener("mouseup", function(event) {
//                         field.data.select.onIndexHeaderMouseUp();
//                         event.stopPropagation();
//                       });
//                     }
//                   }
//                 } else {
//                   return {
//                     class: "th",
//                     init: function() {
//                       if (column.main) {
//                         this.element.classList.add("main");
//                       }
//                       // if (column.width) {
//                       //   this.element.style.width = column.width;
//                       // }
//                       this.element.addEventListener("mousedown", function(event) {
//                         field.data.select.onHeaderMouseDown(colIndex);
//                       });
//                       this.element.addEventListener("mousemove", function(event) {
//                         field.data.select.onHeaderMouseMove(colIndex);
//                       });
//                       this.element.addEventListener("mouseup", function(event) {
//                         field.data.select.onHeaderMouseUp(colIndex);
//                         event.stopPropagation();
//                       });
//                     },
//                     update: function(th) {
//                       this.children = [
//                         {
//                           tag: "a",
//                           class: "header-cell-title",
//                           init: function() {
//                             this.element.textContent = column.title;
//                           }
//                         }
//                       ];
//                       if (column.sortable) {
//                         this.children.push({
//                           tag: "a",
//                           class: "header-cell-order",
//                           child: {
//           									class: "karma-field-spinner"
//           								},
//                           init: function(a) {
//                             // if (!field.data.order.getValue() && field.data.orderby.getValue() === column.field.key) {
//                             //   field.data.order.setValue(column.order || "asc", "set");
//                             // }
//                             this.element.addEventListener("click", function() {
//                               a.element.classList.add("loading");
//
//                               field.trigger("reorder", column).then(function() { // ! should use field.resource.children[colIndex]
//                                 a.element.classList.remove("loading");
//                                 // field.trigger("render", true);
//                                 container.render();
//                               });
//                             });
//                           },
//                           update: function() {
//                             this.element.classList.toggle("asc", field.data.orderby.getValue() === column.field.key && field.data.order.getValue() === "asc");
//                             this.element.classList.toggle("desc", field.data.orderby.getValue() === column.field.key && field.data.order.getValue() === "desc");
//                           }
//                         });
//                       }
//                     }
//                   };
//                 }
//               });
//
//
//
//               if (field.data.ids.getValue().length) {
//                 field.data.ids.getValue().forEach(function(id, rowIndex) {
//
//
//                   // let rowField = field.get(id) || field.createChild({
//                   //   key: id
//                   // });
//                   let rowField = field.getDescendant(id) || field.trigger("createRow", {
//                     key: id
//                   });
//
//                   field.resource.columns.forEach(function(column, colIndex) {
//                     if (column.type === "index") {
//                       table.children.push({
//                         class: "th table-row-index",
//                         init: function() {
//                           this.element.addEventListener("mousedown", function(event) {
//                             if (event.button === 0) {
//                               field.data.select.onIndexCellMouseDown(rowIndex);
//                             }
//                           });
//                           this.element.addEventListener("mousemove", function() {
//                             field.data.select.onIndexCellMouseMove(rowIndex);
//                           });
//                           this.element.addEventListener("mouseup", function(event) {
//                             field.data.select.onIndexCellMouseUp(rowIndex);
//                             event.stopPropagation();
//                           });
//                         },
//                         update: function() {
//                           this.element.textContent = ((field.data.page.getValue()-1)*field.data.ppp.getValue())+rowIndex+1;
//                         }
//                       });
//                     } else {
//                       let cellField = rowField.getDescendant(column.field.key) || rowField.createChild(column.field);
//                       table.children.push({
//                         class: "td",
//                         init: function(cell) {
//                           this.element.addEventListener("mousedown", function(event) {
//                             if (event.button === 0) {
//                               field.data.select.onCellMouseDown(colIndex, rowIndex);
//                             }
//                           });
//                           this.element.addEventListener("mousemove", function() {
//                             field.data.select.onCellMouseMove(colIndex, rowIndex);
//                           });
//                           this.element.addEventListener("mouseup", function(event) {
//                             field.data.select.onCellMouseUp(colIndex, rowIndex);
//                             event.stopPropagation();
//                           });
//                           if (column.style) {
//                             this.element.style = column.style;
//                           }
//                           cellField.events.update = function() {
//                             cell.element.classList.toggle("loading", cellField.data.loading ? true : false);
//                             cell.element.classList.toggle("modified", cellField.value !== cellField.originalValue);
//                           };
//                           cellField.events.render = function() {
//                             cell.render();
//                           };
//                         },
//                         update: function(cell) {
//                           cellField.trigger("update");
//                           this.child = KarmaFieldsAlpha.fields[column.field.type || "group"](cellField);
//                           field.data.select.addField(colIndex, rowIndex, this.element, cellField);
//                         }
//                       });
//                     }
//                   });
//                 });
//               }
//             }
//           }
//         },
//
//         // table footer
//         {
//           class: "table-footer",
//           init: function(footer) {
//             field.events.renderFooter = function() {
//               footer.render();
//             };
//           },
//           update: function(footer) {
//
//             this.children = [
//               {
//                 class: "footer-bar",
//                 children: [
//                   {
//                     class: "footer-group table-info",
//                     children: [
//                       {
//                         tag: "button",
//                         class: "button footer-item",
//                         children: [
//                           {
//                             class: "table-spinner button-content",
//                             child: KarmaFieldsAlpha.includes.icon({
//                               file: KarmaFieldsAlpha.icons_url+"/update.svg"
//                             })
//                           },
//                           {
//                             class: "karma-field-spinner"
//                           }
//                         ],
//                         init: function(item) {
//                           this.element.title = "Reload";
//                           this.element.addEventListener("click", function(event) {
//                             item.element.classList.add("loading");
//
//                             // empty cache
//                             KarmaFieldsAlpha.Form.cache = {};
//
//                             field.trigger("queryTable").then(function() {
//                               item.element.classList.remove("loading");
//                               field.trigger("render");
//                               item.element.blur();
//                             });
//                           });
//                           this.element.addEventListener("mouseup", function(event) {
//                             event.stopPropagation();
//                           });
//                         }
//                       },
//                       {
//                         tag: "button",
//                         class: "button footer-item",
//                         init: function(button) {
//                           this.element.title = "Save";
//                           this.element.addEventListener("click", function(event) {
//                             button.element.classList.add("loading");
//
//                             field.trigger("sync").then(function() {
//                               button.element.classList.remove("loading");
//                               button.element.blur();
//                               container.render();
//                             });
//
//                           });
//                           this.element.addEventListener("mouseup", function(event) {
//                             event.stopPropagation();
//                           });
//                         },
//                         children: [
//                           {
//                             tag: "span",
//                             class: "button-content",
//                             init: function() {
//                               this.element.textContent = "Save";
//                             }
//                           },
//                           {
//           									class: "karma-field-spinner"
//           								}
//                         ],
//                         update: function() {
//                           this.element.disabled = !field.getModifiedValue();
//                         }
//                       },
//                       {
//                         tag: "button",
//                         class: "button footer-item",
//                         child: KarmaFieldsAlpha.includes.icon({
//                           file: KarmaFieldsAlpha.icons_url+"/undo.svg"
//                         }),
//                         init: function(item) {
//                           this.element.title = "Undo";
//                           this.element.addEventListener("click", function(event) {
//                             KarmaFieldsAlpha.History.undo(field);
//                             container.render();
//                           });
//                           this.element.addEventListener("mouseup", function(event) {
//                             event.stopPropagation();
//                           });
//                         },
//                         update: function() {
//                           this.element.disabled = KarmaFieldsAlpha.History.getIndex(field) === 0;
//                         }
//                       },
//                       {
//                         tag: "button",
//                         class: "button footer-item",
//                         child: KarmaFieldsAlpha.includes.icon({
//                           file: KarmaFieldsAlpha.icons_url+"/redo.svg"
//                         }),
//                         init: function(button) {
//                           this.element.title = "Redo";
//                           this.element.addEventListener("click", function(event) {
//                             KarmaFieldsAlpha.History.redo(field);
//                             container.render();
//                           });
//                           this.element.addEventListener("mouseup", function(event) {
//                             event.stopPropagation();
//                           });
//                         },
//                         update: function(button) {
//                           let instance = KarmaFieldsAlpha.History.getInstance(field);
//                           this.element.disabled = instance.index >= instance.max;
//                         }
//                       },
//                       {
//                         tag: "button",
//                         class: "button footer-item",
//                         child: KarmaFieldsAlpha.includes.icon({
//                           file: KarmaFieldsAlpha.icons_url+"/plus-alt2.svg"
//                         }),
//                         init: function(button) {
//                           this.element.title = "Add";
//                           this.element.addEventListener("click", function(event) {
//                             button.element.classList.add("loading");
//                             field.trigger("add").then(function() {
//                               button.element.classList.remove("loading");
//                               field.trigger("render", true);
//                             });
//                           });
//                           this.element.addEventListener("mouseup", function(event) {
//                             event.stopPropagation();
//                           });
//                         },
//                         update: function(element) {
//                           this.element.disabled = field.resource.can_add === false || field.resource.can_add && !(new Function("element", "field", field.resource.can_add))(this.element, field);
//                         }
//                       },
//                       {
//                         tag: "button",
//                         class: "button footer-item",
//                         child: KarmaFieldsAlpha.includes.icon({
//                           file: KarmaFieldsAlpha.icons_url+"/trash.svg"
//                         }),
//                         init: function(item) {
//                           this.element.title = "Delete";
//                           this.element.addEventListener("click", function(event) {
//                             field.trigger("remove");
//                           });
//                           this.element.addEventListener("mouseup", function(event) {
//                             event.stopPropagation();
//                           });
//                         },
//                         update: function(element) {
//                           this.element.disabled = field.resource.can_delete === false || field.data.select.getSelectedRows().length === 0;
//                         }
//                       }
//                     ]
//                   },
//                   {
//                     class: "footer-group table-pagination",
//                     update: function() {
//                       this.children = [
//                         {
//                           tag: "p",
//                           class: "footer-item",
//                           update: function() {
//                             let num = field.data.count.getValue();
//                             this.element.textContent = num ? num + " items" : "";
//                           }
//                         },
//                         {
//                           tag: "button",
//                           class: "button footer-item",
//                           init: function(button) {
//                             this.element.innerText = "«";
//                             this.element.addEventListener("click", function() {
//                               field.data.page.setValue(1, "change");
//                               button.element.classList.add("loading");
//                               field.trigger("queryTable").then(function() {
//                                 button.element.classList.remove("loading");
//                                 field.trigger("render");
//                               });
//                             });
//                           },
//                           update: function() {
//                             // let num = field.data.count.getValue();
//                             // let page = field.data.page.getValue();
//                             // let ppp = field.data.ppp.getValue();
//                             this.element.style.display = field.data.count.getValue() > field.data.ppp.getValue() ? "block" : "none";
//                             this.element.disabled = (field.data.page.getValue() == 1);
//                           }
//                         },
//                         {
//                           tag: "button",
//                           class: "button footer-item",
//                           init: function(button) {
//                             this.element.innerText = "‹";
//                             this.element.addEventListener("click", function() {
//                               field.data.page.setValue(Math.max(field.data.page.getValue()-1, 1), "change");
//                               button.element.classList.add("loading");
//                               field.trigger("queryTable").then(function() {
//                                 button.element.classList.remove("loading");
//                                 field.trigger("render");
//                               });
//                             });
//                           },
//                           update: function() {
//                             // let num = field.data.count.getValue();
//                             // let page = field.parent.get("header").get("page").value;
//                             // let ppp = field.parent.get("header").get("ppp").value;
//                             this.element.style.display = field.data.count.getValue() > field.data.ppp.getValue() ? "block" : "none";
//                             this.element.disabled = (field.data.page.getValue() === 1);
//                           }
//                         },
//                         {
//                           class: "current-page footer-item",
//                           update: function() {
//                             // let num = field.data.count.getValue();
//                             // let page = field.parent.get("header").get("page").value;
//                             // let ppp = field.parent.get("header").get("ppp").value;
//                             this.element.style.display = field.data.count.getValue() > field.data.ppp.getValue() ? "block" : "none";
//                             this.element.textContent = field.data.count.getValue() && field.data.page.getValue()+" / "+Math.ceil(field.data.count.getValue()/field.data.ppp.getValue()) || "";
//                           }
//                         },
//                         {
//                           tag: "button",
//                           class: "button footer-item",
//                           init: function(button) {
//                             this.element.innerText = "›";
//                             this.element.addEventListener("click", function() {
//                               field.data.page.setValue(field.data.page.getValue()+1, "change"); // -> should check max!
//                               button.element.classList.add("loading");
//                               field.trigger("queryTable").then(function() {
//                                 button.element.classList.remove("loading");
//                                 field.trigger("render");
//                               });
//                             });
//                           },
//                           update: function() {
//                             // let num = field.data.count.getValue();
//                             // let page = field.parent.get("header").get("page").value;
//                             // let ppp = field.parent.get("header").get("ppp").value;
//                             this.element.style.display = field.data.count.getValue() > field.data.ppp.getValue() ? "block" : "none";
//                             this.element.disabled = field.data.page.getValue() >= Math.ceil(field.data.count.getValue()/field.data.ppp.getValue());
//                           }
//                         },
//                         {
//                           tag: "button",
//                           class: "button footer-item",
//                           init: function(button) {
//                             this.element.innerText = "»";
//                             this.element.addEventListener("click", function() {
//                               // let num = field.data.count.getValue();
//                               // let page = field.parent.get("header").get("page");
//                               // let ppp = field.parent.get("header").get("ppp").value;
//                               field.data.page.setValue(Math.ceil(field.data.count.getValue()/field.data.ppp.getValue()), "change");
//                               button.element.classList.add("loading");
//                               field.trigger("queryTable").then(function() {
//                                 button.element.classList.remove("loading");
//                                 field.trigger("render");
//                               });
//                             });
//                           },
//                           update: function() {
//                             // let num = field.data.count.getValue();
//                             // let page = field.parent.get("header").get("page").value;
//                             // let ppp = field.parent.get("header").get("ppp").value;
//                             this.element.style.display = field.data.count.getValue() > field.data.ppp.getValue() ? "block" : "none";
//                             this.element.disabled = field.data.page.getValue() >= Math.ceil(field.data.count.getValue()/field.data.ppp.getValue());
//                           }
//                         }
//                       ];
//                     }
//                   }
//                 ]
//               }
//             ];
//           }
//         }
//       ];
//     }
//
//
//   };
// }
