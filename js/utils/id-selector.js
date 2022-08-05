

KarmaFieldsAlpha.IdSelector = class {

  constructor() {

    this.items = [];

  }

  getItems(segment) {
    const items = [];
    for (let i = segment.index; i < segment.index + segment.length; i++) {
      items.push(this.items[i]);
    }
    return items;
  }

  getSelectedItems() {
    if (this.selection) {
      return this.getItems(this.selection);
    }
    return [];
  }

  // getRect(index) {
  //   const item = this.items[index];
  //   const firstElement = item.elements[0];
  //   const lastElement = item.elements[item.elements.length-1];
  //   return {
  //     x: firstElement.offsetLeft,
  //     y: lastElement.offsetTop,
  //     width: lastElement.x + lastElement.width - firstElement.x,
  //     height: lastElement.y + lastElement.height - firstElement.y
  //   }
  // }

  getRect(segment) {
    const item = this.items[segment.index];
    const lastItem = this.items[segment.index + segment.length - 1];
    const firstElementBox = item.elements[0].getBoundingClientRect();
    const lastElementBox = lastItem.elements[lastItem.elements.length-1].getBoundingClientRect();
    return {
      x: firstElementBox.left,
      y: firstElementBox.top,
      width: lastElementBox.right - firstElementBox.left,
      height: lastElementBox.bottom - firstElementBox.top,
    }
  }


  growSelection(segment) {

    let selection = KarmaFieldsAlpha.Segment.union(this.startSegment, segment);

    if (!this.selection || !KarmaFieldsAlpha.Segment.equals(selection, this.selection)) {

      if (this.selection && this.onUnselect) {
        this.onUnselect(this);
      }

      if (this.selection && this.onUnselectElement) {
        this.getSelectedItems().forEach(item => {
          item.elements.forEach(element => {
            this.onUnselectElement(element);
          });
        });
      }

      this.selection = selection;

      if (this.onSelect) {
        this.onSelect(this);
      }

      if (this.onSelectElement) {
        this.getSelectedItems().forEach(item => {
          item.elements.forEach(element => {
            this.onSelectElement(element);
          });
        });
      }

    }

  }

  completeSelection() {
    if (this.onSelectionComplete) {
      this.onSelectionComplete(this);
    }
    if (this.onSelectIds) {
      const ids = this.getSelectedItems().map(item => item.id);
      this.onSelectIds(ids);
    }
  }

  startSelection(segment) {
    if (this.onSelectionStart) {
      this.onSelectionStart(this);
    }
    if (!this.startSegment || !event.shiftKey) {
      this.startSegment = segment;
    }
  }


  clearSelection() {

    if (this.selection && this.onUnselect) {
      this.onUnselect();
    }

    if (this.selection && this.onUnselectElement) {
      this.getSelectedItems().forEach(item => {
        item.elements.forEach(element => {
          this.onUnselectElement(element);
        });
      });
    }

    this.selection = null;
    this.startSegment = null;

  }

  reset() {

    this.items = [];

    this.selection = null;
    this.startSegment = null;

  }

  isSelected(id) {
    return this.getSelectedItems().some(item => item.id === id);
  }

  registerItem(id, index) {

    const item = {
      id: id,
      elements: []
    };

    this.items.push(item);

    return item;
  }

  registerCell(index, element, active) {

    const item = this.items[index];

    item.elements.push(element);

    if (active) {

      element.onmousedown = event => {

        // console.log(event.clientX, event.clientY, this.getRect({index: index, length: 1}));


        if (event.buttons === 1) {

          const onMouseMove = event => {

            const index = this.items.findIndex((item, index) => {
              const rect = this.getRect({index: index, length: 1});
              return KarmaFieldsAlpha.Rect.contains(rect, event.clientX, event.clientY);
            });

            if (index > -1) {

              this.growSelection({index: index, length: 1});

            }

          }

          const onMouseUp = event =>  {
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("mousemove", onMouseMove);

            onMouseMove(event);

            this.completeSelection();

          }

          this.startSelection({index: index, length: 1});

          onMouseMove(event);

          document.addEventListener("mouseup", onMouseUp);
          document.addEventListener("mousemove", onMouseMove);

        }


      }

    }

  }





}
