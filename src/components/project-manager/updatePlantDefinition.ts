import defaultPD from "../../assets/defaultPlantDescription.json";
export default function upgradePlant(pd: plantDescription): plantDescription {
  return Object.assign(JSON.parse(JSON.stringify(defaultPD)), pd);
}
