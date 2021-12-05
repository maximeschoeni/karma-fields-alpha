



KarmaFieldsAlpha.fields.table.title = class {
  build() {
    return {
      tag: "h1",
      init: h1 => {
        h1.element.textContent = this.table.resource.title || "Table";
      }
    };
  }
}

KarmaFieldsAlpha.fields.table.close = class {
  build() {
    return {
      class: "header-item",
      child: {
        tag: "button",
        class: "karma-button",
        init: button => {
          button.element.title = this.resource.title || "Close Table";
          button.element.innerHTML = '<span class="button-content">×</span>';
          button.element.onclick = async () => {
            button.element.classList.add("loading");
            KarmaFieldsAlpha.Nav.backup();
            KarmaFieldsAlpha.Nav.setParamString("");
            await this.table.editParam();
            button.element.classList.remove("loading");
          }
        }
      }
    };
  }
}

KarmaFieldsAlpha.fields.table.pagination = class {
  build() {
    return {
      class: "table-pagination",
      update: async container => {
        container.element.classList.add("loading");
        await (this.table.queryPromise || this.table.query());
        const count = this.table.getCount() || 0;
        const ppp = parseInt(this.table.getPpp());
        container.element.classList.toggle("hidden", count <= ppp);
        container.element.classList.remove("loading");
      },
      children: ["firstPage", "prevPage", "currentPage", "nextPage", "lastPage"].map(resource => this.table.getButton(resource).build())
    };
  }
}

KarmaFieldsAlpha.fields.table.firstPage = class {

  build() {
    return {
      tag: "button",
      class: "karma-button",
      init: (button) => {
        button.element.title = this.resource.title || "First Page";
        button.element.innerHTML = '<span class="button-content">«</span>';
      },
      update: button => {
        const count = this.table.getCount();
        const page = this.table.getPage();
        const ppp = this.table.getPpp();

        // button.element.classList.toggle("hidden", ppp < 1 || page === 1);
        button.element.disabled = page === 1;
        button.element.onclick = async (event) => {
          if (page > 0) {
            button.element.classList.add("loading");
            KarmaFieldsAlpha.Nav.backup();
            KarmaFieldsAlpha.Nav.setParam("page", 1);
            await this.table.editParam();
            // await this.table.render();
            button.element.blur();
            button.element.classList.remove("loading");
          }
        }
      }
    }
  }
}

KarmaFieldsAlpha.fields.table.prevPage = class {
  build() {
    return {
      tag: "button",
      class: "karma-button",
      init: (button) => {
        button.element.title = this.resource.title || "Previous Page";
        button.element.innerHTML = '<span class="button-content">‹</span>';
      },
      update: button => {
        const count = this.table.getCount();
        const page = this.table.getPage();
        const ppp = this.table.getPpp();

        button.element.disabled = (page === 1);
        button.element.onclick = async (event) => {
          if (page > 0) {
            button.element.classList.add("loading");
            KarmaFieldsAlpha.Nav.backup();
            KarmaFieldsAlpha.Nav.setParam("page", page-1);
            await this.table.editParam();
            button.element.blur();
            button.element.classList.remove("loading");
          }
        }
      }
    }
  }
}

KarmaFieldsAlpha.fields.table.nextPage = class {
  build() {
    return {
      tag: "button",
      class: "karma-button",
      init: (button) => {
        button.element.title = this.resource.title || "Next Page";
        button.element.innerHTML = '<span class="button-content">›</span>';
      },
      update: button => {
        const count = this.table.getCount();
        const page = this.table.getPage();
        const ppp = this.table.getPpp();
        const numPage = Math.ceil(count/ppp);

        // button.element.classList.toggle("hidden", ppp < 1 || page >= numPage);
        button.element.disabled = page >= numPage;

        button.element.onclick = async (event) => {
          if (page < numPage) {
            button.element.classList.add("loading");
            KarmaFieldsAlpha.Nav.backup();
            KarmaFieldsAlpha.Nav.setParam("page", page+1);
            await this.table.editParam();
            button.element.blur();
            button.element.classList.remove("loading");
          }
        }
      }
    }
  }
}

KarmaFieldsAlpha.fields.table.lastPage = class {
  build() {
    return {
      tag: "button",
      class: "karma-button",
      init: (button) => {
        button.element.title = this.resource.title || "Last Page";
        button.element.innerHTML = '<span class="button-content">»</span>';
      },
      update: button => {
        const count = this.table.getCount();
        const page = this.table.getPage();
        const ppp = this.table.getPpp();
        const numPage = Math.ceil(count/ppp);

        // button.element.classList.toggle("hidden", ppp < 1 || page >= numPage);
        button.element.disabled = page >= numPage;

        button.element.onclick = async (event) => {
          if (page < numPage) {
            button.element.classList.add("loading");

            KarmaFieldsAlpha.Nav.backup();
            KarmaFieldsAlpha.Nav.setParam("page", numPage);
            await this.table.editParam();
            button.element.blur();
            button.element.classList.remove("loading");
          }
        }
      }
    }
  }
}

