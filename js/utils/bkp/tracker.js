


// Usage:

// new PointerTrap(element);
//
// element.ontrack = trap => {
// 	console.log(trap.diffX, trap.diffY);
// }
//
// element.onlose = trap => {
// 	console.log(trap.swipeRight, trap.swipeFail);
// }


//
// var input = document.createElement("textarea");
// input.style.position = "absolute";
// input.style.zIndex = 10000;
// input.style.top = 0;
// input.style.width = "200px";
// input.style.height = "100px";
//
// document.addEventListener("DOMContentLoaded", event => {
// 	document.body.appendChild(input);
// });


KarmaFieldsAlpha.Tracker = class {

	constructor(element, event = null) {

		this.element = element;

		this.scrollContainer = element.closest(".scroll-container");

		// this.trackMouse();

		// if (event && event.type === "mousedown" && !this.isTouch) {
		//
		// 	this.trackMouse(event);
		//
		// } else if (event && event.type === "touchstart") {
		//
		// 	this.isTouch = true;
		//
		// 	this.trackTouch(event);
		//
		// } else {

			element.onmousedown = event => {
				if (event.button === 0 && !this.isTouch) {
					this.trackMouse(event);
				}
			}

			element.ontouchstart = event => {
				this.isTouch = true;
				this.trackTouch(event);
			}

		// }



		// console.log("ontouchstart", "ontouchstart" in window);
		//
		// if ("ontouchstart" in window) {

			// const ontouchmove = event => {
			// 	console.log("touchmove");
			// 	const x = event.touches[0].clientX;
			// 	const y = event.touches[0].clientY;
			// 	this.move(event, x, y);
			// }
			//
			// const ontouchend = event => {
			// 	console.log("touchend");
			// 	this.release(event);
			// 	document.removeEventListener("touchmove", ontouchmove);
			// 	document.removeEventListener("touchend", ontouchend);
			// }
			//
			// element.ontouchstart = event => {
			// 	console.log("touchstart");
			// 	const x = event.touches[0].clientX;
			// 	const y = event.touches[0].clientY;
			// 	this.start(event, x, y);
			// 	document.addEventListener("touchmove", ontouchmove);
			// 	document.addEventListener("touchend", ontouchend);
			//
			// }

		// } else {
		//
		// 	const onmousemove = event => {
		// 		this.clientX = event.clientX;
		// 		this.clientY = event.clientY;
		// 		this.event = event;
		// 		this.update();
		// 	}

		// 	const onscroll = event => {
	    //   if (event.target.contains(element)) {
	    //     this.box = element.getBoundingClientRect();
	    //     this.update();
	    //   }
	    // }

		// 	const onmouseup = event => {
		// 		this.event = event;
		// 		this.complete();
		// 		document.removeEventListener("mousemove", onmousemove);
		// 		document.removeEventListener("mouseup", onmouseup);
		// 		document.removeEventListener("scroll", onscroll);
		// 	}

		// 	element.onmousedown = event => {
		// 		this.clientX = event.clientX;
		// 		this.clientY = event.clientY;
		// 		this.event = event;
		// 		this.init();
		// 		this.update();

		// 		document.addEventListener("mousemove", onmousemove);
		// 		document.addEventListener("mouseup", onmouseup);
		// 		document.addEventListener("scroll", onscroll);

		// 	}
		//
		// }

		// const onpointermove = event => {
		// 	const x = event.clientX;
		// 	const y = event.clientY;
		//
		// 	this.move(event, x, y);
		// }
		//
		// const onpointerup = event => {
		// 	this.release(event);
		// 	document.removeEventListener("pointermove", onpointermove);
		// 	document.removeEventListener("pointerup", onpointerup);
		// }
		//
		// element.onpointerdown = event => {
		//
		// 	const x = event.clientX;
		// 	const y = event.clientY;
		// 	this.start(event, x, y);
		// 	document.addEventListener("pointermove", onpointermove);
		// 	document.addEventListener("pointerup", onpointerup);
		//
		// }

	}

	trigger(event) {

		if (event.type === "mousedown" && !this.isTouch) {

			this.trackMouse(event);

		} else if (event.type === "touchstart") {

			this.isTouch = true;

			this.trackTouch(event);

		}

	}

  getScrollLeft() {

    return (this.scrollContainer || document.documentElement).scrollLeft;

  }

  getScrollTop() {

    return (this.scrollContainer || document.documentElement).scrollTop;

  }

	trackMouse(event) {

		const onmousemove = event => {
			this.clientX = event.clientX;
			this.clientY = event.clientY;
			this.event = event;
			this.update();
		}

		const onscroll = event => {
			if (!this.scrollLock && event.target.contains(this.element)) {
				this.update();
			}
		}

		const onmouseup = event => {
			this.event = event;
      this.lastTarget = event.target;
			this.complete();
			document.removeEventListener("mousemove", onmousemove);
			document.removeEventListener("mouseup", onmouseup);
			(this.scrollContainer || document).removeEventListener("scroll", onscroll);

		}

		this.clientX = event.clientX;
		this.clientY = event.clientY;
		this.event = event;
    this.firstTarget = event.target;
		this.init();

		document.addEventListener("mousemove", onmousemove);
		document.addEventListener("mouseup", onmouseup);
		(this.scrollContainer || document).addEventListener("scroll", onscroll);

	}

	// trackMouse() {
	//
	//
	//
	// 	const onmousemove = event => {
	// 		this.clientX = event.clientX;
	// 		this.clientY = event.clientY;
	// 		this.event = event;
	// 		this.update();
	// 	}
	//
	// 	const onscroll = event => {
	// 		if (!this.scrollLock && event.target.contains(this.element)) {
	// 			// this.box = this.element.getBoundingClientRect();
	// 			// this.scrollX = this.scrollContainer.scrollLeft;
	// 			// this.scrollY = this.scrollContainer.scrollTop; // -> wont work if scrollContainer is document
	// 			this.update();
	// 		}
	// 	}
	//
	// 	const onmouseup = event => {
	// 		this.event = event;
  //     this.lastTarget = event.target;
	// 		this.complete();
	// 		document.removeEventListener("mousemove", onmousemove);
	// 		document.removeEventListener("mouseup", onmouseup);
	// 		(this.scrollContainer || document).removeEventListener("scroll", onscroll);
	//
	// 	}
	//
	// 	this.element.onmousedown = event => {
	// 		if (event.button === 0) {
	// 			this.clientX = event.clientX;
	// 			this.clientY = event.clientY;
	// 			this.event = event;
  //       this.firstTarget = event.target;
	// 			this.init();
	//
	// 			document.addEventListener("mousemove", onmousemove);
	// 			document.addEventListener("mouseup", onmouseup);
	// 			(this.scrollContainer || document).addEventListener("scroll", onscroll);
	// 		}
	// 	}
	//
	// }

	trackTouch(event) {

		const ontouchmove = event => {
			this.clientX = event.touches[0].clientX;
			this.clientY = event.touches[0].clientY;
			this.event = event;
			this.update();
		}

		const ontouchend = event => {
			this.event = event;
			this.complete();
			document.removeEventListener("touchmove", ontouchmove);
			document.removeEventListener("touchend", ontouchend);
		}

		// this.element.ontouchstart = event => {

			this.clientX = event.touches[0].clientX;
			this.clientY = event.touches[0].clientY;
			this.event = event;
			this.init();

			document.addEventListener("touchmove", ontouchmove);
			document.addEventListener("touchend", ontouchend);

		// }

	}

	init() {

		this.box = this.element.getBoundingClientRect();

		// this.scrollX = 0;
		// this.scrollY = 0;

		this.scrollOriginX = this.getScrollLeft(); //this.scrollContainer.scrollLeft; // -> wont work if scrollContainer is document
		this.scrollOriginY = this.getScrollTop(); //this.scrollContainer.scrollTop; // -> wont work if scrollContainer is document

		this.originX = this.clientX;
		this.originY = this.clientY;

		this.diffX = 0;
		this.diffY = 0;
		this.maxDX = 0;
		this.maxDY = 0;
		this.minDX = 0;
		this.minDY = 0;

		const x = this.clientX - this.box.left;
		const y = this.clientY - this.box.top;

		this.deltaX = 0;
		this.deltaY = 0;

		this.x = x;
		this.y = y;

		this.nX = x/this.box.width;
		this.nY = y/this.box.height;

		this.lastClientX = this.clientX;
		this.lastClientY = this.clientY;

		this.swipeRight = false;
		this.swipeLeft = false;
		this.swipeDown = false;
		this.swipeUp = false;
		this.click = false;
		this.swipeFail = false;

		if (this.oninit) {
			this.oninit();
		}

	}

	update() {

		const scrollX = this.getScrollLeft(); //this.scrollContainer.scrollLeft; // -> wont work if scrollContainer is document
		const scrollY = this.getScrollTop(); //this.scrollContainer.scrollTop; // -> wont work if scrollContainer is document

		const diffScrollX = scrollX - this.scrollOriginX;
		const diffScrollY = scrollY - this.scrollOriginY;

		this.diffX = this.clientX - this.originX + diffScrollX;
		this.diffY = this.clientY - this.originY + diffScrollY;
		this.maxDX = Math.max(this.diffX, this.maxDX || 0);
		this.maxDY = Math.max(this.diffY, this.maxDY || 0);
		this.minDX = Math.min(this.diffX, this.minDX || 0);
		this.minDY = Math.min(this.diffY, this.minDY || 0);

		const x = this.clientX - this.box.left + diffScrollX;
		const y = this.clientY - this.box.top + diffScrollY;

		this.deltaX = x - this.x;
		this.deltaY = y - this.y;

		this.x = x;
		this.y = y;

		this.nX = x/this.box.width;
		this.nY = y/this.box.height;


		this.clientDiffX = this.clientX - this.lastClientX;
		this.clientDiffY = this.clientY - this.lastClientY;

		this.lastClientX = this.clientX;
		this.lastClientY = this.clientY;

		if (this.onupdate) {
			this.onupdate();
		}

	}

	complete() {

		this.swipeRight = (this.maxDX > -this.minDX && this.maxDX > this.maxDY && this.maxDX > -this.minDY && this.diffX > this.maxDX-this.threshold);
		this.swipeLeft = (this.minDX < -this.maxDX && this.minDX < this.minDY && this.minDX < -this.maxDY && this.diffX < this.minDX+this.threshold);
		this.swipeDown = (this.maxDY > -this.minDY && this.maxDY > this.maxDX && this.maxDY > -this.minDX && this.diffY > this.maxDY-this.threshold);
		this.swipeUp = (this.minDY < -this.maxDY && this.minDY < this.minDX && this.minDY < -this.maxDX && this.diffY < this.minDY+this.threshold);
		this.click = (this.maxDX < this.threshold && this.minDX > -this.threshold && this.maxDY < this.threshold && this.minDY > -this.threshold);
		this.swipeFail = !this.swipeRight && !this.swipeLeft && !this.swipeDown && !this.swipeUp && !this.click;

		if (this.oncomplete) {
			this.oncomplete();
		}

	}

}
