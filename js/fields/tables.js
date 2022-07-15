
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

      case "media-library":
        KarmaFieldsAlpha.Nav.setObject(new URLSearchParams({karma: "medias"})); // , id: event.id
        await this.render();
        break;

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
      class: "karma-fields-navigation",
      init: container => {
        this.render = container.render;

        window.addEventListener("popstate", async event => {

          // if (KarmaFieldsAlpha.Nav.has("karma")) {
          //   const tableId = KarmaFieldsAlpha.Nav.get("karma");
          //   const resource = this.resource.children.find(resource => resource.id === tableId);
          //   if (resource) {
          //     const field = this.createChild(resource);
          //     await field.queryIds();
          //   }
          // }

          const tableId = KarmaFieldsAlpha.Nav.get("karma");
          const resource = this.resource.children.find(child => child.id === tableId);
          if (resource) {
            const field = this.createChild(resource);
            await field.queryIds();
            console.log("queryIds");
          	await container.render();
          }
        });

      },
      update: container => {
        document.body.classList.toggle("karma-table-open", KarmaFieldsAlpha.Nav.has("karma"));
        // const table = this.createChild({
        //   id: resource.id || resource.key || resource.driver, // -> compat (id should be set)
        //   ...resource
        // })

        const tableId = KarmaFieldsAlpha.Nav.get("karma");
        container.children = this.resource.children.map((resource, index) => {
          return {
            class: "table-container",
            update: async container => {
              container.element.classList.toggle("hidden", tableId !== resource.id);
              if (tableId === resource.id) {
                const field = this.createChild(resource);
                // await field.queryIds();
                container.child = field.build();
              } else {
                container.children = []
              }
            }
          };
        });
      }
    };
  }



}
