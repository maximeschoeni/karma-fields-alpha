KarmaFieldsAlpha.Layer = class {

  constructor(name) {

    this.name = name;
    this.active = false;
    this.z = 0;

    const resources = KarmaFieldsAlpha.saucer.resource.tables;

    this.resource = resources[name];

  }

  open(name) {

    const layers = KarmaFieldsAlpha.Store.get("layers") || [];

    let layer = layers.find(layer => layer.name === name);

    if (!layer) {

      layer = new KarmaFieldsAlpha.Layer(name);

      KarmaFieldsAlpha.Store.set([...layers, layer], "layers");

    }

    layer.active = true;
    layer.z = layers.reduce((z, layer) => Math.max(z, layer.z), 0) + 1;

    this.setState();


  }



}
