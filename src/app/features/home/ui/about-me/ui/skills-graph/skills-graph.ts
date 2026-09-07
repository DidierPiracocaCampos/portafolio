import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import {
  SKILL_EDGES,
  SKILL_NODES,
  SKILLS_VIEWBOX,
  type SkillNode,
} from '../../models/skills-graph';

const CLAMP_MARGIN = 44;
const PUSH_RADIUS = 130;
const PUSH_FORCE = 0.35;
const KEY_STEP = 14;

function homePositions(): Record<string, { x: number; y: number }> {
  const acc: Record<string, { x: number; y: number }> = {};
  for (const node of SKILL_NODES) acc[node.id] = { x: node.x, y: node.y };
  return acc;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

@Component({
  selector: 'app-skills-graph',
  imports: [TranslatePipe],
  templateUrl: './skills-graph.html',
  styleUrl: './skills-graph.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SkillsGraph implements OnInit, OnDestroy {
  readonly nodes: readonly SkillNode[] = SKILL_NODES;
  readonly edges = SKILL_EDGES;
  readonly viewWidth = SKILLS_VIEWBOX.width;
  readonly viewHeight = SKILLS_VIEWBOX.height;

  readonly hoveredId = signal<string | null>(null);
  readonly draggingId = signal<string | null>(null);
  readonly positions = signal<Record<string, { x: number; y: number }>>(homePositions());
  readonly revealed = signal(false);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;
  private grabOffset = { x: 0, y: 0 };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (this.reduceMotion()) {
      this.revealed.set(true);
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      this.revealed.set(true);
      return;
    }
    const target = this.host.nativeElement.querySelector('.skills-graph');
    if (!target) {
      this.revealed.set(true);
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.revealed.set(true);
            this.observer?.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 },
    );
    this.observer.observe(target);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  position(id: string): { x: number; y: number } {
    return this.positions()[id] ?? { x: 0, y: 0 };
  }

  hover(id: string | null): void {
    if (this.hoveredId() !== id) this.hoveredId.set(id);
  }

  isActiveEdge(from: string, to: string): boolean {
    const hot = this.hoveredId() ?? this.draggingId();
    return hot !== null && (from === hot || to === hot);
  }

  isDimmedEdge(from: string, to: string): boolean {
    const hot = this.hoveredId() ?? this.draggingId();
    return hot !== null && from !== hot && to !== hot;
  }

  isHotNode(id: string): boolean {
    const hot = this.hoveredId() ?? this.draggingId();
    if (hot === null) return false;
    if (id === hot) return true;
    return this.edges.some(
      (e) => (e.from === hot && e.to === id) || (e.to === hot && e.from === id),
    );
  }

  connectedCount(id: string): number {
    return this.edges.filter((e) => e.from === id || e.to === id).length;
  }

  moveNode(id: string, dx: number, dy: number): void {
    const current = this.position(id);
    const next = {
      x: clamp(current.x + dx, CLAMP_MARGIN, this.viewWidth - CLAMP_MARGIN),
      y: clamp(current.y + dy, CLAMP_MARGIN, this.viewHeight - 30),
    };
    this.settle(id, next.x, next.y);
  }

  resetPositions(): void {
    this.positions.set(homePositions());
    this.draggingId.set(null);
  }

  onPointerDown(event: PointerEvent, id: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    const pointer = this.toSvgPoint(event);
    if (!pointer) return;
    const pos = this.position(id);
    this.grabOffset = { x: pos.x - pointer.x, y: pos.y - pointer.y };
    this.draggingId.set(id);
    this.hover(id);
    try {
      (event.currentTarget as Element | null)?.setPointerCapture?.(event.pointerId);
    } catch {
      // ignore (jsdom / no capture support)
    }
    event.preventDefault();
  }

  onPointerMove(event: PointerEvent): void {
    const dragging = this.draggingId();
    if (!dragging) return;
    const pointer = this.toSvgPoint(event);
    if (!pointer) return;
    const next = {
      x: clamp(pointer.x + this.grabOffset.x, CLAMP_MARGIN, this.viewWidth - CLAMP_MARGIN),
      y: clamp(pointer.y + this.grabOffset.y, CLAMP_MARGIN, this.viewHeight - 30),
    };
    this.settle(dragging, next.x, next.y);
  }

  onPointerUp(): void {
    if (this.draggingId() !== null) this.draggingId.set(null);
  }

  onKeyDown(event: KeyboardEvent, id: string): void {
    const step = event.shiftKey ? KEY_STEP * 2 : KEY_STEP;
    let dx = 0;
    let dy = 0;
    if (event.key === 'ArrowRight') dx = step;
    else if (event.key === 'ArrowLeft') dx = -step;
    else if (event.key === 'ArrowDown') dy = step;
    else if (event.key === 'ArrowUp') dy = -step;
    else if (event.key === 'Escape') {
      this.resetPositions();
      this.hover(null);
      return;
    } else {
      return;
    }
    event.preventDefault();
    this.hover(id);
    this.moveNode(id, dx, dy);
  }

  private settle(movedId: string, x: number, y: number): void {
    const prev = this.positions();
    const next: Record<string, { x: number; y: number }> = { ...prev, [movedId]: { x, y } };
    for (const node of this.nodes) {
      if (node.id === movedId) continue;
      const other = prev[node.id];
      const dx = other.x - x;
      const dy = other.y - y;
      const dist = Math.hypot(dx, dy);
      if (dist === 0 || dist >= PUSH_RADIUS) continue;
      const push = ((PUSH_RADIUS - dist) / PUSH_RADIUS) * PUSH_RADIUS * PUSH_FORCE;
      const ux = dx / dist;
      const uy = dy / dist;
      next[node.id] = {
        x: clamp(other.x + ux * push, CLAMP_MARGIN, this.viewWidth - CLAMP_MARGIN),
        y: clamp(other.y + uy * push, CLAMP_MARGIN, this.viewHeight - 30),
      };
    }
    this.positions.set(next);
  }

  private toSvgPoint(event: PointerEvent): { x: number; y: number } | null {
    try {
      const svg = this.host.nativeElement.querySelector('svg.skills-graph__canvas');
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      return {
        x: ((event.clientX - rect.left) / rect.width) * this.viewWidth,
        y: ((event.clientY - rect.top) / rect.height) * this.viewHeight,
      };
    } catch {
      return null;
    }
  }

  private reduceMotion(): boolean {
    try {
      return (
        typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    } catch {
      return false;
    }
  }
}
