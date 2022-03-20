
KarmaFieldsAlpha.fields.array = class extends KarmaFieldsAlpha.fields.field {

  constructor(...args) {
    super(...args);



    // compat
    // this.resource.index = this.resource.columns && this.resource.columns.find(column => column.type === "index");
    // this.resource.delete = this.resource.columns && this.resource.columns.find(column => column.type === "delete");
    //
    //
    //
    // this.resource.columns = (this.resource.columns || []).filter(column => column.field);

	}

  // async fetchValue(expectedType, ...path) {
  //
  //   let array = await super.fetchValue() || [];
  //
  //   if (path.length) {
  //     array = KarmaFieldsAlpha.DeepObject.get(array, ...path);
  //     // array = this.format(array, expectedType);
  //   }
  //
  //   return array;
  // }

  async fetchValue(expectedType, ...path) {

    let array = await super.fetchValue() || [];

    if (path.length) {
      array = KarmaFieldsAlpha.DeepObject.get(array, ...path);
    }

    return array;
  }

  async edit(value, ...path) {

    switch (value) {

      case "add":
        await this.add();
        break;

      case "delete":
        await this.delete(Number(path[0]));
        break;

      case "render-table":
        await this.render();
        break;

    }

    await super.edit(value, ...path);

  }

  // async setValue(deprec, value, ...path) {
  //
  //   if (path.length) {
  //
  //     const array = await this.fetchValue() || [];
  //     KarmaFieldsAlpha.DeepObject.assign(array, value, ...path);
  //     await super.setValue(null, array);
  //
  //   } else {
  //
  //     await super.setValue(null, value);
  //
  //   }
  //
  // }

  setValue(deprec, value, ...path) {


    if (path.length) {

      this.promise = Promise.resolve(this.promise).then(() => this.fetchValue() || []).then(array => {
        KarmaFieldsAlpha.DeepObject.assign(array, value, ...path);
        super.setValue(null, array);
      });

      // const array = await this.fetchValue() || [];
      // KarmaFieldsAlpha.DeepObject.assign(array, value, ...path);
      // await super.setValue(null, array);

    } else {

      super.setValue(null, value);

    }

  }

  async isModified(...path) {

		if (this.resource.key && path.length) {

			return super.isModified();

		}

		return super.isModified(...path);
	}

  write(...path) {
    return super.write();
  }

  async swap(index1, index2) {
    await this.write();
    this.nextup();
    const values = await this.fetchValue();
    const item1 = values[index1];
    values[index1] = values[index2];
    values[index2] = item1;
		await this.setValue(null, values);
    await this.edit();
  }

  async add() {
    await this.write();
    this.nextup();
    const values = await this.fetchValue() || [];
    values.push({});
    await super.setValue(null, values);
    await this.render(true);
  }

  async delete(index) {
    await this.write();
    this.nextup();
    const values = await this.fetchValue() || [];
    values.splice(index, 1);
    await this.setValue(null, values);
    await this.render(true);
  }



  build() {
    return {
      class: "array",
      init: table => {
        this.render = table.render;
        // this.manager = new KarmaFieldsAlpha.Orderer(table.element);
        // this.manager.events.change = async (index, originalIndex) => {
        //   await this.swap(index, originalIndex);
        //   await this.edit();
        // }
      },
      update: async table => {
        const values = await this.fetchValue() || [];
        const hasHeader = this.resource.columns.some(column => column.header);

        table.children = [
          ...(values.length && hasHeader && [
            {
              class: "th",
              init: th => {
                th.element.style.order = "-1";
              }
            },
            ...this.resource.columns.map(column => {
              return {
                class: "th",
                init: th => {
                  th.element.textContent = column.header || "";
                  th.element.style.order = "-1";
                }
              }
            }),
            {
              class: "th",
              init: th => {
                th.element.style.order = "-1";
              }
            }
          ] || []),
          ...values.reduce((array, item, index) => {
            const row = this.createChild({
              key: index.toString(),
              type: "field",
            });
            return [
              ...array,
              // ...this.createChild({
              //   key: index.toString(),
              //   type: "arrayRow",
              //   columns: this.resource.columns,
              //   index: this.resource.index || {},
              //   delete: this.resource.delete || {}
              // }).buildChildren()
              {
                class: "td array-index",
                init: td => {
                  // this.manager.registerItem(td.element, 0, index, "index");
                  if (this.resource.index && this.resource.index.style) {
                    td.element.style = this.resource.index.style;
                  }
                  // td.element.onmousedown = event => {
                  //   const dragManager = new this.constructor.Dragger();
                  //   dragManager.index = index;
                  //   dragManager.container = table.element;
                  //   dragManager.numCol = this.resource.columns.length + 2;
                  //   dragManager.numRow = values.length;
                  //   dragManager.offsetRow = this.resource.columns.some(column => column.header) ? 1 : 0;
                  //   dragManager.onSwap = async (index1, index2) => {
                  //     await this.swap(index1, index2);
                  //     table.render();
                  //   };
                  //   dragManager.mousedown(event);
                  // }

                  td.element.onmousedown = event => {
                    new this.constructor.Dragger(
                      index,
                      table.element,
                      // this.resource.columns.length + 2,
                      // values.length,
                      // hasHeader ? 1 : 0,
                      // 0,
                      async (index1, index2) => {
                        await this.swap(index1, index2);
                        table.render();
                      }
                    );
                    // dragManager.index = index;
                    // dragManager.container = table.element;
                    // dragManager.numCol = this.resource.columns.length + 2;
                    // dragManager.numRow = values.length;
                    // dragManager.offsetRow = this.resource.columns.some(column => column.header) ? 1 : 0;
                    // dragManager.onSwap = async (index1, index2) => {
                    //   await this.swap(index1, index2);
                    //   table.render();
                    // };
                    // dragManager.mousedown(event);
                  }
                },
                update: td => {
                  td.element.textContent = index+1;
                  // td.element.style.transform = "none";
                  td.element.style.order = index.toString();
                }
              },
              ...this.resource.columns.map((column, colIndex) => {
                return {
                  class: "td array-cell karma-field-frame karma-field-"+column.field.type,
                  init: td => {
                    // this.manager.registerItem(td.element, colIndex+1, index, "field");
                    if (column.style) {
                      td.element.style = column.style;
                    }
                  },
                  update: td => {
                    // td.element.style.transform = "none";
                    td.element.style.order = index.toString();
                  },
                  child: row.createChild({
                    ...column.field,
                    id: colIndex.toString()
                  }).build()
                };
              }),
              {
                class: "td array-delete",
                init: td => {
                  // this.manager.registerItem(td.element, this.resource.columns.length+1, index, "delete");
                  if (this.resource.delete && this.resource.delete.style) {
                    td.element.style = this.resource.delete.style;
                  }
                },
                update: td => {
                  // td.element.style.transform = "none";
                  td.element.style.order = index.toString();
                },
                child: row.createChild({
                  type: "button",
                  value: "delete",
                  title: this.resource.delete_button_name || this.resource.delete && this.resource.delete.name || "Delete"
                }).build()
              }
            ];
          }, []),
          {
            class: "td array-more",
            init: more => {
              more.element.style.order = "99999";
            },
            child: this.createChild({
              type: "button",
              id: "add",
              value: "add",
              title: this.resource.add_button_name || "Add Row"
            }).build()
          }
        ];

        table.element.style.gridTemplateColumns = [
          this.resource.index && this.resource.index.width || "100px",
          ...this.resource.columns.map(column => column.width || "auto"),
          this.resource.delete && this.resource.delete.width || "auto"
        ].join(" ");

      }
    };
  }



}


