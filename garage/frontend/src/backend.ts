import { Client } from "./api-client";
const client = new Client("http://127.0.0.1:8000/api", {
  // const client = new Client("https://api.beebeep.ru/api", {
  fetch: async (url, options) => {
    try {
      const result = await fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${(window as any).token}`,
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
