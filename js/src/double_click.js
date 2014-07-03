$(function() {
  // double-click only event
  var dClicker = $('button[data-clicker2]').asEventStream('click')
                                           .bufferWithTimeOrCount(500, 2)
                                           .filter(function(n) { return n.length >= 2; });

  dClicker.onValue(function() {
     $('span[data-clicker2]').text('double clicked!')
                             .fadeIn('fast')
                             .delay(500)
                             .fadeOut('slow');
  });
});
