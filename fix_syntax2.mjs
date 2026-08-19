import fs from 'fs';

let content = fs.readFileSync('src/components/SubscriptionModal.js', 'utf8');
content = content.replace(/\$\{subscriptionToEdit \? '\$\{t\('sub_save'\)}' : '\$\{t\('sub_add_btn'\)}'\}/g, "${subscriptionToEdit ? t('sub_save') : t('sub_add_btn')}");
fs.writeFileSync('src/components/SubscriptionModal.js', content);
