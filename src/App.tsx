import { useEffect, useState } from 'react';

import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './modules/HomePage';
import ProductsPage from './modules/ProductsPage';
import ProductDetailsPage from './modules/ProductDetails';
import CartPage from './modules/CartPage';
import FavoritesPage from './modules/FavoritesPage';
import NotFoundPage from './modules/NotFoundPage';

import type { Category } from './shared/types';

const getPath = () => window.location.pathname;

const getQuery = () =>
  new URLSearchParams(window.location.search).get('query') || '';

export default function App() {
  const [path, setPath] = useState(getPath);
  const [query, setQuery] = useState(getQuery);

  useEffect(() => {
    const handlePopState = () => {
      setPath(getPath());
      setQuery(getQuery());

      window.scrollTo({
        top: 0,
      });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);

    setPath(window.location.pathname);
    setQuery(new URLSearchParams(window.location.search).get('query') || '');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const updateQuery = (value: string) => {
    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set('query', value);
    } else {
      params.delete('query');
    }

    const queryString = params.toString();

    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}${queryString ? `?${queryString}` : ''}`,
    );

    setQuery(value);
  };

  const productMatch = path.match(/^\/product\/([^/]+)$/);

  let content: React.ReactNode;

  if (path === '/') {
    content = <HomePage navigate={navigate} />;
  } else if (
    path === '/phones' ||
    path === '/tablets' ||
    path === '/accessories'
  ) {
    content = (
      <ProductsPage
        category={path.slice(1) as Category}
        query={query}
        navigate={navigate}
      />
    );
  } else if (productMatch) {
    content = (
      <ProductDetailsPage productId={productMatch[1]} navigate={navigate} />
    );
  } else if (path === '/cart') {
    content = <CartPage navigate={navigate} />;
  } else if (path === '/favorites') {
    content = <FavoritesPage query={query} navigate={navigate} />;
  } else {
    content = <NotFoundPage navigate={navigate} />;
  }

  const showSearch =
    path === '/phones' ||
    path === '/tablets' ||
    path === '/accessories' ||
    path === '/favorites';

  return (
    <div className="app">
      <Header
        navigate={navigate}
        showSearch={showSearch}
        query={query}
        onSearchChange={updateQuery}
      />

      <main className="main">{content}</main>

      <Footer navigate={navigate} />
    </div>
  );
}
