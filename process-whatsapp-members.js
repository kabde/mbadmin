#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Lire le fichier JSON
const jsonFile = path.join(__dirname, 'temp', 'user_whatsapp_group_members.json');
const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// Extraire les données de la table
const tableData = data.find(item => item.type === 'table' && item.name === 'user_whatsapp_group_members');
if (!tableData || !tableData.data) {
  console.error('❌ Données de table non trouvées');
  process.exit(1);
}

const records = tableData.data;
console.log(`📊 ${records.length} enregistrements trouvés`);

// Analyser les classes uniques
const uniqueClasses = new Set();
const classMapping = new Map(); // classtitle -> class_id
const memberClassMappings = [];
const memberProgramMappings = [];

records.forEach(record => {
  if (record.classtitle) {
    uniqueClasses.add(record.classtitle);
    memberClassMappings.push({
      user_id: record.user_id,
      classtitle: record.classtitle,
      school_id: record.school_id,
      enrollment_date: record.enrollment_date
    });
  }
  
  // Mappings membres-programmes
  memberProgramMappings.push({
    user_id: record.user_id,
    program_id: record.program_id,
    school_id: record.school_id,
    enrollment_date: record.enrollment_date
  });
});

console.log(`\n📈 Statistiques:`);
console.log(`Classes uniques: ${uniqueClasses.size}`);
console.log(`Mappings membres-classes: ${memberClassMappings.length}`);
console.log(`Mappings membres-programmes: ${memberProgramMappings.length}`);

// Créer les classes avec des IDs séquentiels (en continuant depuis les classes existantes)
let classId = 373; // Continuer depuis les classes v1-xxx existantes
const classes = Array.from(uniqueClasses).map(classtitle => {
  const classData = {
    id: classId,
    school_id: 1,
    code: classtitle,
    title: `Classe ${classtitle}`,
    description: `Classe ${classtitle} du programme MBA V2`
  };
  classMapping.set(classtitle, classId);
  classId++;
  return classData;
});

console.log(`\n🎯 Classes v2-xxx créées: ${classes.length}`);

// Générer le script SQL pour les classes
const classesSqlFile = path.join(__dirname, 'insert-whatsapp-classes.sql');
let classesSqlContent = `-- Script d'insertion des classes WhatsApp (v2-xxx)
-- Généré automatiquement depuis user_whatsapp_group_members.json
-- Date: ${new Date().toISOString()}
-- Total: ${classes.length} classes

-- Insertions des classes v2-xxx
`;

classes.forEach(classData => {
  const sql = `INSERT INTO classes (id, school_id, code, title, description, created_at)
VALUES (${classData.id}, ${classData.school_id}, '${classData.code}', '${classData.title}', '${classData.description}', CURRENT_TIMESTAMP);`;
  classesSqlContent += sql + '\n';
});

fs.writeFileSync(classesSqlFile, classesSqlContent);
console.log(`✅ Script classes généré: ${classesSqlFile}`);

// Générer le script SQL pour les mappings membres-classes
const classMappingsSqlFile = path.join(__dirname, 'insert-whatsapp-class-mappings.sql');
let classMappingsSqlContent = `-- Script d'insertion des mappings membres-classes WhatsApp
-- Généré automatiquement depuis user_whatsapp_group_members.json
-- Date: ${new Date().toISOString()}
-- Total: ${memberClassMappings.length} mappings

-- Insertions des mappings membres-classes
`;

memberClassMappings.forEach((mapping, index) => {
  const classId = classMapping.get(mapping.classtitle);
  const sql = `INSERT OR IGNORE INTO membres_classes (membre_id, class_id, school_id, enrollment_date, status, role, created_at, updated_at)
VALUES (${mapping.user_id}, ${classId}, ${mapping.school_id}, '${mapping.enrollment_date}', 'active', 'student', '${mapping.enrollment_date}', '${mapping.enrollment_date}');`;
  
  classMappingsSqlContent += sql + '\n';
  
  // Afficher le progrès
  if ((index + 1) % 1000 === 0) {
    console.log(`📝 Traité ${index + 1}/${memberClassMappings.length} mappings classes...`);
  }
});

fs.writeFileSync(classMappingsSqlFile, classMappingsSqlContent);
console.log(`✅ Script mappings classes généré: ${classMappingsSqlFile}`);

// Générer le script SQL pour les mappings membres-programmes
const programMappingsSqlFile = path.join(__dirname, 'insert-whatsapp-program-mappings.sql');
let programMappingsSqlContent = `-- Script d'insertion des mappings membres-programmes WhatsApp
-- Généré automatiquement depuis user_whatsapp_group_members.json
-- Date: ${new Date().toISOString()}
-- Total: ${memberProgramMappings.length} mappings

-- Insertions des mappings membres-programmes
`;

memberProgramMappings.forEach((mapping, index) => {
  const sql = `INSERT OR IGNORE INTO membres_programs (membre_id, program_id, school_id, enrollment_date, status, role, created_at, updated_at)
VALUES (${mapping.user_id}, ${mapping.program_id}, ${mapping.school_id}, '${mapping.enrollment_date}', 'active', 'student', '${mapping.enrollment_date}', '${mapping.enrollment_date}');`;
  
  programMappingsSqlContent += sql + '\n';
  
  // Afficher le progrès
  if ((index + 1) % 1000 === 0) {
    console.log(`📝 Traité ${index + 1}/${memberProgramMappings.length} mappings programmes...`);
  }
});

fs.writeFileSync(programMappingsSqlFile, programMappingsSqlContent);
console.log(`✅ Script mappings programmes généré: ${programMappingsSqlFile}`);

// Générer un script de vérification
const verifyFile = path.join(__dirname, 'verify-whatsapp.sql');
const verifyContent = `-- Script de vérification après insertion WhatsApp
-- Vérifier le nombre total de classes (v1-xxx + v2-xxx)
SELECT COUNT(*) as total_classes FROM classes;

-- Vérifier le nombre total de mappings membres-classes
SELECT COUNT(*) as total_membres_classes FROM membres_classes;

-- Vérifier le nombre total de mappings membres-programmes
SELECT COUNT(*) as total_membres_programs FROM membres_programs;

-- Vérifier la répartition des classes v2-xxx
SELECT 
    c.title as class_title,
    COUNT(mc.membre_id) as member_count
FROM membres_classes mc
JOIN classes c ON mc.class_id = c.id
WHERE c.code LIKE 'v2-%'
GROUP BY mc.class_id, c.title
ORDER BY member_count DESC
LIMIT 20;

-- Vérifier quelques exemples de mappings
SELECT 
    mc.*,
    c.title as class_title
FROM membres_classes mc
JOIN classes c ON mc.class_id = c.id
WHERE c.code LIKE 'v2-%'
ORDER BY mc.membre_id
LIMIT 10;
`;

fs.writeFileSync(verifyFile, verifyContent);
console.log(`✅ Script de vérification généré: ${verifyFile}`);

console.log('\n🎯 Prochaines étapes:');
console.log('1. Exécuter: wrangler d1 execute admin-mba-db --remote --file insert-whatsapp-classes.sql');
console.log('2. Diviser et exécuter les mappings en lots');
console.log('3. Vérifier: wrangler d1 execute admin-mba-db --remote --file verify-whatsapp.sql');
console.log('4. Nettoyer les fichiers temporaires');
