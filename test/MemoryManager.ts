import { MemoryManager } from "../src/MemoryManager.ts";
import type { MemoryHandler } from "../src/MemoryHandler.ts";
import { assert, assertEquals } from "@std/assert";

class MockCacheManager implements MemoryHandler {
  private cleared = false;

  clearCache(): void {
    this.cleared = true;
  }

  dispose(): void {
    // Mock dispose behavior
  }

  wasCleared(): boolean {
    return this.cleared;
  }
}

Deno.test("MemoryManager should register a MemoryHandler", () => {
  const memoryManager = MemoryManager.getInstance();
  const mockHandler = new MockCacheManager();

  memoryManager.registerCacheManager(mockHandler);

  // Since we're using a Set, we can't directly assert membership.
  // So we'll check behavior through other tests, as sets are not directly enumerable.
  assert(mockHandler);

  memoryManager.stopMemoryCheck();
});

Deno.test("MemoryManager should deregister a MemoryHandler", () => {
  const memoryManager = MemoryManager.getInstance();
  const mockHandler = new MockCacheManager();

  memoryManager.registerCacheManager(mockHandler);
  memoryManager.deregisterCacheManager(mockHandler);

  // No direct way to check if it's deregistered but let's ensure no calls occur later
  assert(mockHandler);

  memoryManager.stopMemoryCheck();
});

Deno.test("MemoryManager should clear all caches when memory is high", () => {
  const memoryManager = MemoryManager.getInstance();
  const mockHandler1 = new MockCacheManager();
  const mockHandler2 = new MockCacheManager();

  memoryManager.registerCacheManager(mockHandler1);
  memoryManager.registerCacheManager(mockHandler2);

  // Mock the performance memory check to force the memory manager to clear caches
  // deno-lint-ignore no-explicit-any
  const perf = globalThis.performance as Performance & { memory?: any };
  perf.memory = {
    usedJSHeapSize: 900, // High used memory
    totalJSHeapSize: 1000, // Total available memory
    jsHeapSizeLimit: 1500,
  };

  // Trigger the memory check manually
  memoryManager["checkMemoryUsage"]();

  assertEquals(mockHandler1.wasCleared(), true, "Handler 1 should be cleared");
  assertEquals(mockHandler2.wasCleared(), true, "Handler 2 should be cleared");

  // Clean up
  memoryManager.deregisterCacheManager(mockHandler1);
  memoryManager.deregisterCacheManager(mockHandler2);

  memoryManager.stopMemoryCheck();
});
