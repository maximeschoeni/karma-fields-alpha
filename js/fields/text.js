// Test = class {
//
// 	constructor() {
//
// 		this.name = "hello";
// 	}
//
// 	test() {
//
// 		const syncFunction = () => {
//
// 			const name = this.name;
// 			debugger;
// 		}
//
// 		const asyncFunction = async() => {
//
// 			const name = this.name;
// 			debugger;
// 		}
//
// 		syncFunction();
//
// 		asyncFunction();
//
// 	}
//
// }
// const test = new Test();
// test.test();



KarmaFieldsAlpha.field.text = class extends KarmaFieldsAlpha.field {

	export() {

		// const output = new KarmaFieldsAlpha.Content();
		// let content;

		if (this.resource.export) {

			// if (!this.resource.export) {

			// 	const value = this.getContent();

			// 	if (value !== undefined) {

			// 		return [value];

			// 	}

			// } else if (this.resource.export) {

			// 	return this.parseArray(this.resource.export || this.getContent());

			// }

			if (this.resource.export === true) {

				return this.parseArray(this.getContent());

			}

			return this.parseArray(this.resource.export);


			// if (content.loading) {

			// 	output.loading = true;

			// } else {

			// 	output.value = content.toString();

			// }


		}

		return [];

	}

	import(array) {

		if (this.resource.export) {

			array.shift();

		}

	}

	getContent() {

		return this.parseString(this.resource.value || this.resource.content) || ""; // empty string if loading

	}

	*buildContent() {

		const array = this.parseArray(this.resource.value || this.resource.content);

		if (array === undefined) {

		} else if (array.mixed) {

			yield {
				update: element => {
					element.innerHTML = "[mixed content]";
				}
			};

		} else {

			for (let value of array) {

				yield {
					update: element => {
						const string = value.toString() || "";
						if (element.innerHTML !== string) {
							element.innerHTML = string;
						}
					}
				};

			}

		}

	}

	*build() {

		yield {
			tag: this.resource.tag,
			class: "text karma-field",
			init: element => {
				if (this.resource.classes) {
					element.classList.add(...this.resource.classes);
				}
				if (this.resource.width) {
					element.style.width = this.resource.width;
				}
				if (this.resource.display) {
					element.classList.add(`display-${this.resource.display}`);
				}
			},
			update: element => {
				if (this.resource.disabled) {
					const disabled = this.parseBoolean(this.resource.disabled) || false;
					element.classList.toggle("disabled", disabled.toBoolean());
				}
				if (this.resource.enabled) {
					const enabled = this.parseBoolean(this.resource.enabled);
					element.classList.toggle("disabled", !enabled);
				}
			},
			children: this.buildContent()
		};
	}


}

KarmaFieldsAlpha.field.simpletext = class extends KarmaFieldsAlpha.field.text {

	getText() {

		if (this.resource.key) {

			return this.getSingleValue(this.resource.key) || "";

		}

		if (this.resource.value || this.resource.content) {

			return this.parseString(this.resource.value || this.resource.content);

		}

		return "";

	}



	*build() {
		yield {
			tag: this.resource.tag,
			class: "text karma-field",
			init: element => {
				if (this.resource.classes) {
					element.classList.add(...this.resource.classes);
				}
				if (this.resource.width) {
					element.style.width = this.resource.width;
				}
				if (this.resource.display) {
					element.classList.add(`display-${this.resource.display}`);
				}
			},
			update: element => {
				const text = this.getText();
				if (text !== undefined) {
					element.innerHTML = text || "";
				}
			}
		};
	}


}


KarmaFieldsAlpha.field.title = class extends KarmaFieldsAlpha.field.simpletext {

	constructor(resource, id, parent) {

		super({
			// tag: "h1",
			style: "flex-grow:1",
			classes: ["text-title", "ellipsis"],
			content: "Title",
			width: "1fr",
			...resource
		}, id, parent);

	}

	getText() {

		return this.queryLabel();

	}

}



