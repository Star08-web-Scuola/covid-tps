const jsonUrl = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json';

const tbody = document.getElementById("ctb");
const selectWhen = document.getElementById('when');


let globalData = [];
function popolaTabella(record) {
    tbody.innerHTML = '';

    if (!record) {
        tbody.innerHTML = '<tr><td colspan="2">Nessun dato disponibile per l\'anno selezionato.</td></tr>';
        return;
    }

    for (const [key, value] of Object.entries(record)) {
        const tr = document.createElement('tr');

        const tdKey = document.createElement('td');
        tdKey.textContent = key.replace(/_/g, ' ');

        const tdValue = document.createElement('td');
        tdValue.textContent = (value !== null && value !== '') ? value : '-';

        tr.appendChild(tdKey);
        tr.appendChild(tdValue);
        tbody.appendChild(tr);
    }
}

function inizializzaSelect(data) {

    selectWhen.innerHTML = '<option value="" hidden disabled selected>Scegli un anno</option>';

    const anniSet = new Set();
    data.forEach(item => {
        if (item.data) {
            const anno = item.data.substring(0, 4);
            anniSet.add(anno);
        }
    });

    const anniArray = Array.from(anniSet).sort().reverse();

    anniArray.forEach(anno => {
        const option = document.createElement('option');
        option.value = anno;
        option.textContent = anno;
        selectWhen.appendChild(option);
    });
}

document.getElementById('when').addEventListener('change', (event) => {
    const annoSelezionato = event.target.value;
    if (!annoSelezionato) {
        tbody.innerHTML = '<tr><td colspan="2">Seleziona un anno per visualizzare i dati.</td></tr>';
        return;
    }

    const recordFiltrati = globalData.filter(item => item.data && item.data.startsWith(annoSelezionato));

    if (recordFiltrati.length > 0) {
        const ultimoRecordDellAnno = recordFiltrati[recordFiltrati.length - 1];
        popolaTabella(ultimoRecordDellAnno);
    } else {
        popolaTabella(null);
    }
});

fetch(jsonUrl)
    .then(response => {
        if (!response.ok) throw new Error('Errore di rete nel recupero del JSON');
        return response.json();
    })
    .then(data => {
        globalData = data;
        inizializzaSelect(data);
    })
    .catch(error => {
        console.error('Errore:', error);
        tbody.innerHTML = '<tr><td colspan="2" style="color:red;">Impossibile caricare i dati dal server.</td></tr>';
    });