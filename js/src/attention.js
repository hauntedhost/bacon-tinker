$(function() {
  // streams for focus and blur events
  var focuses = $(window).asEventStream('focus');
  var blurs = $(window).asEventStream('blur');

  // stream that maps focus events to true, blur events to false
  var isFocused = focuses.map(true)
                         .merge(blurs.map(false))
                         .toProperty(true)
                         .skipDuplicates();

  // stream for any interactivity on page
  var signsOfLife = Bacon.mergeAll(
    $(window).asEventStream('focus'),
    $(window).asEventStream('click'),
    $(window).asEventStream('scroll'),
    $(window).asEventStream('mousemove'),
    $(window).asEventStream('touchstart'),
    $(window).asEventStream('touchend'),
    $(window).asEventStream('touchcancel'),
    $(window).asEventStream('touchleave'),
    $(window).asEventStream('touchmove')
  );

  // returns a stream that returns one true, then one false 5000ms later
  var decayingStream = function() {
    return Bacon.once(true)
                .merge(Bacon.once(false)
                            .delay(5000));
  }

  // every event from signsOfLife is mapped to a new decaying stream that
  // first emits a true value, then emits a false 5000ms later
  var recentlyActive = signsOfLife.flatMapLatest(decayingStream)
                                  .toProperty(true)
                                  .skipDuplicates();

  // consider this true when both recentlyActive and isFocused are true
  var hasAttention = recentlyActive.and(isFocused)
                                   .skipDuplicates();

  // update page with values
  isFocused.assign($('span[data-is-focused]'), 'text')
  recentlyActive.assign($('span[data-recently-active]'), 'text')
  hasAttention.assign($('span[data-has-attention]'), 'text')
});
