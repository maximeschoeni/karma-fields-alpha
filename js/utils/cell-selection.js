
KarmaFieldsAlpha.CellSelection = class extends KarmaFieldsAlpha.Rect {

  constructor(event, container, elements, width, height, col, row, selection) {

    super();

    this.ground = new KarmaFieldsAlpha.Rect(col, row, 1, 1);
    this.containerWidth = width;
    this.containerHeight = height;
    this.elements = elements;
    this.container = container;
    this.box = container.getBoundingClientRect();

  }

  select() {

    return new Promise((resolve, reject) => {

      const onMouseMove = event => {

        const x = event.clientX - this.box.x;
        const y = event.clientY - this.box.y;

        const box = this.findBox(x, y);

        if (box) {

          this.growSelection(box);

        }

      }

      const onMouseUp = event =>  {
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("mousemove", onMouseMove);

        onMouseMove(event);

        resolve();

      }

      this.kill();

      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
    });

  }

  selectHeaders(elements) {

    return new Promise((resolve, reject) => {

      const onMouseMove = event => {

        const x = event.clientX - this.box.x;
        const y = event.clientY - this.box.y;

        const box = this.findBox(x, y);

        if (box) {

          this.growSelection({x: box.x, y: 1, width: box.width, height: this.containerHeight});

        }

      }

      const onMouseUp = event =>  {
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("mousemove", onMouseMove);

        onMouseMove(event);

        resolve(this.selection);

      }

      this.ground.y = 1;
      this.ground.height = this.containerHeight;

      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
    });

  }

  getElement(col, row) {

    const index = row*this.containerWidth + col;

    return this.elements[index];

  }

  sliceElements(box) {

    const elements = [];

    for (let j = box.y; j < box.y + box.height; j++) {

      for (let i = box.x; i < box.x + box.width; i++) {

        const element = this.getElement(i, j);
        elements.push(element);

      }

    }

    return elements;
  }

  getBox(col, row) {

    const element = this.getElement(col, row);

    return new KarmaFieldsAlpha.Rect(element.offsetLeft, element.offsetTop, element.clientWidth, element.clientHeight);

  }

  findBox(x, y) {

    for (let i = 0; i < this.containerWidth; i++) {

      for (let j = 0; j < this.containerHeight; j++) {

        const box = this.getBox(i, j);

        if (box.contains(x, y)) {

          return new KarmaFieldsAlpha.Rect(i, j, 1, 1);

        }

      }

    }

  }

  growSelection(rectangle) {

    let union = this.ground.union(rectangle);

    // this.updateSelection(rectangle);

    if (!union.equals(this)) {

      this.sliceElements(this).forEach(element => element.classList.remove("selecting-cell"));

      this.x = union.x;
      this.y = union.y;
      this.width = union.width;
      this.height = union.height;

      this.sliceElements(this).forEach(element => element.classList.add("selecting-cell"));

    }

  }

  // updateSelection(rectangle) {
  //
  //   if (!rectangle.equals(this)) {
  //
  //     this.sliceElements(this).forEach(element => element.classList.remove("selecting-cell"));
  //
  //     this.x = rectangle.x;
  //     this.y = rectangle.y;
  //     this.width = rectangle.width;
  //     this.height = rectangle.height;
  //
  //     this.sliceElements(this).forEach(element => element.classList.add("selecting-cell"));
  //
  //   }
  //
  // }

  kill() {

    this.sliceElements(this).forEach(element => element.classList.remove("selecting-cell"));

    this.width = 0;
    this.height = 0;

  }

}
