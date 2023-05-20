## Breve documentación técnica del proyecto
### En la vista principal (index):
#### Cuando se hace un GET al index:
* Se hace una llamada a [la API](https://github.com/paezdavid/calles-py-api) que contiene todos los datos sobre las denuncias.

#### Cuando se carga todo el index:
* Se popula el mapa con las ubicaciones de cada denuncia.

### En la vista del formulario:
#### Cuando se hace un GET:
* Se renderiza el formulario. Es todo estático.
* Dentro de esa vista hay un input oculto donde se van a almacenar las coordenadas del mapa.
* Antes de enviar el formulario:
  * El usuario está obligado a elegir una posición en el mapa. Al hacerlo, las coordenadas de esa posición se adjuntan a un campo de texto oculto en el formulario (con vanilla JS).
  * Por supuesto, todo esto llega al servidor al enviar el formulario.

### En el [formRouter.js](https://github.com/paezdavid/calles-py/blob/14f7bc1291dda74b54b02099fecead1414d6d3a1/routes/formRouter.js):
* Se inicializa el storage de supabase
* Se inicializa el memoryStorage de Multer que va a manejar los archivos del formulario.
	* Dentro de esta variable, se realiza una validación para permitir solo archivos PNG, JPEG y JPG
	* De momento, en caso de error, la app nunca deja de cargar (hay que ponerle un timeout y/o un error handler)


### Cuando se hace el POST:
* Se chequea el mimetype del archivo adjuntado
* Se sanitizan los datos de los campos de texto
* Si no hay errores:
	* Se almacena el horario de publicación en una variable.
	* Se cambia el tamaño de la imagen, se fuerza una conversión a JPG, se escribe el output a un Buffer y se guarda en el storage de supabase.
	* Una vez terminado el proceso anterior, se hace una query al storage y, en una variable, se almacena el URL de la imagen que acabó de subirse.		
	* Se almacenan las coordenadas que vienen del cliente en un array de dos elementos (lat y lon)
	* Se inicializa y se conecta a la base de datos
	* Se realiza una validación. Si el input del usuario contiene un caracter $, se redirecciona al index, ignorando los datos del form. Los datos, así, no son almacenados (mejorar esto con error handling)
	* Si el input del usuario es limpio y correcto, se inserta todo a la base de datos y se redirecciona al index.