// KarmaFieldsAlpha.fields.arrayRow = class extends KarmaFieldsAlpha.fields.field {
//
//   constructor(...args) {
//     super(...args);
//
//     this.cells = {};
// 	}
//
//   // async setValue(deprec, value, ...path) {
//   //
//   //   super.setValue(null, value, "content", ...path);
//   //
//   // }
//
//   async edit(value, ...path) {
//
//     switch(value) {
//
//       case "render-row":
//         await Promise.all(Object.values(this.cells).map(callback => callback()));
//         break;
//
//       // case "delete":
//       //   await this.write();
//       //   this.nextup();
//       //   await super.setValue(null, this.resource.key, "delete");
//       //   break;
//
//       default:
//         await super.edit(value, ...path);
//         break;
//
//     }
//
//   }
//
//   buildChildren() {
//
//     return [
//       {
//         class: "td array-index",
//         init: td => {
//           this.parent.manager.registerItem(td.element, 0, Number(this.resource.key), "index");
//           if (this.resource.index.style) {
//             td.element.style = this.resource.index.style;
//           }
//         },
//         update: td => {
//           td.element.textContent = Number(this.resource.key)+1;
//         }
//       },
//       ...this.resource.columns.map((column, colIndex) => {
//         return {
//           class: "td array-cell karma-field-frame karma-field-"+column.field.type,
//           init: td => {
//             this.cells[colIndex] = td.render;
//             this.parent.manager.registerItem(td.element, colIndex+1, Number(this.resource.key), "field");
//             if (column.style) {
//               td.element.style = column.style;
//             }
//           },
//           child: this.createChild({
//             ...column.field,
//             id: colIndex.toString()
//           }).build()
//         };
//       }),
//       {
//         class: "td array-delete",
//         init: td => {
//           this.parent.manager.registerItem(td.element, this.resource.columns.length+2, Number(this.resource.key), "delete");
//           if (this.resource.delete.style) {
//             td.element.style = this.resource.delete.style;
//           }
//         },
//         child: this.createChild({
//           type: "button",
//           value: "delete",
//           title: this.resource.delete_button_name || this.resource.delete.name || "Delete"
//         }).build()
//       }
//     ];
//   }
//
// }


