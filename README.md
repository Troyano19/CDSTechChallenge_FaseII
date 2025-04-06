# CDSTechChallenge-FaseII

> [!IMPORTANT]
> Crear el archivo `.env` en la carpeta raíz con las variables de entorno necesarias para la ejecución del proyecto.

## Índice

1. [Introducción](#introducción)
2. [¿Por qué este proyecto?](#¿por-qué-este-proyecto?)
3. [Configuración inicial](#configuración-inicial)
4. [Ejecución del proyecto](#ejecución-del-proyecto)
5. [Miembros del proyecto](#miembros-del-proyecto)
6. [Licencia](#licencia)

## Introducción

Se trata de una página web en la que los turistas accederán a todo tipo de servicios desde un solo sitio. En base a los días que el turista visite la ciudad se le proporcionará un listado de movilidad, alojamiento y festividades en esas fechas.

La movilidad viene dada por la empresa de vuelo Ryanair y las empresas de transporte terrestre Alsa y Renfe.

La página tendrá un chat Bot con información de los CSV compartidos en el repositorio de la Fase II de HP, que permitirá a los turistas preguntarles cualquier cosa referente a GreenLake Village.

Además, una ciudad 3D estará disponible para que cualquier turista pueda observar desde su dispositivo una vista previa de lo que verá durante su turismo.

## ¿Por qué este proyecto?

Una página web que permita a los turistas buscar todos los vuelos, hoteles y actividades desde una misma aplicación es algo que no muchas empresas de viajes y gestión de residencia tienen, ya sea Airbnb o Booking.

Es un buen tipo de proyecto para realizar en un plazo limitado de un mes y que sea completamente funcional, es decir, tener un Backend estable y que los usuarios pudieran registrarse, haciendo que les salgan recomendaciones de forma dinámica.

La página web ayudará a centrar todos los viajes y negocios, además de permitir configurar a los administradores de las empresas su información en la web.
Los datos CSV proporcionados para realizar el proyecto nos han servidor para cargar comentarios de turistas y agregar nombres de los establecimientos a los negocios recomendados en la página.

## Configuración inicial

1. Clona este repositorio:
   ```bash
   git clone https://github.com/Troyano19/CDSTechChallenge_FaseII.git
   cd CDSTechChallenge_FaseII
   ```

2. Instala todas las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Crea un archivo `.env` dentro de la carpeta raíz del proyecto basándote en `.env.example`.
   - Ajusta las variables según tu entorno local.

## Ejecución del proyecto

- Para iniciar en modo desarrollo:
  ```bash
  npm run dev
  ```

- Para iniciar en modo producción:
  ```
  npm start
  ```

## Miembros del proyecto

<table>
   <tr>
      <td align="center"><a href="https://joseleelportfolio.vercel.app/"><img src="https://github.com/Joseleelsuper.png" width="100px;" alt="Profile Picture"/><br /><sub><b>José Gallardo</b></sub></a></td>
      <td align="center"><a href="https://github.com/troyano19"><img src="https://github.com/troyano19.png" width="100px;" alt="Profile Picture"/><br /><sub><b>Javier Troyano</b></sub></a></td>
   </tr>
</table>

## Licencia

Este proyecto está bajo la licencia GPL-3.0. Para más detalles, consulta el archivo [LICENSE](LICENSE).