KarmaFieldsAlpha.field.text = class extends KarmaFieldsAlpha.field {

	export() {

		// const collection = new KarmaFieldsAlpha.Content.Collection();
		//
		//
		//
		// if (this.resource.export === true) {
		//
		// 	const content = this.parse(this.resource.content);
		//
		// 	collection.merge(content);
		//
		// } else if (this.resource.export) {
		//
		// 	const content = this.parse(this.resource.export);
		//
		// 	collection.merge(content);
		//
		// }
		//
		//
		// return collection;


		const output = new KarmaFieldsAlpha.Content();
		let content;

		if (this.resource.export) {

			if (this.resource.export === true) {

				content = this.getContent();

			} else if (this.resource.export) {

				content = this.parse(this.resource.export);

			} else {

				content = new KarmaFieldsAlpha.Content();

			}

			if (content.loading) {

				output.loading = true;

			} else {

				output.value = content.toArray();

			}

		}

		return output;
	}

	import(collection) {

		if (this.resource.export) {

			collection.pick();

		}

	}

	getContent() {

		return this.parse(this.resource.value || this.resource.content);

	}


	build() {
		return {
			tag: this.resource.tag,
			class: "text karma-field",
			init: node => {
				if (this.resource.classes) {
					node.element.classList.add(...this.resource.classes);
				}
				if (this.resource.width) {
					node.element.style.width = this.resource.width;
				}
				if (this.resource.display) {
					node.element.classList.add(`display-${this.resource.display}`);
				}
				// node.element.tabIndex = -1;
			},
			update: node => {

				// node.children = [];
				// node.element.innerHTML = "";

				if (this.resource.content || this.resource.value) {


					let content = this.getContent();

					// const children = this.getChildren();

					node.element.classList.toggle("loading", Boolean(content.loading));

					if (content.loading) {

						node.children = [];

					} else if (content.mixed) {

						node.children = [
							{
								update: node => {
									node.element.innerHTML = "[mixed content]";
								}
							}
						];

					} else {

						// content = KarmaFieldsAlpha.Type.toArray(content);

						// node.element.innerHTML = content.toArray().map(value => `<div class="text-item">${value.toString()}</div>`).join("");


						node.children = content.toArray().map(value => {
							return {
								// class:"text-item",
								// tag: "li",
								update: node => {

									node.element.innerHTML = value.toString();
								}
							}
						});

					}

        } else if (this.resource.links) {

					const links = this.parse(this.resource.links);

					if (!links.loading) {

						// node.children = links.toArray().map((link, index) => {
						//
						// 	return this.createChild({
						// 		type: "a",
						// 		...link,
						// 		index: index
						// 	}, index);
						// });


						node.children = links.toArray().map(link => {
							return {
								class:"text-item",
								update: node => {
									node.element.onmousedown = event => {
										event.stopPropagation();
									};

									if (link.href) {

										const href = this.parse(link.href);

										node.element.href = href.toString();

									} else if (link.table || link.params) {

										const table = this.parse(link.table);
										const params = this.parse(link.params);
										const selectedIds = this.parse(link.selectedIds);

										if (!table.loading && !params.loading && !selectedIds.loading) {

											node.element.onclick = event => {

												event.preventDefault();

												this.request("open", table.toString(), params.toObject(), this.resource.replace ?  true : false, selectedIds.toArray())

											}

										}

									}

								}
							}
						});

					}




				} else if (this.resource.medias) {

					const medias = KarmaFieldsAlpha.Type.toArray(this.resource.medias);

					node.children = medias.map((media, index) => {

						return this.createChild({
							type: "media",
							...media,
							index: index
						}).build();

					});

				} else if (this.resource.media) {

					if (this.resource.media.id) {

						let ids = this.parse(this.resource.media.id);

						ids = KarmaFieldsAlpha.Type.toArray(ids);


						node.children = ids.map((id, index) => {

							return this.createChild({
								type: "media",
								driver: this.resource.media.driver || "medias",
								display: this.resource.media.display || "thumb",
								id: id,
								index: index
							}).build();

						});

					}



				}

				if (this.resource.disabled) {
					node.element.classList.toggle("disabled", KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.disabled)));
				}
        if (this.resource.enabled) {
					node.element.classList.toggle("disabled", !KarmaFieldsAlpha.Type.toBoolean(this.parse(this.resource.enabled)));
				}


				if (this.resource.test) {
					console.log(this.parse(this.resource.test));
				}

				// node.element.classList.remove("loading");

			}
		};
	}


}


