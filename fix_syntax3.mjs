import fs from 'fs';

let content = fs.readFileSync('src/components/SubscriptionModal.js', 'utf8');
content = content.replace("import { createIcons, icons } from 'lucide';\nimport { t } from '../services/i18n.js';", "import { createIcons, icons } from 'lucide';");
fs.writeFileSync('src/components/SubscriptionModal.js', content);
