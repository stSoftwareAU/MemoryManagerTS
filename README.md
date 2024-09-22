# Memory Management Library

A TypeScript library designed for efficient memory management, providing tools for handling in-memory caching, periodic memory checks, and automatic cache clearing. This library includes two primary components: `MemoryManager` and `MemoryHandler`.

## Features

- **Singleton MemoryManager**: Manages multiple cache handlers and periodically checks memory usage.
- **MemoryHandler Interface**: Defines the required structure for classes that need to manage their memory usage.
- **Automatic Cache Clearing**: Clears cache when memory usage exceeds a defined threshold.
- **Support for Deno**: Fully compatible with Deno, including non-blocking intervals via `Deno.unrefTimer`.

## Getting Started

### Prerequisites

- Deno (v1.15+ recommended)

### Installation

Since this project is intended for use with Deno, you can import it directly from your project without needing additional installation:

```typescript
import { MemoryManager, MemoryHandler } from "./src/mod.ts";
