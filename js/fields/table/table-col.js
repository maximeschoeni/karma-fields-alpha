

KarmaFieldsAlpha.fields.tableCol = class TableCol extends KarmaFieldsAlpha.fields.field {

  // constructor(resource, domain, parent) {
  //   super(resource, domain, parent);
  //   this.datatype = "array";
  // }

  getEmpty() {
    return [];
  }

  stringify(value) {

    return JSON.stringify(value);
  }

  parse(value) {
    return JSON.parse(value);
  }

  add(items) {
    let values = this.getValue().concat(items);
    this.setValue(values);
    // const field = this;
    // return this.getValueAsync().then(function(values) {
    //   // values.push(item);
    //   return field.saveValue(values.concat(items), false, true);
    // });
  }

  // async add(item) {
  //   let values = await this.getValueAsync();
  //   values.push(item);
  //   return this.updateValue(values);
  // }

  remove(items) {
    let values = this.getValue();
    values = values.filter(function(value) {
      return items.indexOf(value) === -1;
    });
    this.setValue(values);
    // const field = this;
    // return this.getValueAsync().then(function(values) {
    //   values = values.filter(function(value) {
    //     return items.indexOf(value) === -1;
    //   });
    //   return field.saveValue(values, false, true);
    // });
  }

  replace(item, newItem) {
    const values = this.getValue();
    const index = values.indexOf(item);
    if (index > -1) {
      values.splice(index, 1, newItem);
      this.setValue(values, context);
    }
    // const field = this;
    // return this.getValueAsync().then(function(values) {
    //   const index = values.indexOf(item);
    //   if (index > -1) {
    //     values.splice(index, 1, newItem);
    //     return field.saveValue(values, false, true);
    //   }
    // });
  }

  getPrev(rowId) {
    let ids = this.getValue();
    let index = ids.indexOf(rowId);
    if (index > 0) {
      return ids[index-1];
    }
    // this.getValueAsync().then(function(ids) {
    //   let index = ids.indexOf(rowId);
    //   if (index > 0) {
    //     return ids[index-1];
    //   }
    // });
  }

  getNext(rowId) {
    let ids = this.getValue();
    let index = ids.indexOf(rowId);
    if (index > -1 && index < ids.length - 1) {
      return ids[index+1];
    }
    // this.getValueAsync().then(function(ids) {
    //   let index = ids.indexOf(rowId);
    //   if (index > -1 && index < ids.length - 1) {
    //     return ids[index+1];
    //   }
    // });
  }

}
