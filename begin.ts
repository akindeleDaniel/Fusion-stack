import express from "express"
import fs from 'fs'
import path from 'path'
import { Response, Request, NextFunction} from 'express'
const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())
app.get("/", (req, res) =>{
    res.json({message: "Server is running"})
})


app.listen(PORT, () => {
    console.log(`server running on http://localhost:3000`)
})
const usersFile = path.join(__dirname, "data", "users.json")
app.get('/users',(req,res) =>{
    const data =fs.readFileSync(usersFile,"utf-8")
    const users= JSON.parse(data)
    res.json(users)
})

type users = {
    firstName: string,
    lastName: string,
    password: number,
    email: string,
    phone: number
}

const blockGmail = (req: Request, res: Response, next: Function) => {
  const email: string = req.body.email

  if (email && email.endsWith("@gmail.com")) {
    return res.status(400).json({ message: "Gmail addresses are not allowed" })
  }

  return next()
};

app.post("/users", blockGmail, (req, res) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(req.body.email)) {
  return res.status(400).json({ message: "Invalid email format" });
}

  try {
    const data: string = fs.readFileSync(usersFile, "utf-8")
    const users: users[] = JSON.parse(data)

    const newUser: users = req.body 
    users.push(newUser)

    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))
    return res.status(201).json({newUser})
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Could not add user" })
  }
})


app.post("/login", (req, res)=> {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(req.body.email)) {
  return res.status(400).json({ message: "Invalid email format" });
}

  try{
    const data: string = fs.readFileSync(usersFile, "utf-8")
    const users: users[] = JSON.parse(data)
    
    const { email, password}: {email:string, password: number} = req.body
    
    const user = users.find( u => u.email === email && u.password === password)

    if (user){
      return res.status(201).json({ message: "Login successful", users}) 
    } else {
      return res.status(401).json({ error: "invalid email or password"})
    }
  }catch (err){
    console.error(err)
    return res.status(500).json({ error: "Something went wrong"})
  }
})

app.put("/users/:email", (req, res): void =>{
  try{
    const data : string = fs.readFileSync(usersFile, "utf-8")
    const users: users[]  = JSON.parse(data)

    const email = req.params.email
    const updatedData : Partial<users> = req.body 
    
    const userIndex = users.findIndex(u => u.email === email)
    if (userIndex === -1){
      res.status(404).json({error: "User not found"})
      return
    }
    users[userIndex] = 
    {...users[userIndex], ...updatedData} as users

    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))
    res.json({message: "User updated successfully", user: users[userIndex]})
  }catch(err){
    console.error(err)
    res.status(500).json({ error: "Couldn't update user"})
  }
})

app.delete("/users/:email", (req, res) => {
  const data = fs.readFileSync(usersFile, "utf-8");
  const users: users[] = JSON.parse(data);

  const filtered = users.filter((user) => user.email !== req.params.email);

  fs.writeFileSync(usersFile, JSON.stringify(filtered, null, 2));

  res.json({ message: "User deleted successfully" });
});
