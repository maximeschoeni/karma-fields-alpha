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

			if (this.resource.export === true) {

				return this.getValue();

			} else if (this.resource.export) {

				return this.parseArray(this.resource.export);

			}

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
						element.innerHTML = value.toString();
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

		return this.parseString(this.resource.value || this.resource.content);

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


// deprecated class
// KarmaFieldsAlpha.field.text.a = class extends KarmaFieldsAlpha.field {
//
// 	constructor(resource) {
//
// 		super(resource);
//
// 		this.tag = "a";
//
// 	}
//
// 	update(node) {
//
// 		node.element.onmousedown = event => {
//
// 			event.stopPropagation();
//
// 		};
//
// 		if (this.resource.href) {
//
// 			const href = this.parse(this.resource.href);
//
// 			if (href !== KarmaFieldsAlpha.loading) {
//
// 				node.element.href = href;
//
// 			}
//
// 		} else if (this.resource.table || this.resource.params) {
//
// 			node.element.onclick = event => {
//
// 				event.preventDefault();
//
// 				const table = this.parse(this.resource.table);
//
// 				const params = this.parseParams(this.resource.params);
//
// 				if (table !== KarmaFieldsAlpha.loading && params !== KarmaFieldsAlpha.loading && !Object.values(params).some(value => value === KarmaFieldsAlpha.loading)) {
//
// 					KarmaFieldsAlpha.saucer.open(table, params, this.resource.context);
//
// 				}
//
// 			}
//
// 		}
//
// 		const content = this.parse(this.resource.content);
//
// 		node.element.innerHTML = KarmaFieldsAlpha.Type.toString(content) || "...";
//
// 		if (this.resource.target) {
//
// 			node.element.target = this.resource.target;
//
// 		}
//
// 	}
//
//
// }
//
//
//
// // deprecated class
// KarmaFieldsAlpha.field.text.link = class extends KarmaFieldsAlpha.field {
//
// 	getHref() {
//
// 		if (this.resource.href) {
//
// 			const href = this.parse(this.resource.href);
//
// 			if (href !== KarmaFieldsAlpha.loading) {
//
// 				return href;
//
// 			}
//
// 		}
//
// 	}
//
// 	getContent() {
//
// 		const content = this.parse(this.resource.content);
//
// 		if (content === KarmaFieldsAlpha.loading) {
//
// 			return "";
//
// 		}
//
// 		return KarmaFieldsAlpha.Type.toString(content);
//
// 	}
//
// 	click() {
//
// 		const table = this.parse(this.resource.table);
//
// 		const params = this.parseParams(this.resource.params);
//
// 		if (table !== KarmaFieldsAlpha.loading && params !== KarmaFieldsAlpha.loading && !Object.values(params).some(value => value === KarmaFieldsAlpha.loading)) {
//
// 			KarmaFieldsAlpha.saucer.open(table, params, this.resource.context);
//
// 		}
//
// 	}
//
// 	build() {
//
// 		return {
// 			tag: "a",
// 			update: node => {
//
// 				node.element.onmousedown = event => {
//
// 					event.stopPropagation();
//
// 				};
//
// 				if (this.resource.href) {
//
// 					node.element.href = this.getHref();
//
// 				} else {
//
// 					node.element.onclick = event => {
//
// 						event.preventDefault();
//
// 						this.click();
//
// 					}
//
// 				}
//
// 				node.element.innerHTML = this.getContent();
//
// 				if (this.resource.target) {
//
// 					node.element.target = this.resource.target;
//
// 				}
//
// 			}
// 		};
//
// 	}
//
// }