// deprecated class
KarmaFieldsAlpha.field.text.a = class extends KarmaFieldsAlpha.field {

	constructor(resource) {

		super(resource);

		this.tag = "a";

	}

	update(node) {

		node.element.onmousedown = event => {

			event.stopPropagation();

		};

		if (this.resource.href) {

			const href = this.parse(this.resource.href);

			if (href !== KarmaFieldsAlpha.loading) {

				node.element.href = href;

			}

		} else if (this.resource.table || this.resource.params) {

			node.element.onclick = event => {

				event.preventDefault();

				const table = this.parse(this.resource.table);

				const params = this.parseParams(this.resource.params);

				if (table !== KarmaFieldsAlpha.loading && params !== KarmaFieldsAlpha.loading && !Object.values(params).some(value => value === KarmaFieldsAlpha.loading)) {

					KarmaFieldsAlpha.saucer.open(table, params, this.resource.context);

				}

			}

		}

		const content = this.parse(this.resource.content);

		node.element.innerHTML = KarmaFieldsAlpha.Type.toString(content) || "...";

		if (this.resource.target) {

			node.element.target = this.resource.target;

		}

	}


}



// deprecated class
KarmaFieldsAlpha.field.text.link = class extends KarmaFieldsAlpha.field {

	getHref() {

		if (this.resource.href) {

			const href = this.parse(this.resource.href);

			if (href !== KarmaFieldsAlpha.loading) {

				return href;

			}

		}

	}

	getContent() {

		const content = this.parse(this.resource.content);

		if (content === KarmaFieldsAlpha.loading) {

			return "";

		}

		return KarmaFieldsAlpha.Type.toString(content);

	}

	click() {

		const table = this.parse(this.resource.table);

		const params = this.parseParams(this.resource.params);

		if (table !== KarmaFieldsAlpha.loading && params !== KarmaFieldsAlpha.loading && !Object.values(params).some(value => value === KarmaFieldsAlpha.loading)) {

			KarmaFieldsAlpha.saucer.open(table, params, this.resource.context);

		}

	}

	build() {

		return {
			tag: "a",
			update: node => {

				node.element.onmousedown = event => {

					event.stopPropagation();

				};

				if (this.resource.href) {

					node.element.href = this.getHref();

				} else {

					node.element.onclick = event => {

						event.preventDefault();

						this.click();

					}

				}

				node.element.innerHTML = this.getContent();

				if (this.resource.target) {

					node.element.target = this.resource.target;

				}

			}
		};

	}

}



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

	nav(index = 0) {

		let table = this.parse(this.resource.table);
		let params = this.parse(this.resource.params);

		if (table.loading || params.loading) {

			this.addTask(() => this.nav(index), "nav");

		} else {

			this.save("nav", "Open link");

			this.request("open", table.toString(), params.toArray()[index], this.resource.replace);

		}

		this.request("render");

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


	build() {

		return {
			tag: "ul",
			class: "karma-field links",
			update: node => {
				node.element.classList.toggle("display-inline", this.resource.display === "inline");

				const contents = this.parse(this.resource.content);

				if (contents.loading) {

					node.children = [{
						tag: "li"
					}];

				} else {

					node.children = contents.toArray().map((content, index) => {
						return {
							tag: "li",
							child: {
								tag: "a",
								update: node => {

									node.element.onmousedown = event => {
										event.stopPropagation();
									};

									if (this.resource.table && this.resource.params) {

										node.element.onclick = event => {
											event.preventDefault();
											this.nav(index);
										}

									} else if (this.resource.href) {

										node.element.href = this.parse(this.resource.href).toArray()[index];

									}

									node.element.innerHTML = content;

									if (this.resource.target) {

										node.element.target = this.resource.target;

									}

								}
							}
						}
					});

				}

			}
		};

	}

}


KarmaFieldsAlpha.field.taxonomyLinks = class extends KarmaFieldsAlpha.field.links {

	constructor(resource) {

		// const taxonomy = this.resource.taxonomy || "category";
		// const table = this.resource.table || null; // -> use same table
		// const driver = this.resource.driver || "taxonomy";

		super({
			content: ["map", ["getValue", resource.taxonomy], ["queryValue", resource.driver, ["getItem"], "name"]],
			params: ["map", ["getValue", resource.taxonomy], ["object", resource.taxonomy, ["getItem"]]],
			table: resource.table,
			...resource
		});

	}
}


