import { useEffect, useState } from 'react';

import { getProducts } from '../../shared/api';

import type { Product } from '../../shared/types';

import Loader from '../../components/Loader';
import ProductsSlider from '../../components/ProductsSlider';

import PicturesSlider from './components/PicturesSlider';
import CategoryGrid from './components/CategoryGrid';

import styles from './HomePage.module.scss';

type Props = {
  navigate: (to: string) => void;
};

export default function HomePage({ navigate }: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    getProducts()
      .then(setProducts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const brandNew = products
    .filter(product => product.priceRegular === product.priceDiscount)
    .sort((a, b) => b.year - a.year)
    .slice(0, 8);

  const hotPrices = [...products]
    .sort(
      (a, b) =>
        b.priceRegular - b.priceDiscount - (a.priceRegular - a.priceDiscount),
    )
    .slice(0, 8);

  return (
    <div className={styles.page}>
      <h1 className="visuallyHidden">Product Catalog</h1>

      <PicturesSlider navigate={navigate} />

      {loading && <Loader />}

      {error && <p>Something went wrong. Please reload the page.</p>}

      {!loading && !error && (
        <>
          <ProductsSlider
            title="Brand new models"
            products={brandNew}
            navigate={navigate}
          />

          <CategoryGrid navigate={navigate} />

          <ProductsSlider
            title="Hot prices"
            products={hotPrices}
            navigate={navigate}
          />
        </>
      )}
    </div>
  );
}
