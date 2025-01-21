
import express,{Request, Response} from "express";
import Omise from "omise";
const app = express();
const port : number = 3000;

const omise = Omise({
    publicKey : "PUBLIC OPN KEY",
    secretKey : "SECRET OPN KEY"
})


app.use("/",express.static("public"))


app.get(
    "/promptpay/:id",
    async(req : Request, res : Response) => {
        // console.log(req.params?.id)
        // res.send("promptpay")
        const result = await omise.charges.create({
            amount : 10000,
            currency : "THB",
            source : req.params?.id
        })


        res.json(result)
    }
)


app.get(
    "/hello",
    (req : Request , res : Response) => {
        res.send("Hello Bro!!")
    }
)






app.listen(
    port,
    ()=> {
        console.log(`App Listening at http://localhost:${port}`)
    }
)