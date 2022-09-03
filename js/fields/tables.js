
KarmaFieldsAlpha.fields.tables = class extends KarmaFieldsAlpha.fields.field {


  constructor(...args) {
    super(...args);

    KarmaFieldsAlpha.tables = this; // -> debug

    // KarmaFieldsAlpha.Nav.onpopstate = () => {
    //   this.render(true);
    // }


  }

  // getTable() {
  //   let key = this.getParam("karma");
  //
  //   const resource = this.resource.children && this.resource.children.find(resource => key === (resource.id || resource.driver || resource.key));
  //
  //   return resource && this.createChild(resource);
  // }

  async dispatch(event) {

    switch (event.action) {

      case "close":
        // KarmaFieldsAlpha.Gateway.clearOptions();
        KarmaFieldsAlpha.Nav.empty();
        await this.render();
        break;

      case "undo":
      case "redo":
        await this.render();
        break;

      case "render": {
        // const tableId = KarmaFieldsAlpha.Nav.get("karma");
        // const tableField = this.getChild(tableId);
        //
        // if (tableField) {
        //   await tableField.queryIds();
        // }

        await this.render();
        break;
      }

      // case "media-library":
      //   KarmaFieldsAlpha.Nav.setObject(new URLSearchParams({karma: "medias"})); // , id: event.id
      //   await this.render();
      //   break;

      // case "nav":
      //   this.render(true);
      //   break;

    }

    return event;
  }


  // build() {
  //   return {
  //     class: "karma-fields-navigation",
  //     init: container => {
  //       this.render = container.render;
  //
  //       window.addEventListener("popstate", event => {
  //
  //         // KarmaFieldsAlpha.History.save();
  //         // const params = KarmaFieldsAlpha.Nav.getObject();
  //       	// for (let key in params) {
  //       	// 	KarmaFieldsAlpha.History.pack(params[key], null, "nav", key);
  //       	// }
  //
  //       	container.render();
  //       });
  //
  //     },
  //     update: container => {
  //       document.body.classList.toggle("karma-table-open", KarmaFieldsAlpha.Nav.has("karma"));
  //       // const table = this.createChild({
  //       //   id: resource.id || resource.key || resource.driver, // -> compat (id should be set)
  //       //   ...resource
  //       // })
  //     },
  //     children: this.resource.children.map((resource, index) => {
  //       return this.createChild({
  //         id: resource.id || resource.key || resource.driver, // -> compat (id should be set)
  //         ...resource
  //       }).build();
  //     })
  //   };
  // }




  build() {
    return {
      class: "popup",
      init: container => {
        this.render = container.render;

        window.addEventListener("popstate", async event => {

          // const tableId = KarmaFieldsAlpha.Nav.get("karma");
          // const table = this.getChild(tableId);
          // if (table && table.hash !== location.hash.slice(1)) {
          //   table.hash = location.hash.slice(1);
          //   await table.queryIds();
          // }


          // if (KarmaFieldsAlpha.Nav.has("karma")) {
          //   const tableId = KarmaFieldsAlpha.Nav.get("karma");
          //   const resource = this.resource.children.find(resource => resource.id === tableId);
          //   if (resource) {
          //     const field = this.createChild(resource);
          //     await field.queryIds();
          //   }
          // }

          // const tableId = KarmaFieldsAlpha.Nav.get("karma");
          // const resource = this.resource.children.find(child => child.id === tableId);
          // if (resource) {
          //   const field = this.createChild(resource);
          //   await field.queryIds();
          //   console.log("queryIds");
          // 	await container.render();
          // }

          await container.render();
        });

      },
      update: popup => {

        popup.element.classList.toggle("hidden", !KarmaFieldsAlpha.Nav.has("table") && !this.resource.navigation);
      },
      child: {
        class: "popup-content",
        children: [
          {
            class: "navigation karma-field-frame",
            update: navigation => {
              navigation.element.classList.toggle("hidden", !this.resource.navigation);
              if (this.resource.navigation) {
                navigation.child = this.createChild({
                  ...this.resource.navigation,
                  type: "navigation"
                }).build();
              }
            }
            // child: {
            //   tag: "ul",
            //   children: [
            //     {
            //       tag: "li",
            //       child: {
            //         tag: "a",
            //         init: li => {
            //           li.element.innerHTML = "Posts";
            //           li.element.href = "#karma=posts";
            //         }
            //       },
            //       update: li => {
            //         li.element.classList.toggle("active", KarmaFieldsAlpha.Nav.get("karma") === "posts");
            //       }
            //     },
            //     {
            //       tag: "li",
            //       child: {
            //         tag: "a",
            //         init: li => {
            //           li.element.innerHTML = "Pages";
            //           li.element.href = "#karma=pages";
            //         }
            //       }
            //     },
            //     {
            //       tag: "li",
            //       child: {
            //         tag: "a",
            //         init: li => {
            //           li.element.innerHTML = "Medias";
            //           li.element.href = "#karma=medias";
            //         }
            //       },
            //       update: li => {
            //         li.element.classList.toggle("active", KarmaFieldsAlpha.Nav.get("karma") === "medias");
            //       }
            //     }
            //   ]
            // }
          },
          {
            class: "tables",
            update: container => {
              document.body.classList.toggle("karma-table-open", KarmaFieldsAlpha.Nav.has("table"));

              const tableId = KarmaFieldsAlpha.Nav.get("table");



              container.children = this.resource.tables.map((resource, index) => {
                return {
                  class: "table-container",
                  update: async container => {
                    container.element.classList.toggle("hidden", tableId !== resource.id);

                    if (tableId === resource.id) {
                      const table = this.createChild(resource);
                      // if (table.hash !== location.hash.slice(1)) {
                        // table.hash = location.hash.slice(1);
                        table.server.store.empty();

                        await table.queryIds();
                      // }
                      container.child = table.build();
                    } else {
                      container.children = []
                    }
                  }
                };
              });
            }
          }
        ]
      }
    };
  }

  static navigation = class extends KarmaFieldsAlpha.fields.group {

    static menu = class extends KarmaFieldsAlpha.fields.field {

      getItems() {
        return this.resource.items || [];
      }

      build() {
        return {
          tag: "ul",
          children: this.getItems().map((item, index) => {
            return {
              tag: "li",
              children: [
                {
                  tag: "a",
                  init: li => {
                    li.element.innerHTML = item.title;
                    li.element.href = "#"+item.hash;
                  }
                },
                this.createChild({
                  items: this.resource.children,
                  type: "menu"
                }, index).build()
              ],
              update: li => {
                this.active = location.hash.slice(1) === item.hash;
                li.element.classList.toggle("active", this.active);
              },
              complete: li => {
                this.current = this.children.some(child => child.active || child.current);
                // this.active = this.resource.children.some((child, index) => this.getChild(index).active);
                li.element.classList.toggle("current", this.current);
              }
            };
          })
        }
      }
    }

  }



}
