import { siteContent } from '../data/siteContent.js';

const { ui } = siteContent;

/** "CHAPTER TWO · THE REEL ──────── 02" rule that opens each section. */
export function ChapterLabel({ number, title }) {
  return (
    <div className="chapter-label reveal">
      <span>
        {ui.chapterWord} {ui.numberWords[number - 1] ?? number}
        {title && <em> · {title}</em>}
      </span>
      <b>{String(number).padStart(2, '0')}</b>
    </div>
  );
}

/** Eyebrow + large serif title (with gold accent) + supporting line. */
export function SectionHeading({ eyebrow, title, accent, aside, id }) {
  return (
    <div className="section-heading reveal">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id}>
          {title} {accent && <em>{accent}</em>}
        </h2>
      </div>
      {aside && <p className="section-aside">{aside}</p>}
    </div>
  );
}

/** Convenience: label + heading straight from a chapter's content entry. */
export function ChapterIntro({ chapter, headingId }) {
  return (
    <>
      <ChapterLabel number={chapter.number} title={chapter.chapterTitle} />
      <SectionHeading
        id={headingId}
        eyebrow={chapter.eyebrow}
        title={chapter.title}
        accent={chapter.accent}
        aside={chapter.aside}
      />
    </>
  );
}
