
KarmaFieldsAlpha.field.array = class extends KarmaFieldsAlpha.field {

  constructor(resource) {
    super(resource);

    // this.clipboard = new KarmaFieldsAlpha.Clipboard();
    this.clipboard = this.createChild("clipboard");

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

  async onRenderControls() {
    // noop
  }

  // async getDefault() {
  // }

  // getKeys() {

  //   // let keys = new Set();
  //   //
  //   // for (let resource of this.resource.children) {
  //   //
  //   //   keys = new Set(...keys, ...this.createChild(resource).getKeys());
  //   //
  //   // }
  //   //
  //   // return keys;

  //   return this.createChild({
  //     type: "arrayRow",
  //     children: this.resource.children
  //   }).getKeys();

  // }

  exportRows(index = 0, length = 9999) {

    const object = {};
		const values = this.getValue();

    const array = [];

    for (let i = 0; i < Math.min(values.length - index, length); i++) {

      const rowField = this.createChild({
        type: "arrayRow",
        key: (index+i).toString(),
        children: this.resource.children
      });

      const row = rowField.export();

      array.push(row);

    }

    return array;

  }

  importRows(array = [], index = 0, length = 99999) {

    let key = this.getKey();
    const values = this.getValue();
    const clone = values.slice();

    clone.splice(index, Math.min(length, values.length - index), ...array.map(row => {}));

    this.setValue(clone);

    if (array.length) {

      for (let i = 0; i < array.length; i++) {

        const row = array[i];

        const rowField = this.createChild({
          type: "arrayRow",
          key: (i+index).toString(),
          children: this.resource.children
        });

        rowField.import(row);

      }

    }

	}





  export(keys = []) {

    const object = {};
		// const values = await this.getValue();
    //
    // const array = [];
    //
    // for (let i = 0; i < values.length; i++) {
    //
    //   const rowField = this.createChild({
    //     type: "arrayRow",
    //     key: i.toString(),
    //     children: this.resource.children
    //   });
    //
    //   const row = await rowField.export(keys);
    //
    //   array.push(row);
    //
    // }

    const array = this.exportRows();

    let key = this.getKey();

    if (key) {

      object[key] = JSON.stringify(array);

    } else {

      // const keys = this.getKeys();
      const columns = this.getColumns(array);

      for (key in columns) {

        object[key] = JSON.stringify(columns[key]);

      }

    }

    return object;
	}

  import(object, index = 0, length = 0) {

    let key = this.getKey();
    let array;

    if (key) {

      if (object[key]) {

        array = JSON.parse(object[key]);

      }

    } else {

      const keys = this.getKeys();
      const columns = {};

      for (key of keys) {

        if (object[key]) {

          columns[key] = JSON.parse(object[key]);

        }

      }

      array = this.getRows(columns);

    }

    this.importRows(array);

    // if (array && array.length) {
    //
    //   for (let i = 0; i < Math.max(length, array.length); i++) {
    //
    //     const row = array[i%array.length];
    //
    //     const rowField = this.createChild({
    //       type: "arrayRow",
    //       key: (i+index).toString(),
    //       children: this.resource.children
    //     });
    //
    //     await rowField.import(row);
    //
    //   }
    //
    // } else {
    //
    //   const array = await this.getValue();
    //
    //   const clone = array.slice();
    //   clone.splice(index, length);
    //
    //   await this.setValue(clone);
    //
    // }

	}


  // async export(keys = [], index = 0, length = 9999) {
  //
	// 	const array = await this.getValue();
  //   const object = {};
  //   const suffix = this.getKey() || "array";
  //
  //   // for (let index in array) {
  //   for (let i = 0; i < Math.min(array.length, length); i++) {
  //
  //     const rowField = this.createChild({
  //       type: "arrayRow",
  //       key: (index+i).toString(),
  //       children: this.resource.children
  //     });
  //
  //     const row = await rowField.export(keys);
  //
  //     for (let key in row) {
  //
  //       object[`${suffix}-${i}-${key}`] = row[key];
  //
  //     }
  //
  //   }
  //
  //   return object;
	// }
  //
  // async import(object, index = 0, length = 0) {
  //
  //   const key = this.getKey();
  //   const defaults = await this.getEmptyRow();
  //
  //   for (let key in object) {
  //
  //     // if (defaults[key] !== undefined) {
  //
  //     const matches = key.match(/^(.*?)-(\d+)-(.+)$/);
  //
  //     if (matches && matches[1] === (key || "array") && defaults[matches[3]] !== undefined) {
  //
  //       const i = matches[2];
  //       const subKey = matches[3];
  //
  //       const rowField = this.createChild({
  //         type: "arrayRow",
  //         key: (index + i),
  //         children: this.resource.children
  //       });
  //
  //       await rowField.import({[subKey]: object[key]});
  //
  //     }
  //
  //   }
  //
  // }


	// async import(object) {
  //
	// 	const key = this.getKey();
  //   let suffix = "";
  //
  //   if (key) {
  //     suffix = key+"-";
  //   }
  //
  //   for (let key in object) {
  //
  //     const matches = key.match(/^(.*?)-(\d+)-(.+)$/);
  //
  //     if (matches) {
  //       const index = matches[2];
  //       const subKey = matches[3];
  //
  //       const rowField = this.createChild({
  //         type: "arrayRow",
  //         key: index,
  //         children: this.resource.children
  //       }, index.toString());
  //
  //       await rowField.import({[subKey]: object[key]});
  //
  //     }
  //
  //   }
  //
	// }

  // -> return object of arrays;
  // getColumns(rows) {
  //
  //   const columns = {};
  //
  //   for (let i = 0; i < rows.length; i++) {
  //     for (let key in rows[i]) {
  //       if (!columns[key]) {
  //         columns[key] = [];
  //       }
  //       columns[key][i] = rows[i][key];
  //     }
  //   }
  //
  //   return columns;
  // }

  getColumns(rows) {

    const keys = new Set();
    this.getKeys(keys);
    
    const columns = {};

    for (let key of keys) {
      columns[key] = [];
    }

    for (let i = 0; i < rows.length; i++) {
      for (let key in rows[i]) {
        columns[key][i] = rows[i][key];
      }
    }

    return columns;
  }

  // -> return array of objects;
  getRows(columns) {

    const rows = [];

    for (let key in columns) {

      const column = columns[key] || [];

      for (let i = 0; i < column.length; i++) {
        if (!rows[i]) {
          rows[i] = {};
        }
        rows[i][key] = column[i];
      }

    }

    return rows;
  }



  // async getEmptyRow() {
  //
  //   const row = this.createChild({
  //     ...this.resource,
  //     type: "arrayRow"
  //   });
  //
  //   return row.getDefault();
  //
  // }

  getValue() {

    let key = this.getKey();

    if (key) {

      return this.parent.request("get", {}, key);

      // return KarmaFieldsAlpha.Type.toArray(response);

    } else {

      const keys = new Set();
      this.getKeys(keys);

      const columns = {};

      for (key of keys) {

        columns[key] = this.parent.request("get", {}, key);

      }

      return this.getRows(columns);

    }

    // let key = this.getKey();

    // if (key) {

    //   const response = await this.parent.request("get", {}, key);

    //   return KarmaFieldsAlpha.Type.toArray(response);

    // } else {

    //   const keys = this.getKeys();
    //   const columns = {};

    //   for (key of keys) {

    //     const response = await this.parent.request("get", null, key);
    //     columns[key] = KarmaFieldsAlpha.Type.toArray(response);

    //   }

    //   return this.getRows(columns);

    // }

  }

  setValue(value) {

    let key = this.getKey();

    if (key) {

      this.parent.request("set", value, key);

    } else {

      const columns = this.getColumns(value);

      for (key in columns) {

        this.parent.request("set", columns[key], key);

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

  request(subject, content = {}, ...path) {


    switch (subject) {

      // case "state": {
      //   const [index, subkey] = path;
      //   const key = this.getKey();

      //   if (key) {

      //     const state = await this.parent.request("state", {}, key);

      //     if (state.multi) {

      //       return {
      //         ...state,
      //         values: state.values.map(value => value && value[index] && value[index][subkey])
      //       };

      //     } else if (state.value && state.value[index]) {

      //       return {
      //         ...state,
      //         value: state.value[index][subkey]
      //       };

      //     }

      //   } else {

      //     // const response = await this.parent.request("get", undefined, subkey);
      //     // const column = KarmaFieldsAlpha.Type.toArray(response);
      //     //
      //     // return column[index];


      //     const state = await this.parent.request("state", {}, subkey);

      //     if (state.multi) {

      //       return {
      //         ...state,
      //         values: state.values.map(value => KarmaFieldsAlpha.Type.toArray(value)[index])
      //       };

      //     } else {

      //       return {
      //         ...state,
      //         value: KarmaFieldsAlpha.Type.toArray(state.value)[index]
      //       };

      //     }

      //   }

      //   break;
      // }



      case "get": {
        const [index, subkey] = path;
        const key = this.getKey();

        if (key) {

          // if (subkey === "..") {
          //   return this.parent.request(subject, content, ...path.slice(2));
          // }

          // const array = await super.dispatch({
          //   action: "get",
          //   type: "array"
          // }).then(request => KarmaFieldsAlpha.Type.toArray(request.data));

          const values = this.parent.request("get", null, key);
          

          if (values) {

            return KarmaFieldsAlpha.Type.toArray(values[index] && values[index][subkey] || null);

          }

        } else {

          const values = this.parent.request("get", {}, subkey);

          if (values) {

            return KarmaFieldsAlpha.Type.toArray(values[index]);

          }
          
        }

        break;
      }

      case "set": {


        const [index, subkey] = path;
        const key = this.getKey();

        if (key) {

          const values = this.parent.request("get", {}, key);

          if (values) {

            const clone = KarmaFieldsAlpha.DeepObject.clone(values);

            if (!clone[index]) {

              clone[index] = {};

            }

            clone[index][subkey] = content;

            this.parent.request("set", clone, key);
          }

        } else {

          const values = this.parent.request("get", {}, subkey);

          if (values) {

            const clone = KarmaFieldsAlpha.DeepObject.clone(values);

            clone[index] = KarmaFieldsAlpha.Type.toObject(content);

            this.parent.request("set", clone, subkey);

          }



          // const response = this.parent.request("get", {}, subkey);
          // const column = KarmaFieldsAlpha.Type.toArray(response);

          // const clone = KarmaFieldsAlpha.DeepObject.clone(column);
          
          // const value = content.data;

          // clone[index] = value;

          // await this.parent.request("set", {data: clone}, subkey);

        }

        break;
      }


      case "add":
        KarmaFieldsAlpha.History.save();

        this.add();
        this.parent.request("render");
        break;

      case "delete":

        KarmaFieldsAlpha.History.save();
        this.delete(path[0]);
        this.parent.request("render");
        break;

      // case "edit":
      //   await this.render();
      //   break;

      // case "fetch": {
      //   const [index, subkey, ...subpath] = path;
      //   const key = this.getKey();
      //   if (key) {
      //     return this.parent.request(subject, content, key, index, subkey, ...subpath);
      //   }
      //   return this.parent.request(subject, content, subkey, index, ...subpath);
      // }

      case "sort-up": {
        const [index] = path
        this.swap(index, 1, index-1);
        this.render();
        break;
      }
      case "sort-down": {
        const [index] = path
        this.swap(index, 1, index+1);
        this.render();
        break;
      }

      case "length": {
        const values = this.getValue();
        return values.length;
      }

      case "path": {
        const key = this.getKey();
        if (key) {
          path = [key, ...path];
        }
        return this.parent.request(subject, content, ...path);
      }

      case "get-option":
      case "set-option": {
        const key = this.getKey();
        if (key) {
          path = [key, ...path];
        }
        return this.parent.request(subject, content, ...path);
      }

      case "modified":
      default: {
        const [index, subkey] = path;
        const key = this.getKey();
        return this.parent.request(subject, content, key || subkey);
      }

    }


  }

  expect(action, object) {

    switch (action) {

      case "export": {
        // todo...
        break;
      }

      case "import": {
        // todo...
        break;
      }

      // case "gather": {

      //   let set = new Set();

      //   // const values = await this.request("get");
      //   const values = await this.getValue();

      //   for (let i = 0; i < values.length; i++) {

      //     const row = this.createChild({type: "arrayRow", key: i.toString(), children: this.resource.children});

      //     const values = await row.expect(action, object);

      //     if (values) {

      //       set = new Set([...set, ...values]);

      //     }

      //   }
          
      //   return set;
      // }

      case "keyup": {

        // console.log(await this.parent.request("path"));

      }

      default: {

        const values = this.getValue();

        for (let i = 0; i < values.length; i++) {

          const row = this.createChild({type: "arrayRow", key: i.toString(), children: this.resource.children});

          row.expect(action, object);

        }
          
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
  //   // return new KarmaFieldsAlpha.field.arrayRow({
  //   //   children: this.resource.columns.map(column => column.field)
  //   // });
  //   return this.createField({
  //     type: "arrayRow",
  //     children: this.resource.children
  //     // children: this.resource.columns.map(column => column.field)
  //   });
  // }


  swap(index, length, target) {
    let values = this.getValue();
    values = KarmaFieldsAlpha.DeepObject.clone(values || []);
    values.splice(target, 0, ...values.splice(index, length));
		this.setValue(values);
  }

  add() {

    const array = this.getValue();
    const clone = array.slice();

    const defaults = this.createChild({
      ...this.resource,
      type: "arrayRow"
    }).getDefault();

    clone.push(defaults);

    this.setValue(clone);
  }

  delete(index) {
    const values = this.getValue();
    const clone = KarmaFieldsAlpha.DeepObject.clone(values);
    clone.splice(index, 1);
    this.setValue(clone);
  }

  insert(data, index, length) {
    const values = this.getValue();
    const clone = KarmaFieldsAlpha.DeepObject.clone(values);

    clone.splice(index, length, ...data);

    this.setValue(clone);

  }


  build() {
    return {
      class: "array",
      update: array => {
        array.children = [
          this.clipboard.build(),
          {
            class: "array-body",
            init: table => {
  
  
            },
            update: table => {
  
              this.render = table.render;
  
              const values = this.getValue();
  
              table.element.classList.toggle("loading", !values);
  
              if (values) {
  
                table.element.classList.toggle("empty", values.length === 0);
  
                const hasHeader = this.resource.children.some(column => column.header || column.label); // header is deprecated
  
                this.clipboard.onBlur = event => {
  
                  if (this.selection) {
  
                    const sortManager = new KarmaFieldsAlpha.SortManager(table.element);
  
                    sortManager.selection = this.selection;
                    sortManager.clear();
  
                    this.selection = null;
  
                  }
  
                }
  
                this.clipboard.onInput = value => {
  
                  const array = JSON.parse(value || "[]");
  
                  if (this.selection) {
  
                    KarmaFieldsAlpha.History.save();
                    
                    this.importRows(array, this.selection.index, this.selection.length);
                    this.selection = null;
                    this.parent.request("render");
  
                  }
  
                }
  
                
  
                table.element.colCount = this.resource.children.length;
                table.element.rowCount = values.length;
                table.element.colHeader = hasHeader ? 1 : 0;
  
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
                    });
  
                    row.index = index;
  
                    return [
                      ...array,
                      ...this.resource.children.map((column, colIndex) => {
  
                        const field = row.createChild(column);
  
                        return {
                          class: "td array-cell karma-field-frame",
                          init: td => {
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
                            td.element.onmousedown = event => {
  
                              if (event.target !== td.element) {
                                return;
                              }
  
                              if (event.buttons === 1) {
  
                                const sortManager = new KarmaFieldsAlpha.SortManager(table.element);
  
                                sortManager.selection = this.selection;
  
                                sortManager.onSelect = segment => {
  
                                  this.selection = segment;
  
                                  // debugger;
                                  // console.log(await row.request("path"));
  
  
                                  const array = this.exportRows(segment.index, segment.length);
                                  const value = JSON.stringify(array);
  
                                  this.clipboard.output(value);
                                  this.clipboard.focus();
  
                                  this.onRenderControls();
  
                                }
  
                                sortManager.onSort = (index, length, target) => {
  
                                  this.swap(index, length, target);
  
                                  sortManager.clear();
  
                                  this.parent.request("render");
  
                                }
  
                                sortManager.select(event, colIndex, index);
  
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
  
              
            }
          },
          {
            class: "array-footer",
            child: {
              class: "array-footer-content",
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
          }
        ];
      }
    };
  }

  static footer = class extends KarmaFieldsAlpha.field.group {

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
      action: "add",
      // title: "Add Row"
      title: "+"
    }

  }


  static arrayRow = class extends KarmaFieldsAlpha.field {

    request(subject, content, ...path) {

      switch (subject) {

        case "get": {
          if (path.length === 1 && path[0] === "index") {
            return this.index;
          } else if (path.length === 1 && path[0] === "length") {
            return this.parent.request("length");
          }
          return this.parent.request(subject, content, this.getKey(), ...path);
        }

        case "index":
          return this.index;

        default:
          return this.parent.request(subject, content, this.getKey(), ...path);
          break;
      }

    }

    // getKeys() {

  	// 	let keys = new Set();

    //   for (let resource of this.resource.children) {

    //     const child = this.createChild(resource);
    //     keys = new Set([...keys, ...child.getKeys()]);

    //   }

  	// 	return keys;
  	// }

    getKeys(set) {

      // -> do not consider as keyed

      for (let resource of this.resource.children) {
      
        this.createChild(resource).getKeys(set);
    
      }
  
    }

    getDefault() {

  		let defaults = {};

  		for (let index in this.resource.children) {

  			const child = this.createChild(this.resource.children[index]);

  			defaults = {
  				...defaults,
  				...child.getDefault()
  			};

  		}

  		return defaults;
  	}

    export(keys = []) {

      let object = {};

      for (let resource of this.resource.children) {

        const child = this.createChild(resource);

        object = {
          ...object,
          ...child.export(keys)
        };

      }

      return object;
    }

    import(object) {

      for (let resource of this.resource.children) {

        const child = this.createChild(resource);

        child.import(object);

      }

    }

    expect(action, object) {

      console.error("deprecated");

      switch (action) {
  
        case "export": {
          // todo...
          break;
        }
  
        case "import": {
          // todo...
          break;
        }

        // case "keyup": {

        //   console.log(this);

        // }
  
        // case "gather": {
  
        //   let set = new Set();
  
        //   if (this.resource.children) {
  
        //     for (let resource of this.resource.children) {
        
        //       const child = this.createChild(resource);

        //       const values = await child.expect(action, object);

        //       if (values) {

        //         set = new Set([...set, ...values]);

        //       }

        //     }
          
        //   }
  
        //   return set;
        // }

        default: {
    
          if (this.resource.children) {
  
            for (let resource of this.resource.children) {
        
              const child = this.createChild(resource);

              child.expect(action, object);

            }
          
          }
  
        }
  
      }
  
    }

    

    // async export(keys = []) {
    //
    //   let row = {};
    //
    //   for (let index in this.resource.children) {
    //
    //     const field = this.createChild(this.resource.children[index]);
    //     const values = await field.export(keys);
    //     row = {...row, ...values};
    //
    //   }
    //
    //   return row;
    // }
    //
    // async import(object) {
    //
    //   for (let index in this.resource.children) {
    //
    //     const field = this.createChild(this.resource.children[index]);
    //     await field.import(object);
    //
    //   }
    //
    // }

    static index = class extends KarmaFieldsAlpha.field {

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
            const index = this.request("index");
            td.element.textContent = index+1;
          }
        };
      }
  
    }

    static delete = {
      type: "button",
      action: "delete",
      title: "Delete",
      dashicon: "no-alt",
      class: "array-delete",
      width: "auto"
    }

    static sortArrows = {
      type: "group",
      visible: [">", ["get", "number", "length"], "1"],
      children: [
        {
          action: "sort-up",
          type: "button",
          title: "Move Up",
          disabled: ["<", ["get", "number", "index"], 1],
          dashicon: "arrow-up-alt2",
          class: "array-sort-up",
          width: "auto"
        },
        {
          action: "sort-down",
          type: "button",
          title: "Move Down",
          disabled: [">=", ["+", ["get", "number", "index"], 1], ["get", "number", "length"]],
          dashicon: "arrow-down-alt2",
          class: "array-sort-up",
          width: "auto"
        }
      ]
    }

  }

  // -> moved from arrayRow because of getDescendants (needed for gallery fields)
  // static index = class extends KarmaFieldsAlpha.field {

  //   constructor(resource) {
  //     super({
  //       width: "5em",
  //       class: "array-index",
  //       ...resource
  //     });
  //   }

  //   build() {
  //     return {
  //       tag: "span",
  //       update: async td => {
  //         const index = await this.request("index");
  //         td.element.textContent = index+1;
  //       }
  //     };
  //   }

  // }

  // static delete = {
  //   type: "button",
  //   action: "delete",
  //   title: "Delete",
  //   dashicon: "no-alt",
  //   class: "array-delete",
  //   width: "auto"
  // }

}
