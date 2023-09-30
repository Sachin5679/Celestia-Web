import axios from "axios";
import { serverUrl } from "../config";
import { clearTokenFromLocalStorage } from "../utils";
import { Attendant } from "../types/Data";

let key: string | null = null;

let client = createApi();

function createApi() {
  const client = axios.create({
    baseURL: serverUrl,
    timeout: 32000,
    headers: {
      Authorization: key,
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use(
    function (config) {
      return config;
    },
    function (err) {
      console.error(err);
      return Promise.reject(err);
    }
  );

  client.interceptors.response.use(
    function (res) {
      if (res.data.invalidToken) {
        clearTokenFromLocalStorage();
        clearAdminKey();
        location.reload();
      }
      return res;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  return client;
}

export function setAdminKey(token: string) {
  key = token;
  client.defaults.headers["Authorization"] = key;
}

export function clearAdminKey() {
  key = null;
  client.defaults.headers["Authorization"] = null;
}

const admin = {
  client: client,

  async verify(key: string) {
    const response = await client.get(`${serverUrl}/auth`);

    if (response.data.authorised) return true;

    return false;
  },

  async getTicketById(ticketId: string) {
    const response = await client.get<Attendant>(
      `${serverUrl}/ticket/${ticketId}`
    );

    return response.data;
  },

  async newTicket(mobile: number, name: string) {
    const response = await client.post<Attendant>(`${serverUrl}/ticket`, {
      mobile,
      name,
    });

    return response.data;
  },
};

export default admin;
