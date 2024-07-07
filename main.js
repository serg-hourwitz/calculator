document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.button');
  const display = document.getElementById('display');

  let currentInput = '0'; // Поточний введений текст
  let operator = ''; // Поточний оператор
  let previousInput = ''; // Попередній введений текст
  let pendingOperation = false; // Чи чекає виконання операції

  // Додаємо обробник подій для кожної кнопки
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.innerText; // Отримуємо текст кнопки

      // Обробляємо введення цифр і крапки
      if (!isNaN(value) || value === '.') {
        if (pendingOperation) {
          currentInput = value; // Починаємо новий ввід після операції
          pendingOperation = false;
        } else {
          currentInput = currentInput === '0' ? value : currentInput + value; // Додаємо цифри до поточного вводу
        }
        display.value = currentInput;
      } else if (value === 'C') {
        // Скидаємо всі значення
        currentInput = '0';
        operator = '';
        previousInput = '';
        display.value = '0';
      } else if (value === '+/-') {
        // Міняємо знак числа
        currentInput = (parseFloat(currentInput) * -1).toString();
        display.value = currentInput;
      } else if (value === 'SQRT') {
        // Обчислюємо квадратний корінь
        if (currentInput >= 0) {
          currentInput = Math.sqrt(parseFloat(currentInput)).toString();
          display.value = currentInput;
        } else {
          display.value = 'value must be > 0';
        }
      } else if (value === 'x2') {
        // Обчислюємо квадрат числа
        if (currentInput) {
          currentInput = (parseFloat(currentInput) ** 2).toString();
          display.value = currentInput;
        }
      } else if (value === '%') {
        // Обробляємо обчислення відсотка
        if (previousInput && currentInput && operator) {
          currentInput = calculate(previousInput, currentInput, operator + '%');
          display.value = currentInput;
          previousInput = '';
          operator = '';
        } else if (currentInput) {
          currentInput = (parseFloat(currentInput) / 100).toString();
          display.value = currentInput;
        }
      } else if (value === '=') {
        // Виконуємо обчислення при натисканні "="
        if (previousInput && currentInput && operator) {
          currentInput = calculate(previousInput, currentInput, operator);
          display.value = currentInput;
          previousInput = '';
          operator = '';
        }
      } else {
        // Обробляємо оператори
        if (previousInput && operator && currentInput) {
          currentInput = calculate(previousInput, currentInput, operator);
          display.value = currentInput;
        }
        previousInput = currentInput;
        operator = value;
        pendingOperation = true; // Після оператора очікуємо новий ввід
      }
    });
  });

  // Функція для обчислення результату
  function calculate(a, b, operator) {
    const num1 = parseFloat(a);
    const num2 = parseFloat(b);
    let result = 0;

    // Виконуємо обчислення відповідно до оператора
    switch (operator) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '*':
        result = num1 * num2;
        break;
      case '/':
        if (num2 !== 0) {
          result = num1 / num2;
        } else {
          result = 'divisible must not = 0 !';
        }
        break;
      case '+%':
        result = num1 + (num1 * num2) / 100;
        break;
      case '-%':
        result = num1 - (num1 * num2) / 100;
        break;
      case '*%':
        result = num1 * (num2 / 100);
        break;
      case '/%':
        if (num2 !== 0) {
          result = num1 / (num2 / 100);
        } else {
          result = 'divisible must not = 0 !';
        }
        break;
      default:
        return b;
    }

    return result.toString(); // Повертаємо результат як строку
  }
});
