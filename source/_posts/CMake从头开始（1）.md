---
title: CMake从头开始（1）
date: 2025-9-28 20:55:02
tag: CMake
categories: 工具
cover: https://s2.loli.net/2025/09/25/qby17OeouxpTPUX.png
---

## CMake，Makefile，Make

**CMake** 是一个**构建系统生成器**，它根据一个高级的、跨平台的配置文件`CMakeLists.txt`来生成**Makefile**。然后，**Make** 这个**构建工具**读取 **Makefile** 并执行指令，调用编译器等工具，最终将源代码编译成可执行文件或库。

可以把它们的关系想象成：

- **Make** 是**工人**
- **Makefile** 是**给工人的施工图纸**
- **CMake** 是**绘制施工图纸的工程师**，他可以根据一份更通用的设计稿（`CMakeLists.txt`）生成适用于不同工地（操作系统/编译器）的详细图纸。

Makefile并不跨平台，CMake根据编译器类型来决定是否生成Make file，大多数情况下CMake会生成Makefile；Make工具（类似批处理工具）是通过调用makefile文件中的命令实现编译和链接的。

### 1. Make

Make是一个经典的、基于指令的**构建工具**。它本身并不知道如何编译程序。

它读取一个名为 `Makefile` 的文件，这个文件里定义了源代码文件之间的依赖关系以及构建规则（如何编译、链接）。`Make` 根据这些规则，检查文件的时间戳，决定哪些文件需要重新编译，然后执行定义好的命令（例如 `gcc -c main.c`）。

### 2. Makefile

Makefile是一个**文本文件**，包含了构建项目所需的**规则**和**依赖关系**。

它明确指出了
- **目标**：要生成什么（例如一个可执行文件 `my_app`，或一个目标文件 `main.o`）。
- **依赖**：生成这个目标需要哪些文件（例如 `my_app` 依赖于 `main.o` 和 `utils.o`）。
- **命令**：如何用依赖来生成目标（例如 `gcc -o my_app main.o utils.o`）。

- **角色**：它是 `Make` 工具的“食谱”或“施工图纸”。

### 3. CMake

CMake是一个更高级的**构建系统生成器**（或称为元构建系统）。它不直接构建项目，而是**生成**用于构建项目的文件。

编写一个平台无关的、更高层次的配置文件 `CMakeLists.txt`。然后，CMake 会根据这个文件，为你当前所在的**平台**和**编译器**生成对应的原生构建文件。
- 在 Linux/macOS 上，它通常生成 **Makefile**。
- 在 Windows 上，它可以生成 **Visual Studio 的项目文件（.sln/.vcxproj）**。
- 它还可以生成 **Ninja** 构建文件（一种比 Make 更快的构建系统）。

### 工作流程示例

假设有一个简单的 C++ 项目，使用 CMake 来管理构建。

1. **编写源代码**：`main.cpp`, `hello.cpp`, `hello.h`。

2. **编写 CMakeLists.txt**：

   ```cmake
   cmake_minimum_required(VERSION 3.10)
   project(MyProject)
   
   add_executable(my_app main.cpp hello.cpp)
   ```

3. **生成 Makefile**：

   ```bash
   # 创建一个构建目录，保持源码树干净
   mkdir build
   cd build
   # 运行 cmake，让它根据上一级目录的 CMakeLists.txt 生成 Makefile
   cmake ..
   ```
   执行后，在 `build` 目录下就会生成一个完整的 `Makefile`（以及很多其他 CMake 相关的文件）。

4. **使用 Make 构建**：

   ``` bash
   # 在 build 目录下，运行 make
   make
   ```

   `Make` 程序会读取由 CMake 生成的 `Makefile`，然后调用 `g++`（或你系统上的其他 C++ 编译器）将 `main.cpp` 和 `helper.cpp` 编译并链接成可执行文件 `my_app`。

你也可以一步到位：

```bash
cmake --build ./
```

