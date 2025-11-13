// ===== PAGE VIDEO EDIT - Admin MBA =====
// Page dédiée pour la création et modification des vidéos

import { getAdminLayout } from '../templates/layout.js';

export function getVideoEditPage(user, videoId = null) {
  const isEdit = videoId !== null;
  const pageTitle = isEdit ? 'Edit Video' : 'Add Video';
  
  const content = `
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 text-gradient">${pageTitle}</h1>
        <p class="text-muted mb-0">${isEdit ? 'Modifier les informations de la vidéo' : 'Créer une nouvelle vidéo'}</p>
      </div>
      <div class="d-flex gap-2">
        <a href="/videos" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>Back to Videos
        </a>
        <button class="btn btn-primary" onclick="saveVideo()">
          <i class="bi bi-save me-2"></i>Save Video
        </button>
      </div>
    </div>

    <!-- Alert -->
    <div id="alert" class="alert d-none"></div>

    <!-- Video Form -->
    <form id="videoForm">
      <input type="hidden" id="videoId" value="${videoId || ''}">
      
      <!-- Basic Information -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="bi bi-info-circle me-2"></i>Basic Information
          </h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label for="videoUrl" class="form-label">Video URL *</label>
              <input type="url" class="form-control" id="videoUrl" placeholder="https://youtube.com/watch?v=..." required>
            </div>
            <div class="col-md-3">
              <label for="videoSource" class="form-label">Source *</label>
              <select class="form-select" id="videoSource" required>
                <option value="">Select Source</option>
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="linkedin">LinkedIn</option>
                <option value="local">Local</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="videoStatus" class="form-label">Status *</label>
              <select class="form-select" id="videoStatus" required>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div class="row g-3 mt-3">
            <div class="col-md-6">
              <label for="videoSchool" class="form-label">School *</label>
              <select class="form-select" id="videoSchool" required>
                <option value="">Select School</option>
              </select>
            </div>
            <div class="col-md-6">
              <label for="videoPrograms" class="form-label">Programs</label>
              <select class="form-select" id="videoPrograms" multiple>
                <!-- Programs will be loaded here -->
              </select>
              <div class="form-text">Hold Ctrl/Cmd to select multiple programs</div>
            </div>
          </div>

          <div class="row g-3 mt-3">
            <div class="col-md-12">
              <label for="videoSpeakers" class="form-label">Speakers</label>
              <select class="form-select" id="videoSpeakers" multiple>
                <!-- Speakers will be loaded here -->
              </select>
              <div class="form-text">Hold Ctrl/Cmd to select multiple speakers</div>
            </div>
          </div>

          <div class="row g-3 mt-3">
            <div class="col-md-6">
              <label for="thumbnailUpload" class="form-label">Thumbnail Image</label>
              <div class="upload-container">
                <input type="file" class="form-control" id="thumbnailUpload" accept="image/*" onchange="handleThumbnailUpload(event)">
                <div class="upload-preview mt-2" id="thumbnailPreview" style="display: none;">
                  <img id="previewThumbnail" src="" alt="Thumbnail Preview" class="img-thumbnail" style="max-width: 200px; max-height: 150px;">
                  <div class="mt-2">
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeThumbnail()">Remove</button>
                  </div>
                </div>
                <div class="upload-progress mt-2" id="thumbnailUploadProgress" style="display: none;">
                  <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: 0%"></div>
                  </div>
                  <small class="text-muted">Uploading thumbnail...</small>
                </div>
              </div>
              <div class="mt-2">
                <label for="thumbnailUrl" class="form-label">Or Thumbnail URL</label>
                <input type="url" class="form-control" id="thumbnailUrl" placeholder="https://example.com/thumb.jpg">
              </div>
            </div>
            <div class="col-md-6">
              <label for="duration" class="form-label">Duration (seconds)</label>
              <input type="number" class="form-control" id="duration" placeholder="3600">
            </div>
          </div>
        </div>
      </div>

      <!-- Multilingual Content -->
      <div class="card mb-4">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-translate me-2"></i>Multilingual Content
            </h5>
            <button type="button" class="btn btn-outline-primary btn-sm" onclick="addLanguageTab()">
              <i class="bi bi-plus-lg me-1"></i>Add Language
            </button>
          </div>
        </div>
        <div class="card-body">
          <!-- Language Tabs -->
          <ul class="nav nav-tabs" id="languageTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <div class="nav-link active d-flex align-items-center justify-content-between" id="fr-tab" data-bs-toggle="tab" data-bs-target="#fr-content" role="tab" style="cursor: pointer;">
                <span>🇫🇷 Français</span>
                <span class="badge bg-primary ms-2" style="font-size: 0.7em;">Default</span>
              </div>
            </li>
          </ul>
          
          <!-- Tab Content -->
          <div class="tab-content" id="languageTabContent">
            <div class="tab-pane fade show active" id="fr-content" role="tabpanel">
              <div class="mt-3">
                <div class="mb-3">
                  <label for="titleFr" class="form-label">Title (FR) *</label>
                  <input type="text" class="form-control" id="titleFr" placeholder="Titre en français" required>
                </div>
                <div class="mb-3">
                  <label for="descriptionFr" class="form-label">Description (FR)</label>
                  <textarea class="form-control" id="descriptionFr" rows="4" placeholder="Description en français"></textarea>
                </div>
                <div class="mb-3">
                  <label for="subtitlesFr" class="form-label">Subtitles URL (FR)</label>
                  <input type="url" class="form-control" id="subtitlesFr" placeholder="https://example.com/subtitles.vtt">
                </div>
              </div>
            </div>
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
          <label for="videoTags" class="form-label">Select Tags</label>
          <select class="form-select" id="videoTags" multiple>
            <!-- Tags will be loaded here -->
          </select>
          <div class="form-text">Hold Ctrl/Cmd to select multiple tags</div>
        </div>
      </div>
    </form>
  `;

  const scripts = `
    let schools = [];
    let programs = [];
    let tags = [];
    let availableLanguages = [
      { code: 'fr', name: 'Français', flag: '🇫🇷', default: true },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'ar', name: 'العربية', flag: '🇲🇦' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'it', name: 'Italiano', flag: '🇮🇹' },
      { code: 'pt', name: 'Português', flag: '🇵🇹' },
      { code: 'ru', name: 'Русский', flag: '🇷🇺' },
      { code: 'zh', name: '中文', flag: '🇨🇳' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'ko', name: '한국어', flag: '🇰🇷' },
      { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
      { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
      { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
      { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
      { code: 'no', name: 'Norsk', flag: '🇳🇴' },
      { code: 'da', name: 'Dansk', flag: '🇩🇰' },
      { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
      { code: 'pl', name: 'Polski', flag: '🇵🇱' },
      { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
      { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
      { code: 'ro', name: 'Română', flag: '🇷🇴' },
      { code: 'bg', name: 'Български', flag: '🇧🇬' },
      { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
      { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
      { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
      { code: 'et', name: 'Eesti', flag: '🇪🇪' },
      { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
      { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
      { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
      { code: 'he', name: 'עברית', flag: '🇮🇱' },
      { code: 'th', name: 'ไทย', flag: '🇹🇭' },
      { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
      { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
      { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
      { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
      { code: 'uk', name: 'Українська', flag: '🇺🇦' },
      { code: 'be', name: 'Беларуская', flag: '🇧🇾' },
      { code: 'ka', name: 'ქართული', flag: '🇬🇪' },
      { code: 'hy', name: 'Հայերեն', flag: '🇦🇲' },
      { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
      { code: 'kk', name: 'Қазақша', flag: '🇰🇿' },
      { code: 'ky', name: 'Кыргызча', flag: '🇰🇬' },
      { code: 'uz', name: 'Oʻzbekcha', flag: '🇺🇿' },
      { code: 'tg', name: 'Тоҷикӣ', flag: '🇹🇯' },
      { code: 'mn', name: 'Монгол', flag: '🇲🇳' },
      { code: 'my', name: 'မြန်မာ', flag: '🇲🇲' },
      { code: 'km', name: 'ខ្មែរ', flag: '🇰🇭' },
      { code: 'lo', name: 'ລາວ', flag: '🇱🇦' },
      { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
      { code: 'ne', name: 'नेपाली', flag: '🇳🇵' },
      { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
      { code: 'ur', name: 'اردو', flag: '🇵🇰' },
      { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
      { code: 'ps', name: 'پښتو', flag: '🇦🇫' },
      { code: 'sd', name: 'سنڌي', flag: '🇵🇰' },
      { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
      { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
      { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
      { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
      { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
      { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
      { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
      { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
      { code: 'as', name: 'অসমীয়া', flag: '🇮🇳' },
      { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
      { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
      { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
      { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },
      { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
      { code: 'zu', name: 'IsiZulu', flag: '🇿🇦' },
      { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
      { code: 'xh', name: 'IsiXhosa', flag: '🇿🇦' },
      { code: 'st', name: 'Sesotho', flag: '🇿🇦' },
      { code: 'tn', name: 'Setswana', flag: '🇿🇦' },
      { code: 'ss', name: 'SiSwati', flag: '🇿🇦' },
      { code: 've', name: 'Tshivenḓa', flag: '🇿🇦' },
      { code: 'ts', name: 'Xitsonga', flag: '🇿🇦' },
      { code: 'nr', name: 'IsiNdebele', flag: '🇿🇦' },
      { code: 'nso', name: 'Sesotho sa Leboa', flag: '🇿🇦' }
    ];
    let addedLanguages = ['fr']; // Track added languages

    // Load data on page load
    document.addEventListener('DOMContentLoaded', function() {
      loadSchools();
      loadPrograms();
      loadTags();
      setupEventListeners();
      
      ${isEdit ? `loadVideoData();` : ''}
    });

    function setupEventListeners() {
      // School change updates programs and speakers
      document.getElementById('videoSchool').addEventListener('change', function() {
        updateProgramsAndSpeakersForSchool(this.value);
      });
    }

    async function loadSchools() {
      try {
        const response = await fetch('/api/schools');
        const result = await response.json();
        
        if (result.success) {
          schools = result.schools;
          populateSchoolSelect();
        }
      } catch (error) {
        console.error('Error loading schools:', error);
        showAlert('Error loading schools', 'danger');
      }
    }

    async function loadPrograms() {
      try {
        const response = await fetch('/api/programs');
        const result = await response.json();
        
        if (result.success) {
          programs = result.programs;
        }
      } catch (error) {
        console.error('Error loading programs:', error);
        showAlert('Error loading programs', 'danger');
      }
    }

    async function loadTags() {
      try {
        const response = await fetch('/api/video-tags');
        const result = await response.json();
        
        if (result.success) {
          tags = result.tags;
          populateTagsSelect();
        }
      } catch (error) {
        console.error('Error loading tags:', error);
        showAlert('Error loading tags', 'danger');
      }
    }

    function populateSchoolSelect() {
      const select = document.getElementById('videoSchool');
      select.innerHTML = '<option value="">Select School</option>';
      
      schools.forEach(school => {
        const option = document.createElement('option');
        option.value = school.id;
        option.textContent = school.name;
        select.appendChild(option);
      });
    }

    async function updateProgramsAndSpeakersForSchool(schoolId) {
      console.log('🔄 updateProgramsAndSpeakersForSchool called with schoolId:', schoolId);
      const programSelect = document.getElementById('videoPrograms');
      const speakerSelect = document.getElementById('videoSpeakers');
      
      // Clear both selects
      programSelect.innerHTML = '';
      speakerSelect.innerHTML = '';
      
      if (schoolId) {
        try {
          console.log('📡 Fetching school data for schoolId:', schoolId);
          // Fetch programs and speakers for this school
          const response = await fetch(\`/api/schools/\${schoolId}\`);
          const result = await response.json();
          
          console.log('📡 School data response:', result);
          
          if (result.success) {
            console.log('✅ School data loaded successfully');
            // Populate programs
            result.programs.forEach(program => {
              const option = document.createElement('option');
              option.value = program.id;
              option.textContent = program.title;
              programSelect.appendChild(option);
            });
            
            // Populate speakers
            result.speakers.forEach(speaker => {
              const option = document.createElement('option');
              option.value = speaker.id;
              option.textContent = \`\${speaker.first_name} \${speaker.last_name}\`;
              speakerSelect.appendChild(option);
            });
            console.log('✅ Programs and speakers populated');
          } else {
            console.error('❌ School data API failed:', result);
          }
        } catch (error) {
          console.error('❌ Error loading school data:', error);
          showAlert('Error loading school data', 'danger');
        }
      } else {
        console.log('⚠️ No schoolId provided');
      }
    }

    function populateTagsSelect() {
      const tagsSelect = document.getElementById('videoTags');
      tagsSelect.innerHTML = '';
      
      tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag.id;
        option.textContent = tag.name;
        tagsSelect.appendChild(option);
      });
    }

    ${isEdit ? `
    async function loadVideoData() {
      try {
        console.log('🎬 Loading video data for ID:', document.getElementById('videoId').value);
        const response = await fetch(\`/api/videos/\${document.getElementById('videoId').value}\`);
        const result = await response.json();
        
        console.log('🎬 Video data response:', result);
        
        if (result.success) {
          const video = result.video;
          console.log('✅ Video data loaded:', video);
          
          // Fill basic information
          document.getElementById('videoUrl').value = video.video_url;
          document.getElementById('videoSource').value = video.video_source;
          document.getElementById('videoStatus').value = video.status;
          document.getElementById('thumbnailUrl').value = video.thumbnail_url || '';
          document.getElementById('duration').value = video.duration_seconds || '';
          
          // Display existing thumbnail if available
          if (video.thumbnail_url) {
            document.getElementById('previewThumbnail').src = video.thumbnail_url;
            document.getElementById('thumbnailPreview').style.display = 'block';
          }
          
          console.log('🔄 Loading schools first...');
          // Load schools first to populate the select
          await loadSchools();
          
          // Set school value AFTER schools are loaded
          document.getElementById('videoSchool').value = video.school_id;
          console.log('✅ School value set to:', video.school_id, 'Current value:', document.getElementById('videoSchool').value);
          
          console.log('🔄 Loading programs and speakers for this school...');
          // Load programs and speakers for this school (to populate the selects)
          await updateProgramsAndSpeakersForSchool(video.school_id);
          
          console.log('🔄 Loading video-specific programs, speakers and translations...');
          // Load video-specific programs, speakers and translations (to pre-select them)
          await loadVideoPrograms(document.getElementById('videoId').value);
          await loadVideoSpeakers(document.getElementById('videoId').value);
          await loadVideoTranslations(document.getElementById('videoId').value);
          
          console.log('✅ Video data loading completed');
        } else {
          console.error('❌ Video data API failed:', result);
        }
      } catch (error) {
        console.error('❌ Error loading video data:', error);
        showAlert('Error loading video data', 'danger');
      }
    }

    async function loadVideoPrograms(videoId) {
      try {
        console.log('📚 Loading video programs for video:', videoId);
        const response = await fetch(\`/api/videos/\${videoId}/programs\`);
        const result = await response.json();
        
        console.log('📚 Video programs response:', result);
        
        if (result.success) {
          const videoPrograms = result.programs;
          console.log('📚 Found video programs:', videoPrograms);
          
          // Clear current selections
          const programSelect = document.getElementById('videoPrograms');
          Array.from(programSelect.options).forEach(option => option.selected = false);
          
          // Select the programs associated with this video
          videoPrograms.forEach(program => {
            const option = programSelect.querySelector(\`option[value="\${program.id}"]\`);
            if (option) {
              option.selected = true;
              console.log('📚 Selected program:', program.title);
            } else {
              console.log('📚 Program not found in select:', program.title, 'ID:', program.id);
            }
          });
          
          console.log('📚 Video programs loaded successfully');
        }
      } catch (error) {
        console.error('❌ Error loading video programs:', error);
      }
    }

    async function loadVideoSpeakers(videoId) {
      try {
        console.log('👥 Loading video speakers for video:', videoId);
        const response = await fetch(\`/api/videos/\${videoId}/speakers\`);
        const result = await response.json();
        
        console.log('👥 Video speakers response:', result);
        
        if (result.success) {
          const videoSpeakers = result.speakers;
          console.log('👥 Found video speakers:', videoSpeakers);
          
          // Clear current selections
          const speakerSelect = document.getElementById('videoSpeakers');
          Array.from(speakerSelect.options).forEach(option => option.selected = false);
          
          // Select the speakers associated with this video
          videoSpeakers.forEach(speaker => {
            const option = speakerSelect.querySelector(\`option[value="\${speaker.id}"]\`);
            if (option) {
              option.selected = true;
              console.log('👥 Selected speaker:', speaker.first_name, speaker.last_name);
            } else {
              console.log('👥 Speaker not found in select:', speaker.first_name, speaker.last_name, 'ID:', speaker.id);
            }
          });
          
          console.log('👥 Video speakers loaded successfully');
        }
      } catch (error) {
        console.error('❌ Error loading video speakers:', error);
      }
    }

    async function loadVideoTranslations(videoId) {
      try {
        console.log('🌍 Loading translations for video:', videoId);
        const response = await fetch(\`/api/videos/\${videoId}/translations\`);
        const result = await response.json();
        
        console.log('🌍 Translations response:', result);
        
        if (result.success) {
          const translations = result.translations;
          console.log('🌍 Found translations:', translations);
          
          // Add language tabs for existing translations
          translations.forEach(trans => {
            console.log('🌍 Processing translation:', trans.language);
            if (trans.language !== 'fr' && !addedLanguages.includes(trans.language)) {
              const language = availableLanguages.find(lang => lang.code === trans.language);
              if (language) {
                console.log('🌍 Adding language tab for:', trans.language);
                addedLanguages.push(trans.language);
                createLanguageTab(language);
              }
            }
          });
          
          console.log('🌍 Current addedLanguages:', addedLanguages);
          console.log('🌍 Setting language data...');
          // Set the data
          setLanguageData(translations);
          console.log('🌍 Language data set successfully');
        }
      } catch (error) {
        console.error('❌ Error loading translations:', error);
      }
    }
    ` : ''}

    async function saveVideo() {
      const formData = {
        id: document.getElementById('videoId').value,
        video_url: document.getElementById('videoUrl').value,
        video_source: document.getElementById('videoSource').value,
        status: document.getElementById('videoStatus').value,
        school_id: document.getElementById('videoSchool').value,
        program_ids: Array.from(document.getElementById('videoPrograms').selectedOptions).map(o => o.value),
        speaker_ids: Array.from(document.getElementById('videoSpeakers').selectedOptions).map(o => o.value),
        thumbnail_url: document.getElementById('thumbnailUrl').value || null,
        duration_seconds: document.getElementById('duration').value || null,
        translations: getLanguageData(),
        tags: Array.from(document.getElementById('videoTags').selectedOptions).map(o => o.value)
      };

      if (!formData.video_url || !formData.video_source || !formData.school_id) {
        showAlert('Please fill in all required fields', 'danger');
        return;
      }

      try {
        const url = formData.id ? \`/api/videos/\${formData.id}\` : '/api/videos';
        const method = formData.id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          showAlert(result.message, 'success');
          setTimeout(() => {
            window.location.href = '/videos';
          }, 1500);
        } else {
          showAlert(result.error, 'danger');
        }
      } catch (error) {
        console.error('Error saving video:', error);
        showAlert('Error saving video', 'danger');
      }
    }

    // Language management functions (same as in videos.js)
    function addLanguageTab() {
      showLanguageSelectionModal();
    }

    function showLanguageSelectionModal() {
      const availableLangs = availableLanguages.filter(lang => !addedLanguages.includes(lang.code));
      
      if (availableLangs.length === 0) {
        showAlert('All languages have been added', 'info');
        return;
      }

      const modalHtml = \`
        <div class="modal fade" id="languageSelectionModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Select Language</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <div class="row g-2">
                  \${availableLangs.map(lang => \`
                    <div class="col-md-6">
                      <button class="btn btn-outline-primary w-100" onclick="selectLanguage('\${lang.code}')">
                        \${lang.flag} \${lang.name}
                      </button>
                    </div>
                  \`).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      \`;

      // Remove existing modal if any
      const existingModal = document.getElementById('languageSelectionModal');
      if (existingModal) {
        existingModal.remove();
      }

      // Add modal to body
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      
      // Show modal
      const modal = new bootstrap.Modal(document.getElementById('languageSelectionModal'));
      modal.show();
    }

    function selectLanguage(langCode) {
      const language = availableLanguages.find(lang => lang.code === langCode);
      if (!language) return;

      // Add to added languages
      addedLanguages.push(langCode);

      // Create tab
      createLanguageTab(language);

      // Close modal
      bootstrap.Modal.getInstance(document.getElementById('languageSelectionModal')).hide();
    }

    function createLanguageTab(language) {
      const tabsContainer = document.getElementById('languageTabs');
      const contentContainer = document.getElementById('languageTabContent');

      // Create tab button
      const tabId = \`\${language.code}-tab\`;
      const contentId = \`\${language.code}-content\`;
      
      const tabHtml = \`
        <li class="nav-item" role="presentation">
          <div class="nav-link d-flex align-items-center justify-content-between" id="\${tabId}" data-bs-toggle="tab" data-bs-target="#\${contentId}" role="tab" style="cursor: pointer;">
            <span>\${language.flag} \${language.name}</span>
            <button type="button" class="btn btn-sm btn-outline-danger ms-2" onclick="confirmRemoveLanguage('\${language.code}')" title="Remove \${language.name} translation" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
              <i class="bi bi-x"></i>
            </button>
          </div>
        </li>
      \`;

      // Create content
      const contentHtml = \`
        <div class="tab-pane fade" id="\${contentId}" role="tabpanel">
          <div class="mt-3">
            <div class="mb-3">
              <label for="title\${language.code.toUpperCase()}" class="form-label">Title (\${language.code.toUpperCase()})</label>
              <input type="text" class="form-control" id="title\${language.code.toUpperCase()}" placeholder="\${language.name} title" oninput="updateTranslationStatus('\${language.code}')">
            </div>
            <div class="mb-3">
              <label for="description\${language.code.toUpperCase()}" class="form-label">Description (\${language.code.toUpperCase()})</label>
              <textarea class="form-control" id="description\${language.code.toUpperCase()}" rows="4" placeholder="\${language.name} description" oninput="updateTranslationStatus('\${language.code}')"></textarea>
            </div>
            <div class="mb-3">
              <label for="subtitles\${language.code.toUpperCase()}" class="form-label">Subtitles URL (\${language.code.toUpperCase()})</label>
              <input type="url" class="form-control" id="subtitles\${language.code.toUpperCase()}" placeholder="https://example.com/subtitles.vtt" oninput="updateTranslationStatus('\${language.code}')">
            </div>
          </div>
        </div>
      \`;

      // Add to DOM
      tabsContainer.insertAdjacentHTML('beforeend', tabHtml);
      contentContainer.insertAdjacentHTML('beforeend', contentHtml);

      // Activate the new tab
      const newTab = document.getElementById(tabId);
      const newContent = document.getElementById(contentId);
      
      // Remove active from other tabs
      document.querySelectorAll('#languageTabs .nav-link').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('#languageTabContent .tab-pane').forEach(content => {
        content.classList.remove('show', 'active');
      });

      // Activate new tab
      newTab.classList.add('active');
      newContent.classList.add('show', 'active');
    }

    function confirmRemoveLanguage(langCode) {
      if (langCode === 'fr') {
        showAlert('Cannot remove French language (default)', 'warning');
        return;
      }

      const language = availableLanguages.find(lang => lang.code === langCode);
      const languageName = language ? language.name : langCode.toUpperCase();

      // Check if there's any content in this translation
      const titleField = document.getElementById(\`title\${langCode.toUpperCase()}\`);
      const descriptionField = document.getElementById(\`description\${langCode.toUpperCase()}\`);
      const subtitlesField = document.getElementById(\`subtitles\${langCode.toUpperCase()}\`);
      
      const hasContent = (titleField && titleField.value.trim()) || 
                        (descriptionField && descriptionField.value.trim()) || 
                        (subtitlesField && subtitlesField.value.trim());

      let confirmMessage = \`Are you sure you want to remove the \${languageName} translation?\`;
      if (hasContent) {
        confirmMessage += \`\\n\\n⚠️ This translation contains content that will be lost!\`;
      }

      if (confirm(confirmMessage)) {
        removeLanguageTab(langCode);
        showAlert(\`\${languageName} translation removed\`, 'info');
      }
    }

    function removeLanguageTab(langCode) {
      if (langCode === 'fr') {
        showAlert('Cannot remove French language (default)', 'warning');
        return;
      }

      // Remove from added languages
      addedLanguages = addedLanguages.filter(code => code !== langCode);

      // Remove tab and content with animation
      const tabId = \`\${langCode}-tab\`;
      const contentId = \`\${langCode}-content\`;
      
      const tabElement = document.getElementById(tabId).parentElement;
      const contentElement = document.getElementById(contentId);
      
      // Add fade out animation
      tabElement.style.transition = 'opacity 0.3s ease';
      contentElement.style.transition = 'opacity 0.3s ease';
      tabElement.style.opacity = '0';
      contentElement.style.opacity = '0';
      
      setTimeout(() => {
        tabElement.remove();
        contentElement.remove();
        
        // Activate French tab if no other tabs
        if (addedLanguages.length === 1 && addedLanguages[0] === 'fr') {
          document.getElementById('fr-tab').classList.add('active');
          document.getElementById('fr-content').classList.add('show', 'active');
        }
      }, 300);
    }

    function updateTranslationStatus(langCode) {
      // Special handling for French (camelCase) vs other languages (UPPERCASE)
      const fieldSuffix = langCode === 'fr' ? 'Fr' : langCode.toUpperCase();
      
      const titleField = document.getElementById(\`title\${fieldSuffix}\`);
      const descriptionField = document.getElementById(\`description\${fieldSuffix}\`);
      const subtitlesField = document.getElementById(\`subtitles\${fieldSuffix}\`);
      
      const hasContent = (titleField && titleField.value.trim()) || 
                        (descriptionField && descriptionField.value.trim()) || 
                        (subtitlesField && subtitlesField.value.trim());
      
      const tabElement = document.getElementById(\`\${langCode}-tab\`);
      if (tabElement) {
        // Remove existing status indicators
        const existingBadge = tabElement.querySelector('.badge');
        if (existingBadge && !existingBadge.textContent.includes('Default')) {
          existingBadge.remove();
        }
        
        // Add status indicator
        if (hasContent) {
          const statusBadge = document.createElement('span');
          statusBadge.className = 'badge bg-success ms-2';
          statusBadge.style.fontSize = '0.7em';
          statusBadge.textContent = '✓';
          statusBadge.title = 'Translation has content';
          tabElement.appendChild(statusBadge);
        } else {
          const statusBadge = document.createElement('span');
          statusBadge.className = 'badge bg-warning ms-2';
          statusBadge.style.fontSize = '0.7em';
          statusBadge.textContent = '○';
          statusBadge.title = 'Empty translation';
          tabElement.appendChild(statusBadge);
        }
      }
    }

    function getLanguageData() {
      const translations = [];
      
      addedLanguages.forEach(langCode => {
        // Special handling for French (camelCase) vs other languages (UPPERCASE)
        const fieldSuffix = langCode === 'fr' ? 'Fr' : langCode.toUpperCase();
        
        const titleField = document.getElementById(\`title\${fieldSuffix}\`);
        const descriptionField = document.getElementById(\`description\${fieldSuffix}\`);
        const subtitlesField = document.getElementById(\`subtitles\${fieldSuffix}\`);
        
        // Always include French (default language) even if empty
        // For other languages, only include if they have a title
        const shouldInclude = (langCode === 'fr') || (titleField && titleField.value.trim());
        
        if (shouldInclude) {
          translations.push({
            language: langCode,
            title: titleField ? titleField.value.trim() : '',
            description: descriptionField ? descriptionField.value.trim() : '',
            subtitles_url: subtitlesField ? subtitlesField.value.trim() : null
          });
        }
      });
      
      return translations;
    }

    function setLanguageData(translations) {
      console.log('🌍 setLanguageData called with:', translations);
      console.log('🌍 Current addedLanguages:', addedLanguages);
      
      // Clear all language fields first
      addedLanguages.forEach(langCode => {
        const titleField = document.getElementById(\`title\${langCode.toUpperCase()}\`);
        const descriptionField = document.getElementById(\`description\${langCode.toUpperCase()}\`);
        const subtitlesField = document.getElementById(\`subtitles\${langCode.toUpperCase()}\`);
        
        if (titleField) titleField.value = '';
        if (descriptionField) descriptionField.value = '';
        if (subtitlesField) subtitlesField.value = '';
      });

      // Set data from translations
      translations.forEach(trans => {
        const langCode = trans.language;
        console.log('🌍 Setting data for language:', langCode, 'Title:', trans.title);
        
        // Special handling for French (camelCase) vs other languages (UPPERCASE)
        const fieldSuffix = langCode === 'fr' ? 'Fr' : langCode.toUpperCase();
        
        const titleField = document.getElementById(\`title\${fieldSuffix}\`);
        const descriptionField = document.getElementById(\`description\${fieldSuffix}\`);
        const subtitlesField = document.getElementById(\`subtitles\${fieldSuffix}\`);
        
        console.log('🌍 Found fields for', langCode, ':', {
          titleField: !!titleField,
          descriptionField: !!descriptionField,
          subtitlesField: !!subtitlesField
        });
        
        if (titleField) {
          titleField.value = trans.title || '';
          console.log('🌍 Set title field value:', titleField.value);
        }
        if (descriptionField) descriptionField.value = trans.description || '';
        if (subtitlesField) subtitlesField.value = trans.subtitles_url || '';
        
        // Update status indicator
        updateTranslationStatus(langCode);
      });
    }

    // Thumbnail upload functions
    async function handleThumbnailUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showAlert('Type de fichier non autorisé. Seuls JPEG, PNG, GIF et WebP sont acceptés.', 'danger');
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        showAlert('Fichier trop volumineux. Taille maximum : 5MB.', 'danger');
        return;
      }

      const preview = document.getElementById('thumbnailPreview');
      const previewImage = document.getElementById('previewThumbnail');
      const reader = new FileReader();
      
      reader.onload = function(e) {
        previewImage.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);

      await uploadThumbnailToR2(file);
    }

    async function uploadThumbnailToR2(file) {
      const progressContainer = document.getElementById('thumbnailUploadProgress');
      const progressBar = progressContainer.querySelector('.progress-bar');
      
      try {
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';

        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress > 90) progress = 90;
          progressBar.style.width = progress + '%';
        }, 200);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'images'); // Utiliser le dossier 'images' pour les thumbnails

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        clearInterval(progressInterval);
        progressBar.style.width = '100%';

        if (result.success) {
          document.getElementById('thumbnailUrl').value = result.url;
          showAlert('Thumbnail uploadé avec succès !', 'success');
          setTimeout(() => {
            progressContainer.style.display = 'none';
          }, 1000);
        } else {
          showAlert('Erreur lors de l\\'upload : ' + result.error, 'danger');
          progressContainer.style.display = 'none';
        }

      } catch (error) {
        console.error('Erreur upload thumbnail:', error);
        showAlert('Erreur lors de l\\'upload de la thumbnail', 'danger');
        progressContainer.style.display = 'none';
      }
    }

    function removeThumbnail() {
      document.getElementById('thumbnailUpload').value = '';
      document.getElementById('thumbnailUrl').value = '';
      document.getElementById('thumbnailPreview').style.display = 'none';
      document.getElementById('thumbnailUploadProgress').style.display = 'none';
    }

    function showAlert(message, type) {
      const alertDiv = document.getElementById('alert');
      alertDiv.textContent = message;
      alertDiv.className = 'alert alert-' + type;
      alertDiv.classList.remove('d-none');
      setTimeout(() => {
        alertDiv.classList.add('d-none');
      }, 5000);
    }

    // Make functions globally accessible
    window.saveVideo = saveVideo;
    window.addLanguageTab = addLanguageTab;
    window.showLanguageSelectionModal = showLanguageSelectionModal;
    window.selectLanguage = selectLanguage;
    window.createLanguageTab = createLanguageTab;
    window.removeLanguageTab = removeLanguageTab;
    window.confirmRemoveLanguage = confirmRemoveLanguage;
    window.updateTranslationStatus = updateTranslationStatus;
    window.getLanguageData = getLanguageData;
    window.setLanguageData = setLanguageData;
    window.handleThumbnailUpload = handleThumbnailUpload;
    window.uploadThumbnailToR2 = uploadThumbnailToR2;
    window.removeThumbnail = removeThumbnail;
    window.loadVideoSpeakers = loadVideoSpeakers;
    window.showAlert = showAlert;
  `;

  const styles = `
    <style>
      .nav-tabs .nav-link {
        border: 1px solid transparent;
        border-top-left-radius: 0.375rem;
        border-top-right-radius: 0.375rem;
        transition: all 0.3s ease;
      }
      
      .nav-tabs .nav-link:hover {
        border-color: #e9ecef #e9ecef #dee2e6;
        background-color: #f8f9fa;
      }
      
      .nav-tabs .nav-link.active {
        color: #495057;
        background-color: #fff;
        border-color: #dee2e6 #dee2e6 #fff;
      }
      
      .nav-tabs .nav-link .btn-outline-danger {
        opacity: 0.7;
        transition: opacity 0.3s ease;
      }
      
      .nav-tabs .nav-link:hover .btn-outline-danger {
        opacity: 1;
      }
      
      .translation-status-badge {
        font-size: 0.7em;
        padding: 0.25em 0.5em;
      }
      
      .tab-content {
        border: 1px solid #dee2e6;
        border-top: none;
        border-radius: 0 0 0.375rem 0.375rem;
        padding: 1rem;
        background-color: #fff;
      }
      
      .form-control:focus {
        border-color: #86b7fe;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
      }
      
      .btn-outline-danger:hover {
        transform: scale(1.1);
      }
    </style>
  `;

  return getAdminLayout(pageTitle, content, '/videos', user) + styles + `<script>${scripts}</script>`;
}

