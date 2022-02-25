'use strict';

const Elements = {
    error: 'error',
    keyInput: 'key',
    apiData: 'api-data',
    stressSuccess: 'str-success',
    stressFail: 'str-fail',
    stressTime: 'str-time',
    stressDone: 'str-done',
    stressRequests: 'str-requests',
    metrics: 'metrics',
}

class MetricsHTML {
    html;

    constructor(data) {
        const list = data.logs;

        let htmlList = ``;

        for (let item of list) {
            htmlList += `
                <div class="item">
                    <div>
                        <div>Request</div>
                        <ul>
                            <li>Url: ${item.request.url}</li>
                            <li>Method: ${item.request.method}</li>
                            <li>Date: ${item.request.date}</li>
                        </ul>
                    </div>
                       
                    <div>
                        <div>Response</div>
                        <ul>
                            <li>Status code: ${item.response.statusCode}</li>
                            <li>Date: ${item.response.date}</li>
                        </ul>
                    </div>
                    
                    <div>
                        <div>Latency</div>
                        <ul>
                            <li>${item.latency}ms</li>
                        </ul>
                    </div>
                </div>
            `;
        }

        this.html = htmlList;
    }

}

class FirstAPIDataHTML {
    html;

    constructor(data) {
        this.html = `
                <div>
                    <div>Server Ip Adress Info</div>
                    <ul>
                        <li>City: ${data.city}</li>
                        <li>Country: ${data.country}</li>
                        <li>Continent: ${data.continent}</li>
                        <li>Ip: ${data.ip}</li>
                    </ul>
                </div>`;
    }
}

class SecondAPIDataHTML {
    html;

    constructor(data) {
        this.html = `
                <div>
                    <div>Random number</div>
                    <ul>
                        <li>Number: ${data.number}</li>
                    </ul>
                </div>`;
    }
}

class ThirdAPIDataHTML {
    html;

    constructor(data) {
        const list = data;

        let htmlList = ``;

        for (let item of list) {
            htmlList += `
                    <a href="${item.url}" target="_blank" class="item">
                    <div>
                        <img src="${item.thumbnail}" class="img">
                        <div>${item.title}</div>
                        <div>Subscribers: ${item.subredditSub}</div>
                    </div>
                    </a>
                `;
        }

        this.html = `
                <div>
                    <div>Top subreddits from Reddit search</div>
                    <div class="list">
                        ${htmlList}
                    </div>
                </div>`;
    }
}

function onGetData() {
    clearInnerHTML(Elements.error);
    clearInnerHTML(Elements.apiData);

    const key = document.getElementById(Elements.keyInput).value;

    getBackendData(key)
        .then(data => {
            const firstData = data.firstData;
            const secondData = data.secondData;
            const thirdData = data.thirdData;

            const firstHtmlData = new FirstAPIDataHTML(firstData);
            const secondHtmlData = new SecondAPIDataHTML(secondData);
            const thirdHtmlData = new ThirdAPIDataHTML(thirdData);

            injectHTML(Elements.apiData, firstHtmlData.html, true);
            injectHTML(Elements.apiData, secondHtmlData.html, true);
            injectHTML(Elements.apiData, thirdHtmlData.html, true);
        })
        .catch(error => {
            injectHTML(Elements.error, error);
        })
}

function onGetMetrics() {
    clearInnerHTML(Elements.error);
    clearInnerHTML(Elements.apiData);

    const key = document.getElementById(Elements.keyInput).value;

    getMetricsData(key)
        .then(data => {
            const metricsHtml = new MetricsHTML(data);

            injectHTML(Elements.metrics, metricsHtml.html);
        })
        .catch(error => {
            injectHTML(Elements.error, error);
        })
}

const batches = 50;
const requests = 10;

function stressTest() {
    const key = document.getElementById(Elements.keyInput).value;

    let successRequests = 0;
    let failRequests = 0;
    let requestsSend = 0;

    const startTime = new Date().getTime();
    let currentTime = startTime;

    let timerRunning = true;

    async function refresher() {
        while (timerRunning) {
            currentTime = new Date().getTime();

            injectHTML(Elements.stressTime, splitTime(currentTime - startTime));
            injectHTML(Elements.stressSuccess, successRequests);
            injectHTML(Elements.stressFail, failRequests);
            injectHTML(Elements.stressRequests, requestsSend);

            await sleep(25);
        }
    }

    new Promise(refresher);

    const totalRequests = requests * batches;

    for (let i = 0; i < batches; i++) {
        if (window.Worker) {
            const worker = new Worker('worker.js');

            worker.postMessage([key, requests]);

            worker.onmessage = e => {
                if (e.data === 0) {
                    requestsSend++;
                    return;
                }

                if (e.data === true) {
                    successRequests++;
                } else {
                    failRequests++;
                }

                if (successRequests + failRequests === totalRequests) {
                    timerRunning = false;
                    injectHTML(Elements.stressDone, 'Done');
                }
            }
        } else {
            console.log('The browser does not support workers');
        }

    }
}

async function getBackendData(key) {
    const url = `http://localhost:8080/data?key=${key}`;

    const response = await fetch(url);
    return response.json();
}

async function getMetricsData(key) {
    const url = `http://localhost:8080/metrics?key=${key}`;

    const response = await fetch(url);
    return response.json();
}

function splitTime(time) {
    return `${Math.floor(time / 1000)}s ${time % 1000}ms`;
}

function injectHTML(id, html, append = false) {
    const element = document.getElementById(id);

    if (append) {
        element.innerHTML += html;
        return;
    }

    element.innerHTML = html;
}

function clearInnerHTML(id) {
    const element = document.getElementById(id);
    element.innerHTML = '';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}