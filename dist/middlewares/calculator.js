"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCalculatorRequest = validateCalculatorRequest;
function validateCalculatorRequest(req, res, next) {
    const { operator, operand1, operand2 } = req.body;
    if (typeof operand1 !== 'number' || typeof operand2 !== 'number') {
        return res.status(400).send('operands must be numbers');
    }
    if (operator !== '+' && operator !== '-' && operator !== '*' && operator !== '/') {
        return res.status(400).send('operator must be +,-,*,/');
    }
    return next();
}
//# sourceMappingURL=calculator.js.map