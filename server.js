const express = require("express");
const MongoClient = require("mongodb");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql");
//const graphqlSchema = require('./graphql/schema');
//const graphqlResolver = require('./graphql/resolvers');
const { buildSchema } = require("graphql");
const mongoose = require('mongoose');
const Event = require('./models/event');

var db = require("./config/db");
var app = express();

const port = 8000;
app.use(bodyParser.json());

app.use((req,res,next)=>{
   // console.log(res.status());
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type');
    if (req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});



app.use('/graphql', graphqlHTTP({
    schema: buildSchema('type Event{' +
        '_id: ID!,' +
        'num1: String!,' +
        'num2: String!,' +
        'addition: String!,' +
        'multiply: String!' +
        '},' +
        'input EventInput{' +
        'num1: String!,' +
        'num2: String!' +
        '},' +
        'type RootQuery{' +
        'events: [Event!]!' +
        '},' +
        'type RootMutation{' +
        'createEvent(eventInput:EventInput): Event' +
        '},' +
        'schema{' +
        'query: RootQuery,' +
        'mutation: RootMutation' +
        '}'),
    rootValue: {
        events: () =>{
            return Event.find()
                .then(events =>{
                    return events.map(event => {
                        return {...event._doc, _id: event.id};
                    })
                })
                .catch(err => {
                    throw err;
                })
        },
        createEvent: (args)=>{
            let tempnum1 = args.eventInput.num1;
            let tempnum2 = args.eventInput.num2;
            let tempaddition = (Number(tempnum1)+Number(tempnum2)).toString();
            let tempmultiply = (+tempnum1*(+tempnum2)).toString();
            const event = new Event({
                num1:tempnum1,
                num2:tempnum2,
                addition:tempaddition,
                multiply:tempmultiply
            })
            console.log(event);
            return event
                .save()
                .then( result =>{
                    console.log(result);
                    return event;
                }).catch(err =>{
                    console.log(err);
                    throw err;
                });
            //return event;
        }
    },
    graphiql: true
}));


MongoClient.connect(
    db.url,
    { useUnifiedTopology: true },
    { useNewUrlParser: true },
    (err, database) => {
        if (err) return console.log(err);

        db = database.db("reactassignmentserver");
        require("./app/routes")(app, db);
        mongoose.connect("mongodb+srv://laelav:laelav1@reactassignment-lmlti.mongodb.net/numbers?retryWrites=true&w=majority\n");
        app.listen(process.env.PORT || port, () => {
            console.log(
                "Express server listening on port %d in %s mode - We Are lIVE!",
                port,
                app.settings.env
            );
        });
    }
);

