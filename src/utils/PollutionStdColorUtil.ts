import * as chroma from 'chroma-js';

export class PollutionStdColorUtil {

    pollutionItems = [
        {code: 'so2', label: 'SO2'},
        {code: 'no2', label: 'NO2'},
        {code: 'co', label: 'CO'},
        {code: 'o3', label: 'O3'},
        {code: 'pm1', label: 'PM1'},
        {code: 'pm10', label: 'PM10'},
        {code: 'pm2_5', label: 'PM2.5'},
        {code: 'voc', label: 'TVOCs'},
        {code: 'temp', label: 'Temp'},
        ];

    colorSize = 50;
    stdColors = {
        so2: [
            {value: 0, color: '#C0C0C0'},
            {value: 50, color: '#00FF00'},
            {value: 150, color: '#ffff00'},
            {value: 475, color: '#FF9900'},
            {value: 800, color: '#990000'},
            {value: 1600, color: '#CC00FF'},
            {value: 2100, color: '#FF0000'}
        ],
        pm10: [
            {value: 0, color: '#C0C0C0'},
            {value: 50, color: '#00FF00'},
            {value: 150, color: '#ffff00'},
            {value: 250, color: '#FF9900'},
            {value: 350, color: '#990000'},
            {value: 420, color: '#CC00FF'},
            {value: 500, color: '#FF0000'}
        ],
        pm2_5: [
            {value: 0, color: '#C0C0C0'},
            {value: 35, color: '#00FF00'},
            {value: 75, color: '#ffff00'},
            {value: 115, color: '#FF9900'},
            {value: 150, color: '#990000'},
            {value: 250, color: '#CC00FF'},
            {value: 350, color: '#FF0000'}
        ],
        co: [
            {value: 0, color: '#C0C0C0'},
            {value: 2, color: '#00FF00'},
            {value: 4, color: '#ffff00'},
            {value: 14, color: '#FF9900'},
            {value: 24, color: '#990000'},
            {value: 36, color: '#CC00FF'},
            {value: 48, color: '#FF0000'}
        ],
        no2: [
            {value: 0, color: '#C0C0C0'},
            {value: 40, color: '#00FF00'},
            {value: 80, color: '#ffff00'},
            {value: 180, color: '#FF9900'},
            {value: 280, color: '#990000'},
            {value: 565, color: '#CC00FF'},
            {value: 750, color: '#FF0000'}
        ],
        o3: [
            {value: 0, color: '#C0C0C0'},
            {value: 100, color: '#00FF00'},
            {value: 160, color: '#ffff00'},
            {value: 215, color: '#FF9900'},
            {value: 265, color: '#990000'},
            {value: 800, color: '#CC00FF'},
            {value: 1000, color: '#FF0000'}
        ],
        voc: [
            {value: 0, color: '#C0C0C0'},
            {value: 0.01, color: '#00FF00'},
            {value: 0.1, color: '#ffff00'},
            {value: 0.2, color: '#FF9900'},
            {value: 0.4, color: '#990000'},
            {value: 0.7, color: '#CC00FF'},
            {value: 1.0, color: '#FF0000'}
        ]
    };

    public getPollutions() {
        return this.pollutionItems;
    }

    public getPollutionColor(pollution, val) {
        const colorValues = this.stdColors[pollution];
        for (let i = 1; i < colorValues.length; i++) {
            const start = colorValues[i - 1];
            const stop = colorValues[i];
            if (start.value <= val && stop.value >= val) {
                const legendColor = chroma.scale([start.color, stop.color]).mode('lch').colors(this.colorSize);
                const interval = (stop.value - start.value) / this.colorSize;
                for (let j = 0; j < legendColor.length; j++) {
                    if ((start.value + interval * j) >= val) { return legendColor[j]; }
                    if (j === (legendColor.length - 1)) {
                        return legendColor[legendColor.length - 1];
                    }
                }
            }
        }
    }
    public setPollutionStd(pollution, std) {
        this.stdColors[pollution] = std;
    }

    public getPollutionStd(pollution) {
        return this.stdColors[pollution];
    }

}