// KarmaFieldsAlpha.field.filterLink = class extends KarmaFieldsAlpha.field.text {
//
// 	getChildren() {
//
// 		// const key = this.resource.key;
// 		const children = [];
//
// 		if (!this.resource.driver) {
//
// 			console.error("driver is missing");
//
// 		}
//
// 		const ids = this.getValue();
//
// 		if (ids && ids !== KarmaFieldsAlpha.loading) {
//
// 			for (let id of ids) {
//
// 				// const values = KarmaFieldsAlpha.Query.getValue(this.resource.driver, id, "name");
// 				const value = new KarmaFieldsAlpha.Content.Value(this.resource.driver, id, "name");
//
// 				if (!value.loading) {
//
// 					const child = this.createChild({
// 						type: "link",
// 						content: value.toString(),
// 						params: {[this.resource.key]: id}
// 					});
//
// 					children.push(child);
//
// 				}
//
// 			}
//
// 		}
//
// 		return children;
//
// 	}
//
// 	build() {
//
// 		return {
// 			tag: "ul",
// 			class: "karma-field links",
// 			update: node => {
// 				node.element.classList.toggle("display-inline", this.resource.display === "inline");
// 				node.children = this.getChildren().map(child => {
// 					return {
// 						tag: "li",
// 						child: child.build()
// 					}
// 				});
// 			}
// 		};
//
// 	}
//
// }



