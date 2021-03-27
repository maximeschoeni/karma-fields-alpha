KarmaFieldsAlpha.fields.array = {};

// KarmaFieldsAlpha.fields.arrayRow.create = function(resource) {
//   field.getModifiedValue = function() {
//     if (field.children.some(function(rowField) {
//       return rowField.children.some(function(cellField) {
//         return cellField.value !== cellField.originalValue;
//       });
//     })) {
//       return this.getValue();
//     }
//   }
// }

KarmaFieldsAlpha.fields.array.create = function(resource) {
  let field = KarmaFieldsAlpha.Field(resource);
  field.datatype = "array";

  // field.events.fetch = function(target) {
  //
  //   let params = field.data.filters.children.reduce(function(value, filter) {
  //     value[filter.resource.key] = filter.getValue();
  //     return value;
  //   }, {});
  //   params.key = target.resource.key;
  //
  //   // don't send self value
  //   if (params[target.resource.key]) {
  //     params[target.resource.key] = undefined;
  //   }
  //
  //   const driver = field.getResourceAttribute("driver");
  //
  //   return KarmaFieldsAlpha.Form.fetch(driver, "querykey", params);
  //
  // }

  field.data.hasHeader = field.resource.columns.some(function(column) {
    return column.label;
  });


  let valueColumns = field.resource.columns.filter(function(column) {
    return (column.type === "value" || !column.type) && column.field && column.field.key;
  });
  if (field.resource.unique !== undefined) {
    field.data.unique = field.resource.unique;
  } else {
    field.data.unique = valueColumns.length === 1;
  }

  field.data.more = KarmaFieldsAlpha.createField({
    type: "button",
    // icon: "insert"
    text: field.resource.add_button_name || "Add Row"
  });
  field.data.more.events.click = function() {
    let value = field.getValue();
    field.setValue(value.concat([field.data.unique ? "" : {}]));
    field.triggerEvent("render", false, null, true);
  }

  field.data.delete = KarmaFieldsAlpha.createField({
    type: "button",
    icon: "trash"
    // text: "Add Row"
  });


  // field.data.createFilterField = function(resource, rowIndex) {
  //
  //     let filterField = KarmaFieldsAlpha.createField(column.field);
  //     if (column.field.key) {
  //       let value = field.getValue();
  //       if (value[rowIndex][column.field.key]) {
  //         filterField.setValue(value[rowIndex][column.field.key], "set");
  //       }
  //       filterField.events.change = function() {
  //         let value = field.getValue();
  //         value[rowIndex][column.field.key] = filterField.getValue();
  //         field.setValue(value);
  //       }
  //     }
  //
  //     return filterField;
  // };

  field.data.createCellField = function(resource, index) {
    let rowValue = field.getValue();
    let cellField = field.createChild(resource);
    if (rowValue[resource.key]) {
      cellField.setValue(rowValue[resource.key]);
    }

    // cellField.events.change = function(cellField) {
    //   let value = field.getValue();
    //   if (!value[index]) {
    //     value[index] = {};
    //   }
    //   value[index][resource.key] = cellField.getValue();
    //   field.setValue(value, "change");
    //   // field.triggerEvent("render");
    // }
    return cellField;
  }

  field.data.setCellValue = function(index, key, cellValue) {
    let value = field.getValue();
    if (!value[index]) {
      value[index] = {};
    }
    value[index][key] = cellValue;
    field.setValue(value, "change");
  }
  field.data.getCellValue = function(index, key) {
    let value = field.getValue();
    return value[index] && value[index][key];
  }

  // field.events.change = function(cellField) {
  //   let value = field.getValue();
  //   if (field.data.unique) {
  //     value[rowIndex] = childField.getValue();
  //   } else {
  //     if (!value[rowIndex]) {
  //       value[rowIndex] = {};
  //     }
  //     value[rowIndex][column.resource.key] = childField.getValue();
  //   }
  //   field.setValue();
  // }


  // field.setValue = function(value, context) {
  //   value = this.parse(value);
  //   for (let i = 0; i < value.length; i++) {
  //     let rowField = field.children[i] || field.data.createRowField();
  //     rowField.setValue(value, context);
  //   }
  // }
  // field.getValue = function() {
  //   return field.children.map(function(rowField) {
  //     return rowField.getValue();
  //   });
  // };
  // field.getModifiedValue = function() {
  //   if (field.children.some(function(rowField) {
  //     return rowField.children.some(function(cellField) {
  //       return cellField.value !== cellField.originalValue;
  //     });
  //   })) {
  //     return this.getValue();
  //   }
  // };
  //
  // field.data.createRowField = function() {
  //   let rowField = field.createChild();
  //   valueColumns.forEach(function(column) {
  //     rowField.getChild(column.field.key) || field.createChild(column.field);
  //   });
  //   rowField.setValue = function(value, context) {
  //     if (field.data.unique) {
  //       rowField.children[0].setValue(value, context);
  //     } else {
  //       rowField.children.forEach(function(cellField) {
  //         cellField.setValue(value[cellField.resource.key], context);
  //       });
  //     }
  //   }
  //   rowField.getValue = function() {
  //     if (field.data.unique) {
  //       return rowField.children[0].getValue();
  //     } else {
  //       return rowField.children.reduce(function(value, cellField) {
  //         value[cellField.resource.key] = cellField.getValue();
  //         return value;
  //       }, {});
  //     }
  //   }
  //   rowField.data.clear = field.createChild({
  //     type: "button",
  //     value: "delete",
  //     icon: "trash"
  //   });
  //   rowField.data.clear.events.click = function() {
  //     field.children = field.children.filter(function(item) {
  //       return item !== rowField;
  //     });
  //     field.triggerEvent("render");
  //   }
  //   return rowField;
  // }

  field.data.getRow = function(index, container) {
    const width = field.resource.columns.length;
    const height = container.children.length;
    let offset = field.data.hasHeader ? 1 : 0;
    let row = [];
    for (let i = width*(index+offset); i < width*(index+offset+1); i++) {
      if (i >= 0 && i < height) {
        row.push(container.children[i]);
      }
    }
    return row;

    // let children = Array.from(container.children);
    // if (index+1 > 0 && index+1 < children.length/this.width) {
    //   return children.slice(this.width*(index+1), this.width*(index+2));
    // }
  };
  field.data.getRowIndex = function(element) {
    const width = field.resource.columns.length;
    let offset = field.data.hasHeader ? 1 : 0;
    let index = 0;
    while (element.previousElementSibling) {
      element = element.previousElementSibling;
      index++;
    }
    return Math.floor(index/width) - offset;
  };
  field.data.mousedown = function(element, event) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    let rowIndex = field.data.getRowIndex(element);

    let indexDiff = 0;
    let mousemove = function(event) {
      let index = field.data.getRowIndex(element);
      let row = field.data.getRow(index, element.parentNode);
      let prevRow = field.data.getRow(index-1, element.parentNode);
      let nextRow = field.data.getRow(index+1, element.parentNode);

      if (row.length) {
        let diffX = event.clientX - mouseX;
        let diffY = event.clientY - mouseY;
        if (prevRow.length && diffY < -prevRow[0].clientHeight/2) {
          row.forEach(function(cell) {
            cell.parentNode.insertBefore(cell, prevRow[0]);
          });
          mouseY -= prevRow[0].clientHeight;
          diffY = event.clientY - mouseY;
          indexDiff--;
        }
        if (nextRow.length && diffY > nextRow[0].clientHeight/2) {
          nextRow.forEach(function(cell) {
            cell.parentNode.insertBefore(cell, row[0]);
          });
          mouseY += nextRow[0].clientHeight;
          diffY = event.clientY - mouseY;
          indexDiff++;
        }
        row.forEach(function(cell) {
          cell.style.transform = "translate("+diffX+"px, "+diffY+"px)";
        });
      }
    };
    let mouseup = function() {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
      let index = field.data.getRowIndex(element);
      let row = field.data.getRow(index, element.parentNode);
      row.forEach(function(cell) {
        cell.style.transform = "none";
      });
      value = field.getValue();

      let items = value[rowIndex];
      value.splice(rowIndex, 1);
      value.splice(index, 0, items);

      field.setValue(value, "change");

      field.triggerEvent("render");
      element.classList.remove("grabbing");
    };
    element.classList.add("grabbing");
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
  }


  return field;
}


