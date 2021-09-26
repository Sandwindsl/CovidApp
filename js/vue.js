Vue.component('component-header-menu',{
    template: '<h2>{{titulo}}</h2>',
    data: function(){
        return { titulo: 'Header menu' }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        srcLogo: 'img/covid-icon.png',
        dataCovid: {
            data: null,
            globalData: {
                countries: 0,
                population: 0,
                cases: 0,
                todayCases: 0,
                deaths: 0,
                todayDeaths: 0,
                recovered: 0,
                todayRecovered: 0,
                active: 0,
                critical: 0
            },
            spain: {
                population: 0,
                cases: 0,
                todayCases: 0,
                deaths: 0,
                todayDeaths: 0,
                recovered: 0,
                todayRecovered: 0,
                active: 0,
                critical: 0
            },
        },
        dataChLineAll: {
            data: null,
            globalData: {
            }
        },


    },
    created: function(){
        // datos Covid-19 de todos los paises
        this.callApi('https://corona.lmao.ninja/v2/countries?yesterday=&sort=', null, 'backDataCovid');
        
        // datos Covid-19 de todos los paises para gráficas ChLine
        var range = this.getRangeDaysChLine();
        this.callApi('https://corona.lmao.ninja/v2/historical?lastdays=' + range, null, 'backDataChLineAll');

    },
    methods: {

        callApi(url, params, callBack){
            axios.get(url)
            .then((val) => {
                if ( (val.status == 200) && (val.data.length > 0) ) {

                    switch (callBack) {
                        case 'backDataCovid':
                            //this.callBack(val);
                            this.backDataCovid(val);
                            break;

                        case 'backDataChLineAll':
                            this.backDataChLineAll(val);
                            break;
                        default:
                            break;
                    }

                }
            })
            .catch((err) => {
                console.log(err);
            });
        },

        backDataCovid(dataApi){
            this.dataCovid.data = dataApi.data;
            this.getDataCovidDTO();
        },

        backDataChLineAll(dataApi){
            this.dataChLineAll.data = dataApi.data;
            this.getDataChLineAllDTO();
        },

        getDataCovidDTO(){
            if (this.dataCovid.data) {
                this.dataCovid.globalData.countries = this.dataCovid.data.length;

                for (let index = 0; index < this.dataCovid.data.length; index++) {
                    if (this.dataCovid.data[index].country == 'Spain'){
                        this.getDataSpainDTO(this.dataCovid.data[index]);
                    }

                    this.dataCovid.globalData.population += this.dataCovid.data[index].population;
                    this.dataCovid.globalData.cases += this.dataCovid.data[index].cases;
                    this.dataCovid.globalData.todayCases += this.dataCovid.data[index].todayCases;
                    this.dataCovid.globalData.deaths += this.dataCovid.data[index].deaths;
                    this.dataCovid.globalData.todayDeaths += this.dataCovid.data[index].todayDeaths;
                    this.dataCovid.globalData.recovered += this.dataCovid.data[index].recovered;
                    this.dataCovid.globalData.todayRecovered += this.dataCovid.data[index].todayRecovered;
                    this.dataCovid.globalData.active += this.dataCovid.data[index].active;
                    this.dataCovid.globalData.critical += this.dataCovid.data[index].critical;
                }
            }
        },

        getDataSpainDTO(country){
            this.dataCovid.spain.population = country.population;
            this.dataCovid.spain.cases = country.cases;
            this.dataCovid.spain.todayCases = country.todayCases;
            this.dataCovid.spain.deaths = country.deaths;
            this.dataCovid.spain.todayDeaths = country.todayDeaths;
            this.dataCovid.spain.recovered = country.recovered;
            this.dataCovid.spain.todayRecovered = country.todayRecovered;
            this.dataCovid.spain.active = country.active;
            this.dataCovid.spain.critical = country.critical;
        },

        // número de días del año actual más el anterior para el endpoint
        getRangeDaysChLine(){
            // Año actual
            var currentDate = new Date();
            var startYear = new Date(currentDate.getFullYear(), 0, 0);
            var diffDays = currentDate - startYear;

            var oneDay = 1000 * 60 * 60 * 24;
            var daysCurrentYear = Math.floor(diffDays / oneDay);

            // Año anterior
            var startLastYear = new Date(currentDate.getFullYear() - 1, 0, 1);
            var endLastYear = new Date('01/01/'+currentDate.getFullYear());
            var diffDaysLastYear = endLastYear - startLastYear;
            var daysLastYear = Math.floor(diffDaysLastYear / oneDay);

            return daysCurrentYear + daysLastYear;
        },


        getDataTimeline(dataTimeline, year) {
            var timeline = [    { cases : [] },
                                { deaths : [] },
                                { recovered : [] }
                            ];
            var indexYear = (year) ? '/' + String(year).charAt(2) + String(year).charAt(3) : '/21';

                            console.log(dataTimeline);

            $.each(dataTimeline, function(key, element) {
                $.each(element, function(key2, data) {
                    // Buscar los 12 valores de casos { 1/1/21: 51526 }
                    // Buscar dentro del array/objeto el que tenga indice '1/31/21'; '2/28/21'; '3/31/21' ; '4/30/21' ; '5/31/21' ; '6/30/21' ; '7/31/21' ; '8/31/21' ; '9/30/21' ; '10/31/21' ; '11/30/21' ;'12/31/21'
                    // (key2 == '1/31/21') =>  data de enero de 2021
                    // array[mes-1] = data;

                    // dataObj = { element : array };

                    // si son casos insertar en casos (element == 'cases')
                    // dataObj = { 'cases' : array };
                    // timeline.push = dataObj;
                    //debugger;
                });
            });

                //dataTimeline.cases
                //dataTimeline.deaths
                //dataTimeline.recovered
            
            /*[   { cases : [totalJanuary, totalF,...] },
                { deaths : [totalJanuary, totalF,...] },
                { recovered : [totalJanuary, totalF,...] }
            ]*/

            // Año 2021 (/21) ; year =2021

            

            return timeline;
        },

        getDataChLineAllDTO(){
            if (this.dataChLineAll.data) {
                var currentDate = new Date();
                var year = currentDate.getFullYear();
                var lastYear = currentDate.getFullYear() - 1;

                arrYears = [
                                    { 'year21' : [] },
                                    { 'year20' : [] }
                                ];

                objCountry = {      country : null,
                                    data : [ {  cases : [],
                                                deaths : [],
                                                recovered : [],
                                    }]
                };

                this.dataChLineAll.data.forEach(element => {
                    objCountry.country = element.country;

                    // Año 2021 (/21)
                    
                    objCountry.data = this.getDataTimeline(element.timeline, year);
                    arrYears[0].year21.push = objCountry;

                    // Año 2021 (/20)
                    //objCountry.data = this.getDataTimeline(element.timeline, lastYear);
                    //arrYears[1].year20.push = objCountry;

                    //debugger;
                });

                /*
                    '2021' : [ {    pais : nombre,
                                    data : [    { cases : [totalJanuary, totalF,...] },
                                                { deaths : [totalJanuary, totalF,...] },
                                                { recovered : [totalJanuary, totalF,...] }
                                            ]

                                }, {} 
                            ],
                    '2020' : [{}]
                */
            } 
            debugger;
        },

        showModal(country){
            alert('mostra modal ' + country);
        }
    }
});