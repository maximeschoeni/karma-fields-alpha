
KarmaFieldsAlpha.fields.array = class extends KarmaFieldsAlpha.fields.field {

  constructor(...args) {
    super(...args);

    // compat
    if (this.resource.columns) {
      this.resource.children = this.resource.columns.map(column => {
        return {
          ...column,
          ...column.field
        };
      });
    }


	}

  async splash(request) {
		for (let child of this.children) {
			await child.splash(request);
		}
	}

  async update() {
    // noop
  }

  async getValue(...path) {

    if (this.resource.key) {

      const event = this.createEvent({
        action: "get",
        type: "array"
      });

      await super.dispatch(event);

      return event.getArray();

    } else {

      // const keys = this.resource.columns.filter(column => column.field.key).map(column => column.field.key);
      // const keys = this.resource.children.filter(column => column.key).map(column => column.key);

      const array = [];

      for (let resource of this.getSubResources(this.resource)) {

        const key = resource.key;
        const column = await this.getColumn(key);

        column.forEach((value, index) => {
          if (!array[index]) {
            array[index] = {};
          }
          array[index][key] = value;
        });

      }

      return array;
    }

  }

  async setValue(value) {

    if (this.resource.key) {

      const event = this.createEvent({
        action: "set",
        type: "array",
        backup: "once"
      });

      event.setValue(value);

      await super.dispatch(event);

    } else {

      const keys = {};

      for (let i = 0; i < value.length; i++) {
        for (let key in value[i]) {
          if (!keys[key]) {
            keys[key] = [];
          }
          keys[key][i] = value[i][key];
        }
      }

      for (let key in keys) {
        await super.dispatch(this.createEvent({
          action: "backup",
          path: [key]
        }));
  		}

  		await this.stage();

      for (let key in keys) {

        await this.setColumn(keys[key], key);

      }

    }
  }

  async getColumn(key) {

    const event = this.createEvent({
      action: "get",
      type: "array",
      path: [key]
    });

    await super.dispatch(event);

    return event.getArray();
  }

  async setColumn(column, key) {

    const event = this.createEvent({
      action: "set",
      type: "array",
      path: [key]
    });

    event.setValue(column);

    await super.dispatch(event);
  }


  async dispatch(event) {


      switch (event.action) {

        case "get": {
          this.promise = Promise.resolve(this.promise).then(async () => {
            const [index, key] = event.path;
            if (this.resource.key) {
              let array = await this.getValue();
              if (array[index][key] === undefined && event.default) {
                array = KarmaFieldsAlpha.DeepObject.clone(array || []);
                array[index][key] = await event.default;
                await this.setValue(array);
              }
              event.setValue(array[index][key]);
            } else {
              let column = await this.getColumn(key);
              if (column[index] === undefined && event.default) {
                column = KarmaFieldsAlpha.DeepObject.clone(column || []);
                column[index] = await event.default;
                await this.setColumn(column, key);
              }
              event.setValue(column[index]);
            }
          });
          await this.promise;
          break;
        }

        case "set": {
          this.promise = Promise.resolve(this.promise).then(async () => {
            if (this.resource.key) {
              let array = await this.getValue();
              array = KarmaFieldsAlpha.DeepObject.clone(array || []);
              KarmaFieldsAlpha.DeepObject.assign(array, event.getValue(), ...event.path);
              await this.setValue(array);
            } else {
              const [index, key] = event.path;
              let column = await this.getColumn(key);
              column = KarmaFieldsAlpha.DeepObject.clone(column);
              column[index] = event.getValue();
              await this.setColumn(column, key);
            }
          });
          await this.promise;
          break;
        }


        case "add":
          await this.add();
          break;

        case "delete":
          await this.delete(event.path[0]);
          break;

        // case "render":
        //   await this.render();
        //   break;

        // case "edit":
        //   this.update();
        //   break;

      }



    return event;
  }

  // async backup(value) {
  //
  //   if (this.resource.key) {
  //
  //     await super.dispatch(this.createEvent({
  //       action: "backup"
  //     }));
  //
  //   } else {
  //
  //     // const keys = this.resource.columns.filter(column => column.field.key).map(column => column.field.key);
  //     const keys = this.resource.children.filter(column => column.key).map(column => column.key);
  //
  //     for (let key in keys) {
  //       await super.dispatch(this.createEvent({
  //         action: "backup",
  //         path: [key]
  //       }));
  // 		}
  //
  //   }
  // }


  createRow() {
    // return new KarmaFieldsAlpha.fields.arrayRow({
    //   children: this.resource.columns.map(column => column.field)
    // });
    return this.createField({
      type: "arrayRow",
      children: this.resource.children
      // children: this.resource.columns.map(column => column.field)
    });
  }


  async swapRange(index1, index2, length) {
    // await this.backup();
    // await this.save("array-swap");
    let values = await this.getValue();
    values = KarmaFieldsAlpha.DeepObject.clone(values || []);
    values.splice(index2, 0, ...values.splice(index1, length));
		await this.setValue(values);
    // await this.edit();
  }

  async add() {
    // await this.backup();
    // await this.save("array-add");

    let values = await this.getValue();
    values = KarmaFieldsAlpha.DeepObject.clone(values || []);
    // const newValue = {};
    // for (let column of this.resource.columns) {
    //   if (column.field.key) {
    //     newValue[column.field.key] = [column.field.default || KarmaFieldsAlpha.fields[column.field.type || "group"].default || ""];
    //   }
    // }
    const newValue = await this.createRow().getDefault();

    values.push(newValue);



    await this.setValue(values);
    await this.render(true);
  }

  async delete(index) {
    // await this.backup();
    // await this.save("array-delete-"+index);
    let values = await this.getValue();
    values = KarmaFieldsAlpha.DeepObject.clone(values || []);
    values.splice(index, 1);
    await this.setValue(values);
    await this.render(true);
  }

  async slice(index, length) {
    let values = await this.getValue() || [];
    return values.slice(index, index + length);
  }

  async insert(data, index, length) {
    let values = await this.getValue();
    values = KarmaFieldsAlpha.DeepObject.clone(values || []);
    values.splice(index, length, ...data);
    await this.setValue(values);
  }


  build() {
    return {
      class: "array",
      init: table => {
        this.render = table.render;
      },
      update: async table => {

        const values = await this.getValue() || [];

        // const hasHeader = this.resource.columns.some(column => column.header);
        const hasHeader = this.resource.children.some(column => column.header || column.label); // header is deprecated

        this.register(table.element);

        table.children = [
          ...(values.length && hasHeader && [
            {
              class: "th",
              init: th => {
                th.element.style.order = "-1";
              }
            },
            ...this.resource.children.map(column => {
              return {
                class: "th",
                init: th => {
                  th.element.textContent = column.header || column.label || "";
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
              key: index,
              type: "arrayRow",
            });
            return [
              ...array,
              {
                class: "td array-index",
                init: td => {
                  if (this.resource.index && this.resource.index.style) {
                    td.element.style = this.resource.index.style;
                  }
                },
                update: td => {
                  td.element.textContent = index+1;
                  td.element.style.order = index.toString();

                  this.registerCell(td.element, index);
                }
              },
              ...this.resource.children.map((column, colIndex) => {

                return {
                  class: "td array-cell karma-field-frame karma-field-"+column.type,
                  init: td => {
                    // this.manager.registerItem(td.element, colIndex+1, index, "field");


                    if (column.style) {
                      td.element.style = column.style;
                    }
                    if (column.type !== "group") {
                      td.element.classList.add("final");
                    }
                  },
                  update: td => {
                    td.element.style.order = index.toString();
                    this.registerCell(td.element, index);
                  },
                  child: row.createChild({
                    ...column,
                    id: colIndex.toString()
                  }).build()
                };
              }),
              {
                class: "td array-delete",
                init: td => {
                  if (this.resource.delete && this.resource.delete.style) {
                    td.element.style = this.resource.delete.style;
                  }
                },
                update: td => {
                  td.element.style.order = index.toString();
                  this.registerCell(td.element, index);
                },
                child: row.createChild({
                  type: "button",
                  state: "delete",
                  title: this.resource.delete_button_name || this.resource.delete && this.resource.delete.name || "Delete",
                  dashicon: "no-alt"
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
              state: "add",
              title: this.resource.add_button_name || "Add Row"
            }).build()
          }
        ];

        table.element.style.gridTemplateColumns = [
          this.resource.index && this.resource.index.width || "5em",
          ...this.resource.children.map(column => column.width || "1fr"),
          this.resource.delete && this.resource.delete.width || "auto"
        ].join(" ");

      }
    };
  }


  // registerCell(element, index) {
  //
  //   const isSelected = Boolean(this.selector && this.selector.isSelected(index));
  //   element.classList.toggle("selected", isSelected);
  //
  //   element.onmousedown = event => {
  //     if (this.selector && this.selector.isSelected(index)) {
  //       event.preventDefault();
  //
  //       new this.constructor.Dragger(
  //         event,
  //         this.selector.selection.y,
  //         this.selector.selection.height,
  //         element.parentNode,
  //         async (index1, index2, length) => {
  //           this.selector.ta.blur();
  //           this.selector = null;
  //           await this.swapRange(index1, index2, length);
  //         }
  //       );
  //     } else {
  //       this.selector = new KarmaFieldsAlpha.fields.array.Selector(
  //         event,
  //         element,
  //         element.parentNode,
  //         async (index, num) => {
  //           const values = await this.fetchValue() || [];
  //           return values.slice(index, index + num);
  //         },
  //         async (data, index, num) => {
  //           const values = await this.fetchValue() || [];
  //           values.splice(index, num, ...data);
  //           await this.setValue(null, values);
  //           await this.render(true);
  //         }
  //       );
  //     }
  //
  //
  //   }
  //
  //
  // }


// }
//
//
// KarmaFieldsAlpha.fields.array.Selector = class {

  register(container) {

    window.selector = this;

    this.container = container;
    this.scrollContainer = KarmaFieldsAlpha.DOM.getClosest(this.container, element => element.classList.contains("karma-scroll-container")) || document.documentElement;

    this.map = new Map();

    // this.selection = null;
    // this.focusRect = null;
  }

  // onSelect(index, length) {}
  // onPaste(data, index, length) {}
  // onSwap(index1, index2, length) {}

  registerCell(element, index) {

    this.map.set(element, index);

    element.classList.toggle("selected", this.isSelected(index));

    element.onmousedown = event => {

      if (event.target !== element) {
         return;
      }

      if (this.isSelected(index)) {



        event.preventDefault(); // -> prevent TA focusout

        this.pointerX = event.clientX;
        this.pointerY = event.clientY;
        this.mouseX = this.pointerX;
        this.mouseY = this.pointerY;
        this.scrollTop = this.scrollContainer.scrollTop;
        this.scrollDiffY = 0;
        this.index = this.selection.y;

        this.row = this.getElements(this.selection.y, this.selection.height);
        this.element = element;

        this.offsetTop = this.row[0].offsetTop;
        this.originOffsetTop = this.offsetTop;

        this.element.classList.add("grabbing");
        this.container.classList.add("dragging");

        this.row.forEach(element => {
          element.classList.add("drag");
        });

        const mousemove = event => {
          this.mouseX = event.clientX;
          this.mouseY = event.clientY;
          this.drag();
        }

        const scroll = event => {
          // console.log("scroll", this.test);
          // if (this.test) {
          //   return;
          // }
          this.scrollDiffY = this.scrollContainer.scrollTop - this.scrollTop;
          this.drag();
        }

        const mouseup = event => {
          window.removeEventListener("mousemove", mousemove);
          window.removeEventListener("mouseup", mouseup);
          window.removeEventListener("scroll", scroll);
          setTimeout(() => {
            document.body.classList.remove("karma-dragging");
          }, 300);
          this.drop();
        }

        window.addEventListener("mousemove", mousemove);
        window.addEventListener("mouseup", mouseup);
        window.addEventListener("scroll", scroll);

        document.body.classList.add("karma-dragging");

      } else {

        const mousemove = event => {

          if (this.map.has(event.target)) {
            this.growSelection({x: 0, y: this.map.get(event.target), width: 1, height: 1});
          }
        }

        const mouseup = event => {
          window.removeEventListener("mousemove", mousemove);
          window.removeEventListener("mouseup", mouseup);

          if (this.map.has(event.target)) {
            this.growSelection({x: 0, y: this.map.get(event.target), width: 1, height: 1});

            this.endSelection();
          } else {
            this.clearSelection();
          }

          this.container.classList.remove("selecting");

        }

        window.addEventListener("mousemove", mousemove);
        window.addEventListener("mouseup", mouseup);

        this.container.classList.add("selecting");

      }


    }

  }

  async endSelection() {

    this.container.classList.add("has-selection");

    this.ta = document.createElement("textarea");
    this.ta.style.zIndex = "999999999";
    this.ta.style.position = "fixed";
    this.ta.style.bottom = "0";
    this.ta.style.left = "-100%";

    document.body.appendChild(this.ta);

    const data = await this.slice(this.selection.y, this.selection.height) || [];

    this.ta.value = JSON.stringify(data);
    this.ta.focus({preventScroll: true});
    this.ta.select();

    this.ta.onfocusout = event => {
      this.selection = null;
      this.focusRect = null;
      this.renderSelection();
      document.body.removeChild(this.ta);
      this.container.classList.remove("has-selection");
    }

    this.ta.onpaste = async event => {
      event.preventDefault();
      await this.insert(JSON.parse(event.clipboardData.getData("text")), this.selection.y, this.selection.height);
      this.ta.blur();
      await this.render(true);
    }

    this.ta.oncut = async event => {
      await this.insert([], this.selection.y, this.selection.height);
      this.ta.blur();
      await this.render(true);
    }

    this.ta.oninput = async event => {
      switch (event.inputType) {
        case "deleteContentBackward":
        case "deleteContentForward":
        case "deleteContent":
          await this.insert([], this.selection.y, this.selection.height);
          this.ta.blur();
          await this.render(true);
          break;

        default:
          this.ta.blur();
          break;
      }
    }
    this.ta.onkeydown = async event => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          if (this.selection.y > 0) {
            await this.swapRange(this.selection.y, --this.selection.y, this.selection.height);
            await this.render(true);
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          if (this.selection.y + this.selection.height < (await this.fetchValue() || []).length) {
            await this.swapRange(this.selection.y, ++this.selection.y, this.selection.height);
            await this.render(true);
          }
          break;
      }
    }

  }

  getElements(index, length = 1) {

    // return Array.from(this.map.entries()).filter(([key, value]) => value >= index && value < index + length).map(([key, value]) => key);

    const elements = [];
    for (let [key, value] of this.map.entries()) {
      if (value >= index && value < index + length) {
        elements.push(key);
      }
    }
    return elements;
  }

  growSelection(r) {

    if (this.focusRect) {
      r = KarmaFieldsAlpha.Rect.union(this.focusRect, r);
    } else {
      this.focusRect = r;
    }

    if (!this.selection || !KarmaFieldsAlpha.Rect.equals(this.selection, r)) {

      this.selection = r;
      this.renderSelection();

    }

	}

  clearSelection() {
    this.selection = null;
    this.focusRect = null;
    this.renderSelection();
  }

  renderSelection() {
    this.map.forEach((index, element) => {
      element.classList.toggle("selected", this.isSelected(index));
    })
	}

  isSelected(index) {
    return this.selection && index >= this.selection.y && index < this.selection.y + this.selection.height || false;
  }

  getDiffX() {
    return this.mouseX - this.pointerX;
  }

  getDiffY() {
    return this.mouseY - (this.pointerY) + this.scrollDiffY - (this.offsetTop - this.originOffsetTop);
  }

  drag() {

  // this.test =null;

    if (!this.selection) {
      return;
    }

    let diffX = this.getDiffX();
    let diffY = this.getDiffY();

    let prevRow = this.getElements(this.selection.y - 1);
    let nextRow = this.getElements(this.selection.y + this.selection.height);

    if (prevRow.length && diffY < -(prevRow[0].clientHeight+1)/2) {
    // if (prevRow.length && diffY < -(row[0].offsetTop - prevRow[0].offsetTop)/2) {

      // this.test = "a";
      // console.log("swap up");
      // console.log("prevRow height", prevRow[0].clientHeight);
      // console.log("diffY", diffY);
      // console.log("mouseY", this.mouseY);
      // console.log("pointerY", this.pointerY);
      // console.log("scrollDiffY", this.scrollDiffY);
      // console.log("offsetTop", this.offsetTop);
      // console.log("originOffsetTop", this.originOffsetTop);
      // console.log("...");

      // swap:
      prevRow.forEach(element => {

        // element.style.order = this.currentIndex.toString();
        // element.style.order = (Number(element.style.order) + this.length).toString();
        // element.style.order = (this.map.get(element) + this.selection.height).toString();
        const order = this.map.get(element) + this.selection.height;
        element.style.order = order.toString();
        this.map.set(element, order);
      });
      this.selection.y--;
      this.row.forEach(element => {
        // element.style.order = this.currentIndex.toString();
        // element.style.order = (Number(element.style.order) - 1).toString();
        // element.style.order = (this.map.get(element) - 1).toString();
        const order = this.map.get(element) - 1;
        element.style.order = order.toString();
        this.map.set(element, order);
      });

      this.offsetTop = this.row[0].offsetTop;
      diffY = this.getDiffY();
      // console.log("diffY", diffY);
      // console.log("mouseY", this.mouseY);
      // console.log("pointerY", this.pointerY);
      // console.log("scrollDiffY", this.scrollDiffY);
      // console.log("offsetTop", this.offsetTop);
      // console.log("originOffsetTop", this.originOffsetTop);



    } else if (nextRow.length && diffY > (nextRow[0].clientHeight+1)/2) {

      // this.test = "b";
    // } else if (nextRow.length && diffY > (prevRow[0].offsetTop - row[0].offsetTop)/2) {

      // console.log("swap down");
      // console.log("nextRow height", nextRow[0].clientHeight);
      // console.log("diffY", diffY);
      // console.log("mouseY", this.mouseY);
      // console.log("pointerY", this.pointerY);
      // console.log("scrollDiffY", this.scrollDiffY);
      // console.log("offsetTop", this.offsetTop);
      // console.log("originOffsetTop", this.originOffsetTop);

      // swap:
      nextRow.forEach(element => {
        // element.style.order = this.currentIndex.toString();
        // element.style.order = (Number(element.style.order) - this.length).toString();
        // element.style.order = (this.map.get(element) - this.selection.height).toString();

        const order = this.map.get(element) - this.selection.height;
        element.style.order = order.toString();
        this.map.set(element, order);
      });
      this.selection.y++;
      this.row.forEach(element => {
        // element.style.order = this.currentIndex.toString();
        // element.style.order = (Number(element.style.order) + 1).toString();
        // element.style.order = (this.map.get(element) + 1).toString();
        const order = this.map.get(element) + 1;
        element.style.order = order.toString();
        this.map.set(element, order);
      });

      this.offsetTop = this.row[0].offsetTop;


      diffY = this.getDiffY();
      // console.log("diffY", diffY);
      // console.log("mouseY", this.mouseY);
      // console.log("pointerY", this.pointerY);
      // console.log("scrollDiffY", this.scrollDiffY);
      // console.log("offsetTop", this.offsetTop);
      // console.log("originOffsetTop", this.originOffsetTop);


    }

    this.row.forEach(element => {
      element.style.transform = "translate("+diffX+"px, "+diffY+"px)";
    });

  }

  drop() {
    this.row.forEach(element => {
      element.classList.remove("drag");
      element.style.transform = "none";
    });

    this.element.classList.remove("grabbing");
    this.container.classList.remove("dragging");


    if (this.index !== this.selection.y) {
      setTimeout(async () => {
        await this.swapRange(this.index, this.selection.y, this.selection.height);
        await this.render(true);
      }, 100);
    }

  }


}


KarmaFieldsAlpha.fields.arrayRow = class extends KarmaFieldsAlpha.fields.field {

  constructor(...args) {
    super(...args);

    this.listeners = [];
  }


  async getDefault() {

		const value = {};

    const subResources = this.getSubResources(this.resource);

		for (let subResource of subResources) {
      value[subResource.key] = await this.createChild(subResource).getDefault();
		}

		return value;
	}

  async dispatch(event, parent) {

    switch (event.action) {

      case "set":
        await super.dispatch(event);
        // this.update();

        // for (let listener of this.listeners) await listener();
        break;

      // case "listen":
      //   this.listeners.push(event.callback);
      //   break;

      default:
        await super.dispatch(event);
        break;

    }

    if (event.splash || event.action === "set") {
			for (let child of this.children) {
				if (child !== parent) {
					await child.splash(event);
				}
			}
		}

    return event;
  }

  // async getState(...path) {
  //
  //   const state = path.pop();
  //
  //   switch (state) {
  //
  //     case "modified":
  //       return super.getState(...path, state);
  //       break;
  //
  //     default:
  //       return this.get(...path, state, 0);
  //
  //   }
  //
  // }
  //
  // async setState(...path) {
  //
  //   const state = path.pop();
  //
  //   switch (state) {
  //
  //     case "edit":
  //       await this.update();
  //       return super.setState(...path, state);
  //
  //     default:
  //       return super.setState(...path, state);
  //
  //
  //
  //   }
  //
  // }

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
