const Discord = require("discord.js");
const config = require(`../config.json`)
const database = require('../database/database')
const moment = require('moment')
moment.locale('PT-BR')

module.exports.run = async (client, message, args, prefix) => {

    if(!message.member.hasPermission("ADMINISTRATOR")) {
        let embed = new Discord.MessageEmbed()

            .setColor(`RED`)
            .addField(`${config.whitelist.emoji_recusar} | **Ocorreu um erro.**`, "```yaml\nErro: Você não tem permissão para executar este comando!```")
            .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}))    //Colocando uma footer, um mini texto em baixo da embed
            .setTimestamp();

        return message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
    }

    var id = args[0]

    if (!id || isNaN(id)) {
        let embed = new Discord.MessageEmbed()

            .setColor(`RED`)
            .addField(`${config.whitelist.emoji_recusar} | **Ocorreu um erro.**`, "```yaml\nErro: Você não inseriu o ID ou inseriu um ID inválido!```")
            .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}))    //Colocando uma footer, um mini texto em baixo da embed
            .setTimestamp();

        return message.channel.send(embed)
    }

    var find_id = await database.whitelist.findOne({ where: { id: id } })

    if (!find_id) {
        let embed = new Discord.MessageEmbed()

            .setColor(`RED`)
            .addField(`${config.whitelist.emoji_recusar} | **Ocorreu um erro.**`, "```yaml\nErro: O ID " + id + " não existe na DB```")
            .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}))    //Colocando uma footer, um mini texto em baixo da embed
            .setTimestamp();

        return message.channel.send(embed)
    } else {
        find_id.whitelisted = 1
        find_id.save().then(a => {
            let embed = new Discord.MessageEmbed()

                .setDescription(`${config.whitelist.emoji_aceitar} | O ID **${id}** Teve a Whitelist aprovada.`)
                .setColor(`292928`)
                .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}))    //Colocando uma footer, um mini texto em baixo da embed
                .setTimestamp();


            return message.channel.send(embed)
        }).catch(err => {
            let embed = new Discord.MessageEmbed()

                .setColor(`RED`)
                .addField(`${config.whitelist.emoji_recusar} | **Ocorreu um erro.**`, "```yaml\nErro: Olhe console.```")
                .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}))    //Colocando uma footer, um mini texto em baixo da embed
                .setTimestamp();

            console.log(err)

            return message.channel.send(embed)
        })
    }
}

module.exports.config = {
    name: 'wl',
    aliases: ["addwl"]
}