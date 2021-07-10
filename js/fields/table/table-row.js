KarmaFieldsAlpha.fields.tableRow = class extends KarmaFieldsAlpha.fields.container {

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

    this.trash = this.createChild({
      key: "trash",
      type: "field",
      value: 0
    });

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
    columns.forEach(column => {
      if (column.field) {
        this.createChild(column.field);
      }
    });
  }

  fill(columns) {
    this.children.forEach(child => {
      child.initValue(child.getDefault());
    });
  }

}
