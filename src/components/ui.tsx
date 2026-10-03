import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from './Icons';

export const Modal = ({ children, onDismiss }: { children: ReactNode; onDismiss?: () => void }) => (
    <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
    >
        <motion.div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain touch-pan-y bg-gelato-surface rounded-[28px] px-6 pt-7 pb-6 flex flex-col items-center gap-5 shadow-bevel-lg"
            initial={{ scale: 0.6, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.6, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            onClick={e => e.stopPropagation()}
        >
            {children}
        </motion.div>
    </motion.div>
);

export const Stat = ({ label, value, highlight = false }: { label: string; value: ReactNode; highlight?: boolean }) => (
    <div className={`flex-1 rounded-2xl py-2.5 flex flex-col items-center ${highlight ? 'bg-gelato-lemon text-gelato-lemon-ink' : 'bg-gelato-bg'}`}>
        <span className={`text-[11px] font-black tracking-[0.15em] ${highlight ? 'text-[#5A3A00]' : 'text-gelato-muted'}`}>{label}</span>
        <span className="font-display text-2xl">{value}</span>
    </div>
);

export const PrimaryButton = ({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        {...props}
        className={`w-full min-h-14 rounded-[18px] bg-gelato-strawberry hover:bg-gelato-strawberry-hi text-gelato-strawberry-ink font-display text-xl flex items-center justify-center gap-2 shadow-button transition-colors active:translate-y-px ${className}`}
    />
);

export const SecondaryButton = ({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        {...props}
        className={`w-full min-h-12 rounded-2xl bg-gelato-tray hover:bg-gelato-line text-gelato-cream font-black flex items-center justify-center gap-2 transition-colors ${className}`}
    />
);

// A row of three stars, `earned` of them lit.
export const Stars = ({ earned, size = 'w-4 h-4', label = true }: { earned: number; size?: string; label?: boolean }) => (
    <div className="flex items-center gap-0.5" role={label ? 'img' : undefined} aria-label={label ? `${earned} of 3 stars` : undefined}>
        {[0, 1, 2].map(i => (
            <StarIcon key={i} className={`${size} ${i < earned ? 'text-gelato-lemon' : 'text-gelato-line'}`} />
        ))}
    </div>
);
