KarmaFieldsAlpha.field.clipboard = class extends KarmaFieldsAlpha.field {

  onInput() {
    //noop
  }

  output() {
    // noop
  }

  onBlur() {
    // noop
  }

  focus() {
    // noop
  }

  build() {
    return {
      tag: "textarea",
      class: "clipboard",
      update: ta => {
        ta.element.oninput = event => {

          switch (event.inputType) {
            case "deleteByCut":
            case "deleteContentBackward":
            case "deleteContentForward":
            case "deleteContent":
            case "insertFromPaste": {
              // const dataArray = KarmaFieldsAlpha.Clipboard.parse(ta.element.value);
              // const data = KarmaFieldsAlpha.Clipboard.toJson(dataArray);
              // return this.parent.request("import", {data: data});
              this.onInput(ta.element.value);
            }
          }
        };
        ta.element.onblur = event => {
          this.onBlur();
        };
        this.output = value => {
          ta.element.value = value;
        }
        this.focus = value => {
          ta.element.focus({preventScroll: true});
          ta.element.select();
          ta.element.setSelectionRange(0, 999999);
        }
      }
    };
  }
}
