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

client.login(process.env.TOKEN);