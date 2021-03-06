

KarmaFieldsAlpha.Clipboard = class {


  static build() {

    this.ta = document.createElement("textarea");
    document.body.appendChild(this.ta);
    this.ta.className = "karma-fields-ta";
    this.ta.style = "position:fixed;bottom:0;left:200px;z-index:999999999";

    this.ta.oninput = async event => {

      switch (event.inputType) {

        case "deleteByCut":
        case "deleteContentBackward":
        case "deleteContentForward":
        case "deleteContent":
        case "insertFromPaste": {

          if (this.onInput) {
            this.onInput(this.parse(this.ta.value)); // -> to dataArray
          }

          break;
        }

        default: {
          break;
        }

      }

    }

  }

  static parse(string) {
    return Papa.parse(string, {
      delimiter: '\t'
    });
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

  static set(data) {

    this.ta.value = this.unparse(data);

    this.ta.focus();
    this.ta.select();

  }

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
