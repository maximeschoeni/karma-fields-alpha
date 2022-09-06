
KarmaFieldsAlpha.fields.array = class extends KarmaFieldsAlpha.fields.field {

  constructor(resource) {
    super(resource);

    this.clipboard = new KarmaFieldsAlpha.Clipboard();

    // compat
    if (this.resource.add_button_name) {
      this.resource.footer = {
        children: [
          {
            type: "add",
            title: this.resource.add_button_name
          }
        ]
      }
    }

	}

  // async getDefault() {
  // }

  async export(keys = []) {

		const array = await this.getValue();
    const object = {};
    const suffix = this.key() || "array";

    for (let index in array) {

      const rowField = this.createChild({
        type: "arrayRow",
        key: index.toString(),
        children: this.resource.children
      }, index.toString());

      const row = await rowfield.export(keys);

      for (let key in row) {

        object[`${suffix}-${index}-${key}`] = row[key];

      }

    }

    return object;
	}

	async import(object) {

		const key = this.getKey();
    let suffix = "";

    if (key) {
      suffix = key+"-";
    }

    for (let key in object) {

      const matches = key.match(/^(.*?)-(\d+)-(.+)$/);

      if (matches) {
        const index = matches[2];
        const subKey = matches[3];

        const rowField = this.createChild({
          type: "arrayRow",
          key: index,
          children: this.resource.children
        }, index.toString());

        await rowField.import({[subKey]: object[key]});

      }

    }

	}



  async getEmptyRow() {

    const row = this.createChild({
      ...this.resource,
      type: "arrayRow",
      key: 0
    }, 0);

    return row.getDefault();

  }

  async getValue(...path) {

    if (this.resource.key) {

      // const request = await super.dispatch({
      //   action: "get",
      //   type: "array"
      // });

      const response = await this.parent.request("get");

      return KarmaFieldsAlpha.Type.toArray(response);

    } else {

      // const keys = this.resource.columns.filter(column => column.field.key).map(column => column.field.key);
      // const keys = this.resource.children.filter(column => column.key).map(column => column.key);

      // const row = this.createChild({
      //   ...this.resource,
      //   type: "arrayRow",
      //   key: 0
      // }, 0);
      //
      // const defaults = await row.getDefault();


      const defaults = await this.getEmptyRow();


      const array = [];

      // for (let resource of this.getKeyedResources()) {
      for (let key in defaults) {

        // const column = await this.getColumn(key);

        // const column = await super.dispatch({
        //   action: "get",
        //   type: "array",
        //   path: [key]
        // }).then(request => KarmaFieldsAlpha.Type.toArray(request.data));

        const response = await this.parent.request("get", null, key);
        const column = KarmaFieldsAlpha.Type.toArray(response);

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

      // await super.dispatch({
      //   action: "set",
      //   data: value
      // });

      await this.parent.request("set", {
        data: value
      });

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

        await this.parent.request("set", {data: keys[key]}, key);

      }

    }
  }

  // async getColumn(key) {
  //
  //   // const event = this.createEvent({
  //   //   action: "get",
  //   //   type: "array",
  //   //   path: [key]
  //   // });
  //   //
  //   // await super.dispatch(event);
  //   //
  //   // return event.getArray();
  //
  //   const request = await super.dispatch({
  //     action: "get",
  //     type: "array",
  //     path: [key]
  //   });
  //
  //   return request.data;
  // }
  //
  // async setColumn(column, key) {
  //
  //   // const event = this.createEvent({
  //   //   action: "set",
  //   //   type: "array",
  //   //   path: [key]
  //   // });
  //   //
  //   // event.setValue(column);
  //   //
  //   // await super.dispatch(event);
  //
  //   await super.dispatch({
  //     action: "set",
  //     type: "array",
  //     path: [key],
  //     data: column
  //   });
  // }


  // async dispatch(event) {
  //
  //
  //   switch (event.action) {
  //
  //     case "get": {
  //         const [index, key] = event.path;
  //
  //         if (this.resource.key) {
  //
  //           const array = await super.dispatch({
  //             action: "get",
  //             type: "array"
  //           }).then(request => KarmaFieldsAlpha.Type.toArray(request.data));
  //
  //           if (array[index]) {
  //             event.data = array[index][key];
  //           }
  //
  //         } else {
  //
  //           // let column = await this.getColumn(key);
  //
  //           const column = await super.dispatch({
  //             action: "get",
  //             type: "array",
  //             path: [key]
  //           }).then(request => KarmaFieldsAlpha.Type.toArray(request.data));
  //
  //           event.data = column[index];
  //         }
  //       break;
  //     }
  //
  //     case "set": {
  //
  //       const [index, key] = event.path;
  //
  //       if (this.resource.key) {
  //
  //         const array = await super.dispatch({
  //           action: "get",
  //           type: "array"
  //         }).then(request => KarmaFieldsAlpha.Type.toArray(request.data));
  //
  //         const clone = KarmaFieldsAlpha.DeepObject.clone(array);
  //
  //         if (!clone[index]) {
  //           clone[index] = {};
  //         }
  //
  //         clone[index][key] = event.data
  //
  //         // await this.setValue(clone);
  //         await super.dispatch({
  //           action: "set",
  //           data: clone
  //         });
  //
  //       } else {
  //
  //         // let column = await this.getColumn(key);
  //         const column = await super.dispatch({
  //           action: "get",
  //           type: "array",
  //           path: [key]
  //         }).then(request => KarmaFieldsAlpha.Type.toArray(request.data));
  //
  //         const clone = KarmaFieldsAlpha.DeepObject.clone(column);
  //         //
  //         // const value = KarmaFieldsAlpha.Type.convert(event.data, event.type || "object");
  //
  //         // if (Array.isArray(event.data)) {
  //         //   console.error("impossible!");
  //         // }
  //
  //
  //         const value = KarmaFieldsAlpha.Type.toObject(event.data); // -> compat:
  //
  //         clone[index] = value;
  //
  //         await super.dispatch({
  //           action: "set",
  //           path: [key],
  //           data: clone
  //         });
  //
  //       }
  //
  //       break;
  //     }
  //
  //
  //     case "add":
  //       KarmaFieldsAlpha.History.save();
  //
  //       await this.add();
  //       await this.render();
  //       break;
  //
  //     case "delete":
  //       KarmaFieldsAlpha.History.save();
  //       await this.delete(event.path[0]);
  //       await this.render();
  //       break;
  //
  //     // case "edit":
  //     //   await this.render();
  //     //   break;
  //
  //     default:
  //       super.dispatch(event);
  //       break;
  //
  //   }
  //
  //
  //
  //   return event;
  // }

  async request(subject, content = {}, ...path) {


    switch (subject) {

      case "get": {
        const [index, subkey] = path;
        const key = this.getKey();

        if (key) {

          // const array = await super.dispatch({
          //   action: "get",
          //   type: "array"
          // }).then(request => KarmaFieldsAlpha.Type.toArray(request.data));

          const response = await this.parent.request("get", undefined, key);
          const array = KarmaFieldsAlpha.Type.toArray(response);

          if (array[index]) {
            return array[index][subkey];
          }

        } else {

          // let column = await this.getColumn(key);

          // const column = await super.dispatch({
          //   action: "get",
          //   type: "array",
          //   path: [key]
          // }).then(request => KarmaFieldsAlpha.Type.toArray(request.data));

          const response = await this.parent.request("get", undefined, subkey);
          const column = KarmaFieldsAlpha.Type.toArray(response);

          return column[index];
        }
        break;
      }

      case "set": {

        const [index, subkey] = path;
        const key = this.getKey();

        if (key) {

          // const array = await super.dispatch({
          //   action: "get",
          //   type: "array"
          // }).then(request => KarmaFieldsAlpha.Type.toArray(request.data));

          const response = await this.parent.request("get", undefined, key);
          const array = KarmaFieldsAlpha.Type.toArray(response);

          const clone = KarmaFieldsAlpha.DeepObject.clone(array);

          if (!clone[index]) {
            clone[index] = {};
          }

          clone[index][subkey] = content.data;

          // await this.setValue(clone);
          // await super.dispatch({
          //   action: "set",
          //   data: clone
          // });

          await this.parent.request("set", {data: clone}, key);

        } else {

          // let column = await this.getColumn(key);
          // const column = await super.dispatch({
          //   action: "get",
          //   type: "array",
          //   path: [key]
          // }).then(request => KarmaFieldsAlpha.Type.toArray(request.data));

          const response = await this.parent.request("get", null, subkey);
          const column = KarmaFieldsAlpha.Type.toArray(response);

          const clone = KarmaFieldsAlpha.DeepObject.clone(column);
          //
          // const value = KarmaFieldsAlpha.Type.convert(event.data, event.type || "object");

          // if (Array.isArray(event.data)) {
          //   console.error("impossible!");
          // }


          const value = KarmaFieldsAlpha.Type.toObject(content.data); // -> compat:

          clone[index] = value;

          // await super.dispatch({
          //   action: "set",
          //   path: [key],
          //   data: clone
          // });

          await this.parent.request("set", {data: clone}, subkey);

        }

        break;
      }


      case "add":
        KarmaFieldsAlpha.History.save();

        await this.add();
        await this.render();
        break;

      case "delete":
        KarmaFieldsAlpha.History.save();
        await this.delete(path[0]);
        await this.render();
        break;

      // case "edit":
      //   await this.render();
      //   break;

      case "modified":
      default: {
        const [index, subkey] = path;
        const key = this.getKey();
        return this.parent.request(subject, content, key || subkey);
      }

    }


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


  // createRow() {
  //   // return new KarmaFieldsAlpha.fields.arrayRow({
  //   //   children: this.resource.columns.map(column => column.field)
  //   // });
  //   return this.createField({
  //     type: "arrayRow",
  //     children: this.resource.children
  //     // children: this.resource.columns.map(column => column.field)
  //   });
  // }


  async swap(index, length, target) {
    // await this.backup();
    // await this.save("array-swap");
    let values = await this.getValue();

    values = KarmaFieldsAlpha.DeepObject.clone(values || []);
    values.splice(target, 0, ...values.splice(index, length));
		await this.setValue(values);
    // await this.edit();
  }

  async add() {
    const array = await this.getValue();
    const clone = KarmaFieldsAlpha.DeepObject.clone(array);

    const row = await this.getEmptyRow();

    clone.push(row);

    await this.setValue(clone);

    // await super.dispatch({
    //   action: "set",
    //   data: clone
    // });
  }

  async delete(index) {
    const values = await this.getValue();
    const clone = KarmaFieldsAlpha.DeepObject.clone(values);
    clone.splice(index, 1);

    await this.setValue(clone);

    // await super.dispatch({
    //   action: "set",
    //   data: clone
    // });
  }

  async insert(data, index, length) {
    const values = await this.getValue();
    const clone = KarmaFieldsAlpha.DeepObject.clone(values);

    clone.splice(index, length, ...data);

    await this.setValue(clone);

    // await super.dispatch({
    //   action: "set",
    //   data: clone
    // });

  }


  build() {
    return {
      class: "array",
      children: [
        {
          class: "array-body",
          init: table => {
            this.render = table.render;

            this.clipboard.ta.onblur = event => {
              if (this.selection) {
                this.selection.kill();
              }
            }

            this.clipboard.onInput = async dataArray => {

              const array = KarmaFieldsAlpha.Clipboard.toJson(dataArray);

              if (this.selection && array.length) {

                KarmaFieldsAlpha.History.save();

                await this.insert(array, this.selection.index, this.selection.length);

                this.selection = null;

                // await this.dispatch({
                //   action: "render"
                // });
                await this.parent.request("render");

              }

            }

          },
          update: async table => {

            const values = await this.getValue() || [];

            const hasHeader = this.resource.children.some(column => column.header || column.label); // header is deprecated

            table.element.classList.toggle("empty", values.length === 0);


            table.children = [
              ...this.resource.children.filter(column => values.length && hasHeader).map(column => {
                return {
                  class: "th",
                  init: th => {
                    th.element.textContent = column.header || column.label || "";
                  }
                };
              }),
              ...values.reduce((array, item, index) => {

                const row = this.createChild({
                  ...this.resource,
                  key: index,
                  type: "arrayRow"
                }, index.toString());

                row.index = index;

                return [
                  ...array,
                  ...this.resource.children.map((column, colIndex) => {

                    const field = row.createChild(column, colIndex.toString());

                    return {
                      class: "td array-cell karma-field-frame",
                      init: td => {
                        // const field = row.createChild(column, colIndex);
                        if (field.resource.style) {
                          td.element.style = field.resource.style;
                        }
                        if (field.resource.class) {
                          td.element.classList.add(field.resource.class);
                        }
                      },
                      update: td => {

                        this.selection = null;
                        td.element.classList.remove("selected");
                        td.element.onmousedown = async event => {

                          if (event.target !== td.element) {
                             return;
                          }

                          if (event.buttons === 1) {

                            if (this.selection && KarmaFieldsAlpha.Segment.contains(this.selection, index)) {

                              const headerElements = hasHeader ? [...table.element.children].slice(0, this.resource.children.length) : [];

                              const sorter = new KarmaFieldsAlpha.Sorter(event, this.selection, index, headerElements);

                              await sorter.sort();

                              if (sorter.selection.index !== sorter.index) {

                                KarmaFieldsAlpha.History.save();

                                await this.swap(sorter.index, this.selection.length, this.selection.index);

                                sorter.selection.kill();

                                // await this.dispatch({action: "render"});
                                await this.parent.request("render");

                              }

                            } else {

                              const elements = [...table.element.children].slice(hasHeader ? this.resource.children.length : 0);

                              this.selection = new KarmaFieldsAlpha.Selection(event, table.element, elements, this.resource.children.length, values.length, colIndex, index, this.selection);

                              await this.selection.select();

                              const selecteditems = values.slice(this.selection.index, this.selection.index + this.selection.length);

                              this.clipboard.setJson(selecteditems);

                              if (this.renderControls) {
                                await this.renderControls();
                              }

                            }

                          }

                        };

                        td.child = field.build();
                      }
                    };
                  })
                ];
              }, [])

            ];

            // table.element.style.gridTemplateColumns = [
            //   this.resource.index && this.resource.index.width || "5em",
            //   ...this.resource.children.map(column => column.width || "1fr")
            //   this.resource.delete && this.resource.delete.width || "auto"
            // ].join(" ");

            const row = this.createField({type: "arrayRow"});

            table.element.style.gridTemplateColumns = this.resource.children.map(column => row.createField(column).resource.width || "1fr").join(" ");

          }
        },
        {
          class: "array-footer",
          init: footer => {
            footer.element.onmousedown = event => {
              event.preventDefault(); // -> prevent losing focus on selected items
            }
          },
          update: footer => {
            if (this.resource.footer !== false) {
              footer.child = this.createChild({
                type: "footer",
                ...this.resource.footer
              }, "footer").build();
            }
          }
        }
      ]
    };
  }

  static footer = class extends KarmaFieldsAlpha.fields.group {

    constructor(resource) {

      super({
        ...{
          display: "flex",
          children: [
            "add"
          ]
        },
        ...resource
      });

    }

    static add = {
      type: "button",
      id: "add",
      state: "add",
      title: "Add Row"
    }

  }


  static arrayRow = class extends KarmaFieldsAlpha.fields.group {

    // async dispatch(event) {
    //
    //   switch (event.action) {
    //
    //     case "index":
    //       event.data = this.index;
    //       break;
    //
    //     default:
    //       await super.dispatch(event);
    //       break;
    //   }
    //
    //   return event;
    // }

    async request(subject, content, ...path) {

      switch (subject) {

        case "index":
          return this.index;

        default:
          return this.parent.request(subject, content, this.getKey(), ...path);
          break;
      }

    }

    async export(keys = []) {

      const row = {};

      for (let index in this.resource.children) {

        const field = this.createChild(this.resource.children[index], index.toString());
        const values = await field.export(keys);
        row = {...row, ...values};

      }

      return row;
    }

    async import(object) {

      for (let index in this.resource.children) {

        const field = this.createChild(this.resource.children[index], index.toString());
        await field.import(object);

      }

    }

    static index = class extends KarmaFieldsAlpha.fields.field {

      constructor(resource) {
        super({
          width: "5em",
          class: "array-index",
          ...resource
        });
      }

      build() {
        return {
          tag: "span",
          update: async td => {
            // td.element.textContent = this.parent.index+1;
            // td.element.textContent = await this.dispatch({action: "index"}).then(request => request.data+1);
            const index = await this.request("index");
            td.element.textContent = index+1;
          }
        };
      }

    }

    static delete = {
      type: "button",
      state: "delete",
      title: "Delete",
      dashicon: "no-alt",
      class: "array-delete",
      width: "auto"
    }

  }

}
