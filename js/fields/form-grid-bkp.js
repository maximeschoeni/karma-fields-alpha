
KarmaFieldsAlpha.fields.formGrid = class extends KarmaFieldsAlpha.fields.formHistory {

  async dispatch(event, parent) {

    switch (event.action) {

      case "set":
        if (event.target.resource.type === "input" && event.pasted) {

          const data = event.getValue().split(/[\r\n]/).map(row => row.split("\t"));

          if (data.length > 1 || data[0].length > 1) {

            await this.dispatch(this.createEvent({
              action: "importselection",
              data: data,
              field: event.target
            }));

            break;

          }

        }

        await super.dispatch(event);


        // -> render controls + interface
        await super.dispatch(this.createEvent({
          action: "edit-grid",
          request: event
        }));

        break;

      default:
        await super.dispatch(event);
        break;

    }

    // if (event.action === "set" && event.target.type === "input" && event.pasted) {
    //
    //   const data = event.getValue().split(/[\r\n]/).map(row => row.split("\t"));
    //
    //   if (data.length > 1 || data[0].length > 1) {
    //
    //     await this.dispatch(this.createEvent({
    //       action: "importselection",
    //       data: data,
    //       field: event.target
    //     }));
    //
    //   } else {
    //
    //     await super.dispatch(event);
    //
    //   }
    //
    // } else {
    //
    //   await super.dispatch(event);
    //
    // }

    // if (event.splash) {
    //   // event.splash = false;
    //   // await this.splash(event);
    //   for (let child of this.children) {
    //     if (child !== parent) {
    //       await child.splash(event);
    //     }
    //   }
    // }

    return event;
  }

}
