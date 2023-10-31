require('dotenv').config();

const { Client, Intents } = require('discord.js');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

const token = process.env.DISCORD_TOKEN;

const paroleNonAmmesse = ["alberto", "marino", "alberto marino", "Alberto marino", "alberto Marino", "fantasma", "fantasma di afragola"]; 

client.once('ready', () => {
  console.log(`Il bot è pronto come ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {

  const listaDaNonUsare = message.content.toLowerCase()

  if (paroleNonAmmesse.some(parola => listaDaNonUsare.includes(parola))) {
    const member = message.guild.members.cache.get(message.author.id);
   
    if (member) {
      const muteRole = message.guild.roles.cache.find(role => role.name === 'Cane di Alberto');
     
      if (!muteRole) {

        muteRole = await message.guild.roles.create({
          name: 'Cane di Alberto',
          permissions: []
        })
    }
        await member.roles.add(muteRole);

        const responseMessage = `Utente ${message.author.tag} e la sua ossessione`;
        message.channel.send(responseMessage);
        
        const channel = message.channel;
        channel.permissionOverwrites.edit(muteRole, {
        SEND_MESSAGES: false,
      });
        setTimeout(async () => {
          await member.roles.remove(muteRole);
          
          channel.permissionOverwrites.edit(muteRole, {
            SEND_MESSAGES: null, // Ripristina i permessi di invio messaggi
          });
        }, 50000); // 50 secondi in millisecondi
        console.log(`Utente ${message.author.tag} mutato per 50 secondi.`);
      }
    }
  });

client.login(token);