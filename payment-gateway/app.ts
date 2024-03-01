import express from "express";
import bodyParser from "body-parser";
import routes from "./routes/index";

const app: express.Application = express();
const PORT: number = 3000;

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
