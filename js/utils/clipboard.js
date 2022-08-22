

KarmaFieldsAlpha.Clipboard = class {

  constructor() {

    this.ta = document.createElement("textarea");

    // document.body.appendChild(this.ta);
    this.constructor.container.appendChild(this.ta);
    // this.ta.className = "karma-fields-ta";
    // this.ta.style = "position:fixed;bottom:0;left:200px;z-index:999999999";

    this.ta.oninput = async event => {

      switch (event.inputType) {

        case "deleteByCut":
        case "deleteContentBackward":
        case "deleteContentForward":
        case "deleteContent":
        case "insertFromPaste": {

          if (this.onInput) {
            const dataArray = this.prepare(this.ta.value);
            this.onInput(dataArray)
          }

          break;
        }

        default: {
          break;
        }

      }

    }

  }

  setData(dataArray) {
    const value = this.constructor.unparse(dataArray);
    this.set(value);
  }

  setJson(data) {
    const dataArray = this.constructor.toDataArray(data);
    this.setData(dataArray);
  }

  set(value) {
    this.ta.value = value;
    this.ta.focus();
    this.ta.select();
  }

  focus(value) {
    this.ta.focus();
    this.ta.select();
  }

  prepare(string) {
    return this.constructor.parse(string);
  }


  static build() {

    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    this.container.className = "karma-fields-clipboard";
    this.container.style = "position:fixed;bottom:100%;left:0;z-index:999999999";


    // this.ta = document.createElement("textarea");
    // document.body.appendChild(this.ta);
    // this.ta.className = "karma-fields-ta";
    // this.ta.style = "position:fixed;bottom:0;left:200px;z-index:999999999";
    //
    // this.ta.oninput = async event => {
    //
    //   switch (event.inputType) {
    //
    //     case "deleteByCut":
    //     case "deleteContentBackward":
    //     case "deleteContentForward":
    //     case "deleteContent":
    //     case "insertFromPaste": {
    //
    //       if (this.onInput) {
    //         const dataArray = this.prepare(this.ta.value);
    //         this.onInput(dataArray)
    //       }
    //
    //       break;
    //     }
    //
    //     default: {
    //       break;
    //     }
    //
    //   }
    //
    // }

  }

  // static getTA() {
  //   return this.ta;
  // }

  static parse(string) {
    return Papa.parse(string, {
      delimiter: '\t'
    }).data;
  }

  static unparse(data) {
    return Papa.unparse(data, {
      delimiter: "\t"
    });
  }

  static toJson(dataArray) {
    if (dataArray && dataArray.length) {
      const header = dataArray.shift();
      return dataArray.map(row => Object.fromEntries(header.map((key, index) => [key, row[index]])));
    }
    return [];
  }

  static toDataArray(data) {
    if (data && data.length) {
      const keys = Object.keys(data[0]);
      return [keys, ...data.map(row => keys.map(key => row[key]))];
    }
    return [];
  }

  // static setData(dataArray) {
  //   const value = this.unparse(dataArray);
  //   this.set(value);
  // }
  //
  // static setJson(data) {
  //   const dataArray = this.toDataArray(data);
  //   this.setData(dataArray);
  // }
  //
  // static set(value) {
  //   this.ta.value = value;
  //   this.ta.focus();
  //   this.ta.select();
  // }
  //
  // static prepare(string) {
  //   return this.parse(string);
  // }

  static {
    this.build();
  }



  //
  // static async updateTA() {
  //   const ids = this.selectionBuffer.get() || [];
  //
  //   if (this.resource.copyMode === "id") {
  //     this.ta.value = ids.join("\n");
  //   } else {
  //     if (ids.length) {
  //       const array = [];
  //       for (let id of ids) {
  //         const item = await this.dispatch({
  //           action: "row",
  //           path: [id]
  //         }).then(request => request.data);
  //         array.push(item);
  //       }
  //       this.ta.value = JSON.stringify(array);
  //     } else {
  //       this.ta.value = "";
  //     }
  //   }
  //
  //   this.ta.focus();
  //   this.ta.select();
  // }
  //


}
