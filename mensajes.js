// DEMO — bandeja de mensajes sin backend
function getStore(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

const tablaMensajes = document.querySelector("#tabla-mensajes tbody");

try {
  const base = await (await fetch("./data/mensajes.json")).json();
  const extra = getStore("demo-mensajes-extra", []);
  const contestados = getStore("demo-mensajes-contestados", []);
  let mensajes = [...base, ...extra].map((m) => ({
    ...m,
    contestado: contestados.includes(m.mensaje_id) ? 1 : m.contestado
  }));

  tablaMensajes.innerHTML = "";

  if (mensajes.length > 0) {
    for (const m of mensajes) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${m.nombre_apellidos ?? ""}</td>
        <td>${m.animal_nombre ?? ""}</td>
        <td>${m.fecha_envio ?? ""}</td>
        <td>${m.contestado == 1 ? "Sí" : "No"}</td>
        <td><button type="button" class="btn btn--ghost btn-ver">Ver</button></td>`;
      tr.querySelector(".btn-ver").addEventListener("click", function () {
        window.location.href = "mensaje.html?id=" + m.mensaje_id;
      });
      tablaMensajes.appendChild(tr);
    }
  } else {
    tablaMensajes.innerHTML = '<tr><td colspan="5">No hay mensajes en la demo.</td></tr>';
  }
} catch (e) {
  console.error(e);
  tablaMensajes.innerHTML = '<tr><td colspan="5">No se pudo cargar data/mensajes.json</td></tr>';
}

const isLogin = localStorage.getItem("usuarioLogeado");
const botonLogout = document.querySelector("#botonLogout");
if (isLogin != "true") {
  window.location.href = "index.html";
}
if (botonLogout) {
  botonLogout.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("usuarioLogeado");
    localStorage.removeItem("idAdmin");
    window.location.href = "index.html";
  });
}
