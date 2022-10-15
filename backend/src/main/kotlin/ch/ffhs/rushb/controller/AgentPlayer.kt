package ch.ffhs.rushb.controller

import ch.ffhs.rushb.behavior.Serializable
import ch.ffhs.rushb.model.GameObject

class AgentPlayer(
    character: GameObject, level: Level
) : Agent(character, level), Serializable {
    override fun toJSON(): String {
        return character.toJSON()
    }
}