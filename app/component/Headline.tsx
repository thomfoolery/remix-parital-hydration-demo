import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/_index";

function Headline() {
  const { headline } = useLoaderData<typeof loader>();

  return <h1 className="text-2xl font-bold">{headline}</h1>;
}

export { Headline };
