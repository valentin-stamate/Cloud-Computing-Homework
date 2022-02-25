async function getBackendData(key) {
    const url = `http://localhost:8080/data?key=${key}`;

    const response = await fetch(url);
    return response.json();
}

onmessage = async function(e) {

    for (let i = 0; i < e.data[1]; i++) {
        postMessage(0);

        getBackendData(e.data[0]).then(data => {
            postMessage(true);
        }).catch(error => {
            postMessage(false);
        });
    }

}

