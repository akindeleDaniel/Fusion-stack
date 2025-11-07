import express, {Response, Request, NextFunction} from 'express'
const app = express()
const PORT = 3000
app.use(express.json())     

app.use((err:Error,req:Request,res:Response, next:NextFunction)=>{
    console.log(err.message)
    res.status(500).json({error:err.message})
}) 

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
// authorization
function authorization(req:Request,res:Response,next:NextFunction){
    const apiKey = req.headers["x-api-key"]
    if (apiKey !== "12345"){
        return res.status(401).json({error:"Unauthorized"})
    }
    return next()
}


app.use(logger)
app.use(requestCounter)

interface User  {
    firstName:string,
    lastName: string
    email:string
    DateOfBirth: string
    password:string
    gender:string
}

const users:User[] = []

app.get("/", (req:Request, res:Response)=>{
    res.json({ message:"Hello!" })
}) 

app.get('/secret', authorization, (req:Request, res:Response) =>{
    res.json({ message:'Secret unlocked'})
})

app.get('/profile',logger,authorization,(req:Request,res:Response)=>{
    res.json({Name: 'Danny',Role: 'Admin'})
})

app.post('/register',(req:Request,res:Response)=>{
    const {firstName,lastName,email,DateOfBirth,password,gender} = req.body

    if (!firstName||!lastName||!email||!DateOfBirth||!password||!gender){
       res.status(400).json({message:'All areas reqiured'})
        return }

        const newUser: User= {
            firstName,
            lastName,
            email,
            DateOfBirth,
            password,
            gender
        }
        users.push(newUser)

        res.status(200).json({message:'Registration sucessful', data:newUser})
})

app.listen(PORT, () =>{
    console.log(`server running at http://localhost:${PORT}`)
})
