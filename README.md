## Źródło danych

[Folder INSTA POSTS ARCHIVE na Google Drive](https://drive.google.com/drive/folders/18x3sDWTEUpoZVWT3sHc1Q0oWqgXCmc1G)

## OFFICIAL_THEBOYZ

Kafelek nad TBZ ON OTHER PEOPLE’S PROFILES pobiera media z folderu https://drive.google.com/drive/folders/1yveWb6H9nRlutNZiuv5H9RXKuvnFGM8b i wszystkich podfolderów. Początkowy indeks zawiera 312 plików (14.10.2026).

Widok odwzorowuje twitter-media-main: wyszukiwanie daty i członków, wszystkie lata lub wybrany rok, wielokrotny wybór członków (dopasowanie wszystkich wybranych), Group photo, domyślnie najnowsze media, opcjonalnie najstarsze, 30 wyników na stronę oraz podgląd zdjęć ze strzałkami, klawiaturą i gestami. Brak filtra kont.

Istniejący workflow sync-drive.yml aktualizuje obie kolekcje przez GOOGLE_DRIVE_API_KEY. Można uruchomić go ręcznie po wgraniu zmian do GitHub.
## OTHER i automatyczne wdrożenie

OTHER jest ostatnim filtrem w OFFICIAL_THEBOYZ. Dopasowuje słowo Other w nazwie pliku bez względu na wielkość liter; nazwa podfolderu nie dodaje tej kategorii.

Synchronizacja działa według dotychczasowego harmonogramu 05:17 i 17:17 UTC oraz ręcznie przez Actions → Sync Instagram Posts → Run workflow. Odczytuje wszystkie strony i podfoldery, ponawia błędy sieci i limity API, zapisuje indeks dopiero po kompletnym odczycie. Nowe pliki pojawią się przy najbliższej synchronizacji. Plik dodany podczas odczytu może trafić do następnego przebiegu. Brak zmian w zawartości nie powoduje nowego commitu ani wdrożenia.

Po zapisie i pushu indeksu workflow bezpośrednio wywołuje Deploy GitHub Pages przez workflow_call, z identyfikatorem zapisanego commitu. Nie polega na zdarzeniu push wykonanym przez GITHUB_TOKEN. Oddzielne grupy concurrency kolejkują synchronizacje i wdrożenia bez anulowania trwającego przebiegu. Push ponawiany jest po pobraniu najnowszego main i rebase.

W repozytorium wymagany jest secret GOOGLE_DRIVE_API_KEY z dostępem do Google Drive API, publiczny odczyt folderów i Settings → Pages → Source: GitHub Actions. Reguły ochrony main muszą zezwalać botowi na zapis indeksu. Te ustawienia nie są częścią ZIP. Błędy uprawnień są zgłaszane i zachowują poprzedni indeks zamiast publikowania niekompletnej kolekcji.

## MGMT COMAPNIES

Kafelek bezpośrednio pod OFFICIAL_THEBOYZ. Źródło: https://drive.google.com/drive/folders/1RTg8YVRwp0vTVibigF23aMVYExe7u_tT . Indeks początkowy: 194 media w 7 podfolderach (22.10.2026). Filtr FOLDER odwzorowuje bezpośrednie podfoldery źródła, uwzględniając media z ich dalszych podfolderów. Dostępny jest filtr YEAR, wyszukiwanie daty/nazwy oraz sortowanie NEWEST FIRST (domyślne) i OLDEST FIRST. Nowe podfoldery są wykrywane przez synchronizację automatycznie. Galeria korzysta z tego samego widoku i podglądu co OFFICIAL_THEBOYZ. Synchronizacja i automatyczny deployment obejmują nową kolekcję bez dodatkowego workflow ani sekretu.
