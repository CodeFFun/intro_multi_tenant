import express from "express"
import mongoose from "mongoose"
// import CentralSchema from "./modal/CentralModal.js";
import TodoSchema from "./modal/TodoModal.js";
import checkDatabaseExist from "./database/checkDatabaseExist.js";

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.post("/new_organization", async (req, res) => {
    const { organization_name } = req.body;

    try {
        const centralConnection = await mongoose.createConnection(
            "mongodb://127.0.0.1:27017/centralDB"
        );
        const CentralModel = centralConnection.model("CentralDB", new mongoose.Schema({
            name: String, // Define fields for central DB schema
        }));
        await CentralModel.create({ name: organization_name });
        await centralConnection.close();
        const tenantConnection = await mongoose.createConnection(
            `mongodb://127.0.0.1:27017/${organization_name}`
        );
        const TenantModel = tenantConnection.model("Todo", TodoSchema);
        await TenantModel.createCollection();
        await tenantConnection.close();
        res.send(`Organization ${organization_name} created successfully.`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("An error occurred while creating the organization.");
    }
});


app.post("/todo", async (req, res) => {
    const host = req.hostname.split(".")[0];
    const data = req.body;
    try {
        // Use createConnection to avoid global Mongoose connection conflicts
        const tenantConnection = await mongoose.createConnection(`mongodb://127.0.0.1:27017/${host}`);
        const TodoModel = tenantConnection.model("Todo", TodoSchema);

        await TodoModel.create(data);
        res.send("Todo created successfully");
        await tenantConnection.close(); // Close tenant connection
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});
app.patch("/todo", async (req, res) => {
    const host = req.hostname.split(".")[0];
    const data = req.body;
    try {
        // Use createConnection to avoid global Mongoose connection conflicts
        const tenantConnection = await mongoose.createConnection(`mongodb://127.0.0.1:27017/${host}`);
        const TodoModel = tenantConnection.model("Todo", TodoSchema);

        await TodoModel.updateOne(data).where({title: data.title});
        res.send("Todo updated successfully");
        await tenantConnection.close(); // Close tenant connection
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

app.listen(2000, () => {
    console.log("App is running on port 2000")
})
