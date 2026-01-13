import { Component, Input, OnChanges, SimpleChanges, Injectable, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { catchError, of, Observable, shareReplay, Subscription } from 'rxjs';

// --- СПИСОК КАСТОМНЫХ ИКОНОК (БРЕНДЫ) ---
// Этих иконок нет в стандартном Lucide, поэтому храним их тут.
const CUSTOM_BRANDS: Record<string, string> = {
  linux: '<path d="M12.001 2c-3.238 0-5.26 2.312-5.26 5.25C6.741 8.783 7 11 7 11h.027c-1.467 1.258-2.6 3.504-2.6 5.375 0 .285.034.56.09.828C2.56 17.58 2 18.598 2 19.375c0 1.25 1.5 2.125 3 2.125 1.05 0 1.956-.379 2.559-1.02.668.61 1.554.996 2.531 1.02h3.82c.977-.024 1.863-.41 2.531-1.02.602.64 1.508 1.02 2.559 1.02 1.5 0 3-.875 3-2.125 0-.777-.56-1.795-2.512-2.172.057-.268.09-.543.09-.828 0-1.871-1.133-4.117-2.6-5.375H17s.258-2.217.258-3.75C17.259 4.312 15.239 2 12.001 2z"/>',
  windows: '<path d="M2 11h9v9H2v-9zm0-9h9v8H2V2zm10 0h10v8H12V2zm0 9h10v9H12v-9z"/>',
  apple: '<path d="M12 2c-.628 1.878-2.022 3.27-3.9 3.9C7.472 4.022 8.865 2.628 8.1 0 9.978.1 11.372 1.372 12 2zM3.828 13.928c-.287-1.706.702-4.132 2.766-5.228C7.54 10.156 6.55 12.384 8.74 13.578c1.642.894 2.892-.128 3.828-1.578.508 1.942-1.306 4.606-3.234 4.606-1.39 0-1.922-.888-3.656-.888-1.794 0-2.392.936-3.704.936C.094 16.654-1.118 10.328 1.766 5.828c1.64-2.556 4.39-2.634 6.234-1.298 1.34-1.002 3.658-.87 5.158.072-3.126 1.826-2.502 6.502 1.046 7.848-.562 1.704-1.922 4.258-4.108 4.258-1.078 0-1.938-.61-3.056-1.306-.992-.614-1.954-1.474-3.212-1.474z"/>'
};

@Injectable({ providedIn: 'root' })
export class LucideIconService {
  private http = inject(HttpClient);
  private iconCache = new Map<string, Observable<string>>();
  
  // CDN для стандартных иконок
  private readonly CDN_URL = 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons';

  getIcon(name: string): Observable<string> {
    const fileName = this.toKebabCase(name);

    // 1. Сначала проверяем наши кастомные бренды
    if (CUSTOM_BRANDS[fileName] || CUSTOM_BRANDS[name]) {
      // Оборачиваем путь в SVG шаблон, чтобы он выглядел как полный файл
      const path = CUSTOM_BRANDS[fileName] || CUSTOM_BRANDS[name];
      const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
      return of(fullSvg);
    }

    // 2. Если в кэше уже есть запрос к CDN - возвращаем его
    if (this.iconCache.has(fileName)) {
      return this.iconCache.get(fileName)!;
    }

    // 3. Идем на CDN
    const url = `${this.CDN_URL}/${fileName}.svg`;
    const request$ = this.http.get(url, { responseType: 'text' }).pipe(
      shareReplay(1),
      catchError(err => {
        console.warn(`Icon not found: ${name}`);
        return of('');
      })
    );

    this.iconCache.set(fileName, request$);
    return request$;
  }

  private toKebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }
}

@Component({
  selector: 'lucide-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      [style.display]="'contents'" 
      [innerHTML]="iconSvg">
    </span>
  `
})
export class LucideIconComponent implements OnChanges, OnDestroy {
  @Input() name!: string;
  @Input() size: number | string = 24;
  @Input() strokeWidth: number | string = 2;
  @Input() className?: string = ''; // Tailwind классы приходят сюда
  
  iconSvg: SafeHtml = '';
  private sub?: Subscription;

  private iconService = inject(LucideIconService);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

  ngOnChanges(changes: SimpleChanges) {
    this.loadIcon();
  }

  private loadIcon() {
    if (!this.name) return;

    this.sub?.unsubscribe();

    this.sub = this.iconService.getIcon(this.name).subscribe(rawSvg => {
      if (!rawSvg) return;

      // Внедряем классы и размеры прямо внутрь SVG строки
      let modifiedSvg = rawSvg
        // Ставим размеры
        .replace(/width="[^"]*"/, `width="${this.size}"`)
        .replace(/height="[^"]*"/, `height="${this.size}"`)
        // Ставим толщину линий
        .replace(/stroke-width="[^"]*"/, `stroke-width="${this.strokeWidth}"`);

      // Самый надежный способ добавить классы - найти открывающий тег <svg и дописать туда class="..."
      // Если класс уже есть в SVG, это может дублироваться, но для CDN иконок там обычно только xmlns
      if (this.className) {
         modifiedSvg = modifiedSvg.replace('<svg', `<svg class="${this.className}"`);
      }

      this.iconSvg = this.sanitizer.bypassSecurityTrustHtml(modifiedSvg);
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}