这个命令是 CMake 提供的跨平台构建命令，在幕后它会调用相应的原生构建工具（在这里是 `make`）。

## CMake构建流程

![image.png](https://s2.loli.net/2025/09/28/NoljiXmwYUczD35.png)

#### 1. **配置阶段 (Configure)**

- **读取 CMakeCache.txt**: 如果存在之前的配置缓存，会读取并使用
- **处理 CMake Language**: 解析和分析 `CMakeLists.txt` 文件
- **写入初始构建文件和 CMakeCache.txt**: 生成初始的构建系统和配置缓存

#### 2. **生成阶段 (Generate)**

- **生成 Makefile 或项目文件**: 根据配置生成具体的构建文件
  - 在 Linux 上生成 `Makefile`
  - 在 Windows 上生成 Visual Studio 项目文件 (`.sln`, `.vcxproj`)
  - 或其他构建系统文件
> 一般cmake -B “生成的文件夹”中，文件夹名称为build

#### 3. **构建阶段 (Build)**

- **编译**: 将源代码编译为目标文件
- **链接**: 将目标文件链接为可执行文件或库
- **测试**: 运行测试套件（可选）
- **打包**: 创建分发包（可选）

## CMake命令执行流程

### 第1步：编写 CMakeLists.txt

这是整个构建过程的核心配置文件：

```cmake
# 指定 CMake 最低版本要求
cmake_minimum_required(VERSION 3.20)

# 定义项目名称
project(Hello)

# 创建可执行文件
add_executable(Hello hello.cpp)
```

- `cmake_minimum_required`: 确保 CMake 版本兼容性
- `project`: 设置项目名称，并隐式定义了一些变量
- `add_executable`: 告诉 CMake 要从哪些源文件生成什么可执行文件

### 第2步：执行 `cmake -B build`

这个命令完成以下工作：

```bash
# -B 参数指定构建目录
cmake -B build
```

**实际执行的操作：**

1. **创建构建目录**：在当前目录下创建 `build/` 文件夹
2. **配置项目**：读取 `CMakeLists.txt`，检查系统环境、编译器
3. **生成构建系统文件**：
   - 在 Linux/macOS 上：生成 `Makefile`
   - 在 Windows 上：可能生成 Visual Studio 项目文件
   - 同时生成 `CMakeCache.txt` 和其他辅助文件

### 第3步：执行 `cmake --build build`

这个命令启动实际的编译过程：

```bash
cmake --build build
```

1. **进入构建目录**：切换到 `build/` 目录
2. **调用原生构建工具**：
   - Linux/macOS: 调用 `make` 来编译链接
   - Windows: 可能调用 `msbuild` 或 `nmake`
3. **生成最终产物**：在 `build/` 目录中生成可执行文件 `Hello`

#### 完整的实际操作示例

假设你有以下文件结构：

```text
project/
├── CMakeLists.txt
└── hello.cpp
```

**hello.cpp 内容：**

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, CMake!" << std::endl;
    return 0;
}
```

**操作流程：**

```bash
# 1. 进入项目目录
cd project
# 2. 配置和生成构建系统
cmake -B build
```

结果如图所示

![image.png](https://s2.loli.net/2025/09/28/5HNlBiWg8JxvAOf.png)

输出

```
-- The C compiler identification is GNU 13.3.0
-- The CXX compiler identification is GNU 13.3.0
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Check for working C compiler: /usr/bin/cc - skipped
-- Detecting C compile features
-- Detecting C compile features
-- Detecting C compile features - done
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /usr/bin/c++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- Generating done (0.1s)
-- Build files have been written to: /mnt/d/CMake/project/build
```

```bash
# 3. 编译项目
cmake --build build
```

![image.png](https://s2.loli.net/2025/09/28/iT2ypxj3gzRlwvD.png)

```bash
# 4. 运行程序
./build/Hello  # Linux/macOS
# 或者 build\Hello.exe  # Windows
```

![image.png](https://s2.loli.net/2025/09/28/AhMa7pWS3bcJYso.png)
