
KarmaFieldsAlpha.field.layout.header = class extends KarmaFieldsAlpha.field.container {

  constructor(resource) {

    super({
      display: "flex",
      children: [
        {
          type: "title",
          value: resource.title || "Table"
        },
        "count",
        "pagination",
        "close"
      ],
      ...resource
    });

  }

  static title = class extends KarmaFieldsAlpha.field.text {

    constructor(resource) {

      super({
        id: "title",
        tag: "h1",
        style: "flex-grow:1",
        class: "ellipsis",
        value: "Table",
        ...resource
      });

    }

  }

  static count = {
    id: "count",
    type: "text",
    style: "justify-content:center;white-space: nowrap;",
    value: ["replace", "# elements", "#", ["request", "count"]]
  }

  static options = {
    id: "options",
    type: "button",
    title: "Options",
    action: "toggleOptions"
  }

  static close = {
    id: "close",
    type: "button",
    text: "×",
    title: "Close Table",
    action: "close"
  }

  static pagination = class extends KarmaFieldsAlpha.field.group {

    constructor(resource) {

      const defaultResource = {
        id: "pagination",
        type: "group",
        display: "flex",
        style: "flex: 0 1 auto;min-width:0",
        hidden: ["==", ["request", "getNumPage"], 1],
        children: [
          "firstpage",
          "prevpage",
          "currentpage",
          "nextpage",
          "lastpage"
        ]
      }

      super({
        ...defaultResource,
        ...resource
      });
    }

    static firstpage = {
      id: "firstpage",
  		type: "button",
      action: "firstPage",
      title: "First Page",
      text: "«",
      disabled: ["==", ["request", "getPage"], 1]
    }

    static prevpage = {
      id: "prevpage",
  		type: "button",
      action: "prevPage",
      title: "Previous Page",
      text: "‹",
      disabled: ["==", ["request", "getPage"], 1]
    }

    static currentpage = {
      id: "currentpage",
  		type: "text",
      style: "min-width: 4em;text-align: right;",
      value: ["replace", "# / #", "#", ["request", "getPage"], ["request", "getNumPage"]]
    }

  	static nextpage = {
      id: "nextpage",
  		type: "button",
      action: "nextPage",
      title: "Next Page",
      text: "›",
      disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]]
    }

  	static lastpage = {
      id: "lastpage",
  		type: "button",
      action: "lastPage",
      title: "Last Page",
      text: "»",
      // disabled: ["request", "lastpage", "boolean"]
      disabled: ["==", ["request", "getPage"], ["request", "getNumPage"]]
    }

  }

}