KarmaFieldsAlpha.field.html = class extends KarmaFieldsAlpha.field {

	*build() {
		yield {
			tag: this.resource.tag,
			class: "text karma-field",
			init: element => {
				if (this.resource.classes) {
					element.classList.add(...this.resource.classes);
				}
				if (this.resource.width) {
					element.style.width = this.resource.width;
				}
			},
			update: element => {

				if (this.resource.element) {
					const attributes = this.parseObject(this.resource.element);
					if (attributes !== undefined) {
						Object.assign(element, attributes);
					}
				}

				if (this.resource.disabled) {
					const disabled = this.parseBoolean(this.resource.disabled) || false;
					element.classList.toggle("disabled", disabled);
				}

				if (this.resource.enabled) {
					const enabled = this.parseBoolean(this.resource.enabled);
					element.classList.toggle("disabled", !enabled);
				}

			}
		};
	}
}




KarmaFieldsAlpha.field.links = class extends KarmaFieldsAlpha.field {

	newChild(index) {

    if (index === "popup") {

      const tableResource = this.resource.popup;

      const constructor = this.getConstructor(tableResource.type || "table");

      return new constructor(tableResource, "popup", this);

    }

  }



	nav(index = 0) {

		// this.save("open", "Open link");

		const popup = this.getChild("popup");

		popup.setFocus(true);

		if (popup.resource.preselect) {

			KarmaFieldsAlpha.server.promise(done => {

				let ids = this.parseArray(popup.resource.preselect);

				if (ids !== undefined) {

					popup.selectByIds([ids[index]]);

					done();

				}

			});

		}

	}

	open(index) {

		this.nav(index);

		// KarmaFieldsAlpha.Jobs.add(work);

		// this.render();

	}

	close() {

		this.setFocus(true);

	}

	*buildPopup() {

		// const hasPopup = this.hasFocusInside("popup");

		const popup = this.getChild("popup");
		const hasPopup = popup.hasFocusInside();

    if (hasPopup) {

			yield {
        class: "popup",
				update: element => {
          element.onmousedown = async event => {
            event.stopPropagation();

						await popup.setFocus(true);
						await this.render();
          }
        },
        child: {
          class: "popup-content",
          children: popup.build()
        }
      };

		}

	}

	*buildContent() {

		const contents = this.parseArray(this.resource.content);
		const href = this.resource.href && this.parseArray(this.resource.href);

		if (contents === undefined) {

			yield {
				tag: "li"
			};

		} else {

			for (let i = 0; i < contents.length; i++) {

			// node.children = contents.toArray().map((content, index) => {
				yield {
					tag: "li",
					child: {
						tag: "a",
						update: element => {

							element.onmousedown = event => {
								event.stopPropagation();
							};

							if (this.resource.popup) {

								element.onclick = event => {
									event.preventDefault();
									this.save("open");
									this.open(i);
									this.render();
								}

							} else if (href) {

								element.href = href[i] || "";

							}

							element.innerHTML = contents[i];

							if (this.resource.target) {

								element.target = this.resource.target;

							}

						}
					}
				}
			};

		}
	}

	*build() {

		yield {
			class: "links",
			children: [
				{
					tag: "ul",
					class: "karma-field links",
					update: element => {
						element.classList.toggle("display-inline", this.resource.display === "inline");
					},
					children: this.buildContent()
				},
				{
					class: "popup-container",
					children: this.buildPopup()
				}
			]
		};

	}

}


