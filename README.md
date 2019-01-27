#BOLL UI
User interface for BOLL consortium app.

###Installation Requirements
1. Node JS v8.9.4 or later. Preferrably using [nvm](https://github.com/creationix/nvm)
2. @angular/cli
	```console
	npm install -g @angular/cli
	```

###Bind to BOLL Consortium App
```
cd boll-ui/
npm install
ng build --outputPath ../boll-consortium/src/main/resources/static/ --baseHref /app
```
