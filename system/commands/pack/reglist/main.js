let     Dictionary  = require(global.PROJECTDIR+'botdictionary.json');
let     MongoCFG    = require(global.PROJECTDIR+'mongodbcfg.json');

module.exports =
function(arg, name, aliascommand){
    let database = arg.MongoClient.db(MongoCFG.regdb);
    let collection = database.collection(MongoCFG.collreglist);
    collection.find().toArray((err, res)=>{
        if (err){ 
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#02");
            return arg.msg.reply(errmsg);
        }
        let replylist = [];
        res.forEach((value,index)=>{
            replylist.push("ID: " + value.id + "\t| "+ value.name);
        });
        if (!replylist.length){ 
            let errmsg = Dictionary.errors.mongodberror.replace("#00", "#02");
            return arg.msg.reply(errmsg);
        }
        let replymsg = Dictionary.reply.reglistsucc + "```\n" + replylist.join("\n") + "\n```"; 
        arg.msg.reply(replymsg);
    });
}
