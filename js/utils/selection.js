KarmaFieldsAlpha.Selection = class extends KarmaFieldsAlpha.Segment {

    static path = ["state", "selection"];
    static buffer = new KarmaFieldsAlpha.Buffer(...this.path);

    static get(...path) {

        return this.buffer.get(...path);

    }

    // static change(selection, ...path) {

    //     const newSelection = KarmaFieldsAlpha.DeepObject.create(selection, ...path);

    //     // const buffer = new KarmaFieldsAlpha.Buffer(...this.path, ...path);
    //     // const currentSelection = this.buffer.get(...path);
    //     const currentSelection = this.buffer.get();

    //     // if (!this.compare(selection, currentSelection)) {
    //     if (!KarmaFieldsAlpha.DeepObject.equal(newSelection, currentSelection)) {

    //         KarmaFieldsAlpha.History.save();
    //         this.buffer.change(newSelection, currentSelection);

    //         return true;

    //     }

    //     return false;

    // }

    static change(selection, ...path) {

        const newSelection = KarmaFieldsAlpha.DeepObject.create(selection, ...path);
        const currentSelection = this.buffer.get();

        this.buffer.change(newSelection, currentSelection);
    }

    static compare(selection, ...path) {

        const newSelection = KarmaFieldsAlpha.DeepObject.create(selection, ...path);
        const currentSelection = this.buffer.get();

        return KarmaFieldsAlpha.DeepObject.equal(newSelection, currentSelection);
    }

    static check(...path) {

        const index = path.pop();
        const selection = this.buffer.get(...path);

        return this.contain(selection, index);
    }

}
