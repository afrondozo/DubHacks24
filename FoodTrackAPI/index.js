import express from "express";
import serverless from "serverless-http";
import cors from "cors";
<<<<<<< HEAD
import { fetchUsers, createUser } from "./dynamo.js";
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, createSNSEndpoint, checkAndScheduleNotifications } from './awsNotificationService';
=======
import { fetchUsers, getUser, createUser, addFoodItem, deleteFoodItem } from "./dynamo.js";

>>>>>>> 2267ce0e2491c70e06e4f6fd327b93f3da94a2a9


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [snsEndpointArn, setSnsEndpointArn] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  }, []);

  useEffect(() => {
    if (expoPushToken) {
      createSNSEndpoint(expoPushToken).then(endpointArn => setSnsEndpointArn(endpointArn));
    }
  }, [expoPushToken]);

  // ... rest of your App component
}
const app = express();
const port = 3001;

app.use(express.json());

if (process.env.DEVELOPMENT) {
    app.use(cors());
};

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/dynamo/:UserID', async (req, res) => {
    try {
        const { UserID } = req.params;
        const foods = await getUser(UserID);

        res.send(foods)
    } catch (err) {
        res.status(400).send(`Error fetching users: ${err}`)
    }
  });

app.post('/dynamo', async (req, res) => {
    try {
        const parsedBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { UserID } = parsedBody;

        const response = await createUser(UserID);
        res.send(response)
    } catch (err) {
        res.status(400).send(`Error creating user: ${err}`);
    }
});

app.put('/dynamo/:UserID', async (req, res) => {
    try {
        const { username, foodItem, expirationDate } = req.body;
        const response = await addFoodItem(username, foodItem, expirationDate);
        res.send(response)
    } catch (err) {
        res.status(400).send(`Error updating food items: ${err}`);
    }
});

app.delete('/dynamo/:UserID/foods', async (req, res) => {
    try {
        const { UserID } = req.params;  // Extract UserId from the URL parameters
        const { foodItem } = req.body;  // Get the foodItem to delete from the request body
        const response = await deleteFoodItem(UserID, foodItem);  // Call the deleteFoodItem function
        res.status(200).send(response);
    } catch (err) {
        res.status(400).send(`Error deleting food item: ${err}`);
    }
});

if (process.env.DEVELOPMENT) {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    });
}


export const handler = serverless(app);