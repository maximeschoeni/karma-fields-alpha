// KarmaFieldsAlpha.fields.table.options = class extends KarmaFieldsAlpha.fields.form {
//
//
// }


//
// KarmaFieldsAlpha.fields.table.options = class extends KarmaFieldsAlpha.fields.form {
//
//   initField() {
//
//
//     this.resource.display = "flex";
//     this.resource.children = [
//       // {
//       //   type: "group",
//       //   style: "min-width: 150px;flex-grow: 0;",
//       //   children: [
//       //     {
//       //       type: "submit",
//       //       title: "Export",
//       //       label: "Export table content",
//       //       style: "min-width: 150px;flex-grow: 0;"
//       //     }
//       //   ]
//       // },
//       {
//         type: "group",
//         style: "align-items: flex-end; justify-content: flex-end",
//         display: "flex",
//         children: [
//           {
//             label: "Number items per page",
//             type: "input",
//             key: "ppp",
//             style: "flex-grow:0;min-width:180px;"
//           },
//           {
//             type: "submit",
//             style: "flex-grow:0;min-width:100px;"
//           }
//         ]
//       }
//     ];
//
//   }
//
//   build() {
// 		return {
// 			class: "karma-field-table-options karma-field-frame table-options",
//       update: form => {
//         const visible = this.parent && this.parent.tab === "options";
//         form.element.classList.toggle("hidden", !visible);
//         form.child = visible && super.build() || null;
//       }
// 		};
// 	}
//
//   async fetchValue(expectedType, key) {
//
//     if (key === "ppp") {
//       return KarmaFieldsAlpha.History.getParam("ppp");
//     }
//
//   }
//
//   setValue(value, key) {
//
//     if (key === "ppp") {
//       KarmaFieldsAlpha.History.setParam("ppp", value);
//     }
//
//   }
//
//   isModified() {
//     return this.parent && this.parent.paramString && (new URLSearchParams(this.parent.paramString)).get("ppp") !== KarmaFieldsAlpha.History.getParam("ppp");
//   }
//
//   async submit() {
//     this.parent.tab = null;
// 		return this.editParam();
// 	}
//
//   // getTable() {
//   //   return this.parent && this.parent.getTable();
//   // }
//
// }
