var app = new Vue({
    el: "#app",
    data: {
        city: "广州",
        weatherList: [],
        cityHots: ["北京","上海","广州", "深圳"]
    },
    methods: {
        getWeather: function () {
            console.log(this.city);
            var that = this;
            axios.get("http://wthrcdn.etouch.cn/weather_mini?city=" + this.city)
                .then(function (response) {
                    //console.log(response)
                    console.log(response.data.data.forecast)
                    that.weatherList = response.data.data.forecast
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        changeCity: function(city){
            this.city = city;
            this.getWeather();
        }
    }
})