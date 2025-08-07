
KarmaFieldsAlpha.field.popup = class extends KarmaFieldsAlpha.field {

  // newChild(id, ...path) {
  //
  //   // const type = this.resource.type || "table";
  //   //
  //   // return new KarmaFieldsAlpha.field[type](this.resource, "form", this);
  //
  // }
  //
  //
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
  //
  //
  // isActive() {
  //
  //   return this.getState("active");
  //
  // }
  //
  // getZ() {
  //
  //   return this.getState("z");
  //
  // }
  //
  // open(z) {
  //
  //   // deprecated
  //
  //   // let z = KarmaFieldsAlpha.Store.get("layerZ") || 0;
  //   // z++;
  //   // KarmaFieldsAlpha.Store.set(z, "layerZ");
  //
  //   this.setState(true, "active");
  //   this.setState(z, "z");
  //
  // }

  // close() {
  //
  //   this.setState(false, "active");
  //
  //   // KarmaFieldsAlpha.Store.remove("dropper", this.id);
  //
  //   this.removeState("master");
  //
  //
  // }

  async *drop() {

    // const dropperPath = KarmaFieldsAlpha.Store.State.get("dropper", this.id);
    // const dropperPath = this.getState("master");

    // const ids = this.getChild("form").getSelectedIds();
    const ids = this.getSelectedIds();

    // if (dropperPath && ids.length) {
    if (ids.length) {

      // const dropper = this.getField(...dropperPath);

      // if (dropper) {
      if (this.parent.insert) {

        yield* this.parent.insert(ids);

      }

    }

    this.parent.close();

  }



  canDrop() {

    // return KarmaFieldsAlpha.Store.State.get("dropper", this.id) !== undefined;
    // return this.getState("master") !== undefined;



    return Boolean(this.parent.insert);
  }


  // *buildTable() {
  //
  //   if (this.getState("active")) {
  //
  //     // const table = this.createChild({
  //     //   type: "form",
  //     //   driver:
  //     //   ...this.resource,
  //     //   params: {
  //     //     ...this.resource.params,
  //     //     this.getState("params")
  //     //   }
  //     // }, "form");
  //
  //     yield this.getChild("form").build();
  //
  //
  //
  //   }
  //
  // }

  // build() {
  //
  //   // return {
  //   //   class: "table-container",
  //   //   update: node => {
  //   //     node.element.style.zIndex = this.getState("z") || 0;
  //   //     node.element.classList.toggle("hidden", !this.getState("active"));
  //   //   },
  //   //   children: [...this.buildTable()]
  //   // };
  //
  //   // -> to be overriden
  //
  // }


  // buildPopup() {
  //
  //   if (this.getState("active")) {
  //
  //     return {
  //       class: "table-container",
  //       update: node => {
  //         node.element.style.zIndex = this.getState("z") || 0;
  //         node.element.classList.remove("hidden");
  //       },
  //       children: [this.build()]
  //     };
  //
  //   } else {
  //
  //     return {
  //       class: "table-container",
  //       update: node => {
  //         node.element.classList.add("hidden");
  //       },
  //       children: []
  //     };
  //
  //   }
  //
  // }

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
