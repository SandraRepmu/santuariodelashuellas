// DEMO — detalle de mensaje sin backend
function getStore(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

const nombre = document.getElementById("nombre");
const email = document.getElementById("email");
const telefono = document.getElementById("telefono");
const nombreAnimal = document.getElementById("nombreAnimal");
const motivoEl = document.getElementById("motivo");
const fecha = document.getElementById("fecha");
const mensaje = document.getElementById("mensaje");
const contestado = document.getElementById("contestado");
const botonContestado = document.getElementById("botonContestado");

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

try {
  const base = await (await fetch("./data/mensajes.json")).json();
  const extra = getStore("demo-mensajes-extra", []);
  const contestados = getStore("demo-mensajes-contestados", []);
  const todos = [...base, ...extra].map((m) => ({
    ...m,
    contestado: contestados.includes(m.mensaje_id) ? 1 : m.contestado
  }));
  const mensajePorId = todos.find((m) => Number(m.mensaje_id) === id);

  if (!mensajePorId) {
    mensaje.textContent = "Mensaje no encontrado en la demo.";
  } else {
    nombre.textContent = mensajePorId.nombre_apellidos;
    email.textContent = mensajePorId.email;
    telefono.textContent = mensajePorId.telefono || "—";
    nombreAnimal.textContent = mensajePorId.animal_nombre;
    motivoEl.textContent = mensajePorId.motivo;
    fecha.textContent = mensajePorId.fecha_envio;
    mensaje.textContent = mensajePorId.mensaje;
    contestado.textContent = mensajePorId.contestado == 0 ? "No" : "Sí";

    botonContestado.addEventListener("click", async (e) => {
      e.preventDefault();
      const lista = getStore("demo-mensajes-contestados", []);
      if (!lista.includes(mensajePorId.mensaje_id)) {
        lista.push(mensajePorId.mensaje_id);
        localStorage.setItem("demo-mensajes-contestados", JSON.stringify(lista));
      }
      alert("Se ha marcado el mensaje como contestado. (Demo: solo en tu navegador)");
      window.location.href = "mensajes.html";
    });
  }
} catch (e) {
  console.error(e);
}

// Control header
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
