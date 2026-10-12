
import { useState } from 'react'
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
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)

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
                  onClick={() =>
                    alert('Cart ready! We will build checkout next.')
                  }
                >
                  Continue to checkout →
                </button>
              </>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        QuickBite. Made for food lovers ❤️
      </footer>
    </div>
  )
}

export default App