KarmaFieldsAlpha.field.popupLink = class extends KarmaFieldsAlpha.field.text {

	newChild(index) {

		if (index === "popup" && this.resource.popup) {

			return this.createChild(this.resource.popup, "popup");

		}

	}

	open() {

		const popup = this.getChild("popup");

		popup.setFocus(true);

		if (this.resource.params) {

			KarmaFieldsAlpha.server.promise(done => {

				let params = this.parseObject(this.resource.params);

				if (params !== undefined) {

					popup.setState(params, "params");

					done();

				}

			});

		}

	}

	close() {

		this.setFocus();

	}

	getText() {

		return this.parseString(this.resource.text || this.resource.content || this.resource.value);

	}

	*buildPopup() {

		const popup = this.getChild("popup");
		const hasPopup = popup.hasFocusInside();

		if (hasPopup) {

			yield {
				class: "popup",
				update: element => {
					element.onmousedown = event => {
						event.stopPropagation();

						popup.setFocus(true);
						popup.render();
					}
				},
				child: {
					class: "popup-content",
					children: popup.build()
				}
			};

		}

	}

	*build() {

		yield {
			class: "popup-link",
			children: [
				{
					tag: "a",
					update: element => {
						element.innerHTML = this.getText();
						element.onclick = event => {
							event.preventDefault();
							this.save("open");
							this.open();
							this.render();
						}
					}
				},
				{
					class: "popup-container",
					update: element => {
						this.element = element;
					},
					children: this.buildPopup()
				}
			]
		};

	}

}





KarmaFieldsAlpha.field.taxonomyLinks = class extends KarmaFieldsAlpha.field {

	getKey() {

		return this.resource.key;

	}

	getName(value) {

		const nameField = this.resource.nameField || "name";
		const options = this.getOptions();

		if (options) {

			const option = options.find(option => option.id === value);

			if (option) {

				return option[nameField] || "";

			}

			return value;

		}

	}

	export() {

		if (this.resource.export) {

			const key = this.getKey();
			const values = this.parent.getValue(key);

			if (values !== undefined) {

				const names = values.map(id => this.getName(id));

				if (names.every(name => name !== undefined)) {

					return [names.join(", ")];

				}

			}

			return;

		}

		return [];

	}

	import(array) {

		if (this.resource.export) {

			array.shift();

		}

	}


	*buildContent() {

		const key = this.getKey();
		const values = this.parent.getValue(key);

		if (values !== undefined) {

			for (let id of values) {

				yield {
					tag: "a",
					update: element => {
						// const name = this.getValue("name", id, this.resource.driver);
						const name = this.getName(id);
						if (name !== undefined) {
							element.innerHTML = name;
						}
						element.onclick = event => {
							event.preventDefault();
							this.save("nav", "Nav");
							this.parent.setParam(id, key);
							this.render();
						}
					}
				};
			}

		}
	}

	*build() {

		yield {
			class: "taxonomy-links",
			children: this.buildContent()
		};

	}

}

// KarmaFieldsAlpha.field.optionLinks = class extends KarmaFieldsAlpha.field {

// 	getKey() {

// 		return this.resource.key;

// 	}

// 	export() {

// 		if (this.resource.export) {

// 			const key = this.getKey();
// 			const values = this.parent.getValue(key);

// 			if (values !== undefined) {

// 				const options = this.resource.options || [];

// 				const names = values.map(id => {
// 					const option = options.find(option => option.id === id);
// 					return option && option.name || id;
// 				})

// 				return [names.join(", ")];

// 			}

// 			return;

// 		}

// 		return [];

// 	}

// 	import(array) {

// 		if (this.resource.export) {

// 			array.shift();

// 		}

// 	}


// 	*buildContent() {

// 		const key = this.getKey();
// 		const values = this.parent.getValue(key);

// 		if (values !== undefined) {

// 			const options = this.resource.options || [];

// 			for (let id of values) {

// 				yield {
// 					tag: "a",
// 					update: element => {
// 						const option = options.find(option => option.id === id);
// 						if (option) {
// 							element.innerHTML = option.name || "";
// 						} else {
// 							element.innerHTML = id;
// 						}
// 						element.onclick = event => {
// 							event.preventDefault();
// 							this.save("nav", "Nav");
// 							this.parent.setParam(id, key);
// 							this.render();
// 						}
// 					}
// 				};
// 			}

