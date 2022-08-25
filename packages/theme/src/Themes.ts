import stylesToJSON from './stylesToJSON';
import styles from './themes.module.scss';

export const themes = stylesToJSON(styles);
export const themeNames = Object.keys(themes);
