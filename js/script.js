//#region CalculatorModel

const NumeralSystem =
{
  BIN: 'BIN',
  DEC: 'DEC',
  HEX: 'HEX'
}

const Subsequence =
{
  Before: 'Before',
  After: 'After'
}

const operators = {
  '+': { precedence: 1, execute: (a, b) => a + b },
  '-': { precedence: 1, execute: (a, b) => a - b },
  '×': { precedence: 2, execute: (a, b) => a * b },
  '÷': { precedence: 2, execute: (a, b) => a / b },
  '^': { precedence: 3, execute: (a, b) => Math.pow(a, b) }
};

const functions = {
  '%': { Subsequence: Subsequence.After, execute: (a) => a / 100 },
  '!': { Subsequence: Subsequence.After, execute: (a) => factorial(a) },
  '√': { Subsequence: Subsequence.Before, execute: (a) => Math.sqrt(a) },
  'exp': { Subsequence: Subsequence.Before, execute: (a) => Math.exp(a) },
  'sin': { Subsequence: Subsequence.Before, execute: (a) => Math.sin(a) },
  'cos': { Subsequence: Subsequence.Before, execute: (a) => Math.cos(a) },
  'tg': { Subsequence: Subsequence.Before, execute: (a) => Math.tan(a) },
  'ctg': { Subsequence: Subsequence.Before, execute: (a) => ctg(a) }
}

class Essence {
  #operator = '';
  #function = '';
  #operand = '';
  #subsequence = Subsequence.Before;

  next = null;

