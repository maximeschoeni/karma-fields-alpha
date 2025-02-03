KarmaFieldsAlpha.Editor.Tag.list = class extends KarmaFieldsAlpha.Editor.Tag.container {

	is(name) {

		return name === "list" || super.is(name);

	}

	isValidIn(container) {

		return container.is("DIV");

	}

	// toggle_BKP(tagName) {
	//
	// 	const tags = this.editor.query(tagName);
	//
	// 	if (tags.length) {
	//
	// 		const nodes = [];
	//
	// 		for (let tag of tags) {
	//
	// 			nodes.push(...tag.node.children);
	//
	// 			// tag.node.remove();
	// 			this.editor.beam.selectNode(tag.node);
	// 			this.editor.beam.deleteContents();
	// 			// this.editor.beam.setStartAfter(tag);
	// 			// this.editor.beam.collapse(true);
	//
	// 		}
	//
	// 		const origin = this.editor.beam.cloneRange();
	//
	// 		for (let node of nodes) {
	//
	// 			const p = document.createElement("p");
	// 			const range = new Range();
	// 			range.selectNodeContents(node);
	// 			const content = range.extractContents();
	// 			p.appendChild(content);
	// 			this.editor.beam.insertNode(p);
	// 			this.editor.beam.collapse(false);
	//
	// 		}
	//
	// 		this.editor.beam.setStart(origin.startContainer, origin.startOffset);
	//
	// 		this.editor.Beam.shrinkUp(this.editor.beam);
	//
	// 	} else {
	//
	// 		const nodes = [];
	//
	// 		const blocks = this.editor.query("block");
	//
	// 		for (let block of blocks) {
	//
	// 			const content = block.extractContent();
	//
	// 			const li = document.createElement("li");
	// 			li.appendChild(content);
	//
	// 			nodes.push(li);
	//
	// 			this.editor.beam.selectNode(block.node);
	// 			this.editor.beam.deleteContents();
	//
	// 		}
	//
	// 		while (!this.getTag(this.editor.beam.endContainer).isRoot()) {
	//
	// 			this.editor.beam.setEndAfter(this.editor.beam.endContainer);
	// 			this.editor.beam.collapse(false);
	//
	// 		}
	//
	// 		const ul = this.editor.createTag(tagName);
	//
	// 		for (let node of nodes) {
	//
	// 			ul.node.appendChild(node);
	//
	// 		}
	//
	// 		this.editor.beam.insertNode(ul.node);
	//
	// 		this.editor.beam.selectNodeContents(ul.node);
	//
	// 	}
	//
	// }

	toggle(tagName) {

		const tags = this.editor.query(tagName);

		const range = this.editor.beam.cloneRange();

		if (tags.length) {

			const nodes = [];

			for (let tag of tags) {

				nodes.push(...tag.node.children);

				range.selectNode(tag.node);
				range.deleteContents();

			}

			const origin = this.editor.beam.cloneRange();

			for (let node of nodes) {

				const p = this.editor.transformNode(node, "p");

				range.insertNode(p);
				range.collapse(false);

				this.editor.beam.setEndAfter(p);

			}

		} else {

			const nodes = [];

			const blocks = this.editor.query("block");

			for (let block of blocks) {

				const content = block.extractContent();

				const li = document.createElement("li");
				li.appendChild(content);

				nodes.push(li);

				range.selectNode(block.node);
				range.deleteContents();

			}

			while (!this.getTag(range.endContainer).isRoot()) {

				range.setEndAfter(range.endContainer);
				range.collapse(false);

			}

			const ul = this.editor.createTag(tagName);

			for (let node of nodes) {

				ul.node.appendChild(node);

			}

			this.editor.beam.insertNode(ul.node);

			// this.editor.beam.selectNodeContents(ul.node);

		}

	}

	sanitizeChild(tag) {

		if (tag.getType() === "text" || tag.getType() === "inline") {

			const li = this.createTag("LI");

			if (tag.node.parentNode) {

				tag.node.parentNode.insertBefore(li.node, tag.node);

			}

			li.node.appendChild(tag.node);

		} else if (tag.getType() === "block" && !tag.isValidIn(this)) {

			tag.transform("LI", {});

		} else if (!tag.isValidIn(this)) {

			super.sanitizeChild(tag);

		}

	}

	// insertBlock(...tags) {
	//
	// 	while (this.editor.beam.endContainer !== this.node) {
	//
	// 		this.editor.beam.setEndAfter(this.editor.beam.endContainer);
	//
	// 	}
	//
	// 	const contentAfter = this.editor.beam.extractContents();
	// 	const tagAfter = this.getTag(contentAfter);
	// 	tagAfter.sanitize();
	//
	// 	for (let tag of tags) {
	//
	// 		this.editor.beam.insertNode(tag.node);
	// 		this.editor.beam.collapse(false);
	//
	// 		this.sanitizeChild(tag);
	//
	// 	}
	//
	// 	tagAfter.trim();
	//
	// 	if (!tagAfter.isEmpty()) {
	//
	// 		this.editor.beam.insertNode(tagAfter.node);
	// 		this.editor.beam.collapse(true);
	//
	// 	}
	//
	// 	this.sanitize();
	//
	// 	this.editor.Beam.growUpStart(this.editor.beam);
	// 	this.editor.beam.collapse(true);
	//
	// }

	//
	// wrap(tag) {
	//
	// 	const ul = this.constructor.createBrick(tag);
	//
	// 	let range = this.constructor.range;
	// 	const container = this.getBrick(range.commonAncestorContainer);
	//
	// 	const blocks = this.constructor.getSelectedBricks.filter(brick => brick.block && !brick.isEmpty());
	//
	// 	range.deleteContents();
	//
	// 	if (range.collapsed || !blocks.length) {
	//
  //     const li = document.createElement("li");
  //     const br = document.createElement("br");
  //     li.appendChild(br);
	// 		ul.node.appendChild(li);
	//
	// 		container.insert(ul);
	//
  //     range.setStart(li, 0);
  //     range.collapse(true);
	//
  //   } else {
	//
	// 		range.deleteContents();
	//
	// 		for (let block of blocks) {
	//
	// 			const li = this.container.createBrick("li", null, block);
	//
  //       // const li = document.createElement("li");
	// 			//
  //       // while (block.firstChild) {
	// 			//
  //       //   li.appendChild(block.firstChild);
	// 			//
  //       // }
	//
	// 			ul.node.appendChild(li);
	//
	// 			block.node.remove();
	//
  //     }
	//
	// 		container.insert(ul);
	//
  //   }
	//
	// 	container.sanitize();
	//
  // }
	//
	// unwrap() {
	//
	// 	let range = this.constructor.range;
	//
	// 	range.setStartAfter(this.node);
	// 	range.collapse(true);
	//
	// 	const cloneRange = range.cloneRange();
	//
  //   // const paragraphs = [];
	//
	// 	for (let li of this.node.childNodes) {
	//
  //     // let p = document.createElement("p");
	// 		//
  //     // while (li.firstChild) {
	// 		//
  //     //   p.appendChild(li.firstChild);
	// 		//
  //     // }
	//
	// 		let p = this.constructor.createBrick("p", null, li);
	//
	// 		// paragraphs.push(p);
	//
	// 		this.insert(p);
	//
	// 		range.collapse(false);
	//
  //   }
	//
	// 	this.getParent().sanitize();
	//
	// 	// this.node.remove();
	//
  //   // if (paragraphs.length) {
	// 	//
	// 	// 	range.setStartBefore(paragraphs[0]);
	// 	//
  //   // }
	//
	// 	range.setStart(cloneRange.startContainer, cloneRange.startOffset);
	//
	// 	this.constructor.spoil();
	//
  // }

	// insert(brick) {
	//
	// 	let range = this.constructor.range;
	//
	// 	if (brick.isValidIn(this)) {
	//
	// 		super.insert(brick);
	//
	// 	} else {
	//
	// 		const contentAfter = this.extractAfter();
	//
	// 		this.range.setStartAfter(this.node);
	//
	// 		const container = this.getBrick(range.startContainer);
	//
	// 		// range.setEndAfter(this.node);
	// 		// const content = range.extractContents(); // -> to verify: range must collapse to deeper container!
	// 		// const container = this.getBrick(range.startContainer);
	//
	// 		container.insert(brick);
	//
	// 		if (!contentAfter.isEmpty()) {
	//
	// 			container.insert(contentAfter);
	//
	// 		}
	//
	// 	}
	//
	// }

}

