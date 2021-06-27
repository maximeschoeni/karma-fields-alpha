
KarmaFieldsAlpha.fields.table = function(field) {

  return {
    class: "karma-field-table",
    init: function(container) {

      field.data.filters = KarmaFieldsAlpha.Field(field.resource.filters);

      field.data.filters.events.change = function(currentField) {
        currentField.data.loading = true;
        currentField.history.save();
        currentField.trigger("update");

        return field.trigger("queryTable").then(function() {
          currentField.data.loading = false;
          container.render(true);
        });
      },
      field.data.filters.events.fetch = function(currentField) {
        return field.trigger("fetch", currentField);
      }


      field.data.orderby = KarmaFieldsAlpha.Field({
        key: "orderby",
        type: "hidden",
        value: field.resource.orderby
      }, null, {
        change: function(currentField) {
          currentField.history.save();
        }
      });
      field.data.order = KarmaFieldsAlpha.Field({
        key: "order",
        type: "hidden",
        value: field.resource.columns.find(function(column) {
          return !field.resource.orderby || column.field && column.field.key === field.resource.orderby;
        }).order || "asc"
      }, null, {
        change: function(currentField) {
          currentField.history.save();
        }
      });
      field.data.page = KarmaFieldsAlpha.Field({
        key: "page",
        type: "hidden",
        value: 1,
        datatype: "number"
      }, null, {
        change: function(currentField) {
          currentField.history.save();
        }
      });
      field.data.ppp = KarmaFieldsAlpha.Field({
        key: "ppp",
        type: "hidden",
        value: field.resource.ppp || 50,
        datatype: "number"
      });

      field.data.count = KarmaFieldsAlpha.Field({
        key: "count",
        type: "hidden",
        datatype: "number"
      }, null, {
        change: function(currentField) {
          currentField.history.save();
        }
      });
      field.data.ids = KarmaFieldsAlpha.Field({
        key: "ids",
        type: "hidden",
        datatype: "array"
      }, null, {
        change: function(currentField) {
          currentField.history.save();
        }
      });

      field.events.render = function() {
        container.render();
      }

      field.events.change = function(currentField) {
        KarmaFieldsAlpha.History.update(currentField);
        currentField.history.save();

        field.trigger("renderFooter");
      };

      field.events.createRow = function(value) {
        let row = field.getDescendant(value.id) || field.createChild({
          key: value.id
        });
        let trashField = row.getDescendant("trash") || row.createChild({
          key: "trash"
        });
        field.resource.columns.forEach(function(column) {
          if (column.field) {
            let cell = row.getDescendant(column.field.key) || row.createChild(column.field);
            if (value[column.field.key] === undefined) {
              child.data.loading = true;
              child.trigger("update");
              KarmaFieldsAlpha.Form.get(field.resource.driver, value.id+"/"+column.field.key).then(function(value) {
                child.data.loading = false;
                child.setValue(value, "set");
              });

            } else {
              cell.setValue(value[column.field.key], "set");
            }
          }
        });
      };

      field.events.queryTable = function() {

        let params = Object.assign({
          orderby: field.data.orderby.getValue(),
          order: field.data.order.getValue(),
          page: field.data.page.getValue(),
          ppp: field.data.ppp.getValue()
        }, field.data.filters.getValue());

        return KarmaFieldsAlpha.Form.fetch(field.resource.driver, "querytable", params).then(function(results) {
          field.data.count.setValue(results.count, "set");
          field.data.ids.setValue(results.items.map(function(item) {
            return item.id;
          }), "set");
          results.items.forEach(function(item) {
            field.trigger("createRow", item);
  				});
          return results;
        });
      };

      field.events.sync = function() {
        let value = field.getModifiedValue();
        return KarmaFieldsAlpha.Form.update(field.resource.driver, value).then(function(results) {
          field.setValue(value, "set");
          // return field.events.queryTable();
        });
      };

      field.events.add = function() {
        return KarmaFieldsAlpha.Form.add(field.resource.driver, field.data.filters.getValue()).then(function(value) {
          field.trigger("createRow", value);
          field.data.ids.setValue([value.id].concat(ids.getValue()), "change");
          return value;
        });
      };

      field.events.remove = function() {
        let rows = field.data.select && field.data.select.getSelectedRows().map(function(cell) {
          return cell.field;
        });
        if (rows) {
          field.data.ids.setValue(ids.getValue().filter(function(id) {
            return !rows.some(function(row) {
              row.resource.key == id;
            });
          }), "change");
          // field.trigger("render", true);
        }
      }

      field.events.fetch = function(currentField) {

        let params = field.data.filters.getValue();
        params.key = currentField.resource.key;

        // don't send self value
        if (params[currentField.resource.key]) {
          params[currentField.resource.key] = undefined;
        }

        return KarmaFieldsAlpha.Form.fetch(field.resource.driver, "querykey", params).then(function(results) {
          return results;
        });
      };


      field.events.reorder = function(column) {
        if (field.data.orderby.getValue() === column.field.key) {
          field.data.order.setValue(field.data.order.getValue() === "asc" ? "desc" : "asc", "change");
        } else {
          field.data.order.setValue(column.order || "asc", "change");
          field.data.orderby.setValue(column.field.key, "change");
        }
        field.data.page.setValue(1, "change");
        return field.trigger("queryTable");
      }


      if (!field.data.order.getValue() && field.data.orderby.getValue() === column.field.key) {
        field.data.order.setValue(column.order || "asc", "set");
      }



      // let orderbyColumn = field.resource.orderby && field.resource.columns.find(function(column) {
      //   return column.field && column.field.key === field.resource.orderby;
      // }) || field.resource.columns.find(function(column) {
      //   return column.field && column.field.key;
      // });
      // if (orderbyColumn) {
      //   field.data.orderby.set(orderbyColumn.field.key, "set");
      //   field.data.order.set(orderbyColumn.order || "asc", "set");
      // }



      field.data.loading = true;
      field.trigger("update");
      field.trigger("queryTable").then(function(results) {
        field.data.loading = false;
        container.render();
      });

    },
    update: function(container) {

      this.children = [


        {
          class: "table-header",
          init: function(header) {
            field.events.renderHeader = function(clean) {
              header.render(clean);
            }
          },
          update: function() {
            this.child = field.resource.filters && KarmaFieldsAlpha.fields[field.resource.filters.type || "group"](field.data.filters);
          }
        },




        // table body
        {
          class: "table-body",
          init: function(tableBody) {
            field.events.update = function() {
              tableBody.element.classList.toggle("loading", field.data.loading ? true : false);
            };
            field.events.render = function(clean) {
              tableBody.render(clean);
            }
          },
          update: function() {
            field.trigger("update");
          },
          child: {
            class: "table grid",
            clear: true,
            init: function(table) {
              field.data.select = KarmaFieldsAlpha.selectors.grid();
              field.data.select.onSelect = function() {
                // field.parent.directory.footer.trigger("update");
              }
              field.events.render = function(clean) {
                table.render(clean);
              }
            },
            update: function(table) {


              // const header = field.parent.get("header");
              // const order = header.get("order");
              // const orderby = header.get("orderby");
              // const page = header.get("page");
              // const ppp = header.get("ppp");

              field.data.select.init();

              this.element.style.gridTemplateColumns = field.resource.columns.map(function(column, colIndex) {
                return column.width || "1fr";
              }).join(" ");

              // this.children = [];

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
                      // if (column.width) {
                      //   this.element.style.width = column.width;
                      // }
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
                            // if (!field.data.order.getValue() && field.data.orderby.getValue() === column.field.key) {
                            //   field.data.order.setValue(column.order || "asc", "set");
                            // }
                            this.element.addEventListener("click", function() {
                              a.element.classList.add("loading");

                              field.trigger("reorder", column).then(function() { // ! should use field.resource.children[colIndex]
                                a.element.classList.remove("loading");
                                // field.trigger("render", true);
                                container.render();
                              });
                            });
                          },
                          update: function() {
                            this.element.classList.toggle("asc", field.data.orderby.getValue() === column.field.key && field.data.order.getValue() === "asc");
                            this.element.classList.toggle("desc", field.data.orderby.getValue() === column.field.key && field.data.order.getValue() === "desc");
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
                  let rowField = field.getDescendant(id) || field.trigger("createRow", {
                    key: id
                  });

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
                          if (column.style) {
                            this.element.style = column.style;
                          }
                          cellField.events.update = function() {
                            cell.element.classList.toggle("loading", cellField.data.loading ? true : false);
                            cell.element.classList.toggle("modified", cellField.value !== cellField.originalValue);
                          };
                          cellField.events.render = function() {
                            cell.render();
                          };
                        },
                        update: function(cell) {
                          cellField.trigger("update");
                          this.child = KarmaFieldsAlpha.fields[column.field.type || "group"](cellField);
                          field.data.select.addField(colIndex, rowIndex, this.element, cellField);
                        }
                      });
                    }
                  });
                });
              }
            }
          }
        },

        // table footer
        {
          class: "table-footer",
          init: function(footer) {
            field.events.renderFooter = function() {
              footer.render();
            };
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
                            class: "table-spinner button-content",
                            child: KarmaFieldsAlpha.includes.icon({
                              file: KarmaFieldsAlpha.icons_url+"/update.svg"
                            })
                          },
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

                            field.trigger("queryTable").then(function() {
                              item.element.classList.remove("loading");
                              field.trigger("render");
                              item.element.blur();
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

                            field.trigger("sync").then(function() {
                              button.element.classList.remove("loading");
                              button.element.blur();
                              container.render();
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
                          this.element.disabled = !field.getModifiedValue();
                        }
                      },
                      {
                        tag: "button",
                        class: "button footer-item",
                        child: KarmaFieldsAlpha.includes.icon({
                          file: KarmaFieldsAlpha.icons_url+"/undo.svg"
                        }),
                        init: function(item) {
                          this.element.title = "Undo";
                          this.element.addEventListener("click", function(event) {
                            KarmaFieldsAlpha.History.undo(field);
                            container.render();
                          });
                          this.element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function() {
                          this.element.disabled = KarmaFieldsAlpha.History.getIndex(field) === 0;
                        }
                      },
                      {
                        tag: "button",
                        class: "button footer-item",
                        child: KarmaFieldsAlpha.includes.icon({
                          file: KarmaFieldsAlpha.icons_url+"/redo.svg"
                        }),
                        init: function(button) {
                          this.element.title = "Redo";
                          this.element.addEventListener("click", function(event) {
                            KarmaFieldsAlpha.History.redo(field);
                            container.render();
                          });
                          this.element.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function(button) {
                          let instance = KarmaFieldsAlpha.History.getInstance(field);
                          this.element.disabled = instance.index >= instance.max;
                        }
                      },
                      {
                        tag: "button",
                        class: "button footer-item",
                        child: KarmaFieldsAlpha.includes.icon({
                          file: KarmaFieldsAlpha.icons_url+"/plus-alt2.svg"
                        }),
                        init: function(button) {
                          this.element.title = "Add";
                          this.element.addEventListener("click", function(event) {
                            button.element.classList.add("loading");
                            field.trigger("add").then(function() {
                              button.element.classList.remove("loading");
                              field.trigger("render", true);
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
                        child: KarmaFieldsAlpha.includes.icon({
                          file: KarmaFieldsAlpha.icons_url+"/trash.svg"
                        }),
                        init: function(item) {
                          this.element.title = "Delete";
                          this.element.addEventListener("click", function(event) {
                            field.trigger("remove");
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
                              field.data.page.setValue(1, "change");
                              button.element.classList.add("loading");
                              field.trigger("queryTable").then(function() {
                                button.element.classList.remove("loading");
                                field.trigger("render");
                              });
                            });
                          },
                          update: function() {
                            // let num = field.data.count.getValue();
                            // let page = field.data.page.getValue();
                            // let ppp = field.data.ppp.getValue();
                            this.element.style.display = field.data.count.getValue() > field.data.ppp.getValue() ? "block" : "none";
                            this.element.disabled = (field.data.page.getValue() == 1);
                          }
                        },
                        {
                          tag: "button",
                          class: "button footer-item",
                          init: function(button) {
                            this.element.innerText = "‹";
                            this.element.addEventListener("click", function() {
                              field.data.page.setValue(Math.max(field.data.page.getValue()-1, 1), "change");
                              button.element.classList.add("loading");
                              field.trigger("queryTable").then(function() {
                                button.element.classList.remove("loading");
                                field.trigger("render");
                              });
                            });
                          },
                          update: function() {
                            // let num = field.data.count.getValue();
                            // let page = field.parent.get("header").get("page").value;
                            // let ppp = field.parent.get("header").get("ppp").value;
                            this.element.style.display = field.data.count.getValue() > field.data.ppp.getValue() ? "block" : "none";
                            this.element.disabled = (field.data.page.getValue() === 1);
                          }
                        },
                        {
                          class: "current-page footer-item",
                          update: function() {
                            // let num = field.data.count.getValue();
                            // let page = field.parent.get("header").get("page").value;
                            // let ppp = field.parent.get("header").get("ppp").value;
                            this.element.style.display = field.data.count.getValue() > field.data.ppp.getValue() ? "block" : "none";
                            this.element.textContent = field.data.count.getValue() && field.data.page.getValue()+" / "+Math.ceil(field.data.count.getValue()/field.data.ppp.getValue()) || "";
                          }
                        },
                        {
                          tag: "button",
                          class: "button footer-item",
                          init: function(button) {
                            this.element.innerText = "›";
                            this.element.addEventListener("click", function() {
                              field.data.page.setValue(field.data.page.getValue()+1, "change"); // -> should check max!
                              button.element.classList.add("loading");
                              field.trigger("queryTable").then(function() {
                                button.element.classList.remove("loading");
                                field.trigger("render");
                              });
                            });
                          },
                          update: function() {
                            // let num = field.data.count.getValue();
                            // let page = field.parent.get("header").get("page").value;
                            // let ppp = field.parent.get("header").get("ppp").value;
                            this.element.style.display = field.data.count.getValue() > field.data.ppp.getValue() ? "block" : "none";
                            this.element.disabled = field.data.page.getValue() >= Math.ceil(field.data.count.getValue()/field.data.ppp.getValue());
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
                              field.data.page.setValue(Math.ceil(field.data.count.getValue()/field.data.ppp.getValue()), "change");
                              button.element.classList.add("loading");
                              field.trigger("queryTable").then(function() {
                                button.element.classList.remove("loading");
                                field.trigger("render");
                              });
                            });
                          },
                          update: function() {
                            // let num = field.data.count.getValue();
                            // let page = field.parent.get("header").get("page").value;
                            // let ppp = field.parent.get("header").get("ppp").value;
                            this.element.style.display = field.data.count.getValue() > field.data.ppp.getValue() ? "block" : "none";
                            this.element.disabled = field.data.page.getValue() >= Math.ceil(field.data.count.getValue()/field.data.ppp.getValue());
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
