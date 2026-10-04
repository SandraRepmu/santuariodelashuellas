// DEMO admin — CRUD solo en localStorage (no hay PHP/MySQL).
// Datos base: data/animales.json (edítalo para corregir nombres, fotos, etc.)
// Fotos: usa rutas de imagenes/*.png o deja la anterior.

const tablaAnimales = document.querySelector("#tabla-animales tbody");
const formAnimal = document.getElementById("form-animal");
let idAnimalEdiccion = 0;
let fotoAnimal = null;

function getStore(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function setStore(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

async function getAnimalesDemo() {
  const base = await (await fetch("./data/animales.json")).json();
  const extra = getStore("demo-animales-extra", []);
  const editados = getStore("demo-animales-edit", {});
  const borrados = getStore("demo-animales-borrados", []);
  const adoptados = getStore("demo-animales-adoptados", {});
  let todos = [...base, ...extra].map((a) => {
    let c = { ...a };
    if (editados[a.id]) c = { ...c, ...editados[a.id] };
    if (adoptados[a.id] && !c.fecha_adopcion) c.fecha_adopcion = adoptados[a.id];
    return c;
  });
  return todos.filter((a) => !borrados.includes(a.id)).sort((a, b) => b.id - a.id);
}

function pintarFila(a) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${a.nombre ?? ""}</td>
    <td>${a.especie ?? ""}</td>
    <td>${a.edad ?? ""}</td>
    <td>${a.sexo ?? ""}</td>
    <td>${a.tamano ?? ""}</td>
    <td>${a.raza ?? ""}</td>
    <td>${a.vacunas == 1 ? "Sí" : "No"}</td>
    <td>${a.esterilizado == 1 ? "Sí" : "No"}</td>
    <td>${a.fecha_adopcion != null ? "Sí" : "No"}</td>
    <td>
      <button type="button" class="btn btn--ghost btn-editar">Editar</button>
      ${a.fecha_adopcion == null ? '<button type="button" class="btn btn--ghost btn-adoptar">Adoptado</button>' : ""}
      <button type="button" class="btn btn--ghost btn-borrar">Borrar</button>
    </td>`;

  tr.querySelector(".btn-editar").addEventListener("click", function () {
    document.getElementById("titulo-animal").textContent = a.nombre;
    document.getElementById("nombre").value = a.nombre ?? "";
    document.getElementById("especie").value = a.especie ?? "";
    document.getElementById("edad").value = a.edad ?? "";
    document.getElementById("sexo").value = a.sexo ?? "";
    document.getElementById("tamano").value = a.tamano ?? "";
    document.getElementById("raza").value = a.raza ?? "";
    document.getElementById("checkVacuna").checked = a.vacunas == 1;
    document.getElementById("checkEsterilizado").checked = a.esterilizado == 1;
    document.getElementById("descripcion").value = a.descripcion ?? "";
    fotoAnimal = a.foto;
    idAnimalEdiccion = a.id;
    window.scrollTo({ top: document.getElementById("form-animal").offsetTop - 20, behavior: "smooth" });
  });

  const btnAdoptar = tr.querySelector(".btn-adoptar");
  if (btnAdoptar) {
    btnAdoptar.addEventListener("click", async function () {
      if (!confirm("¿Estás seguro de marcar como adoptado este animal? (Demo: solo en tu navegador)")) return;
      const adoptados = getStore("demo-animales-adoptados", {});
      adoptados[a.id] = new Date().toISOString().slice(0, 19).replace("T", " ");
      setStore("demo-animales-adoptados", adoptados);
      location.reload();
    });
  }

  tr.querySelector(".btn-borrar").addEventListener("click", async function () {
    if (!confirm("¿Estás seguro de borrar a este animal? (Demo: solo en tu navegador)")) return;
    const borrados = getStore("demo-animales-borrados", []);
    borrados.push(a.id);
    setStore("demo-animales-borrados", borrados);
    location.reload();
  });

  tablaAnimales.appendChild(tr);
}

try {
  const animales = await getAnimalesDemo();
  tablaAnimales.innerHTML = "";
  if (animales.length > 0) animales.forEach(pintarFila);
  else tablaAnimales.innerHTML = '<tr><td colspan="10">No hay animales en la demo.</td></tr>';
} catch (e) {
  console.error(e);
  tablaAnimales.innerHTML = '<tr><td colspan="10">No se pudo cargar data/animales.json</td></tr>';
}

formAnimal.addEventListener("submit", async function (e) {
  e.preventDefault();
  if (formAnimal.foto.files[0] == null && fotoAnimal == null) {
    alert("Es obligatorio subir una fotografía del animal");
    return;
  }
  if (formAnimal.foto.files[0]) {
    const reader = new FileReader();
    reader.onload = async function () {
      await guardarAnimal(reader.result);
    };
    reader.readAsDataURL(formAnimal.foto.files[0]);
  } else {
    await guardarAnimal(fotoAnimal);
  }
});

async function guardarAnimal(fotoBase64) {
  const animal = {
    nombre: formAnimal.nombre.value.trim() || "Sin nombre",
    descripcion: formAnimal.descripcion.value.trim(),
    especie: formAnimal.especie.value.trim(),
    edad: formAnimal.edad.value ? Number(formAnimal.edad.value) : null,
    sexo: formAnimal.sexo.value.trim() || "Desconocido",
    tamano: formAnimal.tamano.value.trim() || "Mediano",
    raza: formAnimal.raza.value.trim(),
    vacunas: formAnimal.vacunas.checked ? 1 : 0,
    esterilizado: formAnimal.esterilizado.checked ? 1 : 0,
    foto: fotoBase64
  };

  if (idAnimalEdiccion == 0) {
    const extra = getStore("demo-animales-extra", []);
    const base = await (await fetch("./data/animales.json")).json();
    const maxId = Math.max(0, ...base.map((a) => a.id), ...extra.map((a) => a.id));
    extra.push({
      id: maxId + 1,
      historia: "",
      microchip: "",
      fecha_creacion: new Date().toISOString().slice(0, 19).replace("T", " "),
      fecha_adopcion: null,
      ...animal
    });
    setStore("demo-animales-extra", extra);
    alert("Animal añadido correctamente. (Demo: solo en tu navegador)");
  } else {
    const editados = getStore("demo-animales-edit", {});
    editados[idAnimalEdiccion] = { ...(editados[idAnimalEdiccion] || {}), ...animal };
    setStore("demo-animales-edit", editados);
    idAnimalEdiccion = 0;
    alert(animal.nombre + " modificado correctamente. (Demo: solo en tu navegador)");
  }
  location.reload();
}

// Solo admin
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
