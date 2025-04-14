import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/products`).then(res => setProducts(res.data));
  }, []);

  const login = async () => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      setUser(res.data);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      alert("登入失敗");
    }
  };

  const addToCart = (p) => {
    setCart(prev => [...prev, p]);
  };

  const checkout = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post(
      `${API_BASE}/stripe/create-checkout-session`,
      { items: cart },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    window.location.href = res.data.url;
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">🧋 Mecha Tea 商城</h1>

      {!user && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl mb-2 font-semibold">會員登入</h2>
          <input type="email" placeholder="Email" className="border p-2 w-full mb-2" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="border p-2 w-full mb-2" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={login} className="bg-teal-600 text-white px-4 py-2 rounded">登入</button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p>${p.price}</p>
            <button onClick={() => addToCart(p)} className="bg-yellow-500 text-white px-3 py-1 rounded mt-2">加入購物車</button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 bg-white border shadow rounded p-4">
          <h2 className="text-lg font-bold">🛒 購物車 ({cart.length} 件)</h2>
          <ul className="text-sm mb-2">
            {cart.map((p, idx) => (
              <li key={idx}>{p.name} - ${p.price}</li>
            ))}
          </ul>
          <button onClick={checkout} className="bg-green-600 text-white px-4 py-2 rounded">前往結帳</button>
        </div>
      )}

      <div className="text-center text-sm mt-10 text-gray-400">
        <a href="/admin" className="underline">後台管理登入</a>
      </div>
    </div>
  );
}