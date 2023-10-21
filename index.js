// imports packages
import express from "express"
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from "cors";

// imports routes
import products from "./routes/productsRoutes.js";
import categories from "./routes/categoriesRoutes.js";

// methods
const app = express();
dotenv.config();

// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB working correctly');
})
.catch((error) => {
    console.error('Error al conectar con MongoDB:', error);
});

// routes
app.use("/api/products", products);
app.use("/api/categories", categories);

// init server
const port = process.env.PORT;
app.listen(port, () => console.log(`The server is start in port ${port}`));