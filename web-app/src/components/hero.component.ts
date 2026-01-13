import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { SnippetComponent } from './snippet.component';
import { NgStyle } from '@angular/common';
import { LucideIconComponent } from './lucide-icon.component';
import { ConsoleComponent } from './console.component';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [SnippetComponent, NgStyle, LucideIconComponent, ConsoleComponent],
  template: `
    <section class="w-full max-w-[1200px] px-6 pt-32 pb-24 flex flex-col items-center text-center perspective-container">
      
      <!-- Title -->
      <h1 class="text-5xl md:text-[80px] leading-[1.1] font-semibold tracking-[-0.02em] text-[#F7F8F8] mb-8 animate-fade-in-up opacity-0" style="animation-delay: 200ms">
        {{ title1() }} <br class="hidden md:block" />
        <span class="text-transparent bg-clip-text bg-gradient-to-b from-[#5E6AD2] to-[#8C9EFF]">{{ titleModern() }}</span>
      </h1>

      <!-- Subtitle -->
      <p class="text-[19px] md:text-[21px] text-[#8A8F98] max-w-2xl mb-12 leading-relaxed tracking-tight animate-fade-in-up opacity-0" style="animation-delay: 300ms">
        {{ subtitle() }} <br class="hidden md:block"/>
        {{ subtitle2() }}
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center gap-4 mb-20 animate-fade-in-up opacity-0" style="animation-delay: 400ms">
         <app-snippet />
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
export class HeroComponent {
  i18n = inject(I18nService);
  
  // Computed translations for reactivity
  title1 = computed(() => this.i18n.t('hero.title'));
  titleModern = computed(() => this.i18n.t('hero.titleModern'));
  subtitle = computed(() => this.i18n.t('hero.subtitle'));
  subtitle2 = computed(() => this.i18n.t('hero.subtitle2'));
}
