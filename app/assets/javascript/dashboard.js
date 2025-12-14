// === DONNÉES ===
const salles = [
  { nom: 'Room B2', csv: '/data/20211101_B3D54FD00007B2.csv', couleur: '#3B82F6' },
  { nom: 'Room 8A', csv: '/data/20211101_B3D54FD000088A.csv', couleur: '#F59E0B' },
  { nom: 'Room 8F', csv: '/data/20211101_B3D54FD000088F.csv', couleur: '#10B981' }
];

let donneesCSV = {};
let graphiques = {};

// CHARGER UN CSV D'UNE SALLE
function chargerCSV(salle) {
  return new Promise(resolve => {
    Papa.parse(salle.csv, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: results => {
        donneesCSV[salle.nom] = results.data;
        resolve();
      }
    });
  });
}

// HARGER TOUS LES CSV 
async function chargerTout() {
  const promesses = salles.map(salle => chargerCSV(salle));
  await Promise.all(promesses);
  
  console.log('Données chargées !');
  remplirFiltreSalles();
  creerLegende();
  creerGraphiques();
}

// REMPLIR LE SELECT DES SALLES 
function remplirFiltreSalles() {
  const select = document.getElementById('roomFilter');
  
  salles.forEach(salle => {
    const option = document.createElement('option');
    option.value = salle.nom;
    option.textContent = salle.nom;
    select.appendChild(option);
  });
}

// RÉER LA LÉGENDE (pastilles) 
function creerLegende() {
  const conteneur = document.getElementById('roomLegend');
  
  salles.forEach(salle => {
    const div = document.createElement('div');
    div.className = 'flex items-center gap-2';
    div.innerHTML = `
      <div class="w-4 h-4 rounded-full" style="background-color: ${salle.couleur}"></div>
      <span class="text-sm font-medium text-gray-700">${salle.nom}</span>
    `;
    conteneur.appendChild(div);
  });
}

// CRÉER LES 3 GRAPHIQUES 
function creerGraphiques(sallesAUtiliser = salles) {
  // Crée les graphiques pour les salles fournies (par défaut toutes les salles)
  creerGraphique('co2', 'co2Chart', sallesAUtiliser);
  creerGraphique('tmp', 'tmpChart', sallesAUtiliser);
  creerGraphique('voct', 'voctChart', sallesAUtiliser);
}

// CRÉER UN GRAPHIQUE 
function creerGraphique(typeMesure, canvasId, sallesAUtiliser = salles) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const datasets = [];

  sallesAUtiliser.forEach(salle => {
    const donnees = donneesCSV[salle.nom] || [];

    const mesures = donnees
      .filter(ligne => ligne.measure_type && ligne.measure_type.toLowerCase() === typeMesure)
      .sort((a, b) => new Date(a['@timestamp']) - new Date(b['@timestamp']));

    const points = mesures.map(m => ({
      x: new Date(m['@timestamp']),
      y: m.measure_float
    }));

    if (points.length === 0) return; // pas de données pour cette salle/type

    datasets.push({
      label: salle.nom,
      data: points,
      borderColor: salle.couleur,
      backgroundColor: salle.couleur,
      borderWidth: 2,
      fill: false,
      tension: 0.4
    });
  });

  // Si aucun dataset, on ne crée pas de graphique
  if (datasets.length === 0) {
    if (graphiques[typeMesure]) {
      try { graphiques[typeMesure].destroy(); } catch (e) {}
      delete graphiques[typeMesure];
    }
    return;
  }

  graphiques[typeMesure] = new Chart(ctx, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'minute',
            displayFormats: { minute: 'HH:mm' }
          },
          title: { display: true, text: 'Heure' }
        },
        y: {
          title: { display: true, text: 'Valeur' }
        }
      }
    }
  });
}

// GÉRER LES FILTRES 
document.getElementById('roomFilter').addEventListener('change', appliquerFiltres);
document.getElementById('paramFilter').addEventListener('change', appliquerFiltres);

function appliquerFiltres() {
  const salleSelectionnee = document.getElementById('roomFilter').value;
  const parametreSelectionne = document.getElementById('paramFilter').value;
  
  const sallesAffichees = salleSelectionnee === 'all' 
    ? salles 
    : salles.filter(s => s.nom === salleSelectionnee);
  
  document.getElementById('co2Section').style.display = 
    (parametreSelectionne === 'all' || parametreSelectionne === 'co2') ? 'block' : 'none';
  document.getElementById('tmpSection').style.display = 
    (parametreSelectionne === 'all' || parametreSelectionne === 'tmp') ? 'block' : 'none';
  document.getElementById('voctSection').style.display = 
    (parametreSelectionne === 'all' || parametreSelectionne === 'voct') ? 'block' : 'none';
  // Détruire les graphiques existants et vider le registre
  Object.values(graphiques).forEach(g => { try { g.destroy(); } catch (e) {} });
  graphiques = {};

  // Créer uniquement les graphiques pour les salles filtrées
  creerGraphiques(sallesAffichees);
}

chargerTout();