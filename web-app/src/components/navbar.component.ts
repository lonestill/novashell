import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { LucideIconComponent } from './lucide-icon.component';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LucideIconComponent],
  template: `
    <nav class="fixed top-0 left-0 right-0 h-[60px] border-b border-white/[0.08] bg-[#0B0C0E]/80 backdrop-blur-xl z-50 flex items-center justify-center px-6 transition-all duration-300">
      <div class="max-w-[1200px] w-full flex items-center justify-between">
        
        <!-- Logo -->
        <div class="flex items-center gap-3 group cursor-pointer">
          <div class="w-6 h-6 rounded bg-gradient-to-tr from-[#5E6AD2] to-[#8C9EFF] flex items-center justify-center shadow-[0_0_10px_rgba(94,106,210,0.4)]">
             <span class="text-[14px] font-bold text-white font-mono">>_</span>
          </div>
          <span class="font-semibold tracking-tight text-[15px]">Nova<span class="text-white/80">Shell</span></span>
        </div>

        <!-- Links -->
        <div class="hidden md:flex items-center gap-6 text-[14px] text-[#8A8F98]">
          <a href="https://github.com/lonestill/novashell#features" target="_blank" class="hover:text-[#F7F8F8] transition-colors">{{ features() }}</a>
          <a href="https://github.com/lonestill/novashell#installation" target="_blank" class="hover:text-[#F7F8F8] transition-colors">{{ installation() }}</a>
          <a href="https://github.com/lonestill/novashell/blob/main/COMMANDS.md" target="_blank" class="hover:text-[#F7F8F8] transition-colors">{{ documentation() }}</a>
          <a href="https://github.com/lonestill/novashell" target="_blank" class="hover:text-[#F7F8F8] transition-colors">{{ github() }}</a>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <a href="https://github.com/lonestill/novashell" target="_blank" class="text-[#8A8F98] hover:text-[#F7F8F8] transition-colors">
            <lucide-icon name="github" [size]="20" className="w-5 h-5" />
          </a>
          <button 
            (click)="toggleLanguage()"
            class="text-[#8A8F98] hover:text-[#F7F8F8] transition-colors text-[13px] font-medium px-2 py-1 rounded">
            {{ langButton() }}
          </button>
          <a href="https://github.com/lonestill/novashell#installation" target="_blank" class="bg-[#F7F8F8] hover:bg-[#D0D3D6] text-black text-[13px] px-3.5 py-1.5 rounded-md transition-all font-medium">
            {{ getStarted() }}
          </a>
        </div>

      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  i18n = inject(I18nService);
  
  features = computed(() => this.i18n.t('nav.features'));
  installation = computed(() => this.i18n.t('nav.installation'));
  documentation = computed(() => this.i18n.t('nav.documentation'));
  github = computed(() => this.i18n.t('nav.github'));
  getStarted = computed(() => this.i18n.t('nav.getStarted'));
  langButton = computed(() => this.i18n.currentLanguage() === 'ru' ? 'EN' : 'RU');
  
  toggleLanguage() {
    this.i18n.setLanguage(this.i18n.currentLanguage() === 'ru' ? 'en' : 'ru');
  }
}
