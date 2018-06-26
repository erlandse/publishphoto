import * as indexObject from './indexJson';
import fetch from 'node-fetch';
let connection = null;
let index = -1;
let rows = null;


export async function updateBase(){
  let indexAlias = await getElastic("fotobase");
  let target:string = "";
  let oldTarget= ""
  let key="";
  for(key in indexAlias)
    break;
 if(key == "foto1"){
   target="foto2"
   oldTarget="foto1";
 }  
 else{
   target="foto1";
   oldTarget="foto2"
 }  
 console.log(target);
 console.log("1");
 await deleteIndex(target);
 console.log("2");
 await putIndex(target);
 console.log("3");
 await traverseIndex(target);
 console.log("4");
 await changeAlias(oldTarget,target);
 console.log("5");
 
 process.exit(0);    
}



async function changeAlias(oldTarget,target){
    let obj:any= indexObject.aliasChange.actions[0];
    obj.remove.index=oldTarget;
    let obj2:any=indexObject.aliasChange.actions[1];
    obj2.add.index=target;  
    indexObject.aliasChange.actions = new Array();
    indexObject.aliasChange.actions.push(obj);
    indexObject.aliasChange.actions.push(obj2);
    let res = await postElastic("_aliases",indexObject.aliasChange);
    console.log(JSON.stringify(res,null,2));
  }
  

export async function getElastic(url:string){
  try {
    const mitObjekt = {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      }

    };
    const result = await fetch('http://itfds-prod03.uio.no/elasticapi/'+url, (mitObjekt));
    var answer = await result.text();
  }
  catch (error) {
    console.log("error: " + error);
  }
  return JSON.parse(answer);
  
}

export async function deleteIndex(url:string){
  try {
    const mitObjekt = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      }

    };
    const result = await fetch('http://itfds-prod03.uio.no/elasticapi/'+url, (mitObjekt));
    var answer = await result.text();
  }
  catch (error) {
//    console.log("error: " + error);
  }
//  console.log(answer);
  
}


export async function putIndex(target) {
  try {
    const mitObjekt = {
      method: 'PUT',
      body: JSON.stringify(indexObject.templateIndex),
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      }

    };
    const result = await fetch('http://itfds-prod03.uio.no/elasticapi/'+target, (mitObjekt));
    var answer = await result.text();
    console.log(answer);
  }
  catch (error) {
    console.log("error: " + error);
  }
  console.log(answer);
//  return JSON.parse(answer);
}

export async function postElastic(appendurl,body) {
  try {
    const mitObjekt = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      }

    };
    const result = await fetch('http://itfds-prod03.uio.no/elasticapi/'+appendurl, (mitObjekt));
    var answer = await result.text();
  }
  catch (error) {
    console.log("error: " + error);
  }

  return JSON.parse(answer);
}

async function traverseIndex(target){

  let appendURL = "unifotobase/billede/_search?q=kan_webpubliseres:\"1\"";
  let obj:any = new Object();
  obj.size=50000;
  let res = await postElastic(appendURL,obj);
  let docs = res.hits.hits;
  console.log("Antal poster " + docs.length);
  for(let temp = 0; temp < docs.length;temp++){
    let source= docs[temp]._source;
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
    let appendURL= target+"/billede/"+source.foto_kort_id;
    let res = await postElastic(appendURL,source);
  }

}
