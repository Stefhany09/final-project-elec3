"use strict";

class Calculator {
  constructor() {
    this.exprEl = document.getElementById("expression");
    this.resultEl = document.getElementById("result");
    this.gridEl = document.getElementById("grid");

    this.state = {
      operandA: null,
      operandB: null,
      operation: null,
      input: "0",
      lastWasEquals: false,
      hasError: false,
    };

    this.init();
  }

  init() {
    this.gridEl.addEventListener("click", (e) => this.handleClick(e));
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));
    this.render();
  }

  isInError() {
    return this.state.hasError || this.state.input === "Error";
  }

  format(num) {
    if (!Number.isFinite(num)) return "Error";
    const rounded = Math.round((num + Number.EPSILON) * 1e12) / 1e12;
    return String(rounded);
  }

  getInputAsNumber() {
    if ([".","-."].includes(this.state.input)) return 0;
    return Number(this.state.input);
  }

  resetAfterErrorOrEquals() {
    if (this.isInError() || this.state.lastWasEquals) {
      this.state.operandA = null;
      this.state.operandB = null;
      this.state.operation = null;
      this.state.input = "0";
      this.state.lastWasEquals = false;
      this.state.hasError = false;
    }
  }

  appendDigit(digit) {
    this.resetAfterErrorOrEquals();
    if (this.state.input === "0") {
      this.state.input = digit;
    } else if (this.state.input === "-0") {
      this.state.input = "-" + digit;
    } else {
      this.state.input += digit;
    }
    this.render();
  }

  addDecimal() {
    this.resetAfterErrorOrEquals();
    if (!this.state.input.includes(".")) {
      this.state.input += ".";
    }
    this.render();
  }

  toggleSign() {
    if (this.isInError()) return;
    if (["0", "0."].includes(this.state.input)) return;
    this.state.input = this.state.input.startsWith("-")
      ? this.state.input.slice(1)
      : "-" + this.state.input;
    this.render();
  }

  deleteLastChar() {
    if (this.isInError() || this.state.lastWasEquals) return;
    if (
      this.state.input.length <= 1 ||
      (this.state.input.length === 2 && this.state.input.startsWith("-"))
    ) {
      this.state.input = "0";
    } else {
      this.state.input = this.state.input.slice(0, -1);
      if (this.state.input === "-") this.state.input = "0";
    }
    this.render();
  }

  clear() {
    this.state = {
      operandA: null,
      operandB: null,
      operation: null,
      input: "0",
      lastWasEquals: false,
      hasError: false,
    };
    this.render();
  }

  compute(a, op, b) {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? NaN : a / b;
      default: return NaN;
    }
  }

  selectOperation(op) {
    if (this.isInError()) return;
    const n = this.getInputAsNumber();

    if (this.state.lastWasEquals) {
      this.state.lastWasEquals = false;
      this.state.operandB = null;
    }

    if (this.state.operandA === null) {
      this.state.operandA = n;
      this.state.operation = op;
      this.state.input = "0";
      this.render();
      return;
    }

    if (this.state.operation && this.state.input !== "0") {
      this.state.operandB = n;
      const result = this.compute(
        this.state.operandA,
        this.state.operation,
        this.state.operandB
      );

      if (!Number.isFinite(result)) {
        this.state.input = "Error";
        this.state.hasError = true;
        this.state.operandA = null;
        this.state.operandB = null;
        this.state.operation = null;
        this.render();
        return;
      }

      this.state.operandA = result;
      this.state.operandB = null;
      this.state.operation = op;
      this.state.input = "0";
      this.render();
      return;
    }

    this.state.operation = op;
    this.render();
  }

  calculate() {
    if (this.isInError() || !this.state.operation || this.state.operandA === null) return;

    const n = this.getInputAsNumber();
    const b = this.state.lastWasEquals
      ? (this.state.operandB ?? n)
      : n;
    const result = this.compute(
      this.state.operandA,
      this.state.operation,
      b
    );

    if (!Number.isFinite(result)) {
      this.state.input = "Error";
      this.state.hasError = true;
      this.state.operandA = null;
      this.state.operandB = null;
      this.state.operation = null;
      this.render();
      return;
    }

    this.state.operandB = b;
    this.state.operandA = result;
    this.state.input = this.format(result);
    this.state.lastWasEquals = true;
    this.render();
  }

  render() {
    const parts = [];
    if (this.state.operandA !== null) parts.push(this.format(this.state.operandA));
    if (this.state.operation) parts.push(this.state.operation);
    if (this.state.operandB !== null && !this.state.lastWasEquals)
      parts.push(this.format(this.state.operandB));

    this.exprEl.textContent = parts.join(" ");
    this.resultEl.textContent = this.state.input;
  }

  handleClick(e) {
    const btn = e.target.closest("button");
    if (!btn) return;

    const { digit, op, action } = btn.dataset;

    if (digit) this.appendDigit(digit);
    else if (op) this.selectOperation(op);
    else if (action === "dot") this.addDecimal();
    else if (action === "clear") this.clear();
    else if (action === "backspace") this.deleteLastChar();
    else if (action === "sign") this.toggleSign();
    else if (action === "equals") this.calculate();
  }

  handleKeyboard(e) {
    const k = e.key;
    if (k >= "0" && k <= "9") this.appendDigit(k);
    else if (k === ".") this.addDecimal();
    else if (k === "Enter" || k === "=") {
      e.preventDefault();
      this.calculate();
    } else if (k === "Backspace" || k === "Delete") this.deleteLastChar();
    else if (k === "Escape") this.clear();
    else if (["+", "-", "*", "/"].includes(k)) this.selectOperation(k);
  }
}

const calc = new Calculator();
