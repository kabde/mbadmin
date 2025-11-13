// ===== PAGE COURSE EDIT - Admin MBA =====
// Page dédiée pour la création et modification des cours

import { getAdminLayout } from '../templates/layout.js';

export function getCourseEditPage(user, courseId = null) {
  const isEdit = courseId !== null;
  const pageTitle = isEdit ? 'Modifier le Cours' : 'Nouveau Cours';
  
  const content = `
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 text-gradient">${pageTitle}</h1>
        <p class="text-muted mb-0">${isEdit ? 'Modifier les informations du cours' : 'Créer un nouveau cours'}</p>
      </div>
      <div class="d-flex gap-2">
        <a href="/courses" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>Retour aux Cours
        </a>
        <button class="btn btn-primary" onclick="saveCourse()">
          <i class="bi bi-save me-2"></i>Sauvegarder
        </button>
      </div>
    </div>

    <!-- Alert -->
    <div id="alert" class="alert d-none"></div>

    <!-- Course Form -->
    <form id="courseForm">
      <input type="hidden" id="courseId" value="${courseId || ''}">
      
      <!-- Basic Information -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="bi bi-info-circle me-2"></i>Informations de Base
          </h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label for="courseTitle" class="form-label">Titre du Cours *</label>
              <input type="text" class="form-control" id="courseTitle" placeholder="Titre du cours" required>
            </div>
            <div class="col-md-3">
              <label for="courseSchool" class="form-label">École *</label>
              <select class="form-select" id="courseSchool" required>
                <option value="">Sélectionner une école</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="courseStatus" class="form-label">Statut *</label>
              <select class="form-select" id="courseStatus" required>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
            <div class="col-12">
              <label for="courseDescription" class="form-label">Description</label>
              <textarea class="form-control" id="courseDescription" rows="3" placeholder="Description du cours"></textarea>
            </div>
            <div class="col-md-3">
              <label for="courseDifficulty" class="form-label">Difficulté</label>
              <select class="form-select" id="courseDifficulty">
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="courseDuration" class="form-label">Durée (minutes)</label>
              <input type="number" class="form-control" id="courseDuration" placeholder="90" min="0">
            </div>
            <div class="col-md-3">
              <label for="courseLanguage" class="form-label">Langue</label>
              <select class="form-select" id="courseLanguage">
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
                <option value="ar">Arabe</option>
              </select>
            </div>
            <div class="col-md-3">
              <div class="form-check mt-4">
                <input class="form-check-input" type="checkbox" id="courseFeatured">
                <label class="form-check-label" for="courseFeatured">
                  Cours en vedette
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="bi bi-file-text me-2"></i>Contenu du Cours
          </h5>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="courseContent" class="form-label">Contenu HTML</label>
            <textarea class="form-control quill-editor" id="courseContent" rows="15" placeholder="Contenu HTML du cours..."></textarea>
            <div class="form-text">Vous pouvez utiliser du HTML pour formater le contenu du cours.</div>
          </div>
        </div>
      </div>

      <!-- Programs -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="bi bi-book me-2"></i>Programmes Associés
          </h5>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="coursePrograms" class="form-label">Sélectionner les programmes</label>
            <select class="form-select" id="coursePrograms" multiple>
              <!-- Options will be loaded dynamically -->
            </select>
            <div class="form-text">Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs programmes.</div>
          </div>
        </div>
      </div>

      <!-- Speakers -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="bi bi-people me-2"></i>Formateurs Associés
          </h5>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="courseSpeakers" class="form-label">Sélectionner les formateurs</label>
            <select class="form-select" id="courseSpeakers" multiple>
              <!-- Options will be loaded dynamically -->
            </select>
            <div class="form-text">Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs formateurs.</div>
          </div>
        </div>
      </div>

      <!-- Tags -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="bi bi-tags me-2"></i>Tags
          </h5>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="courseTags" class="form-label">Tags existants</label>
            <select class="form-select" id="courseTags" multiple>
              <!-- Options will be loaded dynamically -->
            </select>
            <div class="form-text">Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs tags.</div>
          </div>
          <div class="mb-3">
            <label for="newTag" class="form-label">Nouveau tag</label>
            <div class="input-group">
              <input type="text" class="form-control" id="newTag" placeholder="Nom du nouveau tag">
              <button class="btn btn-outline-secondary" type="button" onclick="addNewTag()">
                <i class="bi bi-plus"></i> Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Module -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="bi bi-collection me-2"></i>Module Associé
          </h5>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="courseModule" class="form-label">Sélectionner le module</label>
            <select class="form-select" id="courseModule">
              <option value="">Aucun module</option>
              <!-- Options will be loaded dynamically -->
            </select>
          </div>
        </div>
      </div>
    </form>

    <script>
      let currentCourse = null;
      let allPrograms = [];
      let allSpeakers = [];
      let allTags = [];
      let allModules = [];

      // Load data on page load
      document.addEventListener('DOMContentLoaded', async function() {
        const courseId = document.getElementById('courseId').value;
        
        // Load all data first
        await loadSchools();
        await loadPrograms();
        await loadSpeakers();
        await loadTags();
        await loadModules();
        
        // Then load course data if editing
        if (courseId) {
          await loadCourse(courseId);
        }
      });

      async function loadSchools() {
        try {
          const response = await fetch('/api/schools');
          const data = await response.json();
          
          if (data.success && data.schools) {
            const select = document.getElementById('courseSchool');
            select.innerHTML = '<option value="">Sélectionner une école</option>';
            
            data.schools.forEach(school => {
              const option = document.createElement('option');
              option.value = school.id;
              option.textContent = school.name;
              select.appendChild(option);
            });
          }
        } catch (error) {
          console.error('Error loading schools:', error);
        }
      }

      async function loadPrograms() {
        try {
          const response = await fetch('/api/programs');
          const data = await response.json();
          
          if (data.success && data.programs) {
            allPrograms = data.programs;
            const select = document.getElementById('coursePrograms');
            select.innerHTML = '';
            
            data.programs.forEach(program => {
              const option = document.createElement('option');
              option.value = program.id;
              option.textContent = program.title;
              select.appendChild(option);
            });
          }
        } catch (error) {
          console.error('Error loading programs:', error);
        }
      }

      async function loadSpeakers() {
        try {
          const response = await fetch('/api/speakers');
          const data = await response.json();
          
          if (data.success && data.speakers) {
            allSpeakers = data.speakers;
            const select = document.getElementById('courseSpeakers');
            select.innerHTML = '';
            
            data.speakers.forEach(speaker => {
              const option = document.createElement('option');
              option.value = speaker.id;
              option.textContent = speaker.first_name + ' ' + speaker.last_name;
              select.appendChild(option);
            });
          }
        } catch (error) {
          console.error('Error loading speakers:', error);
        }
      }

      async function loadTags() {
        try {
          const response = await fetch('/api/tags');
          const data = await response.json();
          
          if (data.success && data.tags) {
            allTags = data.tags;
            const select = document.getElementById('courseTags');
            select.innerHTML = '';
            
            data.tags.forEach(tag => {
              const option = document.createElement('option');
              option.value = tag.id;
              option.textContent = tag.name;
              select.appendChild(option);
            });
          }
        } catch (error) {
          console.error('Error loading tags:', error);
        }
      }

      async function loadModules() {
        try {
          const response = await fetch('/api/modules');
          const data = await response.json();
          
          if (data.success && data.modules) {
            allModules = data.modules;
            const select = document.getElementById('courseModule');
            select.innerHTML = '<option value="">Aucun module</option>';
            
            data.modules.forEach(module => {
              const option = document.createElement('option');
              option.value = module.id;
              option.textContent = module.title;
              select.appendChild(option);
            });
          }
        } catch (error) {
          console.error('Error loading modules:', error);
        }
      }

      async function loadCourse(courseId) {
        try {
          const response = await fetch('/api/courses');
          const data = await response.json();
          
          if (data.success && data.courses) {
            const course = data.courses.find(c => c.id == courseId);
            
            if (course) {
              currentCourse = course;
              console.log('🔍 Course found:', course);
              populateForm(course);
            } else {
              showAlert('Cours non trouvé', 'danger');
            }
          }
        } catch (error) {
          console.error('Error loading course:', error);
          showAlert('Erreur lors du chargement du cours', 'danger');
        }
      }

      function populateForm(course) {
        console.log('🔍 Populating form with course:', course);
        
        document.getElementById('courseTitle').value = course.title || '';
        document.getElementById('courseSchool').value = course.school_id || '';
        document.getElementById('courseStatus').value = course.status || 'draft';
        document.getElementById('courseDescription').value = course.description || '';
        document.getElementById('courseDifficulty').value = course.difficulty_level || 'beginner';
        document.getElementById('courseDuration').value = course.estimated_duration || '';
        document.getElementById('courseLanguage').value = course.language || 'fr';
        document.getElementById('courseFeatured').checked = course.is_featured || false;
        // Set content for Quill editor
        const contentTextarea = document.getElementById('courseContent');
        contentTextarea.value = course.content || '';
        
        // Wait for Quill to be initialized and then update it
        setTimeout(() => {
          const quillContainer = contentTextarea.parentNode.querySelector('.ql-editor');
          if (quillContainer) {
            quillContainer.innerHTML = course.content || '';
            console.log('🔍 Quill content updated:', course.content);
          } else {
            console.log('🔍 Quill container not found, trying again...');
            // Try again after a longer delay
            setTimeout(() => {
              const quillContainer2 = contentTextarea.parentNode.querySelector('.ql-editor');
              if (quillContainer2) {
                quillContainer2.innerHTML = course.content || '';
                console.log('🔍 Quill content updated (retry):', course.content);
              }
            }, 500);
          }
        }, 100);

        // Set programs
        if (course.programs) {
          console.log('🔍 Setting programs:', course.programs);
          const programNames = course.programs.split(',').map(p => p.trim());
          const programSelect = document.getElementById('coursePrograms');
          console.log('🔍 Program select options:', Array.from(programSelect.options).map(o => o.textContent));
          
          Array.from(programSelect.options).forEach(option => {
            option.selected = programNames.includes(option.textContent);
            if (programNames.includes(option.textContent)) {
              console.log('✅ Selected program:', option.textContent);
            }
          });
        }

        // Set speakers
        if (course.speakers) {
          console.log('🔍 Setting speakers:', course.speakers);
          const speakerNames = course.speakers.split(',').map(s => s.trim());
          const speakerSelect = document.getElementById('courseSpeakers');
          console.log('🔍 Speaker select options:', Array.from(speakerSelect.options).map(o => o.textContent));
          
          Array.from(speakerSelect.options).forEach(option => {
            option.selected = speakerNames.includes(option.textContent);
            if (speakerNames.includes(option.textContent)) {
              console.log('✅ Selected speaker:', option.textContent);
            }
          });
        }

        // Set tags
        if (course.tags) {
          console.log('🔍 Setting tags:', course.tags);
          const tagNames = course.tags.split(',').map(t => t.trim());
          const tagSelect = document.getElementById('courseTags');
          
          Array.from(tagSelect.options).forEach(option => {
            option.selected = tagNames.includes(option.textContent);
          });
        }

        // Set module
        if (course.modules) {
          console.log('🔍 Setting module:', course.modules);
          const moduleName = course.modules.split(',')[0].trim();
          const moduleSelect = document.getElementById('courseModule');
          
          Array.from(moduleSelect.options).forEach(option => {
            if (option.textContent === moduleName) {
              option.selected = true;
            }
          });
        }
      }

      async function saveCourse() {
        try {
          const courseId = document.getElementById('courseId').value;
          const isEdit = courseId !== '';

          const formData = {
            school_id: document.getElementById('courseSchool').value,
            title: document.getElementById('courseTitle').value,
            description: document.getElementById('courseDescription').value,
            content: document.getElementById('courseContent').value,
            status: document.getElementById('courseStatus').value,
            difficulty_level: document.getElementById('courseDifficulty').value,
            estimated_duration: parseInt(document.getElementById('courseDuration').value) || 0,
            language: document.getElementById('courseLanguage').value,
            is_featured: document.getElementById('courseFeatured').checked,
            programs: Array.from(document.getElementById('coursePrograms').selectedOptions).map(o => ({ program_id: parseInt(o.value) })),
            speakers: Array.from(document.getElementById('courseSpeakers').selectedOptions).map(o => ({ speaker_id: parseInt(o.value) })),
            tags: Array.from(document.getElementById('courseTags').selectedOptions).map(o => o.textContent),
            module_id: document.getElementById('courseModule').value || null
          };

          const url = isEdit ? '/api/courses/' + courseId : '/api/courses';
          const method = isEdit ? 'PUT' : 'POST';

          const response = await fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });

          const data = await response.json();

          if (data.success) {
            showAlert(isEdit ? 'Cours modifié avec succès' : 'Cours créé avec succès', 'success');
            setTimeout(() => {
              window.location.href = '/courses';
            }, 1500);
          } else {
            showAlert(data.error || 'Erreur lors de la sauvegarde', 'danger');
          }
        } catch (error) {
          console.error('Error saving course:', error);
          showAlert('Erreur lors de la sauvegarde', 'danger');
        }
      }

      function addNewTag() {
        const newTagInput = document.getElementById('newTag');
        const tagName = newTagInput.value.trim();
        
        if (tagName) {
          // Add to select
          const tagSelect = document.getElementById('courseTags');
          const option = document.createElement('option');
          option.value = 'new_' + Date.now();
          option.textContent = tagName;
          option.selected = true;
          tagSelect.appendChild(option);
          
          newTagInput.value = '';
          showAlert('Tag ajouté: ' + tagName, 'success');
        }
      }

      function showAlert(message, type) {
        const alert = document.getElementById('alert');
        alert.className = 'alert alert-' + type;
        alert.textContent = message;
        alert.classList.remove('d-none');
        
        setTimeout(() => {
          alert.classList.add('d-none');
        }, 5000);
      }
    </script>
  `;

  return getAdminLayout(pageTitle, content, '/courses', user);
}
