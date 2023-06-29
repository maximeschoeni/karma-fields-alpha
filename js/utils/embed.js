

KarmaFieldsAlpha.Embed = class {

  static add(resource, element) {

    this.elements.set(element, resource);

  }

  

  static async build() {

    for (const [element, resource] of this.map) {

      await KarmaFieldsAlpha.build(resource, element, element.firstElementChild);

    }

  }

}

KarmaFieldsAlpha.Embed.map = new Map();
