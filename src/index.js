import express from "express"
import mongoose from "mongoose"
import CentralModal from "./modal/CentralModal";
import TodoModal from "./modal/TodoModal";
import checkDatabaseExist from "./database/checkDatabaseExist";

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json())

const central = new CentralModal;
const todo = new TodoModal;

app.post("/new_organization", async (req, res) => {
    const {organization_name} = req.body
    //create a new database for tenants
    mongoose.connect(`mongoodb://127.0.0.1:27017/centralDB`).then(async () => {
       const org = await central({_id: `${organization_name}1`, name: `${organization_name}`})
        res.send(org)
    }).catch((e) => {
        console.log(e.message)
    })
    res.send(`Organization ${organization_name} created`)
})

app.post("/todo", async (req, res) => {
    const host = req.header.host
    const data = req.body
    if(!checkDatabaseExist(host)){
        res.send("Tenant not found")
        return
    }
    mongoose.conect(`mongodb://127.0.0.1:27017/${host}`).then(async () => {
       const Todo = await todo(data) 
        res.send(Todo)
    }).catch((e) => {
        console.log(e.message)
    })
})

app.listen(2000, () => {
    console.log("App is running on port 2000")
})
