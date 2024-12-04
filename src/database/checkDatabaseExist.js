
import mongoose from "mongoose"

const checkDatabaseExist = async (dbName) => {
    let adminConnection;
    try {
        adminConnection = await mongoose.createConnection("mongodb://localhost:27017/admin");
        const adminDb = adminConnection.db.admin();
        const databases = await adminDb.listDatabases();
        const dbExists = databases.databases.some((db) => db.name === dbName);
        await adminConnection.close();
        return dbExists;
    } catch (error) {
        if (adminConnection) await adminConnection.close();
        throw error;
    }
};

export default checkDatabaseExist

