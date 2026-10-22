
import {  useEffect, useState } from 'react'
const CART_STORAGE_KEY = 'quickbite-cart'
const ORDERS_STORAGE_KEY = 'quickbite-orders'
import './App.css'

type Food = {
  id: number
  name: string
  category: string
  price: number
  emoji: string
}

type CartItem = {
  food: Food
  quantity: number
}

const foods: Food[] = [
  { id: 1, name: 'Classic Beef Burger', category: 'Burgers', price: 4500, emoji: '🍔' },
  { id: 2, name: 'Pepperoni Pizza', category: 'Pizza', price: 7500, emoji: '🍕' },
  { id: 3, name: 'Fried Chicken', category: 'Chicken', price: 6000, emoji: '🍗' },
  { id: 4, name: 'Fresh Salad', category: 'Healthy', price: 4000, emoji: '🥗' },
]


function App() {
  const [search, setSearch] = useState('')

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)

      if (savedCart) {
        return JSON.parse(savedCart) as CartItem[]
      }
    } catch {
      console.error('Could not restore the saved cart.')
    }

    return []
  })

  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
const [customerName, setCustomerName] = useState('')
const [customerPhone, setCustomerPhone] = useState('')
const [deliveryAddress, setDeliveryAddress] = useState('')

type OrderStatus =
  | 'Order Placed'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered'

type Order = {
  orderNumber: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  items: CartItem[]
  total: number
  status: OrderStatus
}

