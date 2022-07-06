KarmaFieldsAlpha.fields.breadcrumb = class extends KarmaFieldsAlpha.fields.field {

  build() {
    return {
      class: "karma-breadcrumb",
      tag: "ul",
      update: async ul => {

        ul.children = [];

        let request = await this.dispatch({
          action: "get",
          path: ["post_parent"]
        });

        let parent = KarmaFieldsAlpha.Type.toNumber(request.data);

        while(parent !== 0) {

          const store = new KarmaFieldsAlpha.Store(this.resource.driver);
          const id = parent;

          await store.query([this.resource.params, "id="+id].join("&"));

          const name = await this.dispatch({
            action: "get",
            path: ["content", id, "post_title"]
          }).then(request => KarmaFieldsAlpha.Type.toString(request.data));

          ul.children.unshift({
            tag: "li",
            child: {
              tag: "a",
              update: a => {
                a.element.innerHTML = name || "no name";
                a.element.onclick = async event => {
                  await this.dispatch({
                    action: "set",
                    path: ["post_parent"],
                    data: [id]
                  });
                  await this.dispatch({
                    action: "edit"
                  });
                }
              }
            }
          });

          parent = await this.dispatch({
            action: "get",
            path: ["content", id, "post_parent"]
          }).then(request => KarmaFieldsAlpha.Type.toNumber(request.data));

        }

        ul.children.unshift({
          tag: "li",
          child: {
            tag: "a",
            update: a => {
              a.element.innerHTML = this.resource.root || "Uploads";
              a.element.onclick = async event => {
                await this.dispatch({
                  action: "set",
                  path: ["post_parent"],
                  data: [0]
                });
                await this.dispatch({
                  action: "edit"
                });
              }
            }
          }
        });

      }
    }
  }

}