KarmaFieldsAlpha.fields.array.Dragger = class {

  constructor(index, container, onSwap) {
    // constructor(index, container, numCol, numRow, offsetRow, offsetCol, onSwap) {

    this.index = index;
    this.container = container;
    // this.numCol = numCol;
    // this.numRow = numRow;
    // this.offsetRow = offsetRow;
    // this.offsetCol = offsetCol;
    this.onSwap = onSwap;

  // }
  // mousedown(event) {

    this.elements = Array.from(container.children);

    this.pointerX = event.clientX;
    this.pointerY = event.clientY;
    this.mouseX = this.pointerX;
    this.mouseY = this.pointerY;
    this.scrollContainer = KarmaFieldsAlpha.DOM.getClosest(this.container, element => element.classList.contains("karma-scroll-container")) || document.documentElement;
    this.scrollTop = this.scrollContainer.scrollTop;

    console.log("scroll start", this.scrollContainer.scrollTop, document.documentElement.scrollHeight);
    this.scrollDiffY = 0;
    this.currentIndex = this.index;
    // this.grid = new KarmaFieldsAlpha.fields.array.Grid(this.container, this.numCol, this.numRow, this.rowOffset);
    this.row = this.elements.filter(element => element.style.order === this.index.toString());


    this.row[0].classList.add("grabbing");
    this.container.classList.add("dragging");

    this.row.forEach(element => {
      element.classList.add("drag");
    });

    const mousemove = event => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
      this.update();
    }

    const scroll = event => {
      this.scrollDiffY = this.scrollContainer.scrollTop - this.scrollTop;
      console.log("scroll", this.scrollDiffY, this.scrollContainer.scrollTop, document.documentElement.scrollHeight);
      this.update();
    }

    const mouseup = event => {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
      window.removeEventListener("scroll", scroll);
      this.complete();
    }

    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
    window.addEventListener("scroll", scroll);

  }

  update() {

    let diffX = this.mouseX - this.pointerX;
    let diffY = this.mouseY - this.pointerY + this.scrollDiffY;

    let prevRow = this.elements.filter(element => element.style.order === (this.currentIndex-1).toString());
    let nextRow = this.elements.filter(element => element.style.order === (this.currentIndex+1).toString());


    if (prevRow.length && diffY < -prevRow[0].clientHeight/2) {
      // swap:
      console.log("swap top", diffY, prevRow[0].clientHeight, this.mouseY, this.pointerY, this.scrollDiffY);
      prevRow.forEach(element => {
        element.style.order = this.currentIndex.toString();
      });
      this.currentIndex--;
      this.row.forEach(element => {
        element.style.order = this.currentIndex.toString();
      });
      this.pointerY -= prevRow[0].clientHeight;
      diffY = this.mouseY - this.pointerY + this.scrollDiffY;
      console.log(diffY, prevRow[0].clientHeight);
    }

    if (nextRow.length && diffY > nextRow[0].clientHeight/2) {
      // swap:

      console.log("swap bottom", diffY, nextRow[0].clientHeight, this.mouseY, this.pointerY, this.scrollDiffY);
      nextRow.forEach(element => {
        element.style.order = this.currentIndex.toString();
      });
      this.currentIndex++;
      this.row.forEach(element => {
        element.style.order = this.currentIndex.toString();
      });
      this.pointerY += nextRow[0].clientHeight;
      diffY = this.mouseY - this.pointerY + this.scrollDiffY;
    }

    this.row.forEach(element => {
      element.style.transform = "translate("+diffX+"px, "+diffY+"px)";
    });

  }

  complete() {
    this.row.forEach(element => {
      element.classList.remove("drag");
      element.style.transform = "none";
    });

    this.row[0].classList.remove("grabbing");
    this.container.classList.remove("dragging");

    if (this.currentIndex !== this.index && this.onSwap) {
      setTimeout(async () => {
        this.onSwap(this.index, this.currentIndex);
      }, 500);
    }

  }

}




