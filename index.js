const express = require("express");
const app = express();
const APIKEY = require('./apikey')
console.log(APIKEY.key)

const mongouser = process.env['Mongo_User']
const mongopassword = process.env['Mongo_Password']



const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://TicketBot:RDs74YoKBLY34EApfnpJF8G6iHEnXMgTcBdh3M4t@main.hkwzs.mongodb.net/TicketBot?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;

db.on("error", console.error.bind(console,
  "connection error:"));

db.once("open", function () {
  console.log("Connection To MongoDB Atlas Successful!");
});

// First of all you require Express

app.get("/", (request, response) => {
  response.send("Hi, This Is A Tutorial Api . . .");
});
// Now you setup a GET route at / which is basically
// the Homepage of your app

const listener = app.listen('80', () => {
  console.log("Your app is listening on port " + listener.address().port);
});
// And Finally you make the app listen to a port.

// Settings

app.get("/api/settings", (request, response) => {
  response.send("Please now use /api/v1/settings")
})

app.get("/api/v1/settings", (request, response) => {
  response.send("Ticket Settings API")
})

app.get(`/api/v1/`, (request, response) => {
  response.send("Ticket Settings API")
})

require('./models/settings')
const playerModel = mongoose.model('TicketData')

app.get(`/api/v1/settings/:id/apikey=:key`, async (request, response) => {
  async function playerDataCheck() {
    const playerData = await playerModel.findOne({ ServerID: `${request.params.id}`, APIKey: `${request.params.key}` })

    if (playerData) {
      return playerData
    } else {
      return (`No API or Server is not found`)
    }
  }

  response.json(await playerDataCheck());
});

// Tickets 

app.get("/api/v1/tickets", (request, response) => {
  response.send("Ticket tickets API")
})

require('./models/tickets')
const TicketClaim = mongoose.model('TicketClaim')

app.get("/api/v1/tickets/:server/:id/apikey=:key", async (request, response) => {
  async function TicketClaim2Check() {
    const TicketClaim02 = await playerModel.findOne({ ServerID: `${request.params.server}`, APIKey: `${request.params.key}` })
    const TicketClaim2 = await TicketClaim.findOne({ TicketIDs: `${request.params.id}` })

    if (TicketClaim2 && TicketClaim02) {
      return TicketClaim2
    } else {
      return (`No API or Ticket is not found`)
    }
  }

  response.json(await TicketClaim2Check());
});

// commands 

app.get("/api/v1/commands", (request, response) => {
  response.send("Commands API")
})

require('./models/cmds')
const CommandsClaim = mongoose.model('cnds')

app.get("/api/v1/commands/:id/apikey=:key", async (request, response) => {
  async function commandsCheck() {
    const CommandsClaim02 = await playerModel.findOne({ APIKey: `${request.params.key}` })
    const CommandsClaim2 = await CommandsClaim.findOne({ Guild: `${request.params.id}` })

    if (CommandsClaim2 && CommandsClaim02) {
      return CommandsClaim2
    } else {
      return (`No Server is not found or no commands has been disabled`)
    }
  }

  response.json(await commandsCheck());
});

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());


app.get("/api/v1/post", (request, response) => {
  response.send("Post API")
})

// We create a POST route
app.post("/api/v1/post/tickets/reason/:server/:id/apikey=:api/:message", async (request, response) => {
  // We use a mongoose method to find A record and update!
  const test1 =  await playerModel.findOne({ ServerID: `${request.params.server}`, APIKey: `${request.params.api}` })

  if (test1) {
    await TicketClaim.findOneAndUpdate(
      { TicketIDs: `${request.params.id}` },
      { $set: { reason: request.params.message } }
    );
    response.send(`Updated ${request.params.server} server ticket: ${request.params.id} reason with the new following reason: ${request.params.message}`);
  } else {
    return('Failed')
  }
});

app.post("/api/v1/post/id/tracker/:server/apikey=:api/:newid", async (request, response) => {
  // We use a mongoose method to find A record and update!
  const test1 =  await playerModel.findOne({ ServerID: `${request.params.server}`, APIKey: `${request.params.api}` })

  if (test1) {
    await playerModel.findOneAndUpdate(
      { ServerID: `${request.params.server}` },
      { $set: { TicketTrackerChannelID: request.params.newid } }
    );
    response.send(`Updated ${request.params.server} Ticket Tracker ID`);
  } else {
    return('Failed')
  }
});

app.post("/api/v1/post/id/ticket/:server/apikey=:api/:newid", async (request, response) => {
  // We use a mongoose method to find A record and update!
  const test1 =  await playerModel.findOne({ ServerID: `${request.params.server}`, APIKey: `${request.params.api}` })

  if (test1) {
    await playerModel.findOneAndUpdate(
      { ServerID: `${request.params.server}` },
      { $set: { TicketChannelID: request.params.newid } }
    );
    response.send(`Updated ${request.params.server} Ticket Channel ID`);
  } else {
    return('Failed')
  }
});

app.post("/api/v1/post/id/support/:server/apikey=:api/:newid", async (request, response) => {
  // We use a mongoose method to find A record and update!
  const test1 =  await playerModel.findOne({ ServerID: `${request.params.server}`, APIKey: `${request.params.api}` })

  if (test1) {
    await playerModel.findOneAndUpdate(
      { ServerID: `${request.params.server}` },
      { $set: { SupportRoleID: request.params.newid } }
    );
    response.send(`Updated ${request.params.server} Support Role ID`);
  } else {
    return('Failed')
  }
});

app.post("/api/v1/post/Prefix/:server/apikey=:api/:newid", async (request, response) => {
  // We use a mongoose method to find A record and update!
  const test1 =  await playerModel.findOne({ ServerID: `${request.params.server}`, APIKey: `${request.params.api}` })

  if (test1) {
    await playerModel.findOneAndUpdate(
      { ServerID: `${request.params.server}` },
      { $set: { Prefix: request.params.newid } }
    );
    response.send(`Updated ${request.params.server} prefix!`);
  } else {
    return('Failed')
  }
});

