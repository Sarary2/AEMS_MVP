// client/src/components/Register.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMsg("✅ Registered successfully!");
    } catch (error) {
      console.error(error);
      setMsg("❌ " + error.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-2">Register</h2>
      <form onSubmit={handleRegister} className="space-y-3">
        <input
          type="email"
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Register
        </button>
        {msg && <p className="text-sm mt-2">{msg}</p>}
      </form>
    </div>
  );
}
