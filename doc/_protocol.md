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

### 1. Verbindungsanfrage zum Server

Die Verbindung wird mit einem Client-Aufruf von ``ws://localhost:8080/ws`` automatisch angefragt, sobald ein User die
Seite betritt.

| Sender    | Receiver | Event   |
|-----------|----------|---------|
| Client[1] | Server   | CONNECT |

```
CONNECT
accept-version:1.0, 1.1, 1.2
heart-beat: 10000, 10000
```

### 2. Verbindungsbestätigung von Server

Der Server antwortet dem Client enstprechend mit einer CONNECTED-Nachricht.

| Sender | Receiver  | Event   |
|--------|-----------|---------|
| Server | Client[1] | CONNECT |

```
CONNECTED
version:1.2
heart-beat: 0, 0
```

### 3. Beenden der Verbindung

Das Beenden einer Verbindung wird über das Framework verwaltet. Dies, weil eine Verbindung durch explizites Beenden,
aber auch durch sonstige Verbindungsabbrüche (z.B. Schliessen des Clients) geschlossen werden kann.

## Topic: User

Mit diesem Topic wird kommuniziert, welche User sich auf der Seite befinden und ob diese bereit für ein Spiel sind.  
Es handelt sich hier also um Broadcasting.

### 1. Client sendet Subscribe-Anfrage für die Userliste

Die Websocket wird «abonniert», der Client wird somit automatisch vom Server über Änderungen informiert.

| Sender    | Receiver | Event     |
|-----------|----------|-----------|
| Client[1] | Server   | SUBSCRIBE |

```
SUBSCRIBE
id:sub-1
destination: /user/topic/user
```

### 2. Client sendet Join-Anfrage für die Userliste

Der Client teilt dem Server mit, dass er der Seite beitritt.  
Der Server weiss damit, dass er dem neuen User die aktuelle Liste der bereits verbundenen User sendet.

| Sender    | Receiver | Event |
|-----------|----------|-------|
| Client[1] | Server   | SEND  |

```
SEND
destination:/app/user/join
```

### 3. Server antwortet mit den verbundenen Usern

Betritt oder verlässt ein User die Seite, werden alle anderen User darüber informiert.  
Der Client kann die Liste verwenden, um die für ein Spiel verfügbaren User darzustellen oder ggf. eine Highscore
anzuzeigen.

- ``users``: die Liste der verbundenen User
- ``id``: die ID eines Users (wird ggf. später durch einen Nicknamen ersetzt)
- ``score``: der aktuelle Punktestand des Users seit dem Verbindungsaufbau
- ``available``: Indikator, ob der User gerade für ein Spiel verfügbar ist

| Sender | Receiver  | Event   |
|--------|-----------|---------|
| Server | Client[n] | MESSAGE |

```
MESSAGE
destination:/user/topic/user
content-type: application/json
subscription: sub-1
message-id: c7ad795a-3c66-4715-b999-db9f2838a400-6
content-length: 174
```

```json
{
  "users": [
    {
      "id": 190,
      "score": 0,
      "available": true
    }
  ]
}
```

## Topic: GameRequest

Mit diesem Topic wird kommuniziert, wie ein Spiel initiiert werden soll.

### 1. Client sendet Subscribe-Anfrage für die Spielanfrage

Die Websocket wird «abonniert», der Client wird somit automatisch vom Server über Änderungen informiert.

| Sender    | Receiver | Event     |
|-----------|----------|-----------|
| Client[1] | Server   | SUBSCRIBE |

```
SUBSCRIBE
id:sub-2
destination: /user/topic/gamerequest
```

### 2. Client sendet Join-Anfrage für die Spielanfragen

Der Client teilt dem Server mit, dass er der über Spielanfragen informiert werden will.

| Sender    | Receiver | Event |
|-----------|----------|-------|
| Client[1] | Server   | SEND  |

```
SEND
destination:/app/gamerequest/join
```

### 3. Client schickt Spielanfrage

Der Client kann nun entweder einen anderen User oder die KI auswählen und eine Spielanfrage senden.

- ``senderId``: die ID des anfragenden Users
- ``partnerId``: die ID des angefragten Gegners
- ``partnerIsAi``: Indikator, ob der Gegner eine KI ist

| Sender    | Receiver | Event |
|-----------|----------|-------|
| Client[1] | Server   | SEND  |

```
SEND
destination:/app/gamerequest/start
content-length: 235
```

```json
{
  "senderId": "190",
  "partnerId": "7",
  "partnerIsAi": false
}
```

### 4. Server informiert über die Einladung

Erhält ein User eine Einladung, wird im die ID des Einladenden übermittelt. Der Client hat damit das Signal, das Spiel
zu initialisieren.

- ``partnerId``: die ID des angefragten Gegners
- ``gameId``: die ID des initialisierten Spiels

