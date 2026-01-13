import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { LucideIconComponent } from './lucide-icon.component';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [LucideIconComponent],
  template: `
    <section class="w-full max-w-[1200px] px-6 py-24 flex flex-col gap-24 border-t border-white/[0.06]">
      
      <!-- Smart Features Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5E6AD2]/10 text-[#5E6AD2] text-xs font-medium mb-6 border border-[#5E6AD2]/20">
            <span>{{ intelligent() }}</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-semibold text-[#F7F8F8] mb-6 tracking-tight">{{ title() }}</h2>
          <p class="text-[#8A8F98] text-lg leading-relaxed mb-8">
            {{ desc() }}
          </p>
          
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-[#28C840]/10 flex items-center justify-center mt-0.5 shrink-0">
                <lucide-icon name="check" [size]="14" className="w-3.5 h-3.5 text-[#28C840]" [strokeWidth]="3" />
              </div>
              <div>
                <strong class="text-[#F7F8F8] block mb-1">{{ typo() }}</strong>
                <span class="text-[#8A8F98] text-sm">{{ typoDesc() }}</span>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-[#28C840]/10 flex items-center justify-center mt-0.5 shrink-0">
                <lucide-icon name="check" [size]="14" className="w-3.5 h-3.5 text-[#28C840]" [strokeWidth]="3" />
              </div>
              <div>
                <strong class="text-[#F7F8F8] block mb-1">{{ layout() }}</strong>
                <span class="text-[#8A8F98] text-sm">{{ layoutDesc() }}</span>
              </div>
            </li>
             <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-[#28C840]/10 flex items-center justify-center mt-0.5 shrink-0">
                <lucide-icon name="check" [size]="14" className="w-3.5 h-3.5 text-[#28C840]" [strokeWidth]="3" />
              </div>
              <div>
                <strong class="text-[#F7F8F8] block mb-1">{{ history() }}</strong>
                <span class="text-[#8A8F98] text-sm">{{ historyDesc() }}</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Visual -->
        <div class="rounded-xl border border-white/[0.08] bg-[#0F1014] p-6 font-mono text-sm relative overflow-hidden shadow-2xl group hover:border-white/20 transition-colors">
           <div class="absolute inset-0 bg-gradient-to-br from-[#5E6AD2]/5 to-transparent pointer-events-none"></div>
           
           <!-- Interaction 1 -->
           <div class="mb-6">
             <div class="flex items-center gap-2 mb-2">
               <span class="text-[#28C840]">➜</span>
               <span class="text-[#56B6C2]">~</span>
               <span class="text-white">git stauts</span>
             </div>
             <div class="text-[#E06C75] mb-1">Command "git stauts" not found.</div>
             <div class="text-[#8A8F98]">Did you mean: <span class="text-[#98C379] font-bold">git status</span>?</div>
           </div>

           <!-- Interaction 2 -->
           <div class="mb-2">
             <div class="flex items-center gap-2 mb-2">
               <span class="text-[#28C840]">➜</span>
               <span class="text-[#56B6C2]">~</span>
               <span class="text-white">сгкд google.com</span>
             </div>
             <div class="text-[#E5C07B] mb-1">Cyrillic layout detected.</div>
             <div class="text-[#8A8F98]">Executing: <span class="text-[#98C379] font-bold">curl google.com</span></div>
           </div>
        </div>
      </div>

      <!-- Utilities Grid -->
      <div>
        <div class="mb-12 text-center md:text-left">
           <h2 class="text-3xl font-semibold text-[#F7F8F8] mb-4">{{ tools() }}</h2>
           <p class="text-[#8A8F98] text-lg">{{ toolsDesc() }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <!-- Card 1: Random -->
          <div class="p-5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
            <div class="text-[#C678DD] font-mono text-sm mb-3">random</div>
            <h3 class="text-white font-medium mb-2">{{ random() }}</h3>
            <p class="text-[#8A8F98] text-sm leading-relaxed mb-3">{{ randomDesc() }}</p>
            <div class="font-mono text-[10px] text-[#8A8F98] bg-black/30 p-2 rounded group-hover:text-[#F7F8F8] transition-colors">
              $ random uuid<br>
              <span class="text-[#98C379]">a1b2c3d4-e5f6...</span>
            </div>
          </div>

          <!-- Card 2: JSON -->
          <div class="p-5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
            <div class="text-[#E5C07B] font-mono text-sm mb-3">json</div>
            <h3 class="text-white font-medium mb-2">{{ json() }}</h3>
            <p class="text-[#8A8F98] text-sm leading-relaxed mb-3">{{ jsonDesc() }}</p>
            <div class="font-mono text-[10px] text-[#8A8F98] bg-black/30 p-2 rounded group-hover:text-[#F7F8F8] transition-colors">
              $ json format data.json<br>
              <span class="text-[#98C379]">{{ formatted() }}</span>
            </div>
          </div>

          <!-- Card 3: Session -->
          <div class="p-5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
            <div class="text-[#61AFEF] font-mono text-sm mb-3">session</div>
            <h3 class="text-white font-medium mb-2">{{ session() }}</h3>
            <p class="text-[#8A8F98] text-sm leading-relaxed mb-3">{{ sessionDesc() }}</p>
            <div class="font-mono text-[10px] text-[#8A8F98] bg-black/30 p-2 rounded group-hover:text-[#F7F8F8] transition-colors">
              $ session save deploy<br>
              <span class="text-[#98C379]">{{ sessionSaved() }}</span>
            </div>
          </div>

           <!-- Card 4: Stats -->
          <div class="p-5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
            <div class="text-[#E06C75] font-mono text-sm mb-3">stats</div>
            <h3 class="text-white font-medium mb-2">{{ stats() }}</h3>
            <p class="text-[#8A8F98] text-sm leading-relaxed mb-3">{{ statsDesc() }}</p>
            <div class="font-mono text-[10px] text-[#8A8F98] bg-black/30 p-2 rounded group-hover:text-[#F7F8F8] transition-colors">
              $ stats<br>
              <span class="text-[#98C379]">Top: git (42%)</span>
            </div>
          </div>

        </div>
      </div>

    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturesComponent {
  i18n = inject(I18nService);
  
  intelligent = computed(() => this.i18n.t('features.intelligent'));
  title = computed(() => this.i18n.t('features.title'));
  desc = computed(() => this.i18n.t('features.desc'));
  typo = computed(() => this.i18n.t('features.typo'));
  typoDesc = computed(() => this.i18n.t('features.typoDesc'));
  layout = computed(() => this.i18n.t('features.layout'));
  layoutDesc = computed(() => this.i18n.t('features.layoutDesc'));
  history = computed(() => this.i18n.t('features.history'));
  historyDesc = computed(() => this.i18n.t('features.historyDesc'));
  tools = computed(() => this.i18n.t('features.tools'));
  toolsDesc = computed(() => this.i18n.t('features.toolsDesc'));
  random = computed(() => this.i18n.t('features.random'));
  randomDesc = computed(() => this.i18n.t('features.randomDesc'));
  json = computed(() => this.i18n.t('features.json'));
  jsonDesc = computed(() => this.i18n.t('features.jsonDesc'));
  session = computed(() => this.i18n.t('features.session'));
  sessionDesc = computed(() => this.i18n.t('features.sessionDesc'));
  sessionSaved = computed(() => this.i18n.t('features.sessionSaved'));
  stats = computed(() => this.i18n.t('features.stats'));
  statsDesc = computed(() => this.i18n.t('features.statsDesc'));
  formatted = computed(() => this.i18n.t('features.formatted'));
}
