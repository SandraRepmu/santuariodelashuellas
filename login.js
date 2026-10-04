// DEMO — login sin backend. Usuario demo: admin / admin
// Para cambiarlo, edita DEMO_USER / DEMO_PASS aquí abajo.
const DEMO_USER = "admin";
const DEMO_PASS = "admin";

const form = document.getElementById("form-login");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const usuario = form.usuario.value.trim();
  const contrasena = form.contrasena.value;

  if (usuario === DEMO_USER && contrasena === DEMO_PASS) {
    localStorage.setItem("usuarioLogeado", "true");
    localStorage.setItem("idAdmin", "1");
    window.location.href = "admin.html";
  } else {
    alert("Los datos introducidos son incorrectos. (Demo: usa admin / admin)");
  }
});

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
