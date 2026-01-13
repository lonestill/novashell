
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { SnippetComponent } from './snippet.component';
import { NgStyle } from '@angular/common';
import { LucideIconComponent } from './lucide-icon.component';
import { ConsoleComponent } from './console.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [SnippetComponent, NgStyle, LucideIconComponent, ConsoleComponent],
  template: `
    <section class="w-full max-w-[1200px] px-6 pt-32 pb-24 flex flex-col items-center text-center perspective-container">
      
      <!-- Badge -->
      <div class="animate-fade-in-up opacity-0" style="animation-delay: 100ms">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-[13px] text-[#B4BCD0] hover:border-white/[0.16] hover:bg-white/[0.04] transition-all cursor-pointer backdrop-blur-md mb-8 shadow-sm">
          <span class="flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#5E6AD2] text-white tracking-wide">RELEASE</span>
          <span>NovaShell v1.0.0 Available</span>
          <lucide-icon name="chevronRight" [size]="14" className="w-3.5 h-3.5 text-[#8A8F98]" [strokeWidth]="1.5" />
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-5xl md:text-[80px] leading-[1.1] font-semibold tracking-[-0.02em] text-[#F7F8F8] mb-8 animate-fade-in-up opacity-0" style="animation-delay: 200ms">
        The interactive shell for <br class="hidden md:block" />
        <span class="text-transparent bg-clip-text bg-gradient-to-b from-[#5E6AD2] to-[#8C9EFF]">modern developers.</span>
      </h1>

      <!-- Subtitle -->
      <p class="text-[19px] md:text-[21px] text-[#8A8F98] max-w-2xl mb-12 leading-relaxed tracking-tight animate-fade-in-up opacity-0" style="animation-delay: 300ms">
        A custom cross-platform CLI built with Node.js. <br class="hidden md:block"/>
        Smart suggestions, bookmarks, and built-in productivity tools.
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center gap-4 mb-20 animate-fade-in-up opacity-0" style="animation-delay: 400ms">
         <app-snippet />
         <button class="h-12 px-8 rounded-full text-[#F7F8F8] font-medium text-[15px] hover:bg-white/5 transition-all flex items-center gap-2 group">
           Read Documentation
           <lucide-icon name="chevronRight" [size]="16" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" [strokeWidth]="1.5" />
         </button>
      </div>

      <!-- Interactive Console -->
      <div class="relative w-full max-w-[900px] animate-fade-in-up opacity-0" style="animation-delay: 600ms">
        <div class="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#5E6AD2] opacity-[0.2] blur-[100px] rounded-full pointer-events-none"></div>
        <app-console />
      </div>

    </section>
  `,
  styles: [`
    .perspective-container {
      perspective: 2000px;
    }
    
    .terminal-box {
      transform: rotateX(20deg) scale(0.9);
      transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
      transform-style: preserve-3d;
      box-shadow: 
        0 20px 40px -10px rgba(0,0,0,0.5),
        0 0 0 1px rgba(255,255,255,0.05);
    }
    
    .terminal-box:hover {
       transform: rotateX(10deg) scale(0.92) translateY(-10px);
    }

    /* Reveal effect on load */
    .animate-fade-in-up {
      animation: fade-in-up 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }

    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {}
