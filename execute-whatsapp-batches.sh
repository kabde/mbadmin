#!/bin/bash

echo "🚀 Exécution de tous les lots WhatsApp..."
echo "=========================================="

# Compter les lots
CLASS_BATCH_COUNT=$(ls insert-whatsapp-class-mappings-batch-*.sql | wc -l)
PROGRAM_BATCH_COUNT=$(ls insert-whatsapp-program-mappings-batch-*.sql | wc -l)

echo "📦 Lots membres-classes: $CLASS_BATCH_COUNT"
echo "📦 Lots membres-programmes: $PROGRAM_BATCH_COUNT"
echo ""

# Exécuter les lots de mappings membres-classes
echo "🔄 Exécution des mappings membres-classes..."
for i in $(seq 1 $CLASS_BATCH_COUNT); do
    echo "🔄 Traitement du lot classes $i/$CLASS_BATCH_COUNT..."
    
    if wrangler d1 execute admin-mba-db --remote --file "insert-whatsapp-class-mappings-batch-$i.sql"; then
        echo "✅ Lot classes $i traité avec succès"
    else
        echo "❌ Erreur lors du traitement du lot classes $i"
        echo "🛑 Arrêt du processus"
        exit 1
    fi
    
    echo ""
done

echo "🎉 Tous les lots membres-classes ont été traités avec succès !"
echo ""

# Exécuter les lots de mappings membres-programmes
echo "🔄 Exécution des mappings membres-programmes..."
for i in $(seq 1 $PROGRAM_BATCH_COUNT); do
    echo "🔄 Traitement du lot programmes $i/$PROGRAM_BATCH_COUNT..."
    
    if wrangler d1 execute admin-mba-db --remote --file "insert-whatsapp-program-mappings-batch-$i.sql"; then
        echo "✅ Lot programmes $i traité avec succès"
    else
        echo "❌ Erreur lors du traitement du lot programmes $i"
        echo "🛑 Arrêt du processus"
        exit 1
    fi
    
    echo ""
done

echo "🎉 Tous les lots ont été traités avec succès !"
echo ""
echo "🔍 Vérification des résultats..."
wrangler d1 execute admin-mba-db --remote --file verify-whatsapp.sql

echo ""
echo "🧹 Nettoyage des fichiers temporaires..."
rm -f insert-whatsapp-*.sql verify-whatsapp.sql process-whatsapp-members.js split-whatsapp-mappings.js execute-whatsapp-batches.sh

echo "✅ Migration WhatsApp terminée et fichiers nettoyés !"
