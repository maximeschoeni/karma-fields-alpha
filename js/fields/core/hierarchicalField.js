
KarmaFieldsAlpha.fields.hierarchicalField = class extends KarmaFieldsAlpha.fields.queryField {

  constructor(resource, domain) {
    super(resource, domain);

		this.children = [];

    if (this.resource.children) {
  		for (let i = 0; i < this.resource.children.length; i++) {
  			this.createChild(this.resource.children[i], this.domain);
  		}
  	}

  }

  addChild(child) {
    this.children.push(child);
    child.parent = this;
  }

  addChildren(children) {
    this.children = children;
    for (let i = 0; i < children.length; i++) {
      children[i].parent = this;
    }
  }

  createChild(resource) {
    let child = this.createField(resource);
    this.addChild(child);
    return child;
  }

  getDescendant(key) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].resource.key === key) {
        return this.children[i];
      } else if (!this.children[i].resource.key) {
        const child = this.children[i].getDescendant(key);
        if (child) {
          return child;
        }
      }
    }
  }

};
