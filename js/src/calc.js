$(function() {
  // return value pulled out of event target
  var inputVal = function(event) {
    return $(event.currentTarget).val();
  }

  // return numeric value or blank string;
  var numericOrBlank = function(value) {
    return $.isNumeric(value) ? value : '';
  }

  // true true/false if operator is valid
  var validOperator = function(operator) {
    return ['+', '-', '*', '/', '%'].indexOf(operator) > -1;
  }

  // push operator event and any errors into operator event stream
  var validateOperator = function(event) {
    // always push operator
    this.push(event);

    // push error if operator is invalid
    if (!validOperator(event.value())) {
      this.push(new Bacon.Error('Invalid operator'));
    }
  }

  // return operation applied to a and b values
  var operate = function(a, b, operator) {
    switch(operator) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      case '%': return a % b;
      default: return NaN;
    }
  }

  // jquery inputs
  var $inputA = $('input[name="a"]');
  var $inputB = $('input[name="b"]');
  var $selectOperator = $('select[name="operator"]');
  var $inputAnswer = $('input[name="answer"]');

  // on keyup parse value to float, keep if number, convert to property
  var a = $inputA.asEventStream('keyup')
                 .map(inputVal)
                 .map(parseFloat)
                 .filter($.isNumeric)
                 .toProperty(0);

  var b = $inputB.asEventStream('keyup')
                 .map(inputVal)
                 .map(parseFloat)
                 .filter($.isNumeric)
                 .toProperty(0);

  // on change validate and convert to property
  var operator = $selectOperator.asEventStream('change')
                                .map(inputVal)
                                .withHandler(validateOperator)
                                .toProperty($selectOperator.val());

  // combine a, b and operator properties via 'operate' function
  var answer = Bacon.combineWith(operate, a, b, operator);

  // update answer field
  answer.onValue(function(value) {
    var value = numericOrBlank(value);
    $inputAnswer.val(value);
  });

  // add/remove error class from operator select
  operator.onValue(function() { $selectOperator.removeClass('error'); })
  operator.onError(function() { $selectOperator.addClass('error'); })
});
