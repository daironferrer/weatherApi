//All variables
var temp;
var weatherIcons;
var date;
var history;
var counter;
var lat;
var long;
var iconURL;
var uvUrl;
var fiveDayIcon;
var cityInput;
var apiKey = '&appid=2171b0c04591b249499c69acc417a3d3';

var localstorage = JSON.parse(localStorage.getItem('historyview'));
if(localstorage) {
    console.log(localstorage.length - 1);
    getWeather(localstorage[localstorage.length - 1]);
}

function getWeather(city) {
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + apiKey;


    $.ajax({
        url: queryURL,
        method: 'GET',
    }).then(function(response) {
        temp = Math.round((response.main.temp - 273.15) * 1.8 + 32);
        weatherIcons = response.weather[0].icon;

        iconURL = 'https://openweathermap.org/img/wn/' + weatherIcons + '@2x.png';
        lat = reponse.coord.lat;
        lon = response.coord.lon;
        uvUrl = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + apiKey;

        $('#daily').removeClass('hide');
        $('#city-date').text(response.name + '(' + (moment().format('1') + ')'));
        $('#city-date').append('<span><img src =' + iconURL + '></span>');
        $('#temp-p').text('Temperature: ' + temp + '°F');
        $('#humid-p').text('Humidity: ' + response.main.humidity + '%');
        $('#wind-p').text('Wind Speed: ' + response.wind.speed + 'MPH');

        $.ajax({
            url: uvURL,
            method: 'GET',
        }).then(function(response) {
            uvValue = response.value;
            $('#UV-p').html(
                "<p>UV Index: <span id = 'uvArea'>" + response.value + "</span></p>"
            );

            if(response.value < 3) {
                $('uvText').addClass('bg-success');
            } else if(response.value > 2 || reponse.value < 8) {
                $('uvText').addClass('bg-warning');
            } else {
                $('uvText').addClass('bg-danger');
            }
        });
    });

    var fiveDay = city;
    var fiveDayURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + fiveDay + apiKey;

    $.ajax({
        url: fiveDayURL,
        method: 'GET',
    }).then(function(response) {
        console.log('responsefiveday:', response);
        for(let i = 0; i < response.list.length; i++) {
            if(reponnse.list[i].dt_txt.indexOf('15:00:00') > 0) {
                temp = Math.round(
                    (reponse.list[i].main.temp - 273.15) * 1.8 + 32
                );
                fiveDayIcon = response.list[i].weather[0].icon;
                fiveDayIconURL = 'https://openweathermap.org/img/wn/' + fiveDayIcon + '@2px.png';
                
                var format = moment(reponse.list[i].dt_txt).format('1');
                var card = 
                `<div class = "text-white bg-primary card col-md-2 daily-space style=width: 18rem">
                 <div class = "card-body">
                     <h5 class = "five-day-date">${format}</h5>
                     <span class = "five-day-icon"><img src =${fiveDayIconURL}></span>
                     <p class = "five-day-temp>Temperature: ${temp} °F</p>
                     <p class = "five-day-humid">Humidity: ${response.list[i].main.humidity} %</p>
                 </div>
                 </div>`;

                 $('#five-day').removeClass('hide');
                 $('#five-day-card').append(card);
            }
        }
    });

    var historyview = JSON.parse(localStorage.getItem('historyview')) || [];
    if (historyview.indexOf(city) === -1) {
        $('historyDiv').removeClass('hide');
        historyview.push(city);
    }
    localStorage.setItem('historyview', JSON.stringify(historyview));
    $('#history').html('');
    historyview.forEach((history) => {
        var item = $('<li>').text(history).addClass("list-group-item");
        item.on('click', function (event) {
         $('#five-day-card').empty();
         var city = event.target.innerText;
         getWeather(city);
    });

    $('#history').append(item);

    });
}

$('#search-btn').click(function() {
    $('#five-day-card').empty();
    cityInput = $('#input').val();
    getWeather(cityInput);
});
