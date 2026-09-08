import { useState, useEffect, useRef } from "react";
import { useTranslation } from "../i18n";
import { track } from "../lib/analytics";

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        action: string;
        size?: string;
        callback: (token: string) => void;
        "expired-callback"?: () => void;
        "error-callback"?: () => void;
      }) => string;
      reset: (widgetId: string) => void;
    };
  }
}

const VERIFY_ENDPOINT = "https://blog-analytics.y2kgif.workers.dev/api/verify";
const TURNSTILE_SITEKEY = import.meta.env.VITE_TURNSTILE_SITEKEY as string;

type VerifyStatus = "idle" | "verifying" | "ok" | "error";

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
  const [backFocused, setBackFocused] = useState(false);
  const backRef = useRef<HTMLButtonElement | null>(null);
  const totalSteps = 5;
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>("idle");
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetId = useRef<string | undefined>(undefined);

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

  const verifyToken = async (token: string) => {
    setVerifyStatus("verifying");
    try {
      const res = await fetch(VERIFY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const json = (await res.json()) as { ok?: boolean };
      if (!res.ok || json.ok !== true) throw new Error("verify failed");
      setVerifyStatus("ok");
    } catch {
      setVerifyStatus("error");
      track("quiz_verify_error", window.location.pathname);
    }
  };

  useEffect(() => {
    if (step !== totalSteps) return;
    setVerifyStatus("idle");

    const container = turnstileContainerRef.current;
    if (!container) return;

    const tryRender = () => {
      if (!window.turnstile || turnstileWidgetId.current) return false;
      turnstileWidgetId.current = window.turnstile.render(container, {
        sitekey: TURNSTILE_SITEKEY,
        action: "quiz_lead",
        size: "compact",
        callback: (token) => {
          void verifyToken(token);
        },
        "expired-callback": () => setVerifyStatus("idle"),
        "error-callback": () => setVerifyStatus("error"),
      });
      return true;
    };

    if (tryRender()) return;

    // O script api.js é async/defer — tenta de novo até o Turnstile estar pronto
    const interval = window.setInterval(() => {
      if (tryRender()) window.clearInterval(interval);
    }, 200);
    return () => {
      window.clearInterval(interval);
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
      }
      turnstileWidgetId.current = undefined;
    };
  }, [step]);

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const canNext = () => {
    if (step === 0) return !!answers.projeto;
    if (step === 1) return !!answers.orcamento;
    if (step === 2) return !!answers.prazo;
    return true;
  };

  useEffect(() => {
    const currentOptions = step === 0 ? t.contato.quiz.questions.projeto.options
      : step === 1 ? t.contato.quiz.questions.orcamento.options
      : step === 2 ? t.contato.quiz.questions.prazo.options
      : [];
    const field = step === 0 ? ('projeto' as const)
      : step === 1 ? ('orcamento' as const)
      : step === 2 ? ('prazo' as const)
      : null;

    const moveSel = (dir: 1 | -1) => {
      if (!field || currentOptions.length === 0) return;
      const cur = answers[field];
      const idx = currentOptions.indexOf(cur);
      const nextIdx = (idx === -1 ? -dir : idx) + dir;
      const clamped = Math.max(0, Math.min(currentOptions.length - 1, nextIdx));
      handleSelect(field, currentOptions[clamped]);
    };
    const advance = () => {
      if (step === totalSteps - 1) {
        if (isCaptureValid()) complete();
      } else if (canNext()) {
        next();
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'TEXTAREA') return;

      if (e.key === 'Enter') {
        e.preventDefault();
        if (backFocused) {
          back();
        } else {
          advance();
        }
      } else if (e.key === 'ArrowDown' && step > 0 && tag !== 'INPUT') {
        e.preventDefault();
        setBackFocused(true);
        backRef.current?.focus();
      } else if (e.key === 'ArrowUp' && tag !== 'INPUT') {
        e.preventDefault();
        setBackFocused(false);
        backRef.current?.blur();
      } else if (e.key === 'ArrowRight' && tag !== 'INPUT') {
        e.preventDefault();
        setBackFocused(false);
        backRef.current?.blur();
        moveSel(1);
      } else if (e.key === 'ArrowLeft' && tag !== 'INPUT') {
        e.preventDefault();
        setBackFocused(false);
        backRef.current?.blur();
        moveSel(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, answers, backFocused]);

  const reset = () => {
    setAnswers(initialAnswers);
    setStep(0);
    window.dispatchEvent(new CustomEvent('quiz-reset'));
    track("quiz_reset", window.location.pathname);
  };

  useEffect(() => {
    if (step === totalSteps) {
      window.dispatchEvent(new CustomEvent('quiz-completed'));
    }
  }, [step]);

  const composeMessage = () => {
    const tmpl = t.contato.quiz.whatsappMessage;
    const mensagem = answers.mensagem.trim() ? `${t.contato.quiz.mensagemLabel}${answers.mensagem.trim()}` : '';
    return tmpl
      .replace("{name}", answers.name)
      .replace("{projeto}", answers.projeto)
      .replace("{orcamento}", answers.orcamento)
      .replace("{prazo}", answers.prazo)
      .replace("{mensagem}", mensagem);
  };

  const whatsappLink = `https://wa.me/5511959873202?text=${encodeURIComponent(composeMessage())}`;

  const emailSubject = t.contato.quiz.emailSubject.replace("{projeto}", answers.projeto);
  const emailLink = `mailto:contact@ismaeltech.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(composeMessage())}`;

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

  const progress = step === totalSteps
    ? 100
    : Math.round(((step + 1) / (totalSteps + 1)) * 100);

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

  const renderSummary = () => {
    const verified = verifyStatus === "ok";
    const blocked = !verified;
    return (
    <div className="quiz-summary">
      <h3>{t.contato.quiz.summary.title}</h3>
      <p><strong>{t.contato.quiz.summary.service}</strong> {answers.projeto}</p>
      <p>{answers.orcamento} - {answers.prazo}</p>
      {answers.mensagem.trim() && <p className="quiz-summary-message">"{answers.mensagem.trim()}"</p>}
      <p>{answers.name} - {answers.contact}</p>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn btn-primary quiz-whatsapp-btn${blocked ? " disabled" : ""}`}
        aria-disabled={blocked}
        onClick={(e) => {
          if (blocked) e.preventDefault();
        }}
      >
        {t.contato.quiz.btnWhatsApp}
      </a>
      <a
        href={emailLink}
        className={`btn btn-secondary quiz-email-btn${blocked ? " disabled" : ""}`}
        aria-disabled={blocked}
        onClick={(e) => {
          if (blocked) e.preventDefault();
        }}
      >
        {t.contato.quiz.btnEmail}
      </a>
      <button type="button" className="btn btn-outline" onClick={reset}>
        {t.contato.quiz.btnReset}
      </button>
      <div ref={turnstileContainerRef} className="quiz-turnstile" aria-label={t.contato.quiz.verifyLabel} />
      <p className="quiz-verify-status" role="status">
        {verifyStatus === "verifying" && t.contato.quiz.verifying}
        {verifyStatus === "ok" && t.contato.quiz.verified}
        {verifyStatus === "error" && t.contato.quiz.verifyError}
      </p>
    </div>
    );
  };

  return (
    <section id="quiz" className="quiz-lead" aria-label={t.contato.quiz.title || "Quiz"}>
      <h2>{t.contato.quiz.title || "Quiz"}</h2>
      {step <= totalSteps && (
        <div className="quiz-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="quiz-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}
      {step < totalSteps && (
        <p className="quiz-step-indicator">
          {t.contato.quiz.step.replace("{step}", (step + 1).toString()).replace("{total}", totalSteps.toString())}
        </p>
      )}
      {step < totalSteps ? renderStep() : renderSummary()}
      {step < totalSteps && (
        <p className="quiz-nav-hint">{t.contato.quiz.navHint}</p>
      )}
      <div className="quiz-navigation">
        {step > 0 && step < totalSteps && (
          <button
            ref={backRef}
            type="button"
            className={`btn btn-secondary ${backFocused ? "nav-focus" : ""}`}
            onClick={back}
            onBlur={() => setBackFocused(false)}
          >
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
