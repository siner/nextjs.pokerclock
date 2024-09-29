import { precacheAndRoute } from "workbox-precaching";
import { setCacheNameDetails } from "workbox-core";

setCacheNameDetails({
  prefix: "relojpoker",
  suffix: "v1",
});

precacheAndRoute(self.__WB_MANIFEST);
