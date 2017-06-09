[![travis](https://img.shields.io/travis/locize/xliff.svg)](https://travis-ci.org/locize/xliff) [![npm](https://img.shields.io/npm/v/xliff.svg)](https://npmjs.org/package/xliff)

## Download

The source is available for download from
[GitHub](https://github.com/locize/xliff/archive/master.zip).
Alternatively, you can install using npm:

```sh
npm install --save xliff
```

You can then `require()` xliff as normal:

```js
const xliff = require('xliff');
```

Or you can direclty `require()` its functions:

```js
const xliff2js = require('xliff/xliff2js');
```

## Usage

##### XLIFF 2.0

```js

const xliff = `<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" version="2.0" srcLang="en-US" trgLang="de-CH">
  <file id="namespace1">
    <unit id="key1">
      <segment>
        <source>Hello</source>
        <target>Hallo</target>
      </segment>
    </unit>
    <unit id="key2">
      <segment>
        <source>An application to manipulate and process XLIFF documents</source>
        <target>Eine Applikation um XLIFF Dokumente zu manipulieren und verarbeiten</target>
      </segment>
    </unit>
    <unit id="key.nested">
      <segment>
        <source>XLIFF Data Manager</source>
        <target>XLIFF Daten Manager</target>
      </segment>
    </unit>
  </file>
</xliff>`;

const js = {
  "resources": {
    "namespace1": {
      "key1": {
        "source": "Hello",
        "target": "Hallo"
      },
      "key2": {
        "source": "An application to manipulate and process XLIFF documents",
        "target": "Eine Applikation um XLIFF Dokumente zu manipulieren und verarbeiten"
      },
      "key.nested": {
        "source": "XLIFF Data Manager",
        "target": "XLIFF Daten Manager"
      }
    }
  },
  "sourceLanguage": "en-US",
  "targetLanguage": "de-CH"
};

const xliff2js = require('xliff/xliff2js');
xliff2js(xliff, (err, res) => {
  // res is like js
});

const js2xliff = require('xliff/js2xliff');
js2xliff(js, (err, res) => {
  // res is like xliff
});

const targetOfjs = require('xliff/targetOfjs');
targetOfjs(js, (err, res) => {
  // res is:
  // {
  //   "key1": "Hallo",
  //   "key2": "Eine Applikation um XLIFF Dokumente zu manipulieren und verarbeiten",
  //   "key.nested": "XLIFF Daten Manager"
  // }
});

const sourceOfjs = require('xliff/sourceOfjs');
sourceOfjs(js, (err, res) => {
  // res is:
  // {
  //   "key1": "Hello",
  //   "key2": "An application to manipulate and process XLIFF documents",
  //   "key.nested": "XLIFF Data Manager"
  // }
});

const createjs = require('xliff/createjs');
createjs(
  js.sourceLanguage,
  js.targetLanguage,
  {
    "key1": "Hello",
    "key2": "An application to manipulate and process XLIFF documents",
    "key.nested": "XLIFF Data Manager"
  },
  {
    "key1": "Hallo",
    "key2": "Eine Applikation um XLIFF Dokumente zu manipulieren und verarbeiten",
    "key.nested": "XLIFF Daten Manager"
  },
  'namespace1',
  (err, res) => {
  // res is like js
});

const createxliff = require('xliff/createxliff');
createxliff(
  js.sourceLanguage,
  js.targetLanguage,
  {
    "key1": "Hello",
    "key2": "An application to manipulate and process XLIFF documents",
    "key.nested": "XLIFF Data Manager"
  },
  {
    "key1": "Hallo",
    "key2": "Eine Applikation um XLIFF Dokumente zu manipulieren und verarbeiten",
    "key.nested": "XLIFF Daten Manager"
  },
  'namespace1',
  (err, res) => {
  // res is like xliff
});
```

##### XLIFF 1.2

```js

  const xliff = `<xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:tc:xliff:document:1.2 http://docs.oasis-open.org/xliff/v1.2/os/xliff-core-1.2-strict.xsd" version="1.2" srcLang="en-US" trgLang="de-CH">
    <file original="namespace1">
      <body>
        <trans-unit id="key1">
          <source>Hello</source>
          <target>Hallo</target>
        </trans-unit>
        <trans-unit id="key2">
          <source>An application to manipulate and process XLIFF documents</source>
          <target>Eine Applikation um XLIFF Dokumente zu manipulieren und verarbeiten</target>
        </trans-unit>
        <trans-unit id="key.nested">
          <source>XLIFF Data Manager</source>
          <target>XLIFF Daten Manager</target>
        </trans-unit>
      </body>
    </file>
  </xliff>`

  const js = {
    "resources": {
      "namespace1": {
        "key1": {
          "source": "Hello",
          "target": "Hallo"
        },
        "key2": {
          "source": "An application to manipulate and process XLIFF documents",
          "target": "Eine Applikation um XLIFF Dokumente zu manipulieren und verarbeiten"
        },
        "key.nested": {
          "source": "XLIFF Data Manager",
          "target": "XLIFF Daten Manager"
        }
      }
    },
    "sourceLanguage": "en-US",
    "targetLanguage": "de-CH"
  }

  const xliff12ToJs = require('xliff/xliff12ToJs');
  xliff12ToJs(xliff, (err, res) => {
    // res is like js
  });

  const jsToXliff12 = require('xliff/jsToXliff12');
  jsToXliff12(js, (err, res) => {
    // res is like xliff
  });

  const createxliff12 = require('xliff/createxliff12');
  createxliff12(
    js.sourceLanguage,
    js.targetLanguage,
    {
      "key1": "Hello",
      "key2": "An application to manipulate and process XLIFF documents",
      "key.nested": "XLIFF Data Manager"
    },
    {
      "key1": "Hallo",
      "key2": "Eine Applikation um XLIFF Dokumente zu manipulieren und verarbeiten",
      "key.nested": "XLIFF Daten Manager"
    },
    'namespace1',
    (err, res) => {
    // res is like xliff
  });


```
