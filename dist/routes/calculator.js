"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
exports.router = (0, express_1.Router)();
exports.router.use(middlewares_1.logger);
exports.router.get('/', (req, res) => {
    res.status(202).send({
        message: 'Get all calculation',
        data: [
            { id: 1, result: 1 },
            { id: 2, result: 2 }
        ]
    });
});
exports.router.get('/:id', (req, res) => {
    res.status(202).send({
        message: 'Get calculation by ID',
        id: req.params.id,
        results: 1,
    });
});
exports.router.post('/', middlewares_1.validateCalculatorRequest, (req, res) => {
    const { operator, operand1, operand2 } = req.body;
    let result;
    switch (operator) {
        case '+':
            result = operand1 + operand2;
            break;
        case '-':
            result = operand1 - operand2;
            break;
        case '*':
            result = operand1 * operand2;
            break;
        case '/':
            result = operand1 / operand2;
            break;
        default:
            result = 'Invalid operator';
            break;
    }
    res.send({
        message: 'Create new calculation',
        result
    });
});
//# sourceMappingURL=calculator.js.map