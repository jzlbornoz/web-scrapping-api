import express from "express";
import { routerApi } from "./routes/index";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res: express.Response) => {
    res.send("hola");
})

routerApi(app);

app.listen(PORT, () => {
    console.log("servidor en el puerto " + PORT);
})