// KarmaFieldsAlpha.fields.array.Dragger = class {
//
//   mousedown(event) {
//
//     this.pointerX = event.clientX;
//     this.pointerY = event.clientY;
//     this.mouseX = this.pointerX;
//     this.mouseY = this.pointerY;
//     this.scrollContainer = KarmaFieldsAlpha.DOM.getClosest(this.container, element => element.classList.contains("karma-scroll-container")) || document.documentElement;
//     this.scrollTop = this.scrollContainer.scrollTop;
//     this.scrollDiffY = 0;
//     this.grid = new KarmaFieldsAlpha.fields.array.Grid(this.container, this.numCol, this.numRow, this.rowOffset);
//     this.currentRow = this.grid.getRow(this.index);
//     this.currentRow.elements[0].classList.add("grabbing");
//     this.container.classList.add("dragging");
//
//     this.currentRow.elements.forEach(function(element) {
//       element.classList.add("drag");
//     });
//
//     const mousemove = event => {
//       this.mouseX = event.clientX;
//       this.mouseY = event.clientY;
//       this.update();
//     }
//
//     const scroll = event => {
//       this.scrollDiffY = this.scrollContainer.scrollTop - this.scrollTop;
//       this.update();
//     }
//
//     const mouseup = event => {
//       window.removeEventListener("mousemove", mousemove);
//       window.removeEventListener("mouseup", mouseup);
//       window.removeEventListener("scroll", scroll);
//       this.complete();
//     }
//
//     window.addEventListener("mousemove", mousemove);
//     window.addEventListener("mouseup", mouseup);
//     window.addEventListener("scroll", scroll);
//
//   }
//
//   complete() {
//     this.renderRow(this.currentRow);
//     this.currentRow.elements.forEach(cell => {
//       // cell.style.transform = "none";
//       cell.classList.remove("drag");
//     });
//
//     this.currentRow.elements[0].classList.remove("grabbing");
//     this.grid.container.classList.remove("dragging");
//
//     const currentIndex = this.grid.getRowIndex(this.currentRow);
//
//     if (currentIndex !== this.currentRow.index && this.onSwap) {
//       setTimeout(async () => {
//         this.onSwap(this.currentRow.index, currentIndex);
//       }, 500);
//     }
//
//   }
//
//   update() {
//
//     let diffX = this.mouseX - this.pointerX;
//     let diffY = this.mouseY - this.pointerY + this.scrollDiffY;
//
//     let prevRow = this.grid.getPrevRow(this.currentRow);
//     let nextRow = this.grid.getNextRow(this.currentRow);
//
//
//     if (prevRow && diffY < -prevRow.height/2) {
//       this.grid.swap(prevRow, this.currentRow);
//       this.pointerY -= prevRow.height;
//       diffY = this.mouseY - this.pointerY + this.scrollDiffY;
//       this.renderRow(prevRow);
//     }
//
//     if (nextRow && diffY > nextRow.height/2) {
//       this.grid.swap(nextRow, this.currentRow);
//       this.pointerY += nextRow.height;
//       diffY = this.mouseY - this.pointerY + this.scrollDiffY;
//       this.renderRow(nextRow);
//     }
//
//     this.renderRow(this.currentRow, diffX, diffY);
//
//   }
//
//   renderRow(row, diffX = 0, diffY = 0) {
//     const x = this.grid.getX(row) - row.x + diffX;
//     const y = this.grid.getY(row) - row.y + diffY;
//
//     row.elements.forEach(element => {
//       element.style.transform = "translate("+x+"px, "+(y)+"px)";
//     });
//   }
//
//
// }

