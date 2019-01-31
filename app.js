const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const config = require('./config.json');
const run  = () => {
    try {
        const index = config.file.indexOf('.txt');
        if (index < 0) {
            throw new Error('Requires .txt as input');
        }
        let file = fs.readFileSync(config.file, 'utf8');
        const rows = file.split('\r\n'); // standard for utf8
        const records = [];
        rows.forEach(row => {
            const features = row.split(' ');
            const instance = {};
            features.forEach((feature, index) => {
                instance[config.header[index].id] = feature;
            });
            records.push(instance);
        });
        config.header.push({id: 'r10', title: 'fp-nps'})
        records.forEach(record => {
            record['r10'] = Number(record['r9']) < 2 ? 0 : 1;
        });
        const csvWriter = createCsvWriter({
            path: `${__dirname}\\${config.file.slice(0, index)}.csv`,
            header: config.header
        });
        csvWriter.writeRecords(records);
    } catch (err) { console.error(err); }
}
run();