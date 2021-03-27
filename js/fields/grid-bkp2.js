KarmaFieldsAlpha.fields.grid = function(field) {
  return {
    class: "karma-field-grid",
    init: function(grid) {
      var select = KarmaFieldsAlpha.selectors.grid();
      var gridManager = {
        getValue: function() {
          var value = field.getValue();
          if (!value || !value.length) {
            value = [[""]];
          }
          return value;
        },
        addRow: async function(index) {
          var value = this.getValue();
          var row = value[0] && value[0].map(function() {
            return "";
          }) || [""];
          value.splice(index, 0, row);
          field.setValue(value);
          grid.render();
        },
        addCol: function(index) {
          var value = this.getValue();
          value.forEach(function(row) {
            row.splice(index, 0, "");
          });
          field.setValue(value);
          grid.render();
        },
        deleteRows: function(rows) {
          var value = this.getValue().filter(function(row, index) {
            return rows.indexOf(index) === -1;
          });
          if (!value.length) {
            value = [[""]];
          }
          field.setValue(value);
          select.select();
          grid.render();
        },
        deleteCols: function(cols) {
          var value = this.getValue().map(function(row) {
            row = row.filter(function(cell, index) {
              return cols.indexOf(index) === -1;
            });
            if (!row.length) {
              row = [""];
            }
            return row;
          });
          field.setValue(value);
          select.select();
          grid.render();
        }
      };
      field.onFocus = function() {
        KarmaFieldsAlpha.events.onCopy = function(event) {
          select.onCopy(event);
        }
        KarmaFieldsAlpha.events.onPast = function(event) {
          select.onPast(event);
        }
        KarmaFieldsAlpha.events.onDelete = function(event) {
          if (document.activeElement === document.body) {
            var rows = select.getSelectedRows();
            var cols = select.getSelectedCols();
            if (rows.length) {
              gridManager.deleteRows(rows);
              event.preventDefault();
            } else if (cols.length) {
              gridManager.deleteCols(cols);
              event.preventDefault();
            }
          }
        };
        KarmaFieldsAlpha.events.onSelectAll = function(event) {
          select.onSelectAll(event);
        };
        KarmaFieldsAlpha.events.onClick = function(event) {
          select.onClick();
        };
        KarmaFieldsAlpha.events.onArrowUp = function(event) {
          var rect = select.getSelectionRect();
          if (rect.top > 0) {
            rect.top--;
            rect.width = 1;
            rect.height = 1;
            select.select(rect);
          }
        };
        KarmaFieldsAlpha.events.onArrowDown = function(event) {
          var rect = select.getSelectionRect();
          if (rect.top + rect.height < select.rect.height) {
            rect.top = rect.top + rect.height;
            rect.width = 1;
            rect.height = 1;
            select.select(rect);
          }
        };
        KarmaFieldsAlpha.events.onArrowLeft = function(event) {
          var rect = select.getSelectionRect();
          if (rect.left > 0) {
            rect.left--;
            rect.width = 1;
            rect.height = 1;
            select.select(rect);
          }
        };
        KarmaFieldsAlpha.events.onArrowRight = function(event) {
          var rect = select.getSelectionRect();
          if (rect.left + rect.width < select.rect.width) {
            rect.left = rect.left + rect.width;
            rect.width = 1;
            rect.height = 1;
            select.select(rect);
          }
        };
      }

      field.onFocus();

      this.children = [
        {
          class: "field-controls",
          child: {
            class: "field-controls-group",
            children: [
              {
                tag: "button",
                child: KarmaFieldsAlpha.includes.icon(KarmaFieldsAlpha.icons_url+"/table-row-before.svg"),
                init: function() {
                  this.element.addEventListener("click", function(event) {
                    event.preventDefault();
                    var rect = select.getSelectionRect();
                    if (rect.height) {
                      select.selectionRect.top++;
                      gridManager.addRow(rect.top);
                    } else {
                      gridManager.addRow(0);
                    }
                    grid.render();
                  });
                  this.element.addEventListener("mouseup", function(event) {
                    event.stopPropagation();
                  });
                }
              },
              {
                tag: "button",
                child: KarmaFieldsAlpha.includes.icon(KarmaFieldsAlpha.icons_url+"/table-row-after.svg"),
                init: function() {
                  this.element.addEventListener("click", function(event) {
                    event.preventDefault();
                    var rect = select.getSelectionRect();
                    if (rect.height) {
                      gridManager.addRow(rect.top+rect.height);
                    } else {
                      gridManager.addRow(select.rect.height);
                    }
                  });
                  this.element.addEventListener("mouseup", function(event) {
                    event.stopPropagation();
                  });
                }
              },
              {
                tag: "button",
                child: KarmaFieldsAlpha.includes.icon(KarmaFieldsAlpha.icons_url+"/table-col-before.svg"),
                init: function() {
                  this.element.addEventListener("click", function(event) {
                    event.preventDefault();
                    var rect = select.getSelectionRect();
                    if (rect.width) {
                      select.selectionRect.left++;
                      gridManager.addCol(rect.left);
                    } else {
                      gridManager.addCol(0);
                    }
                  });
                  this.element.addEventListener("mouseup", function(event) {
                    event.stopPropagation();
                  });
                }
              },
              {
                tag: "button",
                child: KarmaFieldsAlpha.includes.icon(KarmaFieldsAlpha.icons_url+"/table-col-after.svg"),
                init: function() {
                  this.element.addEventListener("click", function(event) {
                    event.preventDefault();
                    var rect = select.getSelectionRect();
                    if (rect.width) {
                      gridManager.addCol(rect.left+rect.width);
                    } else {
                      gridManager.addCol(select.rect.width);
                    }
                  });
                  this.element.addEventListener("mouseup", function(event) {
                    event.stopPropagation();
                  });
                }
              },
              {
                tag: "button",
                child: KarmaFieldsAlpha.includes.icon(KarmaFieldsAlpha.icons_url+"/table-row-delete.svg"),
                init: function() {
                  this.element.addEventListener("click", function(event) {
                    event.preventDefault();
                    var rect = select.getSelectionRect();
                    if (rect.height) {
                      var rows = [];
                      for (var i = 0; i < rect.height; i++) {
                        rows.push(rect.top + i);
                      }
                      gridManager.deleteRows(rows);
                    }
                  });
                  this.element.addEventListener("mouseup", function(event) {
                    event.stopPropagation();
                  });
                }
              },
              {
                tag: "button",
                child: KarmaFieldsAlpha.includes.icon(KarmaFieldsAlpha.icons_url+"/table-col-delete.svg"),
                init: function() {
                  this.element.addEventListener("click", function(event) {
                    event.preventDefault();
                    var rect = select.getSelectionRect();
                    if (rect.width) {
                      var cols = [];
                      for (var i = 0; i < rect.width; i++) {
                        cols.push(rect.left + i);
                      }
                      gridManager.deleteCols(cols);
                    }
                  });
                  this.element.addEventListener("mouseup", function(event) {
                    event.stopPropagation();
                  });
                }
              }
            ]
          }
        },
        {
          tag: "table",
          class: "grid",
          child: {
            tag: "tbody",
            init: function() {
              field.fetchValue().then(function(value) {
                if (!value && field.resource.default) {
                  field.setValue(field.resource.default);
								}
                grid.render();
              });
            },
            update: function() {
              select.init();
              var value = gridManager.getValue();
              this.children = value.map(function(cols, y) {
                return {
                  tag: "tr",
                  update: function() {
                    this.children = cols.map(function(cell, x) {
                      return {
                        tag: "td",
                        init: function() {
                          this.element.addEventListener("mousedown", function(event) {
                            select.onCellMouseDown(x, y);
                          });
                          this.element.addEventListener("mousemove", function() {
                            select.onCellMouseMove(x, y);
                          });
                          this.element.addEventListener("mouseup", function(event) {
                            select.onCellMouseUp(x, y);
                            event.stopPropagation();
                          });
                        },
                        update: function(cell) {
                          var cellField = field.createChild({
                            field: "textinput",
                            // driver: "postmetaobject",
                            child_keys: [y, x],
                          });
                          cellField.events.render = function() {
                            cell.render();
                          };
                          this.child = cellField.buildSingle();
                          select.addField(x, y, this.element, cellField);
                        }
                      }
                    });
                  }
                }
              });
            }
          }
        }
      ];
    },
  };

  //       return KarmaFieldsAlpha.build({
  //     		class: "karma-field-grid",
  //     		children: function() {
  //     			return [
  //             KarmaFieldsAlpha.build({
  //               class: "field-controls",
  //               child: function() {
  //                 return KarmaFieldsAlpha.build({
  //                   class: "field-controls-group",
  //                   children: function() {
  //                     return [
  //                       KarmaFieldsAlpha.includes.icon({
  //                         tag: "button",
  //                         // text: function() {
  //                         //   return fetch(KarmaFieldsAlpha.icons_url+"/table-row-before.svg").then(function(response) {
  //                         //     return response.text();
  //                         //   });
  //                         // },
  //                         // text: () => fetch(KarmaFieldsAlpha.icons_url+"/table-row-before.svg").then(function(response) {
  //                         //   return response.text();
  //                         // }),
  //                         url: KarmaFieldsAlpha.icons_url+"/table-row-before.svg",
  //                         init: function(element, update) {
  //                           element.addEventListener("click", function(event) {
  //                             event.preventDefault();
  //                             var rect = select.getSelectionRect();
  //                             if (rect.height) {
  //                               select.selectionRect.top++;
  //                               gridManager.addRow(rect.top);
  //                             } else {
  //                               gridManager.addRow(0);
  //                             }
  //                           });
  //                           element.addEventListener("mouseup", function(event) {
  //                             event.stopPropagation();
  //                           });
  //                           // fetch(KarmaFieldsAlpha.icons_url+"/table-row-before.svg").then(function(response) {
  //                           //   return response.text();
  //                           // }).then(function(result) {
  //                           //   element.innerHTML = result;
  //                           // });
  //                         }
  //                       }),
  //                       KarmaFieldsAlpha.includes.icon({
  //                         tag: "button",
  //                         url: KarmaFieldsAlpha.icons_url+"/table-row-after.svg",
  //                         init: function(element) {
  //                           // fetch(KarmaFieldsAlpha.icons_url+"/table-row-after.svg").then(function(response) {
  //                           //   return response.text();
  //                           // }).then(function(result) {
  //                           //   element.innerHTML = result;
  //                           // });
  //                           element.addEventListener("click", function(event) {
  //                             event.preventDefault();
  //                             var rect = select.getSelectionRect();
  //                             if (rect.height) {
  //                               gridManager.addRow(rect.top+rect.height);
  //                             } else {
  //                               gridManager.addRow(select.rect.height);
  //                             }
  //                           });
  //                           element.addEventListener("mouseup", function(event) {
  //                             event.stopPropagation();
  //                           });
  //                         }
  //                       }),
  //                       KarmaFieldsAlpha.includes.icon({
  //                         tag: "button",
  //                         url: KarmaFieldsAlpha.icons_url+"/table-col-before.svg",
  //                         init: function(element) {
  //                           // element.innerText = "add col before";
  //                           // fetch(KarmaFieldsAlpha.icons_url+"/table-col-before.svg").then(function(response) {
  //                           //   return response.text();
  //                           // }).then(function(result) {
  //                           //   element.innerHTML = result;
  //                           // });
  //                           element.addEventListener("click", function(event) {
  //                             event.preventDefault();
  //                             var rect = select.getSelectionRect();
  //                             if (rect.width) {
  //                               select.selectionRect.left++;
  //                               gridManager.addCol(rect.left);
  //                             } else {
  //                               gridManager.addCol(0);
  //                             }
  //                           });
  //                           element.addEventListener("mouseup", function(event) {
  //                             event.stopPropagation();
  //                           });
  //                         }
  //                       }),
  //                       KarmaFieldsAlpha.includes.icon({
  //                         tag: "button",
  //                         url: KarmaFieldsAlpha.icons_url+"/table-col-after.svg",
  //                         init: function(element) {
  //                           // fetch(KarmaFieldsAlpha.icons_url+"/table-col-after.svg").then(function(response) {
  //                           //   return response.text();
  //                           // }).then(function(result) {
  //                           //   element.innerHTML = result;
  //                           // });
  //                           element.addEventListener("click", function(event) {
  //                             event.preventDefault();
  //                             var rect = select.getSelectionRect();
  //                             if (rect.width) {
  //                               gridManager.addCol(rect.left+rect.width);
  //                             } else {
  //                               gridManager.addCol(select.rect.width);
  //                             }
  //                           });
  //                           element.addEventListener("mouseup", function(event) {
  //                             event.stopPropagation();
  //                           });
  //                         }
  //                       }),
  //                       KarmaFieldsAlpha.includes.icon({
  //                         tag: "button",
  //                         url: KarmaFieldsAlpha.icons_url+"/table-row-delete.svg",
  //                         init: function(element) {
  //                           // fetch(KarmaFieldsAlpha.icons_url+"/table-row-delete.svg").then(function(response) {
  //                           //   return response.text();
  //                           // }).then(function(result) {
  //                           //   element.innerHTML = result;
  //                           // });
  //                           element.addEventListener("click", function(event) {
  //                             event.preventDefault();
  //                             var rect = select.getSelectionRect();
  //                             if (rect.height) {
  //                               var rows = [];
  //                               for (var i = 0; i < rect.height; i++) {
  //                                 rows.push(rect.top + i);
  //                               }
  //                               gridManager.deleteRows(rows);
  //                             }
  //                           });
  //                           element.addEventListener("mouseup", function(event) {
  //                             event.stopPropagation();
  //                           });
  //                         }
  //                       }),
  //                       KarmaFieldsAlpha.includes.icon({
  //                         tag: "button",
  //                         url: KarmaFieldsAlpha.icons_url+"/table-col-delete.svg",
  //                         init: function(element) {
  //                           // element.innerText = "remove col";
  //                           // fetch(KarmaFieldsAlpha.icons_url+"/table-col-delete.svg").then(function(response) {
  //                           //   return response.text();
  //                           // }).then(function(result) {
  //                           //   element.innerHTML = result;
  //                           // });
  //                           element.addEventListener("click", function(event) {
  //                             event.preventDefault();
  //                             var rect = select.getSelectionRect();
  //                             if (rect.width) {
  //                               var cols = [];
  //                               for (var i = 0; i < rect.width; i++) {
  //                                 cols.push(rect.left + i);
  //                               }
  //                               gridManager.deleteCols(cols);
  //                             }
  //                           });
  //                           element.addEventListener("mouseup", function(event) {
  //                             event.stopPropagation();
  //                           });
  //                         }
  //                       })
  //                     ];
  //                   }
  //                 });
  //               }
  //             }),
  //             KarmaFieldsAlpha.build({
  //               tag: "table",
  //               class: "grid",
  //               child: function() {
  //                 return KarmaFieldsAlpha.build({
  //                   tag: "tbody",
  //                   init: function(element, update) {
  //                     field.onUpdate = function(value) {
  //                       update();
  //                     }
  //                     gridManager.update = update;
  //                     field.fetch().then(function(value) {
  //                       update();
  //                     });
  //                   },
  //                   children: function() {
  //                     select.init();
  //                     var rowsField = field.createChild({
  //                       child_key: "rows"
  //                     });
  //                     return rowsField.get().map(function(row, y) {
  //                       select.addRow(y, y);
  //                       return KarmaFieldsAlpha.build({
  //                         tag: "tr",
  //                         children: function() {
  //                           var cellsField = rowsField.createChild({
  //                             child_key: y.toString()
  //                           }).createChild({
  //                             child_key: "cells",
  //                           });
  //                           return cellsField.get().map(function(col, x) {
  //                             var inputField = cellsField.createChild({
  //                               child_key: x.toString()
  //                             }).createChild({
  //                               child_key: "text",
  //                             });
  //                             return KarmaFieldsAlpha.build({
  //                               tag: "td",
  //                               init: function(cell, update) {
  //                                 select.addField(cell, inputField, x, y);
  //                                 update();
  //                               },
  //                               child: function() {
  //                                 return KarmaFieldsAlpha.fields.textinput(inputField);
  //                               }
  //                             });
  //                           });
  //                         }
  //                       });
  //                     });
  //                   }
  //                 });
  //               }
  //             })
  //           ];
  //         }
  //       });

}
