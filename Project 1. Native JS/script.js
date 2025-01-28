const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');

let currentInput = '';
let operator = '';
let firstOperand = '';
let secondOperand = '';

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (value === 'C') {
            clearDisplay();
        } else if (value === '=') {
            calculateResult();
        } else if (value === '←') {
            backspace();
        } else if (value === '%') {
            calculatePercentage();
        } else if (['+', '-', '*', '/'].includes(value)) {
            setOperator(value);
        } else if (value === '.') {
            appendDecimal();
        } else {
            appendNumber(value);
        }
    });
});


document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (/\d/.test(key)) {
        appendNumber(key);
    } else if (key === '.') {
        appendDecimal();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Enter') {
        calculateResult();
    } else if (['+', '-', '*', '/'].includes(key)) {
        setOperator(key);
    }
});

function clearDisplay() {
    currentInput = '';
    operator = '';
    firstOperand = '';
    secondOperand = '';
    updateDisplay('');
}


function appendNumber(number) {
    currentInput += number;
    updateDisplay(currentInput);
}

function appendDecimal() {
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay(currentInput);
    }
}


function backspace() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput);
}


function calculatePercentage() {
    if (currentInput === '') return;
    const result = parseFloat(currentInput) / 100;
    updateDisplay(result);
    currentInput = result.toString();
}


function setOperator(op) {
    if (currentInput === '') return;

    if (operator !== '') {
        calculateResult();
    }

    operator = op;
    firstOperand = currentInput;
    currentInput += op;
    updateDisplay(currentInput);
}


async function calculateResult() {
    if (currentInput === '' || firstOperand === '') return;

    const expression = currentInput.split(/(\+|\-|\*|\/)/);
    firstOperand = expression[0];
    operator = expression[1];
    secondOperand = expression[2];

    try {
        const result = await performCalculationAsync(operator, firstOperand, secondOperand);
        updateDisplay(result);


        await saveToLocalStorageAsync(currentInput, result);


        currentInput = result;
        operator = '';
        firstOperand = '';
        secondOperand = '';
    } catch (error) {
        console.error("Error during calculation:", error);
        updateDisplay("Error");
    }
}


function performCalculationAsync(operator, a, b) {
    return new Promise((resolve, reject) => {
        try {
            a = parseFloat(a);
            b = parseFloat(b);

            let result;
            switch (operator) {
                case '+':
                    result = a + b;
                    break;
                case '-':
                    result = a - b;
                    break;
                case '*':
                    result = a * b;
                    break;
                case '/':
                    if (b === 0) throw new Error("Cannot divide by zero");
                    result = a / b;
                    break;
                default:
                    throw new Error("Invalid operator");
            }
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


function updateDisplay(value) {
    display.value = value;
}


function saveToLocalStorageAsync(operation, result) {
    return new Promise((resolve, reject) => {
        try {
            const history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
            history.push({ operation, result });
            localStorage.setItem('calculatorHistory', JSON.stringify(history));
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}


window.onload = () => {
    const lastResult = localStorage.getItem('lastResult');
    if (lastResult) {
        updateDisplay(lastResult);
    }
};
