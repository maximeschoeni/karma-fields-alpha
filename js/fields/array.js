KarmaFieldsAlpha.fields.array = class extends KarmaFieldsAlpha.fields.field {

  // constructor(resource, domain) {
  //   super(resource, domain);
  //
  //   this.datatype = "array";
  //
  // }

  getEmpty() {
    return {};
  }

  prepare(value) {
    if (Array.isArray(value)) {
      return value;
    }
    return [value];
  }

  stringify(value) {
    return JSON.stringify(value);
  }

  parse(value) {
    return JSON.parse(value);
  }

  getValueAsync() {
    return Promise.all(this.children.map(child => child.getValueAsync()));
  }

  getFromPath() {
    return;
  }

  saveValue(values, update, noBub) {
    this.children = [];
    values.forEach(value => {
      const rowField = this.createChild({
        type: "arrayRow"
      });
      rowField.create(this.resource.columns);
      rowField.initValue(value);
    });
    return super.saveValue(values, update, noBub);
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


  getColumns() {
    if (!this.columns) {
      this.columns = (this.resource.columns || []).slice();
      if (this.resource.index && !this.resource.columns.some(column => column.type === "index")) {
        this.columns.unshift({
          type: "index",
          width: "30px"
        });
      }
      if (!this.resource.columns.some(column => column.type === "delete")) {
        this.columns.push({
          type: "delete",
          width: "30px"
        });
      }
    }
    return this.columns;
  }

  hasHeader() {
    return this.getColumns().some(function(column) {
      return column.header || column.field && column.field.label;
    });
  }

  async swap(index1, index2) {
    const value = await this.getValueAsync();
    const item1 = value[index1];
    value[index1] = value[index2];
    value[index2] = item1;
    await this.saveValue(value, true);
    return value;
  }

  async delete(rowIndex) {
    let values = await field.getValueAsync();
    this.backup();
    values = values.filter((item, index) => index !== rowIndex);
    await this.saveValue(values, true);
    return values;
  }

  async add() {
    this.backup();
    let values = await this.getValueAsync();
    values.push({});
    await this.saveValue(values, true);
    return values;
  }

  buildContent(values) {
    return [
      {
        class: "array",
        update: table => {
          table.children = [];
          if (!this.children.length) {
            table.element.classList.add("empty");
          }
          let manager = new KarmaFieldsAlpha.Orderer(table.element);

          manager.events.change = (index, originalIndex) => {
            this.swap(index, originalIndex);
          }

          // CSS Grid Layout
          table.element.style.gridTemplateColumns = this.getColumns().map(column => column.width || "1fr").join(" ");

          // Header
          if (this.children.length && this.hasHeader()) {
            table.children = table.children.concat(this.getColumns().map(column => {
              return {
                class: "th",
                init: th => {
                  th.element.textContent = column.header || column.field && column.field.label || "";
                }
              }
            }));
          }

          // Body
          if (this.children.length) {

            this.children.forEach((rowField, rowIndex) => {

              // const rowField = new KarmaFieldsAlpha.fields.container({
              //   key: rowIndex
              // }, this.domain, this);

              table.children = table.children.concat(this.getColumns().map((column, colIndex) => {

                if (column.type === "index") {

                  return {
                    class: "td array-index",
                    init: td => {
                      manager.registerItem(td.element, colIndex, rowIndex, "index");
                    },
                    update: td => {
                      td.element.textContent = rowIndex+1;
                    }
                  };

                } else if (column.type === "delete") {

                  return {
                    class: "td array-delete",
                    init: td => {
                      manager.registerItem(td.element, colIndex, rowIndex, "delete");
                    },
                    child: {
                      tag: "button",
                      init: button => {
                        button.element.onclick = event => {
                          this.delete(rowIndex)
                        };
                        button.element.textContent = "Delete";
                      },
                      // child: KarmaFieldsAlpha.fields.icon.create("trash.svg")
                    }
                  }

                } else if (column.field && column.field.key) {


                  // childField.events.change = function(cellField) {
                  //   let value = field.getValue();
                  //
                  //   if (field.hasUniqueColumn()) {
                  //     value[rowIndex] = childField.getValue();
                  //   } else {
                  //     if (!value[rowIndex] || typeof value[rowIndex] !== "object") {
                  //       value[rowIndex] = {};
                  //     }
                  //     value[rowIndex][column.field.key] = childField.getValue();
                  //   }
                  //   field.triggerEvent("history", true);
                  //   field.setValue(value);
                  //   field.triggerEvent("change", true);
                  // }


                  return {
                    class: "td array-cell",
                    init: td => {
                      manager.registerItem(td.element, colIndex, rowIndex, "field");
                    },
                    child: rowField.getChild(column.field.key).build()
                  };
                }
              }));
            });
          }
        }
      },
      {
        class:"array-more",
        child: {
          tag: "button",
          init: button => {
            button.element.textContent = this.resource.add_button_name || "Add Row";
            button.element.onclick = event => {
              event.preventDefault();
              this.add();
              // field.triggerEvent("history", true);
              // let value = field.getValue();
              // field.setValue(value.concat([field.data.unique ? "" : {}]));
              // field.triggerEvent("change", true);
              // container.render(true);
            };
          }
        }
      }
    ];
  }


  build() {
    return {
      class: "karma-field-array",
      init: container => {
        if (this.resource.style) {
					container.element.style = this.resource.style;
				}
      },
      update: container => {

        this.onSet = value => {
          container.children = this.buildContent(value);
          container.render(true);
        }
        this.onLoad = loading => {
          //container.element.classList.toggle("loading", loading);
        }

        this.update();
      }
    };
  }

}


KarmaFieldsAlpha.fields.arrayRow = class extends KarmaFieldsAlpha.fields.container {

  async getValueAsync() {
		const values = await Promise.all(this.children.map(child => child.getValueAsync()));
    return values.reduce((acc, value, index) => {
      const child = this.children[index];
      acc[child.resource.key] = value;
      return acc;
    }, {});
	}

  create(columns) {
    columns.forEach(column => {
      if (column.field) {
        this.createChild(column.field);
      }
    });
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
