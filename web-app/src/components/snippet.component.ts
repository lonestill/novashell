import { Component, ChangeDetectionStrategy, signal, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from './lucide-icon.component';
import { I18nService } from '../services/i18n.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

type PlatformGroup = 'unix' | 'windows';

interface InstallCommand {
  id: PlatformGroup;
  labelKey: string;
  command: string;
  icon: string;
}

@Component({
  selector: 'app-snippet',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  template: `
    <div class="flex flex-col items-center w-full max-w-3xl mx-auto p-4">
      
      <div class="relative w-full group mb-8">
        <div class="absolute -inset-0.5 bg-gradient-to-r from-[#5E6AD2]/30 to-purple-600/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        
        <div class="relative bg-[#0F1117] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col">
          
          <div class="grid grid-cols-2 p-1 bg-white/[0.03] border-b border-white/5">
            @for (cmd of installCommands; track cmd.id) {
              <button 
                (click)="selectPlatform(cmd.id)"
                class="relative flex items-center justify-center gap-2 py-2.5 text-[13px] font-medium transition-all duration-300 rounded-lg group/tab"
                [class.text-white]="selectedPlatform() === cmd.id"
                [class.text-[#8A8F98]]="selectedPlatform() !== cmd.id"
                [class.bg-white/[0.08]]="selectedPlatform() === cmd.id"
                [class.shadow-sm]="selectedPlatform() === cmd.id"
                [class.hover:text-gray-300]="selectedPlatform() !== cmd.id"
              >
                <lucide-icon 
                  [name]="cmd.icon" 
                  [size]="15" 
                  [class]="selectedPlatform() === cmd.id ? 'text-[#5E6AD2]' : 'text-gray-500'"
                />
                <span>{{ getLabel(cmd.labelKey) }}</span>
                
                @if (selectedPlatform() === cmd.id) {
                  <div class="absolute inset-0 rounded-lg border border-white/10 pointer-events-none"></div>
                }
              </button>
            }
          </div>

          <div class="relative flex items-center justify-between p-4 sm:p-5 bg-[#0F1117]">
            
            <div class="font-mono text-[13px] sm:text-[14px] text-gray-300 overflow-x-auto whitespace-nowrap scrollbar-hide mr-4">
              <span class="text-[#5E6AD2] font-bold select-none mr-3">$</span>
              <span [innerHTML]="formatCommand(currentCommand().command)"></span>
            </div>

            <button 
              (click)="copyToClipboard()"
              class="flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-lg transition-all duration-200 border border-transparent"
              [class.bg-green-500/10]="copied()"
              [class.text-green-400]="copied()"
              [class.border-green-500/20]="copied()"
              [class.bg-white/5]="!copied()"
              [class.text-gray-400]="!copied()"
              [class.hover:bg-white/10]="!copied()"
              [class.hover:text-white]="!copied()"
            >
              @if (copied()) {
                <div class="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                  <lucide-icon name="check" [size]="16" />
                  <span class="hidden sm:block text-xs font-medium">{{ getLabel('install.copied') }}</span>
                </div>
              } @else {
                <lucide-icon name="copy" [size]="16" />
              }
            </button>
          </div>
        </div>
      </div>

      <a 
        href="https://github.com/lonestill/novashell/blob/main/COMMANDS.md" 
        target="_blank"
        class="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-300 transition-all duration-200 bg-[#0F1117] border border-white/10 rounded-lg hover:bg-white/5 hover:text-white hover:border-white/20 group/btn"
      >
        <span>{{ getLabel('install.readDocs') }}</span>
        <lucide-icon 
          name="chevronRight" 
          [size]="16" 
          className="text-gray-500 transition-transform duration-200 group-hover/btn:translate-x-1 group-hover/btn:text-gray-300" 
        />
      </a>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnippetComponent implements OnInit {
  i18n = inject(I18nService);
  copied = signal(false);
  selectedPlatform = signal<PlatformGroup>('unix');

  installCommands: InstallCommand[] = [
    {
      id: 'unix',
      labelKey: 'install.linux',
      command: 'curl -fsSL https://raw.githubusercontent.com/lonestill/novashell/main/install.sh | bash',
      icon: 'terminal'
    },
    {
      id: 'windows',
      labelKey: 'install.windows',
      command: 'iwr -useb https://raw.githubusercontent.com/lonestill/novashell/main/install.ps1 | iex',
      icon: 'monitor'
    }
  ];
  
  getLabel(key: string): string {
    return this.i18n.t(key);
  }

  currentCommand = computed(() => 
    this.installCommands.find(cmd => cmd.id === this.selectedPlatform()) || this.installCommands[0]
  );

  ngOnInit() {
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('win')) {
        this.selectedPlatform.set('windows');
      } else {
        this.selectedPlatform.set('unix');
      }
    }
  }

  selectPlatform(id: PlatformGroup) {
    this.selectedPlatform.set(id);
    this.copied.set(false);
  }

  copyToClipboard() {
    const command = this.currentCommand().command;
    navigator.clipboard.writeText(command);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  formatCommand(cmd: string): SafeHtml {
    const formatted = cmd
      .replace(/\|/g, '<span class="text-purple-400">|</span>')
      .replace(/(curl|bash|iwr|iex)/g, '<span class="text-yellow-200 font-semibold">$1</span>')
      .replace(/(https?:\/\/[^\s]+)/g, '<span class="text-gray-400 underline decoration-gray-700 underline-offset-2">$1</span>');
    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }
  
  private sanitizer = inject(DomSanitizer);
}
