// DEMO GitHub Pages — sin PHP ni MySQL. Lee datos locales de data/animales.json
// y aplica cambios guardados en localStorage (solo tu navegador).
// Para corregir datos: edita docs/data/animales.json

function leerDeltas() {
  return {
    extra: JSON.parse(localStorage.getItem("demo-animales-extra") || "[]"),
    editados: JSON.parse(localStorage.getItem("demo-animales-edit") || "{}"),
    borrados: JSON.parse(localStorage.getItem("demo-animales-borrados") || "[]"),
    adoptados: JSON.parse(localStorage.getItem("demo-animales-adoptados") || "{}")
  };
}

async function cargarAnimalesDemo() {
  const base = await (await fetch("./data/animales.json")).json();
  const { extra, editados, borrados, adoptados } = leerDeltas();
  let todos = [...base, ...extra].map((a) => {
    let copia = { ...a };
    if (editados[a.id]) copia = { ...copia, ...editados[a.id] };
    if (adoptados[a.id] && !copia.fecha_adopcion) copia.fecha_adopcion = adoptados[a.id];
    return copia;
  });
  todos = todos.filter((a) => !borrados.includes(a.id));
  return todos;
}

function tarjetaHTML(a) {
  return `
    <div class="pet-media">
      <img src="${a.foto ?? ""}" alt="${a.nombre ?? ""}">
    </div>
    <div class="pet-body">
      <h3 class="pet-name">${a.nombre ?? ""}</h3>
      <p class="pet-meta">${a.especie ?? ""} • ${a.edad ?? ""} años • ${a.tamano ?? ""}</p>
      <p class="pet-desc">${a.descripcion ?? ""}</p>
      <a href="ficha.html?id=${a.id}" class="pet-btn">Conoce a ${a.nombre ?? ""}</a>
    </div>`;
}

try {
  const primeratarjeta = document.querySelector("#primera-tarjeta");
  const segundatarjeta = document.querySelector("#segunda-tarjeta");
  const terceratarjeta = document.querySelector("#tercera-tarjeta");

  const todos = await cargarAnimalesDemo();
  const disponibles = todos
    .filter((a) => a.fecha_adopcion == null)
    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
    .slice(0, 3);

  const tarjetas = [primeratarjeta, segundatarjeta, terceratarjeta];
  tarjetas.forEach((el, i) => {
    if (!el) return;
    if (disponibles[i]) el.innerHTML = tarjetaHTML(disponibles[i]);
    else el.style.display = "none";
  });
} catch (e) {
  console.error("Demo: no se pudo cargar data/animales.json. Sirve la carpeta con un servidor local (ej. python3 -m http.server).", e);
}

// Control login admin (común, funciona sin backend vía localStorage)
const isLogin = localStorage.getItem("usuarioLogeado");
const botonLogin = document.querySelector("#botonLogin");
const botonLogout = document.querySelector("#botonLogout");
const optionAdmin = document.querySelector("#optionAdmin");

if (isLogin == "true") {
  if (botonLogin) { botonLogin.style.display = "none"; botonLogin.style.visibility = "hidden"; }
  if (botonLogout) { botonLogout.style.visibility = "visible"; botonLogout.style.display = "block"; }
  if (optionAdmin) optionAdmin.style.visibility = "visible";
} else {
  if (botonLogin) { botonLogin.style.visibility = "visible"; botonLogin.style.display = "block"; }
  if (botonLogout) { botonLogout.style.display = "none"; botonLogout.style.visibility = "hidden"; }
  if (optionAdmin) optionAdmin.style.visibility = "hidden";
}

if (botonLogout) {
  botonLogout.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("usuarioLogeado");
    localStorage.removeItem("idAdmin");
    location.reload();
  });
}
