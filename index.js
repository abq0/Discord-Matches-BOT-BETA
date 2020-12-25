// for Discord

const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

// for webscraping

const request = require('request');
const cheerio = require('cheerio');

client.once('ready', () => {
    console.log('Bot is Running');
});


client.on('message', message => {

    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    // args = message content

    else if (command === 'مباراة') {
        if (!args.length) {
            return message.channel.send(`معليش ماحطيت اسم فريق, ${message.author}!`);
        }
        const webUrl = 'https://www.kooora4live.tv/'

        request(webUrl, (error, response, html) => {


            if (!error && response.statusCode == 200) {

                var messageContent = message.content.split(' ')[1];
                const $ = cheerio.load(html);
                if ($(`.match-container:contains('${messageContent}')`).text()) {
                    var teams = $(`.match-container:contains('${messageContent}')`).text();
                    var filterdteams = teams.replace(/\s\s+/g, '\n');

                    var matchLink = $(`a:contains('${messageContent}')`).attr('href');

                    if (typeof matchLink !== typeof undefined && matchLink !== false) { // check if there is an href Attr
                        var matchLink = $(`a:contains('${messageContent}')`).attr('href');
                        message.channel.send(filterdteams + " " + matchLink);
                    } else {
                        var matchLink = 'عفوا لم يتوفر رابط بعد';
                        message.channel.send(filterdteams + " " + matchLink);
                    }
                }else{
                    message.channel.send('عذرا لا مباراة اليوم لـ : ' + message.content.replace(command,'').replace(config.prefix,''));
                }




            }

        })

    }



});




client.login(process.env.TOKEN); // Bot token
