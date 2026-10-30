import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { chapters, siteContent } from '../data/siteContent.js';
import { weddingConfig } from '../data/weddingConfig.js';
import { MusicControl } from './MusicControl.jsx';

const { ui } = siteContent;

export function SiteHeader({ visible }) {
  const { couple } = weddingConfig;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock page scroll and allow Escape while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const root = document.documentElement;
    root.classList.add('is-locked');
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      root.classList.remove('is-locked');
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const classes = ['topbar', scrolled && 'is-scrolled', visible && 'is-visible', menuOpen && 'menu-open']
    .filter(Boolean)
    .join(' ');

  return (
    <header className={classes}>
      <a className="brand" href="#top" aria-label={`${couple.hashtag} — ${ui.backToTop}`}>
        {couple.hashtag}
        <span>
          {couple.partnerOne} × {couple.partnerTwo}
        </span>
      </a>

      <nav className="nav-desktop" aria-label="Sections">
        {chapters.map((chapter) => (
          <a key={chapter.id} href={`#${chapter.id}`}>
            {chapter.navLabel}
          </a>
        ))}
      </nav>

      <div className="topbar-actions">
        <MusicControl />
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? ui.closeMenu : ui.openMenu}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav id="mobile-menu" className="nav-mobile" aria-label="Sections" hidden={!menuOpen}>
        <ol>
          {chapters.map((chapter, i) => (
            <li key={chapter.id} style={{ '--i': i }}>
              <a href={`#${chapter.id}`} onClick={() => setMenuOpen(false)}>
                <small>{String(chapter.number).padStart(2, '0')}</small>
                {chapter.navLabel}
              </a>
            </li>
          ))}
        </ol>
        {ui.menuNote && (
          <p className="nav-mobile-note">
            {couple.hashtag} · {ui.menuNote}
          </p>
        )}
      </nav>
    </header>
  );
}
