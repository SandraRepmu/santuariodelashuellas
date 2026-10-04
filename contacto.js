// DEMO — contacto sin backend. Guarda mensajes en localStorage.
const textoMensaje = document.querySelector("#mensaje");
const form = document.getElementById("form-contacto");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (id != null) {
  try {
    const base = await (await fetch("./data/animales.json")).json();
    const animalPorId = base.find((a) => String(a.id) === String(id));
    if (animalPorId && textoMensaje && !textoMensaje.value) {
      textoMensaje.value = "Estoy interesado en adoptar a " + animalPorId.nombre;
    }
  } catch (e) {
    console.error(e);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cliente = {
    nombre_apellidos: form.nombre.value,
    email: form.email.value,
    telefono: form.telefono.value
  };
  const mensaje = {
    motivo: form.motivo.value,
    mensaje: form.mensaje.value,
    id_animal: id != null ? id : null
  };

  // Demo: guardar en localStorage para verlo en mensajes.html
  try {
    const extra = JSON.parse(localStorage.getItem("demo-mensajes-extra") || "[]");
    const todosBase = await (await fetch("./data/mensajes.json")).json().catch(() => []);
    const nextId = Math.max(0, ...todosBase.map((m) => m.mensaje_id), ...extra.map((m) => m.mensaje_id)) + 1;
    const NuevoId = (Math.max(0, ...todosBase.map((m) => m.mensaje_id), ...extra.map((m) => m.mensaje_id), 0)) + 1;
    let nombreAnimal = "Sin especificar";
    if (mensaje.id_animal != null) {
      const animales = await (await fetch("./data/animales.json")).json();
      const a = animales.find((x) => String(x.id) === String(mensaje.id_animal));
      if (a) nombreAnimal = a.nombre;
    }
    extra.push({
      mensaje_id: NuevoId,
      cliente_id: Date.now(),
      nombre_apellidos: cliente.nombre_apellidos,
      email: cliente.email,
      telefono: cliente.telefono,
      animal_nombre: nombreAnimal,
      id_animal: mensaje.id_animal,
      motivo: mensaje.motivo,
      fecha_envio: new Date().toISOString().slice(0, 19).replace("T", " "),
      mensaje: mensaje.mensaje,
      contestado: 0
    });
    localStorage.setItem("demo-mensajes-extra", JSON.stringify(extra));
  } catch (err) {
    console.error(err);
  }

  alert("Gracias por ponerte en contacto con nosotros. (Demo: mensaje guardado solo en tu navegador)");
  window.location.href = "index.html";
});

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
