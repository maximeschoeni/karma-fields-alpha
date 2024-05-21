
KarmaFieldsAlpha.field.popup = class extends KarmaFieldsAlpha.field {

  newChild(id, ...path) {

    const type = this.resource.type || "table";

    return new KarmaFieldsAlpha.field[type](this.resource, "form", this);

  }

  // getChild(id = "form", ...path) {
  //
  //   const child = new KarmaFieldsAlpha.field[this.resource.type](this.resource, "form", this);
  //   // child.parent = this;
  //   // child.id = id;
  //
  //   if (path.length) {
  //
  //     return child.getChild(...path);
  //
  //   } else {
  //
  //     return child;
  //
  //   }
  //
  //   // return this.createChild({
  //   //   type: "form",
  //   //   ...this.resource
  //   // }, "form");
  //
  // }

  getChild(index, ...path) {

    let child = this.newChild(index);

    if (child && path.length) {

      return child.getChild(...path);

    }

    return child;

  }


  isActive() {

    return this.getState("active");

  }

  open() {

    let z = KarmaFieldsAlpha.Store.get("layerZ") || 0;
    z++;
    KarmaFieldsAlpha.Store.set(z, "layerZ");

    this.setState(true, "active");
    this.setState(z, "z");

    // this.getChild("form").setState(params, "params");

  }

  close() {

    this.setState(false, "active");

    // KarmaFieldsAlpha.Store.remove("events", "drop", this.id);
    KarmaFieldsAlpha.Store.remove("dropper", this.id);

  }

  async *drop() {

    const dropperPath = KarmaFieldsAlpha.Store.State.get("dropper", this.id);
    const ids = this.getChild("form").getSelectedIds();

    if (dropperPath && ids.length) {

      const dropper = this.getField(...dropperPath);

      if (dropper) {

        yield* dropper.insert(ids);

      }

    }

    this.close();

  }

  canDrop() {

    return KarmaFieldsAlpha.Store.State.get("dropper", this.id) !== undefined;

  }

  // hasEvent(...path) {
  //
  //   return KarmaFieldsAlpha.Store.get("events", ...path, this.id) !== undefined;
  //   // return KarmaFieldsAlpha.Store.get("events", "close", this.id);
  //
  // }

  // getParams() {
  //
  //   return this.getState("params") || {};
  //
  // }

  *buildTable() {

    if (this.getState("active")) {

      // const table = this.createChild({
      //   type: "form",
      //   driver:
      //   ...this.resource,
      //   params: {
      //     ...this.resource.params,
      //     this.getState("params")
      //   }
      // }, "form");

      yield this.getChild("form").build();

    }

  }

  build() {

    return {
      class: "table-container",
      update: node => {
        node.element.style.zIndex = this.getState("z") || 0;
        node.element.classList.toggle("hidden", !this.getState("active"));
      },
      children: [...this.buildTable()]
    };

  }

}


//
//
// KarmaFieldsAlpha.field.popup = class extends KarmaFieldsAlpha.field {
//
//
//   build() {
//
//     return {
//       class: "popup",
//       update: popup => {
//
//         let currentTableId = KarmaFieldsAlpha.Store.Layer.getTable();
//
//         document.body.classList.toggle("karma-table-open", Boolean(currentTableId));
//         popup.element.classList.toggle("hidden", !currentTableId && !this.resource.navigation);
//
//         if (currentTableId || this.resource.navigation) {
//           popup.children = [
//             {
//               class: "popup-content",
//               children: [
//                 {
//                   class: "navigation karma-field-frame",
//                   update: navigation => {
//                     navigation.element.classList.toggle("hidden", !this.resource.navigation);
//                     if (this.resource.navigation) {
//                       navigation.child = this.getChild("menu").build();
//                     }
//                   }
//                 },
//
//                 {
//                   class: "tables",
//                   update: container => {
//
//                     currentTableId = KarmaFieldsAlpha.Store.Layer.getTable();
//
//                     container.children = Object.keys(this.resource.tables).map((tableId, index) => {
//                       return {
//                         class: "table-container",
//                         update: container => {
//
//                           container.element.classList.toggle("hidden", tableId !== currentTableId);
//
//                           if (tableId === currentTableId) {
//
//                             container.children = [this.getChild(tableId).build()];
//
//                           } else {
//
//                             container.children = [];
//
//                           }
//                         }
//                       };
//                     });
//                   }
//                 }
//               ]
//             }
//           ]
//         }
//       }
//     };
//
//   }
//
// }
