import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { fetchUsers, createUser } from "./dynamo.js";

const app = express();
const port = 3001;

app.use(express.json);
if (process.env.DEVELOPMENT) {
    app.use(cors());
};

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/dynamo', async (req, res) => {
    try {
        const users = await fetchUsers();
        res.send(users.Items)
    } catch (err) {
        res.status(400).send(`Error fetching users: ${err}`)
    }
  });

// app.post('/', async (req, res) => {
//   res.send('Hello World!')
// });

// app.put('/', async (req, res) => {
//     res.send('Hello World!')
// });

// app.delete('/', async (req, res) => {
//   res.send('Hello World!')
// });

if (process.env.DEVELOPMENT) {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    });
}


export const handler = serverless(app);