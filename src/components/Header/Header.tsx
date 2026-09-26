import { useEffect, useState } from 'react';

import { useShop } from '../../shared/context/ShopContext';

import Logo from '../Logo';

import styles from './Header.module.scss';

type Props = {
  navigate: (to: string) => void;
  showSearch: boolean;
  query: string;
  onSearchChange: (value: string) => void;
};

export default function Header({
  navigate,
  showSearch,
  query,
  onSearchChange,
}: Props) {
  const { cartQuantity, favorites } = useShop();

  const [search, setSearch] = useState(query);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setSearch(query);
  }, [query]);

  useEffect(() => {
    if (!showSearch) {
      return;
    }

    const timer = window.setTimeout(() => {
      onSearchChange(search);
    }, 400);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search, showSearch, onSearchChange]);

  const go = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo onClick={() => go('/')} />

        <button
          className={styles.menuButton}
          type="button"
          onClick={() => setMenuOpen(current => !current)}
          aria-label="Open menu"
        >
          ☰
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          <button type="button" onClick={() => go('/')}>
            Home
          </button>

          <button type="button" onClick={() => go('/phones')}>
            Phones
          </button>

          <button type="button" onClick={() => go('/tablets')}>
            Tablets
          </button>

          <button type="button" onClick={() => go('/accessories')}>
            Accessories
          </button>
        </nav>

        <div className={styles.actions}>
          {showSearch && (
            <label className={styles.search}>
              <span>⌕</span>

              <input
                type="search"
                value={search}
                placeholder="Search..."
                onChange={event => setSearch(event.target.value)}
              />
            </label>
          )}

          <button
            className={styles.action}
            type="button"
            aria-label="Favorites"
            onClick={() => go('/favorites')}
          >
            <span>♡</span>

            {favorites.length > 0 && <b>{favorites.length}</b>}
          </button>

          <button
            className={styles.action}
            type="button"
            aria-label="Cart"
            onClick={() => go('/cart')}
          >
            <span>🛒</span>

            {cartQuantity > 0 && <b>{cartQuantity}</b>}
          </button>
        </div>
      </div>
    </header>
  );
}
