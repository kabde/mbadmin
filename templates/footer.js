// ===== TEMPLATE FOOTER - W-AffBooster =====
// Template du footer réutilisable

export function getFooterHTML() {
  return `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <div class="logo-icon">🎯</div>
            <span>Affiliate Manager</span>
          </div>
          <p class="footer-description">
            Système de gestion d'affiliation avancé avec tracking des clics, conversions et analytics en temps réel.
          </p>
        </div>
        
        <div class="footer-section">
          <h4>Navigation</h4>
          <ul class="footer-links">
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/offers">All Offers</a></li>
            <li><a href="/my-offers">My Offers</a></li>
            <li><a href="/my-clicks">My Clicks</a></li>
            <li><a href="/my-conversions">My Conversions</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Support</h4>
          <ul class="footer-links">
            <li><a href="/support">Support Center</a></li>
            <li><a href="/support#documentation">Documentation</a></li>
            <li><a href="/support#faq">FAQ</a></li>
            <li><a href="/support#contact">Contact Us</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Legal</h4>
          <ul class="footer-links">
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/cookies">Cookie Policy</a></li>
            <li><a href="/refund">Refund Policy</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Connect</h4>
          <div class="social-links">
            <a href="#" class="social-link" title="Twitter">
              <span>🐦</span>
            </a>
            <a href="#" class="social-link" title="LinkedIn">
              <span>💼</span>
            </a>
            <a href="#" class="social-link" title="Discord">
              <span>💬</span>
            </a>
            <a href="#" class="social-link" title="GitHub">
              <span>🐙</span>
            </a>
          </div>
          <div class="newsletter">
            <h5>Newsletter</h5>
            <form class="newsletter-form" onsubmit="subscribeNewsletter(event)">
              <input type="email" placeholder="Enter your email" required>
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <div class="footer-copyright">
            <p>&copy; ${new Date().getFullYear()} Affiliate Manager. All rights reserved.</p>
          </div>
          <div class="footer-status">
            <span class="status-indicator online"></span>
            <span>System Status: Online</span>
          </div>
        </div>
      </div>
    </footer>
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

export function getFooterCSS() {
  return `
    /* Footer Styles */
    .footer {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: #e2e8f0;
      margin-top: auto;
      border-top: 1px solid #475569;
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 1rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .footer-section h4 {
      color: #f1f5f9;
      margin-bottom: 1rem;
      font-size: 1.1rem;
      font-weight: 600;
    }
    
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .footer-logo .logo-icon {
      font-size: 1.5rem;
    }
    
    .footer-logo span {
      font-size: 1.2rem;
      font-weight: 700;
      color: #f1f5f9;
    }
    
    .footer-description {
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-links li {
      margin-bottom: 0.5rem;
    }
    
    .footer-links a {
      color: #94a3b8;
      text-decoration: none;
      transition: color 0.2s ease;
    }
    
    .footer-links a:hover {
      color: #f1f5f9;
    }
    
    .social-links {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: #475569;
      border-radius: 50%;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    
    .social-link:hover {
      background: #6366f1;
      transform: translateY(-2px);
    }
    
    .newsletter h5 {
      color: #f1f5f9;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    
    .newsletter-form {
      display: flex;
      gap: 0.5rem;
    }
    
    .newsletter-form input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #475569;
      border-radius: 0.375rem;
      background: #334155;
      color: #e2e8f0;
      font-size: 0.875rem;
    }
    
    .newsletter-form input:focus {
      outline: none;
      border-color: #6366f1;
    }
    
    .newsletter-form button {
      padding: 0.5rem 1rem;
      background: #6366f1;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    
    .newsletter-form button:hover {
      background: #5b21b6;
    }
    
    .footer-bottom {
      border-top: 1px solid #475569;
      background: #1e293b;
    }
    
    .footer-bottom-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .footer-copyright p {
      color: #94a3b8;
      margin: 0;
      font-size: 0.875rem;
    }
    
    .footer-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #94a3b8;
      font-size: 0.875rem;
    }
    
    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      animation: pulse 2s infinite;
    }
    
    .status-indicator.online {
      background: #22c55e;
    }
    
    .status-indicator.offline {
      background: #ef4444;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .footer.animate-in {
      animation: slideUp 0.6s ease-out;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        padding: 2rem 1rem;
      }
      
      .footer-bottom-content {
        flex-direction: column;
        text-align: center;
      }
      
      .newsletter-form {
        flex-direction: column;
      }
    }
  `;
}
