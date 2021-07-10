KarmaFieldsAlpha.fields.array = class extends KarmaFieldsAlpha.fields.field {

  constructor(resource, domain) {
    super(resource, domain);

    this.datatype = "array";

  }

  hasUniqueColumn() {
    if (this.resource.unique !== undefined) {
      return this.resource.unique;
    } else {
      return this.resource.columns.filter(function(column) {
        return (column.type === "value" || !column.type) && column.field && column.field.key;
      }).length === 1;
    }
  }

  swap(index1, index2) {
    const value = this.getValue();
    const item1 = value[index1];
    value[index1] = value[index2];
    value[index2] = item1;
    this.setValue(value, "change");
  }

  getColumns() {
    if (!this.columns) {
      this.columns = this.resource.columns.slice();
      if (this.resource.index && !this.resource.columns.some(function(column) {
        return column.type === "index";
      })) {
        this.columns.unshift({
          type: "index",
          width: "30px"
        });
      }
      if (!this.resource.columns.some(function(column) {
        return column.type === "delete";
      })) {
        this.columns.push({
          type: "delete",
          width: "30px"
        });
      }
    }
    return this.columns
  }

  hasHeader() {
    return this.getColumns().some(function(column) {
      return column.header || column.field && column.field.label;
    });
  }

  // // not used yet!
  // createCellField(resource, index) {
  //   let rowValue = this.getValue();
  //   let cellField = this.createChild(resource);
  //   if (rowValue[resource.key]) {
  //     cellField.setValue(rowValue[resource.key]);
  //   }
  //   return cellField;
  // }
  //
  // // not used yet!
  // setCellValue(index, key, cellValue) {
  //   let value = this.getValue();
  //   if (!value[index]) {
  //     value[index] = {};
  //   }
  //   value[index][key] = cellValue;
  //   this.setValue(value, "change");
  // }
  //
  // // not used yet!
  // getCellValue(index, key) {
  //   let value = this.getValue();
  //   return value[index] && value[index][key];
  // }

  // // -> ordering
  // getRow(index, container) {
  //   const width = this.resource.columns.length;
  //   const height = container.children.length;
  //   let offset = this.hasHeader() ? 1 : 0;
  //   let row = [];
  //   for (let i = width*(index+offset); i < width*(index+offset+1); i++) {
  //     if (i >= 0 && i < height) {
  //       row.push(container.children[i]);
  //     }
  //   }
  //   return row;
  // }
  //
  // // -> ordering
  // getRowIndex(element) {
  //   const width = this.resource.columns.length;
  //   let offset = this.hasHeader() ? 1 : 0;
  //   let index = 0;
  //   while (element.previousElementSibling) {
  //     element = element.previousElementSibling;
  //     index++;
  //   }
  //   return Math.floor(index/width) - offset;
  // }
  //
  // // -> ordering
  // mousedown(element, event) {
  //   const field = this;
  //
  //   let mouseX = event.clientX;
  //   let mouseY = event.clientY;
  //   let rowIndex = field.data.getRowIndex(element);
  //
  //   let indexDiff = 0;
  //   let mousemove = function(event) {
  //     let index = field.data.getRowIndex(element);
  //     let row = field.data.getRow(index, element.parentNode);
  //     let prevRow = field.data.getRow(index-1, element.parentNode);
  //     let nextRow = field.data.getRow(index+1, element.parentNode);
  //
  //     if (row.length) {
  //       let diffX = event.clientX - mouseX;
  //       let diffY = event.clientY - mouseY;
  //       if (prevRow.length && diffY < -prevRow[0].clientHeight/2) {
  //         row.forEach(function(cell) {
  //           cell.parentNode.insertBefore(cell, prevRow[0]);
  //         });
  //         mouseY -= prevRow[0].clientHeight;
  //         diffY = event.clientY - mouseY;
  //         indexDiff--;
  //       }
  //       if (nextRow.length && diffY > nextRow[0].clientHeight/2) {
  //         nextRow.forEach(function(cell) {
  //           cell.parentNode.insertBefore(cell, row[0]);
  //         });
  //         mouseY += nextRow[0].clientHeight;
  //         diffY = event.clientY - mouseY;
  //         indexDiff++;
  //       }
  //       row.forEach(function(cell) {
  //         cell.style.transform = "translate("+diffX+"px, "+diffY+"px)";
  //       });
  //     }
  //   };
  //   let mouseup = function() {
  //     window.removeEventListener("mousemove", mousemove);
  //     window.removeEventListener("mouseup", mouseup);
  //     let index = field.data.getRowIndex(element);
  //     let row = field.data.getRow(index, element.parentNode);
  //     row.forEach(function(cell) {
  //       cell.style.transform = "none";
  //     });
  //     value = field.getValue();
  //
  //     let items = value[rowIndex];
  //     value.splice(rowIndex, 1);
  //     value.splice(index, 0, items);
  //
  //     field.setValue(value, "change");
  //
  //     field.triggerEvent("render");
  //     element.classList.remove("grabbing");
  //   };
  //   element.classList.add("grabbing");
  //   window.addEventListener("mousemove", mousemove);
  //   window.addEventListener("mouseup", mouseup);
  // }
  //

  build() {
    const field = this;

    return {
      class: "karma-field-array",
      init: function(container) {
        if (field.resource.style) {
					this.element.style = field.resource.style;
				}
        // if (!field.hasValue()) {
        //   container.element.classList.add("loading");
        //   field.fetchValue().then(function(value) {
        //     container.element.classList.remove("loading");
        //     container.render(true);
        //   });
        // }
      },
      update: function(container) {
        this.children = [
          // {
					// 	tag: "label",
					// 	init: function(label) {
					// 		if (field.resource.label) {
					// 			this.element.textContent = field.resource.label;
					// 		}
					// 	}
					// },
          {
            class: "array",
            clear: true,
            update: function(table) {
              this.children = [];
              let value = field.getValue();

              // console.log(value);

              if (!value.length) {
                this.element.classList.add("empty");
              }
              if (!field.hasValue()) {
                field.fetchValue().then(function(value) {
                  container.render(true);
                });
              }

              let manager = new KarmaFieldsAlpha.Orderer(this.element);

              manager.events.change = function(index, originalIndex) {
                field.swap(index, originalIndex);
                container.render(true);
              }

              // CSS Grid Layout
              this.element.style.gridTemplateColumns = field.getColumns().map(function(column) {
                return column.width || "1fr";
              }).join(" ");


              // Header (labels) // field label is DEPRECATED -> use column.header
              if (value.length && field.hasHeader()) {
                field.getColumns().forEach(function(column) {
                  table.children.push({
                    class: "th",
                    init: function() {
                      this.element.textContent = column.header || column.field && column.field.label || "";
                    }
                  });
                });
              }

              // Body
              if (value.length) {

                field.children = [];

                console.log(field.getColumns());

                value.forEach(function(rowValue, rowIndex) {

                  console.log(rowValue, rowIndex);

                  field.getColumns().forEach(function(column, colIndex) {

                    if (column.type === "index") {

                      table.children.push({
                        class: "td array-index",
                        init: function() {
                          // this.element.addEventListener("mousedown", function(event) {
                          //   field.data.mousedown(this, event);
                          // });

                          manager.registerItem(this.element, colIndex, rowIndex, "index");
                        },
                        update: function() {
                          this.element.textContent = rowIndex+1;
                        }
                      });

                    } else if (column.type === "delete") {

                      table.children.push({
                        class: "td array-delete",
                        init: function() {
                          manager.registerItem(this.element, colIndex, rowIndex, "delete");
                        },
                        child: {
                          tag: "button",
                          init: function(button) {
                            this.element.addEventListener("click", function() {
                              let value = field.getValue();
                              field.triggerEvent("history", true);
                              field.setValue(value.filter(function(item, index) {
                                return index !== rowIndex;
                              }));
                              field.triggerEvent("change", true);
                              container.render(true);
                            });
                          },
                          child: new KarmaFieldsAlpha.fields.icon({
                            type: "icon",
                            value: "trash.svg"
                          }).build()
                        }
                      });

                    // } else if (column.type === "condition") {
                    //
                    //   table.children.push({
                    //     class: "td table-filter condition-cell",
                    //     update: function(td) {
                    //       let filterField = field.data.createCellField(column.field, rowIndex);
                    //       filterField.events.change = function(cellField) {
                    //         field.data.setCellValue(rowIndex, column.field.key, filterField.getValue());
                    //         console.log(field.getValue());
                    //         td.render();
                    //
                    //       }
                    //       this.children = [
                    //         filterField.build(),
                    //         {
                    //           class: "condition-cell-child",
                    //           update: function() {
                    //             let filterValue = filterField.getValue();
                    //             let cellResource = column.conditions[filterValue];
                    //             if (filterValue && cellResource) {
                    //               let cellField = field.data.createCellField(cellResource, rowIndex);
                    //               cellField.setValue(field.data.getCellValue(rowIndex, cellResource.key), "set");
                    //               cellField.events.change = function(cellField) {
                    //                 field.data.setCellValue(rowIndex, cellResource.key, cellField.getValue());
                    //                 td.render();
                    //               }
                    //               this.child = cellField.build();
                    //             }
                    //           }
                    //         }
                    //       ];
                    //     }
                    //   });

                    } else if (column.field && column.field.key) {

                      let childField = field.createChild(column.field);
                      if (field.hasUniqueColumn()) {
                        childField.setValue(rowValue);
                      } else {
                        childField.setValue(rowValue[column.field.key] || childField.getDefault());
                      }
                      childField.events.change = function(cellField) {
                        let value = field.getValue();

                        if (field.hasUniqueColumn()) {
                          value[rowIndex] = childField.getValue();
                        } else {
                          if (!value[rowIndex] || typeof value[rowIndex] !== "object") {
                            value[rowIndex] = {};
                          }
                          value[rowIndex][column.field.key] = childField.getValue();
                        }
                        field.triggerEvent("history", true);
                        field.setValue(value);
                        field.triggerEvent("change", true);
                      }

                      table.children.push({
                        class: "td array-cell",
                        init: function () {
                          manager.registerItem(this.element, colIndex, rowIndex, "field");
                        },
                        child: childField.build()
                      });
                    }
                  });
                });
              }
            }
          },
          {
            class:"array-more",
            child: {
              tag: "button",
              init: function(button) {
                this.element.textContent = field.resource.add_button_name || "Add Row";
                this.element.addEventListener("click", function() {
                  field.triggerEvent("history", true);
                  let value = field.getValue();
                  field.setValue(value.concat([field.data.unique ? "" : {}]));
                  field.triggerEvent("change", true);
                  container.render(true);
                });
              }
              // child: new KarmaFieldsAlpha.fields.icon({
              //   type: "icon",
              //   value: "insert.svg"
              // }).build()
            }
          }
        ];
      }
    };

  }

}


