const   MongoCFG    = require(global.MONGODBCFG);
const   Dictionary  = require(global.PROJECTDIR+'botdictionary.json');

// const   Mongo       = require('mongodb').MongoClient; // Удалить на релизе
// const MongoClient   = new Mongo(MongoCFG.url, {useUnifiedTopology: true}); // Удалить на релизе


module.exports =
function(arg, _, aliascommand){
    let database = arg.MongoClient.db(MongoCFG.regdb); // добавить arg. к MongoClient на релизе
    let collectionlist = database.collection(MongoCFG.collregreq);
    
    // Если аргумент hash отсутствует
    if (!aliascommand.commandargs.length) return arg.msg.reply(Dictionary.errors.wronrarg);

    collectionlist.findOne({hash: aliascommand.commandargs[0]}, (err, document) =>{
        if (err){
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#11"); 
            return arg.msg.reply(errmsg);
        }
        // Если null - неправильный hash 
        if (document != null){
            let role = arg.msg.guild.roles.cache.find((value) => {
                return value.name == document.role;
            });

            if (role === undefined) return arg.msg.reply(Dictionary.errors.reqaccrolenotfound);

            collectionlist.deleteOne(document, (_err, _res) => {
                
                if (err){
                    let errmsg = Dictionary.errors.mongodberror.replace("#00", "#12"); 
                    return arg.msg.reply(errmsg);
                }
                
                if (_res.result.ok != 1){
                    let errmsg = Dictionary.errors.mongodberror.replace("#00", "#13"); 
                    return arg.msg.reply(errmsg);
                }

                let user = arg.msg.guild.members.cache.find((value) => {
                    return value.id == document.userid;
                });
                
                // Если найден - находится в канале
                if (user){
                    let replyDMmsg = Dictionary.DM.regaccmsg.replace("#profile", document.profilename);
                        user.roles.add(role);
                    // Может быть ошибка, по причине закрытых сообщений
                    try{
                        user.send(replyDMmsg);

                        let replymsg = Dictionary.reply.reqacc.replace("#hash", aliascommand.commandargs[0]);
                        replymsg += "\n" + Dictionary.additional.reqnotified;
                        arg.msg.reply(replymsg);
                    }catch(e){
                        let replymsg = Dictionary.reply.reqacc.replace("#hash", aliascommand.commandargs[0]);
                        replymsg += "\n" + Dictionary.additional.reqcloseddm;
                        arg.msg.reply(replymsg);
                    }
                }
                else{
                    let replymsg = Dictionary.reply.reqacc.replace("#hash", aliascommand.commandargs[0]);
                    replymsg += "\n" + Dictionary.additional.reqnotmember;
                    arg.msg.reply(replymsg);
                }
            });
        }
        else return arg.msg.reply(Dictionary.errors.reqhashnotfound);
    });
}