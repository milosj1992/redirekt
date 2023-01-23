const axios = require('axios');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index');
});
const getCountryDOmen = (flag) => {
    if (flag === "ES") {
        return "https://www.mytrendyphone.es";
    }
    if (flag === "DK") {
        return "https://www.mytrendyphone.dk";
    }
    if (flag === "SE") {
        return "https://www.mytrendyphone.se";
    }
    if (flag === "NO") {
        return "https://www.mytrendyphone.no";
    }
    if (flag === "EU") {
        return "https://www.mytrendyphone.eu";
    }
    if (flag === "DE") {
        return "https://www.meintrendyhandy.de";
    }
    if (flag === "NL") {
        return "https://www.mytrendyphone.nl";
    }
    if (flag === "UK") {
        return "https://www.mytrendyphone.co.uk";
    }
    if (flag === "FR") {
        return "https://www.mobile24.fr";
    }
    if (flag === "FI") {
        return "https://www.mytrendyphone.fi";
    }
    if (flag === "IT") {
        return "https://www.mytrendyphone.it";
    }
    if (flag === "AT") {
        return "https://www.mytrendyphone.at";
    }
    if (flag === "PT") {
        return "https://www.mytrendyphone.pt";
    }
    if (flag === "PL") {
        return "https://www.mytrendyphone.pl";
    }
    if (flag === "BE-FR") {
        return "https://fr.mytrendyphone.be";
    }
    if (flag === "BE-NL") {
        return "https://mytrendyphone.be";
    }
}

function getLocation(href) {
    var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
        href: href,
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        search: match[6],
        hash: match[7]
    }
}

app.post('/submit', async (req, res) => {
    let countrySelect = req.body.domen;
    let domen = getCountryDOmen(countrySelect);
    let row = await req.body.text_box;

    let hrefArray = row.match(/href="(.*?)"/g).map(match => match.replace(/href="/, '').replace(/"/g, ''));

    for (let value of hrefArray) {
        let doRedirect = true;
        let domenAndLink = true;
        let originalLink = value
        let pathName=getLocation(value);
        if ((originalLink.substring(0, 2)) === '/s') {
            domenAndLink = false;
            value = domen + value;
        }
        else{
            value=domen+pathName.pathname;
        }
        let final_url = "";
        try {
            const response = await axios.get(value, {
                maxRedirects: 0,
                validateStatus: status => status < 400
            });
            if (response.status === 301) {
                final_url = response.headers.location;
            } else {
                doRedirect = false;
            }
        } catch (err) {
            console.log(err);
        }
        if (doRedirect && final_url !== "") {
            row = row.replaceAll(originalLink, final_url);
        }
    }
    res.send(row);
})
app.listen(3000, function () {

});

