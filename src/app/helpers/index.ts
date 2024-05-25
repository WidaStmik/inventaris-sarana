import { storage } from "@/services/firebase";
import { ref, getBytes } from "firebase/storage";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export const replaceRoute = (url: string, params: Params) => {
  let route = url;
  Object.keys(params).forEach((key) => {
    route = route.replace(String(params[key]), `[${key}]`);
  });

  return route;
};

// get bucket path from firebase url
export const getBucketPath = (url: string) => {
  const path = url.split("/").slice(3).join("/");
  return path
    .replace("v0/b/inventaris-sarana.appspot.com/o/", "")
    .replace(/\?alt=media.*/g, "")
    .replace(/\%2F/g, "/")
    .replace(/\%20/g, " ");
};

export const getBufferFromPath = async (path: string) => {
  const fileRef = ref(storage, path);
  const buffer = await getBytes(fileRef);

  return buffer;
};
