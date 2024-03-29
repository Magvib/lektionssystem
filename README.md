# Lektionssystem

Dette open source projekt er et alternativ til traditionelle lektionssystemer som Lectio.dk. Det er designet til at forbedre interaktionen mellem lærere og elever gennem en brugervenlig, webbaseret platform.

## Funktioner

-   **Sikker Brugerlogning**: Log ind for lærere og elever.
-   **Elev Dashboard**: Elever kan se karakterer, skemaer og profiloplysninger.
-   **Lærer Dashboard**: Oprettelse af hold, tildeling af opgaver og karaktergivning.
-   **Opgavehåndtering**: Elever kan aflevere opgaver online, og lærere kan give feedback og karakterer.

## Teknologi

-   **Frontend**: NextJs
-   **Backend**: Prisma
-   **Database**: SQLite (udvikling), MySql (produktion)
-   **Deployment**: Docker

## Projekt Opsætning

1. **Klon Repositoriet**

    ```
    git clone https://github.com/Magvib/lektionssystem
    ```

2. change directory to the project folder

    ```
    cd lektionssystem
    ```

3. **Installer Dependencies**

    ```
    npm install
    ```

4. **Seed database**

    1. Hvis du vil køre projektet lokalt, skal du først omdøbe filen `.env.example` til `.env` og derefter udfylde de nødvendige felter.
    2. Hvis du ikke har en mysql database, kan du bruge sqlite i stedet. For at gøre dette skal du ind i `prisma/schema.prisma` og ændre `provider` til `sqlite`.

    ```
    npx prisma db push && npx prisma db seed
    ```

5. **Starte Projektet Lokalt**

    ```
    npm run dev
    ```

6. **Bygge og Køre med Docker**
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

Dette projekt er udgivet under [MIT licens](https://opensource.org/licenses/MIT), hvilket betyder at det kan bruges og modificeres frit efter givne betingelser.

---

© Magnus Bjørn Nielsen, 2023.
