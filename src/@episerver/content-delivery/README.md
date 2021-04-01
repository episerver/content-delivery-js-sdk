# Episerver Content Delivery JavaScript SDK - Content Loader and Resolver

SDK for loading and resolving content from an Episerver application running the [Content Delivery API](https://world.episerver.com/documentation/developer-guides/content-delivery-api/). The SDK is written in TypeScript and includes types.

Please visit [Episerver World](https://world.episerver.com/) for full documentation of the APIs. 

## Installing

Using npm:

```bash
$ npm install @episerver/content-delivery
````

using yarn:

```bash
$ yarn install @episerver/content-delivery
````

## Examples

### Content Loader

Given we have imported the content loader and instantiated it:

```js
import { ContentLoader } from '@episerver/content-delivery';

const contentLoader = new ContentLoader();
```

The constructor takes a [`ContentDeliveryConfig`](#contentdeliveryconfig-schema) object.

Loading content by an identifier:

```js
contentLoader.getContent('38963a25-b6ec-493b-aca4-f4fbce1aed4d')
  .then((content) => {
    // Content was successfully loaded
  })
  .catch((contentLoaderError) => {
    console.error('Content not loaded', contentLoaderError.errorMessage);
  });
```

The function takes an optional [`ContentRequest`](#contentrequest-schema) object where we can specify which language branch to load with the `branch` parameter:

```js
contentLoader.getContent('38963a25-b6ec-493b-aca4-f4fbce1aed4d', { branch: 'en' })
  .then((content) => {
    // Content was successfully loaded
  });
```

We can specify which properties should be included in the response with the `select` parameter:

```js
contentLoader.getContent('38963a25-b6ec-493b-aca4-f4fbce1aed4d', { select: ['heading', 'body'] })
  .then((content) => {
    // Content was successfully loaded
  });
```

We can specify which properties should be expanded in the response with the `expand` parameter:

```js
contentLoader.getContent('38963a25-b6ec-493b-aca4-f4fbce1aed4d', { expand: ['teasers'] })
  .then((content) => {
    // Content was successfully loaded
  });
```

Reference properties (content areas and content references) only includes the reference to the content by default. By expanding these properties the content of the referenced content is also included in the response.

Loading children by a parent identifier:

```js
contentLoader.getChildren('38963a25-b6ec-493b-aca4-f4fbce1aed4d')
  .then((children) => {
    // Children was successfully loaded
  });
```

The function takes an optional [`ContentCollectionRequest`](#contentcollectionrequest-schema) object. In addition to the `ContentRequest` parameters we can also limit the number of content items to load:

```js
contentLoader.getChildren('38963a25-b6ec-493b-aca4-f4fbce1aed4d', { top: 10 })
  .then((collection) => {
    // Children was successfully loaded
    var children = collection.items;
    var continuationToken = collection.continuationToken;
  });
```

For loading the next set of content items, use the continuation token:

```js
contentLoader.getChildren('38963a25-b6ec-493b-aca4-f4fbce1aed4d', { continuationToken: continuationToken })
  .then((collection) => {
    // Children was successfully loaded
    // When we reached the last set the continuation token won't be present.
    var continuationToken = collection.continuationToken;
  });
```


Loading ancestors by an identifier:

```js
contentLoader.getAncestors('38963a25-b6ec-493b-aca4-f4fbce1aed4d')
  .then((ancestors) => {
    // Ancestors was successfully loaded
  });
```

The function takes an optional [`ContentRequest`](#contentrequest-schema) object.

#### `ContentRequest` schema

```js
{
  branch: 'en',
  select: [''],
  expand: [''],
}
```

#### `ContentCollectionRequest` schema

```js
{
  branch: 'en',
  select: [''],
  expand: [''],
  top: 0,
  continuationToken: '',
}
```

#### `ContentLoaderError` schema

```js
{
  data: {},
  statusCode: 404,
  errorMessage: '',
}
```

### Content Resolver

Given we have imported the content resolver and instantiated it:

```js
import { ContentResolver } from '@episerver/content-delivery';

const contentResolver = new ContentResolver();
```

The constructor takes a [`ContentDeliveryConfig`](#contentdeliveryconfig-schema) object.

Resolving content by an URL:

```js
contentResolver.resolveContent('https://site.com/en/page1/page2/doesnt-exist/', false)
  .then((resolvedContent) => {
    // Content was resolved. Note that the promise is fulfilled
    // even though the content was not found. The return object contains a
    // status property you can check.
    var content = resolvedContent.content;
  })
  .catch((contentResolverError) => {
    // Promise is only rejected if there was a service error.
    console.error('Content not resolved', contentResolverError.errorMessage);
  });
```

The second parameter, `matchExact`, defines whether the URL should be a partial or exact match. The remaining path of the URL, if a partial match, is available in `remainingPath` in the returned object, see [`ResolvedContent`](#resolvedcontent-schema). The function also takes an optional [`ResolveContentRequest`](#resolvecontentrequest-schema) object.

#### `ResolveContentRequest` schema

```js
{
  select: [''],
  expand: [''],
}
```

#### `ResolvedContent` schema

```js
{
  content: {},
  branch: 'en',
  status: 'UNKNOWN|RESOLVED|NOTFOUND|UNAUTHORIZED|ACCESSDENIED',
  mode: 'DEFAULT|PREVIEW|EDIT',
  remainingPath: 'doesnt-exist/',
  siteId: '6ed7799f-efd8-4421-8eb3-c95bfbf7281d',
  startPageId: 'ff2e86ae-27a9-4417-b503-ecb9c2fdd63b',
}
```

#### `ContentResolverError` schema

```js
{
  errorMessage: '',
}
```

## Configuration

#### `ContentDeliveryConfig` schema

```js
{
  apiUrl: 'https://site.com/api/episerver/v2.0',
  getAccessToken: function (path) { 
    // Return access token.
  },
  selectAllProperties: true,
  expandAllProperties: false,
}
```

### Change the default configuration

The default configuration is combined with the configuration you pass in to the constructors of the content loader and resolver classes.

```js
import { defaultConfig } from '@episerver/content-delivery';

defaultConfig.apiUrl = 'https://site.com/api/episerver/v2.0';
defaultConfig.getAccessToken = () => authService.getAccessToken();
defaultConfig.selectAllProperties = true;
defaultConfig.expandAllProperties = true;
```