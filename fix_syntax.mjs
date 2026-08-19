import fs from 'fs';

let content = fs.readFileSync('src/components/SubscriptionModal.js', 'utf8');
content = content.replace(/\$\{subscriptionToEdit \? '\$\{t\('sub_edit'\)}' : '\$\{t\('sub_add'\)}'\}/g, "${subscriptionToEdit ? t('sub_edit') : t('sub_add')}");
fs.writeFileSync('src/components/SubscriptionModal.js', content);
