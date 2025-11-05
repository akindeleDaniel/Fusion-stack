import express, {Request, Response} from "express"
import fs from "fs"

const app = express()
const PORT = 3000
const USERS_FILE = "./users.json"

app.use(express.json())

interface User {
    firstName: string 
    lastName: string
    phone: number 
    email: string
    address: string 
    password: number
}

// ===== Helper functions =====
function readUsers(): User[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data || "[]");
}

function writeUsers(users: User[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ===== Routes =====

// REGISTER
app.post("/register", (req: Request, res: Response):void =>  {
  const { firstName, lastName, phone, email, address, password } = req.body;

  if (!firstName || !lastName || !phone || !email || !address || !password) {
    res.status(400).json({ message: "All fields are required" });
       return
  }

  const users = readUsers();

  if (users.find((u) => u.email === email)) {
    res.status(409).json({ message: "Email already registered" });
  }

  const newUser: User = { firstName, lastName, phone, email, address, password };
  users.push(newUser);
  writeUsers(users);

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({
    message: "Registered successfully",
    user: userWithoutPassword,
  });
});

// LOGIN
app.post("/login", (req: Request, res: Response): void => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user)  res.status(401).json({ message: "Invalid credentials" });

  res.status(200).json({ message: "Login successful" });
});

// UPDATE
app.put("/update", (req: Request, res: Response):void => {
  const users = readUsers()
  const emailParam = req.params.email
  const { email, firstName, lastName, address, password } = req.body;

  if (!email)
    res.status(400).json({ message: "Email is required to update" });

  const user = users.find((u) => u.email === email);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return
  }
   user.firstName = firstName || user.firstName;
   user.lastName = lastName || user.lastName;
   user.address = address || user.address;
   user.password = password || user.password;

  writeUsers(users);
  res.status(200).json({ message: "Updated successfully" });
});

// DELETE
app.delete("/delete", (req: Request, res: Response):void => {
  const { email } = req.body;
  if (!email)  res.status(400).json({ message: "Email is required" });

  let users = readUsers();
  const initialLength = users.length;
  users = users.filter((u) => u.email !== email);

  if (users.length === initialLength)
     res.status(404).json({ message: "User not found" });

  writeUsers(users);
  res.status(200).json({ message: "Deleted successfully" });
});

// CATCH-ALL (not found)
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
