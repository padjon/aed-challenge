var express = require('express');
var app = express();
var fs = require('fs');
const { exec } = require('child_process');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('http'));

app.get("/setParams/:line", (req, res) => {
    fs.writeFile("http/input.csv", req.params.line, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
        
        exec('D:\\dev\\aed-challenge\\http\\refreshExcel.vbs', (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                // node couldn't execute the command
                return;
            }

            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            res.sendStatus(200);
        });
    });
})

app.listen(8080, function () {
    console.log('Example app listening on port 3000!');
});

