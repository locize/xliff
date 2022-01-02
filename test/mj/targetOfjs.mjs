import fs from 'fs'
import path from 'path'
import xliff2js from '../../lib/xliff2js.js'
import targetOfjs from '../../lib/targetOfjs.js'

const start = async function() {
  const file = path.resolve('test/fixtures/example_groups.xliff');
  const xliff = fs.readFileSync(file).toString();
  const js = await xliff2js(xliff);
  const target = targetOfjs(js);
  console.log(target);
}

// Call start
start();
