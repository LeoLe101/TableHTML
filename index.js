"use strict";

const DEBUG = true;
const reportID = 'reportData';
const remoteUrl = 'https://bhamilton1000.github.io/SampleData/Web-Question-001/UnitedStatesWithCounties.json';
let table = document.createElement('table');
let rowCount = 0;
let dataFromURL;

// HTTP Request GET
let getData = function (url, callback) {

    if (DEBUG)
        console.log(`> Getting data from ${url}...`);

    let httpReq = new XMLHttpRequest();
    httpReq.open('GET', url);
    httpReq.responseType = 'json';
    httpReq.addEventListener('progress', updateProgress);
    httpReq.setRequestHeader('Content-Type', 'text/plain');
    httpReq.onreadystatechange = function () {
        if (this.readyState === httpReq.DONE && this.status === 200) {
            if (httpReq.response) {
                callback(null, this.response);
            } else {
                callback(null, this.responseText); // Suffering a bug with XMLHttp Request not knowing what JSON response type is.
            }
        }
        else {
            callback(`readyState = ${this.readyState}, status = ${this.status}`);
        }
    }
    httpReq.send();
}

function updateProgress(e) {
    if (DEBUG)
        console.log(`> Progress -- ${e.type} @ ${e.loaded} bytes`);
}

// This function only called once when the page is loaded
function OnInit() {
    if (DEBUG)
        console.log('> Running OnInit...');

    getData(remoteUrl,
        function (err, data) {
            if (err) {
                if (DEBUG)
                    console.log(`> Extracting data: ${err}`);
            } else {
                dataFromURL = data;
            }
        }
    );
    if (DEBUG)
        console.log('> Extraction Completed!');
}

// Generate HTML report
function createHtmlReport() {
    // If the table already existed, remove all previous data and reset count
    if (rowCount > 0) {
        table.innerHTML = '';
        rowCount = 0;
    }

    // Check if data from URL got extracted or not
    if (!dataFromURL) {
        console.error('Unable to extract required information from URL provided! Please try again!');
        alert('Unable to extract required information from URL! Please Try Again.');
        return null;
    }

    let containerdiv = document.getElementById(reportID);
    let tableBody = document.createElement('tbody');

    table.style.width = '80%';
    table.style.marginLeft = '100px';
    table.setAttribute('border', '3');

    let talbeHeadRow = document.createElement('tr');
    let tableHState = document.createElement('th');
    let tableHCounty = document.createElement('th');
    let tableHPopluation = document.createElement('th');

    tableHState.style.width = '200px';
    tableHCounty.style.width = '200px';
    tableHPopluation.style.width = '200px';
    
    tableHState.innerText = 'States';
    tableHCounty.innerText = '# of Counties';
    tableHPopluation.innerText = 'Population';

    talbeHeadRow.appendChild(tableHState);
    talbeHeadRow.appendChild(tableHCounty);
    talbeHeadRow.appendChild(tableHPopluation);

    tableBody.appendChild(talbeHeadRow);


    // Parse data
    dataFromURL.forEach(stateInfo => {
        let row = document.createElement('tr');
        let stateCell = document.createElement('td');
        let countyCell = document.createElement('td');
        let popCell = document.createElement('td');

        const counties = stateInfo.Counties;
        const populationCount = counties.reduce((result, { Population }) => result + Population, 0);

        stateCell.innerHTML = stateInfo.StateName + ' (' + stateInfo.StateAbbr + ')';
        countyCell.innerHTML = counties.length;
        popCell.innerHTML = populationCount;

        row.appendChild(stateCell);
        row.appendChild(countyCell);
        row.appendChild(popCell);

        tableBody.appendChild(row);

        if (DEBUG) {
            console.log("Info Element", stateInfo);
            console.log("State Population", populationCount);
        }

    });

    table.appendChild(tableBody);
    containerdiv.appendChild(table);
    return containerdiv.innerHTML;
}

// Sorting function for HTML Table
function sortReportState() {
    console.log('> Report By State');

}

document.getElementById('generateButton').addEventListener('click', createHtmlReport);
