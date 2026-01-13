
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LucideIconComponent } from './lucide-icon.component';

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
            <span>Intelligent Engine</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-semibold text-[#F7F8F8] mb-6 tracking-tight">It understands what you mean.</h2>
          <p class="text-[#8A8F98] text-lg leading-relaxed mb-8">
            NovaShell comes with built-in typo detection and layout correction. 
            It analyzes your input and suggests corrections using Levenshtein distance algorithms, 
            even if you typed in the wrong keyboard layout.
          </p>
          
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-[#28C840]/10 flex items-center justify-center mt-0.5 shrink-0">
                <lucide-icon name="check" [size]="14" className="w-3.5 h-3.5 text-[#28C840]" [strokeWidth]="3" />
              </div>
              <div>
                <strong class="text-[#F7F8F8] block mb-1">Typo Detection</strong>
                <span class="text-[#8A8F98] text-sm">Automatically detects "helpp" as "help" and suggests fixes.</span>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-[#28C840]/10 flex items-center justify-center mt-0.5 shrink-0">
                <lucide-icon name="check" [size]="14" className="w-3.5 h-3.5 text-[#28C840]" [strokeWidth]="3" />
              </div>
              <div>
                <strong class="text-[#F7F8F8] block mb-1">Cyrillic/Layout Fix</strong>
                <span class="text-[#8A8F98] text-sm">Translates accidental layout switches (e.g. "сгкд" → "curl").</span>
              </div>
            </li>
             <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-[#28C840]/10 flex items-center justify-center mt-0.5 shrink-0">
                <lucide-icon name="check" [size]="14" className="w-3.5 h-3.5 text-[#28C840]" [strokeWidth]="3" />
              </div>
              <div>
                <strong class="text-[#F7F8F8] block mb-1">Contextual History</strong>
                <span class="text-[#8A8F98] text-sm">Filters history by current directory, git branch, or success status.</span>
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
           <h2 class="text-3xl font-semibold text-[#F7F8F8] mb-4">Developer Power Tools</h2>
           <p class="text-[#8A8F98] text-lg">Everything you usually install separate packages for, now built-in.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <!-- Card 1: Random -->
          <div class="p-5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
            <div class="text-[#C678DD] font-mono text-sm mb-3">random</div>
            <h3 class="text-white font-medium mb-2">Data Generator</h3>
            <p class="text-[#8A8F98] text-sm leading-relaxed mb-3">Generate UUIDs, hex strings, random bytes, or fake commit messages instantly.</p>
            <div class="font-mono text-[10px] text-[#8A8F98] bg-black/30 p-2 rounded group-hover:text-[#F7F8F8] transition-colors">
              $ random uuid<br>
              <span class="text-[#98C379]">a1b2c3d4-e5f6...</span>
            </div>
          </div>

          <!-- Card 2: JSON -->
          <div class="p-5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
            <div class="text-[#E5C07B] font-mono text-sm mb-3">json</div>
            <h3 class="text-white font-medium mb-2">JSON Processor</h3>
            <p class="text-[#8A8F98] text-sm leading-relaxed mb-3">Format, validate, minify, or extract specific fields from JSON files directly.</p>
            <div class="font-mono text-[10px] text-[#8A8F98] bg-black/30 p-2 rounded group-hover:text-[#F7F8F8] transition-colors">
              $ json format data.json<br>
              <span class="text-[#98C379]">✓ formatted</span>
            </div>
          </div>

          <!-- Card 3: Session -->
          <div class="p-5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
            <div class="text-[#61AFEF] font-mono text-sm mb-3">session</div>
            <h3 class="text-white font-medium mb-2">Workflow Saver</h3>
            <p class="text-[#8A8F98] text-sm leading-relaxed mb-3">Save your current terminal state and command history to restore later.</p>
            <div class="font-mono text-[10px] text-[#8A8F98] bg-black/30 p-2 rounded group-hover:text-[#F7F8F8] transition-colors">
              $ session save deploy<br>
              <span class="text-[#98C379]">Session saved.</span>
            </div>
          </div>

           <!-- Card 4: Stats -->
          <div class="p-5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
            <div class="text-[#E06C75] font-mono text-sm mb-3">stats</div>
            <h3 class="text-white font-medium mb-2">Usage Analytics</h3>
            <p class="text-[#8A8F98] text-sm leading-relaxed mb-3">Visualize your most used commands, directories, and git branches.</p>
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
export class FeaturesComponent {}
