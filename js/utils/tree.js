KarmaFieldsAlpha.Tree = class {

    constructor(id, parent = "0", items = []) { // order: 0,

        this.children = [];
        this.parent = parent;
        this.id = id;

    }

    // static async create(table) {

    //     const ids = table.getIds();

    //     const map = {};

    //     const root = new KarmaFieldsAlpha.Tree("0");

    //     for (let id of ids) {

    //         const alias = this.resource.alias || {};
    //         const [parent] = await table.getValue(id, alias.parent || "parent") || [];
    //         // const [order] = await table.getValue(id, alias.order || "order") || [];
           
    //         map[item.id] = new KarmaFieldsAlpha.Tree(id, parent); //, parseInt(order));
    
    //     }

    //     for (let id in map) {

    //         const tree = map[id];
    //         const parent = map[tree.parent];

    //         if (parent) {

    //             parent.children.push(tree);

    //         } else {

    //             root.children.push(tree);

    //         }

    //     }

    //     return root;

    // }


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
       
        if (selection.length) {

            return this.children.slice(selection.index, selection.index + selection.length);

        } else {

            let items = [];

            for (let index in selection) {

                if (this.children[index]) {

                    items = [...items, ...this.children[index].slice(selection[index])];

                }

            }

            return items;
        }
          
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