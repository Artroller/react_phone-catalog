import { getAssetUrl } from '../../shared/asset';
import { useShop } from '../../shared/context/ShopContext';

import EmptyState from '../../components/EmptyState';

import styles from './CartPage.module.scss';

type Props = {
  navigate: (to: string) => void;
};

export default function CartPage({ navigate }: Props) {
  const {
    cart,
    cartTotal,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useShop();

  const checkout = () => {
    const confirmed = window.confirm(
      'Checkout is not implemented yet. Do you want to clear the Cart?',
    );

    if (confirmed) {
      clearCart();
    }
  };

  if (!cart.length) {
    return (
      <EmptyState
        text="Your cart is empty"
        action="Continue shopping"
        onAction={() => navigate('/')}
      />
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <h1>Shopping cart</h1>
      </div>

      <div className={styles.layout}>
        <div>
          {cart.map(item => (
            <article className={styles.item} key={item.id}>
              <button
                className={styles.image}
                type="button"
                onClick={() => navigate(`/product/${item.product.id}`)}
              >
                <img
                  src={getAssetUrl(item.product.images[0])}
                  alt={item.product.name}
                />
              </button>

              <div className={styles.content}>
                <button
                  type="button"
                  className={styles.title}
                  onClick={() => navigate(`/product/${item.product.id}`)}
                >
                  {item.product.name}
                </button>

                <span>
                  {item.product.capacity} · {item.product.color}
                </span>

                <div className={styles.quantity}>
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    −
                  </button>

                  <b>{item.quantity}</b>

                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </button>
                </div>
              </div>

              <strong className={styles.price}>
                ${item.product.priceDiscount * item.quantity}
              </strong>

              <button
                className={styles.remove}
                type="button"
                aria-label="Remove product"
                onClick={() => removeFromCart(item.id)}
              >
                ×
              </button>
            </article>
          ))}
        </div>

        <aside className={styles.summary}>
          <span>Total</span>

          <strong>${cartTotal}</strong>

          <p>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</p>

          <button type="button" onClick={checkout}>
            Checkout
          </button>
        </aside>
      </div>
    </section>
  );
}
