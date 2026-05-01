const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// REGISTRAR COMANDOS SLASH
const commands = [
  new SlashCommandBuilder()
    .setName('mensaje')
    .setDescription('Manda un mensaje a través de Santix')
    .addStringOption(option =>
      option.setName('texto')
        .setDescription('El mensaje que quieres mandar')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('canal')
        .setDescription('Canal donde mandar el mensaje. Si no pones, usa el actual')
        .setRequired(false))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

client.once('ready', async () => {
  console.log(`Bot online! Logueado como ${client.user.tag}`);
  
  // PONER STATUS ROJO DND
  client.user.setPresence({
    activities: [{ name: '🥰🥰 Amo a mi papá el santix 🥰🥰', type: 0 }],
    status: 'dnd'
  });

  // REGISTRAR COMANDOS
  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log('Comandos slash registrados ✅');
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // COMANDO /mensaje
  if (interaction.commandName === 'mensaje') {
    const texto = interaction.options.getString('texto');
    const canal = interaction.options.getChannel('canal') || interaction.channel;
    
    try {
      await canal.send(texto);
      await interaction.reply({ content: `Mensaje enviado a ${canal} ✅`, ephemeral: true });
    } catch (error) {
      await interaction.reply({ content: 'No pude mandar el mensaje 😭 Revisa mis permisos', ephemeral: true });
    }
  }
});

client.login(process.env.TOKEN);
