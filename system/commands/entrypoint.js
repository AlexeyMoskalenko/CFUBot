const UTILS = require(global.INCLUDEDIR+'/utils');

let Associations = require(global.COMMANDPATH+'associations.json');

function fetchcommand(msg, client){
    let retobject = {
        func : null,
        error : false,
    }

    Associations.forEach(commandobj => {
        commandobj.aliases.forEach(commandalias => {
            let regex = new RegExp("<@!"+ client.user.id + ">\\s{0,}" + global.Additional.commandsign+commandalias+ "\\b.{0,}$", "i")
            if (msg.content.match(regex)){
                if (UTILS.msghasleastperms(msg, commandobj.permissions)){
                    retobject.func = function(args){ 
                        getfunc = require(global.COMMANDPACKPATH + commandobj.cmdfolder + "/main.js");
                        getfunc(args, commandalias, commandobj);
                    }
                    retobject.error = 0;
                    return;
                }
                else{
                    // У отправителя нет прав на комманду.
                    retobject.error = 2;
                    return;
                }
            }
        })
        if (retobject.error !== false) return;
    });

    // Если за все итерации error стейт не изменился - команда была не найдена
    if (retobject.error === false) retobject.error = 1;

    // Таким образом, false никогда не будет возвращён
    return retobject;
}

module.exports = fetchcommand;