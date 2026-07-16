
KarmaFieldsAlpha.field.gallery = class extends KarmaFieldsAlpha.field.grid {

	getSelection() {

		const rawSelection = this.getRawSelection();

		if (this.resource.exit) {

			let index = rawSelection.index;
			let length = rawSelection.length;

			index--;

			if (index < 0) {

				index = 0;
				length--;

			}

			return { index, length };

		}

		return rawSelection;

	}

	setSelection(selection) {

		if (this.resource.exit) {

			let index = selection.index;
			let length = selection.length;

			index++;

			this.setRawSelection({ index, length });

		} else {

			this.setRawSelection(selection);

		}

	}

	// getExportableColumns() {

	// 	return [
	// 		{
	// 			type: "input", // -> type = "group"
	// 			key: "id"
	// 		}
	// 	];

	// }


	/**
 * Detect file type from ArrayBuffer using magic bytes
 * @param {ArrayBuffer} arrayBuffer - The file data as ArrayBuffer
 * @returns {Promise<string>} - Detected MIME type or 'application/octet-stream' if unknown
 */
	async detectFileType(arrayBuffer) {
		// Common file signatures (magic numbers)
		const signatures = {
			// Images
			'89504E47': 'image/png',
			'47494638': 'image/gif',
			'FFD8FFDB': 'image/jpeg',
			'FFD8FFE0': 'image/jpeg',
			'FFD8FFE1': 'image/jpeg',
			'FFD8FFE2': 'image/jpeg',
			'FFD8FFE3': 'image/jpeg',
			'FFD8FFE8': 'image/jpeg',
			'49492A00': 'image/tiff',
			'4D4D002A': 'image/tiff',
			'424D': 'image/bmp',
			'52494646': 'image/webp', // WEBP 'RIFF'

			// Documents
			'25504446': 'application/pdf',
			'504B0304': 'application/zip', // Also .docx, .xlsx, etc.
			'D0CF11E0': 'application/vnd.ms-office', // .doc, .xls, .ppt
			'377ABCAF': 'application/x-7z-compressed',
			'1F8B08': 'application/gzip',
			'75737461': 'application/x-tar',

			// Audio/Video
			'494433': 'audio/mpeg', // MP3 with ID3 tag
			'000001BA': 'video/mpeg',
			'000001B3': 'video/mpeg',
			'66747970': 'video/mp4', // MP4 'ftyp'
			'3026B275': 'video/x-ms-wmv',
			'4F676753': 'application/ogg',

			// Text files (no signature, but check for BOM)
			'EFBBBF': 'text/plain', // UTF-8 BOM
			'FFFE': 'text/plain', // UTF-16 LE BOM
			'FEFF': 'text/plain', // UTF-16 BE BOM
		};

		// Convert the first 8 bytes to hex string for checking
		const uint8Array = new Uint8Array(arrayBuffer);
		const bytes = Array.from(uint8Array.slice(0, 8)); // Get first 8 bytes
		let hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

		// Special case for MP3 without ID3 tag (starts with audio frame header)
		if (hex.startsWith('FFF') || hex.startsWith('FFE')) {
			return 'audio/mpeg';
		}

		// Check against known signatures
		for (const [signature, mimeType] of Object.entries(signatures)) {
			if (hex.startsWith(signature)) {
				return mimeType;
			}
		}

		// Check for plain text if no binary signature found
		// if (isLikelyText(uint8Array)) {
		// 	return 'text/plain';
		// }

		// Default to octet-stream if unknown
		return 'application/octet-stream';
	}

	isFolder(index) {

		return this.getValue("filetype", index, 1)?.[0] === "folder";

	}

	isDroppable(index) {

		return true;

	}


	openFolder(index) {

		this.doAction("open-folder", index);

	}

	exitFolder() {

		this.doAction("exit-folder");

	}

	move(target, index, length) {

		if (index === undefined) {

			const selection = this.getSelection();

			if (selection) {

				this.doAction("move", target, selection.index, selection.length);

			}

		} else {

			this.doAction("move", target, index, length);

		}

	}

	getMedia(index) {

		return new KarmaFieldsAlpha.field.gallery.media({
			index
		}, index, this);

	}

	*buildThumbnails() {

		if (this.resource.exit) {

			// const media = this.createChild({
			// 	type: "media",
			// 	display: "thumb",
			// 	exit: true
			// }, "exit");

			const media = new KarmaFieldsAlpha.field.gallery.media({
				display: "thumb",
				exit: true
			}, "exit", this);

			yield {
				tag: "li",
				class: "frame",
				update: element => {
					element.classList.remove("drop-active");
					element.classList.toggle("selected", this.hasFocus() && this.isRawIndexSelected(0));
					element.classList.toggle("media-dropzone", true);
					element.classList.toggle("droppable", false);

					element.ondblclick = event => {
						this.save("exit-folder");
						this.openExitFolder();
						this.render();
					}
				},
				children: media.build()
			};

		}

		for (let i = 0; i < this.resource.length; i++) {

			// const row = this.getRow(i);

			// debugger;

			// const media = row.createChild({
			// 	type: "media",
			// 	display: "thumb",
			// }, "media");

			const media = this.getMedia(i);


			yield {
				tag: "li",
				class: "frame",
				update: element => {

					element.classList.remove("drop-active");
					element.classList.toggle("selected", this.hasFocus() && this.isSelected(i));
					element.classList.toggle("media-dropzone", this.isFolder(i));
					element.classList.toggle("droppable", true);

					element.ondblclick = event => {

						if (this.isFolder(i)) {
							this.save("open-folder");
							this.doAction("open-folder", i);
							this.unselect();
							this.render();
						} else { // -> edit image in files field
							this.save("edit-file");
							this.setSelection({ index: i, length: 1 });
							this.doAction("edit", i, 1);
							this.render();
						}
					}
				},
				children: media.build()
			};

		}

	}

	*buildContent() {

		yield {
			class: "media-table-container",
			init: element => {
				element.ondrop = async event => {
					event.preventDefault();
					const files = event.dataTransfer.files;
					if (files.length) {
						this.doAction("upload", files);
						this.render();
					}
					element.classList.remove("drop-active");
				}

				element.ondragover = event => {
					event.preventDefault();
					element.classList.add("drop-active");
				}
				element.ondragleave = event => {
					event.preventDefault();
					element.classList.remove("drop-active");
				}
				if (this.parent.id === "popup") {
					element.classList.add("scroll-container");
				}
			},
			child: {
				class: "media-table",
				tag: "ul",
				init: element => {
					if (this.resource.style) {
						element.style = this.resource.style;
					}
				},
				update: element => {
					this.registerTracker(element, "inline");
				},
				children: this.buildThumbnails()
			}
		};

	}

}


