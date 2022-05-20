KarmaFieldsAlpha.fields.presets = class {

  static title = {
    id: "title",
    type: "text",
    tag: "h1",
    style: "flex-grow:1",
    class: "ellipsis",
    value: "Table"
  }

  static count = {
    id: "count",
    type: "text",
    style: "justify-content:center",
    value: ["replace", "# elements", "#", ["get", "count"]],
    dynamic: true
  }

  static options = {
    id: "options",
	  type: "button",
    title: "Options",
    action: "toggle-options"
  }

  static pagination = {
    id: "pagination",
    type: "group",
    display: "flex",
    style: "flex: 0 1 auto;min-width:0",
    // hidden: "numpage=1",
    hidden: ["==", ["get", "numpage"], 1],
    children: [
      "firstpage",
      "prevpage",
      "currentpage",
      "nextpage",
      "lastpage"
    ]
  }

  static firstpage = {
    id: "firstpage",
		type: "button",
    action: "firstpage",
    title: "First Page",
    text: "«",
    // disabled: "page=1",
    disabled: ["==", ["get", "page"], 1],
    // hidden: "numpage=1"
  }

  static prevpage = {
    id: "prevpage",
		type: "button",
    action: "prevpage",
    title: "Previous Page",
    text: "‹",
    // disabled: "page=1",
    disabled: ["==", ["get", "page"], 1],
    // hidden: "numpage=1"
  }

  static currentpage = {
    id: "currentpage",
		type: "text",
    style: "min-width: 4em;text-align: right;",
    // value: "{{page}} / {{numpage}}",
    value: ["replace", "# / #", "#", ["get", "page"], ["get", "numpage"]],
    // hidden: "numpage=1",
    // dynamic: true
  }

	static nextpage = {
    id: "nextpage",
		type: "button",
    action: "nextpage",
    title: "Next Page",
    text: "›",
    // disabled: "lastpage",
    disabled: ["get", "lastpage"]
    // hidden: "numpage=1"
  }

	static lastpage = {
    id: "lastpage",
		type: "button",
    action: "lastpage",
    title: "Last Page",
    text: "»",
    // disabled: "lastpage",
    disabled: ["get", "lastpage"],
    // hidden: "numpage=1"
  }

	static close = {
    id: "close",
		type: "button",
    text: "×",
    title: "Close Table",
    action: "close"
  }

	static prev = {
    id: "prev",
		type: "button",
    action: "prev",
    title: "Previous Item",
    text: "‹"
  }

	static next = {
    id: "next",
		type: "button",
    action: "next",
    title: "Next Item",
    text: "›"
  }

	static closemodal = {
    id: "closemodal",
		type: "button",
    title: "Close Modal",
    action: "closemodal"
  }

	static save = {
    id: "save",
		type: "button",
    action: "save",
    title: "Save",
    // disabled: "!modified",
    disabled: ["!", ["modified"]],
    primary: true
  }

	static add = {
    id: "add",
		type: "button",
    action: "add",
    title: "Add"
  }

	static delete = {
    id: "delete",
		type: "button",
    action: "delete",
    title: "Delete",
    // disabled: "!selection"
    disabled: ["!", ["get", "selection"]]
  }

	static undo = {
    id: "undo",
		type: "button",
    value: "undo",
    dashicon: "undo",
    // disabled: "!undo"
    disabled: ["!", ["get", "undo"]]
  }

	static redo = {
    id: "redo",
		type: "button",
    value: "redo",
    dashicon: "redo",
    // disabled: "!redo"
    disabled: ["!", ["get", "redo"]]
  }

  static separator = {
    id: "separator",
		type: "separator"
  }

}
