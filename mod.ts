/**
 * @module Memory Management
 *
 * This module provides utilities for managing memory in your application,
 * including a global `MemoryManager` that handles periodic memory checks
 * and clears registered `CacheManager` instances when memory is low.
 *
 * Exports:
 * - `MemoryManager`: Singleton class responsible for managing memory across multiple `MemoryHandler` instances.
 * - `MemoryHandler`: Interface that defines the structure for classes that need to handle memory management.
 */

/**
 * Clear all caches registered with the MemoryManager in low memory situations.
 *
 * `MemoryManager` is a singleton class that manages memory usage across multiple
 * registered `MemoryHandler` instances. It periodically checks the system's memory
 * usage and clears caches of registered handlers when memory usage exceeds a specified threshold.
 *
 * Usage example:
 * ```typescript
 * import { MemoryManager } from "./src/mod.ts";
 *
 * const memoryManager = MemoryManager.getInstance();
 * memoryManager.registerCacheManager(someCacheManager);
 * @class
 */

export { MemoryManager } from "./src/MemoryManager.ts";
/**
 * `MemoryHandler` is an interface that defines the structure and methods required
 * for classes to handle memory management, such as clearing caches or deregister
 * themselves from the `MemoryManager`.
 *
 * Classes implementing this interface must define the following methods:
 * - `clearCache()`: Method to clear the cache data when needed.
 * - `dispose()`: Method to deregister the instance from the `MemoryManager`.
 *
 * Example:
 * ```typescript
 * import { MemoryHandler } from "./src/mod.ts";
 *
 * class MyCacheManager implements MemoryHandler {
 *   clearCache(): void {
 *     // Logic to clear the cache
 *   }
 *
 *   dispose(): void {
 *     // Logic to deregister from MemoryManager
 *   }
 * }
 * ```
 */
export { type MemoryHandler } from "./src/MemoryHandler.ts";
