import { Headline } from "~/component/Headline";
import { Content } from "~/component/Content";
import { getLargeDataObject } from "~/utils/getLargeDataObject";
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
  // by setting the property's `enumerable` attribute to false
  Object.defineProperty(data, "content", { enumerable: false });

  return data;
}

function Index() {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-4 max-w-prose mx-auto">
        <Headline />
        <Content>
          <p>This content was passed to the component as a child.</p>
        </Content>
      </div>
    </div>
  );
}

export { meta, loader };
export default Index;