KarmaFieldsAlpha.field.media = class extends KarmaFieldsAlpha.field {

	getDriver() {

		return  this.resource.driver || this.parent.request("getDriver");

	}

	getContent(key) {

		if (this.resource.driver && this.resource.id) {

			let query = this.parse(this.resource.id);

			if (!query.loading) {

				const collection = new KarmaFieldsAlpha.Model(this.resource.driver);

				const id = query.toString();

		    query = collection.queryValue(id, key);

			}

			return query;

		} else {

			return this.parent.getContent(key);

		}

	}

	getMedia() {

		const driver = this.getDriver();

		// let id = this.parse(this.resource.id);

		if (!driver) {

			return {icon: "notfound", text: "no driver"};

		} else if (this.resource.exit) {

			return {icon: "exit", text: ".."};

		} else if (this.resource.uploading) {

			return {icon: "uploading", text: ""};

		} else if (this.resource.loading) {

			return {icon: "loading", text: ""};

		} else if (this.resource.mixed) {

			return {icon: "mixed", text: "[mixed]"};

		// } else if (!id.toString()) {
		//
		// 	return {icon: "notfound", text: "No ID"};

		} else {

			// const mimetype = KarmaFieldsAlpha.Query.getValue(driver, id.toString(), "mimetype");
			// const filetype = KarmaFieldsAlpha.Query.getValue(driver, id.toString(), "filetype");
			// const name = KarmaFieldsAlpha.Query.getValue(driver, id.toString(), "name");
			// const filename = KarmaFieldsAlpha.Query.getValue(driver, id.toString(), "filename");

			// const mimetype = new KarmaFieldsAlpha.Content.Value(driver, id.toString(), "mimetype");
			// const filetype = new KarmaFieldsAlpha.Content.Value(driver, id.toString(), "filetype");
			// const name = new KarmaFieldsAlpha.Content.Value(driver, id.toString(), "name");
			// const filename = new KarmaFieldsAlpha.Content.Value(driver, id.toString(), "filename");

			const mimetype = this.getContent("mimetype");
			const filetype = this.getContent("filetype");
			const name = this.getContent("name");
			const filename = this.getContent("filename");

			if (mimetype.loading || filetype.loading || name.loading || filename.loading || !filetype.toString()) {

				return {icon: "loading", text: ""};

			} else if (filetype.toString() === "exit") {

				return {icon: "exit", text: ".."};

			} else if (filetype.toString() === "folder") {

				return {icon: "folder", text: name.toString()};

			} else if (mimetype.toString().startsWith("image")) {

				const filename = this.getContent("filename");

				if (filename.loading) {

					return {icon: "image", text: ""};

				}

				const dir = this.getContent("dir");

				if (dir.loading) {

					return {icon: "image", text:""};

				}

				if (mimetype.toString() === "image/jpeg" || mimetype.toString() === "image/png" || this.resource.display === "full") {




					// if (this.resource.display === "full") {
					//
					// 	return {
					// 		text: name.toString(),
					// 		mimetype: mimetype.toString(),
					// 		filename: filename.toString(),
					// 		src: KarmaFieldsAlpha.uploadURL+dir.toString()+"/"+filename.toString(),
					// 		image: true
					// 	};
					//
					// } else {

						const sizes = this.getContent("sizes");

						if (sizes.loading) {

							return {
								icon: "loading",
								text: name.toString(),
								mimetype: mimetype.toString(),
								filename: filename.toString(),
							};

						} else {

							const sizeName = this.resource.display !== "thumb" && this.resource.display || "thumbnail"; // compat
							const size = sizes.toArray().find(size => sizeName === size.name && size.filename);

							if (size) {

								return {
									text: name.toString(),
									mimetype: mimetype.toString(),
									filename: filename.toString(),
									src: KarmaFieldsAlpha.uploadURL+dir.toString()+"/"+size.filename.toString(),
									image: true
								};

							} else {

								return {
									icon: "image",
									text: name.toString(),
									mimetype: mimetype.toString(),
									filename: filename.toString(),
								};

							}

						}

					// }

					// return {
					// 	icon: "image",
					// 	text: name.toString(),
					// 	mimetype: mimetype.toString(),
					// 	filename: filename.toString(),
					// 	src: KarmaFieldsAlpha.uploadURL+dir.toString()+"/"+filename.toString(),
					// 	sizes: sizes.toArray(),
					// 	dir: dir.toString() || ""
					// 	// srcset: sizes.filter(size => size.width).map(size => `${KarmaFieldsAlpha.uploadURL}${dir}/${encodeURI(size.filename)} ${size.width}w`)
					// };

				} else {

					return {
						icon: "image",
						text: name.toString(),
						mimetype: mimetype.toString(),
						filename: filename.toString(),
						// dir: dir.toString(),
						src: KarmaFieldsAlpha.uploadURL+dir.toString()+"/"+filename.toString(),
						image: true
					};

				}

			} else if (mimetype.toString().startsWith("video")) {

				const filename = this.getContent("filename");

				if (filename.loading) {

					return {icon: "video", text: name.toString()};

				}

				const dir = this.getContent("dir");

				if (dir.loading) {

					return {icon: "image", text: name.toString()};

				}

				if (this.resource.display === "video") {

					return {
						text: name.toString(),
						mimetype: mimetype.toString(),
						filename: filename.toString(),
						src: KarmaFieldsAlpha.uploadURL+dir.toString()+"/"+filename.toString(),
						video: true
					};

				} else {

					return {
						icon: "video",
						text: name.toString(),
						mimetype: mimetype.toString(),
						filename: filename.toString(),
					};

				}

			} else if (mimetype.toString().startsWith("audio")) {

				const filename = this.getContent("filename");
				const dir = this.getContent("dir");

				if (dir.loading) {

					return {icon: "image", text: name.toString()};

				}

				if (filename.loading) {

					return {icon: "audio", text: name.toString()};

				}

				if (this.resource.display === "audio") {

					return {
						text: name.toString(),
						mimetype: mimetype.toString(),
						filename: filename.toString(),
						src: KarmaFieldsAlpha.uploadURL+dir.toString()+"/"+filename.toString(),
						audio: true
					};

				} else {

					return {
						icon: "audio",
						text: name.toString(),
						mimetype: mimetype.toString(),
						filename: filename.toString(),
					};

				}

			} else if (mimetype.toString().startsWith("text")) {

				return {icon: "text", text: filename.toString()};

			} else if (mimetype.toString() === "application/pdf") {

				return {icon: "document", text: filename.toString()};

			} else if (mimetype.toString() === "application/zip") {

				return {icon: "zip", text: filename.toString()};

			} else {

				return {icon: "default", text: filename.toString()};

			}

		}

  }

	build() {

		return {
			class: "karma-field-media",
			init: node => {
				if (this.resource.width) {
					node.element.style.width = this.resource.width;
				}
				if (this.resource.height) {
					node.element.style.height = this.resource.height;
				}
				if (this.resource.display) {
					node.element.classList.add(`display-${this.resource.display}`);
				}
				if (this.resource.greyscale) {
					node.element.classList.add("greyscale");
				}
			},
			update: node => {

				const media = this.getMedia();

				node.children = [
					{
						class: "icon",
						tag: "figure",
						update: node => {
							// const visible = media.icon && (!media.src || this.resource.display === "icon" || (this.resource.display === "thumb" && (media.icon === "video" || media.icon === "audio")));
							node.element.classList.toggle("hidden", !media.icon);
							// if (media.icon) {
								node.children = [
									{
										update: node => {
											node.element.classList.toggle("dashicons", Boolean(media.icon));
											node.element.classList.toggle("dashicons-category", media.icon === "folder");
											node.element.classList.toggle("dashicons-format-image", media.icon === "image");
											node.element.classList.toggle("dashicons-media-video", media.icon === "video");
											node.element.classList.toggle("dashicons-media-audio", media.icon === "audio");
											node.element.classList.toggle("dashicons-media-text", media.icon === "text");
											node.element.classList.toggle("dashicons-media-document", media.icon === "document");
											node.element.classList.toggle("dashicons-media-archive", media.icon === "archive");
											node.element.classList.toggle("dashicons-media-default", media.icon === "default");
											node.element.classList.toggle("dashicons-open-folder", media.icon === "exit");
											node.element.classList.toggle("dashicons-upload", media.icon === "uploading");
											node.element.classList.toggle("dashicons-ellipsis", media.icon === "loading");
											node.element.classList.toggle("dashicons-warning", media.icon === "notfound");
											node.element.classList.toggle("dashicons-format-gallery", media.icon === "mixed");
										}
									},
									{
										class: "filename",
										update: filename => {
											filename.element.classList.toggle("hidden", this.resource.caption === false);
											filename.element.innerHTML = media.text;
										}
									}
								];
							// }
						}
					},
					{
						class: "image",
						tag: "figure",
						update: node => {
							// const visible = media.icon === "image" && media.filename && this.resource.display !== "icon";
							node.element.classList.toggle("hidden", !media.image);
							if (media.image) {
								node.child = {
									tag: "img",
									init: img => {
										img.element.draggable = false;
									},
									update: img => {
										// let src;
										// const thumb = this.resource.display === "thumb" && media.sizes && media.sizes.find(size => size.name === "thumbnail" && size.filename);
										//
										// if (thumb) {
										// 	src = `${KarmaFieldsAlpha.uploadURL}${media.dir||""}/${encodeURI(thumb.filename)}`;
										// } else {
										// 	const large = this.resource.display === "large" && media.sizes && media.sizes.find(size => size.name === "medium" && size.filename);
										// 	if (large) {
										// 		src = `${KarmaFieldsAlpha.uploadURL}${media.dir||""}/${encodeURI(large.filename)}`;
										// 	} else {
										// 		const medium = media.sizes && media.sizes.find(size => size.name === "medium" && size.filename);
										// 		if (medium) {
										// 			src = `${KarmaFieldsAlpha.uploadURL}${media.dir||""}/${encodeURI(medium.filename)}`;
										// 		} else {
										// 			src = `${KarmaFieldsAlpha.uploadURL}${media.dir||""}/${encodeURI(media.filename)}`;
										// 		}
										// 	}
										// }
										if (media.src && media.src !== img.element.getAttribute("data-src")) {
											img.element.src = media.src;
											img.element.setAttribute("data-src", media.src);
										}
									}
								}
							}
						}
					},
					{
						class: "video",
						tag: "figure",
						update: node => {
							// const visible = media.icon === "video" && media.filename && this.resource.display !== "icon" && this.resource.display !== "thumb";
							node.element.classList.toggle("hidden", !media.video);
							if (media.video) {
								node.child = {
									tag: "video",
									init: video => {
										video.element.controls = true;
									},
									update: video => {
										// if (!video.element.src.endsWith(media.filename)) {
										if (media.filename && media.filename !== video.element.getAttribute("data-src")) {
											video.element.src = `${KarmaFieldsAlpha.uploadURL}/${encodeURI(media.filename)}`;
											video.element.setAttribute("data-src", media.filename);
										}
									}
								}
							}
						}
					},
					{
						class: "audio",
						tag: "figure",
						update: node => {
							// const visible = media.icon === "audio" && media.filename && this.resource.display !== "icon" && this.resource.display !== "thumb";
							node.element.classList.toggle("hidden", !media.audio);
							if (media.audio) {
								node.child = {
									tag: "audio",
									init: audio => {
										audio.element.controls = true;
									},
									update: audio => {
										// if (!audio.element.src.endsWith(media.filename)) {
										if (media.filename && media.filename !== audio.element.getAttribute("data-src")) {
											audio.element.src = `${KarmaFieldsAlpha.uploadURL}/${encodeURI(media.filename)}`;
											audio.element.setAttribute("data-src", media.filename);
										}
									}
								}
							}
						}
					}
				]
			}
		};
	}
}


