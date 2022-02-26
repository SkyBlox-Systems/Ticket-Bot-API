const mongoose = require('mongoose')

const TicketData = mongoose.Schema({
  ServerID: String,
  OwnerID: String,
  TicketChannelID: String,
  TicketNumber: Number,
  TicketTrackerChannelID: String,
  BotPrefix: String,
  SupportRoleID: String,
  ManagerRoleID: String,
  AdminRoleID: String,
  BetaKey: String,
  PaidGuild: String,
  Transcript: String,
  UseTicketReactions: String,
  UseDashboard: String,
  APIKey: String,
  TicketMessage: String,
  CloseMessage: String,
  ClaimTicketMessage: String,
  DisabledCommands: String,
  TranscriptMessage: String,
  EnableTicket: String,
  BotVersion: String
})

module.exports = mongoose.model('TicketData',  TicketData)