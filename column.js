class column {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.queue = [];
  }

  moveTo(loc, yoffset = 1, framecount = 30) {
    for (let i = 1; i <= framecount; i++) {
      const t = i / framecount;
      const u = Math.sin(t * Math.PI);
      this.queue.push({
        x: lerp(this.x, loc.x, t),
        y: lerp(this.y, loc.y, t) + ((u * this.width) / 2) * yoffset,
      });
    }
  }

  draw(ctx) {
    let fillColor = "#00cccc"; // default

    if (highlighted.indices.includes(cols.indexOf(this))) {
      fillColor = highlighted.type === "swap" ? "#00ff00" : "#ff4444"; // green or red
    }

    let changed = false;

    if (this.queue.length > 0) {
      const queueItem = this.queue.shift();

      this.x = queueItem.x;
      this.y = queueItem.y;

      // 👇 Smooth height transition (used in Merge Sort)
      if (queueItem.height !== undefined) {
        this.height = queueItem.height;
      }

      changed = true;
    }

    const left = this.x - this.width / 2;
    const top = this.y - this.height;
    const right = this.x + this.width / 2;

    ctx.beginPath();

    // Gradient for bars
    const gradient = ctx.createLinearGradient(left, top, left, this.y);
    gradient.addColorStop(0, "#00ffff");
    gradient.addColorStop(1, "#0066ff");
    ctx.fillStyle = fillColor;

    ctx.moveTo(left, top);
    ctx.lineTo(left, this.y);
    ctx.ellipse(
      this.x,
      this.y,
      this.width / 2,
      this.width / 4,
      0,
      Math.PI,
      Math.PI * 2,
      true
    );
    ctx.lineTo(right, top);
    ctx.ellipse(
      this.x,
      top,
      this.width / 2,
      this.width / 4,
      0,
      0,
      Math.PI * 2,
      true
    );

    ctx.fill();
    ctx.strokeStyle = "#00ffff";
    ctx.stroke();

    return changed;
  }
}

/*class column {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    // if (queueItem.height !== undefined) {
    //   this.height = queueItem.height;
    // }

    this.width = width;
    this.height = height;
    this.queue = [];
  }

  moveTo(loc, yoffset = 1, framecount = 30) {
    for (let i = 1; i < framecount; i++) {
      const t = i / framecount;
      const u = Math.sin(t * Math.PI);
      this.queue.push({
        x: lerp(this.x, loc.x, t),
        y: lerp(this.y, loc.y, t) + ((u * this.width) / 2) * yoffset,
      });
    }
  }

  draw(ctx) {
    let changed = false;
    if (this.queue.length > 0) {
      const queueItem = this.queue.shift();
      this.x = queueItem.x;
      this.y = queueItem.y;
      if (queueItem.height !== undefined) {
        this.height = queueItem.height;
      }
      changed = true;
    }

    const left = this.x - this.width / 2;
    const top = this.y - this.height;
    const right = this.x + this.width / 2;

    ctx.beginPath();
    const gradient = ctx.createLinearGradient(left, top, left, this.y);
    gradient.addColorStop(0, "#00ffff");
    gradient.addColorStop(1, "#0066ff");

    ctx.fillStyle = gradient;
    ctx.moveTo(left, top);
    ctx.lineTo(left, this.y);
    ctx.ellipse(
      this.x,
      this.y,
      this.width / 2,
      this.width / 4,
      0,
      Math.PI,
      Math.PI * 2,
      true
    );
    ctx.lineTo(right, top);
    ctx.ellipse(
      this.x,
      top,
      this.width / 2,
      this.width / 4,
      0,
      0,
      Math.PI * 2,
      true
    );
    ctx.fill();
    ctx.strokeStyle = "#00ffff";
    ctx.stroke();

    return changed;
  }
}
*/