KarmaFieldsAlpha.field.gallery.description = class extends KarmaFieldsAlpha.field {

	*build() {

		const image = new KarmaFieldsAlpha.field.media({
			type: "media",
			width: "100%",
			height: "15em",
			caption: false,
			display: "medium", // = default
			...this.resource.media }, 0, this);

		const description = new KarmaFieldsAlpha.field.gallery.description.imageDescription({
			children: [
				"fileDescription",
				"sizeDescription",
				"resolutionDescription",
				"dateDescription",
				"multipleDescription"
			],
			...this.resource.image
		}, 1, this);

		yield {
			class: "karma-field karma-field-container media-description",
			children: [
				{
					children: image.build()
				},
				{
					children: description.build()
				}
			]
			// children: [
			// 	...this.createChild({
			// 		type: "media",
			// 		width: "100%",
			// 		height: "15em",
			// 		// loading: loading,
			// 		// uploading: uploading,
			// 		// token: token, // not implemented
			// 		// mixed: mixed,
			// 		// exit: exit,
			// 		// id: id,
			// 		caption: false,
			// 		display: "medium" // = default
			// 	}, "media").build(),
			// 	// ...this.createChild("imageDescription").build()
			// ]
		};
	}
}

KarmaFieldsAlpha.field.gallery.description.imageDescription = class extends KarmaFieldsAlpha.field.group {

  // constructor(resource, id, parent) {

  //   super({
  //     children: [
  //       "fileDescription",
  //       "sizeDescription",
  //       "resolutionDescription",
  //       "dateDescription",
  //       "multipleDescription"
  //     ],
  //     ...resource
  //   }, id, parent);

  // }

}

KarmaFieldsAlpha.field.gallery.description.fileType = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["getValue", "filetype"],
      ...resource
    }, id, parent);
  }
}


