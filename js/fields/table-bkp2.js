//test
KarmaFieldsAlpha.fields.table = function(field) {

  return {
    class: "karma-field-table",
    init: function(container) {

      field.events.render = function() {
        container.render();
      }


      let header = field.createChild({
        key: "header",
        children: [
          {
            key: "filters",
            children: field.resource.filter && [field.resource.filter]
          },
          {
            key: "orderby",
            type: "hidden",
            value: field.resource.orderby
          },
          {
            key: "order",
            type: "hidden"
          },
          {
            key: "page",
            type: "hidden",
            value: 1
          },
          {
            key: "ppp",
            type: "hidden",
            value: field.resource.ppp || 50
          },
          {
            key: "option",
            type: "hidden",
            children: field.resource.option && [field.resource.option]
          }
        ],
      }, {
        change: function(currentField) {
          currentField.data.loading = true;
          currentField.history.save();
          currentField.trigger("update");
          field.trigger("queryTable").then(function() {
            currentField.data.loading = false;
            container.render();
          });
        }
      });


      let body = field.createChild({
        key: "body",
        children: field.resource.columns.map(function(column) {

        })
      }, {
        change: function(currentField) {
          KarmaFieldsAlpha.History.update(currentField);
          currentField.history.save();
          footer.trigger("render");
        }
      });

      let footer = field.createChild({
        key: "footer",
        children: [
          {
            key: "count",
            type: "hidden"
          },
          {
            key: "ids",
            type: "hidden"
          }
        ]
      }, {
        change: function(currentField) {
          currentField.history.save();
        }
      });

      // footer.events.change = function(currentField) {
      //   currentField.history.save();
      // }

      // body.events.change = function(currentField) {
      //   KarmaFieldsAlpha.History.update(currentField);
      //   currentField.history.save();
      //   footer.trigger("render");
      // }

      // header.events.change = function(currentField) {
      //   currentField.data.loading = true;
      //   currentField.history.save();
      //   currentField.trigger("update");
      //   field.trigger("queryTable").then(function() {
      //     currentField.data.loading = false;
      //     container.render();
      //   });
      // }

      field.data.createRow = function(value) {
        let row = body.get(value.id) || body.createChild({
          key: value.id
        });
        let trashField = row.get("trash") || row.createChild({
          key: "trash"
        });
        if (field.resource.children) {
          field.resource.children.forEach(function(resource) {
            let child = row.get(resource.key) || row.createChild(resource);

            if (item[resource.key] === undefined) {
              child.trigger("queryValue", child);
            } else {
              child.setValue(item[resource.key], "set");
            }
          });
        }
        field.resource.columns.forEach(function(column) {
          if (column.field) {
            let cell = row.get(column.field.key) || row.createChild(column.field);
            if (value[column.field.key] === undefined) {
              cell.queryValue();
            } else {
              cell.setValue(value[column.field.key], "set");
            }
          }
        });
      }



      field.events.queryTable = function() {

        return KarmaFieldsAlpha.Transfer.fetch(field.resource.driver, "querytable", header.getValue()).then(function(results) {
          footer.get("count").setValue(results.count, "set");
          footer.get("ids").setValue(results.items.map(function(item) {
            return item.id;
          }).join(","), "set");


          results.items.forEach(function(item) {
            field.data.createRow(item);
  				});
          return results;
        });
      };

      field.events.sync = function() {
        let value = body.getModifiedValue();
        return KarmaFieldsAlpha.Transfer.update(field.resource.driver || field.resource.key, {data: value}).then(function(results) {
          body.setValue(value, "set");
          // return field.events.queryTable();
        });
      };

      field.events.add = function() {
        // let uid = "_draft_"+Date.now();
        // let row = field.data.createRow({
        //   key: uid;
        // });
        // let idsField = footer.get("ids");
        // let ids = idsField.value.split(",");
        //
        // idsField.value = [uid].concat(ids).join(",");

        return KarmaFieldsAlpha.Transfer.add(field.resource.driver || field.resource.key, {
          data: header.get("filters").getValue(),
        }).then(function(value) {
          field.data.createRow(value);
          const ids = footer.get("ids");
          ids.setValue([value.id].concat(ids.value.split(",")).join(","), "set");

          // row.key = value.id;
          // row.setValue(value);
          // idsField.setValue(idsField.value.replace(uid, value.id), "set");

          return value;
        });
      };

      field.events.remove = function() {
        let fields = body.data.select && body.data.select.getSelectedRows().map(function(cell) {
          return cell.field;
        });
        if (fields) {
          const ids = footer.get("ids");
          ids.setValue(ids.value.split(",").filter(function(id) {
            return !fields.some(function(field) {
              field.resource.key == id;
            });
          }).join(","), "change");
          field.trigger("render", true);
        }
      }

      // field.events.queryFiles = function(param) {
      //   let params = {param, ...header.getValue()};
      //   return KarmaFieldsAlpha.Transfer.fetch(field.resource.key || field.resource.driver, "queryfiles", params).then(function(results) {
      //     return results;
      //   });
      // };
      //
      // field.events.queryKey = function(param) {
      //   let params = {param, ...header.getValue()};
      //   return KarmaFieldsAlpha.Transfer.fetch(field.resource.key || field.resource.driver, "querykey", params).then(function(results) {
      //     return results;
      //   });
      // };

      field.events.fetch = function(handle, params) {
        return KarmaFieldsAlpha.Transfer.fetch(field.resource.key || field.resource.driver, handle, {filters: header.get("filters").getValue(), ...params}).then(function(results) {
          return results;
        });
      };

      field.events.get = function(currentField) {
        let path = currentField.getPath(body);
  			currentField.data.loading = true;
  			currentField.trigger("update");

  			return KarmaFieldsAlpha.Transfer.get(field.resource.driver || field.resource.key, path, this.resource.cache).then(function(value) {
  				currentField.data.loading = false;
  				currentField.setValue(value, "set");
  				return value;
  			});
      };


      // field.trigger("queryTable").then(function() {
      //   field.parent.trigger("render");
      // });

      body.data.loading = true;
      body.trigger("update");


      field.trigger("queryTable").then(function(results) {
        body.data.loading = false;
        container.render();
      });


    },
    update: function(container) {

      this.children = [
        KarmaFieldsAlpha.fields.tableHeader(field.get("header")),
        KarmaFieldsAlpha.fields.tableBody(field.get("body")),
        KarmaFieldsAlpha.fields.tableFooter(field.get("footer"))
      ];
    }
  };
}







