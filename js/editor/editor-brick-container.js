KarmaFieldsAlpha.Editor.Brick.container = class extends KarmaFieldsAlpha.Editor.Brick {

	constructor(node) {

		super(node);

		this.type = "container";

  }

	isValid() {

		return this.node.hasChildNodes();

	}

	breakLine(shift) {

		//?

		return;



		let range = this.range;
		let container = this.getContainer();

		range.setStart(this.node, 0);
		const contentBefore = range.cloneContents();
		contentBefore.normalize();

		const block = document.createElement("p");
		block.appendChild(document.createElement("br"));

		if (!contentBefore.hasChildNodes()) {

			range.setStartBefore(container.node);
			range.collapse(true);
			range.insertNode(block);
			range.setStart(this.node, 0);
			range.collapse(true);

		} else {

			range.setStartAfter(container.node);
			range.collapse(true);
			range.insertNode(block);
			range.setStart(block, 0);
			range.collapse(true);

		}

		this.constructor.dirty = true;

	}





}


KarmaFieldsAlpha.Editor.Brick.DIV = class extends KarmaFieldsAlpha.Editor.Brick.container {

	constructor(node {

		super(node);

		this.root = true;

  }

	reset() {

		this.empty();

		const p = document.createElement("p");
		p.appendChild(document.createElement("br"));

		this.node.appendChild(p);

	}


	breakLine(shift) {
		 // ?
	}

	// insertInline(inline, range) {
	//
	// 	const p = document.createElement("p");
	// 	p.appendChild(inline.node);
	//
	// 	range.insertNode(p);
	//
	// }

	insert(doll) {

		let range = this.constructor.range;

		if (doll.type === "text" || doll.type === "inline" || doll.type === "single") {

			const p = this.constructor.createBrick("P");

			p.node.appendChild(doll.node);
			
			this.range.insertNode(p);

		} else if (doll.type === "block" && !doll.isValidIn(this)) {

			const p = this.constructor.createBrick("P", null, doll.node);

			this.range.insertNode(p.node);

		} else if (doll.isValidIn(this)) {

			this.range.insertNode(doll.node);

		}

		this.sanitize();

	}

}

KarmaFieldsAlpha.Editor.Brick.root = class extends KarmaFieldsAlpha.Editor.Brick.DIV {



}
