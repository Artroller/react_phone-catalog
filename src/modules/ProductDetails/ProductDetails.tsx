import { useEffect, useState } from 'react';

import { getProductById, getSuggestedProducts } from '../../shared/api';

import { getAssetUrl } from '../../shared/asset';

import { useShop } from '../../shared/context/ShopContext';

import type { Product } from '../../shared/types';

import Breadcrumbs from '../../components/Breadcrumbs';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';
import ProductsSlider from '../../components/ProductsSlider';

import styles from './ProductDetails.module.scss';

type Props = {
  productId: string;
  navigate: (to: string) => void;
};

const categoryNames = {
  phones: 'Phones',
  tablets: 'Tablets',
  accessories: 'Accessories',
};

export default function ProductDetails({ productId, navigate }: Props) {
  const { addToCart, isInCart, toggleFavorite, isFavorite } = useShop();

  const [product, setProduct] = useState<Product | null>(null);

  const [suggested, setSuggested] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [capacity, setCapacity] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    setLoading(true);
    setSelectedImage(0);

    Promise.all([getProductById(productId), getSuggestedProducts(productId)])
      .then(([current, recommendations]) => {
        setProduct(current);
        setSuggested(recommendations);

        if (current) {
          setCapacity(current.capacityAvailable[0] || current.capacity);

          setColor(current.colorsAvailable[0] || current.color);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <EmptyState
        text="Product was not found"
        action="Back to home"
        onAction={() => navigate('/')}
      />
    );
  }

  const inCart = isInCart(product.id);
  const favorite = isFavorite(product.id);

  return (
    <section className={styles.page}>
      <Breadcrumbs
        items={[
          {
            label: 'Home',
            onClick: () => navigate('/'),
          },
          {
            label: categoryNames[product.category],
            onClick: () => navigate(`/${product.category}`),
          },
          {
            label: product.name,
          },
        ]}
      />

      <button
        className={styles.back}
        type="button"
        onClick={() => navigate(`/${product.category}`)}
      >
        ← Back
      </button>

      <div className={styles.details}>
        <div>
          <div className={styles.mainImage}>
            <img
              src={getAssetUrl(product.images[selectedImage])}
              alt={product.name}
            />
          </div>

          <div className={styles.thumbs}>
            {product.images.map((image, index) => (
              <button
                type="button"
                key={image}
                className={
                  index === selectedImage ? styles.thumbActive : styles.thumb
                }
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={getAssetUrl(image)}
                  alt={`${product.name} ${index + 1}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.info}>
          <h1>{product.name}</h1>

          <div className={styles.price}>
            <strong>${product.priceDiscount}</strong>

            {product.priceRegular > product.priceDiscount && (
              <del>${product.priceRegular}</del>
            )}
          </div>

          <div className={styles.option}>
            <strong>Capacity: {capacity}</strong>

            <div className={styles.radioRow}>
              {product.capacityAvailable.map(value => (
                <label key={value}>
                  <input
                    type="radio"
                    name="capacity"
                    checked={capacity === value}
                    onChange={() => setCapacity(value)}
                  />

                  <span>{value}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.option}>
            <strong>Color: {color}</strong>

            <div className={styles.radioRow}>
              {product.colorsAvailable.map(value => (
                <label key={value}>
                  <input
                    type="radio"
                    name="color"
                    checked={color === value}
                    onChange={() => setColor(value)}
                  />

                  <span>{value}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.cartButton}
              disabled={inCart}
              onClick={() => addToCart(product)}
            >
              {inCart ? 'Added to cart' : 'Add to cart'}
            </button>

            <button
              type="button"
              className={favorite ? styles.favoriteActive : styles.favorite}
              onClick={() => toggleFavorite(product.id)}
            >
              {favorite ? '♥' : '♡'}
            </button>
          </div>

          <div className={styles.specs}>
            <div>
              <span>Screen</span>
              <b>{product.screen}</b>
            </div>

            <div>
              <span>Resolution</span>
              <b>{product.resolution}</b>
            </div>

            <div>
              <span>Processor</span>
              <b>{product.processor}</b>
            </div>

            <div>
              <span>RAM</span>
              <b>{product.ram}</b>
            </div>

            <div>
              <span>Camera</span>
              <b>{product.camera}</b>
            </div>

            <div>
              <span>Zoom</span>
              <b>{product.zoom}</b>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.about}>
        <div>
          <h2>About</h2>

          <h3>{product.name}</h3>

          <p>{product.description}</p>
        </div>

        <div>
          <h2>Tech specs</h2>

          {product.cell.map(item => (
            <div className={styles.techRow} key={item}>
              <span>•</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      <ProductsSlider
        title="You may also like"
        products={suggested}
        navigate={navigate}
      />
    </section>
  );
}
