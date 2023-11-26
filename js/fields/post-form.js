
KarmaFieldsAlpha.field.postform = class extends KarmaFieldsAlpha.field.container {

  getDriver() {

    return this.resource.driver;

  }

  getId() {

    return this.resource.id;

  }

  getIndex() {

    return this.resource.index;

  }

  getContent(key) {

    const driver = this.getDriver();
    const id = this.getId();

    return KarmaFieldsAlpha.Query.getValue(driver, id, key);

  }

  async setContent(content, key) {

    const driver = this.getDriver();
    const id = this.getId();

    await KarmaFieldsAlpha.Store.State.set(content.toArray(), "delta", driver, id, key);

  }

  build() {
    return {
      class: "post-form",
      init: form => {
        if (this.resource.style) {
          form.element.style = this.resource.style;
        }
      },
      children: [
        super.build(),
        {
          tag: "input",
          init: input => {
            input.element.type = "hidden";
            input.element.name = "karma-fields-items[]";
            if (input.element.form) {
              input.element.form.addEventListener("submit", event => {
                KarmaFieldsAlpha.Store.Delta.remove(this.getDriver(), this.getId());
                KarmaFieldsAlpha.Store.Layer.removeSelection();
              });
            }
          },
          update: input => {
            const delta = KarmaFieldsAlpha.Store.State.get("delta", this.getDriver(), this.getId());
            if (delta) {
              input.element.value = JSON.stringify(delta);
            }
          }
        }
      ]
    }


  }

}
