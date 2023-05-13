

KarmaFieldsAlpha.Clipboard = class {

  static getElement() {

    return document.getElementById("karma-fields-alpha-clipboard");

  }

  static clear() {

    const clipboard = this.getElement();

    clipboard.value = "";

  }

  static write(string) {

    const clipboard = this.getElement();

    if (clipboard) {

      clipboard.value = string;
      clipboard.focus({preventScroll: true});
      clipboard.select();
      clipboard.setSelectionRange(0, 999999);

    }

  }

  static read() {

    const clipboard = this.getElement();

    if (clipboard) {

      return clipboard.value;

    }

    return "";
  }

  static focus() {

    const clipboard = this.getElement();

    if (clipboard) {

      clipboard.focus({preventScroll: true});
      clipboard.select();
      clipboard.setSelectionRange(0, 999999);

    }

  }





  static parse(string) {
    return Papa.parse(string, {
      delimiter: '\t'
    }).data;
  }

  static unparse(data) {
    return Papa.unparse(data, {
      delimiter: "\t",
      newline: "\n"
    });
  }

  static toJson(dataArray) {
    if (dataArray && dataArray.length) {
      const header = dataArray.shift();
      return dataArray.map(row => Object.fromEntries(header.map((key, index) => [key, row[index]])));
    }
    return [];
  }

  static toDataArray(data, headers = true) {
    if (data && data.length) {
      const keys = Object.keys(data[0]);
      const array = data.map(row => keys.map(key => row[key]))
      if (headers) {
        return [keys, ...array];
      } else {
        return array;
      }

    }
    return [];
  }

  static decode(string) {

    const data = this.parse(string);

    return this.toJson(data);

  }

  static encode(json) {

    const data = this.toDataArray(json);

    return this.unparse(data);

  }

}
