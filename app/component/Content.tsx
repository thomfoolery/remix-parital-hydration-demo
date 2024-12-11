import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/_index";

// use dangerouslySetInnerHTML to render an empty div
// and suppress client side hydration warnings
const CLIENT_SIDE_COMPONENT_MARKUP = (
  <div dangerouslySetInnerHTML={{ __html: "" }} suppressHydrationWarning />
);

function ContentClientComponent() {
  // return a consistent reference to prevent unnecessary re-renders
  return CLIENT_SIDE_COMPONENT_MARKUP;
}

function ContentServerComponent({ children }: { children?: React.ReactNode }) {
  const { content } = useLoaderData<typeof loader>();

  // to prevent hydration errors ensure the root element
  // matches what is returned in the client component
  return (
    <div className="flex flex-col gap-4">
      {children}
      {content.map((paragraph, index) => (
        <p key={index} className="text max-w-prose">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

// render the appropriate component
const Content = import.meta.env.SSR
  ? ContentServerComponent
  : ContentClientComponent;

export { Content };
