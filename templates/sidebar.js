// ===== TEMPLATE SIDEBAR - W-AffBooster =====
// Template de la sidebar et navigation

import { getFooterHTML } from './footer.js';

export function getSidebarHTML(activePage, user, includeFooter = true) {
  const navLinks = [
    { href: '/profile', label: 'Profile', icon: '👤' },
    { href: '/programs', label: 'Programs', icon: '📚' },
    { href: '/support', label: 'Support', icon: '🆘' }
  ];
  
  const navLinksHTML = navLinks.map(link => 
    `<a href="${link.href}" class="nav-link ${activePage === link.href ? 'active' : ''}">
      <span>${link.icon}</span>
      <span>${link.label}</span>
    </a>`
  ).join('');
  
  return `
    <div class="header">
      <div class="logo">
        <div class="logo-icon">🎯</div>
        <span>Affiliate Manager</span>
      </div>
      
      <button class="menu-toggle" onclick="toggleSidebar()">☰</button>
      
      <nav class="main-nav">
        ${navLinksHTML}
      </nav>
      
      <div class="user-info">
        <div class="user-avatar" id="userAvatar">${user.username.charAt(0).toUpperCase()}</div>
        <span id="welcomeText">Welcome, ${user.username}</span>
        <a href="#" onclick="logout()" class="logout-btn">Logout</a>
      </div>
    </div>
    
    <!-- Sidebar -->
    <div class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">🎯</div>
          <span>Affiliate Manager</span>
        </div>
        <button class="sidebar-close" onclick="closeSidebar()">×</button>
      </div>
      
      <nav class="sidebar-nav">
        ${navLinksHTML}
      </nav>
      
      <div class="sidebar-user">
        <div class="user-info">
          <div class="user-avatar" id="sidebarUserAvatar">${user.username.charAt(0).toUpperCase()}</div>
          <span id="sidebarWelcomeText">Welcome, ${user.username}</span>
          <a href="#" onclick="logout()" class="logout-btn">Logout</a>
        </div>
      </div>
    </div>
    
    <!-- Overlay -->
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
    ${includeFooter ? getFooterHTML() : ''}
  `;
}

export function getSidebarScripts() {
  return `
    // Sidebar functions
    function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    }
    
    function closeSidebar() {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    }
    
    async function logout() {
      try {
        await fetch('/logout', { method: 'POST' });
        window.location.href = '/';
      } catch (error) {
        console.error('Logout error:', error);
        window.location.href = '/';
      }
    }
    
    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeSidebar();
      }
    });
    
    // Close sidebar when clicking on nav links
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      link.addEventListener('click', closeSidebar);
    });
  `;
}

export function getFooterScripts() {
  return `
    // Newsletter subscription
    async function subscribeNewsletter(e) {
      e.preventDefault();
      const email = e.target.querySelector('input[type="email"]').value;
      
      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        
        if (response.ok) {
          alert('Successfully subscribed to newsletter!');
          e.target.reset();
        } else {
          const error = await response.json();
          alert('Error: ' + (error.error || 'Failed to subscribe'));
        }
      } catch (error) {
        console.error('Newsletter subscription error:', error);
        alert('Error subscribing to newsletter. Please try again.');
      }
    }
    
    // Footer animations and interactions
    document.addEventListener('DOMContentLoaded', function() {
      // Animate footer on scroll
      const footer = document.querySelector('.footer');
      if (footer) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
            }
          });
        }, { threshold: 0.1 });
        
        observer.observe(footer);
      }
      
      // Social links hover effects
      const socialLinks = document.querySelectorAll('.social-link');
      socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0)';
        });
      });
    });
  `;
}
