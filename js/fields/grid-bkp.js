KarmaFields.fields.grid = function(field) {
  var select = KarmaFields.selectors.grid();


  var gridManager = {
    default: field.resource.default || {rows: [{cells: [{text: ""}]}]},
    // isEmptyValue: function(value) {
    //   return !value || !value.rows || !value.rows.length || !value.rows[0].cells || !value.rows[0].cells.length;
    // },
    addRow: async function(index) {
      field.history.save();
      var value = field.get();
      value.rows.splice(index, 0, {cells: value.rows[0].cells.map(function() {
        return {text:""};
      })});
      field.set(value).then(function() {
        field.save();
      }).then(function() {
        gridManager.update();
      });
    },
    addCol: function(index) {
      field.history.save();
      var value = field.get();
      value.rows.forEach(function(row) {
        row.cells.splice(index, 0, {text:""});
        return row;
      });
      field.set(value).then(function() {
        field.save();
        gridManager.update();
      });
    },
    deleteRows: function(rows) {
      field.history.save();
      select.select();
      var value = field.get();
      value.rows = value.rows.filter(function(row, index) {
        return rows.indexOf(index) === -1;
      });
      if (this.isEmptyValue(value)) {
        value = this.default;
      }
      field.set(value).then(function() {
        field.save();
        gridManager.update();
      });

    },
    deleteCols: function(cols) {
      field.history.save();
      select.select();
      var value = field.get();
      value.rows.forEach(function(row) {
        row.cells = row.cells.filter(function(cell, index) {
          return cols.indexOf(index) === -1;
        });
      });
      if (this.isEmptyValue(value)) {
        value = this.default;
      }
      field.set(value).then(function() {
        field.save();
        gridManager.update();
      });
    }
  };
  field.onFetch = function(value) {
    if (!value || !value.rows || !value.rows.length || !value.rows[0].cells || !value.rows[0].cells.length) {
      return gridManager.default
    }
    return value;
  };

  KarmaFields.events.onCopy = function(event) {
		select.onCopy(event);
	}
	KarmaFields.events.onPast = function(event) {
		select.onPast(event);
	}
  KarmaFields.events.onDelete = function(event) {
    if (document.activeElement === document.body) {
      // var rect = select.getSelectionRect();
      // if (rect.width > 1 || rect.height > 1) {
        var rows = select.getSelectedRows();
        var cols = select.getSelectedCols();
    		if (rows.length) {
    			gridManager.deleteRows(rows);
    			event.preventDefault();
    		} else if (cols.length) {
    			gridManager.deleteCols(cols);
    			event.preventDefault();
    		}
      // }
    }
	};
  KarmaFields.events.onSelectAll = function(event) {
		select.onSelectAll(event);
	};
  KarmaFields.events.onClick = function(event) {
		select.onClick();
	};
  KarmaFields.events.onClick = function(event) {
		select.onClick();
	};
  KarmaFields.events.onArrowUp = function(event) {
    var rect = select.getSelectionRect();
    if (rect.top > 0) {
      rect.top--;
      rect.width = 1;
      rect.height = 1;
      select.select(rect);
    }
	};
  KarmaFields.events.onArrowDown = function(event) {
    var rect = select.getSelectionRect();
    if (rect.top + rect.height < select.rect.height) {
      rect.top = rect.top + rect.height;
      rect.width = 1;
      rect.height = 1;
      select.select(rect);
    }
	};
  KarmaFields.events.onArrowLeft = function(event) {
    var rect = select.getSelectionRect();
    if (rect.left > 0) {
      rect.left--;
      rect.width = 1;
      rect.height = 1;
      select.select(rect);
    }
	};
  KarmaFields.events.onArrowRight = function(event) {
    var rect = select.getSelectionRect();
    if (rect.left + rect.width < select.rect.width) {
      rect.left = rect.left + rect.width;
      rect.width = 1;
      rect.height = 1;
      select.select(rect);
    }
	};

	// return KarmaFields.build({
	// 	class: "karma-field grid-field",
	// 	children: function() {
	// 		return [
	// 			field.resource.label && KarmaFields.build({
	// 				tag: "label",
	// 				init: function(label) {
	// 					label.htmlFor = field.id;
	// 					label.innerHTML = field.resource.label;
	// 				}
	// 			}),
        return KarmaFields.build({
      		class: "karma-field-grid",
      		children: function() {
      			return [
              KarmaFields.build({
                class: "field-controls",
                child: function() {
                  return KarmaFields.build({
                    class: "field-controls-group",
                    children: function() {
                      return [
                        KarmaFields.includes.icon({
                          tag: "button",
                          // text: function() {
                          //   return fetch(KarmaFields.icons_url+"/table-row-before.svg").then(function(response) {
                          //     return response.text();
                          //   });
                          // },
                          // text: () => fetch(KarmaFields.icons_url+"/table-row-before.svg").then(function(response) {
                          //   return response.text();
                          // }),
                          url: KarmaFields.icons_url+"/table-row-before.svg",
                          init: function(element, update) {
                            element.addEventListener("click", function(event) {
                              event.preventDefault();
                              var rect = select.getSelectionRect();
                              if (rect.height) {
                                select.selectionRect.top++;
                                gridManager.addRow(rect.top);
                              } else {
                                gridManager.addRow(0);
                              }
                            });
                            element.addEventListener("mouseup", function(event) {
                              event.stopPropagation();
                            });
                            // fetch(KarmaFields.icons_url+"/table-row-before.svg").then(function(response) {
                            //   return response.text();
                            // }).then(function(result) {
                            //   element.innerHTML = result;
                            // });
                          }
                        }),
                        KarmaFields.includes.icon({
                          tag: "button",
                          url: KarmaFields.icons_url+"/table-row-after.svg",
                          init: function(element) {
                            // fetch(KarmaFields.icons_url+"/table-row-after.svg").then(function(response) {
                            //   return response.text();
                            // }).then(function(result) {
                            //   element.innerHTML = result;
                            // });
                            element.addEventListener("click", function(event) {
                              event.preventDefault();
                              var rect = select.getSelectionRect();
                              if (rect.height) {
                                gridManager.addRow(rect.top+rect.height);
                              } else {
                                gridManager.addRow(select.rect.height);
                              }
                            });
                            element.addEventListener("mouseup", function(event) {
                              event.stopPropagation();
                            });
                          }
                        }),
                        KarmaFields.includes.icon({
                          tag: "button",
                          url: KarmaFields.icons_url+"/table-col-before.svg",
                          init: function(element) {
                            // element.innerText = "add col before";
                            // fetch(KarmaFields.icons_url+"/table-col-before.svg").then(function(response) {
                            //   return response.text();
                            // }).then(function(result) {
                            //   element.innerHTML = result;
                            // });
                            element.addEventListener("click", function(event) {
                              event.preventDefault();
                              var rect = select.getSelectionRect();
                              if (rect.width) {
                                select.selectionRect.left++;
                                gridManager.addCol(rect.left);
                              } else {
                                gridManager.addCol(0);
                              }
                            });
                            element.addEventListener("mouseup", function(event) {
                              event.stopPropagation();
                            });
                          }
                        }),
                        KarmaFields.includes.icon({
                          tag: "button",
                          url: KarmaFields.icons_url+"/table-col-after.svg",
                          init: function(element) {
                            // fetch(KarmaFields.icons_url+"/table-col-after.svg").then(function(response) {
                            //   return response.text();
                            // }).then(function(result) {
                            //   element.innerHTML = result;
                            // });
                            element.addEventListener("click", function(event) {
                              event.preventDefault();
                              var rect = select.getSelectionRect();
                              if (rect.width) {
                                gridManager.addCol(rect.left+rect.width);
                              } else {
                                gridManager.addCol(select.rect.width);
                              }
                            });
                            element.addEventListener("mouseup", function(event) {
                              event.stopPropagation();
                            });
                          }
                        }),
                        KarmaFields.includes.icon({
                          tag: "button",
                          url: KarmaFields.icons_url+"/table-row-delete.svg",
                          init: function(element) {
                            // fetch(KarmaFields.icons_url+"/table-row-delete.svg").then(function(response) {
                            //   return response.text();
                            // }).then(function(result) {
                            //   element.innerHTML = result;
                            // });
                            element.addEventListener("click", function(event) {
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
                            element.addEventListener("mouseup", function(event) {
                              event.stopPropagation();
                            });
                          }
                        }),
                        KarmaFields.includes.icon({
                          tag: "button",
                          url: KarmaFields.icons_url+"/table-col-delete.svg",
                          init: function(element) {
                            // element.innerText = "remove col";
                            // fetch(KarmaFields.icons_url+"/table-col-delete.svg").then(function(response) {
                            //   return response.text();
                            // }).then(function(result) {
                            //   element.innerHTML = result;
                            // });
                            element.addEventListener("click", function(event) {
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
                            element.addEventListener("mouseup", function(event) {
                              event.stopPropagation();
                            });
                          }
                        })
                      ];
                    }
                  });
                }
              }),
              KarmaFields.build({
                tag: "table",
                class: "grid",
                child: function() {
                  return KarmaFields.build({
                    tag: "tbody",
                    init: function(element, update) {
                      field.onUpdate = function(value) {
                        update();
                      }
                      gridManager.update = update;
                      field.fetch().then(function(value) {
                        update();
                      });
                    },
                    children: function() {
                      select.init();
                      var rowsField = field.createChild({
                        child_key: "rows"
                      });
                      return rowsField.get().map(function(row, y) {
                        select.addRow(y, y);
                        return KarmaFields.build({
                          tag: "tr",
                          children: function() {
                            var cellsField = rowsField.createChild({
                              child_key: y.toString()
                            }).createChild({
                              child_key: "cells",
                            });
                            return cellsField.get().map(function(col, x) {
                              var inputField = cellsField.createChild({
                                child_key: x.toString()
                              }).createChild({
                                child_key: "text",
                              });
                              return KarmaFields.build({
                                tag: "td",
                                init: function(cell, update) {
                                  select.addField(cell, inputField, x, y);
                                  update();
                                },
                                child: function() {
                                  return KarmaFields.fields.textinput(inputField);
                                }
                              });
                            });
                          }
                        });
                      });
                    }
                  });
                }
              })
            ];
          }
        });
// 			];
// 		}
// 	});
}
