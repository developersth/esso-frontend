# Apex

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.1.

## Development server

Run `ng serve` or `ng serve -aot` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


# Youtube
https://www.youtube.com/watch?v=7EdljsAN6hs

# Setup Docker
https://github.com/codemobiles/cm-prepare-dev-tools-full-stack/blob/main/docker-install.md


# Installation
- nodejs lts
- angular cli
- DotNet SDK
- docker
- vscode + extensions
- sql express / edge

## Angular
-------------
# install nodejs
node --version
download nodejs  (lts) from: https://nodejs.org/en/

# uninstall old angular version
npm uninstall -g angular-cli
npm cache clean

# install angular cli
npm install -g @angular/cli
ng version

# new angular project
ng new ngDemo

# run for testing
cd ngDemo
ng serve

# DotNet
--------------
- https://dotnet.microsoft.com/en-us/download
- vscode + extension
- new project 
- run

# Docker SQL Server (Express Edition)
--------------
- docker: https://www.docker.com/
  sql server 
   + mac: https://hub.docker.com/_/microsoft-azure-sql-edge
   + windows: https://hub.docker.com/_/microsoft-mssql-server


https://github.com/codemobiles/cm-prepare-dev-tools-full-stack

"ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=P2UGF#vh" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest