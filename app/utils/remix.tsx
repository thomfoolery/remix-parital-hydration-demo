// create a consistent reference to prevent unnecessary re-renders
const INNER_HTML_MARKUP = { __html: "" };

function hideDataLoaderPropertyFromClient(data: unknown, property: string) {
  // prevent `content` from being serialized and sent to the client
  // by setting the property's `enumerable` attribute to false
  Object.defineProperty(data, property, { enumerable: false });
}

function preventClientSideHydration<Props>(
  Component: React.ComponentType<Props>,
  RootTagName: React.ElementType
) {
  return import.meta.env.SSR
    ? Component
    : () => (
        // to prevent hydration errors ensure the root element
        // matches what is returned in the server component
        <RootTagName
          suppressHydrationWarning
          dangerouslySetInnerHTML={INNER_HTML_MARKUP}
        />
      );
}

export { hideDataLoaderPropertyFromClient, preventClientSideHydration };
