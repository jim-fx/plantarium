import db from "./localStores/dummyDB";
import { expose } from "comlink";
expose(db);
