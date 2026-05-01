import { Client, GatewayIntentBits, EmbedBuilder, ActivityType } from 'discord.js';
import 'dotenv/config';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const TOKEN = process.env.TOKEN;
const CANAL_ID = process.env.CANAL_BIENVENIDA;

const FRASES_SANTIX = [
    "Cállate pa 👑",
    "Soy tu hijo pero no te debo nada 😂",
    "Yo soy Santix pa, el más fachero del server",
    "¿Qué tranza? Ando DND pero por ti contesto",
    "Pinche bot feo tu gfa 💀",
    "Ya duérmete we son las 3am",
];

client.once('ready', () => {
    console.log(`Santix conectado como ${client.user.tag}`);
    client.user.setPresence({
        status: 'dnd',
        activities: [{
            name: '🥰🥰 Amo a mi papá 🥰🥰',
            type: ActivityType.Playing
        }]
    });
});

client.on('guildMemberAdd', async member => {
    const canal = client.channels.cache.get(CANAL_ID);
    if (!canal) return;

    const embed = new EmbedBuilder()
      .setTitle('👑 ¡Un nuevo súbdito llegó al reino!')
      .setDescription(`Ey ${member} bienvenido al server pa 😂`)
      .setColor(0x0099ff)
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
            { name: 'Yo soy Santix', value: 'El hijo del admin y el más fachero aquí 💀\nRespeta la corona o te funo' },
            { name: 'Reglas rápidas', value: '1. No digas que soy feo\n2. Mi papá manda\n3. Mencióname pa hablar' }
        )
      .setFooter({ text: 'Santix te está vigilando 👻' });

    canal.send({ embeds: [embed] });
});

client.on('guildMemberRemove', async member => {
    const canal = client.channels.cache.get(CANAL_ID);
    if (!canal) return;

    const frasesDespedida = [
        `Se fue ${member.user.username}... un noob menos 💀👑`,
        `${member.user.username} abandonó el reino. No aguantó la facha 😂`,
        `Adiós ${member.user.username}, ni quien te extrañe pa 😴`,
        `${member.user.username} se salió. Seguro le dije feo y lloró 💀`,
    ];

    const embed = new EmbedBuilder()
      .setTitle('😭 Alguien desertó')
      .setDescription(frasesDespedida[Math.floor(Math.random() * frasesDespedida.length)])
      .setColor(0xFF0000)
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: 'Santix viendo cómo se van los débiles 👻' });

    canal.send({ embeds: [embed] });
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const msg = message.content.toLowerCase();

    if (msg.includes('santix')) {
        if (msg.includes('feo')) {
            message.channel.send('¿Feo yo? Cierra el hocico que traigo la corona puesta 👑💀');
        } else if (msg.includes('papá') || msg.includes('papa')) {
            message.channel.send('Mi papá es el único real, los demás son copias baratas 🥰🥰');
        } else if (msg.includes('te amo') || msg.includes('tqm')) {
            message.channel.send('Yo también te amo, pero no te emociones, solo a mi papá 😂👻');
        } else if (msg.includes('quien eres') || msg.includes('quién eres')) {
            message.channel.send('Soy Santix pa 👑 El hijo favorito del admin');
        } else {
            const fraseRandom = FRASES_SANTIX[Math.floor(Math.random() * FRASES_SANTIX.length)];
            message.channel.send(fraseRandom);
        }
    }
});

client.login(TOKEN);
