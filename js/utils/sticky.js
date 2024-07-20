


KarmaFieldsAlpha.Sticky = class {


  constructor(modal, body, table) {

    const header = body.previousElementSibling;
    const footer = body.nextElementSibling;

    // const onscroll = event => {
    //
    //   if (!document.contains(modal)) {
    //
    //     document.removeEventListener("scroll", onscroll);
    //
    //   } else {
    //
    //     this.update();
    //
    //   }
    //
    // }
    //
    //
    // document.addEventListener("scroll", onscroll);

  }

  


}


KarmaFieldsAlpha.registerStickyModal = (modal, body, table) => {

  new KarmaFieldsAlpha.Sticky(modal, body, table);

}
