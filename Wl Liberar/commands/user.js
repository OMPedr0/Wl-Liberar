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
    var nome = args[1]
    var sobrenome = args[2]
    var idade = args[3]

    if (id || nome || sobrenome || idade) {
        if (isNaN(id)) {
            let embed = new Discord.MessageEmbed()

                .setColor(`RED`)
                .addField(`${config.whitelist.emoji_recusar} | **Ocorreu um erro.**`, "```yaml\nErro: Você inseriu um ID inválido!```")
                .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}))//Colocando uma footer, um mini texto em baixo da embed
                .setTimestamp();

            return message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
        }

        if (isNaN(idade)) {
            let embed = new Discord.MessageEmbed()

                .setColor(`RED`)
                .addField(`${config.whitelist.emoji_recusar} | **Ocorreu um erro.**`, "```yaml\nErro: Você inseriu uma idade inválida!```")
                .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}))//Colocando uma footer, um mini texto em baixo da embed
                .setTimestamp();

            return message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
        }

        var find_user = await database.usuario.findOne({ where: { user_id: id } })

        if (find_user) {
            find_user.firstname = nome
            find_user.name = sobrenome
            find_user.age = idade
            find_user.save().then(a => {
                let embed = new Discord.MessageEmbed()

                    .setDescription(`${config.whitelist.emoji_aceitar} | O ID **${id}** teve o nome alterado para **${nome} ${sobrenome}** e idade para **${idade}**.`)
                    .setColor(`292928`)
                    .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}))//Colocando uma footer, um mini texto em baixo da embed
                    .setTimestamp();

                    client.channels.cache.get(config.adm.channelloguser).send(embed);
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
        } else {

            let embed = new Discord.MessageEmbed()

                .setColor(`RED`)
                .addField(`${config.whitelist.emoji_recusar} | **Ocorreu um erro.**`, "```yaml\nErro: O ID " + id + " não existe na DB```")
                .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}))//Colocando uma footer, um mini texto em baixo da embed
                .setTimestamp();

            return message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
        }

    } else {
        let embed = new Discord.MessageEmbed()

            .setColor(`RED`)
            .addField(`${config.whitelist.emoji_recusar} | **Ocorreu um erro.**`, "```yaml\nErro: Você não inseriu todos os argumentos! Id | Nome | Sobrenome | Idade```")
            .setFooter(`Executado por: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}))//Colocando uma footer, um mini texto em baixo da embed
            .setTimestamp();

        return message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
    }
}

module.exports.config = {
    name: 'user',
    aliases: ["usuario"]
}