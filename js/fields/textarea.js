KarmaFieldsAlpha.field.textarea = class extends KarmaFieldsAlpha.field.input {

	build() {
		return {
			tag: "textarea",
			class: "karma-field",
			init: input => {
				if (this.resource.label) {
					input.element.id = this.getId();
				}
				if (this.resource.readonly) {
					input.element.readOnly = true;
				}
				if (this.resource.input) {
					Object.assign(input.element, this.resource.input);
				}
				if (this.resource.height) {
					input.element.style.height = this.resource.height;
				}
			},
			update: input => {
				

				const key = this.getKey();

				const values = this.parent.request("get", {}, key);

        input.element.classList.toggle("loading", !values);

        if (values) {

          input.element.classList.toggle("multi", values.length > 1);
          input.element.readOnly = Boolean(this.resource.readonly || values.length > 1);

          const [value = ""] = values;

          input.element.oninput = async event => {
            this.throttle(async () => {
              this.set(input.element.value.normalize());
            });
          };

          if (document.activeElement !== input.element) { // -> prevent changing value while editing (e.g search field)
            // const value = KarmaFieldsAlpha.Type.toString(state.value);
            if (value !== input.element.value) {
              input.element.value = value;
            }
            const modified = this.parent.request("modified", {}, key);
            input.element.parentNode.classList.toggle("modified", Boolean(modified));
            input.element.placeholder = this.getPlaceholder();
          }

          input.element.oncopy = event => {
            if (values.length > 1) {
              event.preventDefault();
              const dataArray = state.values.map(value => KarmaFieldsAlpha.Type.toArray(value));
              const string = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
              event.clipboardData.setData("text/plain", string.normalize());
            }
          };

          input.element.onpaste = async event => {
            if (values.length > 1) {
              event.preventDefault();
              const string = event.clipboardData.getData("text").normalize()
              const dataArray = KarmaFieldsAlpha.Clipboard.parse(string);
              const jsonData = dataArray.map(value => KarmaFieldsAlpha.Type.toString(value));

              KarmaFieldsAlpha.History.save();

              this.parent.request("set", jsonData, key);
              this.parent.request("render");
            }
          };

          input.element.oncut = async event => {
            if (values.length > 1) {
              event.preventDefault();
              const dataArray = state.values.map(value => KarmaFieldsAlpha.Type.toArray(value));
              const string = KarmaFieldsAlpha.Clipboard.unparse(dataArray);
              event.clipboardData.setData("text/plain", string.normalize());

              KarmaFieldsAlpha.History.save();

              this.parent.request("set", "", key);
              this.parent.request("render");
            }
          };

        }

			}
		};
	}

}
