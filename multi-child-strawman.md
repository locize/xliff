Strawman proposal: 

WIP - DO NOT MERGE

This is a proposal for adding support for "inline" child elements that can occur in `source` and `target` values.

I have already built a proof-of-concept implementation for this that adds support for one type of inline element (XLIFF 1.2 `<ph></ph>` elements). However, because this involves making a (backwards-compatible) change to the library's object model, I wanted to open up a conversation about the object model first before writing a complete implementation.

The added file "multi-child-strawman.md" is the text proposal. I added it as a file so that we can add comments and discussion on a per-line basis. All the other code changes are the work for the proof-of-concept implementation.

# Proposal: Adding support for XLIFF inline elements

This proposal is divided into three sections:

1. Changes to the `resources.namespace.key.{source,target}` properties
2. General structure for representing XLIFF inline elements
3. Specifics on which elements are supported and how they are mapped between JS and XLIFF (and vice-versa)


## Proposal: `source`/`target` value type changes
### Background

Currently this library's object model for XLIFF documents defines `source` and `target` values as strings:

```
{
  "resources": {
    "namespace1": {
      "key1": {
        "source": "Hello",
        "target": "Hallo"
      },
    }
  },
  "sourceLanguage": "en-US",
  "targetLanguage": "de-CH"
}
```

In addition to text, the XLIFF specifications define multiple child tags that can be included in `<source>`/`<target>` tags:

