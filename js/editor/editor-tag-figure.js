KarmaFieldsAlpha.Editor.Tag.FIGURE = class extends KarmaFieldsAlpha.Editor.Tag.container {

	// is(name) {
	//
	// 	return name === "list" || super.is(name);
	//
	// }

	isValidIn(container) {

		return container.is("DIV");

	}


	sanitizeChild(tag) {

		if (tag.getType() === "text" || tag.getType() === "inline") {

			this.node.removeChild(tag.node);

		} else if (tag.getType() === "block" && !tag.isValidIn(this)) {

			this.node.removeChild(tag.node);

		} else if (!tag.isValidIn(this)) {

			super.sanitizeChild(tag);

		}

	}

	breakLine(shift, beam) {

		if (this.editor.beam.startContainer === this.node && this.editor.beam.startOffset === 0) {

			const block = this.createTag("P");

			block.node.appendChild(document.createElement("br"));

			this.editor.beam.setStartBefore(this.node);
			this.editor.beam.collapse(true);
			this.editor.beam.insertNode(block.node);
			this.editor.beam.setStart(block.node, 0);
			this.editor.beam.collapse(true);

		} else {

			let figcaption = this.node.querySelector("figcaption");

			if (!figcaption) {

				figcaption = document.createElement("figcaption");
				figcaption.appendChild(document.createElement("br"));
				this.node.appendChild(figcaption);

			}

			this.editor.beam.setStart(figcaption, 0);
			this.editor.beam.collapse(true);

		}

	}

}

KarmaFieldsAlpha.Editor.register("FIGURE", KarmaFieldsAlpha.Editor.Tag.FIGURE);


KarmaFieldsAlpha.Editor.Tag.FIGCAPTION = class extends KarmaFieldsAlpha.Editor.Tag.block {

	isValidIn(container) {

		return container.is("FIGURE") && Boolean(this.node.previousSibling);

	}

}
KarmaFieldsAlpha.Editor.register("FIGCAPTION", KarmaFieldsAlpha.Editor.Tag.FIGCAPTION);


KarmaFieldsAlpha.Editor.Tag.IMG = class extends KarmaFieldsAlpha.Editor.Tag.element {

	isValidIn(container) {

		return container.is("FIGURE");

	}

	isSingle() {

		return true;

	}

	isValid() {

		return true;

	}

	isValidAttribute(key, value) {

		// return key === "width" || key === "height" || key === "src" || key === "srcset" || key === "sizes" || key === "alt" || key === "title" || key === "data-id";

		switch (key) {
			case "width":
			case "height":
			case "src":
			case "srcset":
			case "sizes":
			case "alt":
			case "title":
			case "data-id":
				return true;
		}

		return false;
	}

}
KarmaFieldsAlpha.Editor.register("IMG", KarmaFieldsAlpha.Editor.Tag.IMG);
