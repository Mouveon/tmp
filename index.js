//Requires
//var Canvas = require('canvas')

//var Jimp = require('jimp')
//const Sharp = require('sharp')

//var cron = require('node-cron');
//var ffmpeg = require('fluent-ffmpeg');
const Discord = require('discord.js');
const { Structures } = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const util = require('util');
const request = require('request');

//const SoundCloudAudio = require('soundcloud-audio');
//const scPlayer = new SoundCloudAudio('YOUR_CLIENT_ID');
var soundcloudr = require('soundcloudr');
soundcloudr.setClientId("CLIENT_ID");


const {
    Readable
} = require('stream')
const MongoClient = require("mongodb").MongoClient;
const rp = require('request-promise')
const readline = require('readline-sync')
const xmlbuilder = require('xmlbuilder')
const execSync = require('child_process').execSync;
const path_val = require("./token.json")
const https = require('https')
const sortArray = require('sort-array')
const ytdl = require('ytdl-core')
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const {
    IamAuthenticator
} = require('ibm-watson/auth');

var readdir = util.promisify(fs.readFile)
var writedir = util.promisify(fs.writeFile)
var appendir = util.promisify(fs.appendFile)

//Structures.extend('Guild', function(Guild) {

class  MusicGuild {
    constructor() {
//      super(client, data);
       this.musicData = {
        queue: [],
        isPlaying: false,
        nowPlaying: null,
        songDispatcher: null,
        volume: 1
      };
      this.triviaData = {
        isTriviaRunning: false,
        wasTriviaEndCalled: false,
        triviaQueue: [],
        triviaScore: new Map()
      };
    }
}


const music=new MusicGuild;
console.log(music);


//Constants and Vars

const dbName = 'botFDP'

var i = 0;

var voiceChannel
var textChannel

const streamOptions = {
    seek: 0,
    volume: 1
}
var num_api_q = 0
var textToSpeech = new TextToSpeechV1({
    authenticator: new IamAuthenticator({
        apikey: path_val.apikey[i]
    }),
    //apikey: 'AIuA_QXQhkrJAZXkmGUHSmAVKRbFpDDUGjrFU5edi1jp' }),
    url: path_val.url[i]
});
//https://api.eu-gb.text-to-speech.watson.cloud.ibm.com/instances/5fbc6023-3bb4-4235-a20c-fcc410fbd3d7'});


var tempo

var compte_quizz = 0;
//var url = 'https://www.openquizzdb.org/api.php?key=' + path_val.keyQuizz[num_api_q] + '&amount=30'
var url_api;

const width = 1000;
const height = 400;

var flag = 0;
var count = 0;
var lines
var question
var reponse

//Memory tampon
var stats = [];
//File des gens qui parlent et qu'on va insert dans mongo
var test = []

var u
var compte = 0

const data = JSON.stringify({
    todo: "Ceci est un test"
})

var debut;

var queue_user = []
var retient_nom;
var retient_temp;

var params
var audio
var connection
var voiceChannel
var dispatcher

var testing_line

var fail = []
var rand
var pop
var lines_temp

var var_for

var db

var p
var x
var y
var z
var t
var f
var k

var resolve_promess
var timeout_promess
var voiceChannel
////////////////////

const prefix = "!"
var ags
var command

var decompte = []
var decount = {}
var fail_compte = 0
var compte_i
//var compte_trim
var compte_trim2

var temp_quest

var temporisation
var temporisation_temporisation
var temporisation_temporisation1
var temporisation1

/////////

class Silence extends Readable {
    _read() {
        this.push(Buffer.from([0xF8, 0xFF, 0xFE]));
    }

}

var image_cache = []

//////////////FUNCTIONS///////


function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
}

