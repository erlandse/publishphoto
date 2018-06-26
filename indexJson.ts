export let templateIndex={
  "settings": {
    "index": {
      "number_of_shards": "1",
      "number_of_replicas": "1",
      "max_result_window" : 500000
    }
  },
  "mappings": {
    "billede": {
      "properties": {
        "alledata":{
          "type":"text",
          "fielddata": true,          
          "analyzer":"standard"
        },
        "persondata": {
          "type": "keyword",
          "store": true
        },
        "personText": {
          "type":"text",
          "fielddata": true,          
          "store": true
        },
        "foto_kort_id": {
          "type": "integer",
          "store": true
        },
        "koblinger": {
          "type": "integer",
          "store": true
        },
        "datering_fra": {
           "type": "keyword",
         "store": true
        },
        "datering_til": {
           "type": "keyword",
           "store": true
        },
        "sted": {
          "type": "text",
          "fielddata": true,          
          "analyzer":"standard"
        },
        "stedkommentar": {
          "type": "text",
          "fielddata": true,          
          "analyzer": "norwegian"
        },
        "stedListe": {
          "type": "keyword",
          "store" : true
        },
        "motiv": {
          "type": "text",
          "analyzer": "norwegian"
        },
        "tema": {
          "type": "keyword",
          "store": true
        },
        "mediagruppe_enhets_id": {
          "type": "integer"
        },
        "datering_dato": {
          "type": "date",
          "store": true
        },
        "fotograf": {
          "type": "keyword",
          "store": true
        },
        "annen_info": {
          "type": "text",
          "analyzer": "norwegian"
        },
        "filnavn": {
          "type": "keyword",
          "store": true
        },
        "sjanger": {
          "type": "keyword",
          "store": true
        },
        "materiale": {
          "type": "keyword",
          "store": true
        },
        "registrert_dato": {
          "type": "date",
          "format": "yyyy-MM-dd"
        }
      }
    }
  }
};

export let aliasChange={
  "actions" : [
      { "remove" : { "index" : "muv", "alias" : "fotobase" } },
      { "add" : { "index" : "muv2", "alias" : "fotobase" } }
  ]
}
