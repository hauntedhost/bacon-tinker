$(function() {
  var inputVal = function(event) {
    return $(event.currentTarget).val();
  }

  var validOperator = function(operator) {
    return ['+', '-', '*', '/', '%'].indexOf(operator) > -1;
  }

  var operate = function(a, b, operator) {
    switch(operator) {
      case '+': return a + b;
      case'-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      case '%': return a % b;
      default: return a + b;
    }
  }

  var $inputA = $('input[name="a"]');
  var $inputB = $('input[name="b"]');
  var $selectOperator = $('select[name="operator"]');
  var $inputAnswer = $('input[name="answer"]');

  // on keyup parseFloat values, keep numbers, convert to property
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

  var operator = $selectOperator.asEventStream('change')
                                .map(inputVal)
                                .filter(validOperator)
                                .toProperty('+');

  var answer = Bacon.combineWith(operate, a, b, operator);
  answer.assign($inputAnswer, 'val');
});
