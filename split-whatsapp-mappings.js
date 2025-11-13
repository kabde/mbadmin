#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Diviser les mappings membres-classes
const classMappingsFile = path.join(__dirname, 'insert-whatsapp-class-mappings.sql');
const classMappingsContent = fs.readFileSync(classMappingsFile, 'utf8');

const classMappingsLines = classMappingsContent.split('\n');
const classMappingsHeader = classMappingsLines.slice(0, 6).join('\n'); // Garder l'en-tête
const classMappingsInserts = classMappingsLines.slice(6).filter(line => line.trim());

console.log(`📊 Mappings membres-classes: ${classMappingsInserts.length} insertions`);

// Diviser en lots de 500
const classBatchSize = 500;
const classBatches = [];
for (let i = 0; i < classMappingsInserts.length; i += classBatchSize) {
  const batch = classMappingsInserts.slice(i, i + classBatchSize);
  classBatches.push(batch);
}

console.log(`📦 Lots membres-classes: ${classBatches.length}`);

// Créer les fichiers de lots pour les mappings classes
classBatches.forEach((batch, index) => {
  const batchNumber = index + 1;
  const batchFile = path.join(__dirname, `insert-whatsapp-class-mappings-batch-${batchNumber}.sql`);
  
  let batchContent = classMappingsHeader + '\n\n';
  batchContent += `-- Lot ${batchNumber}/${classBatches.length} (${batch.length} insertions)\n\n`;
  batchContent += batch.join('\n') + '\n';
  
  fs.writeFileSync(batchFile, batchContent);
  console.log(`✅ Lot classes ${batchNumber} créé: ${batchFile} (${batch.length} insertions)`);
});

// Diviser les mappings membres-programmes
const programMappingsFile = path.join(__dirname, 'insert-whatsapp-program-mappings.sql');
const programMappingsContent = fs.readFileSync(programMappingsFile, 'utf8');

const programMappingsLines = programMappingsContent.split('\n');
const programMappingsHeader = programMappingsLines.slice(0, 6).join('\n'); // Garder l'en-tête
const programMappingsInserts = programMappingsLines.slice(6).filter(line => line.trim());

console.log(`📊 Mappings membres-programmes: ${programMappingsInserts.length} insertions`);

// Diviser en lots de 500
const programBatchSize = 500;
const programBatches = [];
for (let i = 0; i < programMappingsInserts.length; i += programBatchSize) {
  const batch = programMappingsInserts.slice(i, i + programBatchSize);
  programBatches.push(batch);
}

console.log(`📦 Lots membres-programmes: ${programBatches.length}`);

// Créer les fichiers de lots pour les mappings programmes
programBatches.forEach((batch, index) => {
  const batchNumber = index + 1;
  const batchFile = path.join(__dirname, `insert-whatsapp-program-mappings-batch-${batchNumber}.sql`);
  
  let batchContent = programMappingsHeader + '\n\n';
  batchContent += `-- Lot ${batchNumber}/${programBatches.length} (${batch.length} insertions)\n\n`;
  batchContent += batch.join('\n') + '\n';
  
  fs.writeFileSync(batchFile, batchContent);
  console.log(`✅ Lot programmes ${batchNumber} créé: ${batchFile} (${batch.length} insertions)`);
});

console.log('\n🎯 Prochaines étapes:');
console.log('1. Exécuter tous les lots de mappings membres-classes');
console.log('2. Exécuter tous les lots de mappings membres-programmes');
console.log('3. Vérifier les résultats');
console.log('4. Nettoyer les fichiers temporaires');
