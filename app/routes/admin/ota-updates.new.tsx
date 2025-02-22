import {
  ExclamationTriangleIcon,
  FolderPlusIcon,
} from "@heroicons/react/24/solid"
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node"
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react"
import { FormEvent, useState } from "react"
import Button from "~/components/atoms/Button"
import { getSessionToken } from "~/models/session.server"
import api from "~/utils/core.server"

type ActionData = {
  errors: string[]
}

type LoaderData = {
  sessionToken: string
}

export const loader: LoaderFunction = async ({ request }) =>
  json<LoaderData>({ sessionToken: await getSessionToken(request) })

// export const action: ActionFunction = async ({ request }) => {
//   const form = await request.formData()
//   console.log(
//     "Posting form data to core: ",
//     form,
//     form.entries(),
//     form.values(),
//     form.get("file"),
//     form.get("version")
//   )
// return await api
//   .adminPostFirmware(new FormData(), await getSessionToken(request))
//   .then(res => {
//     console.log("RESPONSE: ", res)
//     return res
//   })
//   .then(data => {
//     console.log("Response DATA: ", data)
//     return redirect("/admin/ota-updates")
//   })
//   .catch(err => {
//     console.error("ERROR Response: ", err, err.response)
//     return json<ActionData>(
//       { errors: [err.response?.data?.message, err.message] },
//       err.response?.status
//     )
//   })
// }

const chips = [
  { value: "esp8266", displayName: "ESP8266" },
  {
    value: "esp32",
    displayName: "ESP32",
  },
]

export const AdminOTAUpdatesNew = () => {
  const { sessionToken } = useLoaderData<LoaderData>()
  const navigation = useNavigation()
  // const actionData = useActionData<ActionData>()
  // console.log("ACTION DATA: ", actionData)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Submitting ...")
    const formData = new FormData(e.currentTarget)
    // we can't use the API since it's a server file :)
    fetch(`${ENV.CORE_URL}/api/v1/admin/firmware-updates`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        // ContentType: "multipart/form-data", // https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#:~:text=Warning%3A%20When,the%20request%20body.
      },
      body: formData,
    })
      .then(async res => {
        console.log("RES: ", res)
        const body = await res.json()
        if (res.status !== 201 || !res.ok)
          return setError(
            `Error uploading firmware to core(${res.status} ${res.statusText}): ${body.message}`
          )
        window.location.href = "/admin/ota-updates"
      })
      .catch(err => {
        console.error("ERROR: ", err)
        setError(`Error uploading firmware to core: ${err.toString()}`)
      })
  }

  return (
    <div className="admin-page">
      <h2 className="page-title">Upoad New Firmware Update(OTA)</h2>
      <form
        onSubmit={handleSubmit}
        method="post"
        encType="multipart/form-data"
        className="form max-w-xs mx-auto bg-white rounded-lg shadow-lg px-2 py-3 sm:p-4 flex flex-col items-stretch justify-center gap-4"
      >
        {error && (
          <p className="error bg-rose-100 border border-rose-400 shadow-md shadow-rose-200 rounded-md py-1 px-2 text-rose-600">
            {error}
          </p>
        )}
        <label className="label">
          Chip:
          <select className="input mt-2" name="chip">
            {chips.map(ch => (
              <option value={ch.value} key={ch.value}>
                {ch.displayName}
              </option>
            ))}
          </select>
        </label>
        <label className="label">
          Device Type: (Optional)
          <input
            type="text"
            name="deviceType"
            placeholder="KEY, Leave empty for all device types"
          />
          <span className="text-xs">
            supported device types will be added and you can choose
          </span>
        </label>
        <label className="label">
          Firmware Version:
          <input
            type="text"
            name="version"
            placeholder="1.0.19.beta"
            required
          />
        </label>
        <label className="label">
          Manufacturer ID: (Optional)
          <input
            type="text"
            name="manufacturerId"
            placeholder="Leave empty for global manufacturer scope"
          />
        </label>
        <label className="label">
          Building ID: (Optional)
          <input
            type="text"
            name="buildingId"
            placeholder="Leave empty for global building scope"
          />
        </label>
        <label className="label">
          File:
          <input type="file" name="file" required />
        </label>
        <Button
          className={`${
            error ? "bg-rose-500 shadow-rose-300" : "bg-primary shadow-blue-300"
          } py-1 px-3  flex items-center justify-center gap-2.5`}
          disabled={navigation.state === "submitting"}
        >
          {error ? (
            <ExclamationTriangleIcon className="w-5 h-5" />
          ) : (
            <FolderPlusIcon className="w-5 h-5" />
          )}
          {error ? "Error Uploading Firmware" : "Upload Firmware"}
          {error && <ExclamationTriangleIcon className="w-5 h-5" />}
        </Button>
      </form>
    </div>
  )
}

export default AdminOTAUpdatesNew