// KarmaFieldsAlpha.fields.array.Grid = class {
//
//   constructor(container, numCol, numRow, offsetRow = 0) {
//
//
//     this.container = container;
//     this.rows = [];
//     const elements = Array.from(container.children);
//     // let numRow = Math.floor(elements.length/numCol);
//     let y = 0;
//     let index = 0;
//
//     for (let i = offsetRow; i < numRow; i++) {
//       const rowElements = elements.slice(i*numCol, (i+1)*numCol);
//
//       const firstElement = rowElements[0];
//       const height = firstElement.clientHeight;
//       this.rows.push({
//         index: index,
//         elements: rowElements,
//         height: height,
//         x: 0,
//         y: y
//       });
//       y += height+1;
//       index++;
//     }
//
//   }
//
//   getRow(index) {
//     return this.rows[index];
//   }
//
//   getNextRow(row) {
//     const index = this.rows.indexOf(row);
//     return index > -1 && this.rows[index+1];
//   }
//
//   getPrevRow(row) {
//     const index = this.rows.indexOf(row);
//     return index > -1 && this.rows[index-1];
//   }
//
//   getRowIndex(row) {
//     return this.rows.indexOf(row);
//   }
//
//   swap(row1, row2) {
//     const index1 = this.rows.indexOf(row1);
//     const index2 = this.rows.indexOf(row2);
//
//     // const row1 = this.rows[index1];
//     this.rows[index1] = row2;
//     this.rows[index2] = row1;
//   }
//
//   getX(row) {
//     return 0;
//   }
//
//   getY(row) {
//     let y = 0;
//     let i = 0;
//     while(this.rows[i] && this.rows[i] !== row) {
//       y += this.rows[i].height;
//       i++;
//     }
//     return y;
//   }
//
//
//
// }




KarmaFieldsAlpha.DOM = class {

  static getClosest(element, callback) {
    if (callback(element)) {
      return element;
    } else if (element.parentElement) {
      return this.getClosest(element.parentElement, callback);
    }
  }

}