// KarmaFieldsAlpha.field.media = class extends KarmaFieldsAlpha.field {
//
// 	getMedia() {
//
// 		const driver = this.resource.driver || this.getDriver();
// 		// const id = this.resource.id || this.getId() || KarmaFieldsAlpha.loading;
//
//
// 		let id = this.parse(this.resource.id);
//
// 		if (typeof id !== "symbol") {
//
// 			id = KarmaFieldsAlpha.Type.toString(id);
//
// 		}
//
// 		// if (!id) {
// 		//
// 		// 	id = this.getId() || KarmaFieldsAlpha.loading;
// 		//
// 		// }
//
// 		// console.log(id, this.resource.id);
//
// 		if (!driver) {
//
// 			return {icon: "notfound", text: "no driver"};
//
// 		} else if (id === KarmaFieldsAlpha.exit || this.resource.exit) {
//
// 			return {icon: "exit", text: ".."};
//
// 		} else if (this.resource.uploading) {
//
// 			return {icon: "uploading", text: ""};
//
// 		} else if (id === KarmaFieldsAlpha.loading || this.resource.loading) {
//
// 			return {icon: "loading", text: ""};
//
// 		} else if (id === KarmaFieldsAlpha.mixed || this.resource.mixed) {
//
// 			return {icon: "mixed", text: "[mixed]"};
//
// 		} else if (typeof id === "symbol") {
//
// 			return {icon: "notfound", text: id.toString()};
//
// 		} else if (id) {
//
// 			// const mimetype = KarmaFieldsAlpha.Query.getMimeType(driver, id);
// 			const mimetype = KarmaFieldsAlpha.Query.getSingleValue(driver, id, "mimetype");
// 			// const filetype = KarmaFieldsAlpha.Query.getFileType(driver, id);
// 			const filetype = KarmaFieldsAlpha.Query.getSingleValue(driver, id, "filetype");
// 			// const name = KarmaFieldsAlpha.Query.getName(driver, id);
// 			const name = KarmaFieldsAlpha.Query.getSingleValue(driver, id, "name");
//
// 			let text;
//
// 			if (name !== KarmaFieldsAlpha.loading) {
//
// 				text = name;
//
// 			} else {
//
// 				text = "";
//
// 			}
//
// 			if (mimetype === KarmaFieldsAlpha.loading || filetype === KarmaFieldsAlpha.loading) {
//
// 				return {icon: "loading", text: text};
//
// 			} else if (filetype === "folder") {
//
// 				return {icon: "folder", text: text};
//
// 			} else if (mimetype && mimetype.startsWith("image")) {
//
// 				// const filename = KarmaFieldsAlpha.Query.getFilename(driver, id);
// 				const filename = KarmaFieldsAlpha.Query.getSingleValue(driver, id, "filename");
//
// 				if (filename === KarmaFieldsAlpha.loading) {
//
// 					return {icon: "image", text: text};
//
// 				}
//
// 				const dir = KarmaFieldsAlpha.Query.getSingleValue(driver, id, "dir") || "";
//
// 				if (dir === KarmaFieldsAlpha.loading) {
//
// 					return {icon: "image", text:text};
//
// 				}
//
// 				if (mimetype === "image/jpeg" || mimetype === "image/png") {
//
// 					// const dir = KarmaFieldsAlpha.Query.getDir(driver, id);
//
// 					// const sizes = KarmaFieldsAlpha.Query.getSizes(driver, id);
// 					const sizes = KarmaFieldsAlpha.Query.getValue(driver, id, "sizes") || [];
//
// 					return {
// 						icon: "image",
// 						text: text,
// 						mimetype: mimetype,
// 						filename: filename,
// 						src: KarmaFieldsAlpha.uploadURL+dir+"/"+filename,
// 						sizes: sizes,
// 						dir: dir || ""
// 						// srcset: sizes.filter(size => size.width).map(size => `${KarmaFieldsAlpha.uploadURL}${dir}/${encodeURI(size.filename)} ${size.width}w`)
// 					};
//
// 				} else {
//
// 					return {
// 						icon: "image",
// 						text: text,
// 						mimetype: mimetype,
// 						filename: filename,
// 						dir: dir || "",
// 						src: KarmaFieldsAlpha.uploadURL+dir+"/"+filename,
// 					};
//
// 				}
//
// 			} else if (mimetype && mimetype.startsWith("video")) {
//
// 				// const filename = KarmaFieldsAlpha.Query.getFilename(driver, id);
// 				const filename = KarmaFieldsAlpha.Query.getSingleValue(driver, id, "filename");
//
// 				if (filename === KarmaFieldsAlpha.loading) {
//
// 					return {icon: "video", text: text};
//
// 				}
//
// 				const dir = KarmaFieldsAlpha.Query.getSingleValue(driver, id, "dir") || "";
//
// 				if (dir === KarmaFieldsAlpha.loading) {
//
// 					return {icon: "image", text:text};
//
// 				}
//
// 				return {
// 					icon: "video",
// 					text: text,
// 					mimetype: mimetype,
// 					filename: filename,
// 					dir: dir || "",
// 					src: KarmaFieldsAlpha.uploadURL+dir+"/"+filename,
// 				};
//
// 			} else if (mimetype && mimetype.startsWith("audio")) {
//
// 				// const filename = KarmaFieldsAlpha.Query.getFilename(driver, id);
// 				const filename = KarmaFieldsAlpha.Query.getSingleValue(driver, id, "filename");
//
// 				const dir = KarmaFieldsAlpha.Query.getSingleValue(driver, id, "dir") || "";
//
// 				if (dir === KarmaFieldsAlpha.loading) {
//
// 					return {icon: "image", text:text};
//
// 				}
//
// 				if (filename === KarmaFieldsAlpha.loading) {
//
// 					return {icon: "audio", text: text};
//
// 				}
//
// 				return {
// 					icon: "audio",
// 					text: text,
// 					mimetype: mimetype,
// 					filename: filename,
// 					dir: dir || "",
// 					src: KarmaFieldsAlpha.uploadURL+dir+"/"+filename,
// 				};
//
// 			} else if (mimetype && mimetype.startsWith("text")) {
//
// 				return {icon: "text", text: text};
//
// 			} else if (mimetype === "application/pdf") {
//
// 				return {icon: "document", text: text};
//
// 			} else if (mimetype === "application/zip") {
//
// 				return {icon: "zip", text: text};
//
// 			} else {
//
// 				return {icon: "default", text: text};
//
// 			}
//
// 		} else {
//
// 			return {icon: "none", text: ""};
//
// 		}
//
//   }
//
// 	build() {
//
// 		return {
// 			class: "karma-field-media",
// 			init: node => {
// 				if (this.resource.width) {
// 					node.element.style.width = this.resource.width;
// 				}
// 				if (this.resource.height) {
// 					node.element.style.height = this.resource.height;
// 				}
// 				if (this.resource.display) {
// 					node.element.classList.add(`display-${this.resource.display}`);
// 				}
// 				if (this.resource.greyscale) {
// 					node.element.classList.add("greyscale");
// 				}
// 			},
// 			update: node => {
//
// 				const media = this.getMedia();
//
// 				node.children = [
// 					{
// 						class: "icon",
// 						tag: "figure",
// 						update: node => {
// 							const visible = media.icon && (!media.src || this.resource.display === "icon" || (this.resource.display === "thumb" && (media.icon === "video" || media.icon === "audio")));
// 							node.element.classList.toggle("hidden", !visible);
// 							if (visible) {
// 								node.children = [
// 									{
// 										update: node => {
// 											node.element.classList.toggle("dashicons", Boolean(visible));
// 											node.element.classList.toggle("dashicons-category", media.icon === "folder");
// 											node.element.classList.toggle("dashicons-format-image", media.icon === "image");
// 											node.element.classList.toggle("dashicons-media-video", media.icon === "video");
// 											node.element.classList.toggle("dashicons-media-audio", media.icon === "audio");
// 											node.element.classList.toggle("dashicons-media-text", media.icon === "text");
// 											node.element.classList.toggle("dashicons-media-document", media.icon === "document");
// 											node.element.classList.toggle("dashicons-media-archive", media.icon === "archive");
// 											node.element.classList.toggle("dashicons-media-default", media.icon === "default");
// 											node.element.classList.toggle("dashicons-open-folder", media.icon === "exit");
// 											node.element.classList.toggle("dashicons-upload", media.icon === "uploading");
// 											node.element.classList.toggle("dashicons-ellipsis", media.icon === "loading");
// 											node.element.classList.toggle("dashicons-warning", media.icon === "notfound");
// 											node.element.classList.toggle("dashicons-format-gallery", media.icon === "mixed");
// 										}
// 									},
// 									{
// 										class: "filename",
// 										update: filename => {
// 											filename.element.innerHTML = media.text;
// 										}
// 									}
// 									// {
// 									// 	class: "file-caption",
// 									// 	update: node => {
// 									// 		node.element.classList.toggle("hidden", !this.resource.caption);
// 									// 		if (this.resource.caption) {
// 									// 			node.child = {
// 									// 				class: "filename",
// 									// 				update: filename => {
// 									// 					filename.element.innerHTML = media.text;
// 									// 				}
// 									// 			}
// 									// 		}
// 									// 	}
// 									// }
// 								];
// 							}
// 						}
// 					},
// 					{
// 						class: "image",
// 						tag: "figure",
// 						update: node => {
// 							const visible = media.icon === "image" && media.filename && this.resource.display !== "icon";
// 							node.element.classList.toggle("hidden", !visible);
// 							if (visible) {
// 								node.child = {
// 									tag: "img",
// 									init: img => {
// 										img.element.draggable = false;
// 									},
// 									update: img => {
// 										let src;
// 										const thumb = this.resource.display === "thumb" && media.sizes && media.sizes.find(size => size.name === "thumbnail" && size.filename);
//
// 										if (thumb) {
// 											src = `${KarmaFieldsAlpha.uploadURL}${media.dir||""}/${encodeURI(thumb.filename)}`;
// 										} else {
// 											const large = this.resource.display === "large" && media.sizes && media.sizes.find(size => size.name === "medium" && size.filename);
// 											if (large) {
// 												src = `${KarmaFieldsAlpha.uploadURL}${media.dir||""}/${encodeURI(large.filename)}`;
// 											} else {
// 												const medium = media.sizes && media.sizes.find(size => size.name === "medium" && size.filename);
// 												if (medium) {
// 													src = `${KarmaFieldsAlpha.uploadURL}${media.dir||""}/${encodeURI(medium.filename)}`;
// 												} else {
// 													src = `${KarmaFieldsAlpha.uploadURL}${media.dir||""}/${encodeURI(media.filename)}`;
// 												}
// 											}
// 										}
// 										// if (src && !img.element.src.endsWith(src)) {
// 										if (src && src !== img.element.getAttribute("data-src")) {
// 											img.element.src = src;
// 											img.element.setAttribute("data-src", src);
// 										}
//
// 										// const srcset = sizes.filter(size => size.width && size.filename).map(size => `${KarmaFieldsAlpha.uploadURL}${dir}/${encodeURI(size.filename)} ${size.width}w`).join(",");
// 										// 		// if (srcset) {
// 										// 		// 	img.element.sizes = this.resource.sizes || "40em";
// 										// 		// 	img.element.srcset = srcset;
// 										// 		// }
// 									}
// 								}
// 							}
// 						}
// 					},
// 					{
// 						class: "video",
// 						tag: "figure",
// 						update: node => {
// 							const visible = media.icon === "video" && media.filename && this.resource.display !== "icon" && this.resource.display !== "thumb";
// 							node.element.classList.toggle("hidden", !visible);
// 							if (visible) {
// 								node.child = {
// 									tag: "video",
// 									init: video => {
// 										video.element.controls = true;
// 									},
// 									update: video => {
// 										if (!video.element.src.endsWith(media.filename)) {
// 											video.element.src = `${KarmaFieldsAlpha.uploadURL}/${encodeURI(media.filename)}`;
// 										}
// 									}
// 								}
// 							}
// 						}
// 					},
// 					{
// 						class: "audio",
// 						tag: "figure",
// 						update: node => {
// 							const visible = media.icon === "audio" && media.filename && this.resource.display !== "icon" && this.resource.display !== "thumb";
// 							node.element.classList.toggle("hidden", !visible);
// 							if (visible) {
// 								node.child = {
// 									tag: "audio",
// 									init: audio => {
// 										audio.element.controls = true;
// 									},
// 									update: audio => {
// 										if (!audio.element.src.endsWith(media.filename)) {
// 											audio.element.src = `${KarmaFieldsAlpha.uploadURL}/${encodeURI(media.filename)}`;
// 										}
// 									}
// 								}
// 							}
// 						}
// 					}
// 					// {
// 					// 	class: "file-caption",
// 					// 	update: node => {
// 					// 		node.element.classList.toggle("hidden", !this.resource.caption);
// 					// 		if (this.resource.caption) {
// 					// 			node.child = {
// 					// 				class: "filename",
// 					// 				update: filename => {
// 					// 					filename.element.innerHTML = media.text;
// 					// 				}
// 					// 			}
// 					// 		}
// 					// 	}
// 					// }
// 				]
// 			}
// 		};
// 	}
// }
