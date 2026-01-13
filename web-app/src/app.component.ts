
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavbarComponent } from './components/navbar.component';
import { HeroComponent } from './components/hero.component';
import { BentoGridComponent } from './components/bento-grid.component';
import { FeaturesComponent } from './components/features.component';
import { FooterComponent } from './components/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, HeroComponent, BentoGridComponent, FeaturesComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col relative overflow-hidden bg-[#0B0C0E] text-[#F7F8F8] font-sans selection:bg-[#5E6AD2] selection:text-white">
      
      <!-- Background Layers -->
      <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        
        <!-- Noise Texture -->
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        
        <!-- 3D Animated Linear Grid (Horizontal only) -->
        <div class="perspective-container absolute inset-0 flex items-center justify-center">
          <div class="grid-3d"></div>
        </div>

        <!-- Fade Mask for Grid (Top and Bottom) -->
        <div class="absolute inset-0 bg-gradient-to-b from-[#0B0C0E] via-transparent to-[#0B0C0E]"></div>
        
        <!-- Primary Glow (Top Center) -->
        <div class="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#5E6AD2] opacity-[0.12] blur-[100px] rounded-full mix-blend-screen animate-pulse-slow"></div>

      </div>
      
      <app-navbar />
      
      <main class="flex-grow z-10 flex flex-col items-center w-full">
        <app-hero />
        <app-bento-grid />
        <app-features />
      </main>

      <app-footer />
    </div>
  `,
  styles: [`
    /* 3D Grid Styles */
    .perspective-container {
      perspective: 1000px;
    }

    .grid-3d {
      position: absolute;
      width: 200vw;
      height: 200vh;
      /* Horizontal lines only for "Linear" look */
      background-image: 
        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 100% 60px; /* Increased gap for retro feel */
      transform: rotateX(70deg) translateY(-100px) translateZ(-200px);
      transform-style: preserve-3d;
      animation: grid-move 3s linear infinite;
      box-shadow: inset 0 0 100px rgba(11, 12, 14, 0.9);
      top: 0%;
      left: -50%;
    }

    @keyframes grid-move {
      0% {
        background-position-y: 0px;
      }
      100% {
        background-position-y: 60px; /* Must match background-size height */
      }
    }

    /* Subtle pulse for the glow */
    .animate-pulse-slow {
      animation: pulse-slow 8s ease-in-out infinite;
    }

    @keyframes pulse-slow {
      0%, 100% { opacity: 0.12; transform: translateX(-50%) scale(1); }
      50% { opacity: 0.18; transform: translateX(-50%) scale(1.1); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
