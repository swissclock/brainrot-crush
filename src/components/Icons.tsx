

export const BombIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="55" r="35" fill="#333" stroke="black" strokeWidth="4" />
        <path d="M50 20 Q50 10 70 10" stroke="#666" strokeWidth="4" fill="none" />
        <path d="M70 10 L75 5 M70 10 L75 15 M70 10 L65 5" stroke="#FFA500" strokeWidth="3" />
        <circle cx="35" cy="45" r="5" fill="white" opacity="0.5" />
    </svg>
);

export const FireIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 90 Q20 90 20 60 Q20 30 50 10 Q80 30 80 60 Q80 90 50 90 Z" fill="#FF4500" stroke="#8B0000" strokeWidth="3" />
        <path d="M50 80 Q35 80 35 60 Q35 45 50 25 Q65 45 65 60 Q65 80 50 80 Z" fill="#FFA500" />
        <path d="M50 70 Q45 70 45 60 Q45 50 50 40 Q55 50 55 60 Q55 70 50 70 Z" fill="#FFFF00" />
    </svg>
);

export const StarIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10 L61 35 L88 39 L68 58 L73 85 L50 73 L27 85 L32 58 L12 39 L39 35 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="3" strokeLinejoin="round" />
    </svg>
);

export const TrophyIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 30 L30 50 Q30 70 50 70 Q70 70 70 50 L70 30 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="3" />
        <path d="M30 35 L20 35 Q10 35 10 45 Q10 55 20 55 L30 55" fill="none" stroke="#FFD700" strokeWidth="5" />
        <path d="M70 35 L80 35 Q90 35 90 45 Q90 55 80 55 L70 55" fill="none" stroke="#FFD700" strokeWidth="5" />
        <path d="M50 70 L50 85 M30 90 L70 90" stroke="#B8860B" strokeWidth="5" strokeLinecap="round" />
    </svg>
);

export const BoltIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M55 10 L25 50 L45 50 L35 90 L75 40 L55 40 L65 10 Z" fill="#FFD700" stroke="#FFA500" strokeWidth="3" strokeLinejoin="round" />
    </svg>
);
export const RetryIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 20 A30 30 0 1 1 25 35" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <path d="M25 20 L25 35 L40 35" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const NextIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 20 L70 50 L30 80" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const TrashIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 30 L30 85 Q32 90 38 90 L62 90 Q68 90 70 85 L75 30" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <path d="M20 30 L80 30" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <path d="M40 30 L40 20 Q40 15 45 15 L55 15 Q60 15 60 20 L60 30" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <path d="M40 45 L40 75 M50 45 L50 75 M60 45 L60 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
);
