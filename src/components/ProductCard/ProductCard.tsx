import { getAssetUrl } from '../../shared/asset';
import { useShop } from '../../shared/context/ShopContext';

import type { Product } from '../../shared/types';

import styles from './ProductCard.module.scss';

type Props = {
  product: Product;
  navigate: (to: string) => void;
};

export default function ProductCard({ product, navigate }: Props) {
  const { addToCart, toggleFavorite, isFavorite, isInCart } = useShop();

  const favorite = isFavorite(product.id);
  const inCart = isInCart(product.id);

  const discount = product.priceRegular - product.priceDiscount;

  const productUrl = `/product/${product.id}`;

  return (
    <article className={styles.card}>
      <a
        className={styles.imageLink}
        href={productUrl}
        onClick={event => {
          event.preventDefault();
          navigate(productUrl);
        }}
      >
        <img
          src={getAssetUrl(product.images[0])}
          alt={product.name}
          className={styles.image}
        />
      </a>

      <a
        className={styles.title}
        href={productUrl}
        onClick={event => {
          event.preventDefault();
          navigate(productUrl);
        }}
      >
        {product.name}
      </a>

      <div className={styles.price}>
        <strong>${product.priceDiscount}</strong>

        {discount > 0 && <del>${product.priceRegular}</del>}
      </div>

      <div className={styles.divider} />

      <div className={styles.specs}>
        <div>
          <span>Screen</span>
          <b>{product.screen}</b>
        </div>

        <div>
          <span>Capacity</span>
          <b>{product.capacity}</b>
        </div>

        <div>
          <span>RAM</span>
          <b>{product.ram}</b>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.cartButton} ${inCart ? styles.added : ''}`}
          disabled={inCart}
          onClick={() => addToCart(product)}
        >
          {inCart ? 'Added to cart' : 'Add to cart'}
        </button>

        <button
          type="button"
          className={`${styles.favoriteButton} ${
            favorite ? styles.favoriteActive : ''
          }`}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => toggleFavorite(product.id)}
        >
          {favorite ? '♥' : '♡'}
        </button>
      </div>
    </article>
  );
}
