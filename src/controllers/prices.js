import { Api } from "@library";

export const prices = async (params) => {
  return await Api.get("prices", params);
};
