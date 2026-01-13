
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LucideIconComponent } from './lucide-icon.component';

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
          <a href="#" class="hover:text-[#F7F8F8] transition-colors">Features</a>
          <a href="#" class="hover:text-[#F7F8F8] transition-colors">Installation</a>
          <a href="#" class="hover:text-[#F7F8F8] transition-colors">Documentation</a>
          <a href="#" class="hover:text-[#F7F8F8] transition-colors">Themes</a>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <a href="https://github.com/lonestill/novashell" target="_blank" class="text-[#8A8F98] hover:text-[#F7F8F8] transition-colors">
            <lucide-icon name="github" [size]="20" className="w-5 h-5" />
          </a>
          <button class="bg-[#F7F8F8] hover:bg-[#D0D3D6] text-black text-[13px] px-3.5 py-1.5 rounded-md transition-all font-medium">
            Get Started
          </button>
        </div>

      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {}
