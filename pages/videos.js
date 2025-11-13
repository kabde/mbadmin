// ===== PAGE VIDEOS - Admin MBA =====
// Page de gestion des vidéos avec support multilingue

import { getAdminLayout } from '../templates/layout.js';

export function getVideosPage(user) {
  const content = `
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 text-gradient">Video Management</h1>
        <p class="text-muted mb-0">Gérer les vidéos avec support multilingue</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" onclick="refreshVideos()">
          <i class="bi bi-arrow-clockwise me-2"></i>Refresh
        </button>
        <a href="/videos/add" class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i>Add Video
        </a>
      </div>
    </div>

    <!-- Alert -->
    <div id="alert" class="alert d-none"></div>

    <!-- Filters -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <label for="schoolFilter" class="form-label">School</label>
        <select class="form-select" id="schoolFilter" onchange="filterVideos()">
          <option value="">All Schools</option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="programFilter" class="form-label">Program</label>
        <select class="form-select" id="programFilter" onchange="filterVideos()">
          <option value="">All Programs</option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="statusFilter" class="form-label">Status</label>
        <select class="form-select" id="statusFilter" onchange="filterVideos()">
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="languageFilter" class="form-label">Language</label>
        <select class="form-select" id="languageFilter" onchange="filterVideos()">
          <option value="">All Languages</option>
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </div>
    </div>

    <!-- Videos Table -->
    <div class="card shadow-sm">
      <div class="card-header bg-white">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="card-title mb-0">Videos List</h5>
          </div>
          <div class="col-auto">
            <div class="input-group" style="max-width: 300px;">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input type="text" class="form-control" id="searchVideos" placeholder="Search videos...">
            </div>
          </div>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>School</th>
                <th>Program</th>
                <th>Languages</th>
                <th>Speakers</th>
                <th>Status</th>
                <th>Views</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="videosTableBody">
              <!-- Videos will be loaded here -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Video Modal -->
    <div class="modal fade" id="videoModal" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="videoModalTitle">Add Video</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="videoForm">
              <input type="hidden" id="videoId">
              
              <!-- Basic Information -->
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label for="videoUrl" class="form-label">Video URL</label>
                  <input type="url" class="form-control" id="videoUrl" placeholder="https://youtube.com/watch?v=..." required>
                </div>
                <div class="col-md-3">
                  <label for="videoSource" class="form-label">Source</label>
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
                  <label for="videoStatus" class="form-label">Status</label>
                  <select class="form-select" id="videoStatus" required>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label for="videoSchool" class="form-label">School</label>
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

              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label for="thumbnailUrl" class="form-label">Thumbnail URL</label>
                  <input type="url" class="form-control" id="thumbnailUrl" placeholder="https://example.com/thumb.jpg">
                </div>
                <div class="col-md-6">
                  <label for="duration" class="form-label">Duration (seconds)</label>
                  <input type="number" class="form-control" id="duration" placeholder="3600">
                </div>
              </div>

              <!-- Multilingual Content -->
              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="fw-bold mb-0">Multilingual Content</h6>
                  <button type="button" class="btn btn-outline-primary btn-sm" onclick="addLanguageTab()">
                    <i class="bi bi-plus-lg me-1"></i>Add Language
                  </button>
                </div>
                
                <!-- Language Tabs -->
                <ul class="nav nav-tabs" id="languageTabs" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="fr-tab" data-bs-toggle="tab" data-bs-target="#fr-content" type="button" role="tab">
                      🇫🇷 Français
                    </button>
                  </li>
                </ul>
                
                <!-- Tab Content -->
                <div class="tab-content" id="languageTabContent">
                  <div class="tab-pane fade show active" id="fr-content" role="tabpanel">
                    <div class="card">
                      <div class="card-body">
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
              <div class="mb-4">
                <label for="videoTags" class="form-label">Tags</label>
                <select class="form-select" id="videoTags" multiple>
                  <!-- Tags will be loaded here -->
                </select>
                <div class="form-text">Hold Ctrl/Cmd to select multiple tags</div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="saveVideo()">Save Video</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this video? This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" onclick="confirmDelete()">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const scripts = `
    let videos = [];
    let schools = [];
    let programs = [];
    let tags = [];
    let deleteVideoId = null;
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
      loadVideos();
      setupEventListeners();
    });

    function setupEventListeners() {
      // Search functionality
      document.getElementById('searchVideos').addEventListener('input', function(e) {
        filterVideos();
      });

      // School change updates programs
      document.getElementById('videoSchool').addEventListener('change', function() {
        updateProgramsForSchool(this.value);
      });
    }

    async function loadSchools() {
      try {
        const response = await fetch('/api/schools');
        const result = await response.json();
        
        if (result.success) {
          schools = result.schools;
          populateSchoolSelects();
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
          populateProgramSelects();
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

    async function loadVideos() {
      try {
        const response = await fetch('/api/videos');
        const result = await response.json();
        
        if (result.success) {
          videos = result.videos;
          renderVideosTable();
        }
      } catch (error) {
        console.error('Error loading videos:', error);
        showAlert('Error loading videos', 'danger');
      }
    }

    function populateSchoolSelects() {
      // Filter dropdown
      const filterSelect = document.getElementById('schoolFilter');
      filterSelect.innerHTML = '<option value="">All Schools</option>';
      
      // Modal dropdown
      const modalSelect = document.getElementById('videoSchool');
      modalSelect.innerHTML = '<option value="">Select School</option>';
      
      schools.forEach(school => {
        const option1 = document.createElement('option');
        option1.value = school.id;
        option1.textContent = school.name;
        filterSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = school.id;
        option2.textContent = school.name;
        modalSelect.appendChild(option2);
      });
    }

    function populateProgramSelects() {
      // Filter dropdown
      const filterSelect = document.getElementById('programFilter');
      filterSelect.innerHTML = '<option value="">All Programs</option>';
      
      programs.forEach(program => {
        const option = document.createElement('option');
        option.value = program.id;
        option.textContent = program.title;
        filterSelect.appendChild(option);
      });
    }

    function updateProgramsForSchool(schoolId) {
      const programSelect = document.getElementById('videoPrograms');
      programSelect.innerHTML = '';
      
      if (schoolId) {
        const schoolPrograms = programs.filter(p => p.school_id == schoolId);
        schoolPrograms.forEach(program => {
          const option = document.createElement('option');
          option.value = program.id;
          option.textContent = program.title;
          programSelect.appendChild(option);
        });
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

    function renderVideosTable() {
      const tbody = document.getElementById('videosTableBody');
      tbody.innerHTML = '';

      videos.forEach(video => {
        const languages = video.languages || [];
        const programs = video.programs || [];
        const speakers = video.speakers || [];
        
        // Formater les programmes
        const formattedPrograms = programs.filter(p => p.trim()).join(', ') || '-';
        
        // Formater les speakers
        const formattedSpeakers = speakers.filter(s => s.trim()).join(', ') || '-';
        
        const row = document.createElement('tr');
        row.innerHTML = \`
          <td>
            <img src="\${video.thumbnail_url || '/placeholder-thumb.jpg'}" 
                 class="rounded" style="width: 60px; height: 40px; object-fit: cover;" 
                 alt="Thumbnail">
          </td>
          <td>
            <div class="fw-bold">\${video.title || 'No title'}</div>
            <small class="text-muted">\${video.video_source}</small>
          </td>
          <td>\${video.school_name || 'Unknown'}</td>
          <td>\${formattedPrograms}</td>
          <td>
            \${languages.map(lang => \`<span class="badge bg-info me-1">\${lang.toUpperCase()}</span>\`).join('')}
          </td>
          <td>\${formattedSpeakers}</td>
          <td>
            <span class="badge \${getStatusBadgeClass(video.status)}">\${video.status}</span>
          </td>
          <td>\${video.views_count || 0}</td>
          <td>\${new Date(video.created_at).toLocaleDateString()}</td>
          <td>
            <div class="btn-group btn-group-sm">
              <a href="/videos/edit/\${video.id}" class="btn btn-outline-primary" title="Edit">
                <i class="bi bi-pencil"></i>
              </a>
              <button class="btn btn-outline-danger" onclick="deleteVideo(\${video.id})" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        \`;
        tbody.appendChild(row);
      });
    }

    function getStatusBadgeClass(status) {
      switch (status) {
        case 'published': return 'bg-success';
        case 'draft': return 'bg-warning';
        case 'archived': return 'bg-secondary';
        default: return 'bg-secondary';
      }
    }

    function filterVideos() {
      const schoolFilter = document.getElementById('schoolFilter').value;
      const programFilter = document.getElementById('programFilter').value;
      const statusFilter = document.getElementById('statusFilter').value;
      const languageFilter = document.getElementById('languageFilter').value;
      const searchTerm = document.getElementById('searchVideos').value.toLowerCase();

      let filtered = videos.filter(video => {
        const school = schools.find(s => s.id === video.school_id);
        const videoPrograms = video.programs || [];
        const languages = video.languages || [];
        
        // School filter
        const schoolMatch = !schoolFilter || video.school_id == schoolFilter;
        
        // Program filter - check if any of the video's programs match
        const programMatch = !programFilter || videoPrograms.some(program => 
          programs.find(p => p.title === program && p.id == programFilter)
        );
        
        // Status filter
        const statusMatch = !statusFilter || video.status === statusFilter;
        
        // Language filter - check if video has the selected language
        const languageMatch = !languageFilter || languages.includes(languageFilter);
        
        // Search filter
        const searchMatch = !searchTerm || 
          (video.title && video.title.toLowerCase().includes(searchTerm)) ||
          (school && school.name.toLowerCase().includes(searchTerm)) ||
          videoPrograms.some(program => program.toLowerCase().includes(searchTerm)) ||
          (video.speakers && video.speakers.some(speaker => speaker.toLowerCase().includes(searchTerm)));
        
        return schoolMatch && programMatch && statusMatch && languageMatch && searchMatch;
      });

      // Re-render table with filtered results
      const tbody = document.getElementById('videosTableBody');
      tbody.innerHTML = '';

      filtered.forEach(video => {
        const videoPrograms = video.programs || [];
        const speakers = video.speakers || [];
        const languages = video.languages || [];
        
        // Formater les programmes
        const formattedPrograms = videoPrograms.filter(p => p.trim()).join(', ') || '-';
        
        // Formater les speakers
        const formattedSpeakers = speakers.filter(s => s.trim()).join(', ') || '-';
        
        const row = document.createElement('tr');
        row.innerHTML = \`
          <td>
            <img src="\${video.thumbnail_url || '/placeholder-thumb.jpg'}" 
                 class="rounded" style="width: 60px; height: 40px; object-fit: cover;" 
                 alt="Thumbnail">
          </td>
          <td>
            <div class="fw-bold">\${video.title || 'No title'}</div>
            <small class="text-muted">\${video.video_source}</small>
          </td>
          <td>\${video.school_name || 'Unknown'}</td>
          <td>\${formattedPrograms}</td>
          <td>
            \${languages.map(lang => \`<span class="badge bg-info me-1">\${lang.toUpperCase()}</span>\`).join('')}
          </td>
          <td>\${formattedSpeakers}</td>
          <td>
            <span class="badge \${getStatusBadgeClass(video.status)}">\${video.status}</span>
          </td>
          <td>\${video.views_count || 0}</td>
          <td>\${new Date(video.created_at).toLocaleDateString()}</td>
          <td>
            <div class="btn-group btn-group-sm">
              <a href="/videos/edit/\${video.id}" class="btn btn-outline-primary" title="Edit">
                <i class="bi bi-pencil"></i>
              </a>
              <button class="btn btn-outline-danger" onclick="deleteVideo(\${video.id})" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        \`;
        tbody.appendChild(row);
      });
    }

    function showAddVideoModal() {
      document.getElementById('videoModalTitle').textContent = 'Add Video';
      document.getElementById('videoForm').reset();
      document.getElementById('videoId').value = '';
      
      const modal = new bootstrap.Modal(document.getElementById('videoModal'));
      modal.show();
    }

    function editVideo(videoId) {
      const video = videos.find(v => v.id === videoId);
      if (!video) return;

      document.getElementById('videoModalTitle').textContent = 'Edit Video';
      document.getElementById('videoId').value = video.id;
      document.getElementById('videoUrl').value = video.video_url;
      document.getElementById('videoSource').value = video.video_source;
      document.getElementById('videoStatus').value = video.status;
      document.getElementById('videoSchool').value = video.school_id;
      document.getElementById('thumbnailUrl').value = video.thumbnail_url || '';
      document.getElementById('duration').value = video.duration_seconds || '';
      
      // Load video programs
      loadVideoPrograms(videoId);
      
      // Load translations
      loadVideoTranslations(videoId);
      
      const modal = new bootstrap.Modal(document.getElementById('videoModal'));
      modal.show();
    }

    async function loadVideoTranslations(videoId) {
      try {
        const response = await fetch(\`/api/videos/\${videoId}/translations\`);
        const result = await response.json();
        
        if (result.success) {
          const translations = result.translations;
          
          // Add language tabs for existing translations
          translations.forEach(trans => {
            if (trans.language !== 'fr' && !addedLanguages.includes(trans.language)) {
              const language = availableLanguages.find(lang => lang.code === trans.language);
              if (language) {
                addedLanguages.push(trans.language);
                createLanguageTab(language);
              }
            }
          });
          
          // Set the data
          setLanguageData(translations);
        }
      } catch (error) {
        console.error('Error loading translations:', error);
      }
    }

    async function saveVideo() {
      const formData = {
        id: document.getElementById('videoId').value,
        video_url: document.getElementById('videoUrl').value,
        video_source: document.getElementById('videoSource').value,
        status: document.getElementById('videoStatus').value,
        school_id: document.getElementById('videoSchool').value,
        program_ids: Array.from(document.getElementById('videoPrograms').selectedOptions).map(o => o.value),
        thumbnail_url: document.getElementById('thumbnailUrl').value || null,
        duration_seconds: document.getElementById('duration').value || null,
        translations: getLanguageData(), // Use the new function
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
          bootstrap.Modal.getInstance(document.getElementById('videoModal')).hide();
          loadVideos();
        } else {
          showAlert(result.error, 'danger');
        }
      } catch (error) {
        console.error('Error saving video:', error);
        showAlert('Error saving video', 'danger');
      }
    }

    function deleteVideo(videoId) {
      deleteVideoId = videoId;
      const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
      modal.show();
    }

    async function confirmDelete() {
      if (!deleteVideoId) return;

      try {
        const response = await fetch(\`/api/videos/\${deleteVideoId}\`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
          showAlert('Video deleted successfully', 'success');
          bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
          loadVideos();
        } else {
          showAlert(result.error, 'danger');
        }
      } catch (error) {
        console.error('Error deleting video:', error);
        showAlert('Error deleting video', 'danger');
      }
    }

    function refreshVideos() {
      loadVideos();
      showAlert('Videos refreshed', 'info');
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

    // Language management functions
    function addLanguageTab() {
      // Show language selection modal
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
          <button class="nav-link" id="\${tabId}" data-bs-toggle="tab" data-bs-target="#\${contentId}" type="button" role="tab">
            \${language.flag} \${language.name}
            <button type="button" class="btn-close btn-close-white ms-2" onclick="removeLanguageTab('\${language.code}')" style="font-size: 0.7em;"></button>
          </button>
        </li>
      \`;

      // Create content
      const contentHtml = \`
        <div class="tab-pane fade" id="\${contentId}" role="tabpanel">
          <div class="card">
            <div class="card-body">
              <div class="mb-3">
                <label for="title\${language.code.toUpperCase()}" class="form-label">Title (\${language.code.toUpperCase()})</label>
                <input type="text" class="form-control" id="title\${language.code.toUpperCase()}" placeholder="\${language.name} title">
              </div>
              <div class="mb-3">
                <label for="description\${language.code.toUpperCase()}" class="form-label">Description (\${language.code.toUpperCase()})</label>
                <textarea class="form-control" id="description\${language.code.toUpperCase()}" rows="4" placeholder="\${language.name} description"></textarea>
              </div>
              <div class="mb-3">
                <label for="subtitles\${language.code.toUpperCase()}" class="form-label">Subtitles URL (\${language.code.toUpperCase()})</label>
                <input type="url" class="form-control" id="subtitles\${language.code.toUpperCase()}" placeholder="https://example.com/subtitles.vtt">
              </div>
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

    function removeLanguageTab(langCode) {
      if (langCode === 'fr') {
        showAlert('Cannot remove French language (default)', 'warning');
        return;
      }

      // Remove from added languages
      addedLanguages = addedLanguages.filter(code => code !== langCode);

      // Remove tab and content
      const tabId = \`\${langCode}-tab\`;
      const contentId = \`\${langCode}-content\`;
      
      document.getElementById(tabId).parentElement.remove();
      document.getElementById(contentId).remove();

      // Activate French tab if no other tabs
      if (addedLanguages.length === 1 && addedLanguages[0] === 'fr') {
        document.getElementById('fr-tab').classList.add('active');
        document.getElementById('fr-content').classList.add('show', 'active');
      }
    }

    function getLanguageData() {
      const translations = [];
      
      addedLanguages.forEach(langCode => {
        const titleField = document.getElementById(\`title\${langCode.toUpperCase()}\`);
        const descriptionField = document.getElementById(\`description\${langCode.toUpperCase()}\`);
        const subtitlesField = document.getElementById(\`subtitles\${langCode.toUpperCase()}\`);
        
        if (titleField && titleField.value.trim()) {
          translations.push({
            language: langCode,
            title: titleField.value.trim(),
            description: descriptionField ? descriptionField.value.trim() : '',
            subtitles_url: subtitlesField ? subtitlesField.value.trim() : null
          });
        }
      });
      
      return translations;
    }

    function setLanguageData(translations) {
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
        const titleField = document.getElementById(\`title\${langCode.toUpperCase()}\`);
        const descriptionField = document.getElementById(\`description\${langCode.toUpperCase()}\`);
        const subtitlesField = document.getElementById(\`subtitles\${langCode.toUpperCase()}\`);
        
        if (titleField) titleField.value = trans.title || '';
        if (descriptionField) descriptionField.value = trans.description || '';
        if (subtitlesField) subtitlesField.value = trans.subtitles_url || '';
      });
    }

    // Video programs management functions
    async function loadVideoPrograms(videoId) {
      try {
        const response = await fetch(\`/api/videos/\${videoId}/programs\`);
        const result = await response.json();
        
        if (result.success) {
          const videoPrograms = result.programs;
          
          // Clear current selections
          const programSelect = document.getElementById('videoPrograms');
          Array.from(programSelect.options).forEach(option => option.selected = false);
          
          // Select the programs associated with this video
          videoPrograms.forEach(program => {
            const option = programSelect.querySelector(\`option[value="\${program.id}"]\`);
            if (option) {
              option.selected = true;
            }
          });
        }
      } catch (error) {
        console.error('Error loading video programs:', error);
      }
    }

    // Make functions globally accessible
    window.loadVideos = loadVideos;
    window.renderVideosTable = renderVideosTable;
    window.filterVideos = filterVideos;
    window.deleteVideo = deleteVideo;
    window.confirmDelete = confirmDelete;
    window.refreshVideos = refreshVideos;
    window.showAlert = showAlert;
  `;

  return getAdminLayout('Videos', content, '/videos', user) + `<script>${scripts}</script>`;
}
