import type { MemoryHandler } from "./MemoryHandler.ts";

export class MemoryManager {
  private static instance: MemoryManager;
  private memoryHandlers: Set<MemoryHandler> = new Set();
  private checkInterval: number;
  private threshold: number;
  private timerId: number | undefined;

  private constructor(checkInterval: number = 10000, threshold: number = 0.8) {
    this.checkInterval = checkInterval; // Check every 10 seconds by default
    this.threshold = threshold; // 80% memory usage by default
    this.startMemoryCheck();
  }

  // Singleton pattern to ensure a single global MemoryManager
  public static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  // Register a MemoryHandler instance
  public registerCacheManager(memoryHandler: MemoryHandler): void {
    this.memoryHandlers.add(memoryHandler);
  }

  // Deregister a MemoryHandler instance
  public deregisterCacheManager(memoryHandler: MemoryHandler): void {
    this.memoryHandlers.delete(memoryHandler);
  }

  // Start periodic memory check
  private startMemoryCheck(): void {
    this.timerId = setInterval(() => {
      this.checkMemoryUsage();
    }, this.checkInterval);

    // Make the timer non-blocking, allowing the program to exit naturally
    Deno.unrefTimer(this.timerId);
  }

  public stopMemoryCheck(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  // Check memory usage and clear caches if necessary
  private checkMemoryUsage(): void {
    // Type assertion to extend the performance object with 'memory'
    const performanceMemory = globalThis.performance as Performance & {
      // deno-lint-ignore no-explicit-any
      memory?: any;
    };

    if (performanceMemory.memory) {
      const usedMemory = performanceMemory.memory.usedJSHeapSize;
      const totalMemory = performanceMemory.memory.totalJSHeapSize;

      if (usedMemory / totalMemory > this.threshold) {
        console.warn("Global memory usage high, clearing all caches.");
        this.clearAllCaches();
      }
    } else {
      console.warn("Performance memory information is not available.");
    }
  }

  // Clear all registered MemoryHandler instances
  private clearAllCaches(): void {
    for (const handler of this.memoryHandlers) {
      handler.clearCache();
    }
  }
}
