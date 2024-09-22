/**
 * The `MemoryHandler` interface defines the contract for classes that require
 * memory management capabilities. Implementing classes are expected to provide
 * functionality for clearing their internal cache and deregister from the
 * `MemoryManager`.
 */
export interface MemoryHandler {
  /**
   * Clears the cache data of the implementing class. This method is invoked by
   * the `MemoryManager` when memory usage exceeds the specified threshold, allowing
   * the implementing class to release memory resources.
   */
  clearCache(): void;

  /**
   * Deregister the implementing class from the `MemoryManager`. This method should
   * be called when the implementing class is no longer needed or should stop being
   * managed by the `MemoryManager`.
   */
  dispose(): void;
}