// 		}
// 	}

// 	*build() {

// 		yield {
// 			class: "taxonomy-links",
// 			children: this.buildContent()
// 		};

// 	}

// }


KarmaFieldsAlpha.field.link = class extends KarmaFieldsAlpha.field {

	*build() {

		yield {
			tag: "a",
			class: "link",
			update: element => {
				if (this.resource.href) {
					const href = this.parseString(this.resource.href);
					if (href !== undefined) {
						element.href = href;
					}
				} else if (this.resource.action) {
					element.onclick = event => {
						event.preventDefault();
						this.doAction(this.resource.action);
					}
				}
				const content = this.parseString(this.resource.text || this.resource.content);
				if (content !== undefined) {
					element.innerHTML = content;
				}
			}
		};

	}

}


// KarmaFieldsAlpha.field.listFonts = class extends KarmaFieldsAlpha.field {
//
// 	*buildItems() {
//
// 		const key = this.getKey();
// 		const fontIdsQuery = this.getContent(key);
//
// 		if (!fontIdsQuery.loading) {
//
// 			for (let fontId of fontIdsQuery.toArray()) {
//
// 				yield {
// 					tag: "li",
// 					update: node => {
// 						const typefaceIdQuery = this.getWild("fonts", fontId, "typeface_id");
// 						if (!typefaceIdQuery.loading) {
// 							const typefaceNameQuery = this.getWild("posts", typefaceIdQuery.toString(), "post_title");
// 							const weightQuery = this.getWild("fonts", fontId, "weight");
// 							if (!typefaceNameQuery.loading && !weightQuery.loading) {
// 								node.element.innerHTML = `${typefaceNameQuery.toString()} ${weightQuery.toString()}`;
// 							}
// 						}
// 					}
// 				};
//
// 			}
//
// 		}
//
// 	}
//
//
// 	build() {
// 		return {
// 			tag: "ul",
// 			class: "maxitype-fontlist",
// 			init: node => {
// 				if (this.resource.classes) {
// 					node.element.classList.add(...this.resource.classes);
// 				}
// 				if (this.resource.width) {
// 					node.element.style.width = this.resource.width;
// 				}
// 			},
// 			children: [...this.buildItems()]
// 		};
// 	}
//
// }




KarmaFieldsAlpha.field.list = class extends KarmaFieldsAlpha.field {

	*build() {
		yield {
			tag: "ul",
			class: "text karma-field",
			init: element => {
				if (this.resource.classes) {
					element.classList.add(...this.resource.classes);
				}
				if (this.resource.width) {
					element.style.width = this.resource.width;
				}
				if (this.resource.display) {
					element.classList.add(`display-${this.resource.display}`);
				}
			},
			children: this.buildItems()
		};
	}

	*buildItems() {

		const items = this.parseArray(this.resource.value || this.resource.content);

		if (items) {

			for (let item of items) {

				yield {
					tag: "li",
					update: element => {
						element.innerHTML = item.toString();
					}
				};

			}

		}

	}


}





// KarmaFieldsAlpha.field.media = class extends KarmaFieldsAlpha.field {

// 	getDriver() {

// 		return  this.resource.driver || "medias";

// 	}

// 	getValue(key) {

// 		if (this.resource.id) {

// 			if (typeof this.resource.id === "object" && !Array.isArray(this.resource.id)) {

// 				return this.resource.id[key];

// 			} else {

// 				let id = this.parseString(this.resource.id); // -> infinit loop if id is an expression like ['get', 'somekey'] and use this.getValue()

// 				if (id === undefined) {

// 					return;

// 				} else {

// 					const driver = this.getDriver();

// 					return this.parent.getValue(key, id, driver);

// 				}

// 			}



// 		} else {

// 			return this.parent.getValue(key);

// 		}

// 	}

// 	isMixed(key) {

// 		if (this.resource.id) {

// 			return false;

