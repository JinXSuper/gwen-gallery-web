import { motion } from 'framer-motion';

/**
 * Pagination component matching the Geist design system API.
 * Supports previous/next objects and numbered navigation.
 */
export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  previous = { title: 'Previous', href: '#' },
  next = { title: 'Next', href: '#' }
}) {
  
  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange?.(page);
    }
  };

  const renderPageNumbers = () => {
    let pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }

    return pages.map((p, idx) => (
      <button
        key={idx}
        onClick={() => typeof p === 'number' && handlePageClick(p)}
        disabled={typeof p !== 'number'}
        className={`px-3 py-1 font-mono text-[0.65rem] tracking-widest transition-all duration-300 ${
          p === currentPage 
            ? 'text-[var(--accent)] border-b border-[var(--accent)]' 
            : p === '...' 
              ? 'text-white/20 cursor-default' 
              : 'text-white/60 hover:text-white cursor-pointer'
        } ${typeof p === 'number' ? 'active:scale-95' : ''}`}
      >
        {p === '...' ? p : p.toString().padStart(2, '0')}
      </button>
    ));
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-20 mb-10 flex flex-col items-center gap-8">
      {/* Numbered Navigation */}
      <div className="flex items-center gap-1 border-b border-white/5 pb-2">
        {renderPageNumbers()}
      </div>

      {/* Prev/Next Navigation (Geist Snippet API) */}
      <div className="flex items-center justify-between w-full px-4">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`group flex flex-col items-start gap-1 transition-all duration-500 ${
            currentPage === 1 ? 'opacity-20 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
          }`}
        >
          <span className="font-mono text-[0.5rem] uppercase tracking-[0.4em] text-white/40 group-hover:text-[var(--accent)]">Previous</span>
          <span className="font-sans text-[0.7rem] uppercase tracking-widest text-[var(--text-primary)]">{previous.title}</span>
        </button>

        <div className="h-6 w-px bg-white/10"></div>

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`group flex flex-col items-end gap-1 transition-all duration-500 ${
            currentPage === totalPages ? 'opacity-20 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
          }`}
        >
          <span className="font-mono text-[0.5rem] uppercase tracking-[0.4em] text-white/40 group-hover:text-[var(--accent)]">Next</span>
          <span className="font-sans text-[0.7rem] uppercase tracking-widest text-[var(--text-primary)]">{next.title}</span>
        </button>
      </div>
    </div>
  );
}
