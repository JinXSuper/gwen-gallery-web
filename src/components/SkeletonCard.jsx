import BorderGlow from './reactbits/BorderGlow';

export default function SkeletonCard({ h = 250 }) {
  return (
    <div className="w-full break-inside-avoid mb-[10px]" style={{ height: `${h}px` }}>
      <BorderGlow 
        glowColor="#333333" 
        backgroundColor="var(--bg-surface)" 
        className="w-full h-full rounded-[28px]"
        animated={true}
      >
        <div className="w-full h-full animate-pulse bg-[var(--border-subtle)] rounded-[28px]"></div>
      </BorderGlow>
    </div>
  );
}