KarmaFieldsAlpha.Orderer = class {

  constructor(element) {
    const manager = this;

    this.numRow = 0;
    this.map = new Map();
    this.events = {};
    this.element = element;

    this.scrollContainer = KarmaFieldsAlpha.DOM.getClosest(element, element => element.classList.contains("karma-scroll-container")) || document.documentElement;

    element.onmousedown = event => {
      if (event.button === 0) {
        let target = event.target.closest(".array > *"); // !!
        let cell = this.map.get(target);
        if (cell && cell.type === "index") {
          this.startDrag(cell, target, event, element);
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
    // let mouseX = event.clientX;
    // let mouseY = event.clientY;

    let oX = event.clientX;
    let oY = event.clientY;

    let mouseX = oX;
    let mouseY = oY;

    // let diffX = 0;
    // let diffY = 0;

    let scrollTop = this.scrollContainer.scrollTop;
    let scrollDiffY = 0;

    let offsetY = 0;

    let updateCell = () => {

      let diffX = mouseX - oX;
      let diffY = mouseY - oY + scrollDiffY;
      let prevRow;
      let nextRow;

      if (item.row > 0) {
        prevRow = manager.getRow(item.row-1);
      }
      if (item.row < manager.numRow-1) {
        nextRow = manager.getRow(item.row+1);
      }

      if (prevRow && prevRow.length && (diffY) < -prevRow[0].clientHeight/2) {
        manager.insertBefore(row, prevRow);
        oY -= prevRow[0].clientHeight;
        diffY = mouseY - oY + scrollDiffY;
      }
      if (nextRow && nextRow.length && (diffY) > nextRow[0].clientHeight/2) {
        manager.insertAfter(row, nextRow);
        oY += nextRow[0].clientHeight;
        diffY = mouseY - oY + scrollDiffY;
      }
      row.forEach(function(cell) {
        cell.style.transform = "translate("+diffX+"px, "+(diffY)+"px)";
      });

    }


    let scrollY = () => {
      scrollDiffY = this.scrollContainer.scrollTop - scrollTop;

      updateCell();

      // diffY = mouseY - oY + scrollDiffY;
      //
      //
      // let prevRow;
      // let nextRow;
      //
      // if (item.row > 0) {
      //   prevRow = manager.getRow(item.row-1);
      // }
      // if (item.row < manager.numRow-1) {
      //   nextRow = manager.getRow(item.row+1);
      // }
      //
      // if (prevRow && prevRow.length && diffY < -prevRow[0].clientHeight/2) {
      //   manager.insertBefore(row, prevRow);
      //   oY -= prevRow[0].clientHeight;
      //   // diffY = event.clientY - mouseY;
      // }
      // if (nextRow && nextRow.length && diffY > nextRow[0].clientHeight/2) {
      //   manager.insertAfter(row, nextRow);
      //   oY += nextRow[0].clientHeight;
      //   // diffY = event.clientY - mouseY;
      // }
      // row.forEach(function(cell) {
      //   cell.style.transform = "translate("+diffX+"px, "+(diffY)+"px)";
      // });

    }




    let mousemove = function(event) {
      // let diffX = event.clientX - mouseX;
      // let diffY = event.clientY - mouseY;
      // diffX = event.clientX - mouseX;
      // diffY = event.clientY - mouseY;
      mouseX = event.clientX;
      mouseY = event.clientY;

      updateCell();


      // diffX = mouseX - oX;
      // diffY = mouseY - oY + scrollDiffY;
      // let prevRow;
      // let nextRow;
      //
      // if (item.row > 0) {
      //   prevRow = manager.getRow(item.row-1);
      // }
      // if (item.row < manager.numRow-1) {
      //   nextRow = manager.getRow(item.row+1);
      // }
      //
      // if (prevRow && prevRow.length && (diffY) < -prevRow[0].clientHeight/2) {
      //   manager.insertBefore(row, prevRow);
      //   oY -= prevRow[0].clientHeight;
      //   // diffY = event.clientY - mouseY;
      //   // offsetY -= prevRow[0].clientHeight;
      // }
      // if (nextRow && nextRow.length && (diffY) > nextRow[0].clientHeight/2) {
      //   manager.insertAfter(row, nextRow);
      //   oY += nextRow[0].clientHeight;
      //   // diffY = event.clientY - mouseY;
      //
      //   // offsetY += nextRow[0].clientHeight;
      // }
      // row.forEach(function(cell) {
      //   cell.style.transform = "translate("+diffX+"px, "+(diffY)+"px)";
      // });
    };



    let mouseup = function() {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
      window.removeEventListener("scroll", scrollY);
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
    window.addEventListener("scroll", scrollY);
  }


}
