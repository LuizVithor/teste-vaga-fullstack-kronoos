"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCPForCNPJ = validateCPForCNPJ;
function validateCPForCNPJ(value) {
    value = value.replace(/[^\d]/g, '');
    if (value.length === 11) {
        return validateCPF(value);
    }
    else if (value.length === 14) {
        return validateCNPJ(value);
    }
    else {
        return false;
    }
}
function validateCPF(cpf) {
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }
    const calculateDigit = (cpf, factor) => {
        let sum = 0;
        for (let i = 0; i < factor - 1; i++) {
            sum += parseInt(cpf[i]) * (factor - i);
        }
        let digit = (sum * 10) % 11;
        return digit === 10 ? 0 : digit;
    };
    const digit1 = calculateDigit(cpf, 10);
    const digit2 = calculateDigit(cpf, 11);
    return digit1 === parseInt(cpf[9]) && digit2 === parseInt(cpf[10]);
}
function validateCNPJ(cnpj) {
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
        return false;
    }
    const calculateDigit = (cnpj, factor) => {
        let sum = 0;
        let pos = factor - 7;
        for (let i = 0; i < factor - 1; i++) {
            sum += parseInt(cnpj[i]) * pos--;
            if (pos < 2)
                pos = 9;
        }
        const digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        return digit;
    };
    const digit1 = calculateDigit(cnpj, 12);
    const digit2 = calculateDigit(cnpj, 13);
    return digit1 === parseInt(cnpj[12]) && digit2 === parseInt(cnpj[13]);
}
