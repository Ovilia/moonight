import { DataProcessor } from './audio/dataProcessor';

const dataProcessor = new DataProcessor();
dataProcessor.fromFile('./assets/tale.mp3')
    .then(arr => console.log(arr));
