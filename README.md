# INSTA POSTS ARCHIVE

Samodzielne, statyczne archiwum postów Instagram THE BOYZ, gotowe do publikacji jako GitHub Pages. Dane są pobierane z publicznego folderu Google Drive i dzielone według członka, roku oraz miesiąca zapisanego na początku nazwy pliku w formacie `YYMMDD`.

## Zawartość

- profile: Sangyeon, Jacob, Younghoon, Hyunjae, Juyeon, Kevin, Q, Sunwoo i Eric,
- dodatkowa kolekcja `TBZ on Other People’s Profiles (다른 사람 프로필 속 TBZ)`,
- filtrowanie według roku i miesiąca,
- domyślny widok bieżącego miesiąca,
- sortowanie od najnowszej daty,
- obrazy, filmy i audio osadzane z Google Drive,
- automatyczna synchronizacja dwa razy dziennie.

Foldery `CHANHEE (NEW)`, `DOMDU`, `HAKNYEON` i `MORTY` nie są publikowane.

## Uruchomienie lokalne

Wymagany jest Node.js 22 i pnpm.

```bash
pnpm install
pnpm dev
```

Kompilacja produkcyjna:

```bash
pnpm build
```

## Publikacja jako GitHub Pages

1. Utwórz puste repozytorium GitHub o nazwie `INSTA-POSTS-ARCHIVE`.
2. Połącz folder lokalny z repozytorium:

   ```bash
   git remote add origin https://github.com/TWOJ_LOGIN/INSTA-POSTS-ARCHIVE.git
   git push -u origin main
   ```

3. W GitHub otwórz `Settings → Pages`.
4. W `Build and deployment` wybierz `Source → GitHub Actions`.
5. Workflow `Deploy GitHub Pages` zbuduje i opublikuje katalog `dist`.

Strona będzie dostępna pod adresem:

```text
https://TWOJ_LOGIN.github.io/INSTA-POSTS-ARCHIVE/
```

## Automatyczna synchronizacja Google Drive

1. Udostępnij główny folder Drive jako `Każda osoba mająca link → Wyświetlający`.
2. W Google Cloud włącz `Google Drive API` i utwórz klucz API.
3. W repozytorium GitHub otwórz `Settings → Secrets and variables → Actions`.
4. Dodaj sekret:

   ```text
   GOOGLE_DRIVE_API_KEY
   ```

5. W zakładce `Actions` uruchom ręcznie workflow `Sync Instagram Posts`.

Workflow działa codziennie o `05:17` i `17:17` UTC. Jeśli wykryje zmiany, aktualizuje `app/data/archive.generated.json`, wykonuje commit i automatycznie uruchamia ponowną publikację GitHub Pages.

## Źródło danych

[Folder INSTA POSTS ARCHIVE na Google Drive](https://drive.google.com/drive/folders/18x3sDWTEUpoZVWT3sHc1Q0oWqgXCmc1G)
