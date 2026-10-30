import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { siteContent } from './data/siteContent.js';

import './styles/fonts.css';
import './styles/base.css';
import './styles/opening.css';
import './styles/header.css';
import './styles/hero.css';
import './styles/sections.css';
import './styles/invitation.css';
import './styles/venue.css';
import './styles/closing.css';

// Browser-tab title and description come from siteContent.js.
document.title = siteContent.meta.title;
document.querySelector('meta[name="description"]')?.setAttribute('content', siteContent.meta.description);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
