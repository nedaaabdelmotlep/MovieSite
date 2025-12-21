# MovieSite Database

## Structure
- **Users**: stores user info and roles
- **Movies**: main movie info
- **Genres**: movie categories
- **Actors**: actors info
- **Reviews**: user reviews for movies
- **Favorites**: watchlist for users
- **Movie_Genres / Movie_Actors**: many-to-many relationship tables

## SQL Files
1. 01_schema.sql → create database
2. 02_tables.sql → main tables
3. 03_relations.sql → relationships & FKs
4. 04_seed.sql → initial test data
