var UI = require("ui");
var ajax = require("ajax");

var url = "http://pragadeesh.com/api/news";
var apikey = "e236170751374a16baeba38103934c18";

Pebble.addEventListener('showConfiguration', function() {
  var url = 'http://pragadeesh.com/config.html';
  Pebble.openURL(url);
});

Pebble.addEventListener('webviewclosed', function(e) {
  // Decode the user's preferences
    console.log("done5");
    var configData = JSON.parse(decodeURIComponent(e.response));
    var x = 0;
    var i = 0;
    for(var key in configData) {
        console.log(key); console.log(configData[key]);
        console.log(typeof configData[key]);
        if(configData[key] == 1) {
            x = (1<<i) | x;
        }
        i++;
    }

    console.log(x);
    var url = "http://pragadeesh.com:5000/api/config/" + x.toString(10);
    console.log(url);
    ajax(url,
        function(e) {
            console.log(e + " Success sending config");
        },
        function(e) {
            console.log(e + " error sending config");
        }
    );
});

var splash = new UI.Card({
    title: "GLANCR",
    subtitle: "Loading news"
});

splash.show();

function showCard(news, index) { 
    
    if(index >= 5) {
        index = 0;
    }
    
    console.log(index);
    var card = new UI.Card({
        style: "small",
        title: news[index]["name"],
        body: news[index]["description"]
    });

    card.show();
}

console.log("done1");

function gotNews(data) {
        console.log("done2");
        var currentNewsIndex = 0;
        var news = data["value"];
        
        function getNews(index) {    
            var newsCard = new UI.Card({
                style: "small",
                scrollable: "true",
                title: news[index]["name"],
                body: news[index]["description"]
            });            
            return newsCard;
        }
        console.log("done3");

        var nitems = [];
        for(var i = 0; i < 10; i++) {
            nitems.push({
                title: news[i]["name"],
                subtitle: news[i]["description"]
            });
        }
        
        console.log("done4");
        
       var menu = new UI.Menu({
           style:"small",
          sections: [{
            title: 'NEWS',
            items: nitems
          }]
        });

        menu.show();
        menu.on("select", function(e) {
            var item = e.itemIndex;
            var card = getNews(item);
            card.show();
            card.on("select", function(e) {
                var nc = new UI.Card({
                    body: "Interested!"
                });

                nc.show();
                var url = "http://pragadeesh.com/api/register/";
                console.log(url);
            });
        });

}

ajax({url: "https://bingapis.azure-api.net/api/v5/news/search?q=business&count=10",
        type: "json",    
            headers: {"Ocp-Apim-Subscription-Key": apikey}
        },  gotNews,    
    function(err) {
        console.log("here");
    }            
);