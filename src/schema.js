const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	coins: {
		type: Number,
		default: 0,
	},
	bank: {
		type: Number,
		default: 0,
	},
	rep: {
		type: Number,
		default: 0,
	},
	badges: {
		type: [String],
		default: [],
	},
	qoute: {
		type: String,
		default: '',
	},
});

const Warning = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	guildId: {
		type: String,
		required: true,
	},
	staffId: {
		type: String,
		required: true,
	},
	reason: {
		type: String,
		default: 'No reason.',
	},
});
const warnSystem = new mongoose.Schema({
	warningsToggel: {
		type: Boolean,
		default: false,
	},
	warnsTillAction: {
		type: Number,
		default: 5,
	},
	warnsAction: {
		type: String,
		enum: ['timeout', 'mute', 'kick', 'ban'],
		default: 'mute',
	},
	warnsCount: {
		type: Number,
		default: 0,
	},
	warnings: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Warning',
		},
	],
});

const Suggestion = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	guildId: {
		type: String,
		required: true,
	},
	// more data to be added
});
const suggestionSystem = new mongoose.Schema({
	suggestionsToggel: {
		type: Boolean,
		default: false,
	},
	suggestionsChannel: {
		type: String,
		default: null,
	},
	suggestionsCount: {
		type: Number,
		default: 0,
	},
	suggestions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Suggestion',
		},
	],
});

const Ticket = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	guildId: {
		type: String,
		required: true,
	},
	channelId: {
		type: String,
		required: true,
	},
	// more data to be added
});
const ticketSystem = new mongoose.Schema({
	ticketsToggel: {
		type: Boolean,
		default: false,
	},
	ticketsCategory: {
		type: String,
		default: null,
	},
	ticketsCount: {
		type: Number,
		default: 0,
	},
	tickets: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Ticket',
		},
	],
});

const serverWelcomeLeave = new mongoose.Schema({
	serverId: {
		type: String,
		required: true,
	},
	welcomeSystem: {
		welcomeToggel: {
			type: Boolean,
			default: false,
		},
		welcomeChannelId: {
			type: String,
			default: null,
		},
		welcomeMsgType: {
			type: String,
			enum: ['message', 'embed', 'image'],
			default: 'message',
		},
		welcomeMessage: {
			type: String,
			default:
				'Welcome {@joined}, to {serverName} we now have {membersCount} members',
		},
	},
	leaveSystem: {
		leaveToggel: {
			type: Boolean,
			default: false,
		},
		leaveChannel: {
			type: String,
			default: null,
		},
		leaveMsgType: {
			type: String,
			enum: ['message', 'embed', 'image'],
			default: 'message',
		},
		leaveMessage: {
			type: String,
			default: 'Goodbye {user}, we will miss you :wave:',
		},
	},
});

module.exports = {
	User: mongoose.model('User', UserSchema),
	WelcomeLeave: mongoose.model('Server-Welcome-Leave', serverWelcomeLeave),
	Warning: mongoose.model('Warning', Warning),
	WarnSys: mongoose.model('Warn-System', warnSystem),
	Ticket: mongoose.model('Ticket', Ticket),
	TicketSys: mongoose.model('Ticket-System', ticketSystem),
	Suggestion: mongoose.model('Suggestion', Suggestion),
	SuggestionSys: mongoose.model('Suggestion-System', suggestionSystem),
};
