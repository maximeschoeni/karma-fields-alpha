KarmaFieldsAlpha.Handler = {};

KarmaFieldsAlpha.Handler.DragAndDrop = class extends KarmaFieldsAlpha.ListSorter {

  constructor(container, selection, dropZones) {

    super(container, selection);

    this.dropZones = dropZones;

  }

  drag(index) {

    const children = this.getChildren();
    const selectedElements = children.slice(this.state.selection.index, this.state.selection.index + this.state.selection.length);


    if (index !== this.overIndex) {

      if (this.overIndex > -1) {

        if (this.onDragOut) { // the dropzone under then dragged item

          children.slice(this.overIndex, this.overIndex+1).forEach(element => void this.onDragOut(element));

        }

        if (this.onDraggedOut) { // -> the dragged item over a dropzone

          selectedElements.forEach(element => void this.onDraggedOut(element));

        }

        this.overIndex = -1;

      }

      if (index > -1 && index !== this.state.selection.index && this.dropZones.indexOf(index) > -1) {

        if (this.onDragOver) { // the dropzone under then dragged item

          children.slice(index, index + 1).forEach(element => void this.onDragOver(element));

        }

        if (this.onDraggedOver) { // -> the dragged item over a dropzone

          selectedElements.forEach(element => void this.onDraggedOver(element));

        }

        this.overIndex = index;
      }

    }



    let translate = this.getTranslate(selectedElements);

    selectedElements.forEach(element => element.style.transform = `translate(${translate.x}px, ${translate.y}px)`);

  }


  endDrag() {

    // const children = this.getChildren();
    //
    // const elements = children.slice(this.state.selection.index, this.state.selection.index + this.state.selection.length);
    //
    // elements.forEach(element => {
    //   element.classList.remove("drag");
    //   element.style.transform = "none";
    // });
    //
    // this.container.classList.remove("dragging");


    super.endDrag();

    if (this.overIndex > -1) {

      const children = this.getChildren();

      const elements = children.slice(this.state.selection.index, this.state.selection.index + this.state.selection.length);

      elements.forEach(element => element.remove());

      if (this.onDragOut) {

        children.slice(this.overIndex, this.overIndex + 1).forEach(element => void this.onDragOut(element));

      }

      if (this.ondrop) {

        this.ondrop(this.overIndex, this.state.selection);

      }

    } else {

      if (this.onCancelDrag) {

        this.onCancelDrag();

      }

    }

  }


}
