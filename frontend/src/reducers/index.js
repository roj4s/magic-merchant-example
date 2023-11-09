import { v4 as uuidv4 } from "uuid";

export const LOCALSTORAGE_KEY = "magic-demo-store-state";

export const getValidObjectId = () => {
  return uuidv4().split("-").join("").slice(0, 12);
};
