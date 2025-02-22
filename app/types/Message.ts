export type Message = {
  ok?: boolean
  update?: object
  command?: object
  signal?: Signal
  message?: string
  payload?: {
    onlineDevices?: string[] // initial client data
    token?: string // authentication signal message
  }
  id: string
}

export enum Signal {
  DEVICE_CONNECTED = "DEVICE_CONNECTED",
  DEVICE_DISCONNECTED = "DEVICE_DISCONNECTED",
  USER_CONNECTED = "USER_CONNECTED",
  USER_DISCONNECTED = "USER_DISCONNECTED",
  DEVICE_STATE_UPDATED = "DEVICE_STATE_UPDATED",
  USER_INITIAL_DATA = "USER_INITIAL_DATA",
  RELOAD = "RELOAD",
  AUTHENTICATE_CLIENT = "AUTHENTICATE_CLIENT",
}
