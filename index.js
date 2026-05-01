import discord
from discord.ext import commands
import random

intents = discord.Intents.default()
intents.message_content = True
intents.members = True  # Actívalo en Discord Dev Portal
bot = commands.Bot(command_prefix='!', intents=intents)

# FRASES RANDOM DE SANTIX
FRASES_SANTIX = [
    "Cállate pa 👑",
    "Soy tu hijo pero no te debo nada 😂",
    "Yo soy Santix pa, el más fachero del server",
    "¿Qué tranza? Ando DND pero por ti contesto",
    "Pinche bot feo tu gfa 💀",
    "Ya duérmete we son las 3am",
]

@bot.event
async def on_ready():
    print(f'Santix conectado como {bot.user}')
    # ESTADO: DND + "Amo a mi papá"
    await bot.change_presence(
        status=discord.Status.dnd, 
        activity=discord.Game(name="🥰🥰 Amo a mi papá 🥰🥰")
    )
    try:
        synced = await bot.tree.sync()
        print(f"Sync {len(synced)} comandos")
    except Exception as e:
        print(e)

# SISTEMA DE BIENVENIDA
@bot.event
async def on_member_join(member):
    canal = bot.get_channel(TU_CANAL_ID_AQUI) # ID del canal #bienvenida
    
    embed = discord.Embed(
        title="👑 ¡Un nuevo súbdito llegó al reino!",
        description=f"Ey {member.mention} bienvenido al server pa 😂",
        color=0x0099ff
    )
    embed.set_thumbnail(url=member.avatar.url if member.avatar else member.default_avatar.url)
    embed.add_field(
        name="Yo soy Santix", 
        value="El hijo del admin y el más fachero aquí 💀\nRespeta la corona o te funo",
        inline=False
    )
    embed.add_field(
        name="Reglas rápidas",
        value="1. No digas que soy feo\n2. Mi papá manda\n3. Usa `/santix` pa verme",
        inline=False
    )
    embed.set_footer(text="Santix te está vigilando 👻")
    
    if canal:
        await canal.send(embed=embed)

# SISTEMA DE DESPEDIDA
@bot.event
async def on_member_remove(member):
    canal = bot.get_channel(TU_CANAL_ID_AQUI) # Mismo canal o #despedidas
    
    frases_despedida = [
        f"Se fue {member.name}... un noob menos 💀👑",
        f"{member.name} abandonó el reino. No aguantó la facha 😂",
        f"Adiós {member.name}, ni quien te extrañe pa 😴",
        f"{member.name} se salió. Seguro le dije feo y lloró 💀",
    ]
    
    embed = discord.Embed(
        title="😭 Alguien desertó",
        description=random.choice(frases_despedida),
        color=0xff0000
    )
    embed.set_thumbnail(url=member.avatar.url if member.avatar else member.default_avatar.url)
    embed.set_footer(text="Santix viendo cómo se van los débiles 👻")
    
    if canal:
        await canal.send(embed=embed)

# SANTIX HABLA CON "SANTIX + PALABRA"
@bot.event
async def on_message(message):
    if message.author == bot.user:
        return
    
    msg = message.content.lower()
    
    if 'santix' in msg:
        if 'feo' in msg:
            await message.channel.send("¿Feo yo? Cierra el hocico que traigo la corona puesta 👑💀")
        elif 'papá' in msg or 'papa' in msg:
            await message.channel.send("Mi papá es el único real, los demás son copias baratas 🥰🥰")
        elif 'te amo' in msg or 'tqm' in msg:
            await message.channel.send("Yo también te amo, pero no te emociones, solo a mi papá 😂👻")
        elif 'quien eres' in msg or 'quién eres' in msg:
            await message.channel.send("Soy Santix pa 👑 El hijo favorito del admin")
        else:
            await message.channel.send(random.choice(FRASES_SANTIX))
    
    await bot.process_commands(message)

# COMANDO /SANTIX
@bot.tree.command(name="santix", description="Invoca a Santix")
async def santix(interaction: discord.Interaction):
    embed = discord.Embed(
        title="Soy yo pa 👑",
        description=random.choice(FRASES_SANTIX),
        color=0x0099ff
    )
    await interaction.response.send_message(embed=embed)

client.login(process.env.TOKEN)
