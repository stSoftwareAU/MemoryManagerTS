// MemoryHandler.ts
export interface MemoryHandler {
  clearCache(): void; // Method to clear the cache
  dispose(): void; // Method to deregister from MemoryManager
}
