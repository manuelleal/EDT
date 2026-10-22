# Prompt para Claude Code — mejorar la página del taller

Copia todo lo que está debajo de la línea y pégalo en Claude Code, abierto en esta carpeta (pagina-taller).

---

Trabaja en esta carpeta. Aquí está la página web estática de mi taller de IA para docentes (index.html + img/). Mañana la uso con unos 320 profes de la Normal Superior, mayores de 45 años, que traen portátil. Se publicará en GitHub Pages. Quiero que quede LINDA, interactiva y dinámica, sin perder el contenido.

## Reglas
- NO cambies ni quites el contenido pedagógico: las 5 partes, los textos, los prompts copiables, los recuadros "Manos a la obra", los 3 loops, los cuadernos, los 3 retos de Antigravity ni las reglas. Puedes reorganizar la presentación, no el fondo.
- NO toques el objeto `ENLACES` del JavaScript (encuesta y juego ya tienen enlace; los cuadernos se llenan después).
- NO menciones Gems en ninguna parte.
- Sigue siendo un sitio estático: index.html + img/ (puedes separar css/ y js/ si quieres). Nada de frameworks con build (ni React ni Vite). Bootstrap 5.3 se mantiene.
- Español de Colombia, letra grande y legible (público mayor de 45), buen contraste, funciona a 400 px de ancho sin scroll horizontal, modo claro y oscuro.
- Respeta `prefers-reduced-motion`: con esa preferencia, sin animaciones.
- Librerías solo desde CDN con versión fija (cdnjs o jsdelivr). Opcionales si suman de verdad: AOS 2.3.4 para animaciones al hacer scroll, o GSAP 3.12.5 con ScrollTrigger. Usa una sola, no ambas.

## Lo que quiero que mejores
1. **Transiciones entre partes**: que pasar de una parte a la siguiente se sienta como avanzar en un recorrido. Separadores con forma (ola o diagonal SVG) entre bandas de color, y cada parte entrando con una animación propia y suave (aparecer + subir, escalonado en las tarjetas).
2. **Barra de progreso del taller**: una barra fina arriba que se llena al hacer scroll, y en la navegación resaltar la parte en la que va (scrollspy de Bootstrap).
3. **Hero más vivo**: que los chips de la fórmula (Rol + Contexto + Tarea + Realidad + Formato) se armen uno por uno y luego el prompt final aparezca como si se escribiera (efecto máquina de escribir corto). Un fondo sutil animado (puntos o cuadrícula que se mueve despacio), nada recargado.
4. **Micro-interacciones**: tarjetas con hover que se elevan, botones de copiar con confirmación animada (check verde), pestañas de los loops con transición entre contenidos, acordeón de los retos con animación suave.
5. **Parte 1 – el juego**: haz más visible el botón del juego "Verborrera" (https://manuelleal.github.io/verborera/, ya está en ENLACES.juego) como una tarjeta destacada con una invitación clara a jugar 2 minutos. Abre en pestaña nueva.
6. **Nueva sección "Quién facilita"** (antes del footer o justo después del hero, tú decides lo que se vea mejor): una tarjeta de presentación cálida, con espacio para foto (deja `img/christiam.jpg` como ruta; si no existe, muestra un círculo con las iniciales CP). Contenido:
   - **Christiam Manuel Puentes Leal**
   - Licenciado en Lenguas Extranjeras (UPTC) · Máster en Enseñanza Bilingüe (Universidad Nebrija, España) · Especialista en Gerencia de Empresas (UPTC)
   - Instructor del SENA y docente del Instituto de Lenguas de la UIS, sede Málaga
   - Formador de docentes en IA: instructores SENA (evento de 120 horas), docentes UIS (40 horas) y profesores de colegios en el módulo CILE Antioquia
   - Su tesis de maestría estudió el impacto de los modelos de lenguaje (IA) en el desempeño oral en inglés de aprendices SENA
   - Formación en desarrollo de software (Misión TIC)
   - Frase: "La IA propone. El docente decide."
   - Botón a LinkedIn: https://www.linkedin.com/in/christiam-manuel-puentes-leal-59ab21222
   Animación: que los datos aparezcan como chips o mini contadores (por ejemplo "120 h", "40 h", "3 niveles formados").
7. **Coherencia visual**: mantén la paleta (navy #10213A, azul #1F4FE0, naranja #FF8A00, crema #FFF6EA) y las fuentes (Bricolage Grotesque para títulos, Atkinson Hyperlegible para texto). Evita degradados morados, emojis como íconos y que todo quede centrado.
8. **Botón "volver arriba"** flotante que aparece al bajar.

## Al terminar
- Revisa que no haya errores en consola y que se vea bien a 1280 px y a 400 px.
- Dime qué cambiaste en una lista corta.
- Haz commit con un mensaje claro y, si el repositorio ya está conectado a GitHub, haz push a la rama main.
