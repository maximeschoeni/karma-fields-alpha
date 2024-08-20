
KarmaFieldsAlpha.field.postform = class extends KarmaFieldsAlpha.field.form {

  *buildHidden() {



    if (this.resource.hiddenfield !== false) {

      yield {
        tag: "input",
        init: input => {
          input.element.type = "hidden";
          input.element.name = "karma-fields-items[]";
          // if (input.element.form) {
          //   input.element.form.addEventListener("submit", async event => {
          //   });
          // }
        },
        update: async input => {
          // const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");

          const delta = await this.getDelta();


          if (delta) {
            input.element.value = JSON.stringify(delta);
          } else {
            input.element.value = "";
          }

        }
      };

    }

  }

  // build() {
  //   return {
  //     class: "post-form",
  //     children: [
  //       super.build(),
  //       ...this.buildHidden()
  //
  //     ]
  //   };
  //
  // }

  *buildBody() {

		const body = this.getBody();

		yield {
      class: "table-body",
      child: body.build()
    };


    yield* this.buildHidden();

	}

}


// KarmaFieldsAlpha.field.single = class extends KarmaFieldsAlpha.field.group {
//
//   getContent(key) {
//
//
//     return this.parent.getContentAt(0, key);
//
//   }
//
//   setContent(value, key) {
//
//     this.parent.setContentAt(value, 0, key);
//
//   }
//
//
// }
