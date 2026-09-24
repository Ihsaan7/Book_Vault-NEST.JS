# 📚 BookVault — My NestJS Learning Journey

Hey! This repo isn't just a project. It's proof that I finally "got" NestJS.

I came from writing raw Express APIs — I knew what controllers, services, and middleware did. But NestJS felt intimidating at first. All the decorators, the @Injectable(), the modules... it looked like magic I didn't understand.

So instead of copy-pasting tutorials, I built **one tiny thing at a time**. Before every new feature, I asked myself:
- What is this?
- Why do we need it?
- What could go wrong?
- How does it flow?

This is called the **Mental Model approach** — understand it before you code it. It changed everything for me.

---

## 🧠 What I Actually Learned

This project taught me more than any tutorial:

- **Modules aren't folders** — they're containers that group related code + wire dependencies automatically
- **Decorators are just metadata** — `@Get()` is literally saying "NestJS, hook this method to GET /path"
- **Dependency Injection isn't scary** — when you write `constructor(private service: Service)`, NestJS auto-wires it for you. No manual `new`.
- **Guards = Middleware** — but cleaner, with DI built-in
- **Pipes = Validation + Transformation** — `@Body()` with a DTO automatically rejects bad input
- **Exception Filters = Custom Error Middleware** — catches ALL thrown errors, formats them the same way

The biggest realization? **NestJS is just Express with rules.** Under the hood, it's still an Express server. NestJS just gives you structure so you don't end up with spaghetti code at scale.

---

## 🛠️ Tech Stack
- NestJS + TypeScript
- SQLite + sqlite3 driver
- JWT + bcryptjs
- class-validator + class-transformer

---

## ✨ Features Built
- Auth (register, login, JWT, profile)
- Books CRUD with filters (admin-only mutations)
- Borrow/Return system
- Reviews + ratings with averages
- User dashboard with stats
- Role-based access (USER, ADMIN)

---

## 🎯 My Takeaway

NestJS made me appreciate **convention over configuration**. I no longer have to decide *where* files go or *how* errors get caught. The framework decides, and I focus on business logic.

If you're learning NestJS and feel overwhelmed — build one endpoint at a time. Mental model first. Code second.

---

Built while learning. Still learning. 🧠
