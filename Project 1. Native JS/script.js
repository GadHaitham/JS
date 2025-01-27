// العناصر
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');

let currentInput = ''; // المدخلات الحالية
let operator = ''; // العملية الحسابية
let firstOperand = ''; // المعامل الأول
let secondOperand = ''; // المعامل الثاني

// معالجة النقر على الأزرار
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
        } else if (['+', '−', '×', '÷'].includes(value)) {
            setOperator(value);
        } else if (value === '.') {
            appendDecimal();
        } else {
            appendNumber(value);
        }
    });
});

// دعم الإدخال من الكيبورد
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
        setOperator(key === '*' ? '×' : key === '/' ? '÷' : key);
    }
});

// مسح الشاشة
function clearDisplay() {
    currentInput = '';
    operator = '';
    firstOperand = '';
    secondOperand = '';
    updateDisplay('');
}

// إضافة الرقم إلى المدخلات
function appendNumber(number) {
    currentInput += number;
    updateDisplay(currentInput);
}

// إضافة العلامة العشرية
function appendDecimal() {
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay(currentInput);
    }
}

// التراجع عن آخر إدخال
function backspace() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput);
}

// حساب النسبة المئوية
function calculatePercentage() {
    if (currentInput === '') return;
    const result = parseFloat(currentInput) / 100;
    updateDisplay(result);
    currentInput = result.toString();
}

// تحديد العملية الحسابية
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

// حساب النتيجة
async function calculateResult() {
    if (currentInput === '' || firstOperand === '') return;

    const expression = currentInput.split(/(\+|−|×|÷)/);
    firstOperand = expression[0];
    operator = expression[1];
    secondOperand = expression[2];

    const result = performCalculation(operator, firstOperand, secondOperand);
    updateDisplay(result);

    // حفظ النتيجة في LocalStorage
    saveToLocalStorage(currentInput, result);

    // إعادة تعيين المتغيرات
    currentInput = result;
    operator = '';
    firstOperand = '';
    secondOperand = '';
}

// إجراء العمليات الحسابية
function performCalculation(operator, a, b) {
    a = parseFloat(a);
    b = parseFloat(b);

    switch (operator) {
        case '+':
            return a + b;
        case '−':
            return a - b;
        case '×':
            return a * b;
        case '÷':
            return a / b;
        default:
            return 0;
    }
}

// تحديث الشاشة
function updateDisplay(value) {
    display.value = value;
}

// حفظ البيانات في LocalStorage
function saveToLocalStorage(operation, result) {
    const history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
    history.push({ operation, result });
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
}

// عرض آخر نتيجة محفوظة عند تحميل الصفحة
window.onload = () => {
    const lastResult = localStorage.getItem('lastResult');
    if (lastResult) {
        updateDisplay(lastResult);
    }
};