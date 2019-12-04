const express = require("express");
const MongoClient = require("mongodb");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql");
//const graphqlSchema = require('./graphql/schema');
//const graphqlResolver = require('./graphql/resolvers');
const { buildSchema } = require("graphql");

var db = require("./config/db");
var app = express();

const port = 8000;
app.use(bodyParser.json());


app.use('/graphql', graphqlHTTP({
    schema: buildSchema('type RootQuery{' +
        'events: [String!]!' +
        '},' +
        'type RootMutation{' +
        'createEvent(name: String): String' +
        '},' +
        'schema{' +
        'query: RootQuery,' +
        'mutation: RootMutation' +
        '}'),
    rootValue: {
        events: () =>{
            return ['Hello1','Hello2','Hello3'];
        },
        createEvent: (args)=>{
            const eventName = args.name;
            return eventName;
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

    app.listen(process.env.PORT || port, () => {
      console.log(
        "Express server listening on port %d in %s mode - We Are lIVE!",
        port,
        app.settings.env
      );
    });
  }
);
