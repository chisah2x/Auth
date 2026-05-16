import app from "./app.js";
import connectDB from "./config/database.js";
const PORT = 3000;
const HOST = "0.0.0.0";

async function startServer() {
    try {
        // DB connect is async and can fail on bad URI/network, so guard startup.
        await connectDB();
        // app.listen(PORT, HOST, () => {
        //     // Binding 0.0.0.0 allows requests from other devices on the same LAN.
        //     console.log(`Server is running on http://localhost:${PORT}`);
        // });
        app.listen(PORT, () => {
            // Binding 0.0.0.0 allows requests from other devices on the same LAN.
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Server startup failed: ", err.message);
        process.exit(1); // Exit with failure code if DB connection fails, preventing server from running in a bad state.
    }
}

startServer();