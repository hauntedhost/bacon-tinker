$(function() {
  // return value pulled out of event target
  var inputVal = function(event) {
    return $(event.currentTarget).val();
  }

  // bacon streamified ajax request
  var ajaxStream = function() {
    var randomOffset = Math.floor(Math.random() * 500);
    var url = 'https://api.github.com/users?since=' + randomOffset;
    return Bacon.fromPromise($.ajax(url));
  }

  var isBlank = function(str) {
    return (str.length === 0 || !str.trim());
  }

  var validQuery = function(query) {
    return !isBlank(query);
  }

  // show single random suggestion
  // used when cancel is clicked
  var showSuggestion = function(clickWithItem) {
    if (!clickWithItem) { return false; }

    var $click = $(clickWithItem[0].currentTarget);
    var $span = $click.closest('li').find('span');
    var item = clickWithItem[1];

    $span.text(item.login);
  }

  // refresh all suggestions
  // used on page load and when refresh is clicked
  var showSuggestions = function(items) {
    var $resultsList = $('[data-suggest] span');
    var suggestions = _.sample(items, 3);

    _.each(suggestions, function(item, index) {
      var $result = $($resultsList[index]);
      $result.text(item.login);
    });
  }

  var showError = function(response) {
    var $resultsList = $('ul[data-results-list]');

    $resultsList.html('<li>' + response.statusText + '</li>');
  }

  var toggleLoading = function(show) {
    $('[data-loading]').toggle(show);
  }

  // refresh
  var $refresh = $('a[data-refresh]');
  $refresh.click(function(event) { event.preventDefault(); });

  // stream: refresh click stream, starts as true to trigger initial ajax call
  var refresh = $refresh.asEventStream('click')
                        .map(true)
                        .startWith(true);

  // stream: map latest results from ajax stream
  var results = refresh.flatMapLatest(ajaxStream)
                       .startWith([{ login: 'loading' },
                                   { login: 'loading'},
                                   { login: 'loading' }]);

  // show results
  results.onValue(showSuggestions);

  // cancel
  var $cancelLinks = $('[data-suggest] a');
  $cancelLinks.click(function(event) { event.preventDefault(); });

  // zip click event with next item popped from results
  var zipClickResult = function(event, results) {
    if (results && results.length > 0) {
      return [event, results.pop()];
    }
  }

  // zip clicks with results so we can pop next suggested item
  var cancel = $cancelLinks.asEventStream('click')
                           .combine(results, zipClickResult)
                           .startWith(false);

  // show individual suggestions
  cancel.onValue(showSuggestion);
});
