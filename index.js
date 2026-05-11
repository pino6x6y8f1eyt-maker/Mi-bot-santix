const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

//tikets xd

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, REST, Routes } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [{
    name: 'setup',
    description: 'Crea el panel de tickets de Los Panas Gamers'
}];

client.once('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log(`🧱 Santix Bot listo como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand() && !interaction.isButton()) return;

    // COMANDO /setup
    if (interaction.commandName === 'setup') {
        const embed = new EmbedBuilder()
          .setTitle('**ayuda y soporte**')
          .setDescription(`Te ayudaremos en dudas y en reportes a jugadores

1.- **dudas** 
Dudas sobre el servidor de discord

2.- **Reportar jugadores**
Razon de reporte 
Su sancion es depende lo que iso

3.- **alianza**
Aliamos los servidores para ayudarnos

4.- **vip**
Puedes pedir soporte o invitar a amigos a la zona vip`)
          .setColor('#5865F2')
          .setFooter({ text: 'Los Panas Gamers | Sistema de Tickets' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('ticket_dudas').setLabel('Dudas').setEmoji('❓').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('ticket_reporte').setLabel('reportar usuario').setEmoji('🚨').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('ticket_alianza').setLabel('alianza').setEmoji('🤝').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('ticket_vip').setLabel('vip').setEmoji('👑').setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({ embeds: [embed], components: [row] });
    }

    // CLICK EN BOTONES
    if (interaction.isButton() && interaction.customId.startsWith('ticket_')) {
        await interaction.reply({ 
            content: `Abriste ticket de **${interaction.customId.replace('ticket_', '')}** ✅ El staff te atiende pronto.`, 
            ephemeral: true 
        });
        // Aquí después le metes la lógica pa crear el canal si quieres
    }
});

// REGISTRAR COMANDOS SLASH
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

  // COMANDO /live FUSIONADO
  new SlashCommandBuilder()
  .setName('live')
  .setDescription('Anuncia que estás en vivo en TikTok 🔴')
  .addStringOption(option =>
      option.setName('titulo')
      .setDescription('El título o tema de tu live')
      .setRequired(false))
  .addStringOption(option =>
      option.setName('usuario')
      .setDescription('Tu usuario de TikTok sin el @')
      .setRequired(false))
  .addChannelOption(option =>
      option.setName('canal')
      .setDescription('Canal donde avisar. Si no pones nada busca #🎮〢lives')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(false))
  .setDefaultMemberPermissions(PermissionFlagsBits.MentionEveryone)
  .toJSON()
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.once('ready', async () => {
  console.log(`✅ | ¡${client.user.username} en línea!`);

  try {
    console.log('Registrando comandos slash...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log(`✅ | ${commands.length} comando(s) registrado(s): /mensaje, /anuncio, /live`);
  } catch (error) {
    console.error('❌ Error registrando comandos:', error);
  }

  client.user.setPresence({
    activities: [{ name: '🥰🥰 odio los Femboys 🥰🥰', type: 0 }],
    status: 'dnd'
  });
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

  // COMANDO /live FUSIONADO
  if (interaction.commandName === 'live') {
    const titulo = interaction.options.getString('titulo') || '¡Estoy en vivo!';
    const usuario = interaction.options.getString('usuario');
    let canal = interaction.options.getChannel('canal');

    // Si no eligió canal, busca el #🎮〢lives
    if (!canal) {
      canal = interaction.guild.channels.cache.find(c => c.name === '🎮〢lives');
    }

    if (!canal) {
      return interaction.reply({
        content: '❌ No encontré el canal **#🎮〢lives** y no elegiste otro. Crea el canal o selecciona uno we.',
        ephemeral: true
      });
    }

    const tiktokUrl = usuario
     ? `https://www.tiktok.com/@${usuario.replace('@', '')}/live`
      : null;

    const embed = new EmbedBuilder()
    .setTitle('🔴 ¡ESTOY EN VIVO EN TIKTOK!')
    .setDescription(
        `**${titulo}**\n\n` +
        (tiktokUrl? `📲 Únete aquí: [Ver en TikTok](${tiktokUrl})\n\n` : '') +
        `👤 Streamer: ${interaction.user}\n` +
        `🕹️ ¡Ven a acompañarme en el live!`
      )
    .setColor(0xFE2C55)
    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp();

    try {
      await canal.send({ content: '@everyone', embeds: [embed] });
      await interaction.reply({ content: `✅ ¡Anuncio enviado en ${canal}!`, ephemeral: true });
      console.log(`[LIVE] ${interaction.user.tag} avisó del TikTok`);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'No pude avisar del live we x_x revisa permisos', ephemeral: true });
    }
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

client.login(TOKEN);