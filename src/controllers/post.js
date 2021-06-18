import { Api } from "@library";

export const post = async (params) => {
  return await Api.post("post", params);
};
