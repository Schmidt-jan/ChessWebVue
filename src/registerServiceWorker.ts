/* eslint-disable no-console */

import { register } from "register-service-worker";
import {app} from "@/main";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
          "App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB"
      );
    },
    registered() {
      console.log("Service worker has been registered.");
    },
    cached() {
      app.config.globalProperties.inetAvailable = false;
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      app.config.globalProperties.inetAvailable = true;
      console.log("New content is downloading.");
    },
    updated() {
      app.config.globalProperties.inetAvailable = true;
      console.log("New content is available; please refresh.");
    },
    offline() {
      app.config.globalProperties.inetAvailable = false;
      console.log(
          "No internet connection found. App is running in offline mode."
      );
      console.log(this.offline)
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    },
  });
}
