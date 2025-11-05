import { timeStamp } from "console";
import { Request} from "express"; 
import { Router } from "express";
import { addTimestamp } from "../middlewares";
export const router= Router()



router.get('/', (req: Request, res) => {
    throw new Error('Application error')
    res.status(202).send({message:'OK', timestamp:req.timestamp})
}) 