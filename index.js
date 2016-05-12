function Canwrap(ctx) {
  if (!this instanceof Canwrap) return new Canwrap(ctx);
  this.ctx = ctx;
}

var LineBreaker = require('linebreak');

Canwrap.prototype.splitLines =
function splitLines(text, wrapWidth) {
  var ctx = this.ctx;
  var lineStart = 0;
  var lastOption = 0;
  var breaker = new LineBreaker(text);
  var bk;
  var lines = [];
  while (bk = breaker.nextBreak()) {

    // if we've hit a required line break
    if (bk.required) {
      // cut this line and begin a new one
      lines[lines.length] = text.slice(lineStart, bk.position);
      lineStart = lastOption = bk.position;

    // if this line would overshoot the wrap width
    } else if (ctx.measureText(
      text.slice(lineStart, bk.position)).width > wrapWidth) {

        // if our last possible line break was forced
        if (lineStart == lastOption) {
          // force this line, too
          lines[lines.length] = text.slice(lineStart, bk.position);
          lineStart = lastOption = bk.position;

        // if we have a partial line that fit
        } else {
          // cut this line and begin a new one
          lines[lines.length] = text.slice(lineStart, lastOption);
          lineStart = lastOption;
          lastOption = bk.position;
        }
    } else {
      lastOption = bk.position;
    }
  }
  // append the last line
  lines[lines.length] = text.slice(lineStart);

  return lines;
};

Canwrap.prototype.fillWrappedText =
function fillWrappedText(text, x, y, wrapWidth, lineHeight) {
  var ctx = this.ctx;
  var lines = this.splitLines(text, wrapWidth);
  for (var i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + lineHeight * i);
  }
};

Canwrap.prototype.strokeWrappedText =
function strokeWrappedText(text, x, y, wrapWidth, lineHeight) {
  var ctx = this.ctx;
  var lines = this.splitLines(text, wrapWidth);
  for (var i = 0; i < lines.length; i++) {
    ctx.strokeText(lines[i], x, y + lineHeight * i);
  }
};

module.exports = Canwrap;