const [completedOrder, setCompletedOrder] = useState<Order | null>(null)
const [orderHistory, setOrderHistory] = useState<Order[]>(() => {
  try {
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY)

    if (savedOrders) {
      return JSON.parse(savedOrders) as Order[]
    }
  } catch {
    console.error('Could not restore order history.')
  }

  return []
})
  useEffect(() => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
}, [cart])
useEffect(() => {
  localStorage.setItem(
    ORDERS_STORAGE_KEY,
    JSON.stringify(orderHistory),
  )
}, [orderHistory])
  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase()),
  )

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  const cartTotal = cart.reduce(
    (total, item) => total + item.food.price * item.quantity,
    0,
  )

  function addToCart(food: Food) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.food.id === food.id)

      if (existingItem) {
        return currentCart.map((item) =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...currentCart, { food, quantity: 1 }]
    })
  }

  function changeQuantity(foodId: number, amount: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.food.id === foodId
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const formatPrice = (price: number) =>
    `₦${price.toLocaleString('en-NG')}`

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="#home">
          Quick<span>Bite.</span>
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#menu">Our Menu</a>
        </nav>

        <button onClick={() => setCartOpen(!cartOpen)}>
          🛒 Cart ({cartCount})
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <p className="eyebrow">GOOD FOOD, GOOD MOOD</p>
          <h1>
            Delicious food.
            <br />
            <span>Delivered to you.</span>
          </h1>
          <p>
            Your favourite meals, freshly prepared and delivered to your door.
          </p>
          <a className="primary-button" href="#menu">
            Explore our menu ↓
          </a>
          <div className="hero-food">🍔</div>
        </section>

        <section className="menu-section" id="menu">
          <p className="eyebrow">MADE FRESH FOR YOU</p>
          <h2>Popular right now</h2>

          <input
            className="search-input"
            type="search"
            placeholder="Search your favourite food..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="food-grid">
            {filteredFoods.map((food) => (
              <article className="food-card" key={food.id}>
                <div className="food-image">{food.emoji}</div>
                <div className="food-details">
                  <p>{food.category}</p>
                  <h3>{food.name}</h3>
                  <div className="food-bottom">
                    <strong>{formatPrice(food.price)}</strong>
                    <button
                      aria-label={`Add ${food.name} to cart`}
                      onClick={() => addToCart(food)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredFoods.length === 0 && (
            <p>No food found. Try another search!</p>
          )}
        </section>

        {cartOpen && (
          <section className="cart-section" id="cart">
            <div className="cart-heading">
              <h2>Your Shopping Cart</h2>
              <button onClick={() => setCartOpen(false)}>Close ✕</button>
            </div>

            {cart.length === 0 ? (
              <p>Your cart is empty. Add something delicious!</p>
            ) : (
              <>
                {cart.map((item) => (
                  <article className="cart-item" key={item.food.id}>
                    <span className="cart-emoji">{item.food.emoji}</span>

                    <div className="cart-item-info">
                      <h3>{item.food.name}</h3>
                      <p>{formatPrice(item.food.price)} each</p>
                      <strong>
                        {formatPrice(item.food.price * item.quantity)}
                      </strong>
                    </div>

                    <div className="quantity-controls">
                      <button
                        aria-label={`Decrease ${item.food.name} quantity`}
                        onClick={() => changeQuantity(item.food.id, -1)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        aria-label={`Increase ${item.food.name} quantity`}
                        onClick={() => changeQuantity(item.food.id, 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-button"
                      onClick={() =>
                        setCart((currentCart) =>
                          currentCart.filter(
                            (cartItem) => cartItem.food.id !== item.food.id,
                          ),
                        )
                      }
                    >
                      Remove
                    </button>
                  </article>
                ))}

                <div className="cart-total">
                  <span>Total</span>
                  <strong>{formatPrice(cartTotal)}</strong>
                </div>

                <button
  className="primary-button"
  onClick={() => {
    if (cart.length > 0) {
      setCheckoutOpen(true)
    }
  }}
>
  Continue to checkout →
</button>
              </>
            )}
          </section>
        )}
        
        {checkoutOpen && (
          <section className="cart-section">
            <h2>Delivery details</h2>
            <p>Where should we deliver your delicious order?</p>

            <form
              onSubmit={(event) => {
  event.preventDefault()

  const order: Order = {
    orderNumber: `QB-${Date.now().toString().slice(-8)}`,
    customerName,
    customerPhone,
    deliveryAddress,
    items: cart.map((item) => ({ ...item })),
    total: cartTotal,
    status: 'Order Placed',
  }

 setCompletedOrder(order)
setOrderHistory((previousOrders) => [
  order,
  ...previousOrders,
])
setCart([])
setCheckoutOpen(false)
setCartOpen(false)
}}
              className="checkout-form"
            >
              <label>
                Full name
                <input
                  required
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Enter your full name"
                />
              </label>

              <label>
                Phone number
                <input
                  required
                  type="tel"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  placeholder="Enter your phone number"
                />
              </label>

              <label>
                Delivery address
                <textarea
                  required
                  value={deliveryAddress}
                  onChange={(event) => setDeliveryAddress(event.target.value)}
                  placeholder="Enter your complete delivery address"
                  rows={3}
                />
              </label>

              <div className="cart-total">
                <span>Order total</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>

              <button className="primary-button" type="submit">
                Confirm details
              </button>

              <button
                className="cancel-button"
                type="button"
                onClick={() => setCheckoutOpen(false)}
              >
                Back to shopping
              </button>
            </form>
          </section>
        )}
{completedOrder && (
  <section className="cart-section order-confirmation">
    <div className="success-icon">✓</div>

    <p className="eyebrow">ORDER CONFIRMED</p>

    <h2>Thank you, {completedOrder.customerName}!</h2>

    <p>Your demo order has been recorded in this page.</p>
<p className="order-status">
  status: {completedOrder.status ?? 'Order Placed'}
</p>
    <div className="order-reference">
      <span>Order reference</span>
      <strong>{completedOrder.orderNumber}</strong>
    </div>

    <h3>Order summary</h3>

    {completedOrder.items.map((item) => (
      <div className="order-summary-item" key={item.food.id}>
        <span>
          {item.food.emoji} {item.food.name} × {item.quantity}
        </span>
        <strong>
          {formatPrice(item.food.price * item.quantity)}
        </strong>
      </div>
    ))}

    <div className="cart-total">
      <span>Total</span>
      <strong>{formatPrice(completedOrder.total)}</strong>
    </div>

    <div className="delivery-summary">
      <h3>Delivery details</h3>
      <p>{completedOrder.customerPhone}</p>
      <p>{completedOrder.deliveryAddress}</p>
    </div>

    <button
      className="primary-button"
      onClick={() => {
        setCompletedOrder(null)
        setCustomerName('')
        setCustomerPhone('')
        setDeliveryAddress('')
        setSearch('')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
    >
      Order more food
    </button>
  </section>
)}

<section className="cart-section order-history">
  <h2>Your Order History</h2>

  {orderHistory.length === 0 ? (
    <p>Your previous orders will appear here.</p>
  ) : (
    orderHistory.map((order) => (
      <article className="history-card" key={order.orderNumber}>
        <div className="history-heading">
          <strong>{order.orderNumber}</strong>
          <strong>{formatPrice(order.total)}</strong>
        </div>
<p className= "order-status"> 
  Status: {order.status ?? 'Order Placed'}
</p>
<label>
  Update status:
  <select
    value={order.status ?? 'Order Placed'}
    onChange={(event) => {
      const newStatus = event.target.value as OrderStatus

      setOrderHistory((previousOrders) =>
        previousOrders.map((previousOrder) =>
          previousOrder.orderNumber === order.orderNumber
            ? { ...previousOrder, status: newStatus }
            : previousOrder,
        ),
      )

      if (completedOrder?.orderNumber === order.orderNumber) {
        setCompletedOrder((previousOrder) =>
          previousOrder
            ? { ...previousOrder, status: newStatus }
            : null,
        )
      }
    }}
  >
    <option value="Order Placed">Order Placed</option>
    <option value="Preparing">Preparing</option>
    <option value="Out for Delivery">Out for Delivery</option>
    <option value="Delivered">Delivered</option>
  </select>
</label>
        <p>{order.customerName}</p>

        {order.items.map((item) => (
          <p key={item.food.id}>
            {item.food.emoji} {item.food.name} × {item.quantity}
          </p>
        ))}
      </article>
    ))
  )}
</section>

      </main>
      <footer className="footer">
        QuickBite. Made for food lovers ❤️
      </footer>
    </div>
  )
}

export default App
