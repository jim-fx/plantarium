import type { Project } from "@plantarium/types";
import { ProjectDef } from "@plantarium/types/definition";
import Ajv from "ajv";
import addFormats from 'ajv-formats';

export function minLength(l: number, err?: string) {
  return (s: string) => {
    if (s.length < l) return [err || `${l - s.length} too short`];
  }
}

export function maxLength(l: number, err?: string) {
  return (s: string) => {
    if (s.length > l) return [err || `${s.length - l} too long`];
  }
}

export function isEmail(err = "Does not appear to be an email") {
  return (s: string) => {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(s)) {
      return []
    } else {
      return [err]
    }
  }

}

export const email = [isEmail()]

export function containsLowerCase(err = "Must contain lower case") {

  const regex = new RegExp(/(.*[a-z].*)/);

  return (s: string) => {
    if (regex.test(s)) {
      return []
    } else {
      return [err]
    }
  }
}

export function containsUpperCase(err = "Must contain uppercase") {
  const regex = new RegExp(/(.*[A-Z].*)/);

  return (s: string) => {
    if (regex.test(s)) {
      return []
    } else {
      return [err]
    }
  }
}


export function containsSpecialCharacter(err = "Must contain a special character like -+_!@#$%^&*.,?") {
  const regex = new RegExp(/.*[-+_!@#$%^&*.,?].*/);

  return (s: string) => {
    if (regex.test(s)) {
      return []
    } else {
      return [err]
    }
  }
}


export function containsNumber(err = "Must contain a number") {

  const regex = new RegExp(/(.*\d.*)/);

  return (s: string) => {
    if (regex.test(s)) {
      return []
    } else {
      return [err]
    }
  }

}

const ajv = new Ajv()
addFormats(ajv)

const schema = {
  ...ProjectDef,
  additionalProperties: false
}
const validate = ajv.compile(schema)

export function isPlantProject(s: Project): string[] | undefined {

  if (typeof s === "string") {
    try {
      s = JSON.parse(s)
    } catch (error) {
      return ["Not valid json"]
    }
  }

  if (typeof s === "object") {
    if (validate(s)) {
      return;
    } else {
      return validate.errors.map((e) => (typeof e === 'string' ? e : e.message))
    }
  }

  return ["Not a valid object"]
}


export const username = [minLength(3), maxLength(32)]

export const password = [minLength(8), containsNumber(), containsSpecialCharacter(), containsUpperCase(), containsLowerCase(), maxLength(32)];
