import express, {Application, Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors";
import { DBConnections } from "./db/DBConnections";
import userRouter from "./routers/users/userRouter";
import cartRouter from "./routers/carts/cartRouter";
import productRouter from "./routers/products/productRouter";
import orderRouter from "./routers/orders/orderRouter";
import categoryRouter from "./routers/categories/categoryRouter";
import addressRouter from "./routers/addresses/addressRouter";

const app: Application = express();

// configure the express
app.use(express.json());
app.use(cors());
dotenv.config({path: "./.env"});

const port: string | number | undefined = Number(process.env.PORT) || 9000;
const dbUrl: string | undefined = process.env.EXPRESS_APP_MONGO_DB_CLOUD_URL;
const dbName: string | undefined = process.env.EXPRESS_APP_MONGO_DB_DATABASE_NAME;

app.get('/', (request: Request, response: Response) => {
    return response.status(200).json({
        msg: "Welcome to E-Commerce App 2023"
    })
})

// configure the routes
app.use("/api/users", userRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);

if (port) {
    app.listen(Number(port), () => {
        if (dbName && dbUrl) {
            DBConnections.connectToDB(dbUrl, dbName).then((message) => {
                console.log(message);
            }).catch((error) => {
                console.log(error);
            })
        }
        console.log(`Express Server is started @ ${port}`);
    })
}
