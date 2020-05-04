import './index.scss';
import './themes.scss';

import './setupUI';

import { ProjectManager, settingsUI, nodeUI, Scene } from 'components';

/*
                     +-----------+
                     |DataService|
                     +-----+-----+   Scene
                          |          -----------------
+----------+              ^          \  +---------+  \
|NodeSystem|              |          \  |Generator|  \
+------------->  +---------+-------> \  +----+----+  \
                 |ProjectManager|    \       |       \
+------------->  +-----------------> \  +----+---+   \
|SettingsUI|                         \  |Renderer|   \
+----------+                         \  +--------+   \
                                     -----------------
*/

const projectManager = new ProjectManager(nodeUI, settingsUI);

new Scene(projectManager);
