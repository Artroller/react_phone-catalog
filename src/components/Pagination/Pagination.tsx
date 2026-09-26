import styles from './Pagination.module.scss';

type Props = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onChange,
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
      >
        ‹
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
        <button
          type="button"
          key={page}
          className={page === currentPage ? styles.active : ''}
          onClick={() => onChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        ›
      </button>
    </div>
  );
}
