
KarmaFieldsAlpha.fields.tables = class extends KarmaFieldsAlpha.fields.field {


  constructor(...args) {
    super(...args);

    KarmaFieldsAlpha.tables = this; // -> debug

  }

  // async dispatch(event) {
  //
  //   switch (event.action) {
  //
  //     case "close":
  //       // KarmaFieldsAlpha.Gateway.clearOptions();
  //       KarmaFieldsAlpha.Nav.empty();
  //       await this.render();
  //       break;
  //
  //     case "undo":
  //     case "redo":
  //       await this.render();
  //       break;
  //
  //     case "render": {
  //       // const tableId = KarmaFieldsAlpha.Nav.get("karma");
  //       // const tableField = this.getChild(tableId);
  //       //
  //       // if (tableField) {
  //       //   await tableField.queryIds();
  //       // }
  //
  //       await this.render();
  //       break;
  //     }
  //
  //     // case "media-library":
  //     //   KarmaFieldsAlpha.Nav.setObject(new URLSearchParams({karma: "medias"})); // , id: event.id
  //     //   await this.render();
  //     //   break;
  //
  //     // case "nav":
  //     //   this.render(true);
  //     //   break;
  //
  //   }
  //
  //   return event;
  // }

  async request(subject, content = {}, ...path) {

    switch (subject) {

      case "close":
        KarmaFieldsAlpha.Nav.empty();
        await this.render();
        break;

      case "undo":
      case "redo":
        await this.render();
        break;

      case "render": {
        await this.render();
        break;
      }

    }

  }

  build() {
    return {
      class: "popup",
      init: container => {
        this.render = container.render;

        window.addEventListener("popstate", async event => {
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

                        // table.server.store.empty();

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
