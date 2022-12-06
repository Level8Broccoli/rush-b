package ch.ffhs.rushb.api

enum class ServerEventTypes(val value: String) {
    OPEN_GAMES("openGames"),
    MESSAGE("message"),
    RUNNING_GAME("runningGame"),
    SESSION_CLOSED("sessionClosed"),
    FINISHED_GAME("gameFinished"),
}