KarmaFieldsAlpha.Orderer = class {

  constructor(element) {
    const manager = this;

    this.numRow = 0;
    this.map = new Map();
    this.events = {};

    element.onmousedown = function(event) {
      if (event.button === 0) {
        let target = event.target.closest(".array > *");
        let cell = manager.map.get(target);
        if (cell && cell.type === "index") {
          manager.startDrag(cell, target, event, element);
        }
      }
    }
  }

  trigger(eventName, ...params) {
    if (this.events[eventName]) {
      this.events[eventName].call(this, ...params)
    }
  }

  registerItem(element, col, row, type) {
    this.map.set(element, {
      col: col,
      row: row,
      type: type
    });
    this.numRow = Math.max(row+1, this.numRow);
  }

  // -> ordering
  getRow(index) {
    let row = [];
    this.map.forEach(function(value, key) {
      if (value.row === index) {
        row.push(key);
      }
    });
    return row;
  }

  insertBefore(row, prevRow) {
    const manager = this;
    row.forEach(function(cell) {
      // console.log(cell, prevRow[0]);
      cell.parentNode.insertBefore(cell, prevRow[0]);
      manager.map.get(cell).row--;
    });
    prevRow.forEach(function(cell) {
      manager.map.get(cell).row++;
    });
  }

  insertAfter(row, nextRow) {
    const manager = this;
    row.forEach(function(cell) {
      manager.map.get(cell).row++;
    });
    nextRow.forEach(function(cell) {
      cell.parentNode.insertBefore(cell, row[0]);
      manager.map.get(cell).row--;
    });
  }

  // -> ordering
  startDrag(item, targetElement, event, arrayElement) {
    const manager = this;
    const originalIndex = item.row;
    let row = manager.getRow(item.row);
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    let mousemove = function(event) {
      let diffX = event.clientX - mouseX;
      let diffY = event.clientY - mouseY;
      let prevRow;
      let nextRow;

      if (item.row > 0) {
        prevRow = manager.getRow(item.row-1);
      }
      if (item.row < manager.numRow-1) {
        nextRow = manager.getRow(item.row+1);
      }

      if (prevRow && diffY < -prevRow[0].clientHeight/2) {
        manager.insertBefore(row, prevRow);
        mouseY -= prevRow[0].clientHeight;
        diffY = event.clientY - mouseY;
      }
      if (nextRow && diffY > nextRow[0].clientHeight/2) {
        manager.insertAfter(row, nextRow);
        mouseY += nextRow[0].clientHeight;
        diffY = event.clientY - mouseY;
      }
      row.forEach(function(cell) {
        cell.style.transform = "translate("+diffX+"px, "+diffY+"px)";
      });
    };
    let mouseup = function() {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
      row.forEach(function(cell) {
        cell.style.transform = "none";
      });
      if (item.row !== originalIndex) {
        setTimeout(function() {
          manager.trigger("change", item.row, originalIndex);
        }, 200);
      }



      // value = field.getValue();
      //
      // let items = value[rowIndex];
      // value.splice(rowIndex, 1);
      // value.splice(index, 0, items);
      //
      // field.setValue(value, "change");
      targetElement.classList.remove("grabbing");
      arrayElement.classList.remove("dragging");
      row.forEach(function(cell) {
        cell.classList.remove("drag");
      });
    };

    targetElement.classList.add("grabbing");
    arrayElement.classList.add("dragging");
    row.forEach(function(cell) {
      cell.classList.add("drag");
    });
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
  }


}





