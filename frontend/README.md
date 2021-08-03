# @plantarium

## Architecture

```
                          +-------+
                          |Backend|
                          +-------+
                              ^
                              |
                        +-----------+
                        |DataService|
                        +-----+-----+       Scene
                              ^             +---------------+
     +----------+             |             |  +---------+  |
     |NodeSystem|             |             |  |Generator|  |
     +----------+ <--> +------+-------+     |  +----+----+  |
                       |ProjectManager| --> |       |       |
+---------------+ <--> +--------------+     |  +----+----+  |
|SettingsManager|                           |  |Renderer |  |
+---------------+                           |  +---------+  |
                                            +---------------+
```

### ProjectManager

### SettingsManager

### [NodeSystem](packages/nodesystem/README.md)

### DataService

### Scene

- ### Generator
- ### Renderer

### Backend
