# Dokumentace k aplikaci 1010

## Základní funkční požadavky

1. **Herní plocha**: Pole 10x10, na které se umisťují herní bloky.
2. **Bloky**: Různě tvarované bloky (podobné Tetrisu), které se generují náhodně.
3. **Herní mechanika**:
   - Hráč umisťuje bloky na pole s cílem vytvořit plné řádky nebo sloupce.
   - Plné řádky/sloupce mizí a přidávají hráči body.
4. **Konec hry**: Hra končí, pokud není možné umístit žádný z dostupných bloků.
5. **Uživatelské rozhraní**: Jednoduché a intuitivní.
6. **Ukládání výsledků**: Možnost uložit a zobrazit výsledky.
7. **Platforma**: Webová aplikace dostupná na PC i mobilních zařízeních.

---

## Funkční specifikace

### Datový konceptuální model

- **Entita: Hra**:

  - ID hry
  - Datum a čas zahájení hry
  - Skóre
  - Stav herní pole

- **Entita: Blok**:

  - Typ bloku (tvar)
  - Počet použití v herní části

### Charakteristika funkčností aplikace

- **Herní mechanika**:

  - Generování náhodných bloků.
  - Kontrola možnosti umístění bloku na pole.
  - Počítání bodů za kompletní řádky a sloupce.
  - Detekce konce hry.

- **Ukládání výsledků**:

  - Možnost uložit výsledek po ukončení hry.
  - Zobrazení žebříčků her.

- **Nastavení hry**:

  - Možnost resetu herní plochy.

### Specifikace uživatelských rolí a oprávnění

- **Hráč**:
  - Spuštění nové hry.
  - Spuštění nedokončené hry.
  - Ukládání skóre.
  - Prohlížení historie her.

### Uživatelské grafické rozhraní a jeho funkčnosti

1. **Hlavní obrazovka**:

   - Tlačítko "Nová hra".
   - Tlačítko "Pokračovat".
   - Zobrazení aktuálního nejvyššího skóre a nejlepších výsledků.

2. **Herní obrazovka**:

   - Herní pole 10x10.
   - Tři dostupné bloky k umístění.
   - Tlačítko "Reset".

3. **Obrazovka žebříčků**:

   - Seznam nejlepších hráčů s body.

4. **Grafické návrhy**:

   - Herní pole znázorněné jako mřížka 10x10 s barevnými bloky.
   - Bloky znázorněné jako tlačítka nebo drag-and-drop prvky.

---

## Technické řešení

### Datový logický model

- Tabulky v databázi:
  - **Hráč** (ID, jméno, nejvyšší skóre).
  - **Hra** (ID hry, ID hráče, datum, skóre, stav herního pole).
  - **Blok** (ID, typ, pozice v herním poli).

### Popis architektury a jejích částí

1. **Frontend**:

   - Technologie: HTML, CSS, JavaScript.

2. **Databáze**:

   - Technologie: IndexedDB v rámci prohlížeče.
   - Funkce: Ukládání dat o hráčích, historii her a stavů.

### Popis tříd

- **Třída: Hráč**:

  - Atributy: ID, jméno, nejvyšší skóre.
  - Metody: ulozitSkore(), zobrazitHistorii().

- **Třída: Hra**:

  - Atributy: ID hry, stav pole, aktuální skóre.
  - Metody: generovatBloky(), kontrolovatPole(), ukoncitHru().

- **Třída: Blok**:

  - Atributy: Typ, pozice na herním poli.
  - Metody: rotovatBlok(), umistitNaPole().

### Použité technologie

- **Frontend**: HTML, CSS, JavaScript.
- **Databáze**: IndexedDB (lokální databáze v prohlížeči).
- **Verzování**: Git, GitHub.
- **Hosting**: kraken.pedf.cuni.cz

### Funkčnosti jednotlivých částí

1. **Frontend**:

   - Zobrazování herního pole a bloků.
   - Interakce uživatele (drag-and-drop, kliknutí).

2. **Databáze**:

   - Ukládání a dotazování dat (např. nejlepší skóre, historie her).