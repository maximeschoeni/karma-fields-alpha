KarmaFieldsAlpha.field.root = class extends KarmaFieldsAlpha.field {

  constructor() {

    this.selectionBuffer = new KarmaFieldsAlpha.Buffer("selection");
    this.fieldOption = new KarmaFieldsAlpha.Buffer("field-option"); // -> "data"

  }
  // onInput() {
  //   //noop
  // }

  // output() {
  //   // noop
  // }

  // onBlur() {
  //   // noop
  // }

  // focus() {
  //   // noop
  // }


  getSelection() {
    return this.selectionBuffer.get();
  }

  setSelection(value) {
    this.selectionBuffer.set(value);
  }

  clearSelection() {

    this.selectionBuffer.remove();

  }

  paste(value) {

    const selection = this.getSelection();

    super.paste(value, selection);

  }

  getData() {
    return this.fieldOption.get(); 
  }

  setData(value) {
    return this.fieldOption.set(value); 
  }

  render() {
    
  }



  build() {
    return {
      tag: "textarea",
      class: "clipboard",
      init: ta => {
        ta.element.id = "karma-fields-alpha-clipboard";
        ta.element.readOnly = true;

        ta.element.onblur = event => {
          this.clearSelection();
          form.render();
        }

        clipboard.onpaste = event => {
          event.preventDefault();
          const string = event.clipboardData.getData("text/plain").normalize();
          clipboard.value = string;
          this.paste(string);
          form.render();
        }

        clipboard.oncut = event => {
          event.preventDefault();
          event.clipboardData.setData("text/plain", clipboard.value);
          clipboard.value = "";
          this.paste("");
          form.render();
        }

        clipboard.onkeyup = event => {

          if (event.key === "Delete" || event.key === "Backspace") {

            clipboard.value = "";
            this.paste("");
            form.render();

          } else if (event.key === "z" && event.meta) {

            console.log("undo");
          }

          
        }
      },
      update: ta => {

        // ta.element.onpaste = event => {
        //   event.preventDefault();
        //   const value = event.clipboardData.getData("text/plain").normalize();
        //   this.onInput(value);
        // }

        // ta.element.oncut = event => {
        //   event.preventDefault();
        //   event.clipboardData.setData("text/plain", ta.element.value);
        //   this.onInput("");
        // }

        // ta.element.onkeyup = event => {
        //   if (event.key === "Delete" || event.key === "Backspace") {
        //     this.onInput("");
        //   }
        // }

        // // ta.element.oninput = event => {
        // //
        // //   console.log(event);
        // //
        // //   switch (event.inputType) {
        // //     case "deleteByCut":
        // //     case "deleteContentBackward":
        // //     case "deleteContentForward":
        // //     case "deleteContent":
        // //     case "insertFromPaste": {
        // //       // const dataArray = KarmaFieldsAlpha.Clipboard.parse(ta.element.value);
        // //       // const data = KarmaFieldsAlpha.Clipboard.toJson(dataArray);
        // //       // return this.parent.request("import", {data: data});
        // //       this.onInput(ta.element.value);
        // //     }
        // //   }
        // // };
        // ta.element.onblur = event => {
        //   this.onBlur();
        // };
        // this.output = value => {
        //   ta.element.value = value;
        // }
        // this.focus = value => {
        //   ta.element.focus({preventScroll: true});
        //   ta.element.select();
        //   ta.element.setSelectionRange(0, 999999);
        // }
      }
    };
  }
}
