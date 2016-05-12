var LineBreaker = require('linebreak');

function splitLines(text, ctx, wrapWidth) {
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
        // Don't count space characters at the end of the string
        // TODO: Check if this is sound logic
        text.slice(lineStart, bk.position).replace(/\s*$/,'')
      ).width > wrapWidth) {

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
}

function fillWrappedText(ctx, text, x, y, wrapWidth, lineHeight) {
  var lines = splitLines(text, ctx, wrapWidth);
  for (var i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + lineHeight * i);
  }
}

function strokeWrappedText(ctx, text, x, y, wrapWidth, lineHeight) {
  var lines = splitLines(text, ctx, wrapWidth);
  for (var i = 0; i < lines.length; i++) {
    ctx.strokeText(lines[i], x, y + lineHeight * i);
  }
}

module.exports.splitLines = splitLines;
module.exports.fillWrappedText = fillWrappedText;
module.exports.strokeWrappedText = strokeWrappedText;