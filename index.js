const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync('home.html', 'utf-8');

const replaceVal = (tempVal, orgVal) =>{
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;
    
}

const server = http.createServer((req,res) => {
    if(req.url == '/'){
        requests("http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=ef1c1443d4251e2a4519056fe5e27301"
        )
        .on("data", (chunk) => {
         const objData = JSON.parse(chunk); //convert Json data to object
         const arrData = [objData]; //passing object to an array i,e; array of an object
         //console.log(arrData[0].main.temp);
         const realTimeData = arrData.map((val) => replaceVal(homeFile, val))
         .join("");//To convert array data to string
         res.write(realTimeData);
    })
    .on('end', (err) => {
        if (err) return console.log('connection closed due to errors', err);
        console.log('end');
        res.end();
    });
    }
});

server.listen(8000,"127.0.0.1", ()=>{
    console.log("Listening to the Port : 8000");
});