git### Užitočné príkazy

|  |  |
| --- | --- |
| `git status` | vypíše aktuálny branch a upravené súbory |
| `git log` | zobrazí postupnosť commitov na aktuálnom branchi - naviguje sa šípkami, odchádza sa `q` |
| `git fetch` | načíta zmeny z remote repozitára - z našeho GitHubu |
| `git pull` | aplikuje zmeny z remote repozitára do aktuálnej branche, ak je to možné bez konfliktov |
| `git reset --hard origin/my_branch` | **bez ohľadu na zmeny** resetuje lokálnu branch do rovnakého stavu, ako je na remote |
| `git checkout -b my_branch` | vytvorí nový lokálny branch *my_branch*, ktorý je založený na vrchu predchádzajúceho branchu a presunie sa do neho |
| `git checkout my_branch` | presunie sa do existujúceho branchu *my_branch* |
| `git add subor1 priecinok1` | označí zmeny na súboroch pre pridanie do commitu |
| `git add -A` | označí všetky zmeny pre pridanie do commitu |
| `git restore subor` | odstráni všetky zmeny na súbore a uvedie ho do pôvodného stavu |
| `git restore --staged subor` | zruší označenie pre pridanie do commitu ale ponechá vytvorené zmeny |
| `git commit -m "Názov commitu"` | zoberie všetky súbory označené pre pridanie a vytvorí nový commit |
| `git commit --amend` | pridá všetky označené súbory do posledného vytvoreného commitu a otvorí editor pre úpravu textu commitu [^1] |
| `git commit --amend --no-edit` | pridá všetky označené súbory do posledného vytvoreného commitu bez editoru textu |
| `git push` | zoberie nové commity a nahrá ich do remote branch |
| `git push --force-with-lease` | nasilu prepíše stav remote branch |
| `git rebase -i origin/master` | zmena základu branchu [^1] |
| `git config --global key "value"` | zmena konfigurácie príkazu git |

[^1]: ak sa ocitnete vo VIM editore tak napísaním `:wq` uložíte zmeny a zavriete editor, `:q` zavriete editor bez uloženia

### Situácie použtia Git-u

- **Nastavenie mena a emailu**
```
git config --global user.email "email@example.com"
git config --global user.name "John Doe"
```

- **Nastavenie skratiek**
```
git config --global alias.s status
git s  # rovnaké ako git status
```

- **Vytvorenie novej branch a pridanie zmien**
```
git fetch                                       # načítať nové zmeny z remote repa
git checkout master                             # zmeniť branch na master, aby bol nový branch na ňom založený
git pull                                        # aplikovať zmeny (ak nejaké sú) do lokálneho master branchu
git checkout -b example_branch                  # vytvorenie nového branchu založeného na masteri
git add -A                                      # označenie všetkých zmien na pridanie do commitu
git commit -m "Add examples"                    # vytvorenie nového commitu
git push --set-upstream origin example_branch   # pushnutie zmien plus vytvorenie remote branche
```

- **Pridanie zmien do existujúceho commitu**
Pre jednoduchosť je dobré mať len jeden commit s jednou oblasťou zmien. Viac commitov komplikuje rebase, reviews a merging.
```
git add -A                      # označenie všetkých zmien na pridanie do commitu
git commit --amend --no-edit    # pridanie zmien do posledného commitu
git status                      # v tomto bodu status povie že lokálny a remote branch majú rozdielne commity a treba ich mergenúť, čo my nechceme
git push --force-with-lease     # nasilu prepíše commit v remote branch
```
- **Rebase po update základnej branch**
Iná zmena bola mergenutá do masteru, čiže je updatenuť základ našeho branchu, aby mohol byť bez problémov mergenutý.
```
git fetch                       # načítať nové zmeny z remote repa
git checkout example_branch     # (ak tam už nie sme) presunúť sa na branch, ktorú chceme updatenuť
git rebase -i origin/master     # začiatok rebase procesu - je potreba vybrať ktoré commity zostanú a ktore sa vyhodia
# ak máme len jeden náš commit, tak ho vyberieme (pick) a všetky ostatné zahodíme (drop) pretože sú duplikátne zo starého masteru
# ak máme viac našich commitov tak je zle a treba porovnávať a zisťovať, ktoré tam patria a ktoré nie
# ak nastane merge konflikt rebase sa pauzne a je ho treba vyriešiť
git status                      # zistenie stavu - ktoré súbory sú v merge konflikte
# treba sa preklikať všetkými súbormi v konflikte a vyriešiť ich - dať ich do takého stavu, aký nám vyhovuje 
git add -A                      # označí súbory ktoré boli v konflikte ako vyriešené
git rebase --continue           # pokračuje v rebase procese, ak máme len jeden commit tak sme hotoví, inak sa pokračuje
git push --force-with-lease     # po úspešnom rebase, nasilu prepíše commit v remote branch
```

### GitHub Pull Requests
Pull Requests sú žiadosti o pridanie (merge) zmien do základného branchu - typicky master ale ak sú zmeny na sebe závislé
môžu by založené na sebe a následne sa v poradí pridávajú do masteru.
- [Vytvorenie PR](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request?tool=webui).
Pri vytváraní je dobré opísať čo zmena obsahuje plus nejaké dôležité detajly.
- [Žiadosť o review](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/requesting-a-pull-request-review)
- [Review](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews)
Review by malo poskytnúť čo najviac členov tímu. **Pre pridanie zmeny je potrebný súhlas najmenej dvoch členov tímu**.
- [Merge](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges)
Po úspešnom pridaní zmeny je treba ešte manuálne vymazať starý branch.
