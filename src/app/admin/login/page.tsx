"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="container py-10 max-w-md">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); signIn("credentials", { email, password, callbackUrl: "/admin" }); }}>
        <input className="w-full rounded border p-2" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full rounded border p-2" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="rounded bg-brand px-4 py-2 text-white">Sign in</button>
      </form>
    </div>
  );
}
