
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

  async hasFocusInside() {

    const focus = await this.getFocus();

    return focus && focus.length <= this.path.length + 1 && this.path.every((id, index) => id === focus[index]);
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


  async export() {

    const output = new KarmaFieldsAlpha.Content();

    if (this.resource.export !== false) {

      const body = this.getChild("body");
      const length = await this.getLength();

      if (length.loading) {

        output.loading = true;

      } else if (body) {

        const gridContent = await body.export(0, length.toNumber());

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
    const length = await this.getLength();

    await body.import(grid, 0, length.toNumber());

  }


  async getLength() {

    const keys = this.getKeys();

    const length = new KarmaFieldsAlpha.Content(0);

    for (let key of keys) {

      const value = await this.getContent(key);

      if (value.loading) {

        length.loading = true;

      } else {

        length.value = Math.max(length.value, value.toArray().length);

      }

    }

    return length;
  }

  async getContentAt(index, key) {

    const cellContent = new KarmaFieldsAlpha.Content();
    const arrayKey = this.getKey();

    if (arrayKey) {

      const content = await this.getContent(arrayKey);

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

      const content = await this.getContent(key);

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

      let content = await this.getContent(arrayKey);

      if (!content.loading) {

        // const clone = new KarmaFieldsAlpha.Content();

        const clone = KarmaFieldsAlpha.DeepObject.clone(content.toArray());

        // clone.value[index] = {...clone.value[index]};

        if (!clone[index]) {

          clone[index] = {};

        }

        clone[index][key] = value;

        await this.setValue(clone, arrayKey);

      }

    } else {

      let content = await this.getContent(key);

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

        const selection = await body.querySelection();

        index = selection && selection.index || 0;
        length = selection && selection.length || 0;

      }

    }

    const keys = this.getKeys();

    let contents = await Promise.all(keys.map(key => this.getContent(key)));

    while (contents.some(content => content.loading)) {

      await this.render();
      contents = await Promise.all(keys.map(key => this.getContent(key)));

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

    // let contents = keys.map(key => this.getContent(key));

    let contents = await Promise.all(keys.map(key => this.getContent(key)));

    // while (contents.some(content => content.loading)) {
    //
    //   yield;
    //   contents = await Promise.all(keys.map(key => this.getContent(key)));
    //
    // }

    // while (contents.some(content => content.loading)) {
    //
    //   yield;
    //   contents = keys.map(key => this.getContent(key));
    //
    // }

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

    let length = await this.getLength();

    while (length.loading) {

      await this.render();
      length = await this.getLength();

    }

    const body = this.getChild("body");

    if (index === undefined) {

      if (body) {

        index = await body.getNewItemIndex();

      } else {

        index = length.toNumber();

      }

    }


    await this.save("add", "Insert");

    // this.addAt(index, 1)

    const keys = this.getKeys();
    // let contents = keys.map(key => this.getContent(key));
    let contents = await Promise.all(keys.map(key => this.getContent(key)));

    while (contents.some(content => content.loading)) {

      await this.render();
      contents = await Promise.all(keys.map(key => this.getContent(key)));

    }

    for (let j in contents) {

      const content = contents[j];
      const key = keys[j];

      const newContent = [...content.toArray()];

      newContent.splice(index, 0, ...Array(num));

      await this.setValue(newContent, key);

    }

    if (body) {

      const rowField = await body.getChild(0);

      let defaults = await rowField.exportDefaults();

      while (defaults.loading) {

        defaults = await rowField.exportDefaults();

      }

      for (let i = 0; i < num; i++) {

        const rowField = body.getChild(i + index);

        // yield* rowField.create();

        for (let key in defaults) {

          rowField.setValue(defaults[key], key);

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

  // getChild(index) {
  //
  //   return KarmaFieldsAlpha.field.table.prototype.getChild.call(this, index);
  //
  // }

  // buildHeader() {
  //
  //   return KarmaFieldsAlpha.field.table.prototype.buildHeader.call(this);
  //
  // }
  //
  // *buildFooter() {
  //
  //   if (this.resource.footer !== false) {
  //
  //     const footer = this.createChild({
  //       type: "footer",
  //       ...(this.resource.controls || this.resource.footer)
  //     }, "footer");
  //
  //     yield footer.build();
  //
  //   }
  //
  // }

  // buildFooter() {
  //
  //   return KarmaFieldsAlpha.field.table.prototype.buildFooter.call(this);
  //
  // }

  // *buildParts() {
  //
  //   yield {
  //     class: "table-body",
  //     child: this.getChild("body").build()
  //   };
  //
  //   if (this.resource.footer !== false) {
  //
  //     yield {
  //       class: "table-footer table-control",
  //       child: this.getChild("footer").build(),
  //       // update: footer => {
  //       //   const isLoading = this.request("hasTask");
  //       //   footer.element.classList.toggle("loading", Boolean(isLoading));
  //       // }
  //     };
  //
  //   }
  //
  // }
  //
  // build() {
  //
  //   return KarmaFieldsAlpha.field.table.prototype.build.call(this);
  //
  // }

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
