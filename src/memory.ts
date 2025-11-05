import express, {Response, Request, NextFunction} from 'express'
const app = express()
const PORT = 3000
app.use(express.json())     

// logger
function logger (req:Request,res:Response, next: NextFunction){
    console.log(`${req.url} ${req.method}`)
    next()
}

// requestcounter
let requestCount = 0
function requestCounter(req:Request, res:Response, next:NextFunction){
    requestCount++
    console.log(`Number of request: ${requestCount}`)
    next()
}
// validation
function validateUsers(req: Request, res:Response,next:NextFunction){
    const {name, email} = req.body

    if (!name || !email){
        return res.status(400).json({error:'Name and email reqiured'})
    }
    return next()
}


app.use(logger)
app.use(requestCounter)

app.get("/", (req:Request, res:Response)=>{
    res.json({ message:"Hello!" })
}) 

app.listen(PORT, () =>{
    console.log(`server running at http://localhost:${PORT}`)
})
