# User Directory

A small Next.js app that fetches a list of users, supports search and nationality filtering, and lets you favorite users with localStorage persistence.

Key choices for stability:

- `randomuser.me` requests use a fixed `seed` (`seed=user-directory`) for deterministic data.
- `User.id` uses `login.uuid` from the API for a stable unique identifier.
- React Query is tuned for fewer surprise refetches: `staleTime: 30 * 60 * 1000`, and both `refetchOnWindowFocus` and `refetchOnReconnect` are disabled.

## Tech Stack

- Next.js App Router (TypeScript, Tailwind)
- React 19
- @tanstack/react-query v5

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the app.

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm start` – start production server
- `npm run lint` – run ESLint

## Project Structure

- `app/` – App Router entry, providers, layout
- `components/` – UI components (`UserDirectory`, `UserCard`)
- `hooks/` – `useUsers`, `useUserSearch`, `useFavorites`
- `lib/` – API fetch and mapping
- `types/` – shared TypeScript types
- `docs/` – tutorials and known issues

## Favorites & Data Consistency

- Favorites are persisted in `localStorage` (client-only) as a list of user IDs.
- The favorites badge and tab compute the intersection of stored IDs and the currently loaded users to avoid mismatches when the dataset changes.
- See Known Issues for context and alternatives.

## Documentation

- Tutorials overview: `docs/tutorials/README.md`
- Known issue write-up: `docs/known-issues/favorites-data-mismatch.md`

## Notes

- This repo favors clarity and speed for interview-style builds; production-hardening (validation, retries, accessibility) is outlined in the tutorial’s “Next steps”.

---

```mermaid
sequenceDiagram
autonumber

    %% 1. 定义四个"泳道"
    participant User as 用户输入
    participant React as React 状态
    participant useEffect as useEffect Hook
    participant Browser as 浏览器 Timers

    %% --------------------------------------------------
    %% 时间点 0ms: 首次渲染
    %% --------------------------------------------------
    Note over React,Browser: 0ms: 首次渲染 (value="a")

    React->>React: 1. state: value="a", debouncedValue="a"
    React->>useEffect: 2. 执行 Effect (1) [依赖: "a"]
    useEffect->>Browser: 3. setTimeout(set("a"), 250) [timerA]
    Note over useEffect: (记住 Cleanup A: clear(timerA))

    Note over User,Browser: 50ms后

    %% --------------------------------------------------
    %% 时间点 50ms: 用户输入 'b'
    %% --------------------------------------------------
    Note over User,Browser: 50ms: 用户输入 "b" (value="ab")

    User->>React: 1. 输入 "b"
    React->>React: 2. state: value="ab", 触发重渲染<br/>(debouncedValue 仍为 "a")

    %% 关键步骤：先清理，再执行
    React->>useEffect: 3. **执行 Cleanup A (上一次的)**
    useEffect->>Browser: 4. **clearTimeout(timerA) ❌** (计划 A 被取消!)

    React->>useEffect: 5. **执行 Effect (2) (本次新的)** [依赖: "ab"]
    useEffect->>Browser: 6. setTimeout(set("ab"), 250) [timerB]
    Note over useEffect: (记住 Cleanup B: clear(timerB))

    Note over User,Browser: 100ms后 (总时间 150ms)

    %% --------------------------------------------------
    %% 时间点 150ms: 用户输入 'c'
    %% --------------------------------------------------
    Note over User,Browser: 150ms: 用户输入 "c" (value="abc")

    User->>React: 1. 输入 "c"
    React->>React: 2. state: value="abc", 触发重渲染<br/>(debouncedValue 仍为 "a")

    %% 关键步骤：再次先清理，再执行
    React->>useEffect: 3. **执行 Cleanup B (上一次的)**
    useEffect->>Browser: 4. **clearTimeout(timerB) ❌** (计划 B 被取消!)

    React->>useEffect: 5. **执行 Effect (3) (本次新的)** [依赖: "abc"]
    useEffect->>Browser: 6. setTimeout(set("abc"), 250) [timerC]
    Note over useEffect: (记住 Cleanup C: clear(timerC))

    Note over User,Browser: 用户停止输入

    %% --------------------------------------------------
    %% 时间点 151ms - 400ms: 等待
    %% --------------------------------------------------
    Note over User,Browser: 151ms - 400ms: 用户停止输入
    Note over Browser: timerC 正在倒计时... (无人打扰)

    Note over User,Browser: 250ms后 (总时间 401ms)

    %% --------------------------------------------------
    %% 时间点 401ms: 最后一个 Timer 触发
    %% --------------------------------------------------
    Note over React,Browser: 401ms: timerC 触发

    Browser->>React: 1. **timerC 触发回调: setDebouncedValue("abc")**
    React->>React: 2. 状态更新, 触发重渲染
    React->>React: 3. state: value="abc", debouncedValue="abc"

    %% 最后的检查
    React->>useEffect: 4. 检查依赖 [value, delay] (未变化)
    Note over useEffect: (依赖未变, Effect 和 Cleanup 均不执行)
