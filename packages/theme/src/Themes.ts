import styles from './themes.module.scss';
import stylesToJSON from './stylesToJSON';

export const themes = stylesToJSON(styles);
export const themeNames = Object.keys(themes);
