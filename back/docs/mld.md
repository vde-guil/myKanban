# Liste des tables de l'application

## list
id SERIAL
name TEXT

## card
id SERIAL
title TEXT
position INTEGER
color TEXT
#list_id INTEGER

## label
id SERIAL
name TEXT

## card_has_label
#card_id INTEGER
#label_id INTEGER
