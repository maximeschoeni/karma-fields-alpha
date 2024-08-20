
KarmaFieldsAlpha.field.array = class extends KarmaFieldsAlpha.field.container {

  // constructor(resource) {
  //
  //   super(resource);
  //
  //   // if (!resource.body) {
  //   //
  //   //   resource.body = {
  //   //     type: "grid",
  //   //     children: resource.columns || resource.children
  //   //   };
  //   //
  //   // }
  //
  //   if (!resource.footer) {
  //
  //     resource.footer = {
  //       type: "footer",
  //       children: ["add"]
  //     };
  //
  //   }
  //
  // }

  // newChild(id) {
  //
  //   if (id === "body") {
  //
  //     return new KarmaFieldsAlpha.field.grid({
  //       children: this.resource.columns || this.resource.children || [],
  //       sortable: this.resource.sortable,
  //       ...this.resource.body
  //     }, "body", this);
  //
  //   } else if (id === "footer") {
  //
  //     return new KarmaFieldsAlpha.field.array.footer({
  //       children: ["add"],
  //       ...this.resource.footer
  //     }, "footer", this);
  //
  //   }
  //
  // }

  getBody() {

		const constructor = this.getConstructor(this.resource.body && this.resource.body.type || "grid");

		return new constructor({
      children: this.resource.columns || this.resource.children || [],
      sortable: this.resource.sortable,
      class: "array",
      style: "align-items: flex-start",
			...this.resource.body
		}, "body", this);

	}


  // getChild(index, ...path) {
  //
  //   let child = this.newChild(index);
  //
  //   if (child && path.length) {
  //
  //     return child.getChild(...path);
  //
  //   }
  //
  //   return child;
  //
  // }

  hasFocusInside() {

    // const focus = await this.getFocus();
    //
    // return focus && focus.length <= this.path.length + 1 && this.path.every((id, index) => id === focus[index]);

    return super.hasFocusInside();
  }

  // getChild(index) {
  //
  //   if (index === "body") {
  //
  //     return this.createChild({
  //       type: "grid",
  //       children: this.resource.columns || this.resource.children || [],
  //       ...this.resource.body
  //     }, "body");
  //
  //   // } else if (index === "header" && this.resource.header) {
  //   //
  //   //   return this.createChild({
  //   //     type: "header",
  //   //     ...this.resource.header
  //   //   }, "header");
  //
  // } else if (index === "footer" && this.resource.footer !== false) {
  //
  //     return this.createChild({
  //       type: "footer",
  //       children: ["add"],
  //       ...this.resource.footer
  //     }, "footer");
  //
  //   }
  //
  //
  //
  // }

  // getIndexOffset() {
  //
  //   return 0;
  //
  // }


  export() {

    const output = new KarmaFieldsAlpha.Content();

    if (this.resource.export !== false) {

      const body = this.getChild("body");
      const length = this.queryLength();

      if (length.loading) {

        output.loading = true;

      } else if (body) {

        const gridContent = body.export(0, length.toNumber());

        if (gridContent.loading) {

          output.loading = true;

        } else {

          output.value = gridContent.toString();

        }

      }

    }

    return output;
  }

  async import(collection) {

    const string = collection.value.shift();

    const grid = new KarmaFieldsAlpha.Content.Grid(string);

    const body = this.getChild("body");
    const length = this.getLength();

    await body.import(grid, 0, length);

  }


  queryLength() {

    const keys = this.getKeys();

    const length = new KarmaFieldsAlpha.Content(0);

    for (let key of keys) {

      const value = this.getContent(key);

      if (value.loading) {

        length.loading = true;

      } else {

        length.value = Math.max(length.value, value.toArray().length);

      }

    }

    return length;
  }

  getLength() {

    const keys = this.getKeys();

    let length = 0;

    for (let key of keys) {

      const value = this.getContent(key);

      length = Math.max(length, value.toArray().length);

    }

    return length;
  }

  getContentAt(index, key) {

    const cellContent = new KarmaFieldsAlpha.Content();
    const arrayKey = this.getKey();

    if (arrayKey) {

      const content = this.getContent(arrayKey);

      if (content.loading) {

        cellContent.loading = true;

      } else {

        const array = content.toArray();

        if (index < array.length) {

          cellContent.value = array[index] && array[index][key];

        } else {

          cellContent.notFound = true;

        }

      }

    } else {

      const content = this.getContent(key);

      if (content.loading) {

        cellContent.loading = true;

      } else {

        const array = content.toArray();

        if (index < array.length) {

          cellContent.value = array[index];

        } else {

          cellContent.notFound = true;

        }

      }

    }

    return cellContent;
  }

  async setValueAt(value, index, key) {

    const arrayKey = this.getKey();

    if (arrayKey) {

      let content = this.getContent(arrayKey);

      if (!content.loading) {

        const clone = KarmaFieldsAlpha.DeepObject.clone(content.toArray());

        if (!clone[index]) {

          clone[index] = {};

        }

        clone[index][key] = value;

        await this.setValue(clone, arrayKey);

      }

    } else {

      let content = this.getContent(key);

      if (!content.loading) {

        const clone = [...content.value];

        clone[index] = value;

        await this.setValue(clone, key);

      }

    }

  }

  async delete(index, length) {

    if (index === undefined && length === undefined) {

      const body = this.getChild("body");

      if (body) {

        const selection = body.querySelection();

        index = selection && selection.index || 0;
        length = selection && selection.length || 0;

      }

    }

    const keys = this.getKeys();

    let contents = keys.map(key => this.getContent(key));

    while (contents.some(content => content.loading)) {

      await this.render();
      contents = keys.map(key => this.getContent(key));

    }

    for (let j in contents) {

      const content = contents[j];
      const key = keys[j];

      const newContent = [...content.toArray()];

      newContent.splice(index, length);

      await this.setValue(newContent, key);

    }

  }

  async swap(index, target, length) {

    const keys = this.getKeys();

    let contents = keys.map(key => this.getContent(key));

    if (contents.some(content => content.loading)) {

      console.log(keys, contents);
      console.error("content is not loaded");

    }


    await this.save("sort", "Sort");

    for (let j in contents) {

      const content = contents[j];
      const key = keys[j];

      const newContent = [...content.toArray()];

      newContent.splice(target, 0, ...newContent.splice(index, length));

      await this.setValue(newContent, key);

    }

    const body = this.getChild("body");

    if (body) {

      await body.setFocus(true);
      await body.select(target, length);

    }

  }

  async add(num = 1, index = undefined) {

    let length = this.queryLength();

    while (length.loading) {

      await this.render();
      length = this.queryLength();

    }

    const body = this.getChild("body");

    if (index === undefined) {

      if (body) {

        index = body.getNewItemIndex();

      } else {

        index = length.toNumber();

      }

    }


    await this.save("add", "Insert");

    const keys = this.getKeys();
    let contents = keys.map(key => this.getContent(key));

    while (contents.some(content => content.loading)) {

      await this.render();
      contents = keys.map(key => this.getContent(key));

    }

    for (let j in contents) {

      const content = contents[j];
      const key = keys[j];

      const newContent = [...content.toArray()];

      newContent.splice(index, 0, ...Array(num));

      await this.setValue(newContent, key);

    }

    if (body) {

      const rowField = body.getChild(0);

      let defaults = rowField.exportDefaults();

      while (defaults.loading) {

        await this.render();
        defaults = rowField.exportDefaults();

      }

      for (let i = 0; i < num; i++) {

        const rowField = body.getChild(i + index);

        for (let key in defaults) {

          await rowField.setValue(defaults[key], key);

        }

      }

      await body.setFocus(true);
      await body.select(index, num);

    }

  }


  async sortUp(index, length = 1) {

    if (index > 0) {

      return this.swap(index, length, index-1);

    }

  }

  async sortDown(index, length = 1) {

    if (index + length < this.getLength().toNumber()) {

      return this.swap(index, length, index+1);

    }

  }

}

KarmaFieldsAlpha.field.array.footer = class extends KarmaFieldsAlpha.field.table.footer {

  constructor(resource, id, parent) {

    super({
      children: [
        "add"
      ],
      ...resource
    }, id, parent);

  }

}

KarmaFieldsAlpha.field.array.add = class extends KarmaFieldsAlpha.field.table.add {}
KarmaFieldsAlpha.field.array.delete = class extends KarmaFieldsAlpha.field.table.delete {}

// KarmaFieldsAlpha.field.array.row.delete = class extends KarmaFieldsAlpha.field.button {
//   constructor(resource) {
//     super({
//       request: ["delete"],
//       title: "Delete",
//       dashicon: "remove",
//       classes: ["array-delete", "simple-buttons"],
//       width: "min-content",
//       ...resource
//     });
//   }
// };


KarmaFieldsAlpha.field.grid.row.sortArrows = class extends KarmaFieldsAlpha.field.group {
  constructor(resource, id, parent) {
    super({
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
          disabled: [">=", ["+", ["getIndex"], 1], ["length", ["getValue"]]],
          dashicon: "arrow-down-alt2",
          class: "array-sort-up",
          width: "auto"
        }
      ]
    }, id, parent);
  }
};
