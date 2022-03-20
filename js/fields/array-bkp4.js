
KarmaFieldsAlpha.fields.array = class extends KarmaFieldsAlpha.fields.field {

  constructor(...args) {
    super(...args);

	}

  // async fetchValue(deprec, index, ...path) {
  //
  //
  //   if (this.resource.key) {
  //
  //     let array = await super.fetchValue() || [];
  //
  //     if (path.length) {
  //       array = KarmaFieldsAlpha.DeepObject.get(array, index, ...path);
  //     }
  //
  //     return array;
  //
  //   } else if (path.length) {
  //
  //     let array = await super.fetchValue(null, ...path) || [];
  //
  //     return array.slice(Number(index), Number(index)+1);
  //
  //   } else if (index === undefined) {
  //
  //     const keys = this.getResourceKeys();
  //
  //     const array = [];
  //     for (let key of keys) {
  //       const values = await super.fetchValue(null, key);
  //       values.forEach((value, index) => {
  //         if (!array[index]) {
  //           array[index] = {};
  //         }
  //         array[index][key] = [value];
  //       });
  //     }
  //
  //     return array;
  //
  //   } else {
  //
  //     return super.fetchValue(null, index);
  //   }
  //
  // }

  // async get(...path) {
  //
  //   if (this.resource.key) {
  //
  //     const context = path.pop();
  //
  //     switch (context) {
  //
  //       case (this.resource.context || "value"):
  //         return KarmaFieldsAlpha.DeepObject.get(await super.get(context) || [], ...path);
  //
  //       case "modified":
  //         return super.get(context);
  //
  //       default: // -> maybe looking for a value
  //         return this.getValue(...path, context);
  //
  //     }
  //
  //   } else if (path.length > 1) {
  //
  //     const index = path.shift();
  //     const array = await super.get(...path) || [];
  //
  //     return [array[index]];
  //
  //   } else {
  //
  //     const keys = this.getResourceKeys();
  //
  //     const array = [];
  //     for (let key of keys) {
  //       const values = await super.get(key, path[0]);
  //       values.forEach((value, index) => {
  //         if (!array[index]) {
  //           array[index] = {};
  //         }
  //         array[index][key] = [value];
  //       });
  //     }
  //
  //     return array;
  //
  //   }
  //
  // }

  // async getValue(...path) {
  //
  //   // if (this.resource.key) {
  //   //
  //   //   let value = await super.get(this.resource.context || "value") || [];
  //   //
  //   //   if (path.length) {
  //   //
  //   //     value = KarmaFieldsAlpha.DeepObject.get(value, ...path) || [];
  //   //
  //   //   }
  //   //
  //   //   return value;
  //   //
  //   // } else {
  //   //
  //   //   if (path.length) {
  //   //
  //   //     const index = path.shift();
  //   //     const array = await super.get(...path, this.resource.context || "value") || [];
  //   //
  //   //     return [array[index]];
  //   //
  //   //   } else {
  //   //
  //   //     const keys = this.getResourceKeys();
  //   //
  //   //     const array = keys.map(() => {});
  //   //
  //   //     for (let key of keys) {
  //   //
  //   //       const values = await super.get(key, this.resource.context || "value");
  //   //
  //   //       values.forEach((value, index) => {
  //   //         array[index][key] = [value];
  //   //       });
  //   //
  //   //     }
  //   //
  //   //     return array;
  //   //
  //   //   }
  //   //
  //   // }
  //
  // }


  async get(...path) {

    const context = path.pop();

    switch (context) {

      case (this.resource.context || "value"):
        // return this.getValue(...path);

        if (this.resource.key) {

          let value = await super.get(this.resource.context || "value") || [];

          if (path.length) {

            value = KarmaFieldsAlpha.DeepObject.get(value, ...path) || [];

          }

          return value;

        } else {

          if (path.length) {

            // const index = path.shift();
            // const array = await super.get(...path, this.resource.context || "value") || [];
            //
            // return [array[index]];

            const index = path.shift();
            path.pop();

            return super.get(...path, index, this.resource.context || "value") || [];

          } else {

            const keys = this.getResourceKeys();

            const array = keys.map(() => {});

            for (let key of keys) {

              const values = await super.get(key, this.resource.context || "value");

              values.forEach((value, index) => {
                array[index][key] = [value];
              });

            }

            return array;

          }

        }

        // if (this.resource.key) {
        //
        //   const value = await super.get(context) || [];
        //
        //   if (path.length) {
        //
        //     return KarmaFieldsAlpha.DeepObject.get(value, ...path) || [];
        //
        //   }
        //
        //   return value;
        //
        // } else if (path.length > 1) {
        //
        //   const index = path.shift();
        //   const array = await super.get(...path, context) || [];
        //
        //   return [array[index]];
        //
        // } else {
        //
        //   const keys = this.getResourceKeys();
        //
        //   const array = [];
        //   for (let key of keys) {
        //     const values = await super.get(key, path[0]);
        //     values.forEach((value, index) => {
        //       if (!array[index]) {
        //         array[index] = {};
        //       }
        //       array[index][key] = [value];
        //     });
        //   }
        //
        //   return array;
        // }

      case "modified":
        if (this.resource.key) {
          return super.get(context);
        } else {
          return super.get(...path.slice(1), context);
        }

      default: // -> maybe looking for a value
        return this.getValue(...path, context);
        // if (this.resource.key) {
        //   return super.get(...path, context, this.resource.context || "value");
        // } else {
        //   return super.get(...path.slice(1), context, this.resource.context || "value");
        // }


    }



  }

  // async edit(value, ...path) {
  //
  //   switch (value) {
  //
  //     case "add":
  //       await this.add();
  //       break;
  //
  //     case "delete":
  //       await this.delete(Number(path[0]));
  //       break;
  //
  //     case "render-table":
  //       await this.render();
  //       break;
  //
  //     default:
  //       await super.edit(value, ...path);
  //       break;
  //
  //   }
  //
  // }

  // async getState(...path) {
  //
  //   if (this.resource.key) {
  //
  //     const state = path.pop();
  //
  // 		switch (state) {
  //
  // 			case "modified":
  // 				return super.getState(state);
  //
  // 			default:
  //         const array = await this.fetchValue() || [];
  //         const value = KarmaFieldsAlpha.DeepObject.get(array, ...path, state);
  //
  // 				return (value || []).toString();
  //
  // 		}
  //
  //   } else {
  //
  //     return super.getState(...path);
  //
  //   }
  //
	// }

  getResourceKeys() {
    return this.resource.columns.reduce((array, item) => {
      return [
        ...array,
        ...super.getResourceKeys(item.field || {})
      ]
    }, []);
  }


  // async setValue(deprec, value, index, ...path) {
  //
  //   if (this.resource.key) {
  //
  //     if (path.length) {
  //
  //       this.promise = Promise.resolve(this.promise).then(() => this.fetchValue()).then((array = []) => {
  //         KarmaFieldsAlpha.DeepObject.assign(array, value, index, ...path);
  //         return super.setValue(null, array);
  //       });
  //
  //       return this.promise;
  //
  //     }
  //
  //     return super.setValue(null, value);
  //
  //   } else if (path.length) {
  //
  //     this.promise = Promise.resolve(this.promise).then(() => this.fetchValue(null, ...path)).then((array = []) => {
  //
  //       array[index] = value.toString();
  //       return super.setValue(null, array, ...path);
  //     });
  //
  //     return this.promise;
  //
  //   } else {
  //
  //     const keys = this.getResourceKeys();
  //
  //
  //     for (let key of keys) {
  //       const array = value.map(value => value[key] && value[key].toString() || "");
  //
  //
  //       await super.setValue(null, array, key);
  //     }
  //
  //   }
  //
  //
  // }


  // async setValue(value, ...path) {
  //
  //   if (this.resource.key) {
  //
  //     if (path.length && value) {
  //
  //       this.promise = Promise.resolve(this.promise).then(() => super.get(this.resource.context || "value")).then((array = []) => {
  //         KarmaFieldsAlpha.DeepObject.assign(array, value, ...path);
  //         return super.set(array, this.resource.context || "value");
  //       });
  //
  //     } else {
  //
  //       this.promise = Promise.resolve(this.promise).then(() => super.set(value, this.resource.context || "value"));
  //
  //     }
  //
  //     return this.promise;
  //
  //   } else {
  //
  //     if (path.length) {
  //
  //       const index = path.shift();
  //
  //       this.promise = Promise.resolve(this.promise).then(() => super.get(...path, this.resource.context || "value")).then((array = []) => {
  //         array[index] = value[0];
  //         return super.set(array, ...path, this.resource.context || "value");
  //       });
  //
  //     } else { // = context
  //
  //       const keys = this.getResourceKeys();
  //
  //       this.promise = Promise.resolve(this.promise).then(() => Promise.all(keys.map(key => {
  //         const array = value.map(item => item[key] && item[key][0]);
  //         return super.set(array, key, this.resource.context || "value");
  //       })))
  //
  //     }
  //
  //     return this.promise;
  //
  //   }
  //
  // }

  async set(value, ...path) {

    const context = path.pop();

    switch (context) {

      case "add":
        await this.add();
        break;

      case "delete":
        await this.delete(Number(path[0]));
        break;

      case "render":
        await this.render();
        break;

      case (this.resource.context || "value"):
        // this.setValue(value, ...path);
        if (this.resource.key) {

          if (path.length && value) {

            this.promise = Promise.resolve(this.promise).then(() => super.get(this.resource.context || "value")).then((array = []) => {
              KarmaFieldsAlpha.DeepObject.assign(array, value, ...path);
              return super.set(array, this.resource.context || "value");
            });

          } else {

            this.promise = Promise.resolve(this.promise).then(() => super.set(value, this.resource.context || "value"));

          }

          return this.promise;

        } else {

          if (path.length) {

            const index = path.shift();
            path.pop();

            await super.set(array, ...path, index, this.resource.context || "value");

            // ["1", 0, "items", 2]

            // this.promise = Promise.resolve(this.promise).then(() => super.get(...path, this.resource.context || "value")).then((array = []) => {
            //   array[index] = value[0];
            //   return super.set(array, ...path, this.resource.context || "value");
            // });

          } else { // = context

            // const keys = this.getResourceKeys();
            //
            // value = [
            //   {
            //     x: [3],
            //     y: ["a"]
            //   },
            //   {
            //     x: [4],
            //     y: ["b"]
            //   }
            // ]



            this.promise = Promise.resolve(this.promise).then(async () => {
              for (let i = 0; i < value.length; i++) {
                for (let key in value[i]) {
                  await super.set(value[i][key][0], key, i, this.resource.context || "value");
                }
              }
            });

            // this.promise = Promise.resolve(this.promise).then(() => Promise.all(keys.map(key => {
            //   const array = value.map(item => item[key] && item[key][0]);
            //   return super.set(array, key, this.resource.context || "value");
            // })))

          }

          return this.promise;

        }
        // if (this.resource.key) {
        //
        //   if (path.length && value) {
        //     this.promise = Promise.resolve(this.promise).then(() => super.get(context)).then((array = []) => {
        //       KarmaFieldsAlpha.DeepObject.assign(array, value, ...path);
        //       return super.set(array, context);
        //     });
        //     return this.promise;
        //   }
        //
        //   return super.set(value, context);
        //
        // } else if (path.length > 0) { // -> set item value
        //
        //   const index = path.shift();
        //
        //   this.promise = Promise.resolve(this.promise).then(() => super.get(...path, context)).then((array = []) => {
        //     array[index] = value[0];
        //     return super.set(array, ...path, context);
        //   });
        //
        //   return this.promise;
        //
        // } else { // = context
        //
        //   const keys = this.getResourceKeys();
        //
        //   for (let key of keys) {
        //
        //     const array = value.map(item => item[key] && item[key][0]);
        //     await super.set(array, key, context);
        //   }
        //
        // }
        break;

    }

  }


  // async set(value, ...path) {
  //
  //   if (this.resource.key) {
  //
  //     const context = path.pop();
  //
  //     switch (context) {
  //
  //       case "value":
  //         if (path.length) {
  //           this.promise = Promise.resolve(this.promise).then(() => this.getValue()).then((array = []) => {
  //             KarmaFieldsAlpha.DeepObject.assign(array, value, ...path);
  //             return super.setValue(null, array);
  //           });
  //           return this.promise;
  //         }
  //         return super.setValue(value);
  //
  //     }
  //
  //   } else if (path.length > 1) {
  //
  //     const index = path.shift();
  //
  //     this.promise = Promise.resolve(this.promise).then(() => this.get(...path)).then((array = []) => {
  //       array[index] = value[0];
  //       return super.set(array, ...path);
  //     });
  //
  //     return this.promise;
  //
  //   } else if (path[0] === "value") {
  //
  //     const keys = this.getResourceKeys();
  //
  //     for (let key of keys) {
  //
  //       const array = value.map(item => item[key] && item[key][0]);
  //       await super.setValue(array, key);
  //     }
  //
  //   }
  //
  //
  // }

  // async isModified(index, ...path) {
  //
	// 	if (this.resource.key && path.length) {
  //
	// 		return super.isModified();
  //
	// 	}
  //
	// 	return super.isModified(...path);
	// }

  // send(value, index, ...path) {
  //
	// 	if (this.resource.key) {
  //
  //     if (path.length) {
  //
  // 			this.promise = Promise.resolve(this.promise).then(() => this.fetchValue() || []).then(array => {
  //         KarmaFieldsAlpha.DeepObject.assign(array, value, index, ...path);
  //         return super.send(array);
  //       });
  //
  // 			return this.promise;
  //
  // 		}
  //
  //     return super.send(value);
  //
	// 	} else if (path.length) {
  //
  //     this.promise = Promise.resolve(this.promise).then(() => this.fetchValue(null, ...path) || []).then(array => {
  //       // array.splice(index, 1, ...value);
  //       array[index] = value.toString();
  //       return super.send(array, ...path);
  //     });
  //
  //     return this.promise;
  //
  //   }
  //
  // }

  // write(index, ...path) {
  //   if (this.resource.key) {
  //     return super.write();
  //   }
  //   super.write(...path);
  // }

  async swapRange(index1, index2, length) {
    await this.write();
    this.nextup();
    const values = await this.getValue();
    values.splice(index2, 0, ...values.splice(index1, length));
		await this.setValue(values);
    await this.edit();
  }

  async add() {
    await this.write();
    this.nextup();

    const values = await this.getValue() || [];
    values.push({});

    await this.setValue(values);
    await this.render(true);
  }

  async delete(index) {
    await this.write();
    this.nextup();
    const values = await this.getValue() || [];
    values.splice(index, 1);
    await this.setValue(values);
    await this.render(true);
  }

  async slice(index, length) {
    const values = await this.getValue() || [];
    return values.slice(index, index + length);
  }

  async insert(data, index, length) {
    const values = await this.getValue() || [];
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

        const hasHeader = this.resource.columns.some(column => column.header);

        this.register(table.element);

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
              key: index,
              type: "field",
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
                    td.element.style.order = index.toString();

                    this.registerCell(td.element, index);
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
                  action: "delete",
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
              action: "add",
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





// KarmaFieldsAlpha.fields.array.Selector = class {
//
//   constructor(event, element, container, onSelect, onPaste) {
//
//     this.container = container;
//     this.onSelect = onSelect;
//     this.onPaste = onPaste;
//     this.elements = Array.from(container.children);
//
//     this.scrollContainer = KarmaFieldsAlpha.DOM.getClosest(this.container, element => element.classList.contains("karma-scroll-container")) || document.documentElement;
//
//     const mousemove = event => {
//       if (this.elements.includes(event.target)) {
//         this.growSelection({x: 0, y: Number(event.target.style.order), width: 1, height: 1});
//       }
//     }
//
//     const mouseup = event => {
//       window.removeEventListener("mousemove", mousemove);
//       window.removeEventListener("mouseup", mouseup);
//
//       if (this.elements.includes(event.target)) {
//         this.growSelection({x: 0, y: Number(event.target.style.order), width: 1, height: 1});
//       }
//       this.complete();
//     }
//
//     window.addEventListener("mousemove", mousemove);
//     window.addEventListener("mouseup", mouseup);
//
//   }
//
//   onSelect() {}
//   onPaste() {}
//
//   async complete() {
//
//     this.ta = document.createElement("textarea");
//     // this.ta.style.backgroundColor = "aqua";
//     this.ta.style.zIndex = "999999999";
//     this.ta.style.position = "fixed";
//     this.ta.style.bottom = "0";
//
//     document.body.appendChild(this.ta);
//
//     const data = await this.onSelect(this.selection.y, this.selection.height) || [];
//
//     this.ta.value = JSON.stringify(data);
//     this.ta.focus({preventScroll: true});
//     this.ta.select();
//
//     this.ta.onfocusout = event => {
//       if (this.selection) {
//   			this.unpaint(this.selection);
//   		}
//       this.selection = null;
//       document.body.removeChild(this.ta);
//     }
//
//     this.ta.onpaste = event => {
//       event.preventDefault();
//       this.onPaste(JSON.parse(event.clipboardData.getData("text")), this.selection.y, this.selection.height);
//       this.ta.blur();
//     }
//
//     this.ta.oncut = event => {
//       this.onPaste([], this.selection.y, this.selection.height);
//       this.ta.blur();
//     }
//
//     this.ta.oninput = async event => {
//       switch (event.inputType) {
//         case "deleteContentBackward":
//         case "deleteContentForward":
//         case "deleteContent":
//           this.onPaste([], this.selection.y, this.selection.height);
//           this.ta.blur();
//           break;
//         default:
//           this.ta.blur();
//           break;
//       }
//     }
//     this.ta.onkeydown = event => {
//       switch (event.key) {
//         case "ArrowUp":
//           event.preventDefault();
//           this.onArrowUp();
//           break;
//       }
//     }
//
//   }
//
//   getElements(index) {
//     return this.elements.filter(element => element.style.order === index.toString());
//   }
//
//   growSelection(r) {
//
//     if (this.focusRect) {
//       r = KarmaFieldsAlpha.Rect.union(this.focusRect, r);
//     } else {
//       this.focusRect = r;
//     }
//
//     if (!this.selection) {
//
//       this.selection = r;
//       this.paint(this.selection);
//
//     } else if (!KarmaFieldsAlpha.Rect.equals(this.selection, r)) {
//
//       this.unpaint(this.selection);
//       this.selection = r;
//       this.paint(this.selection);
//
//     }
//
// 	}
//
//   paint(rect) {
// 		for (let i = rect.x; i < rect.x + rect.width; i++) {
// 			for (let j = rect.y; j < rect.y + rect.height; j++) {
//         this.getElements(j).forEach(element => {
//           element.classList.add("selected");
//         });
// 			}
// 		}
// 	}
//
// 	unpaint(rect) {
// 		for (let i = rect.x; i < rect.x + rect.width; i++) {
// 			for (let j = rect.y; j < rect.y + rect.height; j++) {
//         this.getElements(j).forEach(element => {
//           element.classList.remove("selected");
//         });
// 			}
// 		}
// 	}
//
//   isSelected(index) {
//     return this.selection && index >= this.selection.y && index < this.selection.y + this.selection.height;
//   }
//
// }
//



// KarmaFieldsAlpha.fields.array.Dragger = class {
//
//   constructor(event, index, length, container, onSwap) {
//     // constructor(index, container, numCol, numRow, offsetRow, offsetCol, onSwap) {
//
//     this.index = index;
//     this.length = length;
//     this.container = container;
//     // this.numCol = numCol;
//     // this.numRow = numRow;
//     // this.offsetRow = offsetRow;
//     // this.offsetCol = offsetCol;
//     this.onSwap = onSwap;
//
//   // }
//   // mousedown(event) {
//
//     this.elements = Array.from(container.children);
//
//     this.pointerX = event.clientX;
//     this.pointerY = event.clientY;
//     // this.pointerX = event.pageX;
//     // this.pointerY = event.pageY;
//     this.mouseX = this.pointerX;
//     this.mouseY = this.pointerY;
//     this.scrollContainer = KarmaFieldsAlpha.DOM.getClosest(this.container, element => element.classList.contains("karma-scroll-container")) || document.documentElement;
//     this.scrollTop = this.scrollContainer.scrollTop;
//
//     this.scrollDiffY = 0;
//     this.currentIndex = this.index;
//
//     // this.row = this.elements.filter(element => element.style.order === this.index.toString());
//     this.row = this.getRow(this.index, this.length);
//
//     this.offsetTop = this.row[0].offsetTop;
//     this.originOffsetTop = this.offsetTop;
//
//
//     this.row[0].classList.add("grabbing");
//     this.container.classList.add("dragging");
//
//     this.row.forEach(element => {
//       element.classList.add("drag");
//     });
//
//     const mousemove = event => {
//       this.mouseX = event.clientX;
//       this.mouseY = event.clientY;
//       // this.mouseX = event.pageX;
//       // this.mouseY = event.pageY;
//       this.update();
//     }
//
//     const scroll = event => {
//       this.scrollDiffY = this.scrollContainer.scrollTop - this.scrollTop;
//       // console.log("scroll", this.scrollDiffY, this.scrollContainer.scrollTop, document.documentElement.scrollHeight, this.container.clientHeight);
//       this.update();
//     }
//
//     const mouseup = event => {
//       window.removeEventListener("mousemove", mousemove);
//       window.removeEventListener("mouseup", mouseup);
//       window.removeEventListener("scroll", scroll);
//       setTimeout(() => {
//         document.body.classList.remove("karma-dragging");
//       }, 300);
//       this.complete();
//     }
//
//     window.addEventListener("mousemove", mousemove);
//     window.addEventListener("mouseup", mouseup);
//     window.addEventListener("scroll", scroll);
//
//
//     document.body.classList.add("karma-dragging");
//   }
//
//   getRow(index, length = 1) {
//     return this.elements.filter(element => {
//       const order = Number(element.style.order);
//       return order >= index && order < index + length;
//     });
//   }
//
//   getDiffX() {
//     return this.mouseX - this.pointerX;
//   }
//
//   getDiffY() {
//     return this.mouseY - (this.pointerY) + this.scrollDiffY - (this.offsetTop - this.originOffsetTop);
//   }
//
//   update() {
//
//     let diffX = this.getDiffX();
//     let diffY = this.getDiffY();
//
//     // let prevRow = this.elements.filter(element => element.style.order === (this.currentIndex-1).toString());
//     // let nextRow = this.elements.filter(element => element.style.order === (this.currentIndex+1).toString());
//
//     let prevRow = this.getRow(this.currentIndex-1);
//     let nextRow = this.getRow(this.currentIndex + this.length);
//
//     if (prevRow.length && diffY < -prevRow[0].clientHeight/1.75) {
//
//       // swap:
//       prevRow.forEach(element => {
//         // element.style.order = this.currentIndex.toString();
//         element.style.order = (Number(element.style.order) + this.length).toString();
//       });
//       this.currentIndex--;
//       this.row.forEach(element => {
//         // element.style.order = this.currentIndex.toString();
//         element.style.order = (Number(element.style.order) - 1).toString();
//       });
//
//       this.offsetTop = this.row[0].offsetTop;
//
//       diffY = this.getDiffY();
//
//     } else if (nextRow.length && diffY > nextRow[0].clientHeight/1.75) {
//
//       // swap:
//       nextRow.forEach(element => {
//         // element.style.order = this.currentIndex.toString();
//         element.style.order = (Number(element.style.order) - this.length).toString();
//       });
//       this.currentIndex++;
//       this.row.forEach(element => {
//         // element.style.order = this.currentIndex.toString();
//         element.style.order = (Number(element.style.order) + 1).toString();
//       });
//
//       this.offsetTop = this.row[0].offsetTop;
//       diffY = this.getDiffY();
//
//
//     }
//
//     this.row.forEach(element => {
//       element.style.transform = "translate("+diffX+"px, "+diffY+"px)";
//     });
//
//   }
//
//   complete() {
//     this.row.forEach(element => {
//       element.classList.remove("drag");
//       element.style.transform = "none";
//     });
//
//     this.row[0].classList.remove("grabbing");
//     this.container.classList.remove("dragging");
//
//     console.log(this.index, this.currentIndex);
//     if (this.currentIndex !== this.index && this.onSwap) {
//       setTimeout(async () => {
//         this.onSwap(this.index, this.currentIndex, this.length);
//       }, 100);
//     }
//
//   }
//
// }


// KarmaFieldsAlpha.fields.array.Dragger = class {
//
//   constructor(index, container, onSwap) {
//     // constructor(index, container, numCol, numRow, offsetRow, offsetCol, onSwap) {
//
//     this.index = index;
//     this.container = container;
//     // this.numCol = numCol;
//     // this.numRow = numRow;
//     // this.offsetRow = offsetRow;
//     // this.offsetCol = offsetCol;
//     this.onSwap = onSwap;
//
//   // }
//   // mousedown(event) {
//
//     this.elements = Array.from(container.children);
//
//     this.pointerX = event.clientX;
//     this.pointerY = event.clientY;
//     // this.pointerX = event.pageX;
//     // this.pointerY = event.pageY;
//     this.mouseX = this.pointerX;
//     this.mouseY = this.pointerY;
//     this.scrollContainer = KarmaFieldsAlpha.DOM.getClosest(this.container, element => element.classList.contains("karma-scroll-container")) || document.documentElement;
//     this.scrollTop = this.scrollContainer.scrollTop;
//
//     // console.log("scroll start", this.scrollContainer.scrollTop, document.documentElement.scrollHeight, this.container.clientHeight);
//     this.scrollDiffY = 0;
//     this.currentIndex = this.index;
//     // this.grid = new KarmaFieldsAlpha.fields.array.Grid(this.container, this.numCol, this.numRow, this.rowOffset);
//     this.row = this.elements.filter(element => element.style.order === this.index.toString());
//
//     this.offsetTop = this.row[0].offsetTop;
//     this.originOffsetTop = this.offsetTop;
//
//
//     this.row[0].classList.add("grabbing");
//     this.container.classList.add("dragging");
//
//     this.row.forEach(element => {
//       element.classList.add("drag");
//     });
//
//     const mousemove = event => {
//       this.mouseX = event.clientX;
//       this.mouseY = event.clientY;
//       // this.mouseX = event.pageX;
//       // this.mouseY = event.pageY;
//       this.update();
//     }
//
//     const scroll = event => {
//       this.scrollDiffY = this.scrollContainer.scrollTop - this.scrollTop;
//       // console.log("scroll", this.scrollDiffY, this.scrollContainer.scrollTop, document.documentElement.scrollHeight, this.container.clientHeight);
//       this.update();
//     }
//
//     const mouseup = event => {
//       window.removeEventListener("mousemove", mousemove);
//       window.removeEventListener("mouseup", mouseup);
//       window.removeEventListener("scroll", scroll);
//       setTimeout(() => {
//         document.body.classList.remove("karma-dragging");
//       }, 300);
//       this.complete();
//     }
//
//     window.addEventListener("mousemove", mousemove);
//     window.addEventListener("mouseup", mouseup);
//     window.addEventListener("scroll", scroll);
//
//
//     document.body.classList.add("karma-dragging");
//   }
//
//   getDiffX() {
//     return this.mouseX - this.pointerX;
//   }
//
//   getDiffY() {
//     return this.mouseY - (this.pointerY) + this.scrollDiffY - (this.offsetTop - this.originOffsetTop);
//   }
//
//   update() {
//
//     let diffX = this.getDiffX();
//     let diffY = this.getDiffY();
//
//     let prevRow = this.elements.filter(element => element.style.order === (this.currentIndex-1).toString());
//     let nextRow = this.elements.filter(element => element.style.order === (this.currentIndex+1).toString());
//
//     if (prevRow.length && diffY < -prevRow[0].clientHeight/1.75) {
//
//       // swap:
//       prevRow.forEach(element => {
//         element.style.order = this.currentIndex.toString();
//       });
//       this.currentIndex--;
//       this.row.forEach(element => {
//         element.style.order = this.currentIndex.toString();
//       });
//       // this.pointerY -= prevRow[0].clientHeight;
//
//       this.offsetTop = this.row[0].offsetTop;
//
//       diffY = this.getDiffY();
//
//     } else if (nextRow.length && diffY > nextRow[0].clientHeight/1.75) {
//
//       // swap:
//       nextRow.forEach(element => {
//         element.style.order = this.currentIndex.toString();
//       });
//       this.currentIndex++;
//       this.row.forEach(element => {
//         element.style.order = this.currentIndex.toString();
//       });
//
//       this.offsetTop = this.row[0].offsetTop;
//       // this.pointerY += nextRow[0].clientHeight;
//
//       // this.offsetTop += nextRow[0].clientHeight;
//       diffY = this.getDiffY();
//       // diffY = this.mouseY - this.pointerY + this.scrollDiffY;
//
//
//     }
//
//     this.row.forEach(element => {
//       element.style.transform = "translate("+diffX+"px, "+diffY+"px)";
//     });
//
//   }
//
//   complete() {
//     this.row.forEach(element => {
//       element.classList.remove("drag");
//       element.style.transform = "none";
//     });
//
//     this.row[0].classList.remove("grabbing");
//     this.container.classList.remove("dragging");
//
//     if (this.currentIndex !== this.index && this.onSwap) {
//       setTimeout(async () => {
//         this.onSwap(this.index, this.currentIndex);
//       }, 100);
//     }
//
//   }
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
