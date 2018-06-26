"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const indexObject = require("./indexJson");
const node_fetch_1 = require("node-fetch");
let connection = null;
let index = -1;
let rows = null;
function updateBase() {
    return __awaiter(this, void 0, void 0, function* () {
        let indexAlias = yield getElastic("fotobase");
        let target = "";
        let oldTarget = "";
        let key = "";
        for (key in indexAlias)
            break;
        if (key == "foto1") {
            target = "foto2";
            oldTarget = "foto1";
        }
        else {
            target = "foto1";
            oldTarget = "foto2";
        }
        console.log(target);
        console.log("1");
        yield deleteIndex(target);
        console.log("2");
        yield putIndex(target);
        console.log("3");
        yield traverseIndex(target);
        console.log("4");
        yield changeAlias(oldTarget, target);
        console.log("5");
        process.exit(0);
    });
}
exports.updateBase = updateBase;
function changeAlias(oldTarget, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let obj = indexObject.aliasChange.actions[0];
        obj.remove.index = oldTarget;
        let obj2 = indexObject.aliasChange.actions[1];
        obj2.add.index = target;
        indexObject.aliasChange.actions = new Array();
        indexObject.aliasChange.actions.push(obj);
        indexObject.aliasChange.actions.push(obj2);
        let res = yield postElastic("_aliases", indexObject.aliasChange);
        console.log(JSON.stringify(res, null, 2));
    });
}
function getElastic(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mitObjekt = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json'
                }
            };
            const result = yield node_fetch_1.default('http://itfds-prod03.uio.no/elasticapi/' + url, (mitObjekt));
            var answer = yield result.text();
        }
        catch (error) {
            console.log("error: " + error);
        }
        return JSON.parse(answer);
    });
}
exports.getElastic = getElastic;
function deleteIndex(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mitObjekt = {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json'
                }
            };
            const result = yield node_fetch_1.default('http://itfds-prod03.uio.no/elasticapi/' + url, (mitObjekt));
            var answer = yield result.text();
        }
        catch (error) {
            //    console.log("error: " + error);
        }
        //  console.log(answer);
    });
}
exports.deleteIndex = deleteIndex;
function putIndex(target) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mitObjekt = {
                method: 'PUT',
                body: JSON.stringify(indexObject.templateIndex),
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json'
                }
            };
            const result = yield node_fetch_1.default('http://itfds-prod03.uio.no/elasticapi/' + target, (mitObjekt));
            var answer = yield result.text();
        }
        catch (error) {
            console.log("error: " + error);
        }
        console.log(answer);
        //  return JSON.parse(answer);
    });
}
exports.putIndex = putIndex;
function postElastic(appendurl, body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mitObjekt = {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json'
                }
            };
            const result = yield node_fetch_1.default('http://itfds-prod03.uio.no/elasticapi/' + appendurl, (mitObjekt));
            var answer = yield result.text();
        }
        catch (error) {
            console.log("error: " + error);
        }
        return JSON.parse(answer);
    });
}
exports.postElastic = postElastic;
function traverseIndex(target) {
    return __awaiter(this, void 0, void 0, function* () {
        let appendURL = "unifotobase/billede/_search?q=kan_webpubliseres:\"1\"";
        let obj = new Object();
        obj.size = 50000;
        let res = yield postElastic(appendURL, obj);
        let docs = res.hits.hits;
        console.log("Antal poster " + docs.length);
        for (let temp = 0; temp < docs.length; temp++) {
            let source = docs[temp]._source;
            delete source.fra_År;
            delete source.til_År;
            delete source.fotograf;
            delete source.fotografRolle;
            delete source.analog;
            delete source.positiv;
            delete source.internKommentar;
            delete source.bruker;
            delete source.old_mediagruppe_enhets_id;
            delete source.old_foto_kort_id;
            delete source.kan_webpubliseres;
            let appendURL = target + "/billede/" + source.foto_kort_id;
            let res = yield postElastic(appendURL, source);
        }
    });
}
//# sourceMappingURL=transform.js.map