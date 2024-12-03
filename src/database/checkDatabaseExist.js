
import mongoose from "mongoose"

const checkDatabaseExist = async (dbName) => {
    try {
        // Connect to MongoDB (connect to the admin database)
        await mongoose.connect('mongodb://localhost:27017/admin', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Get the admin database
        const adminDb = mongoose.connection.db.admin();

        // List all databases
        const databases = await adminDb.listDatabases();
        const dbExists = databases.databases.some((db) => db.name === dbName);
        await mongoose.disconnect();
        return dbExists;
    } catch (error) {
        console.error('Error checking database existence:', error);
        await mongoose.disconnect();
        throw error;
    }
};

export default checkDatabaseExist

