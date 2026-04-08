import server from "./index";
server.start(Number(process.env.PORT));
console.log("server is started");
console.log(`http://localhost:${process.env.PORT}`);
