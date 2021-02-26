"use strict";
const getJSONfxData = async (dateStart = '2018-01-01', dateEnd = '2021-02-24', symbols = ['USD', 'MXN']) => {
    (function (console) {
        console.save = function (data, filename) {
            if (!data) {
                console.error('Console.save: No data');
                return;
            }
            if (!filename)
                filename = 'console.json';
            if (typeof data === "object") {
                data = JSON.stringify(data, undefined, 4);
            }
            var blob = new Blob([data], { type: 'text/json' }), e = document.createEvent('MouseEvents'), a = document.createElement('a');
            a.download = filename;
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        };
        console.log("file saved");
    })(console);
    const fetchData = async () => {
        const data = await fetch(`https://api.exchangeratesapi.io/history?start_at=${dateStart}&end_at=${dateEnd}&symbols=USD,MXN`).then(response => response.json());
        return data;
    };
    const data = await fetchData();
    const base = data["base"];
    const tableName = 'rates';
    // console.log(Object.entries(data[tableName]));
    const dateData = Object.entries(data[tableName]);
    const dataSetData = dateData.map(dateEntryArray => {
        let tableRow = { date: dateEntryArray[0], base };
        let fxDataRow = dateEntryArray[1];
        for (let key in fxDataRow) {
            tableRow[key] = fxDataRow[key];
        }
        return tableRow;
    });
    const dataSet = { [tableName]: dataSetData };
    let filename = 'Fx_rates.json';
    console.log(dataSet);
    console.save(dataSet, filename);
};
function generateJSONfile() {
    let dateStart = document.getElementById('start')?.value || '2018-01-01';
    let dateEnd = document.getElementById('start')?.value || new Date().toISOString().split('T')[0];
    let symbols = ['USD', 'MXN'];
    getJSONfxData(dateStart, dateEnd, symbols);
}
(() => (window.generateJSONfile = generateJSONfile))();
// window.generateJSONfile();
