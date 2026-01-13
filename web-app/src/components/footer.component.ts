import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="w-full border-t border-[var(--border-color)] bg-[#0d0e11] py-12 flex justify-center mt-auto">
      <div class="max-w-6xl w-full px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div class="flex items-center gap-2">
           <div class="w-6 h-6 rounded bg-gradient-to-tr from-[#5E6AD2] to-[#8C9EFF] flex items-center justify-center shadow-lg">
             <span class="text-[10px] font-bold text-white">>_</span>
           </div>
           <span class="text-sm text-[var(--text-secondary)]">{{ copyright() }}</span>
        </div>

        <div class="flex items-center gap-6 text-sm text-[var(--text-secondary)]">
          <a href="https://github.com/lonestill/novashell" target="_blank" class="hover:text-white transition-colors">{{ i18n.t('nav.github') }}</a>
          <a href="https://github.com/lonestill/novashell/blob/main/COMMANDS.md" target="_blank" class="hover:text-white transition-colors">{{ i18n.t('nav.documentation') }}</a>
          <a href="https://github.com/lonestill/novashell/issues" target="_blank" class="hover:text-white transition-colors">{{ i18n.t('footer.issues') }}</a>
          <a href="https://github.com/lonestill/novashell/blob/main/LICENSE" target="_blank" class="hover:text-white transition-colors">{{ i18n.t('footer.license') }}</a>
        </div>

      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  i18n = inject(I18nService);
  copyright = computed(() => this.i18n.t('footer.copyright'));
}
