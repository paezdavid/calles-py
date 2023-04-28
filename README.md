# CallesPy
## Proyecto de geolocalización de calles en mal estado en el Paraguay.

CallesPy es un proyecto que apunta a ser fuente de visibilización y denuncia del mal estado de las calles del país.
El usuario puede adjuntar una imagen y una ubicación, así como algún comentario adicional de aquello que esté mostrando.
Pueden mostrar baches, pérdidas de agua, basurales o veredas en mal estado.

Este proyecto aún es un trabajo en progreso.

Creado con Express, Tailwind CSS, MongoDB, Supabase, Leafletjs.

### [Cómo funciona la app (docs)](https://github.com/paezdavid/calles-py/blob/5209f784bbc745fc948492d3dea7df2bfba81be5/DOCS.md)

### Probar en un servidor local con un mock database

Se debe tener instalado MongoDB localmente.

- ```git clone https://github.com/paezdavid/calles-py.git```
- ```cd calles-py```
- ```git switch development```
- Inicializar el servidor local de MongoDB
- ```mongoimport --collection=data --db=calles_py --file=baches.json```
- ```npm install```
- Ejecutar ```node app.js```
- Ir a ```http://localhost:8000```

De momento, la rama development no contiene imágenes ni en el formulario ni en la página principal.

![front](https://user-images.githubusercontent.com/69438782/224445903-07257907-04c5-425a-b15a-47a763038b4a.png)

### TO DO:
* Mejorar algunos aspectos de error handling.
* Integrar con un bot de Twitter
* Realizar reportes gráficos de datos históricos
* Deploy
