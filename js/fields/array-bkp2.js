
KarmaFieldsAlpha.fields.array = class extends KarmaFieldsAlpha.fields.field {

  constructor(...args) {
    super(...args);



    // compat
    // this.resource.index = this.resource.columns && this.resource.columns.find(column => column.type === "index");
    // this.resource.delete = this.resource.columns && this.resource.columns.find(column => column.type === "delete");
    // //
    // //
    // //
    // // this.resource.columns = (this.resource.columns || []).filter(column => column.field);
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

      return this.promise;

      // const array = await this.fetchValue() || [];
      // KarmaFieldsAlpha.DeepObject.assign(array, value, ...path);
      // await super.setValue(null, array);

    }

    return super.setValue(null, value);

  }

  async isModified(...path) {

		if (this.resource.key && path.length) {

			return super.isModified();

		}

		return super.isModified(...path);
	}

  send(value, ...path) {

		if (this.resource.key && path.length) {

			this.promise = Promise.resolve(this.promise).then(() => this.fetchValue() || []).then(array => {
        KarmaFieldsAlpha.DeepObject.assign(array, value, 0, ...path);
        super.send(array);
      });

			return this.promise;

		}

    return super.send(value);
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
              {
                class: "td array-index",
                init: td => {
                  // this.manager.registerItem(td.element, 0, index, "index");
                  if (this.resource.index && this.resource.index.style) {
                    td.element.style = this.resource.index.style;
                  }


                  td.element.onmousedown = event => {
                    // new this.constructor.Dragger(
                    //   index,
                    //   table.element,
                    //   async (index1, index2) => {
                    //     await this.swap(index1, index2);
                    //     table.render();
                    //   }
                    // );


                    new KarmaFieldsAlpha.fields.array.Selector(
                      td.element,
                      table.element
                    );
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
                    if (column.field.type !== "group") {
                      td.element.classList.add("final");
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
          this.resource.index && this.resource.index.width || "5em",
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


KarmaFieldsAlpha.fields.array.Selector = class {

  constructor(element, container, onSelect) {

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
    this.scrollDiffY = 0;
    this.currentIndex = this.index;

    // this.row = this.elements.filter(element => element.style.order === this.index.toString());

    // this.offsetTop = this.row[0].offsetTop;
    // this.originOffsetTop = this.offsetTop;


    // this.row[0].classList.add("grabbing");
    // this.container.classList.add("dragging");
    //
    // this.row.forEach(element => {
    //   element.classList.add("drag");
    // });

    const mousemove = event => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
      this.update();
    }

    const scroll = event => {
      this.scrollDiffY = this.scrollContainer.scrollTop - this.scrollTop;
      this.update();
    }

    const mouseup = event => {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
      window.removeEventListener("scroll", scroll);
      // setTimeout(() => {
      //   document.body.classList.remove("karma-dragging");
      // }, 300);
      this.complete();
    }

    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
    window.addEventListener("scroll", scroll);


    this.ta = document.createElement("textarea");
    container.appendChild(this.ta);
    // document.body.classList.add("karma-dragging");
  }


}




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
    // this.pointerX = event.pageX;
    // this.pointerY = event.pageY;
    this.mouseX = this.pointerX;
    this.mouseY = this.pointerY;
    this.scrollContainer = KarmaFieldsAlpha.DOM.getClosest(this.container, element => element.classList.contains("karma-scroll-container")) || document.documentElement;
    this.scrollTop = this.scrollContainer.scrollTop;

    // console.log("scroll start", this.scrollContainer.scrollTop, document.documentElement.scrollHeight, this.container.clientHeight);
    this.scrollDiffY = 0;
    this.currentIndex = this.index;
    // this.grid = new KarmaFieldsAlpha.fields.array.Grid(this.container, this.numCol, this.numRow, this.rowOffset);
    this.row = this.elements.filter(element => element.style.order === this.index.toString());

    this.offsetTop = this.row[0].offsetTop;
    this.originOffsetTop = this.offsetTop;


    this.row[0].classList.add("grabbing");
    this.container.classList.add("dragging");

    this.row.forEach(element => {
      element.classList.add("drag");
    });

    const mousemove = event => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
      // this.mouseX = event.pageX;
      // this.mouseY = event.pageY;
      this.update();
    }

    const scroll = event => {
      this.scrollDiffY = this.scrollContainer.scrollTop - this.scrollTop;
      // console.log("scroll", this.scrollDiffY, this.scrollContainer.scrollTop, document.documentElement.scrollHeight, this.container.clientHeight);
      this.update();
    }

    const mouseup = event => {
      window.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
      window.removeEventListener("scroll", scroll);
      setTimeout(() => {
        document.body.classList.remove("karma-dragging");
      }, 300);
      this.complete();
    }

    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
    window.addEventListener("scroll", scroll);


    document.body.classList.add("karma-dragging");
  }

  getDiffX() {
    return this.mouseX - this.pointerX;
  }

  getDiffY() {
    return this.mouseY - (this.pointerY) + this.scrollDiffY - (this.offsetTop - this.originOffsetTop);
  }

  update() {

    let diffX = this.getDiffX();
    let diffY = this.getDiffY();

    let prevRow = this.elements.filter(element => element.style.order === (this.currentIndex-1).toString());
    let nextRow = this.elements.filter(element => element.style.order === (this.currentIndex+1).toString());

    if (prevRow.length && diffY < -prevRow[0].clientHeight/1.75) {

      // swap:
      prevRow.forEach(element => {
        element.style.order = this.currentIndex.toString();
      });
      this.currentIndex--;
      this.row.forEach(element => {
        element.style.order = this.currentIndex.toString();
      });
      // this.pointerY -= prevRow[0].clientHeight;

      this.offsetTop = this.row[0].offsetTop;

      diffY = this.getDiffY();

    } else if (nextRow.length && diffY > nextRow[0].clientHeight/1.75) {

      // swap:
      nextRow.forEach(element => {
        element.style.order = this.currentIndex.toString();
      });
      this.currentIndex++;
      this.row.forEach(element => {
        element.style.order = this.currentIndex.toString();
      });

      this.offsetTop = this.row[0].offsetTop;
      // this.pointerY += nextRow[0].clientHeight;

      // this.offsetTop += nextRow[0].clientHeight;
      diffY = this.getDiffY();
      // diffY = this.mouseY - this.pointerY + this.scrollDiffY;


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
      }, 100);
    }

  }

}



KarmaFieldsAlpha.DOM = class {

  static getClosest(element, callback) {
    if (callback(element)) {
      return element;
    } else if (element.parentElement) {
      return this.getClosest(element.parentElement, callback);
    }
  }

}
