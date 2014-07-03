$(function() {
  // plus/minus event streams
  var plus = $('button[data-plus]').asEventStream('click')
                                   .map(1);

  var minus = $('button[data-minus]').asEventStream('click')
                                     .map(-1);

  // merged plus/minus event streams
  var both = plus.merge(minus);

  // property
  var counter = both.scan(0, function(accum, value) { return accum + value; });

  // strange shenanigans
  counter.map(function(n) {
    if (n == 5) { return 'ahahahaha'; } else { return n; }
  }).onValue(function(n) {
    $('input[name="value"]').val(n);
  });

  // NOTE: these two are equivalent
  // counter.assign($('input[name="value"]'), 'val')

  //counter.onValue(function(value) {
  //  $('input[name="value"]').val(value);
  //});
});
