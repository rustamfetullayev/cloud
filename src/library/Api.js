import { API_ROUTES } from "@config";
import { serialize } from "@library";

export class Api {
  static request = (url, method = "GET", params = {}) => {
    return fetch(
      method === "GET"
        ? `${API_ROUTES[url]}?${serialize(params)}`
        : API_ROUTES[url],
      {
        method,
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: method !== "GET" ? JSON.stringify(params) : null,
      }
    )
      .then((response) => response.json())
      .catch((error) => console.warn(error));
  };

  static get(url, params) {
    return this.request(url, "GET", params);
  }

  static post(url, params) {
    return this.request(url, "POST", params);
  }
}
