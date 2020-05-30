var path = window.location.pathname;
var result = path.match('(^/[A-Z]+-[0-9]+)-');
if (result != null){
    //console.log("result: " +result[1])
    fetch('https://api.thelabs.dev/price-history/ml/item' + result[1]).then(r => r.text()).then(result => {
        var response = JSON.parse(result);
        if (response.code == 200){
            
            //$('.vip-gallery-container').append('<div class="row container ui-recommendations ui-recommendations--desktop ui-recommendations--seller ui-recommendations--seller  ui-recommendations--with-extra-one with-footer"><h2 class="main-section__title">Histórico de precios</h2><div style="position: relative; height:200px"><canvas id="ml-price-history-gra"></canvas></div></div>');
            $('.vip-gallery-container').append('<div class="ml-container-price-history"><h2 class="ml-title-price-history">Histórico de precios</h2><div style="position: relative; height:200px"><canvas id="ml-price-history-gra"></canvas></div></div>');
            var config = {
                type: 'line',
                data: response.data,
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
                                parser: 'YYYY-MM-DD HH:mm:ss.SSS',
                                tooltipFormat: 'DD / MM / YYYY',
                                displayFormats: {
                                    year: 'DD/MM/YYYY',
                                    quarter: 'DD/MM/YYYY',
                                    month :'MMM D',
                                    week:'D',
                                    day:'ddd',
                                    hour:'ddd',
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
    })
}