KarmaFieldsAlpha.field.gallery.description.mimeType = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["getValue", "mimetype"],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.gallery.description.dateDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["date", ["getValue", "upload-date"], {year: "numeric", month: "long", day: "2-digit"}],
      hidden: ["||", ["isMixed", ["getValue", "upload-date"]], ["!", ["getValue", "upload-date"]], ["=", ["getValue", "filetype"], "folder"]],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.gallery.description.sizeDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["?", [">", ["getValue", "size"], 1000], ["replace", "% KB", "%", ["math", "floor", ["/", ["getValue", "size"], 1000]]], ["replace", "% B", "%", ["getValue", "size"]]],
      hidden: ["||", ["isMixed", ["getValue", "size"]], ["!", ["getValue", "size"]], ["=", ["getValue", "filetype"], "folder"]],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.gallery.description.resolutionDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: ["replace", "% x % pixels", "%", ["getValue", "width"], ["getValue", "height"]],
      visible: ["&&", ["like", ["getValue", "mimetype"], "^image/.*$"], ["!", ["isMixed", ["getValue", "width"]]], ["!", ["isMixed", ["getValue", "height"]]]],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.gallery.description.fileDescription = class extends KarmaFieldsAlpha.field.link {
  constructor(resource, id, parent) {
    super({
      style: "word-break: break-word",
      content: ["getValue", "filename"],
      href: ["replace", `${KarmaFieldsAlpha.uploadURL}#/#`, "#", ["getValue", "dir"], ["getValue", "filename"]],
      target: "_blank",
      // hidden: ["||", ["=", ["getIds"], "0"], ["isMixed", ["getValue", "filename"]], ["!", ["getValue", "filename"]]],
      hidden: ["||", ["isMixed", ["getValue", "filename"]], ["!", ["getValue", "filename"]]],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.gallery.description.multipleDescription = class extends KarmaFieldsAlpha.field.text {
  constructor(resource, id, parent) {
    super({
      content: "[Mixed files]",
      visible: ["isMixed", ["getValue", "filename"]],
      ...resource
    }, id, parent);
  }
}

KarmaFieldsAlpha.field.gallery.description.folderName = class extends KarmaFieldsAlpha.field.input {
  constructor(resource, id, parent) {
    super({
      type: "input",
      label: "Folder name",
      key: "name",
      visible: ["&&", ["!", ["getValue", "mimetype"]], ["!", ["isMixed", ["getValue", "mimetype"]]]],
      ...resource
    }, id, parent);
  }
}


KarmaFieldsAlpha.field.media = class extends KarmaFieldsAlpha.field {

	getSingleValue(key) {

		const value = this.getValue(key);

		if (value !== undefined) {

			return value[0] || "";

		}

	}

	getMimetype() {

		return this.getSingleValue("mimetype");

	}

	getFiletype() {

		return this.getSingleValue("filetype");

	}

	getName() {

		return this.getSingleValue("name");

	}

	getFilename() {

		return this.getSingleValue("filename");

	}

	getDir() {

		return this.getSingleValue("dir");

	}

	getUrl() {

		const filename = this.getSingleValue("filename");
		const dir = this.getSingleValue("dir");
		const sizes = this.getValue("sizes");

		if (filename !== undefined && dir !== undefined && sizes !== undefined) {

			let sizeName = this.resource.display || "thumbnail";

			if (sizeName === "thumb") { // compat

				sizeName = "thumbnail";

			}

			const size = sizes.find(size => sizeName === size.name);

			if (size && size.filename) {

				return `${KarmaFieldsAlpha.uploadURL}${dir}/${size.filename}`;

			} else {

				return `${KarmaFieldsAlpha.uploadURL}${dir}/${filename}`;

			}

		}

	}

	getSrcset() {

		const value = this.getValue("sizes");
		const dir = this.getDir();

		if (value !== undefined && dir !== undefined) {

			const sizes = value.map(size => `${KarmaFieldsAlpha.uploadURL}${dir}/${size.filename} ${size.width}w`);

			return sizes.join(",");

		}

	}

	getMedia() {


		if (this.resource.exit) {

			return {icon: "exit", text: ".."};

		} else if (this.resource.uploading) {

			return {icon: "uploading", text: ""};

		} else if (this.resource.loading) {

			return {icon: "loading", text: ""};

		} else if (this.resource.mixed) {

			return {icon: "mixed", text: "[mixed]"};

		} else if (this.resource.dashicon) {

			return { dashicon: this.resource.dashicon, text: this.resource.caption };

		} else if (this.resource.svg) {

			return { svg: this.resource.svg, text: this.resource.caption };

		} else {

			// const media = {
			// 	mimetype: this.getValue("mimetype"),
			// 	filetype: this.getValue("filetype"),
			// 	name: this.getValue("name"),
			// 	filename: this.getValue("filename"),
			// 	dir: this.getValue("dir")
			// };


			const mimetype = this.getSingleValue("mimetype"),
				filetype = this.getSingleValue("filetype"),
				name = this.getSingleValue("name"),
				filename = this.getSingleValue("filename"),
				dir = this.getSingleValue("dir");

			if (mimetype === undefined || filetype === undefined || name === undefined || filename === undefined || dir === undefined) {

				return {icon: "loading", text: filename || "", loading: true};

			} else {

				const mixed = this.doAction("isMixed", "filename");

				if (mixed) {

					return { icon: "mixed", text: "[mixed]" };

				// } else if (filetype === "upload") {

				// 	return { icon: "uploading", text: filetype || "..." };

				// } else if (filetype === "") {

				// 	return {icon: "notfound", text: "no file type!"};

				// } else if (filetype === "exit") {

				// 	return { icon: "exit", text: ".." };

				// } else if (filetype === "folder" || filetype === "autofolder") {

				// 	return { icon: "folder", text: name };

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


	// *buildImage(media) {
	// 	if (media.image) {
	// 		yield {
	// 			tag: "img",
	// 			init: element => {
	// 				element.draggable = false;
	// 			},
	// 			update: element => {
	// 				if (media.src && media.src !== element.getAttribute("data-src")) {
	// 					element.src = media.src;
	// 					element.setAttribute("data-src", media.src);
	// 				}
	// 			}
	// 		}
	// 	}
	// }

	*buildImage(media) {
		if (media.image) {
			yield {
				tag: "figure",
				class: "image",
				child: {
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
	}

	*buildVideo(media) {

		if (media.video) {
			yield {
				tag: "figure",
				class: "video",
				child: {
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
				}
			};
			// yield {
			// 	tag: "video",
			// 	init: element => {
			// 		element.controls = true;
			// 	},
			// 	update: element => {
			// 		if (media.filename && media.filename !== element.getAttribute("data-src")) {
			// 			element.src = `${KarmaFieldsAlpha.uploadURL}/${encodeURI(media.filename)}`;
			// 			element.setAttribute("data-src", media.filename);
			// 		}
			// 	}
			// };
		}

	}

	*buildAudio(media) {
		if (media.audio) {
			yield {
				tag: "figure",
				class: "audio",
				child: {
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
			};
		// 	yield {
		// 		tag: "audio",
		// 		init: element => {
		// 			element.controls = true;
		// 		},
		// 		update: element => {
		// 			if (media.filename && media.filename !== element.getAttribute("data-src")) {
		// 				element.src = `${KarmaFieldsAlpha.uploadURL}/${encodeURI(media.filename)}`;
		// 				element.setAttribute("data-src", media.filename);
		// 			}
		// 		}
		// 	}
		}

	}

	*buildIcon(media) {

		if (media.icon) {

			yield {
				class: "icon",
				tag: "figure",
				// update: element => {
				// 	element.classList.toggle("hidden", !media.icon);
				// },
				children: [
					{
						update: element => {
							element.className = "";
							if (media.dashicon) {
								element.classList.add("dashicons", media.dashicon);
							} else if (media.icon) {
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
			};

		} else if (media.dashicon) {

			yield {
				class: "icon",
				tag: "figure",
				children: [
					{
						update: element => {
							element.className = `dashicons ${media.dashicon}`;
							// element.className = "";
							// element.classList.add("dashicons", media.dashicon);
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
			};

		}

	}

	*buildMedias(media) {

		yield {
			class: "media-container",
			children: this.buildIcon(media)
		}

		yield {
			class: "media-container",
			children: this.buildImage(media)
		}

		yield {
			class: "media-container",
			children: this.buildVideo(media)
		}

		yield {
			class: "media-container",
			children: this.buildAudio(media)
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
			children: this.buildMedias(media)
		};
	}
}



// KarmaFieldsAlpha.field.media2 = class extends KarmaFieldsAlpha.field {

// 	getSingleValue(key) {

// 		const value = this.getValue(key);

// 		if (value !== undefined) {

// 			return value[0] || "";

// 		}

// 	}

// 	getUrl() {

// 		const filename = this.getSingleValue("filename");
// 		const dir = this.getSingleValue("dir");
// 		const sizes = this.getValue("sizes");

// 		if (filename !== undefined && dir !== undefined && sizes !== undefined) {

// 			let sizeName = this.resource.display || "thumbnail";

// 			if (sizeName === "thumb") { // compat

// 				sizeName = "thumbnail";

// 			}

// 			const size = sizes.find(size => sizeName === size.name);

// 			if (size && size.filename) {

// 				return `${KarmaFieldsAlpha.uploadURL}${dir}/${size.filename}`;

// 			} else {

// 				return `${KarmaFieldsAlpha.uploadURL}${dir}/${filename}`;

// 			}

// 		}

// 	}

// 	getSrcset() {

// 		const value = this.getValue("sizes");
// 		const dir = this.getDir();

// 		if (value !== undefined && dir !== undefined) {

// 			const sizes = value.map(size => `${KarmaFieldsAlpha.uploadURL}${dir}/${size.filename} ${size.width}w`);

// 			return sizes.join(",");

// 		}

// 	}

// 	build() {


// 	}

// 	getMedia() {

// 		if (this.resource.exit) {

// 			return { dashicon: "dashicons-open-folder", text: ".." };

// 		// } else if (this.resource.uploading) {

// 		// 	return {icon: "uploading", text: ""};

// 		} else if (this.resource.loading) {

// 			return { loading: true, text: "" };

// 		} else if (this.resource.mixed) {

// 			return {mixed: true, text: "[mixed]"};

// 		} else if (this.resource.dashicon) {

// 			return { dashicon: this.resource.dashicon, text: this.resource.caption };

// 		} else if (this.resource.svg) {

// 			return { svg: this.resource.svg, text: this.resource.caption };

// 		} else {

// 			const mimetype = this.getSingleValue("mimetype"),
// 				filetype = this.getSingleValue("filetype"),
// 				name = this.getSingleValue("name"),
// 				filename = this.getSingleValue("filename"),
// 				dir = this.getSingleValue("dir");

// 			if (mimetype === undefined || filetype === undefined || name === undefined || filename === undefined || dir === undefined) {

// 				return { text: filename || "", loading: true };

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
// 									mimetype,
// 									filename,
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

// 	*buildImage() {

// 		const filetype = this.getSingleValue("filetype");

// 		if (filetype === "file") {

// 			const mimetype = this.getSingleValue("mimetype");

// 			if (mimetype === "image/jpeg" || mimetype === "image/png" || mimetype === "image/webp") {

// 				const src = this.getUrl();

// 				if (src) {

// 					yield {
// 						tag: "figure",
// 						class: "image",
// 						child: {
// 							tag: "img",
// 							init: element => {
// 								element.draggable = false;
// 							},
// 							update: element => {
// 								if (src !== element.getAttribute("data-src")) {
// 									element.src = src;
// 									element.setAttribute("data-src", src);
// 								}
// 							}
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
// 			children: [
// 				{
// 					class: "media-container",
// 					children: this.buildIcon()
// 				},
// 				{
// 					class: "media-container",
// 					children: this.buildImage()
// 				},
// 				{
// 					class: "media-container",
// 					children: this.buildVideo()
// 				},
// 				{
// 					class: "media-container",
// 					children: this.buildAudio()
// 				}
// 			]
// 		};
// 	}
// }

KarmaFieldsAlpha.field.gallery.media = class extends KarmaFieldsAlpha.field.media {

	constructor(resource, id, parent) {

		super({
			display: "thumb",
			...resource
		}, id, parent);

	}

	getValue(key) {

		return this.parent.getValue(key, this.resource.index);

	}

	setValue(value, key) {

		this.parent.setValue(value, key, this.resource.index);

	}


	// getSingleValue(key) {

	// 	const value = this.getValue(key);

	// 	if (value !== undefined) {

	// 		return value[0] || "";

	// 	}

	// }

	doAction(action, ...args) {

		switch (action) {

			case "delete":
			case "remove":
				this.parent.doAction("delete", this.index, 1);
				break;

			case "open":
				this.parent.doAction("open", this.index, 1);
				break;

			case "hasSelection":
			case "isSelected":
				return this.parent.isSelected(this.index);


			default:
				return super.doAction(action, ...args)

		}

	}

}
