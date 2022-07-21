<div align="center">
  <a target="_blank" href="https://nodejs.org/">
    <img title="Node" alt="Node badge" src="https://img.shields.io/badge/Node-v16.14.2-green" />
  </a>
  <a target="_blank" href="https://svelte.dev/">
    <img title="Svelte" alt="Svelte badge" src="https://img.shields.io/badge/Svelte-v3.49.00-orange" />
  </a>
  <a target="_blank" href="https://kit.svelte.dev/">
    <img title="SvelteKit" alt="SvelteKit badge" src="https://img.shields.io/badge/SvelteKit-next-red" />
  </a>
  <a target="_blank" href="https://tailwindcss.com/">
    <img title="TailwindCSS" alt="TailwindCSS badge" src="https://img.shields.io/badge/Tailwind-v3.1.4-blue" />
  </a>
  <a target="_blank" href="https://vitejs.dev/"> 
    <img tittle="Vite" alt="Vite badge" src="https://img.shields.io/badge/Vite-v3.0.0-greenbright">
  </a>
</div>

# Bluestery - Hackathon Julio 2022 - Twilio + Chat secreto

Bluestery es un projecto desarrollado para la Hackathon de [Midudev](https://www.twitch.tv/midudev), julio del 2022. Consiste en crear un chat secreto donde solo la gente que tú quieras pueda hablar usando los servicios de [Twilio Conversations](https://www.twilio.com/messaging/conversations-api)

## Características

- [x] Identificación del usuario con Github o Google
- [x] Crear chats
- [x] Listar todos los usuarios del chat
- [x] El administrador del chat puede añadir un participante al chat
- [x] El administrador del chat puede generar un enlace para acceder al chat
- [x] El administrador del chat puede eliminar a un participante del chat
- [x] Copiar mensajes
- [x] Editar tus mensajes
- [x] Eliminar tus mensajes
- [x] El administrador puede eliminar cualquier mensaje
- [ ] Vaciar el chat
- [x] Eliminar un chat
- [x] Salir del chat
- [x] Listar los chats a los que estás unido
- [ ] Notificaciones

## Desarollo

Clona el repositorio e instala las dependencias

```sh
git clone https://github.com/alessrdrgz/secret-chat
cd secret-chat
npm install
```

Ejecuta el entorno de desarrollo

```sh
npm run dev
```

Por defecto se mostrará la aplicación en la ruta http://localhost:5173

## Scripts disponibles

### _`npm run dev`_

_Ejecuta la aplicación en el modo de desarrollo, los cambios se refrescarán automáticamente en la web_\
_Abrir la dirección http://localhost:5173 para visualizarlo en el navegador_

### _`npm run build`_

_Compilará toda la aplicación con el estándar indicado en la configuración de svelte_

### _`npm run preview`_

_Desplegará localmente la versión compilada por el comando `npm run dev` para previsualizar como sería la versión de producción_

### _`npm run lint`_

_Ejecuta el linter sobre todo el proyecto y muestra los errores, en caso de que hubiera_

### _`npm run format`_

_Ejecuta prettier para formatear todo el código_

## Estructura del proyecto

La estructura de directorios para la aplicación es la siguiente:

| Nombre                  | Descripción                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **src/components**      | Contiene los componentes usados en el proyecto                                                                      |
| **src/routes**          | Contiene las rutas renderizadas en el proyecto                                                                      |
| **src/routes/api**      | Contiene los endpoints de la api del proyecto                                                                       |
| **src/services**        | Contiene ficheros con funciones para llamar a los distintos servicios usados en la aplicación (twilio, supabase...) |
| **src/store**           | Contiene los stores de svelte                                                                                       |
| **src/styles**          | Directorio para los ficheros de estilos                                                                             |
| **src/utils**           | Funciones de utilidad                                                                                               |
| **static**              | Contiene los ficheros servidos de manera estática                                                                   |
| **.eslintrc.cjs**       | Fichero de configuración de ESLint                                                                                  |
| **.prettierrc**         | Fichero de configuración de Prettier                                                                                |
| **tailwind.config.cjs** | Fichero de configuración de tailwind                                                                                |
| **postcss.config.cjs**  | Fichero de configuración de PostCSS                                                                                 |
| **svelte.config.js**    | Fichero de configuración de Svelte                                                                                  |
| **vite.config.js**      | Fichero de configuración de Vite                                                                                    |
