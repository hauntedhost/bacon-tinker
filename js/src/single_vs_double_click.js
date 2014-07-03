$(function() {
  // single vs. double click event
  var clicker = $('button[data-clicker]').asEventStream('click')
                                         .bufferWithTime(300)
                                         .map(function(n) { return n.length; });

  clicker.onValue(function(n) {
    var note = (n >= 2) ? 'double click' : 'single click';
    $('span[data-clicker]').text(note)
                           .fadeIn('fast')
                           .delay(500)
                           .fadeOut('slow');
  });
});
