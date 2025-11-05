import { Router, Request } from "express";
import { logger, validateCalculatorRequest } from "../middlewares";
import { timeStamp } from "console";
import { calculatorRequestBody } from "../types";
export const router = Router()
router.use(logger)

router.get('/',(req: Request, res) =>{
    res.status(202).send({
        message:'Get all calculation',
        data:[
            {id:1, result:1},
            {id:2, result:2}
    ]})
})


router.get('/:id', (req: Request, res)=>{
    res.status(202).send({
        message: 'Get calculation by ID',
        id:req.params.id,
        results: 1,
    })
})
router.post('/', validateCalculatorRequest, (req:Request<{}, any, calculatorRequestBody>, res) =>{
    const {operator, operand1, operand2} = req.body
    let result : number|string
    switch (operator){
        case '+':
            result = operand1 + operand2
            break
        case '-':
            result = operand1 - operand2
            break
        case '*':
            result= operand1 * operand2
            break
        case '/':
            result = operand1 / operand2
            break
        default:
            result= 'Invalid operator'
            break
    }
    res.send({
        message: 'Create new calculation',
        result
    })
})