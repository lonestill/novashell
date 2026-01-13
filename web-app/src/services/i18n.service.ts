import { Injectable, signal, computed } from '@angular/core';

export type Language = 'en' | 'ru';

export interface Translations {
  [key: string]: {
    en: string;
    ru: string;
  };
}

const translations: Translations = {
  // Navbar
  'nav.features': { en: 'Features', ru: 'Возможности' },
  'nav.installation': { en: 'Installation', ru: 'Установка' },
  'nav.documentation': { en: 'Documentation', ru: 'Документация' },
  'nav.github': { en: 'GitHub', ru: 'GitHub' },
  'nav.getStarted': { en: 'Get Started', ru: 'Начать' },
  
  // Hero
  'hero.badge': { en: 'NovaShell v1.0.0 Available', ru: 'NovaShell v1.0.0 Доступен' },
  'hero.title': { en: 'The interactive shell for', ru: 'Интерактивная оболочка для' },
  'hero.titleModern': { en: 'modern developers.', ru: 'современных разработчиков.' },
  'hero.subtitle': { en: 'A custom cross-platform CLI built with Node.js.', ru: 'Кросс-платформенный CLI, созданный на Node.js.' },
  'hero.subtitle2': { en: 'Smart suggestions, bookmarks, and built-in productivity tools.', ru: 'Умные подсказки, закладки и встроенные инструменты продуктивности.' },
  'hero.readDocs': { en: 'Read Documentation', ru: 'Читать Документацию' },
  
  // Bento Grid
  'bento.title': { en: 'Power at your fingertips', ru: 'Мощь на кончиках пальцев' },
  'bento.subtitle': { en: "NovaShell isn't just a terminal. It's a complete workspace with productivity tools built-in.", ru: 'NovaShell — это не просто терминал. Это полноценное рабочее пространство со встроенными инструментами продуктивности.' },
  'bento.viewFeatures': { en: 'View all features', ru: 'Все возможности' },
  'bento.crossPlatform': { en: 'Cross-Platform Everywhere', ru: 'Кросс-платформенность везде' },
  'bento.crossPlatformDesc': { en: 'Consistent experience on Windows, macOS, and Linux. Your aliases, history, and config travel with you.', ru: 'Единообразный опыт на Windows, macOS и Linux. Ваши алиасы, история и конфигурация всегда с вами.' },
  'bento.productivity': { en: 'Built-in Productivity', ru: 'Встроенная продуктивность' },
  'bento.productivityDesc': { en: 'Manage tasks, bookmark directories, and track command statistics without leaving your shell.', ru: 'Управляйте задачами, сохраняйте закладки директорий и отслеживайте статистику команд, не выходя из оболочки.' },
  'bento.customizable': { en: 'Extensible & Themed', ru: 'Расширяемый и настраиваемый' },
  'bento.customizableDesc': { en: 'Create custom commands using JavaScript files or simple strings. Customize your prompt with themes to match your aesthetic.', ru: 'Создавайте пользовательские команды с помощью файлов JavaScript или простых строк. Настройте приглашение с помощью тем под ваш вкус.' },
  'bento.todo1': { en: 'Install dependencies', ru: 'Установить зависимости' },
  'bento.todo2': { en: 'Push to production', ru: 'Выгрузить в продакшн' },
  'bento.todo3': { en: 'Update documentation', ru: 'Обновить документацию' },
  
  // Features
  'features.intelligent': { en: 'Intelligent Engine', ru: 'Умный движок' },
  'features.title': { en: 'It understands what you mean.', ru: 'Он понимает, что вы имеете в виду.' },
  'features.desc': { en: 'NovaShell comes with built-in typo detection and layout correction. It analyzes your input and suggests corrections using Levenshtein distance algorithms, even if you typed in the wrong keyboard layout.', ru: 'NovaShell имеет встроенное определение опечаток и исправление раскладки. Он анализирует ваш ввод и предлагает исправления с помощью алгоритмов расстояния Левенштейна, даже если вы печатали в неправильной раскладке клавиатуры.' },
  'features.typo': { en: 'Typo Detection', ru: 'Обнаружение опечаток' },
  'features.typoDesc': { en: 'Automatically detects "helpp" as "help" and suggests fixes.', ru: 'Автоматически определяет "helpp" как "help" и предлагает исправления.' },
  'features.layout': { en: 'Cyrillic/Layout Fix', ru: 'Исправление кириллицы/раскладки' },
  'features.layoutDesc': { en: 'Translates accidental layout switches (e.g. "сгкд" → "curl").', ru: 'Переводит случайные переключения раскладки (например, "сгкд" → "curl").' },
  'features.history': { en: 'Contextual History', ru: 'Контекстная история' },
  'features.historyDesc': { en: 'Filters history by current directory, git branch, or success status.', ru: 'Фильтрует историю по текущей директории, git ветке или статусу успешности.' },
  'features.tools': { en: 'Developer Power Tools', ru: 'Мощные инструменты разработчика' },
  'features.toolsDesc': { en: 'Everything you usually install separate packages for, now built-in.', ru: 'Всё, для чего обычно нужно устанавливать отдельные пакеты, теперь встроено.' },
  'features.random': { en: 'Data Generator', ru: 'Генератор данных' },
  'features.randomDesc': { en: 'Generate UUIDs, hex strings, random bytes, or fake commit messages instantly.', ru: 'Генерируйте UUID, hex-строки, случайные байты или поддельные сообщения коммитов мгновенно.' },
  'features.json': { en: 'JSON Processor', ru: 'Обработчик JSON' },
  'features.jsonDesc': { en: 'Format, validate, minify, or extract specific fields from JSON files directly.', ru: 'Форматируйте, валидируйте, минифицируйте или извлекайте конкретные поля из JSON файлов напрямую.' },
  'features.session': { en: 'Workflow Saver', ru: 'Сохранение рабочего процесса' },
  'features.sessionDesc': { en: 'Save your current terminal state and command history to restore later.', ru: 'Сохраняйте текущее состояние терминала и историю команд для последующего восстановления.' },
  'features.sessionSaved': { en: 'Session saved.', ru: 'Сессия сохранена.' },
  'features.stats': { en: 'Usage Analytics', ru: 'Аналитика использования' },
  'features.statsDesc': { en: 'Visualize your most used commands, directories, and git branches.', ru: 'Визуализируйте наиболее используемые команды, директории и git ветки.' },
  'features.formatted': { en: '✓ formatted', ru: '✓ отформатировано' },
  
  // Footer
  'footer.copyright': { en: '© 2024 NovaShell by lonestill.', ru: '© 2024 NovaShell от lonestill.' },
  'footer.issues': { en: 'Issues', ru: 'Проблемы' },
  'footer.license': { en: 'License', ru: 'Лицензия' },
  
  // Installation
  'install.linux': { en: 'Linux / macOS', ru: 'Linux / macOS' },
  'install.windows': { en: 'Windows', ru: 'Windows' },
  'install.copied': { en: 'Copied', ru: 'Скопировано' },
  'install.readDocs': { en: 'Read Documentation', ru: 'Читать Документацию' },
  
  // Console
  'console.welcome': { en: 'Welcome to NovaShell v1.0.0', ru: 'Добро пожаловать в NovaShell v1.0.0' },
  'console.desc': { en: 'A custom cross-platform CLI shell built with Node.js', ru: 'Кросс-платформенная CLI оболочка, созданная на Node.js' },
  'console.help': { en: 'Type "help" for available commands', ru: 'Введите "help" для доступных команд' },
};

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly STORAGE_KEY = 'novashell-lang';
  
  currentLanguage = signal<Language>(this.detectLanguage());
  
  constructor() {
    // Load from localStorage if available
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved === 'en' || saved === 'ru') {
        this.currentLanguage.set(saved);
      }
    }
  }
  
  private detectLanguage(): Language {
    if (typeof navigator === 'undefined') return 'en';
    
    const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    return langCode === 'ru' ? 'ru' : 'en';
  }
  
  setLanguage(lang: Language) {
    this.currentLanguage.set(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, lang);
    }
  }
  
  t(key: string): string {
    const lang = this.currentLanguage();
    const translation = translations[key];
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    return translation[lang] || translation.en || key;
  }
}
