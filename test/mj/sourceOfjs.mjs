import fs from 'fs'
import path from 'path'
import xliff2js from '../../lib/xliff2js.js'
import sourceOfjs from '../../lib/sourceOfjs.js'

const start = async function() {
  const file = path.resolve('test/fixtures/example_groups.xliff');
  const xliff = fs.readFileSync(file).toString();
  const js = await xliff2js(xliff);
  const source = sourceOfjs(js);
  console.log(source);
}

// Call start
start();
