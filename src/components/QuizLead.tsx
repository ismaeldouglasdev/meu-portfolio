import { useState, useEffect } from "react";
import { useTranslation } from "../i18n";
import { track } from "../lib/analytics";

interface Answers {
  projeto: string;
  orcamento: string;
  prazo: string;
  mensagem: string;
  name: string;
  contact: string;
}

const initialAnswers: Answers = {
  projeto: "",
  orcamento: "",
  prazo: "",
  mensagem: "",
  name: "",
  contact: "",
};

function QuizLead() {
  const { t } = useTranslation();
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const totalSteps = 5;

  // Track quiz start once
  useEffect(() => {
    track("quiz_start", window.location.pathname);
  }, []);

  const handleSelect = (field: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    track("quiz_answer", window.location.pathname, { question: field, answer: value });
  };

  const isCaptureValid = () => {
    return answers.name.trim().length >= 2 && answers.contact.trim().length >= 8;
  };

  const next = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
      track("quiz_step", window.location.pathname, { step: (step + 2).toString() });
    }
  };

  const complete = () => {
    setStep(totalSteps);
    track("quiz_complete", window.location.pathname);
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const reset = () => {
    setAnswers(initialAnswers);
    setStep(0);
    track("quiz_reset", window.location.pathname);
  };

  useEffect(() => {
    if (step === totalSteps) {
      try {
        localStorage.setItem('quiz-completed', 'true');
        window.dispatchEvent(new CustomEvent('quiz-completed'));
      } catch {}
    }
  }, [step]);

  const composeMessage = () => {
    const tmpl = t.contato.quiz.whatsappMessage;
    const mensagem = answers.mensagem.trim() ? `Sobre o projeto: ${answers.mensagem.trim()}` : '';
    return tmpl
      .replace("{name}", answers.name)
      .replace("{projeto}", answers.projeto)
      .replace("{orcamento}", answers.orcamento)
      .replace("{prazo}", answers.prazo)
      .replace("{mensagem}", mensagem);
  };

  const whatsappLink = `https://wa.me/5511959873202?text=${encodeURIComponent(composeMessage())}`;

  const renderOptions = (field: keyof Answers, options: string[]) => (
    <div className="quiz-options">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`quiz-option-button ${answers[field] === opt ? "selected" : ""}`}
          onClick={() => handleSelect(field, opt)}
          aria-pressed={answers[field] === opt}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <h3>{t.contato.quiz.questions.projeto.title}</h3>
            {renderOptions("projeto", t.contato.quiz.questions.projeto.options)}
          </>
        );
      case 1:
        return (
          <>
            <h3>{t.contato.quiz.questions.orcamento.title}</h3>
            {renderOptions("orcamento", t.contato.quiz.questions.orcamento.options)}
          </>
        );
      case 2:
        return (
          <>
            <h3>{t.contato.quiz.questions.prazo.title}</h3>
            {renderOptions("prazo", t.contato.quiz.questions.prazo.options)}
          </>
        );
      case 3:
        return (
          <>
            <h3>{t.contato.quiz.questions.mensagem.title}</h3>
            <textarea
              placeholder={t.contato.quiz.questions.mensagem.placeholder}
              value={answers.mensagem}
              onChange={(e) => handleSelect("mensagem", e.target.value)}
              className="quiz-input quiz-textarea"
              rows={4}
            />
          </>
        );
      case 4:
        return (
          <>
            <h3>{t.contato.quiz.questions.captura.title}</h3>
            <input
              type="text"
              placeholder={t.contato.quiz.questions.captura.namePlaceholder}
              value={answers.name}
              onChange={(e) => handleSelect("name", e.target.value)}
              className="quiz-input"
            />
            <input
              type="text"
              placeholder={t.contato.quiz.questions.captura.contactPlaceholder}
              value={answers.contact}
              onChange={(e) => handleSelect("contact", e.target.value)}
              className="quiz-input"
            />
          </>
        );
      default:
        return null;
    }
  };

  const renderSummary = () => (
    <div className="quiz-summary">
      <h3>{t.contato.quiz.summary.title}</h3>
      <p><strong>{t.contato.quiz.summary.service}</strong> {answers.projeto}</p>
      <p>{answers.orcamento} – {answers.prazo}</p>
      {answers.mensagem.trim() && <p className="quiz-summary-message">"{answers.mensagem.trim()}"</p>}
      <p>{answers.name} – {answers.contact}</p>
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary quiz-whatsapp-btn">
        {t.contato.quiz.btnWhatsApp}
      </a>
      <button type="button" className="btn btn-secondary" onClick={reset}>
        {t.contato.quiz.btnReset}
      </button>
    </div>
  );

  return (
    <section className="quiz-lead" aria-label={t.contato.quiz.title || "Quiz"}>
      <h2>{t.contato.quiz.title || "Quiz"}</h2>
      <p className="quiz-step-indicator">
        {t.contato.quiz.step.replace("{step}", (step + 1).toString()).replace("{total}", totalSteps.toString())}
      </p>
      {step < totalSteps ? renderStep() : renderSummary()}
      <div className="quiz-navigation">
        {step > 0 && step < totalSteps && (
          <button type="button" className="btn btn-secondary" onClick={back}>
            {t.contato.quiz.btnBack}
          </button>
        )}
        {step < totalSteps - 1 && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={next}
            disabled={
              (step === 0 && !answers.projeto) ||
              (step === 1 && !answers.orcamento) ||
              (step === 2 && !answers.prazo)
            }
          >
            {t.contato.quiz.btnNext}
          </button>
        )}
        {step === totalSteps - 1 && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={complete}
            disabled={!isCaptureValid()}
          >
            {t.contato.quiz.btnComplete}
          </button>
        )}
      </div>
    </section>
  );
}

export default QuizLead;
