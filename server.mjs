import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const productSchema = new mongoose.Schema({
    productName: String,
    productPrice: Number,
    currencyCode: String,
    numberOfSale: Number,
    rating: Number,
    isFreeShipping: Boolean,
    shopName: String,
    createdOn: { type: Date, default: Date.now },
});
const productModel = mongoose.model('Product', productSchema);

let app = express();
app.use(express.json());
app.use(cors());

app.get("/products", async (req, res) => {
    try {
        let result = await productModel.find({});
        res.send({
            message: "all products success",
            data: result
        });
    } catch (e) {
        console.log("error in db: ", e);
        res.status(500).send({ message: "error in getting all products" });
    }
});

app.get("/product/:id", async (req, res) => {
    try {
        let result = await productModel.findOne({ _id: req.params.id });
        res.send({
            message: "product found",
            data: result
        });
    } catch (e) {
        console.log("error in db: ", e);
        res.status(500).send({ message: "error in getting product by id" });
    }
});

app.post("/product", async (req, res) => {
    let body = req.body;

    if (
        !body.productName ||
        !body.productPrice ||
        !body.currencyCode ||
        !body.numberOfSale ||
        !body.rating ||
        !body.isFreeShipping ||
        !body.shopName
    ) {
        res.status(400).send({
            message: `required field missing, all fields are required: 
            productName
            productPrice
            currencyCode
            numberOfSale
            rating
            isFreeShipping
            shopName`
        });
        return;
    }

    try {
        let result = await productModel.create({
            productName: body.productName,
            productPrice: body.productPrice,
            currencyCode: body.currencyCode,
            numberOfSale: body.numberOfSale,
            rating: body.rating,
            isFreeShipping: body.isFreeShipping,
            shopName: body.shopName,
        });
        console.log("result: ", result);
        res.send({ message: "product is added in database" });
    } catch (e) {
        console.log("error in db: ", e);
        res.status(500).send({ message: "db error in saving product" });
    }
});

app.delete("/product/:id", async (req, res) => {
    let _id = req.params.id;
    try {
        const result = await productModel.findByIdAndDelete(_id);
        console.log("Deleted product: ", result);
        res.send({
            message: "deleted"
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "db error"
        });
    }
});

app.put("/product/:id", async (req, res) => {
    let _id = req.params.id;
    let body = req.body;
    try {
        const result = await productModel.findByIdAndUpdate(_id, body);
        console.log("updated product: ", result);
        res.send({
            message: "updated"
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "db error"
        });
    }
});

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`app is running on ${PORT}`);
});

// MongoDB Connection
let dbURI = 'mongodb+srv://Mustafa28:mustafa28012801@cluster0.tyx6s.mongodb.net/myVirtualDatabase?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

mongoose.connection.on('connected', function () {
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