```

```mermaid
graph TD
    %% -------------------------------------
    %% 图例 (Legend) - 已修正
    %% -------------------------------------
    subgraph Legend [图例]
        direction LR
        %% 【修正】流程图语法要求子图内的节点必须被连接
        L_Effect["Run Effect<br/>(执行 Effect 主体)"] -->
        L_Cleanup["Run Cleanup<br/>(执行清理函数)"] -->
        L_Decision{"Decision<br/>(决策节点)"} -->
        L_Start("Start / End<br/>(开始 / 结束)")
    end

    %% ==========================================================
    %% 流程 1: 渲染后 (Mount & Update)
    %% ==========================================================
    subgraph "流程 1: 渲染后 (Component Renders)"
        direction TB

        Start("Component Renders") --> D1{"Deps Array Provided?<br/>(是否提供了依赖数组?)"}

        %% 路径 A: useEffect(..., undefined)
        D1 -->|"No (undefined)<br/>[每次都运行]"| C1["Run Cleanup<br/>(执行上一次的清理, 仅限 Update 时)"]
        C1 --> E1["Run Effect<br/>(执行本次 Effect)"]
        E1 --> EndRender("End")

        %% 路径 B: 提供了数组 ( [] or [deps] )
        D1 -->|"Yes (Array provided)"| D2{"Is this First Render (Mount)?<br/>(是否为首次渲染?)"}

        %% B1: 首次渲染 (Mount)
        %% 在 Mount 时，只执行 Effect，没有 Cleanup
        D2 -->|"Yes (Mount)"| E2["Run Effect<br/>(执行本次 Effect)"]
        E2 --> EndRender

        %% B2: 更新 (Update)
        D2 -->|"No (Update)"| D3{"Deps Array Empty? `[]`<br/>(数组是否为空?)"}

        %% B2a: useEffect(..., [])
        %% 空数组: 在 Update 时什么也不做
        D3 -->|"Yes (`[]`)<br/>[仅 Mount 时运行]"| EndRender

        %% B2b: useEffect(..., [deps])
        D3 -->|"No (`[deps]`)<br/>[依赖项改变时运行]"| D4{"Have Deps Changed?<br/>(依赖项是否改变?)"}

        %% 依赖未变
        D4 -->|"No"| EndRender

        %% 依赖改变 (这正是 useDebounce 的核心)
        D4 -->|"Yes"| C2["Run Cleanup<br/>(执行上一次的清理)"]
        C2 --> E3["Run Effect<br/>(执行本次 Effect)"]
        E3 --> EndRender
    end

    %% ==========================================================
    %% 流程 2: 卸载时 (Unmount)
    %% ==========================================================
    subgraph "流程 2: 卸载时 (Component Unmounts)"
        direction TB
        StartUnmount("Component Unmounts") --> C_Unmount["Run Cleanup<br/>(执行最后一次的清理)"]
        C_Unmount --> EndUnmount("End")
    end

    %% -------------------------------------
    %% 样式 (与之前相同)
    %% -------------------------------------
    style Start fill:#f8d7da,stroke:#721c24
    style StartUnmount fill:#f8d7da,stroke:#721c24
    style EndRender fill:#e2e3e5,stroke:#383d41
    style EndUnmount fill:#e2e3e5,stroke:#383d41

    style E1 fill:#cce5ff,stroke:#004085
    style E2 fill:#cce5ff,stroke:#004085
    style E3 fill:#cce5ff,stroke:#004085

    style C1 fill:#fff3cd,stroke:#856404
    style C2 fill:#fff3cd,stroke:#856404
    style C_Unmount fill:#fff3cd,stroke:#856404

    style D1 fill:#d4edda,stroke:#155724
    style D2 fill:#d4edda,stroke:#155724
    style D3 fill:#d4edda,stroke:#155724
    style D4 fill:#d4edda,stroke:#155724

    %% 图例的样式 (与之前相同)
    style L_Effect fill:#cce5ff,stroke:#004085
    style L_Cleanup fill:#fff3cd,stroke:#856404
    style L_Decision fill:#d4edda,stroke:#155724
    style L_Start fill:#f8d7da,stroke:#721c24

```
