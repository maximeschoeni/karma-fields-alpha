

KarmaFieldsAlpha.fields.tablePagination = class TablePagination extends KarmaFieldsAlpha.fields.field {

  // constructor(resource, domain, parent) {
  //   super(resource, domain, parent);
  //

  initField() {

    this.page = new KarmaFieldsAlpha.fields.field({
      key: "page",
      value: 1
    }, this, this);
    // this.page.datatype = "number";
    // this.page.setValue(1);

    this.ppp = new KarmaFieldsAlpha.fields.field({
      key: "ppp",
      value: this.resource.ppp || 50
    }, this, this);
    // this.ppp.datatype = "number";
    // this.ppp.setValue(resource.ppp || 50);

    this.count = new KarmaFieldsAlpha.fields.field({
      key: "count",
      value: 0
    }, this, this);
    // this.count.datatype = "number";
    //
    // this.addChildren(this.page, this.ppp, this.count);

  }

  getValue() {
    return {
      page: this.page.getValue(),
      ppp: this.ppp.getValue()
    };
  }

  getValueAsync() {
    return this.super.getValueAsync().then(function(value) {
      value.count = undefined;
    });
  }

  // setValue(value, context) {
  //   this.page.setValue(value.page || 1);
  //   this.ppp.setValue(value.ppp || this.resource.ppp, context);
  // }

  build() {
    const field = this;

    return {
      class: "footer-group table-pagination",
      update: function() {

        this.children = [
          // {
          //   class: "footer-item",
          //   update: function() {
          //     let num = field.count.getValue();
          //     this.element.textContent = num ? num + " items" : "";
          //   }
          // },
          {
            class: "ppp-selector footer-item",
            init: function() {
              this.element.tabIndex = "-1"; // for safari
            },
            children: [
              {
                tag: "button",
                class: "karma-button current-page footer-item",
                update: function() {
                  let num = field.count.getValue();
                  this.element.textContent = num ? num + " items" : "";
                }
              },
              {
                class: "ppp-selector-options",
                child: {
                  tag: "ul",
                  children: [
                    {
                      tag: "li",
                      child: {
                        tag: "label",
                        init: function() {
                          this.element.textContent = "Items per page";
                        }
                      },
                    }
                  ].concat([
                    {key: 100, value: "100"},
                    {key: 200, value: "200"},
                    {key: 500, value: "500"},
                    {key: 0, value: "all"}
                  ].map(function(item) {
                    // return {
                    //   tag: "li",
                    //   update: function(li) {
                    //     const button = new KarmaFieldsAlpha.fields.tableControls.button({
                    //       name: item.value
                    //     });
                    //
                    //     button.update = element => {
                    //       button.onLoad = loading => {
                    //         element.classList.toggle("loading", loading);
                    //       }
                    //       field.ppp.getValueAsync().then(function(value) {
                    //         element.classList.toggle("active", value == item.key);
                    //       });
                    //       element.onclick = async (event) => {
                    //         await button.load(
                    //           field.ppp.saveValue(item.key, false, false)
                    //         );
                    //         // element.blur();
                    //         document.activeElement.blur(); // for safari
                    //       }
                    //     }
                    //     li.child = button.build();
                    //   }
                    // };
                    return {
                      tag: "li",
                      update: function(li) {
                        const button = new KarmaFieldsAlpha.fields.tableControls.button({
                          name: item.value
                        });

                        button.update = element => {
                          button.onLoad = loading => {
                            element.classList.toggle("loading", loading);
                          }
                          const value = field.ppp.getValue();
                          element.classList.toggle("active", value == item.key);
                          element.onclick = (event) => {
                            field.ppp.setValue(item.key);
                            button.load(
                              // field.ppp.saveValue(item.key, false, false)
                              field.bubble("change", field.ppp, item.key)
                            );


                            // element.blur();
                            document.activeElement.blur(); // for safari
                          }
                        }
                        li.child = button.build();
                      }
                    };
                  }))
                }
              }
            ]
          },
          {
            tag: "button",
            class: "karma-button footer-item",
            init: function(button) {
              this.element.innerText = "«";
              this.element.addEventListener("click", async function() {
                const page = field.page.getValue();
                if (page > 0) {
                  // field.page.setValue(1);
                  // button.element.classList.add("loading");
                  // field.triggerEvent("change", true).then(function() {
                  //   button.element.classList.remove("loading");
                  //   // field.triggerEvent("render");
                  // });
                  button.element.classList.add("loading");
                  field.page.setValue(1);
                  console.log(field.parent);
                  await field.parent.query();

                  button.element.classList.remove("loading");

                  // field.page.changeValue(1).then(function() {
                  //   button.element.classList.remove("loading");
                  // });
                }
              });
            },
            update: function() {
              const count = field.count.getValue();
              const page = field.page.getValue();
              const ppp = field.ppp.getValue();

              this.element.style.display = ppp > 0 && count > ppp ? "block" : "none";
              this.element.disabled = (page == 1);
            }
          },
          {
            tag: "button",
            class: "karma-button footer-item",
            init: function(button) {
              this.element.innerText = "‹";
              this.element.addEventListener("click", function() {
                const page = field.page.getValue();
                if (page > 0) {
                  // field.page.setValue(page - 1);
                  // button.element.classList.add("loading");
                  // field.triggerEvent("change", true).then(function() {
                  //   button.element.classList.remove("loading");
                  //   // field.triggerEvent("render");
                  // });
                  button.element.classList.add("loading");
                  field.page.changeValue(page-1).then(function() {
                    button.element.classList.remove("loading");
                  });
                }
              });
            },
            update: function() {
              const count = field.count.getValue();
              const page = field.page.getValue();
              const ppp = field.ppp.getValue();

              this.element.style.display = ppp > 0 && count > ppp ? "block" : "none";
              this.element.disabled = (page === 1);
            }
          },
          // {
          //   class: "ppp-selector footer-item",
          //   children: [
          //     {
          //       tag: "button",
          //       class: "karma-button current-page footer-item",
          //       update: function() {
          //         const count = field.count.getValue();
          //         const page = field.page.getValue();
          //         const ppp = field.ppp.getValue();
          //
          //         this.element.style.display = count > ppp ? "block" : "none";
          //         this.element.textContent = count && page+" / "+Math.ceil(count/ppp) || "";
          //       }
          //     },
          //     {
          //       class: "ppp-selector-options",
          //       child: {
          //         tag: "ul",
          //         children: [
          //           {
          //             tag: "li",
          //             child: {
          //               tag: "label",
          //               init: function() {
          //                 this.element.textContent = "Items per page";
          //               }
          //             },
          //           }
          //         ].concat([
          //           {key: 50, value: "50"},
          //           {key: 100, value: "100"},
          //           {key: 200, value: "200"},
          //           {key: 0, value: "all"}
          //         ].map(function(item) {
          //           return {
          //             tag: "li",
          //             child: {
          //               tag: "button",
          //               class: "karma-button",
          //               init: function(button) {
          //                 this.element.textContent = item.value;
          //                 this.element.onclick = function() {
          //                   field.ppp.setValue(item.key);
          //                   button.element.classList.add("loading");
          //                   field.triggerEvent("change", true).then(function() {
          //                     button.element.classList.remove("loading");
          //                     button.element.blur();
          //                   });
          //                 }
          //               },
          //               child: {
          //                 class: "karma-field-spinner"
          //               }
          //             }
          //           };
          //         }))
          //       }
          //     }
          //   ]
          // },
          {
            class: "current-page footer-item",
            update: function() {
              const count = field.count.getValue();
              const page = field.page.getValue();
              const ppp = field.ppp.getValue();

              this.element.style.display = ppp > 0 && count > ppp ? "block" : "none";
              this.element.textContent = count && page+" / "+Math.ceil(count/ppp) || "";
            }
          },
          {
            tag: "button",
            class: "karma-button footer-item",
            init: function(button) {
              this.element.innerText = "›";
              this.element.addEventListener("click", async function() {
                const count = field.count.getValue();
                const page = field.page.getValue();
                const ppp = field.ppp.getValue();
                const numPage = Math.ceil(count/ppp);

                if (page < numPage) {
                  // field.page.setValue(page+1);
                  // button.element.classList.add("loading");
                  // field.triggerEvent("change", true).then(function() {
                  //   button.element.classList.remove("loading");
                  //   // field.triggerEvent("render");
                  // });

                  button.element.classList.add("loading");
                  field.page.setValue(page+1);
                  await field.parent.query();
                  await field.parent.content.update();

                  button.element.classList.remove("loading");

                  // button.element.classList.add("loading");
                  // field.page.changeValue(page+1).then(function() {
                  //   button.element.classList.remove("loading");
                  // });
                }
              });
            },
            update: function() {
              const count = field.count.getValue();
              const page = field.page.getValue();
              const ppp = field.ppp.getValue();
              const numPage = Math.ceil(count/ppp);

              this.element.style.display = ppp > 0 && count > ppp ? "block" : "none";
              this.element.disabled = page >= numPage;
            }
          },
          {
            tag: "button",
            class: "karma-button footer-item",
            init: function(button) {
              this.element.innerText = "»";
              this.element.addEventListener("click", function() {
                const count = field.count.getValue();
                const page = field.page.getValue();
                const ppp = field.ppp.getValue();
                const numPage = Math.ceil(count/ppp);

                if (page < numPage) {
                  // field.page.setValue(numPage);
                  // button.element.classList.add("loading");
                  // field.triggerEvent("change", true).then(function() {
                  //   button.element.classList.remove("loading");
                  //   // field.triggerEvent("render");
                  // });
                  button.element.classList.add("loading");
                  field.page.changeValue(numPage).then(function() {
                    button.element.classList.remove("loading");
                  });
                }
              });
            },
            update: function(button) {
              const count = field.count.getValue();
              const page = field.page.getValue();
              const ppp = field.ppp.getValue();
              const numPage = Math.ceil(count/ppp);

              this.element.style.display = ppp > 0 && count > ppp ? "block" : "none";
              this.element.disabled = page >= numPage;
            }
          }
        ];
      }
    };
  }
}
