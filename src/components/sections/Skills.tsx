import { useState } from 'react';
import { useLang } from '../../i18n/LangContext';
import { useReveal } from '../../hooks/useReveal';
import { skillCategories, softSkills, skillFilters, type SkillFilter, type SkillCategory } from '../../data/skills';
import { SkillBar } from '../ui/SkillBar';

function SkillCategoryCard({ cat, delay, filteredOut }: { cat: SkillCategory; delay: boolean; filteredOut: boolean }) {
  const { t } = useLang();
  const { ref: catRef, visible: catVisible } = useReveal<HTMLDivElement>();

  return (
    <div
      className={`skill-category reveal${delay ? ' reveal-delay' : ''}${catVisible ? ' visible' : ''}${filteredOut ? ' filtered-out' : ''}`}
      data-category={cat.category}
      ref={catRef}
    >
      <h3 className="skill-cat-title">{t(cat.titleKey)}</h3>
      {cat.bars && (
        <div className="skill-list">
          {cat.bars.map((bar) => (
            <SkillBar key={bar.name} {...bar} />
          ))}
        </div>
      )}
      {cat.pills && (
        <div className="skill-tags">
          {cat.pills.map((pill) => (
            <span className="skill-tag-pill" key={pill.labelKey ?? pill.label}>
              <i className={pill.icon} aria-hidden="true" /> {pill.labelKey ? t(pill.labelKey) : pill.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function Skills() {
  const { t } = useLang();
  const [filter, setFilter] = useState<SkillFilter>('all');
  const { ref: titleRef, visible: titleVisible } = useReveal<HTMLHeadingElement>();
  const { ref: filterWrapRef, visible: filterWrapVisible } = useReveal<HTMLDivElement>();
  const { ref: softWrapRef, visible: softWrapVisible } = useReveal<HTMLDivElement>();

  return (
    <section className="skills section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <div className="section-label" aria-hidden="true">
          <span className="label-line" />
          <span>{t('skills.label')}</span>
        </div>
        <h2 id="skills-title" className={`section-title reveal${titleVisible ? ' visible' : ''}`} ref={titleRef}>
          {t('skills.title')}
        </h2>

        <div
          className={`skills-filter-wrap reveal${filterWrapVisible ? ' visible' : ''}`}
          role="group"
          aria-label="Filtro de habilidades"
          ref={filterWrapRef}
        >
          {skillFilters.map((f) => (
            <button
              key={f.filter}
              className={`skill-filter-btn${filter === f.filter ? ' active' : ''}`}
              aria-pressed={filter === f.filter}
              onClick={() => setFilter(f.filter)}
            >
              {t(f.labelKey)}
            </button>
          ))}
        </div>

        <div className="skills-grid">
          {skillCategories.map((cat, i) => (
            <SkillCategoryCard
              key={cat.category}
              cat={cat}
              delay={i % 2 === 1}
              filteredOut={filter !== 'all' && filter !== cat.category}
            />
          ))}
        </div>

        <div
          className={`soft-skills-wrap reveal${softWrapVisible ? ' visible' : ''}${filter !== 'all' && filter !== 'soft' ? ' filtered-out' : ''}`}
          data-category="soft"
          ref={softWrapRef}
        >
          <h3 className="skill-cat-title" style={{ marginBottom: '1.25rem' }}>
            {t('skills.soft_title')}
          </h3>
          <div className="soft-grid">
            {softSkills.map((skill) => (
              <div className="soft-card" key={skill.key}>
                <i className={skill.icon} aria-hidden="true" />
                <span>{t(skill.key)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
