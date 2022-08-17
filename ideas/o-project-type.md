# Unified Project Type


When is started plantarium it was only created to work locally and every project was self-contained inside the "PlantProject" type.

Now that there is a server I wrapped that PlantProject type inside another Project type, which is confusing.

The idea is to create one unified type.


```typescript
type Project = {
  id: string;
  public: boolean;
  type: 0 | 1 | 2;
  author: string;
  meta: {

  },
  nodes: {

  }
}
```

## Problem 1 → ID

When the project is created locally we use short id to create an id, when we publish it the server creates an id and we need to replace the local id.
