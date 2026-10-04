// DEMO — listado sin backend
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
  return todos.filter((a) => !borrados.includes(a.id));
}

const contenedorTarjetas = document.querySelector("#contenedor-tarjetas");

try {
  const todos = await cargarAnimalesDemo();
  const animales = todos
    .filter((a) => a.fecha_adopcion == null)
    .sort((a, b) => b.id - a.id);

  contenedorTarjetas.innerHTML = "";

  if (animales.length > 0) {
    for (const a of animales) {
      const tarjeta = document.createElement("div");
      tarjeta.innerHTML = `
        <div class="pet-media">
          <img src="${a.foto ?? ""}" alt="${a.nombre ?? ""}">
        </div>
        <div class="pet-body">
          <h3 class="pet-name">${a.nombre ?? ""}</h3>
          <p class="pet-meta">${a.especie ?? ""} • ${a.edad ?? ""} años • ${a.tamano ?? ""}</p>
          <p class="pet-desc">${a.descripcion ?? ""}</p>
          <a href="ficha.html?id=${a.id}" class="pet-btn">Conoce a ${a.nombre ?? ""}</a>
        </div>`;
      contenedorTarjetas.appendChild(tarjeta);
    }
  } else {
    contenedorTarjetas.innerHTML = "<p>No hay animales disponibles en la demo.</p>";
  }
} catch (e) {
  console.error(e);
  contenedorTarjetas.innerHTML = "<p>No se pudo cargar la demo. Sirve la carpeta con un servidor local.</p>";
}

// Control login admin
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