// KarmaFieldsAlpha.fields.array = {};
//
// // KarmaFieldsAlpha.fields.arrayRow.create = function(resource) {
// //   field.getModifiedValue = function() {
// //     if (field.children.some(function(rowField) {
// //       return rowField.children.some(function(cellField) {
// //         return cellField.value !== cellField.originalValue;
// //       });
// //     })) {
// //       return this.getValue();
// //     }
// //   }
// // }
//
// KarmaFieldsAlpha.fields.array.create = function(resource) {
//   let field = KarmaFieldsAlpha.Field(resource);
//   field.datatype = "array";
//
//   // field.events.fetch = function(target) {
//   //
//   //   let params = field.data.filters.children.reduce(function(value, filter) {
//   //     value[filter.resource.key] = filter.getValue();
//   //     return value;
//   //   }, {});
//   //   params.key = target.resource.key;
//   //
//   //   // don't send self value
//   //   if (params[target.resource.key]) {
//   //     params[target.resource.key] = undefined;
//   //   }
//   //
//   //   const driver = field.getResourceAttribute("driver");
//   //
//   //   return KarmaFieldsAlpha.Form.fetch(driver, "querykey", params);
//   //
//   // }
//
//   field.data.hasHeader = field.resource.columns.some(function(column) {
//     return column.label;
//   });
//
//
//   let valueColumns = field.resource.columns.filter(function(column) {
//     return (column.type === "value" || !column.type) && column.field && column.field.key;
//   });
//   if (field.resource.unique !== undefined) {
//     field.data.unique = field.resource.unique;
//   } else {
//     field.data.unique = valueColumns.length === 1;
//   }
//
//   field.data.more = KarmaFieldsAlpha.createField({
//     type: "button",
//     // icon: "insert"
//     text: field.resource.add_button_name || "Add Row"
//   });
//   field.data.more.events.click = function() {
//     let value = field.getValue();
//     field.setValue(value.concat([field.data.unique ? "" : {}]));
//     field.triggerEvent("render", false, null, true);
//   }
//
//   field.data.delete = KarmaFieldsAlpha.createField({
//     type: "button",
//     icon: "trash"
//     // text: "Add Row"
//   });
//
//
//   // field.data.createFilterField = function(resource, rowIndex) {
//   //
//   //     let filterField = KarmaFieldsAlpha.createField(column.field);
//   //     if (column.field.key) {
//   //       let value = field.getValue();
//   //       if (value[rowIndex][column.field.key]) {
//   //         filterField.setValue(value[rowIndex][column.field.key], "set");
//   //       }
//   //       filterField.events.change = function() {
//   //         let value = field.getValue();
//   //         value[rowIndex][column.field.key] = filterField.getValue();
//   //         field.setValue(value);
//   //       }
//   //     }
//   //
//   //     return filterField;
//   // };
//
//   field.data.createCellField = function(resource, index) {
//     let rowValue = field.getValue();
//     let cellField = field.createChild(resource);
//     if (rowValue[resource.key]) {
//       cellField.setValue(rowValue[resource.key]);
//     }
//
//     // cellField.events.change = function(cellField) {
//     //   let value = field.getValue();
//     //   if (!value[index]) {
//     //     value[index] = {};
//     //   }
//     //   value[index][resource.key] = cellField.getValue();
//     //   field.setValue(value, "change");
//     //   // field.triggerEvent("render");
//     // }
//     return cellField;
//   }
//
//   field.data.setCellValue = function(index, key, cellValue) {
//     let value = field.getValue();
//     if (!value[index]) {
//       value[index] = {};
//     }
//     value[index][key] = cellValue;
//     field.setValue(value, "change");
//   }
//   field.data.getCellValue = function(index, key) {
//     let value = field.getValue();
//     return value[index] && value[index][key];
//   }
//
//   // field.events.change = function(cellField) {
//   //   let value = field.getValue();
//   //   if (field.data.unique) {
//   //     value[rowIndex] = childField.getValue();
//   //   } else {
//   //     if (!value[rowIndex]) {
//   //       value[rowIndex] = {};
//   //     }
//   //     value[rowIndex][column.resource.key] = childField.getValue();
//   //   }
//   //   field.setValue();
//   // }
//
//
//   // field.setValue = function(value, context) {
//   //   value = this.parse(value);
//   //   for (let i = 0; i < value.length; i++) {
//   //     let rowField = field.children[i] || field.data.createRowField();
//   //     rowField.setValue(value, context);
//   //   }
//   // }
//   // field.getValue = function() {
//   //   return field.children.map(function(rowField) {
//   //     return rowField.getValue();
//   //   });
//   // };
//   // field.getModifiedValue = function() {
//   //   if (field.children.some(function(rowField) {
//   //     return rowField.children.some(function(cellField) {
//   //       return cellField.value !== cellField.originalValue;
//   //     });
//   //   })) {
//   //     return this.getValue();
//   //   }
//   // };
//   //
//   // field.data.createRowField = function() {
//   //   let rowField = field.createChild();
//   //   valueColumns.forEach(function(column) {
//   //     rowField.getDescendant(column.field.key) || field.createChild(column.field);
//   //   });
//   //   rowField.setValue = function(value, context) {
//   //     if (field.data.unique) {
//   //       rowField.children[0].setValue(value, context);
//   //     } else {
//   //       rowField.children.forEach(function(cellField) {
//   //         cellField.setValue(value[cellField.resource.key], context);
//   //       });
//   //     }
//   //   }
//   //   rowField.getValue = function() {
//   //     if (field.data.unique) {
//   //       return rowField.children[0].getValue();
//   //     } else {
//   //       return rowField.children.reduce(function(value, cellField) {
//   //         value[cellField.resource.key] = cellField.getValue();
//   //         return value;
//   //       }, {});
//   //     }
//   //   }
//   //   rowField.data.clear = field.createChild({
//   //     type: "button",
//   //     value: "delete",
//   //     icon: "trash"
//   //   });
//   //   rowField.data.clear.events.click = function() {
//   //     field.children = field.children.filter(function(item) {
//   //       return item !== rowField;
//   //     });
//   //     field.triggerEvent("render");
//   //   }
//   //   return rowField;
//   // }
//
//   field.data.getRow = function(index, container) {
//     const width = field.resource.columns.length;
//     const height = container.children.length;
//     let offset = field.data.hasHeader ? 1 : 0;
//     let row = [];
//     for (let i = width*(index+offset); i < width*(index+offset+1); i++) {
//       if (i >= 0 && i < height) {
//         row.push(container.children[i]);
//       }
//     }
//     return row;
//
//     // let children = Array.from(container.children);
//     // if (index+1 > 0 && index+1 < children.length/this.width) {
//     //   return children.slice(this.width*(index+1), this.width*(index+2));
//     // }
//   };
//   field.data.getRowIndex = function(element) {
//     const width = field.resource.columns.length;
//     let offset = field.data.hasHeader ? 1 : 0;
//     let index = 0;
//     while (element.previousElementSibling) {
//       element = element.previousElementSibling;
//       index++;
//     }
//     return Math.floor(index/width) - offset;
//   };
//   field.data.mousedown = function(element, event) {
//     let mouseX = event.clientX;
//     let mouseY = event.clientY;
//     let rowIndex = field.data.getRowIndex(element);
//
//     let indexDiff = 0;
//     let mousemove = function(event) {
//       let index = field.data.getRowIndex(element);
//       let row = field.data.getRow(index, element.parentNode);
//       let prevRow = field.data.getRow(index-1, element.parentNode);
//       let nextRow = field.data.getRow(index+1, element.parentNode);
//
//       if (row.length) {
//         let diffX = event.clientX - mouseX;
//         let diffY = event.clientY - mouseY;
//         if (prevRow.length && diffY < -prevRow[0].clientHeight/2) {
//           row.forEach(function(cell) {
//             cell.parentNode.insertBefore(cell, prevRow[0]);
//           });
//           mouseY -= prevRow[0].clientHeight;
//           diffY = event.clientY - mouseY;
//           indexDiff--;
//         }
//         if (nextRow.length && diffY > nextRow[0].clientHeight/2) {
//           nextRow.forEach(function(cell) {
//             cell.parentNode.insertBefore(cell, row[0]);
//           });
//           mouseY += nextRow[0].clientHeight;
//           diffY = event.clientY - mouseY;
//           indexDiff++;
//         }
//         row.forEach(function(cell) {
//           cell.style.transform = "translate("+diffX+"px, "+diffY+"px)";
//         });
//       }
//     };
//     let mouseup = function() {
//       window.removeEventListener("mousemove", mousemove);
//       window.removeEventListener("mouseup", mouseup);
//       let index = field.data.getRowIndex(element);
//       let row = field.data.getRow(index, element.parentNode);
//       row.forEach(function(cell) {
//         cell.style.transform = "none";
//       });
//       value = field.getValue();
//
//       let items = value[rowIndex];
//       value.splice(rowIndex, 1);
//       value.splice(index, 0, items);
//
//       field.setValue(value, "change");
//
//       field.triggerEvent("render");
//       element.classList.remove("grabbing");
//     };
//     element.classList.add("grabbing");
//     window.addEventListener("mousemove", mousemove);
//     window.addEventListener("mouseup", mouseup);
//   }
//
//
//   return field;
// }
//
//
// KarmaFieldsAlpha.fields.array.build = function(field) {
//
//
//   return {
//     class: "field-array",
//     children: [
//       {
//         class: "array",
//         clear: true,
//         update: function(table) {
//           this.children = [];
//           let value = field.getValue();
//
//           // CSS Grid Layout
//           this.element.style.gridTemplateColumns = field.resource.columns.map(function(column) {
//             return column.width || "1fr";
//           }).join(" ");
//
//
//           // Header (labels) // field label is DEPRECATED -> use column.header
//           if (value.length && field.resource.columns && (field.resource.columns.some(function(column) {
//             return column.field && column.field.label;
//           }) || field.resource.columns.some(function(column) {
//             return column.header;
//           }))) {
//             field.resource.columns.forEach(function(column) {
//               table.children.push({
//                 class: "th",
//                 init: function() {
//                   this.element.textContent = column.header || column.field && column.field.label || "";
//                 }
//               });
//             });
//           }
//
//           // Body
//           if (value.length) {
//
//             field.children = [];
//
//             value.forEach(function(rowValue, rowIndex) {
//
//
//
//               // let filterColumn = field.resource.columns.find(function(column) {
//               //   return column.type === "filter-column";
//               // });
//               // if (filterColumn) {
//               //   filterField = KarmaFieldsAlpha.Field({});
//               //   if (filterColumn.field.key) {
//               //     filterField.setValue(rowValue[column.field.key], "set");
//               //     filterField.events.change = function() {
//               //       let value = field.getValue();
//               //       value[rowIndex][column.field.key] = filterField.getValue();
//               //       field.setValue(value);
//               //     }
//               //   }
//               // }
//
//
//               // if (field.resource.columns.some(function(column) {
//               //   return column.type === "filter-column";
//               // })) {}
//               //  = KarmaFieldsAlpha.Field({});
//
//
//
//
//               // let rowField = field.children[rowIndex] || field.createChild();
//
//               // let rowField = KarmaFieldsAlpha.Field({});
//
//               // rowField.data.filters = KarmaFieldsAlpha.createField({});
//               //
//               // field.resource.columns.filter(function(column) {
//               //   return column.type === "filter" && column.field && column.field.key;
//               // }).forEach(function(column) {
//               //   let cellField = rowField.data.filters.getDescendant(column.field.key) || rowField.data.filters.createChild(column.field);
//               // });
//               //
//               // rowField.data.filters.events.change = function(target) {
//               //   table.render();
//               // }
//
//
//               // rowField.events.fetch = function(target) {
//               //   let driver = field.getResourceAttribute("driver");
//               //   // params = rowField.data.filters.children.reduce(function(value, filterField) {
//               //   //   value[filterField.resource.key] = filterField.getValue();
//               //   //   return value;
//               //   // }, {});
//               //   // params.key = target.resource.key;
//           		// 	return KarmaFieldsAlpha.Form.fetch(driver, "querykey", {
//               //     key: target.resource.key
//               //   }).then(function(results) {
//           		// 		return results;
//           		// 	});
//               // }
//
//               field.resource.columns.forEach(function(column, colIndex) {
//
//                 if (column.type === "index") {
//
//                   table.children.push({
//                     class: "td array-index",
//                     init: function() {
//                       this.element.addEventListener("mousedown", function(event) {
//                         field.data.mousedown(this, event);
//                       });
//                     },
//                     update: function() {
//                       this.element.textContent = rowIndex+1;
//                     }
//                   });
//
//                 } else if (column.type === "delete") {
//
//                   table.children.push({
//                     class: "td array-delete",
//                     child: {
//                       tag: "button",
//                       init: function(button) {
//                         this.element.addEventListener("click", function() {
//                           let value = field.getValue();
//                           field.setValue(value.filter(function(item, index) {
//                             return index !== rowIndex;
//                           }));
//                           field.triggerEvent("render", false, null, true);
//                         })
//                         KarmaFieldsAlpha.getAsset(KarmaFieldsAlpha.icons_url+"/trash.svg").then(function(result) {
//                           button.element.innerHTML = result;
//                         });
//                       },
//                       render: null // -> render would detroy svg
//                       // function(clean) {
//                       //   let button = this;
//                       //   KarmaFieldsAlpha.getAsset(KarmaFieldsAlpha.icons_url+"/trash.svg").then(function(result) {
//                       //     button.element.innerHTML = result;
//                       //
//                       //     // requestAnimationFrame(function() {
//                       //     //   button.element.innerHTML = result;
//                       //     // });
//                       //   });
//                       // }
//                     }
//                   });
//
//                 } else if (column.type === "condition") {
//
//                   table.children.push({
//                     class: "td table-filter condition-cell",
//                     update: function(td) {
//                       let filterField = field.data.createCellField(column.field, rowIndex);
//                       filterField.events.change = function(cellField) {
//                         field.data.setCellValue(rowIndex, column.field.key, filterField.getValue());
//                         console.log(field.getValue());
//                         td.render();
//
//                       }
//                       this.children = [
//                         filterField.build(),
//                         {
//                           class: "condition-cell-child",
//                           update: function() {
//                             let filterValue = filterField.getValue();
//                             let cellResource = column.conditions[filterValue];
//                             if (filterValue && cellResource) {
//                               let cellField = field.data.createCellField(cellResource, rowIndex);
//                               cellField.setValue(field.data.getCellValue(rowIndex, cellResource.key), "set");
//                               cellField.events.change = function(cellField) {
//                                 field.data.setCellValue(rowIndex, cellResource.key, cellField.getValue());
//                                 td.render();
//                               }
//                               this.child = cellField.build();
//                             }
//                           }
//                         }
//                       ];
//                     }
//                   });
//
//                 } else if (column.field && column.field.key) {
//
//                   // let childField = rowField.getDescendant(column.field.key) || rowField.createChild(column.field);
//
//                   // let childField = KarmaFieldsAlpha.createField(column.field);
//                   let childField = field.createChild(column.field);
//                   childField.setValue(field.data.unique ? rowValue : rowValue[column.field.key]);
//                   childField.events.change = function(cellField) {
//                     let value = field.getValue();
//
//                     if (field.data.unique) {
//                       value[rowIndex] = childField.getValue();
//                     } else {
//                       if (!value[rowIndex] || typeof value[rowIndex] !== "object") {
//                         value[rowIndex] = {};
//                       }
//                       value[rowIndex][column.field.key] = childField.getValue();
//                     }
//                     field.setValue(value, "change");
//                   }
//
//                   // childField.events.fetch = function(target) {
//                   //   return field.triggerEvent("fetch", true, childField);
//                   // }
//                   table.children.push({
//                     class: "td array-cell",
//                     child: childField.build()
//                   });
//
//                 }
//
//               });
//
//
//               // // trash column
//               // table.children.push({
//               //   class: "td array-delete",
//               //   child: {
//               //     tag: "button",
//               //     init: function() {
//               //       this.element.addEventListener("click", function() {
//               //         let value = field.getValue();
//               //         field.setValue(value.filter(function(item, index) {
//               //           return index !== rowIndex;
//               //         }));
//               //         field.triggerEvent("render", false, null, true);
//               //       })
//               //     },
//               //     render: function(button) {
//               //       KarmaFieldsAlpha.getAsset(KarmaFieldsAlpha.icons_url+"/trash.svg").then(function(result) {
//               //         requestAnimationFrame(function() {
//               //           button.element.innerHTML = result;
//               //         });
//               //       });
//               //     }
//               //   }
//               // });
//
//             });
//
//           }
//         }
//       },
//       {
//         class:"array-more",
//         child: field.data.more.build()
//       }
//     ]
//   };
// }
