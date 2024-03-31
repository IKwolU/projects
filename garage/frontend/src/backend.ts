import { Client } from "./api-client";
// 77.222.56.111
const client = new Client("https://api.beebeep.ru", {
  fetch: async (url, options) => {
    try {
      const result = await fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${(window as any).token}`,
          "X-API-key": localStorage.getItem("X-API-key")
            ? localStorage.getItem("X-API-key")!
            : "",
        },
      });

      return result;
    } catch (error) {
      console.log("Uh oh!");
      throw error;
    }
  },
});

export { client };
