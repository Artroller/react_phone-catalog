import { getAssetUrl } from '../../shared/asset';
import { useShop } from '../../shared/context/ShopContext';

import Breadcrumbs from '../../components/Breadcrumbs';
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

  return (
    <section className={styles.page}>
      <Breadcrumbs
        items={[
          {
            label: 'Home',
            onClick: () => navigate('/'),
          },
          {
            label: 'Cart',
          },
        ]}
      />

      {!cart.length ? (
        <EmptyState
          text="Your cart is empty"
          action="Continue shopping"
          onAction={() => navigate('/')}
        />
      ) : (
        <>
          <h1>Cart</h1>

          <div className={styles.layout}>
            <div className={styles.items}>
              {cart.map(item => (
                <article className={styles.item} key={item.id}>
                  <div className={styles.image}>
                    <img
                      src={getAssetUrl(item.product.images[0])}
                      alt={item.product.name}
                    />
                  </div>

                  <div className={styles.itemContent}>
                    <h2>{item.product.name}</h2>

                    <p>${item.product.priceRegular}</p>

                    <div className={styles.controls}>
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => removeFromCart(item.id)}
                  >
                    ×
                  </button>
                </article>
              ))}
            </div>

            <aside className={styles.summary}>
              <h2>Total</h2>

              <strong>${cartTotal}</strong>

              <p>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</p>

              <button type="button" onClick={checkout}>
                Checkout
              </button>
            </aside>
          </div>
        </>
      )}
    </section>
  );
}
