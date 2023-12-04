# Lektionssystem

Dette open source projekt er et alternativ til traditionelle lektionssystemer som Lectio.dk. Det er designet til at forbedre interaktionen mellem lærere og elever gennem en brugervenlig, webbaseret platform.

## Funktioner

-   **Sikker Brugerlogning**: Separat log ind for lærere og elever.
-   **Elev Dashboard**: Elever kan se karakterer, skemaer og profiloplysninger.
-   **Lærer Dashboard**: Oprettelse af hold, tildeling af opgaver og karaktergivning.
-   **Opgavehåndtering**: Elever kan aflevere opgaver online, og lærere kan give feedback og karakterer.

## Teknologi

-   **Frontend**: NextJs
-   **Backend**: Prisma
-   **Database**: SQLite
-   **Deployment**: Docker

## Projekt Opsætning

1. **Klon Repositoriet**
   git clone [URL til dit repository]

2. **Installer Dependencies**
   npm install

3. **Starte Projektet Lokalt**
   npm run dev

4. **Bygge og Køre med Docker**
   For at bygge og køre projektet ved hjælp af Docker, følg disse trin:

-   Byg Docker Image:
    ```
    docker build -t lektionssystem .
    ```
-   Kør Containeren:
    ```
    docker run -p 3000:3000 lektionssystem
    ```
    Herefter er applikationen tilgængelig på `localhost:3000`.

## Licens

Dette projekt er udgivet under [Specifik licens], hvilket betyder at det kan bruges og modificeres frit efter givne betingelser.

---

© Magnus Bjørn Nielsen, 2023. Alle rettigheder forbeholdes.
