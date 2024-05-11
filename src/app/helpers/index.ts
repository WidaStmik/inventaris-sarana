import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export const replaceRoute = (url: string, params: Params) => {
  let route = url;
  Object.keys(params).forEach((key) => {
    route = route.replace(String(params[key]), `[${key}]`);
  });

  return route;
};
