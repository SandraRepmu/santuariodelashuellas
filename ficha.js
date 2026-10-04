// DEMO — ficha sin backend
function leerDeltas() {
  return {
    extra: JSON.parse(localStorage.getItem("demo-animales-extra") || "[]"),
    editados: JSON.parse(localStorage.getItem("demo-animales-edit") || "{}"),
    borrados: JSON.parse(localStorage.getItem("demo-animales-borrados") || "[]"),
    adoptados: JSON.parse(localStorage.getItem("demo-animales-adoptados") || "{}")
  };
}

const imagenanimal = document.querySelector("#imagen-animal");
const tituloAnimal = document.querySelector("#titulo-animal");
const sobreAnimal = document.querySelector("#sobre-animal");
const descripcionanimnal = document.querySelector("#descripcion-animnal");
const historiaanimnal = document.querySelector("#historia-animnal");
const nombreanimnal = document.querySelector("#nombre-animnal");
const especieanimnal = document.querySelector("#especie-animnal");
const edadanimnal = document.querySelector("#edad-animnal");
const sexoanimnal = document.querySelector("#sexo-animnal");
const tamanoanimnal = document.querySelector("#tamano-animnal");
const razaanimnal = document.querySelector("#raza-animnal");
const vacunasanimnal = document.querySelector("#vacunas-animnal");
const esterilizadoanimnal = document.querySelector("#esterilizado-animnal");
const botoncontacto = document.querySelector("#boton-contacto");

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

try {
  const base = await (await fetch("./data/animales.json")).json();
  const { extra, editados, borrados, adoptados } = leerDeltas();
  let todos = [...base, ...extra].map((a) => {
    let copia = { ...a };
    if (editados[a.id]) copia = { ...copia, ...editados[a.id] };
    if (adoptados[a.id] && !copia.fecha_adopcion) copia.fecha_adopcion = adoptados[a.id];
    return copia;
  });
  todos = todos.filter((a) => !borrados.includes(a.id));
  const animalPorId = todos.find((a) => Number(a.id) === id);

  if (!animalPorId) {
    tituloAnimal.textContent = "Animal no encontrado en la demo";
  } else {
    tituloAnimal.textContent = animalPorId.nombre;
    sobreAnimal.textContent = "Sobre " + animalPorId.nombre;
    descripcionanimnal.textContent = animalPorId.descripcion;
    historiaanimnal.textContent = animalPorId.historia;
    imagenanimal.src = animalPorId.foto;
    imagenanimal.alt = animalPorId.nombre;
    nombreanimnal.textContent = animalPorId.nombre;
    especieanimnal.textContent = animalPorId.especie;
    edadanimnal.textContent = animalPorId.edad + " años";
    sexoanimnal.textContent = animalPorId.sexo;
    tamanoanimnal.textContent = animalPorId.tamano;
    razaanimnal.textContent = animalPorId.raza;
    vacunasanimnal.textContent = animalPorId.vacunas == 1 ? "Sí" : "No";
    esterilizadoanimnal.textContent = animalPorId.esterilizado == 1 ? "Sí" : "No";
    botoncontacto.href = "contacto.html?id=" + animalPorId.id;
  }
} catch (e) {
  console.error(e);
  tituloAnimal.textContent = "No se pudo cargar la demo";
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
