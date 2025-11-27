import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticleEffectProps {
    position: { x: number; y: number };
    type: 'explosion' | 'combo' | 'awesome';
    onComplete: () => void;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({ position, type, onComplete }) => {
    const particles = Array.from({ length: type === 'explosion' ? 12 : 20 });

    return (
        <div
            className="fixed pointer-events-none z-50"
            style={{ left: position.x, top: position.y }}
        >
            <AnimatePresence onExitComplete={onComplete}>
                {particles.map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute w-3 h-3 rounded-full ${type === 'explosion' ? 'bg-orange-500' : 'bg-yellow-400'
                            }`}
                        initial={{
                            x: 0,
                            y: 0,
                            scale: 1,
                            opacity: 1,
                        }}
                        animate={{
                            x: Math.cos((i / particles.length) * Math.PI * 2) * (type === 'explosion' ? 80 : 120),
                            y: Math.sin((i / particles.length) * Math.PI * 2) * (type === 'explosion' ? 80 : 120),
                            scale: 0,
                            opacity: 0,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: type === 'explosion' ? 0.6 : 1,
                            ease: 'easeOut',
                        }}
                    />
                ))}

                {type !== 'explosion' && (
                    <motion.div
                        className="absolute text-4xl font-black text-yellow-400"
                        initial={{ scale: 0, y: 0, opacity: 0 }}
                        animate={{ scale: 1.5, y: -50, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ textShadow: '0 0 20px rgba(255,215,0,0.8)' }}
                    >
                        {type === 'combo' ? '🔥 COMBO!' : '⭐ AWESOME!'}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

interface FeedbackTextProps {
    text: string;
    position: { x: number; y: number };
    onComplete: () => void;
}

export const FeedbackText: React.FC<FeedbackTextProps> = ({ text, position, onComplete }) => {
    return (
        <motion.div
            className="fixed pointer-events-none z-50 text-3xl font-black text-yellow-400"
            style={{
                left: position.x,
                top: position.y,
                textShadow: '0 0 20px rgba(255,215,0,1), 0 0 40px rgba(255,215,0,0.5)',
            }}
            initial={{ scale: 0, y: 0, opacity: 0 }}
            animate={{ scale: 1.2, y: -60, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.8 }}
            onAnimationComplete={onComplete}
        >
            {text}
        </motion.div>
    );
};
