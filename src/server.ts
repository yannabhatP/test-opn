
import express,{Request, Response} from "express";
import Omise from "omise";
import cors from "cors";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import { createServer } from "node:http";
import dotenv from "dotenv"

const app = express();

dotenv.config()


const port : number = 3000;

const omise = Omise({
    publicKey : process.env.OPN_PKEY,
    secretKey : process.env.OPN_SKEY
})



app.use(bodyParser.urlencoded({ extended : false}))
app.use(bodyParser.json())

app.use(cors())

app.get(
    "/hello",
    (req : Request , res : Response) => {
        res.send("Hello Bro!!")
    }
)

app.post(
    "/charge",
    async( req : Request, res : Response) => {
        const { amount, currency, type, source }  = req.body
        const result = await omise.charges.create(
            {
                amount,
                currency,
                source
            }
        )
        res.json(result)
    }
)

const httpServer = createServer(app)
const io = new Server(httpServer,{ cors : { origin : "*"}})

io.on("connection",()=>{
})

app.post(
    "/opn-hook",
    (req : Request , _ : Response) => {
        // console.log(req.body.data)
        let val  : any = 
        {
            source : req.body.data.source.id,
            paid : req.body.data.paid,
            paidAt : req.body.data.paidAt
        }

        
        if(val.paid)
            io.emit(val.source,val)
    }
)



httpServer.listen(port,()=>console.log(`App Listening at http://localhost:${port}`))


// app.listen(
//     port,
//     ()=> {
//         console.log(`App Listening at http://localhost:${port}`)
//     }
// )