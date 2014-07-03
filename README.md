bacon-tinker
============

Tinkering with Bacon.js

```javascript
var clicker = $('button').asEventStream('click')
                         .bufferWithTime(250)
                         .map(function(n) { return n.length; });

clicker.onValue(function(n) {
  var note = (n >= 2) ? 'double click' : 'single click';
  $('span').text(note);
});
```
See ``tinker.js`` for more tinkering.
