
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { LucideIconComponent } from './lucide-icon.component';

@Component({
  selector: 'app-snippet',
  standalone: true,
  imports: [LucideIconComponent],
  template: `
    <div class="inline-flex items-center gap-2 pl-4 pr-2 py-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-color)] backdrop-blur-sm group hover:border-white/20 transition-all cursor-pointer"
         (click)="copyToClipboard()">
      <span class="font-mono text-[13px] text-[var(--text-secondary)] flex items-center gap-2">
        <span class="text-[#5E6AD2] font-bold">></span>
        curl -fsSL https://raw.githubusercontent.com/lonestill/novashell/main/install.sh | bash
      </span>
      <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors ml-2 relative overflow-hidden">
        @if (copied()) {
          <lucide-icon name="check" [size]="16" className="w-4 h-4 text-green-400" />
        } @else {
          <lucide-icon name="copy" [size]="16" className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-white transition-colors" />
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnippetComponent {
  copied = signal(false);

  copyToClipboard() {
    navigator.clipboard.writeText('curl -fsSL https://raw.githubusercontent.com/lonestill/novashell/main/install.sh | bash');
    this.copied.set(true);
    setTimeout(() => {
      this.copied.set(false);
    }, 2000);
  }
}
