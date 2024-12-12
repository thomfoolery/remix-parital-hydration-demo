# Remix Partial Hydration Demo

## Problem/Opportunity

In Remix, React components can become expensive to hydrate on the client when their data models become too large. This data can significantly impact page weight and speed when transferring static page content twice, first as SSR (server side rendered) HTML, and again as serialized data objects client data.

We encountered this problem on the Greenfield frontend on Shopify.dev project where our current Admin GraphQL API reference contains over 3000 static navigation items. These 3000+ links are transmitted to the client in the format of HTML, and then again as a Javascript object used to render the component again during client-side hydration.

## Principles

- Patterns are explicit, declarative and outcomes are easy to rationalize about.
- We provide clear guidance on the trade-offs, and heuristics on when to opt out of client side hydration.

## Proposal

We propose 2 patterns for implementing partial hydration when a component is deemed to be too expensive for client-side hydration.

1. Opt out of data loaders sending data to the client
2. Opt out of client-side hydration

The final challenge is preventing the SSR’d component code from being bundled and sent down to the client. Remix provides a few patterns for [splitting up client and server code](https://remix.run/docs/en/main/discussion/server-vs-client#splitting-up-client-and-server-code), but we ran into issues when we tried to conditionally return the appropriate component at runtime.

> Internal server error: Server-only module referenced by client
> './Content.server' imported by 'app/component/Content.tsx'

The [vite-env-only](https://github.com/pcattori/vite-env-only) package provides utilities for isolating server-only and client-only code. This required the usage of a ViteJS plugin to process these directives at built time. This is not ideal, but it simplifies the developer experience.

The `vite-env-only` ViteJS plugin integration:

```tsx
// yarn add -D vite-env-only

import { defineConfig } from "vite";
import { envOnlyMacros } from "vite-env-only";

export default defineConfig({
  plugins: [...envOnlyMacros()],
});
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/thomfoolery/remix-parital-hydration-demo)

### Opt out of data loaders sending data to the client

To remove loader data from the client payload,
modify the loader’s returned object’s enumerable attribute on the ignored property.

Pseuodo-code

```tsx
// routes/my-route.tsx

async function loader() {
  const largeDataObject = await getLargeDataObject();
  const smallDataObject = await getSmallDataObject();

  const data = {
    smallDataObject,
    largeDataObject,
  };

  // prevent `content` from being serialized and sent to the client
  // by setting the property's `enumerable` attribute to false
  Object.defineProperty(data, "largeDataObject", { enumerable: false });

  return data;
}

function MyRoute() {
  const data = useLoaderData<typeof loader>();

  console.log(data.smallDataObject); // defined  on client and server
  console.log(data.largeDataObject); // undefined on the client only

  return {
    /* render layout */
  };
}

export { loader };
export default MyRoute;
```

### Opt out of client-side hydration

To opt out of client side hydration define 2 React components, one for the server and one for the client.

The server component should just return the expected HTML markup without the use of state, event handlers or hooks. We wrap this function in `serverOnly$` to prevent it from being bundled for the client at build time.

The client component should return a `div` with the `suppressHydrationWarning` prop applied and its inner HTML dangerously set to an empty string.

Finally, the component’s module must dynamically export the server component if `import.meta.env.SSR` is true and the client component when it is false.

Pseuodo-code

```tsx
// components/MyComponent/MyComponent.tsx
import { serverOnly$ } from "vite-env-only";

// use dangerouslySetInnerHTML to render an empty div
// and suppress client side hydration warnings
const CLIENT_COMPONENT_MARKUP = (
  <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: "" }} />
);

function MyClientComponent() {
  // return a consistent reference to prevent unnecessary re-renders
  return CLIENT_COMPONENT_MARKUP;
}

// serverOnly$ ensures this code is not bundled for the client at build time
const MyServerComponent = serverOnly$(function MyServerComponent() {
  const largeDataPayload = useDataLoader<LoaderData>();

  // to prevent hydration errors ensure the root element
  // matches what is returned in the client component
  return <div>{/* render expensive component content */}</div>;
});

// render the appropriate component
const MyComponent = import.meta.env.SSR ? MyServerComponent : MyClientComponent;

export { MyComponent };
```

## Remix Utilities for standardizing the implementation of these patterns

We propose providing 2 utility functions for implementing the above patterns.

First, a declarative function that prevents data from being serialized to the client.

```tsx
function hideDataLoaderPropertyFromClient(data: unknown, property: string) {
  Object.defineProperty(data, property, { enumerable: false });
}
```

A component decorator function that ensures client side hydration is avoided.

```tsx
// Component can't return a React.Fragment as it's root
function preventClientSideHydration<Props>(
  Component: React.ComponentType<Props>,
  RootTagName: React.ElementType
) {
  return import.meta.env.SSR
    ? Component
    : () => (
        <RootTagName
          suppressHydrationWarning
          dangerouslySetInnerHTML={INNER_HTML_MARKUP}
        />
      );
}
```

There is a rough edge to this decorator in that the root elements of both the server and client components must match or it will trigger a hydration error. To ensure developers are aware of this detail, a second parameter providing the root element is required.

This detail has the side effect that the decorated component’s root can not be wrapped in a React Fragment.

## Risks, mitigations and sharp edges

Things to be aware of when opting out of client side hydration.

### Eliminating component code from client bundle is not straightforward

We have chosen to use the vite-env-only package because it simplifies code elimination, but it requires a ViteJS plugin and the additional step of wrapping your server component code that if missed results in unnecessary code being sent to the client.

We will continue to experiment with different approaches that do not require external dependencies.

### Matching component root elements

The client and server components must return a root with the same element tag name otherwise a hydration error will be thrown. The use of a React Fragment at the component’s root will also cause a hydration error to be thrown.

### Pattern fragmentation

All UI behaviour and interactivity within unhydrated components must be implemented from outside the React context. This entails implementing event listeners, data binding, and DOM manipulation with plain old Javascript and browser APIs. This can fragment the UI development patterns used across the application. Team members must be keenly aware when they are working on components that have opted out of client side hydration to ensure they don’t use the wrong development patterns.

This is an acceptable trade-off when

- Component’s data requirements impact page performance
- Components are just static content, or behaviours and interactivity are relatively simple
- Component’s future feature scope is constrained, and maintenance in infrequent
