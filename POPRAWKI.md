# Poprawki widoku mobilnego

- OFFICIAL_THEBOYZ: nazwa kafelka zawija się po podkreśleniu i mieści się w dostępnej szerokości.
- Wspólny komponent MediaTile dla profili członków i OFFICIAL_THEBOYZ.
- Te same kolumny galerii, proporcje zdjęć, lazy loading oraz porcje po 28 plików; na telefonie jedna kolumna.
- Filmy w OFFICIAL_THEBOYZ: miniaturka i przycisk otwierający odtwarzacz Google Drive w nowej karcie. Przycisk działa również, gdy miniaturka jest niedostępna.
- Zachowano wyszukiwanie oraz filtry roku i członków w OFFICIAL_THEBOYZ.
- Zaktualizowano dist do publikacji.

Weryfikacja: pnpm test — kompilacja TypeScript, build Vite i 6 testów zakończone pomyślnie. Nie wykonano ręcznego testu w przeglądarce ani odtwarzania plików na Google Drive. Build zgłasza ostrzeżenie o dużym pakiecie JS zawierającym dane archiwum.

- OFFICIAL_THEBOYZ: data RRMMDD jest wyświetlana po lewej stronie paska z VIEW i DOWNLOAD dla każdego rodzaju medium.
