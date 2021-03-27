
KarmaFieldsAlpha.fields.table = function(field) {
  var tableManager = KarmaFieldsAlpha.managers.table(field, field.history, field.resource);
  var selectManager = KarmaFieldsAlpha.selectors.grid();

  let uris;

  // tableManager.request();



  return {
    className: "karma-field-table",
    complete: function() {

    },
    init: function(container) {
      field.events.render = function() {

        KarmaFieldsAlpha.events.onSelectAll = function(event) {
          if (document.activeElement === document.body) {
            selectManager.onSelectAll(event);
            event.preventDefault();
          }
        };
        KarmaFieldsAlpha.events.onAdd = function(event) {
          if (document.activeElement === document.body) {
            tableManager.addItem();
            event.preventDefault();
          }
        };
        KarmaFieldsAlpha.events.onDelete = function(event) {
          var items = selectManager.getSelectedItems();
          if (items.length) {
            tableManager.removeItems(items);
            event.preventDefault();
          }
        };
        KarmaFieldsAlpha.events.onCopy = function(event) {
          selectManager.onCopy(event);
        }
        KarmaFieldsAlpha.events.onPast = function(event) {
          selectManager.onPast(event);
          container.render();
        }
        KarmaFieldsAlpha.events.onSave = function(event) {
          tableManager.sync();
          event.preventDefault();
        }
        KarmaFieldsAlpha.events.onUndo = function(event) {
          field.history.undo();
          container.render();
          event.preventDefault();
        }
        KarmaFieldsAlpha.events.onRedo = function(event) {
          field.history.redo();
          container.render();
          event.preventDefault();
        }
        KarmaFieldsAlpha.events.onUnload = function() {
          // manager.save();
          // manager.stopRefresh();
        }


        // setTimeout(function() {
        //
        // }, 4000);

        container.render();
      };
      this.addEventListener("mouseup", function() {
        // handle outside mouseup



        selectManager.onClick();
      });

      container.classList.add("loading");
      tableManager.request().then(function() {
        container.classList.remove("loading");
        container.render();
      });

      this.kids = [
        {
          className: "table-header",
          init: function(filter) {
            var filterResource = field.getAttribute("filter");
            if (filterResource) {
              var filterField = field.createChild(filterResource);
              filterField.buffer = "filters";
              filterField.outputBuffer = false;
              filterField.events.submit = function() {
                tableManager.setPage(1);
                container.classList.add("loading");
                return tableManager.request().then(function() {
                  container.classList.remove("loading");
                  container.render();
                });
              }
              filterField.events.render = this.render;
              this.kids = filterField.createChild(filterResource).build();
            }
          }
        },
        {
          className: "table-body",
          kids: [{
            tag: "table",
            className: "grid",
            init: function() {

              if (field.resource.width) {
                this.style.width = field.resource.width;
              }
              if (field.resource.style) {
                this.style = field.resource.style;
              }
            },
            update: function() {
              selectManager.init(); // = KarmaFieldsAlpha.selectors.grid(manager);
            },
            kids: [
              {
                tag: "thead",
                kids: [{
                  tag: "tr",
                  update: function() {
                    this.kids = field.resource.children.filter(function(column) {
                      return true;
                    }).map(function(column, colIndex) {
                      return {
                        tag: "th",
                        init: function() {
                          if (column.main) {
                            this.classList.add("main");
                          }
                          if (column.style) {
                            this.style = column.style;
                          }
                          if (column.width) {
                            this.style.width = column.width;
                          }
                          this.addEventListener("mousedown", function(event) {
                            selectManager.onHeaderMouseDown(colIndex);
                          });
                          this.addEventListener("mousemove", function(event) {
                            selectManager.onHeaderMouseMove(colIndex);
                          });
                          this.addEventListener("mouseup", function(event) {
                            selectManager.onHeaderMouseUp(colIndex);
                            event.stopPropagation();
                          });
                        },
                        kids: [{
                          className: "header-cell",
                          update: function() {
                            this.kids = [
                              {
                                tag: "a",
                                className: "header-cell-title",
                                init: function() {
                                  this.textContent = column.title;
                                }
                              }
                            ];
                            if (column.sortable) {
                              this.kids.push({
                                tag: "a",
                                className: "header-cell-order",
                                kids: [{
                                  className: "order-icon change-order",
                                }],
                                init: function() {
                                  this.addEventListener("click", function() {
                                    container.classList.add("loading");
                                    tableManager.reorder(column).then(function() {
                                      container.classList.remove("loading");
                                      container.render();
                                    });
                                  });
                                },
                                update: function() {
                                  var orderby = field.history.request(["order", "orderby"]);
                                  var order = field.history.request(["order", "order"]);
                                  this.classList.toggle("asc", orderby === column.key && order === "asc");
                                  this.classList.toggle("desc", orderby === column.key && order === "desc");
                                }
                              });
                            }
                          }
                        }]
                      };
                    });
                    if (field.resource.index) {
                      this.kids.unshift({
                        tag: "th",
                        className: "table-header-index",
                        init: function() {
                          if (field.resource.index.title) {
                            this.textContent = field.resource.index.title;
                          }
                          if (field.resource.index.width) {
                            this.style.width = field.resource.index.width;
                          }
                          this.addEventListener("mousedown", function(event) {
                            selectManager.onIndexHeaderMouseDown();
                          });
                          this.addEventListener("mousemove", function(event) {
                            selectManager.onIndexHeaderMouseMove();
                          });
                          this.addEventListener("mouseup", function(event) {
                            selectManager.onIndexHeaderMouseUp();
                            event.stopPropagation();
                          });
                        }
                      });
                    }
                  }
                }]
              },
              {
                tag: "tbody",

                update: function(tbody) {
                  uris = tableManager.getItems();



                  // var tableField = field.history.createFieldManager({
                  //   buffer: "input",
                  //   outputBuffer: "output"
                  // });
                  // tableField.events.updateFooter = function() {
                  //   manager.renderFooter();
                  // }
                  // tableField.events.render = this.render;
                  this.kids = uris && uris.map(function(uri, rowIndex) {
                    return {
                      tag: "tr",
                      // clear: true,
                      update: function(row) {
                        this.kids = field.resource.children.map(function(column, colIndex) {
                          return {
                            tag: "td",
                            init: function(cell) {
                              this.addEventListener("mousedown", function(event) {
                                selectManager.onCellMouseDown(colIndex, rowIndex);
                              });
                              this.addEventListener("mousemove", function() {
                                selectManager.onCellMouseMove(colIndex, rowIndex);
                              });
                              this.addEventListener("mouseup", function(event) {
                                selectManager.onCellMouseUp(colIndex, rowIndex);
                                event.stopPropagation();
                              });
                              var cellField = field.createChild(column);
                              cellField.element = this;
                              // cellField.uri = uri;
                              cellField.events.update = function() {
                                field.trigger("updateFooter");
                                //container.render();
                              };
                              cellField.events.modify = function() {
                                cell.classList.toggle("modified", cellField.isModified());
                              }
                              cellField.events.render = function() {
                                cell.render();
                              }
                              cell.field = cellField;
                              // KarmaFieldsAlpha.wm.table.set(cell, cellField);

                              // this.kids = [cellField.buildSingle()]; // should only do this if there is actual change
                              this.kid = KarmaFieldsAlpha.fields[column.name || column.field || "group"](cellField);
                              // console.log(this.kid);
                              if (column.container_style) {
                                this.style = column.container_style;
                              }
                            },
                            update: function(cell) {
                              // var cellField = KarmaFieldsAlpha.wm.table.get(cell);



                              cell.field.uri = uris[rowIndex];
                              cell.field.resource = field.resource.children[colIndex];

                              selectManager.addField(colIndex, rowIndex, this, cell.field);

                              cell.classList.toggle("modified", cell.field.isModified());


                            }
                          };
                        });

                        if (field.resource.index) {
                          this.kids.unshift({
                            tag: "th",
                            init: function() {
                              this.addEventListener("mousedown", function(event) {
                                selectManager.onIndexCellMouseDown(rowIndex);
                              });
                              this.addEventListener("mousemove", function() {
                                selectManager.onIndexCellMouseMove(rowIndex);
                              });
                              this.addEventListener("mouseup", function(event) {
                                selectManager.onIndexCellMouseUp(rowIndex);
                                event.stopPropagation();
                              });
                            },
                            update: function() {
                              selectManager.addRowIndex(this, rowIndex);
                            },
                            kids: [{
                              className: "row-index",
                              update: function() {
                                var page = tableManager.getPage();
                                var ppp = tableManager.getPpp();
                                this.textContent = ((page-1)*ppp)+rowIndex+1;
                              }
                            }]
                          });
                        }
                      }
                    };
                  });
                }
              }
            ]
          }]
        },
        {
          className: "table-footer",
          init: function(footer) {
            field.events.updateFooter = function() {
              footer.render();
            };

            selectManager.onSelect = function() {
              footer.render();
            }
          },
          update: function(footer) {
            this.kids = [
              {
                className: "table-options-container",
                update: function(element) {
                  var displayOptions = tableManager.history.read("static", ["displayOptions"]);
                  this.kid = displayOptions && {
                    className: "table-options-body",
                    init: function() {
                      if (field.resource.options) {
                        var optionField = field.createChild(field.resource.options);
                        optionField.buffer = "options";
                        optionField.outputBuffer = false;
                        optionField.driver = false;
                        optionField.events.submit = function() {
                          field.history.setValue(["static", "displayOptions"], false);
                          container.classList.add("loading");
                          tableManager.request().then(function() {
                            container.classList.remove("loading");
                            container.render();
                          });
                        };
                        this.kids = optionField.build();
                      }
                    }
                  };
                }
              },
              {
                className: "footer-bar",
                kids: [
                  {
                    className: "footer-group table-info",
                    kids: [
                      {
                        tag: "button",
                        className: "button footer-item",
                        kids: [{
                          className: "table-spinner",
                          update: function(icon) {
                            var loading = field.history.read("static", ["loading"]);
                            this.classList.toggle("loading", loading);
                          },
                          kid: KarmaFieldsAlpha.includes.icon({
                            file: KarmaFieldsAlpha.icons_url+"/update.svg"
                          })
                        }],
                        init: function(item) {
                          this.title = "Reload";

                          field.events["load"] = function() {
                            field.history.setValue(["static", "loading"], true);
                            item.render();
                          }

                          this.addEventListener("click", function(event) {
                            container.classList.add("loading");
                            tableManager.request().then(function() {
                              container.classList.remove("loading");
                              container.render();
                              item.blur();
                            });
                          });
                          this.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function() {
                          // var loading = field.history.read("table", ["loading"]);
                        }
                      },
                      {
                        tag: "button",
                        className: "button footer-item primary",
                        init: function() {
                          this.title = "Save";
                          this.innerText = "Save";
                          this.addEventListener("click", function(event) {
                            container.classList.add("loading");
                            tableManager.sync().then(function() {
                              container.classList.remove("loading");
                              container.render();
                            });
                          });
                          this.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function() {
                          // this.disabled = !field.history.diff(["output"], ["input"]);

                          // var output = field.history.getValue(["output"]) || {};
                          //
                          //
                          //
                          // console.log(field.history.store.output, output);

                          // console.trace();


                    			// if (KarmaFieldsAlpha.Object.isEmpty(output)) {
                    			// 	console.log(output);
                    			// 	console.warn("Output is empty");
                    			// 	return;
                    			// }

                          this.disabled = field.history.contain(["input"], ["output"]);
                        }
                      },
                      {
                        tag: "button",
                        className: "button footer-item",
                        kid: KarmaFieldsAlpha.includes.icon({
                          file: KarmaFieldsAlpha.icons_url+"/admin-generic.svg"
                        }),
                        init: function(item) {
                          this.title = "Options";
                          this.addEventListener("click", function(event) {
                            var displayOptions = field.history.read("static", ["displayOptions"]);

                            field.history.write("static", ["displayOptions"], !displayOptions);
                            footer.render();
                            if (displayOptions) {
                              item.blur();
                            }
                          });
                          this.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function() {
                          var displayOptions = field.history.read("static", ["displayOptions"]);
                          this.classList.toggle("active", displayOptions || false);
                        }
                      },
                      {
                        tag: "button",
                        className: "button footer-item",
                        kid: KarmaFieldsAlpha.includes.icon({
                          file: KarmaFieldsAlpha.icons_url+"/undo.svg"
                        }),
                        init: function(item) {
                          this.title = "Undo";
                          // this.
                          this.addEventListener("click", function(event) {
                            field.history.undo();
                            container.render();
                          });
                          this.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function() {
                          this.disabled = !field.history.hasUndo();
                        }
                      },
                      {
                        tag: "button",
                        className: "button footer-item",
                        kid: KarmaFieldsAlpha.includes.icon({
                          file: KarmaFieldsAlpha.icons_url+"/redo.svg"
                        }),
                        init: function(item) {
                          this.title = "Redo";
                          this.addEventListener("click", function(event) {
                            field.history.redo();
                            container.render();
                          });
                          this.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function(element) {
                          this.disabled = !field.history.hasRedo();
                        }
                      },
                      {
                        tag: "button",
                        className: "button footer-item",
                        kid: KarmaFieldsAlpha.includes.icon({
                          file: KarmaFieldsAlpha.icons_url+"/plus-alt2.svg"
                        }),
                        init: function(item) {
                          this.title = "Add";
                          // this.child = KarmaFieldsAlpha.includes.icon(KarmaFieldsAlpha.icons_url+"/plus-alt2.svg");
                          this.addEventListener("click", function(event) {
                            container.classList.add("loading");
                            tableManager.addItem().then(function() {
                              container.classList.remove("loading");
                              container.render();
                            });
                          });
                          this.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        }
                      },
                      {
                        tag: "button",
                        className: "button footer-item",
                        kid: KarmaFieldsAlpha.includes.icon({
                          file: KarmaFieldsAlpha.icons_url+"/trash.svg"
                        }),
                        init: function(item) {
                          this.title = "Delete";
                          this.addEventListener("click", function(event) {

                            var uris = selectManager.getSelectedRows().map(function(cell) {
                              return cell.field.uri;
                            });
                            if (uris) {
                              tableManager.removeItems(uris);

                              container.render();
                            }
                          });
                          this.addEventListener("mouseup", function(event) {
                            event.stopPropagation();
                          });
                        },
                        update: function(element) {
                          var selectedRows = selectManager.getSelectedRows();
                          this.disabled = selectedRows.length === 0;
                        }
                      }
                    ]
                  },
                  {
                    className: "footer-group table-pagination",
                    update: function() {
                      this.kids = [
                        {
                          tag: "p",
                          className: "footer-item",
                          update: function() {
                            var num = tableManager.getCount();
                            this.textContent = num ? num+" items" : "";
                          }
                        },
                        {
                          tag: "button",
                          className: "button footer-item",
                          init: function() {
                            this.innerText = "«";
                            this.addEventListener("click", function() {
                              tableManager.setPage(1);
                              container.classList.add("loading");
                              tableManager.request().then(function() {
                                container.classList.remove("loading");
                                container.render();
                              });
                            });
                          },
                          update: function() {
                            var num = tableManager.getCount();
                            var ppp = tableManager.getPpp();
                            var page = tableManager.getPage();
                            this.style.display = num > ppp ? "block" : "none";
                            this.disabled = (page === 1);
                          }
                        },
                        {
                          tag: "button",
                          className: "button footer-item",
                          init: function() {
                            var page = tableManager.getPage();
                            this.innerText = "‹";
                            if (page === 1) {
                              this.disabled = true;
                            }
                            this.addEventListener("click", function() {
                              tableManager.setPage(tableManager.getPage()-1);
                              container.classList.add("loading");
                              tableManager.request().then(function() {
                                container.classList.remove("loading");
                                container.render();
                              });
                            });
                          },
                          update: function() {
                            var num = tableManager.getCount();
                            var ppp = tableManager.getPpp();
                            var page = tableManager.getPage();
                            this.style.display = num > ppp ? "block" : "none";
                            this.disabled = (page === 1);
                          }
                        },
                        {
                          className: "current-page footer-item",
                          update: function() {
                            var num = tableManager.getCount();
                            var ppp = tableManager.getPpp();
                            var page = tableManager.getPage();
                            this.style.display = num > ppp ? "block" : "none";
                            this.textContent = num && page+" / "+Math.ceil(num/ppp) || "";
                          }
                        },
                        {
                          tag: "button",
                          className: "button footer-item",
                          init: function() {
                            this.innerText = "›";
                            this.addEventListener("click", function() {
                              tableManager.setPage(tableManager.getPage()+1);
                              container.classList.add("loading");
                              tableManager.request().then(function() {
                                container.classList.remove("loading");
                                container.render();
                              });
                            });
                          },
                          update: function() {
                            var num = tableManager.getCount();
                            var ppp = tableManager.getPpp();
                            var page = tableManager.getPage();
                            this.style.display = num > ppp ? "block" : "none";
                            this.disabled = page >= Math.ceil(num/ppp);
                          }
                        },
                        {
                          tag: "button",
                          className: "button footer-item",
                          init: function(element) {
                            this.innerText = "»";
                            this.addEventListener("click", function() {
                              var num = tableManager.getCount();
                              var ppp = tableManager.getPpp();
                              tableManager.setPage(Math.ceil(num/ppp));
                              container.classList.add("loading");
                              tableManager.request().then(function() {
                                container.classList.remove("loading");
                                container.render();
                              });
                            });
                          },
                          update: function() {
                            var num = tableManager.getCount();
                            var ppp = tableManager.getPpp();
                            var page = tableManager.getPage();
                            this.style.display = num > ppp ? "block" : "none";
                            this.disabled = page >= Math.ceil(num/ppp);
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
