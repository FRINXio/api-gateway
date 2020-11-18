# api-gateway

In the project directory, run: 
#### `docker build -t api-gateway .` <br>
Creates docker container with installation of api-gateway. <br>

## Startup <br>
In the project directory, run: 

#### `docker run -p 5000:5000 api-gateway` <br>

## Start with https
#### `docker run -v /home/user/cert:/api-gateway/certificates -e API_GATEWAY_HTTPS=true -p 5000:5000 api-gateway` <br> <br>

## Env variables list:

* API_GATEWAY_HOST
* API_GATEWAY_HTTPS - use https for gateway, default: "false",
* DASHBOARD_HOST
* UNIFLOW_UI_HOST 
* UNIFLOW_API_HOST
* UNICONFIG_UI_HOST
* UNICONFIG_API_HOST
* UNICONFIG_UI_PROTOCOL - default: "http",


![alt text](https://iili.io/dSWs4V.png)
