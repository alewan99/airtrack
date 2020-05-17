import {Injectable} from '@angular/core';

@Injectable()
export class CsvUtil {

    public loadData(csvData)
    {
        const lines =  csvData.split('\n');
        const header = lines[0].trim().split(',');
        const dataItems = [];
        lines.splice(0, 1);
        lines.forEach(line => {
            if (line.trim() !== '')
            {
                const data = line.trim().split(',');
                const dataItem = {};
                for (let i = 0; i < header.length; i++)
                {
                    dataItem[header[i]] = data[i];
                }
                dataItems.push(dataItem);
            }
        });
        return dataItems;
    }

}
