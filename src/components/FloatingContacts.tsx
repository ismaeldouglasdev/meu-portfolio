import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaEnvelope, FaCommentDots, FaTimes } from 'react-icons/fa';

const FAN_ITEMS = [
  {
    id: 'whatsapp',
    href: 'https://wa.me/5511959873202',
    label: 'WhatsApp',
    icon: <FaWhatsapp aria-hidden="true" />,
    className: 'fab-fan-item fab-fan-item--whatsapp',
    angle: 90,
  },
  {
    id: 'email',
    href: 'mailto:contact@ismaeltech.com',
    label: 'Email',
    icon: <FaEnvelope aria-hidden="true" />,
    className: 'fab-fan-item fab-fan-item--email',
    angle: 145,
  },
];

function FloatingContacts() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('click', onClickOutside);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('click', onClickOutside);
    };
  }, [open]);

  const radius = 72;

  return (
    <div className="fab-contacts" ref={rootRef}>
      <AnimatePresence>
        {open &&
          FAN_ITEMS.map((item, i) => {
            const rad = (item.angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = -Math.sin(rad) * radius;
            return (
              <motion.a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className={item.className}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                animate={{ x, y, opacity: 1, scale: 1 }}
                exit={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22, delay: i * 0.05 }}
                onClick={() => setOpen(false)}
              >
                {item.icon}
              </motion.a>
            );
          })}
      </AnimatePresence>
      <motion.button
        type="button"
        className="fab-main"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={open ? 'Fechar contatos' : 'Abrir contatos'}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'chat'}
            className="fab-main-icon"
            initial={{ rotate: open ? 90 : -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: open ? -90 : 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <FaTimes aria-hidden="true" /> : <FaCommentDots aria-hidden="true" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

export default FloatingContacts;