// 		}

// 		return super.isMixed(key);

// 	}

// 	isUploading() {

// 		if (this.resource.id) {

// 			return typeof this.resource.id === "object";

// 		}

// 		return this.parent.isUploading();

// 	}

// 	getMedia() {

// 		if (this.resource.exit) {

// 			return {icon: "exit", text: ".."};

// 		} else if (this.resource.uploading) {

// 			return {icon: "uploading", text: ""};

// 		} else if (this.resource.loading) {

// 			return {icon: "loading", text: ""};

// 		} else if (this.resource.mixed) {

// 			return {icon: "mixed", text: "[mixed]"};

// 		} else if (this.resource.dashicon) {

// 			return { dashicon: this.resource.dashicon, text: this.resource.caption };

// 		} else if (this.resource.svg) {

// 			return { svg: this.resource.svg, text: this.resource.caption };

// 		} else {

// 			// const media = {
// 			// 	mimetype: this.getValue("mimetype"),
// 			// 	filetype: this.getValue("filetype"),
// 			// 	name: this.getValue("name"),
// 			// 	filename: this.getValue("filename"),
// 			// 	dir: this.getValue("dir")
// 			// };

// 			const mimetype = this.getSingleValue("mimetype"),
// 				filetype = this.getSingleValue("filetype"),
// 				name = this.getSingleValue("name"),
// 				filename = this.getSingleValue("filename"),
// 				dir = this.getSingleValue("dir");

// 			if (mimetype === undefined || filetype === undefined || name === undefined || filename === undefined || dir === undefined) {

// 				return {icon: "loading", text: media.filename || "", loading: true};

// 			} else {

// 				const mixed = this.doAction("isMixed", "filename");

// 				if (mixed) {

// 					return { icon: "mixed", text: "[mixed]" };

// 				// } else if (filetype === "upload") {

// 				// 	return { icon: "uploading", text: filetype || "..." };

// 				// } else if (filetype === "") {

// 				// 	return {icon: "notfound", text: "no file type!"};

// 				// } else if (filetype === "exit") {

// 				// 	return { icon: "exit", text: ".." };

// 				// } else if (filetype === "folder" || filetype === "autofolder") {

// 				// 	return { icon: "folder", text: name };

// 				} else if (mimetype.startsWith("image")) {

// 					if (mimetype === "image/jpeg" || mimetype === "image/png" || this.resource.display === "full") {

// 							const sizes = this.getValue("sizes");

// 							if (sizes === undefined) {

// 								return {
// 									icon: "loading",
// 									text: name,
// 									mimetype: mimetype,
// 									filename: filename,
// 									loading: true,
// 									sizes: []
// 								};

// 							} else {

// 								const sizeName = this.resource.display !== "thumb" && this.resource.display || "thumbnail"; // compat
// 								const size = sizes.find(size => sizeName === size.name && size.filename);

// 								if (size) {

// 									return {
// 										text: name,
// 										mimetype: mimetype,
// 										filename: filename,
// 										src: KarmaFieldsAlpha.uploadURL+dir+"/"+size.filename,
// 										image: true,
// 										sizes: sizes
// 									};

// 								} else {

// 									return {
// 										icon: "image",
// 										text: name,
// 										mimetype: mimetype,
// 										filename: filename,
// 										// src: KarmaFieldsAlpha.uploadURL+dir+"/"+filename,
// 										// image: true,
// 										// sizes: sizes
// 									};

// 								}

// 							}

// 					} else {

// 						return {
// 							text: name,
// 							mimetype: mimetype,
// 							filename: filename,
// 							src: KarmaFieldsAlpha.uploadURL+dir+"/"+filename,
// 							image: true
// 						};

// 					}

// 				} else if (mimetype.startsWith("video")) {

// 					if (this.resource.display === "video") {

// 						return {
// 							text: name,
// 							mimetype: mimetype,
// 							filename: filename,
// 							src: KarmaFieldsAlpha.uploadURL+dir+"/"+filename,
// 							video: true
// 						};