KarmaFieldsAlpha.field.links = class extends KarmaFieldsAlpha.field {

	// nav(index = 0) {
	//
	// 	let table = this.parse(this.resource.table);
	// 	let params = this.parse(this.resource.params);
	//
	// 	if (table.loading || params.loading) {
	//
	// 		this.addTask(() => this.nav(index), "nav");
	//
	// 	} else {
	//
	// 		this.save("nav", "Open link");
	//
	// 		this.request("open", table.toString(), params.toArray()[index], this.resource.replace);
	//
	// 	}
	//
	// 	this.request("render");
	//
	// }

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

	// getContents() {
	//
	// 	let contents = this.parse(this.resource.content);
	//
	// 	return contents.toArray();
	// }

	// getHrefs(index) {
	//
	// 	let href = this.parse(this.resource.href);
	//
	// 	return href.toArray()[index];
	//
	// }

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


KarmaFieldsAlpha.field.popupLink = class extends KarmaFieldsAlpha.field {

	newChild(index) {

		if (index === "popup" && this.resource.popup) {

			// let resource = this.resource.popup;

			// if (typeof resource === "string") {


			// }

			// return this.createChild({
			// 	sandbox: true,
			// 	...this.resource.popup
			// }, "popup");


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

		// if (this.resource.preselect) {

		// 	let ids = this.parse(this.resource.preselect);

		// 	while (ids.loading) {

		// 		await this.render();
		// 		ids = this.parse(this.resource.preselect);

		// 	}

		// 	await popup.selectByIds(ids.toArray());

		// }

		// await this.render();

	}

	close() {

		this.setFocus();

	}

	getText() {

		return this.parseString(this.resource.text || this.resource.content || this.resource.value);

	}

	// async abduct() {

	// 	if (this.element) {

	// 		await abduct(this.element, this.buildPopup());

	// 	} else {

	// 		await this.parent.abduct();

	// 	}

	// }

	// render() {

	// 	if (this.element) {

	// 		this.renderElement();

	// 	}

	// }

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



KarmaFieldsAlpha.field.taxonomyLinks = class extends KarmaFieldsAlpha.field.links {

	getKey() {

		return this.resource.key;

	}

	*buildContent() {

		const key = this.getKey();
		const values = this.parent.getValue(key);

		if (values !== undefined) {

			for (let id of values) {
				yield {
					tag: "a",
					update: element => {
						const name = this.getValue("name", id, this.resource.driver);
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

		return {
			class: "taxonomy-links",
			children: this.buildContent()
		};

	}

}



KarmaFieldsAlpha.field.link = class extends KarmaFieldsAlpha.field {

	*build() {

		return {
			tag: "a",
			class: "link",
			update: element => {
				const href = this.parseString(this.resource.href);
				if (href !== undefined) {
					element.href = href;
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




KarmaFieldsAlpha.field.media = class extends KarmaFieldsAlpha.field {

	getDriver() {

		return  this.resource.driver || this.parent.request("getDriver");

	}

	getValue(key) {

		if (this.resource.id) {

			if (typeof this.resource.id === "object") {

				return this.resource.id[key];

			} else {

				let id = this.parseString(this.resource.id);

				if (id === undefined) {

					return;

				} else {

					const driver = this.getDriver();

					return this.getValue(key, id, driver);

				}

			}



		} else {

			return this.parent.getValue(key);

		}

	}

	isMixed(key) {

		if (this.resource.id) {

			return false;

		}

		return super.isMixed(key);

	}

	isUploading() {

		if (this.resource.id) {

			return typeof this.resource.id === "object";

		}

		return this.parent.isUploading();

	}

	getMedia() {

		// const driver = this.getDriver();

		// if (!driver) {

		// 	return {icon: "notfound", text: "no driver"};

		// } else

		if (this.resource.exit) {

			return {icon: "exit", text: ".."};

		} else if (this.resource.uploading) {

			return {icon: "uploading", text: ""};

		} else if (this.resource.loading) {

			return {icon: "loading", text: ""};

		} else if (this.resource.mixed) {

			return {icon: "mixed", text: "[mixed]"};

		} else {

			// const mimetype = this.getValue("mimetype");
			// const filetype = this.getValue("filetype");
			// const name = this.getValue("name");
			// const filename = this.getValue("filename");
			// const dir = this.getValue("dir");


			const media = {
				mimetype: this.getValue("mimetype"),
				filetype: this.getValue("filetype"),
				name: this.getValue("name"),
				filename: this.getValue("filename"),
				dir: this.getValue("dir")
			};

			if (media.mimetype === undefined || media.filetype === undefined || media.name === undefined || media.filename === undefined || media.dir === undefined) {

				return {icon: "loading", text: media.filename || "", loading: true};

			} else {

				const mimetype = media.mimetype[0] || "";
				const filetype = media.filetype[0] || "";
				const name = media.name[0] || "";
				const filename = media.filename[0] || "";
				const dir = media.dir[0] || "";

				const mixed = this.isMixed("filename");
				// const isUploading = this.isUploading();

				if (mixed) {

					return { icon: "mixed", text: "[mixed]" };

				} else if (filetype === "upload") {

					return { icon: "uploading", text: filetype || "..." };

				} else if (filetype === "") {

					return {icon: "notfound", text: "no file type!"};

				} else if (filetype === "exit") {

					return { icon: "exit", text: ".." };

				} else if (filetype === "folder" || filetype === "autofolder") {

					return { icon: "folder", text: name };

				} else if (mimetype.startsWith("image")) {

					if (mimetype === "image/jpeg" || mimetype === "image/png" || this.resource.display === "full") {

							const sizes = this.getValue("sizes");

							if (sizes === undefined) {

								return {
									icon: "loading",
									text: name,
									mimetype: mimetype,
									filename: filename,
									loading: true,
									sizes: []
								};

							} else {

								const sizeName = this.resource.display !== "thumb" && this.resource.display || "thumbnail"; // compat
								const size = sizes.find(size => sizeName === size.name && size.filename);

								if (size) {

									return {
										text: name,
										mimetype: mimetype,
										filename: filename,
										src: KarmaFieldsAlpha.uploadURL+dir+"/"+size.filename,
										image: true,
										sizes: sizes
									};

								} else {

									return {
										icon: "image",
										text: name,
										mimetype: mimetype,
										filename: filename,
										// src: KarmaFieldsAlpha.uploadURL+dir+"/"+filename,
										// image: true,
										// sizes: sizes
									};

								}

							}

					} else {

						return {
							text: name,
							mimetype: mimetype,
							filename: filename,
							src: KarmaFieldsAlpha.uploadURL+dir+"/"+filename,
							image: true
						};

					}

				} else if (mimetype.startsWith("video")) {

					if (this.resource.display === "video") {

						return {
							text: name,
							mimetype: mimetype,
							filename: filename,
							src: KarmaFieldsAlpha.uploadURL+dir+"/"+filename,
							video: true
						};

					} else {

						return {
							icon: "video",
							text: name,
							mimetype: mimetype,
							filename: filename,
						};

					}

				} else if (mimetype.startsWith("audio")) {

					if (this.resource.display === "audio") {

						return {
							text: name,
							mimetype: mimetype,
							filename: filename,
							src: KarmaFieldsAlpha.uploadURL+dir+"/"+filename,
							audio: true
						};

					} else {

						return {
							icon: "audio",
							text: name,
							mimetype: mimetype,
							filename: filename
						};

					}

				} else {

					const media = {
						text: filename,
						src: KarmaFieldsAlpha.uploadURL+dir+"/"+filename,
					};

					if (mimetype.startsWith("text")) {

						media.icon = "text";

					} else if (mimetype === "application/pdf") {

						media.icon = "document";

					} else if (mimetype === "application/zip") {

						media.icon = "zip";

					} else {

						media.icon = "default";

					}

					return media;

				}

			}

		}

  }


	*buildImage(media) {
		if (media.image) {
			yield {
				tag: "img",
				init: element => {
					element.draggable = false;
				},
				update: element => {
					if (media.src && media.src !== element.getAttribute("data-src")) {
						element.src = media.src;
						element.setAttribute("data-src", media.src);
					}
				}
			}
		}
	}

	*buildVideo(media) {

		if (media.video) {
			yield {
				tag: "video",
				init: element => {
					element.controls = true;
				},
				update: element => {
					if (media.filename && media.filename !== element.getAttribute("data-src")) {
						element.src = `${KarmaFieldsAlpha.uploadURL}/${encodeURI(media.filename)}`;
						element.setAttribute("data-src", media.filename);
					}
				}
			};
		}

	}

	*buildAudio(media) {
		if (media.audio) {
			yield {
				tag: "audio",
				init: element => {
					element.controls = true;
				},
				update: element => {
					if (media.filename && media.filename !== element.getAttribute("data-src")) {
						element.src = `${KarmaFieldsAlpha.uploadURL}/${encodeURI(media.filename)}`;
						element.setAttribute("data-src", media.filename);
					}
				}
			}
		}
	}




	*build() {

		const media = this.getMedia();

		yield {
			class: "karma-field-media",
			init: element => {
				if (this.resource.width) {
					element.style.width = this.resource.width;
				}
				if (this.resource.height) {
					element.style.height = this.resource.height;
				}
				if (this.resource.display) {
					element.classList.add(`display-${this.resource.display}`);
				}
				if (this.resource.greyscale) {
					element.classList.add("greyscale");
				}
			},
			children: [
				{
					class: "icon",
					tag: "figure",
					update: element => {
						element.classList.toggle("hidden", !media.icon);
					},
					children: [
						{
							update: element => {
								element.classList.toggle("dashicons", Boolean(media.icon));
								// node.element.classList.toggle("dashicons-category", media.icon === "folder");
								element.classList.toggle("dashicons-format-image", media.icon === "image");
								element.classList.toggle("dashicons-media-video", media.icon === "video");
								element.classList.toggle("dashicons-media-audio", media.icon === "audio");
								element.classList.toggle("dashicons-media-text", media.icon === "text");
								element.classList.toggle("dashicons-media-document", media.icon === "document");
								element.classList.toggle("dashicons-media-archive", media.icon === "archive");
								element.classList.toggle("dashicons-media-default", media.icon === "default");
								element.classList.toggle("dashicons-open-folder", media.icon === "exit" || media.icon === "folder");
								element.classList.toggle("dashicons-upload", media.icon === "uploading");
								element.classList.toggle("dashicons-ellipsis", media.icon === "loading");
								element.classList.toggle("dashicons-warning", media.icon === "notfound");
								element.classList.toggle("dashicons-format-gallery", media.icon === "mixed");
							}
						},
						{
							class: "filename",
							update: element => {
								element.classList.toggle("hidden", this.resource.caption === false);
								element.innerHTML = media.text;
							}
						}
					]
				},
				{
					class: "image",
					tag: "figure",
					update: element => {
						element.classList.toggle("hidden", !media.image);
					},
					children: this.buildImage(media)
				},
				{
					class: "video",
					tag: "figure",
					update: element => {
						element.classList.toggle("hidden", !media.video);
					},
					children: this.buildVideo(media)
				},
				{
					class: "audio",
					tag: "figure",
					update: element => {
						element.classList.toggle("hidden", !media.audio);
					},
					children: this.buildAudio(media)
				}
			]
		};
	}
}
