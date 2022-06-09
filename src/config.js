import { createContext } from "react";

const config = {
  endpoint: 'http://localhost:5005/api',
  lang: 'en',
  theme: 'light',
}

const ConfigContext = createContext(config);

export { ConfigContext };
export default config;