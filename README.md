# CallesPy
## Proyecto de geolocalización de calles en mal estado en el Paraguay.

CallesPy es un proyecto que apunta a ser fuente de visibilización y denuncia del mal estado de las calles del país.
El usuario puede adjuntar una imagen y una ubicación de un bache en específico, así como algún comentario adicional del mismo.

Este proyecto aún es un trabajo en progreso.

Creado con Express, Tailwind CSS, MongoDB, Supabase, Leafletjs.

### [Cómo funciona la app (docs)](https://github.com/paezdavid/calles-py/blob/main/DOCS.md)

### Probar en un servidor local con un mock database.

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

![ui](https://github.com/paezdavid/calles-py/assets/69438782/8295d3eb-d6c7-40f5-8752-fdf991a27894)


### TO DO:
* Mejorar algunos aspectos de error handling.
* Deploy.
