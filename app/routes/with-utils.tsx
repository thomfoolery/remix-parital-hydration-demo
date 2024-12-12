import { Headline } from "~/component/Headline";
import { ContentDecorated } from "~/component/ContentDecorated";
import { getLargeDataObject } from "~/utils/getLargeDataObject";
import { hideDataLoaderPropertyFromClient } from "~/utils/remix";
import type { MetaFunction } from "@remix-run/node";

const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

function loader() {
  const data = {
    headline: "Hello World!",
    content: getLargeDataObject(),
  };

  // prevent `content` from being serialized and sent to the client
  // by setting the property's `enumerale` attribute to false
  hideDataLoaderPropertyFromClient(data, "content");

  return data;
}

function Index() {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-4 max-w-prose mx-auto">
        <Headline />
        <ContentDecorated>
          <p>This content was passed to the component as a child.</p>
        </ContentDecorated>
      </div>
    </div>
  );
}

export { meta, loader };
export default Index;
