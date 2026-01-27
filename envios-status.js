// Funcionalidad de filtros y tabla de envíos
document.addEventListener('DOMContentLoaded', () => {
    const filterStatus = document.getElementById('filterStatus');
    const filterCarrier = document.getElementById('filterCarrier');
    const searchGuide = document.getElementById('searchGuide');
    const exportBtn = document.getElementById('exportBtn');

    // Filtrar por estatus
    if (filterStatus) {
        filterStatus.addEventListener('change', (e) => {
            console.log('Filtrar por estatus:', e.target.value);
            // Aquí implementarías la lógica de filtrado
        });
    }

    // Filtrar por paquetería
    if (filterCarrier) {
        filterCarrier.addEventListener('change', (e) => {
            console.log('Filtrar por paquetería:', e.target.value);
            // Aquí implementarías la lógica de filtrado
        });
    }

    // Buscar por guía
    if (searchGuide) {
        searchGuide.addEventListener('input', (e) => {
            console.log('Buscar guía:', e.target.value);
            // Aquí implementarías la lógica de búsqueda
        });
    }

    // Exportar a Excel
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            console.log('Exportando a Excel...');
            alert('Funcionalidad de exportación en desarrollo');
            // Aquí implementarías la lógica de exportación
        });
    }

    // Botones de acción en la tabla
    const actionButtons = document.querySelectorAll('.btn-action');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const guideNumber = row.querySelector('.guide-number').textContent;
            console.log('Ver detalles de guía:', guideNumber);
            // Aquí podrías redirigir a shipments.html con el número de guía
            // window.location.href = `shipments.html?guide=${guideNumber}`;
        });
    });

    console.log('✅ Envíos Status cargado correctamente');
});