KarmaFieldsAlpha.fields.tableHeader = function(field) {
  return {
    class: "table-header",
    clear: true,
    init: function(header) {

      field.events.render = function(clean) {
        header.render(clean);
      }
    },
    update: function() {
      this.child = KarmaFieldsAlpha.fields["group"](field);

    }
  }
}






KarmaFieldsAlpha.fields.tableBody = function(field) {
  return {
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
        const header = field.parent.get("header");
        const order = header.get("order");
        const orderby = header.get("orderby");
        const page = header.get("page");
        const ppp = header.get("ppp");

        field.data.select.init();

        this.element.style.gridTemplateColumns = field.parent.resource.columns.map(function(column, colIndex) {
          return column.width || "1fr";
        }).join(" ");

        // this.children = [];

        this.children = field.parent.resource.columns.map(function(column, colIndex) {
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
                    // child: {
                    //   class: "order-icon change-order",
                    // },
                    init: function(a) {

                      if (!order.value && orderby.value === column.field.key) {
                        // order.value = column.order || "asc";
                        order.setValue(column.order || "asc", "set");
                      }

                      this.element.addEventListener("click", function() {
                        a.element.classList.add("loading");

                  			if (orderby.value === column.field.key) {
                          order.setValue(order.value === "asc" ? "desc" : "asc", "set");
                  			} else {
                          order.setValue(column.order || "asc", "set");
                          orderby.setValue(column.field.key, "set");
                  			}

                        page.setValue(1, "set");

                  			field.parent.trigger("queryTable").then(function() { // ! should use field.resource.children[colIndex]
                          a.element.classList.remove("loading");
                          field.parent.trigger("render");
                        });
                      });
                    },
                    update: function() {
                      // let order = field.parent.directory.header.directory.order;
                      // let orderby = field.parent.directory.header.directory.orderby;
                      // let order = field.parent.get("header/order");
                      // let orderby = field.parent.get("header/orderby");
                      this.element.classList.toggle("asc", orderby.value === column.field.key && order.value === "asc");
                      this.element.classList.toggle("desc", orderby.value === column.field.key && order.value === "desc");
                    }
                  });
                }
              }
            };
          }
        });


        if (field.parent.get("footer").get("ids").value) {
          field.parent.get("footer").get("ids").value.split(",").forEach(function(id, rowIndex) {
            let rowField = field.get(id) || field.createChild({
              key: id
            });
            // let trashField = rowField.get("trash") || rowField.createChild({
            //   key: "trash"
            // });

            field.parent.resource.columns.forEach(function(column, colIndex) {
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
                    this.element.textContent = ((page.value-1)*ppp.value)+rowIndex+1;
                  }
                });
              } else {
                let cellField = rowField.get(column.field.key) || rowField.createChild(column.field);
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
  }
}






