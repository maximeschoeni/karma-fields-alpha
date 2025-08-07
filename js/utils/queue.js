KarmaFieldsAlpha.Queue = class {

	static queue = [];
	static processing = false;

	static add(callback) {
		this.queue.push(callback);
		this.process();
	}

	static async process() {
		if (!this.processing && this.queue.length > 0) {
			this.processing = true;
			const next = this.queue.shift();
			await next();
			this.processing = false;
			this.process();
		}
	}

}
