KarmaFieldsAlpha.fields.tableRow = class extends KarmaFieldsAlpha.fields.field {

  // constructor(resource, domain, parent) {
  //   super(resource, domain, parent);

    // if (this.parent.resource.column) {
    //   this.parent.resource.columns.forEach(function(column) {
    //     if (column.field) {
    //       row.createChild(column.field);
    //     }
    //   });
    // }

  initField() {

    // this.trash = this.createChild({
    //   key: "trash",
    //   type: "field",
    //   default: "0"
    // });

    if (this.resource.columns) {
      this.resource.columns.forEach(column => {
        if (column.field) {
          this.createChild(column.field);
        }
      });
    }

  }

  async edit(hard) {

		if (hard) {
			await this.render();
		}
    return super.edit();
  }



  // render() {
  //   return Promise.all(this.children.map(child => {
  //     return child.render();
  //   }));
  // }

  // async edit() {
  //
  //   await super.edit();
  //
  //   // await this.render();
  //
  // }


  fetchValue(expectedType, key, ...path) {

    if (key === "id" && !path.length) {
      return this.resource.key;
    }

    return super.fetchValue(expectedType, key, ...path);
  }

  getValue(key, ...path) {

    if (key === "id" && !path.length) {
      return this.resource.key;
    }

    return super.getValue(key, ...path);
  }

  // fill() {
  //
  //   super.fill();
  // }

  // initValue(item) {
  //
  //   if (item.id && this.resource.key !== item.id) {
  //      field.ids.replace(key, item.id, "set");
  //    }
  // }

  create(columns) {
    console.error("Deprecated create");
    columns.forEach(column => {
      if (column.field) {
        this.createChild(column.field);
      }
    });
  }

  // fill(columns) {
  //   return Promise.all(this.children.map(async child => child.fill()));
  // }

}


// KarmaFieldsAlpha.fields.numberField = class extends KarmaFieldsAlpha.fields.field {
//
//   getEmpty() {
//     return 0;
//   }
//   convert(value) {
//     return value && Number(value) || 0;
//   }
//
// }
