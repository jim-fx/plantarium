import db from "./localStores/indexedDB";
import { expose } from "comlink";
expose(db);