| Sender | Receiver  | Event   |
|--------|-----------|---------|
| Server | Client[n] | MESSAGE |

```
MESSAGE
destination:/user/topic/gamrequest
content-type: application/json
subscription: sub-2
message-id: c7ad795a-3c66-4715-b999-db9f2838a400-6
content-length: 174
```

```json
{
  "partnerId": "7",
  "gameId": "35"
}
```

## Topic: Game

Mit diesem Topic findet die Kommunikation während einem Spiel statt.  
Involviert sind nur die menschlichen Teilnehmer des spezifischen Spiels. Die KI kommuniziert direkt mit dem Server.

### 1. Client sendet Subscribe-Anfrage für das Spiel

Die Websocket wird «abonniert», der Client wird somit automatisch vom Server über Änderungen informiert.

| Sender    | Receiver | Event     |
|-----------|----------|-----------|
| Client[1] | Server   | SUBSCRIBE |

```
SUBSCRIBE
id:sub-3
destination: /user/topic/game
```

### 2. Client sendet Join-Anfrage für die Spielkommunikation

Der Client teilt dem Server mit, dass er der über den Spielstatus informiert werden will.

| Sender    | Receiver | Event |
|-----------|----------|-------|
| Client[1] | Server   | SEND  |

```
SEND
destination:/app/game/join
```

### 3. Client schickt Nutzereingaben

Der User kann das Spiel nun mit Tastatureingaben steuern. Er sendet die Eingaben an den Server.

- ``gameID``: die ID des laufenden Spiels
- ``senderId``: die ID des sendenden Users
- ``commands``: eine Liste der Befehle (es können mehrere Tasten gleichzeitig gedrückt werden)
- ``key``: Taste
- ``event``: Signal der Taste (z.B. gedrückt halten, loslassen)

| Sender    | Receiver | Event |
|-----------|----------|-------|
| Client[1] | Server   | SEND  |

```
SEND
destination:/app/game/command
content-length: 235
```

```json
{
  "gameID": "35",
  "senderId": "190",
  "commands": [
    {
      "key": "ARROW_RIGHT",
      "event": "KEY_PRESSED"
    }
  ]
}
```

### 4. Server antwortet mit dem Spielstatus

Der Server berechnet zentral den aktuellen Status des Spiels und informiert alle Clients entsprechend.  
Sobald der Timer abgelaufen ist, erhält der Client damit das Signal zum Beenden des Spiels. Danach wird der Gewinner
ausgewiesen und die Spieler wieder in die Lobby zurückgeleitet.

- ``gameID``: die ID des laufenden Spiels
- ``level``: die Tilemap des Levels (ggf. später clientseitig replizieren und via ID übergeben)
- ``timer``: der synchronisierte Stand des Timers in Sekunden
- ``player1``: der herausfordernde Spieler
- ``player2``: der eingeladene Spieler
- ``brush``: der Pinsel
- ``id``: die ID des Spielers
- ``x``: die x-Position
- ``y``: die y-Position
- ``state``: der Status eines Objektes, codiert als Integer (z.B. springend)
- ``orientation``: die Richtung Objektes, codiert als Integer (z.B. nach rechts orientiert)
- ``hasBrush``: Indikator, ob ein Spieler im Besitz des Pinsels ist
- ``score``: der Punktestand des Spielers
- ``color``: die Farbe, in der ein Spieler malt
- ``paintedArea``: die Fläche, die der Spieler bereits bemalt hat

| Sender | Receiver  | Event   |
|--------|-----------|---------|
| Server | Client[n] | MESSAGE |

```
MESSAGE
destination:/user/topic/game
content-type:application/json
subscription:sub-3
message-id:c7ad795a-3c66-4715-b999-db9f2838a400-6
content-length:174
```

```json
{
  "gameID": "35",
  "level": [ [ 0, 1, 0, 0 ], [ 1, 1, 0, 0 ], [ 0, 1, 0, 0 ], [ 1, 0, 0, 0 ] ],
  "timer": 59,
  "player1": {
    "id": 190,
    "x": 2,
    "y": 3,
    "state": 4,
    "orientation": LEFT,
    "hasBrush": false,
    "score": 5,
    "color": "FFFFFF",
    "paintedArea": [ [ 0, 1, 0, 0], [ 1, 1, 0, 0], [ 0, 1, 0, 0], [ 1, 0, 0, 0 ] ]
  },
  "player2": {
    "id": 7,
    "x": 1,
    "y": 0,
    "state": 8,
    "orientation": LEFT,
    "hasBrush": false,
    "score": 0,
    "color": "000000",
    "paintedArea": [ [ 0, 0, 0, 0], [ 0, 0, 0, 0], [ 0, 0, 0, 0], [ 0, 0, 1, 0 ] ]
  },
  "brush": {
    "x": 0,
    "y": 0,
    "state": 1
  }
}
```
