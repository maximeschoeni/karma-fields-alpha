
KarmaFieldsAlpha.EditorNode = class {

  constructor(node) {

    if (!node || !(element instanceof Node)) {

      console.error("Invalid node");

    }

    this.node = node;

    this.type = "";
    this.discard = false;
    this.valid = false;
    this.breakable = false;

    if (this.isText(node)) {

      // return {
      //   type: "text",
      //   validIn: ["P", "TD", "TH", "LI", "H1", "H2", "H3", "H4", "H5", "H6", "SPAN", "B", "STRONG", "EM", "I", "A", "SUB", "SUP", "SMALL"]
      // };

      const container = new KarmaFieldsAlpha.EditorNode(node.parentNode);

      this.type = "text";
      this.discard = !node.textContent;
      this.valid = container.isInline() || container.isBlock();

    } else {

      switch (node.tagName) {
        case "UL":
        case "OL":
          // return {
          //   type: "container",
          //   validIn: ["DIV"],
          //   child: "LI"
          // };
          this.type = "container";
          // this.discard = !node.hasChildNodes();
          this.valid = node.parentNode.tagName === "DIV";
          this.typicalChild = "LI";
          break;

        case "DIV":
          // return {
          //   type: "container",
          //   validIn: [],
          //   child: "P",
          //   unwrap: true
          // };
          this.type = "container";
          this.valid = node.parentNode.tagName === "DIV" && node.classList.contains("wp-block-columns");
          this.typicalChild = "P";
          break;

        case "FIGURE":
          this.type = "container";
          // this.discard = !node.hasChildNodes();
          this.valid = node.parentNode.tagName === "DIV";
          break;

        case "TABLE":
          // return {
          //   type: "container",
          //   validIn: ["DIV"],
          //   child: "TR"
          // };
          this.type = "container";
          // this.discard = !node.hasChildNodes();
          this.valid = node.parentNode.tagName === "DIV";
          this.typicalChild = "TR";
          break;

        case "TBODY":
        case "THEAD":
        case "TFOOTER":
          // return {
          //   type: "container",
          //   validIn: ["TABLE"],
          //   child: "TR"
          // };
          this.type = "container";
          this.valid = node.parentNode.tagName === "TABLE";
          this.typicalChild = "TR";
          break;

        case "TR":
          // return {
          //   type: "container",
          //   validIn: ["TABLE", "TBODY", "THEAD", "TFOOTER"],
          //   child: "TD"
          // };
          this.type = "container";
          // this.discard = !node.hasChildNodes();
          this.valid = ["TABLE", "TBODY", "THEAD", "TFOOTER"].includes(node.parentNode.tagName);
          this.typicalChild = "TD";
          break;

        case "P":
        case "BLOCKQUOTE":
          // return {
          //   type: "block",
          //   validIn: ["DIV"],
          //   breakable: true
          // };
          this.type = "block";
          this.breakable = true;
          // this.discard = !node.hasChildNodes();
          this.valid = node.parentNode.tagName === "DIV";
          break;

        case "LI":
          // return {
          //   type: "block",
          //   validIn: ["UL", "OL"],
          //   breakable: true
          // };
          this.type = "block";
          this.breakable = true;
          // this.discard =
          this.valid = node.parentNode.tagName === "UL" || node.parentNode.tagName === "OL";
          break;

        case "H1":
        case "H2":
        case "H3":
        case "H4":
        case "H5":
        case "H6":
          // return {
          //   type: "block",
          //   validIn: ["DIV"],
          //   breakable: false
          // };
          this.type = "block";
          this.breakable = false;
          // this.discard = !node.hasChildNodes();
          this.valid = node.parentNode.tagName === "DIV";
          break;

        case "FIGCAPTION":
          // return {
          //   type: "block",
          //   validIn: ["FIGURE"],
          //   breakable: false
          // };
          this.type = "block";
          this.breakable = false;
          this.valid = node.parentNode.tagName === "FIGURE";
          // this.valid = node.parentNode.tagName === "FIGURE";
          // this.layIn = "FIGURE";
          break;

        case "TH":
        case "TD":
          // return {
          //   type: "block",
          //   validIn: ["TR"],
          //   breakable: false
          // };
          this.type = "block";
          this.breakable = false;
          this.valid = node.parentNode.tagName === "TR";
          // this.valid = node.parentNode.tagName === "TR";
          break;

        case "SPAN":
        case "B":
        case "STRONG":
        case "EM":
        case "I":
        case "A":
        case "SUB":
        case "SUP":
        case "SMALL": {
          // return {
          //   type: "inline",
          //   validIn: ["P", "TD", "TH", "LI", "H1", "H2", "H3", "H4", "H5", "H6", "SPAN", "B", "STRONG", "EM", "I", "A", "SUB", "SUP", "SMALL"]
          // };
          const container = new KarmaFieldsAlpha.EditorNode(node.parentNode);

          this.type = "inline";
          // this.discard = !node.hasChildNodes();
          this.valid = container.isBlock() || container.isInline();
          break;
        }

        case "IMG":
        case "VIDEO":
          // return {
          //   type: "single",
          //   validIn: ["P", "FIGURE"],
          // };
          this.type = "single";
          this.valid = node.parentNode.tagName === "FIGURE" || node.parentNode.tagName === "P";
          break;

        case "BR":
        case "HR": {
          const container = new KarmaFieldsAlpha.EditorNode(node.parentNode);
          this.type = "single";
          this.valid = container.isBlock() || container.isInline();
          break;
        }
          // return {
          //   type: "single",
          //   validIn: ["P", "TD", "TH", "LI", "H1", "H2", "H3", "H4", "H5", "H6", "SPAN", "B", "STRONG", "EM", "I", "A", "SUB", "SUP", "SMALL"],
          // };

        case "ADDRESS":
        case "ARTICLE":
        case "ASIDE":
        case "FOOTER":
        case "HEADER":
        case "HGROUP":
        case "MAIN":
        case "NAV":
        case "SECTION":
          this.type = "container";
          this.valid = false;
          break;

        default:
          this.valid = false;
          break;

      }

    }

  }

  isContainer() {

    return this.type === "container";

  }

  isBlock() {

    return this.type === "block";

  }

  isInline() {

    return this.type === "inline";

  }

  isBreakable(node) {

    return this.type === "block" && this.breakable;

  }

  isSingle() {

    return this.type === "single";

  }

  isValid() {

    return this.valid;

  }

  isText() {

    return this.node.nodeType === 3;

  }

  isElement() {

    return this.node.nodeType === 1;

  }

  isEmpty() {

    return this.type !== "single" && !this.node.textContent.trim();

  }

  getLength() {

    if (this.isText()) {

      return this.node.textContent.trimEnd().length;

    } else {

      return this.node.childNodes.length;
    }

  }

  empty() {

    while (this.node.firstChild) {

      this.node.removeChild(this.node.firstChild);

    }

  }

  wrap(tagName = "p") {

    const newNode = document.createElement(tagName);

    this.node.parentNode.insertBefore(newNode, this.node);

    newNode.appendChild(this.node);

  }

  unwrap() {

    if (this.node.parentNode) {

      while (this.node.firstChild) {

        this.node.parentNode.insertBefore(this.node.firstChild, this.node);

      }

      this.node.parentNode.removeChild(this.node);

    }

  }



}
