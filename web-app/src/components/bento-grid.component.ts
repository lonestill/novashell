import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { LucideIconComponent } from './lucide-icon.component';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-bento-grid',
  standalone: true,
  imports: [LucideIconComponent],
  template: `
    <section class="w-full max-w-[1200px] px-6 py-24 border-t border-white/[0.06]">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div>
          <h2 class="text-3xl md:text-4xl font-semibold text-[#F7F8F8] mb-4 tracking-tight">{{ title() }}</h2>
          <p class="text-[#8A8F98] text-lg max-w-md">{{ subtitle() }}</p>
        </div>
        <a href="https://github.com/lonestill/novashell#features" target="_blank" class="text-[#F7F8F8] text-sm font-medium hover:text-[#5E6AD2] transition-colors flex items-center gap-1 group">
          {{ viewFeatures() }}
          <lucide-icon name="chevronRight" [size]="16" className="w-4 h-4 group-hover:translate-x-1 transition-transform" [strokeWidth]="1.5" />
        </a>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Large Card: Cross Platform -->
        <div class="col-span-1 md:col-span-2 group relative rounded-xl bg-[#0F1014] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 overflow-hidden min-h-[400px]">
           <!-- Inner glow on hover -->
           <div class="absolute inset-0 bg-radial-gradient from-[#5E6AD2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
           
           <div class="relative p-10 h-full flex flex-col z-10">
              <div class="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center mb-6 border border-white/[0.05]">
                <lucide-icon name="globe" [size]="24" className="w-6 h-6 text-[#F7F8F8]" />
              </div>
              <h3 class="text-2xl font-medium text-[#F7F8F8] mb-3">{{ crossPlatform() }}</h3>
              <p class="text-[#8A8F98] text-[15px] leading-relaxed max-w-sm">{{ crossPlatformDesc() }}</p>
              
              <div class="mt-auto pt-10 relative flex gap-8 justify-center md:justify-start">
                 <!-- OS Icons visual -->
                 <div class="flex flex-col items-center gap-2 group/icon hover:-translate-y-1 transition-transform">
                    <span class="text-xs text-[#8A8F98] font-mono">Linux</span>
                 </div>
                 <div class="flex flex-col items-center gap-2 group/icon hover:-translate-y-1 transition-transform">
                    <span class="text-xs text-[#8A8F98] font-mono">Windows</span>
                 </div>
                 <div class="flex flex-col items-center gap-2 group/icon hover:-translate-y-1 transition-transform">
                    <span class="text-xs text-[#8A8F98] font-mono">macOS</span>
                 </div>
              </div>
           </div>
        </div>

        <!-- Tall Card: Productivity -->
        <div class="col-span-1 group relative rounded-xl bg-[#0F1014] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 overflow-hidden">
           <div class="relative p-10 h-full z-10 flex flex-col">
              <div class="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center mb-6 border border-white/[0.05]">
                 <lucide-icon name="checkCircle" [size]="24" className="w-6 h-6 text-[#F7F8F8]" />
              </div>
              <h3 class="text-xl font-medium text-[#F7F8F8] mb-3">{{ productivity() }}</h3>
              <p class="text-[#8A8F98] text-[15px] leading-relaxed mb-6">{{ productivityDesc() }}</p>
              
              <!-- Todo List Visual -->
              <div class="flex-1 bg-[#0A0B0E] border border-white/10 rounded-lg p-3 font-mono text-xs">
                 <div class="flex items-center gap-2 mb-2 text-green-400">
                   <div class="w-3 h-3 rounded-full border border-current flex items-center justify-center text-[8px]">✓</div>
                   <span class="line-through opacity-50">{{ todo1() }}</span>
                 </div>
                 <div class="flex items-center gap-2 mb-2 text-white">
                   <div class="w-3 h-3 rounded-full border border-gray-600"></div>
                   <span>{{ todo2() }}</span>
                 </div>
                 <div class="flex items-center gap-2 text-white">
                   <div class="w-3 h-3 rounded-full border border-gray-600"></div>
                   <span>{{ todo3() }}</span>
                 </div>
              </div>

              <div class="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#5E6AD2]/10 to-transparent opacity-50 pointer-events-none"></div>
           </div>
        </div>

        <!-- Wide Card: Customization -->
        <div class="col-span-1 md:col-span-3 group relative rounded-xl bg-[#0F1014] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
           <div class="p-10 flex-1 z-10">
              <div class="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center mb-6 border border-white/[0.05]">
                 <lucide-icon name="settings" [size]="24" className="w-6 h-6 text-[#F7F8F8]" />
              </div>
              <h3 class="text-xl font-medium text-[#F7F8F8] mb-3">{{ customizable() }}</h3>
              <p class="text-[#8A8F98] text-[15px] leading-relaxed max-w-lg">
                {{ customizableDesc() }}
              </p>
           </div>
           
           <div class="relative w-full md:w-1/2 min-h-[200px] md:min-h-0 bg-[#0A0B0E] border-l border-white/[0.08] flex flex-col items-center justify-center overflow-hidden font-mono text-xs">
              <!-- Grid pattern background -->
              <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
              
              <div class="relative z-10 w-3/4 bg-[#1E2025] rounded border border-white/10 p-3 shadow-xl transform group-hover:scale-105 transition-transform" style="white-space: pre;">
                 <div><span class="text-[#C678DD]">export default async</span> <span class="text-[#61AFEF]">function</span> <span class="text-[#E5C07B]">command</span>(<span class="text-[#E06C75]">args</span>) &#123;</div>
                 <div class="pl-4 text-[#ABB2BF]">  console.log(<span class="text-[#98C379]">'Hello World!'</span>);</div>
                 <div class="pl-4 text-[#ABB2BF]">  <span class="text-[#C678DD]">return</span> <span class="text-[#D19A66]">0</span>;</div>
                 <div>&#125;</div>
              </div>
           </div>
        </div>

      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BentoGridComponent {
  i18n = inject(I18nService);
  
  title = computed(() => this.i18n.t('bento.title'));
  subtitle = computed(() => this.i18n.t('bento.subtitle'));
  viewFeatures = computed(() => this.i18n.t('bento.viewFeatures'));
  crossPlatform = computed(() => this.i18n.t('bento.crossPlatform'));
  crossPlatformDesc = computed(() => this.i18n.t('bento.crossPlatformDesc'));
  productivity = computed(() => this.i18n.t('bento.productivity'));
  productivityDesc = computed(() => this.i18n.t('bento.productivityDesc'));
  customizable = computed(() => this.i18n.t('bento.customizable'));
  customizableDesc = computed(() => this.i18n.t('bento.customizableDesc'));
  todo1 = computed(() => this.i18n.t('bento.todo1'));
  todo2 = computed(() => this.i18n.t('bento.todo2'));
  todo3 = computed(() => this.i18n.t('bento.todo3'));
}
