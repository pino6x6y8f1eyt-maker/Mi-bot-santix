const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Bot online! Logueado como ${client.user.tag}`);
  
  // AQUÍ LA MAGIA PA QUE ESTÉ EN NO MOLESTAR
  client.user.setPresence({
    activities: [{ name: 'imitando a mi papá 😎', type: 0 }], // 0 = Jugando a...
    status: 'dnd'  // dnd = Do Not Disturb = ROJO
  });
});

client.on('messageCreate', message => {
  if (message.author.bot) return;

  if (message.content === '!hola') {
    message.reply('qué onda pa 👻 shhh estoy en no molestar como mi jefe');
  }

  if (message.content === '!perreo') {
    message.channel.send('SIUUUU *perrea en silencio pa que no lo regañe su papá* 🔥👻');
  }

  if (message.content.includes('👻')) {
    message.react('🔥');
    if (Math.random() < 0.3) {
      message.channel.send('sshhh... modo sigiloso activado 👻');
    }
  }
});

client.login(process.env.TOKEN);
