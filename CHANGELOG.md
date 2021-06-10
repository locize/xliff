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
