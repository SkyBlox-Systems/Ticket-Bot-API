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

app.get('/api/v2/', (request, response) => {
  response.send('Ticket API v2')
})

app.get('/api/v2/post', (request, response) => {
  response.send('Ticket API POST v2')
})

require('./models/settings')
const playerModel = mongoose.model('TicketData')

// V2
app.get(`/api/v2/settings/:id/apikey=:key`, async (request, response) => {
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

app.get('/api/v2/settings/premium/:id/apikey=:key', async (request, response) => {
  async function playerDataCheck() {
    const playerData = await playerModel.findOne({ ServerID: `${request.params.id}`, APIKey: `${request.params.key}` })

    if (playerData.Tier === 'Premium') {
      return(`Tier: ${playerData.Tier} Premium code: ${playerData.PremiumCode} Premium Expire: ${playerData.PremiumExpire}  Ticket Length: ${playerData.TicketIDLength}  Voice Tickets: ${playerData.VoiceTicket}`)
      // return (`${playerData.Tier, playerData.PremiumCode, playerData.PremiumExpire, playerData.TicketIDLength, playerData.VoiceTicket}`)
    } else {
      return ('Guild dont have premium.')
    }
  }

  response.json(await playerDataCheck());
})

// V1 

// Settings


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

// API v1 POST
app.post("/api/v1/post/tickets/reason/:server/:id/apikey=:api/:message", async (request, response) => {
  // We use a mongoose method to find A record and update!
  const test1 = await playerModel.findOne({ ServerID: `${request.params.server}`, APIKey: `${request.params.api}` })

  if (test1) {
    await TicketClaim.findOneAndUpdate(
      { TicketIDs: `${request.params.id}` },
      { $set: { reason: request.params.message } }
    );
    response.send(`Updated ${request.params.server} server ticket: ${request.params.id} reason with the new following reason: ${request.params.message}`);
  } else {
    return ('Failed')
  }
});

app.post("/api/v1/post/id/tracker/:server/apikey=:api/:newid", async (request, response) => {
  // We use a mongoose method to find A record and update!
  const test1 = await playerModel.findOne({ ServerID: `${request.params.server}`, APIKey: `${request.params.api}` })

  if (test1) {
    await playerModel.findOneAndUpdate(
      { ServerID: `${request.params.server}` },
      { $set: { TicketTrackerChannelID: request.params.newid } }
    );
    response.send(`Updated ${request.params.server} Ticket Tracker ID`);
  } else {
    return ('Failed')
  }
});

app.post("/api/v1/post/id/ticket/:server/apikey=:api/:newid", async (request, response) => {
  // We use a mongoose method to find A record and update!
  const test1 = await playerModel.findOne({ ServerID: `${request.params.server}`, APIKey: `${request.params.api}` })

  if (test1) {
    await playerModel.findOneAndUpdate(
      { ServerID: `${request.params.server}` },
      { $set: { TicketChannelID: request.params.newid } }
    );
    response.send(`Updated ${request.params.server} Ticket Channel ID`);
  } else {
    return ('Failed')
  }
});

app.post("/api/v1/post/id/support/:server/apikey=:api/:newid", async (request, response) => {
  // We use a mongoose method to find A record and update!
  const test1 = await playerModel.findOne({ ServerID: `${request.params.server}`, APIKey: `${request.params.api}` })

  if (test1) {
    await playerModel.findOneAndUpdate(
      { ServerID: `${request.params.server}` },
      { $set: { SupportRoleID: request.params.newid } }
    );
    response.send(`Updated ${request.params.server} Support Role ID`);
  } else {
    return ('Failed')
  }
});

app.post("/api/v1/post/Prefix/:server/apikey=:api/:newid", async (request, response) => {
  // We use a mongoose method to find A record and update!
  const test1 = await playerModel.findOne({ ServerID: `${request.params.server}`, APIKey: `${request.params.api}` })

  if (test1) {
    await playerModel.findOneAndUpdate(
      { ServerID: `${request.params.server}` },
      { $set: { Prefix: request.params.newid } }
    );
    response.send(`Updated ${request.params.server} prefix!`);
  } else {
    return ('Failed')
  }
});

app.post("/api/v1/post/second/:server/apikey=:api", async (request, response) => {
  // We use a mongoose method to find A record and update!
  const test1 = await playerModel.findOne({ ServerID: `${request.params.server}`, APIKey: `${request.params.api}` })

  if (test1) {
    if (test1.SecondServer === 'Disabled') {
      await playerModel.findOneAndUpdate(
        { ServerID: `${request.params.server}` },
        { $set: { SecondServer: 'Enabled' } }
      );
      response.send(`Second Guild has been enabled.`);
    }
    if (test1.SecondServer === 'Enabled') {
      await playerModel.findOneAndUpdate(
        { ServerID: `${request.params.server}` },
        { $set: { SecondServer: 'Disabled' } }
      );
      response.send(`Second Guild has been disabled.`);
    }
  } else {
    return ('Failed')
  }
});

app.post("/api/v1/post/modmail/:server/apikey=:api", async (request, response) => {
  // We use a mongoose method to find A record and update!
  const test1 = await playerModel.findOne({ ServerID: `${request.params.server}`, APIKey: `${request.params.api}` })

  if (test1) {
    if (test1.ModMail === 'Disabled') {
      await playerModel.findOneAndUpdate(
        { ServerID: `${request.params.server}` },
        { $set: { ModMail: 'Enabled' } }
      );
      response.send(`ModMail has been enabled.`);
    }
    if (test1.ModMail === 'Enabled') {
      await playerModel.findOneAndUpdate(
        { ServerID: `${request.params.server}` },
        { $set: { ModMail: 'Disabled' } }
      );
      response.send(`ModMail has been disabled.`);
    }
  } else {
    return ('Failed')
  }
});

app.post("/api/v1/post/important/:server/apikey=:api", async (request, response) => {
  // We use a mongoose method to find A record and update!
  const test1 = await playerModel.findOne({ ServerID: `${request.params.server}`, APIKey: `${request.params.api}` })

  if (test1) {
    if (test1.Important === 'Disabled') {
      await playerModel.findOneAndUpdate(
        { ServerID: `${request.params.server}` },
        { $set: { Important: 'Enabled' } }
      );
      response.send(`Important announcements has been enabled.`);
    }
    if (test1.Important === 'Enabled') {
      await playerModel.findOneAndUpdate(
        { ServerID: `${request.params.server}` },
        { $set: { Important: 'Disabled' } }
      );
      response.send(`Important announcements has been disabled.`);
    }
  } else {
    return ('Failed')
  }
});

// API v2 POST

app.post("/api/v2/post/settings/voice/:server/apikey=:api", async (request, response) => {
  // We use a mongoose method to find A record and update!
  const test1 = await playerModel.findOne({ ServerID: `${request.params.server}`, APIKey: `${request.params.api}` })

  if (test1.Tier === 'Premium') {
    if (test1.VoiceTicket === 'Disabled') {
      await playerModel.findOneAndUpdate(
        { ServerID: `${request.params.server}` },
        { $set: { VoiceTicket: 'Enabled' } }
      );
      response.send('Enabled voice tickets in the guild.')
    }
    if (test1.VoiceTicket === 'Enabled') {
      await playerModel.findOneAndUpdate(
        { ServerID: `${request.params.server}` },
        { $set: { VoiceTicket: 'Disabled' } }
      );
      response.send('Disabled voice tickets in the guild.')
    }
  } else {
    return ('Guild dont have premium.')
  }
});


app.post("/api/v2/post/settings/ticketlength/:server/apikey=:api&:number", async (request, response) => {
  const test1 = await playerModel.findOne({ ServerID: `${request.params.server}`, APIKey: `${request.params.api}` })

  if (test1.Tier === 'Premium') {
    await playerModel.findOneAndUpdate(
      { ServerID: `${request.params.server}` },
      { $set: { TicketIDLength: `${request.params.number}` } }
    );
    response.send(`Ticket length has been updated to ${request.params.number}.`)
  } else {
    return ('Guild dont have premium.')
  }
})
