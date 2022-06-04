const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const colors = require('colors')
const fs = require('fs')
const database = require('./database/database')
const axios = require('axios')
const discbutton = require('discord-buttons')(client)



const { MessageButton, MessageActionRow } = require("discord-buttons")
const { MessageMenuOption, MessageMenu } = require("discord-buttons");


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

console.clear()

fs.readdir(`./commands/`, (err, files) => {
    if (err) return message.channel.send("comando não encontrado!!")
    console.log(colors.cyan("[Info] ") + "Importação dos comandos iniciada!\n")

    var jsfile = files.filter(f => f.split(".").pop() === "js")
    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`)
        client.commands.set(pull.config.name, pull);

        console.log(colors.red('-> ') + ('O comando ' + colors.green(f) + ' foi carregado com sucesso.'))
        if (err) console.log(colors.red('-> ') + 'O comando ' + colors.red(f) + ' não foi carregado com sucesso.')

        pull.config.aliases.forEach(alias => {
            client.aliases.set(alias, pull.config.name)
        });
    });
});

var players = 0


client.on(`ready`, () => {
    console.log(colors.grey(`DEV By : Fast's Dev    Users: ${client.users.cache.size} | Guilds: ${client.guilds.cache.size}\n`))
})





client.on("message", async (message) => {
    if (message.channel.type === "dm") return
    if (message.author.bot) return;


    var prefix = config.bot.prefix
    let args = message.content.slice(prefix.length).trim().split(" ");
    let cmd = args.shift().toLowerCase();

    if (message.channel.id === config.whitelist.canal_mande_seu_id) {
        var infos = message.content.split(' | ')
        var nome = infos[1]
        var id = infos[0]

        if (!nome || !id || nome.split(' ').length !== 2) {
            await message.react(config.whitelist.emoji_recusar)
            await message.reply(`❌ | Você utilizou um modelo inválido. Modelo Correto: **ID | Nome Sobrenome**`).then(msg => msg.delete({ timeout: 10000 }))
            return message.delete()
        }

        if (id.split(' ').length > 1) {
            await message.react(config.whitelist.emoji_recusar)
            await message.reply(`❌ | Você utilizou um modelo inválido. Modelo Correto: **ID | Nome Sobrenome**`).then(msg => msg.delete({ timeout: 10000 }))
            return message.delete()
        }

        var find_id = await database.whitelist.findOne({ where: { id: id } })
        if (!find_id) {
            await message.react(config.whitelist.emoji_recusar)
            await message.reply(`❌ | O ID informado não existe.`).then(msg => msg.delete({ timeout: 10000 }))
            return message.delete()
        } else {
            if (find_id.id === 0) {
                await message.react(config.whitelist.emoji_recusar)
                await message.reply(`❌ | Este ID não foi encontrado.`).then(msg => msg.delete({ timeout: 10000 }))
                return message.delete()
            }
            if (find_id.banned === 1) {
                await message.react(config.whitelist.emoji_recusar)
                await message.reply(`❌ | Este ID está **BANIDO** do servidor.`).then(msg => msg.delete({ timeout: 10000 }))
                return message.delete()
            }
        }

        find_id.whitelisted = 1
        find_id.save().then(async a => {
            await client.guilds.cache.get(message.guild.id).members.cache.get(message.author.id).roles.remove(config.whitelist.cargo_sem_whitelist)
            await client.guilds.cache.get(message.guild.id).members.cache.get(message.author.id).roles.add(config.whitelist.cargo_com_whitelist)
            await message.react(config.whitelist.emoji_aceitar)
            await client.guilds.cache.get(message.guild.id).members.cache.get(message.author.id).setNickname(`${id} | ${nome}`)

            let embed = new Discord.MessageEmbed()

            .setDescription(`${config.whitelist.emoji_aceitar} | O ID **${id}** | **${nome}** Teve a Whitelist aprovada.`)
            .setColor(`292928`)
            .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}))    //Colocando uma footer, um mini texto em baixo da embed
            .setTimestamp();

        return client.channels.cache.get(config.whitelist.channellog).send(embed);

        })

    } else {
        if (!message.content.startsWith(prefix)) return
        let archive = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))

        if (archive) {
            archive.run(client, message, args, prefix)
        } else {
            message.reply(`❌ | Este comando não existe.`).then(msg => msg.delete({ timeout: 2500 }))
        }
    }
})


client.login(config.bot.token)