// 					} else {

// 						return {
// 							icon: "video",
// 							text: name,
// 							mimetype: mimetype,
// 							filename: filename,
// 						};

// 					}

// 				} else if (mimetype.startsWith("audio")) {

// 					if (this.resource.display === "audio") {

// 						return {
// 							text: name,
// 							mimetype: mimetype,
// 							filename: filename,
// 							src: KarmaFieldsAlpha.uploadURL+dir+"/"+filename,
// 							audio: true
// 						};

// 					} else {

// 						return {
// 							icon: "audio",
// 							text: name,
// 							mimetype: mimetype,
// 							filename: filename
// 						};

// 					}

// 				} else {

// 					const media = {
// 						text: filename,
// 						src: KarmaFieldsAlpha.uploadURL+dir+"/"+filename,
// 					};

// 					if (mimetype.startsWith("text")) {

// 						media.icon = "text";

// 					} else if (mimetype === "application/pdf") {

// 						media.icon = "document";

// 					} else if (mimetype === "application/zip") {

// 						media.icon = "zip";

// 					} else {

// 						media.icon = "default";

// 					}

// 					return media;

// 				}

// 			}

// 		}

//   }


// 	// *buildImage(media) {
// 	// 	if (media.image) {
// 	// 		yield {
// 	// 			tag: "img",
// 	// 			init: element => {
// 	// 				element.draggable = false;
// 	// 			},
// 	// 			update: element => {
// 	// 				if (media.src && media.src !== element.getAttribute("data-src")) {
// 	// 					element.src = media.src;
// 	// 					element.setAttribute("data-src", media.src);
// 	// 				}
// 	// 			}
// 	// 		}
// 	// 	}
// 	// }

// 	*buildImage(media) {
// 		if (media.image) {
// 			yield {
// 				tag: "figure",
// 				class: "image",
// 				child: {
// 					tag: "img",
// 					init: element => {
// 						element.draggable = false;
// 					},
// 					update: element => {
// 						if (media.src && media.src !== element.getAttribute("data-src")) {
// 							element.src = media.src;
// 							element.setAttribute("data-src", media.src);
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}

// 	*buildVideo(media) {

// 		if (media.video) {
// 			yield {
// 				tag: "figure",
// 				class: "video",
// 				child: {
// 					tag: "video",
// 					init: element => {
// 						element.controls = true;
// 					},
// 					update: element => {
// 						if (media.filename && media.filename !== element.getAttribute("data-src")) {
// 							element.src = `${KarmaFieldsAlpha.uploadURL}/${encodeURI(media.filename)}`;
// 							element.setAttribute("data-src", media.filename);
// 						}
// 					}
// 				}
// 			};
// 			// yield {
// 			// 	tag: "video",
// 			// 	init: element => {
// 			// 		element.controls = true;
// 			// 	},
// 			// 	update: element => {
// 			// 		if (media.filename && media.filename !== element.getAttribute("data-src")) {
// 			// 			element.src = `${KarmaFieldsAlpha.uploadURL}/${encodeURI(media.filename)}`;
// 			// 			element.setAttribute("data-src", media.filename);
// 			// 		}
// 			// 	}
// 			// };
// 		}

// 	}

// 	*buildAudio(media) {
// 		if (media.audio) {
// 			yield {
// 				tag: "figure",
// 				class: "audio",
// 				child: {
// 					tag: "audio",
// 					init: element => {
// 						element.controls = true;
// 					},
// 					update: element => {
// 						if (media.filename && media.filename !== element.getAttribute("data-src")) {
// 							element.src = `${KarmaFieldsAlpha.uploadURL}/${encodeURI(media.filename)}`;
// 							element.setAttribute("data-src", media.filename);
// 						}
// 					}
// 				}
// 			};
// 		// 	yield {
// 		// 		tag: "audio",
// 		// 		init: element => {
// 		// 			element.controls = true;
// 		// 		},
// 		// 		update: element => {
// 		// 			if (media.filename && media.filename !== element.getAttribute("data-src")) {
// 		// 				element.src = `${KarmaFieldsAlpha.uploadURL}/${encodeURI(media.filename)}`;
// 		// 				element.setAttribute("data-src", media.filename);
// 		// 			}
// 		// 		}
// 		// 	}
// 		}

