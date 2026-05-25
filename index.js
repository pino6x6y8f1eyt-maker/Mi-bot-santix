const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates // CLAVE PA VOZ 24/7
  ]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = '1469534530074574996'; // Tu server ID
const VOICE_CHANNEL_ID = '1469547698679058564'; // Canal donde se queda 24/7

let voiceConnection; // Guardamos la conexión

// REGISTRAR COMANDOS SLASH - Añadí /join247 y /leave
const commands = [
  new SlashCommandBuilder()
.setName('mensaje')
.setDescription('Manda un mensaje 👑')
.addStringOption(option =>
      option.setName('texto')
    .setDescription('Qué quieres que diga Santix')
    .setRequired(true))
.addChannelOption(option =>
      option.setName('canal')
    .setDescription('A qué canal lo mando')
    .addChannelTypes(ChannelType.GuildText)
    .setRequired(true))
.toJSON(),

  new SlashCommandBuilder()
.setName('anuncio')
.setDescription('Manda un anuncio oficial 📢')
.addStringOption(option =>
      option.setName('texto')
    .setDescription('Qué dice el anuncio')
    .setRequired(true))
.addChannelOption(option =>
      option.setName('canal')
    .setDescription('A qué canal lo mando')
    .addChannelTypes(ChannelType.GuildText)
    .setRequired(true))
.addStringOption(option =>
      option.setName('mencion')
    .setDescription('Mencionar a todos?')
    .addChoices(
          { name: '@everyone', value: 'everyone' },
          { name: '@here', value: 'here' },
          { name: 'Sin mención', value: 'none' }
        )
    .setRequired(false))
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.toJSON(),

  // NUEVOS COMANDOS 24/7
  new SlashCommandBuilder()
.setName('join247')
.setDescription('Me quedo 24/7 en el canal de voz 🔒')
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.toJSON(),

  new SlashCommandBuilder()
.setName('leave')
.setDescription('Me salgo del canal 24/7 👋')
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.toJSON(),
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

// FUNCIÓN PA CONECTARSE 24/7
async function conectar24_7() {
  try {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return console.log('❌ No encuentro el server');

    voiceConnection = joinVoiceChannel({
      channelId: VOICE_CHANNEL_ID,
      guildId: GUILD_ID,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: true, // En deaf pa que no lo boten
      selfMute: false
    });

    // Auto-reconexión si se cae
    voiceConnection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(voiceConnection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000),
        ]);
      } catch (error) {
        console.log('Se desconectó del voice, reintentando en 5s...');
        voiceConnection.destroy();
        setTimeout(() => conectar24_7(), 5000);
      }
    });

    voiceConnection.on(VoiceConnectionStatus.Ready, () => {
      console.log(`✅ Bot 24/7 conectado al canal de voz`);
    });

  } catch (error) {
    console.log('Error al conectar 24/7:', error);
    setTimeout(() => conectar24_7(), 10000);
  }
}

client.once('ready', async () => {
  console.log(`✅ | ¡${client.user.username} en línea!`);

  try {
    console.log('Registrando comandos slash...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log(`✅ | ${commands.length} comando(s) registrado(s): /mensaje, /anuncio, /join247, /leave`);
  } catch (error) {
    console.error('❌ Error registrando comandos:', error);
  }

  client.user.setPresence({
    activities: [{ name: '24/7 🔒 | 🥰 odio los Femboys 🥰', type: 0 }],
    status: 'dnd'
  });

  // SE CONECTA SOLO AL PRENDER
  conectar24_7();
});

// MANEJAR SLASH COMMANDS
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // COMANDO /mensaje
  if (interaction.commandName === 'mensaje') {
    const texto = interaction.options.getString('texto');
    const canal = interaction.options.getChannel('canal');

    try {
      await canal.send(texto);
      await interaction.reply({ content: `Ya mandé tu mensaje a ${canal} pa 👑`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'No pude mandar mensaje weon x_x no me distes permisos papa', ephemeral: true });
    }
  }

  // COMANDO /anuncio
  if (interaction.commandName === 'anuncio') {
    const texto = interaction.options.getString('texto');
    const canal = interaction.options.getChannel('canal');
    const mencion = interaction.options.getString('mencion') || 'none';

    const embed = new EmbedBuilder()
  .setTitle('📢 ANUNCIO OFICIAL DE LOS PANITAS GAMER')
  .setDescription(texto)
  .setColor(0xFF0000)
  .setFooter({ text: `Anuncio de ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
  .setTimestamp();

    let contenidoMencion = '';
    if (mencion === 'everyone') contenidoMencion = '@everyone';
    if (mencion === 'here') contenidoMencion = '@here';

    try {
      await canal.send({ content: contenidoMencion, embeds: [embed] });
      await interaction.reply({ content: `Anuncio mandado a ${canal} pa 🔥`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'No pude mandar el anuncio we x_x checa mis permisos', ephemeral: true });
    }
  }

  // COMANDO /join247
  if (interaction.commandName === 'join247') {
    if (voiceConnection && voiceConnection.state.status === VoiceConnectionStatus.Ready) {
      return interaction.reply({ content: 'Ya estoy 24/7 en el canal pa 🔒', ephemeral: true });
    }
    conectar24_7();
    await interaction.reply({ content: '✅ **Modo 24/7 activado**\nMe quedaré en el canal aunque quede vacío', ephemeral: true });
  }

  // COMANDO /leave
  if (interaction.commandName === 'leave') {
    if (!voiceConnection) {
      return interaction.reply({ content: 'Ni estoy en ningún canal we x_x', ephemeral: true });
    }
    voiceConnection.destroy();
    voiceConnection = null;
    await interaction.reply({ content: '👋 **Modo 24/7 desactivado**\nMe salí del canal', ephemeral: true });
  }
});

client.on('messageCreate', message => {
  if (message.author.bot) return;

  if (message.content === '!hola') {
    message.reply('qué onda pa 👻 shhh estoy en no molestar como mi jefe');
  }

  if (message.content === '!perreo') {
    message.channel.send('SIUUUU *perrea en silencio pa que no lo regañe su papá* 🔥👻');
  }

  // COMANDO SECRETO:!templo MC
  if (message.content === '!templo MC') {
    const embedMC = new EmbedBuilder()
  .setTitle('⛏️ TEMPLO DEL SANTIX - SERVER MINECRAFT ⛏️')
  .setDescription('**IP:** `pendiente.por.ahora`\n**Versión:** 1.20.1 Java\n**Modalidad:** Survival Tryhard\n\n*Pide la IP al Santix por MD pa* 👑')
  .setColor(0x5B9E48)
  .setThumbnail('https://cdn.discordapp.com/attachments/1104529476982083604/1152169286843482132/minecraft.png')
  .setFooter({ text: 'Solo los panitas reales conocen el templo' });

    message.channel.send({ embeds: [embedMC] });
  }

  if (message.content.includes('👻')) {
    message.react('🔥');
    if (Math.random() < 0.3) {
      message.channel.send('sshhh... modo sigiloso activado 👻');
    }
  }
});

// Reconecta si el bot se reinicia
client.on('shardResume', () => {
  console.log('Bot resumido, reconectando a voz 24/7...');
  conectar24_7();
});

client.login(TOKEN);