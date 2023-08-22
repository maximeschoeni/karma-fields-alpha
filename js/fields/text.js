KarmaFieldsAlpha.field.text = class extends KarmaFieldsAlpha.field {

	// async getContent() {
	// 	if (this.resource.value) {
	// 		return this.parse(this.resource.value);
	// 	}
	// 	if (this.resource.key) {
	// 		return this.request("get", {}, this.resource.key).then(response => KarmaFieldsAlpha.Type.toString(response));
	// 	}
	// 	return "";
	// }

	// exportValue() {
	// 	return this.parse(this.resource.export || this.resource.value);
	// }

	export(items = []) {

		if (this.resource.export) {

			const value = new KarmaFieldsAlpha.Expression(this.resource.export, this).toString();

			items.push(value);

		}

	}

	getContent() {

		if (this.resource.value || this.resource.content) {

			return this.parse(this.resource.value || this.resource.content);

		}

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
				// node.element.classList.add("loading");

				// node.element.innerHTML = await this.getContent();


				let content = this.getContent();

        if (content) {

					node.element.classList.toggle("loading", content === KarmaFieldsAlpha.loading);

          // const content = this.parse(this.resource.value);
					//
          // node.element.classList.toggle("loading", content === KarmaFieldsAlpha.loading);
					//
          // node.element.innerHTML = KarmaFieldsAlpha.Type.toString(content);



					if (content === KarmaFieldsAlpha.loading) {

						node.element.innerHTML = '...';

					} else if (typeof content === "symbol") {

						node.element.innerHTML = content.toString();

					} else {

						content = KarmaFieldsAlpha.Type.toArray(content);




						// node.element.innerHTML = KarmaFieldsAlpha.Type.toString(content);

						node.element.innerHTML = content.map(value => `<div class="text-item">${KarmaFieldsAlpha.Type.toString(value)}</div>`).join("");

					}

        } else if (this.resource.links) {

					// node.element.innerHTML = this.resource.links.map(link => {
					// 	return `<a href="${link.content}">${link.content}</a>`;
					//
					// }).join(this.resource.glue || "<br>");

					const links = KarmaFieldsAlpha.Type.toArray(this.resource.links);

					node.children = links.map((link, index) => {

						return this.createChild({
							type: "a",
							...link,
							index: index
						});

						// return {
						// 	tag: "a",
						// 	update: a => {
						// 		a.element.onmousedown = event => {
						// 			event.stopPropagation();
						// 		};
						// 		a.element.onclick = event => {
						// 			event.preventDefault();
						// 			const table = this.parse(link.table);
						// 			const params = this.parse(link.params);
						// 			if (table !== KarmaFieldsAlpha.loading && params !== KarmaFieldsAlpha.loading) {
						// 				KarmaFieldsAlpha.saucer.open(table, params);
						// 			}
						// 		}
						// 		const content = this.parse(link.content);
						// 		a.element.innerHTML = KarmaFieldsAlpha.Type.toString(content) || "...";
						// 	}
						// };
					});


				} else if (this.resource.medias) {

					const medias = KarmaFieldsAlpha.Type.toArray(this.resource.medias);

					node.children = medias.map((media, index) => {

						return this.createChild({
							type: "media",
							...media,
							index: index
						}).build();

					});

				}

				// if (this.resource.highlight) {
				// 	const highlight = await this.parse(this.resource.highlight);
				// 	node.element.classList.toggle("highlight", Boolean(highlight));
				// }

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

				const params = this.parse(this.resource.params);

				if (table !== KarmaFieldsAlpha.loading && params !== KarmaFieldsAlpha.loading) {

					KarmaFieldsAlpha.saucer.open(table, params);

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


KarmaFieldsAlpha.field.text.media = class extends KarmaFieldsAlpha.field {

	getMedia() {

		const driver = this.resource.driver || this.getDriver();
		const id = this.resource.id || this.getId() || KarmaFieldsAlpha.loading;

		if (!driver) {

			return {icon: "notfound", text: "no driver"};

		} else if (id === KarmaFieldsAlpha.exit || this.resource.exit) {

			return {icon: "exit", text: ".."};

		} else if (this.resource.uploading) {

			return {icon: "uploading", text: "..."};

		} else if (id === KarmaFieldsAlpha.loading || this.resource.loading) {

			return {icon: "loading", text: "..."};

		} else if (id === KarmaFieldsAlpha.mixed || this.resource.mixed) {

			return {icon: "mixed", text: "[mixed]"};

		} else if (typeof id === "symbol") {

			return {icon: "notfound", text: id.toString()};

		} else if (id) {

			// const mimetype = KarmaFieldsAlpha.Query.getMimeType(driver, id);
			const mimetype = KarmaFieldsAlpha.Query.getSingleValue(driver, id, "mimetype");
			// const filetype = KarmaFieldsAlpha.Query.getFileType(driver, id);
			const filetype = KarmaFieldsAlpha.Query.getSingleValue(driver, id, "filetype");
			// const name = KarmaFieldsAlpha.Query.getName(driver, id);
			const name = KarmaFieldsAlpha.Query.getSingleValue(driver, id, "name");
			const text = name === KarmaFieldsAlpha.loading ? "..." : name;

			if (mimetype === KarmaFieldsAlpha.loading || filetype === KarmaFieldsAlpha.loading) {

				return {icon: "loading", text: text};

			} else if (filetype === "folder") {

				return {icon: "folder", text: text};

			} else if (mimetype && mimetype.startsWith("image")) {

				// const filename = KarmaFieldsAlpha.Query.getFilename(driver, id);
				const filename = KarmaFieldsAlpha.Query.getSingleValue(driver, id, "filename");

				if (filename === KarmaFieldsAlpha.loading) {

					return {icon: "image", text: text};

				}

				if (mimetype === "image/jpeg" || mimetype === "image/png") {

					// const dir = KarmaFieldsAlpha.Query.getDir(driver, id);
					const dir = KarmaFieldsAlpha.Query.getSingleValue(driver, id, "dir");
					// const sizes = KarmaFieldsAlpha.Query.getSizes(driver, id);
					const sizes = KarmaFieldsAlpha.Query.getValue(driver, id, "sizes");

					if (dir === KarmaFieldsAlpha.loading || !sizes || sizes === KarmaFieldsAlpha.loading) {

						return {icon: "image", text:text};

					}

					return {
						icon: "image",
						text: text,
						mimetype: mimetype,
						filename: filename,
						src: KarmaFieldsAlpha.uploadURL+"/"+filename,
						sizes: sizes,
						dir: dir || "",
						srcset: sizes.filter(size => size.width).map(size => `${KarmaFieldsAlpha.uploadURL}${dir}/${encodeURI(size.filename)} ${size.width}w`)
					};

				} else {

					return {
						icon: "image",
						text: text,
						mimetype: mimetype,
						filename: filename,
						src: KarmaFieldsAlpha.uploadURL+"/"+filename,
					};

				}

			} else if (mimetype && mimetype.startsWith("video")) {

				// const filename = KarmaFieldsAlpha.Query.getFilename(driver, id);
				const filename = KarmaFieldsAlpha.Query.getSingleValue(driver, id, "filename");

				if (filename === KarmaFieldsAlpha.loading) {

					return {icon: "video", text: text};

				}

				return {
					icon: "video",
					text: text,
					mimetype: mimetype,
					filename: filename,
					src: KarmaFieldsAlpha.uploadURL+"/"+filename,
				};

			} else if (mimetype && mimetype.startsWith("audio")) {

				// const filename = KarmaFieldsAlpha.Query.getFilename(driver, id);
				const filename = KarmaFieldsAlpha.Query.getSingleValue(driver, id, "filename");

				if (filename === KarmaFieldsAlpha.loading) {

					return {icon: "audio", text: text};

				}

				return {
					icon: "audio",
					text: text,
					mimetype: mimetype,
					filename: filename,
					src: KarmaFieldsAlpha.uploadURL+"/"+filename,
				};

			} else if (mimetype && mimetype.startsWith("text")) {

				return {icon: "text", text: text};

			} else if (mimetype === "application/pdf") {

				return {icon: "document", text: text};

			} else if (mimetype === "application/zip") {

				return {icon: "zip", text: text};

			} else {

				return {icon: "default", text: text};

			}

		} else {

			return {icon: "notfound", text: "notfound"};

		}

  }

	build() {

		return {
			class: "karma-field-media",
			init: node => {
				if (this.resource.width) {
					node.element.width = this.resource.width;
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
							const visible = media.icon && (!media.src || this.resource.display === "icon" || (this.resource.display === "thumb" && (media.icon === "video" || media.icon === "audio")));
							node.element.classList.toggle("hidden", !visible);
							if (visible) {
								node.element.classList.toggle("dashicons", Boolean(visible));
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
						}
					},
					{
						class: "image",
						tag: "figure",
						update: node => {
							const visible = media.icon === "image" && media.filename && this.resource.display !== "icon";
							node.element.classList.toggle("hidden", !visible);
							if (visible) {
								node.child = {
									tag: "img",
									init: img => {
										img.element.draggable = false;
									},
									update: img => {
										let src;
										const thumb = this.resource.display === "thumb" && media.sizes && media.sizes.find(size => size.name === "thumbnail" && size.filename);
										if (thumb) {
											src = `${KarmaFieldsAlpha.uploadURL}${media.dir||""}/${encodeURI(thumb.filename)}`;
										} else {
											const large = this.resource.display === "large" && media.sizes && media.sizes.find(size => size.name === "medium" && size.filename);
											if (large) {
												src = `${KarmaFieldsAlpha.uploadURL}${media.dir||""}/${encodeURI(large.filename)}`;
											} else {
												const medium = media.sizes && media.sizes.find(size => size.name === "medium" && size.filename);
												if (medium) {
													src = `${KarmaFieldsAlpha.uploadURL}${media.dir||""}/${encodeURI(medium.filename)}`;
												} else {
													src = `${KarmaFieldsAlpha.uploadURL}${media.dir||""}/${encodeURI(media.filename)}`;
												}
											}
										}
										// if (src && !img.element.src.endsWith(src)) {
										if (src && src !== img.element.getAttribute("data-src")) {
											img.element.src = src;
											img.element.setAttribute("data-src", src);
										}

										// const srcset = sizes.filter(size => size.width && size.filename).map(size => `${KarmaFieldsAlpha.uploadURL}${dir}/${encodeURI(size.filename)} ${size.width}w`).join(",");
										// 		// if (srcset) {
										// 		// 	img.element.sizes = this.resource.sizes || "40em";
										// 		// 	img.element.srcset = srcset;
										// 		// }
									}
								}
							}
						}
					},
					{
						class: "video",
						tag: "figure",
						update: node => {
							const visible = media.icon === "video" && media.filename && this.resource.display !== "icon" && this.resource.display !== "thumb";
							node.element.classList.toggle("hidden", !visible);
							if (visible) {
								node.child = {
									tag: "video",
									init: video => {
										video.element.controls = true;
									},
									update: video => {
										if (!video.element.src.endsWith(media.filename)) {
											video.element.src = `${KarmaFieldsAlpha.uploadURL}/${encodeURI(media.filename)}`;
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
							const visible = media.icon === "audio" && media.filename && this.resource.display !== "icon" && this.resource.display !== "thumb";
							node.element.classList.toggle("hidden", !visible);
							if (visible) {
								node.child = {
									tag: "audio",
									init: audio => {
										audio.element.controls = true;
									},
									update: audio => {
										if (!audio.element.src.endsWith(media.filename)) {
											audio.element.src = `${KarmaFieldsAlpha.uploadURL}/${encodeURI(media.filename)}`;
										}
									}
								}
							}
						}
					},
					{
						class: "file-caption",
						update: node => {
							node.element.classList.toggle("hidden", !this.resource.caption);
							if (this.resource.caption) {
								node.child = {
									class: "filename",
									update: filename => {
										filename.element.innerHTML = media.text;
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