// 	}

// 	*buildIcon(media) {

// 		if (media.icon) {

// 			yield {
// 				class: "icon",
// 				tag: "figure",
// 				// update: element => {
// 				// 	element.classList.toggle("hidden", !media.icon);
// 				// },
// 				children: [
// 					{
// 						update: element => {
// 							element.className = "";
// 							if (media.dashicon) {
// 								element.classList.add("dashicons", media.dashicon);
// 							} else if (media.icon) {
// 								element.classList.toggle("dashicons", Boolean(media.icon));
// 								// node.element.classList.toggle("dashicons-category", media.icon === "folder");
// 								element.classList.toggle("dashicons-format-image", media.icon === "image");
// 								element.classList.toggle("dashicons-media-video", media.icon === "video");
// 								element.classList.toggle("dashicons-media-audio", media.icon === "audio");
// 								element.classList.toggle("dashicons-media-text", media.icon === "text");
// 								element.classList.toggle("dashicons-media-document", media.icon === "document");
// 								element.classList.toggle("dashicons-media-archive", media.icon === "archive");
// 								element.classList.toggle("dashicons-media-default", media.icon === "default");
// 								element.classList.toggle("dashicons-open-folder", media.icon === "exit" || media.icon === "folder");
// 								element.classList.toggle("dashicons-upload", media.icon === "uploading");
// 								element.classList.toggle("dashicons-ellipsis", media.icon === "loading");
// 								element.classList.toggle("dashicons-warning", media.icon === "notfound");
// 								element.classList.toggle("dashicons-format-gallery", media.icon === "mixed");
// 							}
// 						}
// 					},
// 					{
// 						class: "filename",
// 						update: element => {
// 							element.classList.toggle("hidden", this.resource.caption === false);
// 							element.innerHTML = media.text;
// 						}
// 					}
// 				]
// 			};

// 		} else if (media.dashicon) {

// 			yield {
// 				class: "icon",
// 				tag: "figure",
// 				children: [
// 					{
// 						update: element => {
// 							element.className = `dashicons ${media.dashicon}`;
// 							// element.className = "";
// 							// element.classList.add("dashicons", media.dashicon);
// 						}
// 					},
// 					{
// 						class: "filename",
// 						update: element => {
// 							element.classList.toggle("hidden", this.resource.caption === false);
// 							element.innerHTML = media.text;
// 						}
// 					}
// 				]
// 			};

// 		}

// 	}

// 	*buildMedias(media) {

// 		yield {
// 			class: "media-container",
// 			children: this.buildIcon(media)
// 		}

// 		yield {
// 			class: "media-container",
// 			children: this.buildImage(media)
// 		}

// 		yield {
// 			class: "media-container",
// 			children: this.buildVideo(media)
// 		}

// 		yield {
// 			class: "media-container",
// 			children: this.buildAudio(media)
// 		}

// 	}


// 	*build() {

// 		const media = this.getMedia();

// 		yield {
// 			class: "karma-field-media",
// 			init: element => {
// 				if (this.resource.width) {
// 					element.style.width = this.resource.width;
// 				}
// 				if (this.resource.height) {
// 					element.style.height = this.resource.height;
// 				}
// 				if (this.resource.display) {
// 					element.classList.add(`display-${this.resource.display}`);
// 				}
// 				if (this.resource.greyscale) {
// 					element.classList.add("greyscale");
// 				}
// 			},
// 			children: this.buildMedias(media)
// 		};
// 	}
// }