KarmaFieldsAlpha.fields.table.currentPage = class {
  build() {
    return {
      class: "current-page header-item",
      update: item => {
        const count = this.table.getCount();
        const page = this.table.getPage();
        const ppp = this.table.getPpp();
        const numPage = Math.ceil(count/ppp);

        item.element.classList.toggle("hidden", ppp < 1 || count < ppp);
        item.element.textContent = count && page+" / "+numPage || "";
      }
    };
  }
}

KarmaFieldsAlpha.fields.table.total = class {

  build() {
    return {
      class: "total-items header-item",
      init: item => {
        this.renderItemTotal = item.render;
        item.element.tabIndex = "-1"; // for safari
      },
      update: async item => {
        item.element.classList.add("loading");
        await (this.table.queryPromise || this.table.query());
        item.element.classList.remove("loading");
      },
      children: [
        {
          tag: "a",
          update: a => {
            a.element.classList.toggle("hidden", !!this.editPpp);

            const num = this.table.getCount(); //  + this.table.content.getExtraIds().length;
            a.element.textContent = num + " elements";
            a.element.onclick = event => {
              this.editPpp = true;
              this.table.renderHeader();
            }
          }
        },
        {
          class: "set-ppp",
          children: [
            {
              tag: "label",
              init: label => {
                label.element.textContent = "Number of items per page";
              }
            },
            {
              tag: "input",
              init: input => {
                input.element.type = "text";
                input.element.style = "width:60px";
              },
              update: input => {
                input.element.value = this.table.getPpp();
                input.element.oninput = event => {
                  this.table.setPpp(input.element.value);
                  this.renderItemTotal();
                }
              }
            },
            {
              tag: "button",
              class: "karma-button",
              init: button => {
                button.element.onclick = async event => {
                  this.editPpp = false;
                  button.element.classList.add("loading");
                  KarmaFieldsAlpha.Nav.setParam("page", 1);
                  KarmaFieldsAlpha.Nav.setParam("ppp", this.table.getPpp());
                  await this.table.render();
                  button.element.classList.remove("loading");
                }

              },
              children: [
                {
                  tag: "span",
                  class: "button-content",
                  init: content => {
                    content.element.textContent = "Set";
                  }
                }
              ]
            }
          ],
          update: async item => {
            item.element.classList.toggle("hidden", !this.editPpp);
          }
        }
      ]

    }

  }

}


KarmaFieldsAlpha.fields.table.prevModal = class {

  build() {
    return {
      tag: "button",
      class: "karma-button",
      init: button => {
        button.element.title = this.resource.title || "Previous";
        button.element.innerHTML = '<span class="button-content">‹</span>';
      },
      update: button => {
        const ids = this.table.content.ids || [];
        let id = KarmaFieldsAlpha.Nav.getParam("id");
        let index = ids.indexOf(id);
        button.element.disabled = index < 1;

        button.element.onclick = async (event) => {
          if (index > 0) {
            id = ids[index-1];
            button.element.classList.add("loading");
            KarmaFieldsAlpha.Nav.backup();
            KarmaFieldsAlpha.Nav.setParam("id", id);
            await this.table.editParam();
            button.element.classList.remove("loading");
          }
        }
      }
    };
  }
}

KarmaFieldsAlpha.fields.table.nextModal = class {

  build() {
    return {
      tag: "button",
      class: "karma-button",
      init: button => {
        button.element.title = this.resource.title || "Next";
        button.element.innerHTML = '<span class="button-content">›</span>';
      },
      update: button => {
        const ids = this.table.content.ids || [];
        let id = KarmaFieldsAlpha.Nav.getParam("id");
        let index = ids.indexOf(id);
        button.element.disabled = index === -1 || index >= ids.length - 1;

        button.element.onclick = async (event) => {
          if (index > -1 && index < ids.length - 1) {
            id = ids[index+1];
            button.element.classList.add("loading");
            KarmaFieldsAlpha.Nav.backup();
            KarmaFieldsAlpha.Nav.setParam("id", id);
            await this.table.editParam();
            button.element.classList.remove("loading");
          }
        }
      }
    };
  }
}

KarmaFieldsAlpha.fields.table.closeModal = class {

  build() {
    return {
      tag: "button",
      class: "karma-button",
      init: button => {
        button.element.title = this.resource.title || "Close Modal";
        button.element.innerHTML = '<span class="button-content">×</span>';
      },
      init: button => {
        button.element.onclick = async () => {
          button.element.classList.add("loading");
          KarmaFieldsAlpha.Nav.backup();
          KarmaFieldsAlpha.Nav.setParam("id", null);
          await this.table.editParam();
          button.element.classList.remove("loading");
        }
      }
    }
  }
}

// KarmaFieldsAlpha.fields.table.closeTable = class {
//
//   build() {
//     return {
//       tag: "button",
//       class: "karma-button",
//       init: button => {
//         button.element.title = this.resource.title || "Close Table";
//         button.element.innerHTML = '<span class="button-content">×</span>';
//       },
//       init: button => {
//         button.element.onclick = async () => {
//           button.element.classList.add("loading");
//           KarmaFieldsAlpha.Nav.backup();
//           KarmaFieldsAlpha.Nav.setParamString("");
//           await this.table.editParam();
//           button.element.classList.remove("loading");
//         }
//       }
//     }
//   }
//
// }
