# Protokoll

Die Kommunikation soll über ein menschenlesbares Webservice-Protokoll stattfinden. Diese Variante ist konzeptuell
sinnvoll, weil zu Beginn eine Verbindung aufgebaut und über das ganze Spiel erhalten werden kann.  
Die Kommunikationsströme werden dabei in mehrere, domänenspezifische Streams (sogenannte Topigs) aufgeteilt.

## Inhalt

1. [Webservice-Verbindung](#webservice-verbindung)
2. [Topic: Game betreten](#game-betreten)
3. [Topic: GameRequest](#topic-gamerequest)
4. [Topic: Game](#topic-game)

## Webservice-Verbindung

Im folgenden Abschnitt wird das übergeordnete Handling der Webservice-Schnittstelle beschrieben.

### 1. Server benachrichtigt Client, dass Websocket geöffnet ist

Die Verbindung wird mit einem Client-Aufruf von ``ws://localhost:8080/ws`` automatisch angefragt, sobald ein User die
Seite betritt.

| Sender    | Receiver | Event   |
|-----------|----------|---------|
| Server | Client[1]   | CONNECT |

```
o
```
### 2. Verbindungsanfrage zum Server

Der Client macht eine Subscribe-Anfrage an den Server

| Sender    | Receiver | Event   |
|-----------|----------|---------|
| Client[1] | Server   | CONNECT |

```
[
  "{"type":"subscribe","data":["13f5bf22-931c-4c42-ace4-e00da7dfd452","playerName"]}"
]
```

### 3. Verbindungsbestätigung von Server

Der Server antwortet dem Client enstprechend mit einer CONNECTED-Nachricht.

| Sender | Receiver  | Event   |
|--------|-----------|---------|
| Server | Client[1] | CONNECT |

```
[
    "{"msgType":"subscriber","data":["13f5bf22-931c-4c42-ace4-e00da7dfd452","test"]}
]
```

### 4. Beenden der Verbindung

Das Beenden einer Verbindung wird über das Framework verwaltet. Dies, weil eine Verbindung durch explizites Beenden,
aber auch durch sonstige Verbindungsabbrüche (z.B. Schliessen des Clients) geschlossen werden kann.

## Topic: Game betreten
Mit diesem Topic kann ein Spiel erstellt werden oder einem Spiel beigtreten werden.

### 1. Game eröffnen

Der User fragt an, welche Spiele offen sind.

| Sender    | Receiver | Event   |
|-----------|----------|---------|
| Client[1] | Server   | CONNECT |

```
[
  {"type":"createOpenGame","data":["167fb8db-88f1-4f11-b8b5-a03bd6d482a9"]}
]
```

### 2. Gameliste erhalten

Der User hat einsicht in die aktuellen Spiele.

| Sender    | Receiver | Event   |
|-----------|----------|---------|
| Server | Client[1]   | CONNECT |

```
[
  {"type":"openGames","data":"[
    {"id": "167fb8db-88f1-4f11-b8b5-a03bd6d482a9","creator": 
    {"id": "13f5bf22-931c-4c42-ace4-e00da7dfd452" ,"name": "test"},
    "secondPlayer": null }
    ]"}
]
```

### 3. Der Spieler startet ein Spiel mit einer KI

Der User wählt "Spiel mit AI starten".

| Sender    | Receiver | Event   |
|-----------|----------|---------|
| Client[1] | Server   | CONNECT |

```
[
  {"type":"startGame","data":[]}
]
```

### 4. Server sendet Signal zum Spielstart

Der Server informiert die teilnehmenden Spieler über den Spielstart und startet sogleich das Spiel.

| Sender    | Receiver | Event   |
|-----------|----------|---------|
| Server | Client[n]   | CONNECT |

```
[
  {"type":"openGames","data":"[]"}
]
```


## Topic: Game

Mit diesem Topic werden die Spieldaten ausgetauscht.

### 1. Client erhält in einem festgelegten Takt die Angaben zum Spielstatus

Die Websocket wird «abonniert», der Client wird somit automatisch vom Server über Änderungen informiert.

| Sender    | Receiver | Event     |
|-----------|----------|-----------|
| Server | Client[n]   | SUBSCRIBE |

```
a[
    {
        "msgType":"runningGame",
        "data":
            {
                "id": "167fb8db-88f1-4f11-b8b5-a03bd6d482a9" ,
                 "level": "ONE" ,
                  "characters": [
                    {
                        "id": "you", 
                        "color": "red", 
                        "width": 10.0, 
                        "height": 28.0, 
                        "x": 16.0, 
                        "y": 180.0, 
                        "score": 0, 
                        "state": "IDLE", 
                        "orientation": "FACE"
                    },
                    {
                        "id": "dummy-player", 
                        "color": "purple", 
                        "width": 10.0, 
                        "height": 28.0, 
                        "x": 200.0, 
                        "y": 180.0, 
                        "score": 0, 
                        "state": "IDLE", 
                        "orientation": "FACE"
                    },
                    {
                        "id": "npc1", 
                        "color": "pink", 
                        "width": 6.0, 
                        "height": 4.0, 
                        "x": 84.24224926483333, 
                        "y": 196.9338166655191, 
                        "state": "FALLING", 
                        "orientation": "LEFT"
                    }
                  ]
            }
    }
]

```

### 2. Client sendet Tastaturbefehle zur Spielsteuerung

Der Client teilt dem Server mit, welche Tasten er zur Spielsteuerung verwendet.

| Sender    | Receiver | Event |
|-----------|----------|-------|
| Client[1] | Server   | SEND  |

```
[
    {
        "type":"keyPress",
        "data":["ArrowUp"]
    }
]
```
