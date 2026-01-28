document.addEventListener('DOMContentLoaded', () =>{
    const filterStatus = document.getElementById('filterStatus');
    const filterCarrier = document.getElementById('filterCarrier');
    const searchGuide = document.getElementById('searchGuide');
    const exportBtn = document.getElementById('exportBtn');

    if(filterStatus) {
        filterStatus.addEventListener('change', (e) => {
            console.log('Filtrar por estatus:', e.target.value);
        });
    }

    if(filterCarrier) {
        filterCarrier.addEventListener('change', (e) => {
            console.log('Filtrar por paqueteria:', e.target.value);
        });
    }

    if(searchGuide) {
        searchGuide.addEventListener('input', (e) => {
            console.log('Buscar Guia:', e.target.value);
        });
    }

    if(exportBtn) {
        exportBtn.addEventListener('click', () => {
            console.log('Exportando a Excel...');
            alert('Funcionalidad de exportacion en desarrollo');
        });
    }

    const actionButtons = document.querySelectorAll('.btn-action');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const guideNumber = row.querySelector('.guide-number').textContent;
            console.log('Ver detalles de guia: ', guideNumber);
        });
    });

    console.log ('✅ Estatus de paquetes entregado cargado correctamente');
});

window.addEventListener('scroll', () => {
    if(window.scrollY > 50) {
        document.body.classList.add('is-scrolled');
    }else {
        document.body.classList.remove('is-scrolled');
    }
});