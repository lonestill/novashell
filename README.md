

# 🚀 NovaShell

<p align="center">
  <img src="https://img.shields.io/github/license/lonestill/novashell?style=for-the-badge&color=5D2FBC" alt="license">
  <img src="https://img.shields.io/github/stars/lonestill/novashell?style=for-the-badge&color=5D2FBC" alt="stars">
  <img src="https://img.shields.io/github/v/release/lonestill/novashell?style=for-the-badge&color=5D2FBC" alt="version">
  <img src="https://img.shields.io/badge/Node.js-%3E%3D16.0.0-brightgreen?style=for-the-badge&logo=node.js" alt="node version">
</p>

<p align="center">
  <strong>NovaShell</strong> is a powerful, cross-platform CLI shell built with Node.js. It bridges the gap between traditional system shells and modern developer needs, offering built-in productivity tools and seamless JavaScript extensibility.
</p>

---

## ✨ Key Features

* 🚀 **Interactive Environment**: A full-featured interactive shell with a beautiful colored prompt.
* 🌍 **Cross-Platform**: Consistent experience across Windows, macOS, and Linux.
* ⚙️ **Extensible via JS**: Create custom commands using simple strings or full JavaScript files.
* 🔍 **Smart Workflow**: Context-aware auto-completion (Tab) and command history navigation.
* 📋 **Built-in Productivity**: Integrated **Todo List** and **Directory Bookmarks** to keep you focused.
* 📊 **Deep Insights**: Command usage statistics and detailed system information at your fingertips.
* 🎨 **Theming Engine**: Fully customizable themes to match your terminal aesthetics.

---


```bash
# Example usage
novashell > sysinfo
novashell > todo add "Refactor the parser"
novashell > bookmark save current_project

```

---

## ⚡ Quick Start

### Automatic Installation (Recommended)

**Linux / macOS:**

```bash
curl -fsSL [https://raw.githubusercontent.com/lonestill/novashell/main/install.sh](https://raw.githubusercontent.com/lonestill/novashell/main/install.sh) | bash

```

**Windows (PowerShell):**

```powershell
iwr -useb [https://raw.githubusercontent.com/lonestill/novashell/main/install.ps1](https://raw.githubusercontent.com/lonestill/novashell/main/install.ps1) | iex

```

### Manual Installation

1. **Clone the repository:**
```bash
git clone [https://github.com/lonestill/novashell](https://github.com/lonestill/novashell)
cd novashell

```


2. **Install dependencies:**
```bash
npm install

```


3. **Link globally:**
```bash
npm link

```



---

## 🛠 Command Reference

NovaShell supports all your standard system commands (`git`, `npm`, `python`, etc.) plus these built-in power-ups:

| Category | Commands | Description |
| --- | --- | --- |
| **Navigation** | `cd`, `ls`, `pwd`, `bookmark` | Enhanced file system navigation |
| **File Ops** | `cat`, `type`, `echo` | Quick file viewing and output |
| **System** | `sysinfo`, `env`, `history` | Monitor system and session state |
| **Productivity** | `todo`, `clear` | Manage tasks and workspace |
| **Config** | `config`, `themes` | Personalize your shell experience |

> 📖 **Full Documentation**: Check out [COMMANDS.md](https://www.google.com/search?q=COMMANDS.md) for detailed descriptions and examples.

---

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
Developed with ❤️ by <a href="https://www.google.com/search?q=https://github.com/lonestill">lonestill</a>
</p>
