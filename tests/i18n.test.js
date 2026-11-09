import test from 'node:test';
import assert from 'node:assert/strict';

test('language defaults, switching, preference restoration and localized validation',async()=>{
 const store=new Map();globalThis.localStorage={getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,value)};
 try{
 const i18n=await import('../src/i18n.js?i18n-test');
 assert.equal(i18n.locale,'es');assert.equal(i18n.t('Créer mon compte'),'Crear mi cuenta');assert.match(i18n.translateError('Origine refusée'),/Dirección de acceso rechazada/);
 assert.equal(i18n.t('Programmée'),'Programada');assert.equal(i18n.t('A customer-entered site name'),'A customer-entered site name');
 for(const [language,title,button]of [['en','Language','Create my account'],['fr','Langue','Créer mon compte'],['es','Idioma','Crear mi cuenta'],['nl','Taal','Mijn account aanmaken'],['de','Sprache','Mein Konto erstellen']]){
 i18n.saveLanguage(language);assert.equal(i18n.locale,language);assert.equal(store.get('aq-language'),language);assert.match(i18n.languagePicker(),new RegExp(title));assert.equal(i18n.t('Créer mon compte'),button);
 }
 i18n.saveLanguage('invalid');assert.equal(i18n.locale,'de');
 i18n.saveLanguage('en');const restored=await import('../src/i18n.js?restoration-test');assert.equal(restored.locale,'en');assert.equal(restored.translateError('Champ obligatoire : name'),'Required field: name');
 store.set('aq-language','invalid');const fallback=await import('../src/i18n.js?fallback-test');assert.equal(fallback.locale,'es');
 }finally{delete globalThis.localStorage}
});
