KarmaFieldsAlpha.Tree = class {

  constructor(id, parent = "0", items = []) { // order: 0,

      this.children = [];
      this.parent = parent;
      this.id = id;

  }

  get(...path) {

    if (path.length) {

      const index = path.shift();

      if (this.children[index]) {

        return this.children[index].get(...path);

      } else {

        return new this.constructor();

      }

    }

    return this;
  }

  flatten() {

    let items = [];

    for  (let child of this.children) {

        items = [...items, child, ...child.flatten()];

    }

    return items;
  }

  slice(selection) {

    if (selection.final && selection.length) {

      return this.children.slice(selection.index, selection.index + selection.length);

    } else {

      let items = [];

      // for (let index in selection) {
      //
      //   if (this.children[index]) {
      //
      //     items = [...items, ...this.children[index].slice(selection[index])];
      //
      //   }
      //
      // }

      for (let i = 0; i < this.children.length; i++) {

        if (selection[i]) {

          items = [...items, ...this.children[i].slice(selection[i])];

        }

      }

      return items;
    }

  }

  hasSelection(selection) {

    if (selection.final && selection.length) {

      return true;

    } else {

      for (let i = 0; i < this.children.length; i++) {

        if (selection[i] && this.children[i].hasSelection(selection[i])) {

          return true;

        }

      }

    }

    return false;
  }

  swap(path, newPath, length) {

    const originIndex = path.pop();
    const originBranch = this.get(...path);
    const transferItems = originBranch.children.splice(originIndex, length);
    const destIndex = newPath.pop();
    const destBranch = this.get(...newPath);

    destBranch.children.splice(destIndex, 0, ...transferItems);
    transferItems.forEach(item => item.parent = destBranch.id);

  }



}
