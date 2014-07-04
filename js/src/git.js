$(function() {
  // return value pulled out of event target
  var inputVal = function(event) {
    return $(event.currentTarget).val();
  }

  // bacon streamified ajax request
  var ajaxStream = function(query) {
    var url = 'https://api.github.com/search/users';
    return Bacon.fromPromise($.ajax(url + '?q=' + query));
  }

  var isBlank = function(str) {
    return (str.length === 0 || !str.trim());
  }

  var validQuery = function(query) {
    return !isBlank(query);
  }

  var resultItems = function(result) {
    return result.items;
  }

  var showResults = function(items) {
    var $resultsList = $('ul[data-results-list]');

    $resultsList.html('');
    items.forEach(function(item) {
      $resultsList.append('<li>' + item.html_url + '</li>');
    });
  }

  var showError = function(response) {
    var $resultsList = $('ul[data-results-list]');

    $resultsList.html('<li>' + response.statusText + '</li>');
  }

  var toggleLoading = function(show) {
    $('[data-loading]').toggle(show);
  }

  var $inputQuery = $('[data-query]');

  // stream: on keyup, after 350ms delay get input value, keep valid queries
  var searches = $inputQuery.asEventStream('keyup')
                            .debounce(350)
                            .map(inputVal)
                            .filter(validQuery)
                            .skipDuplicates();

  // stream: map latest results from ajax stream, pull out items from result
  var results = searches.flatMapLatest(ajaxStream)
                        .map(resultItems);

  // stream: map search events to 'true', merge result events in as 'false'
  var ongoingSearch = searches.map(true)
                              .merge(results.map(false))
                              .skipDuplicates()
                              .toProperty(false);

  // steam ongoingSearch values (true/false) into loading spinner toggler
  ongoingSearch.onValue(toggleLoading);

  // show results
  results.onValue(showResults);

  // if errors, turn off loader, show error
  results.onError(function(response) {
    toggleLoading(false);
    showError(response);
  });
});
