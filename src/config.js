import dotenv from "dotenv";
dotenv.config();

const env = process.env;
const conf = {
  apiGatewayHost: env.API_GATEWAY_HOST ?? "api-gateway:5000",
  dashboardHost: env.DASHBOARD_HOST ?? "frinx-dashboard:5001",
  uniflowUiHost: env.UNIFLOW_UI_HOST ?? "uniflow-ui:3000",
  uniflowApiHost: env.UNIFLOW_API_HOST ?? "uniflow-api:3001",
  uniconfigUiHost: env.UNICONFIG_UI_HOST ?? "uniconfig-ui:4000",
  uniconfigApiHost: env.UNICONFIG_API_HOST ?? "uniconfig:8181",
};

export default conf;
