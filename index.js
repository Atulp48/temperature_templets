const http = require("http");
const fs = require("fs");
var requests = require("requests")

const file = fs.readFileSync("HOME.html", "utf-8");

const replaceval = (tempval, orgval) => {

    let temperature = tempval.replace("{%tempval%}", orgval.main.temp);
    temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
    temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
    temperature = temperature.replace("{%location%}", orgval.name);
    temperature = temperature.replace("{%country%}", orgval.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgval.weather[0].main);
    return temperature;
} 

const server = http.createServer((req, res) => {
    if (req.url = "/") {
        requests('https://api.openweathermap.org/data/2.5/weather?q=jaunpur&appid=ffd967aa8d24e1e560a9e224412e42ff')
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk)
                const arrdata = [objdata]
                // console.log(arrdata[0].main.temp)
                // console.log((arrdata[0].main.temp)/10)
                const realtimedata = arrdata.map((val) => replaceval(file, val)).join("");
                res.write(realtimedata);
                console.log(realtimedata);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }

});
server.listen(8000, "127.0.0.1")