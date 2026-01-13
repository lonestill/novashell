
import { Component, ChangeDetectionStrategy } from '@angular/core';

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
           <span class="text-sm text-[var(--text-secondary)]">© 2024 NovaShell by lonestill.</span>
        </div>

        <div class="flex items-center gap-6 text-sm text-[var(--text-secondary)]">
          <a href="https://github.com/lonestill/novashell" class="hover:text-white transition-colors">GitHub</a>
          <a href="#" class="hover:text-white transition-colors">Documentation</a>
          <a href="#" class="hover:text-white transition-colors">Issues</a>
          <a href="#" class="hover:text-white transition-colors">License</a>
        </div>

      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {}
