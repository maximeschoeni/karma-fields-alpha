KarmaFieldsAlpha.field.grid.modal = class extends KarmaFieldsAlpha.field.container {

  // constructor(resource) {
  //
  //   super(resource);
  //
  //   const data = this.getData();
  //
  //   data.index = resource.selection.index;
  //   data.length = resource.selection.length;
  //
  // }

  getValue(key) {

    let array;

    const ids = this.parent.getSelectedIds();

    for (let id of ids) {

      const values = this.parent.getValue(id, key);

      if (!array) {

        array = values;

      } else if (KarmaFieldsAlpha.DeepObject.differ(array, values)) {

        array = [];
        break;

      }

    }

    return array;

  }

  setValue(value, key) {

    const ids = this.parent.getSelectedIds();

    if (ids) {

      if (ids.length === 1) {

        this.parent.setValue(value, ids[0], key); // -> one item / multiple or single value

      } else if (!Array.isArray(value) || value.length === 1) {

        ids.forEach(id => void this.parent.setValue(value[0], id, key)); // -> multiple items / single value

      } else if (Array.isArray(value) && value.length === ids.length) {

        ids.forEach((id, index) => void this.parent.setValue(value[index], id, key)); // -> multiple items / multiple values

      } else {

        console.error("values count does not match items count");

      }

    }

  }

  setSelection(selection) {

    // console.log("modal", selection);


    if (selection) {

      const parentSelection = new KarmaFieldsAlpha.Selection();
      const parentData = this.parent.getData().selection;
      parentSelection.index = parentData.index || 0;
      parentSelection.length = parentData.length || 0;



      parentSelection[this.resource.index] = selection;



      this.parent.setSelection(parentSelection);

    }


    // console.log("modal setSelection", selection, parentSelection);


  }

  build() {

    return {
      class: "modal-field",
      init: modal => {
        modal.element.tabIndex = -1;
      },
      update: modal => {
        // modal.element.onfocusin = event => {
        //
        //   const parentSelection = new KarmaFieldsAlpha.Selection();
        //   const parentData = this.parent.getData().selection;
        //   parentSelection.index = parentData.index || 0;
        //   parentSelection.length = parentData.length || 0;
        //   // parentSelection[this.resource.index] = selection;
        //
        //   const [string] = this.parent.export([], parentSelection.index, parentSelection.length);
        //
        //   KarmaFieldsAlpha.Clipboard.write(string);
        //
        //   this.parent.setSelection(parentSelection);
        //
        //
        // }

        // modal.element.onmousedown = event => {
        //
        //   console.log("mousedown -> remove clipboard + modal focusout");
        //
        //   const [string] = this.export([]);
        //
        //   KarmaFieldsAlpha.Clipboard.write(string);
        //
        //
        //
        //   KarmaFieldsAlpha.Clipboard.getElement().onfocusout = event => {
        //
        //
        //     this.setSelection(new KarmaFieldsAlpha.Selection());
        //
        //
        //
        //     this.render();
        //
        //   };
        //
        //   modal.element.onfocusout = null;
        //
        // }

        KarmaFieldsAlpha.Clipboard.getElement().onfocusout = event => {

          console.log("clipboard onfocusout", event.relatedTarget, event.currentTarget);

          if (!modal.element.contains(event.relatedTarget)) {

            console.log("clipboard lose focus -> clear selection");

            this.parent.setSelection();
            this.render();

          }

        }



        // modal.element.onfocusout = event => {
        //
        //
        //
        //   const selection = this.getSelection();
        //
        //   console.log("modal focusout", event.relatedTarget);
        //
        //   // console.log()
        //
        //   // KarmaFieldsAlpha.Clipboard.getElement().onfocusout = null;
        //   //
        //   // modal.element.onfocusout = null;
        //
        //   this.setSelection();
        //     this.render();
        //
        // }

        modal.element.onfocusout = event => {

          console.log("modal onfocusout", event.relatedTarget);

          if (!modal.element.contains(event.relatedTarget) && event.relatedTarget !== KarmaFieldsAlpha.Clipboard.getElement()) {


            this.parent.setSelection();

            console.log("modal lose focus -> clear selection", KarmaFieldsAlpha.Selection.object);

            this.render();

          }

        }

        modal.element.onfocusin = event => {

          const selection = this.getSelection();

          console.log("modal onfocusin", event.relatedTarget, selection);


          if (!selection || selection.final) {

            console.log("modal transfer focus");

            const [string] = this.export([]);

            KarmaFieldsAlpha.Clipboard.write(string);

          }



          // const parentSelection = this.parent.getSelection();

          // console.log(parentSelection);

          // KarmaFieldsAlpha.Clipboard.getElement().onfocusout = event => {
          //   // event.preventDefault();
          //   // event.stopPropagation();
          //
          //   const selection = new KarmaFieldsAlpha.Selection();
          //   this.setSelection(selection);
          //
          // }

          // console.log("modal focusin", document.activeElement);

          // const selection = this.getSelection();

          // console.log(document.activeElement, document.activeElement === modal.element);

          // if (document.activeElement === modal.element) {
          //
          //   const parentSelection = new KarmaFieldsAlpha.Selection();
          //   const parentData = this.parent.getData().selection;
          //   parentSelection.index = parentData.index || 0;
          //   parentSelection.length = parentData.length || 0;
          //
          //   const [string] = this.parent.export([], parentSelection.index, parentSelection.length);
          //
          //   KarmaFieldsAlpha.Clipboard.write(string);
          //
          //   this.parent.setSelection(parentSelection);
          //
          //
          // }

          // console.log("modal onfocusin -> add modal onfocusout");
          //
          // modal.element.onfocusout = event => {
          //
          //   console.log("modal onfocusout");
          //
          //   // const selection = this.getSelection();
          //   this.setSelection();
          //   this.render();
          // }






        }

        // modal.element.onfocusout = event => {
        //
        //   // console.log("module onfocusout", document.activeElement, modal.element);
        //
        //   this.setSelection();
        //   this.parent.render();
        // }

        // modal.element.onfocusin = event => {
        //
        //   console.log("focusin");
        //   const selection = new KarmaFieldsAlpha.Selection();
        //   this.setSelection(selection);
        // }
        // modal.element.onfocusout = event => {
        //   this.setSelection();
        // }
      },
      child: super.build()
    }


  }

}
