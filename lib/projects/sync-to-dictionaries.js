/**
 * Sync projects from seed.json to dictionaries
 * This script ensures dictionaries have the latest project data
 * Run this script whenever you update seed.json
 */

const fs = require('fs');
const path = require('path');

function syncProjects() {
  // Leer el seed data
  const seedPath = path.join(__dirname, '../../app/data/projects/seed.json');
  const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

  // Leer los diccionarios
  const enDictPath = path.join(__dirname, '../../app/dictionaries/en.json');
  const esDictPath = path.join(__dirname, '../../app/dictionaries/es.json');

  const enDict = JSON.parse(fs.readFileSync(enDictPath, 'utf-8'));
  const esDict = JSON.parse(fs.readFileSync(esDictPath, 'utf-8'));

  // Extraer categorías únicas
  const categoriesSet = new Set();
  seedData.en.projects.forEach(project => {
    project.categories.forEach(cat => categoriesSet.add(cat));
  });

  const categories = Array.from(categoriesSet).map(cat => ({
    id: cat.toLowerCase().replace(/_/g, ''),
    name: cat
  }));

  // Actualizar diccionarios
  enDict.portfolio.projects = seedData.en.projects;
  enDict.portfolio.categories = categories;

  esDict.portfolio.projects = seedData.es.projects;
  esDict.portfolio.categories = categories;

  // Guardar diccionarios actualizados
  fs.writeFileSync(enDictPath, JSON.stringify(enDict, null, 2), 'utf-8');
  fs.writeFileSync(esDictPath, JSON.stringify(esDict, null, 2), 'utf-8');

  console.log('✅ Proyectos sincronizados con diccionarios');
  console.log(`   - ${seedData.en.projects.length} proyectos en inglés`);
  console.log(`   - ${seedData.es.projects.length} proyectos en español`);
  console.log(`   - ${categories.length} categorías`);
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  syncProjects();
}

module.exports = { syncProjects };
