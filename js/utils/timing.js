
KarmaFieldsAlpha.Timing = class {

  // static throttle(callback, duration = 500) {
  //
  //   const now = Date.now();
  //
  //   if (!this.throttleTime || this.throttleTime < now - duration) {
  //
  //     callback();
  //
  //     this.throttleTime = now;
  //
  //   }
  //
  // }

  static debounce(callback, duration = 500) {

    if (this.debounceTimer) {

      clearTimeout(this.debounceTimer);

    }

    this.debounceTimer = setTimeout(() => void callback(), duration);
  }

  static throttle(callback, duration = 500) {

    const now = Date.now();

    if (this.lastTick + duration > now) {

      setTimeout(() => {

        callback();

      }, duration);

      this.lastTick = now;

    }

  }

}