  calculateFunction() {
    if (this.#function == '') return;

    this.setOperand(functions[this.#function].execute(this.getValue()));
    this.#function = '';
  }

  addFunction(func) {
    if (!this.#function == '' || !this.#isCorreceSubsequence(functions[func].Subsequence)) return false;

    return this.#function = func;
  }

  addOperand(value) {
    if (this.#operator === '' || /^(00|.*\..*\..*)/.test(this.#operand + value)) return false;

    this.#subsequence = Subsequence.After;
    return this.#operand += value;
  }

  setOperand(value) {
    if (value < 0) { this.#operator = '-'; this.#operand = -value; return; }

    this.#operand = value;
  }

  getOperand() {
    return Number(this.#operand);
  }

  addOperator(operator) {
    if (this.#operator == operator || this.#operator.length > 0) return false;

    return this.#operator = operator;
  }

  getOperator() {
    return this.#operator;
  }

  canAddNext() {
    return this.#subsequence == Subsequence.After;
  }

  getValue() {
    let operator = '';

    if (this.#operator == '-') operator == '-';

    return Number(operator + this.#operand);
  }

  toString() {
    return this.#operator + this.#operand;
  }

  #isCorreceSubsequence(requiredSubsequence) {
    return this.#subsequence == requiredSubsequence;
  }
}

var Expression =
{
  current: null,
  start: null,

  tryAddNextEssance() {
    if (!Expression.current.canAddNext()) return;

    Expression.current.next = new Essence();
    Expression.current = Expression.current.next;
  },
  calculate() {
    let currentPrecedence = 3;

    this.start.calculateFunction();

    while (this.start.next != null) {
      let current = this.start;
      while (current.next != null) {
        let operator = current.next.getOperator();
        current.next.calculateFunction();

        if (operators[operator].precedence == currentPrecedence) {
          const result = operators[operator].execute(current.getValue(), current.next.getOperand());

          current.setOperand(result);
          current.next = current.next.next;

          continue;
        }

        current = current.next;
      }

      currentPrecedence--;
    }

    this.current = this.start;
    return this.start.getValue();
  },
  clear() { this.current = this.start = new Essence(); this.current.addOperator('+'); }
}

let currentNumeralSystem = NumeralSystem.DEC;

//#endregion

//#region Controller

let resultField;
let savedResultField;

let isClean;

document.addEventListener("DOMContentLoaded", function () {
  resultField = document.getElementById("result");
  savedResultField = document.getElementById("saved-result");

  savedResultField.innerHTML = localStorage.getItem("savedResultField");

  clearResult();
});

function appendOperand(value) {
  if (!Expression.current.addOperand(value)) return;

  dryResult(); resultField.innerHTML += value;
}

function appendOperator(operator) {
  Expression.tryAddNextEssance();

  if (!Expression.current.addOperator(operator)) return;

  dryResult(); resultField.innerHTML += operator;
}

function appendFunction(funk) {
  if (!Expression.current.addFunction(funk)) return;

  dryResult(); resultField.innerHTML += funk;
}

function clearResult() {
  resultField.innerHTML = '0';
  savedResultField.innerHTML = '';
  isClean = true;

  localStorage.removeItem("savedResultField");
  Expression.clear();
}

function dryResult() {
  if (isClean) { resultField.innerHTML = ''; isClean = false; }
}

function calculateResult() {
  let savedExpression = resultField.innerHTML;
  let result = Expression.calculate();

  resultField.innerHTML = result;
  savedResultField.innerHTML = `${savedExpression}=${result}`;

  localStorage.setItem("savedResultField", savedResultField.innerHTML);
}

function changePlusMinus() {
  let essence = Expression.current;

  if (essence.getOperator() == '-') {
    essence.addOperator('+');
    replaceOperator('-', '+');
    return;
  }
  if (essence.getOperator() == '+') {
    essence.addOperator('-');
    replaceOperator('+', '-');
    return;
  }
}

function replaceOperator(currentOperator, newOperator) {
  let lastPlusIndex = resultField.innerHTML.lastIndexOf(currentOperator);

  if (lastPlusIndex !== -1) {
    resultField.innerHTML = resultField.innerHTML.slice(0, lastPlusIndex) + newOperator + resultField.innerHTML.slice(lastPlusIndex + 1);
  }
}

function choseNumeralSystem(numeralSystem) {
  document.getElementById(currentNumeralSystem).classList.remove('focus');
  currentNumeralSystem = numeralSystem;  
  document.getElementById(numeralSystem).classList.add('focus');
}

//#endregion

//#region MathFunctions

function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

function ctg(angle) {
  const tan = Math.tan(angle);
  const ctg = 1 / tan;
  return ctg;
}

//#endregion

//#region MemoryOperations

let memoryValue = 0;

function memoryRecall() {
  const resultField = document.getElementById("result");
  resultField.innerHTML = memoryValue;
}
function memoryStore() {
  const resultField = document.getElementById("result");
  const result = parseFloat(resultField.innerHTML);
  memoryValue = result;
}
function memoryClear() {
  memoryValue = 0;
}
function memoryAdd() {
  const resultField = document.getElementById("result");
  const result = parseFloat(resultField.innerHTML);
  memoryValue += result;
}

function memorySubtract() {
  const resultField = document.getElementById("result");
  const result = parseFloat(resultField.innerHTML);
  memoryValue -= result;
}

//#endregion

//#region ConvertOperations

let convertvalue = 0;
function convertToBinary() { // decimal to binary
  convertStoreValue();
  const result =  convertvalue;
  const convvalue = result.toString(2);
  updateResult(convvalue);
}

function convertToDecimal() { // binary to decimal
  convertStoreValue();
  const result =  convertvalue;
  const convvalue = parseInt(result, 2);
  updateResult(convvalue);
}

function convertToHexadecimal() { //  decimal to hexadecimal
  convertStoreValue();
  const result =  convertvalue;
  const convvalue = result.toString(16).toUpperCase();
  updateResult(convvalue);
}

function convertStoreValue() {
  const resultField = document.getElementById("result");
  const result = parseFloat(resultField.innerHTML);
  convertvalue = result;
}

function updateResult(convvalue) {
  const resultField = document.getElementById("result");
  resultField.innerHTML = convvalue;
}

//#endregion
