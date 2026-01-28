document.addEventListener("DOMContentLoaded", () => {
  const filterStatus = document.getElementById("filterStatus");
  const filterCarrier = document.getElementById("filterCarrier");
  const searchGuide = document.getElementById("searchGuide");
  const exportBtn = document.getElementById("exportBtn");

  // Filtrar por estatus
  if (filterStatus) {
    filterStatus.addEventListener("change", (e) => {
      console.log("Filtrar por estatus:", e.target.value);
    });
  }

  // Filtrar por paquetería
  if (filterCarrier) {
    filterCarrier.addEventListener("change", (e) => {
      console.log("Filtrar por paquetería:", e.target.value);
    });
  }

  // Buscar por guía
  if (searchGuide) {
    searchGuide.addEventListener("input", (e) => {
      console.log("Buscar guía:", e.target.value);
    });
  }

  // Exportar a Excel
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      alert("Generando reporte de excepciones...");
      console.log("Exportando a Excel...");
    });
  }

  console.log("✅ excepcion-status.js cargado correctamente");
});

// Detectar scroll para mostrar mini tarjeta en header
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    document.body.classList.add("is-scrolled");
  } else {
    document.body.classList.remove("is-scrolled");
  }
});