KarmaFieldsAlpha.Editor.register("UL", KarmaFieldsAlpha.Editor.Tag.list);
KarmaFieldsAlpha.Editor.register("OL", KarmaFieldsAlpha.Editor.Tag.list);


KarmaFieldsAlpha.Editor.Tag.LI = class extends KarmaFieldsAlpha.Editor.Tag.block {

	isValidIn(container) {

		return container.is("list");

	}

	breakLine(shift, beam) {

		if (shift) {

			super.breakLine(shift, beam);

		} else {

			const container = this.getContainer();

			let contentBefore = this.extractBefore(this.editor.beam);

			if (contentBefore.isEmpty() && this.node === container.node.firstChild) {

				const block = this.createTag("P");

				block.node.appendChild(document.createElement("br"));

				this.editor.beam.setStartBefore(container.node);
				this.editor.beam.collapse(true);
				this.editor.beam.insertNode(block.node);
				this.editor.beam.collapse(false);

				if (this.isEmptyBlock()) {

					this.empty();

					this.node.appendChild(document.createElement("br"));

					this.editor.beam.setStart(this.node, 0);

				}

				this.editor.beam.setStart(this.node, 0);

			} else if (contentBefore.isEmpty() && this.node === container.node.lastChild) {

				const block = this.createTag("P");
				const contentAfter = this.extractAfter(beam);

				if (contentAfter.isEmpty()) {

					block.node.appendChild(document.createElement("br"));

				} else {

					block.node.appendChild(contentAfter.node);

				}

				this.editor.beam.setStartAfter(container.node);
				this.editor.beam.collapse(true);
				this.editor.beam.insertNode(block.node);
				this.editor.beam.setStart(block.node, 0);

				this.node.remove();

			} else {

				const contentAfter = this.extractAfter(beam);

				const block = this.editor.createTag("LI");

				if (contentBefore.isEmpty()) {

					this.empty();
					this.node.appendChild(document.createElement("br"));

				} else {

					this.node.appendChild(contentBefore.node);

				}

				if (contentAfter.isEmpty()) {

					block.node.appendChild(document.createElement("br"));

				} else {

					block.node.appendChild(contentAfter.node);

				}

				this.editor.beam.setStartAfter(this.node);
				this.editor.beam.collapse(true);
				this.editor.beam.insertNode(block.node);
				this.editor.beam.setStart(block.node, 0);

			}

		}

		this.editor.Beam.shrinkUpStart(this.editor.beam);

		this.editor.beam.collapse(true);

	}

}

KarmaFieldsAlpha.Editor.register("LI", KarmaFieldsAlpha.Editor.Tag.LI);
