
KarmaFieldsAlpha.fields.array = class extends KarmaFieldsAlpha.fields.field {

  // getDeltaValue(keys) {
  //   // let values = this.getValue();
  //   let values = super.getDeltaValue();
  //   if (values) {
  //     values = JSON.parse(values);
  //
  //     let index = keys[0];
  //     let key = keys[1];
  //     if (values[index]) {
  //       return values[index][key];
  //     }
  //   }
  // }
  // setDeltaValue(value, keys) {
  //   // let values = this.getValue();
  //   let values = super.getDeltaValue();
  //   if (values === undefined) {
  //     values = [];
  //   } else {
  //     values = JSON.parse(values);
  //   }
  //
  //   let index = keys[0];
  //   let key = keys[1];
  //   if (!values[index]) {
  //     values[index] = {};
  //   }
  //   values[index][key] = value;
  //   // this.setValue(values);
  //
  //   super.setDeltaValue(JSON.stringify(values));
  // }
  //
  //
  //
  // getValue() {
  //
  //
  //   let value = super.getDeltaValue();
  //   if (value === undefined) {
  //     value = super.getOriginal();
  //   }
  //   value = JSON.parse(value);
  //   return value;
  // }
  //
  // setValue(values) {
  //   if (values !== undefined) {
  //     super.setValue(JSON.stringify(values));
  //   }
  // }
  //
  // getFormOriginal(keys) {
  //   // let values = this.getOriginal();
  //   let values = super.getFormOriginal();
  //   if (values) {
  //     values = JSON.parse(values);
  //     let index = keys[0];
  //     let key = keys[1];
  //     if (values[index]) {
  //       return values[index][key];
  //     }
  //   }
  // }
  //
  // setFormOriginal(value, keys) {
  //   // let values = this.getOriginal();
  //   let values = super.getFormOriginal();
  //   if (values) {
  //     values = JSON.parse(values);
  //   } else {
  //     values = [];
  //   }
  //
  //   let index = keys[0];
  //   let key = keys[1];
  //   if (!values[index]) {
  //     values[index] = {};
  //   }
  //   values[index][key] = value;
  //   // this.setOriginal(values);
  //   super.setFormOriginal(JSON.stringify(values));
  // }
  //
  //
  //
  // async getRemoteValue(keys) {
  //   let values = await super.getRemoteValue();
  //   if (values) {
  //     let index = keys[0];
  //     let key = keys[1];
  //     if (values[index]) {
  //       return values[index][key];
  //     }
  //   }
  // }
  //
  // async fetchValue() {
  //   let value = await super.getRemoteValue();
  //   value = this.prepare(value);
  //   if (value !== undefined) {
  //     value = this.convert(value);
  //     // this.setOriginal(value);
  //     super.setFormOriginal(JSON.stringify(value));
  //   }
  //   return value;
  // }
  //

  // async getValue(pathKeys) {
  //   // pathKeys = this.getKeyPath(pathKeys);
  //
  //   let array = await this.getArray();
	// 	// array = JSON.parse(value);
  //   return KarmaFieldsAlpha.DeepObject.get(array, pathKeys);
  // }
  //
  // async setValue(value, keys) {
  //   let array = await this.getArray();
	// 	// array = JSON.parse(value);
	// 	KarmaFieldsAlpha.DeepObject.assign(array, keys, value);
	// 	this.setArray(array);
  // }

  initField() {
    this.registerType("json");
	}

  async fetchValue(pathKeys) {
    // pathKeys = this.getKeyPath(pathKeys);

    let array = await super.fetchValue(undefined, "array") || [];
		// array = JSON.parse(value);

    if (pathKeys && pathKeys.length) {
      return KarmaFieldsAlpha.DeepObject.get(array, pathKeys);
    }

    return array;
  }

  // async editValue(value, keys) {
  //   // let array = await this.fetchArray();
	// 	// // array = JSON.parse(value);
	// 	// KarmaFieldsAlpha.DeepObject.assign(array, keys, value);
	// 	await this.setValue(value);
  //   return this.edit();
  // }

  async setValue(value, keys) {
    if (keys && keys.length) {
      let array = await super.fetchValue();
      KarmaFieldsAlpha.DeepObject.assign(array, keys, value);
  		return super.setValue(array);
		}
    return super.setValue(value);
  }


  async edit() {
    await super.edit();
    return this.render();
  }


  // async update() {
  //   // let originalValue = this.getFormOriginal(null, true);
  //   //
  //   // if (originalValue === undefined) {
  //   //   await this.downloadValue();
  //   //   originalValue = this.getFormOriginal(null, true);
  //   // }
  //   //
  //   // let deltaValue = this.getDeltaValue(null, true);
  //   //
  //   // let value = deltaValue ?? originalValue;
  //   //
  //   // if (value === undefined) {
  //   //   value = await this.getDefault();
  //   // }
  //
  //   let value = this.getArray();
  //
  //   return value;
  // }


  // getOriginal() {
  //   let value = super.getOriginal();
  //   if (value !== undefined) {
  //     value = JSON.parse(value);
  //   }
  //   return value;
  // }
  //
  // setOriginal(values) {
  //   if (values !== undefined) {
  //     super.setOriginal(JSON.stringify(values));
  //   }
  // }

  // convert(value) {
  //   if (value && typeof value === "string") {
  //     return JSON.parse(value);
  //   }
  //   return value || [];
  // }
  //
  // getEmpty() {
  //   return [];
  // }



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
          width: "50px"
        });
      }
    }
    return this.columns;
    // return (this.resource.columns || []).filter(column => column.field);
  }

  hasHeader() {
    return this.getColumns().some(function(column) {
      return column.header || column.field && column.field.label;
    });
  }

  hasIndex() {
    return true;
  }

  hasDelete() {
    return true;
  }

  async swap(index1, index2) {
    // let values = super.getDeltaValue();
    // if (values) {
    //   values = JSON.parse(values);
    // } else {
    //   values = [];
    // }
    //
    const values = await this.fetchArray();
    const item1 = values[index1];
    values[index1] = values[index2];
    values[index2] = item1;
    return this.setValue(values);
    //
    // super.setDeltaValue(JSON.stringify(values));
  }

  async delete(rowIndex) {
    // let values = field.getValue();
    // let values = super.getDeltaValue();
    // if (values) {
    //   values = JSON.parse(values);
    // } else {
    //   values = [];
    // }
    //
    // values = values.filter((item, index) => index !== rowIndex);
    //
    // // this.backup();
    //
    // super.setDeltaValue(JSON.stringify(values));

    const values = await this.fetchArray();
    values.splice(rowIndex, 1);
    return this.setValue(values);
  }

  async add() {
    // this.backup();
    // let values = this.getValue();
    // values.push({});
    // this.setValue(values);

    // let values = super.getDeltaValue();
    // if (values) {
    //   values = JSON.parse(values);
    // } else {
    //   values = [];
    // }
    // values.push({});
    // super.setDeltaValue(JSON.stringify(values));

    // let value = this.getDeltaValue(null, true) ?? this.getFormOriginal(null, true) ?? {};
    // value = Object.values(value);
    //
    // const rowField = this.getChild(value.length.toString()) || this.createChild({
    //   key: value.length.toString(),
    //   type: "container"
    // });
    //
    // this.getColumns().forEach((column) => {
    //   if (column.field && column.field.key) {
    //     const cellField = rowField.getChild(column.field.key) || rowField.createChild(column.field);
    //     cellField.getDefault();
    //     cellField.setDeltaValue();
    //
    //   }
    // }

    const values = await this.fetchArray();
    values.push({});
    return this.setValue(values);
  }

  buildContent(values) {
    return [
      {
        class:"array-table-container",
        update: container => {
          container.children = values.length && [{
            class: "array table",
            init: table => {
              this.manager = new KarmaFieldsAlpha.Orderer(table.element);

              this.manager.events.change = async (index, originalIndex) => {
                await this.swap(index, originalIndex);
                return super.edit();
              }
              if (this.resource.gridTemplateRows) {
                table.element.style.gridTemplateRows = this.resource.gridTemplateRows;
              }
              if (this.resource.gridAutoRows) {
                table.element.style.gridAutoRows = this.resource.gridAutoRows;
              }
            },
            update: table => {
              table.children = [];
              // if (!this.children.length) {
              //   table.element.classList.add("empty");
              // }



              // CSS Grid Layout
              table.element.style.gridTemplateColumns = this.getColumns().map(column => column.width || "1fr").join(" ");



              // Header

              if (this.hasHeader()) {
                this.getColumns().forEach(column => {
                  table.children.push({
                    class: "th",
                    init: th => {
                      th.element.textContent = column.header || column.field && column.field.label || "";
                    }
                  });
                });
              }

              // Body

              if (values.length) {


                values.forEach((value, rowIndex) => {

                  const rowField = this.getChild(rowIndex.toString()) || this.createChild({
                    key: rowIndex.toString(),
                    type: "container"
                  });

                  let colIndex = 0;

                  if (this.hasIndex()) {

                    table.children.push({
                      class: "td array-index",
                      init: td => {
                        this.manager.registerItem(td.element, 0, rowIndex, "index");
                      },
                      update: td => {
                        td.element.textContent = rowIndex+1;
                      }
                    });

                    colIndex++;
                  }

                  this.getColumns().filter(column => column.field).forEach((column, index) => {

                    const cellField = rowField.children[index] || rowField.createChild(column.field);

                    table.children.push({
                      class: "td array-cell",
                      init: td => {
                        this.manager.registerItem(td.element, colIndex, rowIndex, "field");
                      },
                      child: cellField.build()
                    });

                    colIndex++;
                  });

                  if (this.hasDelete()) {

                    table.children.push({
                      class: "td array-delete",
                      init: td => {
                        this.manager.registerItem(td.element, colIndex, rowIndex, "delete");
                      },
                      child: {
                        tag: "button",
                        init: button => {
                          button.element.onclick = async (event) => {
                            event.preventDefault();
                            this.backup();
                            button.element.classList.add("loading");
                            await this.delete(rowIndex);
                            await this.edit();
                            await this.render();
                            button.element.classList.remove("loading");

                          };
                          button.element.textContent = this.resource.delete_button_name || "Delete";
                        },
                        // child: KarmaFieldsAlpha.fields.icon.create("trash.svg")
                      }
                    });

                    colIndex++;
                  }

                });
              }
            }
          }] || [];
        }
      },
      {
        class:"array-more",
        child: {
          tag: "button",
          init: button => {
            button.element.textContent = this.resource.add_button_name || "Add Row";
            button.element.onclick = async (event) => {
              event.preventDefault();
              // debugger;

              this.backup();
              button.element.classList.add("loading");
              await this.add();
              await this.render();
              await this.edit();
              button.element.classList.remove("loading");

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
        this.render = container.render;
      },
      update: async container => {

        const values = await this.fetchValue();

        container.children = this.buildContent(values);


        // this.onSet = value => {
        //   container.children = this.buildContent(value);
        //   container.render(true);
        // }
        // this.onLoad = loading => {
        //   //container.element.classList.toggle("loading", loading);
        // }


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
