import { json, type LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { requireUser } from "~/models/session.server"
import { type User } from "~/types/User"

type LoaderData = {
  user: User
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request)
  return json<LoaderData>({ user })
}

export const AdminInvoices = () => {
  const { user } = useLoaderData<LoaderData>() // <typeof loader>
  return <div>Network</div>
}

export default AdminInvoices
