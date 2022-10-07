import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { QueryParams, useQueryParams } from "~/utils/params";


interface LoaderData {
  redirect: boolean
}

export const loader: LoaderFunction = async ({ request }) => {
  const redirect = QueryParams.getBoolean(request, 'redirect') ?? false

  return json<LoaderData>({ redirect })
}

export default function Another() {
  const params = useQueryParams()
  const data = useLoaderData<LoaderData>()
  
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Woo you're on another page and the redirect boolean is <code>{data.redirect ? 'true' : 'false'}</code></h1>
      <hr />
      <Link to='/'>Go back to index page with no query params</Link>
      <hr />
      <Link to={params.freshUrl({ page: 5 }, '/')}>Go back to index page, and start on page 5</Link>
    </div>
  );
}