KarmaFieldsAlpha.fields.array.build = function(field) {


  return {
    class: "field-array",
    children: [
      {
        class: "array",
        clear: true,
        update: function(table) {
          this.children = [];
          let value = field.getValue();

          // CSS Grid Layout
          this.element.style.gridTemplateColumns = field.resource.columns.map(function(column) {
            return column.width || "1fr";
          }).join(" ");


          // Header (labels)
          if (value.length && field.resource.columns && field.resource.columns.some(function(column) {
            return column.label;
          })) {

            field.resource.columns.forEach(function(column) {
              table.children.push({
                class: "th",
                children: {
                  tag: "a",
                  init: function() {
                    this.element.textContent = column.label || "";
                  }
                }
              });
            });

          }

          // Body
          if (value.length) {

            field.children = [];

            value.forEach(function(rowValue, rowIndex) {



              // let filterColumn = field.resource.columns.find(function(column) {
              //   return column.type === "filter-column";
              // });
              // if (filterColumn) {
              //   filterField = KarmaFieldsAlpha.Field({});
              //   if (filterColumn.field.key) {
              //     filterField.setValue(rowValue[column.field.key], "set");
              //     filterField.events.change = function() {
              //       let value = field.getValue();
              //       value[rowIndex][column.field.key] = filterField.getValue();
              //       field.setValue(value);
              //     }
              //   }
              // }


              // if (field.resource.columns.some(function(column) {
              //   return column.type === "filter-column";
              // })) {}
              //  = KarmaFieldsAlpha.Field({});




              // let rowField = field.children[rowIndex] || field.createChild();

              // let rowField = KarmaFieldsAlpha.Field({});

              // rowField.data.filters = KarmaFieldsAlpha.createField({});
              //
              // field.resource.columns.filter(function(column) {
              //   return column.type === "filter" && column.field && column.field.key;
              // }).forEach(function(column) {
              //   let cellField = rowField.data.filters.getChild(column.field.key) || rowField.data.filters.createChild(column.field);
              // });
              //
              // rowField.data.filters.events.change = function(target) {
              //   table.render();
              // }


              // rowField.events.fetch = function(target) {
              //   let driver = field.getResourceAttribute("driver");
              //   // params = rowField.data.filters.children.reduce(function(value, filterField) {
              //   //   value[filterField.resource.key] = filterField.getValue();
              //   //   return value;
              //   // }, {});
              //   // params.key = target.resource.key;
          		// 	return KarmaFieldsAlpha.Form.fetch(driver, "querykey", {
              //     key: target.resource.key
              //   }).then(function(results) {
          		// 		return results;
          		// 	});
              // }

              field.resource.columns.forEach(function(column, colIndex) {

                if (column.type === "index") {

                  table.children.push({
                    class: "td array-index",
                    init: function() {
                      this.element.addEventListener("mousedown", function(event) {
                        field.data.mousedown(this, event);
                      });
                    },
                    update: function() {
                      this.element.textContent = rowIndex+1;
                    }
                  });

                } else if (column.type === "delete") {

                  table.children.push({
                    class: "td array-delete",
                    child: {
                      tag: "button",
                      init: function() {
                        this.element.addEventListener("click", function() {
                          let value = field.getValue();
                          field.setValue(value.filter(function(item, index) {
                            return index !== rowIndex;
                          }));
                          field.triggerEvent("render", false, null, true);
                        })
                      },
                      render: function(clean) {
                        let button = this;
                        KarmaFieldsAlpha.getAsset(KarmaFieldsAlpha.icons_url+"/trash.svg").then(function(result) {
                          requestAnimationFrame(function() {
                            button.element.innerHTML = result;
                          });
                        });
                      }
                    }
                  });

                } else if (column.type === "condition") {

                  table.children.push({
                    class: "td table-filter condition-cell",
                    update: function(td) {
                      let filterField = field.data.createCellField(column.field, rowIndex);
                      filterField.events.change = function(cellField) {
                        field.data.setCellValue(rowIndex, column.field.key, filterField.getValue());
                        console.log(field.getValue());
                        td.render();

                      }
                      this.children = [
                        filterField.build(),
                        {
                          class: "condition-cell-child",
                          update: function() {
                            let filterValue = filterField.getValue();
                            let cellResource = column.conditions[filterValue];
                            if (filterValue && cellResource) {
                              let cellField = field.data.createCellField(cellResource, rowIndex);
                              cellField.setValue(field.data.getCellValue(rowIndex, cellResource.key), "set");
                              cellField.events.change = function(cellField) {
                                field.data.setCellValue(rowIndex, cellResource.key, cellField.getValue());
                                td.render();
                              }
                              this.child = cellField.build();
                            }
                          }
                        }
                      ];
                    }
                  });

                } else if (column.field && column.field.key) {

                  // let childField = rowField.getChild(column.field.key) || rowField.createChild(column.field);

                  // let childField = KarmaFieldsAlpha.createField(column.field);
                  let childField = field.createChild(column.field);
                  childField.setValue(field.data.unique ? rowValue : rowValue[column.field.key]);
                  childField.events.change = function(cellField) {
                    let value = field.getValue();

                    if (field.data.unique) {
                      value[rowIndex] = childField.getValue();
                    } else {
                      if (!value[rowIndex]) {
                        value[rowIndex] = {};
                      }
                      value[rowIndex][column.field.key] = childField.getValue();
                    }
                    field.setValue(value, "change");
                  }

                  // childField.events.fetch = function(target) {
                  //   return field.triggerEvent("fetch", true, childField);
                  // }
                  table.children.push({
                    class: "td array-cell",
                    child: childField.build()
                  });

                }

              });


              // // trash column
              // table.children.push({
              //   class: "td array-delete",
              //   child: {
              //     tag: "button",
              //     init: function() {
              //       this.element.addEventListener("click", function() {
              //         let value = field.getValue();
              //         field.setValue(value.filter(function(item, index) {
              //           return index !== rowIndex;
              //         }));
              //         field.triggerEvent("render", false, null, true);
              //       })
              //     },
              //     render: function(button) {
              //       KarmaFieldsAlpha.getAsset(KarmaFieldsAlpha.icons_url+"/trash.svg").then(function(result) {
              //         requestAnimationFrame(function() {
              //           button.element.innerHTML = result;
              //         });
              //       });
              //     }
              //   }
              // });

            });

          }
        }
      },
      {
        class:"array-more",
        child: field.data.more.build()
      }
    ]
  };
}
