
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

    if (values) {

      const grid = new KarmaFieldsAlpha.Grid();
      const columns = this.resource.children.slice(colIndex, colIndex + colLength);

      for (let i = 0; i < Math.min(values.length - index, length); i++) {

        const rowField = this.createChild({
          type: "row",
          index: i + index,
          children: columns
        });

        const rowItems = rowField.export();

        grid.addRow(rowItems);

      }

      items.push(grid.toString());

    }

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
        type: "row",
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


  // encode(jsonArray) {
  //   return JSON.stringify(jsonArray);
  //
  //   // const data = KarmaFieldsAlpha.Clipboard.toDataArray(jsonArray);
  //
  //   // return KarmaFieldsAlpha.Clipboard.unparse(data);
  // }
  //
  // decode(string) {
  //   return string && JSON.parse(string) || [];
  //
  //   // const data = KarmaFieldsAlpha.Clipboard.parse(string);
  //   // const json = KarmaFieldsAlpha.Clipboard.toJson(data);
  //
  //   // return json;
  //
  // }

  follow(selection, callback) {

    if (selection.final) {

      return callback(this, selection);

    } else {

      const values = this.getValue();

      for (let i in values) {

        const child = this.createChild({
          id: i,
          index: i,
          type: "row",
          children: this.resource.children
        });

        if (selection[child.resource.index]) {

          return child.follow(selection[child.resource.index], callback);

        }

      }

    }

    return set;
  }

  paste(string, selection) {

    console.error("DEPRECATED");

    if (selection && selection.final && selection instanceof KarmaFieldsAlpha.Selection) {

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
          type: "row",
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

      const row = this.createChild({
        type: "row",
        children: this.resource.children
      });

      const keys = row.getKeys();

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
      type: "row"
    });

    // const defaults = child.getDefault();

    this.setValue([...array, {}]);


    this.save(`${this.resource.uid}-add`);

    // KarmaFieldsAlpha.History.save();
    // this.parent.request("save");
    //
    // this.parent.render();
  }

  delete(index) {

    const values = [...this.getValue()];

    values.splice(index, 1);

    this.setValue(values);

    this.save(`${this.resource.uid}-delete`);

    // KarmaFieldsAlpha.History.save();
    // this.parent.request("save");
    //
    // this.parent.render();
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

      // this.debounce("editing", () => {
      //
      //   KarmaFieldsAlpha.History.save();
      //
      // }, 1000);
      //
      // this.render();
    }

  }

  sortDown(index) {

    if (index < this.getValue().length - 1) {

      this.swap(index, 1, index+1);

      // this.debounce("editing", () => {
      //
      //   KarmaFieldsAlpha.History.save();
      //
      // }, 1000);
      //
      // this.render();
    }

  }


  build() {
    return {
      class: "array",
      update: array => {

        array.children = [
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

                if (selection && !selection.final) {

                  selection = undefined; // -> selection target a deeper field

                }


                const sorter = new KarmaFieldsAlpha.Sorter(table.element);
                sorter.colCount = this.resource.children.length;
                sorter.rowCount = values.length;
                sorter.selection = selection;

                if (hasHeader) {

                  sorter.colHeader = 1;
                }

                // this.mousedown = event => {
                //
                //   sorter.tracker.trigger(event);
                //
                //   // this.parent.request("mousedown", event);
                //
                // }

                sorter.onselect = newSelection => {

                  // newSelection.final = true;

                  // if (!selection && sorter.firstIndex === sorter.lastIndex) {

                  //   return;

                  // }



                  // if (!newSelection.equals(selection)) {
                  if (!KarmaFieldsAlpha.Selection.compare(newSelection, selection)) {

                    selection = newSelection;



                    // const slice = values.slice(selection.index, selection.index + selection.length);
                    // const string = this.encode(slice);

                    // const string = this.exportRows(selection.index, selection.length);

                    const [string] = this.export([], selection.index, selection.length);

                    KarmaFieldsAlpha.Clipboard.write(string);

                    this.setSelection(newSelection);

                    this.render();

                    // KarmaFieldsAlpha.History.save();

                    // this.parent.render();

                  }

                }

                sorter.onSelectionChange = newSelection => {
                  this.setSelection(newSelection);
                }

                sorter.onPaintRow = elements => {
                  elements.forEach(element => element.classList.add("selected"))
                }

                sorter.onUnpaintRow = elements => {
                  elements.forEach(element => element.classList.remove("selected"))
                }


                sorter.onsort = () => {

                  // if (!sorter.selection.equals(selection)) {
                  if (!KarmaFieldsAlpha.Selection.compare(sorter.selection, selection)) {



                    this.swap(selection.index, selection.length, sorter.selection.index);

                    // KarmaFieldsAlpha.History.save();



                    selection = sorter.selection;

                    KarmaFieldsAlpha.Clipboard.focus();

                    // this.parent.render();

                    this.setSelection(sorter.selection);

                  }

                }

                table.element.onfocusin = event => {

                  // console.log("array onfocusin ");
                  this.render(); // unselect last field when input gains focus inside array
                }

                // sorter.onbackground = () => {
                //
                //   selection = new KarmaFieldsAlpha.Selection(values.length, 0);
                //   // selection.final = true;
                //
                //   KarmaFieldsAlpha.Clipboard.write("");
                //
                //   this.setSelection(selection);
                //   // this.parent.render();
                //
                // }

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
                      // data: this.resource.data && this.resource.data[index],
                      // selection: this.resource.selection && this.resource.selection[index],
                      // uid: `${this.resource.uid}-${index}`,
                      type: "row"
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

                            // td.element.classList.toggle("selected", Boolean(selection && selection.contains(index)));
                            td.element.classList.toggle("selected", Boolean(selection && KarmaFieldsAlpha.Selection.containRow(selection, index)));


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

                // const row = this.createField({type: "row"});

                table.element.style.gridTemplateColumns = this.resource.children.map(resource => resource.width || "1fr").join(" ");
                // table.element.style.gridTemplateColumns = this.resource.children.map(column => row.createField(column).resource.width || "1fr").join(" ");



              }


            }
          },
          {
            class: "array-footer",
            child: {
              class: "array-footer-content",
              // init: footer => {
              //   footer.element.onmousedown = event => {
              //     event.preventDefault(); // -> prevent losing focus on selected items
              //   }
              // },
              update: footer => {
                if (this.resource.footer !== false) {
                  footer.child = this.createChild({
                    type: "footer",
                    ...this.resource.footer,
                    index: "footer"
                  }).build();
                }
              }
            }
          }
        ];
      }
    };
  }

}

KarmaFieldsAlpha.field.array.footer = class extends KarmaFieldsAlpha.field.container {

  constructor(resource) {

    super({
      display: "flex",
      children: [
        "add"
      ],
      ...resource
    });

  }

}

KarmaFieldsAlpha.field.array.footer.add = {
  type: "button",
  id: "add",
  action: "add",
  title: "+"
};


KarmaFieldsAlpha.field.array.row = class extends KarmaFieldsAlpha.field {

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

}



// KarmaFieldsAlpha.field.array.row.delete = {
//   type: "button",
//   action: "delete",
//   value: ["index"],
//   title: "Delete",
//   dashicon: "no-alt",
//   class: "array-delete",
//   width: "auto"
// };

KarmaFieldsAlpha.field.array.row.delete = class extends KarmaFieldsAlpha.field.button {
  constructor(resource) {
    super({
      action: "delete",
      value: ["index"],
      title: "Delete",
      dashicon: "no-alt",
      class: "array-delete",
      width: "auto",
      ...resource
    });
  }
};

KarmaFieldsAlpha.field.array.row.sortArrows = {
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
};

KarmaFieldsAlpha.field.array.row.index = {
  type: "text",
  value: ["+", ["request", "getIndex"], 1],
  style: "width: 40px"
};
