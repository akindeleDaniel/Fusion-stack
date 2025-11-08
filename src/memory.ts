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
    dateOfBirth: string
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
    const {firstName,lastName,email,dateOfBirth,password,gender} = req.body

    if (!firstName||!lastName||!email||!dateOfBirth||!password||!gender){
       res.status(400).json({message:'All areas reqiured'})
        return }

        const newUser: User= {
            firstName,
            lastName,
            email,
            dateOfBirth,
            password,
            gender
        }

        const emailFormat= /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailFormat.test(email)){
            res.status(400).json({error:'Invalid email format'})
        return }
                // Date of birth 

        const dobcheck =req.body.dateOfBirth
        const dobFormat = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{2}$/
        if (!dobFormat.test(dateOfBirth)){
            res.status(400).json({error:'Invalid date of birth format'})
        return }

        const[day,month,year] = dateOfBirth.split("/").map(Number)
        const birthDate = new Date(year,month - 1,day)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const actualMonth = today.getMonth() - birthDate.getMonth()
        if (actualMonth < 0 || (actualMonth === 0 && today.getDate() < birthDate.getDate())){
            age--
        }

        if (age > 120 || age < 12 || isNaN(age)){
            res.status(400).json({error: 'Inavlid date of birth'})
        return}




        users.push(newUser)

        res.status(200).json({message:'Registration sucessful', data:newUser})
})

app.listen(PORT, () =>{
    console.log(`server running at http://localhost:${PORT}`)
})
