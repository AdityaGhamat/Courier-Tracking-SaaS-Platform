import server from "./index";
import "./modules/core/jobs/jobs.processor";
server.start(Number(process.env.PORT));
console.log("server is started");
console.log(`http://localhost:${process.env.PORT}`);
