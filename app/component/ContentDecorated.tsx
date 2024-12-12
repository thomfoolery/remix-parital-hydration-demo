import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/_index";
import { preventClientSideHydration } from "~/utils/remix";

interface ContentDecoratedProps {
  children?: React.ReactNode;
}

function ContentDecoratedComponent({ children }: ContentDecoratedProps) {
  const { content } = useLoaderData<typeof loader>();

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

const ContentDecorated = preventClientSideHydration<ContentDecoratedProps>(
  ContentDecoratedComponent,
  "div"
);

export { ContentDecorated };
