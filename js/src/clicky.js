$(function() {
  // watch click event stream and report tagName of clicked
  $('[data-clicky]').asEventStream('click').onValue(function(thing) {
    console.log('clicked', thing.currentTarget.tagName.toLowerCase());
  });
});
