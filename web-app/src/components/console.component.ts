import { Component, ChangeDetectionStrategy, signal, effect, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from './lucide-icon.component';

interface ConsoleLine {
  type: 'command' | 'output' | 'error' | 'info';
  content: string;
  timestamp?: Date;
}

@Component({
  selector: 'app-console',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  template: `
    <div class="relative bg-[#0B0C0E]/95 border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
      
      <div class="flex items-center justify-between px-4 py-3 border-b border-white/[0.05] bg-white/[0.02]">
        <div class="flex items-center gap-2">
           <div class="w-3 h-3 rounded-full bg-[#FF5F57] shadow-sm"></div>
           <div class="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-sm"></div>
           <div class="w-3 h-3 rounded-full bg-[#28C840] shadow-sm"></div>
        </div>
        
        <div class="absolute left-1/2 -translate-x-1/2 text-[13px] font-medium text-[#8A8F98]/80 font-mono flex items-center gap-2 select-none">
          <lucide-icon name="terminal" [size]="14" className="w-3.5 h-3.5 opacity-50" [strokeWidth]="2" />
          novashell — interactive
        </div>
      </div>

      <div #consoleOutput class="p-6 font-mono text-[13px] md:text-[14px] leading-relaxed bg-[#0A0B0E] min-h-[400px] max-h-[600px] overflow-y-auto">
        
        @for (line of lines(); track $index) {
          <div class="mb-2" [ngClass]="{
            'text-[#E2E8F0]': line.type === 'command',
            'text-[#B4BCD0]': line.type === 'output',
            'text-[#E06C75]': line.type === 'error',
            'text-[#5E6AD2]': line.type === 'info'
          }">
            @if (line.type === 'command') {
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-[#5E6AD2] font-bold select-none">novashell:{{ currentDir() }}$</span>
                <span>{{ line.content }}</span>
              </div>
            } @else {
              <div class="whitespace-pre-wrap">{{ line.content }}</div>
            }
          </div>
        }

        <div class="flex items-center gap-2 text-[#E2E8F0]">
          <span class="text-[#5E6AD2] font-bold select-none">novashell:{{ currentDir() }}$</span>
          <input 
            #inputRef
            type="text"
            [value]="currentInput"
            (input)="onInputChange($event)"
            (keydown.enter)="executeCommand()"
            (keydown.arrowUp)="navigateHistory($event, -1)"
            (keydown.arrowDown)="navigateHistory($event, 1)"
            class="flex-1 bg-transparent border-none outline-none text-[#E2E8F0] font-mono"
            placeholder="Type a command..."
            autofocus
          />
          <span class="w-2.5 h-5 bg-[#ABB2BF] animate-pulse"></span>
        </div>
      </div>

      <div class="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-transparent to-transparent pointer-events-none"></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsoleComponent implements AfterViewInit {
  @ViewChild('consoleOutput') consoleOutput!: ElementRef<HTMLDivElement>;
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  lines = signal<ConsoleLine[]>([]);
  currentInput = '';
  currentDir = signal('~');
  commandHistory = signal<string[]>([]);
  historyIndex = signal(-1);

  constructor() {
    // Welcome message
    effect(() => {
      if (this.lines().length === 0) {
        this.addLine('info', 'Welcome to NovaShell v1.0.0');
        this.addLine('info', 'A custom cross-platform CLI shell built with Node.js');
        this.addLine('info', 'Type "help" for available commands');
        this.addLine('output', '');
      }
    });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.currentInput = target.value;
  }

  executeCommand() {
    const command = this.currentInput.trim();
    if (!command) return;

    // Add command to history
    const history = this.commandHistory();
    if (history[history.length - 1] !== command) {
      this.commandHistory.set([...history, command]);
    }
    this.historyIndex.set(-1);

    // Display command
    this.addLine('command', command);
    this.currentInput = '';

    // Execute command
    this.processCommand(command);
    this.scrollToBottom();
  }

  navigateHistory(event: KeyboardEvent, direction: number) {
    event.preventDefault();
    const history = this.commandHistory();
    if (history.length === 0) return;

    let newIndex = this.historyIndex() + direction;
    if (newIndex < -1) newIndex = -1;
    if (newIndex >= history.length) newIndex = history.length - 1;

    this.historyIndex.set(newIndex);
    
    if (newIndex === -1) {
      this.currentInput = '';
    } else {
      this.currentInput = history[history.length - 1 - newIndex];
    }
    
    // Update input field value
    if (this.inputRef?.nativeElement) {
      this.inputRef.nativeElement.value = this.currentInput;
    }
  }

  processCommand(command: string) {
    const [cmd, ...args] = command.split(' ');

    switch (cmd.toLowerCase()) {
      case 'help':
        this.addLine('output', 'Available commands:');
        this.addLine('output', '  help          - Show this help message');
        this.addLine('output', '  clear/cls     - Clear the console');
        this.addLine('output', '  echo <text>   - Print text');
        this.addLine('output', '  pwd           - Show current directory');
        this.addLine('output', '  ls/dir        - List files');
        this.addLine('output', '  cd <dir>      - Change directory');
        this.addLine('output', '  sysinfo/sys   - System information');
        this.addLine('output', '  todo          - Todo management');
        this.addLine('output', '  random        - Generate random data');
        this.addLine('output', '  json          - JSON operations');
        this.addLine('output', '  stats         - Command statistics');
        this.addLine('output', '  bookmark      - Directory bookmarks');
        this.addLine('output', '  theme         - Prompt themes');
        this.addLine('output', '  config        - Configuration');
        this.addLine('output', '  history       - Command history');
        this.addLine('output', '');
        this.addLine('output', 'For full documentation, visit: https://github.com/lonestill/novashell');
        break;

      case 'clear':
      case 'cls':
        this.lines.set([]);
        break;

      case 'echo':
        this.addLine('output', args.join(' '));
        break;

      case 'pwd':
        this.addLine('output', this.currentDir());
        break;

      case 'ls':
      case 'dir':
        this.addLine('output', 'src/  test/  web-app/  package.json  README.md');
        break;

      case 'cd':
        if (args[0]) {
          this.currentDir.set(args[0]);
          this.addLine('output', `Changed directory to ${args[0]}`);
        } else {
          this.currentDir.set('~');
          this.addLine('output', 'Changed directory to home');
        }
        break;

      case 'sysinfo':
      case 'sys':
        this.addLine('output', '╭─────────────────────────────────────────╮');
        this.addLine('output', '│      NovaShell System Information       │');
        this.addLine('output', '╰─────────────────────────────────────────╯');
        this.addLine('output', '');
        this.addLine('output', 'System');
        this.addLine('output', '  ├─ OS:       ' + (navigator.platform.includes('Win') ? 'Windows' : navigator.platform.includes('Mac') ? 'macOS' : 'Linux'));
        this.addLine('output', '  ├─ Browser:  ' + navigator.userAgent.split(' ')[0]);
        this.addLine('output', '  └─ Platform: ' + navigator.platform);
        break;

      case 'todo':
        if (args[0] === 'add' && args[1]) {
          this.addLine('output', `✓ Todo added: ${args.slice(1).join(' ')}`);
        } else if (args[0] === 'list') {
          this.addLine('output', '1. [ ] Push to production');
          this.addLine('output', '2. [ ] Update documentation');
          this.addLine('output', '3. [x] Install dependencies');
        } else {
          this.addLine('output', 'Usage: todo [add|list|done|remove]');
        }
        break;

      case 'random':
        if (args[0] === 'uuid') {
          this.addLine('output', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890');
        } else {
          this.addLine('output', 'Usage: random [uuid|string|number|hex]');
        }
        break;

      case 'json':
        this.addLine('output', 'Usage: json [format|validate|minify] <file>');
        break;

      case 'stats':
        this.addLine('output', 'Command Statistics:');
        this.addLine('output', '  Top commands: help (15%), ls (12%), cd (10%)');
        break;

      default:
        if (cmd) {
          this.addLine('error', `Command "${cmd}" not found. Type "help" for available commands.`);
        }
    }
  }

  addLine(type: ConsoleLine['type'], content: string) {
    this.lines.set([...this.lines(), { type, content, timestamp: new Date() }]);
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.consoleOutput) {
        this.consoleOutput.nativeElement.scrollTop = this.consoleOutput.nativeElement.scrollHeight;
      }
    }, 0);
  }
}
