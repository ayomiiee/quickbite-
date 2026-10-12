
import { useState } from 'react'
import './App.css'

const foods = [
  { id: 1, name: 'Classic Beef Burger', category: 'Burgers', price: 4500, emoji: '🍔' },
  { id: 2, name: 'Pepperoni Pizza', category: 'Pizza', price: 7500, emoji: '🍕' },
  { id: 3, name: 'Fried Chicken', category: 'Chicken', price: 6000, emoji: '🍗' },
  { id: 4, name: 'Fresh Salad', category: 'Healthy', price: 4000, emoji: '🥗' },
]

function App() {
  const [search, setSearch] = useState('')
  const [cartCount, setCartCount] = useState(0)

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="#">Quick<span>Bite.</span></a>
        <nav>
          <a href="#home">Home</a>
          <a href="#menu">Our Menu</a>
        </nav>
        <button onClick={() => alert(`You have ${cartCount} items in your cart.`)}>
          🛒 Cart ({cartCount})
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <p className="eyebrow">GOOD FOOD, GOOD MOOD</p>
          <h1>Delicious food.<br /><span>Delivered to you.</span></h1>
          <p>Your favourite meals, freshly prepared and delivered to your door.</p>
          <a className="primary-button" href="#menu">Explore our menu ↓</a>
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
                    <strong>₦{food.price.toLocaleString('en-NG')}</strong>
                    <button onClick={() => setCartCount((count) => count + 1)}>
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredFoods.length === 0 && <p>No food found. Try another search!</p>}
        </section>
      </main>

      <footer className="footer">
        QuickBite. Made for food lovers ❤️
      </footer>
    </div>
  )
}

export default App
