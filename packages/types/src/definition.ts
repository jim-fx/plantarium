export const PlantProjectDef = {
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
    "PlantProjectMeta": {
      "properties": {
        "author": {
          "type": "string"
        },
        "authorID": {
          "type": "string"
        },
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
        "id": {
          "type": "string"
        },
        "lastSaved": {
          "type": "number"
        },
        "latinName": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "plantariumVersion": {
          "type": "string"
        },
        "public": {
          "type": "boolean"
        },
        "randomSeed": {
          "type": "boolean"
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
        "authorID",
        "id",
        "name"
      ],
      "type": "object"
    }
  },
  "properties": {
    "history": {},
    "meta": {
      "$ref": "#/definitions/PlantProjectMeta"
    },
    "nodes": {
      "items": {
        "$ref": "#/definitions/NodeProps"
      },
      "type": "array"
    }
  },
  "required": [
    "meta",
    "nodes"
  ],
  "type": "object"
}
