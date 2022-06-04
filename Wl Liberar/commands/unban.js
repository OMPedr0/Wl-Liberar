const Discord = require("discord.js");
const config = require(`../config.json`)
const database = require('../database/database')
const moment = require('moment')
moment.locale('PT-BR')

module.exports.run = async (client, message, args, prefix) => {
    message.delete()

    if(!message.member.hasPermission("ADMINISTRATOR")) {
        let embed = new Discord.MessageEmbed()

            .setColor(`RED`)
            .addField(`${config.whitelist.emoji_recusar} | **Ocorreu um erro.**`, "```yaml\nErro: Você não tem permissão para executar este comando!```")
            .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}))//Colocando uma footer, um mini texto em baixo da embed
            .setTimestamp();

        return message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
    }

    var id = args[0]

    if (!id || isNaN(id)) {
        let embed = new Discord.MessageEmbed()

            .setColor(`RED`)
            .addField(`${config.whitelist.emoji_recusar} | **Ocorreu um erro.**`, "```yaml\nErro: Você não inseriu o ID ou inseriu um ID inválido!```")
            .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}))//Colocando uma footer, um mini texto em baixo da embed
            .setTimestamp();

        return message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
    }

    var find_id = await database.whitelist.findOne({ where: { id: id } })

    if (!find_id) {
        let embed = new Discord.MessageEmbed()

            .setColor(`RED`)
            .addField(`${config.whitelist.emoji_recusar} | **Ocorreu um erro.**`, "```yaml\nErro: O ID " + id + " não existe na DB```")
            .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}))//Colocando uma footer, um mini texto em baixo da embed
            .setTimestamp();

        return message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
    } else {
        find_id.banned = 0
        find_id.save().then(a => {
            let embed = new Discord.MessageEmbed()

                .setDescription(`${config.whitelist.emoji_aceitar} | O ID **${id}** foi desbanido.`)
                .setColor(`292928`)
                .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}))//Colocando uma footer, um mini texto em baixo da embed
                .setTimestamp();

                client.channels.cache.get(config.adm.channellogunban).send(embed);
                return message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
        }).catch(err => {
            let embed = new Discord.MessageEmbed()

                .setColor(`RED`)
                .addField(`${config.whitelist.emoji_recusar} | **Ocorreu um erro.**`, "```yaml\nErro: Olhe console.```")
                .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}))//Colocando uma footer, um mini texto em baixo da embed
                .setTimestamp();

            console.log(err)

            return message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
        })
    }
}

module.exports.config = {
    name: 'unban',
    aliases: ["remban"]
}