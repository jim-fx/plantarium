export const ProjectDef = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "NodeAttributes": {
      "description": "Common attributes across all nodes\nshould not have an effect on computing",
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "pos": {
          "$ref": "#/definitions/NodePosition"
        },
        "refs": {
          "items": {
            "$ref": "#/definitions/NodeRef"
          },
          "type": "array"
        },
        "type": {
          "type": "string"
        },
        "visible": {
          "items": {
            "type": "string"
          },
          "type": "array"
        }
      },
      "required": [
        "id",
        "type"
      ],
      "type": "object"
    },
    "NodePosition": {
      "properties": {
        "x": {
          "type": "number"
        },
        "y": {
          "type": "number"
        }
      },
      "required": [
        "x",
        "y"
      ],
      "type": "object"
    },
    "NodeProps": {
      "description": "Serialized version of a node",
      "properties": {
        "attributes": {
          "$ref": "#/definitions/NodeAttributes"
        },
        "state": {}
      },
      "required": [
        "attributes"
      ],
      "type": "object"
    },
    "NodeRef": {
      "properties": {
        "id": {
          "type": "string"
        },
        "in": {
          "type": "string"
        },
        "out": {
          "type": "number"
        }
      },
      "required": [
        "id",
        "in",
        "out"
      ],
      "type": "object"
    },
    "ProjectMeta": {
      "properties": {
        "class": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "family": {
          "type": "string"
        },
        "gbifID": {
          "type": "number"
        },
        "name": {
          "type": "string"
        },
        "plantariumVersion": {
          "type": "string"
        },
        "randomSeed": {
          "type": "boolean"
        },
        "scientificName": {
          "type": "string"
        },
        "seed": {
          "type": "number"
        },
        "thumbnail": {
          "type": "string"
        },
        "transform": {
          "properties": {
            "s": {
              "type": "number"
            },
            "x": {
              "type": "number"
            },
            "y": {
              "type": "number"
            }
          },
          "required": [
            "s",
            "x",
            "y"
          ],
          "type": "object"
        }
      },
      "required": [
        "name"
      ],
      "type": "object"
    }
  },
  "properties": {
    "author": {
      "type": "string"
    },
    "createdAt": {
      "format": "date-time",
      "type": "string"
    },
    "history": {},
    "id": {
      "type": "string"
    },
    "likes": {
      "items": {
        "type": "string"
      },
      "type": "array"
    },
    "meta": {
      "$ref": "#/definitions/ProjectMeta"
    },
    "nodes": {
      "items": {
        "$ref": "#/definitions/NodeProps"
      },
      "type": "array"
    },
    "public": {
      "type": "boolean"
    },
    "type": {
      "type": "number"
    },
    "updatedAt": {
      "format": "date-time",
      "type": "string"
    }
  },
  "required": [
    "createdAt",
    "id",
    "likes",
    "meta",
    "nodes",
    "public",
    "type",
    "updatedAt"
  ],
  "type": "object"
}
