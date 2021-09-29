# Gulp 4

Tato nova verzia gulpu je urcena pre microsity postavene hlavne na HTML. Tento navod popisuje ake tasky sa daju pouzit, ako pracuju a na co su urcene.
<br/>

## Struktura

```bash
src/
.gitignore
gulpfile.js
package-lock.json
package.json
README.md
```

## Instalacia

Vsetky balicky nainstalujeme klasicky pomocou npm

```bash
npm i
```
Po nainstalovani sa automaticky spusti gulp a watcher.

V pripade, ak je potrebne mat subor typu PHP a nie HTML, tak je potrebne v gulpfile zmenit premennu php na true.
<br/><br/>

## Tasky

### Dev
```bash
gulp
```
Task spracuje a prekopiruje styly, skripty, obrazky atd. do priecinka dist. Styly sa neminifikuju a nepouzivaju sa prefixy. Javascript je mozne pisat podla standardov ES6.
<br/><br/>

```bash
gulp watch
```
Na spustenie watchera rucne pouzijeme tento task avsak az po spusteni tasku gulp. Watcher funguje iba ak sa projekt vyvija na disku PC a nie na virtualnom disku.
<br/><br/>

```bash
gulp --rebuild
```
Tento task vymaze obsah priecinka dist a nanovo nakopiruje a spracuje styly, skripty atd. Nie je to spracovane na produkcnu verziu!
<br/><br/>

### Production
```bash
gulp --prod
```
Pri vypustani sa styly precistia od nepotrebnych classov, minifikuju, pridaju sa prefixy, transpiluju sa skripty do standardov ES5. Obrazky sa nekomprimuju! Je potrebne ich rucne komprimovat napriklad cez [tinypng](https://tinypng.com/). Subory ako .manifest.json sa nekopiruju. Je potrebne ich rucne prekopirovat.
<br/>

Po dokonceni tasku je dist pripraveny na vypustenie.
<br/><br/>

## Pluginy
Defaultne su nainstalovane pluginy ako slick, lightgallery, aos, malihu-custom-scrollbar-plugin, grid z bootstrapu 4 a jquery. Pozadovane skripty a obrazky pluginu je potrebne odkomentovat v gulpfile a jeho styly v style.scss. <br />
Na obrazky, ktore nie su hned viditelne, sa moze pouzit lazyload.
```html
<!-- default -->
<img src="obrazok.jpg" alt="Obrazok">

<!-- lazyload -->
<img data-src="obrazok.jpg" alt="Obrazok" class="lazyload">
```
<br/>

## Issues
V pripade najdenia inych bugov, nahlasit autorovi.
<br/><br/>
----------------------------------------------------- <br/>
Ak po prejdeni tasku gulp --prod ho znova spustime, tak je potrebne skontrolovat velkost CSS. Niekedy sa stane, ze task sa nevykona spravne. Vyriesit sa to da tak, ze spustime task gulp a potom gulp --prod alebo spustime znova gulp --prod.
<br/>
----------------------------------------------------- <br/><br/>


## Autor
Vytvoril Ondrej Stefanko