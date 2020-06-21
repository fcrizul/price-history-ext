var path = window.location.pathname;
var result = path.match('(^/[A-Z]+-[0-9]+)-');
var debug = true;

if (result != null){
    var key = result[1].substring(1)
    
    chrome.storage.local.get("dateClearCache", function(res) {
        if(res.dateClearCache != null){
            var dateClearCache = new Date();
            dateClearCache.setTime(res.dateClearCache); 
            var current = new Date();
            if(!((current.getFullYear() == dateClearCache.getFullYear()) || 
                (current.getMonth() == dateClearCache.getMonth()) ||
                (current.getDay() == dateClearCache.getDay())
            )){
                chrome.storage.local.clear(function() {
                    console.log("Cache eliminado");
                    var error = chrome.runtime.lastError;
                    if (error) {
                        console.error(error);
                    }else{
                        chrome.storage.local.set({'dateClearCache':current.getTime()}, function() {
                            
                        });
                    }
                });
            }
        }else{
            var current = new Date();
            chrome.storage.local.set({'dateClearCache':current.getTime()}, function() {
                            
            });
        }
    });

    chrome.storage.local.get(key, function(res) {
        chrome.storage.local.getBytesInUse(null, function(bytes) {
            console.log("Total MB in use: " + (bytes/(1024 * 1024)));
        });

    
        if(debug || res[key] == null){
            getData(key);
        }else{
            console.log('Valor en cache');
            var date_storage = new Date();
            date_storage.setTime(res[key].date + (30*60*1000)); 
            if(date_storage.getTime() > (new Date()).getTime()){
                console.log('Valor desde cache');
                showChart(res[key].data);
            }else{
                chrome.storage.local.remove(key, function (){
                    console.log(key +" has been removed");
                });
                console.log('Actualizando valor de cache');
                getData(key);
            }
        }
      });
}

function getData(key) {
    fetch('https://api.thelabs.dev/price-history/ml/item/' + key).then(r => r.text()).then(result => {
        var response = JSON.parse(result);
        if (response.code == 200){
            var storageData = {};
            storageData['date'] =  Date.now();
            storageData['data'] =  response.data;
            chrome.storage.local.set({[key]:storageData}, function() {
                console.log('Se guardó en cache ' + key);
              });
            showChart(response.data);
        }
    })
}

function showChart(data) {
    var container = $('.vip-gallery-container');
    if (!container.length){
        container = $('.layout-short-description');
    }

    container.append('<div class="ml-container-price-history"><h2 class="ml-title-price-history">Histórico de precios</h2><div style="position: relative; height:200px"><canvas id="ml-price-history-gra"></canvas></div></div>');
    var config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false
            },
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        parser: 'YYYY-MM-DD HH:mm:ss.S Z',
                        tooltipFormat: 'DD / MM / YYYY',
                        displayFormats: {
                            year: 'DD/MM/YYYY',
                            quarter: 'DD/MM/YYYY',
                            month :'MMM D',
                            week:'MMM D',
                            day:'MMM D',
                            hour:'ddd D',
                            minute:'ddd',
                            second:'HH:mm',
                            millisecond:'HH:mm',
                        },
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                }],
                yAxes: [{
                    type: 'linear',
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                }]
            },
        }
    };
    var ctx = document.getElementById('ml-price-history-gra').getContext('2d');
    window.myLine = new Chart(ctx, config);
  }