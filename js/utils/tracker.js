


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

	constructor(element, threshold = 5) {

		this.element = element;
		this.threshold = threshold;

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
			const onmousemove = event => {
				this.clientX = event.clientX;
				this.clientY = event.clientY;
				this.event = event;
				this.update();
			}

			const onscroll = event => {
	      if (event.target.contains(element)) {
	        this.box = element.getBoundingClientRect();
	        this.update();
	      }
	    }

			const onmouseup = event => {
				this.event = event;
				this.complete();
				document.removeEventListener("mousemove", onmousemove);
				document.removeEventListener("mouseup", onmouseup);
				document.removeEventListener("scroll", onscroll);
			}

			element.onmousedown = event => {
				this.clientX = event.clientX;
				this.clientY = event.clientY;
				this.event = event;
				this.init();
				this.update();

				document.addEventListener("mousemove", onmousemove);
				document.addEventListener("mouseup", onmouseup);
				document.addEventListener("scroll", onscroll);

			}
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

	init() {

		this.box = this.element.getBoundingClientRect();

		this.originX = this.clientX;
		this.originY = this.clientY;

		if (this.oninit) {
			this.oninit();
		}

	}

	update() {

		this.diffX = this.clientX - this.originX;
		this.diffY = this.clientY - this.originY;
		this.maxDX = Math.max(this.diffX, this.maxDX || 0);
		this.maxDY = Math.max(this.diffY, this.maxDY || 0);
		this.minDX = Math.min(this.diffX, this.minDX || 0);
		this.minDY = Math.min(this.diffY, this.minDY || 0);

		const x = this.clientX - this.box.left;
		const y = this.clientY - this.box.top;

		this.deltaX = x - this.x;
		this.deltaY = y - this.y;

		this.x = x;
		this.y = y;

		this.nX = x/this.box.width;
		this.nY = y/this.box.height;

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
