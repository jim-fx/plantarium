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

### [ProjectManager](frontend/src/components/project-manager)

### [SettingsManager](<(frontend/src/components/settings-manager)>)

### [NodeSystem](packages/nodesystem)

### DataService

### [Scene](frontend/src/components/scene)

- ### [Generator](packages/generator)
- ### [Renderer](packages/renderer)

### [Backend](backend)
