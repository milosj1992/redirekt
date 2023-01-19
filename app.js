const axios = require('axios');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Client = require('node-rest-client').Client;
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
});

const getCountryDOmen=(flag)=>{
    if (flag === "ES") {
        return  "https://www.mytrendyphone.es";
    }
    if (flag === "DK") {
        return  "https://www.mytrendyphone.dk";
    }
    if (flag === "SE") {
        return  "https://www.mytrendyphone.se";
    }
    if (flag === "NO") {
        return  "https://www.mytrendyphone.no";
    }
    if (flag === "EU") {
        return  "https://www.mytrendyphone.eu";
    }
    if (flag === "DE") {
        return  "https://www.meintrendyhandy.de";
    }
    if (flag === "NL") {
        return  "https://www.mytrendyphone.nl";
    }
    if (flag === "UK") {
        return  "https://www.mytrendyphone.co.uk";
    }
    if (flag === "FR") {
        return  "https://www.mobile24.fr";
    }
    if (flag === "FI") {
        return  "https://www.mytrendyphone.fi";
    }
    if (flag === "IT") {
        return  "https://www.mytrendyphone.it";
    }
    if (flag === "AT") {
        return  "https://www.mytrendyphone.at";
    }
    if (flag === "PT") {
        return  "https://www.mytrendyphone.pt";
    }
    if (flag === "PL") {
        return  "https://www.mytrendyphone.pl";
    }
    if (flag === "BE-FR") {
        return  "https://fr.mytrendyphone.be";
    }
    if (flag === "BE-NL") {
        return  "https://mytrendyphone.be";
    }
}

app.post('/submit', async (req, res) => {
    let countrySelect=req.body.domen;
    let domen=getCountryDOmen(countrySelect);
    console.log(domen);
    console.log(countrySelect);
    let row=await req.body.text_box;

    let hrefArray = row.match(/href="(.*?)"/g).map(match => match.replace(/href="/,'').replace(/"/g,''));

    for (let value of hrefArray) {
        let doRedirect = true;
        let domenAndLink = true;
        let originalLink = value


        if ((originalLink.substring(0,2)) === '/s') {
            // console.log("bing;");
            domenAndLink = false;

            value = domen+value;
            // console.log(value);
        }
        console.log(value);
        let final_url = "";
        try {

            const response = await axios.get(value, {
                maxRedirects: 0,
                validateStatus: status => status < 400
            });

            if (response.status === 301) {
                // console.log(value);
                final_url = response.headers.location;
                console.log(final_url);

            } else {
                doRedirect=false;
            }
           // row = row.replace(value2, final_url);
        } catch (err) {
            console.log(err);
        }
        if (doRedirect && final_url !== "") {
            // let replace_with = "";
            if (domenAndLink) {

                row = row.replaceAll( originalLink,final_url );
                  // console.log(row);
            } else {
                // console.log("only link");

                // final_url=domen+final_url;
                // console.log(final_url);
                // console.log(value);
                row = row.replaceAll( originalLink, final_url);
                // console.log(row);
            }
        }
    }

})
app.listen(3000, function() {

});

