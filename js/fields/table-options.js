

KarmaFieldsAlpha.fields.tableOptions = class extends KarmaFieldsAlpha.fields.field {

  constructor(...path) {
    super(...path);


    this.buffer = new KarmaFieldsAlpha.LocalStorage(this.resource.driver, "options");

    // this.child = this.createChild({
    //   type: "form",
    //   children: [
    //     {
    //       type: "input",
    //       key: "ppp",
    //       label: "Items number",
    //       input: {type: "number", style: "max-width:5em;"}
    //     },
    //     {
    //       key: "columns",
    //       type: "checkboxes",
    //       label: "Display columns",
    //       options: this.resource.columns.map((column, index) => {
    //         return {
    //           key: index.toString(),
    //           name: column.title
    //         }
    //       })
    //     },
    //     {
    //       type: "group",
    //       display: "flex",
    //       children: [
    //         {
    //           type: "submit",
    //           style: "min-width:0",
    //           value: "submit",
    //           title: "Save"
    //         },
    //         {
    //           type: "button",
    //           style: "min-width:0;",
    //           value: "closeoptions",
    //           title: "Close"
    //         }
    //       ]
    //     }
    //
    //   ]
    // });

  }

  // async edit(value) {
  //
  //   if (value === "close-options") {
  //
  //     this.open = false;
  //     super.edit(value);
  //
  //   }
  //   //  else if (value === "submit") {
  //   //
  //   //   super.edit("edit-options");
  //   //
  //   // }
  //
  //
  //
  // }

  async save(delta) {
    //
    // if (delta.columns) {
    //   delta.columns = delta.columns.map(item => Number(item)).sort();
    // }


    this.buffer.merge(delta);

    // if (delta.ppp && KarmaFieldsAlpha.Nav.hasParam("ppp") && KarmaFieldsAlpha.Nav.getParam("ppp") !== delta.ppp) {
    //
    //   KarmaFieldsAlpha.Nav.setParam("ppp", delta.ppp.toString());
    //   // this.setValue(null, ppp, "ppp");
    //
    // }

    if (delta.ppp && super.getParam("ppp") !== delta.ppp) {

      super.setParam(delta.ppp.toString(), "ppp");

    }

    this.parent.edit("edit-options");

  }

  // async fetchValue(deprec, key) {
  //
  //   let value = await super.fetchValue(null, key) || [];
  //
  //   if (key === "columns") {
  //     value = value.map(item => item.toString());
  //   }
  //
  //   return value;
  // }
  //
  // async setValue(deprec, value, key) {
  //
  //   if (key === "columns") {
  //     value = value.map(item => Number(item));
  //     value.sort();
  //   }
  //
  //   await super.setValue(null, value, key);
  //
  // }
  //
  // getParam(key) {
  //
  //   switch (key) {
  //
  //     case "ppp":
  //       return Number(this.buffer.get(key) || super.getParam(key) || this.resource.ppp || 10);
  //
  //     case "columns":
  //       return this.buffer.get(key) || this.resource.columns.map((column, index) => index.toString()) || [];
  //
  //     default:
  //       return this.buffer.has(key) && this.buffer.get(key).toString();
  //
  //   }
  //
  // }

	// async edit(value) {
  //
  //   if (value === "submit") {
  //
  //     await this.submit();
  //
  //     await this.parent.edit("edit-options");
  //
  //   } else if (value === "close-options") {
  //
	// 		await this.parent.edit(value);
  //
	// 	}
  //
	// }

  getParam(key) {

    return this.buffer.get(key);

  }

  setParam(value, key) {

    this.buffer.set([value], key);

  }

  build() {

    return this.createChild({
      id: "form",
      type: "form",
      children: [
        {
          type: "input",
          key: "ppp",
          label: "Items number",
          input: {type: "number", style: "max-width:5em;"}
        },
        {
          key: "columns",
          type: "checkboxes",
          label: "Display columns",
          options: this.resource.columns.map((column, index) => {
            return {
              key: index.toString(),
              name: column.title
            }
          })
        },
        {
          type: "group",
          display: "flex",
          children: [
            {
              type: "submit",
              style: "min-width:0",
              value: "submit",
              title: "Save"
            },
            {
              type: "button",
              style: "min-width:0;",
              value: "close-options",
              title: "Close"
            }
          ]
        }

      ]
    }).build();

  }


}
