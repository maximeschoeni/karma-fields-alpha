
// KarmaFieldsAlpha.fields.tableCol = class TableCol extends KarmaFieldsAlpha.fields.field {

// KarmaFieldsAlpha.fields.tableCol = class TableCol extends KarmaFieldsAlpha.fields.field {
//
//   // constructor(resource, domain, parent) {
//   //   super(resource, domain, parent);
//   //   this.datatype = "array";
//   // }
//
//   getValue() {
//     return this.children.map(child => child.getValue());
//   }
//
//   setValue(values) {
//     values.forEach((value, index) => {
//       const child = this.getChild(index) || this.createChild({
//         type: "number"
//       });
//       child.setValue(value);
//     });
//   }
//
//   getEmpty() {
//     return [];
//   }
//
//   stringify(value) {
//     return JSON.stringify(value);
//   }
//
//   parse(value) {
//     return JSON.parse(value);
//   }
//
//   add(items) {
//     let values = this.getValue().concat(items);
//     this.setValue(values);
//     // const field = this;
//     // return this.getValueAsync().then(function(values) {
//     //   // values.push(item);
//     //   return field.saveValue(values.concat(items), false, true);
//     // });
//   }
//
//   // async add(item) {
//   //   let values = await this.getValueAsync();
//   //   values.push(item);
//   //   return this.updateValue(values);
//   // }
//
//   remove(items) {
//     let values = this.getValue();
//     values = values.filter(function(value) {
//       return items.indexOf(value) === -1;
//     });
//     this.setValue(values);
//     // const field = this;
//     // return this.getValueAsync().then(function(values) {
//     //   values = values.filter(function(value) {
//     //     return items.indexOf(value) === -1;
//     //   });
//     //   return field.saveValue(values, false, true);
//     // });
//   }
//
//   replace(item, newItem) {
//     const values = this.getValue();
//     const index = values.indexOf(item);
//     if (index > -1) {
//       values.splice(index, 1, newItem);
//       this.setValue(values, context);
//     }
//     // const field = this;
//     // return this.getValueAsync().then(function(values) {
//     //   const index = values.indexOf(item);
//     //   if (index > -1) {
//     //     values.splice(index, 1, newItem);
//     //     return field.saveValue(values, false, true);
//     //   }
//     // });
//   }
//
//   getPrev(rowId) {
//     let ids = this.getValue();
//     let index = ids.indexOf(rowId);
//     if (index > 0) {
//       return ids[index-1];
//     }
//     // this.getValueAsync().then(function(ids) {
//     //   let index = ids.indexOf(rowId);
//     //   if (index > 0) {
//     //     return ids[index-1];
//     //   }
//     // });
//   }
//
//   getNext(rowId) {
//     let ids = this.getValue();
//     let index = ids.indexOf(rowId);
//     if (index > -1 && index < ids.length - 1) {
//       return ids[index+1];
//     }
//     // this.getValueAsync().then(function(ids) {
//     //   let index = ids.indexOf(rowId);
//     //   if (index > -1 && index < ids.length - 1) {
//     //     return ids[index+1];
//     //   }
//     // });
//   }
//
// }


KarmaFieldsAlpha.fields.arrayField = class TableCol extends KarmaFieldsAlpha.fields.field {

  prepare(value) {
    return value;
  }

  convert(value) {
    if (!Array.isArray(value)) {
      if (Number(value)) {
        return [value];
      }
      return [];
    }
    return value;
  }

  getEmpty() {
    return [];
  }

  // getValue() {
  //   return this.children.map(child => child.getValue()).filter(value => value !== undefined);
  // }
  //
  // setValue(values) {
  //   // this.length = values.length;
  //   // values.forEach((value, index) => {
  //   //   const child = this.getChild(index.toString()) || this.createChild({
  //   //     type: this.resource.datatype || "field",
  //   //     key: index.toString()
  //   //   });
  //   //   child.setValue(value);
  //   // });
  //   for (let i = 0; i < Math.max(values.length, this.children.length); i++) {
  //   // values.forEach((value, index) => {
  //     const child = this.getChild(i.toString()) || this.createChild({
  //       type: this.resource.datatype || "field",
  //       key: i.toString()
  //     });
  //     child.setValue(values[i]);
  //   }
  // }

  getValue() {
    let value = super.getValue();
    if (value !== undefined) {
      // value = JSON.parse(value);
      value = value.split(",");
    } else {
      value = this.getEmpty();
    }
    return value;
  }

  setValue(values) {
    if (values !== undefined) {
      values = values.join(",");
      super.setValue(values);
      // super.setValue(JSON.stringify(values));
    }
  }

  getOriginal() {
    let value = super.getOriginal();
    if (value !== undefined) {
      value = JSON.parse(value);
    }
    return value;
  }

  setOriginal(values) {
    if (values !== undefined) {
      super.setOriginal(JSON.stringify(values));
    }
  }

  add(items) {
    let values = this.getValue().concat(items);
    this.setValue(values);
  }

  remove(items) {
    let values = this.getValue();
    values = values.filter(function(value) {
      return items.indexOf(value) === -1;
    });
    this.setValue(values);
  }

  replace(item, newItem) {
    const values = this.getValue();
    const index = values.indexOf(item);
    if (index > -1) {
      values.splice(index, 1, newItem);
      this.setValue(values, context);
    }
  }

  getPrev(rowId) {
    let ids = this.getValue();
    let index = ids.indexOf(rowId);
    if (index > 0) {
      return ids[index-1];
    }
  }

  getNext(rowId) {
    let ids = this.getValue();
    let index = ids.indexOf(rowId);
    if (index > -1 && index < ids.length - 1) {
      return ids[index+1];
    }
  }

}


KarmaFieldsAlpha.fields.number = class TableCol extends KarmaFieldsAlpha.fields.field {

  empty() {
    return 0;
  }

  convert(value) {
    return value && Number(value) || 0;
  }

}
