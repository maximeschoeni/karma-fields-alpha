

KarmaFieldsAlpha.fields.table.interface = class extends KarmaFieldsAlpha.fields.field {

  constructor(...args) {
    super(...args);



    // this.elementsMap = new KarmaFieldsAlpha.Grid();
    // this.fieldsMap = new KarmaFieldsAlpha.Grid();
    // this.indexMap = {};

    this.items = [];
    this.elementIndex = new Map();
    this.selectionBuffer = new KarmaFieldsAlpha.Buffer("state", "selection");
    this.idIndex = new Map();

    this.ta = document.createElement("textarea");
    document.body.appendChild(this.ta);
    this.ta.className = "karma-fields-ta";
    this.ta.style = "position:fixed;bottom:0;right:0;z-index:999999999";

    this.ta.oninput = async event => {

      switch (event.inputType) {

        case "deleteByCut":
        case "deleteContentBackward":
        case "deleteContentForward":
        case "deleteContent":
        case "insertFromPaste": {


          if (this.resource.copyMode === "id") {
            const ids = this.ta.value && this.ta.value.split(/[\r\n]/) || [];
            await this.dispatch({
              action: "insert",
              data: ids
            });
          } else {
            const data = this.ta.value && JSON.parse(this.ta.value) || [];
            await this.dispatch({
              action: "write",
              data: data
            });
          }



          break;
        }

        default: {
          break;
        }

      }

    }


    this.dataTA = document.createElement("textarea");
    document.body.appendChild(this.dataTA);
    this.dataTA.className = "karma-fields-ta";
    this.dataTA.style = "position:fixed;bottom:0;right:200px;z-index:999999999";

    this.dataTA.oninput = async event => {

      let data = this.dataTA.value.split(/[\r\n]/).map(row => row.split("\t"));

      if (this.selectionRect) {

        KarmaFieldsAlpha.History.save();

        for (let j = 0; j < Math.max(this.selectionRect.height, data.length); j++) {
          for (let i = 0; i < Math.max(this.selectionRect.width, data[j%data.length].length); i++) {

            const index = (this.selectionRect.y + j)*this.width + this.selectionRect.x + i;
            const item = this.items[index];

            if (item) {
              const value = data[j%data.length][i%data[j%data.length].length];

              await item.field.dispatch({
      					action: "set",
      					backup: true,
      					data: [value]
      				});

            }
          }
        }

        await this.dispatch({action: "render"});
      }

    }

  }

  // async dispatch(event) {
  //
  //   console.log(event);
  //
  //   switch (event.action) {
  //
  //     case "index": {
  //       const [id] = event.path;
  //
  //       event.data = id;
  //       break;
  //     }
  //
  //     default:
  //       await super.dispatch(event);
  //       break;
  //
  //   }
  //
  //   return event;
  // }



  // async importData(data, field) {
  //
  //   const point = field && this.fieldsMap.find(field) || {};
  //
  //   const {x, y, width, height} = {...new KarmaFieldsAlpha.Rect(), ...point, ...this.selection};
  //
  //
  //
  //   // for (let j = 0; j < Math.max(height, data.length); j++) {
  //   //   for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
  //   //     const field = this.fieldsMap.get(x + i, y + j);
  //   //     if (field) {
  //   //       await field.backup();
  //   //     }
  //   //   }
  //   // }
  //
  //   // this.parent.grid.save("import-data");
  //   KarmaFieldsAlpha.History.save();
  //
  //   for (let j = 0; j < Math.max(height, data.length); j++) {
  //     for (let i = 0; i < Math.max(width, data[j%data.length].length); i++) {
  //
  //       const field = this.fieldsMap.get(x + i, y + j);
  //
  //       if (field) {
  //         const value = data[j%data.length][i%data[j%data.length].length];
  //
  //         await field.dispatch({
  // 					action: "set",
  // 					type: "string",
  // 					backup: "pack",
  // 					// autosave: this.resource.autosave,
  // 					data: [value]
  // 				});
  //
  //
  //
  //         // await field.render();
  //       }
  //     }
  //   }
  //
  //   await this.dispatch({
  //     action: "edit"
  //   });
  //
  // }



  registerTable(element) {

    // this.endSelection();

    // this.elementsMap = new KarmaFieldsAlpha.Grid();
    // this.fieldsMap = new KarmaFieldsAlpha.Grid();
    // this.indexMap = {};

    this.items = [];
    // this.elementIndex = new Map();
    // this.elementRowIndex = new Map();
    this.width = 0;
    this.height = 0;

    this.headerItems = [];

    // this.idSelection = new Set();
  }

  registerCell(element, col, row, field, id, selectMode) {

    // this.elementsMap.set(element, col, row);
    // this.fieldsMap.set(field, col, row);

    // this.elementIndex.set(element, this.items.length);

    this.items.push({
      element: element,
      field: field,
      x: col,
      y: row,
      id: id
    });

    this.width = Math.max(col+1, this.width);
    this.height = Math.max(row+1, this.height);

    // this.idSelection = new Set();

    // this.startRect;
    // this.selectionRect;



    const onMouseUp = async event => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
      // this.selecting = false;
      onMouseMove(event);


      switch (selectMode) {

        // case "open-modal": {
        //   // element.parentNode.classList.remove("selecting-ids");
        //   this.selectIds(this.selectionRect);
        //
        //
        //
        //   // this.selectionRect = null;
        //   // this.startRect = null;
        //
        //   this.dispatch({action: "render"});
        //   break;
        // }

        case "ids": {
          // element.parentNode.classList.remove("selecting-ids");
          this.selectIds(this.selectionRect);
          // this.selectionRect = null;
          // this.startRect = null;

          if (field.openModal) {
            const ids = this.selectionBuffer.get() || [];
            const value = ids.join(",");

            KarmaFieldsAlpha.Nav.backup(value, "id");
            KarmaFieldsAlpha.Nav.set(value, "id");
          }



          this.dispatch({action: "render"});
          break;
        }

        case "data": {
          // element.parentNode.classList.remove("selecting-data");
          this.selectData(this.selectionRect);
          break;
        }

      }
      // if (selectMode === "ids") {
      //   element.parentNode.classList.add("selecting-ids");
      // } else if (selectMode === "data") {
      //   element.parentNode.classList.add("selecting-data");
      // }


      // this.endSelection();
    }

    const onMouseMove = event => {

      const item = this.items.find(item => KarmaFieldsAlpha.Rect.contains(item.element.getBoundingClientRect(), event.clientX, event.clientY));

      if (item) {

        if (!this.startRect) {
          this.startRect = {x: item.x, y: item.y, width: 1, height: 1};
        }

        // let rect = KarmaFieldsAlpha.Rect.union(this.startRect, {x: item.x, y: item.y, width: 1, height: 1});
        let rect;

        if (selectMode === "ids") {
          rect = KarmaFieldsAlpha.Rect.union(this.startRect, {x: 0, y: item.y, width: this.width, height: 1});
        } else {
          rect = KarmaFieldsAlpha.Rect.union(this.startRect, {x: item.x, y: item.y, width: 1, height: 1});
        }


        if (!this.selectionRect || !KarmaFieldsAlpha.Rect.equals(rect, this.selectionRect)) {

          if (this.selectionRect) {
            this.unpaint(this.selectionRect, "selected");
          }

          this.paint(rect, "selected");
          this.selectionRect = rect;

        }

      }

    }

    element.onmousedown = event => {
      // this.selecting = true;



      if (event.buttons === 1) {

        element.parentNode.classList.toggle("selecting-ids", selectMode === "ids");
        element.parentNode.classList.toggle("selecting-data", selectMode === "data");

        // switch (selectMode) {
        //
        //   case "ids": {
        //     element.parentNode.classList.add("selecting-ids");
        //     break;
        //   }
        //
        //   case "data": {
        //     element.parentNode.classList.add("selecting-data");
        //     break;
        //   }
        //
        // }

        if (this.startRect && event.shiftKey) {
          event.preventDefault(); // -> prevent focus lose on TA
          // this.growSelection({x: col, y:row, width: 1, height: 1});
        } else {
          // this.startSelection({x: col, y:row, width: 1, height: 1});
          this.startRect = {x: col, y:row, width: 1, height: 1};
          //this.idSelection = new Set();
        }

        onMouseMove(event);


        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);

      }

    }

  }

  // registerIndex(element, row, id) {
  //
  //   // this.indexMap[row] = element;
  //
  //
  //
  //   this.elementRowIndex.set(element, this.ids.length);
  //   this.ids.push(id);
  //
  //   const onMouseUp = event => {
  //     document.removeEventListener("mouseup", onMouseUp);
  //     this.selecting = false;
  //     this.endSelection();
  //   }
  //
  //   element.onmousedown = event => {
  //     this.selecting = true;
  //     if (event.shiftKey) {
  //       event.preventDefault(); // -> prevent focus lose on TA
  //       this.growSelection({x: 0, y: row, width: this.width, height: 1});
  //     } else {
  //       this.startSelection({x: 0, y: row, width: this.width, height: 1});
  //     }
  //     document.addEventListener("mouseup", onMouseUp);
  //   }
  //
  //   element.onmouseover = event => {
  //     if (this.selecting && event.buttons === 1) {
  //       this.growSelection({x: 0, y: row, width: this.elementsMap.width, height: 1});
  //     }
  //   }
  //
  // }

  registerHeader(element, col, selectMode) {

    this.headerItems.push({
      element: element,
      x: col
    });

    const onMouseUp = event => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);

      onMouseMove(event);

      switch (selectMode) {

        case "ids": {
          // element.parentNode.classList.remove("selecting-ids");
          this.selectIds(this.selectionRect);
          this.dispatch({action: "render"});
          break;
        }

        case "data": {
          // element.parentNode.classList.remove("selecting-data");
          this.selectData(this.selectionRect);
          break;
        }

      }

    }

    const onMouseMove = event => {

      const headerItem = this.headerItems.find(item => KarmaFieldsAlpha.Rect.contains(item.element.getBoundingClientRect(), event.clientX, event.clientY));

      if (headerItem) {

        const rect = KarmaFieldsAlpha.Rect.union(this.startRect, {x: headerItem.x, y: 0, width: 1, height: this.height});

        if (!this.selectionRect || !KarmaFieldsAlpha.Rect.equals(rect, this.selectionRect)) {

          if (this.selectionRect) {
            this.unpaint(this.selectionRect, "selected");
          }

          this.paint(rect, "selected");
          this.selectionRect = rect;

        }

      }

    }

    element.onmousedown = event => {

      if (event.buttons === 1) {

        element.parentNode.classList.toggle("selecting-ids", selectMode === "ids");
        element.parentNode.classList.toggle("selecting-data", selectMode === "data");

        // switch (selectMode) {
        //
        //   case "ids": {
        //     element.parentNode.classList.add("selecting-ids");
        //     break;
        //   }
        //
        //   case "data": {
        //     element.parentNode.classList.add("selecting-data");
        //     break;
        //   }
        //
        // }

        if (this.startRect && event.shiftKey) {
          event.preventDefault(); // -> prevent focus lose on TA
        } else {
          this.startRect = {x: col, y:0, width: 1, height: this.height};
        }

        onMouseMove(event);

        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);

      }

    }




  }

  registerHeaderIndex(element) {

    // const onMouseUp = event => {
    //   document.removeEventListener("mouseup", onMouseUp);
    //   this.selecting = false;
    //   this.endSelection();
    // }
    //
    // element.onmousedown = event => {
    //   this.selecting = true;
    //   this.startSelection({x: 0, y: 0, width:this.width, height:this.height});
    //   document.addEventListener("mouseup", onMouseUp);
    // }
    //
    // element.onmouseover = event => {
    //   if (this.selecting && event.buttons === 1) {
    //     this.growSelection({x: 0, y: 0, width:this .width, height:this.height});
    //   }
    // }

    // element.onmousedown = event => {
    //   event.preventDefault();
    //   this.toggleSelection({x:0, y:0, width:this.elementsMap.width, height:this.elementsMap.height});
    // }
    //
    // element.onmousemove = event => {
    //   if (event.buttons === 1) {
    //     this.growSelection({x: 0, y :0, width: this.elementsMap.width, height: this.elementsMap.height});
    //   }
    // }
  }

  // growSelection(r) {
  //   if (this.focusRect) {
  //     r = KarmaFieldsAlpha.Rect.union(this.focusRect, r);
  //   } else {
  //     this.focusRect = r;
  //   }
  //
  //   // if (!this.selection) {
  //   //   this.selection = r;
  //   //   this.paint(this.selection);
  //   // } else if (!KarmaFieldsAlpha.Rect.equals(this.selection, r)) {
  //   //   this.unpaint(this.selection);
  //   //   this.selection = r;
  //   //   this.paint(this.selection);
  //   // }
  //
  //
  //   if (!this.selection || !KarmaFieldsAlpha.Rect.equals(this.selection, r)) {
  //     // if (this.selection) {
  //     //   this.unpaint(this.selection);
  //     // }
  //     // this.selection = r;
  //     // if (this.selection.width*this.selection.height > 1) {
  //     //   this.paint(this.selection);
  //     // }
  //
  //
  //     this.deltaSelection(r);
  //     this.hasSelection = true;
  //   }
  //
  //
  // }
  //
  // deltaSelection(r) {
  //   if (this.selection) {
  //     this.unpaint(this.selection);
  //   }
  //   this.selection = r;
  //   // if (this.selection.width*this.selection.height > 1) {
  //     this.paint(this.selection);
  //   // }
  // }
  //
  // startSelection(r) {
  //   this.focusRect = r;
  //   // if (this.selection) {
  //   //   this.unpaint(this.selection);
  //   // }
  //   // this.selection = r;
  //   // if (this.selection.width*this.selection.height > 1) {
  //   //   this.paint(this.selection);
  //   // }
  //   this.deltaSelection(r);
  //   // this.hasSelection = true;
  // }

  // toggleSelection(r) {
  //   if (this.selection && KarmaFieldsAlpha.Rect.equals(this.selection, r)) {
  //     this.endSelection();
  //   } else {
  //     this.startSelection(r);
  //   }
  // }

  selectIds(rect) {
    const ids = [];

    for (let i = 0; i < rect.height; i++) {
      const index = (rect.y+i)*this.width;
      const item = this.items[index];
      if (item) {
        ids.push(item.id);
      }
    }

    const selectedIds = this.selectionBuffer.get() || [];

    if (KarmaFieldsAlpha.DeepObject.differ(ids, selectedIds)) {
      this.selectionBuffer.backup(ids);
      this.selectionBuffer.set(ids);
    }

    // this.ta.value = ids.join("\n");
    // this.ta.focus();
    // this.ta.select();
    // this.updateTA();

    // return this.dispatch({action: "render"});
  }

  async selectData(rect) {

    if (rect && rect.width*rect.height > 1) {

      const data = [];

      for (let i = 0; i < rect.height; i++) {
        const row = [];
        for (let j = 0; j < rect.width; j++) {
          const index = (rect.y+i)*this.width + rect.x + j;
          const item = this.items[index];
          const value = await item.field.exportValue();
          row.push(value);
        }
        data.push(row);
      }

      this.dataTA.value = data.map(row => row.join("\t")).join("\n");
      this.dataTA.focus();
      this.dataTA.select();

    }

  }


  // async endSelection() {
  //
  //   if (this.idSelection.size) {
  //     const ids = [...this.idSelection];
  //     this.selectionBuffer.backup(ids);
  //     this.selectionBuffer.set(ids);
  //     this.dispatch({action: "render"});
  //   } else if (this.selection && this.selection.width*this.selection.height > 1) {
  //     // const items = this.items.filter(item => KarmaFieldsAlpha.Rect.contains(this.selection, item.x, item.y));
  //     const data = [];
  //     for (let i = 0; i < this.selection.height; i++) {
  //       const row = [];
  //       for (let j = 0; j < this.selection.width; j++) {
  //         const index = (this.selection.y+i)*this.width + this.selection.x + j;
  //         const item = this.items[index];
  //         const value = await item.field.exportValue();
  //         row.push(value);
  //       }
  //       data.push(row);
  //     }
  //
  //     this.dataTA.value = data.map(row => row.join("\t")).join("\n");
  //     this.dataTA.focus();
  //     this.dataTA.select();
  //
  //   }
  //
  // }



  refocus() {

    // return;


    // if (this.selection) {
    //   this.unpaint(this.selection);
    // }
    //
    // this.selection = null;
    // this.focusRect = null;

    if (this.selectionRect) {
      this.unpaint(this.selectionRect);
    }

    this.selectionRect = null;
    this.startRect = null;


    if (KarmaFieldsAlpha.Nav.has("id")) {
      // const ids = this.selectionBuffer.get() || [];
      // this.ta.value = ids.join("\n");
      this.ta.focus();
      this.ta.select();
      // this.updateTA();
    } else {

      const ids = this.selectionBuffer.get() || [];

      if (ids.length) {
        this.selectionBuffer.backup();
        this.selectionBuffer.remove();
        this.dispatch({action: "render"});
      }


    }


  }




  paint(rect, className = "selected") {
    // console.log("paint");
    // console.time("paint");
    // for (let j = rect.y; j < rect.y + rect.height; j++) {
    //   const fullLine = rect.x === 0 && rect.width === this.elementsMap.width;
    //   if (fullLine && this.indexMap[j]) {
    //     this.indexMap[j].classList.add("active");
    //   }
    //   for (let i = rect.x; i < rect.x + rect.width; i++) {
    //     let element = this.elementsMap.get(i, j);
    //     if (element) {
    //       element.classList.add("selected");
    //       if (fullLine) {
    //         element.classList.add("active");
    //       }
    //     }
    //   }
    // }
    // console.timeEnd("paint");

    for (let j = rect.y; j < rect.y + rect.height; j++) {
      for (let i = rect.x; i < rect.x + rect.width; i++) {
        let index = j*this.width + i;
        let item = this.items[index];
        if (item) {
          item.element.classList.add(className);
        }
      }
    }
  }

  unpaint(rect, className = "selected") {
    // console.log("unpaint");
    // console.time("unpaint");
    // for (let j = rect.y; j < rect.y + rect.height; j++) {
    //   const fullLine = rect.x === 0 && rect.width === this.elementsMap.width;
    //
    //   if (fullLine) {
    //     if (this.indexMap[j]) {
    //       this.indexMap[j].classList.remove("active");
    //     }
    //   }
    //   for (let i = rect.x; i < rect.x + rect.width; i++) {
    //     let element = this.elementsMap.get(i, j);
    //     if (element) {
    //       element.classList.remove("selected");
    //       if (fullLine) {
    //         element.classList.remove("active");
    //       }
    //     }
    //   }
    // }
    // console.timeEnd("unpaint");

    for (let j = rect.y; j < rect.y + rect.height; j++) {
      for (let i = rect.x; i < rect.x + rect.width; i++) {
        let index = j*this.width + i;
        let item = this.items[index];
        if (item) {
          item.element.classList.remove(className);
        }
      }
    }
  }

  // throttle(callback, delay = 200) {
	// 	if (this.throttleTimer) {
	// 		clearTimeout(this.throttleTimer);
	// 	}
	// 	this.throttleTimer = setTimeout(callback, delay);
	// }

  // async renderTA() {
  //
  //   const ta = document.createElement("textarea");
  //
  //   ta.onfocusout = event => {
  //     const selection = this.selection;
  //     this.endSelection();
  //     if (selection && (this.selecting || event.shiftKey)) {
  //       this.startSelection(selection);
  //     } else {
  //       this.editSelection();
  //     }
  //   }
  //
  //   ta.oninput = async event => {
  //
  //     let data = ta.element.value.split(/[\r\n]/).map(row => row.split("\t"));
  //
  //     await this.importData(data);
  //
  //     switch (event.inputType) {
  //
  //       case "insertFromPaste":
  //       case "deleteByCut":
  //       case "deleteContentBackward":
  //       case "deleteContentForward":
  //       case "deleteContent":
  //         ta.element.blur();
  //         break;
  //
  //     }
  //
  //   }
  //
  //   const data = [];
  //
  //   if (this.hasCellsSelected()) {
  //
  //     for (let j = 0; j < this.selection.height; j++) {
  //
  //       const dataRow = [];
  //
  //       for (let i = 0; i < this.selection.width; i++) {
  //
  //         const field = this.fieldsMap.get(this.selection.x + i, this.selection.y + j);
  //         const value = await field.exportValue();
  //
  //         dataRow.push(value);
  //
  //       }
  //
  //       data.push(dataRow);
  //
  //     }
  //
  //     ta.element.focus();
  //     ta.element.value = data.map(row => row.join("\t")).join("\n");
  //     ta.element.select();
  //
  //   }
  //
  // }


  // buildTA() {
  //   return {
  //     tag: "textarea",
  //     class: "karma-grid-ta2",
  //     init: ta => {
  //       this.render = ta.render;
  //
  //       ta.element.style = "left:-100%;position:absolute;";
  //       // ta.element.style = "max-height:40px";
  //
  //       // this.render = clean => {
  //       //   console.log("render");
  //       //   ta.render(clean);
  //       // };
  //
  //       ta.element.onfocusout = event => {
  //         const selection = this.selection;
  //         this.endSelection();
  //         if (selection && (this.selecting || event.shiftKey)) {
  //           this.startSelection(selection);
  //         } else {
  //           this.editSelection();
  //         }
  //       }
  //
  //       ta.element.oninput = async event => {
  //
  //         let data = ta.element.value.split(/[\r\n]/).map(row => row.split("\t"));
  //
  //         await this.importData(data);
  //
  //         switch (event.inputType) {
  //
  //           case "insertFromPaste":
  //           case "deleteByCut":
  //           case "deleteContentBackward":
  //           case "deleteContentForward":
  //           case "deleteContent":
  //             ta.element.blur();
  //             break;
  //
  //         }
  //
  //       }
  //     },
  //     update: async ta => {
  //
  //       ta.element.blur();
  //
  //
  //       const data = [];
  //       // if (this.hasSelection && this.selection && this.selection.width*this.selection.height > 1) {
  //       // if (this.selection) {
  //
  //       if (this.hasCellsSelected()) {
  //
  //         for (let j = 0; j < this.selection.height; j++) {
  //
  //           const dataRow = [];
  //
  //           for (let i = 0; i < this.selection.width; i++) {
  //
  //             const field = this.fieldsMap.get(this.selection.x + i, this.selection.y + j);
  //             const value = await field.exportValue();
  //
  //             dataRow.push(value);
  //
  //           }
  //
  //           data.push(dataRow);
  //
  //         }
  //
  //
  //         ta.element.focus();
  //         ta.element.value = data.map(row => row.join("\t")).join("\n");
  //         ta.element.select();
  //
  //
  //
  //         // this.throttle(() => {
  //         //   console.log("xx");
  //         //   ta.element.focus();
  //         //   ta.element.value = data.map(row => row.join("\t")).join("\n");
  //         //   ta.element.select();
  //         // }, 2000);
  //
  //       // } else if (this.focusTarget) {
  //       //
  //       //   ta.element.value = "";
  //       //   this.focusTarget.focus();
  //       //   this.focusTarget = null;
  //
  //       } else {
  //
  //         // ta.element.value = "";
  //         // ta.element.blur();
  //
  //
  //       }
  //     }
  //   }
  // }

  async updateTA() {
    const ids = this.selectionBuffer.get() || [];

    if (this.resource.copyMode === "id") {
      this.ta.value = ids.join("\n");
    } else {
      if (ids.length) {
        const array = [];
        for (let id of ids) {
          const item = await this.dispatch({
            action: "row",
            path: [id]
          }).then(request => request.data);
          array.push(item);
        }
        this.ta.value = JSON.stringify(array);
      } else {
        this.ta.value = "";
      }
    }

    this.ta.focus();
    this.ta.select();
  }


  build(ids, page, ppp, columns) {

    const offset = (Number(page) - 1)* Number(ppp);

    return {
      class: "table grid",
      init: async grid => {

        // this.grid.render = grid.render;

        if (this.resource.style) {
          grid.element.style = this.resource.style;
        }

        this.ta.onfocus = event => {
          grid.element.classList.add("ta-focus");
        }
        this.ta.onblur = event => {
          grid.element.classList.remove("ta-focus");
        }

        // if (this.resource.style) {
        //   grid.element.style = this.resource.style;
        // } else if (this.resource.grid && this.resource.grid.style) {
        //   grid.element.style = this.resource.grid.style;
        // }
      },
      update: async grid => {


        this.registerTable(grid.element);

        this.idIndex = new Map();

        const selectedIds = this.selectionBuffer.get() || [];

        if (ids.length) {
          grid.element.classList.add("filled"); // -> draw table borders
          grid.children = [
            ...columns.map((colId, colIndex) => {
              const child = this.resource.children[colId];
              return {
                class: "th table-header-cell",
                init: th => {
                  if (child.style) {
                    th.element.style = child.style;
                  }
                  th.element.tabIndex = -1;
                },
                update: th => {
                  th.children = [
                    {
                      tag: "a",
                      class: "header-cell-title",
                      init: a => {
                        a.element.textContent = child.label;
                      }
                    },
                  ];
                  if (child.sortable) {

                    th.children.push(this.createChild({
                      type: "sorter",
                      id: "sorter-"+(child.orderby || child.key),
                      key: child.orderby || child.key,
                      order: child.order
                    }).build());

                  }
                  this.registerHeader(th.element, colIndex, "data");
                }
              }
            }),
            ...ids.reduce((children, id, rowIndex) => {

              const row = this.createChild({
                key: id,
                type: "row",
                children: this.resource.children || [],
                id: id
              });

              this.idIndex.set(id, offset + rowIndex + 1);

              const isSelected = selectedIds.includes(id);

              return [
                ...children,
                // {
                //   class: "th",
                //   child: {
                //     class: "table-index",
                //     update: node => {
                //       node.element.textContent = (Number(page) - 1)* Number(ppp) + rowIndex + 1;
                //     }
                //   },
                //   update: th => {
                //     this.registerIndex(th.element, rowIndex, id);
                //   }
                // },
                ...columns.map((colId, colIndex) => {
                  const child = this.resource.children[colId];
                  const field = row.createChild({
                    ...child,
                    id: colId,
                    index: colIndex
                  });

                  return {
                    class: "td table-cell",
                    init: td => {
                      if (child.style) {
                        td.element.style = child.style;
                      }
                      td.element.tabIndex = -1;
                    },
                    update: td => {
                      td.element.classList.toggle("active", isSelected);
                      td.element.classList.remove("selected");
                      this.registerCell(td.element, colIndex, rowIndex, field, id, field.selectMode || "data");
                    },
                    // child: field.build()
                    children: [
                      field.build(),
                      // {
                      //   tag: "span",
                      //   class: "dashicons dashicons-cloud"
                      // }
                    ]
                  };
                })
              ];
            }, [])
          ];

          // grid.element.style.gridTemplateColumns = [
          //   this.resource.index && this.resource.index.width || "50px",
          //   ...columns.map(index => this.resource.children[index].width || "auto")
          // ].join(" ");

          grid.element.style.gridTemplateColumns = columns.map(index => this.resource.children[index].width || "auto").join(" ");

        } else {
          grid.children = [];
          grid.element.classList.remove("filled");
        }
      },
      complete: async grid => {
        this.updateTA();
        // const ids = this.selectionBuffer.get() || [];
        // // this.ta.value = ids.join("\n");
        // // this.ta.focus();
        // // this.ta.select();
        //
        // if (this.resource.copyMode === "id") {
        //   this.ta.value = ids.join("\n");
        // } else {
        //   if (ids.length) {
        //     const array = [];
        //     for (let id of ids) {
        //       const item = await this.dispatch({
        //         action: "row",
        //         path: [id]
        //       }).then(request => request.data);
        //       array.push(item);
        //     }
        //     this.ta.value = JSON.stringify(array);
        //   }
        // }
        //
        // this.ta.focus();
        // this.ta.select();


      }
    };
  }



  async dispatch(event, parent) {

    switch (event.action) {

      case "set": {

        if (event.field.resource.type === "input" && event.pasted) {


          const value = KarmaFieldsAlpha.Type.toString(event.data);
          const data = value.split(/[\r\n]/).map(row => row.split("\t"));




          // if (data.length > 1 || data[0].length > 1) {

            // await this.dispatch(this.createEvent({
            //   action: "importselection",
            //   data: data,
            //   field: event.target
            // }));
            await super.dispatch({
              action: "importselection",
              data: data,
              field: event.field
            });

            break;

          // }

        }



        await super.dispatch(event);


        // -> render controls + interface
        // await super.dispatch(this.createEvent({
        //   action: "edit-grid",
        //   request: event
        // }));

        break;
      }

      case "index": {
        const [id] = event.path;

        event.data = this.idIndex.get(id);
        break;
      }

      default:
        await super.dispatch(event);
        break;

    }

    return event;
  }

  static sorter = class extends KarmaFieldsAlpha.fields.field {


    build() {
      return {
        tag: "a",
        class: "header-cell-order",
        child: {
          tag: "span",
          class: "dashicons",
          update: span => {
            const order = KarmaFieldsAlpha.Nav.get("order");
            const orderby = KarmaFieldsAlpha.Nav.get("orderby");
            const isAsc = orderby === (this.resource.orderby || this.resource.key) && order === "asc";
            const isDesc = orderby === (this.resource.orderby || this.resource.key) && order === "desc";
            span.element.classList.toggle("dashicons-arrow-up", isAsc);
            span.element.classList.toggle("dashicons-arrow-down", isDesc);
            span.element.classList.toggle("dashicons-leftright", !isAsc && !isDesc);
          }
        },
        update: a => {
          a.element.onclick = async event => {
            event.preventDefault();
            a.element.parentNode.classList.add("loading");

            await this.dispatch({
              action: "order",
              data: this.resource.orderby || this.resource.key,
              order: this.resource.order // -> default order
              // orderby: this.resource.orderby || this.resource.key
            });

            a.element.parentNode.classList.remove("loading");
          };
        }
      }
    }
  }

  static row = class extends KarmaFieldsAlpha.fields.field {


    async dispatch(event) {

      switch (event.action) {

        // case "get":
        //   if (event.path && event.path[event.path.length-1] === "id") {
        //     if (event.join) {
        //       await super.dispatch({
        //         action: "join",
        //         data: event.join,
        //         path: [...event.path]
        //       });
        //     }
        //     event.data = [this.resource.key];
        //     break;
        //   }
        //
        //   await super.dispatch(event);
        //   break;

        default:
          await super.dispatch(event);
          break;

      }




      return event;
    }

    static modal = class extends KarmaFieldsAlpha.fields.text {

      constructor(...args) {
        super(...args);

        this.selectMode = "ids";
        this.openModal = true;
      }

      // build() {
      //   return {
      //     class: "karma-modal",
      //     update: async container => {
      //       container.element.textContent = await this.parse(this.resource.value);
      //     }
      //   };
      // }

      build() {
        return {
          tag: this.resource.tag,
          class: "text karma-field",
          init: node => {
            node.element.style.cursor = "pointer";
          },
          update: async node => {
            node.element.innerHTML = await this.parse(this.resource.value || "");
          }
        };
      }

    }

    static tableIndex = class extends this.modal {

      constructor(resource) {
        super({
          width: "40px",
          ...resource
        });

        this.openModal = false;

      }

      build() {
        return {
          class: "karma-field text",
          update: async container => {
            container.element.textContent = await this.dispatch({
              action: "index"
            }).then(request => request.data);
          }
        };
      }

    }

  }


}