- [XLIFF 1.2 spec](http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html#Specs_Elem_Inline)
- [XLIFF 2.0 spec](http://docs.oasis-open.org/xliff/xliff-core/v2.0/xliff-core-v2.0.html#inlineCodes)

In general these "inline" tags exist to specify special elements within translation strings. For example, in XLIFF 1.2 the `<ph>..</ph>` element is used to define a "placeholder" such as for a variable value that is substituted at runtime, e.g.:

- String: "Hello there, {fullName}"
- XLIFF 1.2: `<source>Hello there, <ph>{fullName}</ph></source>`

### Proposed implementation
I propose that the `source` and `target` properties be changed from only allowing string values to allowing either string _or_ array values:
```
// Simple value:
"source": "Hello there"
// Value with multiple child elements:
"source": ["Hello ", "there"]
```
(Note that in the example above there's no benefit from splitting the string into two strings wrapped in an array -- it is just shown to avoid making the example overly-complex.)

When the `source` and `target` values are Array instances, they will contain either strings or objects representing XLIFF inline elements. The structure for those objects is described in the next section. 


## Proposal: Object structure for non-text elements
### Background
XLIFF supports several types of inline elements in `<source>`/`<target>` values (see section 3 of the proposal for an enumeration of them). Each of those element types, in turn, accepts multiple attributes (including attributes not defined in the XLIFF spec). Some of them also accept child text and/or other elements as well.

For example, XLIFF 1.2 defines these inline elements (among others):
- `<g></g>`:
  - Required attributes: `id`
  - Optional attributes: `ctype`, `clone`, `xid`, `equiv-text`, non-XLIFF attributes
  - Contents: Text; Zero, one or more other inline elements
- `<x/>`:
  - Required attributes: `id`
  - Optional attributes: `ctype`, `clone`, `xid`, `equiv-text`, non-XLIFF attributes
  - Contents: Empty
- `<bx/>`:
  - Required attributes: `id`
  - Optional attributes: `rid`, `ctype`, `clone`, `xid`, `equiv-text`, non-XLIFF attributes
  - Contents: Empty
- `<ex/>`:
  - Required attributes: `id`
  - Optional attributes: `rid`, `xid`, `equiv-text`, non-XLIFF attributes
  - Contents: Empty
- `<ph></ph>`:
  - Required attributes: `id`
  - Optional attributes: `ctype`, `crc`, `assoc`, `xid`, `equiv-text`, and non-XLIFF attributes
  - Contents: Code data; Zero, one or more `<sub>` elements

While there are some consistencies, there is also some variation among the elements. Consequently, the object structure for inline elements needs to be flexible enough to support various attributes and child elements.

### Proposed implementation
Rather than establishing a strict definition for the object structure of each element type, I propose using a flexible object structure that supports any element type. The benefit of this approach is the flexibility and (hopefully) being able to handle unexpected or non-conforming data. The downside is that there is no guarantee that a given object structure actually represents a valid XLIFF structure.

Here are two options for object structure. I don't have a strong preference for either one.

Option 1 feels more "modern" (I guess it is inspired by the style of [React Immutability Helpers' `update` command object](https://reactjs.org/docs/update.html#update)). This is the approach I've used in my proof-of-concept implementation.

However, Option 2 feels simpler (though more "rigidly structured") and it will likely be easier to work with in code.

#### Option 1
The proposed structure is:
```
{
  [<Element Type>]: {
    "id": "<Value>",
    "contents": "<Element Contents>",
    "<Other Property 1>": "<Other Property 1 Value>",
    ...
    "<Other Property N>": "<Other Property N Value>"
  }
}
```
The parts are:
- `<Element Type>`: A string (used as a property name) indicating the element type. The set of possible types will be defined as constants
- `id` property: The value of the XLIFF element's `id` attribute
- `contents` property: The contents of the XLIFF element, if supported. This value can be a string or array and is treated like the `source`/`target` values.
- All other properties: Map directly to attributes of the XLIFF element tag

Here's a real-world example of the proposed structure:
```
{
  "ph": {
    "id": "dataType",
    "contents": "{dataType}",
    "ctype": "x-python-brace-param"
  }
}
```
This maps to the following XLIFF inline element structure:
```
<ph id="dataType" ctype="x-python-brace-param">{dataType}</ph>
```

#### Option 2
The proposed structure is:
```
{
  "type": "<Element Type>",
  "id": "<Value>",
  "contents": "<Element Contents>",
  "attributes": {
    "<Attribute 1>": "<Attribute 1 Value>",
    ...,
    "<Attribute N>": "<Attribute N Value>"
  }
}
```
The parts are:
- `<Element Type>`: A string (used as a property name) indicating the element type. The set of possible types will be defined as constants
- `id` property: The value of the XLIFF element's `id` attribute
- `contents` property: The contents of the XLIFF element, if supported. This value can be a string or array and is treated like the `source`/`target` values.
- `attributes` property: Array of objects, each of which contains one key (the attribute name) and one value (a string, the attribute value). These correspond to attributes of the XLIFF element tag (other than `id`).

Here's a real-world example of the proposed structure:
```
{
  "type": "ph",
  "id": "dataType",
  "contents": "{dataType}",
  "attributes": { "ctype": "x-python-brace-param" }
}
```
This maps to the following XLIFF inline element structure:
```
<ph id="dataType" ctype="x-python-brace-param">{dataType}</ph>
```

The next section describes the set of inline elements that will be available.

## Proposal: Supported element types
### Background

Unfortunately XLIFF 1.2 and XLIFF 2.0 differ in which specific tags are used to represent different types of inline elements:

#### XLIFF 2.0 inline elements

- Standalone code (`<ph/>`) - Corresponds to a single position in the content (e.g. the `<br/>` tag in HTML)
- Well-formed spanning code (`<pc></pc>`) - A code that wraps a section of content using a start and end marker (e.g. the `<b></b>` tag in HTML), that is properly nested (i.e. all spans are completely contained by other spans that wrap them)
- Start marker of spanning code (`<sc/>`) - Start marker of a span that isn't properly nested or crosses segment boundaries ("orphan")
- End marker of spanning code (`<ec/>`) - End marker of a span that isn't properly nested or crosses segment boundaries

#### XLIFF 1.2 inline elements

- Generic group placeholder (`<g></g>`) - Generic, well-formed spanning code.
- Generic standalone placeholder (`<x/>`) - Generic isolated item in the content
- Begin paired placeholder (`<bx/>`) - Start marker of a span that isn't properly nested
- End paired placeholder (`<ex/>`) - End marker of a span that isn't properly nested
- Placeholder (`<ph></ph>`) - Native well-formed spanning code
- Begin paired tag (`<bpt></bpt>`) - Start marker of a paired sequence of native codes
- End paired tag (`<ept></ept>`) - End marker of a paired sequence of native codes
- Isolated tag (`<it></it>`) - Start or end marker of a paired sequence of native codes where the companion marker isn't in the translation unit
- Sub-flow (`<sub></sub>`) - Sub-flow text inside a native code sequence (e.g. the `title` element of an HTML `<a>` tag) 


Although the two versions define different elements, the underlying semantics of many of the elements are the same and they can be mapped to each other:

| Use Case | Representation (1.2) | Representation (2.0) |
| -------- | -------------------- | -------------------- |
| **Generic** |
| Standalone code | `<x/>` | `<ph/>` | 
| Well-formed spanning code | `<g></g>` | `<pc></pc>` |
| Start marker of spanning code | `<bx/>` | `<sc/>` |
| End marker of spanning code | `<ex/>` | `<ec/>` |
| Orphan start marker of spanning code | n/a | `<sc isolated="yes"/>` |
| Orphan end marker of spanning code | n/a | `<ec isolated="yes"/>` |
| **Native code** (same as generic for 2.0) | |  |
| Well-formed spanning code | `<ph></ph>` | `<pc></pc>` |
| Start marker of spanning code | `<bpt></bpt>` | `<sc/>` |
| End marker of spanning code | `<ept></ept>` | `<ec/>` |
| Orphan start marker of spanning code | `<it></it>` | `<sc isolated="yes"/>` |
| Orphan end marker of spanning code | `<it></it>` | `<ec isolated="yes"/>` |
| Sub-flow text | `<sub></sub>` | (separate `<unit></unit>`) |

### Proposed implementation
Because of the differences between the two versions' representations, I see a couple of options for how to structure the data model to represent them:

#### Option 1: Common subset
This option is to support a subset of the elements within the data model. Only that subset of elements will be able to be created (JS to XLIFF). When going from XLIFF to JS, elements that aren't defined in the data model will be converted to the closest type, so their semantics are maintained but it won't be possible to do perfect round-tripping XLIFF -> JS -> XLIFF.

Defined element types:
| Element type | Representation (1.2) | Representation (2.0) |
| ------------ | -------------------- | -------------------- |
| Standalone | `<x/>` | `<ph/>` | 
| Span | `<g></g>` | `<pc></pc>` |
| SpanStart | `<bx/>` | `<sc/>` |
| SpanEnd | `<ex/>` | `<ec/>` |

Orphan markers will not be supported at this time.

Mapping rules:
JS -> XLIFF 1.2
  Elements are written as generic elements -- the library will not generate "native code" elements

JS -> XLIFF 2.0
  Elements are written as their corresponding types

XLIFF 1.2 -> JS
  Elements are read and native elements are converted to their generic counterparts

XLIFF 2.0 -> JS
  Elements are read as their corresponding types


#### Option 2: Superset  
This option is to support a larger set of elements in the data model. Only the subset that is supported by the version in question will be used when reading XLIFF to JS. For JS to XLIFF, elements that aren't strictly defined in the XLIFF version will be mapped to corresponding supported elements.

Defined element types:
| Element type | Representation (1.2) | Representation (2.0) |
| ------------ | -------------------- | -------------------- |
| Standalone | `<x/>` | `<ph/>` | 
| GenericSpan | `<g></g>` | `<pc></pc>` |
| GenericSpanStart | `<bx/>` | `<sc/>` |
| GenericSpanEnd | `<ex/>` | `<ec/>` |
| Span | `<ph></ph>` | `<pc></pc>` |
| SpanStart | `<bpt></bpt>` | `<sc/>` |
| SpanEnd | `<ept></ept>` | `<ec/>` |

Orphan markers will not be supported at this time.

Mapping rules:
JS -> XLIFF 1.2
  Elements are written as their corresponding types

JS -> XLIFF 2.0
  Elements are written as their corresponding types. Native/generic types are mapped to the same XLIFF element type

XLIFF 1.2 -> JS
  Elements are read as their corresponding types

XLIFF 2.0 -> JS
  Elements are read as their corresponding (non-generic) types

#### Option 3: Two data models
This option is to fork the data models and have one set of elements for XLIFF 1.2 and another set for XLIFF 2.0. With this option, the JS data model for one XLIFF version would not work for the other XLIFF version.


## Proposal: Helper functions
Because the data model proposed here is notably more complex than the previous one, it will simplify the implementation to have helper functions for creating the different elements that can be part of a `source`/`target` value.
 
In addition, those functions will likely be helpful to users of the library to create `source` and `target` values. Consequently, it seems like a good idea for those functions to be made available as part of the defined API of the library.
 
 
 ## Ideas for future work
 Future work could include:
 - Creating an XLIFF builder class structure (or set of functions) that combines helper functions into a single bundle with state that includes a `toXLIFF()` method for creating the XML string.
 - Creating source/target value parsers that, given an original string, construct the corresponding data structure. (For example, call the parser function with `"Hello there {fullName}"` and it returns the corresponding data model.) This would probably require ongoing work to support additional formats of strings, so it is able to recognize HTML or similar tags, etc.

