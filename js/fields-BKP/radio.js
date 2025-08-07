KarmaFieldsAlpha.field.radio = class extends KarmaFieldsAlpha.field.dropdown {

  *buildOptions() {

    const value = this.getContent();
    const options = this.getOptions();

    if (!options.loading) {

      for (let option of options.toArray()) {

        yield {
          tag: "li",
          child: {
            tag: "a",
            update: node => {
              const isActive = option.id === value.toString();
              node.element.classList.toggle("active", Boolean(isActive));
              node.element.innerHTML = option.name;
              node.element.onclick = async event => {
                await this.save("radio", "Radio");
                await this.setValue(option.id);
                await this.render();
              }
            }
          }
        };

      }

    }

  }

  build() {

    return {
      class: "radio",
      tag: "ul",
      init: node => {
        const displayMode = this.resource.display || "inline";
        node.element.classList.toggle("display-inline", displayMode === "inline");
      },
      children: [...this.buildOptions()]
    };

  }


}
