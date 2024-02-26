### 6.2.1

- ensure jsToXliff functions generate valid xliff files [#58](https://github.com/locize/xliff/pull/58)

### 6.2.0

- special handling for sizeRestriction attribute in xliff v2

### 6.1.0

- introduce captureSpacesBetweenElements option

### 6.0.3

- fix when source and target has different keys

### 6.0.2

- do not error on empty groups [#53](https://github.com/locize/xliff/issues/53)

### 6.0.1

- handle empty xliff files [#52](https://github.com/locize/xliff/pull/52)

### 6.0.0

- better group handling support
- support multiple notes

### 5.7.2

- fix if no source but target

### 5.7.1

- a bit friendlier when not having target values

### 5.7.0

- expose noteKeys on createjs and createxliff function

### 5.6.2

- move notes element before the segment element for xliff v2

### 5.6.1

- fix notes handling for xliff v2

### 5.6.0

- try to handle `<x id="INTERPOLATION"`

### 5.5.3

- skip ignorable non-segments

### 5.5.2

- ignore other comments in xliff2js

### 5.5.1

- ignore comments in xliff2js, like in xliff12ToJs

### 5.5.0

- remove detectICU and escape function again

### 5.4.0

- introduce detectICU and escape function

### 5.3.1

- Fix ignoring {indent: false} option on xml generation

### 5.3.0

- Add support for mrk

### 5.2.0

- Add support for cdata sections

### 5.1.0

- Add support for nested `<group>` tags

### 5.0.6

- transpile also esm

### 5.0.5

- fix export for node v14 cjs

### 5.0.4

- fix export for dynamic imports

### 5.0.3

- fix createxliff imports

### 5.0.2

- fix xliff2js option default

### 5.0.1

- ofjs backwards compatability

### 5.0.0

- complete refactoring to make this module universal
- MIGRATION:
    - `require('xliff/xliff2js')` should be replaced with `require('xliff/cjs/xliff2js')`
    - `require('xliff/js2xliff')` should be replaced with `require('xliff/cjs/js2xliff')`
