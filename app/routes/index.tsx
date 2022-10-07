import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { QueryParams, useQueryParams } from "~/utils/params";


interface LoaderData {
  page: number
  prevPage: number | null
  nextPage: number | null
  toggle: boolean
  list: number[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const page = QueryParams.getNumber(request, 'page') ?? 1
  const toggle = QueryParams.getBoolean(request, 'toggle') ?? false
  const list = QueryParams.getArrayOfNumbers(request, 'list') ?? []

  const nextPage = page === 9 ? null : page + 1
  const prevPage = page === 1 ? null : page - 1

  return json<LoaderData>({ page, prevPage, nextPage, toggle, list })
}

export default function Index() {
  const params = useQueryParams()
  const data = useLoaderData<LoaderData>()
  
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <hr />
      <p>Page is {data.page}</p>
      <p>Toggle is {data.toggle ? 'ON' : 'OFF'}</p>
      <p>List is: {data.list.join(', ')}</p>
      <hr />
      <h3>Loader data</h3>
      <pre>{JSON.stringify(data,null,2)}</pre>
      <hr />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center' }}>
        <Link to={params.mergeUrl({ page: data.prevPage })} style={{ cursor: data.prevPage === null ? 'default' : 'pointer', opacity: data.prevPage === null ? 0.5 : 1, pointerEvents: data.prevPage === null ? 'none' : 'initial' }}>Previous page</Link>
        <p>Current page: {data.page}</p>
        <Link to={params.mergeUrl({ page: data.nextPage })} style={{ cursor: data.nextPage === null ? 'default' : 'pointer', opacity: data.nextPage === null ? 0.5 : 1, pointerEvents: data.nextPage === null ? 'none' : 'initial' }}>Next page</Link>
      </div>
      <hr />
      <Link to={params.mergeUrl({ toggle: !data.toggle })}>Toggle {data.toggle ? 'OFF' : 'ON'}</Link>
      <hr />
      <Link to={params.mergeUrl({ list: [...data.list, (Math.random() * 1000).toFixed(0) ]})}>Add to list</Link>
      <hr />
      <Link to={params.mergeUrl({ page: undefined })}>Reset page only</Link>
      <hr />
      <Link to={params.resetUrl()}>Clear all parameters (util method)</Link>
      <hr />
      <Link to={params.freshUrl({ redirect: true }, '/another')}>Redirect to another page with query params</Link>
    </div>
  );
}