KarmaFieldsAlpha.fields.tableFooter = function(field) {
  return {
    class: "table-footer",
    update: function(footer) {
      field.events.render = function() {
        footer.render();
      };
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
                      update: function(icon) {
                        // var loading = field.history.read("static", ["loading"]);
                        // this.element.classList.toggle("loading", loading);
                      },
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
                      KarmaFieldsAlpha.Transfer.cache = {};

                      field.parent.trigger("queryTable").then(function() {
                        item.element.classList.remove("loading");
                        field.parent.trigger("render");
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

                      field.parent.trigger("sync").then(function() {
                        button.element.classList.remove("loading");
                        button.element.blur();
                        field.trigger("render");
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
                    this.element.disabled = !field.parent.get("body").getModifiedValue();
                  }
                },
                // {
                //   tag: "button",
                //   class: "button footer-item",
                //   child: KarmaFieldsAlpha.includes.icon({
                //     file: KarmaFieldsAlpha.icons_url+"/admin-generic.svg"
                //   }),
                //   init: function(button) {
                //     this.element.title = "Options";
                //     this.element.addEventListener("click", function(event) {
                //       var displayOptions = field.history.read("static", ["displayOptions"]);
                //       field.history.write("static", ["displayOptions"], !displayOptions);
                //       footer.render();
                //       if (displayOptions) {
                //         button.element.blur();
                //       }
                //     });
                //     this.element.addEventListener("mouseup", function(event) {
                //       event.stopPropagation();
                //     });
                //   },
                //   update: function() {
                //     var displayOptions = field.history.read("static", ["displayOptions"]);
                //     this.element.classList.toggle("active", displayOptions || false);
                //   }
                // },
                {
                  tag: "button",
                  class: "button footer-item",
                  child: KarmaFieldsAlpha.includes.icon({
                    file: KarmaFieldsAlpha.icons_url+"/undo.svg"
                  }),
                  init: function(item) {
                    this.element.title = "Undo";
                    this.element.addEventListener("click", function(event) {
                      KarmaFieldsAlpha.History.undo(field.parent);
                      field.parent.trigger("render");
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
                      KarmaFieldsAlpha.History.redo(field.parent);
                      field.parent.trigger("render");
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
                      field.parent.trigger("add").then(function() {
                        button.element.classList.remove("loading");
                        field.parent.trigger("render");
                      });
                    });
                    this.element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function(element) {

                    // let can_add = !field.resource.can_add ||
                    // if (field.resource.script_init) {
              			// 	(new Function("element", "field", field.resource.script_init))(this.element, field);
              			// }
                    //
                    // this.element.disabled = field.parent.resource.disable_add;

                    // console.log((new Function("element", "field", field.parent.resource.can_add))(this.element, field.parent));

                    this.element.disabled = field.parent.resource.can_add === false
                      || field.parent.resource.can_add
                        && !(new Function("element", "field", field.parent.resource.can_add))(this.element, field.parent);
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
                      // let fields = field.parent.get("body").data.select.getSelectedRows().map(function(cell) {
                      //   return cell.field;
                      // });
                      // if (fields) {
                      //   let idsField = field.get("ids");
                      //   idsField.setValue(idsField.value.split(",").filter(function(id) {
                      //     return !fields.some(function(field) {
                      //       field.resource.key == id;
                      //     });
                      //   }).join(","), "change");
                      //   field.parent.trigger("render", true);
                      // }
                    });
                    this.element.addEventListener("mouseup", function(event) {
                      event.stopPropagation();
                    });
                  },
                  update: function(element) {
                    this.element.disabled = field.parent.resource.disable_delete || field.parent.get("body").data.select.getSelectedRows().length === 0;
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
                      let num = field.get("count").value;
                      this.element.textContent = num ? num + " items" : "";
                    }
                  },
                  {
                    tag: "button",
                    class: "button footer-item",
                    init: function(button) {
                      this.element.innerText = "«";
                      this.element.addEventListener("click", function() {
                        let page = field.parent.get("header").get("page");
                        page.setValue(1, "change");
                        button.element.classList.add("loading");
                        field.parent.trigger("queryTable").then(function() {
                          button.element.classList.remove("loading");
                          field.parent.trigger("render");
                        });
                      });
                    },
                    update: function() {
                      let num = field.get("count").value;
                      let page = field.parent.get("header").get("page").value;
                      let ppp = field.parent.get("header").get("ppp").value;
                      this.element.style.display = num > ppp ? "block" : "none";
                      this.element.disabled = (page == 1);
                    }
                  },
                  {
                    tag: "button",
                    class: "button footer-item",
                    init: function(button) {
                      this.element.innerText = "‹";
                      this.element.addEventListener("click", function() {
                        let page = field.parent.get("header").get("page");
                        page.setValue(Math.max(page.value-1, 1), "change");
                        button.element.classList.add("loading");
                        field.parent.data.query().then(function() {
                          button.element.classList.remove("loading");
                          field.parent.trigger("render");
                        });
                      });
                    },
                    update: function() {
                      let num = field.get("count").value;
                      let page = field.parent.get("header").get("page").value;
                      let ppp = field.parent.get("header").get("ppp").value;
                      this.element.style.display = num > ppp ? "block" : "none";
                      this.element.disabled = (page === 1);
                    }
                  },
                  {
                    class: "current-page footer-item",
                    update: function() {
                      let num = field.get("count").value;
                      let page = field.parent.get("header").get("page").value;
                      let ppp = field.parent.get("header").get("ppp").value;
                      this.element.style.display = num > ppp ? "block" : "none";
                      this.element.textContent = num && page+" / "+Math.ceil(num/ppp) || "";
                    }
                  },
                  {
                    tag: "button",
                    class: "button footer-item",
                    init: function(button) {
                      this.element.innerText = "›";
                      this.element.addEventListener("click", function() {
                        let page = field.parent.get("header").get("page").value;
                        page.setValue(page.value+1, "change"); // -> should check max!
                        button.element.classList.add("loading");
                        field.parent.data.query().then(function() {
                          button.element.classList.remove("loading");
                          field.parent.trigger("render");
                        });
                      });
                    },
                    update: function() {
                      let num = field.get("count").value;
                      let page = field.parent.get("header").get("page").value;
                      let ppp = field.parent.get("header").get("ppp").value;
                      this.element.style.display = num > ppp ? "block" : "none";
                      this.element.disabled = page >= Math.ceil(num/ppp);
                    }
                  },
                  {
                    tag: "button",
                    class: "button footer-item",
                    init: function(button) {
                      this.element.innerText = "»";
                      this.element.addEventListener("click", function() {
                        let num = field.get("count").value;
                        let page = field.parent.get("header").get("page");
                        let ppp = field.parent.get("header").get("ppp").value;
                        page.setValue(Math.ceil(num/ppp), "change");
                        button.element.classList.add("loading");
                        field.parent.data.query().then(function() {
                          button.element.classList.remove("loading");
                          field.parent.trigger("render");
                        });
                      });
                    },
                    update: function() {
                      let num = field.get("count").value;
                      let page = field.parent.get("header").get("page").value;
                      let ppp = field.parent.get("header").get("ppp").value;
                      this.element.style.display = num > ppp ? "block" : "none";
                      this.element.disabled = page >= Math.ceil(num/ppp);
                    }
                  }
                ];
              }
            }
          ]
        }
      ];
    }
  };
}
