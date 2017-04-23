# WEB TEMPLATE ANGULAR #

## Descripción

El template se encuentra realizado en Angular 1.5.8, esta configurado para el uso de rutas con routeConfig de angular, tiene las librerias necesarias para poder generar con bootstrap un sitio.

Esta tambien configurado en el gulp para usar less, y tiene un watch para modo de desarrollo.


## Install 

Se deben correr los siguientes comandos:

```
$ npm install

```

Instala las dependencias de node según lo descrito en el archivo package.json


```
$ bower install

```

Instala todos las librerias js que se necesitan.


##Ejecución

Para la ejecución se debe correr el siguiente comando:

```
$ npm run local 

```

Este comando es para desarrollo y --watch nos ayuda a que se levante en modo controlado para poder mostrar los cambios.


```
$ npm start

```

Levanta el servidor http

```
$npm run generate:cert
$npm run startHttps

```

Para levantarlo en https, genera el primero un certificado con openssl.

Y el segundo lo levanta con https.



Para poder generar los cambios en caliente del less

```
$ npm run local -- --watch
```


La tombola se encuentra realizada en Angular, Jquery.