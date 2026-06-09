import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useTranslation } from '../i18n';

function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq">
      <span className="section-label">{t.faq.label}</span>
      <h2>{t.faq.title}</h2>

      <div className="faq-list">
        {t.faq.items.map((item, i) => (
          <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => toggle(i)}>
              <span>{item.q}</span>
              <FaChevronDown className="faq-arrow" />
            </button>
            <div className="faq-answer">
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQ;
