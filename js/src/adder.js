$(function() {
  // customizable addition event streams
  var adder = $('button[data-adder]').asEventStream('click')
                                     .map(function(click) {
                                       return $(click.currentTarget).data('adder');
                                     })
                                     .scan(0, function(accum, value) {
                                       return accum + value;
                                     });

  adder.assign($('input[name="adder"]'), 'val');
});
