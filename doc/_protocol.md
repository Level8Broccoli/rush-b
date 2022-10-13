# Protokoll

Die Kommunikation soll über ein menschenlesbares Webservice-Protokoll stattfinden. Diese Variante ist konzeptuell
sinnvoll, weil zu Beginn eine Verbindung aufgebaut und über das ganze Spiel erhalten werden kann.  
Die Kommunikationsströme werden dabei in mehrere, domänenspezifische Streams (sogenannte Topigs) aufgeteilt.

## Inhalt

1. [Webservice-Verbindung](#webservice-verbindung)
2. [Topic: User](#topic-user)
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
  "{"type":"subscribe","data":"10"}"
]
```

### 3. Verbindungsbestätigung von Server

Der Server antwortet dem Client enstprechend mit einer CONNECTED-Nachricht.

| Sender | Receiver  | Event   |
|--------|-----------|---------|
| Server | Client[1] | CONNECT |

```
[
    "{"msgType":"subscriber","data":[{"id":0,"player":null}]}"
]
```

### 4. Beenden der Verbindung

Das Beenden einer Verbindung wird über das Framework verwaltet. Dies, weil eine Verbindung durch explizites Beenden,
aber auch durch sonstige Verbindungsabbrüche (z.B. Schliessen des Clients) geschlossen werden kann.

## Topic: User

Mit diesem Topic wird kommuniziert, welche User sich auf der Seite befinden und ob diese bereit für ein Spiel sind.  
Es handelt sich hier also um Broadcasting.
// TODO

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
        "msgType":"game",
        "data":
            {
                "id": "game 0" ,
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
