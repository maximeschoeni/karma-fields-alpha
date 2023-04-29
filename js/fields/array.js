
KarmaFieldsAlpha.field.array = class extends KarmaFieldsAlpha.field {

  constructor(resource) {
    super(resource);

    // this.clipboard = new KarmaFieldsAlpha.Clipboard();
    // this.clipboard = this.createChild("clipboard");

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

  // getKeys(set = new Set()) {

  //   if (this.resource.children) {

  //     for (let resource of this.resource.children) {

  // 			this.createChild(resource).getKeys(set);

  // 		}

  //   }

  //   return set;
  // }

  // exportRows(index = 0, length = 999999) {

	// 	const values = this.getValue();
  //   const keys = this.getKeys();


  //   const data = [];

  //   length = Math.min(values.length - index, length);

  //   for (let i = 0; i < length; i++) {

  //     const rowField = this.createChild({
  //       type: "arrayRow",
  //       index: i + index,
  //       children: this.resource.children
  //     });

  //     const row = rowField.export();

  //     // for (let key in row) {

  //     //   if (typeof row[key] !== "string") {

  //     //     row[key] = KarmaFieldsAlpha.Clipboard.encode(row[key]);

  //     //   }

  //     // }

  //     // array.push(row);

  //     const array = [];

  //     for (let key in keys) {

  //       if (row[key] !== undefined) {

  //         array.push(row[key])

  //       }

  //     }

  //     data.push(array)

  //   }

  //   // const keys = this.getKeys(array);

  //   // const columns = this.getColumns(array);
  //   // // const data = [];

  //   // for (let key in columns) {

  //   //   for (let value of columns[key]) {

  //   //     data

  //   //   }

  //   // }

  //   // const data = KarmaFieldsAlpha.Clipboard.toDataArray(array);

  //   return KarmaFieldsAlpha.Clipboard.unparse(data);

  // }

  // importRows(array, index, length) {




  //   if (array.length) {

  //     for (let i = 0; i < array.length; i++) {

  //       const row = array[i];

  //       const rowField = this.createChild({
  //         type: "arrayRow",
  //         index: i+index,
  //         // key: (i+index).toString(),
  //         children: this.resource.children
  //       });

  //       rowField.import(row);

  //     }

  //   }

	// }





  // export(object = {}) {

	// 	// const values = await this.getValue();
  //   //
  //   // const array = [];
  //   //
  //   // for (let i = 0; i < values.length; i++) {
  //   //
  //   //   const rowField = this.createChild({
  //   //     type: "arrayRow",
  //   //     key: i.toString(),
  //   //     children: this.resource.children
  //   //   });
  //   //
  //   //   const row = await rowField.export(keys);
  //   //
  //   //   array.push(row);
  //   //
  //   // }

  //   let key = this.getKey();

  //   if (key) {

  //     object[key] = this.exportRows();

  //   } else {

  //     const data = [];
  //     const values = this.getValue();

  //     const keys = this.getKeys();

  //     for (let i = 0; i < values.length; i++) {

  //       const rowField = this.createChild({
  //         type: "arrayRow",
  //         index: i,
  //         children: this.resource.children
  //       });

  //       const object = rowField.export();
  //       const rows = [];

  //       for (key of keys) {

  //         if (object[key] !== undefined) {

  //           rows.push(object[key]);

  //         }

  //       }

  //       data.push(rows);

  //     }

  //     return KarmaFieldsAlpha.Clipboard.unparse(data);

  //     // const columns = this.getColumns(rows);

  //     // for (key in columns) {

  //     //   const data = columns[key].map(item => KarmaFieldsAlpha.Type.toArray(item));

  //     //   object[key] = KarmaFieldsAlpha.Clipboard.unparse(data);


  //     // }

  //   }

  //   return object;
	// }

  export(items = [], index = 0, length = 999999, colIndex = 0, colLength = 999999) {

    const values = this.getValue();
    const grid = new KarmaFieldsAlpha.Grid();
    const columns = this.resource.children.slice(colIndex, colIndex + colLength);

    for (let i = 0; i < Math.min(values.length - index, length); i++) {

      const rowField = this.createChild({
        type: "arrayRow",
        index: i + index,
        children: columns
      });

      const rowItems = rowField.export();

      grid.addRow(rowItems);

    }

    items.push(grid.toString());

    return items;

  }

  import(items, index = 0, length = 999999, colIndex = 0, colLength = 999999) {

    const string = items.shift();
    const grid = new KarmaFieldsAlpha.Grid(string);

    const columns = this.resource.children.slice(colIndex, colIndex + colLength);

    const values = [...this.getValue()];

    values.splice(index, length, ...grid.array.map(() => this.getDefault()));

    this.setValue(values);

    // for (let i = 0; i < Math.min(grid.array.length, length); i++) {
    for (let i = 0; i < grid.array.length; i++) {

      const child = this.createChild({
        children: columns,
        type: "arrayRow",
        index: i + index
      });

      const rowItems = grid.getRow(i);

      child.import(rowItems);

    }

  }



  // import(object) {

  //   let key = this.getKey();

  //   if (key) {

  //     if (object[key]) {

  //       let string = object[key];

  //       // array = this.decode(string);
  //       const data = KarmaFieldsAlpha.Clipboard.parse(string);
  //       const array = KarmaFieldsAlpha.Clipboard.toJson(data);


  //       for (let i = 0; i < array.length; i++) {

  //         const child = this.createChild({
  //           children: this.resource.children,
  //           type: "arrayRow",
  //           index: i
  //         });

  //         child.import(array[i]);

  //       }

  //     }

  //   } else {

  //     const keys = this.getKeys();

  //     for (key of keys) {

  //       if (object[key]) {

  //         let string = object[key];

  //         const data = KarmaFieldsAlpha.Clipboard.parse(string);

  //         for (let i = 0; i < data.length; i++) {

  //           const child = this.createChild({
  //             children: this.resource.children,
  //             type: "arrayRow",
  //             index: i
  //           });

  //           child.import({[key]: data[i][0]});

  //         }

  //       }

  //     }

  //   }

	// }


  // getSelection(subKey) {

  //   const key = this.getKey();

	// 	if (key) {

  //     const selection = this.parent.getSelection(key);

  //     if (selection) {

  //       return selection[subKey];

  //     }

  //   } else {

  //     return this.parent.getSelection(subKey);

  //   }

  // }

  // setSelection(values, subKey) {

  //   const key = this.getKey();

	// 	if (key) {

  //     this.parent.setSelection({[subKey]: values}, key);

  //   } else {

  //     this.parent.setSelection(values, subKey);

  //   }

  // }


  getDefault(defaults = {}) {

    let key = this.getKey();

    if (key) {

      defaults[key] = this.resource.default || [];

    } else {

      super.getDefault(defaults);

    }

    return defaults;
  }


  encode(jsonArray) {
    return JSON.stringify(jsonArray);

    // const data = KarmaFieldsAlpha.Clipboard.toDataArray(jsonArray);

    // return KarmaFieldsAlpha.Clipboard.unparse(data);
  }

  decode(string) {
    return string && JSON.parse(string) || [];

    // const data = KarmaFieldsAlpha.Clipboard.parse(string);
    // const json = KarmaFieldsAlpha.Clipboard.toJson(data);

    // return json;

  }

  paste(string, selection) {

    if (selection && selection instanceof KarmaFieldsAlpha.Selection) {

      const [current] = this.export([], selection.index, selection.length);

      if (string !== current) {

        this.import([string], selection.index, selection.length);

        // KarmaFieldsAlpha.History.save();
        this.parent.request("save");

      }

    } else if (selection) {

      const values = this.getValue();

      for (let i in values) {

        const child = this.createChild({
          id: i,
          index: i,
          type: "arrayRow",
          children: this.resource.children
        });

        if (selection[child.resource.index]) {

          child.paste(string, selection[child.resource.index]);

          break;

        }

      }

    }

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

    const keys = this.getKeys();

    const columns = {};

    for (let key of keys) {

      columns[key] = [];

    }

    for (let i = 0; i < rows.length; i++) {

      for (let key in rows[i]) {

        if (columns[key]) {

          columns[key][i] = rows[i][key];

        }

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

      return this.parent.getValue(key);

    } else {

      const keys = this.getKeys();

      const columns = {};

      for (key of keys) {

        columns[key] = this.parent.getValue(key);

      }

      return this.getRows(columns);

    }

  }

  setValue(value) {

    let key = this.getKey();

    if (key) {

      this.parent.setValue(value, key);

    } else {

      const columns = this.getColumns(value);

      for (key in columns) {

        this.parent.setValue(columns[key], key);

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

  // request(subject, content = {}, ...path) {


  //   switch (subject) {

  //     // case "state": {
  //     //   const [index, subkey] = path;
  //     //   const key = this.getKey();

  //     //   if (key) {

  //     //     const state = await this.parent.request("state", {}, key);

  //     //     if (state.multi) {

  //     //       return {
  //     //         ...state,
  //     //         values: state.values.map(value => value && value[index] && value[index][subkey])
  //     //       };

  //     //     } else if (state.value && state.value[index]) {

  //     //       return {
  //     //         ...state,
  //     //         value: state.value[index][subkey]
  //     //       };

  //     //     }

  //     //   } else {

  //     //     // const response = await this.parent.request("get", undefined, subkey);
  //     //     // const column = KarmaFieldsAlpha.Type.toArray(response);
  //     //     //
  //     //     // return column[index];


  //     //     const state = await this.parent.request("state", {}, subkey);

  //     //     if (state.multi) {

  //     //       return {
  //     //         ...state,
  //     //         values: state.values.map(value => KarmaFieldsAlpha.Type.toArray(value)[index])
  //     //       };

  //     //     } else {

  //     //       return {
  //     //         ...state,
  //     //         value: KarmaFieldsAlpha.Type.toArray(state.value)[index]
  //     //       };

  //     //     }

  //     //   }

  //     //   break;
  //     // }



  //     case "get": {
  //       const [index, subkey] = path;
  //       const key = this.getKey();

  //       if (key) {

  //         // if (subkey === "..") {
  //         //   return this.parent.request(subject, content, ...path.slice(2));
  //         // }

  //         // const array = await super.dispatch({
  //         //   action: "get",
  //         //   type: "array"
  //         // }).then(request => KarmaFieldsAlpha.Type.toArray(request.data));

  //         const values = this.parent.request("get", null, key);


  //         if (values) {

  //           return KarmaFieldsAlpha.Type.toArray(values[index] && values[index][subkey] || null);

  //         }

  //       } else {

  //         const values = this.parent.request("get", {}, subkey);

  //         if (values) {

  //           return KarmaFieldsAlpha.Type.toArray(values[index]);

  //         }

  //       }

  //       break;
  //     }

  //     case "set": {


  //       const [index, subkey] = path;
  //       const key = this.getKey();

  //       if (key) {

  //         const values = this.parent.request("get", {}, key);

  //         if (values) {

  //           const clone = KarmaFieldsAlpha.DeepObject.clone(values);

  //           if (!clone[index]) {

  //             clone[index] = {};

  //           }

  //           clone[index][subkey] = content;

  //           this.parent.request("set", clone, key);
  //         }

  //       } else {

  //         const values = this.parent.request("get", {}, subkey);

  //         if (values) {

  //           const clone = KarmaFieldsAlpha.DeepObject.clone(values);

  //           clone[index] = KarmaFieldsAlpha.Type.toObject(content);

  //           this.parent.request("set", clone, subkey);

  //         }



  //         // const response = this.parent.request("get", {}, subkey);
  //         // const column = KarmaFieldsAlpha.Type.toArray(response);

  //         // const clone = KarmaFieldsAlpha.DeepObject.clone(column);

  //         // const value = content.data;

  //         // clone[index] = value;

  //         // await this.parent.request("set", {data: clone}, subkey);

  //       }

  //       break;
  //     }


  //     case "add":
  //       KarmaFieldsAlpha.History.save();

  //       this.add();
  //       this.parent.request("render");
  //       break;

  //     case "delete":

  //       KarmaFieldsAlpha.History.save();
  //       this.delete(path[0]);
  //       this.parent.request("render");
  //       break;

  //     // case "edit":
  //     //   await this.render();
  //     //   break;

  //     // case "fetch": {
  //     //   const [index, subkey, ...subpath] = path;
  //     //   const key = this.getKey();
  //     //   if (key) {
  //     //     return this.parent.request(subject, content, key, index, subkey, ...subpath);
  //     //   }
  //     //   return this.parent.request(subject, content, subkey, index, ...subpath);
  //     // }

  //     case "sort-up": {
  //       const [index] = path
  //       this.swap(index, 1, index-1);
  //       this.render();
  //       break;
  //     }
  //     case "sort-down": {
  //       const [index] = path
  //       this.swap(index, 1, index+1);
  //       this.render();
  //       break;
  //     }

  //     case "length": {
  //       const values = this.getValue();
  //       return values.length;
  //     }

  //     case "path": {
  //       const key = this.getKey();
  //       if (key) {
  //         path = [key, ...path];
  //       }
  //       return this.parent.request(subject, content, ...path);
  //     }

  //     case "get-option":
  //     case "set-option": {
  //       const key = this.getKey();
  //       if (key) {
  //         path = [key, ...path];
  //       }
  //       return this.parent.request(subject, content, ...path);
  //     }

  //     case "modified":
  //     default: {
  //       const [index, subkey] = path;
  //       const key = this.getKey();
  //       return this.parent.request(subject, content, key || subkey);
  //     }

  //   }


  // }

  // expect(action, object) {

  //   switch (action) {

  //     case "export": {
  //       // todo...
  //       break;
  //     }

  //     case "import": {
  //       // todo...
  //       break;
  //     }

  //     // case "gather": {

  //     //   let set = new Set();

  //     //   // const values = await this.request("get");
  //     //   const values = await this.getValue();

  //     //   for (let i = 0; i < values.length; i++) {

  //     //     const row = this.createChild({type: "arrayRow", key: i.toString(), children: this.resource.children});

  //     //     const values = await row.expect(action, object);

  //     //     if (values) {

  //     //       set = new Set([...set, ...values]);

  //     //     }

  //     //   }

  //     //   return set;
  //     // }

  //     case "keyup": {

  //       // console.log(await this.parent.request("path"));

  //     }

  //     default: {

  //       const values = this.getValue();

  //       for (let i = 0; i < values.length; i++) {

  //         const row = this.createChild({type: "arrayRow", key: i.toString(), children: this.resource.children});

  //         row.expect(action, object);

  //       }

  //     }

  //   }

  // }

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

    const child = this.createChild({
      ...this.resource,
      type: "arrayRow"
    });

    const defaults = child.getDefault();

    this.setValue([...array, defaults]);

    // KarmaFieldsAlpha.History.save();
    this.parent.request("save");

    this.parent.render();
  }

  delete(index) {

    const values = [...this.getValue()];

    values.splice(index, 1);

    this.setValue(clone);

    // KarmaFieldsAlpha.History.save();
    this.parent.request("save");

    this.parent.render();
  }

  // insertBlank(num, index, length) {

  //   const values = [...this.getValue()];
  //   const defaults = this.getDefault();
  //   const tokens = [];

  //   while (tokens.length < num) {

  //     tokens.push(defaults);

  //   }

  //   values.splice(index, length, tokens);

  //   this.setValue(values);



  //   // const values = this.getValue();
  //   // const clone = KarmaFieldsAlpha.DeepObject.clone(values);

  //   // clone.splice(index, length, ...data);

  //   // this.setValue(clone);

  // }

  sortUp(index) {

    if (index > 0) {

      this.swap(index, 1, index-1);

      this.debounce("editing", () => {

        KarmaFieldsAlpha.History.save();

      }, 1000);

      this.render();
    }

  }

  sortDown(index) {

    if (index < this.getValue().length - 1) {

      this.swap(index, 1, index+1);

      this.debounce("editing", () => {

        KarmaFieldsAlpha.History.save();

      }, 1000);

      this.render();
    }

  }


  build() {
    return {
      class: "array",
      update: array => {
        array.children = [
          // this.clipboard.build(),
          {
            class: "array-body",
            init: table => {


            },
            update: table => {

              // this.render = table.render;

              const values = this.getValue();

              table.element.classList.toggle("loading", !values);

              if (values) {

                table.element.classList.toggle("empty", values.length === 0);

                const hasHeader = this.resource.children.some(column => column.header || column.label); // header is deprecated

                let selection = this.getSelection();

                if (!(selection instanceof KarmaFieldsAlpha.Selection)) {

                  selection = null; // -> selection target a deeper field

                }

                // this.clipboard.onBlur = event => {

                //   if (this.selection) {

                //     const sortManager = new KarmaFieldsAlpha.SortManager(table.element);

                //     sortManager.selection = this.selection;
                //     sortManager.clear();

                //     this.selection = null;

                //   }

                // }

                // this.clipboard.onInput = value => {

                //   const array = JSON.parse(value || "[]");

                //   if (this.selection) {

                //     KarmaFieldsAlpha.History.save();

                //     this.importRows(array, this.selection.index, this.selection.length);
                //     this.selection = null;
                //     this.parent.request("render");

                //   }

                // }



                // table.element.colCount = this.resource.children.length;
                // table.element.rowCount = values.length;
                // table.element.colHeader = hasHeader ? 1 : 0;


                const sorter = new KarmaFieldsAlpha.Sorter(table.element);
                sorter.colCount = this.resource.children.length;
                sorter.rowCount = values.length;
                sorter.selection = selection;

                if (hasHeader) {

                  sorter.colHeader = 1;
                }

                sorter.onselect = newSelection => {


                  // if (!selection && sorter.firstIndex === sorter.lastIndex) {

                  //   return;

                  // }



                  if (!newSelection.equals(selection)) {

                    selection = newSelection;

                    this.setSelection(newSelection);

                    // const slice = values.slice(selection.index, selection.index + selection.length);
                    // const string = this.encode(slice);

                    // const string = this.exportRows(selection.index, selection.length);

                    const [string] = this.export([], selection.index, selection.length);

                    KarmaFieldsAlpha.Clipboard.write(string);

                    // KarmaFieldsAlpha.History.save();

                    this.parent.render();

                  }

                }

                sorter.onsort = () => {

                  if (!sorter.selection.equals(selection)) {



                    this.swap(selection.index, selection.length, sorter.selection.index);

                    KarmaFieldsAlpha.History.save();

                    this.setSelection(sorter.selection);

                    selection = sorter.selection;

                    KarmaFieldsAlpha.Clipboard.focus();

                    this.parent.render();

                  }

                }

                sorter.onbackground = () => {

                  selection = new KarmaFieldsAlpha.Selection(values.length, 0);
                  this.setSelection(selection);
                  KarmaFieldsAlpha.Clipboard.write("");
                  this.parent.render();

                }

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
                      index: index,
                      id: index,
                      data: this.resource.data && this.resource.data[index],
                      selection: this.resource.selection && this.resource.selection[index],
                      uid: `${this.resource.uid}-${index}`,
                      type: "arrayRow"
                    });

                    return [
                      ...array,
                      ...this.resource.children.map((column, colIndex) => {

                        const field = row.createChild({id: colIndex, ...column, index: colIndex, uid: `${this.resource.uid}-${colIndex}`});

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

                            td.element.classList.toggle("selected", Boolean(selection && selection.contains(index)));





                            // this.selection = null;
                            // td.element.classList.remove("selected");
                            // td.element.onmousedown = event => {

                            //   if (event.target !== td.element) {
                            //     return;
                            //   }

                            //   if (event.buttons === 1) {

                            //     const sortManager = new KarmaFieldsAlpha.SortManager(table.element);

                            //     sortManager.selection = this.selection;

                            //     sortManager.onSelect = segment => {

                            //       this.selection = segment;

                            //       // debugger;
                            //       // console.log(await row.request("path"));


                            //       const array = this.exportRows(segment.index, segment.length);
                            //       const value = JSON.stringify(array);

                            //       this.clipboard.output(value);
                            //       this.clipboard.focus();

                            //       this.onRenderControls();

                            //     }

                            //     sortManager.onSort = (index, length, target) => {

                            //       this.swap(index, length, target);

                            //       sortManager.clear();

                            //       this.parent.request("render");

                            //     }

                            //     sortManager.select(event, colIndex, index);

                            //   }

                            // };

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
                    id: "footer",
                    uid: `${this.resource.uid}-footer`,
                    ...this.resource.footer
                  }).build();
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

    // request(subject, content, key, ...path) {

    //   switch (subject) {

    //     case "get": {

    //       if (path.length === 1 && path[0] === "index") {

    //         return this.resource.index;

    //       } else if (path.length === 1 && path[0] === "length") {

    //         return this.parent.request("length");

    //       }

    //       return getValue(key);
    //     }

    //     case "set": {

    //       this.setValue(content, key);

    //     }

    //     case "index":
    //       return this.index;

    //     default:
    //       return this.parent.request(subject, content, this.getKey(), ...path);
    //       break;
    //   }

    // }

    getValue(key) {

      const values = this.parent.getValue(key);

      if (values) {

        const object = values[this.resource.index];

        if (object) {

          return KarmaFieldsAlpha.Type.toArray(object[key]);

        }

        return [];

      }

    }

    setValue(value, key) {

      const array = this.parent.getValue(key);

      if (array) {

        const clone = array.slice();

        clone[this.resource.index] = {...clone[this.resource.index], [key]: value};

        this.parent.setValue(clone);

      }

    }

    getIndex() {

      return this.resource.index;

    }

    // getKeys() {

  	// 	let keys = new Set();

    //   for (let resource of this.resource.children) {

    //     const child = this.createChild(resource);
    //     keys = new Set([...keys, ...child.getKeys()]);

    //   }

  	// 	return keys;
  	// }

    // getKeys(set) {

    //   // -> do not consider as keyed

    //   for (let resource of this.resource.children) {

    //     this.createChild(resource).getKeys(set);

    //   }

    // }

    // getDefault(defaults = {}) {

    //   let key = this.getKey();

    //   if (key) {

    //     defaults[key] = this.resource.default || [];

    //   } else {

    //     super.getDefault(defaults);

    //   }

  	// 	return defaults;
  	// }

    // export(object = {}) {

    //   if (this.resource.children) {

    //     for (let resource of this.resource.children) {

    //       this.createChild(resource).export(object);

    //     }

    //   }

    //   return object;
    // }

    // import(object) {

    //   if (this.resource.children) {

    //     for (let resource of this.resource.children) {

    //       this.createChild(resource).import(object);

    //     }

    //   }

    // }

    // expect(action, object) {

    //   console.error("deprecated");

    //   switch (action) {

    //     case "export": {
    //       // todo...
    //       break;
    //     }

    //     case "import": {
    //       // todo...
    //       break;
    //     }

    //     // case "keyup": {

    //     //   console.log(this);

    //     // }

    //     // case "gather": {

    //     //   let set = new Set();

    //     //   if (this.resource.children) {

    //     //     for (let resource of this.resource.children) {

    //     //       const child = this.createChild(resource);

    //     //       const values = await child.expect(action, object);

    //     //       if (values) {

    //     //         set = new Set([...set, ...values]);

    //     //       }

    //     //     }

    //     //   }

    //     //   return set;
    //     // }

    //     default: {

    //       if (this.resource.children) {

    //         for (let resource of this.resource.children) {

    //           const child = this.createChild(resource);

    //           child.expect(action, object);

    //         }

    //       }

    //     }

    //   }

    // }



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
          update: td => {
            const index = this.parent.getIndex();
            td.element.textContent = index+1;
          }
        };
      }

    }

    static delete = {
      type: "button",
      action: "delete",
      value: ["index"],
      title: "Delete",
      dashicon: "no-alt",
      class: "array-delete",
      width: "auto"
    }

    static sortArrows = {
      type: "group",
      visible: [">", ["length", ["getValue"]], "1"],
      children: [
        {
          action: "sortUp",
          value: ["index"],
          type: "button",
          title: "Move Up",
          disabled: ["<", ["length", ["getValue"]], 1],
          dashicon: "arrow-up-alt2",
          class: "array-sort-up",
          width: "auto"
        },
        {
          action: "sortDown",
          value: ["index"],
          type: "button",
          title: "Move Down",
          disabled: [">=", ["+", ["get", "number", "index"], 1], ["length", ["getValue"]]],
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
