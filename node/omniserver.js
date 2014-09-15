/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */
/*global */

(function () {
    "use strict";

    var os = require("os");
    var request = require('request');

    function cmdGetMemory(callbackfn) {
        //return {total: os.totalmem(), free: os.freemem()};
        request('http://www.google.com', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callbackfn(null, body);
            } else {
                callbackfn('oops');
            }
        })
    }


    function init(DomainManager) {
        if (!DomainManager.hasDomain("omniserver")) {
            DomainManager.registerDomain("omniserver", {
                major: 0,
                minor: 1
            });
        }
        DomainManager.registerCommand(
            "omniserver", // domain name
            "getMemory", // command name
            cmdGetMemory, // command handler function
            true, // this command is synchronous
            "Returns the total and free memory on the user's system in bytes", [], // no parameters
            [{
                name: "memory",
                type: "{total: number, free: number}",
                description: "amount of total and free memory in bytes"
            }]
        );
    }

    exports.init = init;

}());