function getall(string, subString) {
    return string.split(subString).length;
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function generateRandom(max, failOn) {
    failOn = Array.isArray(failOn) ? failOn : [failOn]
    var num = Math.floor(Math.random() * max);

    console.log("TEST DU FAILON")

    console.log(typeof(num))
    console.log(typeof(failOn[2]))

    console.log(failOn)
    console.log(num.toString())
    console.log(failOn.includes(num.toString()))

    return failOn.includes(num.toString()) ? generateRandom(max, failOn) : num;
}

function voc(text) {
    params = {
        text: reponse,
        voice: 'fr-FR_ReneeVoice', // Optional voice
        accept: 'audio/wav'

    }
    // Synthesize speech, correct the wav header, then save to disk
    // (wav header requires a file length, but this is unknown until after the header is already generated and sent)
    // note that `repairWavHeaderStream` will read the whole stream into memory in order to process it.
    // the method returns a Promise that resolves with the repaired buffer
    textToSpeech.synthesize(params)
        .then(response => {
            audio = response.result;
            return textToSpeech.repairWavHeaderStream(audio);
        })
        .then(repairedFile => {
            fs.writeFileSync('audio.wav', repairedFile);
            console.log('audio.wav written with a corrected wav header');
            voiceChannel = bot.channels.get('278706666176774144');
            console.log("join le vocal audio");
            if (!voiceChannel)
                return console.error("DOES NOT EXIST FDP");
            voiceChannel.join().then(connection => {
                connection.playOpusStream(new Silence(), {
                    type: 'opus'
                });
                dispatcher = connection.playFile('/home/moveon/bot/audio.wav', {
                    volume: 1
                });
                dispatcher.on("end", end => {
                    console.log('fin');
                });
            });
            //		voiceChannel.leave();
        })
        .catch(err => {
            console.log(err);
        });
}

//Requete au compte quizz

function requete(url) {
    var req = https.get(url, (res) => {
        //console.log(res)
        res.on('data', (d) => {
            compte_quizz = compte_quizz + 1
            console.log("premiere requete recu")
            console.log(url)
            url_api = JSON.parse(d)
            if (url_api['response_code'] == 4) {
                console.log("on envoit une seconde requete")
                if (path_val.keyQuizz[num_api_q + 1] == undefined) {
                    num_api_q = 0
                } else {
                    num_api_q = num_api_q + 1
                }
                //		num_api_q = 4
                //url = 'https://www.openquizzdb.org/api.php?key=' + path_val.keyQuizz[num_api_q] + '&amount=30'

                if (compte_quizz <= path_val.keyQuizz.length) {
                    requete(url)
                } else {
                    compte_quizz = 0
                }
            }
        });

    });
}

function getRandomLine(filename) {
    fs.readFile(filename, function(err, data) {
        if (err)
            throw err;
        var lines = data.split('\n');
        /*do something with */
        lines[Math.floor(Math.random() * lines.length)];
    })
}

const insertDocuments = function(db, temp, callback) {
    // Get the documents collection
    const collection = db.collection('radio');
    // Insert some documents
    console.log("insertDocs")
    console.log(temp)

    console.log("test des values")

    console.log("fin test des values")

    collection.insertMany(temp, function(err, result) {
        console.log(err)
        console.log(result)
        callback(result);
    });
}

function sortObject(obj) {

    let tempor
    console.log("test du sort des values")
    //console.log(sortArray(Object.values(obj))
    return sortArray(Object.values(obj), {
        order: 'desc'
    }).reduce((a, v) => {
        console.log(obj.getKey(v))
        tempor = obj.getKey(v)
        a[tempor] = obj[tempor];
        return a;
    }, {});
}

/////////////////////
function sortObject2(obj) {

    console.log("test du sort des values")
    //console.log(sortArray(Object.values(obj))
    return sortArray(Object.keys(obj).map(function(x) {
        return parseInt(x, 10);
    }), {
        order: 'desc'
    }).reduce((a, v) => {
        a[v] = obj[v];
        return a;
    }, {});
}

///////////////////////
var bot_tmp;
var time_promise;

function play(skip){
	clearTimeout(time_promise);
	time_promise= setTimeout(function(){
		voiceChannel.leave();
	},3600000);

	var stream;
	if(skip!=null){
		stream=skip;
	}else{
		console.log("stream de queue")
		stream=music.musicData.queue[0];
		console.log(stream)
	}

	console.log("streami")
	console.log(music.musicData.queue)
	console.log(stream)
	console.log(typeof(stream))

        if (!voiceChannel)
            return console.error("DOES NOT EXIST FDP");

        voiceChannel.join().then(async connection => {
                connection.play(new Silence(), {
                        type: 'opus'
                });
		if(stream.includes("youtu")){

			console.log("youtube")
			console.log(stream)

			try{
				songInfo = await ytdl.getInfo(stream);
			}catch(error){
				console.log("lien éronné")
				music.musicData.queue.shift();
				return play();
			}

			const song = {
				title: songInfo.title,
				url: songInfo.video_url,
			};

			textChannel.send(song.title);

			console.log(song);
			
				disp = connection.play(ytdl(stream,{quality: 'highestaudio', filter: 'audioonly'}));

		}else if(stream.includes("soundcloud")){
			console.log("soundcloud");
			songInfo=null;

//			disp = connection.play(soundcloudr.getStreamUrl(streami[0]));

		}

		disp.on('speaking', speak => {
			if(speak == 0){
				if(music.musicData.queue.length >=1){
					console.log("autre son detected")
					play();
				}else{
//					console.log("pas d'autres son");
					music.musicData.isPlaying = false;
					music.musicData.songDispatcher = null;
				}
				console.log("fin")
			}
		});

		disp.on('start', async () => {
			console.log("lancement")
			music.musicData.songDispatcher = disp;
			music.musicData.isPlaying = true;
			if(skip!=null){
			
			}else{
				music.musicData.queue.shift();
			}
		});

		disp_time=disp.streamTime/1000


            })
            .catch(err => {
                console.log(err);
            });

}
//////////////////////

var user_carre
var disp
var disp_time
var songInfo

bot.on('ready', async () => {

    console.log('ready')
});

bot.on('voiceStateUpdate', async (oldState, newState) => {

    if ((oldState.channelID === null || oldState.channelID === undefined) && newState.channelID !== null) {
        //    console.log("vocal joined")
    } else if (newState.channelID === null || newState.channelID === undefined) {
        //    console.log("vocal left")
    } else {
        //    console.log("vocal mute/unmute")
    }

});


bot.on('message', async message => {

    var valuesUser
    var valuesDeb
    var stats_com = [];
    let user_cache = [];
//    var tempo = message.member.user.username;
    var tempo = message.member.user.id;

    args = message.content.slice(prefix.length).trim().split(/ +/g);
    command = args.shift().toLowerCase();

if(message.member.user.username.startsWith('Ananal') && tempo !=205846014597398529){
            message.channel.send("Nique ta mere Boris");
		return;
}

    if (!message.content.startsWith(prefix) || (tempo != 205846014597398529 //Ananal
&& tempo != 231898362599833600
&& tempo != 380923442775588864
&& tempo != 301071753025945600
&& tempo != 711236626260426803
&& tempo != 207965691184152576
&& tempo != 702302686871027713
&& tempo != 174293077618327554
&& tempo != 316637442432040961
&& tempo != 202054991320449024
&& tempo != 688928619925340200
&& tempo != 279977233404264450
&& tempo != 259328455223672833)){


	//console.log('non validé')
        return;
    }

    if (message.content.startsWith("!time")) {
	console.log("time")
	console.log(disp_time)
	console.log(songInfo.length_seconds)
	if(songInfo != null){
		let remain_time = songInfo.length_seconds-(disp_time)+' secondes restantes'
       	 	message.channel.send(remain_time);
	}
    }else if (message.content.startsWith("!queue")) {

        console.log(music);
//        console.log(message.guild.triviaData);
        voiceChannel = bot.channels.cache.get('278706666176774144');
        textChannel = message.channel;

	let stream=args[0];
	let test = stream.includes("youtu") || stream.includes("soundcloud");

	if(music.musicData.isPlaying == false && stream != null && test){
		music.musicData.isPlaying = true;
		music.musicData.queue.push(stream);
		return play()
	}else if(stream != null && test){
		music.musicData.queue.push(stream);
		console.log(music.musicData.queue);
	        console.log(music);
		return;
	}else{

		message.channel.send("Mauvaise commmande");
	}
    }else if (message.content.startsWith("!test") && ( tempo == 231898362599833600
|| tempo == 205846014597398529
|| tempo == 279977233404264450)
) {
       console.log("test")
        voiceChannel = bot.channels.cache.get('278706666176774144');
        textChannel = message.channel;

	if(args[0] == 'mp3'){
		if(message.attachments.first()){
			console.log("mp3")
			await request.get(message.attachments.first().url).on('error',console.error)
			.pipe(fs.createWriteStream('tempo.mp3').on('finish', () =>{

		        voiceChannel = bot.channels.cache.get('278706666176774144');

        		console.log("join le vocal audio");
   			//     console.log(lien);
        		if (!voiceChannel)
        		    return console.error("DOES NOT EXIST FDP");

 		       voiceChannel.join().then(async connection => {

		                connection.play(new Silence(), {
        		                type: 'opus'
                		});

		                disp = connection.play('tempo.mp3', {
        		               volume: 1
                		});

				disp_time=disp.streamTime/1000



                   		 disp.on("speaking", speaking => {
       //            		     console.log('fin');
         //          		     console.log(speaking);
                   		 });

 		           })
        		    .catch(err => {
               		 console.log(err);
            		});


			}))

///////////////////////////////////////


///////////////////////////////////////

			//console.log(message.attachments.first().url)
		}
		return;
	}else{
	        console.log("Balance le test")
	        console.log(args[0])
		play(args[0]);
	}
    } else if ((message.content.startsWith("!text")) && (tempo == 227128586396499968
|| tempo == 702302686871027713
|| tempo == 205846014597398529
|| tempo == 688928619925340200
|| tempo == 301071753025945600)){
	 console.log("text invoque")
        //message.content
        const args = message.content.slice("!".length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        queue_user.push(tempo)
        retient_nom = tempo;
        retient_temp = new Date().getTime();

        console.log(command);
        console.log(args);
        console.log(args.join(' '));

        params = {
            text: args.join(' '),
            voice: 'fr-FR_ReneeVoice', // Optional voice
            accept: 'audio/wav'
        };

        // Synthesize speech, correct the wav header, then save to disk
        // (wav header requires a file length, but this is unknown until after the header is already generated and sent)
        // note that `repairWavHeaderStream` will read the whole stream into memory in order to process it.
        // the method returns a Promise that resolves with the repaired buffer
        textToSpeech.synthesize(params)
            .then(response => {
                audio = response.result;
                return textToSpeech.repairWavHeaderStream(audio);
            })
            .then(repairedFile => {
                fs.writeFileSync('audio.wav', repairedFile);
                console.log('audio.wav written with a corrected wav header');
                //DEBUT
                voiceChannel = bot.channels.cache.get('278706666176774144');
                //console.log(voiceChannel);
                console.log("join le vocal audio");
                if (!voiceChannel)
                    return console.error("DOES NOT EXIST FDP");
                //console.log(voiceChannel);
                voiceChannel.join().then(connection => {
                    //console.log(connection);
                    connection.play(new Silence(), {
                        type: 'opus'
                    });

                    console.log("lancement du mp3");

                    dispatcher = connection.play('/home/moveon/bot_text/audio.wav', {
                        volume: 1
                    });
                    dispatcher.on("end", end => {
                        console.log('fin');
                    });

                });
                //		voiceChannel.leave();
                //FIN
            })
            .catch(err => {
                console.log(err);
            });
	}

        //var user = execSync('pico2wave  -l  fr-FR  -w  audio2.wav  \"'+ args.join(' ')+' \"');
        //var user = execSync('python3  /home/moveon/bot/txt2wav.py  \"'+ args.join(' ')+' \"');
        //console.log('fin');

        //DEBUT

  /*      const voiceChannel = bot.channels.cache.get('278706666176774144');
        //console.log(voiceChannel);
        console.log("join le vocal audio");
        if (!voiceChannel)
            return console.error("DOES NOT EXIST FDP");
        //console.log(voiceChannel);
        voiceChannel.join().then(connection => {
            //console.log(connection);
            connection.play(new Silence(), {
                type: 'opus'
            });

            console.log("lancement du mp3");

            //const dispatcher = connection.play('/home/moveon/bot/audio3.wav',{ volume : 1});
           // dispatcher.on("end", end => {
           //     console.log('fin');
           // });

        });
        //		voiceChannel.leave();
        //FIN
*/
});

//console.log("DEBUT DU CODE")
//Object.getPrototypeOf
bot.login(path_val.selfbottoken[4]);
