import type { MemoryHandler } from "./MemoryHandler.ts";

/**
 * MemoryManager is a singleton class that manages memory usage across multiple
 * registered `MemoryHandler` instances. It periodically checks the system's memory
 * usage and clears caches of registered handlers when memory usage exceeds a specified threshold.
 *
 * The class is designed to optimize memory usage by allowing registered handlers to clear
 * their cache data when the system memory usage is high, preventing memory exhaustion.
 */
export class MemoryManager {
  private static instance: MemoryManager;
  private memoryHandlers: Set<MemoryHandler> = new Set();
  private checkInterval: number;
  private threshold: number;
  private timerId: number | undefined;

  /**
   * Private constructor to enforce the singleton pattern.
   *
   * @param {number} [checkInterval=10000] - The interval in milliseconds for periodic memory checks.
   * @param {number} [threshold=0.8] - The memory usage threshold (as a decimal) at which cache clearing is triggered.
   */
  private constructor(checkInterval: number = 10000, threshold: number = 0.8) {
    this.checkInterval = checkInterval;
    this.threshold = threshold;
    this.startMemoryCheck();
  }

  /**
   * Returns the singleton instance of the `MemoryManager`. If it doesn't exist, it will be created.
   *
   * @returns {MemoryManager} The singleton instance of `MemoryManager`.
   */
  public static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  /**
   * Registers a `MemoryHandler` instance with the `MemoryManager`.
   *
   * @param {MemoryHandler} memoryHandler - The `MemoryHandler` instance to register.
   */
  public registerCacheManager(memoryHandler: MemoryHandler): void {
    this.memoryHandlers.add(memoryHandler);
  }

  /**
   * Deregisters a `MemoryHandler` instance from the `MemoryManager`.
   *
   * @param {MemoryHandler} memoryHandler - The `MemoryHandler` instance to deregister.
   */
  public deregisterCacheManager(memoryHandler: MemoryHandler): void {
    this.memoryHandlers.delete(memoryHandler);
  }

  /**
   * Starts the periodic memory check using `setInterval`.
   * Uses `Deno.unrefTimer` to ensure that the timer does not block the program from exiting naturally.
   * This method is invoked automatically when `MemoryManager` is instantiated.
   *
   * @private
   */
  private startMemoryCheck(): void {
    this.timerId = setInterval(() => {
      this.checkMemoryUsage();
    }, this.checkInterval);

    // Make the timer non-blocking, allowing the program to exit naturally
    Deno.unrefTimer(this.timerId);
  }

  /**
   * Stops the periodic memory check by clearing the interval timer.
   * This method should be called when you want to stop the memory monitoring process.
   */
  public stopMemoryCheck(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  /**
   * Checks the current memory usage and triggers cache clearing if usage exceeds the specified threshold.
   * This method is called periodically by the `startMemoryCheck` interval.
   *
   * @private
   */
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

  /**
   * Clears all registered `MemoryHandler` instances by invoking their `clearCache` method.
   * This method is triggered when the memory usage exceeds the defined threshold.
   *
   * @private
   */
  private clearAllCaches(): void {
    for (const handler of this.memoryHandlers) {
      handler.clearCache();
    }
  }
}
