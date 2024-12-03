import mongoose from "mongoose"    

const centralModal = new mongoose.Schema({
    _id: String,
    name: String
})

export default mongoose.Model("CentralModal", centralModal)
