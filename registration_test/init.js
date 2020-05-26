const app = require("./app");
const dotenv = require("dotenv").config();

const PORT = process.env.PORT;

function handleListening(){
    console.log("Listening... PORT IS " + PORT);

}

app.listen(PORT, handleListening);
