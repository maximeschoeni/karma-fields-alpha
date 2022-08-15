

KarmaFieldsAlpha.IdSelector = class {

  constructor(...path) {

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

  getSelectedIds() {
    return this.getSelectedItems().map(item => item.id);
  }

  createSelection(ids, selectedIds) {
    let segment;
    for (let i = 0; i < ids.length; i++) {
      if (selectedIds.includes(ids[i])) {
        segment = segment ? KarmaFieldsAlpha.Segment.union(segment, {index: i, length: 1}) : {index: i, length: 1};
      }
    }
    return segment;
  }

  // selectIds(ids) {
  //   this.items.forEach(item => {
  //     item.cells.forEach(cell => {
  //       // this.onSelectElement(cell.element);
  //       cell.element.classList.add("selected");
  //     });
  //   });
  // }
  //
  // unselectIds(ids) {
  //   this.items.forEach(item => {
  //     item.cells.forEach(cell => {
  //       // this.onUnselectElement(cell.element);
  //       cell.element.classList.remove("selected");
  //     });
  //   });
  // }

  paint(segment, ...className) {
    if (segment) {
      for (let i = segment.index; i < segment.index + segment.length; i++) {
        this.items[i].cells.forEach(cell => {
          cell.element.classList.add(...className);
        });
      }
    }
  }

  unpaint(segment, ...className) {
    if (segment) {
      for (let i = segment.index; i < segment.index + segment.length; i++) {
        this.items[i].cells.forEach(cell => {
          cell.element.classList.remove(...className);
        });
      }
    }
  }

  addClass(...classes) {
    this.getSelectedItems().forEach(item => {
      item.cells.forEach(cell => {
        cell.element.classList.add(...classes);
      });
    });
  }

  removeClass(...classes) {
    this.getSelectedItems().forEach(item => {
      item.cells.forEach(cell => {
        cell.element.classList.remove(...classes);
      });
    });
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
    const firstElementBox = item.cells[0].element.getBoundingClientRect();
    const lastElementBox = lastItem.cells[lastItem.cells.length-1].element.getBoundingClientRect();
    return {
      x: firstElementBox.left,
      y: firstElementBox.top,
      width: lastElementBox.right - firstElementBox.left,
      height: lastElementBox.bottom - firstElementBox.top,
    }
  }


  growSelection(segment) {

    if (!this.startSegment) {
      this.startSegment = segment; // -> when registering selected item
    }

    let selection = KarmaFieldsAlpha.Segment.union(this.startSegment, segment);

    if (!this.selection || !KarmaFieldsAlpha.Segment.equals(selection, this.selection)) {

      // if (this.parent && this.parent.constructor === KarmaFieldsAlpha.fields.gallery) debugger;

      // if (this.selection && this.onUnselect) {
      //   this.onUnselect(this);
      // }


      // if (this.selection && this.onUnselectElement) {
      if (this.selection) {

        // this.unselectSegment(this.selection, "selecting");
        this.removeClass("selecting");

        // this.getSelectedItems().forEach(item => {
        //   item.cells.forEach(cell => {
        //     // this.onUnselectElement(cell.element);
        //     cell.element.classList.remove("selected");
        //   });
        // });
      }

      this.selection = selection;

      // if (this.onSelect) {
      //   this.onSelect(this);
      // }

      // this.selectSegment(this.selection, "selecting");
      this.addClass("selecting");

      // if (this.onSelectElement) {
        // this.getSelectedItems().forEach(item => {
        //   item.cells.forEach(cell => {
        //     // this.onSelectElement(cell.element);
        //     cell.element.classList.add("selected");
        //   });
        // });
      // }

      // if (this.onSelectCell) {
      //   this.getSelectedItems().forEach(item => {
      //     item.cells.forEach(cell => {
      //       this.onSelectCell(cell);
      //     });
      //   });
      // }

    }

  }

  completeSelection() {
    // this.removeClass("selecting");
    // this.addClass("selected");

    this.unpaint(this.selection, "selecting");
    this.paint(this.selection, "selected");

    if (this.onSelectionComplete) {
      this.onSelectionComplete(this.selection);
    }

    // if (this.onSelectIds) {
    //   const ids = this.getSelectedItems().map(item => item.id);
    //   this.onSelectIds(ids);
    // }
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
    console.error("deprecated");
    if (this.selection && this.onUnselect) {
      this.onUnselect();
    }

    if (this.selection && this.onUnselectElement) {

      this.getSelectedItems().forEach(item => {

        item.cells.forEach(cell => {
          this.onUnselectElement(cell.element);
        });
      });
    }

    this.selection = null;
    // this.startSegment = null;

  }

  updateSelection(segment, currentSelection) {

    if (currentSelection && !KarmaFieldsAlpha.Segment.equals(segment, currentSelection)) {

      this.unpaint(currentSelection, "selected");
    }

    if (this.selection && !KarmaFieldsAlpha.Segment.equals(segment, this.selection)) {

      this.unpaint(this.selection, "selected");

    }

    this.selection = segment;

    if (this.selection) {

      this.paint(this.selection, "selected");

    }

  }

  reset() {

    this.items = [];

    this.selection = null;
    this.startSegment = null;

  }

  isSelected(id) {
    return this.getSelectedItems().some(item => item.id === id);
  }

  registerItem(index) {

    this.items[index] = {
      cells: []
    };

    // if (selected) {
    //   this.growSelection({index: index, length});
    // }

    return this.items[index];
  }

  registerCell(index, element, param = {}) {

    const item = this.items[index] || this.registerItem(index);

    // item.elements.push(element);
    // item.params.push(param);

    const cell = {
      element: element,
      param: param,
      box: {}
    };

    item.cells.push(cell);

    const selected = this.selection && this.selection.contains(index);

    element.classList.toggle("selected", Boolean(selected));

    // if (active) {

      element.onmousedown = event => {

        if (event.buttons === 1) {

          // event.preventDefault();

          this.onMouseDown(index, event, cell);



          // const onMouseMove = event => {
          //
          //   const index = this.items.findIndex((item, index) => {
          //     const rect = this.getRect({index: index, length: 1});
          //     return KarmaFieldsAlpha.Rect.contains(rect, event.clientX, event.clientY);
          //   });
          //
          //   if (index > -1) {
          //
          //     this.growSelection({index: index, length: 1});
          //
          //   }
          //
          // }
          //
          // const onMouseUp = event =>  {
          //   document.removeEventListener("mouseup", onMouseUp);
          //   document.removeEventListener("mousemove", onMouseMove);
          //
          //   onMouseMove(event);
          //
          //   this.completeSelection();
          //
          // }
          //
          // this.startSelection({index: index, length: 1});
          //
          // onMouseMove(event);
          //
          // document.addEventListener("mouseup", onMouseUp);
          // document.addEventListener("mousemove", onMouseMove);

        }


      }

    // }

    return cell;

  }

  findIndex(x, y) {
    return this.items.findIndex((item, index) => {
      const rect = this.getRect({index: index, length: 1});
      return KarmaFieldsAlpha.Rect.contains(rect, event.clientX, event.clientY);
    });
  }


  onMouseDown(index, event) {

    // event.preventDefault();

    const onMouseMove = event => {

      // const index = this.items.findIndex((item, index) => {
      //   const rect = this.getRect({index: index, length: 1});
      //   return KarmaFieldsAlpha.Rect.contains(rect, event.clientX, event.clientY);
      // });

      const index = this.findIndex(event.clientX, event.clientY);

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

    // this.startSelection({index: index, length: 1});

    this.startSegment = null;

    this.updateSelection();

    onMouseMove(event);

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);

  }





}
