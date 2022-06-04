const Discord = require("discord.js");
const config = require(`../config.json`)
const database = require('../database/database')
const moment = require('moment')
moment.locale('PT-BR')

module.exports.run = async (client, message, args, prefix) => {
    message.delete()

    if (!message.member.hasPermission("ADMINISTRATOR")) {
        var embed = new Discord.MessageEmbed()


            .setColor(`RED`)
            .addField(`<a:x_:806032162742730763> | **Ocorreu um erro.**`, "```yaml\nErro: Você não tem permissão.```")

        return message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
    }

    var descricao = args.join(' ')

        var embed = new Discord.MessageEmbed()

        .setAuthor(message.guild.name, message.guild.iconURL())
        .setThumbnail(message.guild.iconURL())
        .setColor('RED')
        .setDescription(descricao)
        .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}))//Colocando uma footer, um mini texto em baixo da embed
        .setTimestamp();

    await message.channel.send(embed)

}

module.exports.config = {
    name: 'anuncio',
    aliases: ["anunciar", "falar"]
}